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
    case 1: { // scattered specks
      for (let i = 0; i < 46; i++) els.push(<circle key={i} cx={R(0, w)} cy={R(0, h)} r={R(0.5, 2.6)} fill={i % 5 ? color : c2} opacity={R(0.35, 0.95)} />);
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
