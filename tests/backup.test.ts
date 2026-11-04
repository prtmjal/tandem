import { afterEach, describe, expect, it, vi } from 'vitest';
import { makeBackup, mergeBackup, readBackup } from '../src/backup';
import { newsConfig, subscribe, validEmail } from '../server/news';
import { emptyProgress } from '../shared/protocol';

describe('backup codes', () => {
  const sample = () => {
    const p = emptyProgress();
    p.unlocked = [1, 2, 3, 5]; p.seen = { '1': ['1h0', '1h1'], '3': ['3h2'] }; p.sessions = 7;
    p.capsule = [{ d: 1700000000000, items: ['What small thing reliably improves your day?'] }];
    p.curious = { '6': 1800000000000 };
    return p;
  };
  it('round-trips levels, cards and nights, and never carries curious taps', async () => {
    const code = await makeBackup(sample());
    expect(code.startsWith('TADB1.')).toBe(true);
    expect(code).not.toContain('curious'); // encrypted, not readable
    const back = await readBackup(code);
    expect(back.unlocked).toEqual([1, 2, 3, 5]);
    expect(back.seen['1']).toEqual(['1h0', '1h1']);
    expect(back.sessions).toBe(7);
    expect(back.capsule[0].items[0]).toContain('improves your day');
    expect(back.curious).toEqual({});
  });
  it('rejects a damaged code with a friendly message', async () => {
    const code = await makeBackup(sample());
    await expect(readBackup(code.slice(0, -4) + 'AAAA')).rejects.toThrow(/didn’t work/);
    await expect(readBackup('hello')).rejects.toThrow(/doesn’t look like/);
  });
  it('merging a backup adds progress and keeps this phone’s own curious taps', async () => {
    const mine = emptyProgress(); mine.unlocked = [1, 2, 4]; mine.curious = { '7': 123 };
    const merged = mergeBackup(mine, await readBackup(await makeBackup(sample())));
    expect(merged.unlocked).toEqual([1, 2, 3, 4, 5]);
    expect(merged.sessions).toBe(7);
    expect(merged.curious).toEqual({ '7': 123 });
  });
});

describe('email list', () => {
  afterEach(() => vi.unstubAllGlobals());
  it('is off unless Klaviyo is configured', () => {
    expect(newsConfig({})).toBe(null);
    expect(newsConfig({ KLAVIYO_COMPANY_ID: 'Abc123', KLAVIYO_LIST_ID: 'L1' })).not.toBe(null);
  });
  it('checks addresses', () => {
    expect(validEmail('a@b.co')).toBe(true);
    for (const bad of ['', 'nope', 'a@b', 'a b@c.de', 1, null]) expect(validEmail(bad)).toBe(false);
  });
  it('sends only the email address to the list', async () => {
    const f = vi.fn(async () => ({ ok: true, status: 202 })); vi.stubGlobal('fetch', f);
    await subscribe(newsConfig({ KLAVIYO_COMPANY_ID: 'Abc123', KLAVIYO_LIST_ID: 'L1' })!, ' a@b.co ');
    const [url, init] = f.mock.calls[0] as unknown as [string, { body: string }];
    expect(url).toContain('/client/subscriptions?company_id=Abc123');
    const body = JSON.parse(init.body);
    expect(body.data.relationships.list.data.id).toBe('L1');
    expect(body.data.attributes.profile.data.attributes).toEqual({ email: 'a@b.co', subscriptions: { email: { marketing: { consent: 'SUBSCRIBED' } } } });
  });
});
