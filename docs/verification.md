# Verification · 2026-10-28

- macOS arm64, Node 22.20.0: lint, core TypeScript checking, 15 Node tests, synthetic build passed.
- Chromium 156 / Playwright: 28 UI tests passed at 1440×1000, 768×1024, 390×844 and 320×740.
- Tests cover page identity, console health, no external requests, offline file rendering, disclosure keyboard controls, editing/import/export/refresh, PNG dimensions, exact SVG preview/download match, confirmation reset, reduced motion, long Korean text, injection and axe accessibility checks on report/share/editor.
- Independent source review found five issues (private path edge case, temporary-file cleanup, long share text, future cutoff, evidence-free discoveries); all were fixed and covered by regression tests.
- Both installation directories were tested in an isolated workspace. Copied bundles independently rendered the demo without npm dependencies.
- Codex CLI 0.155.1 recognized the selected skill and read the synthetic input; live analysis stopped at account usage limit. Full AI generation is not certified by this test.
- Claude Code 2.1.211 bare-mode invocation returned Unknown command for /dear-next. Normal interactive discovery remains unverified; documented installation follows official project skill paths. Do not interpret the copied-bundle test as an end-to-end host certification.
- Native goals feature flag was enabled in the local CLI, but this task had no callable goal-registration tool. No goal was registered.

Browser plugin skill was unavailable; regular Playwright was used. Screenshots were visually inspected. Tests do not certify Safari/Firefox, Windows, all screen readers, every model's analysis quality, or perfect sensitive-text detection. The browser runtime is linted and interaction-tested; TypeScript checking covers CLI, validator, renderer, share generator and development scripts.

No real personal records were used. Public sample is synthetic. No personal report deployment or social posting was performed.
