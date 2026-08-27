import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";

export interface CakeCardProps {
  name: string;
  description: string;
  category: string;
  href?: string;
  imageUrl?: string | null;
  imageAlt?: string;
}

export function CakeCard({ name, description, category, href = "#contact", imageUrl, imageAlt }: CakeCardProps) {
  return (
    <Card className="cake-card group overflow-hidden p-2">
      <Link href={href} aria-label={`View ${name}`}>
        <ImagePlaceholder src={imageUrl} alt={imageAlt ?? `${name} image`} className="aspect-[4/3]" />
      </Link>
      <div className="p-4 pb-5">
        <Badge>{category}</Badge>
        <div className="mt-4 flex items-start justify-between gap-4">
          <Link href={href} className="min-w-0">
            <h3 className="text-lg font-semibold tracking-tight">{name}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
          </Link>
          <Link href={href} aria-label={`View ${name}`} className="card-arrow">
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
