import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const updateSchema = z.object({ personalizationEnabled: z.boolean() });

async function getUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return { supabase, user: null };
  return { supabase, user: data.user };
}

export async function GET() {
  const { supabase, user } = await getUser();
  if (!user) return NextResponse.json({ error: "You must be logged in." }, { status: 401 });

  const { data, error } = await supabase
    .from("profiles")
    .select("personalization_enabled")
    .eq("id", user.id)
    .maybeSingle();
  if (error) {
    if (error.code === "42703") {
      return NextResponse.json({ personalizationEnabled: true, settingsAvailable: false });
    }
    return NextResponse.json({ error: "Unable to load your personalization preference." }, { status: 500 });
  }
  return NextResponse.json({ personalizationEnabled: data?.personalization_enabled ?? true, settingsAvailable: true });
}

export async function PATCH(request: Request) {
  const { supabase, user } = await getUser();
  if (!user) return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid personalization preference." }, { status: 400 });

  const { error } = await supabase
    .from("profiles")
    .update({ personalization_enabled: parsed.data.personalizationEnabled })
    .eq("id", user.id);
  if (error) {
    if (error.code === "42703") return NextResponse.json({ error: "Personalization settings are not available yet." }, { status: 503 });
    return NextResponse.json({ error: "Unable to save your personalization preference." }, { status: 500 });
  }
  return NextResponse.json({ saved: true, personalizationEnabled: parsed.data.personalizationEnabled });
}
