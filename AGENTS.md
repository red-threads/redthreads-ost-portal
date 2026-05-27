# Red Threads OST Portal Agent Guide

This repo is the shared source of truth for Codex, ChatGPT Atlas, GitHub live inspection, and the project owner. Read this file plus `docs/CONTEXT_INDEX.md` before changing code or workflow.

## Source Of Truth Order

1. Current Git working tree and Git history.
2. `docs/CURRENT_BUILD_STATE.md`.
3. `OST_PROJECT_LOG.md`.
4. Guardrail docs in `docs/`.
5. Chat memory or pasted snippets, only after reconciling with the repo.

## Agent Modes

- MODE: Architect - architecture, refactor design, system boundary mapping, docs/schema/test harness planning.
- MODE: Debug - reproduce and fix a specific bug with minimal diff.
- MODE: Produce final code - implement production-ready code and commit changes.
- MODE: Baton pass - write a handoff for the next agent/session.
- MODE: QA reviewer - inspect diffs, live behavior, fixture results, and deployment readiness without making code changes.
- MODE: Full ship - runtime changes must be committed, pushed, clasp-pushed, versioned, deployed to the existing deployment ID, and smoke-tested.
- MODE: Plan - inspect first, propose a plan, and wait for approval before editing.

## Non-Negotiable Portal Rules

- Preserve immutable `snapshotJson`.
- Preserve Calculator pricing authority.
- Preserve tokenized direct project links and authenticated dashboard access.
- Preserve the public Red Threads iframe wrapper contract and query passthrough behavior.
- Preserve strict single-view routing, metadata-only dashboard loading, and project-only snapshot parsing when working on the fuller portal architecture.
- Preserve EXPORT_LOG, PORTAL_ORDERS, and PORTAL_ACCOUNTS compatibility.
- Do not create a new Apps Script deployment ID.
- Do not expose or commit secrets, live tokens, tokenized URLs, raw customer payloads, or private fixture access.

## Default Change Boundaries

Docs/tooling passes may update docs, tests, validation scripts, and fixture hygiene files. They must not alter runtime, schema, Apps Script manifest, or clasp binding files.

Runtime passes must name the exact runtime files in scope and must state whether Apps Script deployment is required.

## Validation

Use `docs/VALIDATION.md` for command details. For docs/tooling passes, `npm run validate` is the canonical local validation command once `package.json` exists.
