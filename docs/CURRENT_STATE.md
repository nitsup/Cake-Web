# Current State

Last verified:

Date: YYYY-MM-DD
Check number: 1

## Check Number Rule

The check number tracks meaningful project-state verification on a given date.

When working on the project:

- If the current date is different from the recorded date, change the date and reset Check number to 1.
- If the current date is the same, increment Check number by 1 after a meaningful verification/update.
- Do not increment the number for trivial reading or conversation-only activity.
- Do not fabricate verification.
- Update this section only when the project state has actually been inspected or meaningfully changed.

## Application

Stack:

- Next.js
- App Router
- TypeScript
- React
- Tailwind/shadcn-style UI
- Supabase
- PostgreSQL

---

## Routes

Currently relevant public routes:

/
 /cakes
 /cakes/[slug]

---

## Important Files

app/page.tsx

app/cakes/page.tsx

components/cake/cake-card.tsx

components/cake/cake-grid.tsx

components/ui/image-placeholder.tsx

services/cake-catalog.ts

next.config.ts

---

## Current Catalogue Service

File:

services/cake-catalog.ts

Important function:

getPublicCakes()

The service is the shared source for public catalogue retrieval.

The homepage and catalogue should reuse this service rather than implementing duplicate catalogue queries.

---

## Database

Tables:

- public.cake_categories
- public.cakes

Current confirmed categories:

- birthday-cakes
- celebration-cakes

Current confirmed cakes:

- birthday-cake-6-layers
- chocolate-cake

Current known public catalogue count:

- 2 categories
- 2 cakes

---

## Current Public Visibility Rules

Public categories:

is_active = true

Public cakes:

is_active = true
AND
availability = 'available'

RLS is enabled.

Do not weaken these rules.

---

## Current Homepage

The homepage retrieves live cake data from Supabase.

It uses:

getPublicCakes()

Cake cards use the existing CakeCard component.

The hero heading is:

Cakes with a little more feeling.

Do not modify this heading unless explicitly required.

---

## Current Navigation

Hero CTA:

See the collection → /cakes

Existing catalogue CTA:

Browse all → /cakes

Cake cards link to:

/cakes/[slug]

Image, name, description, and arrow are intended to be clickable.

---

## Current Images

Known assets:

public/cakes/birthday_rainbow_cake.png

public/cakes/Good_choclate_cake.jpeg

Important:

`choclate` is the existing filename spelling.

Do not rename casually.

---

## Current Category Feature

Target:

/cakes?category=category-slug

Confirmed category:

celebration-cakes

The homepage's confirmed Celebration cakes link should eventually use:

/cakes?category=celebration-cakes

Do not invent category slugs for categories that do not exist in the database.

---

## Current Next Task

Implement category filtering.

Expected affected files:

services/cake-catalog.ts
app/cakes/page.tsx
app/page.tsx

Only modify additional files if inspection proves they are required.

---

## Current Status

Working:

- homepage
- live catalogue
- cake detail pages
- Supabase catalogue
- public RLS access
- local images
- production deployment

Do not disturb working functionality without a reason.