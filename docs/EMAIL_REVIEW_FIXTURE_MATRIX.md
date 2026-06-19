# Email Review Fixture Matrix

This document records the fixture and test-harness maturity plan for lifecycle communication review. Operational rules remain in `AGENTS.md`; the run commands remain in `docs/RUNBOOK.md`.

## Live Fixture Audit And Storage Normalization

Audit date: 2026-06-19. Spreadsheet: `CALC_EST_OST_EXPORT_LOG`.

The first controlled fixture-storage normalization pass was completed on 2026-06-19 with owner approval. A second controlled fixture-storage buildout was completed the same day to add dedicated lifecycle rows that the current schema can model safely. Only the storage/source fixture tabs were mutated:

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

The repeated export blocks included the same seven active-order fixture references repeated fourteen times, for ninety-eight active-order fixture references total. The normalization pass preserved the first canonical fixture block and cleared only surplus data rows below that block. Post-normalization, `FIXTURE_EXPORT` had zero embedded header rows and seven active-order fixture references.

The second fixture-storage buildout added nine dedicated lifecycle order rows, bringing `FIXTURE_EXPORT` and `FIXTURE_PORTAL_ORDERS` to sixteen aligned order-context fixture rows. `FIXTURE_STRIPE_EVENTS` now has nine intentional event rows, including safe paid/failed coverage for card and AP ACH flows. The new rows use existing lifecycle states only; no headers, active runtime tabs, queue rows, or Script Properties were changed.

| Method/state class | Dedicated fixture rows |
| --- | ---: |
| Manual/check pending, not authorized | 2 |
| AP ACH payment request, not started, not authorized | 1 |
| Standard ACH paid, authorized | 1 |
| Standard ACH pending/verification, not authorized | 1 |
| Purchase order submitted under terms, unpaid, authorized | 2 |
| Card paid | 1 |
| Card failed | 1 |
| Manual/check received, authorized | 1 |
| AP ACH paid | 1 |
| AP ACH failed | 1 |
| PO invoice prepared, awaiting PO submission | 1 |
| PO payment received | 1 |
| Production complete/closed | 1 |
| Team-initiated production before payment | 1 |

The `production_complete` and `team_initiated_production_before_payment` rows are storage-ready because the current lifecycle constants include `closed`, `in_production`, and authorized production without requiring payment receipt. They remain assertion-only in the review matrix until the review-suite can render those cases directly from fixture storage without an active reset.

### Review-Suite Harness Findings

The deployed review-suite builders synthesize many examples from the small order fixture base. This is useful for copy review, but it means fixture coverage and generated case coverage are not the same thing.

Current dry-run behavior checks fixture headers and reports the rows that would be copied or cleared, but it does not mutate active tabs, does not clear `PORTAL_EMAIL_QUEUE`, and does not send email. After the header check, it renders examples from the active runtime tabs. That only validates fixture content when the active tabs already mirror the fixture tabs. For mature pre-blast validation, dry-run should either render from fixture tabs without mutating active tabs or clearly report that it rendered from active tabs.

The protected headless dry run was run in no-send mode after the storage buildout. It returned `ok:true`, with zero failed email cases and zero lifecycle contradiction warnings/errors. The matrix validator still reports active-render gaps and intent mismatches because dry run renders from active runtime tabs after header checks; it does not render directly from the newly expanded `FIXTURE_*` storage rows unless a later owner-approved reset copies those rows into active tabs.

## Target Matrix

The target matrix is split into sendable fixture cases and assertion-only cases. Assertion-only cases are appropriate where the current portal intentionally suppresses a communication or where a business state is not derivable from the current fixture schema without creating fake lifecycle data.

| Case | Audience | Target mode |
| --- | --- | --- |
| `ach_paid_resend` | Client | Sendable or assertion-backed |
| `ach_pending` | Client + team | Sendable |
| `ach_verification_required` | Client + team | Sendable |
| `ach_failed` | Client + team | Sendable |
| `card_paid` | Client + team | Dedicated fixture row added |
| `card_failed` | Client + team | Dedicated fixture row added |
| `manual_pending` | Client + team | Sendable |
| `manual_received` | Client + team | Dedicated fixture row added |
| `po_invoice_prepared` | Client | Dedicated awaiting-PO fixture row added |
| `po_submitted_unpaid_terms_open` | Client + team | Sendable |
| `po_payment_received` | Client + team | Dedicated fixture row added |
| `ap_payment_request` | AP + copied purchaser | Sendable |
| `ap_ach_pending` | AP + team | Sendable |
| `ap_ach_paid` | AP + team | Dedicated fixture row added |
| `ap_ach_failed` | AP + team | Dedicated fixture row added |
| `team_initiated_production_before_payment` | Client + team | Storage row added; assertion-only until review tooling renders fixture-storage cases without active reset |
| `production_complete` | Client + team | Storage row added; assertion-only unless completion emails are re-enabled or assertion-only rendering is added |
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

The first safe normalization step is complete: duplicated fixture-storage blocks were cleared while preserving headers and the existing canonical fixture rows. The second buildout added dedicated lifecycle rows for the missing safe states. Owner approval is still required before resetting active runtime tabs from fixtures or running a live review-suite blast.

Recommended next fixture/test-harness step:

1. Preserve headers exactly.
2. Add a no-mutation fixture-storage render mode to the review suite, or run an owner-approved active reset before dry-run validation.
3. Keep edge states assertion-only when the active review suite intentionally suppresses those communications.
4. Re-run fixture audit and matrix validation before any active-tab reset or live email review blast.

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
