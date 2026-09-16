"use client";

import { useState } from "react";
import type { CakeWeightOption } from "@/types/cake";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";

export function WeightSelector({ options, basePrice, cakeId }: { options: CakeWeightOption[]; basePrice: number; cakeId: string }) {
  const available = options.filter((option) => option.isAvailable).sort((a, b) => a.displayPriority - b.displayPriority);
  const [selectedId, setSelectedId] = useState<string | null>(available[0]?.id ?? null);
  const selected = available.find((option) => option.id === selectedId);
  if (available.length === 0) return <AddToCartButton cakeId={cakeId} />;
  return (
    <div className="mt-8">
      <fieldset>
        <legend className="text-sm font-semibold">Choose a weight</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {options.map((option) => (
            <label key={option.id} className={`rounded-lg border p-3 text-sm ${option.isAvailable ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}>
              <input type="radio" name="cake-weight" value={option.id} checked={selectedId === option.id} onChange={() => setSelectedId(option.id)} disabled={!option.isAvailable} className="mr-2" />
              {option.label} <span className="float-right font-semibold">₹{option.price.toFixed(2)}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <p className="mt-3 text-sm text-muted-foreground">Selected price: ₹{(selected?.price ?? basePrice).toFixed(2)}</p>
      <AddToCartButton cakeId={cakeId} weightOptionId={selectedId} disabled={!selected} />
    </div>
  );
}
