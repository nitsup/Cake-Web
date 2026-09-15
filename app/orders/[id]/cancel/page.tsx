import { redirect } from "next/navigation";
import { CancelOrderPanel } from "@/components/orders/cancel-order-panel";
import { getCancellableOrderForCurrentUser } from "@/services/order-lifecycle";

export const metadata = {
  title: "Cancel order",
  description: "Confirm cancellation of your order.",
};

export default async function CancelOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getCancellableOrderForCurrentUser(id);

  if (!order) {
    redirect("/orders");
  }

  return <CancelOrderPanel orderId={order.id} orderNumber={order.orderNumber} />;
}
