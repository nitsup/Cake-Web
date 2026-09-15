import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export const checkoutPreparationSchema = z.object({
  cartRevision: z.number().int().nonnegative().optional(),
});

export type CheckoutPreparationItem = {
  cartItemId: string;
  cakeId: string;
  cakeName: string;
  cakeSlug: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  customization: Record<string, never>;
  valid: boolean;
  errors: string[];
};

export type CheckoutPreparation = {
  cartId: string | null;
  cartRevision: number;
  valid: boolean;
  canProceed: boolean;
  subtotal: number;
  total: number;
  itemCount: number;
  items: CheckoutPreparationItem[];
  errors: string[];
  preparedAt: string;
  currency: "INR";
};

export async function prepareCheckoutForCurrentUser(input: { cartRevision?: number } = {}): Promise<CheckoutPreparation> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error("You must be logged in.");
  }

  const { data: cart, error: cartError } = await supabase
    .from("carts")
    .select("id, revision")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (cartError) {
    throw new Error("Unable to load your cart.");
  }
  if (!cart) {
    return {
      cartId: null,
      cartRevision: 0,
      valid: false,
      canProceed: false,
      subtotal: 0,
      total: 0,
      itemCount: 0,
      items: [],
      errors: ["Your cart does not exist."],
      preparedAt: new Date().toISOString(),
      currency: "INR",
    };
  }

  if (typeof input.cartRevision === "number" && input.cartRevision !== cart.revision) {
    throw new Error("Your cart has changed. Please refresh and try again.");
  }

  const { data: rows, error: itemError } = await supabase
    .from("cart_items")
    .select("id, cart_id, cake_id, quantity, customization")
    .eq("cart_id", cart.id)
    .order("created_at", { ascending: true });

  if (itemError) {
    throw new Error("Unable to load your cart items.");
  }

  const cartItems = rows ?? [];
  if (cartItems.length === 0) {
    return {
      cartId: cart.id,
      cartRevision: cart.revision,
      valid: false,
      canProceed: false,
      subtotal: 0,
      total: 0,
      itemCount: 0,
      items: [],
      errors: ["Your cart is empty."],
      preparedAt: new Date().toISOString(),
      currency: "INR",
    };
  }

  const cakeIds = cartItems.map((item) => item.cake_id);
  const { data: cakes, error: cakeError } = await supabase
    .from("cakes")
    .select("id, name, slug, base_price, sale_price, is_active, availability, category:cake_categories!inner(is_active)")
    .in("id", cakeIds);

  if (cakeError) {
    throw new Error("Unable to validate the cart against the current catalogue.");
  }

  const cakeMap = new Map((cakes ?? []).map((cake) => [cake.id, cake]));
  const items: CheckoutPreparationItem[] = [];
  const errors: string[] = [];
  let subtotal = 0;
  let itemCount = 0;

  for (const row of cartItems) {
    const cake = cakeMap.get(row.cake_id);
    const itemErrors: string[] = [];

    if (!cake) {
      itemErrors.push("Cake no longer exists.");
    }
    if (cake && !cake.is_active) {
      itemErrors.push("Cake is inactive.");
    }
    if (cake && cake.availability !== "available") {
      itemErrors.push("Cake is unavailable.");
    }
    if (cake && !cake.category?.[0]?.is_active) {
      itemErrors.push("Cake category is inactive.");
    }
    if (row.quantity < 1 || row.quantity > 20) {
      itemErrors.push("Quantity is outside the supported range.");
    }
    if (row.customization && JSON.stringify(row.customization) !== "{}") {
      itemErrors.push("Unsupported customization is present.");
    }

    const unitPrice = cake ? Number(cake.sale_price ?? cake.base_price) : 0;
    const lineTotal = unitPrice * Number(row.quantity || 0);
    const isValid = itemErrors.length === 0;

    if (isValid) {
      subtotal += lineTotal;
      itemCount += Number(row.quantity || 0);
    }

    if (itemErrors.length > 0) {
      errors.push(`${cake?.name ?? "Cake"}: ${itemErrors.join(" ")}`);
    }

    items.push({
      cartItemId: row.id,
      cakeId: row.cake_id,
      cakeName: cake?.name ?? "Unknown cake",
      cakeSlug: cake?.slug ?? "",
      quantity: Number(row.quantity || 0),
      unitPrice,
      lineTotal,
      customization: row.customization ?? {},
      valid: isValid,
      errors: itemErrors,
    });
  }

  const valid = errors.length === 0 && items.length > 0;
  const prepared: CheckoutPreparation = {
    cartId: cart.id,
    cartRevision: cart.revision,
    valid,
    canProceed: valid,
    subtotal,
    total: subtotal,
    itemCount,
    items,
    errors,
    preparedAt: new Date().toISOString(),
    currency: "INR",
  };

  return prepared;
}
