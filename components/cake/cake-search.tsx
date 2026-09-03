"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { CakeGrid } from "@/components/cake/cake-grid";
import { EmptyState } from "@/components/ui/empty-state";
import type { CakeSummary } from "@/types/cake";

interface CakeSearchProps {
  cakes: CakeSummary[];
}

export function CakeSearch({ cakes }: CakeSearchProps) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredCakes = useMemo(() => {
    if (!normalizedQuery) return cakes;

    return cakes.filter((cake) => [cake.name, cake.shortDescription, cake.category.name].some((value) => value.toLowerCase().includes(normalizedQuery)));
  }, [cakes, normalizedQuery]);

  return (
    <>
      <label htmlFor="cake-search" className="sr-only">Search cakes</label>
      <div className="relative mb-10 max-w-xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} aria-hidden="true" />
        <input
          id="cake-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search cakes, flavors, or occasions"
          className="h-12 w-full rounded-md border border-border bg-surface pl-11 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-focus"
        />
      </div>
      {filteredCakes.length > 0 ? (
        <CakeGrid cakes={filteredCakes} />
      ) : (
        <EmptyState title="No cakes found" description={`Nothing matches “${query.trim()}”. Try a cake name, flavor, or occasion.`} />
      )}
    </>
  );
}