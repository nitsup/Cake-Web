import { createClient } from "@/lib/supabase/server";
import type { CakeAvailability } from "@/types/cake";
import { z } from "zod";

const CAKE_IMAGES_BUCKET_NAME = "cake-images";

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

export type StaffCatalogueCakeImage = {
  id: string;
  cakeId: string;
  provider: string;
  storageKey: string;
  altText: string;
  displayPriority: number;
  isPrimary: boolean;
  zoom: number;
  positionX: number;
  positionY: number;
  url: string | null;
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

async function ensureCakeImagesBucket(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data, error } = await supabase.storage.from(CAKE_IMAGES_BUCKET_NAME).list("", { limit: 1, offset: 0 });
  if (error) {
    const message = error.message ?? "";
    if (/bucket.*not found|not.*valid bucket|does not exist/i.test(message)) {
      throw new Error("The cake image storage bucket is not configured. Apply the SQL in .private/supabase/18_cake_image_storage.txt to your Supabase project before uploading product images.");
    }
    throw new Error("Unable to access the cake image storage bucket. Confirm that the bucket exists and your staff account can access it.");
  }
  return data ?? [];
}

async function resolveCakeImageUrl(supabase: Awaited<ReturnType<typeof createClient>>, storageKey: string | null | undefined) {
  if (!storageKey) return null;
  if (/^https?:\/\//i.test(storageKey)) return storageKey;
  await ensureCakeImagesBucket(supabase);
  const { data } = supabase.storage.from(CAKE_IMAGES_BUCKET_NAME).getPublicUrl(storageKey);
  return data.publicUrl || null;
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

export async function getCakeImages(cakeId: string): Promise<StaffCatalogueCakeImage[]> {
  const supabase = await getCatalogueStaffActor();
  await ensureCakeImagesBucket(supabase);
  const { data, error } = await supabase
    .from("cake_images")
    .select("id, cake_id, provider, storage_key, alt_text, display_priority, is_primary, crop_zoom, crop_position_x, crop_position_y")
    .eq("cake_id", cakeId)
    .order("display_priority", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw new Error("Unable to load the cake images.");

  return Promise.all((data ?? []).map(async (image) => ({
    id: image.id,
    cakeId: image.cake_id,
    provider: image.provider,
    storageKey: image.storage_key,
    altText: image.alt_text,
    displayPriority: image.display_priority,
    isPrimary: image.is_primary,
    zoom: Number(image.crop_zoom ?? 1),
    positionX: Number(image.crop_position_x ?? 50),
    positionY: Number(image.crop_position_y ?? 50),
    url: await resolveCakeImageUrl(supabase, image.storage_key),
  })));
}

function getUploadedFileExtension(file: File) {
  if (file.type === "image/jpeg") return "jpg";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

export async function uploadCakeImage(cakeId: string, file: File, altText?: string): Promise<StaffCatalogueCakeImage> {
  const supabase = await getCatalogueStaffActor();
  const { data: cake, error: cakeError } = await supabase
    .from("cakes")
    .select("id, name")
    .eq("id", cakeId)
    .maybeSingle();

  if (cakeError) throw new Error("Unable to verify the selected cake.");
  if (!cake) throw new Error("Cake not found.");

  const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
  if (!allowedTypes.has(file.type) || file.size > 5 * 1024 * 1024) {
    throw new Error("Use a JPG, PNG, or WebP image up to 5 MB.");
  }

  await ensureCakeImagesBucket(supabase);

  const extension = getUploadedFileExtension(file);
  const storageKey = `cakes/${cake.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

  const { error: uploadError } = await supabase.storage.from(CAKE_IMAGES_BUCKET_NAME).upload(storageKey, file, {
    upsert: false,
    contentType: file.type,
    cacheControl: "3600",
  });

  if (uploadError) {
    throw new Error("Unable to upload the product image.");
  }

  const { data: latestImage, error: latestError } = await supabase
    .from("cake_images")
    .select("display_priority")
    .eq("cake_id", cakeId)
    .order("display_priority", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextPriority = latestError || !latestImage ? 0 : Number(latestImage.display_priority) + 1;
  const newPrimary = !latestImage;

  const { data: imageRow, error: insertError } = await supabase
    .from("cake_images")
    .insert({
      cake_id: cakeId,
      provider: "supabase-storage",
      storage_key: storageKey,
      alt_text: altText?.trim() || `${cake.name} cake photo`,
      display_priority: nextPriority,
      is_primary: newPrimary,
      crop_zoom: 1,
      crop_position_x: 50,
      crop_position_y: 50,
    })
    .select("id, cake_id, provider, storage_key, alt_text, display_priority, is_primary, crop_zoom, crop_position_x, crop_position_y")
    .single();

  if (insertError) {
    await supabase.storage.from(CAKE_IMAGES_BUCKET_NAME).remove([storageKey]);
    throw new Error("Unable to save the product image metadata.");
  }

  return {
    id: imageRow.id,
    cakeId: imageRow.cake_id,
    provider: imageRow.provider,
    storageKey: imageRow.storage_key,
    altText: imageRow.alt_text,
    displayPriority: imageRow.display_priority,
    isPrimary: imageRow.is_primary,
    zoom: Number(imageRow.crop_zoom ?? 1),
    positionX: Number(imageRow.crop_position_x ?? 50),
    positionY: Number(imageRow.crop_position_y ?? 50),
    url: await resolveCakeImageUrl(supabase, imageRow.storage_key),
  };
}

export async function setCakeImagePrimary(cakeId: string, imageId: string): Promise<StaffCatalogueCakeImage> {
  const supabase = await getCatalogueStaffActor();
  await ensureCakeImagesBucket(supabase);
  const { data: imageRecord, error: imageError } = await supabase
    .from("cake_images")
    .select("id, cake_id, provider, storage_key, alt_text, display_priority, is_primary, crop_zoom, crop_position_x, crop_position_y")
    .eq("cake_id", cakeId)
    .eq("id", imageId)
    .maybeSingle();

  if (imageError) throw new Error("Unable to update the primary image.");
  if (!imageRecord) throw new Error("Image not found.");

  const { error: resetError } = await supabase.from("cake_images").update({ is_primary: false }).eq("cake_id", cakeId);
  if (resetError) throw new Error("Unable to update the primary image.");

  const { data: updatedImage, error: updateError } = await supabase
    .from("cake_images")
    .update({ is_primary: true })
    .eq("cake_id", cakeId)
    .eq("id", imageId)
    .select("id, cake_id, provider, storage_key, alt_text, display_priority, is_primary, crop_zoom, crop_position_x, crop_position_y")
    .single();

  if (updateError) throw new Error("Unable to update the primary image.");

  return {
    id: updatedImage.id,
    cakeId: updatedImage.cake_id,
    provider: updatedImage.provider,
    storageKey: updatedImage.storage_key,
    altText: updatedImage.alt_text,
    displayPriority: updatedImage.display_priority,
    isPrimary: updatedImage.is_primary,
    zoom: Number(updatedImage.crop_zoom ?? 1),
    positionX: Number(updatedImage.crop_position_x ?? 50),
    positionY: Number(updatedImage.crop_position_y ?? 50),
    url: await resolveCakeImageUrl(supabase, updatedImage.storage_key),
  };
}

export async function updateCakeImagePresentation(
  cakeId: string,
  imageId: string,
  values: { zoom: number; positionX: number; positionY: number },
): Promise<StaffCatalogueCakeImage> {
  const supabase = await getCatalogueStaffActor();
  await ensureCakeImagesBucket(supabase);
  const { data, error } = await supabase
    .from("cake_images")
    .update({
      crop_zoom: values.zoom,
      crop_position_x: values.positionX,
      crop_position_y: values.positionY,
    })
    .eq("cake_id", cakeId)
    .eq("id", imageId)
    .select("id, cake_id, provider, storage_key, alt_text, display_priority, is_primary, crop_zoom, crop_position_x, crop_position_y")
    .maybeSingle();

  if (error) throw new Error("Unable to save the image positioning.");
  if (!data) throw new Error("Image not found.");

  return {
    id: data.id,
    cakeId: data.cake_id,
    provider: data.provider,
    storageKey: data.storage_key,
    altText: data.alt_text,
    displayPriority: data.display_priority,
    isPrimary: data.is_primary,
    zoom: Number(data.crop_zoom ?? 1),
    positionX: Number(data.crop_position_x ?? 50),
    positionY: Number(data.crop_position_y ?? 50),
    url: await resolveCakeImageUrl(supabase, data.storage_key),
  };
}

export async function deleteCakeImage(cakeId: string, imageId: string): Promise<void> {
  const supabase = await getCatalogueStaffActor();
  await ensureCakeImagesBucket(supabase);
  const { data: imageRecord, error: imageError } = await supabase
    .from("cake_images")
    .select("id, cake_id, storage_key, is_primary")
    .eq("cake_id", cakeId)
    .eq("id", imageId)
    .maybeSingle();

  if (imageError) throw new Error("Unable to remove the product image.");
  if (!imageRecord) throw new Error("Image not found.");

  if (imageRecord.is_primary) {
    const { data: nextImage, error: nextImageError } = await supabase
      .from("cake_images")
      .select("id")
      .eq("cake_id", cakeId)
      .neq("id", imageId)
      .order("display_priority", { ascending: true })
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!nextImageError && nextImage) {
      const { error: promoteError } = await supabase
        .from("cake_images")
        .update({ is_primary: true })
        .eq("cake_id", cakeId)
        .eq("id", nextImage.id);

      if (promoteError) throw new Error("Unable to assign a fallback primary image.");
    }
  }

  const { error: storageError } = await supabase.storage.from(CAKE_IMAGES_BUCKET_NAME).remove([imageRecord.storage_key]);
  if (storageError) throw new Error("Unable to remove the product image from storage.");

  const { error: deleteError } = await supabase.from("cake_images").delete().eq("cake_id", cakeId).eq("id", imageId);
  if (deleteError) throw new Error("Unable to remove the product image metadata.");
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
