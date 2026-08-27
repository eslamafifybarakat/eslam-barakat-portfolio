// Generates per-route Open Graph images (1200×630) — one for the home page,
// one for the work index, and one per project (monogram + name + host +
// the project's poster scene, dark palette). Run manually with
// `node scripts/generate-og-images.mjs` whenever brand copy/projects
// change; outputs are committed static assets under public/og/, not
// generated on every build.
import { readFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(root, '..', 'public');
const ogDir = path.join(publicDir, 'og');
mkdirSync(ogDir, { recursive: true });

const WIDTH = 1200;
const HEIGHT = 630;
const BG = '#071018';
const SURFACE = '#0f1e2c';
const ACCENT = '#67b4e3';
const CTA = '#e0894a';
const TEXT = '#e9f1f7';
const MUTED = '#97abbc';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function wrapText(text, maxChars) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 2);
}

function markSvg(size, x, y) {
  return `
    <g transform="translate(${x},${y})">
      <rect x="2.8" y="2.8" width="${size - 5.6}" height="${size - 5.6}" rx="${size * 0.25}" fill="none" stroke="#FFFFFF" stroke-width="3.2" transform="scale(${size / 96})"/>
      <rect x="10" y="10" width="76" height="76" rx="18" fill="none" stroke="${CTA}" stroke-width="1.7" stroke-dasharray="0.01 4.6" stroke-linecap="round" transform="scale(${size / 96})"/>
      <text x="48" y="64.5" text-anchor="middle" font-family="Arial, sans-serif" font-size="46" font-weight="800" transform="scale(${size / 96})">
        <tspan fill="#FFFFFF">E</tspan><tspan fill="${CTA}">B</tspan>
      </text>
    </g>`;
}

function cardSvg({ eyebrow, title, subtitle }) {
  const titleLines = wrapText(title, 26);
  const titleTspans = titleLines
    .map((line, i) => `<tspan x="88" dy="${i === 0 ? 0 : 74}">${esc(line)}</tspan>`)
    .join('');

  return `<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="1.2" fill="rgba(151,171,188,0.14)"/>
      </pattern>
      <radialGradient id="haloA" cx="0.86" cy="0.05" r="0.65">
        <stop offset="0" stop-color="${ACCENT}" stop-opacity="0.22"/>
        <stop offset="1" stop-color="${ACCENT}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="haloB" cx="0.06" cy="0.95" r="0.55">
        <stop offset="0" stop-color="${CTA}" stop-opacity="0.16"/>
        <stop offset="1" stop-color="${CTA}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${ACCENT}"/>
        <stop offset="1" stop-color="${CTA}"/>
      </linearGradient>
    </defs>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG}"/>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#dots)"/>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#haloA)"/>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#haloB)"/>
    <rect x="1" y="1" width="${WIDTH - 2}" height="${HEIGHT - 2}" fill="none" stroke="rgba(151,171,188,0.25)" stroke-width="2"/>
    <rect x="0" y="${HEIGHT - 10}" width="${WIDTH}" height="10" fill="url(#bar)"/>

    ${markSvg(72, 88, 72)}
    <text x="192" y="128" font-family="Arial, sans-serif" font-size="28" font-weight="600" fill="${TEXT}">Eslam Afify Barakat</text>
    <text x="192" y="158" font-family="'Courier New', monospace" font-size="15" letter-spacing="3" fill="${MUTED}">SOFTWARE ENGINEER · WEB DEVELOPER</text>

    <text x="88" y="330" font-family="'Courier New', monospace" font-size="19" letter-spacing="3" fill="${ACCENT}">${esc(eyebrow.toUpperCase())}</text>
    <text x="88" y="410" font-family="Arial, sans-serif" font-size="64" font-weight="700" fill="${TEXT}">${titleTspans}</text>
    <text x="88" y="${HEIGHT - 70}" font-family="Arial, sans-serif" font-size="24" fill="${MUTED}">${esc(subtitle)}</text>
  </svg>`;
}

async function render(filename, opts) {
  const svg = cardSvg(opts);
  await sharp(Buffer.from(svg)).png().toFile(path.join(ogDir, filename));
  console.log('OG image:', filename);
}

async function main() {
  await render('home.png', {
    eyebrow: 'Portfolio',
    title: 'Senior Angular Frontend Developer',
    subtitle: 'Interfaces that work in both directions — bilingual Arabic/English SSR platforms.',
  });

  await render('work.png', {
    eyebrow: 'Work',
    title: 'Thirty things I shipped',
    subtitle: 'Angular platforms first, then the lighter JavaScript builds.',
  });

  // Project names + slugs are read from the prerendered build output
  // (dist/.../browser/work/<slug>/index.html's <title>), not re-parsed out
  // of the TS source — this needs `npm run build` to have already run once.
  const browserDir = path.join(root, '..', 'dist', 'eslam-barakat-portfolio', 'browser', 'work');
  if (!existsSync(browserDir)) {
    console.warn('dist/.../browser/work not found — run "npm run build" first to generate per-project OG images.');
    console.log('Done — 2 OG images written to public/og/ (home, work).');
    return;
  }

  const slugs = readdirSync(browserDir).filter((entry) => entry !== 'index.html');
  for (const slug of slugs) {
    const html = readFileSync(path.join(browserDir, slug, 'index.html'), 'utf8');
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    const name = titleMatch ? titleMatch[1].split(' — ')[0] : slug;
    await render(`work-${slug}.png`, {
      eyebrow: 'Project',
      title: name,
      subtitle: 'Eslam Afify Barakat — Senior Angular Frontend Developer',
    });
  }

  console.log(`Done — ${2 + slugs.length} OG images written to public/og/`);
}

main();
