import { createClient } from "@/lib/supabase/server";
import type { CakeAvailability } from "@/types/cake";

export type StaffCatalogueCake = {
  id: string;
  name: string;
  slug: string;
  categoryName: string;
  categorySlug: string;
  basePrice: number;
  salePrice: number | null;
  availability: CakeAvailability;
  isActive: boolean;
  isFeatured: boolean;
  displayPriority: number;
};

async function getCatalogueStaffActor() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) throw new Error("Unable to verify your account.");
  if (!userData.user) throw new Error("You must be logged in.");

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profileError) throw new Error("Unable to load your account role.");

  if (profileData?.role !== "editor" && profileData?.role !== "admin") {
    throw new Error("You do not have permission to manage the catalogue.");
  }

  return supabase;
}

function mapCatalogueCake(cake: {
  id: string;
  name: string;
  slug: string;
  base_price: number | string;
  sale_price: number | string | null;
  availability: CakeAvailability;
  is_active: boolean;
  is_featured: boolean;
  display_priority: number;
  category: { name: string; slug: string } | null;
}): StaffCatalogueCake {
  return {
    id: cake.id,
    name: cake.name,
    slug: cake.slug,
    categoryName: cake.category?.name ?? "Uncategorized",
    categorySlug: cake.category?.slug ?? "",
    basePrice: Number(cake.base_price),
    salePrice: cake.sale_price === null ? null : Number(cake.sale_price),
    availability: cake.availability,
    isActive: cake.is_active,
    isFeatured: cake.is_featured,
    displayPriority: cake.display_priority,
  };
}

export async function getStaffCatalogue(): Promise<StaffCatalogueCake[]> {
  const supabase = await getCatalogueStaffActor();
  const { data, error } = await supabase
    .from("cakes")
    .select("id, name, slug, base_price, sale_price, availability, is_active, is_featured, display_priority, category:cake_categories(name, slug)")
    .order("display_priority", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw new Error("Unable to load the catalogue.");

  return ((data ?? []) as unknown as Parameters<typeof mapCatalogueCake>[0][]).map(mapCatalogueCake);
}

export async function updateCakeVisibility(
  cakeId: string,
  values: { isActive: boolean; availability: CakeAvailability },
): Promise<StaffCatalogueCake> {
  const supabase = await getCatalogueStaffActor();
  const { data, error } = await supabase
    .from("cakes")
    .update({
      is_active: values.isActive,
      availability: values.availability,
    })
    .eq("id", cakeId)
    .select("id, name, slug, base_price, sale_price, availability, is_active, is_featured, display_priority, category:cake_categories(name, slug)")
    .maybeSingle();

  if (error) throw new Error("Unable to update catalogue visibility.");
  if (!data) throw new Error("Cake not found.");

  return mapCatalogueCake(data as unknown as Parameters<typeof mapCatalogueCake>[0]);
}
