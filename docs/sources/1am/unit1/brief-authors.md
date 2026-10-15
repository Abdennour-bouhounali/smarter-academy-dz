# 1AM unit 1 « الأعداد الطبيعية والأعداد العشرية » — authors' brief (lesson `kitabat-adad-tabii`, 2026-10-14)

Cycle moyen rollout, phase 3 — same organisation as `docs/sources/1am/unit2/brief-authors.md` and `docs/sources/1am/unit3/brief-authors.md`
(read their tables of file ownership: they apply here with the names below). The lead writes the lesson
(`apps/web/src/lessons/moyen/1am/ansab_al_aadad_wal_hisab/adad-tabiiya-ashriya/kitabat-adad-tabii/`) and the extraction
(`docs/sources/1am/unit1/extraction.json`, built by `build-extraction.py`). This is the **very first lesson of 1AM** (order 0): no
prerequisite lesson, and the learning net has NO review link into its item `1am.m1.r02` — « أستعدّ » is the textbook's p. 8.

| Author | Owns | Never touches |
|---|---|---|
| **Lab** | `packages/core/arithmetic/placeValue.js` (+ `.test.js`), `manipulations/operations/RankExchange.jsx`, `manipulations/logic/rankExchange.js` (+ `.test.js`), `manipulations/operations/rankExchange.render.test.jsx`, the `rank-exchange` entries of `manipulations/levels.js` and `manipulationRegistry.js`, the `rankExchange` namespace of `i18n/locales/ar/lesson.manipulation.json` | the lesson folder, `content/practice/**`, the extraction |
| **Bank** | `content/practice/1am/kitabat-adad-tabii/**`, the lesson's entries in `content/practice/{active,exam-style,policy,misconceptions}.json`, `scripts/practice-oracle/kitabat-adad-tabii.mjs` and its import in `scripts/practice-answer-oracle.test.mjs` | the lesson folder, the lab, the extraction, `placeValue.js` |

Already done by the lead: the type `'rank-exchange'` is declared in `packages/core/curriculum/manipulationTypes.js`, and the drawn world
`packing` is in `VISUAL_THEMES` (`packages/core/curriculum/manipulationLevels.js`). Until the lab author adds the `levels.js` and
`manipulationRegistry.js` entries, `levels.test.js` and `manipulationRegistry.test.js` are red on `rank-exchange` (expected — as in batch 1).

## The lesson in one paragraph

« كتابة الأعداد الطبيعية ودلالة الأرقام » (1AM, textbook نشاط 1 « أكوّن أعدادا » p. 9, معارف 1 p. 11 and 4 (a) p. 13, exercises 1–3 and
12 ① p. 17, أقوّم 1 p. 19, أتعمّق 1, 2, 3 (①②), 5 p. 20, « استحضر مكتسباتي » p. 8 items 1–4 and 6). Programme item `1am.m1.r02`
« استعمال الكتابة العشرية والكتابة الكسرية والانتقال بينهما » — shared with the NEXT lesson `kusur-ashriya-kitaba`; the boundary
(net no-duplication rule, decided 2026-10-14, header of `build-extraction.py`):

- **this lesson**: reading and writing a natural number (digits, words, classes of three digits from the right), the RANK of each digit
  in a written number — on both sides of the comma: « الأعشار، الأجزاء من مائة، من ألف » are rank NAMES known from primary school
  (prep item 6) —, « رقم » ≠ « عدد » of a rank for a natural (2017: رقم العشرات 1، عدد العشرات 201), the decomposition of a NATURAL
  (6 392 = 6 × 1000 + 3 × 100 + 9 × 10 + 2);
- **`kusur-ashriya-kitaba`** (later): decimal fractions 1/10, 1/100…, fraction ↔ comma, the decomposition of a DECIMAL (+ 4/10 or
  + 4 × 0,1), « عدد الأعشار » of a decimal, × ÷ 10, 100, 1000. Its own draft P3 (`2,35 = 2 + 3/10 + 5/100`) already holds what this
  lesson's draft P3 example carried — so that part moves there (see « Final الكفاءات »).

The idea the student must DISCOVER: **ten of a rank make ONE of the rank on its left** — so a written number never holds 10 in a
rank: its digit is what is LEFT in that rank once everything is packed, and a place left empty must be kept by a 0. Consequences the
student meets with his own hands: 1 carton + 13 boxes + 24 packs + 37 pencils is NOT « 1 13 24 37 » (it is 2 577); 999 + 1 packs
three times in a cascade (1 000); 2017 pencils make 201 packs of ten, though the tens digit is 1; « سبعة آلاف وخمسة وستون » is 7065,
not 765. Reading a long number is reading it by classes of three from the right (45 671 « خمسة وأربعون ألفا وستمائة وواحد وسبعون »).

Final الكفاءات (`1am_kitabat-adad-tabii_P<n>`, order of the drafts kept):

1. **P1** قراءة عدد طبيعي كبير وكتابته بالأرقام وبالحروف بتجزئته إلى فئات من ثلاثة أرقام — *unchanged.*
2. **P2** تعيين رقم ورتبة كل منزلة (الآحاد، العشرات، المئات، ... الأجزاء من عشرة، من مائة، من ألف) في كتابة عدد، والتمييز بين رقم
   منزلة وعدد وحداتها (رقم العشرات في $2017$ هو $1$ وعدد عشراته $201$) — *added: « رقم » vs « عدد » (textbook ex-1, self-1, prep 1–2;
   it was nowhere in the drafts).*
3. **P3** كتابة عدد طبيعي على شكل مجموع مفكّك (مفكوكه النموذجي) مثل $6\,392 = 6\times1000+3\times100+9\times10+2$ — *changed: the
   decimal part of the draft example (`+ 4/10 + 5/100 + 9/1000`) moves to `kusur-ashriya-kitaba` P3 (decimal fractions are taught
   there, AFTER this lesson — KNOWLEDGE_DEPENDENCY; and the two P3 would duplicate).*

`pointPrerequisites`: P1 ← P2, P3 ← P2 (intra-lesson only; no review link, no earlier lesson).

Lesson plan (the lead writes it, ≈ 87 min): 0 أستعدّ (prep items 1–4, 6 + platform items) · 1 نشاط 1 « أكوّن أعدادا » (act-1 and the
lab, both levels) · 2 معارف (know-1, know-4 a, the natural's مفكوك; « أتوقّع القاعدة »: the classes of three from the right) · 3 طريقة
« رقم المرتبة وعدد وحداتها » (declared platform method on ex-2: the lab's `money` standalone, 1345 DA) · 4 أتمرّن (ex-1, ex-2, ex-3,
ex-12 ①, self-1) · 5 أعداد كبيرة (deep-1, deep-2, deep-3 ①②, deep-5 — the Roman and Egyptian ADDITIVE systems of the opener p. 7
against our POSITIONAL one) · 6–8 three مسائل · 9 إختبار أولي.

## Lab author — `rank-exchange`

Read first exactly what the unit-2 and unit-3 briefs list for their lab authors (MANIPULATION_DNA all — §12, §16 and **§17 incl.
§17.7 « say it once » are binding**; MANIPULATION_CONTRACT §1, §2, §2bis, §4.2, §6bis, §6ter, §7, §7bis-levels, §7ter, §7quater, §8,
§8bis, §8ter (the kit), §9), plus the three newest labs as idioms: `operations/DivisionJumps.jsx` (stretch, `useLessonViewport` budget,
LabKit, narrow layout, bidi isolates), `operations/DigitCards.jsx` (carry gesture with `useDragInteraction`, tap-tap, keyboard, lamps),
`operations/StoryBars.jsx` (`KidFigure`). Lessons learned there apply: Latin numbers isolated in RTL strings, no local test helper named
`t`, one screen at 320×640 checked in the browser, hints closed by default and each one a short THINKING question.

**Lab author must meet MANIPULATION_DNA §17 incl. §17.7 and review screenshots at 1280×800, 1366×768, 390×844, 320×640 of initial and
mid-activity states** (a refused pack, a cascade, the 2017 unpacking half done, the formal phase) for BOTH levels — and report what was
improved after looking at them.

**Why this is not a copy (DNA §12).** 1AM labs so far: `story-bars` (stretch a height until a sentence is true, choose a calc card),
`division-jumps` (b given, stretch q groups along a row / a line), `digit-cards` (colour cells of a table; carry digit cards into SLOTS and
judge divisibility lamps). 4AM labs about integers (`team-builder`, `divisor-explorer-books`, `common-divisors`…) share objects into
groups. Here the hand moves **QUANTITIES BETWEEN RANKS** — it ties ten of a rank into ONE object and carries it one column to the left,
or opens one object into ten of the rank on its right. The written digits are an OUTPUT (what is left in each column), never a card the
student places — the opposite of `digit-cards`, where the digit is the object. What resists: a column holding 10 or more cannot be
written (its digit box overflows); a pack of 9 does not close; a pack carried two columns away or kept in its own column is refused.
Packing by ten is a Euclidean division by 10 (2017 = 201 × 10 + 7 — the link with `division-jumps` is mathematical, not the gesture: no
ribbon, no q to stretch; a CHAIN of exchanges, possibly in cascade).

**Exact arithmetic — `packages/core/arithmetic/placeValue.js` (NEW, yours, imported BY PATH — never the core barrel, BUNDLE_BOUNDARIES §4
rule 9).** Pure integers (`Number.isSafeInteger`, n < 10¹²). API (fixed, the lesson uses it too):

```js
digitsByRank(n)            // { 0: units, 1: tens, … } — digitsByRank(2017) → {0:7, 1:1, 2:0, 3:2}
countOfRank(n, k)          // Math.floor(n / 10**k) — « عدد العشرات » = countOfRank(n, 1); countOfRank(2017, 1) === 201
valueOfCounts(counts)      // Σ counts[k] × 10**k for ANY counts (≥ 10 allowed) — {3:1, 2:13, 1:24, 0:37} → 2577
isWritable(counts)         // every counts[k] ∈ 0..9
decompose(n)               // [{ digit, rank, value }] non-zero ranks from the highest — 6392 → 6×1000, 3×100, 9×10, 2×1
classesOf(n)               // ['4', '908', '732'] — groups of three from the RIGHT
spaced(n)                  // '4 908 732' with U+00A0 between classes (the textbook's « فراغ عقب كل ثلاثة أرقام »)
toArabicWords(n)           // the platform's spelling, byte-identical to words() in docs/sources/1am/unit1/build-extraction.py
RANK_NAMES                 // ['الآحاد', 'العشرات', 'المئات', 'الآلاف', 'عشرات الآلاف', 'مئات الآلاف', 'الملايين', 'عشرات الملايين', 'مئات الملايين', 'الملايير']
```

`toArabicWords` convention (`extraction.json › discrepancies` « words »): 3–9 with ة (خمسة وأربعون ألفا, the textbook's « خمس وأربعون »
is accepted in reading but never written by the platform); « مائة / مائتان / ثلاثمائة… تسعمائة »; classes ألف / مليون / مليار: 1 → ألف,
2 → ألفان, 3–10 → آلاف / ملايين / ملايير, 11–99 → ألفا / مليونا / مليارا, ≥ 100 by the last two digits (00, 01, 02 → singular: مائة ألف,
مائتا ألف (construct dual when nothing follows), 3–10 → plural, 11–99 → accusative); units joined with « و » units before tens (واحد
وسبعون); classes joined with « و »; 0 → صفر. **Test** it against EVERY `words` answer of the extraction (`ex-3`, `know-1`, `deep-2`,
`act-1`, `prep` item 4, `self-1`) read from `extraction.json`, plus a sweep 0..100 000 (no `undefined`, no double space, no « و » at an
end) and spot values (11, 12, 100, 101, 200, 1000, 2000, 3000, 11 000, 200 000, 1 000 000, 2 000 000, 10¹⁰).

**Props contract (fixed — the lesson is written against it):**

```jsx
<Manipulation type="rank-exchange"
  world="pencils" | "tokens" | "money"   // from the level preset; a lesson may force it
  tasks={['pack', 'unpack']}             // the sequence of tasks of the level (preset); or ONE task when levels={false}
  start={{ 3: 1, 2: 13, 1: 24, 0: 37 }}  // 'pack': the counts per rank the stock arrives with (not writable)
  n={2017} rank={1}                      // 'unpack': the number on the board and the rank to count (« كم حزمة من 10؟ »)
  next={999} borrow={1000}               // 'next' / 'previous' / 'borrow' (advanced)
  dictation={[7065, 4908732]}            // 'dictation': numbers given IN WORDS (toArabicWords) to build on the board
  level, levels, title, lead             // as every type (levels={false} for the standalone uses below)
  onTrial={(e) => …}                     // each judged gesture, via state.report:
                                         //   { task, kind: 'pack' | 'unpack' | 'add' | 'remove' | 'predict' | 'answer', rank, ok, counts, value }
  onFinished={({ tasks }) => …}          // the formal phase (or, with levels={false} and no discovery, the task done)
/>
```

`levels.js`:
`'rank-exchange': { beginner: { numbers: { world: 'pencils', tasks: ['pack', 'unpack'], start: { 3: 1, 2: 13, 1: 24, 0: 37 }, n: 2017, rank: 1 }, …P },
advanced: { numbers: { world: 'tokens', tasks: ['next', 'previous', 'borrow', 'dictation'], next: 999, borrow: 1000, dictation: [7065, 4908732] }, …T('act-1') } }`.

**The board (both levels).** One column per rank, the HIGHEST RANK ON THE LEFT, units on the right — a number is written left to right
even in an Arabic page, exactly the textbook's « جدول المراتب » p. 13: the board is an LTR island (`dir="ltr"`) with Arabic column
headers (`RANK_NAMES`), and at متقدم the headers are grouped by CLASS (« فئة الملايين | فئة الآلاف | فئة الوحدات », each مئات/عشرات/آحاد).
Under each column, a big digit box shows the column's count when it is 0..9; with 10 or more it shows the count overflowing its box
(two digits squeezed, rose, a small shake) — the number cannot be written. The WRITTEN NUMBER (big, under the boxes) appears only when
every column is writable, with leading zeros dropped and class spaces (`spaced`). Never a running « = 2577 » before that: the total is
what the student must earn (prediction first, see 'pack').

**مبتدئ — `world: 'pencils'` (theme `packing`, platform).** The school club's packing workshop: pencils collected for the pupils of a
mountain school (value: التضامن — one line in the lesson's `lead`, never in the lab). Four columns: كراتين (1000) | علب (100) |
حزم (10) | أقلام (1), each object DRAWN (a pencil; a pack = 10 pencils tied with a rubber band; a box with its lid showing 10 packs; a
carton showing 10 boxes) — honest: a pack is visibly ten pencils. A `KidFigure` packer (a girl in hijab at the table, `mood` reacts)
stands beside the board on wide screens (not on 320 px).
- **Gesture PACK** (the variable: how many objects of a rank are tied): the student SWEEPS a finger/pointer across objects of one column
  (each swept object lifts and gets a number 1, 2, 3…); releasing at exactly 10 ties them (the band snaps, a « stamp ») into ONE object of
  the next rank, which the student CARRIES (drag; tap-tap; keyboard) into the column on the LEFT. Refusals, in the student's numbers:
  `short-pack` (« 7 أقلام لا تكفي لحزمة: الحزمة 10 أقلام » — the 7 drop back), `wrong-column` (a pack dropped in its own column, or two
  columns away: it slides back to the packing tray, « الحزمة مكانها في عمود الحزم »). Keyboard path: focus a column, « ربط 10 » button
  (enabled at ≥ 10), then « انقل يسارًا ».
- **Gesture UNPACK**: drag one object one column to the RIGHT (or its « فتح » button): it opens into 10 objects of that rank (the lid
  lifts, ten fall in). Units cannot be opened (no rank on their right in this lab — decimals are the next lesson).
- **Task `pack`** (start 1 · 13 · 24 · 37, value 2 577 — not writable): FIRST a prediction card « كم قلمًا في الورشة؟ » with three big
  cards built in `logic/` from the start counts: the side-by-side reading `1132437` (`MISC-KITABA-CONCAT`), the sum of the counts `75`
  (`MISC-KITABA-SUMCOUNTS`) and `2577` — any card may be chosen, nothing is judged yet. Then the student packs until every column is
  writable: the written number appears, the prediction card is judged by the board itself (the chosen card glows green or is struck, with
  its own number). Packing order is free (37 → 3 packs + 7 left, then 27 packs → 2 boxes + 7, then 15 boxes → 1 carton + 5…).
- **Task `unpack`** (n = 2017, written: 2 cartons, 0 boxes, 1 pack, 7 pencils): the order says « الطلبية: حزم من 10 أقلام فقط. كم حزمة
  نرسل؟ ». A prediction card first: `1` (the tens digit, `MISC-KITABA-DIGIT-COUNT`), `20` (`MISC-KITABA-RANKSHIFT`), `201`. The student
  opens cartons and boxes until no carton or box is left; a counter of packs counts as he opens (live, it is the variable): 201 packs and
  7 pencils. The board then writes `2017 = 201 × 10 + 7` and the two pills « رقم العشرات: 1 » / « عدد الحزم: 201 » side by side.
- `discoveryReady` = both tasks done (one refusal is NOT required). **Discovery** (`ManipulationDiscovery`): « ماذا يعني رقم مرتبة في
  كتابة عدد؟ » — right: « ما يبقى في تلك المرتبة بعد ربط كل عشرة في واحدة من المرتبة التي على يسارها »; wrong, refuted with the
  student's own numbers: « عدد القطع التي في العمود كما وصلت » (refuted: 1 · 13 · 24 · 37 written side by side is 1 132 437, the board
  shows 2 577), « عدد كل وحدات تلك المرتبة في العدد » (refuted: 2017 has tens digit 1, and he sent 201 packs). **Formal**: the « جدول
  المراتب » of 2017 with the digit roles (رقم الآحاد 7 …), `2017 = 2 × 1000 + 1 × 10 + 7` (= `decompose`, zero ranks shown greyed in
  the table, absent from the sum), and the pair رقم / عدد per rank (the textbook's ex-1 table, filled from the board: 7 / 2017, 1 / 201,
  0 / 20, 2 / 2).

**متقدم — `world: 'tokens'` (textbook act-1 ③, know-1 p. 11, prep 3).** No drawn pencils (too many): round TOKENS stamped with their
rank value (1, 10, 100, 1 000 … 1 000 000), one colour per CLASS, on the 7-column class board. Same gestures (sweep 10 → one token,
carry left; open → ten tokens right), plus « +1 » / « −1 » on the units column and ± on any column for the dictation (round −/+
buttons of the kit, keyboard ↑/↓).
- `next` (act-1 ③, board 999): « العدد الذي يلي تسعمائة وتسعة وتسعون »: the student adds one unit token → 10 units → he must pack →
  10 tens → pack → 10 hundreds → pack → 1 000 « ألف ». Each pack is his gesture; the board refuses to write while a column holds 10.
- `previous` (act-1 ③, board 999): remove one unit → 998 (one gesture — the contrast with `next`).
- `borrow` (platform contrast, board 1 000): « العدد الذي يسبق ألفًا »: there is no unit to remove — the student must OPEN the thousand
  (10 hundreds), one hundred (10 tens), one ten (10 units), then remove one: 999.
- `dictation` (prep 3, know-1): the number is GIVEN IN WORDS (`toArabicWords`: « سبعة آلاف وخمسة وستون », then « أربعة ملايين
  وتسعمائة وثمانية آلاف وسبعمائة واثنان وثلاثون »); the student sets each column (± or sweep). « تحقّق » judges the board's value;
  a wrong board is refused with what it reads (« لوحتك: 765 — سبعمائة وخمسة وستون ») — the missing 0 is felt: the empty hundreds
  column shows its 0 in the written number only between non-empty ranks.
- `discoveryReady` = the four tasks done. **Discovery**: « لماذا نكتب 0 في 7065؟ » — right: « الصفر يحفظ مكان مرتبة فارغة (لا مئات)
  فيبقى 7 في مرتبة الآلاف »; wrong, refuted with the student's boards: « الصفر لا قيمة له فيمكن حذفه » (765: the 7 falls to the hundreds),
  « نكتب صفرًا بعد كل رقم » (… his 4 908 732 has one 0 only). **Formal**: the class table of 4 908 732, `spaced` writing, the reading by
  classes (« أربعة ملايين | وتسعمائة وثمانية آلاف | وسبعمائة واثنان وثلاثون », each class read like a number under 1000 + its class
  name), and its `decompose`.

**`world: 'money'` alone** (`levels={false}`, `tasks={['unpack']}`, `n={1345}`, `rank={2}` — textbook ex-2: يونس's 1345 DA exchanged for
100 DA notes): columns أوراق 1000 دج | أوراق 100 دج | قطع 10 دج | قطع 1 دج, DRAWN generic notes and coins (a rectangle « 100 دج », a disc
« 10 دج » — never an imitation of a real banknote's design); same unpack gesture; the answer 13 notes (`1345 = 13 × 100 + 45`), the 45 DA
left in coins. No discovery (`onFinished` when answered). Used in module 3 of the lesson.

**Must:** not eligible for « جرّب كل الإمكانيات » (every pack/open is the student's experiment) — say so in the header; design sheet
(DNA §7) + the five questions; one screen at 1280×800 → 320×640 (measure `[data-rx-glance]`: board + digit boxes + written number + the
current task card; on 320 px the 7-column advanced board must fit: columns ≥ 40 px, tokens stacked in a 2-wide column, a count badge
from 10 tokens on — the count is still exact); `useLessonViewport` budget; keyboard + tap-tap + pointer paths for every gesture;
reduced motion (no sweep animation, instant ties); three progressive hints per task that never give the number (« كم قلمًا في الحزمة
الواحدة؟ » …); « إعادة » resets the task; `state.report` for every callback; all strings in `lesson.manipulation.json › rankExchange`
with counted nouns through plural keys `_zero … _other` (قلم / حزمة / علبة / صندوق / ورقة / قطعة — ARABIC_RTL_CONTRACT « Counting
nouns »), numbers as LTR islands, class spaces U+00A0. Say each thing ONCE (§17.7): the task question in the `PromptCard`, the gesture
in one idle line, the story in the lesson's `lead`.

**DOM:** `[data-rank-exchange][data-world][data-task][data-solved]`, `[data-rx-glance]`, `[data-rx-col=<k>][data-count]`,
`[data-rx-item=<k>-<i>]`, `[data-rx-digit=<k>][data-overflow]`, `[data-rx-written]` (text = the written number, empty while not writable),
`[data-rx-tray]` (a tied pack waiting to be carried), `[data-rx-tie]` / `[data-rx-open=<k>]` (buttons), `[data-rx-predict=<value>]`,
`[data-rx-counter]` (unpack), `[data-rx-verdict=<kind>]`, `[data-rx-refused=<kind>]` (`short-pack` | `wrong-column` | `overflow` |
`no-unit` | `wrong-board`), `[data-rx-words]`, `[data-rx-formal]`, `[data-rx-plusminus=<k>]`.

**Tests:** `placeValue.test.js` (above). `logic/rankExchange.test.js` — packing any start state always ends on `digitsByRank(value)`
whatever the order of packs (property sweep: random start counts 0..40 per rank, random pack order); `valueOfCounts` invariant under
every pack and open; refusals carry the right kind and numbers; the three prediction cards of `pack` and `unpack` are distinct and
computed from the start (1 132 437, 75, 2 577 ; 1, 20, 201); `next` from 999 needs exactly 3 packs; `borrow` from 1000 needs 3 opens;
the dictation judge accepts only the exact value; layout of the board swept at five widths (each object drawn once, inside its column,
counts ≥ 10 badge-rendered with the exact count). `operations/rankExchange.render.test.jsx` — both levels and the `money` standalone
render; no raw keys, no `{{`, no Latin prose; the prediction and discovery strings reachable before the formal phase do NOT contain the
rule (« عشرة » + « واحدة » together, « 201 » before unpacking); « says each thing ONCE » like `divisionJumps.render.test.jsx`. Then
`cd apps/web && npx vitest run src/lessons/common/manipulations src/lessons/common/i18nHookScope.test.js` and
`cd packages/core && npx vitest run arithmetic/placeValue.test.js`. A fresh Vite of the repo runs on http://localhost:5174 (do not
start another one, never touch 5173). Do NOT run `npm run build`. Report as the unit-2/3 lab authors did (files, tests, the DOM as built,
the screenshots reviewed and what changed after looking at them).

## Bank author — `content/practice/1am/kitabat-adad-tabii/`

Exactly the unit-2 bank brief (`docs/sources/1am/unit2/brief-authors.md` « Bank author »), its reading list and its rules, with:

- LP ids `1am_kitabat-adad-tabii_P1..P3` (above), each primary on ≥ 8 questions.
- **Corpus** (`exams-index.json`, items `1am.m1.r02`; ALL term-1 papers: badge « على منوال اختبار الفصل الأول », `semester: 1`,
  `modelledOn: "1am-s1"` for the generated ones). Only the parts in THIS lesson's scope (ranks, reading/writing, natural decompositions)
  may be `term_exam` exercises:
  - `1am-s1-94` ex 1 q 1 (« ما هي مرتبة الرقم 4 » in 765,498 ; 342,906 ; 3065,94) and q 3 (« ضع الفاصلة بحيث يصبح الرقم 4 رقم
    الأعشار » in 906243 → 9062,43);
  - `1am-s1-95` ex 1 q 3 (« ضع الفاصلة بحيث يصبح الرقم 7 رقم الأجزاء من 100 في العدد 581274 » → 581,274);
  - `1am-s1-97` ex 1 q 1–3 (in 934,857 the digits of units, hundreds, tenths, hundredths; place the comma in 31795 so that 9 is the
    hundredths digit → 31,795; in 10900 so that 9 is the tens digit → 1090,0 i.e. 1090 — say how you read it in `solution.lines`);
  - `1am-s1-93` ex 1 bullet 1 (« مرتبة الرقم 3 في العدد 15,03 هي جزء من عشرة » — صحيح أو خطأ: خطأ, الأجزاء من مائة);
  - `1am-s1-101` ex 1 q 2 (the number whose tens digit is 2, hundredths digit 2, units digit 3, thousandths digit 6, tenths digit 0 →
    23,026 — scan, read `docs/Exames-1 AM to 3AM/1am/SEMESTER 1/…رقم-101.pdf` with `pdftoppm -r 110`);
  - `1am-s1-93` ex 2 item B only (`B = (8×100)+(9×10)+3` → 893: a natural decomposition).
  The decimal-only parts of these papers (fraction ↔ comma, decimal decompositions, × ÷ 10, « عدد الأعشار » of 1am-s1-97 q 4,
  comparisons) are `kusur-ashriya-kitaba` / `muqaranat-adad-ashriya`: allowed ONLY as `counted: false` steps of a level-4 exercise (same
  term). The corpus has NO exercise on writing naturals in words: P1 is assessed by `term_exam_modelled` exercises in the register of
  the term-1 papers (a short « أكتب بالحروف / بالأرقام » item with 2–3 numbers, then a reformatting « أعد كتابته بفئات من ثلاثة أرقام »)
  and by `adapted` textbook elements. About half of levels 3–5 modelled on one precise corpus exercise above.
- **Textbook elements you may cite** (destination `kitabat-adad-tabii`): `act-1`, `know-1`, `know-4` (its item a: ranks — not the
  decimal decompositions of item b), `ex-1`, `ex-2`, `ex-3`, `ex-12` (item ① only, 5 276), `self-1`, `deep-1`, `deep-2`, `deep-3`
  (items ① ② only: 3 079, 9 730), `prep` (items 1–4 and 6). Nothing else (`check:textbook` fails on any other id).
- **What is assessed:** writing a natural in digits from words and in words from digits (`choice` among readings whose distractors are
  the real misconceptions — digit-by-digit reading, wrong class « أربعة آلاف وخمسمائة… » for 45 671, a lost zero 765 for 7 065, the
  hundreds read as thousands; or `rational` for the digits); reformatting by classes from the RIGHT (`MISC-KITABA-CLASS-LEFT`: 456 71);
  the digit and the rank of a digit (both sides of the comma; « العشرات » vs « الأعشار » confusion `MISC-KITABA-TENS-TENTHS`); « رقم » vs
  « عدد » of a rank (2017: 1 / 201; 1345 DA in 100 DA notes → 13; a 3 005 → 300 tens); the largest / smallest natural from given digits
  (0 never first: `MISC-KITABA-LEADING-ZERO`); a natural from its decomposition, terms possibly out of order (`(8×100)+3+(9×10)`) or
  with a missing rank (`5×1000 + 7×10 + 6` → 5 076, `MISC-KITABA-ZERO-PLACE`); the natural's decomposition; the next / previous number
  across ranks (9 999 + 1, 10 000 − 1); big numbers (million, billion, the textbook's planet distances — values as in the textbook,
  `deep-2`). Words: the platform spelling (`toArabicWords` convention above); a `choice` NEVER opposes two spellings of the same number
  (« خمس » / « خمسة »). Units in Arabic text « دج », « km » inside a math island when glued to a number.
- Misconception ids `MISC-KITABA-*` (at least: `CONCAT`, `SUMCOUNTS`, `DIGIT-COUNT`, `RANKSHIFT`, `LEADING-ZERO`, `ZERO-PLACE`,
  `CLASS-LEFT`, `TENS-TENTHS`, `DIGIT-BY-DIGIT`) in `content/practice/misconceptions.json`.
- **Oracle** `scripts/practice-oracle/kitabat-adad-tabii.mjs`: recomputes every digit, rank, count of a rank (`Math.floor(n / 10**k)`),
  decomposition and comma placement with its OWN integer/string code, and every words key with its OWN speller — never by importing
  `placeValue.js` (two independent implementations cross-check each other); it also asserts its speller on the extraction's `words`
  answers (`docs/sources/1am/unit1/extraction.json`).
- Gates you run: `node scripts/validate-exercises.mjs --strict`, `node scripts/check-textbook-coverage.mjs`, `npm run test:scripts`.

---

# Lesson 2 — `kusur-ashriya-kitaba` « الكسور العشرية والكتابة العشرية » (cycle moyen rollout, batch 4, 2026-10-15)

Same organisation as above and as `docs/sources/1am/unit2/brief-authors.md` (file ownership tables apply with the names below). The lead writes
the lesson (`apps/web/src/lessons/moyen/1am/ansab_al_aadad_wal_hisab/adad-tabiiya-ashriya/kusur-ashriya-kitaba/`) and the extraction
(destinations updated in `build-extraction.py`: act-2, act-3, ex-4…ex-14, ex-26…ex-28 are APPLICATIONS in module 5; know-2/3/4b module 2;
method-1 + now-12 module 3; method-2 + now-14 module 4; `deep-3` ③④ stay with `muqaranat-adad-ashriya`).

| Author | Owns | Never touches |
|---|---|---|
| **Lab** | `packages/core/arithmetic/decimals.js` (+ `.test.js`), `manipulations/operations/DecimalComma.jsx`, `manipulations/logic/decimalComma.js` (+ `.test.js`), `manipulations/operations/decimalComma.render.test.jsx`, new drawing primitives it needs under `manipulations/primitives/` (e.g. `MosaicFigure.jsx`), the `decimal-comma` entry of `manipulations/manipulationRegistry.js`, the `decimalComma` namespace of `i18n/locales/ar/lesson.manipulation.json`, `primitives/labCoach*` wiring ONLY for its own lab, its section in `MANIPULATION_CONTRACT.md` (`## 2tervicies`, after `2duovicies`) and its row in `MANIPULATION_DNA.md` §15 | the lesson folder, `content/practice/**`, the extraction |
| **Bank** | `content/practice/1am/kusur-ashriya-kitaba/**`, the lesson's entries in `content/practice/{active,exam-style,policy,misconceptions}.json`, `scripts/practice-oracle/kusur-ashriya-kitaba.mjs` and its import in `scripts/practice-answer-oracle.test.mjs` | the lesson folder, the lab, the extraction |

Already done by the lead (do not redo): the type `'decimal-comma'` is declared in `packages/core/curriculum/manipulationTypes.js`; the drawn
world `mosaic` is in `VISUAL_THEMES` (`packages/core/curriculum/manipulationLevels.js`); the two level presets are written in
`manipulations/levels.js` (**their `numbers` are the props contract below — read them first**). Until the lab author adds the registry entry,
`manipulationRegistry.test.js` and `levels.test.js` are red on `decimal-comma` (expected). The lesson pages mount while the lesson is still
`coming_soon`: `http://localhost:5174/courses/moyen/1am/ansab_al_aadad_wal_hisab/kusur-ashriya-kitaba/nashat` (module 1 = the lab, both levels)
and `…/tariqa-ashara` (module 4 = the lab's `machine` world) — the lead writes those pages in the first minutes; until they load use vitest
render tests. Do NOT start another Vite, never touch 5173. Do NOT run `npm run build`. Screens are TABLET and LAPTOP only (768×1024,
1024×768, 1280×800, 1366×768, 1920×1080); phones are not supported (owner, 2026-10-15).

## The lesson in one paragraph

Programme items `1am.m1.r02` (decimal/fractional writings and the passage between them), `1am.m5.x1`, `1am.m1.r03` (× ÷ 10, 100, 1000 or
0,1, 0,01, 0,001), `1am.m5.r03` (adding decimal fractions). The boundary with `kitabat-adad-tabii` (naturals, ranks, رقم ≠ عدد) is in the
header of `build-extraction.py`. The idea the student must DISCOVER: **a decimal fraction is a count of equal tiny pieces of the unit (tenths,
hundredths, thousandths); the comma is where the written number changes the size of the piece — every step to the right makes the piece ten
times smaller — so the SAME digits mean different amounts (235, 23,5, 2,35, 0,235), the digits after the comma are as many as the zeros of the
denominator (2,35 = 235/100), a zero keeps an empty place (0,05 ≠ 0,5), a zero at the very end changes nothing (2,50 = 2,5), and ×10, ×100,
×1000 / ÷10, ÷100, ÷1000 only slide the comma (zeros fill the places that appear).**

Final الكفاءات (`1am_kusur-ashriya-kitaba_P<n>`, order of the drafts kept — changes and reasons are in the progress log):

1. **P1** التعرّف على الكسر العشري والتعبير عن جزء من الوحدة، أو عن كمية أكبر منها، بالأجزاء من عشرة، من مائة، من ألف، وكتابته بكتابات متساوية مثل $\frac{3}{10}=\frac{30}{100}$
2. **P2** الانتقال من الكتابة العشرية لعدد عشري إلى كتابته على شكل كسر عشري، والعكس، مثل $31{,}25=\frac{3125}{100}$ (عدد الأرقام بعد الفاصلة هو عدد أصفار المقام)، وحذف الأصفار غير الضرورية
3. **P3** كتابة عدد عشري على شكل مجموع عدد طبيعي وكسور عشرية (مفكوكه النموذجي) مثل $2{,}35=2+\frac{3}{10}+\frac{5}{100}$ ، وإعطاء الكتابة العشرية لمجموع كهذا ولو كانت حدوده غير مرتّبة، وتعيين عدد الأعشار أو الأجزاء من مائة في عدد عشري
4. **P4** ضرب عدد عشري في 10 أو 100 أو 1000 (أو في 0,1 أو 0,01 أو 0,001) أو قسمته عليها بإزاحة الفاصلة، مع كتابة الأصفار عند اللزوم

`pointPrerequisites` (along net links only): P2 ← `1am_hasil-qisma-kasr_P1`, P1; P3 ← `1am_hasil-qisma-kasr_P1`, `1am_mana-jam-tarh_P1`, P2;
P4 ← `1am_kitabat-adad-tabii_P2`, P2. The lesson stands on `kitabat-adad-tabii` (ranks, ten for one) and recalls it — it does not rebuild it.

Lesson plan (lead, ≈ 85 min): 0 أستعدّ · 1 نشاط « ورشة الزليج » (the lab, both levels) · 2 معارف · 3 طريقة « من الكتابة العشرية إلى الكسر العشري
وبالعكس » · 4 طريقة « الضرب في 10 و100 و1000 والقسمة عليها » (the lab's `machine` world) · 5 أتمرّن · 6–8 three مسائل · 9 إختبار أولي.

## Lab author — `decimal-comma`

Read first exactly what the unit-1 brief above lists for its lab author (MANIPULATION_DNA all — §12, §16 and **§17 incl. §17.7, §17.9, §17.11
(LabCoach) are binding**; MANIPULATION_CONTRACT §1, §2, §2bis, §4.2, §6bis, §6ter, §7, §7bis-levels, §7ter, §7quater, §8, §8bis, §8ter (the kit),
**§8quater (LabCoach — mandatory)**, §9, and the sections of the newest labs `2novodecies` `rank-exchange`, `2vicies` `fraction-knife`,
`2duovicies` `fair-share` (incl. « جرّب أعدادك أنت — always open »)), plus the newest labs as code idioms: `operations/RankExchange.jsx`
(columns, ranks, tie/open gestures, `coachOf`), `operations/FairShare.jsx` + `primitives/CakeFigure.jsx` (kit composition, the always-open free
card, `KidFigure` scene), `operations/FractionKnife.jsx`. Memory rules from the owner: independence from the book (the lab's words are the
platform's own), girls ALWAYS in hijab (`KidFigure`), tablet/laptop only, the always-open own-numbers panel, say each thing ONCE. Arithmetic:
exact integers only, in `packages/core/arithmetic/decimals.js` (yours, imported BY PATH, never the core barrel) — a value is `{ n, k }` =
`n / 10^k` with `Number.isSafeInteger(n)`; write what you need (parse `'2,35'` / `'2.35'` / `'3125/1000'`, exact compare, write with the
decimal COMMA, `fractionOf`, decomposition by rank, shift by a power of ten, Arabic reading « ثلاثة أعشار وخمسة أجزاء من مائة ») and TEST it.

**Why this is not another lab (DNA §12).** `rank-exchange` (same unit): the hand moves QUANTITIES between ranks (ties ten into one, opens one into
ten); the written digits are an OUTPUT. `fraction-knife`: the hand holds d, the number of equal pieces, of ONE whole and a fixed share.
`fair-share`: the hand cuts and picks a share. `digit-cards`: the digit is the object, carried into slots. Here the DIGITS are FIXED on a printed
slip and **the hand holds the COMMA** — its place in the string of digits, i.e. the number of digits after it. The value is `N / 10^p`; the
quantity is an OUTPUT drawn in honest blocks (mosaic) or read on rank names (machine). What resists: the comma never leaves the string of digits;
in `machine`, the comma cannot pass the end of the digits — a zero must be added there first (« لا رقم هنا »).

**Props contract (fixed — the lesson is written against it; `levels.js` already holds the two presets):**

```jsx
<Manipulation type="decimal-comma"
  world="mosaic" | "machine"
  tasks={[ …task objects… ]}          // the sequence of tasks of the level (preset) — the lesson may pass its own for `machine`
  level, levels, title, lead          // as every type (levels={false} for a standalone use)
  onTrial={(e) => …}                  // EVERY judged release of the comma / every judged zero
  onFinished={({ tasks }) => …}       // all tasks of the sequence done
/>
```

Task objects (digits are a STRING of 1–6 Latin digits, may contain 0; the decimal mark of every string below is a comma or a slash):

| kind | fields | the student's job | judged by |
|---|---|---|---|
| `match` | `digits: '235'`, `target: '2,35'` | the client's TABLE shows the target amount as blocks; the slip prints `digits` with the comma at the far right; slide the comma until the workshop's tray (blocks drawn from the slip) matches the table | exact value `N/10^p` equals the target |
| `fraction` | `digits: '3125'`, `target: '3125/1000'` | NO table: the order is the fraction (shown as a fraction); slide the comma until the slip's amount equals it; the slip's live readout shows its own fraction `N/10^p` | exact value equals the target |
| `shift` | `start: '143,75'`, `op: '×1000'` | `machine` world: an input slip (start, comma fixed) goes through a machine whose operator is one of ×10 ×100 ×1000 ÷10 ÷100 ÷1000 ×0,1 ×0,01 ×0,001; the OUTPUT slip starts with the same digits and the same comma; slide the comma (and add zeros where the digits run out) until the output equals the machine's result | exact value of the output = start × 10^e |

`levels.js` presets (mosaic): مبتدئ `[match 235→2,35, match 37→0,37, match 05→0,05]` (platform context: the zellige workshop; 2 panels + 3 strips
+ 5 tiles on the client's table; the same digits make 235 panels, 23,5, 2,35 or 0,235 — the student SEES why the comma matters; the second
and third tasks teach the zero that keeps an empty tenths place); متقدم `[fraction 3125/1000, fraction 605/100, match 250→2,5]` (the digit count after
the comma equals the zeros of the denominator; the last task: 2,50 and 2,5 fill the table the same — a zero at the very end changes nothing).
The `machine` tasks are passed by the module (module 4): مبتدئ `[shift 3,5 ×10, shift 3,5 ×100, shift 3,5 ÷10, shift 3,5 ÷100]`; متقدم
`[shift 143,75 ×1000, shift 43,7 ÷1000, shift 27,5 ×0,1, shift 0,6 ×0,01]`. Support any task object of these three kinds with any digits (the
module may pass others), and tolerate `tasks` of a single object.

**The slip (both worlds).** A row of big digit tiles in an LTR island (`dir="ltr"`, bidi isolates, Latin digits). Between/around the tiles the
gaps (`len + 1` positions). The comma is a BIG round handle (≥ 44 px, lifts under the finger) sitting in a gap: pointer drag with snapping to
the nearest gap, tap a gap to jump there, keyboard (focus the comma; ← → move it, Home/End; remember the island is LTR: ArrowLeft moves it left).
`point` = the number of digits after the comma (0 = no decimal part, `len` = the comma before the first digit — the slip then prints `0,` itself).
Under the digits, the rank of each digit follows the comma (as short pills or as the piece icon of the world — your design call, say it once):
units, tenths, hundredths, thousandths (آحاد، أعشار، أجزاء من مائة، أجزاء من ألف) to the right of the units digit, tens, hundreds … to the left.
Live next to the slip: the number as written (`[data-dc-written]`, e.g. `2,35`), and its fraction `235/100` (`[data-dc-fraction]`; the
denominator's zeros are drawn as visible zeros, never a power of ten notation). Never print a rule.

**World `mosaic` (theme `mosaic`, platform).** A zellige workshop (Algerian geometric tile art, Tlemcen/Fès-style colours — no real artwork, a
plain 8-point-star tessellation is a fine motif). The UNIT is one PANEL = a 10 × 10 grid of small tiles; blocks, drawn to honest relative sizes:
PANEL (1), STRIP (1/10: a column of 10 tiles, same height as the panel), TILE (1/100), SHARD (1/1000: a tile cut into ten thin slivers — draw
it as a tile with a visible 10-way cut; a shard is exactly 1/10 of a tile's area). Blocks of the slip's amount are laid out from the digits
with the current comma: the digit at the units rank counts panels, at tenths strips, at hundredths tiles, at thousandths shards; ranks above
units (tens, hundreds…) count GROUPS of ten / a hundred panels (draw a compact ×10 / ×100 bundle icon) or collapse to one panel icon with a
`×N` badge once N > 12 — exact counts always. Ranks beyond thousandths (a 4th digit after the comma) never occur in tasks; the FREE panel
limits the slip to 5 digits and the comma so that at most 3 decimal places show blocks — beyond that print the pieces as « أصغر من شظية »
without lying about their size (your design call; document it). A craftswoman `KidFigure` (a girl in hijab, mood reacts) works at the table.
Two zones on the stage: **the client's table** (`match`: the target amount in blocks; `fraction`: the fraction printed big instead of blocks)
and **the workshop tray** (the slip's amount in blocks, re-drawn at every comma move). Verdict states (a banner under the stage that never
makes the stage jump): `exact` (stamp), `more` (the tray holds more than the order), `less`; never the rule, never the target's comma
position. The sizes of the blocks DO change as the comma moves — that is the point; make the change legible (blocks regroup with a short
motion; reduced motion = instant).
A trial is a RELEASE of the comma (or a tap on a gap) — every release is judged and reported once; a keyboard step is a release.

**World `machine` (theme `mosaic`, same workshop: « آلة العشرة »).** Stage: the machine in the middle with its operator pill; above it the INPUT
slip (read-only, comma fixed, its ranks named); below it the OUTPUT slip (the student's). Same drag/tap/keyboard comma. **Zeros**: two `+ 0`
affordances at the ends of the output slip (`[data-dc-zero=left|right]`, ≤ 3 added each side, removable); the comma can only be released inside
the string of digits + added zeros, so ×1000 of 3,5 needs two zeros on the right and ÷100 of 3,5 needs one on the left: a release that would pass
the end is refused with the verdict `nodigit` (« لا رقم هنا: أضف صفرًا ») and the comma stays at the end. The rank pills under the output digits
FOLLOW the comma, so the student sees each digit change rank (the 7 of 143,75 was « أعشار », it is now « آحاد »); thin links from each input digit
to the same digit of the output show how many places it travelled. Judged on every release/zero change: `exact`, `more`, `less` (the output is
bigger/smaller than the machine's result). The leading zero before the comma is automatic; an extra zero is never an error when the value is
right, but the formal phase shows the writing WITHOUT unnecessary zeros.

**Free panel — always open (owner rule, 2026-10-15).** Under each world, a card « جرّب أعدادك أنت » with a digits field (≤ 5 Latin digits;
`inputMode="numeric"`) lets the student type ANY digits and slide the comma over them: in `mosaic` the blocks of that amount, in `machine` a
free operator selector (the 9 operators). Free trials carry `free: true` (the lesson ignores them), never count for `discoveryReady`, `canNext`
or `onFinished`; a button returns to the guided task (see `FairShare.jsx › setCustom / toGuided`).

**Discovery and formal phase.** `discoveryReady` = every task of the level done. Discovery (`ManipulationDiscovery`), mosaic: « ماذا يغيّر موضعُ الفاصلة؟ »
right: « كلّ خطوة نحو اليمين تجعل القطعة التي يعدّها الرقم أصغر بعشر مرّات » (no digit, no numbers); wrong, each refuted with the student's OWN
boards (`refutations` from the trials): « لا يغيّر الفاصلةُ المقدارَ، بل طريقة قراءته فقط » (his 235 became 235 panels and 0,235) and « العدد الأطول
أكبر دائمًا » (his 2,35 has three digits yet is smaller than 23,5, two digits less one… — build it from his trials). Machine: « ماذا فعلت الآلة
بأرقام عددك؟ » right: « حرّكت كل رقم عدد المراتب نفسه (عشرة في كل مرتبة) » / wrong: « غيّرت الأرقام نفسها » (his digits are the same) and « أضافت
أصفارًا فقط » (÷10 added none). Formal phase, mosaic: the rank table of the last task with the fraction (`235/100`, read « مئتان وخمسة وثلاثون
جزءًا من مائة »), the decomposition `2 + 3/10 + 5/100` and `2 + 3 × 0,1 + 5 × 0,01` (zero ranks greyed and absent from the sum), the count
« عدد الأجزاء من مائة » once; and after a `250 → 2,5` task, `2,50 = 2,5`. Formal, machine: the rank table before/after with the arrows and the
rule as the student's own boards (« ÷100: الفاصلة انتقلت مرتبتين إلى اليسار »). Exact strings are your call within DNA §16–§17, but NO
discovery or prompt string may contain the rule it hides (the render test checks it like `fairShare.render.test.jsx`).

**Callbacks.** `onTrial({ task: <index>, kind: 'match'|'fraction'|'shift', digits, point, shown: '23,5' (the slip as written, trailing zeros kept),
value: '23,5' (exact, comma), target: '2,35', ok: <bool>, verdict: 'exact'|'more'|'less'|'nodigit', zeros: { left, right }, free: <bool> })`
for every judged release / zero change / refused release; `onFinished({ tasks })` once when all guided tasks are done. `ok` is true ONLY
when the value equals the target. A solved task stays solved; « إعادة » restarts the task in progress.

**LabCoach.** Mandatory (§8quater): `logic/decimalComma.js › coachOf(state)` → `{ id, target, gesture }` — `grab` (the comma), `move`, `zero`
(machine, when the comma sits at the end and a zero is needed — it points at the ZERO button, never at the answer position), `next`. Its test
follows the coach to the end of every task of both levels and both worlds. Strings `decimalComma.coach.*`. It never says WHERE the comma
should end.

**Layout & measures.** One screen: `[data-dc-glance]` fits at 1280×800, 1366×768, 1024×768 and 768×1024, 1920×1080 for both levels, both worlds
(initial and mid-activity states); controls inside the stage on 768; sentence ≥ 18 px; the digits ≥ 40 px tall; all numbers LTR islands, Arabic
as DOM text; `useLessonViewport` budget like the other labs. Opens on CONTEXT then ONE question, NO title (§17.9): e.g. mosaic مبتدئ —
« بقي من وصل الطلبية الأرقام 2 3 5 دون فاصلة. على طاولة الزبون لوحتان و3 أعمدة و5 بلاطات. » / « حرّك الفاصلة حتى يصنع الحرفيّ ما يطلبه الزبون. »
(your final wording, your call, but a 12-year-old must be able to start dragging and know when she is done).

**DOM.** `[data-decimal-comma][data-world][data-task][data-solved][data-layout]`, `[data-dc-glance]`, `[data-dc-slip=input|output]`,
`[data-dc-digit=<i>]`, `[data-dc-comma][data-point]`, `[data-dc-gap=<j>]`, `[data-dc-rank=<i>]`, `[data-dc-written]`, `[data-dc-fraction]`,
`[data-dc-table=target|tray]`, `[data-dc-block=panel|strip|tile|shard]` (+ `data-count` on collapsed bundles), `[data-dc-op]`, `[data-dc-zero=left|right]`,
`[data-dc-verdict=exact|more|less|nodigit]`, `[data-dc-prompt][data-lit]`, `[data-dc-next]`, `[data-dc-free][data-active]`, `[data-dc-free-digits]`,
`[data-dc-formal]`, `[data-dc-kid]`, `[data-lab-fold=decimal-comma.trials]`, LabCoach markers (`[data-lab-coach-toggle]`, `[data-lab-coach][data-step]`…).

**Tests.** `packages/core/arithmetic/decimals.test.js` (exactness sweeps: parse/format round trip over all strings of ≤ 5 digits and every
comma place, shift ± 3, fraction text, the Arabic reading), `logic/decimalComma.test.js` (for every digits string ≤ 4 digits and every comma
place the value is `N/10^p` and exactly one comma place matches each target of the presets; the preset tasks are solvable; shift tasks need
exactly the zeros you document; the coach followed to the end; block counts equal the digits at every comma place; layout swept at five
widths), `operations/decimalComma.render.test.jsx` (both worlds render, no raw keys, opens on CONTEXT then ONE question, says each thing once,
no discovery/prompt string leaks the rule). Then `cd apps/web && npx vitest run src/lessons/common/manipulations src/lessons/common/i18nHookScope.test.js`
and `cd packages/core && npx vitest run arithmetic/decimals.test.js`. Also extend `apps/web/e2e/lesson-kit/lab-coach.mjs` ONLY if its structure
asks for a per-lab entry. Report: files, tests, the DOM as built, screenshots reviewed (initial, mid-activity, refusal, formal phase, both
worlds, both levels, at 768×1024, 1024×768, 1280×800, 1366×768, 1920×1080 — taken with Playwright against :5174, LOOKED at one by one) and what
changed after looking at them.

## Bank author — `content/practice/1am/kusur-ashriya-kitaba/`

Exactly the unit-2 bank brief (`docs/sources/1am/unit2/brief-authors.md` « Bank author » — its reading list, rules, wiring and gates), with:

- LP ids `1am_kusur-ashriya-kitaba_P1..P4` (above), each primary on ≥ 8 questions (P4 ≥ 10: it is the most examined).
- **Corpus** (`exams-index.json`, `grade: 1am`, items `1am.m1.r02`, `1am.m1.r03`, `1am.m5.x1`; badge « على منوال اختبار الفصل الأول » for
  semester 1, `semester: 1`, `modelledOn: "1am-s1"` for the generated ones; `1am-s2-64` ex 1 → « الفصل الثاني »). Exercises whose decimal-fraction
  / decimal-writing / × ÷ 10^k parts are IN this lesson's scope (read the PDFs under `docs/Exames-1 AM to 3AM/1am/`; `pdftotext -layout`, `pdftoppm
  -r 110` for scans): `1am-s1-91` ex 1 (fraction → decimal writing; the comparison / ordering parts belong to `muqaranat-adad-ashriya`: only as
  `counted: false` steps) and ex 2 (× ÷ 0,1 0,01 100 1000), `1am-s1-93` ex 1 (rank, × by 10) and ex 2 (decimal from a decomposition, fractional
  writing; the ordering part excluded), `1am-s1-94` ex 2 (× ÷ 10, 100, 0,1; comparison part excluded), `1am-s1-95` ex 1 (table: decimal number /
  decimal fraction / decomposition; place the comma) and ex 2 (× 10, 0,01), `1am-s1-96` ex 1 (standard decomposition, ÷ 1000) and ex 2 (blanks × ÷ 1000, 0,01),
  `1am-s1-97` ex 1 (number of tenths, place the comma) and ex 2, `1am-s1-98` ex 1 (table × ÷ 100 and 0,01; decimal fraction; decomposition),
  `1am-s1-99` ex 1 (table decimal/fractional writing, × ÷ 0,01 0,001), `1am-s1-101` ex 2 (× ÷ 0,1 0,01; the comparison part excluded),
  `1am-s1-104` ex 1 (fractional and decomposed writing, × ÷ 100 and 0,001; the descending order excluded), `1am-s1-106` ex 1 (decimal writing of fractions)
  and ex 2 (× ÷ 100, 0,1, 1000; the descending order excluded), `1am-s2-64` ex 1 (fractional ↔ decimal writing, × ÷). Ordering / comparison is
  `muqaranat-adad-ashriya`, rank names of naturals `kitabat-adad-tabii`: allowed ONLY as `counted: false` steps of a level-4/5 exercise. `1am-s2-65`
  ex 1 (adding decimal fractions) may be used for the sum of decimal fractions ONLY (item `1am.m5.r03`: `3/10 + 5/100 = 35/100`, no reduction —
  reduction is `ikhtizal-kitaba-kasriya`). About half of levels 3–5 modelled on ONE precise corpus exercise; the rest `term_exam_modelled`
  and a few `adapted` from the textbook elements listed below.
- **Textbook elements you may cite** (destination `kusur-ashriya-kitaba`): `prep` (items 7–9 only), `act-2`, `act-3`, `know-2`, `know-3`, `know-4`
  (its item b only), `method-1`, `now-12`, `method-2`, `now-14`, `ex-4` … `ex-11`, `ex-12` (items ②–④ only), `ex-13`, `ex-14`, `ex-26`, `ex-27`, `ex-28`,
  `self-2` … `self-6`, `self-13`. Nothing else (`check:textbook` fails on any other id; `deep-3` ③④ and every ordering item are `muqaranat`'s).
  Read `docs/sources/1am/unit1/extraction.json` for the answers (computed), but REWRITE every exercise: own contexts, own numbers (independence from
  the book — never copy a statement).
- **What is assessed:** (P1) the tenths / hundredths / thousandths of the unit (a shaded part of a 10 × 10 grid or a bar → a fraction with denominator
  10, 100, 1000; the equal writings 3/10 = 30/100 = 300/1000; a quantity above 1: 243/100 = 2 + 4/10 + 3/100); (P2) decimal writing → decimal fraction (digits
  after the comma = zeros: 31,25 = 3125/100; 0,05 = 5/100; 15 = 150/10; 43,5 = …/1000) and back (9345/1000 = 9,345; 356/10; 2017/1000), the zero that keeps a
  place (0,05 vs 0,5) and the unnecessary zeros (340,40 = 340,4; 07,5 = 7,5; 12,0 = 12); (P3) the standard decomposition both ways, terms out of order
  (`5 + 6×100 + 3×1000 + 2/10 → 3605,2`), `× 0,1` / `× 1/10` forms, « عدد الأعشار / الأجزاء من مائة » of a decimal (217,48 holds 2174 tenths,
  21748 hundredths), the sum of decimal fractions; (P4) × ÷ 10, 100, 1000 and × ÷ 0,1 0,01 0,001 mentally, zeros that appear (3,5 × 100 = 350; 3,5 ÷ 100 =
  0,035; 15 ÷ 10 000), « the missing factor » blanks (… × 100 = 4 , 43,7 ÷ … = 0,437), a calculator exercise with a broken decimal key. Distractors are real
  misconceptions, every one FALSE: `MISC-KUSUR-ADD-ZERO` (× 10 adds a zero: 3,5 × 10 = 3,50), `MISC-KUSUR-COMMA-LEFT` (× moves the comma left), `MISC-KUSUR-
  DEN-DIGITS` (35,2 = 352/1000: denominator not matching the digits), `MISC-KUSUR-ZERO-PLACE` (0,05 = 5/10), `MISC-KUSUR-NUM-DEN-SWAP`, `MISC-KUSUR-SPLIT-DIGITS`
  (2,35 = 2 + 35/10), `MISC-KUSUR-ORDER-TERMS` (the sum's terms read in the order written), `MISC-KUSUR-TRAILING-ZERO` (2,50 ≠ 2,5), `MISC-KUSUR-TENTHS-COUNT`
  (the number of tenths of 217,48 is 4), `MISC-KUSUR-MULT-SHRINKS` (× 0,1 makes it bigger).
- `answerType`: `choice` (every distractor FALSE and tagged `misconceptionId`), `rational` (a value; decimal comma accepted; exact decimals via
  `scripts/practice-oracle/helpers.mjs`), fractions as `a/b` strings per the existing banks (see `ikhtizal-kitaba-kasriya` and `kitabat-adad-tabii`), `selfCheck`
  for « برّر » steps. A `choice` NEVER opposes two writings of the same value as right/wrong (« 2,5 » / « 2,50 »).
- **Oracle** `scripts/practice-oracle/kusur-ashriya-kitaba.mjs`: recomputes EVERY constructed answer and every choice key with its OWN exact decimal
  arithmetic (BigInt or the helpers), never by importing the lab's `decimals.js`.
- **Wiring + gates you run:** exactly as in the unit-2 brief (`active.json`, `exam-style.json`, `policy.json`, `misconceptions.json`; `node scripts/validate-exercises.mjs
  --strict`, the oracle test, `node scripts/check-textbook-coverage.mjs`, `npx vitest run scripts`). Do NOT run `npm run build`. Report: files, counts per level
  and per LP, the corpus exercises used (file + exercise), test results.
