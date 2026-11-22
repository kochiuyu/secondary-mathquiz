> Implementation update: EX01–EX06 and EX-L1–EX-L3 are author drafts in `site` v0.7.0. The design below is historical; see `../../site/planning/release-expressions-v1.md` for implementation and verification limits.

# Algebraic expressions / 代數式

22 November 2026 · P2.1 preparatory design · not an implemented lesson

Purpose: Use symbols to describe a rule without losing its meaning.

用符號表達規律，並保留原來的意思。

Scope: JS7.1–7.4: both directions of words/symbols, formulae including multiple variables, odd/even/square/triangular sequences, supplied general terms and preliminary input–processing–output.

Boundary: Like terms and polynomial expansion are unit 11 work, not the definition of completing unit 7. The P1 expansion fixture is not promoted to a unit-7 lesson. Multivariable formulas and open pattern reasoning require manual support; formal function definitions are deferred.

Preparation: Directed arithmetic; letters representing quantities; primary area formulae.

## Three-session learning path

| Session | Opening and purpose | Closing takeaway | Separate check |
| --- | --- | --- | --- |
| EX-L1 — Say it, group it, write it / 說清、分組、寫成式 | Compare three times a sum with the sum after multiplication; model a triangle formula. | Brackets preserve meaning; ab means a×b; a fraction bar makes division grouping clear. | Translate a fresh phrase and explain a fresh formula; free two-variable work is manually reviewed. |
| EX-L2 — A pattern is a proposal / 規律是一個有理由的提議 | Compare guessing a next term with evaluating a term from a stated general rule. | A finite prefix permits different justified continuations; a supplied rule fixes the requested term. | Explain a continuation, then evaluate a fresh supplied odd/even/square/triangular rule. |
| EX-L3 — Follow the processing rule / 依規則處理輸入 | Send the same input through two different explicitly stated machines. | Input, processing and output have distinct roles; use the stated rule consistently. | Evaluate a new input without exposing the worked output; connect a table row to the rule. |



Full session narration is P2.2 work. Each session will use overview → readiness → explanation/visual → model → fading guidance → fresh check → takeaway/next link. Titles and family samples below are bilingual drafts; full lesson prose is not yet authored.

## Six distinct family briefs

These IDs are local family identities. Number changes are variants, not additional families. All examples are newly authored.

## EX01 — Words to a grouped expression / 由文字寫出含括號的代數式

**Mapped objectives:** JS-7-1 (all Foundation in the retained ledger).

**Demand:** Represent the order and grouping in a word phrase; distinguish subtraction order.

**Parameters and guards:** Single variable x; integer coefficients 2…9 and constants 1…12. Include a(x+b), ax−b and b−ax; degree ≤2, no variable denominators in automatic responses.

**Answer contract:** Equivalent polynomial in x, degree ≤2; grouping is judged by meaning, not cosmetic parentheses. Do not require expanded form.

**Engine readiness:** Bounded one-variable equivalence exists; new family prompts and wrong-meaning counterexamples required.

**Visual and text alternative:** Phrase-to-operation cards/optional bar model; text presents the whole phrase and variable meaning.

**Sample prompt (EN):** Write an expression for five less than three times x.

**例題（繁體中文）：** 用代數式表示「x 的三倍減去五」。

**Model response:** 3*x-5

**Solution (EN):** Three times x is 3x. Five less than that is 3x − 5.

**解說：** x 的三倍是 3x，再減去五，得到 3x − 5。

**Hint (EN):** Identify the quantity from which five is subtracted.

**提示：** 先找出要減去五的那個量。

**Counterexamples and feedback checks:**

- Reject 5−3x and 3(x−5): both change the meaning.
- Accept an equivalent expression such as x+x+x−5; collecting like terms is not the objective of this unit.

**Paper target:** 1 marks, 3 working lines, about 2 minutes. Calculator not required (local pilot choice). Automatic result marks and manually judged reasoning/method marks must be displayed separately.

**Review state:** design draft; sample self-check only; no generator, independent review, classroom evidence or published resource is claimed.

## EX02 — An expression back into words / 由代數式表達文字意思

**Mapped objectives:** JS-7-2 (all Foundation in the retained ledger).

**Demand:** Interpret algebraic syntax in language; distinguish a product of a sum from a sum of products.

**Parameters and guards:** Build expression tree first, then bilingual choices from distinct trees; coefficients 2…6 and constants 1…9. Include two-variable reading as a choice extension, with no unsupported free two-variable marking.

**Answer contract:** Stable-ID choice; optional free paraphrase goes to manual review. Equivalent paraphrases are accepted by the rubric.

**Engine readiness:** Stable choices exist; validate semantic distractor trees and bilingual wording.

**Visual and text alternative:** Operation tree/table of phrase parts with complete textual reading.

**Sample prompt (EN):** Which phrase describes 3(x + 2)?

**例題（繁體中文）：** 哪個文字片語能表達 3(x + 2)？

**Model response:** three-times-sum

**Solution (EN):** It is three times the sum of x and 2; the brackets make the whole sum one factor.

**解說：** 這是「x 與 2 的和的三倍」；括號表示整個和是一個因數。

**Hint (EN):** What whole quantity is multiplied by three?

**提示：** 哪一整個量乘以三？

**Counterexamples and feedback checks:**

- 3x+2 and 3+2x are deliberately different from 3(x+2).
- Do not mark a valid alternative free paraphrase wrong solely because its wording differs.

**Paper target:** 1 marks, 3 working lines, about 2 minutes. Calculator not required (local pilot choice). Automatic result marks and manually judged reasoning/method marks must be displayed separately.

**Review state:** design draft; sample self-check only; no generator, independent review, classroom evidence or published resource is claimed.

## EX03 — Represent a formula with two quantities / 以兩個量表示公式

**Mapped objectives:** JS-7-1, JS-7-2 (all Foundation in the retained ledger).

**Demand:** Define variables, coordinate a formula with a known measurement relation and explain its factors.

**Parameters and guards:** Triangle area from positive base b and perpendicular height h; subsequent rectangles/other known formulae explicitly identified. No numerical substitution is evidence of free formula authorship.

**Answer contract:** Two-variable expression plus declared variable meanings; manual rubric in the first pilot. Equivalent bh/2, hb/2 and 0.5bh accepted. Unit consistency reviewed.

**Engine readiness:** NOT supported by the one-variable parser. Use a labelled manual field/rubric first; do not pass bh into the x-only marker.

**Visual and text alternative:** Triangle with base b and perpendicular height h, right-angle marker, non-colour labels; text explicitly says perpendicular height.

**Sample prompt (EN):** A triangle has base b and perpendicular height h. Complete its area formula: A = ___. Explain the factor 1/2.

**例題（繁體中文）：** 一個三角形的底為 b，垂直高度為 h。完成面積公式：A = ___，並解釋因數 1/2。

**Model response:** b*h/2

**Solution (EN):** A = bh/2. Two congruent copies can form a parallelogram with base b and height h, so one triangle has half its area.

**解說：** A = bh/2。兩個全等的三角形可拼成底為 b、高為 h 的平行四邊形，因此一個三角形的面積是其一半。

**Hint (EN):** Compare the triangle with a parallelogram made from two copies.

**提示：** 把三角形與兩個相同三角形拼成的平行四邊形比較。

**Counterexamples and feedback checks:**

- bh omits the half factor; (b+h)/2 adds lengths rather than forming area.
- The example numerical check is a self-check only; the response remains manual until a declared multivariable contract is implemented.

**Paper target:** 3 marks, 5 working lines, about 4 minutes. Calculator not required (local pilot choice). Automatic result marks and manually judged reasoning/method marks must be displayed separately.

**Review state:** design draft; sample self-check only; no generator, independent review, classroom evidence or published resource is claimed.

## EX04 — Propose a sequence continuation with a reason / 提出數列的下一項並說明理由

**Mapped objectives:** JS-7-3 (all Foundation in the retained ledger).

**Demand:** Infer and explain a possible pattern without asserting uniqueness from a finite prefix.

**Parameters and guards:** Prefixes of odd/even/square/triangular sequences, normally 4–5 terms. When only terms are given, accept other explicitly justified continuations consistent with every term; no algebraic recurrence required.

**Answer contract:** Proposed number plus written rule; manual judgement of consistency. A single preferred numerical answer cannot be auto-certified as the only solution.

**Engine readiness:** Requires manual/open-response presentation and rubric; existing exact-number check alone is insufficient.

**Visual and text alternative:** Optional dot pattern for the intended triangular continuation, revealed after response; prefix also available as text. A revealed pattern changes the evidence state.

**Sample prompt (EN):** For 1, 3, 6, 10, suggest a next term and explain a rule that fits every given term. Is your answer forced by the four terms alone?

**例題（繁體中文）：** 對數列 1、3、6、10，提出下一項，並說明符合所有已知項的規律。只憑這四項，答案是否唯一？

**Model response:** 15; one possible continuation

**Solution (EN):** One possible answer is 15: the differences are 2, 3, 4, then 5. A finite prefix alone does not force this rule; other justified rules may give a different next term.

**解說：** 一個可能答案是 15：相鄰項的差依次為 2、3、4，下一個差取 5。有限的已知項不能唯一確定規律，其他合理規律可有不同的下一項。

**Hint (EN):** Look at consecutive differences, then explain why you chose that continuation.

**提示：** 觀察相鄰項的差，再說明你為何採用這個延伸規律。

**Counterexamples and feedback checks:**

- Do not reject a different next term when a clear rule fits the complete prefix.
- A number without a consistent explanation leaves the reasoning pending.

**Paper target:** 3 marks, 5 working lines, about 4 minutes. Calculator not required (local pilot choice). Automatic result marks and manually judged reasoning/method marks must be displayed separately.

**Review state:** design draft; sample self-check only; no generator, independent review, classroom evidence or published resource is claimed.

## EX05 — Evaluate a supplied general term / 由已知通項求指定項

**Mapped objectives:** JS-7-3 (all Foundation in the retained ledger).

**Demand:** Distinguish the index from the term value and evaluate a supplied rule.

**Parameters and guards:** Index n in 1…12; rules 2n−1, 2n, n², n(n+1)/2; all four sequence types required in the release matrix. Explain that the explicit general term fixes each term.

**Answer contract:** Exact final number with the requested index stated; no free inference of an nth-term formula required.

**Engine readiness:** Exact-number marking exists; generate from enumerated rule models and verify independently.

**Visual and text alternative:** Table with separate index/term headers; triangular/square dot representation with a text count alternative.

**Sample prompt (EN):** A sequence has general term aₙ = n(n + 1)/2. Find a₆.

**例題（繁體中文）：** 某數列的通項為 aₙ = n(n + 1)/2。求 a₆。

**Model response:** 21

**Solution (EN):** Substitute n = 6: a₆ = 6 × 7 / 2 = 21. The 6 is the position, not the value.

**解說：** 代入 n = 6：a₆ = 6 × 7 / 2 = 21。6 是項的位置，不是該項的值。

**Hint (EN):** Replace every n by the requested index.

**提示：** 把每個 n 都換成指定項的位置。

**Counterexamples and feedback checks:**

- Reject 6: it is the index rather than the sixth term.
- Contrast this unique value under a supplied rule with EX04’s open continuation.

**Paper target:** 1 marks, 3 working lines, about 2 minutes. Calculator not required (local pilot choice). Automatic result marks and manually judged reasoning/method marks must be displayed separately.

**Review state:** design draft; sample self-check only; no generator, independent review, classroom evidence or published resource is claimed.

## EX06 — Follow an input–processing–output rule / 依輸入—處理—輸出規則計算

**Mapped objectives:** JS-7-4 (all Foundation in the retained ledger).

**Demand:** Track an explicit processing rule from input to output; connect a rule/table/formula.

**Parameters and guards:** Inputs −5…5 or nonnegative measurements when context requires; rules ax+b or x²+b with small integer a,b. Domain restriction stated in ordinary language; no formal function terminology required.

**Answer contract:** Exact final numeric output; repeat inputs produce the same output under the stated rule.

**Engine readiness:** Exact numeric marking exists; add accessible rule/table representation.

**Visual and text alternative:** Input, processing and output cards are ordered and individually labelled; a sentence presents the same rule.

**Sample prompt (EN):** A machine squares its input, then adds 1. What is the output when the input is −2?

**例題（繁體中文）：** 一部機器先把輸入值平方，再加 1。輸入 −2 時，輸出是多少？

**Model response:** 5

**Solution (EN):** (−2)² + 1 = 4 + 1 = 5. The whole input −2 is squared.

**解說：** （−2）² + 1 = 4 + 1 = 5。要把整個輸入值 −2 平方。

**Hint (EN):** Write the negative input in brackets before squaring.

**提示：** 先把負的輸入值放在括號內，再平方。

**Counterexamples and feedback checks:**

- Reject −3: squaring −2 gives +4.
- Do not introduce formal domain/codomain notation as a prerequisite for this junior preliminary objective.

**Paper target:** 1 marks, 3 working lines, about 2 minutes. Calculator not required (local pilot choice). Automatic result marks and manually judged reasoning/method marks must be displayed separately.

**Review state:** design draft; sample self-check only; no generator, independent review, classroom evidence or published resource is claimed.

## Closing connection

Symbols express relationships: read them both ways, preserve grouping and distinguish an inferred pattern from a stated rule.

符號表達關係：要能雙向理解、保留運算分組，並分清推測的規律與已知規則。

Use a defined quantity and an expression on each side to formulate an equation.

## Source locators

EDB/CDC, Learning Content of Junior Secondary Mathematics (2017), English/Traditional Chinese; EDB Junior Secondary Explanatory Notes (2020). Exact per-objective page references are in `../../data/objective-snapshot.json`; scope-review file digests and read pages are in `../../evidence/scope-review.json`. The official PDFs remain in the P0 archive.

[English learning content](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/ma/curr/jsmc2017_e.pdf) · [Traditional Chinese learning content](https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/ma/curr/jsmc2017_tc.pdf) · [English explanatory notes](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/ma/curr/EN_KS3_e.pdf)
