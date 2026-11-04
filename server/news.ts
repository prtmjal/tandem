// Optional email list ("Tell me about new decks"). The address goes straight to Klaviyo and is never stored by the
// game or linked to rooms, progress, partners or purchases. Off unless KLAVIYO_COMPANY_ID and KLAVIYO_LIST_ID are set.
// Double opt-in is set on the Klaviyo list itself (opt_in_process: double_opt_in).
export interface NewsConfig { company: string; list: string; api: string }

export function newsConfig(env: NodeJS.ProcessEnv = process.env): NewsConfig | null {
  const company = env.KLAVIYO_COMPANY_ID, list = env.KLAVIYO_LIST_ID;
  if (!company || !list) return null;
  return { company, list, api: env.KLAVIYO_API_BASE || 'https://a.klaviyo.com' };
}

export const validEmail = (e: unknown): e is string =>
  typeof e === 'string' && e.length <= 254 && /^[^\s@<>()]+@[^\s@<>()]+\.[^\s@<>()]{2,}$/.test(e.trim());

/** Subscribes one address through Klaviyo's public subscription endpoint (no private key needed). */
export async function subscribe(cfg: NewsConfig, email: string) {
  const r = await fetch(`${cfg.api}/client/subscriptions?company_id=${encodeURIComponent(cfg.company)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/vnd.api+json', Accept: 'application/vnd.api+json', revision: '2024-10-15' },
    body: JSON.stringify({
      data: {
        type: 'subscription',
        attributes: {
          custom_source: 'Landing page: new decks',
          profile: { data: { type: 'profile', attributes: { email: email.trim(), subscriptions: { email: { marketing: { consent: 'SUBSCRIBED' } } } } } },
        },
        relationships: { list: { data: { type: 'list', id: cfg.list } } },
      },
    }),
  });
  if (!r.ok) throw new Error(`Klaviyo ${r.status}`);
}
