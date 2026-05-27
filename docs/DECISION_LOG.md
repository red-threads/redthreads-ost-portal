# Decision Log

## 2026-05-27 - Build Alignment Is Docs/Tooling Only

Decision: this pass creates shared-agent visibility, workflow docs, fixture hygiene, and validation tooling only.

Implication: runtime files, schema files, Apps Script manifest, and clasp binding remain untouched. No `clasp push`, `clasp version`, or `clasp deploy` is required.

## 2026-05-27 - Document Schema PrintJob Count Contradiction

Decision: do not modify `schemas/snapshot_v2_0_0.schema.json` in this pass.

Context: current docs/prompt say the supported V2 family is 1-4 PrintJobs, while the schema currently has `printJobs.minItems: 0`.

Follow-up: approve a separate schema/contract correction task before changing the schema.

## 2026-05-27 - Duplicate skuKey Values Are Allowed

Decision: docs must state that duplicate `skuKey` values are allowed and must not be treated as unique.

Implication: UI/state keys should use `printJobId` and `skuId`.

## 2026-05-27 - ACH Copy Is Runtime Follow-Up

Decision: document the ACH mismatch only.

Context: current `Index.html` contains ACH promo copy, while project context says ACH is deferred/hidden unless explicitly re-enabled.

Follow-up: handle under a runtime-ui task if the owner approves.

## 2026-05-27 - Deployment Verification Is Currently Blocked Locally

Decision: preserve expected deployment ID from project context, but mark local clasp verification as blocked.

Context: `clasp deployments` and `clasp versions` returned `Requested entity was not found` from the current local binding/account.
