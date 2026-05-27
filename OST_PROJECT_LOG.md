# OST Project Log

Canonical project memory for the Red Threads OST Portal. This file records durable architecture context, repo-state alignment, and follow-up risks so agents do not rely on scattered chat memory.

## 2026-05-27 - Build Alignment Reset

Task class: docs/tooling, shared-agent visibility, repo workflow hardening, build alignment, context reset.

Repo-verified facts:
- Repository: `red-threads/redthreads-ost-portal`.
- Local path: `/Users/Josiah/Documents/GitHub/redthreads-ost-portal`.
- Runtime root: `apps-script/src/`.
- Current tracked runtime files: `Code.js`, `Index.html`, `appsscript.json`, `.clasp.json`.
- Current tracked portal is a V2 Apps Script estimate renderer backed by `EXPORT_LOG`.
- `Code.js` contains the current Portal DB Sheet ID as a hardcoded required sheet ID.
- `.clasp.json` contains script ID `1C9ohEZC8rbGMWVfvyW_jzWjzt8AZAdrS8Idy8kLbi2O7VZ6VoPmQ0cp9`.

Prompt/historical facts to preserve until repo-verification catches up:
- Stable Apps Script deployment ID is expected to be `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw`.
- Stable public Apps Script URL is expected to be `https://script.google.com/macros/s/AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw/exec`.
- Public branded wrapper URL is `https://www.redthreads.com/portal`.
- Historical calculator sheet ID: `1STzkJjn5WRoBqa5H1KdxAbn4-JCab9DCX4FuZt5HImc`.
- Historical Make scenario: `4062378`.

Current architecture memory:
- V2 snapshot contract is locked.
- Calculator remains pricing authority.
- Portal reads immutable `snapshotJson`; it must not recompute pricing authority.
- Direct token access and authenticated shell/dashboard access are both permanent in the intended architecture.
- Dashboard should load metadata only; project load is where snapshot parsing belongs.
- Hosted Stripe Checkout is the active MVP card payment path in the fuller architecture.
- Cloud Run is the Stripe webhook trust boundary in the fuller architecture.
- PORTAL_ORDERS and PORTAL_ACCOUNTS are durable operational layers in the fuller architecture.
- ACH is deferred/hidden unless explicitly re-enabled.
- Team/admin controls must not be broadened without explicit scope.
- Lifecycle fixture baselines are required before lifecycle deletion/refactor work.

Open alignment risks:
- Current tracked runtime does not yet show the fuller dashboard/order/Stripe lifecycle architecture named in the prompt.
- `TaxForm3372Manifest.html` is not present in tracked runtime.
- Current `.clasp.json` binding cannot verify deployments from this environment.
- Current `Index.html` contains ACH promo copy; treat as runtime follow-up, not a docs/tooling edit.
- Snapshot schema allows zero print jobs while docs/prompt say supported V2 family is 1-4 PrintJobs.
