import { CakeCard } from "@/components/cake/cake-card";
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
            categoryHref={`/cakes?category=${encodeURIComponent(cake.category.slug)}`}
            href={`/cakes/${cake.slug}`}
            imageUrl={cake.primaryImage?.url}
            imageAlt={cake.primaryImage?.altText}
            imagePositionX={cake.primaryImage?.positionX}
            imagePositionY={cake.primaryImage?.positionY}
            imageZoom={cake.primaryImage?.zoom}
          />
        </Reveal> : <CakeCard
          key={cake.id}
          name={cake.name}
          description={cake.shortDescription}
          category={cake.category.name}
          categoryHref={`/cakes?category=${encodeURIComponent(cake.category.slug)}`}
          href={`/cakes/${cake.slug}`}
          imageUrl={cake.primaryImage?.url}
          imageAlt={cake.primaryImage?.altText}
          imagePositionX={cake.primaryImage?.positionX}
          imagePositionY={cake.primaryImage?.positionY}
          imageZoom={cake.primaryImage?.zoom}
        />
      ))}
    </div>
  );
}
