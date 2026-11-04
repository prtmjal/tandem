# Design Tandem to deepen, glow and step back

Tandem After Dark's core design choices hold up against the evidence, and most of the work left is precision. **Signalling intensity through depth and saturation rather than redness matches the colour-emotion research.** The "red is sexy" effect is small and replicates poorly, while saturation reliably raises arousal. **A tactile card with two equal buttons beats chat or audio as the default format,** because the phone's job is to show one prompt and then get out of the way. The palette needs three concrete fixes. First, Rose, Coral and Plum are too close for colour-blind players, and at Level 8 they are too close for everyone, so partner identity needs a glyph and a forced lightness gap. Second, add a fifth vibe, Iris (periwinkle-indigo), to give more pairs that colour-blind players can tell apart. Third, Coral should lean pinker and Lagoon should stay blue-teal. The landing page should be one warm, lightly grainy, type-led page with a playable three-card demo, one "Start a game" button and consent as the headline feature, not the fine print. Sound should be off until a player opts in, synthesized in Web Audio for UI cues, with music commissioned and played from one phone only. Haptics are an Android-only enhancement made of short on/off pulses, with a visual pulse on iPhone, because iOS has no Vibration API. Performance budgets have to assume a mixed iPhone-Android couple, an Instagram or WhatsApp in-app browser on first open, and a low-end Android phone in India or Southeast Asia. Every hex value below was computed and contrast-checked for this report. Each spec is marked where it rests on evidence and where it is a design judgement.

## Deeper-not-redder survives the evidence, but four vibes collide for colour-blind players

### What the research says about colour and desire

The strongest finding in colour-emotion research is that **brightness and saturation move emotion more than hue does**. Valdez and Mehrabian's Pleasure-Arousal-Dominance study reported arousal rising with saturation (about .60) and falling with brightness (about −.31). Pleasure rose mainly with brightness (about .69) ([PubMed 7996122](https://pubmed.ncbi.nlm.nih.gov/7996122/)). A physiological replication with skin conductance found that saturated, bright colours produce the strongest arousal. Hue still contributed, with arousal increasing from blue to red ([Wilms & Oberfeld 2018](https://www.staff.uni-mainz.de/oberfeld/downloads/Wilms-Oberfeld2018_Article_ColorAndEmotionEffectsOfHueSat.pdf)). Meanwhile the famous red-attractiveness effect has shrunk under scrutiny. The 2018 meta-analysis found only d = 0.13 for women rating men, with evidence of upward bias ([metadat documentation](https://search.r-project.org/CRAN/refmans/metadat/html/dat.lehmann2018.html)). A nine-lab crowdsourced replication found no effect at all ([Collabra via DOAJ](https://doaj.org/article/98cc5cffe7a44dcdb5247cf72f749160)), and three further studies with 830 men also came up null ([VU Amsterdam](https://research.vu.nl/en/publications/revisiting-the-red-effect-on-attractiveness-and-sexual-receptivit/)).

The practical reading is that **the app can make Level 8 feel charged by raising chroma and lowering lightness, without leaning on red**. One tension needs handling. Lower brightness also lowers pleasure and raises felt dominance, so a uniformly dark, saturated top level can read as heavy rather than warm. The fix is to keep a luminous highlight in the card art at Levels 7–8. Plum (red-purple) and Lagoon (blue-green) sit in Valdez and Mehrabian's most-pleasant hue families. Coral sits near the orange-yellow end they rated least pleasant, which is a weak but real reason to pull Coral toward pink. The dim late-night mode is justified by comfort and perceived intimacy. It should never be marketed as making people open up, because a 2017 experiment found **no effect of lighting on self-disclosure** ([Frontiers / PMC5322203](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5322203/)).

### Cultural meanings for a worldwide launch

Colour-emotion associations are highly similar across 30 nations, with a mean similarity of about r = .88 ([Jonauskaite et al. 2020, EPFL](https://infoscience.epfl.ch/record/280269?ln=en)). That leaves a handful of local flashpoints rather than a need for per-market palettes. The existing bans are correct and should be extended slightly.

The saffron ban should cover **saffron-to-green gradients**, because saffron is Hinduism's most sacred colour and is politically charged in India ([Saffron, Wikipedia mirror](https://wikipedia.com/wiki/Bhagwa)). The ban on pure white is useful beyond looks. White is a mourning colour in China and in Indian widowhood traditions ([Sherwin-Williams](https://www.sherwin-williams.com/architects-specifiers-designers/education/sw-article-pro-coloracrosscult)), so warm, vibe-tinted off-whites avoid a clinical or funereal reading. Lagoon must stay clearly blue-teal (OKLCH hue 210° or higher) and never drift green. Green carries strong Islamic associations ([Sherwin-Williams](https://www.sherwin-williams.com/architects-specifiers-designers/inspiration/stir/sw-art-stir-color-religion)) and is also the colour most confused in red-green colour blindness. Purple is a mourning colour in Thailand and some other markets ([Willed](https://www.willed.com.au/guides/cultural-and-traditional-mourning-colours-around-the-world)). At the warm, pink-leaning depth Plum uses, that is a low risk. Red's positive wedding meaning in China and India ([Color symbolism](https://EN.wikipedia.com/wiki/Color_symbolism)) makes rose and wine accents safe there. Even so, the app should use rose and wine rather than pure red, because pure red also means error and danger in a UI.

### Trends and competitors point to calm, warm and teal

Forecasts have moved from neon "dopamine" colour to grounded calm. Pantone chose Mocha Mousse for 2025 ([Artnet](https://news.artnet.com/art-world/pantone-2025-color-of-the-year-mocha-mousse-2582184)) and its first-ever white, Cloud Dancer, for 2026 ([NHPR](https://www.nhpr.org/2025-12-04/you-read-that-white-pantones-2026-color-of-the-year-is-cloud-dancer)). WGSN and Coloro named Luminous Blue for 2027, with Pop Pink among the S/S 27 key colours ([WGSN](https://www.wgsn.com/en/wgsn/press/press-releases/wgsn-and-coloro-reveal-colour-year-2027-luminous-blue-and-s-s-27-key)). Rose and Lagoon are on-trend, and a cocoa-tinted off-white is a good light-mode base.

In the couples category, purple already belongs to Paired, whose 2024 rebrand doubled down on "a more vibrant version of the signature purple" ([Paired](https://www.paired.com/press/paired-rebrand-announcement)). No couples or sexual-wellness brand found in the research owns teal. That makes Lagoon, and a two-vibe "blend" as the brand mark, the distinctive move. Phone users mostly run dark mode, with aggregator estimates of roughly 65% to 82% ([Earthweb](https://earthweb.com/how-many-people-use-dark-mode/); [ZipDo](https://zipdo.co/dark-mode-usage-statistics/)). The methods behind those numbers are weak, but the app is played at night. The default should therefore follow `prefers-color-scheme` and fall back to dark.

### Accessibility is where the current palette breaks

Roughly 8% of men and 0.4–0.5% of women have a colour-vision deficiency, mostly red-green ([UK HSE](https://www.hse.gov.uk/PUBNS/ms7.pdf)). That means **about one mixed-sex couple in twelve includes a colour-blind player**. To test the palette, I simulated protanopia and deuteranopia (Viénot-Brettel-Mollon matrices) on candidate vibe colours set at equal lightness. I then measured the distance between colours in OKLab, scaled ×100. The results confirm the concern in the research notes and add one surprise.

- Rose and Plum are only **4 units apart even for typical vision**.
- Rose and Coral are 6 units apart.
- Under deuteranopia, Plum and Lagoon also collapse to 4 units.
- At Level 8 in dark mode, Rose, Coral and Plum card faces are 5 units apart for everyone. Deepening compresses hue differences, as predicted.

Colour alone therefore cannot carry partner identity. WCAG 2.2 AA remains the enforceable standard. APCA was pulled from the WCAG 3 draft in 2023 and is still absent as of April 2026 ([Adrian Roselli](https://adrianroselli.com/2026/04/wcag3-contrast-as-of-april-2026.html); [W3C](https://www.w3.org/WAI/news/2026-03-03/wcag3)). APCA can serve as an internal check for dark modes, but no compliance claim can rest on it. Dark surfaces should be tinted near-blacks rather than #000000, with off-white text rather than pure white, to avoid halation ([Atmos](https://atmos.style/blog/dark-mode-ui-best-practices); [A11y with Diana](https://a11ywithdiana.substack.com/p/and)).

### Palette spec: what to change

| Current | Change | Reason |
|---|---|---|
| Four vibes: Rose, Coral, Plum, Lagoon | **Add Iris** (OKLCH hue 280°, periwinkle to indigo). Keep the others. | Gives more pairs that colour-blind players can separate and a gender-neutral option. It avoids amber or gold, which sits near saffron. |
| Coral hue unspecified | Base hue **38°**, drifting **−2° per level** to 24° at Level 8 | Deep Coral becomes terracotta-rose, not brown or orange, and stays pinker per Valdez and Mehrabian. |
| Lagoon hue unspecified | Lock at **218°**, chroma ×0.8 | Clearly blue-teal, never "Islamic green" or red-green confusable. Lower chroma also keeps it inside the sRGB gamut. |
| Partner identity by hue | **Hue + glyph + lightness gap.** Your chip is filled and light. Your partner's chip is an outlined ring, deeper, with their glyph and initial. | Measured colour distances are too small for colour alone. |
| Card face depth across 8 levels in every mode | Light mode **jumps to a deep face at Level 5**. Levels 1–4 are pale tints with dark ink, and Levels 5–8 are deep with light ink. | Removes the mid-lightness band where neither ink reaches 4.5:1. My first, linear ramp bottomed out at 4.0:1. The jump also makes "the night deepens" visible. |
| Error and stop states | **No red anywhere for status.** The Pause/Stop control uses neutral ink with an icon and label. Errors use neutral ink, an icon and text. | In a red-family palette, red reads as heat. "Stop" must never look like an escalation cue. |
| Top levels | Card art keeps a highlight at OKLCH lightness 0.70 or above at Levels 7–8 | Offsets the drop in pleasure from low brightness. |

The tokens below were generated in OKLCH and converted to sRGB. Contrast was measured with the WCAG 2.x formula. **Every card face clears 5.8:1 with its chosen ink, and every surface clears 12:1 with body text.** That is above AA for both the large prompt text (3:1 required) and body text (4.5:1 required). Lagoon's deepest steps clip slightly at the sRGB gamut edge, so ship the hex values rather than recomputing from OKLCH.

| Token | Light | Dark | Late-night |
|---|---|---|---|
| `--bg` | `#FAF2EC` | `#130D12` | `#0A0609` |
| `--surface-raised` (buttons, sheets) | `#FEF9F6` | `#1E161D` | `#120C11` |
| `--ink` (body and prompt text) | `#281C1B` (14.9:1) | `#F2EEE9` (16.6:1) | `#D6D0C9` (13.2:1) |
| `--ink-muted` (captions) | `#695959` (6.0:1) | `#B2A9A2` (8.3:1) | `#999089` (6.4:1) |
| `--ink-on-deep` (light ink on Level 5–8 faces) | `#F2EEE9` | `#F2EEE9` | `#D6D0C9` |

The card face for each vibe and level comes from this table. Light mode uses `--ink` on Levels 1–4 and `--ink-on-deep` on Levels 5–8. Dark and late-night modes always use the light ink.

| Mode / vibe | L1 | L2 | L3 | L4 | L5 | L6 | L7 | L8 | Min contrast |
|---|---|---|---|---|---|---|---|---|---|
| Light · Rose | #FEDFE5 | #F9CED6 | #F4BDC8 | #EEACBA | #884053 | #7F3148 | #76213C | #6C0C31 | 6.3 |
| Light · Coral | #FEE1D7 | #FAD0C4 | #F5BFB2 | #F0AEA1 | #8A4338 | #81332C | #782320 | #6F0D15 | 6.2 |
| Light · Plum | #F8E0F1 | #F1CFE8 | #E9BEDF | #E2AED6 | #7C4371 | #733567 | #6A265E | #601555 | 6.3 |
| Light · Lagoon | #D4EDF4 | #BEE2ED | #A8D7E5 | #92CCDD | #106579 | #005B70 | #005067 | #00455E | 5.8 |
| Light · Iris | #E3E6FD | #D4D8F9 | #C6CAF4 | #B7BCEF | #51548C | #464885 | #3B3B7D | #312F75 | 6.1 |
| Dark · Rose | #533239 | #522C35 | #4F2731 | #4D212D | #4B1B29 | #491525 | #460E21 | #44061D | 9.7 |
| Dark · Coral | #54342A | #522E24 | #50291F | #4F231B | #4C1D16 | #4A1612 | #480F0E | #45070B | 9.6 |
| Dark · Plum | #4E3348 | #4B2E45 | #492842 | #46233F | #441E3C | #41183A | #3E1237 | #3B0B34 | 9.6 |
| Dark · Lagoon | #23424B | #1B3F49 | #113B46 | #043844 | #003441 | #00313F | #002D3C | #002A3A | 9.3 |
| Dark · Iris | #383B55 | #343653 | #303252 | #2C2D50 | #28294E | #24254D | #20204B | #1D1B49 | 9.4 |
| Late · Rose | #372428 | #351F24 | #321B20 | #2F171D | #2D1219 | #2A0E15 | #270912 | #24050E | 9.5 |
| Late · Coral | #37251F | #35211B | #321C17 | #301813 | #2D130F | #2B0E0B | #280A08 | #250506 | 9.5 |
| Late · Plum | #342530 | #31202D | #2E1C2A | #2B1827 | #281324 | #250F21 | #220A1E | #1F061B | 9.4 |
| Late · Lagoon | #1C2D32 | #172A2F | #11262C | #0A232A | #042027 | #001C24 | #001921 | #00161E | 9.3 |
| Late · Iris | #272937 | #232535 | #202133 | #1C1D30 | #18192E | #15162C | #111229 | #0E0E27 | 9.4 |

In dark and late-night modes, the lightness steps between levels are deliberately small (OKLCH L falls from 0.36 to 0.255 in dark mode). Depth is carried mostly by chroma, which rises from 0.050 to 0.092 and is scaled ×0.6 in late-night mode to reduce glow in a dark room. Because colour alone barely separates adjacent levels, the level must also be shown in text and in the density of the card art.

Partner chips use two fixed lightness levels in OKLCH: "you" and "partner". The chip colour does not deepen with level, so the two players never converge at Level 8.

| Vibe | Light: you / partner | Dark: you / partner | Late: you / partner |
|---|---|---|---|
| Rose | #9D3D59 / #BF7284 | #F7ACBC / #C86B82 | #CD9CA6 / #9E6975 |
| Coral | #9F4325 / #C0765F | #F8B09A / #C97055 | #CD9E90 / #9F6C5C |
| Plum | #8F4280 / #B274A4 | #E9AEDB / #B86FA9 | #C39DBA / #956B8B |
| Lagoon | #007394 / #329AB4 | #7CD3EB / #009DBC | #7FB5C4 / #458596 |
| Iris | #5658AB / #8085C8 | #B8BEFE / #7E83D3 | #A3A7D1 / #7276A3 |

All chips clear the 3:1 non-text contrast minimum against `--bg` (light-mode partner chips sit at 3.0–3.2:1). Across every vibe pair, including both partners choosing the same vibe and both colour-blind simulations, the smallest you-versus-partner distance is **11 units in dark and late-night modes but only 6 in light mode**. That is why the glyph is mandatory rather than decorative. Assign one glyph per vibe: Rose ●, Coral ◆, Plum ▲, Lagoon ■, Iris ✦. Render it inside each chip with the player's initial. When both players pick the same vibe, keep it; the you/partner lightness split and the filled-versus-ring styling separate them. Shared moments, such as "both said yes" or the end-of-night card, use a two-stop gradient from your vibe to theirs at the current level's depth. That gradient is the "blend" brand mark. Before shipping, re-run this check with the production art behind text, using [Color Oracle](https://www.colororacle.org/usage.html) and a greyscale pass.

## One tactile card, one link, one button: the landing page spec

### Visual style for 2026

The 2026 design mood has turned against polished, AI-smooth surfaces. Canva's 2026 report, "Imperfect by Design", logged a **527% jump in searches for "lo-fi design"** and a 90% rise in collage-style elements ([BusinessWire](https://www.businesswire.com/news/home/20251210696597/en); [LBB Online](https://lbbonline.com/news/Canva-Predicts-2026-Will-Be-Imperfect-by-Design)). Adobe's 2026 trends lean organic and human ([Adobe Express](https://www.adobe.com/br/express/learn/blog/design-trends-2026)). Agencies describe subtle grain overlays and extreme type-scale contrast as signature moves ([Fireart Studio](https://fireart.studio/blog/the-best-web-design-trends/); [Hostinger](https://www.hostinger.com/my/tutorials/web-design-trends)). They also warn that neon tactile brutalism can hurt readability ([Converge.ai](https://enter.converge.ai/page/en-US/blog/web-design-trends)). Gen Z is now embracing earnest, slightly "cringe" sincerity ([YPulse](https://www.ypulse.com/newsfeed/2026/01/05/gen-z-spent-years-mocking-millennial-cringe-now-theyre-fully-embracing-it/)). Partiful won by being the "least cringe" option, using film-camera photos of real parties ([Ordinal](https://www.tryordinal.com/blog/deep-dive-how-partiful-approaches-their-social-media-strategy)). Pop-ups are the single most frustrating website feature for 24% of Gen Z users ([Kobe Digital](https://kobedigital.com/websites-for-all-ages/)).

The style direction follows. Set one oversized Bricolage Grotesque headline against small Figtree captions, on a warm vibe-tinted off-white or plum-black with a 3–5% grain. Make the cards themselves the hero, with doodle or sticker accents used sparingly. Avoid these looks, which date quickly or read as generic:

- glassmorphism
- purple-to-pink dating-app gradients
- stock couple photos
- 3D blob illustrations
- full Y2K chrome
- beige "quiet luxury" minimalism

None of these style choices has evidence that it changes conversion. They are brand-perception bets, so spend testing effort on copy and the demo rather than on texture.

### Conversion evidence and targets

Unbounce's 2024 benchmark puts the **median landing-page conversion rate at 6.6% across 41,000+ pages** ([Search Engine Land](https://searchengineland.com/how-does-your-landing-page-performance-compare-453224)). Copy at a 5th–7th grade reading level converted at 11.1%, against 5.3% for professional-level prose. Word count correlated −18.6% with conversion. These figures are correlational ([Bill Hartzer summary](https://www.billhartzer.com/pay-per-click/shocking-decline-in-attention-spans-unbounces-2024-report-reveals-critical-mistakes-that-are-hurting-your-conversion-rates/)).

Interactive demos outperform video in vendor data. Navattic reported +450% signups in a 50/50 test ([Mutiny](https://www.mutinyhq.com/playbooks/navattic-interactive-demo)), and Wistia data cited by Userpilot shows interactive demos converting 12% better ([Userpilot](https://userpilot.com/blog/interactive-product-demo/)). These are vendor sources and single tests, so treat them as direction, not proof. Sticky mobile CTAs ranged from −2% to +21% across ecommerce tests ([FixMyStore](https://fixmystore.com/community/pdp-ab-test-sticky-add-to-cart-on-mobile-worth-doing); [Clean Commit](https://cleancommit.io/ab-tests/mobile-bottom-sticky-add-to-cart-button/)). Removing social proof once lifted conversion 20% ([CXL](https://cxl.com/blog/is-social-proof-really-that-important/?amp)), so with no users yet, an honest founder note beats invented testimonials.

The realistic hypothesis is that 10–20% of hero viewers start a game. Measure **"partner joined"** as the true conversion, because one person starting a room is only half a couple.

### Section-by-section structure for `/`

The page is mobile-first at a 390×844 baseline and should total **under about 300 words of body copy**, in line with Unbounce's short-copy guidance ([Unbounce](https://unbounce.com/industry/ecommerce-copy/)). Write it at a 5th–7th grade reading level.

| # | Section | Content and layout | Copy direction and examples |
|---|---|---|---|
| 1 | **Hero** (first viewport) | A headline of 8 words or fewer, one subline, one primary button and one microline. The visual is two CSS/SVG phone outlines showing the same Level 1 card, so the LCP element is text, not an image. No nav beyond a logo and a "See the levels" anchor. | Headline options: "The question game you play on two phones." / "Date night, minus the small talk." / "Nothing unlocks until you both say yes." / "From 'how was your day' to 'tell me more.'" Subline: "Two phones. One link. No app." Button: **"Start a game"** (add "— free" only if true). Microline: "No download · No account to try · Your partner joins by link." |
| 2 | **Try a card** | Three to five real Level 1–2 cards that flip in place, with Pass and Next buttons that behave exactly like the game. No signup. End with an inline "Play this with them →" button that starts a room. | Label: "Try one. Out loud." Use real prompts from the deck, chosen for warmth and humour. |
| 3 | **How it works** (3 steps) | Step 1: start a game. Step 2: send the link. Step 3: you both choose each level. Show the consent mechanics here as the selling point. | "Nothing unlocks until you both tap yes." / "Pass anything. No explaining. They never see who passed." / "Your picks stay on your phone. They only see what you both chose." |
| 4 | **The 8 levels** | A vertical ladder from Sparks to Midnight, coloured with the palette ramp. Show full sample cards only for Levels 1–3. Levels 4–8 are blurred or locked tiles with mood words only. | Locked tile label: "Unlocks when you both say yes." Never show later-level card text, here or in ads. |
| 5 | **Privacy, in plain words** | Four or five short, verifiable claims with a link to a one-screen summary. | Use only claims the architecture backs, for example: "No account needed to play." / "Your private votes never reach their phone." / "Games are gone when the night ends." / "No ad trackers." Never write "100% private", "military-grade" or "anonymous" unless technically true. |
| 6 | **Who made this** | A founder note with a first name, a photo or doodle, and two sentences on why. Add an expert line only if a real therapist or sex educator reviewed the deck. Show usage counts only once they are real. | "I built this because we kept running out of things to ask." Never use invented quotes or placeholder logos. |
| 7 | **FAQ** (5–7 questions) | An accordion. Keep the markup semantic even though Google no longer shows FAQ rich results for ordinary sites ([Google Search Central](https://developers.google.com/search/blog/2023/08/howto-faq-changes)). | "Is it free?" / "Do we both need to download anything?" / "What's in the later levels?" (answer: "Flirtier and more personal, never graphic. You both choose.") / "Can we stop anytime?" / "What do you store?" / "Does it work long-distance?" / "Which languages?" |
| 8 | **Final CTA and footer** | Repeat the button. Footer links: privacy, terms, accessibility statement, contact. | "Tonight's a good night to ask." |
| Sticky | **Bottom bar** | Appears only after the hero leaves the viewport. 56px tall, one button, padded by `env(safe-area-inset-bottom)`. A/B test it, because the evidence is mixed. | Same "Start a game" label. **No pop-ups, interstitials or email gates, ever.** |

The tone is warm, a little wry and plain, like a text from a friend. Avoid all of these:

- "spice up", "naughty" and "unlock intimacy"
- flame or eggplant emoji
- therapy jargon used as a headline
- "AI-powered"
- stacked exclamation marks

Payment processors, ad platforms and SafeSearch read copy literally, so keep every public surface in the early-level register. "After Dark" and "Midnight" can appear as names but never with descriptions of later-level content. If the brand name changes, the page structure stays the same.

For SEO, ship the page as static or server-rendered HTML with real text. Use:

- a `<title>` of 60 characters or fewer, such as "Couples Question Game for Two Phones — No App"
- a meta description of 155 characters or fewer
- a canonical URL
- `og:image` at 1200×630 showing a Level 1 card, plus `twitter:card=summary_large_image`
- `WebApplication` JSON-LD with `applicationCategory: "GameApplication"` and `operatingSystem: "Any (web browser)"`, with `offers` only if it reflects the real price
- no `aggregateRating` until real ratings exist

Crawlable `/questions/…` pages with Level 1–3 samples and a "play this on two phones" button can capture high-intent searches. Later levels stay off every indexable page.

## Cards beat chat and audio when the phone gets out of the way

### Why the card is the right format

Physical decks build their ritual from structure, not paper. Ordered levels, one short pre-written prompt at a time, wildcards and a closing card are the recurring pattern. We're Not Really Strangers, for example, runs on three ordered levels ([WNRS](https://werenotreallystrangers.com/pages/core-landing-page)). Players describe pre-written prompts as letting them go deep "without putting the responsibility or the intrusiveness onto the players" ([Mechanics of Magic](https://mechanicsofmagic.com/2024/04/22/critical-play-judging-and-getting-vulnerable-were-not-really-strangers-kongmeng/)). A reviewer of the WNRS app said it "mimicked the exact look and feel of the physical card game", with gameplay barely affected ([Thingtesting](https://thingtesting.com/brands/were-not-really-strangers/reviews?p=6)). The structure transfers to screens. What is lost is the single shared object, and **a synced flip on both phones is the best digital substitute for drawing a card together**.

Partner phubbing is reliably bad for couples. A 2025 meta-analysis of 52 studies and 19,698 participants linked it to lower satisfaction, intimacy and responsiveness ([PMC12106345](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12106345/)). The "mere presence of a phone" effect, however, failed to replicate ([PLoS ONE](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8189469/)). The harm comes from diverted attention, not from the device being there. A card that both partners read at once and then look away from is joint use, not phubbing. A chat UI asks people sitting together to type at each other, so text input belongs only in a long-distance or asynchronous mode.

Audio frees the eyes and leaves room to imagine, as Dipsea's founders argue ([Marie Claire](https://marieclaire.com/sex-love/a25449637/audio-porn-app-dipsea)). But it suits guided listening rather than turn-taking conversation, and it is awkward on two unsynced phones. It belongs as an optional per-card layer for the suggestive levels, and as a later premium voice-read option, not as the default.

### Card design rules

The rules below combine sourced guidance with inference. WCAG 2.2 sets a 24×24 CSS px minimum target, Apple recommends 44pt and Material 48dp ([AllAccessible](https://allaccessible.org/blog/wcag-258-target-size-minimum-implementation-guide)). Dyslexia Scotland finds spacing matters more than serif versus sans and recommends about 1.5× line spacing ([Dyslexia Scotland](https://dyslexiascotland.org.uk/dyslexia-friendly-typed-formats)). Hoober found the screen centre easiest to tap and 49% of observed users operating one-handed ([UX Planet](https://uxplanet.org/mobile-usability-made-simple-945e106e23eb)). Gestures are often undiscoverable ([Univ. Lille thesis](https://pepite-depot.univ-lille.fr/LIBRE/EDMADIS/2023/2023ULILB045.pdf)), and swiping on content carries Tinder's "reject" meaning ([ICS](https://www.ics.com/blog/tap-tinder-and-touchscreens-how-swipe-can-improve-user-experience)). The motion timings and the "eyes up" state are design judgements that need testing.

| Element | Rule |
|---|---|
| Prompt length | **8–20 words, hard maximum 25** (3–5 lines at prompt size). One sentence, speakable in one breath. Any extra instruction goes in a secondary line of 12 words or fewer. |
| Prompt type | Bricolage Grotesque, `font-size: clamp(1.5rem, 6.4vw, 2rem)` (24–32px). Never below 20px. `font-optical-sizing: auto`; `font-variation-settings` locks `wdth` at 100 (no condensed widths). Weight steps from **500 at Level 1 to 600 at Level 8**, which adds mood without new files. `letter-spacing: -0.015em`; `line-height: 1.3`. Size in rem so OS text size scales it. Test at 200% zoom. |
| Alignment and style | Left-aligned. Centre only when the prompt fits in 3 lines or fewer. No italics or all-caps in prompts. A wide-tracked caps label is allowed only for "LEVEL 2"-style tags: Figtree 0.75rem, `letter-spacing: 0.08em`. |
| Secondary text | Figtree, at least 1rem, `line-height: 1.5`, `--ink-muted`. Buttons, rules and captions are always Figtree. Bricolage's display details lose legibility at small sizes in dim light. |
| Card geometry | Aspect ratio 5:7, `max-height: 62svh`, side padding 24px. Reserve the card's dimensions before content loads (CLS 0). Corner radius 20–24px. Prompt sits in the upper-middle third of the screen. |
| Pass / Next | **Identical**: same size, shape, fill (`--surface-raised` plus a 1.5px `--ink` border at 20% opacity), weight (Figtree 600) and font size. Two equal columns, **56px tall**, 12px gap, in the bottom third above `env(safe-area-inset-bottom)`. Pass is never a text link, never red, never smaller and never behind a gesture. Keep the order fixed on every card (Pass left, Next right) so muscle memory never misfires. No swipe-to-skip. |
| Private votes | While waiting, show only "Waiting for [name]…" on the card back. Show the result only as a match or "not this one", never who passed. No shame copy, ever. |
| Pause / stop night | A persistent 44px or larger control **in the lower area, not a top corner**. Neutral ink with an icon and the label "Pause". Reachable on every screen. |
| Flip / reveal | The server sends `reveal_at` and both phones flip at that timestamp, so neither partner reads first. Optional 3-2-1 countdown at 1000ms per step. Flip **480ms**, `cubic-bezier(0.2, 0.8, 0.2, 1)`, rotating the card only (never the viewport), animating only `transform` and `opacity`. Keyboard: Enter and Space. |
| Reduced motion | Under `prefers-reduced-motion: reduce`, replace the flip with a **180ms crossfade** and the countdown with static numerals (no scaling or pulsing). Watch the media query at runtime and gate JS animations on it too ([ezud](https://www.ezud.com/animation-motion-accessibility-reduced-motion)). |
| Eyes up | Six seconds after a reveal with no input, fade the button row to 60% opacity and hide chrome. Any touch restores it. Never require taps to keep the session alive. This is an untested inference from the phubbing research. |
| Card art | Generated abstract art on the **card back** at full strength. On the prompt face, use it at 15% opacity or less under a solid scrim of the face colour. Verify contrast against the worst-case pixel, not the average. |
| Art generator guardrails | Seed is deterministic, `hash(roomId, cardId)`, so both phones render identical art. Palette comes from the blend of both vibes at the level's depth. Vocabulary is flat grain-textured gradients, fluid lines and botanical or tidal forms, with **density and contrast rising with level** and a highlight of OKLCH L ≥ 0.70 at Levels 7–8. Hard ban on bodies, faces, hands, anatomical or suggestive shapes, and 3D blobs. Render client-side in SVG or Canvas within one frame (about 16ms or less) on a low-end Android phone. |
| Accessibility extras | A "Larger text / plain card" toggle removes art and raises the prompt to 2.25rem. Expose each card to screen readers as a heading with the level, then the prompt. Never encode state in colour alone. |

Two caveats apply to the type choices. Bricolage and Figtree have no published legibility testing. Neither family's script coverage was verified for Devanagari or other non-Latin scripts, so localized builds need a tested Noto fallback stack. Typeface does shift perceived sincerity: Monotype's study reported up to a 13% lift in positive response from typeface choice alone ([Monotype](https://cms-prod.monotype.com/company/news/monotype-study-shows-typeface-choice-can-boost-positive-consumer-response-13)). That supports keeping one warm grotesque rather than adding a script face. Avoid handwriting fonts for prompts entirely.

## Quiet by default, synthesized cues, and one phone owns the music

### Music: slow, instrumental, and no faster as the levels rise

Tempo mainly drives arousal and mode mainly drives valence ([Husain et al. 2002](https://sites.utm.utoronto.ca/sites/sites.utm.utoronto.ca.glenn_website/files/download/Husain.pdf)). When the two cues conflict, tempo dominates ([Morreale, JYU](https://jyx.jyu.fi/bitstream/123456789/41594/1/Fabio%20Morreale%20-%20The%20Effect%20Of%20Expertise%20In%20Evaluating%20Emotions%20In%20Music.pdf)). Slow music at 60–80 BPM reliably lowers self-reported anxiety, but its effect on heart rate is inconsistent. An imaging meta-analysis found ambient sound worked about as well as music ([AuntMinnie Europe](https://www.auntminnieeurope.com/medical-legal-and-practice/patient-safety/article/15663950/team-lisbon-elaborates-on-how-music-calms-troubled-minds); [A*STAR](https://research.a-star.edu.sg/articles/highlights/counting-in-adagio/)). Earlier research found music helps attraction only modestly and works mainly alongside a consensual narrative ([SAGE](https://journals.sagepub.com/doi/10.1177/26318318221088935)). The words and the partner should do the work.

Gen Z already builds hyper-specific mood playlists. Spotify logged 86M minutes of playlists with "first" in the title, and 74% of ANZ Gen Z said mood playlists make brands feel in tune with them ([Spotify Culture Next](https://ads.spotify.com/en-CA/culture-next/gen-z-trends-report/)). "Bring your own playlist" is therefore a feature, not a fallback.

| Level band | Bed | Tempo / harmony | Notes |
|---|---|---|---|
| 1–2 (Sparks) | "Warm-up" | 60–80 BPM, major or modal, soft pads, lo-fi 70–85 BPM feel | Ambient is acceptable here |
| 3–5 | "Closer" | 65–90 BPM, major-7th and 9th neo-soul or R&B harmony, Rhodes and bass | Avoid melancholy minor keys, which lower valence |
| 6–8 (to Midnight) | "Late" | **Still 70–90 BPM**, deeper low end, slower harmonic rhythm | Do not escalate tempo. Arousal comes from content and partner. |
| Celebrations only | Sting | 100–120 BPM feel, major, plucked or marimba timbres | Under 1.5s, rare |

All beds are instrumental, because lyrics compete with talking. Commission every bed in **D major** (or D Lydian) so the UI tones, drawn from the D-major pentatonic scale (D E F♯ A B), never clash. This follows Monument Valley's approach of treating music and interaction sound as one system ([Audiokinetic](https://audiokinetic.com/en/blog/behind-the-beautiful-sound-of-monument-valley-2-with-todd-baker)). Regional taste varies sharply. In India, Bollywood and I-Pop dominate Spotify Wrapped ([Rolling Stone India](https://rollingstoneindia.com/spotify-wrapped-india-2025-most-streamed-artists-songs-albums)). Serve regional moods as curated playlist deep links, not as licensed in-app audio.

### Licensing path

Embedding streaming audio is effectively closed. Spotify's Developer Policy prohibits synchronizing recordings with visual media and limits full streams to Premium ([Spotify Developer Policy](https://developer.spotify.com/policy/)). Since May 2025, extended API access is reserved for organizations with "established, scalable" use cases ([Spotify Developer Blog](https://developer.spotify.com/blog/2025-04-15-updating-the-criteria-for-web-api-extended-access)).

**Pixabay is riskier than the earlier market report suggested.** Its terms bar distributing content "on a Standalone basis", and older licence text names music files specifically ([Pixabay Terms](https://pixabay.com/en/service/terms/); [ScanCode LicenseDB](https://scancode-licensedb.aboutcode.org/pixabay-content.html)). Bundling a raw loop in an app plausibly triggers that clause. Epidemic Sound reportedly needs enterprise tiers for games ([Photutorial](https://photutorial.com/artlist-vs-epidemic-sound)), and Uppbeat licences cover social video ([Uppbeat](https://fastly-f.uppbeat.io/blog/royalty-free-and-copyright-free-music/uppbeat-vs-epidemic-sound-how-do-they-compare)). AI music remains legally unsettled. Suno v6 launched on licensed Warner, BMG and Believe catalogues in September 2026 ([The Next Web](https://thenextweb.com/news/suno-v6-warner-bmg-believe-licensed-models)), but a single report says Sony and UMG filed a new suit days later ([pasqualepillitteri.it](https://pasqualepillitteri.it/pl/news/17682/suno-v6-licencja-muzyka-ai)).

The clean path has three parts:

1. **Commission four beds plus one sting** as work-for-hire, or buy them out, with written app and game sync rights, worldwide and perpetual. Each bed is a 2–3 minute seamless loop.
2. **Synthesize every UI sound in Web Audio**, which removes SFX licensing entirely and adds zero download weight.
3. **Offer "BYO music" deep links** to Spotify, Apple Music and YouTube Music mood playlists for each region.

Avoid the Spotify Web Playback SDK. Encode beds as AAC `.m4a` at about 64–96 kbps, a little over 1 MB per bed. Fetch them lazily only after music is switched on, and cache them in the Service Worker.

### Two phones, iOS and the silent switch

Syncing music across two browsers in the same room is possible in principle, at about 10ms with NTP-style clock sync ([W3C Multi-Device Timing](https://www.w3.org/2015/Talks/fd-timing-tpac-breakout)). Bluetooth output delay breaks it in practice ([Hacker News: Beatsync](https://hn.jakechampion.name/item/43835584)).

**Only one phone plays music.** The lobby offers "Music: this phone / [partner]'s phone / off". In apart mode, each phone plays its own bed starting from the same server-timestamped loop position.

On iOS, Web Audio defaults to an "ambient" session that the silent switch mutes. Setting `navigator.audioSession.type = "playback"` (Safari 17+) overrides the switch ([WebKit Bug 264473](https://bugs.webkit.org/show_bug.cgi?id=264473)). The app should respect the switch for UI sounds. It should set "playback" only after the player explicitly turns music on, feature-detecting the API first. If BYO music is chosen, disable the in-app bed and keep the session "ambient" so UI cues mix with Spotify instead of stopping it. Pause all audio on `visibilitychange` to hidden, which also protects privacy.

The earlier research found that over 91% of players in one survey keep game sound off ([TapResearch](https://blog.tapresearch.com/how-sound-preferences-impact-player-engagement)). A partner may be asleep nearby, and an intimacy app making noise unexpectedly is a privacy failure. **Defaults are therefore: UI sounds off, music off, haptics subtle (Android only).** The lobby's "Start night" screen shows one "Sound on" toggle. That tap doubles as the iOS audio-unlock gesture, and the choice is remembered on the device. The research notes suggested UI sounds on at low volume instead. That is defensible, but in a consent-first product the cost of a surprise sound outweighs the benefit.

### Sound spec

All sounds are synthesized with sine or triangle oscillators through a lowpass filter at 2.5–4 kHz, with soft attack and release envelopes and no samples. Practitioner guidance converges on these principles ([Violet Recording](https://violetrecording.com/how-to-design-ui-sounds/); [creatorsoundspro](https://creatorsoundspro.com/the-game-designer-reference-library-audio-reference-tables)):

- taps of 30–150ms and notifications of 200–500ms
- frequent sounds quieter than rare ones
- no sound as the only carrier of information

No official UI loudness standard exists ([Apple Developer Forums](https://developer.apple.com/forums/thread/703142)), so the loudness targets are design choices. The music bed sits at **−20 to −23 LUFS integrated**, and UI sounds peak no higher than **−16 LUFS short-term**.

| Event | Synthesis | Duration | Gain (dB / linear) | Notes |
|---|---|---|---|---|
| Button tap | Sine at 880 Hz (A5), 5ms attack, exponential decay | 50ms | −18 dB / 0.13 | Quietest; most frequent |
| Card flip | Bandpassed noise sweep 800 Hz → 2.5 kHz, plus a 30ms triangle pluck at D5 | 200ms | −12 dB / 0.25 | Synced to the flip start |
| Card reveal | Two triangle notes, D5 → F♯5 (rising major third), 120ms apart, kalimba-like decay | 400ms | −8 dB / 0.40 | Once per round |
| Countdown tick | Sine at 110 Hz with a 2ms click transient, soft "thump" | 80ms each | −12 dB / 0.25 | Only on timed cards |
| Partner joined / partner ready | Single triangle note A4, 20ms attack | 300ms | −10 dB / 0.32 | |
| Both said yes | **Each phone plays one note**: host D5, guest A5, scheduled on the shared clock. A 20–50ms offset reads as a strum. | 600ms | −8 dB / 0.40 | Consent moment; the duet is the point |
| Level up | Arpeggio D-F♯-A-D (four notes, 90ms apart), plus a filtered-noise shimmer | 1.2s | 0 dB / 1.0 (relative ceiling) | Rarest and loudest; never a fanfare |
| Pass / skip / pause | Neutral descending soft tone, A4 → F♯4, sine | 250ms | −14 dB / 0.20 | **Never a buzzer or "wrong" sound.** Refusal is not punished. |
| Error / reconnecting | None. Visual banner only. | — | — | Avoid alarm sounds entirely |

Route everything through `masterGain → compressor (threshold −18 dB, ratio 3) → destination`, with separate `uiGain` and `musicGain` buses. The bed's `musicGain` defaults to about 0.35 and is adjustable. Keep peak energy out of the 2.5–5 kHz harshness band. Create the `AudioContext` lazily inside the first "Sound on" tap. A single "Quiet mode" switch in settings mutes sound and haptics together.

## Haptics are an Android enhancement with a visual twin on iPhone

### What the touch research supports

Mediated touch can carry emotion, but the evidence favours slow and gentle. In a lab RCT, a fixed 60 bpm wrist vibration presented as the wearer's heartbeat **significantly lowered anxiety** (p = .014, n = 67), while fast heartbeat stimuli raise anxiety ([PMC6435301](https://pmc.ncbi.nlm.nih.gov/articles/PMC6435301)). Hearing a partner's heartbeat increased reported intimacy, but people also kept more physical distance when they noticed it. That is a regulation effect, and it argues for making heartbeat features opt-in ([ShareABeat, UHasselt](https://documentserver.uhasselt.be/bitstream/1942/19054/1/09-Gijsbrechts.pdf)). The skin's pleasant-touch nerve fibres (CT afferents) respond best to stroking at 1–10 cm/s and poorly to vibration ([PMC4570804](https://pmc.ncbi.nlm.nih.gov/articles/PMC4570804); [bioRxiv 2025](https://www.biorxiv.org/content/10.64898/2025.11.29.690443.full.pdf)), so a phone buzz cannot imitate a caress and should not try.

Platform guidance agrees on restraint. Android says "less is more" and prefers crisp over buzzy. Without amplitude control, every non-zero amplitude plays at full strength ([Android haptics principles](https://developer.android.com/develop/ui/views/haptics/haptics-principles)). Apple says the best haptic is one people would miss but don't consciously notice, and that haptics must always be optional ([Apple HIG](https://developer.apple.com/design/human-interface-guidelines/playing-haptics)).

### The iOS reality

No browser on iOS supports `navigator.vibrate` ([MagicBell](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide); [caniuse](https://caniuse.com/mdn-api_navigator_vibrate)). The only route is an unofficial hack: programmatically clicking a hidden `<input type="checkbox" switch>` to trigger one fixed system tick that cannot be patterned ([ios-haptics](https://npmjs.com/package/ios-haptics)). WebKit is considering requiring user activation for it ([WebKit Bug 285120](https://bugs.webkit.org/show_bug.cgi?id=285120)), and the earlier research found reports that it broke in iOS 26.5 ([rapidtoolset](https://rapidtoolset.com/en/tool/ios-haptics-tester)). **Do not ship it by default.** If it is ever added, gate it behind a remote feature flag, fire it only synchronously inside a real tap handler, and limit it to "tick" and "reveal". On iOS, hide haptic settings rather than showing a broken toggle. Pair every haptic with a visual twin: a soft glow ring that scales 1.00 → 1.04 and back on the card edge, or a 60 bpm pulse ring for heartbeat features. Add an optional low 60 Hz audio "thump" if sound is on.

### Haptic spec (Android Chrome / Samsung Internet)

| Pattern | Trigger | `navigator.vibrate()` | Default | Visual twin |
|---|---|---|---|---|
| Tick | Pass, Next, Ready confirmations; card flip | `[10]` | On (Subtle) | Button press state |
| Reveal | Card face shown | `[15, 60, 25]` | On (Subtle) | Edge glow 1.00 → 1.04, 300ms |
| Both said yes | Mutual consent confirmed (both phones, on the shared clock) | `[20, 80, 20, 80, 40]` | On (Subtle) | Two-vibe blend sweep across the card |
| Level up | New level unlocked | `[15, 50, 15, 50, 15, 50, 60]` | On (Subtle) | Ladder step lights |
| Partner paused / passed | Any refusal | **none** | — | Neutral banner, no motion |
| Calm heartbeat | Waiting, or a breathing card | `[30, 120, 20, 830]` looped = 60 bpm "lub-dub", **stop after 15s** | **Off, opt-in** | Pulse ring at 60 bpm |
| Send a touch (apart mode) | Hold to send pulses to partner | `[40]` per beat at 60 bpm | **Off; the receiver must enable "Allow touches from [name]"** | Receiver sees a pulse ring |
| Errors / nudges | — | **never** | — | Never vibrate to pull someone back |

Implementation details:

- Feature-detect with `'vibrate' in navigator`.
- Only call it after the first user tap.
- Never exceed 60 bpm for heartbeat rhythms.
- Cancel any loop with `navigator.vibrate(0)` on `visibilitychange`, on pause and on level exit.
- Expose an intensity setting of **Off / Subtle / Normal**. Subtle (the default) multiplies every "on" duration by 0.5 with a 6ms floor. Normal uses the table values.
- Respect "Quiet mode".
- Never use haptics as the sole signal.

A future Capacitor wrapper can upgrade to Core Haptics: a heartbeat of two transients at intensity 0.5 then 0.3, sharpness 0.2–0.3, 120ms apart. On native Android it can use `VibrationEffect` composition primitives at low scale ([Apple Core Haptics](https://developer.apple.com/documentation/corehaptics/updating-continuous-and-transient-haptic-parameters-in-real-time); [Android haptics APIs](https://developer.android.com/develop/ui/views/haptics/haptics-apis)).

## Budget for a mixed-OS couple opening the link inside Instagram

### Who is actually holding the phones

Worldwide, Android carries about 68% of mobile web traffic and iOS about 32%. The split ranges from about 60% iOS in North America to roughly 5–7% in India ([StatCounter](https://gs.statcounter.com/os-market-share/mobile-operating-system/worldwide); [StatCounter North America](https://gs.statcounter.com/os-market-share/mobile-operating-system/north-america); [SQ Magazine](https://sqmagazine.co.uk/iphone-vs-android-statistics/)). Among US teens, 88% own an iPhone ([MacRumors](https://www.macrumors.com/2025/04/09/teen-iphone-ownership-continues-to-soar/)).

Assuming partners choose independently, P(mixed) = 2p(1−p). That puts **mixed iPhone-Android couples at roughly 42–50% in the US, UK and EU**, about 30–33% in Brazil and Indonesia, and 10–13% in India. Real couples probably match more often than random pairs, so treat these as upper-bound estimates. Every feature must work across a mixed pair. In India and Southeast Asia, the typical couple is two mid- or low-range Android phones.

Chrome holds about 70% of mobile browsing, Safari 22% and Samsung Internet 3% ([StatCounter browsers](https://gs.statcounter.com/browser-market-share/mobile/worldwide)). The invite link, however, will often open inside Instagram, TikTok or WhatsApp WebViews. Those are known to block popups, mishandle storage and cookies, and break `postMessage` ([Paybis docs](https://docs.payb.is/docs/platform-compatibility-limitations); [Incode](https://developer.incode.com/docs/webviews)). iOS WKWebView can wipe `localStorage` ([Apple Developer Forums](https://developer.apple.com/forums/thread/107625)).

The design has to handle that environment:

- Detect in-app user agents (`Instagram`, `FBAN`/`FBAV`, `musical_ly`/`BytedanceWebview`, `Line`) and show a dismissible, non-blocking "Open in Safari/Chrome for the best night" banner.
- Keep the room code and rejoin token in the URL fragment as well as in storage.
- Never use `window.open`.
- Let Socket.IO fall back to long-polling.

WebSocket support in these WebViews was not confirmed by any source and must be device-tested.

iOS Low Power Mode caps `requestAnimationFrame` at about 30 fps and overrides Screen Wake Lock ([WebKit bug 215745](https://bugs.webkit.org/show_bug.cgi?id=215745); [Web Features Explorer](https://web-platform-dx.github.io/web-features-explorer/features/screen-wake-lock/)). Animations must look right at 30 fps, wake lock is best-effort, and all timers are server-authoritative, resyncing on `visibilitychange`.

### Budgets

Core Web Vitals "good" thresholds are LCP ≤ 2.5s, INP ≤ 200ms and CLS ≤ 0.1, measured at the 75th percentile of real users ([web.dev](https://web.dev/articles/defining-core-web-vitals-thresholds)). In Deloitte's Google-commissioned study, a 0.1s mobile speed gain correlated with +8.4% retail conversion ([web.dev case study](https://web.dev/case-studies/milliseconds-make-millions)). The median mobile page now ships 680 KiB of JavaScript ([SpeedCurve, citing Russell 2026](https://www.speedcurve.com/newsletter/56-new-performance-inequality-gap-hidden-cost-of-media-on-the-web-the-value-of-stubborn-empathy-/)). Russell's slow-link baseline is 400 Kbps with 400ms RTT ([Infrequently Noted](https://infrequently.org/2021/03/the-performance-inequality-gap/)), so 500 KB takes about 10 seconds to arrive. Data per GB is cheap in India ($0.16) and Brazil ($0.40) ([ISPreview](https://www.ispreview.co.uk/index.php/2023/09/uk-ranks-58th-in-the-world-for-the-price-of-1gb-of-mobile-data.html)), so the binding constraint is tail latency and slow CPUs, not data cost.

| Budget | Landing page `/` | Game `/play` |
|---|---|---|
| HTML + critical CSS | ≤ 50 KB gzip, inlined critical CSS | ≤ 30 KB gzip shell |
| JavaScript | **≤ 30 KB gzip** (card demo only; islands or Preact). No React on first paint if avoidable. | **≤ 150 KB gzip for the lobby/join route**; ≤ 300 KB total, with game modules lazy-loaded. Consider `preact/compat` if over. |
| Fonts | Self-hosted WOFF2, subset to Latin + Latin Extended. Preload at most 2 files with `crossorigin`. Bricolage subset ≈ 30 KB. Figtree as one variable file. Fallback `@font-face` with `size-adjust` / `ascent-override` to remove swap CLS ([web.dev fonts](https://web.dev/patterns/web-vitals-patterns/fonts/font-self-hosted)). | Same files, cached by the Service Worker |
| Images | No hero raster. Phones and cards drawn in CSS/SVG. One OG image (not loaded on page). Grain as a ≤ 2 KB tiled PNG. | Art generated client-side; no image downloads |
| Audio | None | 0 KB until music is switched on; ≤ ~1.2 MB per bed, lazy and cached |
| Total first load | **≤ 200 KB** (about 4s on the slow-link baseline) | **≤ 500 KB**; repeat visits ≈ 0 KB from the Service Worker |
| Vitals at p75 | LCP ≤ 2.5s (target ≤ 1.8s), INP ≤ 200ms, CLS ≤ 0.05 | INP ≤ 200ms on a low-end Android; flip holds 30 fps in Low Power Mode |
| Third parties | None. Self-hosted, cookieless analytics only. | None near the game |

Layout targets CSS widths from **320 to 430px**, with **360×800** as the narrow Android baseline and **390×844 / 393×852** as the iPhone baseline. The most common worldwide mobile viewport is 414×896 ([StatCounter resolutions](https://gs.statcounter.com/screen-resolution-stats/mobile/worldwide)). Support heights down to 640px for in-app browsers whose toolbars eat space. Use `dvh`/`svh` instead of `100vh`, `viewport-fit=cover` with `env(safe-area-inset-*)`, and a centred `max-width: 480px` column on foldables and desktops. Lock portrait in the PWA manifest, but in-app browsers ignore it, so landscape must not break.

The release test matrix:

- current and previous iOS Safari
- an iPhone in Low Power Mode with the silent switch on
- a mid-range Android at 412×915 on Chrome
- Samsung Internet
- a 3–4 GB RAM budget Android (Redmi A or Galaxy A0x class) throttled to the slow-link profile
- Instagram, TikTok, WhatsApp and Messenger in-app browsers on both platforms
- one full game on a mixed iPhone + Android pair, including a lock-screen reconnect

## Conclusion

The most useful result of this research is that two of the app's identity choices are also its accessibility risks. Using four red-family vibes and deepening them with each level looks elegant on paper, but it collapses partner identity for colour-blind players and, at Level 8, for everyone. The fix does not dilute the concept. It completes it: a fifth cool vibe, glyphs, a fixed you/partner lightness split, and a light-mode "night falls" jump at Level 5 that turns a contrast problem into a narrative beat. The same logic runs through sound and haptics, where the consent principle becomes a technical rule. Refusal gets no buzzer and no vibration. Touch is sent only to someone who allowed it. Nothing plays until someone chooses sound.

The biggest open questions are empirical, and cheap to answer once real couples play. Does the three-card demo beat a looping two-phone video? Do couples actually turn sound on? Does the "eyes up" fade help conversation or just confuse? Which vibe pairs do couples really pick? The colour and contrast numbers here are computed, not user-tested. The licensing and iOS-haptic positions depend on platform behaviour that changes within months. Re-check those two before launch, instrument the rest, and let pass rates and partner-join rates, not taste, settle the design.
