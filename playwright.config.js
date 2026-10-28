import { defineConfig } from '@playwright/test';
import { tmpdir } from 'node:os';
import path from 'node:path';
export default defineConfig({
  testDir: './test/ui', timeout: 30000, fullyParallel: true, workers: 2,
  outputDir: path.join(tmpdir(), 'dear-next-playwright'), reporter: [['list']],
  use: { baseURL: 'http://127.0.0.1:4173', headless: true, acceptDownloads: true, trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
    { name: 'small-mobile', use: { viewport: { width: 320, height: 740 }, isMobile: true, deviceScaleFactor: 1 } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 1 } },
    { name: 'tablet', use: { viewport: { width: 768, height: 1024 } } }
  ],
  webServer: { command: 'node scripts/build.mjs && node scripts/serve-demo.mjs', url: 'http://127.0.0.1:4173', reuseExistingServer: false }
});
