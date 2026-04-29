# Portal Access and Smoke Test SOP

## Purpose

This file defines how to access and smoke-test the Red Threads portal without
rediscovering the app topology each time.

The portal can be accessed through multiple paths. Each path has different
behavior.

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

Accepted stable Apps Script version:

```text
759
```

## Deployment rule

Always:

1. Push the current local source.
2. Create a new Google Apps Script version.
3. Update the existing deployment ID in place.

Never create a new deployment unless explicitly instructed.

## Access paths

### 1. Public Red Threads wrapper

Use for:
- final customer-facing sanity checks
- authenticated dashboard behavior
- iframe embedding behavior

Do not use this as the first path for detailed fixture testing.

### 2. Direct Apps Script base URL

Use for:
- direct deployment validation
- direct app shell validation
- direct tokenized project testing when needed

Important:
- Apps Script may wrap the app in nested iframes
- iframe traversal trouble is a harness problem first, not automatically an app regression

### 3. Direct tokenized fixture URL

Use for:
- project-level fixture smoke
- Summary/Invoice checks
- editor/save/order gating checks
- PO/manual/payment project flow checks

Important:
- project numbers are not tokens
- live tokens must come from the local ignored fixture access file, not the committed catalog

Local-only access file:

```text
docs/LIFECYCLE_FIXTURES.local.md
```

## Fixture catalog

The accepted lifecycle fixture family is:

| Project | Expected lifecycle |
|---|---|
| `1900` | fresh estimate / reset |
| `1916` | quantities entered / artwork pending |
| `1922` | ready to order |
| `1923` | PO initiated / awaiting submission |
| `1925` | PO submitted unpaid / production active |
| `2003` | PO submitted unpaid / jobs complete |
| `2004` | PO submitted paid / print incomplete |
| `2005` | PO submitted paid / complete |
| `2006` | manual payment pending |
| `2007` | manual payment received / print incomplete |
| `2008` | manual payment received / complete |

Use:
- committed fixture catalog:
  - [docs/LIFECYCLE_FIXTURES.md](/Users/Josiah/Documents/GitHub/redthreads-ost-portal/docs/LIFECYCLE_FIXTURES.md)
- local tokenized access file:
  - `docs/LIFECYCLE_FIXTURES.local.md`

## Smoke order

Use this order when validating a fixture:

1. **Server truth**
   - canonical lifecycle state/stage
   - current order/payment/production source data
2. **Dashboard status row**
   - step states
   - helper/subtext
   - PRINT hover copy
   - complete pill state where applicable
3. **Dashboard peek**
   - timeline rails
   - total units / price / completion summary
   - payment/project completion facts
4. **Summary/Invoice**
   - document mode
   - controls mode
   - timeline note
   - PO/manual/payment controls
   - save/order lock state
5. **Team/admin controls**
   - visible actions
   - hidden actions
   - obvious invalid-repeat blocking where safe to confirm

## Source data checks

For each fixture, verify the relevant source data before declaring an app bug.

### EXPORT_LOG

Inspect:
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

### PORTAL_ORDERS

When `activeOrderId` exists, inspect:
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

## Expected smoke focus by fixture

### 1900
- editable
- no invoice/payment/PO controls
- Save inactive on initial load

### 1916
- editable
- artwork still pending
- blocker path still correct

### 1922
- editable
- stale legacy read-only must not win
- Place Order available

### 1923
- PO draft lane only
- Save blocked
- no production-start implication

### 1925
- payment due
- production active/current
- no PO draft language

### 2003
- unpaid but production complete
- not fully project-complete

### 2004
- payment received
- production active/incomplete
- project not complete

### 2005
- full PO-path complete state

### 2006
- manual payment pending
- production not started

### 2007
- manual payment received
- production active/incomplete

### 2008
- full manual-path complete state

## Regression harness note

Committed fixture docs are intentionally redacted.

Future lifecycle regression baselines and harness workflow are defined in:

- [docs/LIFECYCLE_REGRESSION_HARNESS.md](/Users/Josiah/Documents/GitHub/redthreads-ost-portal/docs/LIFECYCLE_REGRESSION_HARNESS.md)

Do not add live tokens, tokenized URLs, or raw exported data to committed smoke
docs.
