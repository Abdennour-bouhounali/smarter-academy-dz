# The last lesson of each unit — « أدمج تعلّماتي » as three missions

**Status: PLAN, accepted by the owner on 2026-11-19. Nothing is built.** It is built after the other lessons of the unit
are v2 (for 4AM unit 1: after lessons 4–8 of `LESSON_V2_MASTER_PLAN.md` §9). First lesson: `wadiya-idmajiya-aadad`.

The owner's brief (2026-11-19): the last lesson of every unit trains the last exercise of the BEM paper, the integration
situation « الوضعية الإدماجية », which students hate. It becomes a game in the unit's own world: the student enters, starts,
and is told he has three missions. Through them he learns how to read the text, extract the data, turn them into numbers,
understand the question and define the goal. The home of the lesson also holds a recap of the unit's lessons and real training
exams. The three exercises come from the BEM annals when they exist. **This lesson and its engine are designed and coded by
Fable** (owner, 2026-11-19), not delegated to opus agents.

## 1. What the 19 BEM papers ask (2007–2025)

Source: `docs/official-BREVET-exams/` (the annals and their solutions), every paper read on 2026-11-19. The situation is always
the last exercise, « الجزء الثاني », worth 8 of 20 points: a story with a document (a plan, a table, a list of offers) and two to
five linked questions.

| Session | The situation | Family |
|---|---|---|
| 2007 | car hire, two tariffs (per km; per km plus a monthly fee): table, expressions, inequality, graph, the better tariff | offers |
| 2008 | a cylindrical tank fills a pool: volumes, a flow per hour, two functions, graph, what `f(x) = g(x)` means | volumes |
| 2009 | a car park on a plot of 2400 m² whose width is two thirds of its length: areas in `x`, places, income, a 30 % tariff | plot |
| 2010 | three phone formulas: cost of 100 minutes, expressions, graph, when the second is the cheapest | offers |
| 2011 | a newspaper, per copy or with a subscription: table, two functions, graph, the better one for 150 and for 270 | offers |
| 2012 | the floor of a hall (square, rectangle, half disc): lengths, a cosine, the price of the tiles | plot |
| 2013 | three car-hire agencies for a wedding: the cheapest for 7 days, three functions, graph, table, meaning of the equations | offers |
| 2014 | two SMS offers: table, expressions, graph, the right offer for each of two children | offers |
| 2015 | a grandfather's plot: a ratio (Thales), a length, an angle, a fair sharing, a price per m² after a 20 % tax | plot |
| 2016 | a square plot of 324 m² shared by two siblings: areas in `x`, one area double the other, graph | plot |
| 2017 | a plot of 1000 m² whose width is two fifths of its length: dimensions, two areas in `x`, equal areas, graph | plot |
| 2018 | two wages in a toy factory (fixed part plus a part per toy): expressions, lines, a system, when one is larger | offers |
| 2019 | **trees around a 60 m × 42 m plot, equal and largest spacing, one at each corner; then a budget: the price a tree cannot exceed** | numbers |
| 2020 | a swimming pool, per session or with a subscription: sessions for a sum, graph, the better tariff | offers |
| 2021 | **1188 crates of potatoes and 528 of carrots in identical lots: the largest number of lots, the content of each**; then a warehouse corridor (Thales) | numbers, plot |
| 2022 | painting a room 8 × 5 × 3 with a door and windows: area, buckets, labour, the price a bucket cannot exceed | plot |
| 2023 | a kindergarten's floor: a system for two prices per m², areas, 20 % of costs, profit or loss of the contractor | plot |
| 2024 | a bookshop, three offers to rent books: table, three functions, graph, when the second is the best | offers |
| 2025 | a commemorative race on a figure, three categories running different paths (statement read in part) | plot |

**Three families cover 18 of the 19 papers**: « which offer is best » (8), a plot or a room with areas and a cost (8), numbers
and PGCD (2); one paper is about volumes.

The PGCD also appears in the first part of eight papers, twice inside a story: 2010 (a glass sheet of 1,4 m × 2,20 m cut into
equal squares) and 2024 (a fabric of 270 cm × 378 cm cut into equal squares with no waste). So unit 1 has real BEM material.

**What makes a situation hard, as seen in the papers** — it is not useless numbers (they are rare):

- a condition carried by words, with no number: « في كل ركن شجرة », « دون ضياع », « أكبر ما يمكن », « مهما كان العدد »,
  « غير مسترجع », « لا تتجاوز أسبوعًا »;
- the role of each number: a fixed part or a part per unit, a length or a width, a price or a percentage of a price;
- a chain: the answer of one question is the datum of the next (PGCD → a count → a cost → a limit);
- a last question that asks for a decision or a limit, not a computation: « أيّ العرضين أفضل؟ », « ربح أم خسارة؟ مع التبرير »,
  « أعط القيمة التي لا يمكن أن يتجاوزها »;
- units to convert before computing (1,4 m and 2,20 m).

## 2. The idea

**The student is the engineer of the archipelago: whatever he reads, the world builds — his misreadings too.** A misreading is
never « wrong »: the world builds it and it looks unfair, wasteful or impossible. Across the three missions the world withdraws
until only the exam paper is left.

| Mission | What he gets | The world |
|---|---|---|
| 1 | the situation lived first, the exam text after | builds everything with him |
| 2 | the exam text first; he builds the model alone | arrives after he commits, for comparison |
| 3 | the paper only, in exam form | hidden in fog; after he submits, it plays his whole solution as a film |

For unit 1 (owner's choice: real BEM texts when they exist, labelled with their session; « DA » is shown as « دج »):

- mission 1 — BEM 2021, first part (the identical lots);
- mission 2 — BEM 2019 (the trees, then the budget);
- mission 3 — an exercise of the lesson's bank the student has not seen, served unchanged in exam form.

## 3. The stations of a mission

Each station answers one real difficulty of §1.

1. **The story without numbers** (mission 1 only). The numbers are hidden. He decides what he needs to know and sends the
   robot to count or measure. A datum he asked for has a meaning.
2. **He builds the situation.** He drags each quantity and each condition phrase of the text onto a small model of the scene.
   The world then runs HIS model: a missed « نفس العدد » gives unequal lots; a missed « في كل ركن » leaves a corner empty.
   He re-reads because of what he sees. In mission 2 the real scene arrives only after he commits, for comparison.
3. **The goal flags.** Before any computation he builds each answer sentence from tiles, with a hole for the number and its
   unit. The flags in order are his plan; a flag that needs an earlier one is linked to it (the chain).
4. **A bridge for each step.** He picks the key of the unit that opens it — the rules he forged in the unit's lessons — predicts,
   computes, and the world carries the result out. A wrong tool or a wrong reading of the result is built too (« 132 crates per
   lot » leaves crates on the quay).
5. **The seal.** The number enters its sentence. The world gives the answer its sense (the price range of the 2019 text lights
   the trees he can afford).

After mission 1, and only then, the four habits get their name on a tablet. Mission 1 ends with the reveal: the real exam text
of what he has just done. Mission 2 adds a short episode: he finds the faulty step in a classmate's copy, and the world replays
that copy's solution. After a mission he may change the numbers and replay the scene.

## 4. The home of the lesson

- the world and its three missions;
- **the recap**: the unit's islands, one per lesson, each showing the student's own sealed rule and a short replay of its
  experiment;
- **the training exams**: the lesson's bank as it is, in the existing exam sitting (`GAME_WORLD.md` §2quater).

## 5. Evidence

Missions 1 and 2 are never evidence. Mission 3 is a bank exercise in exam format: its first try is evidence under the existing
rule, re-judged by the server (`LESSON_V2.md` §1bis). What the student does at each station is saved in his world save, which
is private.

## 6. How it is built — one engine, every unit

A situation is DATA: the text with its marked quantities and condition phrases, a scene, the chain of questions with the tool
of each step. The engine extends what exists — the cases of « تعاونية الواحة » (`divisorIsles/cases.js`, `Depot.js`, `Worlds.js`:
the world packs what the student decided, `judge` answers by what the answer produces) and the tile forge (`kit/RuleForge.jsx`)
for the goal sentences. The stations are kit; a scene is a world mechanic.

| Scene | What it carries out | Needed by |
|---|---|---|
| lots | two stocks packed in identical lots | unit 1 (2021) |
| ring | things placed around a shape at equal spacing | unit 1 (2019) |
| tiling | a rectangle covered by equal squares | unit 1 (2010, 2024) |
| offers | two or three costs that grow with `x`, and where they cross | the 8 « offers » papers |
| plot | a plan with lengths, areas and a cost | the 8 « plot » papers |

**Order of work for unit 1** (each step ends with the checks of `LESSON_V2_MASTER_PLAN.md` §6):

1. mission 1 as a playable prototype → STOP: the owner plays it;
2. the engine (the stations, the data shape, the three scenes of the unit);
3. missions 2 and 3, the film of a bank exercise;
4. the home: the recap and the training exams;
5. the class-session version (the teacher runs a mission on the board), the class test, the pack;
6. the walks at 1366×768, 1024×768 and 1840×900, the screenshots, the gate report, the commit.

**For every other unit**: its last lesson is built at the end of the unit's batch, with the engine and the scenes that exist;
a new scene is added only when a family of §1 needs it.

## 7. Limits and open points

- Whether it is fun cannot be shown by a walk: mission 1 is played by the owner, then by a few students.
- The model of station 2 has slots; a student could fill it by elimination. More slots than data reduces this, it does not
  remove it.
- Mission 3 keeps the full exam text: the reading load stays.
- The annals hold no official marking scale: the marks of the « classmate's copy » episode are the platform's own until the
  owner provides official ones.
- BEM 2019 ends with a percentage and a budget limit taught in other chapters. It can be solved by arithmetic; a teacher
  should confirm it fits the week of the lesson.
- Not verified: that every story exercise of the bank (22 of the 50 of `wadiya-idmajiya-aadad`) fits one of the three scenes.
