// Launches `ng serve`, resolving --configuration and the dev port.
// Port resolution: an explicit --port wins; otherwise the port is read off
// the npm script name itself (e.g. "dev:4300" -> --port 4300), so
// `npm run dev:4200` and `npm run dev:4300` can share this one script
// instead of two near-identical hardcoded copies.
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);

function flagValue(name) {
  const eq = args.find((a) => a.startsWith(`${name}=`));
  if (eq) return eq.split('=').slice(1).join('=');
  const idx = args.findIndex((a) => a === name);
  return idx !== -1 ? args[idx + 1] : undefined;
}

const configuration = flagValue('--configuration') ?? flagValue('-c') ?? 'development';

let port = flagValue('--port');
if (!port) {
  const lifecycleEvent = process.env.npm_lifecycle_event ?? '';
  const match = lifecycleEvent.match(/:(\d{2,5})$/);
  if (match) port = match[1];
}

const ngArgs = ['serve', '--configuration', configuration];
if (port) ngArgs.push('--port', port);

console.log(`> ng ${ngArgs.join(' ')}`);

const result = spawnSync('ng', ngArgs, { stdio: 'inherit', shell: true });
process.exit(result.status ?? 1);
