# AI Lesson Contract

The contract every future lesson — human- or AI-authored — must honor for the
learning-intelligence system to work. Sibling to `EXERCISE_CONTRACT.md` (which
governs the validate → result boundary); this document governs **pedagogical
staging and assessment metadata**.

## What an AI lesson generator receives

- Grade, chapter, lesson (codes from `coursesData.js`).
- The lesson's `learningPoints` array: `[{id, title, order}]`, e.g.
  `{id: '6e_resolution-problemes-1_P3', title: 'Modéliser une situation (…)', order: 3}`.

## Absolute rules

1. **Never invent a learning point id.** Only ids from the lesson's
   `learningPoints` array may appear in `assessment.learningPointIds`. The
   validator rejects unknown ids; the API rejects them at submission time.
2. **Every learning point must end up with ≥ 1 genuine assessment question.**
   "The lesson mentions it" or "a practice question uses it" does not count —
   the question's answer must provide meaningful evidence about that specific
   competency. If no existing question qualifies, generate one and integrate
   it into the challenge / final-evaluation section.
3. **Questions stay in JSX.** No question content in MySQL, ever.
4. **Do not force bad mappings.** A question maps to the learning point(s) it
   actually measures — normally one primary learning point; several only when
   it genuinely evaluates several distinct competencies. When uncertain,
   classify the question as practice and write a better assessment instead.

## The textbook owns the mathematics; the platform owns the experience

**Permanent product principle (2026-09-20).** A generated lesson must never
turn a textbook activity into a manipulation by copying its story. The pipeline
is:

```
textbook activity
   ↓  extract the mathematical objective        ← never changes
   ↓  extract the mathematical structure         ← never changes
   ↓  extract the intended discovery             ← never changes
   ↓  judge the textbook's CONTEXT for engagement and interactivity
   ↓  keep it · adapt it · or choose a better age-appropriate one
   ↓  generate مبتدئ and متقدم (both, always)
   ↓  choose the visualisation technology (reuse before adding a dependency)
   ↓  validate mathematics · interaction · age-appropriateness
```

Two fidelities, and only one is absolute:

- **Mathematical fidelity — non-negotiable.** Concept, definition, property,
  method, notation, vocabulary, progression, expected outcome. All from the
  textbook; all unchanged. Arithmetic comes from `packages/core/arithmetic/`.
- **Contextual fidelity — negotiable, never silent.** A situation may be
  replaced when the mathematical structure and the objective survive intact,
  the replacement introduces no ambiguity, and it is age-appropriate.

Every levelled manipulation therefore carries its traceability in
`lesson.config.js` — where the mathematics came from, what was adapted, and
why:

```js
{ level: 'beginner',
  objective: '…',                  // identical at both levels
  autonomy: '',                    // required and non-empty on 'advanced'
  experience: { type: 'platform_context',
                reason: 'smaller_numbers_for_first_contact', theme: 'football' },
  sourceElementIds: ['act-1'] }
```

`validate-lessons.mjs` **fails the build** on a missing level, divergent
objectives, an `advanced` level with no declared `autonomy`, an adapted context
with no reason from the closed list, or a levelled manipulation citing no
textbook element. The vocabularies live in
`packages/core/curriculum/manipulationLevels.js`; the full rule is
[`MANIPULATION_CONTRACT.md` §7bis-levels](./MANIPULATION_CONTRACT.md).

**Do not force a context.** When the textbook's situation is already
manipulable and the drawing *is* the argument, both levels keep it and only the
cognitive demand changes. A theme bolted onto a list of divisors makes the
mathematics harder to see, not more engaging.

## Non-blocking progression — HARD INVARIANT for every generated lesson

A generated lesson inherits this rule automatically. It is **normative**, and
a violation is a **RELEASE BLOCKER**:

- The generated lesson **MUST** allow progression after incorrect answers.
- The generated lesson **MUST NOT** create correctness-gated progression.
- The generated lesson **MUST** provide targeted feedback after errors
  (`explain` / `explainWrong` / `explainFor` naming the actual misconception,
  not just « Incorrect »).
- The generated lesson **MAY** recommend a retry.
- The generated lesson **MUST NOT** require a retry to unlock subsequent
  learning content.
- The generated lesson **MUST** provide a valid continuation path after an
  incorrect answer.

This applies to **every** generated question, in every stage —
`prerequisite_check`, `trigger`, `discovery`, `manipulation`,
`formalization`, `practice_lab` and `evaluation` alike.

Mechanically: the kit calls `onAnswered(isCorrect)` unconditionally and
reveals the correct answer, so a step must be marked done on *answered*, not
on *answered correctly*:

```jsx
- onAnswered={(ok) => { if (ok) setQ2(true); }}   // ❌ traps the learner
+ onAnswered={() => setQ2(true)}                   // ✅
```

Enforced by `npm run check:non-blocking` (in `npm run check:lessons`).
Full rule and the conforming exceptions (replayable manipulations,
bounded-attempt components): `LESSON_CONTRACT.md` § Progression non bloquante.

## Pedagogical staging

A lesson's **modules** follow the canonical learning journey
(`packages/core/curriculum/lessonStages.js`): `prerequisite_check → trigger →
discovery → manipulation → formalization → practice_lab → evaluation`, each
module declaring its `stage` in `lesson.config.js` (see `LESSON_CONTRACT.md`).
Two consequences for question authoring:

- **Enabled assessment questions may only live in an `evaluation`-stage
  module** (validator-enforced through the `modules/<NN>_<slug>.jsx`
  filename convention). Everything before the evaluation is learning — its
  questions never generate evidence.
- **Prerequisite checks never persist.** A `prerequisite_check` module's
  questions are `discovery`/`practice`-typed: they gate and orient the
  student locally, but produce no server-side evidence of any kind.

A lesson's questions belong to one of three roles:

| Role | When | Touches mastery? |
|---|---|---|
| `discovery` | the student is meeting the concept; mistakes are expected | never |
| `practice` | the student is training; scaffolded, hinted, retryable | never |
| `assessment` | challenges / final evaluation; the student demonstrates the competency | **yes — generates learning evidence** |

Judge the role from the question's actual pedagogical function, not its
location: a scaffolded, hint-laden, retry-until-correct sequence is practice
even if it sits in a "Boss Final" module (see the `resolution-problemes`
BossMission for the worked precedent).

## Question metadata

```js
// ASSESSMENT — the only kind that submits evidence
{
  id: 'rp-flash-03',                       // REQUIRED: stable, unique within the lesson
  /* …existing question fields (q/prompt, options, correct, explain, …)… */
  assessment: {
    enabled: true,
    type: 'assessment',
    learningPointIds: ['6e_resolution-problemes-1_P3'],
  },
}

// PRACTICE / DISCOVERY — metadata optional; if present, it must be inert:
{
  id: 'rp-practice-07',
  assessment: { enabled: false, type: 'practice' },   // no learningPointIds
}
```

Rules the validator (`npm run validate:lessons`) enforces:

- `id` is a literal, non-empty string, unique within the lesson.
- `assessment.enabled` is a boolean literal; `assessment.type` is one of
  `discovery | practice | assessment`.
- `enabled: true` requires `type: 'assessment'` and a non-empty
  `learningPointIds` whose every id belongs to **this** lesson.
- `discovery`/`practice` questions must not carry `learningPointIds`.
- `enabled: true` questions must sit inside an `evaluation`-stage module's
  own file (`modules/<NN>_<slug>.jsx`).
- All metadata must be static literals (no computed values) — it is parsed,
  not executed.

This question-level convention **composes with** the existing lesson-level
`assessment: {moduleId, totalQuestions, masteryScore}` block in
`lesson.config.js` (the 3e convention) — that block keeps governing the local
"leçon maîtrisée" label; this one governs server-side evidence. They do not
conflict: the validator distinguishes them by the presence of `enabled`.

## Wiring evidence submission

At the exact point the module already knows correctness (its existing
validate handler), call the shared hook — no new state machine:

```js
import { useEvidenceSubmission } from '…/common/hooks/useEvidenceSubmission';

const { submitEvidence } = useEvidenceSubmission(MODULE_CTX.lessonId);
// in the existing handler:
submitEvidence(question, isCorrect, { picked });   // fire-and-forget
```

`submitEvidence` never throws and never blocks the lesson: failures are
parked in an offline queue and retried on reconnection. Anonymous visitors
generate no evidence.

No lesson is currently built on disk — every catalogue lesson is
`coming_soon`. There is no reference implementation to point to right now;
follow this document and `LESSON_CONTRACT.md` directly when building the
next one.

## Quality bar for generated assessment questions

Appropriate for the grade and lesson; aligned with the learning point;
mathematically correct and unambiguous; solvable with the knowledge expected
at that point — every term and notation in `prompt` or `options`, distractors
included, is either established by an earlier `<KnowledgeBrick>` in the lesson
or listed in `priorKnowledge` and diagnosed by Module 0, declared with
`requires={[...]}`; a definition sitting in `explain`, `correction` or the
`footer` arrives after the demand and does not count (`KNOWLEDGE_DEPENDENCY.md`);
able to distinguish understanding from guessing (distractors encode real
misconceptions); consistent with the lesson's existing UX and
components. For each learning point, be able to answer: what competency, which
question, what success looks like, why the question measures it, and what
misconception a wrong answer reveals (the §26 audit — recorded per lesson in
`docs/reports/LEARNING_POINT_COVERAGE.md`).
