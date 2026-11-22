> Implementation update, 22 November 2026: SN01–SN06 and three bilingual lessons are now implemented as author drafts in `site`. Final checks: 39 Node and 12 browser workflows passed. New PDF/independent review remains pending. The other 18 families/nine lessons remain in design. The baseline below is preserved; `next-action.md` is current.

# Four-topic pilot design and execution plan

22 November 2026 · design version 0.1.0 · all resources remain drafts

Prepare a small, coherent pilot that teaches concepts as well as calculation. The four topics move from directed quantities to symbolic rules, equality and geometric deduction. They are direct-access topics; the sequence is a site proposal, not an EDB year prescription or a learner access lock.

## Current decision and dependency

P1.8's bounded technical prototype gate is now accepted for pilot authoring. After the user's explicit incidental-telemetry approval, a normal server retry stayed available. The modular Chinese direct topic and English filtered catalogue survived refresh under `/secondary-mathquiz/`; the current-build runner passed 9/9. The P1 package contains `planning/acceptance-closeout.md`, `prototype-acceptance.json` and the untouched final browser export.

These briefs were prepared while that check was blocked. The dependency is now resolved, and implementation can begin with signed numbers. The design remains an author draft: it does not implement families, alter planned coverage or establish independent teaching-pilot review. No public site is claimed.

## Topic plan

| Topic | Source objectives | Distinct draft families | Session outlines | Key boundary |
| --- | --- | --- | --- | --- |
| Directed numbers / 有向數 | JS2.1–2.3 | SN01–SN06 | SN-L1–L3 | Reference, order, operations and contextual change; avoid needless arithmetic complexity |
| Expressions / 代數式 | JS7.1–7.4 | EX01–EX06 | EX-L1–L3 | Includes sequences, general terms and preliminary functions; expansion/like terms belong to unit 11 |
| One-unknown linear equations / 一元一次方程 | JS8.1–8.3 | EQ01–EQ06 | EQ-L1–L3 | Exactly one solution; checking, preserving equality, modelling and interpretation are separate demands |
| Angles and parallel lines / 角和平行線 | JS19.1–19.5 | GE01–GE06 | GE-L1–L3 | Pair names, parallel properties, parallel tests and proof have different givens/evidence |

The 24 count refers to distinct task structures, not numerical variants. Interior/exterior questions remain one triangle-deduction family. Addition/subtraction share a movement family. Angle-sum modes are not counted as five extra families. Sequence inference and supplied-general-term evaluation are distinct because the former is open and the latter has a fixed numerical value.

The objective map in [coverage.md](coverage.md) accounts for every selected objective. A map and a sample do not establish full objective coverage.

## What the lesson author must create

Each of the 12 session outlines follows the same learning rhythm while allowing different mathematical work:

1. A short overview that states the purpose and connects to earlier work.
2. A readiness contrast with optional repair.
3. A visual or example/non-example explanation with an equivalent text route.
4. A worked model explaining decisions, followed by guidance that fades.
5. A separate check using fresh, unexposed tasks and the declared answer contract.
6. A takeaway explaining what was learned and the named next connection.

The timing target is roughly 8–15 minutes, to be tested rather than promised. Formula explanation and geometry proof may take longer. Preserve deeper explanation in expandable detail rather than deleting it.

Every full session must be authored in English and Traditional Chinese from the same mathematical model. The current titles and family samples are bilingual; the complete session narration, visual captions and interaction copy remain P2.2 work. The language states must say this plainly.

## Engine work before authoring at scale

| Capability | P1 basis | Required work for this pilot |
| --- | --- | --- |
| Final numeric value | Exact rational parser, final-number form checking | New semantic models, valid domains, unit labels and original-equation/inverse checks |
| One-variable expression | Exact bounded polynomial equivalence | Phrase/model generation; accept equivalent grouping without requiring expansion |
| Choice | Stable IDs and separate displayed order | Bilingual choices from distinct semantic models; remove duplicate/equivalent false options |
| Number line | Not a complete curriculum renderer | Equal-scale positions/arrows, bounded ticks, text alternative, mobile/print inspection |
| Parallel/triangle diagrams | One adjacent-angle fixture only | Shared ray/intersection model; parallel construction; angle arcs/labels, rotation/reflection, collision checks and text alternative |
| Two-variable formula | Unsupported by the x-only parser | Labelled manual response/rubric first; do not repurpose the parser silently |
| Free contextual equation | No general equation-equivalence contract | Stable-choice model or manual response first; introduce a separate validated contract before free automatic marking |
| Open sequence/proof | Existing numeric field is insufficient | Store written proposals/statements, display model/rubric and distinguish self/manual from automatic evidence |
| Per-part evidence | Existing answer and reason distinction | Keep final-value, choice, model, method, interpretation and proof states separate; no automatic method marks without working |
| Family/version registry | Synthetic fixtures and v1/v2 compatibility | New curriculum family IDs/version 1, retained snapshots, deterministic seeds and explicit availability; old fixtures remain development assets |

No planned family is selectable as an available lesson or paper item until implemented and reviewed for its declared capability. A manuscript sample cannot make an engine gap disappear.

## Authoring and release sequence

| Step | Concrete output | Exit evidence |
| --- | --- | --- |
| P1.8 completed | Modular subdirectory/direct-link refresh and current-build 9/9 runner | Final export, source identity and bounded combined decision retained in P1 |
| P2.1 review | These four briefs, 24 family specifications and 12 session outlines | Source cross-check, complete local map, sample-model validation; design accepted for authoring |
| P2.2a signed-number slice | SN01–SN06, three bilingual lessons and printable variants | Generator domains, exact/near-miss marking, number line, novelty/exposure, resume and paper checks |
| P2.2b expressions | EX01–EX06 with open/manual paths | Both word directions; four sequence types; no false unique-continuation claim; multi-variable/manual boundary visible |
| P2.2c equations | EQ01–EQ06 | Exactly-one-solution generation, original substitution, valid distractors, separate model/interpretation evidence |
| P2.2d angles | GE01–GE06 | Diagram/model consistency, no unmarked premises, correct pair/test/property logic, manually reviewed proof |
| P2.3 review | Mathematics and bilingual review records, fixes and focused retests | Author self-check separate from independent reviewer status; unresolved limitations stated |
| P2.4 public pilot | Bounded site release and release report | Mixed bilingual workflow/paper, subdirectory/deep links and public URL verified; no secure-assessment or mastery claim |

Complete one slice before broadening the bank. Every implemented family gets a stable identity and explicit version; numbers/names do not create new families.

## Generator acceptance rules

Store the semantic model, version and seed before rendering. Derive both languages, diagrams, correct answers, explanations and paper snapshots from that same model. Validate before display; bounded regeneration may try at most 40 candidates, after which report an explicit generation failure. Never silently switch topic or count an exposed example as fresh.

For finite small domains use exhaustive checks where practical; otherwise record boundary cases and deterministic sampling. Include zero and sign boundaries, exact rational alternatives, near-miss values, malformed/unsupported input, distinct stable choices, and at least one independent derivation or inverse check. The planned constraints must be turned into executable guards during implementation.

Retain an unrevealed check separately from the worked model and supported practice. Correct retries, hinted work and prior exposed variants are practice evidence. A manually reviewed reason is never an automatically verified proof. Blank reasons remain pending; later edits invalidate review.

## Bilingual and visual review

Use [glossary.md](glossary.md) for local draft terminology and defer to the official source. Verify subtraction-order phrases, grouping, units, input/output roles and the English phrase “interior angles” against the Chinese 同旁內角 in parallel-line contexts. Review both languages in a fresh session, at 390px and 200% zoom, through keyboard controls and on every printed page.

Diagrams should show only stated or derived properties. No answer may depend on visual measurement of a schematic. Use true mathematical parameters for lines/arcs/labels and provide equivalent textual givens. If an optional diagram exposes a rule or solution, record that as assistance. Do not show model answers in alternative text before reveal.

## Planned mixed-paper blueprint

After all four slices are implemented, use a 12-item maximum mixed paper, consistent with the existing bounded paper contract. A review blueprint is 3 items per topic: signed context/order, operations, change (4 marks); expression meaning, supplied-term value, open pattern reason (5 marks); solution check, solve, contextual interpretation (6 marks); local angle, parallel test, proof/deduction (9 marks). This is a local 24-mark target, not an HKEAA assessment profile. Adjust after actual layout/timing review and retain the resulting specification.

Mark automatic final results separately from manually judged model/reason/proof parts. Pair the student sheet and key by the same retained parameters and canonical specification. Test six-line blocks and both scripts; physical printing remains a separate observation.

## Design verification limits

`tools/validate_pilot.py` checks IDs, official-objective links/classification, bilingual sample fields, session references, all 15 objective mappings, sample-model arithmetic and selected negative cases. It uses exact rational/polynomial arithmetic independent of the production fixture engine. It records structural-only/manual cases explicitly. These checks cannot establish the correctness of an unimplemented generator, unseen parameter domains, rendered diagrams, full lessons, independent translation, real assistive speech or teaching effectiveness.

Official source file versions, hashes and pages read are in `../evidence/scope-review.json`. This is an author source check of the retained baseline, not independent review. No new modelling/cohort/examination policy is adopted here.
