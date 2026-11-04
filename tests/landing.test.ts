import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { DECK } from '../shared/content';
import { contrast } from '../shared/theme';

const css = readFileSync(new URL('../src/landing.css', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

function tokens(label: string) {
  const start = css.indexOf(`/* TOKENS ${label} */`);
  const block = css.slice(start, css.indexOf('}', start));
  const t: Record<string, string> = {};
  for (const m of block.matchAll(/--([\w-]+):\s*(#[0-9A-Fa-f]{6})/g)) t[m[1]] = m[2];
  return t;
}

describe('landing page', () => {
  for (const mode of ['light', 'dark']) {
    it(`${mode} tokens pass WCAG AA`, () => {
      const t = tokens(mode);
      expect(contrast(t.ink, t.bg)).toBeGreaterThanOrEqual(7);
      expect(contrast(t.muted, t.bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(t.muted, t.raised)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(t['on-accent'], t.accent)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(t.accent, t.bg)).toBeGreaterThanOrEqual(3); // ticks and focus rings
      expect(contrast(t['ctrl-ink'], t['ctrl-bg'])).toBeGreaterThanOrEqual(7);
      for (let l = 1; l <= 8; l++) {
        const ink = mode === 'light' && l <= 4 ? t.ink : t['ink-deep'];
        expect(contrast(ink, t['l' + l]), `level ${l}`).toBeGreaterThanOrEqual(4.5);
      }
    });
  }

  it('shows only real cards from levels 1-3, never later-level text', () => {
    const shown = [...html.matchAll(/<p>“?([^<”]+?)”?<\/p>/g)].map(m => m[1].replace(/&nbsp;/g, ' ').trim());
    const safe = [1, 2, 3].flatMap(l => DECK[l].map(c => c.text));
    const later = [4, 5, 6, 7, 8].flatMap(l => DECK[l].map(c => c.text));
    const cardLike = shown.filter(s => safe.some(t => t.startsWith(s.replace(/\?$/, ''))) || later.some(t => t.includes(s)));
    expect(cardLike.length).toBeGreaterThanOrEqual(5);
    for (const s of shown) expect(later.some(t => t.includes(s)), s).toBe(false);
  });
});
