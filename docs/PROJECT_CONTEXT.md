# Project Context

## Provenance

This document is reconstructed from current repository evidence only.

Sources inspected for this recovery:
- README.md
- AGENTS.md
- BASIC_INSTRUCTIONS.md
- CODEX.md
- package.json
- .env.example
- lib/config/env.ts
- next.config.ts
- app/ route inventory from git ls-files
- git status --short, git branch --show-current, and git ls-files output captured on 2026-09-13

## Stable project facts

- Project name: cake-web
- Current branch at inspection time: master
- Status at inspection time: one modified tracked file, components/auth/auth-form.tsx
- Stack: Next.js App Router, TypeScript, React, Tailwind CSS v4, shadcn-style UI conventions, Lucide React, Motion, Zod, Supabase client libraries, Sentry
- Runtime and project scripts in package.json: dev, build, start, lint
- Repository layout includes: app/, components/, hooks/, lib/, services/, types/, public/, docs/, and config files at the repo root

## Source layout

- app/: route files, layouts, route handlers, and page entry points
- components/: reusable UI and page-level components
- hooks/: reusable hooks
- lib/: shared utilities, config, validation, Supabase helpers, and design tokens
- services/: service-layer access and business logic
- types/: shared TypeScript types
- public/: static assets and placeholders
- docs/: project documentation and state tracking

## Configuration variables

Only the variable names proven by the current repository are listed here.

- NEXT_PUBLIC_APP_URL
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

No secret values are recorded here.

## Constraints and rules evidenced in the repo

- Keep private configuration in environment files ignored by Git; do not commit secrets.
- Preserve existing architecture and avoid duplicate service or component patterns.
- Do not invent database tables, columns, relations, roles, or RLS policies unless the repository proves them.
- Do not broaden scope beyond the requested documentation recovery unless a new fact requires it.
- Validate changed files with targeted commands and review the resulting diff.

## Known unknowns and retained gaps

- The repository does not contain a complete, verified database schema document within the current working tree beyond references to cake-related data access and public catalog behavior.
- Deployment target details, production environment values, and any non-local infrastructure state are not proven by the current repo snapshot.
- The AGENTS.md and CODEX.md references to an AI/ directory are not satisfied by the current repo tree; that missing directory is treated as a documented gap rather than assumed content.
- No fresh build, lint, or runtime status is claimed here because those commands were not run in this task.

## Scope for this recovery

This document intentionally records only stable facts and explicit unknowns. It does not claim a roadmap, task history, or an implementation completion state that is not proven by the repository snapshot.