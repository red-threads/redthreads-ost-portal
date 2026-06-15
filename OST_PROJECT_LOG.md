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

## 2026-05-28 - ACH Checkout Selection Enabled

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: re-enable ACH bank transfer as a selectable payment method in the Portal checkout flow.
- Files changed: `apps-script/src/Code.js`, `apps-script/src/Index.html`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Implementation: enabled the existing shared ACH gate in server and client runtime code, updated checkout button copy to `Pay now: ACH Bank Transfer`, and incremented the dev badge to `16`.
- Payment behavior: the existing Stripe Checkout ACH path remains in place and uses `payment_method_types[0]=us_bank_account` with automatic bank verification. No amount, line item, metadata, return URL, webhook, currentness guard, schema, or Sheet contract logic was changed.
- Expected behavior: ACH appears in the order checkout flow and locked invoice payment controls. Card checkout remains available and still applies the card fee; ACH follows the existing async payment confirmation path.
- Validation before Apps Script ship: `npm run validate:runtime`, `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, and `git diff --check` passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Enable ACH checkout selection"` created version `841`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` deployed at version `841`.
- Smoke tests: public stable Apps Script HTML contains `Development revision 16` and `Pay now: ACH Bank Transfer`; stale `Development revision 15` is absent. Browser automation confirmed the deployed direct Apps Script page source contains revision `16` and ACH button copy, but did not complete an in-app ACH checkout attempt.
- Follow-ups: run one controlled ACH Stripe test checkout through the branded wrapper using Stripe test bank details; verify pending state, async success/failure webhook handling, and no false paid state before client pilot use.

## 2026-05-29 - Checkout Return Welcome Modal Suppression

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: prevent the welcome intro modal from auto-opening after a user returns from Stripe through Stripe's cancel/back route.
- Files changed: `apps-script/src/Index.html`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Behavior preservation: no `Code.js`, Stripe payload, return URL, order persistence, webhook logic, lifecycle state, schema, Apps Script config, Sheet contract, Squarespace wrapper, or payment data logic changed.
- Implementation: `handleCheckoutReturnNotice()` now marks `SUPPRESS_NEXT_AUTO_INTRO` when `checkoutResult=success` or `checkoutResult=cancel` is detected before consuming URL params, and `startPortalApp()` treats the captured checkout return result as an explicit intro-suppression reason.
- Expected behavior: the checkout return notice still appears and the URL still cleans back to the tokenized project URL, but the welcome modal does not auto-open after Stripe cancel/back or success return.
- Dev revision: incremented badge to `17`.
- Validation before Apps Script ship: `npm run validate:runtime`, `node --check tools/validate-repo.mjs`, and `git diff --check` passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Suppress checkout return welcome modal"` created version `842`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` deployed at version `842`.
- Smoke tests: public stable Apps Script HTML contains `Development revision 17` and checkout-return intro suppression symbols; stale `Development revision 16` is absent.
- Follow-ups: manually re-test Stripe cancel/back from the branded wrapper and confirm the URL cleans to `/portal?t=<token>` without showing the welcome modal.

## 2026-05-29 - Checkout Return Request Metadata VM Pass

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: fix the remaining Stripe cancel/back case where the parent wrapper URL briefly contained `checkoutResult=cancel`, then cleaned to the tokenized project URL, but the welcome intro modal still appeared.
- Root cause: the Squarespace wrapper was forwarding `checkoutResult=cancel` into the Apps Script iframe, but the initial Portal boot could run before the client reliably read that return signal from `window.location.search` or from parent iframe messaging.
- Files changed: `apps-script/src/Code.js`, `apps-script/src/Index.html`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Behavior preservation: no Stripe payload, return URL composition, order persistence, webhook logic, lifecycle state, schema, Apps Script config, Sheet contract, Squarespace wrapper, or payment data logic changed.
- Implementation: `doGet(e)` now attaches safe request-route metadata to the rendered VM, and `Index.html` reads `VM.requestRoute.checkoutResult` before falling back to the browser query string. This gives `startPortalApp()` the cancel/success return state before it decides whether to auto-open the welcome intro.
- Dev revision: incremented badge to `18`.
- Validation before Apps Script ship: `npm run validate:runtime`, `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, and `git diff --check` passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Preserve checkout return state in VM"` created version `843`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` deployed at version `843`.
- Smoke tests: public stable Apps Script checkout-cancel URL response contains `Development revision 18`, does not contain stale `Development revision 17`, and renders a VM with `requestRoute.checkoutResult=cancel`.
- Follow-ups: manually re-test Stripe's in-page Back/cancel through the branded wrapper and confirm the URL cleans to `/portal?t=<token>` without showing the welcome modal.

## 2026-05-29 - ACH V1 Infrastructure Local Build

- Mode: Architect + Goal Mode.
- Branch/commit/PR: `main`; no commit, push, Apps Script push, version, deploy, or live smoke was run.
- Goal: implement ACH V1 as a Stripe-hosted delayed-payment lifecycle with Customer persistence, dashboard bank setup, saved-bank summaries, ACH pending-production policy, webhook idempotency, and client/team status copy.
- Files changed: `apps-script/src/Code.js`, `apps-script/src/Index.html`, `web/squarespace-portal-code-block.html`, `docs/CONTEXT_INDEX.md`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`, `docs/ACH_STRIPE_PORTAL_ARCHITECTURE.md`, `docs/ACH_SMOKE_TEST_PLAN.md`, `docs/ACH_SCRIPT_PROPERTIES.md`, and `testcases/ach-fixtures/*`.
- Implementation: added safe ACH Script Property config, `STRIPE_ACH_ENABLED` runtime visibility gating, `PORTAL_STRIPE_EVENTS`, Stripe Customer helpers, safe ACH payment-method summary helpers, hosted ACH payment Checkout with Customer, hosted ACH setup Checkout, ACH webhook idempotency/audit handling, ACH lifecycle derivation, account-level pending-production approval, dashboard Payment Methods UI, ACH checkout/return/status copy, Team Controls approval action, and wrapper `setupResult` passthrough.
- Safety decisions: V1 Financial Connections permissions are restricted to `payment_method`; raw bank details and raw Financial Connections account objects are redacted before webhook audit storage; saved bank data is limited to Stripe IDs, bank name, last4, status/verification metadata, timestamps, and source.
- Validation: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, JSON syntax checks for ACH fixture files, `npm run validate:runtime`, and `git diff --check` passed.
- Sensitive-data search: targeted ACH search found only redaction/safety/documentation references plus pre-existing tax form direct-pay fields outside the ACH storage path; no new ACH path stores full bank account numbers, routing numbers, microdeposit values, or raw Financial Connections data.
- Deployment state: not deployed. Stable Apps Script remains version `843` until explicit Full ship authorization.
- Follow-ups: configure Script Properties, enable ACH Direct Debit in Stripe Dashboard, subscribe/verify the Cloud Run webhook forwarder event set, manually update the Squarespace `/portal` code block from the repo wrapper, then run the documented ACH smoke plan before committing/pushing the tranche.

## 2026-06-01 - ACH V1 Hardening Full Ship

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: fix and ship the three ACH review hardening items found after ACH V1 deployment: redact tokenized URL fields from Stripe webhook audit JSON, block locked-invoice ACH Customer preparation while ACH is disabled, and prevent duplicate ACH success finalization/copy across distinct Stripe success event types.
- Files changed: `apps-script/src/Code.js`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Implementation: `redactStripeObjectForStorage_()` now redacts URL/redirect keys; `createLockedOrderPaymentCheckout_()` now returns `ach_checkout_disabled` before calling `prepareAchStripeCustomerForCheckout_()` when `STRIPE_ACH_ENABLED` is false; ACH success handlers preserve existing `paidAt` and skip second `finalizePortalAfterPayment()` calls when the order is already recorded paid; ACH-cleared system messages now have a semantic dedupe key.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, and `git diff --check` passed. Targeted secret/raw-bank grep returned no committed Stripe secrets or raw bank assignment patterns.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Harden ACH webhook finalization"` created version `845`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` deployed at version `845`.
- Smoke tests: direct Apps Script `/exec`, direct tokenized `/exec`, public wrapper `/portal`, and tokenized public wrapper returned HTTP 200; public wrapper target matched the stable deployment ID; decoded VM reported `achPaymentEnabled=true`, `mode=client`, and the ACH fixture remained `currentPaymentState=pending`, not paid. No bank flow or payment was initiated.
- Follow-ups: continue the documented internal Stripe test-mode ACH flight test for dashboard setup, success/failure, microdeposit fallback if presented, approved-account pending-production exception, and webhook replay/idempotency before any live-mode pilot.

## 2026-06-01 - ACH Terminal And Saved-Bank Hardening Full Ship

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: complete the remaining ACH V1 production-grade hardening items: prevent stale ACH pending/processing events from regressing terminal orders, map Stripe microdeposit `requires_action` to bank-verification-pending state, and block unsafe saved-bank reuse after hard ACH failures or disputes.
- Files changed: `apps-script/src/Code.js`, `docs/ACH_SMOKE_TEST_PLAN.md`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Implementation: added ACH verification/microdeposit mapping helpers; guarded `checkout.session.completed` and `payment_intent.processing` so paid, failed, disputed, team-hold, in-production, and closed ACH orders are preserved; mapped PaymentIntent/SetupIntent `next_action.verify_with_microdeposits` to `achVerificationStatus=microdeposit_pending`; and called the saved-bank unusable helper from hard ACH failure/dispute paths.
- Behavior preservation: no `snapshotJson`, EXPORT_LOG wide-schema order, token lookup semantics, pricing authority, `appsscript.json`, `.clasp.json`, Script Properties, Stripe live-mode setting, card, PO, check/cash/manual, or Team Mode permission logic changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, and `git diff --check` passed. Targeted sensitive-data search found only redaction/safety/documentation references plus pre-existing tax-form direct-pay fields outside the ACH storage path.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Harden ACH terminal and saved-bank states"` created version `846`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` deployed at version `846`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200; public wrapper `/portal` returned HTTP 200 and still targets the stable deployment ID while forwarding `setupResult`, `checkoutResult`, and `stripeSessionId`. No bank flow, tokenized fixture payment, or real payment was initiated during this ship.
- Follow-ups: continue the documented internal Stripe test-mode ACH flight test for dashboard setup, success/failure, microdeposit fallback if presented, approved-account pending-production exception, stale pending-event replay, saved-bank blocking, and webhook replay/idempotency before any live-mode pilot.

## 2026-06-01 - ACH Saved-Bank And Verification UX Completion Full Ship

- Mode: Goal Mode / Full ship.
- Branch/commit/PR: `main`.
- Goal: complete the five ACH customer workflows from the tranche audit: first-time hosted ACH, microdeposit fallback guidance, returning saved-bank checkout, dashboard pre-linking, and ACH cancel/abandon recovery.
- Files changed: `apps-script/src/Code.js`, `apps-script/src/Index.html`, `docs/ACH_STRIPE_PORTAL_ARCHITECTURE.md`, `docs/ACH_SMOKE_TEST_PLAN.md`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Implementation: ACH Checkout Sessions now request Stripe saved-bank redisplay with `saved_payment_method_options[allow_redisplay_filters]`; PaymentMethod summaries prefer real bank verification status over generic PaymentIntent `processing` when available; pending/unverified/failed/blocked ACH methods no longer become the portal default saved bank; Dashboard still displays pending bank verification status; ACH cancel returns tell users to retry Stripe-hosted instant verification/manual entry or choose another method; and client/summary copy distinguishes bank-verification pending from ACH payment processing.
- Behavior preservation: no `snapshotJson`, EXPORT_LOG wide-schema order, token lookup semantics, pricing authority, `appsscript.json`, `.clasp.json`, Script Properties, Stripe live-mode setting, card, PO, check/cash/manual, or Team Mode permission logic changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, and targeted ACH sensitive-data search passed. The sensitive-data search returned only redaction/safety/documentation references plus pre-existing tax-form direct-pay fields outside the ACH storage path.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Complete ACH saved-bank and verification UX"` created version `847`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` deployed at version `847`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200 and contained the new ACH cancel and bank-verification-pending copy; public wrapper `/portal` returned HTTP 200 and still targets the stable deployment ID while forwarding `setupResult`, `checkoutResult`, and `stripeSessionId`. No bank flow, tokenized fixture payment, or real payment was initiated during this ship.
- Follow-ups: run the live internal Stripe test-mode bank-flow flight test for dashboard setup, first-time ACH success, microdeposit fallback if presented, ACH failure, approved-account pending-production exception, and webhook replay/idempotency before any live-mode pilot.

## 2026-06-01 - ACH Setup Return Validation Fix Full Ship

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: fix the live Dashboard ACH bank setup error where a logged-in dashboard user saw `Secure bank setup cannot start because the portal return URL is not configured`.
- Root cause: Stripe setup success URLs intentionally contain the literal `{CHECKOUT_SESSION_ID}` placeholder, but the portal's pre-Stripe public URL guard parsed that placeholder as a normal URL value and rejected the otherwise valid public return URL before calling Stripe.
- Files changed: `apps-script/src/Code.js`, `apps-script/src/Index.html`, `docs/ACH_SMOKE_TEST_PLAN.md`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Implementation: added setup-return URL validation that normalizes Stripe's `{CHECKOUT_SESSION_ID}` placeholder only for the public portal guard; preserved the existing public Red Threads portal URL requirement; allowed logged-in session dashboards to promote hydrated account summaries into the account bearer return context; incremented the dev badge to `23`.
- Behavior preservation: no `snapshotJson`, EXPORT_LOG wide-schema order, token lookup semantics, pricing authority, `appsscript.json`, `.clasp.json`, Script Properties, Stripe live-mode setting, Squarespace wrapper, card checkout, PO, check/cash/manual, or Team Mode permission logic changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, a local placeholder-validation simulation, and `git diff --check` passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Fix ACH setup return validation"` created version `854`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` deployed at version `854`.
- Smoke tests: public wrapper `/portal` returned HTTP 200 and still targets the stable deployment ID; direct Apps Script `/exec` returned HTTP 200. No bank flow, tokenized fixture payment, real payment, Script Properties change, live-mode switch, or Squarespace update was performed during this ship.
- Follow-ups: retry the Dashboard `ACH Bank Account` card while logged in; the previous return URL configuration error should be cleared, and any Stripe-hosted setup that opens must remain test-mode only until the internal ACH flight test is complete.

## 2026-06-01 - ACH Return Reconciliation Completion Full Ship

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: complete the remaining ACH V1 return-path gap so a completed Stripe-hosted ACH Checkout return cannot depend on webhook timing or manual refresh before the portal shows a locked pending-not-paid state.
- Files changed: `apps-script/src/Code.js`, `apps-script/src/Index.html`, `docs/ACH_SMOKE_TEST_PLAN.md`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Implementation: added server action `reconcile_checkout_return` / `reconcileCheckoutReturn`, Stripe Checkout Session verification for return URLs, ACH-evidence-gated pending reconciliation that never marks ACH paid from browser return alone, setup-return account refresh, client boot-time return UI lock, pending-webhook polling, and locked ACH pending payload handling in post-checkout hydration.
- Behavior preservation: no `snapshotJson`, EXPORT_LOG wide-schema order, token lookup semantics, pricing authority, `appsscript.json`, `.clasp.json`, Script Properties, Stripe live-mode setting, Squarespace wrapper, card, PO, check/cash/manual, or Team Mode permission logic changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, and `git diff --check` passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Complete ACH return reconciliation"` created version `848`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` deployed at version `848`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200 and advertises the new `reconcileCheckoutReturn` server function; public wrapper `/portal` returned HTTP 200 and still targets the stable deployment ID while forwarding `setupResult`, `checkoutResult`, and `stripeSessionId`. No bank flow, tokenized fixture payment, or real payment was initiated during this ship.
- Follow-ups: run the live internal Stripe test-mode bank-flow flight test for dashboard setup return reconciliation, first-time ACH success return reconciliation, ACH failure, microdeposit fallback if presented, approved-account pending-production exception, and webhook replay/idempotency before any live-mode pilot.

## 2026-06-01 - ACH Microdeposit Verification Handoff Full Ship

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: close the remaining five-flow gap for first-time manual-entry/microdeposit fallback by giving customers a Dashboard action that opens Stripe-hosted microdeposit verification without collecting or storing bank details in the portal.
- Files changed: `apps-script/src/Code.js`, `apps-script/src/Index.html`, `web/squarespace-portal-code-block.html`, `docs/ACH_STRIPE_PORTAL_ARCHITECTURE.md`, `docs/ACH_SMOKE_TEST_PLAN.md`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Implementation: added server action `get_ach_microdeposit_verification_link` / `getAchMicrodepositVerificationLink`, ACH-evidence-gated PaymentIntent/SetupIntent lookup for `next_action.verify_with_microdeposits.hosted_verification_url`, Dashboard Payment Methods "Verify with Stripe" behavior for pending microdeposit banks, and a repo wrapper allowlist for Stripe-hosted payment/verification URLs.
- Safety: hosted verification URLs are returned only in the immediate browser response and are not written to Sheets, docs, logs, browser state, or fixture files; no routing numbers, account numbers, raw bank tokens, raw Financial Connections objects, or microdeposit values are stored.
- Behavior preservation: no `snapshotJson`, EXPORT_LOG wide-schema order, token lookup semantics, pricing authority, `appsscript.json`, `.clasp.json`, Script Properties, Stripe live-mode setting, card, PO, check/cash/manual, or Team Mode permission logic changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, and `git diff --check` passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Add ACH microdeposit verification handoff"` created version `849`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` deployed at version `849`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200 and advertises the new `getAchMicrodepositVerificationLink` server function; public wrapper `/portal` returned HTTP 200 and still targets the stable deployment ID. No bank flow, tokenized fixture payment, or real payment was initiated during this ship.
- Follow-ups: manually refresh the live Squarespace `/portal` code block from the repo wrapper so `RT_PORTAL_NAVIGATE` explicitly allows Stripe-hosted microdeposit verification URLs, then run the internal Stripe test-mode microdeposit fallback flow through Dashboard Payment Methods.

## 2026-06-01 - ACH Dashboard Card Visibility Full Ship

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: make the customer dashboard ACH entry point explicit after live review showed the existing generic `Payment Methods` / `Add bank account` card was not recognizable as ACH functionality.
- Files changed: `apps-script/src/Index.html`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Implementation: changed the dashboard account-grid card to `ACH Bank Account`, changed the empty-state value to `Connect ACH bank`, changed the hover/action copy to `Add ACH bank`, moved the ACH card before Credit Terms and Tax Exemption, updated microdeposit guidance copy to point at `ACH Bank Account`, and incremented the dev badge to `19`.
- Behavior preservation: no `snapshotJson`, EXPORT_LOG wide-schema order, token lookup semantics, pricing authority, `Code.js`, `appsscript.json`, `.clasp.json`, Script Properties, Stripe live-mode setting, Squarespace wrapper, card checkout, PO, check/cash/manual, or Team Mode permission logic changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, and `git diff --check` passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Expose ACH dashboard card"` created version `850`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` deployed at version `850`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200 and contains `Development revision 19`, `ACH Bank Account`, `Connect ACH bank`, `Add ACH bank`, and `achPaymentEnabled`; public wrapper `/portal` returned HTTP 200, still targets the stable deployment ID, and includes the Stripe-hosted payment/verification navigation allowlist. No bank flow, tokenized fixture payment, or real payment was initiated during this ship.
- Follow-ups: reload the client dashboard and confirm the account grid now shows `ACH Bank Account`; continue the internal Stripe test-mode bank-flow flight test for dashboard setup, first-time ACH success, microdeposit fallback if presented, ACH failure, approved-account pending-production exception, and webhook replay/idempotency before any live-mode pilot.

## 2026-06-01 - Dashboard ACH Feature Flag Preservation Full Ship

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: fix the remaining live dashboard issue where the deployed badge and ACH card copy were present, but the authenticated dashboard still hid the ACH card.
- Root cause: `applyAuthShellRuntimeState()` rebuilds the client auth/dashboard VM after login through `buildClientAuthShellVm()`, and that client-side VM omitted `featureFlags`. The dashboard ACH card is correctly gated by `isClientAchPaymentEnabled_()`, so the gate became false after the auth-shell reset even when the server-rendered boot VM had `achPaymentEnabled=true`.
- Files changed: `apps-script/src/Index.html`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Implementation: `buildClientAuthShellVm()` now carries forward cloned `VM.featureFlags`, preserving `achPaymentEnabled` through login/dashboard state resets; the dev badge was incremented to `20`.
- Behavior preservation: no `snapshotJson`, EXPORT_LOG wide-schema order, token lookup semantics, pricing authority, `Code.js`, `appsscript.json`, `.clasp.json`, Script Properties, Stripe live-mode setting, Squarespace wrapper, card checkout, PO, check/cash/manual, or Team Mode permission logic changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, and `git diff --check` passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Preserve dashboard ACH feature flags"` created version `851`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` deployed at version `851`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200 and contains `Development revision 20`, `ACH Bank Account`, and `achPaymentEnabled`; the in-app browser public wrapper reload showed dev badge `20`. The reload landed on the login screen, so authenticated dashboard visual confirmation remains for the owner after login.
- Follow-ups: owner should log back into the dashboard and confirm the account grid now shows `ACH Bank Account`; continue the internal Stripe test-mode ACH bank-flow flight test before any live-mode pilot.

## 2026-06-01 - Account Dashboard Deep Links And ACH Setup Returns Full Ship

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: add no-password account dashboard deep links and route hosted Stripe ACH setup success/cancel back to the account dashboard instead of the Apps Script iframe sandbox URL.
- Files changed: `apps-script/src/Code.js`, `apps-script/src/Index.html`, `web/squarespace-portal-code-block.html`, `docs/ACH_SMOKE_TEST_PLAN.md`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Implementation: added `accountAccessToken` to `PORTAL_ACCOUNTS`; added account-dashboard direct access by `accountId` or generated bearer `accountAccessToken`; extended dashboard home, account status, project peek, and project status authorization to account context; allowed ACH setup from a valid account direct dashboard context; normalized Stripe setup return URLs to the public portal base with `dashboard=1`; preserved project-origin checkout return behavior while adding support for dashboard-origin payment returns; and updated the repo Squarespace wrapper to forward `dashboard`, `accountId`, and `accountAccessToken`.
- Behavior preservation: no `snapshotJson`, EXPORT_LOG wide-schema order, token lookup semantics, pricing authority, `appsscript.json`, `.clasp.json`, Script Properties, Stripe live-mode setting, card checkout, PO, check/cash/manual, or Team Mode permission logic changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, and `git diff --check` passed. Targeted sensitive-data search found only code references, safety/docs references, pre-existing tax-form direct-pay fields, and existing Stripe runtime response variables; no committed secret values or raw ACH bank numbers were found.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Add account dashboard deep links"` created version `852`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` deployed at version `852`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200 and contains `Development revision 21`, `accountAccessToken`, `createAchSetupSession`, and `reconcileCheckoutReturn`; direct Apps Script account-dashboard URL rendering returned HTTP 200 with account-route metadata; public wrapper `/portal` returned HTTP 200 and still targets the stable deployment ID. The live Squarespace wrapper did not yet forward `dashboard` or `accountId` into the iframe, so public account-dashboard links require a manual live Squarespace code-block refresh from the repo wrapper before end-to-end public-wrapper smoke.
- Follow-ups: refresh the live Squarespace `/portal` code block from `web/squarespace-portal-code-block.html`, then smoke `?dashboard=1&accountId=<account-id>` and `?dashboard=1&accountAccessToken=<account-access-token>` through the public wrapper and complete the internal Stripe test-mode ACH setup return flow.

## 2026-06-01 - Tokenized Dashboard ACH Setup Fix Full Ship

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: fix Dashboard ACH setup from tokenized job/dashboard links and prevent Stripe setup calls from being made with missing hosted return URLs.
- Files changed: `apps-script/src/Code.js`, `apps-script/src/Index.html`, `docs/ACH_STRIPE_PORTAL_ARCHITECTURE.md`, `docs/ACH_SMOKE_TEST_PLAN.md`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Implementation: tokenized dashboard links now authorize ACH setup when the token resolves through `EXPORT_LOG` to the same persisted `PORTAL_ACCOUNTS` account; token dashboard hydration ensures or generates `accountAccessToken` and promotes future dashboard actions to account bearer context; hosted ACH setup validates non-empty public portal `success_url` and `cancel_url` before calling Stripe; and microdeposit verification uses the same token/session/account authorization paths.
- Behavior preservation: no `snapshotJson`, EXPORT_LOG wide-schema order, token lookup semantics, pricing authority, `appsscript.json`, `.clasp.json`, Script Properties, Stripe live-mode setting, card checkout, PO, check/cash/manual, or Team Mode permission logic changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, and targeted sensitive-data search passed. The sensitive-data search returned only code references, safety/docs references, pre-existing tax-form direct-pay fields, and existing transient Stripe runtime response variables; no committed secret values or raw ACH bank numbers were found.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Fix tokenized dashboard ACH setup"` created version `853`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` deployed at version `853`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200 and exposes `createAchSetupSession` and `getAchMicrodepositVerificationLink`; public wrapper `/portal` returned HTTP 200 and still targets the stable deployment ID; in-app browser smoke confirmed the public wrapper forwards `dashboard=1` and `accountId` into the stable Apps Script iframe. No bank flow, tokenized fixture payment, or real payment was initiated during this ship.
- Follow-ups: run the internal Stripe test-mode Dashboard bank setup from a valid tokenized job dashboard link and confirm no `Sign in to Dashboard before adding a bank account` or `Missing required param: success_url` error occurs.

## 2026-06-01 - Dashboard URL Routing Full Ship

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: mature the portal URL model so dashboard login, refresh, project navigation, Stripe returns, and browser Back/Forward can use durable public parent URLs instead of only in-memory dashboard state.
- Files changed: `apps-script/src/Index.html`, `web/squarespace-portal-code-block.html`, `docs/ACH_SMOKE_TEST_PLAN.md`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Implementation: added a centralized client route manager, promoted hydrated dashboard sessions to `?dashboard=1&accountAccessToken=...`, pushed project routes when opening projects from the dashboard, pushed dashboard routes when returning home, preserved durable route context while clearing one-time params, and updated the repo Squarespace wrapper to use one route allowlist plus Back/Forward iframe reload.
- Behavior preservation: no `snapshotJson`, EXPORT_LOG wide-schema order, token lookup semantics, pricing authority, `Code.js`, `appsscript.json`, `.clasp.json`, Script Properties, Stripe live-mode setting, card checkout, PO, check/cash/manual, ACH storage, webhook, or Team Mode permission logic changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, extracted wrapper script syntax check, `npm run validate:runtime`, and `git diff --check` passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Add dashboard URL routing"` created version `855`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` deployed at version `855`.
- Smoke tests: direct Apps Script `/exec` and public wrapper `/portal` returned HTTP 200. Live parent Back/Forward route reload was not verified because the live Squarespace wrapper must still be manually refreshed from the repo wrapper for wrapper-layer changes to take effect.
- Follow-ups: update the live Squarespace `/portal` code block from `web/squarespace-portal-code-block.html`, then smoke login URL promotion, refresh-on-dashboard, dashboard project open, browser Back/Forward, logout URL reset, and ACH setup return routing through the public wrapper.

## 2026-06-01 - ACH Dashboard/AP Bank Scope Separation Full Ship

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: separate dashboard-saved ACH banks from order-only/AP ACH bank evidence so Dashboard Payment Methods remains account-managed while public Accounts Payable links stay order-scoped.
- Files changed: `apps-script/src/Code.js`, `apps-script/src/Index.html`, `web/squarespace-portal-code-block.html`, `docs/ACH_STRIPE_PORTAL_ARCHITECTURE.md`, `docs/ACH_SMOKE_TEST_PLAN.md`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Implementation: added ACH source/scope metadata (`source`, `visibilityScope`, safe linkage fields), appended safe order headers (`achPaymentSource`, `achPaymentVisibilityScope`, `stripeAchCustomerId`), made Dashboard setup create only `dashboard_saved` methods, limited account ACH upserts from order checkout to existing dashboard-saved methods, added default-bank selection for usable dashboard-saved banks, added AP public ACH payment links using `paymentOrigin=ap`, and added order-scoped Stripe Customer behavior with future-save/redisplay suppressed for AP checkout.
- Client behavior: Dashboard Payment Methods now filters to dashboard-saved banks, can show multiple saved banks with pending/failed/active/default states, offers Verify with Stripe for pending microdeposit setup, and exposes Set Default for usable non-default banks. Locked payment surfaces include Copy ACH Payment Link, which copies a public portal URL rather than a Stripe Checkout URL. The client also treats `summary=1&payNow=ach` as AP/order-only if the live wrapper has not yet forwarded `paymentOrigin`.
- Behavior preservation: no `snapshotJson`, EXPORT_LOG wide-schema order, token lookup semantics, pricing authority, `appsscript.json`, `.clasp.json`, Script Properties, Stripe live-mode setting, card checkout, PO, check/cash/manual, Team Mode permission logic, or raw bank-data storage changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, wrapper script syntax extraction, `npm run validate:runtime`, `git diff --check`, and targeted sensitive-data searches passed. Sensitive-data search returned only redaction/safety/docs references plus pre-existing tax form direct-pay fields and transient Stripe runtime response variables; no committed Stripe secrets, raw bank numbers, routing numbers, hosted verification URLs, or microdeposit values were found.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Separate dashboard and AP ACH bank scopes"` first created version `856`, then after the wrapper-fallback hardening created version `857`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `857`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200 and contains `Development revision 26`, `Copy ACH Payment Link`, `setDefaultAchPaymentMethod`, `PAYMENT_ORIGIN_PARAM_RAW`, `paymentOrigin`, and `visibilityScope`; stale `Development revision 25` is absent. Public wrapper `/portal` returned HTTP 200 and still targets the stable deployment ID. Public wrapper smoke with `summary=1&payNow=ach&paymentOrigin=ap` returned HTTP 200; the live wrapper did not yet include the repo `paymentOrigin` allowlist, so the deployed Apps Script fallback preserves AP/order-only behavior for the AP pay-now route until Squarespace is refreshed.
- Follow-ups: refresh the live Squarespace `/portal` code block from `web/squarespace-portal-code-block.html` so `paymentOrigin` forwarding and the latest parent route manager are live, then smoke a disposable AP ACH payment link and verify it writes order-only ACH evidence without creating a dashboard-visible bank.

## 2026-06-01 - ACH Setup Public Return URL Validation Fix Full Ship

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: fix the live Dashboard ACH bank setup error where clicking the `ACH Bank Account` card after portal login returned `Secure bank setup cannot start because the portal return URL is not configured`.
- Root cause: the server-side public portal return-URL guard relied on `new URL(...)`. In Apps Script runtime contexts where that Web API is unavailable or inconsistent, otherwise valid public portal return URLs can fail validation before Stripe setup Checkout is created.
- Files changed: `apps-script/src/Code.js`, `apps-script/src/Index.html`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Implementation: `isPublicRedThreadsPortalUrl_()` now keeps the strict `https://www.redthreads.com/portal` / `https://redthreads.com/portal` allowlist, but adds an Apps Script-safe parser fallback when `new URL(...)` throws. The dev badge was incremented to `27`.
- Behavior preservation: no `snapshotJson`, EXPORT_LOG wide-schema order, token lookup semantics, pricing authority, `appsscript.json`, `.clasp.json`, Script Properties, Stripe live-mode setting, Squarespace wrapper, card checkout, PO, check/cash/manual, ACH storage policy, webhook logic, or Team Mode permission logic changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, URL fallback simulation, `npm run validate:runtime`, and `git diff --check` passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Fix ACH setup public return URL validation"` created version `858`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `858`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200 and contains `Development revision 27`; stale `Development revision 26` is absent. Public wrapper `/portal` returned HTTP 200, targets the stable deployment ID, and includes `paymentOrigin`. No bank setup flow, tokenized fixture payment, real payment, Script Properties change, live-mode switch, or Squarespace update was performed during this ship.
- Follow-ups: reload the dashboard and retry the `ACH Bank Account` card. If Stripe opens, complete the internal test-mode bank setup flow only with Stripe test-mode bank details.

## 2026-06-01 - ACH AP Checkout Side-Effect Hardening Full Ship

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: complete the ACH Flow A/B source investigation and harden the remaining AP/locked-invoice ACH side-effect ordering before live test-mode bank-flow smoke.
- Files changed: `apps-script/src/Code.js`, `apps-script/src/Index.html`, `docs/ACH_STRIPE_PORTAL_ARCHITECTURE.md`, `docs/ACH_SMOKE_TEST_PLAN.md`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Implementation: `createLockedOrderPaymentCheckout_()` now verifies the latest order exists, is locked, and is unpaid before calling `prepareAchStripeCustomerForCheckout_()`, so missing, unlocked, or already-paid AP/locked-invoice ACH requests fail before order-scoped Stripe Customer or Checkout side effects. The dev badge was incremented to `28`.
- Source investigation result: existing ACH Flow A/B scope separation remains in place: Dashboard setup writes `dashboard_saved`; order/AP ACH checkout writes order-only evidence; AP links use `paymentOrigin=ap`; AP checkout suppresses future-save and saved-bank redisplay; dashboard UI filters hidden/order-only/AP banks; wrapper forwarding includes `paymentOrigin`; webhook idempotency, ACH evidence gating, terminal-state guards, and safe redaction remain intact.
- Behavior preservation: no `snapshotJson`, EXPORT_LOG wide-schema order, token lookup semantics, pricing authority, `appsscript.json`, `.clasp.json`, Script Properties, Stripe live-mode setting, Squarespace wrapper, card checkout, PO, check/cash/manual, Team Mode permission logic, or raw bank-data storage changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, and targeted ACH/sensitive-data scans passed. Sensitive-data search returned only redaction/safety/docs references plus pre-existing tax form direct-pay fields and transient Stripe runtime response variables; no committed Stripe secrets, raw bank numbers, routing numbers, hosted verification URLs, or microdeposit values were found.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Harden ACH bank scope before live test"` created version `859`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `859`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200 and contains `Development revision 28`; stale `Development revision 27` is absent. Public wrapper `/portal` returned HTTP 200, targets the stable deployment ID, and includes `paymentOrigin` plus `RT_PORTAL_NAVIGATE`. Browser wrapper smoke loaded the portal iframe; the only console error observed was a Squarespace/Elfsight widget limit outside the portal iframe. No bank setup flow, tokenized fixture payment, real payment, Script Properties change, live-mode switch, or Squarespace update was performed during this ship.
- Follow-ups: run the internal Stripe test-mode ACH flight test: Dashboard setup, dashboard saved-bank checkout, AP public ACH payment link, cancel/retry, success/failure, microdeposit fallback if presented, approved-account pending-production exception, and webhook replay/idempotency.

## 2026-06-01 - ACH Dashboard Setup Return And Duplicate Card Fix Full Ship

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: fix the live Dashboard ACH setup return where Stripe setup returned to a dashboard URL containing duplicate dashboard/account parameters plus a stale project token, and fix the Dashboard ACH display where one pending bank appeared as two cards.
- Live Sheet investigation: `PORTAL_ACCOUNTS` contained one persisted account row for the named login and one dashboard-saved ACH PaymentMethod with safe fields only: Stripe IDs, bank display name, last4, `microdeposit_pending`/`pending` status, setup IDs, and timestamps. No raw routing number, full account number, microdeposit value, raw Financial Connections object, or secret was present in the inspected ACH account fields. The apparent duplicate was a UI composition issue, not two different stored bank accounts.
- Root cause: Dashboard ACH setup return URL construction preserved existing public portal query params and then added setup return params; when an account dashboard bearer route existed, the setup return still allowed the stale project `t` parameter to survive. On boot, a dashboard URL with both `accountAccessToken` and `t` could favor token dashboard context. Separately, the dashboard grid rendered a generic ACH Bank Account card based on the current method and then rendered the same method again from `achPaymentMethodsJson`.
- Files changed: `apps-script/src/Code.js`, `apps-script/src/Index.html`, `docs/ACH_STRIPE_PORTAL_ARCHITECTURE.md`, `docs/ACH_SMOKE_TEST_PLAN.md`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Implementation: Dashboard setup return URLs now canonicalize to the public portal base before adding `dashboard=1` and `accountAccessToken`/`accountId`; setup return URL creation no longer appends `t` when a dashboard account URL exists; dashboard boot prefers account bearer context over a stale `t` on dashboard URLs; setup-return reconciliation omits the stale project token when account context is present; and the Dashboard ACH grid now renders dashboard-saved banks once plus a separate Add ACH Bank action.
- Behavior preservation: no `snapshotJson`, EXPORT_LOG wide-schema order, token lookup semantics, pricing authority, `appsscript.json`, `.clasp.json`, Script Properties, Stripe live-mode setting, Squarespace wrapper, card checkout, PO, check/cash/manual, Team Mode permission logic, webhook event handling, or raw bank-data storage changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, and targeted sensitive-data searches passed. Sensitive-data search returned only redaction/safety/docs references plus pre-existing tax form direct-pay fields and transient Stripe runtime response variables; no committed Stripe secrets, raw bank numbers, routing numbers, hosted verification URLs, or microdeposit values were found.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Fix ACH setup dashboard return and duplicate cards"` created version `860`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `860`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200 and contains `Development revision 29`; stale `Development revision 28` is absent. Direct Apps Script source includes `Add ACH Bank` and `ACH Bank Verification`. Public wrapper `/portal` returned HTTP 200, targets the stable deployment ID, and includes `accountAccessToken` plus `paymentOrigin`. In-app browser automation and Chrome DevTools page attachment were unavailable in this Codex session, so the live visual dashboard click should be manually rechecked by the owner. No bank setup flow, tokenized fixture payment, real payment, Script Properties change, live-mode switch, or Squarespace update was performed during this ship.
- Follow-ups: retry logged-in Dashboard Add ACH Bank through the public wrapper. Expected result: Stripe returns to a single canonical dashboard URL without stale `t`, the account dashboard remains associated with the correct organization/email, and a pending setup bank appears once as a verification-pending ACH bank plus a separate Add ACH Bank action.

## 2026-06-01 - ACH Setup Cancel Dashboard Hydration Full Ship

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: fix the live Dashboard ACH setup cancel return where backing out of Stripe briefly revealed a blank/unaffiliated dashboard before the correct account dashboard loaded.
- Root cause: setup-return boot paths made `VIEW_DASHBOARD` visible before `loadProjectsForHome()` hydrated the account summary and ACH bank state. The later async account load corrected the view, causing the observed blank-then-correct sequence.
- Files changed: `apps-script/src/Code.js`, `apps-script/src/Index.html`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Implementation: Dashboard account and token setup-return boot paths now keep the dashboard hidden behind the loader until account hydration completes, then show the setup success/cancel message after the account-bound dashboard is visible. Stored-session setup returns now reveal the dashboard only when a dashboard payload is actually returned. The checkout-cancel path also remains client-mode and strips stale team/payment action params so backing out of Stripe Checkout does not open Team Mode.
- Behavior preservation: no `snapshotJson`, EXPORT_LOG wide-schema order, token lookup semantics, pricing authority, `appsscript.json`, `.clasp.json`, Script Properties, Stripe live-mode setting, Squarespace wrapper, card checkout, PO, check/cash/manual, ACH storage policy, webhook logic, or raw bank-data storage changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, and targeted sensitive-data search passed. Sensitive-data search returned only redaction/safety/docs references plus pre-existing tax form direct-pay fields and transient Stripe runtime response variables; no committed Stripe secrets, raw bank numbers, routing numbers, hosted verification URLs, or microdeposit values were found.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Fix ACH setup cancel dashboard hydration"` created version `861`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `861`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200 and contains `Development revision 30`; stale `Development revision 29` is absent; setup cancel dashboard copy is present. Public wrapper `/portal` returned HTTP 200, targets the stable deployment ID, and includes `accountAccessToken`, `setupResult`, `paymentOrigin`, and `RT_PORTAL_NAVIGATE`. Browser automation was unavailable because the Browser backend was closed, so the owner should manually retry Dashboard Add ACH Bank cancel-return through the live wrapper.
- Follow-ups: retry logged-in Dashboard Add ACH Bank, back out from Stripe, and confirm the portal stays on the loader until the correct account dashboard appears. The page should not reveal a blank/unaffiliated dashboard during the return.

## 2026-06-02 - Dashboard Project Team Mode Inheritance Fix Full Ship

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: fix the dashboard-opened project bug where a client dashboard project could inherit stale Team Mode, hiding/disabling Place Order and opening the Team Mode password gate.
- Root cause: dashboard/auth project loads fetch a server client-mode VM, but `applyPortalPayloadInPlace()` could override that payload back to `team` if the browser still had `IS_TEAM=true` and the token matched the current token.
- Files changed: `apps-script/src/Index.html`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Implementation: added `forceClientMode` support to the payload applicator, clearing stale Team Mode auth/unlock state for the opened token and closing the Team Mode gate before rendering; dashboard/auth project opens now pass `forceClientMode`; dashboard route params strip stale `mode` and `teamReview`; explicit team URLs and team-admin responses still preserve Team Mode. The dev badge was incremented to `31`.
- Behavior preservation: no `snapshotJson`, EXPORT_LOG wide-schema order, token lookup semantics, pricing authority, `Code.js`, `appsscript.json`, `.clasp.json`, Script Properties, Stripe live-mode setting, Squarespace wrapper, card checkout, PO, check/cash/manual, ACH storage policy, webhook logic, or raw bank-data storage changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate`, targeted Team Mode preservation searches, and targeted sensitive-data search passed. Sensitive-data search returned only redaction/safety/docs references plus pre-existing tax form direct-pay fields and transient Stripe runtime response variables; no committed Stripe secrets, raw bank numbers, routing numbers, hosted verification URLs, or microdeposit values were found.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Fix dashboard project Team Mode inheritance"` created version `862`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `862`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200 and contains `Development revision 31`; stale `Development revision 30` is absent; `forceClientMode` and `clearTeamModeRuntimeStateForToken_` are present. Public wrapper `/portal` returned HTTP 200, targets the stable deployment ID, and still forwards `mode` and `teamReview` for explicit team links. Browser smoke loaded the public wrapper login surface. The live private dashboard-open flow for order/project 1900 was not automated because no private account credential or token was used.
- Follow-ups: retry opening order/project 1900 from the logged-in dashboard. Expected result: no Team Mode password modal, Place Order visibility governed by normal lifecycle/art/quantity gates, and explicit `?mode=team` links still entering Team Mode.

## 2026-06-02 - Order 1900 Fixture Smoke After Access Clarification

- Mode: QA / docs-only context update.
- Branch/commit/PR: `main`.
- Owner clarification: current portal orders/accounts are test/build fixtures and may be used for debugging and smoke testing. Data-safety rules still apply: do not commit or print bearer links, tokenized URLs, Stripe Checkout URLs, secrets, raw bank data, raw webhook payloads, or Sheet row dumps.
- Smoke tests: opened the local order/project 1900 fixture through the public wrapper as a direct project route. The project loaded with `Development revision 31`, no Team Mode password gate appeared, the lifecycle/status copy said the next action is to click Place Order, and the Place Order button was visible/enabled. This confirms the shipped `forceClientMode` protection handles the visible client-mode symptoms for the order-1900 fixture.
- Additional observation: a previously available account bearer dashboard route resolved to a blank account shell with no organization/email/projects, so that route is not a valid stand-in for the logged-in account dashboard. The correct authenticated dashboard-open click can be retested from an actual logged-in dashboard session; expected behavior remains no Team Mode password gate and Place Order governed only by normal lifecycle gates.
- Files changed: `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Deployment: none. No Apps Script push/version/deploy, Script Properties change, Stripe mode change, Squarespace update, or source runtime change was performed.

## 2026-06-02 - Account Dashboard Direct Link Hardening Full Ship

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: ensure direct account-dashboard bearer links are safe and usable, and prevent account-access URLs from resolving into blank/unaffiliated dashboard shells.
- Root cause: `resolvePortalAccountDirectAccess_()` accepted any `PORTAL_ACCOUNTS.accountAccessToken` match as a usable dashboard account, including orphan/blank account rows that had no org/email identity and no stable project binding. On the client, failed account-dashboard loads could also reveal a generic empty dashboard shell because the boot path continued with route sync/setup-return handling after `loadProjectsForHome()` failed.
- Files changed: `apps-script/src/Code.js`, `apps-script/src/Index.html`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Implementation: direct account-dashboard resolution now validates that the matched account row has identity metadata or at least one stable project binding through the existing account visibility rules before treating the bearer link as usable. Unlinked account-dashboard routes return `account_dashboard_unlinked`/clear dashboard error copy. Client dashboard boot now keeps account-load failures visible, clears stale project rows, and stops route canonicalization/setup-return handling when a direct account dashboard load fails. The dev badge was incremented to `32`.
- Behavior preservation: no `snapshotJson`, EXPORT_LOG wide-schema order, token lookup semantics, pricing authority, `appsscript.json`, `.clasp.json`, Script Properties, Stripe live-mode setting, Squarespace wrapper, card checkout, PO, check/cash/manual, ACH payment/storage policy, webhook logic, Team Mode permission logic, or raw bank-data storage changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate`, targeted direct account-link helper searches, and targeted sensitive-data searches passed. Sensitive-data search returned only redaction/safety/docs references, pre-existing local fixture references, and transient runtime variable names; no committed Stripe secrets, raw bank numbers, routing numbers, hosted verification URLs, or microdeposit values were introduced.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Harden account dashboard direct links"` created version `864`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `864`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200 and contains `Development revision 32` plus `dashboard-load-failed`; public wrapper `/portal` returned HTTP 200 and targets the stable deployment ID. Browser smoke confirmed the formerly blank account bearer route now resolves to the account-bound dashboard with organization/email/project rows, a deliberately invalid account-dashboard route shows a persistent dashboard-link error rather than silently becoming a usable blank dashboard, and the order/project 1900 fixture still opens through the public wrapper in client mode with no Team Mode password gate and Place Order visible/enabled.
- Follow-ups: continue using `accountAccessToken` as the preferred direct account-dashboard link. If an old raw `accountId` or account-access link fails with the new dashboard-link error, regenerate/open the dashboard from a current project link or authenticated login so the account row has identity/project binding before sharing it as a bearer link.

## 2026-06-02 - ACH Pre-Checkout Decision Step Full Ship

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: add a focused ACH pre-checkout decision step so the first ACH `Place Order` action no longer immediately launches Stripe Checkout; clients now choose between continuing to hosted ACH Checkout with a saved-bank preference or preparing/sending/copying an AP-only Red Threads portal payment link.
- Stripe capability finding: hosted Checkout supports saved-payment redisplay filtering for Customer payment methods, but the current Checkout API does not expose a supported parameter to force a specific saved `us_bank_account` selection. The portal therefore validates and records the preferred bank only as safe metadata/order context, and client copy states that Stripe will securely confirm which bank to use during checkout.
- Files changed: `apps-script/src/Code.js`, `apps-script/src/Index.html`, `docs/ACH_STRIPE_PORTAL_ARCHITECTURE.md`, `docs/ACH_SMOKE_TEST_PLAN.md`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Implementation: added `achDecision` order-modal mode; rendered saved-bank preference and AP link/email lanes; restricted selectable banks to usable `dashboard_saved` ACH methods; validated `preferredAchPaymentMethodId` server-side before Checkout Session creation; carried `preferredAchPaymentMethodId` and `achCheckoutIntent` into safe Stripe metadata only; added `prepareAchPaymentLinkToAp` and `sendAchPaymentLinkToAp`; and prepared AP links by locking an unpaid ACH payment-due order with `achPaymentSource=ap_payment_link` and `achPaymentVisibilityScope=order_only`.
- AP invoice/email decision: AP copy/email returns or sends a Red Threads portal AP payment URL, not a Stripe Checkout URL. Invoice attachment is best-effort through the existing final-invoice attachment helper; when unavailable, the V1 deliverable is the safe portal payment link plus project/order summary details.
- Behavior preservation: no `snapshotJson`, EXPORT_LOG wide-schema order, token lookup semantics, pricing authority, `appsscript.json`, `.clasp.json`, Script Properties, Stripe live-mode setting, Squarespace wrapper, card checkout, PO, check/cash/manual, Team Mode permission logic, ACH webhook/idempotency handling, ACH return reconciliation, or raw bank-data storage changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate`, and targeted ACH/sensitive-data searches passed. Sensitive-data search returned only redaction/safety/docs references plus pre-existing tax form direct-pay fields and transient runtime variable names; no committed Stripe secrets, raw bank numbers, routing numbers, hosted verification URLs, tokenized project URLs, Checkout URLs, or microdeposit values were introduced.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Add ACH pre-checkout decision step"` created version `865`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `865`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200, contains `Development revision 33`, and exposes `orderFlowAchDecisionSection`, `preferredAchPaymentMethodId`, `prepareAchPaymentLinkToAp`, and `sendAchPaymentLinkToAp`; public wrapper `/portal` returned HTTP 200, targets the stable deployment ID, and includes `accountAccessToken`, `setupResult`, `paymentOrigin`, and `RT_PORTAL_NAVIGATE`. No bank setup flow, tokenized fixture payment, real payment, Script Properties change, live-mode switch, Squarespace update, snapshot JSON mutation, or EXPORT_LOG schema change was performed during this ship.
- Follow-ups: continue internal Stripe test-mode smoke for the new decision step: no-bank, one-bank, multi-bank, pending-bank, AP copy, AP email, AP checkout, and standard card/PO/manual/stale-tab regression cases.

## 2026-06-02 - ACH Decision Modal Separation Full Ship

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: fix the ACH pre-checkout decision UI so it no longer renders inside the checkout-flow modal below the payment cards. The ACH next-step choice should replace the checkout-flow modal with its own full-screen modal container.
- Files changed: `apps-script/src/Index.html`, `docs/ACH_SMOKE_TEST_PLAN.md`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Implementation: moved the ACH decision markup into a sibling `orderFlowAchDecisionModal` inside the existing order-flow backdrop, added dedicated ACH modal header/close styling, and updated `setOrderFlowMode('achDecision')` to hide the checkout-flow modal while showing the ACH decision modal. Existing saved-bank preference, AP email/copy, Stripe Checkout handoff, and AP server actions were not changed. The dev badge was incremented to `34`.
- Behavior preservation: no `snapshotJson`, EXPORT_LOG wide-schema order, token lookup semantics, pricing authority, `Code.js`, `appsscript.json`, `.clasp.json`, Script Properties, Stripe live-mode setting, Squarespace wrapper, card checkout, PO, check/cash/manual, Team Mode permission logic, ACH webhook/idempotency handling, ACH return reconciliation, or raw bank-data storage changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate`, and targeted sensitive-data search passed. Sensitive-data search returned only redaction/safety/docs references plus pre-existing tax form direct-pay fields and transient runtime variable names; no committed Stripe secrets, raw bank numbers, routing numbers, hosted verification URLs, tokenized project URLs, Checkout URLs, or microdeposit values were introduced.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Separate ACH decision modal"` created version `866`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `866`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200, contains `Development revision 34`, and exposes `orderFlowAchDecisionModal`, `orderFlowAchDecisionSection`, and `preferredAchPaymentMethodId`; public wrapper `/portal` returned HTTP 200, targets the stable deployment ID, and includes `accountAccessToken`, `paymentOrigin`, and `RT_PORTAL_NAVIGATE`. No bank setup flow, tokenized fixture payment, real payment, Script Properties change, live-mode switch, Squarespace update, snapshot JSON mutation, or EXPORT_LOG schema change was performed during this ship.
- Follow-ups: manually retry the same ACH order modal path through the live wrapper. Expected result: selecting ACH and clicking Place Order replaces the checkout-flow modal with the dedicated ACH Bank Payment modal; the payment cards and Place Order button should no longer remain visible above the ACH next-step lanes.

## 2026-06-02 - ACH Decision Bank List Merge Full Ship

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: fix the live ACH decision modal mismatch where the Dashboard showed multiple connected ACH banks, but the ACH payment decision step only showed the default bank.
- Root cause: Dashboard Payment Methods renders from the hydrated `DASHBOARD_ACCOUNT_SUMMARY`, while the order/ACH decision modal rendered from the project `ACCOUNT_SUMMARY`. For dashboard-opened projects, that project summary can carry only default ACH fields or a narrower method list even though the Dashboard account summary has the full dashboard-visible ACH method collection.
- Files changed: `apps-script/src/Index.html`, `docs/ACH_SMOKE_TEST_PLAN.md`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Implementation: added a scoped ACH UI merge layer that combines the project account summary with the hydrated dashboard account summary only when stable account identifiers match; the ACH decision modal now lists all dashboard-visible ACH banks for the account, keeps verified/active dashboard-saved methods selectable, and shows non-ready dashboard banks as disabled status rows instead of hiding them. The ACH payment-selection card copy now acknowledges multiple saved banks when more than one usable bank exists. The dev badge was incremented to `35`.
- Behavior preservation: no `snapshotJson`, EXPORT_LOG wide-schema order, token lookup semantics, pricing authority, `Code.js`, `appsscript.json`, `.clasp.json`, Script Properties, Stripe live-mode setting, Squarespace wrapper, card checkout, PO, check/cash/manual, Team Mode permission logic, ACH webhook/idempotency handling, ACH return reconciliation, or raw bank-data storage changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, and targeted ACH/sensitive-data searches passed. Sensitive-data search returned only redaction/safety/docs references plus pre-existing tax form direct-pay fields and transient runtime variable names; no committed Stripe secrets, raw bank numbers, routing numbers, hosted verification URLs, tokenized project URLs, Checkout URLs, or microdeposit values were introduced.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Show all dashboard ACH banks in decision modal"` created version `867`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `867`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200, contains `Development revision 35`, omits stale `Development revision 34`, and exposes `getOrderFlowAchAccountSummaryForUi_` plus the disabled-bank decision copy. Public wrapper `/portal` returned HTTP 200, targets the stable deployment ID, and includes `paymentOrigin`. No bank setup flow, tokenized fixture payment, real payment, Script Properties change, live-mode switch, Squarespace update, snapshot JSON mutation, or EXPORT_LOG schema change was performed during this ship.
- Follow-ups: manually retry the same Dashboard-to-project ACH path. Expected result: the ACH decision modal lists all dashboard-visible ACH banks for the same account; only usable verified/active dashboard-saved banks are selectable, and non-ready banks remain visible as disabled rows with verification guidance.

## 2026-06-02 - ACH Saved-Bank Handoff Hardening Full Ship

- Mode: Debug + targeted hardening + Full ship.
- Branch/commit/PR: `main`.
- Goal: investigate why hosted Stripe ACH Checkout still rendered a generic US bank account/Financial Connections entry screen after the portal displayed a default saved bank preference, then patch only source issues needed to make the handoff technically stronger and the copy truthful.
- Investigation result: current source already builds normal non-AP ACH Checkout with a portal Stripe Customer, `payment_method_types[0]=us_bank_account`, Financial Connections `payment_method` permission, saved-method redisplay filters for `unspecified` and `always`, `setup_future_usage=off_session`, and preferred-bank metadata. The connected account row has one usable verified/default dashboard-saved bank ending in `4321`; two other dashboard-saved banks ending in `6789` remain microdeposit-pending and are correctly non-selectable. Apps Script `clasp run` could not retrieve the exact Checkout Session because that private helper is not API-executable, so exact session metadata was not printed or stored.
- Stripe capability finding: Stripe Checkout can redisplay saved verified Customer bank accounts when the Session has a Customer, `us_bank_account`, and matching `allow_redisplay` filters. Stripe PaymentMethods can also be updated with `allow_redisplay`. Hosted Checkout remains the final bank confirmation and selection surface, so the portal must not promise that a selected bank will be visibly preselected or forced.
- Implementation: added a non-blocking `updateStripePaymentMethodDashboardRedisplay_` / `maybeHardenPreferredAchPaymentMethodForCheckout_` path that, after order validation and before normal non-AP ACH Checkout creation, updates a validated dashboard-saved preferred Stripe PaymentMethod with `allow_redisplay=always` plus safe billing name/email. Normal owner ACH Checkout now sets `payment_method_data[allow_redisplay]=always` when future-save is enabled. AP/order-only Checkout remains excluded from this future-save/redisplay behavior.
- Client copy: revised ACH saved-bank decision and locked-invoice copy to describe the bank as a preference and state that Stripe may ask the user to confirm or choose a bank before payment is initiated.
- Behavior preservation: no `snapshotJson`, EXPORT_LOG wide-schema order, token lookup semantics, pricing authority, `appsscript.json`, `.clasp.json`, Script Properties, Stripe live-mode setting, Squarespace wrapper, card checkout, PO, check/cash/manual, Team Mode permission logic, ACH webhook/idempotency handling, ACH return reconciliation, AP order-only scope, or raw bank-data storage changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate`, and targeted ACH/sensitive-data searches passed. Sensitive-data search returned only redaction/safety/docs references plus pre-existing tax form direct-pay fields and transient runtime variable names; no committed Stripe secrets, raw bank numbers, routing numbers, hosted verification URLs, tokenized project URLs, Checkout URLs, or microdeposit values were introduced.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Harden ACH saved-bank handoff"` created version `868`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `868`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200, contains `Development revision 36`, omits stale `Development revision 35`, and includes the new saved-bank preference copy; public wrapper `/portal` returned HTTP 200, targets the stable deployment ID, and includes `paymentOrigin` plus `RT_PORTAL_NAVIGATE`. No bank setup flow, tokenized fixture payment, real payment, Script Properties change, live-mode switch, Squarespace update, snapshot JSON mutation, or EXPORT_LOG schema change was performed during this ship.
- Follow-ups: continue ACH test-mode checkout smoke. If Stripe still renders generic bank entry despite the hardening, treat that as hosted Checkout eligibility/UI behavior and rely on the truthful portal copy unless Stripe Dashboard/API evidence shows the selected PaymentMethod is not verified, not attached to the same Customer, or has an unexpected `allow_redisplay` value.

## 2026-06-02 - ACH Checkout Return Client Routing Fix Full Ship

- Mode: Debug + Full ship.
- Branch/commit/PR: `main`.
- Goal: fix the live ACH payment return where Stripe sent the user back to the portal and the app opened the Team Mode password gate instead of landing on the invoice Summary view.
- Root cause: checkout cancel returns had a client-mode guard, but checkout success returns did not. After `reconcile_checkout_return`, the client applied the refreshed project payload with Team Mode preservation enabled, so stale runtime or URL team state could reassert `mode=team`. Return cleanup could also preserve stale one-time/team params and resync the route to a dashboard context during a project payment return.
- Files changed: `apps-script/src/Index.html`, `docs/ACH_SMOKE_TEST_PLAN.md`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Implementation: all checkout returns now force client mode, clear stale Team Mode auth/unlock state, close the Team Mode gate, strip `mode`, `teamReview`, `payNow`, and `paymentOrigin` from checkout-return cleanup, and avoid dashboard-route resync while processing project checkout returns. Successful checkout returns apply the reconciled project payload with `forceClientMode`, push the durable project route with `summary=1`, and render the invoice Summary panel after reconciliation. The dev badge was incremented to `37`.
- Behavior preservation: no `snapshotJson`, EXPORT_LOG wide-schema order, token lookup semantics, pricing authority, `Code.js`, `appsscript.json`, `.clasp.json`, Script Properties, Stripe live-mode setting, Squarespace wrapper, card checkout, PO, check/cash/manual, ACH storage policy, webhook/idempotency handling, or raw bank-data storage changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, and `git diff --check` passed. Targeted source checks confirmed the new checkout-return client-mode guard and that Team Mode preservation remains on non-checkout/team-admin paths only.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Fix ACH checkout return client routing"` created version `869`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `869`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200, contains `Development revision 37`, omits stale `Development revision 36`, and includes the checkout-return client-mode guard. Public wrapper `/portal` returned HTTP 200, targets the stable deployment ID, and includes `checkoutResult` plus `RT_PORTAL_NAVIGATE`. No bank setup flow, tokenized fixture payment, real payment, Script Properties change, live-mode switch, Squarespace update, snapshot JSON mutation, or EXPORT_LOG schema change was performed during this ship.
- Follow-ups: retry the ACH payment return through the live wrapper. Expected result: no Team Mode password gate, checkout return params are cleaned, and the project opens to the invoice Summary view showing ACH pending/not paid until Stripe webhook success.

## 2026-06-02 - ACH Readiness UX Simplification Full Ship

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: simplify ACH UX now that hosted Stripe Checkout remains the final bank-selection surface. Dashboard should communicate ACH readiness and action-needed status; checkout should present a generic Stripe-hosted ACH payment path without bank-specific wallet copy.
- Files changed: `apps-script/src/Index.html`, `docs/ACH_STRIPE_PORTAL_ARCHITECTURE.md`, `docs/ACH_SMOKE_TEST_PLAN.md`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Implementation: replaced top-level multiple Dashboard ACH bank/default cards with one `ACH Bank Payments` readiness card, added a Manage ACH banks modal for safe bank details/actions, and simplified the ACH checkout decision step so Lane 1 no longer renders bank names, last4, default labels, selected-bank copy, or a saved-bank selector. The current client starts ACH Checkout with `achCheckoutIntent=unspecified`; server-side `preferredAchPaymentMethodId` compatibility remains for future/internal callers. The dev badge was incremented to `38`.
- Behavior preservation: backend saved-bank redisplay hardening, Stripe Customer persistence, hosted setup, AP order-only scope, AP email/copy lane, webhook/idempotency handling, return reconciliation, card checkout, PO, check/cash/manual, dashboard routing, Team Mode, public wrapper behavior, pricing authority, token lookup, and snapshot/EXPORT_LOG contracts were preserved. No `Code.js`, `appsscript.json`, `.clasp.json`, Script Properties, Stripe live-mode setting, Squarespace wrapper, raw bank-data storage, or deployment ID changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate`, and targeted ACH/sensitive-data searches passed. The old wallet-like checkout phrases were absent from active source/docs scans. Sensitive-data search returned only redaction/safety/docs references plus pre-existing tax form direct-pay fields and transient runtime variable names; no committed Stripe secrets, raw bank numbers, routing numbers, hosted verification URLs, tokenized project URLs, Checkout URLs, or microdeposit values were introduced.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Simplify ACH readiness UX"` created version `870`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `870`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200, contains `Development revision 38`, omits stale `Development revision 37`, includes `ACH Bank Payments`, `Manage ACH banks`, and the generic Stripe-hosted ACH copy, and omits the old wallet-like ACH labels. Public wrapper `/portal` returned HTTP 200, targets the stable deployment ID, and includes `paymentOrigin` plus `RT_PORTAL_NAVIGATE`. No bank setup flow, tokenized fixture payment, real payment, Script Properties change, live-mode switch, Squarespace update, snapshot JSON mutation, or EXPORT_LOG schema change was performed during this ship.
- Follow-ups: continue manual Stripe test-mode smoke for Dashboard readiness states, Manage ACH banks pending/verified rows, Add ACH bank, generic ACH checkout launch, AP email/copy, AP order-only checkout, and card/PO/manual regressions.

## 2026-06-02 - ACH Dashboard Card Action Refinement Full Ship

- Mode: Full ship.
- Branch/commit/PR: `main`.
- Goal: revise the Dashboard ACH card so it no longer shows readiness paragraphs or separate Manage/Add buttons in the top dashboard card. The card itself should be the Manage ACH banks action, while Add ACH bank remains available inside the management modal.
- Files changed: `apps-script/src/Index.html`, `docs/ACH_STRIPE_PORTAL_ARCHITECTURE.md`, `docs/ACH_SMOKE_TEST_PLAN.md`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Implementation: changed the top-level Dashboard ACH card label to `ACH payment accounts`, changed its visible body to `Manage connected accounts`, removed the top-card readiness paragraph and action buttons, made the card keyboard-accessible with `role="button"`, `tabindex="0"`, Enter/Space handling, and click handling that opens the existing Manage ACH banks modal. The modal keeps its bottom-right Add ACH bank action. The dev badge was incremented to `39`.
- Behavior preservation: no `Code.js`, backend ACH setup/checkout/webhook behavior, AP order-only scope, Stripe mode, Script Properties, Squarespace wrapper, `appsscript.json`, `.clasp.json`, snapshot JSON, EXPORT_LOG schema/order, token lookup, pricing authority, card checkout, PO, check/cash/manual, Team Mode, or raw bank-data storage changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate`, and targeted ACH/sensitive-data searches passed. Active runtime source contains the new card title/body, modal title, and modal Add ACH bank action; the removed top-card readiness sentence and top-card ACH action button class are absent.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Refine ACH account card action"` created version `871`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `871`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200, contains `Development revision 39`, omits stale `Development revision 38`, includes `ACH payment accounts`, `Manage connected accounts`, `Manage ACH banks`, and modal `Add ACH bank`, and omits the removed top-card readiness sentence and top-card ACH action button class. Public wrapper `/portal` returned HTTP 200, targets the stable deployment ID, and includes `paymentOrigin` plus `RT_PORTAL_NAVIGATE`. The in-app browser was on a blank tab, so authenticated dashboard click-through was not automated in-browser during this ship. No bank setup flow, tokenized fixture payment, real payment, Script Properties change, live-mode switch, Squarespace update, snapshot JSON mutation, or EXPORT_LOG schema change was performed.
- Follow-ups: manually confirm through an authenticated dashboard session that clicking the `ACH payment accounts` card opens Manage ACH banks and that Add ACH bank remains in the modal footer.

## 2026-06-02 - ACH Microdeposit Verification Action Full Ship

- Mode: Debug + Produce final code + Full ship.
- Branch/commit/PR: `main`.
- Goal: complete the Dashboard Manage ACH banks microdeposit-pending verification flow so each pending bank can expose a visible Stripe-hosted verification action without collecting or storing microdeposit values.
- Root cause: the client pending detector used a word-boundary regex, so `microdeposit_pending` did not match because underscore is a JavaScript word character. In addition, saved ACH method summaries did not preserve row-level safe SetupIntent/Setup Session linkage, and the verification request path resolved a generic account-level candidate instead of the clicked pending bank.
- Files changed: `apps-script/src/Code.js`, `apps-script/src/Index.html`, `docs/ACH_STRIPE_PORTAL_ARCHITECTURE.md`, `docs/ACH_SMOKE_TEST_PLAN.md`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Implementation: saved ACH method summary records now retain safe `setupIntentId`, `setupSessionId`, `paymentIntentId`, and `setupStatus` metadata; setup-mode Checkout completion and SetupIntent success preserve those fields; Manage ACH banks detects `microdeposit_pending`, renders Verify with Stripe for pending rows, and sends the clicked row identifiers; the server validates the specific SetupIntent/PaymentIntent against the authorized account/order and matching PaymentMethod before returning a transient Stripe-hosted verification URL. If an older pending row cannot be matched safely, the UI/server path returns verification-unavailable guidance instead of guessing.
- Data safety: no routing numbers, full account numbers, client secrets, raw Financial Connections payloads, hosted verification URLs, Stripe Checkout URLs, tokenized URLs, raw webhooks, or microdeposit values are persisted or committed. Internal Stripe test-mode microdeposit amounts were documented only in the smoke plan.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate`, and targeted ACH/sensitive-data searches passed. Sensitive-data search returned only redaction/safety/docs references, pre-existing tax form direct-pay fields, and transient runtime variable names.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Complete ACH microdeposit verification action"` created version `873`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `873`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200, contains `Development revision 40`, omits stale `Development revision 39`, includes `Verify with Stripe`, and exposes the safe row-linkage fields. Public wrapper `/portal` returned HTTP 200, targets the stable deployment ID, and still forwards account/Stripe route context. No bank setup flow, hosted verification click, tokenized fixture payment, real payment, Script Properties change, live-mode switch, Squarespace update, snapshot JSON mutation, or EXPORT_LOG schema change was performed during this ship.
- Follow-ups: complete a manual Stripe test-mode microdeposit verification from Dashboard Manage ACH banks. Expected result: pending row opens Stripe-hosted verification when linkage matches; successful Stripe verification/webhook moves the bank to Ready. If a legacy row lacks safe linkage, add that bank again or verify through internal Stripe test tooling using the documented SetupIntent API path.

## 2026-06-02 - ACH Dashboard Copy Refinement Full Ship

- Mode: Debug + Produce final code + Full ship.
- Branch/commit/PR: `main`.
- Goal: update the Dashboard ACH card copy and remove the ready-state ACH checkout bullet.
- Files changed: `apps-script/src/Index.html`, `docs/ACH_STRIPE_PORTAL_ARCHITECTURE.md`, `docs/ACH_SMOKE_TEST_PLAN.md`, `docs/CURRENT_BUILD_STATE.md`, `OST_PROJECT_LOG.md`.
- Implementation: changed the top-level `ACH payment accounts` card body from `Manage connected accounts` to `Manage accounts`; removed the ready-state dashboard bullet `ACH bank payments are ready for Stripe checkout. Stripe may still ask the payer to confirm, choose, or connect a bank.` Action-needed and not-set-up ACH guidance bullets remain in place. The dev badge was incremented to `41`.
- Behavior preservation: no `Code.js`, backend ACH setup/checkout/webhook behavior, AP order-only scope, Stripe mode, Script Properties, Squarespace wrapper, `appsscript.json`, `.clasp.json`, snapshot JSON, EXPORT_LOG schema/order, token lookup, pricing authority, card checkout, PO, check/cash/manual, Team Mode, or raw bank-data storage changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate`, and targeted copy checks passed. Active runtime source contains `Manage accounts`, omits `Manage connected accounts`, and omits the removed ready-state ACH checkout bullet.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Refine ACH dashboard copy"` created version `874`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `874`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200, contains `Development revision 41`, omits stale `Development revision 40`, includes `Manage accounts`, omits `Manage connected accounts`, and omits the removed ready-state ACH checkout bullet. Public wrapper `/portal` returned HTTP 200, targets the stable deployment ID, and still forwards account/Stripe route context. No bank setup flow, tokenized fixture payment, real payment, Script Properties change, live-mode switch, Squarespace update, snapshot JSON mutation, or EXPORT_LOG schema change was performed.

## 2026-06-02 - ACH Verification Modal Handling Full Ship

- Mode: Debug + Produce final code + Full ship.
- Branch/commit/PR: `main`.
- Goal: fix the Dashboard Manage ACH banks verification fallback where a pending row without usable Stripe-hosted verification context told the owner to check a Stripe email, and fix the modal state where X, Done, and backdrop close did not recover cleanly after the verification error.
- Root cause: the client treated a bare saved-bank PaymentMethod ID as sufficient linkage for the Verify with Stripe action, but Stripe-hosted microdeposit verification requires safe SetupIntent/Setup Session or PaymentIntent context. The tested legacy pending rows had only PaymentMethod IDs, while the account-level setup fields pointed to a newer setup attempt, so the server correctly refused to guess a hosted verification URL. Verification errors were also routed through the dashboard message layer instead of a modal-local notice.
- Implementation: `hasAchMicrodepositVerificationLinkageForUi_` now requires setup/session/payment-intent linkage before showing Verify with Stripe; verification status/errors render inside the Manage ACH banks modal; Verify buttons are disabled during their async request; X, Done, backdrop click, and Escape clear modal notices and close the modal; and the server fallback now states that Stripe did not provide a hosted verification link and recommends re-adding the bank or internal Stripe test tooling rather than checking for a missing Stripe email. The dev badge was incremented to `42`.
- Data safety: no raw routing numbers, full account numbers, client secrets, hosted verification URLs, Checkout URLs, tokenized URLs, raw webhooks, or microdeposit values are stored or committed. The live Sheet inspection for the named test account was limited to safe account/ACH linkage columns.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate`, and targeted ACH/sensitive-data searches passed. Sensitive-data search returned only redaction/safety/docs references, pre-existing tax form direct-pay fields, documented internal test amounts, and transient runtime variable names.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Fix ACH verification modal handling"` created version `875`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `875`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200, contains `Development revision 42`, omits stale `Development revision 41`, includes `dashboardAchManageNotice`, omits the old "Check the Stripe email link" copy, and keeps `Manage accounts`. Public wrapper `/portal` returned HTTP 200, its iframe points at the stable deployment ID, and browser smoke confirmed the wrapper tab loads with a visible iframe. No bank setup flow, hosted verification click, tokenized fixture payment, real payment, Script Properties change, live-mode switch, Squarespace update, snapshot JSON mutation, or EXPORT_LOG schema change was performed.
- Follow-ups: for the two existing legacy pending bank rows without setup/session linkage, use Add ACH bank again or verify through internal Stripe test tooling if the original SetupIntent can be identified in Stripe. New pending setup rows should carry safe setup linkage and can expose Verify with Stripe when Stripe provides a hosted verification URL.

## 2026-06-02 - ACH Dashboard Card Cursor Full Ship

- Mode: Debug + Produce final code + Full ship.
- Branch/commit/PR: `main`.
- Goal: make the Dashboard `ACH payment accounts` card use the same pointer cursor affordance as the Credit Terms and Tax Exemption cards, including over the card text.
- Implementation: added explicit `cursor:pointer` to `.dashboardAchReadinessCard` and all descendants, plus `user-select:none` on the card so text hover no longer falls back to an I-beam cursor. The dev badge was incremented to `43`.
- Behavior preservation: no `Code.js`, backend ACH setup/checkout/webhook behavior, AP order-only scope, Stripe mode, Script Properties, Squarespace wrapper, `appsscript.json`, `.clasp.json`, snapshot JSON, EXPORT_LOG schema/order, token lookup, pricing authority, card checkout, PO, check/cash/manual, Team Mode, or raw bank-data storage changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, and `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate` passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Fix ACH dashboard card cursor"` created version `876`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `876`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200, contains `Development revision 43`, omits stale `Development revision 42`, and includes the new ACH readiness card pointer CSS. Public wrapper `/portal` returned HTTP 200 and still targets the stable deployment ID. No bank setup flow, hosted verification click, tokenized fixture payment, real payment, Script Properties change, live-mode switch, Squarespace update, snapshot JSON mutation, or EXPORT_LOG schema change was performed.

## 2026-06-02 - ACH Manage Modal Close Binding Full Ship

- Mode: Debug + Produce final code + Full ship.
- Branch/commit/PR: `main`.
- Goal: fix the Dashboard Manage ACH banks modal so X, Done, backdrop click, and Escape close it from all dashboard entry paths.
- Root cause: the ACH dashboard card has an inline click handler created when the card renders, so it can open the modal on dashboard-only routes. The modal close controls were still bound only in the global project `wireEvents()` bootstrap. Direct account-dashboard and tokenized dashboard routes can load the dashboard without that bootstrap, leaving X, Done, and backdrop click without listeners.
- Implementation: added `bindDashboardAchManageModalEvents_()`, an idempotent modal-specific binder for X, Done, Add ACH bank, backdrop click, and Escape. `openDashboardAchManageModal_()` now calls the binder before showing the modal, and the old `wireEvents()` modal listener block now delegates to the same binder. The dev badge was incremented to `44`.
- Behavior preservation: no `Code.js`, backend ACH setup/checkout/webhook behavior, AP order-only scope, Stripe mode, Script Properties, Squarespace wrapper, `appsscript.json`, `.clasp.json`, snapshot JSON, EXPORT_LOG schema/order, token lookup, pricing authority, card checkout, PO, check/cash/manual, Team Mode, or raw bank-data storage changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, and `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate` passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Fix ACH manage modal close binding"` created version `877`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `877`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200, contains `Development revision 44`, omits stale `Development revision 43`, and includes `bindDashboardAchManageModalEvents_`. Public wrapper `/portal` returned HTTP 200 and still targets the stable deployment ID. No bank setup flow, hosted verification click, tokenized fixture payment, real payment, Script Properties change, live-mode switch, Squarespace update, snapshot JSON mutation, or EXPORT_LOG schema change was performed.

## 2026-06-02 - ACH Manage Modal Outside Close Full Ship

- Mode: Debug + Produce final code + Full ship.
- Branch/commit/PR: `main`.
- Goal: make Manage ACH banks close when clicking outside the modal in the black side gutters as well as inside the dimmed dashboard/card area.
- Root cause: the modal backdrop was rendered inside the dashboard card DOM and outside-click handling depended on the backdrop click target. The close behavior worked in the dashboard-card area but not reliably across the full black viewport gutters.
- Implementation: added `ensureDashboardAchManageBackdropMounted_()` so the Manage ACH banks backdrop is mounted directly under `document.body` before opening. Added capture-phase `pointerdown` outside-click handling that closes the modal when the target is not inside the modal panel. The dev badge was incremented to `45`.
- Behavior preservation: no `Code.js`, backend ACH setup/checkout/webhook behavior, AP order-only scope, Stripe mode, Script Properties, Squarespace wrapper, `appsscript.json`, `.clasp.json`, snapshot JSON, EXPORT_LOG schema/order, token lookup, pricing authority, card checkout, PO, check/cash/manual, Team Mode, or raw bank-data storage changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, and `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate` passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Fix ACH manage modal outside close"` created version `878`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `878`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200, contains `Development revision 45`, omits stale `Development revision 44`, and includes `ensureDashboardAchManageBackdropMounted_` plus the outside `pointerdown` handler. Public wrapper `/portal` returned HTTP 200 and still targets the stable deployment ID. No bank setup flow, hosted verification click, tokenized fixture payment, real payment, Script Properties change, live-mode switch, Squarespace update, snapshot JSON mutation, or EXPORT_LOG schema change was performed.

## 2026-06-03 - Login Autofill Styling Full Ship

- Mode: Debug + Produce final code + Full ship.
- Branch/commit/PR: `main`.
- Goal: keep browser saved-password/autofill support for the portal login while preventing the browser autofill paint state from turning the auth fields into pale, reformatted inputs.
- Implementation: added scoped `:-webkit-autofill` CSS for login/reset auth fields that preserves the dark portal input fill, text color, caret color, and border treatment while leaving `autocomplete="email"` and `autocomplete="current-password"` intact. The dev badge was incremented to `46`.
- Behavior preservation: no `Code.js`, auth logic, stored credential behavior, backend ACH setup/checkout/webhook behavior, AP order-only scope, Stripe mode, Script Properties, Squarespace wrapper, `appsscript.json`, `.clasp.json`, snapshot JSON, EXPORT_LOG schema/order, token lookup, pricing authority, card checkout, PO, check/cash/manual, Team Mode, or raw bank-data storage changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, and `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate` passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Preserve login autofill styling"` created version `879`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `879`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200, contains `Development revision 46`, omits stale `Development revision 45`, and includes the `:-webkit-autofill` styling. Source smoke confirmed the login email and password fields still preserve browser autocomplete attributes. Public wrapper `/portal` returned HTTP 200 and still targets the stable deployment ID. No login credential capture, bank setup flow, hosted verification click, tokenized fixture payment, real payment, Script Properties change, live-mode switch, Squarespace update, snapshot JSON mutation, or EXPORT_LOG schema change was performed.

## 2026-06-03 - ACH Setup Loading Transition Full Ship

- Mode: Debug + Produce final code + Full ship.
- Branch/commit/PR: `main`.
- Goal: replace the clunky Dashboard-level `Opening secure Stripe bank setup...` message after Manage ACH banks Add ACH bank with a modal-local green loading transition while Stripe setup Checkout is prepared.
- Implementation: added a `DASHBOARD_ACH_SETUP_BUSY` modal busy state, green Manage ACH setup loading view using `GREEN_LOADING.png`, modal-local setup source handling in `startDashboardAchSetupSession_`, and Add ACH bank wiring that keeps the Manage ACH banks modal open while suppressing the dashboard-level setup message. X/Done/outside/Escape are disabled only during the loading transition and normal behavior is restored on setup errors. The dev badge was incremented to `47`.
- Behavior preservation: no `Code.js`, backend ACH setup/checkout/webhook behavior, AP order-only scope, Stripe mode, Script Properties, Squarespace wrapper, `appsscript.json`, `.clasp.json`, snapshot JSON, EXPORT_LOG schema/order, token lookup, pricing authority, card checkout, PO, check/cash/manual, Team Mode, or raw bank-data storage changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, and `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate` passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Add ACH setup loading transition"` created version `880`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `880`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200, contains `Development revision 47`, omits stale `Development revision 46`, and includes the green Manage ACH setup loading transition. Source smoke confirmed the modal Add ACH bank path no longer closes the modal before setup and suppresses the dashboard-level opening message for the modal source. Public wrapper `/portal` returned HTTP 200 and still targets the stable deployment ID. No bank setup completion, hosted verification click, tokenized fixture payment, real payment, Script Properties change, live-mode switch, Squarespace update, snapshot JSON mutation, or EXPORT_LOG schema change was performed.

## 2026-06-03 - ACH Test Microdeposit Verification Fallback Full Ship

- Mode: Debug + Produce final code + Full ship.
- Branch/commit/PR: `main`.
- Goal: complete the Manage ACH banks pending microdeposit verification path when Stripe does not provide a hosted verification URL in internal test mode.
- Root cause: the server correctly validated the clicked pending dashboard-saved ACH row and retrieved the matching SetupIntent/PaymentIntent, but the action stopped when `next_action.verify_with_microdeposits.hosted_verification_url` was absent. That left test-mode users with only unavailable guidance despite safe SetupIntent linkage.
- Implementation: `getAchMicrodepositVerificationLink` now keeps hosted URL lookup first, then, only when `STRIPE_MODE=test`, uses the same validated candidate to call Stripe's official `verify_microdeposits` endpoint server-side. SetupIntent success is normalized through the existing dashboard-saved ACH writer and returns a refreshed account summary; PaymentIntent verification routes through the existing ACH processing/succeeded lifecycle while preserving order-only/AP visibility rules. The Dashboard client now handles `verified=true` by refreshing the account state and re-rendering Manage ACH banks in place. The dev badge was incremented to `48`.
- Behavior preservation: live mode never auto-verifies microdeposits; no client-side microdeposit amount form was added; no `client_secret`, hosted verification URL, raw Financial Connections payload, full account/routing number, Stripe secret, Checkout URL, tokenized URL, raw webhook payload, or microdeposit value is stored or committed. Card checkout, ACH checkout, AP order-only scope, PO, check/cash/manual, Dashboard, Team Mode, public wrapper behavior, snapshot JSON, EXPORT_LOG schema/order, token lookup, pricing authority, `appsscript.json`, `.clasp.json`, Script Properties, and Stripe live-mode settings were preserved.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate`, and the targeted ACH/sensitive-data searches passed. The `32`/`45` test amounts appear only in server-side `Code.js` and docs; no test amounts appear in `Index.html`.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 files; `clasp version "Add ACH test microdeposit verification fallback"` created version `881`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `881`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200, contains `Development revision 48`, omits stale `Development revision 47`, and includes the test-verification success copy. Public wrapper `/portal` returned HTTP 200, targets the stable deployment ID, and includes `RT_PORTAL_NAVIGATE` plus `paymentOrigin`. `clasp deployments` confirmed the stable deployment is `@881`. Direct function-level fallback smoke could not be automated because public web-app POST redirects returned Google HTML to curl and the project is not API-executable for `clasp run`; the manual browser path remains Dashboard -> ACH payment accounts -> Manage ACH banks -> Verify with Stripe.
- Follow-ups: manually click Verify with Stripe on the pending test dashboard bank. Expected test-mode result when Stripe still omits the hosted URL: the modal shows `Bank verified in Stripe test mode.`, the bank moves to Ready, and no production/live-mode state changes occur.

## 2026-06-03 - ACH Setup Cancel Return Silence Full Ship

- Mode: Debug + Produce final code + Full ship.
- Branch/commit/PR: `main`.
- Goal: remove the visible dashboard notification shown after a user backs out of Stripe-hosted Add ACH bank setup.
- Root cause: `setupResult=cancel` still flowed through the client checkout/setup return notice helpers, producing a dashboard message bar with `Bank account setup canceled` and, in some boot paths, a generic checkout-status refresh notice. The route cleanup/dashboard hydration behavior was otherwise correct.
- Implementation: made setup cancel returns produce no dashboard notice, no generic checkout-status notice, and no bank-setup refresh lock message while preserving setup success/status refresh handling. The dev badge was incremented to `49`.
- Behavior preservation: no `Code.js`, backend ACH setup/checkout/webhook behavior, AP order-only scope, Stripe mode, Script Properties, Squarespace wrapper, `appsscript.json`, `.clasp.json`, snapshot JSON, EXPORT_LOG schema/order, token lookup, pricing authority, card checkout, PO, check/cash/manual, Team Mode, public wrapper behavior, or raw bank-data storage changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate`, and targeted setup-return/source-copy checks passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed the runtime update; `clasp version "Silence ACH setup cancel return"` created version `882`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `882`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200, contains `Development revision 49`, omits stale `Development revision 48`, and no longer contains the setup-cancel message copy. Public wrapper `/portal` returned HTTP 200, targets the stable deployment ID, and still forwards setup return parameters. No bank setup completion, hosted verification click, tokenized fixture payment, real payment, Script Properties change, live-mode switch, Squarespace update, snapshot JSON mutation, EXPORT_LOG schema change, or new deployment ID was performed.

## 2026-06-03 - Dashboard Project Row Cursor Full Ship

- Mode: Debug + Produce final code + Full ship.
- Branch/commit/PR: `main`.
- Goal: keep Dashboard project-row non-interactive text from switching to the I-beam/text-selection cursor while preserving the current thumbnail expand, progress-stage help, and Open Project pointer behavior.
- Implementation: added dashboard-scoped cursor/user-select CSS for `.authProjectsDetails`, `.authProjectsStatusHelper`, and fallback status text. The thumbnail preview button, progress bar segments, and Open Project button were intentionally left on their existing cursor behavior. The dev badge was incremented to `50`.
- Included working-tree hardening shipped in the same Apps Script deployment: existing Stripe Customers are refreshed with safe portal account email/name before Dashboard ACH setup, server-only test microdeposit fallback now chooses descriptor-code or amount verification from Stripe intent metadata, and safely matched `setup_intent.setup_failed` dashboard-saved bank rows move to failed/unavailable and lose default eligibility.
- Behavior preservation: no `appsscript.json`, `.clasp.json`, Script Properties, Stripe live mode, Squarespace wrapper, snapshot JSON, EXPORT_LOG schema/order, token lookup, pricing authority, AP/order-only ACH scoping, card checkout, PO, check/cash/manual, Team Mode, or raw bank-data storage changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, and `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate` passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 tracked Apps Script files; `clasp version "Fix dashboard project row cursor behavior"` created version `883`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `883`.
- Smoke tests: direct Apps Script `/exec` returned HTML containing `Development revision 50`, omitting stale `Development revision 49`, and containing the dashboard cursor rule. Public wrapper `/portal` returned HTTP 200, still targets the stable deployment ID, and includes `RT_PORTAL_NAVIGATE`. No bank setup flow, hosted verification click, tokenized fixture payment, real payment, Script Properties change, live-mode switch, Squarespace update, snapshot JSON mutation, EXPORT_LOG schema change, or new deployment ID was performed.

## 2026-06-03 - Tax Document Dashboard Close Full Ship

- Mode: Debug + Produce final code + Full ship.
- Branch/commit/PR: `main`.
- Goal: fix the Dashboard Michigan sales/use tax document viewer so users can close the approved document with the X, by clicking outside the document, or with Escape.
- Root cause: the tax document close/backdrop listeners were bound only inside the general project `wireEvents()` bootstrap. Direct account-dashboard routes can open the tax document viewer without that bootstrap, leaving the X inert. The existing outside-click test also only accepted `event.target === taxDocBackdrop`; in the approved-document viewer the full-screen modal/stage owns the black space around the document, so clicking outside the document did not count as a backdrop click.
- Implementation: added `bindTaxDocumentWorkspaceEvents_()`, an idempotent tax-document-specific binder called before team review, edit, and client viewer workspaces open. The binder wires X, outside-document click, and Escape close handling. For approved client view, clicks inside the document preview do not close; clicks in the surrounding black space close immediately. The dev badge was incremented to `51`.
- Behavior preservation: no `Code.js`, backend ACH setup/checkout/webhook behavior, AP order-only scope, Stripe mode, Script Properties, Squarespace wrapper, `appsscript.json`, `.clasp.json`, snapshot JSON, EXPORT_LOG schema/order, token lookup, pricing authority, card checkout, PO, check/cash/manual, Team Mode, public wrapper behavior, or raw bank-data storage changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, and `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate` passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 tracked Apps Script files; `clasp version "Fix tax document dashboard close"` created version `884`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `884`.
- Smoke tests: direct Apps Script `/exec` returned HTML containing `Development revision 51`, omitting stale `Development revision 50`, and containing `bindTaxDocumentWorkspaceEvents_` plus `isTaxDocumentOutsideCloseTarget_`. Public wrapper `/portal` returned HTTP 200, still targets the stable deployment ID, and includes `RT_PORTAL_NAVIGATE`. No document submission, bank setup flow, hosted verification click, tokenized fixture payment, real payment, Script Properties change, live-mode switch, Squarespace update, snapshot JSON mutation, EXPORT_LOG schema change, or new deployment ID was performed.

## 2026-06-03 - AP ACH Payment Link Flow Hardening Full Ship

- Mode: Debug + Produce final code + Full ship.
- Branch/commit/PR: `main`.
- Goal: keep AP ACH email on a stable Red Threads portal link, stop showing ACH processing before AP has completed Stripe Checkout, and require the current rendered Summary/Invoice PDF for AP email attachments.
- Root cause: AP link preparation correctly created a locked unpaid ACH order with `paymentState=not_started`, but lifecycle/display copy treated `orderState=awaiting_payment_confirmation` as generic ACH processing before AP opened or completed Stripe Checkout. The AP email path also allowed the server fallback invoice artifact when the client did not send the rendered Summary/Invoice PDF.
- Implementation: added AP-specific lifecycle/display flags and ACH progress copy for `ap_payment_link` orders waiting for AP payment or waiting for AP to complete Checkout; tightened generic ACH processing so AP checkout-created is not swallowed by the processing branch; updated Summary/Invoice notes for AP-awaiting and AP-checkout-started states; updated AP email copy/CTA to `Open secure ACH payment page`; and made AP email require a browser-rendered Summary/Invoice PDF payload while leaving copy-link flow attachment-free. The dev badge was incremented to `52`.
- Behavior preservation: the AP link remains `/portal?t=<token>&summary=1&payNow=ach&paymentOrigin=ap`, never a raw Stripe Checkout URL. AP Checkout still uses order-only scope, suppresses future-save/redisplay, and keeps AP bank evidence out of Dashboard Payment Methods. No `appsscript.json`, `.clasp.json`, Script Properties, Stripe live mode, Squarespace wrapper, snapshot JSON, EXPORT_LOG schema/order, token lookup, pricing authority, card checkout, PO, check/cash/manual, Team Mode, raw bank-data storage, hosted verification URL storage, or client-secret storage changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate`, the AP link/email/lifecycle targeted scan, and the sensitive-data scan passed. Sensitive scan output remained limited to existing safety/documentation references, the pre-existing tax-form direct-pay manifest fields, transient Stripe URL allowlist code, and existing redaction/runtime extraction references.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 tracked Apps Script files; `clasp version "Harden AP ACH payment link flow"` created version `885`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `885`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200, contains `Development revision 52`, omits stale `Development revision 51`, includes the rendered AP invoice payload marker, and includes AP awaiting-payment Summary/Invoice copy. Public wrapper `/portal` returned HTTP 200, still targets the stable deployment ID, and includes `paymentOrigin` plus `RT_PORTAL_NAVIGATE`. `clasp deployments` confirmed the stable deployment is `@885 - Harden AP ACH payment link flow`. No AP email was sent, no AP link payment was opened, no bank setup flow, hosted verification click, tokenized fixture payment, real payment, Script Properties change, live-mode switch, Squarespace update, snapshot JSON mutation, EXPORT_LOG schema change, or new deployment ID was performed.
- Follow-ups: manually smoke one disposable AP ACH email in the browser to verify the rendered Summary/Invoice attachment, email CTA/copy, Dashboard `Waiting for Accounts Payable` copy before AP opens the link, AP order-only Checkout launch from the portal link, and Dashboard movement to ACH processing only after Checkout completion.

## 2026-06-03 - Credit Terms Document Viewer Full Ship

- Mode: Debug + Produce final code + Full ship.
- Branch/commit/PR: `main`.
- Goal: make the approved Credit Terms viewer match the document-first Sales Tax viewer layout and fix dashboard-route close behavior for X, outside-document click, and Escape.
- Root cause: the approved Credit Terms client/dashboard viewer still used the two-column review shell with the Submission Details rail, producing excessive side gutters. Its close/backdrop behavior also depended on the general `wireEvents()` project bootstrap and a backdrop-only target check, so dashboard-only routes could leave the X/outside-click close path inert.
- Implementation: added a `termsReviewModal.is-client-view-mode` layout that hides the rail and centers the approved document at `min(100%, 980px)`; added `bindTermsDocumentWorkspaceEvents_()` plus Credit Terms-specific X, outside-document click, and Escape handlers; called the binder before editable, approved-client, and team-review Credit Terms workspaces open; and kept Team Review on `closeTermsTeamReviewAndReturn_()` with its details/action rail intact. The dev badge was incremented to `53`.
- Behavior preservation: no `Code.js`, backend ACH setup/checkout/webhook behavior, AP order-only scope, Stripe mode, Script Properties, Squarespace wrapper, `appsscript.json`, `.clasp.json`, snapshot JSON, EXPORT_LOG schema/order, token lookup, pricing authority, card checkout, PO, check/cash/manual, Team Mode, public wrapper behavior, tax document close behavior, or raw bank-data storage changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate`, and targeted Credit Terms close/layout source checks passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 tracked Apps Script files; `clasp version "Fix credit terms document viewer"` created version `886`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `886`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200, contains `Development revision 53`, omits stale `Development revision 52`, includes `bindTermsDocumentWorkspaceEvents_`, `isTermsDocumentOutsideCloseTarget_`, and the `termsReviewModal.is-client-view-mode` layout rules. Public wrapper `/portal` returned HTTP 200, still targets the stable deployment ID, and includes `RT_PORTAL_NAVIGATE`. `clasp deployments` confirmed the stable deployment is `@886 - Fix credit terms document viewer`. No document submission, bank setup flow, hosted verification click, tokenized fixture payment, real payment, Script Properties change, live-mode switch, Squarespace update, snapshot JSON mutation, EXPORT_LOG schema change, or new deployment ID was performed.
- Follow-ups: manually smoke the authenticated dashboard Credit Terms approved card in-browser: open the document, confirm the rail is hidden and the document is wider, then close via X, outside-document click, and Escape. Also confirm Team Credit Terms review still shows the rail and closes through the team-review path.

## 2026-06-03 - ACH Account Management Modal Refinement Full Ship

- Mode: Debug + Produce final code + Full ship.
- Branch/commit/PR: `main`.
- Goal: refine the Manage ACH banks modal copy, hide empty section containers, and add a client-visible Remove action that hides saved ACH accounts without deleting their stored evidence.
- Implementation: changed the modal title to `Manage Accounts for ACH Payments`, changed the modal subtext to `You will set up your bank connection securely through Stripe. Red Threads never stores banking information.`, changed the setup CTA to `Link Account to Make ACH Payments`, stopped rendering empty Ready/Needs action/Unavailable containers, stacked row actions on the right, and added a red `Remove` button for dashboard-saved ACH rows. The Remove action calls a new server path that sets `visibilityScope=hidden_from_dashboard` and clears default eligibility for that row while preserving the `achPaymentMethodsJson` record. The dev badge was incremented to `54`.
- Behavior preservation: no snapshot JSON, EXPORT_LOG schema/order, token lookup, pricing authority, Stripe live mode, Script Properties, Squarespace wrapper, `.clasp.json`, `appsscript.json`, AP/order-only ACH scope, card checkout, PO, check/cash/manual, Team Mode, or raw bank-data storage changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate`, targeted ACH modal/source checks, and the sensitive-data scan passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 tracked Apps Script files; `clasp version "Refine ACH account management modal"` created version `887`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `887`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200, contains `Development revision 54`, omits stale `Development revision 53`, includes the new ACH modal title/subtext/setup CTA and `hideAchPaymentMethodFromDashboard`, and omits the old empty-section fallback copy. Public wrapper `/portal` returned HTTP 200, targets the stable deployment ID, and includes `RT_PORTAL_NAVIGATE`. `clasp deployments` confirmed the stable deployment is `@887 - Refine ACH account management modal`. No bank setup flow, hosted verification click, tokenized fixture payment, real payment, Script Properties change, live-mode switch, Squarespace update, snapshot JSON mutation, EXPORT_LOG schema change, or new deployment ID was performed.

## 2026-06-03 - ACH Management Footer Centering Full Ship

- Mode: Debug + Produce final code + Full ship.
- Branch/commit/PR: `main`.
- Goal: center the Manage Accounts for ACH Payments modal footer actions horizontally.
- Implementation: changed `.dashboardAchManageFooter` from right-aligned to centered flex layout and enabled wrapping so `Done` and `Link Account to Make ACH Payments` remain centered at narrower modal widths. The dev badge was incremented to `55`.
- Behavior preservation: no `Code.js`, ACH setup/checkout/webhook logic, AP/order-only ACH scope, Stripe mode, Script Properties, Squarespace wrapper, `appsscript.json`, `.clasp.json`, snapshot JSON, EXPORT_LOG schema/order, token lookup, pricing authority, card checkout, PO, check/cash/manual, Team Mode, or raw bank-data storage changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, and footer/source marker checks passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 tracked Apps Script files; `clasp version "Center ACH management modal actions"` created version `888`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `888`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200, contains `Development revision 55`, omits stale `Development revision 54`, includes `justify-content:center` and `flex-wrap:wrap` in the ACH management footer rule, and still includes `Link Account to Make ACH Payments`. Public wrapper `/portal` returned HTTP 200, targets the stable deployment ID, and includes `RT_PORTAL_NAVIGATE`. `clasp deployments` confirmed the stable deployment is `@888 - Center ACH management modal actions`. No bank setup flow, hosted verification click, tokenized fixture payment, real payment, Script Properties change, live-mode switch, Squarespace update, snapshot JSON mutation, EXPORT_LOG schema change, or new deployment ID was performed.

## 2026-06-03 - Credit Terms Details Rail Restore Full Ship

- Mode: Debug + Produce final code + Full ship.
- Branch/commit/PR: `main`.
- Goal: restore the approved Credit Terms details rail while keeping the document preview/container tighter.
- Root cause: version `886` hid `.termsReviewRail` in approved client/dashboard view to create a document-only layout, which removed the Submission Details side card that shows organization, submitted date, submitted-by, current status, and approved terms.
- Implementation: restored the approved client-view two-column grid, kept `.termsReviewRail` visible with bounded viewport height, narrowed the approved document preview column from `980px` to `780px` to reduce side gutter space, and excluded the restored rail from the approved-view outside-click close target. X, Escape, and black-space outside-click close handling remain intact. The dev badge was incremented to `56`.
- Behavior preservation: no `Code.js`, ACH setup/checkout/webhook behavior, AP/order-only ACH scope, Stripe mode, Script Properties, Squarespace wrapper, `appsscript.json`, `.clasp.json`, snapshot JSON, EXPORT_LOG schema/order, token lookup, pricing authority, card checkout, PO, check/cash/manual, Team Mode, or raw bank-data storage changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate`, and targeted Credit Terms layout/source marker checks passed.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 tracked Apps Script files; `clasp version "Restore credit terms details rail"` created version `889`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `889`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200, contains `Development revision 56`, omits stale `Development revision 55`, includes the restored client-view rail CSS, the tightened `width:min(100%,780px)` document preview rule, and the rail click guard. Public wrapper `/portal` returned HTTP 200, targets the stable deployment ID, and includes `RT_PORTAL_NAVIGATE`. `clasp deployments` confirmed the stable deployment is `@889 - Restore credit terms details rail`. No authenticated dashboard visual click smoke, document submission, bank setup flow, hosted verification click, tokenized fixture payment, real payment, Script Properties change, live-mode switch, Squarespace update, snapshot JSON mutation, EXPORT_LOG schema change, or new deployment ID was performed.

## 2026-06-03 - ACH/AP In-Flight Payment UX Full Ship

- Mode: Debug + Produce final code + Full ship.
- Branch/commit/PR: `main`.
- Goal: preserve the locked order-at-click invoice document after AP/ACH returns, suppress duplicate payment controls while ACH/AP payment is in flight, keep AP payment links on a deliberate invoice/payment page, and preserve the prior ACH Launch Certification hardening.
- Root cause: locked Summary/Invoice rendering could rebuild from editable `portalState` after a `PORTAL_ORDERS` row existed, so stale or empty editable state could render 0 units / $0. The Summary payment controls also rendered normal payment method buttons whenever `showPaymentDueControls` was true, even when canonical lifecycle fields already indicated AP waiting, AP checkout started, ACH verification pending, microdeposit pending, ACH processing, paid, disputed, or blocked. AP deep links with `summary=1&payNow=ach&paymentOrigin=ap` were also eligible for automatic Stripe launch on page boot instead of presenting a deliberate AP payment surface.
- Implementation: added a sanitized locked-order draft summary from `PORTAL_ORDERS.orderDraftJson`; made invoice document rendering prefer that durable order draft in locked invoice modes; added an ACH/AP in-flight control model and status card that suppresses duplicate normal payment buttons except in failed/retry states; made AP recipient links show a focused `Continue to Stripe ACH Payment` action instead of auto-launching Stripe on boot; preserved `summary` and `payNow` request-route metadata for first-paint return classification; kept ACH return copy at `Confirming ACH payment status with Stripe...`; kept hosted Checkout browser responses free of `client_secret`; added safe purchaser CC support for AP email; and changed AP email preparation to a blocking transition with a result-surface copy action. The dev badge was incremented to `57`.
- Behavior preservation: AP ACH bank evidence remains order-only and hidden from Dashboard saved banks; browser return is not payment truth; webhook/server reconciliation remains payment authority; no `appsscript.json`, `.clasp.json`, Script Properties, Stripe live mode, Squarespace wrapper, snapshot JSON, EXPORT_LOG schema/order, token lookup, pricing authority, card checkout, PO, check/cash/manual, Team Mode, raw bank/routing/full account data, hosted verification URL storage, microdeposit value storage, raw Financial Connections storage, or raw Stripe webhook payload storage changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate`, the ACH/AP targeted scan, and the sensitive-data scan passed. Sensitive scan output remained limited to existing safety/documentation references, the pre-existing tax-form direct-pay manifest fields, transient Stripe URL allowlist code, and existing redaction/runtime extraction references.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 tracked Apps Script files; `clasp version "Harden ACH AP in-flight payment UX"` created version `890`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `890`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200, contains `Development revision 57`, omits stale `Development revision 56`, includes `lockedOrderDraft`, `getSummaryAchInFlightControlModel_`, `Confirming ACH payment status with Stripe`, and `Copy AP payment page link`, and omits `clientSecret`. Public wrapper `/portal` returned HTTP 200, targets the stable deployment ID, and includes `RT_PORTAL_NAVIGATE`, `summary`, `payNow`, `paymentOrigin`, `checkoutResult`, and `stripeSessionId`. `clasp deployments` confirmed the stable deployment is `@890 - Harden ACH AP in-flight payment UX`. No AP email was sent, no AP payment link was opened, no bank setup flow, hosted verification click, tokenized fixture payment, real payment, Script Properties change, live-mode switch, Squarespace update, snapshot JSON mutation, EXPORT_LOG schema change, or new deployment ID was performed.
- Follow-ups: manually smoke one disposable AP ACH path in-browser: send/copy AP link, verify Dashboard/Project says waiting for AP before AP opens the link, open AP invoice page and continue to Stripe deliberately, complete hosted ACH Checkout, confirm locked invoice still shows selected jobs/amount, confirm normal payment buttons stay hidden during verification/processing, and confirm AP bank evidence remains hidden from Dashboard Manage ACH accounts.

## 2026-06-03 - Stripe ACH Payer Email Entry Full Ship

- Mode: Debug + Produce final code + Full ship.
- Branch/commit/PR: `main`.
- Goal: stop Stripe-hosted ACH payment Checkout from forcing the purchaser/client email, especially in the AP submit-payment workflow, and let the payer enter contact email directly on Stripe every time.
- Stripe finding: Checkout locks the email field when a Session is created with an existing Customer that already has a valid email. If neither `customer` nor `customer_email` is supplied, Checkout asks the payer to enter email and exposes it later through `customer_details`. Therefore ACH payment sessions must be Customer-free by default when editable payer email is required.
- Root cause: the AP/order-only ACH payment path still prepared an order-scoped Stripe Customer and passed that Customer into hosted Checkout. Because that Customer could carry the purchaser/AP email, Stripe prefilled and locked the contact-email field.
- Implementation: added an explicit ACH payer-email collection policy. Normal owner and AP/order-only ACH payment sessions now set `collectPayerEmailInCheckout=true`, skip ACH Customer preparation, omit `customer` and `customer_email`, and suppress saved-payment redisplay plus `setup_future_usage` unless a future internal option explicitly opts into a Customer-attached path. Dashboard ACH setup remains unchanged and still uses the portal account Stripe Customer for saved-bank readiness. The AP recipient page no longer asks for email before Stripe; Stripe is now the contact-email collection surface. The ACH decision copy now says Stripe asks for payer contact email and securely confirms/connects the bank. The dev badge was incremented to `58`.
- Behavior preservation: Dashboard ACH setup, saved-bank readiness management, microdeposit verification, AP order-only visibility, ACH pending/not-paid lifecycle, return reconciliation, card checkout email behavior, PO, check/cash/manual, Dashboard, Team Mode, public wrapper, snapshot JSON, EXPORT_LOG schema/order, token lookup, pricing authority, Stripe test mode, and existing stable deployment ID were preserved. No raw bank data, hosted verification URLs, microdeposit values, raw Financial Connections payloads, raw webhook payloads, Stripe secrets, or Checkout `client_secret` values were introduced.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate`, targeted ACH/Customer/email scans, and the sensitive-data scan passed. Scan output for `customer_email`, `customer`, `saved_payment_method_options`, and `setup_future_usage` is limited to gated code paths and documentation; sensitive scan output remains limited to existing safety/documentation references, pre-existing tax form direct-pay manifest fields, transient Stripe URL allowlist code, and runtime extraction references.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 tracked Apps Script files; `clasp version "Allow Stripe ACH payer email entry"` created version `891`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `891`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200, contains `Development revision 58`, omits stale `Development revision 57`, and includes the new ACH payer-contact-email copy. Public wrapper `/portal` returned HTTP 200, targets the stable deployment ID, and includes `checkoutResult`, `stripeSessionId`, `paymentOrigin`, and `RT_PORTAL_NAVIGATE`. `clasp deployments` confirmed the stable deployment is `@891 - Allow Stripe ACH payer email entry`. No AP email was sent, no AP link payment was opened, no bank setup flow, hosted verification click, tokenized fixture payment, real payment, Script Properties change, live-mode switch, Squarespace update, snapshot JSON mutation, EXPORT_LOG schema change, or new deployment ID was performed.
- Follow-ups: manually re-test the AP submit-payment path through Stripe test mode and confirm Stripe Checkout asks for a contact email instead of locking a prefilled purchaser/AP email. Also re-check a normal owner ACH payment path to confirm the same editable Stripe email behavior, while Dashboard Add ACH bank still uses hosted setup for account bank readiness.

## 2026-06-03 - ACH Client Notification Emails Full Ship

- Mode: Debug + Produce final code + Full ship.
- Branch/commit/PR: `main`.
- Goal: add Red Threads client email notifications for standard Stripe ACH order-checkout lifecycle milestones: submitted/pending invoice, confirmed payment receipt, and failed/disputed action needed.
- Root cause: standard order-checkout ACH wrote pending/paid/failed state correctly, but it did not queue a Red Threads client email at those ACH lifecycle moments. Stripe event idempotency also did not by itself collapse related success events such as `payment_intent.succeeded` plus `checkout.session.async_payment_succeeded` into one receipt email.
- Implementation: extended `PORTAL_EMAIL_QUEUE_JOB_TYPES` with ACH submitted, confirmed, and failed action jobs; added ACH lifecycle queue helpers that build safe recipients, collapse duplicate jobs by order/payment intent, reuse `sendNotificationEmail_`, attach existing invoice PDFs through `buildFinalInvoiceAttachment_`, and generate a server invoice artifact when no stored invoice PDF exists. Hooked submitted emails to ACH return/session-completed/processing pending paths, receipt emails to server/webhook paid paths, and failure emails to async failed/payment failed/dispute paths. AP/order-only ACH remains excluded from these standard lifecycle emails. The dev badge was incremented to `59`.
- Behavior preservation: browser return remains not payment truth; webhook/server reconciliation remains payment authority; AP ACH keeps its existing AP email path and order-only bank scope; no `appsscript.json`, `.clasp.json`, Script Properties, Stripe live mode, Squarespace wrapper, snapshot JSON, EXPORT_LOG schema/order, token lookup, pricing authority, card checkout, PO, check/cash/manual, Team Mode, raw bank/routing/full account data, hosted verification URL storage, microdeposit value storage, raw Financial Connections storage, raw Stripe webhook payload storage, or Checkout `client_secret` values changed.
- Validation before Apps Script ship: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate`, the requested ACH email/webhook targeted scan, and the sensitive-data scan passed. Sensitive scan output remained limited to existing safety/documentation references, the pre-existing tax-form direct-pay manifest fields, transient Stripe URL allowlist code, and existing hosted-verification/runtime redaction references.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed 4 tracked Apps Script files; `clasp version "Add ACH client notification emails"` created version `892`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at version `892`.
- Smoke tests: direct Apps Script `/exec` returned HTTP 200, contains `Development revision 59`, omits stale `Development revision 58`, and omits `clientSecret` / `client_secret` markers from the rendered HTML. Public wrapper `/portal` returned HTTP 200, targets the stable deployment ID, and includes `RT_PORTAL_NAVIGATE`, `checkoutResult`, `stripeSessionId`, and `paymentOrigin`. `clasp deployments` confirmed the stable deployment is `@892 - Add ACH client notification emails`. No ACH Checkout, AP email, AP link payment, bank setup flow, hosted verification click, tokenized fixture payment, real payment, Script Properties change, live-mode switch, Squarespace update, snapshot JSON mutation, EXPORT_LOG schema change, or new deployment ID was performed.
- Follow-ups: manually smoke one disposable standard ACH order checkout: confirm one pending invoice/status email queues/sends after Checkout submission, one receipt email queues/sends after webhook-paid state, duplicate success events do not send a second receipt, and ACH failed/disputed events send one action-needed email. Confirm AP/order-only ACH still uses only the AP payment-link email path.

## 2026-06-11 - Phase 1 ACH Email Repair Local Implementation

- Mode: Debug + Produce final code; no deployment.
- Branch/commit/PR: `main`; no commit, push, Apps Script push, version, deploy, or live smoke has been run.
- Goal: implement Phase 1 of the communication hardening plan only: repair standard order-checkout ACH lifecycle email delivery and add matching team alerts to `hello@redthreads.com`.
- Root cause: the `@892` ACH implementation queued only client ACH jobs, delayed processing through the one-minute queue trigger, skipped submitted/pending jobs once the order had already reached `paid`, and marked skipped ACH jobs as `sent` because the queue processor treated any non-throwing result as successful delivery. Team alerts were absent by design because no ACH team job types existed. Receipt/action jobs had limited safe diagnostics if recipient or attachment resolution failed.
- Implementation: added separate ACH team-alert queue job types for submitted, confirmed, and failed states; switched ACH return/webhook hooks to queue client and team jobs with recipient-class idempotency; added immediate queue processing with trigger fallback for ACH jobs; preserved existing client ACH job types; kept AP/order-only ACH excluded; rendered concise team-alert copy while preserving client copy and invoice/receipt attachments; added a `skipped` queue status; and added safe `[RT-ACH-EMAIL-QUEUE]` logs for queue status, job type, recipient class, recipient domain counts, attachment presence, and non-sensitive failure reason.
- Behavior preservation: no AP lifecycle expansion, card/PO/manual/production/chat changes, shared lifecycle email shell, schema/header change, `appsscript.json`, `.clasp.json`, Script Properties, Stripe live mode, Squarespace wrapper, snapshot JSON, EXPORT_LOG schema/order, token lookup, pricing authority, raw bank-data storage, hosted verification URL storage, microdeposit value storage, raw Financial Connections storage, raw Stripe webhook payload storage, or Checkout `client_secret` handling changed.
- Validation: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate`, the requested ACH email/webhook targeted scan, and the sensitive-data scan passed. Manual ACH smoke remains required before any deployment.

## 2026-06-11 - Phase 2 ACH Lifecycle Email Shell Local Implementation

- Mode: Produce final code; no deployment.
- Branch/commit/PR: `main`; no commit, push, Apps Script push, version, deploy, or live smoke has been run.
- Goal: add a reusable lifecycle email shell and email-safe progress snapshot, applied only to the ACH lifecycle client emails and Phase 1 team alerts.
- Implementation: added lifecycle email shell helpers for reference, progress, history, CTA, footer, and context building; refactored `buildAchLifecycleEmailContent_()` to compose through the shared shell; built the five-stage snapshot from canonical dashboard/lifecycle helpers (`buildTeamWorkflowContext_`, dashboard projection/status helpers, `buildDashboardStatusBarModel_`, and `buildDashboardStatusCopyMeta_`); preserved ACH client/team subject branching, no-reply behavior, idempotency, and invoice/receipt attachment behavior.
- Behavior preservation: no AP lifecycle expansion, card/PO/manual/production/chat changes, queue header/schema changes, new public Apps Script functions, screenshot/image rendering, deployment config changes, snapshot JSON mutation, EXPORT_LOG schema/order changes, token lookup changes, pricing authority changes, raw Stripe payload storage, raw bank-data storage, hosted verification URL storage, microdeposit value storage, or Checkout `client_secret` handling changed.
- Validation: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate`, the requested lifecycle/ACH targeted scan, and the sensitive-data scan passed. Manual ACH smoke remains required before any deployment.

## 2026-06-11 - Phase 3 Non-ACH Payment Email Normalization Local Implementation

- Mode: Produce final code; no deployment.
- Branch/commit/PR: `main`; no commit, push, Apps Script push, version, deploy, or live smoke has been run.
- Goal: normalize existing non-ACH payment communications after the ACH Phase 1/2 repair by adding queued lifecycle client emails and matching `hello@redthreads.com` team alerts for card, manual/check/cash, and PO milestones.
- Implementation: added generic `payment_lifecycle_email` jobs to `PORTAL_EMAIL_QUEUE` without changing sheet headers; added payment lifecycle queue, idempotency, recipient, logging, content, invoice-resolution, and processor helpers; extended the Phase 2 lifecycle email context so non-ACH emails render the correct payment method, amount/payment-date references, history, CTA, and five-stage progress snapshot; hooked card paid, card failed/action-needed, manual pending, manual received, PO submitted, and PO payment received milestones; and replaced the direct PO-submitted confirmation send with queued lifecycle emails while preserving action-response payment links.
- Behavior preservation: no AP lifecycle expansion, chat digest batching, production-start email, queue header/schema change, public Apps Script function change, Stripe API behavior change, deployment config change, snapshot JSON mutation, EXPORT_LOG schema/order change, token lookup change, pricing authority change, raw Stripe payload storage, raw bank-data storage, hosted verification URL storage, microdeposit value storage, or Checkout `client_secret` handling changed.
- Validation: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate`, the requested payment lifecycle targeted scan, and the sensitive-data scan passed. Manual card/manual/PO payment email smoke remains required before any deployment.

## 2026-06-11 - Phase 4 AP ACH Lifecycle Communications Local Implementation

- Mode: Produce final code; no deployment.
- Branch/commit/PR: `main`; no commit, push, Apps Script push, version, deploy, or live smoke has been run.
- Goal: add queued lifecycle communications for AP/order-only ACH payment milestones while preserving the existing AP payment-link email path and `order_only` bank scope.
- Implementation: added `ap_ach_lifecycle_email` jobs to `PORTAL_EMAIL_QUEUE` without changing sheet headers; added AP ACH lifecycle milestones for checkout-started, submitted/pending, confirmed/receipt, and failed/action-needed; added AP-specific queue, idempotency, recipient, logging, invoice-resolution, content, and processor helpers; routed ACH lifecycle queue calls so standard order-checkout ACH keeps the existing standard ACH jobs while AP/order-only ACH uses the AP lifecycle queue; and queued AP checkout-started emails from the locked-order AP checkout creation path.
- Recipient and attachment policy: AP-facing lifecycle emails go to the stored AP recipient from `invoiceSentToEmail` and visibly CC the purchaser/client when distinct; separate team alerts go to `hello@redthreads.com`; pending/submitted and confirmed/receipt AP emails require invoice/receipt attachment generation; failed/action-needed AP emails attach an invoice/status PDF when available but do not block on a missing optional attachment.
- Behavior preservation: standard ACH remains excluded from AP lifecycle jobs; AP/order-only ACH remains excluded from standard ACH client/team lifecycle jobs; the existing AP payment-link email path is preserved; no chat digest batching, card/PO/manual behavior change beyond Phase 3, production-start email, queue header/schema change, public Apps Script function change, Stripe API behavior change, deployment config change, snapshot JSON mutation, EXPORT_LOG schema/order change, token lookup change, pricing authority change, account primary/billing email overwrite, raw Stripe payload storage, raw bank-data storage, hosted verification URL storage, microdeposit value storage, or Checkout `client_secret` handling changed.
- Validation: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate`, the requested AP lifecycle targeted scan, and the sensitive-data scan passed. Manual AP ACH lifecycle smoke remains required before any deployment.

## 2026-06-11 - Phase 5 Chat Digest Batching Local Implementation

- Mode: Produce final code; no deployment.
- Branch/commit/PR: `main`; no commit, push, Apps Script push, version, deploy, or live smoke has been run.
- Goal: replace immediate one-email-per-chat-message sends from `appendChatMessage()` with queued 10-minute digest emails while preserving chat-save success, no-reply policy, `hello@redthreads.com` team routing, and client/team recipient separation.
- Implementation: added `chat_message_digest_email` jobs to `PORTAL_EMAIL_QUEUE` without changing sheet headers; added payload-only delayed delivery through `portalStateJson.notBefore`; updated queue eligibility and processor rescheduling so future digest jobs are not sent early; changed `appendChatMessage()` to queue digests instead of directly calling the legacy chat email helpers; kept `sendPortalMessageNotificationEmail_()` and `sendClientPortalMessageAlertEmail_()` for compatibility; added digest queue, idempotency, recipient, logging, content, and processor helpers; and made the processor re-read `EXPORT_LOG.chatLogJson` by queued message IDs instead of storing message text in the queue payload.
- Recipient and debounce policy: client messages use `client_to_team` digest jobs sent to `hello@redthreads.com`; team replies use `team_to_client` digest jobs sent to the project client email; queued/failed open jobs for the same token and direction are updated with new message IDs and a refreshed `notBefore`; processing/sent jobs are not mutated, so later messages create a new digest job.
- Behavior preservation: no ACH/AP/card/PO/manual/payment lifecycle changes beyond Phases 1-4, no production email, queue header/schema change, public Apps Script function change, deployment config change, snapshot JSON mutation, EXPORT_LOG schema/order change, token lookup change, pricing authority change, raw Stripe payload storage, raw bank-data storage, hosted verification URL storage, microdeposit value storage, chat message text storage in queue payloads, or Checkout `client_secret` handling changed.
- Validation: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, and `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate` passed. The requested chat digest focused scan found the new `chat_message_digest_email` queue wiring and retained legacy direct helpers; the sensitive-data scan output remained limited to existing safety/documentation references, pre-existing tax-form direct-pay manifest fields, transient Stripe URL allowlist code, and existing hosted-verification/runtime redaction references. Manual chat digest smoke remains required before any deployment.

## 2026-06-11 - Communication Tranche Completion Local Implementation

- Mode: Produce final code toward Full ship; deployment and smoke pending.
- Branch/commit/PR: `main`; no commit, push, Apps Script push, version, deploy, or live smoke has been run for this completion pass yet.
- Goal: complete the remaining communication tranche gaps beyond Phase 1-5 so the portal lifecycle has queued, idempotent, no-reply lifecycle communications with `hello@redthreads.com` team routing and shared progress snapshots.
- Implementation: added generic `portal_lifecycle_email` jobs to `PORTAL_EMAIL_QUEUE` without changing sheet headers; added queued lifecycle coverage for artwork approval/change requests, project ready-to-order, Team Mode unlock/reset/reopen/hold/cancel transitions, ACH pending-production authorization, job/project completion, and tax-exempt/credit-terms submission/approval/denial/reset events; replaced automatic account-document direct lifecycle sends with queued lifecycle jobs while preserving required document attachments; changed the manual-payment confirmation resend path to reuse the idempotent `manual_pending` payment lifecycle queue; kept AP payment-link send, blank document sends, submitted tax-form copy, password reset, summary PDF, and explicit admin resend actions as direct utility/resend paths; and incremented the dev badge to `60`.
- Behavior preservation: no `PORTAL_EMAIL_QUEUE` header/schema change, snapshot JSON mutation, EXPORT_LOG schema/order change, token lookup change, pricing authority change, Stripe config/live-mode change, `.clasp.json`, `appsscript.json`, raw bank-data storage, hosted verification URL storage, microdeposit value storage, raw Financial Connections storage, raw webhook payload storage, or Checkout `client_secret` handling changed.
- Validation: pending.
- Deployment/smoke: pending Full ship.

## 2026-06-11 - Communication Tranche Full Ship And Smoke

- Mode: Full ship.
- Branch/commit/PR: `main`; commit/push pending after this log update.
- Goal: ship the completed communication tranche runtime and record post-ship smoke evidence without exposing private fixture tokens, recipients, message text, or customer data.
- Deployment: `clasp status` succeeded; `clasp push --force` reported the Apps Script runtime was already up to date; `clasp version "Complete portal communication tranche"` created version `896`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` was deployed at version `896`; `clasp deployments` confirmed the stable deployment is `@896 - Complete portal communication tranche`. No new deployment ID was created.
- Validation: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, and `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate` passed before deployment. Focused communication wiring scan found ACH, AP ACH, payment lifecycle, portal lifecycle, chat digest, queue scheduler, and queue nudge wiring. Sensitive-data scan output remained limited to documentation/safety references, pre-existing tax-form direct-pay fields, Stripe Checkout URL allowlist code, and hosted-verification/redaction logic; no raw bank account/routing values, raw webhook payloads, client secrets, hosted verification URL storage, or microdeposit-value storage were introduced.
- Post-ship route smoke: direct Apps Script `/exec`, direct private token route, tokenized dashboard route, checkout-cancel route, and public `/portal` wrapper all returned HTTP 200. Rendered/source checks showed revision `60` where expected, public wrapper still targets the stable deployment ID and includes `RT_PORTAL_NAVIGATE`, tokenized route included project/source markers and the Call-for-price guard, and rendered output omitted `client_secret` / `clientSecret` markers.
- Queue smoke: the backing `PORTAL_EMAIL_QUEUE` scan showed prior ACH submitted rows skipped safely with `ach_submitted_job_already_paid`, ACH receipt rows sent, the artwork lifecycle team alert row sent, and the delayed chat digest row sent after its refreshed `notBefore` window. The status column in the scanned queue window contained only `sent` and intentional state-based `skipped` rows; no `failed` rows were found.
- Chat digest smoke: two private fixture chat messages in the same client-to-team window updated one `chat_message_digest_email` row with multiple message IDs, refreshed `notBefore`, did not send early, and completed with `sent`, one attempt, and no failure reason. Queue payload review confirmed message IDs/timing were stored instead of message text.
- Browser/tooling note: isolated headless/browser MCP profiles reached the standard Apps Script attribution/interstitial even though revision `60` source was present, so full visual project interaction was not available through those isolated profiles. Live-route/source checks, queue rows, and prior private-fixture browser interaction were used for the shipment evidence.
- Behavior preservation: no Script Properties change, Stripe config/live-mode change, Squarespace wrapper edit, `.clasp.json`, `appsscript.json`, snapshot JSON mutation, EXPORT_LOG schema/order change, pricing authority change, token lookup change, raw bank-data storage, raw Financial Connections storage, raw webhook storage, or Checkout `client_secret` exposure changed.

## 2026-06-11 - Communication Tranche AP Patch And Additional Smoke

- Mode: Full ship follow-up.
- Branch/commit/PR: `main`; commit/push pending after this log update.
- Goal: close additional communication-tranche smoke gaps after the `@896` full shipment without exposing private fixture tokens, recipients, customer data, Checkout URLs, Drive URLs, or message text.
- Root cause found: AP ACH payment-link preparation could create and lock the AP order before an AP email-send exception escaped as a generic Apps Script server error. In that state, `invoiceSentToEmail` stayed blank, so AP-facing lifecycle follow-up correctly skipped for missing AP recipients while the team alert could still send.
- Implementation: wrapped `sendAchApPaymentLinkEmail_` inside `prepareAchApPaymentLink_` with a narrow try/catch and mapped exceptions into the existing `ach_ap_email_failed` structured response path. No queue headers, schema, token lookup, pricing authority, AP `order_only` scope, Stripe config/live mode, snapshot JSON, EXPORT_LOG schema/order, or client-secret handling changed.
- Validation: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate`, the AP lifecycle focused scan, and the sensitive-data scan passed. Sensitive scan output remained limited to documentation/safety references, pre-existing tax-form direct-pay fields, Stripe Checkout URL allowlist code, and hosted-verification/redaction logic.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed the tracked Apps Script files; `clasp version "Harden AP link email failure response"` created version `897`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` was deployed at `@897 - Harden AP link email failure response`. No new deployment ID was created.
- Additional smoke evidence: manual/check pending produced exactly one client invoice lifecycle row and one team alert row, both `sent`; PO submitted produced one client `payment_lifecycle_email` and one team `payment_lifecycle_email`, both `sent` with invoice attachment references; card paid completed Stripe Checkout and produced one client receipt lifecycle row and one team alert row, both `sent` with invoice/receipt attachment references; AP ACH payment-link retry after `@897` returned `emailOk=true`; AP ACH checkout-started produced one AP-facing `ap_ach_lifecycle_email` and one team `ap_ach_lifecycle_email`, both `sent` with invoice attachment references. Action responses checked during these smokes omitted `client_secret` / `clientSecret`.
- Remaining smoke gaps: fresh standard ACH pending/confirmed/failed, AP ACH submitted/confirmed/failed, card failed/action-needed, manual payment received, PO payment received, Team Mode/admin lifecycle transitions, and team-to-client chat digest still require fresh disposable fixtures, Stripe ACH completion/failure actions, or Team Mode authorization.

## 2026-06-11 - Communication Tranche Team Reply Digest Smoke

- Mode: Full ship follow-up smoke.
- Branch/commit/PR: `main`; docs-only evidence update pending after this log update.
- Goal: close the remaining team-to-client chat digest smoke gap without exposing private fixture tokens, recipients, message text, customer data, or portal URLs.
- Smoke evidence: two private fixture team replies in the same debounce window updated one `chat_message_digest_email` row with two message IDs, refreshed `portalStateJson.notBefore`, remained queued until due, and then completed with status `sent`, one attempt, and no failure reason after a live portal queue nudge. Queue payload evidence remained message-ID based and did not duplicate message text.
- Remaining smoke gaps: fresh standard ACH pending/confirmed/failed, AP ACH submitted/confirmed/failed, card failed/action-needed, manual payment received, PO payment received, and Team Mode/admin lifecycle transitions still require Stripe ACH completion/failure actions, failed-card hosted Checkout evidence, or legitimate Team Mode authorization.

## 2026-06-11 - Communication Tranche Card Failure Smoke

- Mode: Full ship follow-up smoke.
- Branch/commit/PR: `main`; docs-only evidence update pending after this log update.
- Goal: close the card failed/action-needed lifecycle smoke gap without exposing private fixture tokens, recipients, customer data, Checkout URLs, or Stripe object IDs.
- Smoke evidence: a disposable hosted Stripe Checkout retry was created for card payment, and the action response included a Checkout URL without exposing `client_secret` / `clientSecret`. Submitting Stripe's declined test card produced the expected declined-card state. The webhook created one client `payment_lifecycle_email` and one team `payment_lifecycle_email` for `card_failed`; both rows completed with status `sent`, one attempt, and no failure reason.
- Remaining smoke gaps: fresh standard ACH pending/confirmed/failed, AP ACH submitted/confirmed/failed, manual payment received, PO payment received, and Team Mode/admin lifecycle transitions still require Stripe ACH completion/failure actions or legitimate Team Mode authorization.

## 2026-06-11 - Communication Tranche Standard ACH Pending And Receipt Smoke

- Mode: Full ship follow-up smoke.
- Branch/commit/PR: `main`; docs-only evidence update pending after this log update.
- Goal: close the fresh standard ACH submitted/pending and confirmed/receipt lifecycle smoke gaps without exposing private fixture tokens, recipients, customer data, Checkout URLs, Stripe object IDs, or bank details.
- Smoke evidence: a disposable locked invoice ACH retry was created from the live portal with `paymentOrigin=order_checkout`, and the action response included a Checkout URL without exposing `client_secret` / `clientSecret`. Hosted Stripe Checkout was completed using Stripe's sandbox success test institution. Checkout returned to the public portal without a client-secret marker. The queue created one client `ach_payment_submitted_invoice_email`, one `ach_payment_submitted_team_alert_email`, one client `ach_payment_confirmed_receipt_email`, and one `ach_payment_confirmed_team_alert_email`; all four rows completed with status `sent`, one attempt, no failure reason, and invoice/receipt attachment references.
- Additional evidence: duplicate historical submitted rows for already-paid ACH orders remained state-based `skipped` rather than sending stale pending notices.
- Remaining smoke gaps: standard ACH failed/action-needed, AP ACH submitted/confirmed/failed, manual payment received, PO payment received, and Team Mode/admin lifecycle transitions still require Stripe ACH failure/AP completion actions or legitimate Team Mode authorization.

## 2026-06-11 - Communication Tranche ACH Failure And AP Receipt Smoke

- Mode: Full ship follow-up smoke.
- Branch/commit/PR: `main`; docs-only evidence update pending after this log update.
- Goal: close standard ACH failed/action-needed plus AP ACH submitted/pending and confirmed/receipt lifecycle smoke gaps without exposing private fixture tokens, recipients, customer data, Checkout URLs, Stripe object IDs, bank details, or message text.
- Standard ACH failure evidence: a disposable hosted ACH Checkout was completed with Stripe's sandbox debit-not-authorized test account. The checkout returned to the public portal without a `client_secret` / `clientSecret` marker. The queue created one client `ach_payment_submitted_invoice_email`, one `ach_payment_submitted_team_alert_email`, one client `ach_payment_failed_action_email`, and one `ach_payment_failed_team_alert_email`; all four rows completed with status `sent`, one attempt, no failure reason, and invoice/status attachment references.
- AP ACH submitted/confirmed evidence: a stored-recipient AP payment-link fixture was paid through hosted ACH Checkout with Stripe's sandbox success test institution. The checkout returned to the public portal without a client-secret marker. The queue created one AP-facing `ap_payment_submitted` lifecycle email and one team `ap_payment_submitted` alert, then one AP-facing `ap_payment_confirmed` lifecycle email and one team `ap_payment_confirmed` alert; all four rows completed with status `sent`, one attempt, no failure reason, and invoice/receipt attachment references.
- Remaining smoke gaps: AP ACH failed/action-needed, manual payment received, PO payment received, and Team Mode/admin lifecycle transitions still require a fresh AP disposable fixture, Stripe ACH failure completion, or legitimate Team Mode authorization.

## 2026-06-11 - Communication Tranche Remaining Smoke Attempt

- Mode: Full ship follow-up smoke.
- Branch/commit/PR: `main`; docs-only evidence update pending after this log update.
- Goal: continue closing the remaining communication-tranche smoke gaps without exposing private fixture tokens, recipients, customer data, Checkout URLs, Stripe object IDs, bank details, or message text.
- AP ACH failed/action-needed progress: a disposable AP payment-link order was prepared through the deployed portal runtime using normal `google.script.run` calls. Artwork approval succeeded, AP payment-link email returned `emailOk=true`, AP checkout creation returned `checkoutReady=true`, and the response did not contain `client_secret` / `clientSecret`. The new AP checkout-started AP-facing and team `ap_ach_lifecycle_email` rows completed `sent`, one attempt, with no failure reason.
- AP ACH failed/action-needed blocker: hosted Stripe Checkout could not be driven to the failure event in this automation profile because Stripe presented hCaptcha on both the test-institution and manual-bank-details ACH lanes. `link-cli` was not installed locally, and the Stripe MCP execute/list tools exposed in this session returned internal unknown-tool errors, so no supported alternate Stripe event path was available.
- Team Mode blocker: Chrome had no existing authorized Team Mode session. The deployed runtime requires the Team Mode password-derived auth key for manual payment received, PO payment received, and admin lifecycle transitions; no auth key was synthesized or bypassed.
- Remaining smoke gaps: AP ACH failed/action-needed still needs a human-completed Stripe challenge, supported Stripe test-event route, or another owner-approved Stripe path. Manual payment received, PO payment received, and Team Mode/admin lifecycle transitions still need legitimate Team Mode authorization.

## 2026-06-11 - Communication Tranche Team Mode Authorization Retry

- Mode: Full ship follow-up smoke.
- Branch/commit/PR: `main`; docs-only evidence update pending after this log update.
- Goal: retry the remaining PO/manual received and admin lifecycle smoke paths using owner-supplied Team Mode authorization, without logging or storing the secret.
- Team Mode result: the deployed runtime rejected the supplied password through the normal `verifyTeamModePassword({ token, password })` server path with `Incorrect password.` Chrome also had no preexisting authorized Team Mode session for the tested project route.
- Stripe connector result: the newer Stripe connector surface exposed payment-intent search/execute tools, but execute/list calls still returned internal unknown-tool errors in this session, so it did not provide a supported AP ACH failure event path.
- Remaining smoke gaps: AP ACH failed/action-needed still needs a human-completed Stripe Checkout challenge, supported Stripe test-event route, or another owner-approved Stripe path. Manual payment received, PO payment received, and Team Mode/admin lifecycle transitions require a corrected live Team Mode credential or an already-authorized Team Mode browser session.

## 2026-06-11 - Team Mode Route Preservation Full Ship

- Mode: Full ship.
- Branch/commit/PR: `main`; commit/push pending after this log update.
- Goal: fix the Team Mode route regression where public wrapper URLs with `mode=team` reached Apps Script as Team Mode but the portal route replacement dropped the Team Mode query and reopened the project as a client route.
- Preflight: ran `clasp pull` first; it pulled the four expected Apps Script files and produced no Git-tracked drift. `git status --short` was clean before the scoped edit.
- Implementation: added server-rendered request-route metadata for `mode` and `teamReview`, added a client `getExplicitTeamRouteParams_()` helper that uses live URL params with boot-metadata/VM fallbacks for Apps Script's sandbox frame, preserved explicit Team Mode params in `startPortalApp()` route replacement, kept checkout/setup returns force-client, and incremented the visible dev badge to `61`. No Script Property name, Team Mode auth comparison, wrapper forwarding, appsscript.json, .clasp.json, schema, pricing, token lookup, or checkout/dashboard behavior changed.
- Validation: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, and `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate` passed before deployment.
- Deployment: version `898` was created and deployed first, then browser smoke showed Apps Script's sandboxed inner frame still needed server-rendered route metadata. The corrected source was pushed, `clasp version "Fix Team Mode route preservation"` created version `899`, and stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` was deployed at `@899 - Fix Team Mode route preservation`. No new deployment ID was created.
- Smoke: direct Apps Script Team and ordinary project routes returned HTTP 200 with `Development revision 61` and Team Mode helper markers; the public wrapper returned HTTP 200 and still forwards `mode` / `teamReview`. Headless Chrome public-wrapper smoke confirmed `mode=team` persists on the parent URL, iframe URL, and nested Apps Script user frame; the Team Mode gate appears; the configured Script Property password unlocks the gate; Team admin controls become visible; Save and Place Order remain hidden; ordinary project links remain client-mode; and `teamReview=tax_exempt` routes preserve the review query through the nested frame.

## 2026-06-11 - Communication Tranche Team Mode-Dependent Smoke Completion

- Mode: Full ship follow-up smoke.
- Branch/commit/PR: `main`; docs-only evidence update pending after this log update.
- Goal: close the remaining Team Mode-dependent communication smoke gaps after version `899`, without exposing private fixture tokens, recipients, customer data, Drive URLs, message text, or Team Mode secrets.
- PO payment received smoke: the prepared PO fixture accepted Team Mode authorization through the deployed admin action, recorded PO payment successfully, and produced one client `payment_lifecycle_email` plus one `hello@redthreads.com` team alert for `po_payment_received`; both rows completed `sent`, one attempt, no failure reason, and receipt attachment references.
- Manual/check payment received smoke: a disposable check-payment order was created through normal portal runtime calls, then marked received through the deployed Team Mode admin action. The queue produced one client `manual_received` lifecycle email plus one team alert; both completed `sent`, one attempt, no failure reason, and receipt attachment references.
- Admin lifecycle smoke: Team Hold, Project Unlock, Checkout Reset, PO Reopen, and Project Complete were exercised through deployed Team Mode admin actions on disposable fixtures. Each milestone produced one client `portal_lifecycle_email` and one team `portal_lifecycle_email`; all observed rows completed `sent`, one attempt, and no failure reason.
- Validation/deployment check: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, and `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate` passed. `clasp deployments` confirmed the stable deployment remains `@899 - Fix Team Mode route preservation`; no runtime files changed and no new Apps Script deployment was created for this docs-only evidence update. Direct Apps Script `/exec`, direct token, direct Team Mode, and public wrapper routes returned HTTP 200 and did not render `client_secret` / `clientSecret` markers; direct Apps Script routes showed revision `61`.
- Queue hygiene: a bounded scan for `failed` in `PORTAL_EMAIL_QUEUE` found only sent failure-milestone rows from expected failed-payment smokes and no `status=failed` rows in the scanned window.
- AP ACH failed/action-needed remains intentionally deferred per owner direction. The previous blocker still stands: hosted Stripe Checkout presents hCaptcha for the failure path in automation, and no supported alternate Stripe test-event route was available in this session.

## 2026-06-12 - Portal No-Reply Transport Rewire Full Ship

- Mode: Full ship.
- Goal: stop portal-generated email replies from routing to the removed `noreply@redthreads.com` Workspace alias and restore true no-reply behavior for all app email sends.
- Implementation: simplified `sendNotificationEmail_()` so it always sends through `MailApp.sendEmail(message)` with `noReply: true`, preserves existing recipients, CC, subject, body, HTML body, attachments, and sender display name, and returns `transport: mailapp_noreply`. The previous `GmailApp.getAliases()` / `GmailApp.sendEmail()` alias branch was removed. Existing email trigger call sites were left intact; their `fromAlias` / `replyTo` metadata is now ignored by the central transport helper.
- Documentation: updated current-build and smoke-plan notes to record that portal email now uses Apps Script no-reply transport rather than the removed Workspace alias, and that reply smoke should confirm replies bounce, fail, or otherwise do not arrive in the owner Workspace inbox.
- Validation: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, and `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate` passed before this log entry. Focused scan confirmed there are no active `GmailApp.sendEmail` / `GmailApp.getAliases` transport calls and the only live transport is `MailApp.sendEmail(message)`.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed the four tracked Apps Script files; `clasp version "Use Apps Script no-reply email transport"` created version `900`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` was deployed at `@900 - Use Apps Script no-reply email transport`. No new deployment ID was created.
- Smoke: direct Apps Script `/exec` and public wrapper `/portal` returned HTTP 200, and targeted checks did not show `client_secret` / `clientSecret` markers. Three deployed `sendSummaryEstimatePdfEmail` smoke emails were sent to the owner-approved test client address through the sandboxed `google.script.run` path; each server response returned `ok=true`, `noReply=true`, `transport=mailapp_noreply`, and no CC recipients. Owner reply-bounce/non-delivery confirmation remains pending from the delivered test messages.

## 2026-06-12 - Phase 1 Communication Suppression Policy

- Mode: Produce final code, no deploy.
- Goal: turn off owner-disabled informational lifecycle emails without deleting code, changing queue/schema headers, or disturbing payment/legal/action-required email paths.
- Implementation: added a centralized communication policy in `Code.js` with `communication_policy_disabled` as the safe skip reason; gated `portal_lifecycle_email` and `ap_ach_lifecycle_email` queue creation and queue processing; suppressed future sends for artwork approved/change requested, project ready to order, Team Hold, Project Unlock, Checkout Reset, client flow canceled/reset, standalone production authorized, jobs completed, project completed, and AP checkout-started. Existing queued disabled rows now return `skipped` through the existing queue dispatcher. `po_reopened` remains active because it was not in the owner-disabled Phase 1 list.
- Preservation: standard ACH, AP payment-link send, AP ACH submitted/confirmed/failed, card/PO/manual payment lifecycle, tax/credit document lifecycle, chat digest, password reset, summary PDF, blank document, and explicit admin resend paths remain outside the suppression policy. True `MailApp` no-reply transport is unchanged.
- Documentation: updated current-build and ACH smoke guidance to mark this as a local undeployed suppression change and to test disabled events for no future queue/send behavior.
- Validation: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, and `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate` passed. Focused scans confirmed the suppression policy is limited to the owner-disabled portal lifecycle milestones and AP checkout-started, while payment lifecycle, ACH, active AP ACH, chat digest, and tax/credit paths remain wired.
- Deployment: not deployed, not versioned, not committed, and no sheet data was mutated.

## 2026-06-12 - Phase 2 Communication Collision Guard

- Mode: Produce final code, no deploy.
- Goal: prevent overlapping lifecycle/payment emails from firing for the same business milestone while preserving Phase 1 suppression and active payment/legal/action-required communication.
- Implementation: added `communication_milestone_superseded` as the safe skip reason and centralized communication milestone policy helpers in `Code.js`; applied queue-time and processor-time guards to standard ACH lifecycle jobs, AP ACH lifecycle jobs, and non-ACH `payment_lifecycle_email` jobs without changing queue headers or existing idempotency key shapes. The guard suppresses stale AP-vs-standard ACH lane collisions, stale payment lifecycle rows when the current order is ACH, stale pending rows after terminal payment state, and competing PO/manual/card payment rows after the current order state changes. `charge.dispute.created` now validates the current order pointer before queueing ACH action-needed notices.
- Preservation: Phase 1 disabled lifecycle events remain suppressed with `communication_policy_disabled`; AP payment-link send, standard ACH submitted/confirmed/failed, AP ACH submitted/confirmed/failed, card/PO/manual payment lifecycle, tax/credit document lifecycle, chat digest, password reset, summary PDF, blank document, and explicit admin resend paths remain active. True `MailApp` no-reply transport is unchanged.
- Documentation: updated current-build and ACH smoke guidance to record this as a local undeployed collision guard and to test one-email-per-business-milestone behavior plus safe `communication_milestone_superseded` skips for stale competing rows.
- Validation: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, and `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate` passed. Focused scans confirmed the new collision helper and skip reason are limited to the expected ACH/AP/payment queue paths; sensitive-data scan output remained limited to existing safety/docs references, pre-existing tax-form direct-pay field names, Stripe Checkout allowlist code, and hosted-verification/redaction handling.
- Deployment: not deployed, not versioned, not committed, and no sheet data was mutated.

## 2026-06-15 - Phase 3 Communication CTA Hardening

- Mode: Produce final code, no deploy.
- Goal: harden active portal email CTA/dynamic links so clients, AP recipients, and team members land on the correct public Red Threads portal route without exposing Apps Script sandbox URLs or duplicate-payment AP routes.
- Implementation: added public email URL helpers in `Code.js`, changed Team Mode and account-document review email helpers to use `https://www.redthreads.com/portal` wrapper routes, defaulted team lifecycle alert CTAs to `mode=team`, made AP ACH lifecycle CTAs milestone-aware so pending/receipt use AP status routes without `payNow=ach` and failed/action-needed keeps the AP retry route, changed password-reset and retained invoice utility links away from direct Apps Script URLs, and added a project/status CTA to submitted tax-form copy emails when a safe token is available.
- Preservation: no queue headers, job types, idempotency keys, lifecycle triggers, suppression/collision policies, Stripe config, token lookup, `snapshotJson`, `EXPORT_LOG`, or true `MailApp` no-reply transport changed. Blank document source emails still avoid token links for arbitrary third-party recipients.
- Documentation: updated current-build and ACH smoke guidance to record the local undeployed CTA policy and smoke expectations.
- Validation: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, and `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate` passed. Focused CTA/security scans showed expected public wrapper, wrapper embed, route-param, and docs references; no active email content exposes raw Stripe Checkout URLs, hosted verification URLs, `client_secret`, or direct Apps Script email CTAs.
- Deployment: not deployed, not versioned, not committed, and no sheet data was mutated.

## 2026-06-15 - Phase 4 Communication Attachment Hardening

- Mode: Produce final code, no deploy.
- Goal: harden active portal email attachments so required invoice, receipt, AP invoice, PO invoice, and tax/credit document emails fail clearly when the required file is unavailable, while action-needed payment emails can still send without optional attachments.
- Implementation: added centralized lifecycle attachment policy helpers in `Code.js`; routed standard ACH, AP ACH, and non-ACH payment queue processors through the policy; kept pending/receipt invoice attachments required and made failed/action-needed attachment handling optional where approved; added safe `attachmentRequired` / `attachmentPresent` queue diagnostics; blocked AP payment-link, locked-order/admin resend, PO invoice, blank account-document source, and retained tax/credit approval sends before transport when required files cannot be loaded.
- Preservation: Phase 1 owner-disabled lifecycle suppression, Phase 2 collision guard, Phase 3 public CTA routing, queue headers, job types, idempotency keys, `snapshotJson`, `EXPORT_LOG`, token lookup, pricing authority, Stripe config, Apps Script config, and true `MailApp` no-reply transport remain unchanged.
- Documentation: updated current-build and ACH smoke guidance to record the local undeployed attachment policy and smoke expectations.
- Validation: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, and `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate` passed. Focused attachment scans confirmed the new policy helpers, required/optional attachment diagnostics, and updated queue/direct-send attachment paths. Sensitive-data scan output remained limited to existing documentation/safety references, pre-existing tax-form direct-pay field names, Stripe Checkout allowlist code, and hosted-verification/redaction handling.
- Deployment: not deployed, not versioned, not committed, and no sheet data was mutated.

## 2026-06-15 - Phase 5 Communication Content Hardening

- Mode: Produce final code, no deploy.
- Goal: clean up active portal email copy, structure, tone, attachment notes, and footer language while preserving Phase 1 suppression, Phase 2 collision guard, Phase 3 CTA routing, Phase 4 attachment policy, queue schemas, lifecycle triggers, and true `MailApp` no-reply transport.
- Implementation: added shared lifecycle copy models for standard ACH, AP ACH, and non-ACH payment lifecycle emails; added a shared attachment-note block to the lifecycle shell; standardized active lifecycle subjects, opening/status copy, next-step text, CTA-adjacent attachment notes, and footer language; normalized AP payment-link, password reset, invoice utility, account-document, chat digest, retained message helper, and tax/credit decision copy. Email content no longer includes Team Mode passwords, emoji/icon-heavy wording, long tax-guidance blocks, celebratory approval language, legacy "do not reply" footer language, or raw Stripe/dashboard references in active email builders.
- Preservation: no queue headers, job types, idempotency keys, lifecycle triggers, attachment policy, CTA helpers, `snapshotJson`, `EXPORT_LOG`, token lookup, pricing authority, Stripe config, Apps Script config, deployment ID, or no-reply transport changed.
- Documentation: updated current-build and ACH smoke guidance to record the local undeployed content policy and representative content-review smoke checks.
- Validation: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `npm run validate:runtime`, `git diff --check`, and `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate` passed. The tight legacy-copy scan found no active matches for old no-reply wording, Team Mode password labels, emoji/icon-heavy approval copy, `Good news`, `Congratulations`, `recorded received`, `Stripe dashboard`, or `raw Stripe`. The broader internal-term scan still finds expected Stripe/webhook implementation identifiers in non-email runtime code.
- Deployment: not deployed, not versioned, not committed, and no sheet data was mutated.

## 2026-06-15 - Phase 6 Communication Queue Hygiene Report

- Mode: Produce final code, no deploy.
- Goal: complete the queue-hygiene phase as a report-only/no-write pass so old communication smoke data can be interpreted without deleting rows, mutating payment truth, or risking stale email sends.
- Live read-only queue check: bounded `PORTAL_EMAIL_QUEUE` column reads found 66 populated rows: 64 `sent`, 2 intentional `skipped`, 0 `queued`, 0 `processing`, and 0 `failed`. All populated rows had `attemptCount=1`; the only nonblank skipped reason was `ach_submitted_job_already_paid`; created timestamps spanned 2026-06-03 through 2026-06-12. No Sheet rows were changed.
- Implementation: added `tools/report-portal-email-queue-hygiene.mjs`, a local CSV/TSV/stdin analyzer that reports aggregate job-type, status, age-bucket, recipient-class, last-error-category, classification, policy-disabled, stale queued, stuck processing, failed/max-attempt, unknown-status, and duplicate-ish group counts. The tool hashes sensitive grouping inputs and omits raw tokens, recipient emails, idempotency keys, payload JSON, message text, Drive URLs, and payment identifiers.
- Preservation: no Apps Script runtime behavior, queue schema, `EXPORT_LOG`, `snapshotJson`, pricing, token lookup, Stripe config, deployment ID, no-reply transport, or live Sheet data changed. Current queue rows remain audit history.
- Deployment: not deployed, not versioned, not committed, and no sheet data was mutated.

## 2026-06-15 - Communication Governance Tranche Pre-Smoke Full Ship

- Mode: Full ship.
- Goal: deploy the local six-phase communication governance tranche to the existing stable Apps Script deployment and prepare for owner-staged fixture smoke.
- Scope: shipped `Code.js` communication suppression, collision guard, CTA hardening, attachment policy, content cleanup, no-reply-preserving email transport usage, and the local redacted queue hygiene report tool. No `snapshotJson`, `EXPORT_LOG`, Sheet schema, pricing authority, token lookup, Apps Script config, Stripe config, or live Sheet data was changed.
- Validation: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `node --check tools/report-portal-email-queue-hygiene.mjs`, `npm run validate:runtime`, `git diff --check`, and `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate` passed before deployment. Focused scans found no active `GmailApp.sendEmail` / alias transport and no active Team Mode password or reply-invitation copy in the runtime/tool email surfaces.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed the four tracked Apps Script runtime files; `clasp version "Communication governance tranche pre-smoke"` created version `901`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` was deployed at `@901 - Communication governance tranche pre-smoke`. No new deployment ID was created.
- Pre-smoke evidence: direct Apps Script `/exec` and public wrapper `/portal` returned HTTP 200 after deployment. Targeted rendered-response checks found no `client_secret`, `clientSecret`, or `hosted_verification_url` markers.
- Fixture status: comprehensive lifecycle smoke remains pending until the owner-staged fixtures are ready. The planned smoke matrix remains ACH pending/paid/failed, AP link/pending/paid/failed where available, card paid/failed, PO submitted/paid, manual/check/cash pending/paid, tax/credit submitted/approved/denied/reset, chat digest both directions, and suppressed lifecycle events.

## 2026-06-15 - Communication Tranche Smoke Deployment

- Mode: Full ship.
- Goal: redeploy the already-shipped local communication governance code to the existing stable Apps Script deployment as a clean smoke-test marker while owner-staged fixtures are prepared.
- Scope: no runtime source changes were made before deployment. The existing six-phase communication governance code remains the shipped runtime: suppression policy, collision guard, CTA hardening, attachment policy, content cleanup, chat digest batching, no-reply transport, and redacted queue hygiene tooling. No `snapshotJson`, `EXPORT_LOG`, Sheet schema, pricing authority, token lookup, Apps Script config, Stripe config, or live Sheet data was changed.
- Validation: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `node --check tools/report-portal-email-queue-hygiene.mjs`, `npm run validate:runtime`, `git diff --check`, and `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate` passed before deployment. Targeted communication/security scans showed expected queue policy/runtime references and only safety/documentation/runtime-allowlist hits for sensitive terms.
- Deployment: `clasp status` succeeded; `clasp push --force` reported the Apps Script runtime was already up to date; `clasp version "Communication tranche smoke deployment"` created version `902`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` was deployed at `@902 - Communication tranche smoke deployment`. No new deployment ID was created.
- Pre-smoke evidence: direct Apps Script `/exec` and public wrapper `/portal` returned HTTP 200 after deployment. Targeted rendered-response checks found no `client_secret`, `clientSecret`, or `hosted_verification_url` markers, and the public wrapper still points to the stable deployment ID. A read-only `PORTAL_EMAIL_QUEUE` sample of job type/status/attempt/error columns showed all populated sampled rows as `sent`, attempt count `1`, with no visible failure reason.
- Fixture status: comprehensive lifecycle smoke is ready to begin once the owner-staged fixture tabs are finalized. The smoke matrix remains ACH pending/paid/failed, AP link/pending/paid/failed where available, card paid/failed, PO submitted/paid, manual/check/cash pending/paid, tax/credit submitted/approved/denied/reset, chat digest both directions, and suppressed lifecycle events.

## 2026-06-15 - Communication Tranche Fixture Smoke Deployment

- Mode: Full ship.
- Goal: create a fresh fixture-smoke deployment marker for the local six-phase communication governance code while owner-staged fixtures are finalized.
- Scope: no runtime source changes were made before deployment. The shipped runtime remains the communication governance tranche: owner-disabled lifecycle suppression, payment milestone collision guard, public CTA hardening, attachment policy, content cleanup, chat digest batching, true no-reply transport, and redacted queue hygiene tooling. No `snapshotJson`, `EXPORT_LOG`, Sheet schema, pricing authority, token lookup, Apps Script config, Stripe config, or live Sheet data was changed.
- Validation: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `node --check tools/report-portal-email-queue-hygiene.mjs`, `npm run validate:runtime`, `git diff --check`, and `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate` passed before deployment. Targeted communication/security scans showed expected queue policy/runtime references and only documentation, implementation, allowlist, or safety-handling hits for sensitive terms.
- Deployment: `clasp status` succeeded; `clasp push --force` reported the Apps Script runtime was already up to date; `clasp version "Communication tranche fixture smoke deployment"` created version `903`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` was deployed at `@903 - Communication tranche fixture smoke deployment`. No new deployment ID was created.
- Pre-smoke evidence: direct Apps Script `/exec` and public wrapper `/portal` returned HTTP 200 after deployment. Targeted rendered-response checks found no `client_secret`, `clientSecret`, or `hosted_verification_url` markers, and the public wrapper still points to the stable deployment ID. A read-only `PORTAL_EMAIL_QUEUE` sample of job type/status/attempt/error columns showed 47 populated rows, all `sent`, attempt count `1`, with no visible failure reason.
- Fixture status: comprehensive lifecycle smoke is ready to begin once the owner-staged fixture tabs are finalized. The smoke matrix remains ACH pending/paid/failed, AP link/pending/paid/failed where available, card paid/failed, PO submitted/paid, manual/check/cash pending/paid, tax/credit submitted/approved/denied/reset, chat digest both directions, and suppressed lifecycle events.

## 2026-06-15 - Fixture Smoke Current-Order Hotfix

- Mode: Full ship during fixture smoke loop.
- Goal: fix and retest a current-order resolution defect found while exercising the manual/check payment lifecycle on staged disposable projects.
- Finding: manual/check pending placement produced the expected client/team `payment_lifecycle_email` rows, but the immediate Team Mode mark-received action selected an older order revision for the same token instead of the newly placed manual-pending order. That stale-order selection prevented the intended manual-received receipt email pair from queueing for the actual pending order.
- Implementation: added `getCurrentPortalOrderForRow_()` so order/admin/dashboard paths with an export row prefer `EXPORT_LOG.activeOrderId` before falling back to latest-by-token lookup. Updated active-order call sites for account status, checkout-return fallback, client workflow validation, Team Mode admin context, invoice generation, dashboard projection, PO invoice/send/submit, and locked-order checkout creation. Generic latest-order fallback sorting now compares `lastUpdatedAt`/`createdAt` before revision number, preventing older revisions from outranking newly created orders.
- Validation: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `node --check tools/report-portal-email-queue-hygiene.mjs`, `npm run validate:runtime`, `git diff --check`, and `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate` passed before deployment.
- Deployment: `clasp status` succeeded; `clasp push --force` pushed the four tracked Apps Script runtime files; `clasp version "Fix current order resolution for smoke"` created version `904`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` was deployed at `@904 - Fix current order resolution for smoke`. No new deployment ID was created.
- Smoke: all 20 staged project direct Apps Script routes returned HTTP 200 with clean `client_secret` / `clientSecret` / `hosted_verification_url` marker checks. A clean editable fixture was placed into manual/check pending, `EXPORT_LOG.activeOrderId` pointed to the new manual-pending order, and Team Mode mark-received then updated that same order to `manual_received` / production authorized. The queue produced the expected manual-pending client/team pair and manual-received client/team pair, all `sent`, one attempt, and no visible failure reason. Team Hold and Project Unlock smokes changed state but did not add queue rows. AP checkout-started smoke preserved `ap_payment_link` / `order_only` and did not add checkout-started AP/team queue rows. Bounded queue status checks found no `failed`, `queued`, or `processing` rows.
- Remaining smoke: continue fixture-backed ACH pending/paid/failed, AP ACH submitted/confirmed/failed where available, card paid/failed, PO submitted/payment received from a fresh PO fixture, tax/credit denial/reset, chat digest both directions, and any UI-only lanes requiring browser/manual access.

## 2026-06-15 - Extended Current-Order Resolution Ship

- Mode: Full ship prep for comprehensive fixture smoke.
- Goal: ship the remaining local active-order resolver patch before the owner finishes staging fixtures, so smoke starts from the same current-order semantics across project load, Team Mode, finalized-save checks, and account-document reset workflows.
- Implementation: extended `getCurrentPortalOrderForRow_()` usage to portal finalized-save checks, `buildPortalVmForRow_()` / Team Mode project payload construction, and `resetAccountDocumentWorkflow_()`. This closes the remaining active-order read paths that could otherwise fall back to revision-based latest-order lookup when `EXPORT_LOG.activeOrderId` is available.
- Validation: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `node --check tools/report-portal-email-queue-hygiene.mjs`, `git diff --check`, `npm run validate:runtime`, and `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate` passed. Targeted communication/security scans showed expected implementation and documentation references only.
- Deployment: stable Apps Script deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is deployed at `@905 - Extend current order resolution for smoke`; no new deployment ID was created.
- Pre-smoke evidence: direct Apps Script `/exec` and public `/portal` returned HTTP 200. The direct runtime showed `Development revision 61`, the public wrapper still targets the stable deployment ID, and targeted rendered-response checks found zero `client_secret`, `clientSecret`, or `hosted_verification_url` markers.
- Queue baseline: read-only `PORTAL_EMAIL_QUEUE` checks showed 55 populated rows, all `sent`, all attempt count `1`, and no visible `lastError`. The in-flight tax-exempt reset smoke completed with one client reset row and one team reset row, both `sent`.
- Remaining smoke: once owner-staged fixture tabs are ready, proceed through ACH pending/paid/failed, AP link/submitted/paid/failed where available, card paid/failed, PO submitted/payment received, manual/check/cash pending/payment received, tax/credit submitted/approved/denied/reset, chat digest both directions, and suppressed lifecycle events.

## 2026-06-15 - Full Communication Smoke Preparation Deployment

- Mode: Full ship prep for comprehensive fixture smoke.
- Goal: refresh the existing stable Apps Script deployment with the current local code so owner-staged fixtures can be smoke-tested against a known deployment marker.
- Scope: no runtime source changes were made before deployment. The deployed runtime remains the six-phase communication tranche plus the current-order resolver smoke fixes. No `snapshotJson`, `EXPORT_LOG`, Sheet schema, pricing authority, token lookup, Apps Script config, Stripe config, or live Sheet data was changed.
- Validation: `node --check apps-script/src/Code.js`, `node --check tools/validate-repo.mjs`, `node --check tools/report-portal-email-queue-hygiene.mjs`, `git diff --check`, `npm run validate:runtime`, and `VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate` passed before deployment. Targeted communication/security scans showed no active alias email transport and only expected implementation, documentation, allowlist, or safety-handling hits for sensitive terms.
- Deployment: `clasp status` succeeded; `clasp push --force` reported the Apps Script runtime was already up to date; `clasp version "Prepare full communication smoke deployment"` created version `906`; stable deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` was deployed at `@906 - Prepare full communication smoke deployment`. No new deployment ID was created.
- Pre-smoke evidence: direct Apps Script `/exec` and public `/portal` returned HTTP 200 after deployment. The direct runtime showed `Development revision 61`, the public wrapper still targets the stable deployment ID, and targeted rendered-response checks found zero `client_secret`, `clientSecret`, or `hosted_verification_url` markers.
- Queue baseline: read-only, non-payload `PORTAL_EMAIL_QUEUE` checks showed 59 populated rows, all `sent`, all attempt count `1`, with no visible `lastError`. The read avoided recipient JSON, token, idempotency, and queue payload columns.
- Remaining smoke: once owner-staged fixture tabs are ready, proceed through ACH pending/paid/failed, AP link/submitted/paid/failed where available, card paid/failed, PO submitted/payment received, manual/check/cash pending/payment received, tax/credit submitted/approved/denied/reset, chat digest both directions, suppressed lifecycle events, and queue collision/idempotency checks.
