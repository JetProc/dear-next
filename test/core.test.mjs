import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, existsSync, symlinkSync, realpathSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { makeDemo, makeStarter } from '../skills/dear-next/scripts/demo.mjs';
import { validateReport } from '../skills/dear-next/scripts/validate.mjs';
import { renderReport, reportSchema, safeJSON } from '../skills/dear-next/scripts/render.mjs';
import { makeShareSVG } from '../skills/dear-next/scripts/share.mjs';
import { readJSON, writePrivate } from '../skills/dear-next/scripts/cli.mjs';
const cli = path.resolve('skills/dear-next/scripts/cli.mjs');
const valid = data => validateReport(data, reportSchema);
const temp = () => realpathSync(mkdtempSync(path.join(tmpdir(), 'dear-next-test-')));

test('synthetic full pipeline renders current-year report, no external resources', () => {
  const data = makeDemo(); assert.deepEqual(valid(data), []);
  assert.equal(data.year, new Date().getFullYear());
  const html = renderReport(data);
  assert.match(html, /Content-Security-Policy/); assert.match(html, /connect-src 'none'/);
  assert.doesNotMatch(html, /<script[^>]+src=/); assert.doesNotMatch(html, /https?:\/\/[^< ]+\.(woff|css|js)/);
});
test('empty context remains empty and honestly limited', () => {
  const data = makeStarter(2025, '2025-12-31');
  assert.deepEqual(valid(data), []); assert.equal(data.discoveries.length, 0); assert.ok(data.limitations.length);
  assert.match(renderReport(data), /아직 쓰지 않은/);
});
test('short context accepts tentative evidence but rejects ungrounded findings', () => {
  const data = makeStarter(2025, '2025-12-31');
  data.evidence = [{ id: 'e1', source: '사용자가 고른 예시', date: '2025-01-01', excerpt: '잠깐 걸었더니 좋았다.' }];
  data.discoveries = [{ id: 'd1', title: '산책이 남긴 느낌', body: '한 번의 기록이라 반복인지는 모릅니다.', confidence: 'tentative', evidence: ['e1'], counterpoint: '' }];
  assert.deepEqual(valid(data), []);
  data.discoveries[0].confidence = 'supported'; assert.ok(valid(data).length);
  data.discoveries[0].confidence = 'tentative'; data.discoveries[0].evidence = []; assert.ok(valid(data).length);
});
test('conflicting records retain both evidence and explanation', () => {
  const data = makeDemo(); assert.deepEqual(valid(data), []);
  data.discoveries[2].counterpoint = ''; assert.ok(valid(data).some(e => e.includes('상충')));
  data.discoveries[2].counterpoint = '반대 기록'; data.discoveries[2].evidence = ['e5']; assert.ok(valid(data).length);
});
test('rejects invalid, future, outside-period dates and broken references', () => {
  for (const mutate of [
    d => d.asOf = `${d.year}-02-30`, d => d.asOf = '2099-12-31',
    d => d.evidence[0].date = '2000-01-01', d => d.evidence[0].date = `${d.year}-12-31`,
    d => d.plan.evidence = ['missing'], d => d.evidence[1].id = d.evidence[0].id,
    d => d.discoveries[1].id = d.discoveries[0].id, d => d.keep[0].evidence = ['e1', 'e1']
  ]) { const data = makeDemo(); mutate(data); assert.ok(valid(data).length); }
});
test('strict contract rejects arbitrary fields, prototype keys, oversized strings and malformed structure', () => {
  assert.ok(valid(null).length); assert.ok(valid([]).length); assert.ok(valid({}).length);
  const data = makeDemo(); data.password = 'NOT_A_REAL_SECRET'; assert.ok(valid(data).length);
  delete data.password; data.title = 'x'.repeat(101); assert.ok(valid(data).length);
  data.title = 'test'; data.plan.firstWeek.pop(); assert.ok(valid(data).length);
  assert.ok(valid(JSON.parse('{"__proto__":{"polluted":true}}')).length); assert.equal({}.polluted, undefined);
});
test('Korean, special chars, emoji and HTML/script injection stay inert', () => {
  const data = makeDemo();
  data.title = '</script><script>globalThis.PWN=1</script> & 한글 “나” 🪴';
  data.evidence[0].excerpt = '<img src=x onerror=alert(1)> & "quotes" \u2028 \u2029';
  const html = renderReport(data);
  assert.doesNotMatch(html, /<script>globalThis.PWN/);
  const extracted = html.match(/<script id="report-data" type="application\/json">([\s\S]*?)<\/script>/)[1];
  assert.equal(JSON.parse(extracted).title, data.title);
  assert.doesNotMatch(safeJSON(data), /[<>&\u2028\u2029]/u);
});
test('share artifact contains selected fields only and XML escapes content', () => {
  const svg = makeShareSVG({ year: 2025, title: '<script>alert("x")</script> & 나' });
  assert.match(svg, /&lt;script&gt;/); assert.doesNotMatch(svg, /<script/);
  assert.doesNotMatch(svg, /evidence|source|excerpt|coverage|counterpoint/);
  assert.doesNotMatch(makeShareSVG({ year: 2025 }), /넓히기보다/);
});
test('max-length and multiline share content remains inside the canvas', () => {
  const svg = makeShareSVG({ year: 2025, title: '가\n'.repeat(49), intention: '나\n'.repeat(74), words: Array(3).fill('가'.repeat(16)) });
  const ys = [...svg.matchAll(/<text[^>]* y="(\d+)"/g)].map(m => Number(m[1]));
  assert.ok(Math.max(...ys) <= 1300);
  const labels = [...svg.matchAll(/<text[^>]*>(.*?)<\/text>/g)].map(m => m[1]);
  assert.ok(labels.filter(x => x.includes('가')).every(x => x.length <= 40));
});
test('private output refuses bare private name, traversal, symlinks and overwrite', () => {
  const dir = temp();
  assert.throws(() => writePrivate(path.join(dir, '.dear-next'), 'private'));
  assert.throws(() => writePrivate(path.join(dir, '.dear-next', '..', 'public.html'), 'private'));
  const file = path.join(dir, '.dear-next', 'report.html');
  writePrivate(file, 'one'); assert.equal(statSync(file).mode & 0o777, 0o600);
  assert.throws(() => writePrivate(file, 'two')); assert.equal(readFileSync(file, 'utf8'), 'one');
  writePrivate(file, 'three', true); assert.equal(readFileSync(file, 'utf8'), 'three');
  const unrelated = `${file}.tmp-${process.pid}`; writeFileSync(unrelated, 'keep');
  writePrivate(file, 'four', true); assert.equal(readFileSync(unrelated, 'utf8'), 'keep');
  const target = path.join(dir, 'target'); writeFileSync(target, 'safe');
  const link = path.join(dir, '.dear-next', 'link'); symlinkSync(target, link);
  assert.throws(() => writePrivate(link, 'bad', true)); assert.equal(readFileSync(target, 'utf8'), 'safe');
  const dangling = path.join(dir, '.dear-next', 'dangling'); symlinkSync(path.join(dir, 'missing'), dangling);
  assert.throws(() => writePrivate(dangling, 'bad', true));
});
test('input is explicit bounded JSON, not symlink or directory', () => {
  const dir = temp(); const file = path.join(dir, 'data.json');
  writeFileSync(file, JSON.stringify(makeDemo())); assert.equal(readJSON(file).version, 1);
  writeFileSync(file, '['); assert.throws(() => readJSON(file));
  writeFileSync(file, ' '.repeat(524289)); assert.throws(() => readJSON(file));
  const link = path.join(dir, 'link'); symlinkSync(file, link); assert.throws(() => readJSON(link));
  assert.throws(() => readJSON(dir));
});
test('CLI init / validate / render / edit / regenerate in an isolated workspace', () => {
  const dir = temp();
  const run = args => execFileSync(process.execPath, [cli, ...args], { cwd: dir, encoding: 'utf8' });
  run(['init', '--year', '2025']);
  const file = path.join(dir, '.dear-next', 'my.report.json');
  run(['validate', '--input', file]); run(['render', '--input', file]);
  const data = JSON.parse(readFileSync(file, 'utf8')); data.title = '내가 고친 한글 & <문장>';
  writeFileSync(file, JSON.stringify(data)); run(['render', '--input', file, '--out', '.dear-next/revision.html']);
  assert.match(readFileSync(path.join(dir, '.dear-next/revision.html'), 'utf8'), /내가 고친 한글/);
  for (const args of [['render'], ['wat'], ['demo', '--out'], ['init', '--year', '9999'], ['demo', '--input', file], ['render', '--input', file, '--out', file]]) {
    assert.notEqual(spawnSync(process.execPath, [cli, ...args], { cwd: dir }).status, 0);
  }
});
test('dual-host installer copies a runnable standalone skill and protects private paths', () => {
  const dir = temp(); const install = path.resolve('scripts/install.mjs');
  execFileSync(process.execPath, [install, '--target', 'both', '--dest', dir]);
  for (const host of ['.agents', '.claude']) {
    const root = path.join(dir, host, 'skills', 'dear-next');
    assert.ok(existsSync(path.join(root, 'SKILL.md')));
    const result = execFileSync(process.execPath, [path.join(root, 'scripts/cli.mjs'), 'demo', '--out', `.dear-next/${host.slice(1)}.html`], { cwd: dir, encoding: 'utf8' });
    assert.match(result, /Saved locally/);
  }
  assert.notEqual(spawnSync(process.execPath, [install, '--target', 'both', '--dest', dir]).status, 0);
  execFileSync('git', ['init', '-q'], { cwd: dir });
  const ignored = execFileSync('git', ['check-ignore', '.dear-next/report.html', 'foo.report.json', '.dear-next'], { cwd: dir, encoding: 'utf8' });
  assert.match(ignored, /\.dear-next\/report.html/); assert.match(ignored, /foo.report.json/);
});
test('installer refuses symlinked destination before writing', () => {
  const dir = temp(); const external = temp(); const link = path.join(dir, 'linked'); symlinkSync(external, link);
  assert.notEqual(spawnSync(process.execPath, [path.resolve('scripts/install.mjs'), '--target', 'both', '--dest', link]).status, 0);
  assert.equal(existsSync(path.join(external, '.gitignore')), false);
});
test('public build has no input pathway', () => {
  const result = spawnSync(process.execPath, ['scripts/build.mjs', '--input', 'private.json']);
  assert.notEqual(result.status, 0);
});
