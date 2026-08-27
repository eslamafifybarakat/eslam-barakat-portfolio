// Frees local SSR ports before a fresh `npm run ssr:*` build+serve cycle,
// so a server left running from a previous run can't block the new one
// with EADDRINUSE. Cross-platform (Windows via netstat/taskkill, POSIX via
// lsof/kill). Usage: node scripts/stop-dev-server.mjs [port ...]
import { execSync } from 'node:child_process';

const explicitPorts = process.argv.slice(2).map(Number).filter(Boolean);
const targets = explicitPorts.length ? explicitPorts : [4000, 5000];
const isWindows = process.platform === 'win32';

for (const port of targets) {
  try {
    if (isWindows) {
      const out = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' }).trim();
      const pids = new Set(
        out
          .split('\n')
          .map((line) => line.trim().split(/\s+/).pop())
          .filter((pid) => pid && pid !== '0'),
      );
      for (const pid of pids) {
        execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
        console.log(`Stopped process ${pid} on port ${port}`);
      }
    } else {
      const out = execSync(`lsof -ti tcp:${port}`, { encoding: 'utf8' }).trim();
      for (const pid of out.split('\n').filter(Boolean)) {
        execSync(`kill -9 ${pid}`);
        console.log(`Stopped process ${pid} on port ${port}`);
      }
    }
  } catch {
    // Nothing listening on this port — nothing to stop.
  }
}
