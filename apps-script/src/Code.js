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

function doGet(e) {
  try {
    const token = (e && e.parameter && e.parameter.t) ? String(e.parameter.t).trim() : '';
    if (!token) return renderMessage_('Invalid link', 'Missing token.');

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

/* ---------------- Helpers ---------------- */

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
