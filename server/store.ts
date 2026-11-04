// Couple Pass: a one-time purchase through Stripe Checkout. No database and no accounts.
// After payment the server checks the Checkout Session with Stripe and hands the phone a signed pass code.
// The phone keeps the code; bringing it into a room turns the pass on for both partners.
//
// Payments stay off unless STRIPE_SECRET_KEY, STRIPE_PRICE_PASS and LICENSE_SECRET are all set, so the game is
// free by default. Optional regional prices: STRIPE_PRICE_PASS_IN, STRIPE_PRICE_PASS_BR, ... (ISO country code),
// chosen from the host's country header (cf-ipcountry, x-vercel-ip-country, fly-client-ip-country) when present.
import { createHmac, timingSafeEqual } from 'node:crypto';

export type Sku = 'pass';

export interface StoreConfig { key: string; price: string; secret: string; regional: Record<string, string>; api: string }

export function storeConfig(env: NodeJS.ProcessEnv = process.env): StoreConfig | null {
  const key = env.STRIPE_SECRET_KEY, price = env.STRIPE_PRICE_PASS, secret = env.LICENSE_SECRET;
  if (!key || !price || !secret || secret.length < 32) return null;
  const regional: Record<string, string> = {};
  for (const k in env) { const m = /^STRIPE_PRICE_PASS_([A-Z]{2})$/.exec(k); if (m && env[k]) regional[m[1]] = env[k]!; }
  return { key, price, secret, regional, api: env.STRIPE_API_BASE || 'https://api.stripe.com' };
}

/* ---------------- signed pass codes ---------------- */
const b64 = (b: Buffer | string) => Buffer.from(b).toString('base64url');

/** A pass code is "TAD1.<payload>.<signature>". The payload holds only the SKU, Stripe's session id and a timestamp. */
export function signLicense(secret: string, sku: Sku, sid: string, iat = Date.now()) {
  const payload = b64(JSON.stringify({ s: sku, i: sid, t: iat }));
  const sig = b64(createHmac('sha256', secret).update('TAD1.' + payload).digest()).slice(0, 32);
  return `TAD1.${payload}.${sig}`;
}

export function verifyLicense(secret: string, code: unknown): { sku: Sku; sid: string } | null {
  if (typeof code !== 'string' || code.length > 400) return null;
  const [v, payload, sig] = code.trim().split('.');
  if (v !== 'TAD1' || !payload || !sig) return null;
  const want = b64(createHmac('sha256', secret).update('TAD1.' + payload).digest()).slice(0, 32);
  const a = Buffer.from(sig), b = Buffer.from(want);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const p = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return p && p.s === 'pass' && typeof p.i === 'string' ? { sku: 'pass', sid: p.i } : null;
  } catch { return null; }
}

/** True when any of the given codes is a valid Couple Pass. */
export function hasPass(cfg: StoreConfig | null, codes: unknown): boolean {
  if (!cfg || !Array.isArray(codes)) return false;
  return codes.slice(0, 5).some(c => verifyLicense(cfg.secret, c)?.sku === 'pass');
}

/* ---------------- Stripe (REST, no SDK) ---------------- */
async function stripe(cfg: StoreConfig, method: 'GET' | 'POST', path: string, form?: Record<string, string>) {
  const r = await fetch(cfg.api + path, {
    method,
    headers: { Authorization: `Bearer ${cfg.key}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form ? new URLSearchParams(form).toString() : undefined,
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((j as { error?: { message?: string } })?.error?.message || `Stripe ${r.status}`);
  return j as Record<string, unknown>;
}

export const priceFor = (cfg: StoreConfig, country?: string) => (country && cfg.regional[country.toUpperCase()]) || cfg.price;

const priceCache = new Map<string, { at: number; label: string }>();
/** A display label such as "$19.99" or "₹499", read from Stripe and cached for an hour. */
export async function priceLabel(cfg: StoreConfig, priceId: string): Promise<string | null> {
  const hit = priceCache.get(priceId);
  if (hit && Date.now() - hit.at < 3600_000) return hit.label;
  try {
    const p = await stripe(cfg, 'GET', `/v1/prices/${encodeURIComponent(priceId)}`);
    const amount = Number(p.unit_amount) / 100, currency = String(p.currency || 'usd').toUpperCase();
    const label = new Intl.NumberFormat('en', { style: 'currency', currency, minimumFractionDigits: amount % 1 ? 2 : 0 }).format(amount);
    priceCache.set(priceId, { at: Date.now(), label });
    return label;
  } catch { return null; }
}

/** Starts a Stripe Checkout Session. The line item and statement text are deliberately discreet. */
export async function createCheckout(cfg: StoreConfig, origin: string, country?: string) {
  const s = await stripe(cfg, 'POST', '/v1/checkout/sessions', {
    mode: 'payment',
    'line_items[0][price]': priceFor(cfg, country),
    'line_items[0][quantity]': '1',
    success_url: `${origin}/play?paid={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/play`,
    'metadata[sku]': 'pass',
    'payment_intent_data[statement_descriptor_suffix]': 'GAME',
    allow_promotion_codes: 'true',
  });
  return String(s.url);
}

/** Confirms a paid Checkout Session with Stripe and returns a pass code, or null if it is not paid. */
export async function claim(cfg: StoreConfig, sessionId: unknown): Promise<string | null> {
  if (typeof sessionId !== 'string' || !/^cs_[A-Za-z0-9_]{8,200}$/.test(sessionId)) return null;
  const s = await stripe(cfg, 'GET', `/v1/checkout/sessions/${encodeURIComponent(sessionId)}`);
  const meta = s.metadata as Record<string, string> | undefined;
  if (s.payment_status !== 'paid' || meta?.sku !== 'pass') return null;
  return signLicense(cfg.secret, 'pass', sessionId);
}
