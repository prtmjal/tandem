// Two addresses, one server. With SITE_URL and PLAY_URL set (e.g. https://example.com and https://play.example.com),
// the public site (home page, blog, privacy) lives on the first and the game on the second. Without them, everything
// is served from one address as before: the site at / and the game at /play.

export interface Hosts { site: URL; play: URL }

const parse = (v: string | undefined): URL | null => {
  try { const u = new URL(String(v || '').trim()); return (u.protocol === 'https:' || u.hostname === 'localhost') && u.pathname === '/' ? u : null; } catch { return null; }
};

/** Both must be set, valid and on different hosts, or the split stays off. */
export function hostsFromEnv(env: Record<string, string | undefined>): Hosts | null {
  const site = parse(env.SITE_URL), play = parse(env.PLAY_URL);
  return site && play && site.host !== play.host ? { site, play } : null;
}

const base = (u: URL) => u.origin;
/** Files and endpoints that work the same on both addresses. */
const SHARED = /^\/(assets\/|api\/|go\/|socket\.io|img\/|healthz$|stats$|sw\.js$|manifest\.webmanifest$|robots\.txt$|[\w-]+\.(png|svg|ico|webp|jpg|txt)$)/;
const isPlayPath = (p: string) => p === '/play' || p.startsWith('/play/');

export type Route = { redirect: string; permanent?: boolean } | { serve: 'play' | 'site' | 'shared' };

/** Where a request belongs. `host` is the Host header (with port, if any); `search` includes the leading "?". */
export function route(h: Hosts | null, host: string, path: string, search = ''): Route {
  if (SHARED.test(path)) return { serve: 'shared' };
  if (!h) {
    if (isPlayPath(path)) return { serve: 'play' };
    // Old invite links (/?j=...) go to the game.
    if (path === '/' && /[?&]j=/.test(search)) return { redirect: '/play' + search };
    return { serve: 'site' };
  }
  host = host.toLowerCase();
  if (host === h.play.host) {
    if (path === '/' || isPlayPath(path)) return { serve: 'play' };
    return { redirect: base(h.site) + path + search }; // the blog, privacy page and the rest live on the main site
  }
  // The game always opens on its own address, keeping any invite code.
  if (isPlayPath(path) || (path === '/' && /[?&]j=/.test(search))) return { redirect: base(h.play) + '/' + search };
  if (host === 'www.' + h.site.host) return { redirect: base(h.site) + path + search, permanent: true };
  return { serve: 'site' };
}

/** Fills in a public page's absolute links: canonical address, social preview, and the button to the game. */
export function fillPage(html: string, h: Hosts | null, path: string, origin: string): string {
  const site = h ? base(h.site) : origin, play = h ? base(h.play) + '/' : '/play';
  let out = html.split('__SITE__').join(site).split('href="/play"').join(`href="${play}"`);
  out = out.replace('content="/og.png"', `content="${site}/og.png"`);
  if (!/rel="canonical"/.test(out)) out = out.replace('</head>', `  <link rel="canonical" href="${site}${path === '/' ? '/' : path}" />\n    <meta property="og:url" content="${site}${path === '/' ? '/' : path}" />\n  </head>`);
  return out;
}

export function robots(h: Hosts | null, host: string, origin: string): string {
  // The game has nothing for search engines; its pages also carry a noindex header.
  if (h && host.toLowerCase() === h.play.host) return 'User-agent: *\nDisallow: /\n';
  return `User-agent: *\nAllow: /\nDisallow: /play\nDisallow: /go/\nDisallow: /stats\n\nSitemap: ${h ? base(h.site) : origin}/sitemap.xml\n`;
}

export function sitemap(h: Hosts | null, origin: string, posts: { slug: string; updated: string }[]): string {
  const site = h ? base(h.site) : origin;
  const url = (p: string, mod?: string) => `  <url><loc>${site}${p}</loc>${mod ? `<lastmod>${mod}</lastmod>` : ''}</url>`;
  const rows = [url('/'), ...(posts.length ? [url('/blog', posts[0].updated)] : []), ...posts.map(p => url('/blog/' + p.slug, p.updated)), url('/privacy')];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.join('\n')}\n</urlset>\n`;
}
