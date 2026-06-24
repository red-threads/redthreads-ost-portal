#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const DEFAULT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw/exec';
const DEFAULT_CLIENT_EMAIL = 'josiah@redthreads.com';
const DEFAULT_AP_EMAIL = 'josiah@redthreads.com';
const DEFAULT_TEAM_EMAIL = 'larryfinkerbean@gmail.com';

function loadLocalEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) return;
    const key = match[1];
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  });
}

function parseArgs(argv) {
  const opts = {
    dryRun: false,
    resetFixtures: true,
    fixtureSource: 'active',
    url: process.env.RT_EMAIL_REVIEW_WEB_APP_URL || DEFAULT_WEB_APP_URL,
    clientEmail: DEFAULT_CLIENT_EMAIL,
    apEmail: DEFAULT_AP_EMAIL,
    teamEmail: DEFAULT_TEAM_EMAIL
  };
  argv.forEach((arg) => {
    if (arg === '--dry-run') opts.dryRun = true;
    else if (arg === '--no-reset') opts.resetFixtures = false;
    else if (arg.startsWith('--fixture-source=')) opts.fixtureSource = arg.slice('--fixture-source='.length).trim() || 'active';
    else if (arg.startsWith('--url=')) opts.url = arg.slice('--url='.length).trim();
    else if (arg.startsWith('--client=')) opts.clientEmail = arg.slice('--client='.length).trim();
    else if (arg.startsWith('--ap=')) opts.apEmail = arg.slice('--ap='.length).trim();
    else if (arg.startsWith('--team=')) opts.teamEmail = arg.slice('--team='.length).trim();
    else if (arg === '--help' || arg === '-h') {
      opts.help = true;
    } else {
      throw new Error(`Unsupported argument: ${arg}`);
    }
  });
  return opts;
}

function printHelp() {
  console.log([
    'Usage: npm run email-review:suite -- [options]',
    '',
    'Options:',
    '  --dry-run       Validate auth, recipients, fixtures, and stored portal artifact without sending.',
    '  --no-reset      Do not reset fixture tabs before the suite.',
    '  --fixture-source=storage  Read FIXTURE_* tabs directly without active-tab reset or queue clear.',
    '  --team=<email>  Override review-suite team recipient.',
    '  --client=<email> Override review-suite client recipient.',
    '  --ap=<email>    Override review-suite AP recipient.',
    '  --url=<url>     Override the Apps Script web app URL.',
    '',
    'Environment:',
    '  RT_EMAIL_REVIEW_TRIGGER_SECRET is required. It may be set in ignored .env or the shell.'
  ].join('\n'));
}

function sanitize(value) {
  if (Array.isArray(value)) return value.map(sanitize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sanitize(item)]));
  }
  if (typeof value !== 'string') return value;
  return value
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[REDACTED_EMAIL]')
    .replace(/https?:\/\/\S+/g, '[REDACTED_URL]')
    .replace(/[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}/g, '[REDACTED_ID]');
}

async function main() {
  loadLocalEnv();
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    printHelp();
    return;
  }

  const triggerSecret = String(process.env.RT_EMAIL_REVIEW_TRIGGER_SECRET || '').trim();
  if (!triggerSecret) {
    console.error('Missing RT_EMAIL_REVIEW_TRIGGER_SECRET. Set it in ignored .env or the shell before triggering the review suite.');
    process.exitCode = 2;
    return;
  }

  const payload = {
    action: 'send_email_review_suite_headless',
    triggerSecret,
    dryRun: opts.dryRun,
    resetFixtures: opts.resetFixtures,
    fixtureSource: opts.fixtureSource,
    teamEmail: opts.teamEmail,
    clientEmail: opts.clientEmail,
    apEmail: opts.apEmail
  };

  const response = await fetch(opts.url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
    redirect: 'follow'
  });
  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (err) {
    console.error(`Email review suite trigger returned non-JSON HTTP ${response.status}.`);
    console.error(sanitize(text).slice(0, 600));
    process.exitCode = 1;
    return;
  }

  const summary = sanitize({
    ok: json.ok === true,
    review: json.review === true,
    headless: json.headless === true,
    dryRun: json.dryRun === true,
    fixtureSource: json.fixtureSource || '',
    resetFixtures: json.resetFixtures === true,
    activeTabsMutated: json.activeTabsMutated === true,
    queueCleared: json.queueCleared === true,
    resetSummary: json.resetSummary || null,
    sentCount: json.sentCount || 0,
    skippedCount: json.skippedCount || 0,
    failedCount: json.failedCount || 0,
    attachmentMatchedCount: json.attachmentMatchedCount || 0,
    attachmentFallbackCount: json.attachmentFallbackCount || 0,
    error: json.error || '',
    results: Array.isArray(json.results)
      ? json.results.map((item) => ({
        label: item && item.label,
        family: item && item.family,
        recipientClass: item && item.recipientClass,
        ok: item && item.ok,
        sent: item && item.sent,
        skipped: item && item.skipped,
        attachmentCount: item && item.attachmentCount,
        attachmentMatched: item && item.attachmentMatched,
        attachmentFallback: item && item.attachmentFallback,
        attachmentReason: item && item.attachmentReason,
        subject: item && item.subject,
        communicationIntent: item && item.communicationIntent,
        lifecycleState: item && item.lifecycleState,
        lifecycleStage: item && item.lifecycleStage,
        paymentDisposition: item && item.paymentDisposition,
        productionDisposition: item && item.productionDisposition,
        ctaMode: item && item.ctaMode,
        contradictionErrorCount: item && item.contradictionErrorCount,
        contradictionWarningCount: item && item.contradictionWarningCount,
        contradictionCodes: item && item.contradictionCodes,
        assertionOnly: item && item.assertionOnly,
        parityMismatchCodes: item && item.parityMismatchCodes,
        error: item && item.error
      }))
      : []
  });
  console.log(JSON.stringify(summary, null, 2));
  if (json.ok !== true) process.exitCode = 1;
}

main().catch((err) => {
  console.error(sanitize(String((err && err.message) || err)));
  process.exitCode = 1;
});
