import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { DECKS, PASS_CARD_COUNT } from '../shared/decks';
import { DECK_IDS, PASS_INFO, PASS_CARD_TOTAL } from '../shared/pass-info';
import { DECK, MATCH } from '../shared/content';
import { looksLikeId } from '../shared/progress';

// Card text lives only on the server and reaches a phone one card at a time. If the phone app imported the deck,
// every later-level card and every "secret" role would ship to every phone inside the JavaScript.
describe('the phone app never carries the deck', () => {
  const read = (f: string) => readFileSync(f, 'utf8');
  const valueImports = (src: string) => Array.from(src.matchAll(/^import (?!type )[^;]*? from '([^']+)'/gm)).map(m => m[1]);
  it('no file in src/, and no shared module it uses, imports cards as values', () => {
    const files = readdirSync('src').filter(f => /\.tsx?$/.test(f)).map(f => 'src/' + f);
    const seen = new Set<string>();
    while (files.length) {
      const f = files.pop()!; if (seen.has(f)) continue; seen.add(f);
      for (const imp of valueImports(read(f))) {
        expect(/shared\/(content|decks)$|^\.\/(content|decks)$/.test(imp) && !f.startsWith('shared/content') && !f.startsWith('shared/decks'), `${f} imports ${imp}`).toBe(false);
        const m = imp.match(/(?:\.\.\/shared|^\.)\/([\w-]+)$/);
        if (m && (f.startsWith('shared/') || imp.includes('shared/'))) files.push(`shared/${m[1]}.ts`);
      }
    }
    expect(seen.has('shared/progress.ts')).toBe(true);
  });
  it('the pass summary shown on the phone matches the real decks', () => {
    expect(PASS_CARD_TOTAL).toBe(PASS_CARD_COUNT);
    expect(DECK_IDS).toEqual(Object.keys(DECKS));
    for (const d of DECK_IDS) { expect(PASS_INFO[d].name).toBe(DECKS[d].name); expect(PASS_INFO[d].blurb).toBe(DECKS[d].blurb); }
  });
  it('the phone recognises every real id by its shape', () => {
    for (const c of Object.values(DECK).flat()) expect(looksLikeId(c.id), c.id).toBe(true);
    for (const m of Object.values(MATCH).flat()) expect(looksLikeId(m.id), m.id).toBe(true);
    for (const d of DECK_IDS) expect(looksLikeId(`p.${d}.3.1`)).toBe(true);
    expect(looksLikeId('a.4.2')).toBe(true);
    expect(looksLikeId('<script>')).toBe(false);
  });
});
