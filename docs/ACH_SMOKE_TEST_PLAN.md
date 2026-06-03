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
37. ACH dispute, late-return, mandate invalid, account closed, debit-not-authorized, and microdeposit timeout/exceeded failures mark unsafe saved banks unusable instead of leaving them as default active methods.
38. ACH cancel return lets the user retry ACH through Stripe-hosted instant verification/manual entry or choose another payment method.
39. ACH success return calls `reconcile_checkout_return` before URL cleanup and immediately shows locked pending-not-paid state if the webhook has not finalized yet.
40. ACH return reconciliation disables Save, Place Order, and payment controls while it is refreshing server state.
41. ACH pending-not-paid hydration is accepted as a post-checkout canonical state and routes the user to Summary/Invoice copy without waiting for a paid/finalized signal.
42. ACH checkout success return with stale `mode=team` or `teamReview` params does not show the Team Mode password gate; it forces client mode, cleans one-time/team params, and lands on Summary/Invoice.
43. ACH checkout cancel return with stale `mode=team` or `teamReview` params does not show the Team Mode password gate; it returns to retry/alternate-payment context without auto-relaunching Checkout.
44. ACH cancel return reconciliation preserves locked/pending canonical state if the order had already been placed, otherwise leaves retry/alternate payment available.
45. Manage ACH banks lists multiple `dashboard_saved` records only; hidden/order-only/AP records do not render.
46. Usable non-default dashboard-saved banks can be selected as default from Manage ACH banks; pending, failed, blocked, removed, and order-only records cannot. Copy does not imply Checkout will force that bank.
47. Checkout and invoice payment notes do not show bank names, last4, default-bank copy, preferred-bank copy, or wallet-like selector language.
48. Selecting ACH Bank Payment and clicking Place Order opens the ACH pre-checkout decision step in its own full-screen modal container that replaces the checkout-flow modal instead of appending below the payment cards.
49. No saved bank: the decision step shows generic Stripe-hosted ACH copy and the continue button launches hosted ACH Checkout.
50. One usable dashboard-saved bank: the decision step still shows generic Stripe-hosted ACH copy with no bank name or last4; Stripe remains the final bank confirmation surface.
51. Multiple usable dashboard-saved banks: the decision step still shows generic Stripe-hosted ACH copy with no selector; all bank-specific management remains in Manage ACH banks.
52. Checkout decision account context: when a project is opened from Dashboard, the ACH decision step remains generic even if the dashboard account has one or more verified banks.
53. Pending, unavailable, or status-missing dashboard ACH banks remain visible from Manage ACH banks for verification/default actions and do not render as checkout-ready rows.
54. Backward-compatible `preferredAchPaymentMethodId` server support remains: invalid or stale ACH method IDs are rejected before Stripe Checkout creation if an internal caller supplies one.
55. Copy ACH payment link from the decision step prepares/locks an awaiting-payment ACH order and copies `/portal?t=<token>&summary=1&payNow=ach&paymentOrigin=ap`, never a private Stripe Checkout URL. Dashboard/project copy should say waiting for Accounts Payable, not Stripe processing.
56. Email ACH payment link validates an AP email address, prepares/locks an awaiting-payment ACH order, sends a Red Threads portal AP link with AP-specific copy and the CTA `Open secure ACH payment page`, and does not email a Stripe Checkout URL.
57. AP email attachment behavior requires the current browser-rendered Summary/Invoice PDF payload. If the rendered PDF cannot be generated, the email action should return a clear preparation error instead of silently attaching an older generated fallback artifact. Copy-link flow does not require an attachment.
58. AP payment links launch hosted ACH from the locked invoice/payment-due surface, omit Customer attachment/future-save/redisplay settings so Stripe collects payer contact email, and write `achPaymentSource=ap_payment_link` plus `achPaymentVisibilityScope=order_only`.
59. AP-link ACH Customer/session creation happens only after the latest order is confirmed locked and unpaid; missing, unlocked, or already-paid orders fail before Stripe side effects.
60. After AP opens the link and a Stripe Checkout Session is created, Dashboard/project copy may say Accounts Payable checkout has started; only after Checkout completion or ACH pending/processing Stripe evidence should copy say ACH payment is processing with Stripe.
61. AP-link ACH bank evidence stays on `PORTAL_ORDERS` and does not create a Dashboard Payment Methods row.
62. No full bank account numbers, routing numbers, hosted verification URLs, or microdeposit values are stored in Sheets, Apps Script logs, browser state, or repo files.
63. ACH payment Checkout email policy: normal owner and AP/order-only ACH payment sessions do not pass `customer` or `customer_email` by default; Stripe collects payer contact email in Checkout. Dashboard bank setup remains the saved-bank readiness path.

## ACH Event Smokes

For each event below, confirm `PORTAL_STRIPE_EVENTS` has one row per event ID and `PORTAL_ORDERS` reflects the expected state:

- `checkout.session.completed`: order placed, ACH pending, production policy applied.
- Immediate Checkout success return before async payment finality: `reconcile_checkout_return` locks the order pending/not paid and records safe ACH fields only after ACH evidence is present.
- Stale `checkout.session.completed`: no regression when the order is already paid, failed, disputed, team-hold, in production, or closed.
- `checkout.session.async_payment_succeeded`: paid, production authorized, failure fields cleared.
- `checkout.session.async_payment_failed`: failed/action-needed, retry available, team review if production was already authorized.
- `payment_intent.processing`: ACH processing, not paid.
- Stale `payment_intent.processing`: no regression when the order is already paid, failed, disputed, team-hold, in production, or closed.
- `payment_intent.succeeded`: paid and production authorized.
- `payment_intent.payment_failed` or `charge.failed`: failed/action-needed, with unsafe saved-bank default blocked for hard bank/mandate/verification failures.
- `charge.updated`: expected debit date and safe bank summary fields updated when available.
- `charge.dispute.created`: failed/team review, no silent retry, saved bank marked unusable.
- `setup_intent.succeeded`: saved bank summary stored.
- `setup_intent.setup_failed`: setup failed with retry path; if exactly one matching `dashboard_saved` ACH row can be identified by safe setup/payment method/customer/account linkage, that row moves to failed/unavailable and is not default-eligible.
- AP-link payment events: order-level ACH fields update, but `PORTAL_ACCOUNTS.achPaymentMethodsJson` is not expanded with a dashboard-visible bank.
- PaymentIntent or SetupIntent `requires_action` with `next_action.verify_with_microdeposits`: verification status shown as microdeposit pending; no microdeposit values stored.
- Dashboard microdeposit verification handoff: `getAchMicrodepositVerificationLink` returns a Stripe-hosted verification URL only when ACH payment/setup evidence is present, the clicked pending bank matches the authorized account/order context, and Stripe exposes a hosted verification URL. If that URL is unavailable in `STRIPE_MODE=test`, the server-only fallback may complete official Stripe test verification and return refreshed safe account/order state. A bare PaymentMethod ID is not enough for the dashboard to render the Verify with Stripe action.
- Tokenized Dashboard microdeposit verification handoff: `getAchMicrodepositVerificationLink({ token })` accepts a valid job dashboard token but rejects invalid or cross-account token context.

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
