// Shared building blocks: the playing card, partner chip, waiting state, countdown, reactions.
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { AnimatePresence, m } from 'motion/react';
import type { Card } from '../shared/content';
import { LEVELS } from '../shared/levels';
import { cardColors, chipColor, type Mode } from '../shared/theme';
import type { VibeId } from '../shared/protocol';
import { GRAIN, LevelGlyph, Motif, ThemeArt, TypeIcon, themeFor } from './art';
import { useCountdown } from './net';

export const levelName = (l: number) => LEVELS[l]?.n || '';

export function cardStyle(level: number, hue: number, mode: Mode, vibe?: VibeId): CSSProperties {
  const c = cardColors(level, hue, mode, vibe);
  // Prompt weight steps from 500 at Level 1 to 600 at Level 8: more presence, no extra font files.
  const w = Math.round(500 + (Math.min(8, Math.max(1, level)) - 1) * (100 / 7));
  return { ['--field' as string]: c.field, ['--ink' as string]: c.ink, ['--ink-soft' as string]: c.inkSoft, ['--motif' as string]: c.motif, ['--grain' as string]: GRAIN, ['--pw' as string]: w };
}

const HINTS: Record<string, string> = {
  Ask: 'Answer, then ask back', Share: 'Say it out loud', Guess: 'Seal your guess under Answer, then reveal', Seal: 'Seal yours under Answer · both open together', Revisit: 'Has this changed?',
  Appreciate: 'Listener: just say thank you', Note: 'Do it later', Plan: 'Make the plan together', Do: 'Receiver leads',
  Tease: 'Opens later', Choose: 'Decide together', Session: 'Nothing has to lead anywhere', Scene: 'Cue word steps out',
  Persona: 'Play as long as it’s fun', Cue: 'Say each word once', Chain: 'Part of a chain', Whisper: 'Then the phone goes away',
  Epilogue: 'For the morning after', Compliment: 'Be specific',
  Likely: 'Pick on your phone · whoever is picked explains', Roles: 'Keep your role secret · guess each other’s at the end',
};

interface PlayCardProps {
  level: number; hue: number; vibe?: VibeId; mode: Mode; card: Card | null; seed: string;
  faceDown?: boolean; special?: 'holo' | 'gold'; title?: string; text?: string; type?: string;
  backLabel?: ReactNode; dealKey?: string | number;
  /** Who reads this card aloud, for cards written as 'me' and 'you' (both phones show the same name). */
  reader?: string;
  /** Replaces the type's usual footer hint (e.g. on a scene that comes with secret roles). */
  hint?: string;
}

/** A 5:7 card with a generated-art back and an illustrated face. No swipe: moving on is always a button. */
export function PlayCard(p: PlayCardProps) {
  const text = p.text ?? p.card?.text ?? '';
  const type = p.type ?? p.card?.type ?? 'Ask';
  const size = text.length < 95 ? 's' : text.length < 170 ? 'm' : 'l';
  const style = cardStyle(p.level, p.hue, p.mode, p.vibe);
  return (
    <div className="cardwrap">
      <m.div
        key={p.dealKey}
        className="card3d"
        style={style}
        initial={{ y: 40, opacity: 0, scale: .96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      >
        <div className={'flipper' + (p.faceDown ? ' down' : '')}>
          <div className={'face front' + (p.special ? ' ' + p.special : '')} aria-hidden={p.faceDown}>
            <div className="head">
              <span className="chip">{type === 'Twist' ? <>✦ {p.title}</> : <><LevelGlyph level={p.level} /> {p.level} · {p.title ?? levelName(p.level)}</>}</span>
              {p.reader && <span className="chip reader">{p.reader}</span>}
            </div>
            <div className="art ghost" aria-hidden="true"><Motif level={p.level} seed={p.seed + 'g'} color="currentColor" /></div>
            <div className="art">
              <div className="art-bg"><Motif level={p.level} seed={p.seed} color="currentColor" /></div>
              {text && <div className="art-theme"><ThemeArt theme={themeFor(text)} seed={p.seed} c="currentColor" /></div>}
            </div>
            <div className="body"><h2 className="sr-only">{type === 'Twist' ? 'Wildcard' : `Level ${p.level}, ${levelName(p.level)}`}</h2><p className={'prompt ' + size}>{text}</p></div>
            <div className="foot"><span>{p.hint ?? HINTS[type] ?? ''}</span></div>
          </div>
          <div className={'face back' + (p.special === 'gold' ? ' gold' : '')} aria-hidden={!p.faceDown}>
            <div className="art"><Motif level={p.level} seed={p.seed + 'b'} color="currentColor" /></div>
            <div className="brand">
              {p.backLabel ?? <><b>Tandem</b><span className="tiny">{p.level} · {levelName(p.level)}</span></>}
            </div>
          </div>
        </div>
      </m.div>
    </div>
  );
}

export function MiniArt({ level, hue, vibe, mode, seed }: { level: number; hue: number; vibe?: VibeId; mode: Mode; seed: string }) {
  return <div className="art" style={cardStyle(level, hue, mode, vibe)}><Motif level={level} seed={seed} color="currentColor" /></div>;
}

/** A player's chip: their initial plus their colour's glyph. "you" is filled, "partner" is an outlined ring. */
export function Avatar({ name, online, vibe, mode, who = 'partner' }: { name: string; online?: boolean; vibe?: VibeId | null; mode?: Mode; who?: 'you' | 'partner' }) {
  const col = vibe && mode ? chipColor(vibe, mode, who) : null;
  const style = col ? (who === 'you' ? { background: col, borderColor: col, color: 'var(--bg)' } : { borderColor: col, borderWidth: 2.5 }) : undefined;
  return (
    <span className="avatar" aria-hidden="true" style={style}>
      {(name.trim()[0] || '?').toUpperCase()}
      {online !== undefined && <i className={'dot' + (online ? '' : ' off')} />}
    </span>
  );
}

export function Waiting({ children }: { children: ReactNode }) {
  return <span className="waiting" role="status"><span className="dots"><i /><i /><i /></span>{children}</span>;
}

/** Full-screen 3-2-1 synced to a server timestamp. Calls onDone once at zero. */
export function Countdown({ at, onDone }: { at: number | null; onDone?: () => void }) {
  const left = useCountdown(at);
  const fired = useRef<number | null>(null);
  useEffect(() => { if (at && left === 0 && fired.current !== at) { fired.current = at; onDone?.(); } }, [at, left, onDone]);
  if (!at || left <= 0) return null;
  const n = Math.ceil(left / 1000);
  return (
    <div className="count" aria-live="assertive">
      <AnimatePresence mode="popLayout">
        <m.b key={n} initial={{ scale: 1.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: .6, opacity: 0 }} transition={{ duration: .35 }}>{n}</m.b>
      </AnimatePresence>
    </div>
  );
}

export function Floaters({ items }: { items: { id: number; r: string; x: number }[] }) {
  return (
    <div className="floaters" aria-hidden="true">
      <AnimatePresence>
        {items.map(f => (
          <m.span key={f.id} style={{ left: f.x + '%' }} initial={{ y: 0, opacity: 0, scale: .6 }} animate={{ y: -320, opacity: [0, 1, 1, 0], scale: 1.1 }} exit={{ opacity: 0 }} transition={{ duration: 2.2, ease: 'easeOut' }}>{f.r}</m.span>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function useToast(): [string | null, (s: string) => void] {
  const [t, setT] = useState<string | null>(null);
  const tm = useRef(0);
  return [t, (s: string) => { setT(s); clearTimeout(tm.current); tm.current = window.setTimeout(() => setT(null), 2200); }];
}

export function Icon({ d, size = 20 }: { d: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;
}
export const I = {
  pause: 'M8 5v14M16 5v14',
  softer: 'M4 12h16M12 4v0M6 18l6-6 6 6',
  menu: 'M4 7h16M4 12h16M4 17h16',
  star: 'M12 3l2.2 5.6L20 9.3l-4.5 3.8L17 19l-5-3-5 3 1.5-5.9L4 9.3l5.8-.7z',
  lock: 'M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3',
  share: 'M12 4v11M7 9l5-5 5 5M5 14v5h14v-5',
  copy: 'M8 8h11v12H8zM5 16V4h11',
  moon: 'M15 4a8 8 0 1 0 5 13 6 6 0 0 1-5-13z',
  close: 'M6 6l12 12M18 6L6 18',
  timer: 'M12 8v5l3 2M9 3h6M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16z',
};
