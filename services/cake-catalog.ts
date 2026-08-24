import { createClient } from "@/lib/supabase/server";
import type { CakeSummary } from "@/types/cake";

type RawCake = {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  base_price: number;
  sale_price: number | null;
  availability: "available" | "unavailable";
  category: { name: string; slug: string } | null;
};

export async function getPublicCakes(): Promise<CakeSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cakes")
    .select("id, name, slug, short_description, base_price, sale_price, availability, category:cake_categories(name, slug)")
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
  }));
}
