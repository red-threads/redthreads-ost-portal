# Email Review Fixture Matrix

This document records the fixture and test-harness maturity plan for lifecycle communication review. Operational rules remain in `AGENTS.md`; the run commands remain in `docs/RUNBOOK.md`.

## Live Fixture Audit

Audit date: 2026-06-19. Spreadsheet: `CALC_EST_OST_EXPORT_LOG`.

No live Sheet values were edited during this audit.

### Header Compatibility

| Active tab | Fixture tab | Result |
| --- | --- | --- |
| `EXPORT_LOG` | `FIXTURE_EXPORT` | Populated headers match across `A:AU`. |
| `PORTAL_ORDERS` | `FIXTURE_PORTAL_ORDERS` | Populated headers match across `A:BP`. |
| `PORTAL_STRIPE_EVENTS` | `FIXTURE_STRIPE_EVENTS` | Populated headers match across `A:P`; the fixture grid has extra blank columns, but reset code already caps the copied columns to the active Stripe-event header count. |

### Coverage Findings

`FIXTURE_EXPORT` currently contains repeated historical fixture blocks. The live audit found embedded header rows at rows `70, 139, 208, 277, 346, 415, 484, 553, 622, 691, 760, 829, 898`, plus the real header at row `1`.

The repeated export blocks include the same seven active-order fixture references repeated fourteen times, for ninety-eight active-order fixture references total. `FIXTURE_PORTAL_ORDERS` contains those seven unique order rows once.

Current `FIXTURE_PORTAL_ORDERS` lifecycle coverage is narrow:

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

`FIXTURE_STRIPE_EVENTS` has five non-header payment-related event rows. It does not provide broad failed or disputed payment-event coverage.

### Review-Suite Harness Findings

The deployed review-suite builders synthesize many examples from the small order fixture base. This is useful for copy review, but it means fixture coverage and generated case coverage are not the same thing.

Current dry-run behavior checks fixture headers but renders examples from the active runtime tabs. That only validates fixture content when the active tabs already mirror the fixture tabs. For mature pre-blast validation, dry-run should either render from fixture tabs without mutating active tabs or clearly report that it rendered from active tabs.

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

## Recommended Fixture Reset Plan

Owner approval is required before any live fixture mutation.

When approved:

1. Back up the three fixture tabs to a local ignored/private artifact or temporary workbook copy.
2. Preserve headers exactly.
3. Clear only fixture data rows in `FIXTURE_EXPORT`, `FIXTURE_PORTAL_ORDERS`, and `FIXTURE_STRIPE_EVENTS`.
4. Rebuild one canonical export row per fixture case, with no embedded header rows.
5. Rebuild matching `FIXTURE_PORTAL_ORDERS` rows for every order-context case that can be represented by the current schema.
6. Keep `FIXTURE_STRIPE_EVENTS` limited to event rows that are needed for specific ACH/AP ACH/card scenarios.
7. Keep edge states assertion-only when the current lifecycle engine cannot derive them from row data.
8. Re-run the fixture audit and matrix validation before any live email review blast.

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
