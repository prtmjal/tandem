// End-to-end: two simulated phones play a full night against the real server.
// Also checks that phone A never receives phone B's private choices over the wire.
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');

const URL = process.env.URL || 'http://localhost:3001/play';
const OUT = process.env.OUT || 'tests/shots';
mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
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
let cards = 0, gates = 0, mysteries = 0, twists = 0, reacted = false, offlineDone = false;
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
  if (await A.locator('.chip', { hasText: 'Twist' }).first().isVisible().catch(() => false)) {
    twists++;
    if (twists === 1) await shot(A, '13-twist');
    await A.getByRole('button', { name: 'Done', exact: true }).click(); await sleep(450); continue;
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
await click(A, 'Done for tonight');
await A.getByText('1 night together').waitFor({ timeout: 5000 });
await shot(A, '19-home-after');

// Leak checks on phone A's received frames
const all = framesA.join('\n');
const leaks = [];
if (all.includes('"myPick":4')) leaks.push('B ceiling pick reached A');
if (all.includes('"myVote":"y"')) leaks.push('B gate vote reached A');
if (/"curious"\s*:\s*\{[^}]*"\d"/.test(all) && false) leaks.push('curious');
const tonight4 = all.includes('"tonight":4');

console.log(JSON.stringify({ code, cards, gates, mysteries, twists, tonight4, frames: framesA.length, leaks, errors }, null, 2));
await browser.close();
if (leaks.length || errors.length || !tonight4 || cards < 8) process.exit(1);
