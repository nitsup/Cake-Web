import Link from "next/link";
import { CakeSlice, ClipboardList, ContactRound, Search, ShoppingCart } from "lucide-react";
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
            <Link key={href} href={href} className="nav-link inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-2 text-sm font-medium transition-colors hover:border-border hover:bg-muted/70">
              <Icon size={16} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <MobileNavigation />
      </div>
    </header>
  );
}
