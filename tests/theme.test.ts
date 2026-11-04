import { describe, expect, it } from 'vitest';
import { cardColors, chipColor, contrast, themeTokens, VIBES, VIBE_IDS, type Mode } from '../shared/theme';

// The report asks for every vibe x level x mode combination (96 themes) to pass WCAG 2.2 AA.
describe('palette contrast', () => {
  const modes: Mode[] = ['light', 'dark', 'late'];
  for (const v of VIBE_IDS) for (const mode of modes) {
    it(`${v} ${mode}`, () => {
      const t = themeTokens(VIBES[v].hue, v, mode);
      expect(contrast(t.fg, t.bg)).toBeGreaterThanOrEqual(7);
      expect(contrast(t.muted, t.bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(t.accent, t.bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(t.onAccent, t.accent)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(t.ctrlFg, t.ctrlBg)).toBeGreaterThanOrEqual(15);
      for (let l = 1; l <= 8; l++) {
        const c = cardColors(l, VIBES[v].hue, mode);
        const r = contrast(c.ink, c.field);
        expect(r, `level ${l} ink ${c.ink} on ${c.field}`).toBeGreaterThanOrEqual(4.5);
        expect(contrast(c.inkSoft, c.field), `level ${l} soft ink`).toBeGreaterThanOrEqual(3);
      }
    });
  }
});

// Partner identity must never rest on colour alone, and chips must stay visible on every background.
describe('partner chips', () => {
  const modes: Mode[] = ['light', 'dark', 'late'];
  it('every vibe has its own glyph', () => {
    const g = VIBE_IDS.map(v => VIBES[v].glyph);
    expect(new Set(g).size).toBe(g.length);
  });
  for (const v of VIBE_IDS) for (const mode of modes) {
    it(`${v} ${mode} chips clear 3:1 against the page`, () => {
      for (const bgVibe of VIBE_IDS) {
        const bg = themeTokens(VIBES[bgVibe].hue, bgVibe, mode).bg;
        for (const who of ['you', 'partner'] as const) expect(contrast(chipColor(v, mode, who), bg), `${who} on ${bgVibe}`).toBeGreaterThanOrEqual(3);
      }
      expect(chipColor(v, mode, 'you')).not.toBe(chipColor(v, mode, 'partner'));
    });
  }
});
