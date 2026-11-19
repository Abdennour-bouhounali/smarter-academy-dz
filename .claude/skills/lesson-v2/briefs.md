# The briefs — one template per agent

Fill the `<…>`; keep everything else. Every brief = §0 header + its own section + §0 limits + §0 report. `<L>` is the
lesson's folder, `<id>` its id, `<REF>` the reference lesson — the most recent lesson of the same world that is « done »
(today: `khawass-qawasim` for a written world, a board and walks; `qasim-mushtarak-akbar` once committed, for a key that
is not about a bridge). Launch agents with the Agent tool, `model: "opus"`, in the main tree (a worktree misses
untracked folders). When a lesson teaches something a template did not foresee, correct the template (`SKILL.md` §5).

## §0. The three blocks every brief carries

**Header**

> You are `<the task in one line>` of one lesson of the repo at `/home/abdennour/Projects/smarter-academy/smarter-academy-dz`
> (branch `dev`; an Arabic RTL maths platform for the Algerian middle school; React + Vite, JSX, no TypeScript). Read the
> root `CLAUDE.md` first: it binds you. Then read `.claude/skills/lesson-v2/defects.md`: every line is a mistake already
> made here — do not make it again, and say in your report which lines your work could have hit. Another session
> orchestrates, reads your diff and runs the browser walks.
> The lesson: `<grade>` `<id>` « `<Arabic title>` » (`<place in its unit>`), folder `<L>`. It is rebuilt from scratch:
> DO NOT read its old version (`modules/`, `content/`, the root `knowledge.jsx`, `moduleContext.js`).

**Limits**

> - Write ONLY: `<the files of this agent>`. Other agents write at the same time in: `<their files>` — never edit those.
>   A shared document is edited by small anchored replacements with the Edit tool, never rewritten whole; a registration
>   in a shared file is your LAST edit.
> - If a shared file is wrong or lacks something you need, do NOT bend your work around it silently: report exactly what
>   is missing.
> - Checks you run: `cd apps/web && npx vitest run <your files> --maxWorkers=2`, `npx eslint` and `npx prettier --check`
>   on your files. Do NOT run a walk, a build, the whole suite or `check:lessons`. Do NOT commit, do not touch git state.
> - One screen, no scroll, at 1366×768, 1024×768 and 1840×900; text (SVG text included) at least 12 px at its real size;
>   a formula never breaks across two lines (LaTeX in a JS string takes two backslashes; a plain string holds no `$`);
>   a typed answer in its own shape, with printed units; money « دج », no thousands space; brand blue shapes, never
>   black; drawn in code, never an image; a list is joined with a no-break space before its comma.
> - Own contexts, own numbers, own wording — never the textbook's, never a line of the exercise bank. Respect Islam
>   (neutral Algerian everyday contexts). « الكفاءة », never « نقطة التعلّم ». Arabic number agreement through the
>   lesson's helpers (`counted`, `planks`, `cells`), never a number glued to a noun by hand.

**Report**

> Your final message: (1) what you changed, file by file; (2) what you ran, with numbers; (3) what you could NOT verify
> without a browser — name the screens and sizes the orchestrator must look at; (4) what you are unsure of, and every
> design choice you made that the brief left open; (5) defects you saw and did not fix. Never say something passes that
> you did not run.

## §W. The written world (wave 1)

> Task: write `<L>/world/` — every file EXCEPT `forges.js` and `inquiries.js` (another agent writes those next):
> `story.js`, `math.js`, `text.js`, `practice.js`, `trainer.js`, `journey.js`, `knowledge.js`, `evidence.js`,
> `sitting.js`, `index.js`, each with its test.
> Read first: `npm run -s lesson:brief -- <id>`; `docs/architecture/LESSON_V2.md` (the folder, evidence §1bis);
> the lesson's section of `<the design page>`; `<REF>/world/` — every file and its test; `kit/claims.js`,
> `kit/bankSitting.js`, `guardEvidence`.
> - The story is the design's: `<islands, gaps, keys with their ids, what happens between them>`. Its hook `objective`
>   gives the WHOLE instruction of each step (it stays on screen; the robot's sentence does not), `recall` the card of
>   the island before; a situation that makes a rule necessary is declared with `convoy` / `convoys` (`GAME_WORLD.md`
>   §2ter-1) — `onArrive` must bear being run twice. Check every new number
>   with `story.test.js` (no number of another lesson, no headline pair of the lesson's bank) BEFORE using it elsewhere.
> - **The final mission must need the lesson**: `<the mission, its right plank and its distractor — the error the lesson fights>`.
> - Nothing states a rule or names a key before its forge: the story's `say`, the dash, the stone, the trainer's
>   guidance are played before some keys exist — check the order. Tablets and knowledge cards come after: they may.
> - Evidence: a claim only for a first-try, exam-format answer that is ENTIRELY right; it states the whole answer; write
>   the property test « `verifyClaim(claim) === check.ok` » for every trainer question type.
> - Re-compute every answer key, distractor and hint from the numbers in a test; never trust a written key.
> - `sitting.js` is one call to `createBankSittings`. Knowledge cards use only kinds of `kit/text.js`. The map's
>   `POSITIONS`: no card cut by the box, no two cards overlapping, no link label under a card, with the panel open, at
>   the three sizes — compute it from the kit's CSS and give your margins.
> Report also, for the forges' agent: what the student HOLDS when each key's island is reached (the bridges he crossed,
> with which planks, the last sentence he heard).

## §B. The board, the class test, the launch-kit family (wave 1)

> Task: `<L>/board/script.js` (`SCRIPT`), `memo.js` (`MEMO`), `board.test.js`; `content/class-tests/<grade>/<id>.json`;
> the launch-kit family `<family id>` if the status script says it is missing.
> Read first: `lesson:brief`; the lesson's `world/story.js` and `world/knowledge.js` (read, never write);
> `CLASS_SESSION.md` (§5ter), `LAUNCH_KIT.md`; `<REF>/board/` and its class test; `launchkit/families.js`.
> - The hour: a situation of the lesson's own on numbers DIFFERENT from the student's story, then one question per key
>   in the order of the keys, each PROVED on the board before its rule is named, then the copybook pages. Use only
>   station types the board already plays; a missing one is reported, not bent.
> - **A station that is not about planks carries its own words** (`ask` step `words: { card, held, fell }`): never
>   « لوح … يثبت / ينهار » for a sharing, a fraction, a classification.
> - No key's name on screen or in an oral cue before its naming station. A Latin name inside an Arabic cue (« PGCD(20 ; 30)
>   = 10 ») is a formula or is isolated.
> - Every number of the script and the memo is computed by `board.test.js`. The class test's questions are the
>   platform's own, cover every الكفاءة, each answer key re-computed.
> - A launch family never shows the lesson's own instrument or names one of its keys (`labTool` is an instrument of an
>   EARLIER lesson, or null). Its lists are built with the family's `listText`.
> Report also what a walk of the board must click, and what differs from `<REF>`'s board walk.

## §F. The forges and their experiments (wave 2)

> Task: `<L>/world/forges.js`, `inquiries.js`, `forges.test.js`, `inquiries.test.js`, and the minimal edits they need
> in `story.js` / `text.js` / `math.js` / `index.js` (say which).
> The owner's rule: no rule is told. Each key is FORGED: an experiment made for the nature of that rule (he tries,
> predicts, the world answers with FACTS) → he writes his rule with tiles (unless the experiment itself wrote it) → the
> mirror tests it on HIS evidence → attacks it → seal → a last step where he USES it → only then the tablet names it.
> Exactly one rule holds; every other rule the tiles can write is refuted by a computed case. A help never narrows to a
> choice between two written rules. No two keys share a (kind, mode).
> Read first: `GAME_WORLD.md` §2sexies and « استكشف » (the table of kinds, the spec blocks of the kinds you use);
> the lesson's section of `<the design page>`; `<REF>/world/{forges,inquiries}.js` and their tests; `kit/forge.js`,
> `kit/RuleForge.jsx`, `divisorIsles/ruleForge.js`, `forgeParts.jsx`, and the logic and screen of each kind you use (to
> know EXACTLY which `text.*` keys the screen calls, with which arguments, which are plain strings).
> What the student holds when each forge opens: `<from the world agent's report>`.
> The forges: `<per key: its experiment (kind, mode, numbers), the wrong rules students really hold, its `use`>`.
> - Every sentence of an experiment is a FACT; `inquiries.test.js` lists the forbidden words of each key and fails if
>   two keys share a (kind, mode). `forges.test.js` enumerates EVERY rule the tiles can write and refutes each wrong one,
>   and checks each `use` accepts its solution and refuses near misses.
> - **A key discovered ON THE ISLANDS** (`review.md` §A.0): no `inquiry`; `evidence(log)` builds the rows from the
>   world's log of bridges; `predictCases` returns none (the forge opens on its tiles); a case about two gaps carries
>   `pair`. He may have tried ONE plank only: the mirror's tests and attacks must still refute every wrong rule.
> - **A key that is not about a bridge** (a sharing, a fraction …): its cases carry what the world's `forgeParts.jsx`
>   needs to draw them in their own language (a sharing: `deal`); no tag, attack or refutation says « لوح », « هوّة »,
>   « جسر » — test it.
> - The `use` contexts: read each sentence built from a template with 1, 2, 3–10 and 11+, and for each noun's gender.
> Report also, for the walks' agent: per forge, the hooks a walk clicks, in order, with the right tiles and one false
> rule that shows a refutation.

## §P. The pack, the satellites, the old version deleted (wave 2)

> Task: `<L>/lesson.pack.js`; trace then delete the lesson's old version; the generated index; the tests that enumerate.
> Read first: `LESSON_V2.md` (the pack §1, the folder §2, the retirement ledger); `OLD_VERSION_TRACE_2026-11-18.md` —
> the METHOD (do exactly the same; add this lesson's section); `<REF>/{lesson.pack.js, routes.jsx, lesson.config.js}`;
> `npm run -s status:lesson-v2 -- --lesson <id>`.
> - Phase 1: trace every reader of every old file (the whole repo: `apps/web/src`, `e2e`, `scripts`, `packages`,
>   `content`, `docs/reports/knowledge-contracts`, the unit's `_unit/`, lists and tests that enumerate lessons or
>   modules — and the unit's integration lesson, whose tests read the other lessons' knowledge).
> - The pack like `<REF>`'s: `phone: false`, the world, `knowledge`, `coach` (each الكفاءة → a knowledge sheet), `board`.
> - Phase 2: delete the module pages, `moduleContext.js`, the root knowledge files, the `content/` files nothing new
>   reads, the mission-player keys of the config; `routes.jsx` with `retiredModules: true`; neutral module titles.
> - `npm run generate:lesson-index`; the lesson's folder in the two Prettier lists of `package.json`.
> - A test is updated to the new truth, never weakened. A test that imports every pack gets its own time limit.
> Checks, ONE AT A TIME: the pack, registry and class-session tests and the lesson's folder; the status script;
> `check:unreached` and `check:unused` once each (report only what concerns this lesson).
> Report also the walks that still open this lesson's deleted pages.

## §X. The walks (alone in the tree)

> Task: write AND RUN `apps/web/e2e/gameworld-<short>.mjs` (the story), `-hub`, `-trainer`, `-sitting`,
> `class-lesson-<short>.mjs`, `launch-kit-<short>.mjs`, with a shared `lib/<short>.mjs`.
> You are the ONLY agent writing in the repo. Nothing of this lesson has been opened in a browser yet.
> Read first: `e2e/lib/walk.mjs` (what `shot` checks at every screenshot), `lib/sittingWalk.mjs`,
> `lib/launchKitTwoTools.mjs`, `lib/lessonWords.mjs`; the six walks of `<REF>`; `GAME_WORLD.md` §2ter-0 and the hooks of
> the kinds used; the lesson's `world/` and `board/`; `.claude/skills/lesson-v2/defects.md` §C and « To move ».
> What the agents who wrote the lesson said a walk must do: `<their hooks, tiles, stations — re-check against the code>`.
> - The story walk plays EVERY screen through its UI: each forge from its experiment's first screen (a wrong prediction
>   and a right one), a false rule refuted, the attacks, the seal, the last step typed wrong then right, the tablet;
>   the dash; the stone; the store (the wrong plank first); the end; the ✕ in the world and inside a forge.
> - ANSWERS are computed in the walk from the numbers on screen; a state hook may give the question, never the answer.
>   Nothing is weakened to make a walk pass. A check that fails on something that is right on the screenshot is a fault
>   of the check: fix the check and say so.
> - Carry the checks of `defects.md` « To move » (they are not in the library yet): nothing in an experiment names the
>   rule; no key's name before its naming station; SVG text at its real size; a map and a hub laid out; a whole
>   subtitle; a key that is not about a bridge shows no plank word in its forge or on the board.
> - Anything the app draws at random: test the worst case deliberately (the longest list card), not the one dealt.
> - The story walk names its lesson by a literal id (the status script looks for it).
> Running: the dev server is up on :5173 (do not start or stop it). `E2E_SIZE=1366x768 node apps/web/e2e/<walk>.mjs <outDir>`,
> output kept in a `.log`. ONE walk at a time; never edit a source file while a walk runs. When a walk passes at
> 1366×768, run it ONCE at 1024×768. Do not run 1840×900.
> LOOK at the screenshots (`review.md` §B gives the list and what to look for). Read mixed Arabic and Latin lines on a
> zoomed crop, never at full size.
> Fix real defects where they are: this lesson's folder, the kit screens that are new for this lesson, and — with care
> — the rest of the kit (a change that could alter another lesson's screens beyond a bug fix is reported, not made).
> Report also: per walk its check count at both sizes; the screenshots you LOOKED at and those you did not; what the
> lesson's arrival changes for the OTHER lessons' walks (their foreign-word lists).

## §K. A new experiment kind, or a new mode of one

> Task: add the kind `<name>` to the world `<world>` — new files beside the newest kind (`<its files>`): pure logic and
> reducer, a pure view, its CSS, a logic test, a render test; ONE registration edit in `Inquiry.jsx`, made LAST.
> Read first: `GAME_WORLD.md` « استكشف » (the table of kinds, « To add a kind », the spec blocks — the conventions);
> the design page's row for this kind.
> What it is: `<the nature of the rule; what the student does, step by step; what the world answers>`.
> - Nothing in the kit states a rule or holds a lesson's words: every sentence comes from `spec.text`. A render test
>   fails if the kit itself writes Arabic beyond its shared labels.
> - Predictions before facts. The result object carries what a forge needs as evidence (what HE did, right and wrong).
> - `data-iq-*` hooks for every control a walk must drive; `window.__inquiry`.
> - Logic tested exhaustively over the range the lessons use; the state machine played through with wrong moves.
> - For a MODE of an existing kind: a spec without the mode renders and plays exactly as before — run the tests of
>   every lesson that uses the kind.
> Docs: the kind's row, spec block, sounds, tests and files in `GAME_WORLD.md`; the count of kinds re-read just before
> your edit.
> Report also every design choice left open (they go to the owner or get an answer), and the screens and sizes to look
> at when a lesson first uses the kind — a kind is never seen in a browser before that.

## §R. A fix batch after a review

> Task: fix the defects below, found by `<the walks / the screenshot review>` of `<id>`.
> You do NOT run walks: the orchestrator re-runs them on a frozen copy when you finish.
> For EACH defect: what was seen (the screen, the size, the words), why it is a defect, what the fix must achieve — not
> how. `<numbered list>`
> - For each defect a machine can catch, add the check: a unit test, or an assertion in the lesson's walk (say that it
>   should move to the shared library).
> - Update the walk's expectations when you change a number or a sentence; never weaken an assertion.
> - Two fix agents at once split by files (the student's world ∥ the board, the launch kit, the lab); a test of the
>   other agent's area that your change breaks is REPORTED with the fix it needs.
