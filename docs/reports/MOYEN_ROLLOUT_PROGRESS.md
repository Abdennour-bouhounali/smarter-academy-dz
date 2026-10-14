# Cycle moyen rollout — phase 3 progress log

One entry per generated lesson, newest last. Each lesson is generated INTO its catalogue entry, published on `dev`
(owner decision D12) and imported + published in the local database (owner, 2026-10-14). Contracts:
`docs/architecture/LEARNING_NET.md` §4, `docs/lessons/LESSON_DEVELOPMENT_GUIDE.md` §11 « Publish a lesson » and
§ « Generating a 1AM–3AM unit LESSON BY LESSON ».

## Batch 1 (2026-10-14) — queue entries 1–3

### 1. `mana-jam-tarh` « معنى الجمع والطرح » (1AM, unit 2 `jam-tarh-ashriya`) — published

- **Unit seeded** (first generated lesson of the unit): `lessons/moyen/1am/ansab_al_aadad_wal_hisab/jam-tarh-ashriya/_unit/`;
  whole-unit extraction `docs/sources/1am/unit2/` (56 elements, pp. 23–34, answers computed in exact decimals; 42 pending for the
  unit's other lessons). One reading decided: the « وضعية تقويم » p. 33 prints its two clocks swapped (cut at 15 h 06, recorded in
  `discrepancies`, for the synthesis).
- **Lesson:** 9 modules (أستعدّ · نشاط 1 · معارف · طريقة · أتمرّن · 3 مسائل · إختبار أولي), 80 min (catalogue `durationMinutes` 56, the module total without the مسائل). New lab `story-bars`
  (MANIPULATION_CONTRACT §2sedecies): مبتدئ the school medical check (stretch the unknown height, choose the calc; « تزيد » with − and
  « تنقص » with + as traps), متقدم the textbook's six texts and six calc cards. New shared figure `ArcTape` (« مخطط بأقواس »,
  statement-figure kind `tape`). « أستعدّ » measures the net's review item `1am.m1.r03` (two platform statements) beside textbook items
  1, 2, 8 of p. 24.
- **الكفاءات (draft → final, order kept):**
  - P1 « …لحل مشكلة من الحياة اليومية » → « …لحلّ مشكلة من الحياة اليومية **بأعداد طبيعية أو عشرية** » (makes item `1am.m1.r05`
    explicit);
  - P2 « مجموع، فرق، حدود » → « مجموع، فرق، **حدّا المجموع، حدّا الفرق**، حدود » (the textbook's own terms, p. 26);
  - P3 unchanged.
  - `pointPrerequisites`: P3 ← P1 (intra-lesson). No cross-year edge: the net's prerequisite `kusur-ashriya-kitaba` still has draft
    الكفاءات (LEARNING_NET §4.8).
- **Practice:** `content/practice/1am/mana-jam-tarh/` — the FIRST 1AM–3AM bank: 50 exam sheets, 15 `term_exam` (1am-s1-91, -93, -94,
  -96, -98, -99, -101, -104, -106; 1am-s2-64 for a duration), 24 `term_exam_modelled` (1am-s1), 11 `adapted` from the lesson's textbook
  elements; misconceptions `MISC-JAMTARH-*`; in `active.json` and `exam-style.json`. Infra fix: the answer oracle only walked
  `content/practice/4am` — it now walks every grade.
- **Tooling made generic for lesson-by-lesson units:** `check:textbook` « pending » destinations; `coursesData.test.js` « available ⇔
  on disk » for 1AM–3AM; the unit's `prepDiagnostic.test.js` reads the catalogue.
- **Gates:** `npm test` (core 816 · web 9558 · scripts 10090), `npm run check:lessons` (entry 322.2 KB gzip ≤ 330), `npm run build`,
  browser `e2e/lesson-kit/1am-jam-tarh-ashriya.mjs` (every module at 1280/320 px, the lab by keyboard and tap-tap, one screen at four
  viewports × two levels) and `e2e/lesson-route-boundary.mjs` — all green.
- **URL:** `/courses/moyen/1am/ansab_al_aadad_wal_hisab/mana-jam-tarh`.

### 2. `qisma-iqlidiya-baqi` « القسمة الإقليدية » (1AM, unit 3 `darb-qisma-ashriya`) — published

- **Unit seeded** (first generated lesson of unit 3; its earlier lesson `darb-adad-ashriya` is still `coming_soon`, it comes later in the
  queue): `_unit/` bindings; whole-unit extraction `docs/sources/1am/unit3/` (75 elements, pp. 35–50; 60 pending). The unit's تحدّ (the
  leap year) is now cited by `units_1am › darb-qisma-ashriya.challenge.sourceElementId` and declared `duplicatedIn` the next lesson.
  Readings: act-3's bracket printed RTL; ex-21 depends on 365 / 366 days; ex-23 makes divisibility by 9 discovered (not in معارف p. 41).
- **Lesson:** 9 modules (أستعدّ · نشاط 3 · معارف · أتمرّن · مسائل الكتاب والآلة الحاسبة · 3 مسائل · إختبار أولي), 78 min (catalogue 54
  without the مسائل). New lab `division-jumps` (MANIPULATION_CONTRACT §2septdecies): b given, the hand holds q — مبتدئ 47 drawn flowers
  in bouquets of 6 (then 48), متقدم the textbook's 279 ÷ 14 on a line with no labelled multiples; معارف's 253 ÷ 17 in the same lab.
  « أستعدّ » measures the net item `1am.m1.r01` (three platform statements) beside textbook item 8 of p. 36.
- **الكفاءات:** the three drafts kept word for word (they already said what the lesson teaches). `pointPrerequisites`: P2 ← P1,
  P3 ← P1 and **P3 ← `1am_mana-jam-tarh_P1`** — the first LP edge along a net link toward a published earlier lesson.
- **Practice:** `content/practice/1am/qisma-iqlidiya-baqi/` — 50 sheets: 15 `term_exam` (1am-s2-70, -72, -73, -77, -78, -80 → « الفصل
  الثاني »; 1am-s1-101 → « الفصل الأول »), 22 `term_exam_modelled` (1am-s2), 13 `adapted`; misconceptions `MISC-IQLIDIYA-*`.
- **Also:** catalogue `durationMinutes` of both lessons aligned on the validator's convention (module total without the مسائل: 56 and 54),
  documented in the guide's publish steps.
- **Gates:** `npm test` (core 816 · web 9615 · scripts 10287), `check:lessons` (entry 322.3 KB gzip), `build`, browser
  `e2e/lesson-kit/1am-darb-qisma-ashriya.mjs` and `e2e/lesson-route-boundary.mjs` — all green. Local DB: published, 9 modules and 50
  exercises published.
- **URL:** `/courses/moyen/1am/ansab_al_aadad_wal_hisab/qisma-iqlidiya-baqi`.

### 3. `qawaid-qabiliyat-qisma` « قواعد قابلية القسمة » (1AM, unit 3 `darb-qisma-ashriya`) — published

- **Lesson:** 10 modules (أستعدّ · نشاط 4 · معارف · طريقة (القسمة على 4) · أتمرّن · السنة الكبيسة · 3 مسائل · إختبار أولي), 86 min
  (catalogue 62 without the مسائل). New lab `digit-cards` (MANIPULATION_CONTRACT §2octodecies): مبتدئ the textbook's 0..48 table
  coloured by hand for 2, 5 then 3 (a non-multiple refused with its remainder), متقدم the cards 4, 5, 9, 3 of exercise 26 with claim lamps
  re-judged on every swap; the rule is discovered, wrong rules are refuted with the student's own cells and swap. The rule for 9 (absent
  from معارف p. 41, discovered by exercise 23) is a declared addition; the rule for 4 is the طريقة p. 42; the unit's تحدّ (leap year) is
  the practice lab of module 5 with أتعمّق 8 (the century exception). The final test is cut from the p. 47 table (item 12). « أستعدّ »
  measures the net item `1am.m3.r01` (three platform statements) beside textbook item 10 of p. 36.
- **Extraction:** ex-25 (divide by 4 by halving twice, DECIMAL quotients 40,8 ÷ 4…) reassigned to `qisma-ashriya-taqrib`; deep-6 (prime
  numbers, not a 1AM programme item) reassigned to the unit's synthesis as enrichment — both with a `scope` note.
- **الكفاءات:** the four drafts kept word for word. `pointPrerequisites`: P4 ← `1am_qisma-iqlidiya-baqi_P1` (net link `1am.m3.r01` →
  `1am.m3.r02`), P1 ← P4, P2 ← P4, P3 ← P1.
- **Practice:** `content/practice/1am/qawaid-qabiliyat-qisma/` — 50 sheets (204 questions): 14 `term_exam` (1am-s2-70, -72, -78, -80 →
  « الفصل الثاني »; **1am-s2-62 is a term-3 paper filed under s2** — its header says الفصل الثالث, so its two sheets carry that badge), 22
  `term_exam_modelled`, 14 `adapted`; oracle by BigInt `n % d`; misconceptions `MISC-QABILIYA-*` (10).
- **Kit fix:** `IntegerSetQuestion`'s input was a fixed 256 px (`w-64`) and overflowed at 320 px; now `max-w-full` (every lesson).
- **Gates:** `npm test` (core 816 · web 9673 · scripts 10483), `check:lessons` (entry 322.4 KB gzip), `build`, browser
  `e2e/lesson-kit/1am-qawaid-qabiliyat-qisma.mjs` and `e2e/lesson-route-boundary.mjs` — all green. No API change, so no PHP test run.
  Local DB: imported, 10 modules and 50 exercises published.
- **URL:** `/courses/moyen/1am/ansab_al_aadad_wal_hisab/qawaid-qabiliyat-qisma`.

### Batch 1 summary

Three 1AM lessons published on `dev` (units 2 and 3), three new labs (`story-bars`, `division-jumps`, `digit-cards`), one shared figure
(`ArcTape`), three 50-sheet term-exam banks. No unit was completed, so no synthesis yet: unit 2 waits for `injaz-jam-tarh-mudad` and `rutbat-miqdar-jam`, unit 3
for `darb-adad-ashriya` and `qisma-ashriya-taqrib`. Open point for the owner: the corpus paper `1am-s2-62` sits in the term-2 folder but is
a term-3 exam (badges follow its header).

## Next batch — prompt

The queue after batch 1 starts with `qisma-iqlidiya-hasr` (2AM), `kitabat-adad-tabii` (1AM), `ikhtizal-kitaba-kasriya` (1AM)
(`docs/curriculum/GENERATION_QUEUE.md`). Paste:

```
Phase 3 of the cycle moyen rollout — generate the next N=3 lessons of the learning-net queue.
Read first: CLAUDE.md, docs/README.md, docs/architecture/LEARNING_NET.md (§3bis platform/DB, §4 generation contract,
§4bis order), docs/reports/MOYEN_ROLLOUT_PHASE2_REPORT_2026-10-14.md (owner decisions D1–D12; D12: publish = push
to dev), docs/lessons/LESSON_DEVELOPMENT_GUIDE.md end to end (§3 « How a lesson is mounted » and « Adding a GRADE »,
§11 « Publish a lesson », §14), docs/architecture/BUNDLE_BOUNDARIES.md §4 (rules 3, 4, 9, 10),
docs/architecture/MANIPULATION_DNA.md, docs/architecture/EXERCISE_CONTRACT.md (« Term-exam provenance »,
« Earlier-year review link »), docs/sources/moyen/exams/EXAM_PATTERN.md §6.

Run `node scripts/learning-net-queue.mjs` so the queue is fresh, then take its first N entries that are still
`coming_soon` in packages/core/curriculum/dz/lessons_<g>_2026_2027.json. For each, in order:
1. If it is the first lesson of its unit: seed the unit (lessons/moyen/<g>/<chapter>/<unit>/, _unit/ with the three
   one-line bindings) and build docs/sources/<g>/unit<N>/extraction.json (+ build-extraction.py) from the pages in the
   unit's `textbook` block (docs/official-book-pdfs/; render only the pages you need with pdftoppm; the 2AM scan is the
   only copy — get the idea and move on, D5/D9). Pages missing from the scan (D11) are GENERATED in the book's format
   as declared platform additions.
2. Generate the lesson INTO its existing catalogue entry (same code, same programmeItems) per guide §14 and
   LEARNING_NET §4, in a folder named exactly like the lesson code: « أستعدّ » measures every review-link item; nothing
   noRebuildForLesson lists is rebuilt; pointPrerequisites only along net links; the lab follows MANIPULATION_DNA with
   two levels; knowledge map, « أتوقّع القاعدة », « مسائل », values woven into story contexts. Lab strings go to
   apps/web/src/i18n/locales/ar/lesson.manipulation.json (keys lesson:manipulation.<type>.*), never lesson.json;
   unit maths in packages/core/arithmetic/ are imported BY PATH, never added to the core barrel. Do NOT touch App.jsx:
   run `npm run generate:lesson-index` once the lesson's lesson.config.js and routes.jsx exist. The draft الكفاءات may
   be refined (keep their order — LP ids are positional), never silently dropped: list every change for me.
3. Build its practice bank (5 levels × 10) from docs/sources/moyen/exams/exams-index.json and exercises generated
   « على منوال » the term exams: source.type "term_exam" (one precise corpus exercise) or platform_addition /
   term_exam_modelled, badge « على منوال اختبار الفصل … », oracles for every constructed answer; add it to
   active.json and exam-style.json.
4. Run the gates (npm test, npm run check:lessons — it includes the lesson-index check and the 330 KB entry budget —,
   npm run build), check it in the browser (RTL, 320 px; node apps/web/e2e/lesson-route-boundary.mjs; extend
   apps/web/e2e/moyen-draft-grades.mjs if useful), then PUBLISH it with guide §11 « Publish a lesson » (status
   available, durationMinutes ≤ 90, lesson index regenerated, export/import, commit, fast-forward dev, push origin dev)
   and give me its URL before starting the next lesson. Also import it into the LOCAL database and publish its
   modules and exercises there (owner, 2026-10-14) so I can browse it. If the entry budget fails, find the leak with
   `node scripts/analyze-entry-bundle.mjs --chain <module>` — never raise the budget to make a lesson pass.
5. If it completes its unit, generate and publish the unit's synthesis « أدمج تعلّماتي » (unit-1 9-module format,
   with ALL its Module<NN> files — registry.test.js fails on a declared module without a route).
PHP tests on MySQL (phpunit.local.xml), one run at a time. Follow the documentation synchronization rule.
End with a short progress report appended to docs/reports/MOYEN_ROLLOUT_PROGRESS.md and the same prompt for the
next batch.
```
