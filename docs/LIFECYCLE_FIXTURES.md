# Lifecycle Fixture Catalog

## Security

This committed file is intentionally **redacted**.

It is the fixture catalog for lifecycle regression work, but it must not contain:

- live tokens
- tokenized URLs
- customer/client identifiers
- raw row JSON or state payloads

Local-only access data belongs in:

```text
docs/LIFECYCLE_FIXTURES.local.md
```

That local file should be ignored by Git and may contain:

- fixture tokens
- direct Apps Script test URLs
- temporary maintainer-only notes

## Accepted stable reference

- accepted Apps Script version: `759`
- deployment ID: `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw`

## Fixture table

| Project | Lifecycle label | Expected high-level state | Category |
|---|---|---|---|
| `1900` | `fresh_estimate` | editable quantity entry | estimate |
| `1916` | `artwork_pending` | editable / artwork approval still needed | estimate |
| `1922` | `ready_to_order` | editable / order allowed | estimate |
| `1923` | `po_draft_awaiting_submission` | locked estimate / PO submission lane | purchase_order |
| `1925` | `po_submitted_unpaid` | locked estimate / payment due / production active | purchase_order |
| `2003` | `po_submitted_unpaid_jobs_complete` | locked estimate / unpaid / production complete | purchase_order |
| `2004` | `po_submitted_paid_print_incomplete` | locked estimate / paid / production active | purchase_order |
| `2005` | `po_submitted_paid_complete` | full project complete | purchase_order |
| `2006` | `manual_payment_pending` | locked estimate / manual payment pending | manual_payment |
| `2007` | `manual_payment_received_print_incomplete` | locked estimate / paid / production active | manual_payment |
| `2008` | `manual_payment_received_complete` | full project complete | manual_payment |

## Notes by fixture

### 1900

Fresh estimate / reset state.

Expected:
- editable
- no invoice/payment/PO controls
- Save inactive on initial load
- Save active only after a real edit

### 1916

Quantities entered, artwork still pending.

Expected:
- editable
- artwork still pending
- order flow still blocked by the existing readiness path

### 1922

Ready to order.

Important:
- this fixture may contain stale legacy `portalStateJson.isReadOnly = true`
- canonical lifecycle must beat that stale client flag

Expected:
- editable
- Place Order available
- no false locked state

### 1923

PO initiated, not submitted.

Expected:
- estimate editor locked
- Save blocked
- normal Place Order blocked
- PO submission controls available from Summary/Invoice only
- no payment-due implication
- no production-start implication

### 1925

PO submitted, unpaid, production active.

Important:
- this fixture may still carry stale purchase-order draft metadata
- canonical lifecycle must beat stale draft metadata

Expected:
- estimate editor locked
- payment due
- production current
- no PO draft language

### 2003

PO submitted, unpaid, jobs completed.

Expected:
- estimate editor locked
- payment still due
- production complete
- project not fully complete until payment is received

### 2004

PO submitted, payment made, print incomplete.

Expected:
- estimate editor locked
- payment received
- production active / incomplete
- project not complete

### 2005

PO submitted, payment made, jobs completed / complete.

Expected:
- full project complete
- editor locked
- no payment/order action

### 2006

Manual payment pending.

Expected:
- estimate editor locked
- manual payment instructions visible
- payment still due
- production not started

### 2007

Manual payment received, print incomplete.

Expected:
- estimate editor locked
- paid / production active
- no PO-specific language

### 2008

Manual payment received, jobs completed / complete.

Expected:
- full project complete
- editor locked
- no payment/order action

## Harness note

This file is the committed fixture catalog only.

Future regression baselines should be tracked through:

- [docs/LIFECYCLE_REGRESSION_HARNESS.md](/Users/Josiah/Documents/GitHub/redthreads-ost-portal/docs/LIFECYCLE_REGRESSION_HARNESS.md)
- `testcases/lifecycle-fixtures/manifest.json`
- `testcases/lifecycle-fixtures/schema.json`
