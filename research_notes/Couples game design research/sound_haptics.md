# Sound, Music and Haptics for a Two-Phone Couples Intimacy Game (as of Nov 2026)

Scope note: Builds on earlier findings (Vibration API works on Android Chrome, not iOS Safari; iOS needs a user gesture before audio; music alone has modest arousal effects, music plus narrative works better). Research method limits: in this session, direct page fetches to developer.spotify.com, uppbeat.io and pixabay.com were blocked by the network sandbox. Findings for those come from search-result excerpts of the official pages (Spotify Developer Policy, Pixabay Terms) or secondary sources, and are flagged where relevant. Items under "Inferences" are design recommendations derived from the cited findings. They are not sourced facts.

## 1. Music for mood: tempo, mode, genre, Gen Z listening and regional tastes

### Takeaway
Tempo mainly drives arousal and mode (major/minor) mainly drives valence. The two effects are strongest when they agree (fast+major = playful/happy, slow+major = warm/tender, slow+minor = melancholy). Slow (~60-80 BPM), soft music is the standard "relaxing" stimulus, but its effect on heart rate is inconsistent. Its effect on self-reported calm is more reliable. Gen Z uses music as a relationship signal and builds hyper-specific mood playlists, so "mood rooms" plus "bring your own music" matches how they already behave.

### Cited Findings
**Tempo, mode, arousal, valence**
- Husain, Thompson & Schellenberg (2002): tempo manipulations changed arousal but not mood. Mode manipulations changed mood but not arousal. — [Husain et al. 2002 (PDF)](https://sites.utm.utoronto.ca/sites/sites.utm.utoronto.ca.glenn_website/files/download/Husain.pdf)
- Reviews say tempo is generally assumed to affect arousal more than valence, and mode to affect valence more than arousal. The effect is stronger when the cues converge (major+fast, minor+slow). When they conflict, tempo dominates. — [Morreale, "Effect of Expertise in Evaluating Emotions in Music" (JYU)](https://jyx.jyu.fi/bitstream/123456789/41594/1/Fabio%20Morreale%20-%20The%20Effect%20Of%20Expertise%20In%20Evaluating%20Emotions%20In%20Music.pdf)
- Tempo is not purely an arousal cue. One study found tempo positively affected both valence and arousal. — [Stellenbosch thesis, Baroque vs modern music](https://scholar.sun.ac.za/handle/10019.1/108183?show=full)
- A 2025 multilevel meta-analysis (59 studies, exercise context) found music raised both valence and arousal, and tempo moderated both. Its scope is exercise, not general listening. — [PubMed 41395737](https://pubmed.ncbi.nlm.nih.gov/41395737/)

**Slow and relaxing music: physiological evidence is mixed**
- A *Radiography* meta-analysis of music during imaging (13 studies, only 4 pooled for HR and anxiety) found that the chosen music was typically slow, about 60-80 BPM. Post-procedure anxiety and heart rate fell in the music groups, with no significant change in blood pressure or breathing rate. The authors could not identify a best genre or tempo. "Slower, softer, relaxing music" seemed appropriate. Ambient sounds had a similar effect to music. Patient-chosen playlists were not favoured. — [AuntMinnie Europe](https://www.auntminnieeurope.com/medical-legal-and-practice/patient-safety/article/15663950/team-lisbon-elaborates-on-how-music-calms-troubled-minds); [Radiology Business](https://radiologybusiness.com/topics/medical-imaging/magnetic-resonance-imaging-mri/music-interventions-mri-study-anxiety)
- A*STAR (2015): sedative music reduced self-reported math anxiety, but heart rate did not change. The source calls "60-80 BPM heartbeat entrainment" a theory. — [A*STAR Research](https://research.a-star.edu.sg/articles/highlights/counting-in-adagio/)
- A 2012 nursing thesis using 60-80 BPM music before exams found no effect on anxiety or pulse. — [Gardner-Webb](https://digitalcommons.gardner-webb.edu/nursing_etd/115)
- Marconi Union's "Weightless" starts at about 60 BPM and slows to about 50 BPM. Its anxiety claims rest on small studies. — [Psychiatrist.com](https://www.psychiatrist.com/news/worlds-most-relaxing-song-may-reduce-anxiety-by-65)

**Gen Z, dating and playlists (Spotify)**
- Spotify Culture Next (2024 edition; I found no 2025 global edition): Gen Z uses shared or collaborative playlists and Blend to build community. Listeners streamed 86M minutes of playlists with "first" in the title (first kiss, first date). Top daylist words included "make out" and "sleepover". In ANZ, 74% of Gen Z said brands that make playlists for specific moods feel more in tune with their lives. — [Spotify Ads Culture Next 2024](https://ads.spotify.com/en-CA/culture-next/gen-z-trends-report/); [Mediaweek AU](https://mediaweek.com.au/spotify-deep-dives-into-what-gen-z-wants-with-its-new-culture-next-report)
- About 80% of Gen Z reportedly prioritise music compatibility in a potential partner over looks. An Indian write-up gives 89%. The figures conflict and I could not verify the original. — [ETV Bharat](https://etvbharat.com/en/!lifestyle/80-percent-gen-z-considers-music-compatibility-dating-finds-new-spotify-report-enn24103003608)
- Gen Z builds hyper-specific mood playlists as part of "romanticising your life". — [killthedj](https://killthedj.com/gen-zs-use-spotify-to-nurture-connection-not-just-stream-songs)

**Regional (India)**
- India Wrapped 2025: Bollywood's "Raanjhan" was the top song (246M streams). Arijit Singh was the #1 artist, then Pritam and Shreya Ghoshal. I-Pop (non-film) made up half of the year-end top 10. — [Rolling Stone India](https://rollingstoneindia.com/spotify-wrapped-india-2025-most-streamed-artists-songs-albums); [Spotify newsroom (Bollywood tag)](https://newsroom.spotify.com/tag/bollywood)
- Hot Hits Hindi and Bollywood Dance Music are the #1 and #2 playlists among Indian Gen Z (Culture Next). — [afaqs](https://afaqs.com/news/advertising/49-of-indian-gen-z-prefer-brands-sponsoring-live-music-events-spotify-7368451)
- On Gaana, pop was the fastest-growing genre in 2025 (+48%), driven by Gen Z. — [Loudest.in](https://loudest.in/authored-article/gaana-recap-2025-truefans-and-regional-music-power-indias-streaming-economy-18904.html)

### Inferences
- **Mood-to-music spec (recommended):**
  - *Relaxed / "warm-up" (conversation levels):* 60-80 BPM, major or modal, soft dynamics, no vocals or wordless vocals. Lo-fi hip-hop at 70-85 BPM, ambient pads, bossa nova at a slow ~60-70 BPM half-time feel. Ambient beds are acceptable here (the imaging meta-analysis found ambient sound worked about as well as music).
  - *Romantic / tender (deeper-question and flirty levels):* 65-90 BPM, major-7th and 9th neo-soul/R&B harmony, warm Rhodes and bass, slow swing. Slow jazz ballads and K-R&B-style production fit here. Avoid strong minor-key melancholy, which lowers valence.
  - *Playful (dares, mini-games, celebration):* 100-120 BPM, major, bouncy plucked or marimba timbres, light percussion. Fast+major convergence gives the clearest "happy" signal.
  - *Suggestive levels:* do not escalate tempo. Keep 70-90 BPM with a deeper low end and slower harmonic rhythm. Arousal here should come from the content and the partner, not the soundtrack, consistent with the earlier finding that music plus narrative beats music alone.
- Keep music instrumental by default. Lyrics compete with spoken conversation, which is the core activity.
- Default music to **off or a very low ambient bed (opt-in)**. Couples' own playlists matter a lot to Gen Z, so "bring your own playlist" is likely to be valued more than in-app tracks.
- Regional packs (Hindi lo-fi or "Bollywood chill", K-R&B, LatAm bossa/bolero/reggaeton-lite) are best handled as curated deep-link playlists on the user's own streaming service, not licensed in-app audio.

### Gaps
- No pooled meta-analytic effect size isolating tempo and mode on arousal and valence turned up (only reviews and single experiments).
- No Spotify 2025 global Culture Next Gen Z report found. No public Spotify data located on "date night" or "bedroom" playlist volumes, K-R&B or LatAm romantic listening.
- No streaming numbers found for Hindi lo-fi or slowed+reverb romantic edits. One curator playlist ("lofi bollywood chill", about 14k followers) is a weak signal only. — [playlistsupply](https://playlistsupply.com/playlistcurator/playlist/1AhRFYCjsvRUkJk6jN5lqn/)

## 2. Licensing paths: royalty-free libraries, commissioning, AI music, Spotify/Apple integration

### Takeaway
Embedding streaming-service audio inside a game is effectively closed. Spotify's policy bans syncing recordings with visual media, requires Premium for full streams, and its 2025-26 quota rules shut out small developers. Pixabay bans "standalone" redistribution, which bundling in an app likely triggers. Creator-oriented subscriptions (Epidemic, Artlist, Uppbeat) are built for video and need higher tiers or custom deals for games and apps. The cleanest paths are: (a) commission or buy-out a small original score plus SFX, synthesized or recorded; (b) "bring your own playlist" deep links. AI music carries live legal risk.

### Cited Findings
**Spotify**
- The Spotify Developer Policy prohibits synchronizing sound recordings with visual media ("advertising, film, television program, slideshow, video, or similar content"). Full-track streaming via the platform is only for Premium subscribers. Free users can get widgets and previews where offered. — [Spotify Developer Policy](https://developer.spotify.com/policy/)
- Community answers (not Spotify staff) say games, including trivia, are not allowed on the Spotify API, and that commercial use is restricted. Weaker evidence. — [Spotify Community](https://community.spotify.com/t5/Spotify-for-Developers/New-Enpoint-Request/m-p/6854191)
- Since May 15, 2025, extended Web API access is reserved for apps with "established, scalable, and impactful use cases". Applications come only from organizations, not individuals. Community and third-party sources cite a bar of a registered business, a launched service and at least 250k MAU. — [Spotify Developer Blog, 2025-04-15](https://developer.spotify.com/blog/2025-04-15-updating-the-criteria-for-web-api-extended-access); [Spotify quota modes](https://developer.spotify.com/documentation/web-api/concepts/quota-modes)
- In 2026, Development Mode began requiring the developer to have Premium, with fewer test users and one Client ID per developer. A later report of a cap of 25 Client IDs is unverified. — [TechCrunch](https://techcrunch.com/?p=3090291); [Spotify Community Feb 2026 thread](https://community.spotify.com/t5/Spotify-for-Developers/February-2026-Spotify-for-Developers-update-thread/m-p/7368832/highlight/true)

**Royalty-free libraries**
- Pixabay: commercial use is allowed, but "you cannot sell or distribute the Content … on a Standalone basis". Use in original form still counts as standalone. Older licence text lists "music files" as prohibited standalone distribution. Content published before 9 Jan 2019 is CC0. — [Pixabay Terms](https://pixabay.com/en/service/terms/); [Pixabay License Summary](https://pixabay.com/en/service/license/); [ScanCode LicenseDB](https://scancode-licensedb.aboutcode.org/pixabay-content.html)
- Epidemic Sound: comparison sites say games, TV and film require Enterprise or higher tiers (sources conflict on which tier). Its licence restricts use in commercial products "where music is the primary focus". — [Photutorial](https://photutorial.com/artlist-vs-epidemic-sound); [Wyzowl](https://wyzowl.com/artlist-vs-epidemic-sound/)
- Uppbeat: downloads, including free ones, cover social platforms (YouTube, TikTok, Instagram). Publishing new content requires an active subscription. No app or game coverage found. — [Uppbeat blog](https://fastly-f.uppbeat.io/blog/royalty-free-and-copyright-free-music/uppbeat-vs-epidemic-sound-how-do-they-compare)
- Artlist: no source found on app or game embedding.

**AI music (Suno, Udio) status 2026**
- UMG settled with Udio (Oct 29, 2025). Warner settled with Udio (Nov 2025) and with Suno (Nov 25, 2025). Under these deals, Udio moved to a walled-garden platform that restricts export. — [Winbuzzer](https://winbuzzer.com/2025/11/20/warner-music-group-and-udio-settle-copyright-lawsuit-as-suno-raises-250m-to-fight-on-xcxwbn/); [Music Business Worldwide](https://www.musicbusinessworldwide.com/warner-music-group-settles-with-suno-strikes-first-of-its-kind-deal-with-ai-song-generator/); [Dubspot 2026 explainer](https://blog.dubspot.com/ai-music-licensing-explained-2026)
- Suno launched v6 on Sep 9, 2026, trained on Warner, BMG and Believe-licensed music, and retired all earlier models. Free-tier songs are not downloadable. Paid tiers have monthly download caps. — [The Next Web](https://thenextweb.com/news/suno-v6-warner-bmg-believe-licensed-models); [ProPakistani](https://propakistani.pk/2026/09/10/suno-launches-licensed-ai-music-models-after-warner-copyright-settlement/)
- Sony and UMG reportedly filed a new suit against Suno (Sep 18, 2026), alleging v6 was trained on old-model outputs. GEMA and Koda claims are pending. This comes from a single foreign-language report. — [pasqualepillitteri.it](https://pasqualepillitteri.it/pl/news/17682/suno-v6-licencja-muzyka-ai)
- Suno commercial rights require Pro or Premier. Udio commercial terms are reported inconsistently. — [Dubspot](https://blog.dubspot.com/ai-music-licensing-explained-2026)

### Inferences
- **Recommended path:**
  1. Commission about 6-10 short loopable instrumental beds (2-3 min each, one per mood or level), work-for-hire or buy-out with explicit app/game sync rights.
  2. Synthesize all UI SFX in Web Audio, which removes licensing for SFX entirely.
  3. Offer "bring your own music" as deep links (open Spotify, Apple Music or YouTube Music playlist URLs or app links in the other app), with curated mood playlists per region. This creates no sync, no SDK and no quota dependency, and the couple's own music app plays alongside the game.
- Avoid the Spotify Web Playback SDK. Premium is required for every listener, the sync-with-visual-media clause plausibly covers an animated game, and extended quota needs 250k MAU and organization status.
- Treat AI-generated tracks as higher legal risk until the Suno v6 litigation resolves. If used, keep paid-tier generation records and avoid AI vocals.

### Gaps
- Could not read the official Uppbeat, Epidemic Sound or Artlist licence pages (fetch blocked or not found). App/game coverage for these is unverified. Check directly or ask for a custom licence.
- Could not read the full Spotify Developer Terms text on games. The game prohibition is a community claim.
- Apple MusicKit JS terms for games not researched.
- No outcome found for the Sony fair-use ruling expected mid-2026.

## 3. UI sound design: principles, loudness, duration, synthesis, exemplars

### Takeaway
There is no official UI loudness standard (no Apple or Google LUFS target for UI). Practitioner guidance converges on very short sounds (taps 30-150 ms, notifications 200-500 ms), a relative loudness hierarchy (feedback below notifications, celebrations rare), sound never as the sole carrier of information, and co-design with haptics and animation. Monument Valley's model of treating music and interaction sounds as one musical system is the best-fit exemplar for a calm, intimate tone.

### Cited Findings
- Durations from practitioner guides: taps and clicks 30-150 ms, notifications up to about 500 ms. Feedback 50-150 ms, notifications 200-500 ms. Soft cues are often under 300 ms. — [Violet Recording](https://violetrecording.com/how-to-design-ui-sounds/); [creatorsoundspro](https://creatorsoundspro.com/the-art-of-soft-ui-sounds-how-subtle-notification-audio-shapes-modern-apps-games); [IRPR Sound](https://sounddesign.irpr.agency/guides/what-is-ui-sound-design/)
- Relative-level scheme: alerts +3 dB, notifications 0 dB baseline, feedback -6 dB, ambient -12 dB. Measure the integrated LUFS of each sound. Frequent sounds should sit below rare ones. Sound should never be the only carrier of essential information. — [creatorsoundspro reference tables](https://creatorsoundspro.com/the-game-designer-reference-library-audio-reference-tables); [Medium: pleasant notification sound](https://medium.com/@fivepointseven/how-to-design-a-pleasant-alert-sound-2ddf7a9724de)
- No Apple or Google UI-specific LUFS target was found. An Apple Developer Forums question on notification loudness went unanswered. Streaming references: YouTube about -13/-14 LUFS, Twitch -14. — [Apple Dev Forums](https://developer.apple.com/forums/thread/703142); [Google Assistant audio loudness](https://developers.google.com/assistant/tools/audio-loudness?hl=de)
- Android guidance: co-design visual, audio and haptic effects, and be mindful of frequency of use and importance. — [Android haptics principles](https://developer.android.com/develop/ui/views/haptics/haptics-principles)
- Monument Valley 2: composer Todd Baker treated music and sound design as one "complete interactive audio experience", with interactive elements that chime when swiped or tapped. The team used Wwise for dynamic implementation. — [Audiokinetic / A Sound Effect](https://audiokinetic.com/en/blog/behind-the-beautiful-sound-of-monument-valley-2-with-todd-baker)
- Monument Valley 3 uses granular synthesis and virtual instruments that react to player movement ("the architecture becomes a musical entity"). Baker described MV2's music as trying to create "the sound of a really warm hug". — [Xbox Wire 2025](https://news.xbox.com/en-us/2025/07/18/how-monument-valley-3-uses-soundscapes-to-tell-its-story/); [Guardian via PressReader](https://www.pressreader.com/usa/the-guardian-usa/20240420/282179361136165)
- Duolingo: no official sound-team interview found. It acquired NextBeat in 2025, bringing in sound design and music-licensing staff. Third-party sources describe bells and cheers for correct answers and gentle error sounds. — [Mobidictum](https://mobidictum.com/duolingo-acquires-nextbeat/); [soundcy (non-official)](https://soundcy.com/article/what-does-duolingo-sound-like)

### Inferences
- **UI sound spec (recommended), all synthesized in Web Audio** (sine or triangle oscillators plus a lowpass filter at about 2-4 kHz and soft attack/release envelopes; no samples needed, which saves weight and licensing):

  | Event | Sound | Duration | Level (relative to music bed) | Frequency |
  |---|---|---|---|---|
  | Button tap / select | soft "tick", filtered sine ~800-1200 Hz, 5 ms attack | 40-80 ms | -12 to -18 dB | often, so quietest |
  | Card flip | airy noise swish (bandpassed noise sweep) + tiny pluck | 150-250 ms | -10 dB | per card |
  | Card reveal | two-note rising major 3rd or 5th, marimba/kalimba-like (e.g., C5 to E5), tuned to the music key | 300-500 ms | -6 dB | per round |
  | Countdown tick | low woodblock or heartbeat-like soft thump, 60-80 per min | 60-100 ms each | -10 dB | only on timed dares |
  | Partner-ready / both-agreed | warm two-voice chord (both phones each play one note, so they harmonise) | 400-700 ms | -6 dB | consent moments |
  | Level-up / celebration | short 3-4 note arpeggio + shimmer, never a fanfare | 0.8-1.5 s | 0 dB (loudest, rarest) | rare |
  | Safeword / pause / "skip" | neutral descending soft tone, never a buzzer or "wrong" sound | 200-300 ms | -10 dB | must feel non-judgmental |

- Avoid harsh frequencies (2.5-5 kHz peaks) and anything that sounds like an error or game-show buzzer, especially on "no", "skip" or "pass" actions. A consent-first app must not punish refusal sonically.
- Tune all UI tones to the current music bed's key (pentatonic subset) so overlapping sounds never clash, as Monument Valley does.
- Suggested target: music bed integrated about -20 to -23 LUFS (quiet background below conversation), UI peaks no louder than about -16 LUFS short-term. This is a design choice, not a standard.
- **Defaults:** UI sounds ON at low volume. Music OFF (opt-in toggle on the lobby screen, which also serves as the iOS unlock gesture). One "Quiet mode" toggle mutes all sound and haptics together. Respect `prefers-reduced-motion` as a cue to also reduce celebratory effects.

### Gaps
- No primary Duolingo, Calm, Headspace or Alto's Odyssey sound-design talk was retrieved (GDC Vault not reached). No peer-reviewed UI-sound loudness study found.

## 4. Two-phone audio: who plays music, syncing, iOS PWA, silent switch

### Takeaway
Same-room sync across two browsers is possible (NTP-style clock sync over WebSocket plus Web Audio scheduling, aiming for under 10 ms), but Bluetooth and output-latency variance make it fragile. The robust choice is for **one phone to own the music** while both phones play only short, non-overlapping UI sounds. On iOS, Web Audio defaults to "ambient" and is muted by the silent switch unless `navigator.audioSession.type = "playback"` (Safari-only API, iOS 17+).

### Cited Findings
- W3C Multi-Device Timing CG: about 10 ms accuracy is needed for "echoless" multi-device audio sync and is likely achievable in browsers. Clock sync in JS works by a client repeatedly requesting server timestamps and computing skew. It is limited to protocols available to web apps (no UDP, no internal media clock access), and playbackRate was not designed for sync. — [W3C Multi-Device Timing talk](https://www.w3.org/2015/Talks/fd-timing-tpac-breakout)
- Beatsync (open source) does NTP-style clock sync over WebSockets plus Web Audio scheduling and claims latency of a few ms, locally and over the internet. Commenters note that Bluetooth output delay breaks sync. — [Hacker News: Beatsync](https://hn.jakechampion.name/item/43835584)
- iOS Safari: `navigator.audioSession.type` defaults to "auto", which behaves as "ambient". With the ringer/silent switch on, Web Audio is muted. Setting "playback" (iOS 17+) makes audio play regardless and avoids suspension. — [WebKit Bug 264473](https://bugs.webkit.org/show_bug.cgi?id=264473); [WebKit Bug 237322](https://lists.webkit.org/pipermail/webkit-unassigned/2024-September/1186593.html)
- The AudioSession API is an Editor's Draft implemented only in Safari (as of Nov 2025). "transient" worked on iOS 17.4 but was reported silent on iOS 18. "play-and-record" with getUserMedia still pauses other apps' audio. — [Web audio iOS unmute blog](https://portfolio-2024-b6r.pages.dev/blog/web-audio-ios-unmute); [WebKit mailing list](https://lists.webkit.org/pipermail/webkit-unassigned/2024-March/1153878.html)
- Older workaround: a looping silent `<audio>` element unmutes Web Audio but shows lock-screen media controls. — [Web audio iOS unmute blog](https://portfolio-2024-b6r.pages.dev/blog/web-audio-ios-unmute)

### Inferences
- **Same-room mode:** a "Music on: this phone / partner's phone / off" picker in the lobby, so only one device plays the bed. Both phones keep UI sounds (short, so phase or echo is irrelevant). Optional "duet" chimes can be scheduled with a simple clock-offset handshake over the existing realtime channel. A 20-50 ms offset is acceptable for a chord (perceived as a strum), unlike for music.
- **Apart mode:** each phone plays its own bed locally (no sync needed). Start both from the same loop position using the server timestamp so they are roughly aligned for "listening together".
- **Silent switch:** respect it by default (ambient). A silenced phone is a signal of user intent, and an intimacy app suddenly making noise is a privacy risk. Use `audioSession.type = "playback"` only after the user explicitly turns music on. Feature-detect, since it is Safari-only.
- If the user turns music on, the bed will mix with or interrupt the couple's own Spotify. Don't offer both at once. If "BYO playlist" is chosen, disable the in-app bed and keep only UI sounds, using "ambient" so the game mixes with the other app's audio rather than stopping it.
- **Background/lock screen:** do not depend on PWA background audio. Treat the game as foreground-only. Pausing on `visibilitychange` is also a privacy feature.

### Gaps
- No 2026 primary source found on iOS PWA background audio behaviour or iOS 26-era AudioSession changes. Verify on devices.
- No measurements found of typical Android Chrome output latency variance for two-phone sync.

## 5. Haptics: affective touch research, patterns, platform guidance, iOS web workaround, accessibility

### Takeaway
The evidence base supports slow, gentle, heartbeat-like rhythms. False-feedback slow (60 bpm) wrist vibrations lowered anxiety in a lab RCT, and fast heartbeats raise anxiety. Gentle stroking at 1-10 cm/s optimally excites CT afferents, but phone vibration cannot reproduce stroking, and the evidence on vibrotactile "apparent motion" pleasantness is mixed. Platform guidance (Apple, Android) says less is more, prefer crisp and rich over buzzy, match haptics to animation, and always make haptics optional. On the web, Android gets on/off duration patterns only. iOS Safari's only route is the unofficial `<input type="checkbox" switch>` click trick, which gives one fixed system tick that cannot be patterned.

### Cited Findings
**Affective and mediated touch**
- CT afferents fire most to slow, gentle stroking at 1-10 cm/s, and pleasantness ratings follow the same inverted U. 0.1 cm/s brushing was rated unpleasant. — [PMC4570804](https://pmc.ncbi.nlm.nih.gov/articles/PMC4570804); [Frontiers Behav Neurosci 2014](https://frontiersin.org/articles/10.3389/fnbeh.2014.00054/pdf)
- Vibrotactile apparent motion: one 2023 abstract found an inverted-U for pleasantness, not attributable to CT tuning. A 2025 preprint notes CT afferents respond poorly to vibration, and one study found no velocity effect for vibrotactile apparent motion. A device at 7.7 cm/s apparent velocity was described as within the CT-optimal range, with about 1 cm/s feeling unpleasant in pilots. — [Touch 2023 abstract](https://touch2023.sciencesconf.org/484624/document); [bioRxiv 2025 preprint](https://www.biorxiv.org/content/10.64898/2025.11.29.690443.full.pdf); [Frontiers Robotics & AI 2024](https://frontiersin.org/articles/10.3389/frobt.2024.1419262/full)
- EmotionCheck (Costa et al., Cornell): wrist vibrations at a fixed 60 bpm, presented as the user's own heart rate, significantly lowered anxiety compared with control (p=.014) and real-HR feedback (p=.018), with large effect sizes (n=67, lab only). Fast heartbeat stimuli have been shown to increase anxiety and heart rate. — [PMC6435301](https://pmc.ncbi.nlm.nih.gov/articles/PMC6435301); [Cornell Sun](https://cornellsun.com/2018/02/06/cornell-researchers-create-mental-health-personal-aid/)
- Heartbeat-sharing for intimacy: united-pulse rings (MobileHCI 2008) transmit the partner's heartbeat. ShareABeat (CHI 2015 workshop) summarises evidence that hearing a partner's heartbeat increased reported intimacy, but people also kept more distance when they noticed it, which suggests intimacy regulation. — [Springer/ACM united-pulse](https://www.springerprofessional.de/doi/10.1145/1409240.1409338); [ShareABeat (UHasselt)](https://documentserver.uhasselt.be/bitstream/1942/19054/1/09-Gijsbrechts.pdf)
- Mediated touch can convey emotion. Tactile Sleeve (CHI 2013 EA) participants distinguished emotions through vibration and pressure. VibroBod (CHI 2001) users conveyed presence and empathy. A 68-participant study found people combine vibration, pressure and temperature into affective messages. — [UTwente](https://research.utwente.nl/en/publications/towards-tactile-expressions-of-emotion-through-mediated-touch/); [MIT VibroBod](https://smg.media.mit.edu/papers/Dobson/CHI2001InteractivePoster.pdf); [UCL Berthouze](https://discovery.ucl.ac.uk/10136757/3/Berthouze_TE%20accepted%20version_030921-uploaded.pdf)

**Platform guidance**
- Android: "less is more". Favour clear and rich haptics over buzzy ones. Predefined effects can be buzzy, so use them only as a last resort. Without amplitude control, all non-zero amplitudes map to full strength, so design explicit on/off patterns. Rich haptics can be built from primitives at varied amplitudes and intervals. VibrationEffect.Builder is the preferred composition API from Android 16. — [Android haptics principles](https://developer.android.com/develop/ui/views/haptics/haptics-principles); [Android haptics APIs](https://developer.android.com/develop/ui/views/haptics/haptics-apis); [Custom haptic effects](https://developer.android.com/develop/ui/views/haptics/custom-haptic-effects)
- Apple HIG: the best haptic is often one people don't consciously notice but would miss. Make haptics optional and the app fully usable without them. Match haptic intensity and sharpness to the accompanying animation. Use system patterns for their documented meanings. Long continuous haptics can be unpleasant. — [Apple HIG Playing haptics](https://developer.apple.com/design/human-interface-guidelines/playing-haptics)
- Core Haptics: transient events (taps) vs continuous events (sustained, max 30 s). Intensity and sharpness are both normalised 0-1, from soft/rounded/organic to crisp/mechanical. Parameters can be updated in real time. — [Apple Core Haptics docs](https://developer.apple.com/documentation/corehaptics/updating-continuous-and-transient-haptic-parameters-in-real-time)

**iOS web haptics trick**
- A hidden `<input type="checkbox" switch>` with a `<label>`, clicked via JS, triggers Safari's system haptic. Sources differ on whether this started with Safari 17.4 (switch control) or iOS 18 (haptic on switch). The `ios-haptics` npm package wraps it and notes intensity and pattern cannot be customised. Apple has never shipped `navigator.vibrate` on iOS. — [ios-haptics (npm)](https://npmjs.com/package/ios-haptics); [WebKit Bug 285120](https://bugs.webkit.org/show_bug.cgi?id=285120); [azukiazusa.dev](https://azukiazusa.dev/blog/ios-safari-web-haptics)
- WebKit bug 285120 proposes requiring user activation for that haptic, so programmatic or timed use may stop working. Commentators warn Apple could remove the behaviour. — [WebKit Bug 285120](https://bugs.webkit.org/show_bug.cgi?id=285120); [azukiazusa.dev](https://azukiazusa.dev/blog/ios-safari-web-haptics)

### Inferences
- **Web haptic spec (Android Chrome `navigator.vibrate`, durations in ms as [on, off, on…]; web gives no amplitude control, so keep pulses short to avoid "buzzy"):**

  | Pattern | Use | `navigator.vibrate` array | Notes |
  |---|---|---|---|
  | Tick | button confirm, card flip | `[8]` to `[12]` | barely-there, like Apple's "unnoticed but missed" |
  | Reveal | card revealed | `[15, 60, 25]` | small double tap |
  | Partner heartbeat (calm) | "feel your partner is here" / waiting for partner / breathing exercise | `[30, 120, 20, 830]` looped (= 60 bpm "lub-dub") | slow 55-65 bpm per EmotionCheck. Never exceed resting rate. Max ~10-15 s then stop |
  | Both said yes | mutual consent confirmed | `[20, 80, 20, 80, 40]` | gentle triple, synced on both phones |
  | Celebration | level-up | `[15, 50, 15, 50, 15, 50, 60]` | rare |
  | Pause/skip | partner paused or skipped | none, or `[10]` | refusal must not feel like an alarm |
  | "Send a touch" (apart mode) | user taps or holds to send a pulse to partner | hold-to-send: `[40]` per beat at partner's chosen tempo | receiver sees a visual pulse too, so it never relies on vibration alone |

- **iOS web:** map only "tick" and "reveal" to the switch-label trick, and only inside a direct user tap. Don't attempt heartbeat loops on iOS web. Use a visual pulse (soft glowing ring at 60 bpm) plus an optional soft low-frequency audio "thump" instead. Detect support and hide haptic settings on unsupported devices rather than showing broken toggles.
- **Future native wrapper (Core Haptics):** heartbeat = two transient events (intensity ~0.5 then ~0.3, sharpness ~0.2-0.3 for a soft, organic feel) about 120 ms apart, every ~1 s. "Stroke" = continuous event with intensity ramping 0.2 to 0.4 to 0.2 over ~1.5 s at low sharpness (0.1-0.2). On Android native, use VibrationEffect.Composition primitives (low tick, thud) at low scale, with fallback to on/off patterns if `hasAmplitudeControl()` is false.
- **Defaults and control:** haptics ON for ticks and reveals only (subtle). Heartbeat and "send a touch" are OFF by default and opt-in per partner (receiving a touch is consensual: each partner toggles "allow partner to send touches"). Provide a global intensity setting (Off / Subtle / Normal). On web, "Subtle" simply halves durations.
- **Accessibility:** provide a single master "No vibration" plus "Quiet mode". Never convey information by haptic alone (always pair with visual). Cap continuous patterns at about 15 s. Avoid fast rhythmic patterns (sensory overload, anxiety). Respect OS settings. People with sensory sensitivities or vestibular conditions benefit from low-intensity defaults. The ShareABeat finding that heartbeats can also create distance supports keeping heartbeat sharing opt-in.

### Gaps
- No controlled study found on phone vibration specifically creating romantic or intimate feelings between co-located partners. Evidence is from wearables and lab false-feedback studies.
- No primary source found for accessibility guidance specific to vestibular conditions and haptics. The recommendations above are derived from Apple's "make haptics optional" and general sensory-load reasoning.
- Not confirmed whether the iOS switch-haptic trick still works without user activation in iOS 26 Safari (WebKit bug 285120 status unknown). Must test on device.
- Did not verify MDN text on `navigator.vibrate` pattern limits (e.g., maximum pattern length or duration caps in Chrome) in this session.
