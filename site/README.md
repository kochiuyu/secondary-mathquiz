# Secondary MathQuiz — four-topic pilot v0.9.1

Open `Secondary_MathQuiz_Prototype.html` directly, or use the [live learning site](https://kochiuyu.github.io/secondary-mathquiz/). The homepage connects directed numbers, expressions, equations and angles. There are 24 curriculum families and 12 bilingual author-draft lessons, plus six separately labelled development fixtures. All 60 Node checks pass. All 22 current hosted workflows pass; raw manual acceptance remains pending. See `planning/release-angles-v1.md` for scope and review limits.

Geometry uses model-derived rays, sectors and triangle coordinates. Angle-pair names do not imply parallelism. Givens and parallel tests are distinct; the general proof is entirely manual and excluded from automatic scores. Rotations/reflections do not create fresh evidence. All 237 curriculum records retain planned status. Actual PDF/physical printing and independent content review remain pending.

## Run or develop

Node 22 or later is sufficient, with no package installation:

```powershell
node tools/serve.mjs
```

Open `http://127.0.0.1:5175/secondary-mathquiz/?lang=en#angles` (or `lang=zh`). The 22-case acceptance runner is `/secondary-mathquiz/qa/index.html`; it uses synthetic profiles and keeps manual observations separate. Opening the standalone HTML needs no server.

```powershell
node tools/build.mjs
node --check tests/bundle-syntax.mjs
node tools/verify.mjs
node tools/make-angle-samples.mjs
```

Rebuild after application-source changes. `qa/build.json` identifies the build, not a browser pass. `planning/release-identity.json` identifies this draft. Historical reports retain their original hashes.

## Saved versions and evidence

P2 uses `secondary-mathquiz:p2:` local storage, preserving P1's namespace. Review/import an old P1 backup explicitly if wanted; selected-learner replacement requires its own confirmation. Legacy v1/v2 snapshots and paper schema 1 remain supported. Curriculum IDs SN01–SN06, EX01–EX06, EQ01–EQ06 and GE01–GE06 retain per-family generator version 1. Regeneration validates the complete retained snapshot.

Paper schema 1's `generatorVersion:2` is a compatibility marker; items retain their own generator version. Fingerprints identify complete specifications, not byte-identical output across renderer versions. Keep HTML, specifications and source together when preserving exact output.

Opening a lesson records exposure, including fixed and generated models. A bounded fresh search excludes retained exposure; exhausted variants are labelled practice. This is retained-model freshness, not universal semantic novelty or a mastery score. EX03 has only two shape variants and may exhaust after studying both.

Manual tasks remain distinct from automatic final-answer scores. Editing a response clears its self-review label. Self-review requires recording the current response and comparing its model. Reading, hints, retries and reasons do not constitute independent mastery evidence.

Sample HTML and specifications are in `samples/angles`, `samples/equations`, `samples/expressions` and `samples/signed`. New samples contain all six angle families and six working lines per task. Generated page counts are separate from browser/PDF acceptance. Physical printing, native zoom, spoken assistive output and independent mathematics/language/classroom review remain pending.


The default `index.html` and portable page are generated from `shell.html`; edit the shell or modules, then rebuild. The QA runner and its definition module use content-versioned URLs to prevent stale browser scripts.

Keyboard consolidation: skip navigation now focuses the current content without changing its route or answer draft. The mobile menu contains keyboard focus, makes the background inactive, and returns focus on Escape. See `planning/release-navigation-v1.md` for current evidence.
