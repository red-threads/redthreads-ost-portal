# Red Threads OST Portal (Apps Script) — V2

## What this is
A Google Apps Script HTMLService web app that renders an estimate snapshot stored in a Google Sheet tab `EXPORT_LOG`.

Data flow:
Calculator → Make.com → `EXPORT_LOG` (wide row) → Portal loads via `?t=<token>` → parses `snapshotJson` → renders V2.

## Access Modes
- Direct token mode remains supported at raw Apps Script URLs like `.../exec?t=<token>`.
- Embedded first-party wrapper mode is supported by loading the stable base `/exec` URL in an iframe and sending tokens in via `postMessage`.

Wrapper integration details, the current message contract, and a fullscreen first-party wrapper example live in [docs/EMBEDDED_PORTAL_WRAPPER.md](/Users/Josiah/Documents/GitHub/redthreads-ost-portal/docs/EMBEDDED_PORTAL_WRAPPER.md).

## V2 Load Contract (Locked)
- Portal URL param: `t`
  - Example: `...?t=<token>`
- Lookup: match `EXPORT_LOG` Column A (`token`) to `t`.
- Read the matching row and parse:
  - `snapshotJson` (immutable) → render
  - `portalStateJson` (mutable) → hide/show + quantities state

## Snapshot Contract (Locked)
Top-level:
```json
{ "meta": { ... }, "printJobs": [ ... ] }
