# Exercise Contract

> **Read § 0 first (2026-09-20).** This document was written for the French-era
> lessons and canonicalised `useAdaptiveExercise`'s result shape. **That hook,
> `useSimpleExercise`, `ExerciseValidator`, `GuidedSolution` and `QuizQuestion`
> were dead code and were DELETED on 2026-09-29** (no importer anywhere;
> `AdaptiveFeedback` remains, unused by the 4AM lessons). The passages below that
> name them are history. The rest of this document is still correct about the
> **non-blocking invariant** and about what a validator should return, and § 0
> describes the two systems that actually run.

---

## 0. The two exercise systems that actually exist

| | **A — lesson exercises** | **B — the practice engine** |
|---|---|---|
| Where the content lives | `content/exercises.js` inside the lesson | JSON in `content/practice/<grade>/<lesson>/level-{1..5}/` |
| Rendered by | `TextbookExercise` inside a `ContentModule` step | `PracticeSession` + `QuestionRenderer` in the student space |
| Evaluated by | the kit's question components, or `practice.evaluateAnswer` for `integerSet` and `fraction` | `practice.evaluateAnswer` for every type |
| Persisted | **nothing per exercise** — only module completion | server: sessions, exercise and question attempts, hint events, evidence |
| Touches mastery | no (instructional — decision D9) | yes (`assessment_type: 'practice_exercise'`) |
| Judged by | the browser | **the server** (Mastery V2) — the browser's verdict is only an instant preview |

A third source of evidence is the **final test** (`BossFinal`, `evaluation`
stage): MCQ only, writes evidence with `assessment_type: 'assessment'`.

**The live evaluation contract is `practice.evaluateAnswer`** in
`packages/core/practice/answerEvaluator.js`, and its **server twin**
`App\Domain\Practice\Support\AnswerEvaluator` (PHP, since 2026-09-24). Both
return an **outcome, not a boolean**:

```
correct · equivalent_correct · partially_correct · incorrect · syntax_error · abandoned
```

`syntax_error` deliberately does not move mastery: not knowing how to write a
number is not getting the number wrong. Comparison is exact rational
arithmetic — `Math.abs(a-b) < ε` is banned from the comparison path, so 0.1 +
0.2 equals 0.3 and 7.5 equals 15/2.

Answer types: `choice`, `multiChoice`, `rational`, `affine`, `interval`,
`point`, `integerSet`.

**`MathLive is not used.`** The dependency is installed and `MathInput.jsx`
wraps it, but nothing imports that component. `compareMathExpressions` and the
compute-engine path are likewise unused by any live page. Free algebraic input
does not exist: answers are choices, rationals, sets, intervals or points, all
exactly comparable.

**Lesson exercise entry shape** (`content/exercises.js`), as authored in all
eight 4AM lessons:

```js
{
  id: 'ex-1',                                   // unique in the lesson; also the DOM key
  source: src('ex-1', 14, 'أوظّف تعلّماتي', 1),  // textbook provenance, always
  learningPointId: LP.P2,                        // documentation only — nothing reads it
  difficulty: 'facile',                          // label only — no ordering, no selection
  statement: '…',                                // the textbook's words
  interaction: 'choice',                         // choice | trueFalse | numeric | integerSet
                                                 // | fraction | batch | reasoning
  question: { /* shape depends on `interaction` */ },
  method: '…',                                   // NOT rendered today
  commonError: '…',                              // rendered under the exercise
}
```

There is **no schema and no validator** for this file, unlike the practice JSON
(`content/practice/_schema/exercise.schema.json`).

**Retry and blocking, as implemented:** a lesson exercise has no retry and no
attempt limit. The answer is revealed immediately, `onAnswered(isCorrect)` fires
unconditionally, and the controls disable. In the practice engine there are two
different « again »:

- **« أعد المحاولة » inside an open question** re-uses the same attempt id: the
  server treats the second submission as a duplicate and **only the first
  outcome counts** for mastery. The retried answer is still **judged on its
  own**: the response carries the evaluation of the NEW answer, with
  `duplicate: true` and `recorded: false`, and nothing is written. (Before the
  2026-09-24 answer audit the server echoed the first verdict, so after one
  wrong pick no answer — not even the right one — was ever accepted on retry.)
  The practice screen counts a correct answer in its session score only when
  `recorded !== false`.
- **Opening the same question again later** (a new session, or a revisit)
  creates a new attempt (`attempt_number + 1`) and a new evidence row. The
  mastery engine classifies it — `retry_after_failure` or
  `repeat_after_success` — and weighs it accordingly
  ([`LEARNING_ARCHITECTURE.md`](./LEARNING_ARCHITECTURE.md) § « Repetition »).
  Unlimited practice is encouraged; it cannot farm mastery.

### Server-side evaluation (Mastery V2, 2026-09-24)

`POST /practice/sessions/{id}/answers` takes `{attemptUuid, answer, outcome?}`.
The server evaluates `answer` against the question from the content
(`ExerciseRepository`) with the PHP evaluator, stores that outcome on
`question_attempts` (`evaluated_by = server`) and on the evidence, and returns
it as `evaluation {outcome, isCorrect, misconceptionId, normalized,
feedbackKey}` — **the verdict the screen shows**. The client's `outcome` is a
prediction for its instant feedback: compared, logged on disagreement
(`evidence.disagreement`, `question_attempts.client_outcome`), never decisive.
`mastery.server_evaluation=false` is the rollback switch.

The two evaluators are held equal by ONE fixture,
`packages/core/practice/fixtures/answers.json` (168 cases generated by running
the JS evaluator), consumed by `answerEvaluator.fixtures.test.js` and
`tests/Unit/Practice/AnswerEvaluatorFixtureTest.php`. Rules: regenerate the
fixture only from the JS side; when PHP disagrees, fix PHP. Two subtleties the
port reproduces: JS `\d`/`\s` are ASCII-/JS-specific (PHP uses `[0-9]` and
an explicit whitespace class), and `normalizeNumeric` strips `;`.

### Outcome semantics — one table for everything

| Outcome | Mastery | Success rate (`OutcomeStats`) |
|---|---|---|
| `correct`, `equivalent_correct` | full positive evidence | success |
| `partially_correct` | weak positive (×0.4), not a distinct success | partial — in the denominator |
| `incorrect` | negative | failure — in the denominator |
| `syntax_error`, `abandoned` | inert | excluded, reported as `inert` |

`successRate = successes / (successes + partials + failures)`. The student's
practice summary, the student dossier, the teacher's class view and the admin
analytics all use `App\Domain\Progress\Support\OutcomeStats`.

---

*(Historical paragraph.)* Three exercise patterns once existed with no shared contract (`docs/reports/ARCHITECTURE_FOUNDATION_AUDIT.md` §6); this document canonicalised the strongest one — the result shape of the since-deleted `useAdaptiveExercise` hook. The shape itself remains the rule for any validator.

## The canonical Exercise Result

```js
// What a validator must return — this shape already exists and is now consistently
// produced by every useAdaptiveExercise consumer in the codebase (verified: pythagore-3e
// and racines-carrees module families, post cleanup-phase fix).
{
  isCorrect: boolean,        // REQUIRED.
  fields?: { [key: string]: boolean },  // Optional — per-field correctness for multi-input exercises.
                                          // If omitted, the hook treats the whole exercise as one field.
  feedback?: string,          // Optional — a SPECIFIC message for this wrong answer. If omitted,
                               // the hook falls back to the module's generic guidanceSteps hint ladder.
}
```

Any pure validation function must return this shape (never a bare boolean). It says nothing about progression: the kit's question components call `onAnswered(isCorrect)` unconditionally.

## Non-blocking progression — HARD INVARIANT

> **An incorrect answer MUST NEVER block lesson progression.** It is
> pedagogical evidence, not a progression lock. Every validated interaction
> MUST provide targeted feedback and a clear recovery path. The learner MAY
> retry, be guided, see the solution, or continue — retry MUST NOT be
> mandatory to continue.

Violating this is a **RELEASE BLOCKER**.

Four systems, deliberately **decoupled** — a failed validation MUST NOT by
itself imply `nextActivity.disabled = true`:

| System | Question |
| --- | --- |
| **Validation** | is the answer correct? (`{isCorrect, fields?, feedback?}` above) |
| **Feedback** | what reasoning error did the learner make? |
| **Evidence** | what does this tell us about the Learning Point? |
| **Progression** | can the learner continue? |

The Exercise Result shape carries `isCorrect` for validation, feedback and
evidence. It says **nothing** about progression, and no consumer may derive
progression from it alone. Concretely, the kit calls `onAnswered(isCorrect)`
unconditionally; a module completes its step on *answered*, never on
*answered correctly*:

```jsx
- onAnswered={(ok) => { if (ok) setQ2(true); }}   // dead end
+ onAnswered={() => setQ2(true)}
```

An exercise that genuinely warrants retry uses a bounded-attempts component
that ends by revealing the solution and calling `onDone(false)`
(`BuildCheck`, `ProofOrder`) — the way out always exists.

Enforced by `npm run check:non-blocking`, part of `npm run check:lessons`.
Full rule: `LESSON_CONTRACT.md` § Progression non bloquante.

## Answer validation boundary

Two paths exist, one per exercise system (§0). Neither lets the client decide
anything that counts for mastery.

```
IN-LESSON (formative, no evidence)              PRACTICE BANK (evidence)
Student input — component-local state           Student input — PracticeSession
     │                                               │
     ▼                                               ▼
Normalise + parse                               evaluateAnswer (packages/core/practice/
  NumericQuestion  → parseFr (integers)           answerEvaluator.js) — client preview only
  TextbookExercise → parseDec (numeric)              │
  FractionQuestion → Rational.parse                  ▼
  IntegerSetQuestion → parseIntegerSet          SERVER judge (apps/api/…/Practice/Support/
     │                                            AnswerEvaluator.php) — the authority; kept
     ▼                                            equivalent to the JS by the shared fixture
verdict → Feedback (correction always shown)      packages/core/practice/fixtures/answers.json
     │                                               │
     ▼                                               ▼
onAnswered(isCorrect) — the step is done         evidence → versioned mastery engine
whatever the verdict (non-blocking)
```

The final test (`BossFinal`) is a third, choice-only path: the client sends the
picked index (`{ picked }`), the server judges it against the assessment-item
registry (Mastery V2, `LEARNING_ARCHITECTURE.md`).

`packages/core/validation/` (`validateNumericAnswer`, `validateChoiceAnswer`)
still exists and is tested, but no live lesson calls it: its consumers were the
French-era modules and the `useAdaptiveExercise` hook, deleted on 2026-09-25 and
2026-09-29 respectively.

### Student input normalisation — one rule for every parser (2026-09-29)

The interface is Arabic: an Arabic keyboard types « ١٢ », and a writing
convention is never a mathematical error. Every parser of student input
therefore goes through `toLatinDigits` (`packages/core/numberFormat.js`), and
its PHP mirror `Rational::latinDigits`.

| Input | Integer (`parseFr`) | Numeric (`parseDec`) | Fraction (`Rational.parse`) | Integer set (`parseIntegerSet`) |
|---|---|---|---|---|
| Arabic-Indic ٠–٩, Persian ۰–۹ | accepted | accepted | accepted | accepted |
| `.` | only as a well-formed thousands separator (`4.582`); `81.0`, `1.2` → not a number | decimal point | decimal point | only a TRAILING dot is dropped; `1.5` stays a syntax error |
| `,` / Arabic `٫` | `,` → not an integer | decimal separator | decimal separator | `,` `،` `؛` `;` are separators |
| spaces, thin/nbsp | ignored | ignored | ignored | separators |
| `0x12`, `5e1` | not a number | not a number | syntax error | syntax error |
| `{…}`, `\{…\}`, « و » | — | — | — | accepted as set notation / separator |
| `∕` (U+2215) | — | — | read as `/` | — |

Before this rule, `parseFr` deleted every dot (« 81.0 » accepted as 810, « 810.0 »
refused as 8100), refused « ٨١٠ », `Rational.parse` refused « ٣/٤ » as a syntax
error (ending the one-attempt question), and `TextbookExercise` used `Number()`
(accepting `0x12`). Changing a practice parser is a CONTRACT change on both
sides: add fixture cases produced by executing the JS evaluator (never written
by hand) and run `AnswerEvaluatorFixtureTest` in PHP.

**Size bound (2026-10-02).** A `Rational` numerator or denominator may be any safe
integer, up to 2⁵³ − 1 (`MAX_SAFE_COMPONENT` in `rational.js` and `Rational.php`).
Cross-products and sums are computed exactly, in `BigInt` (JS) and `bcmath` (PHP), and a
result whose terms leave the bound is `null`. Before this date the bound was
⌊√(2⁵³ − 1)⌋ = 94 906 265, so a typed answer such as 132 000 000 (unit 6, ex-27: a flow
in L/min) was a `syntax_error` and the bank had to make it a choice question. It is a typed
`rational` again. An answer above 2⁵³ − 1 is still a `syntax_error`, and so is a decimal
with more than 12 places. Fixtures: `rational-large-integer-*`,
`rational-above-max-safe-integer-is-syntax-error`, `rational-max-safe-integer-is-read`.

## Exercise types the contract must support (not force into one component)

Per the phase brief: multiple choice, numeric, fraction, algebra, ordering, matching, interactive manipulation, graphical, free response. The contract above only constrains the **validate → result** boundary — it says nothing about rendering, so `NumberLine`, `OrderingGame`, `InfoSorter`, `AnswerBuilder`, `GroupBuilder`, and free-form `MathInput` remain exactly as different as they need to be. What's shared is only: "however you validate, return `{isCorrect, fields?, feedback?}`."

## Attempt model

> **Outdated (2026-09-20).** The table below says attempts are not persisted.
> That was true for lessons and is **still true for system A**, but the practice
> engine persists them: `practice_sessions`, `exercise_attempts`,
> `question_attempts`, `hint_events`, and `learning_evidence` carry `outcome`,
> `level`, `hints_used` and `misconception_id`. Mastery is a real,
> evidence-driven value in `student_learning_point_progress` — not a completion
> proxy. Read the row below as "for in-lesson exercises only".

### Original text (lessons only)

An attempt should eventually capture:

| Field | Belongs to | Exists today? |
|---|---|---|
| `student` | backend | Identity exists as of Phase 4 (`User` with `role='student'`) but nothing links an attempt to one — Attempt itself is still unimplemented. See §1 of ARCHITECTURE.md. |
| `exercise` / `module` id | frontend, derivable | Yes — module id is known at the call site |
| `answer` (raw student input) | frontend at time of attempt | Yes, but never persisted past the current render |
| `isCorrect` | frontend, derivable | Yes — the Exercise Result above |
| `timestamp` | either | No |
| `attemptNumber` | frontend | `useAdaptiveExercise` tracks `attempts` in memory, but **it's never read by anything and never persisted** — confirmed by grep, unchanged this phase |
| `hintsUsed` | frontend | `hintLevel` exists in the hook's internal state, not exposed or persisted |
| `timeSpent` | frontend | Not tracked anywhere |
| `competency` | backend, once competencies exist | No |

**Decision for this phase:** do not add an `attempts` table or start persisting attempt-level data. The reason isn't that it's unimportant — it's the single biggest gap for the eventual mastery/analytics system — but adding persistence for it means designing the backend attempt model *and* wiring a sync boundary, which is explicitly future-phase work (dashboards, mastery engine, analytics — §23 of the brief). What this phase does instead: make sure the frontend already computes every field above in a form that's trivial to send once that boundary exists (the Exercise Result shape carries `isCorrect`; `useAdaptiveExercise`'s `attempts`/`hintLevel` are already there, just unexposed). No architecture decision made now would need to be undone to add this later.


## Phase 8 additions (2026-09-18)

- **`answerType: 'integerSet'`** — a set of natural numbers (« عيّن كل قواسم العدد 84 »). Free separators, Arabic-Indic digits accepted; order and duplicates ignored; a strict subset is `partially_correct`. Evaluator `packages/core/practice/answerEvaluator.js` (`parseIntegerSet`), widget `features/practice/inputs/IntegerSetInput.jsx`.
- **`evaluationPolicy.requiredForm: 'irreducible'`** is now **enforced** for `rational`: a value-equal but non-reduced fraction yields `partially_correct` with `feedbackKey: 'notIrreducible'` (`feedback.notIrreducible`). A **decimal** (`1,75` for `7/4`) is not an irreducible fraction either: it is `partially_correct` / `notIrreducible` too, unless the value is an integer (2026-09-24 answer audit; JS and PHP evaluators and the fixture).
- **`content/practice/policy.json`** — per-lesson coverage minimum with a named source, read by `validate-exercises.mjs` (invariant 12). The default 3 × 5 is unchanged for every other lesson.
- **`metadata.source`** — textbook provenance of an exercise file, read by `scripts/check-textbook-coverage.mjs`.

## Mastery V2 additions (2026-09-24) — metadata for large and generated banks

All optional, all validated by `validate-exercises.mjs` and the schema:

| Field | Level | Meaning | Read by |
|---|---|---|---|
| `templateId` | exercise | the family shared by VARIANTS (other numbers/context, same primary learning point and `answerType` per question — enforced) | mastery engine (`variant` demonstration), selector |
| `variantOf` | exercise | provenance: the exercise this one varies | nobody (audit) |
| `generator: {tool, version?, seed?}` | exercise | provenance of a GENERATED exercise | nobody (audit) |
| `difficulty` (1..5) | question | when a question is easier/harder than its exercise's level (default: the level) | assessment-item registry → mastery engine |
| `cognitiveDemand` (`recall`/`apply`/`transfer`/`reason`) | question | explanation only — never a weight | explanation |

**A generated exercise needs nothing else.** If it passes
`npm run validate:exercises -- --strict` and `smarter:import-content-registry`,
it is mastery-ready: the registry indexes its questions (learning points,
roles, difficulty, template, answer key) and the engine handles it without a
line of code. Measured on synthetic banks of 15 → 2 500 exercises: validation
0.20 s → 0.32 s, registry export 1.2 s → 1.6 s, and every hot request (answer
write, profile, class × LP, replay) issues the same number of queries
(`tests/Feature/Scale/MasteryScaleTest.php`). `SMARTER_PRACTICE_ROOT` lets both
scripts read a synthetic bank.

## Answer-key integrity (2026-09-24 answer audit) — permanent checks

An answer key is content, and content can be wrong. Three gates, none of which
trusts the configured key:

1. **Round trip** — `validate-exercises.mjs` (`checkAnswerKeyRoundTrip`) runs
   every practice question through the real `evaluateAnswer`: the key must be
   accepted, **every** choice distractor must be rejected, and no
   `misconceptionSignature` may itself be a correct answer.
2. **Independent oracle** — `scripts/practice-answer-oracle.test.mjs` recomputes
   the answer of every constructed-answer 4AM practice question from the
   mathematics (its own gcd, divisor lists, reduced fractions, searches) and
   asserts the evaluator accepts it and the configured key equals it. A new
   constructed-answer question **fails the test until it gets an oracle entry**.
   It also pins the reported case (`qasim-adad-tabii` l3-001 q2: only A).
3. **Lesson keys** — `validate-lessons.mjs --strict` checks, in live `moyen/`
   lessons, that every assessed option object and every `<TapQuestion>` has an
   explicit `correct` index inside its option range (no silent default to 0).

4. **Option order in the final test** (2026-09-29) — authors put the right
   answer first (36 of the unit's 45 final-test keys were index 0, so always
   clicking the first option scored ≈ 80 % on the only source of mastery
   evidence). `BossFinal` now shows every question's options in a stable,
   per-question DISPLAY order (`optionOrder(id, n)` in
   `lessons/common/kit/testPresentation.js`, seeded by the question id: the same
   order on the student page and on the board). The picked index, the stored
   attempt, the evidence and the registry `correct` all stay in the AUTHOR's
   index space — write `correct` as the index in your `options` array, as
   before. `keepOrder: true` on a question keeps the written order (a scale, a
   « صحيح / خاطئ »).

Writing rules the audit enforced: a distractor must be **false**, not merely
"not the textbook's argument" (a second valid proof is a second right answer);
a bound in a statement must say whether it is strict (`40 < a < 55`); a
question that asks for an intermediate form (« بعد القسمة على 4 ») is a choice,
not a `rational` (which would accept every equal value).

## A practice question may be served alone — the daily challenge (2026-09-25)

The daily challenge (`DAILY_CHALLENGE.md`) picks single QUESTIONS from the
practice bank and serves each one alone: the exercise `statement` (text +
`visual`) above the question `statement`, rendered by the same
`QuestionRenderer`. Consequences for authors: a question should be
answerable from the exercise statement and its own text (a question that
needs the answer of the previous question reads badly out of context);
`feedback.correct` is shown as the one-line explanation after the verdict,
so it should explain, not just congratulate. For the challenge the server
serves the question **without** its answer key (`expectedAnswer`, choice
`isCorrect`, signatures, hints, feedback) and reveals the correction only
after the answer — the practice player still receives the full JSON (D5).
Exercises with an interactive `support` lab are not excluded by the
selector; none exists in the live bank.

## Platform-generated practice exercises (2026-09-30)

For unit 2 « الحساب على الجذور » the owner asked for **10 exercises per level ×
5 levels = 50 per lesson**, generated by the platform to test each learning
point (the textbook alone cannot supply them). They are declared, never passed
off as the textbook:

- `metadata.source = { type: "platform_addition", reason: "practice_generation",
  learningPoint: "<the primary LP>", modelledOn: "<an extraction element of the
  SAME lesson, or null>" }`, title « تدريب — <topic> »;
- the lesson's `policy.json` entry says `minPerLevel: 10` with a source naming the
  textbook AND the generation (six lessons of unit 2);
- every rule of this contract still applies: one primary LP per question and
  every LP of the lesson primary on ≥ 8 questions; a real difficulty ladder
  (L1 recognition → L5 problem situations); distractors false and tagged with a
  `misconceptionId` (unit-2 ids added to `misconceptions.json`); graded hints
  that never reveal the answer; each question standing alone; an ORACLE entry
  recomputing every answer (`scripts/practice-answer-oracle.test.mjs`);
- `check:textbook` ignores `modelledOn` (it is not a citation), so a generated
  exercise never counts as coverage of a textbook element.

**Unit 3 « الحساب الحرفي » (2026-10-01)** follows the same rule (four lessons ×
50). Algebra adds one constraint: the bank uses only `choice` and `rational`. A
quadratic, a factored form or an intermediate form is a `choice` whose every
distractor is FALSE as a polynomial (proved in the oracle with an exact
polynomial comparison); a typed answer is a number — a coefficient of the
reduced expansion, a value for a given x, a mental-calculation result.
`affine` is not used: its two-field input is labelled slope / intercept, which
reads wrongly for « the coefficient of x in an expansion ». Oracle entries are
per lesson in `scripts/practice-oracle/<lesson>.mjs`, built on the independent
calculator `scripts/practice-oracle/helpers.mjs`.

**Unit 4 « معادلات ومتراجحات » (2026-10-01)** follows the same rule (five lessons × 50, 250 exercises,
`choice` and `rational` only). An equation's solution is a `rational` (exact fractions accepted through
`Rational.parse`); an equation WITHOUT solution, a solution SET (two roots of a zero product), an inequality's
solution set or its number-line picture is a `choice` whose every distractor is false — the oracle checks a set
of roots exactly and replays a modelling story by brute force; a typed inequality answer is a NUMBER (the bound,
the largest whole number of messages, the first whole number of sessions). A QCM item with two correct options
(textbook « أؤكّد تعلّماتي » 5 and 7) becomes, in the bank, ONE choice whose options are combinations
(« (1) و (3) »), and in a lesson a « يحقّق / لا يحقّق » batch.

**Unit 5 « جمل معادلتين » (2026-10-01)** — four lessons × 50, 200 exercises, and the FIRST bank to use
`answerType: "point"`: a system's solution is a ثنائية, typed in the textbook's order as
`"expectedAnswer": { "x": "13", "y": "19" }` (exact fractions `"-1/2"`, `"68/19"`, decimals with a comma accepted
through `Rational.parse`; one right number is `partially_correct`). The student types it in `PointInput`, whose
row is isolated `dir="ltr"` since that day (an RTL flex row drew « ) y ; x ( »). `answerFormat` names the shape
(« الثنائية (x ; y) ») and never the values. The oracle gives a point as `P(x, y)` and recomputes it with
`solve2` (Cramer in exact rationals, `scripts/practice-oracle/helpers.mjs`, independent of
`packages/core/arithmetic/linearSystem.js`) or by replaying the story by brute force; the oracle test checks that
the content's key EQUALS the recomputed pair (not only that it is accepted). « Which system translates the story »
items are `choice`, each option an equation re-read in the oracle (exactly one must give the story's pair); a
textbook QCM with two or three correct options becomes ONE choice among combinations, and in a lesson a
« صحيح / خاطئ » batch. In-lesson answers use `TextbookExercise`'s `interaction: 'pair'` (`PairQuestion`, same
evaluator; `names: ['a', 'b']` for the textbook's (a ; b) and (d ; t)). New misconceptions: `MISC-JUMLA-*`,
`MISC-TAWID-*`, `MISC-JAM-*`, `MISC-TAKHFID-NISBA` (`content/practice/misconceptions.json`).

**Unit 14 « الهندسة في الفضاء » (2026-10-05) — figures in SPACE, values with π.** A `statement.figure` may be a figure of space:
`{ kind: 'space', … }` is drawn by `SpaceFigure` (`lessons/common/components/SpaceFigure.jsx` + `spaceFigure.js`: 3D points with z up,
an orthographic view, spheres with their equator, polyhedra from faces, vertical cylinders / cones / frustums, circles, planes, sections,
segments — the textbook's convention: SEEN lines solid, HIDDEN lines dashed, computed from the view) and validated by `validateSpaceFigure`
(`ExerciseStatement` and `validate-exercises.mjs` dispatch on `kind`); every bank figure passes `spaceFigureQuality(fig)`. A value « بدلالة π »
is either a `choice` (36π vs 12π, 4π/3 …, distractors = the formula errors `MISC-MISAHA-*`, `MISC-HAJM-*`) or a `rational` asking the
COEFFICIENT k of kπ, the statement saying so; a rounded area / volume is `rational` with the rounded key (unit 10's rule); an exact surd radius
(√119/4, 2√3) is a `choice`. The oracle recomputes with `Math.PI` and its own formulas, never `packages/core/arithmetic/space.js`.
Misconceptions `MISC-KURA-*`, `MISC-MISAHA-*`, `MISC-HAJM-*`, `MISC-MAQTA-*`, `MISC-TAKBIR-*`, `MISC-MABTUR-*`, `MISC-MURAKKAB-NISF`,
`MISC-TADWIR`, `MISC-WAHDA`, `MISC-SAA-WAHDA` (each lesson's author added its own: the reverse calculations `MISC-MISAHA-JADHR` / `-RUB`,
`MISC-HAJM-JADHR`, the ratio taken from the base `MISC-MAQTA-NISBA`, `MISC-TAKBIR-BUUD` / `-JADHR`, the forgotten ⅓ `MISC-MABTUR-THULTH`…).

**Units 11–12 « الأشعة » (2026-10-04) — vectors in statements, components as pairs.** A `statement.figure` may carry
`vectors` (arrows), `grid` (squared paper), `axes` (the repère), `arcs` (semicircles) and `circles`, and every bank figure passes `figureQuality(fig)` (no strip, no colliding label — the owner's
figure rule, LESSON_DEVELOPMENT_GUIDE §5); a coordinate figure may instead be `visual` (CoordPlane `arrows`). A pair of components or of
coordinates is `answerType: "point"` (unit 5's type); an exact distance (√13, 3√2) is a `choice`, a rounded one `rational`; a vector
expression (« AB + BC = ? ») and a nature (« ما طبيعة الرباعي؟ ») are `choice` with meaningful false distractors. Misconceptions
`MISC-SHUAA-*` (unit 11) and `MISC-MAALAM-*` (unit 12).

**Unit 10 « حساب المثلثات في المثلث القائم » (2026-10-04) — approximate and exact values, without a new answer type.**
Trigonometry answers are of two natures. A **rounded value** (BC ≈ 5,92 cm, x ≈ 43°) is `answerType: "rational"` whose key is the
ROUNDED number (`"5.92"`), the statement stating the precision (« المدوّر إلى الجزء من 100 », « إلى الوحدة ») — rounding is the skill
assessed, so 5,915 is wrong; its oracle recomputes the value with `Math.sin/cos/tan` in degrees and rounds it with its own code (never
`packages/core/arithmetic/trigonometry.js`). An **exact surd** (3√13/13, √21/5, 10 cos 55°) has no answer type: it is asked as a
`choice` whose distractors are the meaningful errors (inverted ratio `MISC-MUTH-NISBA-MAQLUBA`, the wrong side, the forgotten root
`MISC-MUTH-JADHR-NASI`, the impossible value > 1 `MISC-MUTH-AKBAR-MIN-WAHID`). An exact rational ratio (4/3, 35/37) stays `rational`.
The unit's misconceptions are `MISC-MUTH-*` (`content/practice/misconceptions.json`).

**Unit 9 « خاصية طالس » (2026-10-02) — a statement may carry a drawn GEOMETRIC FIGURE.** Geometry exercises
depend on a figure, and the practice player had only `visual` (a `CoordPlane`: a repère with axes). An exercise
statement may now carry **`statement.figure`**, a DECLARATIVE figure drawn in SVG by the shared
`lessons/common/components/GeoFigure.jsx` (data model and layout in `geoFigure.js`):

```json
"figure": {
  "points": { "A": [0, 4], "B": [-2, 0], "C": [3, 0], "M": [-1, 2], "N": [1.5, 2] },
  "segments": [["A", "B"], ["A", "C"], { "from": "B", "to": "C", "label": "10" },
               { "from": "M", "to": "N", "label": "x", "arrows": 1 }],
  "ariaLabel": "مثلث ABC و (MN) يوازي (BC)"
}
```

Points are named, in free units with y UP; `segments` (label, `ticks` 1–3 for equal lengths, `arrows` 1–2 for
parallels, `dashed`, `bold`, `tone`), `lines` (`through` two points, `name` « (d) », `extend`), `rays`,
`polygons` (tinted triangles), `rightAngles` (`[a, vertex, b]`), `angles` (`at`/`from`/`to`, `label` « 40° »),
`labels` (forced label directions), `hidden` (helper points), `ariaLabel` (ARABIC, required), `maxWidth`,
`caption`. Point names and lengths are LTR text inside the SVG. It is rendered by `ExerciseStatement` (practice
player, daily challenge question and review — the server's `ChallengeQuestionPresenter` passes `figure` like
`visual`), and `validate:exercises` runs `validateGeoFigure` on it (unknown key, unknown point, unknown tone or a
missing Arabic `ariaLabel` fail). **Rule:** a statement that says « في الشكل المقابل » / « لاحظ الشكل » carries a
`figure`; otherwise everything the question needs is stated in words. Lessons use the same component for the
textbook's figures (one drawing language for the lesson and its bank).
Inside a `<p>` (a `BossFinal` question prompt) pass `inline`: the figure renders as `<span>` blocks instead of
`<figure>`/`<figcaption>` (otherwise React reports invalid DOM nesting). Labels are drawn at 13–14 px on a layout normalised to
~300 units, so keep `maxWidth` close to the figure's natural width (≥ ~300 px) — a smaller box makes the letters unreadable. The
unit-9 banks generate their `statement.figure` from the lesson's own `content/figures.js` (one drawing source for lesson and bank).

The four unit-9 banks (4 × 50 exercises, `rational` and `choice`) test the REASONING of a figure or a construction: equal ratios,
a fourth proportional, k and reduction / enlargement, « parallel or not » with the order of the points, how many equal marks, which
mark to join, AM/AB from MA/MB, inside or outside the segment, a constructed length (√ compared on exact squares in the oracle).
New misconceptions `MISC-TALIS-*` (`content/practice/misconceptions.json`): the segment instead of the side in a ratio, an inverted
ratio, adding instead of multiplying by k, k inverted, the area multiplied by k, Thales without parallels, the forgotten order
condition, equal approximations as a proof, marks counted instead of parts, MA/MB vs AM/AB, the diameter for the radius, a result
unfit for reality, and the synthesis / construction ones added by their authors.

## Non-textbook sources — worksheets (2026-09-24)

The textbook is the default source, but the owner may bring **other official
exercise sheets** (first case: « سلسلة التفوق رقم 01 », BEM 2021,
`docs/official-exerices/exercices-aadad-tabiiya-natiqa.pdf`). Such a sheet is
integrated into the **practice bank** under its own provenance, never passed
off as the textbook:

1. **Provenance file** `docs/sources/<grade>/<unit>/worksheet-<id>.json`:
   `worksheetId`, title, file, and one entry per element (`ws01-ex-05`,
   `ws01-sit-07`…) with its `destination {lesson, exercise}`, an `adaptation`
   note when the wording had to change, or `destination: null` +
   `notIntegrated` with the reason.
2. **Each exercise** cites it: `metadata.source = {type: "worksheet",
   worksheetId, elementId, section, number}`; title « سلسلة التفوق، تمرين n —
   <topic> » (same « n — topic » form as textbook titles, which the session
   header splits at the dash).
3. **Destination** = the lesson whose learning point the item practises;
   integration situations (« وضعيات ») go to the unit's synthesis lesson
   (`wadiya-idmajiya-aadad`, LP `…_P1`), whose practice is activated in
   `active.json` with a named `policy.json` source.
4. **Checks:** `check:textbook` verifies both directions (every element has
   one destination or a reason; every cited element exists; worksheet ids are
   never mistaken for textbook ids — mutation-tested); every constructed
   answer gets an **oracle** entry; `validate:exercises --strict` round-trips
   keys and refuses hints that reveal the answer.
5. **The sheet is not trusted either.** Where its mathematics is ambiguous the
   wording is corrected and declared (`adaptation`): «بين 25 و 40» written
   `25 < a < 40` (inclusive reading gives 3 answers); «جد العدد x» asks for
   all values (15 **and** 30 satisfy both divisions); «جد x» → «جد d» (the
   named unknown). An item outside the unit's learning points (scientific
   notation, ex. 14 q2) is **not integrated** rather than tagged with a wrong
   learning point.
6. **Going live:** imported exercises are born `draft` in `practice_exercises`;
   publishing is an admin act. The server caches `active.json` and the
   exercise index (`practice.cache_ttl`, 1 h): the deploy runs
   `cache:clear`; locally run `php artisan cache:clear` after adding files.

### Which exercise next — the selector (Mastery V2)

`GET /practice/sessions/{id}/next` → `{exerciseId|null, reason, candidates}` from
`App\Domain\Practice\ExerciseSelector`, which READS the Learning Point states and the registry
and never writes mastery (and the engine never calls it). Ranking inside the session's level:
weakest primary point (gap > reinforce > unassessed > stale mastered > mastered) → exercise never
seen → template never succeeded → targets a recent misconception → stable tie-break seeded by the
session. Cost is one level of one lesson (10 queries at 15 and at 2 500 exercises). The client
(`features/practice/nextExercise.js`) falls back to content order when the call fails or
`practice.selector_enabled=false`, ends the session on `exerciseId: null`, and shows
`practice.selectedBecause.*` for `weak_learning_point` / `recent_misconception`.


## The practice player — screen contract (2026-09-24)

`pages/student/practice/PracticeSession.jsx` is **one** page and keeps **one**
exercise state (the React state it already had: question index, answer,
evaluation, hints, busy). The redesign added presentation only; the API calls,
the server verdict, the non-blocking invariant and the notebook are unchanged.

**Layout (second pass, 2026-09-24).** The page is full screen width with a
gutter of 60 px from 640 px up and 20 px on phones (`.sa-page.sa-page--flush`,
`index.css`; ×3 at the owner's request 2026-09-25, 20 px at every size before;
no max-width) and `py-6 sm:py-8` vertically — the SAME frame on the hub, the
player, the summary (« الحصيلة ») and the daily challenge (owner request,
2026-09-25; the summary used the wider 40/60 px gutter before). Mobile/tablet: one column — Learning Point module → exercise header
(level · level name · estimated minutes · tags, `h1` title) → statement
(«نصّ التمرين») → question history → current-question card → footer. From
`xl` (1280 px): ONE side column (28rem, 30.6rem at `2xl` — widened ×1.7 at the owner's request, 2026-09-24; sticky) at the
start edge holding the Learning Point module and «سياق السؤال»
(`QuestionContextPanel`: every question — done with the student's answer,
current, upcoming as «سيظهر بعد السؤال n» without its statement); the exercise
takes all the remaining width. In وضع القسم the grid collapses
(`[[data-sa-classroom]_&]:block`) and the side column is `ClassroomHidden`.
Each fact appears once: the question/exercise position lives only in the
card header (`SessionProgress`: «السؤال n من N» is the card's `h2`, N = the
questions of THIS exercise, with one tone-coloured segment per real question,
and «التمرين n من N» of the level); the « what's left » sentence is `sr-only`
(`aria-live`). The first pass's third column (question squares, session
correct-count tile, SVG encouragement) and the «تذكّر» card were removed as
duplicates.

**The Learning Point module (`LearningPointProgress.jsx`).** Always on top: the
eyebrow «الكفاءة», the point's name (the primary Learning Point of the
**current question** — 25 of the 85 4AM exercises mix points —,
`currentLearningPoint()`), a **star path** and two counters.

- *Stars = the real Mastery V2 state*, never an invented score: three stars
  joined by a line, lit by `masteryStage()` — `unassessed` 0, `gap` 1,
  `reinforce` 2, `mastered` 3 — labelled with `student:mastery.*`. The next
  star has a dashed ring (the stage in progress); a star that lights up fills
  with a small spring (off under reduced motion).
- *Counters = activity*, in completion words only («تمارين أنهيتها», «أسئلة
  أجبت عنها» — never إتقان/متحكَّم, ARABIC_RTL_CONTRACT): exercises completed /
  total and questions answered / total, **separately**, from the overview's
  `learningPoints[].practice`.
- Refreshed (overview re-fetched) after every recorded answer and every
  completed exercise; a failed fetch never blocks the session. Below `xl` the
  name clamps to two lines (full name in `title`) and stars + counters share
  one row.

**Refusals of `GET /lessons/{code}/practice/overview` and `POST
/lessons/{code}/practice/sessions` (2026-09-25).** Status 422 (the content-access
convention shared with the final test and the evidence routes) with a closed
`code`: `practice_unavailable` — the lesson is not in
`content/practice/active.json` **as the server reads it** — or
`lesson_unavailable` — `ContentAccess` refused (tier, publication, hidden by
the teacher). `PracticeHub` renders `student.json` →
`practice.unavailable.{code}`. Unknown lesson → 404, guest → 401. The server's
copy of `content/practice/` is shipped and fingerprint-checked by the deploy
(`smarter:practice-doctor`, `docs/deployment/DZ_FIRST_DEPLOYMENT.md`); a missing
`active.json` is never cached. `PracticeOverviewTest` locks all of it.

**`GET /lessons/{code}/practice/overview` — `learningPoints[].practice`**
(additive, 2026-09-24): `{exercises, exercisesCompleted, questions,
questionsAnswered}` from `App\Domain\Practice\LearningPointPracticeProgress`.
An exercise belongs to a point when at least one of its questions has it as
**primary**; `questions` is the sum of the REAL question counts of those
exercises (4 + 6 + 3 = 13 — never exercises × a fixed number); an exercise is
completed when one of the student's `exercise_attempts` in this lesson is
`completed`; a question is answered when one of their `question_attempts` on it
has `submitted_at` (right or wrong — correctness belongs to mastery). The same
content index as the level counters; no mastery is computed here. Pure core
`tally()` tested in `tests/Unit/Practice/LearningPointPracticeProgressTest.php`
(scenarios: 4+6+3, five uneven exercises, 0 / 1 / all completed, mixed points).

**The practice home (`PracticeHub.jsx`, levels page) — same language.** Same
frame (`.sa-page--flush`, 20 px, full width). Header: «التمارين» eyebrow, the
lesson title (`h1`), «راجع الدرس» as a tertiary link. An open session is one
row with the page's only solid button («واصل»). The five levels are a
**path** (`LevelSelector.jsx`): one row per level joined by a rail — node
(number / ✓ done / 🔒), «المستوى n · name», a bar with `completedCount /
exerciseCount` isolated LTR («تمارين أنهيتها»; the former «{{done}} من
{{total}}» inside `dir="ltr"` rendered «0 1 من»), the مُقترح / مكتمل chip and
«ابدأ» / «تمرّن من جديد». A locked row is not a button and says which level
unlocks it. The lesson's Learning Points reuse **the same
`LearningPointProgress` module** as the player (star path + the two counters,
`eyebrow={false}`, `h3`), with the `reinforce` reason / `mastered` freshness
under it; from `xl` they sit in a 30.6rem column at the start edge, below
`xl` after the levels (choosing a level is the page's action).

**Button hierarchy.** One solid primary at a time: «تحقّق من إجابتي» before
the answer, then «السؤال التالي» (outline/secondary — disabled — until an
answer is checked). Secondary: «أعِد المحاولة». Tertiary (text + icon, no
fill): «إرشاد», «السؤال السابق», report. The notebook is not in the card: it
is the lesson's floating « 📓 كرّاسي » pill (see `NOTEBOOK.md`), and the
question footer keeps its end (`lg:pe-36`) clear for it.

**Question history — derived, never a second store.** When the student leaves
a question with «السؤال التالي», `historyEntry()`
(`features/practice/questionHistory.js`, pure, tested) snapshots what the page
already holds: question id/number/statement, the student's answer formatted
per `answerType` (`formatAnswer`: typed answers stay the student's own
writing, isolated LTR, never fed to KaTeX; a QCM shows the choice's content),
the **displayed** (server) verdict and its tone, `misconceptionId`, the
feedback message, hints used, and `retried` (validated more than once — the
server counted only the first answer). Entries are replaced by question id
(`recordQuestion`, idempotent) and reset when the next exercise loads. The
previous question renders as the «السؤال السابق» card (full statement, answer
in a read-only box, verdict in words, feedback behind «عرض التوضيح»); older
ones as one-line collapsed rows below `xl` and in «سياق السؤال» from `xl`.
Nothing about the **current** question's solution is shown anywhere.

*Not persisted:* the server re-opens an exercise at question 1 after a reload
(new attempt UUIDs), so the history starts empty again — it mirrors what the
player shows, and inventing a client-side cache would diverge from the
server's attempts. `Not yet implemented`: resuming mid-exercise.

**One tone table.** `outcomeTone(outcome)` maps the six outcomes to
`correct | partial | incorrect | neutral`; `features/practice/toneStyle.jsx`
gives each an icon (✓ ◐ ✕ ?) and colours. An incorrect answer is **orange**,
never alarm red, and colour is never the only signal (icon + label
everywhere). Feedback, history, context column and progress segments all use
it.

**Interaction rules.**

- The answer area is a `<form>`: Enter in a field validates; choices and
  bracket toggles are `type="button"`.
- After validation, focus moves to the feedback (`tabIndex=-1`,
  `role="status"`), because the button that had it disappears.
- «أعِد المحاولة» **keeps** the answer so the student corrects it, and
  returns focus to the field.
- The hint panel is one collapsed line («💡 الإرشادات · 3 إرشادات متاحة») until
  a hint is requested; it opens itself on the first hint and resets per
  question.
- Hints stay available after an **incorrect** verdict (the server accepts a
  hint on an answered attempt; evidence is already recorded, so this cannot
  farm mastery). They close after a correct one; revealed hints stay as a
  trace. `HintPanel` shows the ladder: revealed / next (the only request
  button) / locked slots labelled by `type` (ملاحظة · توجيه · خطّة الحلّ),
  never by content.
- «السؤال التالي» lives in a footer, disabled only until an answer is checked
  — right or wrong (non-blocking). «السؤال السابق» scrolls to the previous
  card: it re-reads, it does not re-open an attempt. The footer is sticky
  above the mobile tab bar except on very short screens (landscape phones).
- The previous question is a compact summary (number, verdict in words, the
  student's answer, the statement clamped to two lines; «عرض التوضيح» unfolds
  the statement and feedback) — no large card for finished work.
- Arrival (`QuestionArrival.jsx`): on «السؤال التالي», tall screens scroll the
  «السؤال السابق» summary to the top (context, then the question); phones scroll
  to the current card. Focus goes to the answer field on a fine pointer and to
  the question heading on touch (no virtual keyboard popping over an unread
  question). New exercise: top of page, focus on the `h1`. Nothing scrolls in
  وضع القسم. `prefers-reduced-motion`: instant scroll, and framer-motion runs
  under `MotionConfig reducedMotion="user"`.
- Exercise completion shows «أتممت هذا التمرين · الإجابات الصحيحة: n / N»
  (`exerciseScore`) — the only celebration; no confetti per question.
- Buttons in the card carry an explicit text size: inside the classroom frame
  an inherited size is `1rem × scale`.

Tests: `questionHistory.test.js`, `QuestionHistory.test.jsx` (history, context
column, hint ladder without leaks), `learningPointProgress.test.js`,
`LearningPointProgress.test.jsx` (scenarios A, C, D, E; no mastery word in the
counters), `notebookAvailability.test.js`, `pageFrame.test.js` (`--flush`);
browser: `e2e/lesson-kit/practice-progress.mjs` § 3bis, § 6 (history on
`wadiya-idmajiya-aadad`, «الدنّان») and § 7 (the Learning Point module equals
the server's overview row).
