"use client";

import { useState, useSyncExternalStore } from "react";

const acknowledgementKey = "cake-web-development-notice-acknowledged";

export function DevelopmentNotice({ enabled, content }: { enabled: boolean; content: string }) {
  const [dismissed, setDismissed] = useState(false);
  const acknowledged = useSyncExternalStore(
    () => () => {},
    () => window.localStorage.getItem(acknowledgementKey) === "true",
    () => true,
  );
  const visible = enabled && !acknowledged && !dismissed;

  if (!visible) return null;

  return (
    <div className="legal-notice-backdrop" role="dialog" aria-modal="true" aria-labelledby="development-notice-title">
      <section className="legal-notice">
        <p className="eyebrow">Development notice</p>
        <h2 id="development-notice-title" className="mt-3 text-2xl font-semibold">
          Development Website
        </h2>
        <p className="mt-4 whitespace-pre-line leading-7 text-muted-foreground">{content}</p>
        <button
          type="button"
          className="button button--primary mt-6"
          onClick={() => {
            window.localStorage.setItem(acknowledgementKey, "true");
            setDismissed(true);
          }}
        >
          Continue to website
        </button>
      </section>
    </div>
  );
}
