import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { canonicalFromEnv, fillPage, hostsFromEnv, robots, route, sitemap } from '../server/hosts';
// @ts-expect-error plain JS module shared with the build script
import { indexPage, loadPosts, parsePost, postPage, renderBody } from '../scripts/blog-lib.mjs';
import { DECK } from '../shared/content';

const H = hostsFromEnv({ SITE_URL: 'https://example.com', PLAY_URL: 'https://play.example.com' })!;

describe('one server, two addresses', () => {
  it('stays on one address unless both are set, valid and different', () => {
    expect(hostsFromEnv({})).toBe(null);
    expect(hostsFromEnv({ SITE_URL: 'https://example.com' })).toBe(null);
    expect(hostsFromEnv({ SITE_URL: 'https://example.com', PLAY_URL: 'https://example.com' })).toBe(null);
    expect(hostsFromEnv({ SITE_URL: 'http://example.com', PLAY_URL: 'https://play.example.com' })).toBe(null);
    expect(hostsFromEnv({ SITE_URL: 'https://example.com/x', PLAY_URL: 'https://play.example.com' })).toBe(null);
    expect(H.play.host).toBe('play.example.com');
  });
  it('without the split, the site is at / and the game at /play, as before', () => {
    expect(route(null, 'x.up.railway.app', '/')).toEqual({ serve: 'site' });
    expect(route(null, 'x.up.railway.app', '/play', '?j=ABC')).toEqual({ serve: 'play' });
    expect(route(null, 'x.up.railway.app', '/', '?j=ABC.s')).toEqual({ redirect: '/play?j=ABC.s' });
    expect(route(null, 'x.up.railway.app', '/blog/a-post')).toEqual({ serve: 'site' });
  });
  it('the game opens only on the play address, and invite codes survive the hop', () => {
    expect(route(H, 'play.example.com', '/')).toEqual({ serve: 'play' });
    expect(route(H, 'play.example.com', '/play', '?j=ABC.s')).toEqual({ serve: 'play' });
    expect(route(H, 'example.com', '/play', '?j=ABC.s')).toEqual({ redirect: 'https://play.example.com/?j=ABC.s' });
    expect(route(H, 'example.com', '/', '?j=ABC')).toEqual({ redirect: 'https://play.example.com/?j=ABC' });
    expect(route(H, 'old.up.railway.app', '/play')).toEqual({ redirect: 'https://play.example.com/' });
  });
  it('the home page, blog and privacy page live only on the main address', () => {
    expect(route(H, 'example.com', '/')).toEqual({ serve: 'site' });
    expect(route(H, 'example.com', '/blog/a-post')).toEqual({ serve: 'site' });
    expect(route(H, 'play.example.com', '/blog/a-post')).toEqual({ redirect: 'https://example.com/blog/a-post' });
    expect(route(H, 'play.example.com', '/privacy')).toEqual({ redirect: 'https://example.com/privacy' });
    expect(route(H, 'www.example.com', '/blog', '?x=1')).toEqual({ redirect: 'https://example.com/blog?x=1', permanent: true });
  });
  it('files, the API and live play work on both addresses', () => {
    for (const p of ['/assets/play-abc.js', '/api/shop', '/socket.io/', '/go/amazonin/blindfold', '/og.png', '/sw.js', '/manifest.webmanifest', '/healthz', '/img/blog/a.jpg'])
      for (const host of ['example.com', 'play.example.com']) expect(route(H, host, p), p).toEqual({ serve: 'shared' });
  });
  it('public pages get absolute addresses and a direct link to the game', () => {
    const html = '<head><meta property="og:image" content="/og.png" /></head><a class="btn" href="/play">Start</a>';
    const split = fillPage(html, H, '/', 'https://ignored');
    expect(split).toContain('<link rel="canonical" href="https://example.com/" />');
    expect(split).toContain('content="https://example.com/og.png"');
    expect(split).toContain('href="https://play.example.com/"');
    const single = fillPage(html, null, '/privacy', 'https://x.up.railway.app');
    expect(single).toContain('href="https://x.up.railway.app/privacy"');
    expect(single).toContain('href="/play"');
  });
  it('search engines get the sitemap, may fetch the game page to see its noindex, and stay out of shop redirects and stats', () => {
    for (const host of ['play.example.com', 'example.com']) {
      const r = robots(H, host, '');
      expect(r).toContain('Sitemap: https://example.com/sitemap.xml');
      expect(r).toContain('Disallow: /go/'); expect(r).toContain('Disallow: /stats');
      expect(r).not.toContain('Disallow: /play'); expect(r).not.toMatch(/Disallow: \/\n/);
    }
    const map = sitemap(H, '', [{ slug: 'a-post', updated: '2026-11-14' }]);
    expect(map).toContain('<loc>https://example.com/blog/a-post</loc><lastmod>2026-11-14</lastmod>');
    expect(map).not.toContain('play');
  });
  it('on one address, every other public host is sent to the canonical one, but local runs and health checks are not', () => {
    const canon = canonicalFromEnv({ PUBLIC_URL: 'https://www.example.com' })!;
    expect(canonicalFromEnv({ PUBLIC_URL: 'http://www.example.com' })).toBe(null);
    expect(canonicalFromEnv({})).toBe(null);
    expect(route(null, 'www.example.com', '/blog', '', canon)).toEqual({ serve: 'site' });
    expect(route(null, 'old.up.railway.app', '/blog/a-post', '?x=1', canon)).toEqual({ redirect: 'https://www.example.com/blog/a-post?x=1', permanent: true });
    expect(route(null, 'example.com', '/play', '?j=ABC', canon)).toEqual({ redirect: 'https://www.example.com/play?j=ABC', permanent: true });
    expect(route(null, 'localhost:3001', '/', '', canon)).toEqual({ serve: 'site' });
    expect(route(null, 'healthcheck.railway.app', '/healthz', '', canon)).toEqual({ serve: 'shared' });
    expect(route(null, 'old.up.railway.app', '/socket.io/', '', canon)).toEqual({ serve: 'shared' });
    expect(route(null, 'old.up.railway.app', '/', '')).toEqual({ serve: 'site' }); // no PUBLIC_URL: nothing to redirect to
  });
  it('with the split, an unknown public host is not a second copy of the site', () => {
    expect(route(H, 'old.up.railway.app', '/blog')).toEqual({ redirect: 'https://example.com/blog', permanent: true });
    expect(route(H, 'localhost:3001', '/')).toEqual({ serve: 'site' });
  });
  it('the game page gets chat-app previews but no canonical address', () => {
    const play = readFileSync('play.html', 'utf8');
    for (const tag of ['og:title', 'og:description', 'og:image', 'twitter:card']) expect(play, tag).toContain(tag);
    expect(play).toContain('noindex');
    const out = fillPage(play, H, '/play', 'https://x', { canonical: false });
    expect(out).toContain('content="https://example.com/og.png"');
    expect(out).not.toContain('rel="canonical"');
    expect(out).not.toContain('__SITE__');
  });
});

describe('blog', () => {
  const files = readdirSync('blog').map(name => ({ name, raw: readFileSync('blog/' + name, 'utf8') }));
  const posts = loadPosts(files) as { slug: string; title: string; body: string; date: string }[];
  const css = '<link rel="stylesheet" href="/assets/landing.css">';

  it('every post in blog/ is valid and builds', () => {
    expect(posts.length).toBeGreaterThan(0);
    for (const f of files.filter(f => f.name.endsWith('.md') && !f.name.startsWith('_'))) expect(() => parsePost(f.name, f.raw), f.name).not.toThrow();
    for (const p of posts) {
      const html = postPage(p, css) as string;
      expect(html).toContain(`<link rel="canonical" href="__SITE__/blog/${p.slug}" />`);
      expect(html).toContain('"@type":"BlogPosting"');
      expect(html).toContain('href="/play"');
    }
    expect(indexPage(posts, css)).toContain(`/blog/${posts[0].slug}`);
  });
  it('drafts and files starting with _ are not published', () => {
    expect(posts.some(p => p.slug.startsWith('_'))).toBe(false);
    const draft = { name: 'a-draft.md', raw: `---\ntitle: A draft post for testing\ndescription: ${'x'.repeat(60)}\ndate: 2026-01-01\ndraft: true\n---\n${'word '.repeat(160)}` };
    expect(loadPosts([draft]).length).toBe(0);
  });
  it('posts follow the content rules: only Level 1-3 cards, suggestive at most, nothing loaded from other sites', () => {
    const later = [4, 5, 6, 7, 8].flatMap(l => DECK[l].map(c => c.text));
    for (const p of posts) {
      for (const t of later) expect(p.body.includes(t), `${p.slug} quotes a later-level card`).toBe(false);
      expect(p.title + p.body).not.toMatch(/\b(penis|vagina|breasts?|nipples?|orgasm|genital|naked|nude)\b/i);
      expect(() => renderBody(p)).not.toThrow();
    }
    const bad = (body: string) => () => renderBody({ slug: 'x', body });
    expect(bad('<script>alert(1)</script>')).toThrow();
    expect(bad('![a](https://other.site/a.jpg)')).toThrow();
    expect(bad('<iframe src="https://other.site"></iframe>')).toThrow();
    expect(renderBody({ slug: 'x', body: '[a](https://other.site)' })).toContain('rel="noopener noreferrer"');
  });
  it('every link between posts points at a post that exists, and no post is an island', () => {
    const slugs = new Set(posts.map(p => p.slug));
    const linked = new Set<string>();
    for (const p of posts) for (const m of p.body.matchAll(/\]\(\/blog\/([a-z0-9-]+)\)/g)) { expect(slugs.has(m[1]), `${p.slug} links to missing ${m[1]}`).toBe(true); expect(m[1], `${p.slug} links to itself`).not.toBe(p.slug); linked.add(m[1]); }
    for (const p of posts) if (posts.length > 1) expect(linked.has(p.slug), `nothing links to ${p.slug}`).toBe(true);
  });
  it('every post links to the game', () => {
    for (const p of posts) expect(p.body, p.slug).toContain('](/play)');
  });
  it('explains what is wrong with a post in plain words', () => {
    expect(() => parsePost('My Post.md', '')).toThrow(/lowercase words joined by hyphens/);
    expect(() => parsePost('a-post.md', 'no header')).toThrow(/header between two --- lines/);
    expect(() => parsePost('a-post.md', '---\ntitle: Short\n---\nx')).toThrow(/title must be/);
  });
});

describe('home page', () => {
  const html = readFileSync('index.html', 'utf8');
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)![1].replace(/<\\\//g, '</'))['@graph'] as { '@type': string; mainEntity?: { name: string; acceptedAnswer: { text: string } }[] }[];
  const text = (x: string) => x.replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ');
  it('describes the site as an organisation, a website, a free web app and an FAQ', () => {
    expect(graph.map(g => g['@type'])).toEqual(['Organization', 'WebSite', 'WebApplication', 'FAQPage']);
  });
  it('the FAQ in the page data matches the visible questions and answers word for word', () => {
    const visible = [...html.matchAll(/<details><summary>(.*?)<\/summary><p>(.*?)<\/p><\/details>/g)].map(m => [text(m[1]), text(m[2])]);
    const data = graph[3].mainEntity!.map(q => [q.name, q.acceptedAnswer.text]);
    expect(data.length).toBe(visible.length);
    expect(data).toEqual(visible);
  });
  it('has a sensible title and description length, and links to the blog', () => {
    expect(html.match(/<title>(.*?)<\/title>/)![1].length).toBeLessThanOrEqual(70);
    const d = html.match(/<meta name="description" content="([^"]*)"/)![1];
    expect(d.length).toBeGreaterThanOrEqual(120); expect(d.length).toBeLessThanOrEqual(160);
    expect(html).toContain('href="/blog/');
  });
  it('every blog link on the home page points at a real post', () => {
    const slugs = readdirSync('blog').filter(f => f.endsWith('.md') && !f.startsWith('_')).map(f => f.replace(/\.md$/, ''));
    for (const m of html.matchAll(/href="\/blog\/([a-z0-9-]+)"/g)) expect(slugs, m[1]).toContain(m[1]);
  });
});
