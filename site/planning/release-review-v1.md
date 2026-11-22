# Marking and explanation review - v0.9.3

The author review identified two concrete issues: one-mark questions displayed zero method marks, and the Traditional Chinese area-formula rubric asked a rectangle response to justify a triangle's half factor. The revised presentation uses shape-specific area guidance in lessons, practice and paper keys. One-mark tasks omit zero-mark criteria; written reasons still need review when no separate reason mark is allocated. Choice tasks label the allocated answer mark as selection, while numeric tasks use final value. Whole-response formula, sequence and proof tasks remain entirely manual.

The correction is presentation guidance in `src/renderers/review.mjs`. Mathematical generators, answer contracts, seeds, question versions and retained snapshots are unchanged. Old papers and learner sessions continue to validate. A specification fingerprint does not promise byte-identical output across renderer revisions.

All 65 Node checks pass, including shape-specific bilingual review, 24 families at four mark allocations in both languages, edited one-mark choices, whole-proof review, and retained-paper snapshot validation. The new A23 browser workflow covers lesson/practice criteria, the retained bilingual rectangle key and a one-mark choice edit. Current 24-workflow browser and 84-page HTML layout runs are pending until recorded. The layout runner and booklet URLs are content-versioned so older browser caches do not supply stale guidance.

This is a scoped author correction, not independent acceptance of all mathematics or translation. PDF/physical-print, native zoom, spoken assistive output and learner trials remain pending. The next number-route batch is proposed in `../../planning/next-batch.md`: basic computation first, then percentages, rates/ratios/proportions and estimation. Detailed source scope and classifications must be checked before implementing each family.


## Compiled currency regression

The first hosted run passed 22/23 checks. A23 exposed a real compiled-source mismatch when importing a modularly generated equation paper. The bundler inserted generated JavaScript as a String.replace replacement string, so doubled dollar signs in fee templates were consumed. The produced HTML omitted currency markers and generated EQ05/EQ06 snapshot text that differed from the source modules. Replacement callbacks now preserve literal content.

The new parity test executes the module prefix extracted from the actual generated HTML, rather than trusting the pre-insertion script. All registered families match modular snapshot generation across deterministic seeds; additional fee cases retain three currency markers in each language. A24 checks current displayed markers and historical fee-paper import/reload in the browser.

A captured two-question/worked-example fixture records the pre-fix published bundle's exact output. Paper/session/worked-example validation accepts that exact known version-1 fee-prompt variant without rewriting it. Answers, semantic models, diagrams, contracts, other wording and worked-example seed binding remain checked; altered variants are rejected. The mathematical generator files remain byte-identical. Older retained text is preserved; newly generated fee prompts contain their currency markers.

Current source hash and browser results are recorded separately from the first failed report. PDF/physical-print and independent review remain pending.
