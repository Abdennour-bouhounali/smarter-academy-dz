# Lesson v2 — master audit and rollout plan

Written 2026-11-16 for the session that starts the work. Status: **plan, nothing in it is built yet** except what §1
describes. The work order is generated: `docs/curriculum/V2_ROLLOUT_ORDER.md` (`node scripts/v2-rollout-order.mjs`).

**The owner's instruction (2026-11-16).** The pilot lesson `qasim-adad-tabii` is now the best version of a lesson. Every
other lesson gets the same treatment, one by one: the 4AM lessons of الفصل الأول, then the lessons that are their support
or core, then الفصل الثاني, and so on; then 3AM the same way. A lesson that exists is rebuilt completely, without being
limited by the docs or by what is already built. A lesson that does not exist is generated from scratch. The code must be
clean and readable for a programmer, and all dead code removed.

« The AM lessons » = **4AM** (confirmed by the owner, 2026-11-16).

---

## 1. What « lesson v2 » is (the pilot, as built)

A lesson is v2 when it has everything below. Each line names where the pilot keeps it.

**Student**

| # | Part | In the pilot |
|---|---|---|
| S1 | Launch « عُدّة الانطلاق »: 2–4 tools from the learning net, one capsule gate | `lessons/common/launchkit/` (`families.js`: 2 families) |
| S2 | The lesson as a game world; each rule forged and defended, never told | `gameworld/divisorIsles/` (`Game.js`, `RuleForge.jsx`) — today only ONE of the four tablets is forged |
| S3 | « خريطة المعارف » full page: mind map, memo sheets, « تدرّب » | `KnowledgePage.jsx` + the lesson's `knowledge.jsx` |
| S4 | Practice hub: « فضاء اللعب » (16 levels) then « فضاء الامتحان » (5 generated exam levels) | `Spaces.jsx`, `practice.js`, `trainer.js` |
| S5 | Exam cases played in real-world worlds, each carrying a value; « حيلة » shortcuts | `cases.js`, `Worlds.js`, `Depot.js`, `tips.js` |
| S6 | Paper mode, exam coach, white exam « الامتحان الأبيض », « تقدّمي » | `Paper.jsx`, `features/practice/exam/`, `ExamSitting.jsx`, `journey.js` |
| S7 | Evidence: exam-format first tries count, verdict re-computed by the server | `evidence.js`, `POST /lessons/{code}/game-evidence` |
| S8 | « مختبري »: the lesson's instruments with quests | `lessonlab/registry.js › TOOLS` |
| S9 | The classic mission player behind `?view=classic` and for « إختبار أولي » | `lessons/common/mission/` |

**Teacher**

| # | Part | In the pilot |
|---|---|---|
| T1 | Lesson page = common header + the card « للأستاذ » | `TeacherLessonPanel.jsx`, `LessonToolsBar.jsx`, `boardLessons.js › BOARD_LESSONS` |
| T2 | « حصّة القسم »: seating, start/end test, rules revision, the lesson on the board | `ClassSessionPage.jsx`, `lessonScripts.js › SCRIPTS`, `content/class-tests/` |
| T3 | Written memo, drawn opening situations, two printed pages | `lessonMemos.js › BOARD_MEMOS`, `MemoFigures.jsx` |
| T4 | Exercise bank (key, board, printed sheet), knowledge card, tracking, lesson file | `TeacherExerciseBank.jsx`, `knowledgeCards.js`, `ClassTracking.jsx`, `LessonFilePage.jsx` |

T4's tracking, lesson file and bank need nothing per lesson. Everything else in both tables is per-lesson work today.

---

## 2. Audit of the code base (measured 2026-11-16)

### 2.1 Size

- `apps/web/src`: 5,562 JS/JSX files, 1,007 of them tests; about 616,000 lines without tests.
- Lessons: 140 exist (4AM 74, 3AM 28, 2AM 23, 1AM 15); 130 catalogue entries are still `coming_soon`.
- 32 lessons (all 4AM) are in mission mode; **one** lesson has a game world and the teacher board.

### 2.2 The pilot cannot be copied as it stands — the main finding

| Fact | Number |
|---|---|
| Game world code written for this ONE lesson (`gameworld/divisorIsles/`) | about 6,500 lines with its tests |
| Reusable game engine beside it (`gameworld/engine/`) | 628 lines |
| Largest files | `Game.js` 1,388 lines, `DivisorIsles.jsx` 882 lines |
| Shared files that name the pilot's id in their own code | 8 (`ModuleLayout`, `StudentFocus`, `LessonIndex`, `KnowledgeProvider`, `PeerSheet`, `graphModel`, `ProgressiveKnowledgeMap`, `missionModel`) |
| Central lists a lesson must be added to | 9 (`BOARD_LESSONS`, `SCRIPTS`, `BOARD_MEMOS`, `KNOWLEDGE_LOADERS`, lab `TOOLS`, launch `families`, `exam-coach.json`, `exam-style.json`, `content/class-tests/`) |

At the pilot's cost, 173 more lessons would add over a million lines. The trainer, the exam sitting, the paper mode, the
practice ladder, the knowledge page and the rule forge are generic ideas written inside one lesson's folder. **Phase 0
exists to turn them into a kit, so a lesson becomes data plus one world mechanic.**

### 2.3 Readability

There is no linter and no formatter in the repository (no ESLint, no Prettier config). The code written during the
pilot is the densest in the tree:

| Area | Lines | Lines over 160 characters | Over 300 |
|---|---|---|---|
| `features/classSession/` | 2,229 | 17 % | 92 |
| `pages/teacher/ClassSessionPage.jsx` | 180 | 27 % | 13 |
| `lessons/common/launchkit/` | 849 | 14 % | 15 |
| `lessons/common/lessonlab/` | 911 | 12 % | 20 |
| `lessons/common/gameworld/` | 6,354 | 9 % | 41 |
| `lessons/common/mission/` (for comparison) | 3,901 | 3 % | 2 |
| `lessons/common/classroom/` (for comparison) | 2,233 | 1 % | 1 |

Whole components sit on one line. This does not meet « readable for a programmer » and must be fixed before it is copied
173 times.

### 2.4 Dead code

A reachability scan from `src/main.jsx` (static imports, literal dynamic imports, `import.meta.glob`) finds **57 files,
about 4,300 lines, that nothing reaches**. They are candidates: each must be checked against tests and scripts before
deletion.

- Never imported: `lessons/common/utils/geometry3d.js` (538), `geometry2d.js` (495), `components/AdaptiveFeedback.jsx`,
  `components/FeedbackBox.jsx`, `hooks/useLabState.js`, ten files of `manipulations/primitives/` (`ContextScenes`,
  `BookRectangle`, `FactorPairRow`, `RectangleArray`, `StepTimeline`, `Group`, and four two-line stubs).
- Billing pages without a route: `pages/Abonnement.jsx`, `Tarifs.jsx`, `AbonnementRetour.jsx`,
  `components/pricing/PricingCard.jsx`, `services/billingService.js`. **Owner decision**: delete, or keep for online
  payment later.
- Others: `components/services/ProcessSection.jsx`, `components/auth/GradeSwitcher.jsx`,
  `components/diagnostic/DiagnosticInviteBanner.jsx`, `components/admin/AdminPage.jsx`, six small files in
  `features/madar/`.
- 27 files inside 4AM lessons, mostly unused `*Vignette.jsx` scenes. They go when their lesson is rebuilt.

The scan sees files, not unused exports inside a live file, and it did not cover `apps/api` or `packages/core`. Both are
part of Phase 0, step 2.

The larger dead code is not files but **systems the pilot replaced that still serve the other 139 lessons**: the old
Classroom Mode (`lessons/common/classroom/`, 2,233 lines), the derived memo, the old lesson-home sections, « أستعدّ », the
مبتدئ / متقدم lab modes. They cannot be deleted today. §5 gives the rule that removes each one the day its last user is
converted.

### 2.5 State of the repository

- Everything after commit `008e9410` is uncommitted (about 54 changed or new files: the whole teacher side). Nothing
  should start before this is committed — the owner's go-ahead is needed.
- Root `CLAUDE.md` is 51 KB and reads as a history log. A new session loads all of it; the binding rules are hard to find.
- The docs still call the game world, the launch kit, « مختبري » and the class session « NOT validated ».
- Repository root holds stray files: `undefined-teacher-hub.png`, `undefined-teacher-player.png`, `shots/`,
  `Remaining-Work-Exercices`, four old report `.md` files.
- 3AM links of the learning net are not weighted core / support yet (`WEIGHTED_GRADES = ['4am']`).
- Known stale walks: `e2e/teacher-memo.mjs` (three checks), `e2e/teacher-learning.mjs` (student sign-in).
- Not run for this audit: the full web test suite, `check:lessons`, the API test suite.

---

## 3. The owner's decisions

**All decided on 2026-11-17** (D1 and D2 on 2026-11-16). Nothing here is open any more.

| # | Question | Decision |
|---|---|---|
| D1 | « AM lessons » = 4AM? | **DECIDED (owner, 2026-11-16): yes** |
| D2 | One game world per lesson, or one world per UNIT with one island (mechanic) per lesson? | **DECIDED (owner, 2026-11-16): one world per unit; a lesson that needs its own world gets its own.** The reason for a separate world is written in the lesson's pack |
| D3 | When a lesson is converted, is its mission player (`?view=classic`) kept? | **DECIDED: no.** « Rebuild everything as we did with the first lesson; never depend on the existing code or the docs. » A v2 lesson depends on nothing of the mission player: the kit itself carries « إختبار أولي ». The pilot's `?view=classic` goes when the kit does |
| D4 | Billing pages (§2.4): delete or keep? | **DECIDED: delete.** Done on 2026-11-17 (five files) |
| D5 | Do prerequisite lessons of 1AM–3AM get the full v2, teacher side included? | **DECIDED: yes, exactly as lesson 1** — rebuilt from scratch. Existing maths is reused when it is useful, « because it is useful, not because it is there » |
| D6 | Is the pilot's v2 now BINDING (docs say « not validated »)? | **DECIDED: yes.** The contracts are marked at Phase 0 step 9 |
| D7 | Three of the pilot's four rules are still told, not forged. Finish the pilot first? | **DECIDED: yes**, in Phase 0 |
| D8 | Do v2 lessons open on phones? | **DECIDED: student side yes, teacher side no.** A first pass is on the pilot (`GAME_WORLD.md` § « On a phone »); the owner tests it on a real phone, then it becomes a requirement of the kit |

---

## 4. Phase 0 — foundation (before any second lesson)

Done when a second lesson can be built without touching shared code. Order matters.

1. **Commit** the current work (owner's go-ahead), then tidy the repository root.
2. **Tooling**: add ESLint and Prettier with one config (line length 120, no unused imports or variables), add a tool
   that finds unused files AND unused exports (`knip`, or the reachability scan kept as `scripts/check-unreached.mjs`),
   run it on `apps/web`, `packages/core` and the PHP side (unused classes and routes), wire all into CI. Format the
   pilot's areas of §2.3 first, in a commit that changes nothing else.
3. **Delete the dead files** of §2.4 after checking each against tests and scripts.
4. **Extract the lesson kit** from `gameworld/divisorIsles/` into `lessons/common/gameworld/kit/`: shell and title
   screen, spaces hub, trainer, exam sitting, paper mode, knowledge page, rule forge, evidence, journey, tips. Each takes
   the lesson's data; none names a lesson. `Game.js` is split into the kit's world runtime and the lesson's mechanic.
   A world mechanic implements one small interface: build the scene, read the student's gesture, give the visible
   verdict.
5. **One lesson pack**: a lesson declares everything in its own folder (`lesson.pack.js`: world, forge rules, practice
   families, exam cases, class test, board script, memo, knowledge cards, lab tools, launch families). The nine central
   lists of §2.2 become one generated index, like `lessonIndex.generated.json`.
6. **Remove the pilot's id from the 8 shared files**: each becomes a flag or a field of the pack.
7. **Finish the pilot** (D7): forge the three rules that are still told.
8. **Status script** `apps/web/scripts/lesson-v2-status.mjs --lesson <id>`: one line per part of §1, ✅ or what is
   missing. A lesson is not done until it prints ✅ everywhere (same idea as `lab-rollout-status.mjs`).
9. **Contract and docs**: write `docs/architecture/LESSON_V2.md` (the definition of done of §6, the pack, the kit, the
   mechanic interface); cut root `CLAUDE.md` to a short map of binding rules that links to it; mark D6 everywhere.
10. **Prove the recipe** on lesson 2, `qawasim-adad-tabii`, built only from the kit and the pack. Time it. Report the
    time and the line count to the owner: that number sizes the whole rollout.

Phase 0 is finished when: the pilot and lesson 2 both print ✅, no shared file names a lesson, lint and the unreached
check pass in CI, and the pilot's walks (`e2e/class-session.mjs` 102 checks, `e2e/class-lesson.mjs` 59) still pass.

---

## 4bis. What else must change before the mass rollout (audit of 2026-11-16, second pass)

Asked by the owner: « what are all the other things that need to be updated, in addition to what we discussed ».
Checked in the code unless marked otherwise. Linked plans: the phone (`GAME_WORLD.md` § « On a phone »), the navigation
and its look (`NAVIGATION_REBUILD_PLAN.md`).

**A. Blockers — a second lesson cannot be right without them**

| # | What | Evidence |
|---|---|---|
| A1 | **The server's verdict is written for the pilot.** `Domain/GameWorld/ClaimVerifier.php` re-computes the pilot's own cases (قاسم / مضاعف). Each lesson needs its verifier, so the kit needs ONE way to declare it on both sides, with one shared fixture | `ClaimVerifier.php` lines 14–53 |
| A2 | **The student's journey in the world stays in the browser** (`scopedStorage` in the game and the launch kit); only exam evidence reaches the server. Now that phones open, a student who starts on a phone finds nothing on the laptop | `DivisorIsles.jsx:14`, `launchkit/store.js`; a server sync was looked for and not found |
| A3 | **The generation contract and its checks describe the OLD lesson.** `LESSON_DEVELOPMENT_GUIDE.md` §14 is « frozen » on the module lesson; no script of `check:lessons`, `lab-rollout-status` or `check:textbook` knows a game world, a pack or a board | no validator mentions `gameWorld` or `BOARD_LESSONS` |
| A4 | **Progress, mastery and the reports read MODULES.** « بوصلتي », the parent's « التقدّم بالتفصيل », the school's reports, the teacher's tracking and the year map of the navigation must read a v2 lesson (stages, keys, exam levels) the same way | to design with A2; not traced page by page |
| A5 | **What happens to a student's progress when his lesson is rebuilt?** 32 lessons are in use in mission mode. A rule is needed (keep the الكفاءات, restart the journey?) and its migration | `packages/core/progress/moduleLayoutMigrations.js` exists for the old layouts |
| A6 | **No walk runs in CI** (0 of 59 `e2e/*.mjs`), and each walk is hand-written for one lesson. 174 lessons need ONE walk driven by the lesson's pack, run in CI on a laptop and a phone size | `ci.yml`: unit tests, build, budget, API tests only |

**B. Before the tenth lesson — they multiply with every lesson**

| # | What | Evidence |
|---|---|---|
| B1 | **Weight on a phone network.** three.js is 555 KB and the pilot's world 293 KB before compression, per lesson. One shared engine chunk, a loading screen with progress, and a measured budget per lesson | `dist/assets` |
| B2 | **Text lives in the code.** 66 files of the pilot's areas hold Arabic sentences inline, while the platform's rule is the i18n files. Choose one rule for a pack (my advice: the lesson's own strings in its pack, the kit's strings in i18n) | count of files with Arabic literals |
| B3 | **The entry bundle is full**: 242.7 KB of 245. The navigation rebuild and the tokens need room first. **DONE 2026-11-17: 199.2 KB, budget 212** (§4ter-0) | `check:entry-budget` |
| B4 | **The launch kit has 2 question families** and no server side (phase 1 of 4). Every lesson needs a family per core prerequisite: about one new family per lesson | `launchkit/families.js` |
| B5 | **« مختبري » has 8 instruments, all on division.** Each unit needs its own; the labs of the 112 old lessons are the material | `lessonlab/registry.js` |
| B6 | **The class session is at step 2 of 4**: group formats and what the student sees at home are not built. Decide whether they enter the definition of done | `CLASS_SESSION.md` §8bis |
| B7 | **The unit page.** With one world per unit (D2), `UnitMissionView` and `unitMissions.js` describe something else; the unit page and the unit's world must become one thing | `pages/unit/` |
| B8 | **The content checks must read packs**: respect of Islam, independence from the book, « دج », counters, formulas that never wrap | today they read the module files |
| B9 | **The guided tours** (`tour.json`, 475 lines) describe pages that the rebuild and the navigation replace | seen on the teacher's lesson page |

**C. Around the lessons — can run beside the rollout**

| # | What |
|---|---|
| C1 | **The pilot's own leftovers**: three rules still told; island H unverified under touch; « بطاقتي » still shown to students; old « كرّاسي » notes not moved to « ملفّ الدرس »; the memo's minutes are estimates |
| C2 | **The marketing page `/methode`** shows real captures of the OLD lesson (the football lab, « 50 تمرينًا »): re-capture after the pilot is final |
| C3 | **Measurement.** Nothing records how a student moves through a lesson (time per island, where he leaves). Without it, 174 lessons are built on opinion. One timed real student before lesson 5 |
| C4 | **Open rollouts that overlap**: the exam-sheet practice « unit by unit », the answer templates, the « دج » sweep. Fold them into the v2 definition of done or finish them first, never both |
| C5 | **The learning net**: weights for 3AM; the catalogue's false prerequisites that still await the owner |
| C6 | **Production**: two migrations and about 80 changed files are not committed; the content publishing pipeline must carry packs and class tests |

## 4ter-0. State of the « today » items (2026-11-16)

- **C6 — DONE.** The work is committed on `dev` (`402e8087` code, `ab22f63f` plans). Not pushed, not merged: the owner
  tests over Wi-Fi first.
- **C4 — DECIDED** (owner accepted the advice, 2026-11-16): the exam-sheet practice, the answer templates and « دج » are
  part of the v2 definition of done (section 6); their separate rollouts stop.
- **B6 — DECIDED** (same): steps 3–4 of the class session are NOT part of « done »; they are built on the pilot after
  unit 1.
- **B9 — first half DONE**: the old tour of the lesson page is no longer declared on a lesson that has its board. Its
  rewrite waits for the navigation rebuild.
- **Navigation rebuild — COMMITTED** (`099d3f9b`, 2026-11-17, not pushed): the tree was clean before Phase 0 went on.
- **Phase 0 step 2 — linter DONE (2026-11-17)**: ESLint on the whole tree and « nothing unused » (exports, i18n keys,
  string tables; classes, actions and `use` lines of the API), all in CI — contract `docs/architecture/CODE_HEALTH.md`.
  First run: 2,312 unused imports, 389 unused variables, 1,949 unused exports, 211 unused i18n keys, 30 dead sentences
  were found; lint is at 0, and 553 lines wait in a baseline that may only shrink (494 exports that only a test
  imports, 59 i18n keys to look at). The linter also found LaTeX that reached students broken (`'\;'` shown as « ; »):
  fixed. What a person must still look at: `docs/reports/LINT_FIRST_RUN_2026-11-17.md`.
- **B3 — DONE (2026-11-17)**: the entry bundle went from 240.8 to **199.2 KB gzip** and its budget from 245 to **212**.
  The strings of the admin panel and of the teacher space now load with their own space (−30.5 KB), and the shell
  animates with the light half of framer-motion (−11.1 KB). Two tests hold it (`i18n/onDemandNamespaces.test.js`,
  `entryGraph.test.js`). Contract and measures: `docs/architecture/BUNDLE_BOUNDARIES.md` §3, §4 rules 5 and 10, §5.
  The same day the owner had the command palette (Ctrl+K) deleted — no global search either: entry 197.7 KB.
- **Phase 0 step 4 — kit extraction, sub-step 1 of 3 DONE (2026-11-17): the pure logic.** `gameworld/kit/` holds six
  frames that name no lesson (practice ladder, trainer, exam sitting, the road, evidence, random numbers) plus the
  calculation shortcuts and the long-division model; the pilot's content moved to its own folder
  `…/qasim-adad-tabii/world/` and is bound to them. `kit.test.js` drives the kit with a toy lesson and holds the boundary
  (no kit file imports or names a lesson). After it: 17,936 web tests, lint, `check:unused`, `check:unreached`,
  `check:format`, `check:lessons` pass, and the pilot's eight walks pass (533 checks: story 92, practice 30, field 102,
  sitting 45, launch kit 56, « مختبري » 47, class lesson 59, class session 102). **Still to do in step 4:** sub-step 2
  — the React screens take the lesson's data instead of importing the pilot (`KnowledgePage`, `Trainer`, `ExamSitting`,
  `Spaces`, `Paper`, `RuleForge`, the title screen and HUD of `DivisorIsles.jsx`), the two string tables are split into
  kit chrome and lesson sentences, `cases.js` and `ruleForge.js` are split the same way; sub-step 3 — `Game.js` becomes
  the world runtime plus the lesson's mechanic. Files and rules: `docs/architecture/GAME_WORLD.md` §3.
- **Phase 0 step 4 — sub-step 2, the screens (2026-11-17): six of them DONE.** The lesson's data reaches the screens
  through ONE object (`<LessonProvider>` / `useLesson()`; the pilot's pack is `world/index.js`). In the kit now: the two
  spaces and « تقدّمي », the paper mode, the fit box, the exam sitting, « تدرّب » and the knowledge page. The shape of an
  exam answer became data the lesson describes (a `form`, a `sentence`, `tokens`), so the kit draws any lesson's
  answers. The SHELL (title screen, HUD, practice hub, result, end) is NOT split yet: it shares the overlay protocol
  with `Game.js` and is done with sub-step 3. The same day the other screen sizes were measured (owner's request):
  failures at 1024×768, 1840×900 and on a phone, ALL present before the extraction (`GAME_WORLD.md` §6); owner's
  decision: they are repaired on the kit's screens right after this step, before lesson 2.
- **Phase 0 step 4 — sub-step 3, part 1 (2026-11-17): `Game.js` is split.** `kit/WorldRuntime.js` (the scene, the loop,
  the robot, the camera, the sky, the hub, the knowledge and exam state, the save) is a class a WORLD extends through a
  closed list of hooks (`GAME_WORLD.md` §3); the pilot's world keeps the mechanic and no longer imports the lesson: it
  reads `this.lesson`. Still inside the world: the gate dash and the real-world cases. Part 2 is the shell.
- **Phase 0 step 4 — sub-step 3, part 2 (2026-11-17): the shell is split. Step 4 is DONE for what can be done before
  lesson 2.** `kit/LessonWorld.jsx` is the shell every world shares (canvas, top bar, controls, overlay switch) with
  the title screen, the practice hub, the rule tablet, the result and the end; the pilot's `DivisorIsles.jsx` (887
  lines, was 1,911) keeps its own overlays and defines `WORLD`. NOT extracted, on purpose, and recorded in
  `GAME_WORLD.md` §3: the gate dash and the real-world cases (inside the pilot's world), the rule forge (step 7), the
  CSS split (done with the screen-size repair), the world's story as data (the gate on lesson 2 decides).
- **OWNER'S STANDING ORDER (2026-11-17, his words):** « go on, do not stop until i get the lesson 2 ready to use after
  all possible test in all devices ». So: every remaining step of Phase 0 and lesson 2 are done WITHOUT waiting for
  « commit »; each step is committed on `dev` when its checks pass; nothing is pushed; lesson 2 is tested at laptop,
  tablet and phone sizes. The order of what is left is the list just below.
- **WHAT IS LEFT, in order (kept up to date — the first unticked line is the next thing to do):**
  1. [x] Screen-size repair of the pilot on the kit's screens — DONE 2026-11-17 (commits `818a3c5b`, `6052d9cc` and
     the one after). Measured, Chromium emulation: the eight walks pass at 1366×768, 1024×768 and 1840×900 (533 checks
     each) and the six student walks pass on a phone held sideways (`E2E_TOUCH=1 E2E_SIZE=800x370`: 357 checks); web
     tests 17,942; lint, format, dead-file, unused and `check:lessons` pass; entry bundle 197.7 KB. What changed and the
     phone rules of each screen: `GAME_WORLD.md` §6 and « On a phone ». `kit/world.css` is split into eleven sheets BY
     SCREEN (`kit/styles/`, imported in the order of the cascade); the split BY OWNER (kit / the pilot's world) is not
     done — it would reorder rules the later sheets override, and waits for a second world. NOT checked: a real phone,
     a real tablet (the owner tests over Wi-Fi before any merge).
  2. [x] One `lesson.pack.js` per lesson and its generated index — DONE 2026-11-17. The pilot's pack names its phone
     flag, its world and content, its knowledge, the exam coach's sheets, its board script and memo (moved into its
     folder: `board/script.js`, `board/memo.js`); `generate-lesson-index.mjs` writes the flags into the lesson index;
     `registry.js` (`lessonPackFlags`, `lessonsWithPack`, `loadLessonPack`) and `lessons/lessonPack.js` (`loadPackPart`,
     `usePackPart`) are the only readers. GONE: `PHONE_LESSONS`, `BOARD_LESSONS` as typed lists, `SCRIPTS`,
     `BOARD_MEMOS`, `KNOWLEDGE_LOADERS`, the exam coach's table, `content/practice/exam-coach.json`, `GAME_WORLDS`, the
     `gameWorld` / `classSession` keys of the config, the world's import of its one lesson (`LessonGameWorld.jsx` hands
     the content to the world). NOT in the pack, with the reason (`LESSON_V2.md` §1): the lab's `TOOLS`, the launch
     kit's `families.js`, `exam-style.json`, `content/class-tests/`, `unitMissions.js` — so of the nine lists of §2.2,
     five became the pack and four stay where they are.
  3. [x] The pilot's id is out of the shared files — DONE 2026-11-17. After step 2 the eight files of §2.2 named it only
     in comments (reworded); `lessons/lessonPack.test.js` now FAILS when a file of `lessons/common`, `features`,
     `components`, `services`, `utils`, `hooks` or `contexts` names a lesson that has a pack (one exception, with its
     reason: the instrument tags of `lessonlab/registry.js`). Still naming it, by design: `pages/unit/unitMissions.js`
     (the unit's page), `pages/Methode.jsx` (marketing captures), other lessons' prerequisites. STILL COUPLED, for step 4:
     the pilot's content imports the world's `logic.js` / `strings.js`, and `features/classSession/lessonScripts.js`
     imports the world's `ruleForge.js`.
  4. [x] The pilot is finished: its FOUR rules are forged, and the forge is in the kit — DONE 2026-11-17. `kit/forge.js`
     (the frame: a forge is a description — tiles, what a rule says of a case, evidence, predictions, attacks, nudges, a
     last step typed in its own shape) and `kit/RuleForge.jsx` (the screen); the world gives what a case is and how it is
     drawn (`divisorIsles/ruleForge.js`, `forgeParts.jsx`); the lesson gives its forges (`world/forges.js`). The three
     new ones: the plank's table (island E), which number is written first in each of the four sentences (the
     guardians), the two planks that hold over every gap (the stone of island H). In each, sixteen rules can be written
     and exactly one holds; every false rule is refuted in front of the student (`forges.test.js`, 29 tests). The story
     walk crosses the four forges (104 checks, laptop and phone); the forge has a phone layout (no zoom of its own).
     NOT done: the class board still forges only the first rule with the class.
  5. [~] A1–A6 with B1 — what was done on 2026-11-17 and what was NOT:
     - A1 DONE: a claim kind belongs to no lesson. `kit/claims.js` is the browser's copy of `ClaimVerifier.php`; one
       fixture; `claims.test.js` fails when the two lists differ. Adding a kind = the same three edits on both sides
       (`LESSON_V2.md` §1bis). The controller was already lesson-independent.
     - A2 DONE: the journey follows the student between devices (`kit/saveSync.js`, his private answers store, no new
       table; `LESSON_V2.md` §1ter). NOT synced: the launch kit's own store (`launchkit/store.js`).
     - B1 DONE in part: three.js already is ONE shared chunk (135 KB gzip, measured); the world now opens on a
       loading screen with progress and a retry. NOT done: a measured budget per lesson (step 6).
     - A4 — no change needed: a v2 lesson keeps its modules and marks them from the world; every report reads them as
       before (`LESSON_V2.md` §1ter). NOT traced page by page.
     - A5 — a rule is WRITTEN (taken from the pilot, never decided by the owner): nothing earned is taken, the keys
       his progress proves are his, the story starts at the first island (`LESSON_V2.md` §1ter).
     - A3 — in step 6 (the contract and the status script).
     - A6 NOT done: no walk runs in CI; one walk driven by a lesson's pack is written with lesson 2 (step 8).
  6. [x] `apps/web/scripts/lesson-v2-status.mjs` (`npm run status:lesson-v2`), `docs/architecture/LESSON_V2.md` (the
     pack, the server's side, the journey, the folder, the definition of done, the retirement ledger), D6 marked at the
     top of the four contracts — DONE 2026-11-17. The pilot prints ✅ (15 parts); lesson 2 prints 12 parts missing.
     NOT in the script: a weight budget per lesson; the content checks do not read `world/` and `board/` yet (B8).
  7. [x] The root `CLAUDE.md` is cut from 479 lines (56.7 KB) to 298 (19.5 KB): a map of what binds every task, with
     the documentation rule and the images rules kept word for word — DONE 2026-11-17. The file as it was is kept
     whole: `docs/reports/CLAUDE_MD_BEFORE_CUT_2026-11-17.md`.
  8. [~] THE GATE — lesson 2 `qawasim-adad-tabii`, rebuilt with the kit only. STATE on 2026-11-17, late:
     - **THE STUDENT'S WORLD PLAYS**, measured: `apps/web/e2e/gameworld-qawasim.mjs` (52 checks: the story from the
       title to the last bridge, its four forges each with a false rule refuted and a last step typed wrong then right,
       the workshop, the dash, the stone) passes at 1366×768, 1024×768, 1840×900 and on a phone held sideways
       (800×370, touch); the pilot's story walk still gives 104. `status:lesson-v2` prints 12 of 15 parts.
       Two defects were seen on screenshots and fixed (the five-slot forge overflowed; a case whose truth is not
       « the bridge holds » was labelled « ثبت »): `forgeParts.jsx › fits, tag`, `kit/ruleForge.css` five slots.
     - **NOT DONE — lesson 2 is not finished:** (1) tests for `world/practice`, `trainer`, `sitting`, `journey`,
       `evidence` (only `forges.test.js` and the pack test cover its content: the trainer, the sittings and the
       practice hub of lesson 2 were NEVER opened in a browser); (2) the practice hub, « تدرّب », an exam sitting and
       « تقدّمي » walked for lesson 2; (3) `board/script.js`, `board/memo.js` and `board` in the pack — the teacher
       still gets the OLD lesson page; (4) a launch-kit family for `4am.m1.r01` — lesson 2 has no « عُدّة الانطلاق »
       check of lesson 1's الكفاءة, and its world walk seeds the launch as already played; (5) screenshots of every
       screen looked at (only the forges were); (6) the old modules are still there (`?view=classic`, « إختبار أولي »);
       (7) the gate's report: real time, lines written by hand, what was copied from the pilot.
     - NOT in lesson 2 by choice, to be said in the report: no real-world case world (S5); ten dash levels instead.
     - The walk is assembled from the pilot walk's helpers (copied, not shared): a shared helper module is owed.
- **D4 — DONE**: the five billing files are deleted.
- **Phase 0 step 2 — formatter DONE**: Prettier (`.prettierrc.json`, 120 columns) with `npm run format:v2`
  and `npm run check:format` (in CI). The pilot's areas are formatted: 109 files; `features/classSession/` went from
  2,229 lines to about 6,300 — its real size. After it: web tests, the seven laptop walks and the phone world walk give
  the same results as before. A new area enters the two scripts when
  its code is written or rebuilt; the rest of the tree is formatted lesson by lesson, never in one sweep.
- **Phase 0 step 3 — dead files DONE**: 49 files deleted (22 shared: the two unused geometry libraries and `useLabState`
  with their tests, eleven unused lab primitives, six unused components; 27 unused files inside 4AM lessons). After it:
  17,959 web tests, the build, `check:lessons`, the route and index checks pass. `npm run check:unreached` (in CI) now
  FAILS on any file the app does not reach; its `KEPT` list names six test helpers (the five billing files were deleted
  on 2026-11-17, decision D4). Unused exports, `apps/api` and `packages/core` are covered since 2026-11-17 by
  `check:unused`.
- **Tests at the commit**: web 18,067 and core 1,577 pass. API: 1,464 of 1,473 pass, 6 fail — `MathLabFileFlowTest` (the
  lock query; it fails the same way without this work's change) and five of `DbBackupCommandTest` (a command this work
  never touched; cause not investigated).

## 4ter. When each item of 4bis is done

| When | Items | Why then |
|---|---|---|
| **Today, before anything** | C6 commit the work · C4 decide: the exam sheet, the answer templates and « دج » become part of the v2 definition of done, their separate rollouts stop · B6 decide whether steps 3–4 of the class session are part of « done » (advice: no — build them on the pilot after unit 1) | they cost a decision, not work, and everything after depends on them |
| **Phase 0, with the kit** | A1–A6 · B3 free room in the entry bundle (before the navigation) · B1 one shared engine chunk and a loading screen · B2 the rule for texts, applied while the pilot is reformatted · B8 the content checks read packs (same work as A3) · C1 finish the pilot · C3 the recorder of a student's path (same data as A2: once the journey is saved on the server, time per stage comes with it) | each one shapes what a pack is; changing it after ten lessons means redoing ten lessons |
| **With the navigation rebuild** | B9 the guided tours: switch the outdated ones off now, rewrite them at step 4 of the navigation | they describe pages that step replaces |
| **During unit 1 (lessons 2–9)** | B4 one launch family per lesson, in the definition of done · B5 the unit's instruments, at the unit's first lesson · B7 the unit page and the unit's world become one thing, settled before the unit's last lesson · C3 one real student timed after lesson 2 | they are per lesson or per unit by nature; unit 1 is where the recipe is proven |
| **After unit 1** | B1 the measured weight budget per lesson becomes a CI check · B4 the launch kit's server side (its phases 2–4), if the owner wants the teacher to see it · B6 the class session's steps 3–4 on the pilot · C2 re-capture `/methode` on the finished unit | they need a finished unit to be measured or shown |
| **Before the term's prerequisites / before 3AM** | C5 the false prerequisites of the catalogue (they change the ORDER of section 7, so before the first prerequisite lesson) · C5 the weights of 3AM, then regenerate the order | the order is generated from the net |

## 5. Removing the old systems (dead code by design)

Keep a **retirement ledger** in `LESSON_V2.md`: one row per legacy system with the number of lessons still using it,
printed by the status script. The rule: **a legacy system is deleted in the same commit that converts its last user**,
never later.

| Legacy system | Deleted when |
|---|---|
| A lesson's old modules, vignettes, old tests | That lesson is converted (same commit) |
| Old Classroom Mode `lessons/common/classroom/` and « وضع القسم » | Every lesson has its board |
| Derived memo (`LessonMemoPage` rail, `MemoSections`) | Every lesson has a written memo |
| Old lesson-home sections in `LessonIndex.jsx` | Every lesson has the teacher card and a v2 student entry |
| « أستعدّ » modules | Every lesson has its launch kit |
| مبتدئ / متقدم lab modes | No lesson mounts a lab outside rounds |
| Mission player | Decision D3 |

Lessons outside this plan (1AM and 2AM lessons that are nobody's prerequisite) keep the old systems alive. The ledger
shows that plainly; the owner decides later whether they follow.

---

## 6. Definition of done for one lesson

1. Read the unit's sources and the learning net for the lesson; design the world mechanic to
   `MANIPULATION_DNA.md` (the student's hand controls the mathematical variable).
2. Build the pack: every part S1–S9 and T1–T4 of §1. Every rule is forged. The practice is the BEM exam sheet, every
   typed answer has its template, money is « دج » (decision C4: these three rollouts live here now). Content is the platform's own
   (independence from the book), respects Islam, money in « دج », people only as `KidFigure`, nothing scrolls,
   a formula never wraps, counters use the no-break space.
3. Delete what the lesson replaced (§5, first row).
4. `lesson-v2-status.mjs --lesson <id>` prints ✅; unit tests pass; the lesson's walk passes at 1366×768, 1024×768 and
   1840×900; `check:lessons` and `check:entry-budget` pass; lint passes.
5. Screenshots looked at with the eyes, student and teacher.
6. A new lesson is also published: status `available`, export/import, modules and exercises `published` locally.
7. Docs updated in the same task; progress line added to `docs/reports/LESSON_V2_PROGRESS.md`.
8. Commit `feat(lessons): <id> — v2`. Push only when the owner asks.

Working limits: at most 2 agents at once and one heavy check at a time.

**Who writes what** (recommendation, 2026-11-16; the owner asked whether an orchestrator model with a second model as
coder is safe). Phase 0 and, for every lesson, the design — the world mechanic, the forge, the board script — are done by
the main session itself: they need the whole context and a brief cannot carry it. A second model may write the bounded
parts once `LESSON_V2.md` and the status script exist: practice families, exam cases, class test, memo, tests, formatting.
Its work is accepted only when the main session has read the diff, run the status script and the walk, and looked at the
screenshots; a coder never certifies its own work.

---

## 7. The order

Generated in `docs/curriculum/V2_ROLLOUT_ORDER.md`: **174 lessons — 118 to rebuild, 56 new.**

| Stage | The term's lessons (new) | Their prerequisites (new) |
|---|---|---|
| 4AM الفصل 1 | 29 (0) | 16 (4) |
| 4AM الفصل 2 | 30 (0) | 10 (3) |
| 4AM الفصل 3 | 15 (0) | 14 (14) |
| 3AM الفصل 1 | 18 (6) | 11 (5) |
| 3AM الفصل 2 | 14 (8) | 4 (3) |
| 3AM الفصل 3 | 7 (7) | 2 (2) |
| 3AM, unit « البرهان » (not in the school progression) | 4 (4) | — |

Rules of the order:

- Inside a term, the school calendar's order; a unit's synthesis after its lessons.
- A term's prerequisites come after the term's lessons, core before support; a lesson is listed once, where it first
  appears. Prerequisites are the DIRECT ones of the learning net.
- The pilot is lesson 1 and is done; `qawasim-adad-tabii` is lesson 2 and belongs to Phase 0.
- Before 3AM starts: weight the 3AM links core / support, then regenerate the order.
- After a unit's last lesson: update its unit page (`pages/unit/unitMissions.js`).

---

## 8. Risks

- **Scale.** 173 lessons at the pilot's depth is very large even with the kit. The time measured on lesson 2 decides
  whether D2 (one world per unit) is enough or whether the parts list of §1 must be tiered.
- **Sameness.** A kit pushes every lesson toward one style; `MANIPULATION_DNA.md` forbids that. The kit owns the shell,
  never the mechanic.
- **Two experiences side by side** for months: converted lessons in v2, the rest in mission or classic. The unit page
  and the catalogue must not promise v2 where it is not built.
- **Bundle.** Entry is 199.2 KB of a 212 KB budget (since 2026-11-17; it was 242.5 of 245). Every kit module stays behind the lesson's lazy boundary.
- **No real student has been timed** on the pilot's full path. One timed session before lesson 5 is worth more than any
  review.

---

## 9. Prompt for the next session

Updated 2026-11-16, after the navigation, the cards, the unit page and the class page were rebuilt
(`NAVIGATION_REBUILD_PLAN.md` §0). Paste it as the first message of a new session.

```text
We start Phase 0 of the lesson v2 rollout, then the lessons, one by one.

READ FIRST, in this order, before touching anything:
1. CLAUDE.md
2. docs/reports/LESSON_V2_MASTER_PLAN.md — all of it; §4 (Phase 0), §4bis (A1–A6, B1–B9, C1–C6),
   §4ter-0 (what is already done), §5 (what gets retired), §6 (definition of done, who writes what), §7 (order)
3. docs/curriculum/V2_ROLLOUT_ORDER.md — the work order (174 lessons: 118 rebuild, 56 new)
4. docs/reports/NAVIGATION_REBUILD_PLAN.md §0, §5ter, §5quater — what the workspace looks like now
5. docs/architecture/GAME_WORLD.md, LAUNCH_KIT.md, LESSON_LAB.md, CLASS_SESSION.md — the pilot's contracts
6. the pilot's code: apps/web/src/lessons/common/gameworld/, launchkit/, lessonlab/,
   apps/web/src/features/classSession/, and the lesson `qasim-adad-tabii`

STEP 0 — the repository. Run `git status` and `git log -5`. If the working tree is not clean, show me what
is there and ask before committing. Never push and never merge to main without my word (main deploys to
production).

STEP 1 — decisions. Ask me the open decisions D3–D7 of the master plan §3 in ONE question, each with your
recommendation. Do not ask again what is marked decided.

STEP 2 — Phase 0, in the order of the plan §4. What remains (§4ter-0 says what is done):
- extract the lesson kit out of `gameworld/divisorIsles/` so a lesson is DATA plus ONE world mechanic;
- one `lesson.pack.js` per lesson and its generated index;
- remove the pilot's id from the shared files that name it;
- finish the pilot: its three rules that are still told, not forged;
- A1–A6: the generic server verdict, the journey saved on the server, validators for v2, progress and
  reports reading v2, the progress-migration rule, one pack-driven walk in CI;
- `lesson-v2-status.mjs` (a lesson is done when it prints ✅) and `docs/architecture/LESSON_V2.md`;
- cut the root CLAUDE.md down to what a new session must know.
One step at a time. After each step: run its checks, update its docs, tell me what you measured, and wait
for my « commit ».

STEP 3 — the gate. Rebuild lesson 2, `qawasim-adad-tabii`, with the kit only. Report the real time it
took, the lines written by hand, and what still had to be copied from the pilot. STOP there: I validate
lesson 2 on the laptop and on the phone before lesson 3.

STEP 4 — the lessons. Follow V2_ROLLOUT_ORDER.md line by line: the 4AM lessons of الفصل الأول, then
their core and support prerequisites, then الفصل الثاني, الفصل الثالث, then 3AM the same way. An existing
lesson is rebuilt completely, without being held back by its old code or old docs; a missing one is
generated from scratch. One game world per unit, unless a lesson needs its own.
For each lesson: meet the definition of done of §6, publish it in the local database (nothing stays
draft), run `lesson-v2-status.mjs --lesson <id>`, delete what the rebuild makes useless in the same
change, then commit `feat(lessons): <id>` and go to the next one.

RULES THAT HOLD THROUGHOUT:
- Show me your limit: a lesson that merely works is not done.
- The textbook is the reference of the الكفاءات, never the script; never send a student to the book.
- Drawn in code, never a generated image; people only through KidFigure; respect Islam in every string.
- Shapes in the brand blue (`nav-accent`), dark navy for text only; small content; fold, never delete.
- Laptop first, then tablet, then phone; a formula never breaks; an answer is typed in its own shape;
  money is « دج ».
- At most 2 agents at once and ONE heavy check at a time (check:lessons, build, e2e), or the editor crashes.
- Every task ends with the docs updated and a « Documentation Sync » section.
- Report honestly: what failed, what you did not check, what you are unsure of. Never « all green »
  on something you did not run.
```

Before pasting it: the working tree must be committed (today's navigation, cards, class page and clean-up are
uncommitted at the time of writing), or STEP 0 will stop on it.
