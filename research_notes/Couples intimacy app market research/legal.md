# Legal & Safety Requirements: Worldwide Launch of a Non-Explicit Couples Intimacy Web App (as of Nov 2026)

Scope: a web app couples intimacy game. Content is text prompts only and suggestive at most ("kissing only, five minutes"). No nudity and no sexual imagery. This is informational research, not legal advice. Items marked **[LAWYER]** need counsel.

Research limitations: ofcom.org.uk and legislation.gov.uk could not be fetched in this session (network allow-list). Ofcom and UK statute points therefore rest on search-result extracts of those pages plus secondary commentary. Most other sources are law-firm, vendor or tracker summaries rather than primary legal text. Vendor sources (age-verification companies) have a commercial interest in overstating obligations.

---

## 1. Age assurance: UK Online Safety Act (OSA)

### Takeaway
The UK's mandatory "highly effective age assurance" (HEAA) duty, in force since 25 July 2025, attaches to *pornographic* content. The OSA defines that as content "reasonable to assume was produced solely or principally for the purpose of sexual arousal." Ofcom's own examples put "suggestive" glamour content and narrative erotica *outside* that definition. Non-explicit, playful couples prompts are therefore very likely not pornographic, and HEAA is likely not mandatory. The bigger open question is whether the product is an OSA-regulated service at all (user-to-user or search). A pure publisher of its own text prompts with no user-to-user features may fall outside Parts 3 and 5 entirely **[LAWYER]**.

### Cited Findings
- OSA s.236(1) defines "pornographic content" as "content of such a nature that it is reasonable to assume that it was produced solely or principally for the purpose of sexual arousal"; no outstanding amendments — [legislation.gov.uk s.236 (via search extract)](https://www.legislation.gov.uk/ukpga/2023/50/section/236/data.pdf)
- Ofcom's "Adults Only" page gives examples of content outside the pornography definition: "Glamour content whose primary purpose falls short of sexual arousal, but may have suggestive intentions." It also excludes erotica where narrative structure means the sole or principal purpose is not sexual arousal. It points to Section 2 of the *Guidance on Content Harmful to Children* for the detailed test — [Ofcom: Adults Only](https://www.ofcom.org.uk/online-safety/pornography/adults-only-what-to-do-if-your-online-service-allows-pornography)
- Ofcom has an FOI response setting out its definition of pornography — [Ofcom FOI Aug 2025](https://www.ofcom.org.uk/siteassets/resources/documents/about-ofcom/foi/2025/august/ofcoms-definition-of-the-term-pornography.pdf)
- Commentary notes the words "solely or principally" open avenues for argument at the margins — [decoded.legal](https://decoded.legal/blog/2023/11/online-safety-act-2023-the-uks-anti-pornographic-content-provisions/)
- Services allowing pornography must use age assurance that is "highly effective". The requirement for Part 3 (user-to-user) services took effect 25 July 2025 — [Ofcom letter to Part 3 services](https://www.ofcom.org.uk/online-safety/protecting-children/letter-to-part-3-services-that-allow-pornography-outlining-heaa-requirements)
- Part 5 covers services that *publish their own* pornographic content (including some generative AI tools). Part 3 covers user-to-user services hosting user-generated porn — [Ofcom: age checks](https://www.ofcom.org.uk/online-safety/protecting-children/age-checks-to-protect-children-online)
- "Primary priority content" harmful to children covers pornography, suicide, self-harm and eating-disorder content — [Ofcom age assurance report 2026](https://www.ofcom.org.uk/siteassets/resources/documents/online-safety/information-for-industry/age-assurance-report-2026/report-on-the-use-of-age-assurance.pdf?v=423162)
- HEAA criteria: technically accurate, robust, reliable and fair. Ofcom and the ICO issued a joint statement on age assurance in March 2026 — [Global Policy Watch](https://www.globalpolicywatch.com/2026/03/ofcom-and-ico-issue-joint-statement-on-age-assurance/)
- Enforcement is active. Ofcom issued a confirmation decision against a provider on 18 June 2026 — [Ofcom enforcement programme](https://www.ofcom.org.uk/online-safety/protecting-children/enforcement-programme-to-protect-children-from-encountering-pornographic-content-through-the-use-of-age-assurance)

### Inferences
- **Must-do now (UK):**
  - Write and keep an internal assessment explaining why the content is not "pornographic" under s.236, with reference to Ofcom's "suggestive glamour" and narrative-erotica examples.
  - Decide whether any feature makes you a user-to-user service. Examples: partners sending free-text dares to each other, shared custom decks, public deck sharing. If so, you need illegal-content and children's-access risk assessments.
  - Self-declared 18+ plus 18+ positioning is defensible for non-porn content but is not "highly effective".
- **Only if content becomes explicit (UK):** explicit descriptions of sex acts written to arouse, AI-generated erotica, or images trigger HEAA. Methods would be facial age estimation, ID, open banking, credit card checks and similar; self-declaration does not qualify.
- Text-only content is not exempt from s.236. Written material can be pornographic if its principal purpose is arousal, so copy guidelines matter as the deck grows.

### Gaps
- Could not read Section 2 of Ofcom's *Guidance on Content Harmful to Children* verbatim (site blocked). Its threshold for "priority content" sexual material (non-pornographic) is unconfirmed.
- Unconfirmed whether a provider-content-only web app with no user interaction is in OSA scope at all **[LAWYER]**.

---

## 2. Age assurance: United States (state AV laws, FSC v. Paxton, app-store acts)

### Takeaway
Texas-style AV laws apply to commercial sites where more than one-third of content is "sexual material harmful to minors". The Supreme Court upheld them under intermediate scrutiny in *FSC v. Paxton* (June 2025). Non-explicit suggestive text almost certainly falls below the "harmful to minors" standard, and certainly below one-third. App Store Accountability Acts (Texas, Utah, Louisiana) and California's AB 1043 (from 1 Jan 2027) put duties on app stores and developers of *native apps*. A pure web app largely sidesteps them, but a future iOS/Android wrapper would not.

### Cited Findings
- *Free Speech Coalition v. Paxton* (June 2025, 6-3) upheld Texas HB 1181 under intermediate scrutiny, finding only an incidental burden on adults' protected speech — [CRS LSB11354](https://www.congress.gov/crs-product/LSB11354); [Cornell LII opinion](https://www.law.cornell.edu/supremecourt/text/23-1122)
- HB 1181 applies to commercial websites distributing material "more than one-third of which is sexual material harmful to minors" — [Wikipedia summary of case](https://en.wikipedia.org/wiki/Free_Speech_Coalition_v._Paxton); [Congress.gov Constitution Annotated](https://constitution.congress.gov/browse/essay/intro.9-3-2/ALDE_00013950/)
- The Court left open whether age-gating non-"harmful to minors" content on covered sites could violate the First Amendment — [Constitution Annotated](https://constitution.congress.gov/browse/essay/intro.9-3-2/ALDE_00013950/)
- Texas App Store Accountability Act (SB 2420): preliminary injunction issued 23 Dec 2025; 5th Circuit stayed the injunction 28 May 2026, so the law is reported in effect while litigation continues — [Texas Policy Research](https://www.texaspolicyresearch.com/federal-court-blocks-texas-app-store-accountability-act/); [Troutman](https://www.troutmanprivacy.com/2025/12/federal-district-court-grants-preliminary-injunction-of-texas-app-store-accountability-act/); [CCIA](https://ccianet.org/news/2025/12/judge-blocks-texass-app-store-accountability-act-as-unconstitutional-speech-restriction/); [Digital Policy Alert](https://digitalpolicyalert.org/event/36716-district-court-issued-preliminary-injunction-blocking-the-app-store-accountability-act-sb-2420). One tracker reports SCOTUS declined emergency relief on 6 July 2026 (single secondary source, unverified).
- Utah SB 142 (amended by HB 498) core provisions effective 6 May 2026. Louisiana HB 570 was replaced by HB 977 in 2026 (effective date not found). Comparison of the enacted acts — [FPF comparison](https://fpf.org/blog/comparing-enacted-app-store-accountability-acts/); [FPF chart PDF](https://fpf.org/wp-content/uploads/2026/06/FPF-Legislation-TX-UT-LA-App-Store-Accountability-Act-Comparison-Chart.pdf)
- California AB 1043 (Digital Age Assurance Act): the OS collects age at device setup and sends an age-range signal to apps from 1 Jan 2027; enforced by the AG only — [chatbotlaws.com tracker](https://chatbotlaws.com/app-store-accountability-act/); [AVPA](https://avpassociation.com/app-store-accountability-act/)

### Inferences
- **Must-do now (US):** no state porn-AV law is likely triggered by non-explicit text. Do the following:
  - Gate at 18+ via self-declaration and state 18+ in the terms.
  - Avoid child-directed marketing, which also keeps you clear of COPPA.
  - Keep a content audit showing explicit material is about 0% of the catalogue.
- **If shipping native apps:** app-store age-category signals (Texas, Utah, Louisiana; California from 2027) must be received and honoured. Rate the app 17+/18+ in the stores.
- **Only if content becomes explicit:** once more than one-third of the site is "harmful to minors" material, around 20+ state AV laws apply. Their scope varies, and some have lower or different thresholds **[LAWYER]**. Commercial-grade AV is then required, and some states add health-warning or labelling duties.
- "Harmful to minors" is a Miller-derived test (prurient interest, patently offensive, lacks serious value for minors). This is unsourced here; it reflects my knowledge of the statutes, so verify.

### Gaps
- No verified count or list of states with porn-AV laws as of Nov 2026, or which use thresholds other than one-third.
- Utah/Louisiana litigation status unconfirmed.
- No search done on FTC enforcement relevant to intimacy apps (e.g., FTC Health Breach Notification Rule as applied to wellness apps); worth checking.

---

## 3. Age assurance: EU (DSA Art. 28, guidelines, blueprint)

### Takeaway
The DSA Article 28 Guidelines (14 July 2025) are a non-binding but "significant and meaningful" compliance benchmark. They apply to online platforms accessible to minors and recommend age *verification* for high-risk content such as pornography and gambling. The EU age-verification blueprint ("mini wallet") is for proving 18+ for adult content. A non-explicit adult couples app should be clearly 18+ by self-declaration with proportionate measures. Hard AV is expected only if content becomes pornographic.

### Cited Findings
- The Commission published Art. 28 guidelines on 14 July 2025 and intends to use them as a "significant and meaningful" benchmark — [Inside Privacy (Covington)](https://www.insideprivacy.com/digital-services-act/european-commission-makes-new-announcements-on-the-protection-of-minors-under-the-digital-services-act/); [EC press release IP/25/1820](https://ec.europa.eu/commission/presscorner/detail/en/ip_25_1820)
- The guidelines recommend age verification for high-risk services (pornography, gambling) and lighter measures such as age estimation elsewhere. Per one summary, estimation is only a temporary alternative for adult content — [FPF](https://fpf.org/blog/the-eu-commissions-approach-to-age-verification-mobile-apps-dsa-enforcement-and-challenging-national-social-media-bans/); [EC digital strategy](https://digital-strategy.ec.europa.eu/en/news/commission-presents-guidelines-and-age-verification-app-prototype-safer-online-space-children)
- The blueprint lets users prove they are over 18 for restricted adult content without revealing other data. An April 2026 Commission recommendation asked Member States to offer it by 31 Dec 2026 — [EC blueprint news](https://digital-strategy.ec.europa.eu/en/news/commission-makes-available-age-verification-blueprint); [FPF](https://fpf.org/blog/the-eu-commissions-approach-to-age-verification-mobile-apps-dsa-enforcement-and-challenging-national-social-media-bans/)

### Inferences
- Art. 28 covers "online platforms", meaning hosting services that disseminate user content to the public. A publisher-only app with private couple-to-couple sharing may not be an "online platform" at all **[LAWYER]**. Basic DSA intermediary duties (points of contact, T&Cs transparency) may still apply if any hosting occurs.
- National laws can be stricter. France's SREN law and Arcom's referential apply to porn sites, and Germany's JMStV covers content "harmful to development". Neither was researched here. Germany's youth-protection regime is notably strict about sexual content even when non-explicit **[LAWYER — DE check recommended]**.

### Gaps
- Could not confirm exact guideline wording on self-declaration, or the DSA small/micro-enterprise carve-outs (Art. 19 exempts micro and small enterprises from some platform obligations; Art. 28 applicability for them was not confirmed in sources found).
- Germany (JMStV/KJM) and France (SREN/Arcom) not researched.

---

## 4. Age assurance: Australia

### Takeaway
Phase 2 industry codes (registered 2025, most commencing 9 March 2026) require age assurance before access to pornography and class 1C/class 2 material. That covers "adult apps" and explicit AI chatbots. The search-engine code has applied since 27 Dec 2025, and app stores must age-check R18+ downloads by 9 Sept 2026. The under-16 social media minimum age (since 10 Dec 2025) targets social platforms and is very unlikely to cover a private couples game. Non-explicit "M/MA15+-equivalent" suggestive text is probably below class 2, but the classification line is a judgement call **[LAWYER]**.

### Cited Findings
- Remaining codes commenced 9 March 2026, requiring age assurance for pornography and material rated class 1C or class 2, including adult apps and explicit AI chatbots — [MediaNama](https://www.medianama.com/2026/03/223-australia-age-verification-ai-chatbot-porn-apps-law-2026/); [ID Tech](https://idtechwire.com/australia-registers-new-industry-codes-for-online-safety-expanding-age-assurance-requirements/); [HSF Kramer](https://www.hsfkramer.com/insights/2025-09/new-online-safety-codes-require-age-verification-for-explicit-content)
- Search engine code from 27 Dec 2025, with age checks for logged-in users by 27 June 2026. App stores must check age before R18+ downloads by 9 Sept 2026 — [ACS Information Age](https://ia.acs.org.au/article/2026/search-engine-age-checking-rules-begin-in-australia.html); [eSafety regulatory guidance Dec 2025](https://www.esafety.gov.au/sites/default/files/2025-12/OnlineSafetyCodesandStandardsRegulatoryGuidanceDec2025.pdf)
- Social media minimum age: since 10 Dec 2025 age-restricted platforms must take reasonable steps to stop under-16s holding accounts. Rules exclude messaging, email, voice/video calls, online gaming, health and education services — [eSafety: social media age restrictions](https://www.esafety.gov.au/about-us/industry-regulation/social-media-age-restrictions); [Minister's release](https://minister.infrastructure.gov.au/wells/media-release/albanese-government-protecting-kids-social-media-harms)

### Inferences
- **Must-do now (AU):** 18+ self-declaration and a content classification rationale (why prompts are below R18+/class 2). Monitor whether the app stores rate a native version R18+, which would trigger store-level checks.
- **Only if explicit:** class 2 (X18+/R18+-type) content requires age assurance under the Phase 2 codes. Self-declaration alone is unlikely to meet "appropriate age assurance".

### Gaps
- The exact class 2 boundary for *text* sexual content (vs. images) was not verified against the National Classification Code/Guidelines.

---

## 5. Age assurance: India, Brazil, Canada

### Takeaway
- **India:** criminal law (IT Act s.67 obscene, s.67A "sexually explicit act or conduct") rather than AV mandates is the main risk. Non-explicit prompts are far from 67A, but s.67 "obscenity" is vaguer. DPDP Rule 10 requires verifiable parental consent for any user under 18, which effectively forces a strict 18+ policy.
- **Brazil:** ECA Digital (Law 15.211/2025, in force 17 March 2026) bans self-declaration for content "inappropriate or prohibited" for under-18s. This is the strictest regime found, and whether suggestive adult-relationship content counts as "inappropriate for minors" is a live question **[LAWYER — priority]**.
- **Canada:** no federal AV law. Bill S-209 (porn AV) passed the Senate and is in the House.

### Cited Findings
- IT Act s.67A punishes publishing/transmitting material containing "sexually explicit act or conduct": up to 5 years and fine up to ₹10 lakh on first conviction, 7 years on repeat — [itlaw.in](https://www.itlaw.in/section-67a-punishment-for-publishing-or-transmitting-of-material-containing-sexually-explicit-act-etc-in-electronic-form/); [ApniLaw](https://www.apnilaw.com/legal-articles/acts/punishment-under-section-67a-it-act-explained/)
- The Supreme Court quashed an FIR under ss.67/67A against the "College Romance" web series (2024), clarifying obscenity standards for digital media — [CaseMine commentary](https://www.casemine.com/commentary/in/supreme-court-clarifies-obscenity-standards-in-digital-media:-quashing-fir-in-'college-romance'-case/view). The Bombay HC held "sexually explicit" isn't limited to depictions of sexual activity — [LawBeat](https://lawbeat.in/news-updates/sexually-explicit-act-cant-be-restricted-sexual-activity-forwarding-womens-nude-video)
- Brazil Law 15.211/2025 in force 17 March 2026 — [Allende & Brea](https://allende.com/en/privacy-and-cybersecurity/eca-digital-brazil-regulates-the-protection-of-minors-in-digital-environments-04-17-2026/)
- For content/products/services inappropriate or prohibited for under-18s, reliable age verification is required at each access and self-declaration is prohibited. Pornographic platforms must bar minors' account creation — [Baker McKenzie](https://connectontech.bakermckenzie.com/brazil-digital-eca-brazils-child-and-adolescent-statute-a-new-framework-for-online-protection-of-children-and-adolescents-2/); [Trench Rossi Watanabe](https://www.trenchrossi.com/en/legal-alerts/digital-eca-brazils-child-and-adolescent-statute-a-new-framework-for-online-protection-of-children-and-adolescents/); [Verifymy (vendor)](https://verifymy.io/blog/brazil-digital-dca-age-verification-rules/)
- An executive regulation will set minimum requirements for age-verification mechanisms. Details may change — [Trench Rossi Watanabe](https://www.trenchrossi.com/en/legal-alerts/digital-eca-brazils-child-and-adolescent-statute-a-new-framework-for-online-protection-of-children-and-adolescents/)
- Fines up to R$50 million enforced by ANPD — [compliancehub.wiki](https://compliancehub.wiki/brazils-digital-eca-the-worlds-most-comprehensive-child-protection-law-requires-age-verification-on-every-access/) (unverified secondary)
- Canada S-209 (Protecting Young Persons from Exposure to Pornography Act): would make it an offence for commercial sites to give under-18s access to sexually explicit material, with prescribed AV/AE as a defence. Status reported as Senate-passed (15 Apr 2026) and in House second reading or committee (sources conflict) — [openparliament.ca](https://openparliament.ca/bills/45-1/S-209/?tab=mentions); [Reclaim The Net tracker](https://reclaimthenet.org/bill/ca-bill-s209-age-verification); [Didit (vendor)](https://didit.me/blog/age-verification-canada/)

### Inferences
- **India must-do now:** strict 18+ terms. Avoid anything that could be read as "lascivious" in marketing. Tone down launch content for India and consider geo-tailored decks.
- **Brazil:** if counsel deems the app "inappropriate for minors", even non-explicit, then compliant AV (not a checkbox) is required now. Options: geo-gate Brazil at launch, or integrate an AV provider. This is the single biggest "must-do now" uncertainty found.
- **Canada:** only relevant if S-209 passes **and** content becomes "sexually explicit material".

### Gaps
- Brazil: what "inappropriate for minors" means for suggestive text. ANPD/regulation details.
- India: no specific AV mandate found under the IT Rules 2021 for non-explicit content. Not verified whether MeitY advisories (e.g., on OTT obscenity) affect this.

---

## 6. Is an 18+ self-declaration checkbox enough? What do comparable apps do?

### Takeaway
For non-explicit content, self-declaration plus 18+ terms and 17+/18+ store ratings appears to be the industry norm. It is likely acceptable in the UK, US, EU, Australia, India and Canada today. **Brazil is the exception**: self-declaration is banned wherever content is deemed inappropriate for minors. Self-declaration is insufficient everywhere once content is pornographic or explicit.

### Cited Findings
- Comparable couples/sexual-wellness apps on the App Store carry 18+ ratings. Examples: Blueheart ("frequent sexual content and nudity"), Sexy Time ("infrequent mature or suggestive themes"), Lusty, Xplore. Couples Vault states "users must be 18 years or older". Listings show no hard age verification — [Blueheart](https://apps.apple.com/us/app/id1473815579); [Sexy Time](https://apps.apple.com/us/app/-/id6739431246); [Lusty](https://apps.apple.com/app/id6499421777); [Xplore](https://apps.apple.com/app/id6744415156)
- Paired is rated Mature 17+ on Google Play — [Google Play: Paired](https://play.google.com/store/apps/details?id=com.getpaired.app&hl=en_IN)
- Brazil: self-declaration is not a permitted method for under-18-inappropriate content — [Baker McKenzie](https://connectontech.bakermckenzie.com/brazil-digital-eca-brazils-child-and-adolescent-statute-a-new-framework-for-online-protection-of-children-and-adolescents-2/)

### Inferences
- Recommended baseline: a neutral age gate (date of birth rather than a "yes I'm 18" button, which regulators view as leading), 18+ in the ToS, and no child-appealing design. Add server-side flags so you can switch on third-party AV per country (Brazil now; UK/EU/AU/US states if content turns explicit).

### Gaps
- Could not retrieve Coral, Desire, Kindu, Dipsea or Ferly listings or policies. Their age-gating and data practices are unverified. (Dipsea and Coral include explicit audio/erotica, so they may operate under different rules; unconfirmed.)

---

## 7. Privacy of intimate data (GDPR Art. 9, DPDP, US state laws)

### Takeaway
Treat card preferences, "yes/no/curious" taps, and kink/limit settings as **special category data ("data concerning a person's sex life", GDPR Art. 9)**. CJEU case law says data that *indirectly* reveals sex life or sexual orientation counts. The lawful basis is in practice **explicit consent**, plus a DPIA. In the US, Virginia, Colorado, Connecticut and most newer state laws require opt-in consent for sex-life data. CCPA gives a right to limit. Washington's MHMDA may apply if data relates to sexual or reproductive health. India's DPDP Rules phase in duties through May 2027 and need verifiable parental consent for under-18s.

### Cited Findings
- *OT v Vyriausioji tarnybinės etikos komisija* (C-184/20, Aug 2022, Grand Chamber): data that can reveal sexual orientation indirectly, through deduction or comparison, falls under Art. 9(1) — [Wiggin](https://wiggin.eu/insight/court-of-justice-of-european-union-finds-personal-data-that-indirectly-reveals-a-persons-sexual-orientation-falls-within-gdpr-regime-for-protection-of-sensitive-data/); [Trilateral Research](https://trilateralresearch.com/data-protection/landmark-cjeu-judgment-confirms-broad-interpretation-of-special-category-data)
- *Lindenapotheke* (C-21/23, Oct 2024): online pharmacy order data was health data even for non-prescription products, because it could reveal health information — [European Law Blog](https://europeanlawblog.eu/y0sz1qv4/); [Ganado Advocates](https://ganado.com/cjeu-widens-the-scope-of-sensitive-personal-data-under-the-gdpr/)
- Commentators cite the Grindr example: mere registration can imply sexual orientation — [Data Protection Law Hub](https://www.dataprotectionlawhub.com/blog/personal-data-or-inferred-special-category-data)
- Paired (a couples app) treats sexual orientation/health info provided for tailoring as special category data, relies on consent, and lists the California right to limit sensitive PI — [Paired privacy policy](https://www.paired.com/privacy-policy.html). Apple's privacy label for Paired lists data "used to track you" across other companies' apps — [App Store: Paired](https://apps.apple.com/us/app/paired-couples-relationship/id1469609343)
- CCPA treats "sex life or sexual orientation" as sensitive personal information (§1798.140(ae)) with a right to limit. Virginia, Colorado, Connecticut and most newer state laws require opt-in consent — [BCLP](https://www.bclplaw.com/en-US/events-insights-news/sensitive-personal-information-understanding-and-complying-with-the-new-rules-in-the-united-states.html); [Benesch](https://www.beneschlaw.com/insight/privacy-points-2023-different-sensitive-personal-information-rights-requirements-emerge-in-new-us-state-data-protection-laws) (2022-23 commentary; verify current text)
- Washington MHMDA: broad "consumer health data" definition, private right of action, applies to data collected in Washington even from non-residents. The first class action (*Maxwell v. Amazon*, Feb 2025) targeted an ad SDK embedded in third-party apps — [Orrick](https://www.orrick.com/en/Insights/2025/02/First-Lawsuit-Filed-Under-Washingtons-My-Health-My-Data-Act); [HIPAA Journal](https://www.hipaajournal.com/amazon-sdk-privacy-lawsuit-washington-my-health-my-data/); [Proskauer](https://www.proskauer.com/blog/my-health-my-dollar-amazons-health-data-troubles-in-washington)
- India DPDP Rules 2025 notified 13/14 Nov 2025. Consent-manager rule takes effect at 12 months (Nov 2026). Most obligations (Rules 3, 5-16, 22, 23, incl. notice, security, breach, children) take effect at 18 months (~13/14 May 2027). Rule 10 requires verifiable parental consent for under-18s and bans tracking or targeted ads to children — [Shardul Amarchand Mangaldas](https://www.amsshardul.com/insight/enforcement-of-the-dpdp-act-and-notification-of-the-dpdp-rules/); [India Briefing](https://www.india-briefing.com/news/dpdp-rules-2025-india-data-protection-law-compliance-40769.html/)

### Inferences
- **Must-do now (privacy, all markets):**
  1. Classify all preference and response data as sensitive or special category.
  2. Get explicit, granular, withdrawable consent at onboarding (GDPR Art. 9(2)(a); US opt-in states).
  3. Do a DPIA (GDPR Art. 35 is likely triggered by large-scale special category processing) **[LAWYER/DPO]**.
  4. **No third-party ad/analytics SDKs on screens that touch intimate data.** The MHMDA Amazon-SDK suit and FTC precedent (BetterHelp, Flo; not researched here) show this is the top litigation vector. Use self-hosted, aggregate-only analytics.
  5. Data minimisation: match partners' answers on-device or with end-to-end encryption so the server never sees individual "curious" taps. Reveal only mutual matches. Support account deletion that also erases the partner-shared state.
  6. Keep an MHMDA-specific consumer health data privacy policy if any content touches sexual health.
  7. EU representative (Art. 27) and UK representative if not established there.
- Even a pure "kissing only" taxonomy reveals sex-life preferences. Do not rely on "it's just game settings". The CJEU's indirect-revelation test makes that argument weak.
- Paired's model is a reasonable reference pattern: special category plus consent, partner-visible answers, and a deletion right. Its cross-app tracking label is a pattern to *avoid*.

### Gaps
- No EDPB guidance specific to intimacy/sex-life apps found.
- MHMDA application to non-medical "intimacy game" data not tested in case law. *Maxwell v. Amazon* status in 2026 unknown.
- Did not verify the FTC Health Breach Notification Rule (2024 amendment) applicability to such apps.

---

## 8. Required legal pages, cookie consent, accessibility (EAA), trademark

### Takeaway
Minimum launch set:
- Terms of Service (18+, acceptable use, consent-first play rules, governing law)
- Privacy Policy (GDPR/UK GDPR, CCPA "Notice at Collection" + "Limit Use of Sensitive PI", MHMDA Consumer Health Data Privacy Policy, DPDP notice by May 2027)
- Community/consent guidelines (safe-word/skip, no coercion, partner consent)
- Cookie/tracker consent where non-essential storage is used
- Accessibility statement

The European Accessibility Act (in application since 28 June 2025) covers consumer-facing e-commerce and digital services sold to EU consumers. A paid web app likely falls in scope unless you are a microenterprise (fewer than 10 staff and ≤€2M turnover).

### Cited Findings
- EAA applies from 28 June 2025. E-commerce services are expressly in scope, including non-EU businesses selling to EU consumers. Signup and checkout flows count — [Noerr](https://www.noerr.com/en/insights/accessibility-in-e-commerce-new-obligations-for-online-shop-operators-starting-from-june-2025); [BCLP](https://www.bclplaw.com/en-US/events-insights-news/what-is-the-european-accessibility-act-and-what-impact-will-it-have-on-your-business.html); [sota.io](https://sota.io/blog/european-accessibility-act-2019-882-saas-web-app-compliance-guide-2026)
- Microenterprise exemption for services: under 10 employees and ≤€2M — [e-include](https://e-include.eu/web-accessibility/european-accessibility-act/). A claimed 2030 sunset is unverified.
- Technical benchmark: EN 301 549 (WCAG 2.1 AA). One source notes no EAA-harmonised standard is formally cited yet — [Herzog](https://herzoglaw.co.il/wp-content/uploads/2025/06/The-European-Accessibility-Act.pdf); [e-include](https://e-include.eu/web-accessibility/european-accessibility-act/)

### Inferences
- **Must-do now:**
  - Build to WCAG 2.1 AA (ideally 2.2): contrast, keyboard play, screen-reader labels on cards, reduced-motion option for card animations.
  - Publish an accessibility statement. Even as a microenterprise this is cheap insurance and also lowers US ADA web-litigation risk.
- **Cookie consent (unsourced, from general knowledge of the ePrivacy Directive Art. 5(3)):** if you only use strictly necessary storage (session, the user's own on-device answers), no banner is required in the EU/UK. Any analytics or marketing pixel needs prior opt-in. Avoiding them eliminates the banner and the Art. 9 SDK risk together.
- **Trademark/name clearance basics (not researched; general practice):**
  - Run knock-out searches in USPTO, EUIPO eSearch/TMview, UKIPO and WIPO Global Brand Database for Classes 9 (software/apps), 41 (entertainment/games) and possibly 42/44.
  - Check app-store and domain/social handle availability.
  - Get a clearance opinion from a TM attorney before spending on branding.
  - File in the home jurisdiction, then extend via the Madrid Protocol.
  - "Tandem" (the repo name) is a common word with likely existing registrations in Class 9/41 (e.g., the Tandem language-exchange app). This is unverified; a search is needed **[LAWYER]**.

### Gaps
- No primary source fetched on ePrivacy/cookie rules or trademark process. These are flagged as general knowledge.
- EAA application to a free-to-play web game with in-app purchases (vs. "e-commerce service") needs counsel.

---

## Summary matrix (for report writer)

| Jurisdiction | Must-do now (non-explicit) | Triggered only if content becomes explicit |
|---|---|---|
| UK | 18+ gate (self-declaration OK); documented s.236 "not porn" assessment; check whether user-to-user features bring OSA risk-assessment duties | HEAA (Part 5 or Part 3), Ofcom enforcement |
| US | 18+ ToS/gate; opt-in consent for sex-life data (VA/CO/CT etc.), CCPA limit-use notice, MHMDA policy; no ad SDKs; app-store age signals if native (TX/UT/LA; CA from 2027) | State porn-AV laws (≥1/3 harmful-to-minors threshold in TX-type laws) |
| EU | Art. 9 explicit consent + DPIA; EAA accessibility; cookie consent if trackers; check DSA "online platform" status | Age verification expected under Art. 28 guidelines; national regimes (FR, DE) |
| Australia | 18+ gate; classification rationale (below class 2) | Phase 2 codes age assurance (from 9 Mar 2026); app-store R18+ checks |
| India | 18+ policy (DPDP Rule 10 parental consent otherwise); avoid "obscene" (s.67) content; DPDP compliance by May 2027 | IT Act s.67A criminal exposure (effectively do not launch explicit content in India) |
| Brazil | **Lawyer review now**: if deemed "inappropriate for minors", self-declaration banned → real AV or geo-block | Mandatory AV each access; no minor accounts |
| Canada | 18+ gate; PIPEDA/Quebec Law 25 (not researched) | S-209 if enacted |
