# Email Review Fixture Matrix

This document records the fixture and test-harness maturity plan for lifecycle communication review. Operational rules remain in `AGENTS.md`; the run commands remain in `docs/RUNBOOK.md`.

## Live Fixture Audit And Storage Normalization

Audit date: 2026-06-19. Spreadsheet: `CALC_EST_OST_EXPORT_LOG`.

The first controlled fixture-storage normalization pass was completed on 2026-06-19 with owner approval. Only the storage/source fixture tabs were mutated:

- `FIXTURE_EXPORT`
- `FIXTURE_PORTAL_ORDERS`
- `FIXTURE_STRIPE_EVENTS`

No active runtime tabs were mutated. No review-suite reset copied fixture data into active tabs, no `PORTAL_EMAIL_QUEUE` rows were cleared, no email-review blast was run, and no Apps Script deployment was performed.

### Header Compatibility

| Active tab | Fixture tab | Result |
| --- | --- | --- |
| `EXPORT_LOG` | `FIXTURE_EXPORT` | Populated headers match across `A:AU`. |
| `PORTAL_ORDERS` | `FIXTURE_PORTAL_ORDERS` | Populated headers match across `A:BP`. |
| `PORTAL_STRIPE_EVENTS` | `FIXTURE_STRIPE_EVENTS` | Populated headers match across `A:P`; the fixture grid has extra blank columns, but reset code already caps the copied columns to the active Stripe-event header count. |

### Coverage Findings

Before normalization, `FIXTURE_EXPORT` contained repeated historical fixture blocks. The live audit found embedded header rows at rows `70, 139, 208, 277, 346, 415, 484, 553, 622, 691, 760, 829, 898`, plus the real header at row `1`.

The repeated export blocks included the same seven active-order fixture references repeated fourteen times, for ninety-eight active-order fixture references total. The normalization pass preserved the first canonical fixture block and cleared only surplus data rows below that block. Post-normalization, `FIXTURE_EXPORT` has zero embedded header rows and seven active-order fixture references.

`FIXTURE_PORTAL_ORDERS` was already de-duplicated and still contains those seven unique order rows once. Its lifecycle coverage remains narrow:

| Method/state class | Dedicated fixture rows |
| --- | ---: |
| Manual/check pending, not authorized | 2 |
| AP ACH payment request, not started, not authorized | 1 |
| Standard ACH paid, authorized | 1 |
| Standard ACH pending/verification, not authorized | 1 |
| Purchase order submitted under terms, unpaid, authorized | 2 |
| Dedicated failed payment rows | 0 |
| Dedicated card rows | 0 |
| Dedicated manual received rows | 0 |
| Dedicated AP ACH paid/failed rows | 0 |
| Dedicated PO payment received rows | 0 |
| Dedicated production-complete rows | 0 |

`FIXTURE_STRIPE_EVENTS` still has five non-header payment-related event rows. It does not provide broad failed or disputed payment-event coverage.

### Review-Suite Harness Findings

The deployed review-suite builders synthesize many examples from the small order fixture base. This is useful for copy review, but it means fixture coverage and generated case coverage are not the same thing.

Current dry-run behavior checks fixture headers and reports the rows that would be copied or cleared, but it does not mutate active tabs, does not clear `PORTAL_EMAIL_QUEUE`, and does not send email. After the header check, it renders examples from the active runtime tabs. That only validates fixture content when the active tabs already mirror the fixture tabs. For mature pre-blast validation, dry-run should either render from fixture tabs without mutating active tabs or clearly report that it rendered from active tabs.

The local dry-run could not be run in this shell because `RT_EMAIL_REVIEW_TRIGGER_SECRET` was not present. No live review emails were sent.

## Target Matrix

The target matrix is split into sendable fixture cases and assertion-only cases. Assertion-only cases are appropriate where the current portal intentionally suppresses a communication or where a business state is not derivable from the current fixture schema without creating fake lifecycle data.

| Case | Audience | Target mode |
| --- | --- | --- |
| `ach_paid_resend` | Client | Sendable or assertion-backed |
| `ach_pending` | Client + team | Sendable |
| `ach_verification_required` | Client + team | Sendable |
| `ach_failed` | Client + team | Sendable |
| `card_paid` | Client + team | Generated today; add dedicated fixture row later |
| `card_failed` | Client + team | Generated today; add dedicated fixture row later |
| `manual_pending` | Client + team | Sendable |
| `manual_received` | Client + team | Generated today; add dedicated fixture row later |
| `po_invoice_prepared` | Client | Add dedicated awaiting-PO fixture row |
| `po_submitted_unpaid_terms_open` | Client + team | Sendable |
| `po_payment_received` | Client + team | Generated today; add dedicated fixture row later |
| `ap_payment_request` | AP + copied purchaser | Sendable |
| `ap_ach_pending` | AP + team | Sendable |
| `ap_ach_paid` | AP + team | Generated today; add dedicated fixture row later |
| `ap_ach_failed` | AP + team | Generated today; add dedicated fixture row later |
| `team_initiated_production_before_payment` | Client + team | Assertion-only until owner confirms business rule and fixture state |
| `production_complete` | Client + team | Assertion-only unless completion emails are re-enabled |
| `client_to_team_chat_digest` | Team | Sendable or omitted, but metadata should be inspectable |
| `team_to_client_chat_digest` | Client | Sendable or omitted, but metadata should be inspectable |
| `account_document_tax_submitted` | Team | Sendable |
| `account_document_tax_approved` | Client + team | Sendable or omitted after validation |
| `account_document_tax_denied` | Client | Sendable or omitted after validation |
| `account_document_credit_terms_submitted` | Team | Sendable |
| `account_document_credit_terms_approved` | Client + team | Sendable or omitted after validation |
| `account_document_credit_terms_denied` | Client | Sendable or omitted after validation |
| `password_reset` | Client | Sendable or omitted after validation |
| `summary_pdf_copy` | Entered recipient/client | Sendable or omitted after validation |
| `blank_tax_source` | Client/entered recipient | Sendable or omitted after validation |
| `blank_credit_terms_source` | Client/entered recipient | Sendable or omitted after validation |

## Fixture Reset Plan

The first safe normalization step is complete: duplicated fixture-storage blocks were cleared while preserving headers and the existing canonical fixture rows. Owner approval is still required before adding synthetic fixture rows, resetting active runtime tabs from fixtures, or running a live review-suite blast.

Recommended next fixture buildout:

1. Preserve headers exactly.
2. Add dedicated `FIXTURE_EXPORT` and `FIXTURE_PORTAL_ORDERS` rows for missing states only when the state can be derived by the existing lifecycle engine without fake data.
3. Add `FIXTURE_STRIPE_EVENTS` rows only for event states that the review harness actually consumes.
4. Keep edge states assertion-only when the current lifecycle engine cannot derive them from row data.
5. Re-run the fixture audit and matrix validation before any active-tab reset or live email review blast.

## Local Tooling

Use this tool when private CSV/TSV exports of fixture tabs are available:

```bash
npm run email-review:fixtures:audit -- --export FIXTURE_EXPORT.csv --orders FIXTURE_PORTAL_ORDERS.csv --stripe FIXTURE_STRIPE_EVENTS.csv
```

Use this after a headless dry-run JSON capture:

```bash
npm run email-review:suite -- --dry-run > /tmp/email-review-dry-run.json
npm run email-review:matrix -- --input /tmp/email-review-dry-run.json
```

The strict variant fails if any target matrix case is missing or omitted:

```bash
npm run email-review:matrix -- --input /tmp/email-review-dry-run.json --strict
```
