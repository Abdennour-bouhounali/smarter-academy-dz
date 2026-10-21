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

## Audit before batch 2 (2026-10-14) — the batch-1 labs against MANIPULATION_DNA §17

The three batch-1 labs (`story-bars`, `division-jumps`, `digit-cards`) were redesigned to the Gen Alpha bar (shared kit
`primitives/LabKit.jsx` + `SvgPill.jsx`, the character `KidFigure` — girls in hijab —, `BulbFigure`, `FlowerFigure`, `HopperFigure`;
hints closed by default platform-wide) and then audited: unit tests (core 816 · web 9688 · scripts 10483), the three browser suites
`e2e/lesson-kit/1am-*.mjs` (one screen at 1280×800, 1366×768, 390×844, 320×640, both levels) and the screenshots, read one by one.
Defects found and fixed:
- `division-jumps` متقدم: the textbook's marks « 10 قفزات؟ / 20 قفزة؟ » were clipped by the bottom of the number-line stage at every
  size (the stage ended 3 px under their baseline) — the stage is 12 px taller, the grass sits under the marks.
- « Say it once » (§17.7): `digit-cards` stated the gesture three times (prompt sub-line, side note, hint 1) and its grid hint 1 restated the
  colouring gesture; `story-bars`' hints were long sentences that repeated the gesture. The prompt keeps only « احكم على المصابيح، ثم أجب. »,
  every hint is now one short thinking question.
Known, not a lab defect: the lesson's floating column (« كرّاسي / بطاقتي ») overlaps the bottom-left of a lab on a 390 px phone while
scrolling (platform layer, `lesson-floating-column`).

## Batch 2 (2026-10-14) — queue entries 1–3

Organisation: three lesson leads (seed + whole-unit extraction + authors' brief, then the lesson), a lab author and a bank author per
lesson from the brief (`docs/sources/<g>/unit<N>/brief-authors.md`). All three published on `dev` and in the local database.

### 1. `qisma-iqlidiya-hasr` « القسمة الإقليدية وحصر حاصل القسمة » (2AM, unit 2 `kusur-amaliyat`) — published — the FIRST 2AM lesson
- Nothing was missing for 2AM (`lessonLoaders.js`, the index generator and the practice tooling already covered it). Fix found: a
  `textbookRef.pages.method: null` was rendered as « page 0 » on the unit page (`textbookPages.js`, with a test); the method page p. 27
  belongs to `kasr-hasil-qisma`, so this lesson's طريقة is a declared addition.
- 9 modules, 86 min (catalogue `durationMinutes` 62). New lab `egg-trays` (MANIPULATION_CONTRACT §2unvicies): the hand holds the DIVIDEND a
  (eggs on a conveyor, trays closing at b), the trays ruler is the same line read ÷ b, the student brackets a ÷ b with a one-unit frame; it
  does NOT reuse `division-jumps` (1AM holds q) — the net's no-rebuild rule. « تذكّر » box toward the published 1AM lesson.
- الكفاءات: P1 « …على أيّ عدد طبيعي غير معدوم b … 0 ≤ r < b »; P2 + « قيمتين مقرّبتين إلى الوحدة بالنقصان وبالزيادة »; P3 reworded to
  « انعدام الباقي: a/b عدد طبيعي ». `pointPrerequisites` P1 ← `1am_qisma-iqlidiya-baqi_P1`, `_P2`.
- Bank: 50 sheets, 15 `term_exam` (2am-s1-79, -87, -74, -70, -77, -68), `MISC-HASR-*`.
- URL: `/courses/moyen/2am/ansab_al_aadad_wal_hisab/qisma-iqlidiya-hasr`.

### 2. `kitabat-adad-tabii` « كتابة الأعداد الطبيعية ودلالة الأرقام » (1AM, unit 1 `adad-tabiiya-ashriya`) — published
- 10 modules, 88 min (catalogue 64). New lab `rank-exchange` (§2novodecies): the hand moves quantities between ranks (ties ten into one,
  opens one into ten); the written digits are an OUTPUT, never a card (so it differs from `digit-cards`); worlds `packing` (pencils) and
  `money` (generic drawn notes and coins). Exact maths in the new `packages/core/arithmetic/placeValue.js` (`toArabicWords` identical to
  the extraction's `words()`).
- Boundary with `kusur-ashriya-kitaba` (both carry `1am.m1.r02`): this lesson = naturals (classes of three, rank of a digit, « رقم » vs
  « عدد »), the next = decimal fractions and decimal places; `know-4`, `ex-12`, `deep-3` are split between them.
- الكفاءات: P2 + « التمييز بين رقم منزلة وعدد وحداتها »; P3 → decomposition of a NATURAL (the decimal part of the draft moved to kusur's P3).
- Bank: 50 sheets (14 `term_exam`, term 1), `MISC-KITABA-*`; oracle with its own number speller.
- URL: `/courses/moyen/1am/ansab_al_aadad_wal_hisab/kitabat-adad-tabii`.

### 3. `ikhtizal-kitaba-kasriya` « الكتابات الكسرية لحاصل قسمة واختزال كسر » (1AM, unit 4 `kitabat-kasriya`) — published
- 10 modules, 89 min (catalogue 65). New lab `fraction-knife` (§2vicies): one whole with one fixed share, the hand holds the knife (d, the
  number of equal pieces); a/d is writable only when the share's edge falls on a cut; bands when a piece would be < 10 px (d = 45 on a phone).
  It stands on its own before `hasil-qisma-kasr` (queue order): the fraction-as-quotient idea is only recalled.
- الكفاءات: P1 + « أو بقسمتهما عليه »; P2 makes `1am.m5.x1` (decimal fraction ↔ decimal writing) explicit; P3 + « حتى أبسط شكل ممكن ».
  `pointPrerequisites` P3 ← `1am_qawaid-qabiliyat-qisma_P1`, `_P2`; P2 ← `1am_kitabat-adad-tabii_P2` (net link `1am.m1.r02 → 1am.m5.r01`).
- Bank: 50 sheets (term 2 and term 3 badges by source paper), `MISC-KASRIYA-*`.
- URL: `/courses/moyen/1am/ansab_al_aadad_wal_hisab/ikhtizal-kitaba-kasriya`.

### Open points for the owner
1. **2AM unit 2 تحدّ**: no four of the five printed cards (1/24, 1/6, 1/2, 1/12, 1/8) sum to 1 (best 7/8); either the answer is « لا » or the scan hides a card (1/4 would work). Decide before the synthesis.
2. **Two proposed net links, NOT applied**: `1am.m5.r01 → 2am.m1.r06` (P2 writes 180/8) and `1am.m3.r02 → 2am.m1.r04`.
3. Brief errors found by authors: unit 4's « readable at {5, 15} » is true only among the divisors of 45 (every multiple of 5 below 45 is readable).
4. The platform's floating « كرّاسي / بطاقتي » pills still cover the lower-left of a lab on a 390 px phone (platform layer, not a lab).

## Batch 3 (2026-10-15) — queue entry 1

### 1. `hasil-qisma-kasr` « حاصل القسمة والكسر » (1AM, unit 4 `kitabat-kasriya`) — published (committed with batch 4, entry 1)

- **Lesson:** 9 modules (أستعدّ · نشاط · معارف · طريقة · أتمرّن · 3 مسائل · إختبار أولي), 85 min (catalogue `durationMinutes` 61). The unit's
  extraction was reused (`build-extraction.py` edits: `act-1` → module 4 as an application, `opener` → module 2, `self-1` / `self-9` → 4,
  `self-2` / `self-3` → 8, `deep-2` → 6; `ex-2 ①` re-read at 300 dpi: SEVEN cells, not eight; `self-1` tubes unreadable → REDESIGNED, a
  discrepancy is recorded). Unit NOT complete (`hasil-qisma-mustaqim`, `akhdh-kasr-min-adad` and the synthesis are still `coming_soon`).
- **New lab `fair-share`** (MANIPULATION_CONTRACT §2duovicies; `noRebuildForLesson` was empty, and it differs from `fraction-knife` in what the
  hand holds): the hand holds the SHARE of one child, the lab lays b shares against the a loaves; decimal rulers (0,1 / 0,01 / 0,001) land for
  3 ÷ 4 and never for 2 ÷ 3, 5 ÷ 6, 7 ÷ 3; the earned « cut » ruler (every loaf in b pieces) lands for every a, b. مبتدئ the school canteen
  (3 ÷ 4 then 2 ÷ 3), متقدم the textbook's 5 loaves for 6 people then 7 ÷ 3. New drawing `CakeFigure › Cake` (redesigned 2026-10-15 from `BreadFigure › Loaf`: round cakes, coloured slices per child, Mawlid bunting, always-open « جرّب أعدادك »), theme `bakery`. Screenshots at
  1280 × 800, 390 × 844 and 320 × 640 reviewed (initial, 0,8 over, 0,75 exact, cut ruler, discovery): the 320 px stage, controls and
  question were compacted until the glance fit (609 / 640).
- **الكفاءات (draft → final, order kept):** P1 + « وكتابة حاصل قسمة عددين طبيعيين على شكل كسر »; P2 made explicit « …لإيجاد عدد ناقص في
  مساواة من الشكل $b\times\ldots=a$ »; P3 unchanged. `pointPrerequisites`: P1 ← `1am_kitabat-adad-tabii_P2`, P2 ← P1, P3 ← P1 and
  `1am_kitabat-adad-tabii_P2` (net link `1am.m1.r02` → `1am.m5.r01`); and the published sibling `ikhtizal-kitaba-kasriya` gained P1 ←
  `1am_hasil-qisma-kasr_P1` (net link `1am.m5.r01` → `1am.m5.r02`), as its brief had announced.
- **Practice:** `content/practice/1am/hasil-qisma-kasr/` — 50 sheets / 207 questions (22 `term_exam` from `1am-s2-72`, `-78`, `-64`, `-65` and
  « الفصل الثالث » `1am-s3-37`, 16 platform additions, 12 textbook), oracle `scripts/practice-oracle/hasil-qisma-kasr.mjs`, `MISC-HASIL-*`.
- **Gates:** see the final report of the session (npm test, check:lessons, build, `e2e/lesson-kit/1am-hasil-qisma-kasr.mjs`).
- **URL:** `/courses/moyen/1am/ansab_al_aadad_wal_hisab/hasil-qisma-kasr`.

## Batch 4 (2026-10-15) — queue entries 1–3 (done)

### 1. `kusur-ashriya-kitaba` « الكسور العشرية والكتابة العشرية » (1AM, unit 1 `adad-tabiiya-ashriya`) — published
- **Commit note:** the commit also carries the previous session's uncommitted work of the same rollout (`hasil-qisma-kasr` retrofit, `FairShare` / `CakeFigure`, LabCoach docs, CLAUDE.md).
- **Unit** already seeded (`kitabat-adad-tabii`); extraction reused, destinations moved in `build-extraction.py`: act-2, act-3, ex-4…ex-14 (②–④ of ex-12), ex-26…ex-28 are APPLICATIONS in module 5, method-2 / now-14 module 4. `deep-3` ③④ stay with `muqaranat-adad-ashriya` (the extraction gives them to the comparison lesson: they ask for the smallest / largest decimal).
- **Lesson:** 10 modules (أستعدّ · نشاط « ورشة الزليج » · معارف · طريقة (31,25 ⇄ 3125/100) · طريقة (× ÷ 10, 100, 1000, lab) · أتمرّن (9 redesigned exercises + a 10 × 10 plate figure) · 3 مسائل · إختبار أولي), 62 min (catalogue `durationMinutes` 62, whole lesson 86). Entry designed by the platform (config header): the book's نشاط 2 and a zoomable ruler (reserved for the graduated half-line lesson) rejected.
- **New lab `decimal-comma`** (MANIPULATION_CONTRACT §2tervicies; `noRebuildForLesson` is empty and it differs in what the hand holds): the DIGITS are fixed on a slip, the hand holds the COMMA. World `mosaic` (honest blocks panel / strip / tile / shard; `match` and `fraction` tasks), world `machine` (× ÷ 10 … 0,001 with zeros to add). Exact arithmetic in `packages/core/arithmetic/decimals.js`. LabCoach, always-open free panel, discovery and formal phase. Screenshots at 768×1024, 1024×768, 1280×800, 1366×768, 1920×1080 reviewed by the lab author (panels stacked at the origin, lost keyboard focus, off-centre RTL slips fixed).
- **الكفاءات (draft → final, order kept):** P1 + « أو عن كمية أكبر منها … وكتابته بكتابات متساوية مثل 3/10 = 30/100 »; P2 + « (عدد الأرقام بعد الفاصلة هو عدد أصفار المقام) وحذف الأصفار غير الضرورية »; P3 → « (مفكوكه النموذجي) … ولو كانت حدوده غير مرتّبة، وتعيين عدد الأعشار أو الأجزاء من مائة » (also covers `1am.m5.r03`, the sum of decimal fractions); P4 + « (أو في 0,1 أو 0,01 أو 0,001) … مع كتابة الأصفار عند اللزوم » (the programme item `1am.m1.r03`). `pointPrerequisites`: P2 ← `1am_hasil-qisma-kasr_P1`, P1; P3 ← `1am_hasil-qisma-kasr_P1`, `1am_mana-jam-tarh_P1`, P2; P4 ← `1am_kitabat-adad-tabii_P2`, P2; and the published `mana-jam-tarh` P1 ← `1am_kusur-ashriya-kitaba_P4` (net link `1am.m1.r03 → 1am.m1.r05`). `prerequisiteLessonCodes` = `kitabat-adad-tabii`.
- **Overlap to decide (owner):** the published `ikhtizal-kitaba-kasriya` P2 already teaches « decimal fraction ⇄ decimal writing » (it was generated before this lesson by queue order). This lesson is the foundation (meaning of the comma); no edge was written between the two P2 to avoid an LP cycle.
- **Net test:** `learningNet.test.js › respecte l'ordre du manuel` now applies to 4AM only (1AM–3AM follow the queue, whose « renvois en avant » are listed: hasil-qisma-kasr → this lesson).
- **Practice:** `content/practice/1am/kusur-ashriya-kitaba/` — 50 sheets / 245 questions (24 `term_exam` from 1am-s1-91, -93, -94, -95, -96, -97, -98, -99, -101, -104, -106 and 1am-s2-64, -65; 10 `term_exam_modelled`; 16 `adapted`), oracle `scripts/practice-oracle/kusur-ashriya-kitaba.mjs`, 16 `MISC-KUSUR-*`. `1am-s2-65` is the first corpus source for `1am.m5.r03`.
- **Gates:** `npm test` (core 841 · web 10142 · scripts 11521), `check:lessons` (entry 323.0 KB gzip ≤ 330), `build`, browser `e2e/lesson-kit/1am-kusur-ashriya-kitaba.mjs`, `lesson-route-boundary.mjs`, block added to `moyen-retrofit-phase1.mjs`. Local DB: imported, 10 modules and 50 exercises published.
- **URL:** `/courses/moyen/1am/ansab_al_aadad_wal_hisab/kusur-ashriya-kitaba`.


### 2. `muqaranat-adad-ashriya` « مقارنة الأعداد العشرية وترتيبها » (1AM, unit 1 `adad-tabiiya-ashriya`) — published
- **Unit NOT complete** (`adad-ashri-mustaqim-mudarraj`, `hasr-qiyam-muqarraba` and the synthesis are still `coming_soon`): no synthesis this time.
- **Lesson:** 9 modules (أستعدّ · نشاط « القفز الطويل » · معارف · طريقة « أقارن وأرتّب » · أتمرّن · 3 مسائل · إختبار أولي), 82 min whole, 58 without the مسائل (catalogue `durationMinutes` 58; modules 6 / 14 / 9 / 10 / 13 / 8×3 / 6). Entry designed by the platform (config header): the book's نشاط 5 (four pupils' answers to judge) rejected as entry and posed in أتمرّن; a graduated half-line rejected (next lesson); a marks table to sort rejected (becomes the TIC exercise). Extraction destinations moved in `build-extraction.py`: `act-5`, `deep-3` ③④, `ict` → module 4; elements re-read at 100 dpi (p. 10, 16, 18) set `verified: True`. Act-5 ③ (marking A(3,2), B(3,14) on a graduated line) belongs to `adad-ashri-mustaqim-mudarraj`.
- **New lab `ruler-compare`** (MANIPULATION_CONTRACT §2quatervicies; differs from `decimal-comma` (the hand holds the comma) in what the hand holds: the GRADUATION of a measuring ruler shared by the compared numbers). World `jump` (theme `sandpit`): a number reads as a whole count of graduations + an exact hatched leftover; the verdict `< = >` is refused while the ruler cannot separate the two numbers; level 2 sorts a row on a podium (drag, tap-tap, keyboard). Standalone use in module 3. LabCoach, always-open « جرّب أعدادك », discovery and formal phase. Built by a lab author; screenshots at 768×1024, 1024×768, 1280×800, 1366×768, 1920×1080 reviewed (tape rescaled, knob/labels, order height 850 → ~740 px). Open: at 1024×768 the solved state needs a short scroll (833 px); pointer drag of an order token tested only through tap-tap in the browser. Exact arithmetic added to `packages/core/arithmetic/decimals.js` (`readAt`, `decidedAt`, `minGraduation`).
- **الكفاءات (draft → final, order kept):** P1 + « (مكتوبين بالفاصلة أو على شكل كسرين عشريين) … بمقارنة الجزأين الصحيحين ثم الأرقام رتبة برتبة »; P2 + « غير ضرورية ليصير للعددين عدد الأرقام نفسه بعد الفاصلة (مثل 3,2 = 3,20) »; P3 + « وتشكيل أصغر أو أكبر عدد عشري من أرقام معطاة » (`deep-3` ③④). `pointPrerequisites`: P1 ← `1am_kitabat-adad-tabii_P2`, `1am_kusur-ashriya-kitaba_P2` (net link `1am.m1.r02 → 1am.m1.r04`); P2 ← `1am_kusur-ashriya-kitaba_P2`, P1; P3 ← P1, P2; `prerequisiteLessonCodes` + `kusur-ashriya-kitaba`. No other lesson edited (no loop; the open point ikhtizal P2 vs hasil-qisma P1 left as is).
- **Bank:** 50 sheets / 201 questions (19 `term_exam`, 20 `term_exam_modelled`, 11 `adapted`; all « على منوال اختبار الفصل الأول »), `content/practice/1am/muqaranat-adad-ashriya/`, oracle `scripts/practice-oracle/muqaranat-adad-ashriya.mjs`, ten `MISC-MUQARANA-*`. Cards sheets read `deep-3` as 0,379 / 970,3.
- **Gates:** `npm test` (core 846 · web 10215 · scripts 11702), `check:lessons` (entry 323.2 KB gzip ≤ 330), `build`, browser `e2e/lesson-kit/1am-muqaranat-adad-ashriya.mjs`, block added to `moyen-retrofit-phase1.mjs` (green), `lesson-route-boundary.mjs`. Local DB: imported, 9 modules and 50 exercises published.
- **URL:** `/courses/moyen/1am/ansab_al_aadad_wal_hisab/muqaranat-adad-ashriya`.

### 3. `masahat-muhit-sath` « مساحة سطح مستو ومحيطه » (1AM, unit 11 `sutuh-masahat-muhitat`) — published — the FIRST lesson of the unit
- **Unit seeded** (`lessons/moyen/1am/handasa/sutuh-masahat-muhitat/_unit/`, `CHAPTER_ID handasa`, `CHAPTER_TITLE « ميدان الأنشطة الهندسية »`, the three one-line bindings) and the WHOLE unit extracted: `docs/sources/1am/unit11/{extraction.json, build-extraction.py, brief-authors.md}` — printed pp. 147–160 (PDF 147–161; printed p. 150 is DOUBLED at PDF 151, PDF = printed + 1 from p. 151). Figures on squared paper are read as cell rows and area / perimeter are COMPUTED (prep 2–3, act-1). The unit is not complete (`wahdat-tul-masaha`, `mustatil-murabba-masaha`, `masahat-muthallath-qaim`, `muhit-qurs` and the synthesis are `coming_soon`: 57 elements pending): no synthesis. Boundary written in the script header (units mm²…km², `P = 2(a+b)`, `A = a × b`, right-triangle area and π belong to the next lessons).
- **Lesson:** 9 modules (أستعدّ · نشاط « حوش الزليج » · معارف · طريقة « أعيّن المساحة برصف » · أتمرّن (7 steps) · 3 مسائل · إختبار أولي), 86 min whole, 62 without the مسائل (catalogue `durationMinutes` 62; 6 / 14 / 10 / 12 / 14 / 8×3 / 6). Entry designed by the platform (config header): the book's نشاط 1 (a table of area / perimeter of four figures, answered by counting) rejected as entry and posed in أتمرّن; cutting pieces on paper and eyeballing ready-made figures rejected. The honeycomb text (تمهيد) is a card closing معارف.
- **New lab `tile-yard`** (MANIPULATION_CONTRACT §2quinvicies; no existing area / perimeter lab; it differs from every other lab in what the hand holds: ONE TILE, a unit area). World `yard` (theme `courtyard`): 12 zellige tiles that are only MOVED — the area (tiles) never moves, the perimeter (fence sticks) changes; « أمشِ حول السياج » (a girl in hijab walks the fence), « أحتفظ بهذا الحوش » (a notebook); refusals `detached` / `splits` / `hole` / `rope`; مبتدئ shortest fence then exactly 20, متقدم a ROPE of 12: areas 5…9. World `floor` (module 3, `levels={false}`): a terrace with whole tiles and half tiles (14 + 4 halves = 16), then a double unit (21 = 10,5). Exact maths in `packages/core/arithmetic/surfaces.js`. LabCoach, 5 sizes reviewed by the lab author (768×1024, 1024×768, 1280×800, 1366×768, 1920×1080). `levels.test.js`: one branch added (rope ranks above fence). Open: at 1024×768 with the menu open the cells are 26–35 px (targets below 44 px; buttons 44–48).
- **الكفاءات (draft → final, order kept):** P1 + « (طول حدّه، يُعدّ بوحدات الطول على حدّه) … (الحيّز الذي يشغله، يُعدّ بوحدات المساحة التي تغطّيه) »; P2 + « والتعبير عن المساحة نفسها بوحدتين مختلفتين بينهما علاقة (إحداهما ضعف الأخرى) » (method-1: 21 = 10,5); P3 made explicit in both directions « سطحان لهما نفس المساحة دون نفس المحيط، وسطحان لهما نفس المحيط دون نفس المساحة ». `pointPrerequisites`: P2 ← P1, P3 ← P1, P2 (the net has no edge into `1am.m2.r06/r07`); `prerequisiteLessonCodes` unchanged (empty); no other lesson edited. The forward net link `1am.m2.r06 → 1am.m2.r08` is for `mustatil-murabba-masaha`.
- **Bank:** 50 sheets / 235 questions (13 `term_exam` modelled on `1am-s1-96`, `1am-s2-62/64/70/77/78/80`, `1am-s3-39`; 32 `term_exam_modelled`; 5 `adapted`), `content/practice/1am/masahat-muhit-sath/`, oracle `scripts/practice-oracle/masahat-muhit-sath.mjs` (areas by shoelace, perimeters by boundary edges, figure segments checked against the cells), 11 `MISC-MASAHA-*`. No corpus exercise is tagged `1am.m2.r06/r07`: the nearest register (fence length and cost, an entrance subtracted) is used with this lesson's concepts only. Open: the 1AM bank row of `EXERCISE_CONTRACT.md` was not extended with the boundary-figure convention (cell polygons + bold fence segments).
- **Gates:** `npm test` (core 870 · web 10316 · scripts 11920), `check:lessons` (entry 323.3 KB gzip ≤ 330), `build`, browser `e2e/lesson-kit/1am-masahat-muhit-sath.mjs` (all green at the five sizes), block added to `moyen-retrofit-phase1.mjs`, `lesson-route-boundary.mjs`. Graph: the « الأطول سياجًا هو الأكبر؟ » mistake node was dropped (it collided with an edge label in the layout test; the idea is carried by module 1 step 3 and the `thalath-hallat` item). Local DB: imported, 9 modules and 50 exercises published.
- **URL:** `/courses/moyen/1am/handasa/masahat-muhit-sath`.

### Batch 4 summary
Three lessons published on `dev`: `kusur-ashriya-kitaba` (lab `decimal-comma`), `muqaranat-adad-ashriya` (lab `ruler-compare`) and `masahat-muhit-sath` (lab `tile-yard`, a new unit seeded). New labs each differ in what the hand holds (comma, graduation, tile). Patterns reused: lab on top and one track per module, lessons NEVER pointing to the book, figures as data (guide §3 « Batch 4 entry 3 »). Open points: the overlap `ikhtizal-kitaba-kasriya` P2 vs `hasil-qisma-kasr` P1 / `kusur-ashriya-kitaba` P2 (owner decision); the small cell size of `tile-yard` at 1024×768 with the menu open.

## Method retrofit, phase 1 (2026-10-15)

The five generated lessons (`mana-jam-tarh`, `qisma-iqlidiya-baqi`, `qawaid-qabiliyat-qisma`, `qisma-iqlidiya-hasr`, `ikhtizal-kitaba-kasriya`) were retrofitted to « the textbook is the reference, not the script » (guide §4ter–§4quinquies): lab on top with no card / workspace title / lead, questions on what the student did (WHY, not a repeated calculation), bricks and naming boxes after the answer, the design written in each `lesson.config.js` header. Table and judgement calls: [`LESSON_METHOD_RETROFIT.md`](LESSON_METHOD_RETROFIT.md). The same day their five labs (`story-bars`, `division-jumps`, `digit-cards`, `egg-trays`, `fraction-knife`) received the LabCoach onboarding ([`LAB_COACH_ROLLOUT.md`](LAB_COACH_ROLLOUT.md)). Browser check: `apps/web/e2e/lesson-kit/moyen-retrofit-phase1.mjs`. Phase 2 started the same day: the eight lessons of 4AM unit 1 « الأعداد الطبيعية والناطقة » — then 4AM units 2–14 (all remaining 4AM lessons, phase 2): [`LESSON_METHOD_RETROFIT_PHASE2.md`](LESSON_METHOD_RETROFIT_PHASE2.md).

## Methodology correction (owner, 2026-10-14) — pending validation

The owner found the generated lessons copying the textbook (activity as the entry, its questions as steps, its order) and
modules with two competing starts (a card of textbook questions above a lab that has its own question). Rule written in
`LESSON_DEVELOPMENT_GUIDE.md` §4ter (the textbook is the reference of الكفاءات, not the script) and §4quater (one track per
module: act → answer about what you did → name it). Applied to ONE lesson, `kitabat-adad-tabii`:
- module 1: no brief, no workspace title/lead — the pencil lab is the top; three steps on the student's own lab numbers (the
  two 7s of 2577, one pencil more on 999, the 0 of 2017); the book's نشاط 1 moved to أتمرّن (`EX['act-1']`, destination
  module 4); new `ADAPTATION_REASONS` value `platform_designed_entry`;
- module 2 (معارف): opens on the dictation lab (7065, 4 908 732, moved from module 1's advanced level); question → book box →
  brick (the definitions no longer head the module);
- module 3 (طريقة): the money lab at the top, the brief that asked the question removed;
- module 5: the brief no longer states the facts the module asks for.
- **Onboarding prototype (same day, same lesson):** `LabCoach` on the `rank-exchange` labs of modules 1–3 (prop `coach`):
  a pulsing ring + one-sentence bubble on the button the student needs now, shown once, hidable (« فهمت » / « إيقاف الإرشاد » /
  Esc / the switch under the question). Contract MANIPULATION_CONTRACT §8quater, DNA §17.11; screenshots reviewed at 1280, 390, 320.
  Validated by the owner the same day: now MANDATORY for every manipulation — rollout in `LAB_COACH_ROLLOUT.md`.

**After the owner validates, extend to the other generated lessons** (1AM–2AM batches 1–2, then the 4AM units) and add a gate
(e.g. a lab module with a `brief`, or a `ManipulationWorkspace` with `title`/`lead`, fails `check:lessons`).

## Queue reorder (owner, 2026-10-20) — what 4AM needs NOW

The 4AM students already use the platform, so the queue now starts with their CURRENT needs. The new **Phase A**
(`LEARNING_NET.md` §4bis) takes the 4AM units in textbook order. For each lesson it takes only the DIRECT earlier-year
prerequisites, from the most recent year (3AM, otherwise 2AM, otherwise 1AM). Phase A has 35 entries:
- U2: `quwat-adad-nisbi`, `khassiyat-fitaghuras`, `tabsit-hadhf-aqwas`;
- U3: `nashr-jabri-3am`;
- U4: `musawiyat-amaliyat`, `muadalat-darajat-ula`, `muqarana-nisbiya`;
- U6: `rabi-mutanasib`, `tanasub-tamthil-bayani`, `nisba-miawiya-3am`, `haraka-muntazama-sura` + synthesis
  `wadiya-idmajiya-tanasubiya-sura`;
- U7: `qimat-ibara-harfiya`;
- U8: `fiat-takrarat`, `mutawassit-mutawazin`;
- U9: `amaliyat-natiqa`, `tanasub-atwal-muthallath`;
- U10: `jayb-tamam-zawiya`, `hisab-jayb-tamam`, `mustaqimat-mutaamida-mutawazia`;
- U11: `suwar-ashkal-insihab`, `tarif-mutawazi-adla`;
- U12: `talim-nuqta-mustawi`, `masafa-nuqtatayn`;
- U13: `qays-zawiya-minqala`, `daira-mustalahat`, `mudallaat-zawiya`, `majmu-zawaya-muthallath`;
- U14: `manzur-mutasawi-qiyas`, `ustuwana-dawaran-wasf`, `masahat-qurs`, `mawshur-qaim-wasf`, `wasf-tamthil-haram`,
  `miqyas-kharita-mukhattat`, `hajm-haram`.

Units 1 and 5 add nothing: unit 1 is covered by the published lessons, unit 5 by `muadalat-darajat-ula`. The full chains
of the previous rule follow as Phase B; the old head `mustatil-murabba-masaha` is now #36. `hall-mushkil-muadala` (2AM) and
`wasf-mutawazi-mustatilat` (1AM) are not in Phase A because a more recent lesson there extends their item.

## Batches 5–8 (2026-10-20 → 10-21) — Phase A « what 4AM needs NOW », queue entries 1–10 (all published)

Organisation: one lead per lesson (three in parallel, then the freed slot), each with a lab author and a bank author working from the unit's
`brief-authors.md`; one dev-server port per lead (5173 / 5174 / 4173 — the local API's CORS allows only these). The coordinator reviewed the
lab screenshots, ran the full gates and published each lesson in the LOCAL database (lesson, 9 modules and 50 practice exercises set to
`published`) as soon as it was done. Lessons: 3AM `quwat-adad-nisbi`, `khassiyat-fitaghuras`, `tabsit-hadhf-aqwas`, `nashr-jabri-3am`,
`musawiyat-amaliyat`, `muadalat-darajat-ula`, `tanasub-tamthil-bayani`, `nisba-miawiya-3am`; 2AM `muqarana-nisbiya`, `rabi-mutanasib`.
Seven units were seeded and extracted whole: 3AM units 3, 4, 5, 6, 11 (`docs/sources/3am/unit{3,4,5,6,11}/`) and 2AM units 3, 5
(`docs/sources/2am/unit{3,5}/`). Each lesson: 9 modules (أستعدّ · نشاط · معارف · طريقة · أتمرّن · 3 مسائل · إختبار أولي), a new lab, a 50-sheet bank.

| # | Lesson | Lab (what the hand holds) | Bank (`term_exam` / modelled / adapted) |
|---:|---|---|---|
| 1 | `quwat-adad-nisbi` (3AM) — the FIRST 3AM lesson | `power-train` — the exponent n, signed train length | 16 / 23 / 11 |
| 2 | `khassiyat-fitaghuras` (3AM) | `pythagoras-tanks` — the angle at A or the length BC | 16 / 27 / 7 |
| 3 | `tabsit-hadhf-aqwas` (3AM) | `like-terms` — a term (wooden pieces), brackets world | 15 / 35 / 0 |
| 4 | `nashr-jabri-3am` (3AM) | `area-split` — the cut line and the sign of each parcel | 16 / 11 / 23 |
| 5 | `musawiyat-amaliyat` (3AM) | `equality-lanes` — the number c of an operation and who receives it | 17 / 26 / 7 |
| 6 | `muadalat-darajat-ula` (3AM) | `term-ferry` — the sign of a carried term, then the divisor | 14 / 29 / 7 |
| 7 | `muqarana-nisbiya` (2AM) | `zero-probe` — the distance to zero of a sensor on a cable | 8 / 42 / 0 |
| 8 | `rabi-mutanasib` (2AM) | `fourth-gauges` — the missing cell of a price table | 7 / 31 / 12 |
| 9 | `tanasub-tamthil-bayani` (3AM) | `pin-rails` — a pin on its rail, a ruler on two nodes | 8 / 22 / 20 |
| 10 | `nisba-miawiya-3am` (3AM) | `hundred-grid` — t painted cells of a 10×10 tray | 7 / 34 / 9 |

- **Fidelity rule applied during review:** a `term_exam` sheet is a faithful corpus exercise; sheets that only keep a paper's situation are
  `term_exam_modelled` (6 sources of `muqarana-nisbiya` relabelled; `rabi-mutanasib`, `tanasub-tamthil-bayani` and `nisba-miawiya-3am` ship fewer
  than 15 `term_exam` because the 2AM/3AM corpus holds few faithful exercises on those topics).
- **الكفاءات:** order kept everywhere, wording sharpened only (every change is listed in each lesson's `lesson.config.js` header history and in the
  agents' reports). `pointPrerequisites` are intra-lesson, plus the first cross-lesson edges between published lessons: `nashr-jabri-3am` ←
  `tabsit-hadhf-aqwas` (P1←P3, P4←P1), `muadalat-darajat-ula` ← `musawiyat-amaliyat` (P1, P2).
- **Shared infrastructure added:** LabCoach `prefer` / `noFlip` on a coach step (`primitives/labCoach.js`, tested); `e2e/moyen-draft-grades.mjs`
  adapted (3AM now has published lessons); `units_{2am,3am} › challenge.sourceElementId` set for the units whose تحدّ is cited.
- **Owner report, 2026-10-21 — `rabi-mutanasib` نشاط, mission 3 « not clear »:** the refusal text showed a raw fraction (« يعطي 130 مقابل 551/6 »),
  the stepper clipped « 551 », and the decoy question said « أضئ ميزان الفرق ». Fixed: verdicts now write both sides as calculations
  (« 520 ÷ 4 = 130 بـ 551 ÷ 6 ≈ 91,8 », `fourthGauges.js › calcText`, LTR isolates with non-breaking spaces), the decoy question states the two end
  states, the number scales down with its digits. Rule written in MANIPULATION_CONTRACT (§2tertricies, « Verdicts say the CALCULATION »).
- **Open for the owner:** `area-split` folds « جرّب أعدادك أنت » into a closed `LabFold` only at 1024×768 with the sidebar open (to keep one screen);
  the rule says always open. At 1024×768 the `pythagoras-tanks` machine is small (the lesson column is 414 px) and its coach bubble covers part of it.
- **Gates (final tree):** `npm test` core 965 · web 11794 · scripts 13777; `npm run check:lessons` every step green (entry 325.5 KB gzip ≤ 330);
  `npm run build`; per-lesson browser e2e (`3am-quwa-nisbiya`, `3am-fitaghuras-jayb-tamam`, `3am-ibarat-harfiya-3`, `3am-ibarat-harfiya-3-nashr`,
  `3am-musawiyat-mutabayinat`, `2am-adad-nisbiya-2`, `2am-tanasubiya-2am`, `3am-tanasubiya-sura`, `lesson-route-boundary`, `moyen-draft-grades`).
  Local DB: the ten lessons, their 90 modules and 500 exercises are `published`.
- **URLs:** `/courses/moyen/3am/ansab_al_aadad_wal_hisab/{quwat-adad-nisbi,tabsit-hadhf-aqwas,nashr-jabri-3am,musawiyat-amaliyat,muadalat-darajat-ula}`,
  `/courses/moyen/3am/handasa/khassiyat-fitaghuras`, `/courses/moyen/3am/tanasubiya_duwal/{tanasub-tamthil-bayani,nisba-miawiya-3am}`,
  `/courses/moyen/2am/ansab_al_aadad_wal_hisab/muqarana-nisbiya`, `/courses/moyen/2am/tanasubiya_duwal/rabi-mutanasib`.
- **Next (Phase A):** #11 `haraka-muntazama-sura` + the synthesis `wadiya-idmajiya-tanasubiya-sura` (closes 3AM unit 6), then `qimat-ibara-harfiya`
  (4AM unit 7), `fiat-takrarat`, `mutawassit-mutawazin`, … (`docs/curriculum/GENERATION_QUEUE.md`, run `node scripts/learning-net-queue.mjs`).

## Next batch — prompt

Phase A entries 1–10 are published (see « Batches 5–8 »). The queue now continues at Phase A #11 `haraka-muntazama-sura` (3AM unit 6, whose
extraction `docs/sources/3am/unit6/` already exists — move its destinations in `build-extraction.py`), then the synthesis
`wadiya-idmajiya-tanasubiya-sura` and `qimat-ibara-harfiya` (`docs/curriculum/GENERATION_QUEUE.md`; run `node scripts/learning-net-queue.mjs` first). Organisation that worked twice: a lead per lesson (phase 1: seed + extraction + brief; phase 2: lesson), a lab
author and a bank author per lesson from the brief. Paste:

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
   LEARNING_NET §4, in a folder named exactly like the lesson code. FIRST design it (guide §4ter): the textbook is the
   REFERENCE of the الكفاءات, not the script — choose the entry point (compare the book's activity with at least one
   platform situation where the idea becomes necessary for the hand), the examples and the order of ideas, and write the
   choice in the lesson.config.js header; every module is ONE track (guide §4quater: the lab at the top with no card above
   it, then questions on what the student did, then the name). Then: « أستعدّ » measures every review-link item; nothing
   noRebuildForLesson lists is rebuilt; pointPrerequisites only along net links; the lab follows MANIPULATION_DNA with
   two levels and meets its §17 Gen Alpha quality bar (push the UI/UX to the limit; the shared kit and KidFigure — girls in
   hijab; no title — context then ONE direct question naming the goal and end state, §17.9; screenshots of initial and mid-activity states at four sizes, reviewed and iterated; the LabCoach onboarding on the lab — MANIPULATION_CONTRACT §8quater, default on; the module redesign checklist of guide §4quinquies); knowledge map, « أتوقّع القاعدة », « مسائل », values woven into story contexts. Lab strings go to
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
