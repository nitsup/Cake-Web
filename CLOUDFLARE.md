# Cloudflare Workers

The Cloudflare deployment uses OpenNext. Existing local development remains
available through `npm run dev`; Cloudflare-specific scripts are separate.

## Local Worker preview

1. Copy `.dev.vars.example` to `.dev.vars` and provide the public Supabase
   project URL and publishable key. This file is ignored by Git.
2. Provide the same `NEXT_PUBLIC_*` values to the build process. Public
   `NEXT_PUBLIC_*` variables are embedded during the Next.js build.
3. Run `npm run preview:cloudflare` to build and start the Worker in Wrangler.

OpenNext currently warns that Windows support is not guaranteed. If the build
fails while creating symlinks, run the preview from WSL 2 rather than disabling
or bypassing middleware functionality.

## Cloudflare build settings

Configure `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and
`NEXT_PUBLIC_DEVELOPMENT_NOTICE_ENABLED` in the build environment and the
Worker runtime environment. Add Cloudflare production and preview callback
URLs to Supabase Auth's allowed redirect URLs.

If Sentry source-map uploads are required, provide `SENTRY_AUTH_TOKEN` as a
protected build secret. It is only needed during build-time uploads and is not
a Worker runtime secret. The Sentry DSN remains in the existing Sentry
initialization.

Run `npm run build:cloudflare` to build the Worker. The deployment script is
available as `npm run deploy:cloudflare`; it has not been run as part of setup.

No Cloudflare database, object storage, or other application service binding is
configured here. The self-reference service binding is part of OpenNext's
Worker runtime configuration.
