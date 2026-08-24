import { CakeGrid } from "@/components/cake/cake-grid";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublicCakes } from "@/services/cake-catalog";

export const metadata = {
  title: "Cakes",
  description: "Explore the Cake Web collection.",
};

export default async function CakesPage() {
  const cakes = await getPublicCakes();

  return (
    <div>
      <section className="border-b border-border bg-muted/60">
        <div className="container py-16 md:py-24">
          <SectionHeading
            eyebrow="The collection"
            title="Cakes for the good part of the day."
            description="Explore the current collection of cakes made for gatherings, milestones, and the moments between them."
          />
        </div>
      </section>
      <section className="container py-12 md:py-16" aria-labelledby="catalog-heading">
        <h2 id="catalog-heading" className="sr-only">Available cakes</h2>
        {cakes.length > 0 ? (
          <CakeGrid cakes={cakes} />
        ) : (
          <EmptyState
            title="The collection is resting"
            description="There are no cakes available right now. Please check back soon."
          />
        )}
      </section>
    </div>
  );
}
