import { redirect } from "next/navigation";
import { activitySignalConfiguration, activitySignalTypes } from "@/lib/activity-signals";
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
  const activityCollectionStatus = activitySignalConfiguration.globalCollectionEnabled
    ? "Enabled"
    : "Disabled";
  const eligibilityStatus = activitySignalConfiguration.eligibilityEstablished
    ? "Established"
    : "Not established / unresolved";

  return (
    <div className="container py-16 md:py-24">
      <section className="mx-auto max-w-6xl">
        <p className="eyebrow">Personalization foundation</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Preference Managements</h1>
        <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
          A controlled status surface for customer preferences and future product-relevance systems.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <StatusCard
            title="Customer Personalization Preference"
            status={personalizationPreferenceAvailable ? "Implemented / customer-controlled" : "Unavailable"}
            description={
              personalizationPreferenceAvailable
                ? "The authoritative per-customer preference is profiles.personalization_enabled. This management page does not change customer preferences."
                : "The authoritative profiles.personalization_enabled preference could not be read from the backend."
            }
          />
          <StatusCard
            title="Activity Signal Collection"
            status="Inactive / not enabled"
            description={`Global collection: ${activityCollectionStatus}. Eligibility: ${eligibilityStatus}. Recording: inactive. A customer preference cannot override this safety gate.`}
          />
          <StatusCard title="Product Score" status="Inactive / planned" description="No scoring algorithm or catalogue adjustment is active." />
          <StatusCard title="AI Decision System" status="Inactive / planned" description="No autonomous decisions are active. Activity Signals cannot change display priority, featured state, category, availability, or price." />
          <StatusCard title="Admin Priority" status="Business-controlled / authoritative" description="Catalogue priority and business decisions remain controlled by authorized staff. No future scoring or AI system overrides these controls." />
        </div>

        <section className="surface-card mt-6 p-6 md:p-8">
          <p className="eyebrow">Safety / Controls</p>
          <h2 className="mt-2 text-2xl font-semibold">Conservative collection boundary</h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            Signal recording currently requires personalization to be enabled, a future global collection switch, and an explicitly established eligibility decision. The eligibility mechanism does not exist yet, so no behavioral personalization signals are recorded for any user.
          </p>
          <p className="mt-4 text-sm font-semibold text-accent">Child/minor eligibility remains unresolved and requires legal and product design review before collection can be enabled.</p>
        </section>

        <section className="surface-card mt-6 p-6 md:p-8">
          <p className="eyebrow">Supported signal definitions</p>
          <h2 className="mt-2 text-2xl font-semibold">Prepared, not collecting</h2>
          <ul className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            {activitySignalTypes.map((type) => <li key={type} className="rounded-md border border-border px-3 py-2">{type}</li>)}
          </ul>
        </section>
      </section>
    </div>
  );
}

function StatusCard({ title, status, description }: { title: string; status: string; description: string }) {
  return (
    <section className="surface-card p-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm font-semibold text-accent">{status}</p>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
    </section>
  );
}
