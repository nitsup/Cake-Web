# Cake Shop Website - Master Project Context

## Project Goal

Build a production-quality, full-stack website for a large professional cake shop.

The website must be:

- Secure
- Fast
- SEO-friendly
- Responsive
- Mobile-first
- Maintainable
- Scalable
- Accessible
- Easy for non-developers to manage through an admin CMS
- Built with a clean and professional architecture

Do not build a prototype with fake architecture. Build the foundation as if this will eventually become a real business website.

---

# Technology Stack

Use these technologies unless explicitly instructed otherwise:

## Core Framework

- Next.js
- App Router
- TypeScript
- React

## Styling

- Tailwind CSS
- shadcn/ui
- CSS variables for design tokens where appropriate

## Animation

- Motion for React

Animations must be purposeful and subtle.

Do not over-animate the interface.

## Icons

- Lucide React

Do not use random external image icons when a Lucide icon exists.

## Backend

Initially use:

- Next.js Route Handlers
- Server Components where appropriate
- Server Actions only when appropriate
- Clean service-layer architecture

Do not mix database queries directly throughout UI components.

## Database

- PostgreSQL
- Supabase as the managed PostgreSQL provider

Database access must be structured cleanly.

The database design should support future scaling.

## Authentication

- Supabase Auth

Do not build custom password hashing or custom authentication from scratch.

Authentication requirements:

- Sign up
- Login
- Logout
- Secure sessions
- Password reset capability
- Email verification capability
- Protected routes
- Role-based access control

Roles:

- customer
- editor
- admin

The frontend must never be the only authority for authorization.

Every protected server action or API route must independently verify authentication and authorization.

## Validation

- Zod

All important server-side inputs must be validated.

Client-side validation may improve UX but must never replace server-side validation.

## Forms

- React Hook Form
- Zod integration

## Images

The system must support a pluggable image provider.

Initially design the code so that Cloudinary or Supabase Storage can be used without rewriting the entire application.

Do not hardcode image URLs throughout components.

## Deployment

Development and initial deployment:

- Vercel

Production architecture should remain compatible with:

- Vercel
- Supabase
- Cloudflare

## Monitoring

The architecture must support:

- Sentry for error monitoring
- Analytics integration
- Server-side logging

Do not expose sensitive error information to normal users.

---

# Architecture Rules

Follow a clean separation between:

1. Presentation/UI layer
2. Business logic
3. Validation
4. Authentication and authorization
5. Database access
6. External services

Avoid large monolithic files.

Do not put all application logic inside page.tsx files.

Prefer reusable components and functions.

Do not duplicate logic.

---

# Recommended Folder Responsibilities

app/
- Routing
- Page composition
- Layouts
- Route handlers

components/
- Reusable UI components
- Page-level reusable components

components/ui/
- shadcn/ui components

lib/
- Shared utilities
- Configuration
- Validation
- Security helpers
- Database helpers

services/
- Business logic
- Database operations
- External integrations

types/
- Shared TypeScript types

hooks/
- Reusable React hooks

---

# Security Requirements

The website must follow secure defaults.

Requirements include:

- Environment variables for all secrets
- No secrets committed to Git
- .env.example with placeholders only
- Authentication verification on the server
- Authorization verification on the server
- Role-based access control
- Input validation using Zod
- Rate limiting architecture for sensitive routes
- Secure error handling
- Image/file upload validation
- File size limits
- Allowed MIME type validation
- Security headers where appropriate
- No exposure of service role keys to the browser
- Audit logging for important admin actions

Never expose:

- Database secrets
- Supabase service role keys
- API keys
- Internal stack traces
- Sensitive user data

---

# SEO Requirements

The website must support:

- Dynamic metadata
- Unique title tags
- Meta descriptions
- Canonical URLs
- Open Graph metadata
- Twitter/X metadata
- sitemap.xml
- robots.txt
- Structured data

Important structured data types may include:

- LocalBusiness
- Bakery
- Product
- Offer
- BreadcrumbList

SEO metadata should eventually be manageable dynamically where useful.

---

# Performance Requirements

The website should:

- Be mobile-first
- Optimize images
- Use lazy loading where appropriate
- Avoid unnecessary client-side JavaScript
- Use Server Components where possible
- Avoid unnecessary re-renders
- Support caching
- Be CDN-friendly

Do not add a heavy dependency without a reason.

---

# Accessibility Requirements

Follow good accessibility practices.

Requirements:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Accessible labels
- Meaningful alt text
- Good contrast
- Proper dialog accessibility
- Respect prefers-reduced-motion where possible

---

# Website Roles

## Visitor

Can:

- View homepage
- Browse cakes
- Search cakes
- Filter cakes
- View cake details
- Register
- Login

## Customer

Can:

- Perform all visitor actions
- Manage profile
- Save favourites

Future functionality may include:

- Orders
- Custom cake requests
- Saved addresses

## Editor

Can:

- Create cakes
- Edit cakes
- Manage prices
- Manage images
- Manage categories
- Manage content allowed by permissions

Cannot:

- Manage administrators
- Change critical security settings

## Admin

Full administrative access.

Can:

- Manage users
- Manage editors
- Manage cakes
- Manage categories
- Manage homepage content
- Manage customization options
- View analytics
- View audit logs
- Manage site settings

---

# Core Pages

Public:

/
 /cakes
 /cakes/[slug]
 /login
 /signup
 /profile

Admin:

/admin
/admin/cakes
/admin/cakes/new
/admin/cakes/[id]/edit
/admin/categories
/admin/customization
/admin/analytics
/admin/settings

Not all pages need to be built immediately.

---

# Cake Data Requirements

A cake should eventually support:

- id
- name
- slug
- short description
- full description
- base price
- sale price
- category
- tags
- images
- featured status
- availability
- SEO title
- SEO description
- display priority
- created at
- updated at

Do not hardcode products into frontend arrays once the database is available.

The public website should retrieve cake information from the backend/database.

---

# Admin CMS Requirements

The admin dashboard must eventually allow administrators to:

- Create cakes
- Read cakes
- Update cakes
- Delete cakes safely
- Upload/manage cake images
- Manage categories
- Change prices
- Change availability
- Mark featured cakes
- Manage homepage sections
- Manage site settings

Changes made through the admin dashboard should update the public website without requiring code changes.

---

# API Rules

API routes should follow a consistent structure.

Version APIs when appropriate:

/api/v1/...

Every protected endpoint should generally follow:

1. Authenticate user
2. Authorize role/permission
3. Rate limit if required
4. Validate input
5. Execute business logic
6. Perform database operation
7. Return a consistent response

Example success response:

{
  "success": true,
  "data": {}
}

Example error response:

{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Safe user-facing message"
  }
}

Do not expose internal implementation details.

---

# Coding Standards

Use:

- TypeScript strict mode
- Meaningful names
- Small focused functions
- Reusable types
- Clear error handling
- Minimal duplication

Avoid:

- any unless absolutely unavoidable
- giant components
- database queries directly inside random UI components
- duplicated authorization logic
- duplicated validation schemas
- hardcoded secrets
- hardcoded production URLs

Before generating code:

1. Inspect the existing project structure.
2. Reuse existing patterns.
3. Do not overwrite working files unnecessarily.
4. Do not introduce alternative frameworks.
5. Do not change the technology stack without explicit approval.

When adding code:

1. Explain what files will be created or modified.
2. Explain why.
3. Generate code in small, reviewable steps.
4. Mention required commands.
5. Mention required environment variables.
6. Mention security considerations.

If requirements are unclear, do not invent a major architectural decision without clearly flagging it.

---

# Development Strategy

The project must be built in phases.

Phase 1:
Project foundation and architecture.

Phase 2:
Database and authentication.

Phase 3:
Authorization and admin foundation.

Phase 4:
Cake CMS and CRUD.

Phase 5:
Public cake showroom.

Phase 6:
Homepage and premium UI.

Phase 7:
Cake customization.

Phase 8:
SEO, analytics, monitoring, security audit.

Phase 9:
Production testing and deployment.

Do not skip phases.

Do not generate the entire project at once.

Prioritize correctness, maintainability, security, and clarity over generating large amounts of code.