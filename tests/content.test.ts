import { describe, expect, it } from 'vitest';
import { APART_DECK, CLOSING, DECK, ENVELOPES, TWIST_DOWN, TWIST_UP } from '../shared/content';
import { PASS_DECK } from '../shared/decks';

// CLAUDE.md rule 2, checked on every card, twist, closer and envelope.
const cards = [...Object.values(DECK).flat(), ...Object.values(APART_DECK).flat(), ...Object.values(PASS_DECK).flat()];
const texts = [...cards.map(c => c.text), ...TWIST_UP, ...TWIST_DOWN, ...CLOSING, ...ENVELOPES];

describe('content rules', () => {
  it('is gender-neutral', () => {
    for (const t of texts) expect(t, t).not.toMatch(/\b(he|she|him|her|his|hers|boyfriend|girlfriend|husband|wife|man|woman|guy|girl|boy)\b/i);
  });
  it('has no intoxication, youthful or family framing', () => {
    for (const t of texts) expect(t, t).not.toMatch(/\b(drunk|tipsy|wine|beer|alcohol|vodka|whisk(e)?y|cocktail|shots|weed|at the bar|teacher|student|schoolgirl|daddy|mommy|step-?(mom|dad|sister|brother)|babysit|virgin)\b/i);
  });
  it('stays suggestive, never graphic', () => {
    for (const t of texts) expect(t, t).not.toMatch(/\b(penis|vagina|breasts?|nipples?|orgasm|oral|genital|naked|nude|sex)\b/i);
  });
  it('has no duplicate cards and nothing too long to read in one go', () => {
    const seen = new Set<string>();
    for (const t of texts) { const k = t.toLowerCase(); expect(seen.has(k), t).toBe(false); seen.add(k); }
    for (const t of texts) expect(t.split(/\s+/).length, t).toBeLessThanOrEqual(32);
  });
  it('every card has a type and a topic', () => {
    for (const c of cards) { expect(c.type, c.id).toBeTruthy(); expect(c.topic, c.id).toBeTruthy(); }
  });
});
