/* =====================================================================
   High on Intelligence Assistant — "The Thinking Machine" (on-device)
   TF-IDF + cosine similarity over the resource catalogue and FAQ.
   No API keys, no network, no tracking — runs entirely in your browser.
   ===================================================================== */

const STOPWORDS = new Set(("a an the and or of to in for on with as by at is are be this that it from you your i me my we our how do does what where can will should would about into not no yes learn learning resource resources want need get start begin beginner advanced free paid official guide tutorial course").split(" "));

function tokenize(text) {
  return (text || "").toLowerCase()
    .replace(/[^a-z0-9+#\. ]/g, " ")
    .split(/\s+/)
    .filter(t => t.length > 1 && !STOPWORDS.has(t));
}

/* Build corpus documents: resources + FAQ entries */
const DOCS = [];
RESOURCES.forEach(r => {
  DOCS.push({
    kind: "resource",
    ref: r,
    text: [r.title, r.provider, r.desc, AREAS[r.area].label, r.type, r.level, r.cost].join(" ")
  });
});
FAQ.forEach(f => DOCS.push({ kind: "faq", ref: f, text: f.q + " " + f.a }));

const DOC_TOKENS = DOCS.map(d => tokenize(d.text));
const DF = {};
DOC_TOKENS.forEach(tokens => {
  new Set(tokens).forEach(t => { DF[t] = (DF[t] || 0) + 1; });
});
const N_DOCS = DOCS.length;
const idf = t => Math.log((1 + N_DOCS) / (1 + (DF[t] || 0))) + 1;

const DOC_VECS = DOC_TOKENS.map(tokens => {
  const tf = {};
  tokens.forEach(t => tf[t] = (tf[t] || 0) + 1);
  const vec = {};
  let norm = 0;
  for (const t in tf) {
    const w = (1 + Math.log(tf[t])) * idf(t);
    vec[t] = w;
    norm += w * w;
  }
  return { vec, norm: Math.sqrt(norm) || 1 };
});

function queryDocs(query, limit) {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];
  const tf = {};
  tokens.forEach(t => tf[t] = (tf[t] || 0) + 1);
  const qvec = {};
  let qnorm = 0;
  for (const t in tf) {
    const w = (1 + Math.log(tf[t])) * idf(t);
    qvec[t] = w;
    qnorm += w * w;
  }
  qnorm = Math.sqrt(qnorm) || 1;

  const scored = [];
  for (let i = 0; i < N_DOCS; i++) {
    const { vec, norm } = DOC_VECS[i];
    let dot = 0;
    for (const t in qvec) if (vec[t]) dot += qvec[t] * vec[t];
    scored.push({ doc: DOCS[i], score: dot / (norm * qnorm) });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.filter(s => s.score > 0.02).slice(0, limit || 5);
}

/* Keyword intent shortcuts for common asks */
const INTENTS = [
  { re: /\b(where|how).*(start|begin)\b|beginner|from scratch|zero/i, answer: () => ({ text:"Start with the Foundations: Khan Academy math + 3Blue1Brown, then CS50x. Pick ONE track on this page and mark resources done as you go. Today: 20 minutes, one resource, zero excuses.", picks:["math-khan","swe-cs50","ai-cs50ai"] }) },
  { re: /math|linear algebra|calculus|statistic|probability/i, answer: () => ({ text:"Math stops being a wall the moment it becomes moving pictures. Start with 3Blue1Brown, then StatQuest for stats. Here are the essentials:", picks:["math-3b1b-la","math-3b1b-calc","math-statquest"] }) },
  { re: /ai|machine learning|llm|gpt|agent|deep learning/i, answer: () => ({ text:"For AI, the Thinking Machine Track is your spine: 3B1B → CS50 AI → ML Crash Course → Kaggle → fast.ai → Karpathy. Here is what matched your question best:", picks:["ai-cs50ai","ai-fastai","ai-karpathy"] }) },
  { re: /secur|hack|cyber|owasp|pentest/i, answer: () => ({ text:"Security is best learned with your hands. Guardian Track: Bandit → picoCTF → TryHackMe → PortSwigger. Legal, sandboxed, and genuinely fun:", picks:["sec-overthewire","sec-tryhackme","sec-portswigger"] }) },
  { re: /sleep|health|exercise|nutrition|body|diet/i, answer: () => ({ text:"The Sovereign Track: WHO physical-activity guidelines, NHS sleep protocol, Harvard's Nutrition Source. Build the body before you scale the mind:", picks:["life-who-pa","life-nhs-sleep","life-harvard-nutrition"] }) },
  { re: /medit|spiritual|soul|meaning|stoic|quran|gita|consci/i, answer: () => ({ text:"Contemplation is the training ground of the inner machine. MBSR (UMass), Meditations (Aurelius), Tanzil (Quran), Bhagavad Gita. Go slow:", picks:["life-umass-mbsr","life-meditations","life-tanzil"] }) },
  { re: /collabor|join|contribute|volunteer|help/i, answer: () => ({ text:"Open the 'Collaborate' section below, write your manifest — what you bring, what you want to build — and copy it. Hazem Soussi's door is open to builders, reviewers, translators and writers.", picks:[] }) },
  { re: /free|cost|paid|money|price/i, answer: () => ({ text:"Almost everything here is FREE or freemium. Filter the library by cost to see exactly what is free forever. The portal never charges you.", picks:[] }) }
];

function assistantAnswer(query) {
  const q = (query || "").trim();
  if (!q) return { text:"Ask me anything — 'where do I start?', 'how do I learn security?', 'best free AI resources', 'how do I join the collaboration?'", picks: [] };

  const results = queryDocs(q, 4);

  /* First: intent patterns (most reliable for common asks) */
  for (const intent of INTENTS) {
    if (intent.re.test(q)) {
      const r = intent.answer();
      if (r.picks && r.picks.length) return r;
      /* augment with resource search matches */
      const res = results.filter(x => x.doc.kind === "resource").slice(0, 3).map(x => x.doc.ref.id);
      return { ...r, picks: res };
    }
  }

  /* Second: FAQ exact-ish match via TF-IDF */
  const faqs = results.filter(r => r.doc.kind === "faq" && r.score > 0.18);
  if (faqs.length) {
    const best = faqs[0].doc.ref;
    const res = results.filter(r => r.doc.kind === "resource").slice(0, 3).map(r => r.doc.ref.id);
    return { text: best.a, picks: res };
  }

  /* Third: pure resource retrieval */
  const res = results.filter(r => r.doc.kind === "resource").slice(0, 4);
  if (res.length) {
    return {
      text:"Here is what the High on Intelligence index surfaced for that. Click any card to open it — and mark it done when you finish so your dashboard fills up:",
      picks: res.map(r => r.doc.ref.id)
    };
  }
  return {
    text:"I could not find a strong match. Try: 'where do I start', 'learn AI', 'security roadmap', 'math for ML', 'sleep and health', or 'how to collaborate'. Or browse the library with Ctrl+K.",
    picks: []
  };
}
