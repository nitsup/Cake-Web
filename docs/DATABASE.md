# Database

## Platform

Supabase PostgreSQL.

## Current public catalog tables

### cake_categories

Known columns:

- id
- name
- slug
- description
- display_priority
- is_active
- created_at
- updated_at

### cakes

Known columns:

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

## Relationships

`cakes.category_id`

references:

`cake_categories.id`

Foreign key behavior currently uses:

- ON UPDATE CASCADE
- ON DELETE RESTRICT

## Constraints

Category slug is unique.

Cake slug is unique.

Category display priority must be non-negative.

Cake display priority must be non-negative.

Cake availability is restricted to:

- available
- unavailable

Cake base price must be non-negative.

Sale price must be non-negative when present.

Sale price cannot exceed base price.

## Public visibility

Cake categories are publicly selectable when:

`is_active = true`

Cakes are publicly selectable when:

`is_active = true`

and:

`availability = 'available'`

## RLS

RLS is enabled on both public catalog tables.

Public users can select active categories.

Public users can select visible cakes.

Editor/admin policies exist for appropriate management operations.

Do not bypass or weaken these policies without explicit approval.

## Important

This document describes known architecture.

Before modifying the database, query the live schema rather than assuming
this document is still perfectly current.

Never store:

- database passwords
- service-role keys
- API keys
- authentication secrets

in this file.