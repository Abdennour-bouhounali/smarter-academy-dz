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
their synthesis, four new manipulation types — MANIPULATION_CONTRACT §2sexies), and the same day a fifth,
`…/jumal-muadalatayn/` « جمل معادلتين من الدرجة الأولى بمجهولين » (three lessons and their synthesis, three new
manipulation types — MANIPULATION_CONTRACT §2septies), and since 2026-10-02 a sixth,
`lessons/moyen/4am/tanasubiya_duwal/tanasubiya-dala-khattiya/` « الدالة الخطية والتناسبية » (five lessons and their
synthesis, four new manipulation types — MANIPULATION_CONTRACT §2octies), the first unit under a DISPLAY ميدان decided
by the owner, « ميدان التناسبية والدوال », and the same day a seventh under that ميدان,
`…/tanasubiya_duwal/dala-taalufiya/` « الدالة التآلفية » (five lessons and their synthesis, five new manipulation
types — MANIPULATION_CONTRACT §2nonies), and the same day an eighth, `…/tanasubiya_duwal/ihsa/` « الإحصاء » (four lessons and
their synthesis, four new manipulation types — MANIPULATION_CONTRACT §2decies; programme domain « ميدان تنظيم المعطيات »), and the
same day a ninth, the first GEOMETRY unit, `lessons/moyen/4am/handasa/khassiyat-talis/` « خاصية طالس » (three lessons and their
synthesis, five new manipulation types — MANIPULATION_CONTRACT §2undecies — under the programme's own « ميدان الهندسة »).
These nine units are the **only** lesson content in the repository. The French-era lessons (`lessons/college/`, `lessons/lycee/`), their
specs, practice content, e2e scripts and French-only engines were deleted on
2026-09-25; older docs that cite them are describing git history.

**Frozen reference (2026-09-29).** The lesson architecture was audited and
frozen for generation: §14 is the generation contract — what a generated
lesson must implement, reuse and pass.

**Loading (since 2026-10-14).** A new lesson costs the entry bundle ≈ 20 bytes gzip — one line of the GENERATED
lesson index (`lessons/lessonIndex.generated.json`: id, level, grade, chapter, `[number, slug]` per module). Its
`routes.jsx` and `lesson.config.js` load WITH the lesson through ONE lazy route boundary
(`lessons/lessonRouteBoundary.jsx`, mounted once in `App.jsx`), its lab strings (`lesson.manipulation.json`) load with
the first lesson opened, the shared lesson runtime is one lazy chunk, and each page/module is its own lazy chunk. You
never touch `App.jsx`: run `node scripts/generate-lesson-index.mjs` (`npm run check:lessons` fails when the index is
stale, and when the entry exceeds its budget). Never import something heavy from `routes.jsx` or
`_unit/lessonRoutes.jsx` — every lesson shares them. See
[`../architecture/BUNDLE_BOUNDARIES.md`](../architecture/BUNDLE_BOUNDARIES.md).

---

> **Supported screens: tablet and laptop only (owner, 2026-10-15)** — widths ≥ 768 px (768×1024, 1024×768, 1280×800, 1366×768, 1920×1080). Phones are NOT supported: do not design, tune or test for phone widths (320–430 px); older mentions of them below are superseded.
> **Enforced since 2026-10-27 (owner):** every lesson route (index and modules) and every practice route (`/espace/pratique/*`, `/espace/tashih/:id`, the teacher's `/enseignant/pratique/*`) sits behind the layout route `components/auth/RequireLargeScreen.jsx`. On a phone (`(max-width: 767px)`, or a touch screen under 500 px high = a phone held landscape) it renders « محتوى الدروس يظهر فقط في شاشة الحاسوب — رجاء افتح المنصة في الحاسوب لاستفادة قصوى » (`common.json › largeScreenOnly*`) instead of the content, and nothing of the lesson loads. **Generate for tablet and laptop ONLY** (owner, 2026-10-27): no `sm:` / `md:` Tailwind variant, no `@media (max-width: <768px)`, no phone-only element, no lab width branch under the 354 px lab-box floor. The phone code of every existing lesson was removed the same day. The rule, the measured floor and the exceptions are in `MANIPULATION_CONTRACT.md` §8bis « Screen floor ». Branches from 360 px up stay: a tablet in portrait, or the map column at 1024 px, really gives a lab that width. Test: `RequireLargeScreen.test.jsx`.

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
  "completed" because it seems incomplete. **The extraction is the REFERENCE of
  what the lesson must teach (its الكفاءات, definitions, notations, expected
  answers) — not the script of the lesson.** The entry point, the examples, the
  contexts and the order of ideas are DESIGNED by the platform (§4ter, owner rule
  2026-10-14).
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
              └── الكفاءات   learning points
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

**How a lesson is mounted (2026-10-14).** Nothing to wire by hand. The FOLDER name must be the lesson id (the
loader finds a lesson by its folder). `node scripts/generate-lesson-index.mjs` adds the lesson to
`lessons/lessonIndex.generated.json`; `App.jsx` mounts one `<basePath>/*` route per index entry, which loads the
lesson's `routes.jsx` (and so its config) and then mounts the routes it builds. Code that needs the full config
outside the lesson's own pages calls `loadLessonConfig(id)` / `useLessonConfig(id)` (`lessons/registry.js`,
`lessons/useLessonConfig.js`); synchronous questions (built? module count, first module, module path) go to
`isLessonBuilt` / `getTotalModules` / `getFirstModuleNumber` / `getModulePath`, answered from the index. Lab
strings go to `i18n/locales/ar/lesson.manipulation.json` (keys `lesson:manipulation.<type>.*`), never `lesson.json`.

### Adding a GRADE (done for 1AM, 2AM and 3AM, 2026-10-14 — cycle moyen rollout phase 2)

A grade is data, not code. It is never a parallel catalogue.

1. **The trio** in `packages/core/curriculum/dz/`:
   - `programme_<g>_2026_2027.json`: its ميادين and topics. For 1AM–3AM it is minimal, derived from
     `net/official_programme_moyen.json`: chapter ids `ansab_al_aadad_wal_hisab` / `tanasubiya_duwal` / `handasa`,
     one topic per مقطع.
   - `units_<g>_2026_2027.json`: the textbook's units, plus `chapterIcons` / `chapterOrder`.
   - `lessons_<g>_2026_2027.json`: every lesson in the 4AM shape. A lesson not yet generated has
     `status: "coming_soon"`. `LEARNING_NET.md` §2.4 lists the fields.
2. **Register it once:**
   - `coursesData.js › DZ_MOYEN_GRADES` (one line);
   - `net/learningNet.js › LESSON_FILES / UNIT_FILES`;
   - `activeGrades.js › ACTIVE_GRADE_IDS`;
   - the literal grade lists of the two LAZY `import.meta.glob` of `apps/web/src/lessons/lessonLoaders.js`
     (`lesson.config.js` and `routes.jsx`; `registry.test.js` compares each with `ACTIVE_GRADE_IDS`, `check:routes`
     checks every lesson's grade is globbed). The lesson index (`scripts/generate-lesson-index.mjs`) follows
     `ACTIVE_GRADE_IDS` by itself.
   - The teacher memo's glob already covers `lessons/moyen/*/`.
3. **What a `coming_soon` lesson gets for free:** a non-clickable card « قيد الإعداد ». Its unit page shows its
   الكفاءات with no progress or gesture. `getLessonPath` returns `null`, so no link leads to it. It is in the
   database as a `draft` lesson with all its LPs, which Mastery V2 ignores (`LEARNING_NET.md` §3bis).
4. **Lesson codes and unit codes are unique across all grades** (`coursesData.test.js`, `learningNet.test.js`): the
   API resolves lessons by bare code.
5. Then the DB handshake (§11) and `npm run generate:learning-net`.

Generating one of those lessons follows §14 and `LEARNING_NET.md` §4. Publishing it is § « Publish a lesson »
(§11).

### Generating a 1AM–3AM unit LESSON BY LESSON (phase 3, first done 2026-10-14 — 1AM unit 2, `mana-jam-tarh`)

The 4AM units were written whole; 1AM–3AM units are generated one lesson at a time along the net queue, each lesson published
before the next. What that adds to « Adding a textbook UNIT »:

- **Seed the unit at its first GENERATED lesson** (not necessarily its first lesson): `lessons/moyen/<g>/<chapter>/<unit>/_unit/` with
  `unitMeta.js` (grade labels: `GRADE_ID '1am'`, `GRADE_LABEL 'السنة الأولى متوسط'`, `PRINT_SUBJECT 'الرياضيات · السنة الأولى متوسط'`,
  `CHAPTER_TITLE` = the grade's own ميدان name, D13) and the three one-line bindings. Its `prepDiagnostic.test.js` compares the
  lessons on disk with the unit's **`available` lessons of the catalogue**, never with a fixed count.
- **Extract the whole unit once** (`docs/sources/<g>/unit<N>/build-extraction.py` → `extraction.json`, answers computed in exact
  decimals): its `destinations` may name lessons that are still `coming_soon`. `check:textbook` counts those elements **pending**
  (« en attente ») until the lesson exists; a pending destination must be a real catalogue lesson, and no other lesson may cite it.
- **Publishing flips one entry** (§11): `coursesData.test.js` now checks, for 1AM–3AM, « `available` ⇔ `lesson.config.js` on disk »
  (like 4AM's `decomposition.test.js`) and that `lessonCount` counts the published ones.
- **Two lessons share one programme item** (1AM `1am.m1.r02`: `kitabat-adad-tabii` and `kusur-ashriya-kitaba`, 2026-10-14): write the
  BOUNDARY once in the unit's `build-extraction.py` header (what each lesson owns), split a textbook element that straddles it with
  `destinations.<id>.items` (know-4 p. 13: item a → the first lesson, item b → the second), and move a draft الكفاءة's overlapping part
  to the lesson that teaches its prerequisite knowledge (never two LPs teaching the same thing — the net's no-duplication rule).
- **Authors in parallel on one lesson**: the lead writes the lesson, a lab author and a bank author work from a brief kept in the
  repo (`docs/sources/1am/unit2/brief-authors.md`: the lab's FIXED props contract, file ownership, the bank's provenance rules).
- **Make it visible locally** (owner, 2026-10-14): after the DB handshake, publish the lesson's `lesson_modules` and
  `practice_exercises` rows in the LOCAL database (they are born `draft` and must not stay so — rule « nothing generated stays draft »,
  § « Publish a lesson » step 4), so the owner can browse it before `dev` is promoted.
- **Textbook exercise figures in أتمرّن** (`hasil-qisma-kasr`, 2026-10-15): `TextbookExercise` draws no figure. A module renders the exercise's `GeoFigure` data (`content/figures.js`: hidden points, `polygons` tones for coloured cells, `figureQuality` + recomputed fractions in `content/content.test.js`) above it; a redesigned figure (illegible scan, e.g. the test tubes) says so in one line (`REDRAWN_NOTE`). Keep each figure ≤ 150 px wide on phones or the page overflows at 320 px (an exercise with a long KaTeX chain in a batch `label` did too: split it).
- **Batch 4 lessons (`kusur-ashriya-kitaba`, 2026-10-15) — patterns to reuse.** (1) `validate:lessons` requires the two levels of a lab resource to carry the SAME `objective` string. (2) One lab TYPE may serve two modules with different worlds (`decimal-comma`: `mosaic` in module 1, `machine` in module 4): the module passes its own `world` and `tasks`, the `levels.js` preset only fixes the module-1 numbers. (3) An exercise redesigned from several textbook elements cites the others in `cites: [src(...)]` (collected by `check:textbook`); `src()` without `number` so the student never sees « تمرين N ». (4) Final-test epreuves stay LITERAL in `Module09Itqan.jsx` (the audit reads them statically) while `FINAL` in `content/exercises.js` holds the same data for `content.test.js`, which recomputes every key in exact BigInt arithmetic and asserts the module source contains each option. (5) A bare number in an option (`3,8`) is wrapped as a math island by `vary`/`num` in `exercises.js`. (6) `learningNet.test.js` forbids a forward net link between published lessons for 4AM only.
- **Batch 4 entry 2 (`muqaranat-adad-ashriya`, 2026-10-15) — more patterns.** (1) A lab used ALONE in a module (`levels={false}`, e.g. `ruler-compare` in module 3 with its own `tasks`) is declared in `resources` WITHOUT `level` / `objective` / `experience` (a levelled resource without its twin fails `validate:lessons`); only the module-1 workspace carries the two levelled resources. (2) Comparison rows are written from DATA: `rel(p, q)` builds the symbol row (`<`, `>`, `=` in a fixed order, the key computed with exact integers) and `content.test.js` RE-parses each label with its own BigInt comparator — never trust the helper that wrote the key. Chains « a < b < c » are parsed back and checked sorted; `FINAL` epreuves carry a `kind` (`trueStatement`, `larger`, `ascending`, `max`) that the test evaluates. (3) A textbook ACTIVITY made of student answers to judge (act-5) becomes a `trueFalse` exercise (`rows: [{ text, answer, why }]`) in أتمرّن, not the entry. (4) `GuidedProblem.illustration` of kind `tags` takes 1–3 cards (`validateProblem`): group several values on one card (`lines`). (5) The unit's extraction destinations follow the redesign: `act-5`, `deep-3` ③④ and `ict` moved to module 4 in `build-extraction.py`.
- **Batch 4 entry 3 (`masahat-muhit-sath`, 2026-10-15, the first 1AM geometry-measure lesson) — patterns to reuse.** (1) A unit whose chapter is `handasa` is seeded under `lessons/moyen/1am/handasa/<unit>/` with `CHAPTER_TITLE` = the grade's own ميدان name (« ميدان الأنشطة الهندسية »). (2) **Squared-paper figures are DATA, not hand-typed GeoFigures**: `content/figures.js › cellFigure(rows)` turns rows of text (`#` full cell, `.` empty, `◤ ◥ ◣ ◢` half cells cut by a diagonal) into a validated GeoFigure (one polygon per cell, contour segments, `grid: true`); area and perimeter are NEVER typed — exercises derive their keys from the cells and `content.test.js` recomputes them with different code (symmetric difference of cell sides) and checks every distractor false. A lesson `config.lessonProblem.figure` must be a pure literal (write the outline polygon, test it with the shoelace formula). `GeoFigure` inside a BossFinal prompt takes the JSX prop `inline`. (3) A lab used in module 1 with two levels AND alone in module 3 in another world (`tile-yard`: `yard` then `floor`) declares only the module-1 workspace resources with `level`/`objective`; the module-3 resource has none. (4) When two tools of the lesson would state the same idea (the unit-② rule in the method AND in the next question), the METHOD keeps only what the lab has already shown and the rule is named after its question (`wahdatan-adad`). (5) Exam corpus with NO exercise tagged for the lesson's items (`1am.m2.r06/r07`): the bank models the nearest register (perimeter-as-boundary and fence cost) with only the lesson's concepts, `term_exam_modelled`.
- **Phase A entry 2 (`khassiyat-fitaghuras`, 3AM, 2026-10-20, the first 3AM geometry lesson) — patterns to reuse.** (1) **Two lessons share the same programme items** (`3am.m4.r03`, `3am.m4.x1` for the property AND its converse): the boundary is written once in the unit's `build-extraction.py` header — the property's lesson owns the direct statement, computing a side and the CONTRAPOSITIVE (prove « غير قائم »), the converse's lesson owns « IS right », deciding the nature in both cases and distinguishing the two in a proof; every « قائم أم لا » textbook element is split with `destinations.<id>.items` (the « no » case here, the « yes » case to the converse: `method-2` FEJ/ABC, `now-2` b/a, `ex-16` 2/1, `self-4` HDB/RPM). (2) **A calculator key is not a rebuild**: when a later year BUILDS a notion (4AM `jidhr-tarbii` builds √), the earlier lesson uses only the KEY (`√` → exact `√n`, a value rounded half-up, never truncated) and its lab may offer the key only after the hand has met the resistance (`ROOT_AFTER` pours). (3) **Right triangles are drawn AT SCALE** (coordinates = lengths in cm) through a small `triangle()` helper in `content/figures.js` that records `MEASURES`; `content.test.js` re-measures every printed length from the coordinates and checks every marked right angle by a null dot product; a triangle that only LOOKS right (`ex-17`, 88,8°) gets no right-angle mark. (4) **Independent arithmetic in tests**: keys are recomputed with decimals as BigInt hundredths (squares in ten-thousandths, `isqrt`), never with the lesson's core module. (5) **The final test's options are literal in `Module08Itqan.jsx` while `FINAL` holds the data**: an option with a backslash (`\\neq`, `\\sqrt`) appears DOUBLED in the raw module source — the content test compares `o.replace(/\\/g, '\\\\')`. (6) **A published lesson changes a net test's fixture**: `learningNet.test.js` asserted the Pythagoras lesson as `planned`; publishing flips it to `available` (update the assertion in the same task).
- **Phase A entry 3 (`tabsit-hadhf-aqwas`, 3AM unit 4 « الحساب الحرفي », 2026-10-20, the first lesson of the unit) — patterns to reuse.** (1) **The boundary with the NEXT lesson of the unit is written in `build-extraction.py`'s header** (here: simplify = like terms, product of monomials, brackets after + / −, sum vs product; `nashr-jabri-3am` owns `k(a + b)` and `(a + b)(c + d)`), and a textbook element that straddles it is split by `items` (`deep-43` أ، د here and ب، جـ there; `now-59` ① / ②); an element that only the next lesson can use goes there even when the book places it in the first (`deep-47`, the magic square). The whole-unit extraction (79 elements, pp. 54–69) computes every printed answer with an exact `Poly` class and re-checks it by assertion. (2) **Review links toward lessons not yet published** (`tawzi-darb-jam-tarh`, `amaliyat-natiqa`): « أستعدّ » measures exactly the two net items with two platform statements each, plus two rewritten textbook statements (`prep` 5 and 8); `pointPrerequisites` stay intra-lesson. (3) **Algebraic answers are CHOSEN, not typed**: an expression is DATA (`{ c, p }` terms and `brackets.js` groups), every option is written by `tex()` from terms, and `content/content.test.js` re-evaluates the key and every distractor at 9 values of x with its own evaluator (two polynomials of degree ≤ 2 that agree at 9 points are equal; the « only the first sign changed » and « signs kept » distractors are tested FALSE). (4) **Where `$…$` is NOT rendered**: a JSX `prompt={<span>…$x$…</span>}`, a brick `lead` and a `GuidedProblem` `data[].text` (InfoSorter) print the dollars raw — wrap a prompt in `<MathText>{String.raw`…`}</MathText>` and keep leads and `data` texts free of `$` (« 2x + 5 » in plain text); the e2e raw-text scan catches it. (5) **`GuidedProblem` rules met here**: a `solution` step needs ≥ 2 lines, every ask needs an answering `numeric` / `choice conclude` step, `illustration` kinds `plan` (shape `tri` with its three side expressions, or `rect` with `w` / `h`) and `tags` carry expressions as plain strings that must appear in the statement. (6) **One screen is measured on the REAL lesson page at 1024×768 with the sidebar open** — the content column is only ≈ 450–520 px wide there, so a lab that fits on a scratch page can still overflow (`like-terms` stacks its side panel under the table below 660 px and was tightened for 1024×768). (7) The unit's `prepDiagnostic.test.js` is red until the catalogue flip (« the published lessons »), as for every first lesson of a unit.
- **Phase A entry 4 (`nashr-jabri-3am`, 3AM unit 4, 2026-10-21, the SECOND lesson of a unit whose first is published) — patterns to reuse.** (1) **A lesson that follows a published lesson of the same unit** recalls it in a « تذكّر » `TextbookBox kind="remark"` placed in the `brief` of معارف (with `getLessonPath(code)` as a link — the base IS published, so the link shows), never reconstructs it, and takes a cross-lesson LP edge ALONG the net link (`3am.m5.r01 → 3am.m5.r02`: `P4 ← 3am_tabsit-hadhf-aqwas_P1`, `P1 ← …_P3`); « أستعدّ » still measures every review item (the unpublished one with two platform statements, the published one likewise, plus two rewritten textbook statements). (2) **Elements that straddle a boundary are re-routed in `build-extraction.py` when the second lesson is generated**: the whole-unit extraction already named this lesson as destination for ~35 elements, the lead re-read pp. 55 and 57–67 at 100–220 dpi, set `verified: True`, replaced the typed answers by `Poly` computations with assertions (a mis-computed value was caught: `(5·1/5 − 6)(1/5 + 4) = −21`, `(x−4)² − (x−2)(x−8) = 2x`), moved the elements that belong to the synthesis (`deep-35`, `deep-47`: an illegible grid) there with a note, and gave the module numbers of the ones the modules cite; the **bank cites the rest** (23 elements, one adapted exercise each — `check:textbook` accepts a citation by the same lesson's practice content). (3) **Two worlds of one lab type, one per module** (`area-split`: `plot` levelled in module 1, `arrows` alone with `levels={false}` and the lesson's `tasks` in module 3): the module-3 resource declares no `level` (batch-4 pattern). (4) **Algebra answers as DATA**: an exercise row carries `products: [{ sign, f1, f2 }]` (`f1`, `f2` = lists of `{ c, p }` terms), its key is `expandAll(products)` written by `tex()`, `content.test.js` re-evaluates the key and every distractor at 9 values of x with its own evaluator (a product of two degree-≤ 1 factors is degree ≤ 3: 9 points suffice); the lab tasks are re-derived from the written expression in the same test. (5) **Remarkable identities and factoring stay out**: `(x+3)²`, `(x+1)(x−1)`, `2010 × 81` are expansions (mental-calculation applications in the bank); the extraction header says so once. (6) **The textbook's ACTIVITY (two pre-cut rectangles) becomes an application**: the entry is a plot whose cut the hand moves, and the book's rectangles are the first exercise of أتمرّن (`act-3`). (7) **`GuidedProblem` details met here**: a `choice` with `ask` must be `role: 'conclude'` (a `translate` step may not carry `ask`); `illustration.kind: 'tags'` text values are free but `plan` sides must be literal expressions of the statement.
- **« مخطط بأقواس »** — the textbook's tape diagram (a line cut into parts, an arc above each part, an arc below the whole) is the
  shared figure `lessons/common/components/ArcTape.jsx` + `arcTape.js`: lesson figures, `statement.figure` with `kind: 'tape'`
  (dispatched by `StatementFigure` / `validateStatementFigure`), a مسألة `figure`, and the live tape of the `story-bars` lab. Lengths are
  schematic (≥ 16 % of the width per part); a statement tape must CLOSE (`validateArcTape`), a lab tape shows the gap / overflow of a
  wrong value. Unique SVG ids per instance (`useId`).
- **The first lesson of a new grade (2AM, `qisma-iqlidiya-hasr`, 2026-10-14) needed NO new wiring**: « Adding a GRADE » had
  already globbed `2am` (`lessonLoaders.js`), the index generator follows `ACTIVE_GRADE_IDS`, and the practice tooling reads every
  grade folder (`content/practice/2am/` is simply created by the bank). Seed `_unit/unitMeta.js` with that grade's labels
  (`GRADE_ID '2am'`, `GRADE_LABEL 'السنة الثانية متوسط'`, the grade's own ميدان name). While the lesson is still `coming_soon`, its
  MODULE pages mount (`…/<lesson>/nashat`) — that is what a parallel lab author opens — but its summary page says « هذا الدرس غير
  متاح حالياً » (the DB lesson is `draft` until the publish flip) and two tests are red by design until the flip:
  `coursesData.test.js` (« available ⇔ on disk ») and the unit's `prepDiagnostic.test.js` (« the published lessons »).
  `e2e/moyen-draft-grades.mjs` checked the drafting notice on the grade that still had NO published lesson (3AM, until
  `quwat-adad-nisbi` on 2026-10-21 — since then no grade is entirely draft: the script checks that 3AM has NO notice, that its other
  unit cards stay « قيد الإعداد », that a unit page links only to its published lesson, and that a « راجع » toward a published 3AM
  lesson is a link).
- **The first lesson of 3AM (`quwat-adad-nisbi`, 2026-10-21) needed NO new wiring either** (3AM was globbed by « Adding a GRADE »):
  seed `_unit/unitMeta.js` with `GRADE_ID '3am'`, `GRADE_LABEL 'السنة الثالثة متوسط'`, `CHAPTER_TITLE 'ميدان الأنشطة العددية'`
  (the 3AM programme's own name, D13). Patterns it adds: (1) its « راجع » lessons are all unpublished, two of them EARLIER in the same
  book (`qawaid-quwa-ashara`): « أستعدّ » measures each review item with platform statements, the same-year rules are RECALLED in
  معارف by a `TextbookBox kind="remark"` « تذكّر — قوى العدد 10 » (`addition('prior_year_reminder')`), and `pointPrerequisites` are
  intra-lesson only; (2) a lab used twice with two WORLDS (`power-train`: `build` levelled in module 1, `couple` alone in معارف with
  `levels={false}`) declares the module-2 resource without `level` (batch-4 pattern); (3) a lab whose hand holds a SIGNED integer on
  a graduated rail uses one knob with `role="slider"` (arrows, Home/End), a tap on the ruler, and a `StepperCard` −/+ row — the drag
  previews, the release is the trial (MANIPULATION_CONTRACT §2octovicies); (4) the extraction builder asserts `verified: True` for
  every element destined to the lesson generated now.
- **Phase A entry #7 (`muqarana-nisbiya`, 2AM, 2026-10-21, the first lesson of 2AM unit 3 « الأعداد النسبية ») — patterns to reuse.** (1) **A lesson whose prerequisite lesson is unpublished AND of the same book** (`talim-mustaqim-mudarraj-2`): « أستعدّ » measures its single review item (`2am.m4.r01`) by statements split into vocabulary (distance to zero, abscissa, opposite) — textbook items 5–7 rewritten + platform items — and never rebuilds reading or placing a point. (2) **A textbook activity answered by sight is not an entry**: the six thermometers (act-2) are read at a glance, so the rule is not needed; the entry is a lab where the hand holds the DISTANCE to zero and the sign is a consequence (`zero-probe`, MANIPULATION_CONTRACT §2novemvicies), and act-2 becomes an application in أتمرّن. (3) **One lab, three uses**: `levels` workspace in module 1, the same type alone (`levels={false}`, its own `tasks`) in معارف, declared in `resources` without `level`. (4) **A textbook misprint is corrected at generation and recorded in `discrepancies`** (know-1b prints « −2,5 < −4 »; ex-20 prints `−4,3 < … < −4,5`). (5) **An element whose content belongs to a later lesson stays out of this lesson even when its page is shared**: `deep-38` (a sum is always smaller…) needs addition, so it is `jam-tarh-nisbiya`'s. (6) **`GuidedProblem` `data` rows are plain text** (no `$…$`, the sorter does not render math: write `−3,25` with the real minus). (7) **Final-test options with a `x = …` prefix** stay literal in `Module08Itqan.jsx`; `content.test.js` accepts either `$o$` or `$x = o$`. (8) **The unit's challenge card cites its extraction element** (`units_<g> › challenge.sourceElementId: "challenge"`), otherwise `check:textbook` reports the `unit` destination uncited.
- **Phase A entries #5–#6 (`musawiyat-amaliyat` then `muadalat-darajat-ula`, 3AM unit 5 « المساويات – المتباينات – المعادلات », 2026-10-21) — patterns to reuse.** (1) **One programme item split in two lessons of the same unit** (`3am.m5.r05`: equalities here, inequalities in `mutabayinat-amaliyat`): the boundary is written once in the extraction header (this lesson never solves `ax + b = cx + d`, the next never flips an inequality) and a bank must not drift across it (« no inequality in #5 »). (2) **A recall lesson that EXTENDS an unpublished earlier-year lesson** (`muadalat-darajat-ula` extends 2AM `2am.m4.r08`): « أستعدّ » measures that item, معارف opens on a « تذكّر — السنة الثانية » `TextbookBox` whose link uses `getLessonPath(<code>)` (null while unpublished: no link), and `pointPrerequisites` add a cross-lesson edge ONLY toward the PUBLISHED lesson of the same book (P3 ← `3am_musawiyat-amaliyat_P1`, `_P2`, net link r05 → r06). (3) **Every extracted element needs a citation by its lesson**: when a lesson owns ~50 elements (`ex-29 … ex-65`) the redesigned exercises carry `cites: [src(…)]` for the ones they replace (`ex-49` cites the 15 `أتعمّق` modelling problems); `src('prep', …, n)` for the items kept; the final-test epreuves cite `self-N`. (4) **`GuidedProblem` `data[].text` and a `tags` illustration are plain text**: no `$…$` (the e2e raw-text scan catches it) — `3x − 40 = 200` with the real minus. (5) **Knowledge-map shape**: the layout tests refuse a guide node hung on the ROOT, a label that crosses a node and « guidance ≥ half the nodes » — hang a mistake under the SECOND node and keep ≥ 2 core nodes per guide node. (6) **A lab whose hidden value gives the refusal** (`term-ferry`: the solution x* is computed, never shown; `equality-lanes`: x hidden, the runners stand at the values): the discovery's wrong options are refuted with the student's own refused trial, so each lab REQUIRES one contrast trial (`oneSide`, `keepTried`) before its discovery opens and the LabCoach proposes it once. (7) **Native numbers, not the book's**: the lesson's beginner level uses the platform's own equation (`10 = 4x − 2`, `3x + 2 = x + 8`) and only the advanced level may use the textbook's (`9x + 1 = 5x − 7`). (8) **The extraction builder checks each prep item against its printed options** (`prep(n, …, options, correct, value)`) and each computed answer by exact `Fraction` assertions; unclear scan lines (`prep` 5, 11) were re-read at 200 dpi and recorded in `discrepancies`.
- **Phase A entry #9 (`tanasub-tamthil-bayani`, 3AM unit 6 « التناسبية », 2026-10-21, the first lesson of the unit) — patterns to reuse.** (1) **The unit challenge is made self-contained and cited**: the book's « البيان المقابل » points to a figure, so `units_3am › tanasubiya-sura.challenge.textAr` is rewritten with its data (« يقطع عدّاء 24 m في 4 s … »), `challenge.sourceElementId: "challenge"` is set and the extraction destination is `{ lesson: 'unit', module: 'page' }` — otherwise `check:textbook` reports the `unit` destination uncited and `UnitOpenerFigure` would need a drawing. (2) **A lab whose verdict is what a tool TOUCHES** (`pin-rails`, MANIPULATION_CONTRACT §2quinquatricies): the proportional / aligned-but-off-O / bent contrast comes from a ruler laid on two nodes, each lesson step quotes the student's own ruler trials (`count / total`, `cuts`); the lab never says « تناسبية ». (3) **A textbook proof that needs a later unit** (`deep-33` proves y = ax with Thales, taught in unit 9) is NOT posed: the exercise that replaces it computes the same fact (`cites: deep-33`) and the extraction records the scope conflict. (4) **Graph exercises are `GeoFigure` data** (`content/figures.js`: `planeFigure`, `brokenFigure`, axes + grid, points named A…E, O) kept to moderate aspect ratios (a = 0,75 … 2,5) because `GeoFigure` has one scale on both axes; `content.test.js` REMEASURES each figure from its data and classifies every table with BigInt cross products. (5) **Crowded rails**: a lab with pins 26 px apart grabs the NEAREST free pin on a press near the rail (`bgDown`), never overlapping 44 px hit circles. (6) **The unit's `prepDiagnostic.test.js` stays red until the catalogue flip** (as for every first lesson of a unit).
- **Phase A entry #10 (`nisba-miawiya-3am`, 3AM unit 6 « التناسبية », 2026-10-21) — patterns to reuse.** (1) **A lesson that CONSOLIDATES an unpublished earlier-year lesson** (net link `consolidates`, no `addedValueAr`: `3am.m7.r06` ← `2am.m6.r04`): « أستعدّ » measures the base item with platform statements next to the textbook `prep` items kept (7, 8, 9 rewritten), معارف opens on a « تذكّر — السنة الثانية » `TextbookBox` (`addition('prior_year_reminder')`, no link while the base is unpublished), and the lesson goes straight to the proportional treatment (the coefficient t/100, the table « الكلّ ↔ 100 », × (1 ± t/100)); `pointPrerequisites` stay intra-lesson. (2) **A lab whose coefficient becomes VISIBLE**: `hundred-grid` cuts the stock into 100 equal cells, one cell = x ÷ 100; the student WRITES the answer before the basket opens (`of`, `change`, `whole`) or searches it with the basket filling live (`rate`) — MANIPULATION_CONTRACT §2quattuortricies; distinct from `percent-tag` (4AM, a continuous bar). (3) **Exact keys in tests**: `content.test.js` recomputes every percent with BigInt rationals (`of`, `up`, `down`, chains, « the whole from the part »), the final-test options stay literal in `Module08Itqan.jsx` and a distractor is tested FALSE; the textbook's population / classes / prices activities become applications in أتمرّن with other numbers. (4) **Sizing a lab from BOTH screen height and column width** (`HundredGrid.jsx`: cell = min((screenH − 560) / 10, (stageW − basketW − 54) / 10)) keeps the grid and the basket side by side at 1024 × 768 with the sidebar open (content column ≈ 430 px) — a `flex-wrap` stage dropped the basket under the grid and overflowed the screen (847 / 768). (5) **A Playwright pointer test must scroll the target to the CENTRE** (`scrollIntoView({ block: 'center' })`), the sticky progress bar covers a grid scrolled to `start`.
- **Phase 0 « owner priority » entry (`maqlub-qismat-kasrayn`, 3AM unit 2 « العمليات على الكسور والأعداد الناطقة », 2026-10-25, the first lesson of the unit, which it SEEDS) — patterns to reuse.** (1) **Seeding a unit and extracting it whole in the same task**: `_unit/` (copy of `quwa-nisbiya/_unit`, the test date line adapted), `docs/sources/3am/unit2/build-extraction.py` → `extraction.json` for ALL the unit's pages (124 elements), `verified: True` only for the elements of the lesson generated now, the boundary of the five lessons in the script header, every printed answer recomputed with `Fraction` and the printed options of each QCM re-checked by assertion (this caught the plan's own `self-1` error). (2) **Scan islands may be printed in reverse order**: when a printed expression matches no option, test the right-to-left reading and record it in `discrepancies`. (3) **A lab whose hand holds a RATIO's consequence** (`gear-crank`, MANIPULATION_CONTRACT §2sextricies): the student turns a crank, the variable is the pedal turns, the wheel turns follow; the surprise (6 ÷ 3/4 = 8 > 6) is lived before it is named; a `reverse` world is posed ALONE in معارف (`levels={false}`, `tasks` from `LAB.reverse`, declared without `level`). (4) **Fractions as exercise data**: rows are built from literal strings (`'5/6'`, `'0,04'`) with `divRow` / `recipRow` helpers over `powers.js` + `fractions3.js`, the distractors are the lesson's three named mistakes (no flip, flip the first, flip both) and `content.test.js` re-parses every option back from its LaTeX with its own BigInt code. (5) **`GuidedProblem` numeric steps take numbers only**: a fractional answer is a `choice` with `role: 'conclude'` (options parsed back in `problems.test.js`), a decimal one (15/8 = 1,875) a `numeric` with `display`. (6) **`fractions3.js`** (`packages/core/arithmetic`) is the shared exact-fraction module of unit 2: `raw` (an UNREDUCED pair, d > 0) on top of `powers.js › rat`; later lessons add their functions to it.
- **Phase A entry #8 (`rabi-mutanasib`, 2AM unit 5 « التناسبية », 2026-10-21, the first lesson of the unit, chapter `tanasubiya_duwal`) — patterns to reuse.** (1) **A `consolidates` link is not a lesson to rebuild**: the net item `2am.m6.r02` consolidates `1am.m6.r04`, so « أستعدّ » measures the old routes (multiplicative, additive, the « same difference » trap) and the lesson builds only what is NEW (the cross-product equality `a × d = b × c`) and the CHOICE of route; the unit's sister lesson (`wadiya-tanasubiya-jadwal`, recognising a table) is measured too, never rebuilt. The boundary of the four lessons is in the header of `docs/sources/2am/unit5/build-extraction.py`; the element `now-75` and `know-1` are split by `destinations.<id>.items`. (2) **The 2AM ميدان of `tanasubiya_duwal`** is « ميدان الدوال وتنظيم المعطيات » (the grade's own name, D13). (3) **A lab whose hand holds the MISSING cell** of a 2×2 table (`fourth-gauges`, MANIPULATION_CONTRACT §2tertricies): three balances (per-unit price, between columns, cross products) lean the same way for any hole and balance together only at the fourth proportional; a decoy gauge « الفرق » that balances at the WRONG value refutes the additive misconception with the student's own release; level 2 veils the gauges until release (predict then check). Events carry `done` and `decoyHit`. (4) **« Which route avoids a non-terminating quotient » is a verifiable way to teach route choice** (3 kg ↔ 50 DA, 12 kg: `50 ÷ 3` is false, `12 = 3 × 4` is true): no distractor is a « longer but valid » route. (5) **`FINAL` options with an equation in x** (`3 × x = 8 × 9`) are evaluated at the known x by the content test, each wrong diagonal being false. (6) **`units_<g> › <unit>.challenge.sourceElementId: "challenge"`** was set at seeding, otherwise `check:textbook` reports the `unit` destination uncited. (7) The shared `LabCoach` gained an optional step field `noFlip` (bubble stays on its side when flipping would cover the work area; MANIPULATION_CONTRACT §8quater).
- **Phase 0 entry 1 (`jidaa-adadayn-nisbiyayn`, 3AM unit 1 « الأعداد النسبية », 2026-10-26, the first lesson of the unit) — patterns to reuse.** (1) **Generated from a PLAN** (`docs/sources/3am/unit1/plan/`): the lead of the unit's first lesson also seeds `_unit/` and the whole-unit extraction; the extraction (93 elements, 31 discrepancies) and the 50-sheet bank were each delegated to one helper with a written brief, the lead writing the lab and the lesson. (2) **A scan prints a purely numeric expression RIGHT-TO-LEFT** when the minus sign follows the digits (« 4-»): the extraction records each flipped reading and checks it against the printed options (`self-8`, `self-11`, `deep-47`, prep 11/12/13/15 here) — read a textbook figure's numbers with the options at hand, never literally. (3) **An unreadable box** (the history box of the opener, destroyed by pixel blocks) gets the SYNTHESIS as destination (module `None`, note « illisible ») like units 3 and 6, because `check:textbook` requires a `unit`-destined element to be cited by unit content. (4) **A lab whose hand holds a SIGNED TIME** (`elevator-reel`, MANIPULATION_CONTRACT §2septentricies): the module's questions read the student's own `onTrial` events by `taskId` (« في سجلّك: بعد 3 دقائق كان المصعد في الطابق −6 »), the lab itself asks the OTHER half of the rule (the distance) so the module's question about the signs is not asked twice, and a prediction stage (متقدم a1) does not mount the timeline at all until it is answered. (5) **Knowledge-graph texts**: `lessonGraphs.test.js` evaluates every `$a = b$` in a node — a common-mistake `wrong` line must be written in WORDS (« جداء $(-3)$ في $(-4)$ سالب »), never as a false equality, and a chain ending in `× 0 = 0` is read as `−0 ≠ 0` — split it into separate math islands. (6) **Every LP needs an assessment item** (`validate:lessons --strict`): with five final-test items and four LPs, one LP (P1 here, the repeated addition) took the item the plan gave to a second neg × neg case. (7) **Render tests run from `apps/web`** (its `vitest` config loads the lazy `lesson.manipulation.json` strings through `src/test/setupLessonStrings.js`; run from the repo root they show raw keys). (8) **Browser QA without the API**: the lesson e2e accepts `QA_STUB=1` (the page-tours stub: `/auth/me` answers `{ success, user }`, every other `/api/v1` call `{ success, data: [] }`, a teacher account) when the local API is down. (9) **The A × 0 = 0 rule is TAUGHT where the plan puts it** (طريقة, with the elevator whose speed is 0 for free in « جرّب أعدادك »), and a decimal slip (`0,6` for `0,06`) is a named misconception tested by a final-test distractor.
- **Phase 0 entry 6 (`tasawi-muqaranat-kasrayn`, 3AM unit 2 lesson 2, 2026-10-26) — patterns to reuse.** (1) **A later lesson of an already-seeded unit re-reads ITS elements**: render the pages with `pdftoppm -r 130` (260 dpi crops for doubtful islands), set `verified: True` with `Fraction` assertions in `build-extraction.py`, record every correction in `DISCREPANCIES` (here `ex-15` is 5/7 and 15/17, not 5/17; `ex-17`'s pairs; the plan's « 23/20 < 13/12 » was false) and move each element's module number in `DEST`. (2) **An element nothing cites fails `check:textbook`**: give a topically close exercise a `cites: [S('ex-9', 30)]` rather than inventing a question. (3) **A lab whose hand holds a NUMERATOR and whose impossible case does the teaching** (`shade-match`, MANIPULATION_CONTRACT §2octentricies): a button « لا يوجد عدد صحيح » that refuses until the two consecutive neighbours were tried (and never says which number works when a solution exists), a VEILED level whose commitment reveals the instrument, and a `compare` task closed by one prediction. (4) **Questions placed BEFORE a brick in a module `requires` the prior-year ids of `priorKnowledge`** (`muqarana-kasrayn-2am`, `kasr-mutasawi-1am`), never the id the brick establishes later: `audit:knowledge:gate` reports `E_REQUIRES_ESTABLISHED_LATER` as CRITICAL. (5) **Render tests of a lab run from `apps/web`** (`cd apps/web && npx vitest run src/…`): from the repo root i18n is not loaded and every string is a raw key. (6) **Bank sheets modelled on a SIGNED corpus exercise** keep its structure with positive fractions when the signed case belongs to a later lesson (EXERCISE_CONTRACT status line). (7) **Hot-reload flakiness in browser QA**: do not edit sources while a Playwright run is in flight (the lab remounts and the run times out).
- **Phase 0 entry 4 (`wadiya-idmajiya-aadad-nisbiya`, the FIRST 1AM–3AM synthesis, 3AM unit 1, 2026-10-26) — patterns to reuse.** (1) **A synthesis of a grade 1AM–3AM is generated INTO its `coming_soon` entry like a lesson**: `kind: 'synthesis'`, `programmeItems: []` stays (validators accept it), you ADD one `pointsToLearn` (P1) and `pointPrerequisites` toward the unit's lessons; this bumps the LP total asserted in `packages/core/curriculum/coursesData.test.js` (524). (2) **Shape = 4AM unit-1 synthesis**: 0 أستعدّ, 1–6 `GuidedProblem` (« الوضعية التدريبية », `track: 'problem'`), 7 `ContentModule` analysis (with `objectives`), 8 `BossFinal`; no lab, no `KnowledgeBrick`; `priorKnowledge` strings feed every `requires`. (3) **`durationMinutes` of a synthesis = modules 0 + 7 + 8** (problem tracks excluded) — `validate:lessons` warns otherwise. (4) **`masailIllustrations.test.js` demands an `illustration` (kind `scene`, digits taken from the statement only) or a `figure` for every problem**; `InfoSorter` items and `BossFinal` prompts do NOT render LaTeX: write sorter texts in plain Unicode, wrap string prompts in `MathText`. (5) **An illegible textbook element** can be declared `notIntegrated: '<reason>'` in `DEST` instead of giving it to the synthesis. (6) **Every `assessment` of a BossFinal epreuve must be a literal** (`learningPointIds: ['…_P1']` inline) — the validator reads source text, not constants. (7) **Bank of a synthesis**: modelled on the term-1 paper's « exercice 1 » + a context, one LP on every question, `MISC-WIDMAJ-*` for the new errors.
- **Phase 0 entry 2 (`jidaa-ida-nisbiya`, 3AM unit 1 lesson 2, 2026-10-26) — patterns to reuse.** (1) **A lesson that follows the published first lesson of the SAME programme item** recalls it in a « تذكّر » `TextbookBox` in the `brief` of معارف (`addition('prior_year_reminder')`, link by `getLessonPath`), measures its product in « أستعدّ » (`priorKnowledge` outside the net) and takes cross-lesson `pointPrerequisites` toward it (no net link is crossed: both LPs belong to `3am.m1.r01`). (2) **A drag gesture needs the card draggable and the badge a SIBLING button**: `DraggableObject` is a `<button>`; a sign badge inside it is a nested button (invalid, and its click starts a drag) — the tile is a div, the number area the draggable, the badge a separate `<button>` (a 44 px pill). (3) **Evidence-based questions**: `onTrial` events (`kind: 'run'`, `taskId`, `negatives`, `stop`) feed the module (« في سجلّك … »); a question may be built FROM the record (the options of module 1 q2 are the student's own pair of counts, the correct one first) — the lab writes the count, the student never types it. (4) **A lab world posed alone** (`square`, `levels={false}`) is declared in `resources` without a level and carries its own task list (`LAB.square`). (5) **Bidi of a verdict island**: digits and signs without a strong LTR character are ordered as RTL (`−5` shows `5−`); wrap with `LRI` + `LRM` … `PDI`. (6) **A Playwright pointer test must use `behavior: 'instant'` on `scrollIntoView`** — the page scrolls smoothly, a drag started mid-scroll misses its target; read the FINAL value from a `data-stop`-like attribute, not from an animated position. (7) **The dev server reloads the page when another process edits `content/practice`** (`watchPracticeContent`): a flaky e2e on a shared tree is not a lesson bug. (8) **A scan reading disproves a plan**: re-reading `now-11` at 500 dpi showed « 85 » (last digit certain, odd) against the plan's « 50 » — the parity decides, so the extraction records the reading and the lesson uses its own numbers. (9) **A task whose flag is checked mid-programme** (`at: 2`) still requires the whole programme to be placed; the verdict writes the probe stop (« بعد البطاقتين الأوليين »).
- **Phase 0 entry 3 (`qismat-nisbiyayn`, 3AM unit 1 lesson 3, 2026-10-26, the LAST lesson of the unit) — patterns to reuse.** (1) **A quotient is taught as a MISSING FACTOR:** the lab's lock multiplies live (`b × code`), so the definition `a ÷ b = q ⇔ b × q = a` IS the mechanism, the sign rule is discovered from the signs of the two numbers on the doors whose code came out positive (the module asks about the student's own openings), and the lesson never states « سالب ÷ سالب = سالب » — its refusal does (`(−12) × (−5) = 60`). (2) **A rolling gesture is a `role="spinbutton"` in DOM:** vertical drag (`setPointerCapture`, one notch per 26 px), ▲ / ▼ buttons (`tabIndex -1`), ↑ ↓ on the focused wheel, ← → between wheels, typed digits; a sign wheel toggles on a tap; a locked wheel keeps `data-locked` and `aria-disabled`. A PREDICTION is a locked step: the digit wheels stay locked until the sign is committed (« ثبّت »), and the refusal of a wrong committed sign is written with the SAME distance and the wrong sign. (3) **Never rotate a DOM block in 3D without clipping it:** `perspective(…) rotateY(…)` on a door projected outside the card, covered the verdict and swallowed its clicks; the locker is `overflow-hidden`, the open door is `pointer-events: none`, and the angle that goes AWAY from the viewer is the positive one for a left hinge. (4) **Bidi is MEASURED, not looked at:** compare the x of the first and last character of an island with `Range.getBoundingClientRect()` (a screenshot read by a model mixes the order of LTR islands inside RTL text); the elevator-reel verdict of lesson 1 was checked this way for t = −3 … 3 and needs no LRM in Chromium (robot-track and code-lockers keep `LRI` + `LRM`). (5) **Fractions as ANSWERS of a lab, not of a question:** `NumericQuestion` takes decimals (`parseDec`), a non-decimal quotient is chosen, and a « which writings open the lock » question is a yes/no `BatchChoiceQuestion` (the kit has no multi-select). (6) **A wrong corpus note was found by re-reading the scan:** `3am-s1-2` ex 3 prints `(−10) × 2 × 0,1 × (−7) × (−0,5) = −7` (the `−70` was a misreading in a sister bank sheet), so a note « checked on the scan » is re-checked before it is copied. (7) **`learning-net-queue.mjs` queues a unit's synthesis when its LAST planned lesson is pushed** — once a unit's last lesson is published nothing pushed it (« leçons prévues hors file ») and the owner loop now queues it. (8) **Knowledge-map layout:** a node that has a mistake child goes in lane `end` (the label of its other edge crosses the mistake node otherwise) and every title is ≤ 28 characters. (9) **LabCoach bubbles prefer `below`** when the plate above the wheels states the rule; e2e `fillNumber` must pick `input:not([disabled]):not([readonly])` because an answered `NumericQuestion` keeps its input.
- **Phase 0 entry 7 (`jam-tarh-kasrayn`, 3AM unit 2 lesson 3, 2026-10-26) — patterns to reuse.** (1) **Module questions that quote the student's OWN refusal**: the lab's `refused` event carries `N` and `zone`; the module builds its options from them (cases = N × a/b as « between k and k + 1 » when the quotient is not a decimal, « لأنّ N ليس مضاعفًا للعدد b » with b the failing zone's denominator) and each question block is rendered ONLY once its `Evidence` exists (no `undefined` placeholders). (2) **A lab task that is done stays playable** when a later gesture depends on it (`seed-rake`: the star « أوسع مسافة؟ » needs two working spacings, exactly when g1 is done): emit `solved` once (`!s.done[s.ti]`), keep the controls, hide them only for locked prediction tasks. (3) **A textbook example is never reused**: the plan's examples (`1/6 + 4/5`, `7/10 − 3/8`) were the book's own, so the lesson uses `2/9 + 5/6` and `11/12 − 5/8` (record it in the plan's « Generator notes »). (4) **« counted: true » for an earlier lesson's step is impossible** in a bank: `validate-exercises` requires each question's learning point to belong to the lesson, so `maqlub` / `tasawi` steps are `counted: false` with this lesson's P2. (5) **An element only the bank can cite** (`self-2`, `self-3`, `deep-80`) has destination module `None`; a recall box may cite a 2AM-case element (`method-5`) because the unit's prep test accepts a textbook item only as `prep`. (6) **Pointer-to-N drag**: the whole bar is the grab (`nFromX` rounds `1 / spacing`), so precise values above ≈ 20 are reached with the ± buttons or Shift + arrows (a Playwright test uses `dragTo(n ≤ 15)` then buttons). (7) **`learning-net-queue.mjs` fails « leçons prévues hors file »** while another lead's synthesis edit is in flight: it is the coordinator's regeneration, not a lesson bug. (8) **Browser QA with a shared tree**: Vite reloads the page when another process edits tracked files; re-run before concluding a lab loses its state.
- **Phase 0 entry 8 (`adad-natiq`, 3AM unit 2 lesson 4, 2026-10-26) — patterns to reuse.** (1) **A lesson that RECALLS two published bases** (`qismat-nisbiyayn` for the sign of a quotient, 1AM `hasil-qisma-kasr` for decimal-or-not) measures them in « أستعدّ » (`priorKnowledge` ids `<lesson>-<grade>`, the `requires` of the questions that precede the first brick) and opens معارف on two « تذكّر » `TextbookBox` es with `getLessonPath` links; its `pointPrerequisites` cross one net edge (`P1 ← 1am_hasil-qisma-kasr_P1`, `P2 ← 3am_qismat-nisbiyayn_P3`). (2) **A lab whose cards are DOM over an SVG** (`number-line-pegs`): children of a zero-width absolutely positioned wrapper need an explicit `left: 0` — in an RTL page their static position is the right edge and every card was shifted half a width; a `Playwright` visibility check fails on a zero-width wrapper, read the attribute through the visible parent (`vis(page, '[data-npp-glance]').locator(...)`). (3) **The pointer capture trick**: the basket card calls `stage.setPointerCapture`, so the stage's move/up handlers run for a drag that began elsewhere; a tap (< 6 px) keeps the card in hand for a second tap on the rope. (4) **One chip per pile**: equal values stack, so annotations (standard writing, `×n`, slide in twelfths) belong to the FRONT card only. (5) **The textbook's printed key can be false**: `self-9` prints « > » where only « ≠ » is true — recompute every key and record it in `discrepancies`. (6) **`durationMinutes` of the catalogue = the modules WITHOUT the مسائل** (here 65; 89 with them, cap 90). (7) **Bank by a helper from a written brief** (50 sheets, oracle, MISC ids) while the lead writes the lab and the lesson; the helper's only dependency on the lead is the LP ids and the element ids to cite (`ex-25`, `ex-29`, `self-4` cited only by the bank).
- **Phase 0 entry 10 (`qimat-ibara-harfiya`, 3AM unit 4 lesson 3, 2026-10-26, a later lesson of an already-seeded unit) — patterns to reuse.** (1) **A new shared maths module for the unit** (`packages/core/arithmetic/substitution.js`: expression TREE, exact `evaluate` / `trace`, the written LINE as tokens, a strict literal `readLine`, `judgeLine`, polynomial normal form) is built on `powers.js` rationals and imported by path; the same module serves the lab, its logic and (in tests) nothing else — `content.test.js` re-evaluates every key with its OWN BigInt-rational evaluator written in the test. (2) **Value rows as data**: a row is `valueRow({ name, expr, env, key, right, wrongs })` with literal LaTeX options and `data: { expr, env, key }`; the test parses every option back (`\frac{a}{b}`, `{,}` decimals, « p و q » pairs) and asserts the key option is the only one equal to the recomputed value — write fractions as `\frac{7}{2}` (not `\frac72`) so they can be parsed. (3) **Evidence-based module questions** read the lab's `run` / `solved` / `drop` events by `task` (« سطرك الأول أعطى 2 فتوقّف المسار عند الناسخة »); a question must also read well when the student never met the refusal. (4) **A lab world posed alone** (`twins`, `levels={false}`, tasks from the logic) in معارف/طريقة after a levelled workspace in the first module (declared in `resources` without `level`). (5) **A cross-lesson `pointPrerequisites` edge toward a lesson published by another lead in the same batch** (`P1 ← 3am_amaliyat-natiqa_P4`) is written once its catalogue entry shows its final الكفاءات. (6) **Unit challenge card**: its text may be rewritten with own numbers (here 126,4 and 5) while its extraction element stays destined to the sister lesson's bank (no `sourceElementId`). (7) **Bank by a helper** (50 sheets, 243 questions, oracle) and **extraction update by another helper** (verified elements, destinations, header boundary) ran in parallel with the lead's lab; the extraction re-reading found `prep` item 2 printed `2 × (8 − 5)` (the extraction had `(8 − 5) × 2`). (8) **`ManipulationWorkspace` keeps both levels mounted**: a Playwright check must use `:visible` selectors (see MANIPULATION_CONTRACT §2tresquadragies pitfalls).
- **Phase 0 entry 9 (`amaliyat-natiqa`, 3AM unit 2 lesson 5, 2026-10-26) — patterns to reuse.** (1) **A lesson that COMBINES four published bases** (`jidaa-adadayn-nisbiyayn`, `maqlub-qismat-kasrayn`, `jam-tarh-kasrayn`, `adad-natiq`) measures all four in « أستعدّ » (five platform affirmations + the rewritten textbook items) and opens معارف on four « تذكّر » boxes with `getLessonPath` links, one per step after its question; the cross-lesson `pointPrerequisites` edges are one per base LP. (2) **A lab whose board is LTR inside an RTL page**: `dir="ltr"` on the board container so the chain reads left to right like the maths; the Arabic sentences around it stay RTL, and every number inside a sentence goes through `MathText`. (3) **Refusals decided at two moments** (selection of the pair: magnet / bubble / order; pad press: wrong sign / no flip) and **a wrong sign explained by the SITUATION (the longer bar, the number of red bars), never by the rule**. (4) **A pure chain engine in core** (`parseChain` / `links` / `linkStatus` / `mergeLink` / `nextLink` in `fractions3.js`): the lab's coach and the tests follow `nextLink` to solve every preset, so a chain that the engine cannot finish is caught by `mergeBoard.test.js`; a preset can be `signOnly`. (5) **The knowledge graph layout is checked at 328 / 400 / 720 / 1100 px** (`lessonGraphs.test.js`): guidance nodes must not hang on the root, and an edge label must not fall on a node — place a mistake node right after its parent and a lane `end` node after it (the `jam-tarh-kasrayn` shape). (6) **`masailIllustrations.test.js`**: every number in an illustration must appear in the statement — write « الأولى / الثانية / الثالثة », not « الخطوة 1 », on the tags. (7) **A missing textbook page** (book p. 37, `ict`) is GENERATED as a declared platform addition (a calculator check inside مسألة 3: brackets decide the key sequence, a decimal display is an approximation) and cited by `sourceElementIds` of the `situation` resource; textbook elements used only through the bank or a redesigned problem are cited in the exercise's `cites` / the resource's `sourceElementIds` (`check:textbook`). (8) **`durationMinutes` = modules without the مسائل** (66; 90 with them). (9) **A QA dev server can be started with a TEMPORARY vite config that stubs another lead's not-yet-created lazy lab** (a file in `apps/web` that merges `vite.config.js`; delete it afterwards).
- **Phase 0 entry 12 (`wadiya-idmajiya-kusur-natiqa`, the SECOND 1AM–3AM synthesis, 3AM unit 2, 2026-10-26) — patterns to reuse.** (1) **Same shape and same gates as entry 4**; the LP total of `coursesData.test.js` is now 525. (2) **A synthesis answered in FRACTIONS**: `GuidedProblem` `numeric` steps take a decimal number only, so a fractional answer is a `choice` (`role: 'conclude'`, `ask`) whose distractors are the named errors (ACROSS: numerators and denominators added; a product for a sum; a fraction of the WHOLE instead of the REMAINDER); integer and decimal answers stay `numeric`. (3) **The « fraction of the remainder » trap is exposed by a counter-check, not by a lecture**: module 7 asks « 1 − 1/3 − 1/4 − 3/5 = ? » and the student sees a negative number; the solution values are shown nowhere in module 7 (`content.test.js` greps the module source for them, comments included). (4) **`MethodSteps` does not render Markdown**: pass plain `label : text` lines, never `**label**` (the unit-1 synthesis still prints the asterisks; fix it when next touched). (5) **A textbook element can be cited by the synthesis AND by the unit card**: give it `duplicatedIn: [{lesson: 'unit', module: 'page'}]` in `DEST` (here `challenge`), otherwise `check:textbook` reports an undeclared duplication. (6) **`prep` items rewritten from `self-N` elements** keep `source: addition('prerequisite_diagnostic')` (the unit's `prepDiagnostic.test.js` accepts a textbook source only for `prep`) and name their origin in `cites: [src('self-N', …)]`. (7) **A « هل تعلم » box** has no kit component: put a `TextbookBox kind="remark"` in the `brief.body` of `PrerequisiteDiagnostic`. (8) **`npm run build` can fail in the `sa-share-pages` closeBundle** when `dist/.htaccess` already had its `# @share-pages` marker replaced by an earlier build (the dist is kept by a running preview): it is unrelated to a lesson; build to another `--outDir` with the plugin removed from a temporary config to check the bundle.
- **Phase 0 entry 13 (`muqaranat-natiqayn`, 3AM unit 4 lesson 4, 2026-10-26, queue #16) — patterns to reuse.** (1) **An INSTRUMENT lab whose hand decides WHICH of two numbers is subtracted** (`difference-meter`, contract §2quattuorquadragies): two probes plug on two beads, ONE needle reads « red − black »; the evidence is the needle's side, the swap makes it CROSS without moving a bead or changing the right card, and a refusal states the two facts side by side (the probes, the reading, the chosen card) — never the rule. The needle angle is COMPRESSED (`(|v| / vmax)^0.4`) so a reading of 1/176 still shows its side while the window prints the exact value; the digital window is SVG text in an LTR isolate. (2) **Two targets that overlap cannot both be tapped**: when two beads are under one pixel apart the second hit circle covers the first (Playwright: « `<circle>` intercepts pointer events »). While they overlap the rail carries NO hit area and each bead gets a HANDLE in a lens, stacked vertically (a above b) so the layout says nothing about the order; the drag drop picks the nearest handle. Merge the two value tags into ONE pill wide enough for its Arabic caption (224 units), and offset the two probes when the beads touch. (3) **A world posed alone must bring its own default tasks**: `<Manipulation type="difference-meter" world="race" levels={false} />` had no `tasks` and silently showed the rail pairs — `numbersFor` now picks `PRESETS.race.tasks` when `world === 'race'` (a render test asserts the first reading is −4); the e2e caught it, the render tests did not. (4) **A shutter / curtain level** (متقدم): the needle is covered until the difference is WRITTEN (sign toggle + numerator / denominator steppers, judged by VALUE) and the beads are hidden behind a curtain with only the known difference given — the wrong option « لا نستطيع الحكم » is refused with the needle's reading. (5) **A new shared maths module for expressions**: `orderSign.js` reuses `substitution.js › toTerms` (integer polynomials in x) and `powers.js` rationals; the sign REGIONS of a linear `A − B` (`signRegions`: x < c, x = c, x > c, or « لكل قيم x ») are checked at sample points inside every region by the test with its OWN polynomial code. (6) **Row generators in an exercises file**: `diffRow(a, b, at)` writes « a − b = d إذن a > b » plus two distractors (the order flipped; the difference made by SUBTRACTING THE TERMS) from fraction strings, and `content.test.js` parses every option back (tolerating `\frac1{18}` and `\frac{-2}{-3}`) and asserts only the right option is true; `FractionQuestion` carries fraction answers in the modules, while `GuidedProblem` numeric steps accept only numbers — a fractional answer there is a `choice` « conclude ». (7) **The plan's numbers can be wrong, the scan decides**: `ex-30` d) is « −5/6 و −7/8 » (both negative; 1/24, not 41/24) — recompute every plan number with `Fraction` in `build-extraction.py` and record the correction in `DISCREPANCIES` and the plan's « Generator notes ». (8) **QA on a shared tree**: a vite server may already listen on 5173 (not yours: do not stop it); `pkill -f <script name>` also kills the shell whose command line contains the name — use `pgrep` first; never edit sources while the e2e runs (the lab remounts). (9) **`durationMinutes`** 64 = modules without the مسائل (88 with them). (10) **Bank by a helper from a written brief** (50 sheets, 230 questions, oracle, 8 `MISC-MUQ-*`), the helper stating honestly which exam items it could read.
- **Phase 0 entry 14 (`quwa-adad-ashara`, 3AM unit 3 lesson 1 of the remaining four, 2026-10-26) — patterns to reuse.** (1) **A net link that points FORWARD is corrected in the net, not worked around**: `3am.m3.r02 → r03` (rules → decimal writing) made the first lesson's « أستعدّ » measure the next lesson; it became `r01 → r03` plus `r02 → r04`, and `kitaba-ilmiya-rutba` gained `qawaid-quwa-ashara` in `prerequisiteLessonCodes` (`LEARNING_NET.md` § 4bis). (2) **A unit's shared maths module is seeded by its first lesson and EXTENDED by the others** (`packages/core/arithmetic/tenPowers.js`: exact BigInt decimals `{m, e}`, `parseDec` / `decText` with NBSP groups, `exponentOfPow10`, the three counts zeros / rank / zeros-before, names and prefixes, `expanded`, `timesPow10`); a LaTeX writer must replace the NBSP groups by `\\,` first and ONLY THEN the decimal comma by `{,}` (the first comma of `10\\,000` was eaten, a bug that printed raw `\\displaystyle`). (3) **A lab whose hand holds an EXPONENT** (`ten-zoom`, `MANIPULATION_CONTRACT` § 2quinquaquadragies): the evidence is the decimal plate (« the 1 moves, a zero appears »), a physical scale drawn from a virus to the Moon's orbit, and a prediction made BEFORE the first notch; no notation 10ⁿ is shown until the formal phase. (4) **A book entry that is another lesson's mechanism is rejected and written down**: activity 1 (a cell ×10 per hour) is exactly the train of `quwat-adad-nisbi` with base 10, so its square / cube became rows of أتمرّن and the config header lists the rejected candidates. (5) **A boundary written in the unit README is checked in the bank**: no 10ᵐ × 10ⁿ, 10ᵐ/10ⁿ or (10ᵐ)ⁿ anywhere; a conversion that would need one (1 Go, 10⁴ mm in m, 1 m² in cm²) is posed in DECIMAL; the plan's own option « 10³ × 10² = 10⁶ » (ex-8) was replaced by decimal / factor-count options. (6) **Extraction re-read found printing details the transcription had wrong** (ex-5 and ex-6 carry `1/10^-n` denominators, ex-10 is `1 mL = 10^-2 dL` and `1 cm³ = 10^-9 dam³`, `self-2` is printed `10 ⁴` with a blank): each was recorded in `DISCREPANCIES`, `self-2` is read 10⁻² in the test, `ex-13` (a product) was re-destined to the next lesson (pending) and `ex-63/64/68/69` (أتعمّق) left the synthesis as `notIntegrated` (MASAIL § 14). (7) **Knowledge-graph layout test**: a `common_mistake` is never a child of the root, and two mistakes in one lane under one parent (or a mistake before the next concept's edge label) fail the 328–1100 px layout — spread lanes or drop the node. (8) **Glance budget**: `[data-tz-glance]` ≤ viewport height at five sizes, also in the refusal state (the tallest banner), by cropping the SVG viewBox and keeping the ×10 / ÷10 buttons text-only at 414 px. (9) **Bank by a helper** (50 sheets, 170 questions, oracle with its own BigInt parser that decides every key without reading `expectedAnswer`; 7 `MISC-ASHARA-*`) in parallel with the extraction helper and the lead's lab.
- **Phase 0 entry 16 (`qawaid-quwa-ashara`, 3AM unit 3 lesson 2 of the remaining four, 2026-10-26) — patterns to reuse.** (1) **A lab whose hand holds a SIGNED COUNT of columns between two marks** (`unit-ladder`, `MANIPULATION_CONTRACT` § 2sexquadragies): the three rules on powers of ten are read as distances — two chained bands ADD, a band across the metre measures a GAP (3 − (−2) = 5), the area / volume tables re-tile the ruler (2 / 3 columns per unit) so a power of a power MULTIPLIES — which a train of factors cannot show; the student CHOOSES the table in متقدم and a wrong table, an end inside a plaque or a wrong plaque is refused with its calculation. (2) **A task direction decides its sign**: write the card as the question the band answers (« كم سم في 1 كم » = km → cm, +5, a red band; « 1 ملم² كم م² » = mm² → m², −6, blue) and let the unit test check every pair of every mode against the shared maths (`bandOf === unitColumns`). (3) **One discovery per level** (`ManipulationDiscovery` carries one prompt): put the strongest refutation in the discovery (the GAP, the table PRODUCT) and ask the other relation (the SUM) in the module question with the student's own evidence. (4) **A lesson that must not rebuild a published sibling's mechanism recalls it in a LINKED « تذكّر » box** (`TextbookBox kind="remark"` with a router `Link` to the published lesson and a `data-recall-link` hook), shown only at the step where it is needed; the published lesson's own recall box (`RECALL_TEN`) must stay a TRUE statement of this lesson. (5) **A notebook-to-judge module** (module 2): the lines of a classmate's notebook carry the book's error TYPES (multiplied exponents, ignored sign, added exponents in a power of a power, a sum of powers) with other numbers; the student judges all six lines in a `BatchChoiceQuestion`, then corrects them ONE at a time with a `TapQuestion`, and the box naming each rule appears only after its correction. (6) **A « practice » destination in the extraction needs a citation**: `check:textbook` wants every element whose `DEST` is this lesson cited by SOME content of the lesson (a `src(...)` in `content/*.js`, a bank sheet, or a module); elements only inspiring the bank are listed in `cites` of the closest exercise. (7) **Knowledge-graph layout, again**: a parent with ONE mistake child and one centre child puts the edge label on the mistake; a parent with TWO mistakes in the SAME lane and ONE child in lane `end` passes at every width; two mistakes in different lanes, or three in one lane, do not. Put the mistakes under a concept that is last in its محور and keep the rest of the chain in lane `end` (a mistake may `require` a LATER item of the same محور). Two of the four error types therefore stay in module 2 and the bank only. (8) **`durationMinutes` follows the catalogue convention** (modules without the مسائل: 62; `estimatedDurationMin` 86). (9) **An e2e stub user needs a real-looking name**: a one-letter first / last name sends the app to the « عرّفنا بنفسك » form and no lab is found. (10) **Plan fixes recorded in the plan's « Generator notes »**: the task u2 direction, one discovery per level, the 13-column length ruler, the corpus exercise cited by the bank (`3am-s2-83` ex 2, not ex 1).
- **Phase 0 entry 14 (`wadiya-idmajiya-ibarat-harfiya-3`, the THIRD 1AM–3AM synthesis, 3AM unit 4, 2026-10-26, queue #17) — patterns to reuse.** (1) **Same shape and gates as entries 4 and 12**, with TWO الكفاءات (P1 mobilise the tools, P2 translate then decide; `passingScore` 3 for four épreuves) — the LP total of `coursesData.test.js` is now 527; `durationMinutes` is modules 0 + 7 + 8 (30), `estimatedDurationMin` the sum (70). (2) **A synthesis of an algebra unit poses geometry and money situations answered by EXPRESSIONS**: `GuidedProblem` takes decimals in `numeric` and everything symbolic as a `choice` (`role: 'conclude'`, distractors = the unit's named errors: bracket sign, lost cross-term, forgotten ½, sum for difference); a 3×3 grid is a `problem.table` (row header column + `؟`), a rectangle is a `figure` GeoFigure measured in the test, a distance is a `route` illustration (digits from the statement only). (3) **Module 7 of a synthesis shows no formula of the solution, only the DECISIONS** (what changes, why letters and not tried values, simplify before substituting); `content.test.js` greps the module source, comments included, for every key and the stage-1 formulas. (4) **π in answers**: keep `k·π` symbolic in the keys and say « بمفتاح π في الآلة الحاسبة وتدوير النتيجة إلى 0,01 » — 3,14 gives 15,07 where the calculator gives 15,08. (5) **A bonus « تحدٍّ » is NOT an épreuve**: it lives in the `synthese` slot of `BossFinal` as a `TapQuestion` card without `assessment`, so it never counts toward mastery. (6) **JSX text containing `{,}` does not parse**: wrap prompts with decimals in `<Q>{'…'}</Q>` (a string), as the models do. (7) **Re-reading an extraction can overturn a transcription** (here « غير مبلّل » = dry, not wet): record it in `DISCREPANCIES` and never show it. (8) **Bank**: 5 × 10 sheets of exercise 2 / exercise 5 registers, `term_exam` only for the six papers actually read, `MISC-SYN-HARF-*` for the new distractor errors, oracle with exact BigInt rationals + polynomials and π as a letter (`scripts/practice-oracle/wadiya-idmajiya-ibarat-harfiya-3.mjs`).
- **Phase 0 entry 17 (`mutabayinat-amaliyat`, 3AM unit 5, lesson 1 of the remaining three, 2026-10-26, the INEQUALITY half of programme item `3am.m5.r05`) — patterns to reuse.** (1) **A lesson that shares a programme item with a published sibling** (`musawiyat-amaliyat`, the equality half) crosses NO net link, so it takes cross-lesson `pointPrerequisites` toward it (`P1 ← 3am_musawiyat-amaliyat_P1`, `P2`/`P3 ← …_P2`) next to its intra-lesson edges; « أستعدّ » measures the sibling with ONE platform statement (`priorKnowledge` id `musawiyat-amaliyat-3am`), and a « تذكّر » box (link by `getLessonPath`) recalls it in the `brief` of معارف next to the box of the later-unit tool it does not rebuild (`muqaranat-natiqayn`: the sign of a difference). The 2AM order of relatives (`muqarana-nisbiya`, no net link to the item) is measured too, outside the net. (2) **A lab whose hand holds ONE KNOT and the whole number line follows** (`loom-threads`, `MANIPULATION_CONTRACT` § 2sexaquadragies): comb (x + c) and nail (c·x) on two graduated beams, a red and a blue thread that CROSS exactly when the factor is negative; the release of the knot is the trial; a third beam chains two operations; a painted BAND (`x < 3`) is transported by `linear.js › imageRay` (new, with `boundAffine` for the brackets of `ax + b`, both swept in `linear.test.js`). The `levels.test.js` branch measures the pair by the stages allowed, the band and the step. (3) **Inequality keys are checked by WITNESSES, not by a typed value** (`content/content.test.js`): the written LaTeX of every option (`\frac`, `{,}`, `\leq`, implicit multiplication) is read back by a small evaluator on BigInt rationals, the key must be true for EVERY sample that satisfies the hypothesis AND equivalent to it (the tightest consequence), and every distractor must be FALSE for at least one sample — so a WEAKER TRUE consequence (`x > 7 ⟹ x + 3 > 4`, `x < −3 ⟹ x < 3`) is not a distractor: the test caught several in the plan (final-test item 4 `x < 3` became `x < −12`) and in the مسائل (`S < 74`, `25x ≤ 630`). « لا يمكن الحكم » rows need witnesses of BOTH signs. Row generators `tx(plain)` write the LaTeX from plain text; brackets keep their ends ordered. (4) **Boundary words**: the lesson never writes « متراجحة » / « حلّ » / a solution set / a number line of solutions for an inequality (4AM `mutarajiha-ula` owns them) — « استنتج متباينة طرفها الأول x » is the whole scope; the bank may say « حلّ » only for EQUATIONS. (5) **`validate:lessons` asks every levelled lab resource for `sourceElementIds`** (here `act-2b`, `know-2b`); a question placed BEFORE the brick that establishes its idea must `require` the prior-year id, never that brick (`E_REQUIRES_ESTABLISHED_LATER`). (6) **Order lines are LTR islands**: `<bdi dir="ltr">` with a minus sign and a symbol was painted in the wrong order — write the line as an `inline-flex` `dir="ltr"` span, each part its own isolated span, and read the real order from `getBoundingClientRect()` (a small RTL-page screenshot is easy to misread). (7) **A taller state must still fit**: three beams grew the lab block past the screen at 1024×768 — a narrower gap, no decorative carpet and `space-y-2` brought it back (765 / 768); the e2e measures the 3-beam state at the five sizes. (8) **A shared dev server reloads the page when another author edits the tree**: the lesson e2e re-measures a failing overflow check once and gives the page 15 s to mount; do not read a single red run as a lesson bug. (9) **Bank by a helper from a written brief** (50 sheets, 200 questions, oracle with its own BigInt rationals and 200 witnesses per key, 10 `MISC-MUTABAYINA-*`) and **extraction update by another helper** (re-routing of `ex-19`, `ex-23`, `ex-24`, `ex-26`, `ex-27`, `now-75-2` printed `x − 8 > 7`, `now-77-1` both stored answers wrong) ran in parallel with the lead's lab.
- **Phase 0 entry 19 (`hasr-adad-ushri`, 3AM unit 5, lesson 2 of the remaining three, 2026-10-26, programme item `3am.m5.x1`) — patterns to reuse.** (1) **A later lesson EXTENDS a 1AM item whose home lesson is unpublished** (`1am.m3.r05`, `hasr-qiyam-muqarraba`): « أستعدّ » measures it with platform statements next to two rewritten textbook items (`prep` 13 and 15; item 14 is the bank's / أتمرّن's), the « تذكّر — السنة الأولى » box sits in the `brief` of معارف (link by `getLessonPath`, none while unpublished) and `pointPrerequisites` stay intra-lesson; the published sibling's property (× positive) gets its own « تذكّر » box where the lesson uses it (طريقة C, مسائل). `priorKnowledge` ids may exceed the net's (here four, two of them for the 2AM quotient and the sibling). (2) **A lab whose hand holds the QUANTITY and an INSTRUMENT refuses** (`scoop-scale`, `MANIPULATION_CONTRACT` § 2septquadragies): the idea (the half-open interval of a rounded reading) is met by the hand at BOTH ends — 1,25 included, 1,35 excluded — and the refusal quotes the neighbour pinch in the student's numbers; the trap task (2/7 kg, a lamp that never says « balanced ») shows a quotient trapped between two ticks. `decimals.js` gained `floorAt` / `ceilAt` / `roundAt` (half up) / `roundingInterval` / `quotientDigits` (the LAST digit of a calculator screen is ROUNDED: 247 ÷ 83 → 2.975903614) / `quotientBracket`, all swept. (3) **A pointer hold-timer must read its direction BEFORE resetting it**: a `setState` updater runs later, so `release()` that zeroed `h.dir` made the tap-on-the-pile add a pinch instead of removing one — the e2e's pointer step caught it; capture `const { dir } = h` first. (4) **Equivalence, not just falsehood, for « from a rounding » options**: `content.test.js` reads the written LaTeX of every bracket option and checks on a fine grid that the key describes EXACTLY the set of numbers with that rounding and that each distractor either fails for a member of the set or is true for a number outside it (the closed right end `3,55 ≤ x ≤ 3,65`); brackets of a GIVEN number (a quotient, π) are strict, tight (two consecutive marks of the rank) and every distractor false — a TRUE but loose bracket (`35,7 < 250/7 < 35,8`) is not a distractor (the plan listed three; they were replaced). (5) **Decimals as exact data, the calculator screen as text**: the screens printed in statements (`8.276595745`, `7.093821510`) are recomputed with an independent BigInt rounding; a decimal point is used for the machine, the comma for the student's own writing. (6) **A step that needs the advanced level is optional** (`done: !!q.d || !hasTrap`): module 1 reads the trap task's evidence when it exists and shows an « اختياري » line otherwise. (7) **Number-line figure as data** (`content/figures.js › roundingLine(r, rank)` → `{ lo, r, hi }` from `roundingInterval`, drawn by `content/RoundingLine.jsx`: a filled dot on the included left end, a hollow one on the excluded right end), tested by `figures.test.js` with integers. (8) **Bank by a helper from a written brief** (oracle with its own BigInt scaled decimals) and **extraction update by another helper** (`prep` 14 option order and `prep` 15's merged rows corrected at 200 dpi, `now-77-1` keys 8,342 / 8,336 / 8,345 recomputed) ran in parallel with the lead's lab.
- **Phase 0 entry 18 (`kitaba-ilmiya-rutba`, 3AM unit 3, lesson 3 of the remaining four, 2026-10-26) — patterns to reuse.** (1) **A lesson that EXTENDS an unpublished earlier-year lesson (noRebuild)** (`1am.m1.r06` رتبة المقدار → the order of magnitude of a scientific writing): the idea is RECALLED in a « تذكّر » `TextbookBox` placed after the question that needs it (no link while `rutbat-miqdar-jam` is unpublished), « أستعدّ » measures it with one platform statement, and the lesson builds only the added value (bracket, `a'` = `a` rounded to the unit, the carry `a' = 10 → 1 × 10ⁿ⁺¹`). (2) **Two lessons of a unit share one maths module, extended not rewritten**: `tenPowers.js` gained `scientific`, `isScientific`, `bracketOf`, `cellOf`, `orderOfMagnitude`, `logPos`, `sciTex` (the lab's `logic/sizeLadder.js` and the tests call them; `content.test.js` recomputes with its own BigInt evaluator and asserts « the key is the scientific writing EQUAL to the value; every distractor is not that writing » — a distractor may equal the value yet be of the wrong form, e.g. `604 × 10⁴`). (3) **A lab whose hand holds a POSITION on a multiplicative scale** (`size-ladder`, MANIPULATION_CONTRACT § 2unquadragies): rung = bracket, cell = mantissa, magnet = order of magnitude, comparison = rungs first; two discoveries are split per level because the shell carries one. (4) **A typed phase BEFORE the gesture** (متقدم: write `a` and `n`, judged exactly with the value in the refusal) turns a typical fault into a refused trial (`4,8 × 10⁻¹ = 0,48 ≠ 0,000048`). (5) **Numbers in a refusal sentence are KaTeX** and exponents are real `<sup>`, never Unicode superscripts (blobs in the font) nor plain Arabic text (bidi turned `265 ≥ 1 000` into `1 ≥ 265 000`). (6) **A hang-by-colour shortcut is removed**: a wrong rung does not glow while hovering; the verdict comes with the release. (7) **`GuidedProblem` illustrations**: the scene icon list has no satellite — use `tags`. (8) **Elements bound for the bank that no module uses are cited as `cites` of the nearest exercise** (`check:textbook` wants a citation by the same lesson; an unreachable Pythagoras / Thales exercise is `notIntegrated` with its reason in `build-extraction.py`). (9) The unit's `prepDiagnostic.test.js` counts PUBLISHED lessons: it is red between the files existing and the catalogue flip.
- **A lesson that EXTENDS a published earlier-year lesson opens on a « تذكّر »** (`LEARNING_NET.md` §4.3): a `TextbookBox
  kind="remark"` titled « تذكّر — السنة … », source `addition('prior_year_reminder')`, linking the base lesson with
  `getLessonPath(code)` (null — no link — while it is unpublished). The base item is a `priorKnowledge` id measured by « أستعدّ »,
  never a `knowledge.jsx` item of the new lesson. A same-year item taught LATER in the book (a « renvoi en avant » of the queue) is
  measured in « أستعدّ » through its earlier-year base and named in معارف without being built (`qisma-iqlidiya-hasr`: « قيمة
  مقرّبة بالنقصان / بالزيادة », built by `kasr-hasil-qisma`).
- **A textbook page that belongs to another lesson** (`qisma-iqlidiya-hasr`: the طرائق p. 27 is `kasr-hasil-qisma`'s) is removed
  from the lesson's catalogue `textbookRef.pages` (`"method": null`); a method module the lesson still needs is a declared
  `addition('knowledge_formalization')`, and exercises the textbook lacks are `addition('practice_generation')` « على منوال » the
  term exams.

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
   Write the math in `challenge`/`aside` as `$…$`. Bare `x² + 12x = 85` gets reversed in RTL. **A
   `challenge` or `aside` that points to a figure** (« الشكل المقابل », « البيان المقابل », « التمثيل البياني
   المقابل », « في جدول ») must show that figure on the unit page. Register it in
   `apps/web/src/pages/unit/UnitOpenerFigure.jsx` under the key `<unitCode>:challenge|aside`. Reuse, lazily,
   the component the lesson already draws for that same figure (never a second copy). Strip anything that
   gives away the answer (`ChallengeSquare showAreas={false}`, `ChallengeGraph plain`). Then add the unit to
   `e2e/lesson-kit/4am-unit-opener-figures.mjs`, which fails when a تحدّ points to a figure that isn't
   registered.
3. **`_unit/`**: `unitMeta.js` (constants + `src`/`addition`) and the three bindings of
   `lessons/common/unit/` (`moduleContext.js`, `lessonRoutes.jsx`, `prepDiagnostic.jsx`), plus a copy of
   the unit's `prepDiagnostic.test.js` with the unit's lesson count.
4. **New mathematics → new manipulation types** by MANIPULATION_CONTRACT §7ter, arithmetic in
   `packages/core/arithmetic/` (unit 2: `squareRoots.js`; the three types of §2quater).
5. The lessons (this guide), then the lesson index (`node scripts/generate-lesson-index.mjs`; `App.jsx` until
   2026-10-14), the DB handshake (§11) and the documentation.

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

**Unit 5 « جمل معادلتين » (2026-10-01) replayed the recipe (four authors on a seeded foundation) and added:**

- **A pair is an answer type.** In a lesson, `TextbookExercise` takes `interaction: 'pair'` (`PairQuestion`,
  `expected: { x, y }`, `names` for (a ; b)); in the bank, `answerType: "point"` — both judged by the same evaluator,
  one right number being `partially_correct` (`EXERCISE_CONTRACT.md` « Unit 5 »). The oracle checks the key equals
  the pair it recomputes (`P(x, y)`, `solve2`).
- **One exact module for systems**, `packages/core/arithmetic/linearSystem.js`, on `linear.js` fractions, written
  and swept over every textbook system before the authors started.
- **Owner rules born here, binding on every manipulation**: one screen without scrolling, hide / show
  (`LabFold`) and movable panels (`MovablePanel`), near-square blocks of objects (MANIPULATION_CONTRACT §8bis) —
  measured by the unit's e2e at four viewports.
- **The web build needs ~3,2 GB**: `apps/web`'s `build` script sets a 4 GB heap (`DZ_FIRST_DEPLOYMENT.md`).

**Unit 6 « الدالة الخطية والتناسبية » (2026-10-02) — six authors on a seeded foundation — added:**

- **A ميدان the programme does not have.** The owner asked for « ميدان التناسبية والدوال »; the programme
  (`programme_4am_2026_2027.json`, a verbatim transcription) files « الدوال الخطية » under « ميدان الحساب الحرفي » and stays
  untouched. The display ميدان is DATA: `units_4am_2026_2027.json › ownerChapters` (`{ id, titleAr, subtitleAr, decidedBy:
  'owner', decidedOn, note }`), appended by `coursesData.js` after the programme's domains with NO official topic; every
  unit ranged there declares its programme domain in `placement` (`decomposition.test.js` and `coursesData.test.js`
  check both). The lessons live under `lessons/moyen/4am/<that chapter id>/<unit>/`, the import depths are those of the
  other units (six levels from `modules/` and `components/`, five from the lesson root), and the DB handshake creates
  the chapter row like any other.
- **One exact module for proportionality**, `packages/core/arithmetic/proportional.js` (tables and ratios, fourth
  proportional, a from (m ; f(m)), image / antecedent / on-line, direction, percentage multipliers and chains, the
  « machine » rules x², ax, ax + b with their linearity witnesses), tested before the authors started.
- **One lab shared by three lessons with a contract fixed in the brief**: `origin-line` (L3 draw / read / pivot, L5 fit,
  synthesis read + `cap`), its props in MANIPULATION_CONTRACT §2octies; the reusing lessons keep theirs in
  `content/textbook.js › LAB` + `lab.render.test.jsx`.
- **A shared-file lock for parallel authors**: every shared file (lesson.json, levels.js, misconceptions.json, …) was
  edited through one script that re-reads the file inside a global `flock` (`json-set` / exact `replace`) — no race in
  six parallel authors. Each author pushed its i18n namespace as one JSON value.
- **Two owner requests on every lab**: a GENUINE manipulation (the hand holds the variable) AND a decorative layer of an
  Algerian Gen-Alpha world (e-scooters on the promenade, the Eid souk, the téléphérique, the mall soldes), decoration
  `aria-hidden` and never carrying an answer. The unit e2e measures the one-screen fit on each lab's « glance » block
  (instrument + controls + reading), not on the whole card (title, level selector and folds sit around it).

**Unit 7 « الدالة التآلفية » (2026-10-02) — six authors on a seeded foundation, the same day — added:**

- **A source with no formal pages.** The owner supplied only pages 77–79 (opener, تحدّ, أستعدّ, five أنشطة): no معارف,
  طرائق, exercises, QCM or « أدمج تعلّماتي ». The extraction says so (`discrepancies › scope`), and everything else is a
  DECLARED platform addition with a reason that names it: `knowledge_formalization` (the formal knowledge, label
  « معارف من المنصّة » in `textbook.additionReason`), `synthesis_generation` (« محتوى إضافي من المنصّة »),
  `prerequisite_diagnostic`, `interaction_generation`, `practice_generation`. Banks are almost entirely `practice_generation`.
- **A synthesis without a textbook synthesis.** The platform writes ONE composite situation that needs every lesson of the
  unit, in the textbook's shape (قراءة · تحليل · تنفيذ), each part linked back to its درس, solved in module 1; the final test
  TRANSPOSES it to other numbers so its answers appear nowhere else. A levelled manipulation must still cite an extraction
  element: the synthesis cites the unit's `objectives`, declared `objectives.duplicatedIn` in the builder.
- **One exact module on the previous ones**: `packages/core/arithmetic/affine.js` is written ON `linear.js` and
  `linearSystem.js` (an affine function is unit 4's `{ a, b }`, an equation is unit 5's ax + by = c) — no second fraction or
  system implementation; tested on every textbook number before the authors started.
- **Level pairs follow `levels.test.js`**: the advanced level cites the textbook and is measurably heavier, so when a
  textbook activity is the richest version, the platform's simpler numbers go to مبتدئ.
- **« أستعدّ » requires ONE id per item** (`prepDiagnostic.test.js` counts `requires: ['id']` literals): a prior-knowledge
  id that needs diagnosing gets its own item, never a second id on an existing one.
- **Glance selectors are fixed in the brief** (`data-am|al|ss|lc|pc-glance`) so the lead's unit e2e is written before the
  labs exist; e2e `apps/web/e2e/lesson-kit/4am-dala-taalufiya.mjs` (224 checks).
- **Misprints this time are bidi**: a coordinate pair printed reversed « (1 ; 0) » for (0 ; 1) in act-3, the unit after an
  amount (`$…$ DA` reverses — put `\,\mathrm{DA}` inside the island) and « 10°C » (written `$10\,^{\circ}\mathrm{C}$`).

**Unit 8 « الإحصاء » (2026-10-02) — five authors on a seeded foundation, the same day — added:**

- **Owner lessons that cut across the textbook's sections.** The owner's five lessons (cumulative frequencies; range / mean /
  median; spreadsheets; reading and interpreting situations; synthesis) do not follow the textbook's activity order: L3 gathers
  the textbook's Excel / GeoGebra / calculator exercises (ex-7, ex-15, ex-16, ex-23, ex-24, ex-1 هـ), L4 has NO textbook activity
  and enters through the unit's تحدّ. The `destinations` of the extraction say it element by element; the knowledge those two
  lessons formalize is a declared `knowledge_formalization`.
- **One exact module for statistics**, `packages/core/arithmetic/statistics.js` on `linear.js` fractions (tables, cumulative
  up / down, relative cumulative, « على الأكثر / على الأقل / تفوق » counts, range, weighted mean, median by ranks, classes and
  class centres, median class, mode, groups reunited, a hidden value from a mean, N from a removal), tested on every textbook
  number before the authors started.
- **A unit topic list = the topics its lessons carry.** `decomposition.test.js` requires every `sourceTopicIds` entry of a unit
  to have a lesson; the programme's nine statistics topics are taught inside four lessons, so the unit declares the four
  carried ones (ALGERIA_4AM_CURRICULUM §5 says where the other five are taught).
- **Misprints found by computation, not by eye**: the builder asserts every textbook count, sum and rank; it proved ex-20's
  median « 6 » impossible (→ 6,5), and showed that ex-19's « odd » bars are a puzzle, not a misprint.

**Unit 9 « خاصية طالس » (2026-10-02) — four authors on a seeded foundation, the first geometry unit — added:**

- **A programme ميدان, no `placement`.** « ميدان الهندسة » (`handasa`, topic `thales`) exists in the programme: the unit sits under it
  directly, lessons in `lessons/moyen/4am/handasa/khassiyat-talis/` (same import depths as the other units).
- **One exact module for Thales**, `packages/core/arithmetic/thales.js` on `linear.js` fractions: ratios, fourth proportional, k
  (`scale`), the reciprocal on SIGNED abscissas (`converse` decides ratios AND order, `reason`), partition and ratio points
  (`ratioPoint`), a constructed length, the shadow height, the cylinder in a cone — tested on every textbook number first.
- **Figures are DATA: `GeoFigure`** (`lessons/common/components/GeoFigure.jsx` + `geoFigure.js`): named points, segments, lines,
  rays, polygons, right angles, angles, equality ticks and parallel chevrons, an Arabic `ariaLabel`. Every textbook figure of the unit is
  `content/figures.js` data drawn by it, in modules, in the final test (`inline` inside a prompt) and in the practice bank through the
  new `statement.figure` (EXERCISE_CONTRACT « Unit 9 »). A geometry statement that says « الشكل المقابل » always carries its figure.
- **A synthesis whose workspace pairs two types** (`shadow-world` مبتدئ = the تحدّ — `shadow-stick` until 2026-10-13 —, `cone-cylinder` متقدم = the situation): the
  objective is what both levels share (MANIPULATION_CONTRACT §7bis-levels, §2undecies).
- **Bidi of geometry names**: the prime (B′) and « )//( » are now isolated by `utils/bidi.js` (ARABIC_RTL_CONTRACT « Geometry names »).
- **Seed stub `routes.jsx` before parallel authoring.** `App.jsx` imports every lesson's `routes.jsx`; while a sibling's file does not
  exist yet, Vite answers 500 on EVERY page, so an author cannot open the dev server. Unit 9's authors worked around it with a temporary
  resolver stub; next time the lead seeds a minimal `routes.jsx` per lesson (returning `null`) with the other shared files.
  *(Obsolete since 2026-10-14: `App.jsx` imports no `routes.jsx`; the lazy glob of `lessonLoaders.js` only sees files that
  exist, so a sibling's missing lesson no longer breaks the dev server. Run the index generator once all lessons exist.)*
- **Misprints found and corrected**: أستعدّ 5 (ADE → ADF), معارف 2 example (MN/AC → MN/BC), طرائق « حساب أطوال » (1/2 → 2/1 = 5/DN).
  Figure readings decided in the builder: the تحدّ minaret 7,25 m (shadow method), ex-9 needs the converse of Pythagoras, ex-13
  « not parallel » under either label reading, ex-23 equality marks read at 500 dpi.

**Unit 10 « حساب المثلثات في المثلث القائم » (2026-10-04) — five authors on a seeded foundation — added:**

- **One exact module for trigonometry**, `packages/core/arithmetic/trigonometry.js` on `linear.js` fractions and `squareRoots.js`: SURDS
  `{ q, r }` = q·√r (3/√13 = 3√13/13 stays exact), the sides relative to an acute angle (`sides`), the three ratios (`ratioExact`), the bounds
  (`isPossible`: sin, cos ∈ ]0 ; 1[), the relations (`fromRatio`: the two other exact ratios from one), the choice of ratio (`lengthPlan`,
  `anglePlan`), the calculator world (`sinDeg` …, `ratioRad` / `angleRad` (what a calculator left in RAD shows), `roundTo` with the decimal comma, `screen`, the textbook's key sequences) — tested on every
  textbook number first. The extraction builder asserts every printed screen value (5,915503958 …) with Python's own `math`.
- **The brief and the lock live in the repository** (`docs/sources/4am/unit10/brief-authors.md`, `locked_edit.py`): unit 8's scratchpad was
  wiped mid-session; nothing the authors need sits in a temporary directory any more.
- **Stubs for EVERYTHING a sibling imports**: `routes.jsx` per lesson (App.jsx) AND each new lab component (`manipulationRegistry.js` imports it
  lazily — Vite transforms the import even before it is called). Each stub says it is one and is replaced by its owner.
- **A lab shared by a lesson and the synthesis with a FIXED props contract** (`clinometer`: `height | ladder | align`), the synthesis keeping
  its numbers in `content/textbook.js › LAB` (unit 6's pattern).
- **Arabic never inside KaTeX**: the textbook's word fractions (« طول الضلع المقابل / طول الوتر ») use the new shared
  `lessons/common/components/WordFraction.jsx` (ARABIC_RTL_CONTRACT « Word fractions and calculator keys »).
- **Rounded values are `rational` keys, exact surds are `choice`** — no new answer type (EXERCISE_CONTRACT « Unit 10 »).
- **`levels.test.js` measures lists and objects** (angle tables, construction targets) by their numeric leaves.
- **A تحدّ that says « اعتمادا على الشكل » refers to a figure** too: `4am-unit-opener-figures.mjs` now detects it.
- **Misprints and readings**: معارف 2 example `tan B = AC/BC` → `AC/AB`; معارف 4 box `sin²x + sin²x = 1` → `cos²x + sin²x = 1`; the
  situation's distance read 95,65 m (h ≈ 92 m, the real height of مقام الشهيد; 96,65 would give 93 m); ex-25's 30° is at O (∠AOD), so
  ∠OAB = 15°; ex-18's sin x = 3/2 and √5/2 are deliberate impossibilities (« إن أمكن »); ex-15 names its third pupil « رضا ».

**Units 11 « الأشعة والانسحاب » and 12 « الأشعة في معلم » (2026-10-04) — two units in one run, ten authors in two waves — added:**

- **One exact module for both units**, `packages/core/arithmetic/vectors.js` (exported `vectors`) on `linear.js` fractions and
  `trigonometry.js` surds: points and vectors `{ x, y }`, `vec`, `translate`, `relation(u, v)` → the textbook's three elements
  (منحى / اتجاه / طول — every « same vector? » verdict of every lab), `fourthVertex`, `parallelogramSum`, `midpoint`, exact `distance`
  (√13, 3√2), `triangleNature`, `quadNature`, `onCircle`, and NAMED vectors as formal point combinations — `simplifyNamed(['AB', 'BC'])`
  → 'AC', opposites → '0', irreducible → null — so Chasles needs no special case. Authors added the crossing problems (`crossing`,
  `crossingSide` for the تحدّ swimmer, `shortestCrossing` for the synthesis) through the lock.
- **GeoFigure draws vectors and grid paper** (`vectors: [{ from, to, label }]` — arrowhead and the \vec-capped name; `grid: true |
  { step }`), used by every figure of both units, in modules, final tests and `statement.figure`. A grid figure displays at 540 px by default.
- **Figures are analysed, then reproduced or REDESIGNED** (owner rule born here, §5 « Textbook figures »): unit 11's act-1 (a 4 × 11 strip,
  C′ on C, E on L, H on P) was redrawn 14 × 8 with the same concept and recomputed answers; `figureQuality(fig)` is asserted empty in every
  lesson's `content/figures.test.js` — and content globs (`loadLessonMemoSources.js`, `check-textbook-coverage.mjs`) now skip `content/*.test.js`.
- **Two waves of five authors** on one seeded foundation and ONE lock (`docs/sources/4am/unit11/locked_edit.py`, brief
  `docs/sources/4am/unit11/brief-authors.md` for both units): ten parallel authors do not fit a 13 GB machine (dev server + browser each).
  The second extraction twice stalled the API reading full-page 300 dpi images: an extraction agent writes its builder page by page and
  Reads crops ≤ 1400 px.
- **A workspace mounts both levels**: SVG gradient / clip ids come from React `useId` (a constant id blanked the hidden level's twin sky),
  and Playwright uses `:visible` locators.
- **GeoFigure grew three keys during unit 12** (each through the lock, each tested): `axes: true | { every }` (the repère's two axes,
  arrows, graduations — a number is dropped when it would sit on a point name), `arcs: [{ from, to, sweep }]` (a semicircle on a
  diameter) and `circles: [{ center, through }]`. A unit-12 coordinate figure is GeoFigure `grid` + `axes`, never a third repère.
- **`BatchChoiceQuestion` rows grow with their label** (owner report, unit 12): the label column was a fixed 14 rem, so three formulas
  « EF² = 20 ، FG² = 20 ، EG² = 40 » broke after « = » and covered the choices; it is now `min 14rem, max 55 %`, formulas never break
  inside (`[&_.katex]:whitespace-nowrap`), the options take the rest and wrap.
- **Unit e2e and the smooth scroll**: the site scrolls with `scroll-behavior: smooth` and a module resumes at its step
  (`utils/scrollToStep.js`); under load Playwright's level-tab click landed mid-scroll (« element is not stable »). The unit files
  `4am-ashia-insihab.mjs` / `4am-ashia-maalam.mjs` centre the tab with `behavior: 'instant'`, wait for `scrollY` to settle and click in
  the page — the real tap was verified with `elementFromPoint` at three scroll positions.
- **Misprints and readings (unit 12)**: method-equal concludes AB = CD → AB = DC; know-origin's A printed « (2,5 ; -3-) » (an RTL
  reversal) → A(−3 ; 2,5); ex-8 « CD(2;-5) » is the vector CD; ex-12 and ex-26 name a crossed quadrilateral (→ ABDC, ACBD); ex-21
  « أربع نقط » → three; the situation's « ≈ 9,96 » is right only if rounding comes LAST (the rounded terms add to 9,97 — used as the
  rounding trap).
- **Misprints and readings (unit 11)**: ex-21's conclusion (the midpoint of [ED] is K, not L); ex-4 / ex-8 ask for more equal vectors than
  exist (5 and 3); act-1's grid read on a curled page; the GeoGebra TP's missing « ارسم نقطة D »; ex-13 « AC + AA » kept as printed.
  The unit page's « ستعود إلى هذا التحدّي في الدرس 6 » (true for unit 1 only) became « …خلال دروس الوحدة ».

**Unit 13 « الدوران - الزوايا - المضلّعات المنتظمة » (2026-10-04) — five authors on a seeded foundation — added:**

- **One exact module for rotations, angles and regular polygons**, `packages/core/arithmetic/rotation.js` (exported `rotation`) on `vectors.js`
  points and `trigonometry.js` surds: angles in degrees, orientation `'direct'` (anticlockwise, الموجب) | `'indirect'`; `rotate` EXACT for
  multiples of 90° (grid figures), `rotateApprox` for drawing only; **`imageCheck(O, M, M′, α, dir)` → `{ ok, length, angle, sense, measured }`**,
  the textbook's three conditions (OM = OM′, \widehat{MOM′} = α, the sense) — every « is this the image? » verdict of every lab names the failing
  one; inscribed / central (`arcAngles`, `inscribedFromCentral`, `sameArc`); regular polygons (`centralAngle`, `interiorAngle`,
  `sidesFromCentral` → null when no polygon exists, `sideFromRadius` exact for n = 3, 4, 6, `regularVertices`, `star`, `radiusForChord`).
  Authors added through the lock `lineAngle`, `polygonArea`, `rotationCenter`, `onBisector` (khawas-dawaran), `circlePosition`,
  `vertexAngle` (an angle whose vertex is inside / outside the circle, zawiya-muhitiya), `circleGaps`, `ringByRotation`, `chordOfArc`,
  `arcLength` (the synthesis).
- **GeoFigure grew three keys** (tested in `geoFigure.test.js`): centred arcs `arcs: [{ center, from, to, sweep: 'ccw' | 'cw', arrow, label }]`
  (the path of M to M′ around O; `ccw` = direct as SEEN; the intercepted arc of an inscribed angle), `angles[].arrow` (the rotation's sense),
  `circles: [{ center, radius }]`. A regular polygon's points come from `rotation.regularVertices` in `content/figures.js`.
- **A تحدّ that shows a photo**: the unit's تحدّ (the star of the flag) has no « الشكل المقابل » but the book shows the flag; the unit page draws it
  (`mudalaat-muntazama/components/FlagStarFigure.jsx`, no measurement), registered as `'dawaran-mudalaat:challenge'`.
- **A scan with gaps decided by computation**: ex-10 and ex-16 leave an angle unfixed (the lessons state the figure's 45° / 40° as data),
  ex-18's grid is almost erased (rebuilt from the only rotation that fits), ex-5's angles were measured on the scan (120°, 150°, 90°, 60°).
  Misprints: معارف 4 example 3 « AOB » → AMB; method-angle « 180° » → 108°; ex-12's missing angle name (AMD); ex-15 « ABCDEF » → BCDEF (A is
  the centre); ex-17 (BEM) « ABCD » → ABDC; QCM item 1 « صورة A » → B. The تحدّ « رأسين متتاليين » is read as the five tips (pentagon of side
  10 cm, R ≈ 8,51 cm; the other reading R ≈ 13,76 cm is kept in the extraction).
- **The extraction agent stalled once** (API watchdog after « render pages »): resumed by message with crops ≤ 900 px, the builder having been
  written page by page — nothing was lost.
- **Lead review by screenshots found what tests do not**: a stretch handle on a named point, a bidi-reversed « 0 × 50° = 0° » counter, a hub
  label under the image handle, crowded gap labels at a lab's start — sent back to the authors by message.

**Unit 14 « الهندسة في الفضاء » (2026-10-05) — five authors on a seeded foundation, the FIRST unit in space — added:**

- **A programme topic the owner's transcription did not have.** `programme_4am_2026_2027.json` had no space-geometry topic under
  « ميدان الهندسة »; `handasa_fada` « الهندسة في الفضاء » was added at the owner's request and DECLARED in the file (`addedBy:
  'owner_request'`, `addedOn`, `note`); `coursesData.test.js` counts 29 topics and names the only added one.
- **One exact module for space**, `packages/core/arithmetic/space.js` (exported `space`) on `linear.js` fractions and `trigonometry.js`
  surds: π-MULTIPLES `{ k, latex, number }` (exact AND rounded: 1372π/375 and 11,494), `ballPosition` (OM² vs R² compared exactly — every
  « on / in / outside » verdict), sphere area / ball volume and their inverses, Archimedes' ratios, the familiar solids, the sections
  (`sphereSection`, `cuboidSection`, `cylinderSection`, `apexSection`), `scaleEffect` / `scaled` / `ratioFrom` (k, k², k³, exact roots or
  null), `bucketWater` (Thales + V_big(1 − k³)) — tested on every textbook number first.
- **Statistical charts: `StatChart`** (`lessons/common/components/StatChart.jsx` + `statChart.js`, `kind: 'chart'`, 2026-10-08): bar chart,
  histogram (+ frequency polygon), line / cumulative polygon, pie and half-pie, declared as data and validated (`validateStatChart`: every
  unprinted value on a gridline, `missing` parts drawn « ؟ »). Use it in a practice statement or a مسألة (`figure`) instead of a lesson-local
  chart; `StatementFigure` / `validateStatementFigure` are the single dispatch for plane, space and chart figures (EXERCISE_CONTRACT
  « Statistical charts »).
- **Figures in space: `SpaceFigure`** (`lessons/common/components/SpaceFigure.jsx` + `spaceFigure.js`, `kind: 'space'`): an orthographic
  projection that dashes HIDDEN lines by computation (polyhedron edges by back faces, the back half of an equator, a cylinder's bottom rim,
  contour generators of cones and frustums), dispatched by `ExerciseStatement` and `validate-exercises.mjs`; `spaceFigureQuality(fig)` = [] in
  each lesson's `content/figures.test.js`; `segments[].labelOffset` added by the synthesis author.
- **Live 3D labs on ONE kit** `lessons/common/manipulations/space/stage3d/` (three.js, already a dependency of the Math Lab's 3D tool):
  `SpaceStage` (z-up maths ⟷ three.js, render on demand, DOM labels, `draggable` + `onPlane` / `onLine` as the in-scene gesture),
  `solids3d.js` factories, `Stage3D.jsx` whose `fallback` (a SpaceFigure) fills the window until the WebGL scene exists — so the server render
  of the render tests sees it. The unit e2e fails when a glance block's scene is not live (`data-stage3d-ready`). MANIPULATION_CONTRACT
  §2quindecies.
- **A scan with no exercises, no QCM, no situation** (pp. 163–169 only; the pyramid / cone sections and enlargement knowledge missing):
  unit 7's recipe — declared `knowledge_formalization` / `interaction_generation` / `synthesis_generation` / `practice_generation`; the
  synthesis's situation is the unit's تحدّ (the bucket), whose figure the unit page draws (`'handasa-fada:challenge'`).
- **Readings and corrections** (extraction, 13 discrepancies): the تحدّ is 7 cm (rim → water) + 28 cm (water → bottom), so H = 35 and
  V = 24388π/3 ≈ 25,54 L (the other reading kept in `answer.alternative`); act-1's photo is a pétanque boule, not a shot put; « حجم الكرة »
  in the Archimedes text means الجلّة; act-3's stray « I »; act-5's F, G, H defined; know-3's missing « ب) »; فيثاغورس.
- **Lessons learned**: `ManipulationShell` prints a lab TITLE raw (no bidi isolation) — write lab titles in words, never « 40 cm » or
  « r = 4 »; judge a 3D lab on VIEWPORT screenshots (a full-page Playwright screenshot resizes and the on-demand canvas comes out empty);
  a long-running dev server can keep serving a stale `packages/core/index.js` after a new export — restart it with a cleared
  `node_modules/.vite`; a lock `replace` must take its old text from a fresh read, never from remembered line numbers (one author
  overwrote a sibling's level pair and restored it).

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
| `Module00Astaidd` — أستعدّ | `prerequisite_check` | Every lesson of the unit opens on it (9 of 9 since 2026-09-30; guarded by `_unit/prepDiagnostic.test.js`). Diagnoses the lesson's `priorKnowledge` — previous years or earlier lessons of the unit — and never the lesson's own material; every `priorKnowledge` id is measured by at least one question. Built as described under « The « أستعدّ » pattern » below. Never gates, never persists evidence; its result is stored locally and read by nothing but its own results screen, so its copy must not promise that the lesson adapts. Under the result, the kit renders « راجع قبل أن تنطلق » (`kit/ReviewLinks.jsx`, since 2026-10-13): the official الكفاءات of earlier lessons — earlier years included — that this lesson builds on, read from the learning net by `lessonId`; a link when that lesson is published, « قريبًا » when it is only planned. Nothing to write per lesson: it comes from the lesson's `programmeItems` (`LEARNING_NET.md` §3). Advice tiers are computed on the score ratio (`kit/diagnosticLevel.js`). « التالي » without submitting does not complete it. |
| `Module01…` — the activity | `trigger` | the lesson's ENTRY POINT, designed by the platform (§4ter): the signature manipulation in the `intro` slot, at the TOP of the page, then questions on what the student did there (§4quater). The textbook's own activity is one candidate for this entry, never the default — when it is not chosen it is posed as an application later (typically in أتمرّن) |
| `Module02Maarif` — معارف | `discovery` | the textbook's definitions, each laid by a `KnowledgeBrick` at the moment it is needed |
| `Module0xAwazzif` — أوظّف تعلّماتي | `practice_lab` | the textbook's exercises via `TextbookExercise` |
| `Module0xItqan` — إختبار أولي | `evaluation` | the only source of assessment evidence (displayed title « إختبار أولي » since 2026-09-24; the slug `itqan` and the file name are unchanged, so URLs and saved progress are stable); its `desc` names learning points « الكفاءات », e.g. « خمسة أسئلة تُقيّم الكفاءات الثلاث. » — never « نقاط التعلّم », see ARABIC_RTL_CONTRACT §terminology). Since 2026-10-14 its correction shows, under each WRONG answer, « راجع: <درس> (<السنة>) » toward an earlier year — derived from the question's `assessment.learningPointIds` through the learning net, nothing to write (`EXERCISE_CONTRACT.md` § « Earlier-year review link ») |

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
| `body` | what is the concrete situation? (one or two sentences — never a list of questions the student cannot answer yet, never a rule) | yes when there is a brief |
| `footer` | on what source does it rest? (`SourceTag`) | no |
| `visual` | an optional context vignette | no |
| `tone` | the accent colour (8 available) | defaults to `slate` |

**It is data-driven, never lesson-specific.** No context is coded into the
component: football, a library or flowers arrive through `visual` and the text.
A module that supplies neither headline nor visual gets the same card, plainer
— which is why the 40 existing modules needed no change when it was redesigned
(2026-09-21).

Three rules worth knowing:

- **A lab module passes NO brief** (since 2026-10-14, §4quater): the lab's own top — its context and its ONE question
  (MANIPULATION_DNA §17.9) — is the brief. A card above it would be a second, competing start.
- **The visual is decorative and optional.** It helps the student picture the
  situation; it never carries mathematical information, so it is `aria-hidden`
  unless it has its own `alt`. Do not force one where it adds nothing.
- **It is drawn, never generated.** The card lives under `lessons/`, so the
  root `CLAUDE.md` no-raster rule applies to it as to everything else
  (`PitchScene` in `manipulations/primitives/PitchBackdrop.jsx` is the worked
  example).

### 4ter. The textbook is the REFERENCE of الكفاءات, not the script of the lesson (owner rule, 2026-10-14, binding on every generation)

The owner, on the generated 1AM lessons: « the book is the truth reference of the learning points of the lessons, not
necessarily the content itself — the platform has more capabilities of demonstrating the ideas to the student ». A lesson
that copies the book — its activity as the entry, its questions as the steps, its examples, its order — repeats a page the
student already has on the desk and wastes what only the platform can do (a lab where the hand makes the mathematics,
immediate feedback, a drawn world, a refusal).

**What the textbook decides:** WHAT is taught — the lesson's الكفاءات (with the catalogue `pointsToLearn` and the programme
items), the definitions and their wording, the notations and vocabulary the class uses, the expected answers, the boundary
with the neighbouring lessons. Every textbook element still has exactly one destination (`check:textbook`).

**What the platform designs, deliberately and ambitiously:** HOW it is learned —

1. **The entry point.** Ask « in which situation does this idea become NECESSARY for the student's hand? »
   (MANIPULATION_DNA §1–§2). Compare at least two candidates; the textbook's activity is ONE candidate, never the default.
   Reject an entry that asks questions the student can only answer from memory (that is a test, not a discovery).
2. **The order of ideas** — by what the student can discover from what they just did, not by the page order of the book.
3. **The examples and contexts** — chosen for what they make VISIBLE (a contrast, a refusal, a surprise, the student's own
   number); textbook numbers are kept where they serve, replaced where the platform's serve better.
4. **The place of each textbook element** — where it serves best. Typically: the activity becomes an APPLICATION after the
   discovery (in أتمرّن, « نشاط الكتاب ص N »), the معارف box NAMES what the student has just found, the exercises are
   practice. Move the element's `destinations.<id>.module` in `build-extraction.py` accordingly.
5. **Write the design down**, in the `lesson.config.js` header: the chosen entry, the rejected candidates and why, the order
   of ideas. A lab that is the designed entry declares `experience: { type: 'platform_context', reason:
   'platform_designed_entry' }` (`ADAPTATION_REASONS`, `packages/core/curriculum/manipulationLevels.js`).

Reference: `kitabat-adad-tabii` (1AM), redesigned 2026-10-14 — entry = the pencil workshop (the number cannot be WRITTEN
until every ten is tied); rejected = the book's نشاط 1 (0 1 3 8 / 25 and 52 / 999, answered from memory), now posed in
أتمرّن; order: ten-for-one → position value (the two 7s of the student's own 2577) → the 0 that keeps a place → reading by
classes (the dictation lab opens معارف) → rank table → مفكوك → رقم / عدد (banknotes).

### 4ter-bis. INDEPENDENCE FROM THE BOOK — the platform is self-sufficient (owner rule, 2026-10-15, CRITICAL, binding on every generation)

The student never needs the textbook and is never sent to it. **Read the textbook → analyse it → get the idea → generate your OWN content.**

- **Never** write a student-visible string that points to the book: « الكتاب ص 55 », « اقرأ ما يقوله الكتاب », « نشاط الكتاب », « تمارين من الكتاب »,
  « أرغفة الكتاب », « استحضر مكتسباتي — ص 52 ». Module `brief` tags are the platform's own words (« معارف », « أستعدّ », « أتمرّن »).
- **Never** copy the book's boxes (تعريف · خاصية · ملاحظة · مثال · طريقة) or exercises to the student verbatim. Re-write each definition, remark and
  example in the platform's own sentences, with the platform's own contexts and numbers (same mathematical content, same notation, same
  rigour — different words). The extraction stays the REFERENCE of WHAT is taught (الكفاءات, notations, expected answers), never of HOW it is said.
- A book activity/exercise is **analysed, then redesigned**: new context, new numbers (checked by computation), same competence. The book's text
  may survive in `content/textbook.js` only as the authors' reference data; it must not reach the screen as-is.
- `SourceTag` is **muted for students** (`reveal` is for author / teacher tooling only): no « الكتاب المدرسي — ص 57 — تمرين 1 » badge. The `source`
  objects stay in the content files for traceability (`check:textbook`).
- A lab's wording is the platform's too (e.g. `fair-share` speaks of cakes — « كعكات » — not of the book's loaves).
- Retrofit: lessons generated before this date may still carry book-derived boxes, exercises and tags; each is rewritten when its lesson is next touched
  (`hasil-qisma-kasr` modules 0, 2 and 4 were cleaned on 2026-10-15; its book-derived exercises in `content/exercises.js` remain to be redesigned).

### 4quater. One module = one track: act first, answer about what you did, then name it (owner rule, 2026-10-14)

The page of a module reads top to bottom as ONE path. Two parallel tracks — a card of questions on top, then a lab with its
own question, then steps that answer the card — leave the student asking « where do I start? ». The order is always:

1. **Act.** The top of the module is the student's ACTION: the lab (its context + ONE question, DNA §17.9), or — in a module
   without a lab — the first question to try. Never above it: a textbook statement, a card listing questions, a definition, a
   `ManipulationWorkspace` `title` / `lead` repeating what the lab already says (pass neither; the level selector stays).
2. **Answer about what you did.** Each step's question is about what the student just DID or SAW, in their own numbers
   (« في لوحتك 2577 يظهر الرقم 7 مرّتين… »), and can be answered from that experience. A short evidence line recalls the
   trial (`onTrial` → `[data-activity-evidence]`) and, if the student skipped it, says where to go — it never blocks.
   A step never re-poses a textbook question the lab did not prepare.
3. **Name it.** Then the brick (with « أتوقّع القاعدة » first, §14.3ter) and the textbook's box that NAMES what was found —
   after the answer, never before the question (`معارف`: question → box → brick).

`brief` is optional: a lab module passes none; a practice module (أتمرّن, أتعمّق) may keep one that says what the module is
(« ستة تمارين من الكتاب… »), never a rule or a fact the module asks for. Step titles are questions (§5 « Discovery pass »).
A lab's own onboarding (« what do I press now? ») is `LabCoach` — **mandatory for every manipulation** (owner, 2026-10-14;
MANIPULATION_CONTRACT §8quater, DNA §17.11), validated on `kitabat-adad-tabii`; a new or modified lab without it is not done.
Reference: `kitabat-adad-tabii` modules 1–3 (2026-10-14). The owner validated this reference the same day: it applies to every NEW lesson
now and to the existing ones by the retrofit in [`../reports/LESSON_METHOD_RETROFIT.md`](../reports/LESSON_METHOD_RETROFIT.md).

### 4quinquies. The redesign checklist — what was done to `kitabat-adad-tabii` (2026-10-14; follow it for a new lesson and for a retrofit)

1. **Design the entry first** (§4ter): candidates compared, the choice and the rejected ones written in the `lesson.config.js` header.
2. **Module 1**: no `brief`, no `ManipulationWorkspace` `title` / `lead`; the lab (both levels) in `intro`; `moduleSubtitle` never repeats the
   lab's question; steps = questions on the student's OWN lab numbers (« في لوحتك 2577 يظهر الرقم 7 مرّتين… »), each preceded by an
   evidence line from `onTrial` (`[data-activity-evidence]`, never blocking) and followed by its brick.
3. **Bricks after the answer**: `{q1 && <KnowledgeBrick …/>}` and the textbook box that NAMES the idea after the question — a brick or
   box visible before the answer gives it away. Re-check `audit:knowledge:gate` (`E_REQUIRES_ESTABLISHED_LATER` ⇒ drop that question's `requires`).
4. **No question that repeats the lab's own prediction** (module 3 asked « كم ورقة؟ » right after the lab did): ask WHY / the next idea instead.
5. **Module 2 (معارف)** opens on a lab (the dictation, posed alone with `levels={false}`) or its first question; definitions come after.
6. **The book's activity** becomes an application: an `EXERCISES` entry (`id: 'act-1'`, `TextbookExercise`) in أتمرّن, its
   `destinations.<id>.module` moved in `docs/sources/<g>/unit<N>/build-extraction.py`, `extraction.json` rebuilt, the content test extended;
   knowledge items / map nodes that quoted the book's numbers now quote the student's own (`WORKSHOP`-style data in `content/textbook.js`,
   `addition('platform_designed_entry')`, lab resource `experience.reason: 'platform_designed_entry'`).
7. **A top card on a non-lab module** says what the module is, never states a fact the module asks for.
8. **Every lab** carries the onboarding (`LabCoach`, MANIPULATION_CONTRACT §8quater) — default on. Shell-based labs wire it through the shell's `coach` prop (§8quater « Wiring for labs built on `ManipulationShell` »); never point at the answer the student must find.
9. **e2e + tests**: assertions « no `[data-module-brief]` above the lab », « the brick is hidden before the answer » (see
   `e2e/lesson-kit/1am-adad-tabiiya-ashriya.mjs`), the coach script `e2e/lesson-kit/lab-coach.mjs`, the retrofit check `e2e/lesson-kit/moyen-retrofit-phase1.mjs` (no `[data-module-brief]` above the lab, lab before the first question, bricks absent before their answer, coach step id — copy a block per new lesson); a step question asks WHY or about the student's own trial, never « which calculation » when the lab already asked it (phase-1 retrofit, 2026-10-15); `check:lessons`, `check:textbook`,
   web tests from `apps/web`; entry budget unchanged.

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
from `lessons/common/textbook` (a `MethodSteps` line may be a React node since unit 10 — e.g. a calculator key sequence as LTR
`<kbd>`, never KaTeX; a fraction of Arabic WORDS is `WordFraction`). `npm run check:textbook` fails if an extracted
element has anything other than exactly one destination.

**Textbook figures — analyse, then reproduce or REDESIGN (owner rule, 2026-10-04, binding on every future lesson).**
The textbook gives the CONCEPT of a figure, not its drawing. Scanned figures are often cramped: a narrow strip, shapes
piled on one another, labels colliding with other labels or points (unit 11 act-1: C′ on C, E on L, H on P in a
2 : 1 strip). Before drawing any textbook figure:

1. **Analyse it**: what does each question need to SEE (which points, which arrows, which equalities)? Is the
   textbook drawing readable in a lab box of 354 px (the floor, `MANIPULATION_CONTRACT.md` §8bis « Screen floor ») — near-square, every label free, every shape distinct?
2. **Good → reproduce it** as GeoFigure data, faithfully.
3. **Not good → generate a better one with the SAME concept**: same mathematical situation, same named points and the
   same questions where possible, but a layout that reads — spread the shapes over a near-square grid, separate
   images that overlapped, move points so that no label collides, one tone per image. Then RECOMPUTE every answer
   on the new coordinates with the unit's exact module (never reuse the textbook's answers blindly), keep citing
   the same element (`src(...)`), and say it in ONE discreet line under the figure (`caption`: « أعادت المنصّة رسم شكل
   الكتاب بوضوح أكبر، بنفس المعطيات »). If the redesign changes an answer, the lesson shows the new one.
4. **Make it BIG and easy to see** (owner, the same day): a figure is read, not glanced at. A grid figure displays at
   540 px by default (`GeoFigure` `maxWidth`), any figure with more than ~6 named points at ≥ 480 px; never shrink it
   to fit beside text — put it on its own row. On a phone it takes the full width.
5. **Measure it**: `figureQuality(fig)` (`lessons/common/components/geoFigure.js`) returns the defects — a strip
   (aspect > 2 : 1) or a label colliding with another label or point. Every lesson's `content/figures.test.js` asserts
   `figureQuality(fig)` is empty for each figure (a figure of collinear points passes `{ maxAspect: Infinity }`
   with a comment saying why).

The rule holds everywhere a figure is drawn: modules, the final test, the practice bank (`statement.figure`),
the unit page's تحدّ, and a lab's textbook level.

**Figures in SPACE (unit 14, 2026-10-05).** A solid is never a GeoFigure: it is `SpaceFigure`
(`lessons/common/components/SpaceFigure.jsx` + `spaceFigure.js`, `kind: 'space'`) — 3D points with z up, an orthographic
`view { azimuth, elevation }`, `solids` (sphere + equator, polyhedron from faces — `cuboidPoints` / `cuboidFaces` name a pavé the
textbook's way —, vertical cylinder / cone / frustum), `circles` (`on` a sphere: back half dashed), `planes`, `sections`, `segments`,
`rightAngles`. Hidden lines are dashed BY COMPUTATION, as the textbook draws them (« الجزء الخلفي بخط متقطّع »). The same rules apply —
analyse, redesign when needed (a plane seen edge-on: turn the view), big, measured by `spaceFigureQuality(fig)` = [] in
`content/figures.test.js`. A flat figure inside a space problem (the right triangle OAM of a section, the axial section of a frustum
for Thales) stays a GeoFigure.

### Values in story contexts (owner rule, 2026-10-10)

Every word problem — in a module, a « مسألة », a textbook situation or a practice exercise — sets its situation
in a scene that carries a good value or deed: إتقان العمل، القراءة والعلم، الصدق والأمانة، العطاء والتكافل،
التعاون، برّ الوالدين، احترام الوقت، النظافة، حبّ الوطن. Rules:

- **Context only.** Numbers, quantities, conditions, answers and ids never change; the question asked stays
  mathematically equivalent. A pure-math item (« احسب… ») gets no invented story.
- **Woven, not preached**: one clause or sentence, short enough for a phone; rotate the values inside a lesson
  rather than repeating one. Religious phrasing (« الإنفاق في سبيل الله »، « صدقة جارية ») is welcome but sparing.
- A hint, an explanation or a test that recaps the story must be updated with it.
- Applied to unit 1 on 2026-10-10 (≈ 180 stories) and **extended to units 2–14 on 2026-10-13** (all lessons: مسائل,
  `lessonProblem`, platform texts, story exercises of `content/practice`); the unit-card challenge `textAr` was reworded
  for units 2, 5, 6 and 11 (`units_4am_2026_2027.json`, together with the lesson's `CHALLENGE.text`). New lessons follow the rule from the start.
- Extension checklist (units 2–14, 65 lessons) and the six places to touch per lesson:
  [`reports/UNIT1_REFERENCE_CHANGES_2026-10-13.md`](../reports/UNIT1_REFERENCE_CHANGES_2026-10-13.md) §1.
- Textbook-derived situations were reworded on the platform; `docs/sources/**/extraction.json` keeps the
  verbatim textbook wording (`check:textbook` still passes). The unit page's « تحدّ » card reads the curriculum
  `textAr` (`packages/core/curriculum/dz/units_4am_2026_2027.json`), reworded for unit 1 to match
  `bahth-pgcd/content/textbook.js › CHALLENGE`: change both together.

### Discovery pass on module text (unit 1 pilot, 2026-10-09)

A lesson's text must not state the law before the student has produced it (same principle as MANIPULATION_DNA §16, applied to
words). When writing or reviewing a module:

1. a manipulation `lead` names an **observation to make**, never the conclusion (« لاحظ ماذا يحدث لـ… », not « لاحظ أنّ… لا يتغيّر »);
2. a task describes the **action**, not the rule (« وزّع على حصص متماثلة », not « اقسم على قاسم مشترك »);
3. a step title carries no answer (« إلى أيّ عدد نختبر؟ », not « لماذا نتوقف عند 10؟ »);
4. an explanation or lead does not use a tool taught later (no √ bound, no « بالخاصية » before the property is seen);
5. the completion message and a `predictPrompt` are **questions**, and refer to what the student SAW, not to the module's conclusion;
6. a `PredictRule` sits right after the student produced the material for a name or method — the name is asked for, then given.

Applied to unit 1 (2026-10-09) and **extended to units 2–14 on 2026-10-13** (step titles/subtitles turned into questions, leads that
stated the law rewritten, `predictPrompt` hints removed, some bricks moved after the answer). One contract detail: a question whose
`requires` names a brick placed AFTER it fails `audit:knowledge:gate` (`E_REQUIRES_ESTABLISHED_LATER`) — when the brick is moved after a
discovery question, drop that question's `requires` (the brick then follows the student's answer). Checklist in
[`reports/UNIT1_REFERENCE_CHANGES_2026-10-13.md`](../reports/UNIT1_REFERENCE_CHANGES_2026-10-13.md) §2.

---

## 6. Manipulations

Read [`MANIPULATION_DNA.md`](../architecture/MANIPULATION_DNA.md) **before designing
one** (why), then [`MANIPULATION_CONTRACT.md`](../architecture/MANIPULATION_CONTRACT.md)
before touching one (how). In short:

**Living worlds (2026-10-13, owner directive).** The documented patterns are a floor, not a ceiling. When a concept is a
law that many objects obey, prefer a WORLD where the hand holds the cause, predictions are classified by misconception model,
the student WRITES the law and the world tests it on every object, and a companion only asks questions — never the rule. The
pattern, its gate and its tests are in [`MANIPULATION_DNA.md` §16](../architecture/MANIPULATION_DNA.md); reference
`geometry/ShadowWorld.jsx` + `logic/shadowWorld.js`.

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

- **One screen, no scroll (owner rule, 2026-10-01 — every manipulation).** The
  object, every control that acts on it and the reading it produces fit ONE
  viewport (1920 × 1080 down to 768 × 1024 / 1024 × 768 — tablet and laptop only): the stage height is budgeted from
  `100dvh`, countable objects shrink with the scene, handles sit beside what
  they move, secondary material goes below. A lab whose sliders are a scroll
  away from the figure they change is not done.
  For a large activity the student chooses what to see: secondary blocks are
  hidden / shown with `primitives/LabFold.jsx`, and a gauge or counter may
  float on the scene in `primitives/MovablePanel.jsx`, which the student
  drags aside (pointer or arrows) — never write a local version of either.
  Many objects form a near-square block (32 agents = 6 × 6), never a strip.
  [`MANIPULATION_CONTRACT.md` §8bis](../architecture/MANIPULATION_CONTRACT.md).
- **One visual language (2026-10-14).** A new or redesigned lab composes the shared kit — `primitives/LabKit.jsx`
  (PromptCard, ChoiceCard, StepperCard, NamePill, VerdictBanner…), `primitives/SvgPill.jsx` (value pills, dimensions) and, when
  people are measured, `primitives/KidFigure.jsx` (a drawn child whose crown IS its height) — never a local look-alike. Reference:
  `operations/StoryBars.jsx`; contract [`MANIPULATION_CONTRACT.md` §8ter](../architecture/MANIPULATION_CONTRACT.md).
- **Always push the UI/UX to the limit — Gen Alpha, 11–13 (owner rule, 2026-10-14, every generation).** A lab that only
  « works » is not done: build each new or redesigned manipulation to the best finish you can produce — a rich drawn world,
  the shared kit, physical gestures with purposeful micro-animations, immediate visual feedback in the student's numbers
  (never the rule), one screen at four sizes, honest drawing — and REVIEW screenshots of the initial and mid-activity states
  at 768 / 1024 / 1280 / 1366 before finishing. The full bar:
  [`MANIPULATION_DNA.md` §17](../architecture/MANIPULATION_DNA.md); gold-standard question 6 (§14).
- **Say it ONCE (owner, 2026-10-14).** Gen Alpha does not read repeated text: the question lives in the lab's prompt card (no
  shell `mission` on a kit lab), the gesture in one line, the story mapping in a one-line `lead` (« كل قفزة = عقد من 17 لؤلؤة. »)
  — a lesson's `lead` never restates the question, the gesture or the strategy. Hints are closed by default, short thinking
  questions. [`MANIPULATION_DNA.md` §17.7](../architecture/MANIPULATION_DNA.md).
- **Context, then ONE direct question — no title (owner, 2026-10-14, every lab).** The top of a lab is the context in one or two
  plain sentences with every given, then one question/instruction that names the goal and the end state (« اربط الأقلام حتى
  تستطيع كتابة عدد الأقلام. »). A lesson passes no lab `title` that only names the lab or poses a riddle (« صناديق وعلب وحزم وأقلام: كم
  قلمًا في الورشة؟ » was the counter-example). **No ambiguity:** every card row, number, pill or button on the stage sits under
  its own question/label that says what to do with it (three bare prediction cards « 1 132 437 · 2 577 · 75 » were the
  counter-example). [`MANIPULATION_DNA.md` §17.9](../architecture/MANIPULATION_DNA.md).
  How (kit labs, 2026-10-14): the shell gets `titleHidden`, the `PromptCard` its `context` slot (`MANIPULATION_CONTRACT.md` §8ter);
  on the five 1AM kit labs a lesson's `lead=` REPLACES the lab's default context on the authored level, so it must carry every number
  (« عندنا 253 لؤلؤة، وفي كل عقد 17 لؤلؤة: كل قفزة على المستقيم طولها 17، أي عقد. ») — otherwise pass no `lead`.
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
  component. The forty-four types (ten for unit 1, three for unit 2, two for unit 3, four for unit 4, three for unit 5, four for unit 6, five for unit 7, four for unit 8, five for unit 9, four for unit 10) live in
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
  `lesson.manipulation.json` (`themes.<id>`, keys `lesson:manipulation.themes.<id>`), the scene from `GroupingScene`,
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
- **People are the platform's CHARACTERS — `KidFigure`, never a one-off (owner, 2026-10-14).** Whenever a lab or a
  scene shows a pupil (a height on a gauge, a team, a queue, a class), draw it with `primitives/KidFigure.jsx` (geometry
  `primitives/kidFigure.js`, tests `primitives/labKit.test.jsx`, contract
  [`MANIPULATION_CONTRACT.md` §8ter](../architecture/MANIPULATION_CONTRACT.md)). The cast:

  | Who | How they are drawn |
  |---|---|
  | **Girls** | ALWAYS in Islamic dress: `hairStyle="hijab"` + a `scarf` from `SCARVES` (`rose`, `lavender`, `mint`, `sky`, `sand`) — the scarf covers the head, ears and neck and is draped over the shoulders and chest, with a forehead band and a pin — and a long tunic over wide trousers (automatic with the hijab). There is NO uncovered-hair style for a girl. |
  | **Boys** | a hoodie (hood, drawstrings, kangaroo pocket), `hairStyle` `short` or `curly`, `hair` from `HAIRS`. |
  | **Everyone** | an 11–13-year-old with a friendly illustrated face; `skin` from `SKINS` (vary it across a scene), `outfit` from `OUTFITS`, `mood` `happy` (default) · `wonder` (still unknown, thinking) · `proud` (just solved) · `neutral`; `unknown` + `mark="؟"` puts a « ؟ » badge on the chest of the person whose value the student is looking for. |

  How to use it:
  ```jsx
  import KidFigure from '../primitives/KidFigure';
  // in the scene's SVG: the crown is EXACTLY `top`, the soles touch `foot`
  <KidFigure cx={x} top={g.yOf(130)} foot={g.floor} hairStyle="hijab" scarf="rose" outfit="pink" skin="light"
    mood="happy" data-sb-person="sara" data-height={130} />
  ```
  - **The drawing is the measure.** If a height matters, the floor is 0 and the crown is the value on the same scale as
    the ruler — a child floating above the ruler's zero (as in many mockups) is a wrong lesson.
  - **A stable cast per lesson.** Give each named person ONE look in a `LOOKS` map inside the lab (story-bars:
    `sara` rose hijab + pink tunic, `rim` lavender hijab + violet tunic, `amine` blue hoodie…), so every student sees the same
    سارة; `kidLook(index)` is only a deterministic fallback. Names come from the textbook or are Algerian first names, with
    the word « زميل / زميلة » the textbook uses.
  - **Read it with the kit:** a value pill above the head (`SvgPill`, `pointer="down"`), a name pill under the feet
    (`NamePill`, filled for the person the student holds), a difference as `SvgDimension` without a sign (« 6 cm », not
    « +6 cm » — the drawing must not dictate the operation).
  - Need something the character cannot do yet (sitting, holding an object, another age)? Extend `KidFigure` and its
    tests — never draw a second, local person, and never use a raster or generated image.
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

**The practice bank is written as BEM exam sheets — the standard since 2026-10-06.** A new or
reworked bank is 50 exercises (10 per level), each carrying `metadata.exam`: official papers from
the 2007–2025 annals (« BEM <year> », word for word, official solution), adapted ones (other
numbers) and « على منوال BEM <year> »; level 5 holds « الوضعية الإدماجية (08 ن) » sheets. Each
question is a STEP (`step`, `sub`, `solution`, optional `work`, `timeSeconds`, `counted: false`
for a step of another lesson or year). Which annals exercise belongs to which lesson is fixed by
`docs/sources/4am/bem-practice/annals-index.md` (cite each exercise ONCE). Format and rules:
`docs/sources/4am/bem-practice/brief-authors.md` and `EXERCISE_CONTRACT.md` § « Présentation
examen (BEM) ». The lesson switches to the BEM levels page when it is added to
`content/practice/exam-style.json`, after its audit; until then it keeps the classic page.

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
with neutral ✓ / ~ / ✗) and « حالتك على الكفاءات »
(`LessonLearningPointsStatus`, the Learning Point states from the server).

---

## 8. Classroom Mode

**You do not implement anything.** A lesson built with `buildLessonRoutes` and
modules built with `ContentModule` are already presentable: the lesson shell is
in the route factory, the entry button is in `LessonIndex` and `ModuleLayout`,
and `ContentModule` derives the presentation units.

Two things you get for free, and how to write for them (2026-10-13): **an entry page** per module (title +
« ماذا سنتعلّم » = your step titles, or an `objectives` array on `ContentModule` — write short
sentences or questions) and **pages** inside a step too tall for the screen. For pages, write a step's
content as one wrapper `<div>` whose **direct children are whole blocks** (a brick, a question, a figure):
the engine only cuts between blocks. See `CLASSROOM_MODE.md` § « Pages ». Every `ContentModule` of the 74 lessons now carries
`objectives` (2–4 short points, questions on discovery modules).

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
| **`wadiya-idmajiya-aadad`** | the `synthesis` kind: no discovery or formalization, mobilises what the other lessons taught. Never counted as a lesson. Since 2026-10-13 it carries **six practice « وضعيات تدريبية »** (modules 1–6, GuidedProblem, `content/problems.js`), then « تحليل الوضعية النهائية للاختبار » (module 7) and « وضعية الاختبار النهائي » (module 8, the textbook's aprons challenge) — the only synthesis with `track: 'problem'` modules (`MASAIL_GENERATION_GUIDE.md` §14). |
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

Unit 5 « جمل معادلتين من الدرجة الأولى بمجهولين » (`…/jumal-muadalatayn/`, 2026-10-01), four authors on a
seeded foundation, the first unit under the one-screen rule:

| Lesson | Read it for |
|---|---|
| **`mafhum-jumla`** | the PAIR held by the hand (`pair-scoreboard`): two gauges, a claim refused while one equation fails, the swapped pair as a refused trial; the textbook's 32 agents in a near-square office that fits one screen with both handles; the تحدّ (coins) as REAL hook and transfer on the same lab; the special cases (none / infinite) written line by line; a two-answer QCM as a combination choice |
| **`hall-jabri`** | `elimination-cards`: a discovery that opens only when BOTH methods (the textbook's two students) gave the same pair; the worked example revealed line by line; « which method » taught as a platform brick whose distractors state false facts about the coefficients; a three-answer QCM as combinations in the BossFinal; `pair` with `names` for (a ; b) / (d ; t); exact non-integer pairs (68/19 ; 39/19) kept as the textbook prints them |
| **`mushkilat-jumla`** | `story-modeller` as the textbook's 5-step table, the table's «حل» column filled ONLY from the student's own lab work; the method applied to the تحدّ and to أبو كامل's problem (classical reading declared); a story whose solution is not a natural number; SVG figures for ex-19 and ex-21 |
| **`wadiya-idmajiya-jumal`** | the synthesis reusing `story-modeller` (`theme="party"`, two money facts, `LAB` in `content/textbook.js` + `lab.render.test.jsx`); solving and checking practised on the beginner numbers so the textbook answer stays for the final test; QCM items 2 and 6 as « صحيح / خاطئ » batches; ex-31 corrected |

Unit 6 « الدالة الخطية والتناسبية » (`lessons/moyen/4am/tanasubiya_duwal/tanasubiya-dala-khattiya/`, 2026-10-02), six
authors on a seeded foundation, under the owner's display ميدان « ميدان التناسبية والدوال »:

| Lesson | Read it for |
|---|---|
| **`tanasub-muamil`** | a unit ENTRY lesson with no formal textbook « معارف »: proportionality taught as declared platform reminders (`prior_year_reminder`), never as the textbook's words; `ratio-ride` — the student's OWN rides recorded as table columns, « جدول تناسبية » refused with two quotients, the fixed unlock fee as the contrast; act-1 Q1 as a declared duplicate with the 20 % correction; no f(x) notation before lesson 2 |
| **`dala-khattiya`** | `linear-machine`: a hidden rule fed with the student's own cards, a claim refused with a witness, 0 that fixes nothing, the machine run backwards for the antecedents of act-1; act-2's three machines classified; method-determine revealed line by line; QCM 2, 3, 5, 6 in the BossFinal |
| **`tamthil-bayani-khatti`** | `origin-line` built for three lessons: O that refuses to move, a point refused with its gap, readings by probes, the GeoGebra slider of p. 76 (`tech-76`) honestly replaced by the lab's `pivot` mode; the ex-14 sign trap made explicit; exercise graphs drawn in SVG |
| **`tatbiqat-tanasub`** | `percent-tag`: the additive bar refused by the multiplied one, the tank's chain BET before it is built (−15 % refused by the water); compound quantities (speed, flow, density) with the act-6 copper and know-4 kWh corrections; QCM 7 (three correct) as a combination choice |
| **`tarrid-khatti`** | a modelling lesson reusing `origin-line` in `fit` mode (beginner on a platform cable car because no lab world draws kg × DA; the textbook's spring at advanced), act-4's three graphs redrawn, the spring method revealed after the student completes the table, the تحدّ (two vehicles) as transfer |
| **`wadiya-idmajiya-khattiya`** | the synthesis: the cable car (Pythagoras → time → cost 3,8x) in the textbook's three phases, practised on a platform cable and family so the textbook answers stay for the test; `origin-line` `read` + `cap` (`theme="budget"`, `experience.theme: 'cablecar'`); the largest price ROUNDED DOWN (526 DA) and why; all 8 QCM one step each; units with a slash put in `$…$` (they reverse in RTL) |

Unit 7 « الدالة التآلفية » (`lessons/moyen/4am/tanasubiya_duwal/dala-taalufiya/`, 2026-10-02), six authors on a seeded
foundation, same display ميدان; the supplied textbook pages have NO formal pages, so every lesson declares its formal knowledge:

| Lesson | Read it for |
|---|---|
| **`mafhum-taalufiya`** | a unit ENTRY lesson whose textbook has NO معارف: the act-1 payroll on `affine-meter` (three stages opened by the student: the textbook table's columns as ruler marks, the target 37775 reached then the inverse program written, the knobs a / b to b = 0 and a = 0), act-2's six rules as one batch (a and b whatever the writing order), the formalization written by the platform and declared (`knowledge_formalization`), act-1's « أضيف » → « أضف » corrected in one line |
| **`tamthil-bayani-taalufi`** | `affine-line`: the textbook's (d) → (d′) lifted by the student, probe readings at two abscissas showing the same gap, b′ ≠ 1 refused with f(0) = 1, then a chained second lab (a hidden descending ramp read with b′ then the step a′); act-3 2-أ corrected from (1 ; 0) to (0 ; 1); graph figures drawn in `components/AffineFigure.jsx`; `point` answers for (0 ; b) in the bank |
| **`tanasub-taghayyurat`** | `slope-stairs`: the textbook's act-4 staircase COMPLETED by the student's own stairs, the invariant quotient against stairs of different widths, x₁ = x₂ refused; the تحدّ (°C → °F) as a declared duplicate in `points` mode (unknown images refused until the stair gives a, then descend to 0 for b); the property, its proof sketch f(x₁) − f(x₂) = a(x₁ − x₂), and the two methods (a then b, or the system in a and b) |
| **`tafsir-bayani-jumla`** | `line-crossing`: the class fund (نشاط 5) where each condition is first WRITTEN y = ax + b (wrong cards refuted by a witness), then P walked until both lamps light at (36 ; 7); the cases stage chained by the student (parallel / coincident); the platform note on the unknowns the textbook leaves to question 2; « القراءة تقريبية » — a graphical reading is exact only on a grid node, confirmed by calculation |
| **`tarrid-taalufi`** | a lesson whose only textbook element is a declared duplicate (act-4 question 1); `plan-compare` built for two lessons: the bill (the fixed part paid x times refused with the bill's own cost) then the comparison (marker on the crossing, the x-axis painted with the cheapest plan); the comparison taught as equation + inequality + lower line; a five-step platform method (`stage: 'formalization'`) |
| **`wadiya-idmajiya-taalufiya`** | the FIRST synthesis with NO textbook synthesis: a class trip to Tipaza beach (participants by a جملة read graphically, a bus as an affine function — image and antecedent —, a second bus known by two quotes, the two lines' crossing, three kayak tariffs on `plan-compare` `theme="rental"` incl. a constant one), every part linked back to its درس; the final test a transposed trip (Les Sablettes); Arabic SVG axis titles with explicit `direction="rtl"` |

Unit 8 « الإحصاء » (`lessons/moyen/4am/tanasubiya_duwal/ihsa/`, 2026-10-02), five authors on a seeded foundation, same display
ميدان; a COMPLETE textbook unit split into the owner's five lessons:

| Lesson | Read it for |
|---|---|
| **`takrar-mujamma`** | the unit ENTRY on `cumul-gate`: act-1's 20 pupils in the textbook's own (unsorted) order, the student sorts the queue, sets t on a ride's height gauge and ANNOUNCES the count (a refusal names the people of height exactly t), the two textbook tables filled by the student's own accepted counts, « ÷ N » for التواتر; the invariant up + down = N + f(t) as a declared brick; طرائق revealed line by line; دوري الآن (open) made checkable on declared platform data; tables in final-test prompts as KaTeX arrays (`texTable`); bar chart, histogram and pie redrawn in SVG (`components/Charts.jsx`) |
| **`mada-wasit-mutawassit`** | `stat-balance` built for two lessons: the كلّاب then the fulcrum (five e-sport scores / El Oued) with act-3 decided on the student's own fulcrum trials and the HONEST answer to « أي المدينتين كانت أكثر حرّا؟ » (same mean 482/30, (ب) more spread); the curtain in rank space, the far token that moves the mean and not the median; act-4's three parts (class centres 1816/41, median class); معارف 4's misprints corrected; طرائق's « add 3 and 43 » asked BEFORE its solution; the plain mean as `prior_year_reminder`; « اقترح سلسلة » exercises turned into « which series satisfies… » choices |
| **`majdulat-ihsaiya`** | a lesson whose textbook elements are only exercises (ex-7, 15, 16, 23, 24, ex-1 هـ): the spreadsheet knowledge declared (`knowledge_formalization`); `sheet-lab` — the series typed and saved, the hand result before the formula, a short range or a wrong function contradicted by the student's own number, the outlier that moves MOYENNE and not MEDIANE, a chained chart stage; ex-7's screenshot misprint corrected; French (textbook) and English function names accepted; formulas as LTR code (ARABIC_RTL_CONTRACT) |
| **`qiraat-wadiyat-ihsaiya`** | a lesson with NO textbook activity whose entry is the unit's تحدّ on `group-tanks`: the student BETS the merged class's level, the water refuses the mean of the means, the two classes settle at the same 384/33; the opener « تلوث البيئة » as the real context of a platform chart; ex-19's two combined bars read as a puzzle (not a misprint); ex-14 (position AND spread), ex-22 (N = 31 from a removal); the platform method « أقرأ · أحسب المؤشرات · أقارن · أقرّر » |
| **`wadiya-idmajiya-ihsa`** | the synthesis WITH a textbook situation: the Olympic medals' two hidden values found BY HAND on `stat-balance` `mode="hidden"` (the curtain fixes 3, the beam 28), then by calculation in the textbook's three phases (rank 15/16, 176 + 2 × 3 + y = 210, 0,69 × T = 30 → 13); a beginner table whose single hidden value is the EXTREME one (only the balance finds it); the 6 QCM one step each with a link back to their درس; ex-20 corrected (6 → 6,5); the final test TRANSPOSES the situation |

Unit 9 « خاصية طالس » (`lessons/moyen/4am/handasa/khassiyat-talis/`, 2026-10-02), four authors on a seeded foundation, the first
geometry unit, under the programme's « ميدان الهندسة »:

| Lesson | Read it for |
|---|---|
| **`talis-hisab-atwal`** | the unit ENTRY, rebuilt 2026-10-13 around `shadow-world` at BOTH levels (the same world, minaret 5 m then 6,5 m; MANIPULATION_DNA §16: the student holds the sun, WRITES « shadow ÷ height is one number » and sees it break and mend; the synthesis keeps 7,25 m). The `thales-beam` no longer lives in this lesson. Module 1 now runs **world → figure → equality → calculation → the textbook's general letters**: step 1 « from the square to the figure » (`FIG_SHADOW`, (AM) ∥ (BE) because two verticals), step 2 the Thales equality with its three false friends (inverse, the segment AB, the difference), step 3 a calculation on the square's own objects (palm 4,5 m), then the textbook's case 1 (with a bridge « A is our O » and the cinema vignette), its calculations, case 2 and the text, `PredictRule talis-nashat`. Earlier text that said « the screen » was rewritten (module 0 advice, module 2 brief and brick leads, the knowledge prompts). Generation rule shown by this lesson: **when a world replaces a textbook lab, the textbook's questions stay as the FORMALISATION steps and every later reference to the old lab is rewritten**: a screen slid in a projector's beam (`cinema`), tilted, and pushed THROUGH A into the camera obscura (`camera`, the butterfly case); every stop JUDGED by the student and decided exactly; the textbook's questions (56/15 ≈ 3,73, 244/75 ≈ 3,25; case 2 k = 1/2) answered under the student's own stops; three misprints corrected in one line each; أستعدّ 4–5 revisited in أوظّف once the property is known; every figure GeoFigure data, also in the BossFinal (`inline`) |
| **`aksiya-talis`** | `parallel-level`: B′ and C′ PLACED notch by notch, a spirit level on the plank centred only when parallel (`thales.converse`); the graffiti A-frame ladder (6/9: two level planks, so « the midpoints » is refuted) then نشاط 2 on an X-trestle (9/12, ratio 1/3 imposed, figure 3 refused by the ORDER); طرائق in both directions (decide, then reveal); ex-16 يونس / إيناس (an approximation is not a proof) as the map's خطأ شائع |
| **`inshaat-talis`** | a lesson with NO textbook activity whose entry is `segment-divider` (`platform_adaptation`, `tifo` banner): real ruler, compass and set square, a parallel off a mark refused, unequal bands measured exactly; the ratio point inside AND outside on two graduated parallels; دوري الآن done in the lab posed alone; the owner's « نسبة غير ناطقة » taught by one declared example (√13, then 2√13/3 by Thales); a bank that checks the REASONING of constructions |
| **`wadiya-idmajiya-talis`** | the synthesis with a textbook situation: the تحدّ in a **living world**, `shadow-world` (2026-10-13, MANIPULATION_DNA §16: the student holds the sun, measures, bets, WRITES the law that the world tests and the moving sun refutes, repairs it, then finds 7,25 m; the stick at the edge of the minaret's shadow is the textbook's method) and the cylinder in the cone on `cone-cylinder` (piercing refused, h = r → V = 91,125π), two types in one workspace; `MinaretFigure` drawn once for the unit page, M1 and the final test; QCM cells judged one by one; the pyramid of Khufu by its shadow as transfer; the final test transposes cone and minaret |

Unit 10 « حساب المثلثات في المثلث القائم » (`lessons/moyen/4am/handasa/hisab-muthallathat/`, 2026-10-04), five authors on a seeded
foundation, the second geometry unit:

| Lesson | Read it for |
|---|---|
| **`nisab-muthallathiya`** | the unit ENTRY on `ramp-ratios` (`skatepark`): a CHAINED carry inside one level — tap the acute angle (the right angle refused), carry the labels الوتر / المقابل / المجاور onto the sides (the board as « المقابل » refused with its reason), compose cos / sin / tan from the named sides (the hypotenuse over a sine refused, > 1), then lift the rise — the board swung down and stood up always outruns it (0 < sin, cos < 1); at متقدم (act-2) the student JUDGES three ramps at 40° before reading 0,64 / 0,84; the textbook's word definitions through `WordFraction`; the طرائق key sequences as LTR `<kbd>` through `MethodSteps` node lines (`components/KeySequence.jsx`) |
| **`hasiba-muthallathiya`** | `trig-calculator` (`drone`): a drawn calculator that STARTS IN RAD (sin 30 = −0,988 drawn as a side going under the ground), real key sequences, forgetting 2nd contradicted by the drone lying on the ground, rounding as a CUT LINE dragged across the screen digits (truncation refused); act-4's table and its three inverse angles answered from the student's own presses; the know-3 screen misprint corrected; the narrow-screen recipe (4-column keypad, one shared control row under 380 px) |
| **`alaqat-muthallathiya`** | `angle-compass` (`kite`): set square, a carried length, the compass opening and a pencil LOWERED from 90° until the arc cuts the other leg at the exact √(r² − a²); a string shorter than the height never lands; sin 2/5 built on the two legs refused as a tangent (21,8° vs 23,6°); the vertex of x designated by the student; cos² + sin² shown as a bar filling exactly 1 on every triangle, refused ones included; act-5 from lesson B's rounded table (0,87² + 0,5² = 1,0069 — hence the proof); know-4's misprint corrected; « إن أمكن » (ex-18) taught as a declared brick |
| **`tarrid-muthallathiya`** | a lesson with NO textbook activity whose entry is the تحدّ on `clinometer`: the ladder (`mural`) bracketed by hand (1,8 < L < 1,9) before sin ÷ gives 1,9 m; the floodlight (`floodlight`) gives the same height from two distances, the wobble explained by the angle read to the degree; a wrong ratio refused naming the side it would need, a wrong operation refused with the value it would give; platform طرائق on ex-26 (rounding early: 5,8 vs 5,7) and ex-27; the unit page's `LadderFigure` |
| **`wadiya-idmajiya-muthallathat`** | the synthesis REUSING lesson D's lab (`clinometer` `mode: 'align'`, `maqam`, numbers in `content/textbook.js › LAB`, `lab.render.test.jsx`): the observer slides until the pole's top hides مقام الشهيد's — Thales gives 92,09 m, the real height, then tan gives 43° — in the textbook's three phases; the six QCM items (item 3 two correct, item 5's two rows judged separately); أتعمّق's right triangles inside solids, rounding only at the end (22° vs 23°); the final test transposed to the minaret of جامع الجزائر (265 m) |
| **`insihab-shuaa`** | unit 11 ENTRY on `translation-glide` (`drone-show`): the hand holds the leader drone's arrow and each image node; a refusal names the differing element (`vectors.relation`: direction / sense / length); a rogue drone flying −u is the built-in contrast; moving A′ glides every placed image; advanced = act-1 REDRAWN 14 × 8 (the textbook's strip had C′ on C, E on L, H on P — Q / S / T name the images that coincided), its questions answered from the student's own placements; ex-4 / ex-8 count misprints corrected |
| **`shuaayn-mutasawiyayn`** | `parallelogram-pin` (`tifo`): I slid along a scarf (AI vs IB vs BI), then the banner's corner D as the image of C — CD = AB tightens the banner and merges the diagonals' midpoints, DC = AB twists it into a bow-tie —, then E with EB = AC (E on D refused); one workspace mounted twice (M1 مبتدئ, M3 متقدم because it is the طريقة); ex-12's sum prepared and deferred to the next lesson |
| **`majmu-shuaayn`** | the تحدّ (swimmer) on `vector-sum` (`swim`): the velocity's direction turned until the parallelogram's diagonal lies on (AB) — 30° decided exactly (`vectors.crossing`), real speed 2√3, then solved by trigonometry (bridge to unit 10); Chasles by carrying the second leg's tail onto the first leg's head (`scooter`; same origin or a jump refused; return trip → 0); the unit page's `RiverFigure` |
| **`barahin-ashia`** | a lesson with no textbook activity entered by `vector-chain` (`metro`): tickets coupled by Chasles, carried as translations, an equality true on the drawing but not GIVEN refused (« الشكل لا يبرهن »), the proof written line by line by the gestures; `construct` mode for دوري الآن 138 (sums of several vectors head to tail); ex-21 corrected (K) |
| **`wadiya-idmajiya-ashia`** | the synthesis on its own lab `bridge-path` (`crosswalk` / `bridge`): the crossing slid along the road (lengths read), the translation opened by the student, B′ placed and judged by `relation(BB′, NM)`, the bent A–M–B′ straightened (√85 + 2, the extraction's declared example); the textbook street redrawn near-square; QCM one step per item; the final test transposed to an Oran motorway footbridge |
| **`murakkibata-shuaa`** | unit 12 ENTRY on `component-steps` (`delivery`): a rider walked street by street whose signed counters ARE the column vector; codes typed before leaving and judged by where the scooter stops (sign / swap / address-instead-of-trip refused); the depot O where the code equals the address; a destination pin for given components; act-1 without counters at متقدم, D off the figure; the four معالم as vignettes; know-origin's reversed pair corrected; دوري الآن 1 in the lab posed alone (`story: 'draw'`) |
| **`hisab-murakkibatay`** | `component-calc` (`game-map`): the portal's code PREDICTED on signed counters before the hero jumps (a reversed subtraction is drawn backwards), then a portal with two unknown coordinates placed with live (مبتدئ) or deferred (متقدم, `live: false`) component lamps — CD = AB crosses ABCD and is refused; act-2's twin portals DE = CF; method-equal, ex-8, ex-12 misprints corrected; a platform « نقطة مجهولة » method |
| **`muntasaf-masafa`** | `midpoint-distance` (`gps-meet`): two stages opened by the student — the meeting pin (accepted only where AM = MB; the group chat's « sum without ÷ 2 » and « half-difference » refused by name), then the right-angle staircase and the distance claim (the street « taxi » distance and the square refused, only √(Δx² + Δy²) accepted); act-3 / act-4 answered from the student's own trials; the تحدّ as hook, solved at the end (√365 / 3) |
| **`ithbat-khawas-maalam`** | a lesson with no textbook activity entered by `shape-prover` (the فار of the neighbourhood pitch): proof cards sent to the video referee, sufficiency refused card by card (equal diagonals alone are not a parallelogram), the « looks right-angled » start refused by its numbers (10 + 5 ≠ 17); method-unknown (C slides on x = −2 to y = −4) as متقدم, then the square and the circle; perpendicularity without dot product as a declared formalization; the method-unknown figure redrawn so it no longer shows the answer |
| **`wadiya-idmajiya-maalam`** | the synthesis on its own lab `route-compare` (`cross` / `rally`): a BET first, then each route built piece by piece — a semicircle closes only when its centre is the midpoint (wrong centre: the lab names where the arc would end), a skipped checkpoint refused as a shortcut; two smartwatches add exact then rounded lengths (3π ≈ 9,42 vs √13 + √5 + √17 ≈ 9,96); the two levels disagree on the winner on purpose; the final test transposed to جبل الوحش (Constantine), where the broken line wins |
| **`mafhum-dawaran`** | unit 13 ENTRY on `rotation-dial` (`ferris-wheel`): the hand holds the IMAGE point; every drop judged by `rotation.imageCheck`, the refusal naming the missing condition (sense / OM′ ≠ OM / the measure read); مبتدئ = the Ben Aknoun wheel, each rotation asked in both senses (60° ↺ A → B vs 60° ↻ A → F); متقدم = act-2 then act-3 with a real compass (snapped onto OP) and a protractor ruler, the magnet attracting only toward the student's OWN constructions; QCM 1 corrected; ex-5 redrawn with the scan's angles given as gaps |
| **`khawas-dawaran`** | a lesson with no textbook activity entered by `shape-turn` (`zellige`): a tracing-paper sheet turned around a pin, a stretch handle as the counter-example (« ليس دورانا: تغيّر الطول »), invariant gauges (length, angle, area, alignment, the angle between a line and its image), a six-petal rosette stamped by `imageCheck`; متقدم = method-properties ([AC] lands on [BD] only for 90° direct, then property cards prove AC = BD and ⊥) and ex-18's centre pin (two perpendicular bisectors); two declared formalizations (the line-and-image angle, finding the centre) |
| **`zawiya-muhitiya`** | `inscribed-angle` (`football`): the shooting angle — a BET before the reading, the striker held in polar coordinates and snapped to the circle, off-circle vertices refused with their changed measure, the other arc (180° − x); متقدم = act-4's stages (مزيان's equalities with the student's numbers, هوارية with O inside / outside the angle, ex-12's interior point as the half-sum of arcs via `rotation.vertexAngle`); a declared طريقة « من القوس إلى الزاوية »; know-4 and ex-12 corrected, ex-10 / ex-16 data stated |
| **`mudalaat-muntazama`** | the تحدّ (the flag's star) as entry on `polygon-forge` (`honeycomb` / `flag-star`): the rotation angle held, each « دوّر » places the next vertex — the figure closes only when n·α = 360° (50° spirals with its reason, 144° makes a star); متقدم opens three stages (72°, R to 0,01 via sin 36°, the branches with a pentagon side refused); method-angle (108°) and ex-15 corrected; the unit page's `FlagStarFigure` |
| **`wadiya-idmajiya-dawaran`** | the synthesis on its own lab `lamp-ring` (`flower-bed`): posts placed by hand and refused while the gaps differ, then one second post sets the rotation and each « دوّر » places the next image (the ring closes only when n·α = 360°), then the distance chosen by card (half-angle sine; equilateral for n = 6) against the arc, « d = r » and the unhalved angle; the extra after the rule is 12 posts so the final test's numbers (8 posts around an Oran roundabout, 5 m: 45°, ≈ 3,83 m) appear nowhere else |
| **`kura-julla`** | unit 14 ENTRY on `sphere-probe` (`glass-globe` / `shot-put`): the hand holds a point M on whole grid points around a real 3D sphere (drag on its horizontal plane, ▲/▼ for the height, x/y/z spinbuttons); every claim judged EXACTLY by `space.ballPosition`, the refusal naming the comparison (« OB = √3 < 3 = R »); the كرة / جلّة toggle on the stage is act-1's contrast; at متقدم OM is never shown during the gesture; a second stage opened by the student: a diameter [MM′] (a chord refused), great and small circles with a plane z = h; know-1's egg-shaped figures redrawn |
| **`misaha-hajm-kura`** | a lesson with NO textbook activity entered through the Archimedes introduction (declared duplicate), on `orange-peel` (`boufarik-orange`): the student predicts how many discs of radius R the peel covers (locked by the gesture; the peel overflows into red ghost discs or leaves one empty), then the juice of the ball poured into the wrapping cylinder stops at 2/3; cards judged on DIMENSION then value (the R = 3 « 36π cm² = 36π cm³ » trap); the book's rounding as a number of decimals; the method « القيمة المضبوطة ثم المدوّرة » and its reverse declared `knowledge_formalization` |
| **`maqati-mustawiya`** | `section-slicer` (`3d-printer`): each printed layer is a plane section; the student holds the plane (the printer's nozzle dragged on `onLine` + an HTML rail) and PREDICTS each layer by card before it prints — a wrong card stays as a dashed ghost layer that misses the surface or sticks out of the solid (OM = √(h² + ρ²) written against R); the sphere's discovery needs a great circle, a small one and contact / nothing; the act-3/4/5 solids are tabs of ONE lab at متقدم; the missing pyramid / cone page declared `knowledge_formalization`; act-3 part 2 redrawn |
| **`takbir-tasghir`** | `scale-blocks` (`voxel-blocks`): act-6's cuboid built in unit cubes; k held by a 3D handle on the image's far corner (snapped to a list) + a stepper; the image volume predicted (×k, ×k², ×k³) before « ابنِ » and refuted by the COUNT (each cube becomes a same-colour block of k³); the « +1 cm لكل حرف » contrast (6/5 ; 5/4 ; 4/3: not an enlargement); the missing knowledge and methods declared `knowledge_formalization`; act-5 as a duplicate (the pyramid's section = a reduction of ratio 3/4) |
| **`wadiya-idmajiya-fada`** | the synthesis whose situation is the unit's تحدّ (the scan has no « أدمج تعلّماتي »): the frustum bucket on `bucket-fill` (`beach-bucket`) in three phases the student opens — the water level read from the drawing (7 cm from the BOTTOM refused), the apex S lowered until the generators pass through the rim (SO = 105, Thales in an axial-section `MovablePanel`), V = V₁(1 − k³) = 24388π/3 ≈ 25,54 L chosen by card against k and the mean-radius cylinder; QCM one per lesson, أتعمّق the reverse path (k³ → k, a melting ice cream), the final test a frappé glass in Oran |

1AM unit 2 « الحساب على الأعداد الطبيعية والأعداد العشرية: الجمع والطرح » (`lessons/moyen/1am/ansab_al_aadad_wal_hisab/jam-tarh-ashriya/`,
2026-10-14), the FIRST 1AM–3AM content, generated lesson by lesson:

| Lesson | Read it for |
|---|---|
| **`mana-jam-tarh`** | a lesson whose concept is a MEANING (choose + or −): `story-bars` — مبتدئ the school medical check (the hand stretches the unknown child's height until the sentence is true, then chooses the calc card; « تزيد » with − and « تنقص » with + as traps), متقدم the textbook's six texts and six calc cards (no gauge: the tape judges); module 1's questions answered from the student's own trials; the vocabulary named AFTER it is asked (bricks `predict: false`); the طريقة p. 29 replayed in the same lab posed alone (`levels={false}`); « أستعدّ » measuring the net's review item `1am.m1.r03` with two platform statements; the p. 31 self-assessment items kept for the final test; every tape a tested `ArcTape` figure (`content/tapes.test.js`) |
| **`qisma-iqlidiya-baqi`** | 1AM unit 3, the first lesson generated in a unit whose earlier lessons are still `coming_soon`: `division-jumps` (b given, the hand holds q; flowers then the textbook's 279 ÷ 14 on a line without labelled multiples); the textbook's questions أ–هـ answered from the student's trials; the four names asked on the story before the brick; the column division revealed line by line (`MethodSteps`) as the answer to يونس's claim; the calculator page (the remainder is RECOMPUTED, the screen shows 19,58…); the first LP edge along a net link toward a published earlier lesson (P3 ← `1am_mana-jam-tarh_P1`) |
| **`qawaid-qabiliyat-qisma`** | a lesson of RULES discovered from evidence: `digit-cards` (the textbook's 0..48 table coloured by hand, then the cards of exercise 26 with lamps re-judged on each swap); module 1's questions answered from the student's coloured cells; the rule for 9 (absent from the textbook's معارف) formalised as a declared addition after exercise 23 makes it visible; the rule for 4 as the طريقة p. 42; a practice lab on the leap year (the unit's تحدّ, `duplicatedIn`); a final test cut from ONE self-assessment table (p. 47 item 12), one rule per question; textbook exercises whose numbers belong to another lesson are REASSIGNED in the extraction with a note (ex-25's decimal quotients → `qisma-ashriya-taqrib`) |

3AM unit 4 « الحساب الحرفي » (`lessons/moyen/3am/ansab_al_aadad_wal_hisab/ibarat-harfiya-3/`, 2026-10-20), generated lesson by lesson:

| Lesson | Read it for |
|---|---|
| **`tabsit-hadhf-aqwas`** | a lesson whose idea is a RULE on written expressions, entered through a lab where the hand carries a TERM (`like-terms`, 4AM's `PitchExpansion` / `TurfFactoring` not reused): bundles of wooden pieces sorted into trays by shape — a pile in the wrong tray is refused with both values at x, opposite pieces cancel, the written value and the table's value stay equal when the hand moves x; then the SAME lab as crates `+( )` / `−( )` (`world="brackets"`, `levels={false}`, a wrong exit refused with the expression's value); the book's activities 1–2 posed as applications in أتمرّن; algebraic options built from term data and re-evaluated at 9 values of x in the content test; first lesson whose « أستعدّ » measures two review links toward UNPUBLISHED lessons |

**Textbook misprints are CORRECTED, not only noted (owner decision, 2026-09-30).**
The extraction keeps the book's verbatim `text` and adds a `correction`
`{ decidedBy, decidedOn, text | analysis1, answer?, note }`; `discrepancies`
records the resolution. The lesson displays the corrected version with one
discreet line (« صحّحت المنصّة خطأً مطبعيًا … »), never a long note. Unit 2:
act-2 (L2), ex-27 and now-30 (L5 — now-30 is a reconstructed, complete
exercise), the situation's analysis (synthesis). Unit 5: ex-31 (« x + y = 216 » → 270, synthesis). Unit 6: act-1 (2 % → 20 %, L1–L2), act-6 (copper 6 → 8 cm³, L4), know-4 (« kw/h » → kWh, L4), ex-13 (missing x, L3), ex-17 (question 2 on P و r, L1). Unit 7: act-3 2-أ (« (1 ; 0) » → (0 ; 1), a bidi-reversed couple, L2), act-1 4-ب (« أضيف » → « أضف », L1). Unit 8: ex-20 (median « 6 » impossible → 6,5, synthesis), ex-7 (the spreadsheet screenshot's other series and four formulas in one cell, L3), know-4 (« نفس التكرار 4 » → 5, « بالمتر » → بالسنتيمتر, the median class written as the table's, L2). Unit 9: prep 5 (« ADE » → ADF, L1), know-2 example (MN/AC → MN/BC, L1), method-lengths (« 1/2 = 5/DN » → 2/1, L1). Unit 10: know-2 example (« tan B = AC/BC » → AC/AB, L1), know-4 box (« sin²x + sin²x = 1 » → cos²x + sin²x = 1, L3), know-3 example 2's screen (16,69924453 → 16,69924423, L2), ex-15's third pupil (« رضا », L1), QCM item 5's duplicated option (shown once, L1 and synthesis).

---

## 10. The workflow

1. Read the documents in §1 and the reference lessons in §9.
2. Confirm the textbook extraction and the catalogue entry exist.
3. Design the **pedagogical sequence** before writing any JSX: what the student
   already knows, what they will do, what they should notice, what they will
   name, and what proves they understood. Map it onto the stages. The entry
   point and the order of ideas are YOUR design, not the book's page order
   (§4ter); every module is one track — act, answer about it, name it (§4quater).
4. Decide the manipulation, **at two levels**. Work in this order, and never
   start from a widget:

   ```
   the lesson's الكفاءات (catalogue + textbook)        — the textbook is the reference, not the script (§4ter)
      ↓  candidate entries: the textbook activity, AND at least one platform situation
      ↓  choose the one where the idea becomes NECESSARY for the hand; write why in lesson.config.js
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
10. Verify in the browser: Arabic everywhere, RTL at 768 px (tablet) and 1280 px, the manipulation by
    real gesture, progression through the whole lesson, Classroom Mode.
11. **Update the documentation** if you introduced a reusable pattern — root
    `CLAUDE.md`, Documentation Synchronization Rule.

---

## 11. What you must run

### Cultural and religious respect (owner, 2026-10-26 — applies to every generated lesson, module, exercise, icon, badge)

The platform serves Algerian Muslim students. Never put in student-visible text, a catalogue `icon`, a badge `emoji`, a scene
or a bank sheet: the pig (🐷 🐖 🐗 — a savings box is 💰, never a pig), alcohol or drinks of it (🍷 🍺 🍻 🥂 🍸 🍹), pork (🥓 🌭), gambling
(🎰 🃏 and dice or cards used as a game, casino, lottery, betting), usury/interest on loans as a context, non-Islamic festivals and religious
symbols (🎄 🎅 ⛪ ✝️ 🕍 🔯), dancing or music-hall contexts, or any statement touching them. Prefer neutral everyday Algerian
contexts (market, school, bakery, football, garden, trip). Dice/cards as a neutral PROBABILITY object are tolerated only in the
probability lab tools, never as a game or a bet in a story. Before publishing, grep the new lesson folder, its bank and its
catalogue entry for the emoji and words above; fix, never rationalise.

### Publish a lesson (cycle moyen rollout, owner decisions D6 and 2026-10-14)

A 1AM–3AM lesson is published **as soon as it is generated**, so the owner can review it while the next one is
written. **Owner decision (2026-10-14): « publish » means pushing to `dev`.** CI runs and nothing is deployed. The owner
reviews `dev` and promotes it to `main` (the production deploy) when they choose. The exact sequence, for a
lesson `<code>` of grade `<g>`:

1. **Catalogue flip**, in `packages/core/curriculum/dz/lessons_<g>_2026_2027.json`:
   - `status: "coming_soon"` → `"available"`;
   - final `pointsToLearn` (same order: LP ids are positional), `durationMinutes` (the module total WITHOUT the مسائل — what `validate:lessons` compares it to; the whole lesson, مسائل included, stays ≤ 90; `smarter:validate-curriculum`
     requires it of an `available` lesson), `difficulty`, `icon`;
   - `pointPrerequisites` only along a net link (`LEARNING_NET.md` §4.6).
   The lesson keeps its `code` and `programmeItems`.
2. **Wiring:**
   - `node scripts/generate-lesson-index.mjs` — the lesson enters `lessons/lessonIndex.generated.json`, which mounts
     its routes (nothing to add to `App.jsx` since 2026-10-14; `check:routes` and the index `--check` fail otherwise);
   - if it has practice: its bank in `content/practice/<g>/<code>/`, its `active.json` entry, and `exam-style.json`
     when its sheets are exam-style (`EXERCISE_CONTRACT.md` § « Term-exam provenance »).
     The lesson summary then shows the bank card (« بنك تمارين هذا الدرس » for a teacher, the practice entry for a student,
     `features/practice/PracticeEntryCard.jsx`). The dev server watches `content/practice` since 2026-10-14
     (`vite.config.js › watchPracticeContent`): before that, a server started before the bank existed kept the old
     `active.json` and hid the card until restarted.
3. **Regenerate** the net's map and queue (the lesson drops out of the queue): `npm run generate:learning-net`.
4. **Local DB handshake:**
   ```bash
   node packages/core/curriculum/exportCurriculum.mjs
   (cd apps/api && php artisan smarter:import-curriculum)          # coming_soon → available: draft → published
   node packages/core/curriculum/exportContentRegistry.mjs
   (cd apps/api && php artisan smarter:import-content-registry)    # its modules/exercises are born draft
   ```
   The import turns the lesson's `draft` into `published` by itself (`CurriculumImporter::publicationOnUpdate`).
   Its **modules and exercises** are born `draft` by the importer, but **every generated lesson, module and exercise must END
   `published`, never `draft`** (owner, 2026-10-26): right after the import, publish the lesson's `lesson_modules` and
   `practice_exercises` rows locally (`publication_status = 'published'` for the lesson's non-retired rows), and check that no
   module of a published lesson is left `draft`. In production the deploy's import/prune does the same.
5. **Gates:** `npm test`, `npm run check:lessons`, `npm run build` (§ below). Then a browser check at 768 px and 1280 px, in RTL.
6. **Commit and publish:** commit on a work branch, fast-forward `dev`, `git push origin dev`. CI (`ci.yml`) runs
   tests, build and the PHP suite. **Nothing reaches production until `dev` is merged into `main`**: `deploy.yml` then
   exports, imports (`--from-json`), prunes and checks tiers on the server.


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
KIT_BASE=http://localhost:5173 node apps/web/e2e/lesson-kit/4am-jumal-muadalatayn.mjs     # unit 5: every module at 1280/320 px + the three labs by real gesture + one-screen fit at 4 viewports
KIT_BASE=http://localhost:5173 node apps/web/e2e/lesson-kit/4am-tanasubiya-dala-khattiya.mjs  # unit 6: unit page + every module at 1280/320 px + every lab's glance block in one screen at 4 viewports, both levels
KIT_BASE=http://localhost:5173 node apps/web/e2e/lesson-kit/4am-tanasub-muamil.mjs           # unit 6 L1: ratio-ride by real gesture (drag, keyboard, refusals, ghost column in Arabic digits)
KIT_BASE=http://localhost:5173 node apps/web/e2e/lesson-kit/math-raw-scan.mjs                # every page of every 4AM lesson: no raw `$…$` / `\command` / KaTeX error in visible text (INDEX_ONLY=1: catalogue, units, indexes)
KIT_BASE=http://localhost:5173 node apps/web/e2e/lesson-kit/4am-dala-taalufiya.mjs            # unit 7: unit page + every module at 1280/320 px + the five labs' glance blocks in one screen at 4 viewports, both levels (224 checks)
KIT_BASE=http://localhost:5173 node apps/web/e2e/lesson-kit/4am-ihsa.mjs                       # unit 8: unit page + every module at 1280/320 px + the four labs' glance blocks (stat-balance twice) in one screen at 4 viewports, both levels
KIT_BASE=http://localhost:5173 node apps/web/e2e/lesson-kit/4am-khassiyat-talis.mjs              # unit 9: unit page + every module at 1280/320 px + the five geometry labs' glance blocks in one screen at 4 viewports (the synthesis switches type with the level)
#   LABS_ONLY=1 skips the mounts; MOUNT_ONLY=1 (unit 9) skips the labs; MOUNT_LESSONS=a,b mounts only those lessons (the full run is ~35 min — split it)
KIT_BASE=http://localhost:5173 node apps/web/e2e/lesson-kit/4am-hisab-muthallathat.mjs          # unit 10: unit page + every module at 1280/320 px + the four trigonometry labs (clinometer twice) in one screen at 4 viewports × 2 levels; LAB_MODULES=lesson:N moves a lab's module
KIT_BASE=http://localhost:5173 node apps/web/e2e/lesson-kit/1am-jam-tarh-ashriya.mjs          # 1AM unit 2: unit page + every module at 1280/320 px, story-bars by keyboard and tap-tap, one-screen fit at 4 viewports × 2 levels
KIT_BASE=http://localhost:5173 node apps/web/e2e/lesson-kit/1am-darb-qisma-ashriya.mjs         # 1AM unit 3: every module at 1280/320 px, division-jumps short/over/exact by −/+ at both levels, one-screen fit at 4 viewports
KIT_BASE=http://localhost:5173 node apps/web/e2e/lesson-kit/1am-qawaid-qabiliyat-qisma.mjs   # 1AM unit 3 lesson 3: every module at 1280/320 px, digit-cards (14 coloured, 15 refused with its remainder, 9534 placed and lamp 2 opened), one screen at four viewports × two levels
KIT_BASE=http://localhost:5173 node apps/web/e2e/lesson-kit/3am-quwa-nisbiya.mjs            # 3AM unit 3 lesson quwat-adad-nisbi: every module at 1280/768 px, power-train by keyboard, tap and a tap on the ruler (16, −32, 1, 1/9, couple 7), one screen at five sizes × two levels + couple (123 checks)
KIT_BASE=http://localhost:4173 node apps/web/e2e/lesson-kit/3am-ibarat-harfiya-3.mjs        # 3AM unit 4 lesson tabsit-hadhf-aqwas: every module at 1280/768 px, like-terms by tap-tap, mouse drag and keyboard (collect) + coefficient check (متقدم) + the brackets world (+( ) kept, −( ) refused then flipped), one screen at five sizes × two levels + brackets (GLANCE_ONLY=1 runs only the one-screen part)
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
- *Responsive*: 768 px with no horizontal scroll, touch targets ≥ 44 px for
  controls (tablets are touch), and the tablet and laptop widths. Phones are out of scope.
- *One screen*: every manipulation fits one viewport with its controls (no
  vertical scroll to interact) at 1024×768, 1280×800, 1366×768 (phone sizes retired).
- *Classroom*: entry as a presenter, unit navigation, state surviving
  enter/exit, no page scroll, exit restoring the page.
- *Accessibility*: keyboard path for every gesture, visible focus, readable
  contrast, semantic controls.
- *Regression*: the other lessons of the unit still pass their suites.

---

## 12. Do not do this

Each of these has actually happened in this repository, or is a standing rule.

**Math in text**
- Do not print a content string with `{bidi(x)}` (or raw `{x}`) in JSX when it may carry `$…$`: the student
  reads the dollars. Use `<MathLabel>{x}</MathLabel>`, or `mathToPlain(x)` where only a string fits
  (ARABIC_RTL_CONTRACT « Content text outside a module »). Owner report, 2026-10-02: 122 raw formulas, 7 units.

**Characters**
- Do not draw a person locally (circles, rectangles, a new figure component): use `KidFigure` (§6 « People are the
  platform's CHARACTERS »). Do not draw a girl without the hijab and Islamic dress (owner, 2026-10-14). Do not let a
  character's drawn height disagree with the ruler.

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
- Do not make the student scroll between a figure and the controls that move
  it (MANIPULATION_CONTRACT §8bis — found on unit 5's 32 agents, 2026-10-01).
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
>
> **Amended 2026-10-14 (owner):** two rows added to §14.2 — « Pedagogical design » (the textbook is the reference of
> the الكفاءات, not the script: §4ter) and « Module track » (act first, answer about it, then name it: §4quater). The
> file layout, the components and the gates are unchanged; reference `kitabat-adad-tabii`.

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
  └─ useLessonRoutes() (lessonRouteBoundary.jsx, one entry per lessonIndex.generated.json line)
       ├─ not loaded: <basePath>/* → loads routes.jsx (+ config) and lesson.manipulation.json, then ↓
       └─ loaded:     <lesson>Routes() ─ buildLessonRoutes (_unit/lessonRoutes.jsx)
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
`durationMinutes`, and its **`programmeItems`** — the official items of the
learning net it teaches (`LEARNING_NET.md`; for 1AM–3AM the entry already
exists, `coming_soon`, with its code, items, draft الكفاءات and net-derived
`prerequisiteLessonCodes` since 2026-10-14 — the lesson is generated INTO it,
then published (§11 « Publish a lesson »); `noRebuildForLesson(code)` says what
the lesson must recall rather than rebuild — §4 of that contract); the textbook extraction `docs/sources/<grade>/<unit>/extraction.json`
for every element the lesson cites. Mastery criteria are the server's
(Mastery V2) — a lesson declares none.

**Required output:**

| Part | Contract |
|---|---|
| Files | exactly the layout of §3; `index.jsx`, `routes.jsx`, `moduleContext.js` are the one-line factories |
| `lesson.config.js` | static literals only; `id` = catalogue code; `kind`; `unit`; stages in journey order with the required set per kind (§3); `teachesLearningPointIds` on every learning module covering every LP; `estimatedDurationMin` = Σ `estimatedMin` ≤ 90; `color` a `COLOR_MAP` key; `resources[]` for every workspace manipulation (both levels, same `objective`, `autonomy` on advanced, `experience` with reason and theme) |
| Pedagogical design | §4ter: the textbook fixes the الكفاءات, the platform designs the entry point, the examples and the order; the design (chosen entry, rejected candidates) is written in the `lesson.config.js` header; a textbook activity not chosen as entry is posed as an application |
| Lab onboarding | every manipulation has `LabCoach` (default on): a ring + one-sentence bubble on the control needed now, shown once, hidable — MANIPULATION_CONTRACT §8quater; the lab's pure `coachOf` is tested by following it to the end of every task |
| Module track | §4quater: one track per module — the action at the top (lab with no brief above it, or the first question), then questions on what the student did, then the name (box, brick) |
| Module shape | `ContentModule` for content, `PrerequisiteDiagnostic` for « أستعدّ » (module 0, `priorKnowledge` only, questions as literal objects with `requires` — §4 « The « أستعدّ » pattern »), `BossFinal` for « إختبار أولي » — never a hand-rolled module shell, test UI, fullscreen, toolbar or progress write |
| Steps | `done` on ANSWERED, never on correct (`check:non-blocking`); a step may wait on `onFinished` only per §6; never pass `locked` |
| Questions | kit components only (`TapQuestion`, `BatchChoiceQuestion`, `NumericQuestion`, `TextbookExercise` for the textbook's exercises); explicit `correct`; every distractor FALSE; `requires` on every question; the parsers of §5, never a custom one |
| Manipulation | a type from the closed registry (`MANIPULATION_TYPE_IDS`, 54 types on 2026-10-04), two levels in one `ManipulationWorkspace`, the lesson's world as a `theme` (§6); a new type only by the recipe of MANIPULATION_CONTRACT §7ter |
| Knowledge | `knowledge.jsx` with a plain-text `summary` per item; a brick at the point of teaching; `knowledgeMap: true`; every content module's footer `<KnowledgeSnapshot moduleNumber={N} />`; the final test's `synthese={<KnowledgeSnapshot complete variant="complete" />}`; **and** the progressive map from the start (owner decision, 2026-09-29): a `knowledgeGraph.js` exporting `KNOWLEDGE_GRAPH`, re-exported by `knowledge.jsx`, and `knowledgeMapMode: 'progressive'` — every item carried by a `notebook` node, labelled relationships, guidance only where the lesson's own exercises / questions / « أستعدّ » support it, authored per `KNOWLEDGE_MAP.md` A.10 (rules 1–16) and passing A.14. Enforced: `validate-lessons.mjs` refuses a lesson with a map but no mode / graph / re-export, and `lessonGraphs.test.js` runs the A.14 invariants on every lesson without any per-lesson code |
| Final test | only in the `evaluation` module; every question assessed with ONE primary LP of this lesson; every LP covered; 4–6 questions; timer ≈ 1 min per question + 1; `badges`, `completion`, `skills` as in the reference lessons |
| Textbook | every pedagogical block carries a `source` (`src()` / `addition()`); `check:textbook` maps each extracted element to exactly one destination |
| Figures | every textbook figure ANALYSED, then reproduced if readable or REDESIGNED with the same concept (answers recomputed, one-line caption), and `figureQuality(fig)` empty in `content/figures.test.js` (§5 « Textbook figures ») |
| Practice | a separate bank under `content/practice/**` with provenance, oracle entries for constructed answers (§11) |
| Arabic/RTL | all user-visible text Arabic (including `aria-label`, `title`, placeholders, KaTeX `\text{}` — put words in DOM, not in KaTeX); numbers and equations `dir="ltr"`; `PGCD` Latin |
| Responsive / a11y | no horizontal scroll at 768 px; controls ≥ 44 px; every gesture has a tap and keyboard path; visible focus; reduced motion honoured |
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
| Editorial gates | `npm run check:lessons` (validate:lessons --strict, validate:exercises --strict, audit:knowledge:gate, check:katex, check:lesson-index, check:routes, check:non-blocking, check:dormant-isolation, check:textbook, check:activation-drift, check:learning-net, check:entry-budget) |
| DB handshake | `node packages/core/curriculum/exportCurriculum.mjs && php artisan smarter:import-curriculum`; `node packages/core/curriculum/exportContentRegistry.mjs && php artisan smarter:import-content-registry` |
| Runtime | `node apps/web/e2e/lesson-route-boundary.mjs` (the lazy lesson mount: deep link, classroom shell kept, lab strings, unknown module → `*`, unit page, مذكرة; 2026-10-14), the browser suites of §11 against the dev server (all green on 2026-09-29: 27/27, 183/183, 73/73, 47/47, 9/9) + the new lesson loaded at 320 / 414 / 820 / 1440 px with no console error, no failed request, no horizontal overflow |
| Mathematics | every key recomputed; every distractor false; parsers exercised with Arabic digits |
| Interaction | the manipulation by drag, tap and keyboard; a deliberately wrong run still progresses; reload keeps progress |
| Knowledge Map | the checklist of `KNOWLEDGE_MAP.md` A.14 — core items all carried, relationships labelled, guidance grounded in the lesson (automated: each aid quotes the lesson word for word; relevance reviewed by a human), mistakes with wrong / why / right, the map not overloaded, ① first in « المعارف مفصّلة », every equality inside `$…$` and arithmetically true, mathematics never truncated or mirrored, locked until taught, no evaluation answer in the map; browser QA `node apps/web/e2e/knowledge-map.mjs` |
| Documentation | a new reusable pattern is documented here and in its contract in the same task |

### 14.3bis Modules « مسائل » (2026-10-05, prototype validated 2026-10-06)

A lesson adds three exam-style problem modules (`track: 'problem'`, before the
evaluation), built from data with `GuidedProblem`, never hand-written JSX.
**Everything — owner rules, design method, schema, wiring, validation, pitfalls,
parallel rollout — is in [`MASAIL_GENERATION_GUIDE.md`](./MASAIL_GENERATION_GUIDE.md).**
Reference lesson: `qasim-adad-tabii`. **Since 2026-10-07 every regular 4AM lesson (60) has its
three مسائل** — a new lesson ships with them (MASAIL guide §7–§8; statement support `figure` /
`visual` / `table` / `illustration`, problem 1's support in `lessonProblem`). **Since 2026-10-13 every مسألة has a drawn support** (`illustration` kinds `plan` `stacks` `tags` `tanks` `route` `ladder` `timeline` `scene` + the six sheet drawings — `MASAIL_GENERATION_GUIDE.md` § `illustration`; gate `common/problems/masailIllustrations.test.js`: no support, or a number not in the statement, fails). Synthesis lessons have none.

**« مسألة الدرس » lives in ONE place (owner, 2026-10-14).** `config.lessonProblem` is shown on the lesson's summary page
(`LessonIndex` → `LessonProblemCard`, linked to the module that solves it) and solved step by step in its « مسألة » module
(`GuidedProblem`). It is NEVER re-printed inside another module (not at the end of the نشاط, not as a reminder): gate
`common/problems/lessonProblemPlacement.test.js` fails on any module that renders `LessonProblemCard`.

### 14.3ter « أتوقّع القاعدة » — the student writes the rule before reading it (2026-10-06)

Every new `KnowledgeBrick` of a rule the student can conclude is gated by default
in ALL lessons: the student writes the rule in their own words, then sees it.
When you author a lesson: give each predictable `knowledge.jsx` item a
`predictPrompt` built on what the student has just done; wrap a `TextbookBox`
that introduces a rule (no brick before it) in `<PredictRule id prompt>`; never
place a box stating the rule right before its brick. Full contract:
[`../architecture/KNOWLEDGE_DEPENDENCY.md`](../architecture/KNOWLEDGE_DEPENDENCY.md) § « أتوقّع القاعدة »;
how to write the prompts: [`PREDICT_PROMPT_GUIDE.md`](./PREDICT_PROMPT_GUIDE.md).
**Since 2026-10-07 every gated rule of every lesson has its own prompt (296 / 296) and
`check:lessons` runs `audit-predict-prompts.mjs --strict`: a new lesson without its prompts fails.**

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
  (2026-09-29). Since 2026-10-13 the diagnostic result shows « راجع قبل أن
  تنطلق » from the learning net, but a weak answer does not yet highlight its
  own card (the `priorKnowledge` slugs are not mapped to net items —
  `LEARNING_NET.md` §8).
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
