# English Speaking Analysis — frontend QA

Implementation branch: `feat/english-speaking-analysis`, based on marketing production `f971f7b98438dac93e573c6df2f9c9a35f8d347d`.

The `/en/speaking-analysis/` document is implemented but not released. Homepage CTAs and the sitemap remain unchanged until the controlled real-microphone gate passes. Backend migration/deployment must precede publishing this frontend. The authoritative backend and detailed release/rollback record are in the sibling `StarSpeaker-English-Analysis` worktree, `docs/english-speaking-analysis-release.md`.

## Architecture

The English controller is independent of Turkish contact/booking presentation. Shared `speaking-core.js` owns recording lifecycle helpers, MIME selection, the English recorder and bounded network requests. Turkish imports shared track release and MIME selection; its established questions, timing choices, evaluator fields, contact form and booking flow remain intact. This avoids copying the 1,480-line Turkish controller or refactoring unrelated Turkish product state.

English has five levels, five contexts, optional five-second preparation or immediate Start Now, a fixed 60-second maximum, no required name/emotion/contact form, one server-enforced successful retry, no scores, exact quoted evidence, recoverable server results and direct WhatsApp after value. The original feedback remains available after retry. The approved monogram is reused unchanged.

## Results

- All eight prior marketing/Turkish suites pass.
- New English entry contract and shared recording lifecycle/MIME/timeout tests pass.
- Chromium all-state flow passes at 320, 360, 390, 768 and 1440 pixels: setup, real MediaRecorder with synthetic media, stop, submission, lost response, recovery, first feedback, refresh, retry, comparison and WhatsApp link. No horizontal overflow. Active heading focus verified.
- Chrome and Edge repeat the full flow at 390 pixels successfully.
- Permission denied, unavailable/busy device and unsupported recording states have distinct copy, keyboard focus, rerecord recovery and no overflow at all five widths.
- Normal stop releases every captured track. Unit checks also cover cancel, recorder error, interrupted tracks, start failure, a permission response arriving after cancellation, MIME fallback and request timeout.
- Visual screenshots reviewed at 320 and 1440: readable hierarchy, no clipped controls, approved black/champagne/ivory styling and original logo.
- Static build and diff whitespace checks pass.

## Open release gate

A controlled human microphone first answer/retry with submission and result recovery is still required in desktop Chromium and one additional browser. Automated synthetic audio is not presented as human microphone evidence. Firefox's downloaded binary could not launch (`spawn UNKNOWN`); Windows WebKit could not start automated capture. Desktop Safari and physical iOS Safari are not verified.

## Release and rollback

Do not switch homepage CTAs yet. After the remaining gate: deploy the additive database migration and authoritative functions; verify backend; publish and smoke the English route; only then add its generated sitemap entry and switch the English primary CTA to Free Speaking Analysis with WhatsApp secondary. Rerun all homepage/routing tests and verify production commit contents.

Rollback the English marketing route and CTA using revert commits. Keep the shared Turkish microphone/security fixes where possible. Do not drop database history or change Turkish booking. The prior marketing production commit is the verified full-site fallback, but it predates the new microphone fixes.
