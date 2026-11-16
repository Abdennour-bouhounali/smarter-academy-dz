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

## 3. Decisions the owner must take before Phase 0 ends

Each has a default; the work proceeds on the default unless he says otherwise.

| # | Question | Default |
|---|---|---|
| D1 | « AM lessons » = 4AM? | **DECIDED (owner, 2026-11-16): yes** |
| D2 | One game world per lesson, or one world per UNIT with one island (mechanic) per lesson? | **DECIDED (owner, 2026-11-16): one world per unit; a lesson that needs its own world gets its own.** The reason for a separate world is written in the lesson's pack |
| D3 | When a lesson is converted, is its mission player (`?view=classic`) kept? | Kept only for « إختبار أولي » until the kit carries it, then removed |
| D4 | Billing pages (§2.4): delete or keep? | Delete; git keeps them |
| D5 | Do prerequisite lessons of 1AM–3AM get the full v2, teacher side included? | Yes, as instructed |
| D6 | Is the pilot's v2 now BINDING (docs say « not validated »)? | Yes: his message is the validation |
| D7 | Three of the pilot's four rules are still told, not forged. Finish the pilot first? | Yes, in Phase 0: the reference must be complete |
| D8 | Do v2 lessons open on phones? | Student side yes, teacher side no. A first pass is on the pilot (`GAME_WORLD.md` § « On a phone »); the owner tests it on a real phone, then it becomes a requirement of the kit or not |

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
| B3 | **The entry bundle is full**: 242.7 KB of 245. The navigation rebuild and the tokens need room first | `check:entry-budget` |
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
- **Phase 0 step 2 — formatter DONE, linter NOT**: Prettier (`.prettierrc.json`, 120 columns) with `npm run format:v2`
  and `npm run check:format` (in CI). The pilot's areas are formatted: 109 files; `features/classSession/` went from
  2,229 lines to about 6,300 — its real size. After it: web tests, the seven laptop walks and the phone world walk give
  the same results as before. ESLint and the unused-export tool are still to add. A new area enters the two scripts when
  its code is written or rebuilt; the rest of the tree is formatted lesson by lesson, never in one sweep.
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
- **Bundle.** Entry is 242.5 KB of a 245 KB budget. Every kit module stays behind the lesson's lazy boundary.
- **No real student has been timed** on the pilot's full path. One timed session before lesson 5 is worth more than any
  review.

---

## 9. Prompt for the next session

> Read `docs/reports/LESSON_V2_MASTER_PLAN.md` and `docs/curriculum/V2_ROLLOUT_ORDER.md`. Ask me the decisions D1–D7 of
> §3 in one question, then start Phase 0 (§4) at step 1. Work step by step, commit after each step when I say so, and
> report the measured time and line count after lesson 2.
