# ACH Stripe Portal Architecture

Status: implementation notes for ACH V1. This document describes repo behavior and does not contain live tokens, customer data, raw webhook payloads, or secrets.

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

`achPaymentMethodsJson` is an array of safe records containing Stripe IDs, bank name, last4, holder/type metadata, verification/status metadata, timestamps, source, and visibility scope.

Saved-bank scope rules:

- `source=dashboard_setup` and `visibilityScope=dashboard_saved` are visible in Dashboard Payment Methods and default-eligible when usable.
- `source=order_checkout`, `source=checkout_payment`, `source=ap_payment_link`, or unknown legacy records are order-only/hidden unless an existing dashboard-saved method with the same Stripe PaymentMethod ID is being updated.
- Safe linkage metadata may include `linkedOrderId`, `linkedCheckoutAttemptId`, and `linkedBy`. It must not include bank routing/account numbers, bank tokens, raw Financial Connections payloads, hosted verification URLs, or microdeposit values.

`PORTAL_ORDERS` stores ACH order metadata:

- `achPaymentMethodId`
- `achBankName`
- `achLast4`
- `achMandateId`
- `achFinancialConnectionsAccountId`
- `achVerificationStatus`
- `achVerificationFlow`
- `achPaymentSource`
- `achPaymentVisibilityScope`
- `stripeAchCustomerId`
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

Order-scoped AP payment links use an ephemeral/order-scoped Stripe Customer and do not write that Customer ID to `PORTAL_ACCOUNTS`. This prevents Accounts Payable bank details from becoming dashboard-visible saved banks.

## ACH Payment Checkout

Active ACH payment uses hosted Checkout:

- `mode=payment`
- `customer=<stripeCustomerId>`
- `payment_method_types[0]=us_bank_account`
- `payment_method_options[us_bank_account][verification_method]=automatic` by default
- Financial Connections permission `payment_method`
- `payment_intent_data[setup_future_usage]=off_session` by default
- Existing token, order, checkout attempt, fulfillment, and amount metadata

Saved bank reuse is hosted-Checkout-mediated in V1. The portal shows dashboard-saved bank summaries, but Stripe Checkout controls saved or new bank selection.

ACH payment sessions for normal portal account checkout include `saved_payment_method_options[allow_redisplay_filters]` for `unspecified` and `always` so dashboard-saved verified Customer bank accounts can redisplay in Checkout. When normal ACH checkout is configured to save for future use, the session also sets `payment_method_data[allow_redisplay]=always` for newly created bank PaymentMethods. Portal default-bank fields are reserved for usable verified/active `dashboard_saved` ACH methods; pending, failed, blocked, removed, order-only, AP-link, or microdeposit-required methods are not treated as the default checkout bank.

### ACH Pre-Checkout Decision Step

When a client selects ACH Bank Payment in the order modal, the first Place Order action opens a portal decision step instead of immediately creating a Stripe Checkout Session.

Lane 1, Pay now with ACH:

- Shows only usable `dashboard_saved` bank summaries as selectable preferences.
- Pending, failed, blocked, removed, hidden, order-only, and AP-link banks are not selectable.
- Pending dashboard setup banks can be shown as verification-pending status notes.
- The selected `preferredAchPaymentMethodId` and `achCheckoutIntent` are validated server-side before Checkout creation.
- The validated preference is written only to safe Checkout Session / PaymentIntent metadata and order draft context.
- Before normal non-AP Checkout, the server makes a non-blocking best-effort update to the selected dashboard-saved Stripe PaymentMethod with `allow_redisplay=always` plus safe billing name/email, so eligible saved banks have the best chance to redisplay in Checkout.
- Stripe Checkout remains the final bank confirmation, mandate, and payment-initiation surface; the portal does not claim it can force or visibly preselect a specific saved bank.

Lane 2, Send ACH payment link to Accounts Payable:

- Prepares and locks an awaiting-payment ACH order before returning or emailing the AP link.
- Payment remains `not_started`, production remains `not_authorized`, and the portal is locked to avoid stale editable duplicate orders.
- The AP link is a Red Threads portal URL, not a Stripe Checkout URL.
- Email content includes safe order reference, amount due, optional purchaser note, and AP-only bank-storage copy.
- Invoice PDF attachment is best effort: when the generated invoice artifact can be attached safely, it is attached; otherwise the AP link and safe summary remain the V1 deliverable.

AP payment links use:

- Public route: `/portal?t=<token>&summary=1&payNow=ach&paymentOrigin=ap`
- Hosted Checkout only after AP opens the public portal order link and starts payment.
- `metadata[paymentOrigin]=ap_payment_link`
- `PORTAL_ORDERS.achPaymentSource=ap_payment_link`
- `PORTAL_ORDERS.achPaymentVisibilityScope=order_only`
- No `payment_intent_data[setup_future_usage]`
- No saved-payment redisplay filters
- No account-level ACH saved-bank creation
- Order-scoped Stripe Customer preparation happens only after the server confirms the latest order exists, is locked, and is not already paid.

## Dashboard Bank Setup

Dashboard Account Settings can start hosted bank setup through `createAchSetupSession`:

- `mode=setup`
- `customer=<stripeCustomerId>`
- `payment_method_types[0]=us_bank_account`
- Financial Connections permission `payment_method`
- Return parameters: `dashboard=1`, `setupResult`, `stripeSessionId`, and either `accountAccessToken` or `accountId`

Account dashboard links are intentionally no-password bearer links for this V1 internal testing surface. Generated links should prefer `accountAccessToken`; raw `accountId` links are accepted for owner-requested compatibility. Treat both as sensitive access URLs and do not commit live account dashboard URLs.

Tokenized project dashboard links, such as `?t=<job-token>&dashboard=1`, are also treated as bearer access for that token's resolved account. The server permits ACH setup only when the token resolves through `EXPORT_LOG`, resolves to the same persisted `PORTAL_ACCOUNTS` account, and can build non-empty public portal `success_url` and `cancel_url` values before calling Stripe.

The repo and live Squarespace wrappers forward `setupResult` and account-dashboard route parameters into the Apps Script iframe.

If Stripe falls back to microdeposit verification, Dashboard Payment Methods can request a transient Stripe-hosted verification handoff through `getAchMicrodepositVerificationLink`. The server retrieves the relevant PaymentIntent or SetupIntent, requires ACH evidence, returns the hosted verification URL only to the browser response, and never stores the URL, routing/account numbers, or microdeposit values in Sheets or logs.

Dashboard Payment Methods lists only dashboard-saved records. Multiple dashboard-saved banks can be shown with bank display name, last4, verification/status, default badge, Verify with Stripe for pending microdeposit setup, and Set Default for usable non-default banks. The Add Bank action is a separate card/action, not a duplicate representation of the current bank. Hidden/order-only/AP banks do not appear in the Dashboard list.

Stripe setup returns must land on a canonical account dashboard route, preferably `https://www.redthreads.com/portal?dashboard=1&accountAccessToken=<account-link-token>`, plus one-time `setupResult` and `stripeSessionId` parameters. Setup return URLs should not preserve stale project `t` parameters once an account dashboard bearer route is available, because that can cause the client to hydrate the wrong dashboard context.

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
