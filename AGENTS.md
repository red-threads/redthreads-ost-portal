# Red Threads Portal — Agent Operating Instructions

## Primary directive

This repo powers the Red Threads client portal, a Google Apps Script web app embedded inside the Red Threads website and backed by a bound Google Sheet database.

Do not treat this as a generic web app.

Every change must preserve:
- `snapshotJson` immutability
- tokenized direct project links
- authenticated dashboard access
- public Red Threads iframe wrapper access
- `EXPORT_LOG` / `PORTAL_ORDERS` compatibility
- existing Apps Script deployment workflow

## Current production web app

Stable web app URL:

```text
https://script.google.com/macros/s/AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw/exec
```

Stable deployment ID:

```text
AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw
```

Public wrapper URL:

```text
https://www.redthreads.com/portal
```

## Deployment rule

Always deploy by:

1. Pushing the most up-to-date local code with `clasp`.
2. Creating a new immutable Google Apps Script version.
3. Updating the existing stable deployment ID in place.

Never create a new deployment unless the project owner explicitly instructs it.

The stable deployment ID must remain:

```text
AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw
```

## Local project structure

Primary source files:
- `apps-script/src/Code.js`
- `apps-script/src/Index.html`
- `apps-script/src/appsscript.json`
- `apps-script/src/TaxForm3372Manifest.html`

Important folders:
- `assets/forms/`
- `bound-google-sheet/`
- `docs/`
- `schemas/`
- `testcases/`
- `tmp/`

Do not assume the repo root is the Apps Script project directory. Check the existing `.clasp.json` / project structure before running `clasp push`.

## Current architecture

Primary database:
- bound Google Sheet with `EXPORT_LOG`, `PORTAL_ORDERS`, account/user/session tabs

Core state model:
- `snapshotJson` is immutable source estimate payload.
- `portalStateJson` is mutable client/session state.
- `submittedStateJson` is immutable submitted/order state when applicable.
- `PORTAL_ORDERS` contains durable order/payment/production state.
- canonical lifecycle truth is derived by server lifecycle helpers and hydrated into client workflow context.

## Lifecycle authority

Canonical lifecycle/workflow fields are the authority for state behavior:

- `lifecycleState`
- `lifecycleStage`
- `editorMode`
- `saveAllowed`
- `orderAllowed`
- `summaryDocumentMode`
- `summaryControlsMode`
- `paymentDue`
- `paymentReceived`
- `productionCurrent`
- `productionComplete`
- `nextClientAction`
- `nextTeamAction`

Legacy/raw fields may be used as fallback evidence only:

- `portalState.isReadOnly`
- `purchaseOrderDraft`
- `portalLockState`
- `submittedStateJson`
- `paidAt`
- `poSubmittedAt`
- `orderState`
- `paymentState`

Do not let stale legacy fields override canonical lifecycle truth.

## Accepted lifecycle consumers

Accepted:
- Tranche 3A: dashboard status row
- Tranche 3A.1: production completion + locked Summary/Invoice presentation
- Tranche 3B: dashboard peek
- Tranche 3C/3C.1: Summary/Invoice document, controls, and timeline copy

Current / next:
- Tranche 3D: editor, Save, Place Order gating, dirty tracking

Not yet fully unified:
- checkout continuation
- PO continuation handler internals
- manual payment continuation handler internals
- team admin action permissions
- final legacy-code cleanup

## Testing discipline

Before browser testing, read:

- `docs/PORTAL_ACCESS_AND_SMOKE_TEST_SOP.md`
- `docs/LIFECYCLE_FIXTURES.md`

Do not:
- guess token formats
- brute-force project numbers as tokens
- assume `https://www.redthreads.com/portal` exposes the app DOM directly
- confuse public wrapper behavior with direct Apps Script token behavior
- change code to work around browser automation limitations

Classify test issues as:
- app regression
- test harness/navigation issue
- source row/order data issue
- iframe/wrapper access issue
- unrelated/defer

## Scope discipline

When working on a tranche:
- stay inside the declared tranche scope
- do not repair unrelated visual, pricing, tax, Stripe, PDF, email, or styling issues
- report unrelated findings as deferred defects
- do not delete legacy lifecycle code until migration completion and fixture parity are confirmed

## Standard instruction to follow before future work

Before coding or browser testing, read:

- `AGENTS.md`
- `docs/PORTAL_ACCESS_AND_SMOKE_TEST_SOP.md`
- `docs/LIFECYCLE_FIXTURES.md`

Use the fixture direct URLs from `docs/LIFECYCLE_FIXTURES.md`.

Do not guess token URLs.

Do not create new Apps Script deployments.

Always create a new Apps Script version and update the existing stable deployment ID in place.