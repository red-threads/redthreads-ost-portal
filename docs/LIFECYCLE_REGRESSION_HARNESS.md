# Lifecycle Regression Harness

## Purpose

This document defines the safe regression-harness foundation for future
lifecycle cleanup, deletion-prep, and refactor work.

The goal is to snapshot accepted fixture behavior before any future lifecycle
deletion or compatibility removal.

## Security model

The repo should be treated as **not guaranteed private** for fixture-harness
design purposes.

Committed harness artifacts must therefore be public-safe by default.

### Never commit

- live tokens
- tokenized URLs
- raw `snapshotJson`
- raw `portalStateJson`
- raw `submittedStateJson`
- raw EXPORT_LOG / PORTAL_ORDERS dumps
- session/auth identifiers
- customer names
- org names
- emails
- chat/message content
- invoice numbers
- PO numbers
- production snapshot snippets copied from rows

### Local-only fixture access

Local tokenized access belongs in:

```text
docs/LIFECYCLE_FIXTURES.local.md
```

That file is maintainer-only and must remain Git-ignored.

## Committed vs local-only artifacts

### Committed

- `docs/LIFECYCLE_FIXTURES.md`
- `docs/PORTAL_ACCESS_AND_SMOKE_TEST_SOP.md`
- `docs/LIFECYCLE_CANONICAL_ARCHITECTURE.md`
- `testcases/lifecycle-fixtures/manifest.json`
- `testcases/lifecycle-fixtures/schema.json`
- redacted future baselines only after explicit approval

### Local-only

- `docs/LIFECYCLE_FIXTURES.local.md`
- `testcases/lifecycle-fixtures/private/`
- any raw exported diagnostic captures
- any files containing tokens, URLs, or customer-linked data

## Planned harness phases

### 4D.1a

Foundation only:

- docs
- manifest/schema
- redaction policy
- local-file conventions

No export mechanism yet.

### 4D.1b

Security-approved export mechanism:

- non-public
- maintainer-only
- no `doGet`
- no `doPost`
- no public debug mode
- likely local Apps Script execution tooling

### 4D.1c

Baseline generation and comparison workflow:

- generate local raw captures
- redact/promote approved fields into committed baselines
- compare before future lifecycle deletion/refactor passes

## Intended snapshot surfaces

Future baselines are expected to cover:

1. dashboard status row
2. dashboard peek
3. Summary/Invoice
4. team/admin controls
5. canonical lifecycle truth

The exact baseline structure is defined in:

- `testcases/lifecycle-fixtures/manifest.json`
- `testcases/lifecycle-fixtures/schema.json`

## Use before future refactor/deletion work

Before any future lifecycle deletion, consolidation, or compatibility removal:

1. refresh fixture captures through the approved safe export process
2. compare against accepted baselines
3. run targeted browser smoke for fields not reliably exportable
4. do not continue deletion/refactor work if the fixture baselines drift

## Maintenance rule

Do not expand the harness by committing every raw runtime field.

Only stable, approved lifecycle facts and user-visible behavior should become
part of the committed regression surface.
