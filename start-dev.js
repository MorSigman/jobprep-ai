import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isWin = process.platform === 'win32';
const npm = isWin ? 'npm.cmd' : 'npm';

function run(label, cmd, args, cwd) {
  const proc = spawn(cmd, args, { cwd, stdio: 'pipe', shell: true });
  proc.stdout.on('data', (d) => process.stdout.write(`[${label}] ${d}`));
  proc.stderr.on('data', (d) => process.stderr.write(`[${label}] ${d}`));
  proc.on('exit', (code) => {
    if (code !== 0 && code !== null) console.log(`[${label}] exited with code ${code}`);
  });
  return proc;
}

const root = __dirname;
const serverDir = path.join(root, 'server');

const server = run('server', 'node', ['index.js'], serverDir);
const vite   = run('vite',   npm,    ['run', 'dev'], root);

process.on('SIGINT',  () => { server.kill(); vite.kill(); process.exit(0); });
process.on('SIGTERM', () => { server.kill(); vite.kill(); process.exit(0); });
