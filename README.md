# Red Threads OST Portal

Google Apps Script HtmlService portal for Red Threads OST estimate/order workflows.

## Start Here

- `AGENTS.md` - canonical agent rules and protected surfaces.
- `docs/CURRENT_BUILD_STATE.md` - current repo/build reality and known mismatches.
- `OST_PROJECT_LOG.md` - append-only session and decision history.
- `docs/RUNBOOK.md` - validation, Git/GitHub, runtime, and Full ship commands.
- `docs/CONTEXT_INDEX.md` - tiny map of the remaining reference docs.

Normal owner-directed work is mainline-first unless explicitly routed through PR review.

## Current V2 Load Contract

Data flow:
Calculator -> Make.com -> `EXPORT_LOG` wide row -> portal loads `?t=<token>` -> parses immutable `snapshotJson` -> renders V2.

Token lookup is by EXPORT_LOG Column A only. A token is not a project number.

Top-level snapshot shape:

```json
{ "meta": { "...": "..." }, "printJobs": [] }
```

For the locked EXPORT_LOG column order, see `docs/EXPORT_LOG_WIDE_SCHEMA.md`.

## Squarespace Wrapper

The active Squarespace `/portal` code block is tracked at `web/squarespace-portal-code-block.html`.
