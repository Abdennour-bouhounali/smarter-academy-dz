# Batch 2 — the design page of lessons 4–8 of 4AM unit 1 (ACCEPTED by the owner on 2026-11-19: « Go, full design »)

Written 2026-11-19 by the main session, after the review of the same day (`REVIEW_2026-11-19.md`, R8, R9 and open item
12). **State, 2026-11-19 evening: lesson 4 is BUILT (`LESSON_4_GATE_REPORT.md`); the six new kinds are written
(`summit` and `deal` played by lesson 4; `lists`, `sort`, `measure`, `part` have their unit tests and have NOT been seen
in a browser — that happens with lessons 5–8); the four new modes are being written; lessons 5–8 are not built.** It is
the ONE design page of the batch (`LESSON_V2_MASTER_PLAN.md` §9, step 1): the
owner's « go » covers it; what he corrects is corrected here first.

Sources: `npm run lesson:brief -- <id>` for the five lessons (the الكفاءات, the learning points, the weight of each in
the bank), `GAME_WORLD.md` « استكشف » (the sixteen kinds), and the `world/` folders written on 2026-11-18 (untracked):
their stories, numbers, practice, trainers and knowledge are KEPT where the review found them sound; their forges and
experiments are what this page replaces.

## 1. What was wrong with the first draft (the review, in one table)

| Finding | Where | What this page does |
|---|---|---|
| The same three kinds (`common`, `ladder`, `nest`) carried 8 of 11 keys | lessons 5, 7, 8 | each key gets the experiment of ITS nature (§3); six kinds are added, four get a new mode |
| Lesson 4's planned experiment was identical to lesson 5's (`common` on an ordinary pair) | 4, 5 | lesson 4 keeps `common`; lesson 5 finds the PGCD from LISTS (`lists`) |
| Keys that replay lesson 3's experiments (`join` for a − b, `peel` for the remainder) | 6 | lesson 3 proved « a common plank holds the difference / the piece »; lesson 6 asks the NEW thing — the two pairs have the SAME common planks (`nest`, mode `pair`), and a run of subtractions IS one division (`ladder`, mode `fold`) |
| A key sealed inside the key before it (the longest plank asked at the end of `common`) | 4 | `common` stops at the shelves in lesson 4 (`crown: false`); the longest is its own search (`summit`) |
| Rules told, hints and distractors marked wrong though true, evidence on wrong answers, memo quizzes marking true equalities wrong | 4–8 | repaired lesson by lesson BEFORE its forges are written (§5) — these are defects of the written content, not of the design |
| No experiment for « reduce in stages » and for a fraction that comes out of a calculation | 8 | `measure`, `part` |
| The 1AM lesson `ikhtizal-kitaba-kasriya` forged on Euclid's algorithm (no PGCD in 1AM) | 1AM | OUT of this page: redesigned after the five 4AM lessons (§6) |

## 2. Kit work — what the world « أرخبيل القواسم » must gain

**Six new kinds** (each: pure logic in `divisorIsles/`, its screen, unit and render tests, its row in `GAME_WORLD.md`):

| Kind | Its nature | What the student does |
|---|---|---|
| `summit` | a search for a MAXIMUM, with the reason to stop | two strips. He holds a plank that fills both gaps and is asked for a longer one: first he TYPES any length he wants (the world lays it on both gaps and writes the two divisions — a fact), each try kept on a line of lengths. Then the planks of the SHORTER gap are tried from the longest down; before each he says whether it holds the other gap; the first that holds is crowned; he says whether the shorter ones still need trying. Mode `first`: before the search he says how many planks will be tried — one, when the shorter gap's own length holds the longer gap. |
| `deal` | a sharing of TWO collections into identical lots | drawn flowers (or dates and figs) and empty vases. He chooses the number of lots, says BEFORE whether everything will be shared, the world deals both collections round by round; what cannot be dealt stays on the table (`40 = 6 × 6 + 4`). A table keeps his tries: lots, of each kind per lot, left over. Then: the most lots, and what one lot holds (typed in its template). |
| `lists` | a PROCEDURE on two lists | he builds the planks of each gap by pairs (he types a plank, the world writes its partner — lesson 2's method, not re-taught), the two lists stand one above the other; he links the planks that are in both; the world outlines a link that is wrong by its division; the longest linked plank is asked last. |
| `sort` | a CLASSIFICATION of pairs | cards, one pair of gaps each (or one fraction each, lesson 8). For each he may open ONE instrument he already owns (the lists, the summit, the ladder — the world runs it and shows facts), then drops the card in one of two baskets. Trap cards: two numbers that are not prime and share only 1 (25 ; 27), neighbours (44 ; 45), a hidden common plank (85 ; 119 → 17), a number and its multiple. A card in the wrong basket is answered by the plank the world lays. |
| `measure` | a CHANGE OF UNIT | the fraction is two strips, the numerator above the denominator. He picks a plank that fills both as the unit; the world counts both strips again in that unit and writes the new fraction beside the old one with « = » (a real fraction bar). Mode `stages`: he goes on until no plank but 1 fills both, by the road HE chooses; a second run by another road ends on the SAME fraction (a fact he predicts). Mode `direct`: he must end in ONE stage — which plank? |
| `part` | a part of a whole, re-cut | ONE strip (the whole, 39 cells) with a painted part made in two strokes (5 cells, then 8); he writes the fraction painted; then he picks a plank that fills the part AND the whole: the strip is re-cut in that unit, the painted length does not move, the writing does (13/39 → 1/3). |

**Four new modes of kinds that exist**: `common` — `crown: false` (ends on the shelves and their count) and `witness`
(the tray is the planks the divisibility rules give — 2, 3, 5, 9, 10; ONE plank on the shelf « both » ends the round:
« is one enough? »); `nest` — `pair` (the third strip is replaced by a second PAIR: the planks of (a ; b) against the
planks of (b ; a − b) or (b ; r)); `ladder` — `fold` (the rows of a subtraction ladder that take away the same gap are
folded by him into one line `a = b × q + r`) and `both` (the two ladders of the same pair side by side: he says
BEFORE which is shorter, and by how many rows).

To check in the code before the build (not verified today): that `common` can draw a gap of 0 cells (lesson 5, key ⚡).
— Checked 2026-11-19: `commonOf` threw on a gap of 0 and the strip was invisible; both fixed (one gap of 0 allowed, drawn
as an empty mark with « 0 », `0 = d × 0 + 0`), tested; the four modes are built (`gcdModes.js`, `InquiryGcdModes.jsx`).

## 3. The five lessons — every key, its nature, its experiment

The stories written on 2026-11-18 are kept (islands, gaps, the last bridge's problem); numbers quoted are theirs.
`(P…)` = the learning point; the count is its PRIMARY questions in the bank — the weight of the key.

### Lesson 4 — `qasim-mushtarak-akbar` (what the PGCD IS) — « سوق الزهور »

| Key | Nature | Experiment | Numbers |
|---|---|---|---|
| 🤝 القواسم المشتركة (P1, 19) | a search over two gaps | `common`, `crown: false`: each plank of the tray is said twice (holds a? holds b?), laid, shelved | the twins 198 and 234; tray 2, 3, 6, 9, 11, 13, 18 |
| 👑 القاسم المشترك الأكبر (P2, 56) | the longest, and why the search may stop | `summit` | 266 and 322, from the plank 14 he has just used; then 198 and 234 from the top (18) |
| 💐 الباقات المتماثلة (P3, 53 — 38 of them at level 5) | a sharing read with common divisors | `deal` | 40 roses and 56 lilies: 8 bouquets at most, 5 and 7 in each |
| 🧩 قواسم القاسم المشترك الأكبر (P4, 23) | an equality of two sets | `nest` (as written) | 228 dates, 276 figs, 12 |

One number changes: the market's 208 roses (now a plank of `qisma-iqlidiya-hasr`) → 364 (364 and 286: 26 bouquets of 14
roses and 11 lilies; the walkway 650 cells). 182, proposed first, is a number of the lesson's own bank (level 4).

**The final mission — the last bridge needs the lesson** (2026-11-19, after the screenshot review: « 650 cells, which
plank fills them? » was a plain division, the PGCD was not needed). The market's walkway is TWO stretches laid end to
end — 364 cells for the roses, then 286 for the lilies — and ONE kind of plank must fill EACH stretch exactly, the longest
there is. The store offers **28 against 26**: 28 is longer and fills the roses' stretch alone (364 = 28 × 13; 286 =
28 × 10 + 6), 26 = PGCD(364 ; 286) fills both (14 + 11 = 25 planks). Only the content changed (`world/story.js`: the
mission, the question, Zero's sentences, the failure that names the lilies' stretch, the success « 14 في ممرّ الورود و 11
في ممرّ الزنابق »); the kit's store still divides the whole walkway — 650 = 28 × 23 + 6, the same 6 empty cells — so what
the store and the world do stays true. The price step is kept: 25 planks × 140 دج = 3500 دج. No sentence tells him to
compute the PGCD: he is asked for « the longest plank that fills both stretches ».

### Lesson 5 — `tayin-pgcd` (FINDING it, small numbers) — « مرفأ الرصيفين »

| Key | Nature | Experiment | Numbers |
|---|---|---|---|
| 📋 احصر القواسم ثم قاطعها (P1, 116) | a procedure | `lists` | 32 and 44; then 65 and 39 |
| ⚡ نتائج مباشرة (P2, 7) | limit cases | `common` on special pairs, the longest asked: twins of the same length, a gap of 0 cells (`0 = d × 0`: every plank « fills » it), the pair turned round | 27 and 27; 27 and 0; 27 and 1; (44 ; 32) against (32 ; 44) |
| 🎯 عندما يقسم الأصغر الأكبر (P3, 27) | a search that ends at its first step | `summit`, mode `first` | 76 and 19; 84 and 21; against 90 and 36 |

### Lesson 6 — `bahth-pgcd` (FINDING it, long gaps: the two algorithms) — « أطول لوح »

| Key | Nature | Experiment | Numbers |
|---|---|---|---|
| ➖ الفرق يحفظ الألواح المشتركة (P1, 4) | two pairs, the same common planks | `nest`, mode `pair` | (152 ; 95) and (95 ; 57) |
| 🪜 خوارزمية الفروق (P2, 13) | a procedure repeated until a gap is gone | `ladder`, mode `subtract` | 152 and 95 |
| 🧮 الباقي يحفظ الألواح المشتركة (P3, 3) | a pattern compressed | `ladder`, mode `fold` | 962 and 296: three subtractions, one division, 74 left |
| 🔁 خوارزمية إقليدس (P4, 48) | a procedure | `ladder`, mode `divide` | 1833 and 546 |
| ⏱️ أيّ الخوارزميتين أسرع (P5, 57) | a comparison he predicts | `ladder`, mode `both` | 1003 and 34 (31 rows against 2); a pair where the two ladders are equal |

Five keys on two kinds, four of them on `ladder`: the lesson IS the ladder; every (kind, mode) is used once.

### Lesson 7 — `awwaliyan-fima-baynahuma` (coprime numbers) — « جسرا المرفأ »

| Key | Nature | Experiment | Numbers |
|---|---|---|---|
| 🤝 عددان أوّليان فيما بينهما (P1, 26) | a classification of pairs | `sort` | (26 ; 39), (25 ; 27), (44 ; 45), (85 ; 119), (13 ; 39) |
| ✅ أثبت أنّهما أوّليان فيما بينهما (P2, 113) | a proof by a procedure | `ladder`, mode `divide`, ending on 1; the last step is the sentence of the proof, typed in its template | 45 and 44; then 546 and 385 |
| ❌ أثبت أنّهما ليسا أوّليين فيما بينهما (P3, 41) | ONE witness is enough | `common`, mode `witness` | 645 and 410 (5); a pair with no witness among the rules' planks (85 ; 119) — a fact: « no witness seen » proves nothing |

### Lesson 8 — `ikhtizal-kasr` (reducing a fraction) — « مرفأ الكسور »

The reading of the world stays the draft's: **two gaps crossed one after the other are ONE fraction** (the first the
numerator, the second the denominator); a plank that fills both is a UNIT in which both are counted again.

| Key | Nature | Experiment | Numbers |
|---|---|---|---|
| 🪜 الاختزال على مراحل (P1, 4) | a change of unit, repeated | `measure`, mode `stages` | 66/78 → 22/26 → 11/13, and by 6 at once |
| 🔒 الكسر غير القابل للاختزال (P2, 9) | a classification of fractions | `sort` (fraction cards) | 25/27, 11/13, 22/26, 13/39, 15/22 |
| 🎯 الاختزال بالقاسم المشترك الأكبر (P3, 94) | the one unit that ends at once | `measure`, mode `direct` | 66/99 with 33 |
| 🧾 نتيجة حساب (P4, 42) | a part of a whole, re-cut | `part` | 5 and 8 cells of a bridge of 39: 13/39 = 1/3 |

## 4. What stays as the kit already does it

The exam sitting is the bank as it is (`createBankSittings`); « تدرّب », the practice ladder, the knowledge map and
the store of the last bridge are the kit's; evidence uses the claim kinds added on 2026-11-19 (`pgcd`, `coprime`,
`commonDivisor`, `fraction`) behind `guardEvidence`. Each lesson gets its board (`board/script.js`, `memo.js`), its
class test, its launch-kit family and its walks; lesson 8's launch needs the family of `1am.m5.r02`.

## 5. Order of work

1. **Lesson 4 first, alone, to « done »** — it is the reference of the four others (the first lesson built with the new
   kinds): `summit` and `deal` ∥ the repair of its written content ∥ its forges, board, satellites, walks.
2. While lesson 4 is walked: the kinds of lessons 5–8 (`lists`, `sort`, `measure`, `part`, the four modes).
3. Lessons 5, 6, 7, 8 in that order, each to « done » and committed before the next is declared finished.
4. The integration lesson `wadiya-idmajiya-aadad` after them (`INTEGRATION_LESSON_PLAN.md`).

A lesson is « done » by `LESSON_V2.md`: its status line ✅, its tests, its walks at 1366×768, 1024×768 and 1840×900,
its screenshots looked at. (The walks of the six lessons already v2 are still owed: master plan §4ter-0, step 16.)

## 6. Open, for the owner

(Item 1 is answered: « Go, full design », 2026-11-19. Design choices the kinds' agents left open are listed in
`LESSON_4_GATE_REPORT.md` § « Open ».)

1. **« go » on this page** — or the lean variant: only `deal`, `measure` and `sort` are added, and `summit`, `lists`,
   `part` are replaced by kinds that exist (`common` with the longest asked, `common` again, a mirror alone). It costs
   about half the kit work and brings back two of the review's findings (lessons 4 and 5 on the same experiment; a key
   without an experiment).
2. The fraction read as two gaps (lesson 8): accepted as the draft wrote it, or another reading.
3. The 1AM lesson `ikhtizal-kitaba-kasriya` (core prerequisite of lesson 8): proposed AFTER the five lessons, with a
   design of its own (equal writings, decimal fractions, reducing by the divisibility rules — no PGCD).
