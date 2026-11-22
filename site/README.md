# Secondary MathQuiz — equations pilot v0.8.0

Open `Secondary_MathQuiz_Prototype.html` directly, or use the [live learning site](https://kochiuyu.github.io/secondary-mathquiz/). Choose Learn equations, Learn expressions or Learn directed numbers. There are now 18 curriculum families and nine bilingual author-draft lessons. All 52 Node checks pass. The current 18-case hosted browser run is pending until recorded. See `planning/release-equations-v1.md` for scope and review limits.

The equation slice always has exactly one solution. Candidate checks, bracket-error explanations and contextual models keep written reasoning distinct from automatically checked values/choices. All 237 curriculum records retain planned status. Angles remain in design. Actual PDF/physical printing, independent content review, native zoom and spoken assistive output remain pending.

## Run or develop

Node 22 or later is sufficient, with no package installation:

```powershell
node tools/serve.mjs
```

Open `http://127.0.0.1:5175/secondary-mathquiz/?lang=en#equations` (or `lang=zh`). The 18-case acceptance runner is `/secondary-mathquiz/qa/index.html`; it uses synthetic profiles and keeps manual observations separate. Opening the standalone HTML needs no server.

```powershell
node tools/build.mjs
node --check tests/bundle-syntax.mjs
node tools/verify.mjs
node tools/make-equation-samples.mjs
```

Rebuild after application-source changes. `qa/build.json` identifies the build, not a browser pass. `planning/release-identity.json` identifies this draft. Historical reports retain their original hashes.

## Saved versions and evidence

P2 uses `secondary-mathquiz:p2:` local storage, preserving P1's namespace. Review/import an old P1 backup explicitly if wanted; selected-learner replacement requires its own confirmation. Legacy v1/v2 snapshots and paper schema 1 remain supported. Curriculum IDs SN01–SN06, EX01–EX06 and EQ01–EQ06 retain per-family generator version 1. Regeneration validates the complete retained snapshot.

Paper schema 1's `generatorVersion:2` is a compatibility marker; items retain their own generator version. Fingerprints identify complete specifications, not byte-identical output across renderer versions. Keep HTML, specifications and source together when preserving exact output.

Opening a lesson records exposure, including fixed and generated models. A bounded fresh search excludes retained exposure; exhausted variants are labelled practice. This is retained-model freshness, not universal semantic novelty or a mastery score. EX03 has only two shape variants and may exhaust after studying both.

Manual tasks remain distinct from automatic final-answer scores. Editing a response clears its self-review label. Self-review requires recording the current response and comparing its model. Reading, hints, retries and reasons do not constitute independent mastery evidence.

Sample HTML and specifications are in `samples/equations`, `samples/expressions` and `samples/signed`. New samples contain all six equation families and six working lines per task. Generated page counts are separate from browser/PDF acceptance. Physical printing, native zoom, spoken assistive output and independent mathematics/language/classroom review remain pending.
