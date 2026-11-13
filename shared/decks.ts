// Couple Pass decks: extra cards that deepen the levels you already play. They never unlock a level on their own;
// level gates, ceilings and private votes work exactly as for the free deck. Same content rules as shared/content.ts:
// suggestive at most, never graphic, gender- and anatomy-neutral, every card passable.
// Status: first draft, awaiting review by an LGBTQ+ sex educator before launch.
import type { Card, Raw } from './content';
import type { DeckId } from './pass-info';
export type { DeckId };


export const DECKS: Record<DeckId, { name: string; blurb: string; cards: Record<number, Raw[]> }> = {
  distance: {
    name: 'Long distance',
    blurb: 'For nights on a video call, or when one of you is away.',
    cards: {
      1: [
        ["Show me the view from where you're sitting right now, then describe what I can't see.", 'Share', 'ld-view'],
        ["What did you eat today? Rate it out of ten and tell me who you'd rather have eaten it with.", 'Ask', 'ld-food'],
        ["Guess what's on my desk or bedside table right now. Then I'll show you.", 'Guess', 'ld-guess'],
        ['What time is it where you are, and what would we be doing together right now if we were in the same place?', 'Ask', 'ld-time'],
      ],
      2: [
        ['What is the hardest part of being apart this week, and what is one small thing that helped?', 'Ask', 'ld-hard'],
        ['Plan our next visit in five details: where, first meal, one thing to do, one thing to skip, one surprise.', 'Plan', 'ld-visit'],
        ["Tell me about a moment today when you thought of me. What set it off?", 'Share', 'ld-thought'],
        ['What do you miss about me that would surprise me?', 'Ask', 'ld-miss'],
      ],
      3: [
        ['Pick a song we both press play on at the same time. Watch each other listen, no talking.', 'Do', 'ld-song'],
        ["Describe the first ten seconds of our next hello at the airport or station. Be specific.", 'Share', 'ld-hello'],
        ['Send a voice note after this call that only plays tomorrow morning. Keep it short and sweet.', 'Note', 'ld-voice'],
        ['Hold your hand up to the camera. Your partner matches it. Stay like that for twenty seconds.', 'Do', 'ld-hands', 20],
      ],
      4: [
        ["Tell me, slowly, what you'd do in the first hour of our next night together. Keep it sweet; the details can wait.", 'Share', 'ld-first-hour'],
        ['Each say one thing you want to feel the next time we are in the same room. One word is enough.', 'Share', 'ld-feel'],
      ],
    },
  },
  languages: {
    name: 'Love languages',
    blurb: 'Words, time, help, gifts and touch: find out which ones land.',
    cards: {
      1: [
        ['Which landed more this week: something I said, or something I did? Tell me what it was.', 'Ask', 'll-said-did'],
        ['Guess the small gift that costs almost nothing but would make my day. Then I tell you if you nailed it.', 'Guess', 'll-gift'],
        ['What is a chore you would love help with, and what would help sound like?', 'Ask', 'll-chore'],
        ['Describe a perfect hour of time together with no phones. Where are we?', 'Share', 'll-hour'],
      ],
      2: [
        ['Rank these for you right now: kind words, time together, help, small gifts, touch. Then guess my ranking.', 'Guess', 'll-rank'],
        ['When you feel low, what do you want most from me: fixing, listening or distracting?', 'Ask', 'll-low'],
        ['Tell me one thing I do that you would never ask for, but always notice.', 'Appreciate', 'll-notice'],
        ['What did love look like in the home you grew up in? What do you want to keep, and what not?', 'Ask', 'll-home'],
      ],
      3: [
        ['Say three specific things you appreciate about me today. No repeats from last time.', 'Appreciate', 'll-three'],
        ['Plan a tiny act of service for tomorrow. Do not tell me what it is.', 'Plan', 'll-service'],
        ['What compliment from me would you keep thinking about all day?', 'Ask', 'll-compliment'],
      ],
      4: [
        ['Ask for the kind of touch that says "I love you" to you: a hand on the back, a hug, hair. Your partner offers it, or a version of it.', 'Do', 'll-touch'],
        ['Hold hands and take turns finishing: "I feel most loved by you when..." Three rounds each.', 'Share', 'll-loved'],
        ['A long hug for one minute. Whoever wants to can say one thing they need more of this month.', 'Do', 'll-hug', 60],
      ],
    },
  },
  slow: {
    name: 'Slow nights',
    blurb: 'Unhurried, goal-free closeness. Nothing has to lead anywhere.',
    cards: {
      4: [
        ['Lie side by side and match your breathing for two minutes. Then say what you noticed.', 'Do', 'sl-breath', 120],
        ['Trace a word on your partner\'s back with one finger. They guess it. Three words each.', 'Do', 'sl-trace'],
        ['Say one place you love being touched that is not obvious: an ear, a wrist, the back of the neck.', 'Share', 'sl-place'],
        ['Hold each other\'s faces gently and look for thirty seconds. Smile if you need to.', 'Do', 'sl-face', 30],
      ],
      5: [
        ['Three slow kisses, each one slower than the last. Then say which one you liked best.', 'Do', 'sl-three'],
        ['Whisper what you like about the way your partner kisses. Keep it to one sentence.', 'Share', 'sl-whisper'],
        ['Choose: slow, slower or slowest. Your partner sets the pace of the next minute by your choice.', 'Choose', 'sl-pace', 60],
        ['Describe the most relaxed you have ever felt with me. What made it work?', 'Ask', 'sl-relaxed'],
      ],
      6: [
        ['Five minutes of no-goal touch each way. The receiver uses only three words: "more", "less", "stay".', 'Session', 'sl-session', 300],
        ['Lights low. Each pick one sense for tonight: sound, scent, touch or taste. Plan the next ten minutes around both.', 'Choose', 'sl-senses'],
        ['Warm your hands first. Slow shoulder and neck touch for three minutes; the receiver guides.', 'Session', 'sl-warm', 180],
        ['After this card, put the phones face down for ten minutes. Pick it back up only if you both want to.', 'Choose', 'sl-down'],
      ],
    },
  },
};

export const DECK_IDS = Object.keys(DECKS) as DeckId[];

/** Couple Pass cards by level, with stable ids ("p.<deck>.<level>.<n>") so progress and parking work as usual. */
export const PASS_DECK: Record<number, Card[]> = {};
for (let l = 1; l <= 8; l++) PASS_DECK[l] = [];
for (const d of DECK_IDS) for (const l in DECKS[d].cards) DECKS[d].cards[l].forEach((c, i) =>
  PASS_DECK[+l].push({ id: `p.${d}.${l}.${i}`, l: +l, text: String(c[0]), type: String(c[1]), topic: String(c[2]), t: Number(c[3] || 0) }));
export const PASS_CARD_COUNT = Object.values(PASS_DECK).reduce((a, b) => a + b.length, 0);
