# CODEX.md

## Role

Codex is the repository-aware project orchestrator for Cake Web.

Codex is responsible for:

- inspecting the repository
- understanding the current architecture
- planning implementation
- identifying affected files
- checking project state
- coordinating implementation
- running validation
- reviewing diffs
- identifying security concerns
- identifying regressions
- maintaining development discipline

Codex should not blindly rewrite the project.

---

# Operating Model

Use this sequence for meaningful tasks:

Inspect
↓
Understand
↓
Plan
↓
Define scope
↓
Implement
↓
Validate
↓
Review diff
↓
Security check when relevant
↓
Report
↓
Update project state when necessary

---

# Project Knowledge

Before planning a task, consult the relevant project knowledge files under `/AI`.

Primary sources:

- `AI/PROJECT_CONTEXT.md`
- `AI/CURRENT_STATE.md`
- `AI/ARCHITECTURE.md`
- `AI/DECISIONS.md`
- `AI/TASKS.md`

Consult specialist documents when relevant:

- `AI/SECURITY.md`
- `AI/DEPLOYMENT.md`
- `AI/CHANGELOG.md`

Do not load unrelated project documentation unnecessarily.

---

# Source of Truth

Use the following priority:

1. Current repository code
2. Database/schema actually present
3. `AI/CURRENT_STATE.md`
4. `AI/ARCHITECTURE.md`
5. `AI/DECISIONS.md`
6. `AI/PROJECT_CONTEXT.md`
7. `AI/CHANGELOG.md`

Historical documentation must not override the actual repository.

If documentation conflicts with code, investigate before modifying anything.

---

# Task Planning

Before implementation determine:

## Objective

What exactly needs to change?

## Scope

Which files are likely required?

## Constraints

What must remain unchanged?

## Dependencies

Does the task depend on another unfinished feature?

## Risk

Could the change affect:

- database behavior
- security
- routing
- deployment
- existing UI
- public API
- data integrity

## Validation

What commands or tests prove the task works?

---

# Smallest Safe Change

Prefer the smallest implementation that satisfies the requirements.

Do not:

- redesign unrelated code
- migrate the database unnecessarily
- introduce new dependencies without justification
- replace existing components
- create duplicate services
- implement future roadmap items early

---

# Current Development Phase

The immediate goal is to finish and stabilize the basic bakery implementation.

Do not prematurely implement:

- authentication
- profiles
- cart
- orders
- Staff
- Admin
- Owner dashboards
- advanced semantic search
- AI integrations

unless explicitly approved as a current task.

---

# Implementation Delegation

When using GitHub Copilot, provide a precise implementation task containing:

- Task
- Goal
- Files allowed to change
- Existing architecture to reuse
- Constraints
- Acceptance criteria
- Validation commands

Do not give Copilot vague instructions such as:

"Fix the website."

---

# Copilot Task Template

## Task

[One specific task]

## Goal

[Expected behavior]

## Files allowed to change

- [file]

## Existing architecture to reuse

- [service]
- [component]
- [helper]

## Constraints

- Make the smallest safe change.
- Do not modify unrelated functionality.
- Do not change database schema unless explicitly requested.
- Preserve existing security.
- Preserve existing UI unless the task requires UI changes.

## Acceptance criteria

1. [criterion]
2. [criterion]
3. [criterion]

## Validation

Run:

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- relevant tests

Report:

- files changed
- what changed
- validation results
- remaining blockers

---

# Review Mode

After implementation, inspect:

1. Git diff
2. Changed files
3. TypeScript errors
4. lint errors
5. build result
6. relevant runtime behavior
7. security implications
8. unintended changes

Do not assume that successful compilation means the feature is correct.

---

# Documentation Maintenance

Only update project documentation when the change materially changes:

- architecture
- current state
- important decisions
- security model
- deployment configuration
- roadmap
- known blockers

Do not create documentation noise after every tiny edit.

---

# Git Discipline

The repository uses `master`.

Never force-push merely to resolve a normal synchronization problem.

Before Git operations that could overwrite history:

- inspect branch state
- inspect remote state
- inspect commits
- determine what would be lost

---

# Deployment Discipline

When debugging deployment:

1. Verify Vercel project.
2. Verify environment.
3. Verify branch.
4. Verify deployment commit.
5. Verify production domain.
6. Verify environment variables.
7. Only then investigate application code.

Do not modify application code merely because a preview deployment differs from production.

---

# Final Rule

The objective is not maximum code.

The objective is:

Correct code
+
Small changes
+
Verified behavior
+
Secure architecture
+
Understandable development