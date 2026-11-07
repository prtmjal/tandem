// Server-authoritative game room. Private choices live only here and are never sent to the partner.
import {
  DECK, LEVELS, CARD_BY_ID, TOTAL_CARDS, TWIST_UP, TWIST_DOWN, CLOSING, ENVELOPES,
  isGated, SOFT_TYPES, worksApart, TOGETHER_TEXT, APART_DECK, APART_CARDS, type Card,
} from '../shared/content';
import {
  emptyProgress, type Action, type CardView, type Energy, type Phase, type Progress, type VibeId, type View, type Vote,
} from '../shared/protocol';

import { isVibe } from '../shared/theme';
import { mergeProgress, sanitizeProgress } from '../shared/progress';
import { PASS_CARD_COUNT, PASS_DECK } from '../shared/decks';
const DAY = 24 * 3600 * 1000;
const PLAYFUL = new Set(['Guess', 'Seal']);
const PLAYFUL_TOPICS = new Set(['thisthat', 'twotruths', 'rapidfire', 'wouldrather', 'hottake', 'pickup', 'wink', 'film', 'threeguess', 'fridge', 'ap-tour', 'ap-fridge']);
const PARK_MS = 56 * DAY; // declined cards rest for 8 weeks
const CURIOUS_MS = 14 * DAY; // an unmatched "curious" tap expires silently
const rnd = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
const shuffle = <T,>(a: T[]): T[] => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

type Idx = 0 | 1;
interface Player { token: string; name: string; connected: boolean; curious: Record<string, number>; allowTouch?: boolean }

interface CurCard {
  kind: 'card'; seq: number; card: Card; mystery: boolean; flips: [boolean, boolean];
  gate: null | { votes: [Vote | null, Vote | null] }; timerEndsAt: number | null;
}
interface CurTwist { kind: 'twist'; seq: number; text: string; dir: 'up' | 'down' }

interface Session {
  c: number; c0: number; N: number; idx: number; seq: number;
  prev: string[]; used: Set<string>; kept: Map<string, string>;
  /** Cards actually shown face up tonight (never ones swapped away after a private 'not tonight'). */
  shown?: string[];
  lastTw: number; downDone: boolean; upDone?: boolean; longUsed?: boolean; cur: CurCard | CurTwist | null;
}

// Progress merge and sanitizing live in shared/progress.ts so the phone can merge backups the same way.
export { mergeProgress, sanitizeProgress };

/** Plain text only: no control characters, at most 500 characters. */
export function cleanText(t: unknown): string {
  if (typeof t !== 'string') return '';
  return t.replace(/[\u0000-\u0009\u000B-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2066-\u2069]/g, '').replace(/\n{3,}/g, '\n\n').trim().slice(0, 500);
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
  /** Who plays music. Together, only one phone does (no echo). Apart, each phone may play its own. */
  music: [boolean, boolean] = [false, false];
  /** Long-distance mode: the two of you are apart, on a call. Draws only cards that work over video. */
  apart = false;
  /** Couple Pass: on when either partner brought a valid pass code. Adds the pass decks to every level. */
  pass = false;
  /** Verified pass codes brought into this room. Shared with both phones so a pass survives losing one phone. */
  passCodes: string[] = [];
  /** Tonight's messages. Memory only, at most 60, cleared when the night ends; never written anywhere. */
  chat: { id: number; from: Idx; text: string; seq: number | null; sealed: boolean; at: number }[] = [];
  private chatId = 0;
  /** Private until both answer: sealed answers for the current card. Never in the partner's view. */
  sealed: { seq: number; text: [string | null, string | null] } | null = null;
  unlock: null | { l: number; samples: Card[]; votes: [boolean | null, boolean | null]; opened: boolean } = null;
  ceiling: null | { picks: [number | null, number | null]; confirm: [boolean, boolean]; done: [boolean, boolean] } = null;
  arrive: null | { tonight: number; energy: Energy; vibes: [VibeId | null, VibeId | null]; memory: string | null; ready: [boolean, boolean]; countdownAt: number | null } = null;
  sess: Session | null = null;
  close: null | {
    stage: 0 | 1; closer: string; env: string; open: [boolean, boolean]; countdownAt: number | null;
    /** Private: each partner's own "happy to share a card about tonight". Never sent to the other phone. */
    share: [boolean, boolean]; shareQ: string | null;
  } = null;
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
  /** The cards this room can draw at a level: the free deck, plus the pass decks when the pass is on. */
  deck(l: number): Card[] {
    const extra = this.pass ? PASS_DECK[l] || [] : [];
    // The Long distance deck is for nights apart; everything else in the pass works both ways.
    const all = DECK[l].concat(extra.filter(c => this.apart || !c.id.startsWith('p.distance.')));
    // Apart: video-friendly cards plus the free Long distance deck (and the pass's, when on).
    return this.apart ? all.filter(c => worksApart(c) || c.id.startsWith('p.distance.')).concat(APART_DECK[l] || []) : all;
  }
  private pushChat(from: Idx, text: string, seq: number | null, sealed: boolean) {
    this.chat.push({ id: ++this.chatId, from, text, seq, sealed, at: Date.now() });
    if (this.chat.length > 60) this.chat.splice(0, this.chat.length - 60);
  }
  /** The question on a share card: one you actually played tonight from Levels 1-3 (kept ones first), never later
   *  levels, never pass-deck hands-on text. Falls back to a Level 1 card. Only talk cards, so it is safe to post. */
  shareQuestion(): string {
    const s = this.sess;
    const safe = (id: string) => { const c = CARD_BY_ID[id]; return !!c && c.l <= 3 && SOFT_TYPES.has(c.type); };
    const kept = s ? Array.from(s.kept.keys()).filter(safe) : [];
    const played = s ? Array.from(s.used).filter(safe) : [];
    const pick = kept.length ? rnd(kept) : played.length ? rnd(played) : null;
    return pick ? CARD_BY_ID[pick].text : rnd(DECK[1].filter(c => SOFT_TYPES.has(c.type))).text;
  }
  /** Drops twists, closers and envelopes that need one room when you're apart. */
  private fit(list: string[]) { if (!this.apart) return list; const ok = list.filter(t => !TOGETHER_TEXT.test(t)); return ok.length ? ok : list; }
  /** Apart, a level with too few video-friendly cards plays from the level below instead. */
  private playable(l: number) { while (this.apart && l > 1 && this.deck(l).length < 6) l--; return l; }
  private bufK(l: number) { return Math.max(2, Math.round(this.deck(l).length * 0.15)); }
  private lvlFor(t: number) { let best = 1; for (const l of this.prog.unlocked) if (l <= t && l > best) best = l; return best; }

  draw(l: number, prefer?: (c: Card) => boolean): Card {
    l = this.playable(l);
    // Apart with the pass, lean on the Long distance deck now and then without draining it in one night.
    if (this.apart && this.pass && !prefer && Math.random() < 0.35) prefer = c => c.id.startsWith('p.distance.');
    const s = this.sess!, k = String(l), now = Date.now();
    const seen = (this.prog.seen[k] ||= []), last = (this.prog.last[k] ||= []);
    const prevT = s.prev.slice(-2);
    const ok = (c: Card) => !seen.includes(c.id) && !last.includes(c.id) && !((this.prog.parked[c.id] || 0) > now) && !s.used.has(c.id);
    const narrow = (pool: Card[]) => {
      const fresh = pool.filter(c => !prevT.includes(c.topic)); if (fresh.length) pool = fresh;
      // At most one long timer (5+ minutes) a night, so a night doesn't quietly run past an hour.
      if (s.longUsed) { const short = pool.filter(c => (c.t || 0) < 300); if (short.length) pool = short; }
      if (prefer) { const pp = pool.filter(prefer); if (pp.length) pool = pp; }
      return pool;
    };
    let pool = narrow(this.deck(l).filter(ok));
    if (!pool.length) { // exhausted: reset history except the most recent cards
      this.prog.seen[k] = [];
      this.prog.last[k] = last.slice(-this.bufK(l));
      pool = narrow(this.deck(l).filter(c => !this.prog.last[k].includes(c.id) && !s.used.has(c.id)));
      if (!pool.length) pool = this.deck(l).filter(c => !s.used.has(c.id));
      if (!pool.length) pool = this.deck(l).slice();
    }
    const c = rnd(pool);
    this.prog.seen[k].push(c.id);
    const L = this.prog.last[k]; L.push(c.id); while (L.length > this.bufK(l)) L.shift();
    s.prev.push(c.topic); s.used.add(c.id);
    if ((c.t || 0) >= 300) s.longUsed = true;
    return c;
  }

  private plan(s: Session) {
    return s.N === 12
      ? { w: [3, 2, 3], b: [2, 1, 2, 1], p: [0, 0], c: [3, 2, 3] }
      : { w: [3, 2, 3, 2], b: [2, 1, 2, 1, 2, 1], p: [0, 1, 0], c: [3, 2, 3] }; // one peak with a breath, not a plateau
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
    // Full nights always get one 'slow down' as the cool-down starts; at most one 'turn it up' per night, never late.
    const coolStart = s.idx === s.N - 3 && (s.c >= 4 || s.N === 16) && !s.downDone;
    if (s.idx >= 3 && s.idx <= s.N - 3 && (gap >= 6 || coolStart)) {
      if (gap >= 12 || coolStart || Math.random() < 0.28) {
        const down = s.idx >= s.N - 4 || !!s.upDone || Math.random() < 0.3;
        if (down && s.downDone && !coolStart) { /* one slow-down is enough */ } else {
        s.lastTw = s.idx; if (down) s.downDone = true; else s.upDone = true;
        s.cur = { kind: 'twist', seq: s.seq, text: rnd(this.fit(down ? TWIST_DOWN : TWIST_UP)), dir: down ? 'down' : 'up' };
        return;
        }
      }
    }
    const sl = this.slot(s, s.idx);
    const lv = this.lvlFor(Math.max(1, s.c - sl.off));
    // Open playful (an early laugh), close warm (appreciation last), and keep warm-up and cool-down hands-off.
    const prefer = s.idx === 0 ? (c: Card) => PLAYFUL.has(c.type) || PLAYFUL_TOPICS.has(c.topic)
      : s.idx === s.N - 1 ? (c: Card) => c.type === 'Appreciate' || (SOFT_TYPES.has(c.type) && !isGated(c) && /appreciat|love|grateful|thank|favou?rite thing about/i.test(c.text))
      : sl.ph === 'c' ? (c: Card) => SOFT_TYPES.has(c.type) && !isGated(c) : sl.ph === 'w' ? (c: Card) => !isGated(c) : undefined;
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
    this.close = { stage: 0, closer: rnd(this.fit(CLOSING)), env: this.env, open: [false, false], countdownAt: null, share: [false, false], shareQ: null };
  }

  /* ---------------- actions ---------------- */
  /** Returns extra events (e.g. a celebration) for the socket layer. */
  act(me: Idx, x: Action): { celebrate?: number[] } {
    this.lastActive = Date.now();
    const other: Idx = me === 0 ? 1 : 0;
    const s = this.sess;
    if (!this.full && x.a !== 'home') return {};
    // A sealed answer belongs to one card. Once the card has moved on, it is discarded unopened.
    if (this.sealed && (s?.cur?.seq ?? -1) !== this.sealed.seq) this.sealed = null;
    switch (x.a) {
      case 'chat': {
        const text = cleanText(x.text);
        if (!text || !s || (this.phase !== 'card' && this.phase !== 'close')) break;
        const seq = this.phase === 'card' && s.cur ? s.cur.seq : null;
        if (x.seal && seq !== null) {
          const sl = (this.sealed ??= { seq, text: [null, null] });
          if (sl.text[me] !== null) break; // one sealed answer each per card
          sl.text[me] = text;
          if (sl.text[0] !== null && sl.text[1] !== null) {
            // Both answered: open them together, in seat order so both phones show the same thing.
            for (const i of [0, 1] as const) this.pushChat(i, sl.text[i]!, seq, true);
            this.sealed = null;
          }
        } else this.pushChat(me, text, seq, false);
        break;
      }
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
        // Tapping an open level on the map pre-selects only the tapper's own pick; the partner still chooses privately.
        if (Number.isInteger(x.l) && this.prog.unlocked.includes(x.l!)) this.ceiling.picks[me] = x.l!;
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
        if ((this.phase === 'arrive' || this.phase === 'home') && isVibe(x.v)) {
          if (this.arrive) this.arrive.vibes[me] = x.v;
        }
        break;
      case 'ready': {
        const ar = this.arrive; if (this.phase !== 'arrive' || !ar || ar.ready[me]) break;
        ar.ready[me] = true;
        if (ar.ready[0] && ar.ready[1]) {
          ar.countdownAt = Date.now() + 3000;
          this.env = rnd(this.fit(ENVELOPES));
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
        if (cur.kind === 'card' && !cur.gate && (!cur.mystery || (cur.flips[0] && cur.flips[1]))) (s.shown ||= []).push(cur.card.id);
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
      case 'music':
        if (x.on && !this.apart) this.music = [false, false];
        this.music[me] = !!x.on;
        break;
      case 'apart':
        this.apart = !!x.on;
        if (!this.apart && this.music[0] && this.music[1]) this.music = [true, false]; // back together: one phone plays
        break;
      case 'touch:allow': { const pl = this.players[me]; if (pl) pl.allowTouch = !!x.on; break; }
      case 'leave':
        if (this.phase === 'card' || this.phase === 'arrive' || this.phase === 'close') {
          this.sess = null; this.arrive = null; this.close = null; this.paused = false; this.dark = false; this.phase = 'home';
          this.chat = []; this.sealed = null;
        }
        break;

      case 'open': {
        const cl = this.close; if (this.phase !== 'close' || !cl) break;
        cl.open[me] = true;
        if (cl.open[0] && cl.open[1] && cl.stage === 0) { cl.stage = 1; cl.countdownAt = Date.now() + 3000; }
        break;
      }
      case 'share': {
        const cl = this.close; if (this.phase !== 'close' || !cl || cl.stage !== 1) break;
        cl.share[me] = !!x.on;
        if (cl.share[0] && cl.share[1]) cl.shareQ ??= this.shareQuestion();
        break;
      }
      case 'finish': {
        if (this.phase !== 'close' || !s) break;
        const items = Array.from(s.kept.values());
        this.prog.sessions++;
        if (items.length) { this.prog.capsule.push({ d: Date.now(), items }); this.prog.capsule = this.prog.capsule.slice(-50); }
        this.sess = null; this.arrive = null; this.close = null; this.dark = false; this.phase = 'home';
        this.chat = []; this.sealed = null;
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
      music: this.music[me] && this.music[other] ? 'both' : this.music[me] ? 'me' : this.music[other] ? 'partner' : null,
      apart: this.apart,
      partnerAllowsTouch: !!P[other]?.allowTouch,
      meAllowsTouch: !!P[me]?.allowTouch,
      unlocked: this.prog.unlocked.slice(),
      sessions: this.prog.sessions,
      totalCards: TOTAL_CARDS + APART_CARDS + (this.pass ? PASS_CARD_COUNT : 0),
      pass: this.pass,
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
      chat: this.chat.map(m => ({ id: m.id, mine: m.from === me, text: m.text, seq: m.seq, sealed: m.sealed })),
      // Only whether the partner has sealed an answer for this card, never what it says.
      sealed: this.sealed && s?.cur?.seq === this.sealed.seq
        ? { seq: this.sealed.seq, mine: this.sealed.text[me], partnerSealed: this.sealed.text[other] !== null } : null,
      close: this.close ? {
        stage: this.close.stage, closer: this.close.closer, env: this.close.stage === 1 ? this.close.env : '',
        kept: s ? Array.from(s.kept.values()) : [], myOpen: this.close.open[me], partnerOpen: this.close.open[other], countdownAt: this.close.countdownAt,
        myShare: this.close.share[me],
        // Topics of cards both partners saw tonight, so 'Tonight's kit' can match them. Never swapped-away cards.
        kitTopics: Array.from(new Set((s?.shown || []).map(id => CARD_BY_ID[id]?.topic).filter((t): t is string => !!t))),
        // Only the outcome: a card exists when both said yes. Nobody learns whether the other declined.
        shareCard: this.close.share[0] && this.close.share[1] && this.close.shareQ ? { question: this.close.shareQ, nights: this.prog.sessions + 1 } : null,
      } : null,
    };
  }

  /** Progress to store on one phone: shared progress plus only that phone's own private taps. */
  progressFor(me: Idx): Progress {
    return { ...this.prog, curious: { ...(this.players[me]?.curious || {}) } };
  }
}

export const levelName = (l: number) => LEVELS[l]?.n || '';
