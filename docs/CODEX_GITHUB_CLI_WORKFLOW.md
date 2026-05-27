# Codex GitHub CLI Workflow

## Standard Branch Flow

1. Start from a clean understanding of the working tree:
   - `git status --short --branch`
   - `git remote -v`
   - `git branch --show-current`
   - `git log --oneline -5`
2. Create a scoped branch:
   - `git switch -c codex/<short-task-name>`
3. Make only approved changes.
4. Validate with `docs/VALIDATION.md`.
5. Stage only intended files:
   - `git add <file> ...`
6. Review staged diff:
   - `git diff --cached --stat`
   - `git diff --cached --check`
7. Commit with a clear message.
8. Push:
   - `git push -u origin <branch>`

## Safety Rules

- Never run `git reset --hard` or force-push unless explicitly requested.
- Never revert unrelated user changes.
- Do not stage ignored private artifacts.
- Use GitHub as inspection and review surface; do not use GitHub settings/secrets/admin changes without explicit owner approval.

## Docs/Tooling Pass Rule

Docs/tooling passes can be committed and pushed without Apps Script deployment.
