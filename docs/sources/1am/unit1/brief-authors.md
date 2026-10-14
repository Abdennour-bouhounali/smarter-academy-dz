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
