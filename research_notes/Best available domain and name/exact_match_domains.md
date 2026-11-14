# Exact-match and keyword domains: availability checks on 14 November 2026

**Read this first. No domain in this file is verified as available.** Every lookup route was blocked from this session on 14 November 2026:

- `rdap.verisign.com`, `pubapi.registry.google`, `rdap.org`: proxy refused (curl `CONNECT tunnel failed, response 403`; WebFetch `ENOTFOUND`).
- Registrar and WHOIS fallbacks `porkbun.com`, `www.namecheap.com`, `who.is`, `www.whois.com`, and DNS-over-HTTPS `dns.google`: same refusal.
- A request to allow the three RDAP hosts (plus `rdap.identitydigital.services`, `rdap.centralnic.com`) through a new environment was shown to the session owner and declined.
- Ahrefs Keywords Explorer returned `HTTP 400 "Insufficient plan"` again (US, 20 keywords), so there are still no primary keyword volumes.

Only web search worked. Web search can sometimes show that a name is in use; it can never show that a name is unregistered. So every candidate below is marked **UNVERIFIED** and none is reported as available.

## Which names were flagged available in the earlier findings, and what do they show now?

### Takeaway
None. The 5 November notes never confirmed any name as available (RDAP was blocked then too); they listed 20 names as "no evidence, verify at a registrar" and three as taken or for sale. Nothing could be re-verified today, so the status of all of them is unchanged: UNVERIFIED.

### Cited Findings
- The earlier notes state "no domain's availability has been confirmed" and that all signals came from web search only — local file `/home/user/tandem/reports/Couples game domain keywords.md` (line 3) and `/home/user/tandem/research_notes/Couples game domain keywords/availability_prices.md` (method note).
- Earlier taken / for-sale evidence (5 Nov 2026, not re-fetched today): couplesgames.com listed at $4,195 — [HugeDomains](https://www.hugedomains.com/domain_profile.cfm?d=couplesgames.com); couplegame.com shows a "This website is for sale!" lander — [couplegame.com](https://couplegame.com/); playtandem.com is a live children's app — [playtandem.com](https://www.playtandem.com/).
- Live competitors on near-variants (5 Nov 2026): couplesquiz.app, couplesquizgame.com, couplestruthdare.com — [couplesquiz.app](https://couplesquiz.app/); [couplesquizgame.com](https://www.couplesquizgame.com/); [couplestruthdare.com](https://couplestruthdare.com/).
- Today's web searches for `couplesgame.com` and `gamesforcouples.com` returned no page on either domain, only App Store listings and publisher articles — [App Store: Couple Game: Relationship Quiz](https://apps.apple.com/us/app/-/id1391022038); [Paired](https://www.paired.com/articles/relationship-building-games-for-couples). This says nothing about registration.

Earlier "no evidence" names, all still UNVERIFIED (check method attempted today: Verisign/Google RDAP, blocked): couplesgame.com, couplegames.app, couplesgame.app, couplegames.in, couplequestions.com, questionsforcouples.com, coupleqs.com, spicyquestions.app, spicyquestions.com, coupletruthordare.com, truthordarecouples.com, couplesquiz.com, ldrgames.com, datenightgame.com, datenightgames.com, tandemgame.app, tandem.game, tandemafterdark.com, twophones.app, playtwo.app.

### Inferences
- Two- and three-word exact-match .coms for phrases with real search demand (couplesgame, gamesforcouples, questionsforcouples, datenightgames, couplesquiz) are very likely registered, usually by resellers, as couplesgames.com and couplegame.com already are. This is an expectation from the two known cases, not a check.

### Gaps
- Registration status, registrar and creation date for every name. Not obtainable from this session.

## Candidate list (101 names) and check results

### Takeaway
101 hyphen-free candidates were generated across the requested patterns and endings. Zero could be checked. The table records the attempted method and the honest result for each; the script under Gaps will verify all of them in about a minute from any machine with open internet.

### Cited Findings
- All RDAP endpoints named in the brief were unreachable on 14 November 2026 (see top of file). No external source exists for the per-name rows below; they are a work list, not findings.
- `.play` should be dropped from the list: IANA lists Charleston Road Registry (Google) as the sponsor, and a registrar page updated 27 April 2026 lists registration as "not yet announced" with pre-registration only — [IANA .play](https://www.iana.org/domains/root/db/play.html); [101domain .play](https://www.101domain.com/play.htm). One aggregator claims it launched in 2016, which conflicts with this — [domaindetails.com](https://domaindetails.com/tlds/play).

Date checked for every row: 14 Nov 2026. Method attempted: registry RDAP (Verisign for .com, Google for .app, rdap.org for others). Result for every row: **UNVERIFIED (lookup blocked)**. Premium flag: unknown for every row.

| # | Pattern | Candidates (all UNVERIFIED) |
|---|---|---|
| 1 | couples game | couplesgame.com, couplesgame.app, couplesgame.games, couplesgame.love, couplesgame.co, couplesgame.io, couplesgame.fun, couplesgame.date |
| 2 | couple games | couplegames.com, couplegames.app, couplegames.co, couplegames.io, couplegames.fun, couplegames.love |
| 3 | couples games (other endings; .com is for sale at $4,195) | couplesgames.app, couplesgames.co, couplesgames.io, couplesgames.fun, couplesgames.love |
| 4 | games for couples | gamesforcouples.com, gamesforcouples.app, gamesforcouples.co, gamesforcouples.io, gamesforcouples.fun, gamesforcouples.love |
| 5 | questions for couples | questionsforcouples.com, questionsforcouples.app, questionsforcouples.co, questionsforcouples.love, couplequestions.com, couplesquestions.com, couplesquestions.app |
| 6 | couples question game | couplesquestiongame.com, couplesquestiongame.app, couplequestiongame.com, couplesquestions.game, couplesquestion.game |
| 7 | date night game(s) | datenightgame.com, datenightgames.com, datenightgame.app, datenightgames.app, datenightgames.co, datenightgames.fun, datenight.game, datenight.games |
| 8 | date night questions | datenightquestions.com, datenightquestions.app, datenightquestions.co, datenightquestions.love |
| 9 | couple(s) quiz | couplequiz.com, couplesquiz.com, couplequiz.app, couplequiz.co, couplequiz.fun, couplesquiz.fun, couplesquiz.love |
| 10 | truth or dare | couplestruthordare.com, coupletruthordare.com, truthordarecouples.com, truthordareforcouples.com, couplestruthordare.app, couplestruthordare.fun |
| 11 | spicy | spicycouplesgame.com, spicycouplesgame.app, spicycouplegame.com, spicycouplesgames.com, spicydatenight.com, spicyquestions.app |
| 12 | two phone | twophonegame.com, twophonegame.app, twophonegames.com, twophones.app, twophones.game, twophone.games |
| 13 | couples night | couplesnightgame.com, couplesnightgame.app, couplesnight.games, couplesnight.game, couplesnight.app |
| 14 | play... | playcouples.com, playcouples.app, playcouplesgames.com, playcouplegames.com, playdatenight.com, playastwo.com |
| 15 | ...online | couplesgameonline.com, couplesgamesonline.com, couplegamesonline.com, couplesonline.games |
| 16 | long distance | ldrgames.com, ldrgames.app, ldrgame.com, ldr.games, longdistancegames.com, longdistancegames.app, longdistancegame.com, longdistance.games |
| 17 | single-word + ending | couples.games, couples.game, couple.games, couples.fun |

Count: 101 names (8+6+5+6+7+5+8+4+7+6+6+6+5+6+4+8+4), none checked.

### Inferences
- Rows 12 (twophonegame), 13 (couplesnightgame), 14 (playastwo, playdatenight) and the three-word .app forms are the patterns most likely to be unregistered, because the phrases have little or no search demand. That is also why they have little keyword value.
- Single-word names on new endings (couples.games, couples.game, ldr.games, datenight.game) are the ones most likely to carry registry premium pricing even if unregistered.

### Gaps
- Availability and premium status of every name. To close this, run the following from a machine with open internet (404 = unregistered at the registry; 200 = taken). It needs `rdap.verisign.com`, `pubapi.registry.google` and `rdap.org` (which redirects to each registry's own RDAP host):

```bash
while read d; do
  case "$d" in
    *.com) u="https://rdap.verisign.com/com/v1/domain/$d" ;;
    *.net) u="https://rdap.verisign.com/net/v1/domain/$d" ;;
    *.app|*.dev) u="https://pubapi.registry.google/rdap/domain/$d" ;;
    *) u="https://rdap.org/domain/$d" ;;
  esac
  echo "$d $(curl -sL -o /dev/null -w '%{http_code}' --max-time 20 "$u")"
  sleep 0.5
done < names.txt
```

- A 404 does not show the price. Registry-reserved and premium names also return 404, so each 404 must still be priced at a registrar (Porkbun or Cloudflare show premium pricing in search) before it counts as "buyable at normal price".
- To let a future session do this itself, allow those three hosts (and the registry RDAP hosts rdap.org redirects to) in the session's network settings.

## Search demand for the matching phrases (US, UK, Canada, Australia)

### Takeaway
No per-country volume exists for any phrase. The only figures are third-party estimates from search snippets: "couples games" about 60,500 a month globally with roughly 30% from the US (about 18,000, a derived estimate), and "date night games" about 3,600 globally with 53% from the US (about 1,900, derived). UK, Canada and Australia are unknown for every phrase.

### Cited Findings
- "couples games": 60,500 monthly searches globally, US about 30% of searches, monthly range 49,500 to 74,000 during 2025 — [RankHero: couples games](https://www.rankhero.com/keywords/couples-games). RankHero describes itself as an Etsy keyword tool, so the source of the figure (Google or Etsy) is unclear.
- "couple game": 60,500 a month, no country split — [RankHero: couple game](https://www.rankhero.com/keywords/couple-game).
- "date night games": 3,600 a month globally, 53% from the US — [RankHero: date night games](https://www.rankhero.com/keywords/date-night-games).
- "date night game": 3,600 a month, CPC $0.66, difficulty 32/100 (RankHero's own scale) — [RankHero: date night game](https://www.rankhero.com/keywords/date-night-game).
- "couples date night": about 1,300 a month globally, US 55% — [RankHero: couples date night](https://www.rankhero.com/keywords/couples-date-night).
- Related question phrases, US: "conversation starters for couples" 9,900; "conversation questions for couples" 1,900; "get to know you questions for couples" 1,600 (CPC $0.11) — [seodata.dev](https://www.seodata.dev/keyword/how-to-start-conversations-with-your-bf); [seodata.dev](https://www.seodata.dev/keyword/how-to-get-to-know-someone-in-a-relationship).
- Amazon US product search (not Google): "couple games" about 1,690 searches a week (July 2026); "couples board games" about 216 a week — [AS Insight: couple games](https://www.asinsight.com/report/US/couple-games); [AS Insight: couples board games](https://www.asinsight.com/report/US/couples-board-games).

Demand ranking of the patterns, using only the figures above (estimates):

| Rank | Phrase | Global est. | US est. | UK / CA / AU | Matching candidates |
|---|---|---|---|---|---|
| 1 | couples games / couple game | ~60,500 | ~18,000 (30%, derived) | unknown | rows 1-3 |
| 2 | date night games / game | ~3,600 | ~1,900 (53%, derived) | unknown | row 7 |
| - | games for couples | unknown | unknown | unknown | row 4 |
| - | questions for couples | unknown (related phrases 1,600-9,900 US) | unknown | unknown | row 5 |
| - | couples quiz, couples truth or dare, long distance (relationship) games, date night questions | unknown | unknown | unknown | rows 8-10, 16 |
| - | couples question game, two phone game, couples night game, spicy couples game | unknown; likely very low | unknown | unknown | rows 6, 11-13 |

### Inferences
- "games for couples" and "questions for couples" are probably large phrases (big publishers such as Paired, StyleCraze and Bustle target them), but no number was found, so they are unranked.
- The phrases with measurable demand are the ones whose .coms are known or expected to be taken; the phrases likely to be free have no measured demand.

### Gaps
- All UK, Canada and Australia volumes, and US volumes for 10 of 12 phrases. Needs Google Keyword Planner, or an Ahrefs plan that includes Keywords Explorer.

## Typical prices and restrictions by ending

### Takeaway
.com (about $11) and .app (about $8 first year, $14 renewal) are the only cheap, stable endings. .games renews near $27, .fun and .love near $30-39, .co near $30, .io near $50, and .game near $309 a year. .date is cheap but has a poor reputation. .play is not open for registration. All prices are from third-party aggregators, not registrar pages.

### Cited Findings
| Ending | First year | Renewal | Source and date |
|---|---|---|---|
| .com | ~$11 (Porkbun) | ~$11 (Porkbun); $15-18 (Namecheap) | [domainoffer.net](https://domainoffer.net/blog/namecheap-vs-godaddy-vs-spaceship-vs-porkbun); [dev.to, Oct 2026](https://dev.to/paullovelace/4-domain-registrars-ranked-by-renewal-price-october-2026-4eo0) |
| .app | $8.20 (Cloudflare) | $14.20 (Cloudflare); $14.93 (Porkbun) | [domainoffer.net, Oct 2026](https://domainoffer.net/tld/app/cloudflare); [costgoat](https://costgoat.com/compare/domains/app) |
| .games | $7.24 promo (Porkbun) | $27.29 (Porkbun) | [domainoffer.net, Jul 2026](https://domainoffer.net/tld/games/porkbun) |
| .game | $308.47 (Porkbun) | $309.47 (Porkbun) | [domainoffer.net, Jul 2026](https://domainoffer.net/tld/game/porkbun) |
| .love | promo varies | $19.00 cheapest; $38.98 (Namecheap); $30.30 (Blacknight) | [domainoffer.net, Jul 2026](https://domainoffer.net/tld/love?page=1); [Blacknight](https://domainoffer.net/tld/love/blacknight) |
| .date | $4.48 (Dynadot) | $5.55 (Dynadot); up to $95.32 at some registrars | [Dynadot](https://www.dynadot.com/domain/date); [domainoffer.net](https://domainoffer.net/tld/date/register) |
| .co | $24 (one registrar) | ~$30-31 (Cloudflare, Porkbun); $41 (one registrar) | [Porkbun .co](https://porkbun.com/about/domain-cost-calculator/co.txt); [domainoffer.net](https://domainoffer.net/tld/app/qualispace) |
| .io | $32.00 (Cloudflare) | $50.00 (Cloudflare) | [domainoffer.net, Oct 2026](https://domainoffer.net/tld/io/cloudflare) |
| .fun | $1.57 promo (Porkbun) | $31.41 (Porkbun) | [domainoffer.net, Oct 2026](https://domainoffer.net/tld/fun/porkbun) |
| .play | not open | not open | [101domain, Apr 2026](https://www.101domain.com/play.htm) |

- .app is on the HSTS preload list, so every .app site must be served over HTTPS — [tld-list.com](https://tld-list.com/blog/the-app-domain-name); [namefi.io](https://namefi.io/r/en/tld/app).
- .date uses the standard URS and UDRP dispute rules; no content restriction was listed — [Gandi .date](https://www.gandi.net/en/domain/tld/date).

### Inferences
- The game already serves HTTPS on one service, so the .app rule costs nothing.
- .game at about $309 a year costs more over three years than a typical reseller .com in this niche would need to be discounted to match; it is poor value.
- A low first-year price on .fun, .games and .love hides a renewal three to twenty times higher.

### Gaps
- No source was found for adult-content rules on .love, .date, .fun, .games or .game; registry acceptable-use policies were not retrieved. Check each registry's policy before buying.
- Whether .date's reputation affects email delivery or ad review was not researched; treat as a known concern without a citation.
- Prices were not read from registrar pages (blocked). Confirm at checkout.
