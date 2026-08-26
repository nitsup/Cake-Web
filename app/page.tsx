import Link from "next/link";
import { ArrowRight, Leaf, Sparkles, Wheat } from "lucide-react";
import { CakeCard } from "@/components/cake/cake-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { getLocalPrimaryImageUrl, getPublicCakes } from "@/services/cake-catalog";

const categories = ["Celebration cakes", "Small gatherings", "Seasonal bakes"];

export default async function Home() {
  const featuredCakes = await getPublicCakes().catch(() => []);

  return (
    <div className="overflow-hidden">
      <section className="hero-band">
        <div className="container grid gap-10 py-16 md:grid-cols-[.9fr_1.1fr] md:items-center md:py-24 lg:py-28">
          <Reveal><p className="eyebrow">A temporary storefront</p><h1 className="display-heading mt-5 max-w-xl">Cakes with a little more feeling.</h1><p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">Thoughtful cakes for the tables, milestones, and ordinary Tuesdays that deserve something lovely.</p><div className="mt-8 flex flex-wrap items-center gap-3"><Link href="/cakes" className="button button--primary">See the collection <ArrowRight size={17} aria-hidden="true" /></Link><Link href="#story" className="button button--secondary">Our approach</Link></div></Reveal>
          <Reveal delay={0.12}><div className="hero-image-wrap"><ImagePlaceholder alt="Temporary hero image placeholder for a celebration cake" className="aspect-[5/4]" priority /><p className="hero-image-note">Final photography arriving soon</p></div></Reveal>
        </div>
      </section>
      <section id="featured" className="container py-16 md:py-24"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><SectionHeading eyebrow="A first look" title="Made for the middle of the table." description="A placeholder collection to establish the rhythm of the storefront while the final cakes and photography are prepared." /><Link href="/cakes" className="inline-flex items-center gap-2 text-sm font-bold text-accent">Browse all <ArrowRight size={16} aria-hidden="true" /></Link></div><div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{featuredCakes.map((cake, index) => <Reveal key={cake.id} delay={index * 0.08}><CakeCard name={cake.name} description={cake.shortDescription} category={cake.category.name} href={`/cakes/${cake.slug}`} imageUrl={getLocalPrimaryImageUrl(cake.slug) ?? cake.primaryImage?.url} imageAlt={cake.primaryImage?.altText} /></Reveal>)}</div></section>
      <section className="border-y border-border bg-muted/60 py-16 md:py-24"><div className="container"><SectionHeading eyebrow="Find your occasion" title="A cake for the shape of the day." /><div className="mt-10 grid gap-3 sm:grid-cols-3">{categories.map((category, index) => <Link href="#featured" key={category} className="category-tile"><span>0{index + 1}</span><strong>{category}</strong><ArrowRight size={18} aria-hidden="true" /></Link>)}</div></div></section>
      <section id="story" className="container grid gap-10 py-16 md:grid-cols-[.85fr_1.15fr] md:items-center md:py-24"><Card className="overflow-hidden p-2"><ImagePlaceholder alt="Temporary image placeholder for the cake studio" className="aspect-[4/5]" /></Card><div className="max-w-xl md:pl-8"><SectionHeading eyebrow="Our approach" title="Simple ingredients. Considered details." description="This space will hold the studio story once the brand direction arrives. For now, it keeps the experience warm, clear, and ready for the real thing." /><Link href="#contact" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-accent">Read the story <ArrowRight size={16} aria-hidden="true" /></Link></div></section>
      <section className="border-y border-border bg-surface py-16 md:py-20"><div className="container"><SectionHeading eyebrow="The good stuff" title="A few things we care about." /><div className="mt-10 grid gap-8 md:grid-cols-3"><div className="feature-item"><Leaf size={24} aria-hidden="true" /><h3>Thoughtful by nature</h3><p>Room for seasonal choices and a lighter footprint.</p></div><div className="feature-item"><Wheat size={24} aria-hidden="true" /><h3>Made with care</h3><p>Familiar ingredients, patient craft, beautiful results.</p></div><div className="feature-item"><Sparkles size={24} aria-hidden="true" /><h3>Worth gathering for</h3><p>Small details that make a shared moment feel special.</p></div></div></div></section>
      <section className="container py-16 md:py-24"><div className="final-cta"><p className="eyebrow">The next chapter</p><h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">Something beautiful is in the oven.</h2><p className="mt-4 max-w-xl leading-7 text-muted-foreground">The final collection is on its way. Keep this space close for new cakes, studio notes, and thoughtful celebrations.</p><Link href="#contact" className="button button--primary mt-8">Stay close <ArrowRight size={17} aria-hidden="true" /></Link></div></section>
    </div>
  );
}
