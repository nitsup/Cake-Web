import { redirect } from "next/navigation";
import { StaffCataloguePanel } from "@/components/catalogue/staff-catalogue-panel";
import { createClient } from "@/lib/supabase/server";
import { getStaffCatalogue, getStaffCatalogueCategories } from "@/services/staff-catalogue";

export const metadata = {
  title: "Catalogue",
  description: "Manage Cake Web product visibility.",
};

export default async function AdminCataloguePage() {
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
          <p className="eyebrow">Catalogue</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Access denied</h1>
          <p className="mt-4 leading-7 text-muted-foreground">This catalogue area is available to authorized staff only.</p>
        </section>
      </div>
    );
  }

  const [cakes, categories] = await Promise.all([getStaffCatalogue(), getStaffCatalogueCategories()]);
  return <StaffCataloguePanel initialCakes={cakes} initialCategories={categories} />;
}
