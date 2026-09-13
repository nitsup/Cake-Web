"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { Profile } from "@/types/profile";

export function AvatarCard({ profile }: { profile: Profile }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function uploadAvatar(file: File) {
    setError(null);
    setMessage(null);
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const response = await fetch("/api/profile/avatar", { method: "POST", body: formData });
      const result = (await response.json()) as { error?: string; path?: string };
      if (!response.ok || !result.path) {
        setError(result.error ?? "We could not upload your profile image.");
        return;
      }

      const imageResponse = await fetch(`/api/profile/avatar?path=${encodeURIComponent(result.path)}`);
      const imageResult = (await imageResponse.json()) as { url?: string; error?: string };
      if (!imageResponse.ok || !imageResult.url) {
        setError(imageResult.error ?? "Your image was saved, but could not be displayed yet.");
        return;
      }

      setAvatarUrl(imageResult.url);
      setMessage("Profile picture updated.");
    } catch {
      setError("We could not upload your profile image.");
    } finally {
      setIsSaving(false);
    }
  }

  async function removeAvatar() {
    setError(null);
    setMessage(null);
    setIsSaving(true);
    try {
      const response = await fetch("/api/profile/avatar", { method: "DELETE" });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "We could not remove your profile image.");
        return;
      }
      setAvatarUrl(null);
      setMessage("Profile picture removed.");
    } catch {
      setError("We could not remove your profile image.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="surface-card p-6">
      <p className="eyebrow">Profile picture</p>
      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted text-2xl font-semibold text-muted-foreground">
          {avatarUrl ? <img src={avatarUrl} alt="Your profile" className="h-full w-full object-cover" /> : (profile.displayName?.[0] ?? "?").toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-semibold">Make this space yours.</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">JPG, PNG, or WebP up to 5 MB.</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <motion.button
          type="button"
          className="button button--secondary"
          onClick={() => inputRef.current?.click()}
          disabled={isSaving}
          whileHover={prefersReducedMotion ? undefined : { y: -1 }}
          whileTap={prefersReducedMotion ? undefined : { y: 1, scale: 0.99 }}
        >
          {isSaving ? "Saving..." : "Choose image"}
        </motion.button>
        {avatarUrl ? <button type="button" className="button button--ghost" onClick={removeAvatar} disabled={isSaving}>Remove</button> : null}
      </div>
      <input ref={inputRef} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadAvatar(file); event.target.value = ""; }} />
      {error ? <p className="mt-4 text-sm font-semibold text-accent" role="alert">{error}</p> : null}
      {message ? <p className="mt-4 text-sm font-semibold" role="status">{message}</p> : null}
    </div>
  );
}
