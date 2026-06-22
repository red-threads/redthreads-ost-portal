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

Version `984` clears the configured review-suite omission maps so all sendable fixture labels and recipient classes are eligible again. No dry run or live suite was triggered during that unlock ship, so the next protected dry run will produce the authoritative unlocked send/skip matrix.

Version `985` closes the unlocked-suite dry-run gate. It adds document-copy communication metadata to the utility review rows for password reset, summary/invoice explicit send, blank tax source, and blank credit-terms source, and removes the remaining team client-possessive warning from locked-order resend team review copy. The protected dry run returned `ok:true`, total `59`, skipped `1`, failed `0`, attachment fallback `30`, contradiction warnings/errors `0`, and matrix `ok:true` with `29 / 29` required cases covered and `0` intent mismatches. The owner-approved live suite sent `46` review emails (`23` client, `19` team, `4` AP), skipped only `Submitted tax-form copy client` because the submitted artifact is unavailable in fixtures, failed `0`, and reported the same `30` attachment fallbacks. The live non-dry-run path reset `FIXTURE_EXPORT -> EXPORT_LOG`, `FIXTURE_PORTAL_ORDERS -> PORTAL_ORDERS`, and `FIXTURE_STRIPE_EVENTS -> PORTAL_STRIPE_EVENTS`, then cleared `PORTAL_EMAIL_QUEUE`; fixture-storage tabs were not mutated.

On 2026-06-22, a fresh full owner review-suite blast was run against version `985` after another clean protected dry run and strict matrix validation. The dry run again returned `ok:true`, total `59`, skipped `1`, failed `0`, attachment fallback `30`, contradiction warnings/errors `0`, and matrix `29 / 29` covered with `0` intent mismatches. The live suite again sent `46` review emails (`23` client, `19` team, `4` AP), skipped only `Submitted tax-form copy client`, failed `0`, and reported `30` attachment fallbacks. The live non-dry-run path reset the active runtime tabs from fixture storage and cleared `PORTAL_EMAIL_QUEUE`; fixture-storage tabs were not mutated.

Version `986` narrows the owner review-suite send set after inbox review by omitting owner-reviewed/pass labels from future sends. The runtime still reports omitted labels as safe skipped results. The protected dry run returned `ok:true`, total `59`, skipped `26`, failed `0`, attachment fallback `16`, contradiction warnings/errors `0`, and non-strict matrix `ok:true` with `29` required, `21` covered, `8` skipped/omitted, `0` missing, and `0` intent mismatches. The skipped/omitted matrix count is intentional because accepted client/AP pass communications are now hidden from the send suite. No live review-suite blast was run for version `986`, and active runtime tabs, fixture-storage tabs, and `PORTAL_EMAIL_QUEUE` were not mutated.

Version `987` adds the centered red dynamic retry CTA to the `Card failed client` action card before hiding that label from future review-suite sends. The CTA reads `Click to access Project #... and retry payment` and continues to use the invoice-summary project portal route. The protected dry run returned `ok:true`, total `59`, skipped `27`, failed `0`, attachment fallback `15`, contradiction warnings/errors `0`, and non-strict matrix `ok:true` with `29` required, `21` covered, `8` skipped/omitted, `0` missing, and `0` intent mismatches. No live review-suite blast was run for version `987`, and active runtime tabs, fixture-storage tabs, and `PORTAL_EMAIL_QUEUE` were not mutated.

Version `988` adds shared email production timing display while preserving the existing owner-reviewed omission policy. Client-facing order-context Project Details cards now show `Production Time` after `Project total` when selected order jobs include parseable business-day turnaround data. Shared client/team progress bars now show current production as `In Production` / `Will Finish M/D` when lifecycle-derived production target timing is available, and completed production as `Production` / `Completed M/D`. The protected post-deploy dry run returned `ok:true`, total `59`, skipped `27`, failed `0`, attachment fallback `15`, contradiction warnings/errors `0`, and non-strict matrix `ok:true` with `29` required, `21` covered, `8` skipped/omitted, `0` missing, and `0` intent mismatches. No live review-suite blast was run for version `988`, and active runtime tabs, fixture-storage tabs, and `PORTAL_EMAIL_QUEUE` were not mutated.

Version `989` clears the review-suite omission map, extends the same `Production Time` Project Details row to team order-context emails, and dedupes AP ACH receipt history by replacing the shared generic `ACH payment received` line with `AP ACH payment received` instead of rendering both. The protected dry run returned `ok:true`, total `59`, skipped `1`, failed `0`, attachment fallback `30`, contradiction warnings/errors `0`, and strict matrix `ok:true` with `29 / 29` covered and `0` intent mismatches. The owner-approved live suite sent `46` review emails (`23` client, `19` team, `4` AP), skipped only `Submitted tax-form copy client`, failed `0`, and reported `30` attachment fallbacks. The live receipt does not include dry-run-only assertion cases, so protected dry-run JSON remains the authoritative full matrix validation artifact. The live non-dry-run path reset active runtime tabs from fixture storage and cleared `PORTAL_EMAIL_QUEUE`; fixture-storage tabs were not mutated.

Version `990` re-hides the owner-reviewed/pass review labels requested after inbox review while preserving production communication policy. It also ships the final visible refinements before hiding those labels: locked-order resend client copy uses `invoice/receipt`, PO invoice prepared gets a centered `Click to access project #... and upload P.O.` action-card CTA, and PO submitted/manual payment pending client emails get centered `Click to access project #... and make a payment.` action-card CTAs. Per owner instruction, no protected dry run or live email-review suite was run for version `990`; active runtime tabs remain fixture-loaded from the version `989` live-suite reset, fixture-storage tabs were not touched, and `PORTAL_EMAIL_QUEUE` was not cleared.

Version `991` enables the production-complete portal lifecycle email for the all-jobs-complete Team Mode trigger while keeping partial `jobs_completed` updates policy-disabled. Client and team emails are rendered by the existing lifecycle shell and shared order-context progress/details/history surfaces. Client production-complete copy now splits by fulfillment method: shipping orders say the order is ready to ship via UPS Ground without a tracking-link claim, and pickup orders say the order is ready for pickup at Red Threads, 505 South Saginaw Road, Midland, Michigan 48640. The review suite now renders `Production complete shipping client`, `Production complete shipping team`, `Production complete pickup client`, and `Production complete pickup team`; matrix coverage for `production_complete` is now sendable, not assertion-only. The protected post-deploy dry run returned `ok:true`, total `63`, skipped `27`, failed `0`, sent `0`, attachment fallback `15`, contradiction warnings/errors `0`, and non-strict matrix `ok:true` with `29` required, `21` covered, `8` skipped/omitted, `0` missing, and `0` intent mismatches. No live review-suite blast was run; the dry run did not reset active runtime tabs, touch fixture-storage tabs, clear `PORTAL_EMAIL_QUEUE`, or send emails.

Version `992` refines team action-card status labels and narrows the visible team review-suite send set. Team emails rendered through the shared lifecycle shell now use only `Action required`, `Potential action required`, or `No action required` as the visible action-card title, with red/blue/green title color respectively. The review suite now also omits `Explicit locked-order resend team`, `Chat digest client to team`, `Credit terms approved team`, `Credit terms submitted team review`, `Tax exempt approved team`, and `Tax exempt submitted team review` with the `owner_reviewed_hidden` policy. The protected post-deploy dry run returned `ok:true`, total `63`, skipped `33`, failed `0`, sent `0`, attachment fallback `14`, contradiction warnings/errors `0`, and non-strict matrix `ok:true` with `29` required, `16` covered, `13` skipped/omitted, `0` missing, and `0` intent mismatches. The owner-approved live suite sent `18`, skipped `33`, failed `0`, reported `14` attachment fallbacks, and reported `0` contradiction warnings/errors. The live non-dry-run path reset active runtime tabs from fixture storage and cleared `PORTAL_EMAIL_QUEUE`; fixture-storage tabs were not mutated.

## Client/Team Email Inventory And Production Timing Display

Inventory date: 2026-06-22. This inventory describes recipient email families that can be rendered by the current portal/review harness and whether the shared order-context shell can show production timing.

The production timing display is scoped to order-context emails. These emails render lifecycle progress and Project Details from the canonical order summary, so they can safely show `Production Time` after `Project total` when selected jobs include a parseable business-day turnaround. Non-order emails do not receive the row because they do not carry reliable project/job timing context.

| Email group | Review-suite labels | Shell context | Production timing display | Current review-suite status |
| --- | --- | --- | --- | --- |
| Standard ACH client emails | `Standard ACH pending client`, `Standard ACH verification client`, `Standard ACH receipt client`, `Standard ACH failed client` | Order-context progress + Project Details | Show `Production Time` when selected-job turnaround is available; progress shows `Will Finish M/D` when production is current | Hidden from suite again in version `990` after owner review |
| Standard ACH team emails | `Standard ACH pending team`, `Standard ACH verification team`, `Standard ACH receipt team`, `Standard ACH failed team` | Order-context progress + Project Details + client identity fields | Show `Production Time` when selected-job turnaround is available; progress matches the client lifecycle display while next-action copy remains team-specific | Sent in version `989` live suite |
| Card/manual/PO payment lifecycle client emails | `Card paid client`, `Card failed client`, `Manual payment pending client`, `Manual payment received client`, `PO submitted client`, `PO payment received client` | Order-context progress + Project Details | Show `Production Time` when selected-job turnaround is available; progress shows `Will Finish M/D` or `Completed M/D` from lifecycle timing | Version `990` hides `Card failed client`, manual pending/received, and PO submitted/payment received; `Card paid client` remains eligible |
| Card/manual/PO payment lifecycle team emails | `Card paid team`, `Card failed team`, `Manual payment pending team`, `Manual payment received team`, `PO submitted team`, `PO payment received team` | Order-context progress + Project Details + client identity fields | Show `Production Time` when selected-job turnaround is available; progress matches the client lifecycle display while next-action copy remains team-specific | Sent in version `989` live suite |
| AP ACH/AP payment emails | `AP payment link sent`, `AP ACH pending AP`, `AP ACH pending team`, `AP ACH receipt AP`, `AP ACH receipt team`, `AP ACH failed AP`, `AP ACH failed team` | AP-specific payment copy plus order-context progress/details where available | AP and team variants use the shared lifecycle Project Details/progress surfaces; AP ACH receipt history renders one AP-specific payment-received line | Version `990` hides AP-recipient pass labels; AP ACH team labels remain eligible |
| Locked-order and PO invoice client emails | `Explicit locked-order resend client`, `PO invoice prepared client` | Order-context progress + Project Details | Show `Production Time` when selected-job turnaround is available; no timing is fabricated when production data is unavailable | Hidden in version `990` after requested copy/CTA changes |
| Locked-order team email | `Explicit locked-order resend team` | Order-context progress + Project Details + client identity fields | Show `Production Time` when selected-job turnaround is available; no timing is fabricated when production data is unavailable | Hidden in version `992` after owner review |
| Production complete client/team emails | `Production complete shipping client`, `Production complete shipping team`, `Production complete pickup client`, `Production complete pickup team` | Order-context progress + Project Details + History | Show completed production progress and shared lifecycle history; client copy splits between ready-to-ship UPS Ground language and ready-for-pickup address language | Sendable dry-run coverage added in version `991`; not hidden |
| Team-to-client chat digest | `Chat digest team to client` | Chat digest plus lifecycle progress/details when order context is available | Uses the shared order-context timing display when lifecycle sections render | Hidden in version `990` after owner review |
| Client-to-team chat digest | `Chat digest client to team` | Chat digest plus lifecycle progress/details when order context is available | Uses the shared order-context timing display when lifecycle sections render | Hidden in version `992` after owner review |
| Summary/invoice explicit send | `Summary/invoice explicit send client` | Utility/document-copy path | No Project Details timing row; the utility send carries document-copy metadata rather than lifecycle project timing | Hidden in version `990` after owner review |
| Account-document source and decisions | `Blank tax document source client`, `Blank credit terms source client`, `Tax exempt approved client`, `Tax exempt denied client`, `Tax exempt reset client`, `Credit terms approved client`, `Credit terms denied client`, `Credit terms reset client` | Account-document path | No Project Details timing row; these emails are account/document communications, not order production communications | Client source/decision labels hidden in version `990`; team notifications tracked separately |
| Account-document team notifications | `Tax exempt submitted team review`, `Tax exempt approved team`, `Credit terms submitted team review`, `Credit terms approved team` | Account-document path | No Project Details timing row; these emails are account/document communications, not order production communications | Hidden in version `992` after owner review |
| Password reset | `Password reset client` | Auth utility path | No Project Details timing row | Hidden in version `990` after owner review |
| Submitted tax-form copy | `Submitted tax-form copy client` | Submitted artifact copy path | No Project Details timing row | Safely skipped when submitted artifact is unavailable |

## Order-History Timing Audit

The shared order-history helper currently appends order placement, payment receipt, production authorization, production completion, and one timing line. Before production is authorized, the timing line is `Estimated turnaround: ...`; when production is active, the timing line is `Estimated production completion: ...`; when production is complete, `Production complete: ...` is also present when an actual completion date is available.

Client and team order-context emails receive the same `historyLines` array from the shared lifecycle email context. Audience-specific builders may still add specialized history blocks. Version `989` cleans up the AP ACH receipt layer so AP receipt emails replace the shared generic `ACH payment received` line with `AP ACH payment received` rather than showing both payment receipt lines. This keeps one visible payment-received history event while preserving AP-specific subject/action-card copy.

Recommended future tune-up: add a review-suite assertion that compares normalized client/team progress, Project Details timing fields, and history lines for paired order-context emails.

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

The `production_complete` and `team_initiated_production_before_payment` rows are storage-ready because the current lifecycle constants include `closed`, `in_production`, and authorized production without requiring payment receipt. Version `991` promotes `production_complete` to sendable pickup/shipping client and team review coverage. `team_initiated_production_before_payment` remains assertion-only because production-before-payment client/team notification is still policy-controlled.

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
| `production_complete` | Client + team | Sendable pickup/shipping client + team review cases added in version `991`; no longer assertion-only |
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

The first safe normalization step is complete: duplicated fixture-storage blocks were cleared while preserving headers and the existing canonical fixture rows. The second buildout added dedicated lifecycle rows for the missing safe states. The first controlled active reset for dry-run validation is also complete. The first live owner review-suite blast against the active fixture matrix is complete, the unlocked full review-suite blasts against version `985` are complete, versions `986`/`987` temporarily hid accepted/pass communications from future suite sends, version `989` re-unlocked the suite and completed another full live blast, version `990` re-hides the newly owner-reviewed/pass labels without running the email suite, version `991` adds sendable production-complete pickup/shipping coverage without a live suite send, and version `992` refines team action-card status labels while hiding additional owner-reviewed team labels and running the live suite. Active runtime tabs remain fixture-loaded after the version `992` live-suite reset. Future active-tab restoration still requires explicit owner approval.

Recommended next fixture/test-harness step:

1. Preserve headers exactly.
2. Keep `team_initiated_production_before_payment` assertion-only unless the owner explicitly wants live sendable review surfaces for that edge state.
3. Keep edge states assertion-only when the active review suite intentionally suppresses those communications; `production_complete` is now intentionally sendable for pickup/shipping client and team review cases.
4. Have the owner inspect the `46` delivered review emails for copy/layout findings, then keep active tabs in fixture mode or restore them from the private Drive backup only after explicit owner direction.

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
