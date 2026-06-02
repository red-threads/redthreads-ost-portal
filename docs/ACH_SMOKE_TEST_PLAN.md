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
10. ACH Checkout Session includes `customer` and `us_bank_account`.
11. ACH return says "Order placed - ACH payment initiated," not "Paid."
12. Normal ACH pending does not authorize production.
13. Approved-account ACH pending authorizes production.
14. ACH success marks payment paid and authorizes production.
15. ACH failure marks action needed and leaves retry payment available.
16. Dashboard Payment Methods Add Bank launches hosted setup.
17. Setup success stores a safe saved bank summary with `source=dashboard_setup` and `visibilityScope=dashboard_saved`.
18. Dashboard shows one `ACH Bank Payments` readiness card; bank names/last4 appear only inside Manage ACH banks, not in checkout copy.
19. Direct account dashboard links load without password gate for `?dashboard=1&accountId=<account-id>` and `?dashboard=1&accountAccessToken=<account-access-token>`.
20. Stripe ACH setup success/cancel returns to the same account dashboard URL rather than the Apps Script iframe sandbox URL.
21. Tokenized dashboard links, such as `?t=<job-token>&dashboard=1`, can launch Dashboard ACH setup without requiring a separate dashboard login.
22. Dashboard ACH setup sessions are created only when server-built `success_url` and `cancel_url` are non-empty public portal URLs, and the server accepts Stripe's literal `{CHECKOUT_SESSION_ID}` placeholder during validation.
23. Tokenized or logged-in session dashboard ACH setup returns with `dashboard=1`, `setupResult`, `stripeSessionId`, and an account bearer context when available.
24. Dashboard ACH setup success/cancel returns do not preserve stale project `t` parameters when `accountAccessToken` is available, and malformed duplicate dashboard/account query params are normalized back to one account dashboard route.
25. Login from public `/portal` replaces the parent URL with `?dashboard=1&accountAccessToken=<account-access-token>` after dashboard hydration.
26. Refreshing the account dashboard URL reloads the dashboard without returning to the login view.
27. Opening a project from the dashboard pushes `?t=<project-token>`, and browser Back/Forward reloads the matching dashboard/project iframe route after the live wrapper has been refreshed from the repo copy.
28. Pending/unverified ACH banks produce an `ACH Bank Payments` readiness card with action-needed copy; Manage ACH banks shows the pending rows with Verify with Stripe, and the same PaymentMethod is not rendered twice in the top dashboard summary.
29. Pending/unverified ACH banks are not promoted as the default saved checkout bank.
30. ACH Checkout Session payload requests saved bank redisplay for normal Customer bank accounts with `allow_redisplay_filters` of `unspecified` and `always`.
31. Replayed webhook event ID does not duplicate side effects, including near-simultaneous duplicate deliveries that contend for the Apps Script webhook lock.
32. Stale tab cannot overwrite paid, failed, locked, or superseded state.
33. Stale ACH pending events, including late `checkout.session.completed` or `payment_intent.processing`, do not move paid, failed, disputed, team-hold, in-production, or closed orders backward.
34. Microdeposit-required ACH flows show bank verification pending/action-needed copy without storing microdeposit values.
35. Dashboard Payment Methods shows a pending microdeposit bank as an action and opens Stripe-hosted verification through `getAchMicrodepositVerificationLink`.
36. The hosted verification URL is returned only to the browser for immediate navigation and is not stored in Sheets, docs, logs, browser state, or committed files.
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
55. Copy ACH payment link from the decision step prepares/locks an awaiting-payment ACH order and copies `/portal?t=<token>&summary=1&payNow=ach&paymentOrigin=ap`, never a private Stripe Checkout URL.
56. Email ACH payment link validates an AP email address, prepares/locks an awaiting-payment ACH order, sends a Red Threads portal AP link with safe order summary copy, and does not email a Stripe Checkout URL.
57. AP email attachment behavior is best effort: if the invoice PDF artifact is available it can attach; if not, the AP link plus safe summary remains sufficient.
58. AP payment links launch hosted ACH from the locked invoice/payment-due surface, use an order-scoped Stripe Customer, omit future-save/redisplay settings, and write `achPaymentSource=ap_payment_link` plus `achPaymentVisibilityScope=order_only`.
59. AP-link ACH Customer/session creation happens only after the latest order is confirmed locked and unpaid; missing, unlocked, or already-paid orders fail before Stripe side effects.
60. AP-link ACH bank evidence stays on `PORTAL_ORDERS` and does not create a Dashboard Payment Methods row.
61. No full bank account numbers, routing numbers, hosted verification URLs, or microdeposit values are stored in Sheets, Apps Script logs, browser state, or repo files.
62. Normal saved-bank ACH Checkout hardening: normal Customer checkout still requests saved-payment redisplay, includes `payment_method_data[allow_redisplay]=always` when future save is enabled, and client copy remains truthful even if hosted Checkout renders generic bank-entry UI.

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
- `setup_intent.setup_failed`: setup failed with retry path.
- AP-link payment events: order-level ACH fields update, but `PORTAL_ACCOUNTS.achPaymentMethodsJson` is not expanded with a dashboard-visible bank.
- PaymentIntent or SetupIntent `requires_action` with `next_action.verify_with_microdeposits`: verification status shown as microdeposit pending; no microdeposit values stored.
- Dashboard microdeposit verification handoff: `getAchMicrodepositVerificationLink` returns a Stripe-hosted verification URL only when ACH payment/setup evidence is present.
- Tokenized Dashboard microdeposit verification handoff: `getAchMicrodepositVerificationLink({ token })` accepts a valid job dashboard token but rejects invalid or cross-account token context.

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
