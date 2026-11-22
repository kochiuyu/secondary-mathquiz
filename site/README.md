# Secondary MathQuiz — eight-topic pilot v0.13.0

56 curriculum families and 27 bilingual author-draft lessons. Estimation adds three core lessons and one optional, wholly manual enrichment lesson. Six development fixtures remain separate; all 237 curriculum records remain planned.

Run node tools/serve.mjs from this directory and open http://127.0.0.1:5175/secondary-mathquiz/. The portable HTML also opens directly.

Development commands:

    node tools/build.mjs
    node --check tests/bundle-syntax.mjs
    node tools/verify.mjs
    node tools/make-estimation-samples.mjs
    node tools/make-pilot-print-review.mjs

Build default/portable/QA copies after editing shell.html or modules. All 89 Node checks pass. The runner at qa/index.html defines 36 workflows; qa/print.html reviews four combined booklets (166 HTML pages). Current-source browser/layout execution is pending. See planning/release-estimation-v1.md for scope and actual evidence.

AP01–AP08 use generator version 1. Fixed decimal precision is an opt-in property on the number contract; old numeric contracts retain equivalent-fraction acceptance. All prior generators, historical bundled fee snapshots and paper schema 1 remain supported. Paper identity includes language, title, order, marks, working lines and stored question snapshots.

The estimation hub selects seven core families. AP08 is optional, unchecked by default in generic builders, and offered as one investigation. It is excluded from automatic-score denominators; all its marks are manual. Core reasons also require manual review. Drafts preserve trailing zeros. Editing answers/reasons invalidates self-review.

Lesson exposure includes fixed/generated models; changing an AP01 count or AP08 scenario number does not make a fresh concept. Exhausted variants stay prior exposure/practice, not mastery. Review samples in samples/estimation explicitly include the optional investigation; ordinary core paper creation does not.

Actual current PDF/physical printing, native keyboard/zoom, spoken output and independent mathematics/Traditional Chinese/classroom review remain pending. Learner work stays in the browser; export a backup before moving devices.
