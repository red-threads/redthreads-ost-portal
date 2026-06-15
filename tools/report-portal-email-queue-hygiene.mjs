#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const DISABLED_PORTAL_MILESTONES = new Set([
  'artwork_approved',
  'artwork_disapproved',
  'project_ready_to_order',
  'team_hold',
  'project_unlocked',
  'checkout_reset',
  'client_flow_canceled',
  'production_authorized',
  'jobs_completed',
  'project_completed'
]);

const DISABLED_AP_MILESTONES = new Set([
  'ap_checkout_started'
]);

const KNOWN_SAFE_REASONS = new Set([
  'ach_submitted_job_already_paid',
  'communication_policy_disabled',
  'communication_milestone_superseded',
  'required_invoice_attachment_missing',
  'required_receipt_attachment_missing',
  'required_document_attachment_missing',
  'optional_attachment_unavailable',
  'missing_recipients',
  'no_current_order'
]);

const VALID_STATUSES = new Set(['queued', 'processing', 'sent', 'skipped', 'failed']);
const MAX_ATTEMPTS = 3;

function parseArgs(argv) {
  const options = {
    input: '',
    now: new Date(),
    staleHours: 24,
    json: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--input') {
      options.input = argv[++i] || '';
    } else if (arg === '--now') {
      const parsed = new Date(argv[++i] || '');
      if (Number.isNaN(parsed.getTime())) throw new Error('Invalid --now value');
      options.now = parsed;
    } else if (arg === '--stale-hours') {
      const parsed = Number(argv[++i]);
      if (!Number.isFinite(parsed) || parsed < 0) throw new Error('Invalid --stale-hours value');
      options.staleHours = parsed;
    } else if (arg === '--json') {
      options.json = true;
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function usage() {
  return [
    'Usage: node tools/report-portal-email-queue-hygiene.mjs --input <queue.csv|queue.tsv|-> [--json] [--stale-hours 24]',
    '',
    'Reads a PORTAL_EMAIL_QUEUE CSV/TSV export and prints a redacted hygiene report.',
    'The report never prints raw tokens, recipient JSON, portalStateJson, orderDraftJson, URLs, or idempotency keys.'
  ].join('\n');
}

function readInput(inputPath) {
  if (!inputPath) throw new Error('Missing --input');
  if (inputPath === '-') {
    return readFileSync(0, 'utf8');
  }
  return readFileSync(inputPath, 'utf8');
}

function detectDelimiter(text) {
  const firstLine = text.split(/\r?\n/, 1)[0] || '';
  return (firstLine.match(/\t/g) || []).length > (firstLine.match(/,/g) || []).length ? '\t' : ',';
}

function parseDelimited(text) {
  const delimiter = detectDelimiter(text);
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (ch === '"' && (next === delimiter || next === '\n' || next === '\r' || next == null)) {
        inQuotes = false;
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"' && field === '') {
      inQuotes = true;
    } else if (ch === delimiter) {
      row.push(field);
      field = '';
    } else if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (ch !== '\r') {
      field += ch;
    }
  }

  row.push(field);
  if (row.some((value) => trim(value))) rows.push(row);
  return rows;
}

function trim(value) {
  return String(value == null ? '' : value).trim();
}

function normalizeHeader(value) {
  return trim(value).toLowerCase();
}

function safeLabel(value, fallback = 'blank') {
  const normalized = trim(value).replace(/[^a-zA-Z0-9_.:-]+/g, '_').slice(0, 80);
  return normalized || fallback;
}

function countBy(map, key, increment = 1) {
  const safeKey = safeLabel(key || 'blank');
  map[safeKey] = (map[safeKey] || 0) + increment;
}

function parseJsonObject(value) {
  const raw = trim(value);
  if (!raw || raw[0] !== '{') return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function hashSensitive(parts) {
  const joined = parts.map((part) => trim(part)).filter(Boolean).join('|');
  if (!joined) return 'none';
  return createHash('sha256').update(joined).digest('hex').slice(0, 12);
}

function getField(row, name) {
  return trim(row[normalizeHeader(name)]);
}

function parseDate(value) {
  const raw = trim(value);
  if (!raw) return null;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function ageBucket(createdAt, now) {
  if (!createdAt) return 'unknown';
  const hours = Math.max(0, (now.getTime() - createdAt.getTime()) / 36e5);
  if (hours < 24) return '<24h';
  if (hours < 72) return '1-3d';
  if (hours < 168) return '3-7d';
  if (hours < 720) return '7-30d';
  return '>30d';
}

function categorizeReason(value) {
  const reason = safeLabel(value, '');
  if (!reason) return 'blank';
  if (KNOWN_SAFE_REASONS.has(reason)) return reason;
  return 'other_nonempty_error';
}

function deriveMeta(row) {
  const state = parseJsonObject(getField(row, 'portalStateJson'));
  const jobType = safeLabel(getField(row, 'jobType'));
  const milestone = safeLabel(
    state.milestone ||
    state.eventKind ||
    state.eventType ||
    state.queuedFromEventType ||
    ''
  );
  let recipientClass = safeLabel(state.recipientClass || state.direction || '');

  if (recipientClass === 'blank') {
    if (jobType.includes('_team_alert') || jobType === 'chat_message_digest_email' && state.direction === 'client_to_team') {
      recipientClass = 'team';
    } else if (jobType.startsWith('ach_payment_')) {
      recipientClass = 'client';
    }
  }

  const businessHash = hashSensitive([
    getField(row, 'token'),
    getField(row, 'idempotencyKey'),
    state.orderId,
    state.orderKey,
    state.paymentIntentId,
    state.paymentIntent,
    state.checkoutSessionId,
    state.sessionId,
    state.checkoutAttemptId,
    state.invoiceNumber
  ]);

  return { state, jobType, milestone, recipientClass, businessHash };
}

function isDisabledByPolicy(jobType, milestone) {
  if (jobType === 'portal_lifecycle_email') return DISABLED_PORTAL_MILESTONES.has(milestone);
  if (jobType === 'ap_ach_lifecycle_email') return DISABLED_AP_MILESTONES.has(milestone);
  return false;
}

function classifyRow(row, meta, now, staleHours) {
  const status = safeLabel(getField(row, 'status'));
  const createdAt = parseDate(getField(row, 'createdAt'));
  const leaseUntil = parseDate(getField(row, 'leaseUntil'));
  const attemptCount = Number(getField(row, 'attemptCount') || 0);
  const staleQueued = status === 'queued' && createdAt && (now.getTime() - createdAt.getTime()) > staleHours * 36e5;
  const stuckProcessing = status === 'processing' && (!leaseUntil || leaseUntil.getTime() < now.getTime());
  const failedMaxAttempts = status === 'failed' && attemptCount >= MAX_ATTEMPTS;
  const disabled = isDisabledByPolicy(meta.jobType, meta.milestone);

  if (status === 'sent' || status === 'skipped') return 'KEEP_AUDIT';
  if (disabled && (status === 'queued' || status === 'processing' || status === 'failed')) return 'SAFE_TO_SKIP_IF_APPROVED';
  if (staleQueued || stuckProcessing || failedMaxAttempts || status === 'failed' || !VALID_STATUSES.has(status)) return 'INVESTIGATE';
  if (status === 'queued') return 'DO_NOT_TOUCH';
  return 'INVESTIGATE';
}

function buildReport(text, options) {
  const table = parseDelimited(text);
  if (table.length < 1) throw new Error('Input has no rows');

  const headers = table[0].map(normalizeHeader);
  const records = table.slice(1)
    .map((cells, index) => {
      const row = {};
      headers.forEach((header, headerIndex) => {
        row[header] = cells[headerIndex] == null ? '' : cells[headerIndex];
      });
      row.__rowNumber = index + 2;
      return row;
    })
    .filter((row) => getField(row, 'jobType') || getField(row, 'status'));

  const report = {
    generatedAt: options.now.toISOString(),
    totalRows: records.length,
    counts: {
      jobType: {},
      status: {},
      ageBucket: {},
      recipientClass: {},
      lastErrorReason: {},
      classification: {},
      disabledPolicy: {}
    },
    findings: {
      staleQueuedRows: [],
      stuckProcessingRows: [],
      failedRows: [],
      failedMaxAttemptRows: [],
      unknownStatusRows: [],
      queuedDisabledRows: [],
      duplicateishGroups: []
    }
  };

  const duplicateGroups = new Map();

  for (const row of records) {
    const meta = deriveMeta(row);
    const status = safeLabel(getField(row, 'status'));
    const createdAt = parseDate(getField(row, 'createdAt'));
    const leaseUntil = parseDate(getField(row, 'leaseUntil'));
    const attemptCount = Number(getField(row, 'attemptCount') || 0);
    const classification = classifyRow(row, meta, options.now, options.staleHours);
    const lastErrorReason = categorizeReason(getField(row, 'lastError'));
    const disabled = isDisabledByPolicy(meta.jobType, meta.milestone);

    countBy(report.counts.jobType, meta.jobType);
    countBy(report.counts.status, status);
    countBy(report.counts.ageBucket, ageBucket(createdAt, options.now));
    countBy(report.counts.recipientClass, meta.recipientClass);
    countBy(report.counts.lastErrorReason, lastErrorReason);
    countBy(report.counts.classification, classification);
    if (disabled) countBy(report.counts.disabledPolicy, `${meta.jobType}:${meta.milestone}:${status}`);

    const rowRef = {
      rowNumber: row.__rowNumber,
      jobType: meta.jobType,
      milestone: meta.milestone,
      recipientClass: meta.recipientClass,
      status,
      businessHash: meta.businessHash
    };

    if (status === 'queued' && createdAt && (options.now.getTime() - createdAt.getTime()) > options.staleHours * 36e5) {
      report.findings.staleQueuedRows.push(rowRef);
    }
    if (status === 'processing' && (!leaseUntil || leaseUntil.getTime() < options.now.getTime())) {
      report.findings.stuckProcessingRows.push(rowRef);
    }
    if (status === 'failed') {
      report.findings.failedRows.push({ ...rowRef, reason: lastErrorReason, attemptCount });
      if (attemptCount >= MAX_ATTEMPTS) report.findings.failedMaxAttemptRows.push(rowRef);
    }
    if (!VALID_STATUSES.has(status)) {
      report.findings.unknownStatusRows.push(rowRef);
    }
    if (disabled && (status === 'queued' || status === 'processing' || status === 'failed')) {
      report.findings.queuedDisabledRows.push(rowRef);
    }

    const duplicateKey = [
      meta.jobType,
      meta.milestone,
      meta.recipientClass,
      status,
      meta.businessHash
    ].join('|');
    if (!duplicateGroups.has(duplicateKey)) {
      duplicateGroups.set(duplicateKey, { ...rowRef, count: 0, rows: [] });
    }
    const group = duplicateGroups.get(duplicateKey);
    group.count += 1;
    group.rows.push(row.__rowNumber);
  }

  report.findings.duplicateishGroups = [...duplicateGroups.values()]
    .filter((group) => group.count > 1 && group.businessHash !== 'none')
    .map((group) => ({
      jobType: group.jobType,
      milestone: group.milestone,
      recipientClass: group.recipientClass,
      status: group.status,
      businessHash: group.businessHash,
      count: group.count,
      rows: group.rows
    }));

  return report;
}

function sortObject(object) {
  return Object.fromEntries(Object.entries(object).sort((a, b) => a[0].localeCompare(b[0])));
}

function printCounts(title, counts) {
  const lines = [`\n## ${title}`];
  const entries = Object.entries(sortObject(counts));
  if (!entries.length) {
    lines.push('- none');
    return lines.join('\n');
  }
  for (const [key, count] of entries) {
    lines.push(`- ${key}: ${count}`);
  }
  return lines.join('\n');
}

function renderText(report) {
  const lines = [
    '# PORTAL_EMAIL_QUEUE Hygiene Report',
    '',
    `Generated: ${report.generatedAt}`,
    `Populated rows: ${report.totalRows}`,
    printCounts('Job Types', report.counts.jobType),
    printCounts('Statuses', report.counts.status),
    printCounts('Age Buckets', report.counts.ageBucket),
    printCounts('Recipient Classes', report.counts.recipientClass),
    printCounts('Last Error Categories', report.counts.lastErrorReason),
    printCounts('Classifications', report.counts.classification),
    printCounts('Phase 1 Disabled Event Rows', report.counts.disabledPolicy),
    '',
    '## Action Findings',
    `- stale queued rows: ${report.findings.staleQueuedRows.length}`,
    `- stuck processing rows: ${report.findings.stuckProcessingRows.length}`,
    `- failed rows: ${report.findings.failedRows.length}`,
    `- failed rows at max attempts: ${report.findings.failedMaxAttemptRows.length}`,
    `- unknown status rows: ${report.findings.unknownStatusRows.length}`,
    `- queued disabled-event rows: ${report.findings.queuedDisabledRows.length}`,
    `- duplicate-ish groups: ${report.findings.duplicateishGroups.length}`,
    '',
    '## Safety Note',
    'This report intentionally omits raw tokens, recipient emails, idempotency keys, payload JSON, message text, Drive URLs, and payment identifiers.'
  ];

  const actionableByKey = new Map();
  [
    ...report.findings.staleQueuedRows,
    ...report.findings.stuckProcessingRows,
    ...report.findings.failedRows,
    ...report.findings.unknownStatusRows,
    ...report.findings.queuedDisabledRows
  ].forEach((item) => {
    actionableByKey.set(`${item.rowNumber}:${item.jobType}:${item.status}:${item.businessHash}`, item);
  });
  const actionable = [...actionableByKey.values()];
  if (actionable.length) {
    lines.push('', '## Redacted Row Candidates');
    for (const item of actionable.slice(0, 50)) {
      lines.push(`- row ${item.rowNumber}: ${item.jobType}/${item.milestone}/${item.recipientClass}/${item.status}/${item.businessHash}`);
    }
    if (actionable.length > 50) lines.push(`- ${actionable.length - 50} additional candidates omitted`);
  }

  return lines.join('\n');
}

function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
      console.log(usage());
      return;
    }
    const text = readInput(options.input);
    const report = buildReport(text, options);
    console.log(options.json ? JSON.stringify(report, null, 2) : renderText(report));
  } catch (error) {
    console.error(error && error.message ? error.message : String(error));
    console.error('');
    console.error(usage());
    process.exit(1);
  }
}

main();
