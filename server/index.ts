// Tandem After Dark: room server. Serves the built web app and runs live rooms over Socket.IO.
import express from 'express';
import { createServer } from 'node:http';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Server, type Socket } from 'socket.io';
import { Room, mergeProgress, sanitizeProgress } from './game';
import { newsConfig, subscribe, validEmail } from './news';
import { STATS_PAGE, Stats } from './stats';
import { KIT, RETAILERS, affiliateUrl, plainUrl, type KitId } from '../shared/shop';
import { claim, createCheckout, hasPass, priceFor, priceLabel, storeConfig, validPasses } from './store';
import { ADULT_REQUIRED, REACTIONS, isAdultAttested, type Action } from '../shared/protocol';

const PORT = Number(process.env.PORT || 3001);
const IDLE_MS = 30 * 60 * 1000; // a room with nobody connected closes after 30 minutes
const MAX_AGE_MS = 8 * 3600 * 1000; // and every room closes after 8 hours
const TYPED_CODE_WINDOW_MS = 15 * 60 * 1000; // a typed code (without the secret link) only works for 15 minutes
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no 0/O, 1/I/L

const app = express();
const http = createServer(app);
const io = new Server(http, {
  cors: process.env.CORS_ORIGIN ? { origin: process.env.CORS_ORIGIN } : undefined, // same-origin by default
  maxHttpBufferSize: 64 * 1024,
  pingInterval: 10000, // notice a sleeping phone within about 15 seconds
  pingTimeout: 6000,
  connectionStateRecovery: { maxDisconnectionDuration: 2 * 60 * 1000 },
});

const rooms = new Map<string, Room>();
const tokens = new Map<string, { code: string; idx: 0 | 1 }>();

const newCode = () => { let c = ''; do { c = Array.from(randomBytes(6), b => ALPHABET[b % ALPHABET.length]).join(''); } while (rooms.has(c)); return c; };
const newSecret = () => randomBytes(16).toString('hex'); // 128-bit
const safeEq = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
const cleanName = (n: unknown) => String(n ?? '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 20);

/* Simple sliding-window rate limit per IP, so room codes cannot be guessed by brute force. */
const hits = new Map<string, number[]>();
function limited(key: string, max: number, windowMs: number) {
  const now = Date.now(), arr = (hits.get(key) || []).filter(t => now - t < windowMs);
  arr.push(now); hits.set(key, arr);
  return arr.length > max;
}
const ipOf = (s: Socket) => String(s.handshake.headers['x-forwarded-for'] || s.handshake.address).split(',')[0].trim();

function broadcast(room: Room) {
  for (const idx of [0, 1] as const) io.to(`${room.code}:${idx}`).emit('state', room.view(idx));
}
function sendProgress(room: Room) {
  for (const idx of [0, 1] as const) io.to(`${room.code}:${idx}`).emit('progress', room.progressFor(idx));
}

/** Adds verified pass codes to a room and hands every code to both phones (a pass then lives on both). */
function addPasses(room: Room, codes: unknown) {
  const ok = validPasses(store, codes);
  for (const c of ok) if (!room.passCodes.includes(c)) room.passCodes.push(c);
  if (room.passCodes.length) { room.pass = true; io.to(`${room.code}:0`).to(`${room.code}:1`).emit('passcodes', room.passCodes.slice(0, 5)); }
}

function attach(socket: Socket, room: Room, idx: 0 | 1) {
  socket.data.code = room.code; socket.data.idx = idx;
  socket.join(`${room.code}:${idx}`);
  room.setConnected(idx, true);
  broadcast(room);
}

io.on('connection', socket => {
  const ip = ipOf(socket);

  // Clock sync so both phones run countdowns and timers off the same moment.
  socket.on('time', (ack: (t: number) => void) => { if (typeof ack === 'function') ack(Date.now()); });

  socket.on('create', (msg: { name?: string; progress?: unknown; passes?: unknown }, ack: (r: unknown) => void) => {
    if (typeof ack !== 'function') return;
    if (!isAdultAttested(msg)) return ack({ error: ADULT_REQUIRED });
    if (limited('create:' + ip, 20, 60 * 60 * 1000)) return ack({ error: 'Too many new rooms from this network. Try again in a while.' });
    const token = newSecret();
    const room = new Room(newCode(), newSecret(), { token, name: cleanName(msg?.name) || 'Partner 1', connected: true, curious: {} }, sanitizeProgress(msg?.progress));
    room.prog.curious = {};
    room.players[0]!.curious = sanitizeProgress(msg?.progress).curious;
    addPasses(room, msg?.passes);
    rooms.set(room.code, room);
    tokens.set(token, { code: room.code, idx: 0 });
    attach(socket, room, 0);
    stats.count('created');
    ack({ code: room.code, secret: room.secret, token });
  });

  socket.on('join', (msg: { code?: string; secret?: string; name?: string; progress?: unknown; passes?: unknown }, ack: (r: unknown) => void) => {
    if (typeof ack !== 'function') return;
    if (!isAdultAttested(msg)) return ack({ error: ADULT_REQUIRED });
    if (limited('join:' + ip, 10, 60 * 1000)) return ack({ error: 'Too many tries. Wait a minute and try again.' });
    const code = String(msg?.code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const room = rooms.get(code);
    const fail = () => ack({ error: "That code didn't work. Check it with your partner, or ask them for a new invite." });
    if (!room || room.full) return fail();
    const viaLink = typeof msg?.secret === 'string' && msg.secret.length > 0;
    if (viaLink && !safeEq(msg.secret!, room.secret)) return fail();
    if (!viaLink && Date.now() - room.createdAt > TYPED_CODE_WINDOW_MS) return fail();
    const token = newSecret();
    const prog = sanitizeProgress(msg?.progress);
    room.join({ token, name: cleanName(msg?.name) || 'Partner 2', connected: true, curious: prog.curious }, prog);
    tokens.set(token, { code: room.code, idx: 1 });
    attach(socket, room, 1);
    stats.count('joined'); if (viaLink) stats.count('joinedLink');
    ack({ code: room.code, token });
    sendProgress(room);
    addPasses(room, msg?.passes); // after attach, so both phones receive every code
  });

  socket.on('resume', (msg: { token?: string }, ack: (r: unknown) => void) => {
    if (typeof ack !== 'function') return;
    if (limited('resume:' + ip, 30, 60 * 1000)) return ack({ error: 'Too many tries.' });
    const t = tokens.get(String(msg?.token || ''));
    const room = t && rooms.get(t.code);
    if (!t || !room) return ack({ error: 'gone' });
    attach(socket, room, t.idx);
    ack({ code: room.code, secret: t.idx === 0 && !room.full ? room.secret : undefined });
  });

  socket.on('act', (x: Action) => {
    const room = rooms.get(socket.data.code); const idx = socket.data.idx as 0 | 1 | undefined;
    if (!room || idx === undefined || !x || typeof x.a !== 'string') return;
    if (limited('act:' + socket.id, 40, 10 * 1000)) return;
    const before = room.prog.sessions, unlockedBefore = room.prog.unlocked.length, phaseBefore = room.phase, sharedBefore = !!room.close?.shareQ && !!room.view(idx).close?.shareCard;
    const out = room.act(idx, x);
    if (phaseBefore !== 'card' && room.phase === 'card') { stats.count('nights'); if (room.apart) stats.count('nightsApart'); }
    if (room.prog.sessions > before) stats.count('finished');
    if (x.a === 'share' && !sharedBefore && room.view(idx).close?.shareCard) stats.count('shared');
    broadcast(room);
    if (out.celebrate?.length) io.to(`${room.code}:0`).to(`${room.code}:1`).emit('celebrate', out.celebrate);
    if (room.prog.sessions !== before || room.prog.unlocked.length !== unlockedBefore || x.a === 'unlock:vote' || x.a === 'gate') sendProgress(room);
  });

  // Floating reactions are relayed to the partner and never stored.
  socket.on('react', (r: string) => {
    const room = rooms.get(socket.data.code); const idx = socket.data.idx as 0 | 1 | undefined;
    if (!room || idx === undefined || !(REACTIONS as readonly string[]).includes(r)) return;
    if (limited('react:' + socket.id, 20, 5 * 1000)) return;
    io.to(`${room.code}:${idx === 0 ? 1 : 0}`).emit('react', r);
  });

  // A backup restored on this phone while in a room: merge it into the room's shared progress (never curious taps).
  socket.on('restore', (p: unknown) => {
    const room = rooms.get(socket.data.code); const idx = socket.data.idx as 0 | 1 | undefined;
    if (!room || idx === undefined) return;
    if (limited('restore:' + socket.id, 5, 60 * 1000)) return;
    room.prog = mergeProgress(room.prog, { ...sanitizeProgress(p), curious: {} });
    broadcast(room); sendProgress(room);
  });

  // A pass bought or restored mid-night turns the pass on for this room.
  socket.on('pass', (codes: unknown) => {
    const room = rooms.get(socket.data.code); const idx = socket.data.idx as 0 | 1 | undefined;
    if (!room || idx === undefined) return;
    if (limited('pass:' + socket.id, 10, 60 * 1000)) return;
    const had = room.pass;
    addPasses(room, codes);
    if (room.pass && !had) broadcast(room);
  });

  // "Send a touch": one pulse relayed to the partner, only if they have allowed touches. Never stored.
  socket.on('touch', () => {
    const room = rooms.get(socket.data.code); const idx = socket.data.idx as 0 | 1 | undefined;
    if (!room || idx === undefined) return;
    const other = idx === 0 ? 1 : 0;
    if (!room.players[other]?.allowTouch) return;
    if (limited('touch:' + socket.id, 20, 15 * 1000)) return; // at most ~60 bpm for 15 seconds
    io.to(`${room.code}:${other}`).emit('touch');
  });

  socket.on('leaveRoom', () => {
    const room = rooms.get(socket.data.code); const idx = socket.data.idx as 0 | 1 | undefined;
    if (!room || idx === undefined) return;
    const p = room.players[idx]; if (p) tokens.delete(p.token);
    room.players[idx] = null;
    socket.leave(`${room.code}:${idx}`);
    if (!room.players[0] && !room.players[1]) rooms.delete(room.code);
    else broadcast(room);
    socket.data.code = undefined;
  });

  socket.on('disconnect', () => {
    const room = rooms.get(socket.data.code); const idx = socket.data.idx as 0 | 1 | undefined;
    if (!room || idx === undefined) return;
    const still = io.sockets.adapter.rooms.get(`${room.code}:${idx}`)?.size || 0;
    if (!still) { room.setConnected(idx, false); broadcast(room); }
  });
});

/* Close idle and old rooms. Nothing about a room is kept after it closes. */
setInterval(() => {
  const now = Date.now();
  for (const [code, room] of rooms) {
    const anyone = room.players.some(p => p?.connected);
    if (now - room.createdAt > MAX_AGE_MS || (!anyone && now - room.lastActive > IDLE_MS)) {
      for (const p of room.players) if (p) tokens.delete(p.token);
      for (const idx of [0, 1]) io.to(`${code}:${idx}`).emit('closed');
      rooms.delete(code);
    }
  }
  for (const [k, arr] of hits) if (!arr.some(t => now - t < 3600 * 1000)) hits.delete(k);
}, 60 * 1000).unref();

app.disable('x-powered-by');
app.set('trust proxy', 1); // hosts terminate HTTPS in front of us; use their forwarded protocol for payment return links
app.use((_, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});
/* ---------------- usage counts (totals only, see server/stats.ts) ---------------- */
const stats = new Stats(process.env.STATS_FILE);
let lastLogged = new Date().toISOString().slice(0, 10);
setInterval(() => {
  stats.save();
  const today = new Date().toISOString().slice(0, 10);
  if (today !== lastLogged) { console.log(stats.logLine(lastLogged)); lastLogged = today; }
}, 60_000).unref();
for (const sig of ['SIGTERM', 'SIGINT'] as const) process.on(sig, () => { stats.save(); console.log(stats.logLine()); process.exit(0); });
const statsToken = process.env.STATS_TOKEN && process.env.STATS_TOKEN.length >= 16 ? process.env.STATS_TOKEN : null;
app.get('/api/stats', (req, res) => {
  if (!statsToken) return res.status(404).end();
  const auth = String(req.headers.authorization || '');
  const a = Buffer.from(auth), b = Buffer.from('Bearer ' + statsToken);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return res.status(401).json({ error: 'Wrong token' });
  res.setHeader('Cache-Control', 'no-store');
  res.json(stats.report(Math.min(120, Math.max(1, Number(req.query.days) || 30))));
});
app.get('/stats', (_, res) => {
  if (!statsToken) return res.status(404).end();
  res.setHeader('Cache-Control', 'no-store');
  res.type('html').send(STATS_PAGE);
});

/* ---------------- Couple Pass (off unless Stripe is configured) ---------------- */
const store = storeConfig();
const countryOf = (h: Record<string, unknown>) => String(h['cf-ipcountry'] || h['x-vercel-ip-country'] || h['fly-client-ip-country'] || '').slice(0, 2) || undefined;
const reqIp = (req: express.Request) => String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
app.get('/api/store', async (req, res) => {
  if (!store) return res.json({ enabled: false });
  res.json({ enabled: true, price: await priceLabel(store, priceFor(store, countryOf(req.headers))) });
});
app.post('/api/checkout', express.json({ limit: '2kb' }), async (req, res) => {
  if (!store) return res.status(404).json({ error: 'Payments are not set up.' });
  if (limited('checkout:' + reqIp(req), 10, 60 * 60 * 1000)) return res.status(429).json({ error: 'Too many tries. Try again later.' });
  try { stats.count('checkout'); res.json({ url: await createCheckout(store, process.env.PUBLIC_URL || `${req.protocol}://${req.get('host')}`, countryOf(req.headers)) }); }
  catch { res.status(502).json({ error: 'Couldn’t reach the payment page. Try again in a moment.' }); }
});
app.post('/api/claim', express.json({ limit: '2kb' }), async (req, res) => {
  if (!store) return res.status(404).json({ error: 'Payments are not set up.' });
  if (limited('claim:' + reqIp(req), 20, 60 * 60 * 1000)) return res.status(429).json({ error: 'Too many tries. Try again later.' });
  try {
    const code = await claim(store, req.body?.session);
    if (!code) return res.status(402).json({ error: 'That payment isn’t complete yet.' });
    stats.count('purchased');
    res.json({ code });
  } catch { res.status(502).json({ error: 'Couldn’t confirm the payment. Try again in a moment.' }); }
});
app.post('/api/verify', express.json({ limit: '2kb' }), (req, res) => {
  if (limited('verify:' + reqIp(req), 30, 60 * 60 * 1000)) return res.status(429).json({ ok: false });
  res.json({ ok: hasPass(store, [req.body?.code]) });
});

/* ---------------- shop links (affiliate; each retailer off unless its template is set) ---------------- */
// Shops show as plain links until their affiliate template is set; then they become paid links. SHOP_OFF=1 hides all.
const shopOff = () => process.env.SHOP_OFF === '1';
// Which retailers are available, and which are paid. The phone decides the country itself; we never look up who asks.
app.get('/api/shop', (_, res) => res.json({
  retailers: shopOff() ? [] : Object.values(RETAILERS).map(r => ({ id: r.id, paid: !!affiliateUrl(r, process.env[r.env]) })),
}));
// The outbound redirect: counts one daily total, adds nothing about the person, and leaves with no referrer.
app.get('/go/:retailer/:item?', (req, res) => {
  const r = RETAILERS[req.params.retailer];
  const item = req.params.item && req.params.item in KIT ? (req.params.item as KitId) : undefined;
  const url = r && !shopOff() ? affiliateUrl(r, process.env[r.env], item) ?? plainUrl(r, item) : null;
  if (!url) return res.status(404).send('This link isn’t available.');
  if (!limited('go:' + reqIp(req), 60, 60 * 1000)) stats.count('shopClick');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.redirect(302, url);
});

/* ---------------- email list (off unless Klaviyo is configured) ---------------- */
const news = newsConfig();
app.get('/api/news', (_, res) => res.json({ enabled: !!news }));
app.post('/api/news', express.json({ limit: '1kb' }), async (req, res) => {
  if (!news) return res.status(404).json({ error: 'The email list isn’t open yet.' });
  if (limited('news:' + reqIp(req), 5, 60 * 60 * 1000)) return res.status(429).json({ error: 'Too many tries. Try again later.' });
  const email = req.body?.email;
  if (!validEmail(email)) return res.status(400).json({ error: 'That email address doesn’t look right.' });
  try { await subscribe(news, email); stats.count('newsSignup'); res.json({ ok: true }); }
  catch { res.status(502).json({ error: 'Couldn’t sign you up just now. Try again in a moment.' }); }
});

app.get('/healthz', (_, res) => res.json({ ok: true, rooms: rooms.size }));

// Serve the built web app whenever it exists (after `npm run build`). In dev, Vite serves it instead.
const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
if (existsSync(path.join(dist, 'index.html'))) {
  app.use(express.static(dist, { maxAge: '1h', index: false }));
  // The game lives at /play; everything else gets the landing page. Old invite links (/?j=...) are sent to /play.
  app.get(['/play', '/play/*'], (_, res) => { stats.count('play'); res.sendFile(path.join(dist, 'play.html')); });
  app.get('/privacy', (_, res) => res.sendFile(path.join(dist, 'privacy.html')));
  app.get('*', (req, res) => {
    if (typeof req.query.j === 'string') return res.redirect(302, '/play?j=' + encodeURIComponent(req.query.j));
    if (req.path === '/') stats.count('landing');
    res.sendFile(path.join(dist, 'index.html'));
  });
}

http.listen(PORT, () => console.log(`Tandem After Dark server on :${PORT}`));
