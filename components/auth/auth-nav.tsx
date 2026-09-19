"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AuthNav() {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [canAccessAdmin, setCanAccessAdmin] = useState(false);
  const [pendingRequests, setPendingRequests] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    async function loadSessionState() {
      const { data } = await supabase.auth.getUser();
      setIsAuthenticated(Boolean(data.user));
      setCanAccessAdmin(false);
      if (data.user) {
        try {
          const sessionResponse = await fetch("/api/profile/session");
          if (!sessionResponse.ok) return;
          const result = await sessionResponse.json() as { canAccessAdmin?: boolean };
          setCanAccessAdmin(Boolean(result.canAccessAdmin));
        } catch {
          return;
        }
        void fetch("/api/partners/pending-count").then((response) => response.json()).then((result: { count?: number }) => setPendingRequests(result.count ?? 0));
      } else {
        setPendingRequests(0);
      }
    }
    void loadSessionState();
    const { data: listener } = supabase.auth.onAuthStateChange(() => void loadSessionState());
    return () => listener.subscription.unsubscribe();
  }, []);

  function openMenu() {
    setIsClosing(false);
    setIsOpen(true);
  }

  const closeMenu = useCallback(() => {
    if (!isOpen || isClosing) return;
    setIsClosing(true);
    window.setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      triggerRef.current?.focus();
    }, 150);
  }, [isClosing, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) closeMenu();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu, isOpen]);

  async function handleLogout() {
    setIsLoggingOut(true);
    const { error } = await createClient().auth.signOut();
    if (error) {
      setIsLoggingOut(false);
      return;
    }
    setIsAuthenticated(false);
    setIsLogoutConfirmOpen(false);
    closeMenu();
    router.push("/");
    router.refresh();
  }

  return (
    <div ref={menuRef} className="account-menu">
      <button
        ref={triggerRef}
        type="button"
        className="brand-mark account-menu__trigger"
        aria-expanded={isOpen}
        aria-controls="account-menu-popover"
        aria-haspopup="menu"
        onClick={() => (isOpen ? closeMenu() : openMenu())}
      >
        <span className="brand-mark__dot" aria-hidden="true" />
        Cake Web
        <span className="account-menu__chevron" aria-hidden="true">⌄</span>
      </button>
      {isOpen ? (
        <div id="account-menu-popover" className={`account-menu__popover${isClosing ? " account-menu__popover--closing" : ""}`} role="menu">
          <div className="account-menu__intro">
            <span className="eyebrow">Your space</span>
            <strong>{isAuthenticated ? "Welcome back" : "Cake Web"}</strong>
          </div>
          {canAccessAdmin ? <Link href="/admin" className="account-menu__item font-semibold text-accent" role="menuitem" onClick={closeMenu}>Admin workspace</Link> : null}
          <Link href="/" className="account-menu__item" role="menuitem" onClick={closeMenu}>Home</Link>
          <Link href={isAuthenticated ? "/profile" : "/login"} className="account-menu__item relative" role="menuitem" onClick={closeMenu}>{isAuthenticated ? "Profile" : "Log in"}{pendingRequests > 0 ? <span className="notification-pulse" aria-label={`${pendingRequests} pending partner requests`}><span>{pendingRequests > 9 ? "9+" : pendingRequests}</span></span> : null}</Link>
          <Link href="/preferences" className="account-menu__item" role="menuitem" onClick={closeMenu}>Preferences</Link>
          {isAuthenticated ? <button type="button" className="account-menu__item account-menu__logout" role="menuitem" onClick={() => setIsLogoutConfirmOpen(true)}>Log out</button> : null}
        </div>
      ) : null}
      {isLogoutConfirmOpen ? (
        <div className="account-menu__dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !isLoggingOut) setIsLogoutConfirmOpen(false); }}>
          <section className="account-menu__dialog" role="alertdialog" aria-modal="true" aria-labelledby="logout-dialog-title" aria-describedby="logout-dialog-description">
            <p className="eyebrow">Log out</p>
            <h2 id="logout-dialog-title" className="mt-2 text-xl font-semibold">Leave Cake Web?</h2>
            <p id="logout-dialog-description" className="mt-3 text-sm leading-6 text-muted-foreground">Are you sure you want to log out?</p>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" className="button button--secondary" onClick={() => setIsLogoutConfirmOpen(false)} disabled={isLoggingOut}>Cancel</button>
              <button type="button" className="button account-menu__confirm-logout" onClick={() => void handleLogout()} disabled={isLoggingOut}>{isLoggingOut ? "Logging out..." : "Log out"}</button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}