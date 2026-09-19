import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

export const activitySignalConfiguration = Object.freeze({
  globalCollectionEnabled: false,
  eligibilityEstablished: false,
});

export const activitySignalTypes = [
  "product_view",
  "product_search_interaction",
  "product_classification_interaction",
  "add_to_cart",
  "remove_from_cart",
  "purchase",
  "repeated_product_interaction",
] as const;

export type ActivitySignalType = (typeof activitySignalTypes)[number];

export const activitySignalInputSchema = z.object({
  type: z.enum(activitySignalTypes),
  cakeId: z.string().uuid().optional(),
});

export type ActivitySignalInput = z.infer<typeof activitySignalInputSchema>;

function isExplicitlyEligibleForActivitySignals(): false {
  return false;
}

export async function recordActivitySignal(input: ActivitySignalInput): Promise<boolean> {
  if (!activitySignalConfiguration.globalCollectionEnabled) return false;

  const parsed = activitySignalInputSchema.safeParse(input);
  if (!parsed.success) return false;

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return false;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("personalization_enabled")
    .eq("id", userData.user.id)
    .maybeSingle();
  if (profileError || profile?.personalization_enabled !== true) return false;

  if (!activitySignalConfiguration.eligibilityEstablished || !isExplicitlyEligibleForActivitySignals()) return false;

  if (parsed.data.cakeId) {
    const { data: cake, error: cakeError } = await supabase
      .from("cakes")
      .select("id")
      .eq("id", parsed.data.cakeId)
      .maybeSingle();
    if (cakeError || !cake) return false;
  }

  const { error } = await supabase.from("activity_signals").insert({
    user_id: userData.user.id,
    signal_type: parsed.data.type,
    cake_id: parsed.data.cakeId ?? null,
  });
  if (error) throw new Error("Unable to record activity signal.");
  return true;
}
