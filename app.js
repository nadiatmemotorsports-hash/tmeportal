/* ================================================
   TME MOTORS PORTAL — APP JS
   js/app.js  (do not edit unless necessary)
   ================================================ */

let currentOutlet = CONFIG.OUTLETS[0].label;
let announcements = [];
let memoFiles     = [];

/* ---- INIT ---- */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  startClock();
  setHeroDate();
  buildOutletTabs();
  applyLinks();
  applyHelp();
  bindSidebar();
  loadAnnouncements();
  loadMemo();
  loadSalesData(currentOutlet);
  loadStock();
});

/* ---- CLOCK ---- */
function startClock() {
  const el = document.getElementById("clk");
  const tick = () => {
    el.textContent = new Date().toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit" });
  };
  tick(); setInterval(tick, 1000);
}

function setHeroDate() {
  const el = document.getElementById("heroDate");
  if (el) el.textContent = new Date().toLocaleDateString("en-MY", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });
  const sp = document.getElementById("saPeriod");
  if (sp) sp.textContent = new Date().toLocaleDateString("en-MY", { month: "long", year: "numeric" });
}

/* ---- SIDEBAR ---- */
function bindSidebar() {
  document.querySelectorAll(".sb-item[data-page]").forEach(item => {
    item.addEventListener("click", () => navigate(item.dataset.page));
  });
}

function navigate(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".sb-item").forEach(i => i.classList.remove("active"));
  const pg = document.getElementById("pg-" + pageId);
  if (pg) pg.classList.add("active");
  const sb = document.querySelector(`.sb-item[data-page="${pageId}"]`);
  if (sb) sb.classList.add("active");
  window.scrollTo(0, 0);
}

/* ---- OUTLET TABS ---- */
function buildOutletTabs() {
  const container = document.getElementById("outletTabs");
  if (!container) return;
  container.innerHTML = "";
  CONFIG.OUTLETS.forEach((outlet, i) => {
    const btn = document.createElement("button");
    btn.className = "ot" + (i === 0 ? " active" : "");
    btn.dataset.outlet = outlet.label;
    btn.textContent = outlet.label;
    btn.addEventListener("click", () => switchOutlet(btn, outlet.label));
    container.appendChild(btn);
  });
}

function switchOutlet(el, name) {
  document.querySelectorAll(".ot").forEach(t => t.classList.remove("active"));
  el.classList.add("active");
  currentOutlet = name;
  document.getElementById("obadge").textContent    = name;
  document.getElementById("heroOutlet").textContent = name;
  loadSalesData(name);
}

/* ---- APPLY LINKS (Forms) ---- */
function applyLinks() {
  const map = {
    "link-formc-new":  CONFIG.LINKS.FORM_C_NEW,
    "link-formc-rec":  CONFIG.LINKS.FORM_C_RECORDS,
    "link-formp-new":  CONFIG.LINKS.FORM_P_NEW,
    "link-formp-rec":  CONFIG.LINKS.FORM_P_RECORDS,
    "link-cx-log":     CONFIG.LINKS.CX_LOG,
    "link-cx-report":  CONFIG.LINKS.CX_REPORT,
    "link-focamm":     CONFIG.LINKS.FOCAMM,
    "link-kmp":        CONFIG.LINKS.KMP,
    "link-focamm-rec": CONFIG.LINKS.FOCAMM_RECORDS,
  };
  Object.entries(map).forEach(([id, url]) => {
    const el = document.getElementById(id);
    if (el && url) el.href = url;
  });
}

/* ---- APPLY HELP CONTACTS ---- */
function applyHelp() {
  const phone = document.getElementById("link-hq-phone");
  const email = document.getElementById("link-hq-email");
  const wa    = document.getElementById("link-wa");
  const txtP  = document.getElementById("txt-hq-phone");
  const txtE  = document.getElementById("txt-hq-email");

  if (phone) phone.href = "tel:" + CONFIG.HELP.HQ_PHONE;
  if (email) email.href = "mailto:" + CONFIG.HELP.HQ_EMAIL;
  if (wa    && CONFIG.HELP.IT_WHATSAPP) wa.href = CONFIG.HELP.IT_WHATSAPP;
  if (txtP) txtP.textContent = CONFIG.HELP.HQ_PHONE;
  if (txtE) txtE.textContent = CONFIG.HELP.HQ_EMAIL;
}

/* ---- ANNOUNCEMENTS ---- */
async function loadAnnouncements() {
  if (!CONFIG.SHEETS_ANNO_URL) { renderSampleAnnouncements(); return; }
  try {
    const res  = await fetch(CONFIG.SHEETS_ANNO_URL);
    const data = await res.json();
    announcements = data.filter(r => String(r.active).toUpperCase() === "TRUE");
    updateAnnoCount(announcements.length);
    renderAnnouncements();
  } catch (e) {
    console.warn("Announcements fetch failed, using sample data.", e);
    renderSampleAnnouncements();
  }
}

function updateAnnoCount(n) {
  const badge = document.getElementById("annoBadge");
  const stat  = document.getElementById("statNotices");
  if (badge) badge.textContent = n;
  if (stat)  stat.textContent  = n;
}

function renderAnnouncements() {
  const homeEl = document.getElementById("homeAnnoList");
  const fullEl = document.getElementById("fullAnnoList");
  const html   = (items) => items.length
    ? items.map((a, i) => `
        <div class="anno-item">
          <div class="adot ${i > 1 ? "read" : ""}"></div>
          <div>
            <div class="atitle">${esc(a.title)}</div>
            <div class="ameta">${esc(a.date)}${a.outlet ? " · " + esc(a.outlet) : ""}</div>
          </div>
        </div>`).join("")
    : `<div class="empty-row">No announcements.</div>`;
  if (homeEl) homeEl.innerHTML = html(announcements.slice(0, 3));
  if (fullEl) fullEl.innerHTML = html(announcements);
}

function renderSampleAnnouncements() {
  announcements = [
    { title: "Monthly Meeting — May 2025",     date: "19 May 2025", outlet: "HQ"         },
    { title: "SOP Service Update",             date: "15 May 2025", outlet: "Operations" },
    { title: "Public Holiday — Wesak Day",     date: "10 May 2025", outlet: "HR"         },
    { title: "Reminder — Daily Report",        date: "5 May 2025",  outlet: "Operations" },
    { title: "May Promotion Campaign",         date: "1 May 2025",  outlet: "Sales"      },
  ];
  updateAnnoCount(announcements.length);
  renderAnnouncements();
}

/* ---- MEMO ---- */
async function loadMemo() {
  /* Google Drive public folder listing requires a server-side proxy or Apps Script.
     When you're ready, create an Apps Script (see README > MEMO_SCRIPT.gs) and set
     CONFIG.SHEETS_SALES_URL — for now, sample data is shown.                        */
  renderSampleMemo();
}

function renderSampleMemo() {
  memoFiles = [
    { name: "Memo 001 — Service Procedure", date: "18 May 2025", size: "245 KB", url: `https://drive.google.com/drive/folders/${CONFIG.DRIVE_MEMO_FOLDER_ID}` },
    { name: "Memo 002 — Pricing",           date: "16 May 2025", size: "180 KB", url: `https://drive.google.com/drive/folders/${CONFIG.DRIVE_MEMO_FOLDER_ID}` },
    { name: "Memo 003 — Customer Guide",    date: "12 May 2025", size: "312 KB", url: `https://drive.google.com/drive/folders/${CONFIG.DRIVE_MEMO_FOLDER_ID}` },
    { name: "Daily Report Template",        date: "10 May 2025", size: "98 KB",  url: `https://drive.google.com/drive/folders/${CONFIG.DRIVE_MEMO_FOLDER_ID}` },
    { name: "Memo 004 — Q2 Target",         date: "1 May 2025",  size: "201 KB", url: `https://drive.google.com/drive/folders/${CONFIG.DRIVE_MEMO_FOLDER_ID}` },
  ];
  const stat   = document.getElementById("statMemo");
  if (stat) stat.textContent = memoFiles.length;

  const render = (f) => `
    <a class="memo-item" href="${esc(f.url)}" target="_blank">
      <i class="ti ti-file-type-pdf micon"></i>
      <div class="mi"><div class="mn">${esc(f.name)}</div><div class="md">${esc(f.date)}</div></div>
      <div class="ms">${esc(f.size)}</div>
    </a>`;

  const homeEl = document.getElementById("homeMemoList");
  const fullEl = document.getElementById("fullMemoList");
  if (homeEl) homeEl.innerHTML = memoFiles.slice(0, 3).map(render).join("");
  if (fullEl) fullEl.innerHTML = memoFiles.map(render).join("");
}

/* ---- SALES DATA ---- */
async function loadSalesData(outletName) {
  if (!CONFIG.SHEETS_SALES_URL) { renderSampleSales(outletName); return; }
  try {
    const url = CONFIG.SHEETS_SALES_URL + "?outlet=" + encodeURIComponent(outletName);
    const res  = await fetch(url);
    const data = await res.json();
    renderSalesCards(data);
    if (data.saList) renderSATable(data.saList);
  } catch (e) {
    console.warn("Sales fetch failed, using sample data.", e);
    renderSampleSales(outletName);
  }
}

function renderSampleSales(outletName) {
  /* Randomise slightly per outlet so tabs feel different */
  const seed = outletName.charCodeAt(4) || 3;
  const units = seed + 1;
  const so    = (units * 6800).toLocaleString("en-MY", { style: "currency", currency: "MYR", maximumFractionDigits: 0 });
  renderSalesCards({ unitPerDay: units, totalSO: so, target: "15 units", achvPerSA: (units / 3).toFixed(1) + " units" });
  renderSATable([
    { name: "Ahmad Syafiq",  unitDay: 1.8, totalSO: "RM 12,400", target: "5 units", achv: 92 },
    { name: "Nur Aisyah",   unitDay: 1.2, totalSO: "RM 8,200",  target: "5 units", achv: 64 },
    { name: "Hazrul Nizam", unitDay: 1.0, totalSO: "RM 7,600",  target: "5 units", achv: 48 },
  ]);
}

function renderSalesCards(data) {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val ?? "—"; };
  set("s-unitday", data.unitPerDay);
  set("s-totalso", data.totalSO);
  set("s-target",  data.target);
  set("s-achv",    data.achvPerSA);
}

function renderSATable(saList) {
  const tbody = document.getElementById("saTableBody");
  if (!tbody) return;
  tbody.innerHTML = saList.map(sa => {
    const cls = sa.achv >= 80 ? "hi" : sa.achv >= 50 ? "mid" : "lo";
    return `<tr>
      <td>${esc(sa.name)}</td>
      <td class="num">${sa.unitDay}</td>
      <td class="num">${esc(sa.totalSO)}</td>
      <td class="num">${esc(sa.target)}</td>
      <td><span class="pct ${cls}">${sa.achv}%</span></td>
    </tr>`;
  }).join("");
}

/* ---- STOCK ---- */
function loadStock() {
  /* Replace with fetch from Apps Script when ready */
  const data = [
    { item: "Engine Oil 5W-30", cat: "Service",    qty: 48, status: "ok"  },
    { item: "Tyre 185/65 R15",  cat: "Tyres",      qty: 6,  status: "low" },
    { item: "Brake Pad (set)",  cat: "Brakes",     qty: 0,  status: "out" },
    { item: "Air Filter",       cat: "Service",    qty: 22, status: "ok"  },
    { item: "Battery 65AH",     cat: "Electrical", qty: 3,  status: "low" },
  ];
  const labels = { ok: "Sufficient", low: "Low", out: "Out of Stock" };
  const tbody  = document.getElementById("stockBody");
  if (!tbody) return;
  tbody.innerHTML = data.map(r => `
    <tr>
      <td>${esc(r.item)}</td>
      <td>${esc(r.cat)}</td>
      <td>${r.qty} units</td>
      <td><span class="stag ${r.status}">${labels[r.status]}</span></td>
    </tr>`).join("");
}

/* ---- UTIL ---- */
function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
