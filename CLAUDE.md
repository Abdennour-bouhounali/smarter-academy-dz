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
is published on `dev` before the next; progress and the next batch's prompt: `docs/reports/MOYEN_ROLLOUT_PROGRESS.md`. A unit's extraction is
written whole (`docs/sources/<g>/unit<N>/`), elements of lessons not yet generated are « pending » in `check:textbook`; the textbook's tape
diagram « مخطط بأقواس » is the shared figure `ArcTape` (statement figure `kind: 'tape'`). Owner rule: a generated lesson is also imported
and its modules/exercises published in the LOCAL database so the owner can browse it.

Since 2026-10-17 the platform has a **printed-books store** (`/books`, `/books/:slug`, admin « الكتب » at `/admin/livres/*`): orders WITHOUT online
payment, delivery fee set later by the admin, payments recorded as lines; the first book is « بروتوكول SMART » (`BookSeeder`, slug
`smart-protocol`). Contract: `docs/architecture/BOOKS_STORE.md`.

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
- The entry bundle has a budget (330 KB gzip, `npm run check:entry-budget`, CI): lessons are mounted by ONE lazy
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
- **INDEPENDENCE FROM THE BOOK** (owner, 2026-10-15, CRITICAL): the platform is self-sufficient. Read the textbook, analyse it, get the idea, then
  GENERATE YOUR OWN content — own boxes, own contexts, own numbers, own wording. Never copy the book's text to the student and never write a
  student-visible line that sends them to the book (« الكتاب ص 55 », « اقرأ ما يقوله الكتاب », « تمارين من الكتاب »); `SourceTag` is muted for
  students (`LESSON_DEVELOPMENT_GUIDE.md` §4ter-bis).
- **Every manipulation has the onboarding** (owner, 2026-10-14): `LabCoach` — at each moment a ring + one-sentence bubble on the button or
  gesture needed now, shown once, hidable, re-summonable; same design in every lab, every lesson, every grade
  (`MANIPULATION_CONTRACT.md` §8quater, `MANIPULATION_DNA.md` §17.11; rollout and its prompt: `docs/reports/LAB_COACH_ROLLOUT.md`).
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
