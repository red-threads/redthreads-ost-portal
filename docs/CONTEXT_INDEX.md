# Context Index

Use this map to orient any agent, reviewer, or owner session.

## Start Here

- `AGENTS.md` - operating rules, agent modes, source-of-truth order, and change boundaries.
- `docs/CURRENT_BUILD_STATE.md` - current repo alignment, verified facts, contradictions, and risks.
- `OST_PROJECT_LOG.md` - durable project memory and historical architecture context.
- `docs/CODEX_RULES.md` - detailed guardrails for Codex and other agents.

## Runtime

- `apps-script/src/Code.js` - Apps Script server runtime.
- `apps-script/src/Index.html` - HtmlService client runtime.
- `apps-script/src/appsscript.json` - Apps Script manifest.
- `apps-script/src/.clasp.json` - clasp binding.

Do not edit runtime files during docs/tooling passes.

## Data Contracts

- `docs/EXPORT_LOG_WIDE_SCHEMA.md` - locked EXPORT_LOG column order.
- `schemas/snapshot_v2_0_0.schema.json` - tracked JSON schema for the V2 snapshot contract.
- `testcases/golden_sample_v2_1pj_min.json` - minimal safe sample fixture.

## Shared Visibility Docs

- `docs/DECISION_LOG.md` - decisions, contradictions, and follow-up items.
- `docs/INTEGRATION_REGISTRY.md` - known systems, IDs, and verification status.
- `docs/ATLAS_REVIEW_GUIDE.md` - ChatGPT Atlas review workflow.
- `docs/CODEX_GITHUB_CLI_WORKFLOW.md` - Git/GitHub workflow for Codex sessions.
- `docs/DEPLOYMENT_NOTES.md` - deployment ID, deploy rules, and no-deploy cases.
- `docs/FULL_SHIP_RUNBOOK.md` - runtime full-ship path.
- `docs/AGENT_SESSION_TEMPLATE.md` - reusable session handoff template.
- `docs/VALIDATION.md` - local validation commands.

## Local-Only Context

- `docs/LIFECYCLE_FIXTURES.local.md` - local/private fixture access only; never commit.
- `testcases/lifecycle-fixtures/private/` - private lifecycle captures only; only `.keep` is tracked.
- `bound-google-sheet/`, `assets/`, `.playwright-mcp/` - ignored local artifacts.

## Agent Modes

- MODE: Architect
- MODE: Debug
- MODE: Produce final code
- MODE: Baton pass
- MODE: QA reviewer
- MODE: Full ship
- MODE: Plan
