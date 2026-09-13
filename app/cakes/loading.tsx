import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container py-16 md:py-24" aria-busy="true" aria-label="Loading cakes">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-5 h-12 max-w-md" />
      <Skeleton className="mt-4 h-5 max-w-xl" />
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="aspect-[4/3]" />)}
      </div>
    </div>
  );
}
