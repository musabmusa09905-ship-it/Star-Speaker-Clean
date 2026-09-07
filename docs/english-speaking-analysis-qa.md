# English Speaking Analysis — corrected localization QA

Status: corrected implementation; founder QA pending. No deployment or homepage CTA switch.

## Canonical product and architecture

`/tr/performans-testi/` is the behavioral source. `scripts/build-performance-english.mjs` generates the English document/controller/contact copy from that source and `src/i18n/performance-english-copy.json`. Commit generated outputs. Run `node scripts/build-site.mjs` after editing source or translations. `node scripts/test-english-analysis.mjs` rejects stale generated files.

English route: `/en/speaking-analysis/`. It uses the same `performance-sprint.css`, with one English-only mobile pseudo-element translation. The Turkish controller remains as it was before scope correction; the previously committed microphone cleanup and heading focus fixes remain.

Setup retains first name, four situations, level, four duration choices, and five feelings. Public labels B1/B1+/B2/B2+/C1 map to b1_1/b1_2/b2_1/b2_2/c1_1. The original bank remains 128 questions; 80 are eligible in English. Server history/rotation and same-question retry remain unchanged. The redundant Turkish translation under each English question is empty in English; English context and structure hints remain.

Four metric scores, the overall score ring, one strength/correction/evidence/opening, one retry, before/after scores, transcript comparison, result summary, contact, budget, urgency, calendar and booking management are retained.

English session, history, anonymous identity and booking storage use separate keys. A thin transport adds locale and a random recovery token, bounds requests, and gives safe English errors. Recovery uses server-owned first/retry results in the canonical renderers. Product logic is generated rather than independently redesigned. The obsolete 60-second-only recorder class and separate English stylesheet were removed.

## Validation

- All nine existing Turkish/shared/home/routing script checks pass; the corrected English generation/copy/parity test passes.
- Chrome: 17 matching states in both languages at each of 320, 360, 390, 768 and 1440 pixels (170 state captures). Checks compare element/class structure, bounds of visible elements, English text including CSS pseudo-elements, score display, same-question retry, and ended microphone tracks. Browser microphone and backend responses are synthetic fixtures; no production traffic.
- The additional 390px pass passed for denied microphone permission, countdown cancellation, rerecording, heading focus, appointment confirmation, rescheduling and cancellation.
- Shared utilities: track cleanup, MIME fallback, timeout, locale/token transport and safe error translation pass.
- Backend: 1,936 unit tests, 24 database behavior checks (zero residual fixtures), local endpoint/DB ownership/rotation/evidence/recovery checks, build and function-manifest hash check pass.
- Real provider, authored transcripts: first/retry use the original scored schema in English. Representative scores were 58 and 84; the comparison is computed by the unchanged four-metric mean. These are QA fixture results, not calibration guarantees.
- Real transcription provider accepted an authored synthetic WAV through the canonical transcription function.

Browser reproduction: `node scripts/qa-english-browser.mjs`. Optional `QA_WIDTHS=390`, `QA_EXECUTABLE` and `QA_OUTPUT`. Screenshots from this run are outside git at `../english-localization-qa/`. Review screenshots alongside their Turkish counterparts.

## Founder QA / launch gates

No release action is authorized before corrected founder QA. The earlier human-microphone test covered the superseded design and is not approval for this product. A fresh human-microphone check and target-device checks, including real Safari/iOS, remain required before launch.

Booking preserves the existing +90 Turkish mobile validation, TL budget choices and Europe/Istanbul schedule. English explains the phone restriction and offers the same WhatsApp destination for other countries. First-name validation retains the existing Latin/Turkish-letter constraint and provides an English explanation. No booking or messaging was sent during these tests.

The English page needs the corrected backend branch at release time. Main still has the old backend response-language behavior. Keep the English homepage CTA “Ask on WhatsApp” until the release gate is satisfied.

## Corrective file manifest

```text
M	docs/english-speaking-analysis-qa.md
M	en/speaking-analysis/index.html
M	scripts/build-site.mjs
M	scripts/qa-english-browser.mjs
D	scripts/qa-english-errors.mjs
M	scripts/test-english-analysis.mjs
M	scripts/test-speaking-core.mjs
M	src/scripts/english-analysis.js
M	src/scripts/speaking-core.js
D	src/styles/english-analysis.css
M	src/styles/performance-sprint.css
A	docs/english-localization-recovery.md
A	scripts/build-performance-english.mjs
A	src/i18n/performance-english-copy.json
A	src/scripts/performance-english-config.js
A	src/scripts/performance-english-contact.js
A	src/scripts/performance-english-transport.js
```
