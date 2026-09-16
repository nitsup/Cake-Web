import { createClient } from "@/lib/supabase/server";
import type { PartnerRelationship, PublicProfile } from "@/types/social";

type RawPublicProfile = {
  id: string;
  username: string | null;
  display_name: string | null;
  bio: string | null;
  website: string | null;
  avatar_path: string | null;
};

type RawRelationship = {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: PartnerRelationship["status"];
  created_at: string;
  updated_at: string;
};

export class SocialSchemaUnavailableError extends Error {
  constructor() {
    super("The partner relationship schema is not available.");
    this.name = "SocialSchemaUnavailableError";
  }
}

function mapPublicProfile(profile: RawPublicProfile): PublicProfile {
  return {
    id: profile.id,
    username: profile.username,
    displayName: profile.display_name,
    bio: profile.bio,
    website: profile.website,
    avatarUrl: profile.avatar_path
      ? supabaseStorageUrl(profile.avatar_path)
      : null,
  };
}

function supabaseStorageUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-avatars/${path}`;
}

export async function searchPublicProfiles(query: string): Promise<PublicProfile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("search_public_profiles", {
    search_query: query,
    result_limit: 20,
  });

  if (error) throw new Error("Unable to search profiles.");
  return ((data ?? []) as RawPublicProfile[]).map(mapPublicProfile);
}

export async function getPublicProfileByUsername(username: string): Promise<PublicProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("public_profiles")
    .select("id, username, display_name, bio, website, avatar_path")
    .eq("username", username.toLowerCase())
    .maybeSingle();

  if (error) throw new Error("Unable to load public profile.");
  return data ? mapPublicProfile(data as RawPublicProfile) : null;
}

export async function getOwnPartnerRelationships(userId: string): Promise<PartnerRelationship[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("partner_relationships")
    .select("id, requester_id, recipient_id, status, created_at, updated_at")
    .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`)
    .order("updated_at", { ascending: false });

  if (error) {
    if (error.code === "42P01" || error.code === "42703" || error.code === "PGRST205") {
      throw new SocialSchemaUnavailableError();
    }

    throw new Error("Unable to load partner relationships.");
  }

  const relationships = (data ?? []) as RawRelationship[];
  const otherIds = relationships.map((item) => item.requester_id === userId ? item.recipient_id : item.requester_id);
  if (otherIds.length === 0) return [];

  const { data: profiles, error: profilesError } = await supabase
    .from("public_profiles")
    .select("id, username, display_name, bio, website, avatar_path")
    .in("id", otherIds);

  if (profilesError) throw new Error("Unable to load partner profiles.");
  const profileMap = new Map((profiles as RawPublicProfile[]).map((profile) => [profile.id, mapPublicProfile(profile)]));

  return relationships.map((item) => ({
    id: item.id,
    requesterId: item.requester_id,
    recipientId: item.recipient_id,
    status: item.status,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    otherProfile: profileMap.get(item.requester_id === userId ? item.recipient_id : item.requester_id) ?? null,
  }));
}
