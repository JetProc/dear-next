import { mkdirSync, writeFileSync } from 'node:fs';
import { renderReport } from '../skills/dear-next/scripts/render.mjs';
import { makeDemo } from '../skills/dear-next/scripts/demo.mjs';
// Public build accepts NO user data or file arguments. Only this authored synthetic fixture.
if (process.argv.length > 2) throw new Error('Public build accepts no input arguments.');
mkdirSync('dist', { recursive: true });
writeFileSync('dist/index.html', renderReport(makeDemo()));
console.log('Built dist/index.html from synthetic data only. No deployment performed.');
