# Tasks

## Current task

Recover and stabilize the four project documents requested for this work packet:
- docs/PROJECT_CONTEXT.md
- docs/CURRENT_STATE.md
- docs/TASKS.md
- docs/WORKFLOW.md

This task is documentation recovery only. No feature implementation, schema changes, or unrelated file edits are included.

## Constraints

- Use only repository evidence and freshly captured Git output.
- Do not invent backlog items, roadmap items, or historical task records.
- Do not modify files outside the four target documents.
- Do not expose secrets, environment values, or private credentials.
- If a referenced source is missing, record the gap rather than assuming the missing artifact exists.

## Conservative task template

### Task
One specific task to be performed.

### Goal
The expected result in plain language.

### Scope
- Files allowed to change
- Files intentionally excluded

### Source evidence
- Relevant files inspected
- Fresh command output used as evidence

### Constraints
- Keep the change minimal and safe.
- Do not invent database, security, or deployment details.
- Do not broaden scope without a proven need.

### Validation
- git diff --check
- git diff --name-only
- git diff -- docs/PROJECT_CONTEXT.md docs/CURRENT_STATE.md docs/TASKS.md docs/WORKFLOW.md

## Retained unknowns

- No backlog beyond this documentation task is recorded here.
- No future production roadmap is assumed.
- No database, security, or deployment history is claimed unless the repository proves it.