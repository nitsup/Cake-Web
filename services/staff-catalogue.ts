import { createClient } from "@/lib/supabase/server";
import type { CakeAvailability } from "@/types/cake";
import { z } from "zod";

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
  shortDescription: string;
  fullDescription: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

export type StaffCatalogueCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  displayPriority: number;
  isActive: boolean;
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
  short_description: string;
  full_description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  category: { name: string; slug: string } | { name: string; slug: string }[] | null;
}): StaffCatalogueCake {
  const category = Array.isArray(cake.category) ? cake.category[0] ?? null : cake.category;
  return {
    id: cake.id,
    name: cake.name,
    slug: cake.slug,
    categoryName: category?.name ?? "Uncategorized",
    categorySlug: category?.slug ?? "",
    basePrice: Number(cake.base_price),
    salePrice: cake.sale_price === null ? null : Number(cake.sale_price),
    availability: cake.availability,
    isActive: cake.is_active,
    isFeatured: cake.is_featured,
    displayPriority: cake.display_priority,
    shortDescription: cake.short_description,
    fullDescription: cake.full_description,
    seoTitle: cake.seo_title,
    seoDescription: cake.seo_description,
  };
}

const cakeSelect = "id, name, slug, short_description, full_description, base_price, sale_price, availability, is_active, is_featured, display_priority, seo_title, seo_description, category:cake_categories(name, slug)";

export async function getStaffCatalogue(): Promise<StaffCatalogueCake[]> {
  const supabase = await getCatalogueStaffActor();
  const { data, error } = await supabase
    .from("cakes")
    .select(cakeSelect)
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
    .select(cakeSelect)
    .maybeSingle();

  if (error) throw new Error("Unable to update catalogue visibility.");
  if (!data) throw new Error("Cake not found.");

  return mapCatalogueCake(data as unknown as Parameters<typeof mapCatalogueCake>[0]);
}

export async function updateCake(cakeId: string, values: {
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string | null;
  basePrice: number;
  salePrice: number | null;
  categoryId: string;
  availability: CakeAvailability;
  isActive: boolean;
  isFeatured: boolean;
  displayPriority: number;
  seoTitle: string | null;
  seoDescription: string | null;
}): Promise<StaffCatalogueCake> {
  const supabase = await getCatalogueStaffActor();
  const { data, error } = await supabase.from("cakes").update({
    name: values.name,
    slug: values.slug,
    short_description: values.shortDescription,
    full_description: values.fullDescription,
    base_price: values.basePrice,
    sale_price: values.salePrice,
    category_id: values.categoryId,
    availability: values.availability,
    is_active: values.isActive,
    is_featured: values.isFeatured,
    display_priority: values.displayPriority,
    seo_title: values.seoTitle,
    seo_description: values.seoDescription,
  }).eq("id", cakeId).select(cakeSelect).maybeSingle();
  if (error) throw new Error("Unable to update the catalogue product.");
  if (!data) throw new Error("Cake not found.");
  return mapCatalogueCake(data as unknown as Parameters<typeof mapCatalogueCake>[0]);
}

export async function getStaffCatalogueCategories(): Promise<StaffCatalogueCategory[]> {
  const supabase = await getCatalogueStaffActor();
  const { data, error } = await supabase.from("cake_categories")
    .select("id, name, slug, description, display_priority, is_active")
    .order("display_priority", { ascending: true }).order("name", { ascending: true });
  if (error) throw new Error("Unable to load catalogue categories.");
  return (data ?? []).map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    displayPriority: category.display_priority,
    isActive: category.is_active,
  }));
}

function createCategorySlug(name: string) {
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  if (!slug) throw new Error("Category name must contain letters or numbers.");
  return slug;
}

function createProductSlug(name: string) {
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  if (!slug) throw new Error("Product name must contain letters or numbers.");
  return slug;
}

type CakeWriteValues = {
  name: string;
  shortDescription: string;
  fullDescription: string | null;
  basePrice: number;
  salePrice: number | null;
  categoryId: string;
  availability: CakeAvailability;
  isActive: boolean;
  isFeatured: boolean;
  displayPriority: number;
  seoTitle: string | null;
  seoDescription: string | null;
};

export const cakeWriteSchema = z.object({
  name: z.string().trim().min(1).max(160),
  shortDescription: z.string().trim().min(1).max(500),
  fullDescription: z.string().trim().max(5000).nullable(),
  basePrice: z.number().finite().min(0),
  salePrice: z.number().finite().min(0).nullable(),
  categoryId: z.string().uuid(),
  availability: z.enum(["available", "unavailable"]),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  displayPriority: z.number().int().min(0).max(100000),
  seoTitle: z.string().trim().max(160).nullable(),
  seoDescription: z.string().trim().max(320).nullable(),
}).refine((value) => value.salePrice === null || value.salePrice <= value.basePrice, {
  message: "Sale price cannot exceed base price.",
});

export async function createCake(values: CakeWriteValues): Promise<StaffCatalogueCake> {
  const supabase = await getCatalogueStaffActor();
  const { data: category, error: categoryError } = await supabase
    .from("cake_categories")
    .select("id")
    .eq("id", values.categoryId)
    .eq("is_active", true)
    .maybeSingle();

  if (categoryError) throw new Error("Unable to verify the selected category.");
  if (!category) throw new Error("The selected category is not available.");

  const { data, error } = await supabase.from("cakes").insert({
    name: values.name,
    slug: createProductSlug(values.name),
    short_description: values.shortDescription,
    full_description: values.fullDescription,
    base_price: values.basePrice,
    sale_price: values.salePrice,
    category_id: category.id,
    availability: values.availability,
    is_active: values.isActive,
    is_featured: values.isFeatured,
    display_priority: values.displayPriority,
    seo_title: values.seoTitle,
    seo_description: values.seoDescription,
  }).select(cakeSelect).single();

  if (error?.code === "23505") throw new Error("A product with this generated slug already exists. Choose a more specific name.");
  if (error) throw new Error("Unable to create the catalogue product.");
  return mapCatalogueCake(data as unknown as Parameters<typeof mapCatalogueCake>[0]);
}

export async function createCatalogueCategory(values: { name: string; description: string | null; displayPriority: number }) {
  const supabase = await getCatalogueStaffActor();
  const { data, error } = await supabase.from("cake_categories").insert({
    name: values.name,
    slug: createCategorySlug(values.name),
    description: values.description,
    display_priority: values.displayPriority,
  }).select("id, name, slug, description, display_priority, is_active").single();
  if (error) throw new Error("Unable to create the catalogue category.");
  return {
    id: data.id, name: data.name, slug: data.slug, description: data.description,
    displayPriority: data.display_priority, isActive: data.is_active,
  };
}

export async function updateCatalogueCategory(categoryId: string, values: { name: string; description: string | null; displayPriority: number }) {
  const supabase = await getCatalogueStaffActor();
  const { data, error } = await supabase.from("cake_categories").update({
    name: values.name, slug: createCategorySlug(values.name), description: values.description, display_priority: values.displayPriority,
  }).eq("id", categoryId).select("id, name, slug, description, display_priority, is_active").maybeSingle();
  if (error) throw new Error("Unable to update the catalogue category.");
  if (!data) throw new Error("Category not found.");
  return {
    id: data.id, name: data.name, slug: data.slug, description: data.description,
    displayPriority: data.display_priority, isActive: data.is_active,
  };
}
