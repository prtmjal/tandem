// Server-authoritative game room. Private choices live only here and are never sent to the partner.
import {
  DECK, LEVELS, CARD_BY_ID, TOTAL_CARDS, TWIST_UP, TWIST_DOWN, CLOSING, ENVELOPES,
  isGated, SOFT_TYPES, type Card,
} from '../shared/content';
import {
  emptyProgress, type Action, type CardView, type Energy, type Phase, type Progress, type VibeId, type View, type Vote,
} from '../shared/protocol';

const DAY = 24 * 3600 * 1000;
const PARK_MS = 56 * DAY; // declined cards rest for 8 weeks
const CURIOUS_MS = 14 * DAY; // an unmatched "curious" tap expires silently
const rnd = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
const shuffle = <T,>(a: T[]): T[] => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

type Idx = 0 | 1;
interface Player { token: string; name: string; connected: boolean; curious: Record<string, number> }

interface CurCard {
  kind: 'card'; seq: number; card: Card; mystery: boolean; flips: [boolean, boolean];
  gate: null | { votes: [Vote | null, Vote | null] }; timerEndsAt: number | null;
}
interface CurTwist { kind: 'twist'; seq: number; text: string; dir: 'up' | 'down' }

interface Session {
  c: number; c0: number; N: number; idx: number; seq: number;
  prev: string[]; used: Set<string>; kept: Map<string, string>;
  lastTw: number; downDone: boolean; cur: CurCard | CurTwist | null;
}

/** Merge two phones' saved progress. Each phone's private taps stay with that player. */
export function mergeProgress(a: Progress, b: Progress): Progress {
  const out = emptyProgress();
  out.unlocked = Array.from(new Set([...(a.unlocked || []), ...(b.unlocked || []), 1, 2])).filter(l => l >= 1 && l <= 8).sort((x, y) => x - y);
  for (const src of [a, b]) {
    for (const k in src.seen || {}) out.seen[k] = Array.from(new Set([...(out.seen[k] || []), ...src.seen[k]]));
    for (const k in src.last || {}) out.last[k] = Array.from(new Set([...(out.last[k] || []), ...src.last[k]]));
    for (const k in src.parked || {}) out.parked[k] = Math.max(out.parked[k] || 0, src.parked[k]);
  }
  const caps = new Map<number, { d: number; items: string[] }>();
  for (const c of [...(a.capsule || []), ...(b.capsule || [])]) caps.set(c.d, c);
  out.capsule = Array.from(caps.values()).sort((x, y) => x.d - y.d).slice(-50);
  out.sessions = Math.max(a.sessions || 0, b.sessions || 0);
  return out;
}

/** Keep only known card IDs and sane shapes from an uploaded progress blob. */
export function sanitizeProgress(p: unknown): Progress {
  const out = emptyProgress();
  if (!p || typeof p !== 'object') return out;
  const q = p as Partial<Progress>;
  const ids = (x: unknown) => (Array.isArray(x) ? x.filter(i => typeof i === 'string' && CARD_BY_ID[i]).slice(0, 2000) : []);
  if (Array.isArray(q.unlocked)) out.unlocked = q.unlocked.filter(l => Number.isInteger(l) && l >= 1 && l <= 8);
  for (let l = 1; l <= 8; l++) { const k = String(l); if (q.seen?.[k]) out.seen[k] = ids(q.seen[k]); if (q.last?.[k]) out.last[k] = ids(q.last[k]); }
  if (q.parked && typeof q.parked === 'object') for (const k in q.parked) if (CARD_BY_ID[k] && typeof q.parked[k] === 'number') out.parked[k] = q.parked[k];
  if (Array.isArray(q.capsule)) out.capsule = q.capsule.filter(c => c && typeof c.d === 'number' && Array.isArray(c.items))
    .map(c => ({ d: c.d, items: c.items.filter(s => typeof s === 'string').slice(0, 20).map(s => s.slice(0, 400)) })).slice(-50);
  if (typeof q.sessions === 'number') out.sessions = Math.max(0, Math.floor(q.sessions));
  if (q.curious && typeof q.curious === 'object') for (const k in q.curious) if (/^[3-8]$/.test(k) && typeof q.curious[k] === 'number') out.curious[k] = q.curious[k];
  return out;
}

export class Room {
  code: string;
  secret: string;
  createdAt = Date.now();
  lastActive = Date.now();
  players: (Player | null)[] = [null, null];
  prog: Progress;
  phase: Phase = 'lobby';
  paused = false;
  dark = false;
  unlock: null | { l: number; samples: Card[]; votes: [boolean | null, boolean | null]; opened: boolean } = null;
  ceiling: null | { picks: [number | null, number | null]; confirm: [boolean, boolean]; done: [boolean, boolean] } = null;
  arrive: null | { tonight: number; energy: Energy; vibes: [VibeId | null, VibeId | null]; memory: string | null; ready: [boolean, boolean]; countdownAt: number | null } = null;
  sess: Session | null = null;
  close: null | { stage: 0 | 1; closer: string; env: string; open: [boolean, boolean]; countdownAt: number | null } = null;
  env = '';

  constructor(code: string, secret: string, creator: Player, progress: Progress) {
    this.code = code; this.secret = secret;
    this.players[0] = creator;
    this.prog = mergeProgress(progress, emptyProgress());
  }

  get full() { return !!this.players[0] && !!this.players[1]; }

  join(p: Player, progress: Progress) {
    this.players[1] = p;
    this.prog = mergeProgress(this.prog, progress);
    if (this.phase === 'lobby') this.phase = 'home';
    this.checkCuriousMatches();
  }

  /* ---------------- unlocks (two-key, private) ---------------- */
  private checkCuriousMatches(): number[] {
    const now = Date.now(), opened: number[] = [];
    const [a, b] = this.players;
    if (!a || !b) return opened;
    for (let l = 3; l <= 8; l++) {
      const k = String(l), ta = a.curious[k], tb = b.curious[k];
      if (ta && now - ta > CURIOUS_MS) delete a.curious[k];
      if (tb && now - tb > CURIOUS_MS) delete b.curious[k];
      if (a.curious[k] && b.curious[k] && !this.prog.unlocked.includes(l)) {
        this.prog.unlocked.push(l); this.prog.unlocked.sort((x, y) => x - y); opened.push(l);
        delete a.curious[k]; delete b.curious[k];
      }
    }
    return opened;
  }

  /* ---------------- deck engine ---------------- */
  private bufK(l: number) { return Math.max(2, Math.round(DECK[l].length * 0.15)); }
  private lvlFor(t: number) { let best = 1; for (const l of this.prog.unlocked) if (l <= t && l > best) best = l; return best; }

  draw(l: number, prefer?: (c: Card) => boolean): Card {
    const s = this.sess!, k = String(l), now = Date.now();
    const seen = (this.prog.seen[k] ||= []), last = (this.prog.last[k] ||= []);
    const prevT = s.prev.slice(-2);
    const ok = (c: Card) => !seen.includes(c.id) && !last.includes(c.id) && !((this.prog.parked[c.id] || 0) > now) && !s.used.has(c.id);
    const narrow = (pool: Card[]) => {
      const fresh = pool.filter(c => !prevT.includes(c.topic)); if (fresh.length) pool = fresh;
      if (prefer) { const pp = pool.filter(prefer); if (pp.length) pool = pp; }
      return pool;
    };
    let pool = narrow(DECK[l].filter(ok));
    if (!pool.length) { // exhausted: reset history except the most recent cards
      this.prog.seen[k] = [];
      this.prog.last[k] = last.slice(-this.bufK(l));
      pool = narrow(DECK[l].filter(c => !this.prog.last[k].includes(c.id) && !s.used.has(c.id)));
      if (!pool.length) pool = DECK[l].filter(c => !s.used.has(c.id));
      if (!pool.length) pool = DECK[l].slice();
    }
    const c = rnd(pool);
    this.prog.seen[k].push(c.id);
    const L = this.prog.last[k]; L.push(c.id); while (L.length > this.bufK(l)) L.shift();
    s.prev.push(c.topic); s.used.add(c.id);
    return c;
  }

  private plan(s: Session) {
    return s.N === 12
      ? { w: [3, 2, 3], b: [2, 1, 2, 1], p: [0, 0], c: [3, 2, 3] }
      : { w: [3, 2, 3, 2], b: [2, 1, 2, 1, 2, 1], p: [0, 0, 0], c: [3, 2, 3] };
  }
  private slot(s: Session, i: number) {
    const p = this.plan(s), seq = [...p.w, ...p.b, ...p.p, ...p.c];
    const ph = i < p.w.length ? 'w' : i < p.w.length + p.b.length ? 'b' : i < p.w.length + p.b.length + p.p.length ? 'p' : 'c';
    return { off: seq[Math.min(i, seq.length - 1)], ph };
  }

  private advance() {
    const s = this.sess!;
    s.seq++;
    if (s.idx >= s.N) { this.startClose(); return; }
    const gap = s.idx - s.lastTw;
    if (s.idx >= 3 && s.idx <= s.N - 3 && gap >= 6) {
      const coolStart = s.idx === s.N - 3 && s.c >= 4 && !s.downDone;
      if (gap >= 12 || coolStart || Math.random() < 0.28) {
        const down = s.idx >= s.N - 3 || Math.random() < 0.3;
        s.lastTw = s.idx; if (down) s.downDone = true;
        s.cur = { kind: 'twist', seq: s.seq, text: rnd(down ? TWIST_DOWN : TWIST_UP), dir: down ? 'down' : 'up' };
        return;
      }
    }
    const sl = this.slot(s, s.idx);
    const lv = this.lvlFor(Math.max(1, s.c - sl.off));
    const prefer = sl.ph === 'c' ? (c: Card) => SOFT_TYPES.has(c.type) && !isGated(c) : sl.ph === 'w' ? (c: Card) => !isGated(c) : undefined;
    const card = this.draw(lv, prefer);
    const mystery = s.idx === this.plan(s).w.length + 2;
    s.cur = { kind: 'card', seq: s.seq, card, mystery, flips: [false, false], gate: isGated(card) ? { votes: [null, null] } : null, timerEndsAt: null };
  }

  private resolveGate(cur: CurCard) {
    const v = cur.gate!.votes;
    if (v[0] !== 'n' && v[1] !== 'n') { cur.gate = null; return; }
    // Silent swap: park the declined card and replace it with a non-hands-on card from the same level.
    this.prog.parked[cur.card.id] = Date.now() + PARK_MS;
    cur.card = this.draw(cur.card.l, c => !isGated(c));
    cur.gate = null; cur.mystery = false;
  }

  private startClose() {
    this.phase = 'close';
    this.close = { stage: 0, closer: rnd(CLOSING), env: this.env, open: [false, false], countdownAt: null };
  }

  /* ---------------- actions ---------------- */
  /** Returns extra events (e.g. a celebration) for the socket layer. */
  act(me: Idx, x: Action): { celebrate?: number[] } {
    this.lastActive = Date.now();
    const other: Idx = me === 0 ? 1 : 0;
    const s = this.sess;
    if (!this.full && x.a !== 'home') return {};
    switch (x.a) {
      case 'home':
        if (this.phase === 'unlock' || this.phase === 'ceiling') { this.phase = 'home'; this.unlock = null; this.ceiling = null; }
        break;

      case 'unlock:open': {
        if (this.phase !== 'home' || !Number.isInteger(x.l) || x.l < 3 || x.l > 8 || this.prog.unlocked.includes(x.l)) break;
        this.unlock = { l: x.l, samples: shuffle(DECK[x.l]).slice(0, 3), votes: [null, null], opened: false };
        this.phase = 'unlock';
        break;
      }
      case 'unlock:vote': {
        const u = this.unlock; if (this.phase !== 'unlock' || !u || u.votes[me] !== null) break;
        u.votes[me] = !!x.yes;
        if (x.yes) this.players[me]!.curious[String(u.l)] = Date.now(); else delete this.players[me]!.curious[String(u.l)];
        // A tap made on an earlier night still counts, so check for a match right away.
        const opened = this.checkCuriousMatches();
        if (opened.includes(u.l)) u.opened = true;
        return opened.length ? { celebrate: opened } : {};
      }

      case 'tonight':
        if (this.phase !== 'home') break;
        this.ceiling = { picks: [null, null], confirm: [false, false], done: [false, false] };
        this.phase = 'ceiling';
        break;
      case 'ceiling:pick':
        if (this.phase !== 'ceiling' || !this.ceiling || this.ceiling.done[me]) break;
        if (!this.prog.unlocked.includes(x.l)) break;
        this.ceiling.picks[me] = x.l; this.ceiling.confirm[me] = false;
        break;
      case 'ceiling:confirm':
        if (this.phase !== 'ceiling' || !this.ceiling || this.ceiling.done[me]) break;
        this.ceiling.confirm[me] = !!x.on;
        break;
      case 'ceiling:done': {
        const c = this.ceiling; if (this.phase !== 'ceiling' || !c) break;
        const pick = c.picks[me]; if (!pick) break;
        if (pick >= 7 && !c.confirm[me]) break;
        c.done[me] = true;
        if (c.done[0] && c.done[1]) {
          const tonight = Math.min(c.picks[0]!, c.picks[1]!);
          const caps = this.prog.capsule.flatMap(k => k.items);
          this.arrive = { tonight, energy: 'mid', vibes: [null, null], memory: caps.length ? rnd(caps) : null, ready: [false, false], countdownAt: null };
          this.ceiling = null; this.phase = 'arrive';
        }
        break;
      }

      case 'energy':
        if (this.phase === 'arrive' && this.arrive && ['low', 'mid', 'high'].includes(x.v)) this.arrive.energy = x.v;
        break;
      case 'vibe':
        if ((this.phase === 'arrive' || this.phase === 'home') && ['rose', 'coral', 'plum', 'lagoon'].includes(x.v)) {
          if (this.arrive) this.arrive.vibes[me] = x.v;
        }
        break;
      case 'ready': {
        const ar = this.arrive; if (this.phase !== 'arrive' || !ar || ar.ready[me]) break;
        ar.ready[me] = true;
        if (ar.ready[0] && ar.ready[1]) {
          ar.countdownAt = Date.now() + 3000;
          this.env = rnd(ENVELOPES);
          this.sess = {
            c: ar.tonight, c0: ar.tonight, N: ar.energy === 'low' ? 12 : 16, idx: 0, seq: 0,
            prev: [], used: new Set(), kept: new Map(), lastTw: -3, downDone: false, cur: null,
          };
          this.paused = false; this.dark = false;
          this.advance();
          this.phase = 'card';
        }
        break;
      }

      case 'flip': {
        const cur = s?.cur; if (this.phase !== 'card' || !cur || cur.kind !== 'card' || cur.seq !== x.seq) break;
        cur.flips[me] = true;
        break;
      }
      case 'gate': {
        const cur = s?.cur; if (this.phase !== 'card' || !cur || cur.kind !== 'card' || cur.seq !== x.seq || !cur.gate) break;
        if (cur.mystery && !(cur.flips[0] && cur.flips[1])) break;
        if (cur.gate.votes[me] !== null || !['y', 'm', 'n'].includes(x.v)) break;
        cur.gate.votes[me] = x.v;
        if (cur.gate.votes[other] !== null) this.resolveGate(cur);
        break;
      }
      case 'next': {
        const cur = s?.cur; if (this.phase !== 'card' || !s || !cur || cur.seq !== x.seq) break;
        if (cur.kind === 'card') s.idx++;
        this.advance();
        break;
      }
      case 'timer': {
        const cur = s?.cur; if (this.phase !== 'card' || !cur || cur.kind !== 'card' || cur.seq !== x.seq || !cur.card.t || cur.gate) break;
        cur.timerEndsAt = Date.now() + cur.card.t * 1000;
        break;
      }
      case 'keep': {
        const cur = s?.cur; if (this.phase !== 'card' || !s || !cur || cur.kind !== 'card' || cur.seq !== x.seq || cur.gate) break;
        if (s.kept.has(cur.card.id)) s.kept.delete(cur.card.id); else s.kept.set(cur.card.id, cur.card.text);
        break;
      }
      case 'softer':
        if (s) s.c = Math.max(1, s.c - 1);
        break;
      case 'pause': this.paused = true; break;
      case 'resume': this.paused = false; break;
      case 'dark': this.dark = !!x.on; break;
      case 'leave':
        if (this.phase === 'card' || this.phase === 'arrive' || this.phase === 'close') {
          this.sess = null; this.arrive = null; this.close = null; this.paused = false; this.dark = false; this.phase = 'home';
        }
        break;

      case 'open': {
        const cl = this.close; if (this.phase !== 'close' || !cl) break;
        cl.open[me] = true;
        if (cl.open[0] && cl.open[1] && cl.stage === 0) { cl.stage = 1; cl.countdownAt = Date.now() + 3000; }
        break;
      }
      case 'finish': {
        if (this.phase !== 'close' || !s) break;
        const items = Array.from(s.kept.values());
        this.prog.sessions++;
        if (items.length) { this.prog.capsule.push({ d: Date.now(), items }); this.prog.capsule = this.prog.capsule.slice(-50); }
        this.sess = null; this.arrive = null; this.close = null; this.dark = false; this.phase = 'home';
        break;
      }
    }
    return {};
  }

  setConnected(i: Idx, on: boolean) { const p = this.players[i]; if (p) p.connected = on; this.lastActive = Date.now(); }

  /** What one phone is allowed to see. The partner's raw choices are reduced to "done or not". */
  view(me: Idx): View {
    const other: Idx = me === 0 ? 1 : 0;
    const P = this.players;
    const s = this.sess;
    let card: CardView | null = null;
    if (s?.cur) {
      const cur = s.cur;
      if (cur.kind === 'twist') card = { kind: 'twist', seq: cur.seq, text: cur.text, dir: cur.dir };
      else {
        const flipped = !cur.mystery || (cur.flips[0] && cur.flips[1]);
        const hidden = !flipped || !!cur.gate; // never send card text before the mystery flip or the private check
        card = {
          kind: 'card', seq: cur.seq, level: cur.card.l, card: hidden ? null : cur.card, mystery: cur.mystery,
          myFlip: cur.flips[me], partnerFlip: cur.flips[other], flipped,
          gate: cur.gate ? {
            teaser: cur.card.type === 'Scene' ? 'A role-play card is next.' : 'A hands-on card is next.',
            myVote: cur.gate.votes[me], partnerVoted: cur.gate.votes[other] !== null,
          } : null,
          timerEndsAt: cur.timerEndsAt,
        };
        if (hidden && !cur.gate) card.gate = null;
      }
    }
    return {
      code: this.code,
      me,
      names: [P[0]?.name || 'Partner 1', P[1]?.name || 'Partner 2'],
      partnerConnected: !!P[other]?.connected,
      bothJoined: this.full,
      phase: this.phase,
      paused: this.paused,
      dark: this.dark,
      unlocked: this.prog.unlocked.slice(),
      sessions: this.prog.sessions,
      totalCards: TOTAL_CARDS,
      unlock: this.unlock ? {
        l: this.unlock.l, samples: this.unlock.samples, myVote: this.unlock.votes[me],
        partnerVoted: this.unlock.votes[other] !== null, opened: this.unlock.opened,
      } : null,
      ceiling: this.ceiling ? {
        myPick: this.ceiling.picks[me], myConfirm: this.ceiling.confirm[me],
        partnerDone: this.ceiling.done[other], meDone: this.ceiling.done[me],
      } : null,
      arrive: this.arrive ? {
        tonight: this.arrive.tonight, energy: this.arrive.energy, myVibe: this.arrive.vibes[me], partnerVibe: this.arrive.vibes[other],
        memory: this.arrive.memory, myReady: this.arrive.ready[me], partnerReady: this.arrive.ready[other], countdownAt: this.arrive.countdownAt,
      } : null,
      session: s ? { idx: s.idx, N: s.N, tonight: s.c0, card, keptIds: Array.from(s.kept.keys()) } : null,
      close: this.close ? {
        stage: this.close.stage, closer: this.close.closer, env: this.close.stage === 1 ? this.close.env : '',
        kept: s ? Array.from(s.kept.values()) : [], myOpen: this.close.open[me], partnerOpen: this.close.open[other], countdownAt: this.close.countdownAt,
      } : null,
    };
  }

  /** Progress to store on one phone: shared progress plus only that phone's own private taps. */
  progressFor(me: Idx): Progress {
    return { ...this.prog, curious: { ...(this.players[me]?.curious || {}) } };
  }
}

export const levelName = (l: number) => LEVELS[l]?.n || '';
