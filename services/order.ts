import { createClient } from "@/lib/supabase/server";
import { prepareCheckoutForCurrentUser } from "@/services/checkout";

export const orderCreationSchema = {
  idempotencyKey: (value: unknown) => {
    if (typeof value !== "string") {
      throw new Error("Idempotency key is required.");
    }
    const trimmed = value.trim();
    if (!trimmed) {
      throw new Error("Idempotency key is required.");
    }
    return trimmed;
  },
  cartRevision: (value: unknown) => {
    if (value === undefined) return undefined;
    if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
      throw new Error("Cart revision is invalid.");
    }
    return value;
  },
};

export type OrderRecord = {
  id: string;
  userId: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  total: number;
  itemCount: number;
  idempotencyKey: string;
  cancellationReason: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
};

function normalizeOrder(row: Record<string, unknown>): OrderRecord {
  return {
    id: String(row.id ?? ""),
    userId: String(row.user_id ?? ""),
    orderNumber: String(row.order_number ?? ""),
    status: String(row.status ?? "pending"),
    paymentStatus: String(row.payment_status ?? "pending"),
    subtotal: Number(row.subtotal ?? 0),
    total: Number(row.total ?? 0),
    itemCount: Number(row.item_count ?? 0),
    idempotencyKey: String(row.idempotency_key ?? ""),
    cancellationReason: typeof row.cancellation_reason === "string" ? row.cancellation_reason : null,
    cancelledAt: typeof row.cancelled_at === "string" ? row.cancelled_at : null,
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
  };
}

export async function createOrderFromCurrentCart(input: { idempotencyKey: string; cartRevision?: number } = { idempotencyKey: "" }): Promise<OrderRecord> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error("You must be logged in.");
  }

  const idempotencyKey = orderCreationSchema.idempotencyKey(input.idempotencyKey);
  const cartRevision = orderCreationSchema.cartRevision(input.cartRevision);

  const preparation = await prepareCheckoutForCurrentUser({ cartRevision });
  if (!preparation.valid || !preparation.canProceed) {
    throw new Error(preparation.errors[0] ?? "Your cart is not valid for checkout.");
  }

  const { data: currentCart, error: cartError } = await supabase
    .from("carts")
    .select("id, revision, user_id")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (cartError) {
    throw new Error("Unable to load your cart.");
  }
  if (!currentCart) {
    throw new Error("Your cart does not exist.");
  }
  if (preparation.cartId !== currentCart.id) {
    throw new Error("Your cart is no longer available for checkout.");
  }
  if (typeof cartRevision === "number" && cartRevision !== currentCart.revision) {
    throw new Error("Your cart has changed. Please refresh and try again.");
  }

  const { data: existingOrder, error: existingOrderError } = await supabase
    .from("orders")
    .select("id, user_id, order_number, status, payment_status, subtotal, total, item_count, idempotency_key, cancellation_reason, cancelled_at, created_at, updated_at")
    .eq("user_id", userData.user.id)
    .eq("idempotency_key", idempotencyKey)
    .maybeSingle();

  if (existingOrderError) {
    throw new Error("Unable to check for an existing order.");
  }
  if (existingOrder) {
    return normalizeOrder(existingOrder);
  }

  const { data: createdOrder, error: createError } = await supabase.rpc("create_order_from_cart", {
    p_cart_id: currentCart.id,
    p_idempotency_key: idempotencyKey,
    p_order_number: null,
  });

  if (createError) {
    throw new Error(createError.message);
  }
  if (!createdOrder) {
    throw new Error("Order creation failed.");
  }

  return normalizeOrder(createdOrder);
}
