# Signed-number pilot implementation — 22 November 2026

**P2.2a is implemented as an author draft, ready for further review.** P1 remains preserved in its accepted folder/package. New work is isolated in `p2/site`; no public repository/site has been created.

| Deliverable | Implemented scope |
| --- | --- |
| SN01 | Signed quantities relative to zero, including zero itself |
| SN02 | Stable-ID comparison of distinct directed rational values |
| SN03 | Directed addition/subtraction movement, including subtracting a negative |
| SN04 | Signed multiplication/division and inverse checks; no zero divisors |
| SN05 | Bounded bracketed mixed operations with exact rational answers |
| SN06 | Directed change, fixed printed units and a separate written-reason rubric |
| SN-L1 | Where is zero? / 零在哪裏？ |
| SN-L2 | Moves, inverses and sign patterns / 移動、逆運算與符號規律 |
| SN-L3 | A change is not a final value / 變化不等於最後數值 |

Each lesson has a purpose, preparation/goals, a readiness contrast, explanatory sections, two deliberately chosen contrasting models, a takeaway, next connection and separate guided/check actions. Full narration and model text are authored in both languages. Number lines share exact semantic parameters with prompts/answers and have non-drag textual alternatives. Labels matching existing ticks are not repeated; close fractional labels use separate rows.

Six P1 development fixtures remain available but are labelled and unselected by default. One registry dispatches per-family versions. Old v1/v2 snapshots are validated under their original marking; new curriculum questions use version 1. P2 local profiles use a separate namespace, with reviewed P1 backup import available. No P1 profile or accepted source was overwritten.

## Automated scope

Final run: 39 passed, 0 failed (`tests/results.txt` and `.json`). It includes all retained tests plus independent small-model arithmetic for six families across 300 deterministic seeds each, deliberately wrong alternatives, exact form acceptance, 320 number-line geometry cases, bilingual lesson structure, generated/static lesson exposure, exhausted freshness, contextual reason separation and curriculum paper/key identity. Seed cases may repeat mathematical variants; these are not 1,800 distinct families or a claim of exhaustive parameter coverage.

## Actual browser scope

The in-app browser successfully rendered and executed the current application after native Chrome capture was unavailable. Three browser exports are retained: initial 12/12, layout/model follow-up 12/12, and final 12/12 after the worksheet-label repair. The final JSON identifies the exact portable source build. All raw manual rows remain pending; no automatic pass is relabelled as independent review.

The twelve workflows cover legacy functionality, all three new lessons in English/Traditional Chinese, 390px reflow, all six curriculum families, bilingual draft/reload, contextual reason editing and Chinese paper/key identity. Representative Chinese lesson screens were inspected at desktop and a 390px viewport. The mobile menu opened using Space; Escape closed it and returned focus to the labelled menu control. A modular Chinese lesson direct link survived refresh under `/secondary-mathquiz/`. The English three-session hub was left available for review.

Visual follow-up selected worked models that actually contrast signed cases, rather than relying on incidental positive-only random examples. Another observation found that printed LEFT/RIGHT option IDs could be misleading after shuffling. Printed choices now use A/B by displayed order, and the solution key names the correct displayed letter; the stable internal ID still controls online marking. The final tests and browser run follow those changes.

## Worksheet observation

`samples/signed` retains English/Chinese specifications, student HTML and key HTML with six working lines per item. Student documents have four pages and keys three. The browser measured each A4 page at approximately 1122.52 CSS px high; every final question bottom was above its page footer. Representative English student and Chinese solution layouts, fractions, labels and contextual rubric were visually inspected. Both documents use the same six numbered mathematical models; total marks are eight. Lettered choices and numeric solutions correspond.

These are **screen-rendered HTML measurements**, not PDF or physical-print certification. No new P2 PDF was saved/inspected. The original P1 PDFs are separate historical evidence, not evidence for changed P2 content.

## Remaining review and handoff

Next verify actual English/Chinese PDF output for this new slice, including every page, then record mathematical and bilingual review. Native 200% zoom and spoken screen-reader output remain untested for P2. Independent review and classroom effectiveness are not claimed. After the relevant signed-number review, implement EX01–EX06 and the three expressions lessons from the prepared design, preserving the multivariable/open-pattern/manual-review boundaries.

The source objectives retain planned coverage status. Implemented author drafts and passing technical checks do not certify complete curriculum coverage, mastery, grades or secure assessment. No public teaching-pilot acceptance is recorded.
