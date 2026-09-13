# AI Development Workflow

## Principle

Use specialized AI roles instead of asking every AI to perform
the entire development process.

## Pipeline

Planner
→ Architect
→ GitHub Copilot
→ Tester
→ Security Reviewer
→ Code Reviewer
→ Release

## Planner

Determines:

- scope
- requirements
- affected files
- acceptance criteria
- risks

Planner should not modify code.

## Architect

Determines:

- implementation approach
- existing components/services to reuse
- architectural risks

Architect should not modify code.

## GitHub Copilot

Primary implementation tool.

Copilot may modify code according to the approved plan.

Keep changes minimal.

## Tester

Reviews the implementation for:

- functional correctness
- edge cases
- navigation
- error states
- empty states
- responsive behavior
- regressions

## Security Reviewer

Reviews:

- RLS
- authorization
- authentication boundaries
- secrets
- API exposure
- input validation
- server/client boundaries
- privilege escalation

## Code Reviewer

Reviews:

- maintainability
- duplication
- unnecessary complexity
- TypeScript
- Next.js conventions
- accessibility
- performance
- scope creep

## Release Manager

Checks:

- git status
- branch
- diff
- tests
- environment
- deployment target
- assets
- database changes

## Communication

Agents should not all communicate directly.

The human developer acts as the approval point between stages.

Pass concise artifacts between agents:

- task
- plan
- architecture decision
- git diff
- test report
- security report

Do not repeatedly pass entire conversations.

## Write authority

Only one AI should modify the same feature at a time.

GitHub Copilot is currently the primary code-generation authority.

## Final authority

The human developer approves changes before commit/deployment.