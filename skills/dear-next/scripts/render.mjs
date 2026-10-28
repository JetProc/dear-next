import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { validateReport } from './validate.mjs';
import { makeShareSVG } from './share.mjs';
/** @type {import('./types.js').Schema} */
export const reportSchema = JSON.parse(readFileSync(new URL('../references/report.schema.json', import.meta.url), 'utf8'));
/** @param {unknown} value */
export function safeJSON(value) { return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029'); }
/** @param {unknown} data @returns {string} */
export function renderReport(data) {
  const errors = validateReport(data, reportSchema);
  if (errors.length) throw new Error(errors.join('\n'));
  const css = readFileSync(new URL('../assets/style.css', import.meta.url), 'utf8');
  const shell = readFileSync(new URL('../assets/shell.html', import.meta.url), 'utf8');
  const app = readFileSync(new URL('../assets/app.js', import.meta.url), 'utf8');
  const script = `const reportSchema=${safeJSON(reportSchema)};\nconst validateReport=${validateReport.toString()};\nconst makeShareSVG=${makeShareSVG.toString()};\n${app}`;
  const hash = (/** @type {string} */ s) => createHash('sha256').update(s).digest('base64');
  const json = safeJSON(data);
  const csp = `default-src 'none'; script-src 'sha256-${hash(script)}' 'sha256-${hash(json)}'; style-src 'sha256-${hash(css)}'; img-src blob: data:; connect-src 'none'; font-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'`;
  return `<!doctype html>\n<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="${csp}"><meta name="referrer" content="no-referrer"><meta name="robots" content="noindex,nofollow"><title>나의 한 해 — Dear Next</title><style>${css}</style></head><body>${shell}<script id="report-data" type="application/json">${json}</script><script>${script}</script></body></html>`;
}
