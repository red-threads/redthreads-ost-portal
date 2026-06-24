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

Use this for owner-directed Apps Script runtime edits when the owner has not asked for PR review and has not asked to make the change live. If the owner asks to ship, full ship, make live, or deploy, use the Full Ship workflow instead.

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

cd apps-script/src
clasp status
clasp push --force
clasp version "Short release note"
clasp deploy --deploymentId AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw --versionNumber <created-version-number> --description "Short release note"
clasp deployments

cd ../..
# Smoke-test the stable deployment before GitHub push.
# Then update OST_PROJECT_LOG.md and docs/CURRENT_BUILD_STATE.md with the result.
npm run validate:runtime
git diff --check
git add <intended-files>
git diff --cached --stat
git commit -m "<type>: <summary>"
git push origin main
```

Verified deployment syntax on 2026-05-27 used `--versionNumber` with the existing stable deployment ID. Do not guess or create a new deployment ID.

Apps Script is first in Full ship. Do not run `git push origin main` until `clasp push`, version creation, deploy, deployment verification, and smoke test have finished or a blocker has been logged. Run each `clasp` command sequentially and wait for its exit status before starting the next command.

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

If any `clasp push`, `clasp version`, or `clasp deploy` command fails:

- Wait a few seconds and retry the same command once before declaring a blocker.
- If the retry succeeds, continue the ordered Apps Script-first sequence.
- If repeated retries fail, stop the Apps Script deployment flow.
- Do not create a new Apps Script deployment ID.
- Do not alter `.clasp.json` unless the owner explicitly directs a binding repair after the live Apps Script project ID is verified from Apps Script itself.
- Do not change Script Properties.
- Log the blocker in `OST_PROJECT_LOG.md` and `docs/CURRENT_BUILD_STATE.md`.
- Push GitHub only after the blocker is logged, so GitHub reflects the true live deployment state.

## Owner Email Review Suite Trigger

Use this when the deployed owner email review suite should be sent without opening the portal browser.

One-time setup:

- Set Apps Script Script Property `EMAIL_REVIEW_TRIGGER_SECRET` to a strong owner-only value.
- Set the same value locally as `RT_EMAIL_REVIEW_TRIGGER_SECRET` in ignored `.env` or in the shell.

Commands:

```bash
npm run email-review:suite -- --dry-run
npm run email-review:suite
```

Useful options:

```bash
npm run email-review:suite -- --no-reset
npm run email-review:suite -- --dry-run --fixture-source=storage
npm run email-review:status
npm run email-review:suite -- --team=larryfinkerbean@gmail.com --client=josiah@redthreads.com --ap=josiah@redthreads.com
```

Behavior:

- The command calls the protected `send_email_review_suite_headless` web action.
- It reuses the latest validated portal-rendered invoice artifact from fixture/order rows.
- It never generates fallback invoice PDFs.
- It returns only redacted labels, recipient classes, attachment counts, and sent/skipped/failed counts.
- `--fixture-source=storage` reads `FIXTURE_EXPORT`, `FIXTURE_PORTAL_ORDERS`, and `FIXTURE_STRIPE_EVENTS` directly and does not reset active runtime tabs or clear `PORTAL_EMAIL_QUEUE`.
- `npm run email-review:status` calls the protected read-only status action and reports active-tab fixture/live classification, redacted queue counts by status, fixture header compatibility, and scheduled trigger status.
- If no validated portal-rendered artifact exists, use the unlocked Team Mode browser path to refresh the artifact first.

## Final Response Requirements

For mainline docs/tooling updates, report branch, files changed, commit SHA, push status, validation results, confirmation that no runtime files changed, and confirmation that no clasp deploy ran.

For Full ship runtime updates, also report clasp push/version/deploy results, deployment ID/version if successful, smoke-test result, and any deployment blocker.
