// ════════════════════════════════════════════════════════════
//  MR. ROGERS — PRINCIPLES OF AMERICAN DEMOCRACY EXIT TICKET COLLECTOR
//  Paste this entire script into Google Apps Script
//  (script.google.com → New Project)
//  Then deploy as a Web App (see README below)
// ════════════════════════════════════════════════════════════

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1xEPilYXFU_pQKEZfGj9M2V3CZmflhHGkU3GdKBXcWOk/edit';

const TABS = {
  '1B': 'Period 1B',
  '2A': 'Period 2A',
  'all': 'All Responses'
};
const HEADERS = ['Date', 'Period', 'Student Name', 'Question', 'Response', 'Submission Timestamp'];

const ROSTER_TAB = 'Rosters';

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
    const row = [
      body.date || new Date().toLocaleDateString('en-US'),
      period,
      name,
      question,
      response,
      timestamp
    ];
    writeToTab(ss, TABS[period], row);
    writeToTab(ss, TABS.all, row);

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
  if (!TABS[period] || !name) return false;
  const rosterSheet = ss.getSheetByName(ROSTER_TAB);
  if (!rosterSheet) throw new Error('Rosters tab is missing.');
  const lastRow = rosterSheet.getLastRow();
  if (lastRow < 2) return false;
  const rows = rosterSheet.getRange(2, 1, lastRow - 1, 2).getDisplayValues();
  return rows.some(function(row) {
    return String(row[0]).trim() === period && String(row[1]).trim() === name;
  });
}

function writeToTab(ss, tabName, row) {
  let sheet = ss.getSheetByName(tabName);
  if (!sheet) {
    sheet = ss.insertSheet(tabName);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#1a2e5a')
      .setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 90);
    sheet.setColumnWidth(2, 70);
    sheet.setColumnWidth(3, 180);
    sheet.setColumnWidth(4, 300);
    sheet.setColumnWidth(5, 400);
    sheet.setColumnWidth(6, 180);
  }
  sheet.appendRow(row);
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
//  4. Click "Deploy" → "New Deployment"
//  5. Click the gear icon → select "Web App"
//  6. Set "Execute as" → Me
//  7. Set "Who has access" → Anyone
//  8. Click "Deploy" → copy the Web App URL
//  9. Add that URL to site-content.json as exitEndpoint.
// ════════════════════════════════════════════════════════════
