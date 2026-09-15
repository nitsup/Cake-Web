"use client";

import Link from "next/link";
import type { OrderHistoryOrder } from "@/services/order-history";

function formatMoney(value: number) {
  return `₹${value.toFixed(2)}`;
}

export function OrderHistoryPanel({ initialOrders }: { initialOrders: OrderHistoryOrder[] }) {
  const orders = initialOrders;

  return (
    <div className="container py-16 md:py-24">
      <section className="surface-card mx-auto max-w-5xl p-6 md:p-8">
        <p className="eyebrow">Orders</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Your order history</h1>

        {orders.length === 0 ? (
          <div className="mt-6 rounded-md border border-dashed p-5 text-sm leading-7 text-muted-foreground">
            You have no orders yet. Once you place an order, it will appear here.
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {orders.map((order) => (
              <article key={order.id} className="rounded-lg border border-border bg-background/70 p-5">
                <div className="flex flex-col gap-3 border-b border-border pb-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">{order.orderNumber}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Placed {new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
                      {order.customerStatusLabel}
                    </span>
                    <span className="text-sm text-muted-foreground">{order.paymentStatus}</span>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {order.items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No items recorded for this order.</p>
                  ) : (
                    order.items.map((item) => (
                      <div key={item.id} className="flex flex-col gap-2 rounded-md border border-border/80 p-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-medium text-foreground">{item.itemName}</p>
                          <p className="text-sm text-muted-foreground">{item.quantity} × {formatMoney(item.unitPrice)}</p>
                        </div>
                        <div className="text-sm font-medium text-foreground">{formatMoney(item.lineTotal)}</div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 text-sm md:flex-row md:items-center md:justify-between">
                  <span className="text-muted-foreground">{order.itemCount} item{order.itemCount === 1 ? "" : "s"}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-foreground">Total {formatMoney(order.total)}</span>
                    {order.canCancel ? (
                      <Link href={`/orders/${order.id}/cancel`} className="button button--ghost text-xs">
                        Cancel order
                      </Link>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
