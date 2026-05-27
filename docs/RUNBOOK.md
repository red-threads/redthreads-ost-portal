# Runbook

Commands and workflow steps live here. Rules live in `AGENTS.md`; current facts live in `docs/CURRENT_BUILD_STATE.md`; decisions and session notes live in `OST_PROJECT_LOG.md`.

## Preflight

```bash
git status --short --branch
git remote -v
git branch --show-current
git log --oneline -5
```

For mainline work, ensure the active branch is `main` and fast-forward before editing:

```bash
git pull --ff-only
```

## Mainline Docs/Tooling Workflow

Use this for owner-directed docs, tooling, workflow, validation, and repo-guidance updates.

```bash
git status --short --branch
git branch --show-current
git pull --ff-only
npm run validate
git diff --check
git add <intended-files>
git diff --cached --stat
git commit -m "<type>: <summary>"
git push origin main
```

Do not run clasp for docs/tooling-only changes.

## Mainline Runtime Workflow

Use this for owner-directed Apps Script runtime edits when the owner has not asked for PR review.

```bash
git status --short --branch
git branch --show-current
git pull --ff-only
npm run validate:runtime
git diff --check
git add <intended-files>
git diff --cached --stat
git commit -m "<type>: <summary>"
git push origin main
```

Update `OST_PROJECT_LOG.md` for shipped dev revisions or meaningful runtime state changes.

If an owner-approved runtime task also repairs the local Apps Script binding after verifying the live Script ID from Apps Script itself, run the binding-aware validator:

```bash
npm run validate:binding
```

## Mainline Full Ship Workflow

Use this when the owner says `ship it`, `full ship`, `make it live`, or otherwise asks for the Apps Script runtime change to go live.

```bash
git status --short --branch
git branch --show-current
git pull --ff-only
npm run validate:runtime
git diff --check
git add <intended-files>
git diff --cached --stat
git commit -m "<type>: <summary>"
git push origin main

cd apps-script/src
clasp status
clasp push --force
clasp version "Short release note"
clasp deploy --deploymentId AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw --description "Short release note"
clasp deployments
```

If this repo's clasp syntax requires `--versionNumber`, document the exact working command after a successful verified deployment. Do not guess or create a new deployment ID.

Smoke-test after deployment:

- Direct `/exec` auth shell or login path.
- Direct `/exec?t=<token>` loads exactly one EXPORT_LOG row.
- Branded wrapper `/portal` forwards `t`, `checkoutResult`, and `stripeSessionId`.
- Dashboard loads metadata only.
- Project load parses snapshot only after project selection/direct token load.
- Tier 2000 displays `2000+ / Call for price` without numeric unit pricing.
- ACH remains hidden unless explicitly re-enabled.
- Stripe success, cancel, abandoned checkout, and stale-tab protection when payment runtime changed.

Record version, deployment ID, smoke result, and known issues in `OST_PROJECT_LOG.md`.

## Optional Branch/PR Workflow

Branches and PRs are exceptions, not the default. Use them only when the owner explicitly asks for review, repo protection prevents direct `main`, the work is high-risk architecture/refactor work, or the task is review-only.

```bash
git switch -c codex/<short-task-name>
git add <intended-files>
git diff --cached --stat
git diff --cached --check
git commit -m "<type>: <summary>"
git push -u origin <branch>
```

Do not let GitHub push/PR status block Apps Script deployment when the owner has requested a mainline Full ship and local validation has passed.

## Apps Script Deployment Blocker Handling

If any clasp deployment command returns `Requested entity was not found`:

- Stop the Apps Script deployment flow.
- Do not create a new Apps Script deployment ID.
- Do not alter `.clasp.json` unless the owner explicitly directs a binding repair after the live Apps Script project ID is verified from Apps Script itself.
- Do not change Script Properties.
- Log the blocker in `OST_PROJECT_LOG.md` and `docs/CURRENT_BUILD_STATE.md`.
- Report that GitHub source may be updated while Apps Script live deployment remains blocked until binding/account access is repaired.

## Final Response Requirements

For mainline docs/tooling updates, report branch, files changed, commit SHA, push status, validation results, confirmation that no runtime files changed, and confirmation that no clasp deploy ran.

For Full ship runtime updates, also report clasp push/version/deploy results, deployment ID/version if successful, smoke-test result, and any deployment blocker.
