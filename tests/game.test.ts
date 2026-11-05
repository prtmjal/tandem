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
    const safe = new Set([1, 2, 3].flatMap(l => DECK[l].filter(c => ['Ask', 'Share', 'Note', 'Guess', 'Appreciate', 'Revisit'].includes(c.type)).map(c => c.text)));
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
