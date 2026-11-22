# Exact quadratic-surd checker — developer milestone

Date: 23 November 2026 (Hong Kong). This is the arithmetic/checking foundation for the [Unit 4 plan](../../planning/topics/rational.md), not a new learner-topic release. The learner application remains v0.13.0; no RI question family or lesson is available yet.

## Implemented API

`src/math/quadratic-surds.mjs` exports `QuadraticSurd`, `parseSurd`, `surdsEquivalent`, `markSurd` and `SURD_CONTRACT_VERSION` (1). It reuses exact rational coefficients from `exact.mjs`; it does not change the legacy marker or parser. The module is not yet bundled into the learner application.

```js
const contract = {
  type: 'quadratic-surd', version: 1,
  answer: '2*sqrt(3)', form: 'simplest',
  canonical: [{radicand: 3, n: '2', d: '1'}]
};
markSurd(contract, 'sqrt(12)');     // wrong-form: correct exact value
markSurd(contract, '2*sqrt(3)');    // correct
markSurd(contract, '3.46410161514'); // incorrect: finite approximation
markSurd(contract, 'sqrt(-1)', 'zh'); // invalid, Traditional Chinese feedback
```

The optional `canonical` snapshot must agree exactly with the parsed expected answer. Unknown contract versions and forms are unsupported. Snapshot coefficient strings must be reduced, nonzero, and within the rational coefficient limit; radicands must be squarefree, unique and sorted. Total zero has the canonical snapshot `[]`. Caller-owned rational objects, returned entries and JSON snapshots cannot mutate an existing value.

Values are finite rational linear combinations of square roots of squarefree positive integers; radicand 1 stores the rational term. Products and single-term quotients remain exact, and like terms cancel exactly. No floating-point comparison is used.

## Input and requested form

Inputs accept signed integers, finite decimals, rational fractions, arithmetic, brackets and `sqrt(nonnegative rational)`. Explicit multiplication is recommended; `2sqrt(3)` and bracket/root adjacency are also accepted. The root glyph is accepted with parentheses, for example `√(2)`. A naked `√2` needs parentheses. Normalisation accepts full-width digits and the standard minus/multiply/divide glyphs.

The simplest-form policy accepts either term order, harmless parentheses, explicit unit coefficients and exact decimal coefficients. It requires squarefree integer radicands greater than 1, collected like terms, reduced fractional coefficients, rational denominators and no remaining numerical products/sums inside a term. Thus `(1/2)*sqrt(2)` and `sqrt(2)/2` are accepted; `sqrt(1/2)`, `1/sqrt(2)`, `2*sqrt(2)/4` and duplicate like terms need simplification. Rational final results, including zero, are valid.

Unsupported syntax never becomes a floating-point guess. Variables, powers, nested roots and general function calls are unsupported. A denominator that remains a sum of distinct canonical terms is unsupported; a denominator that simplifies exactly to one nonzero term is supported. Negative real radicands and zero divisors are invalid. Feedback distinguishes these states, empty input, incorrect values and wrong form; messages are provided in English and Traditional Chinese.

Bounds apply before expensive work: 160 raw/normalised characters, 80 tokens, nesting/sign depth 12, at most 8 surviving canonical terms, radicands at most 1,000,000 and rational-root numerator/denominator at most 10,000 with product at most 1,000,000. Decimal/integer literals have at most 12 digits. Coefficients retain the existing exact-rational size guard. Intermediate operations are bounded too; an expression outside this scope is reported as unsupported even if a later operation could cancel it.

## Verification and remaining integration

The original 89 Node checks passed before this work. Fourteen additional tests cover independent prime-exponent checks of 3,600 positive rational roots; 576 independently checked product/quotient pairs; unlike-term arithmetic, exact cancellation, close decimal near misses, form policy, zero/negative domains, unsupported syntax, resource bounds, Unicode input, canonical snapshots, mutation isolation, contract versions and bilingual feedback. The complete post-change run and source hashes are recorded in `surd-core-test-results.txt` and `surd-core-checks.json`.

Before learner publication, integrate the new contract into the shared marker, session/backup and paper validation, renderer, answer entry and portable/QA build, with parity checks. Apply the planned readiness-map correction to the objective ledger, prerequisite edges and generated catalogue together when introducing the foundation route; keeping those representations consistent is necessary. No readiness metadata is changed in this isolated arithmetic milestone.

Next: RI01–RI04 and the two foundation lessons, then the non-foundation route, optional manual investigation and the full topic acceptance workflow. All 237 curriculum records remain planned. The existing live HTML and historical browser/print evidence remain unchanged. No new browser, PDF/physical-print, independent mathematics/language or classroom acceptance is claimed here.
