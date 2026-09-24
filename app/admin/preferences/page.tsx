import { redirect } from "next/navigation";
import { getActivitySignalStatus } from "@/lib/activity-signals";
import { getActivitySignalEligibility } from "@/lib/activity-signal-eligibility";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Preference Managements",
  description: "Manage the controlled personalization foundation.",
};

export default async function PreferenceManagementsPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profile?.role !== "admin" && profile?.role !== "editor") {
    return (
      <div className="container py-16 md:py-24">
        <section className="surface-card mx-auto max-w-2xl p-6 md:p-8">
          <p className="eyebrow">Preference Managements</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Access denied</h1>
          <p className="mt-4 leading-7 text-muted-foreground">This area is available to authorized staff only.</p>
        </section>
      </div>
    );
  }

  const { data: preferenceProfile, error: preferenceError } = await supabase
    .from("profiles")
    .select("personalization_enabled")
    .eq("id", userData.user.id)
    .maybeSingle();

  const personalizationPreferenceAvailable =
    !preferenceError && typeof preferenceProfile?.personalization_enabled === "boolean";
  const personalizationEnabled = preferenceProfile?.personalization_enabled === true;
  const activityStatus = getActivitySignalStatus();
  const eligibilityDecision = await getActivitySignalEligibility(userData.user.id);

  return (
    <div className="container py-16 md:py-24">
      <section className="mx-auto max-w-6xl">
        <p className="eyebrow">Admin controls</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Preference Managements</h1>
        <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
          Review the current personalization settings and activity collection safeguards.
        </p>

        <section className="surface-card mt-8 p-6 md:p-8">
          <p className="eyebrow">Current personalization status</p>
          <h2 className="mt-2 text-2xl font-semibold">Customer preference</h2>
          <StatusLine
            label="Signed-in account preference"
            value={
              personalizationPreferenceAvailable
                ? personalizationEnabled
                  ? "Enabled"
                  : "Disabled"
                : "Unavailable"
            }
          />
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
            This is the signed-in account&apos;s customer-controlled preference. It is not a global setting and cannot be changed for other customers from this page.
          </p>
        </section>

        <section className="surface-card mt-6 p-6 md:p-8">
          <p className="eyebrow">Activity personalization</p>
          <h2 className="mt-2 text-2xl font-semibold">Collection safeguards</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <StatusLine label="Collection" value={activityStatus.globalCollectionEnabled ? "Enabled" : "Currently inactive"} />
            <StatusLine label="Eligibility" value={eligibilityDecision.established ? "Established" : "Not currently established"} />
            <StatusLine label="Recording" value={activityStatus.recordingActive ? "Active" : "Inactive"} />
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-muted-foreground">
            Activity personalization is currently inactive because global collection is disabled and eligibility has not been established. Visiting this page cannot enable collection.
          </p>
        </section>

        <section className="surface-card mt-6 p-6 md:p-8">
          <p className="eyebrow">Personalization system status</p>
          <h2 className="mt-2 text-2xl font-semibold">Business controls remain authoritative</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <StatusLine label="Product Score" value="Not active" />
            <StatusLine label="AI personalization" value="Not active" />
            <StatusLine label="Admin Priority" value="Business-controlled" />
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-muted-foreground">
            Business-controlled catalogue priority remains authoritative over future personalization systems.
          </p>
        </section>

        <section className="surface-card mt-6 p-6 md:p-8">
          <p className="eyebrow">Safety boundary</p>
          <h2 className="mt-2 text-2xl font-semibold">Normal website access is unaffected</h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
            Behavioral activity collection is deny-by-default until an approved eligibility mechanism exists. Cake-Web is not age restricted: children and minors may browse, view cakes, and use normal website functionality.
          </p>
        </section>
      </section>
    </div>
  );
}

function StatusLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-semibold text-accent">{value}</span>
    </div>
  );
}
