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
7. Public wrapper loads and forwards `t`, `checkoutResult`, `setupResult`, and `stripeSessionId`.
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
18. Saved bank appears in Dashboard and ACH checkout copy.
19. Replayed webhook event ID does not duplicate side effects, including near-simultaneous duplicate deliveries that contend for the Apps Script webhook lock.
20. Stale tab cannot overwrite paid, failed, locked, or superseded state.
21. No full bank account numbers, routing numbers, or microdeposit values are stored in Sheets, Apps Script logs, browser state, or repo files.

## ACH Event Smokes

For each event below, confirm `PORTAL_STRIPE_EVENTS` has one row per event ID and `PORTAL_ORDERS` reflects the expected state:

- `checkout.session.completed`: order placed, ACH pending, production policy applied.
- `checkout.session.async_payment_succeeded`: paid, production authorized, failure fields cleared.
- `checkout.session.async_payment_failed`: failed/action-needed, retry available, team review if production was already authorized.
- `payment_intent.processing`: ACH processing, not paid.
- `payment_intent.succeeded`: paid and production authorized.
- `payment_intent.payment_failed` or `charge.failed`: failed/action-needed.
- `charge.updated`: expected debit date and safe bank summary fields updated when available.
- `charge.dispute.created`: failed/team review, no silent retry.
- `setup_intent.succeeded`: saved bank summary stored.
- `setup_intent.setup_failed`: setup failed with retry path.

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

