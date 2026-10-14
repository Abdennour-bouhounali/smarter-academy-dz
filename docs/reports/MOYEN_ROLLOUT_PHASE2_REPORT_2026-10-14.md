# Cycle moyen 1AM–3AM rollout — phase 2 report (platform and database)

**Date:** 2026-10-14. **Branch:** `feat/moyen-phase2`, fast-forwarded into `dev` and pushed (CI only; nothing deployed).
**Scope:** `MOYEN_ROLLOUT_PHASE1_REPORT_2026-10-13.md` §4 « Phase 2 », items 4.1–4.7. **No lesson was generated.**
**Contracts updated:** `docs/architecture/LEARNING_NET.md` (§2, §2.4, §3, new §3bis, §4, §6–§8) is the authority for
everything below.

## 1. Owner decisions

D1–D11 from the phase-1 report still bind. Added on 2026-10-14:

| # | Decision |
|---|---|
| D12 | **« Publish » a lesson = push to `dev`** (CI only). The owner reviews `dev` and promotes it to `main` (production deploy) when they choose. The exact sequence is in `LESSON_DEVELOPMENT_GUIDE.md` §11 « Publish a lesson ». |

## 2. What phase 2 produced

### 4.1 Catalogue files per grade

- `packages/core/curriculum/dz/{lessons,units,programme}_{1am,2am,3am}_2026_2027.json` were written, in the 4AM
  shape, from the net's planned entries: same codes, same items, same order. The one-off migration script stayed out
  of the repo; the field mapping is documented in `LEARNING_NET.md` §2.4.
  - 1AM: 14 units, 69 lessons (55 + 14 syntheses), 175 draft الكفاءات.
  - 2AM: 12 units, 65 lessons (53 + 12), 168 draft الكفاءات.
  - 3AM: 13 units, 62 lessons (49 + 13), 180 draft الكفاءات.
  - **196 lessons, 523 الكفاءات, all `status: "coming_soon"`, `decisionStatus: "draft"`.**
- `prerequisiteLessonCodes` come from the net: the home lessons of each lesson's review links that **precede** it.
  Same-year « renvois en avant » are excluded. A synthesis lists the lessons of its unit.
- `programme_<g>` is minimal. It has three ميادين, titled from the official domains: « ميدان الأنشطة العددية »,
  « ميدان الدوال وتنظيم المعطيات », « ميدان الأنشطة الهندسية ». Their topics are the grade's مقاطع.
- **The net no longer has `plannedUnits` / `plannedLessons`.** The resolver reads the four catalogue files
  (`LESSON_FILES` / `UNIT_FILES`, new export `UNITS`). The regenerated generation queue is **byte-identical**
  (196 lessons, A 108 · B 35 · C 22 · D 23 · E 8), so the migration changed no semantics.

### 4.2 `coursesData` and the four grades

- `coursesData.js` builds 1AM → 4AM from `DZ_MOYEN_GRADES`, and `activeGrades.js` activates `1am`, `2am`, `3am`.
- Grade-dependent surfaces, all checked:
  - **Grade choice:** `lessonCount` now counts published lessons only, so 1AM–3AM show « قريبًا · البرنامج قيد الإعداد ».
  - **Catalogue:** `CatalogueBrowser` opens a draft grade with « البرنامج متوفّر، الدروس قيد الإعداد ». Unit cards show
    « قيد الإعداد » instead of `0/N`. Lesson tiles were already non-clickable « قريبًا / قيد الإعداد ».
  - **Unit page:** each lesson is a dashed draft card with its الكفاءات, no progress, and a disabled « قيد الإعداد »
    button.
  - **Teacher defaults:** the catalogue and new-class form open on the first grade with published lessons (4AM), not 1AM.
  - **Progression and home:** already handled empty grades, and still do.
- **`getLessonPath(code)` returns `null` for a non-published lesson.** Every link-builder was audited: review links,
  recommendations, practice back-link, admin. A new shared component, `PrerequisiteLessonChips.jsx`, draws
  prerequisite chips; it names another year and only links a published lesson. It replaces two copies that linked
  blindly to unrouted paths.
- `lessons/registry.js` glob and the teacher-memo glob cover 1AM–3AM.

### 4.3 Database

- `smarter:import-curriculum` imports the three grades, 9 chapters, 39 units, 196 lessons, **all 523 LPs** and
  178 lesson prerequisites. Applied to the local dev DB; `registry-health` is green.
- **Found and fixed:** `lessons.publication_status` defaults to `published`, and the importer never wrote it. All
  196 empty lessons would have been **open on the server**, because every gate reads `publication_status`, not
  `status`. Now:
  - a `coming_soon` lesson is created `draft`;
  - an `available` lesson is created `published`, as before;
  - on re-import, a `coming_soon` lesson is never `published`;
  - `coming_soon` → `available` promotes the import's `draft` to `published`;
  - an admin's `draft` / `hidden` is respected.
  The same rule is in `smarter:curriculum-sql` (Hostinger path).
- **Mastery V2 ignores them.** `ContentAccess` refuses draft lessons, so no evidence and no progress row can exist.
  Class scopes use `visibleToStudents`. The two reads that joined prerequisites without a scope now filter on
  publication: the teacher map's LP detail, and `RecommendationService` (`KIND_PREREQUISITE` never points to a draft
  lesson).
- **Cross-year LP→LP edges: kept at lesson level**, with no `pointPrerequisites` for 1AM–3AM. Reason: an
  all-to-all rule would write hundreds of edges between draft الكفاءات the owner has not validated (D1). The precise
  edges are written lesson by lesson at generation, along net links only (`LEARNING_NET.md` §3bis, §4.6).
- Tier stays admin-owned: new lessons are created `free`, and publishing never touches the tier (tested).
- `registry-health --gate` (via `check:activation-drift`) now also fails when the export activates a grade the DB
  lacks. Before this fix, it passed with the three grades unimported.
- New test: `apps/api/tests/Feature/MoyenComingSoonImportTest.php`, 4 tests, MySQL.

### 4.4 Links to earlier years inside exercises (D7)

- One component, `features/learning/EarlierYearReview.jsx`, shows « راجع: <درس> (<السنة>) » under a wrong answer:
  - in practice (`PracticeSession` › `FeedbackPanel`: classic card and exam sheet);
  - in the lesson's final-test review (`BossFinal` › `EpreuveReview`: page and classroom).
- It is derived, never authored: primary LP → its lesson → `reviewLinksForLesson`, kept to earlier years (new
  `earlierYearReviewFor`, `lessonCodeOfLearningPoint`).
  - A published target is a link.
  - An unpublished target shows the official الكفاءة text, and lights up by itself on publication.
- It is applied to all of 4AM now. For example, a wrong answer in « الجذر التربيعي » shows « راجع: معرفة خاصية
  فيثاغورس واستعمالها. (السنة الثالثة متوسط) » and « راجع: حساب قوة عدد نسبي. (السنة الثالثة متوسط) ».
- The resolver is loaded with `import()` on the first error: its own chunk, ≈ 80 KB.
- Documented in `EXERCISE_CONTRACT.md` § « Earlier-year review link » and `LEARNING_NET.md` §3.

### 4.5 `term_exam` source type

- `scripts/lib/examProvenance.mjs` (7 tests) is called by `validate-exercises.mjs`. It adds `source.type: "term_exam"`
  `{grade, semester, file, exercise}` (checked against `exams-index.json`; a misfiled paper counts for its header;
  `2am-s2-61` excluded) and `platform_addition / term_exam_modelled` (`modelledOn: "<g>am-s<n>"`).
- Badge « على منوال اختبار الفصل الأول / الثاني / الثالث », agreeing with the source's term.
- 1AM–3AM can never be `official` / `excerpt` / `bem`, and 4AM cannot cite `term_exam`. The 4AM BEM rule is
  unchanged; the whole 4AM bank still validates.
- The exam sheet is grade-aware (`examPaper`):
  - « على منوال اختبارات الفصل » / « محاكاة اختبار الفصل » for 1AM–3AM;
  - « n متوسط »;
  - the Arabic badge stays RTL.
- `EXERCISE_CONTRACT.md` § « Term-exam provenance (1AM–3AM) »; `EXAM_PATTERN.md` §6 now marks it implemented.

### 4.6 « Publish »

`LESSON_DEVELOPMENT_GUIDE.md` §11 « Publish a lesson » gives the exact sequence:

1. Catalogue flip (`available`, final الكفاءات, `durationMinutes` ≤ 90, `difficulty`, `icon`).
2. Routes, practice and `active.json`.
3. `npm run generate:learning-net`.
4. Local export/import of curriculum and content registry.
5. Gates and a browser check at 320 px.
6. Commit, fast-forward `dev`, push.

The lesson becomes `published` in the DB by itself; its modules and exercises are born `draft` (publishing content
stays a human act in « المحتوى »). Production only follows when `dev` is merged into `main`.

### 4.7 Gates

| Gate | Result |
|---|---|
| `npm test` | core 810 · web 9397 · scripts (incl. new exam-provenance) — all pass |
| `npm run check:lessons` | pass (strict validation, routes, dormant isolation, textbook, activation drift against the imported dev DB, learning net map and queue) |
| `npm run build` | pass, within the official 4 GB heap (see §3) |
| PHP, MySQL `phpunit.local.xml`, one run | 1239 tests pass (new test included) |
| Browser, new `apps/web/e2e/moyen-draft-grades.mjs` (1440 + 320) | all checks pass: draft catalogue, unit cards, unit page, cross-year chips, 4AM unchanged, no overflow, no console error, « راجع » after a wrong practice answer |

## 3. Found on the way (fixed, or flagged for you)

- **CI on `dev` has been red since `2b1e7342`** (« remove islamic feature… »). That commit deleted `LESSON_TITLES`
  from `wadiya-idmajiya-dawaran/content/textbook.js`, but `Module07AlWadiya.jsx` still imports it, so `vite build`
  failed. **Fixed** by restoring the export byte-for-byte (separate commit).
- **The build exceeded its 4 GB heap** at « computing gzip size », on origin/dev too. `vite.config.js` now sets
  `build.reportCompressedSize: false`: peak RSS dropped from 5.7 to 4.5 GB, and the build takes 45 s. Bundle sizes are
  measured with `BUNDLE_BOUNDARIES.md` §6 instead.
- **Entry bundle — please decide.** The 1AM–3AM catalogue lives in the entry (it is `coursesData`): **+52.7 KB gzip**
  (576.5 → 629.2 KB), ≈ 47 KB of it the Arabic text of 196 draft lessons. A per-grade lazy catalogue is the possible
  follow-up.
  **Separately, origin/dev's entry was already 576 KB gzip against the 224 KB recorded on 2026-09-25.** Something
  re-entered the entry in between; it was not investigated here (`BUNDLE_BOUNDARIES.md` §5 note).
- **4AM grade order in the DB** changed from 0 to 3 (it now follows 1AM–3AM). Only `grades.order` is affected; the
  importer reported it as one updated grade.
- The local import also applied 62 pending 4AM lesson updates already on origin/dev (durations etc.). Expected: the
  dev DB was behind.

## 4. Things to review (owner)

1. **The ميدان names of 1AM–3AM** come from the official منهاج (« الأنشطة العددية », « الدوال وتنظيم المعطيات »,
   « الأنشطة الهندسية »). 4AM keeps your display names (« أنساب الأعداد والحساب », « التناسبية والدوال »,
   « الهندسة »), so a student switching grade sees different names for the same chapter id. Should 1AM–3AM take the
   4AM names?
2. **Draft الكفاءات are visible** on the 1AM–3AM unit pages (D2 shows the cards; the unit page shows what each lesson
   will teach). They are still drafts (D1).
3. **The +52.7 KB gzip entry cost** (§3) and the older entry drift.
4. **Students can now pick 1AM–3AM** and see only « قيد الإعداد » cards; teachers can create 1AM–3AM classes (still
   subject to their plan's `CONTENT_ALLOWED_GRADES`).

## 5. Phase 3 — the generation loop

Unchanged from the phase-1 report §4, with these phase-2 facts:

- **Each lesson already exists** in `lessons_<g>_2026_2027.json` as `coming_soon`. Generate INTO it (same code, same
  `programmeItems`), never create a second entry.
- **Publish = §11 « Publish a lesson » = push to `dev`.**
- Its practice bank uses `term_exam` / `term_exam_modelled` and the « على منوال اختبار الفصل … » badge, with
  `exam-style.json` to switch it to the exam sheet. The sheet already says « اختبار الفصل » and « n متوسط ».
- « راجع » after a wrong answer, and the review links, need no authoring: they come from the net.
- `pointPrerequisites` across years: only along a net link, on the final الكفاءات (`LEARNING_NET.md` §4.6).

### Phase 3 prompt (one session per batch; paste and set N)

```text
Phase 3 of the cycle moyen rollout — generate the next N=3 lessons of the learning-net queue.
Read first: CLAUDE.md, docs/README.md, docs/architecture/LEARNING_NET.md (§3bis platform/DB, §4 generation contract,
§4bis order), docs/reports/MOYEN_ROLLOUT_PHASE2_REPORT_2026-10-14.md (owner decisions D1–D12; D12: publish = push
to dev), docs/lessons/LESSON_DEVELOPMENT_GUIDE.md end to end (§3 « Adding a GRADE », §11 « Publish a lesson », §14),
docs/architecture/MANIPULATION_DNA.md, docs/architecture/EXERCISE_CONTRACT.md (« Term-exam provenance »,
« Earlier-year review link »), docs/sources/moyen/exams/EXAM_PATTERN.md §6.

Run `node scripts/learning-net-queue.mjs` so the queue is fresh, then take its first N entries that are still
`coming_soon` in packages/core/curriculum/dz/lessons_<g>_2026_2027.json. For each, in order:
1. If it is the first lesson of its unit: seed the unit (lessons/moyen/<g>/<chapter>/<unit>/, _unit/ with the three
   one-line bindings, routes) and build docs/sources/<g>/unit<N>/extraction.json (+ build-extraction.py) from the
   pages in the unit's `textbook` block (docs/official-book-pdfs/; render only the pages you need with pdftoppm; the
   2AM scan is the only copy — get the idea and move on, D5/D9). Pages missing from the scan (D11) are GENERATED in
   the book's format as declared platform additions.
2. Generate the lesson INTO its existing catalogue entry (same code, same programmeItems) per guide §14 and
   LEARNING_NET §4: « أستعدّ » measures every review-link item; nothing noRebuildForLesson lists is rebuilt;
   pointPrerequisites only along net links; the lab follows MANIPULATION_DNA with two levels; knowledge map,
   « أتوقّع القاعدة », « مسائل », values woven into story contexts. The draft الكفاءات may be refined (keep their
   order — LP ids are positional), never silently dropped: list every change for me.
3. Build its practice bank (5 levels × 10) from docs/sources/moyen/exams/exams-index.json and exercises generated
   « على منوال » the term exams: source.type "term_exam" (one precise corpus exercise) or platform_addition /
   term_exam_modelled, badge « على منوال اختبار الفصل … », oracles for every constructed answer; add it to
   active.json and exam-style.json.
4. Run the gates (npm test, npm run check:lessons, npm run build), check it in the browser (RTL, 320 px; extend
   apps/web/e2e/moyen-draft-grades.mjs if useful), then PUBLISH it with guide §11 « Publish a lesson » (status
   available, durationMinutes ≤ 90, export/import, commit, fast-forward dev, push origin dev) and give me its URL
   before starting the next lesson.
5. If it completes its unit, generate and publish the unit's synthesis « أدمج تعلّماتي » (unit-1 9-module format).
PHP tests on MySQL (phpunit.local.xml), one run at a time. Follow the documentation synchronization rule.
End with a short progress report appended to docs/reports/MOYEN_ROLLOUT_PROGRESS.md and the same prompt for the
next batch.
```

## Documentation sync (phase 2)

| File | What changed |
|---|---|
| `docs/architecture/LEARNING_NET.md` | Status; the 1AM–3AM lessons are catalogue entries (§2, §2.4); resolver import rules and new functions (§2, §3); « راجع » after a wrong answer (§3); **new §3bis** (catalogue, lesson-level prerequisites, why no cross-year LP edges, DB publication rule, Mastery V2, registry-health); §4 (generate into the entry, then publish); §6 gates; §7, §8 |
| `docs/architecture/EXERCISE_CONTRACT.md` | Exam data table (term-exam badge and sources); § « Term-exam provenance (1AM–3AM) »; § « Earlier-year review link » |
| `docs/lessons/LESSON_DEVELOPMENT_GUIDE.md` | §3 « Adding a GRADE »; §11 « Publish a lesson »; §14.2 input; the إختبار أولي row (« راجع » under wrong answers) |
| `docs/architecture/BUNDLE_BOUNDARIES.md` | Learning-net chunk row; 1AM–3AM catalogue entry cost (measured); entry drift note; `reportCompressedSize` |
| `docs/architecture/ADMIN_PANEL_ARCHITECTURE.md` | A3: lesson publication at import (`coming_soon` → draft, publish flip) |
| `docs/architecture/ARCHITECTURE.md` | Grade/chapter rows; the real grade ids |
| `docs/README.md` | Rows for generating/publishing, adding a grade, term-exam practice and « راجع »; phase-2 report link; D1–D11 |
| `docs/sources/moyen/exams/EXAM_PATTERN.md` | §6: `term_exam` implemented; stale `ISLAMIC_VALUES.md` reference removed |
| `docs/curriculum/LEARNING_NET_MAP.md` | Regenerated (headline count) |
| `CLAUDE.md` | 1AM–3AM active, `coming_soon` / draft, publish = push to dev, « راجع » after an error, term-exam practice |
