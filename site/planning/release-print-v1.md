# Print readability consolidation - v0.9.2

The retained English student/key and Chinese student PDFs (11 pages) were checked for A4 size, numbering, paper fingerprint, text/glyph extraction, student/key separation and visible page clipping. They are historical baseline files, not the current renderer's PDF acceptance. Number-line labels were too small and heavy: the print diagram is now 130 CSS px high instead of 100, and labels no longer inherit a stroke from their tick group. The print pagination budget includes the increased height. The same text-stroke fix applies on screen.

All 60 Node checks pass. Existing question models, answers, snapshot versions and storage are retained. The four-topic pilot remains 24 families and 12 bilingual author-draft lessons; all 237 objective coverage records remain planned.

`qa/print.html` checks four review booklets, covering all 24 families in English/Traditional Chinese student/key formats, with six working lines. Each booklet has 21 topic-numbered pages. The new HTML check covers A4 bounds, question/footer clearance, numbering, paper fingerprints, student/key separation, working-line counts and readable number-line styles. All 22 hosted application workflows and all four review-booklet HTML geometry checks pass for the current source hash.

Review booklets concatenate four unchanged topic specifications using the production renderer. Page numbering/fingerprints restart per topic; they are not a new mixed-paper specification. Regenerate with `node tools/make-pilot-print-review.mjs` after changing sample specifications or the print renderer.

New PDF export is blocked by native Chrome inspection timeouts on selection and retry. Actual current PDF and physical printing, native zoom, spoken assistive output, independent mathematics/language review and learner trials remain pending. Do not describe an HTML geometry pass as a PDF pass.


## Hosted results

GitHub Pages deployment run `44983367549` succeeded for tested source commit `98dedfef7ff473445979733f2bdf0f74da97dc62`. All 22 application workflows pass, with zero failures/blocked rows. The raw manual acceptance rows remain pending. The separate print-layout run passes four documents and measures all 84 pages, including A4 bounds, question/footer clearance, numbering, fingerprints, six working lines, student/key separation and number-line styles. These are retained sample layouts, not a claim about every generated variant.

Raw reports: `browser-hosted-print-run.json` and `print-layout-review.json`. Both match the application source hash in `release-identity.json`. The first English student page was visually inspected on the live review booklet; tick labels are larger and filled without an outline stroke. No new native PDF export was completed. The 11-page historical PDF baseline is documented in `pdf-baseline-review.json` and does not certify the revised renderer's PDF output.
