import { createClient } from "@/lib/supabase/server";
import type { CakeDetail, CakeSummary } from "@/types/cake";

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
};

type RawCakeImage = {
  provider: string;
  storage_key: string;
  alt_text: string;
  display_priority: number;
  is_primary: boolean;
};

type RawCakeDetail = RawCake & {
  full_description: string | null;
  is_featured: boolean;
};

function mapPrimaryImage(images: RawCakeImage[] | null) {
  const image = images?.find((candidate) => candidate.is_primary) ?? null;
  if (!image) return null;

  const isAbsoluteUrl = /^https?:\/\//i.test(image.storage_key);

  return {
    provider: image.provider,
    storageKey: image.storage_key,
    altText: image.alt_text,
    displayPriority: image.display_priority,
    isPrimary: image.is_primary,
    url: isAbsoluteUrl ? image.storage_key : null,
  };
}

export async function getPublicCakes(): Promise<CakeSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cakes")
    .select("id, name, slug, short_description, base_price, sale_price, availability, category:cake_categories(name, slug), cake_images(provider, storage_key, alt_text, display_priority, is_primary)")
    .eq("is_active", true)
    .eq("availability", "available")
    .order("display_priority", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw new Error("Unable to load the cake catalog.");
  }

  return (data as unknown as RawCake[]).map((cake) => ({
    id: cake.id,
    name: cake.name,
    slug: cake.slug,
    shortDescription: cake.short_description,
    basePrice: cake.sale_price ?? cake.base_price,
    category: cake.category ?? { name: "Collection", slug: "collection" },
    availability: cake.availability,
    primaryImage: mapPrimaryImage(cake.cake_images),
  }));
}

export async function getPublicCakeBySlug(slug: string): Promise<CakeDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cakes")
    .select("id, name, slug, short_description, full_description, base_price, sale_price, availability, is_featured, category:cake_categories(name, slug), cake_images(provider, storage_key, alt_text, display_priority, is_primary)")
    .eq("slug", slug)
    .eq("is_active", true)
    .eq("availability", "available")
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
    primaryImage: mapPrimaryImage(cake.cake_images),
  };
}
