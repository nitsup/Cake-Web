import { redirect } from "next/navigation";
import Link from "next/link";
import { AvatarCard } from "@/components/profile/avatar-card";
import { ProfileForm } from "@/components/profile/profile-form";
import { SocialPanel } from "@/components/profile/social-panel";
import { createClient } from "@/lib/supabase/server";
import { getProfileByUserId } from "@/services/profile";
import { getOwnPartnerRelationships, SocialSchemaUnavailableError } from "@/services/social";
import type { PartnerRelationship } from "@/types/social";

export const metadata = {
  title: "Profile",
  description: "Your Cake Web profile.",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  const profile = await getProfileByUserId(userData.user.id);

  if (!profile) {
    return (
      <div className="container py-16 md:py-24">
        <section className="state-panel state-panel--error mx-auto max-w-2xl">
          <p className="eyebrow">Profile</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">We could not find your profile.</h1>
          <p className="mt-4 leading-7 text-muted-foreground">Please refresh the page or contact support if the problem continues.</p>
        </section>
      </div>
    );
  }

  let relationships: PartnerRelationship[] = [];
  let socialSchemaUnavailable = false;
  try {
    relationships = await getOwnPartnerRelationships(userData.user.id);
  } catch (error) {
    if (!(error instanceof SocialSchemaUnavailableError)) {
      throw error;
    }
    socialSchemaUnavailable = true;
  }

  return (
    <div className="container py-16 md:py-24">
      <section className="mx-auto max-w-4xl">
        <div className="mb-8 space-y-2">
          <p className="eyebrow">Your space</p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Make your profile yours.</h1>
          <p className="leading-7 text-muted-foreground">Keep your identity details ready for the Cake Web community.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
          <ProfileForm profile={profile} />
          <aside className="grid gap-4 self-start">
            <AvatarCard profile={profile} />
            <div className="surface-card p-6">
              <p className="eyebrow">Your cake world</p>
              <h2 className="mt-2 text-xl font-semibold">Preferences and partners are coming next.</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">Cake tastes, public profiles, search, and partnership tools will arrive as separate, privacy-aware features.</p>
              <Link href="/preferences" className="button button--secondary mt-5 w-full">Open preferences</Link>
            </div>
          </aside>
        </div>
        <div className="mt-6">
          {socialSchemaUnavailable ? (
            <section className="surface-card p-6">
              <p className="eyebrow">Connections</p>
              <h2 className="mt-2 text-xl font-semibold">Partner tools are not available yet.</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Your profile is ready, but the partner relationship database setup still needs to be completed.
              </p>
            </section>
          ) : (
            <SocialPanel initialRelationships={relationships} currentUserId={userData.user.id} />
          )}
        </div>
      </section>
    </div>
  );
}