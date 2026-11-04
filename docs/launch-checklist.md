# Launch checklist

Status as of November 2026. ✅ done in code · 🟡 needs you · ⬜ not started

## 1. Private test launch (can happen now)

- ✅ Game, landing page, privacy page, payments (off), email list (off), backups, share cards and apart mode are built.
- ✅ 60 unit tests, the two-phone browser test and the purchase test pass. npm audit reports 0 vulnerabilities.
- ✅ A production build from a clean install serves every page and API.
- 🟡 Deploy to Railway (Deploy from GitHub repo; it uses the `Dockerfile`), then Settings → Networking → Generate Domain. No variables needed.
- 🟡 Play several real nights on two real phones. Use one iPhone and one Android if you can, and include:
  - [ ] the invite link opened from WhatsApp and from Instagram (their built-in browsers)
  - [ ] sounds, music on one phone, vibration (Android), "send a touch"
  - [ ] the iPhone silent switch on and off
  - [ ] locking a phone mid-night, then coming back (it should reconnect)
  - [ ] one apart night on a real video call
  - [ ] a share card posted to Instagram Stories
  - [ ] a backup made on one phone and restored on another
  - [ ] Add to Home Screen, then play from the icon
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
- 🟡 **Content review** of all 340 cards by an LGBTQ+ sex educator.
- 🟡 **Payments**, if you want them at launch:
  - [ ] get Stripe's written approval (describe it as a couples' relationship and conversation game)
  - [ ] create the one-time price, plus optional regional prices
  - [ ] set `STRIPE_SECRET_KEY`, `STRIPE_PRICE_PASS` and `LICENSE_SECRET` (keep it forever)
  - [ ] set a discreet statement descriptor in Stripe
  - [ ] change the "Is it free?" answer in `index.html`
- 🟡 **Email list:** a Klaviyo account for this product, a double opt-in list, then `KLAVIYO_COMPANY_ID` and `KLAVIYO_LIST_ID`.
- ⬜ **Uptime alert** on `/healthz` (for example UptimeRobot or Better Stack, free tier).
- ⬜ **Privacy-friendly counts.** Rooms started, partners joined and nights finished, as server-side totals only. Without these you can't see whether the landing page works. Not built yet.

## 3. Known limits

- **Deploys end live games.** Rooms live in server memory, so a deploy or restart closes every game in progress. Progress is safe on the phones, but couples mid-night are dropped. Deploy at quiet hours (for example, mid-morning in your main market).
- **One server.** One instance handles many couples. Running more than one needs a shared store (Redis), which is a later step.
- **Bundle size.** The game's first load is about 153 KB of JavaScript (gzip), just over the 150 KB target in the design report. That's fine for now; trim before marketing to budget phones.
- **Music** is a generated loop. Commission real loops before a big launch if you want richer sound.
- **Self-declared 18+ only.** It's the norm for non-explicit apps, but get the lawyer's view per country (see above).
