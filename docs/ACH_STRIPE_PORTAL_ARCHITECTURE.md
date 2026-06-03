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

`achPaymentMethodsJson` is an array of safe records containing Stripe IDs, bank name, last4, holder/type metadata, verification/status metadata, timestamps, source, visibility scope, and row-level setup/payment linkage when needed for Stripe-hosted verification.

Saved-bank scope rules:

- `source=dashboard_setup` and `visibilityScope=dashboard_saved` are visible in Dashboard Payment Methods and default-eligible when usable.
- `source=order_checkout`, `source=checkout_payment`, `source=ap_payment_link`, or unknown legacy records are order-only/hidden unless an existing dashboard-saved method with the same Stripe PaymentMethod ID is being updated.
- Safe linkage metadata may include `linkedOrderId`, `linkedCheckoutAttemptId`, `linkedBy`, `setupIntentId`, `setupSessionId`, `paymentIntentId`, and `setupStatus`. It must not include bank routing/account numbers, bank tokens, raw Financial Connections payloads, hosted verification URLs, client secrets, or microdeposit values.

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

When a client selects ACH Bank Payment in the order modal, the first Place Order action opens a portal decision step instead of immediately creating a Stripe Checkout Session. The decision step explains payment path options, not a portal-side wallet selection.

Lane 1, Pay now with ACH:

- Uses generic copy: the payer will continue to hosted Stripe Checkout, where Stripe may show saved bank accounts, ask the payer to confirm a bank, or ask the payer to connect a bank before payment is initiated.
- Does not render bank names, last4, default-bank labels, or a saved-bank selector in the order modal.
- Does not require or send a UI-selected `preferredAchPaymentMethodId` from the current client experience.
- The server still accepts and validates `preferredAchPaymentMethodId` for backward compatibility and future internal callers, but the current UI treats Stripe as the final bank-selection surface.
- Normal non-AP Checkout still uses the portal account Stripe Customer, saved-payment redisplay filters, and future-save settings where allowed, so eligible saved banks have the best chance to redisplay in Checkout.
- Stripe Checkout remains the final bank confirmation, mandate, verification, and payment-initiation surface; the portal does not claim it can force or visibly preselect a specific saved bank.

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

If Stripe falls back to microdeposit verification, Dashboard Payment Methods can request a transient verification handoff through `getAchMicrodepositVerificationLink`. The client sends safe intent/session row identifiers for the clicked pending bank; a bare PaymentMethod ID is not enough to render the Verify with Stripe action. The server validates the authorized account context, retrieves the specific PaymentIntent or SetupIntent when possible, confirms the Stripe Customer/PaymentMethod matches the portal account row, and requires ACH evidence. When Stripe exposes a hosted verification URL, the runtime returns that URL only to the browser response for immediate navigation and never stores it. In `STRIPE_MODE=test` only, if Stripe does not expose a hosted URL but the same validated SetupIntent/PaymentIntent linkage is present, the runtime may complete verification server-side through Stripe's official `verify_microdeposits` endpoint using test-only amounts. Live mode never auto-verifies microdeposits. The portal never stores hosted verification URLs, routing/account numbers, client secrets, raw Stripe objects, or microdeposit values in Sheets or logs.

The top Dashboard summary renders one compact `ACH payment accounts` card, not one card per saved bank. The card body is limited to `Manage accounts` and acts as the single entry point to ACH management. It does not show readiness paragraphs, ready-state ACH bullets, bank counts, bank names, last4, or separate Manage/Add buttons.

`Manage ACH banks` opens a dashboard modal with safe details for dashboard-saved records only. The modal can show bank display name, last4, verification/status, default badge, Verify with Stripe for pending microdeposit setup, and Set Default for usable non-default banks. Pending rows with enough safe intent/session linkage expose Verify with Stripe; older rows with only a PaymentMethod ID show verification-unavailable guidance and should be re-added or reviewed by Red Threads. Verification errors stay inside the modal so X, Done, backdrop click, and Escape remain usable. When server-side test verification succeeds, the modal refreshes in place and the bank moves from Needs action to Ready. Its copy states that Stripe may still ask the payer to confirm, choose, or connect a bank during Checkout. Hidden/order-only/AP banks do not appear in Dashboard Payment Methods.

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
