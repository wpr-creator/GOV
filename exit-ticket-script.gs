// ════════════════════════════════════════════════════════════
//  MR. ROGERS — PRINCIPLES OF AMERICAN DEMOCRACY EXIT TICKET COLLECTOR
//  Paste this entire script into Google Apps Script
//  (script.google.com → New Project)
//  Then deploy as a Web App (see README below)
// ════════════════════════════════════════════════════════════

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1xEPilYXFU_pQKEZfGj9M2V3CZmflhHGkU3GdKBXcWOk/edit';

// ── STEP 2: Set the sheet tab name ──
// This is the tab at the bottom of your Google Sheet
// Change if needed (default is "Sheet1")
const SHEET_TAB = 'Exit Tickets';

const CP_GOV_ROSTERS = {
  '1B': [
    'Ali, Harun F.', 'Barberena, Maya', 'Black, Jeshaiah A.', 'Buduan, Connielyn G.',
    'Burnette, Suriyana A.', 'Carrillo, Luis F.', 'Castillo, Mia', 'Chavez, Arturo',
    'Curtis, Maya A.', 'Gabriel, Gavin Florence E.', 'Garcia, Jorge E.',
    'Garcia Olivares, Emmanuel', 'Gungon, Edward', 'Gutierrez, Erik', 'Hernandez, Nataly R.',
    'Lara, Sophia L.', 'Laroya, Emma I.', 'Limbrick, Isaac L.', 'Maqueda, Elizabeth',
    'Marquez, John M.', 'McRae, Bailey R.', 'Nostrates, Azrielle O.', 'Ofoegbu, David C.',
    'Ortegon, Angelo E.', 'Peters, Maliya', 'Ramirez, Astrid M.', 'Rodriguez, Yesenia M.',
    'Rodriguez Cruz, Kailey J.', 'Rogers, Blessing L.', 'Ruiz Jimenez, Rafael',
    'Santos, Nayeli S.', 'Santos, Noah A.', 'Solares, Evalicia', 'Thomas, Lyric',
    'Vargas-Toledo, Javier E.'
  ],
  '2A': [
    'Amargo, Kianna F.', 'Banuelos, Manuel', 'Bati, Arriana Marie D.', 'Coleman, Dakobi J.',
    'Dietrich, Nicole Rae F.', 'Elico, Francesca', 'Flores, Yaritza D.', 'Gastelum, Gabriel A.',
    'Gutierrez Villa, Leslie', 'Holloway, Jeveah', 'Mora Garcia, Jazmin A.',
    'Pangilinan, Bryson Roman G.', 'Paule, Demien Ross V.', 'Resendiz, Damian A.',
    'Rodriguez Aguilar, Steven O.', 'Sakamoto, Alani M.', 'Santillan Ruiz, Grecia G.',
    'Santos, Leslie I.', 'Santoyo, Miguel A.', 'Sonico, Nicco C.', 'Tamayo, Lily A.',
    'Thach, Aimy', 'Wilson, Teddi R.'
  ]
};

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
    const period = String(body.period || '').trim();
    const name = String(body.name || '').trim();
    const response = String(body.response || '').trim();
    const roster = CP_GOV_ROSTERS[period];

    if (!roster || !roster.includes(name)) throw new Error('Student name does not match the selected period.');
    if (!response) throw new Error('Response is required.');

    // Append a new row
    sheet.appendRow([
      body.date || new Date().toLocaleDateString('en-US'),
      period,
      name,
      body.question || '',
      response,
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
//  9. Add that URL to site-content.json as exitEndpoint.
// ════════════════════════════════════════════════════════════
