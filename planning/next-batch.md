# Next curriculum batch: strengthen the number route

This is an implementation proposal based on the retained objective ledger in `site/curriculum/objectives.json`. It does not change any coverage status or add an official curriculum requirement. Detailed source boundaries and classifications must be checked against each retained record and explanatory-note reference before authoring a family. Independent review and current PDF/physical-print acceptance remain separate work.

The earlier four-topic pilot already connects directed numbers, expressions, equations and geometric reasoning. The next batch should supply the arithmetic preparation used by those topics, then develop percentage and proportional reasoning and estimation. Complete and publish one topic slice at a time.

| Order | Topic | Retained objectives | Reason for this order |
| --- | --- | --- | --- |
| 1 | Basic computation | JS-1-1 to JS-1-6 | Provides fraction/decimal arithmetic and powers used by the current pilot and by all three topics below. |
| 2 | Using percentages | JS-5-1, JS-5-2 | Builds on JS-1-6 and makes the original reference quantity explicit in percentage change. |
| 3 | Rates, ratios and proportions | JS-6-1, JS-6-2 | Builds on JS-1-6; distinguishes same-unit comparisons from rates with units. |
| 4 | Approximate values and numerical estimation | JS-3-1 to JS-3-4 | Builds on JS-1-6; numerical answers and explanations of strategy need different evidence. |

## First slice: basic computation

BC01–BC08 are now implemented as author drafts in v0.10.0; see `topics/basic.md` and `site/planning/release-basic-v1.md` for actual bounds and evidence. The table below retains the original proposal. Preserve the six existing development fixtures as development assets. The eight-family design below follows the six retained objective records rather than forcing every topic into the pilot's six-family size.

| Family | Objective | Proposed task and evidence | Required guard |
| --- | --- | --- | --- |
| BC01 | JS-1-1 | Divisibility by 4, 6, 8 or 9; stable selection and a separately reviewed explanation. | A test for 6 requires both 2 and 3; keep a digit-pattern test distinct from merely computing a quotient. |
| BC02 | JS-1-2 | Interpret repeated multiplication as a positive-integer power and calculate a final value. | Distinguish base and exponent. Specify the domain; no zero/negative-exponent scope is implied. Render exponents beyond a square explicitly. |
| BC03 | JS-1-3 | Recognise a prime factorisation from distinct product choices, with reasoning. | Use integers at least 2; every factor is prime and the product equals the original integer. Treat 1 separately if introduced, and never list 1 as a prime factor. Do not grade free factor strings with the one-variable expression checker. |
| BC04 | JS-1-4 | Find a greatest common divisor from a factor model. | Derive it independently by Euclid's algorithm; distinguish a common divisor from the greatest one. |
| BC05 | JS-1-4 | Find a least common multiple from multiples or a prime-factor model. | Check divisibility by each original number and minimality; include coprime and one-divides-the-other cases. |
| BC06 | JS-1-5 | Evaluate positive-integer mixed operations with nested brackets. | Generate a valid expression tree and derive its exact answer; exclude zero divisors and ambiguous order notation. |
| BC07 | JS-1-6 | Evaluate mixed fraction operations. | Use exact rational arithmetic, equivalent final fractions and meaningful near misses. |
| BC08 | JS-1-6 | Evaluate mixed terminating-decimal operations. | Generate exact rational models and render intentional decimal notation; avoid floating-point comparison. |

Three bilingual lessons should connect (1) divisibility and powers, (2) prime factors, GCD and LCM, and (3) bracketed fraction/decimal calculations. Each needs a short prerequisite recap, a motivating question, an explanation, model comparisons, a takeaway and separate practice/check actions. Do not make access depend on a previous score.

Required new work is an explicit power renderer, factor/multiple visual models with equivalent text, bounded nested-expression generation and topic-specific feedback. Final-number and stable-choice contracts can reuse the existing engine. Written methods remain manually reviewed. A question's diagram must not disclose a requested answer before reveal.

## Subsequent topic designs

These are candidate question forms, not claims that every subtype is required by the official objective. Confirm scope in the retained explanatory notes before implementation.

| Topic | Candidate forms | Automatic versus manual boundary |
| --- | --- | --- |
| Percentages | Calculate an explicitly based percentage change; find a new value; recover an original value; explain why two changes use different bases in a stated context. | Check exact final values or stable model choices. Review choice of base, model and contextual interpretation separately. |
| Rates, ratios and proportions | Compare quantities in common units; share a total in a stated ratio; calculate a unit rate; solve an explicitly proportional situation; explain whether the given model supports proportional reasoning. | Preserve units and the stated proportional premise. Do not silently add inverse-proportion scope or infer proportionality from a short table alone. |
| Approximation and estimation | Distinguish exact/approximate values; use a stated precision; estimate using a stated strategy; propose and justify a context-appropriate estimation strategy. | Never present an arbitrary tolerance as a unique correct estimate. Open strategy/reasonableness responses remain manually reviewed. Keep JS-3-4's retained classification visible. |

## Exit evidence for each slice

1. Confirm objective IDs, classifications, prerequisites, source limits and bilingual terminology from the retained ledger/source references; write a topic brief.
2. Store deterministic semantic models with family/version/seed. Keep old snapshots valid. Numeric renaming and layout changes are not fresh evidence.
3. Check arithmetic independently, including boundary cases, invalid domains, distinct choices, near misses and all manual-review states.
4. Implement bilingual lessons, diagrams, retained drafts, practice/check separation and printable student/key pairs. Keep interpretation and proof claims out of automatic final-answer scores.
5. Run current-source Node and hosted browser workflows, then inspect bilingual diagrams, mobile layouts and printable page bounds. Record actual PDF/physical-print, native keyboard/zoom and spoken output separately.
6. Publish the bounded author draft and update handoff/release evidence. Leave coverage planned until the declared evidence is reviewed; independent/classroom review cannot be replaced by author tests.

Do not expand into simultaneous equations, general surds or integral-index rules as a side effect of this batch. They have separate prerequisites and renderer/checker needs in the retained ledger and should receive their own briefs.

Before implementing percentage recovery, require a nonzero change multiplier when a unique original value is requested. State the denominator/base and rounding convention explicitly. For rates and ratios, declare units and positive/nonzero domains. For estimation, choose a rounding/tie policy before sampling boundary cases; a proposed contextual strategy may have several valid answers.
