import { afterEach, describe, expect, it, vi } from 'vitest';
import { claim, createCheckout, hasPass, priceFor, signLicense, storeConfig, verifyLicense } from '../server/store';
import { Room } from '../server/game';
import { PASS_DECK } from '../shared/decks';
import { emptyProgress } from '../shared/protocol';

const SECRET = 'x'.repeat(40);
const env = { STRIPE_SECRET_KEY: 'sk_test_1', STRIPE_PRICE_PASS: 'price_us', STRIPE_PRICE_PASS_IN: 'price_in', LICENSE_SECRET: SECRET };

describe('Couple Pass codes', () => {
  it('payments stay off unless Stripe and a strong secret are configured', () => {
    expect(storeConfig({})).toBe(null);
    expect(storeConfig({ ...env, LICENSE_SECRET: 'short' })).toBe(null);
    const cfg = storeConfig(env)!;
    expect(priceFor(cfg, 'IN')).toBe('price_in');
    expect(priceFor(cfg, 'US')).toBe('price_us');
    expect(priceFor(cfg)).toBe('price_us');
  });
  it('a signed code verifies; a tampered or foreign one does not', () => {
    const code = signLicense(SECRET, 'pass', 'cs_test_abc123456');
    expect(verifyLicense(SECRET, code)).toEqual({ sku: 'pass', sid: 'cs_test_abc123456' });
    expect(verifyLicense('y'.repeat(40), code)).toBe(null);
    const [v, p, s] = code.split('.');
    expect(verifyLicense(SECRET, `${v}.${p}x.${s}`)).toBe(null);
    expect(verifyLicense(SECRET, 'nonsense')).toBe(null);
    expect(hasPass(storeConfig(env), ['junk', code])).toBe(true);
    expect(hasPass(null, [code])).toBe(false);
  });
});

describe('Stripe calls', () => {
  afterEach(() => vi.unstubAllGlobals());
  const fake = (body: unknown, ok = true) => vi.fn(async () => ({ ok, status: ok ? 200 : 400, json: async () => body }));

  it('checkout uses the regional price and a discreet statement line', async () => {
    const f = fake({ url: 'https://checkout.stripe.test/x' }); vi.stubGlobal('fetch', f);
    const url = await createCheckout(storeConfig(env)!, 'https://play.example', 'IN');
    expect(url).toBe('https://checkout.stripe.test/x');
    const body = new URLSearchParams(String((f.mock.calls[0] as unknown[])[1] && ((f.mock.calls[0] as unknown[])[1] as { body: string }).body));
    expect(body.get('line_items[0][price]')).toBe('price_in');
    expect(body.get('payment_intent_data[statement_descriptor_suffix]')).toBe('GAME');
    expect(body.get('success_url')).toBe('https://play.example/play?paid={CHECKOUT_SESSION_ID}');
  });
  it('only a paid session becomes a pass code', async () => {
    vi.stubGlobal('fetch', fake({ payment_status: 'unpaid', metadata: { sku: 'pass' } }));
    expect(await claim(storeConfig(env)!, 'cs_test_abcdefgh')).toBe(null);
    vi.stubGlobal('fetch', fake({ payment_status: 'paid', metadata: { sku: 'pass' } }));
    const code = await claim(storeConfig(env)!, 'cs_test_abcdefgh');
    expect(verifyLicense(SECRET, code)?.sid).toBe('cs_test_abcdefgh');
    expect(await claim(storeConfig(env)!, '../../etc')).toBe(null);
  });
});

describe('pass decks in a room', () => {
  const room = (pass: boolean) => {
    const r = new Room('ABCDEF', 's', { token: 'a', name: 'A', connected: true, curious: {} }, emptyProgress());
    r.join({ token: 'b', name: 'B', connected: true, curious: {} }, emptyProgress());
    r.pass = pass;
    return r;
  };
  it('adds pass cards only when the pass is on, and never unlocks levels', () => {
    expect(room(false).deck(1).some(c => c.id.startsWith('p.'))).toBe(false);
    const r = room(true);
    expect(r.deck(1).some(c => c.id.startsWith('p.'))).toBe(true);
    expect(r.view(0).pass).toBe(true);
    expect(r.view(1).pass).toBe(true);
    expect(r.view(0).unlocked).toEqual([1, 2]);
    for (let l = 1; l <= 8; l++) for (const c of PASS_DECK[l]) expect(c.l).toBe(l);
  });
});
