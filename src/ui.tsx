// Shared building blocks: the playing card, partner chip, waiting state, countdown, reactions.
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { AnimatePresence, m, useMotionValue, useTransform, type PanInfo } from 'motion/react';
import { LEVELS, type Card } from '../shared/content';
import { cardColors, type Mode } from '../shared/theme';
import { GRAIN, LevelGlyph, Motif, TypeIcon } from './art';
import { useCountdown } from './net';

export const levelName = (l: number) => LEVELS[l]?.n || '';

export function cardStyle(level: number, hue: number, mode: Mode): CSSProperties {
  const c = cardColors(level, hue, mode);
  return { ['--field' as string]: c.field, ['--ink' as string]: c.ink, ['--ink-soft' as string]: c.inkSoft, ['--motif' as string]: c.motif, ['--grain' as string]: GRAIN };
}

const HINTS: Record<string, string> = {
  Ask: 'Answer, then ask back', Share: 'Say it out loud', Guess: 'Guess first, then reveal', Revisit: 'Has this changed?',
  Appreciate: 'Listener: just say thank you', Note: 'Do it later', Plan: 'Make the plan together', Do: 'Receiver leads',
  Tease: 'Opens later', Choose: 'Decide together', Session: 'Nothing has to lead anywhere', Scene: 'Cue word steps out',
  Persona: 'Play as long as it’s fun', Cue: 'Say each word once', Chain: 'Part of a chain', Whisper: 'Then the phone goes away',
  Epilogue: 'For the morning after', Compliment: 'Be specific',
};

interface PlayCardProps {
  level: number; hue: number; mode: Mode; card: Card | null; seed: string;
  faceDown?: boolean; special?: 'holo' | 'gold'; title?: string; text?: string; type?: string;
  backLabel?: ReactNode; onSwipe?: () => void; dealKey?: string | number;
}

/** A 5:7 card with a generated-art back and an illustrated face. Swipe sideways to move on. */
export function PlayCard(p: PlayCardProps) {
  const text = p.text ?? p.card?.text ?? '';
  const type = p.type ?? p.card?.type ?? 'Ask';
  const size = text.length < 95 ? 's' : text.length < 170 ? 'm' : 'l';
  const x = useMotionValue(0);
  const rot = useTransform(x, [-200, 200], [-12, 12]);
  const style = cardStyle(p.level, p.hue, p.mode);
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (!p.onSwipe) return;
    const w = 300;
    if (Math.abs(info.offset.x) > w * 0.28 || Math.abs(info.velocity.x) > 500) p.onSwipe();
  };
  return (
    <div className="cardwrap">
      <m.div
        key={p.dealKey}
        className="card3d"
        style={{ ...style, x, rotate: rot }}
        initial={{ y: 40, opacity: 0, scale: .96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        drag={p.onSwipe && !p.faceDown ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={onDragEnd}
      >
        <div className={'flipper' + (p.faceDown ? ' down' : '')}>
          <div className={'face front' + (p.special ? ' ' + p.special : '')} aria-hidden={p.faceDown}>
            <div className="head">
              <span className="chip">{type === 'Twist' ? <>✦ {p.title}</> : <><LevelGlyph level={p.level} /> {p.level} · {p.title ?? levelName(p.level)}</>}</span>
              <span className="chip"><TypeIcon type={type} size={14} /> {type}</span>
            </div>
            <div className="art"><Motif level={p.level} seed={p.seed} color="currentColor" /></div>
            <div className="body"><p className={'prompt ' + size}>{text}</p></div>
            <div className="foot"><span>{HINTS[type] || ''}</span><span>Pass anytime</span></div>
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

export function MiniArt({ level, hue, mode, seed }: { level: number; hue: number; mode: Mode; seed: string }) {
  return <div className="art" style={cardStyle(level, hue, mode)}><Motif level={level} seed={seed} color="currentColor" /></div>;
}

export function Avatar({ name, online }: { name: string; online?: boolean }) {
  return (
    <span className="avatar" aria-hidden="true">
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
