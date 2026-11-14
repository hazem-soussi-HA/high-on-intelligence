<p align="center">
  <img src="assets/header.svg" alt="HAZOOM DJ — generative techno engine" width="880">
</p>

<p align="center">
  <img src="assets/logo.svg" alt="HAZOOM DJ" width="96">
</p>

# HAZOOM DJ

**A techno engine that writes the track.** Pure DSP in a single Node file — no samples, no
libraries, no network, no model. Every kick, hat and chord is computed from scratch and rendered
straight to a WAV.

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
| **reverb** | 6 comb filters + 4 allpass, per side |
| **master** | sidechain duck, sub mono-isation, glue saturation, peak limiter |

The drive stage is a `tanh` waveshaper with 4× oversampling. The filter is a cascaded-biquad
approximation of an analog ladder, not a transistor-level simulation — it sounds analog because the
curve has the right shape, not because anything is physically modelled.

---

## Options

```
--bpm     40–240        tempo                        (default 132)
--bars    bars to render                             (default 64)
--seed    integer       same seed, same track, always
--out     path          output WAV
--solo    kick|bass|hat|clap|stab|riser|impact|music  render one stem
```

Stems are how the mix gets measured. The kick and the sub bass overlap in frequency — 44–128 Hz
against 55 Hz — so **no filter can separate them.** Muting is the only way, which is why `--solo`
exists.

```bash
node dj-intelligence.js --solo kick --bars 20 --out kick.wav
```

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

---

## License

MIT — see [LICENSE](LICENSE).

Written by [Hazem Soussi](https://github.com/hazem-soussi-HA).
