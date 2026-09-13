import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getOwnPartnerRelationships } from "@/services/social";

const partnerActionSchema = z.object({
  action: z.enum(["request", "accept", "reject", "cancel", "remove"]),
  userId: z.string().uuid().optional(),
  relationshipId: z.string().uuid().optional(),
});

export async function GET() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  return NextResponse.json({ relationships: await getOwnPartnerRelationships(userData.user.id) });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "You must be logged in." }, { status: 401 });

  const parsed = partnerActionSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid partner action." }, { status: 400 });
  const action = parsed.data;

  if (action.action === "request") {
    if (!action.userId) return NextResponse.json({ error: "A target user is required." }, { status: 400 });
    const { error } = await supabase.rpc("create_partner_request", { target_user_id: action.userId });
    if (error) return NextResponse.json({ error: "Unable to send partner request." }, { status: 400 });
  } else if (action.action === "remove") {
    if (!action.userId) return NextResponse.json({ error: "A partner user is required." }, { status: 400 });
    const { error } = await supabase.rpc("remove_partner", { partner_user_id: action.userId });
    if (error) return NextResponse.json({ error: "Unable to remove partner." }, { status: 400 });
  } else {
    if (!action.relationshipId) return NextResponse.json({ error: "A relationship is required." }, { status: 400 });
    const { error } = await supabase.rpc("respond_partner_request", {
      relationship_id: action.relationshipId,
      next_status: action.action === "accept" ? "accepted" : action.action === "reject" ? "rejected" : "cancelled",
    });
    if (error) return NextResponse.json({ error: "Unable to update partner request." }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
