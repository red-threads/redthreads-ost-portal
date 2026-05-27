# Runbook

Commands and workflow steps live here. Rules live in `AGENTS.md`; current facts live in `docs/CURRENT_BUILD_STATE.md`; decisions and session notes live in `OST_PROJECT_LOG.md`.

## Preflight

```bash
git status --short --branch
git remote -v
git branch --show-current
git log --oneline -5
```

## Docs/Tooling Validation

```bash
npm run validate
node --check tools/validate-repo.mjs
jq empty apps-script/src/appsscript.json apps-script/src/.clasp.json schemas/snapshot_v2_0_0.schema.json testcases/golden_sample_v2_1pj_min.json package.json
git diff --check
```

Read-only clasp checks may be useful, but do not block docs/tooling work if the current local binding returns `Requested entity was not found`:

```bash
clasp deployments
clasp versions
```

## Git And PR Flow

```bash
git switch -c codex/<short-task-name>
git add <intended-files>
git diff --cached --stat
git diff --cached --check
git commit -m "<type>: <summary>"
git push -u origin <branch>
```

Stage only intended files. Never stage private fixture data or unrelated user changes.

## Runtime Pass

Use a runtime pass only when the task explicitly names runtime files. Run validation with runtime changes enabled, plus targeted browser or Apps Script checks for the changed behavior.

```bash
VALIDATE_ALLOW_RUNTIME_CHANGES=1 npm run validate
```

Update `docs/CURRENT_BUILD_STATE.md` if repo/live reality changes and append a short entry to `OST_PROJECT_LOG.md`.

## Full Ship

Full ship requires explicit owner approval and runtime changes that need deployment.

```bash
npm run validate
clasp push
clasp version "Short release note"
clasp deploy --deploymentId <existing-deployment-id> --versionNumber <version>
```

Smoke-test:

- Direct `/exec` auth shell or login path.
- Direct `/exec?t=<token>` loads exactly one EXPORT_LOG row.
- Branded wrapper `/portal` forwards `t`, `checkoutResult`, and `stripeSessionId`.
- Dashboard loads metadata only.
- Project load parses snapshot only after project selection/direct token load.
- Tier 2000 displays `2000+ / Call for price` without numeric unit pricing.
- ACH remains hidden unless explicitly re-enabled.
- Stripe success, cancel, abandoned checkout, and stale-tab protection when payment runtime changed.

Record version, deployment ID, smoke result, and known issues in `OST_PROJECT_LOG.md`.
