import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ count: 0 });

  const { count, error } = await supabase
    .from("partner_relationships")
    .select("id", { count: "exact", head: true })
    .eq("recipient_id", userData.user.id)
    .eq("status", "pending");

  if (error) return NextResponse.json({ count: 0 });
  return NextResponse.json({ count: count ?? 0 });
}
