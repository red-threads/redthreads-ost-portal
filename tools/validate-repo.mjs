import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const requiredFiles = [
  'AGENTS.md',
  'OST_PROJECT_LOG.md',
  'README.md',
  'docs/CONTEXT_INDEX.md',
  'docs/CURRENT_BUILD_STATE.md',
  'docs/DECISION_LOG.md',
  'docs/ATLAS_REVIEW_GUIDE.md',
  'docs/CODEX_GITHUB_CLI_WORKFLOW.md',
  'docs/DEPLOYMENT_NOTES.md',
  'docs/INTEGRATION_REGISTRY.md',
  'docs/AGENT_SESSION_TEMPLATE.md',
  'docs/FULL_SHIP_RUNBOOK.md',
  'docs/VALIDATION.md',
  'docs/LIFECYCLE_FIXTURES.local.example.md',
  'docs/EXPORT_LOG_WIDE_SCHEMA.md',
  'docs/CODEX_RULES.md',
  'testcases/lifecycle-fixtures/README.md',
  'testcases/lifecycle-fixtures/private/.keep',
  'package.json',
  'tools/validate-repo.mjs'
];

const forbiddenChanged = new Set([
  'apps-script/src/Code.js',
  'apps-script/src/Index.html',
  'apps-script/src/appsscript.json',
  'apps-script/src/.clasp.json',
  'schemas/snapshot_v2_0_0.schema.json',
  'testcases/golden_sample_v2_1pj_min.json'
]);

const requiredMentions = [
  ['AGENTS.md', 'MODE'],
  ['docs/CURRENT_BUILD_STATE.md', 'printJobs.minItems: 0'],
  ['docs/DECISION_LOG.md', 'Duplicate skuKey'],
  ['docs/DEPLOYMENT_NOTES.md', 'Do not run `clasp push`'],
  ['docs/VALIDATION.md', 'npm run validate'],
  ['docs/INTEGRATION_REGISTRY.md', 'Do not add secrets']
];

const privatePatterns = [
  /script\.google\.com\/macros\/s\/[^/\s]+\/exec\?t=/i,
  /stripe_(live|test)_[A-Za-z0-9]+/i,
  /whsec_[A-Za-z0-9]+/i,
  /sk_(live|test)_[A-Za-z0-9]+/i
];

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

const errors = [];

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    errors.push(`Missing required file: ${file}`);
  }
}

const status = git(['status', '--porcelain']);
const changedFiles = status
  .split('\n')
  .filter(Boolean)
  .map((line) => line.slice(3).trim().replace(/^"|"$/g, ''));

for (const file of changedFiles) {
  if (forbiddenChanged.has(file)) {
    errors.push(`Forbidden docs/tooling-pass change detected: ${file}`);
  }
  if (file === 'docs/LIFECYCLE_FIXTURES.local.md') {
    errors.push('Local fixture access file must not be tracked or staged.');
  }
  if (file.startsWith('testcases/lifecycle-fixtures/private/') && file !== 'testcases/lifecycle-fixtures/private/.keep') {
    errors.push(`Private lifecycle capture must not be tracked or staged: ${file}`);
  }
}

for (const [file, text] of requiredMentions) {
  if (!existsSync(file)) continue;
  const body = readFileSync(file, 'utf8');
  if (!body.includes(text)) {
    errors.push(`${file} must mention: ${text}`);
  }
}

for (const file of changedFiles) {
  if (!existsSync(file) || file.startsWith('.git/')) continue;
  if (!(/\.(md|json|mjs|js|html|txt|gitignore)$/.test(file) || file === '.gitignore')) continue;
  const body = readFileSync(file, 'utf8');
  for (const pattern of privatePatterns) {
    if (pattern.test(body)) {
      errors.push(`Potential private token/secret pattern found in ${file}`);
    }
  }
}

if (errors.length) {
  console.error('Repo validation failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Repo validation passed.');
