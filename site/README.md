# Secondary MathQuiz — six-topic pilot v0.11.0

40 curriculum families and 19 bilingual author-draft lessons: basic computation, percentages, directed numbers, expressions, linear equations and angles. Six separately labelled development fixtures remain. All 237 curriculum records retain planned status.

From this directory, run node tools/serve.mjs and open http://127.0.0.1:5175/secondary-mathquiz/. The portable HTML also opens directly.

Development commands:

    node tools/build.mjs
    node --check tests/bundle-syntax.mjs
    node tools/verify.mjs
    node tools/make-percentage-samples.mjs
    node tools/make-pilot-print-review.mjs

Edit shell.html or modules and rebuild the default, portable and QA copies together. The runner at qa/index.html has 30 workflows; qa/print.html inspects combined booklet geometry. See planning/release-percentages-v1.md for actual evidence and limits. All 77 Node checks pass; current-source browser/layout execution is pending.

P2 retains the secondary-mathquiz:p2: storage namespace, version-1 curriculum generators, historical bundled fee snapshots, paper schema 1 and validated backup imports. Percentage IDs PC01–PC08 use generator version 1. Language, title, order, marks, working lines and snapshots contribute to paper identity. Preserve specifications and HTML with source for exact historical output.

Opening lessons records fixed and generated models as exposure. Exhausted variants are labelled practice. This is retained-model freshness, not universal semantic novelty or a mastery score. Manual explanations remain separate from final-answer scores and edits clear self-review. Learner records stay in the browser; export a backup before moving devices.

Percentage samples are in samples/percentages. They use exact values and a supplied fictional tax schedule. Four combined English/Traditional Chinese student/key booklets contain 127 generated HTML pages. Generation does not certify geometry or actual PDFs. Current PDF/physical printing, native zoom, spoken output and independent mathematics/language/classroom review remain pending.
