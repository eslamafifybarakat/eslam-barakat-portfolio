// Generates sitemap.xml + robots.txt from the ACTUAL prerendered build
// output (dist/.../browser/**/index.html), not a separately-maintained
// route list — so the sitemap can never drift from what was really built.
// Runs automatically after `ng build` as the last step of every "build:*"
// script (see package.json / scripts/with-build-lock.mjs).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const SITE_URL = 'https://eslam-barakat-portfolio.vercel.app';
const root = path.dirname(fileURLToPath(import.meta.url));
// Same override as scripts/lighthouse.mjs — lets an isolated build (e.g.
// `ng build --output-path=...`) generate its own sitemap without touching
// the shared dist/ output. Default is unchanged.
const browserDir = process.env.LH_BROWSER_DIR
  ? path.resolve(process.env.LH_BROWSER_DIR)
  : path.join(root, '..', 'dist', 'eslam-barakat-portfolio', 'browser');

if (!existsSync(browserDir)) {
  console.error(`Build output not found at ${browserDir} — run "ng build" first.`);
  process.exit(1);
}

function walk(dir, base = '') {
  const entries = readdirSync(dir);
  let urls = [];
  for (const entry of entries) {
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      urls = urls.concat(walk(full, `${base}/${entry}`));
    } else if (entry === 'index.html') {
      urls.push(base === '' ? '/' : base);
    }
  }
  return urls;
}

// index.csr.html (the CSR fallback for genuinely unmatched routes, e.g.
// the wildcard 404) intentionally has no prerendered index.html sibling at
// its own path, so it's naturally excluded by the walk above.
const urls = walk(browserDir).sort();

function mirrorPath(url, targetLang) {
  const withoutPrefix = url === '/ar' ? '/' : url.startsWith('/ar/') ? url.slice(3) : url;
  if (targetLang === 'en') return withoutPrefix;
  return withoutPrefix === '/' ? '/ar' : `/ar${withoutPrefix}`;
}

const lastmod = new Date().toISOString().slice(0, 10);

const entries = urls
  .map((url) => {
    const en = mirrorPath(url, 'en');
    const ar = mirrorPath(url, 'ar');
    return `  <url>
    <loc>${SITE_URL}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}${en}"/>
    <xhtml:link rel="alternate" hreflang="ar" href="${SITE_URL}${ar}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${en}"/>
  </url>`;
  })
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

writeFileSync(path.join(browserDir, 'sitemap.xml'), sitemap);
writeFileSync(path.join(browserDir, 'robots.txt'), robots);

console.log(`sitemap.xml written with ${urls.length} URLs (robots.txt alongside it).`);
