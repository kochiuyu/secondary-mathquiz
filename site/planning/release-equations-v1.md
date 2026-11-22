# Linear equations author draft v0.8.0

22 November 2026, Asia/Hong_Kong · P2.2c

Six new families EQ01–EQ06 implement proposed-solution checks, inverse-operation solving, distribution-error repair, equations with unknowns on both sides, contextual equation choices, and half-hour rental models. Every generated equation has exactly one solution. Variable denominators, quadratic equations, no-solution/infinite-solution cases and free equation-equivalence parsing are excluded. Scope: JS8.1–8.3.

Three English/Traditional Chinese lessons connect testing, solving, modelling and interpreting. They include goals, preparation, readiness, three explanations, two generated worked models, takeaways, practice and separate checks. Original-equation panels, labelled step sequences and fee tables have complete text. Study exposure includes generated and fixed authored examples. Earlier signed-number/expression families retain generator versions and snapshot contracts.

All 52 Node checks pass. New generator QA uses 300 seeds per family (1,800 generated cases, with possible repeats), independently checks original-side arithmetic, rational roots, nonzero coefficients and semantically distinct equation choices, and tests version guards, reasoning edits, exposure history, paper snapshots, bilingual views and app integration. This is author QA, not independent content review.

Automatic final-value/choice correctness is separate from manually reviewed reasoning. EQ01, EQ03, EQ05 and EQ06 have explicit manual-reason rubrics; selection/value marks and reasoning marks are separated in the paper key. The final-number checker does not certify methods, modelling, units or contextual interpretations. In this implementation EQ01 uses two local sample marks so selection and written substitution each have a distinct mark; its original design's one-mark estimate is historical.

English/Chinese six-family student/key HTML with six working lines and full specifications is in `samples/equations`. Generated page counts do not certify browser or actual PDF fit. The hosted runner has 18 workflows; the current build's results are pending until recorded separately. Historical browser results apply only to their hashes.

All 237 curriculum records retain planned status. Eighteen curriculum families and nine bilingual lessons are now author drafts; angles remain six briefs and three outlines. Independent mathematics/language/classroom review, native zoom, spoken assistive output and actual PDF/physical printing remain pending.
