# Cake Web - Persistent Project Context

> This file is the persistent development context for AI assistants working on this repository.
>
> Read this file before making architectural, database, security, frontend, deployment, or infrastructure decisions.
>
> Do not assume missing information. Preserve existing architecture unless there is a clear reason to change it.
>
> After major completed milestones, append a new numbered UPDATE section instead of rewriting project history.

---

# 1. PROJECT OVERVIEW

## Project Name
Cake Web

## Project Type
A professional full-stack cake bakery/catalog website.

## Main Goals

The website is intended to become a polished production-quality cake storefront with:

- A professional responsive frontend
- Cake catalog and individual cake pages
- Categories
- Cake images
- Tags
- Customization groups and options
- Homepage sections managed from the database
- Site settings
- User profiles and role-based access
- Admin/editor functionality in later phases
- Secure Supabase database integration
- Proper loading, error, empty, and not-found states
- Good accessibility
- SEO foundations
- Production deployment
- Monitoring and error tracking later

The project should be built incrementally and carefully.

Do not rush into changing architecture, database security, or dependencies.

---

# 2. TECH STACK

## Framework
- Next.js 16
- App Router
- TypeScript

## Styling
- Tailwind CSS v4
- CSS variables / semantic design tokens

## UI
- Reusable custom components
- shadcn conventions/primitives where appropriate
- Lucide icons

## Animation
- Motion
- Reduced-motion support is required

## Database and Authentication
- Supabase
- @supabase/supabase-js
- @supabase/ssr

## Validation
- Zod

## Version Control
- Git
- GitHub

---

# 3. IMPORTANT GIT INFORMATION

The repository is connected to GitHub.

The project has previously experienced confusion with Git initialization, remotes, branch names, and GitHub accounts.

Current workflow:

1. Check changes:
   git status

2. Review changes:
   git diff --stat

3. Validate:
   npx tsc --noEmit
   npm run lint
   npm run build

4. Only commit after validation passes.

5. Then:
   git add .
   git commit -m "descriptive commit message"
   git push

IMPORTANT:
Do not commit broken or unvalidated work unless explicitly instructed.

Do not accidentally expose environment files or secrets.

The active branch has previously been reported as:
- master

Confirm the current branch with:
git branch --show-current

Do not assume the branch name.

---

# 4. DATABASE STATUS

The Supabase database has already been created and migrated.

The database and security architecture are considered established.

Important tables include:

- profiles
- cake_categories
- cakes
- cake_images
- cake_tags
- cake_tag_assignments
- customization_groups
- customization_options
- cake_customization_groups
- homepage_sections
- site_settings
- audit_logs

RLS policies were previously checked individually.

The expected policies were reported as PASS.

IMPORTANT:
Do not casually modify:

- Database schema
- RLS policies
- Security functions
- Triggers
- Authentication architecture
- Role protection
- Existing constraints
- Existing indexes

unless a deliberate new requirement requires it.

The database setup was difficult and should be treated as a protected foundation.

---

# 5. SECURITY ARCHITECTURE

Existing database architecture includes:

- Row Level Security
- Role-based access concepts
- Public visibility policies
- Admin/editor permissions
- Profile role protection
- Audit logging
- Security-definer functions where required
- Search path protection checks
- Auth user/profile relationship

Known functions include:

- current_user_role
- user_has_role
- prevent_profile_role_change
- set_updated_at
- handle_new_user

Known triggers include:

- trg_handle_new_user
- trg_prevent_profile_role_change
- Updated-at triggers for applicable tables

Do not weaken security simply to make frontend development easier.

---

# 6. SUPABASE ENVIRONMENT STATUS

The project contains environment validation.

Required variables include:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
- NEXT_PUBLIC_APP_URL

A production build previously failed because:

- No .env.local was present
- No .env was present
- Only .env.example existed

The build error reported missing:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

IMPORTANT:
Do not hardcode secrets or Supabase keys into source code.

The next immediate infrastructure task is to create a local `.env.local` using the correct values from the Supabase project.

The `.env.local` file must remain uncommitted.

---

# 7. CURRENT FRONTEND ARCHITECTURE

The project uses Next.js App Router.

Important existing frontend areas include:

## Global Application Shell

- app/layout.tsx
- app/globals.css

The global shell includes or is intended to include:

- Skip-to-content link
- Site header
- Main content region
- Site footer
- Semantic layout
- Global accessibility foundations

## Layout Components

- components/layout/site-header.tsx
- components/layout/site-footer.tsx
- components/layout/mobile-navigation.tsx

The mobile navigation should remain a small client-side boundary.

Do not unnecessarily convert the entire application layout into a client component.

## UI Components

Existing or planned reusable UI includes:

- Container
- Button
- Card
- Badge
- Input
- Skeleton
- EmptyState
- ErrorState
- ImagePlaceholder
- Reveal
- SectionHeading

## Cake Components

Existing:

- components/cake/cake-card.tsx
- components/cake/cake-grid.tsx

## Hooks

Existing:

- hooks/use-reduced-motion.ts

## Design System

Existing:

- lib/design-tokens.ts
- Semantic CSS variables in app/globals.css

The design system should use semantic tokens instead of random isolated colors and spacing values.

---

# 8. HOMEPAGE STATUS

The homepage has been implemented as a frontend storefront foundation.

It currently uses temporary/local placeholder content.

The homepage includes concepts such as:

- Hero
- CTA areas
- Featured cakes
- Cake cards/grid
- Categories
- Brand/story section
- USP/value sections
- Final CTA
- Header
- Footer
- Responsive behavior
- Focus states
- Motion reveals
- Reduced-motion support

IMPORTANT:
The current copy and imagery are temporary.

Do not treat placeholder assets as final branding.

---

# 9. CAKES CATALOG STATUS

A `/cakes` route has been created.

Relevant files include:

- app/cakes/page.tsx
- app/cakes/loading.tsx
- app/cakes/error.tsx
- components/cake/cake-grid.tsx
- services/cake-catalog.ts

The catalog service was designed using confirmed database fields.

Known cake fields include:

- id
- name
- slug
- short_description
- full_description
- base_price
- sale_price
- category_id
- is_active
- is_featured
- availability
- SEO-related fields
- display priority
- timestamps

The public catalog query filters for:

- is_active = true
- availability = 'available'

Category data is obtained through the category relationship.

Database snake_case fields are mapped into frontend TypeScript types.

Images currently remain placeholder-based until the final image contract/assets are integrated.

---

# 10. CAKES ERROR ARCHITECTURE

An earlier implementation incorrectly placed JSX inside a try/catch block.

This caused ESLint errors:

- react-hooks/error-boundaries
- "Avoid constructing JSX within try/catch"

This was refactored.

Current intended architecture:

- Data failure handling belongs in the async/data layer
- Route-level rendering errors use App Router error boundaries
- app/cakes/error.tsx handles route-level errors
- JSX should not be wrapped inside a try/catch merely to catch component rendering errors

Do not suppress this lint rule with eslint-disable comments.

---

# 11. VALIDATION STATUS

Previously confirmed:

- TypeScript passed after the `/cakes` error-boundary refactor
- The 8 JSX-in-try/catch lint errors were fixed
- Changed-file diagnostics were clean

Previously unresolved:

- A production build could not complete because Supabase environment variables were missing

The environment issue must be fixed before considering the current `/cakes` milestone fully validated.

Required validation commands:

```bash
npx tsc --noEmit
npm run lint
npm run build

12. ASSETS STATUS

Final brand assets are not yet integrated.

A friend was expected to provide assets.

Until final assets arrive:

Use placeholders
Preserve realistic image aspect ratios
Do not tightly couple layout to temporary images
Make asset replacement easy

Potential final assets include:

Logo / Branding
Primary logo
Secondary logo or mark
Favicon
Light/dark variants if needed
Hero Assets

Recommended dimensions:

Desktop hero: approximately 2400 x 1350 px
Mobile hero: approximately 1080 x 1350 px
Cake Images

Recommended:

Minimum 1600 x 1200 px
Prefer consistent photography ratios
Keep original high-resolution source files

Potential views:

Main product image
Alternate angle
Close-up
Slice/interior
Decoration detail
Category Images

Recommended:

Approximately 1600 x 1000 px
Background / Editorial Images

Use only where they improve storytelling.
Avoid excessive decorative image clutter.

IMPORTANT:
Do not build the final design around arbitrary temporary assets.

13. DESIGN DIRECTION

The intended design should be:

Premium
Modern
Warm
Professional
Clean
Not excessively rounded
Not overloaded with cards
Not visually generic
Mobile-first
Accessible

Use:

Semantic colors
Consistent spacing
Restrained shadows
Modest border radii
Strong typography hierarchy
Intentional animation

Do not introduce arbitrary colors or spacing values throughout components.

14. INFRASTRUCTURE NOT YET CONFIGURED

These are future phases.

Vercel

Planned for deployment.

Needs later:

GitHub integration
Environment variables
Production deployment
Preview deployments
Domain configuration if applicable
Sentry

Planned for error monitoring.

Do not configure until the application has reached a more stable functional state unless specifically needed earlier.

Cloudflare

Planned only if there is a clear architectural purpose.

Do not introduce Cloudflare complexity prematurely.

Possible later uses:

DNS
CDN
Caching
Security
Domain management

Current priority is application functionality and clean deployment first.

15. DEVELOPMENT RULES FOR AI ASSISTANTS

Before editing:

Read this file.
Inspect relevant existing files.
Identify dependencies and architecture.
Explain or internally determine the smallest coherent change.
Do not modify unrelated files.

During development:

Keep changes scoped.
Preserve security boundaries.
Do not invent database fields.
Confirm schema fields before querying them.
Do not hardcode secrets.
Do not disable lint rules just to silence errors.
Prefer existing project patterns.
Keep server components server-rendered where possible.
Keep client components narrowly scoped.
Avoid unnecessary dependencies.

After development:

Run:

npx tsc --noEmit
npm run lint
npm run build

Then:

git status --short
git diff --stat

Do not commit automatically unless explicitly instructed.