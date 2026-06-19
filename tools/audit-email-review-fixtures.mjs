#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import process from 'node:process';

const EXPECTED_EXPORT_HEADERS = [
  'token', 'dealNumber', 'dealId', 'dealTitle', 'personName', 'personId', 'personEmail', 'orgName', 'orgId',
  'projectName', 'sentBy', 'internalNotes', 'status', 'contractVersion', 'calculatorVersion', 'source',
  'exportedAt', 'snapshotId', 'baseUrl', 'snapshotJson', 'portalStateJson', 'submittedStateJson', 'submittedAt',
  'submittedByName', 'submittedByEmail', 'grandTotal', 'specialPricingRequired', 'chatLogJson',
  'printJob1ArtStatus', 'printJob2ArtStatus', 'printJob3ArtStatus', 'printJob4ArtStatus', 'activeOrderId',
  'latestCheckoutAttemptId', 'currentAccountId', 'portalLockState', 'currentOrderState', 'currentPaymentState',
  'currentProductionAuthorizationState', 'currentPaymentMethod', 'termsApproved', 'taxExemptApproved',
  'latestInvoiceNumber', 'lastOrderUpdatedAt', 'artworkOverridesJson', 'teamWorkflowMode', 'teamJobCompletionJson'
];

const EXPECTED_ORDER_HEADERS = [
  'orderId', 'checkoutAttemptId', 'orderRevision', 'token', 'snapshotId', 'dealNumber', 'projectName',
  'personEmail', 'orgId', 'orgName', 'accountId', 'createdAt', 'lastUpdatedAt', 'portalLockState', 'orderState',
  'paymentMethodSelected', 'paymentState', 'productionAuthorizationState', 'clientReapprovalRequired',
  'taxStatusApplied', 'taxExemptApplied', 'amountSubtotal', 'amountShipping', 'amountRush', 'amountTax',
  'amountGrandTotal', 'currency', 'stripeSessionId', 'stripePaymentIntentId', 'invoiceNumber', 'invoicePdfUrl',
  'invoiceSentToEmail', 'invoiceSentAt', 'poNumber', 'poDocumentUrl', 'poSubmittedBy', 'poSubmittedAt',
  'paidAt', 'authorizedToProduceAt', 'lockedAt', 'paymentReceivedManuallyBy', 'paymentReceivedManuallyAt',
  'orderDraftJson', 'revisionReason', 'notes', 'amountCardFee', 'amountChargedTax', 'amountChargedTotal',
  'stripeAmountSubtotalCents', 'stripeAmountTotalCents', 'achPaymentMethodId', 'achBankName', 'achLast4',
  'achMandateId', 'achFinancialConnectionsAccountId', 'achVerificationStatus', 'achVerificationFlow',
  'achExpectedDebitDate', 'achFailureCode', 'achFailureMessage', 'achPendingProductionApprovedAtOrder',
  'stripeLatestChargeId', 'stripeLatestEventId', 'stripeLatestEventType', 'stripeLatestEventAt',
  'achPaymentSource', 'achPaymentVisibilityScope', 'stripeAchCustomerId'
];

const EXPECTED_STRIPE_HEADERS = [
  'stripeEventId', 'eventType', 'objectId', 'paymentIntentId', 'setupIntentId', 'checkoutSessionId',
  'chargeId', 'orderId', 'checkoutAttemptId', 'token', 'accountId', 'receivedAt', 'processedAt',
  'processingStatus', 'errorMessage', 'rawEventJsonRedacted'
];

function parseArgs(argv) {
  const options = {
    exportPath: '',
    ordersPath: '',
    stripePath: '',
    json: false
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--export') options.exportPath = argv[++i] || '';
    else if (arg === '--orders') options.ordersPath = argv[++i] || '';
    else if (arg === '--stripe') options.stripePath = argv[++i] || '';
    else if (arg === '--json') options.json = true;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return options;
}

function usage() {
  return [
    'Usage: node tools/audit-email-review-fixtures.mjs --export FIXTURE_EXPORT.csv --orders FIXTURE_PORTAL_ORDERS.csv --stripe FIXTURE_STRIPE_EVENTS.csv [--json]',
    '',
    'Reads local CSV/TSV exports of fixture tabs and prints a redacted lifecycle fixture audit.',
    'The report never prints tokens, emails, names, URLs, raw JSON payloads, invoice numbers, or order IDs.'
  ].join('\n');
}

function trim(value) {
  return String(value == null ? '' : value).trim();
}

function normalizeHeader(value) {
  return trim(value).toLowerCase();
}

function safeKey(value, fallback = 'blank') {
  const normalized = trim(value).replace(/[^a-zA-Z0-9_.:-]+/g, '_').slice(0, 80);
  return normalized || fallback;
}

function hashSensitive(value) {
  const clean = trim(value);
  if (!clean) return '';
  return createHash('sha256').update(clean).digest('hex').slice(0, 10);
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

function readTable(filePath) {
  if (!filePath) return { headers: [], rows: [] };
  const parsed = parseDelimited(readFileSync(filePath, 'utf8'));
  const headers = (parsed[0] || []).map(trim);
  const normalized = headers.map(normalizeHeader);
  const rows = parsed.slice(1).map((values, index) => {
    const row = { __rowNumber: index + 2 };
    normalized.forEach((header, colIndex) => {
      if (header) row[header] = trim(values[colIndex]);
    });
    return row;
  });
  return { headers, normalizedHeaders: normalized, rows };
}

function headerPrefixMatches(actual, expected) {
  const actualNormalized = (actual || []).map(normalizeHeader);
  const expectedNormalized = (expected || []).map(normalizeHeader);
  for (let i = 0; i < expectedNormalized.length; i += 1) {
    if (actualNormalized[i] !== expectedNormalized[i]) return false;
  }
  return true;
}

function countBy(map, key, amount = 1) {
  const clean = safeKey(key);
  map[clean] = (map[clean] || 0) + amount;
}

function isEmbeddedHeaderRow(row, expectedHeaders) {
  const firstHeader = normalizeHeader(expectedHeaders[0]);
  if (!firstHeader) return false;
  return normalizeHeader(row[firstHeader]) === firstHeader;
}

function nonHeaderDataRows(table, expectedHeaders, idHeader) {
  const id = normalizeHeader(idHeader);
  return table.rows.filter((row) => !isEmbeddedHeaderRow(row, expectedHeaders) && trim(row[id]));
}

function duplicateSummary(values) {
  const counts = new Map();
  values.map(trim).filter(Boolean).forEach((value) => {
    counts.set(value, (counts.get(value) || 0) + 1);
  });
  const duplicateCounts = [...counts.values()].filter((count) => count > 1);
  return {
    uniqueCount: counts.size,
    duplicateGroupCount: duplicateCounts.length,
    duplicateRowCount: duplicateCounts.reduce((sum, count) => sum + count, 0),
    maxDuplicateCount: duplicateCounts.length ? Math.max(...duplicateCounts) : 0
  };
}

function buildStateCoverage(orderRows) {
  const coverage = {};
  orderRows.forEach((row) => {
    const key = [
      `order=${safeKey(row.orderstate)}`,
      `method=${safeKey(row.paymentmethodselected)}`,
      `payment=${safeKey(row.paymentstate)}`,
      `production=${safeKey(row.productionauthorizationstate)}`,
      `ach=${safeKey(row.achverificationstatus)}`,
      `source=${safeKey(row.achpaymentsource)}`
    ].join('|');
    countBy(coverage, key);
  });
  return Object.entries(coverage)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([state, count]) => ({ state, count }));
}

function summarizeStripeEvents(stripeRows) {
  const byEvent = {};
  const byStatus = {};
  stripeRows.forEach((row) => {
    countBy(byEvent, row.eventtype);
    countBy(byStatus, row.processingstatus);
  });
  return {
    byEventType: byEvent,
    byProcessingStatus: byStatus
  };
}

function buildAudit(options) {
  const exportTable = readTable(options.exportPath);
  const ordersTable = readTable(options.ordersPath);
  const stripeTable = readTable(options.stripePath);
  const exportRows = nonHeaderDataRows(exportTable, EXPECTED_EXPORT_HEADERS, 'token');
  const orderRows = nonHeaderDataRows(ordersTable, EXPECTED_ORDER_HEADERS, 'orderId');
  const stripeRows = nonHeaderDataRows(stripeTable, EXPECTED_STRIPE_HEADERS, 'stripeEventId');
  const embeddedExportHeaders = exportTable.rows.filter((row) => isEmbeddedHeaderRow(row, EXPECTED_EXPORT_HEADERS));
  const embeddedOrderHeaders = ordersTable.rows.filter((row) => isEmbeddedHeaderRow(row, EXPECTED_ORDER_HEADERS));
  const embeddedStripeHeaders = stripeTable.rows.filter((row) => isEmbeddedHeaderRow(row, EXPECTED_STRIPE_HEADERS));
  const activeOrderIds = exportRows.map((row) => row.activeorderid).filter(Boolean);
  const orderIds = new Set(orderRows.map((row) => row.orderid).filter(Boolean));
  const activeOrderIdsMissingOrder = activeOrderIds.filter((id) => !orderIds.has(id));
  const referencedOrders = new Set(activeOrderIds);
  const orderIdsNotReferenced = orderRows.map((row) => row.orderid).filter(Boolean).filter((id) => !referencedOrders.has(id));

  return {
    ok: true,
    redacted: true,
    headerCompatibility: {
      fixtureExport: headerPrefixMatches(exportTable.headers, EXPECTED_EXPORT_HEADERS),
      fixturePortalOrders: headerPrefixMatches(ordersTable.headers, EXPECTED_ORDER_HEADERS),
      fixtureStripeEvents: headerPrefixMatches(stripeTable.headers, EXPECTED_STRIPE_HEADERS)
    },
    rows: {
      fixtureExportDataRows: exportRows.length,
      fixturePortalOrdersDataRows: orderRows.length,
      fixtureStripeEventsDataRows: stripeRows.length
    },
    embeddedHeaderRows: {
      fixtureExport: embeddedExportHeaders.length,
      fixturePortalOrders: embeddedOrderHeaders.length,
      fixtureStripeEvents: embeddedStripeHeaders.length
    },
    duplicateCoverage: {
      activeOrderId: duplicateSummary(activeOrderIds),
      dealNumber: duplicateSummary(exportRows.map((row) => row.dealnumber))
    },
    orderAlignment: {
      uniqueActiveOrderIdCount: new Set(activeOrderIds).size,
      uniqueOrderIdCount: orderIds.size,
      activeOrderIdsMissingOrderCount: activeOrderIdsMissingOrder.length,
      orderIdsNotReferencedCount: orderIdsNotReferenced.length,
      missingOrderHashes: [...new Set(activeOrderIdsMissingOrder)].slice(0, 20).map(hashSensitive),
      unreferencedOrderHashes: [...new Set(orderIdsNotReferenced)].slice(0, 20).map(hashSensitive)
    },
    orderStateCoverage: buildStateCoverage(orderRows),
    stripeEventCoverage: summarizeStripeEvents(stripeRows)
  };
}

function printMarkdown(report) {
  console.log('# Email Review Fixture Audit');
  console.log('');
  console.log(`Header compatibility: export=${report.headerCompatibility.fixtureExport}, orders=${report.headerCompatibility.fixturePortalOrders}, stripe=${report.headerCompatibility.fixtureStripeEvents}`);
  console.log(`Data rows: fixtureExport=${report.rows.fixtureExportDataRows}, fixturePortalOrders=${report.rows.fixturePortalOrdersDataRows}, fixtureStripeEvents=${report.rows.fixtureStripeEventsDataRows}`);
  console.log(`Embedded header rows: fixtureExport=${report.embeddedHeaderRows.fixtureExport}, fixturePortalOrders=${report.embeddedHeaderRows.fixturePortalOrders}, fixtureStripeEvents=${report.embeddedHeaderRows.fixtureStripeEvents}`);
  console.log(`Active order alignment: uniqueActiveOrderIds=${report.orderAlignment.uniqueActiveOrderIdCount}, uniqueOrderIds=${report.orderAlignment.uniqueOrderIdCount}, missingOrderRefs=${report.orderAlignment.activeOrderIdsMissingOrderCount}, unreferencedOrders=${report.orderAlignment.orderIdsNotReferencedCount}`);
  console.log(`Duplicate activeOrderId groups: ${report.duplicateCoverage.activeOrderId.duplicateGroupCount}; max duplicate count: ${report.duplicateCoverage.activeOrderId.maxDuplicateCount}`);
  console.log('');
  console.log('## Order State Coverage');
  report.orderStateCoverage.forEach((item) => console.log(`- ${item.state}: ${item.count}`));
  console.log('');
  console.log('## Stripe Event Coverage');
  Object.entries(report.stripeEventCoverage.byEventType).forEach(([key, count]) => console.log(`- ${key}: ${count}`));
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }
  if (!options.exportPath || !options.ordersPath || !options.stripePath) {
    throw new Error('Missing --export, --orders, or --stripe');
  }
  const report = buildAudit(options);
  if (options.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printMarkdown(report);
  }
}

main();
