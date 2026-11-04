// Backup codes: a couple's shared progress (unlocked levels, cards seen, kept cards, night count) packed into one
// copyable code. Never includes "curious" taps, which stay private to each phone. The server never sees it.
// The code is compressed and AES-GCM encrypted with a key carried inside the code, so it isn't readable plain text
// if pasted into a notes app or chat. It is not a password: anyone holding the code can restore it.
import { emptyProgress, type Progress } from '../shared/protocol';
import { mergeProgress, sanitizeProgress } from '../shared/progress';

const PREFIX = 'TADB1';
const b64 = (u: Uint8Array) => { let s = ''; for (const x of u) s += String.fromCharCode(x); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
const unb64 = (s: string) => { const t = atob(s.replace(/-/g, '+').replace(/_/g, '/')); return Uint8Array.from(t, c => c.charCodeAt(0)); };

async function pipe(data: Uint8Array, stream: CompressionStream | DecompressionStream) {
  const out = new Response(new Blob([data]).stream().pipeThrough(stream));
  return new Uint8Array(await out.arrayBuffer());
}

/** The shared part of progress only. */
export function shareable(p: Progress): Progress { return { ...p, curious: {} }; }

export async function makeBackup(p: Progress): Promise<string> {
  const json = new TextEncoder().encode(JSON.stringify(shareable(p)));
  const packed = await pipe(json, new CompressionStream('deflate-raw'));
  const raw = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt']);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, packed));
  return `${PREFIX}.${b64(raw)}.${b64(iv)}.${b64(ct)}`;
}

export async function readBackup(code: string): Promise<Progress> {
  const [v, k, i, c] = code.trim().replace(/\s+/g, '').split('.');
  if (v !== PREFIX || !k || !i || !c) throw new Error('That doesn’t look like a backup code.');
  try {
    const key = await crypto.subtle.importKey('raw', unb64(k), 'AES-GCM', false, ['decrypt']);
    const packed = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(i) }, key, unb64(c)));
    const json = await pipe(packed, new DecompressionStream('deflate-raw'));
    // Treat the contents as untrusted: keep only known cards and sane shapes, and never any curious taps.
    return { ...sanitizeProgress(JSON.parse(new TextDecoder().decode(json))), curious: {} };
  } catch { throw new Error('That backup code didn’t work. Check that you copied all of it.'); }
}

/** Merge a backup into this phone's progress, keeping this phone's own private taps. */
export function mergeBackup(mine: Progress, backup: Progress): Progress {
  return { ...mergeProgress(mine || emptyProgress(), backup), curious: { ...(mine?.curious || {}) } };
}
