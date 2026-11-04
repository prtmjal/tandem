// Saved progress: merging two copies and cleaning an untrusted one. Used by the server (two phones joining a
// room) and by the phone (restoring a backup code).
import { CARD_BY_ID } from './content';
import { emptyProgress, type Progress } from './protocol';

/** Merge two phones' saved progress. Each phone's private taps stay with that player. */
export function mergeProgress(a: Progress, b: Progress): Progress {
  const out = emptyProgress();
  out.unlocked = Array.from(new Set([...(a.unlocked || []), ...(b.unlocked || []), 1, 2])).filter(l => l >= 1 && l <= 8).sort((x, y) => x - y);
  for (const src of [a, b]) {
    for (const k in src.seen || {}) out.seen[k] = Array.from(new Set([...(out.seen[k] || []), ...src.seen[k]]));
    for (const k in src.last || {}) out.last[k] = Array.from(new Set([...(out.last[k] || []), ...src.last[k]]));
    for (const k in src.parked || {}) out.parked[k] = Math.max(out.parked[k] || 0, src.parked[k]);
  }
  const caps = new Map<number, { d: number; items: string[] }>();
  for (const c of [...(a.capsule || []), ...(b.capsule || [])]) caps.set(c.d, c);
  out.capsule = Array.from(caps.values()).sort((x, y) => x.d - y.d).slice(-50);
  out.sessions = Math.max(a.sessions || 0, b.sessions || 0);
  return out;
}

/** Keep only known card IDs and sane shapes from an uploaded progress blob. */
export function sanitizeProgress(p: unknown): Progress {
  const out = emptyProgress();
  if (!p || typeof p !== 'object') return out;
  const q = p as Partial<Progress>;
  const ids = (x: unknown) => (Array.isArray(x) ? x.filter(i => typeof i === 'string' && CARD_BY_ID[i]).slice(0, 2000) : []);
  if (Array.isArray(q.unlocked)) out.unlocked = q.unlocked.filter(l => Number.isInteger(l) && l >= 1 && l <= 8);
  for (let l = 1; l <= 8; l++) { const k = String(l); if (q.seen?.[k]) out.seen[k] = ids(q.seen[k]); if (q.last?.[k]) out.last[k] = ids(q.last[k]); }
  if (q.parked && typeof q.parked === 'object') for (const k in q.parked) if (CARD_BY_ID[k] && typeof q.parked[k] === 'number') out.parked[k] = q.parked[k];
  if (Array.isArray(q.capsule)) out.capsule = q.capsule.filter(c => c && typeof c.d === 'number' && Array.isArray(c.items))
    .map(c => ({ d: c.d, items: c.items.filter(s => typeof s === 'string').slice(0, 20).map(s => s.slice(0, 400)) })).slice(-50);
  if (typeof q.sessions === 'number') out.sessions = Math.max(0, Math.floor(q.sessions));
  if (q.curious && typeof q.curious === 'object') for (const k in q.curious) if (/^[3-8]$/.test(k) && typeof q.curious[k] === 'number') out.curious[k] = q.curious[k];
  return out;
}
