// ================================================
// TME MOTORS PORTAL — ANNOUNCEMENTS SCRIPT
// File: APPSSCRIPT_ANNOUNCEMENTS.gs
//
// HOW TO USE:
// 1. Open your Announcements Google Sheet
// 2. Extensions > Apps Script
// 3. Delete existing code, paste ALL of this
// 4. Save (Ctrl+S)
// 5. Deploy > New deployment > Web App
//    - Execute as: Me
//    - Who has access: Anyone
// 6. Copy the URL > paste into js/config.js > SHEETS_ANNO_URL
//
// SHEET COLUMNS (Row 1 must be these headers exactly):
//   A: title
//   B: date
//   C: content
//   D: outlet   (e.g. "All", "TME 003 Skudai", "HQ")
//   E: active   (TRUE or FALSE)
// ================================================

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const rows  = sheet.getDataRange().getValues();

    if (rows.length < 2) {
      return jsonResponse([]);
    }

    const headers = rows[0].map(h => String(h).trim().toLowerCase());
    const data    = rows.slice(1)
      .map(row => {
        const obj = {};
        headers.forEach((h, i) => { obj[h] = row[i]; });
        return obj;
      })
      .filter(r => String(r.active).toUpperCase() === "TRUE")
      .map(r => ({
        title:   String(r.title   || ""),
        date:    formatDate(r.date),
        content: String(r.content || ""),
        outlet:  String(r.outlet  || "All"),
        active:  true,
      }));

    return jsonResponse(data);

  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

function formatDate(val) {
  if (!val) return "";
  if (val instanceof Date) {
    return val.toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" });
  }
  return String(val);
}

function jsonResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
