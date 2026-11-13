// A full night apart on two simulated phones: inline answers, private votes on video cards, envelope and gift ideas.
// Needs the server running on :3001 (npm run build && npm start).
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const PLAY = process.env.URL || 'http://localhost:3001/play';
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
const browser = await chromium.launch();
const errors = [];
let out = { cards: 0, apartCards: 0, gates: 0, sealed: false, gift: false };
try {
  const [A, B] = await Promise.all([1, 2].map(async () => (await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'en-GB', timezoneId: 'Europe/London' })).newPage()));
  for (const [n, p] of [['A', A], ['B', B]]) p.on('pageerror', e => errors.push(`${n}: ${e.message}`));
  const click = (p, name) => p.getByRole('button', { name, exact: false }).first().click();
  for (const p of [A, B]) { await p.goto(PLAY); await p.check('#adult'); await click(p, 'let’s go'); await click(p, 'Skip'); }
  await A.fill('#name', 'Asha'); await click(A, 'Start a room');
  await A.waitForSelector('.codebig'); const code = (await A.textContent('.codebig')).trim();
  await click(B, 'I have a code'); await B.fill('#name', 'Sam'); await B.fill('#code', code); await click(B, 'Join room');
  // Open Level 5 for both, then play up to it, apart.
  await A.getByRole('button', { name: 'Start tonight’s session' }).waitFor();
  for (const l of [3, 4, 5]) {
    await A.locator('.tile').nth(l - 1).click();
    await click(A, 'I’m curious'); await B.getByRole('button', { name: 'I’m curious' }).click();
    await click(A, 'Back to the map');
  }
  await click(A, 'Start tonight');
  await A.getByRole('button', { name: /5 · Tension/ }).click(); await B.getByRole('button', { name: /5 · Tension/ }).click();
  await click(A, 'Lock in'); await click(B, 'Lock in');
  await A.getByRole('button', { name: 'Apart, on a call' }).click();
  await click(A, 'I’m ready'); await click(B, 'Begin');
  await sleep(3800);
  let guard = 0;
  while (guard++ < 120) {
    if (await A.getByText('For this week').isVisible().catch(() => false)) break;
    if (await A.getByRole('button', { name: 'Open the envelope together' }).isVisible().catch(() => false)) break;
    if (await A.getByText('Are you open to it tonight?').isVisible().catch(() => false)) {
      out.gates++;
      await A.getByRole('button', { name: 'Yes' }).click(); await B.getByRole('button', { name: 'Yes' }).click();
      await sleep(500); continue;
    }
    if (await A.getByRole('button', { name: /Flip it/ }).isVisible().catch(() => false)) {
      await click(A, 'Flip it'); await B.getByRole('button', { name: /Flip it/ }).click(); await sleep(900); continue;
    }
    if (await A.getByRole('button', { name: 'Done', exact: true }).isVisible().catch(() => false)) {
      await A.getByRole('button', { name: 'Done', exact: true }).click(); await sleep(450); continue;
    }
    if (await A.getByRole('button', { name: 'Lock in my answers' }).isVisible().catch(() => false)) {
      await playMatch(A, B, sleep); out.matched = true;
      await A.getByRole('button', { name: 'Next', exact: true }).click(); await sleep(450); continue;
    }
    if (await A.getByRole('button', { name: 'Next', exact: true }).isVisible().catch(() => false)) {
      out.cards++;
      const inline = A.locator('.chat.compact textarea');
      if (!(await inline.isVisible().catch(() => false))) throw new Error('inline answer box missing on a night apart');
      if (!out.sealed) {
        // Seal an answer on both phones; B must not see A's text before sealing.
        await inline.fill('Seen from far away'); await A.locator('.chat.compact').getByRole('button', { name: 'Seal' }).click();
        await sleep(400);
        if (await B.getByText('Seen from far away').count()) throw new Error('sealed answer leaked apart');
        await B.locator('.chat.compact textarea').fill('Missing you'); await B.locator('.chat.compact').getByRole('button', { name: 'Seal' }).click();
        await A.getByText('Missing you').waitFor(); out.sealed = true;
      }
      await A.getByRole('button', { name: 'Next', exact: true }).click(); await sleep(450); continue;
    }
    await sleep(300);
  }
  await click(A, 'Open the envelope'); await click(B, 'Open it'); await sleep(4300);
  await A.locator('.panel.shop').waitFor({ timeout: 5000 }); out.gift = true;
  await A.screenshot({ path: 'tests/shots/apart-end.png', fullPage: true });
  console.log(JSON.stringify({ ...out, errors }, null, 2));
  process.exitCode = errors.length || !out.sealed || !out.matched || out.cards < 8 ? 1 : 0;
} catch (e) { console.error(e); process.exitCode = 1; } finally { await browser.close(); }
