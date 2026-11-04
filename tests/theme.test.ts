import { describe, expect, it } from 'vitest';
import { cardColors, contrast, themeTokens, VIBES, VIBE_IDS, type Mode } from '../shared/theme';

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
