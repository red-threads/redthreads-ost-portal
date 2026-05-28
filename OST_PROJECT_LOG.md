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

## 2026-05-27 - Live Apps Script Source Alignment

- Mode: Full ship.
- Branch/commit/PR: `main`, commit `7fc1e09`.
- Goal: repair the repo/live Apps Script mismatch, preserve the live source of truth locally, and re-ship the `DEV 1` badge.
- Files changed: `.clasp.json`, live-pulled Apps Script runtime source, `TaxForm3372Manifest.html`, validation tooling, runbook/current-state/log docs.
- Validation: `npm run validate:binding`, `node --check tools/validate-repo.mjs`, `jq empty ...`, `git diff --check`, public stable URL marker check.
- Decisions: verified the live Apps Script project ID from the Apps Script editor, updated the local clasp binding to that project, ran `clasp pull` before any push, and removed the checked-in Team Mode default credential so the repo does not store that value.
- Current-state updates: `clasp pull` succeeded and pulled `appsscript.json`, `Code.js`, `Index.html`, and `TaxForm3372Manifest.html`; `DEV 1` was reapplied on top of the live `Index.html`; `clasp push --force` succeeded; Apps Script version `826` was created and deployed to the existing stable deployment ID; public stable URL contains `DEV 1` and `devRevisionBadge`.
- Follow-ups: confirm the Team Mode password is configured in Apps Script Script Properties before relying on Team Mode; full lifecycle/payment fixture regression was not run in this badge/source-alignment pass.

## 2026-05-27 - Squarespace Portal Wrapper Tracking

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: make the active Squarespace `/portal` iframe wrapper part of the shared GitHub source of truth.
- Files changed: `web/squarespace-portal-code-block.html`, `README.md`, `docs/CONTEXT_INDEX.md`, `docs/CURRENT_BUILD_STATE.md`, validation tooling, project log.
- Validation: `npm run validate`, `node --check tools/validate-repo.mjs`, `git diff --check`, wrapper passthrough marker check.
- Decisions: store the wrapper as a tracked web integration artifact; keep Apps Script deployment untouched because this change is repo/Squarespace source tracking only.
- Current-state updates: wrapper forwards `t`, `checkoutResult`, and `stripeSessionId` to the stable Apps Script deployment.
- Follow-ups: if Squarespace code changes in the website editor, update this file in the same change so GitHub remains canonical.

## 2026-05-28 - Same-Window Stripe Checkout Navigation

- Mode: Full ship.
- Branch/commit/PR: `main`, implementation commit `1fff2c6`.
- Goal: mirror the Merch Store desktop/fallback same-window Stripe Checkout navigation pattern in the Portal without changing commercial Stripe payload construction.
- Merch Store inspection: `Index.html` uses `navigateToStripeCheckout()` -> `navigateToTopUrl()` with top-window navigation and `RT_MERCH_PRICING_NAVIGATE` postMessage fallback; `cloud-run/merch-store-checkout-api/server.js` launcher uses `window.location.replace()` but current Merch mobile intentionally remains a new-tab exception.
- Files changed: `apps-script/src/Index.html`, `web/squarespace-portal-code-block.html`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Stripe payload preservation: no `Code.js` changes; inspected and preserved `createCheckoutAttempt`, `createLockedOrderPaymentCheckout_`, `buildCheckoutAttemptStripeOptions_`, `buildStripeCheckoutSessionRequestData_`, `createStripeCheckoutSession_`, `buildStripeReturnBaseUrl_`, and `buildStripeCheckoutReturnUrl_`.
- Decisions: incremented the badge to `DEV 2`; removed pre-opened/new-tab checkout launch as the primary path; added child route replacement and same-window Stripe navigation helpers; added wrapper handlers for `RT_PORTAL_ROUTE_REPLACE` and `RT_PORTAL_NAVIGATE`.
- Validation: `git pull --ff-only`, `npm run validate:runtime`, `node --check tools/validate-repo.mjs`, and `git diff --check` passed.
- Deployment: `clasp push --force` pushed 4 files; `clasp version "Use same-window Stripe checkout navigation"` created version `827`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` deployed at version `827`.
- Smoke tests: public stable Apps Script URL contains `DEV 2`, `RT_PORTAL_ROUTE_REPLACE`, `RT_PORTAL_NAVIGATE`, and `navigateToPortalStripeCheckout_`; live Squarespace `/portal` still needs the updated tracked wrapper snippet applied before wrapper fallback route/navigation handlers are live.
- Follow-ups: run tokenized project and real/test checkout smoke with a safe fixture token; do not record live tokens in this log.

## 2026-05-28 - Dev Revision 3 Badge Restyle

- Mode: Full ship.
- Branch/commit/PR: `main`, implementation commit `792b158`.
- Goal: move the revision badge to the bottom-left window corner, remove the `DEV` letters, and restyle it as a Red Threads glass badge.
- Files changed: `apps-script/src/Index.html`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Decisions: badge now displays only `3`, uses a red/dark glass treatment, and remains pointer-transparent.
- Validation: `git pull --ff-only`, `npm run validate:runtime`, `node --check tools/validate-repo.mjs`, and `git diff --check` passed.
- Deployment: `clasp push --force` pushed 4 files; `clasp version "Restyle dev revision badge"` created version `828`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` deployed at version `828`.
- Smoke tests: public stable Apps Script URL contains `Development revision 3`, bottom-left badge CSS, and no stale `DEV 2` label; live `/portal` wrapper shows the fullscreen iframe and route/navigation handlers after the Squarespace snippet correction.
- Follow-ups: run tokenized project checkout smoke separately; do not record live tokens in this log.
