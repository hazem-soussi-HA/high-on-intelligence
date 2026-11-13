/* =====================================================================
   High on Intelligence — Hazem Soussi · The Thinking Machine
   app.js — rendering, state (localStorage), interactions
   ===================================================================== */

"use strict";

const $  = (s, c) => (c || document).querySelector(s);
const $$ = (s, c) => [...(c || document).querySelectorAll(s)];
const LS = { progress: "hoi_progress_v1", theme: "hoi_theme_v1", best: "hoi_quiz_best_v1", focus: "hoi_focus_v1", collab: "hoi_collab_v1", propose: "hoi_proposed_v1" };

const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};

const getProgress = () => store.get(LS.progress, {});
const setProgress = (p) => store.set(LS.progress, p);
const isDone = (id) => !!getProgress()[id];
const toggleDone = (id) => {
  const p = getProgress();
  p[id] ? delete p[id] : p[id] = Date.now();
  setProgress(p);
  refreshAll();
};

let toastTimer = null;
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}

const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
const totalHours = RESOURCES.reduce((a, r) => a + (r.hours || 0), 0);
const doneCount  = () => RESOURCES.filter(r => isDone(r.id)).length;
const doneHours  = () => RESOURCES.filter(r => isDone(r.id)).reduce((a, r) => a + (r.hours || 0), 0);

/* ============ THEME ============ */
function initTheme() {
  const saved = store.get(LS.theme, null);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));
  $("#themeToggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    store.set(LS.theme, next);
    applyTheme(next);
  });
}
function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  $("#themeToggle .icon-sun").style.display  = t === "dark" ? "none" : "inline";
  $("#themeToggle .icon-moon").style.display = t === "dark" ? "inline" : "none";
}

/* ============ LIBRARY ============ */
const state = { q: "", area: "all", level: "all", cost: "all", type: "all", sort: "area" };

function filteredResources() {
  const q = state.q.trim().toLowerCase();
  let list = RESOURCES.filter(r => {
    if (state.area !== "all" && r.area !== state.area) return false;
    if (state.level !== "all" && r.level !== state.level) return false;
    if (state.cost !== "all" && r.cost !== state.cost) return false;
    if (state.type !== "all" && r.type !== state.type) return false;
    if (!q) return true;
    const hay = [r.title, r.provider, r.desc, AREAS[r.area].label, r.type, r.level, r.cost].join(" ").toLowerCase();
    return q.split(/\s+/).every(w => hay.includes(w));
  });
  switch (state.sort) {
    case "az":    list.sort((a,b) => a.title.localeCompare(b.title)); break;
    case "time":  list.sort((a,b) => (b.hours||0) - (a.hours||0)); break;
    case "area":  list.sort((a,b) => a.area.localeCompare(b.area) || a.title.localeCompare(b.title)); break;
    default: break;
  }
  return list;
}

function resourceCard(r) {
  const done = isDone(r.id);
  const a = AREAS[r.area];
  return `
  <article class="card resource-card${done ? " done" : ""}" data-id="${esc(r.id)}">
    <div class="card-top">
      <span class="tag area-tag" style="--tag:${a.color}">${esc(a.label)}</span>
      <span class="tag lvl-${r.level}">${esc(r.level)}</span>
      <span class="tag cost-${r.cost}">${esc(r.cost)}</span>
      ${done ? '<span class="done-badge">✓ completed</span>' : ""}
    </div>
    <h3 class="card-title"><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.title)} <span class="ext">↗</span></a></h3>
    <p class="card-provider">${esc(r.provider)} · ${esc(r.type)} · ~${r.hours}h</p>
    <p class="card-desc">${esc(r.desc)}</p>
    <div class="card-actions">
      <button class="btn small ${done ? "ghost" : "primary"} js-toggle-done" data-id="${esc(r.id)}">${done ? "Mark not done" : "Mark done"}</button>
      <button class="btn small ghost js-copy" data-url="${esc(r.url)}" data-title="${esc(r.title)}">Copy link</button>
    </div>
  </article>`;
}

function renderLibrary() {
  const list = filteredResources();
  $("#libCount").textContent = `${list.length} resource${list.length === 1 ? "" : "s"}`;
  $("#libGrid").innerHTML = list.length
    ? list.map(resourceCard).join("")
    : `<div class="empty">No matches for <strong>${esc(state.q)}</strong>. Try a different word — or clear the filters.</div>`;
}

/* ============ PATHS ============ */
function renderPaths() {
  $("#pathsGrid").innerHTML = PATHS.map(p => {
    const steps = p.steps.map(id => RESOURCE_BY_ID[id]).filter(Boolean);
    const done = steps.filter(s => isDone(s.id)).length;
    const pct = steps.length ? Math.round(done / steps.length * 100) : 0;
    return `
    <section class="path-card" aria-label="${esc(p.name)}">
      <div class="path-head">
        <span class="path-icon">${p.icon}</span>
        <div>
          <h3>${esc(p.name)}</h3>
          <p class="path-sub">${esc(p.subtitle)}</p>
        </div>
      </div>
      <p class="path-desc">${esc(p.desc)}</p>
      <div class="progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-fill" style="width:${pct}%"></div>
      </div>
      <p class="path-meta">${done}/${steps.length} steps · ${pct}%</p>
      <ol class="path-steps">
        ${steps.map((s, i) => `
          <li class="${isDone(s.id) ? "step-done" : ""}">
            <button class="step-check js-toggle-done" data-id="${esc(s.id)}" aria-label="Toggle complete: ${esc(s.title)}">${isDone(s.id) ? "✓" : i + 1}</button>
            <a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a>
          </li>`).join("")}
      </ol>
    </section>`;
  }).join("");
}

/* ============ DASHBOARD / HERO STATS ============ */
function renderStats() {
  const total = RESOURCES.length;
  const d = doneCount();
  $("#statTotal").textContent = total;
  $("#statDone").textContent  = d;
  $("#statHours").textContent = doneHours() + "h";
  const pct = total ? Math.round(d / total * 100) : 0;
  $("#heroBar").style.width = pct + "%";
  $("#heroPct").textContent = pct + "%";

  /* per-area breakdown */
  $("#areaBreakdown").innerHTML = Object.entries(AREAS).map(([key, a]) => {
    const items = RESOURCES.filter(r => r.area === key);
    const done  = items.filter(r => isDone(r.id)).length;
    const pctA  = items.length ? Math.round(done / items.length * 100) : 0;
    return `
      <div class="area-row">
        <span class="area-name"><i style="background:${a.color}"></i>${esc(a.label)}</span>
        <div class="progress slim"><div class="progress-fill" style="width:${pctA}%;background:${a.color}"></div></div>
        <span class="area-count">${done}/${items.length}</span>
      </div>`;
  }).join("");
}

function exportProgress(kind) {
  const p = getProgress();
  const lines = RESOURCES.filter(r => p[r.id]).map(r => `- [x] ${r.title} — ${r.provider} (${AREAS[r.area].label}) ${r.url}`);
  if (!lines.length) { toast("Nothing to export yet — mark a resource done first."); return; }
  const md = `# High on Intelligence — My Learning Journey (Hazem Soussi · The Thinking Machine)\n\nCompleted: ${lines.length}/${RESOURCES.length} resources · ~${doneHours()} hours invested\n\n${lines.join("\n")}\n`;
  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "hoi-journey.md";
  a.click();
  URL.revokeObjectURL(a.href);
  toast("Journey exported as Markdown.");
}
function exportJSON() {
  const blob = new Blob([JSON.stringify({ exported: new Date().toISOString(), progress: getProgress() }, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "hoi-progress.json";
  a.click();
  URL.revokeObjectURL(a.href);
  toast("Progress backup downloaded.");
}

/* ============ QUOTE CAROUSEL ============ */
let quoteIdx = 0, quoteTimer = null;
function renderQuote() {
  const q = QUOTES[quoteIdx];
  const el = $("#quoteText");
  el.style.opacity = 0;
  setTimeout(() => {
    el.innerHTML = `“${esc(q.t)}” <span class="quote-author">— ${esc(q.a)}</span>`;
    el.style.opacity = 1;
  }, 160);
}
function initQuotes() {
  const total = QUOTES.length;
  $("#quoteCounter").textContent = `${quoteIdx + 1} / ${total}`;
  $("#quoteText").textContent = `“${QUOTES[0].t}” — ${QUOTES[0].a}`;
  const advance = (dir) => {
    quoteIdx = (quoteIdx + dir + total) % total;
    renderQuote();
    $("#quoteCounter").textContent = `${quoteIdx + 1} / ${total}`;
    clearInterval(quoteTimer);
    quoteTimer = setInterval(() => { quoteIdx = (quoteIdx + 1) % total; renderQuote(); $("#quoteCounter").textContent = `${quoteIdx + 1} / ${total}`; }, 7000);
  };
  $("#quotePrev").addEventListener("click", () => advance(-1));
  $("#quoteNext").addEventListener("click", () => advance(1));
  quoteTimer = setInterval(() => { quoteIdx = (quoteIdx + 1) % total; renderQuote(); $("#quoteCounter").textContent = `${quoteIdx + 1} / ${total}`; }, 7000);
}

/* ============ QUIZ ============ */
let quizState = { i: 0, answers: Array(QUIZ.length).fill(null), finished: false };
function renderQuiz() {
  const box = $("#quizBox");
  if (quizState.finished) {
    const correct = quizState.answers.filter((a, i) => a === QUIZ[i].a).length;
    const pct = Math.round(correct / QUIZ.length * 100);
    const best = Math.max(store.get(LS.best, 0), pct);
    store.set(LS.best, best);
    const msg = pct >= 90 ? "A true thinking machine." : pct >= 70 ? "Strong mind — keep going." : pct >= 50 ? "Foundations forming. Revisit the tracks." : "Every master was once a beginner. Start with the Foundations Track.";
    box.innerHTML = `
      <div class="quiz-result">
        <div class="quiz-score">${pct}%</div>
        <p class="quiz-verdict">${esc(msg)}</p>
        <p class="quiz-meta">${correct}/${QUIZ.length} correct · best score: ${best}%</p>
        <button class="btn primary" id="quizRetry">Take the quiz again</button>
      </div>`;
    $("#quizRetry").addEventListener("click", () => {
      quizState = { i: 0, answers: Array(QUIZ.length).fill(null), finished: false };
      renderQuiz();
    });
    return;
  }
  const i = quizState.i;
  const item = QUIZ[i];
  const chosen = quizState.answers[i];
  box.innerHTML = `
    <div class="quiz-progress-row">
      <span>Question ${i + 1} of ${QUIZ.length}</span>
      <div class="progress slim grow"><div class="progress-fill" style="width:${(i / QUIZ.length) * 100}%"></div></div>
      <span>${esc(AREAS[item.area].label)}</span>
    </div>
    <h3 class="quiz-q">${esc(item.q)}</h3>
    <div class="quiz-options">
      ${item.options.map((o, idx) => {
        let cls = "quiz-opt";
        if (chosen !== null) {
          if (idx === item.a) cls += " correct";
          else if (idx === chosen) cls += " wrong";
        }
        return `<button class="${cls}" data-idx="${idx}" ${chosen !== null ? "disabled" : ""}>${esc(o)}</button>`;
      }).join("")}
    </div>
    <div class="quiz-nav">
      <button class="btn ghost" id="quizPrevBtn" ${i === 0 ? "disabled" : ""}>← Back</button>
      <button class="btn primary" id="quizNextBtn" ${chosen === null ? "disabled" : ""}>${i === QUIZ.length - 1 ? "Finish" : "Next →"}</button>
    </div>`;
  $$(".quiz-opt", box).forEach(btn => btn.addEventListener("click", () => {
    quizState.answers[i] = Number(btn.dataset.idx);
    renderQuiz();
  }));
  $("#quizPrevBtn").addEventListener("click", () => { if (i > 0) { quizState.i--; renderQuiz(); } });
  $("#quizNextBtn").addEventListener("click", () => {
    if (quizState.answers[i] === null) return;
    if (i === QUIZ.length - 1) { quizState.finished = true; } else { quizState.i++; }
    renderQuiz();
  });
}

/* ============ POMODORO FOCUS TIMER ============ */
const focus = { mode: "focus", seconds: 25 * 60, running: false, interval: null, cycles: store.get(LS.focus, { sessions: 0 }).sessions };
const MODES = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };

function beep(freq, dur) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine"; o.frequency.value = freq || 880;
    g.gain.setValueAtTime(0.001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (dur || 0.5));
    o.connect(g); g.connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + (dur || 0.5) + 0.05);
  } catch {}
}

function renderTimer() {
  const m = String(Math.floor(focus.seconds / 60)).padStart(2, "0");
  const s = String(focus.seconds % 60).padStart(2, "0");
  $("#timerDisplay").textContent = `${m}:${s}`;
  document.title = focus.running ? `${m}:${s} · High on Intelligence Focus` : "High on Intelligence — Hazem Soussi · The Thinking Machine";
  $("#timerMode").textContent = focus.mode === "focus" ? "Deep focus" : focus.mode === "short" ? "Short break" : "Long break";
  $("#focusSessions").textContent = focus.cycles;
  $("#timerToggle").textContent = focus.running ? "Pause" : "Start";
  $$(".mode-btn").forEach(b => b.classList.toggle("active", b.dataset.mode === focus.mode));
}
function tickTimer() {
  focus.seconds--;
  if (focus.seconds <= 0) {
    clearInterval(focus.interval);
    focus.running = false;
    beep(660, 0.6); setTimeout(() => beep(880, 0.6), 350); setTimeout(() => beep(1320, 0.8), 700);
    if (focus.mode === "focus") {
      focus.cycles++;
      store.set(LS.focus, { sessions: focus.cycles });
      toast("Focus session complete. Breathe. Hydrate. Stretch.");
    } else {
      toast("Break over — back into the work.");
    }
    focus.mode = focus.mode === "focus" ? "short" : "focus";
    focus.seconds = MODES[focus.mode];
  }
  renderTimer();
}
function initTimer() {
  $("#timerToggle").addEventListener("click", () => {
    focus.running = !focus.running;
    if (focus.running) { focus.interval = setInterval(tickTimer, 1000); } else { clearInterval(focus.interval); }
    renderTimer();
  });
  $("#timerReset").addEventListener("click", () => { clearInterval(focus.interval); focus.running = false; focus.seconds = MODES[focus.mode]; renderTimer(); });
  $$(".mode-btn").forEach(b => b.addEventListener("click", () => {
    clearInterval(focus.interval); focus.running = false;
    focus.mode = b.dataset.mode; focus.seconds = MODES[focus.mode]; renderTimer();
  }));
  renderTimer();
}

/* ============ BREATHING WIDGET (box breathing 4-4-4-4) ============ */
function initBreath() {
  const circle = $("#breathCircle");
  const label  = $("#breathLabel");
  const btn    = $("#breathToggle");
  let phase = 0, t = null, active = false;
  const PHASES = [
    { name: "Breathe in", dur: 4000, cls: "inhale" },
    { name: "Hold",       dur: 4000, cls: "hold" },
    { name: "Breathe out",dur: 4000, cls: "exhale" },
    { name: "Hold",       dur: 4000, cls: "hold" }
  ];
  const cycle = () => {
    const p = PHASES[phase];
    label.textContent = p.name;
    circle.className = "breath-circle " + p.cls;
    phase = (phase + 1) % PHASES.length;
    if (active) t = setTimeout(cycle, p.dur);
  };
  btn.addEventListener("click", () => {
    active = !active;
    btn.textContent = active ? "Stop" : "Begin breathing";
    if (active) { phase = 0; cycle(); } else { clearTimeout(t); label.textContent = "Ready"; circle.className = "breath-circle"; }
  });
}

/* ============ ASSISTANT UI ============ */
function renderAssistantResults(picks, into) {
  into.innerHTML = picks.map(id => {
    const r = RESOURCE_BY_ID[id];
    if (!r) return "";
    return `<a class="assistant-pick" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">
      <span class="tag area-tag" style="--tag:${AREAS[r.area].color}">${esc(AREAS[r.area].label)}</span>
      <strong>${esc(r.title)}</strong>
      <small>${esc(r.provider)} ↗</small>
    </a>`;
  }).join("");
}
function initAssistant() {
  const form = $("#assistantForm");
  const input = $("#assistantInput");
  const log = $("#assistantLog");
  const send = (text) => {
    const q = text.trim();
    if (!q) return;
    const userBubble = document.createElement("div");
    userBubble.className = "bubble user";
    userBubble.textContent = q;
    log.appendChild(userBubble);
    const thinking = document.createElement("div");
    thinking.className = "bubble machine thinking";
    thinking.textContent = "…";
    log.appendChild(thinking);
    log.scrollTop = log.scrollHeight;
    const answer = assistantAnswer(q);
    setTimeout(() => {
      thinking.classList.remove("thinking");
      thinking.innerHTML = esc(answer.text) + (answer.picks.length ? '<div class="assistant-picks"></div>' : "");
      if (answer.picks.length) renderAssistantResults(answer.picks, $(".assistant-picks", thinking));
      log.scrollTop = log.scrollHeight;
    }, 450);
    input.value = "";
  };
  form.addEventListener("submit", e => { e.preventDefault(); send(input.value); });
  $$(".assistant-chip").forEach(chip => chip.addEventListener("click", () => send(chip.textContent)));
}

/* ============ COLLABORATE + MANIFEST ============ */
function buildManifest(data) {
  return `# High on Intelligence — Collaboration Manifest · ${data.name}\n\n` +
    `**Portal:** High on Intelligence — Hazem Soussi · The Thinking Machine\n` +
    `**What I offer:** ${data.offer}\n` +
    `**What I want to build:** ${data.build}\n` +
    `**Skills & tools:** ${data.skills}\n` +
    `**Availability:** ${data.availability}\n` +
    `**Contact:** ${data.contact}\n\n` +
    `*Generated locally by the High on Intelligence portal — I am ready to collaborate into the thinking machine.*`;
}
function initCollaborate() {
  const form = $("#collabForm");
  const out  = $("#collabManifest");
  const saved = store.get(LS.collab, null);
  if (saved) {
    ["name","contact","offer","build","skills","availability"].forEach(k => { if (form.elements[k]) form.elements[k].value = saved[k] || ""; });
    out.textContent = buildManifest(saved);
  }
  form.addEventListener("input", () => {
    const data = Object.fromEntries(new FormData(form).entries());
    store.set(LS.collab, data);
    out.textContent = buildManifest(data);
  });
  $("#copyManifest").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(out.textContent); toast("Manifest copied to clipboard."); }
    catch { const r = document.createRange(); r.selectNodeContents(out); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); toast("Select-all + Ctrl+C to copy."); }
  });
  $("#downloadManifest").addEventListener("click", () => {
    const blob = new Blob([out.textContent], { type: "text/markdown;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "hoi-collaboration-manifest.md";
    a.click();
    URL.revokeObjectURL(a.href);
  });
}

/* ============ PROPOSE A RESOURCE ============ */
function initPropose() {
  const form = $("#proposeForm");
  const list = $("#proposedList");
  const renderList = () => {
    const items = store.get(LS.propose, []);
    list.innerHTML = items.length
      ? items.map((p, i) => `<li><strong>${esc(p.title)}</strong> — <a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">${esc(p.url)}</a> <button class="link-btn" data-i="${i}" aria-label="Remove">✕</button></li>`).join("")
      : "<li class='muted'>Nothing proposed yet — be the first to grow the library.</li>";
    $$(".link-btn", list).forEach(b => b.addEventListener("click", () => {
      const items = store.get(LS.propose, []);
      items.splice(Number(b.dataset.i), 1);
      store.set(LS.propose, items);
      renderList();
    }));
  };
  form.addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(form);
    const title = (fd.get("ptitle") || "").toString().trim();
    const url   = (fd.get("purl") || "").toString().trim();
    if (!title || !/^https?:\/\/.+\..+/.test(url)) { toast("Please provide a title and a valid https:// URL."); return; }
    const items = store.get(LS.propose, []);
    items.push({ title, url, at: new Date().toISOString() });
    store.set(LS.propose, items);
    form.reset();
    renderList();
    toast("Resource proposed and saved locally. Thank you.");
  });
  $("#exportProposed").addEventListener("click", () => {
    const items = store.get(LS.propose, []);
    if (!items.length) { toast("No proposed resources yet."); return; }
    const md = "# High on Intelligence — Proposed Resources\n\n" + items.map(p => `- [${p.title}](${p.url})`).join("\n") + "\n";
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "hoi-proposed-resources.md";
    a.click();
    URL.revokeObjectURL(a.href);
  });
  renderList();
}

/* ============ RANDOM RESOURCE ============ */
function initRandom() {
  $("#randomResource").addEventListener("click", () => {
    const remaining = RESOURCES.filter(r => !isDone(r.id));
    const pool = remaining.length ? remaining : RESOURCES;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    $("#randomOut").innerHTML = `
      <span class="tag area-tag" style="--tag:${AREAS[pick.area].color}">${esc(AREAS[pick.area].label)}</span>
      <a href="${esc(pick.url)}" target="_blank" rel="noopener noreferrer"><strong>${esc(pick.title)}</strong> ↗</a>
      <small>${esc(pick.provider)} · ~${pick.hours}h · ${esc(pick.level)}</small>`;
  });
}

/* ============ COMMAND PALETTE (Ctrl/Cmd+K) ============ */
function initPalette() {
  const overlay = $("#palette");
  const input = $("#paletteInput");
  const results = $("#paletteResults");
  let sel = 0;

  const actions = [
    { label: "Go to Library", hint: "section", run: () => location.hash = "#library" },
    { label: "Go to Learning Paths", hint: "section", run: () => location.hash = "#paths" },
    { label: "Go to Assistant", hint: "section", run: () => location.hash = "#assistant" },
    { label: "Go to Quiz", hint: "section", run: () => location.hash = "#quiz" },
    { label: "Go to Focus Timer", hint: "section", run: () => location.hash = "#focus" },
    { label: "Go to Collaborate", hint: "section", run: () => location.hash = "#collaborate" },
    { label: "Toggle theme", hint: "action", run: () => $("#themeToggle").click() },
    { label: "Surprise me — random resource", hint: "action", run: () => { location.hash = "#library"; $("#randomResource").click(); } },
    { label: "Export my learning journey (Markdown)", hint: "action", run: () => exportProgress() }
  ];

  const search = (q) => {
    q = q.trim().toLowerCase();
    const act = actions.filter(a => !q || a.label.toLowerCase().includes(q));
    const res = (q ? RESOURCES.filter(r => [r.title, r.provider, r.desc].join(" ").toLowerCase().includes(q)) : RESOURCES).slice(0, 8)
      .map(r => ({ label: r.title, hint: AREAS[r.area].label, run: () => window.open(r.url, "_blank", "noopener") }));
    return [...act, ...res].slice(0, 12);
  };
  const render = (items) => {
    sel = 0;
    results.innerHTML = items.length
      ? items.map((it, i) => `<button class="palette-item${i === 0 ? " sel" : ""}" data-i="${i}"><span>${esc(it.label)}</span><em>${esc(it.hint)}</em></button>`).join("")
      : `<div class="palette-empty">No matches.</div>`;
    const btns = $$(".palette-item", results);
    btns.forEach((b, i) => {
      b.addEventListener("mousemove", () => { sel = i; btns.forEach(x => x.classList.remove("sel")); b.classList.add("sel"); });
      b.addEventListener("click", () => { items[i].run(); close(); });
    });
    results._items = items;
  };
  const open = () => { overlay.classList.add("open"); input.value = ""; render(search("")); setTimeout(() => input.focus(), 30); };
  const close = () => overlay.classList.remove("open");

  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); overlay.classList.contains("open") ? close() : open(); }
    else if (e.key === "Escape") close();
    else if (overlay.classList.contains("open") && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      const items = results._items || [];
      if (!items.length) return;
      sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
      $$(".palette-item", results).forEach((b, i) => b.classList.toggle("sel", i === sel));
    } else if (overlay.classList.contains("open") && e.key === "Enter") {
      const items = results._items || [];
      if (items[sel]) { items[sel].run(); close(); }
    }
  });
  input.addEventListener("input", () => render(search(input.value)));
  overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
}

/* ============ GLOBAL REFRESH ============ */
function refreshAll() {
  renderLibrary();
  renderPaths();
  renderStats();
}

document.addEventListener("click", e => {
  const t = e.target.closest(".js-toggle-done");
  if (t) { toggleDone(t.dataset.id); return; }
  const c = e.target.closest(".js-copy");
  if (c) {
    const url = c.dataset.url;
    (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(
      () => toast("Link copied: " + c.dataset.title),
      () => toast("Could not copy automatically.")
    );
  }
});

/* ============ INIT ============ */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  renderLibrary();
  renderPaths();
  renderStats();
  initQuotes();
  renderQuiz();
  initTimer();
  initBreath();
  initAssistant();
  initCollaborate();
  initPropose();
  initRandom();
  initPalette();

  /* library controls */
  $("#libSearch").addEventListener("input", e => { state.q = e.target.value; renderLibrary(); });
  $("#libArea").addEventListener("change", e => { state.area = e.target.value; renderLibrary(); });
  $("#libLevel").addEventListener("change", e => { state.level = e.target.value; renderLibrary(); });
  $("#libCost").addEventListener("change", e => { state.cost = e.target.value; renderLibrary(); });
  $("#libType").addEventListener("change", e => { state.type = e.target.value; renderLibrary(); });
  $("#libSort").addEventListener("change", e => { state.sort = e.target.value; renderLibrary(); });
  $("#libReset").addEventListener("click", () => {
    Object.assign(state, { q: "", area: "all", level: "all", cost: "all", type: "all", sort: "area" });
    $("#libSearch").value = ""; ["libArea","libLevel","libCost","libType","libSort"].forEach(id => $("#" + id).value = id === "libSort" ? "area" : "all");
    renderLibrary();
  });

  $("#exportMd").addEventListener("click", exportProgress);
  $("#exportJson").addEventListener("click", exportJSON);
  $("#resetProgress").addEventListener("click", () => {
    if (confirm("Erase all local progress stored in this browser?")) { setProgress({}); refreshAll(); toast("Progress erased. A new dawn."); }
  });

  /* mobile nav */
  $("#navToggle").addEventListener("click", () => document.body.classList.toggle("nav-open"));
  $$(".site-nav a").forEach(a => a.addEventListener("click", () => document.body.classList.remove("nav-open")));

  /* footer year */
  $("#year").textContent = new Date().getFullYear();
});
