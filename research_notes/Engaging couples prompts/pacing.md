# Pacing and replayability for a 12-16 card couples night

Research notes for Tandem After Dark. They cover pacing for one night and freshness over months.

Method: web searches only. Full-page fetches were blocked in this session (en.wikipedia.org and builtin.com do not resolve), so every finding below comes from search-result summaries. Before quoting an exact number, check it against the primary paper. Nothing here is confirmed beyond what the cited pages say.

How the game works now (from `server/game.ts`, for context):
- A night is 12 or 16 cards. `plan()` sets the phases: a warm-up of 3 or 4 cards, a build of 4 or 6 cards that alternates offsets from the ceiling (2,1,2,1...), a peak of 2 or 3 cards at the ceiling, and a cool-down of 3 cards that prefers soft, ungated cards.
- One face-down mystery card is dealt at index `w.length + 2`, which falls early in the build.
- A twist (wildcard up or down) can appear between card 3 and card N-3. It needs a gap of at least 6 cards since the last twist and then fires with probability 0.28 (it is forced when the gap reaches 12). The cool-down start forces a "down" twist.
- After the cards come the closer (`CLOSING`) and the envelope (`ENVELOPES`).
- Repeat avoidance: the `seen` and `last` buffers per level, no two cards in a row on the same topic, and declined cards are parked.

---

## 1. Pacing theory: interest curves, tension and release, the peak-end rule, session length, the rhythm of light and heavy, and where to place surprises

### Takeaway
Plan the night as an interest curve, not a straight ramp: a hook, then rising intensity broken by rest beats, then one clear peak, then a deliberately good ending. Memory of an experience is shaped heavily by its peak and its end, and hardly at all by its length. That is the strongest reason to protect the last few minutes (closer and envelope) and to keep nights short rather than long. Escalating self-disclosure in equal-time stages, over about 45 minutes, is the best-evidenced structure for building closeness between two people.

### Cited Findings
- **The interest curve (Schell).** *The Art of Game Design* has a chapter, "Experiences Can Be Judged by Their Interest Curves". Charting expected interest over the course of an experience makes trouble spots clear. — [Taylor & Francis chapter abstract](https://www.taylorfrancis.com/chapters/mono/10.1201/b22101-16/experiences-judged-interest-curves-jesse-schell)
- The Lens of the Interest Curve asks four things. Does the experience open with a hook? Does interest build steadily, with rest periods? Is there a grand finale? Does your intuition match the curves playtesters draw? — [Lens of the Interest Curve (gitbook of Schell's lenses)](https://gamefroot-developer.gitbooks.io/jesse-schell-the-art-of-game-design-lenses-1-to-1/content/061.html)
- From the same chapter abstract: risk tends to beat safety, the unusual tends to beat the ordinary, and dramatic change, or the potential for it, is always engaging. — [Taylor & Francis](https://www.taylorfrancis.com/chapters/mono/10.1201/b22101-16/experiences-judged-interest-curves-jesse-schell)
- The conventional interest curve has been applied to structuring mobile puzzle levels, each point marking a moment of strong engagement. — [Game Developer: designing levels for mobile puzzle games](https://gamedeveloper.com/design/the-player-s-progress-designing-levels-for-mobile-puzzle-games)
- **The peak-end rule.** People judge an experience largely by how they felt at its peak and at its end, not by the sum or average of every moment. "Duration neglect" is the related finding that length barely matters. — [Wikipedia: Peak-end rule](https://en.wikipedia.org/wiki/Peak%E2%80%93end_rule); [Wikipedia: Duration neglect](https://en.wikipedia.org/wiki/Duration_neglect)
- In the colonoscopy trial, the group whose procedure was extended with a milder ending had more total discomfort but remembered less pain, and more of them came back for follow-up. Secondary summaries cite about 10% less remembered pain and about 10% more return visits. The sources disagree on the trial's details: n=682 vs 628, and 1996 vs 2003 (Redelmeier, Katz & Kahneman). — [Wikipedia: Peak-end rule](https://en.wikipedia.org/wiki/Peak%E2%80%93end_rule)
- **Meta-analysis.** Alaybek et al. (2022), *Organizational Behavior and Human Decision Processes* 170:104149, analysed 174 effect sizes. Some sources say 174 samples; the unit is disputed. The peak-end effect on overall evaluations was large, r ≈ 0.58 (95% CI 0.49-0.66), and robust across boundary conditions. It was comparable to the effect of the overall average, and duration had essentially no effect. — [RePEc/IDEAS listing](https://ideas.repec.org/a/eee/jobhdp/v170y2022ics0749597822000334.html); [GMU defense abstract](https://psychology.gmu.edu/defenses/1259)
- Caveat: because the plain average predicts about as well as peak-end, the whole night still matters, not just the peak and the end. — [Wikipedia summary of the meta-analysis](https://en.wikipedia.org/wiki/Peak%E2%80%93end_rule)
- **Pleasant experiences.** Do, Rupert & Wolford (2008), *Psychonomic Bulletin & Review* 15(1):96-98. People who received better DVDs after worse ones were happier than people who got the same DVDs in reverse order. Children who got one desirable candy were more satisfied than children who got the same candy plus a lesser one, so a weaker item at the end dilutes the memory. — [Psychology Today: "It's all about the ending"](https://www.psychologytoday.com/us/blog/fulfillment-any-age/201209/happiness-it-s-all-about-the-ending)
- **Contradicting evidence.** Mah & Bernstein (2019) found no peak-end rule for *simple* positive experiences in children or adults. They argue that short, simple events may not show the effect. — [Mah & Bernstein 2019 (PDF)](https://www.lifespancognition.com/s/mah2019.pdf)
- Finn (2010) found that adding a better (easier) ending to effortful study made it remembered more favourably and made people more willing to return. — [Psychology Today: Motivating students by ending on a high note](https://www.psychologytoday.com/intl/blog/everybody-is-stupid-except-you/201301/motivating-students-ending-high-note)
- A Psychology Today piece argues that bad endings can spoil otherwise great experiences. — [Psychology Today: How bad endings ruin great experiences](https://psychologytoday.com/au/blog/trust-games/202111/how-bad-endings-ruin-great-experiences)
- **Escalating disclosure (Aron's 36 Questions).** The procedure takes about 45 minutes in person: 15 minutes per set, with each set more probing than the last. Partners alternate who answers first, and move on when the time is up even if a set is unfinished. The time limits give equal time to each level of self-disclosure. — [Greater Good in Action, UC Berkeley](https://ggia.berkeley.edu/practice/36_questions_for_increasing_closeness)
- Set III includes "we" statements and telling the partner what you like about them. Some accounts say the original 1997 study ended with about 4 minutes of silent eye contact; this is lower-reliability and absent from the Greater Good version. — [Greater Good PDF](https://ggia.berkeley.edu/practice/practice_as_pdf/36_questions_for_increasing_closeness); [secondary account](https://youmind.com/landing/x-viral-articles/36-questions-psychology-instant-intimacy)
- **Light and heavy rhythm (escape-room practice).** Alternating intense moments with quieter ones keeps energy up. Avoid long plateaus where players feel stagnant. Stakes should rise to a memorable climax, and some designers write the ending first so it delivers. One designer outlines pacing beats at 10, 25 and 45 minutes. — [Avenue Calgary: Escape Capers](https://www.avenuecalgary.com/Things-to-Do/How-Escape-Capers-Eric-Boudreau-Crafts-Escape-Rooms/); [Sherlocked: how escape rooms are designed](https://www.sherlocked.nl/blog/how-escape-rooms-are-designed); [Medium: Escape rooms, a game design critique](https://medium.com/@varunbajaj/escape-rooms-a-game-design-critique-63abf405e6b8)
- **Warm-ups.** In improv, warm-ups lower the stakes and silence the inner critic, and let people "take more risks" and go deeper later. Trust-focused warm-ups are used specifically before a more vulnerable activity. — [Jimmy Carrane: why warm-up games matter](https://jimmycarrane.com/why-warm-up-games-should-be-part-of-every-improv-class/); [AZ Big Media](https://azbigmedia.com/lifestyle/what-improv-teaches-us-about-confidence-chaos-and-thinking-on-your-feet); [SessionLab: Hot Spot](https://www.sessionlab.com/methods/hot-spot)
- **Jackbox pacing.** The studio's "Jack Principles" include "maintain pacing — limit the user's choices, give them one task at a time", and it borrows timing from TV. One reviewer criticised some Party Pack 8 games as dragging, with poor pacing. — [Built In: Jackbox design principles](https://builtin.com/media-gaming/jackbox-games-design-party-pack); [Pickr review, Party Pack 8](https://www.pickr.com.au/reviews/2021/jackbox-games-party-pack-8/)

### Inferences
- **Session length.** With 15-20 cards, Aron's 45-minute escalation is the only evidence-based benchmark found. Because duration barely affects how a night is remembered, a shorter night that ends well beats a longer one that fizzles.
  - Rough budgets: 12 cards at about 2 minutes each is about 25 minutes, and 16 cards is about 35 minutes. Add 5-8 minutes each for the closer and the envelope, for a total of about 30-45 minutes. That is my estimate, not sourced.
  - Suggested labels: "about 30 min" for 12 cards and "about 45 min" for 16. Keep the 12-card night as the default for weeknights.
- **Map the current `plan()` to Schell's curve.**
  - The hook is the first card. Make card 1 a playful, low-risk "ice-breaker" with an immediate shared laugh, not a talk card that needs reflection (the improv warm-up rationale).
  - The build's alternating offsets (2,1,2,1) already give the "rising with rest periods" sawtooth. Keep them.
  - The peak should be one clear high moment, not a plateau. For 16 cards, consider capping the peak at 2 cards at the ceiling, with the third as a "breath" card one level down before the cool-down. Several cards at the same top intensity become a plateau, which escape-room designers warn against.
- **Cool-down.** Per Do et al., a weak ending dilutes the memory, so the last card before the closer should be warm and connective, not merely a lower-intensity filler. Weight the cool-down toward appreciation, "we" statements and future plans (Aron's Set III). Avoid neutral trivia there.
- **Surprises.**
  - The mystery card currently lands early in the build. That works as a curiosity hook: interest gets a bump just as the ramp starts.
  - A second, smaller surprise in the peak would work, and better still in the cool-down, such as a sealed-answer card as the last card before the closer. An "end" moment would then carry anticipation as well as calm.
  - The twist probability (0.28 per eligible step) means some nights get no "up" twist at all. If wildcards are meant as a signature beat, guarantee one per night, placed between 40% and 70% of the way through, rather than leaving it fully random.
- **Equal-weight consent stays primary.** The peak must stay passable with one tap. A night where a peak card was passed should still feel complete. The closer, not the peak, is the dependable "end" of the peak-end rule, so the design should not lean on the peak always landing.

### Gaps
- No empirical study was found on ideal session length for couples' intimacy games specifically. The 45-minute figure is Aron's lab procedure, not an optimum.
- Full-page fetches were blocked, so the colonoscopy trial details (n, year, effect sizes) could not be checked against the original paper.
- I could not access the full text of Schell's interest-curve chapter, so details such as "a hook at about 10%" come from the lens questions, not chapter text.

---

## 2. Ending rituals: why closings matter, examples from games and therapy, and what makes a good envelope

### Takeaway
The ending is the most reliable lever on how a night is remembered. In facilitation practice, a closing is a designed step with one concrete prompt, a turn for every person and an acknowledgment. Couples-research "rituals of connection" and the We're Not Really Strangers "Final Card" both point to a closing that turns toward each other and leaves something to keep (a written note, a plan). That is exactly what the envelope should be.

### Cited Findings
- **Why closings matter (facilitation).** People are more likely to leave with a positive feeling when a session has a sense of closure: "Endings are important. Take time to acknowledge what you've done together, and say goodbye." — [Activist Handbook: Check-out](https://activisthandbook.org/organising/facilitating/check-out)
- A check-out mirrors the check-in. Each person says where they are leaving from, what they are taking with them, or what they want to do next. — [Workshop Planning Library: Check-in/out](https://workshop-planning-library.pages.dev/card/check-in-out/)
- Practitioner design advice:
  - Ask one concrete question.
  - Do not comment mid-round.
  - Even a fast two-word round beats a rushed wrap-up.
  - A common failure is forgetting the check-out because the session ran long.

  — [Facilitate Better: Winding down](https://facilitatebetter.substack.com/p/winding-down-how-to-better-end-meetings?r=30cgo2); [Facilitation for All: Check-out](https://facilitation-for-all.butter.us/land-on-a-concrete-outcome-check-out)
- Common closing formats: "One Word Checkout", "What / So What / Now What", commitment statements and gratitude rounds. — [Voltage Control: workshop closures](https://voltagecontrol.com/articles/mastering-workshop-closures-techniques-for-lasting-impact/); [SessionLab closing library](https://www.sessionlab.com/library/closing)
- A recovery-support guide lists four elements of good session closure: summarise takeaways, invite final reflections, give next steps, and acknowledge participation. — [Faces & Voices of Recovery: Effective Session Closures (PDF)](https://edu.facesandvoicesofrecovery.org/wp-content/uploads/sites/5/2025/03/Effective-Session-Closures.pdf)
- **Rituals of connection (Gottman).** These are regular, predictable interactions that help partners feel seen and close; shared meaning matters more than the specific activity. They sit at the top of the Sound Relationship House ("shared meaning"). Examples include the six-second kiss and a weekly date. — [Gottman Institute: the little things that keep love strong](https://www.gottman.com/blog/the-little-things-that-keep-love-strong/); [Gottman: 5 rituals to reconnect](https://gottman.com/blog/5-rituals-reconnect-relationship)
- **We're Not Really Strangers.** The game has three levels (perception, connection, reflection) plus a separate "Final Card", set aside at the start. On it each player writes a short message to the other, to be opened separately later. Reviewers say the best part often comes after the final card, when the conversation keeps going. — [WNRS official](https://werenotreallystrangers.com/pages/core-landing-page); [Official Game Rules: WNRS](https://officialgamerules.org/game-rules/were-not-really-strangers/); [Mechanics of Magic: Critical Play WNRS](https://mechanicsofmagic.com/?p=719)
- **Jackbox endings.** The creative director describes the improv "yes, and" roots and final rounds that "put a little button on it" to end on a positive. Quiplash 3's team felt its final round was "missing one final piece: the reveal". — [WFDD/NPR: Jackbox and Second City](https://www.wfdd.org/2025-10-23/how-chicagos-famous-second-city-comedy-club-fueled-blockbuster-party-game-jackbox); [Built In](https://builtin.com/media-gaming/jackbox-games-design-party-pack)
- **Escape rooms.** Rising stakes should build to a memorable climax, and designers often start from the ending. Course templates ask whether "the ending was clear and satisfying". — [Sherlocked](https://www.sherlocked.nl/blog/how-escape-rooms-are-designed); [CTU course template](https://courses.fit.cvut.cz/NI-ESC/Templates/game-report.html)
- **Aron's Set III** ends on appreciation ("tell your partner what you like about them") and "we" statements. — [Greater Good in Action](https://ggia.berkeley.edu/practice/36_questions_for_increasing_closeness)

### Inferences
**A three-beat closing**, mapped onto facilitation and Gottman:
1. **Look back.** "What So What": one appreciation each, prompted concretely ("one moment tonight you'll remember"). Keep it a single question with no mid-round commentary, per facilitation advice.
2. **Turn toward each other.** A small physical or verbal "button" when together (a hug, a slow kiss, eye contact for 30 seconds). When apart, a spoken line or a gesture on video.
3. **Look forward ("Now What").** The envelope.

**What makes a good envelope** (inferred from WNRS, Gottman and the peak-end findings):
- It is the last thing in the night, and it is a reveal: something both sides contributed to, opened at the same moment. The current countdown-then-open does this.
- It gives a take-away that lives past tonight: a small plan or ritual ("this week, one of you plans a 20-minute walk"), a callback seed for next night, or a line to say tomorrow morning. The WNRS "message to open later" shows that deferred opening extends the night's afterglow.
- Its tone is warm and low-pressure. It must never be a task with a deadline (rules 4 and 7: no countdown pressure, no guilt).
- It ends higher than the cool-down. Per Do et al., it should not be weaker than what came before, so the envelope should feel like a small gift and not a chore.
- It is private by construction. If the envelope draws on sealed answers or level picks, it may reveal only derived outcomes (rule 1).

**Optional deferred note.** Each partner could write one sealed line at the closer that the other unlocks on the phone the next morning. The same privacy rules would apply: shown only to the recipient, never stored on the server after delivery. This copies the WNRS final card.

Keep the closer short. The facilitation failure mode is running long and skipping the close. The closer must never be skippable as a side effect of the night overrunning, and should stay about 2-5 minutes.

### Gaps
- I found no controlled study of check-out rituals improving outcomes. The facilitation evidence is practitioner consensus.
- I found no Gottman primary paper in these results. The ritual claims come from Gottman Institute blog posts.
- Therapy-specific "session ending" research (for example, emotion-focused or Gottman-method session closure) was not found in the time available.

---

## 3. Replayability: variable rewards without manipulation, novelty, callbacks, unlockables, seasonal events, daily micro-prompts, and avoiding dark patterns and streaks

### Takeaway
Novelty is not just a retention trick for couples. Shared novel, exciting activities are linked to higher relationship satisfaction (self-expansion research), so freshness is aligned with the product's purpose. Streaks work by loss aversion and anxiety, which the project already bans. Freshness should come from content variety, structural variation from night to night, callbacks and seasonal decks, never from penalties for absence.

### Cited Findings
- **Self-expansion.** Aron et al. (2000), *JPSP* 78:273-284: couples who did novel, arousing activities together reported higher relationship quality than couples who did pleasant but mundane activities, or none. — [PsyBlog summary](https://www.spring.org.uk/?p=104469); [Anatomy of Love summary](https://theanatomyoflove.com/?p=120)
- A 2020 daily-diary study of 122 couples over 3 weeks linked self-expansion to daily satisfaction, partly through how often they did novel, exciting activities together. — [Journal of Social and Personal Relationships, 2020](https://journals.sagepub.com/doi/10.1177/0265407520911202)
- In 97 couples dealing with low sexual desire, higher self-expansion was associated with greater relationship and sexual satisfaction for both partners. — [JSPR, 2019](https://journals.sagepub.com/doi/10.1177/0265407519875217)
- A 2015 experiment found that in long-term couples (14-60 months), actively supporting a partner's self-expanding opportunity raised satisfaction more than passively going along. — [JSPR, 2015](https://journals.sagepub.com/doi/10.1177/0265407514533767)
- **Contradicting evidence.** A small replication with 23 couples (laser tag) found satisfaction rose, but the love and self-expansion measures did not change. — [Indiana State thesis](https://scholars.indianastate.edu/etds/1026)
- **Streaks.** Duolingo's streak is described as working through loss aversion rather than positive motivation. Critics say it measures opening the app, not learning, and that guilt cues such as the sad mascot are dark patterns. Defenders say streaks build habits. One critique argues the core flaw is treating a missed day as catastrophic. — [DEV: why Duolingo's gamification works and when it doesn't](https://dev.to/pocket_linguist/why-duolingos-gamification-works-and-when-it-doesnt-1d4); [Mobbin: a study of 859 streak designs](https://mobbin.com/blog/streaks-are-about-losing-a-study-of-859-streak-designs); [Screenwise parent guide](https://screenwiseapp.com/guides/managing-duolingo-streaks-when-gamification-becomes-stressful); [Medium: A losing streak](https://medium.com/letter-from-taro/a-losing-streak-c72eeedf5c93)
- **Gottman rituals** are regular and predictable, and their value lies in shared meaning. This suggests a healthy cadence such as a weekly "our night", not a daily obligation. — [Gottman Institute](https://www.gottman.com/blog/the-little-things-that-keep-love-strong/)
- **Rewards in The Mind.** Two players attempt 12 levels. Lives and shurikens are earned after specific levels (2, 3, 5, 6, 8, 9). Progress gives occasional, predictable resource rewards rather than random loot. — [Wikipedia: The Mind](https://en.wikipedia.org/wiki/The_Mind_(card_game)); [Zatu review](https://zatu.com/the-mind-review/)
- **Campaign in Codenames Duet.** A campaign "mission map" with difficulty levels gives a two-player cooperative game a long arc across sessions. — [Opinionated Gamers review](https://opinionatedgamers.com/2017/09/04/codenames-duet-game-review-by-chris-wray/); [Brain Games listing](https://www.brain-games.lv/en/products/codenames-duet)
- **Variation in Where Should We Begin.** The 2nd edition adds dice "for endless variations" and offers "rapid play" instructions. Players pick from 7 randomly dealt prompts, so choice is constrained but fresh. — [Esther Perel game store](https://game.estherperel.com/products/where-should-we-begin-a-game-of-stories-2nd-edition); [Study Breaks review](https://studybreaks.com/thoughts/game-review-where-should-we-begin)

### Inferences
**Freshness without manipulation:**
1. **Structural variety from night to night**, not just new cards. Use a small set of "night shapes", picked at random or chosen on the map:
   - the classic ramp
   - "slow burn" (a longer warm-up and one peak card)
   - "two-hump" (a mini-peak mid-build, a rest, then the peak)
   - "story night" (the talk cards share a theme)

   This varies the interest curve itself, which Schell's lens says is what players actually feel. All shapes keep the warm-up and the closer fixed.
2. **Predictable rewards over random ones.** The Mind-style "after night 3, 6, 10..." gifts (a new closer pool, a new envelope type, a new art pattern) feel earned without gambling dynamics. Randomness belongs *inside* the night (which card, the mystery, the twist), where it creates play. It does not belong in which rewards you get, where it creates compulsion.
3. **Callbacks** are the cheapest novelty that deepens meaning:
   - "Last time you both chose Level 3; tonight starts one step softer" (derived and non-private).
   - Reuse of the shared question picked for the share card.
   - A warm-up card that refers to "the last thing you laughed about together".
   - Constraint: callbacks may only use data already on the phones and already non-private under rules 1 and 9. Never use curious taps or vote history.
4. **Seasonal or limited-time decks** (winter, anniversary, a "first warm night" in spring) should never come with countdowns. Offering a new deck without "ends in 3 days!" copy is compatible with rules 4 and 7. Pass decks can rotate a "deck of the month" into the existing levels, adding depth, not access.
5. **Daily micro-prompts.** Gottman frames rituals as regular. A gentle, opt-in, between-nights prompt could feed the next night's warm-up, for example "send your partner one thing you noticed about them today".
   - No counts, no streaks, no notification guilt.
   - Skipping it must leave no trace (no "you missed 4 days").
   - This touches the no-account and no-database rules, so it must stay entirely on the phones.
6. **Cadence framing.** Frame play as "our night", weekly or whenever. Do not frame it daily. The map can show the night count (as it already does for share cards) without ever showing gaps.
7. **Content depth.** For freshness over months, the deck per level should outlast a weekly couple for about 3 months before the `seen` buffer resets.
   - At about 4-6 cards per level per night, roughly 50-80 cards per level gets there.
   - This is my estimate from the slot plan; check it against `TOTAL_CARDS` and the actual decks.
8. **Variation in two-player turns.** Alternate who reads first, as Aron does for each question. Some cards could name "whoever went first last time", which spreads the vulnerability evenly. Keep it neutral about gender and anatomy (rule 2).

### Gaps
- I found no peer-reviewed study on retention mechanics specifically for couples' apps or games.
- I found no data on how often couples replay conversation card games or when they churn.
- The "variable reward" literature (Skinner, Eyal's Hooked) was not searched in depth. The recommendation to keep randomness inside the night rather than in rewards is a design inference.

---

## 4. Two-player and social game examples with great pacing, and lessons for turn structure and wildcards

### Takeaway
The best short social games share a few traits: one task at a time, a clearly marked final round with a reveal, shared stakes (win or lose together) and a small, scarce "escape hatch" resource. For Tandem, wildcards should behave like The Mind's shurikens: rare, cooperative and meaningful. Mystery cards and sealed answers are Jackbox-style "reveals" that work best near the end of an arc.

### Cited Findings
- **Jackbox.** "Maintain pacing — limit the user's choices, give them one task at a time", with TV-style timing. — [Built In](https://builtin.com/media-gaming/jackbox-games-design-party-pack)
- Jackbox final rounds are revisited deliberately: Quiplash 3's new final round lacked "the reveal" until the team added it, and Tee.K.O.'s final round was redone to feel "a little more fair". Endings "put a little button on it" to close positively. — [Built In](https://builtin.com/media-gaming/jackbox-games-design-party-pack); [Player2: Party Pack 10 interview](https://www.player2.net.au/2023/10/the-jackbox-party-pack-10-the-pax-aus-interview/); [WFDD/NPR](https://www.wfdd.org/2025-10-23/how-chicagos-famous-second-city-comedy-club-fueled-blockbuster-party-game-jackbox)
- **The Mind.** Two players cooperate without talking across 12 levels. A shuriken (a wildcard) needs *all* players to agree and makes everyone discard their lowest card. Rewards come after fixed levels. — [Wikipedia: The Mind](https://en.wikipedia.org/wiki/The_Mind_(card_game)); [board-game.co.uk review](https://www.board-game.co.uk/the-mind-review/)
- **Codenames Duet.** Fully cooperative (win or lose together) with a limited number of turns. Timer tokens set the length, and a campaign map adds a multi-session arc. — [Opinionated Gamers](https://opinionatedgamers.com/2017/09/04/codenames-duet-game-review-by-chris-wray/); [Miniature Market review](https://miniaturemarket.com/reviewcorner/codenames-duet-review)
- **We're Not Really Strangers.** Three escalating levels (perception, connection, reflection), wildcards mixed into the deck, and a final card set aside from the start. — [Mechanics of Magic](https://mechanicsofmagic.com/?p=719); [WNRS official](https://werenotreallystrangers.com/pages/core-landing-page)
- **Where Should We Begin.** Choosing from a hand of 7 dealt prompts, and a simplified mode for a first or casual night. — [Study Breaks](https://studybreaks.com/thoughts/game-review-where-should-we-begin); [Official Game Rules](https://officialgamerules.org/game-rules/where-should-we-begin/)
- **Escape rooms.** A clear flow from one clue to the next, alternating intensity and quiet, and no long plateaus. — [Sherlocked](https://www.sherlocked.nl/blog/how-escape-rooms-are-designed); [Game Developer: lessons from escape rooms](https://gamedeveloper.com/design/video-game-design-lessons-you-can-learn-from-studying-escape-rooms)
- **Improv warm-ups.** Short, playful and low-stakes; the "yes, and" habit; they build ensemble trust before vulnerability. — [AZ Big Media](https://azbigmedia.com/lifestyle/what-improv-teaches-us-about-confidence-chaos-and-thinking-on-your-feet); [improv.ca warm-ups](https://improv.ca/warm-ups/)
- **Aron.** Alternate who answers first on each question, and keep equal time per depth level. — [Greater Good in Action](https://ggia.berkeley.edu/practice/36_questions_for_increasing_closeness)

### Inferences
Specific recommendations for the 12-16 card night:

**Turn structure**
- Alternate "who goes first" on each card, as Aron does, and show it with the partner's glyph (rule 3: never colour alone).
- Give one task per screen, as Jackbox does.
- Keep Pass and Next identical and side by side (rule 4). The Mind and Jackbox both show that a single, clear action per moment keeps rhythm.

**Wildcards (twists)**
- Make them feel like shurikens: rare (at most one or two per night), legible, and ideally *jointly accepted*. A twist-up could be framed as an offer both phones privately accept, reusing the yes/maybe/not-tonight machinery so that a decline reveals nothing (rule 1). Twist-downs (a rest beat) should apply automatically, because softening never needs consent.
- Guarantee at most one "up" and, on 16-card nights, one "down" rest beat. The current random 0.28 can produce a night with none, which flattens the curve. It can also produce an "up" twist right before the cool-down, which fights the arc.

**Mystery cards**
- Keep one per night. Its position could vary by night shape: early build as a hook (now), or the first peak card as the climax reveal.
- The mutual flip, where both must tap, is a good Jackbox-style reveal. Use the same reveal cue whether the card was kept or swapped (rule 5).

**Sealed answers**
- Best placed on 1-2 talk cards in the build and cool-down, such as a guess about the partner or a "finish the sentence" card. The simultaneous unseal is a mini peak.
- One sealed card in the cool-down, just before the closer, gives the "end" a reveal. That is the Quiplash "missing reveal" lesson.

**Warm-up**
- The first 2-3 cards should be playful and fast, with no gated cards (already enforced), so the first laugh comes within about 2 minutes.

**Peak**
- Make the peak one distinct summit rather than a plateau: one ceiling card, optionally preceded by one at ceiling minus one. On 16-card nights, insert a single breath card between peak cards.

**Cool-down to closer to envelope**
- Cool-down cards should rise in *warmth* even as intensity falls: appreciation, "we" statements, a plan. The closer is one concrete look-back question and one physical or verbal "button". The envelope is the final reveal plus a take-away.
- Nothing after the envelope except the optional share opt-in. Shop links appear after the envelope only (rule 11), and they should sit visually below and separate from the emotional end so they do not become the remembered "end".

**Long-term arc** (like the Codenames Duet campaign)
- The map is the campaign. Milestones (night 3, 7, 12...) give new closers, envelopes and night shapes as predictable gifts, never paywalled levels (rule 7) and never with streak counters (rule 4).

### Gaps
- I found no published pacing data (minutes per card, drop-off points) for We're Not Really Strangers, Where Should We Begin or other conversation decks.
- I found no first-party Jackbox design talk text. The quotes come from press interviews, and the Built In page could not be fetched directly.
- I found no research on wildcards or surprise placement specifically in intimacy or conversation games. The placement recommendations are inferred from interest-curve and peak-end theory.
- I did not research date-night subscription boxes (for example, pacing inside a boxed date) in the time available.
