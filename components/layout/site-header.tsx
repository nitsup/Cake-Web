import Link from "next/link";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { AuthNav } from "@/components/auth/auth-nav";

const links = [
  { href: "/cakes", label: "Cakes" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "Our story" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="brand-mark" aria-label="Cake Web home">
          <span className="brand-mark__dot" aria-hidden="true" />
          Cake Web
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center md:flex"><AuthNav /></div>
        <MobileNavigation />
      </div>
    </header>
  );
}
