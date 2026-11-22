# GitHub Pages deployment

This repository preserves the P2 design and implementation source. The website is in `site/`; the repository home redirects there while preserving language/query/lesson links. All assets and module imports use relative paths. No server or package installation is required for hosting.

In GitHub Settings → Pages, choose Deploy from a branch, main, / (root). `.nojekyll` retains the authored static files.

Live learning site: https://kochiuyu.github.io/secondary-mathquiz/site/

Hosted browser runner: https://kochiuyu.github.io/secondary-mathquiz/site/qa/index.html

Run the 22 workflow checks there and export actual evidence for the published source hash. Use synthetic test profiles. The runner's isolated storage is distinct from the ordinary application namespace. Do not upload learner backups or local browser data to this repository.

This is an author draft for review. All 59 Node checks and 21 hosted browser workflows pass for v0.9.0. Actual PDF and independent review remain pending; see `site/planning/release-angles-v1.md`. All curriculum coverage records remain planned. Publishing a preview does not certify curriculum completion.

For later updates, rebuild with `node site/tools/build.mjs`, run `node site/tools/verify.mjs`, and commit the source and generated portable/QA copies together. Keep historical browser evidence tied to its recorded source hash.


All four pilot topics are implemented as author drafts. The default site is a complete bundled HTML artifact generated from `site/shell.html`; the runner and its definition module use content-versioned URLs. For immediate review after deployment, add the recorded build prefix as the `build` query parameter to the site/runner URL.

The current v0.9.1 navigation consolidation passes 60 Node checks and 22 hosted browser workflows; its evidence is separate from v0.9.0. See `site/planning/release-navigation-v1.md`.
