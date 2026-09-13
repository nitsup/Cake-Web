import { CakeSearch } from "@/components/cake/cake-search";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublicCakes } from "@/services/cake-catalog";

export const metadata = {
  title: "Categories",
  description: "Search the Cake Web collection by cake name, flavor, or occasion.",
};

export default async function CategoriesPage() {
  const cakes = await getPublicCakes();

  return (
    <div>
      <section className="border-b border-border bg-muted/60">
        <div className="container py-16 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Find your cake"
              title="A simple way into the collection."
              description="Search the current collection by cake name, the details in its description, or the occasion it belongs to."
            />
          </Reveal>
        </div>
      </section>
      <section className="container py-12 md:py-16" aria-labelledby="categories-heading">
        <h2 id="categories-heading" className="sr-only">Search the cake collection</h2>
        <Reveal delay={0.08}>
          <CakeSearch cakes={cakes} />
        </Reveal>
      </section>
    </div>
  );
}