/* ================================================
   TME MOTORS PORTAL — CONFIG
   js/config.js

   EDIT THIS FILE to add your Google Script URLs.
   ================================================ */

const CONFIG = {

  /* --------------------------------------------------
     ANNOUNCEMENTS — Google Apps Script URL
     Steps:
     1. Open Announcements Google Sheet
     2. Extensions > Apps Script > paste APPSSCRIPT.gs
     3. Deploy > New deployment > Web App > Anyone
     4. Copy URL and paste below
  -------------------------------------------------- */
  SHEETS_ANNO_URL: "",   // e.g. "https://script.google.com/macros/s/AKfy.../exec"

  /* --------------------------------------------------
     SALES DATA — Google Apps Script URL
     Steps:
     1. Open your Sales Google Sheet
     2. Extensions > Apps Script > paste SALES_SCRIPT.gs
     3. Deploy > New deployment > Web App > Anyone
     4. Copy URL and paste below
  -------------------------------------------------- */
  SHEETS_SALES_URL: "",  // e.g. "https://script.google.com/macros/s/AKfy.../exec"

  /* --------------------------------------------------
     MEMO — Google Drive Folder ID
     (already set from your earlier link)
  -------------------------------------------------- */
  DRIVE_MEMO_FOLDER_ID: "1H_27ObzuosqjGBV6N_7aMw1ngHUIAa8x",

  /* --------------------------------------------------
     GOOGLE SCRIPT LINKS — paste URLs for each form
  -------------------------------------------------- */
  LINKS: {
    FORM_C_NEW:      "",   // Form C — new submission
    FORM_C_RECORDS:  "",   // Form C — view records
    FORM_P_NEW:      "",   // Form P — new submission
    FORM_P_RECORDS:  "",   // Form P — view records
    CX_LOG:          "",   // Customer Experience — log
    CX_REPORT:       "",   // Customer Experience — report
    FOCAMM:          "",   // FOCAMM checklist
    KMP:             "",   // KMP documents
    FOCAMM_RECORDS:  "",   // FOCAMM past records
  },

  /* --------------------------------------------------
     HELP CONTACTS
  -------------------------------------------------- */
  HELP: {
    HQ_PHONE:    "07-XXXXXXX",               // e.g. "07-2231234"
    HQ_EMAIL:    "support@tmemotors.com.my",
    IT_WHATSAPP: "https://wa.me/601XXXXXXXX", // e.g. "https://wa.me/60123456789"
  },

  /* --------------------------------------------------
     OUTLETS — add/rename as needed
  -------------------------------------------------- */
  OUTLETS: [
    { id: "003", label: "TME 003 Skudai" },
    { id: "005", label: "TME 005 Larkin" },
    { id: "006", label: "TME 006 Tampoi" },
    { id: "009", label: "TME 009 Masai"  },
  ],

};
