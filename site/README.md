# Secondary MathQuiz — expressions pilot v0.7.0

22 November 2026 · twelve implemented draft families · six bilingual lessons

Open `Secondary_MathQuiz_Prototype.html` in a current browser and choose **Learn expressions** or **Learn directed numbers**. The application is self-contained. Source, tests, worksheet HTML and specifications are included. The public review draft is live at https://kochiuyu.github.io/secondary-mathquiz/ .

Expressions EX01–EX06 cover words and symbols in both directions, two-variable area formulae, open sequence proposals, supplied general terms and input–processing–output. Three English/Traditional Chinese lessons include readiness, explanations, worked models, practice, checks, takeaways and next links. Formula explanations and open sequence proposals require manual review and are excluded from automatic scores. Equivalent grouped expressions are accepted; expansion is not a unit-7 completion requirement.

**All 46 Node checks pass**, including signed-number and legacy checks and 1,800 new expressions seed cases. All **15 hosted browser workflows pass** on GitHub Pages. Four bilingual student/key HTML samples fit their checked page bounds. Actual PDF/physical printing and independent content review remain pending. Raw manual acceptance rows remain pending; scoped observations are separate. See [the hosted release report](planning/github-pages-release.md).

The four-topic design retains 24 family briefs and 12 lesson outlines. Signed numbers and expressions now have twelve implemented families and six lessons as author drafts. Equations and angles remain twelve briefs and six outlines. All 237 curriculum records retain planned coverage status. The six old development examples remain separately labelled and unselected by default. P1 and previous release packages are preserved.

Next: resolve preview access, run 15 browser workflows, review bilingual worksheet/PDF output, then implement EQ01–EQ06. See [the handoff](../planning/next-action.md).

## Run or develop

Node 22 or later is sufficient, with no package installation:

```powershell
node tools/serve.mjs
```

Open `http://127.0.0.1:5175/secondary-mathquiz/?lang=en#expressions` (or `lang=zh`). The 15-case acceptance runner is `/secondary-mathquiz/qa/index.html`; it uses synthetic profiles and keeps manual observations separate. Opening the standalone HTML needs no server.

```powershell
node tools/build.mjs
node --check tests/bundle-syntax.mjs
node tools/verify.mjs
node tools/make-expression-samples.mjs
```

Rebuild after application-source changes. `qa/build.json` identifies the build, not a browser pass. `planning/release-identity.json` identifies this draft. Historical reports retain their original hashes.

## Saved versions and evidence

P2 uses `secondary-mathquiz:p2:` local storage, preserving P1's namespace. Review/import an old P1 backup explicitly if wanted; selected-learner replacement requires its own confirmation. Legacy v1/v2 snapshots and paper schema 1 remain supported. Curriculum IDs SN01–SN06 and EX01–EX06 retain per-family generator version 1. Regeneration validates the complete retained snapshot.

Paper schema 1's `generatorVersion:2` is a compatibility marker; items retain their own generator version. Fingerprints identify complete specifications, not byte-identical output across renderer versions. Keep HTML, specifications and source together when preserving exact output.

Opening a lesson records exposure, including fixed and generated models. A bounded fresh search excludes retained exposure; exhausted variants are labelled practice. This is retained-model freshness, not universal semantic novelty or a mastery score. EX03 has only two shape variants and may exhaust after studying both.

Manual tasks remain distinct from automatic final-answer scores. Editing a response clears its self-review label. Self-review requires recording the current response and comparing its model. Reading, hints, retries and reasons do not constitute independent mastery evidence.

Sample HTML and specifications are in `samples/expressions` and retained `samples/signed`. New samples contain all six expressions families and six working lines per task. Generated page counts are separate from browser/PDF acceptance. Physical printing, native zoom, spoken assistive output and independent mathematics/language/classroom review remain pending.
