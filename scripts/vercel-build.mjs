// Vercel's buildCommand (see vercel.json). Picks the right Angular
// configuration from Vercel's own built-in env vars — no dashboard
// env-var setup required:
//   VERCEL_ENV=production                 -> build:live  (Production deploys)
//   VERCEL_ENV=preview, branch "uat"      -> build:uat
//   VERCEL_ENV=preview, branch "staging"  -> build:staging
//   VERCEL_ENV=preview, any other branch  -> build:staging  (PR previews)
//   VERCEL_ENV=development (`vercel dev`) -> build:dev
//   not running on Vercel (local)         -> build:live
import { spawnSync } from 'node:child_process';
import { rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const vercelEnv = process.env.VERCEL_ENV;
const branch = process.env.VERCEL_GIT_COMMIT_REF ?? '';

let script = 'build:live';
if (vercelEnv === 'production') {
  script = 'build:live';
} else if (vercelEnv === 'preview') {
  script = branch === 'uat' ? 'build:uat' : 'build:staging';
} else if (vercelEnv === 'development') {
  script = 'build:dev';
}

console.log(`vercel-build: VERCEL_ENV=${vercelEnv ?? '(none)'} branch=${branch || '(none)'} -> npm run ${script}`);

const result = spawnSync('npm', ['run', script], { stdio: 'inherit', shell: true });
if (result.status !== 0) process.exit(result.status ?? 1);

// Every route prerenders at build time (see app.routes.server.ts) — there is
// no live per-request render. `@angular/build` still emits a runnable
// `server/` bundle alongside `browser/` (it's needed *during* the build to
// drive prerendering), and Vercel's zero-config Angular support auto-wires
// any `server/` directory it finds into a Node.js Serverless Function.
// That function is dead weight for this app: it's never meant to run, but a
// cold start or a route falling through to it can still take long enough to
// 504. Deleting it here — after prerendering has already produced every
// HTML file the site needs — guarantees Vercel deploys pure static output,
// so a serverless-function timeout is structurally impossible.
const serverDir = join('dist', 'eslam-barakat-portfolio', 'server');
if (existsSync(serverDir)) {
  console.log(`vercel-build: removing ${serverDir} (build-time only, not deployed) to keep the site 100% static`);
  rmSync(serverDir, { recursive: true, force: true });
}

process.exit(0);
