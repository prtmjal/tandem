// Teaching as you play: a three-step intro shown once per phone (and from the menu), plus one-line tips that appear
// the first time each new moment happens. No manuals, no quizzes; every tip can be dismissed for good.
import { useState, type ReactNode } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { store } from './net';

const INTRO_KEY = 'tad.intro';
const TIPS_KEY = 'tad.tips';

export const introSeen = () => store.get(INTRO_KEY) === '1';
export const markIntroSeen = () => store.set(INTRO_KEY, '1');

const STEPS: { title: string; body: string; points: string[]; art: string }[] = [
  {
    title: 'Two phones, one game',
    body: 'Each of you plays on your own phone. One of you starts a game; the other joins with the link, QR code or code.',
    points: ['You both see the same card at the same time.', 'Read it out loud, talk, then either of you taps Next.'],
    art: '📱📱',
  },
  {
    title: 'You both choose how far',
    body: 'Each night, you each pick privately how far to go. The game plays at the lower of the two picks.',
    points: ['Levels 1 and 2 are open from the start.', 'Higher levels open only when you both tap “curious”, privately.', 'Your partner never sees your picks, only what you both chose.'],
    art: '🔒',
  },
  {
    title: 'Pass anything, anytime',
    body: 'Pass and Next do the same thing. Nobody can tell which one was tapped, and nobody has to explain.',
    points: ['Before hands-on cards you each answer privately: yes, maybe or not tonight.', 'Pause or Softer are always at the bottom of the screen.', 'Sound and touch are off until you turn them on.'],
    art: '🤍',
  },
];

/** Three short screens. `onDone` runs on the last step or on Skip. */
export function Intro({ onDone, inline = false }: { onDone: () => void; inline?: boolean }) {
  const [i, setI] = useState(0);
  const s = STEPS[i];
  const last = i === STEPS.length - 1;
  const finish = () => { markIntroSeen(); onDone(); };
  const body = (
    <>
      <div className="intro-top">
        <span className="tiny muted">How it works · {i + 1} of {STEPS.length}</span>
        <button className="linkbtn" onClick={finish}>{inline ? 'Close' : 'Skip'}</button>
      </div>
      <AnimatePresence mode="wait">
        <m.div key={i} className="stack intro-step" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: .22 }}>
          <div className="intro-art" aria-hidden="true">{s.art}</div>
          <h2>{s.title}</h2>
          <p className="muted">{s.body}</p>
          <ul className="intro-points">{s.points.map(pt => <li key={pt}>{pt}</li>)}</ul>
        </m.div>
      </AnimatePresence>
      <div className="dots-row" aria-hidden="true">{STEPS.map((_, k) => <i key={k} className={k === i ? 'on' : ''} />)}</div>
      <div className="row">
        {i > 0 && <button className="ctrl" onClick={() => setI(i - 1)}>Back</button>}
        <button className="btn" onClick={() => (last ? finish() : setI(i + 1))}>{last ? (inline ? 'Got it' : 'Let’s play') : 'Next'}</button>
      </div>
    </>
  );
  if (inline) return <div className="overlay" role="dialog" aria-modal="true" aria-label="How to play"><div className="panel intro">{body}</div></div>;
  return <main className="app intro">{body}</main>;
}

function seenTips(): Set<string> {
  try { return new Set(JSON.parse(store.get(TIPS_KEY) || '[]')); } catch { return new Set(); }
}
export function resetTips() { store.del(TIPS_KEY); }

/** A one-line hint shown the first time a moment happens on this phone. */
export function Tip({ id, children }: { id: string; children: ReactNode }) {
  const [hidden, setHidden] = useState(() => seenTips().has(id));
  if (hidden) return null;
  const dismiss = () => { const s = seenTips(); s.add(id); store.set(TIPS_KEY, JSON.stringify([...s])); setHidden(true); };
  return (
    <div className="tip" role="note">
      <span className="tip-i" aria-hidden="true">💡</span>
      <p>{children}</p>
      <button className="linkbtn" onClick={dismiss}>Got it</button>
    </div>
  );
}
