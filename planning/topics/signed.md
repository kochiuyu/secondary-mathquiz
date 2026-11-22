> Implementation update: the six families and three full bilingual sessions are available as author drafts in `../../site/Secondary_MathQuiz_Prototype.html`. The brief below preserves the original design; actual models, versions and verification are documented in `../../site/planning/release-signed-v1.md`. Independent review and actual PDF output remain pending.

# Directed numbers / 有向數

22 November 2026 · P2.1 preparatory design · not an implemented lesson

Purpose: Describe quantities relative to a reference and calculate changes reliably.

以基準描述數量，並準確計算有向變化。

Scope: Full unit target JS2.1–2.3, including number-line representation, comparison, mixed operations and contextual problems. Planned families are not completed coverage.

Boundary: No absolute-value notation or advanced index laws are required by this pilot; optional enrichment must be labelled. Avoid excessively complicated arithmetic.

Preparation: Compare whole numbers; add/subtract fractions and decimals; read equal number-line ticks.

## Three-session learning path

| Session | Opening and purpose | Closing takeaway | Separate check |
| --- | --- | --- | --- |
| SN-L1 — Where is zero? / 零在哪裏？ | Read a temperature relative to zero; contrast −7 and −3. | Explain the reference and use left/right order; zero is neither positive nor negative. | Explain where the datum lies before selecting a signed value. |
| SN-L2 — Moves, inverses and sign patterns / 移動、逆運算與符號規律 | Predict a negative subtraction and test the prediction on a number line. | Subtracting a negative reverses its movement; multiplication/division signs agree with inverse products. | Calculate without a diagram after a worked model, then check by inverse operation. |
| SN-L3 — A change is not a final value / 變化不等於最後數值 | Compare final temperature with the change from its initial value. | Bracket structure controls operation order; initial + change = final. | Solve a new mixed calculation and a new contextual change before seeing solutions. |



Full session narration is P2.2 work. Each session will use overview → readiness → explanation/visual → model → fading guidance → fresh check → takeaway/next link. Titles and family samples below are bilingual drafts; full lesson prose is not yet authored.

## Six distinct family briefs

These IDs are local family identities. Number changes are variants, not additional families. All examples are newly authored.

## SN01 — Represent a signed quantity / 表示有向數

**Mapped objectives:** JS-2-1 (all Foundation in the retained ledger).

**Demand:** Translate a reference point and direction into a signed value; state what zero represents.

**Parameters and guards:** Reference fixed explicitly; integer magnitude 1–20; include above/below and a separate zero case. Do not use ambiguous building floor labels.

**Answer contract:** Exact final number in a field whose unit is printed; zero is neither positive nor negative.

**Engine readiness:** Exact-number marking exists; add semantic context generator and number-line renderer.

**Visual and text alternative:** Thermometer/number line has labelled zero and equal ticks; read the same value through labelled text. No drag-only response.

**Sample prompt (EN):** The temperature is 3 °C below 0 °C. Write its directed number in °C.

**例題（繁體中文）：** 氣溫比 0 °C 低 3 °C。以有向數表示氣溫（單位：°C）。

**Model response:** -3

**Solution (EN):** Zero is the reference. Below zero is negative, so the temperature is −3 °C.

**解說：** 以 0 °C 為基準，低於基準用負數表示，所以氣溫是 −3 °C。

**Hint (EN):** Which side of zero represents a temperature below zero?

**提示：** 低於 0 °C 的氣溫應放在零的哪一側？

**Counterexamples and feedback checks:**

- Reject +3 for this below-zero case; explain the chosen reference and direction without diagnosing a personal misconception.
- Include a zero case; never label zero positive or negative.

**Paper target:** 1 marks, 2 working lines, about 1 minutes. Calculator not required (local pilot choice). Automatic result marks and manually judged reasoning/method marks must be displayed separately.

**Review state:** design draft; sample self-check only; no generator, independent review, classroom evidence or published resource is claimed.

## SN02 — Compare directed numbers / 比較有向數

**Mapped objectives:** JS-2-1 (all Foundation in the retained ledger).

**Demand:** Compare order on a number line rather than unsigned digit size.

**Parameters and guards:** Two distinct rationals in [−12,12], denominators in {1,2,4}; sample both negatives, cross-zero and zero. Options use stable value identities.

**Answer contract:** Stable-ID choice of larger number; optional written explanation has a separate manual rubric.

**Engine readiness:** Choice marking exists; add exact rational comparator and consistent tick/label layout.

**Visual and text alternative:** Horizontal number line with values at true scaled coordinates; text identifies both numbers and left/right order after reveal.

**Sample prompt (EN):** Which number is greater: −7 or −3?

**例題（繁體中文）：** −7 和 −3，哪個數較大？

**Model response:** right:-3

**Solution (EN):** −3 lies to the right of −7 on the number line, so −3 is greater.

**解說：** 在數線上，−3 位於 −7 的右方，所以 −3 較大。

**Hint (EN):** On a number line, numbers increase to the right.

**提示：** 在數線上，向右的數較大。

**Counterexamples and feedback checks:**

- Reject the −7 option; contrast order with distance from zero.
- Do not infer understanding of opposites from a correct binary choice alone.

**Paper target:** 1 marks, 2 working lines, about 1 minutes. Calculator not required (local pilot choice). Automatic result marks and manually judged reasoning/method marks must be displayed separately.

**Review state:** design draft; sample self-check only; no generator, independent review, classroom evidence or published resource is claimed.

## SN03 — Signed movement and subtraction / 有向移動與減法

**Mapped objectives:** JS-2-2 (all Foundation in the retained ledger).

**Demand:** Connect adding/subtracting a directed quantity with inverse movement, then calculate.

**Parameters and guards:** a,b integers −12…12, include b=0 and negative b; result within [−24,24]. Operation is addition or subtraction; persist it with the snapshot.

**Answer contract:** Exact final number; unfinished arithmetic is wrong form under the current contract.

**Engine readiness:** Exact arithmetic/number form exists; add operation-specific movement diagram.

**Visual and text alternative:** Start arrow and movement arrow labelled by operation; text says start, direction, distance and endpoint. Subtracting a negative moves right.

**Sample prompt (EN):** Calculate −4 − (−7).

**例題（繁體中文）：** 計算 −4 −（−7）。

**Model response:** 3

**Solution (EN):** Subtracting −7 is adding 7: −4 + 7 = 3.

**解說：** 減去 −7 即加上 7：−4 + 7 = 3。

**Hint (EN):** Replace subtraction with adding the opposite.

**提示：** 把減法改寫為加上相反數。

**Counterexamples and feedback checks:**

- −11 is incorrect for this subtraction; show the inverse operation.
- −4+7 is equivalent but unfinished, so request a final value rather than calling its value wrong.

**Paper target:** 1 marks, 3 working lines, about 2 minutes. Calculator not required (local pilot choice). Automatic result marks and manually judged reasoning/method marks must be displayed separately.

**Review state:** design draft; sample self-check only; no generator, independent review, classroom evidence or published resource is claimed.

## SN04 — Multiplication and division signs / 乘除的符號規律

**Mapped objectives:** JS-2-2 (all Foundation in the retained ledger).

**Demand:** Use a multiplication pattern or inverse relation to justify product/quotient sign.

**Parameters and guards:** Integer factors −9…9; for division choose a nonzero divisor and integer quotient first, then construct dividend. Include zero dividend; never zero divisor.

**Answer contract:** Exact final number; a reason, if requested, remains manual.

**Engine readiness:** Exact-number marking exists; generate from nonzero divisor and independently check inverse product.

**Visual and text alternative:** Small multiplication-pattern table with row/column headers and a text version; include 0 to stop an overgeneralised sign rule.

**Sample prompt (EN):** Calculate (−6) ÷ (−3).

**例題（繁體中文）：** 計算（−6）÷（−3）。

**Model response:** 2

**Solution (EN):** (−3) × 2 = −6, so (−6) ÷ (−3) = 2.

**解說：** 因為（−3）× 2 = −6，所以（−6）÷（−3）= 2。

**Hint (EN):** Which number multiplied by −3 gives −6?

**提示：** 哪個數乘以 −3 會得到 −6？

**Counterexamples and feedback checks:**

- Reject −2; use the inverse multiplication check.
- Reject generated zero divisors before display; do not ask the marker to repair an invalid task.

**Paper target:** 1 marks, 3 working lines, about 2 minutes. Calculator not required (local pilot choice). Automatic result marks and manually judged reasoning/method marks must be displayed separately.

**Review state:** design draft; sample self-check only; no generator, independent review, classroom evidence or published resource is claimed.

## SN05 — Mixed operations with rational values / 有理數的混合運算

**Mapped objectives:** JS-2-2 (all Foundation in the retained ledger).

**Demand:** Plan operation order and bracket structure; compute an exact rational result.

**Parameters and guards:** Template (a+b×c)÷d; integers a,b,c in −9…9 and d in {−4,−3,−2,2,3,4}; later include one nested bracket or exact terminating decimal. At most two bracket levels and four operations; avoid needlessly complicated arithmetic.

**Answer contract:** Final integer, exact decimal or integer fraction; retain exact value and distinguish wrong form.

**Engine readiness:** Rational parser and final-number marking exist; add bounded template generation and validation.

**Visual and text alternative:** Operation-order highlight has a static numbered text alternative; avoid relying on colour.

**Sample prompt (EN):** Calculate [−3 + 2 × (−4)] ÷ (−2).

**例題（繁體中文）：** 計算［−3 + 2 ×（−4）］÷（−2）。

**Model response:** 11/2

**Solution (EN):** First 2 × (−4) = −8; then −3 − 8 = −11; finally (−11) ÷ (−2) = 11/2.

**解說：** 先算 2 ×（−4）= −8，再算 −3 − 8 = −11，最後（−11）÷（−2）= 11/2。

**Hint (EN):** Complete multiplication inside the square brackets first.

**提示：** 先完成方括號內的乘法。

**Counterexamples and feedback checks:**

- Accept 5.5 and 11/2 as the same final value.
- Reject a deliberately incorrect result 2; explain order using this task.
- Unfinished −11/−2 may parse as an integer fraction and is a final value; do not demand one cosmetic sign placement.

**Paper target:** 2 marks, 4 working lines, about 3 minutes. Calculator not required (local pilot choice). Automatic result marks and manually judged reasoning/method marks must be displayed separately.

**Review state:** design draft; sample self-check only; no generator, independent review, classroom evidence or published resource is claimed.

## SN06 — Find a directed change in context / 由情境求有向變化

**Mapped objectives:** JS-2-3, JS-2-2 (all Foundation in the retained ledger).

**Demand:** Identify initial/final/reference quantities and distinguish final value from change.

**Parameters and guards:** Temperatures or net balances with explicit initial/final values in [−15,15]; choose unequal endpoints and fixed units. No unannounced contextual convention.

**Answer contract:** Exact signed change in the printed unit; written interpretation reviewed separately.

**Engine readiness:** Number marking exists; context model and interpretation rubric must be authored.

**Visual and text alternative:** Initial/final markers and an arrow; text lists initial, final, requested change and unit.

**Sample prompt (EN):** The temperature changes from −4 °C to 3 °C. Find the directed change in temperature (°C).

**例題（繁體中文）：** 氣溫由 −4 °C 變為 3 °C。求氣溫的有向變化（單位：°C）。

**Model response:** 7

**Solution (EN):** Change = final − initial = 3 − (−4) = +7 °C; the temperature rises by 7 °C.

**解說：** 變化 = 最後氣溫 − 最初氣溫 = 3 −（−4）= +7 °C，即上升 7 °C。

**Hint (EN):** Which operation links initial value, change and final value?

**提示：** 最初數值、變化和最後數值之間有甚麼關係？

**Counterexamples and feedback checks:**

- Reject 3: it is the final temperature, while the question asks for change.
- Reject −7; check that initial + change equals final.

**Paper target:** 2 marks, 4 working lines, about 3 minutes. Calculator not required (local pilot choice). Automatic result marks and manually judged reasoning/method marks must be displayed separately.

**Review state:** design draft; sample self-check only; no generator, independent review, classroom evidence or published resource is claimed.

## Closing connection

Use a clear reference, keep direction and magnitude separate, and check operations through inverse relationships.

先定清楚基準，分清方向與大小，並用逆運算檢驗結果。

Use directed values when interpreting algebraic expressions and solving equations.

## Source locators

EDB/CDC, Learning Content of Junior Secondary Mathematics (2017), English/Traditional Chinese; EDB Junior Secondary Explanatory Notes (2020). Exact per-objective page references are in `../../data/objective-snapshot.json`; scope-review file digests and read pages are in `../../evidence/scope-review.json`. The official PDFs remain in the P0 archive.

[English learning content](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/ma/curr/jsmc2017_e.pdf) · [Traditional Chinese learning content](https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/ma/curr/jsmc2017_tc.pdf) · [English explanatory notes](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/ma/curr/EN_KS3_e.pdf)
