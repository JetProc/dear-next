# Verification · 2026-10-28

- macOS arm64, Node 22.20.0: lint, core TypeScript checking, 15 Node tests, synthetic build passed.
- Chromium 156 / Playwright: 28 UI tests passed at 1440×1000, 768×1024, 390×844 and 320×740.
- Tests cover page identity, console health, no external requests, offline file rendering, disclosure keyboard controls, editing/import/export/refresh, PNG dimensions, exact SVG preview/download match, confirmation reset, reduced motion, long Korean text, injection and axe accessibility checks on report/share/editor.
- Independent source review found five issues (private path edge case, temporary-file cleanup, long share text, future cutoff, evidence-free discoveries); all were fixed and covered by regression tests.
- Both installation directories were tested in an isolated workspace. Copied bundles independently rendered the demo without npm dependencies.
- Codex CLI 0.155.1: initial run stopped after reading the skill and selected synthetic input with a usage-limit response (2026-10-27 15:51:46 UTC). After the user reported refilling, one retry completed synthetic analysis, JSON validation and HTML rendering in an isolated workspace. The generated JSON was independently revalidated. No personal inputs were accessed.
- Claude Code 2.1.211: bare mode deliberately skips skill discovery (official headless documentation). A normal project-scoped invocation progressed beyond command resolution but returned `Not logged in · Please run /login`, with zero API tokens. Full Claude analysis remains blocked by missing authentication; no credentials were created. See https://code.claude.com/docs/en/headless .
- Native goals feature flag was enabled in the local CLI, but this task had no callable goal-registration tool. No goal was registered.

Browser plugin skill was unavailable; regular Playwright was used. Screenshots were visually inspected. Tests do not certify Safari/Firefox, Windows, all screen readers, every model's analysis quality, or perfect sensitive-text detection. The browser runtime is linted and interaction-tested; TypeScript checking covers CLI, validator, renderer, share generator and development scripts.

No real personal records were used. Public sample is synthetic. No personal report deployment or social posting was performed.

GitHub CI passed on the initial implementation commit, including the 28 UI checks on Ubuntu.

## Earlier prompt-first onboarding (before draft-first update)

The README copyable natural-language prompt was exercised with actual Codex in a fresh isolated workspace, without `$dear-next`. To test unpublished changes, the prompt explicitly selected the local checkout instead of fetching the older remote README, and supplied a confirmed destination plus three synthetic records. Codex read README.md and INSTALL.md, installed the project-scoped skill, read its instructions, generated evidence-based JSON, validated it and rendered HTML. The resulting JSON was independently validated. The host had no file-opening tool and correctly returned a clickable HTML path rather than claiming to open it. Remote clone, missing-input questions and graphical opening were not end-to-end exercised by this smoke run. Claude authentication limitation remains unchanged.

## Draft-first update

The current onboarding no longer requires an interview. Available authorized context produces a draft; sparse context is labeled limited/tentative; no context produces an explicitly synthetic example with optional follow-up. Explicit folder-confirmation requests and host permissions still take precedence.

Actual Codex smoke with no records and no chosen destination read the selected unpublished source, created a fresh default child folder, installed the Codex skill, generated the example, verified its JSON and returned a local link without asking interview questions. No other conversations were searched. The first response and result explicitly said this was not personal analysis. This smoke used a local source override; remote cloning was tested separately in the earlier release.

All 15 core tests and 36 browser tests passed locally. UI coverage includes sufficient synthetic records, one-record tentative personal drafts and no-record example presentation. New tests assert persistent example labeling in SVG export and rejection of converting a synthetic report to personal by changing its JSON flag in the editor. PNG uses the same labeled SVG bytes. Earlier full-context live Codex analysis remains applicable; sparse-context behavior was tested with fixtures rather than another live model call. A user can manually alter files outside the app; this is not a tamper-proof provenance system.
