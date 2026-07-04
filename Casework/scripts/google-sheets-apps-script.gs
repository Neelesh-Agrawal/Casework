/**
 * CASework → Google Sheets feedback collector
 *
 * SETUP (one time):
 * 1. Create a Google Sheet named "Casework Feedback"
 * 2. Row 1 headers (copy-paste into A1:I1):
 *    Timestamp | Scope | Track ID | Track | Chapter # | Chapter Title | Chapter ID | Rating | Comment
 * 3. Extensions → Apps Script → paste this file → Save
 * 4. Project Settings → Script properties → add WEBHOOK_SECRET (optional, match Vercel FEEDBACK_WEBHOOK_SECRET)
 * 5. Deploy → New deployment → Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the Web app URL (ends in /exec) → Vercel env GOOGLE_SHEETS_WEBHOOK_URL
 */

const SHEET_NAME = 'Feedback';

function doGet() {
  return ContentService.createTextOutput('Casework feedback endpoint is running.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const expectedSecret = PropertiesService.getScriptProperties().getProperty('WEBHOOK_SECRET');
    if (expectedSecret && data._secret !== expectedSecret) {
      return jsonResponse({ ok: false, error: 'Unauthorized' }, 401);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'Timestamp', 'Scope', 'Track ID', 'Track', 'Chapter #', 'Chapter Title', 'Chapter ID', 'Rating', 'Comment',
      ]);
      sheet.getRange(1, 1, 1, 9).setFontWeight('bold');
    }

    const ts = data.savedAt ? new Date(data.savedAt) : new Date();

    sheet.appendRow([
      ts,
      data.scope || '',
      data.trackId ?? '',
      data.trackLabel || '',
      data.chapterNum ?? '',
      data.chapterTitle || '',
      data.chapterId ?? '',
      data.rating ?? '',
      data.comment || '',
    ]);

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err.message || err) }, 500);
  }
}

function jsonResponse(obj, _status) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
