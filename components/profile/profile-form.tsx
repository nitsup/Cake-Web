"use client";

import { motion } from "motion/react";
import { FormEvent, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { Profile } from "@/types/profile";

const usernamePattern = /^[a-z0-9](?:[a-z0-9_]{1,28}[a-z0-9])?$/;

function validateProfile(values: {
  displayName: string;
  username: string;
  bio: string;
  website: string;
}) {
  if (!values.displayName.trim() || values.displayName.trim().length > 80) {
    return "Display name must be between 1 and 80 characters.";
  }

  if (values.username && !usernamePattern.test(values.username)) {
    return "Username must be 3–30 characters using lowercase letters, numbers, or underscores.";
  }

  if (values.bio.length > 500) {
    return "About must be 500 characters or fewer.";
  }

  if (values.website && !/^https?:\/\/\S+$/i.test(values.website)) {
    return "Website must start with http:// or https://.";
  }

  return null;
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const prefersReducedMotion = useReducedMotion();
  const [displayName, setDisplayName] = useState(profile.displayName ?? "");
  const [username, setUsername] = useState(profile.username ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [website, setWebsite] = useState(profile.website ?? "");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const values = {
      displayName: displayName.trim(),
      username: username.trim().toLowerCase(),
      bio: bio.trim(),
      website: website.trim(),
    };
    const validationError = validateProfile(values);

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "We could not save your profile. Please try again.");
        return;
      }

      setDisplayName(values.displayName);
      setUsername(values.username);
      setBio(values.bio);
      setWebsite(values.website);
      setMessage("Your profile has been saved.");
    } catch {
      setError("We could not save your profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card p-6 md:p-8">
      <div className="grid gap-5">
        <label className="grid gap-2 text-sm font-semibold" htmlFor="display-name">
          Display name
          <input
            id="display-name"
            name="displayName"
            type="text"
            autoComplete="name"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            className="min-h-11 rounded-md border bg-background px-3 font-normal outline-none focus:ring-2 focus:ring-accent/40"
            maxLength={80}
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold" htmlFor="username">
          Username
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value.toLowerCase())}
            className="min-h-11 rounded-md border bg-background px-3 font-normal outline-none focus:ring-2 focus:ring-accent/40"
            minLength={3}
            maxLength={30}
            pattern="[a-z0-9_]{3,30}"
            aria-describedby="username-help"
          />
          <span id="username-help" className="text-xs font-normal text-muted-foreground">
            3–30 lowercase letters, numbers, or underscores.
          </span>
        </label>
        <label className="grid gap-2 text-sm font-semibold" htmlFor="bio">
          About
          <textarea
            id="bio"
            name="bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            className="min-h-32 rounded-md border bg-background px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-accent/40"
            maxLength={500}
            rows={5}
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold" htmlFor="website">
          Personal website
          <input
            id="website"
            name="website"
            type="url"
            inputMode="url"
            autoComplete="url"
            placeholder="https://example.com"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            className="min-h-11 rounded-md border bg-background px-3 font-normal outline-none focus:ring-2 focus:ring-accent/40"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold" htmlFor="email">
          Email
          <input id="email" type="email" value={profile.email ?? ""} className="min-h-11 rounded-md border bg-muted px-3 font-normal text-muted-foreground outline-none" readOnly />
          <span className="text-xs font-normal text-muted-foreground">Email is managed through your account settings.</span>
        </label>
      </div>
      {error ? <p className="mt-5 text-sm font-semibold text-accent" role="alert">{error}</p> : null}
      {message ? <p className="mt-5 text-sm font-semibold text-foreground" role="status">{message}</p> : null}
      <motion.button
        type="submit"
        className="button button--primary mt-6 w-full sm:w-auto"
        disabled={isSaving}
        whileHover={prefersReducedMotion ? undefined : { y: -1 }}
        whileTap={prefersReducedMotion ? undefined : { y: 1, scale: 0.99 }}
        transition={{ duration: 0.16, ease: "easeOut" }}
      >
        {isSaving ? "Saving..." : "Save profile"}
      </motion.button>
    </form>
  );
}
