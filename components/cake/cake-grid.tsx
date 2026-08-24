import { CakeCard } from "@/components/cake/cake-card";
import type { CakeSummary } from "@/types/cake";

interface CakeGridProps {
  cakes: CakeSummary[];
}

export function CakeGrid({ cakes }: CakeGridProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {cakes.map((cake) => (
        <CakeCard
          key={cake.id}
          name={cake.name}
          description={cake.shortDescription}
          category={cake.category.name}
          href={`/cakes/${cake.slug}`}
        />
      ))}
    </div>
  );
}
