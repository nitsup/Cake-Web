@AGENTS.md
# Cake Web - Claude Instructions

This repository uses `AGENTS.md` as the shared AI-agent instruction source.

Before making changes:

1. Read `AGENTS.md`.
2. Read `CHATGPT.md` when project history or architectural decisions are relevant.
3. Inspect the existing implementation before editing.

Follow the existing Next.js, TypeScript, Tailwind, Supabase, accessibility, and component architecture.

Do not:
- invent database schema
- modify RLS without explicit approval
- expose secrets
- modify unrelated files
- add unnecessary dependencies
- commit or push without explicit approval

Validate meaningful changes with:

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

Report implementation changes and validation results clearly.