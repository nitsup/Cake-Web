export type CakeAvailability = "available" | "unavailable";

export type CakeWeightUnit = "g" | "kg";

export interface CakeWeightOption {
  id: string;
  weightAmount: number;
  weightUnit: CakeWeightUnit;
  label: string;
  price: number;
  isAvailable: boolean;
  displayPriority: number;
}

export interface CakeCategoryReference {
  name: string;
  slug: string;
}

export interface CakeImage {
  provider: string;
  storageKey: string;
  altText: string;
  displayPriority: number;
  isPrimary: boolean;
  zoom: number;
  positionX: number;
  positionY: number;
  url: string | null;
}

export interface CakeSummary {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  basePrice: number;
  category: CakeCategoryReference;
  availability: CakeAvailability;
  primaryImage: CakeImage | null;
}

export interface CakeDetail extends CakeSummary {
  fullDescription: string | null;
  salePrice: number | null;
  isFeatured: boolean;
  weightOptions: CakeWeightOption[];
}
