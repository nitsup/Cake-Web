import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { searchPublicProfiles } from "@/services/social";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "You must be logged in." }, { status: 401 });

  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (query.length < 2) return NextResponse.json({ profiles: [] });

  return NextResponse.json({ profiles: await searchPublicProfiles(query) });
}
