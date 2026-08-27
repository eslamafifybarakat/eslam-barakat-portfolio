// Runs real Lighthouse audits against the production build, served
// statically (exactly how Vercel serves it — every route is prerendered).
// Writes a route → Performance/Accessibility/Best-Practices/SEO/LCP/CLS/TBT
// table to LIGHTHOUSE.md. Scores are never asserted without an actual run.
//
// Usage:
//   npm run lighthouse                 # representative sample (fast)
//   npm run lighthouse -- --all        # every URL in sitemap.xml, both
//                                       # forced color schemes (slow —
//                                       # dozens of routes x 2 themes)
//   npm run lighthouse -- --routes=/,/work   # explicit path list
import { createServer } from 'node:http';
import { readFileSync, existsSync, writeFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as lighthouseModule from 'lighthouse';
import * as chromeLauncherModule from 'chrome-launcher';

const lighthouse = lighthouseModule.default ?? lighthouseModule;
const chromeLauncher = chromeLauncherModule.default ?? chromeLauncherModule;

const root = path.dirname(fileURLToPath(import.meta.url));
const browserDir = path.join(root, '..', 'dist', 'eslam-barakat-portfolio', 'browser');
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

const args = process.argv.slice(2);
const runAll = args.includes('--all');
const explicitRoutes = args.find((a) => a.startsWith('--routes='))?.split('=')[1]?.split(',');

const REPRESENTATIVE_SAMPLE = [
  { path: '/', theme: 'dark' },
  { path: '/', theme: 'light' },
  { path: '/ar', theme: 'dark' },
  { path: '/work', theme: 'dark' },
  { path: '/work/agro-teba', theme: 'dark' },
  { path: '/ar/work/agro-teba', theme: 'dark' },
  { path: '/this-page-does-not-exist', theme: 'dark' },
];

function routesFromSitemap() {
  const sitemapPath = path.join(browserDir, 'sitemap.xml');
  const xml = readFileSync(sitemapPath, 'utf8');
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  const themes = ['dark', 'light'];
  return urls.flatMap((p) => themes.map((theme) => ({ path: p, theme })));
}

function mimeType(file) {
  if (file.endsWith('.html')) return 'text/html; charset=utf-8';
  if (file.endsWith('.css')) return 'text/css';
  if (file.endsWith('.js') || file.endsWith('.mjs')) return 'text/javascript';
  if (file.endsWith('.json') || file.endsWith('.webmanifest')) return 'application/json';
  if (file.endsWith('.svg')) return 'image/svg+xml';
  if (file.endsWith('.woff2')) return 'font/woff2';
  if (file.endsWith('.png')) return 'image/png';
  if (file.endsWith('.ico')) return 'image/x-icon';
  if (file.endsWith('.txt')) return 'text/plain; charset=utf-8';
  if (file.endsWith('.xml')) return 'application/xml';
  return 'application/octet-stream';
}

function startStaticServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const urlPath = decodeURIComponent(req.url.split('?')[0]);
      let filePath = path.join(browserDir, urlPath);
      if (existsSync(filePath) && statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }
      if (!existsSync(filePath)) {
        filePath = path.join(browserDir, 'index.csr.html');
      }
      try {
        const content = readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': mimeType(filePath) });
        res.end(content);
      } catch {
        res.writeHead(404);
        res.end('Not found');
      }
    });
    server.listen(PORT, () => resolve(server));
  });
}

async function auditRoute(chrome, { path: routePath, theme }) {
  const options = {
    logLevel: 'error',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
    chromeFlags: [`--force-prefers-color-scheme=${theme}`],
  };
  const result = await lighthouse(`${BASE_URL}${routePath}`, options);
  const lhr = result.lhr;
  const metric = (id) => lhr.audits[id]?.numericValue;

  if (process.env.LH_DEBUG) {
    console.log(`\n--- debug: ${routePath} (${theme}) ---`);
    for (const cat of ['accessibility', 'seo', 'performance']) {
      for (const ref of lhr.categories[cat].auditRefs) {
        const audit = lhr.audits[ref.id];
        if (audit.score !== null && audit.score < (cat === 'performance' ? 0.95 : 1) && ref.weight > 0) {
          console.log(`[${cat}] ${audit.id}: ${audit.title} — score ${audit.score} ${audit.displayValue ?? ''}`);
          for (const item of audit.details?.items ?? []) {
            const snippet = item.node?.snippet ?? item.node?.selector ?? JSON.stringify(item).slice(0, 200);
            console.log(`    node: ${snippet}`);
          }
        }
      }
    }
  }

  return {
    path: routePath,
    theme,
    performance: Math.round(lhr.categories.performance.score * 100),
    accessibility: Math.round(lhr.categories.accessibility.score * 100),
    bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
    seo: Math.round(lhr.categories.seo.score * 100),
    lcp: metric('largest-contentful-paint'),
    cls: metric('cumulative-layout-shift'),
    tbt: metric('total-blocking-time'),
  };
}

function renderMarkdown(results, { sampleOnly }) {
  const fmtMs = (v) => (typeof v === 'number' ? `${Math.round(v)}ms` : 'n/a');
  const fmtCls = (v) => (typeof v === 'number' ? v.toFixed(3) : 'n/a');

  const rows = results
    .map(
      (r) =>
        `| ${r.path} | ${r.theme} | ${r.performance} | ${r.accessibility} | ${r.bestPractices} | ${r.seo} | ${fmtMs(r.lcp)} | ${fmtCls(r.cls)} | ${fmtMs(r.tbt)} |`,
    )
    .join('\n');

  const gaps = results.filter(
    (r) => r.performance < 100 || r.accessibility < 100 || r.bestPractices < 100 || r.seo < 100,
  );

  const gapsSection = gaps.length
    ? gaps
        .map((r) => {
          const misses = [
            r.performance < 100 && `Performance ${r.performance}`,
            r.accessibility < 100 && `Accessibility ${r.accessibility}`,
            r.bestPractices < 100 && `Best Practices ${r.bestPractices}`,
            r.seo < 100 && `SEO ${r.seo}`,
          ].filter(Boolean);
          return `- **${r.path}** (${r.theme}): ${misses.join(', ')}`;
        })
        .join('\n')
    : '_None — every measured route scored 100 across all four categories._';

  return `# Lighthouse report

Generated ${new Date().toISOString()} against a local static server over the
production build (\`npm run build\` output, served exactly as Vercel serves
it — every route below is a prerendered static file, not a live SSR
render). Both languages are separate URLs (\`/\` vs \`/ar\`), so they're
covered by testing each path directly; theme is forced via Chrome's
\`--force-prefers-color-scheme\` flag rather than a second URL, matching how
the site actually resolves theme with no stored preference.

${
  sampleOnly
    ? `**This run covers a representative sample, not the full 64-URL × 2-theme matrix** (128 audits would take on the order of an hour). Run \`npm run lighthouse -- --all\` to audit every route in \`sitemap.xml\` in both forced color schemes.`
    : '**This run covers every URL in `sitemap.xml`, in both forced color schemes.**'
}

## Results

| Route | Theme | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
${rows}

## Gaps from 100

${gapsSection}
`;
}

async function main() {
  if (!existsSync(browserDir)) {
    console.error('Build output not found — run "npm run build" first.');
    process.exit(1);
  }

  const routes = explicitRoutes
    ? explicitRoutes.flatMap((p) => [
        { path: p, theme: 'dark' },
        { path: p, theme: 'light' },
      ])
    : runAll
      ? routesFromSitemap()
      : REPRESENTATIVE_SAMPLE;

  const server = await startStaticServer();
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new'] });

  const results = [];
  try {
    for (const route of routes) {
      console.log(`Auditing ${route.path} (${route.theme})…`);
      // eslint-disable-next-line no-await-in-loop
      const result = await auditRoute(chrome, route);
      results.push(result);
    }
  } finally {
    await chrome.kill();
    server.close();
  }

  const markdown = renderMarkdown(results, { sampleOnly: !runAll && !explicitRoutes });
  writeFileSync(path.join(root, '..', 'LIGHTHOUSE.md'), markdown);
  console.log(`\nLIGHTHOUSE.md written with ${results.length} measurements.`);
}

main();
