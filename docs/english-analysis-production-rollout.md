# English Speaking Analysis production release — 2026-09-08

## Released source and ordering

Initial fetched main branches were unchanged: marketing f971f7b98438dac93e573c6df2f9c9a35f8d347d; backend 7383ca3d8bc71919c1292b94f9f3ad79f845687a. No conflicts or force pushes. Approved marketing 504d963e342682446c791ebad86e4195902e44b1 and backend 2abdecf9de7c5be8dccf979f8ce338b1e9c888b4 were promoted intact.

1. Backend ai-speaking-coach v14 deployed first from approved source; backend main dfd07ba2ca21c46cbc7d6259e1dfd7553919999e adds release evidence only. JWT verification retained; all other function versions/hashes unchanged.
2. Production backend smoke passed before frontend promotion.
3. Route and metadata/sitemap commit a378201068dc6f3f078ca74b683ae25081c8cbc9 built on GitHub Pages with homepage still on WhatsApp.
4. Live EN/TR interface checks passed at all five widths before CTA switch.
5. CTA commit dcdc21f4778404a29e4ffcb5d2f16bf6612359fc built and verified on GitHub Pages. The subsequent release-evidence commit changes documentation/QA only.

Backend entry SHA-256: 361184849266c41fd0808dfc7a161df81ed42a3742bf4b52189373af7a608d00.
Bundle proxy: 83add583c34d55903e42bd9ff61803f7442650cdd49034ae02a43fea33cf1ce2.
Six downloaded deployment source files match the authoritative worktree after newline normalization.

No migration was needed/applied. The unrelated production 0253_widen_personalization_contexts is distinct from the retired English migration. No local QA schema objects were promoted.

## Evidence and scope

- Backend: 1,936 unit tests, focused endpoint/security/recovery tests, locale evaluator parity and real-provider contract passed. Controlled authored synthetic speech exercised production EN and TR first/retry transcription/evaluation. Wrong-token/cross-locale rejection, evidence protection, scoped recovery and duplicate completed-result handling passed; no extra reservation rows on duplicate. Booking returned 12 slots. Controlled records were cleaned up; no production lead/booking was submitted.
- Deployed frontend: scripts/qa-english-browser.mjs with QA_BASE_URL=https://starspeakerstudio.com exercised 17 states in each locale at 320, 360, 390, 768, 1440, plus permission-error, cancel/rerecord, booking confirmation/reschedule/cancellation at 390. API responses in this browser harness are isolated fixtures; the real backend check above is separate. No ordinary learner data was created.
- Track cleanup passed stop/cancel/rerecord/error checks. Completed comparisons survived reload unchanged in both locales at 390; keyboard reached result action. Heading focus, input/consent controls and error-state checks passed. Accessibility is a spot check, not a full audit.
- All ten static marketing suites passed, including all five Turkish performance suites, English copy/generation, shared recording behavior, homepage positioning/locales and public routing.
- scripts/qa-production-release.mjs verified deployed route HTTP 200, English lang/canonical/description/OG/Twitter, loaded scripts/styles, unique EN and TR sitemap entries, five exact English primary labels/targets, secondary WhatsApp, homepage widths, English root routing, UTM/language switching, 404 and HTTPS.
- The Turkish homepage remains unchanged. Broader positioning, offers, pricing and testimonials remain unchanged. Four metrics are verified internally; the existing overall score/comparison UI is preserved as founder-approved.
- Result contact/consent/budget/urgency/booking copy retains +90, TL and Turkey-time explanations.

Screenshots are outside git in ../english-production-qa. Backend detailed evidence and repeatable controlled smoke are in the backend repository's docs/english-analysis-production-rollout.md and scripts/qa-english-production.mjs.

## Rollback (documented, not executed)

Use a clean release worktree based on fetched origin/main. Never reset the user's working checkout or force-push.

1. CTA only: git revert dcdc21f4778404a29e4ffcb5d2f16bf6612359fc; run node scripts/build-site.mjs and node scripts/test-home-locales.mjs; commit any generated changes, then git push origin HEAD:main. Verify the exact GitHub Pages build SHA and five English Ask on WhatsApp primary actions. This preserves Turkish and leaves the EN route accessible.
2. If the EN route must also be withdrawn, first complete CTA rollback. Restore scripts/build-site.mjs and scripts/build-public-routes.mjs from f971f7b98438dac93e573c6df2f9c9a35f8d347d using git restore --source=<that SHA> -- <those two files>; remove only en/speaking-analysis/index.html with git rm; rebuild the site. Review that the EN sitemap entry is removed, TR entry remains, and Turkish route/controller/shared cleanup files are untouched. Commit and push normally; verify EN 404 and TR 200. Keep the English generator dormant rather than reverting shared Turkish safety fixes.
3. Backend only after EN has been withdrawn: create an isolated backend worktree at 7383ca3d8bc71919c1292b94f9f3ad79f845687a; run supabase functions deploy ai-speaking-coach --project-ref ysbuadgksnlbeuzttmjh --use-api there, preserving JWT verification. Download and compare source, record the new deployment version and smoke TR. Prior v13 bundle proxy: 398804460e1c8891e2ca83aca0d133e2f7a678262b6a0e937bfc4d15a1bbe7a3. Its source is retained outside git in rollout-before. Do not deploy unrelated functions. No schema rollback is required.

## Caveats

Further production human speech was intentionally skipped to avoid unnecessary personal evidence, as allowed by the release brief. Approved local real-human microphone QA and production synthetic-speech provider evaluation both passed. Production browser microphone checks use a simulated device and do not certify a physical permission prompt/OS indicator. Physical Safari/iOS and Android microphones remain untested because devices are unavailable. No platform-specific defect was observed and no release blocker remains.
