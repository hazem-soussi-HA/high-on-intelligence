/* The HOI Dispatch — posts feed (single source of truth for feed.xml forks) */
const DISPATCH_POSTS = [
  {
    id: "hoi-live", date: "2026-11-13", tag: "LAUNCH",
    title: "High on Intelligence is live",
    body: `<p>After weeks of stubbornness, High on Intelligence — Hazem Soussi's free, curated gateway into the technologies, information and data of this age — is public: <a href="index">hazem-soussi-ha.github.io/high-on-intelligence</a>.</p>
<p>Seventy verified resources. Five guided tracks. An on-device assistant that never phones home. A quiz, a Pomodoro, box breathing. A Legitimacy &amp; Ethics policy in writing, because legitimacy is built, not claimed.</p>
<p>The spiritual way stays — explicit, plural, unpreachy: mind, body, soul. Next to CS50. Because the builder is a whole human, and the machine deserves better company.</p>
<p>— Hazem Soussi</p>`
  },
  {
    id: "universe-wing", date: "2026-11-13", tag: "NEW PAGE",
    title: "The Universe Wing — a starfield built on Claude Opus",
    body: `<p>We added <a href="universe">the Universe Wing</a>: a real-time 3D starfield of 36 cataloged bright stars (J2000 coordinates, spectral colors, IAU/Hipparcos rounded values), rendered with vendored three.js — no build step, no frameworks, offline-capable.</p>
<p>It sits beside HOI's six disciplines with the upgraded Claude Opus family: extended thinking, tool use, MCP, prompt contracts, evals, sovereign deployment — every pillar linking Anthropic's own docs, because we link what we claim.</p>
<p>— Hazem Soussi</p>`
  },
  {
    id: "aethric", date: "2026-11-13", tag: "ARCHITECTURE",
    title: "Aethric: why a portal should survive its own death",
    body: `<p>A service that lives in one place lives at the mercy of that place. High on Intelligence is deployed for redundancy: GitHub Pages (global CDN, live today) and a sovereign self-hosted mirror behind it — all one static artifact, kept in git, pulled everywhere.</p>
<p>Legitimacy is treated the same way: public certs from Let's Encrypt, our own CA strictly inside the LAN, a published <a href="LEGITIMACY.md">policy</a>, and a <a href="status">status page</a> that refuses to show green it didn't earn.</p>
<p>— Hazem Soussi</p>`
  }
];

if (typeof module !== "undefined") module.exports = DISPATCH_POSTS;
