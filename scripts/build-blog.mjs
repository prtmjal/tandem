// Builds the blog from blog/*.md into dist-server/blog (run by `npm run build`, after Vite). The server serves the
// pages at /blog and /blog/<file-name>, and lists them in /sitemap.xml.
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { indexPage, loadPosts, postPage } from './blog-lib.mjs';

const out = 'dist-server/blog';
const files = existsSync('blog') ? readdirSync('blog').map(name => ({ name, raw: readFileSync(`blog/${name}`, 'utf8') })) : [];
const posts = loadPosts(files);
// Reuse the landing page's stylesheet, so the blog matches it and loads nothing extra.
const css = (readFileSync('dist/index.html', 'utf8').match(/<link rel="stylesheet"[^>]*>/) || [''])[0];
if (!css) throw new Error('build the site first: dist/index.html has no stylesheet');
rmSync(out, { recursive: true, force: true }); mkdirSync(out, { recursive: true });
for (const p of posts) writeFileSync(`${out}/${p.slug}.html`, postPage(p, css));
writeFileSync(`${out}/index.html`, indexPage(posts, css));
writeFileSync(`${out}/posts.json`, JSON.stringify(posts.map(p => ({ slug: p.slug, title: p.title, date: p.date, updated: p.updated }))));
console.log(`blog: ${posts.length} post${posts.length === 1 ? '' : 's'}`);
