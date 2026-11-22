# Print readability consolidation - v0.9.2

The retained English student/key and Chinese student PDFs (11 pages) were checked for A4 size, numbering, paper fingerprint, text/glyph extraction, student/key separation and visible page clipping. They are historical baseline files, not the current renderer's PDF acceptance. Number-line labels were too small and heavy: the print diagram is now 130 CSS px high instead of 100, and labels no longer inherit a stroke from their tick group. The print pagination budget includes the increased height. The same text-stroke fix applies on screen.

All 60 Node checks pass. Existing question models, answers, snapshot versions and storage are retained. The four-topic pilot remains 24 families and 12 bilingual author-draft lessons; all 237 objective coverage records remain planned.

`qa/print.html` checks four review booklets, covering all 24 families in English/Traditional Chinese student/key formats, with six working lines. Each booklet has 21 topic-numbered pages. The new HTML check covers A4 bounds, question/footer clearance, numbering, paper fingerprints, student/key separation, working-line counts and readable number-line styles. Actual browser results and the 22 application workflows are pending until recorded.

Review booklets concatenate four unchanged topic specifications using the production renderer. Page numbering/fingerprints restart per topic; they are not a new mixed-paper specification. Regenerate with `node tools/make-pilot-print-review.mjs` after changing sample specifications or the print renderer.

New PDF export is blocked by native Chrome inspection timeouts on selection and retry. Actual current PDF and physical printing, native zoom, spoken assistive output, independent mathematics/language review and learner trials remain pending. Do not describe an HTML geometry pass as a PDF pass.
