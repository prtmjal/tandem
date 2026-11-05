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
2. **Content stays suggestive at most, never graphic.** Gender- and anatomy-neutral wording ("one of you", "your partner"). No minors or youthful framing, family role-play, non-consent themes, intoxication, or real people. Every card can be passed with one tap. Edit cards only in `shared/content.ts` (and Couple Pass decks in `shared/decks.ts`). Apart mode (long distance) deals only cards where `worksApart` is true; when you add a talk card that ends in a shared physical act (a hug, a note left somewhere), add its topic to `TOGETHER_TOPICS`.
3. **Every theme passes WCAG AA.** Colours come from `shared/theme.ts` (vibe sets hue, level sets chroma and depth; five vibes: Rose, Coral, Plum, Lagoon, Iris). `tests/theme.test.ts` checks every vibe x level x mode and the partner chips. Partner identity never rests on colour alone: each vibe has a glyph. Errors and stop states use neutral ink and an icon, never red. No saffron and no pure white surfaces. Consent controls (`.ctrl`) look the same in every theme.
4. **Consent controls are equal-weight.** Pass and Next are the same `.ctrl` button (`PassNext` in `src/App.tsx`), side by side, Pass on the left. No swipe gestures. Pause sits in the bottom thumb zone on every card. Never add streaks, guilt copy or countdown pressure.
5. **Sound and touch never leak or nag.** All of it is off until the player turns it on (`src/feel.ts`). Pass and Next, and yes / maybe / not tonight, must sound and feel identical. Every private-vote reveal plays the same cue, whether the card was kept or swapped. Music plays on one phone only when together (each phone may play its own when apart). Touches reach a partner only if they allowed them. Every cue has a visual twin (iPhone can't vibrate).
6. **Every person confirms 18+ on their own phone.** `create` and `join` must carry `adult: true` (`isAdultAttested` in `shared/protocol.ts`) or the server refuses them. Bump `AGE_OK` to ask everyone again. Never let one partner confirm for the other.
7. **The Couple Pass adds depth, never access.** Paid decks live in `shared/decks.ts` and mix into levels a couple can already play; a purchase never opens a level, skips a vote or changes a ceiling. Offer it only on the map screen, never during a night, with no countdowns or guilt copy. One purchase covers both partners. Payments stay off unless Stripe env vars are set (`server/store.ts`).
8. **Share cards reveal nothing private.** Each partner opts in privately at the end of the night (`share` action); the partner's answer is never sent, and the card exists only when both said yes. The card (`src/share.ts`, drawn on the phone, never uploaded) shows only a Level 1-3 talk card played tonight (`Room.shareQuestion`) and the night count: no names, no level names, nothing from later levels.
9. **Progress stays on the phones.** No accounts and no game database (see `docs/accounts-plan.md`). Backup codes (`src/backup.ts`) and room restores never carry "curious" taps. The email list (`server/news.ts`, Klaviyo) is never linked to rooms, progress, partners or purchases, and the game itself never asks for an email.
10. **Usage counts are totals only.** `server/stats.ts` counts daily totals of funnel events (visits, games started, partners joined, nights started and finished, shares, purchases). Never add per-person data, IDs, IPs, room codes, or anything about levels, votes, ceilings or cards. Totals are kept 120 days and shown at `/stats` only with `STATS_TOKEN`.
11. **Shop links are ads, after the night only.** Affiliate links (`shared/shop.ts`, `/go/:retailer/:item`) appear only in "Tonight's kit" after the envelope opens and in the map's "Toy box", never during a night. Always labelled "Ad · Paid links" with the commission line. Kit items come only from cards both partners saw (`kitTopics`), never from swapped-away cards. Links are shown only in approved countries (`BY_COUNTRY`), never in `NO_SHOP` countries or when the country is unknown; the country is guessed on the phone and never sent. Taps are one daily total (`shopClick`); never add sub-IDs, per-item or per-person counts, or rewards for clicking. Each retailer stays off until its `SHOP_*` template is set.
12. **No hosting on serverless or shared Node hosting.** Rooms live in memory and need inbound WebSockets (Render, Railway, Fly, or a VPS).

## Layout
- `index.html` + `src/landing.ts` + `src/landing.css` public landing page at `/` (no framework, keep JS tiny); `privacy.html` at `/privacy`; `play.html` is the game at `/play`. The landing page may show only real Level 1-3 cards (`tests/landing.test.ts`), never later-level text, and makes only privacy claims the code backs. Fonts are self-hosted (`@fontsource-variable/*`); add no third-party requests.
- `shared/content.ts` cards and levels; `shared/protocol.ts` messages; `shared/theme.ts` palette
- `shared/decks.ts` Couple Pass decks; `server/store.ts` Stripe Checkout and signed pass codes (no database)
- `server/game.ts` room engine (deck, session arc, votes); `server/index.ts` sockets, codes, rate limits, expiry
- `shared/progress.ts` progress merge and sanitizing (server and phone); `src/backup.ts` backup codes; `server/news.ts` optional Klaviyo email list
- `shared/shop.ts` shop items, card-to-item matching, retailers per country; `src/region.ts` on-phone country guess
- `server/stats.ts` daily usage totals and the private `/stats` page
- `src/share.ts` share card image and share sheet
- `src/feel.ts` synthesized sounds, music loop, haptics and their settings; `src/guide.tsx` the How it works intro and one-time tips
- `src/App.tsx` screens; `src/ui.tsx` card, countdown, reactions; `src/art.tsx` generated card art (level pattern plus a picture matched to the card's text by `themeFor`: abstract objects and shapes only, never bodies, faces, hands or anatomy; face-down and gated cards never get a picture); `src/net.ts` socket client and on-device storage
