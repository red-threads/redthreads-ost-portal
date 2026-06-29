# Dashboard Loading Live Proof Checklist

Use this checklist after a deployed runtime change when validating dashboard loading speed and hierarchy. Do not paste credentials, account links, bearer values, tokens, customer names, emails, private URLs, or raw payloads into this file or into shared logs.

## Console Capture

1. Open DevTools before navigating.
2. Filter console output for:
   - `RT-LOAD-TIMING-CLIENT-JSON`
   - `RT-LOAD-TIMING-WRAPPER-JSON`
3. Save only redacted timing objects. Keep fields such as `phase`, `routeType`, `source`, `budgetName`, `budgetMs`, `budgetElapsedMs`, `withinBudget`, `loaderShown`, `cacheHit`, `prefetchHit`, `queueDepth`, `activeCount`, `completedCount`, and `failedCount`.
4. Do not save or share URLs, tokens, account access links, emails, names, or payload bodies.

## Smoke Matrix

- Login to dashboard: loader hides after the first six rows have metadata, order progress, thumbnails, and renderable summary peek readiness.
- Direct account dashboard: same first-six readiness contract, with timing for `dashboard_first_reveal`.
- Token dashboard: same first-six readiness contract, with timing for `dashboard_first_reveal`.
- Project link to Dashboard button: prefer `dashboard_return_mounted`; no global loader should appear when mounted state is usable.
- Sales tax and credit terms close-to-dashboard: prefer `account_document_resume_mounted`; no second full dashboard loader on no-mutation close.
- `Load older jobs`: each click reveals exactly six more rows and logs `load_older_batch_reveal`; paired progress/thumbnail hydration logs `paired_row_hydration`.
- Top-six Project Peek opened immediately after reveal: cached summary or full payload renders without a blank modal; full upgrade can happen after render.
- Lower-row Project Peek opened before hydration: existing shell/shimmer appears, then the payload renders or fails gracefully.

## Acceptance Notes

- Full Project Peek hydration must not block first dashboard reveal.
- Background full-peek concurrency should remain capped at `2`.
- Older-row progress and thumbnail hydration should not be delayed by idle full-peek upgrades.
- The only acceptable loader on project open is a true cold fetch or an in-flight prefetch that exceeds the bounded delay.
