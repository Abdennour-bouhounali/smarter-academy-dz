# « مختبر التفكير » — The thinking space contract

> **Status.**
>
> - **Implemented since 2026-10-30 (phase 0, « Foundations »):**
>   - the content model;
>   - the answer check, including the `expression` evaluator in JS and PHP with one shared fixture;
>   - per-student numbers;
>   - the content pipeline: schema → validator → oracle → generated index, chained into `check:lessons`.
>
>   There is no route, table, screen or API yet.
> - **Planned, not yet implemented:** everything marked *Planned* below. That is phases 1–7 of the build plan
>   [`reports/THINKING_LAB_PLAN_2026-10-30.md`](../reports/THINKING_LAB_PLAN_2026-10-30.md). The plan stays the authority for
>   what is not built yet, and its §2 owner decisions D1–D10 are binding. This contract is the authority for what exists.
> - Content: [`curriculum/THINKING_LAB_CHALLENGE_BANK.md`](../curriculum/THINKING_LAB_CHALLENGE_BANK.md).

## 1. What it is

A student space that trains problem solving and critical thinking. The student tries first, then watches a
replay of a mathematician's thinking. The method is SMART (Scan, Math translate, Aim, Relate, Test) plus
« 👁 الملاحظة », observation used as a lens in every phase.

| Path | Content | Status |
|---|---|---|
| 1 · « سُلَّم التحدّيات » | numbered puzzles outside the curriculum, primary → university, band hidden | content model and checking **implemented**; ladder *Planned* (phase 1) |
| 2 · « مسار المنهاج » | problems tied to each grade's lessons, the « مسرح العقل » | *Planned* (phase 6) |

## 2. Where the code lives

```
content/thinking-lab/
  _schema/challenge.schema.json        the challenge schema (§3)
  _fixtures/expressions.json           shared JS ↔ PHP fixture of the expression evaluator (§4)
  _fixtures/params.json                shared fixture of per-student numbers (§3.3)
  challenges/<NNNN>-<id>.json          one file per challenge
  index.generated.json                 GENERATED, checked in, server-only (§5.3)
packages/core/thinkingLab/             pure logic, imported BY PATH, never through the core barrel
  expression.js                        safe parser + evaluator + equivalence (no eval)
  checkAnswer.js                       integer | number | rational | expression | choice + declared mistakes
  params.js                            per-student numbers (FNV-1a) and {name} filling
apps/api/app/Domain/ThinkingLab/
  ExpressionEvaluator.php              PHP port of expression.js (same grammar, codes, canonical print, sampler)
  ExpressionSyntaxError.php
scripts/
  build-thinking-lab-index.mjs         writes / --check the index
  validate-thinking-lab.mjs            the content gate (§5.1), chained into check:lessons
  thinking-lab-oracle/<batch>.mjs      independent recomputation of every answer (§5.2)
  thinking-lab-oracle.test.mjs         fails for a published challenge without an oracle
  lib/jsonSchemaSubset.mjs             the JSON-Schema subset the validator uses (no dependency)
```

*Planned (phase 1+):* `AnswerChecker.php` (the server mirror of `checkAnswer.js`), the PHP mirror of `params.js`,
`ChallengeRepository`, `ChallengePresenter`, the gate, the tables, the routes and `features/thinkingLab/` (plan §3).

**Bundle rule** ([`BUNDLE_BOUNDARIES.md`](./BUNDLE_BOUNDARIES.md) §4):

- `packages/core/thinkingLab/*` is imported by path, and no entry module imports it.
- `content/thinking-lab/index.generated.json` holds the answers, so no web module may import it. Only the
  server reads it.

## 3. Content model

### 3.1 A challenge

Every field is required, and `null` is written when a field does not apply. The exception is `whiteboard`,
which may be left out. The schema is `content/thinking-lab/_schema/challenge.schema.json`.

| Field | Meaning |
|---|---|
| `id` | stable slug. It never changes; links and progress use it. |
| `number` | position in the current edition. The file name is `String(number).padStart(4,'0')-<id>.json`. |
| `title` | Arabic title for authors and teachers. The student sees the number only. |
| `status` | `draft` or `published`. In `--strict` mode nothing stays `draft` (owner rule). |
| `family` | `logic`, `numbers`, `patterns`, `algebra`, `geometry`, `counting`, `probability`, `functions`, `analysis`, `invariants` or `critical`. |
| `band` | **hidden**; it must match the number (§3.2). |
| `summit` | `true` exactly for multiples of 25. |
| `licence`, `source` | `PD`, `FOLK` or `TYPE`, plus what inspired it (challenge bank §1). Never a copied statement. |
| `examTag` | `bem`, `bac` or `null`. |
| `rating` | the author's initial estimate (Elo scale, 400–3000). |
| `statement` | Arabic text. `{name}` placeholders are filled from `params`. |
| `figure` | `{kind: "svg", component, props}` or `null`. The figure is drawn in code, never as a raster image. |
| `whiteboard` | `{seed, observe[]}` or `null`: the observation targets (`segment`, `triangle` or `angle` through named points). |
| `params` | `{vars: {name: [values…]}}` or `null` (§3.3). |
| `answer` | §4. |
| `parts` | summits: `[{prompt, answer}]` (at least 2), or `null`. |
| `mistakes` | frequent wrong answers and their « ليس بعد » reply (§4.3). |
| `keys` | 1–3 entries; a published challenge has exactly **3** (S → 👁 → R). Each key is a question and never gives the answer. |
| `example` | the primary band's worked example `{statement, steps[], answer}`. It is required for that band and `null` for the others. |
| `replay` | steps `{phase, think, layers?, math?, ask?}`. The phases are `S M A R T O B` (O = 👁 observation, B = ↩ dead end). |
| `keyMoves` | 1–3 sentences: the short replay for a student who solved alone. |
| `move` | `{id, title}`: the thinking move collected as a card. |
| `twin` | the id of the twin challenge, or `null`. |
| `ceiling` | « ارفع السقف » `{statement, answer}`, or `null`. |

### 3.2 Hidden bands

| Numbers | Band | Mode |
|---|---|---|
| 1–120 | `primary` | example first (`example` required), no one-day lock |
| 121–260 | `middle` | try first |
| 261–420 | `secondary` | try first |
| 421+ | `university` | try first |

The bands are enforced by `validate-thinking-lab.mjs › bandOf`. The modes are applied by the gate (*Planned*, plan §5–§6).

### 3.3 Per-student numbers (`params`)

- **Tuple choice:** a student's tuple is `fnv1a32("${userId}:${challengeId}:${edition}") mod tupleCount`.
- **Hash:** FNV-1a, 32 bits, over UTF-8 bytes. In PHP it is computed as `($h * 16777619) & 0xFFFFFFFF`.
- **Tuple order:** variables are sorted by name, and the last one varies fastest.
- **Shared fixture:** `content/thinking-lab/_fixtures/params.json` freezes the choice. The PHP mirror must pass the same
  fixture (*Planned*, phase 1).
- **Filling:** `fillChallenge` replaces `{name}` in every string.
  - `answer.value`, `mistakes[].value` and `scaleWith` are filled **between parentheses**, so `{a}^2` with a = −3 reads `(-3)^2`.
  - `params` itself is left untouched.
  - A `{name}` that is not a declared variable is left as written. The validator rejects it in the statement, the keys and the replay.

## 4. Checking an answer

### 4.1 Checks

| `answer.check` | How it is checked |
|---|---|
| `integer`, `rational` | delegated to the practice evaluator (`answerEvaluator.js`, PHP `AnswerEvaluator`) as `answerType: "rational"`. It is exact and never compared to an epsilon. `tolerance` is a rational. |
| `choice` | delegated as `answerType: "choice"`. `value` is the id of the correct choice, and `choices` is `[{id, text}]`. |
| `number` | the answer is read as a rational, falling back to an expression with no variable, then compared with `relTol` (default 1e-6) and `absTol` (default 1e-9). Constants are allowed (`π/4`). |
| `expression` | equivalence by evaluation, with `expression.js` / `ExpressionEvaluator.php` (§4.2). |

The outcomes are the practice outcomes: `correct`, `equivalent_correct`, `incorrect` and `syntax_error`.

- An unreadable or empty answer is a `syntax_error`, never an `incorrect`. It will not count as an attempt
  (honest-attempt rule, *Planned*).
- `checkAnswer` returns `{outcome, correct, normalized, mistakeIndex}`.
- An unreadable **expected** answer throws, because it is a content error.

The client never grades. `checkAnswer.js` serves the validator, the oracle and display; the server grades
(*Planned*: `AnswerChecker.php`, delegating `expression` to `ExpressionEvaluator.php`).

### 4.2 The `expression` evaluator

**Grammar.** A recursive-descent parser, written twice with one grammar. Neither copy uses `eval`, and a test checks this on both sides.

```
expr    := term (('+' | '-') term)*
term    := unary (('*' | '/') unary | <implicit product> power)*
unary   := ('-' | '+') unary | power
power   := primary ('^' unary)?              right-associative; -x^2 = -(x^2); 2^-1 allowed
primary := number | pi | e | variable | '(' expr ')' | '|' expr '|'
         | fn '(' expr ')' | fn unary        fn ∈ sqrt sin cos tan ln exp abs
```

**Reading conventions:**

- An implicit product has the precedence of a written product and reads left to right. `1/2x` is `(1/2)·x`.
- A function written without parentheses takes the next unary operand. `√3x` is `√3·x`, and `sin x^2` is `sin(x²)`.
- `e` is always the constant. The schema forbids it as a variable.
- Variables are single letters declared in `answer.vars`. Any other letter is `unknown_symbol`.
- An Arabic letter is `unknown_symbol`.
- `|…|` cannot nest; use `abs()` for nested absolute values.

**Input normalisation**, identical on both sides:

- Arabic-Indic and Persian digits are converted to Latin digits, and `٫` becomes `.`.
- All whitespace is removed.
- `− – —` become `-`, `× · ⋅` become `*`, `÷ ∕` become `/`, and `**` becomes `^`.
- `π` becomes `pi`, and `√` becomes `sqrt`.
- `\cdot`, `\times`, `\div`, `\sqrt`, `\pi`, `\left` and `\right` are rewritten or removed.
- `{ } [ ]` are read as parentheses.
- Superscripts `⁰…⁹` become `^n`.
- A decimal comma is accepted between two digits (`1,5`).

The input is MathLive's `ascii-math` output (`ExamMathField`), typed Unicode, or LaTeX shapes.

**Error codes** (shared, compared by the fixture): `empty`, `too_long` (more than 300 code points), `unknown_symbol`,
`bad_number`, `unexpected_token`, `unbalanced` and `too_deep` (depth above 60).

**Values.** An undefined value is NaN (JS) or NAN (PHP). These cases are undefined:

- division by 0;
- `sqrt` of a negative number, and `ln` of a number ≤ 0;
- a negative base raised to a non-integer power, and `0^negative`;
- any non-finite result.

**Canonical writing** (`normalized`): the expression fully parenthesised, for example `((x^2)*((1+(pi/3))-sqrt(3)))`. Literals are
canonical (`007.50` → `7.5`). A student's writing that prints like the expected one is `correct`; any other equivalent
writing is `equivalent_correct`. *Planned:* `answer_norm`, used by the honest-attempt rule, is this string.

**Equivalence.** Both expressions are evaluated at sample points:

1. Points are drawn by a Park–Miller generator (×48271 mod 2³¹−1, exact integers in both languages).
   - The default seed is `20261030`.
   - Each declared variable is drawn in `domain[v]`, `{min, max, exclude[]}`. The default domain is [−4, 4].
   - A point closer than 1e-3 to an excluded value is skipped.
   - At most 8 × `samples` points are drawn.
2. At each point:
   - if both values are undefined, the point is skipped;
   - if exactly one is undefined, the answer is refused (`domain`);
   - if the values differ beyond `relTol` (default 1e-6) or `absTol` (default 1e-9), it is refused (`differs`).
3. It is accepted (`equal`) after `samples` agreeing points (default 6). With fewer than ⌈samples/2⌉ defined points it
   is refused (`undefined`). An expression with no variable is evaluated once.

A geometric challenge declares a positive `domain` (`x ∈ [0.5, 10]`), so `√(x²)` and `x` agree there. With the
default domain they do not.

**Shared fixture.** `content/thinking-lab/_fixtures/expressions.json` holds 222 cases: 116 parse/evaluate cases and
106 equivalence cases, at least 40 of each verdict.

- The verdicts (`ok`, `equivalent`) are **authored**. The values come from independent `Math` formulas.
- The `normalized` and `reason` fields were recorded from the JS.
- Vitest (`packages/core/thinkingLab/expression.test.js`) and PHPUnit (`tests/Unit/ThinkingLab/ExpressionEvaluatorFixtureTest.php`)
  both run the file.
- When PHP diverges, PHP is fixed. Changing the fixture is a contract decision taken on both sides, as with
  `packages/core/practice/fixtures/answers.json`.

The existing client-side `compareMathExpressions` (compute-engine) and the nerdamer facade are **not** used for grading.

### 4.3 Declared mistakes

`mistakes[]` lists wrong answers that get a targeted « ليس بعد » reply. `checkAnswer` returns the index of the first match:
mistakes matched by value first, then mistakes matched by range.

- **`{value, scaleWith?, reply}`** matches an answer equivalent to `value`. For an `expression` the comparison is with
  `(value)*(scaleWith)`, so `1-pi/4` with `scaleWith: "x^2"` stands for `(1−π/4)x²`.
- **`{value, outside: [lo, hi], at?, reply}`** matches any answer whose value at the point `at` is ≤ lo or ≥ hi. Here `value` is one
  example of such an answer, and the validator checks that it is refused and recognised as this mistake.

## 5. The content pipeline

### 5.1 `scripts/validate-thinking-lab.mjs [--strict] [--json]`

**Every run checks:**

- **Schema:** the file follows the schema, with `jsonSchemaSubset.mjs`. A schema keyword the subset does not handle is an error.
- **Identity:**
  - the file name is `NNNN-<id>.json`;
  - ids and numbers are unique;
  - the band follows the number;
  - `summit` is set exactly for multiples of 25;
  - `example` is present for the primary band only;
  - a published challenge has 3 keys;
  - a challenge is not its own twin.
- **Replay:** a replay of 6 steps or more has an `ask`, and `ask.correct` is one of the option indexes.
- **For every params tuple:**
  - no `{name}` is left unfilled;
  - the answer accepts itself (a `choice` value is one of the choices);
  - every mistake is readable, refused, and recognised as itself;
  - `parts` and `ceiling` answers are readable;
  - **nothing before the gate leaks the answer**. "Before the gate" means the keys, the mistake replies and the example.
    "Leaks" means a math fragment of the text is equivalent to the answer, or equal to it in value. The statement
    is not checked, because it carries the data.
- **Forbidden words** in every string:
  - Arabic whole words, with only the article allowed as a prefix (so « برهان » and « كبيرة » pass);
  - Arabic phrases (« قرض بفائدة »…);
  - English words and emoji (rule « Cultural and religious respect » of the lesson guide).
  - « عيد الميلاد » alone is allowed, because it also means a birthday.
- **Warning only:** a `twin` that does not exist yet.

**`--strict` also checks** (this is the mode `check:lessons` runs):

- no challenge is `draft`;
- the index is fresh;
- at least one challenge in five has a dead-end step (`B`).

### 5.2 The oracle

- `scripts/thinking-lab-oracle/<batch>.mjs` exports `ORACLE[id] = { answer, ceiling?, parts?, tolerance? }`, where
  each entry is `(params, point) => value`. It is recomputed by an independent path. #318's area, for example,
  comes from Simpson integration over horizontal slices of the intersection of disks, never from the replay's
  « polygon + segments » formula.
- `scripts/thinking-lab-oracle.test.mjs` checks every published challenge, for every tuple:
  - an `expression` must equal the oracle at 12 points of its domain;
  - any other check must accept the oracle's value through `checkAnswer`;
  - every mistake must be refused;
  - a published challenge without an oracle fails.
- The same file holds the **phase-0 acceptance test** on the content file of #318: it accepts 3 equivalent writings and
  refuses its 3 declared mistakes, each with its own index.

### 5.3 The index

- **What it is:** `scripts/build-thinking-lab-index.mjs` (`npm run build:thinking-lab-index`) writes
  `content/thinking-lab/index.generated.json` as `{ $comment, count, challenges[] }`. It holds the published
  challenges, complete and without `$schema`, sorted by number.
- **Freshness:** `--check` (and `validate --strict`) fails on a stale index.
- **Who reads it:** it is the only content file the server reads (*Planned*: `ChallengeRepository`, phase 1). Deploying it
  needs the same rsync step as `content/practice/` in `.github/workflows/deploy.yml` (*Planned*, phase 1).

### 5.4 How to add a challenge

1. Write `content/thinking-lab/challenges/<NNNN>-<id>.json` from the challenge bank entry, in our own words with our own
   numbers (« INDEPENDENCE FROM THE BOOK » applies to puzzle books and competitions too).
2. Add its oracle to a batch in `scripts/thinking-lab-oracle/` and import the batch in `thinking-lab-oracle.test.mjs`.
3. Run `npm run build:thinking-lab-index`, `npm run validate:thinking-lab -- --strict` and `npx vitest run --dir scripts thinking-lab`.
4. Set `status: "published"`. Nothing generated stays `draft`.
5. Update the challenge bank's status line.

## 6. Planned (phases 1–7, plan §5–§15)

- **The ladder and the gate:**
  - 3 open challenges at a time;
  - honest attempts (≥ 120 s apart, a changed answer, a draft sentence);
  - keys opened after attempts 1, 2 and 3;
  - an independent student unlocks after 3 counted attempts and 24 h (Africa/Algiers);
  - a class student unlocks by teacher request, with a 48 h fallback.
- **Replays:** the replay player (`S M A R T O B` steps, `ask` pauses), adapted to whether the student solved alone.
- **The server is authoritative.** No answer, locked key or replay reaches the client before the gate opens; a test
  will scan API responses for leaks.
- **Writing:** the whiteboard seed and observation detection, frozen board snapshots with a teacher red layer, and photos
  through a shared `ImageEncoder`.
- **Motivation:** points and stakes, streak, move cards, summits, and a pseudonymous weekly league for independent students.
- **Path 2:** the « مسرح العقل » and the autonomy tiers.
- **Calibration:** ratings (Elo) and edition renumbering.

## 7. Open decisions (plan §17)

The plan's §17 decisions are not needed by phase 0. When phase 1 meets one, the proposed value goes into config
(`config/thinking_lab.php`) and is listed in that phase's report.

## 8. Tests

| Suite | File | What it proves |
|---|---|---|
| Vitest (core) | `packages/core/thinkingLab/expression.test.js` | every case of the shared fixture, no `eval`, the sampler, normalisation |
| Vitest (core) | `packages/core/thinkingLab/checkAnswer.test.js` | the five checks, mistakes, #318 acceptance (inline copy) |
| Vitest (core) | `packages/core/thinkingLab/params.test.js` | the params fixture, tuple order, filling |
| PHPUnit | `tests/Unit/ThinkingLab/ExpressionEvaluatorFixtureTest.php` | the same fixture, the sampler, no `eval` |
| Vitest (scripts) | `scripts/validate-thinking-lab.test.mjs` | each validator rule catches a broken copy of #318 |
| Vitest (scripts) | `scripts/thinking-lab-oracle.test.mjs` | the oracle for every published challenge; #318 acceptance on the content file |
| Gate | `npm run validate:thinking-lab -- --strict` (in `check:lessons`) | §5.1 |
