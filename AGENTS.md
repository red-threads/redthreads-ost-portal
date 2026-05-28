# Red Threads OST Portal Agent Guide

This is the canonical behavior file for Codex, ChatGPT Atlas, GitHub review, and owner handoffs. If a rule affects agent behavior, put it here instead of repeating it in another doc.

## Read Order

1. `AGENTS.md` - rules, modes, boundaries, and source-of-truth order.
2. `docs/CURRENT_BUILD_STATE.md` - what is true now.
3. `OST_PROJECT_LOG.md` - append-only session and decision history.
4. `docs/RUNBOOK.md` - commands and workflow steps.
5. Narrow references only when needed, such as `docs/EXPORT_LOG_WIDE_SCHEMA.md`.

## Where Information Belongs

- Agent behavior, protected surfaces, data safety, deployment boundaries: `AGENTS.md`.
- Current repo/live/prompt verification state and known mismatches: `docs/CURRENT_BUILD_STATE.md`.
- Decisions, session summaries, commits, validation results, and follow-ups: `OST_PROJECT_LOG.md`.
- Commands for Git, validation, PRs, runtime work, and Full ship: `docs/RUNBOOK.md`.
- Schema/contract references: dedicated narrow reference docs or schema files.

Do not copy the same rule into multiple docs. Link to the canonical source instead.

## Agent Modes

- MODE: Architect - architecture, refactor design, system boundary mapping, docs/schema/test harness planning.
- MODE: Debug - reproduce and fix a specific bug with minimal diff.
- MODE: Produce final code - implement production-ready code and commit changes.
- MODE: Baton pass - write a handoff for the next agent/session.
- MODE: QA reviewer - inspect diffs, live behavior, fixture results, and deployment readiness without making code changes.
- MODE: Full ship - runtime changes must be validated, pushed/versioned/deployed in Apps Script first, smoke-tested, logged, then committed/pushed to GitHub.
- MODE: Plan - inspect first, propose a plan, and wait for approval before editing.

## Source Of Truth

- The current Git working tree and Git history outrank chat memory.
- Repo-verified facts outrank prompt/historical facts.
- Mark uncertain facts as repo verified, live verified, prompt/historical, or blocked/unverified.
- Do not rely on pasted snippets when repo files or GitHub history can answer the question.

## Non-Negotiable Portal Rules

- Preserve immutable `snapshotJson`.
- Preserve Calculator pricing authority.
- Preserve token lookup by EXPORT_LOG Column A; tokens are not project numbers.
- Preserve tokenized direct project links and authenticated dashboard access.
- Preserve the public Red Threads iframe wrapper contract and query passthrough behavior.
- Preserve strict single-view routing, metadata-only dashboard loading, and project-only snapshot parsing when working on the fuller portal architecture.
- Preserve EXPORT_LOG, PORTAL_ORDERS, and PORTAL_ACCOUNTS compatibility.
- Do not treat duplicate `skuKey` values as unique; use `printJobId` and `skuId` for UI/state keys.
- Tier 2000 renders as `2000+ / Call for price` and never displays numeric unit pricing in client UI.

## Protected Surfaces

Do not edit these unless the task explicitly names them:

- Runtime: `apps-script/src/Code.js`, `apps-script/src/Index.html`, `apps-script/src/TaxForm3372Manifest.html`.
- Apps Script config: `apps-script/src/appsscript.json`, `apps-script/src/.clasp.json`.
- Schema/contract files: `schemas/*`, unless a schema/contract task is approved.
- Production Sheet data, Apps Script Script Properties, GitHub settings/secrets, Stripe live config, Cloud Run services, Make scenarios, QuickBooks/Pipedrive/Gmail behavior, and Team Mode permissions.

Do not create a new Apps Script deployment ID unless the owner explicitly approves it.

## Data Safety

Never commit live tokens, tokenized URLs, raw `snapshotJson`, raw `portalStateJson`, raw `submittedStateJson`, raw sheet dumps, session/auth identifiers, customer names, org names, emails, invoice numbers, PO numbers, chat/message content, Stripe secrets, webhook secrets, API keys, Script Properties, private Checkout URLs, passwords, or local fixture access files.

Local-only fixture access belongs in `docs/LIFECYCLE_FIXTURES.local.md`.
Private lifecycle captures belong in `testcases/lifecycle-fixtures/private/`; only `.keep` may be tracked.

## Deployment Boundaries

- Docs/tooling-only changes do not require `clasp push`, `clasp version`, or `clasp deploy`.
- Runtime changes require explicit deployment intent before Full ship.
- Full ship means validate locally, run the Apps Script push/version/deploy sequence to the existing deployment ID, smoke-test, log the result, then commit and push GitHub.
- Owner-directed runtime edits and Full ship requests use direct `main` by default when repo identity is confirmed, the active branch is `main`, the working tree has no unrelated changes, validation passes, and no destructive or high-risk operation is involved.
- Do not create a branch or PR unless the owner explicitly asks for one, repo protection requires one, or the change is high-risk architecture/review work.
- Mainline Full ship means: confirm repo and clean `main`, fast-forward safely, apply the focused runtime change, update the dev badge/revision when applicable, run runtime validation, then run Apps Script first: `clasp status`, `clasp push --force`, `clasp version`, `clasp deploy` to the existing deployment ID, `clasp deployments`, and smoke-test. Only after the Apps Script result is known should `OST_PROJECT_LOG.md`, `docs/CURRENT_BUILD_STATE.md`, local commit(s), and `git push origin main` be completed.
- Run Apps Script ship commands sequentially and wait for each command to exit before starting the next one. Do not parallelize `clasp` commands.
- If a `clasp` push/version/deploy command fails, retry the same command after a short wait before declaring a blocker. If the retry succeeds, continue the ordered sequence. If repeated retries fail, stop and log the blocker. Do not create a new deployment ID, alter `.clasp.json`, or change Script Properties unless explicitly instructed.
- If the owner explicitly instructs a binding repair, verify the live Apps Script project ID from Apps Script itself, run `clasp pull` before any push, validate with `npm run validate:binding`, and log the repo/live-source alignment.

## Working Rules

- Keep changes scoped to the stated mode and task.
- Preserve unrelated user changes.
- Prefer small, inspectable commits.
- Update `OST_PROJECT_LOG.md` when a session changes shared context, workflow, decisions, deployment state, or known risks.
- Update `docs/CURRENT_BUILD_STATE.md` when current repo/live reality changes.
- Use `npm run validate` before staging and again before commit when docs/tooling changes affect guidance.
