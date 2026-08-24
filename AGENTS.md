<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
# Cake Web - AI Agent Instructions

## Project

Cake Web is a production-oriented cake storefront built with:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui conventions
- Lucide icons
- Motion for selective animation
- Supabase
- Zod
- ESLint

## Core Rules

1. Read `CHATGPT.md` before making significant architectural changes.
2. Inspect the existing implementation before creating new files.
3. Preserve existing architecture unless there is a concrete reason to change it.
4. Do not modify database schema or RLS policies unless explicitly requested.
5. Never invent database columns, tables, relationships, environment variables, or API contracts.
6. Never expose secrets or environment-variable values.
7. Never hardcode Supabase credentials.
8. Keep server components server-rendered whenever possible.
9. Use client components only where interactivity requires them.
10. Keep client boundaries small.
11. Prefer reusable components over duplicated UI.
12. Use semantic design tokens instead of scattering arbitrary colors.
13. Maintain accessibility:
    - keyboard navigation
    - visible focus states
    - semantic HTML
    - appropriate ARIA
    - reduced-motion support
14. Do not add dependencies unless they are actually required.
15. Do not modify unrelated files.
16. Do not delete existing functionality without explicit approval.

## Validation

After implementation:

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

Fix implementation errors before declaring the task complete.

## Git Safety

Do not commit or push unless explicitly requested.

Before suggesting a commit:

- inspect `git status --short`
- inspect `git diff --stat`
- ensure secrets are not staged
- ensure `.env.local` is ignored

## Change Discipline

For every task:

1. Inspect.
2. Plan the smallest coherent change.
3. Implement.
4. Validate.
5. Report changed files and validation results.

Do not perform unrelated cleanup merely because you noticed it.