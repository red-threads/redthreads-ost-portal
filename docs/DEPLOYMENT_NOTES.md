# Deployment Notes

## Current Expected Stable Deployment

- Expected stable Apps Script deployment ID: `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw`.
- Expected stable public Apps Script URL: `https://script.google.com/macros/s/AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw/exec`.
- Public branded wrapper URL: `https://www.redthreads.com/portal`.

Local verification note: during 2026-05-27 inspection, `clasp deployments` and `clasp versions` returned `Requested entity was not found` from the current local binding/account.

## No-Deploy Cases

Do not run `clasp push`, `clasp version`, or `clasp deploy` for docs/tooling-only changes.

## Full-Ship Cases

Runtime changes require the Full ship process:

1. Validate locally.
2. Commit and push source changes.
3. Run `clasp push`.
4. Create a version.
5. Deploy to the existing deployment ID.
6. Smoke-test direct Apps Script URL and branded wrapper.
7. Record deployment notes and validation results.

Do not create a new deployment ID unless the owner explicitly approves it.
