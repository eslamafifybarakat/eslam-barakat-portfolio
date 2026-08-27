// Starts the compiled SSR server (dist/.../server/server.mjs) on a given
// port. Usage: node scripts/serve-ssr.mjs --port 4000
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const serverEntry = path.join(root, 'dist', 'eslam-barakat-portfolio', 'server', 'server.mjs');

const portIndex = process.argv.findIndex((a) => a === '--port');
const port = portIndex !== -1 ? process.argv[portIndex + 1] : '4000';

if (!existsSync(serverEntry)) {
  console.error(`SSR server not found at ${path.relative(root, serverEntry)} — run a "build" script first.`);
  process.exit(1);
}

const result = spawnSync(process.execPath, [serverEntry], {
  stdio: 'inherit',
  env: { ...process.env, PORT: port },
});
process.exit(result.status ?? 1);
