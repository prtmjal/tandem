# Launch checklist

Status as of November 2026. ✅ done in code · 🟡 needs you · ⬜ not started

## 1. Private test launch (can happen now)

- ✅ Game, landing page, privacy page, payments (off), email list (off), backups, share cards and apart mode are built.
- ✅ 102 unit tests (including content rules on every card and privacy of the match list, "Who's more likely" picks and secret roles) and three browser tests (together, apart, purchase) pass. npm audit reports 0 vulnerabilities.
- ✅ A production build from a clean install serves every page and API.
- ✅ Deployed to Railway at https://tandem-after-dark-production.up.railway.app
- 🟡 Finish the Railway setup: variables `STATS_TOKEN` and `PUBLIC_URL`, a volume at `/data` with `STATS_FILE=/data/stats.json`, and Healthcheck path `/healthz`.
- 🟡 Play several real nights on two real phones. Use one iPhone and one Android if you can, and include:
  - [ ] the invite link opened from WhatsApp and from Instagram (their built-in browsers)
  - [ ] sounds, music on one phone, vibration (Android), "send a touch"
  - [ ] the iPhone silent switch on and off
  - [ ] locking a phone mid-night, then coming back (it should reconnect)
  - [ ] one apart night on a real video call
  - [ ] a share card posted to Instagram Stories
  - [ ] a backup made on one phone and restored on another
  - [ ] Add to Home Screen, then play from the icon
  - [ ] sealed answers and messages, together and apart
- 🟡 Invite 5–10 couples you trust and ask what confused them.

## 2. Before a public launch

- 🟡 **Name and domain.** Pick the name, check trademarks (US, EU, UK, India; classes 9 and 41) and buy the domain. Then:
  - [ ] point the domain at Railway (Custom Domain + CNAME)
  - [ ] set `PUBLIC_URL`
  - [ ] update the name in `index.html`, `play.html`, `privacy.html`, `public/manifest.webmanifest`, `src/share.ts` and the founder note
- 🟡 **Legal review** with a lawyer:
  - [ ] terms of service and a full privacy policy (`/privacy` today is a plain-language summary)
  - [ ] the 18+ approach, and Brazil (ECA Digital may not accept a self-declared age)
  - [ ] India IT Act 67/67A and the DPDP Act
  - [ ] EU accessibility and consumer law, if selling in the EU
- 🟡 **Content review** of all 619 cards (536 free together, 43 free apart, 40 Couple Pass) plus 83 match-list ideas and the secret roles by an LGBTQ+ sex educator.
- 🟡 **Payments**, if you want them at launch:
  - [ ] get Stripe's written approval (describe it as a couples' relationship and conversation game)
  - [ ] create the one-time price, plus optional regional prices
  - [ ] set `STRIPE_SECRET_KEY`, `STRIPE_PRICE_PASS` and `LICENSE_SECRET` (keep it forever)
  - [ ] set a discreet statement descriptor in Stripe
  - [ ] change the "Is it free?" answer in `index.html`
- 🟡 **Email list:** a Klaviyo account for this product, a double opt-in list, then `KLAVIYO_COMPANY_ID` and `KLAVIYO_LIST_ID`.
- 🟡 **Shop links (affiliate):** on as plain "Gift ideas" links (no commission) in approved countries; `SHOP_OFF=1` hides them. To earn from them, after the domain: follow the sign-up order in `reports/Sexual wellness affiliate programs.md` (bank account and accountant first, then W-8BEN, Awin, Impact, Commission Factory, Indian networks). Check each rate in the network dashboard, then set the `SHOP_*` templates. Ask the lawyer about Brazil, Singapore and the Philippines before adding them.
- ⬜ **Uptime alert** on `/healthz` (for example UptimeRobot or Better Stack, free tier).
- ✅ **Privacy-friendly counts** are built (`/stats`). 🟡 Set `STATS_TOKEN`, and add a Railway volume with `STATS_FILE=/data/stats.json` so totals survive deploys.

## 3. Known limits

- **Deploys end live games.** Rooms live in server memory, so a deploy or restart closes every game in progress. Progress is safe on the phones, but couples mid-night are dropped. Deploy at quiet hours (for example, mid-morning in your main market).
- **One server.** One instance handles many couples. Running more than one needs a shared store (Redis), which is a later step.
- **Bundle size.** The game's first load is about 151 KB of JavaScript (gzip), on the 150 KB target. Card text is no longer in the download; it arrives one card at a time.
- **Card art** is matched to card text by keywords; a few cards may get a loosely related picture. Report any that look wrong.
- **Music** is a generated loop. Commission real loops before a big launch if you want richer sound.
- **Self-declared 18+ only.** It's the norm for non-explicit apps, but get the lawyer's view per country (see above).
