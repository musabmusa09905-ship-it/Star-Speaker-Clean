# Scope correction: recovery plan before implementation

Inspected September 8, 2026. Marketing `feat/english-speaking-analysis` is clean at `b4a4b5a`, main `f971f7b`. Backend branch of the same name is clean at `7d1e5cc`, main `7383ca3`; security commit `7ac5d10` is present. The primary app checkout remains dirty on main at `d732750` and is excluded. No production migration or English deployment occurred. The superseded human microphone browser is closed.

## Classification

| Area | Decision | Corrected implementation |
|---|---|---|
| Route / English metadata | KEEP | `/en/speaking-analysis/`, no homepage switch |
| Setup / first name / emotion | REVERT redesign | Restore the Turkish fields and selection sequence |
| Levels | REWRITE labels only | B1→b1_1, B1+→b1_2, B2→b2_1, B2+→b2_2, C1→c1_1 |
| Question inventory / categories | REVERT redesign | Reuse the 128-question canonical bank, four purposes, server history/rotation; 80 questions eligible for the five English levels |
| Duration | REVERT redesign | Restore 45/60/90/120 seconds and existing recommendations |
| Recording | KEEP cleanup, REVERT presentation | Same Turkish controls, countdown, timer, rerecord and submission |
| Scores / feedback / evaluator | REVERT redesign | Same four metrics, score ring, correction/evidence/opening and result fields; English text |
| Retry / comparison / result | REVERT redesign | Same one retry, same question, before/after scores, transcript snippets and card hierarchy |
| WhatsApp / contact / booking | REVERT blanket removal | Restore the complete localized conversion UI. Retain the existing Turkish-mobile booking constraint transparently; direct WhatsApp remains available internationally |
| Analytics | REWRITE localization integration | Keep the existing funnel events, with locale separation and no answer text added |
| Recovery / timeouts / duplicate protection | KEEP invisible reliability | Adapt to the canonical result schema, avoiding a separate product state model |
| Public evidence security | KEEP | Explicit safe-state whitelist; lead evidence read from server storage |
| Pending migration 0253 / separate endpoint | REVIEW, replace if unnecessary | Prefer existing participant/result JSON and existing service RPCs; no migration will be applied |
| Accessibility / overflow | KEEP | Existing nonvisual focus and microphone fixes; shared style root-width fix |

## Canonical flow

Intro → first name + situation + level + duration + feeling → selected question and support → optional countdown/Start Now → recording → explicit submission → analysis animation → score, focus, strength, correction, evidence, opening → same-question retry → before/after scores and transcripts → result summary → WhatsApp or contact → budget → timing → appointment calendar/management.

## Smallest safe implementation

Generate the English entry and localized controller from the stable Turkish source using a checked copy dictionary, retaining one source for product behavior and the exact shared CSS. Isolate English labels, storage keys, language/ownership transport and support text in configuration. Parameterize the existing evaluator's output language while preserving Turkish schema, prompts and scoring. Keep real security/reliability fixes without retaining the separate scoreless product. Add corrective commits; do not rewrite pushed history.

Next: implement the localization, compare each state side by side, run Turkish regression and English copy coverage, then provider QA. Founder QA and a new real-microphone check gate any production release.
