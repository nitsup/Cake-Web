# Cake-Web Agent Instructions


## some VERY important rules ->
- hand off rule (how to act as a hand off for your next co-worker and AI)
"
HANDOFF

Stage:
Status:
Task:
Relevant files:
What changed:
Evidence:
Known issues:
Next stage:
Required context:
"
- NO wandering around rule ->
PIPELINE DISCIPLINE

Each AI stage must operate within its assigned responsibility.

An agent must not:

- expand the task without justification
- perform another stage's responsibility
- fix issues outside the approved scope
- introduce unrelated refactors
- create speculative features
- repeatedly investigate already-resolved issues
- continue indefinitely after its stage's stop condition is satisfied

If a different problem is discovered:

1. record it,
2. classify its relevance,
3. do not automatically pursue it,
4. hand it to the appropriate pipeline stage when necessary.

The goal is controlled progression, not maximum activity.

## Project

Cake-Web is a reusable full-stack website foundation.

The bakery website is the first implementation and learning vehicle.

## Current priority

Finish and stabilize the public bakery website before implementing
future platform features.

Current priorities:

1. Public pages
2. Homepage
3. Cake catalog
4. Cake detail pages
5. Category browsing
6. Search
7. Responsive UI
8. SEO
9. Security
10. Production deployment

Do not implement future platform systems unless explicitly requested.

Future systems include:

- authentication
- Google login
- mobile login
- OTP
- profiles
- profile pictures
- cart
- orders
- staff
- admin
- owner dashboard
- analytics
- inventory
- AI integrations

## Technology

- Next.js
- TypeScript
- Supabase
- PostgreSQL
- GitHub
- Vercel

Follow the existing project architecture instead of introducing
duplicate systems.

## Code modification rules

Before modifying code:

1. Inspect the existing implementation.
2. Identify reusable components/services.
3. Identify the smallest correct change.
4. Check whether the requested feature already partially exists.

When modifying code:

- Make the smallest reasonable change.
- Do not rewrite unrelated files.
- Do not create duplicate services/components.
- Preserve existing behavior.
- Do not invent database structures.
- Do not weaken security to make a feature work.

After modifying code:

1. Check the modified files for errors.
2. Run focused validation where practical.
3. Report exactly which files changed.
4. Report what was tested.
5. Report anything that could not be tested.
6. Report remaining risks.

## Database rules

The existing Supabase database is authoritative.

Never invent:

- tables
- columns
- relationships
- roles
- policies
- categories

Before database changes:

1. Inspect the current schema.
2. Prefer read-only diagnostic queries.
3. Verify existing constraints and RLS.
4. Make migrations/seed operations idempotent where practical.

Never weaken RLS merely to solve a frontend problem.

## Security

Assume application source code may be publicly visible.

Security must rely on actual enforcement rather than secrecy of source code.

Never expose:

- service-role credentials
- private API keys
- passwords
- authentication secrets
- tokens
- private credentials

Never place secrets in source code, documentation, Git commits,
or client-side environment variables.

Public Supabase credentials must still be protected by correct RLS.

Validate and authorize server-side.

## Git

Primary branch:

master

Rules:

- Do not force-push without explicit approval.
- Do not discard remote commits without inspecting them.
- Do not overwrite remote history to solve a normal synchronization problem.
- Keep commits focused.
- Never commit `.env` or secret credentials.

Before pushing:

- inspect git status
- inspect changed files
- inspect the diff
- verify no secrets are included

## Deployment

Production uses Vercel.

When diagnosing deployment problems, verify:

- repository
- branch
- commit
- environment
- environment variables
- deployment target

Do not assume local code and production code are identical.

## AI collaboration

GitHub Copilot is the primary code-generation tool.

Other AI agents may:

- plan
- inspect
- review
- test
- audit security
- analyze deployment

Only one agent should have write authority at a time.

Do not allow multiple agents to independently rewrite the same feature.

## Scope control

Current project stability has priority over future architecture.

A future-oriented improvement may only be introduced now when it is:

- small
- reusable
- low-risk
- directly useful to the current bakery website

Do not allow future platform architecture to turn the current project
into an unnecessarily large system.

## Documentation

Detailed project information is stored in:

docs/CURRENT_STATE.md
docs/ARCHITECTURE.md
docs/DATABASE.md
docs/DEPLOYMENT.md
docs/WORKFLOW.md

Read only the documents relevant to the current task.
Do not load every document unnecessarily.
# AGENTS.md

## Project Agent Rules

These rules apply to every AI agent working on Cake Web.

---

## 1. Core Principle

Use the smallest safe change.

Before modifying anything:

1. Inspect the existing implementation.
2. Understand the relevant architecture.
3. Identify the minimum files required.
4. Make only the requested change.
5. Validate the change.
6. Review the diff.
7. Report exactly what changed.

Do not rewrite working systems without a concrete reason.

---

## 2. Protect Existing Functionality

If something currently works, do not modify it unless the current task requires it.

Preserve:

- existing UI
- existing routes
- existing database behavior
- existing security
- existing components
- existing services
- existing deployment configuration

Avoid unrelated cleanup during feature implementation.

---

## 3. Scope Control

Every task must have an explicit scope.

Before editing, identify:

- task objective
- files allowed to change
- files that should not change
- acceptance criteria
- validation requirements

If the requested change appears to require additional files, inspect first and explain why they are necessary.

Do not silently expand the task.

---

## 4. Architecture

Prefer existing project architecture over introducing duplicate systems.

Reuse existing:

- services
- components
- utilities
- database structures
- validation logic
- established patterns

Do not introduce a new abstraction when an existing abstraction already solves the problem.

---

## 5. Database

Do not modify the database schema unless explicitly required.

Never weaken:

- RLS
- authorization
- constraints
- foreign keys
- validation

Frontend visibility is not considered security.

Authorization must ultimately be enforced server-side and/or through database security.

---

## 6. Security

Never expose:

- service-role credentials
- private API keys
- passwords
- authentication secrets
- private tokens

Never move secrets into `NEXT_PUBLIC_*` variables.

Do not weaken security to make development easier.

When changing authentication, authorization, database policies, APIs, storage, or user-controlled input, perform an explicit security review.

---

## 7. Git

The primary branch is:

`master`

Do not casually:

- force-push
- rewrite history
- delete branches
- reset shared history

Before dangerous Git operations, inspect the repository state and explain the consequence.

---

## 8. Validation

For meaningful code changes, run when applicable:

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- relevant tests

Do not claim validation was performed unless it was actually performed.

---

## 9. Reporting

After implementation report:

### Files changed
List every modified file.

### What changed
Briefly describe each meaningful modification.

### Validation
List commands executed and their results.

### Remaining issues
List known warnings, failures, or blockers.

---

## 10. Task Discipline

Do not:

- fix unrelated bugs
- redesign the application without approval
- replace working components unnecessarily
- create duplicate services
- invent database categories
- invent APIs
- add future platform features prematurely
- add AI where deterministic code is sufficient

When uncertain, inspect first rather than guessing.

---

## 11. Learning-Friendly Development

The user is learning full-stack development.

Implementation should therefore remain understandable.

Prefer:

- explicit code
- existing project conventions
- small changes
- explainable architecture
- clear validation

Avoid unnecessary abstraction or cleverness merely to shorten code.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
