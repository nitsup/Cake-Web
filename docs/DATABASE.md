# Database

## Platform

Supabase PostgreSQL.

## Current public catalogue

The public catalogue contains category records and cake records with
descriptions, pricing, availability, display ordering, and timestamps.

## Relationships

Each cake belongs to one category. The relationship cascades on category
updates and prevents deleting a category that still has cakes.

Foreign key behavior currently uses:

- ON UPDATE CASCADE
- ON DELETE RESTRICT

## Constraints

Category and cake slugs are unique.

Display priorities must be non-negative.

Cake availability is restricted to:

- available
- unavailable

Cake base price must be non-negative.

Sale price must be non-negative when present.

Sale price cannot exceed base price.

## Public visibility

Categories are publicly selectable when:

`is_active = true`

Cakes are publicly selectable when:

`is_active = true`

and:

`availability = 'available'`

## RLS

Row-level security protects the public catalogue records.

Public users can select active categories and visible cakes.

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