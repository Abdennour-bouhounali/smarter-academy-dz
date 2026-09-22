# Lesson Development Guide — read this before creating a lesson

> **This is the entry point.** Everything here describes the platform as it is
> implemented today, for the Algerian 4AM curriculum. Where a rule has an
> authoritative contract elsewhere, this guide states the rule and links to it
> rather than repeating it — if the two ever disagree, the contract wins and
> this guide is the file to fix.

The live reference is the 4AM textbook unit 1 under
`apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/`:
eight textbook lessons plus one synthesis. Everything under `lessons/college/`
and `lessons/lycee/` is **dormant French content** — not indexed, not mounted,
not a model to copy from. It uses an older per-lesson wiring that the 4AM unit
has since replaced.

---

## 1. Before you start

**Read, in this order:**

1. This guide, end to end.
2. [`../architecture/LESSON_CONTRACT.md`](../architecture/LESSON_CONTRACT.md) — the lesson and module contract, the stage sequence, the unlock rules, and the non-blocking invariant.
3. [`../architecture/INTERACTION_PEDAGOGY.md`](../architecture/INTERACTION_PEDAGOGY.md) — how a concept becomes manipulable. §6bis (the opening manipulation) and §29 (the checklist) are normative.
4. [`../architecture/ARABIC_RTL_CONTRACT.md`](../architecture/ARABIC_RTL_CONTRACT.md) — language, direction, typography, terminology.
5. [`../architecture/KNOWLEDGE_DEPENDENCY.md`](../architecture/KNOWLEDGE_DEPENDENCY.md) — nothing may be demanded before it is taught.
6. The contract for whatever you are actually building: [`MANIPULATION_CONTRACT.md`](../architecture/MANIPULATION_CONTRACT.md), [`EXERCISE_CONTRACT.md`](../architecture/EXERCISE_CONTRACT.md), [`CLASSROOM_MODE.md`](../architecture/CLASSROOM_MODE.md), [`KNOWLEDGE_MAP.md`](../architecture/KNOWLEDGE_MAP.md).

**Then read two existing lessons** (§9 names which and why).

**What you need before writing anything:**

- The **textbook extraction** for the unit. Every pedagogical element of a
  textbook lesson cites `docs/sources/<grade>/<unit>/extraction.json` through a
  `source` object. If the extraction does not exist for your unit, it must be
  produced first — content is never invented, and the textbook is never
  "completed" because it seems incomplete.
- The **catalogue entry**: the lesson must exist in
  `packages/core/curriculum/dz/lessons_4am_2026_2027.json` with its
  `pointsToLearn`, and its unit in `units_4am_2026_2027.json`.
- The **learning point ids**, which are derived, never typed by hand:
  `{gradeId}_{lessonId}_P{n}` in `pointsToLearn` order.

---

## 2. The hierarchy and its words

```
المجال   chapter   (ميدان — a curriculum domain)
  └── الوحدة   unit   (a textbook unit — a GROUP OF LESSONS)
        └── الدرس   lesson
              └── المحور   module   (the engine's word for a module)
                    └── steps / units of presentation
                          └── questions, manipulations, exercises
              └── نقاط التعلّم   learning points
```

**الوحدة is a unit of the textbook, never a module. المحور is a module, never a
unit.** Changing this vocabulary silently breaks four navigation surfaces and
the Classroom Mode toolbar. The one exception is internal: Classroom Mode calls
the slices of a presented module "units" in code (`moduleUnits`), which is a
presentation concept, not a curriculum one.

A lesson's `kind` is `'lesson'` (default) or `'synthesis'` — the unit's
« أدمج تعلّماتي », which is **never counted as a درس**.

---

## 3. Files of a lesson

```
lessons/moyen/4am/<chapter>/<unit>/<lesson>/
├── lesson.config.js     the contract: id, kind, unit, modules, stages, LPs, resources
├── index.jsx            three lines: renders <LessonIndex config basePath />
├── routes.jsx           import.meta.glob of modules/ + buildLessonRoutes(...)
├── moduleContext.js     one line: buildModuleContext(LESSON_CONFIG, LESSON_BASE_PATH)
├── knowledge.jsx        LESSON_KNOWLEDGE — the single source of the lesson's knowledge
├── content/
│   ├── textbook.js      the textbook's own words, each block with its `source`
│   └── exercises.js     the textbook's exercises attached to this lesson
└── modules/
    └── Module<NN><Descriptor>.jsx     one file per module
```

Shared across the unit, in `_unit/`: `unitMeta.js` (ids, Arabic labels, the
`src()` and `addition()` source helpers), `moduleContext.js`
(`buildModuleContext`) and `lessonRoutes.jsx` (`buildLessonRoutes`).

`index.jsx`, `routes.jsx` and `moduleContext.js` are boilerplate. The real work
is `lesson.config.js`, the content files, `knowledge.jsx` and the modules.

### `routes.jsx` — the whole file

```jsx
import { LESSON_CONFIG, LESSON_BASE_PATH } from './lesson.config';
import { buildLessonRoutes } from '../_unit/lessonRoutes';

const MODULE_FILES = import.meta.glob('./modules/Module*.jsx');

export default function myLessonRoutes() {
  return buildLessonRoutes({
    config: LESSON_CONFIG, basePath: LESSON_BASE_PATH, moduleFiles: MODULE_FILES,
    loadKnowledge: () => import('./knowledge'), loadIndex: () => import('./index.jsx'),
  });
}
```

`buildLessonRoutes` resolves each module component by the **number in its
filename**, wraps every page in the knowledge provider and the notebook anchor,
and puts `LessonClassroomShell` above the whole lesson as a pathless layout
route so a Classroom session survives module navigation. You get Classroom Mode
and the notebook for free; do not rebuild either.

> **Two digits, always.** `Module0117Wa18.jsx` is read as module **117**, and
> its route is silently not mounted. This shipped once and was found in
> production.

### `lesson.config.js`

Everything must be a **static literal** — the validators parse this file, they
do not execute it.

```js
export const LESSON_BASE_PATH = '/courses/moyen/4am/<chapter>/<lesson-id>';

export const LESSON_CONFIG = {
  id: 'qasim-adad-tabii',        // = the catalogue id; the progress storage key
  kind: 'lesson',                 // 'lesson' | 'synthesis'
  unit: 'aadad-tabiiya-natiqa',   // must match the catalogue's unitId
  unitTitle: 'الأعداد الطبيعيّة والأعداد النّاطقة',
  sequentialUnlock: true,
  title, description,             // Arabic
  level: 'moyen', grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab', chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4, masteryThreshold: 0.8, emoji: '🔢',
  estimatedDurationMin: 45,       // = sum of module estimatedMin, cap 90
  textbookRef: { unit: 1, activity: 1, pages: '8, 10, 14' },
  skills: [ /* Arabic objectives, shown on the lesson index */ ],
  teachingScope: { include: [...], exclude: [...] },
  knowledgeMap: true,
  priorKnowledge: ['qisma-iqlidiya', ...],   // diagnosed by module 0
  resources: [
    // A LEVELLED manipulation declares its level, the objective both levels
    // share, and where its situation comes from (§6, MANIPULATION_CONTRACT
    // §7bis-levels). Both levels must be present.
    { kind: 'manipulation', code: 'team-builder-15-3', type: 'team-builder',
      module: 1, level: 'beginner', title: '…',
      objective: 'التوزيع بالتساوي: a = b × q + r، والباقي معدوم ⇔ b قاسم لـ a',
      autonomy: '',                     // required and non-empty on 'advanced'
      experience: { type: 'platform_context',
                    reason: 'smaller_numbers_for_first_contact', theme: 'football' },
      learningPointIds: ['4am_qasim-adad-tabii_P1'],
      sourceElementIds: ['act-1'] },
    { kind: 'manipulation', code: 'divisor-explorer-420',
      type: 'divisor-explorer-books',        // a type from the CLOSED registry
      module: 1, level: 'advanced', title: '…',
      objective: 'التوزيع بالتساوي: a = b × q + r، والباقي معدوم ⇔ b قاسم لـ a',
      autonomy: 'سبعة عشر حجمًا دون اقتراح: التلميذ يختار ويقارن محاولاته بنفسه',
      experience: { type: 'textbook', reason: '', theme: 'library' },
      learningPointIds: ['4am_qasim-adad-tabii_P1', '…'],
      sourceElementIds: ['act-1'] },
  ],
  modules: [ /* see below */ ],
};
```

Each module:

```js
{ id: '01', number: 1, slug: 'al-maktaba', path: `${LESSON_BASE_PATH}/al-maktaba`,
  title: 'نشاط 1 — 420 كتابًا في رفوف', desc: '…',
  stage: 'trigger',
  teachesLearningPointIds: ['4am_qasim-adad-tabii_P1'],
  color: 'indigo', style: 'featured',
  estimatedMin: 10, difficulty: 1, actionText: 'أجرّب' }
```

`stage` comes from `packages/core/curriculum/lessonStages.js` and must appear in
journey order across the array:

```
prerequisite_check → trigger → discovery → manipulation
        → formalization → practice_lab → evaluation
```

Required for a `lesson`: `trigger, discovery, formalization, practice_lab,
evaluation`. For a `synthesis`: `trigger, practice_lab, evaluation`.
`prerequisite_check` and `manipulation` are used when the mathematics calls for
them. A lesson with `knowledgeMap: true` formalises continuously through its
Knowledge Map and needs no separate `formalization` module.

`difficulty` is **display only** — nothing reads it to adapt anything, despite
the name.

---

## 4. The shape of a module

A module is one React component built on `ContentModule` from
`lessons/common/kit`. The kit applies the platform's policies by construction;
a module supplies only content and its own `done` booleans.

```jsx
<ContentModule
  ctx={MODULE_CTX} navLinks={getNavLinks(2)} moduleNumber={2}
  moduleTitle="…" moduleSubtitle="…" estimatedTime="12 دقيقة"
  brief={{ tag: 'معارف — الكتاب ص 10', title: '…', tone: 'violet', body: <p>…</p> }}
  // La carte d'activité accepte aussi, tous OPTIONNELS (§4bis) :
  //   headline, emoji   l'accroche de l'expérience (« هيا نلعب كرة القدم! »)
  //   visual            une vignette de contexte, DESSINÉE (jamais raster)
  //   footer            typiquement <SourceTag source={…} />
  intro={<Manipulation type="divisor-explorer" a={143} b={11} … />}
  steps={[
    { num: 1, title: '…', subtitle: '…', done: q1, content: <TapQuestion … /> },
    { num: 2, title: '…', done: q2, content: (kit) => <MyLab react={kit.react} … /> },
  ]}
  footer={<KnowledgeSnapshot moduleNumber={2} />}
/>
```

`ContentModule` wires `useProgress`, the step progress bar, the streak and
effects toolkit, sequential step locking (`isStepLocked` — sequential on the
first pass, all open on a revisit), the "what's left" popover on the disabled
next button, completion, **and** the Classroom Mode unit sequence. There is no
auto-scroll and no auto-advance, ever.

The recurring module roles in the 4AM unit, by their Arabic names:

| Module | Stage | What it is |
|---|---|---|
| `Module00Astaidd` — أستعدّ | `prerequisite_check` | diagnoses `priorKnowledge` only. Never the lesson's own material. Never gates, never persists evidence. |
| `Module01…` — the activity | `trigger` | the textbook activity, opening on the signature manipulation in the `intro` slot |
| `Module02Maarif` — معارف | `discovery` | the textbook's definitions, each laid by a `KnowledgeBrick` at the moment it is needed |
| `Module0xAwazzif` — أوظّف تعلّماتي | `practice_lab` | the textbook's exercises via `TextbookExercise` |
| `Module0xItqan` — إتقان | `evaluation` | the only source of assessment evidence |

**Two rules the evaluation module must follow**, both learned from shipped
defects:

- **The synthesis shows the lesson's knowledge map**, through the component
  that reads the context:
  `synthese={<KnowledgeSnapshot complete variant="complete" />}`. Never
  `<CompleteView />` on its own — it takes its `items` as a prop, so rendering
  it bare produces an empty final screen, which is what nine modules did until
  2026-09-20.
- **A module numbered `0` is a real module** (« أستعدّ »). Anything deciding
  "do I have a module number?" must call `isValidModuleNumber` from
  `@smarter-academy/core`, never `if (moduleNumber)` — zero is falsy, and that
  guard silently dropped module 0's progress, capping those lessons at 80 %.
  The same applies to any value where zero is legitimate: a count, an index, a
  score, a remainder.

### 4bis. The activity card — one component, every module

The card at the top of a module is `MissionBrief` (`common/components/LessonUI.jsx`),
supplied through `ContentModule`'s `brief` prop. It answers four questions, in
this visual order:

| Field | Answers | Required |
|---|---|---|
| `tag` | where does this come from? (pill, top) | no |
| `headline` + `emoji` | what are we doing? (the hook) | no |
| `title` | what idea will we discover? (the objective) | yes in practice |
| `body` | what is the concrete situation? (the textbook's words) | yes |
| `footer` | on what source does it rest? (`SourceTag`) | no |
| `visual` | an optional context vignette | no |
| `tone` | the accent colour (8 available) | defaults to `slate` |

**It is data-driven, never lesson-specific.** No context is coded into the
component: football, a library or flowers arrive through `visual` and the text.
A module that supplies neither headline nor visual gets the same card, plainer
— which is why the 40 existing modules needed no change when it was redesigned
(2026-09-21).

Two rules worth knowing:

- **The visual is decorative and optional.** It helps the student picture the
  situation; it never carries mathematical information, so it is `aria-hidden`
  unless it has its own `alt`. Do not force one where it adds nothing.
- **It is drawn, never generated.** The card lives under `lessons/`, so the
  root `CLAUDE.md` no-raster rule applies to it as to everything else
  (`PitchScene` in `manipulations/primitives/PitchBackdrop.jsx` is the worked
  example).

### The rule that breaks lessons most often

A step is done when the student **answered**, not when they answered correctly:

```jsx
onAnswered={(ok) => { if (ok) setQ2(true); }}   // ❌ dead end — the module can never complete
onAnswered={() => setQ2(true)}                  // ✅
```

The kit's question components call `onAnswered(isCorrect)` unconditionally and
reveal the correct answer; there is no retry loop. Gating a step on correctness
leaves `nextLink` undefined forever and locks the next module. This is a
**release blocker**, checked by `npm run check:non-blocking`. Full rule:
`LESSON_CONTRACT.md` § Progression non bloquante.

---

## 5. Questions, knowledge and textbook content

**Question components** (`lessons/common/kit`), formative, content modules only:

| Component | For | Key props |
|---|---|---|
| `TapQuestion` | single-choice MCQ | `prompt`, `above`, `options`, `correct`, `cols`, `explain`, `explainWrong`, `requires`, `onAnswered(ok, index)` |
| `BatchChoiceQuestion` | N rows, one correction at the last pick | `intro`, `rows: [{ id, label, options, correct, correction }]`, `feedback({allRight, nCorrect, total})`, `onAnswered(allRight)` |
| `NumericQuestion` | a typed number | `prompt`, `expected` (value or predicate), `parse`, `display`, `explainFor(n)`, `onAnswered(ok, n)` |

**Knowledge** — `knowledge.jsx` is the single source of what the lesson
teaches. A `<KnowledgeBrick id="…">` in a module and the Knowledge Map render
the same item, written once. A brick establishes an id at the point it is
taught; a question declares what it needs with `requires={[...]}`. `requires`
has no runtime effect: it is the contract
`npm run audit:knowledge` checks, so that nothing is ever demanded before it is
taught. See `KNOWLEDGE_DEPENDENCY.md`.

**Textbook content** — `content/textbook.js` holds the textbook's own words.
Every block carries a `source`, built with the `src(elementId, page, section,
number)` helper from `_unit/unitMeta.js`; anything the platform adds carries
`addition(reason)` and renders as « مثال تفاعلي إضافي ». Render them with
`TextbookBox` (`kind`: definition, example, …), `SourceTag` and `MethodSteps`
from `lessons/common/textbook`. `npm run check:textbook` fails if an extracted
element has anything other than exactly one destination.

---

## 6. Manipulations

Read [`MANIPULATION_CONTRACT.md`](../architecture/MANIPULATION_CONTRACT.md)
before touching one. In short:

- A manipulation is a **tactile laboratory**: the student moves a real object
  and the notation appears as a consequence. Never an animated explanation,
  never a quiz.
- **Two levels, one workspace.** Where a manipulation is pedagogically
  appropriate, the module opens on a `ManipulationWorkspace` offering
  **مبتدئ** and **متقدم** — never two stacked manipulations, never a second
  page. Both levels stay mounted, so switching never loses what the student
  built. Full rule and data model:
  [`MANIPULATION_CONTRACT.md` §7bis-levels](../architecture/MANIPULATION_CONTRACT.md).
- **The default level serves the module's task.** A module carrying a textbook
  activity (« نشاط N » in its title, a first step waiting on `onFinished`)
  must `defaultLevel="advanced"` so that activity is what opens. Otherwise the
  lesson's own activity hides behind a tab and the step cannot be satisfied.
  Name the numbers in the lab title, so the student sees which activity is
  open.
- **The textbook owns the mathematics; the platform owns the experience.**
  The concept, definition, method, notation and objective come from the
  textbook and never change. The *situation* dressing them may be replaced by
  one that a 4AM student engages with faster — but only when the mathematical
  structure survives intact, and **never silently**: the resource declares
  `experience: { type, reason, theme }` and keeps its `sourceElementIds`.
  `validate:lessons` fails on a missing level, a divergent objective, an
  `advanced` level with no `autonomy`, or an adapted context with no reason.
- **Do not force a context.** When the textbook's own situation is already
  manipulable and the drawing *is* the argument (the rectangle of points, the
  divisor lists), keep it at both levels and vary the cognitive demand
  instead. A theme bolted onto a list of divisors hides the mathematics.
- The type registry is **closed**. Content names a `type`; it never supplies a
  component. The nine types live in
  `packages/core/curriculum/manipulationTypes.js` (data) and
  `manipulations/manipulationRegistry.js` (components).
- **Reuse before writing.** The existing types are reused across lessons by
  changing props alone. Write a new type only when the mathematical idea or the
  gesture genuinely differs.
- Embed it in the module's `intro` slot so it is usable immediately, with no
  question or button between the student and the instrument.
- **`onFinished` is not completion.** It fires when the manipulation reaches its
  formal phase; use it for presentation only. Never make a step depend on it.
- **Draw real objects as real objects.** If the lesson talks about books on
  shelves, draw recognisable books on shelves, in parameterised inline SVG with
  Arabic labels as DOM text — not abstract bars. The drawing *is* the
  mathematical argument: 420 books means 420 drawn books. Never a generated
  raster image (root `CLAUDE.md`).
- **Every lesson has its own drawn world, and the world is a `theme`.** The
  pitch and the library are the reference; the other lessons open on bricks
  (`construction`), bouquets (`garden`), school bags (`school`), ribbons
  (`workshop`) and a recipe (`kitchen`). To reuse one, pass `theme="…"` to
  `<Manipulation>` and declare it in `resources[].experience.theme` — the
  objects come from `primitives/itemThemes.js`, the Arabic words from
  `lesson.json` (`manipulation.themes.<id>`), the scene from `GroupingScene`,
  `BrickWall` or `RibbonStrip`, and the card vignette from `ContextScenes.jsx`.
  Never write a second grouping scene or hardcode a theme's words in a
  component. The full table, one line per lesson, is
  [`MANIPULATION_CONTRACT.md` §2bis](../architecture/MANIPULATION_CONTRACT.md).
  A world earns its place only when it shows the structure (whole bricks,
  a cut, identical groups); where the textbook's abstract drawing already *is*
  the argument (the rectangle, the divisor lists), keep it.
- Students never see a وضع القسم toggle inside a module: `allowModeSwitch`
  defaults to `false` everywhere. That is a standing owner rule. It is unrelated
  to the platform's Classroom Mode.

---

## 7. Exercises

Read [`EXERCISE_CONTRACT.md`](../architecture/EXERCISE_CONTRACT.md). Two
different systems, often confused:

| | In-lesson exercises | The practice engine |
|---|---|---|
| Content | `content/exercises.js` in the lesson | JSON under `content/practice/<grade>/<lesson>/level-{1..5}/` |
| Rendered by | `TextbookExercise` inside a module | `PracticeSession` in the student space |
| Purpose | أوظّف تعلّماتي — the textbook's exercises | levelled training, separate from the lesson |
| Evidence | only from an `evaluation` module | yes, as a second evidence source |

An in-lesson exercise entry carries `id`, `source`, `learningPointId`,
`difficulty`, the textbook `statement` word for word, an `interaction` naming
how it is answered (`choice`, `integerSet`, `trueFalse`, …), the `question`
itself, and optionally `method` and `commonError`.

Whatever you validate with, return the canonical result shape
`{ isCorrect, fields?, feedback? }`, and remember that it says nothing about
progression. Assessment questions — the only ones that generate evidence — may
live **only** in an `evaluation`-stage module, carry
`assessment: { enabled: true, type: 'assessment', learningPointIds: [...] }`,
and every id must belong to this lesson. See `AI_LESSON_CONTRACT.md`.

---

## 8. Classroom Mode

**You do not implement anything.** A lesson built with `buildLessonRoutes` and
modules built with `ContentModule` are already presentable: the lesson shell is
in the route factory, the entry button is in `LessonIndex` and `ModuleLayout`,
and `ContentModule` derives the presentation units.

### Tests present themselves — never write a test UI

A module built on `PrerequisiteDiagnostic` (module 0 « أستعدّ ») or `BossFinal`
(the final test « إتقان ») **automatically** gets the full fullscreen test
presentation, with no prop to pass and nothing to wire:

| In وضع القسم | What the teacher gets |
|---|---|
| one question at a time | the screen belongs to the question, not to a scrolling list |
| `السابق` / `التالي` | question-by-question navigation, with a compact navigator ≤ 12 questions |
| « تحقّق من الإجابة » | validates **only** the current question; never ends the test, never auto-advances |
| « كشف النتائج » | reveals every question, using the *same* evaluator — one corrector, never two |
| review | after revealing, `السابق` still walks back question by question; the summary never replaces it |
| answer state | answering question 2 and coming back leaves question 1 exactly as it was |

Your lesson supplies **data** — `questions` / `epreuves` — exactly as it does
today. The presentation reads the engine's own evaluator, so your scoring,
thresholds, learning points, evidence and attempt persistence are untouched.

**Three rules, all of them defects if broken:**

- **Never write your own test presentation**, fullscreen screen, per-question
  validation or second corrector. There is one implementation,
  `kit/TestPresentation.jsx`, and both engines consume it.
- **Answering is not succeeding.** A question is `unanswered` → `answered` →
  `correct`/`incorrect`; nothing may reveal correctness merely because an
  answer was entered. Never key UI off "answered = correct".
- **Per-question validation lives in وضع القسم only.** On the student page the
  final test stays silent until its single « أرسِل إجاباتي ». It is a
  teacher-at-the-board gesture; do not add student-facing reveal controls, and
  do not name a role anywhere — authorization is already centralized.

Contract and DOM attributes: [`CLASSROOM_MODE.md`](../architecture/CLASSROOM_MODE.md)
§5 *Test*. Pure logic and its tests: `kit/testPresentation.js`.

What you must not do: write your own fullscreen, scroll lock, Escape handler,
toolbar or scaling. There is exactly one implementation of each.

What you must do if you write a **custom** presentable component: wrap it once
in `ClassroomPresentation`, keep all state inside the wrapper, read
`useClassroomMode()` for `scale` and `area`, use `ClassroomFrame` for
page-authored content and `ClassroomHidden` for chrome that has no place on a
projector, and never conditionally mount on `isClassroomMode` — toggle `hidden`
instead, or the state is lost. Portals go through `useClassroomPortalTarget()`.
See [`CLASSROOM_MODE.md`](../architecture/CLASSROOM_MODE.md) §11.

---

## 9. Reference lessons — what each one demonstrates

All under
`lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/`. These are
references, not templates: read them for the pattern, never copy-and-modify.

| Lesson | Read it for |
|---|---|
| **`qasim-adad-tabii`** | the complete canonical shape: module 0 diagnostic, a `trigger` module opening on a concrete manipulation, a `معارف` module laying knowledge bricks, practice, evaluation. The best first read. |
| **`qasim-adad-tabii` module 1** | the **two-level workspace** reference (مبتدئ = the football pitch, متقدم = the 420 drawn books), the concrete-object rule, the only standalone manipulation, and the Classroom Mode reference for a component that solves its own layout for the offered area. |
| **`team-builder`** | a platform context replacing a textbook one, declared and traceable: equal teams on a real drawn pitch, where the remainder is a player left standing outside. Pure model in `packages/core/arithmetic/equalGrouping.js`, formation geometry swept by `teamFormation.test.js`. |
| **`bahth-pgcd`** | two manipulations in one lesson (successive differences, then Euclid), and the longest module sequence in the unit. |
| **`ikhtizal-kasr`** | a manipulation with two comparable paths (divide repeatedly vs divide once by the GCD), and the `Module00Astaidd` prerequisite diagnostic. |
| **`wadiya-idmajiya-aadad`** | the `synthesis` kind: no discovery or formalization, mobilises what the other lessons taught. Never counted as a lesson. |
| **`khawass-qawasim`** | a proof-oriented module (`أتعلّم البرهان`) inside the standard shape, and the **construction site**: a length drawn in bricks of n (`BrickWall`), one object carried to three zones. |
| **`qasim-mushtarak-akbar`** | the **drawn grouping scene** (`GroupingScene`) served by two themes from one type: balls and shirts at مبتدئ, the textbook's flowers at متقدم, words overridden by `context`. |
| **`awwaliyan-fima-baynahuma`** | a beginner level that *adds a stage* (`startWith="groups"`, the school bags) before the textbook's lists, without a new type. |
| **`bahth-pgcd`** | one world for two algorithms: the same ribbons are cut (differences) and laid along (Euclid), so the student meets one instrument, not two. |

---

## 10. The workflow

1. Read the documents in §1 and the reference lessons in §9.
2. Confirm the textbook extraction and the catalogue entry exist.
3. Design the **pedagogical sequence** before writing any JSX: what the student
   already knows, what they will do, what they should notice, what they will
   name, and what proves they understood. Map it onto the stages.
4. Decide the manipulation, **at two levels**. Work in this order, and never
   start from a widget:

   ```
   textbook activity
      ↓  extract the mathematical objective and structure (not the story)
      ↓  judge the textbook's context: is it already manipulable and engaging?
      ↓  keep it, adapt it, or choose a context a 4AM student lives in
      ↓  مبتدئ  — small numbers, one obvious gesture, visible consequence
      ↓  متقدم  — same objective, scaffolding removed or a real decision added
      ↓  pick the type: reuse an existing one, or justify a new one
      ↓  declare `level`, `objective`, `autonomy`, `experience`, `sourceElementIds`
      ↓  validate: mathematics, interaction, age-appropriateness
   ```

   The objective is identical at both levels — that is what makes them two
   experiences of one concept rather than two exercises. Keep the textbook's
   context whenever the drawing *is* the mathematical argument.
5. Write `lesson.config.js`, then `content/textbook.js` and
   `content/exercises.js` (with sources), then `knowledge.jsx`.
6. Write the modules, in order, on `ContentModule`.
7. Add exercises and the evaluation module with its assessment metadata.
8. Wire `index.jsx`, `routes.jsx`, `moduleContext.js`.
9. Run the gates (§11) and fix what they say.
10. Verify in the browser: Arabic everywhere, RTL at 320 px, the manipulation by
    real gesture, progression through the whole lesson, Classroom Mode.
11. **Update the documentation** if you introduced a reusable pattern — root
    `CLAUDE.md`, Documentation Synchronization Rule.

---

## 11. What you must run

```bash
npm test                 # packages/core, then apps/web, then scripts
npm run check:lessons    # the full editorial gate chain (see below)
npm run build
```

`check:lessons` runs, in order: `validate:lessons --strict`,
`validate:exercises --strict`, `audit:knowledge:gate`, `check:katex`,
`check:routes`, `check:level-leak`, `check:non-blocking`,
`check:dormant-isolation`, `check:textbook`, `check:activation-drift`.

If you touched a **module 0** or a **final test**, also run the test-presentation
suite against a running dev server (`npm run dev`), on a port the API's CORS
allows (5173 / 5174 / 4173):

```bash
KIT_BASE=http://localhost:5173 node apps/web/e2e/lesson-kit/test-presentation.mjs
```

> **`check:activation-drift` reads your database, not just the files.** It
> fails when the local database and the file catalogue disagree about which
> lessons exist or what they cost — typically after you add, rename or remove a
> lesson without re-running the import handshake:
>
> ```bash
> node packages/core/curriculum/exportCurriculum.mjs
> cd apps/api && php artisan smarter:import-curriculum
> ```
>
> A lesson **deleted** from the catalogue leaves its database row behind on
> purpose, because student history references it. On a development database
> that row keeps the gate red; reconcile it with
> `smarter:prune-retired-learning-points --with-history` (local only, needs
> `--force`). The full rule, including what must never be done to production,
> is in
> [`../architecture/LEARNING_ARCHITECTURE.md`](../architecture/LEARNING_ARCHITECTURE.md)
> § Curriculum sync.

### Backend tests, and the local config trap

```bash
cd apps/api && php artisan test          # the committed config (SQLite in memory)
```

If this machine has no `pdo_sqlite`, the repository convention is a **local,
gitignored override** pointing at MySQL:

```bash
cd apps/api && php artisan test -c phpunit.local.xml
```

> **Keep that override's `<env>` block in step with `phpunit.xml`.** It exists
> only to swap the database driver, so every other variable must match. The one
> that matters most is:
>
> ```xml
> <env name="CURRICULUM_ENFORCE_ACTIVE_GRADES" value="false"/>
> ```
>
> The active-grade gate is **deliberately off during tests**
> (`config/curriculum.php` explains why): the inherited Feature suite builds ad
> hoc grade fixtures — `6e`, `seconde`, `3e` — to exercise publication, tier
> and entitlement logic that has nothing to do with grade activation. Dormant
> isolation has its own dedicated coverage (`registry.test.js`,
> `check-dormant-isolation.mjs`, `check-routes.mjs`).
>
> Omitting that line makes eleven progression and evidence tests fail on a 422,
> which reads exactly like obsolete French fixtures. It is not: it is the local
> override having drifted. Diff the two `<env>` blocks before concluding a test
> is stale.

Browser suites (Playwright scripts, not in CI — start the **dev** server first):

```bash
npm run dev    # 5173
KIT_BASE=http://localhost:5173 node apps/web/e2e/lesson-kit/4am-aadad-tabiiya-natiqa.mjs
KIT_BASE=http://localhost:5173 node apps/web/e2e/lesson-kit/manipulations.mjs
KIT_BASE=http://localhost:5173 node apps/web/e2e/lesson-kit/classroom.mjs
```

Always pass `KIT_BASE`. The default is 5183, which is `vite preview` serving a
stale build with no API.

**What a new lesson must verify**

- *Functional*: every module reachable in order; every step completes on
  answered; a deliberately wrong run still progresses and shows the correction;
  the manipulation responds to a real gesture and to the tap and keyboard
  alternatives; exercises validate and explain; progress survives a reload.
- *Arabic & RTL*: no French or English prose in any state, including
  `aria-label` and placeholders; every `N / M` pair isolated `dir="ltr"`;
  terminology matching the register.
- *Responsive*: 320 px with no horizontal scroll, touch targets ≥ 44 px for
  controls, and the phone, tablet and desktop widths.
- *Classroom*: entry as a presenter, unit navigation, state surviving
  enter/exit, no page scroll, exit restoring the page.
- *Accessibility*: keyboard path for every gesture, visible focus, readable
  contrast, semantic controls.
- *Regression*: the other lessons of the unit still pass their suites.

---

## 12. Do not do this

Each of these has actually happened in this repository, or is a standing rule.

**Progression**
- Do not gate a step on a *correct* answer (§4). Release blocker.
- Do not test a module number for truthiness. Module `0` exists; use
  `isValidModuleNumber`.
- Do not render `<CompleteView />` without items — use
  `<KnowledgeSnapshot complete />` for the final synthesis.
- Do not make a step depend on a manipulation's `onFinished`.
- Do not let a diagnostic (`prerequisite_check`) block the next module.
- Do not put an evidence-generating question outside an `evaluation` module.
- Do not invent or compute a learning-point id; only ids from this lesson's
  `pointsToLearn` may appear in `learningPointIds`.

**Architecture**
- Do not write another fullscreen, scroll lock, Escape handler or toolbar.
- Do not build a second state-management or progress system; `useProgress` and
  the queues are it.
- Do not build DOM-based lesson navigation; routes come from the config.
- Do not change the curriculum hierarchy to make one lesson easier to build.
- Do not add a manipulation component from content; the type registry is closed.
- Do not fork a shared component; extend it behind an optional prop.
- Do not copy an existing lesson wholesale and edit it — read it, then write
  yours. Reference ≠ template, and a copied lesson inherits copied bugs.

**Content and language**
- Do not add mathematics the textbook does not contain because it "seems
  incomplete".
- Do not silently change established terminology (الوحدة ≠ المحور).
- Do not introduce French or English UI text, including in defaults, fallbacks
  and `aria-label`s.
- Do not import a lesson-level Arabic font or override the global typography.
- Do not render a server `message` to a student.

**Two-level workspaces**
- Do not ship one level only. `validate:lessons` rejects it, and a lone
  « مبتدئ » leaves the confident student with nothing to climb.
- Do not make « متقدم » the same screen with bigger numbers. It must remove
  scaffolding or demand a real decision, and say so in `autonomy`.
- Do not change the `objective` between levels. The context may change; the
  mathematical objective may not.
- Do not replace a textbook situation without declaring `experience.reason`.
- Do not render the same manipulation twice on one page — check the module's
  steps before adding a level that duplicates one of them.
- In e2e, do not select a manipulation with `.first()` when its type serves
  both levels: it resolves to the `hidden` panel and the test hangs. Use
  `pickLevel()` and `visibleManip()` (`manipulations.mjs`).

**Visuals**
- Do not generate a raster image for anything under `lessons/`.
- Do not replace a concrete object with an abstract bar when the pedagogical
  intent is concrete manipulation.
- Do not add decorative animation; every animation must explain a mathematical
  relationship.
- Do not show a وضع القسم toggle inside a module.

---

## 13. Documentation is part of the task

If your work introduces or changes a reusable pattern — a module shape, a
question type, a manipulation or manipulation behaviour, an exercise type, a
feedback pattern, a `KnowledgeBrick` usage, progression behaviour, a Classroom
presentation pattern, an Arabic/RTL convention, a responsive interaction
pattern, or a reusable component — update this guide and the relevant contract
**in the same task**, and report it. The full rule is in the root `CLAUDE.md`.

## Opening the Math Lab from a lesson (integration point only)

The Math Lab (مختبر الرياضيات, `/espace/atelier`) is a standalone workspace,
**not** part of a lesson, and no lesson links to it yet. Do **not** add
« استكشف في المختبر » buttons to lessons as part of ordinary lesson work: the
flow is `Planned`. When it is implemented, the only API to use is
`buildMathLabLaunch({ tool, seed, title, origin })` from
`features/mathlab/openMathLab.js`, which returns `{ to, state }` for
`<Link>`/`navigate`; the instrument builds its initial state from `seed`.
Four instruments exist: the whiteboard (`whiteboard`, seed = Excalidraw
skeleton elements), the function grapher (`functionGrapher`, seed =
`{ functions: [{ expression: '2x+3' }], viewport?, points?, tangent?: { enabled: true, functionIndex: 0, x: 1 } }`
— expressions in the documented subset, ASCII or LaTeX; `tangent` opens the
« المماس » mode on a function), the 3D geometry explorer (`geometry3d`,
seed = `{ shape: 'cone', dimensions?: { radius: 3, height: 4 }, showAxes?, showGrid?, showMeasurements? }`
— shapes `cube | cuboid | sphere | cylinder | cone`, dimensions in
`[0.5, 10]`) and the probability & statistics lab (`probabilityStats`, seed =
`{ experiment: 'twoDice', draws: 1000 }` or
`{ mode: 'dataset', values: [12, 15, 14, 18, 10] }` — a simulation is never
seeded: the student runs it). Contract, seed shapes and rules:
[`../architecture/MATH_LAB.md`](../architecture/MATH_LAB.md) §5b.3, §5b.6, §5c.5, §5d.6, §6.
