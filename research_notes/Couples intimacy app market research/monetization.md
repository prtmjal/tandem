# Monetization, Payments and Distribution for a Suggestive (Non-Explicit) Couples Intimacy Game (as of Nov 2026)

Research note on method: the session's network allowlist blocked direct fetches of stripe.com, paddle.com, revenuecat.com, apps.apple.com and support.google.com. Only developer.apple.com (App Review Guidelines) could be fetched directly. Everything else comes from web-search result summaries of those official pages, plus secondary sources. Policy wording quoted below from Stripe, Paddle, Lemon Squeezy, Polar, PayPal and Google comes from search snippets of the official pages, not a full-page read. Verify it before relying on it.

## Q1. Pricing benchmarks, model, trials, conversion, and couple-sharing

### Takeaway
Couples apps mostly charge a subscription priced around $60–80/year (about $12.99–14.99/month), and usually one purchase unlocks premium for both partners. RevenueCat 2026 data favors a hard paywall or trial over freemium: Day-35 conversion is 10.7% with a hard paywall vs 2.1% for freemium. Longer trials convert better than trials of four days or less.

### Cited Findings
- **Paired:** the FAQ lists Premium at $79.99 per couple per year. Only one partner needs to subscribe, and once you are paired in the app, Premium is shared with both accounts — [Paired FAQ](https://www.paired.com/frequently-asked-questions); [Paired support: does my partner have to pay](https://support.paired.com/en/articles/164624-does-my-partner-have-to-pay-to-use-paired-premium-as-well). Third-party sources report $14.99/month, with yearly plans from $39.99 (promotional) to $74.99 — [WhistleOut](https://www.whistleout.com/CellPhones/Apps/paired-app-couples-relationship-questions); [lovefix.app](https://lovefix.app/resources/apps/paired-app-alternatives-2026/).
- **Coral:** the App Store listing says your partner's subscription is free when you subscribe, and puts the auto-renewing annual plan at $59.99/year — [Coral App Store listing](https://apps.apple.com/us/app/coral-paired-for-intimacy/id1448861466). A third party reports $12.99/month and annual plans from $39.99 to $89.99 depending on promotion — [excellentwebworld](https://www.excellentwebworld.com/best-relationship-apps/). The listing is rated 17+ and has been retitled by locale, for example "Coral Couples Game & Questions 17+" and "Coral Sex & Relationship Coach 17+" — [apps.apple.com/me](https://apps.apple.com/me/app/id1448861466?l=hr); [apps.apple.com/in](https://apps.apple.com/in/app/id1448861466?l=hi). Adapty has a teardown of Coral's paywall — [Adapty paywall library: Coral](https://adapty.io/paywall-library/coral/).
- **Lasting:** a subscription comes with two seats, one per partner. If the apps are paired and one partner subscribes, both unlock Premium — [Lasting help](https://getlasting.com/help).
- **Desire - Couples Game (Desire Technologies):** free with in-app purchases and rated 17+. An older listing snapshot shows a "Platinum Account" at $15.49 and $9.99, coin packs from $0.99 to $9.99, and a "Chili level" unlock for $12.99. It is a hybrid model of subscription, consumable coins and content-pack unlocks. Current prices are unverified — [App Store: Desire](https://apps.apple.com/us/app/desire42/id923073855); [AppFollow](https://apps.appfollow.io/ios/desire-couples-game/923073855?country=us). A third party puts Desire premium at about $60/year — [excellentwebworld](https://www.excellentwebworld.com/best-relationship-apps/).
- **Smaller "spicy" couples games (comparable to this product):**
  - "Couple Game – Secret Desires": $4.99/week, $24.99/year, $24.99 lifetime — [App Store](https://apps.apple.com/us/app/couple-game-secret-desires/id1613249947).
  - "Questions For Couples: Desire": $49.99 lifetime — [App Store](https://apps.apple.com/app/id6748841456).
  - "Couples Games: Desire for Love": in-app purchases at $3.99, $6.99 and $29.99 — [App Store](https://apps.apple.com/us/app/-/id6443401871).
- **Dipsea:** a third party lists annual plans from about $34.99 to $69.99 — [appshunter](https://appshunter.io/ios/app/1434242889/dipsea/how-to-cancel-subscription).
- **RevenueCat State of Subscription Apps 2026, hard paywall vs freemium:** hard-paywall apps have a median Day-35 trial-to-paid conversion of 10.7%, vs 2.1% for freemium — [RevenueCat SOSA 2026](https://www.revenuecat.com/state-of-subscription-apps-2026/) (via summaries; [SaaStr summary](https://saastr.com/the-top-10-learnings-from-revenuecats-state-of-subscription-apps-how-115000-mobile-apps-deliver-16b-in-revenue-whats-working-whats-quietly-killing-growth)).
- **RevenueCat 2026, trial length:**
  - Median trial-to-paid conversion is 42.5% for trials of 17+ days vs 25.5% for trials of four days or less.
  - Monthly plans: 40% (4 days or less), 46% (5–9 days), 47% (10–16 days), 44% (17–32 days).
  - Annual plans: 24%, 33%, 43%, 45% across the same bands.
  - Weekly plans: 22% (4 days or less), 24% (5–9 days).
  - The share of apps using trials of four days or less rose from 42.1% in 2025 to 46.5% in 2026.
  - Source: [RevenueCat blog: free trial length](https://www.revenuecat.com/blog/growth/free-trial-length); [RevenueCat 2026 benchmarks](https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026). Secondary sources give slightly different band figures (for example 37.4% for 5–9 days), so check the original before citing a specific band — [pricepush](https://pricepush.app/blog/trial-to-paid-conversion-rate-benchmarks).

### Inferences
- **Price anchors for a Gen Z game:** about $4.99–7.99/month, $29.99–39.99/year, or a $24.99–49.99 lifetime unlock. This undercuts the coaching-style apps (Paired, Coral and Lasting at $60–80/year), which justify higher prices with expert or therapist content. A pure question/dare game is closer to the "Secret Desires" and "Questions For Couples" tier.
- **"One purchase covers both partners" is effectively the category standard** (Paired, Coral, Lasting). A two-phone game should entitle the couple, or the "room", rather than each device. Not doing so would be a competitive disadvantage and a source of complaints. Paired's support article shows the operational pain point (partner not getting access, "restore purchase") when entitlement is tied to the store account.
- **Recommended structure:** a free starter deck to drive virality, since the second partner must install or join anyway. Then a paywall on spicier decks, with an annual plan carrying a 7-day trial (or about 3 days on weekly), plus a lifetime option. Lifetime is common in small couples games and suits a one-time, "date night" use pattern.

### Gaps
- No verified 2026 store prices for Kindu, Agape, Rosy, Ferly or Desire's current subscription: apps.apple.com was blocked and the search results lacked them.
- No intimacy- or couples-specific conversion benchmark found. RevenueCat category splits (Health & Fitness, Lifestyle) were not retrievable.

## Q2. Regional and purchasing-power pricing (India, LatAm, SEA)

### Takeaway
Default store prices are converted from the US price at exchange rates, not adjusted for purchasing power. Common practice is to set India and Indonesia at about 30% of the US price, and Brazil at about 40–60%. Revenue per install in India and SEA is about one-fifth of North America's.

### Cited Findings
- Common heuristics put prices at roughly 30–60% of the US price. One tool gives India 0.3x, Brazil 0.5x and Indonesia 0.3x of a US base. Another puts Brazil at 40–60% and Indonesia at 30–50% — [asc-ppp-pricing skill listing](https://skills.cat/skills/vladimirbrejcha/ios-ai-skills/asc-ppp-pricing); [stora.sh guide 2026](https://stora.sh/blog/2026-04-16-app-store-regional-pricing-localization-guide).
- Apple's automatic equalization uses exchange rates, not purchasing power, so purchasing-power prices must be set explicitly per storefront — [PricePush glossary](https://pricepush.app/glossary/purchasing-power-parity).
- RevenueCat has published guidance on fixing poor default global pricing — [RevenueCat: 5 quick fixes for bad default global pricing](https://www.revenuecat.com/blog/growth/5-quick-fixes-for-bad-default-global-pricing-on-app-stores.md).
- PricePush cites RevenueCat 2026 as showing a median 60-day revenue per install of about $0.55 in North America vs about $0.11 in India and SEA. This is secondhand and unverified — [PricePush](https://pricepush.app/blog/does-parity-pricing-grow-app-sales).
- A vendor claims India, Brazil and Indonesia make up 45% of Google Play downloads. No source is given — [PricePush](https://pricepush.app/localized-pricing).

### Inferences
- A worldwide Gen Z audience will skew heavily toward lower purchasing-power markets. Purchasing-power tiers, roughly ₹199–299/month or a ₹999–1,499 lifetime unlock in India, are likely needed for meaningful conversion there. This is an inference from the multipliers above.
- On the web, a merchant of record that supports local methods (UPI, Pix, e-wallets) matters as much as the price level. See Q3 for which providers would accept this category.

### Gaps
- No primary RevenueCat regional data could be retrieved (site blocked).
- No local payment-method acceptance data for India, LatAm or SEA was found.

## Q3. Payment-provider acceptable-use policies

### Takeaway
Every mainstream processor and merchant of record bans sexually oriented or pornographic content: Stripe, Paddle, Lemon Squeezy, Polar, and PayPal (approval required). Paddle and Lemon Squeezy also ban dating apps. A suggestive, non-explicit couples game falls in a grey zone. The deciding test in Stripe's wording is content "designed for the purpose of sexual gratification", so positioning and content tone decide the outcome. The card-network adult rules (Mastercard AN 5196, Visa VIRP Tier 1) target explicit adult content merchants and probably do not apply to non-explicit content. High-risk processors are a costly fallback at about 6–15%.

### Cited Findings
- **Stripe:**
  - The list prohibits "pornography and other mature audience content (including literature, imagery and other media) designed for the purpose of sexual gratification", including AI-generated content meeting that test, and "adult services" (escorts, sexual massages, fetish services, adult live chat) — [Stripe Prohibited and Restricted Businesses](https://stripe.com/legal/restricted-businesses).
  - The Stripe FAQ says it "can't currently work with businesses that sell or offer adult content or services" even where legal, and describes "sexually oriented items (e.g., adult toys)" as adult content — [Stripe Restricted Business FAQ](https://support.stripe.com/questions/prohibited-and-restricted-businesses-list-faqs).
  - Some listed businesses may be supported "with explicit prior approval" — [Stripe FAQ](https://support.stripe.com/questions/prohibited-and-restricted-business-list-faqs).
  - A Stripe blog post concedes that brand restrictions "such as on sex toys" are "often outdated and overly moralizing" — [Stripe blog: Why some businesses aren't allowed](https://stripe.com/en-ro/blog/why-some-businesses-arent-allowed).
- **Paddle:** the AUP prohibits "adult and other age-restricted content and services, including sexually-oriented or pornographic products or services, any material of a lewd and lascivious nature", and "dating services/applications" — [Paddle Help: What am I not allowed to sell](https://www.paddle.com/help/start/intro-to-paddle/what-am-i-not-allowed-to-sell-on-paddle).
- **Lemon Squeezy (owned by Stripe):** prohibits "sexually-oriented or pornographic content of any kind", including NSFW chatbots, and also dating sites — [Lemon Squeezy prohibited products](https://docs.lemonsqueezy.com/help/getting-started/prohibited-products).
- **Polar:** the AUP, effective October 1, 2026, bars "adult content and services", including OnlyFans-type services, adult AI-generated content and AI relationship services — [Polar AUP](https://polar.sh/legal/acceptable-use-policy).
- **PayPal:** "obscene" items are prohibited. Adult content delivered digitally is under "activities requiring approval" — [PayPal AUP](https://www.paypal.com/us/legalhub/paypal/acceptableuse-full). The PayPal Alternative Payment Methods agreement prohibits "sexually-oriented or pornographic content" — [PayPal APM agreement](https://www.paypal.com/us/legalhub/paypal/apm-tnc).
- **Mastercard:** AN 5196, "Revised Standards for New Specialty Merchant Registration Requirements for Adult Content Merchants", was published April 14, 2021, with compliance due October 15, 2021. It requires acquirers to certify content monitoring and takedown, consent and age verification of people depicted, and complaint processes — [ACLU complaint PDF](https://assets.aclu.org/live/uploads/2023/08/Mastercard-Complaint-Final.pdf); [ResearchGate paper](https://www.researchgate.net/publication/358441297_The_Impact_of_Mastercard's_Adult_Content_Policy_on_Adult_Content_Creators); [merchantscout summary](https://www.merchantscout.com/mastercard-adult-merchant-consent).
- **Visa:** the Visa Integrity Risk Program (VIRP), effective May 1, 2023, replaced the Global Brand Protection Program and places adult content in Tier 1 — [mobiuspay (vendor)](https://mobiuspay.com/blog/mastercard-adult-content-rules); [karmacardpayments (vendor)](https://karmacardpayments.com/blog/adult-merchant-account-content-compliance/).
- **High-risk processors:**
  - CCBill: about 5.9% + $0.55 per transaction for direct pricing, and up to about 10%+ per a competitor — [fitgap](https://us.fitgap.com/products/ccbill); [corepay](https://corepay.net/articles/cc-bill-alternatives/).
  - Verotel: EUR 500 registration fee on Basic accounts, with rates on its price chart — [Verotel merchant agreement](https://www.verotel.com/en/merchantagreement.html).
  - Industry averages of 12–18% are claimed but unverified — [gitnux](https://gitnux.org/payment-processing-adult-industry-statistics/).
  - Segpay: no fee data found.
- **Third-party reports on Stripe and adult merchants:** Stripe reportedly pushes adult merchants toward high-risk processors — [Signature Payments](https://signaturepayments.com/does-stripe-allow-adult-content/); [TailoredPay](https://tailoredpay.com/blog/stripe-restricted-business/).

### Inferences
- A product of suggestive dares and questions, with no nudity or explicit description, positioned as "relationship / connection / intimacy wellness", is arguably not "designed for the purpose of sexual gratification". Coaching apps like Coral, Paired and Lasting operate openly, but whether any of them use Stripe could not be verified.
- **The main risk is not the content itself but how it is described.** Words like "spicy", "kinky", "foreplay" or "sex game", NSFW imagery and an 18+ gate on the website can trigger automated risk review and termination. Funds can be held when this happens.
- **Recommended setup:**
  1. Write to Stripe ahead of launch and ask for explicit prior approval (or use Stripe Managed Payments/Lemon Squeezy only after confirming).
  2. Keep marketing copy wellness-framed.
  3. Keep a high-risk processor (CCBill, Segpay or Verotel) contracted as a fallback.
  4. Do not use Paddle: its "lewd and lascivious" wording plus the dating ban make it the strictest fit.
- Mastercard and Visa adult registration is aimed at merchants hosting explicit content and depicted performers. A non-explicit game should not need specialty registration. That changes if the product adds user-uploaded photos or media, or explicit audio and erotica (the Dipsea style).
- **Using the app stores' in-app purchase sidesteps processor acceptable-use risk entirely**, because Apple and Google are the merchant of record. That is a strong argument for native distribution, or a hybrid.

### Gaps
- **Gumroad and Razorpay** adult-content policies: not retrieved.
- **Lemon Squeezy and Stripe Managed Payments today:** Stripe acquired Lemon Squeezy in 2024. Its current status relative to Stripe Managed Payments was not verified.
- **Which processors Coral, Kindu, Desire or Dipsea use for web checkout:** not found.
- **Direct page reads:** the full Stripe and Paddle pages could not be fetched, so last-updated dates are unknown.

## Q4. App store rules: Apple 1.1.4, age ratings, Google Play, commissions and steering

### Takeaway
Apple bans only "overtly sexual or pornographic material" that is explicit. Suggestive couples apps (Coral, Desire) are approved under a 17+ rating, which now maps to Apple's new 16+/18+ tiers. Google Play is stricter on paper ("sex guides" and "sexually gratifying" content are prohibited) and enforces on listing keywords. In the US, apps can now link to web checkout with no Apple commission while the remand is pending. The commission terms are in flux, with a Supreme Court review pending. The EU moved to new terms on October 1, 2026.

### Cited Findings
- **Apple 1.1.4:** "Overtly sexual or pornographic material, defined as 'explicit descriptions or displays of sexual organs or activities intended to stimulate erotic rather than aesthetic or emotional feelings.' This includes 'hookup' apps and other apps that may include pornography or be used to facilitate prostitution, or human trafficking and exploitation." — [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/).
- **Apple 1.2:** apps used "primarily for pornographic content, Chatroulette-style experiences, random or anonymous chat, objectification of real people" do not belong on the App Store — [Apple guidelines](https://developer.apple.com/app-store/review/guidelines/).
- **Apple 2.3.8:** metadata must "adhere to a 4+ age rating even if your app is rated higher" — [Apple guidelines](https://developer.apple.com/app-store/review/guidelines/).
- **Apple 3.1.1 and 3.1.3, US storefront:** "These entitlements are not required for developers to include buttons, external links, or other calls to action in their United States storefront apps". In all other storefronts such calls to action are prohibited except via entitlements — [Apple guidelines](https://developer.apple.com/app-store/review/guidelines/).
- **Competitor ratings and naming:** Coral and Desire are rated 17+, and Coral uses names like "Sex & Relationship Coach" in some locales — [Coral IN listing](https://apps.apple.com/in/app/id1448861466?l=hi); [Desire listing](https://apps.apple.com/us/app/desire42/id923073855).
- **Apple's age-rating overhaul (announced July 2025):**
  - New 13+, 16+ and 18+ tiers were added; 12+ and 17+ were dropped.
  - The questionnaire gained new questions on in-app controls, capabilities, medical or wellness topics and violent themes.
  - Developers had to answer by January 31, 2026, or updates were blocked.
  - The new ratings show on iOS 26 and later.
  - Sources: [MacRumors](https://www.macrumors.com/2025/07/25/apple-overhauls-app-store-age-ratings/); [9to5Mac](https://9to5mac.com/?p=1011484); [Business Today](https://www.businesstoday.in/technology/news/story/apple-overhauls-app-store-age-ratings-adds-new-13-16-and-18-categories-486587-2025-07-28). One source mentions further questionnaire changes through September 2026 (unverified) — [Sonar](https://trysonar.app/blog/app-store-age-rating).
- **Google Play:**
  - Play does not allow apps that "contain or promote sexual content or profanity, including pornography, or any content or services intended to be sexually gratifying". Listed violations include content that "depicts or is functionally sexual aids, sex guides, illegal sexual themes and fetishes" — [Google Play Sexual Content policy](https://support.google.com/googleplay/android-developer/answer/9878810).
  - Enforcement example: the #Open polyamory dating app was suspended over listing words such as "threesomes" and "kinky dates" that "imply sexual gratification" — [Vice](https://www.vice.com/en/article/google-play-store-bans-polyamory-dating-app).
  - Sugar dating has been banned since 2021 — [Global Dating Insights](https://www.globaldatinginsights.com/news/google-bans-sugar-dating-apps-from-play-store).
  - The search found no explicit sex-education exception in the results retrieved.
- **Epic v. Apple:**
  - The April 30, 2025 contempt order barred Apple from charging any commission on US link-out purchases.
  - The Ninth Circuit (December 2025) upheld the contempt finding. It ruled the total commission ban overbroad: Apple may charge a commission covering costs "genuinely and reasonably necessary" for coordinating external links, and the issue went back to the district court.
  - The Supreme Court granted cert on Apple's challenge (reported June 30, 2026).
  - Sources: [Justia 9th Cir. opinion](https://law.justia.com/cases/federal/appellate-courts/ca9/25-2935/25-2935-2025-12-11.html); [Fenwick](https://www.fenwick.com/insights/publications/ninth-circuit-largely-upholds-ruling-in-epic-v-apple); [IPWatchdog](https://ipwatchdog.com/2026/06/30/high-court-grants-cert-in-apples-challenge-to-ninth-circuit-contempt-ruling-in-app-store-dispute/).
- **Apple EU terms (announced August 18, 2026; effective October 1, 2026):**
  - A single business model for all EU developers.
  - The per-install Core Technology Fee is replaced by a 5% Core Technology Commission on transactions in apps from alternative marketplaces or the web.
  - Commission is 26% with Apple in-app purchase, 20% with alternative payment processing, and 15% for link-out. Reduced rates apply under the Small Business Program and for subscriptions after the first year.
  - Sources: [Phiture](https://phiture.com/blog/apple-new-app-store-terms-2026/); [Anadolu Agency](https://aa.com.tr/en/science-technology/apple-revamps-eu-app-store-fees-to-resolve-regulatory-dispute/4031035); [aiweekly](https://aiweekly.co/alerts/apple-replaces-eu-core-technology-fee-with-5-commission). Whether the 5% stacks on top of the other rates is unclear.
- **Apple is still policing web paywalls:** in April 2026 Cal AI (about $50M ARR) was briefly pulled from the App Store over three specific violations — [Adapty](https://adapty.io/blog/app-to-web-paywalls-ios-one-year-data/).

### Inferences
- **Apple approval path:**
  - Answer the age questionnaire honestly for sexual content and mature themes, which will likely land at 16+ or 18+. 18+ is the safer choice for "spicy" content.
  - Keep screenshots, title and subtitle at a 4+ standard (rule 2.3.8).
  - Frame the app as relationship-building, and include no nudity or explicit description.
  - Avoid any stranger matching or chat (1.2, "hookup").
  - Coral and Desire show that this formula passes.
- **Google Play is the higher-risk store:** avoid "sex game", "kinky" and similar words in the listing, and lead with "couples questions / date night / connection". Expect possible rejection.
- **US monetization:** a native app can show a "buy on web" button with zero Apple commission for now. A future cost-based fee is possible after the remand or Supreme Court ruling. Outside the US and EU, in-app purchase is mandatory in-app; the standard Small Business Program rate is generally 15% (not verified here).

### Gaps
- Google Play's full policy text and any education or wellness exception could not be read (site blocked).
- Google Play commission and US alternative-billing status after Epic v. Google: not researched.
- No first-hand account was found of how Coral, Desire or Kindu got through App Review (no developer posts surfaced).
- Apple's current text for age ratings and sexual-content questionnaire answers was not retrieved.

## Q5. PWA vs native in 2026 (push, install friction, discoverability, wrappers, conversion)

### Takeaway
iOS PWAs can receive web push only after the user adds the app to the Home Screen (iOS 16.4+). There is no install prompt, and iOS 27 added no new web-app features. Apple reversed its 2024 plan to remove Home Screen web apps in the EU. A web-first approach avoids store review and store fees and lets one link serve both partners. But it gives up store discoverability and in-app purchase convenience, which converts at least 30% better than web checkout in RevenueCat's test. It also raises payment-processor risk (Q3).

### Cited Findings
- **iOS push and install:**
  - PWA push on iOS 16.4+ works only after Add to Home Screen; a Safari tab cannot receive push — [MagicBell](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide); [webscraft 2026](https://webscraft.org/blog/pwa-pushspovischennya-na-ios-u-2026-scho-realno-pratsyuye?lang=en).
  - iOS 26 opens every site added to the Home Screen as a web app by default. iOS 27 brought no new Home Screen web-app features.
  - There is no install prompt or background work like Chrome on Android offers — [webscraft](https://webscraft.org/blog/pwa-pushspovischennya-na-ios-u-2026-scho-realno-pratsyuye?lang=en).
- **EU:** Apple reversed the iOS 17.4 removal of Home Screen web apps, and that functionality continues in the EU — [Apple Developer Forums](https://developer.apple.com/forums/thread/745414?page=2); [tomayac blog](https://dcmpx.remotevs.com/com/tomayac/blog/SL/2024/02/28/so-what-exactly-did-apple-break-in-the-eu). Some 2026 guides still claim removal; that is outdated.
- **Conversion: in-app purchase vs web checkout:**
  - RevenueCat's A/B test found in-app purchase converts "at least 30% better" than web purchase — [RevenueCat](https://revenuecat.com/blog/growth/iap-vs-web-purchases-conversion-test).
  - Adapty 2026: purchase-per-view is 4.95% native vs 3.69% web, but web ARPPU is about 2x ($47.59 vs $23.76) — [Adapty](https://adapty.io/blog/app-to-web-paywalls-ios-one-year-data/).
  - Airbridge: Month-1 retention is 84.5% for web vs 48.2% for in-app, but by Month 8 it is 20% web vs 30% in-app — [Airbridge](https://www.airbridge.io/en/blog/does-web-to-app-improve-profitability).
  - Segwise claims web funnels convert about 2x (3% vs 1.5%) (vendor claim) — [Segwise](https://segwise.ai/blog/web-to-app-user-acquisition-guide-2026.md).
  - RevenueCat warns that the app-to-web detour is fragile — [RevenueCat: why you shouldn't use app-to-web](https://www.revenuecat.com/blog/growth/why-you-shouldnt-use-app-to-web.md).

### Inferences
- **Recommendation for a two-phone couples game: web-first, with a native wrapper later.**
  - The core loop of "partner B joins via a link or QR code" is the web's strongest advantage: no install for the second phone.
  - Start as a web app. Use a short, wellness-framed web checkout with a processor that has given pre-approval, with a high-risk fallback. Use purchasing-power pricing.
  - Treat Home Screen install and push as optional extras.
  - Then ship a thin Capacitor wrapper to the App Store at an 18+ rating with native in-app purchase. This buys discoverability, the in-app purchase conversion lift, and protection from processor acceptable-use risk.
  - Keep a shared entitlement backend, for example RevenueCat with web billing, so one purchase on any channel unlocks the couple.
  - In the US, the native app can also link to web checkout without commission for now.
- **Push dependence is a real constraint:** on iOS the web app cannot send "your partner answered" nudges unless it is installed to the Home Screen. Retention features that depend on push favor native.

### Gaps
- No Capacitor or wrapper-specific App Review outcomes for intimacy apps were found. Guideline 4.2 (minimum functionality, for wrapped web apps) was not researched.
- No data was found on PWA install rates or conversion specific to couples or games.
- App Store search volume for "couples game" was not researched.
