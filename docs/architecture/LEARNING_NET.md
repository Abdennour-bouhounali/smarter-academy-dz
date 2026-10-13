# The learning net — شبكة الكفاءات of the cycle moyen (1AM–4AM)

**Status:** implemented 2026-10-13. **Authoritative for:** the official programme of the four years as data, the
links between its items, the planned lessons of 1AM–3AM, and cross-year navigation (« راجع قبل أن تنطلق »).
**Readable map (generated):** [`docs/curriculum/LEARNING_NET_MAP.md`](../curriculum/LEARNING_NET_MAP.md). **Interactive map (generated, standalone, open in a browser):** `docs/curriculum/learning-net-map.html` — written by the same script from `scripts/learning-net-map.template.html` (edit the template, never the output); `check:learning-net` checks both files.
**Sources:** `docs/Math-Moyenne-programme/` — the 2016 منهاج (§3 resource matrix, §4 the four annual programmes)
and the four المخطّطات السنوية (September 2022).

## 1. Why it exists

Before the net, the platform knew 4AM only. It had 74 lessons, 219 learning points and 290 LP→LP edges, all of them
inside 4AM. What a 4AM lesson assumes from earlier years was free Arabic text (`prerequisites`, unit
`prerequisitesAr`) or a lesson-local slug (`priorKnowledge`). Nothing could send a student back to an earlier
lesson. Nothing stopped a future 2AM lesson from re-teaching a 1AM notion with no added value, either.

The net solves four problems with one structure:

1. **The official programme is the contract.** Every مورد معرفي of the four years is an item with a stable id,
   worded as in the official documents. Every item has a lesson that teaches it, published or planned. Nothing
   is taught that the programme does not ask for without that being visible.
2. **No duplication.** When the programme comes back to a notion, the link says how: `extends` carries the
   added value, and `consolidates` means recall without rebuilding.
3. **Navigation.** A lesson knows, one step back, which الكفاءات of which earlier lessons it builds on. It also
   knows, one step forward, where its own الكفاءات serve later.
4. **The base for generating 1AM–3AM.** Units, lesson codes and the items each lesson covers already exist
   as planned data. A generated lesson implements them; it never invents a parallel decomposition.

## 2. Three layers, one authority each

| Layer | File | Holds | Edited when |
|---|---|---|---|
| Official programme | `packages/core/curriculum/dz/net/official_programme_moyen.json` | 4 grades × 7 مقاطع (`segments`), **224 items**, verbatim, with the source page | a transcription error is found (never to "improve" wording) |
| The net | `packages/core/curriculum/dz/net/learning_net_moyen.json` | 17 `threads`, **353 `links`** between items, **39 `plannedUnits`** and **196 `plannedLessons`** (157 lessons + 39 syntheses) cut from the 1AM–3AM textbooks | a link is added, corrected or removed; a planned decomposition changes |
| Existing lessons | `packages/core/curriculum/dz/lessons_<grade>_*.json` | each lesson's `programmeItems` (4AM: all 60 non-synthesis lessons) | a lesson is added or re-scoped |

Resolver (pure, tested): `packages/core/curriculum/dz/net/learningNet.js`. **It is not exported from the
`@smarter-academy/core` barrel**, because the barrel is in the entry bundle (`BUNDLE_BOUNDARIES.md`). Import it by
path, from the lesson runtime only:
`import { reviewLinksForLesson } from '@smarter-academy/core/curriculum/dz/net/learningNet.js'`.

### 2.1 Items

```json
{ "id": "3am.m4.r03", "segment": "3am.m4", "grade": "3am", "number": 3,
  "textAr": "معرفة خاصية فيثاغورس واستعمالها.", "origin": "plan-2022", "domain": "geometry" }
```

- **Id:** `<g>am.m<مقطع>.r<nn>`. This is the مقطع number and the مورد number in the annual plan, so the id *is* the
  official reference.
  - Items found in the 2016 منهاج but absent from the 2022 plan are `<g>am.m<n>.x<k>` with
    `origin: "manhaj-2016"`. There are three: `1am.m5.x1` (عشري → كسري), `3am.m4.x1` (the converse of
    Pythagoras) and `3am.m5.x1` (حصر بالتدوير).
- **An id never changes meaning.** A new item is appended at the end of its مقطع. Items are never renumbered.
  Test: « numérote les موارد du plan 1..n sans trou ».
- `partsAr` keeps the official sub-bullets of a composite مورد (e.g. `4am.m5.r03` الدالة الخطية, four parts).
- **Formulas** are marked `$…$` so that `MathText` isolates them LTR. This markup is the only addition to the
  official wording. All 27 formulas are checked to render in KaTeX.
- `domain` is the official ميدان: `numbers`, `data` or `geometry`. A مقطع that mixes ميادين is overridden per item
  (`4am.m5.r01–r02` جمل المعادلتين are `numbers`).
- `verified: false`. The PDFs' text layer is corrupted (ى/ي, س/ز), so the transcription was read from the page
  images. Re-reading it against the PDFs is an open item (§8).

### 2.2 Links

```json
{ "from": "3am.m4.r07", "to": "4am.m2.r02", "type": "extends", "addedValueAr": "الجيب والظل بعد جيب التمام." }
```

| `type` | Meaning | Required field | Used by |
|---|---|---|---|
| `requires` | `to` cannot be built without `from` | — | « راجع قبل أن تنطلق », recommendations |
| `extends` | same notion further up the spiral: `to` **starts from** `from` and teaches only the added value | `addedValueAr` | the no-rebuild rule (§4), review links |
| `consolidates` | the programme repeats `from`: `to` recalls and consolidates it (الإرساء), **never rebuilds it** | `noteAr` | the no-rebuild rule, review links |

Counts on 2026-10-13: 312 `requires`, 31 `extends`, 10 `consolidates`. Links are **direct**: an item lists the
step just below it, never the whole staircase.

Invariants, from `learningNet.test.js`:

- **Endpoints and type.** Both ends exist, no item links to itself, and the type is one of the three.
- **Never backwards in time.** The `from` year is ≤ the `to` year. In the same year, the `from` مقطع is ≤ the `to`
  مقطع. `extends` and `consolidates` point at a strictly earlier item.
- **No cycle**, all types together.
- **One base per item.** An item has at most one `extends`/`consolidates` base; otherwise "what it adds" means
  nothing.
- **Lesson order.** The home lesson (§2.4) of a link's `from` never comes after the home lesson of its `to`.

The lesson-order invariant caught three real conflicts with the 4AM textbook order. Each was fixed in the net,
never by moving a lesson:

1. المتطابقات → النشر was dropped: the textbook expands before it teaches the identities.
2. التمثيل البياني لوضعية now requires reading a *linear* graph, not an affine one.
3. `muadala-ula` became a recall lesson (§2.4).

### 2.3 Threads

Seventeen conceptual strands. Each item belongs to exactly one (tested). The strands are the lanes of the drawn map.

- **Numbers:** `naturals-decimals`, `divisibility`, `fractions-rationals`, `relatives-line-frame`,
  `powers-roots`, `literal-calculus`, `equations`.
- **Data:** `proportionality-functions`, `measures-units`, `statistics`.
- **Geometry:** `plane-figures`, `angles`, `lengths-areas`, `transformations`, `triangles-proof`,
  `trigonometry`, `solids`.

### 2.4 Lessons, published and planned

- **Published lessons** declare `programmeItems` in `lessons_<grade>_*.json`.
  - Every 4AM item has a published 4AM home lesson (tested).
  - Synthesis lessons declare none.
  - A lesson may list several items, and several lessons may share an item: the 4AM textbook splits الدالة الخطية
    over four lessons.
  - **Recall lessons.** A lesson whose textbook content is a recall from an earlier year declares that year's
    item. There is one: `muadala-ula` → `3am.m5.r06`. The list is closed in the test (`RECALL_LESSONS`), so a new
    recall lesson is a decision, not drift.
- **Planned lessons** (`plannedLessons`) — since 2026-10-13 cut from the **official textbooks** (1AM موفم 2017,
  2AM and 3AM منشورات الشهاب 2017; `docs/official-book-pdfs/`), by the 4AM rule: one textbook باب = one unit, its
  numbered « أنشطة » / « أكتشف » rubrics grouped as the book's معارف groups them = its lessons.
  - Fields: `code`, `grade`, `unit`, `order`, `kind`, `titleAr`, `descriptionAr`, **`pointsToLearn`** (DRAFT
    الكفاءات written from the unit's « سأتعلّم في هذا الباب » and the lesson's activity — owner decision: drafted by
    the platform, the owner validates), `prerequisitesAr`, `programmeItems`, `textbookRef {unit, pages}`,
    `decisionStatus: "draft"`.
  - **Planned units** (`plannedUnits`): `code`, `grade`, `number`, `chapterId` (numbers → `ansab_al_aadad_wal_hisab`,
    data → `tanasubiya_duwal`, geometry → `handasa`), `domain`, `titleAr`, `objectivesAr` (verbatim), `challengeAr`,
    `textbook {bookPages, pdfPages, prepPage, exercisesPages, integrationPages}`, `scanIssues`,
    `synthesisLessonCode`. Each unit ends with its « أدمج تعلّماتي » (`wadiya-idmajiya-<unit>`).
  - Source of each decomposition, with the reading decisions and scan defects:
    `docs/sources/<grade>/textbook-map.json` (1AM 14 units / 55 lessons, 2AM 12 / 53, 3AM 13 / 49). The book's
    unit order is NOT the مقاطع order: a same-year prerequisite taught later in the book is a listed « renvoi en
    avant » (§4bis), never a reordering.
  - **Lessons without a programme item** (the book teaches them, the 2022 plan has no item): 3AM unit 8 « البرهان
    في الرياضيات » (3 lessons), 3AM « المتباينة المثلثية », 2AM « إنتاج عبارة حرفية ». They are queued last (§4bis)
    and keep `programmeItems: []`.
- **Codes** are globally unique, published and planned together (tested); a collision is resolved by a grade suffix
  (`-2`, `-3am`).
- **Home lesson** of an item: the first lesson in curriculum order (grade, then `order`) that declares it, synthesis
  excluded. A struggling student is sent there.

## 3. Navigation — what the resolver gives

| Function | Returns | Used by |
|---|---|---|
| `reviewLinksForLesson(code)` | One step back. The items the lesson builds on (`requires` plus its `extends`/`consolidates` bases), minus its own, grouped by home lesson, oldest first: `[{ lesson: {code, grade, titleAr, status}, items: [{id, grade, segment, textAr, via}] }]` | « أستعدّ » result screen (`kit/ReviewLinks.jsx`) |
| `forwardLinksForLesson(code)` | One step forward: where the lesson's items serve later, grouped by home lesson | Planned: lesson end / teacher memo |
| `noRebuildForLesson(code)` | For each item that `extends`/`consolidates` an earlier one: the base, its home lesson and the added value | Lesson generation (§4) |
| `homeLessonOf(itemId)`, `lessonsOf(itemId)`, `linksInto`, `linksFrom`, `itemRank`, `getItem`, `getLesson` | Primitives | — |

**« راجع قبل أن تنطلق » (live since 2026-10-13).** `PrerequisiteDiagnostic`'s result screen renders
`<ReviewLinks lessonId={ctx.lessonId} />` under the advice, both on the page and in the classroom summary. Every
lesson that uses the kit therefore gets the panel with no per-lesson code: all 60 4AM lessons with a « أستعدّ ».

- One card per home lesson. The card shows the year chip (« السنة الثالثة متوسط »), the lesson title and the
  official text of each الكفاءة.
- The title is a **link** when `status === 'available'` and `getLessonPath(code)` resolves. A **planned** lesson
  shows its title with « قريبًا »: the student still learns *what* to revise and from which year. The link lights
  up by itself the day the lesson is published.
- Contract unchanged from the diagnostic: never gates, sends no evidence, shows nothing if the lesson has no review
  links. Strings: `lesson.json › diagnostic.reviewTitle / reviewHint / reviewSoon`.
- Today each 4AM lesson shows 1–5 cards. Example: الجذر التربيعي → قوة عدد نسبي (3AM) and فيثاغورس (3AM).

**Relation to the learning-point graph and Mastery V2.** The net works at the *programme-item* level. The finer
LP→LP graph (`pointPrerequisites`, `{grade}_{lesson}_P{n}`) is unchanged. It still feeds `learning_point_prerequisites`,
`RecommendationService` (`KIND_PREREQUISITE`) and `nextSteps.js`. A lesson's LPs refine its items. Cross-year LP edges
become possible once 1AM–3AM lessons exist; `pointPrerequisites` may then name `2am_<lesson>_P<n>` codes.

## 4. Generating a 1AM–3AM lesson from the net (contract)

These rules complete `LESSON_DEVELOPMENT_GUIDE.md` §14.2 for any year other than 4AM.

1. **Start from the planned lesson.** Take its `code`, `unit`, `titleAr` and `programmeItems` from
   `learning_net_moyen.json › plannedLessons`. Create the lesson in `lessons_<grade>_*.json` **under the same code
   with the same `programmeItems`**, then delete the planned entry. The `learningNet.test.js` code-uniqueness test
   fails while both exist. If the textbook calls for another decomposition, change the planned entries first; the
   invariants then check the new one.
2. **`pointsToLearn` refine the items.** Every item must be taught by at least one LP, and no LP may teach outside
   the lesson's items. Add the programme item's text to the knowledge map's guidance where useful.
3. **Do not rebuild.** For each entry of `noRebuildForLesson(code)`:
   - `extends`: the lesson opens by **recalling** the base (a « تذكّر » node, a link to the base lesson) and builds
     only `addedValueAr`.
   - `consolidates`: the lesson **does not re-teach** the base. It recalls it and goes straight to الإرساء
     (practice and situations in new contexts).
4. **« أستعدّ » diagnoses the review links.** Every item of `reviewLinksForLesson(code)` must be measured by at
   least one diagnostic question. The `priorKnowledge` slugs remain the audit's vocabulary
   (`KNOWLEDGE_DEPENDENCY.md`). The panel under the result is automatic.
5. **`prerequisiteLessonCodes`** = the published home lessons of the review links, plus the earlier lessons of the
   unit the textbook requires.
6. **`pointPrerequisites`** may name LP codes of an earlier year (`1am_<code>_P<n>`), but only along a net link
   between the two lessons' items.
7. Run `npm run generate:learning-net` and commit the regenerated map.

## 4bis. Generation order (owner decision, 2026-10-13)

Lessons are generated **along the net, not grade by grade**. `scripts/learning-net-queue.mjs` writes the queue to
`docs/curriculum/GENERATION_QUEUE.md` (readable) and `docs/curriculum/generation-queue.json` (machine):

1. **Phase A — the 4AM chains.** For each published 4AM lesson in catalogue order, the WHOLE upstream chain of its
   items in earlier years (transitive closure of `requires` / `extends` / `consolidates`) is mapped to home lessons
   and generated oldest first. Then the next 4AM lesson.
2. **Phases B, C, D** — the same from the remaining 3AM lessons (with their own 1AM–2AM chains), then 2AM, then 1AM.
3. **Phase E — isolated lessons** (no item, or items linked to nothing) come last.
4. A **synthesis** enters the queue right after the last lesson of its unit.
5. The queue also lists the **renvois en avant**: same-year prerequisites the textbook teaches later. The lesson that
   suffers one recalls it itself (a « تذكّر » box), without building it.

On 2026-10-13: 196 lessons — A 108, B 35, C 22, D 23, E 8; 18 renvois en avant.

## 5. Editing the net

- **Fix a transcription:** edit the item's `textAr` in `official_programme_moyen.json`. Never change its id.
- **Add a link:** append to `links` in `learning_net_moyen.json`, then run
  `npx vitest run curriculum/dz/net` in `packages/core`. The tests reject backwards links, cycles, a missing
  `addedValueAr`/`noteAr`, a second base, and a lesson-order contradiction.
- **Re-scope a lesson:** edit `programmeItems` (published or planned). The coverage tests require every item to
  keep a home lesson, and every 4AM item a published one.
- **Always regenerate the map and the queue:** `npm run generate:learning-net`. `npm run check:learning-net`, part
  of `check:lessons`, fails while `LEARNING_NET_MAP.md`, `learning-net-map.html`, `GENERATION_QUEUE.md` or
  `generation-queue.json` is stale.

## 6. Validation

| Gate | What it checks |
|---|---|
| `packages/core/curriculum/dz/net/learningNet.test.js` (17 tests) | items (format, uniqueness, official numbering), links (existence, direction, acyclicity, `extends`/`consolidates` fields, one base), threads (partition), lessons (every item homed, 4AM fully covered by published lessons, closed recall list, unique codes, planned units with synthesis, lesson order), resolver behaviour |
| `npm run check:learning-net` (in `check:lessons`) | the generated maps and the generation queue are up to date; the queue also fails if a planned lesson is missing from it |

## 7. Decisions (2026-10-13)

- **Programme grain, not LP grain.** The official موارد are stable and are what the student is examined on. LP
  decompositions belong to lessons and change with textbooks.
- **The 2022 plan's numbering is the id.** The منهاج 2016 adds three items the plan omits; they are kept (`x<k>`)
  so that nothing official is lost.
- **Planned 1AM–3AM lessons are data, not content.** No JSX, no route yet. `activeGrades.js` still publishes only
  4AM. **Owner decisions for the rollout (2026-10-13)** — recorded in
  `docs/reports/MOYEN_ROLLOUT_PHASE1_REPORT_2026-10-13.md`: الكفاءات drafted by the platform from the textbooks; ALL
  learning points of all grades imported into the database, the not-yet-generated lessons shown as **draft cards,
  not clickable**; generation along the net (§4bis); each lesson **published as soon as it is generated**; practice
  from the term-exam corpus `docs/sources/moyen/exams/` (« على منوال اختبار الفصل … », new exercises generated in the
  same pattern when needed); links to earlier years also inside **exercises**, not only in « أستعدّ ».
- **Review links show planned lessons as text, not as hidden.** Telling a 4AM student "revise فيثاغورس, 3AM" is
  useful even before that lesson exists.

## 8. Open items

- **Not verified.** The transcription has not been re-read against the PDFs by a second reader (`verified: false`).
- **1AM–3AM decomposition and الكفاءات are drafts** (`decisionStatus: "draft"`) until the owner validates them.
- **Scans:** 2AM is missing book p.140 and pp.196–198 (unit 12's « أدمج تعلّماتي »); 3AM is missing p.37; details
  in each `textbook-map.json › scanIssues`.
- **Not yet implemented:**
  - `forwardLinksForLesson` is not shown anywhere yet.
  - Programme items are not imported into the API database. Mastery V2 knows LPs only; a `programme_items` table
    and an item code on `learning_points` would let the server recommend across years.
  - The teacher memo (مذكرة) does not list the review links yet.
- **The 4AM `priorKnowledge` slugs are not mapped to net items.** The panel uses the lesson's `programmeItems`, not
  the diagnostic questions, so a weak answer does not yet highlight its own card.
