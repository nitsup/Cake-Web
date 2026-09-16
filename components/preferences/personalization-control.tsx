"use client";

import { useEffect, useState } from "react";

export function PersonalizationControl() {
  const [enabled, setEnabled] = useState(true);
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/preferences")
      .then(async (response) => {
        const result = await response.json() as { personalizationEnabled?: boolean; settingsAvailable?: boolean; error?: string };
        if (!response.ok) throw new Error(result.error ?? "Unable to load your preference.");
        setEnabled(result.personalizationEnabled ?? true);
        setAvailable(result.settingsAvailable !== false);
      })
      .catch((error: unknown) => setMessage(error instanceof Error ? error.message : "Unable to load your preference."))
      .finally(() => setLoading(false));
  }, []);

  async function updatePreference(nextValue: boolean) {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/preferences", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ personalizationEnabled: nextValue }),
      });
      const result = await response.json() as { error?: string; personalizationEnabled?: boolean };
      if (!response.ok) throw new Error(result.error ?? "Unable to save your preference.");
      setEnabled(result.personalizationEnabled ?? nextValue);
      setMessage("Your personalization preference has been saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save your preference.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="surface-card mx-auto max-w-2xl p-6 md:p-8">
      <p className="eyebrow">Personalization</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Make your cake browsing more relevant.</h1>
      <p className="mt-4 leading-7 text-muted-foreground">
        When enabled, Cake Web may use relevant activity and preferences to improve product selection and future offers. This control does not change standard catalogue availability, pricing, cart, checkout, or orders.
      </p>
      <div className="mt-8 flex items-center justify-between gap-4 rounded-lg border border-border p-4">
        <div>
          <p className="font-semibold">Use personalization</p>
          <p className="mt-1 text-sm text-muted-foreground">{enabled ? "Enabled" : "Disabled"}</p>
        </div>
        <button type="button" className="button button--primary" disabled={loading || saving || !available} onClick={() => void updatePreference(!enabled)}>
          {loading ? "Loading..." : saving ? "Saving..." : enabled ? "Turn off" : "Turn on"}
        </button>
      </div>
      {message ? <p className="mt-4 text-sm font-medium" role="status">{message}</p> : null}
      {!available ? <p className="mt-4 text-sm text-muted-foreground">Apply the personalization preference migration to enable this setting.</p> : null}
    </section>
  );
}
