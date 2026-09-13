import { NextResponse } from "next/server";
import { getPublicProfileByUsername } from "@/services/social";

export async function GET(
  _request: Request,
  context: { params: Promise<{ username: string }> },
) {
  const { username } = await context.params;
  const profile = await getPublicProfileByUsername(username);
  if (!profile) return NextResponse.json({ error: "Profile not found." }, { status: 404 });
  return NextResponse.json({ profile });
}
