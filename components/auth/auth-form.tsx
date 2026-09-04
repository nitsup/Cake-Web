"use client";

import Link from "next/link";
import { Globe2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "login" | "signup";

export function AuthForm({ mode, initialError }: { mode: AuthMode; initialError?: string }) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [message, setMessage] = useState<string | null>(null);
  const [existingAccount, setExistingAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setExistingAccount(false);

    if (!email.trim() || !email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }

    if (isSignup && !displayName.trim()) {
      setError("Enter your name.");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      const result = isSignup
        ? await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
              data: { full_name: displayName.trim() },
              emailRedirectTo: `${window.location.origin}/auth/callback?next=/`,
            },
          })
        : await supabase.auth.signInWithPassword({ email: email.trim(), password });

      if (result.error) {
        setError(isSignup ? "We could not create your account." : "Those login details were not accepted.");
        return;
      }

      if (isSignup && !result.data.session) {
        if (result.data.user?.identities?.length === 0) {
          setExistingAccount(true);
        } else {
          setMessage("Check your email to confirm your account, then come back to log in.");
        }
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError(isSignup ? "We could not create your account." : "Those login details were not accepted.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    setMessage(null);
    setIsGoogleLoading(true);

    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/`,
        },
      });

      if (oauthError) {
        setError("We could not start Google login. Please try again.");
      }
    } catch {
      setError("We could not start Google login. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card mx-auto max-w-lg p-6 md:p-8">
      <div className="space-y-2">
        <p className="eyebrow">{isSignup ? "Join the table" : "Welcome back"}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{isSignup ? "Create your account" : "Log in to Cake Web"}</h1>
        <p className="text-sm leading-6 text-muted-foreground">{isSignup ? "Save your place for what comes next." : "Continue to your Cake Web experience."}</p>
      </div>
      <div className="mt-8 grid gap-5">
        {isSignup ? (
          <label className="grid gap-2 text-sm font-semibold" htmlFor="display-name">
            Display name
            <input id="display-name" name="displayName" type="text" autoComplete="name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="min-h-11 rounded-md border bg-background px-3 font-normal outline-none focus:ring-2 focus:ring-accent/40" required />
          </label>
        ) : null}
        <label className="grid gap-2 text-sm font-semibold" htmlFor="email">
          Email
          <input id="email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="min-h-11 rounded-md border bg-background px-3 font-normal outline-none focus:ring-2 focus:ring-accent/40" required />
        </label>
        <label className="grid gap-2 text-sm font-semibold" htmlFor="password">
          Password
          <input id="password" name="password" type="password" autoComplete={isSignup ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} className="min-h-11 rounded-md border bg-background px-3 font-normal outline-none focus:ring-2 focus:ring-accent/40" required />
        </label>
      </div>
      {error ? <p className="mt-5 text-sm font-semibold text-accent" role="alert">{error}</p> : null}
      {existingAccount ? <p className="mt-5 text-sm font-semibold text-accent" role="alert">An account already exists with this email. Please <Link href="/login" className="underline underline-offset-2">log in</Link> to continue.</p> : null}
      {message ? <p className="mt-5 text-sm font-semibold text-accent" role="status">{message}</p> : null}
      <button type="submit" className="button button--primary mt-6 w-full" disabled={isLoading || isGoogleLoading}>{isLoading ? "Please wait..." : isSignup ? "Create account" : "Log in"}</button>
      {!isSignup ? <>
        <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>
        <button type="button" className="button button--secondary w-full" onClick={handleGoogleLogin} disabled={isLoading || isGoogleLoading}><Globe2 size={18} aria-hidden="true" />{isGoogleLoading ? "Connecting..." : "Continue with Google"}</button>
      </> : null}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isSignup ? "Already have an account? " : "New to Cake Web? "}
        <Link href={isSignup ? "/login" : "/signup"} className="font-bold text-accent">{isSignup ? "Log in" : "Create an account"}</Link>
      </p>
    </form>
  );
}