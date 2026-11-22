# Approximate values and numerical estimation — author-draft scope

Source check: 22 November 2026. EDB [English explanatory notes](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/ma/curr/EN_KS3_e.pdf), Unit 3, PDF pages 11–12 (printed 6–7), and [Traditional Chinese notes](https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/ma/curr/EN_KS3_tc.pdf), PDF pages 9–10 (printed 5–6). Retained JS-3-1, JS-3-2 and JS-3-3 records are foundation; JS-3-4 is optional enrichment. JS-1-6 is the project prerequisite. All 237 coverage records remain planned.

| Family | Objective | Bounded implementation |
| --- | --- | --- |
| AP01 | JS-3-1 | Exact/approximate classification from explicitly complete counts, unit definitions, rounded measurements and rounded counts. Representation alone does not determine exactness. |
| AP02 | JS-3-1 | Nonnegative finite decimals to 0–3 decimal places, including zero, ties, carry and trailing-zero reports. |
| AP03 | JS-3-1 | Positive decimals initially below 1 to 2–4 significant figures, including leading zeros, trailing zeros and carry to 1.0. This avoids ambiguous whole-number zero conventions without adding scientific notation. |
| AP04 | JS-3-1 | Nonnegative whole numbers to nearest 10, 100 or 1000. |
| AP05 | JS-3-2 | Nearest, upward or downward rounding to stated multiples of 10 or 100. Exact multiples remain unchanged. |
| AP06 | JS-3-2 | Round each input to nearest ten, then add, multiply or divide exactly as a prescribed estimate. Positive divisors cannot round to zero. Other strategies need not have the same result. |
| AP07 | JS-3-3 | Minimum sufficient bus counts or maximum affordable ticket counts, with exact inputs and explicit constraints. Includes exact division and zero affordable tickets. |
| AP08 | JS-3-4 | Optional, wholly manual design/reasonableness investigation: supplies, crowds or travel. Several justified responses are valid; no numerical correctness tolerance or variant quota. |

All rounding uses nonnegative values; ties go upwards. Integer ticks and BigInt division/remainders avoid floating-point rounding. Negative-value tie conventions are outside this slice. Decimal-place and significant-figure responses opt into a fixed decimal-place field on the existing number contract, so a numerically equivalent fraction or extra/missing decimal digit receives wrong-form. Historical numeric contracts without that field retain their prior behaviour. Other numerical tasks accept exact final numbers/fractions; no fuzzy tolerance is introduced.

Core hub practice/check/papers include AP01–AP07 only. AP08 is available explicitly through the optional fourth lesson or selection in the builder; it is unchecked by default and a single investigation is offered at a time. All AP08 marks require manual review and its response is excluded from automatic-score denominators. Core numerical/choice results also do not verify written explanations. Edits invalidate self-review.

Four bilingual lessons (three core plus one optional) include motivation, readiness, comparisons, models, takeaways and separate practice/check actions. The number-line figure shows the original, neighbouring allowed multiples and midpoint without selecting a rounded answer. Text alternatives preserve the same information. Formal maximum/relative/percentage errors and scientific notation remain separate topics, as in the source notes.

Opening lessons records fixed and generated models. AP01 exposure keys ignore number renaming within the same report type; AP08 keys identify investigation context. Exhaustion remains labelled prior exposure/practice. Recording a manual proposal is not independent mastery. Assumed planning ranges are not guaranteed real-world bounds.

Independent lattice-distance and rational checks cover 2,100 core models and 300 generated manual-model records, alongside explicit tie/carry/format guards, alternatives to open responses, optional defaults, score separation, draft persistence, versioned paper snapshots and bundled/module parity. This sampling does not claim 300 distinct investigation designs. Current browser/layout evidence, actual PDF/physical printing and independent mathematics/Traditional Chinese/classroom review remain separate acceptance work.
