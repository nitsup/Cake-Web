import { createClient } from "@/lib/supabase/server";
import type { CakeDetail, CakeSummary, CakeWeightOption } from "@/types/cake";

type RawCake = {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  base_price: number;
  sale_price: number | null;
  availability: "available" | "unavailable";
  category: { name: string; slug: string } | null;
  cake_images: RawCakeImage[] | null;
  cake_weight_options: RawWeightOption[] | null;
};
type RawWeightOption = { id: string; weight_amount: number; weight_unit: "g" | "kg"; label: string; price: number; is_available: boolean; display_priority: number };
function mapWeightOptions(options: RawWeightOption[] | null): CakeWeightOption[] {
  return (options ?? []).map((option) => ({ id: option.id, weightAmount: Number(option.weight_amount), weightUnit: option.weight_unit, label: option.label, price: Number(option.price), isAvailable: option.is_available, displayPriority: option.display_priority }));
}

type RawCakeImage = {
  provider: string;
  storage_key: string;
  alt_text: string;
  display_priority: number;
  is_primary: boolean;
  crop_zoom: number;
  crop_position_x: number;
  crop_position_y: number;
};

type RawCakeDetail = RawCake & {
  full_description: string | null;
  is_featured: boolean;
};

export { getLocalPrimaryImageUrl } from "@/lib/local-cake-images";

async function mapPrimaryImage(supabase: Awaited<ReturnType<typeof createClient>>, images: RawCakeImage[] | null) {
  const image = images?.find((candidate) => candidate.is_primary) ?? null;
  if (!image) return null;

  const isAbsoluteUrl = /^https?:\/\//i.test(image.storage_key);
  let url = isAbsoluteUrl ? image.storage_key : null;

  if (!url) {
    const { data } = supabase.storage.from("cake-images").getPublicUrl(image.storage_key);
    url = data.publicUrl ?? null;
  }

  return {
    provider: image.provider,
    storageKey: image.storage_key,
    altText: image.alt_text,
    displayPriority: image.display_priority,
    isPrimary: image.is_primary,
    zoom: Number(image.crop_zoom ?? 1),
    positionX: Number(image.crop_position_x ?? 50),
    positionY: Number(image.crop_position_y ?? 50),
    url,
  };
}

export async function getPublicCakes(
  categorySlug?: string,
  options: { limit?: number } = {},
): Promise<CakeSummary[]> {
  const supabase = await createClient();
  let selectClause = "id, name, slug, short_description, base_price, sale_price, availability, category:cake_categories!inner(name, slug), cake_images(provider, storage_key, alt_text, display_priority, is_primary, crop_zoom, crop_position_x, crop_position_y), cake_weight_options(id, weight_amount, weight_unit, label, price, is_available, display_priority)";

  if (categorySlug) {
    selectClause = "id, name, slug, short_description, base_price, sale_price, availability, category:cake_categories!inner(name, slug), cake_images(provider, storage_key, alt_text, display_priority, is_primary, crop_zoom, crop_position_x, crop_position_y), cake_weight_options(id, weight_amount, weight_unit, label, price, is_available, display_priority)";
  }

  let query = supabase
    .from("cakes")
    .select(selectClause)
    .eq("is_active", true)
    .eq("availability", "available");

  if (categorySlug) {
    query = query.eq("category.slug", categorySlug);
  }
  query = query.eq("category.is_active", true);

  let orderedQuery = query
    .order("is_featured", { ascending: false })
    .order("display_priority", { ascending: true })
    .order("name", { ascending: true });
  if (options.limit !== undefined) {
    orderedQuery = orderedQuery.limit(options.limit);
  }

  const { data, error } = await orderedQuery;

  if (error) {
    throw new Error("Unable to load the cake catalog.");
  }

  const cakes = data as unknown as RawCake[];
  return Promise.all(cakes.map(async (cake) => ({
    id: cake.id,
    name: cake.name,
    slug: cake.slug,
    shortDescription: cake.short_description,
    basePrice: cake.sale_price ?? cake.base_price,
    category: cake.category ?? { name: "Collection", slug: "collection" },
    availability: cake.availability,
    primaryImage: await mapPrimaryImage(supabase, cake.cake_images),
  })));
}

export async function getPublicCakeBySlug(slug: string): Promise<CakeDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cakes")
    .select("id, name, slug, short_description, full_description, base_price, sale_price, availability, is_featured, category:cake_categories!inner(name, slug), cake_images(provider, storage_key, alt_text, display_priority, is_primary, crop_zoom, crop_position_x, crop_position_y), cake_weight_options(id, weight_amount, weight_unit, label, price, is_available, display_priority)")
    .eq("slug", slug)
    .eq("is_active", true)
    .eq("availability", "available")
    .eq("category.is_active", true)
    .maybeSingle();

  if (error) {
    throw new Error("Unable to load the cake.");
  }

  if (!data) {
    return null;
  }

  const cake = data as unknown as RawCakeDetail;

  return {
    id: cake.id,
    name: cake.name,
    slug: cake.slug,
    shortDescription: cake.short_description,
    fullDescription: cake.full_description,
    basePrice: cake.base_price,
    salePrice: cake.sale_price,
    category: cake.category ?? { name: "Collection", slug: "collection" },
    availability: cake.availability,
    isFeatured: cake.is_featured,
    primaryImage: await mapPrimaryImage(supabase, cake.cake_images),
    weightOptions: mapWeightOptions(cake.cake_weight_options),
  };
}
