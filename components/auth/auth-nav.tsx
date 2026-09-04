"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AuthNav() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => setIsAuthenticated(Boolean(data.user)));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setIsAuthenticated(Boolean(session?.user)));
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await createClient().auth.signOut();
    setIsAuthenticated(false);
    router.push("/");
    router.refresh();
  }

  return isAuthenticated ? (
    <button type="button" className="nav-link" onClick={handleLogout}>Log out</button>
  ) : (
    <span className="flex items-center gap-5">
      <Link href="/login" className="nav-link">Log in</Link>
      <Link href="/signup" className="button button--secondary">Sign up</Link>
    </span>
  );
}