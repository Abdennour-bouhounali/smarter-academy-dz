# The ledger — every defect met while generating a lesson, and what catches it now

Read by every agent that writes or reviews a lesson. One line per defect. « Caught by » names a check that EXISTS (a
path) or says « eye » (then `review.md` names where to look). **« one lesson's walk » means the check is not yet in the
shared library: the next lesson's walks must carry it too, until it moves to `apps/web/e2e/lib/`** (see « To move »).
Add a line at the end of every lesson (`SKILL.md` §5); never delete one — a line whose defect is now impossible says so.

First seen: P = the pilot `qasim-adad-tabii`, L2 = `qawasim-adad-tabii`, L3 = `khawass-qawasim`, D = the three division
lessons (`qisma-iqlidiya-baqi`, `qawaid-qabiliyat-qisma`, `qisma-iqlidiya-hasr`), R = the independent review of
2026-11-19 (`docs/reports/REVIEW_2026-11-19.md`), L4 = `qasim-mushtarak-akbar`.

## A. Pedagogy — what the lesson says and makes the student do

| # | The defect | Seen | Caught by | The sentence a brief carries |
|---|---|---|---|---|
| A1 | A rule is TOLD: a sentence of an experiment, a hint or a tile states the rule or its words before the key is forged | L3, R | each lesson's `world/inquiries.test.js` (forbidden words per key); one lesson's walk (L4 `gameworld-mushtarak.mjs`: nothing in an experiment names the rule) | Every sentence of an experiment is a FACT about what he just did. List the forbidden words of each key in the test. |
| A2 | A key's NAME is on screen before its forge: on the practice hub, in the launch kit's lab, on a board station, in a tile of an earlier forge | L4 | `kit/lockedNames.render.test.jsx` (hub, spaces, end, knowledge page); `launchkit/launchkit.test.js` (a family's `labTool` is never the lesson's own); `e2e/lib/launchKitTwoTools.mjs` (the capsule's lab shows no « أدوات هذا الدرس »); one lesson's walk (L4 board: no key name before its naming station) | A name appears first on its tablet. Check every screen a student can reach BEFORE the forge: hub, lab, launch kit, board. |
| A3 | Two keys of a lesson are found by the same experiment, or a key replays the experiment of an earlier lesson on easier numbers | D, R | each lesson's `world/inquiries.test.js` (no two keys share a (kind, mode)); across lessons: eye (`review.md` §A) | One key, one experiment of ITS nature. Never the same mirror re-skinned, never a choice between two written rules. |
| A4 | An experiment is a tautology on the numbers it shows (a chart that is true for every number it draws) | D, R | eye (`review.md` §A): « could he find the rule false on this screen? » | The experiment must hold cases that refute each wrong rule. |
| A5 | The final mission does not need the lesson (the store asked a plain division at the end of the PGCD lesson) | L4 | eye (`review.md` §A) | The last bridge's choice must be impossible without the lesson's keys; the distractor is the error the lesson fights. |
| A6 | Evidence is TRUE on a wrong answer, or a half-right answer earns a الكفاءة | L3, D, R | each lesson's `world/evidence.test.js` (`verifyClaim(claim) === check.ok` for every question); `kit/claims.js › guardEvidence` | A claim carries the WHOLE answer. Use an existing claim kind; a missing kind is reported, never worked around. |
| A7 | A distractor or a hint is false, or a true answer is marked wrong (memo quizzes, trainer hints) | R | each lesson's trainer / knowledge tests compute every option; eye on the memo quizzes | Compute every number of a distractor and of a hint in the test. Never write an answer by hand. |
| A8 | Look-alike exercises generated instead of the bank; a « DA » of the bank; a line that sends to the textbook | D, R | `kit/bankSitting.js` (the sitting IS the bank; « DA » shown « دج »); `kit/bankDisplay.test.js` | The sitting is one call to `createBankSittings`. A defect of the bank is reported to the owner, never rewritten. |
| A9 | A number, an island or a word of ANOTHER lesson on screen | P | `e2e/lib/walk.mjs` (foreign words, from `lib/lessonWords.mjs`); each lesson's `world/story.test.js` (numbers against the other lessons' and the bank's headline pairs) | New numbers are checked against `story.test.js` BEFORE they are used anywhere else. |
| A10 | A sharing, a fraction or any non-bridge idea is drawn and worded as a plank bridge (« لوح 5 » for five vases — in the forge's mirror, its log, the board's cards) | L4 | `L4 world/forges.test.js` (no plank word in a sharing case); one lesson's walks (L4 story walk: forge 3 shows `data-rf-deal`, no « لوح »; board walk: the bouquet station's own words) | When a key is not about a bridge, EVERY surface must speak its language: the mirror (`forgeParts.jsx`: a case's `deal`), the log line, the board's `ask` step (`words`), the trainer. |
| A10b | A question about TWO gaps drawn as one bridge in the mirror and logged as one gap | L4 | `divisorIsles/forgeParts.render.test.jsx`; one lesson's walk (L4: `data-rf-pair` at every attack of forges 1–2) | A case says what it is — a bridge, a pair (`pair`), a sharing (`deal`) — and the mirror and the log draw THAT. |
| A11 | A rule met only on an experiment SCREEN of the mirror, when a situation in the world could make it necessary (lesson 4 as first built: the owner redesigned keys 1 and 2 the same day) | L4 | eye (`review.md` §A.0) | First look for a constraint he carries across islands (a convoy, a purse); the mirror's experiment is for rules that have none. |

## B. Screens — what the student sees

| # | The defect | Seen | Caught by | The sentence a brief carries |
|---|---|---|---|---|
| B1 | Raw LaTeX on screen; a formula broken across two lines | P | `e2e/lib/walk.mjs` at every screenshot | `$…$` only where the text goes through `MathText`; plain strings (SVG, labels) hold no `$`; two backslashes in a JS string. |
| B2 | No way out of a screen (a forge, a store, a sitting) | P | `e2e/lib/walk.mjs` (a way out at every screenshot); each story walk clicks ✕ in the world and in a forge | — |
| B3 | Text under 12 px — also SVG text scaled down by its viewBox | P, D, R | `e2e/lib/walk.mjs` (floor 11.95, ON by default, the map included); one lesson's walk (L4: drawn text measured at its real size) | Size SVG text for the SMALLEST frame (1024×768): compute `font × frame / viewBox`. |
| B4 | A screen scrolls or is cut at one of the three sizes | every lesson | `e2e/lib/walk.mjs` | One screen at 1366×768 (the ONE size since 2026-11-19): say the longest content the screen can hold and test that one. |
| B5 | A sentence cut by an ellipsis (`nowrap` + `text-overflow`) at ONE size only | L4 (1840×900) | one lesson's walk (L4 trainer walk: the subtitle is whole) | No `text-overflow: ellipsis` on a sentence. Wide screens show longer labels: check 1840×900 too. |
| B6 | A list wraps and a line starts with its comma; a list card on three lines | L4 | `launchkit/launchkit.test.js` (the joiner); `e2e/lib/launchKitTwoTools.mjs` (the LONGEST list card is measured at every run) | Join a list with a no-break space BEFORE the comma (`' ، '`). For anything drawn at random, the walk measures the longest case, not the one dealt. |
| B7 | Mixed Arabic and Latin text scrambled by the bidi algorithm (« PGCD(252 ; 36 = (180 ») | L4 | `kit/bankSitting.js › namesAsMath` + `kit/bankDisplay.test.js` (the bank's « PGCD(a ; b) » drawn as a formula); elsewhere: eye, with a ZOOMED crop | A Latin name with brackets inside an Arabic sentence is a formula (`$\\mathrm{PGCD}(a ; b)$`) or is isolated. Never judge the order at screenshot size: crop and enlarge. |
| B8 | A map or a mind map with a card cut by the box, two cards overlapping, a link label under a card | L4 | one lesson's walks (L4 trainer walk `mapLaidOut()`; L4 hub walk: no two labels overlap) | Positions are computed for the widest card at the narrowest frame, panel open. |
| B9 | A card kind with no icon and no word (« • ») | L3, L4 | `kit/knowledgeKinds.test.js` (every `kind` of every `world/knowledge.js`) | Use only kinds of `kit/text.js`; a new kind is added there with its icon and word. |
| B10 | The forge's log hides the row that refutes his rule | L4 | `kit/RuleForge.jsx` offers every row while testing (fixed in the kit) — impossible now | — |
| B11 | Arabic number agreement and definiteness (« 6 خانة », « 12 مزهريات », « في الأكياس متماثلة », « في مزهريتين متماثلة ») | D, L4 | eye (`review.md` §B.6); the lesson's `counted` helpers | Never glue a number to a noun by hand: use `counted` / `planks` / `cells`. Re-read every sentence built from a template with 1, 2, 3–10, 11+. |
| B12 | A shape drawn black; a person drawn locally; a raster image | — | eye; `CLAUDE.md` | Brand blue shapes; `primitives/KidFigure.jsx`; SVG and DOM only. |
| B13 | Money written « DA », or with a thousands space | D | `kit/bankSitting.js › cashDj`; eye elsewhere | « دج », no thousands space. |
| B14 | In the world, the instruction was a small line that left the screen, the only full sentence was the robot's and vanished after seconds; nothing recalled the island before; « back » walked him blind towards the camera | every lesson until 2026-11-19 | `kit/Instruction.jsx` (the instruction stays, folds; the card on the right), `kit/WorldRuntime.js` (walking back turns the camera); one lesson's walk (L4 story walk: the instruction present and uncovered at every world screenshot) | The story's `objective` hook gives the WHOLE instruction of each step; `recall` gives the card; never rely on `game.say` for what he must do. |
| B15 | An overlay that covers the top bar with no way out of its own (the workshop's bench had no ✕ and no sound button) | L5 | one lesson's walk (L5 story walk clicks the ✕ in the world, a workshop, the bench, a forge) | Every full-screen overlay carries its own ✕ and sound button; leaving it keeps what he did. |
| B16 | A sum written in a plain Arabic sentence drawn reversed (« 8 + 11 = 19 » shown « 19 = 11 + 8 ») | L5 | `L5 world/story.test.js` (every equality of a note is LTR-isolated); eye on a zoomed crop | An equality inside Arabic text is a formula, or is wrapped in LTR isolates. |
| B17 | A tablet too tall for the board's naming card once a reader is picked; a trainer sheet whose answer boxes wrap one alone onto a line | L5 | `L5 world/trainer.test.js` (at most three boxes a line); eye on the board's naming stations | A tablet is at most a method line, a short list and one note; a typed set of more than three numbers is laid on two lines by the lesson. Since lesson 8: at most three ANSWERS a line — a typed fraction (`{ frac: { n, d } }`, its two boxes over a real bar) is ONE answer. |
| B18 | The 3D number agreement of the world's own labels (« 1 خانات » in the mirror) | L5 | `divisorIsles/forgeParts.jsx › cells` (fixed in the world) | — |
| B19 | A card opened on a veil covered the ✕ and the sound button (the launch kit's memo) | older lessons, clean measure | `e2e/lib/launchKitTwoTools.mjs` (the ✕ reachable at the memo) | The ✕ and the sound stay above every veil of their screen. |
| B20 | A table of the bank drawn in a fixed small size with one-line headers: 10.5 px once the sitting fitted the sheet, and a frame that slid sideways | clean measure | `e2e/lib/sittingWalk.mjs` (every sheet: 12 px, no sideways scroll); `kit/examSitting.css` floors it | Content drawn by a shared component inside a fitted frame takes `max(var(--di-min-font), …)`, and its long labels wrap. |
| B21 | A panel's state reset by an effect one frame late: a new card was drawn with the card before's tab, a correction could flash | clean measure | the trainers' walks read right after the panel appears | State that belongs to a card is keyed to its id in the render, never reset in a `useEffect`. |
| B22 | A button of the old shell hidden UNDER a v2 world (« العودة إلى درس », z 60 under 1200) | clean measure | `e2e/launch-kit.mjs` | Anything shown over a world sits above its z-index (1200) and below the lab's (1300). |
| B23 | An equality with an Arabic operand in plain text, scrambled by a partial bidi isolate (« العرض × 14 = 56 » read « العرض × 56 = 14 ») — OPEN in `utils/bidi.js` | clean measure | eye only | — |
| B24 | A grid that kept an empty column when its content is optional (the bench without its planks column; « تقدّمي » without the server's status: five names on three lines, the last row off screen) | L6 | `e2e/gameworld-bahth.mjs` (space on each side of the rows), the hub walk | When a column is optional, the template drops it. |
| B25 | The board's rail overflowed with 14 stations: each copybook page made a group | L6 | `features/classSession/lessonScripts.test.js` (`groupsOf`: ONE copybook group) | — (fixed in the kit) |
| B26 | A generated reason of « علّل » chained five divisions and shrank its panel under 12 px | L6 | the lesson's `trainer.test.js` (≤ 3 divisions); to move to the shared suites | Every generated sentence is bounded in a test — length is data. |
| B27 | A bench showed, on every row, the planks common to the pair — the answer the student was to find | L6 (seen by the world's agent, before any walk) | `inquiryGcd.render.test.jsx` (`plain`) | A bench gives facts and stops there: ask of every column « does this tell the plank to make? ». |
| B28 | After a refusal, at the light platform, the « اضغط E » bubble sat on the equation the world had just written | L7 (every lesson had it; no walk had shot that state) | `e2e/lib/lessonWalk/` (`worldShot` after a refusal) | The bubble drops under EVERYTHING the world shows in the middle: the instruction, the purse, a bridge's sign, the equation, the verdict (`kit/WorldRuntime.js › placePrompt`). |
| B29 | The purse chip said « قطع الجسرين » over a convoy of ONE bridge | L8 | `divisorIsles/purse.test.js` | A sentence of the world that counts things takes its count from the data. |
| B30 | An answer sheet of the bank taller than its box at the 12 px floor (8 answers, several typed over a fraction bar): the column was CUT and the last answers could not be filled | L8 (`l3-003`, `l5-004`) | `e2e/lib/sittingWalk.mjs` (every sheet) | A sheet that does not fit is shown in pages — never cut, never scrolled, never under 12 px (`GAME_WORLD.md` §2quater). |

## C. The walks themselves — how a check lies

| # | The defect | Seen | Caught by | The sentence a brief carries |
|---|---|---|---|---|
| C1 | A walk reads the ANSWER from the page or from a state hook | R | review of the walk's diff | A state hook may give the question, never the answer: the walk computes it from the numbers on screen. |
| C2 | A sitting walk opened ONE random sheet | R | `e2e/lib/sittingWalk.mjs` (every sheet of the bank) | — |
| C3 | A check weakened to make a walk pass (a font floor lowered, a screen exempted) | R | review of the walk's diff | Never weaken a check: fix the screen, or report. |
| C4 | The walk's own expectation was wrong (« 45دج » expected, « 45 دج » shown; a height compared to the pixel when Arabic glyphs overhang) | L4 | — | A check that fails with equal numbers, or on text that is whole on the screenshot, is a fault of the check: fix the check, say so in the report. |
| C4b | A check measured an element WHILE it moved (a log line shaking for 0.4 s on a refutation « left its column ») | L4 | — | Measure a box after its animation: wait for it, or read the element's rest position. |
| C5 | A random draw makes a walk pass or fail by luck | L4 | `e2e/lib/launchKitTwoTools.mjs` (the longest card probed at every run) | When the app draws at random, the walk tests the worst case deliberately. |
| C6 | A walk run while source was edited, or two heavy checks at once: failures that mean nothing | D | the frozen copy (`SKILL.md` §4) | — |
| C7 | « All walks pass » reported for sizes or screens that were not run or not looked at | L3, R | the report's fixed shape (`briefs.md` §0) | Say what was NOT run and which screenshots were NOT looked at. |
| C8 | The status script does not see the lesson's walk (it wants the lesson's id as a literal and `data-di-start` in one walk) | L4 | `npm run status:lesson-v2 -- --lesson <id>` | The story walk names its lesson by a literal id, as `gameworld-khawass.mjs` does. |
| C9 | A walk's own expectation of where the world reopens (after an overlay's ✕ the world reopens on the save's island, not where he stood) | L5 | — | Read where the world really puts him before asserting it; say NOTE, not FAIL, for a behaviour that is by design. |
| C10 | A walk read the page in the same instant the address changed (the world not yet unmounted) | clean measure | — | After a navigation, wait for the element to detach, and print how long it took. |
| C11 | A walk compared text that held invisible bidi marks, or measured text hidden under a full-screen layer | clean measure | `sittingWalk.mjs › readBox`, `walk.mjs › tinyText` | Compare what is SEEN. |
| C12 | A walk's own tables lagged the kit (a new claim kind, the cabinet's pager, a foreign-word list holding the launch's own tool, an authored two-row formula taken for a broken one) | clean measure | — | Read kinds and names from the kit, never from a hand-written table in the walk. |
| C13 | Two controls shared one hook (`data-ll-plus` on the instrument's « + » and on the number panel's stepper) | L7 | — | A hook names ONE control on a screen; give a new control its own value. |
| C14 | A library check measured each box alone and failed every typed fraction (three false FAILs) | L8 | `e2e/lib/lessonWalk/checks.mjs › lastStepLayout` | A typed fraction is ONE unit of a line. |
| C15 | A walk constant (`stage: 8`) beyond a shorter road crashed the world on load | L8 | `sittingWalk.mjs` takes the stage from the lesson | A walk reads sizes from the lesson, never a constant of the lesson before. OPEN in the world: a save whose stage is beyond the road still throws. |
| C16 | A last step drew its case at random from a pool that held another lesson's number: the walk met it on its second run only | L8 | the lesson's `forges.test.js` checks its fixed pairs; to move: the WHOLE `use` pool against foreign numbers in `describeForges` | What a walk meets by luck is checked over the whole pool in a unit test. |

## D. The tree

| # | The defect | Seen | Caught by | The sentence a brief carries |
|---|---|---|---|---|
| D1 | The old version of a converted lesson left behind, or a file the conversion made dead | L3, D | `npm run check:unreached`, `check:unused`; the status line « the old version is deleted » | Delete in the SAME change; follow `OLD_VERSION_TRACE_2026-11-18.md`. Other lessons' tests may read the deleted files (the integration lesson's): run the unit's folder. |
| D2 | Shared code names a lesson | P | `lessons/lessonPack.test.js` | The kit and a world are driven by the lesson's data. |
| D3 | The generated index is stale after a pack changed | L3 | `npm run check:lessons` | `npm run generate:lesson-index` after any pack change. |
| D4 | A test that passes alone times out among the whole suite | L4 | — | A test that imports every pack or every lesson gets its own time limit, with the measure in a comment. |
| D5 | Two agents edit the same file, or one rewrites a shared document whole | L4 | the brief names each agent's files | Shared documents are edited by small anchored replacements only; a registration in a shared file is made LAST. |
| D6 | Kit code that assumed the pilot's road (the island after the rail was hard-coded as island 6: in a lesson with a longer road he landed on the wrong island and the story stopped) | L5 | `Game.js › finishDash` (fixed: the island after the rail's segment); the story walk plays the dash to the end | Search the world's code for a literal island or segment index before a lesson with a different road uses it. |
| D7 | A headline pair of the lesson's own bank used in the design page (39 ; 65, 84 ; 21) | L5 | each lesson's `story.test.js` and `forges.test.js` read the bank's pairs | The design's numbers are proposals: the world's agent checks every pair against the bank before using it. |
| D8 | A shared helper built and tested but used by no app code (the authoring kit landed with 28 exports « imported by a test only » while lessons 4–7 kept their own copies; the copies had drifted: « 1003 لوحًا » against the kit's « 1003 ألواح ») | L7 | `npm run check:unused` | A lesson's `math.js` RE-EXPORTS the kit, never copies it; a forge uses the kit's block when it is a drop-in. A helper only tests need lives in the kit's `test/`; a block no lesson uses is deleted. |

## To move into the shared walk library (`apps/web/e2e/lib/`)

Checks that exist in lesson 4's walks only, and that every lesson needs: nothing in an experiment names the rule
(A1), no key name before its naming station on the board (A2), SVG text at its real size (B3), the subtitle whole (B5),
the map and the hub laid out (B8), a bidi check on plain text in the trainer, the launch kit and the board (B7 — none
exists yet), the mirror and the board speak the key's language (A10).
| D11 | Deleting an old version orphaned a textbook element in `scripts/check-textbook-coverage.mjs`, and the question went to the owner (« دوري الآن » p. 13) | L6 | `node scripts/check-textbook-coverage.mjs` (in `check:lessons`) | **Owner, 2026-11-19: the textbook is NOT read to generate a lesson, nor its extraction, nor the old version — only the learning points (`lesson:brief`) and some exercises of the bank.** An orphaned element is marked `notIntegrated` in `docs/sources/<grade>/<unit>/extraction.json` with the reason « rebuilt from scratch, owner 2026-11-19 »; never moved to another lesson, never asked. |
| D9 | A flag of the world changed without `refreshObjective()`: the instruction kept saying « take it from this island » after the workshop had opened | L7 | `e2e/lib/lessonWalk/story.mjs › unlock` | Whatever changes what he can do refreshes the instruction. |
| D10 | A pair of the gate dash was the road pair of another lesson (76 and 57 against lesson 5's 19 ; 76); a comment of the kit named two lessons | L7 | `kit/authoring/test/suites.js › describeStory`, `lessonPack.test.js` | Every number of a lesson goes through `node scripts/lesson-bank-numbers.mjs <id> --check`, the dash's too. |
| D12 | Lessons of one unit ran into each other's numbers three times in one night (a dash pair, a comment, a mirror's pair) | L7, L8 | `kit/authoring/test/suites.js` (`describeStory`, `describeForges`: no pair on a line of another story) | The later a lesson in its unit, the fewer free numbers: check EVERY pair with `lesson-bank-numbers.mjs` before writing it, comments included. |
| D13 | A colour set on a class alone was beaten by the world's `.di-root p { color: inherit }`: white text on a cream chip | L9 | every text selector of a screen mounted in the world is prefixed by its root (`.ms-root …`, `.di-root .mi-…`) | eyes, on the first screenshot |
| D14 | A sign added INSIDE the exam text pushed the text below the screen | L9 | what is added to a text that must fit is pinned (absolute), never a new line; `e2e/mission.mjs` fails on text lower than 768 px | `e2e/mission.mjs` |
| D15 | A wrong answer was followed by the next question with no guidance | L9 | every `check` of a mission returns a `fact` for each wrong value; `bem2020.test.js` asserts it, the walk types wrong values and fails without a guidance | unit test + walk |
| D16 | « build what he typed » was skipped for wrong values: the world must carry out a misreading (`scene` returned with `ok: false`) | L9 | `bem2020.test.js › a spacing is planted whatever it is` | unit test |
| D17 | Deleting a lesson's old pages left: a shared scene of the old player, two unit helpers, a shared test whose fixtures were the old content, the teacher's page still listing the modules | L9 | after a deletion run `check:unused`, `check:unreached`, the WHOLE web suite, and open the lesson's address as student AND as teacher (`e2e/missionLesson.mjs`) | checks + walk |
| D18 | A local name shadowed a parameter (`where`) inside the block that still read the parameter: a silent crash of the handler, no page error shown | L9 | play every new branch in the browser once; the walk checks the guidance box exists | walk |

## Time of a lesson (measured — the skill exists to make these numbers fall; owner, 2026-11-19)

Wall clock = from the commit before to the lesson's commit (`git log --date=format:%H:%M`). Critical path = the longest
agent of each wave, plus the walks, plus the main session's own run and checks — what the lesson would take with no
waiting. Fill a line at every lesson's commit; if a number does not fall, say why in the last column.

| Lesson | Wall clock | Critical path | The walks (agent) | Agent tokens | What weighed |
|---|---|---|---|---|---|
| L4, first build | 4 h 14 (10:27 → 14:41) | not measured | 73 min | 2.9 M | two new experiment kinds; one fix batch after the screenshot review; the skill did not exist |
| L4, redesigned on the islands | 2 h 06 (14:41 → 16:47) | not measured | (two agents walked: 53 + 25 min) | 1.2 M | the kit's three new rules and two mechanics, coded the same hours |
| L5, through the skill | 4 h 16 (16:47 → 21:03) | about 3 h 25 | 83 min | 2.3 M | about 50 min of the wall clock went to other work (a new-world study, the older lessons' walks, a session restart); the walks grew (four world pieces seen for the first time); `trusted.md` did not exist yet |

| L6, skill + « do not walk what is proven » | 2 h 25 (21:05 → 23:30, the commit; the repository checks ran after it, on a worktree) | wave 1: 31 min; wave 2: 39; walks: 47; three-size review run: 35 | 47 min | 2.4 M | the walks fell from 83 to 47 min (limits tested as data, the sitting and the frames not re-walked); about 40 min of the clock went to the owner's questions and a council; waves waited on nothing |

| L7, on the authoring kit and the shared walk, ONE size | about 1 h 30 of work (23:31 → 00:42, then 08:01 → 08:20 after a network cut of the night) | wave 1: 31 min; wave 2: 20 (three agents); walks: 31; the main session's fix and re-run: 10 | 31 min | 2.0 M | the walks fell from 47 to 31 min although the library met four things it had never played; wave 2 fell from 39 to 20 min on the authoring kit; no three-size run |

| L8, a NEW world piece (the bridge with a lit stretch) and the fraction bar in three places | about 2 h 05 (08:20 → 10:25, the sitting's paging included) | the piece itself: 45 min of the main session during L7; wave 1: 38 min (board, lab, launch: the longest); wave 2: 28; walks: 46; the sitting's paging: about 25 | 46 min | 2.9 M | a lesson with a new mechanic costs about an hour more than one without (L7: 1 h 30): the piece, a fraction template in the trainer, the forge and the launch kit, and a defect of the shared sitting that only this bank's long sheets showed |

**After L6 (owner, 2026-11-19): ONE size, 1366×768 — the three-size review run (35 min) is gone; and the five cuts he
asked for are being built: walks as data (`apps/web/e2e/lib/lessonWalk/`), an authoring kit
(`gameworld/kit/authoring/`), no weak drafts, checks on a worktree of the commit, no waiting between waves. Target for
L7: under 2 h.**

**Reading, 2026-11-19:** tokens fell by a fifth from L4 to L5; time did NOT fall. The walks are the bottleneck both
times (73 then 83 minutes of one agent, then about 35 more for the main session's three-size run). Nothing in the skill
attacked that until §6 and `trusted.md`, written after L5: lesson 6 is their first test. The target for L6: a walks
agent under 45 minutes, by not walking the sitting, the board frame and the forge frame again.

## Cost of a lesson (agents only; the main session's own tokens are not measured)

| Lesson | Agents | Tokens | The longest block | Notes |
|---|---|---|---|---|
| L5 `tayin-pgcd` (2026-11-19, through this skill) | 6, plus the kit's workshop | about 2.3 million | the walks: 542,000 tokens, 83 minutes | world 447k · mirrors 343k · board, class test, lab instrument 311k · pack 253k · walks 542k · workshop and bench (kit) 206k. Agents for lesson 4's first build: 2.9 million; its redesign the same day added about 1.2 million. The walks are still the largest block. |
| L4 `qasim-mushtarak-akbar` (2026-11-19) | 9 | about 2.9 million | the walks: 690,000 tokens, 73 minutes | walks 690k · forges 377k · student-world fixes 346k · board 342k · two new kinds 268k · pack 245k · world repair 235k · board fixes 230k · hidden names on the hub 166k. The world's content had been drafted the day before (not counted). |
