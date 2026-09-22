# Exercise Contract

> **Read § 0 first (2026-09-20).** This document was written for the French-era
> lessons and canonicalised `useAdaptiveExercise`'s result shape. **That hook is
> now dead code** — it, `useSimpleExercise`, `ExerciseValidator`,
> `AdaptiveFeedback`, `GuidedSolution` and `QuizQuestion` reference only each
> other and are imported by no live page. The rest of this document is still
> correct about the **non-blocking invariant** and about what a validator should
> return, and § 0 describes the two systems that actually run.

---

## 0. The two exercise systems that actually exist

| | **A — lesson exercises** | **B — the practice engine** |
|---|---|---|
| Where the content lives | `content/exercises.js` inside the lesson | JSON in `content/practice/<grade>/<lesson>/level-{1..5}/` |
| Rendered by | `TextbookExercise` inside a `ContentModule` step | `PracticeSession` + `QuestionRenderer` in the student space |
| Evaluated by | the kit's question components, or `practice.evaluateAnswer` for `integerSet` and `fraction` | `practice.evaluateAnswer` for every type |
| Persisted | **nothing per exercise** — only module completion | server: sessions, exercise and question attempts, hint events, evidence |
| Touches mastery | no | yes (`assessment_type: 'practice_exercise'`) |

A third source of evidence is the **final test** (`BossFinal`, `evaluation`
stage): MCQ only, writes evidence with `assessment_type: 'assessment'`.

**The live evaluation contract is `practice.evaluateAnswer`** in
`packages/core/practice/answerEvaluator.js`. It returns an **outcome, not a
boolean**:

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
unconditionally, and the controls disable. In the practice engine a retry is
offered but re-uses the same attempt id, so the server treats it as a duplicate
and **only the first outcome counts** toward mastery.

---

Three exercise patterns exist today with no shared contract (`docs/reports/ARCHITECTURE_FOUNDATION_AUDIT.md` §6). This document canonicalizes the strongest one — `useAdaptiveExercise`'s result shape — rather than inventing a fourth. It's based on the actual hook contract in `apps/web/src/lessons/common/hooks/useAdaptiveExercise.js`, corrected during the cleanup phase so every consumer now genuinely honors it.

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

Any pure validation function intended for use with `useAdaptiveExercise` must return this shape. This is not a new invention — it's what the hook has always expected (`useAdaptiveExercise.js`'s own JSDoc); the cleanup phase found and fixed three modules that violated it by returning a bare boolean instead.

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

```
Student Input (raw string/index/value, component-local useState)
     │
     ▼
Normalize   (numberFormat.js: parseDec/parseFr — French/English decimal & integer parsing)
     │
     ▼
Validate    (pure function → Exercise Result, see below)
     │
     ▼
useAdaptiveExercise.submitAnswer()  (orchestration: attempts counter, hint-level state,
     │                                status transitions — NOT pure, lives in the hook)
     ▼
AdaptiveFeedback  (rendering only)
     │
     ▼
useProgress().markModuleCompleted() / .awardXP()   (persistence — NOT pure, localStorage)
```

**This phase's concrete extraction** (`packages/core/validation/` (imported as `@smarter-academy/core`)): two pure functions formalizing the two patterns already duplicated across the exercise-bearing modules —

- `validateNumericAnswer(studentInput, expectedValue, options?)` — wraps the already-proven `parseDec` (numeric parsing) + tolerance comparison + `compareMathExpressions` (algebraic fallback) pattern that's currently hand-duplicated inline in 13+ modules (per the cleanup-phase audit). Returns `{ isCorrect }`, matching the Exercise Result contract exactly, so it drops directly into any `useAdaptiveExercise({ validate: ... })` call.
- `validateChoiceAnswer(selectedValue, correctValue)` — formalizes the equality check `QuizQuestion`/`ChoiceGrid` already do inline, for use anywhere a multiple-choice exercise wants a validator matching the same contract.

**Migrated as the representative example (per the phase brief's incremental-extraction instruction):** `Module02CalculHypotenuse.jsx`'s `validateAnswer` now calls `validateNumericAnswer` instead of duplicating the parse+tolerance+compareMathExpressions logic inline. The other 12+ sites identified in the cleanup audit are **not** migrated in this phase — each needs the same per-site malformed-input spot-check the cleanup phase deferred, and mass-migrating them now would be exactly the "major architectural rewrite because it looks cleaner" the phase brief prohibits.

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
- **`evaluationPolicy.requiredForm: 'irreducible'`** is now **enforced** for `rational`: a value-equal but non-reduced fraction yields `partially_correct` with `feedbackKey: 'notIrreducible'` (`feedback.notIrreducible`).
- **`content/practice/policy.json`** — per-lesson coverage minimum with a named source, read by `validate-exercises.mjs` (invariant 12). The default 3 × 5 is unchanged for every other lesson.
- **`metadata.source`** — textbook provenance of an exercise file, read by `scripts/check-textbook-coverage.mjs`.
