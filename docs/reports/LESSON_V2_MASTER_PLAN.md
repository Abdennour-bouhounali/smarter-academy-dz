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
  8. [x] THE GATE — lesson 2 `qawasim-adad-tabii`, rebuilt with the kit only — DONE 2026-11-18 (the owner's validation and the retirement of the old modules remain; report `LESSON_2_GATE_REPORT.md`). STATE on 2026-11-17, late:
     - **THE STUDENT'S WORLD PLAYS**, measured: `apps/web/e2e/gameworld-qawasim.mjs` (52 checks: the story from the
       title to the last bridge, its four forges each with a false rule refuted and a last step typed wrong then right,
       the workshop, the dash, the stone) passes at 1366×768, 1024×768, 1840×900 and on a phone held sideways
       (800×370, touch); the pilot's story walk still gives 104. `status:lesson-v2` prints 12 of 15 parts.
       Two defects were seen on screenshots and fixed (the five-slot forge overflowed; a case whose truth is not
       « the bridge holds » was labelled « ثبت »): `forgeParts.jsx › fits, tag`, `kit/ruleForge.css` five slots.
     - DONE since: unit tests for `world/practice`, `trainer`, `sitting`, `journey`, `evidence` (44 tests with the
       forges': every wave has one right gate; every trainer question accepts its solution and refuses a wrong
       answer; a full-mark paper earns every point; every claim sent is re-computed true) — commit `f4040bd0`;
       `status:lesson-v2` printed 13 of 15 parts (missing: the launch-kit family, the board) — 14 of 15 since the
       family below (missing: the board).
     - **PHONE PAUSED (owner, 2026-11-18)**: `phone: false` in both packs; not part of « done ». PHONE DEBT of lesson 2, measured 2026-11-18 at 800×370 touch with the three new walks (`gameworld-qawasim-hub/-sitting/-trainer`): text under the 12 px floor on the map (`.di-map__edge` 9.4 px), progress, trainer tabs, sitting (`.xs-quiet`, `.xs-tip`, answer-sheet `small`); the trainer leaves the screen on pairs / show / rule questions; « تحقّق » covered on pairs questions 5–6; the title screen's door labels cut at the bottom edge. The same three walks PASS at 1366×768, 1024×768, 1840×900 (199 / 142 / 421 checks).
- **STATE 2026-11-18 (second session): lesson 2 prints ✅ on `status:lesson-v2` (phone paused).** DONE: (1)–(2) the
       practice hub, « تدرّب », an exam sitting and « تقدّمي » are PLAYED through their screens by three walks
       (`gameworld-qawasim-hub` 199 checks, `-sitting` 142, `-trainer` 421: they pass at 1366×768, 1024×768 and
       1840×900; they found and fixed: the guide card read the PILOT's strings and crashed on lesson 2's keys, the rule
       tablet opened from the hub lost its node, no sound button on « المعارف » and « تقدّمي », progress rows that
       wrapped off the screen, raw `$…$` in a true / false statement, the sheet's « تحقّق » turning white under the
       mouse); (3) THE BOARD: `board/script.js` (11 stations: a situation, four questions each proved by bridges and
       each followed by its rule's name, two copybook pages), `board/memo.js` (four openings, a 45-minute hour, six
       anticipated answers, three exit questions) and `board` in the pack; the board now reads the lesson's own
       `rules` (it read the pilot's strings), the plank row takes up to six choices, a long tablet shrinks inside
       its card, the copybook splits in two pages (`CLASS_SESSION.md` §5ter); `board/board.test.js` computes every
       number; the walk `class-lesson-qawasim.mjs` passes at the three sizes and the pilot's `class-lesson.mjs` still
       passes. Also found: the walks' « formulas read left to right » check matched NO atom of a `\displaystyle`
       formula (so it could never fail) — fixed in `e2e/lib/walk.mjs`. The gate's `phone` line is paused, not failed.
       DONE since, 2026-11-18 (third part of the same day): (5) the screenshots looked at — student and teacher, the
       list is in the report; (6) « published locally » read from the database (lesson `available`, 8 modules and 50
       exercises `published`, for both lessons); (7) the gate's report: `LESSON_2_GATE_REPORT.md` (real time from git,
       lines written, what was copied from the pilot, one load-sensitive flake of the world walk). The pilot's eight
       walks were re-run after the kit was touched and pass. STILL OPEN, for the OWNER: the old modules and
       `?view=classic` of BOTH lessons (D3 says « goes when the kit does », the contract keeps the modules because the
       reports read them — A4, not traced page by page: deleting is his decision) and his validation of lesson 2; the
       phone debt below.
       MEASURED after the formula check was repaired: the board walk (12 screens) and the hub, sitting and trainer walks
       (199 / 142 / 421 checks) pass at 1366×768, 1024×768 and 1840×900.
     - **Older state, 2026-11-17 (kept for the history): NOT DONE — lesson 2 is not finished:** (1) the trainer, the sittings and the practice hub of lesson 2 were
       NEVER opened in a browser (unit-tested only); (2) the practice hub, « تدرّب », an exam sitting and
       « تقدّمي » walked for lesson 2; (3) `board/script.js`, `board/memo.js` and `board` in the pack — the teacher
       still gets the OLD lesson page; ~~(4) a launch-kit family for `4am.m1.r01`~~ **DONE 2026-11-17** (the owner
       opened lesson 2 and saw an EMPTY kit, 0 / 0): family « قاسم عدد طبيعي » in `launchkit/families.js` (an equality
       with one box, numbers to sort, SENTENCES to sort — a new kind of card; worked example answering the named
       mistake), walk `e2e/launch-kit-qawasim.mjs` (30 checks, four sizes), and the sort gesture now fits a phone
       above its buttons (it lay under them, on the pilot too); (5) screenshots of every
       screen looked at (only the forges were); (6) the old modules are still there (`?view=classic`, « إختبار أولي »);
       (7) the gate's report: real time, lines written by hand, what was copied from the pilot.
     - **Found by the owner playing lesson 2 (2026-11-17), fixed the same day — and what they say about my checks:**
       (a) raw LaTeX under a prediction of the third forge (`$5 \times 5 = 25$`): the kit printed `T.fact` as plain
       text; (b) the store of the last bridge showed the PILOT's numbers inside lesson 2 (756 in the equation, mould
       32 offered, 1850 in the price) — a dead end: the price could never be right; (c) no way out of the store's
       payment step, and the ✕ of the top bar lay under every dialog. **My earlier line « lesson 2's world plays end
       to end (52 checks) » was FALSE for the store**: that walk stopped at the store's door and never played it.
       Now: `GAME_WORLD.md` §2ter-0 (three rules, each with its check); the walk plays the store through its screen
       to the end screen (69 checks at 1366×768, 1024×768, 1840×900 and on a phone); the four world walks fail on
       any raw formula on screen; a unit test keeps the pilot's numbers out of the world's screen. Also found by the
       whole web suite, which had not been re-run since lesson 2 got `phone: true`: a phone could open the teacher's
       memo address of lesson 2, which has no board yet — `phoneLessons.js` now asks for `board` too.
       **Still true: every screen of lesson 2 must be PLAYED through its screen by a walk before the gate** — the
       practice hub, « تدرّب », a sitting and « تقدّمي » are still unit-tested only.
     - **The two hard keys of lesson 2 were REBUILT the same day, on the owner's word** (« each rule has its own
       nature and way of discovery … he suddenly get told the rule », then « free to rebuild this part even with 100%
       different concept … the student never told the rule, he gets the rule himself »). Both forges were the pilot's
       mirror with other tiles; their help ended on a choice of two written rules. Now each opens on an EXPERIMENT of
       its own (`GAME_WORLD.md` « استكشف »): 🔍 « أين نتوقّف » — planks tried in order on the gap he has just crossed
       (36), a plank and its partner crossing on a strip, then 30 and 60 predicted before trying; ⚡ « قواعد القسمة » —
       a chart of gaps, one plank at a time (5, 2, 9, 3), a LENS he chooses and the values he claims, the next hundred
       as the attack; plank 4 by « the same cells light in every hundred ». What he claims on the chart IS his rule:
       no tile after it. The stone's question (252) is no longer asked before he can answer: it opens the search and
       is the last step of the forge. New: `divisorIsles/inquiry.js`, `Inquiry.jsx`, `inquiry.css`, the lesson's
       `world/inquiries.js`; `RuleForge` phase « استكشف ». Walk: 124 checks, both experiments played through their
       screens. **Not validated by the owner yet — and no student has played it.**
       Then, on « not only this one … all the steps of rule discovery », the first two keys too: 🧱 « جداء عاملين »
       — the WALL (his first bridge lifted plank by plank and taken down by columns, then predicted: a bridge that
       held, one that fell, a square one, one he does not see); 🔑 « عدد طبيعي من الألواح » — the SAW (his hand
       slides the plank's length over the gap 31, the cut piece and the quotient live; then four planks judged from
       the quotient alone). Four keys, four kinds (`InquiryMoves.jsx`); no prediction of the old mirror is asked in
       this lesson any more; no help ends on a choice of two rules. Walk: 154 checks.
       Then four corrections of the owner on the chart, the same day: the chart that fills by itself is HEARD (a
       count, the cells that light, a chime — `engine/audio.js › sweep, spark`); it opens on its QUESTION and its GOAL
       in his words (« ما هي الهوّات التي يمكن تشكيل جسر لها باستخدام لوح طوله 5؟ » — « الهدف: معرفة تلك الهوّات فقط من
       شكلها، دون تقسيم طولها في كلّ مرّة »); his claim is laid as a sentence (the lenses in a column, the link — « يساوي » for
       5 and 2, « يقبل القسمة على » and ONE number for 9, 3 and 4 — then the
       values read downwards); every gap tried writes its division `n = q × b + r` and its cell turns GREEN when
       the rest is 0; the forge, which covers the top bar, shows the sound button and the ✕ in every phase
       (`kit/parts.jsx › SoundToggle, ExitLink`). Walk: 178 checks at the four sizes; lesson 1's walk (same forge
       header) 104 at 1366×768 and on the phone. Then two more: the claim reads right to left (the lenses on the
       right, the numbers on the left), and plank 4 is read with a lens of its own, « العدد المكوّن من الآحاد
       والعشرات » — its former side road (« the same cells light in every hundred », long gaps placed on the chart)
       is REMOVED: with that lens « no lens separates » would be false. Walk: 179 checks at the four sizes.
       **Not validated by the owner yet.**
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
  9. [x] LESSON 3 `khawass-qawasim` (خواص قواسم عدد طبيعي) — DONE 2026-11-18, report `LESSON_3_GATE_REPORT.md` (the
     owner's validation and the retirement of the old modules remain). It prints ✅ on `status:lesson-v2`; its six walks
     pass at 1366×768, 1024×768 and 1840×900. Its four keys are FORGED on four NEW investigation kinds added to the kit
     (`join`, `stack`, `peel`, `letters`: `GAME_WORLD.md` « The eight kinds »). Open, for the owner: Euclidean division
     is no prerequisite in the net; the proof key gives no evidence; the dash's sentence types; the 10.5–11.5 px text the
     kit still has at 1024×768 (shared with lessons 1–2).

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

Who does what (owner, 2026-11-17): Fable orchestrates and codes only the 3D and a task judged complicated; the rest of
the code is written by agents on `opus`. No fixed cap on the number of agents; one heavy check at a time until two at
once have been tried in the terminal (root `CLAUDE.md` « Who does what, and working limits »).

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

Rewritten 2026-11-18, after lessons 1, 2 and 3 were finished (Phase 0 is done; phones are paused; the walks run on the
GPU). Paste it as the first message of a new session. For the NEXT lesson after lesson 4, change the lesson id and its
title, and make the reference lesson the most recent one that is done. The earlier prompt (Phase 0, the gate on lesson 2)
is in git history (`git log -p -- docs/reports/LESSON_V2_MASTER_PLAN.md`).

```text
Build lesson 4 of the v2 rollout: `qasim-mushtarak-akbar` (القاسم المشترك الأكبر لعددين طبيعيين), 4AM, unit
aadad-tabiiya-natiqa. Lessons 1 (`qasim-adad-tabii`), 2 (`qawasim-adad-tabii`) and 3 (`khawass-qawasim`) are DONE and
print ✅; lesson 3 is your reference for how a lesson is built on the kit (it also added four investigation kinds to
the divisor-isles world: `join`, `stack`, `peel`, `letters` — reuse them, add a kind only when a rule fits none).

READ FIRST, in this order, before touching anything:
1. CLAUDE.md (the rules that bind every task; phones are PAUSED, laptop and tablet only)
2. docs/reports/LESSON_V2_MASTER_PLAN.md §4ter-0 (live state), §6 (definition of done)
3. docs/architecture/LESSON_V2.md, GAME_WORLD.md (the kit, a world, the forge, « استكشف »), LAUNCH_KIT.md,
   LESSON_LAB.md, CLASS_SESSION.md §5ter (the board)
4. docs/reports/LESSON_2_GATE_REPORT.md and LESSON_3_GATE_REPORT.md — what they took, what had to be copied, what the walks
   found (lesson 3's walks found six real defects no unit test saw: write the walks EARLY and run them at the three sizes
   as soon as a screen exists)
5. the code of lesson 3 (apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/
   khawass-qawasim/: lesson.pack.js, world/, board/) and the kit it stands on (lessons/common/gameworld/kit/)
6. the unit's sources and the learning net for this lesson (docs/curriculum/…, LEARNING_NET.md): the الكفاءات
   come from there; the textbook is the reference, never the script, and never send a student to the book

STEP 0 — the repository: `git status`, `git log -5`. Work on `dev`. Never push and never merge to main without my word.

STEP 1 — design, before any code. Write me a short plan: the lesson's الكفاءات (from the learning net), and for EACH
rule its own way of discovery — a rule that is a search, a pattern or a procedure is FOUND by an experiment made for it
(`forge.inquiry`, « استكشف »), never the same mirror re-skinned, never a choice between written rules, never told.
Say which world mechanic you reuse (the unit's `divisor-isles` unless the lesson needs its own), what the story and
numbers are (own contexts, own numbers, own wording), and the lesson's board (script + memo). STOP and wait for my
« go » on the design.

STEP 2 — build, in this order, one part at a time, testing each:
world content (story, forges, practice ladder, trainer, exam sitting, journey, evidence, knowledge) → pack
(`npm run generate:lesson-index`) → launch-kit family → class test → « مختبري » instrument → board (script.js,
memo.js, a board.test.js that COMPUTES every answer and every number) → docs.
Reuse the kit; fix a kit defect in the kit, never in the lesson. A lesson's content is drawn in code, people only
through KidFigure, respect Islam in every string, money « دج », shapes in the brand blue, a formula never breaks,
an answer is typed in its own shape, nothing scrolls, a card is four lines at most.

STEP 3 — walks. Write the lesson's walks from lesson 3's (world, hub, trainer, sitting, board, launch kit) and PLAY
every screen through its UI. They must pass at 1366×768, 1024×768 and 1840×900 (no phone). Look at the screenshots
with your own eyes, student and teacher, and say which ones you did not look at. The walks check: no raw LaTeX,
no number or word of another lesson, a way out on every screen, formulas read left to right, nothing cut.

STEP 4 — the gate. `npm run status:lesson-v2 -- --lesson qasim-mushtarak-akbar` prints ✅; unit tests, check:lessons,
check:unused, check:unreached, check:format and lint on what you changed pass; publish it locally (lesson `available`,
modules and exercises `published`); write docs/reports/LESSON_4_GATE_REPORT.md (real time from git, lines written,
what was copied from earlier lessons, what failed). Commit `feat(lessons): qasim-mushtarak-akbar — v2`. STOP: I validate it.
Do NOT delete the old modules or `?view=classic` (my decision, still open).

WORKING LIMITS:
- Fable orchestrates; code is written by agents on `opus`, except the 3D and a task judged complicated.
- Walks draw on the GPU by default (e2e/lib/gpu.mjs). Check `uptime` and `free -m` before and after every heavy run;
  one heavy run at a time until I say two at once are allowed; never edit source while a walk runs. If the load or
  memory gets close to freezing the laptop, stop and tell me.
- Every task ends with the docs updated and a « Documentation Sync » section.
- Report honestly: what failed, what you did not check, what you are unsure of. Never « all green » on what you did not run.
```
