#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const DEFAULT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw/exec';

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
    url: process.env.RT_EMAIL_REVIEW_WEB_APP_URL || DEFAULT_WEB_APP_URL
  };
  argv.forEach((arg) => {
    if (arg.startsWith('--url=')) opts.url = arg.slice('--url='.length).trim();
    else if (arg === '--help' || arg === '-h') opts.help = true;
    else throw new Error(`Unsupported argument: ${arg}`);
  });
  return opts;
}

function printHelp() {
  console.log([
    'Usage: npm run email-review:status -- [options]',
    '',
    'Options:',
    '  --url=<url>  Override the Apps Script web app URL.',
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
    console.error('Missing RT_EMAIL_REVIEW_TRIGGER_SECRET. Set it in ignored .env or the shell before checking runtime status.');
    process.exitCode = 2;
    return;
  }
  const response = await fetch(opts.url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      action: 'get_email_review_runtime_status_headless',
      triggerSecret
    }),
    redirect: 'follow'
  });
  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (err) {
    console.error(`Email runtime status returned non-JSON HTTP ${response.status}.`);
    console.error(sanitize(text).slice(0, 600));
    process.exitCode = 1;
    return;
  }
  const summary = sanitize({
    ok: json.ok === true,
    headless: json.headless === true,
    readOnly: json.readOnly === true,
    sensitiveDataRedacted: json.sensitiveDataRedacted === true,
    activeTabState: json.activeTabState || '',
    activeTabs: json.activeTabs || [],
    fixtureHeaders: json.fixtureHeaders || [],
    queue: json.queue || {},
    scheduler: json.scheduler || {},
    error: json.error || ''
  });
  console.log(JSON.stringify(summary, null, 2));
  if (json.ok !== true) process.exitCode = 1;
}

main().catch((err) => {
  console.error(sanitize(String((err && err.message) || err)));
  process.exitCode = 1;
});
