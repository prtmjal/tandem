import { describe, expect, it } from 'vitest';
import { themeFor } from '../src/art';
import { DECK } from '../shared/content';
import { PASS_DECK } from '../shared/decks';

describe('card art reflects the card', () => {
  it('matches obvious cards to the right picture', () => {
    const cases: [string, string][] = [
      ['Blindfold your partner for ten minutes.', 'blindfold'],
      ['Trace an ice cube along your partner\'s neck.', 'ice'],
      ['Light one candle. Sit facing each other.', 'candle'],
      ['Slow back massage with warm oil.', 'oil'],
      ['Shower together with the lights off.', 'water'],
      ['Play a song that makes you feel charged.', 'music'],
      ["Scene: 'Room Service.' One of you orders.", 'mask'],
      ['Two truths and a lie about your life before me.', 'play'],
      ['Two minutes of teasing without touching: breath, whispers, almost-kisses.', 'kiss'],
      ['Write a one-line flirty note and hide it.', 'note'],
      ['Tell me about the first time you felt a flutter.', 'heart'],
      ['Hot take: name an opinion you hold that most people would argue with.', 'play'],
    ];
    for (const [text, theme] of cases) expect(themeFor(text), text).toBe(theme);
  });
  it('gives every card a picture, and most cards something more specific than the default', () => {
    const all = [...Object.values(DECK).flat(), ...Object.values(PASS_DECK).flat()];
    const specific = all.filter(c => themeFor(c.text) !== 'heart').length;
    expect(specific / all.length).toBeGreaterThan(0.75);
  });
});
