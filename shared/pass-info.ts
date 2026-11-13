// What the phone needs to describe the Couple Pass, without the cards themselves (those stay on the server).
// tests/store.test.ts or content tests check these match shared/decks.ts.
export type DeckId = 'distance' | 'languages' | 'slow';
export const PASS_INFO: Record<DeckId, { name: string; blurb: string }> = {
  distance: { name: 'Long distance', blurb: "For nights on a video call, or when one of you is away." },
  languages: { name: 'Love languages', blurb: "Words, time, help, gifts and touch: find out which ones land." },
  slow: { name: 'Slow nights', blurb: "Unhurried, goal-free closeness. Nothing has to lead anywhere." },
};
export const DECK_IDS = Object.keys(PASS_INFO) as DeckId[];
export const PASS_CARD_TOTAL = 40;
