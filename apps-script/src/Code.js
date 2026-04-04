/* ============================================================
 * Portal Server Section Map
 * 1. Runtime constants + workbook contracts
 * 2. Web app routing (`doGet` / `doPost`)
 * 3. Auth/session services
 * 4. Dashboard + snapshot-load services
 * 5. Order action gateway + account services
 * 6. Portal VM assembly
 * 7. Workbook infrastructure + shared row/header helpers
 * 8. Order draft normalization + pricing helpers
 * 9. Order persistence + invoices + notifications
 * 10. Stripe checkout + webhook/finalization services
 * 11. Low-level auth/workbook utilities
 * ============================================================ */

const REQUIRED_SHEET_ID = '16KrxpEv8s-U5gjLX-DZK25GbrnkeKbjgInngie8Ce_c';

const CONFIG_KEYS = {
  SHEET_ID: 'SHEET_ID',
  EXPORT_LOG_SHEET: 'EXPORT_LOG_SHEET',
  PORTAL_ORDERS_SHEET: 'PORTAL_ORDERS_SHEET',
  PORTAL_ACCOUNTS_SHEET: 'PORTAL_ACCOUNTS_SHEET',
  MAKE_WEBHOOK_URL: 'MAKE_WEBHOOK_URL',
  MAKE_WEBHOOK_SECRET: 'MAKE_WEBHOOK_SECRET',
  TEAM_MODE_PASSWORD: 'TEAM_MODE_PASSWORD',
  SUCCESS_REDIRECT_URL: 'SUCCESS_REDIRECT_URL',
  STRIPE_PUBLISHABLE_KEY: 'STRIPE_PUBLISHABLE_KEY',
  STRIPE_SECRET_KEY: 'STRIPE_SECRET_KEY',
  STRIPE_WEBHOOK_SECRET: 'STRIPE_WEBHOOK_SECRET',
  STRIPE_WEBHOOK_FORWARD_SHARED_SECRET: 'STRIPE_WEBHOOK_FORWARD_SHARED_SECRET',
  TERMS_DOCUMENT_URL: 'TERMS_DOCUMENT_URL',
  CREDIT_TERMS_FORM_FILE_ID: 'CREDIT_TERMS_FORM_FILE_ID',
  TAX_EXEMPT_FORM_FILE_ID: 'TAX_EXEMPT_FORM_FILE_ID',
  INVOICE_DRIVE_FOLDER_ID: 'INVOICE_DRIVE_FOLDER_ID',
  TERMS_DRIVE_FOLDER_ID: 'TERMS_DRIVE_FOLDER_ID',
  TAX_EXEMPT_DRIVE_FOLDER_ID: 'TAX_EXEMPT_DRIVE_FOLDER_ID',
  STRIPE_PRICE_CURRENCY: 'STRIPE_PRICE_CURRENCY',
  STRIPE_MODE: 'STRIPE_MODE',
  STRIPE_RETURN_URL: 'STRIPE_RETURN_URL'
};

const DEFAULT_MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/rpulw78oq9tup5smtsb7kv4c7bc607lm';
const DEFAULT_TEAM_MODE_PASSWORD = 'R3dthreads!';
const DEFAULT_PORTAL_ORDERS_SHEET = 'PORTAL_ORDERS';
const DEFAULT_PORTAL_ACCOUNTS_SHEET = 'PORTAL_ACCOUNTS';
const DEFAULT_TERMS_DOCUMENT_URL = 'https://docs.google.com/document/d/e/2PACX-1vTEXZ7SlwqZF_gc_OAdyjHoYSCiw698FTtM4FT7BBpUtZxR3k-jvj3p66_aVMUpvW6dPkNK95woGWmu/pub';
const DEFAULT_CREDIT_TERMS_FORM_FILE_ID = '1UJH35hEi4cGVGZJxXRvSqrD3-CRq3lBx';
const DEFAULT_CREDIT_TERMS_FORM_PAGE_1_FILE_ID = '1hQRaT0MgsQ-3I-y6BZkRxkQATwx1bhY7';
const DEFAULT_CREDIT_TERMS_FORM_PAGE_2_FILE_ID = '1DShGuutc1h1hTvQTZlpTLGstkoXY7YOp';
const DEFAULT_CREDIT_TERMS_FORM_PAGE_3_FILE_ID = '15bagD3tiAmqrgYJODucDkqH6LZJFNpjD';
const DEFAULT_CREDIT_TERMS_FORM_PAGE_4_FILE_ID = '1oGkorKL2BaPZ8uwGFVA16MZqxAKZ1qWY';
const DEFAULT_CREDIT_TERMS_FORM_PAGE_5_FILE_ID = '14zA8F2PJXnWjdE3ulEwrIHIb3Nggc641';
const DEFAULT_TAX_EXEMPT_FORM_FILE_ID = '1YFX3fr9KQezRY_zkPrI8_A-qTlNnOxTc';
const DEFAULT_TAX_EXEMPT_FORM_PAGE_1_FILE_ID = '15mx_j0YXlnfdBFkQdc_xpeH8XIXusyf3';
const DEFAULT_TAX_EXEMPT_FORM_PAGE_2_FILE_ID = '1GYkbUhqaD7t4yDUy8t8FrwhMS0IJqH1l';
const DEFAULT_INVOICE_DRIVE_FOLDER_ID = '1TrrLxq4jOS38kMPs7sQIf_rd3iepwlej';
const DEFAULT_TERMS_DRIVE_FOLDER_ID = '1uuF9c4DvROk37AoaFrh9qcf9lsFc0uj0';
const DEFAULT_TAX_EXEMPT_DRIVE_FOLDER_ID = '1ixz5zXLMW5GWBQ0VIhGHy89_JYwKiyyT';
const DEFAULT_STRIPE_PRICE_CURRENCY = 'USD';
const DEFAULT_STRIPE_MODE = 'test';
const DEFAULT_STRIPE_CHECKOUT_SESSION_API_VERSION = '2025-08-27.basil';
const NOTIFICATION_SENDER_NAME = 'Red Threads';
const NOTIFICATION_FROM_ALIAS = 'noreply@redthreads.com';
const NOTIFICATION_REPLY_NOTICE = 'This inbox is not monitored. Please use your portal link below to view updates or respond.';
const DOCUMENT_REVIEW_EMAIL = 'hello@redthreads.com';
const MAX_ACCOUNT_DOCUMENT_UPLOAD_BYTES = 5 * 1024 * 1024;
const TEAM_MODE_AUTH_TTL_MS = 12 * 60 * 60 * 1000;
const EXPORT_LOG_COLUMNS = {
  chatLogJson: 28
};

const EXPORT_LOG_POINTER_HEADERS = [
  'activeOrderId',
  'latestCheckoutAttemptId',
  'currentAccountId',
  'portalLockState',
  'currentOrderState',
  'currentPaymentState',
  'currentProductionAuthorizationState',
  'currentPaymentMethod',
  'termsApproved',
  'taxExemptApproved',
  'latestInvoiceNumber',
  'lastOrderUpdatedAt'
];

const USER_HEADERS = [
  'userId',
  'email',
  'passwordHash',
  'emailVerified',
  'createdAt',
  'resetCode',
  'resetCodeExpiresAt',
  'displayName',
  'defaultOrgId',
  'defaultOrgName',
  'role',
  'status',
  'lastLoginAt',
  'notes'
];

const USER_SESSION_HEADERS = [
  'sessionId',
  'email',
  'expiresAt',
  'createdAt',
  'userId',
  'lastSeenAt',
  'revokedAt',
  'mode',
  'notes'
];

const PORTAL_ORDER_HEADERS = [
  'orderId',
  'checkoutAttemptId',
  'orderRevision',
  'token',
  'snapshotId',
  'dealNumber',
  'projectName',
  'personEmail',
  'orgId',
  'orgName',
  'accountId',
  'createdAt',
  'lastUpdatedAt',
  'portalLockState',
  'orderState',
  'paymentMethodSelected',
  'paymentState',
  'productionAuthorizationState',
  'clientReapprovalRequired',
  'taxStatusApplied',
  'taxExemptApplied',
  'amountSubtotal',
  'amountShipping',
  'amountRush',
  'amountTax',
  'amountGrandTotal',
  'currency',
  'stripeSessionId',
  'stripePaymentIntentId',
  'invoiceNumber',
  'invoicePdfUrl',
  'invoiceSentToEmail',
  'invoiceSentAt',
  'poNumber',
  'poDocumentUrl',
  'poSubmittedBy',
  'poSubmittedAt',
  'paidAt',
  'authorizedToProduceAt',
  'lockedAt',
  'paymentReceivedManuallyBy',
  'paymentReceivedManuallyAt',
  'orderDraftJson',
  'revisionReason',
  'notes'
];

const PORTAL_ACCOUNT_HEADERS = [
  'accountId',
  'orgId',
  'orgName',
  'primaryEmail',
  'primaryContactName',
  'termsStatus',
  'termsApproved',
  'termsApprovedAt',
  'termsApprovedByName',
  'termsApprovedByEmail',
  'termsDocumentUrl',
  'signedTermsFileUrl',
  'signedTermsSubmittedAt',
  'approvedPaymentTermsCode',
  'approvedPaymentTermsLabel',
  'approvedPaymentTermsDays',
  'approvedPaymentTermsNotes',
  'approvedPaymentTermsSetAt',
  'approvedPaymentTermsSetByName',
  'approvedPaymentTermsSetByEmail',
  'taxExemptStatus',
  'taxExemptApproved',
  'taxExemptApprovedAt',
  'taxExemptApprovedByName',
  'taxExemptApprovedByEmail',
  'taxExemptCertificateUrl',
  'taxExemptCertificateNumber',
  'taxExemptSubmittedAt',
  'taxExemptExpiresAt',
  'billingContactEmail',
  'billingContactName',
  'createdAt',
  'updatedAt',
  'notes'
];

const PORTAL_LOCK_STATES = {
  editable: 'editable',
  locked: 'locked'
};

const PAYMENT_METHODS = {
  card: 'card',
  ach: 'ach',
  check: 'check',
  cash: 'cash',
  purchase_order: 'purchase_order'
};

const FULFILLMENT_METHODS = {
  shipping: 'shipping',
  pickup: 'pickup'
};

const STRIPE_FULFILLMENT_FREE_SHIPPING_THRESHOLD_CENTS = 50000;
const STRIPE_FULFILLMENT_FLAT_RATE_SHIPPING_CENTS = 2500;
const STRIPE_FULFILLMENT_SHIPPING_SERVICE_LABEL = 'UPS Standard Ground Services';
const STRIPE_FULFILLMENT_ALLOWED_COUNTRIES = ['US'];

const PAYMENT_STATES = {
  not_started: 'not_started',
  checkout_created: 'checkout_created',
  submitted: 'submitted',
  pending: 'pending',
  paid: 'paid',
  failed: 'failed',
  manual_pending: 'manual_pending',
  manual_received: 'manual_received'
};

const PRODUCTION_AUTHORIZATION_STATES = {
  not_authorized: 'not_authorized',
  po_pending: 'po_pending',
  authorized: 'authorized',
  canceled: 'canceled'
};

const ORDER_STATES = {
  draft: 'draft',
  payment_in_progress: 'payment_in_progress',
  awaiting_manual_payment: 'awaiting_manual_payment',
  awaiting_po_submission: 'awaiting_po_submission',
  awaiting_payment_confirmation: 'awaiting_payment_confirmation',
  ready_for_production: 'ready_for_production',
  in_production: 'in_production',
  closed: 'closed'
};

const FINAL_LOCK_STATUSES = {
  submitted: true,
  placed: true,
  ordered: true,
  locked: true
};

const AUTH_SHEETS = {
  USERS: 'USERS',
  USER_SESSIONS: 'USER_SESSIONS'
};

const ACCOUNT_DOCUMENT_TYPES = {
  credit_terms: 'credit_terms',
  tax_exempt: 'tax_exempt'
};

const APPROVED_PAYMENT_TERMS_OPTIONS = [
  { code: 'net_15', label: 'Net 15', days: 15 },
  { code: 'net_30', label: 'Net 30', days: 30 },
  { code: 'net_60', label: 'Net 60', days: 60 },
  { code: 'net_90', label: 'Net 90', days: 90 }
];

const AUTH_COLUMNS = {
  USERS: {
    userId: 'userid',
    email: 'email',
    passwordHash: 'passwordhash',
    emailVerified: 'emailverified',
    createdAt: 'createdat',
    resetCode: 'resetcode',
    resetCodeExpiresAt: 'resetcodeexpiresat',
    displayName: 'displayname',
    defaultOrgId: 'defaultorgid',
    defaultOrgName: 'defaultorgname',
    role: 'role',
    status: 'status',
    lastLoginAt: 'lastloginat',
    notes: 'notes'
  },
  USER_SESSIONS: {
    sessionId: 'sessionid',
    email: 'email',
    expiresAt: 'expiresat',
    createdAt: 'createdat',
    userId: 'userid',
    lastSeenAt: 'lastseenat',
    revokedAt: 'revokedat',
    mode: 'mode',
    notes: 'notes'
  }
};

const AUTH_POLICY = {
  SESSION_TTL_MS: 12 * 60 * 60 * 1000,
  RESET_CODE_TTL_MS: 15 * 60 * 1000,
  RESET_RESEND_THROTTLE_MS: 30 * 1000,
  HASH_ITERATIONS_LEGACY_V1: 50000,
  HASH_ITERATIONS_V2: 1200,
  MAX_VERIFY_ITERATIONS: 2000,
  DEBUG_AUTH_TIMING: true,
  PROJECT_CACHE_TTL_SEC: 300
};

const EXPORT_LOG_PERSON_EMAIL_HEADER = 'personemail';
const LOGIN_DENY_MESSAGE =
  'No account exists. To access your Job data, log in with the email you used to communicate this job to Red Threads.';

/* ---------------- Web App Routing ---------------- */

function doGet(e) {
  try {
    const token =
      (e && e.parameter && (e.parameter.t || e.parameter.token))
        ? String(e.parameter.t || e.parameter.token).trim()
        : '';
    if (!token) {
      const tpl = createIndexTemplate_(buildAuthShellVm_());
      return tpl.evaluate()
        .setTitle('Red Threads Estimate Portal')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    }

    const mode = normalizeMode_((e && e.parameter && e.parameter.mode) || 'client');

    const cfg = getConfig_();
    const ss = SpreadsheetApp.openById(cfg.sheetId);
    const infra = ensurePortalInfrastructure_(ss, cfg);
    const sheet = infra.exportSheet;
    if (!sheet) return renderMessage_('Configuration error', 'EXPORT_LOG sheet not found.');

    const rowInfo = findRowByToken_(sheet, token);
    if (!rowInfo) return renderMessage_('Link not found', 'This link is invalid or no longer available.');

    const row = rowInfo.rowObjNormalized;
    const status = String(row.status || '').toLowerCase();

    if (status === 'replaced') {
      return renderMessage_('Link replaced', 'This estimate link has been replaced. Please use the most recent email link.');
    }

    const snapshotRaw = String(row.snapshotjson || '').trim();
    if (!snapshotRaw) {
      return renderMessage_('Configuration error', 'Snapshot data is missing.');
    }

    const snapshot = safeJsonParse_(snapshotRaw, null);
    if (!snapshot || typeof snapshot !== 'object') {
      return renderMessage_('Configuration error', 'Snapshot data is malformed.');
    }
    const rawPrintJobs = Array.isArray(snapshot.printJobs)
      ? snapshot.printJobs
      : ((snapshot.printJobs && typeof snapshot.printJobs === 'object')
        ? Object.keys(snapshot.printJobs).map(key => snapshot.printJobs[key])
        : []);
    const printJobIds = rawPrintJobs
      .map((job, idx) => {
        if (!job || typeof job !== 'object') return '';
        return String(job.printJobId || ('PJ' + (idx + 1))).trim();
      })
      .filter(Boolean);

    const contractVersion = String(
      row.contractversion ||
      (snapshot.meta && snapshot.meta.contractVersion) ||
      ''
    ).trim();

    if (majorVersion_(contractVersion) !== 2) {
      if (mode === 'team') {
        return renderTeamContractMessage_({
          token: token,
          status: status,
          contractVersion: contractVersion,
          snapshotId: String(row.snapshotid || '').trim(),
          exportedAt: String(row.exportedat || '').trim(),
          snapshotSnippet: snapshotRaw.slice(0, 500)
        });
      }
      return renderMessage_(
        'Unsupported Estimate Link',
        'This portal link is on an unsupported contract version. Please request a fresh estimate link.'
      );
    }

    const built = buildPortalVmForRow_(rowInfo, token, mode);
    if (!built || built.ok !== true || !built.vm) {
      return renderMessage_(
        mode === 'team' ? 'Team Link Error' : 'Link Error',
        String((built && built.error) || 'Unable to load project.')
      );
    }

    const tpl = createIndexTemplate_(built.vm);

    return tpl.evaluate()
      .setTitle('Red Threads Estimate Portal')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (err) {
    return renderMessage_('Runtime error', String((err && err.message) || err));
  }
}

function createIndexTemplate_(vm) {
  const tpl = HtmlService.createTemplateFromFile('Index');
  const payload = (vm && typeof vm === 'object') ? vm : {};
  tpl.VM = payload;
  tpl.VM_B64 = encodeVmPayload_(payload);
  return tpl;
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(String(filename || '').trim()).getContent();
}

function encodeVmPayload_(vm) {
  const json = JSON.stringify(vm || {});
  return Utilities.base64EncodeWebSafe(
    Utilities.newBlob(json, 'application/json').getBytes()
  );
}

function appendChatMessage(payload) {
  try {
    const p = (payload && typeof payload === 'object') ? payload : {};
    const token = String(p.token || '').trim();
    const text = String(p.text || '').trim();
    const sender = String(p.sender || '').trim().toLowerCase();
    const teamSenderName = String(p.teamSenderName || '').trim();

    const validSender = sender === 'client' || sender === 'team';
    if (!token || !text || text.length > 1000 || !validSender) {
      return { ok: false, error: 'Invalid input' };
    }

    const cfg = getConfig_();
    const ss = SpreadsheetApp.openById(cfg.sheetId);
    const sheet = ss.getSheetByName(cfg.exportLogSheetName);
    if (!sheet) return { ok: false, error: 'Invalid input' };

    const rowInfo = findRowByToken_(sheet, token);
    if (!rowInfo) return { ok: false, error: 'Invalid input' };

    const row = rowInfo.row;
    const colMap = rowInfo.colMap || {};
    const chatCol = colMap.chatlogjson || EXPORT_LOG_COLUMNS.chatLogJson;
    if (!chatCol) return { ok: false, error: 'Invalid input' };

    const chatLog = readChatLogForRow_(sheet, rowInfo);
    const nextMsg = createChatMessage_(sender, text, '', {
      authorName: sender === 'team' ? teamSenderName : ''
    });
    const nextChatLog = normalizeChatLog_(chatLog.concat([nextMsg]));

    sheet.getRange(row, chatCol).setValue(JSON.stringify(nextChatLog));

    let savedAt = '';
    let statusOut = String(rowInfo.rowObjNormalized.status || '').trim() || 'Editable';

    if (Object.prototype.hasOwnProperty.call(p, 'portalState')) {
      const portalState = parsePortalStateInput_(p.portalState);
      const rowPortalState = safeJsonParse_(rowInfo.rowObjNormalized.portalstatejson, null);
      const isLocked = isLockedPortalRow_(rowInfo.rowObjNormalized, rowPortalState);
      const persisted = persistPortalStateForRow_(sheet, rowInfo, portalState, {
        locked: isLocked,
        status: isLocked ? getFinalStatusForRow_(rowInfo.rowObjNormalized) : 'Editable',
        chatLog: nextChatLog,
        clearSubmittedAt: !isLocked
      });
      if (!persisted.ok) return persisted;
      savedAt = String(persisted.savedAt || '');
      statusOut = String(persisted.status || statusOut || '');
    }

    const notificationPayload = buildChatNotificationPayload_(rowInfo, nextMsg, {
      token: token,
      senderType: sender,
      teamSenderName: teamSenderName,
      messageText: String(p.messageText || '').trim(),
      projectName: String(p.projectName || '').trim(),
      printJobId: String(p.printJobId || '').trim()
    });
    if (sender === 'team') {
      sendPortalMessageNotificationEmail_(rowInfo, nextMsg, notificationPayload);
    } else {
      sendChatNotificationToMake_(notificationPayload);
    }

    return { ok: true, chatLog: nextChatLog, status: statusOut, savedAt: savedAt };
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

function getPrintJobArtStatusHeader_(printJobIndex) {
  const idx = Number(printJobIndex);
  if (!Number.isInteger(idx)) return '';
  switch (idx) {
    case 1: return 'printJob1ArtStatus';
    case 2: return 'printJob2ArtStatus';
    case 3: return 'printJob3ArtStatus';
    case 4: return 'printJob4ArtStatus';
    default: return '';
  }
}

function buildPrintJobAuditLabel_(rowInfo, printJobIndex) {
  const idx = Number(printJobIndex);
  const fallbackNumber = Number.isInteger(idx) && idx > 0 ? idx : 1;
  const row = rowInfo && rowInfo.rowObjNormalized ? rowInfo.rowObjNormalized : {};
  const snapshot = safeJsonParse_(row.snapshotjson, null);
  const rawPrintJobs = Array.isArray(snapshot && snapshot.printJobs)
    ? snapshot.printJobs
    : ((snapshot && snapshot.printJobs && typeof snapshot.printJobs === 'object')
      ? Object.keys(snapshot.printJobs).map(key => snapshot.printJobs[key])
      : []);
  const rawJob = rawPrintJobs[fallbackNumber - 1];
  const printJobName = String(
    rawJob && typeof rawJob === 'object'
      ? (rawJob.printJobName || rawJob.projectName || rawJob.name || '')
      : ''
  ).trim();
  return printJobName
    ? ('Print Job ' + fallbackNumber + ': ' + printJobName)
    : ('Print Job ' + fallbackNumber);
}

function buildArtworkAuditText_(rowInfo, printJobIndex, action) {
  const label = buildPrintJobAuditLabel_(rowInfo, printJobIndex);
  const normalizedAction = String(action || '').trim().toLowerCase();
  if (normalizedAction === 'disapproved') {
    return 'Artwork disapproved for ' + label + '.';
  }
  return 'Artwork approved for ' + label + '.';
}

function persistActionChatLogForRow_(sheet, rowInfo, chatLog, options) {
  const opts = (options && typeof options === 'object') ? options : {};
  const nextChatLog = normalizeChatLog_(chatLog);
  const colMap = rowInfo.colMap || {};
  const chatCol = colMap.chatlogjson || EXPORT_LOG_COLUMNS.chatLogJson;
  if (chatCol) {
    sheet.getRange(rowInfo.row, chatCol).setValue(JSON.stringify(nextChatLog));
  }

  if (!Object.prototype.hasOwnProperty.call(opts, 'portalState')) {
    return {
      ok: true,
      chatLog: nextChatLog,
      savedAt: '',
      status: String((rowInfo.rowObjNormalized && rowInfo.rowObjNormalized.status) || '').trim()
    };
  }

  const portalState = parsePortalStateInput_(opts.portalState);
  const rowPortalState = safeJsonParse_(rowInfo.rowObjNormalized.portalstatejson, null);
  const isLocked = isLockedPortalRow_(rowInfo.rowObjNormalized, rowPortalState);
  const persisted = persistPortalStateForRow_(sheet, rowInfo, portalState, {
    token: String(opts.token || ''),
    locked: isLocked,
    status: isLocked ? getFinalStatusForRow_(rowInfo.rowObjNormalized) : 'Editable',
    chatLog: nextChatLog,
    clearSubmittedAt: !isLocked
  });
  if (!persisted.ok) return persisted;
  return {
    ok: true,
    chatLog: nextChatLog,
    savedAt: String(persisted.savedAt || ''),
    status: String(persisted.status || '')
  };
}

function setArtworkApproval(payload) {
  try {
    const p = (payload && typeof payload === 'object') ? payload : {};
    const token = String(p.token || '').trim();
    const nextStatus = String(p.status || 'approved').trim().toLowerCase();
    const printJobIndex = Number(p.printJobIndex);
    if (!token) return { ok: false, error: 'Missing token.' };
    if (nextStatus !== 'approved') return { ok: false, error: 'Invalid art status.' };
    if (!Number.isInteger(printJobIndex) || printJobIndex < 1 || printJobIndex > 4) {
      return { ok: false, error: 'Invalid print job index.' };
    }
    if (Object.prototype.hasOwnProperty.call(p, 'portalState')) {
      parsePortalStateInput_(p.portalState);
    }

    const cfg = getConfig_();
    const ss = SpreadsheetApp.openById(cfg.sheetId);
    const sheet = ss.getSheetByName(cfg.exportLogSheetName);
    if (!sheet) return { ok: false, error: 'EXPORT_LOG sheet not found.' };

    const rowInfo = findRowByToken_(sheet, token);
    if (!rowInfo) return { ok: false, error: 'Token not found.' };

    const artStatusHeader = getPrintJobArtStatusHeader_(printJobIndex);
    if (!artStatusHeader) {
      return { ok: false, error: 'Invalid print job index.' };
    }
    const colMap = rowInfo.colMap || {};
    const artStatusCol = colMap[normalizeHeaderKey_(artStatusHeader)];
    if (!artStatusCol) {
      return { ok: false, error: artStatusHeader + ' column not found.' };
    }

    sheet.getRange(rowInfo.row, artStatusCol).setValue('approved');
    const changedAt = String(p.changedAt || '').trim();
    const existingChatLog = readChatLogForRow_(sheet, rowInfo);
    const nextChatLog = appendUniqueChatMessage_(
      existingChatLog,
      createChatMessage_(
        'system',
        String(p.systemMessage || buildArtworkAuditText_(rowInfo, printJobIndex, 'approved')).trim(),
        changedAt
      )
    );
    const persisted = persistActionChatLogForRow_(sheet, rowInfo, nextChatLog, {
      token: token,
      portalState: p.portalState
    });
    if (!persisted.ok) return persisted;
    return {
      ok: true,
      artStatus: 'approved',
      printJobIndex: printJobIndex,
      column: artStatusHeader,
      chatLog: nextChatLog,
      savedAt: String(persisted.savedAt || ''),
      status: String(persisted.status || '')
    };
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

function clearArtworkApproval(payload) {
  try {
    const p = (payload && typeof payload === 'object') ? payload : {};
    const token = String(p.token || '').trim();
    const printJobIndex = Number(p.printJobIndex);
    if (!token) return { ok: false, error: 'Missing token.' };
    if (!Number.isInteger(printJobIndex) || printJobIndex < 1 || printJobIndex > 4) {
      return { ok: false, error: 'Invalid print job index.' };
    }
    if (Object.prototype.hasOwnProperty.call(p, 'portalState')) {
      parsePortalStateInput_(p.portalState);
    }

    const cfg = getConfig_();
    const ss = SpreadsheetApp.openById(cfg.sheetId);
    const sheet = ss.getSheetByName(cfg.exportLogSheetName);
    if (!sheet) return { ok: false, error: 'EXPORT_LOG sheet not found.' };

    const rowInfo = findRowByToken_(sheet, token);
    if (!rowInfo) return { ok: false, error: 'Token not found.' };

    const artStatusHeader = getPrintJobArtStatusHeader_(printJobIndex);
    if (!artStatusHeader) {
      return { ok: false, error: 'Invalid print job index.' };
    }
    const colMap = rowInfo.colMap || {};
    const artStatusCol = colMap[normalizeHeaderKey_(artStatusHeader)];
    if (!artStatusCol) {
      return { ok: false, error: artStatusHeader + ' column not found.' };
    }

    sheet.getRange(rowInfo.row, artStatusCol).setValue('');
    const changedAt = String(p.changedAt || '').trim();
    const existingChatLog = readChatLogForRow_(sheet, rowInfo);
    const nextChatLog = appendUniqueChatMessage_(
      existingChatLog,
      createChatMessage_(
        'system',
        String(p.systemMessage || buildArtworkAuditText_(rowInfo, printJobIndex, 'disapproved')).trim(),
        changedAt
      )
    );
    const persisted = persistActionChatLogForRow_(sheet, rowInfo, nextChatLog, {
      token: token,
      portalState: p.portalState
    });
    if (!persisted.ok) return persisted;
    return {
      ok: true,
      artStatus: '',
      printJobIndex: printJobIndex,
      column: artStatusHeader,
      chatLog: nextChatLog,
      savedAt: String(persisted.savedAt || ''),
      status: String(persisted.status || '')
    };
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

function savePortalState(token, portalStateInput) {
  try {
    const tokenValue = String(token || '').trim();
    if (!tokenValue) {
      return { ok: false, error: 'Missing token.' };
    }

    const portalState = parsePortalStateInput_(portalStateInput);

    const cfg = getConfig_();
    const ss = SpreadsheetApp.openById(cfg.sheetId);
    const sheet = ss.getSheetByName(cfg.exportLogSheetName);
    if (!sheet) {
      return { ok: false, error: 'EXPORT_LOG sheet not found.' };
    }

    const rowInfo = findRowByToken_(sheet, tokenValue);
    if (!rowInfo) {
      return { ok: false, error: 'Token not found.' };
    }

    const existingPortalState = safeJsonParse_(rowInfo.rowObjNormalized.portalstatejson, null);
    if (isLockedPortalRow_(rowInfo.rowObjNormalized, existingPortalState)) {
      return { ok: false, error: 'Portal is finalized.' };
    }

    return persistPortalStateForRow_(sheet, rowInfo, portalState, {
      token: tokenValue,
      locked: false,
      status: 'Editable',
      clearSubmittedAt: true
    });
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

function finalizePortalAfterPayment(payload) {
  try {
    const p = (payload && typeof payload === 'object') ? payload : {};
    const token = String(p.token || '').trim();
    if (!token) {
      return { ok: false, error: 'Missing token.' };
    }

    const portalState = parsePortalStateInput_(p.portalState);

    const cfg = getConfig_();
    const ss = SpreadsheetApp.openById(cfg.sheetId);
    const sheet = ss.getSheetByName(cfg.exportLogSheetName);
    if (!sheet) {
      return { ok: false, error: 'EXPORT_LOG sheet not found.' };
    }

    const rowInfo = findRowByToken_(sheet, token);
    if (!rowInfo) {
      return { ok: false, error: 'Token not found.' };
    }

    const existingPortalState = safeJsonParse_(rowInfo.rowObjNormalized.portalstatejson, null);
    const requestedSubmittedAt = String(p.submittedAt || p.finalizedAt || '').trim();
    const requestedOrNow = requestedSubmittedAt && !isNaN(new Date(requestedSubmittedAt).getTime())
      ? requestedSubmittedAt
      : new Date().toISOString();
    const existingSubmittedAt = String(rowInfo.rowObjNormalized.submittedat || '').trim();
    const submittedAt = (isLockedPortalRow_(rowInfo.rowObjNormalized, existingPortalState) && existingSubmittedAt)
      ? existingSubmittedAt
      : requestedOrNow;
    const existingChatLog = readChatLogForRow_(sheet, rowInfo);
    const systemText = String(
      p.systemMessage || ('Order placed successfully on ' + submittedAt + '.')
    ).trim();
    const nextChatLog = appendUniqueChatMessage_(
      existingChatLog,
      createChatMessage_('system', systemText, submittedAt)
    );

    const persisted = persistPortalStateForRow_(sheet, rowInfo, portalState, {
      token: token,
      locked: true,
      status: 'submitted',
      chatLog: nextChatLog,
      submittedAt: submittedAt,
      writeSubmittedState: true
    });
    if (!persisted.ok) return persisted;

    return {
      ok: true,
      token: token,
      status: String(persisted.status || 'submitted'),
      savedAt: String(persisted.savedAt || submittedAt),
      submittedAt: String(persisted.submittedAt || submittedAt),
      chatLog: nextChatLog
    };
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

function doPost(e) {
  try {
    const payload = safeJsonParse_(e && e.postData && e.postData.contents, null);
    if (!payload || typeof payload !== 'object') {
      return jsonOutput_({ ok: false, error: 'Invalid JSON body.' });
    }

    const route = resolveWebhookRoute_(e, payload);
    if (route === 'stripewebhook') {
      return jsonOutput_(processForwardedStripeWebhookPayload_(payload, { route: route }));
    }

    const action = String(payload.action || '').toLowerCase();
    if (action === 'save') {
      const token = String(payload.token || '').trim();
      if (!token) {
        return jsonOutput_({ ok: false, error: 'Missing token.' });
      }
      const result = savePortalState(token, payload.portalState);
      return jsonOutput_(result);
    }
    if (action === 'finalize_after_payment' || action === 'finalizeafterpayment') {
      return jsonOutput_(finalizePortalAfterPayment(payload));
    }
    if (action === 'create_checkout_attempt') {
      return jsonOutput_(createCheckoutAttempt(payload));
    }
    if (action === 'initiate_manual_payment') {
      return jsonOutput_(initiateManualPayment(payload));
    }
    if (action === 'initiate_purchase_order') {
      return jsonOutput_(initiatePurchaseOrder(payload));
    }
    if (action === 'generate_invoice') {
      return jsonOutput_(generateInvoice(payload));
    }
    if (action === 'get_account_status') {
      return jsonOutput_(getAccountStatus(payload));
    }
    if (action === 'request_terms_enrollment') {
      return jsonOutput_(requestTermsEnrollment(payload));
    }
    if (action === 'request_tax_exempt_submission') {
      return jsonOutput_(requestTaxExemptSubmission(payload));
    }
    if (action === 'email_account_document_source') {
      return jsonOutput_(emailAccountDocumentSource(payload));
    }
    if (action === 'download_account_document_source') {
      return jsonOutput_(downloadAccountDocumentSource(payload));
    }
    if (action === 'submit_account_document_upload') {
      return jsonOutput_(submitAccountDocumentUpload(payload));
    }
    if (action === 'submit_tax_exempt_guided_submission') {
      return jsonOutput_(submitTaxExemptGuidedSubmission(payload));
    }
    if (action === 'email_tax_exempt_submission_copy') {
      return jsonOutput_(emailTaxExemptSubmissionCopy(payload));
    }
    if (action === 'get_tax_exempt_team_review') {
      return jsonOutput_(getTaxExemptTeamReview(payload));
    }
    if (action === 'approve_tax_exempt_submission') {
      return jsonOutput_(approveTaxExemptSubmission(payload));
    }
    if (action === 'deny_tax_exempt_submission') {
      return jsonOutput_(denyTaxExemptSubmission(payload));
    }
    if (action === 'admin_mark_manual_payment_received') {
      return jsonOutput_(adminMarkManualPaymentReceived(payload));
    }
    if (action === 'admin_mark_po_received') {
      return jsonOutput_(adminMarkPoReceived(payload));
    }
    if (action === 'begin_internal_order_adjustment') {
      return jsonOutput_(beginInternalOrderAdjustment(payload));
    }
    return jsonOutput_({ ok: false, error: 'Unsupported action.' });
  } catch (err) {
    return jsonOutput_({ ok: false, error: String((err && err.message) || err) });
  }
}

/* ---------------- Auth + Session Services ---------------- */

/**
 * PHASE 1 (Login only):
 * - Validate credentials against USERS only.
 * - Create session in USER_SESSIONS.
 * - Do NOT read EXPORT_LOG, parse snapshots, or build project payloads.
 */
function loginUser(payload) {
  const t0 = Date.now();
  const timings = {
    openMs: 0,
    findMs: 0,
    verifyMs: 0,
    sessionMs: 0,
    dashboardMs: 0,
    totalMs: 0
  };
  const withTiming = function (resp) {
    if (AUTH_POLICY.DEBUG_AUTH_TIMING) {
      timings.totalMs = Date.now() - t0;
      resp.timings = {
        openMs: timings.openMs,
        findMs: timings.findMs,
        verifyMs: timings.verifyMs,
        sessionMs: timings.sessionMs,
        dashboardMs: timings.dashboardMs,
        totalMs: timings.totalMs
      };
    }
    return resp;
  };
  try {
    const p = (payload && typeof payload === 'object') ? payload : {};
    const email = normalizeEmail_(p.email);
    const password = String(p.password || '');

    if (!email || !password) {
      return withTiming({ ok: false, error: 'Email and password are required.' });
    }

    const openStart = Date.now();
    const cfg = getConfig_();
    const ss = SpreadsheetApp.openById(cfg.sheetId);
    const infra = ensurePortalInfrastructure_(ss, cfg);
    const usersSheet = infra.usersSheet;
    const sessionsSheet = infra.sessionsSheet;
    timings.openMs = Date.now() - openStart;

    if (!usersSheet || !sessionsSheet) {
      return withTiming({ ok: false, error: 'Auth configuration is incomplete.' });
    }

    const findStart = Date.now();
    let user = findUserByEmail_(usersSheet, email);
    let createdFromExport = false;
    if (!user) {
      const exportSheet = infra.exportSheet;
      if (!exportSheet) {
        timings.findMs = Date.now() - findStart;
        return withTiming({ ok: false, error: 'Auth configuration is incomplete.' });
      }

      // First-time login policy: if email exists on any EXPORT_LOG row, create user and continue.
      const allowed = emailExistsInExportLog_(exportSheet, email);
      if (!allowed) {
        timings.findMs = Date.now() - findStart;
        return withTiming({ ok: false, error: LOGIN_DENY_MESSAGE });
      }

      user = createUser_(usersSheet, email, password);
      createdFromExport = true;
    }
    timings.findMs = Date.now() - findStart;
    if (!user) {
      return withTiming({ ok: false, error: 'Invalid credentials' });
    }

    const storedHash = String(user.rowObjNormalized[AUTH_COLUMNS.USERS.passwordHash] || '').trim();
    let verifyResult = { ok: true, version: 'v2', iterations: AUTH_POLICY.HASH_ITERATIONS_V2 };
    if (!createdFromExport) {
      const verifyStart = Date.now();
      verifyResult = verifyPasswordDetailed_(password, storedHash);
      timings.verifyMs = Date.now() - verifyStart;
    } else {
      timings.verifyMs = 0;
    }
    if (!storedHash) {
      return withTiming({
        ok: false,
        error: 'Password reset required. Click "Forgot password?" to set a new password.',
        needsReset: true
      });
    }
    if (verifyResult.needsReset === true) {
      return withTiming({
        ok: false,
        error: 'Password reset required. Click "Forgot password?" to set a new password.',
        needsReset: true
      });
    }
    if (!verifyResult.ok) {
      return withTiming({ ok: false, error: 'Invalid credentials' });
    }

    // Upgrade any non-standard/legacy successful formats to current v2 policy.
    if (verifyResult.version !== 'v2' || verifyResult.iterations !== AUTH_POLICY.HASH_ITERATIONS_V2) {
      const upgrades = {};
      upgrades[AUTH_COLUMNS.USERS.passwordHash] = hashPasswordV2_(password);
      updateUserColumns_(usersSheet, user, upgrades);
    }

    const sessionStart = Date.now();
    const session = createSession_(sessionsSheet, email);
    const sessionUpdates = {};
    if (session.userId == null && user && user.rowObjNormalized && user.rowObjNormalized[AUTH_COLUMNS.USERS.userId]) {
      sessionUpdates[AUTH_COLUMNS.USER_SESSIONS.userId] = trimString_(user.rowObjNormalized[AUTH_COLUMNS.USERS.userId]);
    }
    if (sessionUpdates && Object.keys(sessionUpdates).length) {
      setRowValuesByHeaderMap_(sessionsSheet, sessionsSheet.getLastRow(), buildColumnMap_(sessionsSheet.getRange(1, 1, 1, sessionsSheet.getLastColumn()).getValues()[0]), sessionUpdates);
    }
    updateUserColumns_(usersSheet, user, {
      lastloginat: nowIso_(),
      status: 'active'
    });
    timings.sessionMs = Date.now() - sessionStart;

    let dashboardHomeData = null;
    const dashboardStart = Date.now();
    try {
      const builtDashboardHomeData = buildDashboardHomeData_({
        email: email,
        cfg: cfg,
        ss: ss,
        infra: infra,
        userCtx: {
          ok: true,
          email: email,
          user: user
        }
      });
      if (builtDashboardHomeData && builtDashboardHomeData.ok === true) {
        dashboardHomeData = builtDashboardHomeData;
      }
    } catch (_) {}
    timings.dashboardMs = Date.now() - dashboardStart;

    return withTiming({
      ok: true,
      sessionId: session.sessionId,
      email: email,
      dashboardHomeData: dashboardHomeData
    });
  } catch (err) {
    return withTiming({ ok: false, error: String((err && err.message) || err) });
  }
}

// Backward-compatible alias for existing frontend callers.
function authLogin(payload) {
  return loginUser(payload);
}

function authLogout(payload) {
  try {
    const p = (payload && typeof payload === 'object') ? payload : {};
    const sessionId = String(p.sessionId || '').trim();
    if (!sessionId) return { ok: true };

    const cfg = getConfig_();
    const ss = SpreadsheetApp.openById(cfg.sheetId);
    const sessionsSheet = ensureNamedSheetWithHeaders_(ss, AUTH_SHEETS.USER_SESSIONS, USER_SESSION_HEADERS);
    if (!sessionsSheet) return { ok: true };

    deleteSessionById_(sessionsSheet, sessionId);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

function validateSession(payload) {
  try {
    const p = (payload && typeof payload === 'object') ? payload : {};
    const sessionId = String(p.sessionId || '').trim();
    if (!sessionId) return { ok: false, error: 'Missing session.' };

    const cfg = getConfig_();
    const ss = SpreadsheetApp.openById(cfg.sheetId);
    const sessionsSheet = ensureNamedSheetWithHeaders_(ss, AUTH_SHEETS.USER_SESSIONS, USER_SESSION_HEADERS);
    if (!sessionsSheet) return { ok: false, error: 'Auth configuration is incomplete.' };

    const session = validateSession_(sessionsSheet, sessionId);
    if (!session.ok) return session;
    return { ok: true, email: session.email };
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

// Backward-compatible alias for existing frontend callers.
function authSessionCheck(payload) {
  return validateSession(payload);
}

function listProjectsForEmail_(exportSheet, email) {
  const normalizedEmail = normalizeEmail_(email);
  if (!exportSheet) throw new Error('Auth configuration is incomplete.');
  if (!normalizedEmail) return [];

  const cache = CacheService.getScriptCache();
  const cacheKey = buildProjectsCacheKey_(normalizedEmail);
  const cached = cache.get(cacheKey);
  if (cached) {
    const parsedCached = safeJsonParse_(cached, null);
    if (parsedCached && Array.isArray(parsedCached.projects)) {
      return parsedCached.projects;
    }
  }

  const lastCol = exportSheet.getLastColumn();
  const header = exportSheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const colMap = buildColumnMap_(header);
  const personEmailCol = colMap[EXPORT_LOG_PERSON_EMAIL_HEADER];
  const tokenCol = colMap.token;
  if (!personEmailCol || !tokenCol) {
    throw new Error('EXPORT_LOG missing required columns.');
  }

  const lastRow = exportSheet.getLastRow();
  if (lastRow < 2) return [];

  const rowCount = lastRow - 1;
  const rows = exportSheet.getRange(2, 1, rowCount, lastCol).getValues();

  const personEmailIdx = personEmailCol - 1;
  const tokenIdx = tokenCol - 1;
  const dealNumberIdx = colMap.dealnumber ? (colMap.dealnumber - 1) : -1;
  const dealTitleIdx = colMap.dealtitle ? (colMap.dealtitle - 1) : -1;
  const orgNameIdx = colMap.orgname ? (colMap.orgname - 1) : -1;
  const personNameIdx = colMap.personname ? (colMap.personname - 1) : -1;
  const exportedAtIdx = colMap.exportedat ? (colMap.exportedat - 1) : -1;
  const createdAtIdx = colMap.createdat ? (colMap.createdat - 1) : -1;
  const statusIdx = colMap.status ? (colMap.status - 1) : -1;

  const projects = [];

  for (let i = 0; i < rowCount; i++) {
    const rowVals = rows[i] || [];
    const personEmail = normalizeEmail_(rowVals[personEmailIdx]);
    if (!personEmail || personEmail !== normalizedEmail) continue;

    const token = String(rowVals[tokenIdx] || '').trim();
    if (!token) continue;

    const dealNumber = dealNumberIdx >= 0 ? rowVals[dealNumberIdx] : '';
    const dealTitle = dealTitleIdx >= 0 ? rowVals[dealTitleIdx] : '';
    const orgName = orgNameIdx >= 0 ? rowVals[orgNameIdx] : '';
    const personName = personNameIdx >= 0 ? rowVals[personNameIdx] : '';
    const exportedAtRaw = exportedAtIdx >= 0 ? rowVals[exportedAtIdx] : '';
    const createdAtRaw = createdAtIdx >= 0 ? rowVals[createdAtIdx] : '';
    const status = statusIdx >= 0 ? rowVals[statusIdx] : '';
    const exportedAt = exportedAtRaw || createdAtRaw || '';

    projects.push({
      token: token,
      dealNumber: String(dealNumber || '').trim(),
      dealTitle: String(dealTitle || '').trim(),
      orgName: String(orgName || '').trim(),
      personName: String(personName || '').trim(),
      exportedAt: String(exportedAt || '').trim(),
      createdAt: String(exportedAt || '').trim(),
      status: String(status || '').trim()
    });
  }

  projects.sort((a, b) => {
    const da = Date.parse(a.exportedAt || a.createdAt || '');
    const db = Date.parse(b.exportedAt || b.createdAt || '');
    if (!isNaN(da) && !isNaN(db)) return db - da;
    return 0;
  });

  cache.put(cacheKey, JSON.stringify({ projects: projects }), AUTH_POLICY.PROJECT_CACHE_TTL_SEC);
  return projects;
}

/* ---------------- Dashboard + Snapshot-Load Services ---------------- */

function buildDashboardHomeData_(options) {
  const opts = (options && typeof options === 'object') ? options : {};
  const cfg = opts.cfg || getConfig_();
  const ss = opts.ss || SpreadsheetApp.openById(cfg.sheetId);
  const infra = opts.infra || ensurePortalInfrastructure_(ss, cfg);
  const exportSheet = infra.exportSheet;
  if (!exportSheet) {
    return { ok: false, error: 'Auth configuration is incomplete.' };
  }

  let identity = buildAccountIdentityFromInputs_(opts.identity);
  let email = normalizeEmail_(opts.email || identity.personEmail);
  let userCtx = opts.userCtx || null;
  const sessionId = trimString_(opts.sessionId);

  if (sessionId) {
    userCtx = getUserContextBySessionId_(ss, sessionId);
    if (!userCtx.ok) return userCtx;
  }

  if (userCtx && userCtx.ok !== false) {
    identity = mergeAccountIdentity_(identity, {
      personEmail: userCtx.email,
      personName: trimString_(userCtx.user && userCtx.user.rowObjNormalized.displayname),
      orgId: trimString_(userCtx.user && userCtx.user.rowObjNormalized.defaultorgid),
      orgName: trimString_(userCtx.user && userCtx.user.rowObjNormalized.defaultorgname)
    });
    email = normalizeEmail_(userCtx.email || email);
  }

  if (!email) {
    return { ok: false, error: 'Missing session.' };
  }

  identity = mergeAccountIdentity_(identity, { personEmail: email });

  const projects = listProjectsForEmail_(exportSheet, email);
  const accountInfo = getPortalAccountByOrgOrEmail_(Object.assign({}, identity, {
    cfg: cfg,
    ss: ss,
    infra: infra,
    createIfMissing: false
  }));
  const accountSummary = accountInfo ? accountInfo.summary : buildEphemeralAccountSummary_(identity, cfg);

  return {
    ok: true,
    email: email,
    projects: projects,
    accountSummary: accountSummary,
    termsDocumentUrl: accountSummary.termsDocumentUrl || cfg.termsDocumentUrl,
    placeholders: {
      termsDriveFolderId: cfg.termsDriveFolderId,
      taxExemptDriveFolderId: cfg.taxExemptDriveFolderId
    }
  };
}

function getDashboardHomeData(payload) {
  try {
    return buildDashboardHomeData_(payload);
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

/**
 * PHASE 2 (Dashboard metadata only):
 * - Validate session, resolve email.
 * - Return lightweight project metadata by personEmail.
 * - Do NOT parse snapshotJson or build portal VM.
 */
function getUserProjects(payload) {
  try {
    const dashboardHomeData = buildDashboardHomeData_(payload);
    if (!dashboardHomeData || dashboardHomeData.ok !== true) {
      return dashboardHomeData || { ok: false, error: 'Unable to load projects.' };
    }
    return {
      ok: true,
      email: dashboardHomeData.email,
      projects: dashboardHomeData.projects
    };
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

// Backward-compatible alias for existing frontend callers.
function authListProjects(payload) {
  return getUserProjects(payload);
}

/**
 * PHASE 3 (Snapshot load by token only):
 * - Resolve a single token row.
 * - Parse snapshot only here.
 * - Optionally enforce session/email ownership when sessionId is provided.
 */
function getSnapshotByToken(payload) {
  try {
    const p = (payload && typeof payload === 'object') ? payload : { token: payload };
    const sessionId = String(p.sessionId || '').trim();
    const token = String(p.token || '').trim();
    if (!token) return { ok: false, error: 'Missing token.' };

    const cfg = getConfig_();
    const ss = SpreadsheetApp.openById(cfg.sheetId);
    const infra = ensurePortalInfrastructure_(ss, cfg);
    const exportSheet = infra.exportSheet;
    const sessionsSheet = sessionId ? infra.sessionsSheet : null;
    if (!exportSheet) {
      return { ok: false, error: 'Auth configuration is incomplete.' };
    }

    let sessionEmail = '';
    if (sessionId) {
      if (!sessionsSheet) return { ok: false, error: 'Auth configuration is incomplete.' };
      const session = validateSession_(sessionsSheet, sessionId);
      if (!session.ok) return session;
      sessionEmail = session.email;
    }

    const rowInfo = findRowByToken_(exportSheet, token);
    if (!rowInfo) return { ok: false, error: 'Link not found.' };

    if (sessionEmail) {
      const rowEmail = normalizeEmail_(rowInfo.rowObjNormalized[EXPORT_LOG_PERSON_EMAIL_HEADER]);
      if (!rowEmail || rowEmail !== sessionEmail) {
        return { ok: false, error: 'Unauthorized project access.' };
      }
    }

    const built = buildPortalVmForRow_(rowInfo, token, 'client');
    if (!built.ok) {
      return { ok: false, error: built.error || 'Unable to load project.' };
    }

    return { ok: true, portalPayload: makeClientSafe_(built.vm) };
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

// Backward-compatible alias for existing frontend callers.
function authLoadProject(payload) {
  return getSnapshotByToken(payload);
}

function buildEphemeralAccountSummary_(identity, cfg) {
  const merged = buildAccountIdentityFromInputs_(identity);
  const creditTermsWorkflow = buildAccountDocumentWorkflowSummary_({}, ACCOUNT_DOCUMENT_TYPES.credit_terms, cfg);
  const taxExemptWorkflow = buildAccountDocumentWorkflowSummary_({}, ACCOUNT_DOCUMENT_TYPES.tax_exempt, cfg);
  return {
    accountId: '',
    orgId: merged.orgId,
    orgName: merged.orgName,
    primaryEmail: merged.personEmail,
    primaryContactName: merged.personName,
    termsStatus: 'not_started',
    termsApproved: false,
    termsApprovedAt: '',
    signedTermsFileUrl: '',
    signedTermsSubmittedAt: '',
    approvedPaymentTermsCode: '',
    approvedPaymentTermsLabel: '',
    approvedPaymentTermsDays: 0,
    approvedPaymentTermsNotes: '',
    approvedPaymentTermsSetAt: '',
    approvedPaymentTermsSetByName: '',
    approvedPaymentTermsSetByEmail: '',
    taxExemptStatus: 'not_started',
    taxExemptApproved: false,
    taxExemptExpiresAt: '',
    taxExemptActive: false,
    taxExemptCertificateUrl: '',
    taxExemptCertificateNumber: '',
    taxExemptSubmittedAt: '',
    poAvailable: false,
    termsDocumentUrl: creditTermsWorkflow ? creditTermsWorkflow.sourceDocumentUrl : String((cfg && cfg.termsDocumentUrl) || '').trim(),
    termsDocumentDownloadUrl: creditTermsWorkflow ? creditTermsWorkflow.sourceDocumentDownloadUrl : '',
    taxExemptDocumentUrl: taxExemptWorkflow ? taxExemptWorkflow.sourceDocumentUrl : '',
    taxExemptDocumentDownloadUrl: taxExemptWorkflow ? taxExemptWorkflow.sourceDocumentDownloadUrl : '',
    billingContactEmail: merged.billingContactEmail || merged.personEmail,
    billingContactName: merged.billingContactName || merged.personName,
    createdAt: '',
    updatedAt: '',
    documentWorkflows: {
      creditTerms: creditTermsWorkflow,
      taxExempt: taxExemptWorkflow
    }
  };
}

function getAccountStatus(payload) {
  try {
    const p = (payload && typeof payload === 'object') ? payload : {};
    const cfg = getConfig_();
    const ss = SpreadsheetApp.openById(cfg.sheetId);
    const infra = ensurePortalInfrastructure_(ss, cfg);

    let identity = buildAccountIdentityFromInputs_(p);
    let rowInfo = null;

    if (trimString_(p.sessionId)) {
      const userCtx = getUserContextBySessionId_(ss, p.sessionId);
      if (!userCtx.ok) return userCtx;
      identity = mergeAccountIdentity_(identity, {
        personEmail: userCtx.email,
        personName: trimString_(userCtx.user && userCtx.user.rowObjNormalized.displayname),
        orgId: trimString_(userCtx.user && userCtx.user.rowObjNormalized.defaultorgid),
        orgName: trimString_(userCtx.user && userCtx.user.rowObjNormalized.defaultorgname)
      });
    }

    if (trimString_(p.token)) {
      rowInfo = findRowByToken_(infra.exportSheet, trimString_(p.token));
      if (!rowInfo) return { ok: false, error: 'Token not found.' };
      identity = mergeAccountIdentity_(identity, deriveOrgContextFromRow_(rowInfo.rowObjNormalized));
    }

    const accountInfo = getPortalAccountByOrgOrEmail_(Object.assign({}, identity, {
      cfg: cfg,
      ss: ss,
      infra: infra,
      createIfMissing: false
    }));
    const accountSummary = accountInfo ? accountInfo.summary : buildEphemeralAccountSummary_(identity, cfg);
    const latestOrderInfo = trimString_(p.token)
      ? getLatestPortalOrderByToken_(trimString_(p.token), { cfg: cfg, ss: ss, ordersSheet: infra.ordersSheet })
      : null;
    const latestOrderSummary = latestOrderInfo ? buildPortalOrderSummary_(latestOrderInfo.rowObjNormalized) : null;

    return {
      ok: true,
      accountSummary: accountSummary,
      latestOrderSummary: latestOrderSummary,
      termsDocumentUrl: accountSummary.termsDocumentUrl || cfg.termsDocumentUrl,
      placeholders: {
        termsDriveFolderId: cfg.termsDriveFolderId,
        taxExemptDriveFolderId: cfg.taxExemptDriveFolderId
      }
    };
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

/* ---------------- Order Action Gateway + Validation Services ---------------- */

function buildOrderActionContext_(payload) {
  const p = (payload && typeof payload === 'object') ? payload : {};
  const token = trimString_(p.token);
  if (!token) throw new Error('Missing token.');

  const cfg = getConfig_();
  const ss = SpreadsheetApp.openById(cfg.sheetId);
  const infra = ensurePortalInfrastructure_(ss, cfg);
  const rowInfo = findRowByToken_(infra.exportSheet, token);
  if (!rowInfo) throw new Error('Token not found.');

  const row = rowInfo.rowObjNormalized;
  const snapshot = safeJsonParse_(row.snapshotjson, {});
  const mergedIdentity = mergeAccountIdentity_(deriveOrgContextFromRow_(row), {
    personEmail: p.personEmail,
    personName: p.personName,
    orgId: p.orgId,
    orgName: p.orgName
  });
  const accountInfo = createPortalAccountIfMissing_(Object.assign({}, mergedIdentity, {
    cfg: cfg,
    ss: ss,
    infra: infra,
    createIfMissing: p.createAccountIfMissing !== false
  })) || {
    summary: buildEphemeralAccountSummary_(mergedIdentity, cfg),
    rowInfo: null
  };
  const portalStateInput = Object.prototype.hasOwnProperty.call(p, 'portalState')
    ? parsePortalStateInput_(p.portalState)
    : (safeJsonParse_(row.portalstatejson, {}) || { printJobs: {} });
  const portalState = normalizePortalStateForOrderAction_(portalStateInput, snapshot);
  const orderDraft = buildOrderDraftFromSnapshotAndPortalState_({
    token: token,
    rowInfo: rowInfo,
    row: row,
    snapshot: snapshot,
    portalState: portalState,
    accountSummary: accountInfo.summary,
    currency: cfg.stripePriceCurrency
  });

  return {
    payload: p,
    cfg: cfg,
    ss: ss,
    infra: infra,
    rowInfo: rowInfo,
    row: row,
    snapshot: snapshot,
    portalState: portalState,
    accountInfo: accountInfo,
    orderDraft: orderDraft
  };
}

function hasEmbeddedChatLogInPortalState_(stateObj) {
  if (!stateObj || typeof stateObj !== 'object') return false;
  return Array.isArray(stateObj.messageLog) || Array.isArray(stateObj.chatLog) || Array.isArray(stateObj.messages);
}

function readChatLogFromPortalState_(stateObj, fallback) {
  if (!hasEmbeddedChatLogInPortalState_(stateObj)) return normalizeChatLog_(fallback);
  const key = detectMessageLogKey_(stateObj);
  return normalizeChatLog_(stateObj[key]);
}

function normalizePortalStateForOrderAction_(rawState, snapshot) {
  const source = (rawState && typeof rawState === 'object' && !Array.isArray(rawState))
    ? JSON.parse(JSON.stringify(rawState))
    : { printJobs: {} };
  if (!source.printJobs || typeof source.printJobs !== 'object' || Array.isArray(source.printJobs)) {
    source.printJobs = {};
  }
  const printJobs = normalizePrintJobsForOrder_(snapshot && snapshot.printJobs);
  const normalized = normalizePortalStateForOrder_(source, printJobs);
  const out = Object.assign({}, source, {
    version: trimString_(source.version) || '1',
    isReadOnly: source.isReadOnly === true,
    fulfillmentMethod: normalizeFulfillmentMethod_(source.fulfillmentMethod),
    shippingChargeCents: Math.max(0, parseInt(String(source.shippingChargeCents || 0), 10) || 0),
    shippingModeLabel: trimString_(source.shippingModeLabel),
    printJobs: normalized.printJobs
  });
  const chatLog = readChatLogFromPortalState_(source, []);
  if (hasEmbeddedChatLogInPortalState_(source)) {
    writeChatLogIntoPortalState_(out, chatLog);
  }
  return out;
}

function persistLatestPortalStateForOrderAction_(ctx) {
  const context = (ctx && typeof ctx === 'object') ? ctx : null;
  if (!context) return context;
  if (!Object.prototype.hasOwnProperty.call(context.payload || {}, 'portalState')) return context;
  const exportSheet = context.infra && context.infra.exportSheet;
  const rowInfo = context.rowInfo || null;
  if (!exportSheet || !rowInfo) return context;
  const currentPortalState = safeJsonParse_(rowInfo.rowObjNormalized.portalstatejson, null);
  const rowLocked = isLockedPortalRow_(rowInfo.rowObjNormalized, currentPortalState);
  const chatLog = readChatLogFromPortalState_(context.portalState, readChatLogForRow_(exportSheet, rowInfo));
  const persisted = persistPortalStateForRow_(exportSheet, rowInfo, context.portalState, {
    token: trimString_(context.orderDraft && context.orderDraft.token) || trimString_(rowInfo.rowObjNormalized.token),
    locked: rowLocked,
    status: rowLocked ? getFinalStatusForRow_(rowInfo.rowObjNormalized) : 'Editable',
    chatLog: chatLog,
    clearSubmittedAt: !rowLocked
  });
  if (!persisted || persisted.ok !== true) {
    throw new Error(String((persisted && persisted.error) || 'Unable to persist portal state.'));
  }
  context.rowInfo = buildRowInfoFromSheet_(exportSheet, rowInfo.row);
  context.row = context.rowInfo.rowObjNormalized;
  return context;
}

function buildOrderActionError_(code, message, extra) {
  const base = {
    ok: false,
    code: trimString_(code),
    error: trimString_(message) || 'Unable to continue order placement.'
  };
  return Object.assign(base, (extra && typeof extra === 'object') ? extra : {});
}

function getMinimumBlockingJobsForOrderAction_(ctx) {
  const ruleState = (ctx && typeof ctx === 'object' && Array.isArray(ctx.includedJobSelectionStates))
    ? ctx
    : buildOrderActionRuleState_(ctx);
  return ruleState.includedJobSelectionStates
    .filter(function(item) {
      return item.minimumUnits > 0 && item.enteredUnits < item.minimumUnits;
    })
    .map(function(item) {
      const job = item.job || {};
      const number = item.printJobNumber || getPrintJobDisplayNumberForOrder_(ruleState.printJobs, job.printJobId) || 1;
      const name = trimString_(job.printJobName) || ('Project ' + number);
      return {
        printJobId: trimString_(job.printJobId),
        title: name,
        subline: 'Total units entered: ' + String(item.enteredUnits),
        extraLine: 'Minimum units to order: ' + String(item.minimumUnits)
      };
    });
}

function getBlockingArtworkJobsForOrderAction_(ctx) {
  const ruleState = (ctx && typeof ctx === 'object' && Array.isArray(ctx.includedJobSelectionStates))
    ? ctx
    : buildOrderActionRuleState_(ctx);
  return ruleState.includedJobSelectionStates
    .filter(function(item) {
      const number = item.printJobNumber || getPrintJobDisplayNumberForOrder_(ruleState.printJobs, item.printJobId) || 1;
      const artStatusHeader = normalizeHeaderKey_(getPrintJobArtStatusHeader_(number));
      return !boolFromCell_(ruleState.row[artStatusHeader]);
    })
    .map(function(item) {
      const job = item.job || {};
      const number = item.printJobNumber || getPrintJobDisplayNumberForOrder_(ruleState.printJobs, job.printJobId) || 1;
      const name = trimString_(job.printJobName) || ('Project ' + number);
      return {
        printJobId: trimString_(job.printJobId),
        title: 'Print Job ' + number + ': ' + name,
        subline: 'Click here to approve artwork'
      };
    });
}

function validateOrderPlacementForAction_(ctx, options) {
  const opts = (options && typeof options === 'object') ? options : {};
  const ruleState = buildOrderActionRuleState_(ctx);
  const minimumBlockingJobs = getMinimumBlockingJobsForOrderAction_(ruleState);
  if (minimumBlockingJobs.length) {
    return buildOrderActionError_(
      'minimum_quantity_required',
      'We are unable to proceed with your order because your quantities entered do not meet our minimums to order.',
      { blockingJobs: minimumBlockingJobs }
    );
  }
  const blockingJobs = getBlockingArtworkJobsForOrderAction_(ruleState);
  if (blockingJobs.length) {
    return buildOrderActionError_(
      'artwork_approval_required',
      'Artwork approval is required before you can place this order.',
      { blockingJobs: blockingJobs }
    );
  }
  const fulfillmentMethod = normalizeFulfillmentMethod_(ctx && ctx.orderDraft && ctx.orderDraft.fulfillmentMethod);
  if (!fulfillmentMethod) {
    return buildOrderActionError_(
      'fulfillment_method_required',
      'Please choose shipping or pickup before continuing to payment.'
    );
  }
  if (opts.requirePositiveCheckoutTotal === true) {
    const grandTotal = roundMoney_(toFiniteNumber_(ctx && ctx.orderDraft && ctx.orderDraft.amountGrandTotal, 0));
    if (grandTotal <= 0) {
      return buildOrderActionError_(
        'non_positive_checkout_total',
        'Hosted card and ACH checkout are only available when the order total is greater than $0. Please contact Red Threads to place this order.',
        {
          amountGrandTotal: grandTotal,
          currency: trimString_(ctx && ctx.orderDraft && ctx.orderDraft.currency) || DEFAULT_STRIPE_PRICE_CURRENCY
        }
      );
    }
  }
  return null;
}

function refreshPortalPayloadForToken_(token, options) {
  const opts = (options && typeof options === 'object') ? options : {};
  const cfg = opts.cfg || getConfig_();
  const ss = opts.ss || SpreadsheetApp.openById(cfg.sheetId);
  const infra = opts.infra || ensurePortalInfrastructure_(ss, cfg);
  const exportSheet = infra.exportSheet;
  SpreadsheetApp.flush();
  const sourceRowInfo = opts.rowInfo || findRowByToken_(exportSheet, trimString_(token));
  if (!sourceRowInfo) return null;
  const rowInfo = buildRowInfoFromSheet_(exportSheet, sourceRowInfo.row);
  if (!rowInfo) return null;
  return buildSafeSnapshotLoadResponse_(
    rowInfo,
    trimString_(token || rowInfo.rowObjNormalized.token),
    trimString_(opts.mode) || 'client'
  );
}

function overridePortalPayloadState_(portalPayload, portalState) {
  const payload = (portalPayload && typeof portalPayload === 'object')
    ? JSON.parse(JSON.stringify(portalPayload))
    : {};
  if (portalState && typeof portalState === 'object') {
    payload.portalState = JSON.parse(JSON.stringify(portalState));
  }
  return payload;
}

/* ---------------- Checkout + Manual / PO Transition Sequencing ---------------- */

// Current sequencing is intentionally preserved here so the next hardening slice
// can change persistence timing and failure handling with smaller, clearer seams.
function buildPreparedOrderActionContext_(payload) {
  const ctx = buildOrderActionContext_(payload);
  persistLatestPortalStateForOrderAction_(ctx);
  return ctx;
}

function buildOrderActionPortalPayload_(ctx, exportRowInfo) {
  try {
    return overridePortalPayloadState_(
      refreshPortalPayloadForToken_(ctx.orderDraft.token, {
        cfg: ctx.cfg,
        ss: ctx.ss,
        infra: ctx.infra,
        rowInfo: exportRowInfo
      }),
      ctx.portalState
    );
  } catch (err) {
    console.log('[RT-CHECKOUT-PORTAL-PAYLOAD] ' + JSON.stringify({
      ok: false,
      token: trimString_(ctx && ctx.orderDraft && ctx.orderDraft.token),
      error: String((err && err.message) || err)
    }));
    return null;
  }
}

function buildCheckoutAttemptIdentity_() {
  return {
    orderId: newPortalId_('ord'),
    checkoutAttemptId: newPortalId_('chk')
  };
}

function hasUsableCheckoutSession_(stripe) {
  const session = (stripe && typeof stripe === 'object') ? stripe : {};
  return session.ok === true
    && !!trimString_(session.sessionId)
    && !!trimString_(session.checkoutUrl || session.url);
}

function buildCheckoutAttemptStripeOptions_(ctx, paymentMethodSelected, checkoutIdentity) {
  return {
    cfg: ctx.cfg,
    paymentMethodSelected: paymentMethodSelected,
    checkoutAttemptId: trimString_(checkoutIdentity && checkoutIdentity.checkoutAttemptId),
    orderId: trimString_(checkoutIdentity && checkoutIdentity.orderId),
    returnUrl: trimString_(ctx.payload.returnUrl || ctx.cfg.stripeReturnUrl || buildPortalDirectUrl_(ctx.orderDraft.token))
  };
}

function buildCheckoutAttemptOrderCreateOptions_(ctx, paymentMethodSelected, checkoutIdentity, stripe) {
  const identity = (checkoutIdentity && typeof checkoutIdentity === 'object') ? checkoutIdentity : {};
  const stripeResult = (stripe && typeof stripe === 'object') ? stripe : {};
  const orderDraft = Object.assign({}, ctx.orderDraft, {
    paymentMethodSelected: paymentMethodSelected,
    paymentState: PAYMENT_STATES.checkout_created,
    orderState: ORDER_STATES.payment_in_progress,
    productionAuthorizationState: PRODUCTION_AUTHORIZATION_STATES.not_authorized,
    portalLockState: PORTAL_LOCK_STATES.editable
  });
  return Object.assign({}, ctx, {
    orderDraft: orderDraft,
    orderId: trimString_(identity.orderId),
    checkoutAttemptId: trimString_(identity.checkoutAttemptId),
    paymentMethodSelected: paymentMethodSelected,
    paymentState: PAYMENT_STATES.checkout_created,
    orderState: ORDER_STATES.payment_in_progress,
    productionAuthorizationState: PRODUCTION_AUTHORIZATION_STATES.not_authorized,
    portalLockState: PORTAL_LOCK_STATES.editable,
    stripeSessionId: trimString_(stripeResult.sessionId)
  });
}

function updateCheckoutAttemptOrderWithStripeSession_(ctx, created, stripe) {
  const createdInfo = created && created.rowInfo;
  if (!createdInfo) return null;
  const desiredSessionId = trimString_(stripe && stripe.sessionId);
  if (!desiredSessionId) return createdInfo;
  const currentSessionId = trimString_(createdInfo.rowObjNormalized && createdInfo.rowObjNormalized.stripesessionid);
  if (currentSessionId === desiredSessionId) return createdInfo;
  return updatePortalOrderState_({
    cfg: ctx.cfg,
    ss: ctx.ss,
    infra: ctx.infra,
    orderRowInfo: createdInfo,
    stripeSessionId: desiredSessionId
  });
}

function writeCheckoutAttemptPointers_(ctx, orderSummary, paymentMethodSelected, checkoutAttemptId) {
  return writeCurrentOrderPointersToExportLog_({
    cfg: ctx.cfg,
    ss: ctx.ss,
    infra: ctx.infra,
    rowInfo: ctx.rowInfo,
    orderSummary: Object.assign({}, orderSummary, {
      checkoutAttemptId: checkoutAttemptId,
      paymentMethodSelected: paymentMethodSelected,
      paymentState: PAYMENT_STATES.checkout_created,
      orderState: ORDER_STATES.payment_in_progress,
      productionAuthorizationState: PRODUCTION_AUTHORIZATION_STATES.not_authorized,
      portalLockState: PORTAL_LOCK_STATES.editable
    }),
    accountSummary: ctx.accountInfo.summary,
    status: 'Editable'
  });
}

function buildCheckoutAttemptResponse_(ctx, orderSummary, checkoutAttemptId, stripe, portalPayload) {
  return {
    ok: true,
    checkoutReady: stripe.ok === true && !!trimString_(stripe.checkoutUrl || stripe.url),
    accountSummary: ctx.accountInfo.summary,
    orderSummary: Object.assign({}, orderSummary, {
      checkoutAttemptId: checkoutAttemptId
    }),
    stripe: stripe,
    portalPayload: portalPayload,
    warnings: stripe.ok ? [] : [String(stripe.error || 'Stripe checkout is not configured.')]
  };
}

function buildCheckoutAttemptFailureResponse_(stripe, options) {
  const stripeResult = (stripe && typeof stripe === 'object') ? stripe : {};
  const opts = (options && typeof options === 'object') ? options : {};
  const failureCode = trimString_(opts.code || stripeResult.code) || 'checkout_unavailable';
  const isGrandTotalFailure = failureCode === 'non_positive_checkout_total';
  const errorMessage = trimString_(
    opts.error || (isGrandTotalFailure
      ? stripeResult.error
      : 'Secure payment could not start. Please try again or contact Red Threads.')
  ) || 'Secure payment could not start. Please try again or contact Red Threads.';
  const response = {
    ok: false,
    code: failureCode,
    error: errorMessage
  };
  [
    'configured',
    'statusCode',
    'amountGrandTotal',
    'currency'
  ].forEach(function(key) {
    if (!Object.prototype.hasOwnProperty.call(stripeResult, key)) return;
    response[key] = stripeResult[key];
  });
  if (Object.prototype.hasOwnProperty.call(opts, 'warnings')) {
    response.warnings = opts.warnings;
  } else if (trimString_(stripeResult.error) && stripeResult.error !== errorMessage) {
    response.warnings = [String(stripeResult.error)];
  }
  response.stripe = stripeResult;
  return response;
}

function buildOrderInvoiceArtifacts_(ctx) {
  const invoiceInfo = generateInvoiceDocumentForOrder_(ctx.orderDraft, { cfg: ctx.cfg });
  const emailResult = sendInvoiceEmailForOrder_(ctx.orderDraft, invoiceInfo, {
    to: ctx.orderDraft.personEmail
  });
  return {
    invoiceInfo: invoiceInfo,
    emailResult: emailResult,
    nowIso: nowIso_()
  };
}

function buildManualPaymentOrderCreateOptions_(ctx, method, invoiceArtifacts) {
  const invoiceInfo = invoiceArtifacts.invoiceInfo;
  const emailResult = invoiceArtifacts.emailResult;
  const now = invoiceArtifacts.nowIso;
  const orderDraft = Object.assign({}, ctx.orderDraft, {
    paymentMethodSelected: method,
    paymentState: PAYMENT_STATES.manual_pending,
    orderState: ORDER_STATES.awaiting_manual_payment,
    productionAuthorizationState: PRODUCTION_AUTHORIZATION_STATES.not_authorized,
    portalLockState: PORTAL_LOCK_STATES.locked
  });
  return Object.assign({}, ctx, {
    orderDraft: orderDraft,
    portalLockState: PORTAL_LOCK_STATES.locked,
    paymentMethodSelected: method,
    paymentState: PAYMENT_STATES.manual_pending,
    orderState: ORDER_STATES.awaiting_manual_payment,
    productionAuthorizationState: PRODUCTION_AUTHORIZATION_STATES.not_authorized,
    lockedAt: now,
    invoiceNumber: invoiceInfo.invoiceNumber,
    invoicePdfUrl: invoiceInfo.invoicePdfUrl,
    invoiceSentToEmail: emailResult.ok ? emailResult.email : normalizeEmail_(ctx.orderDraft.personEmail),
    invoiceSentAt: emailResult.ok ? now : ''
  });
}

function buildPurchaseOrderCreateOptions_(ctx, invoiceArtifacts) {
  const invoiceInfo = invoiceArtifacts.invoiceInfo;
  const emailResult = invoiceArtifacts.emailResult;
  const now = invoiceArtifacts.nowIso;
  const orderDraft = Object.assign({}, ctx.orderDraft, {
    paymentMethodSelected: PAYMENT_METHODS.purchase_order,
    paymentState: PAYMENT_STATES.not_started,
    orderState: ORDER_STATES.awaiting_po_submission,
    productionAuthorizationState: PRODUCTION_AUTHORIZATION_STATES.po_pending,
    portalLockState: PORTAL_LOCK_STATES.locked
  });
  return Object.assign({}, ctx, {
    orderDraft: orderDraft,
    paymentMethodSelected: PAYMENT_METHODS.purchase_order,
    paymentState: PAYMENT_STATES.not_started,
    orderState: ORDER_STATES.awaiting_po_submission,
    productionAuthorizationState: PRODUCTION_AUTHORIZATION_STATES.po_pending,
    portalLockState: PORTAL_LOCK_STATES.locked,
    lockedAt: now,
    invoiceNumber: invoiceInfo.invoiceNumber,
    invoicePdfUrl: invoiceInfo.invoicePdfUrl,
    invoiceSentToEmail: emailResult.ok ? emailResult.email : normalizeEmail_(ctx.orderDraft.personEmail),
    invoiceSentAt: emailResult.ok ? now : ''
  });
}

function finalizeLockedOrderTransition_(ctx, created) {
  const exportRowInfo = writeCurrentOrderPointersToExportLog_({
    cfg: ctx.cfg,
    ss: ctx.ss,
    infra: ctx.infra,
    rowInfo: ctx.rowInfo,
    orderSummary: created.summary,
    accountSummary: ctx.accountInfo.summary,
    status: 'locked'
  });
  setPortalClientLockForRow_(ctx.infra.exportSheet, exportRowInfo, true, { token: ctx.orderDraft.token });
  return {
    exportRowInfo: exportRowInfo,
    portalPayload: buildOrderActionPortalPayload_(ctx, exportRowInfo)
  };
}

function buildLockedOrderTransitionResponse_(ctx, created, invoiceInfo, portalPayload) {
  return {
    ok: true,
    accountSummary: ctx.accountInfo.summary,
    orderSummary: created.summary,
    invoice: invoiceInfo,
    portalPayload: portalPayload
  };
}

function buildCheckoutAttemptRollbackOrderDraft_(ctx) {
  return Object.assign({}, ctx.orderDraft, {
    paymentMethodSelected: '',
    paymentState: PAYMENT_STATES.not_started,
    orderState: ORDER_STATES.draft,
    productionAuthorizationState: PRODUCTION_AUTHORIZATION_STATES.not_authorized,
    portalLockState: PORTAL_LOCK_STATES.editable
  });
}

function rollbackCheckoutAttemptOrder_(ctx, created, reason) {
  if (!created || !created.rowInfo) return null;
  try {
    return updatePortalOrderState_({
      cfg: ctx.cfg,
      ss: ctx.ss,
      infra: ctx.infra,
      orderRowInfo: created.rowInfo,
      checkoutAttemptId: '',
      stripeSessionId: '',
      stripePaymentIntentId: '',
      paymentMethodSelected: '',
      paymentState: PAYMENT_STATES.not_started,
      orderState: ORDER_STATES.draft,
      productionAuthorizationState: PRODUCTION_AUTHORIZATION_STATES.not_authorized,
      portalLockState: PORTAL_LOCK_STATES.editable,
      lockedAt: '',
      orderDraft: buildCheckoutAttemptRollbackOrderDraft_(ctx)
    });
  } catch (err) {
    console.log('[RT-CHECKOUT-ROLLBACK] ' + JSON.stringify({
      ok: false,
      token: trimString_(ctx && ctx.orderDraft && ctx.orderDraft.token),
      orderId: trimString_(created && created.summary && created.summary.orderId),
      checkoutAttemptId: trimString_(created && created.summary && created.summary.checkoutAttemptId),
      error: String((err && err.message) || err)
    }));
    return null;
  }
}

function resolveCreatedCheckoutOrderForRollback_(ctx, created, checkoutIdentity) {
  if (created && created.rowInfo) return created;
  const orderId = trimString_(checkoutIdentity && checkoutIdentity.orderId);
  if (!orderId) return null;
  const rowInfo = getPortalOrderByOrderId_(orderId, {
    cfg: ctx.cfg,
    ss: ctx.ss,
    ordersSheet: ctx.infra && ctx.infra.ordersSheet
  });
  if (!rowInfo) return null;
  return {
    rowInfo: rowInfo,
    summary: buildPortalOrderSummary_(rowInfo.rowObjNormalized)
  };
}

function snapshotExportOrderPointers_(rowInfo) {
  const row = (rowInfo && rowInfo.rowObjNormalized) ? rowInfo.rowObjNormalized : {};
  return {
    activeOrderId: trimString_(row.activeorderid),
    latestCheckoutAttemptId: trimString_(row.latestcheckoutattemptid),
    currentAccountId: trimString_(row.currentaccountid),
    portalLockState: trimString_(row.portallockstate),
    currentOrderState: trimString_(row.currentorderstate),
    currentPaymentState: trimString_(row.currentpaymentstate),
    currentProductionAuthorizationState: trimString_(row.currentproductionauthorizationstate),
    currentPaymentMethod: trimString_(row.currentpaymentmethod),
    termsApproved: boolFromCell_(row.termsapproved),
    taxExemptApproved: boolFromCell_(row.taxexemptapproved),
    latestInvoiceNumber: trimString_(row.latestinvoicenumber),
    lastOrderUpdatedAt: trimString_(row.lastorderupdatedat),
    status: trimString_(row.status)
  };
}

function restoreExportOrderPointers_(ctx, pointerSnapshot) {
  const snapshot = (pointerSnapshot && typeof pointerSnapshot === 'object') ? pointerSnapshot : {};
  try {
    return writeCurrentOrderPointersToExportLog_(Object.assign({}, snapshot, {
      cfg: ctx.cfg,
      ss: ctx.ss,
      infra: ctx.infra,
      rowInfo: ctx.rowInfo
    }));
  } catch (err) {
    console.log('[RT-CHECKOUT-POINTER-RESTORE] ' + JSON.stringify({
      ok: false,
      token: trimString_(ctx && ctx.orderDraft && ctx.orderDraft.token),
      error: String((err && err.message) || err)
    }));
    return null;
  }
}

function createCheckoutAttempt(payload) {
  try {
    const ctx = buildPreparedOrderActionContext_(payload);
    const paymentMethodSelected = trimString_(ctx.payload.paymentMethodSelected).toLowerCase();
    if (paymentMethodSelected !== PAYMENT_METHODS.card && paymentMethodSelected !== PAYMENT_METHODS.ach) {
      return { ok: false, error: 'Unsupported payment method.' };
    }
    const validationError = validateOrderPlacementForAction_(ctx, { requirePositiveCheckoutTotal: true });
    if (validationError) return validationError;

    const checkoutIdentity = buildCheckoutAttemptIdentity_();
    const stripe = createStripeCheckoutSession_(
      ctx.orderDraft,
      buildCheckoutAttemptStripeOptions_(ctx, paymentMethodSelected, checkoutIdentity)
    );
    if (!hasUsableCheckoutSession_(stripe)) {
      return buildCheckoutAttemptFailureResponse_(stripe);
    }

    const pointerSnapshot = snapshotExportOrderPointers_(ctx.rowInfo);
    let created = null;
    let exportRowInfo = null;
    let orderSummary = null;
    try {
      created = createPortalOrder_(
        buildCheckoutAttemptOrderCreateOptions_(ctx, paymentMethodSelected, checkoutIdentity, stripe)
      );
      const finalOrderInfo = updateCheckoutAttemptOrderWithStripeSession_(ctx, created, stripe);
      orderSummary = buildPortalOrderSummary_(finalOrderInfo.rowObjNormalized);
      exportRowInfo = writeCheckoutAttemptPointers_(ctx, orderSummary, paymentMethodSelected, checkoutIdentity.checkoutAttemptId);
    } catch (persistErr) {
      restoreExportOrderPointers_(ctx, pointerSnapshot);
      rollbackCheckoutAttemptOrder_(
        ctx,
        resolveCreatedCheckoutOrderForRollback_(ctx, created, checkoutIdentity),
        'checkout_activation_failed'
      );
      return buildCheckoutAttemptFailureResponse_(
        stripe,
        {
          code: 'checkout_persistence_failed',
          error: 'Secure payment could not start. Please try again or contact Red Threads.',
          warnings: [String((persistErr && persistErr.message) || persistErr)]
        }
      );
    }

    const portalPayload = buildOrderActionPortalPayload_(ctx, exportRowInfo);

    return buildCheckoutAttemptResponse_(ctx, orderSummary, checkoutIdentity.checkoutAttemptId, stripe, portalPayload);
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

function initiateManualPaymentOrder_(payload) {
  const ctx = buildPreparedOrderActionContext_(payload);
  const method = trimString_(ctx.payload.paymentMethodSelected).toLowerCase();
  if (method !== PAYMENT_METHODS.check && method !== PAYMENT_METHODS.cash) {
    throw new Error('Unsupported manual payment method.');
  }
  const validationError = validateOrderPlacementForAction_(ctx);
  if (validationError) return validationError;
  const invoiceArtifacts = buildOrderInvoiceArtifacts_(ctx);
  const created = createPortalOrder_(
    buildManualPaymentOrderCreateOptions_(ctx, method, invoiceArtifacts)
  );
  const finalized = finalizeLockedOrderTransition_(ctx, created);
  return buildLockedOrderTransitionResponse_(
    ctx,
    created,
    invoiceArtifacts.invoiceInfo,
    finalized.portalPayload
  );
}

function initiateManualPayment(payload) {
  try {
    return initiateManualPaymentOrder_(payload);
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

function initiatePurchaseOrderFlow_(payload) {
  const ctx = buildPreparedOrderActionContext_(payload);
  const validationError = validateOrderPlacementForAction_(ctx);
  if (validationError) return validationError;
  if (!ctx.accountInfo.summary.termsApproved) {
    return {
      ok: true,
      gated: true,
      termsRequired: true,
      accountSummary: ctx.accountInfo.summary,
      termsDocumentUrl: ctx.accountInfo.summary.termsDocumentUrl || ctx.cfg.termsDocumentUrl,
      message: 'Terms approval is required before you can submit a purchase order.'
    };
  }
  const invoiceArtifacts = buildOrderInvoiceArtifacts_(ctx);
  const created = createPortalOrder_(buildPurchaseOrderCreateOptions_(ctx, invoiceArtifacts));
  const finalized = finalizeLockedOrderTransition_(ctx, created);
  return buildLockedOrderTransitionResponse_(
    ctx,
    created,
    invoiceArtifacts.invoiceInfo,
    finalized.portalPayload
  );
}

function initiatePurchaseOrder(payload) {
  try {
    return initiatePurchaseOrderFlow_(payload);
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

/* ---------------- Account Services + Shared Document Workflows ---------------- */

function buildAccountDocumentContext_(payload) {
  const p = (payload && typeof payload === 'object') ? payload : {};
  const cfg = getConfig_();
  const ss = SpreadsheetApp.openById(cfg.sheetId);
  const infra = ensurePortalInfrastructure_(ss, cfg);
  let identity = buildAccountIdentityFromInputs_(p);
  let exportRowInfo = null;

  if (trimString_(p.sessionId)) {
    const userCtx = getUserContextBySessionId_(ss, p.sessionId);
    if (!userCtx.ok) return userCtx;
    identity = mergeAccountIdentity_(identity, {
      personEmail: userCtx.email,
      personName: trimString_(userCtx.user && userCtx.user.rowObjNormalized.displayname),
      orgId: trimString_(userCtx.user && userCtx.user.rowObjNormalized.defaultorgid),
      orgName: trimString_(userCtx.user && userCtx.user.rowObjNormalized.defaultorgname)
    });
  }

  if (trimString_(p.token)) {
    exportRowInfo = findRowByToken_(infra.exportSheet, trimString_(p.token));
    if (!exportRowInfo) return { ok: false, error: 'Token not found.' };
    identity = mergeAccountIdentity_(identity, deriveOrgContextFromRow_(exportRowInfo.rowObjNormalized));
  }

  const accountInfo = createPortalAccountIfMissing_(Object.assign({}, identity, {
    cfg: cfg,
    ss: ss,
    infra: infra,
    createIfMissing: true
  }));

  return {
    ok: true,
    payload: p,
    cfg: cfg,
    ss: ss,
    infra: infra,
    identity: identity,
    exportRowInfo: exportRowInfo,
    accountInfo: accountInfo
  };
}

function refreshAccountDocumentContextAccount_(ctx) {
  const refreshed = buildRowInfoFromSheet_(ctx.infra.accountsSheet, ctx.accountInfo.rowInfo.row);
  ctx.accountInfo = {
    rowInfo: refreshed,
    summary: buildPortalAccountSummary_(refreshed.rowObjNormalized, ctx.cfg)
  };
  return ctx.accountInfo;
}

function buildAccountDocumentWorkflowResponse_(ctx, documentType, message, extra) {
  const type = normalizeAccountDocumentType_(documentType);
  const summary = ctx.accountInfo && ctx.accountInfo.summary
    ? ctx.accountInfo.summary
    : buildEphemeralAccountSummary_(ctx.identity, ctx.cfg);
  const definition = getAccountDocumentDefinition_(type, ctx.cfg);
  const workflow = getAccountDocumentWorkflowFromSummary_(summary, type, ctx.cfg);
  return Object.assign({
    ok: true,
    documentType: type,
    accountSummary: summary,
    documentWorkflow: workflow || null,
    sourceDocumentUrl: definition ? definition.sourceDocumentUrl : '',
    sourceDocumentDownloadUrl: definition ? definition.sourceDocumentDownloadUrl : '',
    message: trimString_(message)
  }, (extra && typeof extra === 'object') ? extra : {});
}

function buildAccountDocumentSourceDataPayload_(definition) {
  if (!definition || !trimString_(definition.sourceFileId)) {
    throw new Error('Source document is not configured.');
  }
  const sourceFile = getDriveFileByIdSafe_(definition.sourceFileId);
  if (!sourceFile) {
    throw new Error('Source document could not be loaded.');
  }
  const blob = sourceFile.getBlob();
  const bytes = blob.getBytes();
  if (!bytes || !bytes.length) {
    throw new Error('Source document is empty.');
  }
  return {
    fileName: sanitizeUploadedDocumentName_(sourceFile.getName(), definition.shortLabel + '.pdf'),
    mimeType: trimString_(blob.getContentType()) || MimeType.PDF,
    sizeBytes: bytes.length,
    base64Data: Utilities.base64Encode(bytes)
  };
}

function buildDriveFilePublicViewAssetUrl_(fileId) {
  const id = trimString_(fileId);
  return id ? ('https://drive.google.com/uc?export=view&id=' + encodeURIComponent(id)) : '';
}

function buildDriveFilePublicImageCandidates_(fileId) {
  const id = trimString_(fileId);
  if (!id) return [];
  const enc = encodeURIComponent(id);
  return [
    'https://drive.usercontent.google.com/download?id=' + enc + '&export=view',
    'https://lh3.googleusercontent.com/d/' + enc,
    'https://drive.google.com/uc?export=view&id=' + enc
  ];
}

function buildDriveBinaryDataPayload_(fileId, fallbackName, fallbackMimeType) {
  const id = trimString_(fileId);
  if (!id) {
    throw new Error('Source asset is not configured.');
  }

  let blob = null;
  let fileName = sanitizeUploadedDocumentName_(fallbackName, fallbackName || 'asset');
  const sourceFile = getDriveFileByIdSafe_(id);
  if (sourceFile) {
    blob = sourceFile.getBlob();
    fileName = sanitizeUploadedDocumentName_(sourceFile.getName(), fileName);
  } else {
    const response = UrlFetchApp.fetch(buildDriveFilePublicViewAssetUrl_(id), {
      followRedirects: true,
      muteHttpExceptions: true
    });
    const statusCode = Number(response && response.getResponseCode && response.getResponseCode()) || 0;
    if (statusCode < 200 || statusCode >= 300) {
      throw new Error('Source asset could not be loaded.');
    }
    blob = response.getBlob();
  }

  const bytes = blob && typeof blob.getBytes === 'function' ? blob.getBytes() : [];
  if (!bytes || !bytes.length) {
    throw new Error('Source asset is empty.');
  }
  const mimeType = trimString_(blob.getContentType()) || trimString_(fallbackMimeType) || 'application/octet-stream';
  return {
    fileName: fileName,
    mimeType: mimeType,
    sizeBytes: bytes.length,
    base64Data: Utilities.base64Encode(bytes)
  };
}

function buildTaxFormViewerAssetsPayload_() {
  const pageAssets = [
    {
      page: 1,
      fileId: DEFAULT_TAX_EXEMPT_FORM_PAGE_1_FILE_ID,
      fileName: 'mi-tax-form-3372-page-1.png'
    },
    {
      page: 2,
      fileId: DEFAULT_TAX_EXEMPT_FORM_PAGE_2_FILE_ID,
      fileName: 'mi-tax-form-3372-page-2.png'
    }
  ];
  return pageAssets.map(function(asset) {
    const payload = buildDriveBinaryDataPayload_(asset.fileId, asset.fileName, 'image/png');
    return {
      page: asset.page,
      fileName: payload.fileName,
      mimeType: payload.mimeType,
      sizeBytes: payload.sizeBytes,
      base64Data: payload.base64Data
    };
  });
}

function buildCreditTermsViewerAssetsPayload_() {
  const pageAssets = [
    { page: 1, fileId: DEFAULT_CREDIT_TERMS_FORM_PAGE_1_FILE_ID, fileName: 'credit-terms-page-1.png' },
    { page: 2, fileId: DEFAULT_CREDIT_TERMS_FORM_PAGE_2_FILE_ID, fileName: 'credit-terms-page-2.png' },
    { page: 3, fileId: DEFAULT_CREDIT_TERMS_FORM_PAGE_3_FILE_ID, fileName: 'credit-terms-page-3.png' },
    { page: 4, fileId: DEFAULT_CREDIT_TERMS_FORM_PAGE_4_FILE_ID, fileName: 'credit-terms-page-4.png' },
    { page: 5, fileId: DEFAULT_CREDIT_TERMS_FORM_PAGE_5_FILE_ID, fileName: 'credit-terms-page-5.png' }
  ];
  return pageAssets.map(function(asset) {
    const payload = {
      page: asset.page,
      fileId: asset.fileId,
      fileName: asset.fileName,
      imageCandidates: buildDriveFilePublicImageCandidates_(asset.fileId)
    };
    if (asset.page === 1) {
      try {
        const inlinePayload = buildDriveBinaryDataPayload_(asset.fileId, asset.fileName, 'image/png');
        payload.mimeType = trimString_(inlinePayload.mimeType) || 'image/png';
        payload.base64Data = trimString_(inlinePayload.base64Data);
      } catch (_) {}
    }
    return payload;
  });
}

function sanitizeUploadedDocumentName_(name, fallbackBaseName) {
  const fallback = trimString_(fallbackBaseName) || 'document';
  const raw = trimString_(name) || fallback;
  const cleaned = raw.replace(/[^\w.\- ]+/g, ' ').replace(/\s+/g, ' ').trim();
  return cleaned || fallback;
}

function buildAccountDocumentArtifactName_(ctx, definition, suffix) {
  const orgLabel = trimString_(ctx.accountInfo && ctx.accountInfo.summary && ctx.accountInfo.summary.orgName)
    || trimString_(ctx.identity && ctx.identity.orgName)
    || 'Account';
  const safeOrg = sanitizeUploadedDocumentName_(orgLabel, 'Account').replace(/\s+/g, '_');
  const stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'America/Detroit', 'yyyyMMdd_HHmmss');
  return safeOrg + ' - ' + definition.shortLabel + ' - ' + trimString_(suffix || stamp);
}

function decodeAccountDocumentUpload_(payload, definition, ctx) {
  const p = (payload && typeof payload === 'object') ? payload : {};
  const base64Data = trimString_(p.base64Data || p.fileDataBase64 || p.fileBase64);
  if (!base64Data) throw new Error('Choose a completed document before uploading.');
  const bytes = Utilities.base64Decode(base64Data);
  if (!bytes || !bytes.length) throw new Error('Unable to read the uploaded document.');
  if (bytes.length > MAX_ACCOUNT_DOCUMENT_UPLOAD_BYTES) {
    throw new Error('Uploaded documents must be 5 MB or smaller for this MVP flow.');
  }
  const mimeType = trimString_(p.mimeType) || 'application/octet-stream';
  const fallbackExt = mimeType === 'application/pdf' ? '.pdf' : '';
  const fileName = sanitizeUploadedDocumentName_(
    p.fileName,
    buildAccountDocumentArtifactName_(ctx, definition, 'Uploaded') + fallbackExt
  );
  return {
    bytes: bytes,
    mimeType: mimeType,
    fileName: fileName,
    sizeBytes: bytes.length,
    blob: Utilities.newBlob(bytes, mimeType, fileName)
  };
}

function decodeAccountDocumentUploads_(payload, definition, ctx) {
  const p = (payload && typeof payload === 'object') ? payload : {};
  const files = Array.isArray(p.files) ? p.files.filter(function(item) {
    return item && typeof item === 'object';
  }) : [];
  if (!files.length) {
    return [decodeAccountDocumentUpload_(payload, definition, ctx)];
  }
  return files.map(function(filePayload) {
    return decodeAccountDocumentUpload_(filePayload, definition, ctx);
  });
}

function decodeTaxExemptRenderedArtifact_(payload, definition, ctx) {
  const rendered = payload && payload.renderedArtifact && typeof payload.renderedArtifact === 'object'
    ? payload.renderedArtifact
    : null;
  if (!rendered) return null;
  const base64Data = trimString_(rendered.base64Data || rendered.fileDataBase64 || rendered.fileBase64);
  if (!base64Data) return null;
  const bytes = Utilities.base64Decode(base64Data);
  if (!bytes || !bytes.length) {
    throw new Error('Unable to read the completed document image.');
  }
  if (bytes.length > MAX_ACCOUNT_DOCUMENT_UPLOAD_BYTES) {
    throw new Error('Completed document image must be 5 MB or smaller.');
  }
  const mimeType = trimString_(rendered.mimeType) || 'image/png';
  const fallbackExt = mimeType === 'image/jpeg' ? '.jpg' : '.png';
  const fileName = sanitizeUploadedDocumentName_(
    rendered.fileName,
    buildAccountDocumentArtifactName_(ctx, definition, 'Rendered Submission') + fallbackExt
  );
  return {
    bytes: bytes,
    mimeType: mimeType,
    fileName: fileName,
    sizeBytes: bytes.length,
    blob: Utilities.newBlob(bytes, mimeType, fileName)
  };
}

function createAccountDocumentDriveFile_(ctx, definition, uploadInfo) {
  const folder = getDriveFolderByIdSafe_(definition.uploadFolderId);
  if (!folder) {
    throw new Error(definition.label + ' folder is not configured.');
  }
  const file = folder.createFile(uploadInfo.blob.setName(uploadInfo.fileName));
  try {
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (_) {}
  return {
    fileId: file.getId(),
    fileUrl: file.getUrl(),
    fileName: file.getName(),
    mimeType: uploadInfo.mimeType,
    sizeBytes: uploadInfo.sizeBytes
  };
}

function sanitizeTaxExemptGuidedForm_(payload, ctx) {
  const p = (payload && typeof payload === 'object') ? payload : {};
  const account = ctx && ctx.accountInfo && ctx.accountInfo.summary ? ctx.accountInfo.summary : {};
  const identity = ctx && ctx.identity ? ctx.identity : {};
  const form = {
    legalBusinessName: trimString_(p.legalBusinessName || account.orgName || identity.orgName),
    doingBusinessAs: trimString_(p.doingBusinessAs),
    addressLine1: trimString_(p.addressLine1),
    addressLine2: trimString_(p.addressLine2),
    city: trimString_(p.city),
    state: trimString_(p.state || 'MI').toUpperCase(),
    zip: trimString_(p.zip),
    contactName: trimString_(p.contactName || account.billingContactName || account.primaryContactName || identity.personName),
    contactTitle: trimString_(p.contactTitle),
    contactEmail: normalizeEmail_(p.contactEmail || account.billingContactEmail || account.primaryEmail || identity.personEmail),
    contactPhone: trimString_(p.contactPhone),
    exemptionReason: trimString_(p.exemptionReason),
    certificateNumber: trimString_(p.certificateNumber),
    businessType: trimString_(p.businessType),
    itemsPurchased: trimString_(p.itemsPurchased),
    signerName: trimString_(p.signerName || p.contactName || account.billingContactName || account.primaryContactName || identity.personName),
    signerTitle: trimString_(p.signerTitle || p.contactTitle),
    signedDate: trimString_(p.signedDate || nowIso_().slice(0, 10)),
    additionalNotes: trimString_(p.additionalNotes || p.notes),
    signatureDataUrl: trimString_(p.signatureDataUrl)
  };
  [
    ['legalBusinessName', 'Enter the legal business name for the exemption certificate.'],
    ['addressLine1', 'Enter the street address for the exemption certificate.'],
    ['city', 'Enter the city for the exemption certificate.'],
    ['state', 'Enter the state for the exemption certificate.'],
    ['zip', 'Enter the ZIP code for the exemption certificate.'],
    ['exemptionReason', 'Enter the exemption reason for the Michigan certificate.'],
    ['signerName', 'Enter the signer name for the exemption certificate.'],
    ['signerTitle', 'Enter the signer title for the exemption certificate.'],
    ['signedDate', 'Enter the signature date for the exemption certificate.']
  ].forEach(function(requirement) {
    if (!trimString_(form[requirement[0]])) {
      throw new Error(requirement[1]);
    }
  });
  return form;
}

function decodeDataUrlImageBlob_(dataUrl, fallbackName) {
  const raw = trimString_(dataUrl);
  const match = raw.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=\s]+)$/);
  if (!match) return null;
  const mimeType = trimString_(match[1]) || 'image/png';
  const bytes = Utilities.base64Decode(String(match[2] || '').replace(/\s+/g, ''));
  if (!bytes || !bytes.length) return null;
  const ext = mimeType === 'image/jpeg' ? '.jpg' : '.png';
  return Utilities.newBlob(bytes, mimeType, sanitizeUploadedDocumentName_(fallbackName || ('signature' + ext), 'signature' + ext));
}

function generateTaxExemptGuidedArtifact_(ctx, formData) {
  const definition = getAccountDocumentDefinition_(ACCOUNT_DOCUMENT_TYPES.tax_exempt, ctx.cfg);
  const folder = getDriveFolderByIdSafe_(definition.uploadFolderId);
  if (!folder) throw new Error('Tax exemption folder is not configured.');

  const title = buildAccountDocumentArtifactName_(ctx, definition, 'Guided Submission');
  const doc = DocumentApp.create(title);
  const body = doc.getBody();
  body.clear();
  body.appendParagraph('Michigan Sales Tax Exemption Submission').setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph('Structured portal submission for Red Threads review.');
  body.appendParagraph('Red Threads will review this account-level submission before approving tax-exempt eligibility.');
  body.appendParagraph('');
  body.appendParagraph('Business Information').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph('Legal Business Name: ' + formData.legalBusinessName);
  if (formData.doingBusinessAs) body.appendParagraph('DBA: ' + formData.doingBusinessAs);
  body.appendParagraph('Address 1: ' + formData.addressLine1);
  if (formData.addressLine2) body.appendParagraph('Address 2: ' + formData.addressLine2);
  body.appendParagraph('City / State / ZIP: ' + [formData.city, formData.state, formData.zip].filter(Boolean).join(', '));
  body.appendParagraph('');
  body.appendParagraph('Contact').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph('Name: ' + formData.contactName);
  if (formData.contactTitle) body.appendParagraph('Title: ' + formData.contactTitle);
  if (formData.contactEmail) body.appendParagraph('Email: ' + formData.contactEmail);
  if (formData.contactPhone) body.appendParagraph('Phone: ' + formData.contactPhone);
  body.appendParagraph('');
  body.appendParagraph('Michigan Certificate Details').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph('Exemption Reason: ' + formData.exemptionReason);
  if (formData.businessType) body.appendParagraph('Business Type: ' + formData.businessType);
  if (formData.itemsPurchased) body.appendParagraph('Items / Services: ' + formData.itemsPurchased);
  if (formData.certificateNumber) body.appendParagraph('Certificate Number: ' + formData.certificateNumber);
  body.appendParagraph('');
  body.appendParagraph('Signature').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph('Signer Name: ' + formData.signerName);
  body.appendParagraph('Signer Title: ' + formData.signerTitle);
  body.appendParagraph('Signed Date: ' + formData.signedDate);
  if (formData.signatureDataUrl) {
    const signatureBlob = decodeDataUrlImageBlob_(formData.signatureDataUrl, title + ' - Signature.png');
    if (signatureBlob) {
      body.appendParagraph('Signature Preview:');
      body.appendImage(signatureBlob);
    }
  }
  if (formData.additionalNotes) {
    body.appendParagraph('');
    body.appendParagraph('Additional Notes').setHeading(DocumentApp.ParagraphHeading.HEADING2);
    body.appendParagraph(formData.additionalNotes);
  }
  doc.saveAndClose();

  const docFile = DriveApp.getFileById(doc.getId());
  const pdfBlob = docFile.getAs(MimeType.PDF).setName(title + '.pdf');
  const pdfFile = folder.createFile(pdfBlob);
  try {
    pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (_) {}
  docFile.setTrashed(true);

  return {
    fileId: pdfFile.getId(),
    fileUrl: pdfFile.getUrl(),
    fileName: pdfFile.getName(),
    mimeType: MimeType.PDF,
    sizeBytes: pdfBlob.getBytes().length
  };
}

function buildAccountDocumentSubmissionEntry_(ctx, definition, options) {
  const opts = (options && typeof options === 'object') ? options : {};
  const now = trimString_(opts.submittedAt) || nowIso_();
  const accountSummary = ctx.accountInfo && ctx.accountInfo.summary ? ctx.accountInfo.summary : {};
  const payload = ctx.payload || {};
  return {
    submittedAt: now,
    submittedByName: trimString_(opts.submittedByName || accountSummary.billingContactName || accountSummary.primaryContactName || ctx.identity.personName || payload.personName),
    submittedByEmail: normalizeEmail_(opts.submittedByEmail || accountSummary.billingContactEmail || accountSummary.primaryEmail || ctx.identity.personEmail || payload.personEmail),
    submissionSource: trimString_(opts.submissionSource),
    artifactFileId: trimString_(opts.artifactFileId),
    artifactUrl: trimString_(opts.artifactUrl),
    artifactName: trimString_(opts.artifactName),
    artifactMimeType: trimString_(opts.artifactMimeType),
    artifactSizeBytes: Math.max(0, parseInt(String(opts.artifactSizeBytes || 0), 10) || 0),
    artifactFiles: normalizeAccountDocumentArtifactFiles_(opts.artifactFiles),
    certificateNumber: definition.certificateNumberField ? trimString_(opts.certificateNumber) : '',
    notes: trimString_(opts.notes),
    guidedFormData: opts.guidedFormData && typeof opts.guidedFormData === 'object'
      ? sanitizeGuidedFormDataForStorage_(opts.guidedFormData)
      : null
  };
}

function normalizeAccountDocumentArtifactFiles_(value) {
  const items = Array.isArray(value) ? value : [];
  return items.map(function(item) {
    const source = (item && typeof item === 'object') ? item : {};
    return {
      fileId: trimString_(source.fileId),
      fileUrl: trimString_(source.fileUrl),
      fileName: trimString_(source.fileName),
      mimeType: trimString_(source.mimeType),
      sizeBytes: Math.max(0, parseInt(String(source.sizeBytes || 0), 10) || 0)
    };
  }).filter(function(item) {
    return !!item.fileId;
  });
}

function getAccountDocumentSubmissionArtifactFiles_(submissionEntry) {
  var submission = (submissionEntry && typeof submissionEntry === 'object') ? submissionEntry : {};
  var artifactFiles = normalizeAccountDocumentArtifactFiles_(submission.artifactFiles);
  if (artifactFiles.length) return artifactFiles;
  var fallbackId = trimString_(submission.artifactFileId);
  if (!fallbackId) return [];
  return [{
    fileId: fallbackId,
    fileUrl: trimString_(submission.artifactUrl),
    fileName: trimString_(submission.artifactName),
    mimeType: trimString_(submission.artifactMimeType),
    sizeBytes: Math.max(0, parseInt(String(submission.artifactSizeBytes || 0), 10) || 0)
  }];
}

function sanitizeGuidedFormDataForStorage_(guidedFormData) {
  const cloned = cloneJsonValue_(guidedFormData, {});
  if (!cloned || typeof cloned !== 'object' || Array.isArray(cloned)) return null;
  const signatureDataUrl = trimString_(cloned.signatureDataUrl);
  if (signatureDataUrl) {
    cloned.signatureIncludedInArtifact = true;
  }
  delete cloned.signatureDataUrl;
  return cloned;
}

function persistAccountDocumentSubmission_(ctx, documentType, submissionEntry) {
  const definition = getAccountDocumentDefinition_(documentType, ctx.cfg);
  if (!definition) throw new Error('Unsupported document type.');
  const currentRow = ctx.accountInfo.rowInfo.rowObjNormalized;
  const now = trimString_(submissionEntry.submittedAt) || nowIso_();
  const notesText = updatePortalAccountDocumentNotes_(currentRow, definition.type, function(current) {
    const next = (current && typeof current === 'object' && !Array.isArray(current)) ? current : {};
    if (definition.type === ACCOUNT_DOCUMENT_TYPES.credit_terms) {
      next.submissions = [submissionEntry];
    } else {
      const submissions = Array.isArray(next.submissions) ? next.submissions.slice(0, 9) : [];
      submissions.unshift(submissionEntry);
      next.submissions = submissions;
    }
    next.lastSubmission = submissionEntry;
    return next;
  });
  const updates = {
    updatedAt: now,
    notes: notesText
  };
  updates[definition.statusField] = 'submitted';
  updates[definition.approvedField] = false;
  updates[definition.approvedAtField] = '';
  updates[definition.approvedByNameField] = '';
  updates[definition.approvedByEmailField] = '';
  updates[definition.artifactUrlField] = trimString_(submissionEntry.artifactUrl);
  updates[definition.submittedAtField] = now;
  if (definition.sourceUrlField) updates[definition.sourceUrlField] = trimString_(definition.sourceDocumentUrl);
  if (definition.certificateNumberField) updates[definition.certificateNumberField] = trimString_(submissionEntry.certificateNumber);
  if (definition.expiresAtField) updates[definition.expiresAtField] = '';
  if (definition.paymentTermsCodeField) updates[definition.paymentTermsCodeField] = '';
  if (definition.paymentTermsLabelField) updates[definition.paymentTermsLabelField] = '';
  if (definition.paymentTermsDaysField) updates[definition.paymentTermsDaysField] = 0;
  if (definition.paymentTermsNotesField) updates[definition.paymentTermsNotesField] = '';
  if (definition.paymentTermsSetAtField) updates[definition.paymentTermsSetAtField] = '';
  if (definition.paymentTermsSetByNameField) updates[definition.paymentTermsSetByNameField] = '';
  if (definition.paymentTermsSetByEmailField) updates[definition.paymentTermsSetByEmailField] = '';
  setRowValuesByHeaderMap_(ctx.infra.accountsSheet, ctx.accountInfo.rowInfo.row, ctx.accountInfo.rowInfo.colMap, updates);
  refreshAccountDocumentContextAccount_(ctx);
  return ctx.accountInfo;
}

function recordAccountDocumentBlankEmail_(ctx, documentType, recipients) {
  const definition = getAccountDocumentDefinition_(documentType, ctx.cfg);
  const now = nowIso_();
  const accountSummary = ctx.accountInfo && ctx.accountInfo.summary ? ctx.accountInfo.summary : {};
  const notesText = updatePortalAccountDocumentNotes_(ctx.accountInfo.rowInfo.rowObjNormalized, definition.type, function(current) {
    const next = (current && typeof current === 'object' && !Array.isArray(current)) ? current : {};
    next.lastBlankEmail = {
      sentAt: now,
      sentByName: trimString_(accountSummary.billingContactName || accountSummary.primaryContactName || ctx.identity.personName),
      sentByEmail: normalizeEmail_(accountSummary.billingContactEmail || accountSummary.primaryEmail || ctx.identity.personEmail),
      recipients: normalizeEmailRecipients_(recipients)
    };
    return next;
  });
  setRowValuesByHeaderMap_(ctx.infra.accountsSheet, ctx.accountInfo.rowInfo.row, ctx.accountInfo.rowInfo.colMap, {
    updatedAt: now,
    notes: notesText
  });
  refreshAccountDocumentContextAccount_(ctx);
}

function buildDefaultAccountDocumentBlankEmailPayload_(ctx, definition, recipients) {
  const emailList = normalizeEmailRecipients_(recipients);
  if (!emailList.length) throw new Error('Enter at least one valid email address.');
  const sourceFile = getDriveFileByIdSafe_(definition.sourceFileId);
  const subject = definition.blankEmailSubject;
  const body = [
    definition.label + ' blank PDF attached.',
    'Organization: ' + trimString_(ctx.accountInfo.summary.orgName || ctx.identity.orgName || '--'),
    definition.sourceDocumentUrl ? ('View document: ' + definition.sourceDocumentUrl) : '',
    definition.sourceDocumentDownloadUrl ? ('Download PDF: ' + definition.sourceDocumentDownloadUrl) : '',
    '',
    NOTIFICATION_REPLY_NOTICE
  ].filter(Boolean).join('\n');
  const htmlBody = [
    '<div style="margin:0;padding:24px 0;background:#f4f6fb;">',
    '  <div style="max-width:640px;margin:0 auto;padding:32px 28px;background:#ffffff;border:1px solid #e6ebf3;border-radius:18px;font-family:Arial,sans-serif;color:#142033;">',
    '    <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#73829a;font-weight:700;margin-bottom:12px;">Red Threads</div>',
    '    <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;color:#142033;">' + escapeHtml_(definition.label) + '</h1>',
    '    <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#35435a;">The blank PDF is attached for your department to review and complete.</p>',
    definition.sourceDocumentUrl
      ? ('    <p style="margin:0 0 12px;"><a href="' + escapeHtml_(definition.sourceDocumentUrl) + '" style="color:#12b5ea;">View Source Document</a></p>')
      : '',
    definition.sourceDocumentDownloadUrl
      ? ('    <p style="margin:0 0 12px;"><a href="' + escapeHtml_(definition.sourceDocumentDownloadUrl) + '" style="color:#12b5ea;">Download Blank PDF</a></p>')
      : '',
    '    <p style="margin:18px 0 0;font-size:14px;line-height:1.6;color:#5f6f86;">' + escapeHtml_(NOTIFICATION_REPLY_NOTICE) + '</p>',
    '  </div>',
    '</div>'
  ].join('\n');
  return {
    toList: emailList,
    subject: subject,
    body: body,
    htmlBody: htmlBody,
    attachments: sourceFile ? [sourceFile.getBlob().setName(sanitizeUploadedDocumentName_(sourceFile.getName(), definition.shortLabel + '.pdf'))] : []
  };
}

function buildTaxExemptBlankEmailPayload_(ctx, definition, recipients) {
  const emailList = normalizeEmailRecipients_(recipients);
  if (!emailList.length) throw new Error('Enter at least one valid email address.');
  const sourceFile = getDriveFileByIdSafe_(definition.sourceFileId);
  const taxBlankEmailFooter = 'This inbox is not monitored. Please do not reply or respond.';
  const body = [
    'The blank PDF is attached for your department to review and complete. Please log back into your portal and upload the finished document. Red Threads will review the complete document and notify you upon successful review.',
    '',
    taxBlankEmailFooter
  ].join('\n');
  const htmlBody = [
    '<div style="margin:0;padding:24px 0;background:#f4f6fb;">',
    '  <div style="max-width:640px;margin:0 auto;padding:32px 28px;background:#ffffff;border:1px solid #e6ebf3;border-radius:18px;font-family:Arial,sans-serif;color:#142033;">',
    '    <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#73829a;font-weight:700;margin-bottom:12px;">Red Threads</div>',
    '    <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;color:#142033;">' + escapeHtml_(definition.label) + '</h1>',
    '    <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#35435a;">The blank PDF is attached for your department to review and complete. Please log back into your portal and upload the finished document. Red Threads will review the complete document and notify you upon successful review.</p>',
    '    <p style="margin:18px 0 0;font-size:14px;line-height:1.6;color:#5f6f86;">' + escapeHtml_(taxBlankEmailFooter) + '</p>',
    '  </div>',
    '</div>'
  ].join('\n');
  return {
    toList: emailList,
    subject: definition.blankEmailSubject,
    body: body,
    htmlBody: htmlBody,
    attachments: sourceFile ? [sourceFile.getBlob().setName(sanitizeUploadedDocumentName_(sourceFile.getName(), definition.shortLabel + '.pdf'))] : []
  };
}

function buildCreditTermsBlankEmailPayload_(ctx, definition, recipients) {
  const emailList = normalizeEmailRecipients_(recipients);
  if (!emailList.length) throw new Error('Enter at least one valid email address.');
  const sourceFile = getDriveFileByIdSafe_(definition.sourceFileId);
  const creditTermsBlankEmailFooter = 'This inbox is not monitored. Please do not reply or respond.';
  const body = [
    'The blank PDF is attached for your department to review and complete. When the document is complete, please log back into your portal and upload the completed file. The Red Threads team will notify you if your terms have been approved and purchase order submission ability unlocked.',
    '',
    creditTermsBlankEmailFooter
  ].join('\n');
  const htmlBody = [
    '<div style="margin:0;padding:24px 0;background:#f4f6fb;">',
    '  <div style="max-width:640px;margin:0 auto;padding:32px 28px;background:#ffffff;border:1px solid #e6ebf3;border-radius:18px;font-family:Arial,sans-serif;color:#142033;">',
    '    <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#73829a;font-weight:700;margin-bottom:12px;">Red Threads</div>',
    '    <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;color:#142033;">' + escapeHtml_(definition.label) + '</h1>',
    '    <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#35435a;">The blank PDF is attached for your department to review and complete. When the document is complete, please log back into your portal and upload the completed file. The Red Threads team will notify you if your terms have been approved and purchase order submission ability unlocked.</p>',
    '    <p style="margin:18px 0 0;font-size:14px;line-height:1.6;color:#5f6f86;">' + escapeHtml_(creditTermsBlankEmailFooter) + '</p>',
    '  </div>',
    '</div>'
  ].join('\n');
  return {
    toList: emailList,
    subject: definition.blankEmailSubject,
    body: body,
    htmlBody: htmlBody,
    attachments: sourceFile ? [sourceFile.getBlob().setName(sanitizeUploadedDocumentName_(sourceFile.getName(), definition.shortLabel + '.pdf'))] : []
  };
}

function buildAccountDocumentBlankEmailPayload_(ctx, definition, recipients) {
  if (definition.type === ACCOUNT_DOCUMENT_TYPES.tax_exempt) {
    return buildTaxExemptBlankEmailPayload_(ctx, definition, recipients);
  }
  if (definition.type === ACCOUNT_DOCUMENT_TYPES.credit_terms) {
    return buildCreditTermsBlankEmailPayload_(ctx, definition, recipients);
  }
  return buildDefaultAccountDocumentBlankEmailPayload_(ctx, definition, recipients);
}

function sendAccountDocumentSourceEmail_(ctx, definition, recipients) {
  return sendNotificationEmail_(buildAccountDocumentBlankEmailPayload_(ctx, definition, recipients));
}

function buildDefaultAccountDocumentSubmissionNotificationPayload_(ctx, definition, submissionEntry) {
  const accountSummary = ctx.accountInfo && ctx.accountInfo.summary ? ctx.accountInfo.summary : {};
  const token = trimString_(ctx.exportRowInfo && ctx.exportRowInfo.rowObjNormalized && ctx.exportRowInfo.rowObjNormalized.token);
  const portalUrl = token ? buildPortalDirectUrl_(token) : '';
  const teamReviewUrl = buildAccountDocumentTeamReviewUrl_(definition.type, token, ctx.cfg) || portalUrl;
  const reviewerLabel = trimString_(submissionEntry.submittedByName || accountSummary.primaryContactName || accountSummary.billingContactName || 'A client');
  const orgLabel = trimString_(accountSummary.orgName || 'Unknown organization');
  const subject = 'Red Threads Portal: ' + definition.teamReviewSubject + ' - ' + trimString_(orgLabel || reviewerLabel || 'Account');
  const body = [
    definition.label + ' submission received.',
    '',
    'Submitted By: ' + reviewerLabel,
    'Organization: ' + orgLabel,
    'Account ID: ' + trimString_(accountSummary.accountId || '--'),
    'Submitter Email: ' + normalizeEmail_(submissionEntry.submittedByEmail || '--'),
    'Submitted At: ' + trimString_(submissionEntry.submittedAt || '--'),
    'Submission Source: ' + trimString_(submissionEntry.submissionSource || '--'),
    submissionEntry.certificateNumber ? ('Certificate Number: ' + trimString_(submissionEntry.certificateNumber)) : '',
    submissionEntry.artifactUrl ? ('Submission Artifact: ' + trimString_(submissionEntry.artifactUrl)) : '',
    teamReviewUrl ? ('Team Review: ' + teamReviewUrl) : '',
    submissionEntry.notes ? ('Notes: ' + trimString_(submissionEntry.notes)) : ''
  ].filter(Boolean).join('\n');
  return {
    to: DOCUMENT_REVIEW_EMAIL,
    subject: subject,
    body: body,
    htmlBody: '',
    attachments: []
  };
}

function buildCreditTermsTeamReviewNotificationHtml_(ctx, submissionEntry, options) {
  const opts = (options && typeof options === 'object') ? options : {};
  const accountSummary = ctx && ctx.accountInfo && ctx.accountInfo.summary ? ctx.accountInfo.summary : {};
  const submittedByName = trimString_(submissionEntry && submissionEntry.submittedByName) || 'Client';
  const orgName = trimString_(accountSummary.orgName || '--');
  const submittedAt = trimString_(submissionEntry && submissionEntry.submittedAt) || '--';
  const artifactUrl = trimString_(opts.artifactUrl || (submissionEntry && submissionEntry.artifactUrl));
  const teamReviewUrl = trimString_(opts.teamReviewUrl);
  return [
    '<div style="margin:0;padding:24px 0;background:#f4f6fb;">',
    '  <div style="max-width:700px;margin:0 auto;padding:32px 28px;background:#ffffff;border:1px solid #e6ebf3;border-radius:20px;font-family:Arial,sans-serif;color:#142033;">',
    '    <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#be123c;font-weight:800;margin-bottom:12px;">Team Review Required</div>',
    '    <h1 style="margin:0 0 14px;font-size:30px;line-height:1.18;color:#142033;">Signed credit terms document submitted</h1>',
    '    <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#35435a;">A client uploaded a completed credit terms document and needs Red Threads review.</p>',
    '    <div style="margin:0 0 22px;padding:18px 20px;border-radius:16px;background:#fff6f7;border:1px solid #fecdd3;">',
    '      <div style="font-size:14px;line-height:1.9;color:#3f2937;"><strong>Person:</strong> ' + escapeHtml_(submittedByName) + '</div>',
    '      <div style="font-size:14px;line-height:1.9;color:#3f2937;"><strong>Organization:</strong> ' + escapeHtml_(orgName) + '</div>',
    '      <div style="font-size:14px;line-height:1.9;color:#3f2937;"><strong>Submitted At:</strong> ' + escapeHtml_(submittedAt) + '</div>',
    artifactUrl
      ? ('      <div style="font-size:14px;line-height:1.9;color:#3f2937;"><strong>Stored Copy:</strong> <a href="' + escapeHtml_(artifactUrl) + '" style="color:#be123c;">Open in Drive</a></div>')
      : '',
    '    </div>',
    '    <div style="margin:0 0 22px;padding:16px 18px;border-radius:16px;background:#fff1f2;border:1px solid #fda4af;text-align:center;">',
    '      <div style="font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#be123c;font-weight:900;margin-bottom:6px;">🔐 Team Mode Password 🔐</div>',
    '      <div style="font-size:24px;line-height:1.2;color:#9f1239;font-weight:900;"><strong>' + escapeHtml_(DEFAULT_TEAM_MODE_PASSWORD) + '</strong></div>',
    '    </div>',
    teamReviewUrl
      ? ('    <p style="margin:0 0 18px;"><a href="' + escapeHtml_(teamReviewUrl) + '" style="display:inline-block;padding:16px 28px;border-radius:999px;background:linear-gradient(135deg,#fb7185 0%, #f43f5e 55%, #be123c 100%);color:#ffffff;text-decoration:none;font-size:16px;font-weight:800;box-shadow:0 16px 28px rgba(190,24,93,.24);">Click Here to Review Credit Terms</a></p>')
      : '',
    '    <p style="margin:0;font-size:13px;line-height:1.6;color:#64748b;">This inbox is not monitored. Please review the submission in the portal.</p>',
    '  </div>',
    '</div>'
  ].filter(Boolean).join('\n');
}

function buildCreditTermsSubmissionNotificationPayload_(ctx, definition, submissionEntry) {
  const accountSummary = ctx.accountInfo && ctx.accountInfo.summary ? ctx.accountInfo.summary : {};
  const token = trimString_(ctx.exportRowInfo && ctx.exportRowInfo.rowObjNormalized && ctx.exportRowInfo.rowObjNormalized.token);
  const teamReviewUrl = buildAccountDocumentTeamReviewUrl_(definition.type, token, ctx.cfg);
  const reviewerLabel = trimString_(submissionEntry.submittedByName || accountSummary.primaryContactName || accountSummary.billingContactName || 'A client');
  const artifactFiles = getAccountDocumentSubmissionArtifactFiles_(submissionEntry);
  const attachments = artifactFiles.map(function(item) {
    const file = getDriveFileByIdSafe_(item.fileId);
    if (!file) return null;
    return file.getBlob().setName(
      sanitizeUploadedDocumentName_(
        item.fileName || file.getName(),
        item.fileName || file.getName()
      )
    );
  }).filter(Boolean);
  return {
    to: DOCUMENT_REVIEW_EMAIL,
    subject: '🔥 ' + reviewerLabel + ' submitted signed credit terms and your review is required',
    body: [
      'A signed credit terms document is ready for team review.',
      '',
      'Submitted By: ' + reviewerLabel,
      'Organization: ' + trimString_(accountSummary.orgName || 'Unknown organization'),
      'Account ID: ' + trimString_(accountSummary.accountId || '--'),
      'Submitter Email: ' + normalizeEmail_(submissionEntry.submittedByEmail || '--'),
      'Submitted At: ' + trimString_(submissionEntry.submittedAt || '--'),
      'Submission Source: ' + trimString_(submissionEntry.submissionSource || '--'),
      submissionEntry.artifactUrl ? ('Submission Artifact: ' + trimString_(submissionEntry.artifactUrl)) : '',
      teamReviewUrl ? ('Team Review: ' + teamReviewUrl) : '',
      '🔥 Team mode password: ' + DEFAULT_TEAM_MODE_PASSWORD,
      submissionEntry.notes ? ('Notes: ' + trimString_(submissionEntry.notes)) : ''
    ].filter(Boolean).join('\n'),
    htmlBody: buildCreditTermsTeamReviewNotificationHtml_(ctx, submissionEntry, {
      teamReviewUrl: teamReviewUrl,
      artifactUrl: trimString_(submissionEntry.artifactUrl)
    }),
    attachments: attachments
  };
}

function buildTaxExemptSubmissionNotificationPayload_(ctx, definition, submissionEntry) {
  const accountSummary = ctx.accountInfo && ctx.accountInfo.summary ? ctx.accountInfo.summary : {};
  const token = trimString_(ctx.exportRowInfo && ctx.exportRowInfo.rowObjNormalized && ctx.exportRowInfo.rowObjNormalized.token);
  const portalUrl = token ? buildPortalDirectUrl_(token) : '';
  const teamReviewUrl = buildTeamTaxExemptReviewUrl_(token);
  const reviewerLabel = trimString_(submissionEntry.submittedByName || accountSummary.primaryContactName || accountSummary.billingContactName || 'A client');
  const artifactFile = trimString_(submissionEntry.artifactFileId)
    ? getDriveFileByIdSafe_(submissionEntry.artifactFileId)
    : null;
  return {
    to: DOCUMENT_REVIEW_EMAIL,
    subject: '🔥 ' + reviewerLabel + ' has completed the sales tax exempt form and your review is required',
    body: [
      'A Michigan sales tax exemption form is ready for team review.',
      '',
      'Submitted By: ' + reviewerLabel,
      'Organization: ' + trimString_(accountSummary.orgName || 'Unknown organization'),
      'Account ID: ' + trimString_(accountSummary.accountId || '--'),
      'Submitter Email: ' + normalizeEmail_(submissionEntry.submittedByEmail || '--'),
      'Submitted At: ' + trimString_(submissionEntry.submittedAt || '--'),
      'Submission Source: ' + trimString_(submissionEntry.submissionSource || '--'),
      submissionEntry.certificateNumber ? ('Certificate Number: ' + trimString_(submissionEntry.certificateNumber)) : '',
      submissionEntry.artifactUrl ? ('Submission Artifact: ' + trimString_(submissionEntry.artifactUrl)) : '',
      teamReviewUrl ? ('Team Review: ' + teamReviewUrl) : '',
      '🔥 Team mode password: ' + DEFAULT_TEAM_MODE_PASSWORD,
      submissionEntry.notes ? ('Notes: ' + trimString_(submissionEntry.notes)) : ''
    ].filter(Boolean).join('\n'),
    htmlBody: buildTaxExemptTeamReviewNotificationHtml_(ctx, submissionEntry, {
      teamReviewUrl: teamReviewUrl,
      artifactUrl: trimString_(submissionEntry.artifactUrl),
      portalUrl: portalUrl
    }),
    attachments: artifactFile ? [
      artifactFile.getBlob().setName(
        sanitizeUploadedDocumentName_(
          submissionEntry.artifactName || artifactFile.getName(),
          submissionEntry.artifactName || artifactFile.getName()
        )
      )
    ] : []
  };
}

function buildAccountDocumentSubmissionNotificationPayload_(ctx, definition, submissionEntry) {
  if (definition.type === ACCOUNT_DOCUMENT_TYPES.tax_exempt) {
    return buildTaxExemptSubmissionNotificationPayload_(ctx, definition, submissionEntry);
  }
  if (definition.type === ACCOUNT_DOCUMENT_TYPES.credit_terms) {
    return buildCreditTermsSubmissionNotificationPayload_(ctx, definition, submissionEntry);
  }
  return buildDefaultAccountDocumentSubmissionNotificationPayload_(ctx, definition, submissionEntry);
}

function sendAccountDocumentSubmissionNotification_(ctx, definition, submissionEntry) {
  return sendNotificationEmail_(buildAccountDocumentSubmissionNotificationPayload_(ctx, definition, submissionEntry));
}

function buildTeamTaxExemptReviewUrl_(token) {
  return buildAccountDocumentTeamReviewUrl_(ACCOUNT_DOCUMENT_TYPES.tax_exempt, token);
}

function getLatestAccountDocumentSubmission_(ctx, documentType) {
  const definition = getAccountDocumentDefinition_(documentType, ctx && ctx.cfg);
  if (!definition) return null;
  const notesMeta = getPortalAccountDocumentNotes_(
    ctx && ctx.accountInfo && ctx.accountInfo.rowInfo && ctx.accountInfo.rowInfo.rowObjNormalized,
    definition.type
  );
  const submission = notesMeta && notesMeta.lastSubmission && typeof notesMeta.lastSubmission === 'object'
    ? cloneJsonValue_(notesMeta.lastSubmission, {})
    : null;
  return submission && typeof submission === 'object' && !Array.isArray(submission) ? submission : null;
}

function buildTaxExemptTeamReviewNotificationHtml_(ctx, submissionEntry, options) {
  const opts = (options && typeof options === 'object') ? options : {};
  const accountSummary = ctx && ctx.accountInfo && ctx.accountInfo.summary ? ctx.accountInfo.summary : {};
  const submittedByName = trimString_(submissionEntry && submissionEntry.submittedByName) || 'Client';
  const orgName = trimString_(accountSummary.orgName || '--');
  const submittedAt = trimString_(submissionEntry && submissionEntry.submittedAt) || '--';
  const artifactUrl = trimString_(opts.artifactUrl || (submissionEntry && submissionEntry.artifactUrl));
  const teamReviewUrl = trimString_(opts.teamReviewUrl);
  const portalUrl = trimString_(opts.portalUrl);
  return [
    '<div style="margin:0;padding:24px 0;background:#f4f6fb;">',
    '  <div style="max-width:700px;margin:0 auto;padding:32px 28px;background:#ffffff;border:1px solid #e6ebf3;border-radius:20px;font-family:Arial,sans-serif;color:#142033;">',
    '    <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#be123c;font-weight:800;margin-bottom:12px;">Team Review Required</div>',
    '    <h1 style="margin:0 0 14px;font-size:30px;line-height:1.18;color:#142033;">Michigan sales tax exemption form submitted</h1>',
    '    <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#35435a;">A client has completed the sales tax exempt form and needs review.</p>',
    '    <div style="margin:0 0 22px;padding:18px 20px;border-radius:16px;background:#fff6f7;border:1px solid #fecdd3;">',
    '      <div style="font-size:14px;line-height:1.9;color:#3f2937;"><strong>Person:</strong> ' + escapeHtml_(submittedByName) + '</div>',
    '      <div style="font-size:14px;line-height:1.9;color:#3f2937;"><strong>Organization:</strong> ' + escapeHtml_(orgName) + '</div>',
    '      <div style="font-size:14px;line-height:1.9;color:#3f2937;"><strong>Completed At:</strong> ' + escapeHtml_(submittedAt) + '</div>',
    artifactUrl
      ? ('      <div style="font-size:14px;line-height:1.9;color:#3f2937;"><strong>Stored Copy:</strong> <a href="' + escapeHtml_(artifactUrl) + '" style="color:#be123c;">Open in Drive</a></div>')
      : '',
    '    </div>',
    '    <div style="margin:0 0 22px;padding:16px 18px;border-radius:16px;background:#fff1f2;border:1px solid #fda4af;text-align:center;">',
    '      <div style="font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#be123c;font-weight:900;margin-bottom:6px;">🔐 Team Mode Password 🔐</div>',
    '      <div style="font-size:24px;line-height:1.2;color:#9f1239;font-weight:900;"><strong>' + escapeHtml_(DEFAULT_TEAM_MODE_PASSWORD) + '</strong></div>',
    '    </div>',
    teamReviewUrl
      ? ('    <p style="margin:0 0 18px;"><a href="' + escapeHtml_(teamReviewUrl) + '" style="display:inline-block;padding:16px 28px;border-radius:999px;background:linear-gradient(135deg,#fb7185 0%, #f43f5e 55%, #be123c 100%);color:#ffffff;text-decoration:none;font-size:16px;font-weight:800;box-shadow:0 16px 28px rgba(190,24,93,.24);">Click Here to Review and Approve</a></p>')
      : '',
    portalUrl
      ? ('    <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#64748b;">If the button does not open, use this direct portal link: <a href="' + escapeHtml_(portalUrl) + '" style="color:#be123c;">Open portal</a></p>')
      : '',
    '    <p style="margin:0;font-size:13px;line-height:1.6;color:#64748b;">This inbox is not monitored. Please review the submission in the portal.</p>',
    '  </div>',
    '</div>'
  ].filter(Boolean).join('\n');
}

function buildAccountDocumentDecisionEntry_(definition, decision, ctx, payload, options) {
  const opts = (options && typeof options === 'object') ? options : {};
  const normalizedDecision = String(decision || '').trim().toLowerCase() === 'approved' ? 'approved' : 'rejected';
  const submittedAt = trimString_(opts.decidedAt) || nowIso_();
  const reason = trimString_(payload && payload.reason);
  return {
    decidedAt: submittedAt,
    decision: normalizedDecision,
    decidedByName: trimString_(opts.decidedByName || getVisibleTeamAuthorName_(ctx && ctx.exportRowInfo && ctx.exportRowInfo.rowObjNormalized)),
    decidedByEmail: normalizeEmail_(opts.decidedByEmail || DOCUMENT_REVIEW_EMAIL),
    reason: normalizedDecision === 'rejected' ? reason : ''
  };
}

function persistAccountDocumentDecision_(ctx, definition, decisionEntry, options) {
  const opts = (options && typeof options === 'object') ? options : {};
  const now = trimString_(decisionEntry && decisionEntry.decidedAt) || nowIso_();
  const isApproved = String(decisionEntry && decisionEntry.decision || '').trim() === 'approved';
  const notesText = updatePortalAccountDocumentNotes_(
    ctx.accountInfo.rowInfo.rowObjNormalized,
    definition.type,
    function(current) {
      const next = (current && typeof current === 'object' && !Array.isArray(current)) ? current : {};
      next.lastDecision = decisionEntry;
      const reviews = Array.isArray(next.reviews) ? next.reviews.slice(0, 11) : [];
      reviews.unshift(decisionEntry);
      next.reviews = reviews;
      return next;
    }
  );
  const updates = {
    updatedAt: now,
    notes: notesText,
    [definition.statusField]: isApproved ? 'approved' : 'rejected',
    [definition.approvedField]: isApproved,
    [definition.approvedAtField]: isApproved ? now : '',
    [definition.approvedByNameField]: isApproved ? trimString_(decisionEntry.decidedByName) : '',
    [definition.approvedByEmailField]: isApproved ? normalizeEmail_(decisionEntry.decidedByEmail) : ''
  };
  if (!isApproved) {
    if (definition.paymentTermsCodeField) updates[definition.paymentTermsCodeField] = '';
    if (definition.paymentTermsLabelField) updates[definition.paymentTermsLabelField] = '';
    if (definition.paymentTermsDaysField) updates[definition.paymentTermsDaysField] = 0;
    if (definition.paymentTermsNotesField) updates[definition.paymentTermsNotesField] = '';
    if (definition.paymentTermsSetAtField) updates[definition.paymentTermsSetAtField] = '';
    if (definition.paymentTermsSetByNameField) updates[definition.paymentTermsSetByNameField] = '';
    if (definition.paymentTermsSetByEmailField) updates[definition.paymentTermsSetByEmailField] = '';
  }
  if (opts.extraRowUpdates && typeof opts.extraRowUpdates === 'object') {
    Object.keys(opts.extraRowUpdates).forEach((key) => {
      if (!trimString_(key)) return;
      updates[key] = opts.extraRowUpdates[key];
    });
  }
  setRowValuesByHeaderMap_(ctx.infra.accountsSheet, ctx.accountInfo.rowInfo.row, ctx.accountInfo.rowInfo.colMap, updates);
  refreshAccountDocumentContextAccount_(ctx);
  if (ctx.exportRowInfo) {
    try {
      writeCurrentOrderPointersToExportLog_({
        cfg: ctx.cfg,
        ss: ctx.ss,
        infra: ctx.infra,
        rowInfo: ctx.exportRowInfo,
        token: trimString_(ctx.exportRowInfo.rowObjNormalized.token),
        accountSummary: ctx.accountInfo.summary
      });
    } catch (_) {}
  }
  return ctx.accountInfo.summary;
}

function buildTaxExemptDecisionEntry_(decision, ctx, payload) {
  const definition = getRequiredAccountDocumentDefinition_(ACCOUNT_DOCUMENT_TYPES.tax_exempt, ctx && ctx.cfg);
  return buildAccountDocumentDecisionEntry_(definition, decision, ctx, payload);
}

function persistTaxExemptDecision_(ctx, decisionEntry) {
  const definition = getRequiredAccountDocumentDefinition_(ACCOUNT_DOCUMENT_TYPES.tax_exempt, ctx && ctx.cfg);
  return persistAccountDocumentDecision_(ctx, definition, decisionEntry);
}

function buildCreditTermsDecisionEntry_(decision, ctx, payload) {
  const definition = getRequiredAccountDocumentDefinition_(ACCOUNT_DOCUMENT_TYPES.credit_terms, ctx && ctx.cfg);
  return buildAccountDocumentDecisionEntry_(definition, decision, ctx, payload);
}

function buildCreditTermsApprovalRowUpdates_(definition, paymentTermsSelection, decisionEntry) {
  const selection = (paymentTermsSelection && typeof paymentTermsSelection === 'object') ? paymentTermsSelection : {};
  const decision = (decisionEntry && typeof decisionEntry === 'object') ? decisionEntry : {};
  const updates = {};
  if (definition.paymentTermsCodeField) updates[definition.paymentTermsCodeField] = trimString_(selection.code);
  if (definition.paymentTermsLabelField) updates[definition.paymentTermsLabelField] = trimString_(selection.label);
  if (definition.paymentTermsDaysField) updates[definition.paymentTermsDaysField] = Math.max(0, parseInt(String(selection.days || 0), 10) || 0);
  if (definition.paymentTermsNotesField) updates[definition.paymentTermsNotesField] = trimString_(selection.notes);
  if (definition.paymentTermsSetAtField) updates[definition.paymentTermsSetAtField] = trimString_(decision.decidedAt) || nowIso_();
  if (definition.paymentTermsSetByNameField) updates[definition.paymentTermsSetByNameField] = trimString_(decision.decidedByName);
  if (definition.paymentTermsSetByEmailField) updates[definition.paymentTermsSetByEmailField] = normalizeEmail_(decision.decidedByEmail);
  return updates;
}

function persistCreditTermsDecision_(ctx, decisionEntry, options) {
  const definition = getRequiredAccountDocumentDefinition_(ACCOUNT_DOCUMENT_TYPES.credit_terms, ctx && ctx.cfg);
  const opts = (options && typeof options === 'object') ? options : {};
  const isApproved = String(decisionEntry && decisionEntry.decision || '').trim() === 'approved';
  const extraRowUpdates = isApproved
    ? buildCreditTermsApprovalRowUpdates_(definition, opts.paymentTermsSelection, decisionEntry)
    : {};
  return persistAccountDocumentDecision_(ctx, definition, decisionEntry, {
    extraRowUpdates: extraRowUpdates
  });
}

function sendCreditTermsDenialEmail_(ctx, submissionEntry, reason) {
  const accountSummary = ctx && ctx.accountInfo && ctx.accountInfo.summary ? ctx.accountInfo.summary : {};
  const token = trimString_(ctx && ctx.exportRowInfo && ctx.exportRowInfo.rowObjNormalized && ctx.exportRowInfo.rowObjNormalized.token);
  const portalUrl = token ? buildExternalPortalUrl_(token) : '';
  const recipients = normalizeEmailRecipients_([
    submissionEntry && submissionEntry.submittedByEmail,
    accountSummary.billingContactEmail,
    accountSummary.primaryEmail,
    ctx && ctx.identity && ctx.identity.personEmail
  ]);
  if (!recipients.length) return { ok: false, skipped: true, reason: 'missing-email' };
  const submittedByName = trimString_(
    submissionEntry && submissionEntry.submittedByName ||
    accountSummary.billingContactName ||
    accountSummary.primaryContactName ||
    'there'
  );
  const subject = 'Update on your Red Threads credit terms submission';
  const body = [
    'Hi ' + submittedByName + ',',
    '',
    'Red Threads reviewed your signed credit terms document, but we need a correction before approval.',
    '',
    'Reason:',
    reason,
    '',
    'Please return to the portal, update the form, and resubmit it for review.' + (portalUrl ? (' ' + portalUrl) : ''),
    '',
    'This inbox is not monitored. Please do not reply or respond.'
  ].join('\n');
  const htmlBody = [
    '<div style="margin:0;padding:24px 0;background:#f4f6fb;">',
    '  <div style="max-width:640px;margin:0 auto;padding:32px 28px;background:#ffffff;border:1px solid #e6ebf3;border-radius:18px;font-family:Arial,sans-serif;color:#142033;">',
    '    <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#be123c;font-weight:800;margin-bottom:12px;">Red Threads Review</div>',
    '    <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;color:#142033;">We need a correction before approval</h1>',
    '    <p style="margin:0 0 18px;font-size:16px;line-height:1.6;color:#35435a;">Your signed credit terms document was reviewed, but it could not be approved yet.</p>',
    '    <div style="margin:0 0 18px;padding:16px 18px;border-radius:14px;background:#fff6f7;border:1px solid #fecdd3;color:#3f2937;font-size:15px;line-height:1.7;"><strong>Reason:</strong><br>' + escapeHtml_(reason).replace(/\n/g, '<br>') + '</div>',
    portalUrl
      ? ('    <p style="margin:0 0 16px;font-size:16px;line-height:1.7;"><a href="' + escapeHtml_(portalUrl) + '" style="color:#be123c;font-weight:800;text-decoration:underline;">Please return to the portal, update the form, and resubmit it for review.</a></p>')
      : '    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#35435a;">Please return to the portal, update the form, and resubmit it for review.</p>',
    '    <p style="margin:0;font-size:14px;line-height:1.6;color:#5f6f86;">This inbox is not monitored. Please do not reply or respond.</p>',
    '  </div>',
    '</div>'
  ].join('\n');
  return sendNotificationEmail_({
    toList: recipients,
    subject: subject,
    body: body,
    htmlBody: htmlBody
  });
}

function sendApprovedCreditTermsEmail_(ctx, submissionEntry, paymentTermsSelection) {
  const attachments = getAccountDocumentSubmissionArtifactFiles_(submissionEntry).map(function(item) {
    const file = getDriveFileByIdSafe_(item.fileId);
    if (!file) return null;
    return file.getBlob().setName(
      sanitizeUploadedDocumentName_(
        item.fileName || file.getName(),
        item.fileName || file.getName()
      )
    );
  }).filter(Boolean);
  const accountSummary = ctx && ctx.accountInfo && ctx.accountInfo.summary ? ctx.accountInfo.summary : {};
  const recipients = normalizeEmailRecipients_([
    submissionEntry && submissionEntry.submittedByEmail,
    accountSummary.billingContactEmail,
    accountSummary.primaryEmail,
    ctx && ctx.identity && ctx.identity.personEmail
  ]);
  if (!recipients.length) return { ok: false, skipped: true, reason: 'missing-email' };
  const personName = trimString_(
    (submissionEntry && submissionEntry.submittedByName) ||
    (ctx && ctx.identity && ctx.identity.personName) ||
    accountSummary.billingContactName ||
    accountSummary.primaryContactName ||
    ''
  );
  const firstName = trimString_(personName.split(/\s+/)[0]) || 'there';
  const selection = (paymentTermsSelection && typeof paymentTermsSelection === 'object') ? paymentTermsSelection : {};
  const paymentLabel = trimString_(selection.label) || 'Approved Terms';
  const subject = 'Your Red Threads credit terms are approved';
  const body = [
    'Hi ' + firstName + ',',
    '',
    'Congratulations, your credit terms have been approved for purchases within Red Threads LLC.',
    'Approved payment terms: ' + paymentLabel + '.',
    '',
    'Attached is a copy of the signed credit terms document for your records.',
    '',
    'This inbox is not monitored. Please do not reply or respond.',
    '',
    '- Red Threads Team'
  ].join('\n');
  const htmlBody = [
    '<div style="margin:0;padding:24px 0;background:#f4f6fb;">',
    '  <div style="max-width:640px;margin:0 auto;padding:32px 28px;background:#ffffff;border:1px solid #e6ebf3;border-radius:18px;font-family:Arial,sans-serif;color:#142033;">',
    '    <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#73829a;font-weight:700;margin-bottom:12px;">Red Threads</div>',
    '    <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;color:#142033;">Your credit terms are approved</h1>',
    '    <p style="margin:0 0 14px;font-size:16px;line-height:1.7;color:#35435a;">Hi ' + escapeHtml_(firstName) + ',</p>',
    '    <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#166534;font-weight:800;">Congratulations, your credit terms have been approved for purchases within Red Threads LLC.</p>',
    '    <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#35435a;"><strong>Approved payment terms:</strong> ' + escapeHtml_(paymentLabel) + '</p>',
    '    <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#35435a;">Attached is a copy of the signed credit terms document for your records.</p>',
    '    <p style="margin:18px 0 0;font-size:14px;line-height:1.7;color:#5f6f86;">This inbox is not monitored. Please do not reply or respond.</p>',
    '    <p style="margin:12px 0 0;font-size:14px;line-height:1.7;color:#142033;font-weight:700;">- Red Threads Team</p>',
    '  </div>',
    '</div>'
  ].join('\n');
  return sendNotificationEmail_({
    toList: recipients,
    subject: subject,
    body: body,
    htmlBody: htmlBody,
    attachments: attachments
  });
}

function sendTaxExemptDenialEmail_(ctx, submissionEntry, reason) {
  const accountSummary = ctx && ctx.accountInfo && ctx.accountInfo.summary ? ctx.accountInfo.summary : {};
  const token = trimString_(ctx && ctx.exportRowInfo && ctx.exportRowInfo.rowObjNormalized && ctx.exportRowInfo.rowObjNormalized.token);
  const portalUrl = token ? buildExternalPortalUrl_(token) : '';
  const recipients = normalizeEmailRecipients_([
    submissionEntry && submissionEntry.submittedByEmail,
    accountSummary.billingContactEmail,
    accountSummary.primaryEmail,
    ctx && ctx.identity && ctx.identity.personEmail
  ]);
  if (!recipients.length) return { ok: false, skipped: true, reason: 'missing-email' };
  const submittedByName = trimString_(
    submissionEntry && submissionEntry.submittedByName ||
    accountSummary.billingContactName ||
    accountSummary.primaryContactName ||
    'there'
  );
  const subject = 'Update on your Michigan sales tax exemption form';
  const body = [
    'Hi ' + submittedByName + ',',
    '',
    'Red Threads reviewed your Michigan sales tax exemption form, but it could not be approved yet.',
    '',
    'Reason:',
    reason,
    '',
    'Please return to the portal, update the form, and resubmit it for review.' + (portalUrl ? (' ' + portalUrl) : ''),
    '',
    'This inbox is not monitored. Please do not reply or respond.'
  ].join('\n');
  const htmlBody = [
    '<div style="margin:0;padding:24px 0;background:#f4f6fb;">',
    '  <div style="max-width:640px;margin:0 auto;padding:32px 28px;background:#ffffff;border:1px solid #e6ebf3;border-radius:18px;font-family:Arial,sans-serif;color:#142033;">',
    '    <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#be123c;font-weight:800;margin-bottom:12px;">Red Threads Review</div>',
    '    <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;color:#142033;">We need a correction before approval</h1>',
    '    <p style="margin:0 0 18px;font-size:16px;line-height:1.6;color:#35435a;">Your Michigan sales tax exemption form was reviewed, but it could not be approved yet.</p>',
    '    <div style="margin:0 0 18px;padding:16px 18px;border-radius:14px;background:#fff6f7;border:1px solid #fecdd3;color:#3f2937;font-size:15px;line-height:1.7;"><strong>Reason:</strong><br>' + escapeHtml_(reason).replace(/\n/g, '<br>') + '</div>',
    portalUrl
      ? ('    <p style="margin:0 0 16px;font-size:16px;line-height:1.7;"><a href="' + escapeHtml_(portalUrl) + '" style="color:#be123c;font-weight:800;text-decoration:underline;">Please return to the portal, update the form, and resubmit it for review.</a></p>')
      : '    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#35435a;">Please return to the portal, update the form, and resubmit it for review.</p>',
    '    <p style="margin:0;font-size:14px;line-height:1.6;color:#5f6f86;">This inbox is not monitored. Please do not reply or respond.</p>',
    '  </div>',
    '</div>'
  ].join('\n');
  return sendNotificationEmail_({
    toList: recipients,
    subject: subject,
    body: body,
    htmlBody: htmlBody
  });
}

function getTaxExemptTeamReview_(payload) {
  const ctx = buildAccountDocumentContext_(payload);
  if (!ctx || ctx.ok === false) return ctx;
  assertTeamModeAuthorized_(ctx, payload);
  const submissionEntry = getLatestAccountDocumentSubmission_(ctx, ACCOUNT_DOCUMENT_TYPES.tax_exempt);
  if (!submissionEntry) {
    return { ok: false, error: 'No submitted tax exemption document is available to review.' };
  }
  const artifactFileId = trimString_(submissionEntry.artifactFileId);
  if (!artifactFileId) {
    return { ok: false, error: 'The submitted tax exemption artifact is unavailable.' };
  }
  const artifact = buildDriveBinaryDataPayload_(
    artifactFileId,
    submissionEntry.artifactName || 'Tax-Exempt-Submission.png',
    submissionEntry.artifactMimeType || 'image/png'
  );
  return buildAccountDocumentWorkflowResponse_(
    ctx,
    ACCOUNT_DOCUMENT_TYPES.tax_exempt,
    'Team review artifact ready.',
    {
      reviewArtifact: {
        fileId: artifactFileId,
        fileName: artifact.fileName,
        mimeType: artifact.mimeType,
        base64Data: artifact.base64Data,
        fileUrl: trimString_(submissionEntry.artifactUrl),
        submittedAt: trimString_(submissionEntry.submittedAt),
        submittedByName: trimString_(submissionEntry.submittedByName),
        submittedByEmail: normalizeEmail_(submissionEntry.submittedByEmail),
        orgName: trimString_(ctx.accountInfo && ctx.accountInfo.summary && ctx.accountInfo.summary.orgName)
      }
    }
  );
}

function getTaxExemptTeamReview(payload) {
  try {
    return getTaxExemptTeamReview_(payload);
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

function approveTaxExemptSubmission_(payload) {
  const ctx = buildAccountDocumentContext_(payload);
  if (!ctx || ctx.ok === false) return ctx;
  assertTeamModeAuthorized_(ctx, payload);
  const submissionEntry = getLatestAccountDocumentSubmission_(ctx, ACCOUNT_DOCUMENT_TYPES.tax_exempt);
  if (!submissionEntry) return { ok: false, error: 'No submitted tax exemption document is available to approve.' };
  const decisionEntry = buildTaxExemptDecisionEntry_('approved', ctx, payload);
  persistTaxExemptDecision_(ctx, decisionEntry);
  let warnings = [];
  try {
    sendApprovedTaxExemptEmail_(ctx, submissionEntry);
  } catch (notifyErr) {
    warnings = [String((notifyErr && notifyErr.message) || notifyErr)];
  }
  return buildAccountDocumentWorkflowResponse_(
    ctx,
    ACCOUNT_DOCUMENT_TYPES.tax_exempt,
    'Tax exemption approved.',
    {
      decision: 'approved',
      warnings: warnings
    }
  );
}

function approveTaxExemptSubmission(payload) {
  try {
    return approveTaxExemptSubmission_(payload);
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

function denyTaxExemptSubmission_(payload) {
  const ctx = buildAccountDocumentContext_(payload);
  if (!ctx || ctx.ok === false) return ctx;
  assertTeamModeAuthorized_(ctx, payload);
  const reason = trimString_(payload && payload.reason);
  if (!reason) return { ok: false, error: 'Enter a reason before denying the form.' };
  const submissionEntry = getLatestAccountDocumentSubmission_(ctx, ACCOUNT_DOCUMENT_TYPES.tax_exempt);
  if (!submissionEntry) return { ok: false, error: 'No submitted tax exemption document is available to deny.' };
  const decisionEntry = buildTaxExemptDecisionEntry_('rejected', ctx, payload);
  persistTaxExemptDecision_(ctx, decisionEntry);
  try {
    sendTaxExemptDenialEmail_(ctx, submissionEntry, reason);
  } catch (_) {}
  return buildAccountDocumentWorkflowResponse_(
    ctx,
    ACCOUNT_DOCUMENT_TYPES.tax_exempt,
    'Tax exemption denied.',
    {
      decision: 'rejected'
    }
  );
}

function denyTaxExemptSubmission(payload) {
  try {
    return denyTaxExemptSubmission_(payload);
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

function getCreditTermsTeamReview_(payload) {
  const ctx = buildAccountDocumentContext_(payload);
  if (!ctx || ctx.ok === false) return ctx;
  assertTeamModeAuthorized_(ctx, payload);
  const submissionEntry = getLatestAccountDocumentSubmission_(ctx, ACCOUNT_DOCUMENT_TYPES.credit_terms);
  if (!submissionEntry) {
    return { ok: false, error: 'No submitted credit terms document is available to review.' };
  }
  const artifactFileId = trimString_(submissionEntry.artifactFileId);
  if (!artifactFileId) {
    return { ok: false, error: 'The submitted credit terms document is unavailable.' };
  }
  const artifactFiles = getAccountDocumentSubmissionArtifactFiles_(submissionEntry);
  const primaryArtifact = artifactFiles[0] || {
    fileId: artifactFileId,
    fileUrl: trimString_(submissionEntry.artifactUrl),
    fileName: trimString_(submissionEntry.artifactName),
    mimeType: trimString_(submissionEntry.artifactMimeType),
    sizeBytes: Math.max(0, parseInt(String(submissionEntry.artifactSizeBytes || 0), 10) || 0)
  };
  const mimeType = trimString_(primaryArtifact.mimeType) || 'application/pdf';
  const isImage = /^image\//i.test(mimeType);
  const imageAssets = artifactFiles
    .filter(function(item) { return /^image\//i.test(trimString_(item.mimeType)); })
    .map(function(item, index) {
      return {
        fileId: trimString_(item.fileId),
        fileName: trimString_(item.fileName) || ('Credit-Terms-Image-' + (index + 1) + '.png'),
        fileUrl: trimString_(item.fileUrl) || buildDriveFileViewUrl_(item.fileId),
        downloadUrl: buildDriveFileDownloadUrl_(item.fileId),
        imageCandidates: buildDriveFilePublicImageCandidates_(item.fileId)
      };
    });
  const accountSummary = ctx && ctx.accountInfo && ctx.accountInfo.summary ? ctx.accountInfo.summary : {};
  return buildAccountDocumentWorkflowResponse_(
    ctx,
    ACCOUNT_DOCUMENT_TYPES.credit_terms,
    'Credit terms review artifact ready.',
    {
      reviewArtifact: {
        fileId: artifactFileId,
        fileName: trimString_(primaryArtifact.fileName) || 'Credit-Terms-Submission.pdf',
        mimeType: mimeType,
        fileUrl: trimString_(primaryArtifact.fileUrl) || buildDriveFileViewUrl_(artifactFileId),
        previewUrl: buildDriveFilePreviewUrl_(artifactFileId),
        imageUrl: isImage ? buildDriveFilePublicViewAssetUrl_(artifactFileId) : '',
        imageCandidates: isImage ? buildDriveFilePublicImageCandidates_(artifactFileId) : [],
        imageAssets: imageAssets,
        downloadUrl: buildDriveFileDownloadUrl_(artifactFileId),
        submittedAt: trimString_(submissionEntry.submittedAt),
        submittedByName: trimString_(submissionEntry.submittedByName),
        submittedByEmail: normalizeEmail_(submissionEntry.submittedByEmail),
        orgName: trimString_(accountSummary.orgName)
      },
      paymentTermOptions: getApprovedPaymentTermsOptions_(),
      approvedPaymentTerms: {
        code: trimString_(accountSummary.approvedPaymentTermsCode),
        label: trimString_(accountSummary.approvedPaymentTermsLabel),
        days: Math.max(0, parseInt(String(accountSummary.approvedPaymentTermsDays || 0), 10) || 0),
        notes: trimString_(accountSummary.approvedPaymentTermsNotes)
      }
    }
  );
}

function getCreditTermsTeamReview(payload) {
  try {
    return getCreditTermsTeamReview_(payload);
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

function approveCreditTermsSubmission_(payload) {
  const ctx = buildAccountDocumentContext_(payload);
  if (!ctx || ctx.ok === false) return ctx;
  assertTeamModeAuthorized_(ctx, payload);
  const submissionEntry = getLatestAccountDocumentSubmission_(ctx, ACCOUNT_DOCUMENT_TYPES.credit_terms);
  if (!submissionEntry) return { ok: false, error: 'No submitted credit terms document is available to approve.' };
  const paymentTermsSelection = buildApprovedPaymentTermsSelection_(payload);
  const decisionEntry = buildCreditTermsDecisionEntry_('approved', ctx, payload);
  persistCreditTermsDecision_(ctx, decisionEntry, {
    paymentTermsSelection: paymentTermsSelection
  });
  let warnings = [];
  try {
    sendApprovedCreditTermsEmail_(ctx, submissionEntry, paymentTermsSelection);
  } catch (notifyErr) {
    warnings = [String((notifyErr && notifyErr.message) || notifyErr)];
  }
  return buildAccountDocumentWorkflowResponse_(
    ctx,
    ACCOUNT_DOCUMENT_TYPES.credit_terms,
    'Credit terms approved and payment terms assigned.',
    {
      decision: 'approved',
      approvedPaymentTerms: paymentTermsSelection,
      warnings: warnings
    }
  );
}

function approveCreditTermsSubmission(payload) {
  try {
    return approveCreditTermsSubmission_(payload);
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

function denyCreditTermsSubmission_(payload) {
  const ctx = buildAccountDocumentContext_(payload);
  if (!ctx || ctx.ok === false) return ctx;
  assertTeamModeAuthorized_(ctx, payload);
  const reason = trimString_(payload && payload.reason);
  if (!reason) return { ok: false, error: 'Enter a reason before requesting changes.' };
  const submissionEntry = getLatestAccountDocumentSubmission_(ctx, ACCOUNT_DOCUMENT_TYPES.credit_terms);
  if (!submissionEntry) return { ok: false, error: 'No submitted credit terms document is available to review.' };
  const decisionEntry = buildCreditTermsDecisionEntry_('rejected', ctx, payload);
  persistCreditTermsDecision_(ctx, decisionEntry);
  try {
    sendCreditTermsDenialEmail_(ctx, submissionEntry, reason);
  } catch (_) {}
  return buildAccountDocumentWorkflowResponse_(
    ctx,
    ACCOUNT_DOCUMENT_TYPES.credit_terms,
    'Credit terms changes requested.',
    {
      decision: 'rejected'
    }
  );
}

function denyCreditTermsSubmission(payload) {
  try {
    return denyCreditTermsSubmission_(payload);
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

function requestTermsEnrollment_(payload) {
  const ctx = buildAccountDocumentContext_(payload);
  if (!ctx || ctx.ok === false) return ctx;
  return buildAccountDocumentWorkflowResponse_(
    ctx,
    ACCOUNT_DOCUMENT_TYPES.credit_terms,
    'Credit terms workflow is ready. View the blank document, email it to another department, and upload the completed signed copy for Red Threads review.'
  );
}

function requestTermsEnrollment(payload) {
  try {
    return requestTermsEnrollment_(payload);
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

function requestTaxExemptSubmission_(payload) {
  const ctx = buildAccountDocumentContext_(payload);
  if (!ctx || ctx.ok === false) return ctx;
  return buildAccountDocumentWorkflowResponse_(
    ctx,
    ACCOUNT_DOCUMENT_TYPES.tax_exempt,
    'Tax exemption workflow is ready. Submit either the guided form or a completed certificate for review.'
  );
}

function requestTaxExemptSubmission(payload) {
  try {
    return requestTaxExemptSubmission_(payload);
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

function getTaxExemptWorkspace_(payload) {
  const ctx = buildAccountDocumentContext_(payload);
  if (!ctx || ctx.ok === false) return ctx;
  const definition = getAccountDocumentDefinition_(ACCOUNT_DOCUMENT_TYPES.tax_exempt, ctx.cfg);
  if (!definition) return { ok: false, error: 'Tax exemption document is not configured.' };
  return buildAccountDocumentWorkflowResponse_(
    ctx,
    ACCOUNT_DOCUMENT_TYPES.tax_exempt,
    'Tax exemption workspace ready.',
    {
      sourceDocumentData: buildAccountDocumentSourceDataPayload_(definition)
    }
  );
}

function getTaxExemptWorkspace(payload) {
  try {
    return getTaxExemptWorkspace_(payload);
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

function getTaxFormViewerAssets_(payload) {
  const ctx = buildAccountDocumentContext_(payload);
  if (!ctx || ctx.ok === false) return ctx;
  return buildAccountDocumentWorkflowResponse_(
    ctx,
    ACCOUNT_DOCUMENT_TYPES.tax_exempt,
    'Tax form viewer assets ready.',
    {
      pageImages: buildTaxFormViewerAssetsPayload_()
    }
  );
}

function getTaxFormViewerAssets(payload) {
  try {
    return getTaxFormViewerAssets_(payload);
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

function getCreditTermsViewerAssets_(payload) {
  const ctx = buildAccountDocumentContext_(payload);
  if (!ctx || ctx.ok === false) return ctx;
  return buildAccountDocumentWorkflowResponse_(
    ctx,
    ACCOUNT_DOCUMENT_TYPES.credit_terms,
    'Credit terms viewer assets ready.',
    {
      pageImages: buildCreditTermsViewerAssetsPayload_()
    }
  );
}

function getCreditTermsViewerAssets(payload) {
  try {
    return getCreditTermsViewerAssets_(payload);
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

function downloadAccountDocumentSource_(payload) {
  const ctx = buildAccountDocumentContext_(payload);
  if (!ctx || ctx.ok === false) return ctx;
  const definition = getAccountDocumentDefinition_(payload && payload.documentType, ctx.cfg);
  if (!definition) return { ok: false, error: 'Unsupported document type.' };
  return buildAccountDocumentWorkflowResponse_(
    ctx,
    definition.type,
    'Blank ' + definition.shortLabel.toLowerCase() + ' document ready.',
    {
      sourceDocumentData: buildAccountDocumentSourceDataPayload_(definition)
    }
  );
}

function downloadAccountDocumentSource(payload) {
  try {
    return downloadAccountDocumentSource_(payload);
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

function emailAccountDocumentSource_(payload) {
  const ctx = buildAccountDocumentContext_(payload);
  if (!ctx || ctx.ok === false) return ctx;
  const definition = getAccountDocumentDefinition_(payload && payload.documentType, ctx.cfg);
  if (!definition) return { ok: false, error: 'Unsupported document type.' };
  const recipients = normalizeEmailRecipients_(payload && payload.recipients);
  if (!recipients.length) return { ok: false, error: 'Enter at least one valid email address.' };
  sendAccountDocumentSourceEmail_(ctx, definition, recipients);
  recordAccountDocumentBlankEmail_(ctx, definition.type, recipients);
  return buildAccountDocumentWorkflowResponse_(
    ctx,
    definition.type,
    'Blank ' + definition.shortLabel.toLowerCase() + ' document emailed successfully.',
    { recipients: recipients }
  );
}

function emailAccountDocumentSource(payload) {
  try {
    return emailAccountDocumentSource_(payload);
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

function submitAccountDocumentUpload_(payload) {
  const ctx = buildAccountDocumentContext_(payload);
  if (!ctx || ctx.ok === false) return ctx;
  const definition = getAccountDocumentDefinition_(payload && payload.documentType, ctx.cfg);
  if (!definition) return { ok: false, error: 'Unsupported document type.' };

  const uploadInfos = decodeAccountDocumentUploads_(payload, definition, ctx);
  const uploadedFiles = uploadInfos.map(function(uploadInfo) {
    return createAccountDocumentDriveFile_(ctx, definition, uploadInfo);
  });
  const uploadedFile = uploadedFiles[0];
  const submissionEntry = buildAccountDocumentSubmissionEntry_(ctx, definition, {
    submissionSource: 'upload',
    artifactFileId: uploadedFile.fileId,
    artifactUrl: uploadedFile.fileUrl,
    artifactName: uploadedFile.fileName,
    artifactMimeType: uploadedFile.mimeType,
    artifactSizeBytes: uploadedFile.sizeBytes,
    artifactFiles: uploadedFiles,
    certificateNumber: definition.certificateNumberField ? trimString_(payload && payload.certificateNumber) : '',
    notes: trimString_(payload && payload.notes)
  });
  persistAccountDocumentSubmission_(ctx, definition.type, submissionEntry);
  let warnings = [];
  try {
    sendAccountDocumentSubmissionNotification_(ctx, definition, submissionEntry);
  } catch (notifyErr) {
    warnings = [String((notifyErr && notifyErr.message) || notifyErr)];
  }
  return buildAccountDocumentWorkflowResponse_(
    ctx,
    definition.type,
    definition.shortLabel + ' document' + (uploadedFiles.length > 1 ? 's' : '') + ' submitted for Red Threads review.',
    {
      uploadedDocumentUrl: uploadedFile.fileUrl,
      warnings: warnings
    }
  );
}

function submitAccountDocumentUpload(payload) {
  try {
    return submitAccountDocumentUpload_(payload);
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

function submitTaxExemptGuidedSubmission_(payload) {
  const ctx = buildAccountDocumentContext_(payload);
  if (!ctx || ctx.ok === false) return ctx;
  const definition = getAccountDocumentDefinition_(ACCOUNT_DOCUMENT_TYPES.tax_exempt, ctx.cfg);
  const formData = sanitizeTaxExemptGuidedForm_((payload && payload.formData) || payload, ctx);
  const renderedArtifactUpload = decodeTaxExemptRenderedArtifact_(payload, definition, ctx);
  const artifact = renderedArtifactUpload
    ? createAccountDocumentDriveFile_(ctx, definition, renderedArtifactUpload)
    : generateTaxExemptGuidedArtifact_(ctx, formData);
  const submissionEntry = buildAccountDocumentSubmissionEntry_(ctx, definition, {
    submissionSource: 'guided',
    artifactFileId: artifact.fileId,
    artifactUrl: artifact.fileUrl,
    artifactName: artifact.fileName,
    artifactMimeType: artifact.mimeType,
    artifactSizeBytes: artifact.sizeBytes,
    certificateNumber: formData.certificateNumber,
    notes: formData.additionalNotes,
    guidedFormData: formData
  });
  persistAccountDocumentSubmission_(ctx, definition.type, submissionEntry);
  let warnings = [];
  try {
    sendAccountDocumentSubmissionNotification_(ctx, definition, submissionEntry);
  } catch (notifyErr) {
    warnings = [String((notifyErr && notifyErr.message) || notifyErr)];
  }
  return buildAccountDocumentWorkflowResponse_(
    ctx,
    definition.type,
    'Tax exemption submission sent to Red Threads for review.',
    {
      artifactFileId: artifact.fileId,
      uploadedDocumentUrl: artifact.fileUrl,
      warnings: warnings
    }
  );
}

function submitTaxExemptGuidedSubmission(payload) {
  try {
    return submitTaxExemptGuidedSubmission_(payload);
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

function emailTaxExemptSubmissionCopy_(payload) {
  const ctx = buildAccountDocumentContext_(payload);
  if (!ctx || ctx.ok === false) return ctx;
  const artifactFileId = trimString_(payload && payload.artifactFileId);
  if (!artifactFileId) return { ok: false, error: 'Submitted document copy is not available yet.' };
  const file = getDriveFileByIdSafe_(artifactFileId);
  if (!file) return { ok: false, error: 'Submitted document copy could not be loaded.' };
  const recipients = normalizeEmailRecipients_((payload && payload.recipients) || [
    ctx.identity && ctx.identity.personEmail,
    ctx.accountInfo && ctx.accountInfo.summary && ctx.accountInfo.summary.billingContactEmail,
    ctx.accountInfo && ctx.accountInfo.summary && ctx.accountInfo.summary.primaryEmail
  ]);
  if (!recipients.length) return { ok: false, error: 'No recipient email is available for this account.' };
  const accountSummary = ctx.accountInfo && ctx.accountInfo.summary ? ctx.accountInfo.summary : {};
  const personName = trimString_(
    (ctx.identity && ctx.identity.personName) ||
    (accountSummary && accountSummary.billingContactName) ||
    (accountSummary && accountSummary.primaryContactName) ||
    ''
  );
  const firstName = trimString_(personName.split(/\s+/)[0]) || 'there';
  const subject = 'Copy of your completed tax exempt form';
  const body = [
    'Hi ' + firstName + ',',
    '',
    'Here is a completed copy of your form.',
    'Your form is under review by the Red Threads team, and you will get a notification when your form is approved.',
    '',
    'This is an automated message from an unmonitored inbox. Please do not reply or respond.',
    '',
    '- Red Threads Team'
  ].join('\n');
  const htmlBody = [
    '<div style="margin:0;padding:24px 0;background:#f4f6fb;">',
    '  <div style="max-width:640px;margin:0 auto;padding:32px 28px;background:#ffffff;border:1px solid #e6ebf3;border-radius:18px;font-family:Arial,sans-serif;color:#142033;">',
    '    <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#73829a;font-weight:700;margin-bottom:12px;">Red Threads</div>',
    '    <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;color:#142033;">Copy of your completed tax exempt form</h1>',
    '    <p style="margin:0 0 14px;font-size:16px;line-height:1.7;color:#35435a;">Hi ' + escapeHtml_(firstName) + ',</p>',
    '    <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#35435a;">Here is a completed copy of your form.</p>',
    '    <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#35435a;">Your form is under review by the Red Threads team, and you will get a notification when your form is approved.</p>',
    '    <p style="margin:18px 0 0;font-size:14px;line-height:1.7;color:#5f6f86;">📩 This is an automated message from an unmonitored inbox. Please do not reply or respond.</p>',
    '    <p style="margin:12px 0 0;font-size:14px;line-height:1.7;color:#142033;font-weight:700;">- Red Threads Team</p>',
    '  </div>',
    '</div>'
  ].join('\n');
  sendNotificationEmail_({
    toList: recipients,
    subject: subject,
    body: body,
    htmlBody: htmlBody,
    attachments: [file.getBlob().setName(sanitizeUploadedDocumentName_(file.getName(), 'Michigan-Tax-Exemption-Submission'))]
  });
  return buildAccountDocumentWorkflowResponse_(
    ctx,
    ACCOUNT_DOCUMENT_TYPES.tax_exempt,
    'Submitted document copy emailed successfully.',
    {
      recipients: recipients
    }
  );
}

function sendApprovedTaxExemptEmail_(ctx, submissionEntry) {
  const artifactFileId = trimString_(submissionEntry && submissionEntry.artifactFileId);
  if (!artifactFileId) return { ok: false, skipped: true, reason: 'missing-artifact' };
  const file = getDriveFileByIdSafe_(artifactFileId);
  if (!file) return { ok: false, skipped: true, reason: 'missing-file' };
  const accountSummary = ctx && ctx.accountInfo && ctx.accountInfo.summary ? ctx.accountInfo.summary : {};
  const recipients = normalizeEmailRecipients_([
    submissionEntry && submissionEntry.submittedByEmail,
    accountSummary.billingContactEmail,
    accountSummary.primaryEmail,
    ctx && ctx.identity && ctx.identity.personEmail
  ]);
  if (!recipients.length) return { ok: false, skipped: true, reason: 'missing-email' };
  const personName = trimString_(
    (submissionEntry && submissionEntry.submittedByName) ||
    (ctx && ctx.identity && ctx.identity.personName) ||
    accountSummary.billingContactName ||
    accountSummary.primaryContactName ||
    ''
  );
  const firstName = trimString_(personName.split(/\s+/)[0]) || 'there';
  const subject = 'Copy of your completed tax exempt form + Quick Guidelines';
  const body = [
    'Hi ' + firstName + ',',
    '',
    'Congratulations, your tax exempt form has been approved for use for purchases within Red Threads LLC.',
    '',
    'Thanks for completing your Michigan Sales Tax Exemption Form!',
    'Attached is a copy for your records.',
    '',
    'Before using this exemption, here are a few quick things to keep in mind:',
    '',
    'When exemption typically applies:',
    '- Purchases made for resale',
    '- Government entities making direct purchases',
    '- Qualified organizations purchasing items for an exempt purpose (not end use)',
    '',
    'When exemption typically does NOT apply:',
    '- Items used for giveaways, promotions, or fundraising distribution',
    '- Purchases for staff, members, or internal use',
    '- When you are the final user of the product',
    '',
    'Important:',
    'It is your responsibility to determine whether your purchase qualifies for sales tax exemption. By submitting this form, you certify that your use complies with applicable tax laws.',
    '',
    'Red Threads LLC does not provide tax or legal advice. If you\'re unsure, please consult your accountant or tax professional.',
    '',
    'This is an automated message from an unmonitored inbox. Please do not reply or respond.',
    '',
    '- Red Threads Team'
  ].join('\n');
  const htmlBody = [
    '<div style="margin:0;padding:24px 0;background:#f4f6fb;">',
    '  <div style="max-width:640px;margin:0 auto;padding:32px 28px;background:#ffffff;border:1px solid #e6ebf3;border-radius:18px;font-family:Arial,sans-serif;color:#142033;">',
    '    <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#73829a;font-weight:700;margin-bottom:12px;">Red Threads</div>',
    '    <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;color:#142033;">Copy of your completed tax exempt form + Quick Guidelines</h1>',
    '    <p style="margin:0 0 14px;font-size:16px;line-height:1.7;color:#35435a;">Hi ' + escapeHtml_(firstName) + ',</p>',
    '    <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#166534;font-weight:800;">Congratulations, your tax exempt form has been approved for use for purchases within Red Threads LLC.</p>',
    '    <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#35435a;">Thanks for completing your Michigan Sales Tax Exemption Form! Attached is a copy for your records.</p>',
    '    <p style="margin:0 0 14px;font-size:16px;line-height:1.7;color:#35435a;">Before using this exemption, here are a few quick things to keep in mind:</p>',
    '    <div style="margin:0 0 16px;padding:14px 16px;border-radius:14px;background:#f8fafc;border:1px solid #e2e8f0;">',
    '      <div style="margin:0 0 8px;font-size:15px;line-height:1.5;color:#166534;font-weight:800;">✅ When exemption typically applies:</div>',
    '      <ul style="margin:0;padding-left:20px;color:#35435a;font-size:15px;line-height:1.7;">',
    '        <li>Purchases made for resale</li>',
    '        <li>Government entities making direct purchases</li>',
    '        <li>Qualified organizations purchasing items for an exempt purpose (not end use)</li>',
    '      </ul>',
    '    </div>',
    '    <div style="margin:0 0 16px;padding:14px 16px;border-radius:14px;background:#fff7f7;border:1px solid #fecdd3;">',
    '      <div style="margin:0 0 8px;font-size:15px;line-height:1.5;color:#be123c;font-weight:800;">❌ When exemption typically does NOT apply:</div>',
    '      <ul style="margin:0;padding-left:20px;color:#35435a;font-size:15px;line-height:1.7;">',
    '        <li>Items used for giveaways, promotions, or fundraising distribution</li>',
    '        <li>Purchases for staff, members, or internal use</li>',
    '        <li>When you are the final user of the product</li>',
    '      </ul>',
    '    </div>',
    '    <div style="margin:0 0 16px;padding:14px 16px;border-radius:14px;background:#fffaf0;border:1px solid #fde68a;">',
    '      <div style="margin:0 0 8px;font-size:15px;line-height:1.5;color:#92400e;font-weight:800;">⚠️ Important:</div>',
    '      <p style="margin:0 0 10px;font-size:15px;line-height:1.7;color:#35435a;">It is your responsibility to determine whether your purchase qualifies for sales tax exemption. By submitting this form, you certify that your use complies with applicable tax laws.</p>',
    '      <p style="margin:0;font-size:15px;line-height:1.7;color:#35435a;">Red Threads LLC does not provide tax or legal advice. If you\'re unsure, please consult your accountant or tax professional.</p>',
    '    </div>',
    '    <p style="margin:18px 0 0;font-size:14px;line-height:1.7;color:#5f6f86;">📩 This is an automated message from an unmonitored inbox. Please do not reply or respond.</p>',
    '    <p style="margin:12px 0 0;font-size:14px;line-height:1.7;color:#142033;font-weight:700;">- Red Threads Team</p>',
    '  </div>',
    '</div>'
  ].join('\n');
  return sendNotificationEmail_({
    toList: recipients,
    subject: subject,
    body: body,
    htmlBody: htmlBody,
    attachments: [file.getBlob().setName(sanitizeUploadedDocumentName_(file.getName(), 'Michigan-Tax-Exemption-Submission'))]
  });
}

function emailTaxExemptSubmissionCopy(payload) {
  try {
    return emailTaxExemptSubmissionCopy_(payload);
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

function generateInvoice(payload) {
  try {
    const ctx = buildOrderActionContext_(payload);
    const latestOrder = getLatestPortalOrderByToken_(ctx.orderDraft.token, {
      cfg: ctx.cfg,
      ss: ctx.ss,
      ordersSheet: ctx.infra.ordersSheet
    });
    const source = latestOrder ? latestOrder.rowObjNormalized : ctx.orderDraft;
    const invoice = generateInvoiceDocumentForOrder_(source, { cfg: ctx.cfg });
    return { ok: true, invoice: invoice };
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

/* ---------------- Order Finalization + Admin Transition Helpers ---------------- */

function adminMarkManualPaymentReceived_(payload) {
  const p = (payload && typeof payload === 'object') ? payload : {};
  const token = trimString_(p.token);
  if (!token) throw new Error('Missing token.');
  const cfg = getConfig_();
  const ss = SpreadsheetApp.openById(cfg.sheetId);
  const infra = ensurePortalInfrastructure_(ss, cfg);
  const rowInfo = findRowByToken_(infra.exportSheet, token);
  if (!rowInfo) throw new Error('Token not found.');
  const orderInfo = getLatestPortalOrderByToken_(token, { cfg: cfg, ss: ss, ordersSheet: infra.ordersSheet });
  if (!orderInfo) throw new Error('Order not found.');
  const now = nowIso_();
  const updatedOrder = updatePortalOrderState_({
    cfg: cfg,
    ss: ss,
    infra: infra,
    orderRowInfo: orderInfo,
    portalLockState: PORTAL_LOCK_STATES.locked,
    orderState: ORDER_STATES.ready_for_production,
    paymentState: PAYMENT_STATES.manual_received,
    productionAuthorizationState: PRODUCTION_AUTHORIZATION_STATES.authorized,
    paidAt: now,
    authorizedToProduceAt: now,
    lockedAt: trimString_(orderInfo.rowObjNormalized.lockedat) || now,
    paymentReceivedManuallyBy: trimString_(p.actorName || p.actorEmail || 'Team'),
    paymentReceivedManuallyAt: now
  });
  const updatedSummary = buildPortalOrderSummary_(updatedOrder.rowObjNormalized);
  writeCurrentOrderPointersToExportLog_({
    cfg: cfg,
    ss: ss,
    infra: infra,
    rowInfo: rowInfo,
    orderSummary: updatedSummary,
    accountSummary: getAccountStatus({ token: token }).accountSummary,
    status: 'submitted'
  });
  finalizePortalAfterPayment({
    token: token,
    portalState: safeJsonParse_(rowInfo.rowObjNormalized.portalstatejson, {}) || { printJobs: {} },
    submittedAt: now,
    systemMessage: 'Manual payment received. Order authorized for production on ' + now + '.'
  });
  return {
    ok: true,
    orderSummary: updatedSummary,
    portalPayload: refreshPortalPayloadForToken_(token, { cfg: cfg, ss: ss, infra: infra })
  };
}

function adminMarkManualPaymentReceived(payload) {
  try {
    return adminMarkManualPaymentReceived_(payload);
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

function adminMarkPurchaseOrderReceived_(payload) {
  const p = (payload && typeof payload === 'object') ? payload : {};
  const token = trimString_(p.token);
  if (!token) throw new Error('Missing token.');
  const cfg = getConfig_();
  const ss = SpreadsheetApp.openById(cfg.sheetId);
  const infra = ensurePortalInfrastructure_(ss, cfg);
  const rowInfo = findRowByToken_(infra.exportSheet, token);
  if (!rowInfo) throw new Error('Token not found.');
  const orderInfo = getLatestPortalOrderByToken_(token, { cfg: cfg, ss: ss, ordersSheet: infra.ordersSheet });
  if (!orderInfo) throw new Error('Order not found.');
  const now = nowIso_();
  const updatedOrder = updatePortalOrderState_({
    cfg: cfg,
    ss: ss,
    infra: infra,
    orderRowInfo: orderInfo,
    portalLockState: PORTAL_LOCK_STATES.locked,
    orderState: ORDER_STATES.ready_for_production,
    paymentState: trimString_(orderInfo.rowObjNormalized.paymentstate) || PAYMENT_STATES.not_started,
    productionAuthorizationState: PRODUCTION_AUTHORIZATION_STATES.authorized,
    authorizedToProduceAt: now,
    lockedAt: trimString_(orderInfo.rowObjNormalized.lockedat) || now,
    poSubmittedBy: trimString_(p.actorName || p.actorEmail || 'Team'),
    poSubmittedAt: now
  });
  const updatedSummary = buildPortalOrderSummary_(updatedOrder.rowObjNormalized);
  writeCurrentOrderPointersToExportLog_({
    cfg: cfg,
    ss: ss,
    infra: infra,
    rowInfo: rowInfo,
    orderSummary: updatedSummary,
    accountSummary: getAccountStatus({ token: token }).accountSummary,
    status: 'submitted'
  });
  finalizePortalAfterPayment({
    token: token,
    portalState: safeJsonParse_(rowInfo.rowObjNormalized.portalstatejson, {}) || { printJobs: {} },
    submittedAt: now,
    systemMessage: 'Purchase order received. Order authorized for production on ' + now + '.'
  });
  return {
    ok: true,
    orderSummary: updatedSummary,
    portalPayload: refreshPortalPayloadForToken_(token, { cfg: cfg, ss: ss, infra: infra })
  };
}

function adminMarkPoReceived(payload) {
  try {
    return adminMarkPurchaseOrderReceived_(payload);
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

function beginInternalOrderAdjustment_(payload) {
  const p = (payload && typeof payload === 'object') ? payload : {};
  const token = trimString_(p.token);
  if (!token) throw new Error('Missing token.');
  const cfg = getConfig_();
  const ss = SpreadsheetApp.openById(cfg.sheetId);
  const infra = ensurePortalInfrastructure_(ss, cfg);
  const latestOrder = getLatestPortalOrderByToken_(token, { cfg: cfg, ss: ss, ordersSheet: infra.ordersSheet });
  if (!latestOrder) throw new Error('Order not found.');
  const next = appendPortalOrderRevision_({
    cfg: cfg,
    ss: ss,
    infra: infra,
    existingOrderRowInfo: latestOrder,
    token: token,
    orderDraft: safeJsonParse_(latestOrder.rowObjNormalized.orderdraftjson, {}),
    portalLockState: trimString_(latestOrder.rowObjNormalized.portallockstate) || PORTAL_LOCK_STATES.locked,
    orderState: ORDER_STATES.draft,
    paymentState: trimString_(latestOrder.rowObjNormalized.paymentstate) || PAYMENT_STATES.not_started,
    productionAuthorizationState: trimString_(latestOrder.rowObjNormalized.productionauthorizationstate) || PRODUCTION_AUTHORIZATION_STATES.not_authorized,
    clientReapprovalRequired: true,
    revisionReason: trimString_(p.revisionReason || 'Internal adjustment initiated'),
    notes: trimString_(p.notes)
  });
  return {
    ok: true,
    orderSummary: next.summary,
    message: 'Internal adjustment foundation record created. Team-mode editing hooks can build on this revision path next.'
  };
}

function beginInternalOrderAdjustment(payload) {
  try {
    return beginInternalOrderAdjustment_(payload);
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

function extractStripeMetadataValue_(obj, key) {
  if (!obj || typeof obj !== 'object') return '';
  const meta = obj.metadata && typeof obj.metadata === 'object' ? obj.metadata : {};
  return trimString_(meta[key]);
}

function handleCheckoutSessionCompleted_(sessionObj) {
  const token = extractStripeMetadataValue_(sessionObj, 'token');
  const checkoutAttemptId = extractStripeMetadataValue_(sessionObj, 'checkoutAttemptId');
  const paymentMethodSelected = extractStripeMetadataValue_(sessionObj, 'paymentMethodSelected') || PAYMENT_METHODS.card;
  const cfg = getConfig_();
  const ss = SpreadsheetApp.openById(cfg.sheetId);
  const infra = ensurePortalInfrastructure_(ss, cfg);
  const orderInfo = getPortalOrderByCheckoutAttemptId_(checkoutAttemptId, { cfg: cfg, ss: ss, ordersSheet: infra.ordersSheet }) ||
    getPortalOrderByStripeSessionId_(trimString_(sessionObj && sessionObj.id), { cfg: cfg, ss: ss, ordersSheet: infra.ordersSheet });
  if (!orderInfo) return { ok: false, error: 'Order not found for checkout session.' };
  const now = nowIso_();
  const delayed = paymentMethodSelected === PAYMENT_METHODS.ach || trimString_(sessionObj && sessionObj.payment_status).toLowerCase() !== 'paid';
  const currentDraft = safeJsonParse_(orderInfo.rowObjNormalized.orderdraftjson, {}) || {};
  const nextDraft = mergeOrderDraftShippingDetails_(currentDraft, sessionObj);
  const updatedOrder = updatePortalOrderState_({
    cfg: cfg,
    ss: ss,
    infra: infra,
    orderRowInfo: orderInfo,
    orderDraft: nextDraft,
    stripeSessionId: trimString_(sessionObj && sessionObj.id),
    stripePaymentIntentId: trimString_(sessionObj && sessionObj.payment_intent),
    portalLockState: PORTAL_LOCK_STATES.locked,
    paymentMethodSelected: paymentMethodSelected,
    paymentState: delayed ? PAYMENT_STATES.pending : PAYMENT_STATES.paid,
    orderState: delayed ? ORDER_STATES.awaiting_payment_confirmation : ORDER_STATES.ready_for_production,
    productionAuthorizationState: delayed ? PRODUCTION_AUTHORIZATION_STATES.not_authorized : PRODUCTION_AUTHORIZATION_STATES.authorized,
    lockedAt: trimString_(orderInfo.rowObjNormalized.lockedat) || now,
    paidAt: delayed ? '' : now,
    authorizedToProduceAt: delayed ? '' : now
  });
  const orderSummary = buildPortalOrderSummary_(updatedOrder.rowObjNormalized);
  const rowInfo = findRowByToken_(infra.exportSheet, token || trimString_(orderInfo.rowObjNormalized.token));
  if (rowInfo) {
    const accountSummary = getAccountStatus({ token: trimString_(rowInfo.rowObjNormalized.token) }).accountSummary;
    writeCurrentOrderPointersToExportLog_({
      cfg: cfg,
      ss: ss,
      infra: infra,
      rowInfo: rowInfo,
      orderSummary: orderSummary,
      accountSummary: accountSummary,
      status: delayed ? 'locked' : 'submitted'
    });
    setPortalClientLockForRow_(infra.exportSheet, rowInfo, true, {
      token: trimString_(rowInfo.rowObjNormalized.token)
    });
    if (!delayed) {
      finalizePortalAfterPayment({
        token: trimString_(rowInfo.rowObjNormalized.token),
        portalState: safeJsonParse_(rowInfo.rowObjNormalized.portalstatejson, {}) || { printJobs: {} },
        submittedAt: now,
        systemMessage: 'Order placed successfully on ' + now + '.'
      });
    }
  }
  return { ok: true, delayed: delayed, orderSummary: orderSummary };
}

function handleCheckoutAsyncPaymentSucceeded_(sessionObj) {
  const token = extractStripeMetadataValue_(sessionObj, 'token');
  const checkoutAttemptId = extractStripeMetadataValue_(sessionObj, 'checkoutAttemptId');
  const cfg = getConfig_();
  const ss = SpreadsheetApp.openById(cfg.sheetId);
  const infra = ensurePortalInfrastructure_(ss, cfg);
  const orderInfo = getPortalOrderByCheckoutAttemptId_(checkoutAttemptId, { cfg: cfg, ss: ss, ordersSheet: infra.ordersSheet }) ||
    getPortalOrderByStripeSessionId_(trimString_(sessionObj && sessionObj.id), { cfg: cfg, ss: ss, ordersSheet: infra.ordersSheet });
  if (!orderInfo) return { ok: false, error: 'Order not found for async success.' };
  const now = nowIso_();
  const currentDraft = safeJsonParse_(orderInfo.rowObjNormalized.orderdraftjson, {}) || {};
  const nextDraft = mergeOrderDraftShippingDetails_(currentDraft, sessionObj);
  const updatedOrder = updatePortalOrderState_({
    cfg: cfg,
    ss: ss,
    infra: infra,
    orderRowInfo: orderInfo,
    orderDraft: nextDraft,
    stripeSessionId: trimString_(sessionObj && sessionObj.id),
    stripePaymentIntentId: trimString_(sessionObj && sessionObj.payment_intent),
    portalLockState: PORTAL_LOCK_STATES.locked,
    paymentState: PAYMENT_STATES.paid,
    orderState: ORDER_STATES.ready_for_production,
    productionAuthorizationState: PRODUCTION_AUTHORIZATION_STATES.authorized,
    lockedAt: trimString_(orderInfo.rowObjNormalized.lockedat) || now,
    paidAt: now,
    authorizedToProduceAt: now
  });
  const rowInfo = findRowByToken_(infra.exportSheet, token || trimString_(orderInfo.rowObjNormalized.token));
  if (rowInfo) {
    writeCurrentOrderPointersToExportLog_({
      cfg: cfg,
      ss: ss,
      infra: infra,
      rowInfo: rowInfo,
      orderSummary: buildPortalOrderSummary_(updatedOrder.rowObjNormalized),
      accountSummary: getAccountStatus({ token: trimString_(rowInfo.rowObjNormalized.token) }).accountSummary,
      status: 'submitted'
    });
    finalizePortalAfterPayment({
      token: trimString_(rowInfo.rowObjNormalized.token),
      portalState: safeJsonParse_(rowInfo.rowObjNormalized.portalstatejson, {}) || { printJobs: {} },
      submittedAt: now,
      systemMessage: 'ACH payment cleared on ' + now + '. Order authorized for production.'
    });
  }
  return { ok: true };
}

function handleCheckoutAsyncPaymentFailed_(sessionObj) {
  const checkoutAttemptId = extractStripeMetadataValue_(sessionObj, 'checkoutAttemptId');
  const cfg = getConfig_();
  const ss = SpreadsheetApp.openById(cfg.sheetId);
  const infra = ensurePortalInfrastructure_(ss, cfg);
  const orderInfo = getPortalOrderByCheckoutAttemptId_(checkoutAttemptId, { cfg: cfg, ss: ss, ordersSheet: infra.ordersSheet }) ||
    getPortalOrderByStripeSessionId_(trimString_(sessionObj && sessionObj.id), { cfg: cfg, ss: ss, ordersSheet: infra.ordersSheet });
  if (!orderInfo) return { ok: false, error: 'Order not found for async failure.' };
  const updatedOrder = updatePortalOrderState_({
    cfg: cfg,
    ss: ss,
    infra: infra,
    orderRowInfo: orderInfo,
    paymentState: PAYMENT_STATES.failed,
    orderState: ORDER_STATES.awaiting_payment_confirmation,
    productionAuthorizationState: PRODUCTION_AUTHORIZATION_STATES.not_authorized,
    notes: 'Stripe async payment failed.'
  });
  const token = trimString_(orderInfo.rowObjNormalized.token);
  const rowInfo = findRowByToken_(infra.exportSheet, token);
  if (rowInfo) {
    writeCurrentOrderPointersToExportLog_({
      cfg: cfg,
      ss: ss,
      infra: infra,
      rowInfo: rowInfo,
      orderSummary: buildPortalOrderSummary_(updatedOrder.rowObjNormalized),
      accountSummary: getAccountStatus({ token: token }).accountSummary,
      status: 'locked'
    });
  }
  return { ok: true };
}

function handlePaymentIntentFailed_(paymentIntentObj) {
  const paymentIntentId = trimString_(paymentIntentObj && paymentIntentObj.id);
  if (!paymentIntentId) return { ok: false, error: 'Missing payment intent id.' };
  const cfg = getConfig_();
  const ss = SpreadsheetApp.openById(cfg.sheetId);
  const infra = ensurePortalInfrastructure_(ss, cfg);
  const orderInfo = listSheetRowInfos_(infra.ordersSheet)
    .find((info) => trimString_(info.rowObjNormalized.stripepaymentintentid) === paymentIntentId) || null;
  if (!orderInfo) return { ok: false, error: 'Order not found for payment intent.' };
  const updatedOrder = updatePortalOrderState_({
    cfg: cfg,
    ss: ss,
    infra: infra,
    orderRowInfo: orderInfo,
    paymentState: PAYMENT_STATES.failed,
    orderState: ORDER_STATES.awaiting_payment_confirmation,
    productionAuthorizationState: PRODUCTION_AUTHORIZATION_STATES.not_authorized,
    notes: 'Stripe payment intent failed.'
  });
  const token = trimString_(orderInfo.rowObjNormalized.token);
  const rowInfo = findRowByToken_(infra.exportSheet, token);
  if (rowInfo) {
    writeCurrentOrderPointersToExportLog_({
      cfg: cfg,
      ss: ss,
      infra: infra,
      rowInfo: rowInfo,
      orderSummary: buildPortalOrderSummary_(updatedOrder.rowObjNormalized),
      accountSummary: getAccountStatus({ token: token }).accountSummary,
      status: 'locked'
    });
  }
  return { ok: true };
}

/* ---------------- Stripe Event Processing + Portal Finalization ---------------- */

function processStripeEventPayload_(eventPayload) {
  const eventObj = (eventPayload && typeof eventPayload === 'object') ? eventPayload : {};
  const type = trimString_(eventObj.type);
  const dataObject = eventObj.data && eventObj.data.object ? eventObj.data.object : null;
  if (!type || !dataObject) {
    return { ok: false, error: 'Invalid Stripe event payload.' };
  }

  // TODO: This processor is intentionally transport-agnostic so a future
  // verified Cloud Run forwarder can POST trusted event JSON into Apps Script.
  switch (type) {
    case 'checkout.session.completed':
      return handleCheckoutSessionCompleted_(dataObject);
    case 'checkout.session.async_payment_succeeded':
      return handleCheckoutAsyncPaymentSucceeded_(dataObject);
    case 'checkout.session.async_payment_failed':
      return handleCheckoutAsyncPaymentFailed_(dataObject);
    case 'payment_intent.payment_failed':
      return handlePaymentIntentFailed_(dataObject);
    default:
      return { ok: true, ignored: true, type: type };
  }
}

function resolveWebhookRoute_(e, payload) {
  const p = (payload && typeof payload === 'object') ? payload : {};
  const bodyRoute = trimString_(p.route);
  const queryRoute = trimString_(e && e.parameter && e.parameter.route);
  return trimString_(bodyRoute || queryRoute).toLowerCase();
}

function looksLikeStripeEventPayload_(value) {
  const obj = (value && typeof value === 'object') ? value : null;
  if (!obj) return false;
  if (!trimString_(obj.type)) return false;
  return !!(obj.data && obj.data.object && typeof obj.data.object === 'object');
}

function extractForwardedStripeEventPayload_(payload) {
  const p = (payload && typeof payload === 'object') ? payload : {};
  if (looksLikeStripeEventPayload_(p.stripeEvent)) return p.stripeEvent;
  if (looksLikeStripeEventPayload_(p.event)) return p.event;
  if (looksLikeStripeEventPayload_(p)) return p;
  return null;
}

function summarizeForwardedStripeEvent_(eventPayload) {
  const eventObj = (eventPayload && typeof eventPayload === 'object') ? eventPayload : {};
  const dataObject = eventObj.data && eventObj.data.object && typeof eventObj.data.object === 'object'
    ? eventObj.data.object
    : {};
  return {
    eventId: trimString_(eventObj.id),
    eventType: trimString_(eventObj.type),
    token: trimString_(
      extractStripeMetadataValue_(dataObject, 'token') ||
      dataObject.token ||
      dataObject.client_reference_id ||
      dataObject.clientReferenceId
    ),
    checkoutAttemptId: trimString_(
      extractStripeMetadataValue_(dataObject, 'checkoutAttemptId') ||
      dataObject.checkoutAttemptId
    )
  };
}

function logStripeWebhookIngress_(details) {
  try {
    const meta = (details && typeof details === 'object') ? details : {};
    console.log('[RT-STRIPE-WEBHOOK] ' + JSON.stringify(meta));
  } catch (_) {}
}

function processForwardedStripeWebhookPayload_(payload, options) {
  const p = (payload && typeof payload === 'object') ? payload : {};
  const opts = (options && typeof options === 'object') ? options : {};
  const cfg = getConfig_();
  const providedSecret = trimString_(
    p.sharedSecret ||
    p.forwardSharedSecret ||
    p.webhookForwardSharedSecret
  );
  const authPassed = !!cfg.stripeWebhookForwardSharedSecret && providedSecret === cfg.stripeWebhookForwardSharedSecret;
  const eventPayload = extractForwardedStripeEventPayload_(p);
  const summary = summarizeForwardedStripeEvent_(eventPayload || p.stripeEvent || p.event || {});

  logStripeWebhookIngress_({
    route: trimString_(opts.route).toLowerCase(),
    authPassed: authPassed,
    eventId: summary.eventId,
    eventType: summary.eventType,
    token: summary.token,
    checkoutAttemptId: summary.checkoutAttemptId
  });

  if (!authPassed) {
    return {
      ok: false,
      webhookProcessed: false,
      error: 'Unauthorized webhook forwarder payload.',
      eventType: summary.eventType || ''
    };
  }
  if (!eventPayload) {
    return {
      ok: false,
      webhookProcessed: false,
      error: 'Missing forwarded Stripe event payload.',
      eventType: summary.eventType || ''
    };
  }

  const result = processStripeEventPayload_(eventPayload);

  logStripeWebhookIngress_({
    route: trimString_(opts.route).toLowerCase(),
    authPassed: authPassed,
    eventId: summary.eventId,
    eventType: summary.eventType,
    token: summary.token,
    checkoutAttemptId: summary.checkoutAttemptId,
    result: {
      ok: !!(result && result.ok === true),
      ignored: !!(result && result.ignored === true),
      error: trimString_(result && result.error)
    }
  });

  if (!result || result.ok !== true) {
    return {
      ok: false,
      webhookProcessed: false,
      error: String((result && result.error) || 'Stripe webhook processing failed.'),
      eventId: summary.eventId || '',
      eventType: summary.eventType || '',
      token: summary.token || '',
      checkoutAttemptId: summary.checkoutAttemptId || ''
    };
  }

  return {
    ok: true,
    webhookProcessed: true,
    ignored: !!result.ignored,
    eventId: summary.eventId || '',
    eventType: summary.eventType || '',
    token: summary.token || '',
    checkoutAttemptId: summary.checkoutAttemptId || ''
  };
}

function verifyTeamModePassword(payload) {
  try {
    const p = (payload && typeof payload === 'object') ? payload : {};
    const token = String(p.token || '').trim();
    const password = String(p.password || '');
    if (!token || !password) {
      return { ok: false, error: 'Password is required.' };
    }

    const cfg = getConfig_();
    if (password !== String(cfg.teamModePassword || '')) {
      return { ok: false, error: 'Incorrect password.' };
    }

    const ss = SpreadsheetApp.openById(cfg.sheetId);
    const exportSheet = ensurePortalInfrastructure_(ss, cfg).exportSheet;
    if (!exportSheet) {
      return { ok: false, error: 'Auth configuration is incomplete.' };
    }

    const rowInfo = findRowByToken_(exportSheet, token);
    if (!rowInfo) {
      return { ok: false, error: 'Link not found.' };
    }

    return {
      ok: true,
      senderName: getVisibleTeamAuthorName_(rowInfo.rowObjNormalized),
      teamAuthKey: buildTeamModeAuthKey_(token, cfg)
    };
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

function buildTeamModeAuthKey_(token, cfg, options) {
  const id = trimString_(token);
  if (!id) return '';
  const config = cfg || getConfig_();
  const opts = (options && typeof options === 'object') ? options : {};
  const issuedAt = Math.max(0, parseInt(String(opts.issuedAt || Date.now()), 10) || Date.now());
  const payload = id + '|' + String(issuedAt);
  const secret = String(config.teamModePassword || '');
  const signature = Utilities.base64EncodeWebSafe(
    Utilities.computeHmacSha256Signature(payload, secret)
  ).replace(/=+$/g, '');
  return String(issuedAt) + '.' + signature;
}

function validateTeamModeAuthKey_(token, authKey, cfg) {
  const id = trimString_(token);
  const key = trimString_(authKey);
  if (!id || !key) return false;
  const parts = key.split('.');
  if (parts.length !== 2) return false;
  const issuedAt = Math.max(0, parseInt(String(parts[0] || 0), 10) || 0);
  const signature = trimString_(parts[1]);
  if (!issuedAt || !signature) return false;
  if ((Date.now() - issuedAt) > TEAM_MODE_AUTH_TTL_MS) return false;
  return buildTeamModeAuthKey_(id, cfg, { issuedAt: issuedAt }) === key;
}

function assertTeamModeAuthorized_(ctx, payload) {
  const token = trimString_(
    payload && payload.token ||
    ctx && ctx.exportRowInfo && ctx.exportRowInfo.rowObjNormalized && ctx.exportRowInfo.rowObjNormalized.token
  );
  if (!token) {
    throw new Error('Team review link is missing.');
  }
  const authKey = trimString_(payload && payload.teamAuthKey);
  if (!validateTeamModeAuthKey_(token, authKey, ctx && ctx.cfg)) {
    throw new Error('Team authorization expired. Re-enter the team password and try again.');
  }
  return true;
}

function authSendResetCode(payload) {
  try {
    const p = (payload && typeof payload === 'object') ? payload : {};
    const email = normalizeEmail_(p.email);
    if (!email) return { ok: false, error: 'Email is required.' };

    const cfg = getConfig_();
    const ss = SpreadsheetApp.openById(cfg.sheetId);
    const infra = ensurePortalInfrastructure_(ss, cfg);
    const exportSheet = infra.exportSheet;
    const usersSheet = infra.usersSheet;
    if (!exportSheet || !usersSheet) return { ok: false, error: 'Auth configuration is incomplete.' };

    let user = findUserByEmail_(usersSheet, email);
    if (!user) {
      const allowed = emailExistsInExportLog_(exportSheet, email);
      if (!allowed) return { ok: false, error: 'No account found for that email.' };
      user = createUser_(usersSheet, email, '');
    }

    const now = Date.now();
    const existingExpires = parseIsoDateMs_(user.rowObjNormalized[AUTH_COLUMNS.USERS.resetCodeExpiresAt]);
    if (existingExpires > now) {
      const sentAt = existingExpires - AUTH_POLICY.RESET_CODE_TTL_MS;
      if ((now - sentAt) < AUTH_POLICY.RESET_RESEND_THROTTLE_MS) {
        return { ok: false, error: 'Please wait 30 seconds before requesting another code.' };
      }
    }

    const code = generateResetCode_();
    const expiresAt = new Date(now + AUTH_POLICY.RESET_CODE_TTL_MS).toISOString();
    updateUserResetCode_(usersSheet, user, code, expiresAt);

    const subject = 'Red Threads password reset code';
    const portalUrl = trimString_(getWebAppUrl_());
    const body = [
      'Your Red Threads reset code is: ' + code,
      '',
      'This code expires in 15 minutes.',
      '',
      'This inbox is not monitored.',
      portalUrl
        ? ('Please return to the portal to enter this code and continue: ' + portalUrl)
        : 'Please return to the Red Threads portal to enter this code and continue.',
      '',
      'If you did not request this, you can ignore this email.'
    ].join('\n');
    const htmlBody = [
      '<div style="margin:0;padding:24px 0;background:#f4f6fb;">',
      '  <div style="max-width:640px;margin:0 auto;padding:32px 28px;background:#ffffff;border:1px solid #e6ebf3;border-radius:18px;font-family:Arial,sans-serif;color:#142033;">',
      '    <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#73829a;font-weight:700;margin-bottom:12px;">Red Threads</div>',
      '    <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;color:#142033;">Password Reset Code</h1>',
      '    <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#35435a;">Use the code below to reset your portal password.</p>',
      '    <div style="margin:0 0 20px;padding:18px 20px;border-radius:14px;background:#0f1728;color:#ffffff;font-size:32px;line-height:1;font-weight:700;letter-spacing:0.28em;text-align:center;">' + escapeHtml_(code) + '</div>',
      '    <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#35435a;">This code expires in 15 minutes.</p>',
      portalUrl
        ? ('    <p style="margin:0 0 20px;"><a href="' + escapeHtml_(portalUrl) + '" style="display:inline-block;padding:14px 20px;border-radius:999px;background:#12b5ea;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;">Open Portal</a></p>')
        : '',
      '    <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#5f6f86;">This inbox is not monitored. Please use the portal link above to enter your code and continue.</p>',
      '    <p style="margin:0;font-size:14px;line-height:1.6;color:#5f6f86;">If you did not request this, you can ignore this email.</p>',
      '  </div>',
      '</div>'
    ].join('');
    sendNotificationEmail_({
      to: email,
      subject: subject,
      body: body,
      htmlBody: htmlBody
    });

    return { ok: true };
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

function authResetPassword(payload) {
  try {
    const p = (payload && typeof payload === 'object') ? payload : {};
    const email = normalizeEmail_(p.email);
    const code = String(p.code || '').trim();
    const newPassword = String(p.newPassword || '');

    if (!email || !code || !newPassword) {
      return { ok: false, error: 'Email, code, and new password are required.' };
    }

    const cfg = getConfig_();
    const ss = SpreadsheetApp.openById(cfg.sheetId);
    const usersSheet = ensurePortalInfrastructure_(ss, cfg).usersSheet;
    if (!usersSheet) return { ok: false, error: 'Auth configuration is incomplete.' };

    const user = findUserByEmail_(usersSheet, email);
    if (!user) return { ok: false, error: 'Invalid reset code.' };

    const storedCode = String(user.rowObjNormalized[AUTH_COLUMNS.USERS.resetCode] || '').trim();
    const expiresAtMs = parseIsoDateMs_(user.rowObjNormalized[AUTH_COLUMNS.USERS.resetCodeExpiresAt]);
    const now = Date.now();

    if (!storedCode || storedCode !== code) {
      return { ok: false, error: 'Invalid reset code.' };
    }
    if (!expiresAtMs || expiresAtMs <= now) {
      return { ok: false, error: 'Reset code expired. Request a new code.' };
    }

    const nextHash = hashPasswordV2_(newPassword);
    const updates = {};
    updates[AUTH_COLUMNS.USERS.passwordHash] = nextHash;
    updates[AUTH_COLUMNS.USERS.resetCode] = '';
    updates[AUTH_COLUMNS.USERS.resetCodeExpiresAt] = '';
    updateUserColumns_(usersSheet, user, updates);

    return { ok: true };
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

/* ---------------- Portal VM Assembly ---------------- */

function buildAuthShellVm_() {
  return {
    token: '',
    mode: 'client',
    status: '',
    readOnly: false,
    row: {},
    snapshot: {
      meta: {
        contractVersion: '2.0.0'
      },
      printJobs: []
    },
    portalState: {},
    chatLog: [],
    postUrl: getWebAppUrl_(),
    diagnostics: {
      shell: 'auth'
    },
    authShell: true
  };
}

function buildPortalVmForRow_(rowInfo, token, mode) {
  const row = rowInfo && rowInfo.rowObjNormalized ? rowInfo.rowObjNormalized : null;
  if (!row) return { ok: false, error: 'Link not found.' };

  const status = String(row.status || '').toLowerCase();
  if (status === 'replaced') {
    return { ok: false, error: 'This estimate link has been replaced.' };
  }

  const snapshotRaw = String(row.snapshotjson || '').trim();
  if (!snapshotRaw) return { ok: false, error: 'Snapshot data is missing.' };

  const snapshot = safeJsonParse_(snapshotRaw, null);
  if (!snapshot || typeof snapshot !== 'object') {
    return { ok: false, error: 'Snapshot data is malformed.' };
  }

  const rawPrintJobs = Array.isArray(snapshot.printJobs)
    ? snapshot.printJobs
    : ((snapshot.printJobs && typeof snapshot.printJobs === 'object')
      ? Object.keys(snapshot.printJobs).map(key => snapshot.printJobs[key])
      : []);
  const printJobIds = rawPrintJobs
    .map((job, idx) => {
      if (!job || typeof job !== 'object') return '';
      return String(job.printJobId || ('PJ' + (idx + 1))).trim();
    })
    .filter(Boolean);

  const contractVersion = String(
    row.contractversion ||
    (snapshot.meta && snapshot.meta.contractVersion) ||
    ''
  ).trim();
  if (majorVersion_(contractVersion) !== 2) {
    return { ok: false, error: 'Unsupported contract version.' };
  }

  const portalState = safeJsonParse_(row.portalstatejson, null);
  const chatLog = normalizeChatLog_(safeJsonParse_(row.chatlogjson, []));
  const readOnly = isLockedPortalRow_(row, portalState);
  const cfg = getConfig_();
  const ss = SpreadsheetApp.openById(cfg.sheetId);
  const infra = ensurePortalInfrastructure_(ss, cfg);
  const accountInfo = getPortalAccountByOrgOrEmail_(Object.assign({}, deriveOrgContextFromRow_(row), {
    cfg: cfg,
    ss: ss,
    infra: infra,
    createIfMissing: false
  }));
  const accountSummary = accountInfo ? accountInfo.summary : buildEphemeralAccountSummary_(deriveOrgContextFromRow_(row), cfg);
  const latestOrderInfo = getLatestPortalOrderByToken_(token, {
    cfg: cfg,
    ss: ss,
    ordersSheet: infra.ordersSheet
  });
  const latestOrderSummary = latestOrderInfo ? buildPortalOrderSummary_(latestOrderInfo.rowObjNormalized) : null;
  const currentStateSummary = buildCurrentOrderStateSummaryFromRow_(row, accountSummary, latestOrderSummary);

  return {
    ok: true,
    vm: {
      token: token,
      mode: normalizeMode_(mode || 'client'),
      status: status,
      readOnly: readOnly,
      row: row,
      snapshot: snapshot,
      portalState: portalState,
      chatLog: chatLog,
      accountSummary: accountSummary,
      latestOrderSummary: latestOrderSummary,
      currentStateSummary: currentStateSummary,
      postUrl: getWebAppUrl_(),
      diagnostics: {
        token: token,
        status: status,
        contractVersion: contractVersion,
        snapshotId: String(row.snapshotid || '').trim(),
        exportedAt: String(row.exportedat || '').trim(),
        printJobsCount: printJobIds.length,
        printJobIds: printJobIds,
        snapshotSnippet: snapshotRaw.slice(0, 500)
      }
    }
  };
}

function persistPortalStateForRow_(sheet, rowInfo, portalState, options) {
  const opts = (options && typeof options === 'object') ? options : {};
  const colMap = rowInfo.colMap || {};
  const row = rowInfo.row;

  const portalStateCol = colMap.portalstatejson;
  const statusCol = colMap.status;
  const submittedAtCol = colMap.submittedat;
  const submittedStateCol = colMap.submittedstatejson;
  const chatCol = colMap.chatlogjson || EXPORT_LOG_COLUMNS.chatLogJson;

  if (!portalStateCol || !statusCol) {
    return { ok: false, error: 'Required columns missing (portalStateJson/status).' };
  }
  if (opts.writeSubmittedState === true && !submittedStateCol) {
    return { ok: false, error: 'Required column missing (submittedStateJson).' };
  }
  if (opts.submittedAt && !submittedAtCol) {
    return { ok: false, error: 'Required column missing (submittedAt).' };
  }

  const nowIso = String(opts.submittedAt || new Date().toISOString());
  const stateToStore = JSON.parse(JSON.stringify(portalState));
  stateToStore.version = String(stateToStore.version || '1');
  stateToStore.savedAt = nowIso;
  stateToStore.isReadOnly = opts.locked === true;
  if (Array.isArray(opts.chatLog)) {
    writeChatLogIntoPortalState_(stateToStore, normalizeChatLog_(opts.chatLog));
  }

  sheet.getRange(row, portalStateCol).setValue(JSON.stringify(stateToStore));
  sheet.getRange(row, statusCol).setValue(String(opts.status || 'Editable'));
  if (Array.isArray(opts.chatLog) && chatCol) {
    sheet.getRange(row, chatCol).setValue(JSON.stringify(normalizeChatLog_(opts.chatLog)));
  }
  if (opts.submittedAt && submittedAtCol) {
    sheet.getRange(row, submittedAtCol).setValue(nowIso);
  } else if (opts.clearSubmittedAt === true && submittedAtCol) {
    sheet.getRange(row, submittedAtCol).setValue('');
  }
  if (opts.writeSubmittedState === true && submittedStateCol) {
    const existingSubmittedState = rowInfo.rowObjNormalized
      ? rowInfo.rowObjNormalized.submittedstatejson
      : '';
    if (!hasNonBlankJsonSignal_(existingSubmittedState)) {
      const submittedState = JSON.parse(JSON.stringify(stateToStore));
      sheet.getRange(row, submittedStateCol).setValue(JSON.stringify(submittedState));
    }
  }
  SpreadsheetApp.flush();

  return {
    ok: true,
    token: String(opts.token || ''),
    status: String(opts.status || 'Editable'),
    savedAt: nowIso,
    submittedAt: opts.submittedAt ? nowIso : ''
  };
}

function normalizeMode_(value) {
  const s = String(value || '').trim().toLowerCase();
  return (s === 'team') ? 'team' : 'client';
}

/* ---------------- Workbook Infrastructure + Shared Helpers ---------------- */

function getConfig_() {
  const props = PropertiesService.getScriptProperties();

  // Keep script property aligned to the required bound sheet.
  if (props.getProperty(CONFIG_KEYS.SHEET_ID) !== REQUIRED_SHEET_ID) {
    try {
      props.setProperty(CONFIG_KEYS.SHEET_ID, REQUIRED_SHEET_ID);
    } catch (_) {
      // Continue using REQUIRED_SHEET_ID even if property write is unavailable.
    }
  }

  const sheetId = REQUIRED_SHEET_ID;
  const exportLogSheetName = props.getProperty(CONFIG_KEYS.EXPORT_LOG_SHEET) || 'EXPORT_LOG';
  const portalOrdersSheetName = props.getProperty(CONFIG_KEYS.PORTAL_ORDERS_SHEET) || DEFAULT_PORTAL_ORDERS_SHEET;
  const portalAccountsSheetName = props.getProperty(CONFIG_KEYS.PORTAL_ACCOUNTS_SHEET) || DEFAULT_PORTAL_ACCOUNTS_SHEET;
  const makeWebhookUrl = props.getProperty(CONFIG_KEYS.MAKE_WEBHOOK_URL);
  const makeWebhookSecret = props.getProperty(CONFIG_KEYS.MAKE_WEBHOOK_SECRET) || '';
  const teamModePassword = props.getProperty(CONFIG_KEYS.TEAM_MODE_PASSWORD) || DEFAULT_TEAM_MODE_PASSWORD;
  const stripePublishableKey = String(props.getProperty(CONFIG_KEYS.STRIPE_PUBLISHABLE_KEY) || '').trim();
  const stripeSecretKey = String(props.getProperty(CONFIG_KEYS.STRIPE_SECRET_KEY) || '').trim();
  const stripeWebhookSecret = String(props.getProperty(CONFIG_KEYS.STRIPE_WEBHOOK_SECRET) || '').trim();
  const stripeWebhookForwardSharedSecret = String(props.getProperty(CONFIG_KEYS.STRIPE_WEBHOOK_FORWARD_SHARED_SECRET) || '').trim();
  const termsDocumentUrl = String(props.getProperty(CONFIG_KEYS.TERMS_DOCUMENT_URL) || DEFAULT_TERMS_DOCUMENT_URL).trim();
  const creditTermsFormFileId = String(props.getProperty(CONFIG_KEYS.CREDIT_TERMS_FORM_FILE_ID) || DEFAULT_CREDIT_TERMS_FORM_FILE_ID).trim();
  const taxExemptFormFileId = String(props.getProperty(CONFIG_KEYS.TAX_EXEMPT_FORM_FILE_ID) || DEFAULT_TAX_EXEMPT_FORM_FILE_ID).trim();
  const invoiceDriveFolderId = String(props.getProperty(CONFIG_KEYS.INVOICE_DRIVE_FOLDER_ID) || DEFAULT_INVOICE_DRIVE_FOLDER_ID).trim();
  const termsDriveFolderId = String(props.getProperty(CONFIG_KEYS.TERMS_DRIVE_FOLDER_ID) || DEFAULT_TERMS_DRIVE_FOLDER_ID).trim();
  const taxExemptDriveFolderId = String(props.getProperty(CONFIG_KEYS.TAX_EXEMPT_DRIVE_FOLDER_ID) || DEFAULT_TAX_EXEMPT_DRIVE_FOLDER_ID).trim();
  const stripePriceCurrency = String(props.getProperty(CONFIG_KEYS.STRIPE_PRICE_CURRENCY) || DEFAULT_STRIPE_PRICE_CURRENCY).trim().toUpperCase() || DEFAULT_STRIPE_PRICE_CURRENCY;
  const stripeMode = String(props.getProperty(CONFIG_KEYS.STRIPE_MODE) || DEFAULT_STRIPE_MODE).trim().toLowerCase() || DEFAULT_STRIPE_MODE;
  const stripeReturnUrl = String(props.getProperty(CONFIG_KEYS.STRIPE_RETURN_URL) || props.getProperty(CONFIG_KEYS.SUCCESS_REDIRECT_URL) || '').trim();
  const successRedirectUrl = String(props.getProperty(CONFIG_KEYS.SUCCESS_REDIRECT_URL) || '').trim();

  return {
    sheetId: sheetId,
    exportLogSheetName: exportLogSheetName,
    portalOrdersSheetName: portalOrdersSheetName,
    portalAccountsSheetName: portalAccountsSheetName,
    makeWebhookUrl: makeWebhookUrl || DEFAULT_MAKE_WEBHOOK_URL,
    makeWebhookSecret: makeWebhookSecret,
    teamModePassword: String(teamModePassword || DEFAULT_TEAM_MODE_PASSWORD),
    stripePublishableKey: stripePublishableKey,
    stripeSecretKey: stripeSecretKey,
    stripeWebhookSecret: stripeWebhookSecret,
    stripeWebhookForwardSharedSecret: stripeWebhookForwardSharedSecret,
    termsDocumentUrl: termsDocumentUrl,
    creditTermsFormFileId: creditTermsFormFileId,
    taxExemptFormFileId: taxExemptFormFileId,
    invoiceDriveFolderId: invoiceDriveFolderId,
    termsDriveFolderId: termsDriveFolderId,
    taxExemptDriveFolderId: taxExemptDriveFolderId,
    stripePriceCurrency: stripePriceCurrency,
    stripeMode: stripeMode,
    stripeReturnUrl: stripeReturnUrl,
    successRedirectUrl: successRedirectUrl
  };
}

function boolFromCell_(value) {
  if (value === true || value === false) return value;
  const raw = String(value == null ? '' : value).trim().toLowerCase();
  if (!raw) return false;
  return raw === 'true' || raw === 'yes' || raw === 'y' || raw === '1' || raw === 'approved';
}

function trimString_(value) {
  return String(value == null ? '' : value).trim();
}

function toFiniteNumber_(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) ? num : Number(fallback || 0);
}

function roundMoney_(value) {
  return Math.round(toFiniteNumber_(value, 0) * 100) / 100;
}

function nowIso_() {
  return new Date().toISOString();
}

function newPortalId_(prefix) {
  const safePrefix = String(prefix || 'id').trim() || 'id';
  return safePrefix + '_' + Utilities.getUuid().replace(/-/g, '');
}

function safeSheetName_(value, fallback) {
  const raw = trimString_(value);
  return raw || String(fallback || '').trim();
}

function ensureSheetHeaders_(sheet, requiredHeaders) {
  const required = Array.isArray(requiredHeaders) ? requiredHeaders : [];
  if (!sheet) throw new Error('Sheet is required.');

  const hasAnyColumns = sheet.getMaxColumns() > 0 || sheet.getLastColumn() > 0;
  const existingHeader = hasAnyColumns && sheet.getLastRow() >= 1
    ? sheet.getRange(1, 1, 1, Math.max(1, sheet.getLastColumn())).getValues()[0]
    : [];

  const existingNormalized = new Set(
    existingHeader
      .map(normalizeHeaderKey_)
      .filter(Boolean)
  );

  const missing = required.filter(header => !existingNormalized.has(normalizeHeaderKey_(header)));
  if (!existingHeader.length) {
    const width = Math.max(1, required.length);
    if (sheet.getMaxColumns() < width) {
      sheet.insertColumnsAfter(sheet.getMaxColumns(), width - sheet.getMaxColumns());
    }
    sheet.getRange(1, 1, 1, width).setValues([required.slice(0, width)]);
  } else if (missing.length) {
    const startCol = sheet.getLastColumn() + 1;
    sheet.insertColumnsAfter(sheet.getLastColumn(), missing.length);
    sheet.getRange(1, startCol, 1, missing.length).setValues([missing]);
  }

  const header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  return buildColumnMap_(header);
}

function ensureNamedSheetWithHeaders_(ss, name, headers) {
  const sheetName = safeSheetName_(name, '');
  if (!sheetName) throw new Error('Sheet name is required.');
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) sheet = ss.insertSheet(sheetName);
  ensureSheetHeaders_(sheet, headers);
  return sheet;
}

// Keep the live workbook contract frozen here: EXPORT_LOG, USERS,
// USER_SESSIONS, PORTAL_ORDERS, and PORTAL_ACCOUNTS.
function ensurePortalInfrastructure_(ss, cfg) {
  const exportSheet = ss.getSheetByName(cfg.exportLogSheetName);
  if (!exportSheet) {
    throw new Error('EXPORT_LOG sheet not found.');
  }
  ensureSheetHeaders_(exportSheet, EXPORT_LOG_POINTER_HEADERS);

  const usersSheet = ensureNamedSheetWithHeaders_(ss, AUTH_SHEETS.USERS, USER_HEADERS);
  const sessionsSheet = ensureNamedSheetWithHeaders_(ss, AUTH_SHEETS.USER_SESSIONS, USER_SESSION_HEADERS);
  const ordersSheet = ensureNamedSheetWithHeaders_(ss, cfg.portalOrdersSheetName, PORTAL_ORDER_HEADERS);
  const accountsSheet = ensureNamedSheetWithHeaders_(ss, cfg.portalAccountsSheetName, PORTAL_ACCOUNT_HEADERS);

  return {
    exportSheet: exportSheet,
    usersSheet: usersSheet,
    sessionsSheet: sessionsSheet,
    ordersSheet: ordersSheet,
    accountsSheet: accountsSheet
  };
}

function buildRowInfoFromSheet_(sheet, row, header, rowVals) {
  const safeHeader = Array.isArray(header) ? header : sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const safeRowVals = Array.isArray(rowVals) ? rowVals : sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowObj = {};
  const rowObjNormalized = {};
  safeHeader.forEach((h, idx) => {
    const rawKey = String(h || '').trim();
    rowObj[rawKey] = safeRowVals[idx];
    rowObjNormalized[normalizeHeaderKey_(rawKey)] = safeRowVals[idx];
  });
  return {
    row: row,
    rowObj: rowObj,
    rowObjNormalized: rowObjNormalized,
    colMap: buildColumnMap_(safeHeader)
  };
}

function listSheetRowInfos_(sheet) {
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow < 2 || lastCol < 1) return [];
  const header = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const rows = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  return rows.map((rowVals, idx) => buildRowInfoFromSheet_(sheet, idx + 2, header, rowVals));
}

function setRowValuesByHeaderMap_(sheet, row, colMap, updates) {
  Object.keys(updates || {}).forEach((headerKey) => {
    const col = colMap[normalizeHeaderKey_(headerKey)] || colMap[headerKey];
    if (!col) return;
    sheet.getRange(row, col).setValue(updates[headerKey]);
  });
}

function getUserContextBySessionId_(ss, sessionId) {
  const id = trimString_(sessionId);
  if (!id) return { ok: false, error: 'Missing session.' };
  const sessionsSheet = ensureNamedSheetWithHeaders_(ss, AUTH_SHEETS.USER_SESSIONS, USER_SESSION_HEADERS);
  const session = validateSession_(sessionsSheet, id);
  if (!session.ok) return session;
  const usersSheet = ensureNamedSheetWithHeaders_(ss, AUTH_SHEETS.USERS, USER_HEADERS);
  const user = findUserByEmail_(usersSheet, session.email);
  return {
    ok: true,
    email: session.email,
    session: session,
    user: user
  };
}

function deriveOrgContextFromRow_(row) {
  const normalizedRow = (row && typeof row === 'object') ? row : {};
  return {
    orgId: trimString_(
      normalizedRow.orgid ||
      normalizedRow.companyid ||
      normalizedRow.accountorgid
    ),
    orgName: trimString_(
      normalizedRow.orgname ||
      normalizedRow.company ||
      normalizedRow.companyname
    ),
    personEmail: normalizeEmail_(
      normalizedRow.personemail ||
      normalizedRow.primaryemail
    ),
    personName: trimString_(
      normalizedRow.personname ||
      normalizedRow.clientname ||
      normalizedRow.primarycontactname
    )
  };
}

function buildAccountIdentityFromInputs_(opts) {
  const options = (opts && typeof opts === 'object') ? opts : {};
  return {
    orgId: trimString_(options.orgId),
    orgName: trimString_(options.orgName),
    personEmail: normalizeEmail_(options.personEmail || options.primaryEmail || options.email),
    personName: trimString_(options.personName || options.primaryContactName || options.displayName),
    billingContactEmail: normalizeEmail_(options.billingContactEmail || options.personEmail || options.primaryEmail || options.email),
    billingContactName: trimString_(options.billingContactName || options.personName || options.primaryContactName || options.displayName)
  };
}

function mergeAccountIdentity_(baseIdentity, overrideIdentity) {
  const base = buildAccountIdentityFromInputs_(baseIdentity);
  const override = buildAccountIdentityFromInputs_(overrideIdentity);
  return {
    orgId: override.orgId || base.orgId,
    orgName: override.orgName || base.orgName,
    personEmail: override.personEmail || base.personEmail,
    personName: override.personName || base.personName,
    billingContactEmail: override.billingContactEmail || base.billingContactEmail || override.personEmail || base.personEmail,
    billingContactName: override.billingContactName || base.billingContactName || override.personName || base.personName
  };
}

function normalizeAccountDocumentType_(value) {
  const raw = trimString_(value).toLowerCase();
  if (raw === 'terms' || raw === 'credit_terms' || raw === 'creditterms') return ACCOUNT_DOCUMENT_TYPES.credit_terms;
  if (raw === 'tax' || raw === 'tax_exempt' || raw === 'taxexempt' || raw === 'michigan_tax_exempt') return ACCOUNT_DOCUMENT_TYPES.tax_exempt;
  return '';
}

function getAccountDocumentWorkflowKey_(documentType) {
  const type = normalizeAccountDocumentType_(documentType);
  if (type === ACCOUNT_DOCUMENT_TYPES.credit_terms) return 'creditTerms';
  if (type === ACCOUNT_DOCUMENT_TYPES.tax_exempt) return 'taxExempt';
  return '';
}

function normalizeAccountDocumentStatus_(value) {
  const raw = trimString_(value).toLowerCase();
  if (!raw) return 'not_started';
  if (raw === 'pending_submission') return 'submitted';
  if (raw === 'submitted' || raw === 'under_review' || raw === 'approved' || raw === 'rejected' || raw === 'not_started') {
    return raw;
  }
  return raw;
}

function buildDriveFileViewUrl_(fileId) {
  const id = trimString_(fileId);
  return id ? ('https://drive.google.com/file/d/' + encodeURIComponent(id) + '/view') : '';
}

function buildDriveFilePreviewUrl_(fileId) {
  const id = trimString_(fileId);
  return id ? ('https://drive.google.com/file/d/' + encodeURIComponent(id) + '/preview') : '';
}

function buildDriveFileDownloadUrl_(fileId) {
  const id = trimString_(fileId);
  return id ? ('https://drive.google.com/uc?export=download&id=' + encodeURIComponent(id)) : '';
}

function getApprovedPaymentTermsOptions_() {
  return APPROVED_PAYMENT_TERMS_OPTIONS.map(function(option) {
    return {
      code: trimString_(option.code),
      label: trimString_(option.label),
      days: Math.max(0, parseInt(String(option.days || 0), 10) || 0)
    };
  });
}

function getApprovedPaymentTermsOptionByCode_(value) {
  const code = trimString_(value).toLowerCase();
  if (!code) return null;
  const options = getApprovedPaymentTermsOptions_();
  for (var i = 0; i < options.length; i += 1) {
    if (trimString_(options[i].code).toLowerCase() === code) {
      return options[i];
    }
  }
  return null;
}

function buildApprovedPaymentTermsSelection_(payload) {
  const p = (payload && typeof payload === 'object') ? payload : {};
  const option = getApprovedPaymentTermsOptionByCode_(
    p.paymentTermsCode || p.approvedPaymentTermsCode || p.termsCode || p.code
  );
  if (!option) {
    throw new Error('Select an approved payment term before approving credit terms.');
  }
  return {
    code: option.code,
    label: option.label,
    days: option.days,
    notes: trimString_(p.paymentTermsNotes || p.approvedPaymentTermsNotes || p.notes)
  };
}

function buildApprovedPaymentTermsSummaryFromRow_(row) {
  const source = (row && typeof row === 'object') ? row : {};
  return {
    code: trimString_(source.approvedpaymenttermscode || source.approvedPaymentTermsCode),
    label: trimString_(source.approvedpaymenttermslabel || source.approvedPaymentTermsLabel),
    days: Math.max(0, parseInt(String(source.approvedpaymenttermsdays || source.approvedPaymentTermsDays || 0), 10) || 0),
    notes: trimString_(source.approvedpaymenttermsnotes || source.approvedPaymentTermsNotes),
    setAt: trimString_(source.approvedpaymenttermssetat || source.approvedPaymentTermsSetAt),
    setByName: trimString_(source.approvedpaymenttermssetbyname || source.approvedPaymentTermsSetByName),
    setByEmail: normalizeEmail_(source.approvedpaymenttermssetbyemail || source.approvedPaymentTermsSetByEmail)
  };
}

function getDriveFileByIdSafe_(fileId) {
  const id = trimString_(fileId);
  if (!id) return null;
  try {
    return DriveApp.getFileById(id);
  } catch (_) {
    return null;
  }
}

function cloneJsonValue_(value, fallback) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (_) {
    return fallback;
  }
}

function parsePortalAccountNotes_(rawValue) {
  const raw = trimString_(rawValue);
  if (!raw) return {};
  const parsed = safeJsonParse_(raw, null);
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
  return { legacyText: raw };
}

function buildPortalAccountNotesText_(notesObj) {
  const notes = (notesObj && typeof notesObj === 'object' && !Array.isArray(notesObj)) ? notesObj : {};
  return JSON.stringify(notes);
}

function getPortalAccountDocumentNotes_(accountRow, documentType) {
  const type = normalizeAccountDocumentType_(documentType);
  if (!type) return {};
  const row = (accountRow && typeof accountRow === 'object') ? accountRow : {};
  const notes = parsePortalAccountNotes_(row.notes);
  const workflows = (notes.documentWorkflow && typeof notes.documentWorkflow === 'object' && !Array.isArray(notes.documentWorkflow))
    ? notes.documentWorkflow
    : {};
  const entry = workflows[type];
  return (entry && typeof entry === 'object' && !Array.isArray(entry)) ? entry : {};
}

function updatePortalAccountDocumentNotes_(accountRow, documentType, mutateFn) {
  const row = (accountRow && typeof accountRow === 'object') ? accountRow : {};
  const type = normalizeAccountDocumentType_(documentType);
  const notes = parsePortalAccountNotes_(row.notes);
  if (!notes.documentWorkflow || typeof notes.documentWorkflow !== 'object' || Array.isArray(notes.documentWorkflow)) {
    notes.documentWorkflow = {};
  }
  const current = notes.documentWorkflow[type] && typeof notes.documentWorkflow[type] === 'object' && !Array.isArray(notes.documentWorkflow[type])
    ? cloneJsonValue_(notes.documentWorkflow[type], {})
    : {};
  const next = typeof mutateFn === 'function' ? mutateFn(current, notes) : current;
  notes.documentWorkflow[type] = (next && typeof next === 'object' && !Array.isArray(next)) ? next : {};
  return buildPortalAccountNotesText_(notes);
}

function normalizeEmailRecipients_(value) {
  const rawItems = Array.isArray(value)
    ? value
    : String(value || '').split(/[\n,;]+/);
  const seen = {};
  const recipients = [];
  rawItems.forEach((item) => {
    const email = normalizeEmail_(item);
    if (!email || seen[email]) return;
    seen[email] = true;
    recipients.push(email);
  });
  return recipients;
}

function getAccountDocumentDefinition_(documentType, cfg) {
  const type = normalizeAccountDocumentType_(documentType);
  const config = cfg || getConfig_();
  if (type === ACCOUNT_DOCUMENT_TYPES.credit_terms) {
    const sourceFileId = trimString_(config.creditTermsFormFileId);
    return {
      type: type,
      workflowKey: 'creditTerms',
      teamReviewQueryValue: 'credit_terms',
      label: 'Red Threads Credit Terms',
      shortLabel: 'Credit Terms',
      sourceFileId: sourceFileId,
      sourceDocumentUrl: buildDriveFileViewUrl_(sourceFileId) || trimString_(config.termsDocumentUrl),
      sourceDocumentDownloadUrl: buildDriveFileDownloadUrl_(sourceFileId),
      uploadFolderId: trimString_(config.termsDriveFolderId),
      statusField: 'termsStatus',
      approvedField: 'termsApproved',
      approvedAtField: 'termsApprovedAt',
      approvedByNameField: 'termsApprovedByName',
      approvedByEmailField: 'termsApprovedByEmail',
      artifactUrlField: 'signedTermsFileUrl',
      submittedAtField: 'signedTermsSubmittedAt',
      sourceUrlField: 'termsDocumentUrl',
      paymentTermsCodeField: 'approvedPaymentTermsCode',
      paymentTermsLabelField: 'approvedPaymentTermsLabel',
      paymentTermsDaysField: 'approvedPaymentTermsDays',
      paymentTermsNotesField: 'approvedPaymentTermsNotes',
      paymentTermsSetAtField: 'approvedPaymentTermsSetAt',
      paymentTermsSetByNameField: 'approvedPaymentTermsSetByName',
      paymentTermsSetByEmailField: 'approvedPaymentTermsSetByEmail',
      supportsGuidedForm: false,
      uploadLabel: 'Upload signed terms document',
      blankEmailSubject: 'Red Threads Credit Terms PDF',
      teamReviewSubject: 'Credit terms document submitted'
    };
  }
  if (type === ACCOUNT_DOCUMENT_TYPES.tax_exempt) {
    const sourceFileId = trimString_(config.taxExemptFormFileId);
    return {
      type: type,
      workflowKey: 'taxExempt',
      teamReviewQueryValue: 'tax_exempt',
      label: 'Michigan Sales Tax Exemption',
      shortLabel: 'Tax Exemption',
      sourceFileId: sourceFileId,
      sourceDocumentUrl: buildDriveFileViewUrl_(sourceFileId),
      sourceDocumentDownloadUrl: buildDriveFileDownloadUrl_(sourceFileId),
      uploadFolderId: trimString_(config.taxExemptDriveFolderId),
      statusField: 'taxExemptStatus',
      approvedField: 'taxExemptApproved',
      approvedAtField: 'taxExemptApprovedAt',
      approvedByNameField: 'taxExemptApprovedByName',
      approvedByEmailField: 'taxExemptApprovedByEmail',
      artifactUrlField: 'taxExemptCertificateUrl',
      submittedAtField: 'taxExemptSubmittedAt',
      certificateNumberField: 'taxExemptCertificateNumber',
      expiresAtField: 'taxExemptExpiresAt',
      supportsGuidedForm: true,
      uploadLabel: 'Upload completed exemption document',
      blankEmailSubject: 'Michigan Sales Tax Exemption PDF',
      teamReviewSubject: 'Tax exemption document submitted'
    };
  }
  return null;
}

function getRequiredAccountDocumentDefinition_(documentType, cfg) {
  const definition = getAccountDocumentDefinition_(documentType, cfg);
  if (!definition) {
    throw new Error('Unsupported document type.');
  }
  return definition;
}

function getAccountDocumentWorkflowFromSummary_(summary, documentType, cfg) {
  const definition = getAccountDocumentDefinition_(documentType, cfg);
  if (!definition || !definition.workflowKey) return null;
  const source = (summary && typeof summary === 'object') ? summary : {};
  const workflows = (source.documentWorkflows && typeof source.documentWorkflows === 'object')
    ? source.documentWorkflows
    : {};
  return workflows[definition.workflowKey] || null;
}

function buildAccountDocumentTeamReviewUrl_(documentType, token, cfg) {
  const id = trimString_(token);
  if (!id) return '';
  const definition = getAccountDocumentDefinition_(documentType, cfg);
  const portalUrl = buildPortalDirectUrl_(id);
  const params = { mode: 'team' };
  const reviewQueryValue = trimString_(definition && definition.teamReviewQueryValue);
  if (reviewQueryValue) params.teamReview = reviewQueryValue;
  return appendQueryParamsToUrl_(portalUrl, params);
}

function sanitizeAccountDocumentClientMeta_(meta) {
  const source = (meta && typeof meta === 'object') ? meta : {};
  const lastSubmission = (source.lastSubmission && typeof source.lastSubmission === 'object')
    ? source.lastSubmission
    : {};
  const lastDecision = (source.lastDecision && typeof source.lastDecision === 'object')
    ? source.lastDecision
    : {};
  const submissions = Array.isArray(source.submissions) ? source.submissions : [];
  return {
    submissionCount: submissions.length,
    lastSubmission: {
      submittedAt: trimString_(lastSubmission.submittedAt),
      submittedByName: trimString_(lastSubmission.submittedByName),
      submittedByEmail: normalizeEmail_(lastSubmission.submittedByEmail),
      submissionSource: trimString_(lastSubmission.submissionSource),
      artifactUrl: trimString_(lastSubmission.artifactUrl),
      artifactName: trimString_(lastSubmission.artifactName),
      artifactFiles: normalizeAccountDocumentArtifactFiles_(lastSubmission.artifactFiles),
      certificateNumber: trimString_(lastSubmission.certificateNumber),
      guidedFormData: lastSubmission.guidedFormData && typeof lastSubmission.guidedFormData === 'object'
        ? cloneJsonValue_(lastSubmission.guidedFormData, {})
        : null
    },
    lastDecision: {
      decidedAt: trimString_(lastDecision.decidedAt),
      decision: trimString_(lastDecision.decision),
      decidedByName: trimString_(lastDecision.decidedByName),
      decidedByEmail: normalizeEmail_(lastDecision.decidedByEmail),
      reason: trimString_(lastDecision.reason)
    },
    lastBlankEmail: source.lastBlankEmail && typeof source.lastBlankEmail === 'object'
      ? {
          sentAt: trimString_(source.lastBlankEmail.sentAt),
          sentByName: trimString_(source.lastBlankEmail.sentByName),
          sentByEmail: normalizeEmail_(source.lastBlankEmail.sentByEmail),
          recipients: normalizeEmailRecipients_(source.lastBlankEmail.recipients)
        }
      : null
  };
}

function buildAccountDocumentWorkflowSummary_(accountRow, documentType, cfg) {
  const row = (accountRow && typeof accountRow === 'object') ? accountRow : {};
  const definition = getAccountDocumentDefinition_(documentType, cfg);
  if (!definition) return null;
  const notesMeta = getPortalAccountDocumentNotes_(row, definition.type);
  const status = normalizeAccountDocumentStatus_(row[normalizeHeaderKey_(definition.statusField)] || row[definition.statusField]);
  const approved = boolFromCell_(row[normalizeHeaderKey_(definition.approvedField)] || row[definition.approvedField])
    || status === 'approved';
  const uploadedDocumentUrl = trimString_(row[normalizeHeaderKey_(definition.artifactUrlField)] || row[definition.artifactUrlField])
    || trimString_(notesMeta.lastSubmission && notesMeta.lastSubmission.artifactUrl);
  const submittedAt = trimString_(row[normalizeHeaderKey_(definition.submittedAtField)] || row[definition.submittedAtField])
    || trimString_(notesMeta.lastSubmission && notesMeta.lastSubmission.submittedAt);
  const certificateNumber = definition.certificateNumberField
    ? trimString_(row[normalizeHeaderKey_(definition.certificateNumberField)] || row[definition.certificateNumberField])
    : '';
  const expiresAt = definition.expiresAtField
    ? trimString_(row[normalizeHeaderKey_(definition.expiresAtField)] || row[definition.expiresAtField])
    : '';
  const approvedPaymentTerms = definition.paymentTermsCodeField
    ? buildApprovedPaymentTermsSummaryFromRow_(row)
    : {
        code: '',
        label: '',
        days: 0,
        notes: '',
        setAt: '',
        setByName: '',
        setByEmail: ''
      };
  return {
    type: definition.type,
    label: definition.label,
    shortLabel: definition.shortLabel,
    status: status,
    approved: approved,
    active: definition.type === ACCOUNT_DOCUMENT_TYPES.tax_exempt ? isTaxExemptActive_(row) : approved,
    submittedAt: submittedAt,
    uploadedDocumentUrl: uploadedDocumentUrl,
    certificateNumber: certificateNumber,
    expiresAt: expiresAt,
    sourceDocumentUrl: definition.sourceDocumentUrl,
    sourceDocumentDownloadUrl: definition.sourceDocumentDownloadUrl,
    supportsGuidedForm: definition.supportsGuidedForm === true,
    approvedPaymentTermsCode: approvedPaymentTerms.code,
    approvedPaymentTermsLabel: approvedPaymentTerms.label,
    approvedPaymentTermsDays: approvedPaymentTerms.days,
    approvedPaymentTermsNotes: approvedPaymentTerms.notes,
    approvedPaymentTermsSetAt: approvedPaymentTerms.setAt,
    approvedPaymentTermsSetByName: approvedPaymentTerms.setByName,
    approvedPaymentTermsSetByEmail: approvedPaymentTerms.setByEmail,
    clientMeta: sanitizeAccountDocumentClientMeta_(notesMeta)
  };
}

function buildPortalAccountSummary_(accountRow, cfg) {
  const row = (accountRow && typeof accountRow === 'object') ? accountRow : {};
  const termsApproved = isTermsApproved_(row);
  const taxExemptApproved = isTaxExemptApproved_(row);
  const taxExemptActive = isTaxExemptActive_(row);
  const approvedPaymentTerms = buildApprovedPaymentTermsSummaryFromRow_(row);
  const creditTermsWorkflow = buildAccountDocumentWorkflowSummary_(row, ACCOUNT_DOCUMENT_TYPES.credit_terms, cfg);
  const taxExemptWorkflow = buildAccountDocumentWorkflowSummary_(row, ACCOUNT_DOCUMENT_TYPES.tax_exempt, cfg);
  const summary = {
    accountId: trimString_(row.accountid || row.accountId),
    orgId: trimString_(row.orgid || row.orgId),
    orgName: trimString_(row.orgname || row.orgName),
    primaryEmail: normalizeEmail_(row.primaryemail || row.primaryEmail),
    primaryContactName: trimString_(row.primarycontactname || row.primaryContactName),
    termsStatus: normalizeAccountDocumentStatus_(row.termsstatus || row.termsStatus),
    termsApproved: termsApproved,
    termsApprovedAt: trimString_(row.termsapprovedat || row.termsApprovedAt),
    signedTermsFileUrl: trimString_(row.signedtermsfileurl || row.signedTermsFileUrl),
    signedTermsSubmittedAt: trimString_(row.signedtermssubmittedat || row.signedTermsSubmittedAt),
    approvedPaymentTermsCode: approvedPaymentTerms.code,
    approvedPaymentTermsLabel: approvedPaymentTerms.label,
    approvedPaymentTermsDays: approvedPaymentTerms.days,
    approvedPaymentTermsNotes: approvedPaymentTerms.notes,
    approvedPaymentTermsSetAt: approvedPaymentTerms.setAt,
    approvedPaymentTermsSetByName: approvedPaymentTerms.setByName,
    approvedPaymentTermsSetByEmail: approvedPaymentTerms.setByEmail,
    taxExemptStatus: normalizeAccountDocumentStatus_(row.taxexemptstatus || row.taxExemptStatus),
    taxExemptApproved: taxExemptApproved,
    taxExemptExpiresAt: trimString_(row.taxexemptexpiresat || row.taxExemptExpiresAt),
    taxExemptActive: taxExemptActive,
    taxExemptCertificateUrl: trimString_(row.taxexemptcertificateurl || row.taxExemptCertificateUrl),
    taxExemptCertificateNumber: trimString_(row.taxexemptcertificatenumber || row.taxExemptCertificateNumber),
    taxExemptSubmittedAt: trimString_(row.taxexemptsubmittedat || row.taxExemptSubmittedAt),
    poAvailable: termsApproved,
    termsDocumentUrl: trimString_(row.termsdocumenturl || row.termsDocumentUrl) || String(cfg.termsDocumentUrl || '').trim(),
    termsDocumentDownloadUrl: creditTermsWorkflow ? creditTermsWorkflow.sourceDocumentDownloadUrl : '',
    taxExemptDocumentUrl: taxExemptWorkflow ? taxExemptWorkflow.sourceDocumentUrl : '',
    taxExemptDocumentDownloadUrl: taxExemptWorkflow ? taxExemptWorkflow.sourceDocumentDownloadUrl : '',
    billingContactEmail: normalizeEmail_(row.billingcontactemail || row.billingContactEmail),
    billingContactName: trimString_(row.billingcontactname || row.billingContactName),
    createdAt: trimString_(row.createdat || row.createdAt),
    updatedAt: trimString_(row.updatedat || row.updatedAt),
    documentWorkflows: {
      creditTerms: creditTermsWorkflow,
      taxExempt: taxExemptWorkflow
    }
  };
  return summary;
}

function isTermsApproved_(account) {
  const row = (account && typeof account === 'object') ? account : {};
  return boolFromCell_(row.termsapproved || row.termsApproved) ||
    normalizeAccountDocumentStatus_(row.termsstatus || row.termsStatus) === 'approved';
}

function isTaxExemptApproved_(account) {
  const row = (account && typeof account === 'object') ? account : {};
  return boolFromCell_(row.taxexemptapproved || row.taxExemptApproved) ||
    normalizeAccountDocumentStatus_(row.taxexemptstatus || row.taxExemptStatus) === 'approved';
}

function isTaxExemptActive_(account) {
  if (!isTaxExemptApproved_(account)) return false;
  const row = (account && typeof account === 'object') ? account : {};
  const expiresAt = trimString_(row.taxexemptexpiresat || row.taxExemptExpiresAt);
  if (!expiresAt) return true;
  const expiresMs = parseIsoDateMs_(expiresAt);
  if (!expiresMs) return true;
  return expiresMs >= Date.now();
}

function getPortalAccountByOrgOrEmail_(opts) {
  const options = (opts && typeof opts === 'object') ? opts : {};
  const cfg = options.cfg || getConfig_();
  const ss = options.ss || SpreadsheetApp.openById(cfg.sheetId);
  const infra = options.infra || ensurePortalInfrastructure_(ss, cfg);
  const accountsSheet = infra.accountsSheet;
  const identity = buildAccountIdentityFromInputs_(options);
  const orgId = identity.orgId;
  const email = identity.personEmail;
  const rows = listSheetRowInfos_(accountsSheet);

  let match = null;
  if (orgId) {
    match = rows.find(info => trimString_(info.rowObjNormalized.orgid) === orgId) || null;
  }
  if (!match && email) {
    match = rows.find(info => normalizeEmail_(info.rowObjNormalized.primaryemail) === email) || null;
  }
  if (!match && email) {
    match = rows.find(info => normalizeEmail_(info.rowObjNormalized.billingcontactemail) === email) || null;
  }

  if (!match) return null;
  return {
    rowInfo: match,
    summary: buildPortalAccountSummary_(match.rowObjNormalized, cfg)
  };
}

function createPortalAccountIfMissing_(opts) {
  const options = (opts && typeof opts === 'object') ? opts : {};
  const cfg = options.cfg || getConfig_();
  const ss = options.ss || SpreadsheetApp.openById(cfg.sheetId);
  const infra = options.infra || ensurePortalInfrastructure_(ss, cfg);
  const existing = getPortalAccountByOrgOrEmail_(Object.assign({}, options, {
    cfg: cfg,
    ss: ss,
    infra: infra
  }));
  if (existing) return existing;
  if (options.createIfMissing === false) return null;

  const accountsSheet = infra.accountsSheet;
  const header = accountsSheet.getRange(1, 1, 1, accountsSheet.getLastColumn()).getValues()[0];
  const colMap = buildColumnMap_(header);
  const identity = buildAccountIdentityFromInputs_(options);
  const creditTermsDefinition = getAccountDocumentDefinition_(ACCOUNT_DOCUMENT_TYPES.credit_terms, cfg);
  const now = nowIso_();
  const rowVals = new Array(accountsSheet.getLastColumn()).fill('');

  rowVals[colMap.accountid - 1] = newPortalId_('acct');
  rowVals[colMap.orgid - 1] = identity.orgId;
  rowVals[colMap.orgname - 1] = identity.orgName;
  rowVals[colMap.primaryemail - 1] = identity.personEmail;
  rowVals[colMap.primarycontactname - 1] = identity.personName;
  rowVals[colMap.termsstatus - 1] = 'not_started';
  rowVals[colMap.termsapproved - 1] = false;
  rowVals[colMap.termsdocumenturl - 1] = creditTermsDefinition ? creditTermsDefinition.sourceDocumentUrl : cfg.termsDocumentUrl;
  rowVals[colMap.approvedpaymenttermsdays - 1] = 0;
  rowVals[colMap.taxexemptstatus - 1] = 'not_started';
  rowVals[colMap.taxexemptapproved - 1] = false;
  rowVals[colMap.billingcontactemail - 1] = identity.billingContactEmail || identity.personEmail;
  rowVals[colMap.billingcontactname - 1] = identity.billingContactName || identity.personName;
  rowVals[colMap.createdat - 1] = now;
  rowVals[colMap.updatedat - 1] = now;

  const row = accountsSheet.getLastRow() + 1;
  accountsSheet.getRange(row, 1, 1, rowVals.length).setValues([rowVals]);
  const createdInfo = buildRowInfoFromSheet_(accountsSheet, row, header, rowVals);
  return {
    rowInfo: createdInfo,
    summary: buildPortalAccountSummary_(createdInfo.rowObjNormalized, cfg)
  };
}

function getWebAppUrl_() {
  return ScriptApp.getService().getUrl();
}

function buildPortalDirectUrl_(token) {
  const baseUrl = String(getWebAppUrl_() || '').trim();
  const tokenValue = String(token || '').trim();
  if (!baseUrl || !tokenValue) return '';
  return baseUrl + (baseUrl.indexOf('?') >= 0 ? '&' : '?') + 't=' + encodeURIComponent(tokenValue);
}

function buildExternalPortalUrl_(token) {
  const tokenValue = String(token || '').trim();
  if (!tokenValue) return '';
  return 'https://www.redthreads.com/portal?t=' + encodeURIComponent(tokenValue);
}

function appendQueryParamsToUrl_(baseUrl, params) {
  const base = trimString_(baseUrl);
  const entries = (params && typeof params === 'object') ? params : {};
  if (!base) return '';
  try {
    const url = new URL(base);
    Object.keys(entries).forEach((key) => {
      const value = entries[key];
      if (value == null) return;
      const text = String(value).trim();
      if (!text) return;
      url.searchParams.set(String(key), text);
    });
    return url.toString();
  } catch (_) {
    const pairs = [];
    Object.keys(entries).forEach((key) => {
      const value = entries[key];
      if (value == null) return;
      const text = String(value).trim();
      if (!text) return;
      pairs.push(encodeURIComponent(String(key)) + '=' + encodeURIComponent(text));
    });
    if (!pairs.length) return base;
    return base + (base.indexOf('?') >= 0 ? '&' : '?') + pairs.join('&');
  }
}

function buildStripeReturnBaseUrl_(token, options) {
  const opts = (options && typeof options === 'object') ? options : {};
  const base = trimString_(opts.returnUrl || getConfig_().stripeReturnUrl || buildPortalDirectUrl_(token));
  if (!base) return '';
  const tokenValue = trimString_(token);
  if (!tokenValue) return base;
  if (/[?&](?:t|token)=/i.test(base)) return base;
  return appendQueryParamsToUrl_(base, { t: tokenValue });
}

function buildStripeCheckoutReturnUrl_(token, options) {
  const opts = (options && typeof options === 'object') ? options : {};
  const baseUrl = buildStripeReturnBaseUrl_(token, opts);
  return appendQueryParamsToUrl_(baseUrl, opts.queryParams || {});
}

function normalizePriceMapForOrder_(raw) {
  const out = {};
  if (!raw || typeof raw !== 'object') return out;
  Object.keys(raw).forEach((tierKey) => {
    const tierObj = raw[tierKey];
    if (!tierObj || typeof tierObj !== 'object') return;
    const tierNum = Number(tierKey);
    if (!Number.isFinite(tierNum)) return;
    const row = {};
    Object.keys(tierObj).forEach((size) => {
      const value = Number(tierObj[size]);
      if (Number.isFinite(value)) row[String(size)] = value;
    });
    out[String(tierNum)] = row;
  });
  return out;
}

function normalizeTierListForOrder_(jobTiers, skus) {
  const set = {};
  (Array.isArray(jobTiers) ? jobTiers : []).forEach((tier) => {
    const n = Number(tier);
    if (Number.isFinite(n) && n > 0) set[String(n)] = n;
  });
  (Array.isArray(skus) ? skus : []).forEach((sku) => {
    Object.keys((sku && sku.printedUnitPriceByTierBySize) || {}).forEach((tierKey) => {
      const n = Number(tierKey);
      if (Number.isFinite(n) && n > 0) set[String(n)] = n;
    });
  });
  const tiers = Object.keys(set).map((key) => set[key]).sort((a, b) => a - b);
  if (!tiers.length) tiers.push(1);
  return tiers;
}

function normalizeSkusForOrder_(rawSkus, jobId) {
  const out = [];
  const list = Array.isArray(rawSkus) ? rawSkus : [];
  for (let i = 0; i < list.length; i += 1) {
    const raw = list[i];
    if (!raw || typeof raw !== 'object') continue;
    out.push({
      skuId: trimString_(raw.skuId) || (jobId + '-SKU' + (i + 1)),
      skuKey: trimString_(raw.skuKey),
      uiName: trimString_(raw.uiName) || 'Unnamed SKU',
      vendorProductUrl: trimString_(raw.vendorProductUrl),
      imageUrl: trimString_(raw.imageUrl),
      sizesAllowed: (Array.isArray(raw.sizesAllowed) ? raw.sizesAllowed : []).map(trimString_).filter(Boolean),
      colorways: (Array.isArray(raw.colorways) ? raw.colorways : []).map(trimString_).filter(Boolean),
      printedUnitPriceByTierBySize: normalizePriceMapForOrder_(raw.printedUnitPriceByTierBySize),
      upchargeBySize: (raw.upchargeBySize && typeof raw.upchargeBySize === 'object') ? raw.upchargeBySize : {}
    });
  }
  return out;
}

/* ---------------- Order Draft Normalization + Pricing Helpers ---------------- */

function normalizePrintJobsForOrder_(rawPrintJobs) {
  const rawList = Array.isArray(rawPrintJobs)
    ? rawPrintJobs
    : ((rawPrintJobs && typeof rawPrintJobs === 'object')
      ? Object.keys(rawPrintJobs).sort().map((key) => rawPrintJobs[key])
      : []);
  return rawList
    .map((rawJob, idx) => {
      if (!rawJob || typeof rawJob !== 'object') return null;
      const printJobId = trimString_(rawJob.printJobId) || ('PJ' + (idx + 1));
      const skus = normalizeSkusForOrder_(rawJob.skus, printJobId);
      return {
        printJobId: printJobId,
        printJobName: trimString_(rawJob.printJobName) || ('Project ' + (idx + 1)),
        printJobNotes: trimString_(rawJob.printJobNotes),
        deliveryEstimate: trimString_(rawJob.deliveryEstimate),
        turnaroundTime: trimString_(rawJob.turnaroundTime),
        decorations: Array.isArray(rawJob.decorations) ? rawJob.decorations : [],
        addOns: Array.isArray(rawJob.addOns) ? rawJob.addOns.map((item, addOnIdx) => Object.assign({ __idx: addOnIdx }, item || {})) : [],
        skus: skus,
        mockups: (rawJob.mockups && typeof rawJob.mockups === 'object') ? rawJob.mockups : {},
        priceTiers: normalizeTierListForOrder_(rawJob.priceTiers, skus)
      };
    })
    .filter(Boolean);
}

function normalizePortalStateForOrder_(rawState, printJobs) {
  const parsed = safeJsonParse_(rawState, {});
  const source = (parsed && typeof parsed === 'object') ? parsed : {};
  const out = {
    printJobs: {}
  };
  function normalizeRemovedAddOnIndexes_(value) {
    const seen = {};
    return (Array.isArray(value) ? value : [])
      .map(function(item) {
        return Number(String(item).trim());
      })
      .filter(function(idx) {
        if (!Number.isFinite(idx) || idx < 0 || seen[String(idx)]) return false;
        seen[String(idx)] = true;
        return true;
      })
      .sort(function(a, b) { return a - b; });
  }
  (Array.isArray(printJobs) ? printJobs : []).forEach((job) => {
    const srcJob = source.printJobs && source.printJobs[job.printJobId] ? source.printJobs[job.printJobId] : {};
    const jobState = {
      hidden: Boolean(srcJob && srcJob.hidden === true),
      removedAddOnIndexes: normalizeRemovedAddOnIndexes_(srcJob && srcJob.removedAddOnIndexes),
      skus: {}
    };
    (Array.isArray(job.skus) ? job.skus : []).forEach((sku) => {
      const srcSku = srcJob && srcJob.skus && srcJob.skus[sku.skuId] ? srcJob.skus[sku.skuId] : {};
      const skuState = {
        hidden: Boolean(srcSku && srcSku.hidden === true),
        colorways: {}
      };
      const colors = {};
      (Array.isArray(sku.colorways) ? sku.colorways : []).forEach((color) => {
        const name = trimString_(color);
        if (name) colors[name.toLowerCase()] = name;
      });
      Object.keys((srcSku && srcSku.colorways) || {}).forEach((color) => {
        const name = trimString_(color);
        if (name) colors[name.toLowerCase()] = name;
      });
      Object.keys(colors).forEach((key) => {
        const colorName = colors[key];
        const srcColor = srcSku && srcSku.colorways && srcSku.colorways[colorName] ? srcSku.colorways[colorName] : {};
        const qtyBySize = {};
        (Array.isArray(sku.sizesAllowed) ? sku.sizesAllowed : []).forEach((size) => {
          qtyBySize[String(size)] = Math.max(0, parseInt(String(srcColor && srcColor.qtyBySize ? srcColor.qtyBySize[size] : 0), 10) || 0);
        });
        skuState.colorways[colorName] = {
          hidden: Boolean(srcColor && srcColor.hidden === true),
          qtyBySize: qtyBySize
        };
      });
      jobState.skus[sku.skuId] = skuState;
    });
    out.printJobs[job.printJobId] = jobState;
  });
  return out;
}

function shouldExcludeAddOnFromOrder_(addOn, removedIndexSet) {
  const item = (addOn && typeof addOn === 'object') ? addOn : {};
  const idx = parseInt(String(item.__idx), 10);
  if (removedIndexSet && Number.isFinite(idx) && removedIndexSet.has(idx)) return true;

  const truthyFalse = ['false', '0', 'no', 'off'];
  const hiddenFlags = [
    item.hidden,
    item.cancelled,
    item.canceled
  ];
  for (var i = 0; i < hiddenFlags.length; i += 1) {
    var raw = hiddenFlags[i];
    if (raw === true) return true;
    if (truthyFalse.indexOf(String(raw).trim().toLowerCase()) >= 0) continue;
    if (String(raw).trim().toLowerCase() === 'true') return true;
  }

  const inactiveFields = ['active', 'isActive', 'enabled', 'selected', 'included'];
  for (var j = 0; j < inactiveFields.length; j += 1) {
    var key = inactiveFields[j];
    if (!Object.prototype.hasOwnProperty.call(item, key)) continue;
    var value = item[key];
    if (value === false) return true;
    var normalized = String(value).trim().toLowerCase();
    if (truthyFalse.indexOf(normalized) >= 0) return true;
  }
  return false;
}

function getVisibleAddOnsForOrder_(job, portalState) {
  const jobState = portalState && portalState.printJobs ? portalState.printJobs[job.printJobId] : null;
  const removed = new Set(Array.isArray(jobState && jobState.removedAddOnIndexes) ? jobState.removedAddOnIndexes : []);
  return (Array.isArray(job && job.addOns) ? job.addOns : [])
    .filter(isPortalDisplayAddOn_)
    .filter(function(addOn) {
      return !shouldExcludeAddOnFromOrder_(addOn, removed);
    });
}

function getVisibleJobsForOrder_(printJobs, portalState) {
  return (Array.isArray(printJobs) ? printJobs : []).filter((job) => {
    const state = portalState && portalState.printJobs ? portalState.printJobs[job.printJobId] : null;
    return !(state && state.hidden === true);
  });
}

function getPrintJobDisplayNumberForOrder_(printJobs, printJobId) {
  const cleanId = trimString_(printJobId);
  const list = Array.isArray(printJobs) ? printJobs : [];
  for (let i = 0; i < list.length; i += 1) {
    if (trimString_(list[i] && list[i].printJobId) === cleanId) return i + 1;
  }
  return 0;
}

function getVisibleSkusForOrder_(job, portalState) {
  const jobState = portalState && portalState.printJobs ? portalState.printJobs[job.printJobId] : null;
  return (Array.isArray(job && job.skus) ? job.skus : []).filter((sku) => {
    const skuState = jobState && jobState.skus ? jobState.skus[sku.skuId] : null;
    return !(skuState && skuState.hidden === true);
  });
}

function getVisibleColorsForOrder_(jobId, sku, portalState) {
  const jobState = portalState && portalState.printJobs ? portalState.printJobs[jobId] : null;
  const skuState = jobState && jobState.skus ? jobState.skus[sku.skuId] : null;
  const colors = {};
  (Array.isArray(sku && sku.colorways) ? sku.colorways : []).forEach((color) => {
    const name = trimString_(color);
    if (name) colors[name.toLowerCase()] = name;
  });
  Object.keys((skuState && skuState.colorways) || {}).forEach((color) => {
    const name = trimString_(color);
    if (name) colors[name.toLowerCase()] = name;
  });
  return Object.keys(colors)
    .map((key) => colors[key])
    .filter((colorName) => {
      const colorState = skuState && skuState.colorways ? skuState.colorways[colorName] : null;
      return !(colorState && colorState.hidden === true);
    });
}

function getQtyBySizeForOrder_(jobId, sku, colorName, portalState) {
  const jobState = portalState && portalState.printJobs ? portalState.printJobs[jobId] : null;
  const skuState = jobState && jobState.skus ? jobState.skus[sku.skuId] : null;
  const colorState = skuState && skuState.colorways ? skuState.colorways[colorName] : null;
  const qtyBySize = {};
  (Array.isArray(sku.sizesAllowed) ? sku.sizesAllowed : []).forEach((size) => {
    qtyBySize[String(size)] = Math.max(0, parseInt(String(colorState && colorState.qtyBySize ? colorState.qtyBySize[size] : 0), 10) || 0);
  });
  return qtyBySize;
}

function getEnteredUnitsForOrderJob_(job, portalState) {
  if (!job || !job.printJobId) return 0;
  return getVisibleSkusForOrder_(job, portalState).reduce(function(jobTotal, sku) {
    return jobTotal + getVisibleColorsForOrder_(job.printJobId, sku, portalState).reduce(function(skuTotal, colorName) {
      const qtyBySize = getQtyBySizeForOrder_(job.printJobId, sku, colorName, portalState);
      return skuTotal + Object.keys(qtyBySize).reduce(function(colorTotal, size) {
        return colorTotal + Math.max(0, parseInt(String(qtyBySize[size] || 0), 10) || 0);
      }, 0);
    }, 0);
  }, 0);
}

function getMinimumUnitsForOrderJob_(job, portalState) {
  if (!job) return 0;
  const tiers = normalizeTierListForOrder_(job.priceTiers, getVisibleSkusForOrder_(job, portalState))
    .map(function(tier) { return Number(tier); })
    .filter(function(tier) { return Number.isFinite(tier) && tier > 0 && tier < 2000; })
    .sort(function(a, b) { return a - b; });
  return tiers.length ? tiers[0] : 0;
}

function buildOrderJobSelectionStateForOrder_(job, portalState, printJobs) {
  return {
    job: job,
    printJobId: trimString_(job && job.printJobId),
    printJobNumber: getPrintJobDisplayNumberForOrder_(printJobs, job && job.printJobId),
    enteredUnits: getEnteredUnitsForOrderJob_(job, portalState),
    minimumUnits: getMinimumUnitsForOrderJob_(job, portalState)
  };
}

function getOrderJobSelectionStatesForOrder_(printJobs, portalState) {
  return getVisibleJobsForOrder_(printJobs, portalState).map(function(job) {
    return buildOrderJobSelectionStateForOrder_(job, portalState, printJobs);
  });
}

function getIncludedOrderJobSelectionStates_(printJobs, portalState) {
  return getOrderJobSelectionStatesForOrder_(printJobs, portalState).filter(function(item) {
    return item.enteredUnits > 0;
  });
}

function buildOrderActionRuleState_(ctx) {
  const context = (ctx && typeof ctx === 'object') ? ctx : {};
  const row = (context.row && typeof context.row === 'object') ? context.row : {};
  const snapshot = context.snapshot || {};
  const printJobs = normalizePrintJobsForOrder_(snapshot && snapshot.printJobs);
  const portalState = normalizePortalStateForOrder_(context.portalState || {}, printJobs);
  return {
    row: row,
    snapshot: snapshot,
    printJobs: printJobs,
    portalState: portalState,
    includedJobSelectionStates: getIncludedOrderJobSelectionStates_(printJobs, portalState)
  };
}

function pickActiveTierForOrder_(tiers, totalQty) {
  const list = (Array.isArray(tiers) ? tiers : [])
    .map((tier) => Number(tier))
    .filter((tier) => Number.isFinite(tier) && tier > 0)
    .sort((a, b) => a - b);
  if (!list.length) return 1;
  const qty = Math.max(0, parseInt(String(totalQty || 0), 10) || 0);
  let chosen = list[0];
  list.forEach((tier) => {
    if (qty >= tier) chosen = tier;
  });
  return chosen;
}

function unitPriceForOrder_(sku, tier, size) {
  const map = (sku && sku.printedUnitPriceByTierBySize) || {};
  const keys = Object.keys(map)
    .map((key) => Number(key))
    .filter((num) => Number.isFinite(num))
    .sort((a, b) => a - b);
  if (!keys.length) return null;
  const wanted = Number.isFinite(Number(tier)) ? Number(tier) : keys[0];
  let chosen = keys[0];
  keys.forEach((key) => {
    if (wanted >= key) chosen = key;
  });
  const row = map[String(chosen)] || {};
  const value = Number(row[String(size)]);
  return Number.isFinite(value) ? value : null;
}

function isPortalDisplayAddOn_(addOn) {
  const raw = addOn ? addOn.portal_display : false;
  return raw === true || String(raw).toLowerCase() === 'true';
}

function isRushAddOn_(addOn) {
  const feeType = trimString_(addOn && addOn.fee_type).toLowerCase();
  const feeKey = trimString_(addOn && addOn.fee_key).toUpperCase();
  return feeType === 'percent' || feeKey.indexOf('RUSH') === 0;
}

function isShippingAddOn_(addOn) {
  const label = trimString_(
    (addOn && addOn.invoice_label) ||
    (addOn && addOn.fee_name) ||
    (addOn && addOn.name) ||
    (addOn && addOn.fee_key)
  ).toLowerCase();
  return /ship|freight|delivery/.test(label);
}

function normalizeFulfillmentMethod_(value) {
  const normalized = trimString_(value).toLowerCase();
  return normalized === FULFILLMENT_METHODS.shipping || normalized === FULFILLMENT_METHODS.pickup
    ? normalized
    : '';
}

function computeFulfillmentContextForOrderDraft_(portalState, orderTotal) {
  const fulfillmentMethod = normalizeFulfillmentMethod_(portalState && portalState.fulfillmentMethod);
  const totalCents = Math.max(0, Math.round(roundMoney_(orderTotal) * 100));
  if (fulfillmentMethod === FULFILLMENT_METHODS.shipping) {
    const qualifiesForFreeShipping = totalCents > STRIPE_FULFILLMENT_FREE_SHIPPING_THRESHOLD_CENTS;
    return {
      fulfillmentMethod: FULFILLMENT_METHODS.shipping,
      shippingChargeCents: qualifiesForFreeShipping ? 0 : STRIPE_FULFILLMENT_FLAT_RATE_SHIPPING_CENTS,
      shippingModeLabel: STRIPE_FULFILLMENT_SHIPPING_SERVICE_LABEL,
      qualifiesForFreeShipping: qualifiesForFreeShipping
    };
  }
  if (fulfillmentMethod === FULFILLMENT_METHODS.pickup) {
    return {
      fulfillmentMethod: FULFILLMENT_METHODS.pickup,
      shippingChargeCents: 0,
      shippingModeLabel: 'Local Pickup',
      qualifiesForFreeShipping: false
    };
  }
  return {
    fulfillmentMethod: '',
    shippingChargeCents: 0,
    shippingModeLabel: '',
    qualifiesForFreeShipping: false
  };
}

function extractStripeShippingDetails_(sessionObj) {
  const shippingDetails = (sessionObj && sessionObj.shipping_details && typeof sessionObj.shipping_details === 'object')
    ? sessionObj.shipping_details
    : null;
  const shippingCost = (sessionObj && sessionObj.shipping_cost && typeof sessionObj.shipping_cost === 'object')
    ? sessionObj.shipping_cost
    : null;
  if (!shippingDetails && !shippingCost) return null;
  const result = {};
  if (shippingDetails) {
    const address = shippingDetails.address && typeof shippingDetails.address === 'object'
      ? shippingDetails.address
      : null;
    result.name = trimString_(shippingDetails.name);
    result.phone = trimString_(shippingDetails.phone);
    if (address) {
      result.address = {
        line1: trimString_(address.line1),
        line2: trimString_(address.line2),
        city: trimString_(address.city),
        state: trimString_(address.state),
        postal_code: trimString_(address.postal_code),
        country: trimString_(address.country)
      };
    }
  }
  if (shippingCost) {
    result.shippingRate = trimString_(shippingCost.shipping_rate);
    result.shippingAmountTotalCents = Math.max(0, parseInt(String(shippingCost.amount_total || 0), 10) || 0);
  }
  return result;
}

function mergeOrderDraftShippingDetails_(orderDraft, sessionObj) {
  const draft = (orderDraft && typeof orderDraft === 'object')
    ? JSON.parse(JSON.stringify(orderDraft))
    : {};
  const shippingDetails = extractStripeShippingDetails_(sessionObj);
  if (!shippingDetails) return draft;
  draft.shippingDetails = shippingDetails;
  draft.shippingDetailsCaptured = true;
  return draft;
}

function computeRushAddOnAmount_(addOn, orderBasis) {
  const pct = Math.max(0, toFiniteNumber_(addOn && addOn.percent_rate, 0));
  const minAmount = Math.max(0, toFiniteNumber_(addOn && addOn.min_amount, 0));
  return roundMoney_(Math.max(minAmount, orderBasis * pct));
}

function deriveTaxAmountForOrderDraft_(row, snapshot, totalsBeforeTax, accountSummary) {
  if (accountSummary && accountSummary.taxExemptActive) return 0;
  const normalizedRow = (row && typeof row === 'object') ? row : {};
  const meta = snapshot && snapshot.meta && typeof snapshot.meta === 'object' ? snapshot.meta : {};
  const candidates = [
    normalizedRow.amounttax,
    normalizedRow.salestax,
    normalizedRow.tax,
    meta.amountTax,
    meta.salesTax,
    meta.tax
  ];
  for (let i = 0; i < candidates.length; i += 1) {
    const num = Number(candidates[i]);
    if (Number.isFinite(num) && num >= 0) return roundMoney_(num);
  }
  return 0;
}

function buildOrderDraftFromSnapshotAndPortalState_(opts) {
  const options = (opts && typeof opts === 'object') ? opts : {};
  const rowInfo = options.rowInfo || null;
  const row = rowInfo && rowInfo.rowObjNormalized ? rowInfo.rowObjNormalized : ((options.row && typeof options.row === 'object') ? options.row : {});
  const snapshot = options.snapshot || safeJsonParse_(row.snapshotjson, {});
  const printJobs = normalizePrintJobsForOrder_(snapshot && snapshot.printJobs);
  const portalStateSource = safeJsonParse_(options.portalState || row.portalstatejson || {}, {});
  const portalState = normalizePortalStateForOrder_(portalStateSource, printJobs);
  portalState.fulfillmentMethod = normalizeFulfillmentMethod_(portalStateSource && portalStateSource.fulfillmentMethod);
  portalState.shippingChargeCents = Math.max(0, parseInt(String(portalStateSource && portalStateSource.shippingChargeCents || 0), 10) || 0);
  portalState.shippingModeLabel = trimString_(portalStateSource && portalStateSource.shippingModeLabel);
  const accountSummary = options.accountSummary || null;
  const dealNumber = trimString_(row.dealnumber || (snapshot && snapshot.meta && snapshot.meta.dealNumber));
  const includedJobSelectionStates = getIncludedOrderJobSelectionStates_(printJobs, portalState);
  const taxExemptApplied = Boolean(accountSummary && accountSummary.taxExemptActive);
  const selectedJobs = [];
  const canceledJobs = [];

  let amountSubtotal = 0;
  let amountShipping = 0;
  let amountRush = 0;
  let totalUnits = 0;

  printJobs.forEach((job) => {
    const jobState = portalState && portalState.printJobs ? portalState.printJobs[job.printJobId] : null;
    if (jobState && jobState.hidden === true) {
      canceledJobs.push({
        printJobId: job.printJobId,
        printJobName: job.printJobName
      });
    }
  });

  includedJobSelectionStates.forEach((selectionState) => {
    const job = selectionState.job;
    const printJobNumber = selectionState.printJobNumber || getPrintJobDisplayNumberForOrder_(printJobs, job && job.printJobId) || 1;
    const visibleSkus = getVisibleSkusForOrder_(job, portalState);
    let jobQty = 0;
    let jobSubtotal = 0;
    const skuSummaries = [];
    const skuWorking = [];

    visibleSkus.forEach((sku) => {
      let skuUnits = 0;
      const colorSummaries = [];
      getVisibleColorsForOrder_(job.printJobId, sku, portalState).forEach((colorName) => {
        const qtyBySize = getQtyBySizeForOrder_(job.printJobId, sku, colorName, portalState);
        const rowUnits = Object.keys(qtyBySize).reduce((sum, size) => sum + Math.max(0, parseInt(String(qtyBySize[size] || 0), 10) || 0), 0);
        if (rowUnits <= 0) return;
        skuUnits += rowUnits;
        colorSummaries.push({
          colorway: colorName,
          qtyBySize: qtyBySize,
          units: rowUnits
        });
      });
      if (!skuUnits) return;
      jobQty += skuUnits;
      skuWorking.push({
        sku: sku,
        units: skuUnits,
        colors: colorSummaries
      });
    });

    const activeTier = pickActiveTierForOrder_(job.priceTiers, jobQty);
    skuWorking.forEach((entry) => {
      let skuTotal = 0;
      const priceBucketMap = {};
      const priceBuckets = [];
      entry.colors.forEach((colorSummary) => {
        Object.keys(colorSummary.qtyBySize).forEach((size) => {
          const qty = Math.max(0, parseInt(String(colorSummary.qtyBySize[size] || 0), 10) || 0);
          if (!qty) return;
          const unitPrice = unitPriceForOrder_(entry.sku, activeTier, size);
          if (unitPrice == null) return;
          const lineTotal = qty * unitPrice;
          const unitPriceRounded = roundMoney_(unitPrice);
          const unitPriceCents = Math.max(0, Math.round(unitPriceRounded * 100));
          const lineTotalCents = unitPriceCents * qty;
          skuTotal += lineTotal;
          const colorKey = trimString_(colorSummary.colorway).toLowerCase();
          const unitPriceKey = unitPriceRounded.toFixed(2);
          const bucketKey = colorKey + '|' + unitPriceKey;
          let bucket = priceBucketMap[bucketKey];
          if (!bucket) {
            bucket = {
              colorway: trimString_(colorSummary.colorway),
              unitPrice: unitPriceRounded,
              unitPriceCents: unitPriceCents,
              units: 0,
              total: 0,
              totalCents: 0,
              qtyBySize: {}
            };
            priceBucketMap[bucketKey] = bucket;
            priceBuckets.push(bucket);
          }
          bucket.units += qty;
          bucket.total += lineTotal;
          bucket.totalCents += lineTotalCents;
          bucket.qtyBySize[String(size)] = (bucket.qtyBySize[String(size)] || 0) + qty;
        });
      });
      jobSubtotal += skuTotal;
      skuSummaries.push({
        skuId: entry.sku.skuId,
        skuKey: entry.sku.skuKey,
        uiName: entry.sku.uiName,
        vendorProductUrl: entry.sku.vendorProductUrl,
        imageUrl: entry.sku.imageUrl,
        units: entry.units,
        total: roundMoney_(skuTotal),
        colors: entry.colors,
        priceBuckets: priceBuckets.map((bucket) => ({
          colorway: bucket.colorway,
          unitPrice: roundMoney_(bucket.unitPrice),
          unitPriceCents: Math.max(0, parseInt(String(bucket.unitPriceCents || 0), 10) || 0),
          units: bucket.units,
          total: roundMoney_(bucket.totalCents / 100),
          totalCents: Math.max(0, parseInt(String(bucket.totalCents || 0), 10) || 0),
          qtyBySize: bucket.qtyBySize
        }))
      });
    });

    amountSubtotal += jobSubtotal;

    const visibleAddOns = getVisibleAddOnsForOrder_(job, portalState);
    let staticPositive = 0;
    visibleAddOns.forEach((addOn) => {
      if (isRushAddOn_(addOn)) return;
      staticPositive += Math.max(0, toFiniteNumber_(addOn.amount, 0));
    });
    const rushBasis = Math.max(0, jobSubtotal + staticPositive);

    const addOnSummaries = [];
    visibleAddOns.forEach((addOn) => {
      const amount = isRushAddOn_(addOn)
        ? computeRushAddOnAmount_(addOn, rushBasis)
        : roundMoney_(toFiniteNumber_(addOn.amount, 0));
      if (!amount) return;
      if (isRushAddOn_(addOn)) amountRush += amount;
      else amountShipping += amount;
      addOnSummaries.push({
        label: trimString_(
          addOn.invoice_label ||
          addOn.fee_name ||
          addOn.name ||
          addOn.fee_key
        ),
        amount: amount,
        type: isRushAddOn_(addOn) ? 'rush' : (isShippingAddOn_(addOn) ? 'shipping' : 'fee')
      });
    });

    totalUnits += jobQty;
    selectedJobs.push({
      printJobId: job.printJobId,
      printJobNumber: printJobNumber,
      printJobName: job.printJobName,
      deliveryEstimate: job.deliveryEstimate,
      turnaroundTime: job.turnaroundTime,
      decorations: Array.isArray(job.decorations) ? job.decorations : [],
      units: jobQty,
      skus: skuSummaries,
      addOns: addOnSummaries,
      mockups: {
        previewMockupFileId: trimString_(job.mockups && job.mockups.previewMockupFileId),
        artMockupFileId: trimString_(job.mockups && job.mockups.artMockupFileId),
        garmentMockupFileId: trimString_(job.mockups && job.mockups.garmentMockupFileId),
        previewUrl: trimString_(job.mockups && job.mockups.previewUrl)
      }
    });
  });

  amountSubtotal = roundMoney_(amountSubtotal);
  amountShipping = roundMoney_(amountShipping);
  amountRush = roundMoney_(amountRush);
  const amountTax = roundMoney_(deriveTaxAmountForOrderDraft_(row, snapshot, amountSubtotal + amountShipping + amountRush, accountSummary));
  const amountGrandTotal = roundMoney_(amountSubtotal + amountShipping + amountRush + amountTax);
  const fulfillment = computeFulfillmentContextForOrderDraft_(portalState, amountGrandTotal);
  const orgContext = deriveOrgContextFromRow_(row);
  const currency = trimString_(options.currency || (snapshot && snapshot.meta && snapshot.meta.currency) || getConfig_().stripePriceCurrency || DEFAULT_STRIPE_PRICE_CURRENCY).toUpperCase();

  return {
    token: trimString_(options.token || row.token),
    snapshotId: trimString_(row.snapshotid || (snapshot && snapshot.meta && snapshot.meta.snapshotId)),
    dealNumber: trimString_(row.dealnumber || (snapshot && snapshot.meta && snapshot.meta.dealNumber)),
    projectName: deriveProjectNameForNotification_(row, snapshot, {}),
    personEmail: normalizeEmail_(orgContext.personEmail),
    orgId: trimString_(options.orgId || (accountSummary && accountSummary.orgId) || orgContext.orgId),
    orgName: trimString_(options.orgName || (accountSummary && accountSummary.orgName) || orgContext.orgName),
    accountId: trimString_(accountSummary && accountSummary.accountId),
    selectedJobs: selectedJobs,
    canceledJobs: canceledJobs,
    totalUnits: totalUnits,
    amountSubtotal: amountSubtotal,
    amountShipping: amountShipping,
    amountRush: amountRush,
    amountTax: amountTax,
    amountGrandTotal: amountGrandTotal,
    fulfillmentMethod: fulfillment.fulfillmentMethod,
    shippingChargeCents: fulfillment.shippingChargeCents,
    shippingCharge: roundMoney_(fulfillment.shippingChargeCents / 100),
    shippingModeLabel: fulfillment.shippingModeLabel,
    qualifiesForFreeShipping: fulfillment.qualifiesForFreeShipping,
    currency: currency || DEFAULT_STRIPE_PRICE_CURRENCY,
    taxStatusApplied: taxExemptApplied ? 'tax_exempt_active' : 'standard',
    taxExemptApplied: taxExemptApplied,
    portalLockState: trimString_(row.portallockstate) || PORTAL_LOCK_STATES.editable,
    paymentState: trimString_(row.currentpaymentstate) || PAYMENT_STATES.not_started,
    paymentMethodSelected: trimString_(row.currentpaymentmethod),
    productionAuthorizationState: trimString_(row.currentproductionauthorizationstate) || PRODUCTION_AUTHORIZATION_STATES.not_authorized,
    orderState: trimString_(row.currentorderstate) || ORDER_STATES.draft,
    createdAt: nowIso_(),
    generatedAt: nowIso_()
  };
}

function getOrderSheet_(ss, cfg) {
  return ensureNamedSheetWithHeaders_(ss, cfg.portalOrdersSheetName, PORTAL_ORDER_HEADERS);
}

function getPortalAccountSheet_(ss, cfg) {
  return ensureNamedSheetWithHeaders_(ss, cfg.portalAccountsSheetName, PORTAL_ACCOUNT_HEADERS);
}

function buildPortalOrderSummary_(row) {
  const order = (row && typeof row === 'object') ? row : {};
  return {
    orderId: trimString_(order.orderid || order.orderId),
    checkoutAttemptId: trimString_(order.checkoutattemptid || order.checkoutAttemptId),
    orderRevision: Math.max(1, parseInt(String(order.orderrevision || order.orderRevision || 1), 10) || 1),
    portalLockState: trimString_(order.portallockstate || order.portalLockState) || PORTAL_LOCK_STATES.editable,
    orderState: trimString_(order.orderstate || order.orderState) || ORDER_STATES.draft,
    paymentMethodSelected: trimString_(order.paymentmethodselected || order.paymentMethodSelected),
    paymentState: trimString_(order.paymentstate || order.paymentState) || PAYMENT_STATES.not_started,
    productionAuthorizationState: trimString_(order.productionauthorizationstate || order.productionAuthorizationState) || PRODUCTION_AUTHORIZATION_STATES.not_authorized,
    invoiceNumber: trimString_(order.invoicenumber || order.invoiceNumber),
    invoicePdfUrl: trimString_(order.invoicepdfurl || order.invoicePdfUrl),
    amountGrandTotal: roundMoney_(order.amountgrandtotal || order.amountGrandTotal || 0),
    amountTax: roundMoney_(order.amounttax || order.amountTax || 0),
    currency: trimString_(order.currency || DEFAULT_STRIPE_PRICE_CURRENCY) || DEFAULT_STRIPE_PRICE_CURRENCY,
    paidAt: trimString_(order.paidat || order.paidAt),
    authorizedToProduceAt: trimString_(order.authorizedtoproduceat || order.authorizedToProduceAt),
    lockedAt: trimString_(order.lockedat || order.lockedAt),
    stripeSessionId: trimString_(order.stripesessionid || order.stripeSessionId),
    stripePaymentIntentId: trimString_(order.stripepaymentintentid || order.stripePaymentIntentId),
    lastUpdatedAt: trimString_(order.lastupdatedat || order.lastUpdatedAt)
  };
}

function getLatestPortalOrderByToken_(token, options) {
  const cleanToken = trimString_(token);
  if (!cleanToken) return null;
  const opts = (options && typeof options === 'object') ? options : {};
  const cfg = opts.cfg || getConfig_();
  const ss = opts.ss || SpreadsheetApp.openById(cfg.sheetId);
  const ordersSheet = opts.ordersSheet || getOrderSheet_(ss, cfg);
  const rows = listSheetRowInfos_(ordersSheet).filter((info) => trimString_(info.rowObjNormalized.token) === cleanToken);
  if (!rows.length) return null;
  rows.sort((a, b) => {
    const revA = Math.max(1, parseInt(String(a.rowObjNormalized.orderrevision || 1), 10) || 1);
    const revB = Math.max(1, parseInt(String(b.rowObjNormalized.orderrevision || 1), 10) || 1);
    if (revA !== revB) return revB - revA;
    const tsA = parseIsoDateMs_(a.rowObjNormalized.lastupdatedat || a.rowObjNormalized.createdat);
    const tsB = parseIsoDateMs_(b.rowObjNormalized.lastupdatedat || b.rowObjNormalized.createdat);
    return tsB - tsA;
  });
  return rows[0];
}

function getPortalOrderByCheckoutAttemptId_(checkoutAttemptId, options) {
  const id = trimString_(checkoutAttemptId);
  if (!id) return null;
  const opts = (options && typeof options === 'object') ? options : {};
  const cfg = opts.cfg || getConfig_();
  const ss = opts.ss || SpreadsheetApp.openById(cfg.sheetId);
  const ordersSheet = opts.ordersSheet || getOrderSheet_(ss, cfg);
  return listSheetRowInfos_(ordersSheet).find((info) => trimString_(info.rowObjNormalized.checkoutattemptid) === id) || null;
}

function getPortalOrderByStripeSessionId_(stripeSessionId, options) {
  const id = trimString_(stripeSessionId);
  if (!id) return null;
  const opts = (options && typeof options === 'object') ? options : {};
  const cfg = opts.cfg || getConfig_();
  const ss = opts.ss || SpreadsheetApp.openById(cfg.sheetId);
  const ordersSheet = opts.ordersSheet || getOrderSheet_(ss, cfg);
  return listSheetRowInfos_(ordersSheet).find((info) => trimString_(info.rowObjNormalized.stripesessionid) === id) || null;
}

function getPortalOrderByOrderId_(orderId, options) {
  const id = trimString_(orderId);
  if (!id) return null;
  const opts = (options && typeof options === 'object') ? options : {};
  const cfg = opts.cfg || getConfig_();
  const ss = opts.ss || SpreadsheetApp.openById(cfg.sheetId);
  const ordersSheet = opts.ordersSheet || getOrderSheet_(ss, cfg);
  const matches = listSheetRowInfos_(ordersSheet).filter((info) => trimString_(info.rowObjNormalized.orderid) === id);
  if (!matches.length) return null;
  matches.sort((a, b) => {
    const revA = Math.max(1, parseInt(String(a.rowObjNormalized.orderrevision || 1), 10) || 1);
    const revB = Math.max(1, parseInt(String(b.rowObjNormalized.orderrevision || 1), 10) || 1);
    return revB - revA;
  });
  return matches[0];
}

function createPortalOrder_(opts) {
  const options = (opts && typeof opts === 'object') ? opts : {};
  const cfg = options.cfg || getConfig_();
  const ss = options.ss || SpreadsheetApp.openById(cfg.sheetId);
  const infra = options.infra || ensurePortalInfrastructure_(ss, cfg);
  const ordersSheet = infra.ordersSheet;
  const header = ordersSheet.getRange(1, 1, 1, ordersSheet.getLastColumn()).getValues()[0];
  const colMap = buildColumnMap_(header);
  const draft = options.orderDraft || {};
  const now = trimString_(options.nowIso) || nowIso_();
  const rowVals = new Array(ordersSheet.getLastColumn()).fill('');

  const orderId = trimString_(options.orderId) || newPortalId_('ord');
  const checkoutAttemptId = trimString_(options.checkoutAttemptId);
  const orderRevision = Math.max(1, parseInt(String(options.orderRevision || 1), 10) || 1);
  const invoiceNumber = trimString_(options.invoiceNumber);
  const invoicePdfUrl = trimString_(options.invoicePdfUrl);
  const invoiceSentToEmail = normalizeEmail_(options.invoiceSentToEmail || draft.personEmail);
  const invoiceSentAt = trimString_(options.invoiceSentAt);

  const valuesByHeader = {
    orderId: orderId,
    checkoutAttemptId: checkoutAttemptId,
    orderRevision: orderRevision,
    token: trimString_(draft.token),
    snapshotId: trimString_(draft.snapshotId),
    dealNumber: trimString_(draft.dealNumber),
    projectName: trimString_(draft.projectName),
    personEmail: normalizeEmail_(draft.personEmail),
    orgId: trimString_(draft.orgId),
    orgName: trimString_(draft.orgName),
    accountId: trimString_(draft.accountId),
    createdAt: trimString_(options.createdAt) || now,
    lastUpdatedAt: now,
    portalLockState: trimString_(options.portalLockState || draft.portalLockState || PORTAL_LOCK_STATES.editable),
    orderState: trimString_(options.orderState || draft.orderState || ORDER_STATES.draft),
    paymentMethodSelected: trimString_(options.paymentMethodSelected || draft.paymentMethodSelected),
    paymentState: trimString_(options.paymentState || draft.paymentState || PAYMENT_STATES.not_started),
    productionAuthorizationState: trimString_(options.productionAuthorizationState || draft.productionAuthorizationState || PRODUCTION_AUTHORIZATION_STATES.not_authorized),
    clientReapprovalRequired: boolFromCell_(options.clientReapprovalRequired),
    taxStatusApplied: trimString_(draft.taxStatusApplied),
    taxExemptApplied: Boolean(draft.taxExemptApplied),
    amountSubtotal: roundMoney_(draft.amountSubtotal),
    amountShipping: roundMoney_(draft.amountShipping),
    amountRush: roundMoney_(draft.amountRush),
    amountTax: roundMoney_(draft.amountTax),
    amountGrandTotal: roundMoney_(draft.amountGrandTotal),
    currency: trimString_(draft.currency || cfg.stripePriceCurrency || DEFAULT_STRIPE_PRICE_CURRENCY),
    stripeSessionId: trimString_(options.stripeSessionId),
    stripePaymentIntentId: trimString_(options.stripePaymentIntentId),
    invoiceNumber: invoiceNumber,
    invoicePdfUrl: invoicePdfUrl,
    invoiceSentToEmail: invoiceSentToEmail,
    invoiceSentAt: invoiceSentAt,
    poNumber: trimString_(options.poNumber),
    poDocumentUrl: trimString_(options.poDocumentUrl),
    poSubmittedBy: trimString_(options.poSubmittedBy),
    poSubmittedAt: trimString_(options.poSubmittedAt),
    paidAt: trimString_(options.paidAt),
    authorizedToProduceAt: trimString_(options.authorizedToProduceAt),
    lockedAt: trimString_(options.lockedAt),
    paymentReceivedManuallyBy: trimString_(options.paymentReceivedManuallyBy),
    paymentReceivedManuallyAt: trimString_(options.paymentReceivedManuallyAt),
    orderDraftJson: JSON.stringify(draft || {}),
    revisionReason: trimString_(options.revisionReason),
    notes: trimString_(options.notes)
  };

  Object.keys(valuesByHeader).forEach((headerKey) => {
    const col = colMap[normalizeHeaderKey_(headerKey)];
    if (!col) return;
    rowVals[col - 1] = valuesByHeader[headerKey];
  });

  const row = ordersSheet.getLastRow() + 1;
  ordersSheet.getRange(row, 1, 1, rowVals.length).setValues([rowVals]);
  const rowInfo = buildRowInfoFromSheet_(ordersSheet, row, header, rowVals);
  return {
    rowInfo: rowInfo,
    summary: buildPortalOrderSummary_(rowInfo.rowObjNormalized)
  };
}

function appendPortalOrderRevision_(opts) {
  const options = (opts && typeof opts === 'object') ? opts : {};
  const existing = options.existingOrderRowInfo || null;
  const current = existing || (options.orderId
    ? getPortalOrderByOrderId_(options.orderId, options)
    : getLatestPortalOrderByToken_(options.token, options));
  if (!current) throw new Error('Order not found for revision.');
  const currentDraft = safeJsonParse_(current.rowObjNormalized.orderdraftjson, {});
  const nextDraft = Object.assign({}, currentDraft, options.orderDraft || {});
  return createPortalOrder_(Object.assign({}, options, {
    orderId: trimString_(current.rowObjNormalized.orderid),
    orderRevision: Math.max(1, parseInt(String(current.rowObjNormalized.orderrevision || 1), 10) || 1) + 1,
    orderDraft: nextDraft
  }));
}

function updatePortalOrderState_(opts) {
  const options = (opts && typeof opts === 'object') ? opts : {};
  const cfg = options.cfg || getConfig_();
  const ss = options.ss || SpreadsheetApp.openById(cfg.sheetId);
  const infra = options.infra || ensurePortalInfrastructure_(ss, cfg);
  const ordersSheet = infra.ordersSheet;
  const orderInfo = options.orderRowInfo ||
    getPortalOrderByCheckoutAttemptId_(options.checkoutAttemptId, { cfg: cfg, ss: ss, ordersSheet: ordersSheet }) ||
    getPortalOrderByStripeSessionId_(options.stripeSessionId, { cfg: cfg, ss: ss, ordersSheet: ordersSheet }) ||
    getLatestPortalOrderByToken_(options.token, { cfg: cfg, ss: ss, ordersSheet: ordersSheet });
  if (!orderInfo) {
    throw new Error('Order not found.');
  }
  const now = trimString_(options.nowIso) || nowIso_();
  const updates = {
    lastUpdatedAt: now
  };
  [
    'checkoutAttemptId',
    'portalLockState',
    'orderState',
    'paymentMethodSelected',
    'paymentState',
    'productionAuthorizationState',
    'stripeSessionId',
    'stripePaymentIntentId',
    'invoiceNumber',
    'invoicePdfUrl',
    'invoiceSentToEmail',
    'invoiceSentAt',
    'poNumber',
    'poDocumentUrl',
    'poSubmittedBy',
    'poSubmittedAt',
    'paidAt',
    'authorizedToProduceAt',
    'lockedAt',
    'paymentReceivedManuallyBy',
    'paymentReceivedManuallyAt',
    'revisionReason',
    'notes'
  ].forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(options, key)) return;
    updates[key] = options[key];
  });
  if (Object.prototype.hasOwnProperty.call(options, 'clientReapprovalRequired')) {
    updates.clientReapprovalRequired = boolFromCell_(options.clientReapprovalRequired);
  }
  if (options.orderDraft) {
    updates.orderDraftJson = JSON.stringify(options.orderDraft);
    if (Object.prototype.hasOwnProperty.call(options.orderDraft, 'amountTax')) updates.amountTax = roundMoney_(options.orderDraft.amountTax);
    if (Object.prototype.hasOwnProperty.call(options.orderDraft, 'amountGrandTotal')) updates.amountGrandTotal = roundMoney_(options.orderDraft.amountGrandTotal);
  }
  setRowValuesByHeaderMap_(ordersSheet, orderInfo.row, orderInfo.colMap, updates);
  return buildRowInfoFromSheet_(ordersSheet, orderInfo.row);
}

/* ---------------- Order Persistence + Invoices + Notifications ---------------- */

function writeCurrentOrderPointersToExportLog_(opts) {
  const options = (opts && typeof opts === 'object') ? opts : {};
  const cfg = options.cfg || getConfig_();
  const ss = options.ss || SpreadsheetApp.openById(cfg.sheetId);
  const infra = options.infra || ensurePortalInfrastructure_(ss, cfg);
  const exportSheet = infra.exportSheet;
  const rowInfo = options.rowInfo || findRowByToken_(exportSheet, trimString_(options.token));
  if (!rowInfo) throw new Error('Token not found.');
  const orderSummary = options.orderSummary || {};
  const accountSummary = options.accountSummary || {};
  const updates = {
    activeOrderId: trimString_(orderSummary.orderId || options.activeOrderId),
    latestCheckoutAttemptId: trimString_(orderSummary.checkoutAttemptId || options.latestCheckoutAttemptId),
    currentAccountId: trimString_(accountSummary.accountId || options.currentAccountId),
    portalLockState: trimString_(orderSummary.portalLockState || options.portalLockState),
    currentOrderState: trimString_(orderSummary.orderState || options.currentOrderState),
    currentPaymentState: trimString_(orderSummary.paymentState || options.currentPaymentState),
    currentProductionAuthorizationState: trimString_(orderSummary.productionAuthorizationState || options.currentProductionAuthorizationState),
    currentPaymentMethod: trimString_(orderSummary.paymentMethodSelected || options.currentPaymentMethod),
    termsApproved: Boolean(accountSummary.termsApproved === true || options.termsApproved === true),
    taxExemptApproved: Boolean(accountSummary.taxExemptApproved === true || options.taxExemptApproved === true),
    latestInvoiceNumber: trimString_(orderSummary.invoiceNumber || options.latestInvoiceNumber),
    lastOrderUpdatedAt: trimString_(orderSummary.lastUpdatedAt || options.lastOrderUpdatedAt || nowIso_())
  };
  if (Object.prototype.hasOwnProperty.call(options, 'status')) {
    updates.status = options.status;
  }
  setRowValuesByHeaderMap_(exportSheet, rowInfo.row, rowInfo.colMap, updates);
  SpreadsheetApp.flush();
  return buildRowInfoFromSheet_(exportSheet, rowInfo.row);
}

function buildCurrentOrderStateSummaryFromRow_(row, accountSummary, latestOrderSummary) {
  const normalizedRow = (row && typeof row === 'object') ? row : {};
  const latest = latestOrderSummary || {};
  const account = accountSummary || {};
  return {
    activeOrderId: trimString_(normalizedRow.activeorderid || latest.orderId),
    latestCheckoutAttemptId: trimString_(normalizedRow.latestcheckoutattemptid || latest.checkoutAttemptId),
    currentAccountId: trimString_(normalizedRow.currentaccountid || account.accountId),
    portalLockState: trimString_(normalizedRow.portallockstate || latest.portalLockState || PORTAL_LOCK_STATES.editable),
    currentOrderState: trimString_(normalizedRow.currentorderstate || latest.orderState || ORDER_STATES.draft),
    currentPaymentState: trimString_(normalizedRow.currentpaymentstate || latest.paymentState || PAYMENT_STATES.not_started),
    currentProductionAuthorizationState: trimString_(normalizedRow.currentproductionauthorizationstate || latest.productionAuthorizationState || PRODUCTION_AUTHORIZATION_STATES.not_authorized),
    currentPaymentMethod: trimString_(normalizedRow.currentpaymentmethod || latest.paymentMethodSelected),
    termsApproved: boolFromCell_(normalizedRow.termsapproved || account.termsApproved),
    taxExemptApproved: boolFromCell_(normalizedRow.taxexemptapproved || account.taxExemptApproved),
    latestInvoiceNumber: trimString_(normalizedRow.latestinvoicenumber || latest.invoiceNumber),
    lastOrderUpdatedAt: trimString_(normalizedRow.lastorderupdatedat || latest.lastUpdatedAt)
  };
}

function nextInvoiceNumber_() {
  const stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'America/Detroit', 'yyyyMMdd');
  return 'INV-' + stamp + '-' + Utilities.getUuid().slice(0, 8).toUpperCase();
}

function getDriveFolderByIdSafe_(folderId) {
  const id = trimString_(folderId);
  if (!id) return null;
  try {
    return DriveApp.getFolderById(id);
  } catch (_) {
    return null;
  }
}

function generateInvoiceDocumentForOrder_(orderRowOrDraft, options) {
  const opts = (options && typeof options === 'object') ? options : {};
  const cfg = opts.cfg || getConfig_();
  const order = (orderRowOrDraft && typeof orderRowOrDraft === 'object') ? orderRowOrDraft : {};
  const draft = safeJsonParse_(order.orderdraftjson || order.orderDraftJson, null) || order;
  const invoiceNumber = trimString_(opts.invoiceNumber || order.invoicenumber || order.invoiceNumber) || nextInvoiceNumber_();
  const folder = getDriveFolderByIdSafe_(cfg.invoiceDriveFolderId);
  if (!folder) {
    throw new Error('Invoice folder is not configured.');
  }

  const title = invoiceNumber + ' - ' + trimString_(draft.projectName || order.projectname || 'Portal Order');
  const doc = DocumentApp.create(title);
  const body = doc.getBody();
  body.clear();
  body.appendParagraph('Red Threads Portal Invoice').setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph('Invoice Number: ' + invoiceNumber);
  body.appendParagraph('Project: ' + trimString_(draft.projectName || order.projectname || '--'));
  body.appendParagraph('Deal Number: ' + trimString_(draft.dealNumber || order.dealnumber || '--'));
  body.appendParagraph('Client Email: ' + normalizeEmail_(draft.personEmail || order.personemail || '--'));
  body.appendParagraph('Created At: ' + trimString_(order.createdat || order.createdAt || draft.createdAt || nowIso_()));
  body.appendParagraph('');
  body.appendParagraph('Amount Summary').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph('Subtotal: ' + roundMoney_(draft.amountSubtotal));
  body.appendParagraph('Shipping / Fees: ' + roundMoney_(draft.amountShipping));
  body.appendParagraph('Rush: ' + roundMoney_(draft.amountRush));
  body.appendParagraph('Tax: ' + roundMoney_(draft.amountTax));
  body.appendParagraph('Grand Total: ' + roundMoney_(draft.amountGrandTotal) + ' ' + trimString_(draft.currency || order.currency || cfg.stripePriceCurrency || DEFAULT_STRIPE_PRICE_CURRENCY));
  body.appendParagraph('');
  body.appendParagraph('Selected Print Jobs').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  (Array.isArray(draft.selectedJobs) ? draft.selectedJobs : []).forEach((job) => {
    body.appendParagraph(
      'Print Job ' + trimString_(job.printJobNumber || '') +
      ' — ' + trimString_(job.printJobName || '--') +
      ' (' + Math.max(0, parseInt(String(job.units || 0), 10) || 0) + ' units)'
    );
  });
  doc.saveAndClose();

  const docFile = DriveApp.getFileById(doc.getId());
  const pdfBlob = docFile.getAs(MimeType.PDF).setName(title + '.pdf');
  const pdfFile = folder.createFile(pdfBlob);
  pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  docFile.setTrashed(true);

  return {
    invoiceNumber: invoiceNumber,
    invoicePdfUrl: pdfFile.getUrl(),
    invoiceFileId: pdfFile.getId()
  };
}

function sendInvoiceEmailForOrder_(orderSummary, invoiceInfo, options) {
  const opts = (options && typeof options === 'object') ? options : {};
  const order = (orderSummary && typeof orderSummary === 'object') ? orderSummary : {};
  const invoice = (invoiceInfo && typeof invoiceInfo === 'object') ? invoiceInfo : {};
  const email = normalizeEmail_(opts.to || order.personEmail || order.personemail);
  if (!email) return { ok: false, skipped: true, reason: 'missing-email' };
  const portalUrl = trimString_(buildPortalDirectUrl_(order.token));
  const invoicePdfUrl = trimString_(invoice.invoicePdfUrl || order.invoicePdfUrl);
  const subject = 'Red Threads Invoice ' + trimString_(invoice.invoiceNumber || order.invoiceNumber || '');
  const body = [
    'Your Red Threads order invoice is ready.',
    '',
    'Project: ' + trimString_(order.projectName || order.projectname || '--'),
    'Invoice Number: ' + trimString_(invoice.invoiceNumber || order.invoiceNumber || '--'),
    'Invoice PDF: ' + (invoicePdfUrl || '--'),
    portalUrl ? ('Portal: ' + portalUrl) : '',
    '',
    'This inbox is not monitored.',
    portalUrl
      ? NOTIFICATION_REPLY_NOTICE
      : 'Please use your Red Threads portal link to view updates or respond.'
  ].filter(Boolean).join('\n');
  const htmlBody = [
    '<div style="margin:0;padding:24px 0;background:#f4f6fb;">',
    '  <div style="max-width:640px;margin:0 auto;padding:32px 28px;background:#ffffff;border:1px solid #e6ebf3;border-radius:18px;font-family:Arial,sans-serif;color:#142033;">',
    '    <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#73829a;font-weight:700;margin-bottom:12px;">Red Threads</div>',
    '    <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;color:#142033;">Your Invoice Is Ready</h1>',
    '    <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#35435a;">Use the portal to review updates or respond. Your invoice PDF is linked below for reference.</p>',
    '    <div style="margin:0 0 20px;padding:18px 20px;border-radius:14px;background:#f7f9fc;border:1px solid #e6ebf3;">',
    '      <div style="font-size:14px;line-height:1.8;color:#35435a;"><strong>Project:</strong> ' + escapeHtml_(trimString_(order.projectName || order.projectname || '--')) + '</div>',
    '      <div style="font-size:14px;line-height:1.8;color:#35435a;"><strong>Invoice Number:</strong> ' + escapeHtml_(trimString_(invoice.invoiceNumber || order.invoiceNumber || '--')) + '</div>',
    invoicePdfUrl
      ? ('      <div style="font-size:14px;line-height:1.8;color:#35435a;"><strong>Invoice PDF:</strong> <a href="' + escapeHtml_(invoicePdfUrl) + '" style="color:#12b5ea;">View PDF</a></div>')
      : '      <div style="font-size:14px;line-height:1.8;color:#35435a;"><strong>Invoice PDF:</strong> Pending</div>',
    '    </div>',
    portalUrl
      ? ('    <p style="margin:0 0 14px;"><a href="' + escapeHtml_(portalUrl) + '" style="display:inline-block;padding:14px 20px;border-radius:999px;background:#12b5ea;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;">Open Portal</a></p>')
      : '',
    '    <p style="margin:0;font-size:14px;line-height:1.6;color:#5f6f86;">' + escapeHtml_(portalUrl ? NOTIFICATION_REPLY_NOTICE : 'This inbox is not monitored. Please use your Red Threads portal link to view updates or respond.') + '</p>',
    '  </div>',
    '</div>'
  ].join('\n');
  return sendNotificationEmail_({
    to: email,
    subject: subject,
    body: body,
    htmlBody: htmlBody
  });
}

function sendPortalMessageNotificationEmail_(rowInfo, message, options) {
  const opts = (options && typeof options === 'object') ? options : {};
  const row = rowInfo && rowInfo.rowObjNormalized ? rowInfo.rowObjNormalized : {};
  const recipientEmail = normalizeEmail_(row[EXPORT_LOG_PERSON_EMAIL_HEADER]);
  if (!recipientEmail) return { ok: false, skipped: true, reason: 'missing-email' };

  const senderName = trimString_(opts.senderName || getVisibleTeamAuthorName_(row) || 'Red Threads Team');
  const clientName = trimString_(
    row.personname ||
    row.clientname ||
    row.orgname ||
    'there'
  );
  const firstName = trimString_(clientName.split(/\s+/)[0]) || 'there';
  const portalUrl = buildExternalPortalUrl_(trimString_(opts.token || row.token));
  const projectName = trimString_(opts.projectName || deriveProjectNameForNotification_(row, safeJsonParse_(row.snapshotjson, null), opts));
  const subject = '🚩 ' + senderName + ' has responded to your message';
  const body = [
    'Hi ' + firstName + ',',
    '',
    senderName + ' has responded to your message in your Red Threads portal.',
    portalUrl ? ('Open your portal here: ' + portalUrl) : '',
    '',
    'This is an automated message from an unmonitored inbox. Please do not reply or respond.',
    '',
    '- Red Threads Team'
  ].filter(Boolean).join('\n');
  const htmlBody = [
    '<div style="margin:0;padding:24px 0;background:#f4f6fb;">',
    '  <div style="max-width:640px;margin:0 auto;padding:32px 28px;background:#ffffff;border:1px solid #e6ebf3;border-radius:18px;font-family:Arial,sans-serif;color:#142033;">',
    '    <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#73829a;font-weight:700;margin-bottom:12px;">Red Threads Portal Message</div>',
    '    <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;color:#142033;">You have a new message</h1>',
    '    <p style="margin:0 0 14px;font-size:16px;line-height:1.7;color:#35435a;">Hi ' + escapeHtml_(firstName) + ',</p>',
    '    <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#35435a;"><strong>' + escapeHtml_(senderName) + '</strong> has responded to your message in your Red Threads portal.</p>',
    projectName
      ? ('    <div style="margin:0 0 20px;padding:18px 20px;border-radius:14px;background:#f7f9fc;border:1px solid #e6ebf3;"><div style="font-size:14px;line-height:1.8;color:#35435a;"><strong>Project:</strong> ' + escapeHtml_(projectName) + '</div></div>')
      : '',
    portalUrl
      ? ('    <p style="margin:0 0 18px;"><a href="' + escapeHtml_(portalUrl) + '" style="display:inline-block;padding:14px 22px;border-radius:999px;background:linear-gradient(135deg,#fb7185 0%, #f43f5e 55%, #be123c 100%);color:#ffffff;text-decoration:none;font-size:15px;font-weight:800;box-shadow:0 14px 26px rgba(190,24,93,.22);">Open Your Portal Message</a></p>')
      : '',
    '    <p style="margin:0;font-size:14px;line-height:1.6;color:#5f6f86;">This is an automated message from an unmonitored inbox. Please do not reply or respond.</p>',
    '  </div>',
    '</div>'
  ].filter(Boolean).join('\n');

  return sendNotificationEmail_({
    to: recipientEmail,
    subject: subject,
    body: body,
    htmlBody: htmlBody,
    fromAlias: NOTIFICATION_FROM_ALIAS,
    replyTo: NOTIFICATION_FROM_ALIAS
  });
}

function sendNotificationEmail_(options) {
  const opts = (options && typeof options === 'object') ? options : {};
  const recipients = normalizeEmailRecipients_(opts.toList || opts.to);
  if (!recipients.length) return { ok: false, skipped: true, reason: 'missing-email' };

  const message = {
    to: recipients.join(','),
    subject: trimString_(opts.subject),
    body: String(opts.body || '').trim() || 'Red Threads notification.',
    name: NOTIFICATION_SENDER_NAME,
    noReply: true
  };
  const htmlBody = trimString_(opts.htmlBody);
  if (htmlBody) {
    message.htmlBody = htmlBody;
  }
  if (Array.isArray(opts.attachments) && opts.attachments.length) {
    message.attachments = opts.attachments;
  }
  const fromAlias = normalizeEmail_(opts.fromAlias);
  const replyTo = normalizeEmail_(opts.replyTo);
  if (fromAlias) {
    try {
      const aliases = (typeof GmailApp !== 'undefined' && GmailApp.getAliases) ? GmailApp.getAliases() : [];
      const matchingAlias = aliases.find(alias => normalizeEmail_(alias) === fromAlias);
      if (matchingAlias) {
        const gmailOptions = {
          name: NOTIFICATION_SENDER_NAME,
          htmlBody: message.htmlBody,
          attachments: message.attachments,
          from: matchingAlias,
          replyTo: replyTo || matchingAlias,
          noReply: true
        };
        GmailApp.sendEmail(message.to, message.subject, message.body, gmailOptions);
        return {
          ok: true,
          email: recipients[0],
          emails: recipients,
          noReply: true,
          senderName: NOTIFICATION_SENDER_NAME,
          fromAlias: matchingAlias
        };
      }
    } catch (_) {}
  }

  MailApp.sendEmail(message);
  return {
    ok: true,
    email: recipients[0],
    emails: recipients,
    noReply: true,
    senderName: NOTIFICATION_SENDER_NAME
  };
}

/* ---------------- Hosted Stripe Checkout Builders + Transport ---------------- */

function uniqueTrimmedStrings_(values) {
  const seen = {};
  const out = [];
  (Array.isArray(values) ? values : []).forEach((value) => {
    const text = trimString_(value);
    if (!text || seen[text]) return;
    seen[text] = true;
    out.push(text);
  });
  return out;
}

function truncateStripeCheckoutText_(value, maxLen) {
  const text = trimString_(String(value || '').replace(/\s+/g, ' '));
  const limit = Math.max(0, parseInt(String(maxLen || 0), 10) || 0);
  if (!text || !limit || text.length <= limit) return text;
  return text.slice(0, Math.max(0, limit - 3)).trim() + '...';
}

function sortStripeCheckoutSizes_(sizes) {
  const orderMap = {
    XS: 1,
    S: 2,
    M: 3,
    L: 4,
    XL: 5,
    '2X': 6,
    '2XL': 6,
    XXL: 6,
    '3X': 7,
    '3XL': 7,
    XXXL: 7,
    '4X': 8,
    '4XL': 8,
    '5X': 9,
    '5XL': 9,
    '6X': 10,
    '6XL': 10
  };
  return (Array.isArray(sizes) ? sizes : []).slice().sort((a, b) => {
    const left = trimString_(a).toUpperCase();
    const right = trimString_(b).toUpperCase();
    const leftOrder = Object.prototype.hasOwnProperty.call(orderMap, left) ? orderMap[left] : 100;
    const rightOrder = Object.prototype.hasOwnProperty.call(orderMap, right) ? orderMap[right] : 100;
    if (leftOrder !== rightOrder) return leftOrder - rightOrder;
    return left.localeCompare(right);
  });
}

function collectStripeCheckoutColorNames_(skuSummary) {
  const colors = Array.isArray(skuSummary && skuSummary.colors) ? skuSummary.colors : [];
  return uniqueTrimmedStrings_(colors.map((entry) => entry && entry.colorway));
}

function buildStripeCheckoutColorLabel_(skuSummary) {
  const colors = collectStripeCheckoutColorNames_(skuSummary);
  if (!colors.length) return '';
  if (colors.length === 1) return colors[0];
  if (colors.length === 2 && (colors[0].length + colors[1].length) <= 24) {
    return colors.join(' / ');
  }
  return 'Mixed Colors';
}

function buildStripeCheckoutColorSummary_(skuSummary) {
  const colors = collectStripeCheckoutColorNames_(skuSummary);
  if (colors.length <= 1) return '';
  if (colors.length <= 3) {
    return 'Colors: ' + colors.join(' / ');
  }
  return 'Colors: ' + colors.length + ' variants';
}

function formatStripeCheckoutClientLabel_(text) {
  const clean = trimString_(text).replace(/\s+/g, ' ');
  if (!clean) return '';
  const normalized = clean
    .toLowerCase()
    .replace(/\bt[\s-]?shirt\b/g, 't-shirt')
    .replace(/\bsweat[\s-]?shirt\b/g, 'sweatshirt')
    .replace(/\bfront[\s-]?center\b/g, 'front-center');
  return normalized.replace(/(^|[\s\/-])([a-z])/g, function (_, prefix, chr) {
    return prefix + chr.toUpperCase();
  });
}

function isClientSafePrintJobLabel_(label) {
  const clean = trimString_(label).replace(/\s+/g, ' ');
  if (!clean) return false;
  const normalized = clean.toLowerCase();
  if (/^pj\s*\d+$/i.test(clean)) return false;
  if (/^(print\s*job|project|job)\s*\d+$/i.test(clean)) return false;
  if (/^new\s+job$/i.test(clean)) return false;
  if (normalized.indexOf('just another job') >= 0) return false;
  if (/\bplaceholder\b|\btest\b|\bdummy\b|\bsample\b|\bunnamed\b|\binternal\b/.test(normalized)) return false;
  return true;
}

function getStripeDisplayPrintJobLabel_(job) {
  const fallbackNumber = Math.max(1, parseInt(String(job && job.printJobNumber || 1), 10) || 1);
  const candidate = trimString_(job && job.printJobName);
  if (isClientSafePrintJobLabel_(candidate)) {
    return truncateStripeCheckoutText_(formatStripeCheckoutClientLabel_(candidate), 60);
  }
  return 'Print Job ' + fallbackNumber;
}

function normalizeStripeCheckoutDecorationLocation_(location) {
  const clean = trimString_(location)
    .replace(/\(.*?\)/g, '')
    .replace(/\s+/g, ' ')
    .toLowerCase();
  if (!clean) return '';
  if (/left sleeve|left side/.test(clean)) return 'left sleeve';
  if (/right sleeve|right side/.test(clean)) return 'right sleeve';
  if (/full front/.test(clean)) return 'full front';
  if (/full back/.test(clean)) return 'full back';
  if (/front center|front centre/.test(clean)) return 'front-center';
  if (/back center|back centre/.test(clean)) return 'back-center';
  if (/left chest/.test(clean)) return 'left chest';
  if (/right chest/.test(clean)) return 'right chest';
  if (/front/.test(clean)) return 'front';
  if (/back/.test(clean)) return 'back';
  return clean.replace(/\s*\/\s*/g, ' / ');
}

function normalizeStripeCheckoutDecorationMethod_(method) {
  const clean = trimString_(method)
    .replace(/\(.*?\)/g, '')
    .replace(/\s+/g, ' ')
    .toLowerCase();
  if (!clean) return '';
  if (clean.indexOf('embroid') >= 0) return 'embroidery';
  const colorMatch = clean.match(/(\d+)\s*color/);
  if (colorMatch && colorMatch[1]) return colorMatch[1] + '-color';
  if (clean.indexOf('screen print') >= 0 || /\bprint\b/.test(clean)) return 'print';
  if (clean.indexOf('direct to film') >= 0 || /\bdtf\b/.test(clean)) return 'DTF';
  if (clean.indexOf('direct to garment') >= 0 || /\bdtg\b/.test(clean)) return 'DTG';
  if (clean.indexOf('transfer') >= 0) return 'heat transfer';
  return clean;
}

function buildStripeCheckoutDecorationSummary_(job) {
  const decorations = Array.isArray(job && job.decorations) ? job.decorations : [];
  const parts = [];
  decorations.forEach((item) => {
    const method = normalizeStripeCheckoutDecorationMethod_(item && (item.decorationMethod || item.method || item.type || item.decoType));
    const location = normalizeStripeCheckoutDecorationLocation_(item && item.location);
    let piece = '';
    if (method === 'embroidery') {
      piece = location ? (location + ' embroidery') : 'embroidery';
    } else if (/^\d+-color$/.test(method)) {
      piece = location ? (method + ' ' + location) : method;
    } else if (method === 'print') {
      piece = location ? (location + ' print') : 'print';
    } else if (method === 'DTF' || method === 'DTG') {
      piece = location ? (method + ' ' + location) : method;
    } else {
      piece = trimString_([method, location].filter(Boolean).join(' '));
    }
    if (!piece || parts.indexOf(piece) >= 0) return;
    parts.push(piece);
  });
  const limitedParts = parts.slice(0, 2);
  const colorPrefixMatches = limitedParts.map(function (piece) {
    return piece.match(/^(\d+-color)\s+(.+)$/);
  });
  const sharedColorPrefix = colorPrefixMatches.length > 1 && colorPrefixMatches.every(function (match) {
    return match && match[1] === colorPrefixMatches[0][1] && trimString_(match[2]);
  });
  if (sharedColorPrefix) {
    return truncateStripeCheckoutText_(
      colorPrefixMatches[0][1] + ' ' + colorPrefixMatches.map(function (match) {
        return trimString_(match[2]);
      }).join(' + '),
      90
    );
  }
  return truncateStripeCheckoutText_(limitedParts.join(' + '), 90);
}

function buildStripeCheckoutSizeSummary_(skuSummary) {
  const colors = Array.isArray(skuSummary && skuSummary.colors) ? skuSummary.colors : [];
  const totals = {};
  colors.forEach((color) => {
    const qtyBySize = (color && color.qtyBySize && typeof color.qtyBySize === 'object') ? color.qtyBySize : {};
    Object.keys(qtyBySize).forEach((size) => {
      const qty = Math.max(0, parseInt(String(qtyBySize[size] || 0), 10) || 0);
      if (!qty) return;
      const cleanSize = trimString_(size);
      if (!cleanSize) return;
      if (!Object.prototype.hasOwnProperty.call(totals, cleanSize)) totals[cleanSize] = 0;
      totals[cleanSize] += qty;
    });
  });
  return buildStripeCheckoutSizeSummaryFromQtyMap_(totals);
}

function buildStripeCheckoutPrintJobLabel_(job) {
  return getStripeDisplayPrintJobLabel_(job);
}

function buildStripeCheckoutSizeSummaryFromQtyMap_(qtyBySize) {
  const map = (qtyBySize && typeof qtyBySize === 'object') ? qtyBySize : {};
  const orderedSizes = sortStripeCheckoutSizes_(Object.keys(map));
  const sortedSizes = orderedSizes.filter((size) => Math.max(0, parseInt(String(map[size] || 0), 10) || 0) > 0);
  if (!sortedSizes.length) return '';
  const sizeParts = sortedSizes.slice(0, 6).map((size) => size + ' ' + Math.max(0, parseInt(String(map[size] || 0), 10) || 0));
  if (sortedSizes.length > 6) sizeParts.push('+');
  return 'Sizes: ' + sizeParts.join(' / ');
}

function buildStripeCheckoutUnitsSummary_(units) {
  const safeUnits = Math.max(0, parseInt(String(units || 0), 10) || 0);
  if (!safeUnits) return '';
  return safeUnits + ' units';
}

function buildStripeCheckoutDisplayName_(job, skuSummary, options) {
  const opts = (options && typeof options === 'object') ? options : {};
  const baseName = trimString_(opts.baseName || (skuSummary && skuSummary.uiName)) || trimString_(job && job.printJobName) || 'Custom Item';
  const colorLabel = formatStripeCheckoutClientLabel_(trimString_(opts.colorLabel || opts.colorway) || buildStripeCheckoutColorLabel_(skuSummary));
  return truncateStripeCheckoutText_(colorLabel ? (baseName + ' — ' + colorLabel) : baseName, 80);
}

function buildStripeCheckoutDescriptionParts_(job, skuSummary, options) {
  const opts = (options && typeof options === 'object') ? options : {};
  const parts = [];
  const printJobLabel = trimString_(opts.printJobLabel || buildStripeCheckoutPrintJobLabel_(job));
  if (printJobLabel) parts.push(printJobLabel);
  const decorationSummary = trimString_(opts.decorationSummary || buildStripeCheckoutDecorationSummary_(job));
  if (decorationSummary) parts.push(decorationSummary);
  const unitsSummary = trimString_(opts.unitsSummary || buildStripeCheckoutUnitsSummary_(opts.totalUnits));
  if (unitsSummary) parts.push(unitsSummary);
  const sizeSummary = trimString_(opts.sizeSummary || buildStripeCheckoutSizeSummaryFromQtyMap_(opts.qtyBySize) || buildStripeCheckoutSizeSummary_(skuSummary));
  if (sizeSummary) parts.push(sizeSummary);
  const extraParts = Array.isArray(opts.extraParts) ? opts.extraParts : [];
  if (extraParts.length) Array.prototype.push.apply(parts, extraParts);
  return uniqueTrimmedStrings_(parts);
}

function determineStripeCheckoutUnitLabel_(name) {
  const text = trimString_(name).toLowerCase();
  if (!text) return '';
  if (/hoodie|sweatshirt/.test(text)) return 'hoodie';
  if (/shirt|tee|t-shirt/.test(text)) return 'shirt';
  if (/tank/.test(text)) return 'tank';
  if (/hat|cap|beanie/.test(text)) return 'hat';
  if (/jacket/.test(text)) return 'jacket';
  return 'item';
}

function normalizeStripeHostedImageUrl_(url) {
  const clean = trimString_(url);
  if (!clean) return '';
  try {
    const parsed = new URL(clean);
    if (parsed.protocol !== 'https:') return '';
    const host = String(parsed.hostname || '').trim().toLowerCase();
    if (!host) return '';
    if (host.indexOf('drive.google.com') >= 0 || host.indexOf('docs.google.com') >= 0) return '';
    if (host === 'drive.usercontent.google.com') return '';
    if (host === 'work.fife.usercontent.google.com') return '';
    return parsed.toString();
  } catch (_) {
    return '';
  }
}

function isStripeHostedImageUrlFetchable_(url) {
  const normalized = normalizeStripeHostedImageUrl_(url);
  if (!normalized) return false;
  try {
    const parsed = new URL(normalized);
    const host = String(parsed.hostname || '').trim().toLowerCase();
    if (!host) return false;
    // Prefer the same public, direct image URL shapes the portal already renders
    // rather than requiring server-side fetch validation, which can falsely reject
    // otherwise usable Stripe-hosted product thumbnails.
    if (host === 'lh3.googleusercontent.com') return true;
    if (host.indexOf('googleusercontent.com') >= 0) return true;
    return parsed.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

function buildPublicDriveImageUrlForStripeCheckout_(fileId) {
  const id = trimString_(fileId);
  if (!id) return '';
  return 'https://lh3.googleusercontent.com/d/' + encodeURIComponent(id);
}

function chooseStripeCheckoutImageUrl_(job, skuSummary) {
  const candidates = [];
  const safeSkuImageUrl = normalizeStripeHostedImageUrl_(skuSummary && skuSummary.imageUrl);
  if (safeSkuImageUrl) candidates.push(safeSkuImageUrl);

  const safePreviewUrl = normalizeStripeHostedImageUrl_(job && job.mockups && job.mockups.previewUrl);
  if (safePreviewUrl) candidates.push(safePreviewUrl);

  const driveFileIds = [
    trimString_(job && job.mockups && job.mockups.previewMockupFileId),
    trimString_(job && job.mockups && job.mockups.artMockupFileId),
    trimString_(job && job.mockups && job.mockups.garmentMockupFileId)
  ];
  for (let i = 0; i < driveFileIds.length; i += 1) {
    const derivedUrl = buildPublicDriveImageUrlForStripeCheckout_(driveFileIds[i]);
    if (derivedUrl) candidates.push(derivedUrl);
  }
  const uniqueCandidates = uniqueTrimmedStrings_(candidates);
  for (let i = 0; i < uniqueCandidates.length; i += 1) {
    if (isStripeHostedImageUrlFetchable_(uniqueCandidates[i])) {
      return uniqueCandidates[i];
    }
  }
  return '';
}

function finalizeStripeCheckoutLineItemPricing_(lineItem) {
  const item = Object.assign({}, (lineItem && typeof lineItem === 'object') ? lineItem : {});
  const safeAmountCents = Math.max(0, parseInt(String(item.amountCents || 0), 10) || 0);
  const safeQuantity = Math.max(1, parseInt(String(item.quantity || 1), 10) || 1);
  item.quantity = safeQuantity;
  item.displayQuantity = Math.max(1, parseInt(String(item.displayQuantity || safeQuantity), 10) || safeQuantity);
  item.amountCents = safeAmountCents;
  delete item.roundingAdjustmentCents;
  delete item.requiresQuantityFallback;
  delete item.unitAmountDecimal;
  delete item.unitAmountCents;
  if (safeQuantity <= 1) {
    item.unitAmountCents = safeAmountCents;
    return item;
  }
  if (safeAmountCents % safeQuantity !== 0) {
    item.quantity = 1;
    item.displayQuantity = safeQuantity;
    item.unitAmountCents = safeAmountCents;
    item.unitLabel = '';
    item.requiresQuantityFallback = true;
    return item;
  }
  const baseUnitAmountCents = Math.floor(safeAmountCents / safeQuantity);
  if (baseUnitAmountCents <= 0) {
    item.quantity = 1;
    item.displayQuantity = safeQuantity;
    item.unitAmountCents = safeAmountCents;
    item.unitLabel = '';
    item.requiresQuantityFallback = true;
    return item;
  }
  item.unitAmountCents = baseUnitAmountCents;
  return item;
}

function applyStripeCheckoutConvenienceFeeToLineItems_(lineItems, feeRate) {
  const rate = Number(feeRate);
  const items = Array.isArray(lineItems) ? lineItems : [];
  if (!Number.isFinite(rate) || rate <= 0 || !items.length) {
    return items.slice();
  }
  return items.map((lineItem) => {
    const item = Object.assign({}, (lineItem && typeof lineItem === 'object') ? lineItem : {});
    const baseAmountCents = Math.max(0, parseInt(String(item.amountCents || 0), 10) || 0);
    if (!baseAmountCents) return finalizeStripeCheckoutLineItemPricing_(item);
    item.amountCents = baseAmountCents + Math.round(baseAmountCents * rate);
    return finalizeStripeCheckoutLineItemPricing_(item);
  });
}

function buildStripeCheckoutSortedPriceBuckets_(skuSummary) {
  return (Array.isArray(skuSummary && skuSummary.priceBuckets) ? skuSummary.priceBuckets.slice() : []).sort((left, right) => {
    const leftColor = trimString_(left && left.colorway).toLowerCase();
    const rightColor = trimString_(right && right.colorway).toLowerCase();
    if (leftColor !== rightColor) return leftColor.localeCompare(rightColor);
    const leftPrice = toFiniteNumber_(left && left.unitPrice, 0);
    const rightPrice = toFiniteNumber_(right && right.unitPrice, 0);
    if (leftPrice !== rightPrice) return leftPrice - rightPrice;
    return 0;
  });
}

function buildStripeCheckoutGroupedColorwayEntries_(skuSummary) {
  const colors = Array.isArray(skuSummary && skuSummary.colors) ? skuSummary.colors : [];
  const priceBuckets = buildStripeCheckoutSortedPriceBuckets_(skuSummary);
  const bucketTotalsByColor = {};
  priceBuckets.forEach((bucket) => {
    const colorKey = trimString_(bucket && bucket.colorway).toLowerCase();
    if (!colorKey) return;
    if (!bucketTotalsByColor[colorKey]) {
      bucketTotalsByColor[colorKey] = {
        totalCents: 0
      };
    }
    bucketTotalsByColor[colorKey].totalCents += Math.max(0, parseInt(String(bucket && bucket.totalCents || 0), 10) || 0);
  });
  return colors.map((colorSummary) => {
    const colorLabel = trimString_(colorSummary && colorSummary.colorway);
    const colorKey = colorLabel.toLowerCase();
    const totals = bucketTotalsByColor[colorKey] || null;
    const units = Math.max(0, parseInt(String(colorSummary && colorSummary.units || 0), 10) || 0);
    const amountCents = totals
      ? Math.max(0, parseInt(String(totals.totalCents || 0), 10) || 0)
      : 0;
    return {
      colorway: colorLabel,
      qtyBySize: (colorSummary && colorSummary.qtyBySize && typeof colorSummary.qtyBySize === 'object') ? colorSummary.qtyBySize : {},
      units: units,
      totalCents: amountCents
    };
  }).filter((entry) => entry.units > 0 && entry.totalCents > 0);
}

function buildStripeCheckoutColorwayLineItems_(job, skuSummary) {
  const imageUrl = chooseStripeCheckoutImageUrl_(job, skuSummary);
  const colorwayEntries = buildStripeCheckoutGroupedColorwayEntries_(skuSummary);
  const lineItems = [];

  colorwayEntries.forEach((entry) => {
    const units = Math.max(0, parseInt(String(entry && entry.units || 0), 10) || 0);
    const amountCents = Math.max(0, parseInt(String(entry && entry.totalCents || 0), 10) || 0);
    if (!units || !amountCents) return;
    const name = buildStripeCheckoutDisplayName_(job, skuSummary, {
      colorLabel: trimString_(entry && entry.colorway)
    });
    const apparelLineItem = finalizeStripeCheckoutLineItemPricing_({
      type: 'apparel',
      name: name,
      descriptionParts: buildStripeCheckoutDescriptionParts_(job, skuSummary, {
        totalUnits: units,
        qtyBySize: entry && entry.qtyBySize
      }),
      quantity: 1,
      displayQuantity: 1,
      amountCents: amountCents,
      imageUrl: imageUrl,
      unitLabel: ''
    });
    lineItems.push(apparelLineItem);
  });

  if (lineItems.length) return lineItems;

  const amountCents = Math.max(0, Math.round(roundMoney_(skuSummary && skuSummary.total) * 100));
  if (!amountCents) return [];
  const name = buildStripeCheckoutDisplayName_(job, skuSummary);
  const units = Math.max(1, parseInt(String(skuSummary && skuSummary.units || 1), 10) || 1);
  return [{
    type: 'apparel',
    name: name,
    descriptionParts: buildStripeCheckoutDescriptionParts_(job, skuSummary, {
      totalUnits: units
    }),
    quantity: 1,
    displayQuantity: 1,
    amountCents: amountCents,
    imageUrl: imageUrl,
    unitLabel: ''
  }].map(finalizeStripeCheckoutLineItemPricing_);
}

function buildStripeCheckoutAddOnLineItem_(job, addOnSummary) {
  const amountCents = Math.round(roundMoney_(addOnSummary && addOnSummary.amount) * 100);
  if (!amountCents) return null;
  const fallbackName = addOnSummary && addOnSummary.type === 'rush'
    ? 'Rush Service'
    : (addOnSummary && addOnSummary.type === 'shipping' ? 'Shipping' : 'Additional Fee');
  return finalizeStripeCheckoutLineItemPricing_({
    type: trimString_(addOnSummary && addOnSummary.type) || 'fee',
    name: truncateStripeCheckoutText_(trimString_(addOnSummary && addOnSummary.label) || fallbackName, 80),
    descriptionParts: uniqueTrimmedStrings_([
      'Applies to ' + buildStripeCheckoutPrintJobLabel_(job)
    ]),
    quantity: 1,
    displayQuantity: 1,
    amountCents: amountCents,
    imageUrl: '',
    unitLabel: ''
  });
}

function buildStripeCheckoutTaxLineItem_(orderDraft) {
  const amountCents = Math.round(roundMoney_(orderDraft && orderDraft.amountTax) * 100);
  if (!amountCents) return null;
  return finalizeStripeCheckoutLineItemPricing_({
    type: 'tax',
    name: 'Sales Tax',
    descriptionParts: ['Calculated from current portal draft'],
    quantity: 1,
    displayQuantity: 1,
    amountCents: amountCents,
    imageUrl: '',
    unitLabel: ''
  });
}

function buildStripeCheckoutDefaultLineItems_(orderDraft) {
  const grandTotalCents = Math.max(0, Math.round(roundMoney_(orderDraft && orderDraft.amountGrandTotal) * 100));
  if (!grandTotalCents) return [];
  const selectedJobs = Array.isArray(orderDraft && orderDraft.selectedJobs) ? orderDraft.selectedJobs : [];
  const firstJob = selectedJobs[0] || null;
  const firstSku = firstJob && Array.isArray(firstJob.skus) ? (firstJob.skus[0] || null) : null;
  const descriptionParts = [];
  const totalUnits = Math.max(0, parseInt(String(orderDraft && orderDraft.totalUnits || 0), 10) || 0);
  if (totalUnits > 0) descriptionParts.push('Qty ' + totalUnits);
  const dealNumber = trimString_(orderDraft && orderDraft.dealNumber);
  if (dealNumber) descriptionParts.push('Job #' + dealNumber);
  return [finalizeStripeCheckoutLineItemPricing_({
    type: 'summary',
    name: truncateStripeCheckoutText_(trimString_(orderDraft && orderDraft.projectName) || 'Red Threads Order', 80),
    descriptionParts: descriptionParts,
    quantity: 1,
    displayQuantity: 1,
    amountCents: grandTotalCents,
    imageUrl: firstJob && firstSku ? chooseStripeCheckoutImageUrl_(firstJob, firstSku) : '',
    unitLabel: ''
  })];
}

function applyNegativeStripeCheckoutAdjustments_(lineItems) {
  const allItems = (Array.isArray(lineItems) ? lineItems : []).filter(Boolean);
  const positiveItems = allItems.filter((item) => item.amountCents > 0);
  const negativeItems = allItems.filter((item) => item.amountCents < 0);
  if (!negativeItems.length) {
    return { ok: true, lineItems: positiveItems };
  }
  if (!positiveItems.length) {
    return { ok: false, lineItems: [] };
  }

  let remainingDiscountCents = negativeItems.reduce((sum, item) => sum + Math.abs(item.amountCents), 0);
  const sortedTargets = positiveItems.slice().sort((a, b) => {
    const typePriority = function (item) {
      const type = trimString_(item && item.type).toLowerCase();
      if (type === 'fee' || type === 'shipping' || type === 'rush' || type === 'tax') return 0;
      if (type === 'summary') return 2;
      return 1;
    };
    const priorityDiff = typePriority(a) - typePriority(b);
    if (priorityDiff !== 0) return priorityDiff;
    return b.amountCents - a.amountCents;
  });
  const discountLabels = uniqueTrimmedStrings_(negativeItems.map((item) => item.name));

  sortedTargets.forEach((item) => {
    if (!remainingDiscountCents) return;
    const reduction = Math.min(remainingDiscountCents, item.amountCents);
    if (!reduction) return;
    item.amountCents -= reduction;
    remainingDiscountCents -= reduction;
  });

  const cleanedItems = positiveItems.filter((item) => item.amountCents > 0);
  if (discountLabels.length && cleanedItems.length) {
    cleanedItems[0].descriptionParts = uniqueTrimmedStrings_(
      (cleanedItems[0].descriptionParts || []).concat([
        'Adjusted for: ' + truncateStripeCheckoutText_(discountLabels.join(' + '), 80)
      ])
    );
  }
  return {
    ok: remainingDiscountCents === 0,
    lineItems: cleanedItems
  };
}

function finalizeStripeCheckoutLineItemDescriptions_(lineItems) {
  return (Array.isArray(lineItems) ? lineItems : []).map((item) => {
    const parts = uniqueTrimmedStrings_(item.descriptionParts || []);
    if (item.displayQuantity > 1 && item.quantity !== item.displayQuantity) {
      parts.push('Qty ' + item.displayQuantity);
      item.unitLabel = '';
    }
    item.description = truncateStripeCheckoutText_(parts.join(' • '), 180);
    delete item.descriptionParts;
    return item;
  });
}

function buildStripeCheckoutLineItemsFromOrderDraft_(orderDraft, options) {
  const opts = (options && typeof options === 'object') ? options : {};
  const paymentMethodSelected = trimString_(opts.paymentMethodSelected).toLowerCase();
  const draft = (orderDraft && typeof orderDraft === 'object') ? orderDraft : {};
  const rawLineItems = [];
  const selectedJobs = Array.isArray(draft.selectedJobs) ? draft.selectedJobs : [];
  selectedJobs.forEach((job) => {
    (Array.isArray(job && job.skus) ? job.skus : []).forEach((skuSummary) => {
      const skuLineItems = buildStripeCheckoutColorwayLineItems_(job, skuSummary);
      if (skuLineItems && skuLineItems.length) Array.prototype.push.apply(rawLineItems, skuLineItems);
    });
    (Array.isArray(job && job.addOns) ? job.addOns : []).forEach((addOnSummary) => {
      const addOnLineItem = buildStripeCheckoutAddOnLineItem_(job, addOnSummary);
      if (addOnLineItem) rawLineItems.push(addOnLineItem);
    });
  });

  const taxLineItem = buildStripeCheckoutTaxLineItem_(draft);
  if (taxLineItem) rawLineItems.push(taxLineItem);

  const adjusted = applyNegativeStripeCheckoutAdjustments_(rawLineItems);
  let lineItems = adjusted.ok ? adjusted.lineItems : buildStripeCheckoutDefaultLineItems_(draft);
  if (!lineItems.length) {
    lineItems = buildStripeCheckoutDefaultLineItems_(draft);
  }
  if (!lineItems.length) return [];

  const grandTotalCents = Math.max(0, Math.round(roundMoney_(draft.amountGrandTotal) * 100));
  const lineItemsTotalCents = lineItems.reduce((sum, item) => sum + Math.max(0, parseInt(String(item && item.amountCents || 0), 10) || 0), 0);
  const diffCents = grandTotalCents - lineItemsTotalCents;
  if (diffCents !== 0) {
    const target = lineItems[lineItems.length - 1];
    if (!target) {
      const fallbackItems = buildStripeCheckoutDefaultLineItems_(draft);
      const pricedFallbackItems = paymentMethodSelected === PAYMENT_METHODS.card
        ? applyStripeCheckoutConvenienceFeeToLineItems_(fallbackItems, 0.03)
        : fallbackItems;
      return finalizeStripeCheckoutLineItemDescriptions_(pricedFallbackItems);
    }
    target.amountCents += diffCents;
    if (target.amountCents <= 0) {
      const fallbackItems = buildStripeCheckoutDefaultLineItems_(draft);
      const pricedFallbackItems = paymentMethodSelected === PAYMENT_METHODS.card
        ? applyStripeCheckoutConvenienceFeeToLineItems_(fallbackItems, 0.03)
        : fallbackItems;
      return finalizeStripeCheckoutLineItemDescriptions_(pricedFallbackItems);
    }
  }
  const pricedLineItems = lineItems.map(finalizeStripeCheckoutLineItemPricing_);
  const pricedCheckoutLineItems = paymentMethodSelected === PAYMENT_METHODS.card
    ? applyStripeCheckoutConvenienceFeeToLineItems_(pricedLineItems, 0.03)
    : pricedLineItems;
  if (pricedCheckoutLineItems.length > 100) {
    const fallbackItems = buildStripeCheckoutDefaultLineItems_(draft);
    const pricedFallbackItems = paymentMethodSelected === PAYMENT_METHODS.card
      ? applyStripeCheckoutConvenienceFeeToLineItems_(fallbackItems, 0.03)
      : fallbackItems;
    return finalizeStripeCheckoutLineItemDescriptions_(pricedFallbackItems);
  }
  return finalizeStripeCheckoutLineItemDescriptions_(pricedCheckoutLineItems);
}

function appendStripeCheckoutLineItemToPayload_(payload, index, lineItem, currency) {
  const item = (lineItem && typeof lineItem === 'object') ? lineItem : {};
  const idx = Math.max(0, parseInt(String(index || 0), 10) || 0);
  payload['line_items[' + idx + '][quantity]'] = String(Math.max(1, parseInt(String(item.quantity || 1), 10) || 1));
  payload['line_items[' + idx + '][price_data][currency]'] = trimString_(currency || DEFAULT_STRIPE_PRICE_CURRENCY).toLowerCase();
  payload['line_items[' + idx + '][price_data][unit_amount]'] = String(Math.max(0, parseInt(String(item.unitAmountCents || 0), 10) || 0));
  payload['line_items[' + idx + '][price_data][product_data][name]'] = truncateStripeCheckoutText_(item.name, 80) || 'Red Threads Item';
  const description = truncateStripeCheckoutText_(item.description, 180);
  if (description) {
    payload['line_items[' + idx + '][price_data][product_data][description]'] = description;
  }
  const imageUrl = normalizeStripeHostedImageUrl_(item.imageUrl);
  if (imageUrl) {
    payload['line_items[' + idx + '][price_data][product_data][images][]'] = imageUrl;
  }
  const unitLabel = truncateStripeCheckoutText_(item.unitLabel, 12);
  if (unitLabel) {
    payload['line_items[' + idx + '][price_data][product_data][unit_label]'] = unitLabel;
  }
}

function summarizeStripeCheckoutLineItemsForLog_(lineItems) {
  return (Array.isArray(lineItems) ? lineItems : []).map((item, idx) => ({
    index: idx,
    type: trimString_(item && item.type),
    name: trimString_(item && item.name),
    quantity: Math.max(1, parseInt(String(item && item.quantity || 1), 10) || 1),
    displayQuantity: Math.max(1, parseInt(String(item && item.displayQuantity || item && item.quantity || 1), 10) || 1),
    unitAmountCents: Math.max(0, parseInt(String(item && item.unitAmountCents || 0), 10) || 0),
    amountCents: Math.max(0, parseInt(String(item && item.amountCents || 0), 10) || 0),
    roundingAdjustmentCents: Math.max(0, parseInt(String(item && item.roundingAdjustmentCents || 0), 10) || 0),
    requiresQuantityFallback: item && item.requiresQuantityFallback === true,
    hasImage: !!trimString_(item && item.imageUrl),
    imageUrl: trimString_(item && item.imageUrl)
  }));
}

function getHttpHeaderValue_(headers, key) {
  const wanted = trimString_(key).toLowerCase();
  if (!wanted || !headers || typeof headers !== 'object') return '';
  const keys = Object.keys(headers);
  for (let i = 0; i < keys.length; i += 1) {
    const name = String(keys[i] || '').trim().toLowerCase();
    if (name === wanted) return trimString_(headers[keys[i]]);
  }
  return '';
}

function buildStripeCheckoutSessionRequestData_(orderDraft, options) {
  const opts = (options && typeof options === 'object') ? options : {};
  const paymentMethodSelected = trimString_(opts.paymentMethodSelected).toLowerCase();
  const paymentMethodType = paymentMethodSelected === PAYMENT_METHODS.ach ? 'us_bank_account' : 'card';
  const returnBaseUrl = buildStripeReturnBaseUrl_(orderDraft.token, { returnUrl: opts.returnUrl });
  const successUrl = buildStripeCheckoutReturnUrl_(orderDraft.token, {
    returnUrl: returnBaseUrl,
    queryParams: {
      checkoutResult: 'success',
      stripeSessionId: '{CHECKOUT_SESSION_ID}'
    }
  });
  const cancelUrl = buildStripeCheckoutReturnUrl_(orderDraft.token, {
    returnUrl: returnBaseUrl,
    queryParams: {
      checkoutResult: 'cancel'
    }
  });
  const currency = trimString_(orderDraft.currency || getConfig_().stripePriceCurrency || DEFAULT_STRIPE_PRICE_CURRENCY).toLowerCase();
  const lineItems = buildStripeCheckoutLineItemsFromOrderDraft_(orderDraft, {
    paymentMethodSelected: paymentMethodSelected
  });
  const fulfillmentMethod = normalizeFulfillmentMethod_(orderDraft && orderDraft.fulfillmentMethod);
  const shippingChargeCents = Math.max(0, parseInt(String(orderDraft && orderDraft.shippingChargeCents || 0), 10) || 0);
  const shippingModeLabel = trimString_(orderDraft && orderDraft.shippingModeLabel);
  const metadata = {
    token: trimString_(orderDraft.token),
    checkoutAttemptId: trimString_(opts.checkoutAttemptId),
    orderId: trimString_(opts.orderId),
    paymentMethodSelected: paymentMethodSelected,
    fulfillmentMethod: fulfillmentMethod,
    shippingChargeCents: String(shippingChargeCents),
    shippingModeLabel: shippingModeLabel
  };
  const payload = {
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: normalizeEmail_(orderDraft.personEmail),
    'payment_method_types[0]': paymentMethodType
  };
  const checkoutLineItems = lineItems.length ? lineItems : finalizeStripeCheckoutLineItemDescriptions_(buildStripeCheckoutDefaultLineItems_(orderDraft));
  checkoutLineItems.forEach((lineItem, idx) => {
    appendStripeCheckoutLineItemToPayload_(payload, idx, lineItem, currency);
  });
  Object.keys(metadata).forEach((key) => {
    if (!metadata[key]) return;
    payload['metadata[' + key + ']'] = metadata[key];
    payload['payment_intent_data[metadata][' + key + ']'] = metadata[key];
  });
  if (fulfillmentMethod === FULFILLMENT_METHODS.shipping) {
    STRIPE_FULFILLMENT_ALLOWED_COUNTRIES.forEach(function (countryCode, idx) {
      payload['shipping_address_collection[allowed_countries][' + idx + ']'] = trimString_(countryCode).toUpperCase();
    });
    payload['shipping_options[0][shipping_rate_data][type]'] = 'fixed_amount';
    payload['shipping_options[0][shipping_rate_data][fixed_amount][amount]'] = String(shippingChargeCents);
    payload['shipping_options[0][shipping_rate_data][fixed_amount][currency]'] = currency;
    payload['shipping_options[0][shipping_rate_data][display_name]'] = shippingModeLabel || STRIPE_FULFILLMENT_SHIPPING_SERVICE_LABEL;
  }
  if (paymentMethodType === 'us_bank_account') {
    payload['payment_method_options[us_bank_account][verification_method]'] = 'automatic';
  }
  return {
    payload: payload,
    checkoutLineItems: checkoutLineItems,
    stripeVersion: DEFAULT_STRIPE_CHECKOUT_SESSION_API_VERSION
  };
}

function buildStripeCheckoutSessionRequest_(orderDraft, options) {
  return buildStripeCheckoutSessionRequestData_(orderDraft, options).payload;
}

function createStripeCheckoutSession_(orderDraft, options) {
  const opts = (options && typeof options === 'object') ? options : {};
  const cfg = opts.cfg || getConfig_();
  const grandTotal = roundMoney_(toFiniteNumber_(orderDraft && orderDraft.amountGrandTotal, 0));
  if (grandTotal <= 0) {
    return {
      ok: false,
      configured: true,
      error: 'Hosted card and ACH checkout are only available when the order total is greater than $0. Please contact Red Threads to place this order.',
      code: 'non_positive_checkout_total',
      amountGrandTotal: grandTotal,
      currency: trimString_(orderDraft && orderDraft.currency) || DEFAULT_STRIPE_PRICE_CURRENCY
    };
  }
  if (!trimString_(cfg.stripeSecretKey)) {
    console.log('[RT-STRIPE-CHECKOUT] ' + JSON.stringify({
      ok: false,
      paymentMethodSelected: trimString_(opts.paymentMethodSelected),
      error: 'stripe_config_missing'
    }));
    return {
      ok: false,
      configured: false,
      error: 'Stripe secret key is not configured.',
      code: 'stripe_config_missing'
    };
  }

  const sessionRequestData = buildStripeCheckoutSessionRequestData_(orderDraft, opts);
  const lineItemDiagnostics = summarizeStripeCheckoutLineItemsForLog_(sessionRequestData.checkoutLineItems);
  const hasAnyImages = lineItemDiagnostics.some((item) => item.hasImage === true);
  console.log('[RT-STRIPE-CHECKOUT-PAYLOAD] ' + JSON.stringify({
    ok: true,
    paymentMethodSelected: trimString_(opts.paymentMethodSelected),
    checkoutAttemptId: trimString_(opts.checkoutAttemptId),
    orderId: trimString_(opts.orderId),
    stripeVersion: sessionRequestData.stripeVersion,
    hasAnyImages: hasAnyImages,
    imageLineItemCount: lineItemDiagnostics.filter((item) => item.hasImage === true).length,
    lineItems: lineItemDiagnostics
  }));

  const response = UrlFetchApp.fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'post',
    payload: sessionRequestData.payload,
    headers: {
      Authorization: 'Bearer ' + cfg.stripeSecretKey,
      'Stripe-Version': sessionRequestData.stripeVersion
    },
    muteHttpExceptions: true
  });
  const statusCode = Number(response.getResponseCode() || 0);
  const responseHeaders = response.getAllHeaders() || {};
  const responseStripeVersion = getHttpHeaderValue_(responseHeaders, 'Stripe-Version');
  const body = safeJsonParse_(response.getContentText(), null);
  if (statusCode < 200 || statusCode >= 300 || !body || typeof body !== 'object') {
    console.log('[RT-STRIPE-CHECKOUT] ' + JSON.stringify({
      ok: false,
      paymentMethodSelected: trimString_(opts.paymentMethodSelected),
      checkoutAttemptId: trimString_(opts.checkoutAttemptId),
      orderId: trimString_(opts.orderId),
      statusCode: statusCode,
      stripeVersion: sessionRequestData.stripeVersion,
      responseStripeVersion: responseStripeVersion,
      hasAnyImages: hasAnyImages,
      imageLineItemCount: lineItemDiagnostics.filter((item) => item.hasImage === true).length
    }));
    return {
      ok: false,
      configured: true,
      error: 'Stripe Checkout Session creation failed.',
      code: 'checkout_session_create_failed',
      statusCode: statusCode,
      body: body || String(response.getContentText() || '').slice(0, 500)
    };
  }
  const sessionId = trimString_(body.id);
  const checkoutUrl = trimString_(body.url);
  const returnBaseUrl = buildStripeReturnBaseUrl_(orderDraft.token, { returnUrl: opts.returnUrl || cfg.stripeReturnUrl });
  const successUrl = buildStripeCheckoutReturnUrl_(orderDraft.token, {
    returnUrl: returnBaseUrl,
    queryParams: {
      checkoutResult: 'success',
      stripeSessionId: '{CHECKOUT_SESSION_ID}'
    }
  });
  const cancelUrl = buildStripeCheckoutReturnUrl_(orderDraft.token, {
    returnUrl: returnBaseUrl,
    queryParams: {
      checkoutResult: 'cancel'
    }
  });
  console.log('[RT-STRIPE-CHECKOUT] ' + JSON.stringify({
    ok: true,
    paymentMethodSelected: trimString_(opts.paymentMethodSelected),
    checkoutAttemptId: trimString_(opts.checkoutAttemptId),
    orderId: trimString_(opts.orderId),
    sessionId: sessionId,
    hasCheckoutUrl: !!checkoutUrl,
    stripeVersion: sessionRequestData.stripeVersion,
    responseStripeVersion: responseStripeVersion,
    hasAnyImages: hasAnyImages,
    imageLineItemCount: lineItemDiagnostics.filter((item) => item.hasImage === true).length
  }));
  if (!sessionId) {
    console.log('[RT-STRIPE-CHECKOUT] ' + JSON.stringify({
      ok: false,
      paymentMethodSelected: trimString_(opts.paymentMethodSelected),
      error: 'checkout_session_id_missing'
    }));
    return {
      ok: false,
      configured: true,
      code: 'checkout_session_id_missing',
      error: 'Stripe Checkout session identifier missing from session response.',
      statusCode: statusCode,
      body: body
    };
  }
  if (!checkoutUrl) {
    console.log('[RT-STRIPE-CHECKOUT] ' + JSON.stringify({
      ok: false,
      paymentMethodSelected: trimString_(opts.paymentMethodSelected),
      sessionId: sessionId,
      error: 'checkout_url_missing'
    }));
    return {
      ok: false,
      configured: true,
      code: 'checkout_url_missing',
      error: 'Stripe Checkout URL missing from session response.',
      statusCode: statusCode,
      body: body
    };
  }
  return {
    ok: true,
    configured: true,
    publishableKey: cfg.stripePublishableKey,
    mode: cfg.stripeMode,
    uiMode: 'hosted',
    paymentUi: 'hosted',
    sessionId: sessionId,
    clientSecret: trimString_(body.client_secret),
    checkoutUrl: checkoutUrl,
    url: checkoutUrl,
    returnUrl: returnBaseUrl,
    successUrl: successUrl,
    cancelUrl: cancelUrl,
    raw: body
  };
}

function setPortalClientLockForRow_(sheet, rowInfo, locked, options) {
  const opts = (options && typeof options === 'object') ? options : {};
  const currentPortalState = safeJsonParse_(rowInfo.rowObjNormalized.portalstatejson, null) || { printJobs: {} };
  const currentChatLog = readChatLogForRow_(sheet, rowInfo);
  return persistPortalStateForRow_(sheet, rowInfo, currentPortalState, {
    token: trimString_(opts.token || rowInfo.rowObjNormalized.token),
    locked: locked === true,
    status: locked ? 'locked' : 'Editable',
    chatLog: currentChatLog,
    clearSubmittedAt: locked !== true
  });
}

function buildSafeSnapshotLoadResponse_(rowInfo, token, mode) {
  const built = buildPortalVmForRow_(rowInfo, token, mode || 'client');
  if (!built.ok) return null;
  return makeClientSafe_(built.vm);
}

function deriveProjectNameForNotification_(row, snapshot, overrides) {
  const opts = (overrides && typeof overrides === 'object') ? overrides : {};
  const overrideName = String(opts.projectName || '').trim();
  if (overrideName) return overrideName;

  const normalizedRow = (row && typeof row === 'object') ? row : {};
  const snapshotObj = (snapshot && typeof snapshot === 'object') ? snapshot : {};
  const meta = snapshotObj.meta && typeof snapshotObj.meta === 'object' ? snapshotObj.meta : {};

  const dealTitle = String(
    normalizedRow.dealtitle ||
    normalizedRow.projectname ||
    meta.dealTitle ||
    meta.projectName ||
    ''
  ).trim();
  const dealNumber = String(
    normalizedRow.dealnumber ||
    meta.dealNumber ||
    ''
  ).trim();

  if (dealNumber && dealTitle) return dealNumber + ' - ' + dealTitle;
  if (dealTitle) return dealTitle;
  if (dealNumber) return dealNumber;

  const printJobId = String(opts.printJobId || '').trim();
  return printJobId ? ('Print Job ' + printJobId) : '';
}

function getVisibleTeamAuthorName_(row) {
  const normalizedRow = (row && typeof row === 'object') ? row : {};
  return String(
    normalizedRow.sentby ||
    normalizedRow.assigneddesigner ||
    normalizedRow.assignedto ||
    normalizedRow.projectowner ||
    'Red Threads Team'
  ).trim() || 'Red Threads Team';
}

function deriveSenderNameForNotification_(row, senderType) {
  const opts = arguments[2] && typeof arguments[2] === 'object' ? arguments[2] : {};
  const normalizedRow = (row && typeof row === 'object') ? row : {};
  if (String(senderType || '').trim().toLowerCase() === 'team') {
    const override = String(opts.teamSenderName || '').trim();
    if (override) return override;
    return getVisibleTeamAuthorName_(normalizedRow);
  }
  return String(
    normalizedRow.personname ||
    normalizedRow.clientname ||
    normalizedRow.orgname ||
    normalizedRow[EXPORT_LOG_PERSON_EMAIL_HEADER] ||
    'Client'
  ).trim();
}

function buildChatNotificationPayload_(rowInfo, message, options) {
  const opts = (options && typeof options === 'object') ? options : {};
  const row = rowInfo && rowInfo.rowObjNormalized ? rowInfo.rowObjNormalized : {};
  const senderType = String(opts.senderType || message.sender || 'client').trim().toLowerCase() || 'client';
  const normalizedMessage = normalizeChatLog_([message])[0] || createChatMessage_(senderType, String(opts.messageText || '').trim());
  const snapshot = safeJsonParse_(row.snapshotjson, null);
  const token = String(opts.token || row.token || '').trim();
  const personEmail = normalizeEmail_(row[EXPORT_LOG_PERSON_EMAIL_HEADER]);
  const teamMemberName = String(opts.teamSenderName || '').trim() || getVisibleTeamAuthorName_(row);
  const projectName = deriveProjectNameForNotification_(row, snapshot, opts);
  const messageText = String(opts.messageText || normalizedMessage.text || '').trim() || String(normalizedMessage.text || '').trim();

  return {
    eventType: 'chat_message_created',
    token: token,
    senderType: senderType === 'team' ? 'team' : 'client',
    messageText: messageText,
    messageCreatedAt: String(normalizedMessage.ts || new Date().toISOString()),
    senderName: deriveSenderNameForNotification_(row, senderType, opts),
    teamMemberName: teamMemberName,
    projectName: projectName,
    personEmail: personEmail,
    teamInboxEmail: DOCUMENT_REVIEW_EMAIL,
    portalDirectUrl: buildPortalDirectUrl_(token)
  };
}

function logChatNotificationIssue_(message, meta) {
  const payload = (meta && typeof meta === 'object') ? meta : {};
  try {
    console.warn('[CHAT_NOTIFY]', message, JSON.stringify(payload));
  } catch (_) {
    Logger.log('[CHAT_NOTIFY] ' + message + ' ' + JSON.stringify(payload));
  }
}

function sendChatNotificationToMake_(eventPayload) {
  const payload = (eventPayload && typeof eventPayload === 'object') ? eventPayload : {};
  const token = String(payload.token || '').trim();
  const messageText = String(payload.messageText || '').trim();
  const senderType = String(payload.senderType || '').trim().toLowerCase();
  if (!token || !messageText || (senderType !== 'client' && senderType !== 'team')) {
    return { ok: false, skipped: true, reason: 'invalid-payload' };
  }

  try {
    const cfg = getConfig_();
    const url = String(cfg.makeWebhookUrl || '').trim();
    if (!url) {
      logChatNotificationIssue_('Missing Make webhook URL.', {
        token: token,
        senderType: senderType
      });
      return { ok: false, skipped: true, reason: 'missing-webhook-url' };
    }

    const headers = {};
    if (cfg.makeWebhookSecret) {
      headers['X-RT-Webhook-Secret'] = String(cfg.makeWebhookSecret);
    }

    const response = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      muteHttpExceptions: true,
      payload: JSON.stringify(payload),
      headers: headers
    });

    const statusCode = Number(response.getResponseCode() || 0);
    const responseText = String(response.getContentText() || '');
    if (statusCode < 200 || statusCode >= 300) {
      logChatNotificationIssue_('Make webhook responded with non-2xx status.', {
        token: token,
        senderType: senderType,
        statusCode: statusCode,
        responseText: responseText.slice(0, 500)
      });
      return { ok: false, statusCode: statusCode };
    }

    return { ok: true, statusCode: statusCode };
  } catch (err) {
    logChatNotificationIssue_('Make webhook request failed.', {
      token: token,
      senderType: senderType,
      error: String((err && err.message) || err)
    });
    return { ok: false, error: String((err && err.message) || err) };
  }
}

function normalizeEmail_(value) {
  return String(value || '').trim().toLowerCase();
}

function buildProjectsCacheKey_(email) {
  return 'rt:projects:' + normalizeEmail_(email);
}

function parseIsoDateMs_(value) {
  if (!value) return 0;
  const ms = Date.parse(String(value));
  return isNaN(ms) ? 0 : ms;
}

function generateResetCode_() {
  return String(Math.floor(Math.random() * 900000) + 100000);
}

function hashPasswordV2_(password) {
  const salt = Utilities.getUuid();
  const iterations = AUTH_POLICY.HASH_ITERATIONS_V2;
  const hash = hashPasswordWithSalt_(salt, password, iterations);
  return 'v2:' + String(iterations) + ':' + salt + ':' + hash;
}

function hashPasswordWithSalt_(salt, password, iterations) {
  const rounds = Math.max(1, parseInt(String(iterations || 0), 10) || 0);
  let value = String(salt || '') + String(password || '');
  for (let i = 0; i < rounds; i++) {
    const bytes = Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      value,
      Utilities.Charset.UTF_8
    );
    value = Utilities.base64Encode(bytes);
  }
  return value;
}

function verifyPasswordDetailed_(password, storedValue) {
  const stored = String(storedValue || '').trim();
  if (!stored) {
    return {
      ok: false,
      version: '',
      needsReset: true,
      reason: 'missing_hash'
    };
  }
  const parts = stored.split(':');
  if (!parts.length) return { ok: false, version: '' };

  // New format: v2:<iterations>:<salt>:<hash>
  if (parts[0] === 'v2' && parts.length === 4) {
    const iterations = parseInt(String(parts[1] || ''), 10);
    if (!Number.isFinite(iterations) || iterations < 1) return { ok: false, version: '' };
    if (iterations > AUTH_POLICY.MAX_VERIFY_ITERATIONS) {
      return {
        ok: false,
        version: 'v2',
        needsReset: true,
        reason: 'hash_too_slow'
      };
    }
    const salt = parts[2];
    const hash = parts[3];
    const computed = hashPasswordWithSalt_(salt, password, iterations);
    return { ok: timingSafeEquals_(computed, hash), version: 'v2', iterations: iterations };
  }

  // Legacy format: v1:<salt>:<hash>
  if (parts[0] === 'v1' && parts.length === 3) {
    return {
      ok: false,
      version: 'v1',
      needsReset: true,
      reason: 'legacy_hash'
    };
  }

  // Transitional fallback: support historical/plain-text rows long enough to upgrade on success.
  if (parts.length === 1) {
    const ok = timingSafeEquals_(String(password || ''), stored);
    return { ok: ok, version: 'plain', reason: ok ? 'plain_match' : 'plain_mismatch' };
  }

  return {
    ok: false,
    version: 'unknown',
    needsReset: true,
    reason: 'unknown_hash_format'
  };
}

function timingSafeEquals_(a, b) {
  const left = String(a || '');
  const right = String(b || '');
  const len = Math.max(left.length, right.length);
  let diff = left.length ^ right.length;
  for (let i = 0; i < len; i++) {
    const ca = i < left.length ? left.charCodeAt(i) : 0;
    const cb = i < right.length ? right.charCodeAt(i) : 0;
    diff |= (ca ^ cb);
  }
  return diff === 0;
}

function ensureRequiredCols_(colMap, required) {
  (required || []).forEach((key) => {
    if (!colMap[key]) {
      throw new Error('Missing required column: ' + key);
    }
  });
}

function findUserByEmail_(usersSheet, email) {
  const normalizedEmail = normalizeEmail_(email);
  if (!normalizedEmail) return null;

  const header = usersSheet.getRange(1, 1, 1, usersSheet.getLastColumn()).getValues()[0];
  const colMap = buildColumnMap_(header);
  const emailCol = colMap[AUTH_COLUMNS.USERS.email];
  if (!emailCol) throw new Error('USERS missing email column.');

  const lastRow = usersSheet.getLastRow();
  if (lastRow < 2) return null;

  const emailRange = usersSheet.getRange(2, emailCol, lastRow - 1, 1);
  const finder = emailRange.createTextFinder(normalizedEmail).matchEntireCell(true).matchCase(false);
  const cell = finder.findNext();
  if (!cell) {
    // Fallback for rows that may contain trailing/leading whitespace.
    const emailVals = emailRange.getValues();
    for (let i = 0; i < emailVals.length; i++) {
      const rowEmail = normalizeEmail_(emailVals[i][0]);
      if (rowEmail === normalizedEmail) {
        const row = i + 2;
        const rowVals = usersSheet.getRange(row, 1, 1, usersSheet.getLastColumn()).getValues()[0];
        const rowObj = {};
        const rowObjNormalized = {};
        header.forEach((h, idx) => {
          const rawKey = String(h || '').trim();
          rowObj[rawKey] = rowVals[idx];
          rowObjNormalized[normalizeHeaderKey_(rawKey)] = rowVals[idx];
        });
        return { row: row, colMap: colMap, rowObj: rowObj, rowObjNormalized: rowObjNormalized };
      }
    }
    return null;
  }

  const row = cell.getRow();
  const rowVals = usersSheet.getRange(row, 1, 1, usersSheet.getLastColumn()).getValues()[0];
  const rowObj = {};
  const rowObjNormalized = {};
  header.forEach((h, idx) => {
    const rawKey = String(h || '').trim();
    rowObj[rawKey] = rowVals[idx];
    rowObjNormalized[normalizeHeaderKey_(rawKey)] = rowVals[idx];
  });
  return { row: row, colMap: colMap, rowObj: rowObj, rowObjNormalized: rowObjNormalized };
}

function createUser_(usersSheet, email, password) {
  const header = usersSheet.getRange(1, 1, 1, usersSheet.getLastColumn()).getValues()[0];
  const colMap = buildColumnMap_(header);
  ensureRequiredCols_(colMap, [
    AUTH_COLUMNS.USERS.userId,
    AUTH_COLUMNS.USERS.email,
    AUTH_COLUMNS.USERS.passwordHash,
    AUTH_COLUMNS.USERS.emailVerified,
    AUTH_COLUMNS.USERS.createdAt,
    AUTH_COLUMNS.USERS.resetCode,
    AUTH_COLUMNS.USERS.resetCodeExpiresAt
  ]);

  const userId = Utilities.getUuid();
  const createdAt = nowIso_();
  const rowVals = new Array(usersSheet.getLastColumn()).fill('');
  rowVals[colMap[AUTH_COLUMNS.USERS.userId] - 1] = userId;
  rowVals[colMap[AUTH_COLUMNS.USERS.email] - 1] = normalizeEmail_(email);
  rowVals[colMap[AUTH_COLUMNS.USERS.passwordHash] - 1] = password ? hashPasswordV2_(password) : '';
  rowVals[colMap[AUTH_COLUMNS.USERS.emailVerified] - 1] = true;
  rowVals[colMap[AUTH_COLUMNS.USERS.createdAt] - 1] = createdAt;
  rowVals[colMap[AUTH_COLUMNS.USERS.resetCode] - 1] = '';
  rowVals[colMap[AUTH_COLUMNS.USERS.resetCodeExpiresAt] - 1] = '';
  if (colMap[AUTH_COLUMNS.USERS.displayName]) rowVals[colMap[AUTH_COLUMNS.USERS.displayName] - 1] = '';
  if (colMap[AUTH_COLUMNS.USERS.defaultOrgId]) rowVals[colMap[AUTH_COLUMNS.USERS.defaultOrgId] - 1] = '';
  if (colMap[AUTH_COLUMNS.USERS.defaultOrgName]) rowVals[colMap[AUTH_COLUMNS.USERS.defaultOrgName] - 1] = '';
  if (colMap[AUTH_COLUMNS.USERS.role]) rowVals[colMap[AUTH_COLUMNS.USERS.role] - 1] = 'client';
  if (colMap[AUTH_COLUMNS.USERS.status]) rowVals[colMap[AUTH_COLUMNS.USERS.status] - 1] = 'active';
  if (colMap[AUTH_COLUMNS.USERS.lastLoginAt]) rowVals[colMap[AUTH_COLUMNS.USERS.lastLoginAt] - 1] = '';
  if (colMap[AUTH_COLUMNS.USERS.notes]) rowVals[colMap[AUTH_COLUMNS.USERS.notes] - 1] = '';

  const row = usersSheet.getLastRow() + 1;
  usersSheet.getRange(row, 1, 1, rowVals.length).setValues([rowVals]);
  return findUserByEmail_(usersSheet, email);
}

function updateUserColumns_(usersSheet, userInfo, updates) {
  const colMap = userInfo.colMap || {};
  const row = userInfo.row;
  Object.keys(updates || {}).forEach((key) => {
    const col = colMap[key];
    if (!col) return;
    usersSheet.getRange(row, col).setValue(updates[key]);
  });
}

function updateUserResetCode_(usersSheet, userInfo, code, expiresAt) {
  const updates = {};
  updates[AUTH_COLUMNS.USERS.resetCode] = String(code || '');
  updates[AUTH_COLUMNS.USERS.resetCodeExpiresAt] = String(expiresAt || '');
  updateUserColumns_(usersSheet, userInfo, updates);
}

function createSession_(sessionsSheet, email) {
  const header = sessionsSheet.getRange(1, 1, 1, sessionsSheet.getLastColumn()).getValues()[0];
  const colMap = buildColumnMap_(header);
  ensureRequiredCols_(colMap, [
    AUTH_COLUMNS.USER_SESSIONS.sessionId,
    AUTH_COLUMNS.USER_SESSIONS.email,
    AUTH_COLUMNS.USER_SESSIONS.expiresAt,
    AUTH_COLUMNS.USER_SESSIONS.createdAt
  ]);

  const createdAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + AUTH_POLICY.SESSION_TTL_MS).toISOString();
  const sessionId = Utilities.getUuid();

  const rowVals = new Array(sessionsSheet.getLastColumn()).fill('');
  rowVals[colMap[AUTH_COLUMNS.USER_SESSIONS.sessionId] - 1] = sessionId;
  rowVals[colMap[AUTH_COLUMNS.USER_SESSIONS.email] - 1] = normalizeEmail_(email);
  rowVals[colMap[AUTH_COLUMNS.USER_SESSIONS.expiresAt] - 1] = expiresAt;
  rowVals[colMap[AUTH_COLUMNS.USER_SESSIONS.createdAt] - 1] = createdAt;
  if (colMap[AUTH_COLUMNS.USER_SESSIONS.userId]) rowVals[colMap[AUTH_COLUMNS.USER_SESSIONS.userId] - 1] = '';
  if (colMap[AUTH_COLUMNS.USER_SESSIONS.lastSeenAt]) rowVals[colMap[AUTH_COLUMNS.USER_SESSIONS.lastSeenAt] - 1] = createdAt;
  if (colMap[AUTH_COLUMNS.USER_SESSIONS.revokedAt]) rowVals[colMap[AUTH_COLUMNS.USER_SESSIONS.revokedAt] - 1] = '';
  if (colMap[AUTH_COLUMNS.USER_SESSIONS.mode]) rowVals[colMap[AUTH_COLUMNS.USER_SESSIONS.mode] - 1] = 'portal';
  if (colMap[AUTH_COLUMNS.USER_SESSIONS.notes]) rowVals[colMap[AUTH_COLUMNS.USER_SESSIONS.notes] - 1] = '';

  const row = sessionsSheet.getLastRow() + 1;
  sessionsSheet.getRange(row, 1, 1, rowVals.length).setValues([rowVals]);

  return { sessionId: sessionId, email: normalizeEmail_(email), expiresAt: expiresAt };
}

/* ---------------- Low-Level Auth + Workbook Row Utilities ---------------- */

function validateSession_(sessionsSheet, sessionId) {
  const id = String(sessionId || '').trim();
  if (!id) return { ok: false, error: 'Missing session.' };

  const header = sessionsSheet.getRange(1, 1, 1, sessionsSheet.getLastColumn()).getValues()[0];
  const colMap = buildColumnMap_(header);
  ensureRequiredCols_(colMap, [
    AUTH_COLUMNS.USER_SESSIONS.sessionId,
    AUTH_COLUMNS.USER_SESSIONS.email,
    AUTH_COLUMNS.USER_SESSIONS.expiresAt
  ]);

  const idCol = colMap[AUTH_COLUMNS.USER_SESSIONS.sessionId];
  const lastRow = sessionsSheet.getLastRow();
  if (lastRow < 2) return { ok: false, error: 'Session expired. Please log in again.' };

  const idRange = sessionsSheet.getRange(2, idCol, lastRow - 1, 1);
  const finder = idRange.createTextFinder(id).matchEntireCell(true).matchCase(true);
  const cell = finder.findNext();
  if (!cell) return { ok: false, error: 'Session expired. Please log in again.' };

  const row = cell.getRow();
  const rowVals = sessionsSheet.getRange(row, 1, 1, sessionsSheet.getLastColumn()).getValues()[0];
  const email = normalizeEmail_(rowVals[colMap[AUTH_COLUMNS.USER_SESSIONS.email] - 1]);
  const expiresAtMs = parseIsoDateMs_(rowVals[colMap[AUTH_COLUMNS.USER_SESSIONS.expiresAt] - 1]);
  const revokedAtMs = colMap[AUTH_COLUMNS.USER_SESSIONS.revokedAt]
    ? parseIsoDateMs_(rowVals[colMap[AUTH_COLUMNS.USER_SESSIONS.revokedAt] - 1])
    : 0;
  if (revokedAtMs && revokedAtMs <= Date.now()) {
    return { ok: false, error: 'Session expired. Please log in again.' };
  }
  if (!expiresAtMs || expiresAtMs <= Date.now()) {
    sessionsSheet.deleteRow(row);
    return { ok: false, error: 'Session expired. Please log in again.' };
  }
  if (colMap[AUTH_COLUMNS.USER_SESSIONS.lastSeenAt]) {
    sessionsSheet.getRange(row, colMap[AUTH_COLUMNS.USER_SESSIONS.lastSeenAt]).setValue(nowIso_());
  }
  return { ok: true, email: email, row: row, colMap: colMap };
}

function deleteSessionById_(sessionsSheet, sessionId) {
  const id = String(sessionId || '').trim();
  if (!id) return;

  const header = sessionsSheet.getRange(1, 1, 1, sessionsSheet.getLastColumn()).getValues()[0];
  const colMap = buildColumnMap_(header);
  const idCol = colMap[AUTH_COLUMNS.USER_SESSIONS.sessionId];
  if (!idCol) return;

  const lastRow = sessionsSheet.getLastRow();
  if (lastRow < 2) return;
  const vals = sessionsSheet.getRange(2, idCol, lastRow - 1, 1).getValues();
  for (let i = vals.length - 1; i >= 0; i--) {
    const v = String(vals[i][0] || '').trim();
    if (v === id) sessionsSheet.deleteRow(i + 2);
  }
}

function emailExistsInExportLog_(exportSheet, email) {
  const normalizedEmail = normalizeEmail_(email);
  if (!normalizedEmail) return false;

  const header = exportSheet.getRange(1, 1, 1, exportSheet.getLastColumn()).getValues()[0];
  const colMap = buildColumnMap_(header);
  const personEmailCol = colMap[EXPORT_LOG_PERSON_EMAIL_HEADER];
  if (!personEmailCol) return false;

  const lastRow = exportSheet.getLastRow();
  if (lastRow < 2) return false;

  const vals = exportSheet.getRange(2, personEmailCol, lastRow - 1, 1).getValues();
  for (let i = 0; i < vals.length; i++) {
    const rowEmail = normalizeEmail_(vals[i][0]);
    if (rowEmail && rowEmail === normalizedEmail) return true;
  }
  return false;
}

function findRowByToken_(sheet, token) {
  const header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const colMap = buildColumnMap_(header);

  const tokenCol = colMap.token;
  if (!tokenCol) {
    throw new Error('EXPORT_LOG must have a "token" column in row 1.');
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  const tokenRange = sheet.getRange(2, tokenCol, lastRow - 1, 1);
  const finder = tokenRange.createTextFinder(String(token)).matchEntireCell(true);
  const cell = finder.findNext();
  if (!cell) return null;

  const row = cell.getRow();
  const rowVals = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];

  const rowObj = {};
  const rowObjNormalized = {};
  header.forEach((h, idx) => {
    const rawKey = String(h || '').trim();
    rowObj[rawKey] = rowVals[idx];
    rowObjNormalized[normalizeHeaderKey_(rawKey)] = rowVals[idx];
  });

  return {
    row: row,
    rowObj: rowObj,
    rowObjNormalized: rowObjNormalized,
    colMap: colMap
  };
}

function buildColumnMap_(headerRow) {
  const out = {};
  (headerRow || []).forEach((h, idx) => {
    const key = normalizeHeaderKey_(h);
    if (!key) return;
    if (!out[key]) out[key] = idx + 1;
  });
  return out;
}

function normalizeHeaderKey_(h) {
  return String(h || '')
    .trim()
    .toLowerCase();
}

function majorVersion_(version) {
  const m = String(version || '').trim().match(/^(\d+)/);
  return m ? Number(m[1]) : 0;
}

function safeJsonParse_(input, fallback) {
  try {
    if (input == null) return fallback;
    if (typeof input === 'object') return input;
    const s = String(input).trim();
    if (!s) return fallback;
    return JSON.parse(s);
  } catch (err) {
    return fallback;
  }
}

function makeClientSafe_(value, depth) {
  const level = Number(depth || 0);
  if (level > 30) return null;
  if (value == null) return value;

  if (Object.prototype.toString.call(value) === '[object Date]') {
    const ms = value.getTime();
    return isNaN(ms) ? '' : value.toISOString();
  }

  const valueType = typeof value;
  if (valueType === 'string' || valueType === 'number' || valueType === 'boolean') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => makeClientSafe_(item, level + 1));
  }

  if (valueType === 'object') {
    const out = {};
    Object.keys(value).forEach((key) => {
      const nextValue = makeClientSafe_(value[key], level + 1);
      if (typeof nextValue !== 'undefined') out[key] = nextValue;
    });
    return out;
  }

  return String(value);
}

function normalizeChatLog_(input) {
  if (!Array.isArray(input)) return [];
  return input
    .map((m) => {
      if (!m || typeof m !== 'object') return null;
      const text = String(m.text || '').trim();
      const senderRaw = String(m.sender || '').trim().toLowerCase();
      const sender = senderRaw === 'team'
        ? 'team'
        : (senderRaw === 'system' ? 'system' : 'client');
      const authorName = String(m.authorName || m.senderName || '').trim();
      if (!text) return null;
      const tsRaw = String(m.ts || m.tsIso || '').trim();
      const ts = tsRaw && !isNaN(new Date(tsRaw).getTime()) ? tsRaw : new Date().toISOString();
      return {
        id: String(m.id || ('msg_' + Utilities.getUuid())),
        ts: ts,
        sender: sender,
        authorName: authorName,
        text: text
      };
    })
    .filter(Boolean);
}

function hasNonBlankJsonSignal_(value) {
  if (value == null) return false;
  if (typeof value === 'object') {
    if (Array.isArray(value)) return value.length > 0;
    return Object.keys(value).length > 0;
  }
  const raw = String(value || '').trim();
  if (!raw || raw === 'null' || raw === 'undefined') return false;
  if (raw === '{}' || raw === '[]') return false;
  const parsed = safeJsonParse_(raw, null);
  if (parsed == null) return raw !== '';
  if (Array.isArray(parsed)) return parsed.length > 0;
  if (typeof parsed === 'object') return Object.keys(parsed).length > 0;
  return String(parsed || '').trim() !== '';
}

function isFinalPortalStatus_(status) {
  return FINAL_LOCK_STATUSES[String(status || '').trim().toLowerCase()] === true;
}

function getFinalStatusForRow_(row) {
  const current = String((row && row.status) || '').trim();
  return isFinalPortalStatus_(current) ? current : 'submitted';
}

function isLockedPortalRow_(row, portalState) {
  const status = String((row && row.status) || '').trim().toLowerCase();
  if (status === 'saved' || status === 'editable') return false;
  if (hasNonBlankJsonSignal_(row && row.submittedstatejson)) return true;
  if (isFinalPortalStatus_(status)) return true;
  return Boolean(portalState && portalState.isReadOnly === true && isFinalPortalStatus_(status));
}

function parsePortalStateInput_(portalStateInput) {
  const portalState = safeJsonParse_(portalStateInput, null);
  if (!portalState || typeof portalState !== 'object' || Array.isArray(portalState)) {
    throw new Error('portalState must be an object.');
  }
  if (!portalState.printJobs || typeof portalState.printJobs !== 'object' || Array.isArray(portalState.printJobs)) {
    throw new Error('portalState.printJobs must be an object.');
  }
  return portalState;
}

function detectMessageLogKey_(stateObj) {
  if (!stateObj || typeof stateObj !== 'object') return 'messageLog';
  if (Array.isArray(stateObj.messageLog)) return 'messageLog';
  if (Array.isArray(stateObj.chatLog)) return 'chatLog';
  if (Array.isArray(stateObj.messages)) return 'messages';
  return 'messageLog';
}

function writeChatLogIntoPortalState_(stateObj, chatLog) {
  if (!stateObj || typeof stateObj !== 'object') return;
  const key = detectMessageLogKey_(stateObj);
  delete stateObj.messageLog;
  delete stateObj.chatLog;
  delete stateObj.messages;
  stateObj[key] = normalizeChatLog_(chatLog);
}

function readChatLogForRow_(sheet, rowInfo) {
  const colMap = rowInfo.colMap || {};
  const chatCol = colMap.chatlogjson || EXPORT_LOG_COLUMNS.chatLogJson;
  if (!chatCol) return [];
  const existingRaw = sheet.getRange(rowInfo.row, chatCol).getValue();
  return normalizeChatLog_(safeJsonParse_(existingRaw, []));
}

function createChatMessage_(sender, text, tsOverride, options) {
  const opts = (options && typeof options === 'object') ? options : {};
  return {
    id: 'msg_' + Utilities.getUuid(),
    ts: String(tsOverride || new Date().toISOString()),
    sender: String(sender || '').trim().toLowerCase() || 'client',
    authorName: String(opts.authorName || '').trim(),
    text: String(text || '').trim()
  };
}

function appendUniqueChatMessage_(chatLog, message) {
  const nextLog = normalizeChatLog_(chatLog);
  const normalized = normalizeChatLog_([message])[0];
  if (!normalized) return nextLog;
  const alreadyPresent = nextLog.some((item) => (
    String(item.sender || '') === String(normalized.sender || '') &&
    String(item.text || '') === String(normalized.text || '') &&
    String(item.ts || '') === String(normalized.ts || '')
  ));
  if (alreadyPresent) return nextLog;
  nextLog.push(normalized);
  return normalizeChatLog_(nextLog);
}

function jsonOutput_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj || {}))
    .setMimeType(ContentService.MimeType.JSON);
}

function escapeHtml_(s) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderTeamContractMessage_(diag) {
  const html = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>Contract Mismatch (Team)</title>
      <style>
        body{font-family:Arial,sans-serif;margin:0;background:#f6f7f9}
        .wrap{max-width:900px;margin:24px auto;padding:0 16px}
        .card{background:#fff;border-radius:14px;box-shadow:0 6px 18px rgba(0,0,0,.08);padding:22px}
        h1{margin:0 0 10px;font-size:20px}
        p{margin:0 0 10px;color:#333;line-height:1.4}
        .kv{display:grid;grid-template-columns:190px 1fr;gap:6px 12px;margin-top:12px;font-size:13px}
        .k{font-weight:700;color:#111}
        pre{margin-top:12px;background:#f3f4f6;border:1px solid #d1d5db;border-radius:8px;padding:10px;white-space:pre-wrap;word-break:break-word;font-size:12px}
      </style>
    </head>
    <body><div class="wrap"><div class="card">
      <h1>Unsupported Contract Version</h1>
      <p>This link is not on contract v2 and cannot be rendered by this build in client mode.</p>
      <div class="kv">
        <div class="k">token</div><div>${escapeHtml_(diag.token || '')}</div>
        <div class="k">status</div><div>${escapeHtml_(diag.status || '')}</div>
        <div class="k">contractVersion</div><div>${escapeHtml_(diag.contractVersion || '')}</div>
        <div class="k">snapshotId</div><div>${escapeHtml_(diag.snapshotId || '')}</div>
        <div class="k">exportedAt</div><div>${escapeHtml_(diag.exportedAt || '')}</div>
      </div>
      <pre>${escapeHtml_(diag.snapshotSnippet || '')}</pre>
    </div></div></body>
  </html>`;

  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function renderMessage_(title, message) {
  const html = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>${escapeHtml_(title)}</title>
      <style>
        body{font-family:Arial,sans-serif;margin:0;background:#f6f7f9}
        .wrap{max-width:760px;margin:40px auto;padding:0 16px}
        .card{background:#fff;border-radius:14px;box-shadow:0 6px 18px rgba(0,0,0,.08);padding:22px}
        h1{margin:0 0 10px;font-size:20px}
        p{margin:0;color:#333;line-height:1.4}
      </style>
    </head>
    <body><div class="wrap"><div class="card">
      <h1>${escapeHtml_(title)}</h1><p>${escapeHtml_(message)}</p>
    </div></div></body>
  </html>`;

  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
