import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";

export default function Home() {
  return (
    <div>
      <section className="container grid gap-10 py-16 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-24">
        <div>
          <Badge>Temporary foundation</Badge>
          <h1 className="display-heading mt-6 max-w-xl">A thoughtful place for beautiful cakes.</h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">The structure is ready for the future collection, studio story, and brand details.</p>
          <Button className="mt-8" type="button">Explore the collection <ArrowRight size={17} aria-hidden="true" /></Button>
        </div>
        <Card className="overflow-hidden p-2">
          <ImagePlaceholder alt="Temporary cake image placeholder" className="aspect-[4/3]" priority />
        </Card>
      </section>
      <section id="cakes" className="border-y border-border bg-muted/60">
        <div className="container py-14">
          <p className="eyebrow">Next chapter</p>
          <h2 id="story" className="mt-3 text-2xl font-semibold tracking-tight">The collection is taking shape.</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">Placeholder content keeps the application navigable while the final visual assets and editorial direction are prepared.</p>
        </div>
      </section>
    </div>
  );
}
