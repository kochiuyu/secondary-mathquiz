# Hosted pilot review — 22 November 2026

The public review draft is live at https://kochiuyu.github.io/secondary-mathquiz/ and redirects to `site/`. Repository: https://github.com/kochiuyu/secondary-mathquiz . Pages publishes `main` from `/ (root)`, with HTTPS enforced and no custom domain.

The tested source commit is `57e8be96a6375443447c594388e37abf7d68ffaf`; its Pages deployment run `44970565643` succeeded. All 103 uploaded source files matched the intended bytes. Portable source SHA-256: `f0fe877671d553d2fe6583406ab93ecb84f32a32b196e5d5a80b75bb51ac11c2`.

All **15 hosted browser workflows pass**, with 0 failures and 0 blocked checks. Raw evidence: `browser-hosted-expressions-run.json`, run `80e979e7-a50a-49af-aff7-83da582769f7`. It covers legacy workflows, signed-number and expressions lessons in both languages, 390px reflow, drafts/reload, manual review/edit guards, automatic score separation and bilingual paper/key rendering. The existing 46 Node checks remain passing; no application source changed during deployment.

The runner's overall acceptance state remains **pending** because its manual rows are unperformed. Separate scoped author observations are in `hosted-visual-review.json`: desktop lesson appearance, a Chinese mobile processing flow, a direct-link reload and four worksheet HTML page-bound inspections. Each English/Chinese student/key HTML sample contains 5 pages and questions 1–6, with no observed footer overlap or horizontal page overflow. This is HTML evidence, not actual PDF evidence.

Actual PDFs/physical printing, native 200% zoom, spoken assistive output, independent mathematics/language review and classroom review remain pending. All curriculum coverage remains planned. The deployed content is an author draft, not a certified complete course.

The former localhost blocker is historical; future browser work can use the hosted runner at https://kochiuyu.github.io/secondary-mathquiz/site/qa/index.html .
