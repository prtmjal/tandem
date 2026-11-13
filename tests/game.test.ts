import { describe, expect, it } from 'vitest';
import { Room } from '../server/game';
import { emptyProgress, type Action } from '../shared/protocol';

function newRoom(unlocked = [1, 2, 3, 4, 5, 6, 7, 8]) {
  const p = emptyProgress(); p.unlocked = unlocked;
  const r = new Room('ABCDEF', 'secret', { token: 't0', name: 'Asha', connected: true, curious: {} }, p);
  r.join({ token: 't1', name: 'Sam', connected: true, curious: {} }, emptyProgress());
  return r;
}
const both = (r: Room, x: Action) => { r.act(0, x); r.act(1, x); };

function startSession(r: Room, ceil: [number, number], energy: 'low' | 'mid' = 'mid') {
  r.act(0, { a: 'tonight' });
  for (const i of [0, 1] as const) {
    r.act(i, { a: 'ceiling:pick', l: ceil[i] });
    if (ceil[i] >= 7) r.act(i, { a: 'ceiling:confirm', on: true });
    r.act(i, { a: 'ceiling:done' });
  }
  r.act(0, { a: 'energy', v: energy });
  both(r, { a: 'ready' });
}

/** Plays a session; gate answers come from `gate(i)`. Returns card ids shown. */
function play(r: Room, gate: (i: 0 | 1) => 'y' | 'm' | 'n' = () => 'y') {
  const ids: string[] = []; let guard = 0;
  while (r.phase === 'card' && guard++ < 200) {
    const v = r.view(0).session!.card!;
    if (v.kind === 'match') { r.act(0, { a: 'next', seq: v.seq }); continue; }
    if (v.kind === 'twist') { r.act(1, { a: 'next', seq: v.seq }); continue; }
    if (v.mystery && !v.flipped) { both(r, { a: 'flip', seq: v.seq }); continue; }
    if (v.gate) { r.act(0, { a: 'gate', seq: v.seq, v: gate(0) }); r.act(1, { a: 'gate', seq: v.seq, v: gate(1) }); continue; }
    ids.push(v.card!.id);
    r.act(guard % 2 ? 0 : 1, { a: 'next', seq: v.seq });
  }
  return ids;
}

describe('privacy: a partner never receives the other partner\'s raw choices', () => {
  it('ceiling picks stay private; only the lower one is used', () => {
    const r = newRoom();
    r.act(0, { a: 'tonight' });
    r.act(0, { a: 'ceiling:pick', l: 6 });
    r.act(0, { a: 'ceiling:done' });
    const seen = JSON.stringify(r.view(1));
    expect(r.view(1).ceiling!.partnerDone).toBe(true);
    expect(r.view(1).ceiling!.myPick).toBe(null);
    expect(seen).not.toContain('"myPick":6');
    r.act(1, { a: 'ceiling:pick', l: 4 }); r.act(1, { a: 'ceiling:done' });
    expect(r.view(0).arrive!.tonight).toBe(4);
  });

  it('gate votes are never in the partner view and card text is hidden until both answer', () => {
    const r = newRoom();
    startSession(r, [6, 6]);
    let checked = 0, guard = 0;
    while (r.phase === 'card' && guard++ < 200) {
      const v0 = r.view(0).session!.card!;
      if (v0.kind === 'match') { r.act(0, { a: 'next', seq: v0.seq }); continue; }
      if (v0.kind === 'twist') { r.act(0, { a: 'next', seq: v0.seq }); continue; }
      if (v0.mystery && !v0.flipped) { both(r, { a: 'flip', seq: v0.seq }); continue; }
      if (v0.gate) {
        expect(v0.card).toBe(null);
        r.act(0, { a: 'gate', seq: v0.seq, v: 'n' });
        const v1 = r.view(1).session!.card!;
        if (v1.kind === 'card') {
          expect(v1.gate!.partnerVoted).toBe(true);
          expect(v1.gate!.myVote).toBe(null);
          expect(JSON.stringify(v1)).not.toContain('"n"');
          expect(v1.card).toBe(null);
        }
        r.act(1, { a: 'gate', seq: v0.seq, v: 'y' });
        const after = r.view(1).session!.card!;
        if (after.kind === 'card') { expect(after.gate).toBe(null); expect(after.card!.type).not.toMatch(/^(Do|Session|Scene)$/); }
        checked++;
        continue;
      }
      r.act(0, { a: 'next', seq: v0.seq });
    }
    expect(checked).toBeGreaterThan(0);
  });

  it('unlock taps are private and open only when both choose', () => {
    const r = newRoom([1, 2]);
    r.act(0, { a: 'unlock:open', l: 3 });
    r.act(0, { a: 'unlock:vote', yes: true });
    const v1 = r.view(1);
    expect(v1.unlock!.partnerVoted).toBe(true);
    expect(JSON.stringify(v1)).not.toContain('curious');
    r.act(1, { a: 'unlock:vote', yes: false });
    expect(r.prog.unlocked).not.toContain(3);
    expect(r.progressFor(1).curious['3']).toBeUndefined();
    expect(r.progressFor(0).curious['3']).toBeTypeOf('number');
    // Later, partner 2 also becomes curious: it opens then.
    r.act(0, { a: 'home' });
    r.act(1, { a: 'unlock:open', l: 3 });
    r.act(1, { a: 'unlock:vote', yes: true });
    expect(r.prog.unlocked).toContain(3);
    expect(r.view(0).unlock!.opened).toBe(true);
  });
});

describe('sessions', () => {
  it('runs 16 and 12 card sessions to the close and records progress', () => {
    const r = newRoom();
    startSession(r, [5, 5]);
    expect(play(r).length).toBe(16);
    expect(r.phase).toBe('close');
    both(r, { a: 'open' });
    expect(r.view(0).close!.env.length).toBeGreaterThan(0);
    r.act(0, { a: 'finish' });
    expect(r.prog.sessions).toBe(1);
    startSession(r, [3, 3], 'low');
    expect(play(r).length).toBe(12);
  });

  it('a stale or double tap cannot skip two cards', () => {
    const r = newRoom();
    startSession(r, [2, 2]);
    const v = r.view(0).session!.card!;
    r.act(0, { a: 'next', seq: v.seq });
    const idx = r.sess!.idx;
    r.act(1, { a: 'next', seq: v.seq }); // same seq, ignored
    expect(r.sess!.idx).toBe(idx);
  });

  it('no repeats within or across early sessions, and declined cards are parked', () => {
    const r = newRoom();
    const seen = new Set<string>(); let dups = 0;
    for (let i = 0; i < 4; i++) {
      startSession(r, [6, 6]);
      const ids = play(r, i => (i === 0 ? 'n' : 'y'));
      expect(new Set(ids).size).toBe(ids.length);
      for (const id of ids) { if (seen.has(id)) dups++; seen.add(id); }
      both(r, { a: 'open' }); r.act(1, { a: 'finish' });
    }
    expect(dups).toBe(0);
    expect(Object.keys(r.prog.parked).length).toBeGreaterThan(0);
  });

  it('levels 7-8 need a nightly clear-headed confirmation', () => {
    const r = newRoom();
    r.act(0, { a: 'tonight' });
    r.act(0, { a: 'ceiling:pick', l: 8 });
    r.act(0, { a: 'ceiling:done' });
    expect(r.view(0).ceiling!.meDone).toBe(false);
    r.act(0, { a: 'ceiling:confirm', on: true });
    r.act(0, { a: 'ceiling:done' });
    expect(r.view(0).ceiling!.meDone).toBe(true);
  });
});

describe('music and touches', () => {
  it('apart, each phone may play its own music; back together, only one does', () => {
    const r = newRoom();
    r.act(0, { a: 'apart', on: true });
    r.act(0, { a: 'music', on: true }); r.act(1, { a: 'music', on: true });
    expect(r.view(0).music).toBe('both');
    r.act(1, { a: 'apart', on: false });
    expect(r.view(0).music).toBe('me'); expect(r.view(1).music).toBe('partner');
  });
  it('only one phone plays music, and either can move it', () => {
    const r = newRoom();
    r.act(0, { a: 'music', on: true });
    expect(r.view(0).music).toBe('me'); expect(r.view(1).music).toBe('partner');
    r.act(1, { a: 'music', on: true });
    expect(r.view(0).music).toBe('partner'); expect(r.view(1).music).toBe('me');
    r.act(0, { a: 'music', on: false }); // not the owner: no change
    expect(r.view(1).music).toBe('me');
    r.act(1, { a: 'music', on: false });
    expect(r.view(0).music).toBe(null);
  });
  it('touches are off until the receiver allows them', () => {
    const r = newRoom();
    expect(r.view(0).partnerAllowsTouch).toBe(false);
    r.act(1, { a: 'touch:allow', on: true });
    expect(r.view(0).partnerAllowsTouch).toBe(true);
    expect(r.view(1).meAllowsTouch).toBe(true);
    expect(r.view(1).partnerAllowsTouch).toBe(false);
  });
});

describe('apart mode', () => {
  it('never deals hands-on or same-room cards, even at the highest levels', async () => {
    const { worksApart, TOGETHER_TEXT } = await import('../shared/content');
    for (let night = 0; night < 6; night++) {
      const r = newRoom();
      r.act(0, { a: 'apart', on: true });
      startSession(r, [8, 8]);
      expect(r.view(0).apart).toBe(true);
      let guard = 0;
      while (r.phase === 'card' && guard++ < 200) {
        const v = r.view(0).session!.card!;
        if (v.kind === 'match') { r.act(0, { a: 'next', seq: v.seq }); continue; }
        if (v.kind === 'twist') { expect(TOGETHER_TEXT.test(v.text)).toBe(false); r.act(0, { a: 'next', seq: v.seq }); continue; }
        if (v.gate && (!v.mystery || v.flipped)) { // only the video-call deck has hands-on cards apart, and they still get the private vote
          both(r, { a: 'gate', seq: v.seq, v: 'y' });
          const c = r.view(0).session!.card!;
          if (c.kind === 'card') expect(c.card!.id.startsWith('a.') || c.card!.id.startsWith('p.distance.'), c.card!.text).toBe(true);
          continue;
        }
        if (v.mystery && !v.flipped) { both(r, { a: 'flip', seq: v.seq }); continue; }
        expect(worksApart(v.card!) || v.card!.id.startsWith('a.'), v.card!.text).toBe(true);
        r.act(0, { a: 'next', seq: v.seq });
      }
      expect(r.phase).toBe('close');
      expect(TOGETHER_TEXT.test(r.view(0).close!.closer)).toBe(false);
    }
  });
  it('the Long distance deck appears only when apart', () => {
    const r = newRoom(); r.pass = true;
    expect(r.deck(1).some(c => c.id.startsWith('p.distance.'))).toBe(false);
    r.act(0, { a: 'apart', on: true });
    expect(r.deck(1).some(c => c.id.startsWith('p.distance.'))).toBe(true);
    for (let l = 1; l <= 8; l++) for (const c of r.deck(l)) if (!c.id.startsWith('p.distance.') && !c.id.startsWith('a.')) expect(['Do', 'Session', 'Scene']).not.toContain(c.type);
  });
});

describe('share cards', () => {
  const toEnvelope = () => {
    const p = emptyProgress(); p.unlocked = [1, 2, 3, 4, 5, 6, 7, 8];
    const r = new Room('ABCDEF', 's', { token: 't0', name: 'Asha', connected: true, curious: {} }, p);
    r.join({ token: 't1', name: 'Sam', connected: true, curious: {} }, emptyProgress());
    startSession(r, [8, 8]); play(r);
    both(r, { a: 'open' });
    return r;
  };
  it('the opt-in is private and the card appears only when both say yes', () => {
    const r = toEnvelope();
    r.act(0, { a: 'share', on: true });
    expect(JSON.stringify(r.view(1))).not.toContain('"myShare":true'); // Sam can't see Asha's yes
    expect(r.view(0).close!.myShare).toBe(true);
    expect(r.view(0).close!.shareCard).toBe(null);
    expect(r.view(1).close!.shareCard).toBe(null);
    r.act(1, { a: 'share', on: true });
    const a = r.view(0).close!.shareCard, b = r.view(1).close!.shareCard;
    expect(a).not.toBe(null); expect(a).toEqual(b);
    r.act(1, { a: 'share', on: false }); // changing your mind removes it for both
    expect(r.view(0).close!.shareCard).toBe(null);
  });
  it('share cards only ever quote a talk card from Levels 1-3', async () => {
    const { DECK } = await import('../shared/content');
    const safe = new Set([1, 2, 3].flatMap(l => DECK[l].filter(c => ['Ask', 'Share', 'Note', 'Guess', 'Appreciate', 'Revisit', 'Seal', 'Likely'].includes(c.type)).map(c => c.text)));
    for (let i = 0; i < 8; i++) {
      const r = toEnvelope();
      both(r, { a: 'share', on: true });
      expect(safe.has(r.view(0).close!.shareCard!.question)).toBe(true);
    }
  });
});

describe('map shortcut', () => {
  it('tapping an open level pre-selects only my own private pick', () => {
    const r = newRoom([1, 2, 3, 4]);
    r.act(0, { a: 'tonight', l: 3 });
    expect(r.phase).toBe('ceiling');
    expect(r.view(0).ceiling!.myPick).toBe(3);
    expect(r.view(1).ceiling!.myPick).toBe(null); // the partner still chooses for themself
    expect(JSON.stringify(r.view(1))).not.toContain('"myPick":3');
  });
  it('ignores a level that is not open', () => {
    const r = newRoom([1, 2]);
    r.act(0, { a: 'tonight', l: 7 });
    expect(r.view(0).ceiling!.myPick).toBe(null);
  });
});

describe('chat and sealed answers', () => {
  const inCard = () => { const r = newRoom(); startSession(r, [2, 2]); return r; };
  it('a sealed answer stays private until both have answered, then both open together', () => {
    const r = inCard();
    r.act(0, { a: 'chat', text: 'My secret answer', seal: true });
    expect(JSON.stringify(r.view(1))).not.toContain('My secret answer');
    expect(r.view(1).sealed!.partnerSealed).toBe(true);
    expect(r.view(1).sealed!.mine).toBe(null);
    expect(r.view(0).sealed!.mine).toBe('My secret answer');
    expect(r.view(0).chat.length).toBe(0);
    r.act(1, { a: 'chat', text: 'Mine too', seal: true });
    const a = r.view(0).chat, b = r.view(1).chat;
    expect(a.map(m => m.text)).toEqual(['My secret answer', 'Mine too']);
    expect(b.map(m => m.text)).toEqual(['My secret answer', 'Mine too']);
    expect(a[0].mine).toBe(true); expect(b[0].mine).toBe(false);
    expect(r.view(0).sealed).toBe(null);
  });
  it('an unopened sealed answer is discarded when the card moves on, never shown', () => {
    const r = inCard();
    r.act(0, { a: 'chat', text: 'Never shown', seal: true });
    const v = r.view(0).session!.card!;
    r.act(1, { a: 'next', seq: v.seq });
    r.act(1, { a: 'chat', text: 'hello' });
    expect(JSON.stringify(r.view(1))).not.toContain('Never shown');
    expect(JSON.stringify(r.view(0))).not.toContain('Never shown');
  });
  it('plain messages reach both phones, are cleaned, and are forgotten when the night ends', () => {
    const r = inCard();
    r.act(0, { a: 'chat', text: '  hi\u0000 there ‮ ' });
    expect(r.view(1).chat[0].text).toBe('hi there');
    r.act(0, { a: 'chat', text: 'x'.repeat(900) });
    expect(r.view(1).chat[1].text.length).toBe(500);
    play(r);
    both(r, { a: 'open' });
    r.act(0, { a: 'finish' });
    expect(r.view(0).chat).toEqual([]);
  });
  it('no chat outside a night', () => {
    const r = newRoom();
    r.act(0, { a: 'chat', text: 'hello' });
    expect(r.view(1).chat).toEqual([]);
  });
});

describe('free long distance deck', () => {
  it('is dealt only on nights apart, at every level', () => {
    const r = newRoom();
    for (let l = 1; l <= 8; l++) expect(r.deck(l).some(c => c.id.startsWith('a.'))).toBe(false);
    r.act(0, { a: 'apart', on: true });
    for (let l = 1; l <= 8; l++) expect(r.deck(l).some(c => c.id.startsWith('a.')), 'level ' + l).toBe(true);
  });
  it('keeps the private vote for hands-on video cards at Level 4 and up', async () => {
    const { APART_DECK, isGated } = await import('../shared/content');
    for (let l = 4; l <= 8; l++) expect(APART_DECK[l].filter(isGated).length, 'level ' + l).toBeGreaterThan(2);
  });
});

describe('night pacing', () => {
  it('at most one turn-it-up wildcard, never in the last four cards, and full nights get a slow-down', () => {
    for (let n = 0; n < 40; n++) {
      const r = newRoom();
      startSession(r, [5, 5], 'mid');
      let ups = 0, downs = 0, guard = 0;
      while (r.phase === 'card' && guard++ < 200) {
        const s = r.view(0).session!, v = s.card!;
        if (v.kind === 'match') { r.act(0, { a: 'next', seq: v.seq }); continue; }
        if (v.kind === 'twist') {
          if (v.dir === 'up') { ups++; expect(s.idx).toBeLessThan(s.N - 4); } else downs++;
          r.act(0, { a: 'next', seq: v.seq }); continue;
        }
        if (v.mystery && !v.flipped) { both(r, { a: 'flip', seq: v.seq }); continue; }
        if (v.gate) { both(r, { a: 'gate', seq: v.seq, v: 'y' }); continue; }
        r.act(0, { a: 'next', seq: v.seq });
      }
      expect(ups).toBeLessThanOrEqual(1);
      expect(downs).toBeGreaterThanOrEqual(1);
    }
  });
});

describe('night length', () => {
  it('deals at most one long-timer card (5+ minutes) a night', () => {
    for (let n = 0; n < 30; n++) {
      const r = newRoom();
      startSession(r, [6, 6]);
      let long = 0, guard = 0;
      while (r.phase === 'card' && guard++ < 200) {
        const v = r.view(0).session!.card!;
        if (v.kind === 'match') { r.act(0, { a: 'next', seq: v.seq }); continue; }
        if (v.kind === 'twist') { r.act(0, { a: 'next', seq: v.seq }); continue; }
        if (v.mystery && !v.flipped) { both(r, { a: 'flip', seq: v.seq }); continue; }
        if (v.gate) { both(r, { a: 'gate', seq: v.seq, v: 'y' }); continue; }
        if ((v.card!.t || 0) >= 300) long++;
        r.act(0, { a: 'next', seq: v.seq });
      }
      expect(long).toBeLessThanOrEqual(1);
    }
  });
});


/* ---------- match list, "Who's more likely" and secret roles ---------- */
/** Plays until the match round (or the night ends). */
function toMatch(r: Room) {
  let guard = 0;
  while (r.phase === 'card' && guard++ < 200) {
    const v = r.view(0).session!.card!;
    if (v.kind === 'match') return v;
    if (v.kind === 'twist') { r.act(0, { a: 'next', seq: v.seq }); continue; }
    if (v.mystery && !v.flipped) { both(r, { a: 'flip', seq: v.seq }); continue; }
    if (v.gate) { both(r, { a: 'gate', seq: v.seq, v: 'y' }); continue; }
    r.act(0, { a: 'next', seq: v.seq });
  }
  return null;
}

describe('match list', () => {
  it('comes once a night, before the peak, without taking a card\'s place', () => {
    for (const energy of ['mid', 'low'] as const) {
      const r = newRoom();
      startSession(r, [5, 5], energy);
      const m = toMatch(r)!;
      expect(m).not.toBe(null);
      expect(m.items.length).toBe(6);
      const s = r.view(0).session!;
      expect(s.idx).toBe(energy === 'mid' ? 9 : 6);
      r.act(1, { a: 'next', seq: m.seq }); // passing works like any card
      expect(r.view(0).session!.idx).toBe(s.idx);
      expect(play(r).length).toBe(s.N - s.idx);
    }
  });

  it('answers stay private; only ideas you are both open to are shown, never a no', () => {
    const r = newRoom();
    startSession(r, [4, 4]);
    const m = toMatch(r)!;
    const ids = m.items.map(i => i.id);
    // Asha: yes, yes, maybe, maybe, no, no. Sam: yes, no, yes, maybe, yes, no.
    const a = ['y', 'y', 'm', 'm', 'n', 'n'] as const, b = ['y', 'n', 'y', 'm', 'y', 'n'] as const;
    r.act(0, { a: 'match', seq: m.seq, picks: Object.fromEntries(ids.map((id, i) => [id, a[i]])) });
    const sam = r.view(1).session!.card!;
    expect(sam.kind === 'match' && sam.partnerDone).toBe(true);
    expect(sam.kind === 'match' && sam.mine).toBe(null);
    expect(JSON.stringify(r.view(1))).not.toMatch(/"(y|m|n)"/);
    r.act(1, { a: 'match', seq: m.seq, picks: Object.fromEntries(ids.map((id, i) => [id, b[i]])) });
    const shown = [0, 2, 3].map(i => m.items[i].text).sort();
    for (const me of [0, 1] as const) {
      const v = r.view(me).session!.card!;
      expect(v.kind === 'match' && v.both!.slice().sort()).toEqual(shown);
      expect(v.kind === 'match' && v.mine).toBe(null); // nobody's raw answers are sent after the reveal either
    }
    expect(JSON.stringify(r)).not.toMatch(/"picks":\[\{/); // raw answers are forgotten once revealed
    r.act(0, { a: 'next', seq: m.seq });
    play(r); both(r, { a: 'open' });
    expect(r.view(1).close!.matches.slice().sort()).toEqual(shown);
  });

  it('ignores incomplete or invented answers', () => {
    const r = newRoom();
    startSession(r, [3, 3]);
    const m = toMatch(r)!;
    r.act(0, { a: 'match', seq: m.seq, picks: { [m.items[0].id]: 'y' } });
    r.act(0, { a: 'match', seq: m.seq, picks: Object.fromEntries(m.items.map(i => [i.id, 'x'])) as never });
    expect(r.view(1).session!.card!.kind === 'match' && (r.view(1).session!.card as { partnerDone: boolean }).partnerDone).toBe(false);
  });

  it('apart, never offers ideas that need one room, and ideas rotate across nights', async () => {
    const { MATCH_BY_ID } = await import('../shared/content');
    const r = newRoom(); r.act(0, { a: 'apart', on: true });
    const seen = new Set<string>();
    for (let n = 0; n < 3; n++) {
      startSession(r, [6, 6]);
      const m = toMatch(r)!;
      for (const it of m.items) { expect(MATCH_BY_ID[it.id].where).not.toBe('together'); }
      r.act(0, { a: 'next', seq: m.seq }); play(r); both(r, { a: 'open' }); r.act(0, { a: 'finish' });
      m.items.forEach(i => seen.add(i.id));
    }
    expect(seen.size).toBeGreaterThan(6);
  });
});

/** Plays until a card of the given type is face up (or the night ends). */
function toType(r: Room, type: string) {
  let guard = 0;
  while (r.phase === 'card' && guard++ < 200) {
    const v = r.view(0).session!.card!;
    if (v.kind === 'card' && v.card?.type === type) return v;
    if (v.kind !== 'card') { r.act(0, { a: 'next', seq: v.seq }); continue; }
    if (v.mystery && !v.flipped) { both(r, { a: 'flip', seq: v.seq }); continue; }
    if (v.gate) { both(r, { a: 'gate', seq: v.seq, v: 'y' }); continue; }
    r.act(0, { a: 'next', seq: v.seq });
  }
  return null;
}

describe('who\'s more likely', () => {
  it('a pick stays private until both have picked, then both open together and count toward being in sync', () => {
    let tested = 0;
    for (let n = 0; n < 30 && tested < 3; n++) {
      const r = newRoom([1, 2, 3]);
      startSession(r, [3, 3]);
      const v = toType(r, 'Likely'); if (!v) continue;
      r.act(0, { a: 'likely', seq: v.seq, who: 1 });
      const sam = r.view(1).session!.card!;
      expect(sam.kind === 'card' && sam.likely).toEqual({ mine: null, partnerPicked: true, picks: null });
      expect(JSON.stringify(r.view(1).session!.card)).not.toContain('"mine":1');
      r.act(0, { a: 'likely', seq: v.seq, who: 0 }); // one pick each
      r.act(1, { a: 'likely', seq: v.seq, who: 1 });
      for (const me of [0, 1] as const) {
        const c = r.view(me).session!.card!;
        expect(c.kind === 'card' && c.likely!.picks).toEqual([1, 1]);
        expect(r.view(me).session!.sync).toEqual({ same: 1, of: 1 });
      }
      tested++;
    }
    expect(tested).toBeGreaterThan(0);
  });
});

describe('secret roles', () => {
  it('each phone gets only its own role, and the partner\'s never travels', async () => {
    const { CARD_BY_ID } = await import('../shared/content');
    let tested = 0;
    for (let n = 0; n < 40 && tested < 3; n++) {
      const r = newRoom([1, 2, 3]);
      startSession(r, [3, 3]);
      const v = toType(r, 'Roles'); if (!v) continue;
      const roles = CARD_BY_ID[v.card!.id].roles!;
      const a = r.view(0).session!.card!, b = r.view(1).session!.card!;
      if (a.kind !== 'card' || b.kind !== 'card') throw new Error('not a card');
      expect([a.role, b.role].sort()).toEqual(roles.slice().sort());
      expect(a.role).not.toBe(b.role);
      expect(JSON.stringify(r.view(0))).not.toContain(b.role!);
      expect(JSON.stringify(r.view(1))).not.toContain(a.role!);
      tested++;
    }
    expect(tested).toBeGreaterThan(0);
  });

  it('hands-on role-play scenes still get the private vote first, and no role is sent before it', () => {
    let tested = 0;
    for (let n = 0; n < 60 && tested < 2; n++) {
      const r = newRoom();
      startSession(r, [7, 7]);
      let guard = 0;
      while (r.phase === 'card' && guard++ < 200) {
        const v = r.view(0).session!.card!;
        if (v.kind !== 'card') { r.act(0, { a: 'next', seq: v.seq }); continue; }
        if (v.mystery && !v.flipped) { both(r, { a: 'flip', seq: v.seq }); continue; }
        if (v.gate) {
          const cur = (r as unknown as { sess: { cur: { card: { roles?: string[] } } } }).sess.cur.card;
          if (cur.roles) {
            expect(v.role).toBe(null); expect(v.card).toBe(null);
            for (const role of cur.roles) expect(JSON.stringify(r.view(0)) + JSON.stringify(r.view(1))).not.toContain(role);
            tested++;
          }
          both(r, { a: 'gate', seq: v.seq, v: 'y' }); continue;
        }
        r.act(0, { a: 'next', seq: v.seq });
      }
    }
    expect(tested).toBeGreaterThan(0);
  });
});

describe('night shape', () => {
  it('about a third of a night is at the level you chose, and it opens and closes calm', async () => {
    const { isGated } = await import('../shared/content');
    for (const [lv, min] of [[3, 4], [5, 4], [8, 4], [2, 9]] as const) {
      for (let n = 0; n < 12; n++) {
        const r = newRoom([1, 2, 3, 4, 5, 6, 7, 8].filter(l => l <= lv));
        startSession(r, [lv, lv]);
        const cards: { l: number; type: string; gated: boolean }[] = []; let guard = 0;
        while (r.phase === 'card' && guard++ < 200) {
          const v = r.view(0).session!.card!;
          if (v.kind !== 'card') { r.act(0, { a: 'next', seq: v.seq }); continue; }
          if (v.mystery && !v.flipped) { both(r, { a: 'flip', seq: v.seq }); continue; }
          const cur = (r as unknown as { sess: { cur: { card: import('../shared/content').Card } } }).sess.cur.card;
          if (v.gate) { cards.push({ l: cur.l, type: cur.type, gated: true }); both(r, { a: 'gate', seq: v.seq, v: 'y' }); r.act(0, { a: 'next', seq: v.seq }); continue; }
          cards.push({ l: cur.l, type: cur.type, gated: isGated(cur) });
          r.act(0, { a: 'next', seq: v.seq });
        }
        expect(cards.length).toBe(16);
        expect(cards.filter(c => c.l === lv).length, `level ${lv}`).toBeGreaterThanOrEqual(min);
        for (const c of [cards[0], cards[15]]) { expect(c.gated).toBe(false); expect(['Scene', 'Roles']).not.toContain(c.type); }
        if (lv === 8) expect(cards.filter(c => c.type === 'Scene').length).toBeLessThanOrEqual(4);
      }
    }
  });
});

describe('peeking at a level', () => {
  it('shows three different cards and never a secret role', () => {
    for (let l = 3; l <= 8; l++) for (let n = 0; n < 20; n++) {
      const r = newRoom([1, 2]);
      r.act(0, { a: 'unlock:open', l });
      const u = r.view(1).unlock!;
      expect(u.samples.length).toBe(3);
      expect(new Set(u.samples.map(c => c.id)).size).toBe(3);
      for (const c of u.samples) { expect(c.roles).toBeUndefined(); expect(c.type).not.toBe('Likely'); }
      expect(JSON.stringify(r.view(0))).not.toContain('"roles"');
    }
  });
});

describe('next time list', () => {
  const rate = (r: Room, m: { seq: number; items: { id: string }[] }, a: string[], b: string[]) => {
    r.act(0, { a: 'match', seq: m.seq, picks: Object.fromEntries(m.items.map((it, i) => [it.id, a[i]])) as never });
    r.act(1, { a: 'match', seq: m.seq, picks: Object.fromEntries(m.items.map((it, i) => [it.id, b[i]])) as never });
  };
  it('keeps only what you were both open to, on both phones, and never asks those again', async () => {
    const { sanitizeProgress, mergeProgress } = await import('../shared/progress');
    const r = newRoom();
    startSession(r, [4, 4]);
    const m = toMatch(r)!;
    rate(r, m, ['y', 'y', 'n', 'n', 'm', 'n'], ['y', 'n', 'y', 'n', 'y', 'n']);
    const want = [m.items[0], m.items[4]].map(i => i.id).sort();
    for (const me of [0, 1] as const) {
      expect(r.view(me).wishes.map(w => w.id).sort()).toEqual(want);
      expect(r.progressFor(me).wishes.slice().sort()).toEqual(want); // what each phone stores: ids of the overlap only
      expect(JSON.stringify(r.progressFor(me))).not.toMatch(/:"[ymn]"/);
    }
    r.act(0, { a: 'next', seq: m.seq }); play(r); both(r, { a: 'open' }); r.act(0, { a: 'finish' });
    for (let n = 0; n < 4; n++) { // later match lists never repeat an idea that's already on the list
      startSession(r, [4, 4]);
      const again = toMatch(r)!;
      for (const it of again.items) expect(want).not.toContain(it.id);
      r.act(0, { a: 'next', seq: again.seq }); play(r); both(r, { a: 'open' }); r.act(0, { a: 'finish' });
    }
    // Either partner can tick one off; a stale copy on the other phone doesn't bring it back.
    const stale = sanitizeProgress(JSON.parse(JSON.stringify(r.progressFor(1))));
    r.act(1, { a: 'wish:done', id: want[0] });
    expect(r.view(0).wishes.map(w => w.id)).toEqual([want[1]]);
    expect(mergeProgress(r.progressFor(0), stale).wishes).toEqual([want[1]]);
    r.act(0, { a: 'wish:done', id: 'm.9.999' }); // unknown ids are ignored
    expect(r.view(0).wishes.length).toBe(1);
  });
  it('a backup or upload keeps only real idea ids', async () => {
    const { sanitizeProgress } = await import('../shared/progress');
    const p = sanitizeProgress({ wishes: ['m.4.1', '<b>', 7, 'm.4.1x', '4h1'], wishesDone: ['m.2.0', {}] });
    expect(p.wishes).toEqual(['m.4.1']); expect(p.wishesDone).toEqual(['m.2.0']);
  });
});
