# ACH Script Properties

Status: configuration reference only. Do not write secret values in code, docs, logs, commits, or chat transcripts.

## Existing Stripe Properties

| Property | Required | Notes |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key for server-side Checkout, Customer, PaymentMethod, PaymentIntent, SetupIntent, and Charge calls. |
| `STRIPE_PUBLISHABLE_KEY` | Yes | Existing client-facing Stripe publishable key. |
| `STRIPE_WEBHOOK_SECRET` | Yes if used by forwarder | Stripe webhook signing secret used by the trusted forwarder boundary. |
| `STRIPE_WEBHOOK_FORWARD_SHARED_SECRET` | Yes | Shared secret required by Apps Script for forwarded webhook payloads. |
| `STRIPE_MODE` | Yes | `test` or `live`. |
| `STRIPE_PRICE_CURRENCY` | Yes | Defaults to `USD` in code if unset. |
| `STRIPE_RETURN_URL` | Yes for hosted return consistency | Base portal return URL used by hosted Checkout. |

## ACH Properties

| Property | Default | Notes |
| --- | --- | --- |
| `STRIPE_ACH_ENABLED` | `false` | Controls ACH visibility and server-side ACH checkout/setup availability. Keep false until smoke tests pass. |
| `STRIPE_ACH_VERIFICATION_METHOD` | `automatic` | Supported values: `automatic`, `instant`, `microdeposits`. V1 default is automatic. |
| `STRIPE_ACH_FINANCIAL_CONNECTIONS_PERMISSIONS` | `payment_method` | V1 only honors `payment_method`. Balances, ownership, and transaction permissions are intentionally ignored. |
| `STRIPE_ACH_SAVE_FOR_FUTURE` | `true` | Applies only to explicit Customer-attached ACH payment Checkout. Default ACH payment Checkout is Customer-free so Stripe can collect editable payer email; Dashboard setup remains the saved-bank path. |
| `STRIPE_ACH_REQUIRE_CUSTOMER` | `true` | Applies only when an explicit ACH payment Checkout path opts into Customer attachment. Dashboard ACH setup still requires the portal account Customer. |
| `STRIPE_ACH_DEFAULT_PENDING_PRODUCTION_APPROVED` | `false` | Default account-level value for new portal accounts. Keep false unless deliberately piloting approved-account behavior. |

## Stripe Dashboard Actions

- Enable ACH Direct Debit in the intended Stripe mode.
- Confirm hosted Checkout is allowed to use `us_bank_account`.
- Confirm Financial Connections is available for ACH instant verification and microdeposit fallback.
- Confirm Stripe emails are configured for mandate and microdeposit flows.
- Subscribe the trusted Cloud Run webhook forwarder to the ACH V1 event set documented in `docs/ACH_SMOKE_TEST_PLAN.md`.
- Keep test and live mode webhook endpoints and secrets separated.

## Squarespace Wrapper Action

After Apps Script deployment, manually update the production Squarespace `/portal` code block from `web/squarespace-portal-code-block.html` so `setupResult` is forwarded into the iframe and cleaned from the parent URL after the portal consumes it.
