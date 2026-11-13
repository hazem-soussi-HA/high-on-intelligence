/* =====================================================================
   High on Intelligence — The Universe Wing
   universe-data.js — 36 cataloged bright stars
   Positions: RA (hours), Dec (degrees), equatorial J2000.
   Magnitudes & distances are rounded IAU/Hipparcos values —
   approximate, for education. Variable stars are approximate too.
   ===================================================================== */

const STARS = [
  { name:"Sirius", constellation:"Canis Major", ra:6.752, dec:-16.72, mag:-1.46, spectral:"A1V", dist:8.6, fact:"Brightest star in Earth's night sky — a white-dwarf binary the ancients called 'the Scorcher'." },
  { name:"Canopus", constellation:"Carina", ra:6.399, dec:-52.70, mag:-0.74, spectral:"A9II", dist:310, fact:"Second-brightest star — deep-space probes use it as a navigation reference." },
  { name:"Arcturus", constellation:"Boötes", ra:14.261, dec:19.18, mag:-0.05, spectral:"K1.5III", dist:36.7, fact:"A red giant racing through our neighbourhood at ~122 km/s — a debris-strip star from an older galaxy." },
  { name:"Alpha Centauri", constellation:"Centaurus", ra:14.661, dec:-60.83, mag:-0.27, spectral:"G2V", dist:4.37, fact:"Nearest star system to Earth (4.37 ly) — A & B mirror the Sun; Proxima hosts exoplanet Proxima b." },
  { name:"Vega", constellation:"Lyra", ra:18.616, dec:38.78, mag:0.03, spectral:"A0V", dist:25, fact:"The pole star of ~12,000 BCE and again ~13,700 CE — and the calibration anchor of photometry." },
  { name:"Capella", constellation:"Auriga", ra:5.278, dec:46.00, mag:0.08, spectral:"G3III", dist:42.9, fact:"A quadruple system: two yellow giants plus two red dwarfs — three pairs in one point of light." },
  { name:"Rigel", constellation:"Orion", ra:5.242, dec:-8.20, mag:0.13, spectral:"B8Ia", dist:860, fact:"Blue supergiant ~124,000× the Sun's luminosity; lights the Witch Head Nebula next door." },
  { name:"Procyon", constellation:"Canis Minor", ra:7.655, dec:5.22, mag:0.34, spectral:"F5IV", dist:11.5, fact:"'Before the Dog' — it rises just before Sirius; a subgiant on its way to red-gianthood." },
  { name:"Betelgeuse", constellation:"Orion", ra:5.919, dec:7.41, mag:0.42, spectral:"M1-2Ia", dist:548, fact:"A red supergiant nearing supernova — we may live to watch a star die in the daylight." },
  { name:"Achernar", constellation:"Eridanus", ra:1.629, dec:-57.24, mag:0.46, spectral:"B6Vep", dist:139, fact:"One of the fastest spinners known (~250 km/s) — so flattened its poles are ~50% closer than its equator." },
  { name:"Hadar", constellation:"Centaurus", ra:14.064, dec:-60.37, mag:0.61, spectral:"B1III", dist:390, fact:"Beta Centauri — the true 'foot of the centaur'; a triple system of blue giants." },
  { name:"Altair", constellation:"Aquila", ra:19.846, dec:8.87, mag:0.77, spectral:"A7V", dist:16.7, fact:"Spins at ~286 km/s — flattened into an egg; a vertex of the Summer Triangle." },
  { name:"Acrux", constellation:"Crux", ra:12.443, dec:-63.10, mag:0.76, spectral:"B0.5IV", dist:321, fact:"The foot of the Southern Cross — a binary of hot blue stars." },
  { name:"Antares", constellation:"Scorpius", ra:16.490, dec:-26.43, mag:0.96, spectral:"M1.5Ib", dist:550, fact:"'Rival of Mars' — a red supergiant that, placed at the Sun, would swallow the orbits of Earth and Mars." },
  { name:"Spica", constellation:"Virgo", ra:13.420, dec:-11.16, mag:0.97, spectral:"B1V", dist:250, fact:"A close binary whose components orbit each other every 4 days — antiquity's first 'ear of wheat'." },
  { name:"Pollux", constellation:"Gemini", ra:7.755, dec:28.03, mag:1.14, spectral:"K0III", dist:33.8, fact:"An orange giant with a confirmed exoplanet camera — the immortal twin of myth." },
  { name:"Fomalhaut", constellation:"Piscis Austrinus", ra:22.961, dec:-29.62, mag:1.16, spectral:"A3V", dist:25.1, fact:"Ringed by a spectacular dust disc; host of the first directly imaged exoplanet candidate, Fomalhaut b." },
  { name:"Deneb", constellation:"Cygnus", ra:20.690, dec:45.28, mag:1.25, spectral:"A2Ia", dist:2615, fact:"One of the most luminous stars known (~200,000 L☉) — its light left ~2,600 years ago." },
  { name:"Mimosa", constellation:"Crux", ra:12.795, dec:-59.69, mag:1.25, spectral:"B0.5III", dist:280, fact:"Beta Crucis — a blue eclipsing variable showing off in the Southern Cross." },
  { name:"Regulus", constellation:"Leo", ra:10.140, dec:11.97, mag:1.35, spectral:"B7V", dist:79, fact:"'Little King' — a fast-spinning blue star with four companions; the heart of Leo." },
  { name:"Adhara", constellation:"Canis Major", ra:6.977, dec:-28.97, mag:1.50, spectral:"B2II", dist:405, fact:"Second light of Canis Major; among the strongest extreme-ultraviolet sources in the sky." },
  { name:"Castor", constellation:"Gemini", ra:7.577, dec:31.89, mag:1.58, spectral:"A1V", dist:51, fact:"A sextuple star system — three pairs dancing as one point of light." },
  { name:"Shaula", constellation:"Scorpius", ra:17.560, dec:-37.10, mag:1.63, spectral:"B1.5IV", dist:570, fact:"The 'stinger' of the Scorpion; its ultraviolet shapes the surrounding nebula." },
  { name:"Bellatrix", constellation:"Orion", ra:5.418, dec:6.35, mag:1.64, spectral:"B2III", dist:240, fact:"'The Amazon' — Orion's upper-left shoulder, a hot blue giant." },
  { name:"Elnath", constellation:"Taurus", ra:5.438, dec:28.61, mag:1.68, spectral:"B7III", dist:134, fact:"The northern horn-tip of Taurus — shared with Auriga for millennia." },
  { name:"Miaplacidus", constellation:"Carina", ra:9.220, dec:-69.72, mag:1.68, spectral:"A2IV", dist:113, fact:"Second-brightest in Carina; the southern navigator's friend." },
  { name:"Alnilam", constellation:"Orion", ra:5.604, dec:-1.20, mag:1.69, spectral:"B0Ia", dist:2000, fact:"Middle jewel of Orion's Belt — a blue supergiant ~350,000× the Sun's luminosity." },
  { name:"Dubhe", constellation:"Ursa Major", ra:11.062, dec:61.75, mag:1.79, spectral:"K0III", dist:123, fact:"The upper 'pointer' of the Big Dipper — it aims straight at Polaris." },
  { name:"Alkaid", constellation:"Ursa Major", ra:13.792, dec:49.31, mag:1.86, spectral:"B3V", dist:104, fact:"End of the Dipper's handle — its Arabic name marks the tail of the Great Bear." },
  { name:"Algol", constellation:"Perseus", ra:3.136, dec:41.00, mag:2.10, spectral:"B8V", dist:93, fact:"The 'Demon Star' — an eclipsing binary that dims every 2.87 days; mythic terror made clockwork." },
  { name:"Alphard", constellation:"Hydra", ra:9.460, dec:-8.66, mag:1.98, spectral:"K4III", dist:180, fact:"The 'solitary one' — lonely orange giant in Hydra, the longest of constellations." },
  { name:"Aldebaran", constellation:"Taurus", ra:4.599, dec:16.51, mag:0.86, spectral:"K5III", dist:65, fact:"The 'follower' — fiery eye of the Bull, forever chasing the Pleiades." },
  { name:"Mizar", constellation:"Ursa Major", ra:13.399, dec:54.93, mag:2.27, spectral:"A2V", dist:83, fact:"Naked-eye double in the Dipper's handle — the classic eyesight test; a quadruple system up close." },
  { name:"Mirfak", constellation:"Perseus", ra:3.405, dec:49.86, mag:1.79, spectral:"F5Ib", dist:510, fact:"Brightest in Perseus — a yellow-white supergiant at the heart of the Alpha Persei cluster." },
  { name:"Suhail", constellation:"Vela", ra:9.133, dec:-43.43, mag:2.21, spectral:"K4.5Ib", dist:545, fact:"Pearl of Vela — celebrated in Arabian verse as the star of good omen and navigation." },
  { name:"Polaris", constellation:"Ursa Minor", ra:2.530, dec:89.26, mag:1.98, spectral:"F7Ib", dist:433, fact:"The North Star — sits within ~0.7° of the north celestial pole; a Cepheid variable and humanity's quiet compass." }
];

const SPECTRAL_COLORS = {
  O: "#9bb0ff", B: "#aabfff", A: "#cad7ff", F: "#f8f7ff",
  G: "#fff4ea", K: "#ffd2a1", M: "#ffb56c"
};
const spectralColor = s => SPECTRAL_COLORS[(s || "G").charAt(0).toUpperCase()] || "#ffffff";

/* RA hours + Dec degrees -> unit vector on a sphere (J2000, y-up) */
const raDecToVector = (raHours, decDeg, radius) => {
  const ra = (raHours * 15) * Math.PI / 180;
  const dec = decDeg * Math.PI / 180;
  return {
    x: Math.cos(dec) * Math.cos(ra) * radius,
    y: Math.sin(dec) * radius,
    z: Math.cos(dec) * Math.sin(ra) * radius
  };
};
const starRadius = mag => Math.max(2.1, 7.5 - mag * 2.6);
