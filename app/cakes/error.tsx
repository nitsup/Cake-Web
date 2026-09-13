"use client";

import { ErrorState } from "@/components/ui/error-state";

export default function CakesError() {
  return (
    <div className="container py-16 md:py-24">
      <ErrorState
        title="The collection is taking a moment"
        description="We could not load the cakes right now. Please try again later."
      />
    </div>
  );
}