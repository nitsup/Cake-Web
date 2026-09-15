"use client";

import Link from "next/link";
import { BookOpenText, CakeSlice, ChevronRight, ClipboardList, ContactRound, Menu, Search, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";

const primaryLinks = [
  { href: "/cakes", label: "Cakes", icon: CakeSlice },
  { href: "/categories", label: "Categories", icon: Search },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
  { href: "/orders", label: "Orders", icon: ClipboardList },
  { href: "/#contact", label: "Contact", icon: ContactRound },
];

const secondaryLinks = [{ href: "/about", label: "Our story", icon: BookOpenText }];

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="icon-button"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-40" aria-hidden={!isOpen}>
          <button type="button" className="absolute inset-0 bg-foreground/25 backdrop-blur-[2px]" onClick={() => setIsOpen(false)} aria-label="Close navigation overlay" />
          <aside id="mobile-menu" className="absolute inset-y-0 left-0 z-50 flex w-[86%] max-w-sm flex-col border-r border-border bg-background shadow-2xl transition-transform duration-200 ease-out motion-reduce:transition-none" style={{ transform: "translateX(0%)" }} aria-label="Mobile navigation">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Menu</p>
              <button type="button" className="icon-button" onClick={() => setIsOpen(false)} aria-label="Close menu">
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Mobile navigation" className="flex flex-1 flex-col gap-2 px-4 py-5">
              {primaryLinks.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className="flex items-center justify-between rounded-md px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted/70" onClick={() => setIsOpen(false)}>
                  <span className="flex items-center gap-3">
                    <Icon size={18} aria-hidden="true" />
                    {label}
                  </span>
                  <ChevronRight size={16} aria-hidden="true" className="text-muted-foreground" />
                </Link>
              ))}

              <div className="mt-5 border-t border-border pt-4">
                <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">More</p>
                {secondaryLinks.map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href} className="mt-2 flex items-center justify-between rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground" onClick={() => setIsOpen(false)}>
                    <span className="flex items-center gap-2">
                      <Icon size={16} aria-hidden="true" />
                      {label}
                    </span>
                    <ChevronRight size={14} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </nav>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
