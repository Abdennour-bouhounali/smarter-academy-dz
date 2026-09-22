# Manipulation Contract — tactile mathematical laboratories

> One manipulation = one mathematical idea made **physical**. The student acts; the notation follows.
> Scope: `apps/web/src/lessons/common/manipulations/`. Types are registered in
> `packages/core/curriculum/manipulationTypes.js` (closed registry, no code from content).

## 1. The five questions

No manipulation is written before these five are answered in its file header.

| | Question |
|---|---|
| **A** | What does the student physically manipulate? |
| **B** | What mathematical idea does that action represent? |
| **C** | What changes visually when they act? |
| **D** | What mathematical representation emerges from the action? |
| **E** | What must be discovered *before* the formal rule is shown? |

If a type cannot answer all five, it is a reveal button, not a manipulation. Redesign it.

## 2. Architecture

```
manipulations/
├── Manipulation.jsx            entry point: <Manipulation type="…" … />
├── manipulationRegistry.js     closed type → lazy component map
├── ManipulationShell.jsx       mission · progress · controls · stage · representation · discovery
├── ManipulationStage.jsx       the manipulation area (centre of the page)
├── ManipulationProgress.jsx    جرّب › اكتشف › صِغ  (+ « الخطوة n من N » only when a type
│                            passes `stepCount` — none does today, so it never renders)
├── ManipulationControls.jsx    student: إعادة · تلميح · تحقّق · الشرح
├── ManipulationTeacherMode.jsx class mode: step, replay, hide answer, show solution, change numbers
├── ManipulationHint.jsx        progressive hints (never the answer)
├── ManipulationDiscovery.jsx   conjecture → formal rule (never before the action)
├── ManipulationLevels.jsx      4 levels + مختبر حر (constrained)
├── ManipulationWorkspace.jsx   ONE workspace, two levels (مبتدئ / متقدم) — §7bis-levels
├── ManipulationLevelSelector.jsx  the two tabs (role=tablist, arrow keys, RTL-aware)
├── workspaceLevels.js          PURE decisions of the workspace (unit-tested)
├── useManipulation.js          numbers · phase · hints · level · mode · epoch
├── useStepSequence.js          bounded step cursor
├── useDragInteraction.js       pointer drag + magnet + reject + keyboard alternative
├── levels.js                   the 4 levels per type, each citing a textbook element
├── logic/                      PURE interaction logic per type (unit-tested, no React)
├── themeWords.js               the Arabic words of a theme (lesson.json) merged with a lesson's `context`
├── primitives/                 shared building blocks, never duplicated by a type
│   ├── PlayerFigure.jsx + PitchBackdrop.jsx   a drawn footballer and a real-proportioned pitch (2:3)
│   ├── BookFigure.jsx + BookRectangle.jsx     the library's book, and n of them in shelves of `cols`
│   ├── ItemFigure.jsx + itemThemes.js         the drawn objects of the other worlds (flower, ball,
│   │                                          shirt, pen, notebook, spoon, cup) and which theme draws which
│   ├── GroupingScene.jsx + groupingLayout.js  a and b objects in k identical groups, the rest apart
│   ├── BrickWall.jsx + brickLayout.js         a length built in bricks of n (walls of lesson 3)
│   ├── RibbonStrip.jsx                        a length drawn as a notched ribbon (the tailor's workshop)
│   └── ContextScenes.jsx                      the landscape vignettes of each world, for `MissionBrief.visual`
└── divisibility/               the 10 types of unit 1 (+ teamFormation.js, pure geometry)
```

`divisibility/DivisorExplorerBooks.jsx` (`divisor-explorer-books`, Module 1 of
`qasim-adad-tabii`) is the one **standalone** type: it ships its own styles and
does not go through `ManipulationShell`. Its gesture is a **choice, not a
drag**: the student taps a shelf size (`.be-choice`, `aria-pressed`) and the
420 books redistribute. Because it bypasses the shell, it has no levels, free
lab, hints, discovery phase or explanation panel, and its
`MANIPULATION_TYPES.controls` entry is not consumed. It was adopted
as delivered, complete visual game included; its contract with the module is
only `onVerdict({ b, divides, quotient, remainder })`. It is also the first
consumer of the platform **Classroom Mode** (`lessons/common/classroom/`,
`docs/architecture/CLASSROOM_MODE.md`): the presentation shell owns fullscreen,
the fallback overlay, scroll lock, Escape and the fitting engine; the lab only
reads `useClassroomMode()` and solves its shelves grid for the offered area
(`divisibility/booksClassroomLayout.js`).

**Rule:** a type composes primitives and calls `logic/`. It never re-implements a gesture, a
tile, a drop zone, or a piece of mathematics.

**One unit, one set of objects.** Types that share a lesson's story draw the *same* objects:
`divisor-explorer-books` arranges 420 books on shelves, and `factor-pairs` lays the same books out
as rectangles (`BookRectangle`), so the student recognises the instrument from one module to the
next instead of learning a second abstraction. The books lab keeps its own `Book` because it is
welded to its `be-book*` classes, which the classroom layout engine and the e2e selectors read;
the palette is therefore duplicated **on purpose** and locked by `primitives/bookPalette.test.js`,
which fails if the two ever diverge.

## 2bis. Drawn worlds — every lesson has its own, and the theme is data

The football pitch (lesson 1, مبتدئ) and the library (lesson 1, متقدم) set the standard
(2026-09-21): a real situation, real objects drawn in parameterised SVG, a direct gesture, and a
notation that follows the gesture. That standard now holds across the unit. Each lesson opens on
**one world**, chosen because it makes the concept's structure visible — never bolted on:

| Lesson | World (`theme`) | Drawn objects | The gesture | What the drawing *is* |
|---|---|---|---|---|
| 1 قاسم عدد طبيعي | `football` / `library` | players on a pitch / books on shelves | drag a player into a team / tap a shelf size | the remainder is a player left standing, a book left on the floor |
| 2 قواسم عدد طبيعي | `library` | the same books, in rectangles | drag a column count onto the pile | a perfect rectangle ⇔ `n = d × e` |
| 3 خواص القواسم | `construction` | two walls in bricks of length n (`BrickWall`) | carry wall b: join it, remove it, or measure wall a with it | sum, difference and remainder are still whole bricks ⇔ n divides them |
| 4 القاسم المشترك الأكبر | `football` (مبتدئ) / `garden` (متقدم) | balls & shirts / red & white flowers in identical groups (`GroupingScene`) | drag a number of groups onto the table | the k that leave nothing outside are exactly the common divisors |
| 5 تعيين PGCD | `school` (مبتدئ) / lists (متقدم) | pens & notebooks in identical bags, then the divisor lists | groups first, then carry the common divisors to the middle and the greatest to PGCD | « commun » seen on objects, then read in the lists — which *are* the object of this lesson |
| 6 البحث عن PGCD | `workshop` | two ribbons (`RibbonStrip`) | cut the short ribbon out of the long one (differences) / lay copies of it along (Euclid) | the greatest common length survives every cut and every remainder |
| 7 أوليان فيما بينهما | `school` (مبتدئ) / lists (متقدم) | 17 pens and 18 notebooks in identical bags | try 2, 3, 4… bags — nothing works but 1 | coprime ⇔ no identical grouping beyond one bag ⇔ only 1 in the middle |
| 8 اختزال كسر | `kitchen` | spoons of sugar and cups of flour, in portions | drag a common divisor onto the recipe | dividing both terms by k = k identical portions; the reduced fraction is one portion |

Rules that make this reusable rather than eight one-offs:

- **A theme is data.** A lesson passes `theme="garden"` to `<Manipulation>` and declares it in
  `resources[].experience.theme`; the closed list is `VISUAL_THEMES` in
  `packages/core/curriculum/manipulationLevels.js`, and `validate:lessons` rejects an unknown id.
  Which objects a theme draws lives in `primitives/itemThemes.js`; its Arabic words live in
  `lesson.json` under `manipulation.themes.<id>.*` and are read through `themeWords()`, which a
  lesson's `context` (the textbook's own words) may override. **No scene contains Arabic.**
- **One scene, three types.** `GroupingScene` serves `common-divisors`, the groups stage of
  `coprime-explorer` (`startWith="groups"`) and `fraction-reduction`, because « k identical
  groups of two kinds of object » is one piece of mathematics (`equalGrouping.groupInto` in core,
  laid out by `groupingLayout.js`, unit-tested). Do not write a second grouping scene; pass a theme.
- **Lengths are objects too.** `BrickWall` and `RibbonStrip` replace the abstract `QuantityBar`
  wherever the lesson talks about a length that must be *measured by* another: bricks make
  « whole multiple of n » visible, ribbons make « cut » and « lay along » physical. Geometry is
  pure and swept in `brickLayout.test.js`.
- **The vignette matches the instrument.** The activity card's `visual` (`ContextScenes.jsx`)
  shows the same objects as the lab below it, so card and laboratory tell one scene. Drawn, never
  generated (root `CLAUDE.md`).
- **Every count drawn is a count the student can read.** Nothing is truncated silently: beyond
  `maxGroups` the scene says « +n أخرى », and the leftover tray draws each object that fits
  nowhere, greyed. The e2e block « 9bis » counts them.
- **Same shell, same feedback.** The worlds change; the `ManipulationShell`, the drag engine, the
  refusal-with-a-reason, the hints, the discovery phase and the tabs do not.

DOM contract added for the e2e:

```
[data-grouping-scene][data-groups=k][data-works]  [data-group-card] × shown  [data-group-leftover][data-leftover-a][data-leftover-b]  [data-pile=a|b]
[data-brick-site] [data-site-zone=join|remove|measure][data-built]  [data-brick-wall] [data-wall-segment] [data-wall-partial]
[data-ribbons] [data-ribbon] [data-ribbon-segment] [data-ribbon-cut] [data-ribbon-ghost]
[data-coprime-groups] [data-coprime-insight]  [data-recipe] [data-recipe-portion]
```

## 3. Mathematics

All arithmetic comes from `packages/core/arithmetic/divisibility.js`. A component never computes a
GCD, a divisor list, or an algorithm trace itself. `logic/*.js` holds the *interaction* rules
(what may be dropped where, when the discovery is ready); it is pure and unit-tested in
`logic/logic.test.js` on the textbook's own numbers.

## 4. Drag and drop

`useDragInteraction` is the only gesture implementation.

- Pointer Events, `setPointerCapture`, `touch-action: none` — no page scroll while dragging.
- Below 6 px of movement the gesture is a **tap**: it picks up / puts down. Above, the object follows.
- The nearest valid zone within 56 px is **magnetised**: it lights up and receives the drop.
- A refused drop returns the object with a short shake and an **Arabic reason** (`accepts` returns
  the reason string). Never a silent red state.
- **Every drag has a non-drag alternative**: tap the object, then tap the zone. Keyboard: Enter/Space
  to pick up, Enter/Space on the zone to drop, Escape to release. This path is never removed.

## 5. Pedagogical flow

```
MISSION → OBSERVE → ACT → FEEDBACK → PATTERN → CONJECTURE → REPRESENTATION → FORMAL RULE → RETRY
```

`state.phase` is `act` → `discover` → `formal`. The type calls `state.discover()` only when the
relation is genuinely visible on screen (both verdicts seen, all three quantities built, the chain
finished…). `ManipulationDiscovery` asks for the conjecture first; the formal rule renders only
after the student has chosen it. **The final result may never appear before the discovery phase.**

## 6. Teacher mode

Two distinct things carry the name « وضع القسم »:

* the **class mode of a manipulation** (`ManipulationTeacherMode`, `state.mode = 'class'`):
  step-by-step reveal, replay, hidden conclusion, solution, number changes — described below;
* the **Classroom Mode of the platform** (`lessons/common/classroom/`, CLASSROOM_MODE.md): the
  projector presentation of any content — lesson, module, exercise or manipulation — with the
  browser fullscreen, a toolbar and a scale. Its entry button (« ⛶ عرض المناولة ») exists only
  for the roles listed in `CLASSROOM_PRESENTER_ROLES` (`canPresentClassroom`, core/auth.js) and
  does not touch the manipulation's mode or state. A manipulation inside a presented module or
  lesson shows no button of its own: there is only ever one session.

**The toggle is never shown to a student.** `allowModeSwitch` defaults to `false` in
`ManipulationShell` and in all nine shell types, so a lesson module renders وضع التلميذ only
(owner's rule, reaffirmed 2026-09-19). The mode itself stays implemented for a future
teacher surface, which will pass the flag explicitly; `manipulations.mjs` asserts that no
mounted manipulation exposes a mode button.

When it is enabled, class mode keeps every student gesture and adds: next step (the type's canonical gesture via
`controller.autoStep`), previous step when mathematically safe, replay/pause, hide the conclusion
(so the class formulates it), show the solution, and change the numbers **within the registry's
constraints plus the type's cross-constraint** (`validate`). A teacher can never enter values that
break the pedagogical sequence.

## 7. Levels and free lab

Four levels per type (`levels.js`): اكتشاف · موجّه · استقلالية · تحدّ, difficulty following the
cognitive demand. Every level cites a textbook element (`ref`), except at most one per type marked
`source: 'platform'`, rendered with «مثال تفاعلي إضافي». The free lab (`مختبر حر`) opens only after
the discovery, and its inputs are bounded by the registry's `changeNumbers` plus the type's own
`validate()`.

**Levels (`levels.js`) and the two-level workspace are different dimensions**, and both exist:
the four paliers are difficulty steps *inside* one manipulation (they drive the free lab and the
class mode), while مبتدئ / متقدم chooses *which manipulation the module shows* (§7bis-levels).

Levels are **presentation state only**: choosing one calls `setNumbers()`, which resets the
manipulation. Nothing about levels is persisted, no "levels completed" figure is computed, and
levels feed neither progression nor mastery. `divisor-explorer-books` declares four levels to
satisfy the registry test but cannot display them — it has no shell.

## 7bis-levels. The two-level workspace — مبتدئ / متقدم

> **The textbook tells us what the student must learn. Smarter Academy decides how they
> experience it.** Two fidelities, and only one of them is absolute.

### The rule

Where a manipulation is pedagogically appropriate, the module opens on **one workspace with two
levels**, never on two stacked manipulations and never on a second page:

```
┌──────────────────────────────────────────┐
│  الأنشطة التفاعلية   [ مبتدئ ] [ متقدم ]   │
├──────────────────────────────────────────┤
│           THE ACTIVE MANIPULATION         │
└──────────────────────────────────────────┘
```

`ManipulationWorkspace` (`manipulations/ManipulationWorkspace.jsx`) is the only implementation.
It defaults to **مبتدئ**, renders **both** levels at the same place in the React tree — the
inactive one carries `hidden`, exactly as `ContentModule` does for classroom units — and therefore
**never loses the student's state on a switch**: teams already formed, sizes already tried, the
phase already reached all survive. The one deliberate reset is `modelKey`: change it and both
panels remount, because the state would describe mathematics that is no longer on screen.

Its decisions live in `workspaceLevels.js` (pure, unit-tested): which tabs exist, which is active,
what the mount key is. `ManipulationLevelSelector` renders the tabs as a real `role="tablist"`,
with arrow-key navigation — in RTL, **← moves to the next level**, because the next tab is drawn
to the left.

### Mathematical fidelity vs contextual fidelity

| | Comes from | May the platform change it? |
|---|---|---|
| Concept, definition, property, method, notation, vocabulary, progression, objective | the textbook | **No.** Never. |
| The situation dressing it (books on shelves, players on a pitch) | the textbook, or the platform | **Yes**, when it preserves the mathematical structure and the objective |

A replaced context is **never silent**. Each levelled manipulation declares, in
`lesson.config.js`, where its mathematics comes from and what was done to the situation:

```js
{ kind: 'manipulation', code: 'team-builder-15-3', type: 'team-builder', module: 1,
  level: 'beginner',
  objective: 'التوزيع بالتساوي: a = b × q + r، والباقي معدوم ⇔ b قاسم لـ a',
  autonomy: '',                       // required, and non-empty, on 'advanced'
  experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'football' },
  learningPointIds: [...], sourceElementIds: ['act-1'] }
```

The vocabularies are closed and live in `packages/core/curriculum/manipulationLevels.js`
(`EXPERIENCE_TYPES`, `ADAPTATION_REASONS`, `VISUAL_THEMES`). `validate-lessons.mjs` **fails** when:

- a module declares one level but not the other;
- the two levels state different `objective`s — the context may change, the objective may not;
- an `advanced` level has no `autonomy` — *« beginner with bigger numbers » is not an advanced level*;
- a non-`textbook` experience carries no reason from the closed list, or an unknown theme;
- a levelled manipulation cites no textbook element.

Each failure was verified by deliberately breaking the config (2026-09-20).

### The default level serves the module's task

`ManipulationWorkspace` defaults to **مبتدئ**, and a module may override it with
`defaultLevel`. It **must** do so when the module carries a textbook activity: a module titled
« نشاط N » whose first step waits on `onFinished` has to *open* on that activity. Opening on the
practice number hides the lesson's own activity behind a tab the student must guess, and strands
them on a step they have nothing to satisfy — found across five modules on 2026-09-21, each of
which put `onFinished` on `advanced` while defaulting to `beginner`.

The smaller number is not lost: it becomes the warm-up, one tap away. The rule is simply that the
level the student lands on is the one the module asks them to do, and the lab's title names its
own numbers so they can tell which activity is open. `manipulations.mjs` block D asserts that each
workspace opens on the numbers in its module title.

### What each level is for

- **مبتدئ** — immediate understanding: small numbers, one obvious gesture, strong visual
  consequence, minimal load. The student acts *before* any formal notation.
- **متقدم** — genuine mathematical autonomy, **not** the same screen with bigger numbers:
  scaffolding removed, suggestions withdrawn, a case where the answer is "no", numbers too large
  to verify by counting, or a comparison the student must judge. That is what `autonomy` records.

> **Do not force a context.** When the textbook's own situation is already manipulable and the
> drawing *is* the argument — the rectangle of `factor-pairs`, the divisor lists of
> `common-divisors` at the advanced level of lessons 5 and 7 — keep it and only change the
> cognitive demand. A theme bolted onto a list of divisors makes the mathematics harder to see,
> not more engaging. The worlds of §2bis pass this test the other way round: they exist where the
> abstract drawing (a bar, a chip) showed *nothing* of the structure — bricks show « whole multiple
> of n », ribbons show « cut » and « lay along », groups show « identical » and « left over ».

### DOM contract (e2e)

```
[data-manipulation-workspace] [data-level=<active>]
[data-manipulation-level-panel=<id>] [hidden] on the inactive panel
[data-manipulation-levels-selector] [role=tab][data-level=…][aria-selected]
```

Because a type may serve **both** levels (the rectangle serves 24 and 60), an e2e selector must be
scoped to the visible panel — `.first()` otherwise resolves to a `hidden` element and the test
hangs. `manipulations.mjs` provides `pickLevel()` and `visibleManip()` for exactly this.

## 7bis. What a manipulation does NOT do

A manipulation is a learning instrument, not an assessment. Verified in code:

- **It writes nothing.** No localStorage, no API call, no evidence. The only manipulation state
  that outlives a remount is whatever the module holds.
- **`onFinished` is not completion.** Every shell type fires `onFinished` from an effect when the
  phase reaches `formal`, but the 4AM modules use it only to hide a hint line. It does not mark a
  step done, and a module step must never require it — that would gate progression on a gesture
  (`LESSON_CONTRACT.md`, non-blocking invariant).
- **Mistakes cost nothing.** A refused drop keeps the object in hand and explains why in Arabic; a
  wrong conjecture is replayable. Attempt counters exist in two logic files and are read by nothing.

## 7ter. Creating a new manipulation

Nine steps, in this order. Steps 1, 2 and 5 are enforced by tests that fail otherwise.

1. **Declare the type** in `packages/core/curriculum/manipulationTypes.js`:
   `'my-type': { shows: '<the idea it makes visible, in Arabic>', controls: { reset, nextStep,
   prevStep?, toggleExplanation, hideConclusion?, changeNumbers: false | { field: [min, max], … } } }`.
2. **Add exactly four levels** to `LEVELS['my-type']` in `levels.js`, each citing a textbook
   element, at most one `source: 'platform'`.
3. **Write the pure logic** in `logic/myType.js`: `init()`, guards `canX() → true | <reason key>`,
   transitions `X()`, and `discoveryReady()`. Arithmetic comes from
   `packages/core/arithmetic/divisibility.js`, never from the component. Add a `describe` block to
   `logic/logic.test.js` on the textbook's numbers.
4. **Write the component** in `divisibility/MyType.jsx`: the five questions in the file header,
   `useManipulation()` for pedagogical state, a local `lab` state re-initialised on
   `[numbers…, state.epoch]`, `useDragInteraction()` for the gesture, and `ManipulationShell` +
   `ManipulationStage` + existing primitives for the rendering. Never re-implement a gesture, a
   tile or a drop zone.
5. **Register the component**: `'my-type': lazy(() => import('./divisibility/MyType'))` in
   `manipulationRegistry.js`. `manipulationRegistry.test.js` asserts the two halves agree.
6. **Add the Arabic strings** to `i18n/locales/ar/lesson.json` under `manipulation.<ns>.*`
   (title, mission, hints, discovery prompt and options, explanation, and one key per reject
   reason). Never hardcode Arabic in the component.
7. **Declare it as lesson data**: `resources[]` in `lesson.config.js` with
   `{ kind: 'manipulation', code, type, module, title, learningPointIds, sourceElementIds }`, then
   render `<Manipulation type="my-type" … />` in the module's `intro` slot.
8. **Extend the e2e** `manipulations.mjs` with the drag, the tap alternative, the keyboard path,
   reset, and the no-mode-toggle assertion.
9. If the manipulation must **draw a real object**, extend parameterised inline SVG (see the `Book`
   component) and put any exact geometry in a pure, unit-tested module (see
   `booksClassroomLayout.js`). Never a raster image — root `CLAUDE.md`.

**Reuse before you write.** The ten types are reused across the unit by changing props alone
(`factor-pairs` serves 60, 48 and 105; `common-divisors` serves four lessons). Write a new type
only when the mathematical idea or the gesture genuinely differs; go standalone (no shell) only
when the drawing itself carries the argument, and accept that you lose levels, hints, discovery and
the free lab.

## 8. Arabic, RTL, mobile, motion

Interface RTL in Cairo; every numeric block (`dir="ltr"`): tiles, bars, equations, divisions,
chains. `PGCD` stays Latin, as in the textbook. Full RTL rules:
`ARABIC_RTL_CONTRACT.md`. Touch targets ≥ 44 px for controls; note that
`NumberTile size="sm"` — used by most rails — is **40 px**, and the mobile e2e
asserts ≥ 40 px accordingly. Layout works from 320 px:
controls above the stage (they must not move under the finger), vertical composition on phones.
All motion is transform/opacity, and `prefers-reduced-motion` removes it without changing any final
state.

## 9. Checklist — every manipulation, every review

```
[ ] Student physically manipulates something meaningful
[ ] Drag/touch works (pointer events, no page scroll)
[ ] Non-drag alternative exists (tap-tap and keyboard)
[ ] Mathematical state updates immediately
[ ] Symbolic representation follows the action
[ ] Discovery precedes formalization
[ ] Wrong actions receive a useful Arabic reason
[ ] Hints are progressive and never give the answer
[ ] Reset works (and clears the type's own state via `state.epoch`)
[ ] Teacher mode works (step, replay, hide, solution, numbers)
[ ] Classroom Mode (if wrapped): enter/exit keeps the state, fits the screen, no page scroll
[ ] Student mode works
[ ] Mobile works (320 px, ≥44 px targets, no horizontal scroll)
[ ] RTL works
[ ] Mathematical notation is LTR where needed
[ ] Reduced motion works
[ ] No unnecessary animation
[ ] No decorative interaction
[ ] Uses textbook examples (levels.js cites the extraction)
[ ] Uses core arithmetic functions
[ ] Mathematical result is tested (logic/logic.test.js)
```

## 10. Tests

- `packages/core/arithmetic/equalGrouping.test.js` — the equal-sharing model behind the library
  and the pitch: partition vs quotition, and a remainder that is always a number of objects.
- `divisibility/teamFormation.test.js` — the formation geometry, **swept over every reachable
  squad size** (no overlap, nothing outside the pitch) rather than sampled at the default.
- `workspaceLevels.test.js` — the workspace's decisions: default level, always an active level,
  and a mount key that changes only when the mathematical model does.
- `primitives/groupingLayout.test.js` — the drawn grouping says what the division says (9 bouquets
  of 90 and 54, 17 and 18 in k bags for every k, 84/48 in 4 portions), the resume beyond
  `maxGroups`, and that every drawn theme is a registered `VISUAL_THEMES` id.
- `primitives/brickLayout.test.js` — walls in bricks of n: sum, difference and remainder are whole
  walls for every case of activity 3 and for 900/90/9; a wall that does not fall exactly keeps its
  partial brick; bricks cover the length with no gap or overlap.
- `logic/logic.test.js` — mathematics, allowed/refused actions, discovery conditions, final states,
  on the textbook numbers (420/26/28, 60, 105, 18-12-3, 90/54, 42/60, 252/140, 765/135, 1938/836,
  17/18, 27/36, 84/48, 595/560).
- `apps/web/e2e/lesson-kit/manipulations.mjs` — real pointer drags, the tap alternative, keyboard,
  reset, hints, levels, mobile at 320 px, reduced motion, the absence of any mode toggle, the
  Classroom Mode blocks (C1–C3) on the books lab, and the **two-level workspace** blocks
  (W1–W3): default level, both tabs, the inactive panel `hidden`, drag/tap/keyboard on the
  football lab, the explained refusal, `15 = 3 × 5` then `16 = 3 × 5 + 1` with one player drawn
  outside, discovery opening only after both cases, state surviving a level round trip, arrow-key
  navigation, and the pitch keeping its 2:3 proportions at 320 px.
  Block **9bis** (2026-09-21) counts the drawn worlds: 144 objects in the two piles, 9 bouquets
  of 16 drawn flowers, 4 leftover flowers drawn on the tray, the coprime insight after 1/2/3
  bags, 4 portions of 33 in the recipe, three built zones with no partial brick, the scissors
  mark and 252 − 140 = 112.
  **139/139 green on 2026-09-21**, with `4am-aadad-tabiiya-natiqa.mjs` at 27/27.
  Run it against the **dev** server: `KIT_BASE=http://localhost:5173 node
  apps/web/e2e/lesson-kit/manipulations.mjs`. The helper's default is 5183,
  which is `vite preview` serving a stale build with no API — several suite
  headers still print 5183, and that is a documentation bug, not a setting.

  **Not covered, despite what the suite header says:** class mode
  (`ManipulationTeacherMode`) is never exercised, and the "result never appears
  before اكتشف" invariant is only spot-checked in the Euclid block — there is no
  general assertion on `data-phase`.
