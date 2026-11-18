# GAME_WORLD — the lesson played as a 3D game world (first built 2026-11-15)

**BINDING for the lesson v2 rollout (owner decision D6, 2026-11-17): every v2 lesson follows this contract — `LESSON_V2.md` says how a lesson plugs into it.** What has not changed: it was built on the pilot lesson and no real student has used it yet.

**Where it started:** a TRIAL on ONE lesson (`qasim-adad-tabii`), student view only — a free experiment the owner asked
for « without limiting it with the docs or what is already built ». Sections still marked « NOT validated » describe parts
he has not judged one by one; they are binding all the same, as built.

## 1. What it is

A student who opens the lesson enters **« أرخبيل القواسم »**: a chain of nine floating islands in a three.js scene, played in a
full window with a small hovering robot, « زيرو ». The teacher and Classroom Mode see no change.

- Switch: `world: { id: 'divisor-isles', content }` in the lesson's PACK (`lesson.pack.js`, `LESSON_V2.md` §1). The config
  has no `studentView` / `mission` any more (deleted with the old version, 2026-11-18).
- Mount: `LessonIndex.jsx` renders the world for a STUDENT (not a teacher, not Classroom Mode) of any lesson whose pack
  names a world, and for the teacher's preview (`?apercu=eleve`).
  `gameworld/LessonGameWorld.jsx` loads the WORLD (its `WORLDS` map: one entry per world, never per lesson) and the
  lesson's content (its pack) together, lazily — three.js never enters the entry bundle. A world names no lesson.
- **The old version is deleted (owner, 2026-11-18).** A v2 lesson has no mission player, no module page and no
  `?view=classic`: its module addresses (`/astaidd`, `/itqan`, …) redirect to the home, which is the world
  (`buildLessonRoutes › retiredModules`, `LESSON_V2.md` §2). A device without WebGL gets a message and the way out
  (`exitTo`). Trace: `docs/reports/OLD_VERSION_TRACE_2026-11-18.md`.

## 2. The mathematical idea of the world

Between two islands there is a gap of `a` cells. The student carries a mould of length `b` and fires planks of that length:
the scene lays `q` planks one by one and shows the `r` cells left — `a = b × q + r`, written live at the top of the screen.
**The bridge holds only when `r = 0`; otherwise it crumbles.** « b is a divisor of a » is seen before it is named.
The robot's chest screen shows the last remainder.

| Stage | What the student does | الكفاءة |
|---|---|---|
| 15, then 16 | mould 3 fills 15; the same mould leaves 1 cell on 16; moulds 2, 4, 5 to try | P1 |
| 42 | moulds 4, 5, 6, 7 — 4 is even and fails, 7 is odd and holds | P1 |
| island D | **« مصهر القاعدة »** (since 2026-11-18, §2sexies): the student forges the rule himself in the mirror of the island — only then tablet 🔑 « القاسم بالباقي » gives it its name | P1 |
| 48 | mould 6 lays 8 planks; a storm takes the bridge; among 5, 7, 8, 9 one fills 48 « without any division »; on the next island the SECOND forge (the plank's table) → tablet 🗝️ « القاسم بالجداء » | P2 |
| 120 | moulds 6, 9, 20 | P1, P2 |
| the four guardians | one fact (120 = 6 × 20), four sentences to put the right way round; then the guardians' mirror, the THIRD forge (which number is written first) → tablet 🗣️ | P3 |
| gate dash | eight sentences in the four phrasings, three gates, one right | P3 |
| 7 | nothing on the pedestals fills it; the workshop makes any length 1–9; then the stone's mirror, the FOURTH forge (two planks that hold over every gap) → tablet ⭐ | P4 |
| 756 | the lesson's problem: the student CHOOSES between moulds 32 and 36, types the Euclidean division of the one chosen, sees it built (32 leaves 20 cells; 36 holds with 21 planks), then pays 21 × 1850 | P1, P2 |

**Two results, never mixed** (owner's report, 2026-11-15): after a forge the screen gives the student's PREDICTION its own verdict
first — « ✓ توقّعك صحيح: بقيت خانتان فارغتان » in green, with the robot cheering — and only then, in a neutral tone, what the mould does
to the gap (« القالب 5 لا يملأ 42: الجسر لا يثبت »). A remainder that is not 0 is a fact about the mould, not a mistake: it is amber,
never the red of an error, and there is no buzzer nor shake when the prediction was right (`state.verdict`, `Verdict` in the HUD).

**What to do next is shown IN the world** (owner's report, 2026-11-15): the prompt of the thing the robot can use floats above it
as a big bouncing bubble — « اضغط E — ابنِ الجسر بألواح طولها 3 » (« اضغط هنا » on touch), anchored by `Game.placePrompt` — and the forge
platform of the current bridge carries a beacon (light beam, halo, bouncing arrow) as soon as a mould is in hand. The bottom
button stays for thumbs; it is never the only signal.

**Never a prompt that does nothing, never a wrong answer without a next step** (owner's report, 2026-11-15, island « المرفأ الأخير »):

- a thing the student cannot use yet shows NO prompt (the store of the last bridge stays silent until the island's stone is answered),
  and the beacon stands on the one thing to do now — the question stone first, the platform after;
- the objective at the top names the place and the action (« اذهب إلى لوح الجزيرة (السهم الأصفر) وأجب عن سؤاله »);
- a wrong answer on a multi-choice stone is judged choice by choice with the division that proves it (« ✗ 7 = 3 × 2 + 1 — تبقى خانة
  واحدة فارغة », « ✓ 7 يملأ 7 تمامًا »), and the missing moulds are COUNTED, never named (`answerQuiz` → `marks`, `missing`);
- the store states its mission and its three steps on every screen, a mould already tried keeps what it left (« جُرِّب: تبقى 20 خانة »),
  and each refused division says why in the world's words (`checkDivision`: `long` — the planks overshoot the gap, `sum`, `big`).

Rules kept from the platform's method: the student acts first and a rule is named only on a tablet that opens afterwards (and,
on island D, only after he has forged it himself — §2sexies); the
student announces the remainder before each forge (a right first prediction is a star); all wording is the platform's own.

## 2bis. After the story: « خريطة المعارف », « فضاء التدريب » and « تعاونية الواحة » (2026-11-15)

The story is played once to UNDERSTAND. Three things let the student come back — before an exam, without replaying it. All three
open from the title screen, so no walk in the world is needed.

### « خريطة المعارف » — the full page of what the lesson teaches (`KnowledgePage.jsx`)

A FULL page (not a card, no scrolling): the lesson's own mind map — the 13 nodes of `knowledgeGraph.js` (the idea, the two
definitions, the reminder on Euclidean division, the two examples, the check, the four sentences, 1 and the number itself, the two
common mistakes, the warning « القاسم ليس 0 », the summary) with their labelled links — and, for the four rules, the memo sheet of
`knowledge.jsx` (rule, hook, example, trap, exam tip, memory test). **Nothing is retyped: the page imports the lesson's data**, so a
change in the lesson changes the page. Three families of cards, three colours: what to know, what helps, what to beware of.

Gamified, and saved (`know: { read, sealed }`): a card is locked until its key is owned (a rule is named only after it is
discovered), is ticked once read — a common mistake only once the student has uncovered why it is wrong — and a rule is sealed in
gold by its memory test.

**The discovery JOURNEY « رحلة الاكتشاف »** (owner, 2026-11-15; rebuilt the same day after « the text is very small ») — the way the
page OPENS until everything is found. It is not a small graph: it is ONE card at a time, large and comfortable to read, in the
middle of the screen (`Journey` in `KnowledgePage.jsx`):

- the card being read takes more than half of the screen, with its explanation, memo sheet, memory test and training on it;
- beside it, the MYSTERY cards of what follows (the lesson's own `reveals`, so the order of discovery is the lesson's order): a tap
  turns one over — it is found (`game.discover`, saved in `know.found`) and becomes the card being read;
- above, the trail of what was found: any card of it can be read again; when a branch ends, the cards that still hide something
  are offered; a locked card (key not owned) cannot turn anything over;
- « الخريطة كاملة » shows the thirteen cards and their links at once, and « رحلة الاكتشاف » comes back: nothing is out of reach.

**The page is scaled to the screen** (`useFit`: designed for 1280 × 720, zoomed up to ×1.8): a big screen gets big text. Measured by
the walk at 1366 × 768 — card title ≥ 34 px, explanation ≥ 22 px, next card ≥ 20 px; at 1840 × 900: 44, 28 and 26 px.

**« تدرّب » opens ON the card, inside the page** (owner, 2026-11-15; `Trainer.jsx`, logic `trainer.js`): a tab of every card, six
questions on the point of that card, in TWO FORMATS that alternate and drift toward the exam so the student adapts to it —
`SESSION = game, game, exam, game, exam, exam`:

- **game format** (dark, the looks of the games): tap the right gate, true / false in one tap — small numbers, mental arithmetic;
- **exam format** (a white ruled sheet, « السؤال 3 », the exam's verbs): « أجرِ القسمة الإقليدية للعدد a على b، ثمّ استنتج »,
  « بيّن أنّ b قاسم للعدد a، ثمّ استنتج قاسمًا آخر », « أكمل بالعبارة المناسبة », « صحيح أم خطأ؟ علّل », « دون أيّ حساب، اذكر قاسمين » —
  paper numbers, the answer typed in its own shape (`a = b × [ ] + [ ]`, then « إذن b [قاسم / ليس قاسمًا] للعدد a »).

A wrong answer gets a HINT first — what the answer gives, never the answer — then, after a second one, the written correction
« التصحيح » (`check` → `hint`, `fix`). Stars = questions right at the first try, kept per card (`know.trained`). The 13 cards map
to five plans (`PLAN_OF`): by remainder, by product, the four sentences, 1 and the number itself, and a mix for the idea and the summary.

### « وضع الورقة » — the paper mode (`Paper.jsx`, logic `kit/longDivision.js`; owner, 2026-11-15)

An exam has no music and no gates: it has a sheet, a pen and a method. **Every screen that asks for written work is in paper
mode**: the exam-format questions of the trainer, the calculation steps of the depot, and — in the story — the store of the last
bridge (the only place of the story that needs paper). The game formats stay playful: the contrast is the lesson.

- **Silence**: `game.paperMode(source, on)` stops the music (`audio.setMusic`) while a paper screen is open and brings it back when
  the last one closes; the effects stay. A sign says so — « وضع الورقة · بلا موسيقى » with a clock that counts UP (`PaperChip`).
- **The pen first** (`PaperGate`): the answer boxes stay closed behind « خذ قلمك وورقتك »; the button « كتبتُ على ورقتي — أنقل جوابي »
  wakes after a few seconds, so a reflex tap is not possible. The data of an exam statement are underlined for the student
  (« أقرأ وأسطّر المعطيات »).
- **How to think, how to write** (`PaperModel`): « كيف أكتبها على الورقة؟ » opens a model sheet — the Euclidean division POSED as
  on paper, one step per tap, each step said aloud (« في 59، كم مرّة 17؟ … أطرح … أُنزل الرقم … »), then the check and the sentence
  to write. Above it, the six gestures of an exam answer (`METHOD`): read and underline, find what is asked, choose the rule,
  compute on paper, check, write the sentence.
- **It never gives the answer**: before answering, the model shows a TWIN division (`twin`: same nature, other numbers); only
  after the written correction may the student read « التحرير النموذجي » of his OWN question.

### « فضاء التدريب » — the practice space (`KnowledgeMap` in `DivisorIsles.jsx`, logic `kit/ladder.js` + the lesson's `world/practice.js`)

Five nodes in the order of the mind map; 16 levels, 48 ★, easiest first. Each key: two runs of the gate dash, then a field mission
at the depot. The summary node « 🏆 تحدّي الامتحان »: one mixed run, then three full cases. « واصل التدريب » always proposes the next level.

- **What opens what** (`nodeOpen / levelOpen / nextLevel`): a node opens with its key — earned in the story on this device, or proven
  by the lesson's synced progress (`keysFromModules`), so a new device can revise; a level opens after the one before; the exam node
  opens once level 1 of the four keys is passed. « من البداية » restarts the STORY only (`keysEver`, `practice`, `know` stay).
- **The gate dash is MENTAL ARITHMETIC** (owner, 2026-11-15, after questions no teacher could answer in the time of a gate): every
  number to work with stays inside the multiplication tables — `MENTAL`: a ≤ 100, a divisor or a factor ≤ 10 — and the slowest
  gate leaves 5 seconds. A test enforces it on every generated wave. Bigger numbers belong to the cases of the depot and to the
  exam format of the trainer, where the student has paper.
- **A run**: 6 gates, 3 shields, stars = shields left, points with a streak bonus. Questions are GENERATED (`makeRun`, nine
  kinds; `isRight` is the one definition used to build, judge and test). A wrong gate STOPS the run on a card — the chosen number
  with the division that proves it, the right one with its own — and a question of the same kind is added.
- **A wave the lesson writes itself** (2026-11-18): the world's `strings.js` writes the sentence and the guidance of the types it
  knows (`missing`, `divides`, `multipleOf`, `remainder`…). A lesson whose rule needs another sentence gives the wave a type of
  ITS OWN (judged by its own `isRight`) and carries the words as data: `say` (the sentence, `$…$` for maths, LaTeX with two
  backslashes) and `why: { right, wrong: { [gate]: line } }` (one line per wrong gate). `waveSay` and `explain` fall back to
  them for any type they do not know. Reference: `khawass-qawasim/world/practice.js` (« عدد يقسم $21 + 35$ », « قاسم مشترك
  للعددين 21 و 35 », « عدد يقسم باقي قسمة 42 على 12 »: the right gate is the common divisor, the wrong ones divide only one
  of the numbers).
- **The rule is never far**: « القاعدة » during any run or case (it pauses), « ذكّرني بالقاعدة » on every guidance card, and the rule
  shown by itself after two mistakes. It is always the rule the CURRENT question uses.
- **الكفاءات**: a run of the gate dash writes no evidence; see §4 for what does.

### « تعاونية الواحة » — the real-world game (`cases.js`, `Depot.js`)

The student runs the packing depot of a cooperative (dates, olive oil, eggs — a 3D oasis island far from the archipelago). A level is
a short day of ORDERS; an order is a real case solved in one to four STEPS. After a step **the depot packs for real what the student
decided**: crates appear one by one, the equality `n = b × q + r` follows, and what does not fit stays on a red mat — or the last
truck stays half empty. Seven kinds of order, one per idea:

| Mission | The case | Idea |
|---|---|---|
| `fit` | which crate leaves nothing on the floor? | divisor by the remainder |
| `count` | the client wants q equal full crates: what capacity? | divisor by the product |
| `orders` | one crate size in stock, three orders: which one can go? (worded in the four phrasings) | the four sentences |
| `special` | an order no usual crate fits: the two packings that always work | 1 and the number itself |
| `day` | one day, three orders: `cost` (two crate sizes, the invoice), `profit` (which tray earns more), `trip` (the remainder MEANS one more truck) | exam case |
| `share` | another world — see below | exam case |
| `tiling` | another world — see below | exam case |

**Three worlds, three real stories, each carrying a value** (owner, 2026-11-15) — the cases of the summary node are not all at
the depot (`WORLD_OF` in `cases.js`, scenes in `Depot.js` and `Worlds.js`, one contract: `setOrder / runSim / clearSim / ship`):

| Level | World | The story | The value |
|---|---|---|---|
| exam 2 | « تعاونية الواحة » (`day`) | a whole day: the invoice (`cost`), the best packaging (`profit`), the export trucks (`trip`) | honest accounts |
| exam 3 | « قعدة الأصدقاء » (`share`) | sweets shared between a child and his friends: what is left on the tray, then how many children share them with nothing left | fairness — nobody takes more than the others — and generosity: he invites the neighbours |
| exam 4 | « ورشة التبليط » (`tiling`) | a tiler lays a corridor: the tile that covers it without a cut, the whole floor, the boxes to buy | work done properly — no tile cut, no gap — and no waste: not one box too many, the spare tiles kept for repairs |

A value is part of the SITUATION (it is what makes the remainder matter: an unfair share, a tile to cut, a box wasted), never a
sentence added on top. No person is drawn: the friends are their plates and names, the tiler is his tools. A step never asks for
a number the world has just shown by packing.

**« حيلة » — a calculation shortcut after the answer** (`kit/tips.js`; owner, 2026-11-15): when a clean one exists for the numbers at
hand — lean on a round product, as in 180 ÷ 19: « 19 × 10 = 190، ثمّ 190 − 19 = 171؛ من 171 إلى 180 يبقى 9: الباقي 9 »; a rule of
divisibility (digit sum for 3 and 9, last digit for 2, 5, 10); a product split in tens and units for an invoice. It is shown ONLY
after a right answer or the final correction (before, it would give the result away), and the function returns null when no
shortcut is clearly simpler: a tip that confuses is worse than none. The tests re-compute every equality a tip writes.

**Everything a step needs is on its screen** (owner, 2026-11-15 — the platform's « no back-and-forth » rule, applied to the cases):
the order card carries, under the story, the lines of what is known NOW — the data of the story and the results the student has
already found in this case (`facts(order, step)`: « طول الرواق: 300 سم », « 300 = 25 × 12: 12 بلاطة في الصفّ », « المجموع: 4 × 12 = 48 بلاطة »).
A result appears only once it is found. The world keeps what was built too: after a mistake and « أجرّب من جديد », the wrong
attempt is cleared and the last right construction comes back at once (`caseRun.keep`, `resumeCase`). A test checks, for every
step of every case, that each number the answer needs is in the facts, the prompt or the options.

**Going back** (owner, 2026-11-15): every answer of the day is kept, right or wrong (`caseRun.log`, published as `depot.history`).
Above the current question, the steps already done are chips — « الورشة 1 · 2 » — and a tap opens that step again, READ-ONLY: its
question, each answer the student gave as he gave it (`answerParts`: the option chosen, or the whole template with his numbers),
why a wrong one was wrong, the shortcut, and the facts as they were at THAT step. « أعود إلى سؤالي » returns; the current step's
boxes are only hidden meanwhile (the paper gate is not asked twice). The trainer of the knowledge page does the same: its six
dots are buttons, an earlier one shows the statement, the answers given (`answerLabel`) and the correction.

`judge(order, step, value)` is the one place that says whether a step is right and, when it is not, WHY — **by what the answer
produces** (« بسعة 9: 96 = 9 × 10 + 6، تبقى 6 علب على الأرض »), never by giving the answer. An order pays 1200 دج, less 300 per mistake;
three mistakes end the day. Money is written « دج », without a thousands space.

## 2quater. « الامتحان الأبيض » — the exam sitting (PROTOTYPE, 2026-11-16)

**Status: a prototype of the SITTING only, to judge the feel. Not the rebuilt exercise bank, not validated.**
Opened from a level of the exam ladder (§2quinquies; until 2026-11-16 a button of the title screen opened it directly). `ExamSitting.jsx`, logic `sitting.js`, style
`examSitting.css` (prefix `xs-`). It is the opposite of the game on purpose: one sheet of paper, three colours — black for the
subject, blue for what the student writes, RED for the corrector and never before the copy comes back — silence, no stars.

| Phase | What the student has | What he does NOT have |
|---|---|---|
| `read` — reading time | the whole subject (three exercises, the longest in the widest column); a tap underlines a word or a number in pencil | any answer box |
| `sit` — the sitting | the subject on one side, the answer sheet on the other (one exercise per page, never a screen back); answers typed in their own shape; a flag « أعود إليه »; a quiet pace line; one notice at the last minute; « أسلّم ورقتي » asks once; **« خروج »** in the header (reading time and sitting; owner, 2026-11-17) leaves after ONE confirmation (« تخرج من الامتحان؟ » — « أواصل » / « نعم، أخرج »): nothing is marked, no evidence is sent, the ladder does not move, and the same level opens again on a new sheet (`Game.js › quitSitting`); **a forgotten exercise is shown first** (owner, 2026-11-16): if an exercise that is not on screen has NO box filled at all, the first « أسلّم ورقتي » turns the answer sheet to it and names it (« انتبه: لم تكتب شيئًا في التمرين الثاني. ها هو أمامك. » + « أواصل ») — once per sitting; the next « أسلّم ورقتي » is accepted, exercises empty or not (`sitting.js › forgotten`, `touched`). It says only « empty », never right or wrong; the time-out hand-in is not delayed by it | any verdict: no tick, no mark, no red, no hint, no sound |
| `back` — the copy handed back | the total in a red circle and an appreciation; a red mark per question (✓ ½ ✗, « لم تُجب »); for a question: the scheme to tick against his own paper, then « أرشدني » (the rule, back to the paper — never the answer) or « اشرح لي » (the model copy, in red); « دفتر أخطائي »: one line to write by hand per rule that lost points | — |

- **The subject is generated** (`makeSubject(rand, level, weak)`; level 4 is the 10-point, 12-minute sheet): a Euclidean division
  and its verdict, an equality to read both ways and the right phrasing, then a situation (two crate sizes, the count, the
  invoice). No two sittings are alike. The reading sheet has as many columns as the level has exercises.
- **Marked by a scheme** (`mark`): half the points of a division for the quotient, half for the remainder; a blank earns 0 and is
  shown as a blank, not as a mistake. `model` writes the model copy; `scheme` what the corrector looks for on the paper.
- **الكفاءات**: at the hand-in — and only then — every answered question the server can re-compute is sent as evidence
  (`evidenceOf`, context `case`): a first and only try, unassisted. Never a blank, never the invoice.
- Check: `node apps/web/e2e/gameworld-sitting.mjs [outDir]` (also with `E2E_SIZE=1024x768` and `1840x900`): 45 checks (the
  ladder, a sitting, the moment between two levels, « تقدّمي »), and at every screenshot nothing scrolls, nothing is cut,
  nothing is scaled below ×0.8. Unit: `sitting.test.js`, `journey.test.js`.
- Not built yet (the rest of the proposal): real BEM subjects, a full BEM-length exam, spaced returns, the resume of an
  interrupted sitting, the photo of the paper, the parent's line.

## 2quinquies. Two practice spaces, the exam ladder, « تقدّمي » and « مختبري » (2026-11-16, NOT validated)

Owner request: the student practises in the GAME first, then in the REAL format; the exercises follow his level; the game is
felt BETWEEN two levels of the exam, never inside a sitting.

- **« فضاء اللعب » / « فضاء الامتحان »** — a switch at the top of the practice hub (`KnowledgeMap`, `data-di-space`). The game
  space is the 16 levels of §2bis. The exam space opens once the student has PLAYED: the four keys and the first run of each
  (`journey.js › examOpen`). The title screen no longer opens a sitting directly.
- **The ladder** (`Spaces.jsx › ExamLadder`, `sitting.js › LEVELS`): five rising steps.

  | Level | Sheet | Minutes | Points |
  |---|---|---|---|
  | 1 « القسمة والقاسم » | one division, small numbers | 5 | 3 |
  | 2 « القاسم والجداء » | a division, a product | 8 | 6 |
  | 3 « أوّل وضعيّة » | a product, a first situation | 10 | 7 |
  | 4 « امتحان قصير » | division, product, situation | 12 | 10 |
  | 5 « على منوال الامتحان » | exam-size division, a situation, the lorries (the remainder means one more lorry) | 15 | 12 |

  A level is passed at **80 %** of its points (`PASS`); stars: 1 from 80 %, 2 from 90 %, 3 for a full paper. A passed level
  opens the next. Every sheet is generated: a level played again is never the same sheet.
- **Adapted to the student** (`applySitting`, `weakKinds`): after a sheet under 80 %, the kinds of exercise where points were
  lost are remembered for that level; the next sheet of the level is SIMILAR with other numbers and puts those kinds FIRST
  (`focus`). After two fails in a row the student is sent to train on the rule first (« أتدرّب أوّلًا » opens the card).
- **The moment between two levels** (`Spaces.jsx › Promotion`, `Game.js › finishSitting`): when the copy is closed the game
  comes back — the finale sound, the stars one by one, confetti, « ارتقيتَ إلى الدرجة n! » — or, under 80 %, a calm card:
  « ليس بعد… ورقة أخرى وتنجح ». Nothing of this exists inside the sitting.
- **« تقدّمي »** (`Spaces.jsx › ProgressPage`, button on the title screen, `data-di-progress-open`): one page for THIS lesson —
  the road in five stations (story, keys, game stars, exam levels, knowledge cards); per key: the game stars, the sealed memo
  sheet, the answers given as in an exam (right / all), and the platform's own status when the page received it; an exam
  readiness; and ONE next thing to do (`journey.js › nextStep`), one tap away.
  **The readiness is honest**: half the ladder (levels passed / 5), half the first tries done as in an exam (counted from the
  same claims that go to الكفاءات, at least four of them). The game's stars never enter it.
- **« مختبري »** (button on the title screen, `data-di-lab-open`): the lab of the lesson, the same for every lesson —
  contract `LESSON_LAB.md`. Here it is rendered inside the game's root, with the game's sound.


### « عُدّة الانطلاق » before the world (phase 1, 2026-11-17)

The FIRST « ابدأ المغامرة » of a student plays the launch of the lesson (`lessons/common/launchkit/`, contract
`LAUNCH_KIT.md`): overlay `{ type: 'launch', then: 'start' }`; when it ends, `Game.js › launched` closes it and starts the world.
Afterwards « واصل » goes straight in (`launchkit/store.js › launchDone`) and « 🎒 عُدّتي » on the title screen opens the kit again
(`data-di-launch-open`). The 3D world is neither simulated nor drawn behind it (as behind « مختبري » and the exam sheet). The
walks of the game world seed the launch as already played.

## 2ter-0. Three rules a world's screens never break (owner, 2026-11-17 — each one was a defect he found on lesson 2)

1. **A formula is DRAWN, never read.** Every sentence a lesson gives a world, a forge or the kit goes through `MathText`:
   a lesson's string may carry `$…$` anywhere, and a screen that prints it as plain text shows « `$5 \times 5 = 25$` ».
   The defect was the sentence under a prediction (`RuleForge.jsx`, `T.fact`). **Checked**: `noScroll` of the four world
   walks fails on any dollar sign or backslash command readable on screen (« raw formula on screen »), and the walk of
   lesson 2 reads the sentence under EVERY prediction.
2. **A world's screen writes no number and no word of a story.** The store of the last bridge printed the pilot's gap
   (756), its two moulds (32, 36) and its price (1850) inside lesson 2: the equation showed a wrong number, the mould 32
   was offered, and the price to pay could never be right — a dead end. `Boss` now reads `game.bossSeg`
   (`{ a, boss: { options, price } }`) and the lesson's `text.boss` (`steps`, `change`, `unit`, `err.*` — a lesson that
   speaks of shelves overrides every sentence that says planks or moulds). A lesson keeps the numbers of its last bridge
   in ONE constant that its segment and its sentences both read. **Checked**: the lesson's `journey.test.js` (its store
   says its own numbers, in its own words; the world's screen contains none of the pilot's) and its walk, which PLAYS the
   store through the screen and compares each number shown with the story's. A walk that drives the game by its commands
   proves nothing about what the student reads: lesson 2's first walk stopped at the store's door and saw none of this.
3. **The student can always leave.** The veil of a dialog covers the top bar and its ✕. `kit/parts.jsx › Card` draws the
   same ✕ again over the veil, at the same corner (`ExitTo` context given by `LessonWorld`; `data-di-exit`), and every
   step of the store has « إغلاق » (the payment step had no way out; the store opens again where it was).
   **A full screen that covers the top bar draws its two buttons again** (owner, 2026-11-17: « add also the quit button
   and the sound on off in these kind of views »): the rule forge shows, at the end of its header and in every phase,
   the sound button and the ✕ — `kit/parts.jsx › SoundToggle` and `ExitLink`, the SAME components the top bar and the
   dialogs use (one button, one stored choice `smarter_world_sound`). A new full screen of a world does the same. The knowledge page and « تقدّمي » carry it too (2026-11-18). ONE exception: the exam sitting (`kit/ExamSitting.jsx`) is silent by design (« صامت » in its header), so it has no sound button.
   **Checked** in lesson 2's walk: the ✕ is over the dialog and a click reaches it; the payment step closes and reopens;
   in the forge (while he writes his rule, and on the chart) the ✕ and the sound button are on screen, uncovered, beside
   the steps, and the sound is turned off and on from there.

## 2ter. No scrolling anywhere (owner rule; restated 2026-11-15: « the student must never scroll »)

Nothing in the game world scrolls — not the page, not a card, not a panel — and nothing is cut.

1. **Show less first.** A panel that risks being tall shows less: while training, the card's head steps back; once an exam
   answer is final, the input form is replaced by ONE line (the question and what was answered) so the correction and the
   shortcut have the room; an earlier step is read in place of the current one, not under it.
2. **`Fit` guarantees the rest** (`Fit.jsx`; it remembers the scale that overflowed and never grows back past it — a text in
   columns re-wraps when scaled and would otherwise loop for ever): every panel puts its content in this box — the pop-up cards, the practice hub, the
   model sheet, the body of a knowledge card, the bottom panel of a case. It never scrolls; when the content is taller than its
   room it is scaled down just enough, and grows back when there is room. It is the LAST resort: a panel whose content is scaled
   below ×0.8 is a panel to redesign (the walks print those places).
3. **Checked at every screenshot of the three walks** (`noScroll` in `e2e/gameworld-*.mjs`): nothing can scroll, no fitted box cuts
   its content, no panel leaves the screen, the page is not taller than the window.

## 2sexies. « مصهر القاعدة » — the rule forge (2026-11-18; all four rules since 2026-11-17 of the rollout; NOT validated)

Owner, 2026-11-18: the method says the student discovers, touches, observes « until concluding the maths rule » — « how are we
giving him the chance to do that? »; the earlier answer (a space where he writes the rule after the manipulation) cannot tell
him whether his rule is right, and « it must be integrated in the game of the lesson, inside, not as a separate lab or game ».

On island D the game used to ask one multiple-choice question, then a tablet TOLD the rule. Now **the student defends his rule,
and the island's mirror judges it with bridges** (screen `kit/RuleForge.jsx`, frame `kit/forge.js`, overlay
`{ type: 'forge', key }`). The table below is the FIRST forge; the three others follow the same six steps (« The four forges »):

| Step | What happens | Never |
|---|---|---|
| The evidence | « سجلّ عبورك »: every bridge he fired on the way (`Game.logBridge`, saved) — the last five of his own, then those the mirror builds in front of him (marked 🪞), eight lines, each a small drawn bridge | a line he did not see |
| ① « تنبّأ » | bridges he has NOT built: « will it hold? ». The mirror builds it plank by plank and writes its division. **Three right in a row = the rule is in his head** (at most six are asked; a trap of two even numbers that crumbles comes second) | « wrong »: a missed prediction is « توقّعك لم يصب هذه المرّة », and what the bridge did is a fact, in amber |
| ② « اكتب قاعدتك » | « يثبت الجسر عندما: [ماذا أقرأ؟] [كيف يجب أن يكون؟] » — two tiles among four and four: sixteen rules can be written, ONE holds | an empty box to write in |
| ③ « المرآة تختبرها » | his rule is run on his OWN evidence, line by line; the first bridge that contradicts it stops it: « قاعدتك تقول إنّ جسر 15 باللوح 3 ينهار — لكنّك رأيته يثبت », with his rule applied to that bridge in words | the platform's opinion: the verdict is a bridge |
| The attack | a NEW gap. A false rule that survived the evidence: the smallest gap where it fails, which he SEES fall. The right rule: two hard gaps (two even numbers that crumble, an odd plank that holds). He first says what HIS rule predicts | a rule sealed without having been attacked |
| ④ « اختم مفتاحك » | the rule that survives is his key; he may say it in his own words (optional); then one gap too long to count (about 100 cells): the division typed, and the rule decides | counting cells |
| The name | the tablet opens with « مفتاح صنعتَه أنت »: HIS rule and his words first, then « وهذا اسمها في الرياضيات » — the official wording and the word « قاسم » | the name before the idea |

- **A rule is two tiles `{ q, c }`** — a quantity read on the gap and the plank (`QUANTITIES`: the remainder, the quotient, the
  plank, the gap) and a condition on it (`CONDITIONS`: equals 0, is even, is smaller than the plank, is greater than 1) — so it can
  be EVALUATED on any bridge: that is what lets the game test it and look for the case that breaks it (`runOnEvidence`,
  `attacks`). The false rules are the ones students really hold: « the plank is even », « the remainder is smaller than the
  plank » (true of every division, so it says every bridge holds).
- **The robot helps without giving the rule** (« ساعدني يا زيرو », three nudges, `nudge`): two of his own bridges over the same
  gap to compare; two bridges built in the mirror, the same plank on a gap and on the next one; a choice of two rules that he
  must still test.
- **How the rule was found is kept** (`Game.sealRule` → `rules[<key>]` in the save): the tiles, his words, how many rules he
  tested, the nudges and the level they give (`alone` / `nudged` / `guided`), his predictions. Browser only for now: a teacher
  does not see it yet.
- **It cannot be skipped**: a forge left unfinished opens again at the next « واصل » (`Game.start`). The 3D world is not drawn
  behind it.
- Check: `divisorIsles/ruleForge.test.js` (the law of the world: exactly one of the sixteen rules agrees with every bridge;
  the evidence, the predictions, the nudges) and the lesson's `world/forges.test.js` (29 tests — for EACH of the four
  forges: sixteen rules can be written and one holds; every false rule is contradicted by the evidence or by an attack; the
  right rule survives two attacks; the predictions alternate; every sentence is worded; the last step refuses any wrong
  box). The story walk `gameworld-divisor-isles.mjs` (104 checks) crosses the four forges: in each a false rule is refuted
  in front of him, the right one is attacked, the last step is typed wrong then right, and the tablet shows HIS rule.

### The four forges of the pilot — no rule of the lesson is told

| Key | Where | The tiles (a rule = one per slot) | A false rule students hold | Its evidence | The last step, typed in its own shape |
|---|---|---|---|---|---|
| 🔑 `qasim-baqi` | island « المرايا » | what I read × how it must be (4 × 4) | « the plank is even » | his own crossing | the Euclidean division of a gap of about 100 cells, then « holds / crumbles » |
| 🗝️ `qasim-jidaa` | island E, after the storm | what I read × how it must be (4 × 4): « the gap = the plank × a natural number » | « the gap = the plank + a number » (true of every bridge) | his own crossing; the mirror writes a PRODUCT, never a remainder | `b × [k] = [p]`: the biggest product of the plank's table that does not pass the gap, then the verdict |
| 🗣️ `siyagh-mutakafia` | the guardians, once the four sentences are right | one slot per phrasing (4 × 2): is the number written first the plank or the gap? | « the plank is always written first » | the guardians' four sentences; a case is a SENTENCE — asked alone, then the mirror builds the bridge it means | one fact (`96 = 8 × 12`) written in the four sentences, eight boxes |
| ⭐ `wahid-wa-nafsuh` | the stone of island H, once the gap of 7 is understood | the shortest plank that always holds × the longest (4 × 4) | « a plank of 2 always holds », « twice the gap » (a multiple, not a divisor) | the mirror builds the two planks of HIS rule over the gaps he crossed | a gap never seen (143, 187…): the two planks that surely hold, no calculation |

**How a forge is made** (binding for the next lessons):

- **The kit runs it, the lesson describes it.** `kit/forge.js` documents the description: `key`, `slots` (the tiles),
  `says(rule, case)`, `isTheRule`, `ruleText`, `explain`, `caseId`, `evidence(rows)`, optional `tests(rule, rows)` (a rule
  that builds its own cases — the fourth forge), `predictCases`, `attacks`, `nudge`, `use` (`make`, `lines` of tokens with
  `slot()`, optional `verdict`, `check` → `'ok'` or a key of `text.use`), `logs`, `text`. A case always carries `held`:
  what the world really does with it. The lesson's forges are `world/forges.js` → `lesson.forges[key]`.
- **The world says what a case is and draws it.** Here a case is a bridge: `divisorIsles/ruleForge.js` (`outcome`,
  `holds`, `evidence`, the pool `SMALL`, `attackOn`, `casesOfKinds`, `nudgeWith`, the shared wording `BRIDGE_TEXT`, and
  the law of the world as a forge, `remainderForge(key)`) and `divisorIsles/forgeParts.jsx` (`FORGE_PARTS`: the bridge in
  the mirror, the line of evidence, the beats of a build). The class board still reads the remainder tiles from there.
- **The story opens it and goes on after it.** `Game.openForge(key)`; `sealRule(key, record)` opens the tablet, then
  `afterKey[key]` runs what the story does next; `pendingForge()` reopens a forge left unfinished. A forge cannot be
  closed.
- **Exactly ONE rule holds, and every other rule is refuted in front of the student.** Write the test first
  (`forges.test.js` is the model): every rule the tiles allow is run on the story's crossing and attacked.
- **A sentence is never shown with its answer.** A case that is a sentence is asked alone; its bridge is built after the
  answer (`forgeParts › Mirror`).
- **Formulas go through `MathText`.** An equality inside a sentence of a forge is written `$…$`; the screen renders the
  question, the attack, the last step and the rule applied to a case with it.
- **On a phone** the forge does not zoom itself (one scale): it has a compact layout in `kit/ruleForge.css`, and its list
  and its panel slide inside themselves.
- **12 px floor at every size** (2026-11-18 — not a phone-only rule): no visible text of the kit, the forge or the class
  board is under 12 px ON THE SCREEN (computed size × every CSS zoom). A small label is written
  `max(var(--di-min-font, 12px), <its size>)`; a frame that zooms itself below 1 sets `--di-min-font` to 12 px in its
  own units (the forge: `RuleForge › rf-fit`, 15 px at the 0.8 of 1024×768); a `<small>` with no size of its own is
  floored by `:where(.di-root) small` / `:where(.cs-root) small`. Exempt: the labels of the knowledge map (`.di-kmap`,
  placed in % and scaled with its panel) and what `Fit` shrinks to make a too-tall card fit. The walks check it with
  `fontFloor: true` (`e2e/lib/walk.mjs`).
- NOT done: the class board (`LessonBoard`) forges only the first rule with the class; the three others are still asked
  and proved there. How a rule was found is kept in the browser only.

### « استكشف » — a rule found by an experiment of ITS OWN nature (owner, 2026-11-17)

> « it is stacked to the same analogy used on the lesson 1 but each rule has its own nature and way of discovery, the
> student get lost at some point and he suddenly get told the rule » — then: « by experiencing, touching, step by step:
> the student is never told the rule, he gets the rule himself ».

The mirror with its tiles (predict → write → test) fits a rule that is ONE condition on a case the student has built
(the remainder, the product). It does not fit every rule: asked in the same mirror, « where does the search stop? » and
« what to read instead of dividing? » were abstract questions, and their help ended on a choice between two written
rules — the rule was told. **A rule whose nature is a search, a pattern or a procedure is FOUND FIRST, by an experiment
made for it.** The forge then opens on that experiment:

- **`forge.inquiry`** (the lesson's data: its numbers and its words) and **`parts.Inquiry`** (the world's screen) make
  the first phase of `RuleForge` — « استكشف ». No prediction is asked and no tile is offered before it is over.
- **`forge.fromInquiry(result)`** says what the experiment gives the mirror: `rows` — the evidence is what HE did in it —
  and, when the experiment itself wrote the rule (`inquiry.writes`), `rule`: what he claimed and the world accepted IS his
  rule, the tiles are skipped and the mirror ATTACKS it at once. The steps shown are then « استكشف → المرآة تختبرها →
  اختم »; otherwise « استكشف → اكتب قاعدتك → المرآة تختبرها → اختم ». The predictions are not asked again: the experiment
  held them.
- **The help of such a forge never narrows to a choice of two rules**: its third help is one more pair of cases to look at.
- **An experiment says facts, never the rule**: every sentence tells what the strip or the chart has just done (a test
  of the lesson forbids the words of the rule in them); a miss is answered by a fact (« its partner 4 was tried before
  it »), never by « wrong »; the student predicts before the world shows; what he found stays on screen in his words.
- **It starts from what he has just done**: the gap of the island he crossed, the question the stone asked. A question
  the student cannot answer yet OPENS the search — it is never asked as a quiz before the rule exists — and comes back as
  the last step of the forge (`use`).

**Every key of `qawasim-adad-tabii` opens on an experiment — four keys, four kinds** (owner, the same day: « not only
this one … all the steps of rule discovery »); a test of the lesson fails if two of its keys share a kind.

The eight kinds of `divisorIsles/` (logic `inquiry.js`; screens `Inquiry.jsx` — strip and chart —, `InquiryMoves.jsx`
— wall and saw —, `InquiryCombine.jsx` — join and stack — and `InquiryProof.jsx` — peel and letters; styles
`inquiry.css`; the four last ones were added on 2026-11-18 for `khawass-qawasim`):

| Kind | The rule it finds | What the student does |
|---|---|---|
| `turn` | a bridge that holds gives a second one (a = d × e, read both ways) | lifts the planks of HIS first bridge one by one into a WALL (one row per plank), then takes the wall down column by column: the same cells are the second bridge. Then he says what the columns will give BEFORE the wall is turned: a bridge that held, a bridge that fell (its wall is ragged — unequal columns, no plank), a square wall (the plank itself), and a bridge that is not drawn. Then he writes his rule with the tiles. |
| `cut` | the plank fills the gap when the count of planks is a natural number | on the gap no mould filled, his hand SLIDES the length of the plank: the planks are laid again at once, with the piece that would have to be sawn, and the count written as the quotient; the lengths he tried make a table. He says how many lengths need no cut (answered with the ones HE found). Then he judges planks from the quotient ALONE, before the saw lays them. Then he writes his rule with the tiles. |
| `pairs` | where the search for all the planks of a gap stops | tries the planks of ONE gap in order; a plank and its partner (gap ÷ plank, whole or not) walk toward each other on a strip and CROSS; past the crossing every partner is a plank already tried. First gap: after the crossing, « can a new plank still appear? » — on « maybe » the world tries every plank up to the gap in front of him. Next gaps: he says the last plank BEFORE trying; the squares join the table from the second gap; on the last gap only the planks and their squares are shown before any trial. Then he writes his rule with the tiles. |
| `chart` | what to read in a number instead of dividing | tests ONE plank on the gaps of a chart (a row per tens digit, a column per units digit), one after the other, then lets the world finish; chooses a LENS (units digit, tens digit, sum of the digits) and what he claims of it (its values, or the number it is divisible by): the chart shows the cells that are not green his claim takes in and counts the green cells it leaves out; a claim that holds is tried on the next hundred. Plank 4, which no single digit and no sum separates, is offered a fourth lens: the number the tens and the units write (`last2`) — on the first chart it is the gap itself, and the next hundred is where it is tried. |
| `join` | a common divisor of a and b divides a + b and a − b | sees two bridges with plank d (filled, or a piece left: a FACT, with `a = d × q + r` written under each); says BEFORE whether d will still fill the gap made by GLUING them (`sum`) or by cutting the shorter off the longer (`diff`); the world slides the second strip after the first (or over its end, and the cut part falls), lays the planks again and writes `a ± b = v` and `v = d × q + r`. A round where neither gap is filled and the glued one holds anyway (22 + 20 with 7) is shown, never hidden. What he found stays in a list. |
| `stack` | a divisor of a number divides every multiple of it | sees the gap `base` with plank d; for each k says BEFORE whether d fills k copies glued end to end; the copies travel from the gap into a row (2 and 3 drawn, up to 12 packed, more only as a number line with « k × base »), the planks are laid and the calculation written (`k × base = total`, `total = d × q + r`, and `k × (base ÷ d)` planks when d fills the gap). An optional second round has a gap the plank does NOT fill where some copies are filled anyway (14 on 21: two copies) — a fact, never a verdict. |
| `peel` | a common divisor of a and b divides the remainder of a ÷ b | presses once: the world lays planks of b on the gap a again and again (`a − b = …` written at each step, a sound per plank) down to the piece r < b, and writes `a = b × q + r`. For each plank of the round the table says whether it fills a and whether it fills b (with both divisions written); he says whether it fills the PIECE before the world lays it there. The table of every round stays. Then he BUILDS his claim from the table's columns — « if the plank [fills a] [and / or] [fills b], it fills the piece »: the table outlines the rows his claim takes in, in orange those whose plank does not fill the piece; the claim that takes in no such row (and at least one row) is his rule (`writes: true`). |
| `letters` | how to prove an « if … then … » for every number (a procedure) | checks the statement on numbers he is given (`a + b = d × □`, he presses □); the world changes the numbers and puts his last line against them (it does not carry over), then hides a number (nothing to compute). Then he assembles the proof from CARDS into numbered slots: a false card is answered by a sample where its numbers do not match (« with d = 3, a = 12, b = 6 this line gives 24, but a + b is 18 »), a card placed too early by what it uses that no line above has written (« this line needs k′ »). The proof he built is the rule (`writes: true`). |

**Spec shapes of `join`, `stack`, `peel`, `letters`** (the contract a lesson's `world/inquiries.js` writes against;
`T` = `spec.text`, the lesson's words; a `T.x(…)` is a function returning a string, which MAY hold `$…$` formulas
(MathText) unless marked « plain » — plain strings go into SVG text. No sentence may state the rule; a question never says
the fact it asks about — the screen passes it only what is already on screen). Every screen exposes its state on
`window.__inquiry` (dev) and carries `data-iq="<kind>"`, `data-iq-stage`, `data-iq-goal`, `data-iq-fact`, `data-iq-calc`,
`data-iq-next`, `data-iq-found`; the extra hooks are listed per kind.

```js
// join — logic: inquiry.js › joinOf(d, a, b, op) → { value, planksA, planksB, fillsA, fillsB, planks, rest, holds }
{ kind: 'join', d: 7,
  rounds: [{ op: 'sum' | 'diff', a, b, d? }],          // diff needs a ≥ b; `d` overrides spec.d for one round
  text: {
    lead: (d) => …,                                     // THE QUESTION, on screen all along
    goal: (d) => …,                                     // the goal, plain, in the 🎯 frame
    label: (n, d, { planks, rest }) => …,               // plain — under a strip: « 21 — 3 ألواح » / « … وبقيت 1 »
    ask: ({ op, a, b, d, fillsA, fillsB, planksA, planksB }) => …,   // the prediction (yes / no)
    seen: (f, guess) => …,                              // f = { op, a, b, d, ...joinOf }, after the planks are laid
    foundLine: (f) => …,                                // kept in the list (f has `guess`)
    yes, no, next, done,                                // button labels
  } }
// result: { rounds: [{ op, a, b, d, guess, holds }] }      hooks: data-iq-say="yes|no", data-iq-step, data-iq-op

// stack — logic: inquiry.js › stackOf(d, base, k) → { total, planks, rest, holds, fillsBase }
{ kind: 'stack', d: 7, base: 21, times: [2, 3, 10, 100],   // k ≤ 3 drawn, ≤ 12 packed, more: a number line only
  free?: { d: 14, base: 21, times: [2, 3] } | [ … ],       // more rounds after the first (a gap d does NOT fill)
  text: {
    lead: (d, base) => …, goal: (d) => …,                // question; goal (plain)
    label: (n, d, { planks, rest }) => …,               // plain, as in join
    ask: ({ d, base, k, fillsBase }) => …,
    seen: (f, guess) => …,                              // f = { d, base, k, ...stackOf }
    foundLine: (f) => …,
    yes, no, next, done,
  } }
// result: { rounds: [{ d, base, k, guess, holds }] }   (one entry per k of every round)
//                                                          hooks: data-iq-say, data-iq-k, data-iq-mode, data-iq-copy, data-iq-numline

// peel — logic: inquiry.js › peelOf(a, b) → { q, r, steps }, fitsRow(a, b, d) → { a, b, r } (booleans),
//        judgePeelClaim(rounds, claim) → { taken, intruders, orphans, ok }
{ kind: 'peel', writes: true,
  rounds: [{ a: 54, b: 21, candidates: [2, 3, 6, 7] }],  // a > b, r = a % b > 0
  text: {
    lead: (a, b, ri) => …,                              // before the peel: the question of the round
    goal: …,                                            // plain STRING
    peelBtn: (b) => …, peeling: (a, b) => …,            // the button that starts the world's peel; the lead while it runs
    piece: (r) => …,                                    // plain — over the piece left
    ask: ({ a, b, d, q, r, fitsA, fitsB }) => …,        // « does plank d fill the piece r? » (yes / no)
    shown: (row, guess) => …,                           // row = the same + fitsR
    cols: { plank, a, b, r },                           // the table's row labels (plain)
    yes, no, next, nextRound, toClaim,
    claimLead, claimIf, claimThen,                      // plain: the claim is « claimIf [colLabel.a] [link] [colLabel.b] claimThen »
    colLabel: { a, b }, link: { and, or },
    claimAsk,                                           // no column chosen yet
    claimFact: (judge) => …, claimOk: (judge) => …,     // judge = judgePeelClaim(spec.rounds, claim)
    seal,
  } }
// claim = { cols: [] | ['a'] | ['b'] | ['a', 'b'], link: 'and' | 'or' } — `link` counts only with two columns.
// A claim is REFUTED only by an intruder (a row it takes in whose plank does not fill the piece); `orphans` (rows that
// fill the piece without being taken) are facts, not refutations. Accepted: exactly { cols: ['a', 'b'], link: 'and' } —
// PROVIDED the rounds hold a plank of a alone, a plank of b alone (each not filling the piece) and a plank of both:
// the lesson's test must enumerate the five claims and find exactly one ok (see divisorIsles/inquiry2.test.js).
// result: { rounds: [{ a, b, q, r, rows: [{ d, fitsA, fitsB, fitsR, guess }] }], claim }
//         hooks: data-iq-peel, data-iq-say, data-iq-ptable, data-iq-row="a:b:d", data-iq-r, data-iq-claim,
//                data-iq-col="a|b", data-iq-link="and|or", data-iq-seal, data-iq-ok

// letters — logic: inquiry.js › checkProofOrder(cards, ids, given) → { ok, at, missing },
//           refuteCard(card, samples) → the first sample where card.holdsOn(sample) is false, or null
{ kind: 'letters', writes: true,
  statement: { given: ['$d \\mid a$', …], goal: '$d \\mid a + b$', gives: ['d|a', 'd|b'] },  // MathText strings; `gives` = tokens
  numbers: { value: (v) => v.a + v.b, by: (v) => v.d, max?: 20 },   // stage 1: he presses □ with by(v) × □ = value(v)
  samples: [{ d: 7, a: 21, b: 35 }, { d: 3, a: 12, b: 6 }, { d: 5, a: 40, b: 15, hide: 'b' }],   // stage 1 in order;
                                                      // `hide` = the letter shown as « ? » (no □ asked)
  show?: ['d', 'a', 'b'],                             // the letters printed (default: the keys of samples[0])
  cards: [{ id, tex,                                  // tex: a MathText string (Arabic words and $…$)
            ok: boolean,
            needs?: [tokens], gives?: [tokens],       // what the line uses / introduces (« k », « k′ », « d(k+k′) »)
            holdsOn: (sample) => boolean,             // is the line TRUE for these numbers?
            why?: (sample) => …,                      // REQUIRED when ok: false — the numeric fact for the sample the world picked
          }],
  order: [ids],                                       // ONE valid order of exactly the ok cards (any order whose `needs` are met is accepted)
  text: {
    lead, goal,                                       // strings (goal plain)
    numbersAsk: (v) => …, numbersOk: (v, q) => …, numbersMiss: (v, q) => …,
    carry: (v, before, q) => …,                       // his last line (on `before`) put against the new numbers v
    hidden: (v, before, q) => …,                      // the sample with a letter hidden (before/q null if no line yet)
    line: (v, q) => …,                                // his calculation, kept in the list
    nextSample, toCards,
    cardsLead, cardsAsk, givenLabel, goalLabel,       // stage 2 (givenLabel / goalLabel plain)
    needs: (card, missing) => …,                      // a card placed too early: what it uses that no line above wrote
    placed?: (card) => …, proved, done,
  } }
// result: { order: [ids as placed], tries: number of refused placements, refuted: [ids of false cards he tried] }
//         hooks: data-iq-sample, data-iq-values, data-iq-q=<n>, data-iq-sheet, data-iq-slot=<i>, data-iq-card-in,
//                data-iq-deck, data-iq-card=<id>, data-iq-said="false|early|ok", data-iq-done
```

The lesson's own test must check that every `ok` card `holdsOn` every sample, that every false card is refuted by one
(`refuteCard(...) !== null`), that `checkProofOrder(cards, order, statement.gives).ok`, and that `order` holds exactly
the ok cards. World sounds: join — `sweep` (the strips move), `plank` / `hit` (laid again / cut), `success` / `crumble`;
stack — `plank` per copy (`sweep` when packed), then `success` / `crumble`; peel — `plank` per plank laid, `gate` when the
piece is left; letters — `key`, `fail`, `crumble`, `paper`, `success` on the student's own moves.

**An experiment opens on its QUESTION and its GOAL, and each try shows its calculation** (owner, 2026-11-17: « the
student must be given the goal … each one we see the rest of the division: x = c × 2 + d, and if d = 0 the cell becomes
green »). On the chart, while he tests, three lines in the owner's words: the question (`text.lead(b)` — « ما هي الهوّات
التي يمكن تشكيل جسر لها باستخدام لوح طوله 5؟ »), the goal in its own frame (`text.goal(b)` — « الهدف: معرفة تلك الهوّات
فقط من شكلها، دون تقسيم طولها في كلّ مرّة على العدد 5. ») and what to do now (`text.how`). They say WHAT is looked for, never what the
reading is (a test of the lesson forbids the words of the readings in them). Every gap he tries writes ITS division
`n = q × b + r` (the last four stay, the newest large; the newest only on a phone) with « الباقي r » beside it; the cell turns
**green** exactly when r = 0 — green means « rest 0 » everywhere on the chart, and a cell his lens takes in is outlined
in cyan. A new kind opens the same way: the question, then the goal, in one sentence each, on screen while he acts.
His CLAIM is laid as an Arabic sentence, RIGHT TO LEFT (owner, the same day: « numbers in the left side and the arabic
choices in the right, rtl »): the three lenses in a column on the right, the plank's LINK in the middle, then the numbers
he presses on the left, in columns read downwards (five to a column, three on a phone). A plank says its claim in
one of two ways (`link` on the plank; words `text.link`; logic `inquiry.js › claimValues`): **`equals`** — « رقم الآحاد ·
يساوي · 0 أو 5 », he gathers the VALUES of the lens (planks 5 and 2); **`divides`** — « مجموع الأرقام · يقبل القسمة على ·
9 », he presses ONE number among `divisors` (2…9) and the claim takes every gap whose lens shows a number divisible by it
(planks 9, 3 and 4 — owner: « use يساوي for 5 and 2, for others use يقبل القسمة على »). Said that way a reading holds on
every hundred (a sum of 27 is taken too), where a list of values would not. A test of the lesson requires that exactly
one lens with one number holds for each of them: the sum of the digits for 9 and for 3, and for 4 the lens the owner
named — « العدد المكوّن من الآحاد والعشرات » (`last2`), offered to plank 4 only. Plank 4's former side road (« no lens
separates this chart », the same cells in every hundred, long gaps placed on the one chart) was removed with it: with
that lens the sentence « no lens separates » would be false.

**What the world does alone is HEARD** (owner, 2026-11-17: « add sound effect when completing the numbers here »): while
the chart is filled by the world (« أكمل الجدول », then the next hundreds) each step plays `sweep` (a count that climbs),
`spark` when a cell lights in that step (`inquiry.js › lightsIn` — a plank's own rhythm, a fact, never a verdict) and
`gate` when the chart is full. The sounds are synthesised in `engine/audio.js` (`play(name, p)`, no sound file). An
animation of a new kind that the student only watches gets its sound the same way.

**To add a kind**: its pure logic in the world's `inquiry.js` (tested apart: the experiment is true for every number it
may show), its screen in `Inquiry.jsx`, its words in the lesson. **To use one**: the lesson's `world/inquiries.js` and
`inquiry` + `fromInquiry` on its forge (`qawasim-adad-tabii` is the reference). Before writing a forge, ask what the
NATURE of its rule is: one condition on a case → the mirror alone; anything else → an experiment first.

**Lesson 3 (`khawass-qawasim`) uses the four new kinds, one per key** — `jam-wal-farq` on `join`, `madaaf` on `stack`,
`baqi-qisma` on `peel` (`writes`), `burhan` on `letters` (`writes`); its `world/inquiries.test.js` fails if two keys share a
kind. Two things the walk of that lesson taught, now rules of the kit: (1) a judged row of `judgePeelClaim` keeps its
columns as booleans (`a`, `b`, `r`) and names its round by `gap` and `bridge` — a screen matches a row by those, never by
`a`/`b`; (2) the statement block of `letters` puts every piece of `MathText` in its own `<span>`, or a grid lays one token
per row. The exam sheet of « تدرّب » (`kit/Trainer.jsx › Marked`) prints a prompt as plain text with its numbers
underlined; a prompt that contains `$…$` is rendered through `MathText` instead, so a formula in a prompt is allowed.
`rf-says`, the labels of `RuleForge` and a tablet's `notes` stay plain text: no `$` in them.

**Checked**: `divisorIsles/inquiry.test.js` and `inquiry2.test.js` (join, stack, peel, letters: every fact true for every
number a lesson may show; exactly one peel claim holds), `inquiryScreens.render.test.jsx` (the four new screens open on
their question, goal and first act), the lesson's `world/inquiries.test.js`, and the lesson's walk, which plays
both experiments through their screens (a wrong pick, a wrong lens, the right claim, the next hundred) and, at each
screenshot, that nothing leaves the frame, no button is covered, nothing scrolls and no text is under 12 px.

## 3. Files

Since 2026-11-17 the code is in THREE places (Phase 0 of the lesson v2 rollout, kit extraction — in progress, see the
state line under the tables):

1. **the kit** `apps/web/src/lessons/common/gameworld/kit/` — lesson-independent; it names no lesson and imports none
   (`kit.test.js` drives it with a toy lesson and reads its files for the boundary);
2. **the lesson's content** `<lesson folder>/world/` — the pilot's is
   `lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/qasim-adad-tabii/world/`;
3. **the world** `gameworld/divisorIsles/` — the three.js scene and its mechanic, and, until the next sub-steps move
   them, the React screens.

**The kit** (`gameworld/kit/`)

| File | What it is | What the lesson gives it |
|---|---|---|
| `random.js` | `rng(seed)`, `int`, `pick`, `shuffle`: everything generated takes a `rand`, so the tests replay it | — |
| `ladder.js` | the practice ladder: fair waves, runs, what is open, the next level, the stars; `buildWave` for generators | `createLadder({ nodes, generators, isRight })` |
| `trainer.js` | « تدرّب »: six questions, game, game, exam, game, exam, exam; the stars of a session | `createTrainer({ kinds, plans, planOf, fallback })` |
| `sitting.js` | « الامتحان الأبيض »: a subject from a level, weak kinds first, the two shapes of an answer, the stars | `createSittings({ levels, build, mark })` |
| `journey.js` | the road: when the exam space opens, a promotion, « تقدّمي », the ONE next step | `createJourney({ keys, ladder, levels, stages, cards })` |
| `evidence.js` | which answers count (first try, no help), the id of the الكفاءة, the payload sent | `createEvidence({ grade, points })` |
| `evidenceSend.js` | the POST to `/lessons/{code}/game-evidence` and the retry queue (§4) | — |
| `tips.js` (+ test) | « حيلة »: the calculation shortcuts, given only when one clearly helps | — |
| `longDivision.js` (+ test) | the long division as it is written and said on paper, its twin (used by `Paper.jsx` and by « مختبري ») | — |
| `LessonContext.jsx` | `<LessonProvider lesson={…}>` and `useLesson()`: the ONE way a screen of the kit reaches the lesson | the pack (below) |
| `text.js` | `TX` (spaces, « تقدّمي », a case, the knowledge page) and `KT` (the shell: title screen, HUD, hub, a run, a tablet, the end): the kit's chrome. No sentence of a lesson or of a world | — |
| `Fit.jsx` | the box of every panel: it never scrolls, it fits (§2ter) | — |
| `Paper.jsx` | the paper mode: the gate, the sign, the long-division model sheet | — |
| `Spaces.jsx` | `ExamLadder`, `Promotion`, `ProgressPage` (« تقدّمي ») | `journey`, `sittings`, `rules`, `cards`, `evidence` |
| `ExamSitting.jsx`, `examSitting.css` | the screen of « الامتحان الأبيض » (§2quater) | `sittings` (with `mark`, `model`, `scheme`, `evidenceOf`), `rules` |
| `Trainer.jsx` | the screen of « تدرّب »: it draws a tap, a true / false, or a FORM the lesson describes | `trainer` |
| `KnowledgePage.jsx` | the full-page « خريطة المعارف » | `knowledge`: `{ graph, modules, positions }` |
| `LessonWorld.jsx` | **the shell**: the canvas, the top bar, the controls, the overlay switch; it mounts `<LessonProvider>` and creates the world's game | `world` (below) and the pack |
| `Title.jsx`, `PracticeHub.jsx`, `Tablet.jsx`, `Result.jsx`, `End.jsx` | the title screen, the practice hub (the lesson's mind map as a level select), a rule tablet, the result of a level, the end | `ladder`, `journey`, `rules`, `keys`, `text`, `practiceMap` |
| `claims.js` (+ test) | the kinds of claim a game answer can make and `verifyClaim` — the browser's copy of the server's `ClaimVerifier` (one fixture) | — |
| `forge.js`, `RuleForge.jsx`, `ruleForge.css` | « مصهر القاعدة »: the frame of a rule forge (pure) and its screen — predict, write the rule with tiles, the mirror tests and attacks it, seal, use (§2sexies) | `forges` (one description per key) and the world's `parts` |
| `parts.jsx` | a formula, the toast, the robot's bubble, the touch stick, a card over the world, three stars, a box for a number | — |
| `styles/` | eleven style sheets, one per screen (`world`, `practice`, `knowledge`, `cases`, `trainer`, `paper`, `steps`, `knowledgeJourney`, `fit`, `spaces`, `phone`), imported by `styles/index.js` **in the order of the cascade** — `fit.css` and `phone.css` override the others, so a new sheet takes its place in that list and is never imported from a screen. Classes `di-…` | — |
| `saveSync.js` (+ test) | the browser's copy of the save (`readSave`, `writeSave`) and its copy on the server: `pullSave` before the world mounts, `schedulePush` after a save (`LESSON_V2.md` §1ter) | — |
| `../LessonGameWorld.jsx`, `../lessonGameWorld.css` | the LOADER of a lesson's world: the world chunk, the lesson's content and the server's save arrive together behind a loading screen; its `WORLDS` map lists the worlds (one entry per world) | the pack's `world` |
| `WorldRuntime.js` | **the world runtime**: the three.js scene, the loop, the robot and its movement, the camera, the sky, the things to use, the gems, the state React reads, the hub, the knowledge page's state, the exam ladder, the paper mode, the evidence tally, the save | the pack as `lesson`; a WORLD extends it (below) |

**The pilot's content** (`…/qasim-adad-tabii/world/`, each with its test)

| File | What it holds |
|---|---|
| `practice.js` | the kinds of wave of the lesson, `isRight`, the five nodes and sixteen levels; exports the bound `ladder` and `PRACTICE_MAP` (where each node sits on the hub, its links) |
| `trainer.js` | the kinds of question, the plan of each card, `check` (hint, then correction), `solution`, `answerLabel`, `PHRASES` |
| `sitting.js` | the four exercises by tier, the five levels, `mark`, `model`, `scheme`, `evidenceOf` |
| `forges.js` | the four forges of the lesson, one per key (§2sexies) |
| `journey.js` | the four keys, bound to the ladder and the levels |
| `evidence.js` | the الكفاءة of each key and the CLAIM each kind of answer makes (their verdict is the kit's `claims.js`) |
| `knowledge.js` | the lesson's graph and memo sheets (imported from the lesson, never retyped) and where each card sits on the map |
| `text.js` | the names of its levels and of its real-world worlds |
| `index.js` | **the pack**: `lesson = { keys, keysFromModules, rules, ladder, practiceMap, sittings, trainer, journey, evidence, cards, knowledge, text }` |

**The world** (`gameworld/divisorIsles/`)

| File | Role |
|---|---|
| `logic.js` (+ test) | PURE: Euclidean division, prediction options, stars, the islands and segments data, dash waves, world layout |
| `Game.js` | **the mechanic** — `DivisorIslesGame extends WorldRuntime`: islands, gaps, moulds, forge, storm, statues, last bridge, the gate dash and the real-world cases; it reads the lesson as `this.lesson` and imports no lesson |
| `DivisorIsles.jsx` | what THIS world adds to the shell: the equation and the verdict of a forge, the HUD of a run and of a case, its own overlays (prediction, stone, statues, workshop, last bridge, guidance); it defines `WORLD` and renders `<LessonWorld world={WORLD} lesson={…}>` — the ONE place of the world that names the lesson |
| `cases.js` (+ test) | PURE: the orders of « تعاونية الواحة », their steps, `judge` and its explanations |
| `Depot.js`, `Worlds.js` | the 3D worlds of the cases: the depot, the friends' table, the tiler's site; `runSim` shows what was decided |
| `ruleForge.js` (+ test), `forgeParts.jsx` | the rule forge IN THIS WORLD: a bridge as a case, the evidence of a crossing, the law of the world as a forge (`remainderForge`), and how a case is drawn (§2sexies) |
| `strings.js` | every Arabic sentence, the sentence of a practice wave (`waveSay`) and the guidance after a mistake (`explain`) |
| `../engine/builders.js`, `robot.js`, `audio.js`, `input.js` | reusable: low-poly builders, the robot, synthesised sound, keyboard + touch input |
| `../../lessonlab/` | « مختبري », the lab of every lesson — its own contract: `LESSON_LAB.md` |

**A world is a class that extends the runtime.** `kit/WorldRuntime.js` reaches a world ONLY through these hooks; a
new world implements them and nothing else of the runtime:

| Hook | What the world answers |
|---|---|
| `initWorld(save)`, `worldState(save)`, `worldSave()` | its own fields, its keys of the state React reads, its part of the save |
| `worldCentre()`, `buildWorld(rand)`, `spawnPoint()`, `restore()` | where the sea of clouds is centred, the scene, where the robot starts, the world as the save left it |
| `walkable(x, z)`, `onGround()`, `respawnPoint()`, `onFall()` | is there ground here, what standing there triggers (an arrival), where a fall brings back and what it says |
| `onStart()` | the story begins or resumes |
| `stepPhase(phase, dt)`, `lanesLive(phase)`, `stepWorld(dt, phase)`, `robotPose(phase)` | a phase of its own (a run on a rail), its animations, how the robot holds itself |
| `heading()`, `cameraShot(phase)`, `followsHero(phase)`, `fov()`, `skyTarget()` | the camera when it does not follow the robot, and the sky |
| `busy()`, `pausesWorld(page)` | may the hub open now; does this full-screen page hide the world |

The runtime gives a world: `this.scene`, `this.hero`, `this.robot`, `this.input`, `this.audio`, `this.particles`,
`tween` / `wait`, `addInteract`, `addGem`, `set` / `say` / `toast`, `this.cine` (a cinematic shot), `this.shake`,
`this.flags`, `save()`, and the lesson's data as `this.lesson`.

**What a world gives the shell** (`kit/LessonWorld.jsx` lists every field): `id`, `Game`, `stages`, `maxStars`, `text`
(its title, its story, its end), `Hud` (the middle of the screen while playing), `Under` / `Over` (its layers below
and above the kit's overlays), `overlay(o, s, game)` and `guide(o, s, game)` (its own overlays by `o.type`), and five
small answers about the state: `playing`, `busy`, `quiet`, `paperOn`, `held`.

**State of the extraction (2026-11-17).** Done: the pure logic (the six frames), the world runtime, the shell and
eleven screens. What is NOT extracted, and why:
- **the gate dash and the real-world cases** are generic ideas still written INSIDE the pilot's world — `Game.js` (they
  use its rail and its three case scenes) and, on screen, `DashHud`, `DepotHud`, `Guide`, `CaseGuide` in
  `DivisorIsles.jsx`: another world would have to write them again;
- **`cases.js` and `strings.js`** still mix kit and lesson; the lesson's content still reads `logic.js`, `strings.js`
  and `ruleForge.js` of the world (the forge itself is in the kit since 2026-11-17: §2sexies);
- **the CSS** is split by SCREEN (`kit/styles/`, 2026-11-17), not yet by OWNER: `styles/cases.css` and parts of
  `styles/world.css` (the dash, the question stone, the store of the last bridge) are the pilot's world, and every
  class is still named `di-…`. Moving them to the world would change the cascade (the later sheets override them):
  it is done when a second world exists to prove what is shared;
- **the story is the lesson's since 2026-11-17** (`lesson.story`, the pilot's `world/story.js`): its islands and gaps
  (an island may `keepMould` and hold a `feature`: `guardians`, `anvil`, `stone`; a segment may be the `boss`, have a
  `workshop` or a `storm`, and names the plank it `holdsWith`), the guardians' fact, the waves of the dash, its own
  words (`text`, laid over the world's) and what happens on the way — `onArrive`, `afterKey`, `pendingForge`, `onHold`,
  `objective`, `onStatues`, `onStone`, `onQuiz`, `onBossPaid`: functions that receive the game and use its commands.
  `Game.js` names no island by its number and no key any more. STILL the pilot's inside the world: its story DATA
  (`logic.js › ISLANDS, SEGMENTS, DASH_WAVES, STATUES`) and its story WORDS (`strings.js`: the robot's sentences, the
  stone's question, the store, the tablets) — a second lesson gives its own and overrides them;
- ~~the title screen still links to the classic mission player (`classicHref`)~~ — gone 2026-11-18 with the old version
  of the three v2 lessons (decision D3).
A lesson declares its content in ONE `lesson.pack.js` (`LESSON_V2.md` §1, 2026-11-17); what its world is played with is
`world/index.js`, named there (`world.content`). The world receives it as the `lesson` prop.

**The shape of an exam answer is DATA.** The kit draws what the lesson describes, and never knows its mathematics:
- a sitting question is `sentence` (words around ONE `{ choice: [{ value, text }] }`) or `tokens` (signs around boxes
  made with `slot`) — `kit/sitting.js`;
- a trainer question is a `tap` (`options`), a true / false (`statement`, `truth`, `reasons?`), or a `form` — lines of
  tokens: a string, `{ strong }`, `{ text, rtl? }`, `{ num, label }`, `{ choice, options }` — `kit/trainer.js`.
The lesson keeps how an answer is judged (`check`, `mark`), its model copy and its claims.

**Rules of the kit.** A frame is a `create…(lesson data)` function, or a pure helper; a screen reads the lesson with
`useLesson()`; neither ever imports a lesson, a world or a string table of one (`kit.test.js` reads every file of the
kit for it). What is mathematics — when a gate is right, how an answer is marked, what a claim
proves — stays with the lesson. New generated content takes `rand` and is tested with `rng(seed)`.

Everything is drawn in code (no model, no image, no sound file); Arabic in the scene is canvas text. No person is drawn.

## 4. State, progress and « الكفاءات »

- The game saves in the browser (`scopedStorage`, key `smarter_world_<lessonId>`, never waiting for the network): stage, stars, gems, keys, flags, the
  practice (`practice`, `keysEver`), the knowledge page (`know: { read, sealed, trained, found }`), the exam ladder
  (`exam: { best, fails, weak, sittings }`), per key the first tries done as in an exam (`tally: { ok, n }`), the bridges fired
  (`log`, the evidence of the rule forge) and the rules the student forged (`rules`, §2sexies).
- **The journey follows the student from one device to the next** (2026-11-17, `kit/saveSync.js`; `LESSON_V2.md` §1ter): a
  copy of the save is kept on the server in his private answers store; the newest whole save wins. The world opens on
  a loading screen (`LessonGameWorld.jsx`) that brings the server's copy when it is newer, then mounts.
- It marks lesson modules complete through `useProgress.markModuleCompleted`: module 1 after tablet 1 (that is, after the rule forge), module 2 after tablet 4,
  module 3 after the dash, module 4 after the last bridge. Modules 0, 5, 6 and 7 are not played in the world.

### Which game answers count toward « الكفاءات » (owner decision, 2026-11-15)

Until that day the game wrote no learning evidence; it now does, on strict terms (`evidence.js`, `evidenceSend.js`):

- **What counts**: an answer that looks like an exam answer — WRITTEN format, FIRST try, in paper mode, with no help opened before
  it (no rule reminder, no model sheet). That is: the exam-format questions of « تدرّب » (`division`, `show`, `complete`, `two`) and
  the division steps of the real cases (`STEP_KEY`). The first try is sent right OR wrong.
- **What never counts**: the gate dash, the story, a game-format question, a second try, an invoice or a sum, and « صحيح أم خطأ؟ علّل »
  (its verdict cannot be re-computed from numbers).
- **The server is the judge**: the browser sends a CLAIM — the numbers of the question and what the student wrote — to
  `POST /lessons/{code}/game-evidence` (`GameEvidenceController`); `ClaimVerifier` re-computes the verdict and ignores any flag
  from the browser. The JS `verifyClaim()` (`kit/claims.js`) and the PHP verifier share ONE fixture (`apps/api/tests/Fixtures/game-claims.json`);
  a claim kind belongs to no lesson, and adding one is the same three edits on both sides (`LESSON_V2.md` §1bis).
- **The learning point**: each question carries its key; the four keys map onto the lesson's P1–P4 (`learningPointOf`).
- **The weight**: a practice evidence judged by the server, difficulty 2 (trainer) or 3 (case). The same division asked twice is
  the same item (`ClaimVerifier::itemId`). A game alone never declares a point mastered: `mastery.require_assessment` still asks
  for « إختبار أولي » (tested: twelve right cases leave the point below « mastered »).
- **Offline**: what could not be sent is kept per student and retried when the game opens or the connection returns (idempotent
  by `attemptId`); a refused payload is dropped.

## 5. Check

`node apps/web/e2e/gameworld-divisor-isles.mjs [outDir]` (dev server up) plays the whole game as a simulated student — every bridge,
the storm, the guardians, the dash, the workshop, the last bridge, the ending — then checks that a reload offers the save, that
a module address and `?view=classic` both land on the world (the old version is deleted) and that a TEACHER never gets
the world. It fails on a missed stage or a page error.
`node apps/web/e2e/gameworld-field.mjs [outDir]` plays every mission of the depot (wrong crate packed and explained, the classic
truck mistake, a lost day) and reads the knowledge page card by card (13 cards, a mistake uncovered, a rule sealed, the locks of a
student without keys, full page without scrolling) and trains on five cards without leaving the page (the order of the formats,
a hint then the correction, the exam sheet without scrolling).
`node apps/web/e2e/gameworld-practice.mjs [outDir]` plays the practice game: the map locked then open, a run with a deliberate
mistake (guidance, rule, the question that comes back), a won and a lost level, the exam node, the save, « من البداية », and a
device without a game save. Unit tests: `npx vitest run src/lessons/common/gameworld` in `apps/web` (every generated wave has
exactly one right gate; every wrong gate has its guidance).

Two behaviours a change must keep: a slow machine drops the retina resolution, then the shadows (`adaptQuality`); a tree standing
between the camera and the robot ducks down, and a sign too close to the lens hides (`occluders`, `signs`).

## 6. Known limits

- Verified in headless Chromium (software rendering) at 1366×768, and the first stage at 1024×768. **Not yet played by a real
  student, nor on a real tablet or a real GPU**: speed, the touch stick and the sound were not judged by a human ear or hand.
- Strings live in `strings.js`, not in the i18n namespace; the lab kit (`LabCoach`, rounds, memo card) is not used.
- Two devices played at the same time do not merge: the newest whole save wins (the device's clock).
- **Other screen sizes (2026-11-17, Chromium emulation — not a real tablet, not a real phone).** The pilot's eight walks
  pass at 1366×768, 1024×768 and 1840×900 (92 + 30 + 102 + 45 + 56 + 47 + 59 + 102 checks each), and the six student
  walks pass on a phone held sideways (touch, 800×370: 92 + 30 + 102 + 45 + 55 + 33). What was repaired to get there:
  - the knowledge page at 1024×768 and 1840×900: the world is no longer drawn behind an opaque page
    (`WorldRuntime › pausesWorld`), a card of the map keeps its width, the legend sits in the free corner, the whole map
    is scaled while the side panel is on « تدرّب »;
  - the header of the teacher's tools at 1024×768 (tab icons hidden between 768 and 1100 px);
  - on a phone: see « On a phone » below.
  The phone walks check the PHONE rules, not the laptop ones: text floors are lower (root font 13 px), and the boxes
  named there may slide inside themselves. **Still not judged by a human on a real device**: touch comfort, the stick,
  the sound, a notch, a browser bar that hides and shows.

## On a phone (TRIAL, owner 2026-11-16 — pilot lesson only; **PAUSED 2026-11-18**: both packs say `phone: false`, nothing new is built or walked for phones until the owner resumes it)

**What opens.** Lessons are closed on phones (`RequireLargeScreen`). For a lesson listed in
`components/auth/phoneLessons.js › PHONE_LESSONS` a phone opens exactly (owner: « allow only the pages that are designed
for mobile; for the others display the message »):

- the lesson's HOME — the student's game world, the teacher's card;
- for the teacher, **« المذكّرة الكاملة » and « ملفّ الدرس »** (to read and to note, anywhere) and « جرّب الدرس كتلميذ ».

Everything else keeps the message « محتوى الدروس يظهر فقط في شاشة الحاسوب »: « حصّة القسم », the bank, the tracking, the knowledge card. **On the teacher's card and in the common
header those tools are shown closed — a dashed line and the badge « على الحاسوب » — never a link that leads to the
message** (`Door › closed`, `PHONE_TOOL_IDS`). A lesson enters the list when these pages have been looked at on a phone.

**The teacher's pages on a phone.**

- **The card** (upright): the lesson's name, the tools on one line that slides, the open doors first.
- **The memo** (`memo.css`, print untouched): one column, no zoom, its parts on ONE line that slides — the part in use is
  brought into sight — and every grid a list. Upright the step bar « السابق / التالي » stays at the thumb; sideways it is
  not pinned and the header is one line without the closed tools.
- **The lesson file is opened SIDEWAYS** (owner): a whiteboard needs the width. Upright, a touch phone shows « أدِر هاتفك »
  under the header; sideways the whiteboard is the whole screen — over the teacher space's bars (`data-workspace-bar`),
  without the common header; its own arrow goes back to the lesson. A laptop always opens the file, however narrow its
  window: the turn screen asks for a touch screen.
- **« أدِر هاتفك » is ONE component**, `components/common/TurnPhone.jsx` (`cover`: the whole screen for the game, the
  place of the page for the lesson file). Never write a second one.
- **Checking a phone with Playwright**: never judge a sideways phone on a full-page screenshot — the capture makes the
  page taller than 500 px and switches the phone rules off. Capture the visible screen.

**The rules of a phone held sideways** (`gameworld/engine/phoneScreen.js`; `SHORT_SCREEN` = at most 500 px high):

1. **One scale.** Every size of the game is in `rem`; the root font size becomes `COMPACT_ROOT_PX` (13) while the game
   is mounted. 11 was tried first and was too small on the owner's phone: « font size must be always readable ».
2. **Never two scales.** A page that zooms itself to the window (launch kit, « مختبري ») does NOT zoom on a short screen
   (`isShortScreen()`): the two scales together gave 6 px text.
3. **Readable beats unscrolled.** `Fit` never scales below `PHONE_FLOOR` (0.9); the box scrolls inside itself
   (`data-di-fit-scroll`), like the forge's list and panel (which no longer zooms itself on a phone), the launch kit's stage and the lab's panels. The page itself and
   the sideways direction never scroll. This is the ONE exception to « nothing scrolls »; tablets and laptops are unchanged.
4. **The middle of the screen is the world.** The equation and the verdict go to the corner under the island's name, the
   robot's sentence to the bottom between the stick and the buttons: in the middle they covered the bridge the student
   had just built. The teacher's preview notice is a small pill under the corner buttons.
5. **The instrument gets the room** in « مختبري »: its quests are one line that slides.
6. The page's background is the game's night colour: a phone shows it beside its camera cut-out.

**Upright**: « أدِر هاتفك » (`TurnPhone`) covers the game until the phone is turned. The teacher's card is responsive
upright: the lesson's name, then the tools on one line that slides.

**What each screen does on a phone held sideways** (2026-11-17; `kit/styles/phone.css`, the phone blocks of
`launchKit.css` and `lessonLab.css`):

- **the practice hub**: two columns — the map, compact, beside the levels;
- **a card over the world** (a case's step, a result, a tablet): it uses the width; when it is still too tall at the
  smallest readable scale, the box INSIDE the card slides (`Fit › data-di-fit-scroll`) — the card never cuts a line;
- **« خريطة المعارف »**: the trail of the journey is ONE line that slides sideways (`data-di-slides`, the only box that
  does), the card being read is brought into sight;
  on the full map, the steps of « تدرّب » stand aside;
- **« تقدّمي »**: the road is a thin strip, the gauge is small, one line per row;
- **« الامتحان الأبيض »**: the statement is 14 px at least (17 on a laptop); the sheet slides inside its box;
- **« عُدّة الانطلاق »**: the bag is compact (no sub-lines), a capsule's body slides inside itself; « الدرس كاملًا » of an
  earlier lesson is a link ONLY when that lesson opens on a phone — otherwise the line « الدرس كاملًا: على الحاسوب »
  (`data-lk-lesson-computer`), never a link to the closed message;
- **« مختبري »**: 12 px is the floor of a label, the quests are one line that slides, the instrument's drawing
  (`.ll-draw`) slides inside itself; the lab of a lesson that does not open on a phone is closed with it.

**Walks.** Every game walk takes `E2E_TOUCH=1 E2E_SIZE=800x370`; `launch-kit.mjs` and `lesson-lab.mjs` also take
`E2E_SOFT=1` (a failed check is printed and the walk goes on, to look at every screen). A walk knows it is on a phone
(`PHONE` = touch and at most 500 px high) and then checks the phone rules: the floors above, the boxes that may slide
inside, and — where the laptop walk goes to a page a phone closes (`?view=classic`, another lesson) — the closed
message instead. State on 2026-11-17, Chromium emulation: the six student walks pass (story 92 checks, practice 30,
cases and knowledge page 102, exam sitting 45, launch kit 55, « مختبري » 33). The story used to stop at island H: two
of the game's delays ran on the real clock while the walk fast-forwards the game's clock — they are on the game's clock
now (`this.wait`). Not walked on a phone: « إختبار أولي » and the classic player (closed there), the teacher's class
session (closed there).