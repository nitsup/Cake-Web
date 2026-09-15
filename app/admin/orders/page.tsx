import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StaffOrderManagementPanel } from "@/components/orders/staff-order-management-panel";
import { getOrdersForOperationalManagement } from "@/services/staff-order-management";

export const metadata = { title: "Order management", description: "Staff and admin order lifecycle management." };

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profileData || (profileData.role !== "editor" && profileData.role !== "admin")) {
    return (
      <div className="container py-16 md:py-24">
        <section className="surface-card mx-auto max-w-2xl p-6 md:p-8">
          <p className="eyebrow">Access denied</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">You do not have order management access.</h1>
        </section>
      </div>
    );
  }

  const orders = await getOrdersForOperationalManagement();
  return <StaffOrderManagementPanel initialOrders={orders} />;
}
