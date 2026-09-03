import { CakeSearch } from "@/components/cake/cake-search";
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
          <SectionHeading
            eyebrow="Find your cake"
            title="A simple way into the collection."
            description="Search the current collection by cake name, the details in its description, or the occasion it belongs to."
          />
        </div>
      </section>
      <section className="container py-12 md:py-16" aria-labelledby="categories-heading">
        <h2 id="categories-heading" className="sr-only">Search the cake collection</h2>
        <CakeSearch cakes={cakes} />
      </section>
    </div>
  );
}