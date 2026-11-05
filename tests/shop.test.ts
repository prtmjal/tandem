import { describe, expect, it } from 'vitest';
import { KIT, NO_SHOP, RETAILERS, TOPIC_KIT, affiliateUrl, kitFor, retailersFor } from '../shared/shop';
import { DECK } from '../shared/content';
import { PASS_DECK } from '../shared/decks';
import { Room } from '../server/game';
import { emptyProgress } from '../shared/protocol';
import { EVENTS } from '../server/stats';

describe('shop rules', () => {
  it('shows no links where restricted, or when the country is unknown', () => {
    for (const c of NO_SHOP) expect(retailersFor(c)).toEqual([]);
    expect(retailersFor(null)).toEqual([]);
    expect(retailersFor('IN')[0]).toBe('mymuse');
    expect(retailersFor('BR')).toEqual([]); // not approved until a lawyer confirms
    expect(retailersFor('JP')).toEqual(['lelo']);
    for (const ids of [retailersFor('US'), retailersFor('GB'), retailersFor('DE'), retailersFor('AU')]) for (const id of ids) expect(RETAILERS[id]).toBeTruthy();
  });
  it('builds links only from a configured https template, with nothing about the person', () => {
    const amz = RETAILERS.amazonin;
    expect(affiliateUrl(amz, undefined, 'blindfold')).toBe(null);
    expect(affiliateUrl(amz, 'javascript:alert(1){rawurl}', 'blindfold')).toBe(null);
    expect(affiliateUrl(amz, '{rawurl}&tag=tandem-21', 'massage-oil')).toBe('https://www.amazon.in/s?k=massage%20oil&tag=tandem-21');
    const awin = affiliateUrl(RETAILERS.lovehoneyuk, 'https://www.awin1.com/cread.php?awinmid=1&awinaffid=2&ued={url}');
    expect(awin).toBe('https://www.awin1.com/cread.php?awinmid=1&awinaffid=2&ued=' + encodeURIComponent('https://www.lovehoney.co.uk/'));
  });
  it('kit topics are real card topics, and toy-box-only items never appear in the kit', () => {
    const topics = new Set([...Object.values(DECK).flat(), ...Object.values(PASS_DECK).flat()].map(c => c.topic));
    for (const t of Object.keys(TOPIC_KIT)) expect(topics.has(t), t).toBe(true);
    for (const k of kitFor(Object.keys(TOPIC_KIT))) expect(KIT[k].toyBoxOnly).toBeFalsy();
    expect(kitFor(['blindkiss', 'oilback']).length).toBeLessThanOrEqual(3);
  });
  it('shop taps are counted only as a total', () => {
    expect(Object.keys(EVENTS)).toContain('shopClick');
  });
});

describe("tonight's kit uses only cards both partners saw", () => {
  it('a card swapped away after a private "not tonight" never feeds the kit', () => {
    for (let n = 0; n < 6; n++) {
      const p = emptyProgress(); p.unlocked = [1, 2, 3, 4, 5, 6, 7, 8];
      const r = new Room('ABCDEF', 's', { token: 'a', name: 'A', connected: true, curious: {} }, p);
      r.join({ token: 'b', name: 'B', connected: true, curious: {} }, emptyProgress());
      r.act(0, { a: 'tonight' });
      for (const i of [0, 1] as const) { r.act(i, { a: 'ceiling:pick', l: 8 }); r.act(i, { a: 'ceiling:confirm', on: true }); r.act(i, { a: 'ceiling:done' }); }
      r.act(0, { a: 'ready' }); r.act(1, { a: 'ready' });
      const declined = new Set<string>(), seen = new Set<string>();
      let guard = 0;
      while (r.phase === 'card' && guard++ < 300) {
        const v = r.view(0).session!.card!;
        if (v.kind === 'twist') { r.act(0, { a: 'next', seq: v.seq }); continue; }
        if (v.mystery && !v.flipped) { r.act(0, { a: 'flip', seq: v.seq }); r.act(1, { a: 'flip', seq: v.seq }); continue; }
        if (v.gate) {
          const cur = (r as unknown as { sess: { cur: { card: { topic: string } } } }).sess.cur.card;
          declined.add(cur.topic);
          r.act(0, { a: 'gate', seq: v.seq, v: 'n' }); r.act(1, { a: 'gate', seq: v.seq, v: 'y' });
          continue;
        }
        seen.add(v.card!.topic);
        r.act(0, { a: 'next', seq: v.seq });
      }
      r.act(0, { a: 'open' }); r.act(1, { a: 'open' });
      const topics = r.view(0).close!.kitTopics;
      for (const t of topics) expect(seen.has(t), t).toBe(true);
      for (const t of declined) if (!seen.has(t)) expect(topics).not.toContain(t);
      expect(r.view(1).close!.kitTopics).toEqual(topics);
    }
  });
});
