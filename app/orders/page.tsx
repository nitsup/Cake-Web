import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OrderHistoryPanel } from "@/components/orders/order-history-panel";
import { getCurrentUserOrderHistory } from "@/services/order-history";

export const metadata = { title: "Orders", description: "Your order summary." };

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  const orders = await getCurrentUserOrderHistory();

  return <OrderHistoryPanel initialOrders={orders} />;
}
