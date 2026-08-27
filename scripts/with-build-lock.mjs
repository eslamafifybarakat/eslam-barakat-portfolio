// Runs the given shell command guarded by a lock file. All build
// configurations (production/staging/uat/dev/development) write to the same
// dist/eslam-barakat-portfolio/ output, so two builds running at once (e.g.
// a "build:staging" kicked off before a "build:live" finishes) would
// corrupt each other's output — this makes that impossible.
// Usage: node scripts/with-build-lock.mjs "<command to run>"
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const lockFile = path.join(root, '.build.lock');

const command = process.argv[2];
if (!command) {
  console.error('Usage: node scripts/with-build-lock.mjs "<command to run>"');
  process.exit(1);
}

function isPidRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function releaseLock() {
  if (existsSync(lockFile)) unlinkSync(lockFile);
}

if (existsSync(lockFile)) {
  const heldBy = Number(readFileSync(lockFile, 'utf8').trim());
  if (heldBy && isPidRunning(heldBy)) {
    console.error(
      `A build is already running (pid ${heldBy}). Wait for it to finish, or delete .build.lock if it's stale.`,
    );
    process.exit(1);
  }
  console.warn('Found a stale .build.lock from a build that did not exit cleanly — continuing.');
}

writeFileSync(lockFile, String(process.pid));

process.on('SIGINT', () => {
  releaseLock();
  process.exit(130);
});
process.on('SIGTERM', () => {
  releaseLock();
  process.exit(143);
});

let result;
try {
  result = spawnSync(command, { stdio: 'inherit', shell: true });
} finally {
  releaseLock();
}

process.exit(result?.status ?? 1);
