"use client";

import { useState } from "react";

export function AddToCartButton({ cakeId }: { cakeId: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function addToCart() {
    setStatus("loading");
    setMessage(null);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "add", cakeId, quantity: 1 }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Unable to add this cake to your cart.");
      setStatus("success");
    } catch (error) {
      setStatus("idle");
      setMessage(error instanceof Error ? error.message : "Unable to add this cake to your cart.");
    }
  }

  return (
    <div className="mt-8">
      <button type="button" className="button button--primary" onClick={() => void addToCart()} disabled={status === "loading"}>
        {status === "loading" ? "Adding..." : status === "success" ? "Added to cart" : "Add to cart"}
      </button>
      {status === "success" ? <a href="/cart" className="ml-3 text-sm font-semibold text-accent underline underline-offset-4">View cart</a> : null}
      {message ? <p className="mt-3 text-sm font-semibold text-accent" role="alert">{message}</p> : null}
    </div>
  );
}
