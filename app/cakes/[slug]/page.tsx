import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { getPublicCakeBySlug } from "@/services/cake-catalog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";

interface CakeDetailPageProps {
  params: Promise<{ slug: string }>;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);
}

export async function generateMetadata({ params }: CakeDetailPageProps) {
  const { slug } = await params;
  const cake = await getPublicCakeBySlug(slug);

  return cake
    ? { title: cake.name, description: cake.shortDescription }
    : { title: "Cake not found" };
}

export default async function CakeDetailPage({ params }: CakeDetailPageProps) {
  const { slug } = await params;
  const cake = await getPublicCakeBySlug(slug);

  if (!cake) {
    notFound();
  }

  const hasSalePrice = cake.salePrice !== null;

  return (
    <article>
      <div className="container py-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/cakes" className="inline-flex items-center gap-2 hover:text-foreground"><ArrowLeft size={16} aria-hidden="true" /> Cakes</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="truncate text-foreground">{cake.name}</span>
        </nav>
      </div>
      <section className="container grid gap-10 pb-16 md:grid-cols-[1.05fr_.95fr] md:items-start md:pb-24">
        <Card className="overflow-hidden p-2"><ImagePlaceholder src={cake.primaryImage?.url} alt={cake.primaryImage?.altText ?? `${cake.name} image placeholder`} className="aspect-[4/3]" priority /></Card>
        <div className="pt-2 md:pt-6">
          <Badge>{cake.category.name}</Badge>
          <h1 className="display-heading mt-5 max-w-xl text-5xl md:text-6xl">{cake.name}</h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">{cake.shortDescription}</p>
          <div className="mt-8 flex flex-wrap items-baseline gap-3" aria-label="Price">
            <span className="text-2xl font-semibold">{formatPrice(cake.salePrice ?? cake.basePrice)}</span>
            {hasSalePrice ? <span className="text-sm text-muted-foreground line-through">{formatPrice(cake.basePrice)}</span> : null}
          </div>
          <p className="mt-3 text-sm font-semibold text-accent">Available for future enquiries</p>
        </div>
      </section>
      <section className="border-y border-border bg-muted/60">
        <div className="container grid gap-10 py-14 md:grid-cols-[1.15fr_.85fr] md:py-20">
          <div><p className="eyebrow">A closer look</p><h2 className="mt-3 text-2xl font-semibold tracking-tight">Made for the moment.</h2><p className="mt-5 max-w-2xl whitespace-pre-line leading-8 text-muted-foreground">{cake.fullDescription ?? cake.shortDescription}</p></div>
          <Card className="p-6"><Sparkles size={24} className="text-accent" aria-hidden="true" /><h2 className="mt-5 text-xl font-semibold">Make it yours</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Customization options will appear here once the future cake configuration experience is ready.</p><Link href="#contact" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-accent">Ask about this cake <ArrowRight size={16} aria-hidden="true" /></Link></Card>
        </div>
      </section>
      <section className="container py-12 md:py-16"><Link href="/cakes" className="inline-flex items-center gap-2 text-sm font-bold text-accent"><ArrowLeft size={16} aria-hidden="true" /> Back to all cakes</Link></section>
    </article>
  );
}