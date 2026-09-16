import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const profileUpdateSchema = z.object({
  displayName: z.string().trim().min(1).max(80),
  username: z.union([
    z.string().trim().toLowerCase().regex(/^[a-z0-9](?:[a-z0-9_]{1,28}[a-z0-9])?$/),
    z.literal(""),
  ]).optional(),
  bio: z.string().trim().max(500).optional(),
  website: z.string().trim().url().max(2048).or(z.literal("")).optional(),
});

function usernameBase(displayName: string) {
  const base = displayName.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 24) || "cakefriend";
  return base;
}

async function chooseUsername(supabase: Awaited<ReturnType<typeof createClient>>, displayName: string) {
  const base = usernameBase(displayName);
  for (let suffix = 0; suffix < 100; suffix += 1) {
    const candidate = suffix === 0 ? base : `${base.slice(0, 30 - String(suffix).length - 1)}_${suffix}`;
    const { data, error } = await supabase.from("public_profiles").select("id").eq("username", candidate).maybeSingle();
    if (error && error.code !== "PGRST116") throw new Error("Unable to create your profile username.");
    if (!data) return candidate;
  }
  throw new Error("Unable to find an available username.");
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }

  const parsed = profileUpdateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter valid profile details." }, { status: 400 });
  }

  const values = parsed.data;
  const { data: currentProfile } = await supabase.from("profiles").select("username").eq("id", userData.user.id).maybeSingle();
  const username = values.username || currentProfile?.username || await chooseUsername(supabase, values.displayName);
  const { error: displayNameError } = await supabase
    .from("profiles")
    .update({ display_name: values.displayName })
    .eq("id", userData.user.id);

  if (displayNameError) {
    return NextResponse.json({ error: "We could not save your profile." }, { status: 500 });
  }

  const { error: extendedError } = await supabase
    .from("profiles")
    .update({
      username,
      bio: values.bio || "Hey there! I’m using Cake Web!",
      website: values.website || null,
    })
    .eq("id", userData.user.id);

  if (extendedError) {
    if (extendedError.code === "42703") {
      return NextResponse.json({ saved: true, extendedFieldsAvailable: false });
    }
    if (extendedError.code === "23505") {
      return NextResponse.json({ error: "That username is already in use." }, { status: 409 });
    }
    return NextResponse.json({ error: "Your name was saved, but the additional details could not be saved." }, { status: 500 });
  }

  return NextResponse.json({ saved: true, extendedFieldsAvailable: true });
}
