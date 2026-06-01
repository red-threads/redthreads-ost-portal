# ACH Stripe Portal Architecture

Status: local implementation notes for ACH V1. This document describes repo behavior before deployment. It does not contain live tokens, customer data, raw webhook payloads, or secrets.

## Boundaries

- `snapshotJson` remains immutable and contract version `2.0.0` keeps the top-level `{ meta, printJobs }` shape.
- EXPORT_LOG token lookup remains Column A only.
- Pricing authority remains the upstream calculator.
- ACH bank collection, mandate acceptance, verification, and saved bank selection are Stripe-hosted.
- The portal never collects or stores full bank account numbers, routing numbers, bank tokens, microdeposit values, or raw secret client data.
- ACH visibility is gated by `STRIPE_ACH_ENABLED`. The safe default is hidden.

## Sheets

`PORTAL_ACCOUNTS` stores Stripe Customer and safe saved-bank summaries:

- `stripeCustomerId`
- `achPaymentMethodsJson`
- `defaultAchPaymentMethodId`
- `defaultAchBankName`
- `defaultAchLast4`
- `defaultAchVerificationStatus`
- `defaultAchMandateId`
- `defaultAchFinancialConnectionsAccountId`
- `achSetupIntentId`
- `achSetupSessionId`
- `achSetupStatus`
- `achSetupLastUpdatedAt`
- `achPendingProductionApproved`
- `achPendingProductionApprovedAt`
- `achPendingProductionApprovedBy`
- `achPendingProductionApprovalNotes`

`achPaymentMethodsJson` is an array of safe records containing Stripe IDs, bank name, last4, holder/type metadata, verification/status metadata, timestamps, and source.

`PORTAL_ORDERS` stores ACH order metadata:

- `achPaymentMethodId`
- `achBankName`
- `achLast4`
- `achMandateId`
- `achFinancialConnectionsAccountId`
- `achVerificationStatus`
- `achVerificationFlow`
- `achExpectedDebitDate`
- `achFailureCode`
- `achFailureMessage`
- `achPendingProductionApprovedAtOrder`
- `stripeLatestChargeId`
- `stripeLatestEventId`
- `stripeLatestEventType`
- `stripeLatestEventAt`

`PORTAL_STRIPE_EVENTS` stores webhook idempotency and redacted audit data:

- `stripeEventId`
- `eventType`
- `objectId`
- `paymentIntentId`
- `setupIntentId`
- `checkoutSessionId`
- `chargeId`
- `orderId`
- `checkoutAttemptId`
- `token`
- `accountId`
- `receivedAt`
- `processedAt`
- `processingStatus`
- `errorMessage`
- `rawEventJsonRedacted`

## Stripe Customer Model

ACH V1 uses Stripe Customers v1. The Apps Script runtime creates or retrieves a Customer for the portal account, then stores only the returned `cus_...` ID on `PORTAL_ACCOUNTS`.

Customer metadata is limited to portal identifiers:

- `accountId`
- `orgId`
- `orgName`
- `source=red_threads_portal`

ACH payment Checkout Sessions require a Customer. Card checkout preserves the existing behavior.

## ACH Payment Checkout

Active ACH payment uses hosted Checkout:

- `mode=payment`
- `customer=<stripeCustomerId>`
- `payment_method_types[0]=us_bank_account`
- `payment_method_options[us_bank_account][verification_method]=automatic` by default
- Financial Connections permission `payment_method`
- `payment_intent_data[setup_future_usage]=off_session` by default
- Existing token, order, checkout attempt, fulfillment, and amount metadata

Saved bank reuse is hosted-Checkout-mediated in V1. The portal shows the saved bank summary, but Stripe Checkout controls saved or new bank selection.
ACH payment sessions include `saved_payment_method_options[allow_redisplay_filters]` for `unspecified` and `always` so saved verified Customer bank accounts can redisplay in Checkout. Portal default-bank fields are reserved for usable verified/active ACH methods; pending, failed, blocked, removed, or microdeposit-required methods remain in the safe saved-method list but are not treated as the default checkout bank.

## Dashboard Bank Setup

Dashboard Account Settings can start hosted bank setup through `createAchSetupSession`:

- `mode=setup`
- `customer=<stripeCustomerId>`
- `payment_method_types[0]=us_bank_account`
- Financial Connections permission `payment_method`
- Return parameters: `dashboard=1`, `setupResult`, `stripeSessionId`, and either `accountAccessToken` or `accountId`

Account dashboard links are intentionally no-password bearer links for this V1 internal testing surface. Generated links should prefer `accountAccessToken`; raw `accountId` links are accepted for owner-requested compatibility. Treat both as sensitive access URLs and do not commit live account dashboard URLs.

The repo Squarespace wrapper forwards `setupResult` and account-dashboard route parameters into the Apps Script iframe. The live Squarespace code block must be refreshed from the repo wrapper after this change before public account-dashboard links work end to end.

If Stripe falls back to microdeposit verification, Dashboard Payment Methods can request a transient Stripe-hosted verification handoff through `getAchMicrodepositVerificationLink`. The server retrieves the relevant PaymentIntent or SetupIntent, requires ACH evidence, returns the hosted verification URL only to the browser response, and never stores the URL, routing/account numbers, or microdeposit values in Sheets or logs.

## Production Policy

Default policy:

- ACH initiated or processing places and locks the order.
- Payment state is pending, not paid.
- Production is not authorized until Stripe confirms payment success.

Approved-account exception:

- Team/admin can set `achPendingProductionApproved=true`.
- ACH initiated or processing authorizes production while the payment settles.
- Clients cannot approve themselves.
- If ACH later fails, production authorization is not silently rolled backward. The order becomes action-needed and team review is surfaced.

## Webhook Processing

Forwarded Stripe events are recorded in `PORTAL_STRIPE_EVENTS` before side effects. Processed event IDs are skipped on replay.

Handled event families:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`
- `payment_intent.processing`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.updated`
- `charge.succeeded`
- `charge.failed`
- `charge.dispute.created`
- `payment_method.automatically_updated`
- `setup_intent.succeeded`
- `setup_intent.setup_failed`

Raw Stripe event JSON is redacted before storage. Secret, account, routing, microdeposit, and Financial Connections raw values are removed or replaced with placeholders.
