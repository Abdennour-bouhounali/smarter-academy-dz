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
