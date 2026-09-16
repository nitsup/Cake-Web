import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicProfileByUsername } from "@/services/social";

export const dynamic = "force-dynamic";

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await getPublicProfileByUsername(username);
  if (!profile || !profile.username) notFound();

  return (
    <div className="container py-16 md:py-24">
      <section className="surface-card mx-auto max-w-2xl p-8">
        <p className="eyebrow">Public profile</p>
        <div className="mt-5 flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border bg-muted text-2xl font-semibold text-muted-foreground">{profile.avatarUrl ? <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" /> : (profile.displayName?.[0] ?? profile.username[0]).toUpperCase()}</div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{profile.displayName || profile.username}</h1>
            <p className="text-muted-foreground">@{profile.username}</p>
          </div>
        </div>
        {profile.bio ? <p className="mt-6 leading-7 text-muted-foreground">{profile.bio}</p> : <p className="mt-6 text-muted-foreground">This person has not added an about section yet.</p>}
        {profile.website ? <a className="mt-4 inline-block font-semibold text-accent underline underline-offset-4" href={profile.website} rel="noreferrer" target="_blank">{profile.website}</a> : null}
        <div className="mt-8">
          <Link className="button button--secondary" href="/profile">Back to your profile</Link>
        </div>
      </section>
    </div>
  );
}
