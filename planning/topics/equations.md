# Linear equations in one unknown / 一元一次方程

22 November 2026 · P2.1 preparatory design · not an implemented lesson

Purpose: Find an unknown by preserving an equality, then interpret what the value means.

在保持等式成立的過程中求未知數，並解釋所得數值。

Scope: JS8.1–8.3: meaning of a solution, solving a general one-unknown linear equation with one solution, formulating and solving contextual problems.

Boundary: The explanatory notes restrict this unit to exactly one solution. No-solution/infinitely-many cases are deferred, not silently included as challenge examples. Variable denominators, quadratic equations and unrestricted equation parsing are outside the pilot.

Preparation: Directed arithmetic; interpreting expressions; the primary balance principle.

## Three-session learning path

| Session | Opening and purpose | Closing takeaway | Separate check |
| --- | --- | --- | --- |
| EQ-L1 — What counts as a solution? / 甚麼才是方程的解？ | Test a candidate before learning an inverse-operation method. | A solution makes the original sides equal; apply the same valid operation to both sides. | Verify a fresh candidate and solve a new affine chain without a revealed model. |
| EQ-L2 — Keep every step equal / 每一步都保持相等 | Repair a bracket error, then solve an equation with x on both sides. | A coefficient multiplies the whole bracket; collecting both sides must preserve equality. | Give a new final root and explain a different invalid step; reason evidence remains separate. |
| EQ-L3 — Model, solve, interpret / 建模、求解、解釋 | Separate a rental fixed fee from a per-hour charge. | Define the unknown and units, form the equality, solve, substitute, then check contextual feasibility. | Use a fresh situation; mark the final value separately from model and interpretation. |



Full session narration is P2.2 work. Each session will use overview → readiness → explanation/visual → model → fading guidance → fresh check → takeaway/next link. Titles and family samples below are bilingual drafts; full lesson prose is not yet authored.

## Six distinct family briefs

These IDs are local family identities. Number changes are variants, not additional families. All examples are newly authored.

## EQ01 — Check what a solution means / 檢驗解的意思

**Mapped objectives:** JS-8-1 (all Foundation in the retained ledger).

**Demand:** Substitute a candidate into the original equality and compare both sides.

**Parameters and guards:** ax+b=c with a nonzero integer −6…6; one supplied integer/rational candidate; generate both satisfying and non-satisfying candidates. Store the original equation.

**Answer contract:** Stable Yes/No choice for equality after substitution; reason uses manual rubric.

**Engine readiness:** Choice/numeric checking exists; substitution evidence must be tied to original sides.

**Visual and text alternative:** Two explicitly labelled LHS/RHS calculation panels, balanced/unbalanced symbol with text equivalent.

**Sample prompt (EN):** Does x = −2 solve 3x + 1 = −5?

**例題（繁體中文）：** x = −2 是否方程 3x + 1 = −5 的解？

**Model response:** yes

**Solution (EN):** At x = −2, the left side is 3(−2)+1 = −5, equal to the right side. So yes.

**解說：** 當 x = −2 時，左方為 3（−2）+1 = −5，等於右方，所以它是解。

**Hint (EN):** Substitute the same candidate into the original equation.

**提示：** 把同一個候選值代入原方程檢驗。

**Counterexamples and feedback checks:**

- Include a nearby false candidate, e.g. −1, to prevent a default Yes pattern.
- Do not accept checking a transformed equation alone when the original equation is available.

**Paper target:** 1 marks, 3 working lines, about 2 minutes. Calculator not required (local pilot choice). Automatic result marks and manually judged reasoning/method marks must be displayed separately.

**Review state:** design draft; sample self-check only; no generator, independent review, classroom evidence or published resource is claimed.

## EQ02 — Undo an affine operation chain / 逆轉一次運算鏈解方程

**Mapped objectives:** JS-8-1 (all Foundation in the retained ledger).

**Demand:** Choose inverse operations in reverse order and preserve equality; check a computed solution.

**Parameters and guards:** ax+b=c; a in {−6…−1,1…6}, b in −12…12; construct from chosen rational root with denominator 1,2,3,4 and bounded c. Exactly one solution.

**Answer contract:** Exact scalar x value, field labelled x =; allow fractions/decimals, not a whole equation in the scalar field.

**Engine readiness:** Exact scalar marking exists; new guided balance/inverse-operation cards needed.

**Visual and text alternative:** Operation chain and reverse chain, with textual operation list and equality statements.

**Sample prompt (EN):** Solve −3x + 5 = 17.

**例題（繁體中文）：** 解方程 −3x + 5 = 17。

**Model response:** -4

**Solution (EN):** Subtract 5 from both sides: −3x = 12. Divide both sides by −3: x = −4. Check: 12 + 5 = 17.

**解說：** 兩邊同減 5，得 −3x = 12；兩邊同除以 −3，得 x = −4。檢驗：12 + 5 = 17。

**Hint (EN):** Undo the addition before the multiplication.

**提示：** 先逆轉加法，再逆轉乘法。

**Counterexamples and feedback checks:**

- Reject +4; substitute into the original equation to show the mismatch.
- The automatic final-value mark provides no evidence for unseen method marks.

**Paper target:** 2 marks, 4 working lines, about 3 minutes. Calculator not required (local pilot choice). Automatic result marks and manually judged reasoning/method marks must be displayed separately.

**Review state:** design draft; sample self-check only; no generator, independent review, classroom evidence or published resource is claimed.

## EQ03 — Find and repair an invalid step / 找出並修正不成立的步驟

**Mapped objectives:** JS-8-1 (all Foundation in the retained ledger).

**Demand:** Judge equality-preserving reasoning and explain a specific distribution error, rather than merely give a root.

**Parameters and guards:** a(x−b)=c with a in 2…6, b in 1…6 and c nonzero small integer; display one intentional wrong line with an unmultiplied b. Full working retained as a task model.

**Answer contract:** Select the corrected line by stable identity plus written reason. Selection marked automatically; reason/manual method judgement kept separate.

**Engine readiness:** Choice and stored reasons exist; error-analysis UI and per-part evidence need authoring.

**Visual and text alternative:** Original/incorrect/corrected lines labelled in reading order; never use a red/green-only distinction.

**Sample prompt (EN):** A learner writes 2(x − 3) = 10, then 2x − 3 = 10. Choose a correct replacement for the second line and explain the error.

**例題（繁體中文）：** 某同學先寫 2(x − 3) = 10，再寫 2x − 3 = 10。選出正確的第二行，並解釋錯誤。

**Model response:** distributed

**Solution (EN):** A correct line is 2x − 6 = 10. The factor 2 multiplies both x and −3; the displayed line multiplied only x.

**解說：** 正確的一行是 2x − 6 = 10。因數 2 要同時乘以 x 和 −3，原來的一行只乘了 x。

**Hint (EN):** Which terms inside the brackets must be multiplied by 2?

**提示：** 括號內哪些項都要乘以 2？

**Counterexamples and feedback checks:**

- Reject 2x+6=10 and the unchanged line.
- A correct choice alone leaves the explanation pending, rather than awarding a reasoning mark.

**Paper target:** 3 marks, 5 working lines, about 4 minutes. Calculator not required (local pilot choice). Automatic result marks and manually judged reasoning/method marks must be displayed separately.

**Review state:** design draft; sample self-check only; no generator, independent review, classroom evidence or published resource is claimed.

## EQ04 — Solve when the unknown appears on both sides / 解兩邊均含未知數的方程

**Mapped objectives:** JS-8-1 (all Foundation in the retained ledger).

**Demand:** Collect variable contributions across equality, handle brackets and compare two affine sides.

**Parameters and guards:** a(x+b)+c=dx+e, small signed integers, a≠d; choose bounded rational root first then derive e. At most one bracket; optional nonzero constant denominator after capability review. Reject a=d cases from this unit.

**Answer contract:** Exact scalar root, verified in both original sides; manual working is separate.

**Engine readiness:** Exact scalar marker exists; expression/equation generator and independent substitution validator required.

**Visual and text alternative:** Balance model followed by written equality steps, both sides always visible.

**Sample prompt (EN):** Solve 2(x − 3) + 1 = x + 4.

**例題（繁體中文）：** 解方程 2(x − 3) + 1 = x + 4。

**Model response:** 9

**Solution (EN):** Expand: 2x − 5 = x + 4. Subtract x and add 5: x = 9. Original sides both equal 13.

**解說：** 展開得 2x − 5 = x + 4。兩邊同減 x、再同加 5，得 x = 9。代回原式，兩邊同為 13。

**Hint (EN):** Simplify each side, then subtract the same x term from both sides.

**提示：** 先化簡兩邊，再在兩邊同減相同的含 x 項。

**Counterexamples and feedback checks:**

- Reject 3 and −9 by original-side substitution.
- Zero coefficient after collecting requires rejecting/resampling the task, not silently turning it into no/infinite solutions.

**Paper target:** 2 marks, 5 working lines, about 4 minutes. Calculator not required (local pilot choice). Automatic result marks and manually judged reasoning/method marks must be displayed separately.

**Review state:** design draft; sample self-check only; no generator, independent review, classroom evidence or published resource is claimed.

## EQ05 — Form an equation from a situation / 由情境建立方程

**Mapped objectives:** JS-8-2 (all Foundation in the retained ledger).

**Demand:** Define the unknown and encode a fixed charge plus a repeated rate as an equality.

**Parameters and guards:** Original local contexts with fixed fee f≥0, positive integer rate r and feasible integer count x; total f+rx. Units and the definition of x printed explicitly.

**Answer contract:** First pilot uses a validated stable-ID equation choice; a free equation response needs a separate equation-equivalence contract or manual review.

**Engine readiness:** Choice marker exists; x-only expression equivalence must not be reused to mark an equality string.

**Visual and text alternative:** Cost bar split into fixed charge and repeated per-item blocks, complete text/table alternative.

**Sample prompt (EN):** Entry costs $8 and each game costs $3. The total is $23. Let x be the number of games. Which equation models the situation?

**例題（繁體中文）：** 入場費為 $8，每局遊戲 $3，共付 $23。設遊戲局數為 x。哪條方程能表示這個情境？

**Model response:** fixed-plus-rate

**Solution (EN):** The game cost is 3x. Add the fixed $8 to get the total: 3x + 8 = 23.

**解說：** 遊戲費用為 3x，加上固定的 $8 入場費，得 3x + 8 = 23。

**Hint (EN):** Separate the fixed amount from the amount paid x times.

**提示：** 分清固定費用和需要付 x 次的費用。

**Counterexamples and feedback checks:**

- Reject adding the fixed charge for every game.
- Validate distractors against the chosen model; a different rearrangement of the correct equation must not appear as a false option.

**Paper target:** 2 marks, 4 working lines, about 3 minutes. Calculator not required (local pilot choice). Automatic result marks and manually judged reasoning/method marks must be displayed separately.

**Review state:** design draft; sample self-check only; no generator, independent review, classroom evidence or published resource is claimed.

## EQ06 — Solve and interpret a contextual model / 求解並解釋情境模型

**Mapped objectives:** JS-8-3, JS-8-2 (all Foundation in the retained ledger).

**Demand:** Form a model, solve it and decide whether the value fits the stated real-world constraints.

**Parameters and guards:** Fixed-plus-rate durations, lengths or prices; positive rate and feasible nonnegative rational solution. State whether fractional durations/counts are permitted; exclude impossible/negative cases from routine generation.

**Answer contract:** Exact value in a fixed printed unit plus a separate manual interpretation/model rubric; no automatic credit for unobserved working.

**Engine readiness:** Exact scalar marker exists; store variable definition, equation and interpretation as manual evidence.

**Visual and text alternative:** Fee table and labelled duration; printed alternatives include all numerical givens.

**Sample prompt (EN):** A rental costs $12 plus $4 per hour. Half-hours are allowed and charged proportionally. The total is $30. Find the rental time in hours and explain why it is allowed.

**例題（繁體中文）：** 租借費為 $12，另加每小時 $4；可租半小時，按比例收費。共付 $30。求租借時間（小時），並說明此時間為何符合規定。

**Model response:** 9/2

**Solution (EN):** Let t be hours. 12 + 4t = 30 gives t = 18/4 = 9/2 = 4.5 hours, an allowed multiple of half an hour. The total checks as 12 + 18 = 30.

**解說：** 設租借時間為 t 小時。由 12 + 4t = 30，得 t = 18/4 = 9/2 = 4.5 小時，是半小時的倍數，符合規定。檢驗總費用為 12 + 18 = 30。

**Hint (EN):** Remove the fixed fee before dividing by the hourly rate.

**提示：** 先扣除固定費用，再除以每小時收費。

**Counterexamples and feedback checks:**

- Reject 30/4 because it charges the fixed fee as time.
- Do not round 4.5 hours to 5; no rounding was requested and it changes the cost.

**Paper target:** 3 marks, 6 working lines, about 5 minutes. Calculator not required (local pilot choice). Automatic result marks and manually judged reasoning/method marks must be displayed separately.

**Review state:** design draft; sample self-check only; no generator, independent review, classroom evidence or published resource is claimed.

## Closing connection

Define the unknown, preserve equality, check the original relation and interpret the value in the situation.

先定義未知數，保持等式成立，代回原式檢驗，再按情境解釋數值。

Connect to linear equations in two unknowns; identities and exceptional cases need their own later objectives.

## Source locators

EDB/CDC, Learning Content of Junior Secondary Mathematics (2017), English/Traditional Chinese; EDB Junior Secondary Explanatory Notes (2020). Exact per-objective page references are in `../../data/objective-snapshot.json`; scope-review file digests and read pages are in `../../evidence/scope-review.json`. The official PDFs remain in the P0 archive.

[English learning content](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/ma/curr/jsmc2017_e.pdf) · [Traditional Chinese learning content](https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/ma/curr/jsmc2017_tc.pdf) · [English explanatory notes](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/ma/curr/EN_KS3_e.pdf)
