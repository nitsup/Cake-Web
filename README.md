# cake-web

The foundation for a production-quality cake shop website. The project uses
Next.js App Router, TypeScript, Tailwind CSS v4, and shadcn/ui conventions.

## Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` when local environment configuration is
needed. Real secrets belong only in ignored environment files or the deployment
provider's environment settings.

## Validation

```bash
npm run lint
npx tsc --noEmit
npm run build
```

The safe versioned health check is available at `/api/v1/health` while the
development server is running.

## Project structure

- `app/`: routes, layouts, and route handlers
- `components/`: reusable UI components
- `hooks/`: reusable React hooks
- `lib/`: shared utilities, configuration, validation, and security helpers
- `services/`: business logic and external integrations
- `types/`: shared TypeScript types

The project is being built in phases. Database, authentication, CMS, and
production integrations are intentionally not included in this foundation.


redeployment 1
redeployment 2
