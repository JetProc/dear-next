#!/usr/bin/env node
import { writeFileSync, mkdirSync, existsSync, lstatSync, openSync, closeSync, fstatSync, readSync, constants, renameSync, unlinkSync, linkSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { renderReport, reportSchema } from './render.mjs';
import { validateReport } from './validate.mjs';
import { makeDemo, makeStarter } from './demo.mjs';
/** @param {string} filename */
export function readJSON(filename) {
  const fd = openSync(filename, constants.O_RDONLY | (constants.O_NOFOLLOW || 0));
  try {
    const info = fstatSync(fd);
    if (!info.isFile() || info.size > 524288) throw new Error('512KB 이하의 일반 JSON 파일만 읽습니다.');
    const bytes = Buffer.alloc(info.size + 1);
    let total = 0;
    while (total < bytes.length) {
      const count = readSync(fd, bytes, total, bytes.length - total, null);
      if (!count) break;
      total += count;
    }
    if (total > 524288 || total > info.size) throw new Error('읽는 중 파일 크기가 바뀌었습니다. 다시 시도하세요.');
    try { return JSON.parse(bytes.subarray(0, total).toString('utf8')); }
    catch { throw new Error('JSON 형식이 올바르지 않습니다.'); }
  } finally { closeSync(fd); }
}
/** @param {string} filename @param {string} content @param {boolean} [force] */
export function writePrivate(filename, content, force = false) {
  const full = path.resolve(filename);
  const parts = full.split(path.sep);
  if (!parts.slice(0, -1).includes('.dear-next')) throw new Error('개인 결과는 .dear-next 폴더 안에 저장하세요. 예: --out .dear-next/report.html');
  let current = path.parse(full).root;
  for (const part of parts.slice(1)) {
    current = path.join(current, part);
    try {
      if (lstatSync(current).isSymbolicLink()) throw new Error('출력 경로에 심볼릭 링크를 사용할 수 없습니다.');
    } catch (error) {
      if (!(error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT')) throw error;
    }
  }
  if (existsSync(full) && !force) throw new Error('출력 파일이 이미 있습니다. 새 경로를 고르거나 --force로 교체하세요.');
  mkdirSync(path.dirname(full), { recursive: true, mode: 0o700 });
  const temp = `${full}.tmp-${randomUUID()}`;
  let created = false;
  try {
    writeFileSync(temp, content, { flag: 'wx', mode: 0o600 });
    created = true;
    if (force) renameSync(temp, full);
    else linkSync(temp, full);
  } finally { if (created && existsSync(temp)) unlinkSync(temp); }
  return full;
}
/** @param {string[]} args */
export function main(args) {
  const [command, ...rest] = args;
  if (!command || command === '--help' || command === 'help') {
    console.log(`Dear Next · 디어넥스트 (Node 20+)\n\nnode <skill>/scripts/cli.mjs demo [--out .dear-next/demo.html] [--force]\nnode <skill>/scripts/cli.mjs init [--year 2026] [--out .dear-next/my.report.json]\nnode <skill>/scripts/cli.mjs validate --input .dear-next/my.report.json\nnode <skill>/scripts/cli.mjs render --input .dear-next/my.report.json [--out .dear-next/report.html] [--force]\n\nReads only the exact JSON file passed with --input. No API keys or network requests.\nThe AI host performs analysis separately. Personal output must stay in .dear-next/.`);
    return;
  }
  if (!['demo', 'init', 'validate', 'render'].includes(command)) throw new Error('알 수 없는 명령입니다. --help를 확인하세요.');
  /** @type {Record<string, string|boolean>} */
  const flags = {};
  for (let i = 0; i < rest.length; i++) {
    const key = rest[i];
    if (!['--input', '--out', '--year', '--force'].includes(key) || Object.hasOwn(flags, key)) throw new Error('알 수 없거나 중복된 옵션입니다.');
    if (key === '--force') flags[key] = true;
    else {
      const value = rest[++i];
      if (!value || value.startsWith('--')) throw new Error('옵션 값이 필요합니다.');
      flags[key] = value;
    }
  }
  if (flags['--year'] && command !== 'init') throw new Error('--year는 init에서만 사용합니다. 리포트 날짜는 JSON에서 수정하세요.');
  if (flags['--input'] && !['render', 'validate'].includes(command)) throw new Error('--input은 render/validate에서만 사용합니다.');
  const out = String(flags['--out'] || (command === 'init' ? '.dear-next/my.report.json' : `.dear-next/${command === 'demo' ? 'demo' : 'report'}.html`));
  let data;
  if (command === 'demo') data = makeDemo();
  else if (command === 'init') {
    const now = new Date();
    const year = flags['--year'] ? Number(flags['--year']) : now.getFullYear();
    if (!Number.isInteger(year) || year < 2000 || year > now.getFullYear()) throw new Error('2000년부터 현재 연도 사이의 회고 연도를 입력하세요.');
    const today = `${year}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    data = makeStarter(year, year === now.getFullYear() ? today : `${year}-12-31`);
  } else {
    if (typeof flags['--input'] !== 'string') throw new Error('--input으로 사용자가 선택한 JSON 파일을 지정하세요.');
    if (path.resolve(flags['--input']) === path.resolve(out)) throw new Error('입력과 출력은 서로 다른 파일이어야 합니다.');
    data = readJSON(flags['--input']);
  }
  const errors = validateReport(data, reportSchema);
  if (errors.length) throw new Error(errors.join('\n'));
  if (command === 'validate') { console.log('Valid report · 구조, 날짜, 근거 참조 확인 완료'); return; }
  const content = command === 'init' ? JSON.stringify(data, null, 2) + '\n' : renderReport(data);
  const result = writePrivate(out, content, flags['--force'] === true);
  console.log(`Saved locally: ${result}\n개인 HTML/JSON 전체를 공개하거나 업로드하지 마세요. 공유 카드는 HTML 안에서 따로 만드세요.`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(process.argv.slice(2)); }
  catch (error) { console.error(`Dear Next: ${error instanceof Error ? error.message : '실행에 실패했습니다.'}`); process.exitCode = 1; }
}
