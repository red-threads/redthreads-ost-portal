# Validation

## Docs/Tooling Pass

Run:

```bash
git status --short --branch
npm run validate
node --check tools/validate-repo.mjs
jq empty apps-script/src/appsscript.json apps-script/src/.clasp.json schemas/snapshot_v2_0_0.schema.json testcases/golden_sample_v2_1pj_min.json
git diff --check
```

Read-only informational checks:

```bash
clasp deployments
clasp versions
```

If clasp returns `Requested entity was not found`, record the result but do not block docs/tooling validation.

## Runtime Pass

In addition to docs/tooling checks, run targeted tests or browser smoke checks for the changed behavior. If runtime files changed and deployment is approved, follow `docs/FULL_SHIP_RUNBOOK.md`.

## Private Data Check

Before staging, verify no live tokens, tokenized URLs, raw customer payloads, raw sheet dumps, session identifiers, secrets, passwords, invoice/PO numbers, private Checkout URLs, or local fixture access files are staged.
