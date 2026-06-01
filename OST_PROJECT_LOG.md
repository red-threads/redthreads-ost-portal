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
