# Keyboard navigation consolidation - v0.9.1

22 November 2026, Asia/Hong_Kong.

The four-topic pilot retains 24 question families and 12 bilingual author-draft lessons. This consolidation repairs navigation without changing mathematical generators, retained snapshots or learner storage.

The skip link previously changed the application route to `#main`, which rendered the missing-page screen. It now prevents that route change and focuses the existing main content, retaining the current answer form and unsent draft. The mobile navigation uses dialog semantics, makes the background inert while open, wraps Tab/Shift+Tab within its visible controls, returns focus to its button on Escape, and releases the background when resized to desktop width.

All 60 Node checks pass. A22 adds bilingual skip-link draft preservation and mobile focus/resize handler checks to the retained 21 browser workflows. All 22 current hosted workflows pass; the raw manual rows remain pending. Keyboard handler measurements and actual native key observations are recorded separately; neither certifies spoken assistive output.

Actual student/key PDF inspection, native 200% zoom, spoken assistive output, independent mathematics/language review and classroom trials remain pending. All 237 objective records retain planned coverage. The v0.9.0 angles report remains historical evidence for its original source hash.


The directed-number topic now links directly to expressions and no longer describes the implemented equation/angle topics as still in design. A pre-existing test race was exposed during verification: a single event-loop turn did not always finish a paper fingerprint. The application integration checks now wait for a nonempty preview with a bounded timeout. Final result: 60/60 Node checks pass; bundle and runner syntax checks pass.

The original hosted skip-link failure was reproduced: activating it changed `#home` to `#main` and showed the missing-page screen. The updated local standalone build opened in Chrome. Local HTTP previews timed out in both browsers, so verification continued on the hosted build. Native keyboard interaction could not be completed because the active Chrome tab changed during review; no native-keyboard pass is claimed.

The user explicitly authorized publication of these prepared changes. Deployment succeeded and all 22 current hosted workflows pass. Keep PDF/physical-print and assistive/independent review pending.


## Published verification

The final hosted run passes 22/22 workflows, with 0 failures and 0 blocked checks. Raw report: `browser-hosted-navigation-run.json`. It matches the portable source hash in `release-identity.json`. The first run is retained in `browser-navigation-first-run.json`: 21/22 passed because A22 requested a one-question session not offered by the setup form. A22 now uses the available four-question option; its runner URL was re-versioned before the successful rerun. Application source was unchanged by this test-setup correction.

The live English directed-number path shows `Next: expressions` and its updated transition text. Pressing Enter on the live skip link kept `#signed`, retained the heading and focused `main`. A22 checks English/Chinese route/form/draft preservation, mobile Tab boundaries, inert background, Escape return and desktop resize. Its keyboard events are synthetic; complete native-keyboard and spoken assistive acceptance remains pending. The raw manual rows are pending and the overall acceptance record is therefore pending.

Published app commit: `5b7a4e956c280ce4cc8c4249f41af924121ee7c9`; corrected runner/tested commit: `3cc519c456add95510ee2fe8be9e7bd1622bc336`. GitHub Pages deployment run `44979430932` succeeded. Subsequent evidence-only commits retain this application hash.
