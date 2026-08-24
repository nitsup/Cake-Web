import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export default function CakeNotFound() {
  return (
    <div className="container py-16 md:py-24">
      <EmptyState
        title="Cake not found"
        description="This cake is not available in the current collection."
        action={<Link href="/cakes" className="button button--secondary"><ArrowLeft size={16} aria-hidden="true" /> Back to cakes</Link>}
      />
    </div>
  );
}