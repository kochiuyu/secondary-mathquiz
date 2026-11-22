# GitHub Pages deployment

This repository preserves the P2 design and implementation source. The website is in `site/`; the repository home redirects there while preserving language/query/lesson links. All assets and module imports use relative paths. No server or package installation is required for hosting.

In GitHub Settings → Pages, choose Deploy from a branch, main, / (root). `.nojekyll` retains the authored static files.

Expected learning site: https://kochiuyu.github.io/secondary-mathquiz/site/

Expected browser runner: https://kochiuyu.github.io/secondary-mathquiz/site/qa/index.html

Run the 15 workflow checks there and export actual evidence for the published source hash. Use synthetic test profiles. The runner's isolated storage is distinct from the ordinary application namespace. Do not upload learner backups or local browser data to this repository.

This is an author draft for review. All 46 Node checks pass for v0.7.0; current browser/PDF review remains pending until performed on the hosted build. All curriculum coverage records remain planned. Publishing a preview does not certify curriculum completion.

For later updates, rebuild with `node site/tools/build.mjs`, run `node site/tools/verify.mjs`, and commit the source and generated portable/QA copies together. Keep historical browser evidence tied to its recorded source hash.
