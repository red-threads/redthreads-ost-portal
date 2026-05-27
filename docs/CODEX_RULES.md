# CODEX_RULES.md - Red Threads OST Portal Guardrails

Purpose: constrain agent changes so the portal preserves contract integrity, backward compatibility, private-data hygiene, and repeatable deployment discipline.

## 0) Absolute Constraints

1. Do not change the V2 export contract unless the owner explicitly approves a versioned migration.
   - `snapshotJson` top-level shape is `{ "meta": { ... }, "printJobs": [ ... ] }`.
   - Current documented supported family is 1-4 PrintJobs.
   - Duplicate `skuKey` values are allowed and must not be treated as unique.
   - Use `printJobId` and `skuId` for UI/state keys.

2. Do not change token to row lookup semantics.
   - Portal loads via query param `?t=<token>`.
   - Token matches Column A of the `EXPORT_LOG` sheet.
   - Token is not a project number.
   - Project numbers must not be guessed as tokens.

3. Do not change EXPORT_LOG wide schema assumptions.
   - Wide column order is locked and should not be reinterpreted or reordered.
   - JSON columns (`snapshotJson`, `portalStateJson`, `submittedStateJson`) are plain text in Sheets.
   - `snapshotJson` is immutable once written.
   - `portalStateJson` is mutable client/order state.
   - `submittedStateJson` is immutable submitted/order state when applicable.

4. Do not change pricing authority.
   - Pricing truth remains upstream in the Calculator.
   - Portal displays and persists client state; it must not become the pricing engine.
   - Tier 2000 label renders as `2000+ / Call for price`.
   - Tier 2000 never displays numeric unit pricing in client UI.

5. Do not edit deployment/config/runtime files unless the task explicitly includes them.
   - Runtime files: `apps-script/src/Code.js`, `apps-script/src/Index.html`, `apps-script/src/appsscript.json`, `apps-script/src/.clasp.json`.
   - Schema files are contract files; do not change them during docs/tooling passes.
   - Do not create a new Apps Script deployment ID.

## 1) Default Editable Surface

Docs/tooling tasks may edit:

- `AGENTS.md`
- `OST_PROJECT_LOG.md`
- `README.md`
- `.gitignore`
- `docs/*`
- `testcases/*`, excluding private fixture payloads
- `tools/*`
- `package.json`

Runtime tasks may edit only the files named in the approved task. Preserve unrelated user changes and never revert work you did not make.

## 2) Agent Modes

- Architect: architecture, refactor design, boundary mapping, docs/schema/test harness planning.
- Debug: reproduce and fix a specific bug with minimal diff.
- Produce final code: implement production-ready code and commit changes.
- Baton pass: write a handoff for the next agent/session.
- QA reviewer: inspect diffs, live behavior, fixture results, and deployment readiness without changing code.
- Full ship: commit, push, clasp push, version, deploy to the existing deployment ID, and smoke-test when runtime changes require it.
- Plan: inspect first, propose a plan, and wait for approval before editing.

## 3) Scope Control

- Prefer surgical changes over broad refactors.
- Document user-facing behavior changes explicitly.
- New lifecycle truth enters canonical server logic before projection/adapters.
- UI decisions should prefer hydrated workflow context and canonical summary modes, not raw legacy fields.
- Quarantined compatibility layers must not become the basis for new lifecycle decisions.

## 4) Security And Local Data

Never commit live tokens, tokenized URLs, raw customer payloads, raw sheet dumps, session/auth identifiers, Stripe/webhook/API secrets, Script Properties, private Checkout URLs, passwords, invoice/PO numbers, chat/message content, or local fixture access files.

Local-only fixture access belongs in `docs/LIFECYCLE_FIXTURES.local.md`.
Private lifecycle captures belong in `testcases/lifecycle-fixtures/private/`.

## 5) Deployment Discipline

- Docs/tooling-only changes do not require `clasp push`, `clasp version`, or `clasp deploy`.
- Runtime changes require validation, commit, push, clasp push, version, deploy to the existing deployment ID, and smoke testing only when approved for Full ship.
- Do not alter `.clasp.json`, Apps Script Script Properties, GitHub repo settings/secrets, Stripe live config, Cloud Run services, Make scenarios, QuickBooks/Pipedrive/Gmail behavior, or production Sheet data without explicit owner approval.

## 6) If Uncertain

If a request appears to require a contract change, storage schema change, token semantics change, broader Team Mode permissions, payment behavior change, or deployment ID change, stop and ask for owner clarification.

End.
