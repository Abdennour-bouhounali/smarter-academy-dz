# The old version of the three v2 lessons — trace of its readers, what was deleted, what stays (2026-11-18)

**Order (owner, 2026-11-18):** « for each lesson that is updated to the gaming version, delete the old version ».
Lessons: `qasim-adad-tabii`, `qawasim-adad-tabii`, `khawass-qawasim`
(`apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/<id>/`). The rule that came out of it is
`docs/architecture/LESSON_V2.md` §2 « The old version is deleted »; the status script checks it.

« The old version » = the React module pages (`modules/`), the content only they read, the module routes, the mission
player of these lessons (`studentView: 'mission'`, `mission`, `lessonProblem`, their scenes), `?view=classic`.

## 1. Phase 1 — every reader, and what it reads

Legend — **pages**: imports or mounts a module page; **data**: reads the config's module list (ids, numbers, slugs,
titles, stages) or another config field; **DB**: reads rows (`lesson_modules`, items, progress).

| # | Reader | Reads | Decision |
|---|---|---|---|
| 1 | `<lesson>/routes.jsx` → `common/unit/buildLessonRoutes.jsx` (one lazy route per `modules/Module<NN>*.jsx`), through `lessons/lessonRouteBoundary.jsx` + `lessonLoaders.js` | pages + data (`m.path`) | **changed**: `retiredModules: true`; each module path is a `<Navigate to={home} replace />` |
| 2 | `<lesson>/moduleContext.js` (`MODULE_CTX`, `getNavLinks`) | data, for the pages only | **deleted** |
| 3 | `lessons/registry.test.js` (every module of the config has a route) | data | kept + a check that a v2 lesson's module routes redirect home |
| 4 | `scripts/check-routes.mjs` (routes.jsx calls `buildLessonRoutes`, index, globs) | routes.jsx text | unchanged, passes |
| 5 | `LessonIndex.jsx`: the world for the student when `studentView === 'mission'` and `config.mission`; `?view=classic` → `MissionHome`; module cards, `LessonProblemCard`, soft-gate links for the others | data + `mission` + `lessonProblem` | **changed**: the world opens for any student of a lesson whose pack has a world (not `studentView`); `?view=classic` removed; the old home (module cards linking to the now-redirecting addresses) is still what an admin / سفير (free navigation, not a teacher) sees — follow-up 7 |
| 6 | the kit: `LessonWorld.jsx`, `Title.jsx` (`classicHref`, « الدرس بالطريقة العادية »), the no-WebGL fallback | the classic link | **changed**: link removed; the no-WebGL screen offers the way out (`exitTo`) |
| 7 | `components/auth/phoneLessons.js` (`?view=classic` closed on a phone) | the query | **changed**: the classic branch removed (`isPhoneLessonPath(pathname)`) |
| 8 | `lessons/common/mission/*` (`MissionHome`, `MissionLayer`, `MissionCheckpoint`, `MissionScene`, `useMission`, `useModulePlayer`), `kit/ContentModule`, `kit/BossFinal`, `kit/PrerequisiteDiagnostic`, `kit/PredictRule`, `problems/GuidedProblem`, `answers/useSavedAnswer` (read `studentView` / `mission` through `getLoadedLessonConfig`) | `mission` + `studentView`, only on a module page or MissionHome | kept (29 other lessons use them); the three lessons' keys **deleted** from their configs; their scenes `library` (default), `library-wall`, `construction-wall` **deleted** (no other lesson used them); `MissionScene` draws nothing for an unknown name |
| 9 | `pages/unit/UnitMissionView.jsx` (the student's unit page): `config.mission.title`, `config.mission.tools` | `mission` data | degrades by design (optional): the « درسك الآن » card and the lesson window no longer show the old mission's name (« مكتبة 756 كتابًا »…) nor its tool chips (the rule NAMES, which the world forges and names only after) for lessons 1–3. Visible change — follow-up 8 |
| 10 | `pages/unit/unitMissions.js` (icons, short names, keys `after: <lesson>`) | lesson ids | unchanged |
| 11 | Progress: `useProgress(config.id)` + `markModuleCompleted(String(n))` (the world's `onModule`), `packages/core/progress/*` (`moduleLayoutMigrations.js` names these lessons' module numbers), `calculateCompletionPercentage` (modules count) | data (numbers) | **kept**: the `modules` entries stay in the three configs |
| 12 | API: `lesson_modules` rows (`CurriculumSql`, `ContentRegistryImporter`, `CurriculumController` modules list), progress endpoints by module number, `ContentAccess`, `RecommendationService`, `AnalyticsService`, the two remap migrations of 2026-10-05/06, `DemoDataSeeder`, the tests in `apps/api/tests` | DB | **untouched**: the module ids/numbers/slugs/titles exported are identical (8, 8, 9 modules; verified by running `exportContentRegistry.mjs`). No migration, no row deleted |
| 13 | `packages/core/curriculum/exportContentRegistry.mjs` (deploy step): modules from the config (data), resources (data), **final-test items parsed from the evaluation module's JSX** | data + **page files** | modules and resources unchanged; the final-test items of the three deleted « إختبار أولي » disappear from the export (5 + 6 + 5 = 16) — follow-up 1 |
| 14 | Compass « بوصلتي », the year calendar, the parent's link, school reports, the teacher's tracking (`features/classSession/tracking`, `features/teacher/*`), the learning net, the launch kit, « مختبري », the class session, the board, the memo, the exam coach, the practice space | lesson ids, module numbers as data, the pack | unchanged (no reader mounts a module page). The teacher's card (`TeacherLessonPanel`, `LessonToolsBar`) links to no module page |
| 15 | Links that BUILD a module address: `registry.getModulePath`, `utils/nextSteps.js`, `progress/getResumeLesson.js`, `features/progression/buildProgressionTree.js`, `pages/student/Progression.jsx`, `StudentHome.jsx`, `KnowledgeMap.jsx`, `knowledgeMastery.js`, `LessonLearningPointsStatus.jsx`, `features/practice/notebook/noteContext.js`, the teacher's `UnitPage` module chips | data (slug/number) | unchanged: every such address now redirects to the lesson home (the world) — never a 404 |
| 16 | `scripts/validate-lessons.mjs`: `content/problems.js` required for `track: 'problem'` modules; every الكفاءة needs an assessment question in the lesson's code | page files | **changed**: a `retiredModules` lesson needs no `problems.js`; its coverage is read from `world/evidence.js › POINTS` (the server-verified exam answers, LESSON_V2 §1bis) |
| 17 | `scripts/audit-knowledge-dependencies.mjs` (exposure stream over `modules/`) | page files | **changed**: a `retiredModules` lesson is skipped (`[v2 — no module page]`); its three stale reports `docs/reports/knowledge-contracts/4am_<id>.json` deleted |
| 18 | `scripts/check-textbook-coverage.mjs`: the textbook's QCM (`qcm`, p. 16) was destined to `qasim-adad-tabii` module 7 and cited only by the two deleted final tests | page files | **changed data**: `docs/sources/4am/unit1/extraction.json` — destination moved to `bahth-pgcd` module 8 (which cites item 9), a `note` says why — follow-up 3 |
| 19 | `apps/web/scripts/lesson-v2-status.mjs` | config text | **changed**: new part « the old version is deleted »; the ledger's « أستعدّ » row no longer counts v2 lessons, a row counts v2 lessons whose old version is gone |
| 20 | Unit tests reading the pages: `_unit/prepDiagnostic.test.js`, `knowledge/finalSynthesis.test.js`, `progressive/lessonGraphs.test.js` (aids must quote the lesson's text — modules were part of it), `qawasim/world/journey.test.js` (keys = `mission.tools`), the deleted pages' own tests (`content/prep|problems|peerSheet|walls.test.js`) | pages | adapted (see §4); the pages' own tests deleted with them |
| 21 | e2e walks that open the deleted pages | pages | §5 |
| 22 | `apps/web/scripts/capture-methode.mjs` + `pages/Methode.jsx` / `marketing.json` copy (football lab of module 1, « إختبار أولي ») | pages | **not changed** — follow-up 5 |
| 23 | `knowledge.jsx`, `knowledgeGraph.js`, `content/textbook.js`, `content/exercises.js` (+ `content/teams.js` for lesson 1) | — | **kept**: the lesson page's knowledge map (`LessonPageFrame` › `loadKnowledge`), lesson 1–2's world knowledge page (`world/knowledge.js` imports `KNOWLEDGE_GRAPH`), `validate:lessons`' graph check, `progressiveMap.test.js` |
| 24 | `lesson.config.js › resources` (labs `team-builder`, `divisor-explorer-books`, `factor-pairs`, `divisor-properties`, the three مسائل) | data → DB `lesson_resources` | **kept** as data — follow-up 2 |

## 2. Phase 2 — deleted

| What | Files | Lines |
|---|---|---|
| module pages: 8 + 8 + 9 (« أستعدّ », activities, معارف, أوظّف, three مسائل, « إختبار أولي ») | 25 | |
| `moduleContext.js` ×3 | 3 | |
| `content/` only the pages read, with their tests — lesson 1: `peerSheet`, `prep`(+test), `problems`(+test); lesson 2: `books`, `peerSheet`(+test), `prep`(+test), `problems`(+test); lesson 3: `peerSheet`(+test), `prep`(+test), `problems`(+test), `walls`(+test) | 20 | |
| **lesson folders, total** | **48** | **4,359** |
| mission scenes `LibraryScene`, `LibraryWallScene`, `ConstructionWallScene` | 3 | 134 |
| walk `e2e/lesson-kit/masail-pilot.mjs` (the pilot's مسائل modules) | 1 | 151 |
| stale audit reports `docs/reports/knowledge-contracts/4am_<id>.json` ×3 | 3 | 1,145 |
| **total** | **55** | **5,789** |

Also removed (edits): `studentView`, `mission` (45 / 52 / 51 lines with comments) and `lessonProblem` of the three
configs; `?view=classic` (`LessonIndex`, the kit's `classicHref` and its string `KT.hud.classic`, `.di-link--dim`,
`phoneLessons.js`).

**The redirects**: every address of `config.modules[].path` of the three lessons (e.g.
`/courses/moyen/4am/ansab_al_aadad_wal_hisab/qasim-adad-tabii/maarif`) is a route `<Navigate to={basePath} replace />`;
`?view=classic` is ignored (the home is the world).

## 3. What stays, and why

- `lesson.config.js › modules` (data): progress is stored by module numbers, the world marks them (`onModule`), the DB
  rows and every report read them (rows 11–15).
- `resources`, `skills`, `teachingScope`, `priorKnowledge`, `knowledgeMap*`, `textbookRef`: exported or validated data.
- `index.jsx` (the home: `LessonIndex`), `routes.jsx`, the knowledge map files (row 23), `world/`, `board/`,
  `lesson.pack.js`, the practice banks `content/practice/4am/<id>/`, the class tests `content/class-tests/4am/<id>.json`.
- The mission player and the module system as a whole: 29 lessons are still on the mission player only, 108 on the
  older lesson page (ledger of `status:lesson-v2`). No shared helper was moved: nothing another lesson imports was
  deleted (`check:unreached`, `check:unused` pass).

## 4. Tests changed

- `lessons/registry.test.js`: a lesson with a world → each module route redirects to its home.
- `_unit/prepDiagnostic.test.js`: a v2 lesson keeps module 0 as data but has no « أستعدّ » page; the item checks run on
  the six lessons that still have it; a test names the three v2 lessons.
- `knowledge/finalSynthesis.test.js`: 74 → 71 evaluation modules (unit 1: 9 → 6).
- `progressive/lessonGraphs.test.js`: a lesson's text now includes `world/*.js` and `board/*.js`; one aid of lesson 1's
  map (`khata-amil`) quoted the deleted module 2 — listed in `KNOWN_UNGROUNDED` (content debt, follow-up 6).
- `qawasim-adad-tabii/world/journey.test.js`: keys compared with the exam coach's sheets (`LESSON_PACK.coach`) instead
  of the deleted `mission.tools`.
- `components/auth/phoneLessons.test.js`: the `?view=classic` checks removed.

## 5. Walks (NONE was run — the orchestrator runs them)

Changed: `e2e/gameworld-divisor-isles.mjs` — the `?view=classic` block now checks that `/maarif` redirects to the home
and shows the world, and that `?view=classic` shows the world without the mission behind it. Deleted:
`e2e/lesson-kit/masail-pilot.mjs`.

**Still opening deleted pages — they will fail or test nothing until re-targeted to a lesson on the module system
(follow-up 4):** `lesson-kit/classroom.mjs` (qasim, « وضع القسم » through its modules), `lesson-kit/manipulations.mjs`
(qasim `/al-maktaba` `/maarif`, qawasim `/al-adad-60`, khawass `/thalath-halat`), `lesson-kit/lab-coach.mjs` (same three
labs), `lesson-kit/predict-rule.mjs` (qasim modules 1–2), `lesson-kit/test-presentation.mjs` (qasim `/astaidd`, `/itqan`),
`lesson-kit/4am-aadad-tabiiya-natiqa.mjs` (qasim `/al-maktaba`), `teacher-learning.mjs` (qawasim `/awazzif`, `/itqan`,
`/tariqa-105`, `/al-adad-60`), `page-tours.mjs` (qasim `/maarif`, `/astaidd`), `lesson-route-boundary.mjs` (clicks
`/al-maktaba` from the unit page, counts 8 module chips of qasim — the chips still exist, the click now lands on the
world), and `apps/web/scripts/capture-methode.mjs` (row 22).

## 6. Follow-ups NOT done (each needs a decision or more than a mechanical change)

1. **Final-test items retired at the next deploy.** `exportContentRegistry.mjs` reads the « إختبار أولي » questions from
   the JSX; with the pages gone, the import of the next deploy marks 16 assessment items `retired_at` (5 + 6 + 5; never
   deleted, past evidence kept) and purges the per-الكفاءة item counts that bound the mastery engine's minimum-evidence
   rule. The practice items of the three lessons stay (172 / 134 / 155). To confirm before `main`: that the engine reads
   these lessons' mastery correctly with the practice items and the game evidence only.
2. **Four manipulation types are now mounted by no page**: `team-builder`, `divisor-explorer-books`, `factor-pairs`,
   `divisor-properties` (named only in the three configs' `resources`, i.e. DB `lesson_resources`). They stay in the
   closed registry (`manipulationRegistry.js` + `packages/core/curriculum/manipulationTypes.js`), with their strings,
   tests and walks. Deleting them is one change across the registry, core, i18n, tests, the walks and the configs'
   `resources` (retired at deploy) — or « مختبري » takes them as instruments. Owner's call.
3. **The textbook QCM (p. 16)**: its items 1–7 are no longer used by any lesson (destination moved to `bahth-pgcd`, which
   cites item 9). Owner: keep as is, or declare items 1–7 `notIntegrated` with a reason.
4. **Nine older walks** (and `capture-methode.mjs`) open the deleted pages (§5): re-target each to a lesson still on the module system (same shape:
   `qasim-mushtarak-akbar`) or cut their cases. They test shared old systems (« وضع القسم », BossFinal presentation,
   PredictRule, lab coach, page tours) that 29 + 108 lessons still use.
5. **`/methode`**: its captures, `capture-methode.mjs` and the copy (`marketing.json › method.steps.*.story`) describe the
   deleted module pages of lesson 1 (plan C2: re-capture on the world). The root `CLAUDE.md` says so since this change.
6. **Content debt in lesson 1's knowledge map**: the aid `khata-amil` (« قاسم واحد فقط؟ ») quoted module 2; reword it
   on the world's or the board's text, then remove it from `KNOWN_UNGROUNDED`.
7. **The admin / سفير view of a v2 lesson home** is still the old `LessonIndex` page (module cards, « مسار المحاور »);
   its links land back on the same page. Decide what a reviewer sees (the teacher's card? the world in preview?).
8. **The student's unit page** lost, for lessons 1–3, the old mission's name and its tool chips (row 9). If the owner
   wants something there, it is the world's (its title, its keys after they are forged) — a new field, not the old one.
9. **Lesson 3's proof key (P4)**: `world/evidence.js` maps `burhan → P4`, so `validate:lessons` counts P4 as covered,
   but the gate report says the proof key sends no claim (a proof with letters cannot be re-checked from numbers). P4
   of `khawass-qawasim` has, in fact, no exam evidence since « إختبار أولي » is gone. Owner's call (open item of
   `LESSON_3_GATE_REPORT.md`).

## 7. Checks run (one at a time)

`npm run lint` ✅ · `npm run check:unused` ✅ (baseline 549, nothing added) · `npm run check:unreached` ✅ (4,926
files) · `npm run check:format` ✅ · `npm run check:lessons` ✅ (entry 197.8 KB gzip) ·
`node apps/web/scripts/lesson-v2-status.mjs --lesson <id>` ✅ for the three · `cd apps/web && npx vitest run` ✅ (1,023 files,
18,109 tests; its first run found the 9 failures of §4, all old-version assertions). NOT run: any walk, the API tests (apps/api was not touched), a build.

## 8. Second batch (same day) — the division road: `qisma-iqlidiya-baqi`, `qawaid-qabiliyat-qisma`, `qisma-iqlidiya-hasr`

Lessons: 1AM `qisma-iqlidiya-baqi` and `qawaid-qabiliyat-qisma`
(`apps/web/src/lessons/moyen/1am/ansab_al_aadad_wal_hisab/darb-qisma-ashriya/<id>/`) and 2AM `qisma-iqlidiya-hasr`
(`…/moyen/2am/ansab_al_aadad_wal_hisab/kusur-amaliyat/qisma-iqlidiya-hasr/`). Same job, same shape as §1–§7. Their
`world/`, `board/` and `lesson.pack.js` (the new version) are untouched. These three lessons were on the OLDER lesson
page (no `studentView: 'mission'`, no `mission`): there was no mission player and no mission scene to delete.

### 8.1 Phase 1 — the readers

Rows 1, 3–5, 10–12, 14–15 and 17 of §1 hold for these three lessons unchanged (the machinery is shared and already knows
`retiredModules`). What is specific to them:

| # | Reader | Reads | Decision |
|---|---|---|---|
| a | `<lesson>/routes.jsx` (`import.meta.glob('./modules/Module*.jsx')`) | pages | **changed**: `retiredModules: true`; each of the 9 / 10 / 9 module addresses redirects to the home |
| b | `<lesson>/moduleContext.js` | data, for the pages only | **deleted** |
| c | 1AM `darb-qisma-ashriya/_unit/prepDiagnostic.jsx` + `_unit/moduleContext.js` (the unit has no other lesson) | pages | **deleted** (nothing else imports them); the unit labels of `_unit/unitMeta.js` they alone read (`UNIT_ID`, titles, `BASE`, ids, labels) removed — `src`, `addition`, `PRINT_SUBJECT` stay (content and routes read them). The 2AM unit's helpers stay (five lessons of `kusur-amaliyat` still use them) |
| d | `lesson.config.js › lessonProblem` (`LessonIndex` › `LessonProblemCard`, `validate:lessons`' check against `problems.js`) | data | **deleted** from the three configs (as §2) |
| e | `content/problems.js` (the three مسائل pages) + `problems.test.js` | pages | **deleted** |
| f | `content/textbook.js`, `content/exercises.js` (+ `content.test.js`) | knowledge map (`knowledge.jsx`, `knowledgeGraph.js`), the textbook-coverage citations | **kept** (as row 23). `qawaid`'s `content.test.js` lost its block that parsed the deleted `Module09Itqan.jsx`; `SELF_12` (`exercises.js`, read only by the deleted test page) stays as a textbook citation |
| g | `packages/core/curriculum/exportContentRegistry.mjs` (deploy) | data + page files | modules and resources **identical** (9 / 10 / 9 modules, 6 / 5 / 5 resources — verified by running the export before and after); **the final-test items of the three deleted « إختبار أولي » disappear: 5 + 5 + 5 = 15** (`final_test:<id>:final:E1…E5`). Practice items stay: 199 / 204 / 207 — follow-up 10 |
| h | API `lesson_modules`, `lesson_resources`, progress by module number | DB | **untouched** (row 12) |
| i | Other lessons that name these: `ikhtizal-kitaba-kasriya` (`priorKnowledge`, `requires: ['qawaid-qabiliyat-qisma']`), `wadiya-idmajiya-kusur-amaliyat` (`requires: ['qisma-iqlidiya-hasr-2am']`, its « أستعدّ » « راجع »), `kasr-hasil-qisma` (« تذكّر » `lesson: 'qisma-iqlidiya-hasr'`), `awwaliyan-fima-baynahuma` (« راجع » to `qawaid`), `qasim-adad-tabii` (net comments) | lesson ids | unchanged: they name the LESSON (its home, the world), never a module page |
| j | `scripts/check-textbook-coverage.mjs` | page files | passes with no destination moved: every element the deleted pages cited is still cited by `textbook.js` / `exercises.js` / `resources`. Only the declared platform additions fall (unit `darb-qisma-ashriya` 9 → 4, `kusur-amaliyat` 51 → 48: those of the deleted `problems.js`) |
| k | `scripts/audit-knowledge-dependencies.mjs` | page files | skips the three (`[v2 — no module page]`); their stale reports `docs/reports/knowledge-contracts/{1am_qisma-iqlidiya-baqi,1am_qawaid-qabiliyat-qisma,2am_qisma-iqlidiya-hasr}.json` **deleted** |
| l | `scripts/validate-lessons.mjs` | page files | coverage from `world/evidence.js › POINTS`: 3/3, 4/4, 3/3 الكفاءات covered |
| m | the three labs `division-jumps`, `digit-cards`, `egg-trays` (`manipulations/operations/`) | named only in the three configs' `resources` | **kept** in the closed registry with their tests — now mounted by NO page (same case as follow-up 2) — follow-up 11 |
| n | unit tests: `1am …/_unit/prepDiagnostic.test.js`, `2am …/_unit/prepDiagnostic.test.js` | pages | adapted (§8.3) |
| o | e2e walks | pages | §8.4 |

### 8.2 Phase 2 — deleted

| What | Files | Lines |
|---|---|---|
| module pages 9 + 10 + 9 (« أستعدّ », نشاط, معارف, …, three مسائل, « إختبار أولي ») | 28 | 1,696 |
| `moduleContext.js` ×3 | 3 | 12 |
| `content/problems.js` + `problems.test.js` ×3 | 6 | 883 |
| **lesson folders, total** | **37** | **2,591** |
| 1AM unit `_unit/prepDiagnostic.jsx`, `_unit/moduleContext.js` | 2 | 7 |
| stale audit reports `docs/reports/knowledge-contracts/*.json` ×3 | 3 | 1,301 |
| **total** | **42** | **3,899** |

Also removed (edits): `lessonProblem` (with its comment) of the three configs, replaced by the v2 note; the 1AM unit's
unused labels in `_unit/unitMeta.js`; the « إختبار أولي » block of `qawaid-qabiliyat-qisma/content/content.test.js`.
**Redirects**: every `config.modules[].path` of the three (e.g.
`/courses/moyen/2am/ansab_al_aadad_wal_hisab/qisma-iqlidiya-hasr/nashat`) → `<Navigate to={basePath} replace />`.
What stays is §3's list (config `modules`/`resources`/الكفاءات as data, `index.jsx`, the knowledge map files, the
practice banks, the class tests, DB rows).

### 8.3 Tests changed

- `1am …/darb-qisma-ashriya/_unit/prepDiagnostic.test.js`: both lessons are v2 → module 0 checked as data, no page; the
  item checks (they read the deleted pages) are gone; a test names the two v2 lessons; the unit id is a literal.
- `2am …/kusur-amaliyat/_unit/prepDiagnostic.test.js`: the 4AM pattern (`isV2`, item checks on the lessons still on pages,
  a test naming `qisma-iqlidiya-hasr`).
- `qawaid-qabiliyat-qisma/content/content.test.js`: the block reading `Module09Itqan.jsx` removed.
- Unchanged and passing: `registry.test.js` (its v2 redirect check is generic), `finalSynthesis.test.js` (4AM only: 71),
  `lessonGraphs.test.js` (no aid of the three maps quoted a deleted page: `KNOWN_UNGROUNDED` unchanged).

### 8.4 Walks (NONE was run)

None deleted, none re-targeted. **Opening the deleted pages** (follow-up 4 extends to them):
`lesson-kit/1am-darb-qisma-ashriya.mjs` (every module of `qisma-iqlidiya-baqi`, the `division-jumps` lab on `/nashat`),
`lesson-kit/1am-qawaid-qabiliyat-qisma.mjs` (every module, `digit-cards` on `/nashat`),
`lesson-kit/2am-kusur-amaliyat.mjs` (every module of `qisma-iqlidiya-hasr`, `egg-trays` on `/nashat`) — these three were
also the browser suites of the three labs (`MANIPULATION_CONTRACT.md` §2septdecies, §2octodecies, §2unvicies) — and
`lesson-kit/moyen-retrofit-phase1.mjs` (`/nashat`, `/maarif` of the three, among other lessons). Unaffected: the
lessons' own world / board walks, `launch-kit.mjs`, `lesson-lab.mjs`, `class-session.mjs` (home and lab links only).

### 8.5 Follow-ups NOT done

10. **15 final-test items retired at the next deploy** (5 per lesson), as follow-up 1: confirm before `main` that the
    mastery engine reads these lessons with the practice items and the game evidence only.
11. **Three more labs mounted by no page**: `division-jumps`, `digit-cards`, `egg-trays` (and their figures
    `FlowerFigure`, `HopperFigure`, `BulbFigure`, `EggFigure`) — keep, delete, or move to « مختبري »: owner's call, with
    follow-up 2.
12. **The admin / سفير view and the unit pages** of 1AM `darb-qisma-ashriya` and 2AM `kusur-amaliyat`: as follow-up 7, a
    reviewer still sees the old `LessonIndex` (module cards whose links land back on the home).

### 8.6 Checks run (one at a time)

`npm run lint`: 1 error, NOT from this change — `scripts/lesson-brief.mjs:67` (`countJson` unused; an untracked file of
another agent) — **fixed since** (2026-11-19: `countJson` is no longer in `scripts/lesson-brief.mjs`). `npm run check:unused`: nothing of this change; 6 `lesson` exports of `world/index.js` « imported by a test
only » in the six lessons other agents are writing (`ikhtizal-kitaba-kasriya`, `awwaliyan-fima-baynahuma`, `bahth-pgcd`,
`ikhtizal-kasr`, `qasim-mushtarak-akbar`, `tayin-pgcd` — their packs are not written yet); the PHP half ✅.
`npm run check:unreached`: 61 files, all in those six lessons' `world/` (same cause), none of this change.
`npm run check:format` ✅ · `npm run check:lessons` ✅ (entry 197.8 KB gzip) · `lesson-v2-status --lesson` ✅ for the
three (phone ➖ paused) · ledger: 6 v2, all 6 with their old version deleted; 29 mission; 105 older page; 134 « أستعدّ »;
134 without a board. `cd apps/web && npx vitest run` ✅ (1,083 files, 18,550 tests). NOT run: any walk, the API tests (apps/api was not touched), a build.

### 8.7 Residue of the old versions in the six lessons' root files (review fixes, 2026-11-19, NOT committed)

- **Deleted**: `content/exercises.js` of `qisma-iqlidiya-baqi`, `qawaid-qabiliyat-qisma`, `qisma-iqlidiya-hasr` (row f
  above). Their only readers were their own `content.test.js` (the exercise blocks removed), the derived memo's glob (not
  shown for a lesson with a board memo) and `check-textbook-coverage.mjs` — every element they cited (`ex-15…21`,
  `self-7/8`, `ex-22…32`, `now-42`, `deep-8`, `self-12`, `ex-33`) is still cited by the lesson's practice bank or config:
  the coverage check passes unchanged. The 4AM three keep theirs (their `knowledgeGraph.js` imports them).
- **Scrubbed** in the six `lesson.config.js`: `textbookRef` (read by nothing — the API's comes from the catalogue), the
  headers and comments that described deleted modules and the textbook's pages, module `desc` and resource titles that
  named the book (« تمارين الكتاب 22 », « تمرين الكتاب 33 », « مثال الكتاب », « أعداد الكتاب », « من الكتاب », « طريقة الكتاب »),
  the hasr description and emoji (eggs → planks). KEPT: module ids, numbers, slugs, TITLES and stages, `skills`,
  `resources` codes / `sourceElementIds` / `experience` (the coverage check and the validators read them).
- **Scrubbed** in the six root `knowledge.jsx`: every `predictPrompt` (17; read only by `KnowledgeBrick` / `PredictRule` of
  the deleted module pages — they named « الورشة », « المختبر », « الملعب », « الكتاب ») and the French `\text{vraie}` of
  `khawass-qawasim` (now `P \Rightarrow Q`); the card « أمثلة الكتاب » of `qawaid-qabiliyat-qisma/knowledgeGraph.js` → « مثالان ».
- **Open (owner / orchestrator):** the root `knowledge.jsx` + `knowledgeGraph.js` stay — they are still visible: the
  pack's knowledge of `qasim-adad-tabii` and `qawasim-adad-tabii` (board cards, exam coach), and for all six the 🧠 map
  of the lesson home (`routes.jsx › loadKnowledge` → `LazyLessonKnowledgeProvider`). The other four packs read
  `world/knowledge.js`, so those lessons show TWO knowledge sources (the world's map and the home's 🧠 map). These maps are
  built from `content/textbook.js` (the textbook's own activities and numbers, e.g. « 2145 بيضة في صفائح من 30 » in hasr):
  deleting them means re-pointing `loadKnowledge` and the two packs, and updating `progressiveMap.test.js`,
  `lessonGraphs.test.js`, `buildLessonMemo.test.js` and the four 4AM batch-2 graphs that import the pilot's graph. Module
  TITLES that still carry the book or the old context (« مسائل الكتاب والآلة الحاسبة », « نشاط 1 — بيض المزرعة », …) were
  kept as instructed.

## 9. A v2 lesson could never be completed — fixed (2026-11-19)

**Found by an independent review.** Rows 11 and 14 above were wrong: the world calls `onModule` for only 4 of a lesson's
8–9 modules (the pilot marks 1–4 of 0–7; `khawass-qawasim` 1, 2, 3, 5 of 0–8; `qisma-iqlidiya-baqi` 1, 2, 4, 5 of 0–8),
and `progressQueue.js › snapshotLessonProgress` sends `completed` only at 100 % of `config.modules`. The other modules
have no page any more, so every v2 lesson stayed `in_progress` forever for the parent, the teacher, the school's reports
and the unit page (« next lesson », the tiles).

**Fix (one mechanism in the kit, no lesson's `story.js` touched):** `gameworld/kit/storyEnd.js` + `LessonWorld.jsx` —
the first time a world save says `finished` (the end of the story), every module of the config is marked through the
same `onModule`; a save already finished repairs the progress when the world opens; nothing from a teacher's preview.
Mastery unchanged (evidence only). Rule: `LESSON_V2.md` §1ter. Test: `kit/storyEnd.test.js` (5 tests).

**Still imperfect (not changed — screens not redesigned):**
- `currentModule` is never written by a world (no `markModuleVisited`): the teacher's tracking gets `null`, and the
  resume link of `getLessonProgress` / `getResumeLesson` defaults to module 1 — an address that redirects to the world;
  `lastActivityAt` of a v2 snapshot is the time of the snapshot (no `lastVisitedAt`).
- A repaired student's `completed_at` is the day of the repair, not the day he finished the story.
- The parent's « التقدّم بالتفصيل » shows `modulesCompleted/modulesTotal` (counts only — no retired module titles) and a
  `finalTest` line that a v2 lesson never fills; the teacher's unit page still shows module chips of the retired pages
  (row 15); `StudentDossier` writes « N module(s) terminé(s) » — module counts that mean nothing to a v2 lesson's reader.
- Between two pieces of the story, partial progress stays « 4 of 8 » at most (the modules the story marks).

## 10. One knowledge source, neutral module titles, no dead module link (2026-11-19, NOT committed)

The open items of §8.7 and §9 (« two knowledge sources », module titles, module chips and the resume link).

**1. One knowledge source per v2 lesson.** Readers traced: the home's 🧠 map (`routes.jsx › loadKnowledge` →
`lessonRuntime.jsx › LessonPageFrame` → `LazyLessonKnowledgeProvider` → `KnowledgeMapTrigger`), the pack (`knowledge`:
board cards `features/classSession/knowledgeCards.js`, the exam coach), the world (`world/index.js › knowledge`), the
derived memo glob (`features/teacher/lessonMemo/loadLessonMemoSources.js` — not shown for a lesson with a board memo),
`validate-lessons.mjs` (graph check), `check-textbook-coverage.mjs` (citations), `audit-predict-prompts.mjs` /
`audit-knowledge-dependencies.mjs` / `lab-rollout-status.mjs` (skip a missing file), and the tests (`lessonGraphs`,
`memoContent`, `buildLessonMemo`, the units' `prepDiagnostic`, `wadiya-idmajiya-aadad/content/mission.test.js`, the
lessons' `content.test.js`). No shared component reads the knowledge context on a v2 home (the world never did).
- The 🧠 map of the lesson page could NOT render the world's knowledge as is (same `{ modules }` sheets, but its graph is
  laid out by the world at its own `positions`, its `requires` are keys, and it fails the page map's layout invariants),
  so no converter was written: **a v2 home mounts no 🧠 map** — the six `routes.jsx` pass no `loadKnowledge`,
  `buildLessonRoutes` refuses one with `retiredModules`, `LessonPageFrame` skips the provider without it. The lesson's
  knowledge is the world's « خريطة المعارف », the board's cards and the coach — all through the pack.
- **Deleted** (`qisma-iqlidiya-baqi`, `qawaid-qabiliyat-qisma`, `qisma-iqlidiya-hasr`, `khawass-qawasim`): the root
  `knowledge.jsx`, `knowledgeGraph.js`, `content/textbook.js`, `content/exercises.js` (khawass), `content/content.test.js`
  (1AM/2AM) — 13 files + 3 tests, 1,471 lines. The one textbook element only they cited, `now-11-2` (khawass, module 4),
  is now declared on that module (`sourceElementIds`): `check:textbook` ✅ (declared platform additions fall: unit
  `darb-qisma-ashriya` 4 → 0, `kusur-amaliyat` 48 → 41).
- `validate-lessons.mjs`: a v2 lesson with `knowledgeMap: true` needs the file its pack names to export `KNOWLEDGE_GRAPH`
  (no root `knowledgeGraph.js`). `lessonGraphs.test.js`: those four are checked for a map in `world/knowledge.js`; the page
  map's invariants stay for the others. `knowledgeMapOpen` (read only by the provider) removed from the three 4AM configs.
- **The two pilots** keep root `knowledge.jsx` + `knowledgeGraph.js` + `content/` (their pack and `world/knowledge.js`
  read them). Their cards are BUILT FROM THE TEXTBOOK (`content/textbook.js`, `content/exercises.js`) — listed for the
  owner, NOT rewritten (pedagogy); no plain textbook reference (« الكتاب », a page) is visible in them, so nothing was removed:
  - `qasim-adad-tabii` — sheets' `body` (now rendered by nothing) = « معارف 1 » p. 10 verbatim (two definitions with
    « 11 قاسم للعدد 143 », « 120 = 6 × 20 », the four sentences, 1 / the number itself); memos `siyagh-mutakafia`
    (6 ∣ 120) and `wahid-wa-nafsuh` (1 ∣ 143) use the book's numbers; map cards `baqi`, `jidaa`, `siyagh`, `wahid`,
    `intabih` (definitions/remarks verbatim), `ex120`, `ex143`, `khata-amil` (the book's examples), `tadhakkar` (ex-1's
    method + « أستعدّ » p. 7 items 2–3: 137 = 5 × 25 + 12, 72 = 24 × 3), `khata-ittijah` (ex-5 « 8 يقسم 4 »).
  - `qawasim-adad-tabii` — sheet `tariqa-qawasim` body = « طرائق » p. 11 rule verbatim; map cards `qawasim` (نشاط 2 p. 8:
    60, 48, 17), `ex60`, `tariqa`, `ex105` and `khata-nisf` (the method's worked 105), `qawaid` (its rule line),
    `khata-nisyan` (ex-3: 84), `khata-9` (ex-6).

**2. Module titles** (six configs): each module names what it stands for in the v2 lesson — the key or the stage the
world marks (`onModule`), « مسألة الدرس » for the last bridge, « مسألة 2 / 3 », « التقويم » for the evaluation; module 0
stays « أستعدّ » (the units' tests ask it). No « نشاط N », « معارف — », « أوظّف تعلّماتي », « مسائل الكتاب », no deleted
context (eggs, flowers, library, teams…). `desc` rewritten the same way. Ids, numbers, slugs, stages, `skills`,
`sourceElementIds` unchanged. Readers: the DB `lesson_modules.title` at the next deploy (the notebook's `moduleTitle`, the
admin reports), the old `LessonIndex` an admin / سفير still sees; the parent sees counts only.

**3. Module chips and resume** (driven by `lessonPackFlags(id).world`, never a list): `LessonModuleChips` shows NONE for a
lesson with a world (the chips had no link already; showing a lesson's محاور the teacher cannot open was the defect).
`getResumeLesson.js › getResumeModulePath` gives no module address for such a lesson, so « واصل » (`resumePath`) and the
progression tree's « continue » (`StudentHome`, `Progression` pass it as `getModulePath`) open the lesson's home.
Tests: `components/teacher/lessonModuleChips.render.test.jsx`, `resumePath.test.js` (+9), `registry.test.js` (a v2 home
carries no `loadKnowledge`).

**4. Still visible, still old (not removed — owner's call or other scope):**
- `resources` titles of the six configs name the deleted labs' textbook numbers and contexts (e.g. hasr « 2145 بيضة في
  صفائح من 30 », baqi « 279 زهرة في باقات من 14 », « 253 لؤلؤة », qawasim « قواسم العدد 60 »), and the « مسألة » resource
  titles their old problems; the UNIT PAGE lists the manipulations to students and teachers (`data-unit-resource`). They
  go with follow-ups 2 / 11 (the labs no page mounts).
- The two pilots' textbook-built cards (above).
- `bahth-pgcd` (old module 0, `priorKnowledge`) names `khassiya-1` / `khassiya-2`, item ids of the deleted khawass
  `knowledge.jsx` — concept strings, no check failed; that lesson is being rebuilt.
- Stale comments in `world/knowledge.js` of baqi / hasr / khawass (« the older knowledge.jsx … left untouched ») — world
  folders are other agents' scope.
- Walks NOT updated (e2e is other scope): `e2e/lesson-route-boundary.mjs:127` expects 8 module chips for
  `qasim-adad-tabii` (now 0); `e2e/teacher-memo.mjs` is on `qasim-mushtarak-akbar` (no pack: unchanged) until that lesson
  gets a world; `e2e/knowledge-map.mjs` opens the 🧠 map of the lesson page for `qasim-adad-tabii`, `qawasim-adad-tabii`,
  `khawass-qawasim` (its `ALL` list) — those three must leave it (their map is the world's).

## 11. Lesson 4 — `qasim-mushtarak-akbar` (2026-11-19, NOT committed)

Lesson: 4AM `qasim-mushtarak-akbar` (`…/aadad-tabiiya-natiqa/qasim-mushtarak-akbar/`), the first of the unit's batch 2.
Same job and shape as §8, with §10's rules applied at once (one knowledge source, neutral module titles). Its new version
— `world/` (another agent was still writing `world/forges.js` and `world/inquiries.js`), `board/` — was not touched; its
pack `lesson.pack.js` was written in this change (world `divisor-isles`, `knowledge` = `world/knowledge.js ›
LESSON_KNOWLEDGE`, `coach` P1 `qawasim-mushtaraka` · P2 `al-akbar` · P3 `baqat-mutamathila` · P4 `qawasim-al-pgcd`, as
`world/evidence.js › POINTS`, `board` script and memo, `phone: false`). This lesson was on the MISSION PLAYER (like
lessons 1–3, unlike §8's three).

### 11.1 Phase 1 — the readers

Rows 1, 3–5, 10–12, 14–15 and 17 of §1 hold unchanged. What is specific to this lesson:

| # | Reader | Reads | Decision |
|---|---|---|---|
| a | `routes.jsx` (`import.meta.glob('./modules/Module*.jsx')`, `loadKnowledge: () => import('./knowledge')`) | pages + the 🧠 map | **changed** as the reference (`retiredModules: true`, no `loadKnowledge`): the 8 module addresses redirect home |
| b | `moduleContext.js` | data, for the pages only | **deleted** |
| c | `lesson.config.js › studentView`, `mission` (scene `flower-shop`, tools, three checkpoints), `lessonProblem`, `knowledgeMapOpen`, `textbookRef` | the mission player, `LessonProblemCard`, the old 🧠 provider; `textbookRef` read by nothing | **deleted**; the header and comments that described the textbook's activity and pages rewritten (§8.7) |
| d | `lessons/common/mission/MissionScene.jsx` › `'flower-shop'` → `FlowerShopScene.jsx` | `mission.scene` of this config only | **deleted** (no other lesson names it) |
| e | `content/bouquets.js`, `peerSheet.js`, `prep.js`, `problems.js` (+ their 4 tests) | the module pages only | **deleted** |
| f | root `knowledge.jsx`, `knowledgeGraph.js`, `content/textbook.js`, `content/exercises.js` | the home's 🧠 map, `validate:lessons`' graph check, `check:textbook`, the pages; nothing of `world/` or `board/` imports them (verified: `world/` imports only `../lesson.config` and the kit) | **deleted** (§10.1). Every textbook element they cited (`act-4`, `know-3`, `know-4-def`, `now-11-1`, `ex-10`) is still cited by the lesson's practice bank (`content/practice/4am/qasim-mushtarak-akbar/`) and/or `resources › sourceElementIds`: `check:textbook` ✅ with no destination moved |
| g | `lessons/common/textbook/index.js › IntegerSetQuestion` (re-export) | its only importer was the deleted `Module02Maarif.jsx` | the re-export **removed** (`check:unused`); the component stays (`TextbookExercise` imports it by file) |
| h | `packages/core/curriculum/exportContentRegistry.mjs` (deploy) | data + page files | modules and resources unchanged (8 modules, 6 resources); **the 5 items of the deleted « إختبار أولي » (`E1…E5`, P1–P4) disappear** — follow-up 13 |
| i | the `common-divisors` lab (`resources` of this config) | `resources` | **kept**, and NOT orphaned: `tayin-pgcd` and `wadiya-idmajiya-aadad` still mount it |
| j | other lessons naming this one: `tayin-pgcd` and `wadiya-idmajiya-aadad` « أستعدّ » (`lesson: 'qasim-mushtarak-akbar'`), `wadiya-idmajiya-aadad/content/prep.js › PREP_LESSON`, `unitMissions.js` (icon, short name), `lessonlab/registry.js` (its instrument `common`), `moduleLayoutMigrations.js` (`{ 4: 7 }`), the learning net, the launch kit | lesson ids, module numbers as data | unchanged |
| k | **`wadiya-idmajiya-aadad/content/mission.test.js`** (« owned keys from the unit's lessons, each id exists there ») — globs the siblings' ROOT `knowledge.jsx`; its tools `qawasim-mushtaraka`, `pgcd-taarif` existed only in this lesson's deleted `knowledge.jsx` | knowledge ids | **NOT changed** (another lesson's folder): **this test now FAILS** — follow-up 14 |
| l | `scripts/audit-knowledge-dependencies.mjs`, `validate-lessons.mjs`, `lesson-v2-status.mjs` | page files | skip / adapt by `retiredModules` (no change); `validate:lessons`: 4/4 الكفاءات covered from `world/evidence.js`; its stale report `docs/reports/knowledge-contracts/4am_qasim-mushtarak-akbar.json` **deleted** |
| m | `docs/sources/4am/masail-rollout/audit-locked-leaks.mjs` (walks lessons that have `content/problems.js`) | page data | the lesson drops out; its allow-list line `'qasim-mushtarak-akbar masala-2 1) 6'` is now stale (a doc-sources script, not run by CI) |
| n | e2e walks | pages | §11.4 |

### 11.2 Phase 2 — deleted

| What | Files | Lines |
|---|---|---|
| module pages (« أستعدّ », نشاط, معارف, أوظّف, three مسائل, « إختبار أولي ») | 8 | 416 |
| `moduleContext.js` | 1 | 3 |
| root `knowledge.jsx`, `knowledgeGraph.js` | 2 | 194 |
| `content/` — `bouquets`, `peerSheet`, `prep`, `problems` (+ their tests), `textbook`, `exercises` | 10 | 850 |
| **lesson folder, total** | **21** | **1,463** |
| mission scene `FlowerShopScene.jsx` | 1 | 89 |
| stale audit report `docs/reports/knowledge-contracts/4am_qasim-mushtarak-akbar.json` | 1 | 330 |
| **total** | **23** | **1,882** |

Also edited: `lesson.config.js` (keys of 11.1 c removed; module titles and `desc` neutral as §10.2 — 1
« القواسم المشتركة والباقات المتماثلة », 2 « القاسم المشترك الأكبر وقواسمه », 3 « أتمرّن », 4 « مسألة 1 », 5 « مسألة 2 »,
6 « مسألة الدرس » (the store of the world's last bridge, `world/story.js › PROBLEM_MODULE`), 7 « التقويم »; ids, numbers,
slugs, stages, `teachesLearningPointIds` unchanged — `world/journey.test.js` checks them against `MODULE_KEYS`; the
resource autonomy « أعداد الكتاب » → « أعداد كبيرة », the resource `masala-1` no longer titled « مسألة الدرس »);
`MissionScene.jsx` (import, entry, comment); `common/textbook/index.js`; `package.json` (`format:v2`, `check:format`: the
lesson's `world`, `board`, `lesson.pack.js`); the generated `lessonIndex.generated.json` (the lesson's `pack` flags).
`generate:lab-order` / `generate:compass-index` not run: they read the catalogue, the instruments and the bank, unchanged.

### 11.3 Tests changed

- `features/classSession/boardLessons.test.js`: the lesson joined `BOARD_LESSONS` (its door is « حصّة القسم »); the
  « no board yet » example is now `jidhr-tarbii` (still on the mission player).
- `4am …/_unit/prepDiagnostic.test.js`: four v2 lessons have no « أستعدّ » page (the list names this one).
- `knowledge/finalSynthesis.test.js`: 71 → 70 evaluation modules (unit 1: 6 → 5).
- Unchanged and passing: `registry.test.js`, `lessonPack.test.js` (generic), `lessonGraphs.test.js` (the lesson is now
  found among the world-only maps), the lesson's own `world/*.test.js` and `board/board.test.js`.
- **Failing, not changed**: `wadiya-idmajiya-aadad/content/mission.test.js` (11.1 k).

### 11.4 Walks (NONE was run)

None deleted, none changed. **Opening the deleted pages or the old home's tools** (follow-up 4 extends to them):
`lesson-kit/lab-coach.mjs` and `lesson-kit/manipulations.mjs` (the `common-divisors` lab on `/baqat` — they were its
browser suites; `tayin-pgcd` still mounts the lab), `lesson-kit/moyen-retrofit-phase1.mjs` (this lesson's modules),
`lesson-kit/4am-aadad-tabiiya-natiqa.mjs` (walks the unit's lessons and their modules), `knowledge-map.mjs` (its `ALL`
list opens the 🧠 map of this lesson's page — gone), `notebook-lesson.mjs` (`/baqat`, the 🧠 card, the knowledge brick),
`teacher-memo.mjs` (« وضع القسم » from the teacher's card — that door now opens « حصّة القسم »). To re-check, lesson
level only: `notebook.mjs`, `notebook-space.mjs`, `progression.mjs`, `lesson-kit/classroom.mjs` (practice of this lesson),
`lesson-lab.mjs` (the 4AM shelf — unchanged registry). `lesson-route-boundary.mjs` picks its module lesson by the index
(`!pack.world`): it moves on by itself.

### 11.5 Follow-ups NOT done

13. **5 final-test items retired at the next deploy** (as follow-ups 1 and 10).
14. **`wadiya-idmajiya-aadad/content/mission.test.js` fails**: the synthesis' `mission.tools` ids (`qawasim-mushtaraka`,
    `pgcd-taarif`) must exist in a sibling lesson's ROOT `knowledge.jsx`; lesson 4's is gone (its world names the keys
    `qawasim-mushtaraka`, `al-akbar`, …), and `bahth-pgcd`'s (`pgcd-baqi`, `khwarizmiyat-iqlidus`) will go the same way.
    Fix belongs to that lesson's owner: read the siblings' `world/knowledge.js` too and re-point `pgcd-taarif` → `al-akbar`
    (or rebuild the synthesis — `INTEGRATION_LESSON_PLAN.md`).
15. Stale mentions in other lessons' folders (not this change's scope): `tayin-pgcd/content/bags.js` cites
    « qasim-mushtarak-akbar › content/bouquets.js »; `wadiya-idmajiya-aadad/lesson.config.js` comment; the allow-list of
    `audit-locked-leaks.mjs` (11.1 m).
16. The `resources` titles still name the old labs' and problems' contexts (« 90 زهرة حمراء و 54 زهرة بيضاء », « صناديق
    السمك », « تبليط قاعة المطالعة ») — as §10.4, with follow-up 2.

### 11.6 Checks run (one at a time)

`cd apps/web && npx vitest run src/lessons/lessonPack.test.js src/lessons/registry.test.js src/features/classSession <lesson>`
✅ (18 files, 270 tests) · `_unit`, `common/knowledge`, `common/mission`, `wadiya-idmajiya-aadad`, `teacher/lessonMemo`,
`lessonlab`, `launchkit`: 4,297 ✅, **1 ❌ (follow-up 14)** · `status:lesson-v2 --lesson`: ✅ pack, world, knowledge, coach,
board, old version deleted; ❌ « a test per part » (no `forges` test yet — the world's agent) and ❌ « a walk plays its
world » (the orchestrator) · `validate-lessons.mjs` ✅ · `check-textbook-coverage.mjs` ✅ · `check:unreached` and
`check:unused`: nothing of this lesson (the other batch-2 lessons' `world/` only) · `eslint` and `prettier --check` on the
touched files ✅. NOT run: the whole suite, a build, `check:lessons`, any walk.
