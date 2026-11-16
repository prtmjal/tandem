# Nod Twice SEO audit

Audit date: 16 November 2026. Scope: nodtwice.com public pages (/, /blog, /blog/how-a-two-phone-couples-game-works, /privacy, /sitemap.xml, /robots.txt). The game at /play is deliberately noindex and is out of scope except for indexation behaviour.

**How this was done, plainly.** The live site (https://www.nodtwice.com) was not reachable from this session, because the network proxy blocks it. Nothing below was measured on the live site. Every "measured" figure comes from a production build of the repo (`npm run build`, then `PORT=3055 node dist-server/index.js`), fetched with curl and rendered in headless Chromium (Playwright, mobile 390x844 and desktop 1280x800). Anything about the live host (Railway settings, DNS, Search Console state, whether pages are indexed) is labelled **assumption**. Ahrefs and Similarweb were unavailable (the Ahrefs plan refused calls; Similarweb failed to connect), so every keyword volume and difficulty here is an estimate, either quoted second-hand from the repo's earlier research reports or my own judgement. Competitor facts come from web search snippets only; I could not open their pages. Nothing here claims Nod Twice ranks for anything: ranking status is unknown until Search Console is checked.

---

## 1. Executive Summary

The site's biggest strength is a clean, fast, correctly built technical base: real 404s, one H1 per page, canonicals, a correct sitemap, tidy redirects, noindex on the game, a render time under 200 ms and almost no layout shift, all with zero third-party requests. The weakness is that there is almost nothing to rank: one blog post of about 400 words and a home page of about 800 words, against competitors with hundreds of pages. The top three priorities are: (1) fix the duplicate-host risk, because with `PUBLIC_URL` unset the old Railway host and the bare domain each declare themselves canonical; (2) publish the keyword pages the earlier research already planned (couples questions, truth or dare, long-distance games, conversation starters) using Level 1-3 cards only; (3) add compression and long-lived caching, then structured data (Organization, WebSite, BreadcrumbList, FAQPage). Overall: technical health is good (roughly 8/10), content and authority are very early (roughly 1/10), so the next quarter should be spent on content and links, not on more technical work.

---

## 2. Keyword Opportunity Table

Volumes are not shown because none could be verified. Only two head terms have a second-hand figure (about 60,500 a month for "couples games" and "couple game", origin uncertain, per `reports/Couples game domain keywords.md`). Difficulty is **my estimate** (Low under 20, Medium 20-40, High over 40), based on who appears in the results (large publishers versus small app blogs). Current ranking for every row is **not ranking / unknown** (no Search Console data seen; the site is days old as far as the repo shows).

| # | Keyword | Est. Difficulty | Opportunity | Current Ranking | Intent | Recommended Content Type |
|---|---|---|---|---|---|---|
| 1 | two phone couples game | Low | High | not ranking / unknown | Navigational/Commercial | Home page plus a /two-phone-couples-game page |
| 2 | couples game no download | Low | High | not ranking / unknown | Commercial | Landing section and FAQ |
| 3 | couples games online (play with partner) | Medium-High | High | not ranking / unknown | Commercial | /couples-games page with playable sample cards |
| 4 | long distance couples games / games for long distance relationships | Medium | High | not ranking / unknown | Commercial | /long-distance-couples-games (Apart mode is a real differentiator) |
| 5 | truth or dare for couples | Medium | High | not ranking / unknown | Informational/Commercial | /truth-or-dare-for-couples (Level 1-3 cards only) |
| 6 | would you rather questions for couples | Medium | High | not ranking / unknown | Informational | Question list plus play button |
| 7 | flirty questions for couples | Medium | High | not ranking / unknown | Informational | Question list (Level 3) |
| 8 | date night questions | Medium | High | not ranking / unknown | Informational | Blog list |
| 9 | questions for couples | High | Medium | not ranking / unknown | Informational | Long-form list; later, once the site has links |
| 10 | conversation starters for couples | Medium-High | Medium | not ranking / unknown | Informational | List (second-hand US figure about 9,900 a month) |
| 11 | get to know you questions for couples | Medium | Medium | not ranking / unknown | Informational | List (about 1,600 a month, second-hand) |
| 13 | questions to ask your partner | High | Medium | not ranking / unknown | Informational | List, linked from the cluster hub |
| 15 | free couples games | Medium | Medium | not ranking / unknown | Commercial | Section on /couples-games |
| 16 | couples quiz "how well do you know your partner" | Medium | Medium | not ranking / unknown | Informational | Quiz-style post that ends in a game CTA |
| 18 | Paired app alternatives | Low-Medium | Medium | not ranking / unknown | Commercial | Honest comparison page |
| 19 | consent-first couples game | Low | Medium | not ranking / unknown | Informational | Own-the-term explainer (small volume, high fit) |
| 21 | spicy questions for couples | Medium | Low (risk) | not ranking / unknown | Informational | Avoid for now: later-level text is barred on public pages and SafeSearch risk is real |
| 22 | couples games for adults | Medium | Low (risk) | not ranking / unknown | Commercial | Avoid "adult" framing in titles; see section 5 |
| 23 | nod twice / nodtwice | Low | High (brand) | not ranking / unknown | Navigational | Home page; confirm via `site:` and Search Console after verification |

---

## 3. On-Page Issues Table

All measured on the local build unless stated.

| Page | Issue | Severity | Recommended Fix |
|---|---|---|---|
| All (single-address mode) | `originOf()` in `server/index.ts` builds canonical, `og:url`, sitemap and robots URLs from the request Host unless `PUBLIC_URL` is set. Tested: a request with Host `tandem-after-dark-production.up.railway.app` returns a canonical pointing at the Railway host, and Host `nodtwice.com` returns a sitemap on the bare domain. Assumption: `PUBLIC_URL` is unset (`docs/launch-checklist.md` lists it as still to do). | Critical | Set `PUBLIC_URL=https://www.nodtwice.com` in Railway now. Then add the host redirect in section 7 (item 1). |
| / | Only one JSON-LD block (`WebApplication`) with no `offers`, no `url`, no image. No Organization or WebSite entity. | Medium | Expand the schema (exact JSON in section 7). |
| / | H1 "The question game you play on two phones." has no "couples". The title carries it (56 characters, good), but the H1 and first 100 words do not. | Medium | Change the sub line to "A free question game for couples. Two phones. One link. No app." Keep the H1 short. |
| / | Meta description 147 characters, slightly under the 150-160 target; fine, but it does not mention "free" or "18+". | Low | Use: "A free question game for couples, played on two phones. Start a game, send your partner the link, and choose together how far tonight goes. No download." (155 characters) |
| / | Page has about 800 words and no internal links to the blog post. The 8 FAQ items are good copy but have no FAQPage markup. | Medium | Add a "From the blog" link row under the FAQ; add FAQPage JSON-LD (see note in section 5 on Google's FAQ rich-result limits). |
| / | `og:image` has no `og:image:alt`, and there is no `twitter:title`/`twitter:description`/`twitter:image` (X falls back to Open Graph, so low impact). `og:title` differs from `<title>` (fine, intentional). Missing `og:site_name` and `og:locale`. | Low | Add `og:image:alt`, `og:site_name` ("Nod Twice"), `og:locale` ("en_US"). |
| /blog | Description 104 characters (target 150-160). Only one post, so the index is thin. No ItemList or CollectionPage markup. | Low | Lengthen to about 155 characters. Becomes useful at 5+ posts. |
| /blog/how-a-two-phone-couples-game-works | Title 55 characters and description 121 characters (ok; could add 30 characters). Body about 400 words. BlogPosting JSON-LD has no `author`, `image` or publisher `url`/`logo`. No BreadcrumbList. The only internal links are /play, /blog and the footer; no link to other posts or the home page body. | Medium | Add `author` (Organization "Nod Twice"), `image` (og.png), breadcrumb, and "related" links once a second post exists. Expand to about 800 words. |
| /blog/how-a-two-phone-couples-game-works | Blog posts in `scripts/blog-lib.mjs` render no images (none exist), so no image search or social variety. `og:image` is the same og.png on every page. | Low | Add one per-post image in `public/img/blog/` with alt text when posts are written. |
| /privacy | Title 29 characters, description 62 characters, no `og:*` or `twitter:*` tags. Page says "not yet a full legal privacy policy; one will be published before launch". Note: CLS 0.02 on mobile and desktop (small, below the 0.1 limit). | Medium | A thin, "interim" privacy page is a trust and ad-network risk, not a ranking one. Publish the full policy; lengthen the description to about 150 characters. |
| /play (noindex, intended) | `robots.txt` says `Disallow: /play` while the page is noindex. Crawlers that obey the disallow never see the noindex, so a URL that gets external links can still show in results as a bare URL. | Medium | Remove `Disallow: /play` from `robots()` in `server/hosts.ts` and rely on the `X-Robots-Tag: noindex` header plus the meta tag already present. |
| All | `/favicon.ico` returns 404. Pages declare an SVG icon only. | Low | Add `<link rel="icon" href="/icon-192.png" sizes="192x192" type="image/png">` to `index.html`, `privacy.html` and `shell()` in `scripts/blog-lib.mjs`. Google asks for a favicon in multiples of 48 px; SVG works but a PNG fallback is safer. |

---

## 4. Content Gap Recommendations

Every page must follow the repo rules: only Level 1-3 card text, suggestive at most, no third-party requests (`tests/site.test.ts`, `tests/landing.test.ts`). Effort: quick win (under a day), moderate (1-3 days), substantial (a week or more).

| Gap | Why it matters | Format | Priority | Effort |
|---|---|---|---|---|
| Questions for couples (hub: "questions for couples", "questions to ask your partner") | Biggest informational cluster; but dominated by BetterHelp, Marriage.com, The Knot, Bustle, Gottman (seen in search results). Slow to win; useful as a link hub. | 60-100 question list in `blog/`, each linked to /play; sections by level | Medium | Substantial |
| Truth or dare for couples (clean version) | Paired reportedly gets traffic from the spicy variant; a "Level 1-3 only" page is the safe side of it. | /truth-or-dare-for-couples, 30 prompts plus a "play it on two phones" button | High | Moderate |
| Long-distance couples games | Apart mode already exists and few competitors offer a real two-phone version. Competitors: Paired, Marriage.com, Bonobology (second-hand). | Guide plus feature explainer | High | Moderate |
| "Couples games no download" and "two phone couples game" | Lowest difficulty, matches the product exactly. | Dedicated landing page or expanded home section and FAQ | High | Quick win |
| Consent-first angle ("how the two nods work") | Nobody else is likely to own this phrase; supports AI-answer citations and press. | Explainer with a diagram image | Medium | Moderate |
| Comparison: Nod Twice vs Paired, Connected Couples, card decks (WNRS) | Captures "alternatives" searches; honest comparison builds trust. | One comparison page; be fair about what each does | Medium | Moderate |
| FAQ expansion (Is it safe? Is it free? Does it save chats? Is it for any gender?) | Answers match People-also-ask style queries. | Expand home FAQ, add markup | Medium | Quick win |
| Founder/about page ("the couple behind Nod Twice") | Trust and E-E-A-T signals for a sensitive-category site; the home page signs "P & J" with no page behind it. | /about with real names if the founders are willing | Medium | Quick win |
| Publishing cadence | One post exists. Competitors publish constantly. | Target 2 posts per month | High | Substantial (ongoing) |

---

## 5. Technical SEO Checklist

| Check | Status | Details |
|---|---|---|
| Page speed (server and weight) | Pass | Home: HTML 11.6 KB, CSS 12.6 KB, fonts about 30 KB (two latin woff2 files), a 1.7 KB script. About 88 KB total transferred in Chromium. Blog and privacy pages 1-5 KB of own bytes plus the shared CSS. Rendered LCP 36-192 ms locally (no network latency, so only a relative signal). |
| Compression | Warning | The server sends no `Content-Encoding` (no compression middleware in `server/index.ts`); gzip size equals raw size. Raw sizes above are what would be sent. Assumption: Railway's edge may not compress either. Add compression (quick win; see section 7). |
| Caching | Warning | HTML `max-age=300`; static assets `max-age=3600` even though `/assets/*` filenames are content-hashed (could be one year, immutable). `/play` is `max-age=0`. |
| Render-blocking resources | Pass | One stylesheet in the head (12.6 KB) and one module script (deferred by nature). Fonts are bundled into the CSS with `@font-face` and are self-hosted. No font preload; low impact. |
| Mobile and viewport | Pass | `width=device-width, initial-scale=1, viewport-fit=cover`; no horizontal scroll at 390 px on any public page. Header "Blog" link is 29-31 px wide (Low). |
| Core Web Vitals signals (lab, local) | Pass | CLS 0.0003-0.02 (limit 0.1); LCP under 200 ms locally; no long tasks observed; zero console errors on all four pages. Field data (CrUX) is not available: **unknown for live**. |
| Title and description lengths | Warning | Home title 56 and description 147: good. Blog index title 54, description 104. Post title 55, description 121. Privacy title 29, description 62. |
| Headings | Pass | Exactly one H1 per page; H2 only below it, no skipped levels (home 8 H2s, post 5 H2s, privacy 8 H2s, blog index none). |
| Canonicals | Pass (conditional) | Every page has one canonical plus a matching `og:url`; trailing-slash variants (`/privacy/`, `/blog/`) return 200 with the slash-free canonical. Correct only if `PUBLIC_URL` or `SITE_URL` is set (see duplicate-host row). |
| robots.txt | Pass with notes | `Allow: /`, `Disallow: /play`, `/go/`, `/stats`, plus a `Sitemap:` line. Note the /play disallow versus noindex conflict above. |
| sitemap.xml | Pass | 4 URLs (/, /blog, the post, /privacy), valid XML, absolute URLs, `lastmod` only on blog URLs. |
| Status codes and redirects | Pass | Unknown paths: real 404 with `noindex` (`/nope`, `/blog/nope`, `/Blog`). `/privacy.html` and `/index.html` give 301 to clean URLs. `/?j=CODE` gives 302 to `/play?j=CODE` (invite links work). `/play` 200 with `X-Robots-Tag: noindex`. |
| HTTPS, www and bare domain | Unknown / Warning | Cannot test live. The code only redirects www to bare in split mode (`SITE_URL` and `PLAY_URL` set), which is not enabled per the launch checklist. `docs/launch-checklist.md` says the bare domain should forward to `https://www.nodtwice.com` at GoDaddy (an unchecked item). Assumption: forwarding may be a 301 or a 302 and may not preserve paths. Test it with `curl -I http://nodtwice.com/blog` and `https://nodtwice.com/blog`. No HSTS header is sent by the app. |
| Duplicate host: `tandem-after-dark-production.up.railway.app` | Fail (assumption) | Per the code, the Railway host serves the full site and, with `PUBLIC_URL` unset, a self-referencing canonical (tested locally with a spoofed Host header). If Google has found it, it can index it as a duplicate. What to do: (1) set `PUBLIC_URL=https://www.nodtwice.com` so every host canonicalises to www; (2) add a 301 for any host not equal to `www.nodtwice.com` (section 7); (3) in Search Console, check the `site:tandem-after-dark-production.up.railway.app` listing and, if indexed, request removal after the 301 is live. |
| Structured data present | Warning | Home: `WebApplication` (incomplete). Post: `BlogPosting` with publisher `Organization` (no logo, no author, no image). Blog index and privacy: none. |
| Structured data opportunities | Warning | Add `Organization` and `WebSite` on home; `BreadcrumbList` on posts; complete `BlogPosting`; `FAQPage` on home. Honesty note: since 2023 Google shows FAQ rich results only for well-known government and health sites, so FAQPage will not produce a rich result here; it is cheap and still helps other parsers. `WebApplication` rich results need `offers` and ratings; do not invent ratings. |
| Broken links | Pass | All internal links on the four pages resolve (200/302 expected; checked `/`, `/blog`, post, `/privacy`, `/play`). External links: none. |
| Indexation control | Pass | `/play`: `X-Robots-Tag: noindex` header plus meta robots. `/go/` and `/stats`: disallowed. 404 pages: noindex. |
| hreflang / language | Pass | `lang="en"` on every page; English only, so hreflang is not needed. Do not add `en-US`/`en-GB` variants until you have separate content. Markets (US, UK, CA, AU) can only be targeted through content and links, not markup. |
| Adult-content signals | Warning | No `rating` meta (`adult`/`RTA`) and no SafeSearch-triggering words on the public pages (all copy is Level 1-3, "for two adults, 18+"). Recommendation: do not add an RTA/adult rating label (it would push the site into adult-filtered results and could hurt ad and affiliate approvals); keep titles free of "spicy", "naughty", "sex" and "adult". Terms to avoid in meta text: "spicy", "steamy", "dirty". The footer "For two adults, 18+" and a clear age line on /privacy are sufficient. |
| Analytics / Search Console | Unknown | No analytics script on the site by design (privacy rules). Search Console verification is not visible in the repo (no google-site-verification tag); assumption: not yet set up. |

---

## 6. Competitor Comparison Summary

Competitor facts are from web search results and the repo's earlier research (`reports/Couples game domain keywords.md`, `What couples actually play.md`), not from Ahrefs. Where a figure is second-hand I say so. "Competitor A" is Paired; "Competitor B" is Connected Couples (connectedcouples.app). I could not open either site, so on-page details are limited to what search results showed.

| Dimension | Nod Twice | Competitor A: Paired | Competitor B: Connected Couples | Winner |
|---|---|---|---|---|
| Ranking keyword count | Unknown; likely near zero (new site, 4 pages) | Large; a prior Ahrefs public-page snapshot (July 2025, second-hand) put it at about 119K organic visits a month | Unknown; at least a `/couples-games-online` page surfaced for the query "couples games online free two phones" | Paired |
| Content depth | 1 post (about 400 words), home about 800 words | Many articles, including "best online games for couples" and "games for long distance couples" (seen in results) | A page per game format, free browser games (from search listing) | Paired |
| Publishing frequency | One post in total (14 Nov 2026) | Ongoing editorial program (assumption, not verified) | Unknown | Paired |
| Backlink signals | None known; new domain, no Ahrefs data | Strong (appears in publisher listicles; app of 1M+ monthly users per earlier notes) | Unknown | Paired |
| Technical score (my judgement of the code) | 8/10: clean, fast, real 404s; no compression, no rich schema | Unknown (not tested) | Unknown (not tested) | Not comparable |
| SERP features | None observed; FAQ rich results are unlikely | App store listings often take about half the results for app-intent queries (second-hand note) | Appears in a listicle-heavy SERP | Paired |
| Product fit for "two phones, no download" | Real-time two-phone rooms, no account | App install needed | Free browser games, but per the search summary they use one shared screen | Nod Twice |
| Unique angle | Consent-first, both must say yes; Apart mode | Answers revealed after both answer | Free simple games | Nod Twice (differentiated, not yet visible in search) |

Publishers ranking for "questions for couples" in search results this session: Bustle, Gottman Institute, Marriage.com, BetterHelp, Mindbodygreen, eharmony. Verywell Mind did not appear in my results, and the Psychology Today hit was a short "3 questions" post. Takeaway: general question lists are won by large publishers with many links, so the early targets should be product-specific and long-tail terms.

---

## 7. Prioritized Action Plan

**Legend:** [DEV] = a developer can do it in the code in under a day. [FOUNDER] = outside the code.

### Quick wins (this week)

1. **[FOUNDER, 10 min] Set `PUBLIC_URL=https://www.nodtwice.com` in Railway Variables.**
   Impact: High (removes self-canonical on the Railway host and the bare domain). Effort: minutes. Dependency: none.

2. **[DEV] Redirect every non-canonical host with a 301.**
   File: `server/index.ts`, in the `app.get('*')` handler (and a small helper in `server/hosts.ts`). When `PUBLIC_URL` is set and `req.get('host')` differs from its host (and is not localhost), `res.redirect(301, PUBLIC_URL + req.originalUrl)`. Skip `/healthz` so Railway's health check still works, and skip `/socket.io`, `/api/` and `/go/`. Add a test in `tests/` with a fake Host header.
   Impact: High. Effort: about 2 hours. Dependency: item 1.

3. **[FOUNDER] Set up Google Search Console (Domain property) and Bing Webmaster Tools; submit `https://www.nodtwice.com/sitemap.xml`; check URL Inspection for `/`; check the old Railway host's index status.**
   Impact: High (the only real ranking data). Effort: 1 hour. Dependency: DNS access at GoDaddy. Verify that bare `nodtwice.com` forwards with a permanent (301) redirect, preserving the path.

4. **[DEV] Remove `Disallow: /play` from `robots()` in `server/hosts.ts`.**
   Replace the line `User-agent: *\nAllow: /\nDisallow: /play\n...` so it keeps `Disallow: /go/` and `Disallow: /stats` only. The noindex header and meta already protect the game. Update `tests/` that assert the old robots text, if any.
   Impact: Low-Medium. Effort: 30 min.

5. **[DEV] Compression and cache headers.** Add the `compression` package in `server/index.ts` before `express.static`; for `/assets/`, serve `Cache-Control: public, max-age=31536000, immutable` (hashed filenames), keeping 1 hour for other files. Do not compress the socket.io upgrade (the middleware leaves it alone).
   Impact: Medium (about 70% smaller HTML/CSS on the wire; assumption that Railway does not already compress). Effort: 1-2 hours.

6. **[DEV] Home page copy and tags in `index.html`.**
   - Sub line: `A free question game for couples. Two phones. One link. No app.`
   - Description: `A free question game for couples, played on two phones. Start a game, send your partner the link, and choose together how far tonight goes. No download.`
   - Add `<meta property="og:image:alt" content="Nod Twice: a question game for couples on two phones">`, `<meta property="og:site_name" content="Nod Twice">`, `<meta property="og:locale" content="en_US">`.
   - Add a "From the blog" link under the FAQ pointing to `/blog/how-a-two-phone-couples-game-works`.
   Impact: Medium. Effort: 1 hour. (Check `tests/landing.test.ts` still passes.)

7. **[DEV] Structured data.** In `index.html` replace the single JSON-LD with an `@graph`:
   - `Organization` (`name: "Nod Twice"`, `url: "__SITE__/"`, `logo: "__SITE__/icon-512.png"`),
   - `WebSite` (`name`, `url`),
   - `WebApplication` with `url: "__SITE__/play"`, `browserRequirements: "Requires JavaScript"`, `offers: {"@type":"Offer","price":"0","priceCurrency":"USD"}` (true today: free in early access; update when the Couple Pass changes it) and no rating,
   - `FAQPage` mirroring the 8 existing questions word for word.
   In `scripts/blog-lib.mjs` `postPage()`: add `author: {'@type':'Organization', name:'Nod Twice'}`, `image: '__SITE__/og.png'`, publisher `url`/`logo`, and a second JSON-LD `BreadcrumbList` (Home > Blog > post title). Note `__SITE__` is substituted at serve time, so the placeholders work.
   Impact: Medium (clearer entity for search and AI answers; no rich result promised). Effort: 3 hours.

8. **[DEV] Icon fallback and privacy tags.** Add `<link rel="icon" href="/icon-192.png" sizes="192x192" type="image/png">` in `index.html`, `privacy.html`, `scripts/blog-lib.mjs`. Add description "What Nod Twice keeps, where, and for how long: your picks, your progress, and what the server forgets when the night ends." (about 150 characters) to `privacy.html`.
   Impact: Low. Effort: 30 min.


### Strategic investments (this quarter)

10. **[DEV + FOUNDER] Build the keyword cluster pages (target 6 pages by end of quarter).** Place Markdown in `blog/` (or add `src`-free static pages), one per target from the section 2 top rows:
    - `blog/couples-games-no-download.md`, title `Couples Games With No Download: Play on Two Phones` (50 characters)
    - `blog/long-distance-couples-games.md`
    - `blog/truth-or-dare-for-couples.md`
    - `blog/would-you-rather-questions-for-couples.md`
    - `blog/flirty-questions-for-couples.md`
    - `blog/date-night-questions.md`
    Each: 800-1,500 words, 15-30 real Level 1-3 cards, an in-text link to `/play`, links to two sibling posts, a description of 150-160 characters. The build validates titles of 10-70 characters and descriptions of 50-170 characters. Impact: High (this is the only way to gain rankable pages). Effort: about 1-2 days each for writing and review. Dependency: items 1-4. The content rule (Level 1-3 only, suggestive at most) applies and is enforced by `tests/site.test.ts`.

11. **[FOUNDER] Backlinks and outreach.** Targets: relationship and date-night bloggers, long-distance communities, "best online games for couples" listicle authors (Paired, Plarium and similar pages appeared in results), Product Hunt, Reddit's relationship-games communities (follow each community's self-promotion rules), podcasts. Offer a free, no-account tool and the privacy angle. Impact: High but slow. Effort: ongoing, about 3 hours a week.

12. **[DEV] Add `/about` page** (same template as `privacy.html`; route in `server/index.ts` next to `/privacy`; sitemap row in `server/hosts.ts`). Content: who built it, why, how consent works. Impact: Medium (trust, and a place for `sameAs`/`founder`). Effort: 3 hours. Dependency: founders decide how much to share.


14. **[FOUNDER] Full privacy policy and terms**, then replace the "not yet a full legal policy" line in `privacy.html`. Impact: Medium (trust and ad/affiliate approvals). Effort: legal review.


16. **[DEV, optional] Split hosts (`SITE_URL`, `PLAY_URL` with `play.nodtwice.com`)** as already planned in `docs/launch-checklist.md`. It cleanly separates the indexable site from the game and enables the www/bare handling already coded in `server/hosts.ts`. Dependency: a Railway plan with two custom domains. Impact: Medium-High for hygiene. Effort: under a day plus DNS.


---

## 8. Follow-up offers

- Implement the developer items 2 to 8 and 13 in one change, with tests (about a day).
- Draft the first three keyword posts using only real Level 1-3 cards, then run `tests/site.test.ts`.
- Write the outreach email templates and a target list for item 11.
- Re-run this audit against the live site, with real Search Console and CrUX data, once the proxy allows access or exports are shared.
