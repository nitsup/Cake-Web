import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrdersForOperationalManagement } from "@/services/staff-order-management";

export const metadata = {
  title: "Control center",
  description: "Authorized staff operations for Cake Web.",
};

export default async function AdminControlCenterPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profileError || !profileData || (profileData.role !== "editor" && profileData.role !== "admin")) {
    return (
      <div className="container py-16 md:py-24">
        <section className="surface-card mx-auto max-w-2xl p-6 md:p-8">
          <p className="eyebrow">Control center</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Access denied</h1>
          <p className="mt-4 leading-7 text-muted-foreground">This operational area is available to authorized staff only.</p>
        </section>
      </div>
    );
  }

  const orders = await getOrdersForOperationalManagement();
  const activeOrders = orders.filter((order) => order.nextStatus !== null);
  const paymentReviewOrders = orders.filter((order) => order.paymentStatus === "Pending");
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="container py-16 md:py-24">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Operations</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Control center</h1>
            <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
              A role-protected home for the operational work already available to staff.
            </p>
          </div>
          <Link href="/admin/orders" className="button button--primary">Open order management</Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="surface-card p-5">
            <p className="text-sm text-muted-foreground">Orders in view</p>
            <p className="mt-2 text-3xl font-semibold">{orders.length}</p>
          </div>
          <div className="surface-card p-5">
            <p className="text-sm text-muted-foreground">Active lifecycle work</p>
            <p className="mt-2 text-3xl font-semibold">{activeOrders.length}</p>
          </div>
          <div className="surface-card p-5">
            <p className="text-sm text-muted-foreground">Payment review</p>
            <p className="mt-2 text-3xl font-semibold">{paymentReviewOrders.length}</p>
          </div>
        </div>

        <section className="surface-card mt-6 p-6 md:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Current work</p>
              <h2 className="mt-2 text-2xl font-semibold">Recent orders</h2>
            </div>
            <Link href="/admin/orders" className="font-semibold text-accent underline underline-offset-4">View all orders</Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="mt-6 rounded-md border border-dashed p-5 text-sm leading-7 text-muted-foreground">
              No orders are currently available for operational management.
            </p>
          ) : (
            <div className="mt-6 divide-y divide-border rounded-md border">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">{order.customerName ?? "Customer"} · {order.itemCount} item{order.itemCount === 1 ? "" : "s"}</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="rounded-full border border-border bg-muted/50 px-2.5 py-1 font-semibold">{order.customerStatusLabel}</span>
                    <span className="text-muted-foreground">{order.nextStatus ? `Next: ${order.nextStatusLabel}` : "Terminal"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </div>
  );
}
