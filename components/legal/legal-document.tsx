import Link from "next/link";
import { legalLinks } from "@/lib/legal-content";

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={index}>{part.slice(2, -2)}</strong>
    ) : (
      part
    ),
  );
}

function renderContent(content: string) {
  return content.split(/\r?\n/).map((line, index) => {
    if (line.startsWith("# ")) {
      return <h1 key={index} className="display-heading mt-6 text-4xl md:text-5xl">{renderInline(line.slice(2))}</h1>;
    }
    if (line.startsWith("## ")) {
      return <h2 key={index} className="mt-10 text-2xl font-semibold tracking-tight">{renderInline(line.slice(3))}</h2>;
    }
    if (line.startsWith("### ")) {
      return <h3 key={index} className="mt-7 text-lg font-semibold">{renderInline(line.slice(4))}</h3>;
    }
    if (line.startsWith("- ")) {
      return <li key={index} className="leading-7 text-muted-foreground">{renderInline(line.slice(2))}</li>;
    }
    if (!line.trim()) return <div key={index} className="h-3" aria-hidden="true" />;
    return <p key={index} className="leading-7 text-muted-foreground">{renderInline(line)}</p>;
  });
}

export function LegalDocument({ title, content }: { title: string; content: string }) {
  return (
    <div className="container grid gap-6 py-10 md:grid-cols-[minmax(0,1fr)_15rem] md:gap-10 md:py-24">
      <aside className="order-first rounded-lg border border-border bg-surface p-5 md:order-last md:sticky md:top-8 md:self-start">
        <h2 className="footer-heading">Legal / Information</h2>
        <nav aria-label="Legal information" className="mt-4 grid gap-2 text-sm sm:grid-cols-2 md:flex md:flex-col">
          {legalLinks.map((link) => (
            <Link key={link.href} href={link.href} className="footer-link rounded-md px-2 py-1.5 hover:bg-muted/70">
              {link.label === title ? <strong>{link.label}</strong> : link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <article className="order-last surface-card p-6 md:order-first md:p-10">
        <p className="eyebrow">Legal information</p>
        <div>{renderContent(content)}</div>
      </article>
    </div>
  );
}
