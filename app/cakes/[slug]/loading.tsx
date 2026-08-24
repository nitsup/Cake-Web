import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container py-8" aria-busy="true" aria-label="Loading cake">
      <Skeleton className="h-5 w-40" />
      <div className="mt-10 grid gap-10 md:grid-cols-[1.05fr_.95fr]">
        <Skeleton className="aspect-[4/3]" />
        <div><Skeleton className="h-5 w-28" /><Skeleton className="mt-5 h-16 max-w-md" /><Skeleton className="mt-6 h-24 max-w-lg" /><Skeleton className="mt-8 h-8 w-28" /></div>
      </div>
    </div>
  );
}