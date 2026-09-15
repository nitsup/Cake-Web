import { createClient } from "@/lib/supabase/server";

export type OrderHistoryItem = {
  id: string;
  cakeId: string;
  itemName: string;
  itemSlug: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  snapshot: Record<string, unknown> | null;
};

export type OrderHistoryOrder = {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  customerStatusLabel: string;
  paymentStatus: string;
  total: number;
  itemCount: number;
  canCancel: boolean;
  items: OrderHistoryItem[];
};

const statusMap: Record<string, string> = {
  pending: "Getting Ready",
  confirmed: "Packaged",
  processing: "Arriving",
  completed: "Delivered",
  cancelled: "Cancelled",
};

const paymentStatusMap: Record<string, string> = {
  pending: "Pending",
  authorized: "Authorized",
  captured: "Captured",
  failed: "Failed",
  refunded: "Refunded",
  not_required: "Not required",
};

export async function getCurrentUserOrderHistory(): Promise<OrderHistoryOrder[]> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error("You must be logged in.");
  }

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("id, order_number, status, payment_status, total, item_count, created_at")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  if (ordersError) {
    throw new Error("Unable to load your orders.");
  }

  const orderRows = orders ?? [];
  if (orderRows.length === 0) {
    return [];
  }

  const orderIds = orderRows.map((order) => order.id);
  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("id, order_id, cake_id, item_name, item_slug, quantity, unit_price, line_total, snapshot")
    .in("order_id", orderIds)
    .order("created_at", { ascending: true });

  if (itemsError) {
    throw new Error("Unable to load your order items.");
  }

  const itemMap = new Map<string, OrderHistoryItem[]>();
  for (const item of items ?? []) {
    const safeItem = {
      id: item.id,
      cakeId: item.cake_id,
      itemName: item.item_name,
      itemSlug: item.item_slug,
      quantity: Number(item.quantity ?? 0),
      unitPrice: Number(item.unit_price ?? 0),
      lineTotal: Number(item.line_total ?? 0),
      snapshot: (item.snapshot as Record<string, unknown>) ?? null,
    };
    const existing = itemMap.get(item.order_id) ?? [];
    existing.push(safeItem);
    itemMap.set(item.order_id, existing);
  }

  return orderRows.map((order) => ({
    id: order.id,
    orderNumber: order.order_number,
    createdAt: order.created_at,
    status: order.status,
    customerStatusLabel: statusMap[order.status] ?? order.status,
    paymentStatus: paymentStatusMap[order.payment_status] ?? order.payment_status,
    total: Number(order.total ?? 0),
    itemCount: Number(order.item_count ?? 0),
    canCancel: order.status === "pending" || order.status === "confirmed",
    items: itemMap.get(order.id) ?? [],
  }));
}
