# Devices, Browsers, Networks and Usage Habits of Gen Z (18-29) Smartphone Users, 2025-2026

Research method note: this session's network policy blocked direct fetches of gs.statcounter.com, cable.co.uk, infrequently.org and mobiloud.com (DNS refused). Nearly all figures below come from web-search result summaries of those pages or from secondary republishers, not from reading the primary pages. Treat precise decimals as indicative and re-check them on the primary sites before quoting them externally. To fetch the primary pages, those domains have to be allowed in the session's network settings.

## 1. iOS vs Android share, overall and among Gen Z, by region; share of mixed iOS+Android couples

### Takeaway
Worldwide, Android has about 68% of mobile web traffic and iOS about 32%. The split varies enormously by market: iOS has about 60% in North America, roughly 50% in the UK, about 20% in Brazil, about 18% in Indonesia and about 5-7% in India. Young Americans lean further toward iPhone (about 88% of US teens). A couples game should assume one iPhone and one Android in a large share of US/UK/EU pairs, and Android on both phones in most India/SEA pairs.

### Cited Findings
- Worldwide mobile OS (StatCounter): Android 68.36%, iOS 31.6% (July 2026); Android 67.45%, iOS 32.52% (Aug 2026). — [StatCounter worldwide mobile OS](https://gs.statcounter.com/os-market-share/mobile-operating-system/worldwide)
- North America: iOS 60.26%, Android 39.71% (Aug 2026). — [StatCounter North America](https://gs.statcounter.com/os-market-share/mobile-operating-system/north-america)
- Netherlands (as an EU example): Android 64.2%, iOS 35.77% (June 2026). — [StatCounter Netherlands](https://gs.statcounter.com/os-market-share/mobile/netherlands/2025)
- Australia: iOS 63.7%, Android 36.29% (July 2026). — [StatCounter Australia](https://gs.statcounter.com/os-market-share/mobile-/australia)
- UK: iOS 49.92% vs Android 49.67% (May 2025); another secondary source gives iOS 45.2% (Aug 2025). The two sources conflict. — [MobiLoud](https://www.mobiloud.com/blog/android-vs-ios-market-share/); [SQ Magazine](https://sqmagazine.co.uk/iphone-vs-android-statistics/)
- Brazil: iOS 20.6%, Android 79.3%. Indonesia: iOS 17.7%, Android 82.3% (StatCounter, Jan-Sep 2026, via a secondary source). — [Digital Applied](https://www.digitalapplied.com/blog/mobile-os-market-share-2026-ios-vs-android)
- India: iOS 4.5% (Aug 2025), contradicted by an undated figure of iOS 6.86% vs Android 93.05%. Either way, India is over 93% Android. An older figure (2023) gave Android 95.21%. — [SQ Magazine](https://sqmagazine.co.uk/iphone-vs-android-statistics/); [Quash](https://quashbugs.com/blog/ios-vs-android-market-share-statistics); [Techjury, 2023 data](https://techjury.net/industry-analysis/android-market-share/)
- US teens: about 88% own an iPhone (Piper Sandler, Spring 2025, n=6,455), up from 85% a year earlier and 66% a decade ago. — [MacRumors](https://www.macrumors.com/2025/04/09/teen-iphone-ownership-continues-to-soar/); [AppleInsider](https://appleinsider.com/articles/25/04/09/iphone-still-coveted-by-teens-but-other-apple-products-not-so-much)
- US Gen Z: 79% prefer iPhone (Bloomberg Intelligence, 2023; this measures preference, not ownership, and the data is older). — [Bloomberg](https://www.bloomberg.com/company/press/79-of-gen-z-us-consumers-prefer-iphones-to-rivals-finds-bloomberg-intelligence)
- US adults aged 18-34: 58% iPhone vs 41% Android (aggregated figure; the underlying survey could not be verified). — [Exploding Topics](https://explodingtopics.com/blog/iphone-android-users)
- Asymco, Feb 2026, tracks what happens to iPhone share as US teens grow up into adults. — [Asymco](https://asymco.com/2026/02/16/teen-survey-update-what-happens-when-teens-grow-up/)

### Inferences
- Estimated mixed-OS couple rate, assuming partners choose platforms independently (P(mixed) = 2p(1-p), where p is the iOS share):
  - US young adults at p≈0.58-0.70: about 42-49%.
  - UK at p≈0.45-0.50: about 50%.
  - Netherlands/EU at p≈0.36: about 46%.
  - Brazil at p≈0.21: about 33%.
  - Indonesia at p≈0.18: about 30%.
  - India at p≈0.05-0.07: about 10-13%.
  - Real couples are probably more alike than random pairs (shared income, iMessage lock-in among US teens), so actual mixed rates are likely somewhat lower, especially in the US. These are estimates, not measurements.
- Practical rule: every game feature must work on both iOS and Android in every session. Mixed-OS play is the normal case in the US, UK and EU, not an edge case.
- In India and SEA, the typical pair is two mid- or low-range Android phones, so the low-end Android performance budget applies to both phones.

### Gaps
- No primary source gave OS share split by age (18-29) outside the US. No 2025 UK, EU, India or SEA Gen Z figures were found. Ofcom Online Nation and Pew could not be fetched.
- No StatCounter figures were retrieved for the Philippines, Vietnam, Saudi Arabia or UAE.
- No published data was found on OS mixing within couples.

## 2. Mobile browser share, including in-app browsers (Instagram, TikTok, WhatsApp)

### Takeaway
On mobile, Chrome has about 68-70% of traffic, Safari about 20-22% and Samsung Internet about 3%. Invite links shared in social and chat apps will often open inside in-app WebViews. Those WebViews are poorly documented and unsupported by vendors, and they are known to break popups, storage, cookies and postMessage. The game needs an "Open in your browser" fallback and must not depend on persistent storage when running inside one.

### Cited Findings
- Worldwide mobile browsers (StatCounter, Oct 2026): Chrome 70.37%, Safari 21.91%, Samsung Internet 3.16%, Opera 1.88%, UC Browser 0.94%, Firefox 0.61%. — [StatCounter mobile browser](https://gs.statcounter.com/browser-market-share/mobile/worldwide)
- For 2025: Chrome's yearly worldwide mobile share was 68.38%; Safari was 20.3% and Samsung Internet 3.3% (Aug 2025). — [SQ Magazine](https://sqmagazine.co.uk/mobile-browser-usage-statistics/)
- Chrome reportedly passed Safari on US phones in September 2026 (headline claim from a secondary source; not verified on the primary page). — [SQ Magazine](https://sqmagazine.co.uk/mobile-browser-usage-statistics/)
- Instagram/Facebook in-app browsers use a custom WebView that "blocks some JS, storage, cookies, intercepts navigation". TikTok's is a "restricted WebView" where "most popups/scripts [are] blocked, may break postMessage". WebViews may also mishandle the viewport. This is a vendor compatibility table with no date. — [Paybis docs](https://docs.payb.is/docs/platform-compatibility-limitations)
- Vendors treat Instagram and TikTok in-app browsers as unsupported because of "additional constraints and broken UI behavior". The recommended mitigation is an "Open in browser" fallback and avoiding window.open, popups and non-persistent storage. — [Incode WebViews](https://developer.incode.com/docs/webviews)
- iOS WKWebView localStorage is reported to be wiped when the app exits or relaunches, or "as it sees fit". Behavior is inconsistent across setups. — [Apple Developer Forums](https://developer.apple.com/forums/thread/107625); [flutter_inappwebview #928](https://github.com/pichillilorenzo/flutter_inappwebview/issues/928)
- By default, WKWebView restricts media autoplay. The host app must opt in to inline or autoplay media, so web content cannot override the setting. — [Thomas Visser](https://www.thomasvisser.me/2018/06/26/wkwebview-media/)
- Safari, and therefore every browser engine on iOS, does not support the Vibration API. iOS has no install prompt (Add to Home Screen is manual), and Safari has a 7-day cache/storage eviction limit for sites. — [MagicBell PWA iOS guide](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide)

### Inferences
- WebSockets were not shown to be blocked in any source. WKWebView and Android System WebView generally support WebSocket, so Socket.IO should connect. Socket.IO's long-polling fallback adds a safety net if a WebView or proxy interferes. This is unverified and should be tested on current Instagram, TikTok, WhatsApp, Messenger and Snapchat builds.
- Design implications:
  - Detect in-app user agents (strings such as "Instagram", "FBAN/FBAV", "musical_ly"/"BytedanceWebview", "Line") and show a non-blocking "Open in Safari/Chrome for best experience" banner.
  - Keep the room code and session token in the URL or fragment as well as in storage, so a reload or a hand-off to the system browser can rejoin the room.
  - Never require haptics, because iOS has no Vibration API. Start audio only after a user tap.
  - Do not depend on PWA install for the first session.

### Gaps
- No primary Meta, TikTok or WhatsApp documentation on in-app browser capabilities was found.
- No data was found on what share of invite-link opens happen in in-app browsers.
- WhatsApp's link-opening behavior was not confirmed (default browser vs Custom Tabs vs WebView), nor were current WebSocket or IndexedDB behaviors in each WebView. This needs a device test matrix.

## 3. Screen sizes and viewports, notches, foldables, low-end Android specs, JS budgets

### Takeaway
Design for CSS viewports from 360 to 430 px wide, with 360x800 as the narrow Android baseline and 390x844 / 393x852 as the iPhone baseline. Russell's guidance and current data argue for a very small JS payload. For the low-end Android phones common in India and SEA, aim for roughly 150-300 KB of compressed JS for the critical path, well under today's median of 680 KB.

### Cited Findings
- StatCounter worldwide mobile viewports (Aug 2026): 414x896 13.63%, 360x800 9.25%, 390x844 6.81%, 393x873 5.27%, 384x832 4.35%. — [StatCounter screen resolution](https://gs.statcounter.com/screen-resolution-stats/mobile/worldwide)
- From StatCounter data covering Aug 2024 - Aug 2025 (secondary source): worldwide mobile is led by 390x844 (13.0%), then 375x812 and 393x852. US: 375x812 12.6%, 390x844 11.08%. UK: 412x915 4.8%. The source's tables are hard to parse, so treat these as indicative. — [Hobo Web](https://www.hobo-web.co.uk/best-screen-size)
- 412x915 is described as typical of mid-range Android phones. — [TestingBot](https://testingbot.com/resources/articles/common-screen-resolutions)
- Russell's "The Budget, 2026 Edition" reports mobile JS payloads have more than doubled since 2015, to 680 KiB at P50 and 1.3 MiB at P75, and median mobile page weight is more than 2.5x larger than a decade ago. — [via SpeedCurve newsletter](https://www.speedcurve.com/newsletter/56-new-performance-inequality-gap-hidden-cost-of-media-on-the-web-the-value-of-stubborn-empathy-/)
- Russell's 2021 baseline (older, flagged): a ~$200 Android device on a 400 Kbps link with 400 ms RTT; about 100 KiB of HTML/CSS/fonts and about 300-350 KiB of gzipped JS for the whole page. — [Infrequently Noted 2021](https://infrequently.org/2021/03/the-performance-inequality-gap/)
- JSNation 2025: Russell argues that devices gain cores but most of the market does not get faster single-core performance, which is what main-thread JS depends on. — [GitNation](https://gitnation.com/contents/project-fugu-bringing-hardware-capabilities-to-the-web-safely)
- RedMonk, Nov 2025: Russell contrasts React (~100 KB of JS) with Preact (~3-4 KB) and urges restraint with JS. — [RedMonk](https://redmonk.com/blog/2025/11/24/alex-russell/)
- India's market in 2025: 152M units shipped (+0.5% YoY, IDC). Counterpoint reports +1% in volume and +8% in value, with strong premiumization (1 in 5 phones shipped were premium). IDC's sub-$100 band grew to 16% share in 2025 but fell to 8% in Q1 2026. Phones under Rs 10,000 fell from 27% of shipments (Q3 2022) and are "fast disappearing". — [EE Herald/IDC](https://www.eeherald.com/section/sourcing-database/p20260219nwidc.html); [FoneArena/Counterpoint](https://www.fonearena.com/blog/474743/india-smartphone-market-2025-counterpoint.html); [GSMArena](https://m.gsmarena.com/counterpoint_1_in_5_smartphones_shipped_in_india_in_2025_were_premium_models-news-71366.php); [BusinessToday](https://www.businesstoday.in/technology/news/story/india-smartphone-market-hits-five-year-low-phones-under-rs-10000-are-fast-disappearing-548685-2026-08-12); [Techlomedia](https://www.techlomedia.in/2026/09/the-10000-smartphone-segment-is-slowly-disappearing-126875/)

### Inferences
- New Indian phones are moving upmarket, but the installed base, which holds 3-5 years of older budget devices, is what users actually play on. Keep a low-end Android test device, such as a Moto E / Redmi A-series / Samsung Galaxy A0x-class phone with 3-4 GB of RAM.
- Proposed budgets for this game:
  - Initial route (lobby/join): ≤150 KB gzipped JS (React + Socket.IO client is roughly 45-60 KB before app code).
  - Total app JS: ≤300 KB gzipped, with lazy-loaded game modules.
  - CSS/fonts: ≤50-100 KB.
  - LCP under 2.5 s and INP under 200 ms on a mid/low-end Android over 4G. These are web.dev's "good" Core Web Vitals thresholds, from my prior knowledge; web.dev was not fetched in this session.
  - Consider Preact/compat if the budget is tight.
- Layout:
  - Support widths from 320 to 430 px and short heights (around 640 px, for in-app browsers whose toolbars eat height).
  - Use `viewport-fit=cover` with `env(safe-area-inset-*)` for notches and the home indicator.
  - Use `dvh`/`svh` units, not `100vh`, because in-app browser chrome changes the visible height.
  - Foldables (Galaxy Z Fold inner screens of roughly 600-900 px wide) need only a sensible max-width or centered layout.

### Gaps
- No RAM or CPU distribution data for active devices in India or SEA was found (for example, the share of devices with 4 GB of RAM or less).
- Russell's specific 2025/2026 recommended budget numbers (as opposed to the observed P50/P75 payloads) could not be read, because infrequently.org was blocked.
- web.dev pages and foldable market share figures were not retrieved.

## 4. Mobile data costs and speeds by country (first-load size budget)

### Takeaway
Data is cheap per GB in India, Indonesia and Brazil (about $0.16-0.40) but expensive in the US. Median speeds are high where 5G has rolled out: about 132 Mbps in India and about 250 Mbps in Brazil. The real problem is the tail (crowded networks at night, weak indoor signal, prepaid users rationing data), not the median. A first load under 500 KB, with near-zero repeat-visit cost through a Service Worker, is a safe target.

### Cited Findings
- Cable.co.uk 2023 study (the most recent edition found; flagged as older): 5,603 plans in 237 countries, global average $2.59/GB, down from $3.12. India is $0.16 (rank 7), Indonesia $0.28 (17), Brazil $0.40 (32) and Philippines $0.59 (55); the UK ranked 58th. — [ISPreview](https://www.ispreview.co.uk/index.php/2023/09/uk-ranks-58th-in-the-world-for-the-price-of-1gb-of-mobile-data.html); [BestBroadbandDeals table](https://bestbroadbanddeals.co.uk/mobiles/worldwide-data-pricing/)
- A Visual Capitalist chart (Jan 2024, 52 countries) gives India $0.09, Brazil $0.38, Indonesia $0.28 and Philippines $0.59. — [Visual Capitalist](https://www.visualcapitalist.com/the-cost-of-1-gb-of-mobile-data-worldwide/)
- Older US/UK figures (2019 and 2021, flagged as outdated): US $12.37/GB (2019) and $3.33/GB (2021); UK $6.42/GB (2019). — [TechRadar](https://www.techradar.com/news/uk-has-some-of-the-most-expensive-mobile-data-in-europe); [Verdict](https://www.verdict.co.uk/mobile-data-prices/)
- A 2026 republication of the dataset repeats the 2023-era values (India $0.16, Indonesia $0.28, Brazil $0.40, Philippines $0.59). — [StatRanker 2026](https://statranker.org/digital-innovation/countries-by-mobile-data-price-2026/)
- Ookla Speedtest Global Index medians: India 131.77 Mbps (Aug 2025, rank 25); Brazil about 251.55 Mbps (Oct 2025 snapshot). — [TelecomTalk](https://telecomtalk.info/india-sees-median-mobile-download-speed-jump/1000114/); [StatRanker](https://statranker.org/digital-innovation/top-100-countries-by-mobile-internet-download-speed-median-2025/)
- Indonesia and Philippines medians: only conflicting, undated mirror values were found (Indonesia 53-78 Mbps, Philippines 59-95 Mbps), so none are cited as reliable.

### Inferences
- Bandwidth is rarely the bottleneck at the median, but latency and packet loss over mobile networks are. Socket.IO reconnection, heartbeat tolerance and an idempotent event design matter more than squeezing out the last KB.
- Size the first load against Russell's slow-link baseline (400 Kbps, 400 ms RTT), not the medians. At 400 Kbps, 500 KB takes about 10 s, while 200 KB takes about 4 s.
- Avoid heavy media. Lazy-load audio and illustrations, and prefer SVG or CSS.

### Gaps
- No 2025 Cable.co.uk edition was found (the site was blocked). No 2025 data was found for Vietnam, the Middle East, the EU, the US or the UK.
- No Ookla 25th-percentile or night-time (peak-hour) speed data was found.

## 5. Usage time patterns: late-night use, dark mode, battery saver, Do Not Disturb, Low Power Mode effects

### Takeaway
Young adults mostly keep their phone in or next to the bed, and most people say they use dark mode, especially at night. The game should therefore default to a dark theme, or follow `prefers-color-scheme` and lean dark. iOS Low Power Mode halves animation frame rates (30 fps) and overrides Screen Wake Lock. Animations should tolerate 30 fps, and timing should never depend on the screen staying on.

### Cited Findings
- 90% of 18-29 year-olds sleep with their phone on or next to the bed (Pew, 2010; very old, flagged). — [Pew Research 2010](https://www.pewresearch.org/short-reads/2010/09/13/do-you-sleep-with-your-cell-phone/markdown)
- About 40% of 18-30 year-olds who report excessive smartphone use also report poor sleep (study of 1,043 university students). — [The Hospitalist](https://blogs.the-hospitalist.org/node?page=2414)
- Dark mode: 81.9% of 2,500 Android users surveyed said they use it, and 9.9% switch between modes. About 82.7% use dark mode after 10 p.m. These are SEO-blog aggregations of self-selected polls, so the true rate is likely lower. Nielsen Norman Group found about a third of users consistently prefer light mode. — [forms.app](https://forms.app/en/blog/dark-mode-statistics); [EarthWeb](https://earthweb.com/how-many-people-use-dark-mode/); [WifiTalents](https://wifitalents.com/dark-mode-usage-statistics/)
- iOS Low Power Mode caps requestAnimationFrame at about 30 fps (since iOS 14) and slows CSS animations too. Low Power Mode cannot be detected directly. Safari also throttles rAF in cross-origin iframes until the user interacts. — [WebKit bug 215745](https://bugs.webkit.org/show_bug.cgi?id=215745); [Popmotion](https://popmotion.io/blog/20180104-when-ios-throttles-requestanimationframe/)
- Screen Wake Lock API is supported in Safari since iOS 16.4. In Low Power Mode, iOS still dims and locks the screen even with an active wake lock. — [Web Features Explorer](https://web-platform-dx.github.io/web-features-explorer/features/screen-wake-lock/); [TestMu](https://www.testmuai.com/learning-hub/wake-lock-api-browser-support/)
- On iOS in Low Power Mode, even media without sound may be blocked from autoplaying. — [Thomas Visser](https://www.thomasvisser.me/2018/06/26/wkwebview-media/)

### Inferences
- Night play design implications:
  - Use a dark-first palette that avoids pure #000 and pure #FFF text, to reduce glare and halation.
  - Make sound opt-in and muted by default, since a partner may be asleep nearby or the phone may be on silent.
  - Do Not Disturb or Focus will suppress push notifications, so turn prompts must be visible in the app, not notification-dependent.
- Backgrounded tabs throttle or suspend timers and WebSockets on both iOS and Android. This is general platform behavior from prior knowledge, not sourced in this session. Use server-authoritative timers with timestamps, resync on the `visibilitychange` event, and expect reconnects after the screen locks.
- Request Screen Wake Lock during active rounds, but treat it as best-effort.

### Gaps
- No 2024-2026 survey of bedtime phone use among 18-29 year-olds was found, and no data on the hours at which Gen Z play couples games.
- No primary data was found on Low Power Mode or battery saver usage rates, or on Android battery saver effects on WebView timers.
- No setTimeout throttling figures under Low Power Mode were found.

## 6. One-handed use and thumb-zone research (Hoober), large phones

### Takeaway
Hoober observed about 49% of users operating their phone one-handed. He found the screen center easiest and most accurate to tap, and the edges and corners hardest. He has since called the rigid "thumb zone" heat map wrong. Put primary actions in the lower-middle of the screen, make targets at least 44-48 px, and keep important taps out of the top corners. That matters more on 6.5"+ phones.

### Cited Findings
- 1,333 observations (Nov 2012 - Jan 2013), 780 of them involving touch: 49% one-handed, 36% cradled (held in one hand, tapping with the other), 15% two-handed (this data is old). — [UX Planet](https://uxplanet.org/mobile-usability-made-simple-945e106e23eb); [A List Apart](https://alistapart.com/1-2-phone-grips-jpg/)
- Hoober 2014: the center of the screen was the easiest, fastest and most accurate place to tap, and taps outside it often involved two hands. He has since called the classic thumb-zone chart "wrong" (4ourth Mobile, 2022). — [Monterail](https://www.monterail.com/blog/thumb-friendly-navigation-word-oriented-design); [Mobiforge](https://mobiforge.com/design-development/designing-touch-thumb-and-finger-sized-design)
- Touch targets: about 7x7 mm (roughly 40-44 px). Platform guidance is 44x44 pt on iOS and 48x48 dp on Android, and the WCAG 2.2 minimum is 24x24 CSS px. — [Mobiforge](https://mobiforge.com/design-development/designing-touch-thumb-and-finger-sized-design); [Monterail](https://www.monterail.com/blog/thumb-friendly-navigation-word-oriented-design)

### Inferences
- In bed, users often lie on their side holding the phone one-handed. Keep core game actions in the lower or middle area, leave spacing between destructive and confirm buttons, and avoid top-corner close buttons for critical actions.
- Support landscape gracefully, or lock to portrait through the PWA manifest. In-app browsers ignore the manifest.

### Gaps
- No 2024-2026 grip or thumb-reach study for modern 6.5-6.9" phones was found, and none specific to use in bed or lying down. Hoober's primary UXmatters articles were not retrieved.

## 7. Prevalence of accessibility needs relevant to design

### Takeaway
About 8% of men and 0.5% of women have colour vision deficiency, mostly red-green. In a heterosexual couple, roughly 1 in 12 pairs will include a colour-blind player. Never encode game state with red/green alone. Low vision and dyslexia are also common enough to justify scalable text, high contrast and plain, readable typography.

### Cited Findings
- Colour vision deficiency affects up to 8% of men of Northern European descent and under 1% of women. It is X-linked and mostly red-green. Other sources give 5-8% of men and 0.5-1% of women. — [MDPI Healthcare 2025](https://www.mdpi.com/2227-9032/13/16/2031/xml); [News-Medical](https://www.news-medical.net/health/Color-Blindness-Prevalence.aspx)
- Low vision: about 246 million people (3.5% of the world population) are attributed to WHO, but only via a secondary flashcard source; unverified and likely an older (2010-era) WHO figure. — [Brainscape](https://www.brainscape.com/flashcards/disability-statistics-1d-40-16706734/packs/22251592)
- Dyslexia: 5-10% of people, possibly up to 17% (no primary source; low reliability). — [Brainscape](https://www.brainscape.com/flashcards/disability-statistics-1d-40-16706734/packs/22251592)

### Inferences
- Recommended accessibility features:
  - Pair colour with icons, shapes or text labels.
  - Meet WCAG AA contrast (4.5:1 for body text) in both dark and light themes.
  - Respect the OS text-size setting by using rem units with a 16 px minimum body size.
  - Honor `prefers-reduced-motion`, which also helps with Low Power Mode frame drops.
  - Use short sentences and left-aligned text for players with dyslexia.
  - Keep tap targets at 44 px or larger.
- In a mixed-sex couple, the chance that at least one partner is colour-blind is about 8.5% (≈0.08 + 0.005), based on the cited rates.

### Gaps
- No authoritative current (2023-2026) WHO or IDA figures were retrieved for low vision or dyslexia. No data was found on the use of OS-level accessibility settings (larger text, bold text, reduce motion) among 18-29 year-olds.
