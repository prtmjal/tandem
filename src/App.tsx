import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, LazyMotion, MotionConfig, m } from 'motion/react';
import QRCode from 'qrcode';
import { DECK } from '../shared/content';
import { AGE_OK, REACTIONS, type VibeId, type View } from '../shared/protocol';
import { VIBES, VIBE_IDS, cardColors, chipColor, hueDistance, blendHue, themeTokens, type Mode } from '../shared/theme';
import { keys, loadPasses, loadProgress, net, shop, store, useCountdown, useNet, useWakeLock } from './net';
import { DECKS, DECK_IDS, PASS_CARD_COUNT } from '../shared/decks';
import { canVibrate, cue, prefs, startHeartbeat, startMusic, stopHeartbeat, stopMusic, unlockAudio, type HapticLevel } from './feel';
import { Intro, Tip, introSeen, resetTips } from './guide';
import { drawShareCard, shareImage } from './share';
import { makeBackup, mergeBackup, readBackup } from './backup';
import { BY_COUNTRY, KIT, KIT_IDS, RETAILERS, kitFor, retailersFor, type KitId } from '../shared/shop';
import { guessCountry, setShopCountry, shopCountry } from './region';
import { Avatar, Countdown, Floaters, I, Icon, MiniArt, PlayCard, Waiting, levelName, useToast } from './ui';
import { LevelGlyph } from './art';

const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
const loadFeatures = () => import('motion/react').then(r => r.domMax);
const confetti = (opts: Record<string, unknown> = {}) =>
  import('canvas-confetti').then(c => c.default({ particleCount: 70, spread: 75, origin: { y: .6 }, disableForReducedMotion: true, colors: ['#e1b75c', '#fa7f91', '#fdf2f4', '#e484d0'], ...opts }));

/* ---------------- theme ---------------- */
type ModePref = 'auto' | 'light' | 'dark';
function useSystemDark() {
  const q = typeof matchMedia !== 'undefined' ? matchMedia('(prefers-color-scheme: dark)') : null;
  const [d, setD] = useState(!!q?.matches);
  useEffect(() => { if (!q) return; const f = () => setD(q.matches); q.addEventListener('change', f); return () => q.removeEventListener('change', f); }, [q]);
  return d;
}
const isNight = () => { const h = new Date().getHours(); return h >= 22 || h < 5; };

function useTheme(view: View | null, myVibe: VibeId, pref: ModePref) {
  const sysDark = useSystemDark();
  const tonight = view?.arrive?.tonight ?? view?.session?.tonight ?? 0;
  let mode: Mode = pref === 'light' ? 'light' : pref === 'dark' ? 'dark' : sysDark ? 'dark' : 'light';
  if ((tonight >= 5 && isNight()) || view?.dark) mode = 'late';
  const a = view?.arrive?.myVibe ?? myVibe;
  const b = view?.arrive?.partnerVibe ?? null;
  const ha = VIBES[a].hue, hb = b ? VIBES[b].hue : null;
  const close = hb !== null && hueDistance(ha, hb) <= 60;
  const chromeHue = hb !== null && close ? blendHue(ha, hb) : ha;
  // Far-apart vibes alternate card by card instead of blending through a muddy midpoint.
  const seq = view?.session?.card?.seq ?? 0;
  const cardHue = hb === null ? ha : close ? chromeHue : seq % 2 ? hb : ha;
  const accentVibe: VibeId = hb !== null && !close && seq % 2 && b ? b : a;
  // The card belongs to one partner's vibe unless the two are blended; that vibe's drift and chroma then apply.
  const cardVibe: VibeId | undefined = hb === null ? a : close ? (a === b ? a : undefined) : (seq % 2 && b ? b : a);
  const t = themeTokens(chromeHue, accentVibe, mode, hb ?? undefined);
  useEffect(() => {
    const r = document.documentElement.style;
    const map: Record<string, string> = {
      '--bg': t.bg, '--bg2': t.bg2, '--surface': t.surface, '--fg': t.fg, '--muted': t.muted, '--line': t.line,
      '--accent': t.accent, '--on-accent': t.onAccent, '--gold': t.gold, '--ctrl-bg': t.ctrlBg, '--ctrl-fg': t.ctrlFg, '--ctrl-line': t.ctrlLine,
      '--glow-a': t.glowA, '--glow-b': t.glowB,
    };
    for (const k in map) r.setProperty(k, map[k]);
    document.documentElement.style.colorScheme = mode === 'light' ? 'light' : 'dark';
    document.querySelector('meta[name=theme-color]')?.setAttribute('content', t.bg);
  }, [t.bg, t.bg2, t.surface, t.fg, t.muted, t.line, t.accent, t.onAccent, t.gold, t.ctrlBg, t.ctrlFg, t.ctrlLine, t.glowA, t.glowB, mode]);
  return { mode, cardHue, chromeHue, cardVibe, myVibe: a, partnerVibe: b };
}

/* ---------------- app shell ---------------- */
export default function App() {
  const { view, status, saved } = useNet();
  const [age, setAge] = useState(store.get(keys.age) === AGE_OK);
  const [myVibe, setMyVibe] = useState<VibeId>((store.get(keys.vibe) as VibeId) || 'rose');
  const [pref, setPref] = useState<ModePref>((store.get(keys.mode) as ModePref) || 'auto');
  const theme = useTheme(view, myVibe, pref);
  const [floaters, setFloaters] = useState<{ id: number; r: string; x: number }[]>([]);
  const [toast, showToast] = useToast();
  const [intro, setIntro] = useState(!introSeen());
  const [touchAt, setTouchAt] = useState(0);
  const fid = useRef(0);

  const addFloat = useCallback((r: string) => {
    const id = ++fid.current;
    setFloaters(f => [...f, { id, r, x: 15 + Math.random() * 70 }]);
    setTimeout(() => setFloaters(f => f.filter(z => z.id !== id)), 2400);
  }, []);
  useEffect(() => {
    net.onReact = r => { addFloat(r); cue('ready'); };
    net.onCelebrate = () => { confetti(); cue('level'); };
    net.onTouch = () => { cue('touch'); setTouchAt(Date.now()); };
  }, [addFloat]);
  useWakeLock(view?.phase === 'card' || view?.phase === 'close' || view?.phase === 'arrive');
  // A scanned backup QR opens /play#backup=...; the code stays in the address fragment, so it never reaches the server.
  const [pendingBackup, setPendingBackup] = useState<string | null>(() => { const m = /[#&]backup=([^&]+)/.exec(location.hash); return m ? decodeURIComponent(m[1]) : null; });
  useEffect(() => { if (pendingBackup) history.replaceState(null, '', location.pathname + location.search); }, []);
  // Back from Stripe Checkout: swap the paid session for a pass code, then tidy the address bar.
  useEffect(() => {
    const sid = new URLSearchParams(location.search).get('paid');
    if (!sid) return;
    history.replaceState(null, '', location.pathname);
    shop.claim(sid).then(() => showToast('Couple Pass is on for both of you')).catch(e => showToast((e as Error).message));
  }, []);

  const pickVibe = (v: VibeId) => { setMyVibe(v); store.set(keys.vibe, v); if (view?.phase === 'arrive') net.act({ a: 'vibe', v }); };

  let screen: JSX.Element;
  if (!age) screen = <AgeGate onYes={() => { store.set(keys.age, AGE_OK); setAge(true); }} mode={theme.mode} hue={theme.cardHue} />;
  else if (intro && !saved) screen = <Intro onDone={() => setIntro(false)} />;
  else if (!saved || !view) screen = <Start reconnecting={!!saved && status !== 'online'} mode={theme.mode} hue={theme.cardHue} />;
  else screen = <Room view={view} theme={theme} myVibe={myVibe} pickVibe={pickVibe} pref={pref}
    setPref={p => { setPref(p); store.set(keys.mode, p); }} react={r => { net.react(r); addFloat(r); cue('tap'); }} toast={showToast} online={status === 'online'} />;

  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">
        <InAppBanner />
        {screen}
        {pendingBackup && age && !(intro && !saved) && <RestoreDialog code={pendingBackup} done={msg => { setPendingBackup(null); if (msg) showToast(msg); }} />}
        <Floaters items={floaters} />
        {touchAt > 0 && <TouchPulse key={touchAt} name={view ? view.names[view.me === 0 ? 1 : 0] : ''} />}
        <AnimatePresence>{toast && <m.div className="toast" role="status" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{toast}</m.div>}</AnimatePresence>
      </MotionConfig>
    </LazyMotion>
  );
}

/* ---------------- in-app browsers ---------------- */
// Invite links often open inside Instagram, TikTok, WhatsApp or Messenger, whose built-in browsers can drop storage
// and block sound. Suggest the real browser, once, without blocking play.
const IN_APP = /Instagram|FBAN|FBAV|FB_IAB|Messenger|TikTok|musical_ly|Bytedance|WhatsApp|Snapchat|Line\/|LinkedInApp|Twitter/i;
function InAppBanner() {
  const [hide, setHide] = useState(() => typeof navigator === 'undefined' || !IN_APP.test(navigator.userAgent) || sessionStorage.getItem('tad.iab') === '1');
  const [copied, setCopied] = useState(false);
  if (hide) return null;
  const ios = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const copy = async () => { try { await navigator.clipboard.writeText(location.href); setCopied(true); } catch { /* copy blocked */ } };
  const close = () => { try { sessionStorage.setItem('tad.iab', '1'); } catch { /* ignore */ } setHide(true); };
  return (
    <div className="iab" role="note">
      <p>For the smoothest night, open this in {ios ? 'Safari' : 'Chrome'}: tap <b>⋯</b> then <b>Open in browser</b>.</p>
      <div className="row">
        <button className="ctrl small" onClick={copy}>{copied ? 'Link copied' : 'Copy link'}</button>
        <button className="ctrl small" onClick={close}>Keep going here</button>
      </div>
    </div>
  );
}

/* ---------------- before a room ---------------- */
function HeroFan({ mode, hue }: { mode: Mode; hue: number }) {
  const cards = [{ l: 1, r: -14, x: -70 }, { l: 5, r: 0, x: 0 }, { l: 8, r: 14, x: 70 }];
  return (
    <div style={{ position: 'relative', height: 230, display: 'grid', placeItems: 'center' }} aria-hidden="true">
      {cards.map((c, i) => {
        const col = cardColors(c.l, hue, mode);
        return (
          <m.div key={c.l} initial={{ y: 60, opacity: 0, rotate: 0, x: 0 }} animate={{ y: i === 1 ? -8 : 6, opacity: 1, rotate: c.r, x: c.x }}
            transition={{ delay: .15 + i * .08, type: 'spring', stiffness: 180, damping: 18 }}
            style={{ position: 'absolute', width: 132, aspectRatio: '5/7', borderRadius: 18, overflow: 'hidden', background: col.field, color: col.motif, boxShadow: '0 18px 40px -18px rgba(0,0,0,.5)', zIndex: i === 1 ? 2 : 1 }}>
            <MiniArt level={c.l} hue={hue} mode={mode} seed={'hero' + c.l} />
            <span style={{ position: 'absolute', left: 10, bottom: 10, color: col.ink, fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.9rem' }}>{levelName(c.l)}</span>
          </m.div>
        );
      })}
    </div>
  );
}

function AgeGate({ onYes, mode, hue }: { onYes: () => void; mode: Mode; hue: number }) {
  const [sure, setSure] = useState(false);
  const [under, setUnder] = useState(false);
  if (under) return (
    <main className="app">
      <div className="grow" />
      <div className="stack center" style={{ textAlign: 'center' }}>
        <h2>This one’s for adults</h2>
        <p className="muted">Tandem After Dark is only for people 18 and older. Thanks for being honest.</p>
      </div>
      <div className="grow" />
    </main>
  );
  return (
    <main className="app">
      <HeroFan mode={mode} hue={hue} />
      <div className="stack">
        <p className="eyebrow">For two adults, on two phones</p>
        <h1>Tandem After Dark</h1>
        <p className="muted">Eight levels from first sparks to midnight, for couples of any gender or orientation. Each of you plays on your own phone, and your private answers stay private.</p>
      </div>
      <div className="stack">
        <label className="check">
          <input id="adult" type="checkbox" checked={sure} onChange={e => setSure(e.target.checked)} />
          <span>I’m 18 or older, and old enough for adult content where I live. My partner will confirm on their own phone.</span>
        </label>
      </div>
      <div className="bottom">
        <button className="btn" disabled={!sure} onClick={onYes}>I’m 18+, let’s go</button>
        <button className="btn ghost" onClick={() => setUnder(true)}>I’m under 18</button>
      </div>
    </main>
  );
}

function Start({ reconnecting, mode, hue }: { reconnecting: boolean; mode: Mode; hue: number }) {
  const params = new URLSearchParams(location.search);
  const invite = params.get('j');
  const [inviteCode, inviteSecret] = invite ? invite.split('.') : [null, null];
  const [name, setName] = useState(store.get(keys.name) || '');
  const [joining, setJoining] = useState(!!invite);
  const [code, setCode] = useState(inviteCode || '');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const go = async (fn: () => Promise<unknown>) => {
    setErr(''); setBusy(true); store.set(keys.name, name.trim());
    try { await fn(); if (invite) history.replaceState(null, '', location.pathname); } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  };
  if (reconnecting) return <main className="app"><div className="grow" /><div className="center stack"><Waiting>Reconnecting to your room</Waiting></div><div className="grow" />
    <button className="btn ghost" onClick={() => net.forget()}>Start over</button></main>;
  return (
    <main className="app">
      <HeroFan mode={mode} hue={hue} />
      <div className="stack">
        <h2>{joining ? (invite ? 'You’ve been invited' : 'Join your partner') : 'Start tonight together'}</h2>
        <p className="muted">{joining ? 'Enter your name to join their room.' : 'One of you starts a room. The other joins with the code or the link.'}</p>
      </div>
      <div className="stack">
        <label className="field">Your name or nickname
          <input id="name" type="text" maxLength={20} autoComplete="nickname" placeholder="What should your partner see?" value={name} onChange={e => setName(e.target.value)} />
        </label>
        {joining && !invite && <label className="field">Room code
          <input id="code" className="code" type="text" maxLength={6} autoCapitalize="characters" autoComplete="off" placeholder="ABC234" value={code} onChange={e => setCode(e.target.value.toUpperCase())} />
        </label>}
        {err && <p role="alert" className="alert"><span aria-hidden="true">⚠</span> {err}</p>}
      </div>
      <div className="bottom">
        {joining
          ? <button className="btn" disabled={busy || !name.trim() || code.length < 6} onClick={() => go(() => net.join(code, name.trim(), inviteSecret || undefined))}>{busy ? 'Joining…' : 'Join room'}</button>
          : <button className="btn" disabled={busy || !name.trim()} onClick={() => go(() => net.create(name.trim()))}>{busy ? 'Creating…' : 'Start a room'}</button>}
        <button className="btn ghost" onClick={() => { setJoining(!joining); setErr(''); }}>{joining ? 'Start my own room instead' : 'I have a code'}</button>
      </div>
    </main>
  );
}

/* ---------------- in a room ---------------- */
interface RoomProps {
  view: View; theme: { mode: Mode; cardHue: number; chromeHue: number; cardVibe?: VibeId; myVibe: VibeId; partnerVibe: VibeId | null }; myVibe: VibeId; pickVibe: (v: VibeId) => void;
  pref: ModePref; setPref: (p: ModePref) => void; react: (r: string) => void; toast: (s: string) => void; online: boolean;
}

function Room(p: RoomProps) {
  const { view } = p;
  const partner = view.names[view.me === 0 ? 1 : 0];
  const [menu, setMenu] = useState(false);
  const nightOn = view.phase === 'arrive' || view.phase === 'card' || view.phase === 'close';
  const musicLevel = view.session?.card?.kind === 'card' ? view.session.card.level : view.session?.tonight ?? view.arrive?.tonight ?? 1;
  useEffect(() => {
    if ((view.music === 'me' || view.music === 'both') && nightOn && !view.paused) startMusic(musicLevel); else stopMusic();
  }, [view.music, nightOn, view.paused, musicLevel]);
  useEffect(() => () => { stopMusic(); stopHeartbeat(); }, []);
  let body: JSX.Element;
  switch (view.phase) {
    case 'lobby': body = <Lobby view={view} />; break;
    case 'home': body = <Home {...p} />; break;
    case 'unlock': body = <Unlock {...p} partner={partner} />; break;
    case 'ceiling': body = <Ceiling {...p} partner={partner} />; break;
    case 'arrive': body = <Arrive {...p} partner={partner} />; break;
    case 'card': body = <Play {...p} partner={partner} />; break;
    case 'close': body = <Close {...p} partner={partner} />; break;
  }
  return (
    <main className="app">
      <div className="top">
        <div className="who">
          <Avatar name={view.bothJoined ? partner : '·'} online={view.bothJoined ? view.partnerConnected : undefined} vibe={p.theme.partnerVibe} mode={p.theme.mode} who="partner" />
          <span>{view.bothJoined ? (view.partnerConnected ? `With ${partner}` : `${partner}’s phone is asleep`) : 'Waiting for your partner'}</span>
          {view.bothJoined && p.theme.partnerVibe && <span className="pglyph" style={{ color: chipColor(p.theme.partnerVibe, p.theme.mode, 'partner') }} title={VIBES[p.theme.partnerVibe].name}>{VIBES[p.theme.partnerVibe].glyph}<span className="sr-only">{partner} picked {VIBES[p.theme.partnerVibe].name}</span></span>}
        </div>
        <button className="iconbtn" aria-label="Settings" onClick={() => setMenu(true)}><Icon d={I.menu} /></button>
      </div>
      {!p.online && <div className="banner" role="status"><Waiting>Reconnecting</Waiting></div>}
      {body}
      {view.paused && <PauseOverlay />}
      {view.dark && <button className="dark" onClick={() => net.act({ a: 'dark', on: false })}>The app is quiet. Tap to come back.</button>}
      {menu && <Menu {...p} partner={partner} close={() => setMenu(false)} />}
    </main>
  );
}

function Menu(p: RoomProps & { close: () => void; partner: string }) {
  const [sure, setSure] = useState(false);
  const [how, setHow] = useState(false);
  const [plain, setPlain] = useState(store.get(keys.plain) === '1');
  if (how) return <Intro inline onDone={() => setHow(false)} />;
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Settings" onClick={e => { if (e.target === e.currentTarget) p.close(); }}>
      <div className="panel">
        <div className="top"><h3>Settings</h3><button className="iconbtn" aria-label="Close" onClick={p.close}><Icon d={I.close} /></button></div>
        <div className="stack">
          <p className="eyebrow">Your colour</p>
          <div className="vibes">{VIBE_IDS.map(v => <VibeBtn key={v} v={v} on={p.myVibe === v} mode={p.theme.mode} onClick={() => p.pickVibe(v)} />)}</div>
          <p className="eyebrow">Light or dark</p>
          <div className="seg">{(['auto', 'light', 'dark'] as ModePref[]).map(m => <button key={m} className="ctrl small" aria-pressed={p.pref === m} onClick={() => p.setPref(m)}>{m === 'auto' ? 'Match phone' : m === 'light' ? 'Light' : 'Dark'}</button>)}</div>
          <p className="eyebrow">Sound and touch</p>
          <MoodControls view={p.view} partner={p.partner} full />
          <ProgressSettings toast={p.toast} />
          <PassSettings view={p.view} toast={p.toast} />
          <ShopSettings />
          <p className="eyebrow">Help</p>
          <div className="row">
            <button className="ctrl" onClick={() => setHow(true)}>How to play</button>
            <button className="ctrl" onClick={() => { resetTips(); p.toast('Tips will show again'); }}>Show tips again</button>
          </div>
          <button className="ctrl" aria-pressed={plain} onClick={() => { const n = !plain; setPlain(n); store.set(keys.plain, n ? '1' : '0'); document.documentElement.classList.toggle('plain', n); }}>Larger text, plain cards {plain ? 'on' : 'off'}</button>
        </div>
        {sure
          ? <div className="row"><button className="ctrl" onClick={() => { net.forget(); p.close(); }}>Leave room</button><button className="ctrl" onClick={() => setSure(false)}>Stay</button></div>
          : <button className="btn ghost" onClick={() => setSure(true)}>Leave this room</button>}
      </div>
    </div>
  );
}

function VibeBtn({ v, on, mode, onClick, marks }: { v: VibeId; on: boolean; mode: Mode; onClick: () => void; marks?: string[] }) {
  const c5 = cardColors(6, VIBES[v].hue, mode, v), c3 = cardColors(7, VIBES[v].hue, 'light', v);
  return (
    <button className="vibe" aria-pressed={on} onClick={onClick} style={{ background: `linear-gradient(135deg, ${c5.field}, ${c3.field})` }}>
      {marks && marks.length > 0 && <span className="marks">{marks.map((mk, i) => <span key={i}>{mk}</span>)}</span>}
      <b><span className="glyph" aria-hidden="true">{VIBES[v].glyph}</span> {VIBES[v].name}</b><small>{VIBES[v].reads}</small>
    </button>
  );
}

function Lobby({ view }: { view: View }) {
  const secret = net.saved?.secret;
  const link = `${location.origin}/play?j=${view.code}${secret ? '.' + secret : ''}`;
  const [qr, setQr] = useState('');
  const [copied, setCopied] = useState(false);
  useEffect(() => { QRCode.toDataURL(link, { margin: 0, width: 320, color: { dark: '#1b0b0e', light: '#ffffff' } }).then(setQr).catch(() => {}); }, [link]);
  const share = async () => {
    try { if (navigator.share) { await navigator.share({ title: 'Tandem After Dark', text: 'Join me tonight', url: link }); return; } } catch { /* cancelled */ }
    try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* copy blocked */ }
  };
  return (
    <>
      <div className="stack"><p className="eyebrow">Invite your partner</p><h2>Scan, tap the link, or type the code</h2></div>
      <div className="panel center">
        {qr ? <img className="qr" src={qr} alt="QR code that opens the invite link" /> : <div className="qr" />}
        <p className="codebig" aria-label={'Room code ' + view.code.split('').join(' ')}>{view.code}</p>
        <p className="tiny muted">The typed code works for 15 minutes. The link and QR code keep working until your partner joins.</p>
      </div>
      <div className="bottom">
        <div className="center" style={{ display: 'flex', justifyContent: 'center' }}><Waiting>Waiting for your partner to join</Waiting></div>
        <button className="btn" onClick={share}><Icon d={I.share} /> {copied ? 'Link copied' : 'Send the invite link'}</button>
      </div>
    </>
  );
}

function Home(p: RoomProps) {
  const { view } = p;
  const open = new Set(view.unlocked);
  return (
    <>
      <div className="stack">
        <p className="eyebrow">{view.sessions ? `${view.sessions} ${view.sessions === 1 ? 'night' : 'nights'} together` : 'Your first night'}</p>
        <h1>Tonight</h1>
      </div>
      <Tip id="home">Tap “Start tonight’s session” to begin. Curious about a locked level? Tap it to peek at sample cards, then each of you answers privately.</Tip>
      <button className="btn" onClick={() => { cue('tap'); net.act({ a: 'tonight' }); }}>Start tonight’s session</button>
      <div className="stack">
        <div><h3>The map</h3><p className="tiny muted">Tap a level to play up to it. Locked levels open when you both say you’re curious.</p></div>
        <div className="map">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(l => {
            const isOpen = open.has(l);
            const st = cardColors(l, p.theme.cardHue, p.theme.mode, p.theme.cardVibe);
            return (
              <button key={l} className={'tile' + (isOpen ? '' : ' locked')} style={{ ['--field' as string]: st.field, ['--ink' as string]: st.ink, ['--motif' as string]: st.motif }}
                onClick={() => { cue('tap'); net.act(isOpen ? { a: 'tonight', l } : { a: 'unlock:open', l }); }}
                aria-label={`${l}, ${levelName(l)}, ${isOpen ? 'open. Tap to play tonight, up to this level' : 'locked. Tap to see sample cards'}`}>
                <MiniArt level={l} hue={p.theme.cardHue} vibe={p.theme.cardVibe} mode={p.theme.mode} seed={'tile' + l} />
                {!isOpen && <span className="lock chip"><Icon d={I.lock} size={14} /> Curious?</span>}
                <span className="lbl"><b><LevelGlyph level={l} /> {l} · {levelName(l)}</b></span>
              </button>
            );
          })}
        </div>
      </div>
      <InstallPrompt sessions={view.sessions} />
      <PassPanel view={view} />
      <ShopLinks kind="toybox" items={KIT_IDS} />
    </>
  );
}

function Unlock(p: RoomProps & { partner: string }) {
  const u = p.view.unlock!;
  if (u.opened) return (
    <>
      <div className="grow" />
      <div className="stack center"><p className="eyebrow">You both chose it</p><h1>{levelName(u.l)} is open</h1><p className="muted">Find it on the map and in tonight’s choices.</p></div>
      <div className="grow" />
      <button className="btn" onClick={() => net.act({ a: 'home' })}>Back to the map</button>
    </>
  );
  return (
    <>
      <div className="stack"><p className="eyebrow">Peek at level {u.l}</p><h2>{levelName(u.l)}</h2><p className="muted">Three sample cards. You both see these.</p></div>
      <div className="stack">
        {u.samples.map((c, i) => {
          const st = cardColors(u.l, p.theme.cardHue, p.theme.mode, p.theme.cardVibe);
          return (
            <m.div key={c.id} className="panel" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .07 }} style={{ background: st.field, color: st.ink, borderColor: 'transparent' }}>
              <p className="prompt l" style={{ fontSize: '1.05rem' }}>{c.text}</p>
            </m.div>
          );
        })}
      </div>
      <div className="bottom panel">
        <p className="eyebrow">Private. Only on your phone.</p>
        {u.myVote === null ? (
          <>
            <p>Curious about {levelName(u.l)}? {p.partner} won’t see your answer.</p>
            <div className="row">
              <button className="ctrl" onClick={() => { cue('tap'); net.act({ a: 'unlock:vote', yes: true }); }}>I’m curious</button>
              <button className="ctrl" onClick={() => { cue('tap'); net.act({ a: 'unlock:vote', yes: false }); }}>Not now</button>
            </div>
          </>
        ) : (
          <>
            <p>Thanks. If you both choose {levelName(u.l)}, it opens, tonight or on another night.</p>
            <button className="btn ghost" onClick={() => net.act({ a: 'home' })}>Back to the map</button>
          </>
        )}
      </div>
    </>
  );
}

function Ceiling(p: RoomProps & { partner: string }) {
  const c = p.view.ceiling!;
  const pick = c.myPick;
  if (c.meDone) return (
    <>
      <div className="grow" />
      <div className="stack center"><p className="eyebrow">Locked in</p><h2>Your choice is private</h2>
        {c.partnerDone ? <p className="muted">Starting…</p> : <Waiting>Waiting for {p.partner}</Waiting>}</div>
      <div className="grow" />
    </>
  );
  return (
    <>
      <div className="stack"><p className="eyebrow">Private. Only on your phone.</p><h2>How far tonight?</h2>
        <p className="muted">{c.partnerDone ? `${p.partner} has chosen. ` : ''}Tonight plays at the lower of your two choices. {p.partner} never sees yours.</p></div>
      <div className="choices">
        {p.view.unlocked.map(l => {
          const st = cardColors(l, p.theme.cardHue, p.theme.mode, p.theme.cardVibe);
          return (
            <button key={l} className="choice" aria-pressed={pick === l} onClick={() => { cue('tap'); net.act({ a: 'ceiling:pick', l }); }}>
              <span className="swatch" style={{ background: st.field, color: st.motif }}><MiniArt level={l} hue={p.theme.cardHue} vibe={p.theme.cardVibe} mode={p.theme.mode} seed={'sw' + l} /></span>
              <span style={{ flex: 1 }}><b>{l} · {levelName(l)}</b></span>
              <LevelGlyph level={l} size={16} />
            </button>
          );
        })}
      </div>
      {pick && pick >= 7 && (
        <button className="ctrl" aria-pressed={c.myConfirm} onClick={() => net.act({ a: 'ceiling:confirm', on: !c.myConfirm })}>
          {c.myConfirm ? '✓ ' : ''}I’m clear-headed and want this tonight
        </button>
      )}
      <div className="bottom">
        <button className="btn" disabled={!pick || (pick >= 7 && !c.myConfirm)} onClick={() => { cue('ready'); net.act({ a: 'ceiling:done' }); }}>Lock in my choice</button>
        <button className="btn ghost" onClick={() => net.act({ a: 'home' })}>Back</button>
      </div>
    </>
  );
}

function Arrive(p: RoomProps & { partner: string }) {
  const a = p.view.arrive!;
  const meI = p.view.names[p.view.me][0] || 'Y', themI = p.partner[0] || 'P';
  const onDone = useCallback(() => { cue('reveal'); }, []);
  return (
    <>
      <div className="stack"><p className="eyebrow">Tonight</p><h1>{levelName(a.tonight)}</h1></div>
      <Tip id="arrive">Say where you are, pick a colour and a length, then both tap “I’m ready”. The first card appears on both phones at the same moment.</Tip>
      <div className="stack">
        <h3>Where are you tonight?</h3>
        <div className="seg two">
          <button className="ctrl" aria-pressed={!p.view.apart} onClick={() => { cue('tap'); net.act({ a: 'apart', on: false }); }}>Same room</button>
          <button className="ctrl" aria-pressed={p.view.apart} onClick={() => { cue('tap'); net.act({ a: 'apart', on: true }); }}>Apart, on a call</button>
        </div>
        {p.view.apart && <div className="panel apart-help">
          <p><b>Start your video call first</b>, then come back here. On iPhone, FaceTime shrinks to a small window when you switch apps. On Android, use split screen.</p>
          <p className="tiny muted">Apart, the game skips hands-on cards and keeps the ones that work over video. Hold “touch” on a card to send a soft pulse, if {p.partner} allows it.</p>
        </div>}
      </div>
      <div className="stack">
        <h3>Pick your colour for tonight</h3>
        <div className="vibes">
          {VIBE_IDS.map(v => <VibeBtn key={v} v={v} mode={p.theme.mode} on={a.myVibe === v} onClick={() => { cue('tap'); p.pickVibe(v); }}
            marks={[...(a.myVibe === v ? [meI.toUpperCase()] : []), ...(a.partnerVibe === v ? [themI.toUpperCase()] : [])]} />)}
        </div>
      </div>
      <div className="stack">
        <h3>How long?</h3>
        <div className="seg two">
          {([['low', 'Short', '12 cards'], ['mid', 'Full', '16 cards']] as const).map(([k, t, n]) =>
            <button key={k} className="ctrl" aria-pressed={a.energy === k || (k === 'mid' && a.energy === 'high')} onClick={() => net.act({ a: 'energy', v: k })} style={{ flexDirection: 'column', gap: 0 }}><span>{t}</span><span className="tiny" style={{ fontWeight: 500 }}>{n}</span></button>)}
        </div>
      </div>
      <div className="stack">
        <h3>Set the mood</h3>
        <MoodControls view={p.view} partner={p.partner} />
      </div>
      {a.memory && <div className="panel"><p className="eyebrow">A memory you kept</p><p>{a.memory}</p></div>}
      <div className="bottom">
        {a.myReady
          ? <div className="center" style={{ display: 'flex', justifyContent: 'center', minHeight: 52, alignItems: 'center' }}>{a.partnerReady ? <span className="muted">Here we go</span> : <Waiting>Waiting for {p.partner}</Waiting>}</div>
          : <button className="btn" onClick={() => { cue('ready'); net.act({ a: 'ready' }); }}>{a.partnerReady ? `${p.partner} is ready. Begin` : 'I’m ready'}</button>}
      </div>
      <Countdown at={a.countdownAt} onDone={onDone} />
    </>
  );
}

function Play(p: RoomProps & { partner: string }) {
  const s = p.view.session!;
  const cv = s.card!;
  const arriveAt = p.view.arrive?.countdownAt ?? null;
  const pre = useCountdown(arriveAt);
  const kept = cv.kind === 'card' && cv.card ? s.keptIds.includes(cv.card.id) : false;
  const next = () => { cue('tap'); net.act({ a: 'next', seq: cv.seq }); }; // Pass and Next feel identical
  const level = cv.kind === 'card' ? cv.level : s.tonight;
  const showDark = cv.kind === 'card' && cv.card && cv.card.l === 8 && ['Whisper', 'Chain', 'Choose'].includes(cv.card.type);
  const [mysteryShown, setMysteryShown] = useState(false);
  const eyesUp = useEyesUp(cv.seq);
  const [chatOpen, setChatOpen] = useState(false);
  useEffect(() => { if (cv.kind === 'card' && cv.mystery && cv.flipped && !mysteryShown) setMysteryShown(true); }, [cv, mysteryShown]);
  const glow = useRevealCue(cv, p.view.me);

  let main: JSX.Element, actions: JSX.Element;
  const tip = cv.kind === 'twist' ? <Tip id="twist">A wildcard changes the pace for a moment. Do it together, or pass.</Tip>
    : cv.mystery && !cv.flipped ? <Tip id="mystery">This card is face down. It turns over when you both tap Flip.</Tip>
    : cv.gate ? <Tip id="gate">Answer on your own phone. If either of you says “not tonight”, the card quietly changes. Nobody sees who said what.</Tip>
    : p.view.apart ? <Tip id="card-apart">You’re apart: read the card out loud on your call. Either of you taps Next when you’re done talking.</Tip>
    : <Tip id="card">Read it out loud and talk it through. When you’re ready, either of you taps Next. Pass works exactly the same way.</Tip>;
  if (cv.kind === 'twist') {
    main = <PlayCard dealKey={cv.seq} level={level} hue={p.theme.cardHue} vibe={p.theme.cardVibe} mode={p.theme.mode} card={null} seed={'tw' + cv.seq} text={cap(cv.text.replace(/^Twist:\s*/, ''))} type="Twist" title="Wildcard" special="holo" />;
    actions = <PassNext onPass={next} onNext={next} nextLabel="Done" />;
  } else if (cv.mystery && !cv.flipped) {
    main = <PlayCard dealKey={cv.seq} level={level} hue={p.theme.cardHue} vibe={p.theme.cardVibe} mode={p.theme.mode} card={null} seed={'my' + cv.seq} faceDown special="gold"
      backLabel={<><b>Mystery card</b><span className="tiny">Flip it together</span></>} />;
    actions = cv.myFlip
      ? <div className="center" style={{ display: 'flex', justifyContent: 'center', minHeight: 52, alignItems: 'center' }}><Waiting>Waiting for {p.partner} to flip</Waiting></div>
      : <button className="btn" onClick={() => { cue('flip'); net.act({ a: 'flip', seq: cv.seq }); }}>{cv.partnerFlip ? `${p.partner} is ready. Flip it` : 'Flip it'}</button>;
  } else if (cv.gate) {
    main = <PlayCard dealKey={cv.seq} level={level} hue={p.theme.cardHue} vibe={p.theme.cardVibe} mode={p.theme.mode} card={null} seed={'g' + cv.seq} faceDown
      backLabel={<><b>{cv.gate.teaser}</b><span className="tiny">Answer privately on your phone</span></>} />;
    actions = cv.gate.myVote
      ? <div className="panel center"><p className="eyebrow">Locked in</p>{cv.gate.partnerVoted ? <p className="muted">Revealing…</p> : <Waiting>Waiting for {p.partner}</Waiting>}</div>
      : <div className="panel"><p className="eyebrow">Private. {p.partner} won’t see this.</p><p>Are you open to it tonight?</p>
        <div className="row">{(['y', 'm', 'n'] as const).map(v => <button key={v} className="ctrl" onClick={() => { cue('tap'); net.act({ a: 'gate', seq: cv.seq, v }); }}>{v === 'y' ? 'Yes' : v === 'm' ? 'Maybe' : 'Not tonight'}</button>)}</div></div>;
  } else {
    const c = cv.card!;
    main = <PlayCard dealKey={cv.seq} level={c.l} hue={p.theme.cardHue} vibe={p.theme.cardVibe} mode={p.theme.mode} card={c} seed={c.id} special={cv.mystery ? 'gold' : undefined} />;
    actions = (
      <>
        {c.t > 0 && <TimerRow endsAt={cv.timerEndsAt} secs={c.t} onStart={() => net.act({ a: 'timer', seq: cv.seq })} />}
        <PassNext onPass={next} onNext={next} />
        <div className="row">
          <button className="ctrl small" aria-pressed={kept} onClick={() => { cue('tap'); net.act({ a: 'keep', seq: cv.seq }); }}><Icon d={I.star} size={16} /> {kept ? 'Kept' : 'Keep this one'}</button>
          {!p.view.apart && <AnswerButton view={p.view} onOpen={() => setChatOpen(true)} />}
          {showDark && <button className="ctrl small" onClick={() => net.act({ a: 'dark', on: true })}><Icon d={I.moon} size={16} /> Go dark</button>}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="stack" style={{ gap: 8 }}>
        <div className="prog" role="progressbar" aria-label={`Card ${Math.min(s.idx + 1, s.N)} of ${s.N}`} aria-valuenow={Math.min(s.idx + 1, s.N)} aria-valuemin={1} aria-valuemax={s.N}><i style={{ width: `${Math.round((s.idx / s.N) * 100)}%` }} /></div>
      </div>
      {tip}
      <div className={'grow cardstage' + (glow ? ' glow' : '')} key={'g' + glow} style={{ display: 'grid', placeItems: 'center' }}>{pre > 0 ? null : main}</div>
      <div className={'bottom' + (eyesUp ? ' eyes-up' : '')}>
        {actions}
        <div className="row night">
          <button className="ctrl small" onClick={() => net.act({ a: 'pause' })}><Icon d={I.pause} size={16} /> Pause</button>
          <button className="ctrl small" onClick={() => { net.act({ a: 'softer' }); p.toast('Softer from here'); }}><Icon d={I.softer} size={16} /> Softer</button>
          {p.view.partnerAllowsTouch && <SendTouch partner={p.partner} />}
        </div>
        <div className="reacts" aria-label="Send a reaction">{REACTIONS.map(r => <button key={r} aria-label={'Send ' + r} onClick={() => p.react(r)}>{r}</button>)}</div>
      </div>
      {p.view.apart && cv.kind === 'card' && !cv.gate && (!cv.mystery || cv.flipped) && <ChatPanel view={p.view} partner={p.partner} compact onExpand={() => setChatOpen(true)} />}
      {chatOpen && <ChatSheet view={p.view} partner={p.partner} close={() => setChatOpen(false)} />}
      <Countdown at={arriveAt} />
    </>
  );
}

/* ---------------- answers and messages ----------------
   Seal an answer to open both together once you've both answered, or just send a message. Memory only on the server,
   gone when the night ends. In the same room it sits behind a button so the phone can step back; apart, it's inline. */
function useChatCues(view: View, on = true) {
  const last = useRef(view.chat.length ? view.chat[view.chat.length - 1].id : 0);
  const [unread, setUnread] = useState(0);
  useEffect(() => {
    const fresh = view.chat.filter(m => m.id > last.current);
    if (!fresh.length) return;
    last.current = fresh[fresh.length - 1].id;
    if (!on) return;
    if (fresh.some(m => m.sealed)) cue('reveal');
    else if (fresh.some(m => !m.mine)) cue('ready');
    setUnread(n => n + fresh.filter(m => !m.mine || m.sealed).length);
  }, [view.chat, on]);
  return [unread, () => setUnread(0)] as const;
}

function AnswerButton({ view, onOpen }: { view: View; onOpen: () => void }) {
  const [unread, clear] = useChatCues(view);
  const waiting = view.sealed?.partnerSealed && !view.sealed.mine;
  return (
    <button className="ctrl small" onClick={() => { clear(); onOpen(); }} aria-label={`Answer${unread ? `, ${unread} new` : ''}`}>
      <span aria-hidden="true">💬</span> Answer{unread > 0 && <b className="badge">{unread}</b>}{waiting && <b className="badge dot" aria-hidden="true" />}
    </button>
  );
}

function ChatSheet({ view, partner, close }: { view: View; partner: string; close: () => void }) {
  return (
    <div className="overlay sheet" role="dialog" aria-modal="true" aria-label="Answers and messages" onClick={e => { if (e.target === e.currentTarget) close(); }}>
      <div className="panel">
        <div className="top"><h3>Answers</h3><button className="iconbtn" aria-label="Close" onClick={close}><Icon d={I.close} /></button></div>
        <ChatPanel view={view} partner={partner} autoFocus />
      </div>
    </div>
  );
}

function ChatPanel({ view, partner, compact, autoFocus, onExpand, readOnly }: { view: View; partner: string; compact?: boolean; autoFocus?: boolean; onExpand?: () => void; readOnly?: boolean }) {
  const card = view.session?.card;
  const seq = view.phase === 'card' && card ? card.seq : null;
  const [text, setText] = useState('');
  const [seal, setSeal] = useState(true);
  const list = useRef<HTMLDivElement>(null);
  const sl = view.sealed && view.sealed.seq === seq ? view.sealed : null;
  const canSeal = seq !== null && !sl?.mine;
  const shown = compact ? view.chat.filter(m => m.seq === seq).slice(-3) : view.chat;
  useEffect(() => { list.current?.scrollTo({ top: list.current.scrollHeight }); }, [view.chat.length]);
  useChatCues(view, !!compact); // apart, the inline panel plays the cues (there is no Answer button)
  const send = () => {
    const t = text.trim(); if (!t) return;
    cue('tap');
    net.act({ a: 'chat', text: t, seal: seal && canSeal });
    setText('');
  };
  return (
    <div className={'chat' + (compact ? ' compact' : '')}>
      {shown.length > 0 && <div className="msgs" ref={list} aria-live="polite">
        {shown.map((m, i) => (
          <div key={m.id} className={'msg' + (m.mine ? ' mine' : '')}>
            {!compact && !readOnly && m.seq !== null && (i === 0 || shown[i - 1].seq !== m.seq) && <span className="msg-card">{m.seq === seq ? 'On this card' : 'Earlier card'}</span>}
            <p>{m.sealed && <span className="seal-mark" title="Opened together">✉︎ </span>}{m.text}</p>
          </div>
        ))}
      </div>}
      {sl && (sl.mine
        ? <p className="tiny muted">{sl.partnerSealed ? 'Opening…' : <>Your answer is sealed. It opens when {partner} answers too.</>}</p>
        : sl.partnerSealed && <p className="tiny"><b>{partner} has answered.</b> Write yours to open both.</p>)}
      {!readOnly && <><div className="composer">
        <textarea rows={compact ? 1 : 2} maxLength={500} value={text} autoFocus={autoFocus} placeholder={seal && canSeal ? 'Your answer…' : 'Message…'}
          aria-label="Your answer or message" onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} />
        <button className="ctrl" disabled={!text.trim()} onClick={send}>{seal && canSeal ? 'Seal' : 'Send'}</button>
      </div>
      <div className="chat-foot">
        {seq !== null && <label className="seal-toggle"><input type="checkbox" checked={seal} disabled={!canSeal} onChange={e => setSeal(e.target.checked)} /> Seal until we've both answered</label>}
        {compact && onExpand && <button className="linkbtn" onClick={onExpand}>All messages</button>}
      </div></>}
    </div>
  );
}

/** Pass and Next are the same control in every way: size, colour, weight and position (Pass left, Next right). */
function PassNext({ onPass, onNext, nextLabel = 'Next' }: { onPass: () => void; onNext: () => void; nextLabel?: string }) {
  return <div className="row pair"><button className="ctrl" onClick={onPass}>Pass</button><button className="ctrl" onClick={onNext}>{nextLabel}</button></div>;
}

/** Sound, vibration and a soft glow when a card face appears. Private-vote reveals always play the same two-phone
 *  chord, whether the card was kept or quietly swapped, so the sound never gives an answer away. Returns a glow key. */
function useRevealCue(cv: NonNullable<NonNullable<View['session']>['card']>, me: 0 | 1) {
  const prev = useRef<{ seq: number; hidden: boolean; gated: boolean } | null>(null);
  const [glow, setGlow] = useState(0);
  const hidden = cv.kind === 'card' && (!!cv.gate || (cv.mystery && !cv.flipped));
  const gated = cv.kind === 'card' && !!cv.gate;
  useEffect(() => {
    const was = prev.current;
    prev.current = { seq: cv.seq, hidden, gated };
    if (hidden) return;
    if (!was || was.seq !== cv.seq) { cue('flip'); setGlow(g => g + 1); }
    else if (was.hidden) { cue(was.gated ? 'yes' : 'reveal', me); setGlow(g => g + 1); }
  }, [cv.seq, hidden, gated, me]);
  return glow;
}

/** Hold to send a soft pulse to your partner's phone, once a second, for up to 15 seconds. Only shown when they allow it. */
function SendTouch({ partner }: { partner: string }) {
  const [on, setOn] = useState(false);
  const t = useRef<{ iv: number; stop: number } | null>(null);
  const end = () => { if (t.current) { clearInterval(t.current.iv); clearTimeout(t.current.stop); t.current = null; } setOn(false); };
  const start = (e: React.PointerEvent) => {
    e.preventDefault(); end(); setOn(true);
    net.touch(); cue('touch');
    t.current = { iv: window.setInterval(() => net.touch(), 1000), stop: window.setTimeout(end, 15000) };
  };
  useEffect(() => end, []);
  return (
    <button className={'ctrl small touchbtn' + (on ? ' on' : '')} onPointerDown={start} onPointerUp={end} onPointerLeave={end} onPointerCancel={end}
      onContextMenu={e => e.preventDefault()} aria-label={`Hold to send ${partner} a touch`}>
      <span aria-hidden="true">♡</span> {on ? 'Sending…' : 'Hold: touch'}
    </button>
  );
}

/** What the receiver sees (every phone, including iPhone): a slow ring and a quiet line. */
function TouchPulse({ name }: { name: string }) {
  const [show, setShow] = useState(true);
  useEffect(() => { const id = setTimeout(() => setShow(false), 1600); return () => clearTimeout(id); }, []);
  if (!show) return null;
  return <div className="touchpulse" role="status"><span className="ring" aria-hidden="true" /><span className="lbl">{name ? `${name} sent a touch` : 'A touch'}</span></div>;
}

/** End of night: each partner privately opts in to a share card. It appears only if both said yes. */
function ShareOffer({ view, theme, toast }: { view: View; theme: RoomProps['theme']; toast: (s: string) => void }) {
  const c = view.close!;
  const card = c.shareCard;
  const [url, setUrl] = useState<string | null>(null);
  const blob = useRef<Blob | null>(null);
  useEffect(() => {
    if (!card) { setUrl(null); return; }
    let live = true, made = '';
    drawShareCard({ question: card.question, nights: card.nights, vibes: [theme.myVibe, theme.partnerVibe ?? theme.myVibe], host: location.host })
      .then(b => { if (!live) return; blob.current = b; made = URL.createObjectURL(b); setUrl(made); })
      .catch(() => {});
    return () => { live = false; if (made) URL.revokeObjectURL(made); };
  }, [card?.question, card?.nights, theme.myVibe, theme.partnerVibe]);
  if (!card) return (
    <div className="panel share">
      <p className="eyebrow">Share a card? · optional</p>
      <p>One question from tonight and your night count. No names.</p>
      <button className="ctrl" aria-pressed={c.myShare} onClick={() => { cue('tap'); net.act({ a: 'share', on: !c.myShare }); }}>
        {c.myShare ? '✓ I’m happy to share' : 'I’d be happy to share a card'}
      </button>
      <p className="tiny muted">{c.myShare ? 'If you both say yes, it appears here. If not, nothing happens and nobody sees who said no.' : 'It only appears if you both say yes, privately on your own phones.'}</p>
    </div>
  );
  return (
    <div className="panel share">
      <p className="eyebrow">You both said yes</p>
      {url ? <img className="share-img" src={url} alt={`Share card: “${card.question}”`} /> : <Waiting>Making your card</Waiting>}
      <div className="row">
        <button className="ctrl" disabled={!url} onClick={async () => { if (!blob.current) return; const r = await shareImage(blob.current); if (r === 'saved') toast('Saved to your downloads'); }}>Share</button>
        <button className="ctrl" onClick={() => net.act({ a: 'share', on: false })}>Not now</button>
      </div>
      <p className="tiny muted">Either of you can tap Not now to take it away for both of you.</p>
    </div>
  );
}

/** After a couple's second night, once: why adding the game to the home screen keeps progress safe. */
function InstallPrompt({ sessions }: { sessions: number }) {
  const standalone = typeof matchMedia !== 'undefined' && (matchMedia('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true);
  const [hidden, setHidden] = useState(() => standalone || store.get('tad.a2hs') === 'no');
  if (hidden || sessions < 2) return null;
  const ios = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const deferred = (window as unknown as { __tadInstall?: Event & { prompt: () => Promise<void> } }).__tadInstall;
  const close = () => { store.set('tad.a2hs', 'no'); setHidden(true); };
  return (
    <div className="panel install">
      <p className="eyebrow">Keep your progress safe</p>
      <p>Add the game to your home screen. It opens like an app, and {ios ? 'iPhone keeps your progress instead of clearing it after a quiet week' : 'your progress stays put'}.</p>
      {deferred
        ? <button className="btn" onClick={async () => { try { await deferred.prompt(); } catch { /* dismissed */ } close(); }}>Add to home screen</button>
        : <p className="tiny">{ios ? <>In Safari, tap <b>Share</b> (the square with an arrow), then <b>Add to Home Screen</b>.</> : <>Open your browser menu (<b>⋮</b>) and choose <b>Add to Home screen</b> or <b>Install app</b>.</>}</p>}
      <button className="linkbtn" onClick={close}>No thanks</button>
    </div>
  );
}

/** Settings: where progress lives, plus back up and restore. */
function ProgressSettings({ toast }: { toast: (s: string) => void }) {
  const [code, setCode] = useState<string | null>(null);
  const [qr, setQr] = useState('');
  const [restoring, setRestoring] = useState(false);
  const [entry, setEntry] = useState('');
  const [err, setErr] = useState('');
  const backup = async () => {
    setErr('');
    try {
      const c = await makeBackup(loadProgress()); setCode(c);
      const link = `${location.origin}/play#backup=${encodeURIComponent(c)}`;
      if (link.length <= 2300) QRCode.toDataURL(link, { margin: 1, width: 360, errorCorrectionLevel: 'L', color: { dark: '#1b0b0e', light: '#ffffff' } }).then(setQr).catch(() => setQr(''));
      else setQr('');
    } catch { setErr('This browser can’t make a backup code. Try Chrome or Safari.'); }
  };
  const save = () => { if (!code) return; const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([code], { type: 'text/plain' })); a.download = 'tandem-backup.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); };
  return (
    <div className="stack">
      <p className="eyebrow">Your progress</p>
      <p className="tiny muted">Your progress lives on your two phones, not on our server. Each game merges both copies, so it’s only lost if both phones lose it. To be safe, add the game to your home screen or keep a backup code.</p>
      {!code
        ? <div className="row"><button className="ctrl" onClick={backup}>Back up our progress</button><button className="ctrl" onClick={() => setRestoring(r => !r)}>Restore a backup</button></div>
        : <>
          {qr && <img className="qr" src={qr} alt="Backup QR code: scan it with the new phone's camera" />}
          <textarea className="passcode" readOnly value={code} rows={3} onFocus={e => e.currentTarget.select()} />
          <div className="row">
            <button className="ctrl" onClick={async () => { try { await navigator.clipboard.writeText(code); toast('Backup code copied'); } catch { /* select the text instead */ } }}>Copy</button>
            <button className="ctrl" onClick={save}>Save as file</button>
          </div>
          <p className="tiny muted">{qr ? 'Scan the QR with the new phone’s camera, or paste the code there under Restore. ' : 'Paste this code on the new phone under Restore. '}It holds levels and cards, never your private “curious” taps. Anyone with the code can restore it, so keep it somewhere private.</p>
        </>}
      {restoring && !code && <>
        <textarea className="passcode" rows={3} placeholder="TADB1.…" value={entry} onChange={e => setEntry(e.target.value)} aria-label="Backup code" spellCheck={false} />
        <button className="ctrl" disabled={entry.trim().length < 20} onClick={async () => { setErr(''); try { net.restoreProgress(mergeBackup(loadProgress(), await readBackup(entry))); setEntry(''); setRestoring(false); toast('Progress restored'); } catch (e) { setErr((e as Error).message); } }}>Restore</button>
      </>}
      {err && <p role="alert" className="alert"><span aria-hidden="true">⚠</span> {err}</p>}
    </div>
  );
}

/** Confirm before merging a backup opened from a scanned QR code. */
function RestoreDialog({ code, done }: { code: string; done: (msg?: string) => void }) {
  const [err, setErr] = useState('');
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Restore progress">
      <div className="panel">
        <h3>Restore your progress?</h3>
        <p className="muted">This adds the levels and cards from your backup to this phone. Nothing on this phone is removed.</p>
        {err && <p role="alert" className="alert"><span aria-hidden="true">⚠</span> {err}</p>}
        <div className="row">
          <button className="ctrl" onClick={() => done()}>Not now</button>
          <button className="ctrl" onClick={async () => { try { net.restoreProgress(mergeBackup(loadProgress(), await readBackup(code))); done('Progress restored'); } catch (e) { setErr((e as Error).message); } }}>Restore</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- shop links (affiliate, clearly labelled, never during a night) ---------------- */
let shopInfo: Promise<{ id: string; paid: boolean }[]> | null = null;
type ShopRetailer = { id: string; paid: boolean };
const enabledRetailers = () => (shopInfo ??= fetch('/api/shop').then(r => r.json())
  .then(j => (Array.isArray(j.retailers) ? (j.retailers as ShopRetailer[]).filter(x => x && typeof x.id === 'string') : [])).catch(() => []));
function useShop(): ShopRetailer[] {
  const [on, setOn] = useState<ShopRetailer[]>([]);
  useEffect(() => {
    let live = true;
    enabledRetailers().then(list => {
      if (!live) return;
      const c = shopCountry();
      setOn(c === 'off' ? [] : retailersFor(c).map(id => list.find(x => x.id === id)).filter((x): x is ShopRetailer => !!x));
    });
    return () => { live = false; };
  }, []);
  return on;
}

/** "Tonight's kit" (after the night, matched to cards you both saw) or the "Toy box" on the map. */
function ShopLinks({ kind, items }: { kind: 'kit' | 'toybox'; items: KitId[] }) {
  const retailers = useShop();
  const [open, setOpen] = useState(kind === 'kit');
  const [hidden, setHidden] = useState(false);
  const list = kind === 'kit' ? items.filter(k => !KIT[k].toyBoxOnly) : items;
  if (hidden || !retailers.length || !list.length) return null;
  const shown = retailers.slice(0, 2);
  const paid = shown.some(r => r.paid);
  const link = (r: ShopRetailer, k?: KitId) => <a key={r.id} className="ctrl small shoplink" href={`/go/${r.id}${k ? '/' + k : ''}`} target="_blank" rel={(r.paid ? 'sponsored ' : '') + 'noopener noreferrer'} referrerPolicy="no-referrer">{RETAILERS[r.id].name} ↗</a>;
  return (
    <div className="panel shop">
      <p className="eyebrow">{paid ? 'Ad · Paid links' : 'Gift ideas'}</p>
      <h3>{kind === 'kit' ? 'For next time' : 'Toy box'}</h3>
      <p className="tiny muted">{paid
        ? 'If you buy through these links, Tandem earns a commission. Your price stays the same. The shop never learns what you played.'
        : 'Shops we like. We don’t earn from these links, and the shop never learns what you played.'}</p>
      {kind === 'toybox' && !open
        ? <button className="ctrl" onClick={() => setOpen(true)}>Open the toy box</button>
        : <ul className="kitlist">{list.map(k => (
          <li key={k}><div><b>{KIT[k].label}</b><span className="tiny muted">{KIT[k].blurb}</span></div><div className="shops">{shown.map(r => link(r, k))}</div></li>
        ))}</ul>}
      <button className="linkbtn" onClick={() => { setShopCountry('off'); setHidden(true); }}>Hide shop suggestions</button>
    </div>
  );
}

/** Settings: shop suggestions on or off, and which country's shops (guessed on the phone, never sent anywhere). */
function ShopSettings() {
  const [, force] = useState(0);
  const c = shopCountry();
  const guess = guessCountry();
  const name = (cc: string | null) => { if (!cc) return 'not sure'; try { return new Intl.DisplayNames(['en'], { type: 'region' }).of(cc) || cc; } catch { return cc; } };
  return (
    <div className="stack">
      <p className="eyebrow">Shop suggestions</p>
      <p className="tiny muted">After a night and on the map, clearly marked as ads. {c === 'off' ? 'Turned off.' : `Shops for ${name(c)}.`} Your country is guessed on this phone from its time zone and is never sent to us.</p>
      <div className="row">
        <button className="ctrl" aria-pressed={c !== 'off'} onClick={() => { setShopCountry(c === 'off' ? 'auto' : 'off'); force(n => n + 1); }}>{c === 'off' ? 'Turn on' : 'Turn off'}</button>
        {c !== 'off' && <select className="ctrl" aria-label="Country for shop suggestions" value={store.get('tad.shop') || 'auto'} onChange={e => { setShopCountry(e.target.value as 'auto'); force(n => n + 1); }}>
          <option value="auto">Auto ({name(guess)})</option>
          {Object.keys(BY_COUNTRY).map(cc => <option key={cc} value={cc}>{name(cc)}</option>)}
        </select>}
      </div>
    </div>
  );
}

/** The Couple Pass offer on the map screen. Never shown during a night, never with pressure. */
function PassPanel({ view }: { view: View }) {
  const [info, setInfo] = useState<{ enabled: boolean; price?: string | null } | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  useEffect(() => { shop.get().then(setInfo); }, []);
  if (view.pass) return <div className="panel pass on"><p className="eyebrow">Couple Pass</p><p>On for both of you: {DECK_IDS.map(d => DECKS[d].name).join(', ')}. The extra cards mix into the levels you play.</p></div>;
  if (!info?.enabled) return null;
  return (
    <div className="panel pass">
      <p className="eyebrow">Couple Pass · optional</p>
      <h3>{PASS_CARD_COUNT} more cards, woven into your levels</h3>
      <ul className="decklist">{DECK_IDS.map(d => <li key={d}><b>{DECKS[d].name}.</b> {DECKS[d].blurb}</li>)}</ul>
      <p className="tiny muted">One payment covers both of you, for good. No subscription. Levels still open only when you both choose them.</p>
      {err && <p role="alert" className="alert"><span aria-hidden="true">⚠</span> {err}</p>}
      <button className="btn" disabled={busy} onClick={async () => { setErr(''); setBusy(true); try { await shop.checkout(); } catch (e) { setErr((e as Error).message); setBusy(false); } }}>
        {busy ? 'Opening checkout…' : `Get the Couple Pass${info.price ? ` · ${info.price}` : ''}`}
      </button>
    </div>
  );
}

/** Menu: show this phone's pass code (to keep or move to a new phone) or restore one. */
function PassSettings({ view, toast }: { view: View; toast: (s: string) => void }) {
  const [codes, setCodes] = useState(loadPasses());
  const [entry, setEntry] = useState('');
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState('');
  return (
    <div className="stack">
      <p className="eyebrow">Couple Pass</p>
      {codes.length > 0 ? <>
        <p className="tiny muted">Your pass code works on any phone. Keep a copy somewhere safe, like your notes or password manager.</p>
        <button className="ctrl" onClick={async () => { try { await navigator.clipboard.writeText(codes[0]); toast('Pass code copied'); } catch { setOpen(true); } }}>Copy my pass code</button>
        {open && <textarea className="passcode" readOnly value={codes[0]} rows={3} onFocus={e => e.currentTarget.select()} />}
      </> : <>
        <p className="tiny muted">{view.pass ? 'The pass is on in this room because your partner has it.' : 'Bought it on another phone? Paste your pass code here.'}</p>
        <div className="row">
          <input type="text" aria-label="Pass code" placeholder="TAD1.…" value={entry} onChange={e => setEntry(e.target.value)} autoComplete="off" spellCheck={false} />
          <button className="ctrl" disabled={entry.trim().length < 20} onClick={async () => { setErr(''); try { await shop.restore(entry); setCodes(loadPasses()); setEntry(''); toast('Couple Pass restored'); } catch (e) { setErr((e as Error).message); } }}>Restore</button>
        </div>
        {err && <p role="alert" className="alert"><span aria-hidden="true">⚠</span> {err}</p>}
      </>}
    </div>
  );
}

// "Bring your own music": search links only, so nothing is licensed or embedded and no account is touched.
const BYO_QUERY = 'slow instrumental r&b lofi';
const BYO = [
  { name: 'Spotify', url: (q: string) => `https://open.spotify.com/search/${encodeURIComponent(q)}/playlists` },
  { name: 'Apple Music', url: (q: string) => `https://music.apple.com/search?term=${encodeURIComponent(q)}` },
  { name: 'YouTube Music', url: (q: string) => `https://music.youtube.com/search?q=${encodeURIComponent(q)}` },
];

/** Sound and touch settings for this phone. Everything starts off. Music plays on one phone only. */
function MoodControls({ view, partner, full }: { view: View; partner: string; full?: boolean }) {
  const [, force] = useState(0); const r = () => force(n => n + 1);
  const sfx = prefs.sfx, quiet = prefs.quiet;
  const mine = view.music === 'me' || view.music === 'both';
  const music = () => {
    if (mine) net.act({ a: 'music', on: false });
    else { unlockAudio(true); net.act({ a: 'music', on: true }); }
  };
  return (
    <div className="stack mood">
      <div className="row">
        <button className="ctrl" aria-pressed={sfx && !quiet} onClick={() => { prefs.sfx = !sfx; if (!sfx) { prefs.quiet = false; unlockAudio(); cue('reveal'); } r(); }}>{sfx && !quiet ? 'Sounds on' : 'Sounds off'}</button>
        <button className="ctrl" aria-pressed={mine} onClick={() => { if (quiet) { prefs.quiet = false; r(); } music(); }}>
          {mine ? 'Music: this phone' : view.music === 'partner' ? (view.apart ? 'Music here too' : 'Play music here') : 'Music off'}
        </button>
      </div>
      {!view.apart && view.music === 'partner' && <p className="tiny muted">Music is playing on {partner}’s phone.</p>}
      {!full && view.apart && <button className="ctrl" aria-pressed={view.meAllowsTouch} onClick={() => net.act({ a: 'touch:allow', on: !view.meAllowsTouch })}>{view.meAllowsTouch ? `${partner} can send you touches` : `Let ${partner} send you touches`}</button>}
      {full && <p className="tiny byo">Prefer your own music? Search{' '}
        {BYO.map((b, i) => <span key={b.name}>{i > 0 && ' · '}<a href={b.url(BYO_QUERY)} target="_blank" rel="noopener noreferrer">{b.name}</a></span>)}
        {' '}for slow, wordless songs.</p>}
      {full && <>
        {canVibrate && <>
          <p className="tiny" style={{ fontWeight: 600 }}>Vibration</p>
          <div className="seg">{(['off', 'subtle', 'normal'] as HapticLevel[]).map(l => <button key={l} className="ctrl small" aria-pressed={prefs.haptics === l} onClick={() => { prefs.haptics = l; r(); cue('tap'); }}>{l === 'off' ? 'Off' : l === 'subtle' ? 'Subtle' : 'Normal'}</button>)}</div>
        </>}
        <button className="ctrl" aria-pressed={prefs.heartbeat} onClick={() => { prefs.heartbeat = !prefs.heartbeat; r(); }}>Calm heartbeat during timers: {prefs.heartbeat ? 'on' : 'off'}</button>
        <button className="ctrl" aria-pressed={view.meAllowsTouch} onClick={() => net.act({ a: 'touch:allow', on: !view.meAllowsTouch })}>{view.meAllowsTouch ? `${partner} can send you touches` : `Let ${partner} send you touches`}</button>
        <p className="tiny muted">{view.partnerAllowsTouch ? `${partner} has touches on: hold “Hold: touch” on a card to send a soft pulse.` : `A touch is a soft pulse on the other phone. ${partner} will see that you’ve turned it on.`}</p>
        <button className="ctrl" aria-pressed={quiet} onClick={() => { prefs.quiet = !quiet; if (!quiet && view.music === 'me') net.act({ a: 'music', on: false }); r(); }}>Quiet mode: {quiet ? 'on (no sound or vibration)' : 'off'}</button>
      </>}
    </div>
  );
}

/** Six quiet seconds after a card appears, the controls dim so you look at each other, not the phone. Any touch restores them. */
function useEyesUp(key: number) {
  const [up, setUp] = useState(false);
  useEffect(() => {
    let t = 0;
    const arm = () => { setUp(false); clearTimeout(t); t = window.setTimeout(() => setUp(true), 6000); };
    arm();
    window.addEventListener('pointerdown', arm);
    window.addEventListener('keydown', arm);
    return () => { clearTimeout(t); window.removeEventListener('pointerdown', arm); window.removeEventListener('keydown', arm); };
  }, [key]);
  return up;
}

function TimerRow({ endsAt, secs, onStart }: { endsAt: number | null; secs: number; onStart: () => void }) {
  const left = useCountdown(endsAt);
  const fmt = (ms: number) => { const t = Math.ceil(ms / 1000); return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'); };
  const done = endsAt !== null && left === 0;
  useEffect(() => { if (done) { cue('done'); stopHeartbeat(); } }, [done]);
  const [beat, setBeat] = useState(false);
  useEffect(() => {
    if (!endsAt || done || !prefs.heartbeat) return;
    setBeat(true); startHeartbeat();
    const id = setTimeout(() => setBeat(false), 15000);
    return () => { clearTimeout(id); stopHeartbeat(); setBeat(false); };
  }, [endsAt, done]);
  if (!endsAt) return <button className="btn ghost" onClick={() => { cue('tap'); onStart(); }}><Icon d={I.timer} /> Start a shared timer · {fmt(secs * 1000)}</button>;
  return <div className={'timer' + (beat ? ' beat' : '')} role="timer" aria-live="polite">{done ? 'Time. Take a breath.' : fmt(left)}</div>;
}

function Close(p: RoomProps & { partner: string }) {
  const c = p.view.close!;
  const left = useCountdown(c.countdownAt);
  const revealed = c.stage === 1 && left === 0;
  const fired = useRef(false);
  useEffect(() => { if (revealed && !fired.current) { fired.current = true; setTimeout(() => confetti(), 150); cue('level'); } }, [revealed]);
  const hue = p.theme.cardHue;
  return (
    <>
      <div className="stack"><p className="eyebrow">{revealed ? 'The envelope' : 'Before you go'}</p><h2>{revealed ? 'For this week' : 'Closing card'}</h2></div>
      {!revealed && <Tip id="close">Read the closing card together. Then open the envelope: it opens when you both tap.</Tip>}
      {!revealed ? (
        <>
          <PlayCard dealKey="closer" level={3} hue={hue} mode={p.theme.mode} card={null} seed="closer" text={c.closer} type="Share" title="Final card" special="gold" />
          <div className="envelope" style={{ ['--env' as string]: cardColors(7, hue, 'dark').field }}><div className="body" /><div className="flap" /><div className="seal">T</div></div>
          <div className="bottom">
            {c.myOpen
              ? <div style={{ display: 'flex', justifyContent: 'center', minHeight: 52, alignItems: 'center' }}>{c.partnerOpen ? <span className="muted">Opening…</span> : <Waiting>Waiting for {p.partner}</Waiting>}</div>
              : <button className="btn" onClick={() => { cue('ready'); net.act({ a: 'open' }); }}>{c.partnerOpen ? `${p.partner} is ready. Open it` : 'Open the envelope together'}</button>}
          </div>
        </>
      ) : (
        <>
          {/* The opened envelope: the letter rises out of the pocket, so the message is the thing you see. */}
          <div className="opened" style={{ ['--env' as string]: cardColors(7, hue, 'dark').field }}>
            <m.div className="letter" initial={{ y: 70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .25, type: 'spring', stiffness: 140, damping: 18 }}>
              <span className="eyebrow">For the two of you</span>
              <p className="prompt m">{c.env}</p>
            </m.div>
            <div className="pocket" aria-hidden="true"><span className="seal">T</span></div>
          </div>
          {p.view.chat.length > 0 && <div className="panel"><p className="eyebrow">Tonight's answers</p><ChatPanel view={p.view} partner={p.partner} readOnly /></div>}
          <ShareOffer view={p.view} theme={p.theme} toast={p.toast} />
          <ShopLinks kind="kit" items={kitFor(c.kitTopics || [], p.view.session?.tonight ?? 1)} />
          {c.kept.length > 0 && <div className="panel"><h3>Kept tonight</h3><div className="kept">{c.kept.map((t, i) => <p key={i}>{t}</p>)}</div></div>}
          <div className="bottom"><button className="btn" onClick={() => net.act({ a: 'finish' })}>Done for tonight</button></div>
        </>
      )}
      <Countdown at={c.countdownAt} />
    </>
  );
}

function PauseOverlay() {
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Paused">
      <div className="panel">
        <h3>Taking a break.</h3>
        <p className="muted">Nothing is recorded. Either of you can pick it back up.</p>
        <div className="row"><button className="ctrl" onClick={() => net.act({ a: 'resume' })}>Resume</button><button className="ctrl" onClick={() => net.act({ a: 'leave' })}>End for tonight</button></div>
      </div>
    </div>
  );
}

export const _deckSize = Object.values(DECK).reduce((a, b) => a + b.length, 0);
