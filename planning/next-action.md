# Handoff — rational/irrational numbers planned; v0.13.0 remains published

The next topic now has a source-checked implementation plan: [planning/topics/rational.md](topics/rational.md), checked 22 November 2026 (Hong Kong). The plan reserves RI01–RI09: four foundation families, four non-foundation surd families and one optional, wholly manual construction investigation, supported by five proposed bilingual lessons. These are planned resources, not implemented availability.

Next action: implement the bounded exact-surd arithmetic/answer contract and its independent checks, after revising the four Unit 4 site-authored prerequisite fields as specified in the brief. The current blanket JS-10-3 prerequisite is unnecessary for this bounded slice. Use powers, factorisation and rational/directed arithmetic; construction work additionally needs its stated geometry preparation. Preserve source wording/classifications and planned coverage status. Keep the new exact contract opt-in, retain all historical snapshots and number/expression contracts, and do not use floating tolerances for irrational answers.

Then implement RI01–RI04 and the first two lessons, followed by RI05–RI08 and the non-foundation route, then optional RI09. Build and verify the complete bounded topic before publishing the author-draft application release. Foundation defaults must not silently include non-foundation tasks or the optional investigation.

AP01–AP08 are implemented with three core bilingual lessons and one optional enrichment lesson: 56 curriculum families and 27 bilingual lessons across eight topics. All 89 Node checks pass. Six development fixtures remain separate; all 237 mapped objective records remain planned.

Source/domain brief: planning/topics/estimation.md. Release evidence: site/planning/release-estimation-v1.md and site/planning/release-identity.json. Published and verified: all 36 current-source hosted workflows and all four combined student/key review booklets (166 HTML pages, including explicitly optional AP08) pass. Raw reports: site/planning/browser-estimation-run.json and site/planning/estimation-print-layout.json. Tested source commit 36632a59bd80674da69cd9b0c12ae43977891760 deployed successfully in run 45036297092. Historical evidence is preserved.

The four-topic number-route batch (basic, percentages, rates/ratios and estimation) is implemented and published as author drafts. The planning change adds no runtime features, changes no release version and claims no new browser/print acceptance.

AP08 remains optional, wholly manual and excluded from automatic scores. Keep nonnegative halfway-up rounding and fixed precision explicit, with old numeric contracts unchanged. Actual current PDF/physical printing, native keyboard/zoom, spoken output, independent mathematics/Traditional Chinese review and learner trials remain pending.
