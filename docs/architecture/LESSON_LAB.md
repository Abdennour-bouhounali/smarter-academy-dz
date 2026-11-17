# LESSON_LAB — « مختبري », the lab of a lesson (2026-11-16)

**Status: built and wired on `dev` (uncommitted), NOT yet validated by the owner.** First eight instruments; the registry is
open. Code: `apps/web/src/lessons/common/lessonlab/`. It is a different thing from the Math Lab « مختبر الرياضيات »
(`/espace/atelier`, `MATH_LAB.md`), which stays untouched: that one is a general workspace with documents; this one belongs to
the LESSON the student is in and shows only what he has already studied.

## 1. What it is

One lab for every lesson of the cycle. From a lesson the student opens « 🧪 مختبري » and finds:

- **« أدوات هذا الدرس »** — the instruments introduced by this very lesson;
- **« خزانتي »** — the instruments of EVERY lesson before it, of every grade, grouped by grade then by lesson. An instrument of
  a later lesson is **not listed at all** (not even locked): a student never meets a tool of something he has not studied;
- **« أعدادي »** — two numbers, SHARED by all instruments: the student carries his numbers from one instrument to the next
  and sees the same fact in another form (42 and 5 as rows with 2 left over, then as jumps that stop 2 before the flag);
- **« جرّب »** — two or three things to MAKE per instrument, ticked when made, counted in one ⭐ total for the student.

The lab opens on the first instrument of the lesson (or of the cabinet when the lesson introduces none).

## 2. The « previous lessons only » rule

- The order is the catalogue's: grade (1AM → 4AM), then `order` in `packages/core/curriculum/dz/lessons_<g>_2026_2027.json`.
  It is copied into `lessonlab/lessonOrder.generated.json` (codes only, 6 KB) by `npm run generate:lab-order`
  (`apps/web/scripts/generate-lab-order.mjs`). **Run it after adding or re-ordering a lesson**; `lab.test.js` fails when stale.
- `order.js › isReached(x, of)`: x is `of` itself or a lesson before it. `registry.js › toolsFor(lesson)` returns
  `{ mine, cabinet, all }`; `hasLab(lesson)` says whether any instrument is reached (the very first lessons of 1AM have none:
  they get no door).
- Tested for **every lesson of the four grades**: no lesson ever lists an instrument of a lesson after it.

## 3. An instrument

An entry of `registry.js › TOOLS`:

| Field | Meaning |
|---|---|
| `id` | stable id; also the file `tools/<Name>.jsx` loaded lazily by `load` |
| `lesson`, `lessonTitle` | the code of the lesson that INTRODUCES it and that lesson's exact catalogue title (the test compares) |
| `icon`, `name`, `hint` | the tile; `hint` is one plain sentence ending on what to look for |
| `needs` | `'ab'` or `'a'`: which of the shared numbers it uses |
| `labels`, `range` | how the two numbers are named in this instrument, and the values it can draw (`clampFor`) |

The component receives `{ a, b, setA, setB, play, report, range }` and renders `<Tool>` from `kit.jsx` (the drawing, then a
one-line reading of FIXED height — the drawing never moves when the reading changes).

**Rules of an instrument** (the bar of `MANIPULATION_DNA.md` applies):

1. The student's hand holds a MATHEMATICAL variable: a wall that sets the divisor, a flag that sets the number, the corner of a
   rectangle, a padlock of digits, a lens that tests each number it passes over. A handle that was never moved pulses.
2. The drawing READS: counters, landings, squares and their numbers are computed (`logic.js`, pure, tested) — never typed.
3. Numbers and equalities are written left to right (`.ll-draw > svg { direction: ltr }`); an Arabic label sets
   `direction="rtl"` on itself. A label must stay inside the stage (the walk checks every `<text>`).
4. `report({ key: `${a}:${b}`, … })` tells the shell what was made (divisors found, squares cut, a division finished). The
   `key` stamps the numbers it was made WITH: a report about other numbers is ignored.
5. No person is drawn.
6. Sound through `play(name, number)` only, with a name of the lab's palette (next section).

### The sounds (`sound.js`, 2026-11-17)

The lab has its OWN small instrument (`LabSound`: WebAudio, no asset, 27 sounds), the same in every lesson — it borrows nothing
from the game world. (`new LabSound(palette, gaps, log)` lets another page bring its own palette to the same synthesiser:
« عُدّة الانطلاق » does, `launchkit/sound.js`.) ON by default; the « الصوت » switch of the lab turns everything off (saved with the lab's state).

**The rule: a sound says WHAT HAPPENED under the hand, never the rule of the lesson.**

| What | Sound | Where |
|---|---|---|
| a number moves | `tick` / `click` / `select` — **the number has a note** (`pitchOf(n)`: five notes per octave, three octaves): 12 does not sound like 13 | the wall, the flag, the knob, the corner, a digit of the padlock, « − / + » of the number boxes |
| nothing is left | `fit` — ONE chime, the same in every instrument: sweeping the wall, the student HEARS where the rows are full | rows, jumps, the four sentences, the written division |
| something is left | `rest` / `short` — two soft low notes. **Never a buzzer: the lab has no wrong answer** | the same |
| a divisor and its partner | `found` — two notes together, the divisor's and its partner's; `miss` is a dull tap | the lens |
| a whole is finished | `complete` (every divisor found), `crown` (the PGCD), `lamps` (one soft note per lamp lit) | divisors, common divisors, Euclid, the padlock |
| a material | `snip` (scissors), `pencil` / `erase`, `swap` (the lever), `hop` (a jump), `drawer` / `shut` (the cabinet), `dice` | — |
| the bench | `enter` (the lab opens), `open` (an instrument is set down), `quest` (a « جرّب » is made — played AFTER the instrument's own sound), `ui`, `on` | the shell |

How to use it in an instrument:

- a sound of the GESTURE is played in the handler: `play('tick', nb)`;
- a sound that ANSWERS a change uses `useChime(play, name, when, deps, { delay, p })` (`kit.jsx`): it plays when `deps` change
  and `when` holds — **never when the instrument first appears** (an instrument is silent until the student moves something);
- the same sound is not repeated faster than its gap (`GAP`: a fast drag ticks, it does not rattle); several sounds at once go
  through one compressor;
- a new sound = one entry in `SOUNDS`, short (≤ 1.3 s) and quiet (gain ≤ 0.3). `lab.test.js` fails when an instrument plays a
  name that is not in the palette, when a sound of the palette is never played, or when an instrument has no sound at all.

**« جرّب »** (`logic.js › QUESTS`, `observe`): a quest names something to make, never a rule; `observe(tool, state, seen)`
returns the quests the state has just proved. Nothing is ticked before the student touches the instrument.

### The eight instruments (2026-11-16)

| id | Lesson that introduces it | The hand holds | What is read |
|---|---|---|---|
| `rows` « صفوف القسمة » | 4AM `qasim-adad-tabii` | the wall (the divisor) | a counters in rows of b: full rows, counters left over, `a = b × q + r` |
| `jumps` « قفزات المضاعفات » | 4AM `qasim-adad-tabii` | the flag (the number) and the first landing (the jump) | landings on the multiples of b; what is missing before the flag |
| `sentences` « آلة الجمل الأربع » | 4AM `qasim-adad-tabii` | the swap lever | four sentences true together or false together, with the equality that proves it |
| `divisors` « قوس القواسم » | 4AM `qawasim-adad-tabii` | the lens | each divisor rises with its partner; an arc joins them |
| `common` « القواسم المشتركة » | 4AM `qasim-mushtarak-akbar` | the two numbers; a tap on a divisor | three trays; the greatest common one wears the crown |
| `euclid` « مربّعات إقليدس » | 4AM `bahth-pgcd` | the corner of the rectangle; the scissors | each family of squares writes its division; the last side is the PGCD |
| `paper` « القسمة على الورقة » | 1AM `qisma-iqlidiya-baqi` | the step button | the division as written on a sheet, with what one says at each step (`gameworld/kit/longDivision.js`) |
| `rules` « كاشف قابلية القسمة » | 1AM `qawaid-qabiliyat-qisma` | the digits of a padlock; a tap on a lamp | six lamps (2, 3, 4, 5, 9, 10) and the digits each rule reads |

**To add an instrument**: write `tools/<Name>.jsx`, add its `TOOLS` entry (lesson code + exact title), its maths in `logic.js`
with tests, its `QUESTS` and its `observe` branch, a step in `e2e/lesson-lab.mjs`, and a row in the table above.
When a NEW lesson has a manipulation worth keeping at hand, give it an instrument here — small, free numbers, one gesture.

## 4. Where it opens

| From | Door | How |
|---|---|---|
| a lesson with a game world (`qasim-adad-tabii`) | « مختبري » on the title screen (`data-di-lab-open`) | overlay `{ type: 'lab' }`, the lab rendered `inline` inside the game's root, with the lab's own sounds; the 3D world behind it is neither simulated nor drawn while it is open (`Game.js › loop`) |
| a lesson in mission mode | « 🧪 مختبري » in the foot row of the returning home (`MissionHome`, `data-mission-lab`) | `?lab=1` |
| any other lesson page, for a student | « 🧪 مختبري » beside the lesson chip (`data-lesson-lab-open`) | `?lab=1` |
| the kit of « عُدّة الانطلاق » (`LAUNCH_KIT.md`) | « جرّب الأداة في مختبري » | `<LessonLab initialTool="paper" />`: the lab opens ON that instrument, put on the bench like a pick from the cabinet (ignored when the lesson has not reached it) |

`LessonIndex` renders the lab for `?lab=1` when `hasLab(lesson)` (portal to the body); closing removes the parameter. A teacher
gets no button (he may open `?lab=1` by hand). Lessons and the lab stay behind `RequireLargeScreen` (≥ 768 px).

## 5. Screen

- **Nothing scrolls.** Two designs so the text never gets small: 1280 × 720 for a wide screen, 1000 × 740 for a 4:3 one
  (`ll-root--narrow`), each zoomed to the window. Measured: tile / quest / reading text 17 / 16 / 20 px at 1366 × 768,
  16 / 15 / 19 px at 1024 × 768, 20 / 19 / 23 px at 1840 × 900.
- The cabinet never scrolls either: one grade per tab, four lessons a page.

## 6. State

`scopedStorage` key `smarter_lesson_lab` (per student, browser only, not synced): the two numbers, the instruments picked from
the cabinet (the last five), the quests done, the sound switch. One toolbox for the student: what he made in one lesson's lab
is counted in another's. **The lab writes NO learning evidence** and unlocks nothing.

## 7. Bundle

Everything is inside the lazy lesson boundary: `LessonIndex` imports only `registry.js` + `order.js` + the 6 KB order file;
`LessonLab.jsx` and each instrument are loaded when opened. Nothing enters the entry bundle (`BUNDLE_BOUNDARIES.md`).

## 8. Check

- Unit: `npx vitest run src/lessons/common/lessonlab` in `apps/web` (19 tests: the order is the catalogue's; no future
  instrument for any lesson; every equality the instruments draw; quests ticked only by what was made; the sounds — every
  name played exists, a number has a note, a sound is short and quiet and does not rattle).
- Walk: `node apps/web/e2e/lesson-lab.mjs [outDir]` (dev server up; also `E2E_SIZE=1024x768` and `1840x900`): lesson 1 of 4AM
  from its game world, then the PGCD lesson from its mission home, then a lesson with no lab. Real pointer drags on the wall,
  the flag, the corner and the lens. At every screenshot: nothing scrolls, nothing leaves the screen, no label is clipped. The walk also LISTENS (in dev `sound.js`
  writes each sound it has really played into `window.__labSounds`): the opening chime, the ticks of the wall and the one
  chime of the full rows, silence with the switch off, the eight hops, the drawer, the pencil, the scissors, the crown — 47 checks.

## 9. Known limits

- Eight instruments, all around division and divisors: the other units have none yet (their lessons show the cabinet only).
- Not validated by the owner; no real student has used it.
- The lab's state is not synced between devices.
- The sounds were checked by a walk that reads what was played, not by a human ear: their level and their feel on a tablet's
  speaker are still to be judged by the owner.
- The old « 🧪 المختبر » button of the Math Lab (`MathLabEntryButton`) is still on lesson pages; whether « مختبري » replaces it
  is the owner's decision.
- **On a phone held sideways** (`E2E_TOUCH=1 E2E_SIZE=800x370`: 33 checks; rules in `GAME_WORLD.md` « On a phone »): 12 px
  is the floor of a label, the quests are one line that slides, the instrument's drawing (`.ll-draw`) slides inside
  itself. The lab opens there only with a lesson that opens on a phone: the walk checks that another lesson's lab is
  closed with its lesson. The instruments were looked at on screenshots, not held in a hand.
