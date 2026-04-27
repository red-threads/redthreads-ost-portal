# Lifecycle Fixture Manifest

## Security

This file contains live tokenized project access links.

Keep this repo private. If this repo may ever become public, move this file to a local ignored path such as:

```text
docs/LIFECYCLE_FIXTURES.local.md
```

## Stable deployment

Web app URL:

```text
https://script.google.com/macros/s/AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw/exec
```

Deployment ID:

```text
AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw
```

## Fixture table

| Project | Token | Direct test URL | Lifecycle | Expected high-level state |
|---|---|---|---|---|
| `1900` | `d29f8ea7-4a86-4814-88e7-209108b01062` | `https://script.google.com/macros/s/AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw/exec?t=d29f8ea7-4a86-4814-88e7-209108b01062` | fresh estimate / no action | editable / quantity entry |
| `1916` | `3cecd311-0e7c-4ea2-8c07-78d5d7b42853` | `https://script.google.com/macros/s/AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw/exec?t=3cecd311-0e7c-4ea2-8c07-78d5d7b42853` | quantities entered / artwork pending | editable / artwork approval needed |
| `1922` | `3bfd064f-64a4-4fee-bcd1-b89bd0562ccf` | `https://script.google.com/macros/s/AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw/exec?t=3bfd064f-64a4-4fee-bcd1-b89bd0562ccf` | ready to order | editable / order allowed |
| `1923` | `b4353cdf-0610-4e7d-a223-f0ab598bbde5` | `https://script.google.com/macros/s/AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw/exec?t=b4353cdf-0610-4e7d-a223-f0ab598bbde5` | PO draft invoice prepared / awaiting PO submission | locked estimate / PO submission lane |
| `1925` | `fa49c61c-fe2e-4d82-8ddc-0dfef1329023` | `https://script.google.com/macros/s/AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw/exec?t=fa49c61c-fe2e-4d82-8ddc-0dfef1329023` | PO submitted unpaid / production active | locked estimate / payment due / production active |
| `2003` | `4e13efcc-82d8-4613-a795-3eaff5929773` | `https://script.google.com/macros/s/AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw/exec?t=4e13efcc-82d8-4613-a795-3eaff5929773` | payment received / production active | locked estimate / paid / production active |
| `2004` | `70bf3b62-9999-4939-aa00-228bbf546814` | `https://script.google.com/macros/s/AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw/exec?t=70bf3b62-9999-4939-aa00-228bbf546814` | production complete | locked estimate / terminal complete |

## Notes by fixture

### 1900

Fresh estimate / no action.

Expected:
- editable
- no invoice/payment/PO controls
- Save inactive on initial load
- Save active after real edit
- no false unsaved-change modal

### 1916

Quantities entered, artwork pending.

Expected:
- editable
- artwork still pending
- Save active only after real edit
- normal order flow should still be governed by existing blockers

### 1922

Ready to order.

Important:
- This fixture may contain stale legacy `portalStateJson.isReadOnly = true`.
- Canonical lifecycle must override that stale legacy flag.
- This is a key test case for lifecycle truth beating stale client state.

Expected:
- editable
- Place Order available
- Save active only after real edit
- no false locked state

### 1923

PO draft invoice prepared / awaiting PO submission.

Expected:
- estimate editor locked
- Save blocked
- normal Place Order blocked
- PO submission controls available from Summary/Invoice only
- no payment-due implication
- no production-start implication

### 1925

PO submitted unpaid / production active / payment due.

Important:
- This fixture may still carry stale `purchaseOrderDraft` metadata.
- Canonical lifecycle must override stale draft metadata.

Expected:
- estimate editor locked
- Save blocked
- normal Place Order blocked
- payment due visible through Summary/Invoice
- production active/current
- no PO draft language

### 2003

Payment received / production active.

Expected:
- estimate editor locked
- Save blocked
- normal Place Order blocked
- paid/in-production state
- no client payment action

### 2004

Production complete.

Expected:
- terminal complete state
- editor locked
- Save blocked
- normal Place Order blocked
- no payment/order action
- no suspicious stale completion date