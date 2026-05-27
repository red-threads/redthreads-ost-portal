# Current Build State

Last aligned: 2026-05-27.

## Verified Repo State

- Local path: `/Users/Josiah/Documents/GitHub/redthreads-ost-portal`.
- Remote: `https://github.com/red-threads/redthreads-ost-portal.git`.
- Base branch at inspection: `main`.
- Runtime root: `apps-script/src/`.
- Tracked runtime files: `Code.js`, `Index.html`, `appsscript.json`, `.clasp.json`.
- Current tracked app is a V2 Apps Script estimate portal that loads `EXPORT_LOG` rows by token and renders `snapshotJson`.
- No `package.json` existed before this build-alignment pass.
- `docs/EXPORT_LOG_WIDE_SCHEMA.md` existed locally but was ignored by `.gitignore`.
- `testcases/lifecycle-fixtures/private/.keep` existed locally but was untracked.

## Current Alignment Gaps

- The prompt describes a fuller dashboard/order/Stripe/lifecycle architecture that is not present in tracked runtime.
- `TaxForm3372Manifest.html` is referenced in current project context but absent from tracked runtime.
- Named lifecycle functions such as `buildPortalOrderSummary_`, `derivePortalLifecycle_`, and dashboard projection helpers are absent from tracked runtime.
- `Index.html` contains ACH promo copy. ACH is supposed to remain deferred/hidden unless explicitly re-enabled; this is a runtime follow-up, not part of this docs/tooling pass.
- `.clasp.json` has script ID `1C9ohEZC8rbGMWVfvyW_jzWjzt8AZAdrS8Idy8kLbi2O7VZ6VoPmQ0cp9`, but `clasp deployments` and `clasp versions` returned `Requested entity was not found` in this environment.
- `schemas/snapshot_v2_0_0.schema.json` allows `printJobs.minItems: 0`, while current project docs/prompt say the supported V2 family is 1-4 PrintJobs. Do not change the schema without a separate schema/contract correction task.

## No Runtime Changes In This Pass

The build-alignment reset intentionally leaves these files untouched:

- `apps-script/src/Code.js`
- `apps-script/src/Index.html`
- `apps-script/src/appsscript.json`
- `apps-script/src/.clasp.json`
- `schemas/snapshot_v2_0_0.schema.json`
- `testcases/golden_sample_v2_1pj_min.json`
