const REQUIRED_SHEET_ID = '16KrxpEv8s-U5gjLX-DZK25GbrnkeKbjgInngie8Ce_c';

const CONFIG_KEYS = {
  SHEET_ID: 'SHEET_ID',
  EXPORT_LOG_SHEET: 'EXPORT_LOG_SHEET',
  MAKE_WEBHOOK_URL: 'MAKE_WEBHOOK_URL',
  MAKE_WEBHOOK_SECRET: 'MAKE_WEBHOOK_SECRET',
  TEAM_MODE_PASSWORD: 'TEAM_MODE_PASSWORD',
  SUCCESS_REDIRECT_URL: 'SUCCESS_REDIRECT_URL'
};

const DEFAULT_MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/rpulw78oq9tup5smtsb7kv4c7bc607lm';
const DEFAULT_TEAM_MODE_PASSWORD = 'R3dthreads!';

const EXPORT_LOG_COLUMNS = {
  chatLogJson: 28
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

const AUTH_COLUMNS = {
  USERS: {
    userId: 'userid',
    email: 'email',
    passwordHash: 'passwordhash',
    emailVerified: 'emailverified',
    createdAt: 'createdat',
    resetCode: 'resetcode',
    resetCodeExpiresAt: 'resetcodeexpiresat'
  },
  USER_SESSIONS: {
    sessionId: 'sessionid',
    email: 'email',
    expiresAt: 'expiresat',
    createdAt: 'createdat'
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
    const sheet = ss.getSheetByName(cfg.exportLogSheetName);
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

    const portalState = safeJsonParse_(row.portalstatejson, null);
    const chatLog = normalizeChatLog_(safeJsonParse_(row.chatlogjson, []));
    const readOnly = isLockedPortalRow_(row, portalState);

    const tpl = createIndexTemplate_({
      token: token,
      mode: mode,
      status: status,
      readOnly: readOnly,
      row: row,
      snapshot: snapshot,
      portalState: portalState,
      chatLog: chatLog,
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
    });

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
    const nextMsg = createChatMessage_(sender, text);
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

    sendChatNotificationToMake_(
      buildChatNotificationPayload_(rowInfo, nextMsg, {
        token: token,
        senderType: sender,
        messageText: String(p.messageText || '').trim(),
        projectName: String(p.projectName || '').trim(),
        printJobId: String(p.printJobId || '').trim()
      })
    );

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
    return jsonOutput_({ ok: false, error: 'Unsupported action.' });
  } catch (err) {
    return jsonOutput_({ ok: false, error: String((err && err.message) || err) });
  }
}

/* ---------------- Auth ---------------- */

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
    const usersSheet = ss.getSheetByName(AUTH_SHEETS.USERS);
    const sessionsSheet = ss.getSheetByName(AUTH_SHEETS.USER_SESSIONS);
    timings.openMs = Date.now() - openStart;

    if (!usersSheet || !sessionsSheet) {
      return withTiming({ ok: false, error: 'Auth configuration is incomplete.' });
    }

    const findStart = Date.now();
    let user = findUserByEmail_(usersSheet, email);
    let createdFromExport = false;
    if (!user) {
      const exportSheet = ss.getSheetByName(cfg.exportLogSheetName);
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
    timings.sessionMs = Date.now() - sessionStart;
    return withTiming({
      ok: true,
      sessionId: session.sessionId,
      email: email
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
    const sessionsSheet = ss.getSheetByName(AUTH_SHEETS.USER_SESSIONS);
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
    const sessionsSheet = ss.getSheetByName(AUTH_SHEETS.USER_SESSIONS);
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

/**
 * PHASE 2 (Dashboard metadata only):
 * - Validate session, resolve email.
 * - Return lightweight project metadata by personEmail.
 * - Do NOT parse snapshotJson or build portal VM.
 */
function getUserProjects(payload) {
  try {
    const p = (payload && typeof payload === 'object') ? payload : {};
    let email = normalizeEmail_(p.email);
    const sessionId = String(p.sessionId || '').trim();

    const cfg = getConfig_();
    const ss = SpreadsheetApp.openById(cfg.sheetId);
    const exportSheet = ss.getSheetByName(cfg.exportLogSheetName);
    const sessionsSheet = sessionId ? ss.getSheetByName(AUTH_SHEETS.USER_SESSIONS) : null;

    if (!exportSheet) {
      return { ok: false, error: 'Auth configuration is incomplete.' };
    }

    if (sessionId) {
      if (!sessionsSheet) return { ok: false, error: 'Auth configuration is incomplete.' };
      const session = validateSession_(sessionsSheet, sessionId);
      if (!session.ok) return session;
      email = session.email;
    }

    if (!email) {
      return { ok: false, error: 'Missing session.' };
    }

    const cache = CacheService.getScriptCache();
    const cacheKey = buildProjectsCacheKey_(email);
    const cached = cache.get(cacheKey);
    if (cached) {
      const parsedCached = safeJsonParse_(cached, null);
      if (parsedCached && Array.isArray(parsedCached.projects)) {
        return { ok: true, email: email, projects: parsedCached.projects };
      }
    }

    const lastCol = exportSheet.getLastColumn();
    const header = exportSheet.getRange(1, 1, 1, lastCol).getValues()[0];
    const colMap = buildColumnMap_(header);
    const personEmailCol = colMap[EXPORT_LOG_PERSON_EMAIL_HEADER];
    const tokenCol = colMap.token;
    if (!personEmailCol || !tokenCol) {
      return { ok: false, error: 'EXPORT_LOG missing required columns.' };
    }

    const lastRow = exportSheet.getLastRow();
    if (lastRow < 2) return { ok: true, projects: [] };

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
      if (!personEmail || personEmail !== email) continue;

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

    const cachePayload = JSON.stringify({ projects: projects });
    cache.put(cacheKey, cachePayload, AUTH_POLICY.PROJECT_CACHE_TTL_SEC);

    return { ok: true, email: email, projects: projects };
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
    const exportSheet = ss.getSheetByName(cfg.exportLogSheetName);
    const sessionsSheet = sessionId ? ss.getSheetByName(AUTH_SHEETS.USER_SESSIONS) : null;
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
    const exportSheet = ss.getSheetByName(cfg.exportLogSheetName);
    if (!exportSheet) {
      return { ok: false, error: 'Auth configuration is incomplete.' };
    }

    const rowInfo = findRowByToken_(exportSheet, token);
    if (!rowInfo) {
      return { ok: false, error: 'Link not found.' };
    }

    return {
      ok: true,
      senderName: getVisibleTeamAuthorName_(rowInfo.rowObjNormalized)
    };
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

function authSendResetCode(payload) {
  try {
    const p = (payload && typeof payload === 'object') ? payload : {};
    const email = normalizeEmail_(p.email);
    if (!email) return { ok: false, error: 'Email is required.' };

    const cfg = getConfig_();
    const ss = SpreadsheetApp.openById(cfg.sheetId);
    const exportSheet = ss.getSheetByName(cfg.exportLogSheetName);
    const usersSheet = ss.getSheetByName(AUTH_SHEETS.USERS);
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
    const body = [
      'Your Red Threads reset code is: ' + code,
      '',
      'This code expires in 15 minutes.',
      '',
      'If you did not request this, you can ignore this email.'
    ].join('\n');
    GmailApp.sendEmail(email, subject, body);

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
    const usersSheet = ss.getSheetByName(AUTH_SHEETS.USERS);
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

/* ---------------- Helpers ---------------- */

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
  const makeWebhookUrl = props.getProperty(CONFIG_KEYS.MAKE_WEBHOOK_URL);
  const makeWebhookSecret = props.getProperty(CONFIG_KEYS.MAKE_WEBHOOK_SECRET) || '';
  const teamModePassword = props.getProperty(CONFIG_KEYS.TEAM_MODE_PASSWORD) || DEFAULT_TEAM_MODE_PASSWORD;

  return {
    sheetId: sheetId,
    exportLogSheetName: exportLogSheetName,
    makeWebhookUrl: makeWebhookUrl || DEFAULT_MAKE_WEBHOOK_URL,
    makeWebhookSecret: makeWebhookSecret,
    teamModePassword: String(teamModePassword || DEFAULT_TEAM_MODE_PASSWORD)
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
  const normalizedRow = (row && typeof row === 'object') ? row : {};
  if (String(senderType || '').trim().toLowerCase() === 'team') {
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
  const teamMemberName = getVisibleTeamAuthorName_(row);
  const projectName = deriveProjectNameForNotification_(row, snapshot, opts);
  const messageText = String(opts.messageText || normalizedMessage.text || '').trim() || String(normalizedMessage.text || '').trim();

  return {
    eventType: 'chat_message_created',
    token: token,
    senderType: senderType === 'team' ? 'team' : 'client',
    messageText: messageText,
    messageCreatedAt: String(normalizedMessage.ts || new Date().toISOString()),
    senderName: deriveSenderNameForNotification_(row, senderType),
    teamMemberName: teamMemberName,
    projectName: projectName,
    personEmail: personEmail,
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

  const rowVals = new Array(usersSheet.getLastColumn()).fill('');
  rowVals[colMap[AUTH_COLUMNS.USERS.userId] - 1] = Utilities.getUuid();
  rowVals[colMap[AUTH_COLUMNS.USERS.email] - 1] = normalizeEmail_(email);
  rowVals[colMap[AUTH_COLUMNS.USERS.passwordHash] - 1] = password ? hashPasswordV2_(password) : '';
  rowVals[colMap[AUTH_COLUMNS.USERS.emailVerified] - 1] = true;
  rowVals[colMap[AUTH_COLUMNS.USERS.createdAt] - 1] = new Date().toISOString();
  rowVals[colMap[AUTH_COLUMNS.USERS.resetCode] - 1] = '';
  rowVals[colMap[AUTH_COLUMNS.USERS.resetCodeExpiresAt] - 1] = '';

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

  const row = sessionsSheet.getLastRow() + 1;
  sessionsSheet.getRange(row, 1, 1, rowVals.length).setValues([rowVals]);

  return { sessionId: sessionId, email: normalizeEmail_(email), expiresAt: expiresAt };
}

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
  if (!expiresAtMs || expiresAtMs <= Date.now()) {
    sessionsSheet.deleteRow(row);
    return { ok: false, error: 'Session expired. Please log in again.' };
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
      if (!text) return null;
      const tsRaw = String(m.ts || m.tsIso || '').trim();
      const ts = tsRaw && !isNaN(new Date(tsRaw).getTime()) ? tsRaw : new Date().toISOString();
      return {
        id: String(m.id || ('msg_' + Utilities.getUuid())),
        ts: ts,
        sender: sender,
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

function createChatMessage_(sender, text, tsOverride) {
  return {
    id: 'msg_' + Utilities.getUuid(),
    ts: String(tsOverride || new Date().toISOString()),
    sender: String(sender || '').trim().toLowerCase() || 'client',
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
