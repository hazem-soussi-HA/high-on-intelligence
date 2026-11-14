<p align="center">
  <img src="assets/header.svg" alt="HAZOOM DJ — generative techno engine" width="880">
</p>

<p align="center">
  <img src="assets/logo.svg" alt="HAZOOM DJ" width="96">
</p>

# HAZOOM DJ

**A techno engine that writes the track — and now a healing instrument that soothes it.**
Pure DSP in a single Node file — no samples, no libraries, no network, no model. Every kick, hat
and chord is computed from scratch and rendered straight to a WAV.

```bash
node dj-intelligence.js --bpm 132 --bars 64 --seed 20260926 --out track.wav
```

That renders a 1:56 arrangement in about four seconds:

```
arrangement: intro(8) → build(8) → drop(16) → breakdown(8) → drop2(16) → outro(8)
rendered track.wav
  116.4s · 132 bpm · 64 bars · 19.6 MB · peak -1.0 dBFS
```

---

## Listen

<p align="center">
  <audio controls src="audio/hazoom-dj-01.mp3"></audio>
</p>

`hazoom-dj-01` — 132 BPM, seed 20260926.
`audio/hazoom-dj-warehouse.mp3` — 128 BPM, seed 424242.

---

## Every render follows one shape

The arrangement is not random. It is a deliberate arc, and the engine enforces it:

<p align="center">
  <img src="assets/arrangement.svg" alt="Arrangement dynamics: intro, build, drop, breakdown, drop, outro" width="880">
</p>

Measured RMS of a real render, section by section:

| section | bars | level |
|---|---|---|
| intro | 8 | −13.0 dBFS |
| build | 8 | −5.6 → −4.4 |
| drop | 16 | −4.0 |
| breakdown | 8 | −25.7 |
| drop II | 16 | −4.0 |
| outro | 8 | −4.1 → −12.8 |

**About 24 dB of real dynamic range.** The breakdown is a genuine crater, not a filter sweep.

## Healing mode — lovely techno for the nervous system

The same engine, re-tuned to **A = 432 Hz** with solfeggio intent: no tritones, no minor seconds,
no aggressive stabs — long sub drones, a heartbeat kick (lub-dub, 60 BPM) and FM singing bowls.
Resonance is a practice, not a prescription — not medical advice.

```bash
node dj-intelligence.js --healing --out healing.wav
node dj-intelligence.js --healing --binaural 6.5 --out healing.wav   # theta binaural Δ6.5 Hz @136.1 Hz
```

That renders the 16-bar arc **intro(4) → nurture(8) → resolve(4)** (~64 s). Arrangement:

| bar | what happens |
|---|---|
| 1–4 | tuning in — A=432, long sub only, bowls breathe in every two bars |
| 5–12 | nurture — heartbeat kick (beats 1 & 3), I–V–IV–V half-bar sub, bowl every 2 bars |
| 13–16 | resolve — everything fades to silence over four bars |

Inside `transistor-studio.html` the **healing card** does the same by hand: pick an intent
(396 restore · 528 calm · 639 open · 963 still), press **✦ compose healing loop**, and the studio
retunes to 432 Hz, writes a slow major-pentatonic loop into the sequencer and switches to a soft
patch. Toggles for **bowl bells** (singing-bowl bell every 8 steps), a **binaural θ** pair and a
**528 Hz undertone**. A box-breath pacer (4·4·4·4) breathes with you.

---

## The voices

Everything is written by hand in `dj-intelligence.js`.

| voice | synthesis |
|---|---|
| **kick** | sine with a 132→45 Hz pitch envelope, 40 ms sweep, τ≈0.10 s decay, beater click |
| **sub bass** | saw + sine sub through a state-variable filter, 12 ms note glide |
| **hats** | noise through a bandpass + highpass, offbeat eighths, 16th rolls in the drops |
| **clap** | three offset noise taps plus a body, sent to reverb |
| **stab** | five detuned saws, filter envelope, 320 Hz → 5.5 kHz sweep |
| **riser** | noise through a sweeping bandpass, 300 Hz → 14 kHz |
| **impact** | noise plus a 41 Hz sine, lowpassed with a long decay |
| **bowl** | FM bell, 2.01 ratio, index decays fast — fundamental lingers (healing mode) |
| **reverb** | 6 comb filters + 4 allpass, per side |
| **master** | sidechain duck, sub mono-isation, glue saturation, peak limiter |

The drive stage is a `tanh` waveshaper with 4× oversampling. The filter is a cascaded-biquad
approximation of an analog ladder, not a transistor-level simulation — it sounds analog because the
curve has the right shape, not because anything is physically modelled.

---

## Options

```
--bpm     40–240        tempo                        (default 132; 60 with --healing)
--bars    bars to render                             (default 64; 16 with --healing)
--seed    integer       same seed, same track, always
--out     path          output WAV
--solo    kick|bass|hat|clap|stab|riser|impact|bowl|music  render one stem
--healing           solfeggio/432 Hz healing arrangement
--binaural <hz>     add delta-binaural pair (136.1 / 136.1+hz Hz) under the mix
```

Stems are how the mix gets measured. The kick and the sub bass overlap in frequency — 44–128 Hz
against 55 Hz — so **no filter can separate them.** Muting is the only way, which is why `--solo`
exists.

```bash
node dj-intelligence.js --solo kick --bars 20 --out kick.wav
```

## HAZOOM FM — web radio that heals

Tired harsh synths? Tune instead. `hazoom-fm.html` is a web radio built on two honest shelves:

- **Official 24/7 YouTube streams**, embedded through YouTube's own player (no ripping, no re-broadcast):
  `91.7` Lofi Girl — lofi hip hop radio · `94.3` beats to sleep · `96.9` peaceful piano · `99.5` synthwave radio
- **Aethric** — our own station: `hazoom-dj-01` and `hazoom-dj-warehouse`, rendered by this repo's engine. MIT.

No accounts, no downloads, no rebroadcast: streams play from youtube.com's embed with royalties flowing to
the rightful owners — exactly the portal's [Legitimacy & Ethics](../../LEGITIMACY.md) rule. Real over-the-air
FM needs a licence; this is a dial into light, not a transmitter.

Play it: open `hazoom-fm.html`, pick a station, breathe.

---

## The synthesiser

`transistor-studio.html` is the same instrument played live. Open it in a browser — one file, no
build step, no dependencies.

<img src="assets/logo.svg" width="0" alt="">

- polyphonic, per-voice everything
- two oscillators + sub, detune, 4-pole lowpass with resonance
- **transistor drive** — tanh waveshaper, 4× oversampled
- separate amp and filter ADSRs
- LFO routable to pitch, filter or amp
- 16-step sequencer with per-step note, gate length, BPM and swing
- oscilloscope, two octaves of keyboard, computer-key play
- **healing card**: intent select (396/528/639/963), ✦ compose healing loop, bowl bells, binaural θ and 528 Hz undertone toggles, box-breath pacer

Play it: `A W S E D F T G Y H U J K` lower octave, `Q–P` upper, `Z`/`X` transpose, `space` runs the
sequencer.

---

## Honest limits

- **The renders were verified structurally, not by ear.** Timings, levels, spectra and file
  integrity were measured. Nobody has listened to them on real speakers. Your ears are the test.
- The arrangement is **one template with seeded variation**, not a system that understands music.
  It does not know what a chord is doing; it knows the shape of a DJ set.
- No audio recording, no sample management, no MIDI, no project save/load in the studio.
- The studio is monophonic-per-voice in practice; it does not load the engine's pattern JSON yet.
- Healing mode removes musical harshness; it cannot guarantee any feeling. Resonance is context,
  breath and expectation — not serialization.

---

## License

MIT — see [LICENSE](LICENSE).

Written by [Hazem Soussi](https://github.com/hazem-soussi-HA).
