# Handoff — exact-surd core implemented; Unit 4 learner route next

The isolated exact-surd core is implemented and tested as of 23 November 2026 (Hong Kong). See [exact-surds-v1.md](../site/planning/exact-surds-v1.md) for its API, limits, form policy and integration boundary. The complete Node suite passes: 103 tests, including 14 new surd tests. Raw output and source hashes are in site/planning/surd-core-test-results.txt and site/planning/surd-core-checks.json.

src/math/quadratic-surds.mjs provides exact squarefree-radical arithmetic, bounded parsing, opt-in contract version 1, canonical snapshots, simplest-form checking and bilingual error feedback. It leaves exact.mjs and the published application HTML byte-for-byte unchanged. No RI question, lesson or new contract is wired into the learner application yet. Existing browser/print evidence still describes v0.13.0.

Next action: implement RI01–RI04 and the first two bilingual foundation lessons from [planning/topics/rational.md](topics/rational.md). Apply the four Unit 4 site-authored prerequisite corrections to the objective ledger, prerequisite-edge file and generated catalogue together during this integration; do not leave those representations out of sync. The isolated checker milestone deliberately leaves readiness metadata unchanged. Preserve source wording/classifications, the S3 site proposal and all planned coverage states; no score locks.

Before enabling RI05–RI08, connect the new opt-in contract to shared marking, sessions/backups, paper validation, math rendering, answer entry and default/portable/QA builds, with module/bundle parity and import tests. Retain all historical snapshots and existing contracts. Implement the non-foundation route separately from foundation defaults, then optional RI09 as a wholly manual activity. Complete and verify the full bounded topic before publishing its learner release.

AP01–AP08 are implemented with three core bilingual lessons and one optional enrichment lesson: 56 curriculum families and 27 bilingual lessons across eight topics. All 89 Node checks pass. Six development fixtures remain separate; all 237 mapped objective records remain planned.

Source/domain brief: planning/topics/estimation.md. Release evidence: site/planning/release-estimation-v1.md and site/planning/release-identity.json. Published and verified: all 36 current-source hosted workflows and all four combined student/key review booklets (166 HTML pages, including explicitly optional AP08) pass. Raw reports: site/planning/browser-estimation-run.json and site/planning/estimation-print-layout.json. Tested source commit 36632a59bd80674da69cd9b0c12ae43977891760 deployed successfully in run 45036297092. Historical evidence is preserved.

The four-topic number-route batch (basic, percentages, rates/ratios and estimation) is implemented and published as author drafts. The standalone checker milestone changes no learner release version and claims no new browser/print acceptance.

AP08 remains optional, wholly manual and excluded from automatic scores. Keep nonnegative halfway-up rounding and fixed precision explicit, with old numeric contracts unchanged. Actual current PDF/physical printing, native keyboard/zoom, spoken output, independent mathematics/Traditional Chinese review and learner trials remain pending.
