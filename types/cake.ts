export type CakeAvailability = "available" | "unavailable";

export interface CakeCategoryReference {
  name: string;
  slug: string;
}

export interface CakeSummary {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  basePrice: number;
  category: CakeCategoryReference;
  availability: CakeAvailability;
}

export interface CakeDetail extends CakeSummary {
  fullDescription: string | null;
  salePrice: number | null;
  isFeatured: boolean;
}
