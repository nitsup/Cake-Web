# Changelog / Historical Notes

## Initial Bakery Project

The project originally targeted a bakery client.

The client later discontinued the project while development was underway.

The project was subsequently repositioned as a reusable full-stack foundation and learning project.

---

## Homepage Catalogue Migration

The homepage originally used hardcoded placeholder cakes.

It was changed to retrieve live catalogue data through:

getPublicCakes()

This made the homepage and catalogue use the same catalogue source.

---

## CakeCard Navigation Fix

CakeCard originally only made the arrow clickable.

The implementation was updated so the image, name, description, and arrow can navigate to the cake detail page without introducing nested Link elements.

---

## Homepage CTA

The hero CTA originally pointed to:

#featured

It was changed to:

/cakes

---

## Homepage Heading Incident

The homepage heading was accidentally emptied during development.

It was restored to:

Cakes with a little more feeling.

Future changes should avoid touching it without a concrete requirement.

---

## Image Deployment Incident

Local image assets existed correctly under:

public/cakes/

The relevant filenames were:

birthday_rainbow_cake.png
Good_choclate_cake.jpeg

The production issue was ultimately associated with deployment/environment context rather than simply missing source files.

---

## Vercel Environment Incident

A Preview deployment was inspected while Production was the intended environment.

The production environment behaved correctly after the deployment context was corrected.

Lesson:

Verify project, environment, branch, commit, domain, and environment variables before changing application code.

---

## Git Incident

The repository experienced a non-fast-forward push and merge-state confusion.

Lesson:

Do not casually force-push master.

Understand remote/local divergence before rewriting history.

---

## SQL Seed Incident

Multiple SQL editor scripts existed during development.

Two initial seed versions were created.

Do not blindly execute both versions.

The later idempotent seed version used conflict-safe insertion behavior.

Future migrations should use clear numbering and naming.