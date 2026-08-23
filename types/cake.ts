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
