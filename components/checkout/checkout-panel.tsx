"use client";

import Link from "next/link";
import { Check, Copy, CopyCheck } from "lucide-react";
import { useState } from "react";
import type { CheckoutPreparation, CheckoutPreparationItem } from "@/services/checkout";

function formatMoney(value: number) {
  return `₹${value.toFixed(2)}`;
}

export function CheckoutPanel({ initialPreparation }: { initialPreparation: CheckoutPreparation }) {
  const preparation = initialPreparation;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function copyOrderId() {
    if (!orderId) return;
    try {
      await navigator.clipboard.writeText(orderId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  async function placeOrder() {
    setError(null);
    setSuccess(null);
    setOrderId(null);
    setCopied(false);
    if (!preparation.canProceed) {
      setError(preparation.errors[0] ?? "Your cart is not ready for checkout.");
      return;
    }

    setIsSubmitting(true);
    try {
      const idempotencyKey = crypto.randomUUID();
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idempotencyKey, cartRevision: preparation.cartRevision }),
      });
      const result = (await response.json()) as { order?: { orderNumber?: string; id?: string }; error?: string };
      if (!response.ok || !result.order) {
        throw new Error(result.error ?? "Unable to place your order.");
      }
      const createdId = result.order.orderNumber ?? result.order.id ?? "Order";
      setOrderId(createdId);
      setSuccess("Your order has been created.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to place your order.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="surface-card mx-auto max-w-4xl p-6 md:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Checkout</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Review your order</h1>
        </div>
        <Link href="/cart" className="button button--ghost text-sm">
          Back to cart
        </Link>
      </div>

      {preparation.valid && preparation.items.length > 0 ? (
        <>
          <div className="mt-8 grid gap-4">
            {preparation.items.map((item: CheckoutPreparationItem) => (
              <div key={item.cartItemId} className="flex flex-wrap items-center justify-between gap-4 rounded-md border p-4">
                <div>
                  <p className="font-semibold">{item.cakeName}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.quantity} × {formatMoney(item.unitPrice)}
                  </p>
                </div>
                <p className="font-semibold">{formatMoney(item.lineTotal)}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t pt-5">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Subtotal</span>
              <span>{formatMoney(preparation.subtotal)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatMoney(preparation.total)}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-8 rounded-md border border-dashed p-6">
          <p className="text-lg font-semibold text-foreground">This cart cannot be checked out yet.</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {preparation.errors.length > 0 ? preparation.errors.map((message) => <li key={message}>• {message}</li>) : <li>• Your cart is empty or invalid.</li>}
          </ul>
        </div>
      )}

      {error ? <p className="mt-6 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm font-medium text-destructive" role="alert">{error}</p> : null}
      {success ? (
        <div className="mt-6 rounded-md border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-700">
          <div className="flex items-center gap-2">
            <Check size={16} aria-hidden="true" />
            <span>{success}</span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="rounded-md border border-emerald-500/40 bg-background/70 px-3 py-2 font-mono text-sm text-foreground">{orderId}</div>
            <button type="button" className="button button--ghost inline-flex items-center gap-2 text-xs" onClick={() => void copyOrderId()} aria-label="Copy order ID">
              {copied ? <CopyCheck size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">Prepared {new Date(preparation.preparedAt).toLocaleString()}</div>
        <button
          type="button"
          className="button button--primary sm:w-auto"
          disabled={!preparation.canProceed || isSubmitting}
          onClick={() => void placeOrder()}
        >
          {isSubmitting ? "Placing order..." : "Place Order"}
        </button>
      </div>
    </section>
  );
}
