// Card content for Tandem After Dark. Suggestive at most, never graphic.
import { PASS_DECK } from './decks';
// Card = [text, type, topic, optional timer seconds]
export type Raw = (string | number)[];
export type Frame = { t: string; type: string; topic: string; v: string[] };
export type Card = { id: string; l: number; text: string; type: string; topic: string; t: number };

const LV: (null | { n: string; who: string })[] = [null,
 {n:'Sparks',who:'New couple, getting to know each other'},
 {n:'Maps',who:'Learning each other more deeply'},
 {n:'Flirt',who:'Playful, teasing, butterflies'},
 {n:'Warmth',who:'Affectionate, receiver-led touch'},
 {n:'Tension',who:'Anticipation, kissing, desire in words'},
 {n:'Velvet',who:'Goal-free sensual touch and mood'},
 {n:'Masquerade',who:'Role-play setups, both confirm nightly'},
 {n:'Midnight',who:'Anticipation, you choose, then the app goes quiet'}];

const RAW: Record<number, Raw[]> = {
1:[
["What small thing reliably improves your day? Tell me, then ask me the same.","Ask","daily"],
["Describe your first impression of me in three words. I'll go next.","Share","first"],
["What was the best meal of your childhood, and who was at the table?","Ask","food"],
["Guess the song I'd pick for a road trip. Reveal and compare.","Guess","music"],
["Tell me about a place that feels like home to you.","Ask","place"],
["What's a tiny habit of mine you've secretly grown to like?","Share","habit"],
["If we had a free Saturday and no rules, how would you spend it?","Ask","plans"],
["What were you obsessed with as a kid? Show me a photo if you have one.","Ask","childhood"],
["Guess what I'd order at a restaurant neither of us has tried. Then I'll tell you my real pick.","Guess","dinner"]],
2:[
["What's weighing on you this week that I might not know about? I'll listen first, then ask how I can help.","Ask","stress"],
["Guess my biggest hope for the next five years, then reveal and compare.","Guess","hopes"],
["Tell me about a moment you felt really understood. What did the other person do?","Ask","support"],
["What has changed about you since we met that I might have missed?","Revisit","update"],
["What's a value you'd stand firm on, and where did it come from?","Ask","values"],
["Name one thing I do that makes you feel supported. Be specific.","Appreciate","support"],
["What's something you're proud of that you rarely mention?","Ask","pride"],
["Describe your week: one high point and one low point. I'll ask one question about each.","Share","week"],
["What would make next month feel good for you? How can I help?","Ask","next"]],
3:[
["Tell me what you noticed about me the first time you felt a flutter. Specific details win.","Share","attract"],
["Write a one-line flirty note and hide it where I'll find it tomorrow.","Note","note"],
["Hold eye contact for 20 seconds, close enough to make it hard. Then say what you were thinking. Blushing counts.","Do","eyes",20],
["Compliment something about how I carry myself that you find attractive. Make me blush.","Share","compliment"],
["Plan a flirty mini-date for tomorrow: place, time, what I should wear, and one detail that's a surprise.","Plan","plan"],
["Send me a message later today that only I would understand.","Note","message"],
["Which outfit of mine do you secretly love? Tell me why it works.","Share","outfit"],
["Tell me about the moment you first wanted to kiss me. Where were we, and why didn't you?","Ask","silly"]],
4:[
["Take turns: three minutes of a hand or shoulder massage. The receiver guides with only 'more', 'less', or 'there'. Then swap.","Do","massage",180],
["Slow-dance in the kitchen to one song. No talking until it ends.","Do","dance"],
["Finish the sentence: 'The kind of touch that helps me unwind after a hard day is...'","Share","words"],
["Sit back to back, then slowly lean your full weight into each other. Stay until one of you turns around for a kiss.","Do","breathe",60],
["Run your fingers through your partner's hair for two minutes while they tell you about their day.","Do","hair",120],
["Trace slow circles on your partner's palm, then their inner wrist, then up the inside of their arm. Stop at the elbow, for now.","Do","hands",60],
["Ask for one thing that would feel good right now. Your partner can say yes, offer a smaller version, or say not tonight.","Ask","ask-for"],
["Wrap each other in a long hug. Whoever lets go first says one thing they love about the other.","Do","hug"],
["Describe a comfort ritual you'd like us to have: a tea, a blanket, a song.","Share","ritual"],
["Foot rub swap: two minutes each. The receiver sets the pressure.","Do","feet",120]],
5:[
["Kissing only, five minutes, hands above the shoulders. Afterward, each name one thing you'd like more of.","Do","kiss",300],
["Finish in a low voice: 'What makes me feel most wanted is...'","Share","words"],
["Tease card: choose a secret word that means 'I'm thinking of you' and send it tomorrow at a time I won't expect.","Tease","tease"],
["Describe a setting that would make an evening feel charged (lighting, music, place). The other adds one detail.","Share","atmosphere"],
["Each write a daytime teaser you'd enjoy getting (a look, a note, a song) on a scrap of paper. Swap and pick one for this week.","Tease","teaser"],
["Tell me about the best kiss we've had. What made it work?","Ask","kiss-memory"],
["Pick one for tonight: slow, playful or intense. Your partner picks the music to match.","Choose","mood"],
["Whisper something you'd love your partner to do to you this weekend. They answer with one word.","Share","whisper"],
["Trade three compliments, each about something your partner does that turns you on: a look, a voice, a move.","Share","compliment"],
["Each write one thing that would make tonight feel charged. Swap and read. Do either, both, or neither.","Choose","charged"]],
6:[
["No-goal touch, ten minutes each way. The receiver says only 'more', 'less', or 'stay'. Nothing has to lead anywhere, and stopping early is welcome.","Session","touch",600],
["Blindfold your partner and offer three sensations: soft fabric, something cool, your fingertips. They guess each one.","Session","senses",300],
["Each privately choose one word for the mood of your ideal evening ('unhurried', 'playful', 'daring'). Reveal together and merge them into one plan.","Choose","mood"],
["Tell your partner one thing about how they move that you quietly love.","Appreciate","appreciate"],
["Lights low, one song. Take turns tracing slow lines on each other's back and arms. The receiver sets the pace.","Session","tracing",480],
["Pick a scent or fabric you love and describe the memory attached to it. Then offer it to your partner.","Share","scent"],
["Take turns leading for five minutes. The other only says 'again', 'slower' or 'pause'.","Session","lead",300],
["Describe what 'unhurried' looks like to you. Plan one hour this week that feels like it.","Choose","unhurried"],
["Ask your partner when in the day they'd like more touch, and what kind. Listen first.","Ask","ask-for"],
["Take a warm bath or shower, one after the other, then spend ten quiet minutes wrapped up together. No agenda.","Session","calm",600]],
7:[
["Scene: 'The Stranger at the Bar.' You're meeting for the first time. Pick names and a backstory, flirt shamelessly, and end it with one of you whispering 'my place?'. Either can use the cue word to step out.","Scene","scene-bar"],
["Scene: 'Reunion.' Ten years apart, and the pull is still there. Five minutes of catching up, then one of you closes the distance. Decide together how the night continues.","Scene","scene-reunion",300],
["Dress clue: wear one clue only (a tie, a scarf, a color). Your partner guesses who you're playing.","Persona","dress"],
["Cue check: choose a word for 'pause' and one for 'more of this', and say each aloud once.","Cue","cue"],
["Persona draw: each pick a profession (pilot, painter, detective, chef). Introduce yourselves at a pretend gala.","Persona","persona"],
["Scene: 'Hotel Lobby.' Two adults, a late arrival, one room left and one key. Make up why you're both here, then decide who gets the bed, and whether it's shared.","Scene","scene-hotel"],
["Scene: 'The Charming Rival.' You're rivals at a pretend contest. The only way to win is to make the other lose their composure first: by touch, by whisper, by kiss.","Scene","scene-rival"],
["Debrief for two minutes: what did you enjoy playing, and what would you change?","Share","debrief"]],
8:[
["Chain, day 1 of 3: leave a handwritten note with only a place, a time and a one-word dress code. Say nothing else until then.","Chain","chain1"],
["Whisper card: whisper one sentence about how you want the evening to feel, and nothing more. Your partner answers 'yes', 'tweak', or 'not tonight'. The details belong to the two of you.","Whisper","whisper"],
["You choose: pick a vibe for the next hour (Slow, Playful or Daring). Your partner picks one rule (lights, music or silence, talking or quiet). Then put the phone away.","Choose","choose"],
["Author's night: take turns adding one sentence each, three rounds, to write the opening of tonight's story. Then the page closes and the evening is yours.","Whisper","author"],
["Epilogue (next morning): share one moment from last night you'd like to remember, and one thing you'd change to make it better for you.","Epilogue","epilogue"],
["Chain, day 2 of 3: send one line that only hints at what you're anticipating. No reply needed.","Chain","chain2"],
["Choose a word for tonight together. Whisper it. Let it set the tone, then leave the phone in another room.","Whisper","word"],
["Close the app and light one candle. The rest is yours to write.","Whisper","candle"]]
};

/* Extra hand-written cards for Levels 4-6 (merged into RAW at build time) */
// Heat: physical cards for Levels 5-8, added after playtesting showed the top levels were too tame.
// Every one is a hands-on type (Do / Session / Scene), so each partner privately answers yes / maybe / not tonight
// before it is shown. Suggestive and sensual, never graphic: no explicit acts, no anatomy named beyond neck, back,
// waist, thighs. Appended after EXTRA so existing card ids stay the same.
const HEAT: Record<number, Raw[]> = {
3: [
["Give me your best pick-up line, delivered with full confidence. I'll rate it out of ten.","Share","pickup"],
["What's one thing I do that I probably don't realise is attractive?","Ask","unaware"],
["Describe the moment you knew you had a crush on me, in as much detail as you dare.","Share","crush"],
["Text me something flirty right now, even though I'm right here. Then read it to me with a straight face.","Note","textnow"],
["Flirt with me as if we've just met and you have thirty seconds to get my number.","Do","thirtysec",30],
["Wink at me. Now explain, in one sentence, exactly what that wink meant.","Do","wink"],
["What's the most attractive thing you've ever seen me wear? Be honest.","Ask","attractivewear"],
["Tell me one thing about me you'd brag about to a stranger.","Share","brag"],
["Rate my flirting from one to ten, then show me what a ten would look like.","Share","rateflirt"],
["Finish this sentence: 'You looked dangerously good when...'","Share","dangerous"],
["What would you whisper to me across a crowded room if no one else could hear?","Ask","crowded"],
["Pick the outfit you want to see me in on our next date. I'll consider it.","Plan","outfitplan"]],
4: [
["Sit in your partner's lap, facing them, foreheads resting together. Tell each other about your day in a whisper.","Do","lapwhisper"],
["Give your partner a slow neck massage, then kiss the spot you just rubbed, once.","Do","neckonce"],
["Lie on the couch, one behind the other, and trace lazy patterns on your partner's stomach over their shirt.","Do","spoontrace"],
["Pull your partner in by the hand and hold them for one song. One kiss is allowed, but only on the last line.","Do","onesongkiss"],
["Take turns naming where you'd like to be touched more often: neck, back, hair, hands. Then give each other a minute of it.","Do","moreoften",120],
["Warm your hands and ask if you can rest them under the back of your partner's top while you talk. Leave them there.","Do","warmhands"]],
5: [
["Kiss your partner's neck, slowly, from just below the ear down to the collarbone. They say 'more' or 'stay'.","Do","neckkiss"],
["Hold your partner's wrists gently against the wall and kiss them for one minute. Either of you can say 'pause'.","Do","wristwall",60],
["Whisper the one thing you've wanted to do to your partner all day. Then do just the first part of it.","Do","allday"],
["Kiss like you're about to be interrupted: thirty seconds, urgent, then stop and just look at each other.","Do","interrupted",30],
["Sit in your partner's lap, facing them. Kiss for two minutes without using your hands.","Do","lapkiss",120],
["Kiss your partner everywhere on their face and neck except their lips. Make them wait for it.","Do","waitlips"],
["Undo one button or zip on your partner's clothes, slowly, holding eye contact. That's all. For now.","Do","onebutton"],
["Kiss along your partner's jaw while whispering what you find irresistible about them.","Do","jawwhisper"],
["Back your partner gently against a wall and kiss them. They decide when it ends.","Do","wallkiss"],
["Kiss your partner's wrist, then the inside of their elbow, then their shoulder. Ask before each one.","Do","armpath"],
["One of you can't move for two minutes. The other kisses anywhere above the waist that's welcome.","Do","stillkiss",120],
["Breathe slowly against your partner's neck for thirty seconds without touching. Then one slow kiss.","Do","breathneck",30],
["Kiss your partner against the nearest wall, hands in their hair. Stop just before either of you wants to, and walk away.","Do","wallleave"],
["Pull your partner close by the waistband and kiss them for one minute. They decide where their hands go.","Do","waistband",60],
["Kiss your partner's earlobe, then whisper one thing you can't stop thinking about doing to them.","Do","earwhisper"],
["Trade kisses that each last one second longer than the last, starting at one. See how far you get before you lose count.","Do","longerkiss"],
["Slide one hand under the back of your partner's shirt while you kiss. Leave it there, warm, for a full minute.","Do","handunder",60],
["Kiss as slowly as you possibly can for one minute, then as hungrily as you can for ten seconds.","Do","slowfast",70]],
6: [
["Take off your partner's clothes one piece at a time, slowly, kissing the skin you uncover. Keep going as far as you both want; 'stop' ends it at any piece.","Session","undress1"],
["Shirt off, warm oil: slow back massage from the neck to the base of the spine. The receiver sets the pressure and says when to go lower.","Session","oilback",300],
["Blindfold your partner. Kiss five places they don't expect, each a little bolder. Before each one, they guess where you'll go.","Session","blindkiss"],
["Trace an ice cube along your partner's neck and collarbone, then warm the same path with your lips.","Session","icewarm"],
["Lie together skin to skin, as bare as feels right, for five minutes. Let your hands wander and your breathing speed up.","Session","skin",300],
["Run your fingertips down your partner's bare spine and back up, ten times, each slower and lower than the last.","Session","spine"],
["Kiss your way down your partner's bare back, slowly. They say 'stay' wherever they want you to linger, and 'lower' when they're ready.","Session","backkisses"],
["Shower together. Take turns soaping each other slowly, everywhere you're both comfortable, saying nothing.","Session","shower"],
["Hold your partner from behind. Let your hands move slowly over their waist, stomach and hips, under their clothes. They guide your hands.","Session","spoonhands"],
["Three minutes of fingertip touch each, eyes closed. The receiver can answer only with sounds, no words.","Session","soundsonly",180],
["Feather-light kisses on your partner's inner arm, the back of their knee and their inner thigh. Ask which they liked most.","Session","feather"],
["Slow-dance in as little as you're both comfortable with. One song, lights low, bodies pressed close.","Session","barelydance"],
["Massage your partner's calves and thighs for three minutes, under clothes, working slowly upward. They say when to stop.","Session","legs",180],
["Lie face to face, legs tangled, and kiss slowly for five minutes. Hands may roam. Nothing has to happen next.","Session","tangled",300],
["Kiss the back of your partner's neck while your hands slowly undo one button, zip or tie. Then stop, and wait to be asked for more.","Session","neckundo"],
["Lie on your front while your partner draws slow circles of warm oil on your back, and lower, if you say yes.","Session","oilcircles"],
["Take turns whispering one place you'd love to be kissed tonight. The other kisses it, slowly, then asks for the next.","Session","kissrequest"],
["Sit between your partner's knees, back to their chest. They kiss your neck and shoulders; their hands rest wherever you place them.","Session","betweenknees"],
["Undress each other to your underwear, slowly, taking turns. Then lie together for five minutes without taking anything else off.","Session","underwear",300],
["Put on a blindfold. Your partner guides your hands over them for two minutes, wherever they choose to take them.","Session","guidedhands",120],
["A slow full-body hug lying down, as bare as you like, for three minutes. Whoever moves first has to kiss the other.","Session","bodyhug",180],
["Warm a towel and slowly dry your partner after a shower, every inch they offer, kissing as you go.","Session","towel"]],
7: [
["Scene: 'Room Service.' One of you orders, the other delivers, then lingers: they won't leave until the guest says exactly what else they'd like.","Scene","sc-roomservice"],
["Scene: 'The Private Massage.' One of you is a therapist with very good hands and very few rules. The client sets every limit and says when the session ends.","Scene","sc-massage"],
["Scene: 'Last Night of the Holiday.' Two strangers who met this week. Tonight one of you finally knocks on the other's door. Play out what happens when it opens.","Scene","sc-holiday"],
["Scene: 'The Art Class.' One of you poses, as bare as they choose; the other sketches. Halfway through, the artist asks to move the model by hand.","Scene","sc-artclass"],
["Scene: 'Blind Date.' Meet at your own front door as strangers. By the end of the night, the goodnight kiss has to last at least a minute.","Scene","sc-blinddate"],
["Scene: 'The Masked Gala.' Masks on. Dance as strangers, then steal away to a quiet room. The masks stay on; something else comes off.","Scene","sc-gala"],
["Scene: 'The Interview.' One of you applies to be the other's lover for one night. Every answer must be demonstrated, not described.","Scene","sc-interview"],
["Scene: 'Snowed In.' Two adults in a cold cabin with one blanket. The only way to stay warm is skin to skin. Negotiate.","Scene","sc-snowed"],
["Scene: 'The Photographer.' One of you directs, the other poses, and every pose gets a little less clothed. Phones stay off; only the eyes remember.","Scene","sc-photo"],
["Scene: 'The Bet.' You lost, and you owe your partner three wishes tonight, each one bolder than the last. You can trade any one away.","Scene","sc-bet"],
["Scene: 'Strangers on a Night Train.' Side by side in a dark carriage. Every minute, a hand moves an inch closer. Neither of you says a word.","Scene","sc-train"],
["Scene: 'After the Party.' Everyone else has gone. You've wanted each other all evening and finally have the room to yourselves. Show it.","Scene","sc-afterparty"],
["Scene: 'The Spy.' One of you holds a secret; the other has five minutes to get it out of them using only kisses.","Scene","sc-spy",300],
["Scene: 'The Royal Guard.' One of you must stand perfectly still for three minutes, whatever happens. The other does their best to make them move.","Scene","sc-guard",180],
["Scene: 'Room 21.' You've booked a hotel room under fake names for one secret night. Arrive separately. Knock twice.","Scene","sc-room21"],
["Scene: 'The Auction.' One of you bids for a single hour with the other. The winner names three things that hour must include.","Scene","sc-auction"],
["Scene: 'Opposites.' Swap your usual roles in bed for tonight: whoever usually leads, follows. Agree one word to swap back.","Scene","sc-opposites"],
["Scene: 'The Tailor.' One of you takes the other's measurements, very slowly, with a tape measure and fingertips. Fitting is by invitation only.","Scene","sc-tailor"],
["Scene: 'Long-Lost Lovers.' You were together years ago and swore it was over. Tonight, you find out it isn't. Start with the first touch.","Scene","sc-lostlovers"],
["Scene: 'The Midnight Visitor.' One of you waits in the dark bedroom, wide awake and expecting company. The other slips in without a word. The one waiting decides how close they get.","Scene","sc-visitor"]],

8: [
["Undress each other completely, taking turns, one piece at a time. Every piece that comes off earns a kiss on the skin underneath.","Session","undressall"],
["Blindfold your partner for ten minutes. You decide where your hands and lips go; they decide when to say 'stop'.","Session","blindcharge",600],
["Tell your partner exactly how you want to be touched tonight, out loud, in one sentence. They do exactly that until you say 'more'.","Do","exactly"],
["Ten minutes where only one of you may touch, then swap. The other lies back and isn't allowed to touch back.","Session","onlyone",600],
["Kiss your way from your partner's lips down to their hips, slowly. They decide how far is far enough.","Do","towaist"],
["Name the part of you your partner can't keep their eyes off. They give it two minutes of undivided attention.","Do","favpart",120],
["Take your partner by the hand to the bedroom. No talking from here on: let your hands do the asking.","Do","leadbed",600],
["Two minutes each using only your lips, anywhere you're both comfortable. Hands stay behind your back.","Do","lipsonly",120],
["Warm oil, lights low: massage every inch your partner offers, head to toe. When you finish, they decide what happens next.","Session","headtoe"],
["Loosely tie your partner's wrists with a soft scarf. For three minutes, tease them with kisses they can't reach back for. Untie at the first word.","Do","scarf",180],
["For fifteen minutes, the only words allowed are 'more', 'slower', 'there' and 'don't stop'.","Session","threewords",900],
["Undress your partner using only your lips and teeth. Hands behind your back, as long as it takes.","Do","teeth"],
["Write tonight's wish on paper. Swap, read it in silence, and make your partner's come true first.","Do","wishswap"],
["Put the phones face down. You both know what the next card would say.","Do","nextcard"],
["Undress for your partner to one song, slowly, as far as you like. They have to keep their hands on the bed.","Do","strip"],
["Lie skin to skin, as bare as you both want, and kiss for five minutes without letting your hands rest.","Session","barekiss",300],
["Whisper exactly what you want your partner to do to you tonight. They repeat it back, word for word, then begin.","Do","repeatback"],
["Sit your partner on the edge of the bed. Kneel and kiss slowly from their ankle up to their thigh. They say when to stop.","Do","ankleup"],
["Hold an ice cube in your lips and trace it across your partner's chest and stomach. Follow the same path with a warm mouth.","Session","icetrail"],
["Five minutes each in charge. The one in charge gives soft instructions; the other can say no to any of them.","Session","incharge",600],
["Shower together with the lights off. Wash each other slowly, everywhere you're both comfortable, then take it to bed.","Session","darkshower"],
["Stand behind your partner in front of a mirror. Undress them slowly while they watch you do it.","Do","mirror"],
["Two minutes of teasing without touching: breath, whispers, almost-kisses. Whoever touches first has to do whatever the other asks next.","Do","notouch",120],
["One last kiss that lasts as long as you both want. The game is over; the night isn't.","Do","lastkiss"]],
};

const EXTRA: Record<number, Raw[]> = {
"4": [
[
"Give your partner a two-minute scalp massage while they close their eyes. They say 'more', 'less' or 'there'.",
"Do",
"scalp",
120
],
[
"Take turns resting your head in each other's lap for three minutes while the other strokes your hair or back.",
"Do",
"lap",
180
],
[
"Hand massage swap: two minutes each, with lotion if you have it. The receiver sets the pressure.",
"Do",
"handmassage",
120
],
[
"Show your partner how you'd love to be greeted at the door tonight: pulled close, held long, one kiss.",
"Do",
"greeting"
],
[
"Finish the sentence: 'I feel most relaxed with you when...'",
"Share",
"relaxed"
],
[
"Describe a time you felt completely safe in your partner's arms. What was happening around you?",
"Ask",
"safe"
],
[
"Stand forehead to forehead for one minute, close enough to almost kiss. Don't, yet.",
"Do",
"forehead",
60
],
[
"Take turns tracing your partner's initials on their back with a fingertip. They guess the letters.",
"Do",
"initials"
],
[
"Share a blanket on the couch, legs tangled, for ten minutes. Hands can wander, but only above the waist.",
"Do",
"blanket",
600
],
[
"Ask your partner what kind of hug they'd like most right now: tight, long, rocking or a quick squeeze. Give it to them.",
"Ask",
"hugtype"
],
[
"Neck and shoulder rub, two minutes each. The receiver says what pressure feels right.",
"Do",
"neck",
120
],
[
"Describe your favorite way to wake up with your partner. What does a perfect slow morning look like?",
"Share",
"morning"
],
[
"Each pick one thing you'd like more of this week: a hug, a walk, a night in, a laugh. Plan a time for both.",
"Choose",
"more"
],
[
"Comb or brush your partner's hair, or rub their temples, for two minutes. Ask if the pace feels right.",
"Do",
"brush",
120
],
[
"Play a song that makes you feel held. Sit in your partner's lap for the whole thing, arms around their neck.",
"Do",
"song"
],
[
"Tell your partner one small gesture they made recently that made you feel cared for.",
"Appreciate",
"gesture"
],
[
"Cuddle without screens for five minutes. Take turns being the one who's held.",
"Do",
"cuddle",
300
],
[
"Ask what part of your partner's day felt heavy. Hold their hands while they tell you, and just listen.",
"Ask",
"heavy"
],
[
"Describe the cozy evening you'd both love this week: food, lighting, who sits where.",
"Choose",
"cozyplan"
],
[
"Give a slow forearm massage, then keep going up to the shoulder and neck. Notice what the receiver's breathing does.",
"Do",
"forearm",
120
],
[
"Name three words for how it feels when your partner holds you. Say them quietly.",
"Share",
"threewords"
],
[
"Dim the lights. Sit close enough that your legs touch, and trace slow lines on your partner's knee while you talk.",
"Do",
"dim",
300
],
[
"Trade back rubs for three minutes each. The receiver chooses the music.",
"Do",
"backrub",
180
],
[
"Say one thing about your partner's hands that you love.",
"Appreciate",
"handsappreciate"
],
[
"Ask your partner what helps them feel calm after a stressful day. Do one of those things for them tonight.",
"Ask",
"calm"
],
[
"Share a childhood comfort: a blanket, a smell, a meal. Describe how it made you feel.",
"Share",
"comfort"
],
[
"Sit facing each other, knees touching, and take five slow breaths together.",
"Do",
"knees",
60
],
[
"Draw a slow circle on your partner's back with your palm. They tell you if they'd like bigger, smaller or slower.",
"Do",
"circle"
],
[
"Plan a lazy hour for tomorrow with no phones. Who brings what?",
"Choose",
"lazyhour"
],
[
"Finish the sentence: 'The easiest way for you to make me feel loved is...'",
"Share",
"easiest"
],
[
"Whisper 'I'm glad you're mine' into your partner's neck, three times, each softer than the last.",
"Do",
"tone"
],
[
"Spend two minutes with a gentle face touch: temples, cheeks, jaw. The receiver says 'more', 'less' or 'there'.",
"Do",
"face",
120
],
[
"Ask your partner what touch they like at the end of a long day. Offer a small version of it now.",
"Ask",
"endofday"
],
[
"Find the coziest spot in your home and curl up together, as close as your clothes allow, for ten minutes.",
"Do",
"spot",
600
],
[
"Tell your partner one thing you'd like more of in how you say goodnight.",
"Share",
"goodnight"
],
[
"Hold each other close and sway for two minutes, your face in their neck. Breathe them in.",
"Do",
"sway",
120
],
[
"Share a way you like to be comforted when you're upset, and one thing that doesn't help.",
"Share",
"upset"
],
[
"Trade a foot rub for two minutes each. The receiver sets the pressure.",
"Do",
"feet2",
120
],
[
"Hug your partner from behind while they look out a window. Rest your lips on their shoulder and stay.",
"Do",
"behind"
],
[
"Tell your partner about a time they surprised you with a gentle gesture.",
"Appreciate",
"surprise"
],
[
"Whisper something kind into your partner's ear, close enough that they feel it. Then one soft kiss on the cheek.",
"Do",
"whisperkind"
],
[
"Each pick a favorite way to be hugged: shoulders, waist, back. Share it and try one.",
"Choose",
"hugspot"
],
[
"Lie on your partner's chest and match your breathing to theirs. When they stroke your back, breathe a little slower.",
"Do",
"breath2",
180
],
[
"Ask what small ritual would make evenings feel warmer: tea, a walk, a shared playlist.",
"Ask",
"evening"
],
[
"Take turns rubbing each other's arms for two minutes. The receiver says 'stop' or 'more' at any time.",
"Do",
"armrub",
120
],
[
"Describe how a perfect rainy afternoon at home would feel to you.",
"Share",
"rainy"
],
[
"Hold hands, close your eyes, and say your partner's name the way you'd say it if no one else could hear.",
"Do",
"sound"
],
[
"Look at an old photo of the two of you. Tell the story of what you remember from that day.",
"Share",
"photo"
],
[
"Tuck a blanket around your partner, then climb in with them. Say one thing you've wanted to tell them all day.",
"Do",
"tuckin"
],
[
"Ask your partner what kind of touch they'd like to explore more, and what would help them feel safe doing so.",
"Ask",
"explore"
]
],
"5": [
[
"Share a slow, deep kiss for thirty seconds. Say how it felt in one word, then go again.",
"Do",
"slowkiss",
30
],
[
"Tell your partner what you noticed about their eyes or smile when you first met. Keep it sweet.",
"Share",
"firstnoticed"
],
[
"Tease card: tomorrow at lunchtime, send your partner a message that begins with 'I keep thinking about...'",
"Tease",
"lunchtext"
],
[
"Describe the kiss you'd love at the end of a perfect date. Where are you standing?",
"Share",
"datekiss"
],
[
"Each write down one thing your partner does that makes you feel charged. Swap and read.",
"Choose",
"charged2"
],
[
"Kiss for two minutes with hands on shoulders only. Say 'pause' whenever you'd like a breath.",
"Do",
"shoulderkiss",
120
],
[
"Whisper the last thought you had about your partner that made you blush. Don't explain it.",
"Share",
"weekend"
],
[
"Play a song that makes you feel charged. Sit in each other's laps and kiss through the whole thing.",
"Do",
"chargedsong"
],
[
"Share a moment recently that gave you a spark with your partner. Be as specific as you like.",
"Share",
"spark"
],
[
"Tease card: choose a signal that means 'I'd like to pick this up later'. Agree on it now and use it before bed.",
"Tease",
"signal"
],
[
"Take turns telling each other your favorite part of how they dress. Hold eye contact between sentences.",
"Share",
"dressed"
],
[
"Kiss your partner's hand, then their cheek, then wherever they point, within what's comfortable.",
"Do",
"kissmap"
],
[
"Each pick a word for tonight's mood: slow, playful or daring. Reveal together and talk about why.",
"Choose",
"moodword"
],
[
"Dance close for one song, hips pressed together. On the last chorus, kiss your partner like the song is about them.",
"Do",
"closedance"
],
[
"Name a place where you'd love a surprise kiss: a stairwell, a balcony, a quiet street. Plan one for this week.",
"Tease",
"surprisekiss"
],
[
"Guess what your partner wants right now, then do it, slowly. They answer only 'warmer' or 'colder' as you go.",
"Do",
"guess1",
60
],
[
"Describe a fragrance you love on your partner and the memory it brings up.",
"Share",
"fragrance"
],
[
"Hold each other's gaze for 30 seconds, then say out loud one thing you're craving from them tonight. Seal it with a kiss.",
"Do",
"gazecrave",
30
],
[
"Tell your partner about a moment this week when you wanted them badly. Where were you, and what stopped you?",
"Share",
"slowdown"
],
[
"Trade forehead or neck kisses for a minute each. Say 'more' or 'softer' as you go.",
"Do",
"kissneck",
60
],
[
"Write a short, teasing note for your partner to open tomorrow morning. Seal it.",
"Tease",
"note2"
],
[
"Plan a charged hour this week: lights, music, no phones. Who sets what?",
"Choose",
"chargedhour"
],
[
"Ask your partner what makes them feel most wanted. Then say how you'd show it this week.",
"Ask",
"wanted"
],
[
"Take turns leaning in first for a kiss. The other decides how long it lasts.",
"Do",
"leanin"
],
[
"Describe your partner's kiss as if it were a scent, a color or a song. Be specific.",
"Share",
"laugh"
],
[
"Plan a date at home for later this week: outfit, food, music and one surprise.",
"Tease",
"dateathome"
],
[
"Whisper the name of a place where you'd love to kiss your partner. Say why.",
"Share",
"placekiss"
],
[
"Each pick a word that means 'yes please' and one that means 'not now'. Say each aloud once.",
"Choose",
"wordsyes"
],
[
"Kiss for one minute with your eyes closed and your hands in each other's hair. Then say what you noticed.",
"Do",
"eyesclosed",
60
],
[
"Finish the sentence: 'It makes my heart race when you say...'",
"Share",
"hear"
],
[
"Tell your partner one thing they do in public that makes you want to get them alone.",
"Share",
"public"
],
[
"Trace one slow line with a fingertip from your partner's lips, down their neck, to their collarbone. Then follow it with your mouth.",
"Do",
"heartpalm"
],
[
"Share a memory of a kiss or hug that stayed with you for days.",
"Share",
"memorykiss"
],
[
"Choose a signal for tonight: one squeeze of the hand means 'come closer', two squeezes mean 'let's slow down'.",
"Choose",
"handsignal"
],
[
"Tease card: pick a time tomorrow when you'll both stop what you're doing for a sixty-second hug.",
"Tease",
"sixtyhug"
],
[
"Describe the best compliment your partner has given you and what it did to you.",
"Share",
"bestcompliment"
],
[
"Put on a slow song and sway pressed together. Every time the chorus comes, one of you kisses the other's neck.",
"Do",
"slowsong"
],
[
"Name one thing you'd like your partner to do to you very, very slowly.",
"Share",
"slowthing"
],
[
"Plan a getaway for two, then describe the first hour after the hotel door closes. Tease; the details can wait.",
"Choose",
"getaway"
],
[
"Ask your partner how they feel about affection in public, and what feels good to them.",
"Ask",
"publicaff"
],
[
"Hold eye contact for 45 seconds, close enough to feel each other's breath. Whoever kisses first wins.",
"Do",
"smile45",
45
],
[
"Pick a daytime teaser you'd enjoy getting: a look, a wink, a message with one word. Agree on one for this week.",
"Tease",
"daytimeteaser"
],
[
"Describe what tension feels like to you in a romantic way: butterflies, quiet, a held breath.",
"Share",
"tensionword"
],
[
"Trade three compliments, each about how the two of you feel when you're close.",
"Share",
"closecompliments"
],
[
"Take turns placing a gentle kiss somewhere your partner says is okay: forehead, hand, cheek. Name the place first.",
"Do",
"namedkiss"
],
[
"Each describe what anticipation looks like on a good day with your partner.",
"Share",
"anticipation"
],
[
"Whisper something you're curious about trying together this month. Your partner answers 'yes', 'tell me more' or 'not yet'.",
"Share",
"curious"
],
[
"Pick a steamy scene from a film or book that stayed with you. Describe what made it work.",
"Share",
"moviescene"
],
[
"Tease card: leave one small token for your partner somewhere they'll find it before the weekend.",
"Tease",
"token"
],
[
"Say one thing your partner does that makes you feel drawn to them, in the nicest way.",
"Appreciate",
"pulled"
],
[
"Share what 'charged but gentle' means for you, and one way to get there.",
"Choose",
"gentle"
],
[
"Hold your partner's face, kiss them slowly, then whisper what you'd like to do next. Don't do it yet.",
"Do",
"holdface",
120
]
],
"6": [
[
"Run a silk scarf slowly over your partner's bare shoulders, neck and back. They close their eyes and say 'again' wherever they want it.",
"Session",
"textures",
300
],
[
"Rest a warm hand on your partner's shoulder and move slowly. They guide with 'more', 'less' or 'stay'. Nothing needs to lead anywhere.",
"Session",
"warmhand",
300
],
[
"Dab a scent you love on your partner's neck or wrist. Find it again with your lips, eyes closed.",
"Session",
"scentgame",
180
],
[
"Each pick one song for a slow evening and defend your choice. Make a three-song playlist together.",
"Choose",
"playlist"
],
[
"Share what 'unhurried' feels like in your body. Then plan an hour that matches it.",
"Share",
"unhurried2"
],
[
"Lie side by side with one song playing. For its whole length, only fingertips may move, and only under clothing.",
"Session",
"lie",
300
],
[
"Trace a feather or soft cloth along your partner's forearm for two minutes. They guess the pattern you draw.",
"Session",
"feather",
120
],
[
"Tell your partner one thing you love about how their body moves when they feel happy.",
"Appreciate",
"moves"
],
[
"Describe your favorite temperature: cool sheets, a warm bath, sun on skin. Offer a version to your partner.",
"Share",
"temperature"
],
[
"Trace slow figure eights on your partner's inner wrist, then their neck, then their lower back. They say 'slower', 'lighter' or 'more'.",
"Session",
"figure8",
120
],
[
"Each write three words for how you'd like to feel at the end of tonight. Swap and talk.",
"Choose",
"endfeel"
],
[
"Spend ten minutes where one of you gives a no-goal back touch and the other only says 'again', 'slower' or 'stay'. Then swap.",
"Session",
"backtouch",
600
],
[
"Light one candle. Sit facing each other, knees touching, and take turns removing one thing the other is wearing. Stop whenever either of you wants.",
"Session",
"candlethanks",
300
],
[
"Talk about a time you felt deeply at ease in your own skin. What helped?",
"Ask",
"ease"
],
[
"Lead your partner, eyes closed, to the bed. Offer three slow sensations: breath, fingertips, lips. They guess each one.",
"Session",
"blindfold2",
300
],
[
"Describe your perfect slow evening, step by step: sound, light, who touches whom.",
"Share",
"slowevening"
],
[
"Take turns brushing a fingertip along your partner's shoulder or collarbone for two minutes. The receiver leads.",
"Session",
"collarbone",
120
],
[
"Ask your partner which part of their day they'd like more touch in, and what kind. Listen first.",
"Ask",
"asktouch"
],
[
"Pick a texture for tonight: velvet, cotton, silk or wool. Describe why it appeals to you.",
"Choose",
"texturepick"
],
[
"Close your eyes and let your partner guide your hand slowly over their arms, neck and back. Say what you notice.",
"Session",
"guided",
60
],
[
"Name one thing about your partner's presence that feels calming. Say it slowly.",
"Appreciate",
"calmpresence"
],
[
"Spend five minutes breathing together, hands resting on each other's backs. No speaking.",
"Session",
"breathtogether",
300
],
[
"Slow strokes from the shoulders down to the lower back, under their shirt, for three minutes. The receiver keeps the pace.",
"Session",
"armshoulder",
180
],
[
"Share a sensory memory: a taste, scent or sound that makes you feel instantly cozy.",
"Share",
"sensorymemory"
],
[
"Decide on a signal for 'pause' and one for 'more of this'. Test each once.",
"Choose",
"signals2"
],
[
"Warm lotion in your hands and massage your partner's neck, shoulders and chest. The receiver says how the pressure feels.",
"Session",
"handcare",
120
],
[
"Create a mood for tonight with three details: a color, a song, a texture.",
"Choose",
"moodthree"
],
[
"Talk about how it feels when someone listens to your body, not just your words. What helps you feel heard?",
"Ask",
"heardbody"
],
[
"Undo your partner's top slowly while they keep their eyes closed. Then kiss their shoulders until they open them.",
"Session",
"slowwalk",
180
],
[
"Tell your partner one thing you love about how they touch you. Be specific about speed and pressure.",
"Appreciate",
"lovetouch"
],
[
"Ten minutes under one blanket, as bare as you both like. No talking. Hands may wander, slowly.",
"Session",
"wrapped",
600
],
[
"Offer your partner three choices: slow, soft or steady. They pick one and you try it on their shoulders or arms.",
"Session",
"threechoices",
180
],
[
"Tell a story about a place that felt like home to your senses.",
"Share",
"senseplace"
],
[
"Choose a word that means 'keep going' and one that means 'let's change'. Practice both.",
"Choose",
"words2"
],
[
"Rest your head on your partner's chest or shoulder and listen to their breathing for two minutes.",
"Session",
"listenbreath",
120
],
[
"Describe the first time you felt truly comfortable being touched by your partner.",
"Ask",
"firstcomfort"
],
[
"Lay out three small sensations: cool, warm, soft. Offer them one at a time and ask for 'more' or 'enough'.",
"Session",
"trio",
300
],
[
"Stretch out on the bed and let your partner massage whatever aches, as slowly as they like. Then swap.",
"Session",
"stretch",
300
],
[
"Tell your partner something you'd like to learn about their body language and what it means.",
"Ask",
"bodylang"
],
[
"Share a word for how you want to feel when you're close to your partner.",
"Share",
"closeword"
],
[
"Trace your partner's silhouette with one fingertip, head to hip, as they lie still. Then do it again with your lips.",
"Session",
"outline",
240
],
[
"Pick a piece of clothing that feels good to wear and say why. Offer to wear it again.",
"Share",
"clothing"
],
[
"Trade slow touch on bare backs and sides for four minutes each. Nothing needs to lead anywhere, but it may.",
"Session",
"goalfree",
240
],
[
"Ask your partner: 'What would make you feel unhurried tonight?' Then honor it for ten minutes.",
"Ask",
"unhurriedask"
],
[
"Say three things you appreciate about how your partner's body carries them through their day.",
"Appreciate",
"bodyappreciate"
],
[
"Tell your partner how you like to be touched when you're tired.",
"Share",
"tiredtouch"
],
[
"Turn off the lights and light one candle. In its glow, undress each other down to whatever feels comfortable, slowly.",
"Session",
"candleroom",
180
],
[
"Pick a texture and a sound for tonight. Describe how they might feel together.",
"Choose",
"textsound"
],
[
"Guide your partner's hand to where you'd like to be touched next, above the waist. They stay there until you move it.",
"Session",
"softsurface",
180
],
[
"Sit in your partner's lap, facing them, foreheads touching. Breathe together for three minutes while their hands explore your back.",
"Session",
"holdnotice",
180
],
[
"Ask your partner what part of their body they'd like to feel more at ease with, and how you can help.",
"Ask",
"easewith"
],
[
"A long, slow hug with shirts off. See how long you can both stay in it before someone has to kiss the other.",
"Session",
"longhug",
180
],
[
"Share a way you like to be cared for after a rough week.",
"Share",
"recover"
],
[
"Decide on one evening this week that's just for slow touch and talking. Put it on the calendar.",
"Choose",
"calendar"
],
[
"Take turns finishing: 'I love how you...' with something about your partner's presence.",
"Appreciate",
"lovehow"
]
]
};

/* Templated frames multiply variety at Levels 1-3 (frame x slot filler). Level 4 and up is hand-written only. */
const TPL: Record<number, Frame[]> = {
1:[
 {t:"What's your favorite {x}? Tell me why, then ask me.",type:'Ask',topic:'fav',v:['meal','season','smell','board game or video game','street food','way to spend a rainy day','movie to rewatch','holiday memory','place to people-watch','song to sing loudly','morning drink','coffee-shop order']},
 {t:"This or that: {x}? Guess my pick first.",type:'Guess',topic:'thisthat',v:['a lazy Sunday at home or a spontaneous day trip','mountains or beach','cooking together or ordering in','sunrise or midnight','calling or texting','books or films','sweet or savory','city lights or a quiet village','tea or coffee','old songs or new songs']},
 {t:"Describe {x} in three words. I'll go next.",type:'Share',topic:'describe',v:['your ideal Sunday','your first week at your job','your hometown','how we met','your favorite room','your perfect weekend away','your childhood home','your best friend']}],
2:[
 {t:"What are you hoping for in {x}? I'll listen first, then ask how I can help.",type:'Ask',topic:'hopes',v:['the next year','your work life','your friendships','your health and energy','how we spend weekends','our home','how we handle money','time for yourself']},
 {t:"Guess my {x}, then reveal and compare.",type:'Guess',topic:'guess',v:['biggest worry this month','happiest moment this week','dream trip','favorite thing about us','proudest moment this year','most-used app','guilty pleasure','comfort food']},
 {t:"Tell me about a time {x}. What did you need most?",type:'Ask',topic:'feel',v:['you felt overwhelmed','you felt really seen','you felt proud and nobody knew','you changed your mind about something big','you felt homesick']}],
3:[
 {t:"Compliment {x}. Be specific.",type:'Share',topic:'compliment',v:['the way I look at you','my smile','my hands','my voice when it goes quiet','the way I dance','how I kiss','what I wear when I want your attention','my laugh']},
 {t:"Write a one-line flirty note about {x} and hide it where I'll find it.",type:'Note',topic:'note',v:['the first time you wanted to kiss me','what I should wear on our next date','something you keep thinking about','tonight','the way I looked this morning','a compliment you have never said out loud']},
 {t:"Tease me about {x} in the most flirtatious way you can.",type:'Share',topic:'tease',v:['my pick-up lines','how long it took me to make a move','the way I flirt','my dance moves','how I look at you across a room','my attempts at being smooth']}]
};

const TW_UP: string[] = ["Twist: one minute of uninterrupted listening. One of you talks about anything, the other only listens.","Twist: 20 seconds of eye contact. Laughing counts.","Twist: swap roles on the next card. Whoever was going to answer now asks."];
const TW_DOWN: string[] = ["Twist: hum a song together for 30 seconds.","Twist: draw each other in 60 seconds. No judging.","Twist: swap seats and tell your partner one thing you're grateful for."];
const CLOSERS: string[] = ["Say one thing you'll remember about tonight.","Tell your partner one thing you appreciated about them tonight.","Share one moment tonight that made you smile.","Say one thing you'd like more of next time, and one thing you loved tonight."];
const ENVS: string[] = ["Plan one small thing for this weekend. Each write one word first: cozy, playful or adventurous. Reveal together and merge them.","Choose a song that will be 'ours' for the week. Play it together tomorrow morning.","Each write one thing you'd like to try together this month. Swap and pick one.","Plan a ten-minute ritual to end tonight: a tea, a stretch, a long hug. Do it now.","Tomorrow, leave a small appreciative note somewhere your partner will find it.","Tomorrow at lunchtime, send a message that starts with 'I'm still thinking about...'"];


export const LEVELS = LV;
export const TWIST_UP = TW_UP;
export const TWIST_DOWN = TW_DOWN;
export const CLOSING = CLOSERS;
export const ENVELOPES = ENVS;

export const DECK: Record<number, Card[]> = {};
for (let l = 1; l <= 8; l++) {
  const out: Card[] = [];
  (RAW[l] || []).concat(EXTRA[l] || [], HEAT[l] || []).forEach((c, i) =>
    out.push({ id: l + 'h' + i, l, text: String(c[0]), type: String(c[1]), topic: String(c[2]), t: Number(c[3] || 0) }));
  (TPL[l] || []).forEach((f, fi) => f.v.forEach((v, si) =>
    out.push({ id: l + 't' + fi + '_' + si, l, text: f.t.replace('{x}', v), type: f.type, topic: f.topic, t: 0 })));
  DECK[l] = out;
}
export const CARD_BY_ID: Record<string, Card> = {};
for (const l in DECK) for (const c of DECK[l]) CARD_BY_ID[c.id] = c;
// Couple Pass cards are known ids too, so progress (seen, parked) round-trips for them.
for (const l in PASS_DECK) for (const c of PASS_DECK[l]) CARD_BY_ID[c.id] = c;
export const TOTAL_CARDS = Object.values(DECK).reduce((a, b) => a + b.length, 0);

const GATED = new Set(['Do', 'Session', 'Scene']);

/* ---------- apart mode (long distance, on a video call) ---------- */
// Cards that need you in the same room: everything hands-on (gated types), plus a few talk cards that end in a
// shared physical act (hide a note, a hug, a hand squeeze, a token left somewhere).
const TOGETHER_TOPICS = new Set(['note', 'hugspot', 'handsignal', 'sixtyhug', 'token', 'chain1']);
/** True when a card works with the two of you apart, on a call. */
export const worksApart = (c: Card) => !GATED.has(c.type) && !TOGETHER_TOPICS.has(c.topic);
/** Twists, closing cards and envelopes that need you in one room. */
export const TOGETHER_TEXT = /swap seats|long hug|somewhere your partner will find/i;
export const isGated = (c: Card) => c.l >= 4 && GATED.has(c.type);
export const SOFT_TYPES = new Set(['Ask', 'Share', 'Note', 'Guess', 'Appreciate', 'Revisit']);
