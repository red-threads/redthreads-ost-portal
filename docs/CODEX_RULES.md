# Codex Rules — Red Threads OST Portal

## Allowed files to edit (default)
- apps-script/src/Code.js
- apps-script/src/Index.html

## Do NOT edit unless explicitly requested
- apps-script/src/appsscript.json
- apps-script/src/.clasp.json
- Any files outside apps-script/src/

## Non-negotiables
- Keep existing function names stable.
- Preserve doGet / routing behavior.
- No “framework rewrites” or large refactors unless asked.
- Prefer minimal diffs over rearranging code.

## Output expectations
- Return full updated file(s) when changes are requested.
- Include a short bullet list describing what changed and why.
- If assumptions are required, state them explicitly.