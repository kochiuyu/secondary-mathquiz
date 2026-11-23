# Secondary MathQuiz — foundation candidate v0.14.0

60 curriculum families and 29 bilingual author-draft lessons across nine topics. RI01–RI04 and RI-L1/RI-L2 cover the foundation roots/number-types route. Six development fixtures remain separate; all 237 curriculum records remain planned. Non-foundation and optional Unit 4 work is not yet implemented.

Run node tools/serve.mjs from this directory and open http://127.0.0.1:5175/secondary-mathquiz/#rational. The portable HTML also opens directly.

Development commands:

    node tools/build.mjs
    node --check tests/bundle-syntax.mjs
    node --check tests/acceptance-syntax.mjs
    node --test tests/*.test.mjs
    node tools/make-rational-samples.mjs

Build default/portable/QA copies together after editing modules or shell.html. All 110 Node tests and both syntax checks pass. qa/index.html defines 39 browser workflows. Current-source execution and booklet geometry remain pending because browser connection attempts timed out; no new visual or print acceptance is claimed. See planning/release-rational-foundation-v1.md and planning/rational-foundation-checks.json.

Legacy numeric, expression, choice, manual and set contracts are unchanged. Foundation irrational examples use exact stable choices and bound comparisons; they do not use decimal tolerances. The standalone quadratic-surd checker remains unconnected pending the non-foundation route. Existing generator versions, historical fee snapshots and paper schema 1 remain supported.

Core estimation tasks retain their fixed-decimal precision rules; optional AP08 remains wholly manual and excluded from automatic-score denominators. No optional or non-foundation Unit 4 work is forced into foundation defaults. Edited answers/reasons invalidate self-review. Exhausted semantic variants remain prior exposure/practice, not mastery.

Actual PDFs/physical printing, native keyboard/zoom, spoken output and independent mathematics/Traditional Chinese/classroom review remain pending. Learner work stays in the browser; export backups before moving devices.
