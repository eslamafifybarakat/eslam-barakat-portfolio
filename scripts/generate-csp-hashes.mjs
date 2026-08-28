// Scans the prerendered build output for every inline <script> (excluding
// inert data blocks like JSON-LD / TransferState, which Chrome doesn't
// enforce script-src against) and inline event-handler attribute
// (Beasties' critical-CSS `onload` swap), computes their CSP hash-source
// values, and rewrites vercel.json's Content-Security-Policy `script-src`
// directive to allow exactly those — nothing more (no 'unsafe-inline').
//
// IMPORTANT: Vercel resolves vercel.json's headers/rewrites from the repo
// commit being deployed, before the build command runs — rewriting the
// file mid-build has no effect on that deployment's actual headers. This
// script only keeps the CHECKED-IN vercel.json correct for the NEXT
// deploy: run `npm run build` (which calls it automatically), review the
// vercel.json diff, and commit it alongside whatever content change
// prompted it.
//
// Usage: node scripts/generate-csp-hashes.mjs
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const root = path.dirname(fileURLToPath(import.meta.url));
const browserDir = process.env.LH_BROWSER_DIR
  ? path.resolve(process.env.LH_BROWSER_DIR)
  : path.join(root, '..', 'dist', 'eslam-barakat-portfolio', 'browser');
const vercelJsonPath = path.join(root, '..', 'vercel.json');

function walkHtmlFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) out.push(...walkHtmlFiles(full));
    else if (entry.endsWith('.html')) out.push(full);
  }
  return out;
}

function sha256Base64(text) {
  return createHash('sha256').update(text, 'utf8').digest('base64');
}

function main() {
  if (!existsSync(browserDir)) {
    console.error(`Build output not found at ${browserDir} — run "ng build" first.`);
    process.exit(1);
  }

  const scriptHashes = new Set();
  const handlerHashes = new Set();
  const EVENT_ATTR = /^on[a-z]+$/i;

  for (const file of walkHtmlFiles(browserDir)) {
    const html = readFileSync(file, 'utf8');
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    for (const script of doc.querySelectorAll('script')) {
      if (script.hasAttribute('src')) continue; // external — already covered by 'self'
      // Only real executable script types need a CSP script-src hash.
      // `application/ld+json` (structured data, varies per route) and
      // `application/json` (Angular's `ng-state` TransferState blob, also
      // per-route) are inert data blocks the browser never executes —
      // Chrome doesn't enforce script-src against them, and hashing them
      // anyway would balloon the header with one entry per route for data
      // that was never actually a violation.
      const type = (script.getAttribute('type') ?? '').toLowerCase();
      const isExecutable = type === '' || type === 'text/javascript' || type === 'application/javascript';
      if (!isExecutable) continue;
      const content = script.textContent ?? '';
      if (content.trim().length === 0) continue;
      scriptHashes.add(sha256Base64(content));
    }

    for (const el of doc.querySelectorAll('*')) {
      for (const attr of Array.from(el.attributes)) {
        if (EVENT_ATTR.test(attr.name) && attr.value.trim().length > 0) {
          handlerHashes.add(sha256Base64(attr.value));
        }
      }
    }
  }

  const scriptSrcParts = [
    `'self'`,
    ...[...scriptHashes].sort().map((h) => `'sha256-${h}'`),
  ];
  if (handlerHashes.size > 0) {
    scriptSrcParts.push(`'unsafe-hashes'`, ...[...handlerHashes].sort().map((h) => `'sha256-${h}'`));
  }
  const newScriptSrc = `script-src ${scriptSrcParts.join(' ')}`;

  const vercelConfig = JSON.parse(readFileSync(vercelJsonPath, 'utf8'));
  const headerBlock = vercelConfig.headers?.find((h) => h.source === '/(.*)');
  const cspHeader = headerBlock?.headers?.find((h) => h.key === 'Content-Security-Policy');
  if (!cspHeader) {
    console.error('Could not find the Content-Security-Policy header in vercel.json.');
    process.exit(1);
  }

  const directives = cspHeader.value.split(';').map((d) => d.trim()).filter(Boolean);
  const scriptSrcIndex = directives.findIndex((d) => d.startsWith('script-src'));
  if (scriptSrcIndex === -1) {
    console.error('Could not find a script-src directive in the existing CSP.');
    process.exit(1);
  }
  const oldValue = cspHeader.value;
  directives[scriptSrcIndex] = newScriptSrc;
  cspHeader.value = directives.join('; ');

  if (cspHeader.value === oldValue) {
    console.log('CSP script-src already up to date — no changes.');
    return;
  }

  writeFileSync(vercelJsonPath, JSON.stringify(vercelConfig, null, 2) + '\n');
  console.log(
    `vercel.json CSP updated — script-src now allows ${scriptHashes.size} script hash(es)` +
      (handlerHashes.size ? ` and ${handlerHashes.size} event-handler hash(es) (via 'unsafe-hashes')` : '') +
      ` across ${walkHtmlFiles(browserDir).length} prerendered pages.`,
  );
}

main();
