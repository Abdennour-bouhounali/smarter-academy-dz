# Generation plan — 1AM « ميدان الأنشطة العددية » (units 1–6), the 20 remaining entries (2026-10-30)

**Status:** planned 2026-10-30; generation not started. **Who reads this:** the generating session (Sonnet), one entry at a time.
**Authority:** this file sets the order, the lanes, each entry's design card, the generator prompt and the « successor connection »
step. The contracts stay authoritative for HOW a lesson is built:
- `LESSON_DEVELOPMENT_GUIDE.md` §14;
- `LEARNING_NET.md` §3bis and §4;
- `MANIPULATION_DNA.md` §17;
- `MANIPULATION_CONTRACT.md` §8ter–§8quinquies;
- `EXERCISE_CONTRACT.md`.

The method is the one used for `PLAN_2AM_M1.md`, `PLAN_2AM_M4.md` and `PLAN_3AM_UNITS_1_5.md`. One difference: there are no per-lesson
plan files. Each entry has a **design card** below, and the lead fills its open numbers (step 0 of the prompt).

## Where the domain stands

The programme domain `ansab_al_aadad_wal_hisab` « ميدان الأنشطة العددية » has 6 textbook units and 28 catalogue entries. **8 are
published**:
- `kitabat-adad-tabii`, `kusur-ashriya-kitaba`, `muqaranat-adad-ashriya` (unit 1);
- `mana-jam-tarh` (unit 2);
- `qisma-iqlidiya-baqi`, `qawaid-qabiliyat-qisma` (unit 3);
- `hasil-qisma-kasr`, `ikhtizal-kitaba-kasriya` (unit 4).

**20 remain `coming_soon`**: 14 lessons and 6 syntheses.

| Unit | Folder (`lessons/moyen/1am/ansab_al_aadad_wal_hisab/…`) | Book pp. | `_unit/` + extraction | Remaining |
|---:|---|---|---|---|
| 1 | `adad-tabiiya-ashriya/` | 7–22 | exist (`docs/sources/1am/unit1/`, 72 el.) | `adad-ashri-mustaqim-mudarraj`, `hasr-qiyam-muqarraba`, synthesis |
| 2 | `jam-tarh-ashriya/` | 23–34 | exist (`unit2/`, 56 el.) | `injaz-jam-tarh-mudad`, `rutbat-miqdar-jam`, synthesis |
| 3 | `darb-qisma-ashriya/` | 35–50 | exist (`unit3/`, 75 el.) | `darb-adad-ashriya`, `qisma-ashriya-taqrib`, synthesis |
| 4 | `kitabat-kasriya/` | 51–62 | exist (`unit4/`, 63 el.) | `hasil-qisma-mustaqim`, `akhdh-kasr-min-adad`, synthesis |
| 5 | `adad-nisbiya/` | 63–76 | **to seed** | `adad-nisbiya-siyaqat`, `talim-mustaqim-mudarraj`, `talim-fi-mustawi`, synthesis |
| 6 | `ibarat-harfiya/` | 77–88 | **to seed** | `bahth-adad-naqisa`, `tatbiq-qaida-harfiya`, `intaj-ibara-harfiya`, synthesis |

Notes on the sources:
- The textbook is `docs/official-book-pdfs/كتاب الرياضيات للسنة الأولى متوسط الجيل الثاني.pdf`. It has no text layer: render the pages
  with `pdftoppm -r 110` (zones at 180–200 dpi). For printed pages 1–150, PDF page = printed page (`docs/sources/1am/textbook-map.json`).
- Units 1–4 already map every element to its lesson and module in `extraction.json › destinations`. A remaining lesson takes the
  elements addressed to its code; move them out of « pending » in `build-extraction.py`.
- The term-exam corpus is `docs/Exames-1 AM to 3AM/1am/SEMESTER {1,2,3}/`, indexed in `docs/sources/moyen/exams/exams-index.json`
  (pattern: `EXAM_PATTERN.md` §3 « 1AM »). By term:
  - S1 holds m1: the decimals, ×/÷ 10…, ordering, order of magnitude.
  - S2 holds m3 and m5 fractions: decimal division with a table of approximations, a fraction on a half-line, « أكمل a × … = b ».
  - S3 holds m5 relatives and the frame.
- Well covered (≥ 10 exercises): `1am.m1.r02/r03/r05` and `1am.m5.r01/r10`. Thin: m3 (24 exercises in all) and m5.r05–r09. Expect
  more `term_exam_modelled` sheets there.

## Order and lanes

The order follows the queue (`GENERATION_QUEUE.md`). Phase A comes first: 4AM needs `jidhr-tarbii`, `muadala-ula` and
`tanasub-muamil`, which pull in units 5–6 and `adad-ashri-mustaqim-mudarraj`. The order also follows the net's `requires` links.

| Pair | Lane A — port 5173 | Lane B — port 5174 |
|---:|---|---|
| 1 | `adad-ashri-mustaqim-mudarraj` (U1, r04) | `adad-nisbiya-siyaqat` (U5, r05; **seeds unit 5**) |
| 2 | `talim-mustaqim-mudarraj` (U5, r05 r06; needs both of pair 1) | `bahth-adad-naqisa` (U6, r10; **seeds unit 6**) |
| 3 | `talim-fi-mustawi` (U5, r07) | `tatbiq-qaida-harfiya` (U6, r08) |
| 4 | `wadiya-idmajiya-adad-nisbiya` (U5 synthesis) | `intaj-ibara-harfiya` (U6, r09; needs r08) |
| 5 | `hasr-qiyam-muqarraba` (U1, r04 r05) | `wadiya-idmajiya-ibarat-harfiya` (U6 synthesis) |
| 6 | `wadiya-idmajiya-adad-tabiiya-ashriya` (U1 synthesis) | `injaz-jam-tarh-mudad` (U2, r01 r05) |
| 7 | `rutbat-miqdar-jam` (U2, r06) | `qisma-ashriya-taqrib` (U3, r03 r04 r05) |
| 8 | `wadiya-idmajiya-jam-tarh-ashriya` (U2 synthesis) | `darb-adad-ashriya` (U3, r01 r03 r05 r06) |
| 9 | `hasil-qisma-mustaqim` (U4, r04 r01) | `wadiya-idmajiya-darb-qisma-ashriya` (U3 synthesis) |
| 10 | `akhdh-kasr-min-adad` (U4, r01 r03; needs `darb` for decimal products) | — |
| 11 | `wadiya-idmajiya-kitabat-kasriya` (U4 synthesis) | — |

Rules of the run:
- **One session = one lane.** If only one session runs, take the entries in this order: pair 1 A, 1 B, 2 A, 2 B, …
- Within a lane, entries are strictly sequential. A pair is published before the next pair starts.
- A synthesis starts only after every lesson of its unit is published.
- The catalogue order (what the student sees) never changes. Only the generation order differs from the book.
- **Forward references** (a lesson uses an item taught later in the year): the lesson recalls the item in a « تذكّر » box and never
  builds it. These are:
  - `hasr-qiyam-muqarraba` needs decimal division (`1am.m3.r03`, taught by `qisma-ashriya-taqrib`, pair 7);
  - `tatbiq-qaida-harfiya` needs the rectangle's perimeter and area (`1am.m2.r08`, taught by `mustatil-murabba-masaha`, geometry,
    not yet generated);
  - `adad-ashri-mustaqim-mudarraj` is listed in the queue as using ordering (`1am.m1.r04`), which is already published, so no box is
    needed.

## Lab distinctness (checked 2026-10-30 against `manipulationRegistry.js`; all 14 names are free)

| Lesson | Lab (new type) | What the hand holds | Gesture · drawn world |
|---|---|---|---|
| `adad-ashri-mustaqim-mudarraj` | `jump-tape` « شريط القفز » | the UNIT LENGTH, then a flag's position | stretch the « 1 » mark; drag flags · sports-day long-jump pit with a measuring tape |
| `hasr-qiyam-muqarraba` | `bus-stations` « محطّات الحافلة » | the TWO BOUNDS around a number | plant two stop signs on posts · a road with km posts, lamp posts every 0,1 km |
| `injaz-jam-tarh-mudad` | `column-slider` « مسطرة الأعمدة » | the HORIZONTAL OFFSET of each number strip | slide strips under a fixed rank grid · a shop's order slips |
| `rutbat-miqdar-jam` | `market-estimate` « تقدير السلّة » | the ROUND VALUE chosen for each price | snap price tags to a nearby round value · a weekly market basket and a cashier's receipt |
| `darb-adad-ashriya` | `carpet-grid` « زربية الخلايا » | the TWO DIMENSIONS of a rectangle on a 0,1 m grid | drag the corner, cells of 0,01 m² counted · a carpet workshop |
| `qisma-ashriya-taqrib` | `olive-press` « معصرة الزيتون » | WHEN to convert the remainder to the next unit (L → dL → cL) and when to stop | pour into jars; « break » the remainder · an olive press sharing oil between families |
| `hasil-qisma-mustaqim` | `ribbon-marks` « علامات الشريط » | b, the NUMBER OF PARTS per unit, then a step count | drag a divider handle; step part by part or jump whole units · a tailor's ribbon on a rod |
| `akhdh-kasr-min-adad` | `date-crates` « صناديق التمر » | the SPLIT into b crates and the a crates taken | drag dividers into a heap; tap crates · a date harvest |
| `adad-nisbiya-siyaqat` | `frost-gauge` « ميزان الصقيع » | the TEMPERATURE (sign + distance to 0) | drag the liquid level; the mirror « opposite » · a week of winter in Djelfa |
| `talim-mustaqim-mudarraj` | `stride-stamp` « خطوة الطابع » | the UNIT STRIDE carried on BOTH sides of O | stamp a unit stick from O east and west · a village road, bus stop as origin |
| `talim-fi-mustawi` | `courtyard-drone` « مسيّرة الساحة » | x, THEN y (one axis at a time) | drive along the abscissa axis, then the ordinate axis · a drone over the school courtyard plan |
| `bahth-adad-naqisa` | `rewind-belt` « الحزام المعاكس » | the INVERSE OPERATION card and the found number | run an operation conveyor backward, then forward to check · a packing workshop |
| `tatbiq-qaida-harfiya` | `letter-dial` « قرص الحروف » | the VALUE of each letter | turn a number dial; the value drops into every letter slot · a stationery shop's price rule, a fence rule |
| `intaj-ibara-harfiya` | `rod-train` « قطار العيدان » | the RODS (x-rods and number rods) put on a track | drag rods onto a track; the expression builds itself · a carpenter's rods |

Before writing each lab, the lead re-checks the name in the registry and reads the nearest existing lab's § in
`MANIPULATION_CONTRACT.md`, so the gesture stays distinct:
- `corniche-ruler` and `dig-grid`: the 2AM consolidation of r06/r07;
- `story-bars`: 1AM, stretches an unknown bar;
- `decimal-comma` and `rank-exchange`: 1AM unit 1;
- `fair-share` and `fraction-knife`: 1AM unit 4;
- `tile-yard`: 1AM rectangle area;
- `wax-cells`, `juice-line`, `bridge-load`: 2AM literal calculus;
- `zero-probe` and `elevator-reel`: relatives.

An earlier year never reuses a later year's lab (the net's no-rebuild rule), and no two labs share a gesture.

## Design cards

Conventions:
- **Modules of a lesson**, as in the published 1AM lessons: 00 أستعدّ · 01 نشاط (the lab at the top, nothing above it) · 02 معارف ·
  03 طريقة (when the book has one) · 04 أتمرّن · 05–07 three مسائل · 08 إختبار أولي. Every `ContentModule` has `objectives`.
- **الكفاءات**: the draft `pointsToLearn` are kept in order. The lead may make an item explicit (as earlier leads did), with each
  الكفاءة ≤ 200 characters. Record every change in the progress report.
- **LP edges** (`pointPrerequisites`) only along a net link, and only toward a published lesson. Read the target P numbers in that
  lesson's `lesson.config.js` before writing them.
- **Contexts** are the platform's own: Algerian, everyday, Islam-respecting. Never the book's story, and never a line pointing to
  the book.

### 1. `adad-ashri-mustaqim-mudarraj` — الأعداد العشرية ونصف المستقيم المدرّج (U1, r04) · pair 1 A

- **Elements:** `act-4` → module 1 (as a later application, not the entry point); `know-5` → 2; `ex-15`, `ex-16` → 4; `self-7`.
- **Entry (lab `jump-tape`):** a school sports day; three long jumps of 2,4 m · 3,1 m · 1,8 m must be flagged on the pit's tape. The
  tape shows only O and nothing else.
  - Step 1: the hand stretches the « 1 » mark (the unit length) until the longest jump fits the pit, then the tape draws ten small
    ticks per unit.
  - Step 2: the hand drags each flag; the abscissa reads live. A wrong « 2,4 » placed at 2 + 4 small ticks of a wrong unit is shown
    off the mark.
  - Level 2: read three flags already planted; one sits between two ticks (bounds).
- **Questions over the lab:**
  - « كم تدريجة صغيرة في الوحدة؟ ماذا يمثّل التباعد بينها؟ » (answer 1/10 = 0,1);
  - « ما فاصلة العلم الأزرق؟ »
- **Named afterwards:** half-line, origin, unit, abscissa, O(0), A(2,4); « في حالات معيّنة لا يظهر المبدأ ».
- **الكفاءات:** keep P1–P3. P2 = read exactly OR by bounds.
- **أستعدّ:** measures `1am.m1.r04` (ordering, published) and `1am.m1.r02`.
- **LP edges:** P2, P3 ← `1am_muqaranat-adad-ashriya_P1` (net `1am.m1.r04 → 1am.m5.r04`).
- **Bank:** S1/S2 papers with a half-line.
- **Successor connection:** none outside 1AM. `talim-mustaqim-mudarraj` (pair 2) and `hasil-qisma-mustaqim` (pair 9) write their own
  edges toward this lesson.

### 2. `adad-nisbiya-siyaqat` — الأعداد النسبية وسياقات استعمالها (U5, r05) · pair 1 B · SEEDS UNIT 5

- **Seed:**
  - `adad-nisbiya/_unit/`, copying the shape of `darb-qisma-ashriya/_unit/` (lessonRoutes, moduleContext, prepDiagnostic + test,
    unitMeta);
  - the whole-unit extraction `docs/sources/1am/unit5/` (`build-extraction.py`, `extraction.json`, `brief-authors.md`), book
    pp. 63–76, every element given a destination; the elements of later lessons stay « pending »;
  - the unit's تحدّ cited in `units_1am › adad-nisbiya.challenge`.
- **Entry (lab `frost-gauge`):** a week of January in Djelfa. Each morning the hand drags the thermometer's liquid to the reading
  given in words (« 3 درجات تحت الصفر »). The scale shows 0 and a sign appears only once the liquid passes below 0.
  - Second scene: the lowest point of Algeria (Chott Melrhir, below sea level) next to a mountain peak, on a vertical altitude
    gauge.
  - « Opposite » mode: the hand drags one level and its mirror follows at the same distance on the other side of 0.
- **Questions over the lab:**
  - « أيّ صباح كان الأبرد؟ »
  - « ما المسافة بين القراءة والصفر؟ »
  - « ما العدد المعاكس لـ −4؟ »
- **Named afterwards:** positive / negative relative number, sign, distance to zero, opposites. 0 is both positive and negative.
- **الكفاءات:** keep P1–P3.
- **أستعدّ:** measures `1am.m5.r04` (decimals on a half-line, published in pair 1) and `1am.m1.r04`.
- **LP edges:** none. The item has no net predecessor.
- **Bank:** S3 papers (relatives).
- **Successor connection:** `talim-mustaqim-mudarraj` (pair 2) writes P ← `1am_adad-nisbiya-siyaqat_P*`.

### 3. `talim-mustaqim-mudarraj` — التعليم على مستقيم مدرّج (U5, r05 r06) · pair 2 A

- **Entry (lab `stride-stamp`):** a straight village road. The bus stop is O; the school lies east and the mosque square lies west.
  - The hand chooses the direction (an arrow) and the unit stride.
  - It then STAMPS the stride from O in both directions; the ticks −1, −2 … appear only when stamped west.
  - It places houses A(−3), B(2,7), C(−1,5).
  - Level 2: read abscissae with a hidden origin, and bound a point between two ticks.
- **Questions over the lab:**
  - « لماذا نحمل الوحدة نفسها في الجهتين؟ »
  - « ما فاصلة البيت الأخضر؟ »
- **Named afterwards:** graduated line (origin, direction, unit), abscissa of a point; symmetric points have opposite abscissae.
- **الكفاءات:** keep P1–P3.
- **أستعدّ:** measures `1am.m5.r04` and `1am.m5.r05`.
- **LP edges** (net `1am.m5.r04 → r06`, `1am.m5.r05 → r06`):
  - P2, P3 ← `1am_adad-ashri-mustaqim-mudarraj_P2`, `_P3`;
  - P1 ← `1am_adad-nisbiya-siyaqat_P2`.
- **Bank:** S3.
- **Successor connection:**
  - `talim-mustaqim-mudarraj-2` (2AM, net `1am.m5.r06 → 2am.m4.r01`, consolidates): its « تذكّر — السنة الأولى » becomes a live link,
    and an LP edge P1 ← this lesson's P3 is added if its config allows.

### 4. `bahth-adad-naqisa` — البحث عن أعداد ناقصة (U6, r10) · pair 2 B · SEEDS UNIT 6

- **Seed:** `ibarat-harfiya/_unit/` and `docs/sources/1am/unit6/` (book pp. 77–88), as in entry 2.
- **Entry (lab `rewind-belt`):** a packing workshop. A machine card (« +9 », « −14 », « ×6 ») took a number of items and gave 54.
  - The hand runs the belt BACKWARD and must pick the inverse card (−9, +14, ÷6) to find the missing input.
  - It then runs the belt forward to check (substitution).
  - The trap card « a − … = b » shows that the missing term of a difference is found by a subtraction (a − b), not by the inverse
    of « − ».
  - Level 2: decimal a and b, and the × case with a division that does not stop (the answer is a fraction, as published in
    `hasil-qisma-kasr`).
- **Questions over the lab:**
  - « أيّ بطاقة تعيد الآلة إلى الوراء؟ »
  - « تحقّق: ماذا يخرج إذا أدخلنا العدد الذي وجدته؟ »
- **Named afterwards:** a missing number written □; the three forms and their inverse operations; check by substitution.
- **الكفاءات:** keep P1–P3.
- **أستعدّ:** measures `1am.m1.r05` (published `mana-jam-tarh`) and `1am.m5.r01`.
- **LP edges:** P2, P3 ← `1am_mana-jam-tarh_P1` (net `1am.m1.r05 → 1am.m5.r10`).
- **Bank:** S2 « أكمل a × … = b » is well covered (≥ 10 exercises).
- **Successor connection:** `hall-mushkil-muadala` (2AM, net `r10 → 2am.m4.r08`, extends): its « تذكّر — السنة الأولى » becomes a live
  link, plus an LP edge.

### 5. `talim-fi-mustawi` — التعليم في المستوي (U5, r07) · pair 3 A

- **Entry (lab `courtyard-drone`):** the school courtyard plan with a frame. The origin is the flag pole; the axes are two painted
  lines.
  - The drone must photograph the fountain at (3 ; −2). The hand drives it along the abscissa axis FIRST, then along the ordinate
    axis (one axis at a time; the drone refuses a diagonal).
  - The swapped-order trap lands the drone on (−2 ; 3), a different place.
  - Level 2: read the coordinates of drawn objects, on squared paper and then on plain paper.
- **Questions over the lab:**
  - « هل يصل المسيّر إلى المكان نفسه إذا بدّلنا العددين؟ »
  - « ما إحداثيا البوابة؟ »
- **Named afterwards:** orthogonal frame, origin, abscissa axis, ordinate axis, M(x ; y) (abscissa first).
- **الكفاءات:** keep P1–P3.
- **أستعدّ:** measures `1am.m5.r06`.
- **LP edges:** P2, P3 ← `1am_talim-mustaqim-mudarraj_P2`, `_P3` (net `r06 → r07`).
- **Bank:** S3.
- **Successor connection:** `talim-nuqta-mustawi` (2AM, net `r07 → 2am.m4.r04`, consolidates): live link and LP edge.

### 6. `tatbiq-qaida-harfiya` — تطبيق قاعدة حرفية (U6, r08) · pair 3 B

- **Forward reference:** the rectangle's perimeter and area (`1am.m2.r08`) come in a « تذكّر » box. Do not rebuild them.
- **Entry (lab `letter-dial`):** a stationery shop's price rule « الثمن = 5 × n + 20 » printed on a card.
  - The hand turns a number dial for n; the value drops into EVERY slot of the letter and the card computes.
  - Level 2: a fence rule P = 2 × (a + b) with two dials.
  - Level 3: a « rule » that claims a + b = a × b. The hand turns the dials until the card shows ≠: one counterexample is enough.
- **Questions over the lab:**
  - « كم يدفع من نسخ 12 ورقة؟ »
  - « هل تكفي قيمة واحدة لنقول إن القاعدة خاطئة؟ »
- **Named afterwards:** literal expression; the convention 2 × x = 2x, a × b = ab (never 2 × 3 = 23); substitution;
  counterexample.
- **الكفاءات:** keep P1–P3.
- **أستعدّ:** measures `1am.m1.r05`. Add `1am.m2.r08` only if the net lists it.
- **LP edges:** none in 1AM (`1am.m2.r08` is not published). Re-check that before writing.
- **Bank:** S3/S2 papers.
- **Successor connection:**
  - `ikhtibar-musawat-mutabayina` (2AM, r08 → 2am.m4.r09);
  - `qimat-ibara-harfiya` (3AM, r08 → 3am.m5.r03, extends);
  - in both: live links and LP edges.

### 7. `wadiya-idmajiya-adad-nisbiya` — synthesis U5 · pair 4 A

- **Structure:** no lab. 00 أستعدّ · 01–06 « الوضعية التدريبية » · 07 analysis of the final situation (the only `ContentModule`, with
  `objectives`) · 08 final test.
- **Models:** `wadiya-idmajiya-kusur-amaliyat` (2AM) and `wadiya-idmajiya-adad-nisbiya-2` (2AM).
- **الكفاءة:** one, with P1 ← the three U5 lessons.
- **Final situation (own context):** a regional weather station network. Temperatures of several towns go on a vertical line; the
  stations are marked on a map frame by coordinates. The student orders the temperatures, finds opposites and reads or places
  stations.
- **Training situations 01–06:** one per الكفاءة of the unit, plus two mixed.
- **Elements:** the unit's « integration » / « evaluation » become application or analysis material. Never copy their story.

### 8. `intaj-ibara-harfiya` — إنتاج عبارات حرفية (U6, r09) · pair 4 B

- **Entry (lab `rod-train`):** a carpenter assembles frames from rods: x-rods of unknown length and 1-rods.
  - The hand drags rods onto a track; the expression builds itself (x + x + 3 → 2x + 3).
  - Then a slider gives x a value and the track measures.
  - Level 2: a calculation program (« اختر عددا، أضف 3، اضرب في 2 ») is translated by laying rods: 2 × (x + 3). Copies of a group
    show why brackets are needed.
  - Level 3 (generalise): the same build for any x.
- **Questions over the lab:**
  - « اكتب طول القطار بدلالة x »
  - « ماذا يصبح إذا كان x = 4؟ »
- **Named afterwards:** produce a literal expression, a length in terms of x, a program as an expression.
- **الكفاءات:** keep P1–P3.
- **أستعدّ:** measures `1am.m5.r08` (published in pair 3).
- **LP edges:** P1–P3 ← `1am_tatbiq-qaida-harfiya_P2` (net `r08 → r09`).
- **Successor connection:** none in the net. The 2AM `ibara-harfiya-intaj` recalls it: turn its « تذكّر — السنة الأولى » into a live
  link (no LP edge; it has no item).

### 9. `hasr-qiyam-muqarraba` — حصر عدد عشري وقيمه المقرّبة (U1, r04 r05) · pair 5 A

- **Forward reference:** decimal division (`1am.m3.r03`) comes in a « تذكّر » box (the queue's « renvoi en avant »).
- **Elements:** `act-6` → 1 (application); `know-8` → 2; `ex-21`…`ex-25` → 4; `self-10`…`self-12`.
- **Entry (lab `bus-stations`):** a road with a bus stop at every kilometre post. The bus has stopped at 1,6 km.
  - The hand plants TWO stop signs: the post just before and the post just after (bounds 1 < 1,6 < 2). Signs that are not
    consecutive posts are refused, shown by a sign that floats.
  - « The nearest stop » = rounding to the unit; « before » / « after » = the approximate values by default / by excess.
  - Level 2: the road zooms to lamp posts every 0,1 km (bounds at the tenth); insert numbers between 1,6 and 1,7.
- **Questions over the lab:**
  - « بين أيّ محطتين تقف الحافلة؟ »
  - « أيّ محطة هي الأقرب؟ »
- **Named afterwards:** bounding, approximate value by default / by excess, rounding to the unit.
- **الكفاءات:** keep P1–P3. P2 may name rounding explicitly, because it carries r05.
- **أستعدّ:** measures `1am.m1.r04` and `1am.m5.r04`.
- **LP edges:** P1, P2 ← `1am_muqaranat-adad-ashriya_P1` (net `1am.m1.r04 → 1am.m3.r04/r05`).
- **Successor connection:**
  - `kasr-hasil-qisma` (2AM, r04 → 2am.m1.r05, extends);
  - `hasr-adad-ushri` (3AM, r05 → 3am.m5.x1, extends);
  - in both: live link and LP edge.

### 10. `wadiya-idmajiya-ibarat-harfiya` — synthesis U6 · pair 5 B

- **Structure and models:** as in entry 7. The model `wadiya-idmajiya-mafhum-muadala` (2AM) is the nearest.
- **الكفاءة:** P1 ← the three U6 lessons.
- **Final situation (own context):** a class prepares a school-fair stand. A price rule is applied, the expression of a stand's
  border length in terms of x is produced, and missing quantities are completed (□ × 12 = 180).

### 11. `wadiya-idmajiya-adad-tabiiya-ashriya` — synthesis U1 · pair 6 A

- **Elements:** `deep-4`, `integration`, `evaluation` (book context: data storage). Take the idea, not the story.
- **Final situation (own context):** a school library digitises its archive.
  - File sizes in Mo and Go are written in decimal form and from words.
  - They are ordered and placed on a graduated half-line.
  - They are rounded to decide how many memory sticks to buy.
- **الكفاءة:** P1 ← the five U1 lessons.

### 12. `injaz-jam-tarh-mudad` — إنجاز عمليات الجمع والطرح والحساب على المدد (U2, r01 r05) · pair 6 B

- **Elements:** `act-2` → 1; `know-1b/c/e` → 2; `method-1`, `method-2`, `now-27` → 3; 21 exercises → 4; `ict`.
- **Entry (lab `column-slider`):** a shop's order slips. Decimal numbers are paper strips above a fixed rank grid (hundreds … hundredths).
  - The hand SLIDES each strip until its comma sits on the comma column. A misaligned strip makes the grid add tenths to units:
    the drawn total turns wrong in front of the student.
  - Level 2: regrouping terms. The hand drags terms into pairs that make round numbers (8,25 + 1,75 = 10).
  - Level 3: durations on a stopwatch board, where 60 s fold into 1 min and 60 min into 1 h (a carry at 60, not at 10).
- **Questions over the lab:**
  - « لماذا تغيّر المجموع عندما تحرّك الشريط؟ »
  - « كم دقيقة في ساعة ونصف؟ »
- **الكفاءات:** keep P1–P3.
- **أستعدّ:** measures `1am.m1.r02`, `1am.m1.r03`.
- **LP edges:** P1 ← `1am_kusur-ashriya-kitaba_P4` (net `1am.m1.r03 → r05`); P2 ← `1am_mana-jam-tarh_P1`.
- **Successor connection:**
  - `silsila-bidun-aqwas`, `silsila-bi-aqwas`, `wasf-silsila-hisab` (2AM, net `1am.m1.r05 → 2am.m1.r01`): live links. Add an LP edge
    only where the 2AM P1 is the calc.
  - `qisma-iqlidiya-baqi` (1AM, net `r01 → m3.r01`): already linked to `mana-jam-tarh`; add only if its config misses r01.

### 13. `rutbat-miqdar-jam` — رتبة مقدار مجموع وفرق (U2, r06) · pair 7 A

- **Elements:** `act-3` → 1; `know-2` → 2; `ex-13`…`ex-15`, `self-4`, `deep-1` → 4.
- **Entry (lab `market-estimate`):** the weekly market basket. Six price tags such as 498,75 DA and 1 205,50 DA.
  - The hand SNAPS each tag to a nearby round value (choose tens or hundreds); a needle shows the estimate.
  - Then the cashier's receipt appears with one wrong total. The estimate's band exposes it without any exact computation.
  - Level 2: choose between mental, exact and calculator computation for three situations.
- **Questions over the lab:**
  - « هل المبلغ المكتوب في الوصل معقول؟ لماذا؟ »
- **الكفاءات:** keep P1–P3.
- **أستعدّ:** measures `1am.m1.r05` and rounding to the unit (`1am.m3.r05`, published in pair 5).
- **LP edges:** P1 ← `1am_mana-jam-tarh_P1` (net `r05 → r06`).
- **Money in Arabic strings:** an LTR isolate (« 498,75 DA »).
- **Successor connection:** `kitaba-ilmiya-rutba` (3AM, net `r06 → 3am.m3.r05`, extends): live link and LP edge.

### 14. `qisma-ashriya-taqrib` — القسمة العشرية والقيمة المقرّبة لحاصل قسمة (U3, r03 r04 r05) · pair 7 B

- **Elements:** `act-5` → 1 (book context: milk; the platform uses its own); `know-4` → 2; `method-3`, `now-44` → 3; `ex-25`,
  `ex-27`…`ex-30` → 4; `self-9`…`self-11`, `deep-2`.
- **Entry (lab `olive-press`):** an olive press shares the oil of a pressing between families.
  - Case 1: 87 L shared between 4 families. The hand pours whole litres into each jar; when the remainder is too small, it
    « breaks » the remainder into decilitres (×10, the next rank after the comma) and pours again, then into centilitres. The
    division stops when the remainder is 0: 21,75 L.
  - Case 2: 158 L between 12. The remainder never vanishes, so the student decides where to stop and reads the approximate values
    by default and by excess to 1 L, 0,1 L and 0,01 L.
- **Questions over the lab:**
  - « ماذا فعلت بالباقي؟ »
  - « هل ستتوقّف القسمة يوما؟ »
- **Named afterwards:** decimal division, exact vs approximate quotient, approximations by default / by excess.
- **الكفاءات:** keep P1–P3.
- **أستعدّ:** measures `1am.m3.r01` (published) and `1am.m1.r03`.
- **LP edges:**
  - P1 ← `1am_qisma-iqlidiya-baqi_P1` (net `m3.r01 → m3.r03`) and ← `1am_kusur-ashriya-kitaba_P4` (net `m1.r03 → m3.r03`);
  - P3 ← `1am_hasr-qiyam-muqarraba_P2`.
- **Successor connection:**
  - `hasr-qiyam-muqarraba` (published in pair 5): its « تذكّر » toward decimal division becomes a live link;
  - `kasr-hasil-qisma` (2AM, r04) and `hasr-adad-ushri` (3AM, r05): live links and LP edges.

### 15. `wadiya-idmajiya-jam-tarh-ashriya` — synthesis U2 · pair 8 A

- **Elements:** `opener`, `deep-2`, `deep-7`, `deep-9`, `integration`, `evaluation`. The book context is a utility bill. The p. 33
  « وضعية تقويم » has swapped clocks (recorded in `discrepancies`).
- **Final situation (own context):** a family trip by bus between two wilayas.
  - Leg durations are added (h/min).
  - The budget lines are added and subtracted with decimals.
  - The order of magnitude checks the total before the exact computation.
- **الكفاءة:** P1 ← the three U2 lessons.

### 16. `darb-adad-ashriya` — ضرب الأعداد العشرية (U3, r01 r03 r05 r06) · pair 8 B

- **Elements:** `act-1`, `act-2` → 1; `know-1` → 2; `method-1`, `now-40` → 3; 15 exercises → 4; `opener`, `self-1`…`self-6`,
  `deep-1/3/4/5/7` (the lead assigns the modules).
- **Entry (lab `carpet-grid`):** a carpet workshop on a floor gridded every 0,1 m.
  - The hand drags the carpet's corner to 3,1 m × 2,4 m.
  - The cells (each 0,01 m²) are counted: 31 × 24 = 744 cells = 7,44 m².
  - So the number of decimals of the product is the total of the factors' decimals, seen as « hundredths of a square metre ».
  - Then the order of magnitude (3 × 2 ≈ 6) confirms the comma.
  - Level 2: ×0,1 / ×0,01 as « a tenth / a hundredth of the carpet », linked to ÷10, ÷100. Commuting and grouping:
    4 × 20,17 × 25 = 100 × 20,17.
- **Questions over the lab:**
  - « كم خلية؟ كم متر مربع؟ »
  - « أين الفاصلة ولماذا؟ »
- **الكفاءات:** keep P1–P4.
- **أستعدّ:** measures `1am.m1.r03`, `1am.m1.r06`.
- **LP edges:**
  - P2 ← `1am_kusur-ashriya-kitaba_P4` (net `r03`);
  - P4 ← `1am_rutbat-miqdar-jam_P1` (net `r05 → r06`);
  - P1 ← `1am_mana-jam-tarh_P1`.
- **Successor connection:**
  - `quwa-adad-ashara` (3AM, r03 → 3am.m3.r01): live link and LP edge;
  - the 2AM `silsila-*` (r05);
  - `qisma-ashriya-taqrib` (1AM, published in pair 7; net `r03 → m3.r03`): add its LP edge.

### 17. `hasil-qisma-mustaqim` — حاصل القسمة على نصف مستقيم مدرّج (U4, r04 r01) · pair 9 A

- **Elements:** `act-2` → 1; `know-2` → 2; `ex-6`…`ex-9` → 4; `self-6`.
- **Entry (lab `ribbon-marks`):** a tailor's ribbon on a graduated rod.
  - The hand drags a divider handle that splits EVERY unit into b equal parts (b = 4, then 5, then 3).
  - It steps a marker part by part to a/b.
  - For 19/5 a « jump a whole unit » button appears (5 parts = 1). The Euclidean division 19 = 3 × 5 + 4 becomes « 3 jumps, then 4
    steps »: 3 < 19/5 < 4.
- **Questions over the lab:**
  - « كم جزءا في الوحدة؟ »
  - « بين أيّ عددين طبيعيين تقع 19/5؟ »
- **الكفاءات:** keep P1–P3.
- **أستعدّ:** measures `1am.m5.r04`, `1am.m5.r01`, `1am.m3.r01`.
- **LP edges:**
  - P1, P2 ← `1am_adad-ashri-mustaqim-mudarraj_P1`, `_P3`;
  - P2 ← `1am_hasil-qisma-kasr_P1`;
  - P3 ← `1am_qisma-iqlidiya-baqi_P1`.
- **Successor connection:**
  - `muqarana-kasrayn` (2AM, r01 → 2am.m1.r08) and `adad-natiq` (3AM, r01 → 3am.m1.r07): live links and LP edges if missing;
  - `talim-mustaqim-mudarraj` (1AM, published, r04 → r06): add an edge only if the net needs it (it already reaches r04 through
    entry 1).

### 18. `wadiya-idmajiya-darb-qisma-ashriya` — synthesis U3 · pair 9 B

- **Elements:** `deep-6`, `deep-9`, `integration`, `evaluation` (book context: decorating a room).
- **Final situation (own context):** a class cooperative prepares bread for a school open day.
  - Flour costs are computed with decimal products.
  - Loaves are shared into boxes (Euclidean division and divisibility).
  - The cost per loaf is a decimal division with an approximate value.
- **الكفاءة:** P1 ← the four U3 lessons.

### 19. `akhdh-kasr-min-adad` — أخذ كسر من عدد (U4, r01 r03) · pair 10 A

- **Elements:** `act-3` → 1 (book context: juice drink; the platform uses its own); `method-1` → 3; `ex-10`…`ex-14` → 4; `aside-58`,
  `self-7`, `self-8`, `deep-3`…`deep-7`, `ict-opinion`; `now-56` item 1.
- **Entry (lab `date-crates`):** a date harvest of 35 kg must be packed; 3/5 of it goes to the market.
  - The hand drags dividers to split the heap into 5 equal crates, then taps 3 crates: (35 ÷ 5) × 3 = 21.
  - The second and third routes play on the same heap: 3 × 35 then ÷ 5, and 0,6 × 35.
  - Level 2: a case where ÷ b does not stop (2/3 of 20) shows why one route is better there.
- **Questions over the lab:**
  - « كم كلغ في كل صندوق؟ »
  - « هل تعطي الطرق الثلاث العدد نفسه؟ »
  - « أيّ طريقة أسهل هنا؟ »
- **الكفاءات:** keep P1–P3.
- **أستعدّ:** measures `1am.m5.r01`, `1am.m1.r05`.
- **LP edges:**
  - P1 ← `1am_hasil-qisma-kasr_P1` (net `r01 → r03`);
  - P1 ← `1am_darb-adad-ashriya_P1` (net `m1.r05 → m5.r03`).
- **Successor connection:** `jida-kasrayn`, `jam-tarh-kusur` (2AM, r03 → 2am.m1.r07/r09, extends): live links and LP edges.

### 20. `wadiya-idmajiya-kitabat-kasriya` — synthesis U4 · pair 11 A

- **Elements:** `integration`, `evaluation`.
- **The book context is not reused.** It is a farm loan; any « interest » theme is forbidden.
- **Final situation (own context):** a school sports field. 2/5 of it is grass and 1/4 is a running track.
  - Fractions are placed on a half-line and compared.
  - Fractions of the area are taken.
  - The fractional writings are reduced.
- **الكفاءة:** P1 ← the four U4 lessons.

## Successor connection (after each publish, coordinator)

For each published successor named in the entry's card:
1. **LP edges:**
   - add `pointPrerequisites` P<n> ← `1am_<code>_P<m>`, only along a net link;
   - add a history line in the successor's `lesson.config.js` header;
   - `curriculum/dz/decomposition.test.js` must stay green. 2AM and 3AM accept earlier-year LP ids; 4AM does not.
2. **Live link:** its « تذكّر — السنة الأولى » becomes a link to the new lesson. The « راجع » panels and
   `EarlierYearReview` light up by themselves.

## The generator prompt (one per entry)

Replace `<CODE>`, `<N>` (unit number 1–6), `<UNIT>` (unit folder), `<PORT>`, `<CARD>` (the card number in this file).

```
You are the lead generator for ONE 1AM lesson of the cycle moyen rollout (phase 3, 1AM « ميدان الأنشطة العددية »).
Repo /home/abdennour/Projects/smarter-academy/smarter-academy-dz, branch dev.

Your lesson: <CODE>. Its design card is « <CARD>. <CODE> » in docs/curriculum/PLAN_1AM_NUMBERS.md. Execute the card. The entry
point, the lab (name, world, what the hand holds), the module list, the الكفاءات and the LP edges are decided. If something is wrong
(a miscomputed number, a lab name taken, a contract it breaks), fix it minimally and record it under « Generator notes » at the end
of PLAN_1AM_NUMBERS.md and in your report.

Step 0 (design): read the textbook pages of the lesson (docs/official-book-pdfs/…السنة الأولى…pdf, pdftoppm -r 110; PDF page =
printed page), its extraction elements (docs/sources/1am/unit<N>/extraction.json › destinations), and the nearest existing lab's §
in MANIPULATION_CONTRACT.md. Fix every number of the lab, modules and مسائل, and compute every answer independently.

Read first: CLAUDE.md, docs/README.md, docs/architecture/LEARNING_NET.md (§3bis, §4), docs/lessons/LESSON_DEVELOPMENT_GUIDE.md
(§3, §4ter–§4quinquies, §6, §6ter, §11 « Publish a lesson », §14, « Generating a 1AM–3AM unit LESSON BY LESSON » and the
« patterns to reuse » notes), docs/architecture/BUNDLE_BOUNDARIES.md §3–§4, MANIPULATION_DNA.md §17, MANIPULATION_CONTRACT.md
(§8ter, §8quater, §8quinquies), EXERCISE_CONTRACT.md (« Term-exam provenance », « Earlier-year review link »,
« Présentation examen (BEM) »), docs/sources/moyen/exams/EXAM_PATTERN.md §3 and §6, docs/reports/LAB_PROTOTYPE_ROLLOUT.md, and the
« Learned in pair N » notes of docs/curriculum/PLAN_2AM_M4.md (bidi, 255-char الكفاءات, memo-card sizes, JSX \frac, knowledge graph
tests, synthesis shape). Model lessons: the published 1AM lessons
apps/web/src/lessons/moyen/1am/ansab_al_aadad_wal_hisab/darb-qisma-ashriya/qisma-iqlidiya-baqi/,
.../kitabat-kasriya/hasil-qisma-kasr/, .../adad-tabiiya-ashriya/muqaranat-adad-ashriya/; for a synthesis the 2AM
.../wadiya-idmajiya-kusur-amaliyat/ and .../wadiya-idmajiya-mafhum-muadala/.

Do, in order:
1. If the card says SEEDS UNIT: seed lessons/moyen/1am/ansab_al_aadad_wal_hisab/<UNIT>/_unit/ (shape of darb-qisma-ashriya/_unit/)
   and build docs/sources/1am/unit<N>/ (build-extraction.py, extraction.json, brief-authors.md) for the WHOLE unit, every element
   given a destination. Otherwise move this lesson's « pending » destinations in the unit's build-extraction.py (small targeted edit).
2. Generate the lesson INTO its catalogue entry (same code, same programmeItems), folder named exactly like the code: modules (each
   ContentModule with `objectives`), the lab (new type, core maths imported BY PATH, strings in
   i18n/locales/ar/lesson.manipulation.json, LabCoach on, KidFigure — girls always in hijab —, no title, context then ONE question,
   the full lab prototype: questions over the lab after each step, stepper, success celebration, sounds off by default with a
   « الصوت » switch, « إعادة », full screen, memo end card with « اختبر ذاكرتك »), knowledge map, « أستعدّ » from the net (every
   review item measured), « تذكّر » boxes for forward references, the الكفاءات of the card (order kept, ≤ 200 chars each),
   `pointPrerequisites` as the card says (verify the target P ids). No student-visible line points to the textbook. Respect Islam
   in every string, icon and emoji (no pig, alcohol, gambling, dice as a game, interest). Never touch App.jsx: run
   `npm run generate:lesson-index`.
3. Practice bank (5 levels × 10 sheets) in content/practice/1am/<CODE>/, oracle scripts/practice-oracle/<CODE>.mjs, misconceptions
   MISC-<KEY>-*; add it to active.json and exam-style.json. `term_exam` only for exercises you actually read in
   docs/Exames-1 AM to 3AM/1am/ (render papers without text with pdftoppm -r 150); otherwise `platform_addition` +
   `reason: term_exam_modelled` + `modelledOn`, or `adapted` from the lesson's textbook elements. A synthesis has no bank unless
   the 2AM model synthesis has one — copy what it does.
4. Gates: the lab's logic + render tests, content.test.js (independent arithmetic), the unit's prepDiagnostic test,
   `node apps/web/scripts/lab-rollout-status.mjs --lesson <CODE>` prints ✅, `cd apps/web && npx vitest run src/lessons/common/knowledge`,
   `npm test`, `npm run check:lessons` (exit 0; entry budget 245 KB gzip — never raise it; no eager module imports catalogue
   names), `NODE_OPTIONS=--max-old-space-size=8192 npm run build`; browser check of every module on port <PORT> at 768×1024,
   1024×768, 1280×800 and 1366×768 (tablet and laptop only, NO phone); lab screenshots of the initial and mid-activity states at
   those sizes, VIEWED and iterated; a lesson-kit e2e apps/web/e2e/lesson-kit/1am-<CODE>.mjs (local API on 127.0.0.1:8000).
5. Catalogue: status `available`, durationMinutes (guide §11 convention: module total without the مسائل), regenerate the lesson
   index and `npm run generate:learning-net`.
6. Documentation sync: the lab's § in MANIPULATION_CONTRACT.md; reusable patterns in the guide's « patterns to reuse »; append the
   entry to docs/reports/MOYEN_ROLLOUT_PROGRESS.md under « 1AM ميدان الأنشطة العددية ».
7. Publish (owner rules): import into the LOCAL database and set the lesson, its modules and its exercises to `published` (nothing
   stays `draft`); commit `feat(lessons): <CODE>`; push to dev. Then apply the card's « Successor connection » and commit it as
   `feat(lessons): connect <successor> to <CODE>`.

Two leads share lessonIndex.generated.json, content/practice/*.json, the registries and the i18n file: small targeted edits after
a fresh read; never regenerate over the other lead's lines.

Final report: URL path; modules; the lab and the screenshots you reviewed; bank counts (term_exam / modelled / adapted /
platform_addition); every الكفاءات change; LP edges written; gates with results; files created or changed; docs updated; fixes to the
card; open points for the owner.
```

## Coordinator steps after each pair

1. Read both reports and look at the lab screenshots.
2. Gates on the tree: `rm -rf apps/web/dist`, `npm test`, `npm run check:lessons`, `npm run build`,
   `node scripts/learning-net-queue.mjs --check`, `npx vitest run curriculum/dz/net` (in `packages/core`), grep for forbidden emoji.
3. One commit per lesson, `feat(lessons): <code>`, then `git push origin dev`.
4. Local DB: export/import the curriculum and the content registry; the lesson's modules and exercises are `published`.
5. Successor connection: gate it, then commit it as `feat(lessons): connect <successor> to <code>`.
6. Progress log entry in `docs/reports/MOYEN_ROLLOUT_PROGRESS.md`; tick the entry's status here.

## Owner questions (defaults applied unless the owner says otherwise)

1. **Run order.**
   - Default: units 5–6 first (Phase A, 4AM needs them), then units 1–4 in book order.
   - Alternative: pure book order (U1 → U6).
2. **Synthesis banks.** Default: as in the 2AM syntheses.
3. **`tatbiq-qaida-harfiya` and the rectangle's perimeter and area.**
   - Default: recalled in a « تذكّر » box (taught later in geometry), not taught here.

## Generator notes

(Leads append deviations here, one line per entry.)

- **1 · `adad-ashri-mustaqim-mudarraj` (2026-10-30).**
  (a) The catalogue entry's `programmeItems` is **`1am.m5.r04`** (and `sourceTopicId` `1am.m5`), not `1am.m1.r04`: the card's « r04 » is the net PREREQUISITE
  `1am.m1.r04 → 1am.m5.r04` (ordering, published `muqaranat-adad-ashriya`). The entry keeps `1am.m5.r04`; « أستعدّ » measures `1am.m1.r04` (items 1–2) and `1am.m1.r02` (items 3–6).
  (b) `prerequisiteLessonCodes` stays `[]` (`coursesData.test.js` requires a prerequisite lesson to come EARLIER in the unit and `muqaranat-adad-ashriya` is `order` 3, after this lesson's 2 — a forward reference of the book); `pointPrerequisites` P2, P3 ← `1am_muqaranat-adad-ashriya_P1` (verified: P1 = comparing two decimals).
  (c) **Extraction error corrected**: `act-4`'s B and C are **1,7 and 0,5** (read at 400 dpi: 17 and 5 small ticks of 35,5 px from O), not 1,9 and 0,6; `act-4`, `know-5`, `ex-15`, `ex-16`, `self-7` are now `verified: True` (discrepancy recorded in `build-extraction.py`).
  (d) The card's worlds overlap with `ruler-compare` (both a sports-day long-jump pit): `jump-tape` has its own theme `sportsday` and a different gesture (the hand STRETCHES the unit, then plants a flag; متقدم: a reading cursor). Level 2 grew from the card's single task to three (a1 flag between two ticks, a2 a tape without its origin, a3 a tape in hundredths) to cover P2's « حتى حين لا يظهر المبدأ » and the book's four graduations.
  (e) **No statement figure draws a graduated half-line** (`StatementFigure` knows plane, space, chart, tape): the bank uses worded positions (« n وحدة و t تدريجة صغيرة », « بين العلامتين … »); module 4 draws the arrows with `NumberLine` (static). A `halfline` figure kind is an open point for the owner.
