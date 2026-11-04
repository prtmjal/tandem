// Couple Pass end to end with a fake Stripe: buy on one phone, both phones get the pass decks.
// Starts its own game server (port 3002) and fake Stripe (port 4010). Needs `npm run build` first.
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');

const sessions = new Map();
const stripe = createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  const send = (o, code = 200) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(o)); };
  if (req.method === 'GET' && u.pathname.startsWith('/v1/prices/')) return send({ unit_amount: 1999, currency: 'usd' });
  if (req.method === 'POST' && u.pathname === '/v1/checkout/sessions') {
    let body = ''; req.on('data', d => (body += d)); req.on('end', () => {
      const f = new URLSearchParams(body), id = 'cs_test_' + Math.random().toString(36).slice(2, 12);
      sessions.set(id, { paid: false, success: f.get('success_url').replace('{CHECKOUT_SESSION_ID}', id) });
      send({ url: `http://localhost:4010/pay/${id}` });
    }); return;
  }
  if (u.pathname.startsWith('/pay/')) { const s = sessions.get(u.pathname.slice(5)); s.paid = true; res.writeHead(302, { Location: s.success }); return res.end(); }
  if (req.method === 'GET' && u.pathname.startsWith('/v1/checkout/sessions/')) {
    const s = sessions.get(u.pathname.split('/').pop());
    return s ? send({ payment_status: s.paid ? 'paid' : 'unpaid', metadata: { sku: 'pass' } }) : send({ error: { message: 'no such session' } }, 404);
  }
  send({ error: { message: 'not found' } }, 404);
}).listen(4010);

const srv = spawn('node', ['dist-server/index.js'], { env: { ...process.env, PORT: '3002', STRIPE_SECRET_KEY: 'sk_test_fake', STRIPE_PRICE_PASS: 'price_test', LICENSE_SECRET: 'z'.repeat(40), STRIPE_API_BASE: 'http://localhost:4010' }, stdio: 'ignore' });
await new Promise(r => setTimeout(r, 1500));
const PLAY = 'http://localhost:3002/play';
const errors = [];
let ok = false;
const browser = await chromium.launch();
try {
  const [A, B] = await Promise.all([1, 2].map(async () => (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage()));
  for (const [n, p] of [['A', A], ['B', B]]) p.on('pageerror', e => errors.push(`${n}: ${e.message}`));
  const click = (p, name) => p.getByRole('button', { name, exact: false }).first().click();
  for (const p of [A, B]) { await p.goto(PLAY); await p.check('#adult'); await click(p, 'let’s go'); await click(p, 'Skip'); }
  await A.fill('#name', 'Asha'); await click(A, 'Start a room');
  await A.waitForSelector('.codebig');
  const code = (await A.textContent('.codebig')).trim();
  await click(B, 'I have a code'); await B.fill('#name', 'Sam'); await B.fill('#code', code); await click(B, 'Join room');
  await A.getByRole('button', { name: /Get the Couple Pass · \$19\.99/ }).waitFor();
  await A.locator('.panel.pass').scrollIntoViewIfNeeded(); await A.screenshot({ path: 'tests/shots/pass-offer.png' });
  await click(A, 'Get the Couple Pass');
  await A.getByText('Couple Pass is on for both of you').waitFor({ timeout: 15000 });
  await A.getByText(/On for both of you/).waitFor();
  await B.getByText(/On for both of you/).waitFor();
  await B.locator('.panel.pass').scrollIntoViewIfNeeded(); await B.screenshot({ path: 'tests/shots/pass-on.png' });
  // The code works on a brand-new phone too.
  const passCode = await A.evaluate(() => JSON.parse(localStorage.getItem('tad.passes'))[0]);
  const C = await (await browser.newContext()).newPage();
  await C.goto('http://localhost:3002/play');
  const verify = await C.evaluate(async c => (await fetch('/api/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: c }) })).json(), passCode);
  const forged = await C.evaluate(async c => (await fetch('/api/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: c.slice(0, -2) + 'xx' }) })).json(), passCode);
  ok = verify.ok === true && forged.ok === false && errors.length === 0;
  console.log(JSON.stringify({ passOnBothPhones: true, restoreWorks: verify.ok, forgedRejected: !forged.ok, errors }, null, 2));
} catch (e) { console.error(e); } finally { await browser.close(); srv.kill(); stripe.close(); process.exit(ok ? 0 : 1); }
