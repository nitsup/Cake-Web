"use client";

import Link from "next/link";
import { useState } from "react";
import type { Cart } from "@/types/cart";

export function CartPanel({ initialCart }: { initialCart: Cart }) {
  const [cart, setCart] = useState(initialCart);
  const [message, setMessage] = useState<string | null>(null);
  const [busyItemId, setBusyItemId] = useState<string | null>(null);

  async function update(action: Record<string, unknown>, itemId?: string) {
    setMessage(null);
    setBusyItemId(itemId ?? "cart");
    try {
      const response = await fetch("/api/cart", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(action) });
      const result = (await response.json()) as { cart?: Cart; error?: string };
      if (!response.ok || !result.cart) throw new Error(result.error ?? "Unable to update your cart.");
      setCart(result.cart);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update your cart.");
    } finally {
      setBusyItemId(null);
    }
  }

  return (
    <section className="surface-card mx-auto max-w-3xl p-6 md:p-8">
      <div className="flex items-end justify-between gap-4">
        <div><p className="eyebrow">Your cart</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Ready when you are.</h1></div>
        {cart.items.length > 0 ? <button type="button" className="button button--ghost text-sm" onClick={() => void update({ action: "clear" })} disabled={busyItemId !== null}>Clear cart</button> : null}
      </div>
      <div className="mt-8 grid gap-3">
        {cart.items.map((item) => (
          <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 rounded-md border p-4">
            <div><Link href={`/cakes/${item.cakeSlug}`} className="font-semibold hover:text-accent">{item.cakeName}</Link><p className="text-sm text-muted-foreground">₹{item.unitPrice.toFixed(2)} each</p></div>
            <div className="flex items-center gap-2">
              <button type="button" className="icon-button" onClick={() => void update({ action: "update", itemId: item.id, quantity: item.quantity - 1 }, item.id)} disabled={busyItemId !== null || item.quantity <= 1} aria-label={`Decrease ${item.cakeName}`}>−</button>
              <span className="w-6 text-center">{item.quantity}</span>
              <button type="button" className="icon-button" onClick={() => void update({ action: "update", itemId: item.id, quantity: item.quantity + 1 }, item.id)} disabled={busyItemId !== null || item.quantity >= 20} aria-label={`Increase ${item.cakeName}`}>+</button>
              <button type="button" className="button button--ghost text-sm" onClick={() => void update({ action: "remove", itemId: item.id }, item.id)} disabled={busyItemId !== null}>Remove</button>
            </div>
          </div>
        ))}
        {cart.items.length === 0 ? <p className="text-muted-foreground">Your cart is empty. Browse the collection to add a cake.</p> : null}
      </div>
      <div className="mt-8 flex items-center justify-between border-t pt-5 text-lg font-semibold"><span>Current subtotal</span><span>₹{cart.subtotal.toFixed(2)}</span></div>
      {message ? <p className="mt-4 text-sm font-semibold text-accent" role="alert">{message}</p> : null}
    </section>
  );
}
