import Link from "next/link";
import { GitBranch, Mail, Phone } from "lucide-react";

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
            <Link href="/categories" className="footer-link">Categories</Link>
            <Link href="/about" className="footer-link">Our story</Link>
          </nav>
        </div>
        <div>
          <h2 className="footer-heading">Contact</h2>
          <div className="mt-4 flex flex-col items-start gap-3 text-sm">
            <a href="tel:9958813860" className="footer-link inline-flex items-center gap-2"><Phone size={15} aria-hidden="true" />9958813860</a>
            <a href="mailto:akshat09058@gmail.com" className="footer-link inline-flex items-center gap-2"><Mail size={15} aria-hidden="true" />akshat09058@gmail.com</a>
            <a href="https://github.com/nitsup" target="_blank" rel="noreferrer" className="github-profile-card">
              <GitBranch size={22} aria-hidden="true" />
              <span><strong>Night</strong><small>@nitsup</small></span>
            </a>
          </div>
        </div>
      </div>
      <div className="container border-t border-border py-5 text-xs text-muted-foreground">© 2026 Cake Web. Temporary foundation.</div>
    </footer>
  );
}
