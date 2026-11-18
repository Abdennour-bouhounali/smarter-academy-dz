# The gate: lesson 3 « خواص قواسم عدد طبيعي » (`khawass-qawasim`), rebuilt on the kit

Written 2026-11-18, at the end of the session that built it. Facts come from the walks, git and the database; what was
not measured is said so. Contract: `docs/architecture/LESSON_V2.md` §6; plan: `LESSON_V2_MASTER_PLAN.md` §4ter-0 step 9.

## Verdict

**`npm run status:lesson-v2 -- --lesson khawass-qawasim` prints ✅ on every line but the paused phone line.** Laptop and
tablet only. **No student has played it and the owner has not validated it.** The old modules and `?view=classic` are
still there (the owner's decision, still open).

## What was measured

| Check | Result |
|---|---|
| Walks, six of them, at 1366×768, 1024×768 and 1840×900 | all pass at the three sizes. 1366×768: the student's world 670 checks, hub 219, « تدرّب » 465, exam sitting 156, board 167, launch kit PASSED. 1024×768: 611 / 199 / 432 / 142 / 167 / PASSED. 1840×900: 670 / 219 / 465 / 156 / 167 / PASSED. **One flake**: the sitting walk failed once at 1840×900 on a 30-second `page.screenshot` timeout (33 checks in), and passed twice in a row afterwards (156 / 156) |
| « مختبري » walk (`lesson-lab.mjs`, the new instrument and the four-lesson shelf) | 49 ok, 0 FAIL at 1366×768 (run once; not at the other two sizes) |
| Unit tests | the whole web suite after the last code edit: **1032 files, 18,167 tests pass** (an earlier full run had 4 failures, all fixed: the pack test, two `boardLessons` assertions and a loop of the kit's tests that timed out under load) |
| Repo checks | `check:unused`, `check:unreached`, `check:format`, `check:lessons` (entry bundle 197.8 KB of 212) pass. `npm run lint` has 4 errors, all in `e2e/class-lesson-qawasim.mjs` (lesson 2's walk, untouched: four unused variables) |
| Published locally (§6.6) | lesson `available`; 9 modules `published`; 50 exercises `published`, read from the local database (the old modules and bank were already there; nothing was added to them) |
| Screenshots looked at with the eyes (§6.5) | student: the letters proof screen (before and after the fix), the join foil round, the stack number line, the peel claim, the fourth tablet (before the fix); board: the stack ask, the peel ask, the naming card of the proof, and at 1024 the first naming card and the foil ask (both before their fixes). **NOT looked at one by one:** the other ~50 shots of the world walk, the hub, « تدرّب », the sitting, the launch kit, the other board shots, and every 1024×768 and 1840×900 shot that passed |

## Time and size (git, not a stopwatch)

Nothing was committed before this report: the whole lesson is one commit. Calendar time of the session: from about 17:14
to about 19:30 on 2026-11-18, planning and first reading included. Hours of actual work were not timed.

Written for this lesson (lines): `world/` 3,850, `board/` 756, `lesson.pack.js` 23, the class test 320 (JSON), the
instrument `Planks.jsx` 174, the six walks 3,075. In the kit: 1,255 lines in four new files (`InquiryCombine.jsx`,
`InquiryProof.jsx`, `inquiry2.test.js`, `inquiryScreens.render.test.jsx`) plus the four kinds' logic and styles (about 430
lines added to `inquiry.js` and `inquiry.css`).

## How it was built

Fable orchestrated; seven agents on `opus` wrote the code (the kit's four inquiry kinds; the world content; the forges and
inquiries; the board; the satellites — launch-kit test, class test, instrument; the walks), each on files nobody else was
touching. The kit's screens are 2D SVG/DOM, so they were not coded by Fable. Fable wired the pack, ran every check and
walk, and fixed what they found.

## What the walks found (real defects, none visible to a unit test)

1. **`judgePeelClaim` overwrote the gap and bridge lengths with booleans** (`{ a, b, d, ...fitsRow() }`, and `fitsRow`
   returns `a` and `b` as booleans), so the peel table never outlined a plank that refutes the claim. 47 kit tests passed.
   Fixed (`gap`, `bridge`), with a test.
2. The proof screen's statement was laid out one token per row (a grid whose items were the pieces of `MathText`), pushing
   the proof slots under the « إلى المرآة » button. Fixed in the kit.
3. A raw `$p + q$` on the fourth tablet (`notes` are plain text) and formulas in plain text inside the proof forge's slot
   labels, scrambled by the right-to-left flow. Reworded.
4. The exam sheet of « تدرّب » printed the prompt as plain text: `$…$` showed raw on four formats. The kit's `Marked` now
   renders a prompt that contains a formula through `MathText` (a prompt without one keeps its underlined numbers).
5. Peel's first attack showed **96**, lesson 2's store number. Replaced.
6. Board: a cue too long for the footer at 1024 px (cut), and tablets whose formula row ran out of the card at 1024 px
   (`jam-wal-farq`, `baqi-qisma`, and the proof's). Cues shortened, rows reduced (so the tablets state fewer equalities:
   the story test's guard went from 8 to 6).
7. The title screen's key hints were 11.5 px: a 12 px floor in the kit (`world.css`).
8. Walk faults, found by running them: a `$` of the lesson counted as raw by the walk's own regex; reading numbers from KaTeX
   annotations (`\displaystyle`); a 30-second wait on an element that does not exist for a right answer; no-break spaces
   lost in a constant. The walks' 12 px floor was applied at every size by the agent; the owner's rule is a PHONE rule
   (paused), so it now applies from 1300 px wide. **At 1024×768 the kit still has text of 10.5–11.5 px** (the stepper numbers
   of the investigation, the mirror's small labels, the board's toolbar labels), shared with lessons 1 and 2; not repaired.
   The knowledge map's labels are exempt on purpose (the kit scales the map to its panel). That exemption also reaches the
   phone check of lesson 2's walks, which share `lib/walk.mjs`.

## Copied from lesson 2, on purpose

The structure of every file of `world/` and `board/`, the walks' helpers (`e2e/lib/walk.mjs` grew options: foreign words and
numbers, a width for the font floor), the class test's shape. A shared helper for a whole lesson's walks is still owed.

## Not done, and why

- **The old modules and `?view=classic` are still there** (the owner's decision, open).
- **The proof key (P4) produces no evidence.** A proof written with letters cannot be re-checked from numbers, and the claim
  kinds have none for it (`claims.js`, the server's `ClaimVerifier.php` and their fixture would change).
- **The practice dash uses only the sentence types of `divisorIsles/strings.js`**: it cannot say « عدد يقسم 21 + 35 ».
- **The last bridge's store still has the student divide 1015** after the « without dividing » choice; the « without
  dividing » idea lives in the stone's question.
- **Euclidean division is not a prerequisite of this lesson in the learning net** although its third key uses it: adding a
  link also changes lesson 2's launch (`LEARNING_NET.md`, then `generate:learning-net`). The owner's decision.
- **The sitting's exercises are generated** (in the bank's shapes, answers computed by code); the 50 exercises of the old
  bank are not read by it.
- The `stack` ask on the board draws 600 planks of 3 in one bar: it reads as stripes (seen at 1366×768), not as planks.
- **Phone**: paused. No phone walk. **A real tablet, a real phone and the owner's validation** were never part of this work.
- **The walks are not in CI.**
