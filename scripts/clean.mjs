// Removes build output and/or the Angular CLI build cache.
// Usage: node scripts/clean.mjs [dist|cache]   (no argument = both)
import { rmSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = process.argv[2];

const targets = {
  dist: path.join(root, 'dist'),
  cache: path.join(root, '.angular', 'cache'),
};

if (target && !targets[target]) {
  console.error(`Unknown clean target "${target}". Use "dist", "cache", or no argument for both.`);
  process.exit(1);
}

const toClean = target ? [targets[target]] : Object.values(targets);

for (const dir of toClean) {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
    console.log(`Removed ${path.relative(root, dir)}`);
  } else {
    console.log(`Skipped ${path.relative(root, dir)} (not found)`);
  }
}
