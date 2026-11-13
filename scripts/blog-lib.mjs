// Blog: Markdown files in blog/ become static pages at /blog and /blog/<file-name>. No database, no CMS.
// A post starts with a small header between --- lines (title, description, date; optional updated, draft: true).
// Files starting with "_" are ignored. Used by scripts/build-blog.mjs and tests/site.test.ts.
import { marked } from 'marked';

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const DAY = /^\d{4}-\d{2}-\d{2}$/;

/** Splits a post file into its header fields and Markdown body. Throws a readable error when something is missing. */
export function parsePost(file, raw) {
  const slug = file.replace(/\.md$/, '');
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) throw new Error(`${file}: name the file in lowercase words joined by hyphens, e.g. date-night-questions.md`);
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error(`${file}: start the file with a header between two --- lines (title, description, date)`);
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) { const i = line.indexOf(':'); if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, ''); }
  const need = (k, ok, why) => { if (!meta[k] || !ok(meta[k])) throw new Error(`${file}: ${why}`); };
  need('title', v => v.length >= 10 && v.length <= 70, 'title must be 10 to 70 characters');
  need('description', v => v.length >= 50 && v.length <= 170, 'description must be 50 to 170 characters (it shows under the title in Google)');
  need('date', v => DAY.test(v) && !isNaN(Date.parse(v)), 'date must look like 2026-11-20');
  if (meta.updated && !DAY.test(meta.updated)) throw new Error(`${file}: updated must look like 2026-11-20`);
  const body = m[2].trim();
  if (body.split(/\s+/).length < 150) throw new Error(`${file}: a post needs at least 150 words`);
  return { slug, title: meta.title, description: meta.description, date: meta.date, updated: meta.updated || meta.date, draft: meta.draft === 'true', body };
}

/** Markdown to HTML. Checks the rules every page on the public site follows: nothing loaded from other sites. */
export function renderBody(post) {
  const html = marked.parse(post.body, { gfm: true });
  if (/<(script|iframe|object|embed|style|link)\b/i.test(html)) throw new Error(`${post.slug}: scripts, embeds and styles aren't allowed in posts`);
  for (const m of html.matchAll(/<img[^>]*\ssrc="([^"]*)"/g)) if (!m[1].startsWith('/')) throw new Error(`${post.slug}: images must be files on this site (put them in public/img/blog/ and link them as /img/blog/name.jpg)`);
  // Links to other sites open safely; links to the game or other posts stay as written.
  return html.replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" rel="noopener noreferrer"').replace(/<img /g, '<img loading="lazy" decoding="async" ');
}

const nice = d => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** `css` is the landing page's stylesheet link. __SITE__ and __PLAY__ are filled in by the server when it serves the page. */
function shell({ css, title, description, path, type, extraHead = '', main }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <link rel="canonical" href="__SITE__${path}" />
    <meta name="theme-color" content="#FAF2EC" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#130D12" media="(prefers-color-scheme: dark)" />
    <meta name="color-scheme" content="light dark" />
    <link rel="icon" href="/icon.svg" type="image/svg+xml" />
    <meta property="og:type" content="${type}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="__SITE__${path}" />
    <meta property="og:image" content="__SITE__/og.png" />
    <meta name="twitter:card" content="summary_large_image" />
    ${extraHead}
    ${css}
  </head>
  <body>
    <a class="skip" href="#main">Skip to content</a>
    <header class="bar">
      <a class="logo" href="/" aria-label="Tandem After Dark, home"><span class="logo-mark" aria-hidden="true"></span>Tandem</a>
      <a class="bar-link" href="/blog">Blog</a>
    </header>
    <main id="main" class="post">
${main}
    </main>
    <footer class="foot">
      <p>For two adults, 18+.</p>
      <nav aria-label="Footer"><a href="/">Home</a> · <a href="/privacy">Privacy</a></nav>
    </footer>
  </body>
</html>
`;
}

export function postPage(post, css) {
  const ld = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description: post.description, datePublished: post.date, dateModified: post.updated, mainEntityOfPage: `__SITE__/blog/${post.slug}`, publisher: { '@type': 'Organization', name: 'Tandem After Dark' } };
  return shell({
    css, title: `${post.title} | Tandem`, description: post.description, path: `/blog/${post.slug}`, type: 'article',
    extraHead: `<meta property="article:published_time" content="${post.date}" />\n    <script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`,
    main: `      <article>
        <p class="post-meta"><a href="/blog">Blog</a> · <time datetime="${post.date}">${nice(post.date)}</time></p>
        <h1>${esc(post.title)}</h1>
        <div class="prose">
${renderBody(post)}
        </div>
      </article>
      <aside class="post-cta">
        <h2>Tonight's a good night to ask.</h2>
        <p class="muted">Two phones. One link. No app.</p>
        <a class="btn" href="/play">Start a game</a>
      </aside>`,
  });
}

export function indexPage(posts, css) {
  return shell({
    css, title: 'Blog: date nights, questions and closeness | Tandem', path: '/blog', type: 'website',
    description: 'Ideas for date nights, questions worth asking and ways to feel closer, from the couple behind Tandem After Dark.',
    main: `      <h1>Blog</h1>
      <p class="muted post-lead">Date nights, questions worth asking, and ways to feel closer.</p>
      <ul class="post-list">
${posts.map(p => `        <li><a href="/blog/${p.slug}"><b>${esc(p.title)}</b></a><time datetime="${p.date}">${nice(p.date)}</time><p class="muted">${esc(p.description)}</p></li>`).join('\n')}
      </ul>`,
  });
}

/** Published posts, newest first. */
export function loadPosts(files) {
  const posts = files.filter(f => f.name.endsWith('.md') && !f.name.startsWith('_')).map(f => parsePost(f.name, f.raw)).filter(p => !p.draft);
  return posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));
}
