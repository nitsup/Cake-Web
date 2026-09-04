"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { AuthNav } from "@/components/auth/auth-nav";

const links = [
  { href: "/cakes", label: "Cakes" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "Our story" },
  { href: "/#contact", label: "Contact" },
];

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

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
        <div id="mobile-menu" className="absolute inset-x-0 top-full border-b border-border bg-background px-6 py-5 shadow-popover">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="mobile-nav-link" onClick={() => setIsOpen(false)}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 border-t border-border pt-4"><AuthNav /></div>
        </div>
      ) : null}
    </div>
  );
}
