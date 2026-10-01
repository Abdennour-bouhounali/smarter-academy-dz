# Lesson Development Guide — read this before creating a lesson

> **This is the entry point.** Everything here describes the platform as it is
> implemented today, for the Algerian 4AM curriculum. Where a rule has an
> authoritative contract elsewhere, this guide states the rule and links to it
> rather than repeating it — if the two ever disagree, the contract wins and
> this guide is the file to fix.

The live reference is the 4AM textbook unit 1 under
`apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/`:
eight textbook lessons plus one synthesis. Since 2026-09-30 a second unit sits
beside it, `…/hisab-judhur/` « الحساب على الجذور » (five lessons and their synthesis
« أدمج تعلّماتي », three new manipulation types — MANIPULATION_CONTRACT §2quater), and since
2026-10-01 a third, `…/hisab-harfi/` « الحساب الحرفي » (three lessons and their synthesis, two new
manipulation types on the football pitch — MANIPULATION_CONTRACT §2quinquies), and the same day a
fourth, `…/muadalat-mutarajihat/` « معادلات ومتراجحات من الدرجة الأولى بمجهول واحد » (four lessons and
their synthesis, four new manipulation types — MANIPULATION_CONTRACT §2sexies). These
four units are the **only** lesson content in the repository. The French-era lessons (`lessons/college/`, `lessons/lycee/`), their
specs, practice content, e2e scripts and French-only engines were deleted on
2026-09-25; older docs that cite them are describing git history.

**Frozen reference (2026-09-29).** The lesson architecture was audited and
frozen for generation: §14 is the generation contract — what a generated
lesson must implement, reuse and pass.

**Loading.** A new lesson inherits the loading ladder with nothing to declare:
its `lesson.config.js` is metadata in the entry bundle (via the registry), the
shared lesson runtime is one lazy chunk, and each page/module is its own lazy
chunk. Never import something heavy from `routes.jsx` or `_unit/lessonRoutes.jsx`
— `App.jsx` imports them. See
[`../architecture/BUNDLE_BOUNDARIES.md`](../architecture/BUNDLE_BOUNDARIES.md).

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
the Classroom Mode toolbar.

A **محور's breadcrumb names three levels and no more** (since 2026-09-24):

```
الوحدة  /  الدرس  /  المحور
```

Neither الرئيسية nor the grade: the student knows which class they are in, and
the way back to the catalogue is in the sidebar. What helps here is knowing
*where in the textbook* they are. The الوحدة comes from `MODULE_CTX`
(`unitTitle`/`unitPath`, built once in the unit's `_unit/moduleContext.js`
from `unitMeta.js`); a lesson that declares none falls back to its المجال, so the trail is never two levels long. The one exception is internal: Classroom Mode calls
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
├── knowledgeGraph.js    KNOWLEDGE_GRAPH — the progressive map's structure, relationships and
│                        guidance (re-exported by knowledge.jsx; KNOWLEDGE_MAP.md Part A).
│                        Every lesson has one since 2026-09-29; required for new lessons (§14.2)
├── content/
│   ├── textbook.js      the textbook's own words, each block with its `source`
│   └── exercises.js     the textbook's exercises attached to this lesson
└── modules/
    └── Module<NN><Descriptor>.jsx     one file per module
```

Shared across the unit, in `_unit/`: `unitMeta.js` (ids, Arabic labels, the
`src()` and `addition()` source helpers), `moduleContext.js`
(`buildModuleContext`), `lessonRoutes.jsx` (`buildLessonRoutes`) and
`prepDiagnostic.jsx` (`prepQuestion`). Since 2026-09-30 (unit 2) the three
factories are written ONCE in `lessons/common/unit/` and each unit's `_unit/`
only binds them to its `unitMeta` in one line each — a new unit writes its
`unitMeta.js` and those three lines, never a copy of a factory
(`LESSON_CONTRACT.md` « Les fabriques sont communes »).

`index.jsx`, `routes.jsx` and `moduleContext.js` are boilerplate. The real work
is `lesson.config.js`, the content files, `knowledge.jsx` and the modules.

### Adding a textbook UNIT (done for unit 2 « الحساب على الجذور », 2026-09-30)

A second unit is data plus three one-line bindings — never a copy of unit 1's plumbing:

1. **Extraction first**: `docs/sources/<grade>/unit<N>/extraction.json` (`unitCode`, every element of the
   pages word for word, computed answers marked `answerSource: computed`, `discrepancies` for misprints,
   and a `destinations` block giving each element ONE lesson — `items` may split an element such as
   `prep` or `qcm` across lessons). Unit 2's was generated from a script so that LaTeX escaping is
   reliable; the scanned PDF has no text layer, so the transcription is visual (zoom doubtful passages).
2. **Catalogue**: the unit in `units_<grade>_*.json` (objectives, `challenge` and `aside` citing their
   `sourceElementId`, `synthesisLessonCode: null` when the platform publishes no « أدمج تعلّماتي » lesson —
   the situation is then assigned to a lesson like any other element), its code appended to
   `publishedScope.unitIds`, and the lessons in `lessons_<grade>_*.json` (owner-supplied titles and
   points to learn, `sourceTopicId` among the unit's `sourceTopicIds`).
3. **`_unit/`**: `unitMeta.js` (constants + `src`/`addition`) and the three bindings of
   `lessons/common/unit/` (`moduleContext.js`, `lessonRoutes.jsx`, `prepDiagnostic.jsx`), plus a copy of
   the unit's `prepDiagnostic.test.js` with the unit's lesson count.
4. **New mathematics → new manipulation types** by MANIPULATION_CONTRACT §7ter, arithmetic in
   `packages/core/arithmetic/` (unit 2: `squareRoots.js`; the three types of §2quater).
5. The lessons (this guide), then `App.jsx`, the DB handshake (§11) and the documentation.

Unit-count assertions that read the real catalogue (`unitGrouping.test.js`, `finalSynthesis.test.js`,
`decomposition.test.js`) must be updated in the same task.

**Unit 3 « الحساب الحرفي » (2026-10-01) added three things to this recipe:**

- **A ميدان chosen by the owner.** The programme ranges النشر والتبسيط / التحليل under « ميدان الحساب
  الحرفي »; the owner placed the unit under « ميدان أنساب الأعداد والحساب » like units 1–2. The
  catalogue keeps the programme's topics (`sourceTopicIds: ['nashr_tabsit', 'tahlil']`, traceability)
  and the unit DECLARES the gap: `placement: { programmeDomainId, decidedBy: 'owner', decidedOn, note }`.
  `decomposition.test.js` accepts a lesson whose chapter differs from its topic's domain ONLY under such
  a declaration; `coursesData.js` looks a topic's official title up in the whole programme.
- **The extraction is generated and CHECKED** (`docs/sources/4am/unit3/build-extraction.py`): every
  expansion/factorisation answer is computed by sympy and every « أستعدّ » truth value recomputed, so a
  transcription slip fails the generation instead of reaching a lesson.
- **Parallel authoring without shared-file races.** Each lesson's oracle entries live in its own module
  `scripts/practice-oracle/<lesson>.mjs` (helpers: `scripts/practice-oracle/helpers.mjs`, an exact
  rational-polynomial calculator independent of `packages/core`), spread into the one ORACLE of
  `practice-answer-oracle.test.mjs`. The unit's misconception ids, `policy.json` and `active.json`
  entries are seeded once before the lessons are written.

**Unit 4 « معادلات ومتراجحات » (2026-10-01) confirmed the recipe and added:**

- **One exact module for a family of labs.** The four labs share `packages/core/arithmetic/linear.js`
  (fractions, `linear('4x-3')`, `solveEquation`, `solveInequality` with `flipped`, `applyBoth`, `factors`),
  written and tested BEFORE the authors started, so no lab carries its own arithmetic.
- **The lead seeds every shared file before parallel authoring**: catalogue, extraction, `_unit/`, `App.jsx`
  routes, the four type registrations (types, registry, level pairs, empty i18n namespaces), `policy.json`,
  `active.json`, the unit's misconceptions and one empty oracle module per lesson. Authors then touch only their
  lesson, their lab and their own namespace — five authors, no shared-file race.
- **A lab built for two lessons.** `growth-race` was written by lesson 4's author against a props contract fixed
  in the brief (`left`, `right`, `theme`, `domain`, `goal`), and the synthesis reuses it with its own world
  (`theme="pool"`) and its own level pair; the synthesis keeps the props in `content/textbook.js › LAB` and a
  lesson-local render test mounts the workspace with that same object.
- **New drawn worlds are data**: `family` and `pool` were added to `VISUAL_THEMES`
  (`packages/core/curriculum/manipulationLevels.js`) — `validate:lessons` refuses an undeclared theme.

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
filename**, wraps every page in the premium gate (`LessonAccessGate`), the
knowledge provider and the notebook anchor, and puts `LessonClassroomShell`
above the whole lesson as a pathless layout route so a Classroom session
survives module navigation. You get Classroom Mode, the notebook and the
free/premium lock for free; do not rebuild any of them.

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
  passingScore: 4, masteryThreshold: 0.8, emoji: '🔢',   // both INERT today (read by nothing /
                                  // only on the non-sequential branch) — keep them for the validator
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
first pass, all open on a revisit *and* for a free-navigation reader), the
"what's left" popover on the next button (disabled for a student only —
`canAdvance`), completion, **and** the Classroom Mode unit sequence. There is no
auto-scroll and no auto-advance, ever.

The recurring module roles in the 4AM unit, by their Arabic names:

| Module | Stage | What it is |
|---|---|---|
| `Module00Astaidd` — أستعدّ | `prerequisite_check` | Every lesson of the unit opens on it (9 of 9 since 2026-09-30; guarded by `_unit/prepDiagnostic.test.js`). Diagnoses the lesson's `priorKnowledge` — previous years or earlier lessons of the unit — and never the lesson's own material; every `priorKnowledge` id is measured by at least one question. Built as described under « The « أستعدّ » pattern » below. Never gates, never persists evidence; its result is stored locally and read by nothing but its own results screen, so its copy must not promise that the lesson adapts. Advice tiers are computed on the score ratio (`kit/diagnosticLevel.js`). « التالي » without submitting does not complete it. |
| `Module01…` — the activity | `trigger` | the textbook activity, opening on the signature manipulation in the `intro` slot |
| `Module02Maarif` — معارف | `discovery` | the textbook's definitions, each laid by a `KnowledgeBrick` at the moment it is needed |
| `Module0xAwazzif` — أوظّف تعلّماتي | `practice_lab` | the textbook's exercises via `TextbookExercise` |
| `Module0xItqan` — إختبار أولي | `evaluation` | the only source of assessment evidence (displayed title « إختبار أولي » since 2026-09-24; the slug `itqan` and the file name are unchanged, so URLs and saved progress are stable) |

**Two rules the evaluation module must follow**, both learned from shipped
defects:

- **The synthesis shows the lesson's knowledge map**, through the component
  that reads the context:
  `synthese={<KnowledgeSnapshot complete variant="complete" />}`. Never
  `<CompleteView />` on its own — it takes its `items` as a prop, so rendering
  it bare produces an empty final screen, which is what nine modules did until
  2026-09-20.
- **The « أستعدّ » pattern (2026-09-30).** The textbook has ONE « أستعدّ »
  for the whole unit (p. 7, items 1–10 → lessons 1 and 8). A lesson without
  textbook items gets platform statements in the same form — « أصحيح أم خاطئ؟
  برّر إجابتك », with a justification (`why`) for each one. Both answers occur,
  and none uses the numbers of the activity that follows. They live in
  `content/textbook.js` as `PREP_ITEMS` with `source:
  addition('prerequisite_diagnostic')`; `SourceTag` labels them « عبارة
  إضافية من المنصّة » (`textbook.additionReason.<reason>`, falling back to
  « مثال تفاعلي إضافي »). The module writes its questions as **literal
  objects**, `{ ...prepQuestion(PREP_ITEMS[0]), id: 'prep-1', requires:
  ['qasim-jidaa'] }` (`_unit/prepDiagnostic.jsx`). Never build them with
  `PREP_ITEMS.map(…)`: the knowledge audit cannot read a mapped array, and
  then reports `W_PRIOR_NOT_DIAGNOSED` for a lesson that diagnoses everything.
  Formulas follow the RTL rules — `PGCD$(a ; b) = n$`, one island.
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

**Math in `batch` / `trueFalse` rows (2026-09-30).** `TextbookExercise` passes a row's string
options and its `correction` / `why` through `MathText`, like labels: write `$…$` there, never a
local wrapper.

**What a typed answer may look like.** Every parser accepts Arabic-Indic
(٠–٩) and Persian (۰–۹) digits; `NumericQuestion`'s default parser (`parseFr`)
reads integers and accepts a dot only as a well-formed thousands separator;
`TextbookExercise` numeric answers go through `parseDec`; fractions through
`Rational.parse`; integer sets accept `{…}`, `،`, `؛`, `,` and « و ». Never
write your own `Number(...)` parser in a lesson. Table:
`EXERCISE_CONTRACT.md` « Student input normalisation ».

**Knowledge** — `knowledge.jsx` is the single source of what the lesson
teaches. A `<KnowledgeBrick id="…">` in a module and the Knowledge Map render
the same item, written once. A brick establishes an id at the point it is
taught; a question declares what it needs with `requires={[...]}`. `requires`
has no runtime effect: it is the contract
`npm run audit:knowledge` checks, so that nothing is ever demanded before it is
taught. See `KNOWLEDGE_DEPENDENCY.md`.

**The Knowledge Map (approved architecture, 2026-09-29)** — the lesson's
knowledge is shown as a **progressive interactive learning map**: a Mind Map
(« الخريطة ») the learner discovers node by node along labelled relationships,
and its linear numbered reading (« المعارف مفصّلة »). Both read `knowledge.jsx`
(the mathematics) and `knowledgeGraph.js` (structure, relationships, and the
guidance layer — تذكّر · تحقّق · خطأ شائع · انتبه · نصيحة · خلاصة — taken from
the lesson's own exercises, questions and « أستعدّ », never invented). A node
is locked until the brick or completed module that establishes its item; the
map adds no progress and no mastery of its own. The model, types, authoring
rules and quality checklist are **`KNOWLEDGE_MAP.md` Part A**; the reference
implementation is `qasim-adad-tabii`, and all nine lessons of the unit carry the
map since the migration of 2026-09-29 (A.15 records what each one needed — read
it before authoring a graph: it lists the traps the tests now catch).

**Textbook content** — `content/textbook.js` holds the textbook's own words.
Every block carries a `source`, built with the `src(elementId, page, section,
number)` helper from `_unit/unitMeta.js`; anything the platform adds carries
`addition(reason)` and renders as « مثال تفاعلي إضافي », or as the reason's own
label when `textbook.additionReason.<reason>` exists (« عبارة إضافية من المنصّة »
for `prerequisite_diagnostic`). Render them with
`TextbookBox` (`kind`: definition, example, …), `SourceTag` and `MethodSteps`
from `lessons/common/textbook`. `npm run check:textbook` fails if an extracted
element has anything other than exactly one destination.

---

## 6. Manipulations

Read [`MANIPULATION_DNA.md`](../architecture/MANIPULATION_DNA.md) **before designing
one** (why), then [`MANIPULATION_CONTRACT.md`](../architecture/MANIPULATION_CONTRACT.md)
before touching one (how). In short:

- **Design from the mathematics, not from a widget.** Fill the DNA's design sheet
  (§7) in the component header first. Name the VARIABLE the finger controls, the
  RESISTANCE (how the mathematics refuses), the CONTRAST that opens the discovery
  and what stays INVARIANT. If a button could replace the gesture without loss, the
  lab is not causal yet. Never copy another lesson's lab with new colours: the
  platform must not converge toward one manipulation style (DNA §12).
- **Two readings of one division are never switched silently.** When b means
  "number of groups" in one lab and "size of a group" in another, render
  `DivisionRoles` under the equation and put both readings side by side before
  the question (DNA §8; reference: `qasim-adad-tabii` module 1).
- **Orientation is not an answer** (DNA §9). Question options must not carry the
  evidence (« … تبقى 4 كتب »); list the student's **own** trials above the question
  instead (`[data-activity-evidence]`, module 1 of the reference lesson). A
  knowledge-brick lead must not state the next question's answer.

- A manipulation is a **tactile laboratory**: the student moves a real object
  and the notation appears as a consequence. Never an animated explanation,
  never a quiz.
- **Exactly two levels, everywhere: `beginner` (مبتدئ) and `advanced`
  (متقدم).** There is no other manipulation-level system — the old four-palier
  ladder (اكتشاف · موجّه · استقلالية · تحدّ) was removed on 2026-09-24. Every
  type declares its pair in `manipulations/levels.js`; a manipulation posed
  alone shows the مبتدئ / متقدم selector in its own header, and the lesson's
  numbers are always one of the two levels. **One selector per
  manipulation**: inside a `ManipulationWorkspace` the workspace owns it and the
  manipulations inside show none; a standalone `<Manipulation>` placed in a
  later step shows its own (MANIPULATION_CONTRACT « One selector, never
  two »). Call lesson callbacks through `state.report(onFinished, …)` so the
  other level never ticks a lesson step. Full contract:
  [`MANIPULATION_CONTRACT.md` §7](../architecture/MANIPULATION_CONTRACT.md).
- **One lab per level, and no silent switch.** A beginner level is ONE
  laboratory, finished by the gesture that carries the idea (for
  `common-divisors`: placing the *largest* number of identical groups).
  When an advanced level chains a second laboratory (groups → divisor lists),
  the move is **the student's gesture**: a card that says what was found and
  what comes next, a button, and a way back. Never swap the scene for another
  one on a hidden threshold — the student reads it as « a different
  manipulation appeared ». See
  [`MANIPULATION_CONTRACT.md` §7quater](../architecture/MANIPULATION_CONTRACT.md).
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
  component. The nineteen types (ten for unit 1, three for unit 2, two for unit 3, four for unit 4) live in
  `packages/core/curriculum/manipulationTypes.js` (data) and
  `manipulations/manipulationRegistry.js` (components).
- **Reuse before writing.** The existing types are reused across lessons by
  changing props alone. Write a new type only when the mathematical idea or the
  gesture genuinely differs.
- Embed it in the module's `intro` slot so it is usable immediately, with no
  question or button between the student and the instrument.
- **`onFinished` is not completion.** It fires when the manipulation reaches its
  formal phase. It never completes a module, writes progress or produces
  evidence. A step may WAIT on it only when the manipulation is the module's
  own textbook activity, opened by default, and its formal phase is reachable
  for its numbers (four steps of the unit do this); otherwise use it for
  presentation only. Full rule: MANIPULATION_CONTRACT §7bis.
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
  component. Never give drawn countable objects a fixed pixel size either:
  they must read from the back of a classroom, so they scale with the
  scene's width (`itemSizeCss` — ×1 phone → ×2 projector; see the contract,
  « Objects are sized for the back of the classroom »). The full table, one line per lesson, is
  [`MANIPULATION_CONTRACT.md` §2bis](../architecture/MANIPULATION_CONTRACT.md).
  A world earns its place only when it shows the structure (whole bricks,
  a cut, identical groups); where the textbook's abstract drawing already *is*
  the argument (the rectangle, the divisor lists), keep it.
- **Manual first, then « let the lab finish it ».** When a manipulation's
  gesture *repeats* once understood (carrying 20 players into 4 teams, cutting
  the short ribbon a 12th time), the type may offer a student button that
  completes the rest — « أنشئ الفرق », « أكمل الفروق », « أكمل القسمات ». It
  is declared in the registry (`controls.autoComplete: { unlock: 'config' |
  'first-gesture' }` — all three types use `'first-gesture'` since 2026-09-30:
  one full example by hand first) and implemented as `controller.autoComplete` on the
  type's **own** pure logic, so it reaches exactly the state the hand would.
  It never removes the manual gesture, never fires without a click, never
  triggers the discovery, and is **never** added where each gesture is a
  choice or an answer (a divisor, a column count, which chips are common). A
  module does nothing to get it: it comes with the type. Rule, audit of the
  ten types and recipe:
  [`MANIPULATION_CONTRACT.md` §6bis](../architecture/MANIPULATION_CONTRACT.md).
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
| Evidence | **never** — they are instructional (D9); their `learningPointId` is documentation | yes, a second evidence source, **judged by the server** |

**How the practice player presents a multi-question exercise** (question
history, «السؤال السابق», the hint ladder, tones, focus) is specified in
`EXERCISE_CONTRACT.md` § « The practice player — screen contract ». Authoring
consequence: a question may lean on the previous one's result («هذا الدنّ»),
because the student now sees the previous statement and **their own** answer
right above the current question — but never the expected answer, so the
statement must still be solvable from the student's own work. Put shared data
in the exercise `statement`, not in question 1.

An in-lesson exercise entry carries `id`, `source`, `learningPointId`,
`difficulty`, the textbook `statement` word for word, an `interaction` naming
how it is answered (`choice`, `integerSet`, `trueFalse`, …), the `question`
itself, and optionally `method` and `commonError`.

Whatever you validate with, return the canonical result shape
`{ isCorrect, fields?, feedback? }`, and remember that it says nothing about
progression. Assessment questions — the only ones that generate evidence — may
live **only** in an `evaluation`-stage module, carry
`assessment: { enabled: true, type: 'assessment', learningPointIds: ['…'] }`
(one point) or `learningPoints: [{ code, role: 'primary' }, { code, role:
'secondary' }]` (several — exactly one primary), a numeric-literal `correct`,
and optionally `difficulty: 1..5`. Every code must belong to this lesson. See
`AI_LESSON_CONTRACT.md`.

**What happens to an answer (Mastery V2).** `BossFinal` sends the student's
ANSWER (`submitEvidence(question, { picked })`), never its verdict. The
server finds the question in the assessment-item registry (built from your
JSX by `smarter:import-content-registry`), judges it against `correct`, and
updates the Learning Point state through the versioned mastery engine.
Consequence for authors: **after adding or changing a final-test question,
run the registry import** (`php artisan smarter:import-content-registry`), or
the server answers 422 « unknown item » — the queue keeps the answer until it
is imported. A practice exercise that should count toward mastery belongs in
the practice bank (`content/practice/**`), not in `content/exercises.js`; the
exercise contract (`EXERCISE_CONTRACT.md` § « Mastery V2 additions ») lists
the fields a generated bank carries (`templateId`, per-question
`difficulty`, …).

**The final test shows options in a stable shuffled order** (2026-09-29).
Authors habitually put the right answer first; `BossFinal` therefore displays
each question's options in a per-question order seeded by its `id`
(`optionOrder`, `kit/testPresentation.js`) — the same on the student page and
on the board. Keep writing `correct` as the index in YOUR `options` array: the
picked index, the attempt, the evidence and the registry stay in your index
space. Set `keepOrder: true` on a question whose options must keep their
written order (a scale, « صحيح / خاطئ »). And the trophy « أتقنت … » /
`completion.masterTitle` appears only after a PERFECT attempt (every answer
right and every declared badge), never on a partial one.

**Every practice question is also a daily-challenge candidate** (« التحدّي
اليومي », 2026-09-25): once a student has worked a Learning Point, its
published practice items can be served ALONE, one per day, to retrieve it.
Write each question so it stands on the exercise statement plus its own text,
give it an honest per-question `difficulty`, and make `feedback.correct` a
one-line explanation — `EXERCISE_CONTRACT.md` § « A practice question may be
served alone ». More distinct items per point = better spaced retrieval
(the selector prefers items the student has never seen).

**`teachesLearningPointIds` now drives three things** — « ما التالي؟ » after the
test, the Knowledge Map's mastery overlay, and the soft-gate hint — so declare it
on every learning module. `requiresLearningPointIds` produces a review HINT,
never a lock.

**The results screen of the final test shows two different things**, and
never mixes them: « نتيجة هذا التحدي » (this attempt's score, and per skill
with neutral ✓ / ~ / ✗) and « حالتك على نقاط التعلّم »
(`LessonLearningPointsStatus`, the Learning Point states from the server).

---

## 8. Classroom Mode

**You do not implement anything.** A lesson built with `buildLessonRoutes` and
modules built with `ContentModule` are already presentable: the lesson shell is
in the route factory, the entry button is in `LessonIndex` and `ModuleLayout`,
and `ContentModule` derives the presentation units.

### Tests present themselves — never write a test UI

A module built on `PrerequisiteDiagnostic` (module 0 « أستعدّ ») or `BossFinal`
(the final test « إختبار أولي ») **automatically** gets the full fullscreen test
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

### Free or premium is not your lesson's decision — you do nothing

Whether a lesson is free or premium is an **administrator decision** stored in
`lessons.tier` — the single source of truth. **Never write a `tier` anywhere**:
not in `lesson.config.js`, not in `dz/lessons_*.json`, not in `coursesData.js`,
and never a list of free or premium lesson ids. `check-dormant-isolation.mjs`
fails the build if a catalogue lesson carries a `tier`.

What happens to a lesson you add:

```text
new lesson in the catalogue → smarter:import-curriculum (locally, and on every deploy)
  → created in `lessons` with tier = free   (creation default, not a classification)
  → appears in /admin/contenu/lecons, filterable by its الوحدة
  → the administrator may switch it free ↔ premium at any time
  → every later sync or deploy keeps whatever the administrator chose
```

The student side follows automatically: `LessonAccessGate` (put around every
page by `buildLessonRoutes`), `LessonIndex`, `ModuleLayout` and `LessonCard`
read the server's decision from `ContentAvailabilityContext`, and the server
refuses every write on a locked lesson (`ContentAccess`). Contract:
`docs/architecture/ADMIN_PANEL_ARCHITECTURE.md` « Le palier du contenu ».

### A teacher may hide your lesson from a class — you do nothing

A teacher (الأستاذ) can hide a published lesson from one of their classes
(الأقسام). That is a per-class row in `classroom_lessons`, composed by
`ContentAccess` on the server as a third axis beside publication and tier; the
student UI shows the lesson as « أخفاه الأستاذ » through
`ContentAvailabilityContext`. **A lesson never checks visibility, never knows
about classes, and never branches on the reader's role.** Do not add
teacher-specific behaviour, props or copy inside `lessons/`. Contract:
`docs/architecture/TEACHER_CLASSROOM_ARCHITECTURE.md` §3.

### A teacher reads your lesson with every module open — you do nothing

The same teacher opens your lesson in their own space, jumps to any module —
and to any **step inside it**, in any order — and nothing they do is recorded
as progress. That is the *reader*
(`features/learning/learningViewer.js`: `freeNavigation`, `tracksProgress`),
applied once in `ModuleLayout`, `LessonIndex` and the progress hooks through
`lessons/common/utils/moduleGate.js`, and once more for the steps through
`lessons/common/utils/stepUnlock.js`. A module must therefore never assume it
is reached in order, nor that its steps are played in order, and must never
call the progress API itself: use `useProgress`, `useEvidenceSubmission` and
`useFinalTestAttempt`, which are already silent for a non-learner.

**Never pass `locked` to a `StepCard` yourself.** Declare your steps with
their `done` flag and let `ContentModule` own the gate — it is the single
place where the reader is consulted, and a hand-rolled lock would re-close
for a teacher what the policy just opened. `pages/teacherContract.test.js`
fails the build if a lesson under `lessons/moyen/` does it.
Contract: `TEACHER_CLASSROOM_ARCHITECTURE.md` §8b.

### Your lesson feeds the teacher's « مذكرة الدرس » — keep these shapes

Every built lesson gets a teacher orchestration page,
`/enseignant/cours/<id>/memoire`, **generated from your files** by
`features/teacher/lessonMemo/buildLessonMemo.js` — nobody writes it. What
you author therefore shows up there, and what you omit leaves a section
empty (never filled with invented text). To make it useful:

| You write | It becomes in the مذكرة |
|---|---|
| `modules[]` with `stage`, `estimatedMin`, `desc`, `teachesLearningPointIds` | the timeline — one phase per محور, its clock, its stage guidance, its expected outcome |
| `skills`, `teachingScope.include/exclude` | objectives and « حدود الحصة » |
| `resources[]` manipulations with `module` and `level` | the phase's support; `beginner` → « للمرافقة », `advanced` → « المستوى المنتظر » |
| `content/textbook.js` export **`ACTIVITY`** (or `ACTIVITY_A`, or `SITUATION` for a synthesis) with `situation`/`text`, `questions[]`, `closing`, `source` | « وضعية الانطلاق » and the trigger phase's questions |
| `content/exercises.js` export **`EXERCISES`** (or `EXERCISES_1`, `EXERCISES_2`…) with `statement`, `difficulty`, `learningPointId`, `question.explain`, **`commonError`** | examples, anticipated errors, each phase's vigilance, differentiation, exit ticket |
| `knowledge.jsx` bricks with a plain-text **`summary`** | knowledge objectives, the trace to build, oral questions, the « nudge » for an error |
| catalogue `prerequisiteLessonCodes`, `learningPoints` | prerequisites, remediation, success indicators |

Rules: keep those export **names** (the builder recognises only them); give
every exercise that has a known pitfall a `commonError`; keep each brick's
`summary` a short plain sentence (the مذكرة renders `$…$` math, JSX is not — the
brick's `body` never reaches the مذكرة; the STUDENT map and snapshot show `summary` as plain
text, so keep formulas out of it — write them in words or put them in `body`).
`buildLessonMemo.test.js` builds the memo of **every** lesson and fails if a
phase or a text cannot be traced back to the lesson. Do not add memo-specific
fields to a lesson; if a phase needs richer teacher guidance, it belongs in the
per-stage text of the `memo` i18n namespace. Contract:
`TEACHER_CLASSROOM_ARCHITECTURE.md` §8b.

## 9. Reference lessons — what each one demonstrates

All under
`lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/`. These are
references, not templates: read them for the pattern, never copy-and-modify.

| Lesson | Read it for |
|---|---|
| **`qasim-adad-tabii`** | the complete canonical shape: module 0 diagnostic, a `trigger` module opening on a concrete manipulation, a `معارف` module laying knowledge bricks, practice, evaluation. The best first read. |
| **`qasim-adad-tabii` module 1** | the **manipulation quality reference** (redesigned 2026-09-30, `MANIPULATION_DNA.md`): the **two-level workspace** (مبتدئ = the football pitch, partition, carry gesture; متقدم = the 420 books on a shelf the student **stretches**, quotition, stretch gesture); the refusal-as-definition and the ghost shelf as resistance; contrast-gated discovery; `DivisionRoles` and the two-readings bridge; the student's own trials listed above the question. A quality bar, **not a visual template**. Module 2 is the worked-example pattern (`levels={false}`, `discovery="symmetry"`). |
| **`team-builder`** | a platform context replacing a textbook one, declared and traceable: equal teams on a real drawn pitch, where the remainder is a player left standing outside. Pure model in `packages/core/arithmetic/equalGrouping.js`, formation geometry swept by `teamFormation.test.js`. |
| **`bahth-pgcd`** | two manipulations in one lesson (successive differences, then Euclid), and the longest module sequence in the unit. |
| **`ikhtizal-kasr`** | a manipulation with two comparable paths (divide repeatedly vs divide once by the GCD), and the `Module00Astaidd` prerequisite diagnostic. |
| **`wadiya-idmajiya-aadad`** | the `synthesis` kind: no discovery or formalization, mobilises what the other lessons taught. Never counted as a lesson. |
| **`khawass-qawasim`** | a proof-oriented module (`أتعلّم البرهان`) inside the standard shape, and the **construction site**: a length drawn in bricks of n (`BrickWall`), one object carried to three zones. |
| **`qasim-mushtarak-akbar`** | the **drawn grouping scene** (`GroupingScene`) served by two themes from one type: balls and shirts at مبتدئ, the textbook's flowers at متقدم, words overridden by `context`. |
| **`awwaliyan-fima-baynahuma`** | a beginner level that *adds a stage* (`startWith="groups"`, the school bags) before the textbook's lists, without a new type. |
| **`bahth-pgcd`** | one world for two algorithms: the same ribbons are cut (differences) and laid along (Euclid), so the student meets one instrument, not two. |

Unit 2 « الحساب على الجذور » (`…/hisab-judhur/`, 2026-09-30), the first unit built on the frozen §14
architecture from its extraction:

| Lesson | Read it for |
|---|---|
| **`jidhr-tarbii`** | a textbook activity whose questions are answered from the student's OWN bracketings (`onTrial` of `square-root-side` → `[data-activity-evidence]`), the تحدّ of the unit page reused as the REAL hook and revisited as the last step, a drawn figure in `components/` |
| **`natiqa-ghayr-natiqa`** | a lesson with NO textbook « أستعدّ » item (platform statements only), a textbook misprint shown honestly, a declared prior-year reminder (`addition('prior_year_reminder')`, label « تذكير من المنصّة ») |
| **`muadalat-x-murabba`** | the unit's « أدمج تعلّماتي » situation placed in a lesson's practice module when the platform publishes no synthesis lesson |
| **`amaliyat-judhur`** | a table the student COMPLETES (never reads) before the conjecture, and a proof by squaring as a batch |
| **`tawzif-khawass-judhur`** | a lesson with no textbook activity: the lab is declared the entry into the طرائق (`experience.type: 'platform_adaptation'`), then worked methods revealed line by line; a corrected misprint turned into a complete exercise (now-30) |
| **`wadiya-idmajiya-judhur`** | unit 2's synthesis « أدمج تعلّماتي »: the situation analysed in the textbook's three phases (the corrected phase shown), the 11 QCM items written out one step each so the audit reads every `requires` (unit 1's synthesis maps them and is invisible to the audit), the item with two correct options as a « يساويه / لا يساويه » batch |

Unit 3 « الحساب الحرفي » (`…/hisab-harfi/`, 2026-10-01), built on the same architecture with four
lesson authors working in parallel (see « Adding a textbook UNIT »):

| Lesson | Read it for |
|---|---|
| **`nashr-tabsit`** | the LETTER as a length the student stretches (`pitch-expansion`): a textbook numeric question (3 × (9 + 5)) reached as the value x = 9 of the beginner pitch 3(x + 5) (`span={9}`); the corrected act-1 reading; a worked lab in معارف (`levels={false}`, the book's (2x − 1)(x + 4)) |
| **`mutatabiqat-shahira`** | the three identities read on square / cut pitches (removed and restored strips), Descartes' table as the lab's own grid (`history-descartes` duplicate), questions answered from the student's `onTrial` evidence, mental calculation as a learning point |
| **`tahlil-ibara`** | the inverse gesture (`turf-factoring`): identical rows = common factor (the PGCD of unit 1 reappears), a square pitch that closes only for a² + 2ab + b², x² + 25 that never closes; four corrected misprints; طرائق revealed line by line; two QCM items formative in أوظّف, five in the final test |
| **`wadiya-idmajiya-harfi`** | the synthesis: the pool and its strip modelled on a three-segment side (`x+10+x`), the textbook's « مساعدة » kept as such (no zero-product theory claimed), the 13 QCM one step each, أتعمّق exercises on choosing the expanded or factored form |

Unit 4 « معادلات ومتراجحات من الدرجة الأولى بمجهول واحد » (`…/muadalat-mutarajihat/`, 2026-10-01), five
authors in parallel on a seeded foundation (see « Adding a textbook UNIT »):

| Lesson | Read it for |
|---|---|
| **`muadala-ula`** | the BALANCE (`equation-balance`): a one-sided gesture tips the beam (the rule resists), the mirror gesture writes the textbook's « أي … » line under it; balloons are −1, so Fatima's 9x + 1 = −26 is solved by ADDING a balloon to both pans; Q4 (9x + 1 = 2x → −1/7) as the contrast that motivates ax = b → b/a; ex-9's equation without solution said honestly |
| **`jidaa-maadum`** | the pitch whose sides are the FACTORS (`vanishing-pitch`): it collapses exactly when a side is 0; pins refused with the exact area, « لا حلول أخرى » gated by the sweep; the ruler's graduation derived from the roots' denominators (no rounding ever); the unit تحدّ and الخوارزمي duplicated as transfer and closing |
| **`mutarajiha-ula`** | the solution RAY (`solution-ray`): traces painted by the student's own trials (red = solutions, the textbook's colour), the bracket placed and refused with a witness, then (متقدم) transformation cards where ÷(−3) without flipping contradicts the student's red traces; module 1's lab posed alone on the textbook numbers (`levels={false}`); number lines as answer options (`components/RayFigure.jsx`, `GraphChoice.jsx`, also in BossFinal) |
| **`tarrid-mushkila`** | a lesson with NO textbook activity whose lab is the entry (`growth-race`, `platform_adaptation`): BUILD the model by carrying « + x » onto each person (a forgotten child refused in the story's words), then RACE x on a timeline — the meeting point is the equation, beyond it the inequality; P2 (« ملاءمة للواقع ») taught on a negative solution |
| **`wadiya-idmajiya-muadalat`** | the synthesis: the pool situation in the textbook's three phases on `growth-race` (`theme="pool"`, `goal="greater"`), interpretation practised on the beginner pricing so the textbook answer (9 sessions) stays for the final test; the 9 QCM one step each, two-correct items as batches, number-line options in SVG |

**Textbook misprints are CORRECTED, not only noted (owner decision, 2026-09-30).**
The extraction keeps the book's verbatim `text` and adds a `correction`
`{ decidedBy, decidedOn, text | analysis1, answer?, note }`; `discrepancies`
records the resolution. The lesson displays the corrected version with one
discreet line (« صحّحت المنصّة خطأً مطبعيًا … »), never a long note. Unit 2:
act-2 (L2), ex-27 and now-30 (L5 — now-30 is a reconstructed, complete
exercise), the situation's analysis (synthesis).

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
`check:routes`, `check:non-blocking`, `check:dormant-isolation`,
`check:textbook`, `check:activation-drift`. (`check:level-leak`, a French 6e
vocabulary audit, was removed with the French lessons on 2026-09-25;
`check:dormant-isolation` now also fails if a `lessons/college|lycee/` folder
comes back.)

**Answer keys are checked, not trusted** (2026-09-24 answer audit).
`validate:lessons --strict` refuses, in live `moyen/` lessons, an assessed
option object or a `<TapQuestion>` without an explicit `correct`, or with a
`correct` outside its option range. `validate:exercises --strict` replays every
practice key through the real evaluator (key accepted, every distractor
rejected, no misconception signature that is itself correct), and
`scripts/practice-answer-oracle.test.mjs` recomputes each constructed answer
from the mathematics — **a new constructed-answer practice question needs an
oracle entry** or `npm test` fails. When you write distractors, make each one
**false**, not just "not the book's argument"; say whether bounds are strict.
Details: [`EXERCISE_CONTRACT.md`](../architecture/EXERCISE_CONTRACT.md)
§ « Answer-key integrity ».

**Exercises from another official sheet** (not the textbook) go into the
practice bank with a declared provenance file and `source.type: "worksheet"` —
the full recipe is [`EXERCISE_CONTRACT.md`](../architecture/EXERCISE_CONTRACT.md)
§ « Non-textbook sources — worksheets ».

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
> and entitlement logic that has nothing to do with grade activation.
> Active-grade isolation has its own dedicated coverage (`registry.test.js`,
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
KIT_BASE=http://localhost:5173 node apps/web/e2e/lesson-kit/4am-hisab-judhur.mjs   # unit 2: every module mounted at 1280/320 px + the three root labs
KIT_BASE=http://localhost:5173 node apps/web/e2e/lesson-kit/4am-hisab-harfi.mjs    # unit 3: every module at 1280/320 px + the pitch and turf labs by real gesture
KIT_BASE=http://localhost:5173 node apps/web/e2e/lesson-kit/4am-muadalat-mutarajihat.mjs  # unit 4: every module at 1280/320 px + the four labs by real gesture
#   LABS_ONLY=1 skips the mounts; MOUNT_LESSONS=a,b mounts only those lessons (the full run is ~35 min)
KIT_BASE=http://localhost:5173 node apps/web/e2e/lesson-kit/manipulations.mjs
KIT_BASE=http://localhost:5173 node apps/web/e2e/lesson-kit/classroom.mjs
```

Always pass `KIT_BASE`. The default is 5183, which is `vite preview` serving a
stale build with no API.

**Offline or slow network (2026-10-01).** `index.html` loads Google Fonts; when they are unreachable
the browser's `load` event waits for them and every `page.goto` times out. `helpers.mjs › newCtx`
(and `test-presentation.mjs`, which builds its own context) therefore aborts `fonts.googleapis.com` /
`fonts.gstatic.com` — fonts carry no assertion. A suite that creates its own context must do the same.
If 5173 is taken, Vite starts on 5174 (also CORS-allowed): pass the port it printed.
**A long-running dev server can serve a stale catalogue** (2026-10-01): after editing `packages/core/curriculum/dz/*.json`
a server started earlier redirected the new unit's page to `/courses`. Start a fresh server (`npx vite --port 5174`)
before concluding a new lesson or unit is broken.

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
- Do not make a step depend on a manipulation's `onFinished` unless it is the
  module's own, default-open textbook activity with a reachable formal phase
  (MANIPULATION_CONTRACT §7bis). Never on a question's correctness.
- Do not let a diagnostic (`prerequisite_check`) block the next module.
- Do not put an evidence-generating question outside an `evaluation` module.
- Do not invent or compute a learning-point id; only ids from this lesson's
  `pointsToLearn` may appear in `learningPointIds` / `learningPoints`.
- Do not list several `learningPointIds` on one question; use
  `learningPoints` with exactly one `primary`.
- Do not compute `correct`; the registry exports it as the answer key.
- Do not call a completed path « إتقان »: completion and mastery never share
  words (`ARABIC_RTL_CONTRACT.md` § « Mastery and completion never share
  words »).

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
- Do not add a third level, a hidden level, or a « palier » row inside a
  manipulation. Two levels, one selector.
- Do not let a manipulation replace its own scene on a threshold (« after
  three tries, show the lists »). A second laboratory is opened by the
  student, with an explanation and a way back — and only at متقدم.
- Do not write a `lead` that promises a stage the level does not have
  (« ثم تجد الأعداد نفسها في القائمتين » on a groups-only مبتدئ).
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

## 14. LESSON REFERENCE ARCHITECTURE — FROZEN FOR GENERATION (2026-09-29)

> **Amended 2026-09-29 (owner-approved):** the Knowledge Map row of §14.2 now
> requires the progressive map (`knowledgeGraph.js` + `knowledgeMapMode`) and
> §14.3 adds its checklist — `KNOWLEDGE_MAP.md` Part A. Everything else in §14
> is unchanged. **Same day, later:** the eight other lessons were migrated to the
> map and its blockers resolved (gate in `validate-lessons.mjs`, per-lesson
> invariants in `lessonGraphs.test.js`) — `KNOWLEDGE_MAP.md` A.15.

The architecture below was audited end to end on 2026-09-29 (all nine lessons,
every shared component, every gate, the server judge and the browser suites;
record: [`../reports/LESSON_ARCHITECTURE_AUDIT_2026-09-29.md`](../reports/LESSON_ARCHITECTURE_AUDIT_2026-09-29.md)).
It is the reference a generated lesson must follow. **Generated lessons reuse
it; they never add a parallel lesson architecture.** Changing any part of it is
an architectural change, made deliberately and documented here first.

### 14.1 The real structure

```
App.jsx ─ CourseLayout
  ├─ /courses/:level/:grade/:chapter/units/:unit      → UnitPage (unit card, 8 lessons + synthesis)
  └─ <lesson>Routes() ─ buildLessonRoutes (_unit/lessonRoutes.jsx)
       └─ LessonClassroomShell   (pathless layout: one Classroom session across modules)
            ├─ LESSON_BASE_PATH  → LessonAccessGate → KnowledgeProvider → LessonIndex
            └─ modules[].path    → LessonAccessGate → KnowledgeProvider → NotebookAnchor → Module<NN>
                                     └─ ContentModule | PrerequisiteDiagnostic | BossFinal
                                          └─ ModuleLayout (breadcrumb الوحدة/الدرس/المحور, header,
                                             step bar, prev/next, the ONLY completion writer)

A lesson  = lesson.config.js + index.jsx + routes.jsx + moduleContext.js + knowledge.jsx
            + content/{textbook.js, exercises.js} + modules/Module<NN><Descriptor>.jsx
A module  = one stage (prerequisite_check → trigger → discovery → manipulation →
            formalization → practice_lab → evaluation), numbers contiguous from 0 or 1
Knowledge = knowledge.jsx items, laid by <KnowledgeBrick> where taught, mapped by the Knowledge Map,
            demanded by `requires` (audited), closed by <KnowledgeSnapshot complete> in the final test;
            structured by knowledgeGraph.js (progressive map — every lesson, KNOWLEDGE_MAP.md Part A)
Evidence  = ONLY the evaluation module's assessed questions → { picked } → server registry judge
            → versioned mastery engine (Learning Point states). Everything else is formative.
Progress  = useProgress (localStorage cache) → progressQueue → PUT /progress (union merge)
Practice  = content/practice/<grade>/<lesson>/level-N (separate engine, server-judged evidence)
```

### 14.2 The generation contract — what a generated lesson must implement

**Input (must exist before any JSX):**
grade and المجال; the الوحدة in `units_<grade>_*.json`; the lesson entry in
`lessons_<grade>_*.json` with its `pointsToLearn` (learning-point ids are
DERIVED: `{grade}_{lessonId}_P{n}`), `prerequisiteLessonCodes`,
`durationMinutes`; the textbook extraction `docs/sources/<grade>/<unit>/extraction.json`
for every element the lesson cites. Mastery criteria are the server's
(Mastery V2) — a lesson declares none.

**Required output:**

| Part | Contract |
|---|---|
| Files | exactly the layout of §3; `index.jsx`, `routes.jsx`, `moduleContext.js` are the one-line factories |
| `lesson.config.js` | static literals only; `id` = catalogue code; `kind`; `unit`; stages in journey order with the required set per kind (§3); `teachesLearningPointIds` on every learning module covering every LP; `estimatedDurationMin` = Σ `estimatedMin` ≤ 90; `color` a `COLOR_MAP` key; `resources[]` for every workspace manipulation (both levels, same `objective`, `autonomy` on advanced, `experience` with reason and theme) |
| Module shape | `ContentModule` for content, `PrerequisiteDiagnostic` for « أستعدّ » (module 0, `priorKnowledge` only, questions as literal objects with `requires` — §4 « The « أستعدّ » pattern »), `BossFinal` for « إختبار أولي » — never a hand-rolled module shell, test UI, fullscreen, toolbar or progress write |
| Steps | `done` on ANSWERED, never on correct (`check:non-blocking`); a step may wait on `onFinished` only per §6; never pass `locked` |
| Questions | kit components only (`TapQuestion`, `BatchChoiceQuestion`, `NumericQuestion`, `TextbookExercise` for the textbook's exercises); explicit `correct`; every distractor FALSE; `requires` on every question; the parsers of §5, never a custom one |
| Manipulation | a type from the closed registry (19 types), two levels in one `ManipulationWorkspace`, the lesson's world as a `theme` (§6); a new type only by the recipe of MANIPULATION_CONTRACT §7ter |
| Knowledge | `knowledge.jsx` with a plain-text `summary` per item; a brick at the point of teaching; `knowledgeMap: true`; every content module's footer `<KnowledgeSnapshot moduleNumber={N} />`; the final test's `synthese={<KnowledgeSnapshot complete variant="complete" />}`; **and** the progressive map from the start (owner decision, 2026-09-29): a `knowledgeGraph.js` exporting `KNOWLEDGE_GRAPH`, re-exported by `knowledge.jsx`, and `knowledgeMapMode: 'progressive'` — every item carried by a `notebook` node, labelled relationships, guidance only where the lesson's own exercises / questions / « أستعدّ » support it, authored per `KNOWLEDGE_MAP.md` A.10 (rules 1–16) and passing A.14. Enforced: `validate-lessons.mjs` refuses a lesson with a map but no mode / graph / re-export, and `lessonGraphs.test.js` runs the A.14 invariants on every lesson without any per-lesson code |
| Final test | only in the `evaluation` module; every question assessed with ONE primary LP of this lesson; every LP covered; 4–6 questions; timer ≈ 1 min per question + 1; `badges`, `completion`, `skills` as in the reference lessons |
| Textbook | every pedagogical block carries a `source` (`src()` / `addition()`); `check:textbook` maps each extracted element to exactly one destination |
| Practice | a separate bank under `content/practice/**` with provenance, oracle entries for constructed answers (§11) |
| Arabic/RTL | all user-visible text Arabic (including `aria-label`, `title`, placeholders, KaTeX `\text{}` — put words in DOM, not in KaTeX); numbers and equations `dir="ltr"`; `PGCD` Latin |
| Responsive / a11y | no horizontal scroll at 320 px; controls ≥ 44 px; every gesture has a tap and keyboard path; visible focus; reduced motion honoured |
| Teacher / Classroom | nothing: `buildLessonRoutes` + `ContentModule` give free navigation, the مذكرة, the premium gate and Classroom Mode |

**Reuse, never rebuild:** `buildLessonRoutes`, `buildModuleContext`,
`ContentModule`, `ModuleLayout`, `BossFinal`, `PrerequisiteDiagnostic`,
`TestPresentation`, the kit questions, `TextbookBox`/`SourceTag`/`MethodSteps`,
`KnowledgeBrick`/`KnowledgeSnapshot`, `Manipulation`/`ManipulationWorkspace`,
the primitives (`GroupingScene`, `BrickWall`, `RibbonStrip`, `BookRectangle`…),
`useProgress`/`useEvidenceSubmission`/`useFinalTestAttempt`, the parsers of
`@smarter-academy/core`. Prohibited: everything in §12, plus a second state or
progress system, a second corrector, a client-computed verdict sent as
evidence, a raster image under `lessons/`, a `tier` anywhere in the lesson.

### 14.3 Validation a generated lesson must pass

| Gate | Command / check |
|---|---|
| Build | `npm run build` |
| Unit + scripts tests | `npm test` (core, web, scripts — includes the practice oracle and the memo builder over every lesson) |
| Editorial gates | `npm run check:lessons` (validate:lessons --strict, validate:exercises --strict, audit:knowledge:gate, check:katex, check:routes, check:non-blocking, check:dormant-isolation, check:textbook, check:activation-drift) |
| DB handshake | `node packages/core/curriculum/exportCurriculum.mjs && php artisan smarter:import-curriculum`; `node packages/core/curriculum/exportContentRegistry.mjs && php artisan smarter:import-content-registry` |
| Runtime | the browser suites of §11 against the dev server (all green on 2026-09-29: 27/27, 183/183, 73/73, 47/47, 9/9) + the new lesson loaded at 320 / 414 / 820 / 1440 px with no console error, no failed request, no horizontal overflow |
| Mathematics | every key recomputed; every distractor false; parsers exercised with Arabic digits |
| Interaction | the manipulation by drag, tap and keyboard; a deliberately wrong run still progresses; reload keeps progress |
| Knowledge Map | the checklist of `KNOWLEDGE_MAP.md` A.14 — core items all carried, relationships labelled, guidance grounded in the lesson (automated: each aid quotes the lesson word for word; relevance reviewed by a human), mistakes with wrong / why / right, the map not overloaded, ① first in « المعارف مفصّلة », every equality inside `$…$` and arithmetically true, mathematics never truncated or mirrored, locked until taught, no evaluation answer in the map; browser QA `node apps/web/e2e/knowledge-map.mjs` |
| Documentation | a new reusable pattern is documented here and in its contract in the same task |

### 14.4 Known open items (do not block generation)

Recorded by the audit, owned by the product owner, none of them a defect a
generated lesson would inherit if it follows 14.2:

- A module closed by the admin between a student's offline completion and the
  sync makes that lesson's later snapshots 422 (PROGRESS_MODEL « Known gap »).
- `priorKnowledge` mixes previous-year knowledge and earlier lessons of the
  unit. Since 2026-09-30 all 9 lessons have a « أستعدّ » that diagnoses every
  declared id (the audit reports no `W_PRIOR_NOT_DIAGNOSED`); 39 of the 49
  statements are platform additions, because the textbook has only 10.
- The weak-prerequisite recommendation links to the prerequisite's lesson
  (2026-09-29) but the diagnostic result itself drives nothing.
- Seven textbook-activity steps wait on their lab's `onFinished` (allowed, §6; the list is in
  MANIPULATION_CONTRACT §7bis).
  The reference lesson's module 1 does **not** wait (its default level is the
  platform's football warm-up by owner decision); its step 1 lists the
  student's own trials instead. This is a documented exception to « the
  default level serves the module's task ».
- Lessons 2–9's manipulations were redesigned against `MANIPULATION_DNA.md` on
  2026-09-30 at the owner's request (see its §15 for what changed per lesson). Still
  open from the audit's Part II: dormant class-mode code (untested), the standalone
  labs' second level (defect k) except the معارف 143 worked example, and
  `NumberTile size="sm"` at 40 px on the list chips.
- The textbook's own erratum « رتبة عشرات الآلاف (مشكّل من أربعة أرقام) »
  (wadiya analysis) is kept verbatim: textbook words are never edited.
- `docs/reports/QUESTION_ANSWER_AUDIT_2026-09-24.md` « Flagged » items that are
  wording choices (true-fact distractors in bahth M01, « فقط » in khawass E1…).

## Opening the Math Lab from a lesson (integration point only)

The Math Lab (مختبر الرياضيات, `/espace/atelier`) is a standalone workspace,
**not** part of a lesson. Every lesson page already carries the generic
« 🧪 المختبر » button (`MathLabEntryButton`, mounted by `LessonIndex` and
`ModuleLayout`), which opens the Lab OVER the lesson without seeding it — on
the lab of the lesson's cycle (`<MathLabEntryButton scope={levelId} />`:
مخبر المتوسط for a 4AM lesson, so its instruments show only college
capabilities; `MATH_LAB.md` §2.1). A lesson passes its `levelId`; it never
chooses tools or capabilities itself. What
is **not** built is a *seeded*, per-activity button: do **not** add
« استكشف في المختبر » buttons to lessons as part of ordinary lesson work — that
flow is `Planned`. When it is implemented, the only API to use is
`buildMathLabLaunch({ tool, seed, title, origin })` from
`features/mathlab/openMathLab.js`, which returns `{ to, state }` for
`<Link>`/`navigate`; the instrument builds its initial state from `seed`.
Fourteen instruments exist (`MATH_LAB_TOOLS`, `features/mathlab/toolRegistry.js`;
`PLANNED_MATH_LAB_TOOLS` is empty): the whiteboard (`whiteboard`, seed = Excalidraw
skeleton elements), the function grapher (`functionGrapher`, seed =
`{ functions: [{ expression: '2x+3' }], viewport?, points?, tangent?: { enabled: true, functionIndex: 0, x: 1 } }`
— expressions in the documented subset, ASCII or LaTeX; `tangent` opens the
« المماس » mode on a function), the 3D geometry explorer (`geometry3d`,
seed = `{ shape: 'cone', dimensions?: { radius: 3, height: 4 }, showAxes?, showGrid?, showMeasurements? }`
— shapes `cube | cuboid | sphere | cylinder | cone`, dimensions in
`[0.5, 10]`) and the probability & statistics lab (`probabilityStats`, seed =
`{ experiment: 'twoDice', draws: 1000 }` or
`{ mode: 'dataset', values: [12, 15, 14, 18, 10] }` — a simulation is never
seeded: the student runs it), the algebra lab (`algebra`, seed =
`{ source: '2x + 3 = 11' }` — first degree in one unknown, equalities and
inequalities) and the vectors lab (`vectors`, seed =
`{ scene: { points: [...], vectors: [...], polygons: [...] }, viewport?, settings? }`
— objects carry stable `id`s and reference each other by id, so a seeded
⃗AB is `{ kind: 'points', from: '<idA>', to: '<idB>' }`; an unreadable or
dangling seed falls back to the default plane rather than opening a broken
scene) and the trigonometry lab (`trigonometry`, seed =
`{ mode: 'triangle', triangle: { given: 'opp-hyp', opposite: 3, hypotenuse: 5 }, highlight: 'sin' }`
for the 4AM right-triangle work, or `{ preset: 'unitCircle', angle: 60 }` /
`{ mode: 'circle', angle: 450, unit: 'rad' }` for the circle; `given` is one
of `angle-hyp | angle-opp | angle-adj | opp-adj | opp-hyp | adj-hyp`, the
triangle's angle stays **acute**, and the practice score is never seeded) and
the sequences lab (`sequences`, seed =
`{ primary: { kind: 'arithmetic', first: 2, difference: 3, startIndex: 0 }, count?: 10, cursor?, layers? }`
— `kind` is one of `arithmetic | geometric | affine | explicit | recurrence |
secondOrder`; a free rule travels as **text** in `explicitSource` (`'2n + 1'`)
or `ruleSource` (`'2u - 1'`, where `u` is uₙ), never as a function; or simply
`{ preset: 'fibonacci' }`. Parameters are clamped to `[−1000, 1000]`, `count`
to `[2, 500]`, and the practice score is never seeded) and the
transformations lab (`transformations`, seed =
`{ figures: [{ kind: 'triangle', vertices: [{x:1,y:1},{x:4,y:1},{x:1,y:3}] }], steps: [{ kind: 'rotation', angle: 90, center: { type: 'origin' } }], viewport?, settings? }`
— `kind` is one of `point | segment | triangle | rectangle | square |
polygon`; a step is one of `translation {vx, vy}`, `rotation {angle,
center}`, `reflection {axis}` or `dilation {k, center}`; a `center` is
`{type:'origin'}`, `{type:'vertex', index}` — which then **follows** that
vertex when the student drags it — or `{type:'point', point}`; an `axis` is
`xAxis | yAxis | origin | diagonal | antidiagonal | horizontal {value} |
vertical {value} | line {slope, intercept} | twoPoints {a, b}`. Coordinates
are clamped to ±10⁴, `k` to [−10, 10], the angle normalised into [0, 360),
and the practice score and puzzle state are never seeded) and the conics lab
(`conics`, seed =
`{ scene: { objects: [{ kind: 'circle', h: 0, k: 0, r: 3 }], probe?: {x, y} }, viewport? }`
— `kind` is one of `circle {r} | parabola {a, orientation} | ellipse {a, b} |
hyperbola {a, b, orientation}`, plus `line {slope, intercept}` or
`line {vertical: true, x}`; `orientation` is `horizontal | vertical`. At most
**4 conics and 2 lines**; coordinates are clamped to ±10⁴, radii and
semi-axes to `]0, 10⁴]`, a parabola's `a` to `[−100, 100]` and never through
zero (a zero coefficient is a line, not a parabola). A traced point travels
as its **parameter** (`trace: { targetId, t, branch }`), never as
coordinates, so it stays exactly on the curve. The practice score is never
seeded).
- `measurement` — `{ investigation }`, the id of one of the ten
  investigations (`rectangle-area`, `rectangle-perimeter`, `triangle-area`,
  `circle-circumference`, `circle-area`, `cube-volume`, `cuboid-volume`,
  `unit-conversion`, `pythagoras`, `triangle-angle-sum`). An unknown id
  falls back to the rectangle rather than failing. **Seed the investigation,
  never the rule**: the whole instrument exists so the student builds the
  relation themselves, and a lesson that pre-fills it would hand over the
  one thing it is there to discover (`MATH_LAB.md` §5o.2).

Contract, seed shapes and rules:
[`../architecture/MATH_LAB.md`](../architecture/MATH_LAB.md) §5b.3, §5b.6, §5c.5, §5d.6, §5f.4, §5g.8, §5h.8, §5j.9, §5k.9, §5l.10, §5n.10, §5o.8, §6.

**Adding a fifteenth instrument?** Besides its definition, its id in the server
registry and its Arabic strings, it owes « أعمالي » a `summarize(data)` — a
pure function returning a few hundred bytes that let the workspace draw its
preview and search its content **without loading the instrument**. The
checklist is `MATH_LAB.md` §3.2, the contract §5i.2, and
`summaries.test.js` fails if the function is missing, too large, or throws
on an unexpected state. Whatever the preview shows, it is drawn in **SVG**
from that summary — never a generated raster image (root `CLAUDE.md`).

**Which instrument for measurement, and what NOT to seed.** The measurement
lab (`measurement`) is the instrument for « قِس → قارن → صُغ القاعدة →
اختبر ». It is the one to open whenever a lesson would otherwise *state* a
formula for area, perimeter, volume, unit conversion, the Pythagorean
relation or the angle sum: the lab has the student build that formula from
their own measurements and test it. Do **not** press the 3D explorer (§5c)
into this role — it shows a solid and its computed volume, which is the
opposite gesture.

**Which instrument for reasoning, and what NOT to seed.** The logic & proof
lab (`logic`) is the instrument for « اقترح → اختبر → ابحث عن مثال مضاد →
ابنِ الحجّة ». Seed `{ area, statementId | implicationId | counterexampleId |
proofId | connector }`; every seed is re-read by the same guards as a stored
document (`MATH_LAB.md` §5n.10).

Three rules when a lesson opens it:

- **Seed a QUESTION, never an answer.** The instrument opens on
  `counterexample` precisely because §54 forbids opening on a menu. Seeding
  an area so the student *reads* that the converse is false wastes the one
  thing the lab does: let them find the counterexample themselves.
- **Formal logic is not on the 4AM programme** — the lab exists because
  *reasoning* runs through all of it: « أوجد مثالًا مضادًا » is exactly what
  LP 2.1's divisibility claims ask for, and « إذا كان n زوجيًا فإنّ n² زوجي »
  is the parity argument of the same unit. Seed `counterexample` or a
  concrete `proofId`; the quantifier notation (∀, ∃), De Morgan and the
  fallacy detector are built and correct but are **lycée** material and
  should not be what a 4AM lesson opens. Same rule as the unit circle
  (§5g.1) and the cobweb (§5h.1).
- **L'aire « البرهان بالتراجع » a deux escaliers interactifs — choisir le
  bon.** Ils ne posent pas la même question, et se tromper envoie l'élève
  vers une grammaire qui refusera ce qu'il écrit.
  - **L'escalier des PROPOSITIONS** (`MATH_LAB.md` §5n.6ter) est la forme du
    BAC : une proposition `gauche RELATION droite` (`uₙ < 3`, `wₙ = −2`) sur
    des suites **définies par récurrence** (`uₙ₊₁ = ⅓uₙ + 2`), y compris
    **auxiliaires** (`wₙ = uₙ − vₙ`, dépendances résolues seules). Six
    relations : `=` `≠` `<` `>` `≤` `≥`. C'est lui qu'une leçon ouvre pour
    une démonstration par récurrence.
  - **L'escalier des RÈGLES** (§5n.6bis) pose « ma règle décrit-elle cette
    suite ? ». Sa grammaire est **explicite uniquement** : `n`, les quatre
    opérations, les puissances, les parenthèses, le produit implicite. Le
    factoriel, `Σ` et les règles récurrentes n'y sont pas — une leçon qui les
    demanderait à CET écran enverrait l'élève vers une erreur.
  - Les exercices de l'escalier des propositions sont **déclarés**
    (`inductionExercises.js`) et **vérifiés par les tests** : suites,
    proposition et chaîne d'hérédité. Ajouter un exercice faux fait échouer
    la suite plutôt que d'atteindre un élève. C'est le modèle à suivre pour
    tout nouvel exercice de récurrence.
  - **Tester n'est jamais prouver.** Un escalier tout vert rend « تحقّق
    تجريبي », jamais « prouvé » ; seul le couple base + hérédité donne
    « برهان بالتراجع مكتمل » (§5n.6ter). Une leçon ne doit pas contredire
    cette distinction : c'est elle que l'écran enseigne.
- **A search is never a proof.** If a lesson asks a student to test a
  universal claim, it must not then call the result proved: the lab
  deliberately says « هذه ملاحظة، وليست برهانًا » and points at
  « بناء البرهان » (`MATH_LAB.md` §5n.5). A lesson's wording must agree.

**Which instrument for sequences — and whether to use one at all.**
**المتتاليات are not in the 4AM programme** (`ALGERIA_4AM_CURRICULUM.md`). The
sequences lab exists because one 4AM gesture genuinely needs it —
**«الفروق المتتالية»**, successive differences, named by LP 2.1 in the PGCD
lesson — and because الدوال الخطية/التآلفية (LP 3.7–3.8) have the arithmetic
sequence as their discrete cousin. A 4AM lesson may therefore seed
`kind: 'arithmetic'` with `layers: { differences: true }` to let a student see
a constant difference, and should **not** seed the cobweb, the fixed points or
the convergence layers: they are lycée material, built and correct, but never
what a 4AM lesson opens (`MATH_LAB.md` §5h.1). If a lesson only needs to
*place and compare* numbers on a line, that is a different instrument — the
**number lab** (`numberLab`), whose `line` mode does exactly that
(`MATH_LAB.md` §5l.5). Do not press the sequences lab into that role.

**Which instrument for trigonometry.** The 4AM programme's trigonometry is
**النسب المثلثية في مثلث قائم** (LP 4.2–4.3): a *right triangle* and *acute*
angles. A lesson on جيب / جيب تمام / ظل therefore seeds
`mode: 'triangle'`, not the unit circle — the circle is built and correct,
but it is lycée material and never what a 4AM lesson should open
(`MATH_LAB.md` §5g.1). Use `highlight: 'sin' | 'cos' | 'tan'` to have the
lab open with that ratio's two sides already lit.

**Which instrument for numbers, fractions and arithmetic.** The number lab
(`numberLab`) covers LP 2.1 and 2.2 of the programme — **قواسم عدد طبيعي
والقاسم المشترك الأكبر** and **الأعداد الأولية / كسر غير قابل للاختزال** —
and it is the instrument a 4AM lesson seeds for divisors, PGCD, primes,
factorisation, fractions, decimals, percentages or proportionality.

Seed `{ mode, value }` for a single number (`explorer`, `divisibility`,
`factors`, `primes`, `place`, `rounding`), `{ mode: 'gcdLcm', a, b }` for two,
`{ mode: 'fractions', fraction, right }` for fractions, or
`{ mode: 'percent', percent, quantity }`. Every seed is re-read by the same
guards as a stored document, so a lesson cannot produce a state the
instrument could not reopen (`MATH_LAB.md` §5l.3).

Two rules when writing such a lesson:

- **Do not seed a mode to show an answer.** The instrument's whole design is
  that the mathematics is *seen happening* — seed `gcdLcm` so the student
  runs Euclid, not so they read « ق.م.أ = 12 ».
- **A fraction seeded is not reduced.** `2/4` stays `2/4` on purpose: the
  student discovers equivalence by cutting the parts. If a lesson wants the
  irreducible form, it seeds the irreducible fraction.
