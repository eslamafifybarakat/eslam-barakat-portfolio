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
process.exit(result.status ?? 1);
