# Secondary MathQuiz — seven-topic pilot v0.12.0

48 curriculum families and 23 bilingual author-draft lessons across seven topics. Six development fixtures remain separate. All 237 curriculum records retain planned status.

From this directory, run node tools/serve.mjs and open http://127.0.0.1:5175/secondary-mathquiz/. The portable HTML also opens directly.

Development commands:

    node tools/build.mjs
    node --check tests/bundle-syntax.mjs
    node tools/verify.mjs
    node tools/make-ratio-samples.mjs
    node tools/make-pilot-print-review.mjs

Edit shell.html or source modules, then build default/portable/QA copies together. All 83 Node checks pass. The runner at qa/index.html defines 33 workflows; qa/print.html reviews four combined booklets (150 HTML pages). All 33 current-source hosted workflows and all 150 booklet HTML pages pass; source-matched raw reports are saved in planning. See planning/release-ratios-v1.md for scope and actual evidence.

RP01–RP08 use generator version 1. Earlier generator versions, stored models, historical bundled fee snapshots and paper schema 1 remain supported. Language, title, order, marks, working lines and snapshots contribute to paper identity. Preserve specifications, HTML and source to retain exact historical output.

Lesson opening records fixed/generated examples as exposure, not mastery. Scaling both masses in RP01 or renaming a coefficient in RP07 does not create fresh conceptual evidence. Exhausted rule types remain prior exposure/practice. Explanations stay separate from final-answer scores and edits clear self-review. Learner work stays in the browser; export a backup before moving devices.

Rates/ratios samples are in samples/ratios, with all eight families and six working lines. Proportional premises, unit conversions and the order of scale ratios are explicit. Numerical answers are exact. Scale figures are schematic and must not be measured. Formal variation methods, proportion graphs and similar-figure area rules are separate topics.

Actual current PDF/physical printing, native keyboard/zoom, spoken output and independent mathematics/Traditional Chinese/classroom review remain pending.
