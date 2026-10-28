import { cpSync, existsSync, lstatSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
const args = process.argv.slice(2);
if (args.length !== 4 || args[0] !== '--target' || args[2] !== '--dest' || !['codex', 'claude', 'both'].includes(args[1])) {
  throw new Error('Usage: node scripts/install.mjs --target codex|claude|both --dest /chosen/workspace');
}
const dest = path.resolve(args[3]);
/** @param {string} target */
function noLinks(target) {
  let current = path.parse(target).root;
  for (const part of target.split(path.sep).slice(1)) {
    current = path.join(current, part);
    try { if (lstatSync(current).isSymbolicLink()) throw new Error('Choose a path without symlinks.'); }
    catch (e) { if (!(e && typeof e === 'object' && 'code' in e && e.code === 'ENOENT')) throw e; }
  }
}
const targets = (args[1] === 'both' ? ['codex', 'claude'] : [args[1]]).map(t => path.join(dest, t === 'codex' ? '.agents' : '.claude', 'skills', 'dear-next'));
for (const target of targets) {
  noLinks(target);
  if (existsSync(target)) throw new Error(`Existing skill preserved: ${target}. Remove or rename it explicitly before reinstalling.`);
}
const ignore = path.join(dest, '.gitignore');
noLinks(ignore);
const current = existsSync(ignore) ? readFileSync(ignore, 'utf8') : '';
mkdirSync(dest, { recursive: true });
const needed = ['.dear-next', '.dear-next/', '*.report.json'].filter(line => !current.split(/\r?\n/).includes(line));
if (needed.length) writeFileSync(ignore, current + (current && !current.endsWith('\n') ? '\n' : '') + '# Dear Next private records\n' + needed.join('\n') + '\n');
for (const target of targets) {
  mkdirSync(path.dirname(target), { recursive: true });
  cpSync(new URL('../skills/dear-next/', import.meta.url), target, { recursive: true, errorOnExist: true, force: false });
  console.log(`Installed ${target}`);
}
console.log('Restart the AI host in that workspace, then invoke dear-next. No personal settings were changed.');
