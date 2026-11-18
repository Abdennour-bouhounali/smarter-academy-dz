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
