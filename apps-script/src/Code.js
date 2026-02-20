const CONFIG_KEYS = {
  SHEET_ID: 'SHEET_ID',
  EXPORT_LOG_SHEET: 'EXPORT_LOG_SHEET',
  MAKE_WEBHOOK_URL: 'MAKE_WEBHOOK_URL',
  MAKE_WEBHOOK_SECRET: 'MAKE_WEBHOOK_SECRET', // optional
  SUCCESS_REDIRECT_URL: 'SUCCESS_REDIRECT_URL' // unused now, kept for backward compatibility
};

function doGet(e) {
  const token = (e && e.parameter && e.parameter.t) ? String(e.parameter.t).trim() : '';
  if (!token) return renderMessage_('Invalid link', 'Missing token.');

  const cfg = getConfig_();
  const ss = SpreadsheetApp.openById(cfg.sheetId);
  const sheet = ss.getSheetByName(cfg.exportLogSheetName);
  if (!sheet) return renderMessage_('Configuration error', 'EXPORT_LOG sheet not found.');

  const rowInfo = findRowByToken_(sheet, token);
  if (!rowInfo) return renderMessage_('Link not found', 'This link is invalid or no longer available.');

  const rowObj = rowInfo.rowObj;

  if (String(rowObj.status).toLowerCase() === 'replaced') {
    return renderMessage_('Link replaced', 'This estimate link has been replaced. Please use the most recent email link.');
  }

  let snapshot;
  try {
    snapshot = JSON.parse(rowObj.itemsJSON || '{}');
  } catch (err) {
    return renderMessage_('Configuration error', 'Snapshot data is malformed.');
  }

  // Enforce locked V1 constraints
  snapshot.maxItems = 6;
  snapshot.maxColorwaysPerItem = 6;
  snapshot.warningCopy = snapshot.warningCopy || 'Changing the order quantity from the original estimate will result in a new unit price / order total.';
  snapshot.colorwayDisclaimer = snapshot.colorwayDisclaimer || 'Print colors/locations stay the same across all colorways.';

  const rowSkuKey =
    rowObj.skuKey || rowObj.sku_key || rowObj.SKU_KEY || rowObj.SkuKey || '';

  if (Array.isArray(snapshot.items)) {
    snapshot.items = snapshot.items.slice(0, 6).map(it => {
      const out = Object.assign({}, it);
      out.pricingTableHtml = sanitizeHtml_(String(out.pricingTableHtml || ''));
      out.decorations = Array.isArray(out.decorations) ? out.decorations : splitDecorations_(out.decorations);
      out.estimatedQty = Number(out.estimatedQty || 0) || 0;
      out.lineId = Number(out.lineId || 0) || 0;

      out.skuKey = out.skuKey || out.sku_key || rowSkuKey || '';

      return out;
    });
  } else {
    snapshot.items = [];
  }

  const status = String(rowObj.status || '').toLowerCase();

  let submitted = null;
  if (status === 'submitted') {
    try {
      submitted = JSON.parse(rowObj.submittedItemsJSON || '{}');
    } catch (err) {
      submitted = null;
    }
  }

  const addOns = normalizeAddOns_(rowObj.addOns || rowObj.add_ons || rowObj['Add Ons'] || '');

  const tpl = HtmlService.createTemplateFromFile('Index');
  tpl.VM = {
    token,
    jobName: rowObj.jobName || snapshot.jobName || '',
    clientName: rowObj.clientName || rowObj.ClientName || rowObj['Client Name'] || '',
    recipientEmail: rowObj.recipientEmail || rowObj.clientEmail || rowObj.ClientEmail || rowObj['Client Email'] || '',
    orderNumber: rowObj.pipedriveDealId || rowObj.orderNumber || rowObj.jobKey || '',
    createdAt: rowObj.createdAt || '',
    jobNotes: rowObj.internalNotes || '',
    skuKey: rowSkuKey || '',
    snapshot,
    postUrl: getWebAppUrl_(),
    mode: (status === 'submitted') ? 'view' : 'edit',
    submitted, // may be null
    productionTime: rowObj.productionTime || '',
    addOns,

    // New row-level image fields (row wins)
    previewMockupFileId: String(rowObj.previewMockupFileId || rowObj.previewMockupFileID || '').trim(),
    artMockupFileId: String(rowObj.artMockupFileId || rowObj.artMockupFileID || '').trim(),
    garmentMockupFileId: String(rowObj.garmentMockupFileId || rowObj.garmentMockupFileID || '').trim(),

    // New portal fields
    baseUrl: String(rowObj.baseUrl || '').trim(),
    schemaVersion: String(rowObj.schemaVersion || '').trim(),
    portalMode: String(rowObj.portalMode || '').trim(),
    submittedByName: String(rowObj.submittedByName || '').trim(),
    submittedByEmail: String(rowObj.submittedByEmail || '').trim(),
    sentBy: String(rowObj.sentBy || rowObj.SentBy || rowObj['Sent By'] || '').trim()
  };

  return tpl.evaluate()
    .setTitle('Red Threads Estimate Portal')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  return renderMessage_('Disabled', 'Submission is disabled in this build.');
}

/* ---------------- Helpers ---------------- */

function getConfig_() {
  const props = PropertiesService.getScriptProperties();
  const sheetId = props.getProperty(CONFIG_KEYS.SHEET_ID);
  const exportLogSheetName = props.getProperty(CONFIG_KEYS.EXPORT_LOG_SHEET) || 'EXPORT_LOG';
  const makeWebhookUrl = props.getProperty(CONFIG_KEYS.MAKE_WEBHOOK_URL);
  const makeWebhookSecret = props.getProperty(CONFIG_KEYS.MAKE_WEBHOOK_SECRET) || '';

  if (!sheetId) throw new Error('Missing SHEET_ID script property.');

  return { sheetId, exportLogSheetName, makeWebhookUrl: makeWebhookUrl || '', makeWebhookSecret };
}

function getWebAppUrl_() {
  return ScriptApp.getService().getUrl();
}

function findRowByToken_(sheet, token) {
  const header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const colMap = {};
  header.forEach((h, i) => { colMap[String(h).trim()] = i + 1; });

  const tokenCol = colMap['token'];
  if (!tokenCol) throw new Error('EXPORT_LOG must have a "token" column in row 1.');

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  const tokenRange = sheet.getRange(2, tokenCol, lastRow - 1, 1);
  const finder = tokenRange.createTextFinder(token).matchEntireCell(true);
  const cell = finder.findNext();
  if (!cell) return null;

  const row = cell.getRow();
  const rowVals = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowObj = {};
  header.forEach((h, idx) => { rowObj[String(h).trim()] = rowVals[idx]; });

  return { row, rowObj, colMap };
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

function splitDecorations_(val) {
  const s = String(val || '').trim();
  if (!s) return [];
  if (s.includes('\n')) return s.split('\n').map(x => x.trim()).filter(Boolean);
  if (s.includes('|')) return s.split('|').map(x => x.trim()).filter(Boolean);
  return [s];
}

function normalizeAddOns_(raw) {
  if (!raw) return [];
  let v = raw;
  if (typeof v === 'string') {
    try {
      v = JSON.parse(v);
    } catch (e) {
      return [];
    }
  }
  if (Array.isArray(v)) return v;
  if (v && typeof v === 'object') {
    return Object.keys(v).map(k => ({ name: k, qty: 1, price: v[k] }));
  }
  return [];
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