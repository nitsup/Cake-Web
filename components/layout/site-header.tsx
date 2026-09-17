import Link from "next/link";
import { CakeSlice, ClipboardList, ContactRound, FileText, Search, ShoppingCart } from "lucide-react";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { AuthNav } from "@/components/auth/auth-nav";

const links = [
  { href: "/cakes", label: "Cakes", icon: CakeSlice },
  { href: "/categories", label: "Categories", icon: Search },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
  { href: "/orders", label: "Orders", icon: ClipboardList },
  { href: "/#contact", label: "Contact", icon: ContactRound },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container flex h-20 items-center justify-between gap-4">
        <AuthNav />
        <nav aria-label="Primary navigation" className="hidden items-center gap-3 md:flex">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={`nav-link inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-2 transition-colors hover:border-border hover:bg-muted/70 ${label === "Contact" ? "nav-link--secondary text-xs" : "text-sm font-medium"}`}>
              <Icon size={16} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}
          <Link href="/privacy" className="nav-link nav-link--secondary inline-flex items-center gap-1.5 rounded-full border border-transparent px-2.5 py-1.5 text-xs transition-colors hover:border-border hover:bg-muted/70">
            <FileText size={15} aria-hidden="true" />
            <span>Help</span>
          </Link>
        </nav>
        <MobileNavigation />
      </div>
    </header>
  );
}
