import js from '@eslint/js';
import globals from 'globals';
export default [
  { ignores: ['node_modules/**', 'dist/**', '.dear-next/**', 'test-results/**'] },
  js.configs.recommended,
  { languageOptions: { globals: { ...globals.node, ...globals.browser } } },
  { files: ['skills/dear-next/assets/app.js'], languageOptions: { globals: { validateReport: 'readonly', reportSchema: 'readonly', makeShareSVG: 'readonly' } } }
];
