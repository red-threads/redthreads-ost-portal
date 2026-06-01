# Current Build State

Last aligned: 2026-06-01.

## Repo Verified

- Repository: `red-threads/redthreads-ost-portal`.
- Local path: `/Users/Josiah/Documents/GitHub/redthreads-ost-portal`.
- Runtime root: `apps-script/src/`.
- Tracked runtime files: `Code.js`, `Index.html`, `TaxForm3372Manifest.html`, `appsscript.json`, `.clasp.json`.
- Current tracked app has been pulled from the live Apps Script project and includes the fuller portal architecture: auth shell, dashboard/order lifecycle surfaces, Stripe checkout routing, Team Mode lanes, and tax-form manifest support.
- Tracked runtime source now includes same-window Stripe Checkout launch helpers, ACH bank transfer checkout selection, a global project-entry-style checkout transition overlay with browser-back state restoration, checkout-aware unsaved-change suppression during approved Stripe navigation, checkout-return welcome modal suppression through server-rendered request-route metadata, structured checkout launch timing instrumentation with flat copyable client/server summary lines, a fast normal-checkout response path that skips noncritical response hydration before Stripe navigation, optimized competing-unpaid-order supersede row writes with timing counters, desktop-only mobile-blocking UI with a centered ellipsized copy-link display, and a bottom-left glass Red Threads revision badge showing `18`.
- Portal DB Sheet ID appears in `Code.js`: `16KrxpEv8s-U5gjLX-DZK25GbrnkeKbjgInngie8Ce_c`.
- `.clasp.json` now points to the live Apps Script project ID verified in Apps Script: `1zv9lbls_bohme0vDA8EZg4G0dyFrsuv3hHO0NOAijSw9imYYNkqMbkKU`.
- `docs/EXPORT_LOG_WIDE_SCHEMA.md` tracks the locked EXPORT_LOG column order.
- `package.json` exposes `npm run validate`, `npm run validate:runtime`, and `npm run validate:binding`.
- Active Squarespace `/portal` iframe wrapper code is tracked at `web/squarespace-portal-code-block.html`; the repo copy now includes route replacement, same-window Stripe navigation message handlers, `setupResult` passthrough for ACH setup returns, a Stripe-hosted payment/verification navigation allowlist, and a pre-iframe mobile block with a centered ellipsized copy-link display that prevents iframe loading under `900px`.

## ACH V1 Live State

- ACH V1 infrastructure is merged to `main` and deployed to the existing stable Apps Script deployment.
- Stable Apps Script deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` is currently version `849`, `Add ACH microdeposit verification handoff`.
- Version `849` adds the Dashboard microdeposit handoff for pending ACH verification: `getAchMicrodepositVerificationLink` retrieves Stripe-hosted microdeposit verification URLs transiently from ACH PaymentIntents or SetupIntents only after ACH evidence is present, the Dashboard Payment Methods card changes pending microdeposit banks into a "Verify with Stripe" action, and the repo Squarespace wrapper allowlist now accepts Stripe-hosted verification URLs as well as Checkout URLs. No hosted verification URL, bank account number, routing number, or microdeposit value is persisted.
- Version `848` completes ACH checkout return reconciliation: `reconcile_checkout_return` / `reconcileCheckoutReturn` verifies Stripe return sessions, locks completed ACH Checkout returns into canonical pending-not-paid state when the webhook has not finalized yet, refreshes ACH setup returns, disables editable/order controls during return reconciliation, and routes locked ACH pending returns to Summary without marking the order paid from the browser return alone.
- Version `847` completes the ACH workflow audit hardening: ACH Checkout Sessions now request saved bank redisplay for Customers, pending/unverified ACH methods no longer become the portal default saved bank, dashboard/summary copy distinguishes bank-verification pending from payment processing, and ACH cancel returns point users back to Stripe-hosted instant verification/manual entry or another payment method.
- Version `846` hardens ACH terminal behavior after review: stale pending/processing Stripe events now preserve paid, failed, disputed, team-hold, in-production, and closed ACH orders; ACH microdeposit `requires_action` is mapped to bank-verification-pending state; and hard ACH failures/disputes mark unsafe saved banks unusable.
- Version `845` hardens ACH V1 after review: Stripe webhook audit URL fields are redacted, locked-invoice ACH checkout checks `STRIPE_ACH_ENABLED` before Customer preparation, and ACH success finalization is deduped across distinct Stripe success event types.
- Version `844`, `ACH V1 infrastructure`, deployed the main ACH V1 surface: `STRIPE_ACH_ENABLED` gating, Stripe Customer persistence on `PORTAL_ACCOUNTS`, hosted ACH payment Checkout with Customer, hosted dashboard bank setup, safe saved-bank summaries, ACH pending-production approval controls, ACH lifecycle copy, and Stripe webhook idempotency through `PORTAL_STRIPE_EVENTS`.
- Sheet infrastructure ensures ACH account headers, ACH order headers, and `PORTAL_STRIPE_EVENTS` through existing infrastructure helpers.
- The public Squarespace wrapper points to the stable deployment ID and forwards `setupResult` alongside `t`, `checkoutResult`, and `stripeSessionId`.
- ACH is currently enabled for internal Stripe test-mode use through Script Properties. Keep `STRIPE_MODE=test` until a separate live-mode go/no-go.

## Prompt/Historical

- Expected stable Apps Script deployment ID: `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw`.
- Expected stable public Apps Script URL: `https://script.google.com/macros/s/AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw/exec`.
- Public branded wrapper URL: `https://www.redthreads.com/portal`.
- Live Squarespace wrapper was verified on 2026-06-01 forwarding `t`, `checkoutResult`, `setupResult`, and `stripeSessionId` into the Apps Script iframe.
- Historical calculator sheet ID: `1STzkJjn5WRoBqa5H1KdxAbn4-JCab9DCX4FuZt5HImc`.
- Historical Make scenario: `4062378`.
- Fuller intended architecture includes PORTAL_ORDERS, PORTAL_ACCOUNTS, USERS, USER_SESSIONS, hosted Stripe Checkout, Cloud Run webhook forwarding, Gmail notifications, QuickBooks, and Pipedrive.

## Live Apps Script Alignment

- Browser-verified Apps Script project URL: `https://script.google.com/u/0/home/projects/1zv9lbls_bohme0vDA8EZg4G0dyFrsuv3hHO0NOAijSw9imYYNkqMbkKU/edit`.
- `clasp pull` against the verified live project succeeded on 2026-05-27 and pulled `appsscript.json`, `Code.js`, `Index.html`, and `TaxForm3372Manifest.html`.
- After the binding repair, `clasp push --force`, `clasp version`, and `clasp deploy` can update the live Apps Script source and stable deployment when commands are run sequentially and retried if needed.
- Existing stable deployment ID is present: `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw`, currently deployed at version 849, `Add ACH microdeposit verification handoff`.
- Stage 3A checkout performance work was deployed to the stable Apps Script deployment on 2026-05-28 after sequential `clasp push`, `clasp version`, and `clasp deploy` commands completed. The normal Place Order card checkout path still performs validation, Stripe session creation, PORTAL_ORDERS write, EXPORT_LOG pointer write, and competing unpaid order supersede before returning `checkoutUrl`, but supersede now writes each known candidate row once and returns row info from the in-memory updated values.
- Stage 3B0 checkout timing observability was deployed to the stable Apps Script deployment on 2026-05-28 as version 837. This was instrumentation only: checkout behavior, Stripe payloads, order persistence, webhook logic, lifecycle state, schema, and Squarespace wrapper navigation were not changed. Browser console output now includes `[RT-CHECKOUT-TIMING-CLIENT-SUMMARY]`; Apps Script server logs now include `[RT-CHECKOUT-TIMING-SERVER-SUMMARY]`.
- Desktop-only mobile blocking was deployed to the stable Apps Script deployment on 2026-05-28 as version 838. This is UI/access guard only: Stripe payloads, order persistence, webhook logic, lifecycle state, schema, Apps Script config, and `Code.js` were not changed. Direct Apps Script and iframe-rendered Portal views under `900px` now show the Red Threads mobile block with copy-link controls.
- Mobile block link cleanup was deployed to the stable Apps Script deployment on 2026-05-28 as version 839. The visible URL is now centered plain text with single-line ellipsis while the copy button still copies the full current URL. This was UI-only: `Code.js`, Stripe payloads, order persistence, webhook logic, lifecycle state, schema, and Apps Script config were not changed.
- Checkout unload-prompt suppression was deployed to the stable Apps Script deployment on 2026-05-28 as version 840. The native browser unsaved-changes prompt is bypassed only while an approved Stripe checkout navigation is active, and the dirty baseline is reset after a successful checkout session response with a valid checkout URL. This was client-side runtime UI/state only: `Code.js`, Stripe payloads, order persistence, webhook logic, lifecycle state, schema, and Apps Script config were not changed.
- ACH checkout selection was deployed to the stable Apps Script deployment on 2026-05-28 as version 841. The existing ACH Checkout Session path is now exposed in the order checkout flow and locked invoice payment controls by enabling the shared ACH client gate. ACH sessions continue to use Stripe Checkout with `us_bank_account`; async webhook/currentness handling remains unchanged.
- Checkout-return welcome modal suppression was deployed to the stable Apps Script deployment on 2026-05-29 as version 842. When Stripe returns with `checkoutResult=success` or `checkoutResult=cancel`, the app now preserves that return intent for intro suppression before consuming and removing the checkout URL params.
- Checkout-return request metadata was deployed to the stable Apps Script deployment on 2026-05-29 as version 843. `doGet(e)` now passes safe `checkoutResult` and `stripeSessionId` request-route metadata into the rendered Portal VM so the initial app boot can suppress the welcome intro before URL cleanup or parent iframe messaging completes.
- ACH V1 infrastructure was deployed to the stable Apps Script deployment as version 844, hardened and redeployed as versions 845 and 846 on 2026-06-01, completed as version 847 to strengthen saved-bank redisplay/defaulting and verification/cancel UX, completed as version 848 to add server/client ACH return reconciliation for pending-not-paid Checkout returns, then completed as version 849 to add Dashboard-to-Stripe hosted microdeposit verification handoff.
- The previous `Requested entity was not found` blocker was traced to the stale local `.clasp.json` binding, not to the stable deployment ID itself.

## Blocked Or Unverified

- The live-pulled server source had a checked-in Team Mode default credential; the repo copy now requires the Team Mode password to come from Apps Script Script Properties instead. Confirm that property before relying on Team Mode in production.
- Public stable URL smoke test confirmed the deployed HTML contains `Development revision 18`, omits stale `Development revision 17`, and carries `requestRoute.checkoutResult=cancel` in the VM for a checkout cancel return URL.
- Stage 2 controlled checkout timing on a disposable/test project confirmed `fastCheckoutResponse: true` and `hydrationSkipped: true`. Response hydration no longer blocks normal Stripe navigation; the observed click-to-navigation time was 18,258 ms, with server total 15,960 ms, `google.script.run` round trip 18,189 ms, Stripe API call 710 ms, PORTAL_ORDERS write 262 ms, EXPORT_LOG pointer write 514 ms, and competing unpaid order supersede 7,412 ms.
- Stage 3A post-ship inspection in the Apps Script executions view showed version 836 `createCheckoutAttempt` executions, including a 12.177 s completed execution after deployment. A disposable/test checkout artifact was created and no payment was completed. Detailed server timing JSON was not retrievable through `clasp logs` because the GCP project ID is not configured, and the Apps Script executions UI did not expose parseable log details through the available inspection path.
- Stage 3B0 controlled smoke on a disposable/test project produced the client flat line: `clickToLoader=19`, `clientCapture=2`, `payloadBuild=0`, `serverRoundTrip=12276`, `responseToUrl=0`, `navigationAssign=7`, `totalClickToNavigation=12352`, `launched=true`, `checkoutReady=true`. The response timing object reported server `totalMs=8236`, `stripeApi=938`, `orderWrite=404`, `exportPointerWrite=603`, `supersede=619`, and `hydrationSkipped=true`. The automation environment did not leave the Apps Script sandbox for Stripe despite `launched=true`, so same-window visual navigation should be rechecked manually through the branded wrapper; no payment was completed and no false paid state was observed.
- `clasp logs --json` is still blocked by missing GCP project ID, so the flat server summary line is deployed but was not retrieved through clasp during Stage 3B0.
- Full lifecycle/payment fixture regression was not run during the Stage 3A checkout performance Full ship.
- Live Squarespace `/portal` inspection on 2026-05-28 showed the fullscreen iframe and `RT_PORTAL_ROUTE_REPLACE` / `RT_PORTAL_NAVIGATE` wrapper handlers present after the Squarespace snippet was corrected.
- The repo wrapper has the cleaned pre-iframe mobile block, but Squarespace must be manually updated from `web/squarespace-portal-code-block.html` for that wrapper-layer block to be live. Until then, the deployed Apps Script app-level block handles narrow wrapper access after the iframe loads.
- ACH V1 non-transactional live-surface smoke passed on 2026-06-01 after version 845 deployment: direct `/exec`, direct token load, public wrapper, and tokenized public wrapper returned 200; the public wrapper target matched the stable deployment ID; decoded VM reported `achPaymentEnabled=true` and an ACH pending fixture remained `currentPaymentState=pending`, not paid.
- ACH V1 post-846 smoke confirmed the direct Apps Script `/exec` and public wrapper `/portal` returned 200, and the live wrapper still targets the stable deployment ID while forwarding `setupResult`, `checkoutResult`, and `stripeSessionId`. No bank payment flow was initiated during the version 846 smoke.
- ACH V1 post-847 smoke confirmed direct Apps Script `/exec` returned 200 and contains the new ACH cancel and bank-verification-pending copy; public wrapper `/portal` returned 200 and still targets the stable deployment ID while forwarding `setupResult`, `checkoutResult`, and `stripeSessionId`. No bank payment flow was initiated during the version 847 smoke.
- ACH V1 post-848 smoke confirmed direct Apps Script `/exec` returned 200, advertises the new `reconcileCheckoutReturn` server function, and public wrapper `/portal` returned 200 while still targeting the stable deployment ID and forwarding `setupResult`, `checkoutResult`, and `stripeSessionId`. No bank payment flow, tokenized fixture payment, or real payment was initiated during this ship.
- ACH V1 post-849 smoke confirmed direct Apps Script `/exec` returned 200 and advertises the new `getAchMicrodepositVerificationLink` server function; public wrapper `/portal` returned 200 and still targets the stable deployment ID. The live wrapper HTML is still on the checkout-only Stripe navigation allowlist, while the repo wrapper has been updated to allow Stripe-hosted verification URLs. No bank flow, tokenized fixture payment, or real payment was initiated during this ship.
- Targeted ACH sensitive-data search found only redaction/safety/documentation references plus pre-existing tax form direct-pay fields outside the ACH storage path; no new ACH storage path writes full bank account numbers, routing numbers, microdeposit values, or raw Financial Connections data.

## Workflow

- Current preferred workflow is mainline-first for owner-directed docs/tooling, runtime edits, and Full ship requests.
- Branch/PR workflow is optional and should be used only when explicitly requested, required by repo protection, or appropriate for high-risk architecture/review work.
- Full ship workflow is Apps Script-first: validate locally, run `clasp status`, `clasp push --force`, `clasp version`, `clasp deploy`, deployment verification, and smoke test before GitHub push.
- GitHub source updates and Apps Script push/version/deploy currently work from the repaired local clasp binding when the Apps Script sequence is run in order and retried if a transient command failure occurs.

## Known Follow-Ups

- Continue internal Stripe test-mode ACH flight testing before any live-mode pilot: dashboard setup, ACH success/failure, microdeposit fallback if presented, approved-account pending-production exception, and webhook replay/idempotency.
- Manually refresh the live Squarespace `/portal` code block from `web/squarespace-portal-code-block.html` so `RT_PORTAL_NAVIGATE` explicitly allows Stripe-hosted microdeposit verification URLs, not only `checkout.stripe.com`.
- `schemas/snapshot_v2_0_0.schema.json` allows `printJobs.minItems: 0`, while current project docs/prompt say the supported V2 family is 1-4 PrintJobs. Do not change the schema without a separate schema/contract correction task.
