// ════════════════════════════════════════════════════════════
//  MR. ROGERS — PRINCIPLES OF AMERICAN DEMOCRACY EXIT TICKET COLLECTOR
//  Paste this entire script into Google Apps Script
//  (script.google.com → New Project)
//  Then deploy as a Web App (see README below)
// ════════════════════════════════════════════════════════════

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1xEPilYXFU_pQKEZfGj9M2V3CZmflhHGkU3GdKBXcWOk/edit';

const PERIODS = { '1B': true, '2A': true };
const ROSTER_TAB = 'Rosters';
const LEGACY_TABS = ['Period 1B', 'Period 2A', 'All Responses'];
const RESPONSE_HEADERS = ['Student', 'Response', 'Submitted'];

// ════════════════════════════════════════════════════════════

function doPost(e) {
  try {
    const ss = SpreadsheetApp.openByUrl(SHEET_URL);
    const body = JSON.parse(e.postData.contents);
    const period = String(body.period || '').trim();
    const name = String(body.name || '').trim();
    const response = String(body.response || '').trim();
    if (!studentIsOnRoster(ss, period, name)) throw new Error('Student name does not match the selected period.');
    const question = String(body.question || '').trim();
    if (response.length < 5) throw new Error('Response must contain at least five characters.');
    if (!question) throw new Error('Exit-ticket question is required.');

    const timestamp = body.submittedAt || new Date().toISOString();
    const dateLabel = normalizeDateLabel(body.date, timestamp);
    const lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      writeToExitTicketTab(ss, dateLabel, period, question, name, response, timestamp);
      hideSupportAndLegacyTabs(ss);
    } finally {
      lock.releaseLock();
    }

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function studentIsOnRoster(ss, period, name) {
  if (!PERIODS[period] || !name) return false;
  const rosterSheet = ss.getSheetByName(ROSTER_TAB);
  if (!rosterSheet) throw new Error('Rosters tab is missing.');
  const lastRow = rosterSheet.getLastRow();
  if (lastRow < 2) return false;
  const rows = rosterSheet.getRange(2, 1, lastRow - 1, 2).getDisplayValues();
  return rows.some(function(row) {
    return String(row[0]).trim() === period && String(row[1]).trim() === name;
  });
}

function normalizeDateLabel(dateValue, timestamp) {
  const supplied = String(dateValue || '').trim();
  const match = supplied.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) return match[3] + '-' + padTwo(match[1]) + '-' + padTwo(match[2]);
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) throw new Error('Submission date is invalid.');
  return Utilities.formatDate(date, Session.getScriptTimeZone() || 'America/Los_Angeles', 'yyyy-MM-dd');
}

function padTwo(value) {
  return String(value).padStart(2, '0');
}

function findOrCreateExitTicketTab(ss, dateLabel, period, question) {
  const baseName = dateLabel + ' · ' + period;
  for (let sequence = 1; sequence <= 26; sequence += 1) {
    const suffix = sequence === 1 ? '' : ' ' + String.fromCharCode(64 + sequence);
    const tabName = dateLabel + suffix + ' · ' + period;
    const existing = ss.getSheetByName(tabName);
    if (existing && existing.getRange('A2').getDisplayValue() === question) return existing;
    if (!existing) return createExitTicketTab(ss, tabName, dateLabel, period, question);
  }
  throw new Error('Too many exit tickets were created for ' + baseName + '.');
}

function createExitTicketTab(ss, tabName, dateLabel, period, question) {
  const sheet = ss.insertSheet(tabName, 0);
  sheet.getRange('A1:C1').merge().setValue('EXIT TICKET · PERIOD ' + period + ' · ' + dateLabel)
    .setFontWeight('bold').setFontSize(14).setBackground('#1a2e5a').setFontColor('#ffffff');
  sheet.getRange('A2:C2').merge().setValue(question).setWrap(true).setVerticalAlignment('top');
  sheet.getRange(4, 1, 1, RESPONSE_HEADERS.length).setValues([RESPONSE_HEADERS])
    .setFontWeight('bold').setBackground('#dce6f1');
  sheet.setFrozenRows(4);
  sheet.setColumnWidth(1, 210);
  sheet.setColumnWidth(2, 520);
  sheet.setColumnWidth(3, 190);
  sheet.setRowHeight(1, 30);
  sheet.setRowHeight(2, 90);
  return sheet;
}

function writeToExitTicketTab(ss, dateLabel, period, question, name, response, timestamp) {
  const sheet = findOrCreateExitTicketTab(ss, dateLabel, period, question);
  sheet.appendRow([name, response, timestamp]);
  const row = sheet.getLastRow();
  sheet.getRange(row, 1, 1, RESPONSE_HEADERS.length).setWrap(true).setVerticalAlignment('top');
}

function hideSupportAndLegacyTabs(ss) {
  [ROSTER_TAB].concat(LEGACY_TABS).forEach(function(tabName) {
    const sheet = ss.getSheetByName(tabName);
    if (sheet && !sheet.isSheetHidden() && ss.getSheets().filter(function(item) { return !item.isSheetHidden(); }).length > 1) {
      sheet.hideSheet();
    }
  });
}

// Handles browser test pings (GET requests)
function doGet() {
  return ContentService
    .createTextOutput('Exit ticket collector is running.')
    .setMimeType(ContentService.MimeType.TEXT);
}

// ════════════════════════════════════════════════════════════
//  HOW TO DEPLOY (do this once):
//
//  1. Go to script.google.com
//  2. Click "New Project", paste this entire script
//  3. Click the floppy disk to save
//  4. Click "Deploy" → "Manage deployments"
//  5. Edit the active Web App deployment and choose "New version"
//  6. Keep "Execute as" set to Me and access set to Anyone
//  7. Click "Deploy". The existing Web App URL remains connected.
// ════════════════════════════════════════════════════════════
