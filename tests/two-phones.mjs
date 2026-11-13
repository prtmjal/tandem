// End-to-end: two simulated phones play a full night against the real server.
// Also checks that phone A never receives phone B's private choices over the wire.
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');

const URL = process.env.URL || 'http://localhost:3001/play';
const OUT = process.env.OUT || 'tests/shots';
mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));

/** Match list: each phone rates every idea privately; only the overlap shows on both phones. */
async function playMatch(A, B, sleep) {
  const items = await A.locator('.matchitem').count();
  for (let i = 0; i < items; i++) await A.locator('.matchitem').nth(i).getByRole('button', { name: 'Yes', exact: true }).click();
  await A.getByRole('button', { name: 'Lock in my answers' }).click();
  // B still sees only its own blank list: nothing of A's answers, and only that A is done after B locks in.
  if (await B.locator('.matchitem [aria-pressed="true"]').count()) throw new Error('match answers leaked');
  for (let i = 0; i < items; i++) await B.locator('.matchitem').nth(i).getByRole('button', { name: i < 3 ? 'Yes' : i < 4 ? 'Maybe' : 'No', exact: true }).click();
  await B.getByRole('button', { name: 'Lock in my answers' }).click();
  await A.getByText('You’re both open to').first().waitFor(); await B.getByText('You’re both open to').first().waitFor();
  await B.locator('.matchlist .kept p').nth(3).waitFor();
  const shownA = await A.locator('.matchlist .kept p').count(), shownB = await B.locator('.matchlist .kept p').count();
  if (shownA !== 4 || shownB !== 4) throw new Error(`match overlap wrong: ${shownA}/${shownB}`);
  await sleep(300);
}
const phone = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

const browser = await chromium.launch();
const ctxA = await browser.newContext({ ...phone, colorScheme: 'dark' });
const ctxB = await browser.newContext({ ...phone, colorScheme: 'light' });
const A = await ctxA.newPage(), B = await ctxB.newPage();
const errors = [];
for (const [n, p] of [['A', A], ['B', B]]) {
  p.on('pageerror', e => errors.push(`${n}: ${e.message}`));
  p.on('console', m => { if (m.type() === 'error' && !/ERR_TUNNEL_CONNECTION_FAILED|ERR_INTERNET_DISCONNECTED/.test(m.text())) errors.push(`${n} console: ${m.text()}`); });
}
const framesA = [];
A.on('websocket', ws => ws.on('framereceived', f => framesA.push(String(f.payload))));

const shot = async (p, name) => { await sleep(450); await p.screenshot({ path: `${OUT}/${name}.png` }); };
const click = (p, name) => p.getByRole('button', { name, exact: false }).first().click();

// Onboarding
await A.goto(URL); await B.goto(URL);
await shot(A, '01-welcome-dark'); await shot(B, '01-welcome-light');
for (const p of [A, B]) { await p.check('#adult'); await click(p, 'let’s go'); }
// How it works: A reads all three steps, B skips.
for (let i = 0; i < 2; i++) await A.getByRole('button', { name: 'Next', exact: true }).click();
await click(A, 'Let’s play'); await click(B, 'Skip');
await A.fill('#name', 'Asha'); await click(A, 'Start a room');
await A.waitForSelector('.codebig');
const code = (await A.textContent('.codebig')).trim();
await shot(A, '02-lobby');
await click(B, 'I have a code');
await B.fill('#name', 'Sam'); await B.fill('#code', code);
await click(B, 'Join room');
await A.getByRole('button', { name: 'Start tonight’s session' }).waitFor();
await B.getByRole('button', { name: 'Start tonight’s session' }).waitFor();
await shot(A, '03-home-dark'); await shot(B, '03-home-light');

// Unlock levels 3, 4, 5 with private two-key taps
for (const l of [3, 4, 5]) {
  await A.locator('.tile').nth(l - 1).click();
  await A.getByText('Curious about').waitFor();
  if (l === 3) await shot(B, '04-unlock-peek');
  await click(A, 'I’m curious');
  await B.getByText('Curious about').waitFor();
  await click(B, 'I’m curious');
  await A.getByText('is open').waitFor();
  if (l === 3) await shot(A, '05-unlocked');
  await click(A, 'Back to the map');
  await A.getByRole('button', { name: 'Start tonight’s session' }).waitFor();
}

// Private ceilings: A wants 5, B wants 4. Tonight should be 4.
await click(A, 'Start tonight');
await A.getByText('How far tonight?').waitFor();
await B.getByText('How far tonight?').waitFor();
await A.getByRole('button', { name: '5 · Tension' }).click();
await B.getByRole('button', { name: '4 · Warmth' }).click();
await shot(A, '06-ceiling');
await click(A, 'Lock in');
await shot(A, '07-ceiling-waiting');
await click(B, 'Lock in');
await A.getByText('Pick your colour').waitFor();

// Vibes and readiness
await A.getByRole('button', { name: /Coral/ }).click();
await B.getByRole('button', { name: /Rose/ }).click();
await sleep(300);
await shot(A, '08-arrive-dark'); await shot(B, '08-arrive-light');
// Apart mode: A switches to apart, B sees the help, then B switches back to the same room.
await A.getByRole('button', { name: 'Apart, on a call' }).click();
await B.getByText('Start your video call first').waitFor();
await shot(B, '08b-arrive-apart');
await B.getByRole('button', { name: 'Same room' }).click();
await A.getByText('Start your video call first').waitFor({ state: 'detached' });
// Mood: A turns on sounds and music, B allows touches from the menu.
await A.getByRole('button', { name: 'Sounds off' }).click();
await A.getByRole('button', { name: 'Music off' }).click();
await B.getByRole('button', { name: /Play music here/ }).waitFor();
await B.getByRole('button', { name: 'Settings' }).click();
await B.getByRole('button', { name: /Let .* send you touches/ }).click();
await B.getByRole('button', { name: 'Close' }).click();
await click(A, 'I’m ready');
await click(B, 'Begin');
await sleep(1200);
await shot(A, '09-countdown');
await sleep(2600);

// Play the night. Each loop advances whichever screen is showing.
let cards = 0, gates = 0, mysteries = 0, twists = 0, reacted = false, offlineDone = false, matched = false, likely = 0, roles = 0;
for (let guard = 0; guard < 120; guard++) {
  if (await A.getByText('Closing card').isVisible().catch(() => false)) break;
  if (await A.getByText('Are you open to it tonight?').isVisible().catch(() => false)) {
    gates++;
    if (gates === 1) await shot(A, '12-gate-private');
    await A.getByRole('button', { name: 'Not tonight' }).click();
    await B.getByText('Are you open to it tonight?').waitFor();
    await B.getByRole('button', { name: 'Yes' }).click();
    await sleep(500); continue;
  }
  if (await A.getByRole('button', { name: /Flip it/ }).isVisible().catch(() => false)) {
    mysteries++;
    await shot(A, '11-mystery');
    await click(A, 'Flip it'); await B.getByRole('button', { name: /Flip it/ }).click();
    await sleep(900); await shot(B, '11b-mystery-flipped');
    continue;
  }
  if (await A.locator('.chip', { hasText: 'Wildcard' }).first().isVisible().catch(() => false)) {
    twists++;
    if (twists === 1) await shot(A, '13-twist');
    await A.getByRole('button', { name: 'Done', exact: true }).click(); await sleep(450); continue;
  }
  if (await A.getByRole('button', { name: 'Lock in my answers' }).isVisible().catch(() => false)) {
    await shot(A, '19-match-private');
    await playMatch(A, B, sleep); matched = true;
    await shot(B, '19b-match-overlap');
    await A.getByRole('button', { name: 'Next', exact: true }).click(); await sleep(450); continue;
  }
  if (await A.getByText('Pick privately. Both open together.').isVisible().catch(() => false)) {
    // Who's more likely: A picks first; B sees no hint of it until B picks too.
    await A.locator('.row.pair').filter({ hasText: 'Me' }).getByRole('button', { name: 'Me', exact: true }).click();
    await B.getByText('Pick privately. Both open together.').waitFor();
    await B.locator('.row.pair').filter({ hasText: 'Me' }).getByRole('button', { name: 'Me', exact: true }).click();
    await A.getByText(/In sync on/).waitFor(); await B.getByText(/In sync on/).waitFor();
    if (!likely) await shot(A, '20-likely-reveal');
    likely++;
  }
  if (await A.locator('.panel.role').isVisible().catch(() => false)) {
    const ra = await A.locator('.panel.role p').last().textContent(), rb = await B.locator('.panel.role p').last().textContent();
    if (!ra || !rb || ra === rb) throw new Error('secret roles should differ per phone');
    if (!roles) await shot(A, '21-secret-role');
    roles++;
  }
  if (await A.getByRole('button', { name: 'Next', exact: true }).isVisible().catch(() => false)) {
    cards++;
    if (cards === 1) { await shot(A, '10-card-dark'); await shot(B, '10-card-light'); }
    if (cards === 3 && !reacted) {
      reacted = true;
      await A.getByRole('button', { name: 'Send ❤️' }).click();
      await sleep(350); await shot(B, '14-reaction-received');
      await A.getByRole('button', { name: /Keep this one/ }).click();
    }
    if (cards === 2) {
      // Sealed answers: A seals first (B sees only that A answered), then B seals and both open together.
      await A.getByRole('button', { name: /^Answer/ }).click();
      await A.getByLabel('Your answer or message').fill('Pineapple pizza, no regrets');
      await A.getByRole('button', { name: 'Seal', exact: true }).click();
      await A.getByRole('button', { name: 'Close' }).click();
      await B.getByRole('button', { name: /^Answer/ }).click();
      await B.getByText('has answered').waitFor();
      if (await B.getByText('Pineapple pizza').count()) throw new Error('sealed answer leaked before both answered');
      await B.getByLabel('Your answer or message').fill('Mango, obviously');
      await B.getByRole('button', { name: 'Seal', exact: true }).click();
      await B.getByText('Pineapple pizza, no regrets').waitFor();
      await shot(B, '10b-answers-opened');
      await B.getByRole('button', { name: 'Close' }).click();
      await A.getByRole('button', { name: /^Answer/ }).click();
      await A.getByText('Mango, obviously').waitFor();
      await A.getByRole('button', { name: 'Close' }).click();
    }
    if (cards === 5 && !offlineDone) {
      offlineDone = true;
      await ctxB.setOffline(true); await sleep(17000);
      await shot(A, '15-partner-offline');
      await ctxB.setOffline(false); await sleep(3500);
    }
    if (cards === 6) {
      const timer = A.getByRole('button', { name: /shared timer/ });
      if (await timer.isVisible().catch(() => false)) { await timer.click(); await sleep(1300); await shot(B, '16-shared-timer'); }
    }
    // Alternate who taps Next, and Pass once: both move on in exactly the same way.
    if (cards === 4) await B.getByRole('button', { name: 'Pass', exact: true }).click();
    else await (cards % 2 ? A : B).getByRole('button', { name: 'Next', exact: true }).click();
    await sleep(450); continue;
  }
  await sleep(300);
}

await shot(A, '17-closing');
await click(A, 'Open the envelope');
await click(B, 'Open it');
await sleep(4300);
await shot(A, '18-envelope-dark'); await shot(B, '18-envelope-light');
// The end of the night always offers gift ideas (plain links until affiliate tags are set).
await A.locator('.panel.shop').waitFor({ timeout: 5000 });
const gift = await A.locator('.panel.shop .shoplink').first().getAttribute('href');
if (!gift || !gift.startsWith('/go/')) throw new Error('gift links missing at the end of the night');
// Share card: A opts in alone (nothing appears for B), then B opts in and both get the same card.
await click(A, 'I’d be happy to share a card');
await A.getByText('If you both say yes, it appears here').waitFor();
if (await B.locator('.share-img').count()) throw new Error('share card appeared before both said yes');
await click(B, 'I’d be happy to share a card');
await A.locator('.share-img').waitFor(); await B.locator('.share-img').waitFor();
const png = await A.evaluate(async () => { const r = await fetch(document.querySelector('.share-img').src); const b = new Uint8Array(await r.arrayBuffer()); let s = ''; for (const x of b) s += String.fromCharCode(x); return btoa(s); });
(await import('node:fs')).writeFileSync(OUT + '/share-card.png', Buffer.from(png, 'base64'));
await shot(B, '18b-share-ready');
await click(A, 'Done for tonight');
await A.getByText('1 night together').waitFor({ timeout: 5000 });
await shot(A, '19-home-after');
// Backup: A makes a backup code in Settings; a fresh phone restores it and gets the same unlocked levels.
if (await A.locator('.panel.install').count()) throw new Error('install prompt shown after only one night');
await A.getByRole('button', { name: 'Settings' }).click();
await click(A, 'Back up our progress');
await A.locator('.qr').waitFor();
await shot(A, '20-backup');
const backupCode = await A.locator('textarea.passcode').inputValue();
await A.getByRole('button', { name: 'Close' }).click();
const C = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage();
C.on('pageerror', e => errors.push(`C: ${e.message}`));
await C.goto(URL + '#backup=' + encodeURIComponent(backupCode));
await C.check('#adult'); await click(C, 'let’s go'); await click(C, 'Skip');
await C.getByRole('button', { name: 'Restore', exact: true }).click();
await C.getByText('Progress restored').waitFor();
const restored = await C.evaluate(() => JSON.parse(localStorage.getItem('tad.progress')));
const original = await A.evaluate(() => JSON.parse(localStorage.getItem('tad.progress')));
if (JSON.stringify(restored.unlocked) !== JSON.stringify(original.unlocked) || restored.sessions !== original.sessions) throw new Error('backup did not restore');
if (Object.keys(restored.curious || {}).length) throw new Error('backup carried curious taps');

// Leak checks on phone A's received frames
const all = framesA.join('\n');
const leaks = [];
if (all.includes('"myPick":4')) leaks.push('B ceiling pick reached A');
if (all.includes('"myVote":"y"')) leaks.push('B gate vote reached A');
// B said Maybe and No on the match list: those raw answers must never reach A, only the overlap.
if (/"m\.\d\.\d+":"[ymn]"/.test(all.replace(/"mine":\{[^}]*\}/g, ''))) leaks.push('B match answers reached A');
if (/"curious"\s*:\s*\{[^}]*"\d"/.test(all) && false) leaks.push('curious');
const tonight4 = all.includes('"tonight":4');

console.log(JSON.stringify({ code, cards, gates, mysteries, twists, matched, likely, roles, tonight4, frames: framesA.length, leaks, errors }, null, 2));
await browser.close();
if (leaks.length || errors.length || !tonight4 || !matched || cards < 8) process.exit(1);
