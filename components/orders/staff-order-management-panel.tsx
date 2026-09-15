"use client";

import { useState } from "react";
import type { StaffOrderSummary } from "@/services/staff-order-management";

function formatMoney(value: number) {
  return `₹${value.toFixed(2)}`;
}

export function StaffOrderManagementPanel({ initialOrders }: { initialOrders: StaffOrderSummary[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  async function advanceStatus(order: StaffOrderSummary) {
    if (!order.nextStatus) {
      return;
    }

    setBusyOrderId(order.id);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: order.nextStatus }),
      });
      const result = (await response.json()) as { error?: string; order?: Partial<StaffOrderSummary> };

      if (!response.ok || !result.order) {
        throw new Error(result.error ?? "Unable to update this order.");
      }

      setOrders((current) =>
        current.map((currentOrder) => {
          if (currentOrder.id !== order.id) {
            return currentOrder;
          }
          return {
            ...currentOrder,
            status: result.order?.status ?? currentOrder.status,
            customerStatusLabel: result.order?.customerStatusLabel ?? currentOrder.customerStatusLabel,
            nextStatus: result.order?.nextStatus ?? null,
            nextStatusLabel: result.order?.nextStatusLabel ?? null,
          };
        }),
      );

      setMessage({
        tone: "success",
        text: `Order ${order.orderNumber} moved to ${result.order.customerStatusLabel ?? order.nextStatusLabel ?? order.nextStatus}.`,
      });
    } catch (error) {
      setMessage({
        tone: "error",
        text: error instanceof Error ? error.message : "Unable to update this order.",
      });
    } finally {
      setBusyOrderId(null);
    }
  }

  return (
    <div className="container py-16 md:py-24">
      <section className="surface-card mx-auto max-w-6xl p-6 md:p-8">
        <p className="eyebrow">Operations</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Order management</h1>
        <p className="mt-3 text-sm text-muted-foreground">Staff/admin lifecycle updates follow the operational path: Getting Ready → Packaged → Arriving → Delivered.</p>

        {message ? (
          <p
            className={`mt-5 rounded-md border p-3 text-sm font-medium ${
              message.tone === "success"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700"
                : "border-destructive/40 bg-destructive/5 text-destructive"
            }`}
            role="alert"
          >
            {message.text}
          </p>
        ) : null}

        {orders.length === 0 ? (
          <div className="mt-6 rounded-md border border-dashed p-5 text-sm leading-7 text-muted-foreground">
            No orders are currently ready for operational management.
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {orders.map((order) => (
              <article key={order.id} className="rounded-lg border border-border bg-background/70 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">{order.orderNumber}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {order.customerName ?? "Customer"} · {order.customerEmail ?? "No email on file"}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">Placed {new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
                      {order.customerStatusLabel}
                    </span>
                    <span className="text-sm text-muted-foreground">{order.paymentStatus}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 text-sm md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span>{order.itemCount} item{order.itemCount === 1 ? "" : "s"}</span>
                    <span>Total {formatMoney(order.total)}</span>
                  </div>

                  {order.nextStatus ? (
                    <button
                      type="button"
                      className="button button--primary text-xs"
                      disabled={busyOrderId === order.id}
                      onClick={() => void advanceStatus(order)}
                    >
                      {busyOrderId === order.id ? "Updating..." : `Move to ${order.nextStatusLabel}`}
                    </button>
                  ) : (
                    <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Terminal status</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
