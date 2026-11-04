// Tandem After Dark: room server. Serves the built web app and runs live rooms over Socket.IO.
import express from 'express';
import { createServer } from 'node:http';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Server, type Socket } from 'socket.io';
import { Room, sanitizeProgress } from './game';
import { REACTIONS, type Action } from '../shared/protocol';

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

  socket.on('create', (msg: { name?: string; progress?: unknown }, ack: (r: unknown) => void) => {
    if (typeof ack !== 'function') return;
    if (limited('create:' + ip, 20, 60 * 60 * 1000)) return ack({ error: 'Too many new rooms from this network. Try again in a while.' });
    const token = newSecret();
    const room = new Room(newCode(), newSecret(), { token, name: cleanName(msg?.name) || 'Partner 1', connected: true, curious: {} }, sanitizeProgress(msg?.progress));
    room.prog.curious = {};
    room.players[0]!.curious = sanitizeProgress(msg?.progress).curious;
    rooms.set(room.code, room);
    tokens.set(token, { code: room.code, idx: 0 });
    attach(socket, room, 0);
    ack({ code: room.code, secret: room.secret, token });
  });

  socket.on('join', (msg: { code?: string; secret?: string; name?: string; progress?: unknown }, ack: (r: unknown) => void) => {
    if (typeof ack !== 'function') return;
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
    ack({ code: room.code, token });
    sendProgress(room);
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
    const before = room.prog.sessions, unlockedBefore = room.prog.unlocked.length;
    const out = room.act(idx, x);
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
app.use((_, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});
app.get('/healthz', (_, res) => res.json({ ok: true, rooms: rooms.size }));

// Serve the built web app whenever it exists (after `npm run build`). In dev, Vite serves it instead.
const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
if (existsSync(path.join(dist, 'index.html'))) {
  app.use(express.static(dist, { maxAge: '1h', index: false }));
  app.get('*', (_, res) => res.sendFile(path.join(dist, 'index.html')));
}

http.listen(PORT, () => console.log(`Tandem After Dark server on :${PORT}`));
