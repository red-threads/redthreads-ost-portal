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

## 2026-05-27 - Dev Revision 1 Badge

- Mode: Full ship.
- Branch/commit/PR: `codex/dev-badge-rev1`, PR #3, merge commit `093f929`.
- Goal: add a visible in-app dev badge for TestFlight-style build verification.
- Files changed: `apps-script/src/Index.html`, `OST_PROJECT_LOG.md`, runtime validation tooling/runbook workflow support.
- Validation: `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate`, `node --check tools/validate-repo.mjs`, `jq empty ...`, `git diff --check`, GitHub PR validation passed.
- Decisions: badge displays `DEV 1` in the top-right corner of the Apps Script app; Stripe-hosted pages are out of scope.
- Current-state updates: GitHub merge completed; Apps Script push/version/deploy blocked because `clasp push`, `clasp deployments`, and `clasp versions` returned `Requested entity was not found`.
- Follow-ups: increment the badge and append a log entry on each future shipped app revision.

## 2026-05-27 - Mainline Full Ship Workflow Alignment

- Mode: Produce final code.
- Branch/commit/PR: `main`.
- Goal: align portal workflow more closely with merch-store pricing full-ship practice.
- Files changed: workflow docs, validation scripts, GitHub workflow/template, README.
- Validation: `npm run validate`, `npm run validate:runtime`, `node --check tools/validate-repo.mjs`, `git diff --check`.
- Decisions: dev badge Full ship exposed too much branch/PR friction; owner-directed runtime Full ships now default to direct `main` plus Apps Script deployment; PRs are optional exceptions.
- Current-state updates: no runtime files changed; no Apps Script deployment run for this docs/tooling workflow update.
- Follow-ups: clasp binding/account still needs repair before Apps Script live deployment can complete from this environment.

## 2026-05-27 - Dev Revision 1 Re-Ship Attempt

- Mode: Full ship.
- Branch/commit/PR: `main`, source already contains Dev Revision 1 badge from merge commit `093f929`.
- Goal: re-ship the `DEV 1` badge to the live Apps Script deployment.
- Files changed: `OST_PROJECT_LOG.md`, `docs/CURRENT_BUILD_STATE.md`.
- Validation: `npm run validate:runtime`, `git diff --check`.
- Decisions: no new runtime edit was needed because `apps-script/src/Index.html` already contains `DEV 1`.
- Current-state updates: `clasp status` can list local Apps Script source files, but `clasp deployments`, `clasp versions`, and `clasp push --force` all returned `Requested entity was not found`; no Apps Script version/deploy was run.
- Follow-ups: repair the current local clasp binding/account access before Apps Script live deployment can complete from this environment.
