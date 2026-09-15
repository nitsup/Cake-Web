"use client";

export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <div className="container py-16 md:py-24">
      <section className="state-panel state-panel--error mx-auto max-w-2xl">
        <p className="eyebrow">Control center</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">We could not load the control center.</h1>
        <p className="mt-4 leading-7 text-muted-foreground">Refresh the operational view and try again.</p>
        <button type="button" className="button button--secondary mt-6" onClick={reset}>Try again</button>
      </section>
    </div>
  );
}
