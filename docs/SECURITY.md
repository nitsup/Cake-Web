# Security

## Core Principle

Security must be enforced at the server/database boundary.

Frontend visibility is not authorization.

---

## Current Database Security

RLS is enabled on:

- cake_categories
- cakes

Public category access requires:

is_active = true

Public cake access requires:

is_active = true
AND
availability = 'available'

---

## Current Role Foundation

The database currently contains role-aware policies using:

user_has_role('editor')
OR
user_has_role('admin')

The project intends to evolve the terminology toward:

Staff
Admin
Owner

Future permissions must remain server-side.

---

## Security Review Areas

When relevant, inspect:

- authentication
- authorization
- RLS
- input validation
- API exposure
- server/client boundaries
- XSS
- CSRF
- injection risks
- privilege escalation
- storage permissions
- rate limiting
- secret exposure
- environment variables
- error information leakage

---

## Secrets

Never commit:

- API keys
- passwords
- service-role credentials
- private tokens
- authentication secrets

Never expose private credentials through:

NEXT_PUBLIC_*

---

## Security Changes

Any change involving:

- RLS
- authentication
- authorization
- user data
- storage
- APIs
- privileged operations

requires explicit security review.

Do not weaken existing security merely to make a feature work.