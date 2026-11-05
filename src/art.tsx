// Generated card art. Every card gets a unique motif seeded from its id; each level has its own visual language.
import { memo } from 'react';

function hash(s: string) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function mulberry32(a: number) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

type ArtProps = { level: number; seed: string; color: string; accent?: string; gold?: string; w?: number; h?: number };

/** Motif drawn in a 100 x 140 box (5:7). */
export const Motif = memo(function Motif({ level, seed, color, accent, gold = '#e1b75c', w = 100, h = 140 }: ArtProps) {
  const r = mulberry32(hash(seed + ':' + level));
  const R = (a: number, b: number) => a + r() * (b - a);
  const id = 'm' + hash(seed).toString(36);
  const els: JSX.Element[] = [];
  const c2 = accent || color;
  switch (level) {
    case 1: { // scattered specks over two soft glows
      els.push(<defs key="d"><radialGradient id={id + 'g'}><stop offset="0" stopColor={color} stopOpacity="0.55" /><stop offset="1" stopColor={color} stopOpacity="0" /></radialGradient></defs>);
      for (let i = 0; i < 2; i++) els.push(<circle key={'g' + i} cx={R(10, 90)} cy={R(10, 130)} r={R(28, 44)} fill={`url(#${id}g)`} />);
      for (let i = 0; i < 72; i++) els.push(<circle key={i} cx={R(0, w)} cy={R(0, h)} r={R(0.7, 3.4)} fill={i % 5 ? color : c2} opacity={R(0.4, 1)} />);
      break;
    }
    case 2: { // contour lines
      const cx = R(25, 75), cy = R(35, 105);
      for (let k = 1; k <= 9; k++) {
        const pts: string[] = [];
        for (let a = 0; a <= 24; a++) {
          const t = (a / 24) * Math.PI * 2, rad = k * 8 * (1 + 0.16 * Math.sin(t * 3 + k * 0.7 + r()));
          pts.push(`${(cx + Math.cos(t) * rad).toFixed(1)},${(cy + Math.sin(t) * rad * 1.15).toFixed(1)}`);
        }
        els.push(<polyline key={k} points={pts.join(' ')} fill="none" stroke={k % 3 ? color : c2} strokeWidth={0.9} opacity={0.85} />);
      }
      break;
    }
    case 3: { // looping ribbons
      for (let i = 0; i < 4; i++) {
        const y = R(10, h - 10);
        const d = `M -10 ${y} C ${R(10, 40)} ${R(-20, h)}, ${R(40, 70)} ${R(0, h + 20)}, ${R(55, 80)} ${R(10, h - 10)} S ${R(90, 120)} ${R(0, h)}, 115 ${R(10, h - 10)}`;
        els.push(<path key={i} d={d} fill="none" stroke={i % 2 ? c2 : color} strokeWidth={R(2, 6)} strokeLinecap="round" opacity={0.8} />);
      }
      break;
    }
    case 4: { // soft concentric radial glow
      const cx = R(30, 70), cy = R(40, 100);
      els.push(<defs key="d"><radialGradient id={id + 'g'}><stop offset="0" stopColor={c2} stopOpacity="0.95" /><stop offset="1" stopColor={color} stopOpacity="0" /></radialGradient></defs>);
      els.push(<circle key="g" cx={cx} cy={cy} r={62} fill={`url(#${id}g)`} />);
      for (let k = 1; k <= 6; k++) els.push(<circle key={k} cx={cx} cy={cy} r={k * 11} fill="none" stroke={color} strokeWidth={0.8} opacity={0.6 - k * 0.07} />);
      break;
    }
    case 5: { // converging diagonals
      const fx = R(30, 70), fy = R(45, 95);
      for (let i = 0; i < 26; i++) {
        const side = i % 4, t = r();
        const [x, y] = side === 0 ? [t * w, -2] : side === 1 ? [w + 2, t * h] : side === 2 ? [t * w, h + 2] : [-2, t * h];
        els.push(<line key={i} x1={x} y1={y} x2={fx + R(-3, 3)} y2={fy + R(-3, 3)} stroke={i % 6 ? color : c2} strokeWidth={R(0.4, 1.3)} opacity={0.75} />);
      }
      break;
    }
    case 6: { // blurred blobs
      els.push(<defs key="d"><filter id={id + 'b'} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7" /></filter></defs>);
      for (let i = 0; i < 6; i++) els.push(<ellipse key={i} cx={R(0, w)} cy={R(0, h)} rx={R(14, 34)} ry={R(12, 30)} fill={i % 2 ? c2 : color} opacity={0.75} filter={`url(#${id}b)`} />);
      break;
    }
    case 7: { // lattice / filigree
      const s = R(12, 18), rot = R(-12, 12);
      const lines: JSX.Element[] = [];
      for (let i = -12; i < 22; i++) {
        lines.push(<line key={'a' + i} x1={i * s} y1={-40} x2={i * s + 180} y2={180} stroke={color} strokeWidth={0.8} />);
        lines.push(<line key={'b' + i} x1={i * s} y1={180} x2={i * s + 180} y2={-40} stroke={color} strokeWidth={0.8} />);
      }
      els.push(<g key="l" opacity={0.7} transform={`rotate(${rot} 50 70)`}>{lines}</g>);
      for (let i = 0; i < 7; i++) els.push(<circle key={'d' + i} cx={R(5, 95)} cy={R(5, 135)} r={1.6} fill={gold} opacity={0.9} />);
      break;
    }
    default: { // 8: sparse stars and a gold hairline
      for (let i = 0; i < 34; i++) els.push(<circle key={i} cx={R(0, w)} cy={R(0, h)} r={R(0.3, 1.4)} fill={color} opacity={R(0.4, 1)} />);
      const y = R(30, 110);
      els.push(<path key="h" d={`M -5 ${y} Q 50 ${y + R(-30, 30)} 105 ${y + R(-15, 15)}`} fill="none" stroke={gold} strokeWidth={0.7} opacity={0.9} />);
      els.push(<circle key="moon" cx={R(60, 85)} cy={R(14, 34)} r={7} fill={gold} opacity={0.85} />);
    }
  }
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice" width="100%" height="100%" aria-hidden="true">
      {els}
    </svg>
  );
});

/** Small line icons for card types. Same 24px grid, stroke uses currentColor. */
const ICONS: Record<string, string> = {
  Ask: 'M4 5h16v10H9l-5 4z',
  Share: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  Guess: 'M9 9a3 3 0 1 1 4.5 2.6c-.9.5-1.5 1.2-1.5 2.4M12 17.5v.5',
  Revisit: 'M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4',
  Appreciate: 'M12 3l2.2 5.6L20 9.3l-4.5 3.8L17 19l-5-3-5 3 1.5-5.9L4 9.3l5.8-.7z',
  Note: 'M5 19l1-4L16 5l3 3L9 18zM14 7l3 3',
  Plan: 'M5 6h14v13H5zM5 10h14M9 3v4M15 3v4',
  Do: 'M8 12V6a1.5 1.5 0 0 1 3 0v5M11 11V5a1.5 1.5 0 0 1 3 0v6M14 11V7a1.5 1.5 0 0 1 3 0v6c0 4-2.5 7-6 7s-5-2-6.5-5L3 12a1.5 1.5 0 0 1 2.5-1.5L8 13',
  Compliment: 'M12 3l2.2 5.6L20 9.3l-4.5 3.8L17 19l-5-3-5 3 1.5-5.9L4 9.3l5.8-.7z',
  Tease: 'M4 7h16v11H4zM4 7l8 6 8-6',
  Choose: 'M5 5h14v14H5zM9 9h.01M15 9h.01M9 15h.01M15 15h.01M12 12h.01',
  Session: 'M20 4c-8 0-14 5-15 15 3-2 6-3 9-3M9 15c2-4 5-7 9-9',
  Scene: 'M3 8c3-2 6-2 9 0 3-2 6-2 9 0-1 6-4 9-9 9S4 14 3 8zM8 11h2M14 11h2',
  Persona: 'M3 8c3-2 6-2 9 0 3-2 6-2 9 0-1 6-4 9-9 9S4 14 3 8zM8 11h2M14 11h2',
  Cue: 'M6 21V4M6 4h11l-2 4 2 4H6',
  Chain: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  Whisper: 'M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4',
  Epilogue: 'M3 18h18M6 18a6 6 0 0 1 12 0M12 6v2M5.5 9.5l1.4 1.4M18.5 9.5l-1.4 1.4',
  Twist: 'M4 12c4-8 12 8 16 0M4 16c4-8 12 8 16 0',
};
export function TypeIcon({ type, size = 18 }: { type: string; size?: number }) {
  const d = ICONS[type] || ICONS.Ask;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/** Tiny level glyph so a level is never shown by colour alone. */
export function LevelGlyph({ level, size = 14 }: { level: number; size?: number }) {
  const g: Record<number, JSX.Element> = {
    1: <><circle cx="6" cy="7" r="1.6" /><circle cx="15" cy="5" r="1" /><circle cx="11" cy="14" r="1.8" /><circle cx="18" cy="16" r="1.2" /></>,
    2: <><path d="M4 12a8 6 0 1 0 16 0a8 6 0 1 0-16 0" fill="none" /><path d="M8 12a4 3 0 1 0 8 0a4 3 0 1 0-8 0" fill="none" /></>,
    3: <path d="M3 15c4-8 7 6 10-1s5-4 8-2" fill="none" />,
    4: <><circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="7" fill="none" /></>,
    5: <path d="M3 3l9 9M21 3l-9 9M3 21l9-9M21 21l-9-9" fill="none" />,
    6: <><ellipse cx="9" cy="10" rx="5" ry="4" /><ellipse cx="15" cy="15" rx="5" ry="4" opacity=".6" /></>,
    7: <path d="M12 3l8 9-8 9-8-9z M12 8l4 4-4 4-4-4z" fill="none" />,
    8: <><path d="M15 4a8 8 0 1 0 5 13 6 6 0 0 1-5-13z" /><circle cx="6" cy="6" r="1" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">{g[level] || g[1]}</svg>
  );
}

/** Static grain texture as a data URI (rendered once, never animated). */
export const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n' x='0' y='0' width='1' height='1'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`,
)}")`;

/* ---------------- art that reflects the card ----------------
   Each card's text is matched to one visual theme (a blindfold card shows a tied band, a candle card a flame, a song
   card sound waves). Abstract objects and shapes only: never bodies, faces, hands or anatomy. Face-down and gated
   cards never get a theme, because their text isn't known yet and the art must not hint at it. */
export type Theme =
  | 'blindfold' | 'ice' | 'candle' | 'oil' | 'water' | 'feather' | 'silk' | 'mask' | 'music' | 'kiss' | 'undress'
  | 'gaze' | 'touch' | 'whisper' | 'note' | 'photo' | 'travel' | 'home' | 'food' | 'night' | 'time' | 'play'
  | 'sparkle' | 'heart';

// Order matters: the first match wins, so specific objects come before broad feelings.
const THEMES: [Theme, RegExp][] = [
  ['blindfold', /blindfold|eyes closed|close your eyes/i],
  ['ice', /\bice\b|snow|cold cabin/i],
  ['water', /shower|bath|\brain\b|wash|soap|towel/i],
  ['candle', /candle|flame|lights low|dim the lights|lights off|in its glow/i],
  ['oil', /\boil\b|lotion|massage/i],
  ['feather', /feather/i],
  ['silk', /silk|scarf|\bties?\b|wrists/i],
  ['mask', /^scene:|mask|persona|pretend|role-?play|gala/i],
  ['music', /song|music|danc|sway|\bhum\b|karaoke|playlist|\bsing\b|chorus/i],
  ['kiss', /kiss|lips/i],
  ['undress', /undress|button|\bzip\b|take off|\bclothes\b|clothing|\bbare\b|skin to skin|underwear|\bstrip\b|one piece at a time/i],
  ['gaze', /eye contact|gaze|look at|wink|mirror|eyes/i],
  ['touch', /touch|trace|fingertip|stroke|\brub|hands?\b|palm|hold (hands|each|them|your partner|on)|holding|\bhug|cuddle|\blap\b|lean into/i],
  ['whisper', /whisper|voice|low voice|say .* name/i],
  ['note', /note|message|\btext\b|write|letter|paper|wish/i],
  ['photo', /photo|film|movie|camera|scene from/i],
  ['travel', /trip|travel|holiday|getaway|train|hotel|city|beach|mountain|place|airport|visit|walk/i],
  ['food', /food|meal|\beat\b|snack|cook|coffee|\btea\b|dessert|drink|order|restaurant/i],
  ['home', /home|room|couch|blanket|\bbed\b|cozy|cosy|door/i],
  ['heart', /flutter|crush|in love|\blove\b|feel|heart|anticipation|charged|wanted|\bmiss\b|proud|safe|support|hope|fear/i],
  ['night', /night|midnight|dream|sleep|stars|moon/i],
  ['time', /future|year|week|tomorrow|morning|weekend|month|time|minute|today/i],
  ['play', /laugh|funny|embarrass|silly|teas|joke|game|guess|truths|a lie\b|rapid|\brate\b|this or that|would you rather|pick-up|hot take/i],
  ['sparkle', /compliment|brag|attractive|proud|best|favou?rite/i],
  ['heart', /./],
];
export function themeFor(text: string): Theme { for (const [t, re] of THEMES) if (re.test(text)) return t; return 'heart'; }

/** The themed drawing, in the same 100 x 140 box as Motif. `c` is the main ink, `c2` an accent. */
export const ThemeArt = memo(function ThemeArt({ theme, seed, c, c2 = c, gold = '#e1b75c' }: { theme: Theme; seed: string; c: string; c2?: string; gold?: string }) {
  const r = mulberry32(hash(seed + ':t'));
  const R = (a: number, b: number) => a + r() * (b - a);
  const id = 't' + hash(seed).toString(36);
  const s = { fill: 'none', stroke: c, strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const els: JSX.Element[] = [];
  const cx = 50 + R(-6, 6), cy = 58 + R(-6, 6);
  switch (theme) {
    case 'blindfold': { // a tied band across the middle, with trailing ends
      els.push(<path key="b" d={`M 4 ${cy} C 30 ${cy - 12}, 70 ${cy - 12}, 96 ${cy}`} {...s} strokeWidth={14} opacity={0.9} />);
      els.push(<path key="k1" d={`M 76 ${cy - 2} q 10 14 2 34`} {...s} strokeWidth={4} />);
      els.push(<path key="k2" d={`M 80 ${cy - 2} q 16 10 14 30`} {...s} strokeWidth={4} opacity={0.7} />);
      break;
    }
    case 'ice': { // crystal shards
      for (let i = 0; i < 6; i++) { const x = R(15, 85), y = R(25, 95), z = R(8, 16); els.push(<path key={i} d={`M ${x} ${y - z} L ${x + z * 0.6} ${y} L ${x} ${y + z} L ${x - z * 0.6} ${y} Z`} {...s} strokeWidth={1.6} fill={c2} fillOpacity={0.25} />); }
      break;
    }
    case 'candle': { // a flame with a soft glow
      els.push(<defs key="d"><radialGradient id={id + 'g'}><stop offset="0" stopColor={gold} stopOpacity="0.8" /><stop offset="1" stopColor={gold} stopOpacity="0" /></radialGradient></defs>);
      els.push(<circle key="g" cx={50} cy={48} r={38} fill={`url(#${id}g)`} />);
      els.push(<path key="f" d="M 50 22 C 62 40, 60 56, 50 62 C 40 56, 38 40, 50 22 Z" fill={gold} opacity={0.95} />);
      els.push(<rect key="c" x={42} y={64} width={16} height={44} rx={3} fill={c} opacity={0.7} />);
      break;
    }
    case 'oil': { // droplets falling into slow waves
      for (let i = 0; i < 3; i++) { const x = 30 + i * 20 + R(-4, 4), y = 26 + i * 9; els.push(<path key={'d' + i} d={`M ${x} ${y} C ${x + 7} ${y + 10}, ${x + 6} ${y + 18}, ${x} ${y + 18} C ${x - 6} ${y + 18}, ${x - 7} ${y + 10}, ${x} ${y} Z`} fill={i === 1 ? gold : c} opacity={0.85} />); }
      for (let k = 0; k < 4; k++) els.push(<path key={'w' + k} d={`M 4 ${78 + k * 9} Q 27 ${70 + k * 9} 50 ${78 + k * 9} T 96 ${78 + k * 9}`} {...s} strokeWidth={1.6} opacity={0.8 - k * 0.15} />);
      break;
    }
    case 'water': { // falling drops and ripples
      for (let i = 0; i < 14; i++) { const x = R(8, 92), y = R(10, 70); els.push(<line key={'l' + i} x1={x} y1={y} x2={x - 3} y2={y + 9} {...s} strokeWidth={1.4} opacity={0.7} />); }
      for (let k = 1; k <= 3; k++) els.push(<ellipse key={'r' + k} cx={50} cy={100} rx={k * 13} ry={k * 4} {...s} strokeWidth={1.4} opacity={0.9 - k * 0.2} />);
      break;
    }
    case 'feather': { // one curved feather
      els.push(<path key="q" d="M 30 112 C 44 80, 58 50, 74 22" {...s} strokeWidth={1.8} />);
      for (let i = 0; i < 12; i++) { const t = i / 12, x = 30 + t * 44, y = 112 - t * 90; els.push(<path key={i} d={`M ${x} ${y} q ${-14 + t * 4} ${-4} ${-20 + t * 8} ${-14}`} {...s} strokeWidth={1.2} opacity={0.75} />); els.push(<path key={'r' + i} d={`M ${x} ${y} q ${10} ${2} ${16 - t * 4} ${-12}`} {...s} strokeWidth={1.2} opacity={0.6} />); }
      break;
    }
    case 'silk': { // flowing fabric ribbons
      for (let k = 0; k < 3; k++) els.push(<path key={k} d={`M -5 ${40 + k * 16} C 25 ${20 + k * 16}, 45 ${80 + k * 10}, 70 ${50 + k * 14} S 105 ${60 + k * 12}, 110 ${40 + k * 18}`} {...s} strokeWidth={6 - k * 1.5} stroke={k === 1 ? c2 : c} opacity={0.75} />);
      break;
    }
    case 'mask': { // a masquerade mask outline (an object, eye holes only), drawn large
      els.push(<path key="m" d={`M 14 ${cy - 6} C 30 ${cy - 22}, 46 ${cy - 10}, 50 ${cy - 4} C 54 ${cy - 10}, 70 ${cy - 22}, 86 ${cy - 6} C 84 ${cy + 14}, 62 ${cy + 18}, 50 ${cy + 6} C 38 ${cy + 18}, 16 ${cy + 14}, 14 ${cy - 6} Z`} fill={c} opacity={0.8} />);
      els.push(<ellipse key="e1" cx={34} cy={cy} rx={8} ry={4.5} fill={c2} opacity={0.9} />);
      els.push(<ellipse key="e2" cx={66} cy={cy} rx={8} ry={4.5} fill={c2} opacity={0.9} />);
      els.push(<path key="r" d={`M 86 ${cy - 6} q 8 18 0 40`} {...s} stroke={gold} strokeWidth={1.6} />);
      break;
    }
    case 'music': { // sound waves rising
      for (let k = 0; k < 5; k++) { const amp = R(6, 14); els.push(<path key={k} d={`M 4 ${40 + k * 14} q 12 ${-amp} 24 0 t 24 0 t 24 0 t 24 0`} {...s} strokeWidth={2 - k * 0.2} opacity={0.9 - k * 0.12} />); }
      break;
    }
    case 'kiss': { // two orbs meeting, a spark where they touch
      els.push(<circle key="a" cx={36} cy={cy} r={28} fill={c} opacity={0.5} />);
      els.push(<circle key="b" cx={64} cy={cy} r={28} fill={c2} opacity={0.5} />);
      els.push(<path key="s" d={`M 50 ${cy - 12} l 3 9 l 9 3 l -9 3 l -3 9 l -3 -9 l -9 -3 l 9 -3 Z`} fill={gold} />);
      break;
    }
    case 'undress': { // a thread unravelling into a loose spiral
      const pts: string[] = [];
      for (let i = 0; i <= 60; i++) { const t = i / 60, a = t * Math.PI * 6, rad = 4 + t * 34; pts.push(`${(cx + Math.cos(a) * rad).toFixed(1)},${(cy + Math.sin(a) * rad * 1.1).toFixed(1)}`); }
      els.push(<polyline key="p" points={pts.join(' ')} {...s} strokeWidth={1.8} />);
      els.push(<path key="t" d={`M ${cx + 38} ${cy} C 96 ${cy + 30}, 70 ${cy + 50}, 92 ${cy + 70}`} {...s} strokeWidth={1.8} opacity={0.7} />);
      break;
    }
    case 'gaze': { // two rings joined by a line of attention
      for (const [x, k] of [[26, 'a'], [74, 'b']] as const) { els.push(<circle key={k} cx={x} cy={cy} r={19} {...s} strokeWidth={2.6} />); els.push(<circle key={k + 'i'} cx={x} cy={cy} r={7} fill={k === 'a' ? c : c2} />); }
      els.push(<line key="l" x1={45} y1={cy} x2={55} y2={cy} {...s} stroke={gold} strokeDasharray="2 3" />);
      break;
    }
    case 'touch': { // a fingerprint-like whorl
      for (let k = 1; k <= 8; k++) els.push(<ellipse key={k} cx={cx} cy={cy} rx={k * 4.2} ry={k * 5.4} {...s} strokeWidth={1.3} strokeDasharray={k % 2 ? 'none' : `${R(8, 20)} ${R(2, 5)}`} opacity={1 - k * 0.07} />);
      break;
    }
    case 'whisper': { // soft arcs drifting from one side
      for (let k = 1; k <= 5; k++) els.push(<path key={k} d={`M ${20 + k * 9} ${cy - k * 7} A ${k * 8} ${k * 8} 0 0 1 ${20 + k * 9} ${cy + k * 7}`} {...s} strokeWidth={1.8} opacity={1 - k * 0.15} />);
      els.push(<circle key="o" cx={18} cy={cy} r={4} fill={c2} />);
      break;
    }
    case 'note': { // a folded note with written lines
      els.push(<rect key="p" x={22} y={28} width={56} height={70} rx={4} {...s} fill={c} fillOpacity={0.18} strokeWidth={1.6} transform={`rotate(${R(-8, 8)} 50 63)`} />);
      for (let k = 0; k < 5; k++) els.push(<line key={k} x1={30} y1={42 + k * 10} x2={30 + R(24, 42)} y2={42 + k * 10} {...s} strokeWidth={1.4} opacity={0.8} transform={`rotate(${R(-2, 2)} 50 63)`} />);
      els.push(<path key="h" d="M 66 86 c 0 -4 6 -4 6 0 c 0 -4 6 -4 6 0 c 0 4 -6 7 -6 9 c 0 -2 -6 -5 -6 -9 z" fill={gold} />);
      break;
    }
    case 'photo': { // a film strip
      els.push(<rect key="f" x={10} y={cy - 22} width={80} height={44} rx={3} fill={c} opacity={0.75} />);
      for (let i = 0; i < 8; i++) { els.push(<rect key={'t' + i} x={13 + i * 10} y={cy - 19} width={5} height={4} fill={c2} />); els.push(<rect key={'b' + i} x={13 + i * 10} y={cy + 15} width={5} height={4} fill={c2} />); }
      for (let i = 0; i < 3; i++) els.push(<rect key={'w' + i} x={15 + i * 25} y={cy - 11} width={20} height={22} rx={2} fill={c2} opacity={0.35} />);
      break;
    }
    case 'travel': { // a winding dotted path to a pin
      els.push(<path key="p" d={`M 10 118 C 40 100, 20 70, 50 62 S 70 30, 78 28`} {...s} strokeWidth={2.2} strokeDasharray="1 6" />);
      els.push(<path key="pin" d="M 78 12 c 8 0 12 6 12 12 c 0 9 -12 20 -12 20 c 0 0 -12 -11 -12 -20 c 0 -6 4 -12 12 -12 z" fill={gold} />);
      els.push(<circle key="pc" cx={78} cy={24} r={4} fill={c} />);
      break;
    }
    case 'food': { // a bowl with rising steam
      els.push(<path key="b" d="M 22 80 Q 50 114 78 80 Z" fill={c} opacity={0.8} />);
      for (let k = 0; k < 3; k++) els.push(<path key={k} d={`M ${38 + k * 12} 72 c -6 -8 6 -14 0 -22 c -6 -8 6 -14 0 -22`} {...s} strokeWidth={1.8} opacity={0.75} />);
      break;
    }
    case 'home': { // an arched window glowing at night
      els.push(<path key="a" d="M 28 104 L 28 54 A 22 22 0 0 1 72 54 L 72 104 Z" {...s} fill={gold} fillOpacity={0.35} />);
      els.push(<line key="v" x1={50} y1={34} x2={50} y2={104} {...s} strokeWidth={1.4} />);
      els.push(<line key="h" x1={28} y1={70} x2={72} y2={70} {...s} strokeWidth={1.4} />);
      break;
    }
    case 'night': { // a crescent and scattered stars
      els.push(<path key="m" d="M 62 22 a 22 22 0 1 0 18 34 a 17 17 0 1 1 -18 -34 z" fill={gold} opacity={0.9} />);
      for (let i = 0; i < 12; i++) els.push(<circle key={i} cx={R(8, 92)} cy={R(60, 130)} r={R(0.8, 2)} fill={c} opacity={R(0.5, 1)} />);
      break;
    }
    case 'time': { // a sun-and-moon arc, like a day passing
      els.push(<path key="a" d="M 12 96 A 38 38 0 0 1 88 96" {...s} strokeDasharray="3 4" />);
      els.push(<circle key="s" cx={R(26, 74)} cy={R(60, 70)} r={9} fill={gold} />);
      els.push(<line key="h" x1={6} y1={96} x2={94} y2={96} {...s} strokeWidth={1.4} />);
      break;
    }
    case 'play': { // bouncing bubbles and a spark
      for (let i = 0; i < 9; i++) els.push(<circle key={i} cx={R(12, 88)} cy={R(18, 110)} r={R(3, 12)} {...s} strokeWidth={1.6} fill={i % 3 ? 'none' : c2} fillOpacity={0.3} />);
      break;
    }
    case 'sparkle': { // a cluster of four-point stars
      for (let i = 0; i < 6; i++) { const x = R(14, 86), y = R(16, 110), z = R(4, 11); els.push(<path key={i} d={`M ${x} ${y - z} Q ${x} ${y} ${x + z} ${y} Q ${x} ${y} ${x} ${y + z} Q ${x} ${y} ${x - z} ${y} Q ${x} ${y} ${x} ${y - z} Z`} fill={i % 2 ? gold : c} opacity={0.9} />); }
      break;
    }
    default: { // heart: two curves leaning in to meet
      els.push(<path key="l" d={`M 50 ${cy + 26} C 20 ${cy + 4}, 22 ${cy - 26}, 48 ${cy - 10}`} {...s} strokeWidth={3} />);
      els.push(<path key="r" d={`M 50 ${cy + 26} C 80 ${cy + 4}, 78 ${cy - 26}, 52 ${cy - 10}`} {...s} stroke={c2} strokeWidth={3} />);
    }
  }
  const big = theme === 'mask' ? `translate(50 ${cy}) scale(1.3) translate(-50 ${-cy})` : undefined;
  return <svg viewBox="0 0 100 140" preserveAspectRatio="xMidYMid meet" width="100%" height="100%" aria-hidden="true"><g transform={big}>{els}</g></svg>;
});
