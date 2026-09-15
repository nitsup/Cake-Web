"use client";

import { useState } from "react";
import type { StaffCatalogueCake } from "@/services/staff-catalogue";

function formatMoney(value: number) {
  return `₹${value.toFixed(2)}`;
}

export function StaffCataloguePanel({ initialCakes }: { initialCakes: StaffCatalogueCake[] }) {
  const [cakes, setCakes] = useState(initialCakes);
  const [busyCakeId, setBusyCakeId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  async function updateVisibility(cake: StaffCatalogueCake) {
    setBusyCakeId(cake.id);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/catalogue/${cake.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          isActive: !cake.isActive,
          availability: cake.availability,
        }),
      });
      const result = (await response.json()) as { error?: string; cake?: StaffCatalogueCake };

      if (!response.ok || !result.cake) {
        throw new Error(result.error ?? "Unable to update catalogue visibility.");
      }

      setCakes((current) => current.map((currentCake) => currentCake.id === cake.id ? result.cake as StaffCatalogueCake : currentCake));
      setMessage({ tone: "success", text: `${cake.name} is now ${result.cake.isActive ? "visible" : "hidden"} on the public catalogue.` });
    } catch (error) {
      setMessage({ tone: "error", text: error instanceof Error ? error.message : "Unable to update catalogue visibility." });
    } finally {
      setBusyCakeId(null);
    }
  }

  return (
    <div className="container py-16 md:py-24">
      <section className="surface-card mx-auto max-w-6xl p-6 md:p-8">
        <p className="eyebrow">Catalogue</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Product visibility</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          Review catalogue products and control whether each one is active on the public website. Pricing and product details remain unchanged.
        </p>

        {message ? (
          <p className={`mt-5 rounded-md border p-3 text-sm font-medium ${message.tone === "success" ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700" : "border-destructive/40 bg-destructive/5 text-destructive"}`} role="alert">
            {message.text}
          </p>
        ) : null}

        {cakes.length === 0 ? (
          <p className="mt-6 rounded-md border border-dashed p-5 text-sm leading-7 text-muted-foreground">No catalogue products are available.</p>
        ) : (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-[0.14em] text-muted-foreground">
                <tr>
                  <th className="px-3 py-3 font-semibold">Product</th>
                  <th className="px-3 py-3 font-semibold">Category</th>
                  <th className="px-3 py-3 font-semibold">Price</th>
                  <th className="px-3 py-3 font-semibold">Availability</th>
                  <th className="px-3 py-3 font-semibold">Visibility</th>
                  <th className="px-3 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cakes.map((cake) => (
                  <tr key={cake.id}>
                    <td className="px-3 py-4">
                      <p className="font-semibold">{cake.name}</p>
                      <p className="text-xs text-muted-foreground">/{cake.slug}</p>
                    </td>
                    <td className="px-3 py-4 text-muted-foreground">{cake.categoryName}</td>
                    <td className="px-3 py-4">{formatMoney(cake.salePrice ?? cake.basePrice)}</td>
                    <td className="px-3 py-4">{cake.availability === "available" ? "Available" : "Unavailable"}</td>
                    <td className="px-3 py-4">{cake.isActive ? "Visible" : "Hidden"}</td>
                    <td className="px-3 py-4 text-right">
                      <button type="button" className="button button--secondary text-xs" disabled={busyCakeId === cake.id} onClick={() => void updateVisibility(cake)}>
                        {busyCakeId === cake.id ? "Updating..." : cake.isActive ? "Hide" : "Show"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
