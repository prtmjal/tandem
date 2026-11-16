# Platform and legal policies for an adult-adjacent (18+, non-explicit) couples game: www.nodtwice.com

Method note (read first): every direct page fetch failed in this session (developers.google.com, support.google.com and stripe.com did not resolve; the network allowlist blocked them). All findings below therefore come from WebSearch result summaries, which sometimes embed short quotes from the policy pages. Quotes shown in quotation marks are as returned by the search tool, not verified against the live page. Each section's Gaps lists what needs opening on the primary page. Date context: November 2026. This is research, not legal advice; a lawyer should review the age-assurance and payments conclusions.

## 1. Google Search: SafeSearch, adult classifiers, rating tags, spam and affiliate rules

### Takeaway
Google's SafeSearch is an automated classifier that uses words on the page and in links; it explicitly admits it can flag "subtly suggestive" sites (lingerie, sex education, massage, "racy content"), so a steamy-but-not-graphic game can be filtered even without explicit content. The `adult` rating tag (or RTA label) should NOT be used on non-explicit pages because it makes SafeSearch filter the page regardless of content; the safe position is to stay unlabelled and keep the indexable surface (landing, blog) clean.

### Cited Findings
- Google recommends marking explicit pages with rating markup: "To mark a particular page as explicit, add rating markup with the adult value either as a meta tag or an HTTP response header. We recommend adding this tag to any page with sexually explicit content." Google also recognizes the RTA label `RTA-5042-1996-1400-1577-RTA`. — [Google Search Central: Guidelines for sites with explicit content](https://developers.google.com/search/docs/specialty/explicit/guidelines) (via search summary)
- Troubleshooting page: "SafeSearch filters out all pages that use the adult rating meta tag, regardless of their content." Fix is to remove the tag from pages that are not sexually explicit. — [Google: site incorrectly flagged as explicit](https://developers.google.com/search/docs/specialty/explicit/troubleshooting) (via search summary)
- SafeSearch "relies on automated systems that use machine learning and a variety of signals to identify explicit content, including words on the hosting web page and in links." — [Google Search Central explicit-content docs](https://developers.google.com/search/docs/specialty/explicit/guidelines) (via search summary)
- Google acknowledges false positives: "Sometimes our systems may flag other content as explicit (for example, content that's more nuanced or subtly suggestive in nature, such as: lingerie websites, sex education sites, massage sites, racy content)". — [Google troubleshooting page](https://developers.google.cn/search/docs/specialty/explicit/troubleshooting?hl=en) (via search summary)
- Whole-site risk: "If a website contains a significant amount of nudity or sexually explicit content (including computer generated)... the whole site may be classified as explicit"; sites with mixed content are advised to group explicit pages separately (own domain/subdomain). — [Google explicit-content guidelines](https://developers.google.com/search/docs/specialty/explicit/guidelines) (via search summary); the subdomain advice attributed to John Mueller is secondary coverage only — [Search Engine Land coverage](https://searchengineland.com/google-updated-its-ranking-algorithms-for-explicit-content-videos-and-content-456617)
- How to self-diagnose: set SafeSearch to Filter, and use the `site:` operator with SafeSearch on; if your site disappears, Google is filtering it. — [Google troubleshooting page](https://developers.google.cn/search/docs/specialty/explicit/troubleshooting?hl=en) (via search summary)
- Google reworked the explicit-content documentation in mid-2025 (how SafeSearch works, how it handles explicit sites, sites with many removals of violative explicit content). — [Search Engine Roundtable](https://www.seroundtable.com/google-ranking-algorithm-explicit-content-videos-safesearch-39536.html)
- An independent (older) academic test found SafeSearch over-blocks: "at least tens of thousands of web pages without any sexually-explicit content". — [Edelman, Harvard: Empirical Analysis of Google SafeSearch](https://cyber.harvard.edu/people/edelman/google-safesearch)

### Inferences
- Nothing found says individual words like "sex", "steamy", "spicy" or "kinky" in a title cause filtering by themselves; Google only says words on the page and in links are among many ML signals. Treat these words as risk-raising, not as a documented trigger. The conservative reading: the indexable pages (home, blog, privacy) should read as relationship/conversation content; the suggestive material lives only inside the noindex `/play` game, which already carries `X-Robots-Tag: noindex` per CLAUDE.md.
- Do not add `<meta name="rating" content="adult">` or the RTA label to the public pages: the game's cards are "suggestive at most, never graphic", so the tag would be a mislabel and would cause SafeSearch to filter the page (per Google's own troubleshooting text). Use it only if a future page deliberately holds explicit material (current rules forbid that).
- Being filtered by SafeSearch is not a ranking penalty in the general index; it removes the pages for users with SafeSearch on (default for under-18 and many institutional networks). Expect reduced reach, not a ban.

### Gaps
- Could not open any Google page directly; wording above is from search summaries. Verify the exact live text on the explicit guidelines and troubleshooting pages.
- No Google source found that lists trigger words in titles, headings or URLs. No A/B evidence available (Ahrefs/Similarweb unavailable).

## 2. Google spam, helpful-content, YMYL, affiliate and site-reputation-abuse policies

### Takeaway
This question could not be sourced: the Spam Policies page was not reachable and the one search aimed at SafeSearch did not return it. Only general principles can be stated, flagged as unverified.

### Cited Findings
- No source retrieved in this session for: Google's "thin affiliate pages" spam definition, `rel="sponsored"` guidance, or the "site reputation abuse" policy. The primary pages to check are [Google spam policies](https://developers.google.com/search/docs/essentials/spam-policies) and [Qualify outbound links](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links); neither was opened.
- Affiliate disclosure norms (secondary): the ASA says that where affiliate content is not obviously marketing, extra disclosure such as "Ad" is likely needed; see section 8. — [ASA affiliate marketing](https://www.asa.org.uk/resource/affiliate-marketing.html)

### Inferences
- (Unverified, from general knowledge, not from a retrieved source) Google has long asked that affiliate/paid links carry `rel="sponsored"` (and permits `nofollow`), and treats thin affiliate pages with no original value as spam. Because nodtwice's shop links appear only inside the game (noindex) after a night, there is little thin affiliate page exposure; the risk rises only if "Toy box" or retailer lists are published as indexable pages. Keep them out of the public site, and use `rel="sponsored nofollow noopener"` on any outbound affiliate anchor anyway.
- Site reputation abuse concerns third-party content hosted on a trusted site to exploit its ranking; not relevant unless the blog hosts partner content. Keep the blog first-party.

### Gaps
- All of this section needs a direct read of Google's spam policy and outbound-link pages. Not verified.

## 3. Bing/Microsoft, DuckDuckGo, Brave

### Takeaway
Bing's SafeSearch has three levels (Strict filters adult text, images and video; Moderate filters images and video only), so Strict still covers adult text. No Bing Webmaster Guidelines text on adult content was found. No DuckDuckGo or Brave material was retrieved.

### Cited Findings
- Bing SafeSearch levels: "Strict filters adult text, images and video. Moderate filters adult images and video but not text. Off filters nothing."; under-18 accounts may default to Strict. — [Microsoft Support: Blocking explicit content with SafeSearch](https://support.microsoft.com/en-us/topic/blocking-adult-content-with-safesearch-or-blocking-chat-946059ed-992b-46a0-944a-28e8fb8f1814)
- Microsoft Advertising: adult ads are classified by ad copy and target website; adult content is permitted only in search and must be age-gated by the publisher. A January 2026 summary says the blanket ban on adult ads in other formats was dropped but the policy remains for search. (Secondary summary.) — [Open Terms Archive](https://opentermsarchive.org/en/memos/bing-applies-its-intellectual-property-policies-to-all-types-of-ads-but-adult-content-remains-restricted-to-search/)

### Inferences
- Bing is a text-filtering SafeSearch in Strict mode, so suggestive words in snippets matter more there than on Google's default.

### Gaps
- Bing Webmaster Guidelines on adult content: not found. DuckDuckGo and Brave SafeSearch policies: not searched/retrieved.

## 4. Paid promotion: Google, Meta, TikTok, Reddit, Pinterest

### Takeaway
Treat paid ads for an intimacy game with suggestive themes as closed or very high rejection risk on all five platforms; the one realistic route is non-sexual relationship/conversation creative that never mentions sex, pleasure or intimacy-as-sexual, and even that may be judged by landing page. Reddit could not be verified.

### Cited Findings
- Google Ads Sexual content policy covers non-graphic material that "hints at or evokes sexual themes", restricts sexual-wellness ads to listed countries and bars a focus on sexual pleasure or enhancement; products "intended to enhance sexual activity" are a restricted category; dating ads with sexually suggestive themes restricted; dating/companionship ads need Google certification since March 2025. A change-log entry dated October 14, 2026 added examples/clearer guidance without changing enforcement. — [Google Ads Sexual content policy](https://support.google.com/adspolicy/answer/6023699), [PPC Land summary](https://ppc.land/google-spells-out-what-counts-as-sexually-suggestive-in-google-ads/), [Dating and companionship policy](https://support.google.com/adspolicy/answer/15327789?hl=en-AU) (via search summaries)
- Meta: Adult Products or Services standard bars ads promoting sexual pleasure products (sex toys, sexual enhancement), allows sexual and reproductive health ads with a health focus aimed at 18+, and Meta prohibits nudity. Enforcement is reported as inconsistent. — [Meta Adult Products or Services](https://transparency.meta.com/policies/ad-standards/content-specific-restrictions/adult-products-or-services); [Meta Health and Wellness](https://transparency.meta.com/policies/ad-standards/restricted-goods-services/health-wellness)
- TikTok adult content ad policy (updated June 2026) lists prohibited categories: sexual products, sexual services, sexually explicit content and sexually suggestive content. — [TikTok Ads: Adult content](https://ads.tiktok.com/resources/help/article/tiktok-ads-policy-adult-content) (via search summary)
- Pinterest: archived guidelines bar ads for sex toys, adult/pornographic material and sexual enhancement products; swimwear/lingerie allowed if not adult-themed or overtly sexual; a May 2026 monitoring record still lists the sex-toy prohibition. — [Pinterest advertising guidelines (2021 archive)](https://iza-server.uibk.ac.at/pywb/dilimag/20210113092156mp_/https://policy.pinterest.com/advertising-guidelines) (secondary for the 2026 status)

### Inferences
- Because TikTok lists "sexually suggestive content" and Google's policy reaches non-graphic suggestive themes, a "steamy levels" game is likely out for paid ads on both. Affiliate retailers (sexual wellness) are the reason the landing page could be judged adult-adjacent; keep any future ad landing page free of shop links.
- Organic social carries its own community rules, not covered here.

### Gaps
- Reddit Ads policy: not found. Meta/TikTok/Pinterest primary pages were not opened; wording is from summaries. No evidence found of a couples-conversation-game being approved or rejected on any platform.

## 5. Payments and platforms: Stripe, PayPal, hosting, Safe Browsing, email

### Takeaway
Stripe prohibits or restricts adult content and services and says it "can't currently work with businesses that sell or offer adult content or services"; a conversation game with no explicit content is not on the named list, but describe it plainly as a "relationship/couples conversation game" and avoid sexual terminology in the Stripe business description and product names. PayPal, Cloudflare, Google Safe Browsing: not sourced. Klaviyo and Mailchimp: adult-adjacent lists are restricted or need approval.

### Cited Findings
- Stripe's restricted list covers pornography and sexually explicit media, and sexually related services; named examples include prostitution, escorts, pay-per-view, sexual massages, fetish services, mail-order brides and adult live chat, plus adult video stores, strip clubs and online dating services. Listed businesses may be processed only with explicit prior approval; illegal ones never. — [Stripe Prohibited and Restricted Businesses FAQ](https://support.stripe.com/questions/restricted-business-list-faqs), [Stripe restricted businesses list](https://stripe.com/legal/restricted-businesses) (via search summary)
- Enforcement against adult-adjacent creators has happened (e.g. Stripe cut off a platform used by dominatrixes), showing risk of account termination without warning. — [404 Media](https://www.404media.co/stripe-cuts-off-platform-used-by-dominatrixes-wishtender/)
- Klaviyo's AUP bans sexually explicit and pornographic content; businesses in restricted categories including adult content need explicit written approval; a community answer says adult products can be emailed but not by SMS (informal). — [Klaviyo Acceptable Use Policy](https://www.klaviyo.com/legal/acceptable-use-policy), [Klaviyo community answer](https://community.klaviyo.com/marketing-30/is-it-possible-to-do-email-marketing-for-adult-industry-7742)
- Mailchimp: does not allow content that is sexually explicit; its AUP lists "adult entertainment/novelty items" as subject to closer review. (Secondary summaries.) — [Mailchimp Acceptable Use](https://mailchimp.com/legal/acceptable_use/), [ConductAtlas record](https://conductatlas.com/platform/mailchimp/mailchimp-acceptable-use-policy/adult-entertainment-subject-to-closer-review/)
- Cloudflare: its abuse materials refer to an Acceptable Hosting Policy for hosting products; no adult-content clause was confirmed. — [Cloudflare abuse policy](https://www.cloudflare.com/abuse/)

### Inferences
- Stripe risk is about description and merchant category; the Couple Pass should be described as "digital access to additional conversation prompts for a couples game", not with the words sex, kink, steamy. Consider telling Stripe support up front (Stripe says restricted businesses can seek prior approval). Affiliate links earning commission are not a Stripe matter, but a site that sells or markets sex toys could make Stripe re-classify the merchant; keep the shop links a separately-labelled, after-the-night feature and do not sell products directly.
- Because the email list is optional and separate, using Klaviyo is probably acceptable if campaigns carry no explicit content and the list is described as a "couples conversation newsletter"; confirm with Klaviyo support given the "adult content" restricted-category wording.

### Gaps
- PayPal policy, Google Safe Browsing/Search Console adult-content handling, and the actual hosting providers' AUPs (Render, Railway, Fly): not retrieved. Stripe page wording not verified directly; the question of whether an adult-oriented game is "adult content" is a judgement for Stripe.

## 6. UK Online Safety Act

### Takeaway
The OSA's pornography duties turn on content "produced solely or principally for the purpose of sexual arousal"; a suggestive-at-most game with no explicit material is likely outside that test, but this is a purpose-based judgement by Ofcom and a lawyer should confirm. Self-declared ticks would not satisfy "highly effective age assurance" if the service were in scope.

### Cited Findings
- Statutory definition: pornographic content is "content of such a nature that it is reasonable to assume that it was produced solely or principally for the purpose of sexual arousal." — [Ofcom: Adults Only guidance](https://www.ofcom.org.uk/online-safety/pornography/adults-only-what-to-do-if-your-online-service-allows-pornography), [Ofcom definition of pornography (FOI)](https://www.ofcom.org.uk/siteassets/resources/documents/about-ofcom/foi/2025/august/ofcoms-definition-of-the-term-pornography.pdf) (via search summary)
- Nudity is not the test; context and presentation matter. Ofcom's example of content outside the definition: glamour content whose primary purpose falls short of sexual arousal but may have suggestive intentions, e.g. a video of someone playing a video game in swimwear. — same Ofcom sources (via search summary)
- Part 5 (services publishing their own porn) duties applied from 17 January 2025; Part 3 services that merely allow porn must also use highly effective age assurance. Ofcom's methods list is non-exhaustive: photo ID matching, facial age estimation, credit card checks. — [Ofcom guidance on HEAA](https://www.ofcom.org.uk/siteassets/resources/documents/consultations/category-1-10-weeks/statement-age-assurance-and-childrens-access/guidance-on-highly-effective-age-assurance-and-other-part-5-duties.pdf), [Ofcom online pornography](https://ofcom.org.uk/online-safety/illegal-and-harmful-content/online-pornography)
- Placing an age check mid-way through content does not necessarily take earlier content outside the definition. — [Ofcom Adults Only guidance](https://ofcom.org.uk/adultsonly) (via search summary)
- Ofcom's detail on what counts as pornographic content sits in its Guidance on Content Harmful to Children. — same (via search summary)

### Inferences
- A game whose cards are "suggestive at most, never graphic" and whose purpose is conversation and connection likely does not meet "solely or principally for sexual arousal"; it resembles Ofcom's "suggestive but not principally arousing" example. But the platform also has user-to-user chat and a "role-play-style scenes" feature, so the Part 3 user-to-user and children's-safety duties could still be considered (not researched). A self-declared 18+ tick is not HEAA; it is only adequate if the service is out of scope.
- Wording that keeps it out of scope: describe the purpose as conversation and connection for couples, never "arousal", "turn-on", "foreplay"; do not present levels as escalating toward sex acts in public marketing; keep explicit material impossible by content rule (already in rule 2).

### Gaps
- Could not read the Ofcom Children's content guidance or Part 3 user-to-user scope. Whether the OSA children's duties apply to a game with 18+ self-attestation: not determined. Lawyer review needed.

## 7. Australia, US states, Canada

### Takeaway
All three regimes target pornography or material "harmful to minors" and require real age assurance (not a self-tick) for in-scope services; a non-explicit game is plausibly out of scope in each, with the US one-third test being the clearest.

### Cited Findings
- Australia: Phase 2 Age-Restricted Material Codes cover class 1C and class 2 material such as online pornography; first tranche (internet carriage, hosting, search engines) from 27 December 2025, second tranche (designated internet services, relevant electronic services, social media, app distribution, equipment providers) from 9 March 2026; search-engine logged-in age assurance by 27 June 2026 and app stores before 18+ downloads by 9 September 2026 (one source). Law firms say self-declaration will not be sufficient for in-scope services; penalties up to AUD 9.9 million. eSafety's definition of pornography includes sexual activity that is "real, acted or fake". — [eSafety FAQ](https://esafety.gov.au/industry/codes/faq-access-to-online-porn-and-other-adult-content), [HSF Kramer](https://www.hsfkramer.com/insights/2025-09/new-online-safety-codes-require-age-verification-for-explicit-content), [Squire Patton Boggs](https://www.squirepattonboggs.com/media/qh5bakxz/phase-2-online-safety-codes.pdf)
- Australia's social media minimum age rules: not researched (see Gaps).
- US: the Supreme Court upheld Texas HB 1181 6-3 under intermediate scrutiny in Free Speech Coalition v. Paxton (27 June 2025). The Texas law applies to commercial sites where more than one-third of the material is "sexual material harmful to minors"; "harmful to minors" uses the average-person/contemporary-community-standards/prurient-interest tests; required methods are digital ID or commercial age verification, self-declaration not listed (inference); penalties USD 10,000 per day, up to USD 250,000 if minors access. — [FIRE](https://www.thefire.org/supreme-court/free-speech-coalition-v-paxton), [Texas House analysis](https://capitol.texas.gov/tlodocs/88R/analysis/html/HB01181E.HTM), [Texas Civ. Prac. & Rem. Code 129B.002](https://texas.public.law/statutes/tex._civ._practice_&_remedies_code_section_129b.002)
- Number of states with adult-site age verification laws: sources vary; one tracker says 27 states as of 13 August 2026 (not verified against a primary source); the Free Speech Coalition tracker is the cited place for a state-by-state list. — [Recording Law table](https://www.recordinglaw.com/us-laws/age-verification-laws/), [Free Speech Coalition AV lawsuits](https://action.freespeechcoalition.com/age-verification-resources/av-lawsuits/)
- Canada: Bill S-209 (Protecting Young Persons from Exposure to Pornography Act) passed the Senate on 15 April 2026 and is in the House of Commons (stage reported inconsistently: second reading vs committee); would create an offence for commercial providers serving sexually explicit material to minors without age verification by approved arm's-length methods; in force one year after royal assent. Not law. — [openparliament.ca](https://openparliament.ca/bills/45-1/S-209/), [Reclaim The Net](https://reclaimthenet.org/bill/ca-bill-s209-age-verification), [parl.ca third reading](https://www.parl.ca/documentviewer/en/45-1/bill/S-209/third-reading)

### Inferences
- US: a game whose content is suggestive-at-most would very likely sit below "more than one-third sexual material harmful to minors", and its stated purpose is not to appeal to the prurient interest. States differ in threshold wording (some have no one-third test or add other triggers); I did not retrieve the full list, so a state-by-state check is needed before claiming "out of scope" everywhere.
- Australia: scope turns on class 1C/class 2 material; non-explicit suggestive games may still fall under "simulated sexual activity" if cards describe acts; keep card text suggestive and not depict sexual activity.
- Self-declared 18+: fine for out-of-scope services; not an adequate defence if a regulator found the service in scope. Keep the tick as a courtesy/age-appropriateness gate and do not describe it publicly as "age verification".

### Gaps
- No complete list of US state statutes and their thresholds. Australia's social media minimum-age rules not covered. Exact Ofcom/eSafety treatment of chat features not covered. Lawyer review recommended for each market.

## 8. Practical do/don't list and affiliate disclosure rules

### Takeaway
Findings here are mostly derived from the sources above plus secondary disclosure guidance; word lists are inferences, not published rules. Disclosure should be clear, near the link and labelled "Ad"; links `rel="sponsored nofollow"`.

### Cited Findings
- FTC Endorsement Guides (revised 2023): affiliate disclosures must be "clear and conspicuous"; judged by whether an average consumer unfamiliar with affiliate marketing would notice. (Secondary.) — [Tracknow compliance summary](https://tracknow.io/blog/affiliate-marketing-compliance/79), [Awin](https://www.awin.com/us/compliance-and-regulations/the-importance-of-affiliate-disclaimers)
- UK ASA/CAP: both business and affiliate are responsible; where affiliate content is not obviously marketing, an upfront label such as "Ad" is likely required. — [ASA affiliate marketing](https://www.asa.org.uk/resource/affiliate-marketing.html)
- Australia (ACCC) and Canada (Competition Bureau): secondary sources say undisclosed material connections can breach consumer law; specific guidance pages and the cited CAD 15 million figure were not verified. — [Awin AU](https://www.awin.com/au/compliance-and-regulations/the-growing-importance-of-affiliate-disclaimers), [Awin CA](https://www.awin.com/ca/compliance-and-regulations/the-importance-of-affiliate-disclaimers)
- Google SafeSearch reads words on the page and in links (see section 1); Bing Strict also filters text (section 3).

### Inferences
- Prefer in titles, headings, meta descriptions, URLs, alt text and bios: "couples game", "conversation starters for couples", "date night", "connection", "playful", "romantic", "flirty", "adults 18+". Avoid: "sex", "sexy", "kinky", "dirty", "naughty", "spicy/steamy" in indexable text; avoid anatomy terms, "foreplay", "turn-on", "BDSM", "fetish", "toys" in public pages. These are conservative judgement calls given classifier behaviour, not documented triggers.
- Images: abstract objects and shapes only (matches `src/art.tsx` rule); no bodies, lingerie, bedrooms-with-couples-in-bed imagery in OG images, favicons or social avatars; alt text describes the abstract object, never the cards.
- Affiliate labelling: place "Ad" and the commission line next to the link (already in rule 11), `rel="sponsored nofollow noopener"`, no sub-IDs or click rewards. Use the neutral label "Gift ideas" where no commission is earned.
- Stripe/Klaviyo/ads descriptions: "digital couples conversation game, 18+".

### Gaps
- No primary source on trigger words; no ACCC or Competition Bureau page opened; Google `rel="sponsored"` page not opened. Search-engine behaviour could not be tested with Ahrefs/Similarweb.
