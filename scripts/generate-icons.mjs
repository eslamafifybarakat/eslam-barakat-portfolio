// Generates the raster favicon/PWA icon set from the brand mark SVG.
// Run manually with `node scripts/generate-icons.mjs` whenever the mark
// changes — outputs are committed static assets under public/, not
// generated on every build.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(root, '..', 'public');
const markSvg = readFileSync(path.join(publicDir, 'mark-color.svg'));

async function renderPng(size, background = { r: 0, g: 0, b: 0, alpha: 0 }) {
  return sharp(markSvg, { density: 384 })
    .resize(size, size, { fit: 'contain', background })
    .png()
    .toBuffer();
}

async function renderMaskable(size) {
  // Maskable icons need real content confined to the ~80% "safe zone" —
  // draw the mark at 65% scale, centered, over a solid navy field so the
  // OS can crop to any shape without clipping the mark or exposing
  // transparency.
  const inner = Math.round(size * 0.65);
  const markPng = await sharp(markSvg, { density: 384 })
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const offset = Math.round((size - inner) / 2);
  return sharp({
    create: { width: size, height: size, channels: 4, background: '#0D4A78' },
  })
    .composite([{ input: markPng, left: offset, top: offset }])
    .png()
    .toBuffer();
}

function buildIco(entries) {
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + dirEntrySize * entries.length;
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);

  const dirEntries = [];
  const imageBuffers = [];
  for (const { size, buffer } of entries) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += buffer.length;
    dirEntries.push(entry);
    imageBuffers.push(buffer);
  }

  return Buffer.concat([header, ...dirEntries, ...imageBuffers]);
}

async function main() {
  const [png16, png32, png180, png192, png512, png512Maskable] = await Promise.all([
    renderPng(16),
    renderPng(32),
    renderPng(180, { r: 255, g: 255, b: 255, alpha: 1 }),
    renderPng(192),
    renderPng(512),
    renderMaskable(512),
  ]);

  writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);
  writeFileSync(path.join(publicDir, 'icon-192.png'), png192);
  writeFileSync(path.join(publicDir, 'icon-512.png'), png512);
  writeFileSync(path.join(publicDir, 'icon-512-maskable.png'), png512Maskable);
  writeFileSync(
    path.join(publicDir, 'favicon.ico'),
    buildIco([
      { size: 16, buffer: png16 },
      { size: 32, buffer: png32 },
    ]),
  );

  console.log('Icons written to public/');
}

main();
