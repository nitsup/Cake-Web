import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxFileSize = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "You must be logged in." }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File) || !allowedTypes.has(file.type) || file.size > maxFileSize) {
    return NextResponse.json({ error: "Use a JPG, PNG, or WebP image up to 5 MB." }, { status: 400 });
  }

  const extension = file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : "webp";
  const path = `${userData.user.id}/avatar.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from("profile-avatars")
    .upload(path, file, { upsert: true, contentType: file.type, cacheControl: "3600" });

  if (uploadError) return NextResponse.json({ error: "We could not upload your profile image." }, { status: 500 });

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ avatar_path: path })
    .eq("id", userData.user.id);

  if (profileError) return NextResponse.json({ error: "The image uploaded but could not be linked to your profile." }, { status: 500 });
  return NextResponse.json({ saved: true, path });
}

export async function DELETE() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "You must be logged in." }, { status: 401 });

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("avatar_path")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profileError) return NextResponse.json({ error: "Unable to load your profile image." }, { status: 500 });
  if (profile?.avatar_path) {
    const { error: removeError } = await supabase.storage.from("profile-avatars").remove([profile.avatar_path]);
    if (removeError) return NextResponse.json({ error: "Unable to remove your profile image." }, { status: 500 });
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_path: null })
    .eq("id", userData.user.id);
  if (updateError) return NextResponse.json({ error: "Unable to clear your profile image." }, { status: 500 });
  return NextResponse.json({ saved: true });
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "You must be logged in." }, { status: 401 });

  const path = new URL(request.url).searchParams.get("path");
  if (!path || !path.startsWith(`${userData.user.id}/`)) {
    return NextResponse.json({ error: "Invalid profile image." }, { status: 400 });
  }

  const { data, error } = await supabase.storage.from("profile-avatars").createSignedUrl(path, 60 * 10);
  if (error || !data?.signedUrl) return NextResponse.json({ error: "Unable to display your profile image." }, { status: 500 });
  return NextResponse.json({ url: data.signedUrl });
}
