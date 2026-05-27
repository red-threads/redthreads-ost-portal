# Atlas Review Guide

Use this guide when ChatGPT Atlas or another review agent inspects the repo.

## Review Order

1. Read `AGENTS.md`.
2. Read `docs/CONTEXT_INDEX.md`.
3. Read `docs/CURRENT_BUILD_STATE.md`.
4. Read `OST_PROJECT_LOG.md`.
5. Inspect the current Git diff before relying on any prompt context.

## Review Stance

- Treat GitHub/repo state as the source of truth.
- Flag contradictions between runtime, docs, and prompt history.
- Do not suggest runtime changes during docs/tooling review unless clearly marked as follow-up.
- Do not request or expose private tokens, customer payloads, raw sheet dumps, or secrets.

## High-Value Checks

- Runtime files are untouched in docs/tooling passes.
- Schema files are untouched unless a schema/contract task explicitly approves them.
- `snapshotJson` remains immutable.
- Token lookup remains by EXPORT_LOG Column A.
- Duplicate `skuKey` values are not treated as unique.
- Tier 2000 renders as `2000+ / Call for price` and does not show numeric unit pricing.
- Local/private fixture paths remain ignored.

## Output Expectations

Lead with risks and contradictions. Include file references and validation gaps. Separate repo-verified facts from historical or prompt-only facts.
