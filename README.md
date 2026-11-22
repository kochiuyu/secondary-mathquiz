# Secondary MathQuiz

English/Traditional Chinese mathematics lessons, practice and printable worksheets for Hong Kong secondary schools.

- [Live learning site](https://kochiuyu.github.io/secondary-mathquiz/)
- [Hosted browser checks](https://kochiuyu.github.io/secondary-mathquiz/site/qa/index.html)
- [Development instructions](site/README.md)
- [Basic-computation release and limits](site/planning/release-basic-v1.md)
- [Next actions](planning/next-action.md)

The v0.10.0 five-topic pilot has 32 curriculum question families and 15 bilingual lessons: basic computation, directed numbers, expressions, linear equations, and angles/parallel lines. All are author drafts. All 71 Node checks pass; 27 hosted workflows are pending for this new source. Earlier 18/18 results belong to v0.8.0.

Proofs and written reasons need manual review. Rotating or reflecting a question does not make it fresh. All 237 mapped objective records remain planned; this pilot is not complete secondary-curriculum coverage. Six development fixtures remain separately labelled. Independent content/classroom review and actual PDF/physical printing are pending.

Learner records stay in each browser; export a backup before moving devices. Ordinary storage is shared by pages on the same browser origin. No learner backups or source PDF archive are published. The default app is one bundled HTML build; `site/shell.html` is the modular development template. Build source and generated default/portable/QA pages together.

Keyboard consolidation: skip navigation now focuses the current content without changing its route or answer draft. The mobile menu contains keyboard focus, makes the background inactive, and returns focus on Escape. See `site/planning/release-navigation-v1.md` for current evidence.

Print readability review: number-line labels are larger and no longer outlined. The [four-booklet layout review](site/qa/print.html) covers all 32 families in English/Traditional Chinese student/key formats. Four updated booklet HTML layouts (108 pages) await current-source review; actual current PDF acceptance remains pending; see `site/planning/release-print-v1.md`.

Marking guidance now follows the actual area shape and edited mark allocation. See `site/planning/release-review-v1.md`. [Next curriculum batch](planning/next-batch.md) has implemented basic computation as an author draft; percentages are next.

The standalone build preserves currency-template text. Exact historical bundled fee snapshots remain supported; the current HTML/module parity and legacy snapshot checks are part of the 71 Node checks.
