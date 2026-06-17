# ACH Smoke Test Plan

Status: manual smoke plan for ACH V1. Do not commit live tokens, customer data, private Checkout URLs, raw webhooks, row dumps, or private fixture captures.

## Preconditions

- Local validation passes.
- Apps Script Script Properties are configured for Stripe and ACH.
- Stripe Dashboard has ACH Direct Debit enabled in the intended mode.
- Cloud Run webhook forwarder is subscribed to the ACH event set and forwards to Apps Script with the shared secret.
- The live Squarespace `/portal` code block has been updated from `web/squarespace-portal-code-block.html` after deployment.
- Use disposable test projects only.

Use the official Stripe ACH test bank details from Stripe documentation during manual Stripe Checkout entry. Do not paste live bank details into the portal, repo, logs, or docs.

## Local Static Checks

Run before any deployment:

```bash
node --check apps-script/src/Code.js
node --check tools/validate-repo.mjs
npm run validate:runtime
git diff --check
```

Targeted safety checks:

```bash
rg -n "ACH_CLIENT_PAYMENT_ENABLED|STRIPE_ACH_|PORTAL_STRIPE_EVENTS|createAchSetupSession|adminSetAchPendingProductionApproval|visibilityScope|paymentOrigin" apps-script/src docs testcases web
rg -n "routing_number|account_number|bank_account_token|client_secret|hosted_verification_url|microdeposit" apps-script/src docs testcases web
```

The second command should show only redaction, safety, or documentation references, not persisted bank data.

## Document Reference Smoke Addendum

After the project-based document-reference runtime change is deployed, verify these customer-facing labels and filenames with disposable projects only:

1. Sending a client-facing estimate/summary PDF for project `2010` shows `Estimate 2010-v1` in the email subject/body, rendered PDF label, and attachment filename `Red Threads - Project 2010 - Estimate v01.pdf`.
2. Re-sending the same stored estimate does not increment the version; sending after a meaningful commercial content change increments to `Estimate 2010-v2`.
3. Placing a locked order/invoice for project `2010` stores and displays `Invoice 2010-v1` / `INV-2010-v01` for new order rows while preserving legacy invoice refs as internal/historical fallbacks.
4. ACH, card, manual/check/cash, PO, and AP payment emails reference the active `Invoice 2010-v1` instead of a long `INV-YYYYMMDD-...` customer-facing number.
5. Receipt emails and receipt attachments reference `Receipt for Invoice 2010-v1`; payment receipt events do not increment the invoice version.
6. PO submitted emails reference `Invoice 2010-v1` and show the client PO number separately.
7. AP payment-link emails reference the same active `Invoice 2010-v1` and do not create a separate AP-facing customer document number.
8. Portal-rendered Summary/Invoice PDFs keep the portal-rendered visual format and use the new `Red Threads - Project <project> - <Estimate|Invoice|Receipt for Invoice> vNN.pdf` filename convention.
9. Existing legacy rows with old `INV-YYYYMMDD-...` values still render safely through the new display fallback and do not require historical rewrites.

## Manual Smoke Checklist

1. Existing card checkout launches and returns through the same stable deployment.
2. Existing card cancel/retry still works.
3. Existing PO path still works.
4. Existing check/cash manual payment path still works.
5. Dashboard loads with metadata-only project listing.
6. Token deep link loads exactly one EXPORT_LOG row.
7. Public wrapper loads and forwards `t`, `checkoutResult`, `setupResult`, `stripeSessionId`, `dashboard`, `accountId`, `accountAccessToken`, and `paymentOrigin`.
8. ACH remains hidden while `STRIPE_ACH_ENABLED` is false.
9. ACH first-time hosted Checkout launches when `STRIPE_ACH_ENABLED` is true.
10. ACH payment Checkout Session includes `us_bank_account` and does not attach an emailed Customer by default, so Stripe asks the payer to enter contact email.
11. ACH return says "Order placed - ACH payment initiated," not "Paid."
12. Normal ACH pending does not authorize production.
13. Approved-account ACH pending authorizes production.
14. ACH success marks payment paid and authorizes production.
15. ACH failure marks action needed and leaves retry payment available.
16. Dashboard Payment Methods Add Bank launches hosted setup.
17. Setup success stores a safe saved bank summary with `source=dashboard_setup` and `visibilityScope=dashboard_saved`.
18. Dashboard shows one `ACH payment accounts` card with body text `Manage accounts`; bank names/last4 appear only inside Manage ACH banks, not in the top card or checkout copy, and no ready-state ACH checkout bullet appears below the dashboard cards.
19. Direct account dashboard links load without password gate for `?dashboard=1&accountId=<account-id>` and `?dashboard=1&accountAccessToken=<account-access-token>`.
20. Stripe ACH setup success/cancel returns to the same account dashboard URL rather than the Apps Script iframe sandbox URL; setup cancel returns silently with no dashboard notification/message bar.
21. Tokenized dashboard links, such as `?t=<job-token>&dashboard=1`, can launch Dashboard ACH setup without requiring a separate dashboard login.
22. Dashboard ACH setup sessions are created only when server-built `success_url` and `cancel_url` are non-empty public portal URLs, and the server accepts Stripe's literal `{CHECKOUT_SESSION_ID}` placeholder during validation.
23. Tokenized or logged-in session dashboard ACH setup returns with `dashboard=1`, `setupResult`, `stripeSessionId`, and an account bearer context when available.
24. Dashboard ACH setup success/cancel returns do not preserve stale project `t` parameters when `accountAccessToken` is available, and malformed duplicate dashboard/account query params are normalized back to one account dashboard route.
25. Login from public `/portal` replaces the parent URL with `?dashboard=1&accountAccessToken=<account-access-token>` after dashboard hydration.
26. Refreshing the account dashboard URL reloads the dashboard without returning to the login view.
27. Opening a project from the dashboard pushes `?t=<project-token>`, and browser Back/Forward reloads the matching dashboard/project iframe route after the live wrapper has been refreshed from the repo copy.
28. Pending/unverified ACH banks keep the same compact `ACH payment accounts` card; clicking it opens Manage ACH banks, where pending rows show Verify with Stripe only when safe SetupIntent/Setup Session or PaymentIntent linkage exists. Legacy rows with only a PaymentMethod ID show verification-unavailable guidance, and the same PaymentMethod is not rendered twice in the top dashboard summary.
29. Pending/unverified ACH banks are not promoted as the default saved checkout bank.
30. Dashboard ACH setup still uses hosted Stripe setup mode and the portal account Customer; ACH payment Checkout is Customer-free by default to keep Stripe's payer email field editable.
31. Replayed webhook event ID does not duplicate side effects, including near-simultaneous duplicate deliveries that contend for the Apps Script webhook lock.
32. Stale tab cannot overwrite paid, failed, locked, or superseded state.
33. Stale ACH pending events, including late `checkout.session.completed` or `payment_intent.processing`, do not move paid, failed, disputed, team-hold, in-production, or closed orders backward.
34. Microdeposit-required ACH flows show bank verification pending/action-needed copy without storing microdeposit values.
35. Dashboard Payment Methods shows a pending microdeposit bank as an action only when the clicked pending bank has enough safe intent/session linkage for `getAchMicrodepositVerificationLink`; otherwise the modal remains closable and shows Add-bank/test-tooling guidance without promising a Stripe email link.
36. The hosted verification URL is returned only to the browser for immediate navigation and is not stored in Sheets, docs, logs, browser state, or committed files. If Stripe does not provide a hosted URL and `STRIPE_MODE=test`, the server may verify the validated SetupIntent/PaymentIntent through Stripe's official test `verify_microdeposits` API path, using Stripe's descriptor-code test value when the intent asks for descriptor verification or test amounts when it asks for amount verification. The portal refreshes the account/order state and keeps all verification values server-side.
37. After a successful order-level Verify with Stripe / test fallback response, the Summary/Invoice and progress bar rehydrate immediately. If payment is still pending, copy says ACH payment is pending Stripe/bank confirmation and the Verify button disappears; the user should not need a manual Refresh Payment Status click to clear the verification-required copy.
38. ACH dispute, late-return, mandate invalid, account closed, debit-not-authorized, and microdeposit timeout/exceeded failures mark unsafe saved banks unusable instead of leaving them as default active methods.
39. ACH cancel return lets the user retry ACH through Stripe-hosted instant verification/manual entry or choose another payment method.
40. ACH success return calls `reconcile_checkout_return` before URL cleanup and immediately shows locked pending-not-paid state if the webhook has not finalized yet.
41. ACH return reconciliation disables Save, Place Order, and payment controls while it is refreshing server state.
42. ACH pending-not-paid hydration is accepted as a post-checkout canonical state and routes the user to Summary/Invoice copy without waiting for a paid/finalized signal.
43. ACH checkout success return with stale `mode=team` or `teamReview` params does not show the Team Mode password gate; it forces client mode, cleans one-time/team params, and lands on Summary/Invoice.
44. ACH checkout cancel return with stale `mode=team` or `teamReview` params does not show the Team Mode password gate; it returns to retry/alternate-payment context without auto-relaunching Checkout.
45. ACH cancel return reconciliation preserves locked/pending canonical state if the order had already been placed, otherwise leaves retry/alternate payment available.
46. Dashboard progress copy is isolated per project: fresh editable estimates, card, PO, and manual/check/cash projects never inherit ACH-pending helper text from another ACH order.
47. Manage ACH banks lists multiple `dashboard_saved` records only; hidden/order-only/AP records do not render.
48. If Manage ACH banks has no dashboard-saved records, the empty state says no dashboard-saved ACH banks exist and explains that banks entered during order checkout or AP links are order-only.
49. Usable non-default dashboard-saved banks can be selected as default from Manage ACH banks; pending, failed, blocked, removed, and order-only records cannot. Copy does not imply Checkout will force that bank.
50. Checkout and invoice payment notes do not show bank names, last4, default-bank copy, preferred-bank copy, or wallet-like selector language.
51. Selecting ACH Bank Payment and clicking Place Order opens the ACH pre-checkout decision step in its own full-screen modal container that replaces the checkout-flow modal instead of appending below the payment cards.
52. No saved bank: the decision step shows generic Stripe-hosted ACH copy and the continue button launches hosted ACH Checkout.
53. One usable dashboard-saved bank: the decision step still shows generic Stripe-hosted ACH copy with no bank name or last4; Stripe remains the final bank confirmation surface.
54. Multiple usable dashboard-saved banks: the decision step still shows generic Stripe-hosted ACH copy with no selector; all bank-specific management remains in Manage ACH banks.
55. Checkout decision account context: when a project is opened from Dashboard, the ACH decision step remains generic even if the dashboard account has one or more verified banks.
56. Pending, unavailable, or status-missing dashboard ACH banks remain visible from Manage ACH banks for verification/default actions and do not render as checkout-ready rows.
57. Backward-compatible `preferredAchPaymentMethodId` server support remains: invalid or stale ACH method IDs are rejected before Stripe Checkout creation if an internal caller supplies one.
58. Copy ACH payment link from the decision step prepares/locks an awaiting-payment ACH order and copies `/portal?t=<token>&summary=1&payNow=ach&paymentOrigin=ap`, never a private Stripe Checkout URL. Dashboard/project copy should say waiting for Accounts Payable, not Stripe processing.
59. Email ACH payment link validates an AP email address, prepares/locks an awaiting-payment ACH order, sends a Red Threads portal AP link with AP-specific copy and the CTA `Open secure ACH payment page`, and does not email a Stripe Checkout URL.
60. AP email attachment behavior requires the current browser-rendered Summary/Invoice PDF payload. If the rendered PDF cannot be generated, the email action should return a clear preparation error instead of silently attaching an older generated fallback artifact. Copy-link flow does not require an attachment.
61. AP payment links launch hosted ACH from the locked invoice/payment-due surface, omit Customer attachment/future-save/redisplay settings so Stripe collects payer contact email, and write `achPaymentSource=ap_payment_link` plus `achPaymentVisibilityScope=order_only`.
62. AP-link ACH Customer/session creation happens only after the latest order is confirmed locked and unpaid; missing, unlocked, or already-paid orders fail before Stripe side effects.
63. After AP opens the link and a Stripe Checkout Session is created, Dashboard/project copy may say Accounts Payable checkout has started; only after Checkout completion or ACH pending/processing Stripe evidence should copy say ACH payment is processing with Stripe.
64. AP-link ACH bank evidence stays on `PORTAL_ORDERS` and does not create a Dashboard Payment Methods row.
65. No full bank account numbers, routing numbers, hosted verification URLs, or microdeposit values are stored in Sheets, Apps Script logs, browser state, or repo files.
66. ACH payment Checkout email policy: normal owner and AP/order-only ACH payment sessions do not pass `customer` or `customer_email` by default; Stripe collects payer contact email in Checkout. Dashboard bank setup remains the saved-bank readiness path.
67. Standard order-checkout ACH pending state queues one client invoice/status email and one team alert to `hello@redthreads.com` through `PORTAL_EMAIL_QUEUE` with the current invoice attachment. Verification-required copy says Stripe is waiting for bank verification; processing copy says ACH is pending Stripe/bank confirmation.
68. Standard order-checkout ACH paid state queues one client receipt email and one team alert to `hello@redthreads.com` through `PORTAL_EMAIL_QUEUE` with an updated invoice/receipt attachment. Duplicate success signals such as `payment_intent.succeeded` plus `checkout.session.async_payment_succeeded` must not send a second receipt or team alert.
69. Standard order-checkout ACH failed/disputed/blocked state queues one action-needed client email and one team alert to `hello@redthreads.com`, and does not expose raw Stripe failure payloads.
70. ACH lifecycle queue rows use recipient-class idempotency, immediately attempt safe queue processing, and fall back to the processor trigger when a lock or send failure prevents immediate completion. Queue status must distinguish `sent`, `failed`, and state-based `skipped` rows.
71. ACH lifecycle client emails and matching team alerts render through the shared lifecycle email shell with a reference block, email-safe progress snapshot, current next step, history bullets when dates exist, CTA, no-reply footer, and invoice/receipt attachment.
72. AP/order-only ACH remains excluded from the standard ACH lifecycle client/team lifecycle emails, but uses its own `ap_ach_lifecycle_email` queue job for submitted/pending, confirmed/receipt, and failed/action-needed milestones. Deployed communication policy suppresses AP checkout-started emails for future sends.
73. Non-ACH payment lifecycle milestones use `PORTAL_EMAIL_QUEUE` job type `payment_lifecycle_email` with recipient-class idempotency: card paid, card failed/action-needed, manual check/cash pending, manual payment received, PO submitted, and PO payment received each queue one client email and one team alert to `hello@redthreads.com`.
74. Non-ACH payment lifecycle emails render through the shared lifecycle email shell with the five-stage progress snapshot, payment-method-specific reference copy, current next step, history bullets when dates exist, CTA, no-reply footer, and the required invoice/receipt attachment except card failed/action-needed, where an existing invoice may attach but missing attachment must not block the action-needed email.
75. Active AP lifecycle emails render through the shared lifecycle email shell with AP ACH reference copy, the five-stage progress snapshot, current next step, AP payment CTA, history bullets when dates exist, and no-reply footer. AP-facing emails go to the stored AP recipient with purchaser/client visible CC when distinct; matching team alerts go to `hello@redthreads.com`.
76. AP submitted/pending and confirmed/receipt lifecycle emails require invoice/receipt attachments. AP failed/action-needed attaches the invoice/status PDF when available, but missing attachment must not block the action-needed email.
77. Portal chat notifications use queued `chat_message_digest_email` jobs with a 10-minute `portalStateJson.notBefore` debounce. Client messages digest to `hello@redthreads.com`, team replies digest to the project client email, and queue payloads store message IDs/timing only, not message text.
78. Non-payment portal lifecycle milestones use queued `portal_lifecycle_email` jobs with recipient-class idempotency. Deployed communication policy suppresses future sends for artwork approved/change requested, project ready to order, Team Hold, Project Unlock, Checkout Reset, client flow canceled/reset, standalone production authorized, and job/project completion; tax-exempt/credit-terms submission/approval/denial/reset events remain active.
79. `portal_lifecycle_email` messages render through the shared lifecycle email shell with the five-stage progress snapshot when project context exists, current next step, history bullets when dates exist, CTA, no-reply footer, and safe document attachments when the event requires them.
80. Utility/direct emails that are intentionally not lifecycle triggers remain direct: AP payment-link send, blank account-document send, submitted tax-form copy send, password reset code, summary PDF send, and explicit admin resend actions.
81. Due `PORTAL_EMAIL_QUEUE` jobs can be processed by the normal queue trigger or by the bounded portal-traffic nudge on direct portal loads/chat saves. Nudge logs must remain safe and must not include tokens, raw recipient emails, chat message text, Stripe secrets, or bank details.
82. Portal-generated emails use Apps Script `MailApp` `noReply: true` transport rather than the removed `noreply@redthreads.com` Workspace alias; reply tests should confirm replies bounce, fail, or otherwise do not arrive in the owner Workspace inbox.
83. Queue hygiene audits should remain read-only by default. Use `tools/report-portal-email-queue-hygiene.mjs` against a sanitized `PORTAL_EMAIL_QUEUE` CSV/TSV export to count job types, statuses, age buckets, recipient classes, skipped/failed reason categories, policy-disabled queued rows, stale queued rows, stuck processing rows, and duplicate-ish redacted groups without printing tokens, raw recipient emails, idempotency keys, queue payloads, message text, Drive URLs, or payment identifiers.

## Post-896 Communication Tranche Smoke Evidence

Recorded 2026-06-11 after deploying stable Apps Script version `896`, `Complete portal communication tranche`:

- Direct Apps Script `/exec`, direct tokenized `/exec`, public `/portal`, direct dashboard route, and checkout-cancel route returned HTTP 200 with revision `60` visible where expected and no `client_secret` / `clientSecret` markers in rendered output. Raw curl POST smoke against the Apps Script public redirect path returned HTTP 405 after redirect, so read-only server action evidence should be gathered through the rendered portal/`google.script.run` surface or Apps Script execution context rather than anonymous curl.
- `clasp deployments` confirmed the existing stable deployment ID points at `@896`; no new deployment ID was created.
- The private fixture loaded visually in browser automation with the revision `60` badge, project status stages, order controls, and price matrix. The only console issue observed was an external Squarespace widget limit message, not a portal runtime failure.
- Older queued ACH lifecycle rows from prior smoke attempts were processed by the bounded portal-traffic nudge: submitted/pending jobs skipped safely once the order was already paid, and receipt jobs sent.
- Artwork approval on the private fixture created one `portal_lifecycle_email` team alert row and it completed with status `sent`.
- Chat digest batching was exercised with two private fixture messages in the same `client_to_team` window. The same `chat_message_digest_email` row was updated with both message IDs, its `notBefore` was refreshed, it did not send early, and it completed with status `sent` after the debounce window with one attempt and no failure reason.
- Queue payload review confirmed chat digest rows store message IDs/timing only, not message text.
- The scanned `PORTAL_EMAIL_QUEUE` status column contained only `sent` and intentional state-based `skipped` rows after post-ship queue smoke; no `failed` rows were found.
- `clasp run processPortalEmailQueue --nondev` is not available for this Apps Script project because the project is not API-executable; queue evidence was gathered through the live web app, the backing Sheets queue, and safe rendered-route checks.

Recorded 2026-06-11 after deploying stable Apps Script version `897`, `Harden AP link email failure response`:

- Manual check pending smoke placed a disposable check-payment order through the live portal and produced one client invoice lifecycle row plus one team alert row; both completed `sent` with one attempt and no failure reason.
- PO submitted smoke approved artwork, generated a disposable invoice artifact, submitted a purchase order, and produced one client `payment_lifecycle_email` plus one team `payment_lifecycle_email`; both completed `sent`, both carried invoice attachment references, and no `client_secret` / `clientSecret` marker appeared in the action response.
- Card paid smoke completed Stripe Checkout with a test card and produced one client receipt lifecycle row plus one team alert row; both completed `sent`, both carried invoice/receipt attachment references, and no `client_secret` / `clientSecret` marker appeared in the portal response.
- AP ACH smoke first exposed an AP payment-link failure mode where the AP order could be created before a generic Apps Script email-send error returned and left the AP recipient field blank. Version `897` catches that exception and routes it through the existing structured AP-email-failed response so the AP link can still be copied safely.
- AP ACH payment-link retry after `897` succeeded with structured `emailOk=true`, preserved `order_only` AP ACH scope, and did not expose a client secret. Starting AP ACH checkout from that locked AP order produced two `ap_ach_lifecycle_email` rows, one AP-facing and one team alert; both completed `sent`, both carried invoice attachment references, and neither row recorded a failure reason.
- Team-to-client chat digest smoke used two private fixture replies in the same `team_to_client` window. The same `chat_message_digest_email` row was updated with both message IDs, its `notBefore` was refreshed, it remained queued until due, then completed `sent` with one attempt and no failure reason.
- Card failed/action-needed smoke used a disposable hosted Stripe Checkout retry with a declined test card. Stripe showed the expected declined-card state; the webhook created one client `payment_lifecycle_email` and one team `payment_lifecycle_email` for `card_failed`, both completed `sent` with one attempt and no failure reason, and the Checkout creation response omitted `client_secret` / `clientSecret`.
- Fresh standard ACH smoke used a disposable locked invoice retry through hosted Stripe Checkout and Stripe's sandbox success test institution. The checkout returned to the public portal without a `client_secret` / `clientSecret` marker. The queue created one client submitted/pending invoice email and one team submitted/pending alert, then one client confirmed/receipt email and one team confirmed/receipt alert; all four rows completed `sent` with one attempt, no failure reason, and invoice/receipt attachment references.
- Standard ACH failed/action-needed smoke used a disposable hosted Stripe Checkout and Stripe's sandbox debit-not-authorized test account. The checkout returned to the public portal without a `client_secret` / `clientSecret` marker. The queue created one client submitted/pending invoice email and one team submitted/pending alert, then one client failed/action-needed email and one team failed/action-needed alert; all four rows completed `sent` with one attempt, no failure reason, and invoice/status attachment references.
- AP ACH submitted/confirmed smoke used the stored AP payment-link recipient from the existing AP lifecycle fixture and hosted Stripe Checkout with Stripe's sandbox success test institution. The checkout returned to the public portal without a `client_secret` / `clientSecret` marker. The queue created one AP-facing submitted/pending email plus one team submitted/pending alert, then one AP-facing confirmed/receipt email plus one team confirmed/receipt alert; all four rows completed `sent` with one attempt, no failure reason, and invoice/receipt attachment references.
- AP ACH failed/action-needed follow-up attempt prepared a fresh disposable AP payment-link order through normal portal calls: artwork approval succeeded, AP email send returned `emailOk=true`, AP checkout creation returned a hosted Checkout URL with no `client_secret` / `clientSecret` marker, and the AP checkout-started AP/team queue rows completed `sent`. The hosted Stripe ACH failure submission could not be completed in the automation profile because Stripe presented hCaptcha on both the test-institution and manual-bank-detail lanes.
- Follow-up Team Mode authorization attempt used the owner-supplied password value without logging or storing the secret, but the deployed runtime returned `Incorrect password.` through the normal `verifyTeamModePassword` server path. Chrome had no preexisting authorized Team Mode session for the tested project.
- After the Team Mode route/password correction in version `899`, the Team Mode-dependent communication smokes passed. PO payment received on the prepared PO fixture produced one client `po_payment_received` lifecycle email and one team alert, both `sent`, one attempt, no failure reason, and receipt attachment references. Manual/check payment received on a disposable fixture produced one client `manual_received` lifecycle email and one team alert, both `sent`, one attempt, no failure reason, and receipt attachment references.
- Team Mode/admin lifecycle smoke covered Team Hold, Project Unlock, Checkout Reset, PO Reopen, and Project Complete. Each milestone produced one client `portal_lifecycle_email` and one team `portal_lifecycle_email`; all observed rows completed `sent` with one attempt and no failure reason.
- Remaining AP ACH failed/action-needed smoke is intentionally deferred per owner direction. It still requires either a human-completed Stripe Checkout challenge, a supported Stripe test-event path, or another owner-approved Stripe test path.

## ACH Event Smokes

For each event below, confirm `PORTAL_STRIPE_EVENTS` has one row per event ID and `PORTAL_ORDERS` reflects the expected state:

- `checkout.session.completed`: order placed, ACH pending, production policy applied.
- Standard ACH `checkout.session.completed`: one submitted/pending invoice email and one team alert are queued/sent for `achPaymentSource=order_checkout`; AP/order-only ACH is excluded.
- Standard ACH email rendering: pending/verification, receipt, and failed/action-needed client emails plus team alerts include the five-stage progress snapshot (`Qty/Sizes`, `Artwork`, `Order`, `Payment`, `Production`) sourced from canonical dashboard lifecycle helpers.
- Immediate Checkout success return before async payment finality: `reconcile_checkout_return` locks the order pending/not paid and records safe ACH fields only after ACH evidence is present.
- Stale `checkout.session.completed`: no regression when the order is already paid, failed, disputed, team-hold, in production, or closed.
- `checkout.session.async_payment_succeeded`: paid, production authorized, failure fields cleared, one ACH receipt email and one team alert queued/sent for standard order-checkout ACH.
- `checkout.session.async_payment_failed`: failed/action-needed, retry available, team review if production was already authorized, one ACH action-needed email and one team alert queued/sent for standard order-checkout ACH.
- `payment_intent.processing`: ACH processing, not paid.
- Standard ACH `payment_intent.processing`: submitted/pending invoice email and team-alert idempotency collapse with any already-queued submitted email/team alert for the same order/payment intent and recipient class.
- Stale `payment_intent.processing`: no regression when the order is already paid, failed, disputed, team-hold, in production, or closed.
- `payment_intent.succeeded`: paid and production authorized; receipt email and team-alert idempotency collapse with `checkout.session.async_payment_succeeded`.
- `payment_intent.payment_failed` or `charge.failed`: failed/action-needed, with unsafe saved-bank default blocked for hard bank/mandate/verification failures and one ACH action-needed email plus one team alert queued/sent for standard order-checkout ACH.
- `charge.updated`: expected debit date and safe bank summary fields updated when available.
- `charge.dispute.created`: failed/team review, no silent retry, saved bank marked unusable, one ACH action-needed email plus one team alert queued/sent for standard order-checkout ACH.

## Communication CTA Smoke

After the local undeployed CTA hardening is approved and deployed:

- Standard ACH pending, verification/action-needed, and receipt emails open the public invoice/status route `/portal?t=<token>&summary=1`; matching team alerts open `/portal?t=<token>&mode=team`.
- AP payment-link send opens `/portal?t=<token>&summary=1&payNow=ach&paymentOrigin=ap`.
- AP ACH pending/submitted and confirmed/receipt emails open `/portal?t=<token>&summary=1&paymentOrigin=ap` without `payNow=ach`; AP ACH failed/action-needed keeps the AP retry route with `payNow=ach&paymentOrigin=ap`.
- Card, PO, and manual/check/cash lifecycle client emails open invoice/status or receipt routes, while matching team alerts open Team Mode.
- Tax/credit team review emails open the public Team Mode review route with `mode=team` and the correct `teamReview` value.
- Chat digest client-to-team emails open Team Mode; team-to-client digests open the client portal.
- Password reset emails open public `/portal`, not the Apps Script `/exec` URL.
- No email exposes raw Stripe Checkout URLs, hosted verification URLs, `client_secret`, Apps Script sandbox URLs, or direct Apps Script web-app CTAs.

## Communication Attachment Smoke

After the local undeployed attachment hardening is approved and deployed:

- Standard ACH pending/verification emails attach the current invoice/status PDF; if the required attachment cannot be loaded, the queue row fails safely with `required_invoice_attachment_missing`.
- Standard ACH receipt emails attach a regenerated paid invoice/receipt that reflects payment status, method, and date; missing required receipt attachments fail safely with `required_receipt_attachment_missing`.
- Standard ACH failed/disputed/action-needed emails still send when an optional invoice/status attachment cannot be loaded, and safe diagnostics distinguish optional missing attachment from send failure.
- AP payment-link send blocks before email transport if the current AP invoice attachment cannot be loaded.
- AP ACH submitted/pending and confirmed/receipt emails require the AP locked-order invoice/receipt attachment; AP ACH failed/action-needed emails may send without the optional attachment.
- Card paid, PO submitted, PO payment received, manual/check/cash pending, and manual/check/cash received lifecycle emails attach the required current invoice or regenerated receipt; card failed/action-needed may send without an optional attachment.
- PO invoice prepared/sent and explicit locked-order/admin resend emails fail clearly before transport if the invoice attachment is unavailable.
- Blank tax/credit/source document emails fail before transport if the configured source PDF cannot be loaded.
- Tax/credit submitted and approved emails attach the required submitted/approved artifacts; denied/reset emails remain optional unless a later owner policy changes that rule.
- Chat digest and password reset emails send with no attachments.
- No attachment contains bank details, raw Stripe payloads, hosted verification URLs, `client_secret`, raw webhook payloads, or microdeposit values.

## Communication Content Smoke

After the local undeployed content hardening is approved and deployed:

- Standard ACH pending, verification-required, receipt, and failed/action-needed emails have concise event-accurate subjects, one clear next step, one primary CTA, correct attachment notes, and no raw Stripe implementation terms.
- AP payment-link and AP ACH pending, receipt, and failed/action-needed emails explain the AP/order-only lane clearly, avoid duplicate-payment language on pending/receipt status links, and keep bank details out of the copy.
- Card paid/failed, PO submitted/paid, and manual/check/cash pending/paid emails use payment-state-accurate language; payment receipt emails may mention production authorization only when supported by the current lifecycle state.
- Tax-exempt and credit-terms submitted, approved, denied, and reset emails use calm professional wording, sanitized reason text, correct review/account next steps, and required document attachment notes.
- Chat digest emails in both directions show grouped messages, correct project/customer reference, and the correct Team Snapshot or client portal CTA without including the Team Mode password.
- Password reset, explicit summary/PDF send, blank account-document source, submitted tax-form copy, and admin resend emails use the shared automated-notification footer and do not invite replies.
- No active email content includes Team Mode passwords, emoji/icon prefixes, legacy "do not reply" wording, `PaymentIntent`, `webhook`, `checkout.session`, `client_secret`, hosted verification URLs, raw Stripe Checkout URLs, bank account/routing values, or microdeposit values.
- `setup_intent.succeeded`: saved bank summary stored.
- `setup_intent.setup_failed`: setup failed with retry path; if exactly one matching `dashboard_saved` ACH row can be identified by safe setup/payment method/customer/account linkage, that row moves to failed/unavailable and is not default-eligible.
- AP-link checkout-started: creating the locked-order AP ACH Checkout Session does not queue or send AP-facing/team checkout-started emails under the local undeployed communication suppression policy. AP payment-link send remains active, and AP submitted/pending, confirmed/receipt, and failed/action-needed milestones remain active.
- AP-link `checkout.session.completed` / `payment_intent.processing`: order-level ACH fields update, `PORTAL_ACCOUNTS.achPaymentMethodsJson` is not expanded with a dashboard-visible bank, and one AP-facing submitted/pending email plus one team alert are queued/sent with attachment-required handling.
- AP-link `checkout.session.async_payment_succeeded` / `payment_intent.succeeded`: one AP-facing receipt email plus one team alert are queued/sent with updated invoice/receipt attachment, and duplicate success signals collapse by AP lifecycle idempotency.
- AP-link `checkout.session.async_payment_failed`, `payment_intent.payment_failed`, `charge.failed`, or `charge.dispute.created`: one AP-facing action-needed email plus one team alert are queued/sent, missing optional invoice attachment does not block the action-needed send, and no raw Stripe payload or bank detail is exposed.
- PaymentIntent or SetupIntent `requires_action` with `next_action.verify_with_microdeposits`: verification status shown as microdeposit pending; no microdeposit values stored.
- Dashboard microdeposit verification handoff: `getAchMicrodepositVerificationLink` returns a Stripe-hosted verification URL only when ACH payment/setup evidence is present, the clicked pending bank matches the authorized account/order context, and Stripe exposes a hosted verification URL. If that URL is unavailable in `STRIPE_MODE=test`, the server-only fallback may complete official Stripe test verification and return refreshed safe account/order state. A bare PaymentMethod ID is not enough for the dashboard to render the Verify with Stripe action.
- Tokenized Dashboard microdeposit verification handoff: `getAchMicrodepositVerificationLink({ token })` accepts a valid job dashboard token but rejects invalid or cross-account token context.

## Non-ACH Payment Email Smokes

- Card checkout paid: `checkout.session.completed` records paid state and queues/sends exactly one `payment_lifecycle_email` client receipt and one team alert; replaying the same event does not duplicate sent rows.
- Card failed/action-needed: `payment_intent.payment_failed` or `charge.failed` records failed state and queues/sends exactly one client action-needed email and one team alert; missing invoice attachment does not block this failed/action-needed email.
- Manual check/cash pending: placing a check or cash order queues/sends exactly one client invoice email and one team alert with the invoice attachment.
- Manual payment received: Team Mode mark-payment-received queues/sends exactly one client receipt email and one team alert with updated invoice/receipt attachment and production-authorized copy.
- PO submitted: purchase-order submission uses the queued lifecycle email path instead of the old direct send, queues/sends one client confirmation and one team alert with invoice attachment, and still returns Summary/card/ACH payment links in the action response.
- PO payment received: Team Mode mark-PO-payment-received queues/sends exactly one client receipt email and one team alert with updated invoice/receipt attachment.

## Chat Digest Email Smokes

- Client sends three messages within 10 minutes: one `client_to_team` digest job is updated with all three message IDs, does not send before `notBefore`, and sends one email to `hello@redthreads.com` after the debounce window.
- Team sends multiple replies within 10 minutes: one `team_to_client` digest job is updated with all reply IDs, does not send before `notBefore`, and sends one no-reply email to the project client email after the debounce window.
- Client and team messages in the same period create separate directional digest jobs.
- Running `processPortalEmailQueue` before `notBefore` does not send early and schedules another processor trigger while the job remains queued/retryable.
- Queue send failure does not block chat save; the queue row records `failed` with a safe `lastError` and remains eligible for normal retry until the max attempt limit.
- Missing client email skips or avoids queuing the client digest safely; client-to-team digests still route to `hello@redthreads.com`.
- Existing ACH, AP ACH, card, PO, manual/check/cash, and payment lifecycle email behavior remains unchanged.
- Replying to the delivered client digest must not reach the owner Workspace inbox.

## Portal Lifecycle Email Smokes

- Communication suppression policy: artwork approved/change requested, project ready to order, Team Hold, Project Unlock, Checkout Reset, client flow canceled/reset, standalone production authorized, jobs completed, project completed, and AP checkout-started should not create future email queue rows. If stale queued rows for these milestones are encountered, they should become `skipped` with `lastError=communication_policy_disabled`.
- Communication collision guard: AP ACH paid should produce only AP ACH confirmed/receipt emails plus the team alert, not PO paid or standard ACH receipt emails. Standard ACH paid, card paid, manual/check/cash received, and PO payment received should each produce one receipt email plus one team alert, and no standalone production-authorized email.
- Duplicate Stripe ACH event guard: overlapping ACH pending, success, and failure signals should collapse to one client/AP-facing email and one team alert per active milestone. Stale queued competing payment rows should become `skipped` with `lastError=communication_milestone_superseded`.
- PO submission reopened: remains active unless separately disabled by owner decision; reopening PO submission queues/sends the expected client email and matching team alert.
- Production authorization caused by payment receipt: no standalone production-authorized email sends; the payment receipt email carries the production-authorized copy where applicable.
- Account document submitted: tax-exempt and credit-terms submissions queue/send one team-review email to `hello@redthreads.com` with the submitted document attachment.
- Account document approved/denied/reset: tax-exempt and credit-terms decisions queue/send client emails and team alerts with appropriate CTA, reason text when denied, and approved-document attachment when required.
- Queue failure behavior: missing required document attachment records a safe `failed` queue row, while missing recipients records safe skipped/not-queued diagnostics.

## Internal Test-Mode Microdeposit Verification

Do not build a Red Threads portal form for microdeposit amounts. The deployed runtime may perform this verification server-side only when `STRIPE_MODE=test`, safe intent/customer/payment-method linkage has already been validated, and Stripe did not provide a hosted verification URL. For manual internal troubleshooting, the equivalent Stripe test tooling/API path is:

```text
POST /v1/setup_intents/{SETUP_INTENT_ID}/verify_microdeposits
amounts[]=32
amounts[]=45
```

If Stripe reports descriptor-code verification, the server-only test fallback uses `descriptor_code=SM11AA` instead of amounts. Failure-path test amounts are `10` and `11`; timeout-path test amounts are `40` and `41`. These values are testing instructions only and must not be collected from clients or stored by the portal.

## Deployment Smoke Order

Run only after explicit Full ship authorization:

1. Direct Apps Script `/exec` auth shell.
2. Direct Apps Script `/exec?t=<disposable-token>`.
3. Public wrapper `https://www.redthreads.com/portal`.
4. Public wrapper with disposable token.
5. Card checkout regression.
6. Manual/PO regression.
7. ACH payment launch and return.
8. ACH setup launch and return.
9. Webhook replay/idempotency check.
10. Due email queue processing through direct portal load/chat-save nudge.
