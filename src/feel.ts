// Sound and touch. Everything is off until the player turns it on, and nothing ever carries meaning on its own:
// every sound or vibration has a visual twin. Spec: reports/Couples game design research.md (sound and haptic specs).
//
// Sounds are synthesized in Web Audio (no files, no licensing). UI tones and the music loop share D major, so they never clash.
import { store } from './net';

/* ---------------- preferences (this phone only) ---------------- */
export type HapticLevel = 'off' | 'subtle' | 'normal';
const K = { sfx: 'tad.sfx', hap: 'tad.haptics', beat: 'tad.beat', quiet: 'tad.quiet', vol: 'tad.musicvol' };

export const canVibrate = typeof navigator !== 'undefined' && 'vibrate' in navigator;

export const prefs = {
  get sfx() { return store.get(K.sfx) === 'on'; },
  set sfx(v: boolean) { store.set(K.sfx, v ? 'on' : 'off'); },
  get haptics(): HapticLevel {
    const v = store.get(K.hap);
    if (v === 'normal' || v === 'subtle' || v === 'off') return v;
    return v === 'on' || v === null ? 'subtle' : 'off'; // older builds stored on/off
  },
  set haptics(v: HapticLevel) { store.set(K.hap, v); },
  get heartbeat() { return store.get(K.beat) === 'on'; },
  set heartbeat(v: boolean) { store.set(K.beat, v ? 'on' : 'off'); },
  /** Quiet mode mutes sound, music and vibration together, without losing the other settings. */
  get quiet() { return store.get(K.quiet) === 'on'; },
  set quiet(v: boolean) { store.set(K.quiet, v ? 'on' : 'off'); if (v) { stopMusic(); stopHeartbeat(); } },
  get musicVolume() { const n = Number(store.get(K.vol)); return Number.isFinite(n) && n > 0 ? Math.min(1, n) : 0.35; },
  set musicVolume(v: number) { store.set(K.vol, String(v)); if (bus) bus.music.gain.value = v; },
};

/* ---------------- audio graph ---------------- */
type Bus = { ctx: AudioContext; ui: GainNode; music: GainNode };
let bus: Bus | null = null;

/** Create audio inside a tap (iOS needs a user gesture). Safe to call repeatedly. */
export function unlockAudio(forMusic = false) {
  try {
    if (!bus) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      const ctx = new AC();
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -18; comp.ratio.value = 3;
      const master = ctx.createGain(); master.gain.value = 0.9;
      master.connect(comp).connect(ctx.destination);
      const ui = ctx.createGain(); ui.gain.value = 1; ui.connect(master);
      const music = ctx.createGain(); music.gain.value = prefs.musicVolume; music.connect(master);
      bus = { ctx, ui, music };
    }
    // iOS: only music overrides the silent switch, and only after the player asked for it.
    const as = (navigator as unknown as { audioSession?: { type: string } }).audioSession;
    if (as && forMusic) as.type = 'playback';
    if (bus.ctx.state === 'suspended') void bus.ctx.resume();
    return bus;
  } catch { return null; }
}

// D major pentatonic, so every cue sits inside the music.
const N = { D4: 293.66, Fs4: 369.99, A4: 440, D5: 587.33, E5: 659.25, Fs5: 739.99, A5: 880, B5: 987.77, D6: 1174.66 };

function tone(freq: number, dur: number, gain: number, opts: { type?: OscillatorType; at?: number; attack?: number; to?: number; dest?: AudioNode } = {}) {
  if (!bus) return;
  const { ctx } = bus;
  const t = Math.max(ctx.currentTime, opts.at ?? ctx.currentTime);
  const o = ctx.createOscillator(); o.type = opts.type ?? 'sine';
  o.frequency.setValueAtTime(freq, t);
  if (opts.to) o.frequency.exponentialRampToValueAtTime(opts.to, t + dur);
  const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 3200;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + (opts.attack ?? 0.005));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(f).connect(g).connect(opts.dest ?? bus.ui);
  o.start(t); o.stop(t + dur + 0.05);
}

function swish(at: number, dur: number, gain: number) {
  if (!bus) return;
  const { ctx } = bus;
  const len = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ctx.createBufferSource(); src.buffer = buf;
  const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.2;
  f.frequency.setValueAtTime(800, at); f.frequency.exponentialRampToValueAtTime(2500, at + dur);
  const g = ctx.createGain(); g.gain.setValueAtTime(gain, at); g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  src.connect(f).connect(g).connect(bus.ui);
  src.start(at);
}

/* ---------------- haptics (Android; iPhone gets the visual twin only) ---------------- */
function vibrate(pattern: number[]) {
  if (!canVibrate || prefs.quiet) return;
  const lvl = prefs.haptics;
  if (lvl === 'off') return;
  // Subtle halves every "on" pulse (6ms floor); gaps stay the same so the rhythm is kept.
  const p = lvl === 'subtle' ? pattern.map((v, i) => (i % 2 === 0 ? Math.max(6, Math.round(v / 2)) : v)) : pattern;
  try { navigator.vibrate(p); } catch { /* not allowed yet */ }
}

/* ---------------- named moments ---------------- */
export type Cue = 'tap' | 'flip' | 'reveal' | 'pass' | 'ready' | 'yes' | 'level' | 'tick' | 'done' | 'touch';

const HAPTIC: Partial<Record<Cue, number[]>> = {
  tap: [10], flip: [10], reveal: [15, 60, 25], ready: [10], yes: [20, 80, 20, 80, 40],
  level: [15, 50, 15, 50, 15, 50, 60], done: [15, 60, 25], touch: [40],
  // pass: none. A refusal is never felt on either phone.
};

/** Play a moment's sound and vibration. `seat` (0 or 1) splits the "both said yes" chord between the phones. */
export function cue(c: Cue, seat: 0 | 1 = 0) {
  const h = HAPTIC[c]; if (h) vibrate(h);
  if (prefs.quiet || !prefs.sfx) return;
  const b = unlockAudio(); if (!b) return;
  const t = b.ctx.currentTime + 0.01;
  switch (c) {
    case 'tap': tone(N.A5, 0.05, 0.13, { at: t }); break;
    case 'ready': tone(N.A4, 0.3, 0.3, { type: 'triangle', at: t, attack: 0.02 }); break;
    case 'flip': swish(t, 0.2, 0.18); tone(N.D5, 0.03, 0.2, { type: 'triangle', at: t + 0.02 }); break;
    case 'reveal': tone(N.D5, 0.35, 0.32, { type: 'triangle', at: t }); tone(N.Fs5, 0.4, 0.3, { type: 'triangle', at: t + 0.12 }); break;
    case 'pass': tone(N.A4, 0.25, 0.18, { at: t, to: N.Fs4, attack: 0.02 }); break; // soft and neutral, never a "wrong" buzz
    case 'tick': tone(110, 0.08, 0.25, { at: t, attack: 0.002 }); break;
    case 'yes': tone(seat === 0 ? N.D5 : N.A5, 0.6, 0.38, { type: 'triangle', at: t + (seat === 0 ? 0 : 0.035), attack: 0.01 }); break;
    case 'level': [N.D5, N.Fs5, N.A5, N.D6].forEach((f, i) => tone(f, 0.5, 0.3, { type: 'triangle', at: t + i * 0.09 })); swish(t + 0.3, 0.6, 0.06); break;
    case 'done': tone(N.Fs5, 0.4, 0.25, { type: 'triangle', at: t }); tone(N.D5, 0.5, 0.25, { type: 'triangle', at: t + 0.15 }); break;
    case 'touch': tone(70, 0.18, 0.35, { at: t, attack: 0.01 }); break; // a low, soft thump
  }
}

/* ---------------- calm heartbeat (opt-in, 60 bpm, stops after 15 s) ---------------- */
let beatTimer = 0, beatStop = 0;
export function startHeartbeat(onBeat?: () => void) {
  stopHeartbeat();
  if (!prefs.heartbeat || prefs.quiet) return;
  const beat = () => {
    vibrate([30, 120, 20]);
    if (prefs.sfx && unlockAudio()) { tone(60, 0.12, 0.3); window.setTimeout(() => tone(55, 0.1, 0.2), 150); }
    onBeat?.();
  };
  beat();
  beatTimer = window.setInterval(beat, 1000);
  beatStop = window.setTimeout(stopHeartbeat, 15000);
}
export function stopHeartbeat() {
  clearInterval(beatTimer); clearTimeout(beatStop); beatTimer = 0;
  if (canVibrate) try { navigator.vibrate(0); } catch { /* ignore */ }
}

/* ---------------- music: a slow generative loop in D major ---------------- */
// 72 BPM, one chord per bar, instrumental. Deeper and sparser at higher levels, never faster.
const BAR = 60 / 72 * 4;
const CHORDS: number[][] = [
  [146.83, 220, 277.18, 329.63, 369.99], // Dmaj9
  [123.47, 185, 220, 293.66, 329.63],    // Bm9
  [98, 146.83, 246.94, 293.66, 369.99],  // Gmaj9 (6/9 voicing)
  [110, 164.81, 246.94, 293.66, 369.99], // A6sus
];
const MELODY = [N.D5, N.E5, N.Fs5, N.A5, N.B5];
let music: { timer: number; next: number; bar: number; band: number; out: GainNode } | null = null;

export function musicPlaying() { return !!music; }

export function startMusic(level = 1) {
  if (prefs.quiet) return;
  const b = unlockAudio(true); if (!b) return;
  setMusicLevel(level);
  if (music) return;
  const out = b.ctx.createGain(); out.gain.value = 0.0001; out.connect(b.music);
  out.gain.exponentialRampToValueAtTime(1, b.ctx.currentTime + 2.5); // fade in
  music = { timer: 0, next: b.ctx.currentTime + 0.1, bar: 0, band: bandFor(level), out };
  const schedule = () => {
    if (!music || !bus) return;
    while (music.next < bus.ctx.currentTime + 1.5) { playBar(music.bar, music.next, music.band, music.out); music.next += BAR; music.bar++; }
  };
  schedule();
  music.timer = window.setInterval(schedule, 400);
}
const bandFor = (l: number) => (l <= 2 ? 0 : l <= 5 ? 1 : 2);
export function setMusicLevel(level: number) { if (music) music.band = bandFor(level); }

export function stopMusic() {
  if (!music || !bus) { music = null; return; }
  const m = music; music = null;
  clearInterval(m.timer);
  const t = bus.ctx.currentTime;
  m.out.gain.cancelScheduledValues(t); m.out.gain.setValueAtTime(m.out.gain.value, t); m.out.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
  window.setTimeout(() => m.out.disconnect(), 1500);
}

function playBar(bar: number, at: number, band: number, out: GainNode) {
  if (!bus) return;
  const { ctx } = bus;
  const chord = CHORDS[bar % CHORDS.length];
  const cutoff = [1400, 1100, 800][band];
  // Pad: two slightly detuned voices per note, slow swell.
  const pf = ctx.createBiquadFilter(); pf.type = 'lowpass'; pf.frequency.value = cutoff; pf.connect(out);
  chord.slice(1).forEach(f => [0, 4].forEach(det => {
    const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = f; o.detune.value = det;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(0.035, at + 1.1); g.gain.setValueAtTime(0.035, at + BAR - 0.6); g.gain.exponentialRampToValueAtTime(0.0001, at + BAR + 0.8);
    o.connect(g).connect(pf); o.start(at); o.stop(at + BAR + 0.9);
  }));
  // Bass: the root, softer at Level 1-2, a little fuller later.
  const bo = ctx.createOscillator(); bo.type = 'sine'; bo.frequency.value = chord[0] / (band === 2 ? 2 : 1);
  const bg = ctx.createGain(); bg.gain.setValueAtTime(0.0001, at); bg.gain.exponentialRampToValueAtTime([0.08, 0.1, 0.12][band], at + 0.08);
  bg.gain.exponentialRampToValueAtTime(0.0001, at + BAR * 0.9);
  bo.connect(bg).connect(out); bo.start(at); bo.stop(at + BAR);
  // A few soft keys notes on the beat, sparser as the night deepens.
  const chance = [0.45, 0.35, 0.22][band];
  for (let beat = 0; beat < 4; beat++) {
    if (Math.random() > chance) continue;
    const f = MELODY[Math.floor(Math.random() * MELODY.length)] / (band === 2 ? 2 : 1);
    tone(f, 1.4, 0.05, { type: 'sine', at: at + beat * (BAR / 4) + Math.random() * 0.05, attack: 0.01, dest: out });
  }
}

// After a reload, audio waits for the next tap (browsers require a gesture), then resumes on its own.
if (typeof document !== 'undefined') document.addEventListener('pointerdown', () => {
  if (bus && bus.ctx.state === 'suspended' && (music || prefs.sfx) && !prefs.quiet) void bus.ctx.resume();
}, { passive: true });

// Leaving the app silences everything, which also protects privacy.
if (typeof document !== 'undefined') document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') { stopHeartbeat(); if (bus) void bus.ctx.suspend(); }
  else if (bus && (music || prefs.sfx)) void bus.ctx.resume();
});
