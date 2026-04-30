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
