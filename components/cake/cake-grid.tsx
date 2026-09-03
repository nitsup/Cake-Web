import { CakeCard } from "@/components/cake/cake-card";
import { getLocalPrimaryImageUrl } from "@/lib/local-cake-images";
import { Reveal } from "@/components/ui/reveal";
import type { CakeSummary } from "@/types/cake";

interface CakeGridProps {
  cakes: CakeSummary[];
  animated?: boolean;
}

export function CakeGrid({ cakes, animated = false }: CakeGridProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {cakes.map((cake, index) => (
        animated ? <Reveal key={cake.id} delay={index * 0.07}>
          <CakeCard
            name={cake.name}
            description={cake.shortDescription}
            category={cake.category.name}
            href={`/cakes/${cake.slug}`}
            imageUrl={getLocalPrimaryImageUrl(cake.slug) ?? cake.primaryImage?.url}
            imageAlt={cake.primaryImage?.altText}
          />
        </Reveal> : <CakeCard
          key={cake.id}
          name={cake.name}
          description={cake.shortDescription}
          category={cake.category.name}
          href={`/cakes/${cake.slug}`}
          imageUrl={getLocalPrimaryImageUrl(cake.slug) ?? cake.primaryImage?.url}
          imageAlt={cake.primaryImage?.altText}
        />
      ))}
    </div>
  );
}
