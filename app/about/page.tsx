import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";

export const metadata = {
  title: "Our story",
  description: "Learn more about Cake Web and the ideas behind the collection.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-border bg-muted/60">
        <div className="container grid gap-10 py-16 md:grid-cols-[1.05fr_.95fr] md:items-center md:py-24">
          <Reveal>
            <p className="eyebrow">Our story</p>
            <h1 className="display-heading mt-5 max-w-2xl">A thoughtful place for cakes and good company.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Cake Web is a working bakery website and demo built around a simple idea: make room for cakes that belong at the center of a shared moment.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <ImagePlaceholder src="/cakes/table_of_cakes.png" alt="A table of cakes" className="aspect-[5/4]" priority />
          </Reveal>
        </div>
      </section>

      <section className="container grid gap-5 py-16 md:grid-cols-2 md:py-24">
        <Reveal>
          <Card className="h-full p-6 md:p-8">
            <SectionHeading
              eyebrow="What Cake Web is"
              title="A warm, clear home for a growing collection."
              description="The site is also a learning foundation for building a complete bakery experience: a live catalog, cake detail pages, and the small details that make browsing feel considered."
            />
          </Card>
        </Reveal>
        <Reveal delay={0.08}>
          <Card className="h-full p-6 md:p-8">
            <SectionHeading
              eyebrow="The idea"
              title="Keep the good part in focus."
              description="The overall idea is uncomplicated: thoughtful cakes, familiar ingredients, and a welcoming place to find something lovely for gatherings, milestones, and ordinary Tuesdays."
            />
          </Card>
        </Reveal>
      </section>

      <section className="border-y border-border bg-surface py-16 md:py-24">
        <div className="container grid gap-10 md:grid-cols-3">
          <Reveal>
            <SectionHeading
              eyebrow="The collection"
              title="Cakes for sharing."
              description="The current project data and assets represent options including birthday cakes and chocolate cakes. The collection will grow over time."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <SectionHeading
              eyebrow="Where we are"
              title="A digital beginning."
              description="No physical bakery location or address is published in the current project materials, so Cake Web keeps this space focused on the collection and the experience."
            />
          </Reveal>
          <Reveal delay={0.16}>
            <SectionHeading
              eyebrow="Who works on it"
              title="A bakery project in progress."
              description="The repository describes Cake Web as a working bakery website, demo, and learning environment. It does not currently include named team biographies."
            />
          </Reveal>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="final-cta">
          <p className="eyebrow">Come take a look</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">Find a cake for the moment.</h2>
          <p className="mt-4 max-w-xl leading-7 text-muted-foreground">Browse the current collection or get in touch through the homepage.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/cakes" className="button button--primary">See the collection <ArrowRight size={17} aria-hidden="true" /></Link>
            <Link href="/#contact" className="button button--secondary">Contact</Link>
          </div>
        </div>
      </section>
    </div>
  );
}