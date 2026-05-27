# OST Project Log

Append-only project memory for decisions, session summaries, validation results, and follow-ups. Keep entries short and link to commits/PRs when available.

## Session Entry Template

```md
## YYYY-MM-DD - Short Title

- Mode:
- Branch/commit/PR:
- Goal:
- Files changed:
- Validation:
- Decisions:
- Current-state updates:
- Follow-ups:
```

## 2026-05-27 - Build Alignment Reset

- Mode: Produce final code.
- Branch/commit/PR: `codex/build-alignment-repo-visibility`, commit `f61f03d`.
- Goal: create shared repo visibility for Codex, Atlas, GitHub inspection, and owner workflow.
- Files changed: docs/tooling/fixture hygiene only.
- Validation: `npm run validate`, `node --check tools/validate-repo.mjs`, `jq empty ...`, `git diff --check`.
- Decisions: docs/tooling-only changes do not require `clasp push`, `clasp version`, or `clasp deploy`; duplicate `skuKey` values are allowed and must not be treated as unique.
- Current-state updates: local clasp deployment/version verification is blocked with `Requested entity was not found`; current tracked runtime appears behind fuller portal architecture context.
- Follow-ups: ACH copy is a runtime follow-up; schema `printJobs.minItems: 0` mismatch needs a separate schema/contract correction task.

## 2026-05-27 - Lean Guidance Consolidation

- Mode: Produce final code.
- Branch/commit/PR: `codex/build-alignment-repo-visibility`.
- Goal: reduce rule drift by consolidating behavior rules into `AGENTS.md`, current facts into `docs/CURRENT_BUILD_STATE.md`, decisions/session history into this log, and commands into `docs/RUNBOOK.md`.
- Decisions: delete duplicated docs instead of keeping pointer stubs; add PR template and GitHub Actions validation.
