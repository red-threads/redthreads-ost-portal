# Portal Access and Smoke Test SOP

## Purpose

This file defines how to access and smoke-test the Red Threads portal without rediscovering the app topology each time.

The portal can be accessed through multiple paths. Each path has different behavior.

## Stable deployment

Web app URL:

```text
https://script.google.com/macros/s/AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw/exec
```

Deployment ID:

```text
AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw
```

Public wrapper:

```text
https://www.redthreads.com/portal
```

## Deployment rule

Always:

1. Push the current local source.
2. Create a new Google Apps Script version.
3. Update the existing deployment ID in place.

Never create a new deployment unless explicitly instructed.

## Access paths

### 1. Public Red Threads wrapper

URL:

```text
https://www.redthreads.com/portal
```

Purpose:
- customer-facing login/dashboard wrapper
- public website route
- iframe-hosted portal experience

Important:
- The app is embedded.
- Browser automation may not see the inner app DOM directly from this wrapper.
- Do not treat wrapper DOM as the same thing as the portal app DOM.
- If testing logged-in dashboard behavior, make sure the browser session is authenticated first.

Use this path for:
- final customer-facing sanity checks
- dashboard wrapper behavior
- iframe embedding behavior

Do not use this path as the first choice for detailed project fixture testing.

---

### 2. Direct Apps Script base URL

URL:

```text
https://script.google.com/macros/s/AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw/exec
```

Purpose:
- direct app entry
- login shell or tokenized project rendering depending on query params

Important:
- Google Apps Script wraps user HTML inside nested iframes.
- In browser automation, the actual portal DOM may be inside:
  - `#sandboxFrame`
  - then nested `#userHtmlFrame`

Use this path for:
- direct deployment validation
- direct tokenized project testing
- bypassing public wrapper complexity

---

### 3. Direct tokenized project URL

Format:

```text
https://script.google.com/macros/s/AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw/exec?t=<token>
```

Purpose:
- direct project fixture testing
- validates token deep-link behavior
- bypasses login/dashboard

Important:
- deal/project numbers are not tokens.
- Do not guess URLs like `?t=1900`.
- Look up the fixture token from `EXPORT_LOG.token` or `docs/LIFECYCLE_FIXTURES.md`.

Use this path for:
- seven-fixture lifecycle smoke tests
- project editor behavior
- Summary/Invoice behavior
- Save/Place Order gating
- PO/manual/payment lifecycle views

---

### 4. Authenticated dashboard route

URL:

```text
https://www.redthreads.com/portal
```

Purpose:
- dashboard row/status/peek testing

Important:
- requires login
- dashboard row testing should use authenticated wrapper state
- if automation cannot interact with the iframe, use browser DevTools frame traversal rather than changing app code

Use this path for:
- dashboard status row smoke tests
- dashboard peek smoke tests
- customer-facing dashboard behavior

## Known iframe behavior

Public wrapper:
- the Red Threads page hosts the portal inside an iframe

Apps Script direct page:
- Google Apps Script may wrap app HTML in nested frames
- automation often needs to enter:
  - `#sandboxFrame`
  - then `#userHtmlFrame`

Do not classify iframe traversal trouble as an app regression unless the real user-facing browser also fails.

## Fixture matrix

The standard lifecycle fixture projects are:

| Project | Expected lifecycle |
|---|---|
| `1900` | fresh estimate / no action |
| `1916` | quantities entered / artwork pending |
| `1922` | ready to order |
| `1923` | PO draft invoice prepared / awaiting PO submission |
| `1925` | PO submitted unpaid / production active / payment due |
| `2003` | payment received / production active |
| `2004` | production complete |

Important:
- Project numbers are not tokens.
- Use the exact tokens in `docs/LIFECYCLE_FIXTURES.md`.
- Verify source row/order data before declaring an app bug.

## Smoke-test source data checks

For each fixture, inspect:

EXPORT_LOG:
- `token`
- `activeOrderId`
- `portalLockState`
- `currentOrderState`
- `currentPaymentState`
- `currentProductionAuthorizationState`
- `currentPaymentMethod`
- `teamWorkflowMode`
- `teamJobCompletionJson`
- `portalStateJson`
- `submittedStateJson`

PORTAL_ORDERS, when `activeOrderId` exists:
- `orderId`
- `orderState`
- `paymentMethodSelected`
- `paymentState`
- `productionAuthorizationState`
- `poNumber`
- `poSubmittedAt`
- `paidAt`
- `paymentReceivedManuallyAt`
- `authorizedToProduceAt`
- `lockedAt`
- `orderDraftJson`

## Standard seven-fixture expectations

### 1900 — fresh estimate

Expected:
- editor editable
- Save inactive on initial load
- Save active after real edit
- Place Order follows existing readiness/blocker behavior
- no invoice/payment/PO controls
- no false unsaved-change modal

### 1916 — quantities entered / artwork pending

Expected:
- editor editable
- artwork still pending
- Save active only after real edit
- Place Order reaches existing blocker stack
- no false unsaved-change modal

### 1922 — ready to order

Expected:
- editor editable
- stale `portalState.isReadOnly` must not lock it
- Save active only after real edit
- Place Order available
- no false unsaved-change modal

### 1923 — PO draft awaiting submission

Expected:
- estimate editor locked
- Save blocked
- normal Place Order blocked
- PO continuation available from Summary/Invoice only
- no payment-due implication
- no production-start implication

### 1925 — PO submitted unpaid / production active

Expected:
- estimate editor locked
- Save blocked
- normal Place Order blocked
- payment due visible through Summary/Invoice
- production active/current
- no PO draft language

### 2003 — payment received / production active

Expected:
- estimate editor locked
- Save blocked
- normal Place Order blocked
- paid/in-production state
- no client payment action

### 2004 — production complete

Expected:
- terminal complete state
- editor locked
- Save blocked
- normal Place Order blocked
- no payment/order action
- no suspicious stale completion date

## Browser testing rules

Preferred order:
1. Verify source row/order data.
2. Use direct tokenized Apps Script URL for project-level smoke tests.
3. Use authenticated public wrapper for dashboard smoke tests.
4. If using automation, enter the nested frame containing the actual app.
5. If automation fails to click due to iframe/cross-origin constraints, classify as test harness issue first.

Do not:
- brute-force token URLs
- assume project number equals token
- change app code to satisfy a flawed automation path
- confuse hidden modal DOM nodes with visible modal state
- treat generic Apps Script sandbox/CORB warnings as app regressions unless they block user flow

## Regression classification

When a mismatch appears, classify it as one of:

- source row/order data
- canonical lifecycle
- hydrated workflow context
- editor lifecycle adapter
- save gating
- order-flow gating
- summary lifecycle adapter
- dashboard status adapter
- dashboard peek adapter
- dirty-baseline initialization
- project VM/view refresh
- iframe/wrapper access issue
- frontend rendering
- unrelated/defer