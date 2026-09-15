import { createClient } from "@/lib/supabase/server";
import {
  customerCancellationReasons,
  type CustomerCancellationReason,
} from "@/services/cancellation-reasons";

export const allowedCustomerCancellationStatuses = new Set(["pending", "confirmed"]);

export type OrderLifecycleResult = {
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

export type CancellableOrder = {
  id: string;
  orderNumber: string;
  status: string;
};

export async function getCancellableOrderForCurrentUser(orderId: string): Promise<CancellableOrder | null> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error("You must be logged in.");
  }

  const { data, error } = await supabase
    .from("orders")
    .select("id, order_number, status")
    .eq("id", orderId)
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (error) {
    throw new Error("Unable to load this order.");
  }
  if (!data || !allowedCustomerCancellationStatuses.has(data.status)) {
    return null;
  }

  return {
    id: data.id,
    orderNumber: data.order_number,
    status: data.status,
  };
}

export async function cancelOrderForCurrentUser(
  orderId: string,
  reason: CustomerCancellationReason,
): Promise<OrderLifecycleResult> {
  if (!customerCancellationReasons.includes(reason)) {
    throw new Error("Please select a valid cancellation reason.");
  }

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error("You must be logged in.");
  }

  const { data, error } = await supabase.rpc("cancel_customer_order", {
    p_order_id: orderId,
    p_reason: reason,
  });

  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    throw new Error("Unable to cancel this order.");
  }

  return {
    id: data.id,
    userId: data.user_id,
    orderNumber: data.order_number,
    status: data.status,
    paymentStatus: data.payment_status,
    subtotal: Number(data.subtotal ?? 0),
    total: Number(data.total ?? 0),
    itemCount: Number(data.item_count ?? 0),
    idempotencyKey: data.idempotency_key,
    cancellationReason: data.cancellation_reason ?? null,
    cancelledAt: data.cancelled_at ?? null,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}
