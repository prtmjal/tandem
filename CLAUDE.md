# Tandem After Dark: notes for Claude

A two-phone couples game. React (Vite) phone app plus one Node server with Socket.IO. Server and app deploy together as one service.

## Commands
- `npm install`, then `npm run dev` (Vite on :5173 proxies to the server on :3001)
- `npm test` (Vitest: engine, privacy, palette contrast), `npm run typecheck`
- `npm run build && npm start` (production server on :3001, serves `dist/`)
- `npm run e2e` (two simulated phones; needs the server running and Playwright)
- `npm run e2e:pass` (buy the Couple Pass against a fake Stripe; starts its own servers; run `npm run build` first)

## Rules that must not break
1. **Private choices never reach the partner's phone.** Ceiling picks, yes/maybe/not-tonight votes and "curious" taps exist only in server memory. `Room.view(me)` may expose only "partner has answered" booleans and derived outcomes (the lower ceiling, whether a card is shown, which levels both chose). Card text for a gated or face-down mystery card is not sent until it resolves. Any change to `server/game.ts` or `shared/protocol.ts` must keep `tests/game.test.ts` passing; add a test for any new private input.
2. **Content stays suggestive at most, never graphic.** Gender- and anatomy-neutral wording ("one of you", "your partner"). No minors or youthful framing, family role-play, non-consent themes, intoxication, or real people. Every card can be passed with one tap. Edit cards only in `shared/content.ts`.
3. **Every theme passes WCAG AA.** Colours come from `shared/theme.ts` (vibe sets hue, level sets chroma and depth; five vibes: Rose, Coral, Plum, Lagoon, Iris). `tests/theme.test.ts` checks every vibe x level x mode and the partner chips. Partner identity never rests on colour alone: each vibe has a glyph. Errors and stop states use neutral ink and an icon, never red. No saffron and no pure white surfaces. Consent controls (`.ctrl`) look the same in every theme.
4. **Consent controls are equal-weight.** Pass and Next are the same `.ctrl` button (`PassNext` in `src/App.tsx`), side by side, Pass on the left. No swipe gestures. Pause sits in the bottom thumb zone on every card. Never add streaks, guilt copy or countdown pressure.
5. **Sound and touch never leak or nag.** All of it is off until the player turns it on (`src/feel.ts`). Pass and Next, and yes / maybe / not tonight, must sound and feel identical. Every private-vote reveal plays the same cue, whether the card was kept or swapped. Music plays on one phone only. Touches reach a partner only if they allowed them. Every cue has a visual twin (iPhone can't vibrate).
6. **Every person confirms 18+ on their own phone.** `create` and `join` must carry `adult: true` (`isAdultAttested` in `shared/protocol.ts`) or the server refuses them. Bump `AGE_OK` to ask everyone again. Never let one partner confirm for the other.
7. **The Couple Pass adds depth, never access.** Paid decks live in `shared/decks.ts` and mix into levels a couple can already play; a purchase never opens a level, skips a vote or changes a ceiling. Offer it only on the map screen, never during a night, with no countdowns or guilt copy. One purchase covers both partners. Payments stay off unless Stripe env vars are set (`server/store.ts`).
8. **No hosting on serverless or shared Node hosting.** Rooms live in memory and need inbound WebSockets (Render, Railway, Fly, or a VPS).

## Layout
- `index.html` + `src/landing.ts` + `src/landing.css` public landing page at `/` (no framework, keep JS tiny); `privacy.html` at `/privacy`; `play.html` is the game at `/play`. The landing page may show only real Level 1-3 cards (`tests/landing.test.ts`), never later-level text, and makes only privacy claims the code backs. Fonts are self-hosted (`@fontsource-variable/*`); add no third-party requests.
- `shared/content.ts` cards and levels; `shared/protocol.ts` messages; `shared/theme.ts` palette
- `shared/decks.ts` Couple Pass decks; `server/store.ts` Stripe Checkout and signed pass codes (no database)
- `server/game.ts` room engine (deck, session arc, votes); `server/index.ts` sockets, codes, rate limits, expiry
- `src/feel.ts` synthesized sounds, music loop, haptics and their settings; `src/guide.tsx` the How it works intro and one-time tips
- `src/App.tsx` screens; `src/ui.tsx` card, countdown, reactions; `src/art.tsx` generated card art; `src/net.ts` socket client and on-device storage
