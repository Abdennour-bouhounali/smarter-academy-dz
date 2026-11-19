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

## B. Screens — what the student sees

| # | The defect | Seen | Caught by | The sentence a brief carries |
|---|---|---|---|---|
| B1 | Raw LaTeX on screen; a formula broken across two lines | P | `e2e/lib/walk.mjs` at every screenshot | `$…$` only where the text goes through `MathText`; plain strings (SVG, labels) hold no `$`; two backslashes in a JS string. |
| B2 | No way out of a screen (a forge, a store, a sitting) | P | `e2e/lib/walk.mjs` (a way out at every screenshot); each story walk clicks ✕ in the world and in a forge | — |
| B3 | Text under 12 px — also SVG text scaled down by its viewBox | P, D, R | `e2e/lib/walk.mjs` (floor 11.95, ON by default, the map included); one lesson's walk (L4: drawn text measured at its real size) | Size SVG text for the SMALLEST frame (1024×768): compute `font × frame / viewBox`. |
| B4 | A screen scrolls or is cut at one of the three sizes | every lesson | `e2e/lib/walk.mjs` | One screen at 1366×768, 1024×768, 1840×900: say the longest content the screen can hold and test that one. |
| B5 | A sentence cut by an ellipsis (`nowrap` + `text-overflow`) at ONE size only | L4 (1840×900) | one lesson's walk (L4 trainer walk: the subtitle is whole) | No `text-overflow: ellipsis` on a sentence. Wide screens show longer labels: check 1840×900 too. |
| B6 | A list wraps and a line starts with its comma; a list card on three lines | L4 | `launchkit/launchkit.test.js` (the joiner); `e2e/lib/launchKitTwoTools.mjs` (the LONGEST list card is measured at every run) | Join a list with a no-break space BEFORE the comma (`' ، '`). For anything drawn at random, the walk measures the longest case, not the one dealt. |
| B7 | Mixed Arabic and Latin text scrambled by the bidi algorithm (« PGCD(252 ; 36 = (180 ») | L4 | `kit/bankSitting.js › namesAsMath` + `kit/bankDisplay.test.js` (the bank's « PGCD(a ; b) » drawn as a formula); elsewhere: eye, with a ZOOMED crop | A Latin name with brackets inside an Arabic sentence is a formula (`$\\mathrm{PGCD}(a ; b)$`) or is isolated. Never judge the order at screenshot size: crop and enlarge. |
| B8 | A map or a mind map with a card cut by the box, two cards overlapping, a link label under a card | L4 | one lesson's walks (L4 trainer walk `mapLaidOut()`; L4 hub walk: no two labels overlap) | Positions are computed for the widest card at the narrowest frame, panel open. |
| B9 | A card kind with no icon and no word (« • ») | L3, L4 | `kit/knowledgeKinds.test.js` (every `kind` of every `world/knowledge.js`) | Use only kinds of `kit/text.js`; a new kind is added there with its icon and word. |
| B10 | The forge's log hides the row that refutes his rule | L4 | `kit/RuleForge.jsx` offers every row while testing (fixed in the kit) — impossible now | — |
| B11 | Arabic number agreement and definiteness (« 6 خانة », « 12 مزهريات », « في الأكياس متماثلة », « في مزهريتين متماثلة ») | D, L4 | eye (`review.md` §B.6); the lesson's `counted` helpers | Never glue a number to a noun by hand: use `counted` / `planks` / `cells`. Re-read every sentence built from a template with 1, 2, 3–10, 11+. |
| B12 | A shape drawn black; a person drawn locally; a raster image | — | eye; `CLAUDE.md` | Brand blue shapes; `primitives/KidFigure.jsx`; SVG and DOM only. |
| B13 | Money written « DA », or with a thousands space | D | `kit/bankSitting.js › cashDj`; eye elsewhere | « دج », no thousands space. |

## C. The walks themselves — how a check lies

| # | The defect | Seen | Caught by | The sentence a brief carries |
|---|---|---|---|---|
| C1 | A walk reads the ANSWER from the page or from a state hook | R | review of the walk's diff | A state hook may give the question, never the answer: the walk computes it from the numbers on screen. |
| C2 | A sitting walk opened ONE random sheet | R | `e2e/lib/sittingWalk.mjs` (every sheet of the bank) | — |
| C3 | A check weakened to make a walk pass (a font floor lowered, a screen exempted) | R | review of the walk's diff | Never weaken a check: fix the screen, or report. |
| C4 | The walk's own expectation was wrong (« 45دج » expected, « 45 دج » shown; a height compared to the pixel when Arabic glyphs overhang) | L4 | — | A check that fails with equal numbers, or on text that is whole on the screenshot, is a fault of the check: fix the check, say so in the report. |
| C5 | A random draw makes a walk pass or fail by luck | L4 | `e2e/lib/launchKitTwoTools.mjs` (the longest card probed at every run) | When the app draws at random, the walk tests the worst case deliberately. |
| C6 | A walk run while source was edited, or two heavy checks at once: failures that mean nothing | D | the frozen copy (`SKILL.md` §4) | — |
| C7 | « All walks pass » reported for sizes or screens that were not run or not looked at | L3, R | the report's fixed shape (`briefs.md` §0) | Say what was NOT run and which screenshots were NOT looked at. |
| C8 | The status script does not see the lesson's walk (it wants the lesson's id as a literal and `data-di-start` in one walk) | L4 | `npm run status:lesson-v2 -- --lesson <id>` | The story walk names its lesson by a literal id, as `gameworld-khawass.mjs` does. |

## D. The tree

| # | The defect | Seen | Caught by | The sentence a brief carries |
|---|---|---|---|---|
| D1 | The old version of a converted lesson left behind, or a file the conversion made dead | L3, D | `npm run check:unreached`, `check:unused`; the status line « the old version is deleted » | Delete in the SAME change; follow `OLD_VERSION_TRACE_2026-11-18.md`. Other lessons' tests may read the deleted files (the integration lesson's): run the unit's folder. |
| D2 | Shared code names a lesson | P | `lessons/lessonPack.test.js` | The kit and a world are driven by the lesson's data. |
| D3 | The generated index is stale after a pack changed | L3 | `npm run check:lessons` | `npm run generate:lesson-index` after any pack change. |
| D4 | A test that passes alone times out among the whole suite | L4 | — | A test that imports every pack or every lesson gets its own time limit, with the measure in a comment. |
| D5 | Two agents edit the same file, or one rewrites a shared document whole | L4 | the brief names each agent's files | Shared documents are edited by small anchored replacements only; a registration in a shared file is made LAST. |

## To move into the shared walk library (`apps/web/e2e/lib/`)

Checks that exist in lesson 4's walks only, and that every lesson needs: nothing in an experiment names the rule
(A1), no key name before its naming station on the board (A2), SVG text at its real size (B3), the subtitle whole (B5),
the map and the hub laid out (B8), a bidi check on plain text in the trainer, the launch kit and the board (B7 — none
exists yet), the mirror and the board speak the key's language (A10).

## Cost of a lesson (agents only; the main session's own tokens are not measured)

| Lesson | Agents | Tokens | The longest block | Notes |
|---|---|---|---|---|
| L4 `qasim-mushtarak-akbar` (2026-11-19) | 9 | about 2.9 million | the walks: 690,000 tokens, 73 minutes | walks 690k · forges 377k · student-world fixes 346k · board 342k · two new kinds 268k · pack 245k · world repair 235k · board fixes 230k · hidden names on the hub 166k. The world's content had been drafted the day before (not counted). |
