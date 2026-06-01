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
rg -n "ACH_CLIENT_PAYMENT_ENABLED|STRIPE_ACH_|PORTAL_STRIPE_EVENTS|createAchSetupSession|adminSetAchPendingProductionApproval" apps-script/src docs testcases web
rg -n "routing_number|account_number|bank_account_token|client_secret|microdeposit" apps-script/src docs testcases web
```

The second command should show only redaction, safety, or documentation references, not persisted bank data.

## Manual Smoke Checklist

1. Existing card checkout launches and returns through the same stable deployment.
2. Existing card cancel/retry still works.
3. Existing PO path still works.
4. Existing check/cash manual payment path still works.
5. Dashboard loads with metadata-only project listing.
6. Token deep link loads exactly one EXPORT_LOG row.
7. Public wrapper loads and forwards `t`, `checkoutResult`, `setupResult`, `stripeSessionId`, `dashboard`, `accountId`, and `accountAccessToken`.
8. ACH remains hidden while `STRIPE_ACH_ENABLED` is false.
9. ACH first-time hosted Checkout launches when `STRIPE_ACH_ENABLED` is true.
10. ACH Checkout Session includes `customer` and `us_bank_account`.
11. ACH return says "Order placed - ACH payment initiated," not "Paid."
12. Normal ACH pending does not authorize production.
13. Approved-account ACH pending authorizes production.
14. ACH success marks payment paid and authorizes production.
15. ACH failure marks action needed and leaves retry payment available.
16. Dashboard Payment Methods Add Bank launches hosted setup.
17. Setup success stores a safe saved bank summary.
18. Saved verified bank appears in Dashboard and ACH checkout copy.
19. Direct account dashboard links load without password gate for `?dashboard=1&accountId=<account-id>` and `?dashboard=1&accountAccessToken=<account-access-token>`.
20. Stripe ACH setup success/cancel returns to the same account dashboard URL rather than the Apps Script iframe sandbox URL.
21. Tokenized dashboard links, such as `?t=<job-token>&dashboard=1`, can launch Dashboard ACH setup without requiring a separate dashboard login.
22. Dashboard ACH setup sessions are created only when server-built `success_url` and `cancel_url` are non-empty public portal URLs.
23. Tokenized dashboard ACH setup returns with `dashboard=1`, `setupResult`, `stripeSessionId`, and an account bearer context when available.
24. Pending/unverified ACH banks appear as verification pending in Dashboard but are not promoted as the default saved checkout bank.
25. ACH Checkout Session payload requests saved bank redisplay for Customer bank accounts with `allow_redisplay_filters` of `unspecified` and `always`.
26. Replayed webhook event ID does not duplicate side effects, including near-simultaneous duplicate deliveries that contend for the Apps Script webhook lock.
27. Stale tab cannot overwrite paid, failed, locked, or superseded state.
28. Stale ACH pending events, including late `checkout.session.completed` or `payment_intent.processing`, do not move paid, failed, disputed, team-hold, in-production, or closed orders backward.
29. Microdeposit-required ACH flows show bank verification pending/action-needed copy without storing microdeposit values.
30. Dashboard Payment Methods shows a pending microdeposit bank as an action and opens Stripe-hosted verification through `getAchMicrodepositVerificationLink`.
31. The hosted verification URL is returned only to the browser for immediate navigation and is not stored in Sheets, docs, logs, browser state, or committed files.
32. ACH dispute, late-return, mandate invalid, account closed, debit-not-authorized, and microdeposit timeout/exceeded failures mark unsafe saved banks unusable instead of leaving them as default active methods.
33. ACH cancel return lets the user retry ACH through Stripe-hosted instant verification/manual entry or choose another payment method.
34. ACH success return calls `reconcile_checkout_return` before URL cleanup and immediately shows locked pending-not-paid state if the webhook has not finalized yet.
35. ACH return reconciliation disables Save, Place Order, and payment controls while it is refreshing server state.
36. ACH pending-not-paid hydration is accepted as a post-checkout canonical state and routes the user to Summary/Invoice copy without waiting for a paid/finalized signal.
37. ACH cancel return reconciliation preserves locked/pending canonical state if the order had already been placed, otherwise leaves retry/alternate payment available.
38. No full bank account numbers, routing numbers, or microdeposit values are stored in Sheets, Apps Script logs, browser state, or repo files.

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
