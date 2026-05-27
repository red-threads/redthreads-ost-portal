# Red Threads OST Portal (Apps Script) - V2

## What this is

A Google Apps Script HTMLService web app that renders an estimate snapshot stored in a Google Sheet tab `EXPORT_LOG`.

Data flow:
Calculator -> Make.com -> `EXPORT_LOG` (wide row) -> Portal loads via `?t=<token>` -> parses `snapshotJson` -> renders V2.

## V2 Load Contract (Locked)

- Portal URL param: `t`
  - Example: `...?t=<token>`
- Lookup: match `EXPORT_LOG` Column A (`token`) to `t`.
- Read the matching row and parse:
  - `snapshotJson` (immutable) -> render
  - `portalStateJson` (mutable) -> hide/show + quantities state

## Snapshot Contract (Locked)

Top-level:

```json
{ "meta": { "...": "..." }, "printJobs": [] }
```

## Shared Context

Start here before changing the repo:

- `AGENTS.md` - operating rules for Codex, ChatGPT Atlas, GitHub inspection, and owner handoffs.
- `docs/CONTEXT_INDEX.md` - map of canonical docs, runtime files, validation, and local-only context.
- `docs/CURRENT_BUILD_STATE.md` - current repo/build alignment notes and known contradictions.
- `OST_PROJECT_LOG.md` - durable project memory and historical architecture decisions.
- `docs/VALIDATION.md` - commands for docs/tooling validation and future launch-readiness checks.
- `docs/FULL_SHIP_RUNBOOK.md` - full runtime ship process when code changes require Apps Script deployment.

This repository is the shared source of truth. Do not rely on pasted chat snippets when repo files or GitHub history can answer the question.
