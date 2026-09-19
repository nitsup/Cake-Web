import { NextResponse } from "next/server";
import {
  activitySignalInputSchema,
  activitySignalConfiguration,
  recordActivitySignal,
} from "@/lib/activity-signals";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid activity signal." }, { status: 400 });
  }

  const parsed = activitySignalInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid activity signal." }, { status: 400 });
  }

  if (!activitySignalConfiguration.globalCollectionEnabled) {
    return NextResponse.json({ recorded: false });
  }

  try {
    const recorded = await recordActivitySignal(parsed.data);
    return NextResponse.json({ recorded });
  } catch {
    return NextResponse.json({ error: "Unable to record activity signal." }, { status: 500 });
  }
}
