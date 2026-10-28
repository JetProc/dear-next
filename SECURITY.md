# Security and privacy

Only explicitly selected records are inputs. The skill prohibits hidden-memory/session scans and treats instructions inside records as inert data. The AI host is responsible for model processing; the renderer has no network dependency.

The strict validator checks fields, lengths, real dates, future cutoff, evidence uniqueness and references. Findings require evidence. Text is inserted with textContent; embedded JSON escapes script delimiters. A hash-based CSP denies connections, external scripts, fonts and objects. Shared SVG/PNG artifacts are built from a fresh allowlisted object, never a screenshot or hidden subset of the private report.

Private outputs require a `.dear-next` ancestor, reject symlinks, use restrictive file modes and preserve existing files unless replacement is explicit. Gitignore is defense in depth, not encryption. Do not force-add personal files. Browser downloads may go to the user's Downloads folder. Selected share text can still contain sensitive information; no automatic detector guarantees removal.

Do not put personal input or credentials in public issues. Report a minimal synthetic reproduction. No automatic publishing or telemetry is implemented.
