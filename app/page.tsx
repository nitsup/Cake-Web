export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto flex min-h-full w-full max-w-3xl flex-col justify-center gap-4 px-6 py-16">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          cake-web
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Project foundation ready.
        </h1>
        <p className="max-w-xl text-muted-foreground">
          The Next.js App Router, shared utilities, validation boundary, and
          versioned health endpoint are ready for the next phase.
        </p>
        <p className="text-sm text-muted-foreground">
          Check <code className="font-mono">/api/v1/health</code> to verify the
          application is running.
        </p>
      </main>
    </div>
  );
}
