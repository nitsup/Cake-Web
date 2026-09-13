"use client";

import { Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { CakeGrid } from "@/components/cake/cake-grid";
import { EmptyState } from "@/components/ui/empty-state";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { CakeSummary } from "@/types/cake";

interface CakeSearchProps {
  cakes: CakeSummary[];
}

export function CakeSearch({ cakes }: CakeSearchProps) {
  const [query, setQuery] = useState("");
  const prefersReducedMotion = useReducedMotion();
  const normalizedQuery = query.trim().toLowerCase();
  const filteredCakes = useMemo(() => {
    if (!normalizedQuery) return cakes;

    return cakes.filter((cake) => [cake.name, cake.shortDescription, cake.category.name].some((value) => value.toLowerCase().includes(normalizedQuery)));
  }, [cakes, normalizedQuery]);

  return (
    <>
      <label htmlFor="cake-search" className="sr-only">Search cakes</label>
      <div className="search-area mb-10 max-w-xl">
        <div className="search-field-wrap">
          <Search className="search-icon pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} aria-hidden="true" />
        <input
          id="cake-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search cakes, flavors, or occasions"
          className="search-field h-12 w-full rounded-md border border-border bg-surface pl-11 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-focus"
        />
        </div>
        <div className="suggestions" aria-label="Search suggestions">
          <span className="suggestions__label">Try searching for</span>
          <div className="suggestions__list">
            {["Chocolate", "Birthday", "Celebration"].map((suggestion, index) => (
              <motion.button
                key={suggestion}
                type="button"
                className="suggestion-pill"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: prefersReducedMotion ? 0 : index * 0.06, ease: "easeOut" }}
                whileHover={prefersReducedMotion ? undefined : { y: -1, scale: 1.02 }}
                whileTap={prefersReducedMotion ? undefined : { y: 1, scale: 0.97 }}
                onClick={() => setQuery(suggestion)}
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={normalizedQuery || "all-cakes"}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          aria-live="polite"
        >
          {filteredCakes.length > 0 ? (
            <CakeGrid cakes={filteredCakes} animated />
          ) : (
            <EmptyState title="No cakes found" description={`Nothing matches “${query.trim()}”. Try a cake name, flavor, or occasion.`} />
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}