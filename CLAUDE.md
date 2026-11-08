# smarter-academy-dz

Arabic-first, RTL mathematics platform for the Algerian curriculum (المتوسط,
starting with 4AM). Lesson content lives in `apps/web/src/lessons/moyen/`;
shared engine in `apps/web/src/lessons/common/`; pure logic in `packages/core`;
API in `apps/api` (Laravel). The lesson content in the repository is fourteen 4AM
textbook units. Since 2026-10-05 unit 14 « الهندسة في الفضاء » (4 lessons + a synthesis, `lessons/moyen/4am/handasa/handasa-fada/`) is the
sixth unit under « ميدان الهندسة » and the first IN SPACE (exact spheres, sections and k / k² / k³ in `packages/core/arithmetic/space.js`;
static 3D figures `SpaceFigure` with hidden lines dashed; live three.js labs on ONE kit `lessons/common/manipulations/space/stage3d/`;
its topic `handasa_fada` was added to the programme file and declared; brief and lock in `docs/sources/4am/unit14/`). Since 2026-10-04 unit 13 « الدوران - الزوايا - المضلّعات المنتظمة » (4 lessons + a synthesis,
`lessons/moyen/4am/handasa/dawaran-mudalaat/`) is the fifth unit under « ميدان الهندسة » (exact rotations, inscribed angles and regular
polygons in `packages/core/arithmetic/rotation.js`, labs in `lessons/common/manipulations/rotation/`, GeoFigure centred `arcs` with `arrow`,
`angles[].arrow`, `circles[].radius`; brief and lock in `docs/sources/4am/unit13/`). Since 2026-10-04 units 11 « الأشعة والانسحاب » and 12 « الأشعة في معلم » (4 lessons + a synthesis each,
`lessons/moyen/4am/handasa/ashia-insihab/` and `…/ashia-maalam/`) are the third and fourth units under « ميدان الهندسة » (exact vectors
in `packages/core/arithmetic/vectors.js`, labs in `lessons/common/manipulations/vectors/`, GeoFigure `vectors`/`grid`/`axes`/`arcs`/`circles`;
one brief and one lock for both in `docs/sources/4am/unit11/`; textbook figures are ANALYSED then reproduced or REDESIGNED, guide §5).
Also since 2026-10-04 unit 10 « حساب المثلثات في المثلث القائم » (4 lessons + its synthesis,
`lessons/moyen/4am/handasa/hisab-muthallathat/`) is the second unit under « ميدان الهندسة » (exact trigonometry with
surds in `packages/core/arithmetic/trigonometry.js`; authors' brief and lock in `docs/sources/4am/unit10/`). Since 2026-10-02 unit 9 « خاصية طالس » (3 lessons + its synthesis,
`lessons/moyen/4am/handasa/khassiyat-talis/`) is the first unit under the programme's « ميدان الهندسة »
(no `placement`; geometry figures are `GeoFigure` data, Thales maths in `packages/core/arithmetic/thales.js`). Since 2026-10-02 unit 6 « الدالة الخطية والتناسبية » (5 lessons + its synthesis,
`lessons/moyen/4am/tanasubiya_duwal/tanasubiya-dala-khattiya/`) and unit 7 « الدالة التآلفية » (5 lessons + its synthesis,
`…/tanasubiya_duwal/dala-taalufiya/`, the same day) and unit 8 « الإحصاء » (4 lessons + its synthesis,
`…/tanasubiya_duwal/ihsa/`, the same day; programme domain « ميدان تنظيم المعطيات ») sit under « ميدان التناسبية والدوال »,
a DISPLAY ميدان decided by the owner (`units_4am_2026_2027.json › ownerChapters`; the programme file is
untouched and each unit declares its programme domain in `placement`). The other five are units of
ميدان أنساب الأعداد والحساب: « الأعداد الطبيعيّة والأعداد
النّاطقة » (9 lessons), since 2026-09-30 « الحساب على الجذور » (5 lessons + its synthesis,
`…/hisab-judhur/`) and, since 2026-10-01, « الحساب الحرفي » (3 lessons + its synthesis,
`…/hisab-harfi/`, placed under this ميدان by the owner) and, the same day, « معادلات ومتراجحات
من الدرجة الأولى بمجهول واحد » (4 lessons + its synthesis, `…/muadalat-mutarajihat/`, placed likewise) and
« جمل معادلتين من الدرجة الأولى بمجهولين » (3 lessons + its synthesis, `…/jumal-muadalatayn/`, placed likewise).
Since 2026-10-06 the practice space of every
lesson is being converted, unit by unit, to the BEM « exam sheet » (prototype `bahth-pgcd`; corpus index
`docs/sources/4am/bem-practice/annals-index.md`; a lesson switches when listed in `content/practice/exam-style.json`;
contract `docs/architecture/EXERCISE_CONTRACT.md` § « Présentation examen (BEM) »). The French-era
lessons (`lessons/college/`, `lessons/lycee/`) and the French reference
catalogue were **deleted on 2026-09-25** — older docs that cite them describe
code that no longer exists.

Unit 1 is the **pilot unit**: rules are tried there, then extended. Three unit-1 rules — values woven into story contexts
(2026-10-10), the « discover, don't be told » pass on module text (2026-10-09) and the synthesis with six training situations
(2026-10-13) — were **extended to units 2–14 on 2026-10-13**; every synthesis lesson now has modules 1–6 « وضعيات تدريبية » and
every `ContentModule` has `objectives` for the Classroom Mode entry slide. Report: `docs/reports/UNIT1_REFERENCE_CHANGES_2026-10-13.md`.

Since 2026-11-03 the pilot lesson `qasim-adad-tabii` tries the **student « focus » view** (owner: Gen Alpha reads little):
- `studentView: 'focus'` in its config makes the student see only what they need now: one step on screen, the lesson home reduced
  to title + progress + « واصل », and details behind « المزيد » (`MoreToggle`, `lessons/common/components/StudentFocus.jsx`).
- The teacher and Classroom Mode are unchanged.
- **Reduce what shows at once, never delete** (owner, 2026-11-04): whatever leaves the student's screen stays reachable.
- If the owner validates it, it is rolled out lesson by lesson. Rules and checklist: guide §4sexies; numbers:
  `docs/reports/STUDENT_FOCUS_VIEW_2026-11-03.md`.
- Since 2026-11-04 the same lesson tries the **mission mode** (`studentView: 'mission'`, implies focus): the lesson is a journey
  toward its « مسألة الدرس » (opening scene, tools = knowledge items, mission bar, map with the real lock, one checkpoint between
  modules). It is built on the student's normal pages, NEVER on Classroom Mode. Stage 2 (same day): the lesson plays in a
  full-window player with **no scrolling anywhere** (owner rule): one unit per screen, tall units paged (`ClassroomPaged` via
  `PagingContext`, not Classroom Mode), last-resort fit by zoom; no « المزيد » in the player (every block has its own screen). Since 2026-11-07 its first view lists the lessons to revise first (« راجع قبل أن تنطلق », one-click return), and « أستعدّ » opens on a 5 s message then goes question to question by itself. « أستعدّ » v2 (same day): 10 platform questions from very easy to harder, a ✓ / « سنعود إليه » signal per question (never the answer), « غير متأكّد », 1 s undo, a one-screen review with ONE priority lesson to revise (guide §4septies). Lab questions v2 (same day, council): a column beside the pitch (no shade), predict → observe by tapping → build the equality, the trials table inside the lab instead of « رتّب أفكارك », stars for predictions. Saving (same day, council): the student's in-lesson answers are restored, synced and private (`student_lesson_answers`, `GET/PUT /lessons/{code}/answers`, student only, never evidence), and the rule written in « أتوقّع القاعدة » becomes a « قاعدتي » note in « كرّاسي » that the teacher may read. Competitor review (2026-11-08, council): a struggling student gets a smaller practice round in the lab (« لا بأس — جرّب أصغر », `easier` on a round) and module 2 ends with « ورقة زميل » (`kit/PeerSheet.jsx`: find and fix an invented classmate's error); the knowledge map is totally open from the start (`knowledgeMapOpen: true`; coins and « أتوقّع القاعدة » still read `learnedItems`) and reachable from the mission bar (« 🧠 بطاقتي » opens it full-screen, « 📓 كرّاسي »). « إختبار أولي » plays like « أستعدّ » in the player (5 s notice, one question per screen, automatic result, optional timer). Since 2026-11-08 the knowledge map is ONLY the interactive mind map in every lesson: the old stratified presentation was deleted (`KNOWLEDGE_MAP.md` Part B). **The owner VALIDATED the pilot on 2026-11-08: every change on it is now BINDING for other and new lessons** and is rolled out lesson by lesson (`docs/reports/MISSION_ROLLOUT_PROGRESS.md`; plan `PILOT_PROTOTYPE_ROLLOUT_PLAN_2026-11-08.md`). First converted lesson: `qawasim-adad-tabii` (2026-11-08, lab `factor-pairs`; scene registry `mission.scene`, guide § « Rollout recipe »). In the player a lab is played as ROUNDS with 1–3 ★
  (`manipulations/rounds/LabRounds.jsx`) instead of مبتدئ / متقدم, and this lesson uses only the football lab.
  Guide §4septies, plan `docs/reports/MISSION_PLAYER_PLAN_2026-11-04.md`; the rollout to all lessons (after validation):
  `docs/reports/PILOT_PROTOTYPE_ROLLOUT_PLAN_2026-11-08.md`.

Since 2026-10-13 the **learning net « شبكة الكفاءات »** covers the WHOLE cycle moyen (1AM–4AM): the official
programme of the four years as data (224 items transcribed from `docs/Math-Moyenne-programme/`, stable ids
`<g>am.m<مقطع>.r<nn>`), typed links between items (`requires` / `extends` with its added value / `consolidates` —
the no-duplication rule), the PLANNED 1AM–3AM lessons (codes, units, items — no content), and each 4AM lesson's
`programmeItems` (`packages/core/curriculum/dz/net/`, contract `docs/architecture/LEARNING_NET.md`, generated map
`docs/curriculum/LEARNING_NET_MAP.md`). Every « أستعدّ » shows « راجع قبل أن تنطلق » from the net. The resolver is
imported by path or by `import()`, never from the core barrel.

Since 2026-10-14 (rollout phase 2) **1AM, 2AM and 3AM are active grades**. Their 196 lessons (39 units, 523 draft
الكفاءات) are catalogue entries `coming_soon` in `dz/{lessons,units,programme}_<g>_2026_2027.json`:
- in the UI: non-clickable « قيد الإعداد » cards, and `getLessonPath` gives `null`;
- in the database: imported `draft`, with all their LPs, ignored by Mastery V2 (`LEARNING_NET.md` §3bis).

A 1AM–3AM lesson is generated INTO its entry (contract §4), then **published = status `available` + export/import +
commit + push to `dev`** (owner decision; guide §11 « Publish a lesson »). A wrong answer shows « راجع: <درس> (<السنة>) »
toward earlier years (`features/learning/EarlierYearReview.jsx`). Practice modelled on the 1AM–3AM term exams uses
`source.type: "term_exam"` / `term_exam_modelled` and the badge « على منوال اختبار الفصل … » (`EXERCISE_CONTRACT.md`).

Since 2026-10-14 (rollout phase 3) the 1AM–3AM lessons are **generated one by one along `docs/curriculum/GENERATION_QUEUE.md`** and each
is published on `dev` before the next; progress and the next batch's prompt: `docs/reports/MOYEN_ROLLOUT_PROGRESS.md`. Since 2026-10-20 the queue
opens with **Phase A « what 4AM needs NOW »** (owner): 4AM units in textbook order, each lesson's DIRECT earlier-year prerequisites taken from
the most recent year (3AM, otherwise 2AM, otherwise 1AM) — 35 entries; the full chains come after (`LEARNING_NET.md` §4bis). A unit's extraction is
written whole (`docs/sources/<g>/unit<N>/`), elements of lessons not yet generated are « pending » in `check:textbook`; the textbook's tape
diagram « مخطط بأقواس » is the shared figure `ArcTape` (statement figure `kind: 'tape'`). Owner rule: a generated lesson is also imported
and its modules/exercises published in the LOCAL database so the owner can browse it. **Nothing generated stays `draft`** (owner,
2026-10-26): every lesson, module and exercise you generate must end `published` — never leave a `draft` module or exercise behind
(guide §11 « Publish a lesson », step 4).

Since 2026-11-01 (phase 1 of 7) the student space has **« مختبر التفكير »**, the thinking space at `/espace/tafkir`. It is a ladder of
NUMBERED challenges outside the curriculum: the band, primary → university, is hidden, and every challenge is `content/thinking-lab/challenges/*.json`.
- **The student tries first.** The server alone grades (`AnswerChecker.php`: the `expression` check is a safe parser written in
  JS and PHP over one shared fixture), counts only honest attempts, opens one key per attempt, and opens the replay of a
  mathematician's thinking after 3 attempts + 24 h (primary band: no wait).
- **Nothing of the answer reaches the client before that gate** (`ChallengePresenter`, `ThinkingLabLeakTest`).
- **Content follows the pipeline** schema → `validate:thinking-lab --strict` (in `check:lessons`) → oracle → server-only
  generated index. Figures are SVG components in `features/thinkingLab/figures/`.
- **Teachers get a read-only preview** (`/enseignant/tafkir`, owner 2026-10-31): everything open, the answer and the replay visible, an
  answer to test, nothing written (`THINKING_LAB.md` §8bis).
- Build plan, phases 2–7: `docs/reports/THINKING_LAB_PLAN_2026-10-30.md`. Contract: `docs/architecture/THINKING_LAB.md`.

Since 2026-10-17 the platform has a **printed-books store** (`/books`, `/books/:slug`, admin « الكتب » at `/admin/livres/*`): orders WITHOUT online
payment, delivery fee set later by the admin, payments recorded as lines; the first book is « بروتوكول SMART » (`BookSeeder`, slug
`smart-protocol`). Contract: `docs/architecture/BOOKS_STORE.md`.

Since 2026-10-26 a **school is a first-class object** with its **director** (« فضاء الإدارة », `/idara`, role `school_admin`,
created ONLY by the platform admin in « المؤسسات » `/admin/etablissements` with a one-time password). Owner decisions: the school buys a
licence of seats, the director may enrol students directly (the student confirms), one role (the director), teacher activity shown as
facts the teacher sees too, a student without e-mail gets a generated school login. The school reads a student only through `SchoolAccess` (active member of an active class of that school
WITH `school_consent_at`), never an e-mail, never an average; every new `/school` read joins `SchoolPrivacyContractTest`. Phases 0–7 are
built (structure: terms, teachers by link + « مؤسستي » — since 2026-10-28 joining by the link attaches all the teacher's active classes, with the students who accepted the class sharing text that announces it, classes, roster import with generated « معرّف الدخول » (no mail ever sent to it),
transfer, login cards; tracking: the الكفاءات map class by class as COUNTS, the student file = the parent's « التقدّم بالتفصيل », no study
time; reports FROZEN as snapshots, A4 print, CSV built in the browser; the meeting view `/idara/ijtimaa/:id` with « إخفاء الأسماء »);
and the school LICENCE (model C: access reason `school_licence` before `teacher_subscription`; a covered class uses the school's seats). Contract: `docs/architecture/SCHOOL_ADMIN_SPACE.md`.

Since 2026-10-22 the platform answers parents' fear of an open laptop (« فضاء الوليّ »).
It works in three layers and claims nothing more, because a web page cannot block other sites:
- since 2026-10-23 the parent needs **NO account** (owner): they read through « رابط الوليّ », a private link `/w/:token`. The student creates it
  after consenting in « حسابي » (share sheet, copy, or a QR on screen), or the teacher prints it as a QR on « بطاقات الأولياء ». An optional
  4-digit parent code protects it. The parent reads ONE week report, the same one the student sees at « ما يراه وليّك »: REAL study time measured
  on the platform's own pages (active / idle / away, bounded server-side), exercises, lessons and الكفاءات. The `parent` account (`/wali`)
  is kept in code but is no longer self-registerable;
- a public device-lock guide `/himaya`;
- a closed-garden test that keeps every external link out of the student space.
Since 2026-10-23 the parent also has « التقدّم بالتفصيل »: the whole year lesson by lesson, the الكفاءات that need support and the activity timeline,
shared with the student too, on the link page as well. The parent pages are phone-first. Contract: `docs/architecture/PARENT_SPACE.md`.

## Read before any task

- `docs/README.md` — the documentation map: which document is authoritative
  for what, and which ones are historical.
- `docs/lessons/LESSON_DEVELOPMENT_GUIDE.md` — the entry point before creating
  or modifying a lesson, a module, a manipulation or an exercise.
  Its §14 is the lesson reference architecture, **frozen for generation on
  2026-09-29**: a generated lesson implements that contract and reuses that
  architecture — never a parallel one.
- `docs/architecture/MANIPULATION_DNA.md` before designing or redesigning a
  manipulation: the student's hand must control a mathematical variable, and
  the platform must not converge toward one manipulation style.
- The contract that governs the area you touch (`docs/architecture/*.md`).
- `docs/architecture/BUNDLE_BOUNDARIES.md` before adding a provider, a route,
  a heavy dependency, an `import.meta.glob` or an i18n namespace — it says
  what may enter the entry bundle and where lazy boundaries sit.
- The entry bundle has a budget (245 KB gzip since 2026-10-26 — it was 330 before the catalogue left the entry, measured 233.1 — `npm run check:entry-budget`, CI; no entry module may import a catalogue name: use `utils/gradeSummary.js`): lessons are mounted by ONE lazy
  route boundary fed by the generated `lessons/lessonIndex.generated.json` (run `npm run generate:lesson-index` after
  adding a lesson or changing its modules — never touch `App.jsx`), lab strings live in
  `i18n/locales/ar/lesson.manipulation.json`, unit maths are imported by path, not from the core barrel
  (`BUNDLE_BOUNDARIES.md` §3–§4, since 2026-10-14).
- **The textbook is the REFERENCE of the الكفاءات, not the script of the lesson** (owner, 2026-10-14): the entry point,
  examples, contexts and order of ideas are designed by the platform (the book's activity is one candidate, often posed
  later as an application), and every module is ONE track — the action (lab) at the top with nothing above it, then
  questions on what the student did, then the name (`LESSON_DEVELOPMENT_GUIDE.md` §4ter–§4quinquies; reference
  `kitabat-adad-tabii`, validated; applies to every new lesson; existing lessons: `docs/reports/LESSON_METHOD_RETROFIT.md`).
- **Supported screens: tablet and laptop only (owner, 2026-10-15)** — widths ≥ 768 px (768×1024, 1024×768, 1280×800, 1366×768, 1920×1080). Phones are NOT supported: do not design, tune or test for phone widths (320–430 px); older mentions of them below are superseded.
  **Enforced (owner, 2026-10-27):** lessons and exercises are behind `components/auth/RequireLargeScreen.jsx`; a phone sees « محتوى الدروس يظهر فقط في شاشة الحاسوب … » instead (guide, « Supported screens »).
  **Exception (owner, 2026-10-17): the printed-books pages `/books` and `/books/:slug`** are opened from WhatsApp on phones —
  they are designed and tested mobile-first for conversion too (`docs/architecture/BOOKS_STORE.md` §4).
  **Exception (owner, 2026-10-23): the parent pages — the link page `/w/:token`, `/wali/*` and the guide `/himaya`** — are opened
  from WhatsApp or a QR on phones. They are designed phone-first and tested at 390×844 and 1366×768
  (`docs/architecture/PARENT_SPACE.md` « Screens »).
  **Exception (owner, 2026-10-22): « فضاء الألعاب », the game space `/espace/jeux`** is played on phones AND laptops — designed and tested at
  390×844 and 1366×768 (`docs/architecture/MADAR_GAME.md` §11). Since 2026-10-23 it has two families:
  - « ألعاب رياضيات » (« قنّاص القيم », « الدخيل », « الحساب الذهني »), shown FIRST: free, the maths is the gameplay. They have 50 levels × 3 sub-levels covering
    1AM–4AM. They NEVER start hard (owner): each game opens with a free warm-up round two levels below the student, then the
    level rises progressively and adapts every round (`MADAR_GAME.md` §16);
  - « ألعاب ترفيهية » (the orbit runner, « دفاع الكوكب », the « المستكشف » platformer), below: their hearts are earned in the
    « محطة التزوّد » (correct answers on the student's own الكفاءات).

  The teacher closes a game for the class or for one student, and can PLAY with each class (« نافس أستاذك »: one score per class,
  name in that class's ranking with a « الأستاذ » badge, no hearts, never learning evidence — `MADAR_GAME.md` §18).
  Finishing a lesson unlocks NOTHING in the game (owner).
- **INDEPENDENCE FROM THE BOOK** (owner, 2026-10-15, CRITICAL): the platform is self-sufficient. Read the textbook, analyse it, get the idea, then
  GENERATE YOUR OWN content — own boxes, own contexts, own numbers, own wording. Never copy the book's text to the student and never write a
  student-visible line that sends them to the book (« الكتاب ص 55 », « اقرأ ما يقوله الكتاب », « تمارين من الكتاب »); `SourceTag` is muted for
  students (`LESSON_DEVELOPMENT_GUIDE.md` §4ter-bis).
- **The lab prototype goes to EVERY lesson — rollout DONE (112/112) and now BINDING on every NEW lab and lesson** (owner, 2026-10-28; a generated lesson is not done until `lab-rollout-status.mjs --lesson <id>` prints ✅; `LESSON_DEVELOPMENT_GUIDE.md` §6ter): questions OVER the lab after each step (mandatory for students; a teacher
  may switch them off for his own account), a clear stepper and a success celebration, game sounds (off by default, a « الصوت » switch in
  every lab), « إعادة » that restarts everything, full screen in every lab, and the end-of-module card as a memo sheet with its timed
  challenge « اختبر ذاكرتك ». Ground truth, batches of 20 lessons and per-session prompt: `docs/reports/LAB_PROTOTYPE_ROLLOUT.md`;
  status: `node apps/web/scripts/lab-rollout-status.mjs`.
- **Every manipulation has the onboarding** (owner, 2026-10-14): `LabCoach` — at each moment a ring + one-sentence bubble on the button or
  gesture needed now, shown once, hidable, re-summonable; same design in every lab, every lesson, every grade
  (`MANIPULATION_CONTRACT.md` §8quater, `MANIPULATION_DNA.md` §17.11; rollout and its prompt: `docs/reports/LAB_COACH_ROLLOUT.md`).
- **Respect Islam in every generated string, icon and emoji** (owner, 2026-10-26): never use the pig (🐷 — a piggy bank is drawn as 💰/a money box),
  alcohol, gambling (cards, dice as a game, casino, lottery), usury/interest, pork, non-Islamic festivals or religious symbols, or any word or
  situation that touches them — in lesson text, contexts, problems, bank sheets, icons and badges. Use neutral Algerian everyday contexts.
  Checked by `LESSON_DEVELOPMENT_GUIDE.md` § « Cultural and religious respect ».
- Terminology: a learning point is « الكفاءة / الكفاءات » in every visible
  string since 2026-10-05 — never « نقطة التعلّم / نقاط التعلّم »; identifiers
  (`learningPoint`…) are unchanged (`docs/architecture/ARABIC_RTL_CONTRACT.md`).

## DOCUMENTATION SYNCHRONIZATION RULE (permanent, applies to every prompt)

For every development task — feature, bug fix, refactor, architectural change,
UI change, lesson change, exercise change, interaction change, or any other
meaningful modification — you MUST first determine whether the change affects
any documentation, and if it does, update the relevant `.md` files as part of
the SAME task. Documentation is not an optional final step, and the user must
never have to ask for it.

The implicit workflow of every development prompt in this repository is:

1. Read the relevant existing documentation.
2. Read the relevant current implementation.
3. Implement the requested change.
4. Determine what documentation is affected.
5. Update the relevant `.md` files.
6. Verify documentation consistency with the implementation.
7. Run the relevant tests.
8. Report the documentation changes in the final response.

Before considering a task complete, verify:

1. Did this change modify or introduce an architecture?
2. Did this change modify an existing component/API/contract?
3. Did this change introduce a new reusable pattern?
4. Did this change modify lesson-generation rules?
5. Did this change modify pedagogy or interaction rules?
6. Did this change modify UI/UX conventions?
7. Did this change modify RTL/Arabic rules?
8. Did this change modify exercises, progression, mastery, or student behavior?
9. Did this change modify Classroom Mode?
10. Did this change introduce a new testing requirement?

If YES to any of these, update the appropriate documentation immediately. Even
when the answer appears to be NO, briefly verify that no documentation is
affected before finishing.

- NEVER leave the repository documentation knowingly outdated after a
  meaningful architectural or behavioral change.
- Do not create unnecessary documentation for trivial changes. Use judgment.
- Always use the CURRENT CODE as the source of truth; never document behavior
  that is not actually implemented. Mark planned behavior `Planned` or
  `Not yet implemented`.
- If a new reusable pattern is introduced, document it so future developers
  and AI agents reuse it instead of creating another one-off implementation.
- Prefer updating the existing authoritative document over creating a new
  file. When two documents would define the same contract, one is
  authoritative and the other links to it.
- At the end of every task, include a short **"Documentation Sync"** section
  in the final report stating which `.md` files were updated and what was
  documented — or, if no documentation was required, why the change does not
  affect the documented architecture/contracts.

### Lesson-generation documentation rule

Whenever a task creates, modifies, or establishes a pattern that could be
reused in future lessons — a lesson structure, module pattern, activity
pattern, question type, manipulation or reusable manipulation behaviour,
exercise type, feedback pattern, `KnowledgeBrick` usage, progression
behaviour, Classroom presentation pattern, Arabic/RTL convention, responsive
interaction pattern, or reusable lesson component — the relevant
lesson-development documentation (`docs/lessons/LESSON_DEVELOPMENT_GUIDE.md`
and the contract it points to) MUST be updated in the same task. Future
lesson-generation agents must be able to learn the correct pattern from the
documentation without reverse-engineering old lessons.

## Images — where they may and may not be generated

### Lesson content: drawn in code, never generated

Everything under `apps/web/src/lessons/` — and `manipulations/` above all — is
drawn in code: inline SVG and styled DOM, parameterised by props, unit-tested,
with Arabic as live DOM text. There is not one raster image in the tree, and
that is deliberate.

**Never generate a raster image (`cf-image`, or any diffusion model) for lesson
content.** If a manipulation needs a new visual, extend its SVG. Four reasons:

1. **It must react.** A shelf re-shelves 420 books while the student drags its
   bookend; a player shakes when a full team refuses it. A flat JPG takes no
   props. See the hand-drawn book at `manipulations/primitives/BookFigure.jsx`
   and the shelf in `manipulations/divisibility/DivisorExplorerBooks.jsx`.
2. **Arabic.** Diffusion models mangle Latin text and cannot render RTL Arabic
   at all. Labels like `رفّ ناقص` are DOM text so they stay correct and selectable.
3. **Determinism.** `logic/bookshelf.test.js` asserts on computed geometry.
   Generated output differs every run.
4. **Mathematical truth.** A generated "10 books on a shelf" may show 9 or 11.
   When the drawing *is* the divisibility argument, that is a wrong lesson.

> Le dessin n'est pas une illustration — il se LIT.
> See `docs/architecture/MANIPULATION_CONTRACT.md`.

**People are one shared character, `primitives/KidFigure.jsx`** (owner, 2026-10-14): boys in a hoodie, **girls always in
Islamic dress** (hijab draped over the shoulders + long tunic — no uncovered-hair style exists); the crown sits exactly on the
child's height. Never draw a person locally. Rules and cast: `docs/lessons/LESSON_DEVELOPMENT_GUIDE.md` §6 « People are the
platform's CHARACTERS »; the lab visual kit around it: `MANIPULATION_CONTRACT.md` §8ter.

**Every manipulation is built to the LIMIT of what you can produce for Gen Alpha (11–13)** (owner, 2026-10-14, every
generation): a lab that merely works is not done. The quality bar — drawn world, shared kit, physical gestures, visual feedback that
never states the rule, one screen at the tablet and laptop sizes, screenshots reviewed with the eyes — is `docs/architecture/MANIPULATION_DNA.md` §17.
A lab opens on NO title: the context in one or two plain sentences, then ONE direct question naming the goal and the end state (§17.9).

### Marketing and shell surfaces: generation is fine

Homepage hero, OG/social cards, blog headers, empty-state art, print covers —
anything outside `lessons/`.

- **`prompt-to-design`** — preferred. Deterministic, real typography, free, and
  the output is reproducible from a committed script.
- **`cf-image`** — only for photographic or illustrative art, and only when the
  image carries **no Arabic text**.

### Showing the product: real captures, never generated screens

When a marketing page shows what the student does (the `/methode` scroll
journey), it shows the REAL lesson screens, captured by Playwright with a
simulated session — `apps/web/scripts/capture-methode.mjs` (lesson
« التعرّف على قاسم لعدد طبيعي », football lab: 15 players in 3 teams, then 16
and one left out) then `apps/web/scripts/crop-methode.py` →
`apps/web/public/images/methode/lesson/*.webp`. The copy beside each capture
describes only what that lesson really does; if the lesson changes, re-run both
scripts and re-read the story strings (`marketing.json › method.steps.*.story`).
The page uses NO generated image at all (owner decision, 2026-10-07): hero and
summit are typographic — simple and professional.

Station 09 « إختبار أولي » (2026-10-08) is a regular station in the third act:
`public/images/methode/lesson/test.webp` is the real module `itqan` of
`qasim-adad-tabii` (the lesson's five-question test). Station 10 « الإتقان » is
the only dark block (trophy, amber): `exercises.webp` is a real exam sheet
(level 1 of the same lesson, `/espace/pratique/<lesson>`), followed by the five
levels. Both captures were taken with a temporary student token from the local
API (`createToken`, deleted afterwards — no script committed) and cropped like
the others. The five level names come from `student.json › practice.levelNames`
and are copied into `marketing.json › method.exercises`. Station 10's copy claims
« 50 تمرينًا في كل درس » (verified: all 74 lessons hold 10 exercises per level)
and « امتحانات BEM من دورة 2007 إلى دورة 2025، أو على منوالها » — the corpus
range, not each lesson's own source (items are labelled « على منوال BEM <année> »
or official).

### OG share cards

`scripts/og-card.py` renders branded share cards with correctly shaped Arabic
(Cairo, via Pillow + raqm). Use it rather than generating cards:

```bash
python3 scripts/og-card.py "عنوان الدرس" --eyebrow "الرياضيات · 4 متوسط" -o card.png
```

The **site-wide** card is `apps/web/public/og-image.png` (1200×630), served
at `https://smarter-academy.com/og-image.png` and named by static `og:*` /
`twitter:*` tags in `apps/web/index.html`. Keep those tags static HTML with an
absolute URL — share crawlers never run React — and keep the PNG under
~300 KB (it is 256-colour for that reason): WhatsApp drops heavier previews.

### The logo

Since 2026-10-21 the brand mark is an **open ring holding an isometric cube** (owner's choice; it replaced the star + figure +
book emblem). Every logo file — `apps/web/public/brand/*`, favicons, PWA icons, `email/logo.png`, `og/smarter-academy.png` —
is generated by `python3 scripts/brand/build-logo.py`; never redraw or re-crop it. Usage rules: `docs/architecture/BRAND.md`.
