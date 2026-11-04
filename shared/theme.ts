// Palette system from the research report: the vibe sets the hue, the level sets chroma and depth.
// All values are a computed starting point (OKLCH, contrast-checked in tests), not user-tested.
import type { VibeId } from './protocol';

export type Mode = 'light' | 'dark' | 'late';

export interface Vibe {
  name: string; hue: number; reads: string;
  /** Shape shown with the colour so partners never rely on hue alone (colour-blind safe). */
  glyph: string;
  /** Hue change per level. Coral drifts pinker so deep Coral reads terracotta-rose, not brown. */
  drift: number;
  /** Chroma multiplier. Lagoon is muted so it stays blue-teal and inside sRGB. */
  chroma: number;
  accentLight: string; accentDark: string; accentLate: string;
  /** Partner chips: [you, partner] per mode. Fixed lightness, so two players never converge at Level 8. */
  chip: Record<Mode, [string, string]>;
}

// Values from reports/Couples game design research.md (palette spec). Accents are each vibe's "you" chip colour.
export const VIBES: Record<VibeId, Vibe> = {
  rose: { name: 'Rose', hue: 12, reads: 'Warm, loving', glyph: '●', drift: -1.4, chroma: 1,
    accentLight: '#9D3D59', accentDark: '#F7ACBC', accentLate: '#CD9CA6',
    chip: { light: ['#9D3D59', '#BF7284'], dark: ['#F7ACBC', '#C86B82'], late: ['#CD9CA6', '#9E6975'] } },
  coral: { name: 'Coral', hue: 38, reads: 'Playful, light', glyph: '◆', drift: -2, chroma: 1,
    accentLight: '#9F4325', accentDark: '#F8B09A', accentLate: '#CD9E90',
    chip: { light: ['#9F4325', '#C0765F'], dark: ['#F8B09A', '#C97055'], late: ['#CD9E90', '#9F6C5C'] } },
  plum: { name: 'Plum', hue: 335, reads: 'Mysterious', glyph: '▲', drift: -1.4, chroma: 1,
    accentLight: '#8F4280', accentDark: '#E9AEDB', accentLate: '#C39DBA',
    chip: { light: ['#8F4280', '#B274A4'], dark: ['#E9AEDB', '#B86FA9'], late: ['#C39DBA', '#956B8B'] } },
  lagoon: { name: 'Lagoon', hue: 218, reads: 'Calm, unhurried', glyph: '■', drift: 0, chroma: 0.8,
    accentLight: '#007394', accentDark: '#7CD3EB', accentLate: '#7FB5C4',
    chip: { light: ['#007394', '#329AB4'], dark: ['#7CD3EB', '#009DBC'], late: ['#7FB5C4', '#458596'] } },
  iris: { name: 'Iris', hue: 280, reads: 'Dreamy, open', glyph: '✦', drift: -1, chroma: 1,
    accentLight: '#5658AB', accentDark: '#B8BEFE', accentLate: '#A3A7D1',
    chip: { light: ['#5658AB', '#8085C8'], dark: ['#B8BEFE', '#7E83D3'], late: ['#A3A7D1', '#7276A3'] } },
};
export const VIBE_IDS = Object.keys(VIBES) as VibeId[];
export const isVibe = (v: unknown): v is VibeId => typeof v === 'string' && v in VIBES;
export const GOLD = '#e1b75c';

// Card-field ramp (L, C) per level. Levels 1-4 light fields with dark ink, 5-8 deep fields with light ink.
const FIELD_LIGHT: [number, number][] = [[0.96, 0.019], [0.92, 0.04], [0.86, 0.077], [0.79, 0.115], [0.52, 0.15], [0.43, 0.15], [0.33, 0.13], [0.24, 0.09]];
// In dark mode Levels 1-4 become dusky so a bright card never lights a dark room.
const FIELD_DARK_1_4: [number, number][] = [[0.34, 0.025], [0.32, 0.045], [0.3, 0.065], [0.28, 0.085]];
// Late-night mode caps lightness for Levels 5-8 and eases chroma.
const FIELD_LATE_5_8: [number, number][] = [[0.31, 0.09], [0.28, 0.09], [0.25, 0.09], [0.22, 0.09]];

/* ---------- OKLCH -> sRGB with gamut clipping by chroma reduction ---------- */
function oklchToRgb(L: number, C: number, H: number): [number, number, number] | null {
  const h = (H * Math.PI) / 180, a = C * Math.cos(h), b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  if (lin.some(v => v < -0.0005 || v > 1.0005)) return null;
  return lin.map(v => { const c = Math.min(1, Math.max(0, v)); return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055; }) as [number, number, number];
}
export function oklch(L: number, C: number, H: number): string {
  let c = C, rgb = oklchToRgb(L, c, H);
  while (!rgb && c > 0) { c = Math.max(0, c - 0.004); rgb = oklchToRgb(L, c, H); }
  const [r, g, b] = rgb || [L, L, L];
  return '#' + [r, g, b].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
}

/* ---------- WCAG contrast ---------- */
function lum(hex: string) {
  const v = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(c => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
}
export function contrast(a: string, b: string) { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }

/* ---------- hue blending for two partners' vibes ---------- */
export function hueDistance(a: number, b: number) { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; }
export function blendHue(a: number, b: number) {
  let d = ((b - a + 540) % 360) - 180; // shorter arc
  return (a + d / 2 + 360) % 360;
}

export interface CardColors { field: string; ink: string; inkSoft: string; motif: string; deep: boolean }
export interface ThemeTokens {
  bg: string; bg2: string; surface: string; fg: string; muted: string; line: string;
  accent: string; onAccent: string; gold: string;
  // Consent controls stay the same in every theme.
  ctrlBg: string; ctrlFg: string; ctrlLine: string;
  glowA: string; glowB: string;
}

/** Card face colours. Pass the vibe when the card belongs to one partner's colour, so its drift and chroma apply. */
export function cardColors(level: number, hue: number, mode: Mode, vibe?: VibeId): CardColors {
  const i = Math.min(8, Math.max(1, level)) - 1;
  const vb = vibe ? VIBES[vibe] : null;
  const H = hue + (vb ? vb.drift : -1.4) * i; // drift slightly per level
  let L: number, C: number;
  if (mode !== 'light' && i < 4) [L, C] = FIELD_DARK_1_4[i];
  else if (mode === 'late' && i >= 4) [L, C] = FIELD_LATE_5_8[i - 4];
  else [L, C] = FIELD_LIGHT[i];
  C *= vb ? vb.chroma : 1;
  const deep = L < 0.6;
  const inkL = deep ? (mode === 'late' ? 0.86 : 0.965) : 0.22;
  const ink = oklch(inkL, deep ? 0.012 : 0.035, H);
  const inkSoft = oklch(deep ? inkL - 0.12 : 0.36, deep ? 0.03 : 0.05, H);
  // Motif sits clearly above the field on deep cards, below it on light ones.
  // Levels 7-8 keep a bright highlight (L >= 0.70) so the deepest cards still glow rather than feel heavy.
  const motif = oklch(deep ? (i >= 6 ? 0.72 : Math.min(0.72, L + 0.26)) : L - 0.12, Math.min(0.17, C + 0.06), H);
  return { field: oklch(L, C, H), ink, inkSoft, motif, deep };
}

export function themeTokens(hue: number, accentVibe: VibeId, mode: Mode, hueB?: number): ThemeTokens {
  const v = VIBES[accentVibe];
  if (mode === 'light') return {
    bg: oklch(0.975, 0.008, hue), bg2: oklch(0.945, 0.016, hue), surface: '#fffdfc', fg: oklch(0.22, 0.03, hue),
    muted: oklch(0.45, 0.03, hue), line: oklch(0.88, 0.02, hue), accent: v.accentLight, onAccent: '#ffffff', gold: '#8a6414',
    ctrlBg: '#fcfcfc', ctrlFg: '#161616', ctrlLine: '#bdbdbd',
    glowA: oklch(0.86, 0.07, hue), glowB: oklch(0.88, 0.06, hueB ?? hue + 30),
  };
  const late = mode === 'late';
  return {
    bg: oklch(late ? 0.12 : 0.17, late ? 0.015 : 0.02, hue), bg2: oklch(late ? 0.15 : 0.21, 0.03, hue),
    surface: oklch(late ? 0.17 : 0.23, 0.03, hue), fg: oklch(late ? 0.88 : 0.95, 0.012, hue), muted: oklch(late ? 0.68 : 0.74, 0.025, hue),
    line: oklch(late ? 0.27 : 0.32, 0.03, hue), accent: late ? v.accentLate : v.accentDark, onAccent: '#1b0b0e', gold: GOLD,
    ctrlBg: '#161616', ctrlFg: '#fcfcfc', ctrlLine: '#5a5a5a',
    glowA: oklch(late ? 0.3 : 0.38, 0.1, hue), glowB: oklch(late ? 0.28 : 0.36, 0.09, hueB ?? hue + 30),
  };
}

/** A partner's chip colour. "you" is filled and lighter in dark modes; "partner" is an outlined ring. */
export function chipColor(vibe: VibeId, mode: Mode, who: 'you' | 'partner') { return VIBES[vibe].chip[mode][who === 'you' ? 0 : 1]; }
