# Deployment

## Repository

GitHub:

nitsup/Cake-Web

Primary branch:

master

---

## Deployment

Platform:

Vercel

Project:

cake-web

Production deployment is the intended public deployment.

---

## Important Deployment Lesson

When local behavior differs from production, verify deployment context before modifying application code.

Check:

1. Vercel project
2. Environment
3. Branch
4. Commit
5. Production domain
6. Environment variables

---

## Environment Variables

Known application variables include:

NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_APP_URL

Never place private credentials into NEXT_PUBLIC_* variables.

---

## Git Discipline

Do not casually use:

git push --force

especially on master.

If the remote is ahead:

1. inspect Git state
2. inspect commits
3. understand divergence
4. resolve safely
5. push normally

---

## Deployment Validation

After a meaningful production deployment verify:

- homepage
- catalogue
- cake detail page
- images
- database-backed content
- navigation
- production environment
- expected commit

---

## Deployment Debugging

Do not create random README commits merely to trigger deployment.

Deployment should be deliberate and traceable.