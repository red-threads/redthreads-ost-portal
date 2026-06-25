#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import process from 'node:process';

const REQUIRED_MATRIX = [
  {
    caseLabel: 'ach_paid_resend',
    recipientClass: 'client',
    expectedCommunicationIntent: ['payment_received', 'no_action_status', 'production_in_progress'],
    labels: ['Explicit locked-order resend client', 'Assertion paid resend client', 'Standard ACH receipt client'],
    sendMode: 'sendable_or_assertion',
    artifactRequirement: 'required'
  },
  {
    caseLabel: 'ach_pending',
    recipientClass: 'client+team',
    expectedCommunicationIntent: ['payment_pending_bank_confirmation'],
    labels: ['Standard ACH pending client', 'Standard ACH pending team', 'Assertion ACH pending client'],
    sendMode: 'sendable_or_assertion',
    artifactRequirement: 'required'
  },
  {
    caseLabel: 'ach_verification_required',
    recipientClass: 'client+team',
    expectedCommunicationIntent: ['payment_verification_required'],
    labels: ['Standard ACH verification client', 'Standard ACH verification team', 'Assertion ACH verification client'],
    sendMode: 'sendable_or_assertion',
    artifactRequirement: 'required'
  },
  {
    caseLabel: 'ach_verification_4_day_reminder',
    recipientClass: 'client+team',
    expectedCommunicationIntent: ['payment_verification_required'],
    labels: ['Standard ACH verification 4-day reminder client', 'Standard ACH verification 4-day reminder team'],
    sendMode: 'sendable',
    artifactRequirement: 'optional'
  },
  {
    caseLabel: 'ach_failed',
    recipientClass: 'client+team',
    expectedCommunicationIntent: ['payment_issue'],
    labels: ['Standard ACH failed client', 'Standard ACH failed team', 'Assertion payment issue client'],
    sendMode: 'sendable_or_assertion',
    artifactRequirement: 'required'
  },
  {
    caseLabel: 'card_paid',
    recipientClass: 'client+team',
    expectedCommunicationIntent: ['payment_received'],
    labels: ['Card paid client', 'Card paid team'],
    sendMode: 'sendable',
    artifactRequirement: 'required'
  },
  {
    caseLabel: 'card_failed',
    recipientClass: 'client+team',
    expectedCommunicationIntent: ['payment_issue'],
    labels: ['Card failed client', 'Card failed team'],
    sendMode: 'sendable',
    artifactRequirement: 'required'
  },
  {
    caseLabel: 'manual_pending',
    recipientClass: 'client+team',
    expectedCommunicationIntent: ['manual_payment_pending'],
    labels: ['Manual payment pending client', 'Manual payment pending team', 'Assertion manual pending client'],
    sendMode: 'sendable_or_assertion',
    artifactRequirement: 'required'
  },
  {
    caseLabel: 'manual_received',
    recipientClass: 'client+team',
    expectedCommunicationIntent: ['manual_payment_received', 'payment_received'],
    labels: ['Manual payment received client', 'Manual payment received team'],
    sendMode: 'sendable',
    artifactRequirement: 'required'
  },
  {
    caseLabel: 'po_invoice_prepared',
    recipientClass: 'client',
    expectedCommunicationIntent: ['po_invoice_prepared'],
    labels: ['PO invoice prepared client'],
    sendMode: 'sendable',
    artifactRequirement: 'required'
  },
  {
    caseLabel: 'po_submitted_unpaid_terms_open',
    recipientClass: 'client+team',
    expectedCommunicationIntent: ['po_submitted_terms_open'],
    labels: ['PO submitted client', 'PO submitted team', 'Assertion PO submitted under terms'],
    sendMode: 'sendable_or_assertion',
    artifactRequirement: 'required'
  },
  {
    caseLabel: 'po_payment_received',
    recipientClass: 'client+team',
    expectedCommunicationIntent: ['po_payment_received', 'payment_received'],
    labels: ['PO payment received client', 'PO payment received team'],
    sendMode: 'sendable',
    artifactRequirement: 'required'
  },
  {
    caseLabel: 'po_payment_reminder_5bd_before_due',
    recipientClass: 'client',
    expectedCommunicationIntent: ['po_payment_reminder'],
    labels: ['PO payment reminder 5 business days before due client'],
    sendMode: 'sendable',
    artifactRequirement: 'optional'
  },
  {
    caseLabel: 'po_payment_reminder_1bd_before_due',
    recipientClass: 'client',
    expectedCommunicationIntent: ['po_payment_reminder'],
    labels: ['PO payment reminder 1 business day before due client'],
    sendMode: 'sendable',
    artifactRequirement: 'optional'
  },
  {
    caseLabel: 'po_payment_past_due',
    recipientClass: 'client',
    expectedCommunicationIntent: ['po_payment_past_due'],
    labels: ['PO payment past due client'],
    sendMode: 'sendable',
    artifactRequirement: 'optional'
  },
  {
    caseLabel: 'po_late_fee_2_5',
    recipientClass: 'client',
    expectedCommunicationIntent: ['po_payment_late_fee_notice'],
    labels: ['PO late fee 2.5 client'],
    sendMode: 'sendable',
    artifactRequirement: 'optional'
  },
  {
    caseLabel: 'po_late_fee_7_5',
    recipientClass: 'client',
    expectedCommunicationIntent: ['po_payment_late_fee_notice'],
    labels: ['PO late fee 7.5 client'],
    sendMode: 'sendable',
    artifactRequirement: 'optional'
  },
  {
    caseLabel: 'po_late_fee_12_5',
    recipientClass: 'client',
    expectedCommunicationIntent: ['po_payment_late_fee_notice'],
    labels: ['PO late fee 12.5 client'],
    sendMode: 'sendable',
    artifactRequirement: 'optional'
  },
  {
    caseLabel: 'po_payment_60_day_team_escalation',
    recipientClass: 'team',
    expectedCommunicationIntent: ['po_payment_late_fee_escalation'],
    labels: ['PO payment 60-day escalation team'],
    sendMode: 'sendable',
    artifactRequirement: 'optional'
  },
  {
    caseLabel: 'ap_payment_request',
    recipientClass: 'ap',
    expectedCommunicationIntent: ['payment_required_before_production'],
    labels: ['AP payment link sent', 'Assertion AP payment request'],
    sendMode: 'sendable_or_assertion',
    artifactRequirement: 'required'
  },
  {
    caseLabel: 'ap_ach_pending',
    recipientClass: 'ap+team',
    expectedCommunicationIntent: ['payment_pending_bank_confirmation'],
    labels: ['AP ACH pending AP', 'AP ACH pending team'],
    sendMode: 'sendable',
    artifactRequirement: 'required'
  },
  {
    caseLabel: 'ap_ach_paid',
    recipientClass: 'ap+team',
    expectedCommunicationIntent: ['payment_received'],
    labels: ['AP ACH receipt AP', 'AP ACH receipt team'],
    sendMode: 'sendable',
    artifactRequirement: 'required'
  },
  {
    caseLabel: 'ap_ach_failed',
    recipientClass: 'ap+team',
    expectedCommunicationIntent: ['payment_issue'],
    labels: ['AP ACH failed AP', 'AP ACH failed team'],
    sendMode: 'sendable',
    artifactRequirement: 'required'
  },
  {
    caseLabel: 'team_initiated_production_before_payment',
    recipientClass: 'client+team',
    expectedCommunicationIntent: ['production_authorized', 'production_in_progress'],
    labels: ['Assertion team initiated production before payment client', 'Assertion team initiated production before payment team'],
    sendMode: 'assertion_only',
    artifactRequirement: 'optional'
  },
  {
    caseLabel: 'production_complete',
    recipientClass: 'client+team',
    expectedCommunicationIntent: ['production_complete'],
    labels: [
      'Production complete shipping client',
      'Production complete shipping team',
      'Production complete pickup client',
      'Production complete pickup team'
    ],
    sendMode: 'sendable',
    artifactRequirement: 'optional'
  },
  {
    caseLabel: 'client_to_team_chat_digest',
    recipientClass: 'team',
    expectedCommunicationIntent: ['chat_digest'],
    labels: ['Chat digest client to team'],
    sendMode: 'sendable',
    artifactRequirement: 'not_applicable'
  },
  {
    caseLabel: 'team_to_client_chat_digest',
    recipientClass: 'client',
    expectedCommunicationIntent: ['chat_digest'],
    labels: ['Chat digest team to client'],
    sendMode: 'sendable',
    artifactRequirement: 'not_applicable'
  },
  {
    caseLabel: 'account_document_tax_submitted',
    recipientClass: 'client+team',
    expectedCommunicationIntent: ['account_document_review_required'],
    labels: ['Tax exempt submitted client', 'Tax exempt submitted team review'],
    sendMode: 'sendable',
    artifactRequirement: 'optional'
  },
  {
    caseLabel: 'account_document_tax_approved',
    recipientClass: 'client+team',
    expectedCommunicationIntent: ['account_document_approved'],
    labels: ['Tax exempt approved client', 'Tax exempt approved team'],
    sendMode: 'sendable',
    artifactRequirement: 'optional'
  },
  {
    caseLabel: 'account_document_tax_denied',
    recipientClass: 'client',
    expectedCommunicationIntent: ['account_document_needs_attention'],
    labels: ['Tax exempt denied client'],
    sendMode: 'sendable',
    artifactRequirement: 'optional'
  },
  {
    caseLabel: 'account_document_tax_removed',
    recipientClass: 'client+team',
    expectedCommunicationIntent: ['account_document_needs_attention'],
    labels: ['Tax exempt removed client', 'Tax exempt removed team'],
    sendMode: 'sendable',
    artifactRequirement: 'optional'
  },
  {
    caseLabel: 'account_document_credit_terms_submitted',
    recipientClass: 'client+team',
    expectedCommunicationIntent: ['account_document_review_required'],
    labels: ['Credit terms submitted client', 'Credit terms submitted team review'],
    sendMode: 'sendable',
    artifactRequirement: 'optional'
  },
  {
    caseLabel: 'account_document_credit_terms_approved',
    recipientClass: 'client+team',
    expectedCommunicationIntent: ['account_document_approved'],
    labels: ['Credit terms approved client', 'Credit terms approved team'],
    sendMode: 'sendable',
    artifactRequirement: 'optional'
  },
  {
    caseLabel: 'account_document_credit_terms_denied',
    recipientClass: 'client',
    expectedCommunicationIntent: ['account_document_needs_attention'],
    labels: ['Credit terms denied client'],
    sendMode: 'sendable',
    artifactRequirement: 'optional'
  },
  {
    caseLabel: 'account_document_credit_terms_removed',
    recipientClass: 'client+team',
    expectedCommunicationIntent: ['account_document_needs_attention'],
    labels: ['Credit terms removed client', 'Credit terms removed team'],
    sendMode: 'sendable',
    artifactRequirement: 'optional'
  },
  {
    caseLabel: 'password_reset',
    recipientClass: 'client',
    expectedCommunicationIntent: ['document_copy', 'no_action_status'],
    labels: ['Password reset client'],
    sendMode: 'sendable',
    artifactRequirement: 'not_applicable'
  },
  {
    caseLabel: 'summary_pdf_copy',
    recipientClass: 'client',
    expectedCommunicationIntent: ['document_copy'],
    labels: ['Summary/invoice explicit send client'],
    sendMode: 'sendable',
    artifactRequirement: 'required'
  },
  {
    caseLabel: 'blank_tax_source',
    recipientClass: 'client',
    expectedCommunicationIntent: ['document_copy'],
    labels: ['Blank tax document source client'],
    sendMode: 'sendable',
    artifactRequirement: 'required'
  },
  {
    caseLabel: 'blank_credit_terms_source',
    recipientClass: 'client',
    expectedCommunicationIntent: ['document_copy'],
    labels: ['Blank credit terms source client'],
    sendMode: 'sendable',
    artifactRequirement: 'required'
  }
];

function parseArgs(argv) {
  const options = {
    input: '',
    json: false,
    strict: false
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--input') options.input = argv[++i] || '';
    else if (arg === '--json') options.json = true;
    else if (arg === '--strict') options.strict = true;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return options;
}

function usage() {
  return [
    'Usage: npm run email-review:matrix -- --input email-review.json [--strict] [--json]',
    '',
    'Validates redacted headless email-review JSON against the lifecycle communication matrix.',
    'Use with: npm run email-review:suite -- --dry-run > /tmp/email-review-dry-run.json',
    '',
    'Default behavior fails on failed cases or contradiction errors. --strict also fails missing/skipped matrix cases.',
    'Live suite receipts omit dry-run-only assertion rows; those assertion-only cases are classified as live_assertion_only_omitted.'
  ].join('\n');
}

function readInput(inputPath) {
  if (!inputPath || inputPath === '-') return readFileSync(0, 'utf8');
  return readFileSync(inputPath, 'utf8');
}

function extractJson(text) {
  const raw = String(text || '').trim();
  if (!raw) throw new Error('Input is empty');
  try {
    return JSON.parse(raw);
  } catch {
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start < 0 || end <= start) throw new Error('Input does not contain JSON');
    return JSON.parse(raw.slice(start, end + 1));
  }
}

function normalize(value) {
  return String(value == null ? '' : value).trim().toLowerCase();
}

function summarizeResult(item) {
  return {
    label: item.label,
    family: item.family || '',
    recipientClass: item.recipientClass || '',
    ok: item.ok === true,
    sent: item.sent === true,
    skipped: item.skipped === true,
    assertionOnly: item.assertionOnly === true,
    dryRun: item.dryRun === true,
    subject: item.subject || '',
    communicationIntent: item.communicationIntent || '',
    lifecycleState: item.lifecycleState || '',
    paymentDisposition: item.paymentDisposition || '',
    productionDisposition: item.productionDisposition || '',
    ctaMode: item.ctaMode || '',
    contradictionErrorCount: Number(item.contradictionErrorCount || 0),
    contradictionWarningCount: Number(item.contradictionWarningCount || 0),
    contradictionCodes: Array.isArray(item.contradictionCodes) ? item.contradictionCodes : [],
    error: item.error || '',
    reason: item.reason || '',
    attachmentCount: Number(item.attachmentCount || 0),
    attachmentFallback: item.attachmentFallback === true,
    attachmentReason: item.attachmentReason || ''
  };
}

function validateMatrix(input) {
  const results = Array.isArray(input.results) ? input.results.map(summarizeResult) : [];
  const isLiveReceipt = input.dryRun === false;
  const byLabel = new Map(results.map((item) => [normalize(item.label), item]));
  const failedResults = results.filter((item) => item.ok === false);
  const contradictionErrors = results.filter((item) => item.contradictionErrorCount > 0);
  const contradictionWarnings = results.filter((item) => item.contradictionWarningCount > 0);
  const attachmentFallbacks = results.filter((item) => item.attachmentFallback);
  const cases = REQUIRED_MATRIX.map((caseDef) => {
    const matched = caseDef.labels.map((label) => byLabel.get(normalize(label))).filter(Boolean);
    const activeMatched = matched.filter((item) => !item.skipped);
    const assertionMatched = matched.filter((item) => item.assertionOnly);
    const status = isLiveReceipt && caseDef.sendMode === 'assertion_only' && !matched.length
      ? 'live_assertion_only_omitted'
      : (!caseDef.labels.length
      ? 'assertion_only_missing'
      : (!matched.length
        ? 'missing'
        : (activeMatched.length
          ? 'covered'
          : 'skipped_or_omitted')));
    const intents = [...new Set(matched.map((item) => item.communicationIntent).filter(Boolean))];
    const missingIntent = activeMatched.length && caseDef.expectedCommunicationIntent.length
      ? !intents.some((intent) => caseDef.expectedCommunicationIntent.includes(intent))
      : false;
    return {
      caseLabel: caseDef.caseLabel,
      recipientClass: caseDef.recipientClass,
      expectedCommunicationIntent: caseDef.expectedCommunicationIntent,
      sendMode: caseDef.sendMode,
      artifactRequirement: caseDef.artifactRequirement,
      status,
      matchedLabels: matched.map((item) => item.label),
      activeCount: activeMatched.length,
      skippedCount: matched.filter((item) => item.skipped).length,
      assertionCount: assertionMatched.length,
      communicationIntents: intents,
      missingExpectedIntent: missingIntent
    };
  });
  const missingCases = cases.filter((item) => item.status === 'missing' || item.status === 'assertion_only_missing');
  const skippedCases = cases.filter((item) => item.status === 'skipped_or_omitted' || item.status === 'live_assertion_only_omitted');
  const intentMismatches = cases.filter((item) => item.missingExpectedIntent);
  return {
    ok: failedResults.length === 0 && contradictionErrors.length === 0 && intentMismatches.length === 0,
    inputOk: input.ok === true,
    dryRunOk: input.ok === true,
    redacted: true,
    resultCounts: {
      total: results.length,
      sent: Number(input.sentCount || 0),
      skipped: Number(input.skippedCount || 0),
      failed: Number(input.failedCount || failedResults.length),
      attachmentFallback: Number(input.attachmentFallbackCount || attachmentFallbacks.length),
      contradictionErrors: contradictionErrors.length,
      contradictionWarnings: contradictionWarnings.length
    },
    matrixCounts: {
      required: REQUIRED_MATRIX.length,
      covered: cases.filter((item) => item.status === 'covered').length,
      skippedOrOmitted: skippedCases.length,
      missing: missingCases.length,
      intentMismatches: intentMismatches.length
    },
    cases,
    failedResults,
    contradictionErrors,
    contradictionWarnings,
    attachmentFallbacks: attachmentFallbacks.map((item) => ({
      label: item.label,
      recipientClass: item.recipientClass,
      attachmentReason: item.attachmentReason
    }))
  };
}

function printMarkdown(report) {
  console.log('# Email Communication Matrix Validation');
  console.log('');
  console.log(`Input ok: ${report.inputOk}`);
  console.log(`Results: total=${report.resultCounts.total}, skipped=${report.resultCounts.skipped}, failed=${report.resultCounts.failed}, attachmentFallback=${report.resultCounts.attachmentFallback}`);
  console.log(`Contradictions: errors=${report.resultCounts.contradictionErrors}, warnings=${report.resultCounts.contradictionWarnings}`);
  console.log(`Matrix: required=${report.matrixCounts.required}, covered=${report.matrixCounts.covered}, skippedOrOmitted=${report.matrixCounts.skippedOrOmitted}, missing=${report.matrixCounts.missing}, intentMismatches=${report.matrixCounts.intentMismatches}`);
  console.log('');
  console.log('| Case | Status | Recipient | Intents | Matched labels |');
  console.log('| --- | --- | --- | --- | --- |');
  report.cases.forEach((item) => {
    console.log(`| ${item.caseLabel} | ${item.status} | ${item.recipientClass} | ${item.communicationIntents.join(', ') || '-'} | ${item.matchedLabels.join('; ') || '-'} |`);
  });
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }
  const input = extractJson(readInput(options.input));
  const report = validateMatrix(input);
  if (options.json) console.log(JSON.stringify(report, null, 2));
  else printMarkdown(report);
  const strictFailure = options.strict && (report.matrixCounts.missing > 0 || report.matrixCounts.skippedOrOmitted > 0);
  if (!report.ok || strictFailure) process.exitCode = 1;
}

main();
