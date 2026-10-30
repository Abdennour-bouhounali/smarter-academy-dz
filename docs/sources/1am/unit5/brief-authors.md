# 1AM unit 5 « الأعداد النسبية » — authors' brief (lesson `adad-nisbiya-siyaqat`, 2026-10-30)

Cycle moyen rollout, phase 3 — same organisation as `docs/sources/1am/unit2/brief-authors.md` and `unit4/brief-authors.md`. The lead writes the lesson
(`apps/web/src/lessons/moyen/1am/ansab_al_aadad_wal_hisab/adad-nisbiya/adad-nisbiya-siyaqat/`) and the extraction (`extraction.json`, built by
`build-extraction.py`; the unit is seeded: `adad-nisbiya/_unit/`). Design card: `docs/curriculum/PLAN_1AM_NUMBERS.md` « 2 ».

| Author | Owns | Never touches |
|---|---|---|
| **Lab** | `manipulations/operations/FrostGauge.jsx` (+ `frostGauge/art.jsx`), `manipulations/logic/frostGauge.js` (+ `.test.js`), `operations/frostGauge.render.test.jsx`, the `frost-gauge` entries of `levels.js`, `levels.test.js` and `manipulationRegistry.js`, the `frostGauge` namespace of `lesson.manipulation.json`, `packages/core/arithmetic/signedGauge.js` (+ test), the type in `manipulationTypes.js` and the theme `winterdjelfa` in `manipulationLevels.js`, its section in `MANIPULATION_CONTRACT.md` (§ 2novenquinquagies terdecies) and its row in `MANIPULATION_DNA.md` | the lesson folder, `content/practice/**`, the extraction |
| **Bank** | `content/practice/1am/adad-nisbiya-siyaqat/**`, the lesson's entries in `content/practice/{active,exam-style,policy,misconceptions}.json`, `scripts/practice-oracle/adad-nisbiya-siyaqat.mjs` and its import in `scripts/practice-answer-oracle.test.mjs` | the lesson folder, the lab, the extraction |

## The lesson in one paragraph

« الأعداد النسبية وسياقات استعمالها » (textbook نشاط 1 p. 65, معارف 1 and the « distance to zero — opposites » paragraph of معارف 2 p. 67, exercises 1–9 p. 71, أقوّم 1 and 4 p. 73,
أتعمّق 1 p. 74, the opener p. 63). Programme item `1am.m5.r05` « إدراج الأعداد السالبة في وضعيات متنوّعة ». The idea the student must DISCOVER: **a quantity measured from a
reference zero needs numbers on BOTH sides of it; a number has a SIGN (which side) and a DISTANCE to zero (how far) — two different readings of one level; two numbers are
OPPOSITES when they have the same distance and opposite signs; 0 is its own opposite and is both positive and negative.** The entry (platform-designed, not the book's map): a week
of January mornings in Djelfa, each reading given IN WORDS, the hand puts the liquid on it; then an altitude gauge (the Chott below sea level), then a mirror on the 0.

**Boundary with the next lessons (no duplication).** `talim-mustaqim-mudarraj` grades a LINE on both sides of O and reads / places an abscissa (lab `stride-stamp`); `talim-fi-mustawi` the frame. This lesson never grades a line:
every number is read on a vertical gauge already graduated. Final الكفاءات (`1am_adad-nisbiya-siyaqat_P<n>`, order kept, one change): P1 gains « طوابق العمارة »; P2 sign vs distance to zero; P3 two opposite numbers. No `pointPrerequisites` (no net predecessor).

Modules: 0 أستعدّ (`1am.m5.r04`, `1am.m1.r04`, six platform statements) · 1 نشاط « أسبوع في الجلفة » (the lab, both levels) · 2 معارف · 3 طريقة (platform addition) · 4 أتمرّن (ex-1, -2, -3, self-4, -6, -7, -8) ·
5–7 مسائل (the Djelfa observatory; `deep-1` redesigned — yearly deviations from a mean; a scouts' altitude gauge) · 8 إختبار أولي (self-1 adapted).

## Lab author — `frost-gauge`

See `MANIPULATION_CONTRACT.md` § 2novenquinquagies terdecies for the fixed task kinds (`set`, `mirror`, `pair`), presets, resistance, chains and DOM contract. Why it is not another lab (DNA §12):
`stride-stamp` (next lesson) stamps a unit stick both sides of O ON A LINE; `zero-probe` / `gap-caliper` / `elevator-reel` are 2AM–3AM; here the variable is the LEVEL of a VERTICAL gauge in three worlds,
read from words.

## Bank author

50 sheets; provenance read from the PDFs: `1am-s3-37` exercise 1 (classify +15, −4,8, −13, 7,9 into positives, negatives, integers) and `1am-s2-72` exercise 1 (true / false incl. « the opposite of a negative is negative »);
the rest `term_exam_modelled` (`1am-s2`, `1am-s3`) or `adapted` from `ex-1`, `ex-2`, `ex-3`, `ex-6`, `ex-7`, `ex-8`, `self-1`, `self-4`, `deep-1`. Every key is re-computed by the oracle; 16 `MISC-REL-*`.
Never ask « is 0 positive? » as a true/false (0 is both).

## Lesson 2 — `talim-mustaqim-mudarraj` « التعليم على مستقيم مدرّج » (2026-10-30)

Programme items `1am.m5.r06` + `r05`; modules 0–8 as in lesson 1; lab `stride-stamp` « خطوة الطابع » (`MANIPULATION_CONTRACT.md` § 2novenquinquagies quaterdecies; `packages/core/arithmetic/graduatedLine.js`); bank 5 × 10 in `content/practice/1am/talim-mustaqim-mudarraj/` (oracle `scripts/practice-oracle/talim-mustaqim-mudarraj.mjs`, `MISC-TALIM1-*`). Elements taken from the extraction (all re-read, `verified: True`): `act-1-line` (the symmetric-point exercise), `act-2` (the lab's `place` task), `know-2` (half-line definition and abscissa paragraphs), `method-1`, `now-68`, `ex-10`…`ex-15`, `self-5` and `self-6` (the final test), `deep-2` (مسألة 2, redrawn), `deep-3`, `deep-4` (the statement says the direction). Boundary with lesson 1: no sign/distance/opposite teaching here (lesson 1), no sum or comparison of relatives (2AM), no frame of the plane (lesson 3). LP edges: P1 ← `1am_adad-nisbiya-siyaqat_P2`, P2 ← `1am_adad-ashri-mustaqim-mudarraj_P2`, P3 ← `…_P3`.
