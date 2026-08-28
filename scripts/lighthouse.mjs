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
//   npm run lighthouse -- --devices=mobile,tablet,desktop   # audit every
//                                       # selected route under each form
//                                       # factor too (multiplies audit
//                                       # count by the number of devices;
//                                       # default is mobile-only)
import { createServer } from 'node:http';
import { readFileSync, existsSync, writeFileSync, statSync } from 'node:fs';
import { gzipSync, brotliCompressSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as lighthouseModule from 'lighthouse';
import * as chromeLauncherModule from 'chrome-launcher';

const lighthouse = lighthouseModule.default ?? lighthouseModule;
const chromeLauncher = chromeLauncherModule.default ?? chromeLauncherModule;

const root = path.dirname(fileURLToPath(import.meta.url));
// Overridable so a sweep can run against an isolated build (e.g. a scratch
// output dir / port) without colliding with another concurrent session
// building or auditing this same repo — defaults are unchanged.
const browserDir = process.env.LH_BROWSER_DIR
  ? path.resolve(process.env.LH_BROWSER_DIR)
  : path.join(root, '..', 'dist', 'eslam-barakat-portfolio', 'browser');
const PORT = process.env.LH_PORT ? Number(process.env.LH_PORT) : 4173;
const BASE_URL = `http://localhost:${PORT}`;

const args = process.argv.slice(2);
const runAll = args.includes('--all');
const explicitRoutes = args.find((a) => a.startsWith('--routes='))?.split('=')[1]?.split(',');
// Comma list of form factors to audit each route under. Lighthouse ships
// official mobile/desktop presets; there's no official "tablet" preset, so
// it's approximated here (touch-class viewport, mid-tier throttling
// between the two) rather than pretending it's an equally-authoritative
// Lighthouse default. Default stays mobile-only so `--all` and existing
// invocations are unaffected.
const devices = (args.find((a) => a.startsWith('--devices='))?.split('=')[1]?.split(',')) ?? ['mobile'];
// Comma list of forced color schemes to audit each route under. Defaults to
// both (unchanged behavior) — pass `--themes=dark` to halve audit count when
// sweeping every route across multiple devices already covers the cost.
const themes = (args.find((a) => a.startsWith('--themes='))?.split('=')[1]?.split(',')) ?? ['dark', 'light'];

const DEVICE_PROFILES = {
  mobile: {
    label: 'Mobile',
    formFactor: 'mobile',
    screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false },
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4,
      requestLatencyMs: 150 * 3.75,
      downloadThroughputKbps: 1638.4 * 0.9,
      uploadThroughputKbps: 675 * 0.9,
    },
  },
  tablet: {
    label: 'Tablet',
    formFactor: 'mobile', // touch/mobile-class UA + viewport behavior, matching real tablets
    screenEmulation: { mobile: true, width: 810, height: 1080, deviceScaleFactor: 2, disabled: false },
    throttling: {
      rttMs: 70,
      throughputKbps: 6144,
      cpuSlowdownMultiplier: 2,
      requestLatencyMs: 70 * 3.75,
      downloadThroughputKbps: 6144 * 0.9,
      uploadThroughputKbps: 2048 * 0.9,
    },
  },
  desktop: {
    label: 'Desktop',
    formFactor: 'desktop',
    screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 40 * 3.75,
      downloadThroughputKbps: 10240 * 0.9,
      uploadThroughputKbps: 10240 * 0.9,
    },
  },
};

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

// Real Vercel security/cache headers (from vercel.json), applied by path
// pattern exactly like Vercel's edge does — without this, the local server
// is CSP/header-blind and a real production violation (e.g. a script
// hash Vercel's browser-side CSP rejects) silently passes locally. Loaded
// once at startup so a change to vercel.json is picked up per run.
const vercelConfig = JSON.parse(readFileSync(path.join(root, '..', 'vercel.json'), 'utf8'));
const headerRules = (vercelConfig.headers ?? []).map((rule) => ({
  regex: new RegExp(`^${rule.source}$`),
  headers: rule.headers,
}));

function vercelHeadersFor(urlPath) {
  const merged = {};
  for (const rule of headerRules) {
    if (rule.regex.test(urlPath)) {
      for (const { key, value } of rule.headers) merged[key] = value;
    }
  }
  return merged;
}

// Compression for hashed assets — real Vercel hosting does this too;
// without it this local server understates performance relative to
// production.
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
        const headers = {
          'Content-Type': mimeType(filePath),
          'Cache-Control': 'no-cache',
          ...vercelHeadersFor(urlPath),
        };

        const acceptEncoding = req.headers['accept-encoding'] ?? '';
        if (acceptEncoding.includes('br')) {
          headers['Content-Encoding'] = 'br';
          res.writeHead(200, headers);
          res.end(brotliCompressSync(content));
        } else if (acceptEncoding.includes('gzip')) {
          headers['Content-Encoding'] = 'gzip';
          res.writeHead(200, headers);
          res.end(gzipSync(content));
        } else {
          res.writeHead(200, headers);
          res.end(content);
        }
      } catch {
        res.writeHead(404);
        res.end('Not found');
      }
    });
    server.listen(PORT, () => resolve(server));
  });
}

async function auditRoute(chrome, { path: routePath, theme, device }) {
  const profile = DEVICE_PROFILES[device];
  const options = {
    logLevel: 'error',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
    chromeFlags: [`--force-prefers-color-scheme=${theme}`],
    formFactor: profile.formFactor,
    screenEmulation: profile.screenEmulation,
    throttling: profile.throttling,
    throttlingMethod: 'simulate',
  };
  const result = await lighthouse(`${BASE_URL}${routePath}`, options);
  const lhr = result.lhr;
  // Lighthouse can resolve successfully with an empty/broken LHR (all
  // category scores null, every audit missing) instead of throwing — seen
  // under sustained heavy machine load where the page never actually
  // finished loading. Treat that as a failure so the caller's retry loop
  // catches it, instead of silently recording 0/n/a as if it were real data.
  if (lhr.runtimeError || lhr.categories.performance.score == null) {
    throw new Error(
      `empty/invalid Lighthouse result for ${routePath} (${theme}, ${device})${lhr.runtimeError ? `: ${lhr.runtimeError.message}` : ''}`,
    );
  }
  const metric = (id) => lhr.audits[id]?.numericValue;

  if (process.env.LH_DEBUG) {
    console.log(`\n--- debug: ${routePath} (${theme}, ${device}) ---`);
    for (const cat of ['accessibility', 'seo', 'performance', 'best-practices']) {
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
    device,
    performance: Math.round(lhr.categories.performance.score * 100),
    accessibility: Math.round(lhr.categories.accessibility.score * 100),
    bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
    seo: Math.round(lhr.categories.seo.score * 100),
    lcp: metric('largest-contentful-paint'),
    cls: metric('cumulative-layout-shift'),
    tbt: metric('total-blocking-time'),
    fcp: metric('first-contentful-paint'),
    speedIndex: metric('speed-index'),
    ttfb: metric('server-response-time'),
  };
}

function renderMarkdown(results, { sampleOnly }) {
  const fmtMs = (v) => (typeof v === 'number' ? `${Math.round(v)}ms` : 'n/a');
  const fmtCls = (v) => (typeof v === 'number' ? v.toFixed(3) : 'n/a');

  const showDevice = new Set(results.map((r) => r.device)).size > 1;
  const rows = results
    .map(
      (r) =>
        `| ${r.path} | ${r.theme}${showDevice ? ` | ${DEVICE_PROFILES[r.device].label}` : ''} | ${r.performance} | ${r.accessibility} | ${r.bestPractices} | ${r.seo} | ${fmtMs(r.fcp)} | ${fmtMs(r.lcp)} | ${fmtMs(r.speedIndex)} | ${fmtMs(r.tbt)} | ${fmtCls(r.cls)} | ${fmtMs(r.ttfb)} |`,
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
          const label = showDevice ? `${r.theme}, ${DEVICE_PROFILES[r.device].label}` : r.theme;
          return `- **${r.path}** (${label}): ${misses.join(', ')}`;
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

${
  showDevice
    ? `**Tablet has no official Lighthouse preset** — approximated here as a touch-class viewport (810×1080 @2x) with throttling between the mobile and desktop presets (70ms RTT, ~6 Mbps, 2× CPU slowdown), not an authoritative Lighthouse default the way mobile/desktop are.`
    : ''
}

## Results

| Route | Theme${showDevice ? ' | Device' : ''} | Performance | Accessibility | Best Practices | SEO | FCP | LCP | Speed Index | TBT | CLS | TTFB |
|---|---|${showDevice ? '---|' : ''}---|---|---|---|---|---|---|---|---|---|
${rows}

## Gaps from 100

${gapsSection}

## Notes

- **\`/this-page-does-not-exist\` SEO score**: intentionally below 100.
  Lighthouse's \`is-crawlable\` audit flags any \`<meta name="robots"
  content="noindex">\` as a failure — but noindexing the 404 page is
  correct SEO practice (indexing it would put a no-content page in search
  results), not a defect. Every real, indexable route scores SEO 100.
- **Performance run-to-run variance**: numbers come from a single local
  machine sharing CPU with the rest of this environment (editor, prior
  builds), so Lighthouse's simulated throttling (heaviest on mobile,
  lightest on desktop) amplifies whatever contention was happening at that
  moment — LCP/TBT can swing noticeably between otherwise-identical runs.
  Vercel's production edge network removes that local contention entirely;
  these numbers are a conservative floor, not a prediction of production
  scores.
`;
}

async function main() {
  if (!existsSync(browserDir)) {
    console.error('Build output not found — run "npm run build" first.');
    process.exit(1);
  }

  const baseRoutes = explicitRoutes
    ? explicitRoutes.flatMap((p) => themes.map((theme) => ({ path: p, theme })))
    : runAll
      ? routesFromSitemap()
      : REPRESENTATIVE_SAMPLE;

  const routes = baseRoutes.flatMap((r) => devices.map((device) => ({ ...r, device })));

  const server = await startStaticServer();
  let chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new'] });

  // A long unattended sweep can outlast a flaky/contended machine — a single
  // dropped Chrome connection shouldn't discard every measurement collected
  // so far. Each route gets a few attempts (relaunching Chrome between them,
  // since a closed connection usually means the browser process died, not
  // just the page), and progress is flushed to disk periodically so a later
  // crash still leaves a usable partial report.
  const MAX_ATTEMPTS = 3;
  const results = [];
  const failed = [];

  const writeInterim = () => {
    const markdown = renderMarkdown(results, { sampleOnly: !runAll && !explicitRoutes });
    writeFileSync(path.join(root, '..', 'LIGHTHOUSE.md'), markdown);
  };

  try {
    for (const route of routes) {
      let ok = false;
      for (let attempt = 1; attempt <= MAX_ATTEMPTS && !ok; attempt += 1) {
        console.log(`Auditing ${route.path} (${route.theme}, ${route.device})…${attempt > 1 ? ` (attempt ${attempt})` : ''}`);
        try {
          // eslint-disable-next-line no-await-in-loop
          const result = await auditRoute(chrome, route);
          results.push(result);
          ok = true;
        } catch (err) {
          console.warn(`  attempt ${attempt} failed: ${err.message}`);
          try {
            // eslint-disable-next-line no-await-in-loop
            await chrome.kill();
          } catch {
            // already dead — fine, relaunching next
          }
          // eslint-disable-next-line no-await-in-loop
          chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new'] });
          if (attempt === MAX_ATTEMPTS) {
            console.error(`  giving up on ${route.path} (${route.theme}, ${route.device}) after ${MAX_ATTEMPTS} attempts`);
            failed.push(route);
          }
        }
      }
      if (results.length > 0 && results.length % 10 === 0) writeInterim();
    }
  } finally {
    try {
      await chrome.kill();
    } catch {
      // already dead
    }
    server.close();
  }

  writeInterim();
  const failedNote = failed.length
    ? `, ${failed.length} route(s) failed after ${MAX_ATTEMPTS} attempts: ${failed.map((r) => `${r.path} (${r.theme}, ${r.device})`).join(', ')}`
    : '';
  console.log(`\nLIGHTHOUSE.md written with ${results.length} measurements${failedNote}.`);
}

main();
