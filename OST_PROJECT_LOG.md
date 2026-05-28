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

## 2026-05-28 - Checkout Transition Loader Attempt

- Mode: Full ship.
- Branch/commit/PR: `main`, implementation commit `ff3b86a`.
- Goal: reduce perceived wait after `Place Order` by showing an immediate in-modal checkout loader, logging non-PII checkout timing, and navigating to Stripe as soon as a checkout URL is returned.
- Files changed: `apps-script/src/Index.html`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Stripe payload preservation: no `Code.js` changes; checkout amounts, line items, metadata, return URLs, webhook handling, and persistence flows were not changed.
- Decisions: incremented the badge to `4`; kept pre-created Stripe sessions out of scope because that would create order/payment side effects before explicit order intent; kept fallback controls for blocked navigation.
- Validation: `git pull --ff-only`, `npm run validate:runtime`, `node --check tools/validate-repo.mjs`, and `git diff --check` passed.
- Deployment: GitHub push succeeded and `clasp push --force` pushed 4 files to the Apps Script source project; `clasp version "Show checkout transition loader"` returned `Requested entity was not found`, so no version or stable deployment update was completed.
- Smoke tests: stable public deployment was not smoke-tested for this change because version/deploy was blocked; the stable deployment remains at version `828` until the clasp version blocker is resolved.
- Follow-ups: resolve the `clasp version` access/entity blocker, deploy the already-pushed source or a fresh validated commit to the existing stable deployment ID, then run tokenized checkout smoke without recording live tokens.

## 2026-05-28 - Checkout Loader Reship And Apps Script-First Rule

- Mode: Full ship.
- Branch/commit/PR: `main`, runtime implementation commit `ff3b86a`.
- Goal: reship the checkout transition loader to the stable Apps Script deployment, then update repo workflow rules so future Full ships run Apps Script before GitHub push.
- Files changed: `AGENTS.md`, `docs/RUNBOOK.md`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Deployment: `clasp status` succeeded; `clasp push --force` reported the script was already up to date; retrying `clasp version "Show checkout transition loader"` created version `829`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` deployed at version `829`.
- Smoke tests: public stable Apps Script URL contains `Development revision 4`, `orderFlowCheckoutLoading`, and `RT-CHECKOUT-TIMING`, and no stale `Development revision 3` label.
- Decisions: Full ship workflow is now Apps Script-first; run each `clasp` command sequentially, wait for completion, retry failed push/version/deploy commands before declaring a blocker, then log/current-state and push GitHub last.
- Follow-ups: run tokenized checkout smoke separately without recording live tokens.

## 2026-05-28 - Fullscreen Checkout Loader

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: replace the in-modal checkout transition loader with a true fullscreen overlay so `Place Order` immediately shows a centered branded loading state while Stripe Checkout is being prepared.
- Files changed: `apps-script/src/Index.html`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Stripe payload preservation: no `Code.js` changes; checkout amounts, line items, metadata, return URLs, webhook handling, and persistence flows were not changed.
- Decisions: incremented the badge to `5`; kept the existing checkout session creation flow intact; made the checkout loader fixed, viewport-filling, pointer-blocking, and centered above the order modal; forced hidden checkout fallback/action rows to stay hidden while the loading overlay is active.
- Validation before Apps Script ship: `npm run validate:runtime`, `node --check tools/validate-repo.mjs`, and `git diff --check` passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed the runtime source; `clasp version "Show fullscreen checkout loader"` created version `830`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` deployed at version `830`.
- Smoke tests: public stable Apps Script URL contains `Development revision 5`, fullscreen loader markers, and no stale `Development revision 4` label.
- Follow-ups: run a tokenized card checkout smoke separately without recording live tokens to verify the visual transition and same-window Stripe navigation end to end.

## 2026-05-28 - Global Checkout Loading Overlay

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: replace the scrollable/modal-contained checkout loader with the same global project-entry loading overlay style during Stripe Checkout preparation.
- Files changed: `apps-script/src/Index.html`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Stripe payload preservation: no `Code.js` changes; checkout amounts, line items, metadata, return URLs, webhook handling, and persistence flows were not changed.
- Decisions: incremented the badge to `6`; removed the order-flow-specific checkout loader markup and CSS; raised the shared `rtLoadingOverlay` above modal layers; routed order-flow checkout preparation and locked-summary payment preparation through the global loader; kept fallback checkout controls only for failed automatic navigation.
- Validation before Apps Script ship: `npm run validate:runtime`, `node --check tools/validate-repo.mjs`, and `git diff --check` passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Use global checkout loading overlay"` created version `831`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` deployed at version `831`.
- Smoke tests: public stable Apps Script URL contains `Development revision 6`, `showPortalCheckoutPreparationLoader_`, and `z-index: 10300`; stale `Development revision 5` and modal-local `orderFlowCheckoutLoading` markers are absent.
- Follow-ups: run a tokenized card checkout smoke separately without recording live tokens to verify the visual transition and same-window Stripe navigation end to end.

## 2026-05-28 - Checkout Loader Browser Restore Cleanup

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: prevent the Stripe preparation loader from remaining visible when the user returns to the project with browser Back after same-window Stripe Checkout navigation.
- Files changed: `apps-script/src/Index.html`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Stripe payload preservation: no `Code.js` changes; checkout amounts, line items, metadata, return URLs, webhook handling, and persistence flows were not changed.
- Decisions: incremented the badge to `7`; added a checkout-navigation active flag without storing token or customer data; clear the global loader and re-enable order-flow controls on `pagehide`, `pageshow`, focus, and visibility restore when returning from Stripe navigation.
- Validation before Apps Script ship: `npm run validate:runtime`, `node --check tools/validate-repo.mjs`, and `git diff --check` passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Clear checkout loader on browser restore"` created version `832`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` deployed at version `832`.
- Smoke tests: public stable Apps Script URL contains `Development revision 7`, `rtCheckoutNavigationActiveV1`, and `clearCheckoutLoaderForNavigationRestore_`; stale `Development revision 6` is absent.
- Follow-ups: run a tokenized browser Back smoke separately without recording live tokens to verify the restored project page no longer shows the checkout loader.

## 2026-05-28 - Checkout Modal State Restore On Back

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: when returning from same-window Stripe Checkout with browser Back or Stripe Back, hide the checkout status section and restore the order modal to the pre-click selection state.
- Files changed: `apps-script/src/Index.html`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Stripe payload preservation: no `Code.js` changes; checkout amounts, line items, metadata, return URLs, webhook handling, and persistence flows were not changed.
- Decisions: incremented the badge to `8`; kept the existing `Secure payment opened` code path for failure/recovery contexts; added a restore-only helper that clears checkout body/meta/fallback controls and switches the order-flow modal back to fulfillment mode while preserving selected delivery/payment choices.
- Validation before Apps Script ship: `npm run validate:runtime`, `node --check tools/validate-repo.mjs`, and `git diff --check` passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Restore checkout modal state on back"` created version `833`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` deployed at version `833`.
- Smoke tests: public stable Apps Script URL contains `Development revision 8` and `restoreOrderFlowSelectionAfterCheckoutNavigation_`; stale `Development revision 7` is absent.
- Follow-ups: run a tokenized browser Back smoke separately without recording live tokens to verify the restored project page shows the selection state and no checkout status copy.

## 2026-05-28 - Checkout Launch Timing Instrumentation

- Mode: Full ship, Stage 1 instrumentation.
- Branch/commit/PR: `main`.
- Goal: measure checkout launch delay without changing commercial Stripe payloads, order validation, webhook correlation, or durable payment/order state.
- Files changed: `apps-script/src/Code.js`, `apps-script/src/Index.html`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Stripe payload preservation: no amount, line item, metadata, tax, shipping, card fee, payment method, checkout eligibility, return URL, webhook, or persistence schema fields were changed. The Stripe session options now carry an internal timing object that is not written into the Stripe request payload.
- Client timing added: checkout click, loader paint, summary option update, client state capture, client payload serialization, `google.script.run` round trip, checkout URL extraction, and same-window navigation attempt.
- Server timing added: config, spreadsheet open, portal infrastructure, token row lookup, snapshot parse, account resolution, portal state normalization/persistence, order validation, Stripe payload build, Stripe API call/parse, PORTAL_ORDERS write, EXPORT_LOG pointer write, response hydration, and response build.
- Decision: this stage is instrumentation only. The server still returns the hydrated portal payload before returning `checkoutUrl`; no optimization was applied until timing data is collected.
- Dev revision: incremented badge to `9`.
- Validation before Apps Script ship: `npm run validate:runtime`, `node --check tools/validate-repo.mjs`, and `git diff --check` passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Instrument checkout launch timing"` created version `834`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` deployed at version `834`.
- Smoke tests: public stable Apps Script URL contains `Development revision 9`, `checkoutTiming`, and `client_state_capture_start`; stale `Development revision 8` is absent. Server-only timing markers emit during checkout calls and are not visible in public HTML.
- Timing baseline: not run during this ship because a real tokenized checkout attempt creates order/payment artifacts. Collect timings from the next controlled checkout attempt without committing live tokens.

## 2026-05-28 - Stage 2 Fast Checkout Response

- Mode: Full ship, Stage 2 performance.
- Branch/commit/PR: `main`.
- Goal: reduce Place Order to Stripe Checkout delay by skipping noncritical response hydration before normal same-window Stripe navigation.
- Files changed: `apps-script/src/Code.js`, `apps-script/src/Index.html`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Stripe payload preservation: no amount, line item, metadata, tax, shipping, card fee, payment method, return URL, webhook, or persistence schema fields were changed. The existing Stripe Checkout session creation path remains the payment authority.
- Critical work kept before response: portal state persistence, order validation, Stripe Checkout Session creation, PORTAL_ORDERS write, EXPORT_LOG pointer write, and competing unpaid order supersede.
- Decision: added `buildCheckoutFastAttemptResponse_()` for the successful normal checkout path. This response includes checkout URL, checkout attempt ID, order ID, Stripe session ID, payment method, existing Stripe summary, order/account summaries needed by fallback code, and timing data. It does not call `buildOrderActionPortalPayload_()` or `refreshPortalPayloadForToken_()` before normal Stripe navigation.
- Instrumentation: kept Stage 1 timing and added `fastCheckoutResponse: true`, `hydrationSkipped: true`, and parseable `[RT-CHECKOUT-TIMING-JSON]` browser logs.
- Dev revision: incremented badge to `10`.
- Validation before Apps Script ship: `npm run validate:runtime`, `node --check tools/validate-repo.mjs`, and `git diff --check` passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Fast checkout response skips hydration"` created version `835`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` deployed at version `835`.
- Public smoke: stable Apps Script HTML contains `Development revision 10`, `fastCheckoutResponse`, and `[RT-CHECKOUT-TIMING-JSON]`; stale `Development revision 9` is absent.
- Controlled timing result: a disposable/test checkout attempt opened Stripe in the same window and was not paid. Browser timing reported click-to-navigation 18,258 ms and `google.script.run` round trip 18,189 ms. Server timing reported total 15,960 ms, Stripe API call 710 ms, PORTAL_ORDERS write 262 ms, EXPORT_LOG pointer write 514 ms, competing unpaid order supersede 7,412 ms, and response hydration skipped at 0 ms blocking cost.
- Before/after: Stage 1 baseline was `google.script.run` 19,761 ms, server total 16,960 ms, Stripe API call 804 ms, PORTAL_ORDERS write 203 ms, EXPORT_LOG pointer write 617 ms, competing unpaid order supersede 5,895 ms, and response hydration 3,539 ms. Stage 2 removed hydration from the blocking path, but the observed gain was partly masked by slower competing unpaid order supersede in the test sample.
- Follow-ups: Stage 3 should investigate competing unpaid order supersede and portal infrastructure timing without deferring lifecycle-critical work until the correctness boundary is explicitly reviewed.

## 2026-05-28 - Stage 3A Supersede Write Optimization

- Mode: Full ship, Stage 3A performance.
- Branch/commit/PR: `main`.
- Goal: reduce the competing unpaid order supersede phase without changing candidate scope, lifecycle semantics, payment authority, webhook reconciliation, or Stripe checkout payloads.
- Files changed: `apps-script/src/Code.js`, `apps-script/src/Index.html`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Stripe payload preservation: no amount, line item, metadata, tax, shipping, card fee, payment method, return URL, webhook, schema, or Sheet column contract changed.
- Critical pre-response work preserved: portal state persistence, order validation, Stripe Checkout Session creation, PORTAL_ORDERS write, EXPORT_LOG pointer write, and competing unpaid order supersede all still complete before `checkoutUrl` is returned.
- Implementation: extracted the PORTAL_ORDERS update-map builder from `updatePortalOrderState_()`, added a known-row fast write path for supersede, writes each supersedable token-scoped candidate row once with `setValues([rowVals])`, and returns row info from the in-memory updated values instead of rereading each row.
- Candidate scope preserved: token-scoped PORTAL_ORDERS rows only, excluding the newly created order, using the existing supersedable-row filter.
- Instrumentation: added supersede timing markers for optimized status, matched rows, candidate rows, updated rows, skipped rows, and write duration.
- Dev revision: incremented badge to `11`.
- Validation before Apps Script ship: `npm run validate:runtime`, `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, and `git diff --check` passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Optimize unpaid order supersede writes"` created version `836`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` deployed at version `836`.
- Public smoke: stable Apps Script HTML contains `Development revision 11` and `supersedeOptimized`; stale `Development revision 10` is absent.
- Post-ship timing: Apps Script executions showed version 836 `createCheckoutAttempt` runs, including a 12.177 s completed execution after deployment. A disposable/test checkout artifact was created and not paid. Detailed server timing JSON was not recovered because `clasp logs` lacks the configured GCP project ID and the executions UI did not expose parseable log details through the available inspection path.
- Follow-ups: configure reliable Apps Script log access or capture browser console timing from the same signed-in tab before making Stage 3B decisions. Do not defer supersede or narrow to pointer-only cleanup until lifecycle/currentness behavior is reviewed with fixture evidence.

## 2026-05-28 - Stage 3B0 Checkout Timing Observability

- Mode: Full ship, Stage 3B0 instrumentation.
- Branch/commit/PR: `main`.
- Goal: resolve the discrepancy between server timing, Apps Script execution duration, and perceived checkout delay by adding flat, copyable timing summary lines.
- Files changed: `apps-script/src/Code.js`, `apps-script/src/Index.html`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Behavior preservation: no checkout behavior, Stripe payload, order persistence, webhook logic, lifecycle state, schema, or Squarespace wrapper navigation changes were made.
- Client instrumentation: added `[RT-CHECKOUT-TIMING-CLIENT-SUMMARY]` and `[RT-CHECKOUT-TIMING-CLIENT-LEAVE]`, moved normal checkout trace creation to handler start, and marked preflight, loader state, loader paint, state capture, payload serialization, `google.script.run`, checkout URL extraction, navigation assignment, and total click-to-navigation.
- Server instrumentation: kept detailed `[RT-CHECKOUT-TIMING-SERVER]` JSON and added `[RT-CHECKOUT-TIMING-SERVER-SUMMARY]` with flat durations for config, spreadsheet open, infrastructure, token lookup, state persistence, validation, Stripe payload build, Stripe API, PORTAL_ORDERS write, EXPORT_LOG pointer write, supersede, hydration, fast response, and hydration skipped.
- Dev revision: incremented badge to `12`.
- Validation before Apps Script ship: `npm run validate:runtime`, `node --check tools/validate-repo.mjs`, and `git diff --check` passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Add flat checkout timing summaries"` created version `837`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` deployed at version `837`.
- Public smoke: stable Apps Script HTML contains `Development revision 12`, `[RT-CHECKOUT-TIMING-CLIENT-SUMMARY]`, and `[RT-CHECKOUT-TIMING-CLIENT-LEAVE]`; stale `Development revision 11` is absent.
- Controlled timing smoke: a disposable/test checkout attempt was created and not paid. Client flat summary reported `clickToLoader=19`, `clientCapture=2`, `payloadBuild=0`, `serverRoundTrip=12276`, `responseToUrl=0`, `navigationAssign=7`, and `totalClickToNavigation=12352`. Returned server timing reported `totalMs=8236`, `stripeApi=938`, `orderWrite=404`, `exportPointerWrite=603`, `supersede=619`, and `hydrationSkipped=true`.
- Smoke limitation: Playwright automation against the direct Apps Script page logged `launched=true` but did not actually leave the sandbox for Stripe. Manual same-window navigation through the branded wrapper should be rechecked; no false paid state was observed after the automated attempt.
- Log access: `clasp logs --json` is still blocked by missing GCP project ID, so server flat summary retrieval from Apps Script logs remains a tooling follow-up.

## 2026-05-28 - Desktop-Only Mobile Block

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: block phone and narrow-display Portal access with a branded Red Threads screen instead of making the Portal mobile responsive.
- Files changed: `apps-script/src/Index.html`, `web/squarespace-portal-code-block.html`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Behavior preservation: no `Code.js`, Stripe payload, order persistence, webhook logic, lifecycle state, schema, Apps Script config, Sheet contract, or payment data logic changed.
- Implementation: added the app-level mobile block to all Apps Script views and the wrapper-level pre-iframe mobile block to the tracked Squarespace code block.
- Breakpoint: `window.matchMedia("(max-width: 899px)")`; widths `900px+` remain allowed for desktop and wide tablet/landscape use.
- Mobile UI: black fullscreen screen, Red Threads `SMALL_ICON.png`, exact desktop-use message, and copy-link controls using the current URL with clipboard fallback.
- Dev revision: incremented badge to `13`.
- Validation before Apps Script ship: `npm run validate:runtime`, `node --check tools/validate-repo.mjs`, `git diff --check`, and wrapper script parsing passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Block mobile portal access"` created version `838`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` deployed at version `838`.
- Smoke tests: public stable Apps Script HTML contains `Development revision 13`, `portalMobileBlock`, `RT_PORTAL_MOBILE_BLOCK_QUERY`, and the mobile-block copy; stale `Development revision 12` is absent. Desktop wrapper base and tokenized wrapper load the normal login/project views at wide width. Narrow wrapper and direct Apps Script routes show the mobile block with copy-link controls after the Apps Script iframe loads.
- Follow-ups: apply the updated `web/squarespace-portal-code-block.html` in Squarespace so the public wrapper blocks before assigning iframe `src`; until then the deployed app-level guard still blocks narrow Portal access after iframe load.

## 2026-05-28 - Mobile Block Link Display Cleanup

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: remove the boxed mobile-block URL field and prevent long tokenized Portal links from extending beyond the mobile frame.
- Files changed: `apps-script/src/Index.html`, `web/squarespace-portal-code-block.html`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Behavior preservation: no `Code.js`, Stripe payload, order persistence, webhook logic, lifecycle state, schema, Apps Script config, Sheet contract, or payment data logic changed.
- Implementation: replaced the visible read-only URL input with centered plain text using single-line `text-overflow: ellipsis`; copy buttons still copy the full URL from `data-full-link`.
- Dev revision: incremented badge to `14`.
- Validation before Apps Script ship: `npm run validate:runtime`, `node --check tools/validate-repo.mjs`, `git diff --check`, and wrapper script parsing passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Clean mobile portal link display"` created version `839`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` deployed at version `839`.
- Smoke tests: public stable Apps Script HTML contains `Development revision 14`, `portalMobileCurrentLink`, the updated copy fallback, and ellipsis styling; stale `Development revision 13` is absent. Local wrapper visual smoke at `390px` confirmed the mobile block is visible, iframe loading is skipped, the long link remains inside the frame, and CSS ellipsis is active.
- Follow-ups: apply the updated `web/squarespace-portal-code-block.html` in Squarespace so the public wrapper gets the same pre-iframe link-display cleanup.

## 2026-05-28 - Checkout Unsaved Prompt Suppression

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: prevent the browser-native unsaved-changes prompt from appearing after changed quantities are persisted into a newly created Stripe Checkout session.
- Files changed: `apps-script/src/Index.html`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Behavior preservation: no `Code.js`, Stripe payload, order persistence, webhook logic, lifecycle state, schema, Apps Script config, Sheet contract, Squarespace wrapper, or payment data logic changed.
- Implementation: `beforeUnloadGuard` now exits while the portal is already performing an approved Stripe checkout navigation, and the normal checkout path resets the dirty baseline after a successful checkout response returns a valid checkout URL.
- Expected behavior: if a user changes quantities, starts checkout, and the server creates a valid Stripe session, same-window Stripe navigation should not trigger the native browser unsaved-changes prompt. Normal accidental reload/leave protection remains active outside checkout navigation.
- Dev revision: incremented badge to `15`.
- Validation before Apps Script ship: `npm run validate:runtime`, `node --check tools/validate-repo.mjs`, and `git diff --check` passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Suppress checkout unload prompt"` created version `840`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` deployed at version `840`.
- Smoke tests: public stable Apps Script HTML contains `Development revision 15` and the checkout-aware unload guard; stale `Development revision 14` is absent.
- Follow-ups: manually re-test the exact browser-side Back from Stripe -> edit quantities -> Place Order sequence through the branded wrapper and confirm the native prompt no longer appears.
