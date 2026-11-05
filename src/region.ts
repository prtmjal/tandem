// Guesses the player's country on the phone, from its own time zone and language settings. Nothing is sent to the
// server and no IP address is looked up. Used only to pick which shop links (if any) to show. The player can change it.
import { store } from './net';
import { NO_SHOP } from '../shared/shop';

const TZ: Record<string, string> = {
  'Asia/Kolkata': 'IN', 'Asia/Calcutta': 'IN', 'Europe/London': 'GB', 'Europe/Dublin': 'IE', 'Europe/Berlin': 'DE', 'Europe/Vienna': 'AT',
  'Europe/Zurich': 'CH', 'Europe/Paris': 'FR', 'Europe/Brussels': 'BE', 'Europe/Copenhagen': 'DK', 'Europe/Stockholm': 'SE',
  'Europe/Oslo': 'NO', 'Europe/Helsinki': 'FI', 'Europe/Amsterdam': 'NL', 'Europe/Madrid': 'ES', 'Europe/Rome': 'IT', 'Europe/Lisbon': 'PT',
  'Australia/Sydney': 'AU', 'Australia/Melbourne': 'AU', 'Australia/Brisbane': 'AU', 'Australia/Perth': 'AU', 'Australia/Adelaide': 'AU',
  'Pacific/Auckland': 'NZ', 'America/Toronto': 'CA', 'America/Vancouver': 'CA', 'America/Edmonton': 'CA', 'America/Winnipeg': 'CA',
  'America/Halifax': 'CA', 'America/St_Johns': 'CA', 'America/New_York': 'US', 'America/Chicago': 'US', 'America/Denver': 'US',
  'America/Los_Angeles': 'US', 'America/Phoenix': 'US', 'America/Anchorage': 'US', 'Pacific/Honolulu': 'US', 'America/Detroit': 'US',
  'Asia/Dubai': 'AE', 'Asia/Riyadh': 'SA', 'Asia/Qatar': 'QA', 'Asia/Kuwait': 'KW', 'Asia/Muscat': 'OM', 'Asia/Bahrain': 'BH',
  'Asia/Tehran': 'IR', 'Asia/Karachi': 'PK', 'Asia/Kuala_Lumpur': 'MY', 'Asia/Jakarta': 'ID', 'Asia/Bangkok': 'TH', 'Asia/Ho_Chi_Minh': 'VN',
  'Asia/Saigon': 'VN', 'Indian/Maldives': 'MV', 'Asia/Dhaka': 'BD', 'Asia/Brunei': 'BN', 'Asia/Singapore': 'SG', 'Asia/Manila': 'PH',
  'Asia/Tokyo': 'JP', 'Asia/Seoul': 'KR', 'America/Sao_Paulo': 'BR', 'America/Mexico_City': 'MX',
};

/** ISO country code, or null when the phone gives no reliable hint (then no shop links are shown). */
export function guessCountry(): string | null {
  let tz: string | null = null, lang: string | null = null;
  try { const z = Intl.DateTimeFormat().resolvedOptions().timeZone; if (z && TZ[z]) tz = TZ[z]; } catch { /* ignore */ }
  for (const l of (typeof navigator !== 'undefined' && navigator.languages) || []) {
    const m = /-([A-Z]{2})$/i.exec(l); if (m) { lang = m[1].toUpperCase(); break; }
  }
  // The stricter signal wins: if either points to a country where we show no shop links, show none.
  if ((tz && NO_SHOP.has(tz)) || (lang && NO_SHOP.has(lang))) return tz && NO_SHOP.has(tz) ? tz : lang;
  return tz || lang;
}

/** The player's own choice wins: a country code, or 'off' to hide shop links. */
export function shopCountry(): string | 'off' | null {
  const o = store.get('tad.shop');
  if (o === 'off') return 'off';
  if (o && /^[A-Z]{2}$/.test(o)) return o;
  return guessCountry();
}
export const setShopCountry = (v: string | 'off' | 'auto') => (v === 'auto' ? store.del('tad.shop') : store.set('tad.shop', v));
