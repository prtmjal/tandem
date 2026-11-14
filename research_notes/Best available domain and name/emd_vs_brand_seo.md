# Exact-match domain vs brand name vs hybrid for a couples web game (US, UK, CA, AU), and the domain setup that maximises search and AI visibility

**Method note (read first).** Researched 2026-11-14. These notes build on `research_notes/Couples game domain keywords/emd_seo_value.md` and `serp_competition.md` (both 2026-11-05) and do not repeat their findings except where needed.
- **All findings come from web-search result summaries, not full-text page reads.** Direct fetches of developers.google.com, ahrefs.com, searchenginejournal.com and similarweb.com failed (hosts outside this session's allowed network). Quotes and figures should be spot-checked against the originals before publication.
- **No Ahrefs tool data.** `serp-overview` for "couples game" (US) and "games for couples" (GB) again returned "Insufficient plan", as on 2026-11-05. There are no DR figures, keyword difficulty scores or true Google positions in these notes.
- **No live Google results.** The search tool is US-only and is not a Google SERP. "Appears in results" means "competes for the phrase", not a Google rank. UK, Canada and Australia results could not be observed at all.
- Each finding is labelled **[measured]** (a dataset with a stated sample), **[Google statement]**, **[leak]**, **[legal]** or **[opinion]** (vendor or agency view without data).

---

## 1. What does 2023-2026 evidence say about a ranking benefit from exact-match or keyword domains?

### Takeaway
There is no measurable direct ranking benefit, and no independent large-sample study from 2023-2026 that isolates one. Google's documented position is that it has a system that stops exact-match domains getting excess credit, its staff have repeated "no bonus" through late 2025, and the 2024 leak shows a named demotion for exact-match domains alongside a site-level authority score. What does predict ranking is authority and links, which a new domain of either kind starts without.

### Cited Findings
- **[Google statement]** Google's ranking-systems guide lists an "exact match domain system" described (in a secondary summary) as stopping sites from getting excess credit just because the domain matches a query. Secondhand; the Google page itself could not be opened. — [llmrefs summary](https://llmrefs.com/blog/domain-names-and-seo)
- **[leak, May 2024]** The leaked Google Content Warehouse API documentation contains an attribute named `exactMatchDomainDemotion`, listed with other demotions (anchor mismatch, SERP dissatisfaction, product reviews, porn), and a `siteAuthority` attribute inside the CompressedQualitySignals module. These are internal attribute names; whether and how strongly they are used in live ranking is not known. — [Search Engine Land](https://searchengineland.com/google-search-document-leak-ranking-442617); [SE Ranking](https://seranking.com/blog/seo-news-google-api-data-leak); [Hobo Web](https://www.hobo-web.co.uk/the-definitive-guide-to-linkbuilding-after-the-google-content-warehouse-leak/)
- **[Google statement, late 2025]** John Mueller (Reddit, reported by Search Engine Roundtable): when picking a site name, pick something you can reasonably expect to rank for; a generic, competitive name can make it hard for the site to rank even for its own name. — [Search Engine Roundtable](https://www.seroundtable.com/google-reasonable-site-name-seo-rank-40660.html)
- **[Google statement, 8 Sept 2025]** Mueller said he would personally choose a traditional TLD such as .com even if that means a hyphen in the name. — [Search Engine Roundtable](https://www.seroundtable.com/google-traditional-tld-with-hyphen-40069.html)
- **[Google statement, undated in summary; SEJ pieces 2022-2024]** Asked how Google ranks keyword domains against others, Mueller answered "No difference." He also said "Pick a domain name you can build on for the long run", and that a keyword in the domain might help conversions, which can be tested with A/B tests and PPC. — [SEJ: no SEO bonus](https://www.searchenginejournal.com/google-no-seo-bonus-for-keyword-based-domains/438324/); [SEJ: keyword domains](https://www.searchenginejournal.com/keyword-domains-seo); [Search Engine Roundtable](https://www.seroundtable.com/google-keywords-domain-unnecessary-18667.html)
- **[measured, 2024]** Semrush's 2024 ranking factors study covered 300,000 positions (top 20 results per keyword). The summaries found do not report a keyword-in-domain correlation; the top-correlated factors reported were other domain- and URL-level signals. — [Semrush](https://semrush.com/blog/ranking-factors-semrush-study); [study PDF](https://dmboard.media/wp-content/uploads/2024/02/2024_Ranking_Factors_Study_1708082540.pdf)
- **[measured, about 2020, still cited]** Backlinko's analysis of 11.8M results found essentially zero correlation between keyword-in-title and first-page rank; authority and referring domains correlated. No EMD signal reported. — [Backlinko](https://backlinko.com/search-engine-ranking)
- **[measured, 2025]** Ahrefs sampled 1M URLs first seen in September 2023: only 1.74% reached Google's top 10 within a year, down from 5.7% in its 2017 study. Secondary summaries add that 13.7% of top-10 pages were under a year old (22% in 2017). This is the "new site is slow" baseline for any new domain, EMD or brand. — [Ahrefs](https://ahrefs.com/blog/how-long-does-it-take-to-rank-in-google-and-how-old-are-top-ranking-pages/); [whitehat-seo summary](https://whitehat-seo.co.uk/blog/how-long-does-it-take-to-rank-on-google)
- **[opinion]** Registrar and agency posts (NameSilo July and Dec 2025, Truehost, Domain Details) agree EMDs give "a relevance cue" but no dependable boost, with a possible small edge in low-competition or local niches. None cites data. — [NameSilo](https://www.namesilo.com/blog/en/domain-names/the-future-of-keyword-domains-are-they-still-worth-buying); [NameSilo](https://www.namesilo.com/blog/en/domains/exact-match-vs-branded-domains); [Domain Details](https://domaindetails.com/kb/domain-seo-impact)
- **[opinion, unverified]** A startup blog claims "a 2026 study" shows EMDs outperforming brands in some competitive markets; no study was traceable. One self-run single-site case study (Holistic SEO) reports strong early EMD traffic. Neither is controlled evidence. — [mean.ceo](https://blog.mean.ceo/?p=2298); [Holistic SEO](https://holisticseo.digital/?p=11684)

### Inferences
- Direct ranking value of an EMD in 2026: approximately zero, with a small documented downside risk (a named demotion exists for thin EMD sites). The brand-name "penalty" is equally absent: both start from the same 1.74%-in-a-year baseline, so "brand names rank slower" is not supported by data. What is slower for a brand is ranking for the generic phrase from the homepage alone; that gap is closed by page titles and content, not the domain.
- Mueller's late-2025 point cuts against EMDs in a second way: a site called "Couples Game" cannot even own its own name query, because that query is the contested head term.

### Gaps
- No 2023-2026 study with a stated sample isolates EMD or partial-match domains against rank. The Semrush 2024 PDF may hold a keyword-in-domain figure in its "URL & Domain Factors" section; it could not be opened.
- The exact wording of Google's "exact match domain system" entry was not read first-hand.

---

## 2. Click-through and trust: keyword domains vs brand names (CTR, type-in traffic, recall, word of mouth, links)

### Takeaway
The only measured CTR data favours keyword domains, but it is old (2011-2015), small or uncontrolled, and published by parties who sell domains. No measured study was found showing brand names earn better recall, word of mouth or links; that side of the argument rests on Google's site-name rules and on opinion.

### Cited Findings
- **[measured, Sept 2015 data, published 2016, vendor]** Verisign analysed 11 million search results from about 1.55 million query sessions on comScore's US panel. Click rate was 12.44% for results with no query keyword in the second-level domain, 21.79% with one, and 25.30% with two or more ("almost twice as likely"). Limits: it did not control for ranking position, and Verisign runs the .com registry. — [Verisign](https://blog.verisign.com/domain-names/how-keyword-rich-domain-names-positively-affect-search-click-through-results/); [Domain Name Wire](https://domainnamewire.com/?p=50327)
- **[measured, 2011, vendor, small]** Memorable Domains (a UK broker) ran PPC ads for one 11-page site on three domains: ElectricBicycles.co.uk (exact match) drew the most clicks, YourBikes.co.uk came second, InAHurry.co.uk (brandable) last. Fewer than 2,000 clicks in total. — [DomainSherpa](https://domainsherpa.com/generic-domain-name-performance-ppc-ads/); [Search Engine Watch](https://www.searchenginewatch.com/2011/07/07/exact-match-domains-can-double-clicks-on-ppc-ads/)
- **[Google statement]** Mueller: a keyword in the domain could help conversions; test it with A/B tests and PPC. — [SEJ](https://www.searchenginejournal.com/keyword-domains-seo)
- **[Google statement, documentation]** Google's site-name guidance says to choose a unique name; a generic name such as "Best Dentists In Iowa" is unlikely to be selected as the site name unless it is an extremely well-recognised brand. When Google is not confident, it shows the domain or URL instead. — [Google Search Central: site names](https://developers.google.com/search/docs/appearance/site-names?authuser=9); [Google blog, 28 July 2023](https://developers.google.com/search/blog/2023/07/sitenames?hl=en)
- **[opinion, unsourced]** A registrar page claims branded domains get "15-20% higher CTR"; no source is given. Treat as unverified. — [CrazyDomains](https://www.crazydomains.com.au/learn/memorable-domain-names/)
- **[measured, about 2019-2020, from earlier notes]** TLD recall: .com URLs were recalled correctly 44% of the time vs 33% for .co (1,500 people). This is about the extension, not brand vs keyword. — [GrowthBadger](https://growthbadger.com/top-level-domains/)

### Inferences
- A keyword in the domain plausibly lifts first-impression clicks on a results page or ad where the user has never heard of the site. The Verisign gap (12% to 22%) is inflated by position bias, so the real effect is smaller and unknown.
- That lift applies to any domain containing a query word, not only exact matches. A hybrid such as "brand + game" captures the same cue ("game" matches "couples game", "games for couples", "couples question game online").
- Google's site-name rule means an EMD loses the brand line in the result: a site named "Couples Game" would probably show its bare domain where a brand would show its name.
- Word of mouth for this product is one partner telling the other, or a friend, what to open. "We played a couples game" is not a findable instruction; a distinctive name is. This is reasoning, not measured.

### Gaps
- No 2020-2026 measured data on brand vs keyword domain CTR, recall, type-in traffic or link earning. No post-2015 organic CTR study by domain type.
- No data on how AI Overviews or reduced URL display on mobile results have changed the CTR cue since 2015. The domain string is less visible in results now than in 2015, which would shrink the effect, but this was not sourced.

---

## 3. How AI assistants and AI Overviews pick sites to cite, and whether brand vs keyword domain matters

### Takeaway
AI visibility tracks how often a brand is named across the web, not what the domain says. Measured studies put branded web mentions far ahead of backlinks, and the link between ranking in Google's top 10 and being cited in AI Overviews weakened sharply between mid-2025 and early 2026. A distinctive name is an asset here; a generic one cannot accumulate attributable mentions.

### Cited Findings
- **[measured, 26 May 2025]** Ahrefs (75,000 brands, Spearman correlation with AI Overview brand mentions): branded web mentions 0.664, branded search volume 0.392, backlinks 0.218. Brands in the top quartile for web mentions averaged 169 AI Overview mentions vs 14 in the next quartile. About 26% of brands had zero mentions. Correlation only. — [Ahrefs](https://ahrefs.com/blog/ai-overview-brand-correlation/?re=true)
- **[unverified]** A secondary post says a December 2025 Ahrefs follow-up found YouTube mentions correlate about 0.737 with ChatGPT and AI Mode visibility. Not confirmed from Ahrefs. — [Medium](https://medium.com/@lorenzoswanson786/ahrefs-studied-75-000-brands-brand-mentions-beat-backlinks-3-to-1-for-ai-visibility-e86ef9f6baba)
- **[measured, March 2026]** Ahrefs: only 37.9% of AI Overview citations also appear in the organic top 10, down from 76% in its July 2025 version of the study. **This supersedes the 76% figure quoted in the 2026-11-05 notes.** — [DesignRush report](https://news.designrush.com/ai-overview-citations-drop-ahrefs); [Ahrefs](https://ahrefs.com/blog/search-rankings-ai-citations)
- **[measured, different methods]** BrightEdge (Feb 2026): about 17% overlap. Conductor: 43% of cited pages in the organic top 10. seoClarity (Oct 2025, per keyword): overlap 32% of the time, 89% when only one source is cited. — [Conductor](https://www.conductor.com/academy/aio-vs-organic-rankings/); [seoClarity](https://www.seoclarity.net/research/aio-rankings-overlap); [five-study roundup](https://apiserpent.com/blog/ai-overview-citations-vs-rankings-overlap)
- **[measured, Jan-Feb 2026, US]** Similarweb (about 600,000 citation events): Wikipedia is ChatGPT's most-cited domain at about 13%; in Google AI Mode, fandom.com is first, ahead of Wikipedia and YouTube. — [Similarweb](https://aisearch.similarweb.com/blog/most-cited-domains-llms/)
- **[measured, Q1 2026]** 5W audit: Wikipedia 13.15% and Reddit 11.97% of US ChatGPT citations. — [Everything-PR](https://everything-pr.com/chatgpt-citation-source-index-2026)
- **[measured, March 2026]** Kevin Indig (1.2 million ChatGPT responses): about 30 domains take 67% of citations within a topic; the top 10 take 46% for product-comparison queries. — [Contently roundup, 29 Apr 2026](https://contently.com/2026/04/29/top-sources-llms-cite/)
- **[measured, 2026, from earlier notes]** Semrush and Kevin Indig (3,981 domains): 61.7% of AI citations link a page without naming the brand in the answer. — [SEJ](https://searchenginejournal.com/the-ghost-citation-problem/572453)

### Inferences
- No study found tests domain string against AI citation. The measured drivers (brand mentions, branded search volume, presence on Reddit, YouTube, Wikipedia and listicles) all require a name that can be told apart from the category. "Couples game" in a Reddit thread is a category word; a coined name is a countable mention.
- For "best online games for couples" style prompts, assistants draw on a small set of listicles and community threads. Being named in those (Paired's and Plarium's roundups, Reddit r/LongDistance, AlternativeTo, Product Hunt) is the route in, and each needs a name to print.
- Because AI Overview citations now come mostly from outside the top 10, clear, quotable pages on the main domain (what the game is, how two phones pair, the privacy claims, a FAQ) can be cited before the site ranks.

### Gaps
- No measured study of brand vs keyword domain in AI citations. No study specific to games or relationship queries.
- Canada, UK and Australia AI-citation data were not found; the cited studies are US or global.

---

## 4. Risks of EMDs and risks of brand names

### Takeaway
EMD risks are structural and permanent (weak trademark, an unownable name, no site name in results, a demotion system pointed at the category); brand-name risks are temporary and fixable with content (no keyword cue until people know the name). For a product that sells a pass through Stripe and may list in app stores, the EMD risks weigh more.

### Cited Findings
- **[legal, 30 June 2020]** *USPTO v. Booking.com* (US Supreme Court, 8-1): a "generic.com" term is generic "only if the term has that meaning to consumers." Registration is possible but depends on proof of consumer perception; the ruling does not make generic.com names automatically registrable. BOOKING.COM succeeded on survey evidence of recognition. — [Fish & Richardson](https://www.fr.com/news-insights/articles/supreme-court-finds-booking-com-protectable-rejects-sweeping-rule-denying-protection-to-generic-com-marks/); [IPWatchdog](https://ipwatchdog.com/2020/07/05/supreme-courts-booking-com-ruling-signals-uptick-registration-generic-com-marks/); [Lathrop GPM](https://www.lathropgpm.com/insights/supreme-court-booking-com-and-other-domain-names-combining-a-generic-term-with-com-can-be-registered-and-protected-as-trademarks/)
- **[legal, from earlier notes]** USPTO refuses "merely descriptive" marks under TMEP §1209; suggestive and arbitrary marks are registrable. — [BitLaw TMEP 1209](https://www.bitlaw.com/source/tmep/1209.html)
- **[Google statement, documentation]** Generic site names are unlikely to be shown as the site name in results. — [Google Search Central](https://developers.google.com/search/docs/appearance/site-names?authuser=9)
- **[Google statement, late 2025]** A generic, competitive name can be hard to rank for even as a name query. — [Search Engine Roundtable](https://www.seroundtable.com/google-reasonable-site-name-seo-rank-40660.html)
- **[leak, 2024]** A named `exactMatchDomainDemotion` attribute exists. — [Search Engine Land](https://searchengineland.com/google-search-document-leak-ranking-442617)
- **[Google statement]** Mueller: a keyword domain can limit growth if the business changes; choose a name to build on. — [SEJ](https://www.searchenginejournal.com/keyword-domains-seo)
- **[platform rules, from earlier notes]** Apple and Google Play cap app titles at 30 characters and bar keyword-stuffed metadata. — [Phiture ASO guide](https://phiture.com/asostack/app-store-and-play-store-guidelines/); [Google Play metadata policy](https://support.google.com/googleplay/android-developer/answer/9898842?hl=en)
- **[observed 2026-11-14]** App stores already hold many near-identical generic titles: "Couple Games: 2 Player Games", "Couples Questions: The Game", "Couples Quiz: Question Game", "Relationship Game For Couples", "Question Games - Couples: Bond", "Questions for Couples". — [App Store](https://apps.apple.com/us/app/id6761193720); [App Store](https://apps.apple.com/app/id6751457847); [App Store](https://apps.apple.com/us/app/-/id6749571239); [App Store](https://apps.apple.com/us/app/-/id6751173415)
- **[measured, 2025]** New pages rarely rank fast whatever the name: 1.74% reach the top 10 within a year. — [Ahrefs](https://ahrefs.com/blog/how-long-does-it-take-to-rank-in-google-and-how-old-are-top-ranking-pages/)

### Inferences
- **Trademark.** A descriptive name for a couples game would need acquired distinctiveness (years of use plus survey evidence) to register in the US; a newcomer cannot show that. Without a mark there is no practical way to stop look-alike apps, domains or ads using the same words, and the App Store evidence shows that crowd already exists.
- **Resale.** A premium EMD holds resale value as a domain, but the business built on it has little separable brand goodwill. No sourced price data was gathered here (see `availability_prices.md` in the earlier notes).
- **Ads and app stores.** A generic name cannot be defended as a brand keyword in search ads (competitors bidding on "couples game" are bidding on the category) and will be indistinguishable from the generic-titled apps above. Reasoned, not sourced.
- **Perceived spam.** Hyphenated or multi-keyword domains read as low quality; Mueller's dislike of "keyword-keyword" names is on record in the earlier notes. A one-keyword hybrid does not carry this.
- **Brand-name risk.** The only real cost is the missing relevance cue for strangers on a results page. A title tag ("Brand: the two-phone game for couples") and a descriptive site tagline supply it at no cost.

### Gaps
- UK, Canadian and Australian trademark rules on descriptive marks were not researched (UKIPO, CIPO and IP Australia all refuse descriptive marks in principle, but no source was gathered).
- No sourced data on ad-platform treatment of generic vs brand domains, or on EMD resale prices in this niche.

---

## 5. Hybrid patterns, and subdomain (play.brand.com) vs subfolder; where the blog should live

### Takeaway
The working couples products nearly all use a brand, or a brand plus one generic word or action prefix; that hybrid is the best-supported choice. For structure, Google says subdomains and subfolders both work, but it handles a subdomain as its own site in several places (Search Console, site names), so the pages meant to rank, including the blog, belong in subfolders of the main domain. Putting the game on play.brand.com costs nothing, because the game is not meant to rank.

### Cited Findings
**Hybrid naming in this niche (observed in results, 2026-11-05 and 2026-11-14)**
- Pure brand on .com or .app: paired.com, flamme.app. — [Paired](https://www.paired.com/articles/best-online-games-for-couples); [Flamme](https://www.flamme.app/dirty-truth-or-dare-questions-for-couples)
- Brand + "game": privegame.com. — [Privé](https://privegame.com/en/blog/spicy-questions-for-couples)
- "try" + brand: trycandle.app, tryamora.app. — [Candle](https://www.trycandle.app/blog/questions-to-ask-your-boyfriend); [Amora](https://tryamora.app/blog/100-spicy-questions-for-couples)
- Brand + "couples": pairplaycouples.app, connectedcouples.app (which ranks with a `/couples-games-online` page and browser games under `/games/`). — [Pairplay](https://pairplaycouples.app/blogs/25-spicy-questions-to-ask-your-partner); [Connected Couples](https://www.connectedcouples.app/couples-games-online); [Connected Couples 21 Questions](https://www.connectedcouples.app/games/21-questions)
- "get" + descriptive: getcouplezone.com. — [getcouplezone](https://getcouplezone.com/blog/couple-games-online.html)
- **[opinion, anecdotal]** Domain-industry posts list get, try, use, go, my, join and app as the established modifiers when the bare .com is taken (examples: getdbt.com, tryghost.org, usebruno.com); one analysis says 29 of 30 "get" domains it looked at were .com. No rigorous frequency study exists. — [dn.org](https://dn.org/underused-try-get-join-prefixes-in-domain-strategy/); [Media Options](https://mediaoptions.com/blog/the-domain-name-debate-try-vs-get)

**Subdomain vs subfolder**
- **[Google statement, 2018]** Mueller: "Google Web Search is fine with using either subdomains or subdirectories." Google has to learn to crawl a subdomain separately, "but for the most part that's just a formality for the first few days." Subdomains must be verified separately in Search Console. — [SEJ](https://www.searchenginejournal.com/google-treats-subdomains-subdirectories-john-mueller-says/254687/)
- **[opinion with case data]** Ahrefs' view: subdomains that are well linked into the main site are likely treated as part of it; in one migration it examined, traffic moved location rather than grew. Portent reports a case with a 40% rise in sessions after moving a blog from a subdomain to a subfolder. Sources do not agree, and no large-sample study exists. — [Ahrefs](https://ahrefs.com/blog/subdomain-vs-subfolder); [Portent](https://portent.com/blog/seo/subdirectories-vs-subdomains.htm); [Bruce Clay](https://www.bruceclay.com/blog/subdomains-vs-subdirectories-seo/)
- **[Google statement, documentation]** Google supports one site name per site, where a site is a domain or a subdomain; subdirectories cannot have their own. Subdomain site names are supported (rolled out 2023). — [Google Search Central](https://developers.google.com/search/docs/appearance/site-names?authuser=9); [Search Engine Roundtable](https://www.seroundtable.com/google-updates-site-names-in-search-results-35787.html)
- **[Google statement, Nov 2024]** In its site reputation abuse update, Google said it can treat a section that is independent or starkly different from the rest of a site separately, so it stops benefiting from site-wide signals, wherever it sits. — [Google Search Central blog](https://developers.google.com/search/blog/2024/11/site-reputation-abuse?hl=en); [Search Engine Land](https://searchengineland.com/google-site-reputation-abuse-policy-now-includes-first-party-involvement-or-oversight-of-content-448432)
- **[leak, 2024]** A site-level `siteAuthority` score exists. Whether it is computed per hostname or per registered domain is not stated in the coverage found. — [SE Ranking](https://seranking.com/blog/seo-news-google-api-data-leak)

### Inferences
- **Verdict on naming.** Ranked for this product: (1) brand, or brand + one generic word ("brandgame.com", "playbrand.com") on .com; (2) brand on .app if the .com is out of reach; (3) EMD last. The hybrid keeps a registrable core word, shows a query word in the URL for the unmeasured-but-plausible click cue, and matches what the ranking couples products already do. "play" as a prefix has a bonus: it reads as an instruction when spoken.
- **Avoid "play" twice.** If the game sits on a `play.` subdomain, a "play" prefix in the domain gives "play.playbrand.com". Prefer "brandgame.com" with "play.brandgame.com", or a bare brand.
- **Structure for this codebase.** The project already serves the site (home, blog, privacy) on `SITE_URL` and the game on `PLAY_URL`, with game pages sent `X-Robots-Tag: noindex` and the blog at `/blog` on the site host. That is the right split: nothing on the play host is meant to rank, so the subdomain question has no SEO cost, and the blog already sits in a subfolder where it shares the main host's links and site name.
- **Setup checklist that follows from the findings:**
  - One canonical host for the site (choose bare or www, 301 the other); 301 every defensive domain and TLD to it so links and mentions consolidate.
  - Keep the blog and any rankable content pages (question lists, "how it works", FAQ) on the main domain in subfolders, never on a blog subdomain.
  - Add `WebSite` structured data with `name` (the brand) and `alternateName` on the home page so Google shows the brand as the site name.
  - Verify the registered domain as a Domain property in Search Console (covers both hosts).
  - Keep invite links on the play host, but make every share surface (share card, link preview title) name the brand, so shares produce brand mentions.
  - Use one .com for all four markets. A ccTLD (.co.uk, .ca, .com.au) geotargets to one country and would split signals; hold them only as redirects if wanted.
  - Use the same brand word for the domain, the site name, social handles and any future app title, so mentions add up for AI visibility.

### Gaps
- No study found compares "play"/"get"/"try" prefixes or "game" suffixes on ranking, CTR or recall. The naming ranking above is inference from sections 1-4.
- No evidence on whether Google's site-level authority is per host or per registered domain.
- AI crawler handling of a `noindex` play subdomain was not researched; it is not needed for visibility because the content pages live on the main host.

---

## 6. Who ranks today in the US and UK for "couples game", "games for couples", "questions for couples", "couples question game online"? EMDs or brands? What changed since 2026-11-05?

### Takeaway
Still brands, publishers and app listings; still no exact-match domain for any head term. The change since 5 November is at the browser-game end, where new free-game portals and throwaway pages.dev sites have appeared, and where Connected Couples now presents a set of free in-browser games. None of the newcomers is an EMD. UK-specific results could not be observed.

### Cited Findings
**Unchanged from 2026-11-05**
- Paired, Plarium, rarepike.com, getcouplezone.com, abrokenbackpack.com and connectedcouples.app still appear for online couples-game queries; Couples Game Night (browser, two phones, one invite link) is still the closest product rival and is still found through AlternativeTo, not its own domain. — [Paired](https://paired.com/articles/best-online-games-for-couples); [Plarium](https://plarium.com/en/blog/best-games-for-couples-online-in-2026-play-together-anywhere/); [rarepike](https://rarepike.com/best-online-games-for-couples/); [AlternativeTo](https://alternativeto.net/software/couples-game-night/about/)
- No result from couplesgames.com, couplesgame.com, gamesforcouples.com or questionsforcouples.com appeared for any of the four phrases on 2026-11-14 (result sets linked in this section).

**New or newly visible on 2026-11-14 (US search tool)**
- Free browser-game portals with "best games for couples 2026" pages: fastplaygames.com (several pages, including a Chinese-language one), dinogame.gg, doodoo.love, plays.org. These list generic two-player games (Tic-Tac-Toe, Connect Four, Checkers), not couples question games. — [fastplaygames](https://fastplaygames.com/best/best-games-for-couples); [dinogame.gg](https://dinogame.gg/blog/best-games-for-couples/); [doodoo.love](https://doodoo.love/news/2026-04-best-2-player-browser-games)
- Throwaway sites on pages.dev: couplescade (two hostnames), longdistance.pages.dev. — [couplescade](https://couplescade-bog.pages.dev/blog/best-online-games-for-long-distance-couples); [longdistance](https://longdistance.pages.dev/activities-and-travel/online-games-for-couples.html)
- Connected Couples describes its browser games as free with no email, account or download, on one shared screen (two phones do not sync). — [Connected Couples](https://www.connectedcouples.app/couples-games-online)
- New app listing: "Duetto: Couples Games" (real-time rounds synced between two phones). — [App Store](https://apps.apple.com/app/id6776353594)
- "questions for couples game online free": seven of the first results are App Store listings with generic titles; web results are dateyourspouse.com (printables), a Product Hunt page for "Couples Questions Games", playgama.com ("Would you rather - Questions for couples", browser) and connectedcouples.app/games/21-questions. — [dateyourspouse](https://dateyourspouse.com/20-questions-couples-game/); [Product Hunt](https://www.producthunt.com/products/couples-questions-games/alternatives); [Playgama](https://playgama.com/export/game/would-you-rather--questions-for-couples)
- Hijacked-subdomain spam persists (for example pages on analytics.streetsforall.org and srand.publisher-collective.com). — [example](https://analytics.streetsforall.org/insights/games-for-two-person-online-9289094)

**UK-worded query ("games for couples UK ...", still a US index)**
- Results skew to board and card games and retail: asmodee.co.uk, meeplelikeus.co.uk, screenhype.co.uk, Yahoo UK, byquanna.com ("The UK's best sexy couples card games"), plus Paired, Regain, StyleCraze, WeddingWire and Pinkvilla. All brands or publishers; no EMD. — [Asmodee UK](https://www.asmodee.co.uk/blogs/news/best-couples-board-games); [By Quanna](https://byquanna.com/blogs/qurious-club/couples-card-games-uk); [Paired](https://www.paired.com/articles/best-couples-games); [Screen Hype](https://www.screenhype.co.uk/10-best-competitive-board-games-for-couples/)

### Inferences
- Across two checks nine days apart and six phrase variants, zero exact-match domains surfaced. The sites that do rank with a category word in the domain (connectedcouples.app, pairplaycouples.app, getcouplezone.com) are brand-plus-keyword hybrids ranking through content pages.
- "Couples question game online" has app-store intent: a web game competes mainly with App Store listings and two or three browser offerings (Connected Couples, Playgama, Couples Game Night). A two-phone synced browser game is a real gap: Connected's own page says its browser games do not sync between phones.
- In the UK, "games for couples" leans to physical board and card games. A UK landing page should say "online", "on your phones" or "no download" early to match the right intent. Unverified on google.co.uk.

### Gaps
- No Google positions, DR or traffic for any site: Ahrefs `serp-overview` returned "Insufficient plan" for US and GB on 2026-11-14. This needs a plan upgrade or a manual check.
- No UK, Canada or Australia result sets: the search tool is US-only.
- Whether couplesgame.com, couplesgames.com, gamesforcouples.com and questionsforcouples.com are live sites, parked or for sale was not checked (fetches are blocked); their absence from results is the only evidence.
- Nine days is too short to call any change a trend; the "new" portals may simply not have been surfaced by the 5 November queries.
