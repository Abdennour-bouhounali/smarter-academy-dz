# « صفحة المراجعة » — the revision page of a lesson

Asked by the owner on 2026-11-26: beside the game world, a plain one-page version of a lesson for older students who
revise. **Built:** the template and the page of ONE lesson, `qasim-adad-tabii`. **Not committed to `main`.**
The prototype it was approved on: `docs/reports/mockups/revision-qasim-adad-tabii.html`.

## 1. Where it is
| Who | Door | Address |
|---|---|---|
| Student | « صفحة المراجعة » on the title screen of the lesson's world | `/espace/muraja/:lessonId` |
| Student | the unit page: « صفحة المراجعة » on « درسك الآن » and on the lesson's row (`UnitMissionView`) | `/espace/muraja/:lessonId` |
| Teacher | the tab « صفحة المراجعة » of the lesson's tools, and the same title-screen door | `/enseignant/muraja/:lessonId` |

A door shows only where the lesson's pack has the page. Both routes are behind `RequireLargeScreen` (phones are paused);
the student's page is also behind the tier gate (`LessonAccessGate`).

## 2. Writing a lesson's page — REQUIRED of every lesson with a game world (owner, 2026-11-26)
A lesson that teaches rules in a game world is NOT done without it: `revision.test.js` fails and
`status:lesson-v2` prints ❌. A unit's last lesson (« أدمج تعلّماتي ») has none.

One file `revision.js` in the lesson's folder (`export const REVISION`), named in its pack
(`revision: () => import('./revision.js').then((m) => m.REVISION)`), then `npm run generate:lesson-index`.
`features/revision` draws it; no list names a lesson. **The model to follow is
`…/aadad-tabiiya-natiqa/qasim-adad-tabii/revision.js`.**

**Sources, in this order:** `npm run -s lesson:brief -- <id>` (what the lesson teaches), its knowledge sheets
(`pack.knowledge` — the SAME rules, in the same words where they have them), its board memo (`board/memo.js`: the
traps, the exit questions), and a look at its bank to know the level asked. The textbook is not read.

**The page** `{ intro, steps, quiz, next }` — `steps` are exactly, in order, each `{ id, short, title, blocks }`:

| id | holds |
|---|---|
| `recall` | what the lesson stands on: a rule, an example, one short `task` to check |
| `lesson` | every rule of the lesson (`rule` blocks), each followed by an `example` |
| `examples` | at least 3 solved `example`s, step by step, the last one a situation |
| `traps` | at least 3 `trap`s: the mistake, then why it is wrong |
| `exercises` | at least 6 `task`s from easy to exam level, each with its `solution` |
| `summary` | one `table` (« القاعدة · بالرموز · مثال · انتبه »), then a `note` « في الامتحان » |
| `quiz` | one `text` block; the questions are in `quiz` (at least 6; the right answer moves) |

- block kinds: `text`, `note` (`text`) · `table` (`head`, `rows`) · `figure` (`figure`: the data of
  `common/components/geoFigure.js`, for geometry) · `rule`, `example`, `trap` (`tag`, `body`) · `task`
  (`title`, `level`, `body`, `solution[]`).
- a `body` line: `{ p }`, `{ concl }`, `{ formula }`, `{ list: [] }`, `{ steps: [] }`. Maths is `$…$`; in a JS
  string a LaTeX command takes TWO backslashes.
- `quiz`: `{ q, options, correct, why }`.

**Writing rules:** own wording and own numbers — never the textbook's, never a sentence of the bank (the exercises step
links to the practice space). Every number is computed twice. A FALSE equality is never written with `=`: write `\neq`
or say it in words. A formula is one line: no formula so long that it cannot fit half a printed page. Separate sentences
with « ؛ », not « · ». The platform's content rules hold (respect, « دج », « الكفاءة »).

**Checks, all before « done »:** `npx vitest run src/features/revision` (steps, answers, KaTeX, equalities between
numbers, no bank sentence), then the page LOOKED at at 1366×768 and printed to PDF: no overflowing formula, **1 A4
page** (2 at most, one sheet).

## « No rule is told » does NOT apply here
Owner, 2026-11-26: « ignore this rule for the summaries ». A revision page and a unit summary tell the rules and are
open from the start to every account that may open the lesson — no gate on the world or on the school calendar. The rule
still binds the game world.

## 3. What it records
Nothing on the server: no progress, no evidence, nothing a teacher reads. Ticked steps stay in the browser
(`sa:revision:<lesson>:steps`).

## 4. Look
Plain, one column up to 1720 px, the platform's blue. « طباعة » prints ONE A4 memo sheet in two columns (owner, 2026-11-26: it must cost the student little): the page alone,
9.5 pt text, NO exercise (no task, no exercises step, no quiz), no example inside the lesson step, only the first two
worked examples. The rules are the CSS `@media print` block. A new lesson's page is printed to PDF and its page count
read before it is called done (at most 2 pages, one sheet).

## 5. Not yet implemented (open, the owner decides)
- A teacher's « closed for this class » is not applied to a lesson's revision page (the unit summary applies it).
- A board (full-screen) mode, counts of openings for the teacher, a link from « اليوم » and from the exam coach.

## 6. « ملخّص الوحدة » (2026-11-26)
`/espace/muraja/wahda/:unitId` and `/enseignant/muraja/wahda/:unitId` (`features/revision/UnitSummaryPage`). Doors: the
unit page, student and teacher. **A unit has its summary only once EVERY lesson of it, the synthesis apart, is
complete (game world + sheets)** — owner, 2026-11-26; it then appears by itself. Today: 4AM unit 1 only. One table per lesson (rule and its short sentence · symbols then example, ONE line per statement — owner, 2026-11-26 · trap), READ from
the knowledge sheets of each lesson's pack (`unitSummary.js`): nothing is written for it. The synthesis (« أدمج تعلّماتي ») is left out. A student does not see the rows of a lesson
that is locked, closed or hidden for him. Printed: one column of compact tables.

