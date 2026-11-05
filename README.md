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
npm test          # engine, privacy and palette contrast tests (71 tests)
npm run typecheck
npm run build && npm start   # production server on :3001
npm run e2e       # two simulated phones play a full night (needs the server running)
```

## Deploy

The server and the web app ship together as one Node service. Any host that keeps a process running works. Vercel's serverless functions are not a good fit, because rooms live in the server's memory.

**Render (free, good for private playtests).** Push this folder to a GitHub repo, then on render.com choose New, then Blueprint, and pick the repo. `render.yaml` sets everything up. The free plan sleeps after 15 idle minutes, so the first visit after a break takes up to a minute to wake.

**Railway (about $5 a month, always on).** New project, deploy from GitHub repo. It detects the `Dockerfile`. Set no variables; it provides `PORT`.

Use HTTPS in production (both hosts do this for you). Vibration, wake lock and installing to the home screen need it.

## Long distance

On the night-setup screen, either partner can choose **Apart, on a call**. The game then deals only cards that work over video (no hands-on cards, so no hands-on votes), drops a level when too few such cards are left, skips same-room twists and envelopes, lets each phone play its own music, and puts "send a touch" up front. With the Couple Pass, the Long distance deck appears only on nights apart.

## Keeping progress safe (no accounts)

Progress lives on the two phones and merges whenever they join a game, so it's only lost if both phones lose it. To make that unlikely:

- **The Couple Pass is kept on both phones.** When the pass is on in a game, the code is copied to the partner's phone.
- **Add to home screen.** After a couple's second night, the map shows a one-time prompt (Android's install prompt, or Safari's Share > Add to Home Screen steps). It never appears during a night, and never again after "No thanks".
- **Backup code.** Settings > Your progress > Back up our progress makes an encrypted code and QR. Scanning the QR opens the game and offers to restore, and the code can also be pasted under Restore. It never includes the private "curious" taps, and the server never sees it.

Accounts with encrypted sync (passkeys) are planned for later; see `docs/accounts-plan.md`.

## Email list (optional)

The landing page shows a "Tell me about new decks" sign-up only when these are set:

| Variable | What it is |
|---|---|
| `KLAVIYO_COMPANY_ID` | Your Klaviyo public API key (site ID). Use a Klaviyo account for this product, not another brand's |
| `KLAVIYO_LIST_ID` | The list to add people to. Set the list's opt-in process to double opt-in |

Only the email address is sent, straight to Klaviyo. The game never stores it or links it to anything.

## Usage counts

The server keeps daily totals so you can see whether the game works: landing visits, games started, partners joined (and how many by link), nights started and finished, nights apart, share cards, Couple Pass checkouts and purchases, and email sign-ups. No cookies, IDs, IP addresses or room codes, and nothing about levels, votes or cards. Totals are kept for 120 days.

| Variable | What it is |
|---|---|
| `STATS_TOKEN` | Any secret of 16+ characters. Open `/stats` and enter it to see the numbers. Without it, `/stats` doesn't exist |
| `STATS_FILE` | Optional, e.g. `/data/stats.json` on a Railway volume, so totals survive restarts. Without it they reset on each deploy, but each day's totals are still printed to the server log |

The two numbers that matter most are shown at the top: **Partner joined** (of games started, how many got a partner, which is the real conversion) and **Nights finished**.

## Shop suggestions (affiliate links)

After the envelope opens, "Tonight's kit" can suggest up to three things that match cards you both saw (a blindfold after a blindfold card, massage oil after an oil card). The map has an optional "Toy box". Both are labelled "Ad · Paid links", never appear during a night, and can be turned off in Settings. The country is guessed on the phone (time zone and language) and never sent to the server. Links show only in approved countries (`BY_COUNTRY` in `shared/shop.ts`), and never in countries where these products are restricted or when the country is unknown.

Each retailer is off until you set its affiliate link template. In a template, `{url}` is the URL-encoded shop address and `{rawurl}` the plain one:

| Variable | Shop | Example template |
|---|---|---|
| `SHOP_MYMUSE` | MyMuse (India) | your vCommission or FlexOffers deep link with `{url}` |
| `SHOP_AMAZON_IN` | Amazon.in | `{rawurl}&tag=yourtag-21` |
| `SHOP_LOVEHONEY_US`, `_CA`, `_UK`, `_AU` | Lovehoney | your network deep link with `{url}` |
| `SHOP_DAME`, `SHOP_LELO`, `SHOP_AMORELIE`, `SHOP_EIS`, `SHOP_PASSAGE`, `SHOP_SINFUL` | as named | your network deep link with `{url}` |

Taps go through `/go/<shop>/<item>`, which counts one daily total (shown on `/stats`) and redirects with nothing about the person attached. See `reports/Sexual wellness affiliate programs.md` for programmes, rates (all unverified) and the sign-up order.

## Share cards

At the end of a night, each partner can privately say they'd be happy to share a card about it. Only if both say yes does a story-sized image appear on both phones: one question you played tonight from Levels 1-3, how many nights you've played, and the game's name and address. No names and nothing private. It's drawn on the phone and shared through the phone's own share sheet (or saved, where sharing files isn't supported). Either partner can take it away again with "Not now".

## Couple Pass (optional payments)

The game is free unless you turn payments on. The Couple Pass is a one-time purchase that adds 40 extra cards in three decks (Long distance, Love languages, Slow nights) to the levels a couple already plays. One purchase covers both partners. There is no database: after payment the phone keeps a signed pass code, and bringing it into a room turns the pass on for both phones. The code can be pasted on a new phone under Settings.

To turn it on, set these on your host:

| Variable | What it is |
|---|---|
| `STRIPE_SECRET_KEY` | Your Stripe secret key (`sk_live_...`, or `sk_test_...` to try it) |
| `STRIPE_PRICE_PASS` | The Stripe Price ID for the pass, e.g. a one-time $19.99 price |
| `STRIPE_PRICE_PASS_IN`, `_BR`, `_ID`, ... | Optional regional prices by country code. Used when your host sends a country header (Cloudflare `cf-ipcountry`, Fly, Vercel) |
| `LICENSE_SECRET` | A random string of at least 32 characters. Keep it forever: changing it invalidates every pass code |
| `PUBLIC_URL` | Optional. Your public address, e.g. `https://play.yourdomain.com`, for Stripe's return link |

Before going live, ask Stripe to approve the business in writing (describe it as a couples' relationship and conversation game), set a discreet statement descriptor in the Stripe dashboard, and change the landing page FAQ answer "Is it free?" in `index.html`.

## How it works

| Part | Where |
|---|---|
| Cards (424), levels, twists, envelopes | `shared/content.ts` |
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
