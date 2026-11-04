# Tandem After Dark

A two-phone game for couples, from first sparks to midnight. Each partner plays on their own phone. Private choices (how far tonight, yes / maybe / not tonight, curious about a level) stay on the server and are never sent to the other phone; only the outcome is.

## Run it on your computer

```bash
npm install
npm run dev
```

The landing page is at http://localhost:5173 and the game at http://localhost:5173/play. Open the game in two browser windows (or one window plus your phone on the same Wi-Fi, using your computer's local IP, e.g. `http://192.168.1.20:5173`). Start a room in one, join with the code in the other.

## Checks

```bash
npm test          # engine, privacy and palette contrast tests (42 tests)
npm run typecheck
npm run build && npm start   # production server on :3001
npm run e2e       # two simulated phones play a full night (needs the server running)
```

## Deploy

The server and the web app ship together as one Node service. Any host that keeps a process running works. Vercel's serverless functions are not a good fit, because rooms live in the server's memory.

**Render (free, good for private playtests).** Push this folder to a GitHub repo, then on render.com choose New, then Blueprint, and pick the repo. `render.yaml` sets everything up. The free plan sleeps after 15 idle minutes, so the first visit after a break takes up to a minute to wake.

**Railway (about $5 a month, always on).** New project, deploy from GitHub repo. It detects the `Dockerfile`. Set no variables; it provides `PORT`.

Use HTTPS in production (both hosts do this for you). Vibration, wake lock and installing to the home screen need it.

## How it works

| Part | Where |
|---|---|
| Cards (300), levels, twists, envelopes | `shared/content.ts` |
| Palette: vibe sets hue, level sets depth; every theme contrast-checked | `shared/theme.ts`, `tests/theme.test.ts` |
| Game rules, session arc, no-repeat deck, private votes | `server/game.ts` |
| Rooms, codes, rate limits, expiry | `server/index.ts` |
| Phone app: screens, card art, motion | `src/App.tsx`, `src/ui.tsx`, `src/art.tsx` |
| Landing page (`/`) and privacy summary (`/privacy`) | `index.html`, `privacy.html`, `src/landing.ts`, `src/landing.css` |

**Rooms.** A room has a 6-character code and a 128-bit secret. The invite link and QR code carry the secret and work until the partner joins. A typed code alone only works for 15 minutes. Joins are rate-limited per network. A room holds exactly two people, closes after 30 minutes with nobody connected, and closes after 8 hours regardless. Nothing about a room is kept after it closes.

**Progress.** Each phone keeps its own progress (unlocked levels, cards already seen, kept answers) in local storage and uploads it when joining. The server merges both phones' progress for the night and sends it back at the end. Each phone's private "curious" taps stay with that phone only.

**Privacy you can't design away.** When tonight plays at the lower of two ceilings, the partner who chose higher can infer the other's choice. When someone taps "curious" and a level doesn't open, they can infer their partner hasn't tapped yet. The copy is written around this.

## Before a public launch

- Have an LGBTQ+ sex educator review the card text, and a lawyer confirm IT Act 67/67A and DPDP positioning.
- Running more than one server instance needs a shared store (Redis adapter for Socket.IO) or a move to Supabase or Cloudflare Durable Objects. One instance comfortably handles a lot of couples.
