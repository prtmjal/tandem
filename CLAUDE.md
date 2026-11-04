# Tandem After Dark: notes for Claude

A two-phone couples game. React (Vite) phone app plus one Node server with Socket.IO. Server and app deploy together as one service.

## Commands
- `npm install`, then `npm run dev` (Vite on :5173 proxies to the server on :3001)
- `npm test` (Vitest: engine, privacy, palette contrast), `npm run typecheck`
- `npm run build && npm start` (production server on :3001, serves `dist/`)
- `npm run e2e` (two simulated phones; needs the server running and Playwright)

## Rules that must not break
1. **Private choices never reach the partner's phone.** Ceiling picks, yes/maybe/not-tonight votes and "curious" taps exist only in server memory. `Room.view(me)` may expose only "partner has answered" booleans and derived outcomes (the lower ceiling, whether a card is shown, which levels both chose). Card text for a gated or face-down mystery card is not sent until it resolves. Any change to `server/game.ts` or `shared/protocol.ts` must keep `tests/game.test.ts` passing; add a test for any new private input.
2. **Content stays suggestive at most, never graphic.** Gender- and anatomy-neutral wording ("one of you", "your partner"). No minors or youthful framing, family role-play, non-consent themes, intoxication, or real people. Every card can be passed with one tap. Edit cards only in `shared/content.ts`.
3. **Every theme passes WCAG AA.** Colours come from `shared/theme.ts` (vibe sets hue, level sets chroma and depth). `tests/theme.test.ts` checks all 96 combinations. No saffron and no pure white surfaces. Consent controls (`.ctrl`) look the same in every theme.
4. **Consent controls are equal-weight.** Pass is the same size and tap cost as Next. Never add streaks, guilt copy or countdown pressure.
5. **No hosting on serverless or shared Node hosting.** Rooms live in memory and need inbound WebSockets (Render, Railway, Fly, or a VPS).

## Layout
- `shared/content.ts` cards and levels; `shared/protocol.ts` messages; `shared/theme.ts` palette
- `server/game.ts` room engine (deck, session arc, votes); `server/index.ts` sockets, codes, rate limits, expiry
- `src/App.tsx` screens; `src/ui.tsx` card, countdown, reactions; `src/art.tsx` generated card art; `src/net.ts` socket client and on-device storage
