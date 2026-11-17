# GAME_WORLD — the lesson played as a 3D game world (trial, 2026-11-15)

**Status: TRIAL on ONE lesson (`qasim-adad-tabii`), student view only. Not validated by the owner, not a rollout rule.**
The owner asked for a free experiment « without limiting it with the docs or what is already built »: this document describes
what the code does today, so the trial can be judged, extended or removed. Nothing here binds another lesson.

## 1. What it is

A student who opens the lesson enters **« أرخبيل القواسم »**: a chain of nine floating islands in a three.js scene, played in a
full window with a small hovering robot, « زيرو ». The teacher and Classroom Mode see no change.

- Switch: `gameWorld: 'divisor-isles'` in the lesson's `LESSON_CONFIG`, beside `studentView: 'mission'`. Removing the key ends the trial.
- Mount: `LessonIndex.jsx` renders the world instead of `MissionHome` when the mission view is on (student, not Classroom Mode).
  The chunk is lazy (`GAME_WORLDS` map) — three.js never enters the entry bundle.
- **The mission player is not deleted.** `?view=classic` on the lesson URL opens it (a link on the title screen), and the module
  routes (`/astaidd`, `/itqan`, …) still play there. A device without WebGL gets a message and that link.

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
| 48 | mould 6 lays 8 planks; a storm takes the bridge; among 5, 7, 8, 9 one fills 48 « without any division » → tablet 🗝️ « القاسم بالجداء » | P2 |
| 120 | moulds 6, 9, 20 | P1, P2 |
| the four guardians | one fact (120 = 6 × 20), four sentences to put the right way round → tablet 🗣️ | P3 |
| gate dash | eight sentences in the four phrasings, three gates, one right | P3 |
| 7 | nothing on the pedestals fills it; the workshop makes any length 1–9; then « which two moulds always fit 143? » → tablet ⭐ | P4 |
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

## 2sexies. « مصهر القاعدة » — the rule forge of island « المرايا » (2026-11-18, NOT validated)

Owner, 2026-11-18: the method says the student discovers, touches, observes « until concluding the maths rule » — « how are we
giving him the chance to do that? »; the earlier answer (a space where he writes the rule after the manipulation) cannot tell
him whether his rule is right, and « it must be integrated in the game of the lesson, inside, not as a separate lab or game ».

On island D the game used to ask one multiple-choice question, then a tablet TOLD the rule. Now **the student defends his rule,
and the island's mirror judges it with bridges** (`RuleForge.jsx`, logic `ruleForge.js`, overlay `{ type: 'forge' }`):

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
- Only the FIRST of the four tablets is forged (island D). The three others are still told.
- Check: `ruleForge.test.js` (8 tests: exactly one of the sixteen rules agrees with every bridge; every false rule is
  contradicted by the story's crossing or by an attack; the evidence, the predictions, the nudges). The story walk
  `gameworld-divisor-isles.mjs` crosses island D through the forge: a missed prediction, three right, a false rule refuted by
  his first bridge, a nudge, the right rule, two attacks, his words, the long gap, the tablet with his rule.

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

**The pilot's content** (`…/qasim-adad-tabii/world/`, each with its test)

| File | What it holds |
|---|---|
| `practice.js` | the kinds of wave of the lesson, `isRight`, the five nodes and sixteen levels; exports the bound `ladder` |
| `trainer.js` | the kinds of question, the plan of each card, `check` (hint, then correction), `solution`, `answerLabel`, `PHRASES` |
| `sitting.js` | the four exercises by tier, the five levels, `mark`, `model`, `scheme`, `evidenceOf` |
| `journey.js` | the four keys, bound to the ladder and the levels |
| `evidence.js` | the الكفاءة of each key, the claims, `verify` (the same rule as the server) |

**The world** (`gameworld/divisorIsles/`)

| File | Role |
|---|---|
| `logic.js` (+ test) | PURE: Euclidean division, prediction options, stars, the islands and segments data, dash waves, world layout |
| `Game.js` | the three.js scene, the loop, the robot controller, forge / storm / dash / last bridge, the state store |
| `DivisorIsles.jsx`, `divisorIsles.css` | React shell: HUD and overlays, read from the game's state |
| `cases.js` (+ test) | PURE: the orders of « تعاونية الواحة », their steps, `judge` and its explanations |
| `Depot.js`, `Worlds.js` | the 3D worlds of the cases: the depot, the friends' table, the tiler's site; `runSim` shows what was decided |
| `KnowledgePage.jsx` | the full-page « خريطة المعارف », fed by the lesson's `knowledge.jsx` / `knowledgeGraph.js` |
| `Paper.jsx` | the paper mode: the gate, the sign, the model sheet (logic: `kit/longDivision.js`) |
| `ruleForge.js` (+ test), `RuleForge.jsx`, `ruleForge.css` | « مصهر القاعدة »: the rule the student forges and defends on island D (§2sexies) |
| `ExamSitting.jsx`, `examSitting.css` | the screen of « الامتحان الأبيض » (§2quater) |
| `Spaces.jsx` | the screens of the two spaces and of « تقدّمي » (§2quinquies) |
| `Trainer.jsx` | the screen of « تدرّب » on a card |
| `Fit.jsx` | the box of every panel: it never scrolls, it fits (see §2ter) |
| `text.js` | strings of the practice space, the depot and the knowledge page |
| `strings.js` | every Arabic sentence, the sentence of a practice wave (`waveSay`) and the guidance after a mistake (`explain`) |
| `../engine/builders.js`, `robot.js`, `audio.js`, `input.js` | reusable: low-poly builders, the robot, synthesised sound, keyboard + touch input |
| `../../lessonlab/` | « مختبري », the lab of every lesson — its own contract: `LESSON_LAB.md` |

**State of the extraction (2026-11-17).** Done: the pure logic (the six frames above). Not done yet: the React screens
still import the pilot's content by path, `Game.js` is still one class for the runtime and the mechanic, `cases.js`,
`ruleForge.js` and the two string tables still mix kit and lesson, and the lesson's content still reads `logic.js` and
`strings.js` of the world. A lesson's content will be gathered in ONE `lesson.pack.js` (plan §4 step 5).

**Rules of the kit.** A frame is a `create…(lesson data)` function, or a pure helper; it never imports a lesson, a
world or a string table of one. What is mathematics — when a gate is right, how an answer is marked, what a claim
proves — stays with the lesson. New generated content takes `rand` and is tested with `rng(seed)`.

Everything is drawn in code (no model, no image, no sound file); Arabic in the scene is canvas text. No person is drawn.

## 4. State, progress and « الكفاءات »

- The game saves in the browser only (`scopedStorage`, key `smarter_world_<lessonId>`): stage, stars, gems, keys, flags, the
  practice (`practice`, `keysEver`), the knowledge page (`know: { read, sealed, trained, found }`), the exam ladder
  (`exam: { best, fails, weak, sittings }`), per key the first tries done as in an exam (`tally: { ok, n }`), the bridges fired
  (`log`, the evidence of the rule forge) and the rules the student forged (`rules`, §2sexies). Not synced.
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
  from the browser. The JS `verify()` and the PHP verifier share ONE fixture (`apps/api/tests/Fixtures/game-claims.json`).
- **The learning point**: each question carries its key; the four keys map onto the lesson's P1–P4 (`learningPointOf`).
- **The weight**: a practice evidence judged by the server, difficulty 2 (trainer) or 3 (case). The same division asked twice is
  the same item (`ClaimVerifier::itemId`). A game alone never declares a point mastered: `mastery.require_assessment` still asks
  for « إختبار أولي » (tested: twelve right cases leave the point below « mastered »).
- **Offline**: what could not be sent is kept per student and retried when the game opens or the connection returns (idempotent
  by `attemptId`); a refused payload is dropped.

## 5. Check

`node apps/web/e2e/gameworld-divisor-isles.mjs [outDir]` (dev server up) plays the whole game as a simulated student — every bridge,
the storm, the guardians, the dash, the workshop, the last bridge, the ending — then checks that a reload offers the save, that
`?view=classic` shows the mission player and that a TEACHER never gets the world. It fails on a missed stage or a page error.
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
- The save is local to the browser: another device starts from the first island.

## On a phone (TRIAL, owner 2026-11-16 — pilot lesson only)

**What opens.** Lessons are closed on phones (`RequireLargeScreen`). For a lesson listed in
`components/auth/phoneLessons.js › PHONE_LESSONS` a phone opens exactly (owner: « allow only the pages that are designed
for mobile; for the others display the message »):

- the lesson's HOME — the student's game world, the teacher's card;
- for the teacher, **« المذكّرة الكاملة » and « ملفّ الدرس »** (to read and to note, anywhere) and « جرّب الدرس كتلميذ ».

Everything else keeps the message « محتوى الدروس يظهر فقط في شاشة الحاسوب »: a module page, the classic player
(`?view=classic`), « حصّة القسم », the bank, the tracking, the knowledge card. **On the teacher's card and in the common
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
   (`data-di-fit-scroll`), like the forge's two columns, the launch kit's stage and the lab's panels. The page itself and
   the sideways direction never scroll. This is the ONE exception to « nothing scrolls »; tablets and laptops are unchanged.
4. **The middle of the screen is the world.** The equation and the verdict go to the corner under the island's name, the
   robot's sentence to the bottom between the stick and the buttons: in the middle they covered the bridge the student
   had just built. The teacher's preview notice is a small pill under the corner buttons.
5. **The instrument gets the room** in « مختبري »: its quests are one line that slides.
6. The page's background is the game's night colour: a phone shows it beside its camera cut-out.

**Upright**: « أدِر هاتفك » (`TurnPhone`) covers the game until the phone is turned. The teacher's card is responsive
upright: the lesson's name, then the tools on one line that slides.

**Walks.** Every game walk takes `E2E_TOUCH=1 E2E_SIZE=800x370`; `launch-kit.mjs` and `lesson-lab.mjs` also take
`E2E_SOFT=1` (a failed check is printed and the walk goes on, to look at every screen). State on 2026-11-16, Chromium
emulation: the world walk passes 61 checks and stops at island H, where the quiz did not open — the same walk passes on a
laptop, so either the walk's steering or the game under touch is at fault: NOT established. The practice and exam walks
were not re-run after the scale changed to 13. Not walked on a phone: « إختبار أولي » and the classic player (closed
there). The instrument's own labels in « مختبري » are still small.
