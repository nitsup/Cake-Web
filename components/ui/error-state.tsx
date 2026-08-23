import type { ReactNode } from "react";

interface ErrorStateProps {
  title?: string;
  description: string;
  action?: ReactNode;
}

export function ErrorState({ title = "Something went wrong", description, action }: ErrorStateProps) {
  return (
    <div className="state-panel state-panel--error" role="alert">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
