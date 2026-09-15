import Link from "next/link";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="border-b border-border bg-background/80">
        <div className="container flex min-h-14 items-center justify-between gap-4">
          <Link href="/admin" className="font-semibold tracking-tight">
            Control center
          </Link>
          <nav aria-label="Control center navigation" className="flex items-center gap-3 text-sm">
            <Link href="/admin" className="nav-link rounded-full px-3 py-2 font-medium hover:bg-muted/70">
              Overview
            </Link>
            <Link href="/admin/orders" className="nav-link rounded-full px-3 py-2 font-medium hover:bg-muted/70">
              Orders
            </Link>
            <Link href="/admin/catalogue" className="nav-link rounded-full px-3 py-2 font-medium hover:bg-muted/70">
              Catalogue
            </Link>
          </nav>
        </div>
      </div>
      {children}
    </>
  );
}
