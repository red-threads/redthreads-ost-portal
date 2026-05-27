# Full Ship Runbook

Use Full ship only when runtime changes are approved and need deployment.

## Preconditions

- Runtime files changed intentionally.
- Owner approved deployment.
- No unrelated user changes are staged.
- Existing Apps Script deployment ID will be reused.
- No secrets, live tokens, raw customer payloads, or private fixture data are staged.

## Commands

```bash
git status --short --branch
npm run validate
jq empty apps-script/src/appsscript.json apps-script/src/.clasp.json
git diff --check
```

Then, only for approved runtime deployment:

```bash
clasp push
clasp version "Short release note"
clasp deploy --deploymentId <existing-deployment-id> --versionNumber <version>
```

## Smoke Tests

- Direct `/exec` auth shell or login path loads as expected.
- Direct `/exec?t=<token>` loads exactly one EXPORT_LOG row.
- Branded wrapper `/portal` forwards `t`, `checkoutResult`, and `stripeSessionId`.
- Dashboard loads metadata only.
- Project load parses snapshot only after project selection/direct token load.
- Tier 2000 displays `2000+ / Call for price` without numeric unit pricing.
- ACH remains hidden unless explicitly re-enabled.
- Stripe success, cancel, abandoned checkout, and stale-tab protection are tested when payment runtime changed.

## Record Keeping

After deployment, update `docs/DEPLOYMENT_NOTES.md` or a release note with version number, deployment ID, smoke result, and known issues.
