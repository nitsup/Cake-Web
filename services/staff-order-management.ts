import { createClient } from "@/lib/supabase/server";

export const operationalOrderTransitions: Record<string, string> = {
  pending: "confirmed",
  confirmed: "processing",
  processing: "completed",
};

export type StaffOrderSummary = {
  id: string;
  userId: string;
  orderNumber: string;
  status: string;
  customerStatusLabel: string;
  paymentStatus: string;
  subtotal: number;
  total: number;
  itemCount: number;
  createdAt: string;
  customerName: string | null;
  customerEmail: string | null;
  nextStatus: string | null;
  nextStatusLabel: string | null;
};

const customerStatusMap: Record<string, string> = {
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

async function getCurrentStaffActor() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw new Error("Unable to verify your account.");
  }
  if (!userData.user) {
    throw new Error("You must be logged in.");
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error("Unable to load your account role.");
  }

  const role = profileData?.role ?? null;
  if (role !== "editor" && role !== "admin") {
    throw new Error("You do not have permission to manage orders.");
  }

  return { supabase, userId: userData.user.id, role };
}

export async function getOrdersForOperationalManagement(): Promise<StaffOrderSummary[]> {
  const { supabase } = await getCurrentStaffActor();

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("id, user_id, order_number, status, payment_status, subtotal, total, item_count, created_at")
    .order("created_at", { ascending: false });

  if (ordersError) {
    throw new Error("Unable to load orders for management.");
  }

  const allUserIds = [...new Set((orders ?? []).map((order) => order.user_id))];
  const profileMap = new Map<string, { display_name: string | null; email: string | null }>();

  if (allUserIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, display_name, email")
      .in("id", allUserIds);

    if (!profilesError) {
      for (const profile of profiles ?? []) {
        profileMap.set(profile.id, {
          display_name: profile.display_name ?? null,
          email: profile.email ?? null,
        });
      }
    }
  }

  return (orders ?? []).map((order) => {
    const nextStatus = operationalOrderTransitions[order.status] ?? null;
    const profile = profileMap.get(order.user_id) ?? null;
    return {
      id: order.id,
      userId: order.user_id,
      orderNumber: order.order_number,
      status: order.status,
      customerStatusLabel: customerStatusMap[order.status] ?? order.status,
      paymentStatus: paymentStatusMap[order.payment_status] ?? order.payment_status,
      subtotal: Number(order.subtotal ?? 0),
      total: Number(order.total ?? 0),
      itemCount: Number(order.item_count ?? 0),
      createdAt: order.created_at,
      customerName: profile?.display_name ?? null,
      customerEmail: profile?.email ?? null,
      nextStatus,
      nextStatusLabel: nextStatus ? customerStatusMap[nextStatus] ?? nextStatus : null,
    };
  });
}

export async function updateOrderStatusForStaff(orderId: string, requestedStatus: string): Promise<StaffOrderSummary> {
  const { supabase, role } = await getCurrentStaffActor();

  if (!role || (role !== "editor" && role !== "admin")) {
    throw new Error("You do not have permission to manage orders.");
  }

  const { data: existingOrder, error: orderError } = await supabase
    .from("orders")
    .select("id, user_id, order_number, status, payment_status, subtotal, total, item_count, created_at")
    .eq("id", orderId)
    .maybeSingle();

  if (orderError) {
    throw new Error("Unable to load the order you want to update.");
  }
  if (!existingOrder) {
    throw new Error("Order not found.");
  }

  const currentStatus = existingOrder.status;
  const allowedNextStatus = operationalOrderTransitions[currentStatus] ?? null;
  if (allowedNextStatus !== requestedStatus) {
    throw new Error(`This order cannot be moved to ${requestedStatus}.`);
  }

  type OrderStatusUpdateRow = {
    id: string;
    user_id: string;
    order_number: string;
    status: string;
    payment_status: string;
    subtotal: number | string | null;
    total: number | string | null;
    item_count: number | string | null;
    created_at: string;
  };

  let updatedOrder: OrderStatusUpdateRow | null = null;
  const { data: rpcOrder, error: rpcError } = await supabase.rpc("update_order_status_for_staff", {
    p_order_id: orderId,
    p_target_status: requestedStatus,
  });

  if (rpcError) {
    throw new Error(rpcError.message);
  }
  updatedOrder = rpcOrder;

  if (!updatedOrder) {
    throw new Error("The order update did not return a result.");
  }

  const profileRow = await supabase
    .from("profiles")
    .select("display_name, email")
    .eq("id", updatedOrder.user_id)
    .maybeSingle();

  return {
    id: updatedOrder.id,
    userId: updatedOrder.user_id,
    orderNumber: updatedOrder.order_number,
    status: updatedOrder.status,
    customerStatusLabel: customerStatusMap[updatedOrder.status] ?? updatedOrder.status,
    paymentStatus: paymentStatusMap[updatedOrder.payment_status] ?? updatedOrder.payment_status,
    subtotal: Number(updatedOrder.subtotal ?? 0),
    total: Number(updatedOrder.total ?? 0),
    itemCount: Number(updatedOrder.item_count ?? 0),
    createdAt: updatedOrder.created_at,
    customerName: profileRow.data?.display_name ?? null,
    customerEmail: profileRow.data?.email ?? null,
    nextStatus: operationalOrderTransitions[updatedOrder.status] ?? null,
    nextStatusLabel: operationalOrderTransitions[updatedOrder.status]
      ? customerStatusMap[operationalOrderTransitions[updatedOrder.status]] ?? operationalOrderTransitions[updatedOrder.status]
      : null,
  };
}
