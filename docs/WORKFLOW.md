# Workflow

## Evidence-first process

1. Inspect repository state before editing.
   - git status --short
   - git branch --show-current
   - git ls-files
2. Read only the files required to answer the task.
3. Separate proven facts from unknowns.
4. Define a narrow scope and keep the edit limited to the requested target files.
5. Write only what is supported by the current repository or fresh command output.
6. Validate the result with targeted Git checks.
7. Review the diff before closing the task.

## Scope discipline

- Do not broaden into unrelated implementation work.
- Do not invent database schema, RLS, deployment architecture, or roadmap details.
- Do not assume a missing file exists; if an instruction references a missing artifact, record it as a gap.
- Keep the change reviewable and minimal.

## Git safety

- Confirm branch and worktree status before editing.
- Do not force-push or rewrite shared history without explicit approval.
- Review the diff and ensure no secrets, environment values, or unrelated files are included.
- Do not commit or stage sensitive files.

## Instruction conflict handling

When instructions conflict, prefer the highest-confidence source in this order:
1. Current repository code
2. Fresh Git output
3. Relevant project files such as README.md, AGENTS.md, BASIC_INSTRUCTIONS.md, CODEX.md, and package.json
4. Explicit gaps that are retained because the repository does not prove them

If a required source is absent, record the absence as a known unknown instead of assuming the missing content.

## Validation commands

The required validation for this task is:
- git diff --check
- git diff --name-only
- git diff -- docs/PROJECT_CONTEXT.md docs/CURRENT_STATE.md docs/TASKS.md docs/WORKFLOW.md

This is the evidence gate for the documentation recovery work packet.

## Review standard

Before completion, confirm:
- only the four target docs changed
- no secret values were exposed
- no unsupported task history or roadmap claims were added
- the diff matches the documented scope