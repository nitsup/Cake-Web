"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { PartnerRelationship, PublicProfile } from "@/types/social";

export function SocialPanel({
  initialRelationships,
  currentUserId,
}: {
  initialRelationships: PartnerRelationship[];
  currentUserId: string;
}) {
  const [query, setQuery] = useState("");
  const [profiles, setProfiles] = useState<PublicProfile[]>([]);
  const [relationships, setRelationships] = useState(initialRelationships);
  const [message, setMessage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [requestingUserId, setRequestingUserId] = useState<string | null>(null);
  const [requestedUserIds, setRequestedUserIds] = useState<Set<string>>(new Set());
  const [pendingRemoval, setPendingRemoval] = useState<PublicProfile | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const acceptedPartnerCount = relationships.filter((relationship) => relationship.status === "accepted").length;

  async function search(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (query.trim().length < 2) return;
    setIsSearching(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/profile/search?q=${encodeURIComponent(query.trim())}`);
      const result = (await response.json()) as { profiles?: PublicProfile[]; error?: string };
      if (!response.ok) {
        setMessage(result.error ?? "We could not search profiles.");
        return;
      }
      setProfiles(result.profiles ?? []);
    } catch {
      setMessage("We could not search profiles.");
    } finally {
      setIsSearching(false);
    }
  }

  async function sendAction(body: { action: string; userId?: string; relationshipId?: string }) {
    setMessage(null);
    if (body.action === "request" && body.userId) setRequestingUserId(body.userId);
    const response = await fetch("/api/partners", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) {
      setMessage(result.error ?? "We could not update that connection.");
      setRequestingUserId(null);
      return;
    }
    const refreshed = await fetch("/api/partners");
    const refreshedResult = (await refreshed.json()) as { relationships?: PartnerRelationship[] };
    setRelationships(refreshedResult.relationships ?? []);
    setMessage("Partner connections updated.");
    const requestedUserId = body.action === "request" ? body.userId : undefined;
    if (requestedUserId) {
      setRequestedUserIds((current) => new Set(current).add(requestedUserId));
    }
    setRequestingUserId(null);
  }

  return (
    <div className="grid gap-6">
      <section className="surface-card p-6">
        <p className="eyebrow">Find people</p>
        <h2 className="mt-2 text-xl font-semibold">Search public profiles.</h2>
        <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={search}>
          <input className="min-h-11 flex-1 rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-accent/40" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by username or name" aria-label="Search public profiles" />
          <button className="button button--secondary" type="submit" disabled={isSearching}>{isSearching ? "Searching..." : "Search"}</button>
        </form>
        <div className="mt-4 grid gap-2">
          {profiles.filter((profile) => profile.id !== currentUserId).map((profile) => (
            <div key={profile.id} className="flex items-center justify-between gap-3 rounded-md border p-3">
              <Link href={`/profile/${profile.username}`} className="min-w-0">
                <strong className="block truncate">{profile.displayName || profile.username}</strong>
                <span className="text-sm text-muted-foreground">@{profile.username}</span>
              </Link>
              <motion.button
                type="button"
                className={`button ${requestedUserIds.has(profile.id) ? "partner-request-button--sent" : "button--ghost"}`}
                onClick={() => void sendAction({ action: "request", userId: profile.id })}
                disabled={requestingUserId !== null || requestedUserIds.has(profile.id) || acceptedPartnerCount >= 7}
                whileHover={prefersReducedMotion ? undefined : { y: -1 }}
                whileTap={prefersReducedMotion ? undefined : { y: 1, scale: 0.97 }}
                animate={requestingUserId === profile.id ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                transition={{ duration: 0.22 }}
              >
                {requestedUserIds.has(profile.id) ? "Requested" : "Partner"}
              </motion.button>
            </div>
          ))}
          {query.trim().length >= 2 && !isSearching && profiles.length === 0 ? <p className="text-sm text-muted-foreground">No public profiles found.</p> : null}
        </div>
      </section>
      <section className="surface-card p-6">
        <p className="eyebrow">Connections</p>
        <h2 className="mt-2 text-xl font-semibold">Your partner requests.</h2>
        <div className="mt-4 grid gap-2">
          {relationships.map((relationship) => (
            <div key={relationship.id} className="rounded-md border p-3">
              <div className="flex items-center justify-between gap-3">
                <Link href={relationship.otherProfile ? `/profile/${relationship.otherProfile.username}` : "#"} className="font-semibold">
                  {relationship.otherProfile?.displayName || relationship.otherProfile?.username || "Profile unavailable"}
                </Link>
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{relationship.status}</span>
              </div>
              {relationship.status === "pending" && relationship.recipientId === currentUserId ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" className="button button--primary" onClick={() => void sendAction({ action: "accept", relationshipId: relationship.id })}>Accept</button>
                  <button type="button" className="button button--ghost" onClick={() => void sendAction({ action: "reject", relationshipId: relationship.id })}>Reject</button>
                </div>
              ) : null}
              {relationship.status === "pending" && relationship.requesterId === currentUserId ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" className="button button--ghost" onClick={() => void sendAction({ action: "cancel", relationshipId: relationship.id })}>Cancel</button>
                </div>
              ) : null}
              {relationship.status === "accepted" && relationship.otherProfile ? (
                <motion.button
                  type="button"
                  className="partner-remove-button mt-3 text-sm font-semibold text-accent"
                  onClick={() => setPendingRemoval(relationship.otherProfile)}
                  whileHover={prefersReducedMotion ? undefined : { x: 2 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                >
                  Remove partner
                </motion.button>
              ) : null}
            </div>
          ))}
          {relationships.length === 0 ? <p className="text-sm text-muted-foreground">No partner connections yet.</p> : null}
        </div>
        {message ? <p className="mt-4 text-sm font-semibold" role="status">{message}</p> : null}
      </section>
      {pendingRemoval ? (
        <div className="account-menu__dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setPendingRemoval(null); }}>
          <section className="account-menu__dialog" role="alertdialog" aria-modal="true" aria-labelledby="remove-partner-title">
            <p className="eyebrow">Remove partner</p>
            <h2 id="remove-partner-title" className="mt-2 text-xl font-semibold">Remove {pendingRemoval.displayName || `@${pendingRemoval.username}`}?</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Do you want to remove this partner? You can send a new request later.</p>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" className="button button--secondary" onClick={() => setPendingRemoval(null)}>Cancel</button>
              <button type="button" className="button account-menu__confirm-logout" onClick={() => { const userId = pendingRemoval.id; setPendingRemoval(null); void sendAction({ action: "remove", userId }); }}>Remove partner</button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
