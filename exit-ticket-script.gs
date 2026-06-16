// ════════════════════════════════════════════════════════════
//  MR. ROGERS — PRINCIPLES OF AMERICAN DEMOCRACY EXIT TICKET COLLECTOR
//  Paste this entire script into Google Apps Script
//  (script.google.com → New Project)
//  Then deploy as a Web App (see README below)
// ════════════════════════════════════════════════════════════

// ── STEP 1: Paste your Google Sheet URL below ──
// Open your Google Sheet, copy the URL, paste it here
const SHEET_URL = 'YOUR_GOOGLE_SHEET_URL_HERE';

// ── STEP 2: Set the sheet tab name ──
// This is the tab at the bottom of your Google Sheet
// Change if needed (default is "Sheet1")
const SHEET_TAB = 'Principles of American Democracy Exit Tickets';

// ════════════════════════════════════════════════════════════

function doPost(e) {
  try {
    const ss = SpreadsheetApp.openByUrl(SHEET_URL);
    let sheet = ss.getSheetByName(SHEET_TAB);

    // Create the sheet tab if it doesn't exist yet
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_TAB);
      // Add header row on first run
      sheet.appendRow(['Date', 'Period', 'Student Name', 'Question', 'Response', 'Timestamp']);
      sheet.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#1a2e5a').setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }

    // Parse the incoming data
    const body = JSON.parse(e.postData.contents);

    // Append a new row
    sheet.appendRow([
      body.date || new Date().toLocaleDateString('en-US'),
      body.period || '',
      body.name || '',
      body.question || '',
      body.response || '',
      new Date().toLocaleString('en-US')
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
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
//  9. Paste that URL into index.html where it says
//     YOUR_GOOGLE_APPS_SCRIPT_URL_HERE
// ════════════════════════════════════════════════════════════
