# CODEX_RULES.md — Red Threads OST Portal (V2) Guardrails

Purpose: These rules constrain Codex changes so we preserve contract integrity, backward compatibility, and safe deployment discipline.

---

## 0) Absolute constraints (non-negotiable)

1) **Do not change the V2 export contract**
- Snapshot contract is locked:
  - `snapshotJson` top-level: `{ "meta": {…}, "printJobs": [ … ] }`
  - Supports **1–4 PrintJobs** (PJ1–PJ4) per snapshot.
  - Duplicate `skuKey` values are allowed and are unique.

2) **Do not change token → row lookup semantics**
- Portal loads via query param: `?t=<token>`
- Token matches **Column A** of the `EXPORT_LOG` sheet.
- Portal reads the matching row, parses `snapshotJson`, and renders V2.

3) **Do not change EXPORT_LOG wide schema assumptions**
- Wide column order is locked and should not be reinterpreted or reordered.
- JSON columns (`snapshotJson`, `portalStateJson`, `submittedStateJson`) are treated as **plain text** in Sheets.

4) **Do not change pricing authority**
- Pricing truth remains upstream (Calculator).
- Portal is display + client state (quantities/hide) + validation only.
- Portal must enforce the tier display rule:
  - Tier **2000** label must render as **“2000+ / Call for price”**
  - Tier 2000 must **never** display numeric pricing in UI.

5) **Do not edit deployment/config files unless explicitly instructed**
- Do not change: `appsscript.json`, `.clasp.json`, or any clasp/GCP bindings.

---

## 1) Files Codex is allowed to edit by default

Allowed:
- `apps-script/src/Code.js`
- `apps-script/src/Index.html`
- Documentation/test assets under:
  - `docs/*`
  - `schemas/*`
  - `testcases/*`

Disallowed unless explicitly requested:
- `apps-script/src/appsscript.json`
- `.clasp.json`
- any auth/secret/config files

---

## 2) Scope control (how to work safely)

1) **No major diffs unless explicitly asked to**
- Prefer surgical changes over refactors.
- confirm before large renames or moving code blocks.

2) **No silent behavior changes**
- If you change any user-facing behavior (read-only rules, Save/Submit, hide/show), document it explicitly.

3) **Separation of concerns**
- Data parsing and validation belongs in `Code.js` and the JS VM bootstrap.
- UI rendering and interaction belongs in `Index.html`.

4) **Stable identifiers**
- Use `printJobId` and `skuId` as keys (not skuKey).
- Treat `printJobId` as snapshot-local positional (`PJ1`, `PJ2`, etc.).

---

## 3) Required output format from Codex (every time)

Codex must respond with:

1) Full updated file content for each file changed
2) A concise bullet list:
   - what changed
   - why it changed
   - risk notes (if any)
3) A micro test plan (5 steps) validating:
   - `?t=<token>` load works
   - 1–4 PrintJobs render
   - tier 2000 rule enforced
   - duplicate skuKey safe
   - Save state persists and reload behavior is correct

---

## 4) “UI refinement” mode rules

When asked to refine UI:
- Allowed: layout, styling, hierarchy, navigation, collapsible sections, better tables/cards.
- Not allowed: changing contract shape, changing row lookup, or data relationship structure.
- Keep UI fast: avoid rendering huge DOM blocks unnecessarily; prefer collapsible sections and lazy rendering if needed.

---

## 5) “Architect” mode rules (only when explicitly enabled)

If the user explicitly says MODE: Architect:
- You may propose refactors, file modularization, test harnesses, and schema validation.
- Still must preserve the V2 contract and row lookup unless a deliberate version bump is approved.

---

## 6) If uncertain

If a request appears to require:
- a contract change, or
- a storage schema change, or
- a token semantics change

STOP and ask for clarification before proceeding.

End.