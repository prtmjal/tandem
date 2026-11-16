# Free viral and referral loops for a two-player couples product

Research limits: WebFetch could not reach techcrunch.com or gamedeveloper.com (hosts not in the session network allowlist), so only search-result summaries were available, and no primary-source pages were read in full. Almost no couples-app invite-acceptance data is public. Figures below are labelled as vendor, secondary or anecdotal where relevant.

## Benchmarks: invite-to-join, partner acceptance, drop-off at "send the link"

### Takeaway
No reliable published invite-to-join rate exists for Paired, Between, Lovewick, Locket, Splitwise, Hinge or two-player games; I found none. The only usable numbers are generic referral benchmarks (invitation conversion 8-10% "good", under 4% "not good") that do not fit a one-to-one partner invite, where the real rate is likely far higher because the sender already has a specific person in mind. Nod Twice should measure its own funnel.

### Cited Findings
- No published partner-acceptance rate was found for couples apps; search returned only descriptions of invite flows. Some apps gate use until the partner accepts, and some show per-invite status (sent/accepted), so the operators can measure it but have not published it — [Aaptiv help (invite status)](https://support.aaptiv.com/kb/how-do-i-know-if-theyve-accepted-the-invitation)
- Paired's flow: after download the user is asked whether to pair, gets a unique code to share, and can pair later or use the app alone; users are mainly 30-50, mixed new, long-term and long-distance couples — [TechCrunch on Paired funding (search summary only)](https://techcrunch.com/2021/05/27/paired-pulls-in-3-6m-to-encourage-more-couples-to-get-cosy-with-app-based-relationship-care)
- Paired reach claims conflict: App Store listing says 8M downloads, its About page says 4M couples, AppGoblin lists 4.2M installs; treat as unverified and not comparable — [Paired About](https://www.paired.com/about-us); [App Store](https://apps.apple.com/app/id1469609343); [AppGoblin](https://appgoblin.info/apps/com.getpaired.app)
- Generic referral benchmark (vendor guide): invitation conversion 8-10% good, under 4% poor, 15%+ outstanding — [Shno](https://www.shno.co/startup-metrics/invitation-conversion-rate)
- Other generic referral claims: GrowSurf says 10-30% referral conversion; ReferralCandy-cited e-commerce median 3-5%. Definitions differ (share, sign-up, purchase), so not comparable — [GrowSurf](https://growsurf.com/statistics/conversion-rate-statistics/); [ReferralCandy](https://www.referralcandy.com/blog/referral-program-benchmarks-whats-a-good-conversion-rate-in-2025)
- Dropbox "60%" is a secondary-blog claim of a 60% increase in sign-ups (4M users in 15 months), not 60% of users from referrals; unverified — [Prefinery](https://prefinery.com/blog/referral-marketing/conversion-rate)
- K-factor definition: invites sent per user x invite conversion; K below 1 still lowers acquisition cost — [Woobox](https://cdn.woobox.com/articles/viral-marketing-mechanics), generic marketing content
- A 2023 pilot of a relationship app (405 couples) reported 99% of couples engaged and 88% giving follow-up data; this is enrolled couples in a study, not invite acceptance — [Phys.org](https://phys.org/news/2023-12-app-romantic-relationship.html)

### Inferences
- In a two-player product the invite is a one-to-one request from a motivated sender, so acceptance probably far exceeds the 8-10% generic benchmark; the dominant loss is likely before the link is sent (sender never taps share) and between tap and the partner opening it. This is an inference, not measured.
- Nod Twice has an advantage over account-gated apps: the partner needs no sign-up, only an age confirmation and a join, which removes the largest known friction (forced accounts/downloads). Not benchmarked anywhere I found.

### Gaps
- No invite-to-join figure for any named product (Paired, Between, Lovewick, Locket, Splitwise, Hinge We Met, fantasy sports, two-player games).
- No published drop-off at "send the link".

## Invite message, landing page, previews, in-app browsers, QR, waiting screens

### Takeaway
Link previews come from Open Graph tags (title, description, url, image) and are cached by WhatsApp; a missing og:image is the usual cause of blank cards. Evidence that a good preview lifts click-through is anecdotal only. No published A/B tests for invite copy, in-app browsers, QR-in-same-room or waiting screens were found.

### Cited Findings
- WhatsApp builds previews from Open Graph tags (og:title, og:description, og:url, og:image); missing og:image is the common reason for blank cards; previews are cached by WhatsApp servers so updates lag — [WATI](https://www.wati.io/blog/how-to-send-a-link-in-whatsapp); [Shopify community](https://community.shopify.com/t/shared-rich-link-on-whatsapp-doesnt-show-og-image/221251)
- One agency account says adding OG title/description/image nearly doubled click-through; anecdote, no data — [dev.to](https://dev.to/dipbhi/how-to-send-links-on-whatsapp-why-most-businesses-get-clicks-wrong-and-how-to-fix-it-1k9f)
- Quiz-marketing guidance: a pre-quiz email gate roughly halves completion; capture optionally on the result page — [Woobox viral quiz mechanics](https://cdn.woobox.com/articles/viral-quiz-mechanics) (vendor claim)

### Inferences
- The invite preview should be a static, generic Open Graph card (the sender's partner sees it in a chat thread): short title like a question the partner wants to answer, no card text beyond Level 1-3, and nothing identifying the room or level. Per-invite dynamic images would risk leaking details and are unnecessary.
- QR in the same room and a share-sheet link are both worth offering; there is no evidence on their relative rates, so measure both as daily totals (see last section).

### Gaps
- No A/B data on invite copy; nothing on Instagram/WhatsApp in-app-browser drop-off; nothing on QR scan rates for couples; nothing on "waiting for partner" screens.

## Shareable-result mechanics (Wordle, Wrapped, Locket, quizzes) and what a privacy-first game can share

### Takeaway
Wordle's spoiler-free emoji grid and Spotify Wrapped's personal, identity-flattering recap are the best-evidenced spread mechanics. Both share a result that reveals the outcome shape without the underlying content, which maps well to Nod Twice's rule that nothing private leaves the room.

### Cited Findings
- Wordle: the emoji grid started with a player manually typing squares on Twitter; Wardle then added a share button. Grid showed pattern but no letters, so it was spoiler-free and acted as free advertising. One source reports about 12k daily players in December 2021 and about 300k by 1 January 2022 (secondary; sources conflict on dates, one low-quality source says 2017) — [Search summary of Game Developer interview](https://www.gamedeveloper.com/marketing/josh-wardle-reflects-on-the-the-unconventional-road-to-wordle-s-success); [People-as-media analysis](https://beastoftraal.com/?p=19327)
- Wordle began as a gift from Wardle to his partner, then spread to family before the share grid — [WION](https://www.wionews.com/technology/he-made-wordle-for-his-partner-now-its-an-online-hit-442289)
- Spotify Wrapped 2025: over 200M engaged users in 24 hours (+19% year over year) and more than 500M shares (+41%) — [TechCrunch (search summary)](https://techcrunch.com/2025/12/04/spotify-says-wrapped-2025-is-its-biggest-yet-with-200m-users-in-its-first-day); [IBTimes](https://www.ibtimes.com/record-breaking-spotify-wrapped-2025-sees-200m-engage-500m-shares-day-3792059)
- Wrapped spreads because it is personal, shareable and flatters identity; no share rate (shares per viewer) is published. An "over 90M shared in 2023" figure and a "20x" claim are unverified marketing-blog numbers — [ADMA](https://adma.com.au/resources/personal-shareable-no-strings-attached-the-winning-formula-behind-spotify-wrapped)
- Locket: about 1.5M App Store downloads (Appfigures estimate) after a TikTok-driven spike in early 2022; the core loop is adding friends then a home-screen widget that shows friends' photos. No viral coefficient published — [Appfigures](https://appfigures.com/resources/insights/20220114/5-new-year-new-widget-same-growth-strategy)
- Privacy tension: participants hesitate to share personal data from Wrapped-style tools even with protections — [CHI 2026 paper](https://emilywall.github.io/media/papers/SpotifyCHI26.pdf)

### Inferences
- Candidates that stay within rule 8 (Level 1-3 talk card plus night count only): a "Night N" card with a Level 1-3 question; a neutral emoji-pattern "grid" that is only the shape of the night (number of cards, passed vs played shown identically is NOT safe, since passes are private-ish; use only card count and night count); a "we nodded twice" stamp with a date. Avoid match percentages, level names or counts of yes/maybe, which reveal private inputs.
- Wordle's key lesson is spoiler-free brag with a curiosity hook; for couples the equivalent is a card that shows a question but not the answers.

### Gaps
- No published share rate for any quiz, couples result card or "we matched X%" format.
- Could not verify Wordle growth numbers against a primary source.

## Referral and word-of-mouth levers, and post-first-night return mechanics

### Takeaway
I found no sourced evidence on gifting, friend-couple or couple-vs-couple loops, PWA install prompts, or what couples apps do after night one. Ideas below are inferences only.

### Cited Findings
- Valentine's Day is a measurable demand spike for apps: Adjust reports February 2025 dating installs +39% and Valentine's-day music installs +107% year over year (secondary summaries); AppsFlyer forecast a 14% rise in daily in-app purchases that week — [CFOtech summary of Adjust](https://cfotech.co.uk/story/from-holidays-to-shopping-sprees-how-commercial-events-fuel-mobile-app-growth); [Adjust](https://www.adjust.com/blog/valentines-day-app-trends-2025/)
- Adjust also notes users planned for Valentine's earlier rather than last-minute (secondary) — [Adjust state of dating apps](https://www.adjust.com/blog/state-of-dating-apps/)

### Inferences
- "Send to a couple you know" works only as an optional, one-tap share of a generic link at the map screen after a night, with no reward and no tracking of who was invited; fits rules 4, 9, 10.
- "Gift a night" is a one-link invite that starts a room for another couple; the gifter learns nothing about whether it was used.
- Seasonal moments (Valentine's week, anniversary season, holidays) are a content/SEO and blog lever, not an in-app nag.
- Return prompts that respect the rules: the "Next time" list on the map (rule 9) is the natural trigger; an optional, partner-agreed calendar file (.ics) or "add to calendar" for a chosen night, created on the phone; PWA "add to home screen" offered once after a finished night. Email only through the existing opt-in list (rule 9), never linked to rooms.

### Gaps
- No evidence found on gifting, couple-vs-couple, or PWA-install effect sizes.
- No data on what Paired, Between, Lovewick, Raft or similar do for re-engagement.

## Returning usage and retention benchmarks (2024-2026)

### Takeaway
No couples-app day-1/7/30 numbers or second-night rates were found. Closest proxies are dating-app and cross-industry retention, which probably overstate what a periodic-use couples game should expect.

### Cited Findings
- Adjust (2025) dating apps: day 1 about 26%, day 30 rose from 5% to 6% year over year — [Adjust via search summary](https://www.adjust.com/blog/state-of-dating-apps/)
- Cross-industry 2025-26 estimate (Phiture): about 25-26% day 1, 11-13% day 7, 5-7% day 30 — [Phiture](https://phiture.com/mobilegrowthstack/managing-retention-rate-benchmarks-and-expectations/)
- Other dating benchmark: day 30 at 5-12% (vendor) — [DatingPro](https://www.datingpro.com/blog/dating-app-industry-benchmarks/)
- RevenueCat State of Subscription Apps 2026: over 115,000 apps, over $16B revenue; freemium retains 28% of annual subscribers after one year vs 27% for hard paywall; AI apps 21.1% vs 30.7% non-AI; over half of trial cancellations happen on day one. These concern paid subscribers, not free-game return — [RevenueCat](https://www.revenuecat.com/state-of-subscription-apps-2026/); [PPC Land](https://ppc.land/95-of-annual-app-subscribers-who-cancel-never-return-revenuecat-finds/)

### Inferences
- A date-night game is episodic (weekly or monthly at best); day-30 return is the wrong yardstick. Better: share of finished nights followed by another night within 30 days, measurable as a daily-total ratio using the existing "nights started" counter versus new rooms (no per-person data).

### Gaps
- No published share of couples who play a second night; no couples-specific day-1/7/30.

## Recommended first three loops, effect size, effort, privacy-safe measurement

### Takeaway
Effect sizes are estimates with no supporting benchmark; treat as hypotheses to test. All three fit the rules (no accounts, no streaks, no guilt, nothing private shared).

### Cited Findings
- Supporting evidence for the mechanics: Wordle spoiler-free share ([Beast of Traal](https://beastoftraal.com/?p=19327)), Wrapped shareable personal recap ([ADMA](https://adma.com.au/resources/personal-shareable-no-strings-attached-the-winning-formula-behind-spotify-wrapped)), and OG preview anecdote ([dev.to](https://dev.to/dipbhi/how-to-send-links-on-whatsapp-why-most-businesses-get-clicks-wrong-and-how-to-fix-it-1k9f)).

### Inferences
Ranked (all effect sizes are guesses):
1. **Invite step polish (highest priority, low effort).** One-tap native share sheet plus QR for same-room, generic Open Graph card with og:image, short plain invite copy, and a calm "waiting for partner" screen that offers re-share and does not time out visibly. Goal: raise games-started to partners-joined. Hypothesis: the largest single lever because every other loop sits behind it. Measure: daily totals of games started vs partners joined (already counted); add optional totals for "invite shared" and "QR shown".
2. **Spoiler-free share card, made friendlier (low-medium effort).** Extend `src/share.ts` card with a neutral, Wordle-like design and a link to the site; keep within rule 8 (Level 1-3 talk card and night count only). Hypothesis: modest, since only couples who both opt in produce a card; expect a small fraction of finished nights to share. Measure: existing "shares" total vs nights finished, and visits (no per-referrer tracking).
3. **"Pass it to a couple" at the map (low effort, after the night only).** One optional, reward-free share of the generic site link, plus a "gift a night" phrasing. Must not appear during a night (rule 7 style) and no counts of who. Measure: one daily total "friend share tapped" (new counter, totals only) vs visits.
Return nudge (fourth, optional): a one-time "add a night to your calendar" .ics download after the envelope opens, using only the "Next time" list (ids only, on the phone). Measure: one daily total of calendar downloads vs nights finished.

Measurement discipline: use ratios of daily totals only (games started, partners joined, nights finished, shares, plus the new optional totals above). Do not add referrer, room or per-person tracking; funnel ratios from totals are enough to see whether a change helped (before/after weeks, since per-person A/B cohorts are not allowed; if A/B is wanted, assign by room code parity on the server without storing it, and count daily totals per arm only — that design is my suggestion, check it against rule 10).

### Gaps
- No evidence on effect sizes; every number above should be treated as an assumption to validate with Nod Twice's own totals.
