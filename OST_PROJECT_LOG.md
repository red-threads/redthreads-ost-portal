# OST Project Log

## 2026-04-29 — Stripe Card Checkout MVP + Branded Portal Return

**Status:** Functionally validated, committed, pushed, and deployed.

**Deployment:** Stable Apps Script deployment updated in place through version `@766`.

**Checkpoint Summary:** Completed the Stripe card checkout MVP hardening tranche and branded portal return path.

Validated behavior:

- Credit/debit card checkout succeeds in Stripe test mode.
- Paid webhook finalizes the active order only.
- Paid card order sets `paymentState = paid`, `orderState = ready_for_production`, `productionAuthorizationState = authorized`, and `portalLockState = locked`.
- Paid invoice displays the charged card total correctly.
- Durable charged-total ledger fields exist and reconcile to Stripe `amount_total`.
- Abandoned card checkout remains editable and retryable.
- A newer checkout attempt supersedes older unpaid attempts.
- Stale/superseded webhook protection exists.
- Stale opener tab hydrates forward after payment.
- Save-after-payment from a stale tab is blocked safely and refreshes to the locked invoice.
- Paid hard reload opens the Invoice/Summary tab.
- Successful Stripe return opens the branded `redthreads.com/portal` URL and lands on the locked paid invoice.
- The final Squarespace wrapper uses direct iframe token/query passthrough.
- ACH/bank-transfer is hidden from MVP client-facing payment surfaces while backend ACH code remains preserved for future hardening.

Final validated wrapper behavior:

- `https://www.redthreads.com/portal` loads cleanly.
- `https://www.redthreads.com/portal?t=<token>` loads a tokenized project cleanly.
- Stripe success return uses `https://www.redthreads.com/portal?t=<token>&checkoutResult=success&stripeSessionId=<session_id>`.
- The iframe receives `t`, `checkoutResult`, and `stripeSessionId` through the iframe `src` query string.
- No `postMessage` token bridge is required for the current production wrapper.
- No visible wrapper loading overlay is used.

Deferred known issues:

- ACH asynchronous lifecycle is not hardened and remains hidden for MVP.
- Stripe discount presentation still nets discounts into supported positive line items instead of true separate negative line items.
- ACH can be re-enabled only after a dedicated async pending/succeeded/failed lifecycle tranche.
- Discount presentation should be handled in a separate Stripe presentation investigation.

Recommended next tranche:

- Do not start immediately unless explicitly requested.
- Recommended next tranche is either Stripe discount presentation refinement or ACH async lifecycle design if ACH is needed later.

## 2026-04-29 — Stripe Checkout Presentation Cleanup + Paid Message Idempotency

**Status:** Functionally validated, committed, pushed, and deployed.

**Deployment:** Stable Apps Script deployment `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` updated in place through version `@773`.

**Checkpoint Summary:** Completed the final Stripe checkout presentation hardening pass and duplicate paid-order system-message idempotency fix.

This checkpoint follows the earlier Stripe Card Checkout MVP + Branded Portal Return tranche and finalizes the hosted Stripe Checkout client-facing presentation for the MVP card-payment path.

Validated behavior:

- Stripe card payment succeeds.
- Branded redirect returns correctly to `redthreads.com/portal?t=<token>`.
- Portal opens into the locked paid invoice state.
- `EXPORT_LOG` shows `portalLockState = locked`, `currentOrderState = ready_for_production`, `currentPaymentState = paid`, `currentProductionAuthorizationState = authorized`, and `currentPaymentMethod = card`.
- `PORTAL_ORDERS` shows `portalLockState = locked`, `orderState = ready_for_production`, `paymentState = paid`, `productionAuthorizationState = authorized`, `stripeSessionId` populated, `stripePaymentIntentId` populated, `paidAt` populated, `authorizedToProduceAt` populated, and `lockedAt` populated.
- Charged ledger reconciles: `amountGrandTotal = 1837.09`, `amountCardFee = 55.11`, `amountChargedTax = 107.11`, `amountChargedTotal = 1892.20`, and `stripeAmountTotalCents = 189220`.
- Duplicate order-placed system message is fixed: `portalStateJson.messageLog`, `submittedStateJson.messageLog`, and `chatLogJson` each have one order-placed message.

Stripe Checkout presentation finalized:

- Hosted Stripe Checkout uses a flat grouped layout.
- SKU/product line names start with print job name and compact decoration setup.
- SKU/product descriptions include color, full product name, size quantities, and total quantity.
- Discounts are allocated into SKU/product lines first.
- Discount is shown in the relevant SKU/product line header.
- Add-ons and rush charges remain separate readable rows.
- Michigan Sales Tax is shown as its own line.
- Bank/ACH is hidden from the card checkout path.
- No `$0.00 Discount Applied` row is shown.
- No negative Stripe line items or coupon architecture were introduced.

Idempotency fix:

- Added semantic dedupe for `Order placed successfully on ...` system messages.
- Repeated checkout/webhook completion paths no longer create duplicate durable order-placed messages.
- Existing message dedupe no longer depends on exact timestamp text for this system event.

Confirmed unchanged:

- payment math
- tax authority
- card fee calculation
- webhook lifecycle state transitions
- charged-total ledger fields
- `snapshotJson` contract
- `EXPORT_LOG` schema
- `PORTAL_ORDERS` schema
- ACH backend code
- branded wrapper behavior

Deferred:

- ACH asynchronous lifecycle remains hidden and not hardened for MVP.
- True Stripe-native coupon/discount architecture is deferred.
- Any future re-enable of ACH requires a dedicated async pending/succeeded/failed lifecycle tranche.

Recommended next direction:

- Close Stripe hardening for MVP card checkout.
- Do not continue payment work unless a new issue emerges from production smoke testing.
