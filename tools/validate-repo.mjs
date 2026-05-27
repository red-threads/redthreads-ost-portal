import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, normalize } from 'node:path';

const requiredFiles = [
  'AGENTS.md',
  'OST_PROJECT_LOG.md',
  'README.md',
  'apps-script/src/TaxForm3372Manifest.html',
  'docs/CONTEXT_INDEX.md',
  'docs/CURRENT_BUILD_STATE.md',
  'docs/RUNBOOK.md',
  'docs/EXPORT_LOG_WIDE_SCHEMA.md',
  'docs/LIFECYCLE_FIXTURES.local.example.md',
  'web/squarespace-portal-code-block.html',
  'testcases/lifecycle-fixtures/README.md',
  'testcases/lifecycle-fixtures/private/.keep',
  '.github/pull_request_template.md',
  '.github/workflows/validate.yml',
  'package.json',
  'tools/validate-repo.mjs'
];

const retiredDocs = [
  'docs/CODEX_RULES.md',
  'docs/DECISION_LOG.md',
  'docs/ATLAS_REVIEW_GUIDE.md',
  'docs/CODEX_GITHUB_CLI_WORKFLOW.md',
  'docs/DEPLOYMENT_NOTES.md',
  'docs/FULL_SHIP_RUNBOOK.md',
  'docs/VALIDATION.md',
  'docs/INTEGRATION_REGISTRY.md',
  'docs/AGENT_SESSION_TEMPLATE.md'
];

const runtimeFiles = new Set([
  'apps-script/src/Code.js',
  'apps-script/src/Index.html',
  'apps-script/src/TaxForm3372Manifest.html'
]);

const claspBindingFile = 'apps-script/src/.clasp.json';

const lockedFiles = new Set([
  'apps-script/src/appsscript.json',
  'schemas/snapshot_v2_0_0.schema.json',
  'testcases/golden_sample_v2_1pj_min.json'
]);

const requiredMentions = [
  ['AGENTS.md', 'Where Information Belongs'],
  ['AGENTS.md', 'Do not copy the same rule into multiple docs'],
  ['docs/CURRENT_BUILD_STATE.md', 'printJobs.minItems: 0'],
  ['OST_PROJECT_LOG.md', 'Session Entry Template'],
  ['docs/RUNBOOK.md', 'Full Ship'],
  ['docs/CONTEXT_INDEX.md', 'Core reading set']
];

const privatePatterns = [
  /script\.google\.com\/macros\/s\/[^/\s]+\/exec\?t=/i,
  /DEFAULT_TEAM_MODE_PASSWORD\s*=\s*['"][^'"]+['"]/,
  /stripe_(live|test)_[A-Za-z0-9]+/i,
  /whsec_[A-Za-z0-9]+/i,
  /sk_(live|test)_[A-Za-z0-9]+/i
];

const linkCheckedFiles = [
  'README.md',
  'AGENTS.md',
  'OST_PROJECT_LOG.md',
  'docs/CONTEXT_INDEX.md',
  'docs/CURRENT_BUILD_STATE.md',
  'docs/RUNBOOK.md'
];

function git(args, options = {}) {
  return execFileSync('git', args, { encoding: 'utf8', ...options }).trim();
}

function tryGit(args) {
  try {
    return git(args);
  } catch {
    return '';
  }
}

function listChangedFiles() {
  const files = new Set();
  const status = tryGit(['status', '--porcelain']);
  for (const line of status.split('\n').filter(Boolean)) {
    files.add(line.slice(3).trim().replace(/^"|"$/g, ''));
  }

  const baseRef = process.env.GITHUB_BASE_REF
    ? `origin/${process.env.GITHUB_BASE_REF}`
    : (process.env.VALIDATE_BASE_REF || '');
  if (baseRef) {
    const diff = tryGit(['diff', '--name-only', `${baseRef}...HEAD`]);
    for (const file of diff.split('\n').filter(Boolean)) {
      files.add(file.trim());
    }
  }

  return [...files].filter(Boolean);
}

function listTrackedFiles() {
  return git(['ls-files'])
    .split('\n')
    .map((file) => file.trim())
    .filter(Boolean);
}

function isTextCandidate(file) {
  return file === '.gitignore' || ['.md', '.json', '.mjs', '.js', '.html', '.txt', '.yml', '.yaml'].includes(extname(file));
}

function isRelativeDocLink(target) {
  return !target.startsWith('#') &&
    !/^[a-z][a-z0-9+.-]*:/i.test(target) &&
    !target.startsWith('mailto:');
}

function stripAnchorAndQuery(target) {
  return target.split('#')[0].split('?')[0];
}

const errors = [];
const allowRuntimeChanges =
  process.env.VALIDATE_ALLOW_RUNTIME_CHANGES === '1' ||
  process.argv.includes('--allow-runtime');
const allowClaspBindingChange =
  process.env.VALIDATE_ALLOW_CLASP_BINDING === '1' ||
  process.argv.includes('--allow-clasp-binding');

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    errors.push(`Missing required canonical file: ${file}`);
  }
}

for (const file of retiredDocs) {
  if (existsSync(file)) {
    errors.push(`Retired duplicate doc should not exist: ${file}`);
  }
}

const changedFiles = listChangedFiles();
const trackedFiles = listTrackedFiles();

for (const file of changedFiles) {
  if (runtimeFiles.has(file) && !allowRuntimeChanges) {
    errors.push(`Runtime file changed without VALIDATE_ALLOW_RUNTIME_CHANGES=1: ${file}`);
  }
  if (file === claspBindingFile && !allowClaspBindingChange) {
    errors.push(`Apps Script binding changed without VALIDATE_ALLOW_CLASP_BINDING=1: ${file}`);
  }
  if (lockedFiles.has(file)) {
    errors.push(`Locked config/schema/test fixture changed: ${file}`);
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

for (const file of trackedFiles) {
  if (!existsSync(file) || !isTextCandidate(file)) continue;
  const body = readFileSync(file, 'utf8');
  for (const pattern of privatePatterns) {
    if (pattern.test(body)) {
      errors.push(`Potential private token/secret pattern found in ${file}`);
    }
  }
}

const markdownLinkPattern = /\[[^\]]+\]\(([^)]+)\)/g;
for (const file of linkCheckedFiles) {
  if (!existsSync(file)) continue;
  const body = readFileSync(file, 'utf8');
  let match;
  while ((match = markdownLinkPattern.exec(body)) !== null) {
    const target = (match[1] || '').trim();
    if (!target || !isRelativeDocLink(target)) continue;
    const cleanTarget = stripAnchorAndQuery(target);
    if (!cleanTarget || cleanTarget.includes('*')) continue;
    const resolved = normalize(join(dirname(file), cleanTarget));
    if (!existsSync(resolved)) {
      errors.push(`${file} references missing local file: ${target}`);
      continue;
    }
    if (!statSync(resolved).isFile()) {
      errors.push(`${file} local reference is not a file: ${target}`);
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
