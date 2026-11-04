// Connection to the room server, plus everything this phone keeps for itself.
import { io, type Socket } from 'socket.io-client';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { emptyProgress, type Action, type Progress, type View } from '../shared/protocol';

const K = { age: 'tad.age2', name: 'tad.name', prog: 'tad.progress', sess: 'tad.session', vibe: 'tad.vibe', mode: 'tad.mode', sound: 'tad.haptics', plain: 'tad.plain' };
export const store = {
  get(k: string) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* storage blocked: keep going */ } },
  del(k: string) { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};
export const keys = K;

export function loadProgress(): Progress {
  try { const p = JSON.parse(store.get(K.prog) || 'null'); if (p && p.v === 1) return { ...emptyProgress(), ...p }; } catch { /* corrupt */ }
  return emptyProgress();
}
export const saveProgress = (p: Progress) => store.set(K.prog, JSON.stringify(p));

interface Saved { code: string; token: string; secret?: string }
const loadSaved = (): Saved | null => { try { return JSON.parse(store.get(K.sess) || 'null'); } catch { return null; } };

type Status = 'idle' | 'connecting' | 'online' | 'offline';
type Listener = () => void;

class Net {
  socket: Socket;
  view: View | null = null;
  status: Status = 'idle';
  saved: Saved | null = loadSaved();
  offset = 0; // serverTime - localTime
  private ls = new Set<Listener>();
  private snap = { view: this.view, status: this.status, saved: this.saved };
  onReact: ((r: string) => void) | null = null;
  onCelebrate: ((levels: number[]) => void) | null = null;
  onTouch: (() => void) | null = null;

  constructor() {
    this.socket = io({ autoConnect: false, transports: ['websocket', 'polling'] });
    this.socket.on('connect', () => { this.setStatus('online'); this.syncClock(); if (this.saved) this.resume(); });
    this.socket.on('disconnect', () => this.setStatus('offline'));
    this.socket.on('connect_error', () => this.setStatus('offline'));
    this.socket.on('state', (v: View) => { this.view = v; this.emit(); });
    this.socket.on('progress', (p: Progress) => saveProgress(p));
    this.socket.on('react', (r: string) => this.onReact?.(r));
    this.socket.on('celebrate', (l: number[]) => this.onCelebrate?.(l));
    this.socket.on('touch', () => this.onTouch?.());
    this.socket.on('closed', () => this.forget());
    // Re-sync whenever the phone wakes up or comes back online.
    if (typeof document !== 'undefined') document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') { if (!this.socket.connected) this.socket.connect(); else if (this.saved) this.resume(); }
    });
    if (this.saved) this.connect();
  }
  subscribe = (l: Listener) => { this.ls.add(l); return () => this.ls.delete(l); };
  getSnap = () => this.snap;
  private emit() { this.snap = { view: this.view, status: this.status, saved: this.saved }; this.ls.forEach(l => l()); }
  private setStatus(s: Status) { this.status = s; this.emit(); }
  connect() { if (!this.socket.connected) { this.setStatus('connecting'); this.socket.connect(); } }
  now() { return Date.now() + this.offset; }

  private syncClock() {
    const best: number[] = [];
    let n = 0;
    const ping = () => {
      const t0 = Date.now();
      this.socket.timeout(3000).emit('time', (err: unknown, server: number) => {
        if (!err) { const t1 = Date.now(); best.push(server - (t0 + (t1 - t0) / 2)); }
        if (++n < 4) setTimeout(ping, 150); else if (best.length) this.offset = best.sort((a, b) => a - b)[Math.floor(best.length / 2)];
      });
    };
    ping();
  }

  private save(s: Saved | null) { this.saved = s; if (s) store.set(K.sess, JSON.stringify(s)); else store.del(K.sess); this.emit(); }

  private call<T>(ev: string, msg: unknown): Promise<T> {
    this.connect();
    return new Promise((resolve, reject) => {
      this.socket.timeout(8000).emit(ev, msg, (err: unknown, res: T & { error?: string }) => {
        if (err) reject(new Error("Couldn't reach the server. Check your connection and try again."));
        else if (res?.error) reject(new Error(res.error));
        else resolve(res);
      });
    });
  }
  async create(name: string) {
    const r = await this.call<{ code: string; secret: string; token: string }>('create', { name, adult: true, progress: loadProgress() });
    this.save({ code: r.code, token: r.token, secret: r.secret });
    return r;
  }
  async join(code: string, name: string, secret?: string) {
    const r = await this.call<{ code: string; token: string }>('join', { code, name, secret, adult: true, progress: loadProgress() });
    this.save({ code: r.code, token: r.token });
  }
  private resume() {
    const s = this.saved; if (!s) return;
    this.socket.timeout(8000).emit('resume', { token: s.token }, (err: unknown, r: { error?: string; secret?: string }) => {
      if (err) return;
      if (r?.error) { this.forget(); return; }
      if (r.secret !== s.secret) this.save({ ...s, secret: r.secret });
    });
  }
  act(x: Action) { this.socket.emit('act', x); }
  react(r: string) { this.socket.emit('react', r); }
  touch() { this.socket.emit('touch'); }
  forget() { this.socket.emit('leaveRoom'); this.view = null; this.save(null); }
}

export const net = new Net();
export function useNet() { return useSyncExternalStore(net.subscribe, net.getSnap); }

/** Seconds left until a server timestamp, ticking. */
export function useCountdown(at: number | null) {
  const [left, setLeft] = useState(() => (at ? Math.max(0, at - net.now()) : 0));
  const raf = useRef(0);
  useEffect(() => {
    if (!at) { setLeft(0); return; }
    const tick = () => { const l = Math.max(0, at - net.now()); setLeft(l); if (l > 0) raf.current = window.setTimeout(tick, 100); };
    tick();
    return () => clearTimeout(raf.current);
  }, [at]);
  return left;
}

/* ---------- small device helpers ---------- */

export function useWakeLock(on: boolean) {
  useEffect(() => {
    if (!on || !('wakeLock' in navigator)) return;
    let lock: WakeLockSentinel | null = null, live = true;
    const req = async () => { try { lock = await navigator.wakeLock.request('screen'); } catch { /* denied: fine */ } };
    const vis = () => { if (document.visibilityState === 'visible' && live) req(); };
    req(); document.addEventListener('visibilitychange', vis);
    return () => { live = false; document.removeEventListener('visibilitychange', vis); lock?.release().catch(() => {}); };
  }, [on]);
}
