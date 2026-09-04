# Architecture

## Application

Cake-Web uses Next.js with the App Router and TypeScript.

## Main layers

### App routes

Responsible for:

- pages
- route parameters
- search parameters
- page-level server rendering

### Components

Reusable UI components live under:

`components/`

Components should remain reusable and should not contain
unnecessary business/database logic.

### Services

Application data access lives under:

`services/`

Supabase/database access should normally be isolated here rather
than duplicated throughout components.

### Database

Supabase provides PostgreSQL storage and Row Level Security.

### Public assets

Static assets are stored under:

`public/`

Local assets referenced by the frontend must exist in the repository
and use paths compatible with Next.js public assets.

## Data flow

Preferred public catalog flow:

Next.js route
→ catalog service
→ Supabase
→ public RLS policy
→ server-rendered data
→ reusable components

## Current catalog

The cake catalog contains:

- cakes
- cake categories
- category relationship through `category_id`

Public cake visibility is controlled by database RLS and the
application's public query.

## Routing

Current:

`/cakes`

`/cakes/[slug]`

Planned:

`/cakes?category=<category-slug>`

Avoid creating separate category routes unless there is a concrete
reason.

## Important principle

Reuse existing services and components before creating new ones.

Do not duplicate catalog queries or create parallel image systems.

## Server/client boundaries

Prefer server-side data fetching when interactivity does not require
client state.

Only introduce client components where browser interaction requires them.

Never move privileged credentials or server-only logic into client code.

# Architecture

## Application Structure

Next.js App Router
        │
        ├── Homepage
        │
        ├── /cakes
        │      └── Catalogue
        │
        └── /cakes/[slug]
               └── Cake detail
                       │
                       ▼
                  Catalog Service
                       │
                       ▼
                    Supabase
                       │
                       ▼
                  PostgreSQL
## Frontend Architecture

Pages should compose existing reusable components.

Important reusable components:

- CakeCard
- CakeGrid
- ImagePlaceholder

Avoid duplicating catalogue presentation logic.

---

## Service Layer

Public catalogue data should be retrieved through:

services/cake-catalog.ts

Important function:

getPublicCakes()

The service should remain the primary abstraction for public catalogue retrieval.

---

## Database Architecture

cake_categories
        │
        │ category_id
        ▼
cakes

cake_categories:

- id
- name
- slug
- description
- display_priority
- is_active
- created_at
- updated_at

cakes:

- id
- name
- slug
- short_description
- full_description
- base_price
- sale_price
- category_id
- availability
- is_featured
- is_active
- display_priority
- seo_title
- seo_description
- created_at
- updated_at

---

## Database Relationships

cakes.category_id
    ↓
cake_categories.id

Foreign key:

ON UPDATE CASCADE
ON DELETE RESTRICT

---

## Security Architecture

Public data is controlled by PostgreSQL RLS.

Frontend UI visibility is not considered authorization.

Future Staff/Admin/Owner permissions must be enforced server-side and through database authorization/RLS where appropriate.

---

## Future Architecture

Future systems may include:

User
Staff
Admin
Owner

Authentication
Profiles
Cart
Orders
Analytics
Audit logs
Storage
APIs
AI

These must be introduced incrementally after the basic bakery foundation is stable.