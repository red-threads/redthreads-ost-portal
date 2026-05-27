PRs are optional in this repo. Owner-directed runtime Full ships and normal docs/tooling updates default to direct `main` commits when the working tree is clean and validation passes. Use this template only when the owner explicitly asks for a PR or when repo protection/risk requires review.

## Mode

- [ ] Architect
- [ ] Debug
- [ ] Produce final code
- [ ] Baton pass
- [ ] QA reviewer
- [ ] Full ship
- [ ] Plan

## Impact

- Runtime files changed: yes / no
- Schema files changed: yes / no
- Apps Script deploy required: yes / no
- Current-state or project-log update required: yes / no

## Validation

- [ ] `npm run validate`
- [ ] JSON/schema manifest parse check, when relevant
- [ ] `git diff --check`
- [ ] Private data check completed

## Notes

Summarize changed files, decisions, risks, and follow-ups.
