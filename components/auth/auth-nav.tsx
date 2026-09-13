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

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => setIsAuthenticated(Boolean(data.user)));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setIsAuthenticated(Boolean(session?.user)));
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
    await createClient().auth.signOut();
    setIsAuthenticated(false);
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
          <Link href="/" className="account-menu__item" role="menuitem" onClick={closeMenu}>Home</Link>
          <Link href={isAuthenticated ? "/profile" : "/login"} className="account-menu__item" role="menuitem" onClick={closeMenu}>{isAuthenticated ? "Profile" : "Log in"}</Link>
          <Link href="/preferences" className="account-menu__item" role="menuitem" onClick={closeMenu}>Preferences</Link>
          {isAuthenticated ? <button type="button" className="account-menu__item account-menu__logout" role="menuitem" onClick={handleLogout}>Log out</button> : null}
        </div>
      ) : null}
    </div>
  );
}