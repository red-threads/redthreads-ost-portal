# Current Build State

Last aligned: 2026-05-27.

## Repo Verified

- Repository: `red-threads/redthreads-ost-portal`.
- Local path: `/Users/Josiah/Documents/GitHub/redthreads-ost-portal`.
- Runtime root: `apps-script/src/`.
- Tracked runtime files: `Code.js`, `Index.html`, `TaxForm3372Manifest.html`, `appsscript.json`, `.clasp.json`.
- Current tracked app has been pulled from the live Apps Script project and includes the fuller portal architecture: auth shell, dashboard/order lifecycle surfaces, Stripe checkout routing, Team Mode lanes, and tax-form manifest support.
- Portal DB Sheet ID appears in `Code.js`: `16KrxpEv8s-U5gjLX-DZK25GbrnkeKbjgInngie8Ce_c`.
- `.clasp.json` now points to the live Apps Script project ID verified in Apps Script: `1zv9lbls_bohme0vDA8EZg4G0dyFrsuv3hHO0NOAijSw9imYYNkqMbkKU`.
- `docs/EXPORT_LOG_WIDE_SCHEMA.md` tracks the locked EXPORT_LOG column order.
- `package.json` exposes `npm run validate`, `npm run validate:runtime`, and `npm run validate:binding`.

## Prompt/Historical

- Expected stable Apps Script deployment ID: `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw`.
- Expected stable public Apps Script URL: `https://script.google.com/macros/s/AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw/exec`.
- Public branded wrapper URL: `https://www.redthreads.com/portal`.
- Historical calculator sheet ID: `1STzkJjn5WRoBqa5H1KdxAbn4-JCab9DCX4FuZt5HImc`.
- Historical Make scenario: `4062378`.
- Fuller intended architecture includes PORTAL_ORDERS, PORTAL_ACCOUNTS, USERS, USER_SESSIONS, hosted Stripe Checkout, Cloud Run webhook forwarding, Gmail notifications, QuickBooks, and Pipedrive.

## Live Apps Script Alignment

- Browser-verified Apps Script project URL: `https://script.google.com/u/0/home/projects/1zv9lbls_bohme0vDA8EZg4G0dyFrsuv3hHO0NOAijSw9imYYNkqMbkKU/edit`.
- `clasp pull` against the verified live project succeeded on 2026-05-27 and pulled `appsscript.json`, `Code.js`, `Index.html`, and `TaxForm3372Manifest.html`.
- After the binding repair, `clasp deployments` and `clasp versions` can read the live project.
- Existing stable deployment ID is present: `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw`, currently observed at version 825, `Flatten PO submit loading card`.
- The previous `Requested entity was not found` blocker was traced to the stale local `.clasp.json` binding, not to the stable deployment ID itself.

## Blocked Or Unverified

- Apps Script push/version/deploy still must be re-run after the live-source alignment commit to confirm end-to-end deployment from this environment.
- Smoke testing of the stable public URL still needs to confirm the `DEV 1` badge is visible after deployment.
- The live-pulled server source had a checked-in Team Mode default credential; the repo copy now requires the Team Mode password to come from Apps Script Script Properties instead. Confirm that property before relying on Team Mode in production.

## Workflow

- Current preferred workflow is mainline-first for owner-directed docs/tooling, runtime edits, and Full ship requests.
- Branch/PR workflow is optional and should be used only when explicitly requested, required by repo protection, or appropriate for high-risk architecture/review work.
- GitHub source can update successfully, but Apps Script live deployment remains blocked from the current local clasp binding/account until access is repaired.

## Known Follow-Ups

- Current `Index.html` contains ACH promo copy, while project context says ACH is deferred/hidden unless explicitly re-enabled. Treat as runtime follow-up.
- `schemas/snapshot_v2_0_0.schema.json` allows `printJobs.minItems: 0`, while current project docs/prompt say the supported V2 family is 1-4 PrintJobs. Do not change the schema without a separate schema/contract correction task.
