// Shop suggestions (affiliate links): what can be suggested, matched to which cards, and which retailers serve which
// countries. Shown only after a night ("Tonight's kit") and on the map ("Toy box"), never during a night, always
// labelled "Ad · Paid links". Retailers switch on only when their affiliate link template is set on the server.
// Retailer choices and country lists come from reports/Sexual wellness affiliate programs.md; verify terms on sign-up.

export type KitId = 'blindfold' | 'massage-oil' | 'massage-candle' | 'silk-tie' | 'feather' | 'couples-toy' | 'lubricant';

export const KIT: Record<KitId, { label: string; blurb: string; q: string; toyBoxOnly?: boolean }> = {
  blindfold: { label: 'A soft blindfold', blurb: 'For the blindfold cards.', q: 'blindfold' },
  'massage-oil': { label: 'Massage oil', blurb: 'Warm it in your hands first.', q: 'massage oil' },
  'massage-candle': { label: 'A massage candle', blurb: 'Light it, then use the melted wax as oil.', q: 'massage candle' },
  'silk-tie': { label: 'A silk scarf or tie', blurb: 'For gentle wrist ties and blindfolds.', q: 'silk restraint' },
  feather: { label: 'A feather tickler', blurb: 'Feather-light, for slow nights.', q: 'feather tickler' },
  'couples-toy': { label: 'A toy for two', blurb: 'Designed to be shared.', q: 'couples toy', toyBoxOnly: true },
  lubricant: { label: 'Lubricant', blurb: 'Water-based is the easy start.', q: 'lubricant', toyBoxOnly: true },
};
export const KIT_IDS = Object.keys(KIT) as KitId[];

/** Card topics (from shared/content.ts and shared/decks.ts) that a kit item would make easier next time. */
export const TOPIC_KIT: Record<string, KitId[]> = {
  senses: ['blindfold'], blindkiss: ['blindfold'], blindcharge: ['blindfold'],
  handmassage: ['massage-oil'], handcare: ['massage-oil'], oilback: ['massage-oil', 'massage-candle'], headtoe: ['massage-oil', 'massage-candle'],
  'sl-warm': ['massage-oil'], massage: ['massage-oil'],
  candle: ['massage-candle'], candleroom: ['massage-candle'], candlethanks: ['massage-candle'],
  scarf: ['silk-tie'], feather: ['feather'],
};

/** Up to three kit items for tonight, from the topics of cards that were actually shown. */
export function kitFor(topics: string[]): KitId[] {
  const out: KitId[] = [];
  for (const t of topics) for (const k of TOPIC_KIT[t] || []) if (!out.includes(k)) out.push(k);
  return out.slice(0, 3);
}

/* ---------------- retailers ---------------- */
// `env` names the server variable holding the affiliate link template. In a template, {url} is the URL-encoded
// destination and {rawurl} the plain one, e.g. an Awin deep link "https://www.awin1.com/cread.php?awinmid=1&awinaffid=2&ued={url}"
// or an Amazon tag "{rawurl}&tag=yourtag-21". `search` builds the destination for an item; without it, links go to `home`.
export interface Retailer { id: string; name: string; env: string; home: string; search?: (q: string) => string }

const enc = encodeURIComponent;
export const RETAILERS: Record<string, Retailer> = {
  mymuse: { id: 'mymuse', name: 'MyMuse', env: 'SHOP_MYMUSE', home: 'https://mymuse.in/' },
  amazonin: { id: 'amazonin', name: 'Amazon.in', env: 'SHOP_AMAZON_IN', home: 'https://www.amazon.in/', search: q => `https://www.amazon.in/s?k=${enc(q)}` },
  lovehoneyus: { id: 'lovehoneyus', name: 'Lovehoney', env: 'SHOP_LOVEHONEY_US', home: 'https://www.lovehoney.com/' },
  dame: { id: 'dame', name: 'Dame', env: 'SHOP_DAME', home: 'https://www.dame.com/' },
  lovehoneyca: { id: 'lovehoneyca', name: 'Lovehoney', env: 'SHOP_LOVEHONEY_CA', home: 'https://www.lovehoney.ca/' },
  lovehoneyuk: { id: 'lovehoneyuk', name: 'Lovehoney', env: 'SHOP_LOVEHONEY_UK', home: 'https://www.lovehoney.co.uk/' },
  amorelie: { id: 'amorelie', name: 'Amorelie', env: 'SHOP_AMORELIE', home: 'https://www.amorelie.de/' },
  eisde: { id: 'eisde', name: 'Eis.de', env: 'SHOP_EIS', home: 'https://www.eis.de/' },
  passage: { id: 'passage', name: 'Passage du Désir', env: 'SHOP_PASSAGE', home: 'https://www.passagedudesir.fr/' },
  sinful: { id: 'sinful', name: 'Sinful', env: 'SHOP_SINFUL', home: 'https://www.sinful.dk/' },
  lovehoneyau: { id: 'lovehoneyau', name: 'Lovehoney', env: 'SHOP_LOVEHONEY_AU', home: 'https://www.lovehoney.com.au/' },
  lelo: { id: 'lelo', name: 'LELO', env: 'SHOP_LELO', home: 'https://www.lelo.com/' },
};

/** Which retailers to offer, in order, for an approved country. */
export const BY_COUNTRY: Record<string, string[]> = {
  IN: ['mymuse', 'amazonin'],
  US: ['lovehoneyus', 'dame', 'lelo'],
  CA: ['lovehoneyca', 'lelo'],
  GB: ['lovehoneyuk', 'lelo'], IE: ['lovehoneyuk', 'lelo'],
  DE: ['amorelie', 'eisde', 'lelo'], AT: ['amorelie', 'eisde', 'lelo'], CH: ['amorelie', 'eisde', 'lelo'],
  FR: ['passage', 'lelo'], BE: ['passage', 'lelo'],
  DK: ['sinful', 'lelo'], SE: ['sinful', 'lelo'], NO: ['sinful', 'lelo'], FI: ['sinful', 'lelo'],
  NL: ['passage', 'lelo'],
  AU: ['lovehoneyau', 'lelo'], NZ: ['lovehoneyau', 'lelo'],
  JP: ['lelo'], KR: ['lelo'],
};
// Only the countries above get shop links. Everywhere else (including Brazil, Singapore and the Philippines until a
// lawyer confirms them, and any country we can't detect) shows none.

/** No shop links at all where selling or importing these products is illegal or seriously restricted, plus a few
 *  precautionary ones. Unknown country also means no links. Get local legal advice before removing any. */
export const NO_SHOP = new Set(['AE', 'SA', 'QA', 'KW', 'OM', 'BH', 'IR', 'PK', 'MY', 'ID', 'TH', 'VN', 'MV', 'BD', 'BN']);

export function retailersFor(country: string | null): string[] {
  if (!country || NO_SHOP.has(country)) return [];
  return BY_COUNTRY[country] || [];
}

/** Builds the outbound affiliate URL for a retailer and item, or null if the retailer isn't set up. */
export function affiliateUrl(r: Retailer, template: string | undefined, item?: KitId): string | null {
  if (!template || !/^https:\/\//.test(template.replace('{rawurl}', 'https://x'))) return null;
  const dest = item && r.search ? r.search(KIT[item].q) : r.home;
  return template.split('{url}').join(enc(dest)).split('{rawurl}').join(dest);
}
