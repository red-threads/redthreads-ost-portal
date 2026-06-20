# Email Review Fixture Matrix

This document records the fixture and test-harness maturity plan for lifecycle communication review. Operational rules remain in `AGENTS.md`; the run commands remain in `docs/RUNBOOK.md`.

## Live Fixture Audit And Storage Normalization

Audit date: 2026-06-19. Spreadsheet: `CALC_EST_OST_EXPORT_LOG`.

The first controlled fixture-storage normalization pass was completed on 2026-06-19 with owner approval. A second controlled fixture-storage buildout was completed the same day to add dedicated lifecycle rows that the current schema can model safely. Only the storage/source fixture tabs were mutated:

- `FIXTURE_EXPORT`
- `FIXTURE_PORTAL_ORDERS`
- `FIXTURE_STRIPE_EVENTS`

During those storage-only passes, no active runtime tabs were mutated. No review-suite reset copied fixture data into active tabs, no `PORTAL_EMAIL_QUEUE` rows were cleared, no email-review blast was run, and no Apps Script deployment was performed.

## Controlled Active Fixture Reset

On 2026-06-19, the normalized fixture storage was activated for dry-run validation only. A private Drive copy of the workbook was created first as a restore point; no private backup file was committed.

Only these active runtime tabs were mutated, by clearing values below the header row and pasting values from the matching fixture-storage tabs:

- `FIXTURE_EXPORT` -> `EXPORT_LOG`
- `FIXTURE_PORTAL_ORDERS` -> `PORTAL_ORDERS`
- `FIXTURE_STRIPE_EVENTS` -> `PORTAL_STRIPE_EVENTS`

The header rows were preserved exactly. `USERS`, `USER_SESSIONS`, `PORTAL_ACCOUNTS`, Script Properties, Stripe config, Apps Script config, and `.clasp.json` were not touched. `PORTAL_EMAIL_QUEUE` was intentionally not touched. The built-in non-dry-run review-suite reset path still clears `PORTAL_EMAIL_QUEUE`; this controlled activation used a direct Sheets value copy instead.

Pre/post active grid counts were unchanged:

| Active tab | Grid rows x cols |
| --- | ---: |
| `EXPORT_LOG` | `918 x 47` |
| `PORTAL_ORDERS` | `900 x 68` |
| `PORTAL_STRIPE_EVENTS` | `1000 x 26` |
| `PORTAL_EMAIL_QUEUE` | `1000 x 26` |

Fixture storage grid counts at activation time:

| Fixture tab | Grid rows x cols | Intentional content |
| --- | ---: | --- |
| `FIXTURE_EXPORT` | `1001 x 47` | 16 aligned order-context fixture rows plus utility rows |
| `FIXTURE_PORTAL_ORDERS` | `1001 x 68` | 16 aligned order rows |
| `FIXTURE_STRIPE_EVENTS` | `1001 x 28` | 9 intentional payment-event rows; only active `A:P` columns copied |

The protected headless dry run after active reset returned `ok:true`, sent `0`, skipped `32`, failed `0`, reported `13` attachment fallbacks, and reported `0` lifecycle contradiction warnings/errors. No live review emails were sent.

The matrix validator reported `16 / 29` cases covered, `11` skipped/omitted cases, `2` assertion-only missing cases, and `4` intent-metadata mismatches. The mismatches were classified as review-harness metadata issues, not fixture reset failures:

- `card_failed` and `ap_ach_failed` were still rendered from synthetic clones anchored to non-failed base orders.
- `account_document_tax_submitted` and `account_document_credit_terms_submitted` rendered correct account-document review surfaces but reported order payment intent metadata.

Version `982` deploys the review-harness patch that selects dedicated active fixture rows for card/AP/manual/PO examples and overrides account-document lifecycle review metadata to account-document intent. The protected dry run after deploying `982` returned `ok:true`, sent `0`, skipped `32`, failed `0`, reported `13` known fixture attachment fallbacks, and reported `0` lifecycle contradiction warnings/errors. Matrix validation returned `ok:true`: the four previous intent mismatches cleared, leaving only the two expected assertion-only gaps, `team_initiated_production_before_payment` and `production_complete`.

Version `983` deploys the post-hardening assertion coverage. The protected dry run after deploying `983` returned `ok:true`, sent `0`, skipped `32`, failed `0`, reported `13` known fixture attachment fallbacks, and reported `0` lifecycle contradiction warnings/errors. Matrix validation returned `ok:true` with `29` required cases, `18` covered cases, `11` skipped/omitted cases, `0` missing cases, and `0` intent mismatches. The previously pending `team_initiated_production_before_payment` and `production_complete` cases are now covered by synthetic assertion-only results in the deployed dry-run harness.

The first live owner review-suite blast against version `983` was run on 2026-06-19 after a final clean protected dry run. It returned `ok:true`, sent `15` team-recipient review emails, skipped `32` configured/omitted cases, failed `0`, reported `13` known fixture `artifact_project_mismatch` attachment fallbacks, and reported `0` lifecycle contradiction warnings/errors. The non-dry-run suite used its default reset path, re-copying fixture storage into `EXPORT_LOG`, `PORTAL_ORDERS`, and `PORTAL_STRIPE_EVENTS`, and clearing `PORTAL_EMAIL_QUEUE` rows before sending. The live-send response is an inbox-send receipt and does not include synthetic assertion-only dry-run rows; use the protected dry-run JSON for full matrix validation.

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

Current dry-run behavior checks fixture headers and reports the rows that would be copied or cleared, but it does not mutate active tabs, does not clear `PORTAL_EMAIL_QUEUE`, and does not send email. After the header check, it renders examples from the active runtime tabs. That means fixture content is validated only after a controlled active reset or after a no-mutation fixture-storage render mode is added.

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
| `team_initiated_production_before_payment` | Client + team | Storage row added; covered by deployed synthetic assertion-only cases in version `983` |
| `production_complete` | Client + team | Storage row added; covered by deployed synthetic assertion-only cases and explicit communication intent in version `983` |
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

The first safe normalization step is complete: duplicated fixture-storage blocks were cleared while preserving headers and the existing canonical fixture rows. The second buildout added dedicated lifecycle rows for the missing safe states. The first controlled active reset for dry-run validation is also complete. The first live owner review-suite blast against the active fixture matrix is complete; future review-suite blasts or Apps Script deployments still require explicit owner approval.

Recommended next fixture/test-harness step:

1. Preserve headers exactly.
2. Keep `team_initiated_production_before_payment` and `production_complete` as assertion-only unless the owner explicitly wants live sendable review surfaces for those edge states.
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
