# Basic computation — author-draft scope

Source check: 22 November 2026. [EDB English explanatory notes, Unit 1](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/ma/curr/EN_KS3_e.pdf), PDF pages 6–8 (printed 1–3), and [Traditional Chinese notes](https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/ma/curr/EN_KS3_tc.pdf), PDF pages 5–6 (printed 1–2). Objective wording and classifications remain in `site/curriculum/objectives.json`, paired to the 2017 learning content.

| Objective | Official classification | Bounded implementation |
| --- | --- | --- |
| JS-1-1 | Foundation | BC01: apply divisibility tests for 4, 6, 8, 9, including failures; explain the application, without requiring a proof of the general rule. |
| JS-1-2 | Foundation | BC02: evaluate powers and recover the positive exponent from a given base/value. Positive integer bases 1–6; exponents 1–4. Reverse tasks exclude base 1 to ensure uniqueness. No laws of indices. |
| JS-1-3 | Foundation | BC03: select a complete prime factorisation, using power notation, among products with distinct meanings. Explain prime bases and reconstruction. 1 is neither prime nor composite. |
| JS-1-4 | Foundation | BC04/05: GCD/HCF and LCM of two or three positive integers, including 1, repeated inputs, coprime inputs and one-divides-another cases. Use all inputs when choosing minimum/maximum prime exponents. |
| JS-1-5 | Foundation | BC06: nested positive-integer calculations with inner/outer brackets and a nonzero divisor. Parentheses and square brackets are sampled; braces are explained as another grouping notation. |
| JS-1-6 | Foundation | BC07/08: four-operand mixed fractions and terminating decimals; denominators may exceed 12. Exact rational answers, equivalent final fractions and decimals; no rounding tolerance. |

These authoring bounds choose manageable practice examples; they do not redefine the official objectives. The notes permit two or more inputs for GCD/LCM, mixed operations with more than three operands and denominators above 12. Divisibility by 6 requires both 2 and 3; the analogous claim for 2 and 4 versus 8 fails. Avoid excessively complicated arithmetic. General surds, index laws and simultaneous equations remain separate work.

Three bilingual lessons connect notation/tests, prime factors/comparison, and grouping/exact calculation. Each has readiness, explanations, worked models, takeaway and separate guided practice/check. The factor-tree lesson figure has a matching text alternative. Question diagrams display givens rather than a requested answer. MathML displays positive exponents and an unknown exponent; the bounded expression-input parser still rejects degree-three polynomial input.

BC01, BC03, BC04 and BC05 keep written reasons separate from automatically checked selections/values. Other written calculation methods require paper review. A numerical score does not verify those methods. Exposure records include fixed and generated lesson examples; reordering GCD/LCM inputs is not fresh. This is retained-model freshness, not universal semantic novelty.

Independent arithmetic checks sample 2,400 variants. Additional checks cover exact near misses, three-input boundaries, MathML, snapshots, bilingual lessons, review invalidation, session and paper wiring, and bundled/module parity. Actual PDF/physical printing, independent mathematics/Traditional Chinese review and learner trials remain pending. All 237 coverage records retain `planned` status.
