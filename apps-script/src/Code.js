const REQUIRED_SHEET_ID = '16KrxpEv8s-U5gjLX-DZK25GbrnkeKbjgInngie8Ce_c';

const CONFIG_KEYS = {
  SHEET_ID: 'SHEET_ID',
  EXPORT_LOG_SHEET: 'EXPORT_LOG_SHEET',
  MAKE_WEBHOOK_URL: 'MAKE_WEBHOOK_URL',
  MAKE_WEBHOOK_SECRET: 'MAKE_WEBHOOK_SECRET',
  SUCCESS_REDIRECT_URL: 'SUCCESS_REDIRECT_URL'
};

const EXPORT_LOG_COLUMNS = {
  chatLogJson: 28
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
      const tpl = HtmlService.createTemplateFromFile('Index');
      tpl.VM = buildAuthShellVm_();
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
    const readOnly =
      status === 'saved' ||
      status === 'submitted' ||
      Boolean(portalState && portalState.isReadOnly === true);

    const tpl = HtmlService.createTemplateFromFile('Index');
    tpl.VM = {
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
    };

    return tpl.evaluate()
      .setTitle('Red Threads Estimate Portal')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (err) {
    return renderMessage_('Runtime error', String((err && err.message) || err));
  }
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

    const existingRaw = sheet.getRange(row, chatCol).getValue();
    const existingParsed = safeJsonParse_(existingRaw, []);
    const chatLog = Array.isArray(existingParsed) ? existingParsed : [];

    const nextMsg = {
      id: 'msg_' + Utilities.getUuid(),
      ts: new Date().toISOString(),
      sender: sender,
      text: text
    };

    chatLog.push(nextMsg);
    sheet.getRange(row, chatCol).setValue(JSON.stringify(chatLog));

    return { ok: true, chatLog: normalizeChatLog_(chatLog) };
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

    const portalState = safeJsonParse_(portalStateInput, null);
    if (!portalState || typeof portalState !== 'object' || Array.isArray(portalState)) {
      return { ok: false, error: 'portalState must be an object.' };
    }
    if (!portalState.printJobs || typeof portalState.printJobs !== 'object' || Array.isArray(portalState.printJobs)) {
      return { ok: false, error: 'portalState.printJobs must be an object.' };
    }

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

    return persistPortalStateForRow_(sheet, rowInfo, portalState, tokenValue);
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
    if (action !== 'save') {
      return jsonOutput_({ ok: false, error: 'Unsupported action.' });
    }

    const token = String(payload.token || '').trim();
    if (!token) {
      return jsonOutput_({ ok: false, error: 'Missing token.' });
    }

    const result = savePortalState(token, payload.portalState);
    return jsonOutput_(result);
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

    const header = exportSheet.getRange(1, 1, 1, exportSheet.getLastColumn()).getValues()[0];
    const colMap = buildColumnMap_(header);
    const personEmailCol = colMap[EXPORT_LOG_PERSON_EMAIL_HEADER];
    const tokenCol = colMap.token;
    if (!personEmailCol || !tokenCol) {
      return { ok: false, error: 'EXPORT_LOG missing required columns.' };
    }

    const lastRow = exportSheet.getLastRow();
    if (lastRow < 2) return { ok: true, projects: [] };

    const rowCount = lastRow - 1;
    const personEmailVals = exportSheet.getRange(2, personEmailCol, rowCount, 1).getValues();
    const tokenVals = exportSheet.getRange(2, tokenCol, rowCount, 1).getValues();

    const dealNumberCol = colMap.dealnumber || 0;
    const dealTitleCol = colMap.dealtitle || 0;
    const orgNameCol = colMap.orgname || 0;
    const personNameCol = colMap.personname || 0;
    const exportedAtCol = colMap.exportedat || 0;
    const createdAtCol = colMap.createdat || 0;
    const statusCol = colMap.status || 0;

    const dealNumberVals = dealNumberCol ? exportSheet.getRange(2, dealNumberCol, rowCount, 1).getValues() : [];
    const dealTitleVals = dealTitleCol ? exportSheet.getRange(2, dealTitleCol, rowCount, 1).getValues() : [];
    const orgNameVals = orgNameCol ? exportSheet.getRange(2, orgNameCol, rowCount, 1).getValues() : [];
    const personNameVals = personNameCol ? exportSheet.getRange(2, personNameCol, rowCount, 1).getValues() : [];
    const exportedAtVals = exportedAtCol ? exportSheet.getRange(2, exportedAtCol, rowCount, 1).getValues() : [];
    const createdAtVals = createdAtCol ? exportSheet.getRange(2, createdAtCol, rowCount, 1).getValues() : [];
    const statusVals = statusCol ? exportSheet.getRange(2, statusCol, rowCount, 1).getValues() : [];

    const projects = [];

    for (let i = 0; i < rowCount; i++) {
      const personEmail = normalizeEmail_(personEmailVals[i] && personEmailVals[i][0]);
      if (!personEmail || personEmail !== email) continue;

      const token = String(tokenVals[i] && tokenVals[i][0] || '').trim();
      if (!token) continue;

      const dealNumber = dealNumberVals[i] && dealNumberVals[i][0] || '';
      const dealTitle = dealTitleVals[i] && dealTitleVals[i][0] || '';
      const orgName = orgNameVals[i] && orgNameVals[i][0] || '';
      const personName = personNameVals[i] && personNameVals[i][0] || '';
      const exportedAt = (exportedAtVals[i] && exportedAtVals[i][0]) || (createdAtVals[i] && createdAtVals[i][0]) || '';
      const status = statusVals[i] && statusVals[i][0] || '';

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

    return { ok: true, portalPayload: built.vm };
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}

// Backward-compatible alias for existing frontend callers.
function authLoadProject(payload) {
  return getSnapshotByToken(payload);
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
  const readOnly =
    status === 'saved' ||
    status === 'submitted' ||
    Boolean(portalState && portalState.isReadOnly === true);

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

function persistPortalStateForRow_(sheet, rowInfo, portalState, token) {
  const colMap = rowInfo.colMap || {};
  const row = rowInfo.row;

  const portalStateCol = colMap.portalstatejson;
  const statusCol = colMap.status;
  const submittedAtCol = colMap.submittedat;

  if (!portalStateCol || !statusCol || !submittedAtCol) {
    return { ok: false, error: 'Required columns missing (portalStateJson/status/submittedAt).' };
  }

  const nowIso = new Date().toISOString();
  const stateToStore = JSON.parse(JSON.stringify(portalState));
  stateToStore.version = String(stateToStore.version || '1');
  stateToStore.savedAt = nowIso;
  stateToStore.isReadOnly = true;

  sheet.getRange(row, portalStateCol).setValue(JSON.stringify(stateToStore));
  sheet.getRange(row, statusCol).setValue('saved');
  sheet.getRange(row, submittedAtCol).setValue(nowIso);

  return { ok: true, token: token, status: 'saved', submittedAt: nowIso };
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

  return {
    sheetId: sheetId,
    exportLogSheetName: exportLogSheetName,
    makeWebhookUrl: makeWebhookUrl || '',
    makeWebhookSecret: makeWebhookSecret
  };
}

function getWebAppUrl_() {
  return ScriptApp.getService().getUrl();
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

function hashPasswordV1_(password) {
  const salt = Utilities.getUuid();
  const hash = hashPasswordWithSalt_(salt, password, AUTH_POLICY.HASH_ITERATIONS_LEGACY_V1);
  return 'v1:' + salt + ':' + hash;
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

function verifyPassword_(password, storedValue) {
  return verifyPasswordDetailed_(password, storedValue).ok;
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

function valueByColMap_(rowVals, colMap, possibleKeys) {
  const keys = Array.isArray(possibleKeys) ? possibleKeys : [];
  for (let i = 0; i < keys.length; i++) {
    const col = colMap[String(keys[i] || '').toLowerCase()];
    if (!col) continue;
    const value = rowVals[col - 1];
    if (value != null && String(value).trim() !== '') return value;
  }
  return '';
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

function normalizeChatLog_(input) {
  if (!Array.isArray(input)) return [];
  return input
    .map((m) => {
      if (!m || typeof m !== 'object') return null;
      const text = String(m.text || '').trim();
      const senderRaw = String(m.sender || '').trim().toLowerCase();
      const sender = senderRaw === 'team' ? 'team' : 'client';
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

function sanitizeHtml_(html) {
  let out = String(html || '');
  out = out.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
  out = out.replace(/\son\w+="[^"]*"/gi, '');
  out = out.replace(/\son\w+='[^']*'/gi, '');
  return out;
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
