import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="container grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="brand-mark"><span className="brand-mark__dot" aria-hidden="true" />Cake Web</p>
          <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">A considered home for future cake collections and studio notes.</p>
        </div>
        <div>
          <h2 className="footer-heading">Explore</h2>
          <nav aria-label="Footer navigation" className="mt-4 flex flex-col items-start gap-3 text-sm">
            <Link href="/cakes" className="footer-link">Cakes</Link>
            <Link href="#story" className="footer-link">Our story</Link>
          </nav>
        </div>
        <div>
          <h2 className="footer-heading">Elsewhere</h2>
          <div className="mt-4 flex flex-col items-start gap-3 text-sm text-muted-foreground">
            <span>Social links coming soon</span>
            <span>Privacy and accessibility</span>
          </div>
        </div>
      </div>
      <div className="container border-t border-border py-5 text-xs text-muted-foreground">© 2026 Cake Web. Temporary foundation.</div>
    </footer>
  );
}
