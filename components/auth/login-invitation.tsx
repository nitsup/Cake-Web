"use client";

import Link from "next/link";
import { CakeSlice, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const DISMISSED_KEY = "cake-web-login-invitation-dismissed";
const INVITATION_DELAY = 12_000;

export function LoginInvitation() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();
    let disposed = false;
    let authEventReceived = false;
    let showTimer: number | undefined;

    function clearShowTimer() {
      if (showTimer !== undefined) {
        window.clearTimeout(showTimer);
        showTimer = undefined;
      }
    }

    function wasDismissed() {
      try {
        return window.localStorage.getItem(DISMISSED_KEY) === "true";
      } catch (error) {
        console.warn("Could not read the login invitation preference.", error);
        return false;
      }
    }

    function hideImmediately() {
      clearShowTimer();
      if (closeTimer.current !== undefined) window.clearTimeout(closeTimer.current);
      setIsVisible(false);
      setIsClosing(false);
    }

    function scheduleInvitation() {
      clearShowTimer();
      if (wasDismissed()) return;
      showTimer = window.setTimeout(() => {
        if (!disposed) setIsVisible(true);
      }, INVITATION_DELAY);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      authEventReceived = true;
      if (session?.user) {
        hideImmediately();
      } else {
        scheduleInvitation();
      }
    });

    void supabase.auth.getUser().then(({ data, error }) => {
      if (disposed || authEventReceived) return;
      if (error) {
        console.error("Could not verify the visitor's authentication state.", error);
        return;
      }
      if (data.user) {
        hideImmediately();
      } else {
        scheduleInvitation();
      }
    }).catch((error: unknown) => {
      if (!disposed) console.error("Could not verify the visitor's authentication state.", error);
    });

    return () => {
      disposed = true;
      clearShowTimer();
      if (closeTimer.current !== undefined) window.clearTimeout(closeTimer.current);
      subscription.unsubscribe();
    };
  }, []);

  function dismiss() {
    try {
      window.localStorage.setItem(DISMISSED_KEY, "true");
    } catch (error) {
      console.warn("Could not save the login invitation preference.", error);
    }
    if (closeTimer.current !== undefined) window.clearTimeout(closeTimer.current);
    setIsClosing(true);
    closeTimer.current = window.setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      closeTimer.current = undefined;
    }, 220);
  }

  if (!isVisible) return null;

  return (
    <aside
      className={`login-invitation${isClosing ? " login-invitation--closing" : ""}`}
      aria-labelledby="login-invitation-title"
    >
      <div className="login-invitation__accent" aria-hidden="true">
        <CakeSlice size={18} />
      </div>
      <div className="login-invitation__content">
        <h2 id="login-invitation-title">Make your Cake Web experience yours</h2>
        <p>Sign in to access your account and enjoy a more personal experience. You can continue browsing as a guest.</p>
        <div className="login-invitation__actions">
          <Link href="/login" className="button button--primary" onClick={() => setIsVisible(false)}>Log in</Link>
          <Link href="/signup" className="button button--secondary" onClick={() => setIsVisible(false)}>Create account</Link>
          <button type="button" className="login-invitation__no-thanks" onClick={dismiss}>No Thanks</button>
        </div>
      </div>
      <button
        type="button"
        className="login-invitation__close"
        aria-label="Dismiss sign-in invitation"
        onClick={dismiss}
      >
        <X size={18} aria-hidden="true" />
      </button>
    </aside>
  );
}
