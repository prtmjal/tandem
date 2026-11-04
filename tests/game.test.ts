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
        expect(v.gate).toBe(null); // no hands-on cards, so no private hands-on vote
        if (v.mystery && !v.flipped) { both(r, { a: 'flip', seq: v.seq }); continue; }
        expect(worksApart(v.card!), v.card!.text).toBe(true);
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
    for (let l = 1; l <= 8; l++) for (const c of r.deck(l)) if (!c.id.startsWith('p.distance.')) expect(['Do', 'Session', 'Scene']).not.toContain(c.type);
  });
});
