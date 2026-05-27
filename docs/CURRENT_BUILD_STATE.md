# Current Build State

Last aligned: 2026-05-27.

## Repo Verified

- Repository: `red-threads/redthreads-ost-portal`.
- Local path: `/Users/Josiah/Documents/GitHub/redthreads-ost-portal`.
- Runtime root: `apps-script/src/`.
- Tracked runtime files: `Code.js`, `Index.html`, `appsscript.json`, `.clasp.json`.
- Current tracked app is a V2 Apps Script estimate portal that loads EXPORT_LOG rows by token and renders `snapshotJson`.
- Portal DB Sheet ID appears in `Code.js`: `16KrxpEv8s-U5gjLX-DZK25GbrnkeKbjgInngie8Ce_c`.
- `.clasp.json` contains script ID `1C9ohEZC8rbGMWVfvyW_jzWjzt8AZAdrS8Idy8kLbi2O7VZ6VoPmQ0cp9`.
- `docs/EXPORT_LOG_WIDE_SCHEMA.md` tracks the locked EXPORT_LOG column order.
- `package.json` exposes `npm run validate`.

## Prompt/Historical

- Expected stable Apps Script deployment ID: `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw`.
- Expected stable public Apps Script URL: `https://script.google.com/macros/s/AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw/exec`.
- Public branded wrapper URL: `https://www.redthreads.com/portal`.
- Historical calculator sheet ID: `1STzkJjn5WRoBqa5H1KdxAbn4-JCab9DCX4FuZt5HImc`.
- Historical Make scenario: `4062378`.
- Fuller intended architecture includes PORTAL_ORDERS, PORTAL_ACCOUNTS, USERS, USER_SESSIONS, hosted Stripe Checkout, Cloud Run webhook forwarding, Gmail notifications, QuickBooks, and Pipedrive.

## Blocked Or Unverified

- `clasp deployments` and `clasp versions` returned `Requested entity was not found` from the current local binding/account on 2026-05-27.
- `clasp push` for Dev Revision 1 also returned `Requested entity was not found` on 2026-05-27, so no Apps Script version/deploy was created from this environment.
- The fuller dashboard/order/Stripe/lifecycle architecture described in project context is not present in tracked runtime.
- `TaxForm3372Manifest.html` is referenced in project context but absent from tracked runtime.
- Named lifecycle helpers such as `buildPortalOrderSummary_`, `derivePortalLifecycle_`, and dashboard projection helpers are absent from tracked runtime.

## Known Follow-Ups

- Current `Index.html` contains ACH promo copy, while project context says ACH is deferred/hidden unless explicitly re-enabled. Treat as runtime follow-up.
- `schemas/snapshot_v2_0_0.schema.json` allows `printJobs.minItems: 0`, while current project docs/prompt say the supported V2 family is 1-4 PrintJobs. Do not change the schema without a separate schema/contract correction task.
