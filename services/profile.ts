import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/profile";

type RawProfile = {
  id: string;
  email: string | null;
  display_name: string | null;
  role: string | null;
  avatar_path?: string | null;
  username: string | null;
  bio: string | null;
  website: string | null;
};

export async function getProfileByUserId(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, display_name, role")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error("Unable to load your profile.");
  }

  if (!data) {
    return null;
  }

  const profile = data as RawProfile;
  const { data: extendedData, error: extendedError } = await supabase
    .from("profiles")
    .select("username, bio, website, avatar_path")
    .eq("id", userId)
    .maybeSingle();

  if (extendedError && extendedError.code !== "42703") {
    throw new Error("Unable to load your profile details.");
  }

  const extendedProfile = extendedData as Pick<RawProfile, "username" | "bio" | "website" | "avatar_path"> | null;
  let avatarUrl: string | null = null;
  if (extendedProfile?.avatar_path) {
    const { data: signedUrl } = await supabase.storage
      .from("profile-avatars")
      .createSignedUrl(extendedProfile.avatar_path, 60 * 10);
    avatarUrl = signedUrl?.signedUrl ?? null;
  }

  return {
    id: profile.id,
    email: profile.email,
    displayName: profile.display_name,
    username: extendedProfile?.username ?? null,
    bio: extendedProfile?.bio ?? null,
    website: extendedProfile?.website ?? null,
    role: profile.role,
    extendedFieldsAvailable: !extendedError,
    avatarPath: extendedProfile?.avatar_path ?? null,
    avatarUrl,
  };
}
