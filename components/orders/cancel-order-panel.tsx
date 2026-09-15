"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  customerCancellationReasonLabels,
  customerCancellationReasons,
  type CustomerCancellationReason,
} from "@/services/cancellation-reasons";

export function CancelOrderPanel({
  orderId,
  orderNumber,
}: {
  orderId: string;
  orderNumber: string;
}) {
  const router = useRouter();
  const [reason, setReason] = useState<CustomerCancellationReason | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitCancellation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reason) {
      setError("Select a reason before confirming cancellation.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to cancel this order.");
      }

      router.push("/orders");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to cancel this order.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container py-16 md:py-24">
      <section className="surface-card mx-auto max-w-2xl p-6 md:p-8">
        <p className="eyebrow">Cancel order</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Cancel {orderNumber}?</h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Cancellation is permanent. Choose the reason that best describes why you want to cancel this order.
        </p>

        {error ? (
          <p className="mt-5 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm font-medium text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <form className="mt-6 space-y-5" onSubmit={submitCancellation}>
          <fieldset>
            <legend className="text-sm font-semibold text-foreground">Why are you cancelling?</legend>
            <div className="mt-3 space-y-3">
              {customerCancellationReasons.map((cancellationReason) => (
                <label key={cancellationReason} className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-3">
                  <input
                    type="radio"
                    name="cancellation-reason"
                    value={cancellationReason}
                    checked={reason === cancellationReason}
                    onChange={() => setReason(cancellationReason)}
                    className="mt-1"
                  />
                  <span className="text-sm text-foreground">{customerCancellationReasonLabels[cancellationReason]}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button type="submit" className="button button--primary" disabled={isSubmitting}>
              {isSubmitting ? "Cancelling..." : "Confirm cancellation"}
            </button>
            <button type="button" className="button button--ghost" onClick={() => router.push("/orders")} disabled={isSubmitting}>
              Keep order
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
