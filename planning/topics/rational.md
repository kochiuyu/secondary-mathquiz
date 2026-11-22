# Rational and irrational numbers — implementation brief

Status: source-checked plan, 22 November 2026 (Hong Kong). No new lesson, generator or answer contract is implemented by this document. The published application remains v0.13.0 with 56 curriculum families and 27 bilingual author-draft lessons. All 237 objective records remain planned.

## Source and scope

Read the original bilingual documents, including the mathematical notation and classification underlining, rather than treating extracted equations as a marking specification.

| Source | Unit 4 locator | Check made |
| --- | --- | --- |
| [2017 learning content, English](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/ma/curr/jsmc2017_e.pdf) | PDF pages 10–11, printed 7–8 | Objective rows, source remarks and non-foundation underlining; page 10 visually inspected. |
| [2017 learning content, Traditional Chinese](https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/ma/curr/jsmc2017_tc.pdf) | PDF pages 9–10, printed 6–7 | Parallel objective rows, terminology and underlining; page 9 visually inspected. |
| [2020 explanatory notes, English](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/ma/curr/EN_KS3_e.pdf) | PDF pages 13–15, printed 8–10 | Root notation, number-line representation, simple surds and enrichment; page 14 visually inspected for formulas. |
| [2020 explanatory notes, Traditional Chinese](https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/ma/curr/EN_KS3_tc.pdf) | PDF pages 11–12, printed 7–8 | Parallel scope, simple denominator rationalisation and enrichment dependencies. |

| Objective | Retained classification | Authoring boundary |
| --- | --- | --- |
| JS-4-1 | Foundation | Meaning and notation of nth roots, including negative odd roots; distinguish the principal square root from both solutions of a squared equation. |
| JS-4-2 | Foundation | Rational/irrational definitions, examples and approximate number-line positions. An irrationality proof or compass construction is not needed here. |
| JS-4-3 | Non-foundation | Simplify and combine simple quadratic surds, with rational coefficients and positive rational radicands; include simple single-term denominators. |
| JS-4-4 | Optional enrichment | Investigate constructible lengths after construction skills and Pythagoras; manual mathematical evidence. |

Fractional indices, products of general nth roots, complex numbers and conjugate/binomial-denominator rationalisation are outside this slice. The examples, family bounds and software design below are project choices, not extra EDB requirements.

## Readiness and route correction

The current ledger assigns JS-10-3 (laws of integral indices) to all four objectives and proposes S3. These are site-authored choices. They should not make learners study index laws before understanding roots. The source introduces roots from powers and factorisation.

Before integrating the new topic, revise the site-authored prerequisite fields for these four records, preserving their source wording, classification and planned coverage state:

| Objective | Proposed required preparation | Helpful preparation |
| --- | --- | --- |
| JS-4-1 | JS-1-2, JS-1-3, JS-2-2 | JS-1-6 for rational examples |
| JS-4-2 | JS-1-6, JS-2-1, JS-4-1 | JS-3-1 for exact versus approximate representations |
| JS-4-3 | JS-1-3, JS-1-6, JS-2-2, JS-4-1, JS-4-2 | Prior experience collecting like terms, with an inline recap |
| JS-4-4 | JS-4-1, JS-4-2, JS-20-5, JS-25-1 | The actual straightedge/compass skills taught in the activity recap |

JS-20-5 is an entry point to construction skills, not a claim that its objective includes every construction used here. Provide the missing construction recap explicitly. The enrichment path must state the unit-length, straightedge and compass assumptions.

Retain the existing S3 proposal unless a separate route review changes it. Make the new topic available after the number preparation; this is an access path, not a claim that every school teaches Unit 4 in the same year. Use readiness recaps and links, never score locks.

## Proposed question families

Nine families are proposed: four foundation, four non-foundation and one optional investigation. IDs RI01–RI09 are reserved here only.

| Family | Objective / level | Bounded task | Automatic and manual evidence |
| --- | --- | --- | --- |
| RI01 | JS-4-1 / foundation | Evaluate perfect nth powers in reverse: n from 2 to 5, integer root magnitude at most 8, including 0, 1 and negative odd roots. Even-root radicands are nonnegative. | Existing exact-number contract; separately review the inverse-power explanation. |
| RI02 | JS-4-1 / foundation | Choose the principal square root, the negative of a square root, or the value of a parenthesised square. Contrast sqrt(25), -sqrt(25) and (-5)^2. | Stable, distinct choice IDs; explanations reviewed manually. Do not turn this into an unintroduced quadratic-equation exercise. |
| RI03 | JS-4-2 / foundation | Classify integers, fractions, explicitly terminating/recurring decimals, perfect-square roots, nonsquare roots and pi. | Stable rational/irrational choices. A decimal prefix followed by an unexplained ellipsis is not classifiable evidence. |
| RI04 | JS-4-2 / foundation | Select an interval or correctly ordered number-line model containing rational values and positive/negative square roots. | Exact rational-square comparisons for interval/order answers; reasons and free approximate sketches remain manual. No pixel-distance correctness test. |
| RI05 | JS-4-3 / non-foundation | Simplify a single quadratic surd, including a positive rational radicand and a signed rational coefficient. | New exact-surd contract, with a declared simplest-form requirement. |
| RI06 | JS-4-3 / non-foundation | Add/subtract up to three simple surds after simplifying; include unlike radicals that cannot combine, cancellation and rational results. | Exact-surd contract; written transformations reviewed separately. |
| RI07 | JS-4-3 / non-foundation | Multiply simple quadratic surds, with small rational coefficients; include products that become rational. | Exact-surd contract; test factors independently and keep results bounded. |
| RI08 | JS-4-3 / non-foundation | Divide by a nonzero single surd term and perform a short mixed expression, at most three operations and one bracket level. | Exact-surd contract; include rationalising a single radical denominator. Exclude binomial denominators. |
| RI09 | JS-4-4 / optional enrichment | From a unit segment, compare constructions of a rational length and sqrt(2), and extend a construction to 1+sqrt(2). | Entirely manual: construction steps, justification, transfer and limits. Merely drawing a segment or entering a decimal does not certify constructibility. |

Generated positive rational radicands in RI05–RI08 should initially have numerator/denominator at most 100, with their product at most 10,000. Coefficient numerators have magnitude at most 9 and denominators at most 6. Bound the resulting canonical radicands and coefficients, not only the displayed inputs. These are initial authoring bounds and can be reduced if the expressions become cluttered.

RI03 must contrast sqrt(49), sqrt(7), 0, a negative rational, a stated recurring decimal and pi. A displayed approximation to pi is itself rational when treated as an exact finite decimal. Do not say that every root symbol denotes an irrational number. Avoid an empirical screen of decimal digits as an irrationality test.

RI04 should include negative values and equality/endpoints, using exact comparisons. Root-derived coordinates may be approximated for display, but ordering and the checked answer must come from the exact model.

## Five bilingual lessons

Each lesson needs a motivating question, readiness recap, comparison examples, an accessible figure or model, a takeaway, and separate practice/check actions. Explanations must read naturally in Traditional Chinese.

| Lesson | Families / route | Learner question and takeaway |
| --- | --- | --- |
| Powers backwards / 從乘方認識方根 | RI01–RI02 / foundation | If the area is known, how do we recover a square's side? The root sign chooses the principal nonnegative square root; an odd root can be negative. |
| Which numbers are rational? / 哪些數是有理數？ | RI03–RI04 / foundation | Does a calculator display tell us the exact number? Classification depends on the exact value; a number line also shows its order and approximate position. |
| Simplify and collect surds / 化簡根式與合併同類根式 | RI05–RI06 / non-foundation | Why can some roots be combined? Extract square factors, then collect like radicals without merging unlike ones. |
| Multiply and divide surds / 根式的乘法與除法 | RI07–RI08 / non-foundation | How can a root product become rational? Use valid product/quotient rules and a nonzero single-term divisor. |
| Construct a length / 構作指定長度 | RI09 / optional enrichment | Can an irrational length be constructed exactly? Record a construction and its justification; a picture alone is insufficient. |

Use square area/side and cube volume/edge models for roots; a number-system inclusion model with examples; equal-scale number lines; and square-factor groupings for simplification. Text alternatives and paper figures must convey the same premises. Do not reveal a requested value or correct option in an unrevealed figure.

The default foundation hub selects RI01–RI04. Non-foundation work is a clearly labelled additional route, selectable without a score prerequisite. RI09 is unchecked in generic builders, excluded from automatic-score denominators and offered as one manually reviewed activity.

## Exact-root answer contract: implement before RI05–RI08

The existing scalar checker stores exact rationals and the expression checker stores polynomials of degree at most two in x. Neither represents irrational constants. Do not insert approximate decimals into those contracts or make the existing expression parser interpret roots.

1. Add a separate bounded quadratic-surd module using the existing rational Q type. Canonical values are finite maps from positive squarefree integers d to rational coefficients c in sums c*sqrt(d); d=1 is the rational term. Merge equal d, discard zero coefficients and canonicalise total zero explicitly.
2. For a nonnegative reduced rational p/q, use sqrt(p/q)=sqrt(p*q)/q, then extract square factors by bounded integer arithmetic. Restrict parser input to p,q at most 10,000 and p*q at most 1,000,000. Reject values beyond these limits before factorisation. Negative real radicands, zero divisors, nested roots, variables, general powers and function calls are unsupported.
3. Support signed rational literals, sqrt(nonnegative rational), sums, products, brackets and division by a nonzero single canonical term only. Provide explicit examples such as 2*sqrt(3), sqrt(3)/2 and sqrt(2)+sqrt(3), with visible input buttons if useful. A root button should insert valid notation at the caret; preview the interpreted answer. Do not evaluate learner input as code.
4. Bound input length to 160 characters, tokens to 80, nesting to 12, canonical terms to 8 and every canonical radicand to 1,000,000. Reuse Q's coefficient-size guard and check intermediate operations. Reject unsupported syntax with bilingual feedback, preserving the answer draft.
5. Introduce an opt-in contract type, quadratic-surd, with its own version. Keep every historical number, expression, set, choice and manual contract unchanged. Exact-value equality compares canonical coefficients, never decimal tolerances.
6. Distinguish value from requested form. For a simplest-form task, sqrt(12) has the correct value but needs further simplification to 2*sqrt(3). Likewise, 1/sqrt(2) needs the requested rational-denominator form sqrt(2)/2. Define a structural form check before offering that task; do not use string matching to recognise every equivalent form.
7. Permit exact rational results such as 0 and 6 in the new contract. A finite decimal approximating an irrational answer is incorrect for an exact task. A valid but unsupported expression is reported as unsupported, not falsely certified incorrect by numeric sampling.
8. Keep the expected canonical value plus the generated mathematical model in versioned question snapshots. Extend paper import/export validation, answer-draft restoration, review invalidation, score calculation, renderer and bundle parity together. Reject unknown versions explicitly; retain old snapshots and paper schema compatibility.

An implementation may use structured coefficient/radicand fields for single-term simplest-form questions, but it must also handle legitimate unlike-term sums in RI06. Do not silently narrow the mathematics to fit a one-term widget.

## Implementation sequence and evidence

| Step | Concrete output | Completion evidence |
| --- | --- | --- |
| 1. Source/readiness integration | Update only site-authored prerequisite fields; reserve family metadata and bilingual terms. | Four objective IDs and classifications preserved; all coverage states still planned; no broken prerequisite references. |
| 2. Exact surd foundation | Bounded canonical arithmetic, parser, marker and form policy, with no new learner tasks yet. | Independent checks of square-factor extraction, rational radicands, cancellation, products, single-term division, form feedback and invalid/oversized input; legacy contracts unchanged. |
| 3. Foundation route | RI01–RI04, first two bilingual lessons and number-line/solid models. | Integer-power inverse checks and exact interval/order checks, negative odd roots, zero, repeated-decimal notation, distinct choices and diagram/text agreement. |
| 4. Non-foundation route | RI05–RI08, two bilingual lessons and full answer-field/paper integration. | Independent semantic arithmetic checks, unlike sums, negative coefficients, rational results, simplest-form feedback and safe bounds. |
| 5. Optional investigation | RI09 and fifth lesson with a construction worksheet and rubric. | Core defaults exclude it; all marks manual; changing the activity invalidates previous self-review. |
| 6. Integrated author-draft release | Build default/portable/QA copies; bilingual student/key sample booklets; release identity and source-matched evidence. | Node checks and hosted browser workflows pass; inspect desktop/mobile math, drafts, history, backups, selected routes and all booklet page bounds. Publish and update the handoff with actual results. |

For arithmetic verification, use integer-power reversal for RI01 and independent prime-exponent or square-factor reconstruction for surd models. Cross-check rendered answers against models, not the same formatter's text. Deliberately include a mathematically different near miss that shares several decimal digits with the right result. Test out-of-domain input and malformed imports as well as ordinary examples.

Retain the existing browser-local learner-data policy and historical release evidence. Numeric or option correctness does not verify a written explanation. Exhausted model types remain prior exposure/practice; renaming numbers is not fresh conceptual evidence.

No browser or print acceptance is claimed for this planning change. Actual PDF/physical printing, native keyboard/zoom, spoken output and independent mathematics/Traditional Chinese/classroom review remain separate pending work. Record only tests actually run against the released implementation.
