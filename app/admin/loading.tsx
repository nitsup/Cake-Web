export default function AdminLoading() {
  return (
    <div className="container py-16 md:py-24" aria-busy="true" aria-live="polite">
      <section className="mx-auto max-w-6xl">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-10 w-64 animate-pulse rounded bg-muted" />
        <div className="mt-3 h-5 max-w-xl animate-pulse rounded bg-muted" />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((item) => <div key={item} className="surface-card h-28 animate-pulse" />)}
        </div>
        <div className="surface-card mt-6 h-64 animate-pulse" />
      </section>
    </div>
  );
}
