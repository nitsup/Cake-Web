# Architecture Decisions

## ADR-001: Bakery as First Implementation

Decision:

Use the bakery website as the first implementation of a reusable full-stack foundation.

Reason:

It provides a realistic environment for learning frontend, backend, database, security, deployment, and future platform architecture.

Constraint:

Do not prematurely implement future platform features.

---

## ADR-002: Catalogue Filtering URL

Decision:

Use:

/cakes?category=category-slug

instead of:

/cakes/category/[slug]

Reason:

The `/cakes` route already owns catalogue browsing.

This avoids creating an unnecessary second routing system.

---

## ADR-003: Shared Catalogue Service

Decision:

Use:

services/cake-catalog.ts

as the shared catalogue retrieval layer.

Reason:

The homepage and catalogue should use the same source of truth.

---

## ADR-004: Database Security

Decision:

Use PostgreSQL RLS and server-side authorization as the security boundary.

Reason:

Hiding frontend controls is not authorization.

---

## ADR-005: Local Images for Current Bakery

Decision:

Use local assets under:

public/cakes/

for the current static bakery implementation.

Future dynamic administration may move image management to controlled storage.

---

## ADR-006: Small Verified Changes

Decision:

Implement features in small verified slices.

Reason:

This reduces regressions, makes AI-assisted development easier to review, and helps the user understand the codebase.

---

## ADR-007: Avoid Premature Platform Development

Decision:

Do not implement authentication, cart, orders, Staff, Admin, Owner, advanced search, or AI integrations before the bakery foundation is stable.

Reason:

Future architecture must not derail the current implementation.