/* High on Intelligence — Skills Radar
   20 statements · 5 domains · canvas radar · stored on this device only */

const RADAR_DOMAINS = [
  { id: "ai",   label: "AI / ML",        icon: "🧠", color: "#a78bfa",
    items: ["I can explain gradient descent from scratch", "I have fine-tuned or evaluated an open model", "I can build a tool-using agent", "I understand attention and transformers conceptually"] },
  { id: "swe",  label: "Software / Web", icon: "🛠️", color: "#38bdf8",
    items: ["I ship small full-stack apps end-to-end", "I'm fluent with Git branching and PRs", "I can debug production calmly", "I write tests before I'm proud of the code"] },
  { id: "sec",  label: "Security",       icon: "🛡️", color: "#f87171",
    items: ["I finished OverTheWire Bandit", "I can spot OWASP Top 10 issues", "I practice hacking on legal sandboxes", "I understand authn, authz and crypto basics"] },
  { id: "data", label: "Data / Math",    icon: "📐", color: "#34d399",
    items: ["Linear algebra doesn't scare me", "I do joins and window functions fluently", "My p-value instincts are trained", "I can read a paper and rip it apart kindly"] },
  { id: "life", label: "Life / Mind",    icon: "🌌", color: "#fbbf24",
    items: ["I sleep and move deliberately (WHO)", "I contemplate/meditate regularly", "My values decide my work, not only my fears", "I can sit with difficulty without panic"] }
];

const RADAR_KEY = "hoi_radar_v1";
const load = () => { try { return JSON.parse(localStorage.getItem(RADAR_KEY)) || {}; } catch { return {}; } };
const save = v => { try { localStorage.setItem(RADAR_KEY, JSON.stringify(v)); } catch {} };

const scoresOf = () => RADAR_DOMAINS.map(d => {
  const v = load()[d.id] || {};
  const vals = d.items.map((_, i) => Number(v[i] || 0));
  const filled = vals.filter(x => x > 0);
  return filled.length ? filled.reduce((a, b) => a + b, 0) / filled.length : 0;
});

function renderQuestions() {
  const wrap = document.getElementById("radarQuestions");
  const saved = load();
  wrap.innerHTML = RADAR_DOMAINS.map(d => `
    <fieldset class="radar-domain" style="--dom:${d.color}">
      <legend>${d.icon} ${d.label}</legend>
      ${d.items.map((q, i) => `
        <label class="radar-row">
          <span class="radar-q">${q}</span>
          <input type="range" min="0" max="5" step="1" value="${(saved[d.id] && saved[d.id][i]) || 0}" data-domain="${d.id}" data-idx="${i}" aria-label="Rate: ${q}">
          <output>${(saved[d.id] && saved[d.id][i]) || 0}/5</output>
        </label>`).join("")}
    </fieldset>`).join("");

  wrap.querySelectorAll('input[type="range"]').forEach(inp => {
    const out = inp.parentElement.querySelector("output");
    inp.addEventListener("input", () => {
      const s = load();
      const d = inp.dataset.domain, i = inp.dataset.idx;
      s[d] = s[d] || {}; s[d][i] = Number(inp.value);
      save(s);
      out.textContent = inp.value + "/5";
      drawRadar(); updateVerdict();
    });
  });
}

const canvas = document.getElementById("radarCanvas");
const ctx = canvas.getContext("2d");

function drawRadar() {
  const W = canvas.width, H = canvas.height, cx = W / 2, cy = H / 2 + 6;
  const R = Math.min(W, H) * 0.33;
  ctx.clearRect(0, 0, W, H);
  const N = RADAR_DOMAINS.length;
  const angle = i => (-Math.PI / 2) + (i * 2 * Math.PI / N);

  /* grid rings */
  ctx.lineWidth = 1;
  for (let level = 1; level <= 5; level++) {
    ctx.beginPath();
    for (let i = 0; i <= N; i++) {
      const a = angle(i % N), r = (R * level) / 5;
      const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.strokeStyle = level === 5 ? "rgba(190,180,255,.5)" : "rgba(190,180,255,.14)";
    ctx.stroke();
  }
  /* axes + labels */
  RADAR_DOMAINS.forEach((d, i) => {
    const a = angle(i);
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
    ctx.strokeStyle = "rgba(190,180,255,.18)"; ctx.stroke();
    const lx = cx + Math.cos(a) * (R + 26), ly = cy + Math.sin(a) * (R + 18);
    ctx.font = "600 12px system-ui, sans-serif"; ctx.fillStyle = d.color;
    ctx.textAlign = Math.abs(Math.cos(a)) < .35 ? "center" : Math.cos(a) > 0 ? "left" : "right";
    ctx.fillText(d.icon + " " + d.label, lx, ly + 4);
  });
  /* value polygon */
  const vals = scoresOf();
  ctx.beginPath();
  vals.forEach((v, i) => {
    const a = angle(i), r = (R * v) / 5;
    const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  });
  ctx.closePath();
  const g = ctx.createRadialGradient(cx, cy, 10, cx, cy, R);
  g.addColorStop(0, "rgba(167,139,250,.55)");
  g.addColorStop(1, "rgba(56,189,248,.30)");
  ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = "#a78bfa"; ctx.lineWidth = 2; ctx.stroke();
  /* vertex dots */
  vals.forEach((v, i) => {
    const a = angle(i), r = (R * v) / 5;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 4, 0, 2 * Math.PI);
    ctx.fillStyle = "#fbbf24"; ctx.fill();
  });
  if (!vals.some(v => v > 0)) {
    ctx.fillStyle = "rgba(236,233,247,.55)"; ctx.font = "13px system-ui"; ctx.textAlign = "center";
    ctx.fillText("Rate the 20 statements — your shape will appear.", cx, cy);
  }
}

function verdict() {
  const vals = scoresOf();
  if (!vals.some(v => v > 0)) return "Your radar will speak once you answer honestly. No one else sees it.";
  const max = Math.max(...vals), min = Math.min(...vals);
  const best = RADAR_DOMAINS[vals.indexOf(max)].label, weakest = RADAR_DOMAINS[vals.indexOf(min)].label;
  const spread = max - min;
  const shape = spread < 1 ? "balanced" : spread < 2.5 ? "spiky" : "dramatic";
  return `Strongest domain: ${best} (${max.toFixed(1)}) · Weakest: ${weakest} (${min.toFixed(1)}) · Shape: ${shape}. ${spread < 1 ? "A generalist — tend whatever is weakest first." : "A specialist in the making — feed your weak axis through the HOI tracks."}`;
}
const updateVerdict = () => { document.getElementById("radarVerdict").textContent = verdict(); };

document.getElementById("radarReset").addEventListener("click", () => {
  if (!confirm("Erase your radar answers on this device?")) return;
  localStorage.removeItem(RADAR_KEY);
  renderQuestions(); drawRadar(); updateVerdict();
});
document.getElementById("radarExport").addEventListener("click", () => {
  const vals = scoresOf();
  if (!vals.some(v => v > 0)) { alert("Answer a few statements first — the export would be empty."); return; }
  const lines = RADAR_DOMAINS.map((d, i) => `- ${d.label}: ${vals[i].toFixed(1)} / 5`);
  const md = `# HOI — My Skills Radar (${new Date().toISOString().slice(0, 10)})\n\n${lines.join("\n")}\n\n${verdict()}\n\nRetaken via high-on-intelligence/radar.html`;
  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = "hoi-skills-radar.md"; a.click();
  URL.revokeObjectURL(a.href);
});

renderQuestions();
drawRadar();
updateVerdict();
