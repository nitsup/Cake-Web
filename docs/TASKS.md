# Tasks

## Current Phase

Basic Bakery Foundation

---

## Current Task

Category filtering

### Goal

Allow catalogue filtering through:

/cakes?category=category-slug

### Confirmed category

celebration-cakes

### Expected files

- services/cake-catalog.ts
- app/cakes/page.tsx
- app/page.tsx

### Constraints

- Preserve public visibility filtering.
- Do not modify database schema.
- Do not invent categories.
- Reuse the existing catalogue service.
- Preserve existing UI.
- Make the smallest safe change.

### Acceptance Criteria

1. `/cakes` continues to show all public cakes.
2. `/cakes?category=celebration-cakes` shows only matching public cakes.
3. Existing public visibility rules remain intact.
4. Homepage Celebration cakes links to the filtered catalogue.
5. Invalid category slugs do not expose unrelated cakes.
6. Existing cake detail navigation continues working.
7. TypeScript, lint, and build pass.

---

## After Current Task

1. Complete homepage cleanup.
2. Complete category navigation.
3. Improve catalogue search.
4. SEO.
5. Accessibility/responsive QA.
6. Security review.
7. Production stability audit.
8. Bakery foundation completion.

---

## Deferred

Do not implement yet:

- authentication
- profiles
- OTP
- cart
- orders
- Staff
- Admin
- Owner
- analytics platform
- advanced semantic search
- AI integrations
- dynamic image administration