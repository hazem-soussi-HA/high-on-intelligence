/* ============================================================
   Aethric Status — honest browser-side origin checks
   No backend, no beacons. Stored: hoi_status_v1 (this device).
   ============================================================ */

const ORIGINS = [
  { id: "pages", name: "Origin A — GitHub Pages (Global CDN)", url: "https://hazem-soussi-ha.github.io/high-on-intelligence/", pending: false },
  { id: "mirror", name: "Origin B — sovereign mirror (self-hosted, LAN-only)", url: "", pending: false, note: "Green from inside the network; invisible to the public internet by design. No address is published — not for drama, for the same reason you don't publish where your water tower is." }
];
const HISTORY_KEY = "hoi_status_v1";
const HISTORY_MAX = 60;

const grid = document.getElementById("originGrid");

const loadHistory = () => { try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch { return []; } };
const saveHistory = h => { try { localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(-HISTORY_MAX))); } catch {} };

async function checkOrigin(o) {
  if (o.pending || !o.url) return { up: null };
  const t0 = performance.now();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6000);
  try {
    /* no-cors: we only need reachability, not the body */
    await fetch(o.url, { mode: "no-cors", cache: "no-store", signal: ctrl.signal });
    clearTimeout(timer);
    return { up: true, latency: Math.round(performance.now() - t0) };
  } catch {
    clearTimeout(timer);
    return { up: false, latency: Math.round(performance.now() - t0) };
  }
}

function renderCard(o, result) {
  const card = document.createElement("div");
  card.className = "origin-card";
  card.dataset.id = o.id;
  let stateClass, stateText;
  if (!o.url) { stateClass = "state-pending"; stateText = "PRIVATE — by design"; }
  else if (result && result.up === true) { stateClass = "state-up"; stateText = "● UP"; }
  else if (result && result.up === false) { stateClass = "state-down"; stateText = "● DOWN (from this browser)"; }
  else { stateClass = "state-checking"; stateText = "checking…"; }

  const hist = loadHistory().filter(h => h.origins[o.id] !== undefined);
  const ups = hist.filter(h => h.origins[o.id] === true).length;
  const uptime = hist.length ? Math.round((ups / hist.length) * 100) : null;
  const ticks = hist.slice(-40).map(h => `<span class="tick ${h.origins[o.id] ? "up" : "down"}" title="${new Date(h.t).toLocaleString()} — ${h.origins[o.id] ? "up" : "down"}"></span>`).join("");

  card.innerHTML = `
    <div class="origin-head"><span class="dot ${!o.url ? "" : result && result.up === true ? "up" : result && result.up === false ? "down" : ""}"></span><h3>${o.name}</h3></div>
    ${o.url ? `<div class="origin-url">${o.url}</div>` : `<div class="origin-url">unlisted — by design</div>`}
    <div class="origin-state ${stateClass}">${stateText}</div>
    <div class="latency">${!o.url ? (o.note || "") : result && result.latency != null ? `latency ~${result.latency} ms (this browser)` : "waiting for first check…"}</div>
    ${o.url ? `<div class="history-grid" aria-label="Recent checks">${ticks || '<span class="latency">no history yet — checks just began</span>'}</div>
    <div class="uptime-line">${uptime !== null ? `${uptime}% up across your last ${hist.length} checks` : "collecting samples…"}</div>` : ""}`;
  return card;
}

async function renderAll() {
  const results = {};
  await Promise.all(ORIGINS.map(async o => { results[o.id] = await checkOrigin(o); }));
  const hist = loadHistory();
  hist.push({ t: Date.now(), origins: Object.fromEntries(Object.entries(results).map(([k, v]) => [k, v.up])) });
  saveHistory(hist);
  grid.innerHTML = "";
  ORIGINS.forEach(o => grid.appendChild(renderCard(o, results[o.id])));
}

renderAll();
setInterval(renderAll, 30000);
