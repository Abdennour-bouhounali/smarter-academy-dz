# Manipulation Contract — tactile mathematical laboratories

> One manipulation = one mathematical idea made **physical**. The student acts; the notation follows.
> Scope: `apps/web/src/lessons/common/manipulations/`. Types are registered in
> `packages/core/curriculum/manipulationTypes.js` (closed registry, no code from content).
>
> **Why** a manipulation is built this way — causality, interaction distance, resistance,
> contrast, the design sheet, anti-template rules — is `MANIPULATION_DNA.md`, which sits
> above this contract. This file says **how** it is built in code.

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
├── ManipulationControls.jsx    student: إعادة · تلميح · [auto-complete] · تحقّق · الشرح
├── ManipulationAutoComplete.jsx the student's « compléter automatiquement » button + useAutoComplete (§6bis)
├── autoComplete.js             PURE decisions of that button: status, animation plan (unit-tested)
├── ManipulationTeacherMode.jsx class mode: step, replay, hide answer, show solution, change numbers
├── ManipulationHint.jsx        hints (never the answer) — CLOSED by default since 2026-10-14, « تلميح » shows them all (DNA §17.7)
├── ManipulationDiscovery.jsx   conjecture → formal rule (never before the action)
├── ManipulationFreeLab.jsx     مختبر حر (constrained) — NOT a level
├── ManipulationWorkspace.jsx   ONE workspace, two levels (مبتدئ / متقدم) — §7bis-levels
├── ManipulationLevelSelector.jsx  THE level selector: two tabs مبتدئ / متقدم (role=tablist, arrow keys, RTL-aware)
├── workspaceLevels.js          PURE decisions of the workspace (unit-tested)
├── workspaceContext.js         WorkspaceLevelContext — tells a manipulation it sits in a workspace
├── useManipulation.js          numbers · phase · hints · level · mode · epoch
├── useStepSequence.js          bounded step cursor
├── useDragInteraction.js       CARRY gesture: pointer drag + magnet + reject + edge auto-scroll + keyboard/tap
├── useStretchInteraction.js    STRETCH gesture: a magnitude that follows the finger (slider semantics, −/+)
├── levels.js                   the TWO levels per type { beginner, advanced } + resolveManipulationLevels (§7)
├── logic/                      PURE interaction logic per type (unit-tested, no React)
├── themeWords.js               the Arabic words of a theme (lesson.manipulation.json) merged with a lesson's `context`
├── primitives/                 shared building blocks, never duplicated by a type
│   ├── PlayerFigure.jsx + PitchBackdrop.jsx   a drawn footballer and a real-proportioned pitch (2:3)
│   ├── BookFigure.jsx + BookRectangle.jsx     the library's book, and n of them in shelves of `cols`
│   ├── ItemFigure.jsx + itemThemes.js         the drawn objects of the other worlds (flower, ball,
│   │                                          shirt, pen, notebook, spoon, cup) and which theme draws which
│   ├── GroupingScene.jsx + groupingLayout.js  a and b objects in k identical groups, the rest apart
│   ├── BrickWall.jsx + brickLayout.js         a length built in bricks of n (walls of lesson 3)
│   ├── RibbonStrip.jsx                        a length drawn as a notched ribbon (the tailor's workshop)
│   ├── DivisionRoles.jsx                      b · q · r named in the scene's words (partition vs quotition, §2ter)
│   ├── LabFold.jsx                            « إخفاء / إظهار » for a secondary block of a large lab (§8bis)
│   ├── LabKit.jsx                              the visual kit: PromptCard, ChoiceCard, StepperCard, NamePill, VerdictBanner… (§8ter)
│   ├── SvgPill.jsx                             value pills and dimensions inside a scene (§8ter)
│   ├── KidFigure.jsx + kidFigure.js            THE character: a drawn pupil, girls in hijab, crown = height (§8ter)
│   ├── FlowerFigure.jsx                        a flower, a bouquet sleeve and its ribbon tie (division-jumps)
│   ├── HopperFigure.jsx                        a drawn rabbit that hops on a number line (division-jumps)
│   ├── BulbFigure.jsx                          a light bulb lamp, closed / yes / no (digit-cards)
│   ├── CakeFigure.jsx                          a round cake seen from above `Cake` (sector slices, knife cuts, ghost) + `sectorPath` (fair-share, §2duovicies)
│   ├── EggFigure.jsx                           an egg, an open tray / carton with exactly r eggs, a closed lid, a full slat, a pallet (egg-trays, §2unvicies)
│   ├── MovablePanel.jsx + movablePanel.js     a panel floating on the scene that the student moves aside (§8bis)
│   └── ContextScenes.jsx                      the landscape vignettes of each world, for `MissionBrief.visual`
├── divisibility/               the 10 types of unit 1 (+ teamFormation.js, pure geometry)
├── roots/                      the 3 types of unit 2 « الحساب على الجذور » (2026-09-30) — §2quater
├── algebra/                    the 2 types of unit 3 « الحساب الحرفي » (2026-10-01) — §2quinquies
├── equations/                  the 4 types of unit 4 « معادلات ومتراجحات » (2026-10-01) — §2sexies
└── systems/                    the 3 types of unit 5 « جمل معادلتين » (2026-10-01) — §2septies
```

`divisibility/DivisorExplorerBooks.jsx` (`divisor-explorer-books`, Module 1 of
`qasim-adad-tabii`, متقدم, and the 143 worked example of معارف) is **the shelf the
student stretches** (redesigned 2026-09-30, `MANIPULATION_DNA.md` §7). Until then it was a
standalone component with 17 size buttons, its own styles, no hints and no discovery;
it now goes through `ManipulationShell` like the other types. The student drags the
**bookend** of a model shelf (`useStretchInteraction`, `role="slider"`; keyboard arrows,
−/+ buttons or a tap on the ruler do the same). The shelf length **is** b, and every shelf
takes it. The `total` books re-shelve **during** the gesture into q full shelves, and the r
that remain lie in a **ghost shelf** whose b − r dashed slots show what is missing. The
arithmetic and the geometry live in `logic/bookshelf.js`: `arrange` (core `groupBy`),
`commit` (a trial is validated on release or after a keyboard pause), the discovery
predicates, `counterExamples` and `bookcaseLayout`. Every book is drawn once, one spine per
book, and shelves are laid out in columns that fit the width, with no inner scroll box.
Props: `total`, `min`/`max` (the ruler), `marks` (the textbook's numbers, orientation only),
`discovery="remainder" | "symmetry"`, `levels={false}` for a worked example (§7). Its
contract with the module is `onVerdict({ b, divides, quotient, remainder })`, fired on each
validated trial through `state.report`, and `onFinished` on the formal phase. It stays a
consumer of the platform **Classroom Mode**: it is wrapped in `ClassroomPresentation
scope="manipulation"`, the entry button sits in the shell header (`headerAction`), and the
presentation layout puts the shelf and the bookcase side by side and sizes the book unit to a
measured height budget (`CLASSROOM_MODE.md` § Manipulation). The old grid solver
(`booksClassroomLayout.js`) was removed with the buttons.

**Rule:** a type composes primitives and calls `logic/`. It never re-implements a gesture, a
tile, a drop zone, or a piece of mathematics.

**One unit, one set of objects.** Types that share a lesson's story draw the *same* objects:
`divisor-explorer-books` shelves 420 books and `factor-pairs` lays the same books out as
rectangles (`BookRectangle`), both coloured from `primitives/BookFigure.jsx`'s `BOOK_PALETTE`,
so the student recognises the library from one module to the next instead of learning a
second abstraction. (The palette was duplicated in the old standalone lab and locked by a
test; the duplication and the test are gone since 2026-09-30.)

## 2quater. The square-root laboratories (unit 2, 2026-09-30)

Unit 2 « الحساب على الجذور » needed mathematics no unit-1 type touches, so three types were added by
the §7ter recipe. All three use the **stretch** gesture (`useStretchInteraction`, `direction: 'ltr'`
because a length and a number line read left to right), compare squares **in integers** through
`packages/core/arithmetic/squareRoots.js` (never a float equality: a side is an integer `v` on a
graduation `1/scale`, and `v² × den` is compared to `num × scale²`), and are **manual** (§6bis — each
position is a trial or an answer). Pure logic: `logic/squareRootSide.js`, `logic/squareFold.js`,
`logic/squareTiling.js`, tested in `logic/squareLabs.test.js` on the textbook's numbers (sweeps
included). Strings: `lesson.manipulation.json › squareRoot | squareFold | squareTiling`; every formula
in a string is a `$…$` island, and the components render hints, options, notes and explanations
through `MathText`.

| Type | The hand holds | Resistance | Discovery (contrast) | Lessons |
|---|---|---|---|---|
| `square-root-side` (`roots/SquareRootSide.jsx`) | the end of a square's side on a graduated ruler; the square grows on a unit grid beside the dashed target square | `refine`: « دقّق » (zoom the ruler ×10) opens only once the student has bracketed the side BY HAND at the current graduation; for 5 every graduation is too small or too big. `graduation`: a card « resists » after 3 graduations bracketed without a hit | `refine`: the side falls exactly (36 → 6) **or** the bracket reached 1/1000 with no hit (5) — the formal part names √5, shows `calculator`'s exact square (2,236067978² = 5,000000002…) and, with `figure="bc-square"`, the tilted square of area 9 − 4 × 1 = 5 on BC. `graduation`: one card exact **and** one resisting → « √a is rational ⇔ a is the square of a rational » | L1 (refine), L2 (graduation) |
| `square-fold` (`roots/SquareFold.jsx`) | x on a number line; an arrow carries it to x² on the line of squares, whose negative half is hatched | pinning a solution for a < 0 is refused (« x² لا يكون سالبًا »); a wrong x is refused with its exact square; « لا حل » for a ≥ 0 is refused. For √3 the nearest graduation is accepted and **√3** (not 1,7) is pinned | a solved card with a > 0 (two pins), a = 0 (one) and a < 0 (« لا حل ») → the three cases of خاصية 2. Optional `table` fills the textbook's x ↦ x² table from the student's own positions | L3 |
| `square-tiling` (`roots/SquareTiling.jsx`) | k, the number of square tiles per side of a square of area n | k² ∤ n: the tiling is dashed and refused with `n ÷ k²` read exactly (72 ÷ 25 = 2,88) | `product`: two valid tilings with k > 1 and one refusal → √(k² × b) = √(k²) × √b = k√b. `simplest`: the largest k and another valid k → the largest square dividing n gives the smallest b | L4 (product), L5 (simplest) |

Props: see the component headers (the design sheet of `MANIPULATION_DNA.md` §7 is filled in each).
`square-root-side` and `square-tiling` report each validated trial through `onTrial` (via
`state.report`), so a module can list the student's own trials above a question (DNA §9).
`square-tiling` `simplest` needs, besides the largest valid k, either another valid k > 1 or — for a
number with a single non-trivial tiling (18, 8, 50) — a larger k tried and refused.
`square-root-side` posed ALONE in `graduation` mode has no second level (its `levels.js` pair is a
refine pair); in a workspace the lesson declares both levels as usual.

## 2quinquies. The algebra laboratories (unit 3, 2026-10-01)

Unit 3 « الحساب الحرفي » (expansion, identities, factorisation) needed a variable that is a LETTER:
two types were added by the §7ter recipe, one per direction of the same reading — a product of two
sums is the AREA of a rectangle whose sides are those sums (the textbook's own argument: the
squares MNPQ / KLMN p. 32–33, Descartes' table p. 31). The world is the **football pitch** (`theme:
'football'`, owner's choice for the unit): a rectangle the student reads as a pitch, never a bar.
Exact arithmetic: `packages/core/arithmetic/polynomials.js` (integer-coefficient terms `{c, p}`,
`partialProducts`, `reduce`, `expand`, `commonMonomial`; `polynomials.test.js` sweeps x ∈ [−20, 20]).
Pure logic: `logic/pitchExpansion.js`, `logic/turfFactoring.js`, tested in `logic/algebraLabs.test.js`
on the textbook's numbers (geometry swept over every x of the ruler: the signed zones always cover
exactly the pitch's area); `algebra/algebraLabs.render.test.jsx` renders every kind and mode.
Strings: `lesson.manipulation.json › pitchExpansion | turfFactoring`. Both are **manual** (§6bis —
each carried zone, merge, row count or strip placement is a decision).

| Type | The hand holds | Resistance | Discovery (contrast) | Lessons |
|---|---|---|---|---|
| `pitch-expansion` (`algebra/PitchExpansion.jsx`) | **x** (stretch: the pitch grows, every zone follows); each ZONE (carry, from the pitch or from the Descartes table under it) into « المجموع »; a term onto a LIKE term (carry) to merge | unlike terms refuse to merge (« $x^2$ مساحة مربّع و $x$ مساحة شريط »); « تحقّق » compares the pitch's area with the carried sum FOR THE x ON SCREEN — a forgotten zone lights up with its area (the two $ab$ bands of the error $(a + b)^2 = a^2 + b^2$); opposite terms cancel | every zone carried, the sum reduced, the equality verified for **two values of x** → the identity holds for every value (متطابقة). Kind from `expr`: `distributive`, `double`, `square-sum`, `square-diff`, `sum-diff` | L1 (`3\|x+5`, `3x-1\|3+x`, `2x-1\|x+4`), L2 (squares and `x+3\|x-3`), synthesis (`x+10+x`, the pool) |
| `turf-factoring` (`algebra/TurfFactoring.jsx`) | `rows`: **r**, the number of IDENTICAL rows the turf pieces ($x^2$, $x$, 1, hatched when subtracted) are shared into (stretch). `square`: each STRIP (carry) to the right of or below the $x^2$ square, then « أغلق الملعب » | `rows`: pieces that cannot be shared fall OUTSIDE the pitch (r ∤ a coefficient). `square`: the corner needs right × bottom unit squares — « الركن يحتاج 8 ولديك 9 »; $x^2 + 25$ never closes | `rows`: the largest valid r (the gcd of the coefficients — the PGCD of unit 1) tried AND a refusal → $ka + kb = k(a + b)$, the pitch's height is the common factor. `square`: a SQUARE closed (p = q) and a refused split → $a^2 + 2ab + b^2 = (a + b)^2$; a sum that never closes → « لا تقبل تحليلا » | L3, synthesis |

`expr` syntax (`pitch-expansion`): two factors `"f1|f2"`, a single factor means its square; terms of
degree ≤ 1 with integer coefficients; a side may have three segments (`x+10+x`). Negative terms are
drawn as REMOVED (hatched) strips inside the positive length and a double-removed corner as RESTORED
(cross-hatched) — the textbook's figure of $(a - b)^2$. The ruler runs from the first x that draws both
sides (`x-2` starts at 3), runs `span` steps (prop, default 5, opening two steps in; L1's beginner uses 9 so x = 9 — the textbook's 3 × (9 + 5) — is reachable) and stops at the last drawable value (`5-2x` stops at 2); a factor positive for no x
throws (content error). `turf-factoring` `square` has no level selector of its own; `showNeed={false}`
hides the corner's live need for a more autonomous level. Both report each validated trial through
`onTrial` (via `state.report`), so a module can list the student's own trials above a question.

**Decorative layer (owner request, 2026-10-01).** Besides the mathematical gestures, the pitch carries
a deliberately DECORATIVE interaction: mowing stripes, goals and a ball the student may tap; the ball
rolls to the last carried zone and into the goal when an equality is verified. It carries no
information, is `aria-hidden`, outside the keyboard path (`tabIndex=-1`), never changes a lab state,
and is frozen by `prefers-reduced-motion`. This is the one sanctioned exception to « no decorative
interaction » (§9 checklist) — keep it confined to the drawn world, never on a mathematical object.

## 2sexies. The equation and inequality laboratories (unit 4, 2026-10-01)

Unit 4 « معادلات ومتراجحات من الدرجة الأولى بمجهول واحد » added four types by the §7ter recipe, one per
concept, each holding a DIFFERENT variable and gesture (DNA §6: equality = balance, product = area, inequality =
move a boundary, modelling = two quantities growing). All four compute through ONE exact module,
`packages/core/arithmetic/linear.js` (fractions `{n, d}`, `linear('4x-3')`, `solveEquation`, `solveInequality`
with `flipped`, `applyBoth` refusing ×0, `factors('x-2|x+5')`, `productAt`; `linear.test.js` sweeps the
textbook's equations, inequalities and products), and live in `manipulations/equations/` with their logic in
`logic/<name>.js` + `logic/<name>.test.js` (their own test files) and a render test
`equations/<name>.render.test.jsx`. Strings: `lesson.manipulation.json › equationBalance | vanishingPitch |
solutionRay | growthRace`. All four are **manual** (§6bis — every gesture is a decision or an answer), report
validated trials through `onTrial` (via `state.report`), and carry the owner's decorative layer (below).

| Type | The hand holds | Resistance | Discovery (contrast) | Lessons |
|---|---|---|---|---|
| `equation-balance` (`EquationBalance.jsx`) | the CONTENTS of the two pans of a drawn Roberval balance: closed bags (+x, hidden), footballs (+1), helium balloons (−1, floating), flying bags (−x) — carried from the reserve onto a pan or back (carry, tap-tap: touching an object of the target pan with a reserve piece held aims at that pan), then k, the number of equal groups per pan (stretch) | the beam tilts by the TRUE hidden x as soon as one pan changes; while it tilts only the same effect (or its undo) is accepted — « الميزان مال: ما فعلته بكفّة افعله بالأخرى »; carrying a piece straight across is refused (`moveAcross`, the « transposition without sign change » error made physical); k groups refused when bags do not share evenly (leftover bag drawn) or when units would have to be cut | a tilted state seen, the balance solved (one bag alone) AND the substitution check (« افتح الأكياس ») → « نجري العملية نفسها على الطرفين »; each both-sided step writes the textbook's line (`9x + 1 - 1 = -26 - 1`, « أي 9x = −27 »); fractional values drawn as ball sectors (9/2, −1/7) | L1 (`3x+2=11`, `9x+1=-26`; معارف `4x-3=2x+6`, `levels={false}`) |
| `vanishing-pitch` (`VanishingPitch.jsx`) | **x** on a ruler (stretch); the pitch's two SIGNED sides are the factors A and B drawn from a corner (a negative side goes past the corner, dashed, « ضلع سالب »; a negative area hatched); then « ثبّت هذا الحل » (pin) and « لا حلول أخرى » | a pin where the area is not 0 is refused with the area read exactly (`(−1) × 6 = −6 ≠ 0`); « لا حلول أخرى » refused while a zero is missing or the ruler has not been swept on both sides; the graduation is the LCM of the roots' denominators so every zero IS a graduation (no rounding) | a refused pin, every zero pinned and the claim accepted → $A \times B = 0 \iff A = 0$ أو $B = 0$; at مبتدئ the constant side 3 never collapses (one solution, « لأنّ 3 ≠ 0 »); `expr` = `f1\|f2`, a single factor = its square (one zero), decimals kept as decimals | L2 (`3\|x-5`, `x-2\|x+5`; معارف `3x-4\|-2x+1`, طرائق `2x+1`) |
| `solution-ray` (`SolutionRay.jsx`) | a PROBE x on a graduated line (stretch): the two sides shown live with the verdict, each validated position leaves a trace — RED when true (the textbook's colour for solutions), grey otherwise; then the BRACKET (second stretch track, side and « موجّه / غير موجّه نحو الجزء الملوّن »); at متقدم, transformation CARDS in the textbook's order and the relation of each new line | the bracket opens after one red and one grey trace and is refused with a witness number taken first from the student's own traces (`checkBracket`; on whole graduations x ≤ 2 and x < 3 coincide, so the witness may be 2,5); a new line whose direction is wrong is refused with a red trace (« نقاطك الحمراء على يمين −5 … ») — ÷(−3) kept as ≤ contradicts the student's own evidence | مبتدئ: the bracket rule (turned toward the red part ⇔ the bound is a solution); متقدم: one step keeping the direction and one negative scaling flipping it → « نغيّر الاتجاه عند الضرب أو القسمة على عدد سالب »; the invariant « equivalent lines keep exactly the same traces » is swept over 7 inequalities | L3 (`x<3`, `-3x+5<=20`; module 1 `2,5x+100<=150` in the phone context, whole x, `levels={false}`, no bracket stage) |
| `growth-race` (`GrowthRace.jsx`) | BUILD: « + x » / « × x » tokens carried onto each story element (people, price cards) — the expression of each side assembles live; RACE (opened by the student, §7quater, with a way back): **x** whole ≥ 0 on a timeline (stretch), the two quantities drawn as growing figures / stacked columns | « تحقّق » refuses a model contradicting the story, element by element, in the story's words (a child who did not age: MISC-TARRID-MAJHUL-WAHID; a per-session price paid once; the yearly card paid every session: MISC-WADIYA-TARJAMA) | the meeting point plus one trial before and one after (a solution between graduations needs both neighbours; a negative / no solution needs three trials including x = 0) → the textbook's lines (36 + x = 3x + 18 …), التحقق, then the inequality beyond (« ابتداءً من 9 حصص ») | L4 (`30+x` vs `2(6+x)`, `36+x` vs `4+x+6+x+8+x`, theme `family`), synthesis (`75x` vs `560+5x`, `goal="greater"`, theme `pool`) |

`growth-race` props (contract written in the component header): `left`, `right` (linear in x as written in the
model; `k(…)` products of a constant and a sum allowed, the STRUCTURE — which element carries which x — is kept
for the build stage), `theme` (`ages` | `pool`; the token's operation comes from the expressions, not the
theme), `domain` (`natural`), `goal` (`equal` | `less` | `greater`), `maxX`, plus `context={{ leftTitle,
rightTitle, names, question }}` (a lesson's own words), `onModel`, and `startWith="race"` (the model already
placed, like `common-divisors`' `startWith="lists"`). A lesson that reuses it keeps the props in its
`content/textbook.js` (`LAB = { beginner, advanced }`) and mounts the same object in a render test.

**DOM contracts** (e2e `apps/web/e2e/lesson-kit/4am-muadalat-mutarajihat.mjs`, 25 lab checks by real gesture):
`[data-equation-balance][data-eq][data-tilt][data-solved]`, `[data-balance-pan=L|R]`, `[data-drag-source="p:<side>:<kind>" | "r:<kind>"]`,
`[data-balance-divide] [data-stretch-handle]`, `[data-balance-divide-go]`, `[data-balance-groups][data-ok]`, `[data-balance-step]`,
`[data-balance-notice]`; `[data-vanishing-field][data-collapsed][data-sign]`, `[data-vanishing-ruler]`, `[data-vanishing-pin-button]`,
`[data-vanishing-pin]`, `[data-vanishing-refused]`, `[data-vanishing-claim]`; `[data-solution-ray][data-mode=region|bracket|flip]`,
`[data-ray-probe]`, `[data-ray-tried] [data-tried-x][data-ok]`, `[data-ray-bracket][data-placed]`, `[data-ray-bracket-handle]`,
`[data-ray-side]`, `[data-ray-toward]`, `[data-ray-fix]`, `[data-ray-card]` (one card at a time), `[data-ray-choice=<rel>]`,
`[data-ray-step=ok|ko]`; `[data-growth-race][data-theme][data-stage=build|race]`, `[data-drop-zone="el:<id>"]`, token `[data-drag-source="tok"]`,
`[data-gr-check]`, `[data-gr-verdict=ok|ko]`, `[data-gr-open-race]`, `[data-gr-ruler]`, `[data-gr-columns][data-rel]`.

**Layering over a drawn scene** (balance): the carry zones sit UNDER a `pointer-events-none` SVG and the
transparent source overlays ON TOP of it, so the shared `DropZone`'s resting background never hides the drawing;
a covered pan is aimed at by touching one of its objects with a piece held (the unit-3 « toucher-toucher »
interception, MANIPULATION_CONTRACT §4.1).

**Decorative layer (owner request, renewed 2026-10-01).** Each lab keeps, beside its causal gestures, a
decoration of its world — a ball that bounces on the locker-room floor (balance), the pitch's ball that drops
onto the line when the pitch collapses (vanishing pitch), Younes's phone that shakes or a linesman's flag at the
bracket (ray), a birthday candle or the pool's ripples (race): `aria-hidden`, `tabIndex={-1}`, never a lab state,
frozen by reduced motion — the exception of §2quinquies, not a licence to animate mathematics.

## 2septies. The system laboratories (unit 5, 2026-10-01)

Unit 5 « جمل معادلتين من الدرجة الأولى بمجهولين » added three types by the §7ter recipe, in `manipulations/systems/`
(logic `logic/<name>.js` + tests, render test `systems/<name>.render.test.jsx`, strings `lesson.manipulation.json ›
manipulation.pairScoreboard | eliminationCards | storyModeller`). All three compute through ONE exact module,
`packages/core/arithmetic/linearSystem.js` (on `linear.js` fractions: `eq2('2(x - 5) = y - 3')`, `system`,
`classify` → unique / none / infinite, `pairHolds`, `isolate`, `substitute`, `scale` refusing ×0, `addEqs`,
`eliminated`, `eliminationFactors`, `eqLatex`, `pairLatex`; `linearSystem.test.js` sweeps every system of the
textbook). The Math Lab keeps its own engine (`features/mathlab/tools/algebra/systems.js`, another bundle). A level's
jumla is written `numbers: { system: 'eq1|eq2' }`; `levels.test.js` measures its demand (non-unit coefficients,
parentheses, decimals, a non-integer solution, size of constants). All three are **manual** (§6bis), report through
`state.report`, carry a decorative layer of their world, and were the first labs built and MEASURED under the
one-screen rule (§8bis): e2e `apps/web/e2e/lesson-kit/4am-jumal-muadalatayn.mjs` checks figure + controls within the
viewport at 1280 × 800, 1366 × 768, 390 × 844 and 320 × 640, both levels.

| Type | The hand holds | Resistance | Discovery (contrast) | Lessons |
|---|---|---|---|---|
| `pair-scoreboard` (`PairScoreboard.jsx`) | BOTH numbers of the pair, one stretch handle each (−/+ and keyboard); « اقلب » swaps the pair | two gauges, one per equation, read the substitution live in the textbook's form (`2(13 − 5) = 16`, `19 − 3 = 16`); « هذه الثنائية حل للجملة » refused while only one lights (`onlyOne` / `none`); a swapped pair is a refused trial | an accepted pair AND a one-gauge trial → « في آن واحد »; the formal phase shows the system written, reduced, its pair and the order rule | L1 (`x+y=10\|3x+y=22` season card `football`; `x+y=32\|2(x-5)=y-3` the textbook's agents `staff`, 5 men and 3 women retiring greyed; the تحدّ `coins`) |
| `elimination-cards` (`EliminationCards.jsx`) | two equation CARDS in tiles: pull an unknown's tiles into the tray to isolate it, then CARRY the expression onto that unknown's tiles on the other card (التعويض); stretch ×k (−6…6, both sides together) and lay one card on the other (الجمع) | the expression on its own card is refused with what it would give (« 7 = 7 »); stacking when nothing cancels is refused with the sum written; ×0 wipes the card and is refused; the found value is carried back and the lab ends only with (x ; y) checked in both equations | discovery opens once BOTH methods (the textbook's student 1 and student 2) gave the same pair | L2 (`x+y=10\|x-y=2`; act-2 `2x+y=7\|3x-2y=4,2`, world `snack`) |
| `story-modeller` (`StoryModeller.jsx`) | the textbook's 5-step table as stages: carry x / y onto the story's nouns (`named` pre-places them), the story's numbers (chips, plus a reusable « 1 ») into `□x + □y = □`, choose التعويض / الجمع (lines from `linearSystem`), carry the values to the story's gates | « تحقّق » replays each fact with the student's equation and refuses in the story's words (`moneyInCount` = MISC-JUMLA-TARJAMA, `swapped`, `totalAsCoef`, `coefAsTotal`, `incomplete`…); « انتهيت » after one unknown refused (MISC-JUMLA-NISF-HALL); the REPLAY flags a non-natural count | a refused model beside the accepted one; swapped values still give 140 visitors but the money total betrays them → only the second fact orders the pair | L3 (stadium derby `x+y=20\|300x+150y=4800`; museum act-3 `x+y=140\|300x+150y=30300`), synthesis (`theme="party"`, two `money` facts 150x + 150y = 11 250 and 24x + 30y = 2 100) |

`story-modeller` props (header of the component; the synthesis keeps its own in `content/textbook.js › LAB` and mounts
them in `lab.render.test.jsx`): `system`, `theme` (`stadium` | `museum` | `party`), `unknowns=[{ id, noun }]`, `named`,
`facts=[{ quote, kind }]` (`kind` never tied to the order), `chips=[{ value, label }]`, `story`, `answer={ options,
correct }`, `startWith` (`model` | `solve`), `onModel({ system, tex, unknowns })`, `onSolved({ x, y, method })`,
`onTrial`, `onFinished`. Missing props fall back to the theme's built-in story; a target number no chip carries, or a
system without a unique solution, throws at render. On phones the chip reserve is a 3-column grid (`Reserve grid`).

**DOM contracts** (e2e above): `[data-pair-scoreboard][data-world][data-x][data-y][data-solved][data-layout]`,
`[data-pair-glance]` (the one-sight block), `[data-pair-handle=x|y]`, `[data-pair-less|more=x|y]`, `[data-gauge=1|2][data-ok]`,
`[data-pair-claim]`, `[data-pair-refused=onlyOne|none]`, `[data-pair-trial][data-ok1][data-ok2][data-swapped]`, `[data-pair-cell]`;
`[data-elimination-cards][data-method=""|sub|add][data-stage=cards|one|back|done]`, `[data-eq-card=1|2][data-scale]`,
`[data-eq-tile=x|y|c]`, `[data-scale-handle=n]`, `[data-drag-source="card:n"|"iso:n:v"|"expr:n"|"val"]`,
`[data-drop-zone="card:n"|"tile:n:v"|"tray"|"back:n"]`, `[data-ec-refused]`, `[data-ec-current]`, `[data-ec-line]`,
`[data-ec-annihilate]`, `[data-ec-result][data-x][data-y]`; `[data-story-modeller][data-theme][data-stage=name|model|solve|verify|answer]`,
`[data-sm-core]` (the measured instrument), `[data-sm-noun]`, `[data-drag-source="unk:x"|"chip:<k>"|"val:x"]`,
`[data-drop-zone="noun:<id>"|"slot:<1|2>:<a|b|c>"|"gate:<id>"]`, `[data-sm-check]`, `[data-sm-verdict]`, `[data-sm-row][data-reason]`,
`[data-sm-method]`, `[data-sm-line]`, `[data-sm-replay][data-ok]`, `[data-sm-crowd][data-cols]`, `[data-sm-answer]`; all three
`[data-deco]`, `[data-lab-fold]`, and `story-modeller`'s replay verdict in a `[data-movable-panel]`.

## 2octies. The proportionality laboratories (unit 6, 2026-10-02)

Unit 6 « الدالة الخطية والتناسبية » (ميدان d'affichage « ميدان التناسبية والدوال ») added four types by the §7ter
recipe, in `manipulations/proportion/` (logic `logic/<name>.js` + tests, render test `proportion/<name>.render.test.jsx`,
strings `lesson.manipulation.json › ratioRide | linearMachine | originLine | percentTag`). All four compute through ONE
exact module, `packages/core/arithmetic/proportional.js` (on `linear.js` fractions: `tableRatios`, `commonRatio`,
`fourthProportional`, `coefficientFrom` refusing m = 0, `image`, `antecedent`, `onLine`, `direction`,
`percentMultiplier(t, take|increase|decrease)`, `chainMultiplier`, `percentChange`, `rule('2x-1')`, `isLinear`,
`linearityWitnesses`). All four are **manual** (§6bis), report through `state.report`, carry a DECORATIVE layer of their
world (`aria-hidden`, out of the keyboard path, still under reduced motion, never carrying an answer) on top of the
GENUINE manipulation (owner request: both), and are measured one-screen (§8bis) at the four viewports, both levels, by
`apps/web/e2e/lesson-kit/4am-tanasubiya-dala-khattiya.mjs`. New worlds in `VISUAL_THEMES`: `scooter`, `souk`,
`cablecar`, `spring`, `mall`, `tank`.

| Type | The hand holds | Resistance | Discovery (contrast) | Lessons |
|---|---|---|---|---|
| `ratio-ride` (`RatioRide.jsx`) | the ride DURATION x: drag the scooter along the promenade's minute ruler (−/+, arrows, tap); « سجّل الرحلة » records (x ; y) into the student's OWN table, ratio row y ÷ x exact | judging « جدول تناسبية » / « ليس … » refused with two different quotients or the column (0 ; 50); one column judges nothing; the ghost column filled by × a refused with its quotient; y = □ × x refused by replaying a column | مبتدئ `15x` (ratios shown): judged table + ghost column; متقدم `15x\|10x+50` (ratio row hidden until asked): both plans judged, y = 15 × x written; « y − x constant » refuted by the student's own columns | L1 tanasub-muamil (`scooter`) |
| `linear-machine` (`LinearMachine.jsx`) | the INPUT x: number cards dragged into the hopper (tap-tap, keyboard, a blank card stretched), and the dial a of a witness machine x ⟼ a·x; the table x / f(x) / a·x turns green / red live | « f(x) = a·x » refused with a column where a·x ≠ f(x), or the machine's own witness (f(0) ≠ 0, a doubled input); (0 ; 0) on the dial refused (« a × 0 = 0 for every a ») ; « no a » refused until the table holds a witness | مبتدئ `0,8x` (the Eid discount, act-1 corrected to 20 %): a from one non-zero pair, then backwards (6 → 7,5 ; 1,4 → 1,75); متقدم `x^2\|2x\|2x-1` (act-2): classify the three machines, « f(0) = 0 is enough » refuted by x² | L2 dala-khattiya (`souk`) |
| `origin-line` (`OriginLine.jsx`) | draw: a pin snapped to an exact grid (drag, tap, arrows + Enter); pivot / fit: the slope a (grab the line or the slider strip); read: the abscissa or ordinate of a probe on an axis | O shakes and refuses to move (f(0) = 0); a point off the line refused with its calculation and gap (`0,5 × 4 = 2 وليس 3`); fit counts « يمرّ بـ n من m » | draw: two accepted points with different x; read: one image and one antecedent (or the `reads` targets); pivot: one rising and one falling line (sign of a); fit: a line through all the points (or « no line through O fits ») | L3 tamthil-bayani-khatti (`cablecar`; the GeoGebra slider of p. 76 as `pivot`), L5 tarrid-khatti (`fit`, `cablecar` / `spring`), synthesis (`read` + `cap`, `budget`) |
| `percent-tag` (`PercentTag.jsx`) | the signed t % at the end of the « بعد » bar (stretch, track tap, ±1 %, arrows), زيادة / تخفيض, the article; in a chain the BET on the overall change, then each step | the additive bar « x + t » never meets the multiplied bar (MISC-NISBA-JAM, swept t = −50…50); building a chain refused before a bet; the « −15 % » bet refused by the water level (multipliers multiply); a full tank refuses to overflow | single (`1200`, `+5`, act-5): same t on a second article, y ÷ x constant → x ⟼ 1,05x; chain (`30`, `-30\|+15`, the tank of p. 71): 0,805 → −19,5 %, and −20 % / +20 % → 0,96 | L4 tatbiqat-tanasub (`mall`, `tank`) |

**`origin-line` props** (the unit's shared lab; L5 and the synthesis keep theirs in `content/textbook.js › LAB` and mount
them in `lab.render.test.jsx`): `a` (required for draw / read; exact writing, `"0,5"`, `"-3,2"`, `"9/4"`), `mode`
(`draw` | `read` | `fit` | `pivot`), `points` (`"2:0,6|3:0,9"` — fit data, or given points elsewhere), `reads`
(`"x:4|y:3,5"`), `cap` (a dashed horizontal budget line; the crossing is shown exactly, `10000/19 ≈ 526,32`),
`xMin xMax yMin yMax` (strings; O always forced into the window; graduations chosen so every required value is reachable
exactly), `theme` (`cablecar` = equal units on both axes; `spring`, `budget` = one unit per axis — `budget` is a lab
world, not a `VISUAL_THEMES` entry: a resource declares `experience.theme: 'cablecar'`), `showRule`, `title lead mission
level levels`, `onTrial` (`{ kind: 'point', ok, x, y, gap }` | `{ kind: 'read-x' | 'read-y', x, y, capHit }` |
`{ kind: 'line', a, dir, hits }`), `onFinished({ mode, a })`. A content defect throws at render (draw/read without
`a`, fit without `points`, read with a = 0). On the other workspace level only `a`, `mode` and `reads` apply.

`ratio-ride` props: `plans`, `theme`, `onTrial({ x, columns, plans, rows })`, `onJudged({ id, says, ok })`. `percent-tag`
props: `price`, `steps` (`"+5"`, `"-30|+15"`, |t| ≤ 50), `theme` (`mall` | `tank`). `linear-machine` props: `rules`
(`proportional.rule` writings), `theme`. Each component header carries its DNA design sheet and full DOM contract.

**DOM roots** (e2e): `[data-ratio-ride][data-plans][data-x][data-columns][data-layout][data-judged]` (`[data-ride-glance]`
measured block, `[data-ride-handle]`, `[data-ride-record]`, `[data-ride-claim]`, `[data-ride-verdict]`,
`[data-ride-ghost]`, `[data-ride-formula]`); `[data-linear-machine]` (cards, hopper, dial, table — see the header);
`[data-origin-line][data-mode]` (`[data-ol-glance]`, `[data-ol-handle]`, `[data-ol-line]`, `[data-ol-cap]`,
`[data-ol-hits]`, `[data-ol-formal]`); `[data-percent-tag][data-mode=single|chain][data-world][data-k][data-y]`
(`[data-percent-glance]`, `[data-percent-handle=t|bet]`, `[data-percent-additive]`, `[data-percent-refused]`,
`[data-percent-tank][data-volume]`); all four `[data-deco]` and `[data-lab-fold]`.

## 2nonies. The affine-function laboratories (unit 7, 2026-10-02)

Unit 7 « الدالة التآلفية » (same display ميدان « ميدان التناسبية والدوال ») added five types by the §7ter recipe, in
`manipulations/affine/` (logic `logic/<name>.js` + tests, render test `affine/<name>.render.test.jsx`, strings
`lesson.manipulation.json › affineMeter | affineLine | slopeStairs | lineCrossing | planCompare`). All five compute through
ONE exact module, `packages/core/arithmetic/affine.js`, built ON `linear.js` (an affine function IS unit 4's `{ a, b }`)
and `linearSystem.js` (an equation ax + by = c): `affine('3/2x+1' | '2+3x' | a, b)`, `affineLatex`, `kindOf`,
`classifyRule` (`'3x^2+1'`, `'1/x-3'` → `other`), `imageOf`, `antecedentOf` (`unique` | `none` | `all`), `onLine`,
`direction`, `yIntercept`, `xIntercept`, `rateOfChange`, `fromTwoPoints`, `interceptFrom`, `lineFromEquation`,
`intersect` (`unique` | `parallel` | `same`), `comparePlans`, `cheapestAt`, `stepFrom`. The graph labs reuse the pure grid
helpers of `logic/originLine.js` unchanged (`parseValue`, `niceStep`, `subdivide`, `ticks`, `planeGeometry`, …). All five
are **manual** (§6bis), report through `state.report`, carry a DECORATIVE layer (`aria-hidden`, out of the keyboard path,
still under reduced motion, never an answer) on top of the GENUINE manipulation, and are measured one-screen (§8bis) on
their « glance » block at the four viewports, both levels, by `apps/web/e2e/lesson-kit/4am-dala-taalufiya.mjs`. New worlds
in `VISUAL_THEMES`: `payroll`, `ride`, `ramp`, `thermo`, `gaming`, `rental`, `laser`.

| Type | The hand holds | Resistance | Discovery (contrast) | Lessons |
|---|---|---|---|---|
| `affine-meter` (`AffineMeter.jsx`) | x (km / overtime hours): the taxi or the time card dragged along its ruler (tap, −/+, arrows); at the `classify` stage the knobs a and b | at x = 0 the meter is NOT empty (the b block is already there); a target m shows its gap (« −185 ») until met at exactly one x; « proportional », « (a + b)·x » and « m ÷ a − b » refuted with the student's own numbers | `image`: trials with x = 0 or a pair x, 2x (+ the textbook columns) → f(x) = ax + b; `antecedent`: m met → « اطرح b ثم اقسم على a »; `classify`: b = 0 (خطية) AND a = 0 (ثابتة) | L1 mafhum-taalufiya (`ride` 40x + 100; `payroll` act-1 185x + 35000, target 37775) |
| `affine-line` (`AffineLine.jsx`) | shift: the point (0 ; b′) on the y-axis strip, or the whole line grabbed (translation); identify: b′ and the step « 1 to the right, a′ up »; draw: a pin on an exact grid; read: x / y probes | b′ ≠ b refused with « f(0) = b », b′ = 0 is « (d) itself, through O »; the step will not move in shift (a fixed, (d′) ∥ (d)); a point off the line refused with its gap, O refused when b ≠ 0; each identify try names the relation of the two lines | shift: (d′) accepted, then two probe readings at different x give the SAME gap b; identify: the lines coincide; draw: two accepted points; read: the `reads` targets | L2 tamthil-bayani-taalufi (`ramp`; act-3 3/2·x lifted by 1, then a hidden descending ramp) |
| `slope-stairs` (`SlopeStairs.jsx`) | two numbers x₁, x₂: grab the plane (the nearest marker follows the line), handles under the axis, track tap, arrows, −/+ | x₁ = x₂ refused (« القسمة على 0 مستحيلة »); in `points` mode a number whose image is unknown is refused until the stair between the two given couples is built | `rule`: three stairs of at least two widths — the quotient Δf ÷ Δx never moves (INVARIANT = a), « grows with the stair » / « is the difference of the images » refuted by the student's stairs; the textbook's « … » stairs fill when covered; `points`: the stair (→ a) then a marker at 0 (→ b) | L3 tanasub-taghayyurat (`stadium` act-4 200x + 2000, marks 0\|1\|4\|6\|10\|12\|15; `thermo` the تحدّ 10:50\|30:86) |
| `line-crossing` (`LineCrossing.jsx`) | build: for each equation the card of its writing y = ax + b; probe: a point P on the integer grid (drag, tap, arrows ± Shift, Enter, pad); cases: the second line's b and a | a wrong card shakes, refuted by an exact witness (« x = 0 gives y = −43, and 0 + (−43) ≠ 43 »); each equation's LAMP lights only when P is exactly on its line, the substitution written under it; an intersection off the grid nodes is SAID (« القراءة تقريبية », the exact pair from the calculation) | probe: a one-lamp trial AND the two-lamp point (« (y ; x) » refuted); cases: parallel (lamps never together) AND coincident (every point lights both) produced by the student → the three-case table | L4 tafsir-bayani-jumla (`laser` 2x − y = 1, x + y = 5; `coins` act-5 → (36 ; 7); معارف with `startWith="cases"`) |
| `plan-compare` (`PlanCompare.jsx`) | model: plan A's two amounts carried into the bill (« يُدفع مرّة واحدة » / « عند كل وحدة × x »), then x on the strip under the plane; compare: x (bars and lines move together), a marker on an exact grid, then a brush painting the x-axis intervals | « تحقّق » refuses the fixed part paid x times (MISC-TARRID-JUZ-THABIT) with the bill's own cost (2000 × 7 + 200 = 14200 ≠ 3400); a marker off the crossing refused with every plan's cost; « لا تتساويان » refused when the cheapest plan changes; a wrong colour refused with a witness from the student's OWN trials (MISC-TARRID-AFDAL-DAIMAN) | model: model + `ask` targets → f(x) = ax + b, image / antecedent; compare: every breakpoint of the cheapest plan (lower envelope) marked + every interval painted + trials in two intervals → f(x) = g(x), the inequality, the choice sentence | L5 tarrid-taalufi (`gaming`, `stadium` act-4 200x + 2000 vs 400x), synthesis (`rental`, 3 plans incl. a constant one) |

**`plan-compare` props** (the unit's shared lab; the synthesis keeps its own in `content/textbook.js › LAB` and mounts them in
`lab.render.test.jsx`): `plans` (1–3 `affine` writings, `"200x+2000|400x"`, amounts ≥ 0, pairwise distinct — else a render
error), `mode` (`model` | `compare` | `model|compare`; one plan ⇒ model only), `ask` (`"x:7|y:4800"` on plan A, y must have a
whole antecedent in the window), `xMax yMax` (strings; defaults from the crossings, asks and costs), `theme` (`stadium` |
`gaming` | `rental`), `title lead mission level levels`, `onTrial` (`{ kind: 'model' | 'x' | 'mark' | 'noCross' | 'paint', … }`),
`onFinished({ kind: 'model' | 'cross' | 'none', x, before, after })`, optional `onModel({ tex })`. With 3 plans the crossings
to mark are the breakpoints of the cheapest plan; a crossing « above » is accepted but not required.

**Other props.** `affine-meter`: `rule` (a > 0 and b > 0), `mode` (`image` | `image|antecedent|classify`), `target` (needs a
whole antecedent ≥ 1), `marks` (the textbook columns as ruler flags), `xMax`, `theme` (`ride` | `payroll`).
`affine-line`: `a`, `b` (exact writings), `mode` (`shift` | `identify` | `draw` | `read`, chained with `|`), `find` (`"a:b"`, the
hidden line of a chained identify), `reads`, `xMin xMax yMin yMax` (O and x = 1 always in the window, equal units), `showRule`,
`theme` (`ramp`). `slope-stairs`: `rule` | `points` (exclusive), `marks`, `shown` (stairs already printed), window, `theme`
(`stadium` | `thermo`; the thermometer is graduated in °C only — a °F scale would give b). `line-crossing`: `system`
(`linearSystem.eq2` writings, each containing y), `cases`, `startWith` (`build` | `cases`), window, `theme` (`laser` | `coins`).
Each component header carries its DNA design sheet and full DOM contract.

**DOM roots and glance blocks** (e2e): `[data-affine-meter]` / `[data-am-glance]`; `[data-affine-line][data-mode][data-stage]` /
`[data-al-glance]`; `[data-slope-stairs][data-mode]` / `[data-ss-glance]`; `[data-line-crossing][data-stage]` /
`[data-lc-glance]`; `[data-plan-compare][data-stage][data-step]` / `[data-pc-glance]`; all five `[data-deco]`, and
`[data-lab-fold]` where the trials fold.

**Narrow layouts (320 px).** At 320×640 a lab scene is ~160–180 px wide (unit 5's observation): each lab has a measured narrow
layout — numbered stage tabs (`affine-meter`), the ghost rule dropped (`affine-line`), a 4-button pad (`slope-stairs`), compact
lamps and −/+ instead of strips (`line-crossing`), the empty plane hidden while the bill is built (`plan-compare`). The tightest
measured margins are 8–10 px (L2 advanced, L4 advanced after both lines, the synthesis on phones).


## 2decies. The statistics laboratories (unit 8, 2026-10-02)

Unit 8 « الإحصاء » (same display ميدان « ميدان التناسبية والدوال », programme domain « ميدان تنظيم المعطيات ») added four types by
the §7ter recipe, in `manipulations/stats/` (logic `logic/<name>.js` + tests, render test `stats/<name>.render.test.jsx`, strings
`lesson.manipulation.json › cumulGate | statBalance | sheetLab | groupTanks`). All four compute through ONE exact module,
`packages/core/arithmetic/statistics.js`, on `linear.js` fractions (`tableOf`, cumulative up / down and relative, `countAtMost /
AtLeast / Where`, `range`, `mean`, `median` by ranks, classes / `center` / `medianClass`, `mode`, `combineGroups`,
`solveValueForMean`, `pieAngles`, `statText` / `approx`) — no lab carries arithmetic. All four are **manual** (§6bis: each gesture
is an announcement, a position or a prediction), report through `state.report`, carry a DECORATIVE layer (`aria-hidden`, out of
the keyboard path, still under reduced motion, never an answer), and are measured one-screen (§8bis) on their « glance » block at
the four viewports, both levels, by `apps/web/e2e/lesson-kit/4am-ihsa.mjs`. A series is written `value:count|…` (or plain values),
decimal comma. New worlds in `VISUAL_THEMES`: `funpark`, `heatwave`, `esport`, `sheet`, `beach`, `quiz`, `medals`. The full props,
DOM attributes and DNA sheet of each type are in its component header; the essentials:

| Type | The hand holds | Resistance | Discovery (contrast) | Lessons |
|---|---|---|---|---|
| `cumul-gate` (`CumulGate.jsx`, glance `[data-cg-glance]`) | the threshold t: the bar of a ride's height gauge (drag, tap the gauge, −/+, arrows; tapping a drawn person or a table column jumps to its height), the side « على الأكثر ≤ t » / « على الأقل ≥ t », the queue's sort; then the student ANNOUNCES how many pass | the gate stays shut on a wrong count and names its witness: `strict` (the people of height exactly t forgotten), `under` (lit heights still to add), `over` (unlit people counted), `otherSide` | one value counted on BOTH sides: up(t) + down(t) = N + f(t) (12 + 13 = 20 + 5), up(max) = down(min) = N; a t that is not a value (158) gives the count of the value below; the textbook's two tables filled by the student's own accepted counts, « ÷ N » for التواتر | `takrar-mujamma` M1 (`funpark` 8 kids, 3 × 3; `school` act-1's 20 heights, 5 × 4) |
| `stat-balance` (`StatBalance.jsx`, glance `[data-sb-glance]`) | range: the two jaws of a كلّاب on the beam's columns; mean: the fulcrum p on a graduation 1/D that contains the mean (1/15 for 482/30); median: a curtain in RANK space 0…2N (inside a stack the finger's height chooses the cut); contrast: the far token; hidden: each hidden token between its table bounds | the beam ALWAYS tilts off the exact mean (minimum visible angle, the two distance sums written); the curtain refuses unequal counts (« 4 مقابل 6 »); tokens outside the jaws stay red; a hidden token leaving its bounds is refused and returns | the far token: the mean runs (ghost of the old mean), the median stays (the textbook's 3 and 43); N odd (curtain ON a token) / N even (between two); hidden: the median fixes the first value, the mean the second, « the mean alone suffices » refuted by a witness | `mada-wasit-mutawassit` M1 (`range\|mean`: `esport` 2, 3, 3, 4, 8 / `heatwave` El Oued) and M2 (`median`); synthesis `wadiya-idmajiya-ihsa` M1 (`hidden`, `medals`) |
| `sheet-lab` (`SheetLab.jsx`, glance `[data-sh-glance]`) | the CELLS (typed, then −/+), the RANGE selected on row 1 (drag; tap first then last; Shift + arrows), the FORMULA (function cards or typed), ENTER into column B after the hand result in column C; at the chart stage a selection of a 2-row table and the chart type | refused in the bar with the spreadsheet's own reason (no « = », a typed number, unknown function #NOM?, a range leaving row 1, no hand result yet); COMPUTED but contradicted by the student's own column C: a short range (A1:F1 → 31/6) or a wrong function (=MAX alone → 10) — a coincidence is named and still refused; a wrong chart type refused, an incomplete selection DRAWS a wrong chart (216° for 144°) | after every row verified, a cell changed: MOYENNE moves, MEDIANE stays (swept on every single-cell change of ex-7); the chart stage (opened by the student, §7quater) ends when bars / pie / histogram each fit their data | `majdulat-ihsaiya` M1 (`sheet`: 5\|8\|6\|9\|7 / ex-7 typed by the student, four formulas, then charts ex-15 / ex-16) |
| `group-tanks` (`GroupTanks.jsx`, glance `[data-gt-glance]`) | a BET: the 🎯 marker on the EMPTY class tank (drag, tap the track, ▲▼, keys on the slider); the valve; then a group's count n (tap its tank, −/+) | no valve without a bet; the « mean of the means » bet (9,5; 11,5) is refused by the water, which stops lower, on the side of the wider tank (MISC-IHSA-MUTAWASSIT-MUTAWASSITAYN) | a group is a tank of WIDTH n filled to LEVEL m (area n·m = its points); the class tank (width N) settles at Σ n·m ÷ N (communicating vessels = weighted mean, drawn areas equal before / after); equal counts make the mean of means right ONLY then; the two classes of the تحدّ settle at the same 384/33 although boys favour ب and girls أ | `qiraat-wadiyat-ihsaiya` M1 (`quiz` 4:12\|6:7 → 9; `school` the تحدّ, `classes: '2\|2'`) |

**`stat-balance` props** (the unit's shared lab; the synthesis keeps its own in `content/textbook.js › LAB` + `lab.render.test.jsx`):
`series` (`?` marks a hidden value, hidden mode only), `mode` (`range`, `mean`, `median` in any ordered combination — `median`
appends the `contrast` stage — or `hidden` alone), `hidden` (`"2:2-4|12:26-32"`: index in the WRITTEN order of `series` : inclusive
bounds, at most three; a hidden token starts at its lower bound so the page never holds the answer), `targetMean`, `targetMedian`
(hidden only, both required), `unit` (Latin unit → KaTeX island, Arabic word → DOM text), `axis` (`"min:max:step"`), `theme`
(`esport` | `heatwave` | `medals`), `onTrial({ stage, … })`, `onFinished({ stages, range, mean, median })`. In hidden mode the
target chips show « ≈ 6,87 », never a tall fraction, and the pads of the hidden values sit side by side — that is what keeps the
synthesis's 30 medals inside 320 × 640 (448 px for 568).

**`cumul-gate` props**: `series`, `mode` (`up|down` | `up|down|table`), `given` (the cells the textbook prints:
`"up:154|up:157|down:160|…"`), `theme` (`funpark` | `school`), `unit`. **`sheet-lab` props**: `cells` (2–12 values), `ask`
(MAX-MIN, MEDIANE/MEDIAN, MOYENNE/AVERAGE, MODE — the textbook prints the French Excel names, the English ones are accepted as the same
functions), `entry` (`type` | `given`), `chart` (`bars|pie|histogram`) with `pie` (`'البلاستيك:60|…'`) and `classes`
(`'7-8:6|8-9:1|9-10:4'`). The lab follows the spreadsheet, never an invented rule: empty cells in a range are ignored, MODE returns
the first most frequent value in cell order and #N/A when nothing repeats. **`group-tanks` props**: `groups` (`n:m|…`), `classes`
(groups per class, `'2|2'`), `theme` (`quiz` | `school`); a tank's height is budgeted from the lesson viewport minus what the
glance block MEASURES besides the tanks, so the block stays in the screen when the reading grows after the valve.

## 2sedecies. The meaning of addition and subtraction — `story-bars` (1AM unit 2, 2026-10-14)

The first lab of the cycle moyen rollout (phase 3), in a new folder `operations/` (`operations/StoryBars.jsx`, pure logic
`logic/storyBars.js`, 19 logic + 6 render tests). Lesson `mana-jam-tarh` « معنى الجمع والطرح ». The idea: the words « يزيد / ينقص /
أكثر / أقل » do not decide the operation — the STRUCTURE does. In the textbook's tape diagram (« مخطط بأقواس », drawn by the shared
`components/ArcTape.jsx`, also a statement-figure kind `tape`), if the unknown is the WHOLE we add the parts, if it is a PART we subtract.

| Story (`story` prop) | Level | What the hand holds | What resists |
|---|---|---|---|
| `checkup` (platform, theme `checkup`) | مبتدئ | the unknown child's HEIGHT on a wall gauge (stretch, vertical slider, keyboard ±1 / Page ±5, −/+), then the calc card that gives it | a commit that makes the sentence false is refused in the story's words (`equal / side / mirror / gap`; `mirror` = the trap read as its word, e.g. نزيم at 139); a wrong calc card draws its ghost head and is refused (`wrong / impossible`); only the right one writes `□ = 130 + 6 = 136` and closes the tape |
| `act1` (textbook نشاط 1 p. 25) | متقدم | the six textbook CALC CARDS, carried onto the six texts (drag, tap-tap, keyboard); no gauge, no reading | a card on the wrong text returns and that text's tape is drawn with the card's value in the unknown's role, NOT closed (gap / overflow), with a reason in the story's words (`operation / numbers`) |
| `method29` (textbook طريقة p. 29) | alone, `levels={false}` | the heights of يونس and محمد against أكرم 124 cm | same as `checkup`; no discovery, `onFinished` when both are done |

Discovery (`checkup`: items أمين +, ريم −, نزيم trap done; `act1`: all six matched): « ماذا يقرّر العملية: الكلمة أم المخطط؟ », the two wrong
options refuted with the student's own items. Props: `story`, `level`, `levels`, `title`, `lead`, `onTrial({ story, item, kind:
'stretch' | 'calc' | 'card', value, ok, calc })` (items `amine…yassine`, `younes`, `mohamed`, `t1…t6`; `calc` is written with « − »),
`onFinished({ story })`. Not eligible for « جرّب كل الإمكانيات » (§6bis). Since the Gen Alpha redesign (2026-10-14, §8ter) the children
are drawn WHOLE (`KidFigure`): the floor is 0 cm and each crown sits exactly on its height (`gaugeScale(height, GAUGE_PAD)`, 44 px above
150 cm for the value pills, 46 px under the floor for the name pills; `rulerTicks(k)` adapts ticks and labels to the scale). The layout
is the kit's: PromptCard in the §17.9 form (context « في الفحص الطبي، قامة سارة 130 cm. » + the item's sentence `[data-sb-sentence]`,
then the question « غيّر قامة أمين حتى تصدق الجملة. » with its lamp, the labelled item tabs « الجمل: », the labelled calc row
« الحساب الذي يعطي قامة أمين: » `[data-sb-calc-ask]` and its three cards; `act1`: context « تحت البطاقات 6 نصوص… », question « اسحب كل
بطاقة إلى نصّها حتى تُحلّ النصوص كلّها. », progress « حُلّ 0 / 6 »; no shell `mission`, `titleHidden`), then the stage and, at ≥ 600 px,
a side column with the StepperCard and the verdict (the result card replaces the stepper when the item is done); narrower, the round
−/+ live INSIDE the stage, in the handle lane. The difference is a neutral `SvgDimension` « 6 cm » — no sign, so the drawing never
dictates the operation. DOM: `[data-story-bars][data-story][data-mode][data-item][data-solved]`, `[data-sb-glance]`, `[data-sb-handle]`,
`[data-sb-person]`, `[data-sb-sentence][data-ok]`, `[data-sb-calc=<canonical i>]` (0 = known + d, 1 = known − d, 2 = d − known),
`[data-sb-card=<0..5>][data-placed]`, `[data-sb-slot=<1..6>][data-matched]`, `[data-sb-verdict]`, `[data-sb-refused]`,
`[data-sb-formal-line]`, the tape's `[data-arc-tape][data-tape-closed]`. Browser suite: `e2e/lesson-kit/1am-jam-tarh-ashriya.mjs`.

## 2septdecies. Euclidean division — `division-jumps` (1AM unit 3, 2026-10-14)

`operations/DivisionJumps.jsx` on `logic/divisionJumps.js` (integers through `core/arithmetic/divisibility.js › divmod`), lesson
`qisma-iqlidiya-baqi`. Here b is GIVEN (the size of a bouquet, of a jump) and the hand holds **q, the number of groups** — a different
variable and gesture from 4AM's team-builder (b = number of teams) and bookshelf (b = shelf length) (DNA §12). Two refusals bracket the
quotient: one group too many needs objects that do not exist (`over`: the missing flowers drawn as ghosts, « لهذه الباقة تنقص … »), one
group too few leaves enough for another (`short`: a ghost bouquet over the leftovers). The exact stop writes `a = b × q + r`, `r < b`.

| World (level) | What the hand holds | What resists |
|---|---|---|
| `flowers` (مبتدئ, theme `garden`, 47 flowers in bouquets of 6) | a ribbon pulled along the row of drawn flowers (stretch; ← / → keys, −/+, drag, tap) — each step ties the next 6 | `over` / `short` as above; after the exact stop a card « زهرة جديدة! » opens 48 (`then`, default the next multiple of b): one more flower closes a bouquet exactly |
| `line` (متقدم, textbook نشاط 3: 279 ÷ 14) | the number of jumps of 14 on a graduated line; the multiples are NOT labelled (only 0 and round values that are not multiples of b) | the jump past 279, the stop that leaves ≥ 14; the bracket `14 × 19 ≤ 279 < 14 × 20` is written after the exact stop |
| `line`, `levels={false}` (معارف 2: 253 ÷ 17) | the same, as the textbook's worked example | — |

`discoveryReady` = one `over` + one `short` + the exact stop on the lesson's own a (trials on 48 never count). Discovery « متى نتوقّف عن
تشكيل الباقات؟ », wrong options refuted with the student's numbers (« when nothing is left », « at 10 »). Formal: an المقسوم chip + the shared
`DivisionRoles` for b, q, r. Props `a`, `b`, `world`, `then?`, `level`, `levels`, `title`, `lead`, `onTrial({ a, b, q, r, kind: 'over' |
'short' | 'exact', ok })` (`r` null on `over`; `a` is 48 during the contrast), `onFinished({ a, b })`. Not eligible for « جرّب كل
الإمكانيات ». Default q = 0. DOM: `[data-division-jumps][data-world][data-a][data-b][data-q][data-solved]`, `[data-dj-glance]`,
`[data-dj-handle]`, `[data-dj-less]` / `[data-dj-more]`, `[data-dj-group]`, `[data-dj-left]`, `[data-dj-ghost]`, `[data-dj-verdict]`,
`[data-dj-refused]`, `[data-dj-bracket]`, `[data-dj-next]`, `[data-dj-formal]`. Browser suite: `e2e/lesson-kit/1am-darb-qisma-ashriya.mjs`.

**Look (2026-10-14, kit §8ter).** A `PromptCard` on top in the §17.9 form — context with every number (« عند بائعة الأزهار 47 زهرةً، وفي كل باقة 6
زهرات. »; a lesson `lead` replaces it for its own numbers, e.g. 253 pearls), the question « اصنع الباقات حتى تعرف كم باقة كاملة تخرج من
هذه الأزهار. » / « اقفز بالأرنب حتى تعرف كم قفزة كاملة من 0 إلى 279. » with a lamp lit only at the exact stop, live `aside` pills that show only what the hand produced (`[data-dj-reading]`, `[data-dj-read=need|left|land]`) — above a
`StageFrame`. مبتدئ: a florist awning and `primitives/FlowerFigure.jsx` (`FlowerFigure`, `hueOf` — decorative colours that never repeat
every b flowers, so colour never fakes a group —, `BouquetSleeve`, `BouquetTie`): a paper sleeve behind each bouquet, converging stems and a
ribbon whose knot is the count pill (rose « 5 » + ghost flowers when flowers are missing); the remainder circled in amber with its pill;
geometry from `logic › bouquetShape` and `flowerLayout(…, BOUQUET_ROWS)` (tested). متقدم: `primitives/HopperFigure.jsx`, a drawn rabbit at
the landing point (`[data-dj-hopper][data-mood=idle|happy|oops]`) that hops each step (still under `prefers-reduced-motion`), its landing
pill, a flag at a and a pond after it (`[data-dj-pond]`: an overshoot lands in the water); multiples are still never printed before a jump
lands there. Controls: wide flowers = side `StepperCard` (`[data-dj-count]`), wide line = a control bar under the full-width line, narrow =
the round −/+ in a strip inside the stage; exactly one `[data-dj-less]` / `[data-dj-more]` pair. The `VerdictBanner` sits under the scene
and keeps its place (it shows the instruction before the first try): the scene never jumps; the scene height is computed from the prompt
and what follows, never from the scene itself. Added DOM: `[data-dj-prompt][data-lit]`, `[data-layout=wide|narrow]`.

## 2octodecies. Divisibility rules — `digit-cards` (1AM unit 3, 2026-10-14)

`operations/DigitCards.jsx` on `logic/digitCards.js` (every verdict by `n % d`, never by a digit rule), lesson
`qawaid-qabiliyat-qisma`. The rule is DISCOVERED from the student's own trials, never stated by the lab: the hand either colours the
multiples in a table (the textbook's نشاط 4) or arranges digit cards and claims divisibility (exercise 26). Two worlds, two variables
(DNA §12):

| World (level) | What the hand holds | What resists |
|---|---|---|
| `grid` (مبتدئ, textbook نشاط 4: 0..48 in 7 columns, colourings ÷2 then ÷5 then ÷3, order enforced) | a tap on a cell = « this is a multiple of d » (keyboard Enter, touch) | a non-multiple is refused with its remainder written (`refused=remainder`); after 5 hand-coloured cells « أكمل » may colour the rest PALE and dashed (`data-revealed`, a local shortcut, never a trial) |
| `cards` (متقدم, textbook ex. 26: cards 4, 5, 9, 3) | placing / swapping the cards (tap-tap, drag, keyboard) and claiming « يقبل / لا يقبل » on a closed lamp per divisor; « هذا هو الأكبر » and « لا يوجد » | a lamp opens on the division whether the claim was right or wrong; open lamps are re-judged on every new number (« تغيّر / بقي »); a valid but not largest « الأكبر » is refused naming the NEXT larger valid arrangement, a wrong « لا يوجد » names the smallest valid one |

`discoveryReady`: grid — the three colourings complete; cards — the three reachable targets (9534 ÷2, 9543 ÷3, 9435 ÷5) plus one swap
with lamps 2 and 3 open that kept ÷3 and flipped ÷2 (the « لا يوجد » answers for 4 and 9 are optional). Wrong options are refuted with
the student's material (« the column decides » by m and m ± 7; « the units digit decides for 3 » by m and m ± 10; « even ⇒ ÷4 » by
`9534 = 4 × 2383 + 2`; « the digit sum decides for 2 » by the student's own swap). Formal: the remainder definition (P4), then the rules
with the student's numbers (cards adds 9 and 4: `9534 = 95 × 100 + 34`, `100 = 4 × 25`). Props `mode`, `divisors`, `digits`,
`from` / `to` / `columns`, `level`, `levels`, `title`, `lead`, `onTrial` — grid `{ mode: 'grid', n, d, r, ok }` (one per new cell), cards
`{ mode: 'cards', n, d, claim: 'yes' | 'no' | 'largest' | 'none', r, ok }` (`n`, `r` null on `none`); every trial reported ONCE even when
two gestures land in one render — `onFinished({ mode })`. Not eligible for « جرّب كل الإمكانيات ». DOM: `[data-digit-cards][data-mode]
[data-solved][data-layout]`, `[data-dc-glance][data-bleed]`, `[data-dc-colouring=<d>][data-open][data-complete]`, `[data-dc-reveal]`,
`[data-dc-cell=<n>][data-colour][data-revealed]`, `[data-dc-ledger-row=<d>]`, `[data-dc-card=<digit>][data-placed]`,
`[data-dc-slot=<i>][data-digit]` (slot 0 = leftmost digit), `[data-dc-lamp=<d>][data-state][data-flip]`, `[data-dc-claim=<d>]
[data-claim]`, `[data-dc-task=<d>][data-done]`, `[data-dc-submit]`, `[data-dc-none]`, `[data-dc-verdict]`, `[data-dc-refused]`,
`[data-dc-formal]`, `[data-dc-rule=<d>]`. Browser suite: `e2e/lesson-kit/1am-qawaid-qabiliyat-qisma.mjs`.

**Look (2026-10-14, kit §8ter).** Both worlds sit on the kit: a `PromptCard` in the §17.9 form (context « في الجدول الأعداد من 0 إلى 48. » /
« عندك أربع بطاقات: 4 ، 5 ، 9 ، 3. », question « لوّن كل مضاعفات 2 ثم 5 ثم 3. » / « رتّب البطاقات حتى تكوّن أكبر عدد يقبل القسمة على
2 — أو قل إنه لا يوجد. » with its lamp, then the colouring cards — « مضاعفات 2 » in the divisor's colour, a live « لوّنتَ 5 من 25 » — or the
target pills under « القسمة على: »; no shell `mission`, `titleHidden`)
above a lavender `StageFrame`; ≥ 600 px a side column (verdict + pill ledger for the table; for the cards a control card with the BIG
formed number, « هذا هو الأكبر » primary / « لا يوجد » secondary, the drag hint, then the verdict); narrow, the verdict sits under the stage
so nothing under the finger moves. The table is a candy board: each ≥ 40 px cell is the button with a raised tile drawn inside; an accepted
cell gets a transform-only « stamp » (Web Animations, off under reduced motion), a refused one shakes and carries a « +r » remainder pill
(`[data-dc-remainder]`). The slots are the windows of a drawn padlock (the lesson's locker code); the lamps are drawn bulbs —
`primitives/BulbFigure.jsx` (`state` closed | wait | yes | no, the divisor written on the glass, a warm halo for « يقبل », grey with × for
« لا يقبل », `data-bulb`) — with an « تغيّر / بقي » badge (`[data-dc-flip-badge]`) after a number change. Added DOM: `[data-dc-prompt]`,
`[data-dc-colourings]`, `[data-dc-board]`, `[data-dc-marks]`, `[data-dc-stage]`, `[data-dc-readout]`, `[data-dc-answer]`. Below 296 px of
lab width the glance still bleeds over the lesson frames (238 → 280 px at 320).

## 2novodecies. Place value, ten for one — `rank-exchange` (1AM unit 1, 2026-10-14)

`operations/RankExchange.jsx` on `logic/rankExchange.js`, all arithmetic through `packages/core/arithmetic/placeValue.js` (imported by
path: `digitsByRank`, `countOfRank`, `valueOfCounts`, `isWritable`, `decompose`, `classesOf`, `spaced` with U+00A0, `classWordsOf`,
`toArabicWords` — byte-identical to `words()` of `docs/sources/1am/unit1/build-extraction.py`, tested against every `words` answer of
the extraction and a 0..100 000 sweep — and `RANK_NAMES`), lesson `kitabat-adad-tabii`. The hand moves **quantities between ranks**
(DNA §12): it sweeps ten objects of a column into ONE object of the next rank and carries it one column to the LEFT, or opens one object
into ten of the rank on its right. The written digits are an OUTPUT — a column's digit box shows its count while 0..9 and OVERFLOWS (two
digits squeezed, rose, one shake, `data-overflow`) from 10 on; the written number appears only when every column is writable and no
tied object waits to be carried. The board is an LTR island, the highest rank on the LEFT (the textbook's « جدول المراتب »).

| World (level) | What the hand holds | What resists |
|---|---|---|
| `pencils` (مبتدئ, theme `packing`, platform: tasks `pack` 1 · 13 · 24 · 37, then `unpack` 2017 rank 1) | sweep a finger across objects of a column (each lifts with its number 1, 2, 3…; taps add up the same way); exactly 10 ties ONE pack / box / carton that is carried (drag, tap-tap, keyboard ←, « انقل يسارًا ») into its column; `unpack`: drag the top object one column right or the digit box's open action | `short-pack` (7 pencils fall back: « 7 أقلام لا تكفي: حزمة = 10 أقلام »), `wrong-column` (the pack slides back: « مكان الحزمة عمود الحزم »), a prediction card chosen BEFORE the first gesture and judged by the board (1 132 437 / 75 / 2 577; 1 / 20 / 201) |
| `tokens` (متقدم, textbook act-1 ③ and know-1: tasks `next` 999, `previous` 999, `borrow` 1000, `dictation` 7065 and 4 908 732) | the same sweep and carry on a 7-column board grouped by CLASS (one token colour per class); « +1 / −1 » on the units; the dictation sets any column (tap a column, then − / +, or ↑ / ↓) and « تحقّق » | `next` needs exactly three packs in cascade; `no-unit` (1000 − 1: nothing to remove, three opens first); `overflow` (a column holds 10 or more at « تحقّق »), `wrong-board` (« لوحتك: 765 — سبعمائة وخمسة وستون ») |
| `money`, `levels={false}` (textbook ex-2: `tasks={['unpack']}`, 1345 DA, rank 2) | open the 1000 DA note into ten 100 DA notes; GENERIC drawn notes and coins (a plain rectangle « 100 », a disc « 10 » — never a real banknote's design) | the prediction (1 / 3 / 13); no discovery — `onFinished` when the task is done |

`discoveryReady` = every task of the level done (`pack` + `unpack`: « ماذا يعني رقم مرتبة في كتابة عدد؟ », wrong options refuted with
the board as it arrived — 1 · 13 · 24 · 37 side by side is 1 132 437, the board wrote 2 577 — and with the packs sent, 201 against the
tens digit 1; the four advanced tasks: « لماذا نكتب 0 في 7065؟ », refuted with 765 read aloud and with the one 0 of 4 908 732). Formal:
the rank table of 2017 with رقم / عدد per rank (7 / 2017, 1 / 201, 0 / 20, 2 / 2), zero ranks greyed, and `2017 = 2 × 1000 + 1 × 10 + 7`
(zero ranks absent); advanced, the classes of 4 908 732 (spaced writing, each class read « أربعة ملايين | وتسعمائة وثمانية آلاف | … »)
and its مفكوك. Props `world`, `tasks`, `start`, `n`, `rank`, `next`, `borrow`, `dictation`, `level`, `levels`, `title`, `lead`,
`onTrial({ task, kind: 'pack' | 'unpack' | 'add' | 'remove' | 'predict' | 'answer', rank, ok, counts, value })` (every judged gesture,
reported once; a refusal carries `ok: false`), `onFinished({ tasks })`. Not eligible for « جرّب كل الإمكانيات »; « افتح الباقي » (open the
rest of a column) appears only after two hand-made opens in that column (author's call, like « أكمل » of `digit-cards`). « إعادة »
restarts the task in progress (finished tasks stay finished; everything restarts once all are done). Invariant tested: the board's value
(counts + the tied object waiting) never changes under tie, carry or open, whatever the order (property sweep).

**Look (kit §8ter).** A `PromptCard` in the §17.9 form (context = the starting quantities, « في الورشة صندوق واحد و13 علبةً و24
حزمةً و37 قلمًا. الحزمة 10 أقلام… », then the task's question naming its end state « اربط الأقلام حتى تستطيع كتابة عدد الأقلام. » with its
lamp; the three prediction cards sit under their own question « توقّعك: كم قلمًا في الورشة؟ » `[data-rx-predict-ask]`, never bare; then
an aside with the labelled task steps « المهمّة », the chosen prediction pill — green or struck at the end — and, while unpacking, the live counter of packs)
above a `StageFrame` of columns: drawn objects stacked from the bottom of a bin — honest objects (a pack shows ten pencils and its rubber
band, a box ten packs, a carton 2 × 5 boxes; tokens stamped with their rank value) —, one object size for the whole board (piles of more
than 20 shrink alone), tokens and coins STACK into a pile when the height runs out (each keeps a visible sliver), and the exact count of
each column lives ONCE, in the digit box under it — a row labelled « تحت كل عمود: كم فيه. » `[data-rx-digit-caption]` (the 2026-10-14
§17.9 sweep removed the duplicate in-column count badge, `[data-rx-badge]` no longer exists). The digit box itself becomes the keyboard / tap action when a column can be tied (≥ 10) or opened
(an icon badge, a soft pulse). Wide (≥ 600 px): a side column with the packer `KidFigure` (a girl in hijab behind the workshop table,
`mood` reacting), the big written number, the ± stepper and the verdict; narrow: written number and stepper inside the stage, the
`VerdictBanner` under it keeps its place; at 320 px the 7-column board bleeds over the lesson frames to 7 × 40 px (`data-bleed`). DOM:
`[data-rank-exchange][data-world][data-task][data-solved][data-layout]`, `[data-rx-glance][data-bleed]`, `[data-rx-col=<k>][data-count]`,
`[data-rx-item=<k>-<i>][data-lifted]`, `[data-rx-digit=<k>][data-overflow]`, `[data-rx-digit-caption]`, `[data-rx-predict-ask]`, `[data-rx-steps-label]`, `[data-rx-written]`, `[data-rx-tray]`,
`[data-rx-carry]`, `[data-rx-tie=<k>]`, `[data-rx-open=<k>]`, `[data-rx-open-all=<k>]`, `[data-rx-grab=<k>]`, `[data-rx-predict=<value>]
[data-state]`, `[data-rx-counter]`, `[data-rx-step=<task>][data-done]`, `[data-rx-plusminus=<k>]`, `[data-rx-plus]` / `[data-rx-minus]`,
`[data-rx-check]`, `[data-rx-words]`, `[data-rx-next]`, `[data-rx-verdict]`, `[data-rx-refused=short-pack|wrong-column|overflow|no-unit|
wrong-board]`, `[data-rx-result]`, `[data-rx-formal=rank|zero]`, `[data-rx-kid]`.
**Onboarding (mandatory for every lab, 2026-10-14, prop `coach`, default on):** `LabCoach` (§8quater) shows, at each moment, the
button or gesture the hand needs — the step comes from the pure `logic/rankExchange.js › coachOf(lab, { focusCol })` (predict → tie →
carry → open / ± / pick a column → check → next task), whose test follows the guide to the letter and checks that every task ends.
Strings: `rankExchange.coach.*`. DOM additions: `[data-lab-coach-toggle][data-state]`, `[data-lab-coach][data-step]`,
`[data-lab-coach-ring]`, `[data-lab-coach-ok]`, `[data-lab-coach-stop]`; e2e `e2e/lesson-kit/lab-coach.mjs`.

## 2vicies. Fractional writings and reduction — `fraction-knife` (1AM unit 4, 2026-10-14)

`operations/FractionKnife.jsx` on `logic/fractionKnife.js` (every verdict exact through `core/arithmetic/linear.js` — `frac`, `eq`,
`isInteger`, `fracText`, `fracDecimal` — and `divisibility.js › divmod`, imported by path), lesson `ikhtizal-kitaba-kasriya`. ONE whole
and ONE FIXED share p/q of it (its edge never moves: the invariant IS the number); the hand holds the KNIFE — d, the number of equal pieces
of the whole, finer or coarser. The numerator is never chosen: it is READ, and it exists only when the edge falls on a cut
(`inShare = p × d / q` integer ⇔ q / gcd(p, q) divides d). Otherwise one piece straddles the edge and no writing exists. Not the 4AM
`fraction-reduction` (there the hand CARRIES a number of portions over two separate quantities) nor `square-root-side` (a 1D length) —
DNA §12.

| World (level) | What the hand holds | What resists |
|---|---|---|
| `tray` (مبتدئ, theme `sweets-tray`: grandmother's brass tray of « قلب اللوز », the neighbours' share 3/5 marked by her red ribbon; a `KidFigure` girl in hijab holds the neighbours' box and reacts — `proud` / `wonder`) | the knife on a rail under the tray, d = 1 … 20 (stretch: drag, tap the rail, ← / → ±1 — ← finer in RTL —, Page ±5, round −/+) | an unreadable cut draws the straddling piece dashed rose, inside part in the box colour, the ribbon visibly apart from the cuts, « 4 قطع وجزء من قطعة »; then Amine's claim « 3/5 = 4/6 » (card opened by the student once 2 writings are stamped) is judged ONLY with the knife at 6: his 4 pieces are dashed ghosts, the 4th overflows the ribbon by 2/5 of a piece |
| `paper` (متقدم, textbook نشاط 4 on squared paper) | the same knife (a pencil) — task 1 the textbook's rectangles 2 (6/10, red) and 3 (12/20, green) beside rectangle 1 (3/5, yellow), drawn SUPERPOSED as hatchings that coincide; task 2 « هديّة الجدّ » 27/45 (`then`, opened by the student): BEFORE the knife moves, up to 3 pins (d < 45) on the rail, then the knife judges each pin it passes | a pin or a cut at 9 or 3 (divisors of 45) straddles (5,4 / 1,8); readable coarser cuts (15, 5) draw the glue: the 45 old cuts dotted, a bracket over each new piece, « كل 9 قطع ← قطعة واحدة »; at d = 5 rectangle 1 is laid on it (`[data-fk-coincide]`) and « لا فرق بين الهديّتين » |

Each readable commit STAMPS its writing in the « دفتر الكتابات » strip (once; a writing already there is not stamped twice); d = 10, 100,
1000 adds « كسر عشري: 0,6 » to the stamp. **Bands:** when a piece would be under 10 px (`MIN_PIECE`), the whole is drawn as B bands read
right-to-left then top-down, B the smallest divisor of `max` that fits (`bandsFor`: d = 45 at 320 px → 3 bands of 15), FIXED for a share;
a piece crossing a band end is drawn as two segments with one almond / one number (`trayLayout`, swept at five widths: each piece once,
≥ 6 px, inside the width, the edge at the exact fraction). **Honesty note:** for 27/45 every multiple of 5 below 45 is readable (10 →
6/10 is a re-cut, not a glue); among the DIVISORS of 45 only 5 and 15 are — the glue is drawn only for those (`glue` needs d′ | d).

`discoveryReady`: tray — 3 writings in the notebook (3/5 + two of the knife), one unreadable cut, Amine's claim answered right (a wrong
« صحيح » is refuted in his own pieces and can be answered again); paper — both targets stamped, 27/45 cut at 5, one refused d < 45 (a pin
or a cut). Discovery « ما الذي يجمع كل الكتابات في دفترك؟ » (wrong: add the same number — Amine's 3,6 pieces; « just enlarge the
denominator » — the student's own unreadable d) / « كيف نمرّ من 27/45 إلى 3/5 …؟ » (wrong: divide the denominator by any divisor — the
student's refused divisor of 45, else 9: 5,4 pieces; divide the denominator alone — 27/5 = 5,4 rectangles). Formal: a/b = (a × k)/(b × k)
(k ≠ 0) with the student's k's, the decimal line when 6/10 was stamped, 27/45 = (27 ÷ 9)/(45 ÷ 9) = 3/5 (and the student's chain
27/45 ÷3 9/15 ÷3 3/5), « نقول إننا اختزلنا الكسر ».

Props `world`, `share` [p, q], `start`, `max`, `claim` [a, b], `targets` [[a, d], …], `then` { share, start, max, predict }, `level`,
`levels`, `title`, `lead`, `onTrial` — `{ kind: 'cut', share: '3/5', d, inShare: '18/5', readable, writing? }`, `{ kind: 'claim', claim:
'4/6', ok, answer: 'true' | 'false' }` (`ok` = the student's judgement matches the tray), `{ kind: 'pin', share: '27/45', d, readable }`
(several trials in one gesture are each reported once) — and `onFinished({ share })` (the share last worked). Not eligible for « جرّب كل
الإمكانيات » (each cut and each pin is an answer). Layout: `PromptCard` in the §17.9 form (context « قسمت الجدّة صينية قلب اللوز إلى 5 قطع
متساوية، وحصّة الجيران 3 قطع داخل الشريط الأحمر. », question « اقطع الصينية إلى عدد آخر من القطع حتى تقع حافّة الحصّة على خطّ قصّ. »,
lamp lit on a readable last cut, the textbook targets under « في الكتاب: ») → the `StageFrame` scene (count pill `[data-fk-count]` above the share, the whole, the rail with the knife; ≥ 600 px
a side `StepperCard` « عدد القطع », narrower the round −/+ at the two ends of the rail and a d pill on the knife) → the notebook strip (one
line; older stamps in `LabFold` `fraction-knife.notebook`) → the `VerdictBanner` (it keeps its place; idle = the gesture line) → the cards
(Amine, the pins, the judged pins row, « لا فرق », the gift). Measured glance (`[data-fk-glance]`, both levels, every state): ≤ 615 / 800, ≤ 583 / 768,
≤ 553 / 844, ≤ 588 / 640 px. DOM: `[data-fraction-knife][data-world][data-share][data-d][data-stage][data-solved][data-layout]`, `[data-fk-glance]`,
`[data-fk-scene][data-bands]`, `[data-fk-knife]` (slider, `aria-valuenow` = d), `[data-fk-pin-cursor]` (the slider during the prediction;
Enter plants), `[data-fk-less]` / `[data-fk-more]`, `[data-fk-piece=<i>][data-in=full|part|out]`, `[data-fk-edge]`, `[data-fk-count]`,
`[data-fk-notebook]`, `[data-fk-stamp=<a/d>][data-figure]`, `[data-fk-decimal]`, `[data-fk-claim][data-judged]`, `[data-fk-claim-open]`,
`[data-fk-answer=true|false]`, `[data-fk-ghost]`, `[data-fk-pin=<d>][data-state=planted|readable|straddle]`, `[data-fk-pin-chip]`,
`[data-fk-plant]`, `[data-fk-start]`, `[data-fk-verdict=readable|straddle|]`, `[data-fk-glue]`, `[data-fk-target=<a/d>][data-done]`,
`[data-fk-next]`, `[data-fk-back]`, `[data-fk-same]`, `[data-fk-formal]`, `[data-fk-girl][data-mood]`.

## 2unvicies. Euclidean division for any divisor and the bracket of the quotient — `egg-trays` (2AM unit 2, 2026-10-14)

`operations/EggTrays.jsx` on `logic/eggTrays.js` (integers through `core/arithmetic/divisibility.js › divmod`, imported by path; floats
only DRAW the marker), drawings in `primitives/EggFigure.jsx` (`Egg`, `TrayBody` — b cells in `trayGrid(b)`, exactly r eggs filled column
by column —, `CartonLid`, `FullTraySlat`, `Pallet`; tested in `primitives/eggFigure.test.jsx`), lesson `qisma-iqlidiya-hasr` (theme
`farm`). The net forbids rebuilding the 1AM lab (`2am.m1.r04` EXTENDS `1am.m3.r01`), so the variable changes (DNA §12): `division-jumps`
puts q in the hand; here b is given and the hand holds **a, the eggs swept from a conveyor into trays** — the first division lab that
holds the dividend. A tray CLOSES by itself at b (a stamp), so it never holds b eggs open: r < b is physical at every scale. Under the
belt, the **trays ruler** is the SAME line read ÷ b (the belt is drawn at the ruler's scale; a dashed plumb line joins the belt handle to
the marker « a ÷ b » at q + r/b), and a **zoom** magnifies [q ; q + 1] as the open tray itself, filled to r/b. What 2AM adds — the
quotient is a NUMBER strictly between q (trays full, by default) and q + 1 (trays needed, by excess), ON a graduation iff r = 0 — is
DISCOVERED by framing it.

| World (level) | What the hand holds | What resists |
|---|---|---|
| `carton` (مبتدئ, platform, Salma in hijab `scarf="mint"`: 50 eggs, cartons of 12 = 2 × 6, ruler 0 … 7, every egg drawn on the belt — `beltLayout`, each egg above i ÷ b) | 1) a one-unit FRAME on the ruler, placed before the first egg (drag / tap the ruler / ←→ / −/+); 2) the belt handle (drag / tap the belt / ←→ ±1, Page ±b / −/+ ±1 egg, ±1 carton) | the belt is LOCKED until the frame is placed (the bet); the frame is LOCKED while eggs flow (0 < a < order) — a bet is not corrected by watching the marker; the belt stops at the last egg (the orange stop shakes, `[data-et-end]`); at the full order the frame is judged — `right` / `below` / `above` (gap in cartons) / `remainder` (the frame on [r ; r + 1]) / `onMark` |
| `tray` (متقدم, textbook نشاط 1 p. 24: 2145 eggs, trays of 30 = 5 × 6, ruler 0 … 74 labelled every 10, ticks every 1) | the same two gestures, plus ±10 trays (±300 eggs) and frame ±10 — the steppers ARE the division by hand (pallets, trays, eggs) | the same; the belt shows the COUNT left; ten closed trays tie into a pallet (`[data-et-pallet]`, the strap draws itself): 7 pallets + 1 tray = 71, the place value of q is SEEN |

Contrast (§7quater, same lab): after the right frame a card « بيض إضافي! » (`[data-et-next]`) grows the order to
`then` (default the next multiple of b: 60, 2160); the frame becomes a bet again (`placed: false`); at the full order the last tray closes
EXACTLY, the marker lands ON 5 / 72: a frame there is judged `onMark`; the student must tap « يقع على عدد طبيعي » (`[data-et-exact]`,
offered at every full order, wrong on 2145). Then (متقدم, `claim`) the farmer's son's card « 2145 = 30 × 70 + 45 »: أوافق / لا أوافق, and
either way his state is REPLAYED (70 trays in 7 pallets, 45 loose eggs poured: one more tray closes at 30, 15 remain) — `ok` = disagreed.
`discoveryReady` = the order done (right frame; or exact when b | a) + `then` done + the claim judged. Discovery « متى يقع حاصل القسمة
على عدد طبيعي بالضبط؟ » → « عندما لا تبقى علبة / صفيحة مفتوحة: الباقي معدوم »; wrong options refuted with the student's numbers
(`refutations`: « even » by a0 if even, else the last EVEN count he swept with r ≠ 0 — 2140 = 30 × 71 + 10 —, else a neighbour; « more eggs
than a tray » by a0 itself and a multiple of b he swept; the « even » option is dropped when b = 2). Formal (`[data-et-formal]`): the
equality and `r < b` with the المقسوم chip + the shared `DivisionRoles`, the bracket `q < a/b < q + 1` (a stacked fraction), then a
SECOND short question inside the formal block (`[data-et-ends]`, « ماذا يمثّل طرفا إطارك؟ », the wrong « الحاصل والباقي » refuted with
the frame and r) that unlocks the names « قيمة مقرّبة إلى الوحدة بالنقصان / بالزيادة » (`[data-et-approx]`, a « renvoi en avant » to
`kasr-hasil-qisma`), `then/b = q` ⇒ « b يقسم … » « … مضاعف لـ b » « … يقبل القسمة على b », and the son's line struck (« 45 > 30 »).

Props `a`, `b`, `then?`, `claim?` ({ q, r } or null), `world` ('carton' | 'tray'), `max?` (default ⌈max(a, then) ÷ b⌉ + 2), `level`, `levels`,
`title`, `lead`, `onTrial` — `{ kind: 'frame', a, b, q, r, n, ok, model }` | `{ kind: 'exact', a, b, q, ok }` | `{ kind: 'claim', a, b, claimQ,
claimR, agree, ok }`, every trial reported once even when two land in one render —, `onFinished({ a, b })`. Not eligible for « جرّب كل
الإمكانيات » (each frame and claim is an answer); no auto-completion. Default: frame [0 ; 1] NOT placed, 0 eggs — neither is a trial.

**Look and one screen (kit §8ter, DNA §17).** No visible title (DNA §17.9: the shell gets `titleHidden`, its `<h3>` stays for screen
readers): a `PromptCard` opens on the CONTEXT with every number (`[data-et-context]`, « جمعت سلمى 50 بيضةً، وكل علبة تتّسع لـ 12 بيضةً. »)
then ONE question naming the goal and the end state (`[data-et-question]`, « ضع إطارك حيث يقع 50 ÷ 12، ثم املأ العلب حتى يفرغ
الحزام. »; `[data-et-order]` on the pair), a lamp lit by a right verdict, then the live pills — full / open, and at متقدم pallets / trays /
open / belt, each with what it counts (« بيض في العلبة المفتوحة ») — over a `StageFrame`. No bare number or control (§17.9): the ruler
carries its caption (`[data-et-ruler-caption]`, « المسطرة: عدد العلب / الصفائح »), the frame pill its label « إطارك », the zoom its caption
(`[data-et-zoom-caption]`, « العلبة المفتوحة مكبّرة »), the belt handle « معبّأ », every −/+ pair the step it adds (« بيضة واحدة »,
« علبة كاملة », « بتدريجة »… — ABOVE the two buttons on narrow screens), the exact button its quotient (« 50 ÷ 12 يقع على عدد طبيعي »), and
the son's replay pills their meaning (« صفائحه المملوءة », « تُملأ صفيحة », « ويبقى »); the scene: a plank wall, a
belt on rollers, the closed cartons (lids) or tray slats on their ruler segments, the open one dashed with r eggs, the ruler, the frame as a
translucent column with bracket ends and its pill (a lock while eggs flow), the zoom, and the farm child at the belt's end (`KidFigure`:
Salma at مبتدئ, the son at متقدم — `mood` happy / wonder / neutral / proud). ONE action panel at a time: ≥ 600 px a side card shows the
FRAME controls before and after the fill (+ the exact button at the full order) and the EGG steppers during it, then the claim card
replaces it; narrower, the same pairs live in a strip INSIDE the stage whose height is FIXED per world (1 / 2 rows, 2 / 3 below 300 px —
full-width pairs), the contrast becomes a one-line card in that strip, and the claim card is laid over the ruler and zoom (without the
kid, who is in the scene) — the stage never changes height between phases. The `VerdictBanner` under the stage keeps its place and
says the gesture once per phase (frame / fill / full). The zoom yields height to the budget (`useLessonViewport` minus the measured
prompt and verdict: 110 → 34 px); on compact widths the belt, gaps, ruler captions and zoom foot are tighter, and on wide screens the contrast
card takes the side column (it replaces the frame card) instead of adding a row. Measured glance (`[data-et-glance]`, both levels, every
state, 2026-10-14 after the §17.9 labels): ≤ 663 / 800, ≤ 663 / 768, ≤ 676 / 844, ≤ 618 / 640 px. DOM: `[data-egg-trays][data-world][data-a][data-b]
[data-count][data-solved][data-layout]`, `[data-et-glance]`, `[data-et-order]`, `[data-et-reading]` / `[data-et-read=<key>]`,
`[data-et-handle]` (slider, `aria-valuenow` = eggs, `aria-disabled` while the belt is locked), `[data-et-step=egg|tray|pallet][data-dir=less|more]`,
`[data-et-frame-step=1|10][data-dir]`, `[data-et-panel=frame|eggs]`, `[data-et-strip][data-rows]`, `[data-et-belt-egg=<i>]` (carton) /
`[data-et-belt=<left>]` (tray), `[data-et-end]`, `[data-et-tray=<i>][data-full]`, `[data-et-pallet=<i>]`, `[data-et-open][data-eggs]`,
`[data-et-ruler=<max>]`, `[data-et-marker][data-q][data-r]` (from the first egg), `[data-et-zoom=<q>]`, `[data-et-frame][data-n][data-state=idle|right|wrong]
[data-placed][data-locked]`, `[data-et-frame-handle]` (slider), `[data-et-exact]`, `[data-et-next]` / `[data-et-next-button]`, `[data-et-claim]
[data-verdict=agree|disagree]`, `[data-et-claim-answer=agree|disagree]`, `[data-et-replay=heap|poured]`, `[data-et-verdict=<kind>][data-et-refused=<model>]`,
`[data-et-formal]`, `[data-et-bracket]`, `[data-et-ends]` / `[data-et-ends-option]`, `[data-et-approx]`, `[data-et-says]`, `[data-et-formal-claim]`,
`[data-lab-fold=egg-trays.trials]`. Tests: `logic/eggTrays.test.js` (a ∈ 0..3000 × b ∈ 1..60 state and marker sweeps, the frame judge on
every (a, b, n), the claim sweep, the flow and gate, the refutation picks, the ruler / belt / zoom geometry at five widths),
`operations/eggTrays.render.test.jsx` (both levels, says-it-once, no rule word reachable before the discovery, hints free of q, q + 1, r).

## 2duovicies. The fraction is the quotient — `fair-share` (1AM unit 4, 2026-10-15)

`operations/FairShare.jsx` on `logic/fairShare.js` (every verdict exact through `core/arithmetic/linear.js` — `frac`, `mul`, `sub`, `cmp`,
`fracText`, `fracDecimal`, imported by path), drawing `primitives/CakeFigure.jsx › Cake` (a ROUND cake: the circle IS the fraction), children `KidFigure` (girls in hijab), theme
`bakery`; lesson `hasil-qisma-kasr`. `a` round cakes lie on a festive table (bunting, المولد النبوي الشريف) for `b` children. **Two DISCRETE steps, no slider** (owner, 2026-10-15):
« قسّم كل كعكة إلى n قطع » (n = 1…12, `setN`, every cake shows its n cuts at once) and « كل واحد يأخذ m قطع » (`commitM`, each press is a judged
trial, m = 0 is none). A child's share is m / n cake. The lab PAINTS the b shares as coloured SLICES on the cakes (kid i takes the interval
[i·x, (i+1)·x] of the cake line; a share may straddle two cakes — `logic/fairShare.js › slicesOf`; each kid keeps a plate with his slice) and judges
b × x against a: `exact` (every cake fully taken), `short` (an untouched sector outlined in rose dashes stays on the table), `over` (ghost cakes in
rose dashes past the last real one: cake that does not exist). Cutting in n = b parts lands for every a and b ≠ 0 (m = a); any n lands iff b divides
a·n; **n = 10 (tenths, `DECIMAL_SPLIT`) never lands for the four lesson orders** — that is the contrast and the source of the student's own decimal
bounds (« 0,6 approchée, 0,7 approchée »). Trials carry `ruler: 'cut' | 'dec' | 'other'` (n = b, n = 10, else). Not `division-jumps` (b given, the hand
holds the number of groups), not `fraction-knife` (the share is fixed, the hand holds the number of pieces), not `egg-trays` (the hand holds the
dividend): here the hand cuts AND picks the unknown QUOTIENT itself.

| Level | Orders (a, b) | What resists |
|---|---|---|
| مبتدئ (`canteen`, platform) | 3 ÷ 4, then « طلب جديد » 2 ÷ 3 | tenths never land (3 ÷ 4: 2,8 then 3,2; 2 ÷ 3: 1,8 then 2,1); quarters / thirds do |
| متقدم (`family`) | 5 ÷ 6, then 7 ÷ 3 | never decimal; the share of 7 ÷ 3 exceeds one cake (a child may take up to ⌈a/b⌉ cakes) |

`discoveryReady`: every lesson order solved (by whichever cut the student chose). Discovery « كيف نكتب حصّة الواحد…؟ »: right « بكسر بسطه عدد
الكعكات ومقامه عدد الأطفال » (no digit), wrong « بعدد عشري… » refuted with the student's nearest decimal trial (`refutations`: x, total, gap) and
« الكسر مقلوب » refuted with b × b/a. Formal: a ÷ b = a/b, b × a/b = a, the decimal when it exists, else the student's own two decimal bounds
(« قيمة مقرّبة بالنقصان / بالزيادة », the exact value is the fraction). Props: `scene` ('canteen' | 'family'), `orders` [[a, b], …], `level`, `levels`,
`title`, `lead`, `onTrial` — `{ order: '2/3', ruler, n, m, x: 'm/n', kind, ok, free }` — and `onFinished({ orders })`. Not eligible for « جرّب كل الإمكانيات »
(each choice is an answer). LabCoach: `coachOf` = `pieces` · `again` · `split` · `next` (controls only; unit test follows it to the end).
Layout: `PromptCard` §17.9 (context with the numbers, ONE question « اختر حصّة الواحد حتى توزَّع الكعكات كلها بالضبط. », lamp, live pills ≥ 380 px),
`StageFrame` scene (cakes with coloured slices, kids with plates), control card (the two −/+ steppers: split, take), `VerdictBanner`, `LabFold`
trials. Measured glance (`[data-fs-glance]`): ≤ 705 / 800, ≤ 584 / 844, ≤ 609 / 640 px (1366 × 768 in the unit e2e). DOM: `[data-fair-share][data-scene]
[data-order][data-split][data-solved][data-layout]`, `[data-fs-glance]`, `[data-fs-prompt][data-lit]`, `[data-fs-scene]`,  `[data-fs-read=share|total]`, `[data-fs-cake=<i>]`,
`[data-fs-table]`, `[data-fs-bunting]`, `[data-fs-split][data-n]`, `[data-fs-take][data-m]`, `[data-fs-step-less|more=split|take]`, `[data-fs-step-value=split|take]`, `[data-cake-slice=<kid>]`, `[data-fs-plate-share=<kid>]`, `[data-fs-gap]` (the untouched sector), `[data-fs-over]` / `[data-fs-ghost=<i>]` (a ghost cake),
`[data-fs-free][data-active]`, `[data-fs-free-field=cakes|kids]`, `[data-fs-free-less|more=cakes|kids]`, `[data-fs-free-value]`, `[data-fs-free-back]`, `[data-fs-kid=<i>][data-mood]`, `[data-fs-verdict=exact|short|over]`, `[data-fs-next]`,
`[data-fs-next-button]`, `[data-fs-back]`, `[data-fs-formal]`, `[data-lab-fold=fair-share.trials]`. Tests: `logic/fairShare.test.js` (a ≤ 12 × b ≤ 9
sweeps: n = b lands at m = a, any n lands iff b | a·n, tenths never land for the lesson orders, the share limit never ends on the exact share; the flow, the formal bounds, the
refutations, the coach followed to the end, geometry at five widths), `operations/fairShare.render.test.jsx`; browser `e2e/lesson-kit/1am-hasil-qisma-kasr.mjs`.

**« جرّب أعدادك أنت » — always open (owner, 2026-10-15).** Under the lab, a card with two steppers (cakes 1–12, kids 2–8; `FREE_LIMITS`) lets the student
test ANY other numbers at any moment, from the numbers he is on. `setCustom(s, a, b)` opens ONE free order after the lesson orders (`s.base` = the
number of lesson orders, `isFree(s)`): it restarts (split, pieces, trials of the free order) at every change, its trials carry `free: true` (the lesson
module ignores them — `Module01Nashat.record`), and it NEVER counts for `discoveryReady`, `canNext`, `formalOf` or `finishedEvidence`. « عُد إلى مسألة الدرس » (`toGuided`) returns
to the first lesson order not solved yet. Any new lab of this family should keep this rule: the student can always try his own numbers, and what he
tries on his own never pollutes the guided evidence. Cakes layout: `cakesLayout` (N = b × railMax round cells in 1–3 rows, never overlapping, swept at
five widths); the 1AM lesson words are « كعكة / كعكات » (book independence: the lab's words are the platform's own, `LESSON_DEVELOPMENT_GUIDE.md` §4ter-bis).

**Naming a and b, and why b ≠ 0 (owner, 2026-10-15).** Formal phase: a labelled key « ماذا يقول الحرفان a و b؟ » (`[data-fs-key]`: a = the cakes on the
table, b = those who share them, same colours as the fraction written for each of the student's own orders, `[data-fs-frac]`), then « لماذا لا يمكن
أن يكون b = 0؟ » (`[data-fs-nonzero]`: nobody to give a share to; × 0 always gives 0, so no number times 0 gives a). In the free card a button
« وماذا لو لم يكن هناك أيّ طفل (0)؟ » (`[data-fs-zero-button]` → `[data-fs-zero]`) lets the student test b = 0 on his own cakes (the kids stepper stays ≥ 2: 0 is
explained, never simulated). Module 2 repeats it as a platform-worded definition + a TapQuestion on ÷ 0.

## 2tervicies. The comma under the hand — `decimal-comma` (1AM unit 1, 2026-10-15)

`operations/DecimalComma.jsx` on `logic/decimalComma.js` (every verdict exact through `packages/core/arithmetic/decimals.js`, imported BY PATH —
never the core barrel), drawing `primitives/MosaicFigure.jsx` (the pieces, the tray, the client's table, `TenMachine`, the craftswoman — a girl in
hijab, `KidFigure`), `primitives/mosaicLayout.js` (pure block layout) and `primitives/CommaSlip.jsx` (the slip of digit tiles and its comma handle);
theme `mosaic`; lesson `kusur-ashriya-kitaba` (module 1 = the `mosaic` world, module 4 = the `machine` world). **The DIGITS are printed and fixed;
the hand holds the COMMA** — its place in the string of digits, i.e. the number of digits after it (`point = len − pos`). The value is N / 10^point, an
OUTPUT: drawn in honest blocks (`mosaic`) or read on rank names (`machine`). Not `rank-exchange` (the hand moves QUANTITIES between ranks, the written
digits are an output), not `digit-cards` (the digit is the object), not `fraction-knife` / `fair-share` (the hand holds a number of pieces / a share).
What resists: the comma never leaves the string of digits; in `machine` it cannot pass the last digit (a zero must be ADDED there first).

**Arithmetic — `core/arithmetic/decimals.js`.** A value is `{ n, k }` = n / 10^k (`n` a safe integer ≥ 0; comparisons and shifts through BigInt, text made
digit by digit — no float). Public API: `make`, `fromSlip(digits, point)`, `parse('2,35' | '2.35' | '3125/1000')` (the denominator must be a power of ten, else
`null`), `cmp` / `eq`, `normalize`, `format` (keeps the k decimals) / `formatTrim` (2,50 → 2,5), `slipText(digits, point)` (the slip as written: `('05', 2)` →
`0,05`, `('235', 3)` → `0,235`), `slipValueText`, `fractionOf` / `fractionText` (`235/100`, `235/1`), `shift(v, e)` (× 10^e, exact), `opExponent('×1000' | '÷100' | '×0,01' …)` and
`OPERATORS` (the nine of the machine), `integerPart`, `countOfExp(v, e)` (« عدد الأعشار » = `countOfExp(v, −1)`: 217,48 → 2174), `rankName(e)` (الآحاد …
الأعشار، الأجزاء من مائة، من ألف …), `exponentsOf(digits, point)`, `decomposeDigits` / `rankTable` / `decomposition(v)` (`2 + 3/10 + 5/100` and `2 + 3 × 0,1 + 5 × 0,01`, empty ranks
absent), `partName(k, count)` + `readFraction` (« مائتان وخمسة وثلاثون جزءًا من مائة ») + `readTail` (« ثلاثة أعشار وخمسة أجزاء من مائة »; the noun agrees with
the last two digits from 100), `piecesOf(v)`. Tests: `arithmetic/decimals.test.js` (14 blocks: parse / format round trip over every string of ≤ 5 digits at every comma place, exact compare, shift ± 3 reversible, the
Arabic reading).

**Tasks** (the `tasks` prop; a single object is tolerated; digits are a STRING of 1–6 Latin digits, may start with 0):

| kind | fields | the job | judged by |
|---|---|---|---|
| `match` | `digits: '235'`, `target: '2,35'` | the client's table shows the target in blocks; slide the comma until the workshop tray equals it | exact value N / 10^p = target |
| `fraction` | `digits: '3125'`, `target: '3125/1000'` | no blocks on the client's side: an ORDER card with the fraction (the zeros of the denominator drawn as boxes); the tray still shows the slip's blocks | exact value = target |
| `shift` | `start: '143,75'`, `op: '×1000'` | `machine` world: input slip (comma fixed) → machine → OUTPUT slip that starts with the same digits and the same comma | exact value = start × 10^e |

Presets (`levels.js`, the lead's): مبتدئ `[match 235→2,35, match 37→0,37, match 05→0,05]`, متقدم `[fraction 3125/1000, fraction 605/100, match 250→2,5]` (each target has exactly ONE
comma place — tested, `solutions()`). The `machine` tasks come from the module (`MACHINE_PRESETS` in `logic/decimalComma.js` when it passes none): مبتدئ `3,5` ×10 · ×100 · ÷10 · ÷100,
متقدم `143,75 ×1000 · 43,7 ÷1000 · 27,5 ×0,1 · 0,6 ×0,01`. Zeros each shift task needs (`zerosNeeded`, tested): ×10 → 0, ×100 → one on the right, ÷10 → 0, ÷100 → one on the left; ×1000 of 143,75 → one on
the right, ÷1000 of 43,7 → one on the left, ×0,1 of 27,5 → 0, ×0,01 of 0,6 → one on the left (×1000 of 3,5 would need two on the right).

**The slip (both worlds).** `CommaSlip`: a LTR island of big digit tiles (≥ 40 px tall; the digit is its own, never moved), `len + 1` gaps, a round **comma handle** (48 px, a `role="slider"`
button: `aria-valuenow` = point, `aria-valuetext` = the number as written) in a lane above the tiles with a small rail and chevrons. Three paths, same result: **drag** the handle (it follows the
pointer, the nearest gap lights, it snaps on release; pulled at least HALF A STEP beyond an end it reports the out-of-string intent), **tap a gap** (every gap is a button one step wide: tapping a tile picks the nearest
gap), **keyboard** on the handle (← → one gap — the island is LTR: ArrowLeft goes left —, Home / End). A release that changes nothing is NOT a trial (§6bis.2: a default is not a trial); every other release
is judged and reported ONCE; a keyboard step is a release (so ArrowLeft ×2 from « 235 » passes « 23,5 » then judges « 2,35 »). The comma is written between the tiles (a drop with a tail); an integer shows none; before
the first digit the slip prints a ghost `0` (« 0,235 »). Under each tile the **rank pill** follows the comma (colour = the rank: units teal, tenths amber, hundredths rose, thousandths violet, above indigo / blue):
the same colours as the pieces and the pill is the only place the rank name is written. Beside the lab, the **readout**: the number as written (`[data-dc-written]`, e.g. `2,50` — trailing zeros kept) and its fraction
(`[data-dc-fraction="235/100"]`, the denominator's zeros drawn as boxes; a whole number shows `/1`).

**World `mosaic` (the zellige workshop).** One PANEL = 10 × 10 tiles = 1; a STRIP is one column of 10 tiles as tall as the panel (1/10); a TILE is one tile (1/100); a SHARD is ONE of the ten
slivers of a tile (1/1000) — too fine for the scale, so it is shown in a **magnifier** (the tile enlarged, cut in 10, as many slivers filled as the thousandths digit) and `[data-dc-block=shard]` counts the filled
slivers. Every rank ABOVE the units (tens, hundreds …) collapses into ONE symbol — a stack of panels with a « ×N » badge (`[data-dc-block=panel][data-count=N]`, N exact; not to scale: the badge IS the count). Digits finer than
the shard (a 4th decimal in the free panel) are not drawn: a pill « + أجزاء أصغر من شظية » says so without lying about their size. One panel side `s` is chosen PER TASK (the smallest that fits the client's table and the tray at every
comma place, `mosaicLayout.commonScale`), so the table and the tray are drawn to the same scale and the size of the pieces changes when the comma moves while nothing jumps. Two zones: **طاولة الزبون** (the target as blocks, or the order
card for `fraction`) and **صينيّة الورشة** (the slip's amount, re-drawn at every comma move, a short « fall » of the pieces — instant under `prefers-reduced-motion`). Verdict (a banner that never moves the stage): `exact` — the tray's
label turns into the « مطابق » stamp, the craftswoman is proud —, `more` / `less` — « في الصينيّة 23 لوحةً و5 أعمدة: أكثر ممّا طلب الزبون » (`exact` says only « الصينيّة تطابق طاولة الزبون بالضبط ») (her own pieces, never the rule, never where the comma should be). A solved task stays solved;
the comma stays movable.

**World `machine` (« آلة العشرة »).** Input slip (read-only, its ranks named) → a glass machine with the operator pill (`[data-dc-op]`, the links of every digit visible through it) → the OUTPUT slip (the student's). Two `+ 0` buttons at the
ends of the output (`[data-dc-zero=left|right]`, at most 3 each side; the outermost added zero is removed by tapping it). **An added zero never changes the value** — the comma stays attached to the digits it was between (left zero:
`pos + 1`; right zero: `pos` unchanged; `activeOf`, `addZero`, `removeZero`, tested). The output tiles stay vertically aligned with the input digits (the core digits keep their x; zeros extend outward), the rank pill of every digit that moved gets an
amber ring and a `+3` / `−2` chip (the digit's own rank change on HIS board). A release beyond the last digit (pulled half a step past an end, or a key pressed at the end) is **refused with `nodigit`** (« لا رقم هنا: أضف صفرًا »): the comma sits at
the end, the slip shakes (`dc-shake`, without remounting: the keyboard focus stays on the handle) — unless the value at the end is already right (then it is an ordinary `exact`). Judged on every release and every zero change:
`exact` · `more` · `less` (« بطاقتك تقرأ 0,35: أكبر ممّا تُخرجه الآلة »). The leading zero before the comma is automatic; an extra zero is never an error when the value is right, and the formal phase shows the writing WITHOUT unnecessary zeros.

**« جرّب أعدادك أنت » — always open.** A card under the glance with a digits field (≤ 5 digits, `inputMode` numeric in `mosaic`, decimal in `machine` where ONE comma may be typed: « 14,37 » sets the input comma) and, in `machine`, the nine operators
(`D.OPERATORS`). Typing starts a free board (`setFree`, `setFreeOp`): its trials carry `free: true` and NEVER count for `discoveryReady`, `canNext` or `onFinished`; « عُد إلى مهامك » (`toGuided`) returns. In free `mosaic` the left zone disappears (no target)
and the banner reads the tray (« على الصينيّة … »); in free `machine` the judge compares with the chosen operator.

**Discovery and formal phase.** `discoveryReady` = every task of the sequence solved. Discovery (`ManipulationDiscovery`) — mosaic: « ماذا يغيّر موضع الفاصلة؟ », right « كل خطوة نحو اليمين تجعل القطعة التي يعدّها الرقم أصغر بعشر مرّات » (no digit), wrong
« الفاصلة لا تغيّر المقدار، بل طريقة قراءته فقط » (refuted with his own boards: the digits 235 wrote `235` then `0,235`; `sameDigitsPair`) and « العدد الذي فيه أرقام أكثر بعد الفاصلة أكبر دائمًا » (« في 0,235 3 أرقام بعد الفاصلة، وفي 23,5 رقم واحد فقط،
ومع ذلك 0,235 هو الأصغر »); machine: « ماذا فعلت الآلة بأرقام عددك؟ », right « نقلت كل رقم عدد المراتب نفسه … », wrong « غيّرت الأرقام نفسها » and « أضافت أصفارًا فقط » (refuted with the task that needed the fewest zeros, `machineWitness`).
Formal, mosaic: one card per solved task (`2,35 = 235/100`, its reading, the decomposition in both forms, empty ranks absent), the rank table of the LAST task (zero ranks greyed), « عدد الأجزاء من مائة في 2,35 هو 235 » once, the zero that keeps an empty place
(0,05) and, if a task ended with a useless zero, `2,50 = 2,5`; formal, machine: the before / after rank table of the last task and « ÷100: انتقلت الفاصلة مرتبتين إلى اليسار » in HIS numbers, the writing without useless zeros, the rule.

**Props.** `world` ('mosaic' | 'machine'), `tasks`, `level`, `levels`, `title`, `lead`, `coach` (default true), `onTrial`, `onFinished`.
`onTrial({ task, kind, digits, point, shown, value, target, ok, verdict, zeros, free })` — `task`: index of the guided task (a free trial keeps the current one), `kind`: `match` | `fraction` | `shift` (a free `mosaic` trial reports `match`),
`digits`: the slip's digits INCLUDING added zeros, `point`: digits after the comma, `shown`: the slip as written (`2,50`), `value`: exact, trailing zeros dropped (`2,5`), `target`: the task's string (`2,35`, `3125/1000`) or the machine's result (`143750`) or `null` (free `mosaic`),
`ok` true ONLY when value = target, `verdict`: `exact` | `more` | `less` | `nodigit` | `null` (free `mosaic`), `zeros: { left, right }`, `free`. `onFinished({ tasks })` — ONCE, when every guided task is solved (before the discovery is answered; `tasks` = the task objects as given).
Not eligible for « جرّب كل الإمكانيات » (every release is the student's experiment). LabCoach: `coachOf` = `grab` · `move` (the handle) · `zero` (after a `nodigit` refusal, the « + 0 » of the side pushed against) · `next` — never where the comma should end; followed to the end of every task of both worlds
and levels in `logic/decimalComma.test.js`, strings `decimalComma.coach.*`.

**Layout.** `[data-dc-glance]` = the prompt (CONTEXT with every number, then ONE question, no title — « حرّك الفاصلة حتى تتطابق الصينيّة مع طاولة الزبون. »), the stage, the readout and the banner; the free card sits below the glance. Lab width ≥ 700 px: the stage on one side and a column
(the craftswoman scene, the readout, the banner) on the other; below 700 px the readout and the banner share a row and the craftswoman is the round avatar at the banner's start (she « speaks » the verdict). The stage height comes from `useLessonViewport` (the `overhead` measure is
hysteresis-guarded: without the guard two heights chased each other in `machine`). All numbers are LTR islands, Arabic is DOM text. Measured glance (`[data-dc-glance]` height / viewport; lab width): ≤ 846 / 1024 at 768 × 1024 (lab 494 px), ≤ 753 / 768 at 1024 × 768 (lab 414 px), ≤ 761 / 800 at 1280 × 800 (lab 670 px), ≤ 699 / 768 at 1366 × 768 (lab 756 px), ≤ 664 / 1080 at 1920 × 1080 (lab 1310 px), both worlds, both levels, initial and every mid-activity state of the sweep.

**DOM.** `[data-decimal-comma][data-world][data-task][data-solved][data-layout]`, `[data-dc-glance]`, `[data-dc-slip=input|output][data-dc-point]`, `[data-dc-digit=<i>][data-added=left|right]`, `[data-dc-comma][data-point][data-dragging]`, `[data-dc-gap=<j>][data-here]`,
`[data-dc-rank=<i>][data-exp][data-changed]`, `[data-dc-delta]`, `[data-dc-ghost]`, `[data-dc-written]`, `[data-dc-fraction="N/D"]`, `[data-dc-table=target|tray]`, `[data-dc-order]`, `[data-dc-block=panel|strip|tile|shard]` (`data-count` on a bundle),
`[data-dc-lens]`, `[data-dc-op]`, `[data-dc-machine]`, `[data-dc-link]`, `[data-dc-zero=left|right]`, `[data-dc-verdict=exact|more|less|nodigit]`, `[data-dc-prompt][data-lit]`, `[data-dc-context]`, `[data-dc-step=<i>][data-done]`, `[data-dc-next]`, `[data-dc-stamp]`,
`[data-dc-free][data-active]`, `[data-dc-free-digits]`, `[data-dc-free-op]`, `[data-dc-free-op-button=<op>]`, `[data-dc-free-back]`, `[data-dc-formal=mosaic|machine]`, `[data-dc-kid=<mood>]`, `[data-lab-fold=decimal-comma.trials]`, the LabCoach markers.

**Tests.** `logic/decimalComma.test.js` (every digit string ≤ 4 digits at every comma place: value N / 10^p; each preset target has one comma place; the zeros each shift task needs; judge verdicts, `nodigit`, zeros keep the value; the free panel never counts; the coach followed to the end of the 4 suites; blocks equal the digits;
the slip layout swept at five widths; the discovery witnesses), `primitives/mosaicLayout.test.js` (honest sizes, nothing overlaps, everything inside its zone at four zone sizes, the exact bundle count), `primitives/mosaicFigure.render.test.jsx` (the DOM counts = the digits at every comma place; the handle is a slider ≥ 44 px),
`operations/decimalComma.render.test.jsx` (both worlds × both levels render, no raw key, context then ONE question, says each thing once, no prompt / hint / idle line leaks the rule, counted nouns, discovery and formal from real states). Browser: `e2e/lesson-kit/1am-kusur-ashriya-kitaba.mjs`.

## 2quatervicies. The ruler graduation under the hand — `ruler-compare` (1AM unit 1, lesson `muqaranat-adad-ashriya`, 2026-10-15)

`operations/RulerCompare.jsx` on `logic/rulerCompare.js` (exact, through `packages/core/arithmetic/decimals.js` imported BY PATH), drawing `primitives/RulerTape.jsx` (the yellow tape on the sand) and `primitives/KidFigure.jsx`
(girls in hijab: `JUMPERS` alternate girl / boy); theme `sandpit`; world `jump` (the only one). **The hand holds the GRADUATION of the measuring ruler** shared by the numbers being compared (m · dm · cm · mm), and in `order`
also places the jumps on the podium. Not `decimal-comma` (the digits are fixed, the hand holds the COMMA), not `rank-exchange` (quantities between ranks), not `fraction-knife` (the number of equal pieces of ONE whole).

**Arithmetic (added to `decimals.js`).** `GRADUATIONS`, `readAt(v, g)` → `{ count: ⌊v·10^g⌋, rest: {n,k} ∈ [0;1[ exact, restIsZero }`, `decidedAt(a, b, g)` (the readings differ, or both fall on the same mark: monotone in g),
`verdictAt`, `minGraduation(a, b)` (= `firstDifferingRank` when a ≠ b; = the longer normalised length when equal), `firstDifferingRank`, `paddedText(v, k)` (4,6 → 4,60), `rowGraduation(values)`. Sweep-tested on > 100 000 pairs.

**Tasks** (the `tasks` prop; one object tolerated):

| kind | fields | the job | judged by |
|---|---|---|---|
| `compare` | `a: '4,6'`, `b: '4,35'` (comma, 1–3 decimals, whole part 0–99) | set the graduation until the ruler separates (or equals) the two jumps, then choose `<` `=` `>` for `a ? b` | exact `cmp` |
| `order` | `values: [3–6 strings]`, `dir: 'asc'\|'desc'` | ONE graduation for the row, then place the jumps in the podium slots (left = first); « تحقّق » | exact order, equal values in any order |

Presets (`levels.js`): مبتدئ 4 compares (4,6/4,35 → dm · 8,05/8,5 → dm · 12,70/12,7 equal from dm · 9,87/10,2 → m), متقدم 2 orders (asc with 7,4 / 7,405 needing the mm; desc with the tie 2,5 = 2,500 and the integer 3).

**What the student sees.** Each jump = a lane: a KidFigure, its bib (name + the written number, the thing to compare) and a tape: the LAST whole graduations of the reading (numbered cells, the last one dark = the reading), then the LEFTOVER cell,
hatched, drawn as the exact fraction of one graduation, and the flag at the exact position; a too-long reading is cut on the left (zigzag), a short one starts on the take-off board. The tape never shows the full length to scale (no verdict by eye).
Beside it the reading badge « n ديسيمتر + باقٍ / بلا باقٍ » (Latin digits). The **ruler control**: a yellow strip of four cells (the tick density grows: 2, 9, 19, 39 ticks) and a 52 px knob (`role="slider"`; drag, tap a cell, ← →); a **lamp**
« المسطرة تفصل / لا تفصل بعد ». **Resistance:** the verdict (or « تحقّق ») is REFUSED while the ruler cannot separate (rose banner with the student's own readings: « كلتاهما تُقرآن 46 ديسيمترًا » — never which finer ruler);
a wrong verdict on a deciding ruler is refuted by the readings; a right one SHOWS (the two bibs become the written numbers with the first differing rank highlighted and the completed zeros ghosted); a wrong order shows the FIRST inversion
with its readings. Placing: pointer drag (ghost follows the finger; drop on a slot or back on the sand), tap-tap (select a jump, tap a slot; a placed jump can be picked up), keyboard (Tab / Enter / ← →).
**Always-open « جرّب أعدادك أنت »**: two inputs (comma or dot, ≤ 3 decimals, whole part ≤ 99) put the same stage on the student's pair; `free: true` trials never count. Not « جرّب كل الإمكانيات ».
**Discovery** « ما الذي يحدّد أيّ العددين أكبر؟ » with two wrong options refuted by HIS pairs (`witnesses`: more decimals but smaller; the digits after the comma read as a natural number); formal phase: each solved comparison written with the
first differing rank highlighted, completed with zeros and as two natural readings, the order chain with its symbols, the rule once. LabCoach (`coachOf`: `ruler` → `verdict` → `next`; `ruler` → `place` → `check` → `next`) never points at an answer.

**Callbacks.** `onTrial({ task, kind: 'compare'|'order', event: 'ruler'|'verdict'|'place'|'check', g: 0..3, a, b, verdict: '<'|'='|'>'|null, ok: true|false|null, decided, free, … })`: `ruler` (graduation changed; `ok` null),
`verdict` (`ok` null + `refused: 'coarse'` when refused), `place` (+ `jump`, `slot` (null = back to the sand), `text`, `order`), `check` (+ `order`, `inversion`, `refused`; `a`/`b` = the first inverted pair). `onFinished({ tasks })` once.
**DOM.** `[data-ruler-compare][data-world][data-kind][data-task][data-solved][data-layout=wide|medium|narrow]`, `[data-rc-glance]` (≤ 980 px wide), `[data-rc-grad=0..3][data-active]`, `[data-rc-knob]`, `[data-rc-lamp][data-decided]`,
`[data-rc-reading=<i>][data-count][data-g]`, `[data-rc-rest=<i>][data-rest="n/10^k"][data-zero]`, `[data-rc-tape][data-count][data-shown][data-broken]` (`[data-rc-restcell][data-frac]`, `[data-rc-flag]`), `[data-rc-verdicts]`, `[data-rc-verdict=lt|eq|gt][data-state][data-locked]`,
`[data-rc-jump=<i>]`, `[data-rc-tray]`, `[data-rc-slot=<i>]`, `[data-rc-check]`, `[data-rc-next]`, `[data-rc-banner]`, `[data-rc-refused=coarse|order]`, `[data-rc-free][data-active]`, `[data-rc-formal]`, `[data-rc-kid=<id>]`, `[data-lab-fold=ruler-compare.trials]`.
**Layout.** The lab column is only ≈ 414 px wide at 1024×768 (menu open) and 494 px at 768×1024: below 640 px a lane has two rows (kid + bib + reading, then the tape), below 560 px the verdict and the banner stack. Tests:
`logic/rulerCompare.test.js`, `operations/rulerCompare.render.test.jsx`, `decimals.test.js`.

## 2quinvicies. The tile under the hand — `tile-yard` (1AM unit 11, lesson `masahat-muhit-sath`, 2026-10-15)

`surface/TileYard.jsx` (+ `YardBoard.jsx`, `FloorBoard.jsx`, `tileArt.jsx`, `useHand.js`) on `logic/tileYard.js` (exact, through `packages/core/arithmetic/surfaces.js` imported BY PATH); theme `courtyard`; strings `lesson.manipulation.json › tileYard`. **The hand holds ONE TILE (a unit area) and carries it.** An area is the NUMBER OF TILES, a perimeter the NUMBER OF FENCE STICKS round them: two measures that are READ (never typed), side by side, never merged, moved independently by the same gesture. Not `square-tiling` (k, the tiles per side), not `fraction-knife` (pieces of one area). « جرّب كل الإمكانيات »: NOT eligible (each placement IS an answer); no « جرّب أعدادك » (nothing to type).

**Arithmetic (`surfaces.js`, integers and halves).** cells `[r,c]`; `area`, `perimeter` (cell sides with a cell on one side only), `isValid` (4-connected, no hollow: an empty cell unreachable from outside by 4-moves), `liftCheck` (`splits` | `hole`), `dropCheck` (`occupied` | `detached` (a corner only) | `hole`), `moveCheck`, `canonical` (invariant under translation, rotation, reflection), `boundaryLoop` (the fence walked in one go, even with a pinched corner), `minPerimeter(n)`, `areaRange(p)`, floor: `formatHalves`, `floorHalves`, `halvesInTwo` (21 cells = 10,5 unit ② for ANY pairing), `validPairing`. Tested by exhaustive enumeration of all 12-tile yards (perimeter even, 14…26, 14 only for the 3 × 4) and of the rope-12 areas (exactly 5…9).

**Worlds and props** (`<Manipulation type="tile-yard" … />`; `state.report` for every callback): `world` `'yard'` | `'floor'`; `mode` `'fence'` | `'rope'` (yard); `tasks` (floor: `['terrace-halves','terrace-double']`, default both); `level`, `levels` (forced `false` for the floor), `coach`, `title`, `lead`, `onTrial(event)`, `onFinished({ world, mode })`. Presets (`levels.js`): مبتدئ `{ world:'yard', mode:'fence' }` (12 tiles only MOVED: area fixed, fence varies; tasks `shortest` (kept fence 14) then `twenty` (kept fence 20)); متقدم `{ world:'yard', mode:'rope' }` (a roll of 12 sticks, a heap of 12 tiles: same fence, different areas; tasks `biggest` (kept 9 tiles) then `smallest` (kept 5); a yard may be kept only when the WHOLE rope is used). Floor: scenes `terrace-halves` (14 whole cells + 4 half cells = 16 unit ①) and `terrace-double` (21 whole cells in a staircase: 21 unit ①, then the double tile, 10,5 unit ②; any pairing, a leftover cell takes a half double). `onFinished` fires when the discovery is formalised (yard) or both scenes are read (floor).

**Gestures (three paths each).** Drag a tile; tap the tile then tap the cell; keyboard (arrows move a cursor, Enter takes / drops, Esc lets go, Delete returns a tile to the heap in `rope`, R turns the double). Cells where the carried tile may land glow; the ghost of the yard it WOULD make is drawn dashed with its fence number; a refused move returns the tile with a wobble and the reason is written (`detached`, `splits`, `hole`, `rope`; floor: `overlap`, `outside`, `unit`). The floor also lays a ROW: press on the floor with a single tile in hand and drag (one tile per cell crossed; `autoComplete` is NOT used, the count is the answer). « أمشِ حول السياج »: a girl gardener (KidFigure in hijab) walks the fence, one stick per tick, the passed sticks light up. « أحتفظ بهذا الحوش » stamps the yard (a mini drawing + its two numbers) into the notebook; never two congruent yards (a note instead).

**Events (`logic/tileYard.js`, exact).** yard: `{kind:'move'|'add'|'remove', world:'yard', mode, tiles, fence, prevFence}` · `{kind:'refused', reason}` · `{kind:'walk', tiles, fence}` · `{kind:'keep', mode, tiles, fence, shape}` (NEW yards only) · `{kind:'task', task:'shortest'|'twenty'|'biggest'|'smallest'}`. floor: `{kind:'lay', scene, unit:'one'|'half'|'two', area[, areaTwo]}` (decimal-comma strings; `areaTwo` on the double scene) · `{kind:'refused', scene, reason}` · `{kind:'read', scene, unit:'one'|'two', value}`.

**Discovery** (`ManipulationDiscovery`, never a `shows` line before it): fence « ماذا بقي ثابتًا… » / rope « هل يتعيّن عدد البلاطات؟ » with the wrong options refuted by HIS kept yards (`witnesses`); `discoveryReady` = ≥ 3 kept yards with ≥ 3 distinct fences incl. 14 (fence) / ≥ 3 distinct tile counts incl. 9 and 5 (rope). The formal block gives the area and perimeter definitions with his own kept pair and the three sentences (same area / same perimeter / both) each illustrated by two of his stamps when they exist. LabCoach: `coachOf` (fence: pick → walk → keep → again → next; rope: add → walk → more → keep → again → next; floor: pick → sweep → half → cover → confirm → next → double → halfTwo), pure and followed to the end of every task in `tileYard.test.js`.

**DOM.** `[data-tile-yard][data-world][data-mode][data-task][data-solved]`, `[data-ty-glance]`, `[data-ty-board]`, `[data-ty-yard]` / `[data-ty-floor-svg]`, `[data-ty-tile=<r>-<c>]`, `[data-ty-cell=<r>-<c>]`, `[data-ty-legal]`, `[data-ty-ghost]`, `[data-ty-area]`, `[data-ty-fence]`, `[data-ty-walk]`, `[data-ty-walker]`, `[data-ty-keep]`, `[data-ty-notebook][data-count] [data-ty-stamp=<i>][data-tiles][data-fence]`, `[data-ty-refused=<reason>]`, `[data-ty-banner]`, `[data-ty-heap][data-count]`, `[data-ty-rope][data-used][data-total]`, `[data-ty-next]`, `[data-ty-step=<i>]`; floor: `[data-ty-floor][data-scene]`, `[data-ty-box=one|half|two|halfTwo]`, `[data-ty-piece=<kind>]`, `[data-ty-reading=<value>][data-unit]`, `[data-ty-confirm]`, `[data-ty-rotate]`, `[data-ty-verdict]`, `[data-ty-formal]`, `[data-ty-def=area|perimeter]`, `[data-ty-sentence=<key>]`.

**Layout.** Measured width: ≥ 600 px the panel (two meters, rope roll, walk / keep, banner, notebook) sits beside the board; below it stacks, the meters shrink to one line and the notebook moves to a `LabFold`. The cell size is budgeted from `useLessonViewport` (26–62 px). Tests: `surfaces.test.js`, `logic/tileYard.test.js`, `surface/tileYard.render.test.jsx`.

## 2quindecies. The space laboratories and the 3D kit (unit 14, 2026-10-05)

The first unit IN SPACE. Its labs show REAL solids — light, transparency, an orbit under the finger — and every one of them stands on ONE
kit, `manipulations/space/stage3d/` (three.js, already a dependency of the Math Lab's 3D tool; never a second renderer):

- **`SpaceStage`** (`spaceStage.js`, no React) — the conventions of the Math Lab scene (`features/mathlab/tools/geometry3d/solidScene.js`):
  the mathematical frame has z UP and is translated to three.js (`toThree` (x, y, z) → (x, z, −y), `fromThree`), rendering is ON DEMAND (no
  permanent loop; `animate(fn)` for a short animation), labels are DOM (`CSS2DRenderer`, LTR, `aria-hidden`), everything is disposed on unmount,
  the background is TRANSPARENT (the lab's decor sits behind the canvas). The mathematical gesture in the scene is
  **`draggable(obj, { start, move({ onPlane(n, p), onLine(p, d) }), end })`**: the orbit pauses while the student holds an object; the handler
  projects the ray on a plane or a line of the mathematics (a point M on a horizontal plane, a cutting plane along an axis, a water level).
- **`solids3d.js`** — factories in mathematical coordinates: `sphere` (glass surface: the كرة), `ball` (solid: the جلّة), `box`, `cylinder`,
  `cone`, `frustum` (an open bucket), `pyramid`, `edges`, `line` / `segment` (dashed or not), `ring`, `disc`, `polygon` (a filled section),
  `plane`, `dot`, `handle`.
- **`Stage3D.jsx`** — the React bridge: `build(stage)` runs ONCE and returns `{ update(state), dispose? }`, each `state` change calls `update`
  (never a new scene); the stage is focusable (arrows orbit the VIEW — an aid, not the mathematical gesture — and ↺ resets it,
  `lesson.manipulation.json › stage3d`). **Until the WebGL scene exists the `fallback` fills the window** — a `SpaceFigure` of the same
  situation: the server render of the render tests sees it (no WebGL in Node), a browser without WebGL keeps a readable lab, and the scene is
  born in a LAYOUT effect, before the first paint (no flash). `prefersReducedMotion()` cuts the orbit damping; the labs read it for their
  animations.
- **Rules.** Every gesture of the scene ALSO exists as an HTML control (slider, stepper, buttons) with its keyboard — the canvas is never the
  only way and the render test sees every control. The stage takes the finger on a phone (`touch-action: none`): it stays ≤ ~55 % of the
  viewport height so the page can scroll around it (§8bis). A workspace mounts both levels → two scenes: never a global singleton. The unit
  e2e (`e2e/lesson-kit/4am-handasa-fada.mjs`) fails when a glance block's `[data-stage3d]` is not live (`data-stage3d-ready`): a lab left on
  its fallback is not the lab.
- Verdicts and values come from `packages/core/arithmetic/space.js` (exact π-multiples, `ballPosition` comparing OM² and R² exactly,
  `sphereSection`, `cuboidSection`, `cylinderSection`, `apexSection`, `scaleEffect`, `bucketWater`).

Five types in `manipulations/space/` (glance `data-sp|op|sl|sb|bf-glance`, measured by `e2e/lesson-kit/4am-handasa-fada.mjs`, module 1, both
levels, four viewports, scene live), each with a `logic/` module, its tests and a render test:

- **`sphere-probe`** (`SphereProbe.jsx` + `sphereProbeScene.js`, `glass-globe` / `shot-put`) — the probe M on whole grid points: dragged on its
  horizontal plane (`onPlane`), ▲/▼ for the height (`onLine`), x/y/z spinbuttons (a 3-tile row with one −/+ pair under 380 px); the scene
  controller is a plain module bridged through a ref; verdicts by `ballPosition` naming the comparison; a كرة / جلّة toggle on the stage;
  stage 2 (opened by the student): diameter [MM′] and the plane z = h with its live section.
- **`orange-peel`** (`OrangePeel.jsx`, `boufarik-orange`) — R held in tenths (exact) by a rim handle; phases `peel | pour | book` (the last two
  opened by the student, `book` advanced only); a prediction locked by the gesture; cards judged on DIMENSION before value (reusable: a length or
  a volume is refused as an area even when the number coincides); the camera frames the bounding box of every possible disc so the view does
  not jump.
- **`section-slicer`** (`SectionSlicer.jsx`, `3d-printer`) — stages `sphere | cuboid-face | cuboid-edge | cylinder-base | cylinder-axis |
  pyramid`, each variable an integer index on an exact fraction grid; predict-then-print with 3 cards, a refused card left as a dashed GHOST
  layer; `sceneFigure(lab)` is the swept Stage3D fallback with a declutter pass; camera distance fitted to the aspect by a ResizeObserver in
  `build`; per-world `Group.scale` so one camera serves every solid; a fixed-height verdict area so the stage never jumps.
- **`scale-blocks`** (`ScaleBlocks.jsx`, `voxel-blocks`) — k held by a handle on the image's far corner (snapped list) and a stepper; the image
  volume predicted then refuted by the count (InstancedMesh voxels revealed layer by layer through `stage.animate`, k³ same-colour blocks); the
  « +1 cm » contrast; the stage host exposes the handle's projected screen position (`data-sb-handle`) so an e2e can drive the 3D drag;
  narrow (< 380 px) and tiny (< 250 px) recipes.
- **`bucket-fill`** (`BucketFill.jsx`, `beach-bucket`) — three phases opened by the student (level / apex / volume) with a back button on the
  stage; the water and the apex S both dragged on the axis (`onLine`); the apex verdict from the exact reach r(a + H)/a against R; a flat
  axial-section `MovablePanel` beside the 3D (affine magnification, said in its note); the camera reframes on release, never during the drag.

## 2quaterdecies. The rotation laboratories (unit 13, 2026-10-04)

Five types in `manipulations/rotation/`, every verdict from `packages/core/arithmetic/rotation.js` (`imageCheck`, `arcAngles`, `vertexAngle`,
`sidesFromCentral`, `circleGaps`, `ringByRotation`…), each with a `logic/` module, its tests and a render test; glance blocks
`data-rd|st|ia|pf|lr-glance`, measured by `e2e/lesson-kit/4am-dawaran-mudalaat.mjs` (module 1, both levels, four viewports). A refusal of an
image always NAMES the failing condition of the textbook's definition (OM′ = OM, the angle, the sense) — `imageCheck` returns all three.

- **`rotation-dial`** (`RotationDial.jsx`, `ferris-wheel`) — two scenes, one variable (the image point): `wheel` (nodes on 2k spokes × rim /
  inner ring, exact, `tasks` in steps of `step`) and `plane` (missions point / segment / circle with a compass snapped onto OP and a protractor
  ruler whose zero lies on [OP)). Verdict kinds `ok | sense | radius | angle | both | zero | center`. Reusable pattern: an instrument MAGNET that
  attracts only toward the student's own constructions, never toward the answer.
- **`shape-turn`** (`ShapeTurn.jsx`, `zellige`) — a rotation held with the stretch engine (θ read from the pointer, unwound near the current
  value), a second stretch engine for the FAKE handle (a dilation: the counter-example), invariant gauges in a `MovablePanel` that become chips
  under 420 px; claims proved by carrying property cards (`judgeClaim` refuses on drop, nothing leaks on hover); the centre pin is a stage the
  student opens (§7quater).
- **`inscribed-angle`** (`InscribedAngle.jsx`, `football`) — a free plane pin with a polar `legal()` (±7 % magnet to the circle, pushed off the
  posts, snapped to the diameter in the مزيان stage), keyboard as a `role="slider"` validated after 700 ms or on Enter, an inside / on / outside
  toggle as the tap path; a bet gates the reading; chained stages (§7quater).
- **`polygon-forge`** (`PolygonForge.jsx`, `honeycomb` / `flag-star`) — α held by the stretch engine with the handle drawn as the NEXT image on
  the circle; each « دوّر » is a trial; the run's outcome from `sidesFromCentral` / `normalize` (closes, spirals, star); α locked during a run;
  advanced chains three stages (angle, radius from the tips' distance, branches).
- **`lamp-ring`** (`LampRing.jsx`, `flower-bed`) — one scene in three phases (by hand → by rotation → the distance), the second opened by the
  student; refusal kinds `handUnequal`, `overshoot`, `ringOpen`, `formulaKo` from `circleGaps` / `ringByRotation`; the rotation angle is held
  through the position of the SECOND post, not a dial, so the lab does not converge with `polygon-forge` (MANIPULATION_DNA §12).

## 2terdecies. The vector laboratories (units 11–12, 2026-10-04)

Every verdict comes from `packages/core/arithmetic/vectors.js` (`relation`, `simplifyNamed`, `isParallelogram`, `midpoint`, `distance`,
`crossing`, `shortestCrossing`…); each lab has a `logic/` module with its tests and a render test, files in `manipulations/vectors/`; glance
blocks `data-tg|pp|vs|vc|bp-glance` (unit 11) measured by `e2e/lesson-kit/4am-ashia-insihab.mjs`. A refusal always NAMES the element that
differs (direction, sense, length) — the textbook's definition of equal vectors turned into the lab's voice.

- **`translation-glide`** (`TranslationGlide.jsx`, `drone-show`) — grid-node placement (plane-pin pattern: pointer capture, a per-object
  button for tap and keyboard); kinds equal / direction / sense / length / senseLength / zero / outside / tooFar; a rogue drone flying −u
  appears once the images are placed and opens the discovery when repaired; the complete formation glides as one block.
- **`parallelogram-pin`** (`ParallelogramPin.jsx`, `tifo`) — the stretch engine for I on [AB], grid pins for D then E; the banner's shape and
  the merging of the two diagonals' midpoints come from `isParallelogram` / `midpoint`; the E stage is opened by the student and has a way back.
- **`vector-sum`** (`VectorSum.jsx`, `scooter` / `swim`) — a carry-to-station chain (only the head of the first vector accepts the second's
  tail) and a rotation held with the stretch engine (θ from the pointer's angle on a half-disc track); 30° is decided exactly
  (`crossing` / `crossingSide`); the speeds float in a `MovablePanel` that becomes a line under 380 px when it would cover the handle.
- **`vector-chain`** (`VectorChain.jsx`, `metro`) — one carry engine whose drop zones are the train's two ends and the map's stations;
  equalities judged on exact points PLUS a graph of givens (reversal, transitivity): a swap needs the equality AND its justification
  (« الشكل لا يبرهن »); `construct` mode builds a sum of representatives head to tail.
- **`bridge-path`** (`BridgePath.jsx`, `crosswalk` / `bridge`) — one scene in three phases (explore / translate / straight), the second opened
  by the student; the crossing's position held by the stretch engine, then B′ as a plane pin; the discovery needs the straight line AND a
  longer position tried; the length-vs-position chart in a `LabFold`.

Unit 12 (glance blocks `data-cs|cc|md|sp|rc-glance`, measured by `e2e/lesson-kit/4am-ashia-maalam.mjs`):

- **`component-steps`** (`ComponentSteps.jsx`, `delivery`) — orders `walk | walkCode | code | pin`: the rider walked node by node (drag along
  a street, tap, pad, arrows), a trip code on two signed spinbuttons judged by WHERE the scooter stops (refusals `sign`, `swap`, `coords`,
  `reverse`, `zero`, `outside`); the invariant is that the code depends only on the displacement; under 260 px the order tabs become a
  « ‹ n/5 › » stepper.
- **`component-calc`** (`ComponentCalc.jsx`, `game-map`) — chained missions `calc | place` inside one level with an explicit next-mission
  gesture (§7quater); `live: false` is how متقدم removes the component lamps until validation; the map width is fitted to the island.
- **`midpoint-distance`** (`MidpointDistance.jsx`, `gps-meet`) — two stages, the second opened by the student; verdicts from
  `relation` / `distance`; narrow-screen recipe: `smallmatrix` components, value-only claims, icon buttons, the shared-positions
  `MovablePanel` becomes a row under 380 px. The advanced reading guard lives in `logic/midpointDistance.js › meetReadingLive` (regression-tested).
- **`shape-prover`** (`ShapeProver.jsx`, `football`) — a claim plus proof cards judged by `REQUIRE` groups in a fixed order: flat →
  other vertex / apex → unbalanced card (« false ») → missing card; under 640 px the verdict floats on the scene as a transient
  `MovablePanel` cleared on the next move — a reusable pattern for §8bis.
- **`route-compare`** (`RouteCompare.jsx`, `cross` / `rally`) — one pin whose step depends on the piece (a semicircle's centre at ½, a
  checkpoint at 1); refusals `miss` (centre not the midpoint: the arc ends at 2C − P), `atEnd`, `off`, `skip`; the bet gates the build,
  the discovery needs both routes; verdicts from `vectors.routeLength` / `arcEnd` / `semicircle`.

## 2duodecies. The trigonometry laboratories (unit 10, 2026-10-04)

Four types, every verdict from `packages/core/arithmetic/trigonometry.js` (no lab computes a ratio itself), each with a `logic/` module,
its tests and a render test; glance blocks `data-rr|tc|ac|cl-glance`, measured by `e2e/lesson-kit/4am-hisab-muthallathat.mjs`.

- **`ramp-ratios`** (`geometry/RampRatios.jsx`, `skatepark`) — the first CHAINED carry inside one level: pick the acute angle → name the
  sides → compose the ratios, then a stretch (the rise at مبتدئ; board and angle plus a PREDICTION judged before reading at متقدم). Resistance:
  the right angle refused, a mislabelled side returned with its reason, the hypotenuse over a sine refused with its value > 1; the bound
  0 < sin, cos < 1 is SEEN (the board swung onto the ground lands beyond A). Invariant: at a fixed angle, the ratios do not move with the size.
- **`trig-calculator`** (`geometry/TrigCalculator.jsx`, `drone`) — the hand holds a real KEY SEQUENCE on a drawn calculator (19 keys ≥ 44 px,
  LTR) and a cut line on the screen digits (`role="slider"`). It starts in RAD on purpose: `trigonometry.ratioRad / angleRad` give the
  absurd value that the drone's triangle contradicts; forgetting 2nd, the wrong inverse, an impossible sin⁻¹ (« خطأ رياضي »), truncation and
  the wrong precision are each refused. Narrow screens: under 250 px the glance block takes back the stage padding and the keypad goes to
  4 columns; under 380 px one shared control row carries the decisions / tasks / next button.
- **`angle-compass`** (`geometry/AngleCompass.jsx`, `kite`) — construction without a protractor, for real: set square, a carried length,
  the compass opening and a pencil lowered from 90° so the arc cuts the other leg at the exact √(r² − a²) (`r·cos θ = a`); a ruler path for
  tan. Resistance: `short` / `touch` (the string never reaches), `legs` (sin built on two legs = a tangent), `vertex`, `hypTan`. Invariant on
  every triangle, refused ones included: cos² + sin² fills a bar to exactly 1, tan = sin / cos. Layout lessons worth reusing: the scene's
  scale is RATCHETED DOWN only (a control row appearing never moves a handle under the finger), handles are clamped inside the scene, the
  reading floats in a `MovablePanel` on the sky side, compacted with `\tfrac` on phones.
- **`clinometer`** (`geometry/Clinometer.jsx`, `floodlight` / `mural` / `maqam`) — ONE plan engine (`logic/clinometer.js`: `planFor` =
  `lengthPlan`, `ratioVerdict` names the missing side, `chooseOp` refuses with the value it would give) for three modes: `height` (distance and
  phone tilt held, the shutter accepts the aim to the degree, the height is the same from every distance), `ladder` (the تحدّ: a telescopic
  length bracketed by hand before sin ÷), `align` (the observer slides until the pole hides the monument: Thales then tan). Props flat or
  grouped in `numbers`, contract fixed in the unit's brief; the synthesis reuses it with its own `LAB` and `lab.render.test.jsx`. The phone is a
  `MovablePanel`, compact under 380 px.

## 2undecies. The geometry laboratories (unit 9, 2026-10-02)

Unit 9 « خاصية طالس », the first unit under the programme's « ميدان الهندسة » (`handasa`), added five types by the §7ter
recipe, in a new folder `manipulations/geometry/` (logic `logic/<name>.js` + tests, render test `geometry/<name>.render.test.jsx`,
strings `lesson.manipulation.json › thalesBeam | parallelLevel | segmentDivider | shadowStick | coneCylinder`). Every verdict comes
from ONE exact module, `packages/core/arithmetic/thales.js` on `linear.js` fractions — drawing coordinates may be floats, they decide
nothing. Its central convention: points on the two secant lines are SIGNED abscissas from A, so `converse({ b, bp, c, cp })` decides
the reciprocal on the ratios AND the order at once (`reason: 'ratios' | 'order'`). All five are **manual** (§6bis: each gesture is a
trial), report through `state.report`, carry a decorative layer (`aria-hidden`, `[data-deco]`, out of the keyboard path, still under
reduced motion) and are measured one-screen (§8bis) on their glance block at the four viewports, both levels, by
`apps/web/e2e/lesson-kit/4am-khassiyat-talis.mjs`. New worlds in `VISUAL_THEMES`: `cinema`, `camera`, `mural`, `minaret`, `cornet`,
`river`, `tifo`. Full props, DOM contract and DNA sheet are in each component header; the essentials:

| Type | The hand holds | Resistance | Discovery (contrast) | Lessons |
|---|---|---|---|---|
| `thales-beam` (`ThalesBeam.jsx`, glance `[data-tb-glance]`) | the screen's position AB′ (signed index: step 1 at مبتدئ, 0,1 at متقدم over −6…6 so it passes THROUGH A) and its tilt t, by drag on the scene, the B′/C′ sliders, −/+ and keys; « سجّل الموضع » then the student JUDGES the stop (« متساوية » / « ليست كلها متساوية ») | a tilted stop judged equal is refused naming the ratio that differs (AC′/AC = 3/5 ≠ 1/2); a stop at A is refused; a rounded متقدم stop (3,73 ; 3,25) judged unequal is refused with the exact k = 8/15; B′C′ is decided on its exact square (law of cosines, cos Â rational), « ≈ » only on display | two parallel stops + a tilted one (متقدم: also AB′ = 3,2 and a stop behind A — the camera obscura, the butterfly case); « always equal » and « constant difference » refuted with the student's own numbers | `talis-hisab-atwal` M1 (`cinema` 4/5/3 ; act-1 6/7/6,1, `camera` behind A) |
| `parallel-level` (`ParallelLevel.jsx`, glance `[data-pl-glance]`) | the positions of B′ on (d) and C′ on (d′), notch by notch in a « slot » space that skips A (drag along each bar, tap on the bar, ▲▼, keys) | a spirit level on the plank: the bubble is centred ONLY when `thales.converse` says parallel, otherwise it flees at least 0,35 towards the higher end; at متقدم a placement off the teacher's ratio 1/3 is refused (`condition`), and the textbook's figure 3 (1/3 and 1/3 on opposite sides of A) is refused by the ORDER | مبتدئ: two level planks with different k, (2 ; 3) and (4 ; 6), plus a tilted one (the start (5 ; 8) is « same distance to the feet »); متقدم: the three students' figures 1, 2, 3 made by the student's own placements | `aksiya-talis` M1 (`mural`: the graffiti painters' A-frame ladder 6/9 ; act-2 on an X-trestle 9/12) |
| `segment-divider` (`SegmentDivider.jsx`, glance `[data-sd-glance]`) | `equal`: the ray's angle, the compass opening (a stretch), each carry (one tap per mark), the mark joined to B, the set square slid along a ruler; `ratio`: the side and rank of a mark on each of the two parallel graduated lines (d₁)//(d₂) and the ruler's two ends | the angle locks at the first mark; a parallel off a mark is refused (« حافة الكوس لا تمر بأي علامة »); an opening changed mid-way cuts unequal bands measured exactly (75/23 ≈ 3,26); joining the 2nd mark gives 2 parts; 2 on A's line and 3 on B's gives MA/MB = 2/3; equal ranks on the same side put the ruler parallel to (AB) | one right construction + a failed one or a second with another angle / opening (the cut points depend on neither — swept in the tests); متقدم: the point inside [AB] AND the point outside (`thales.ratioPoint`) | `inshaat-talis` M1 (`tifo`: a stadium banner, 3 parts ; method-ratio-point 3 : 2) and M2 posed alone (`levels={false}`, دوري الآن 2 : 5) |
| `shadow-stick` (`ShadowStick.jsx`, glance `[data-sh-glance]`) | the stick's foot (step 0,2 m), then a telescopic pole carried from the stick to the minaret whose TOP rides the sun ray (its height is never set by hand) | anywhere but the right place the stick's shadow ends before or after O — the two parallel rays drawn and the gap written in metres; the pole stays shut while O is not a common point | a missed tip then the match; the pole stopped on the way and at the foot, where it IS the minaret (h = stick × OP ÷ ℓ = 7,25 m); « the stick anywhere » refuted by the student's own trial | **no lesson since 2026-10-13** (was `wadiya-idmajiya-talis` M1, مبتدئ; replaced by `shadow-world`) |
| `shadow-world` (`ShadowWorld.jsx`, glance `[data-sw-glance]`, 2026-10-13 — **a living world**, MANIPULATION_DNA §16) | the SUN (it pivots on the minaret's tip M; 12:30 → 16:00, Algiers on 13 October), a tape from any object's foot, the stick anywhere, a flag to BET on an object not yet installed, and the student's own rule `الظلّ = الطول [+ \| ×] n` | the tape pulled up the minaret falls back; the stick's shadow vanishes inside the minaret's; a rule is planted as violet flags on every known object, the gap to each real tip drawn, and it comes unstuck when the sun moves | a bet classified by model (additive, copy, equal, inverse; non-discriminating at 12:30); a × rule fitting every object, then REPAIRED at another hour; the conjecture written with the student's two rules; the height answer read by `judgeHeight`; companion مقران runs a BLOCKING tutor chain of 5 tapped questions, judged against the student's own numbers, retry-until-correct (DNA §16.5bis); panel `ShadowTutor.jsx`: progress + thread + ONE question/task card (DNA §16.5ter) | `talis-hisab-atwal` M1, BOTH levels (`SHADOW_WORLD.beginner` minaret 5 m, `.advanced` 6,5 m, 2026-10-13: the first lesson that presents the concept; the `thales-beam` pair left this lesson) and `wadiya-idmajiya-talis` M1, مبتدئ (`minaret`, `{ minaret: '7,25' }`: 11,6 m at 15:00, stick at 10 m ; pair 5 / 7,25) |
| `cone-cylinder` (`ConeCylinder.jsx`, glance `[data-cc-glance]`) | the cylinder's h (a stretch on a ruler under the axis) and r (a stretch at its rim corner) in the cone's axial section; n ≤ 24 graduations chosen so every inscribed cylinder has hIdx + rIdx = n and h = r falls on a mark | a cylinder that would pierce the cone turns red while dragging and is refused on release with the permitted radius written; a rim short of the cone leaves a numbered gap | two inscribed cylinders of different lengths + a refusal or gap; « r + h constant », « r × h constant », « r = R » refuted by the student's own cylinders; goal h = r (the half-section a square), V = 91,125π ≈ 286,28 cm³ | `wadiya-idmajiya-talis` M1, متقدم (`cornet`, the situation H = 18, R = 6 ; مبتدئ pair 12/4) |

**A workspace may pair two TYPES (unit 9).** The objective — not the instrument — is what both levels share (§7bis-levels):
`wadiya-idmajiya-talis` opens on `shadow-world` at مبتدئ (the تحدّ, since 2026-10-13; `shadow-stick` before) and `cone-cylinder` at متقدم (the situation), one objective
« ترييض وضعية بمثلثين في وضعية طالس وحل معادلة لإيجاد طول غير مباشر ». Each type keeps its own pair in `levels.js`; the workspace uses
the numbers of one of them. The unit e2e maps the glance selector per LEVEL for that reason.

## 2bis. Drawn worlds — every lesson has its own, and the theme is data

The football pitch (lesson 1, مبتدئ) and the library (lesson 1, متقدم) set the standard
(2026-09-21): a real situation, real objects drawn in parameterised SVG, a direct gesture, and a
notation that follows the gesture. That standard now holds across the unit. Each lesson opens on
**one world**, chosen because it makes the concept's structure visible — never bolted on:

| Lesson | World (`theme`) | Drawn objects | The gesture | What the drawing *is* |
|---|---|---|---|---|
| 1 قاسم عدد طبيعي | `football` / `library` | players on a pitch / books on shelves | drag a player into a team (partition) / **stretch the shelf** — drag its bookend (quotition) | the remainder is a player who fits in no team / the books in a ghost shelf that cannot be completed |
| 2 قواسم عدد طبيعي | `library` | the same books, in a rectangle fitted in a square frame | **pull the row's edge** (stretch, `useStretchInteraction`): the n books re-form live | a perfect rectangle ⇔ `n = d × e`; past the square (√n) every perfect rectangle is an earlier one **turned** (`repeat` is geometric: d > q) |
| 3 خواص القواسم | `construction` | two walls in bricks of length n (`BrickWall`) | carry wall b: join it, remove it, or measure wall a with it; at متقدم, **predict** «طوب كامل / يبقى جزء من طوبة» before each build (`predict`, `outcome`) | sum, difference and remainder are still whole bricks ⇔ n divides them |
| 4 القاسم المشترك الأكبر | `football` (مبتدئ) / `garden` (متقدم) | balls & shirts / red & white flowers in identical groups (`GroupingScene`) | **add a group at a time**: drag an empty wrapper from the reserve (`GroupStock`) — or −/+ — and everything re-deals | the k that leave nothing outside are exactly the common divisors; « greatest » needs the next k seen failing |
| 5 تعيين PGCD | `school` (مبتدئ, bags 8/12) / the lists (متقدم, 42/60, `startWith="lists"`) | pens & notebooks in identical bags, then the divisor lists | add bags one at a time (مبتدئ); carry the common divisors to the middle and the greatest to PGCD (متقدم) | the lists *are* the object of this lesson (its method, حصر) — the advanced level no longer reopens lesson 4's bags (2026-09-30) |
| 6 البحث عن PGCD | `workshop` | two ribbons (`RibbonStrip`) | cut the short ribbon out of the long one (differences) / lay copies of it along (Euclid) | the greatest common length survives every cut and every remainder |
| 7 أوليان فيما بينهما | `school` (مبتدئ) / lists (متقدم) | 17 pens and 18 notebooks in identical bags | add bags one at a time up to 17 — nothing works but 1 (the same `GroupStock` as lesson 4: coprime is the PGCD = 1 case) / confront every divisor of the smaller number with the other | coprime ⇔ every k from 2 to min(a, b) fails ⇔ every divisor of the smaller one was tested and only 1 is common; « not coprime » needs ONE common > 1 (the textbook's refutation of مريم) |
| 8 اختزال كسر | `kitchen` | spoons of sugar and cups of flour, in portions | drag a number of portions (2 … 12, **not only the good ones**) onto the recipe; declare «لا يمكن الاختزال أكثر» yourself; then find the one-step number (no gold PGCD) | dividing both terms by k = k identical portions; the reduced fraction is one portion; a non-greatest common divisor in one step is refused by showing what it gives |

Rules that make this reusable rather than eight one-offs:

- **A theme is data.** A lesson passes `theme="garden"` to `<Manipulation>` and declares it in
  `resources[].experience.theme`; the closed list is `VISUAL_THEMES` in
  `packages/core/curriculum/manipulationLevels.js`, and `validate:lessons` rejects an unknown id.
  Which objects a theme draws lives in `primitives/itemThemes.js`; its Arabic words live in
  `lesson.manipulation.json` under `themes.<id>.*` (keys `lesson:manipulation.themes.<id>.*`) and are read through `themeWords()`, which a
  lesson's `context` (the textbook's own words) may override. **No scene contains Arabic.**
- **One scene, three types.** `GroupingScene` serves `common-divisors`, the groups stage of
  `coprime-explorer` (`startWith="groups"`) and `fraction-reduction`, because « k identical
  groups of two kinds of object » is one piece of mathematics (`equalGrouping.groupInto` in core,
  laid out by `groupingLayout.js`, unit-tested). Do not write a second grouping scene; pass a theme.
- **Objects are sized for the back of the classroom.** A drawn object's size is never a fixed
  pixel count. `groupingLayout.itemWidthFor()` gives the *floor* (what fits a 320 px phone), and
  `itemSizeCss()` grows it with the **scene's own width**: `GroupingScene` is a CSS size container
  (`container-type: inline-size`) and sets `--sa-item` / `--sa-item-left`, a single
  `clamp(floor, 0.75·floor + floor/10·cqi, 2·floor)` with no breakpoints: ×1 on a phone, ≈×1.3 on a
  tablet, ≈×1.7 on a laptop, ×2 on a projector and in وضع القسم. The initial piles (`k` null,
  floor 10 px for 144 flowers) use `PILE_SCALE` (steeper, up to ×3). Card widths (`perRow` objects)
  and the gaps between objects (`--sa-item / 8`) are computed from the same variable, so a
  larger object never overflows or clips its card, and the count drawn never changes.
  `ItemFigure` accepts `width` as a number (px) or a CSS length (`var(--sa-item)`). A new scene of
  countable objects reuses this rule rather than choosing its own pixel sizes. The rule is tested
  in `groupingLayout.test.js`.
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

## 2ter. Partition and quotition — name the roles

The same `a = b × q + r` is met with two readings in lesson 1: the teams fix the
**number** of groups (b = teams, q = players per team), and the shelves fix the **size**
of a group (b = books per shelf, q = shelves). A lab never switches reading silently.
Under its equation, each division lab renders `primitives/DivisionRoles.jsx`, whose three
chips say in the scene's words that **b is what you chose, q is what results, r < b**.
The module places the two readings side by side before its question
(`[data-division-bridge]`). See `MANIPULATION_DNA.md` §8.

## 4. Gestures — carry and stretch

Two gesture engines, and a type never re-implements either. A concept that needs a
genuinely different gesture (rotate, cut, balance) gets a new engine documented here; it is
not forced into one of these two (`MANIPULATION_DNA.md` §6, §12).

### 4.1 Carry — `useDragInteraction`

- Pointer Events, `setPointerCapture`, `touch-action: none` — no page scroll while dragging.
- Below 6 px of movement the gesture is a **tap**: it picks up / puts down. Above, the object follows.
- **Magnet:** the nearest zone within 56 px **that would accept** the object is magnetised
  (`data-drop-active`) and receives the drop. A zone that would refuse, or a disabled zone
  (`data-drop-disabled`), is never magnetised. When the pointer is directly over a refusing
  zone, the zone is marked `data-drop-invalid` (`DropZone` tints it rose) before release, and
  the release gets the explained refusal. A **silent** refusal (`''`, a no-op such as putting
  a player back on its own team) is not marked. Until 2026-09-29 the magnet lit refusing and
  disabled zones.
- Zones belong to ONE instance: each `useDragInteraction` tags its zones with its own id
  (`data-drop-owner`, `useId`) and only looks for its own (2026-09-29). Two manipulations on one
  step share zone names (`table`, `pgcd`…) and used to receive each other's drops.
- A refused drop returns the object with a short shake and an **Arabic reason** (`accepts` returns
  the reason string). Never a silent red state.
- **A drag always returns the object.** A drag that ends accepted, refused or outside any zone
  leaves nothing "in hand". Only the **tap** path keeps the object held after a refused zone,
  because the student just chose it and simply taps another zone.
- **Edge auto-scroll:** while an object is carried, a pointer within 64 px of the top or bottom
  of the viewport scrolls the page (instant scroll, up to 16 px per frame), and the target zone
  is re-read after each step. Because of `touch-action: none` the finger cannot scroll the page
  itself; without this, on a phone the bench and team 1 (more than a screen apart) could never
  be joined by one drag (audit M1-F8; e2e block DS).
- **Every drag has a non-drag alternative**: tap the object, then tap the zone. Keyboard: Enter/Space
  to pick up, Enter/Space on the zone to drop, Escape to release. This path is never removed.
- **It is the only carry engine in the lesson tree.** `InfoSorter` (lesson 9's data sort) moved onto
  it on 2026-09-30, and the legacy `manip6e/useDragDrop` was deleted. Never animate a draggable
  source with framer-motion `layout` (it remounts the node mid-gesture; the capture is lost).

### 4.1bis The group reserve — `primitives/GroupStock.jsx`

The « distribute » gesture of `common-divisors` and `coprime-explorer`: the student drags an empty
wrapper (`group:add`) from the reserve (`stock` zone) to the type's table, or brings one back
(`group:remove` → `stock`); −/+ do the same. The type owns the logic (`addGroup` / `removeGroup` in
`logic/commonDivisors.js`) and the zones' ids; the primitive draws the reserve, the buttons and the
**trace** of tried numbers (read-only, `[data-tried-k][data-tried-mark]`). The theme words come
from `lesson.manipulation.json` `themes.<id>.{stock, add, remove}`. It replaced the 1…24 numeral
rail, on which the student could jump straight to the answer.

### 4.2 Stretch — `useStretchInteraction`

For a **magnitude** the student sets by pulling: a shelf length, and later a ribbon or a
compass opening.

- **Direct:** `toValue(clientX, clientY, trackRect)` reads the value under the pointer, so
  the handle stays under the finger. The track (`trackProps`, `touch-action: none`) is the
  whole width: touching it sets the value there.
- **Live, then committed:** `onChange` fires for each integer the finger crosses, and the
  consequence is drawn *during* the gesture. `onCommit` fires on release only: passing over a
  value is not a trial.
- **Slider semantics:** the handle is `role="slider"` with `aria-valuemin/max/now/text`.
  Arrows move ±1 (in RTL, ← grows, because the magnitude pushes leftwards), Page ±5, and
  Home/End jump to the ends. The **−/+ buttons** use `nudge(±1)`.
- **Pause before commit:** key and button changes are shown at once but committed after
  700 ms of stillness (`settleMs`) or on blur. Otherwise sweeping 10 → 26 with the arrows
  would have counted sixteen trials and opened the discovery unseen.
- DOM: `[data-stretch-track]`, `[data-stretch-handle]`, `[data-stretch-dragging]`.

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

## 6ter. The result line — on TOP, one slot, updated in place (2026-10-09, every type)

The `representation` a type hands to `ManipulationShell` (« 258 = 25 × 10 + 8 » and its sentence) is **not** drawn under
the stage any more:

1. **On top.** It sits between the controls/hints and the stage, so the answer to a gesture is read where the eye
   already is — never below the fold. The type passes `representation` exactly as before; the shell places it.
2. **One slot, never mounted/unmounted per gesture.** Before any trial the slot shows a dashed placeholder of the
   same height (`manipulation.resultIdle`, `[data-representation-slot=idle]`); after, the line is **updated in place**.
   When a type withdraws its line for the length of a gesture (`settled && …`, `notice?.trial`), the shell keeps the
   last one (`[data-representation-stale=true]`) until the next; it is cleared on « إعادة », a level change or new
   numbers (`epoch · resetCount · level`), and **never held while the conclusion is hidden** (`answerHidden`, class mode).
3. **Prefer LIVE.** A type whose line can be computed from the live value should return it during the gesture
   (`factor-pairs` does: the line follows the dragged d, the pair board highlights it) — holding the last line is the
   safety net, not the design.
4. A type that passes no `representation` at all (`undefined`) gets no slot.

DOM contract (e2e): `[data-manipulation-representation]` (the line, now before `[data-manipulation-stage]`),
`[data-representation-slot=idle]`, `[data-representation-stale]`.

## 6bis. Auto-completion — manual first, then « let the lab finish it »

> The learner performs the **first example by hand** — that is where « equal parts » or « cut the
> short ribbon out of the long one » is understood. When the same gesture would then only repeat,
> they may ask the lab to finish it. **Manual stays; automatic is an extra, explicit option.**

### When a type gets it — and when it stays manual

A type may offer auto-completion only if **all five** hold:

1. the target state is **mathematically deterministic** from the configuration;
2. the learner has a **valid configuration** (the type's own `validate`, never « some input exists »);
3. the **manual gesture stays available**, before, during and after;
4. repeating the gesture is **mechanical** — the same move again — not the learning itself;
5. auto-completion reaches **the same underlying state** the hand would reach, through the same
   transitions (`canPlace` / `place`, `subtract`, `addCopy` / `carryRemainder`).

It stays **manual-only** when each gesture is an experiment, a choice or an answer: choosing a
divisor, a number of columns, a number of bouquets, which chips are common, a proof order. There,
« complete it » means « show the answer », which is what class mode's `showSolution` is for — and it
is never offered to a student.

Audit of the ten types (2026-09-24):

| Type | Decision | Why |
|---|---|---|
| `team-builder` | **AUTO** — `unlock: 'first-gesture'` — « أنشئ الفرق » | n players carried one by one into k teams; after the first sharing, carrying 20 more is repetition. The refusal rule stays the one the hand meets. `manualDone` = **one sharing carried to the end by hand** (the scene settled without the button). Until 2026-09-30 it was `'config'`, which opened the button before any gesture, so the discovery could be reached with zero players moved (audit M1-F6). The locked line is the type's own (`manipulation.teamBuilder.autoCompleteLocked`, via `auto.lockedLabel`). |
| `pgcd-differences` | **AUTO** — `unlock: 'first-gesture'` — « أكمل الفروق » | up to 30 identical « carry the small ribbon onto the big » gestures. One cut by hand first; the PGCD box stays manual (recognising the last non-zero difference *is* the discovery). |
| `euclidean-algorithm` | **AUTO** — `unlock: 'first-gesture'` — « أكمل القسمات » | q copies per division, repeated per line. The first division (copies + carry) by hand; the PGCD box stays manual. |
| `divisor-explorer`, `divisor-explorer-books` | MANUAL | one validated position/drop per trial; each trial *is* an experiment, and the arrangement is already drawn by the lab. |
| `factor-pairs` | **AUTO** — `unlock: 'config'` — « جرّب كل الإمكانيات » (owner decision, 2026-10-09; it was MANUAL) | the student can let the lab walk d = 1, 2, 3 … **one trial per step, 480 ms apart** (`auto.intervalMs`, `auto.maxTicks`), so every rectangle, every pair of the board and the result line are SEEN arriving. It reaches the same state as the hand (`L.test` on each d); the discovery question still has to be answered by the student. `finish()` tests what is left (reduced motion: final state at once). |
| `common-divisors`, `coprime-explorer` | MANUAL | choosing the number of groups and carrying the *common* divisors is the judgement being learned. |
| `divisor-properties` | MANUAL | three distinct operations (join / remove / measure), then a proof — nothing repeats. |
| `fraction-reduction` | MANUAL | each drop is a choice of divisor, and « which path is shorter » is counted in the student's own steps. |

Outside the registry, `InfoSorter` and the diagnostic `ClassificationQuestion` are judgements (each
card is an answer): manual-only.

### « جرّب كل الإمكانيات » and default parameters — owner decision, 2026-10-09 (supersedes the « manual » rows above)

**1. « جرّب كل الإمكانيات » (try all the possibilities).** Every type whose gesture is a **sweep of one discrete
value** (a ruler, a stepper, a list of candidates) gets a student button that walks the values one by one,
**480 ms apart** (`auto.intervalMs`, `auto.maxTicks: 80`), validating each exactly like the hand (same pure logic,
same recorded trial, same `onTrial` / `onVerdict`) while the result line (§6ter) updates in place. `unlock: 'config'`;
the label is the shared string `manipulation.autoComplete.tryAll`. The discovery question, claims, bets, pins and
every construction/answer gesture stay the student's. A type with several modes/stages gets it only in the sweepable
one (`autoComplete` is `undefined` elsewhere, so no dead button). Granted (30): `factor-pairs`, `divisor-explorer-books`,
`divisor-explorer`, `common-divisors` (groups), `coprime-explorer`, `square-root-side`, `square-fold`, `square-tiling`,
`pitch-expansion` (after the sum is reduced), `turf-factoring` (rows), `vanishing-pitch`, `solution-ray`, `growth-race`
(race), `linear-machine`, `origin-line` (pivot, fit), `percent-tag` (single), `affine-meter` (image, antecedent),
`affine-line` (shift, read), `slope-stairs`, `line-crossing` (cases), `plan-compare`, `stat-balance` (mean, median,
contrast), `shadow-stick`, `group-tanks`, `ramp-ratios` (مبتدئ), `clinometer` (ladder, align), `parallelogram-pin`
(midpoint), `vector-sum` (swimmer), `bridge-path` (explore, straight), `polygon-forge` (forge).
**Not possible (each trial is an answer, a choice, a carry or a construction):** `divisor-properties`,
`fraction-reduction`, `equation-balance`, `elimination-cards`, `pair-scoreboard`, `story-modeller`, `rotation-dial`,
`shape-turn`, `lamp-ring`, `inscribed-angle`, `bucket-fill`, `orange-peel`, `scale-blocks`, `section-slicer`,
`sphere-probe`, `thales-beam`, `parallel-level`, `cone-cylinder`, `segment-divider`, `angle-compass`,
`trig-calculator`, `vector-chain`, `translation-glide`, `route-compare`, `shape-prover`, `component-calc`,
`component-steps`, `midpoint-distance`, `ratio-ride`, `cumul-gate`, `sheet-lab`, `story-bars` (1AM, 2026-10-14: each stretched height and each card IS the answer), `division-jumps` (1AM: each q is the answer), `digit-cards` (1AM: each coloured cell and each claim is the answer; its « أكمل » is a local pale reveal, not a trial). The original three
(`team-builder`, `pgcd-differences`, `euclidean-algorithm`) keep their own `first-gesture` button. Tests: each granted
type's logic test checks that a sweep reaches the same trials as the hand.

**2. Default parameters — never empty, never an answer.** A lab opens on a meaningful state: a ruler's handle, a
probe, a dial, a threshold starts at a value instead of `null` / « ? » / « not set » (carry/construction types keep
the initial configuration they already draw). **The default must never be an answer to the task** — a lab asking for
the divisors of 48 does not open on 3 (it opens on the first non-divisor, 5); one asking for a solution does not open on
it. Each type computes its default with a small PURE helper next to its logic (`defaultWidth`, `defaultShelf`,
`defaultX`, `defaultK`, `defaultProbeIndex`, `defaultPair`…) and a test across the authored numbers. **A default is not
a trial**: it is never written to the trial memory / pairs board / traces / tried lists, never calls `onTrial` /
`onVerdict` / `onFinished`, never counts towards a discovery. It comes back after « إعادة », a level change and new
numbers. Consequence to know: a button that validates « what is on screen » (the pin of `square-fold`,
`vanishing-pitch`) answers « move x first » until the student has made a real gesture.

### How it is declared — the registry decides, the type supplies the mechanics

```js
// packages/core/curriculum/manipulationTypes.js — the pedagogical DECISION (data)
'team-builder': { controls: { …, autoComplete: { unlock: 'config' } } },
'pgcd-differences': { controls: { …, autoComplete: { unlock: 'first-gesture' } } },
// absent or false ⇒ the button is never rendered. AUTO_COMPLETE_UNLOCKS is the closed list.
```

```js
// the type's component — the MECHANICS, on its own pure logic
<ManipulationShell controller={{
  …,
  autoComplete: {
    label: t('manipulation.<ns>.autoComplete'),   // optional; generic « أكمل تلقائيًا » otherwise
    ready: !stale && !validateNumbers(numbers),   // SAME validate the free lab / class mode use
    manualDone: lab.done > 0,                     // read only when unlock is 'first-gesture'
    remaining: L.remainingMoves(lab),             // canonical gestures left; 0 ⇒ « done »
    step: () => setLab(L.autoStep),               // ONE gesture, functional, no-op at the end
    finish: () => setLab(L.fill),                 // the final state = step repeated
  },
}} />
```

Rules, each enforced by `autoComplete.test.js` or the e2e:

- **One definition of « correct ».** `step` goes through the same guard as the hand (`autoStep =
  place(nextMove)`, `fill = autoStep` repeated). `validate` is extracted into one
  `validateNumbers` read by the shell *and* by `ready`. Never a second algorithm.
- **The real state, never a picture.** `step`/`finish` update the type's `lab`; the verdict, the
  bench, the equation and `onVerdict` follow exactly as after a last manual gesture.
- **Only the gesture.** Auto-completion never calls `discover()` or `formalize()`. Discovery opens
  on the same conditions as by hand (team-builder: both an exact and an inexact sharing seen). A
  final identification (the PGCD box) stays manual.
- **Mixed is the normal case.** It completes from the *current* state: objects the learner placed
  stay where they are, nothing is duplicated. Afterwards the learner can still move objects if the
  type allows it, and the button re-enables if something becomes incomplete.
- **Configuration changes cancel.** `resetKey` is `state.epoch`; a change of numbers or « إعادة »
  stops the animation and no step of the old configuration lands on the new one.
- **Never automatic without the learner's click.**

### What the learner sees

`ManipulationControls` renders `ManipulationAutoComplete` in the student row (controls above the
stage, §8): an outlined `Btn` with the `Wand2` icon, the **same weight as إعادة / تلميح** — never the
filled colour of تحقّق — so the manipulation stays the visual focus. Status (`autoComplete.js`):
`hidden · locked · invalid · ready · running · done`. Locked, it says in one line « أنجز الخطوة
الأولى بيدك، ثم يمكنك الإكمال تلقائيًا. ». Strings: `manipulation.autoComplete.{button,hint,locked}`
and `manipulation.<ns>.autoComplete` for a type's own verb (« أنشئ الفرق »).

**Motion.** `autoCompletePlan`: one gesture per tick when there are few (the players are *seen*
arriving), grouped beyond 18 ticks so the whole run stays ≈ 0.9 s; under `prefers-reduced-motion`,
or without a `step`, the final state directly. Nothing depends on the animation.

DOM contract: `[data-manipulation-autocomplete=<status>]` wraps the button.

### Adding it to a type

1. Check the five conditions above; if any fails, the type stays manual — record why in its header.
2. Declare `autoComplete: { unlock }` in the registry (`'first-gesture'` when the *first* example
   must be done by hand inside the same instance; `'config'` when choosing the configuration and
   one pass by hand is the example, as with the teams).
3. In `logic/<type>.js`, add the one-gesture step, the completion and the remaining count **built
   on the existing transitions**, and test that step×remaining = completion, and a mixed start.
4. Pass `controller.autoComplete` as above, with `ready` reading the extracted `validateNumbers`.
5. Add `<ns>.autoComplete` to `lesson.manipulation.json` (key `lesson:manipulation.<ns>.autoComplete`), and extend the e2e block 12.

## 7. Levels and free lab

**A manipulation has exactly two levels: `beginner` (مبتدئ) and `advanced` (متقدم).** There is no
other level system. The four-palier ladder that existed until 2026-09-24 (اكتشاف · موجّه ·
استقلالية · تحدّ, keys `discover/guided/autonomy/challenge`) was **removed, not hidden** — no
`LEVEL_KEYS`, no `manipulation.levels.*` strings, no four-chip row. `levels.test.js` fails if a
registered type does not declare exactly `{ beginner, advanced }`, or if the old keys come back.

| Level | Purpose | How the difficulty rises |
|---|---|---|
| **مبتدئ** `beginner` | the entry: the tool is discovered, the relation is visible at a glance | small or familiar numbers, strong visual consequence, minimal load |
| **متقدم** `advanced` | the **same tool**, a heavier mathematical demand | less obvious numbers, more steps, a strategy to choose, a "no" case — **never a more complicated UI** |

### Where the levels come from

- **In a `ManipulationWorkspace`** (the opening of a module): the *lesson* declares the pair in
  `lesson.config.js` (`level`, `objective`, `autonomy`, `experience`) and the workspace carries
  the selector — §7bis-levels.
- **A manipulation posed alone** (a module's `intro`, a step): the pair of its *type* in
  `levels.js`, resolved against the lesson's numbers by `resolveManipulationLevels(type,
  authoredNumbers, requested?)`:
  - the lesson's numbers are **always one of the two levels** — the student lands on them;
  - which one: `requested` if given, else the level whose preset has exactly these numbers, else
    `beginner`. The other level is the type's preset.

  So `common-divisors` 28/42 opens on مبتدئ (28/42) with متقدم = 65/78; `coprime-explorer` 27/36
  opens on متقدم (27/36) with مبتدئ = 17/18.

Every preset cites a textbook element (`ref`); a beginner preset may instead be marked
`source: 'platform'` and is then tagged «مثال تفاعلي إضافي». The `advanced` preset always comes
from the textbook. The rationale of each pair is written next to it in `levels.js`.

### One selector, never two

`ManipulationLevelSelector` is the **only** level UI. It is posed in exactly one place:

- by `ManipulationWorkspace`, which switches panels (`controlsPanels` → `aria-controls`);
- by `ManipulationShell` (in its header), when
  the manipulation is **not** inside a workspace — there it switches numbers.

A manipulation knows it is inside a workspace through `WorkspaceLevelContext`
(`workspaceContext.js`): `useManipulation` then takes the workspace's level, returns
`levels: null`, and the shell renders no selector. « One selector » is per MANIPULATION, not per
page: a standalone `<Manipulation>` placed inside a later step (khawass M1 cases 2–3, bahth M1/M3,
awwaliyan M1, qawasim M1) shows its own selector below the workspace's. Those standalone labs are
not always declared in `resources[]` (48 and 105 in qawasim, 35/15/5 and 56/21/7 in khawass,
378/315 and 3356/1528 in bahth, 22/15 and 27/36 in awwaliyan) — a known gap, harmless at runtime
(`resources[]` feeds the registry and the teacher's مذكرة, not the page). The selector shows the label «مستوى المناولة»,
a colour per level (green مبتدئ, blue متقدم) so the active one reads without reading, ≥ 44 px
tabs, `aria-selected` on the active tab, arrow keys that change the tab AND move focus to it
(WAI-ARIA tabs pattern, 2026-09-29), and ids prefixed per instance so several selectors can share a
page.

### What `useManipulation` exposes

`level` (`'beginner' | 'advanced'`), `levels` (the pair, or `null` in a workspace), `setLevel(id)`,
`levelPreset`, `isAuthoredLevel`, `inWorkspace`, and **`report(fn, …args)`**. Switching level
calls `setNumbers()`, which resets the manipulation. Two consequences are enforced centrally:

- **Titles.** A lesson's `title`/`lead` name the lesson's numbers («مثال الكتاب: 22 و 15»). On the
  other level the shell replaces them with `manipulation.level.practiceTitle`
  («تدرّب — مستوى متقدم») and drops the lead; the mission is computed from the live numbers and
  stays.
- **Lesson callbacks.** Every type calls `onVerdict` / `onFinished` through `state.report(…)`,
  which fires **only on the lesson's level**: finishing 65/78 must not tick a step that asks about
  28/42. A new type must do the same — never call a lesson callback directly.

`TeamBuilder`'s behaviour (`isAdvanced`: no proposed sizes) reads the live `state.level`, so it
follows both the workspace and the standalone selector. The shelf lab reads `range`/`marks` from
the level preset (`LEVELS['divisor-explorer-books']`: 24 books on a 2–12 ruler / 420 on 10–60
with the textbook marks 26 and 28).

### Persistence, progress, analytics

### Reset, new numbers, worked examples

- **« إعادة » starts the activity over** (`state.reset`, 2026-09-30). It restores the numbers of
  the level on screen (the lesson's, or the other level's preset), closes the free lab, resets
  phase/hints/explanation, and increments `state.resetCount`. A type that keeps a **memory of
  trials** outside its scene (TeamBuilder's `tried`, the shelf's `tried`, the hand-sharing flag)
  clears it on `resetCount`. Before this, a free-lab 0 survived « إعادة » (factor-pairs stayed
  dead until reload), and the team-builder discovery reopened on an empty scene.
- **`setNumbers` resets the scene, not the memory** (`epoch` changes, `resetCount` does not):
  changing 15 → 16 is how the contrast is produced.
- `ManipulationDiscovery` forgets the student's pick on every new scene (`epoch`), so a
  conjecture is never pre-pressed for the next attempt.
- **A worked example has one level.** `useManipulation({ withLevels: false })` — prop
  `levels={false}` on `divisor-explorer-books` — poses no selector. Use it for a textbook
  example read in معارف (the 143 lab), whose type preset would otherwise duplicate another
  module's lab (audit M3-F1). A lab that is *explored* keeps its two levels.

Levels are **presentation state only**. Nothing about a level is persisted (no column, no
evidence field, no localStorage key), no "levels completed" figure exists, and levels feed
neither progression (`moduleGate` / `stepUnlock`), nor mastery, nor the admin analytics. This was
already true of the four paliers, so their removal required **no data migration**. If a level ever
has to be recorded, it is recorded as `beginner | advanced` and nothing else.

### Free lab

The free lab (`مختبر حر`, `ManipulationFreeLab.jsx`) is **not a level**: it lets the student type
their own numbers after the discovery, bounded by the registry's `changeNumbers` plus the type's
own `validate()`. DOM: `[data-manipulation-free-lab]`.

`ManipulationShell` option `freeLabAlwaysOpen` (+ `freeLabLead`) moves it **to the top** of the manipulation as
an always-visible bar (« جرّب عددًا آخر » field, Enter applies, `[data-free-lab-inline]`) from the first screen —
no discovery gate. `factor-pairs` uses it (any n from 2 to 999, e.g. 253); the title and lead written for the
lesson's own number give way to a generic title once another number is tested. The other types keep the bottom
toggle opened by the discovery. For such free numbers `widthRange(n)` stops at 2·√n when n > 120 and the first
divisor above √n is far (997 columns cannot be drawn), and the type offers a typed input for d plus ±5.

**Not manipulation levels** (do not merge them into this system): exercise difficulty
(`Facile / Normal / Difficile`, the practice engine), the Math Lab practice tiers
(`features/mathlab/tools/*/practice.js`) and the Math Lab algebra generator's equation forms
(`x + a = b` … `ax + b = cx + d`).

## 7bis-levels. The two-level workspace — مبتدئ / متقدم

> **The textbook tells us what the student must learn. Smarter Academy decides how they
> experience it.** Two fidelities, and only one of them is absolute.

### The rule

Where a manipulation is pedagogically appropriate, the module opens on **one workspace with two
levels**, never on two stacked manipulations and never on a second page:

```
┌──────────────────────────────────────────┐
│  مستوى المناولة   [ مبتدئ ] [ متقدم ]      │
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

The two levels usually show the SAME type; they may show two different types when one objective is genuinely served by two
gestures (unit 9's synthesis: the minaret's shadow, then the cylinder in the cone — §2undecies). The objective, `autonomy` and
`experience` rules are unchanged.

Its decisions live in `workspaceLevels.js` (pure, unit-tested): which tabs exist, which is active,
what the mount key is. Each panel provides its level through `WorkspaceLevelContext`, so the
manipulation inside shows **no second selector** (§7). `ManipulationLevelSelector` renders the tabs as a real `role="tablist"`,
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

### The opening card tells ONE scene

The module's opening card (`brief`: headline, drawing, text) describes the scene
of the level the module OPENS on — the three never tell two different stories.
When the beginner level replaces the textbook context, the card carries the
platform situation, sourced `addition(...)` (shown « مثال تفاعلي إضافي »), and the
textbook statement moves to the advanced level, verbatim, as a
`TextbookBox kind="situation"` with its textbook source, above the manipulation
that answers it. Fixed in `qasim-adad-tabii` Module 1 (2026-10-07): the card said
« هيا نلعب كرة القدم! » over a pitch drawing, but its text was the 420-books
statement; the football text now lives in `TEAM_EXPERIENCE.situation`.

### The default level is ALWAYS مبتدئ (owner decision, 2026-10-09 — supersedes 2026-09-21)

Every `ManipulationWorkspace` opens on **مبتدئ**, in every lesson; the student switches to متقدم with the
selector. No module passes `defaultLevel="advanced"` any more (58 modules were switched), and a module that
carries a textbook activity on متقدم says so in its `lead` (« ابدأ بالمستوى المبتدئ…، ثم انتقل إلى المتقدّم »).
The step that waits on `onFinished` stays reachable: the textbook level is one tap away. A lab's title names
its own numbers, so the student can tell which activity is open. (The old rule — open on the textbook
activity — is retired; `manipulations.mjs` assertions that a workspace opens on the module-title numbers must
click متقدم first.)

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
[data-manipulation=<type>] [data-level=beginner|advanced]   (the shell, workspace or alone)
```

Because a type may serve **both** levels (the rectangle serves 24 and 60), an e2e selector must be
scoped to the visible panel — `.first()` otherwise resolves to a `hidden` element and the test
hangs. `manipulations.mjs` provides `pickLevel()` and `visibleManip()` for exactly this.

## 7quater. Chained laboratories — one lab per level, never a silent switch

Some types chain two laboratories (`common-divisors`: identical **groups**, then the **divisor
lists** + PGCD box). Found on 2026-09-24 in `qasim-mushtarak-akbar/baqat`: after three tries in
مبتدئ (2 ✓, 5 ✗, 3 ✓) the teams scene was replaced by the lists without a word — the student
reported « another manipulation of PGCD appeared ». The rules, owner-approved:

1. **مبتدئ is one laboratory.** It ends on the gesture that carries the idea, not on a count of
   tries. `common-divisors`: placing the **largest** number of groups that works **and seeing the
   next one fail** (`greatestGroupFound`: 6 then 7 for 12/18, since 2026-09-30 — one lucky drop of
   the answer no longer counts) opens the discovery (« ماذا يمثّل أكبر عدد وضعته؟ » → PGCD). No
   lists at this level. `coprime-explorer` follows the same rule: its groups level ends on the
   groups (all k from 2 to min(a, b) tried, or a k > 1 that works), never on a chained list.
2. **متقدم may chain a second laboratory, but the student opens it.** When the first lab is
   accomplished, a card says what was found and what comes next (`[data-common-next]`, «وجدت أكبر
   عدد ممكن…» + «إلى القائمتين ←»); the second lab offers a way back (`[data-common-back]`),
   and the first lab's state survives the round trip.
3. **A lesson may pin a single lab** (`startWith="lists"`) when its title/lead is about that lab
   only (the textbook's 28/42 example in معارف).
4. **The flow is derived from the level** (`state.level`), never from a lesson flag — so it holds
   in a workspace and behind the standalone selector alike.
5. **Texts follow the stage.** Mission and hints are per stage (`missionGreatestGroups`,
   `groupsHint*` vs `hint2/hint3`), themed words only (no « باقات » in the football theme), and a
   lesson `lead` must not promise a stage its level does not have.
6. **The first lab's rail always contains the answer** (`groupRail` includes the PGCD even
   beyond 24), otherwise « largest found » could be unreachable.

A new chained type follows the same pattern: a pure `…Done(state)` predicate in `logic/`, a
derived `groupsOnly`-style flag from `state.level`, the card + button + back link, and a
`logic.test.js` case proving that the old threshold no longer ends the first lab.

Unit 7 chains by this rule: `affine-meter` (`image|antecedent|classify`, a « التالي » card per stage and numbered tabs back),
`affine-line` (`shift|identify`: the card `[data-al-next-card]` once (d′) is accepted and read at two abscissas, `[data-al-back]`
keeps both labs' states), `line-crossing` (build → probe → `cases`, opened by the student's button after the two lamps lit,
with a way back) and `plan-compare` (`model|compare`, card + button + back).

## 7bis. What a manipulation does NOT do

A manipulation is a learning instrument, not an assessment. Verified in code:

- **It writes nothing.** No localStorage, no API call, no evidence. The only manipulation state
  that outlives a remount is whatever the module holds.
- **`onFinished` is not completion — but it may open a step.** Every shell type fires `onFinished`
  (through `state.report`, so only the lesson's own level ticks the lesson) from an effect when the
  phase reaches `formal`. It never marks a MODULE done, never writes progress and never produces
  evidence. What it may do, and what the unit does in exactly seven places (verified 2026-09-30 —
  qawasim M1 step 1, khawass M1 step 1, bahth M1 steps 1 and 2, bahth M3 steps 1 and 3, awwaliyan
  M1 step 1; the three added on 2026-09-30 are the `d1`/`e1`/`c1` handlers that module comments
  described as gates while they gated nothing), is make the step that
  *comments on the activity* wait until the activity's lab has been done; the other 4AM modules
  use it only to hide a hint line. This is allowed on two conditions, both true today:
  1. the formal phase is **always reachable** by the lesson's numbers — the discovery is reached by
     the gesture (with hints, and « أكمل … » auto-completion for a repetitive gesture, §6bis), and
     the conjecture that follows can be retried without limit, each wrong pick explaining itself
     (`ManipulationDiscovery`); and
  2. the manipulation is the module's **own textbook activity**, opened by default on the level
     that carries it (reachable with one tap on متقدم — the default is always مبتدئ, §7quater).
  Never make a step wait on a manipulation whose discovery the lesson's numbers cannot reach (the
  free lab now refuses such numbers: Euclid when one number divides the other, differences when
  a = b; the factor-pairs rail always includes the first divisor above √n). This is distinct from
  the non-blocking invariant of `LESSON_CONTRACT.md`, which is about *questions*: a question step is
  done when answered, never when answered correctly.
- **Mistakes cost nothing.** A refused drop keeps the object in hand and explains why in Arabic; a
  wrong conjecture is replayable. Attempt counters exist in three logic files (`teamBuilder`,
  `commonDivisors`, `coprime`) and are read by nothing.
- **« الشرح » waits for the discovery.** `ManipulationControls` renders the explanation toggle
  only in the `discover`/`formal` phases (or class mode). The panel and the registry's `shows`
  line state the rule; until 2026-09-30 they were one click away from the first screen
  (audit, defect e).
- **The result is never shown before the gesture that finds it.** The difference and Euclid chains
  print `PGCD(a ; b) = ?` on their last row until the student has placed the PGCD in its box
  (2026-09-29: « أكمل الفروق / القسمات » used to reveal it in one click).

## 7ter. Creating a new manipulation

Ten steps, in this order. Steps 1, 2 and 5 are enforced by tests that fail otherwise.

1. **Declare the type** in `packages/core/curriculum/manipulationTypes.js`:
   `'my-type': { shows: '<the idea it makes visible, in Arabic>', controls: { reset, nextStep,
   prevStep?, toggleExplanation, hideConclusion?, changeNumbers: false | { field: [min, max], … },
   autoComplete?: false | { unlock: 'config' | 'first-gesture' } } }`. Decide `autoComplete`
   with §6bis: only for a repetitive gesture, never for a choice.
2. **Add exactly two levels** to `LEVELS['my-type']` in `levels.js`: `{ beginner, advanced }`,
   each `{ numbers, ref, source }` (plus any per-level prop the type reads, e.g. `candidates`),
   with a one-line comment saying why the advanced one is harder. `advanced` cites the textbook;
   `beginner` may be `source: 'platform'`. `levels.test.js` checks the shape, the bounds and that
   advanced ≠ beginner. Call lesson callbacks through `state.report(onFinished, …)`.
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
6. **Add the Arabic strings** to `i18n/locales/ar/lesson.manipulation.json` under `<ns>.*` (read as `lesson:manipulation.<ns>.*` — the file is loaded WITH the lesson, never in the entry bundle: BUNDLE_BOUNDARIES §3 « lesson.manipulation »)
   (title, mission, hints, discovery prompt and options, explanation, and one key per reject
   reason). Never hardcode Arabic in the component.
7. **Declare it as lesson data**: `resources[]` in `lesson.config.js` with
   `{ kind: 'manipulation', code, type, module, title, learningPointIds, sourceElementIds }`, then
   render `<Manipulation type="my-type" … />` in the module's `intro` slot.
8. **Extend the e2e** `manipulations.mjs` with the drag, the tap alternative, the keyboard path,
   reset, and the no-mode-toggle assertion.
9. If the manipulation must **draw a real object**, extend parameterised inline SVG (see
   `primitives/BookFigure.jsx`, `PlayerFigure.jsx`) and put any exact geometry in a pure,
   unit-tested module swept over its whole range (see `logic/bookshelf.js` →
   `bookcaseLayout`, `teamFormation.js`). Never a raster image — root `CLAUDE.md`.
10. **Write the design sheet** of `MANIPULATION_DNA.md` §7 in the header, next to the five
   questions — above all VARIABLE (what the finger controls), RESISTANCE and CONTRAST.

**Reuse before you write.** The ten types of unit 1 are reused across the unit by changing props alone
(`factor-pairs` serves 24, 60, 48 and 105; `common-divisors` serves two lessons — 4 and 5 — with
two themes). Write a new type
only when the mathematical idea or the gesture genuinely differs. There is no standalone type
any more (the books lab joined the shell on 2026-09-30): a drawing that carries the argument
lives INSIDE the shell's stage, and keeps levels, hints, discovery and reset.

## 8. Arabic, RTL, mobile, motion

Interface RTL in Cairo; every numeric block (`dir="ltr"`): tiles, bars, equations, divisions,
chains. `PGCD` stays Latin, as in the textbook. Counted nouns (« 15 رفًّا », « 4 كتب »,
« لاعب واحد ») go through i18next plural keys, never `{{n}} + a fixed plural`:
`ARABIC_RTL_CONTRACT.md`, "Counting nouns". Done for `team-builder` and the shelf; the other
seven types still carry the old strings (audit, defect g). Full RTL rules:
`ARABIC_RTL_CONTRACT.md`. Touch targets ≥ 44 px for controls — the shell's buttons (`Btn` in
`ManipulationTeacherMode.jsx`: إعادة, تلميح, auto-complete, الشرح…) and the free-lab toggle were 40
and 36 px until 2026-09-29 and are 44 px now; note that
`NumberTile size="sm"` — used by most rails — is **40 px**, and the mobile e2e
asserts ≥ 40 px accordingly. Layout works from 320 px:
controls above the stage (they must not move under the finger), vertical composition on phones.
All motion is transform/opacity, and `prefers-reduced-motion` removes it without changing any final
state.

### 8bis. One screen — the whole manipulation is seen without scrolling (owner rule, 2026-10-01, binding on every manipulation)

**The student never scrolls to see or to interact with a manipulation.** The drawn object, every control
that acts on it (stretch handles, ± buttons, drag sources AND their drop targets, the check / claim button)
and the reading it produces (gauge, verdict, the equation line the gesture writes) are visible together in
ONE viewport, with the app chrome (top bar, lesson header). Found by the owner on unit 5
(`pair-scoreboard`, « نشاط 1: 32 عاملا قبل التقاعد وبعده »): with the 32 men and women on screen the x and y
sliders were below the fold, so moving a slider hid the people it moved. It is the lesson-side twin of the
Math Lab's « d'un seul regard » (`MATH_LAB.md` §3.5).

1. **Budget the stage from the viewport, not from the content.** The scene is a CSS size container whose
   height is capped by the viewport (`max-height: calc(100dvh - <chrome>)`, `dvh` so mobile toolbars count);
   countable objects are sized with the scene (`clamp` / container units, the `itemSizeCss` rule of §2bis), so
   32 or 140 figures SHRINK instead of pushing the controls down. Never a fixed pixel size per object.
2. **Controls beside the object they move.** A handle sits next to (or overlaid on the edge of) the figure
   it changes, a drop target is reachable from its source without scrolling, the reading sits beside or
   directly under the figure — never a screen apart.
3. **Secondary material yields — the student chooses what to see (owner rule, same day).** For a large
   activity, two shared tools let the student make the instrument fit and look behind what covers it:
   - **Hide / show** — `primitives/LabFold.jsx` (`<LabFold id="<type>.<block>" title>`): a « إخفاء / إظهار »
     block, open by default, remembered per browser (`sa-lab-fold:<id>`), content kept mounted (`hidden`).
     For SECONDARY material only — trial tables, written lines, legends, explanations — never the object or a
     control that acts on it. The lesson twin of the Math Lab's `LabPanel` (`MATH_LAB.md` §3.5.4).
   - **Move** — `primitives/MovablePanel.jsx` (`<MovablePanel id bounds={sceneRef} title className="absolute …">`
     inside a `relative` scene): a gauge, a counter, a legend or the current line FLOATS on the scene so
     everything fits one screen, and the student drags it elsewhere by its ⠿ handle (pointer, arrows,
     Shift + arrow = large step) when it covers what they want to see; ↺ puts it back. Always clamped entire
     inside the scene (pure geometry `primitives/movablePanel.js`, tested), position remembered per browser
     (`sa-lab-move:<id>`). Moving a panel is NOT a mathematical gesture: it changes no lab state and is never an
     answer (the mathematical gestures stay `useDragInteraction` / `useStretchInteraction`).
   Never place secondary material between an object and its controls. Strings: `lesson.manipulation.json ›
   manipulation.layout.*`. DOM: `[data-lab-fold][data-open]`, `[data-lab-fold-toggle]`,
   `[data-movable-panel]`, `[data-movable-handle]`, `[data-movable-reset]`.
4. **Many objects form a near-square block, never a long strip.** 32 agents are a 6 × 6 office, not a
   2 × 16 column (owner, unit 5): columns ≈ ⌈√n⌉, adjusted to the scene's aspect ratio, the layout computed in the
   type's pure logic and tested (|rows − cols| ≤ 1 for a square scene).
5. **Phones too.** Checked at 1280 × 800, 1366 × 768, 390 × 844 and 320 × 640: on phones the composition
   stacks, but each object keeps its controls in the same sight (side by side columns, or the handle row on
   the scene's edge).
   **Bleed when the frames eat the width (2026-10-14, `digit-cards`).** At 320 px a lesson nests the lab in
   padded frames (≈ 182 px usable): when a grid needs more (7 cells × 40 px for the finger), the glance block
   widens SYMMETRICALLY over those frames as a white card (`margin-inline: -m`, `data-bleed=<m>`), never past
   the screen gutter, computed from the measured width (`need = columns × 40`). Never shrink a cell below 40 px.
6. **Measured, not eyeballed.** The type's e2e asserts, for each viewport and both levels, that once the lab is
   scrolled into view the bounding box of the figure + its controls fits the viewport height
   (`fitsOneScreen` in the unit's e2e); the component header says how the rule is met.

### 8quater. LabCoach — the onboarding of EVERY lab (validated 2026-10-14 on `rank-exchange`; MANDATORY for all manipulations)

**Every manipulation type, at every level, in every lesson of every grade must adopt it** (owner, 2026-10-14) with the SAME design:
the shared `useLabCoach` + `placeBubble`, the same ring, bubble, buttons, switch, strings layout (`<type>.coach.{hide,show,ok,stop,<stepId>}`),
storage keys and DOM contract below — never a look-alike, never a per-lab restyle. Per lab you write only: (1) a pure
`coachOf(state)` in the lab's `logic/` returning `{ id, target, rank?, gesture }`, whose unit test FOLLOWS it to the end of every task
(the lab must be completable by the coach alone) ; (2) the Arabic sentences ; (3) the wiring (`coachText`, toggle under the question,
overlay in the positioned glance). Because a lab used in several lessons shares one storage namespace per TYPE (`sa.labCoach.<type>`), tips
are learned once per type, not per lesson. The `coach` prop is therefore ON by default for adopting labs (`coach = true`; a lab not yet
adopted simply lacks the wiring — tracked by the gate in `LAB_COACH_ROLLOUT.md`).

Goal: the student never wonders « how does this work? » or « what am I supposed to do now? ». `primitives/LabCoach.jsx`
(`useLabCoach({ lab, step, text, labels })` → `{ toggle, overlay, visible }`) + pure `primitives/labCoach.js` (`placeBubble`, storage).
Rules (the contract for any lab that adopts it):

- **Contextual, not a tour.** The lab computes the NEXT useful action as pure data `{ id, target, gesture }` (`target` = a selector of
  the lab's DOM contract; the function is unit-tested by FOLLOWING it until the task ends). `null` ⇒ nothing shown.
- **Shows the button, never the rule** (« discover, don't be told »): one sentence of gesture (« اضغط هنا لتربط 10 أقلام في حزمة »);
  the render test refuses a coach string that states the rule.
- **One tip, once.** A step the student has done (the step changed) or dismissed (« فهمت ») is never shown again, stored in
  `localStorage` `sa.labCoach.<lab>.learned`; a returning student sees nothing.
- **Hidable, and brought back.** « فهمت » (this tip), « إيقاف الإرشاد » (all, persisted `…off`), Escape, and an ALWAYS-VISIBLE switch under
  the question (« إخفاء الإرشاد » ⇄ « أرِني ماذا أفعل »). Storage always under try/catch.
- **Never in the way.** The ring and the layer are `pointer-events: none` (the finger passes through to the real button); the bubble
  sits below or above the target, never on it, clamped inside the lab frame (checked at 1280 / 390 / 320 px); no focus stealing;
  `prefers-reduced-motion` stops the pulse; bubble targets ≥ 40 px.
- **Switchable.** The lab takes a `coach` prop (adopting labs: default true; pass `coach={false}` only for a lab that has no control to find,
  and say why in its header): nothing is rendered and no storage is read when off.

**Wiring for labs built on `ManipulationShell` (batch 1, 2026-10-15 — the divisibility labs; the pattern for the ~60 shell labs).** The lab
calls `useLabCoach` itself (it knows its next gesture) and passes `coach={coachOn ? coach : null}` to the shell, prop `coach` default TRUE:
the shell is `relative`, puts `coach.toggle` right under the mission / lead (`[data-lab-coach-slot]`, before the stage) and `coach.overlay` as its
last child — so a `target` may be ANY control of the frame (header, stage, bottom). Strings live under the lab's own i18n key
(`divisorExplorer`, `bookshelf`, `teamBuilder`, `factorPairs`, `props`, `common` → `.coach.{hide,show,ok,stop,<stepId>}`), storage under the TYPE
(`sa.labCoach.<type>`). Targets reuse the DOM contract the drag kit already writes (`[data-drag-source="<id>"]`, `[data-drop-zone="<id>"]`,
`[data-stretch-handle]`) plus the few markers added for it (`data-shelf-nudge`, `data-fp-nudge`, `data-tb-teams`, `data-group-add`, `data-group-row`;
`NumberTile` now forwards extra props on its `onClick` form).

- **Rules this batch added.** (1) A step whose answer IS the exercise never points at the answer: `common-divisors` lists point at the DROP ZONE
  (middle, then PGCD), never at a token — its unit test follows the coach with an oracle for that decision only. (2) A zone is named by its
  rank (« المنطقة الأولى »), not by the words it already shows (§17.7). (3) When the tip also names the non-drag path (« أو اضغط + »), the ring
  covers the row holding BOTH (`[data-group-row]`) so the bubble never sits on the alternative. (4) The lab's own « اسحب بإصبعك… » hint line is
  silent while the coach is visible (`divisor-explorer`). (5) The discovery question (ManipulationDiscovery) that follows a lab is a plain answer card
  that nothing hides: out of the coach; `coachOf` ends (`null`) when the lab's own goal (the discovery) is earned.
- **`placeBubble({ view })` — always seen (extends LabCoach for ALL labs).** A lab is taller than a phone screen; when the target is off-screen the
  bubble sticks to the visible edge (`view` = the visible band of the frame: below the header, above the bottom nav and, under `lg`, above the
  floating كرّاسي / بطاقتي column), its arrow points toward the target, `data-edge="true"`, and it follows the scroll. A lab entirely off-screen pins
  nothing (several labs share a page). Tested in `primitives/labCoach.test.js`; **verified in the browser at 1280×800 only** — the owner skipped the
  mobile screens for this batch (`QA_MOBILE=1` runs 390 / 320), so the phone placement is unit-tested, not eyeballed.
- Known limit: in `common-divisors` lists the bubble above the middle zone covers part of the 60-list chips (no room below); « فهمت » clears it.

### 8ter. The visual kit — one language for every lab (2026-10-14, owner request « the best possible for Gen Alpha 11–13 »)

Owner reference: a prompt card above a lavender stage with full-body drawn children, value pills, a dimension pill, name pills
and a control card with a big readout and round −/+. The pieces are shared, never redrawn per lab:

- **`primitives/LabKit.jsx`** (HTML): `LabCard`, `StageFrame` (lavender stage), `QuestionChip`, `PromptCard` (`chip` + `aside` on one
  row, the big `title` with a `lamp` that lights when the sentence becomes true, the `instruction`, children; **§17.9 form** (2026-10-14):
  `context` (+ `contextProps`) opens the card with the givens `[data-lab-context]`, `title` is then THE question `[data-lab-question]`,
  `aside` moves UNDER the question `[data-lab-aside]` and no `chip` is passed — the five 1AM labs use this form), `ChoiceTray` +
  `ChoiceCard` (big answer cards on a raised edge; `state` idle | selected | right | tried | locked; `size` lg | md | sm; `ltr` for a
  calculation), `RoundButton`, `StepperCard` (title, BIG readout, round − / + with + filled, an optional gesture `hint` — omit it when the verdict line already says the gesture, DNA §17.7; `layout` card | row),
  `NamePill`, `LabNote` (guides the gesture), `VerdictBanner` (the line the gesture writes, `role=status`). `ManipulationShell` takes `titleHidden` (2026-10-14, DNA §17.9): the shell title becomes `sr-only`, so a lab opens on its context and question. Every `data-*` / `aria-*`
  passes through (`titleProps`, `lessProps`, `moreProps`, `readoutProps`, `...rest`): a lab keeps its DOM contract when it adopts the kit.
  The kit writes no text of its own.
- **`primitives/SvgPill.jsx`** (inside a scene): `SvgPill` (a value pill, `pointer="down"` above an object; LTR island) and
  `SvgDimension` (a dimension between two levels with its pill at the side or above; arrows turn outside when the gap is small).
- **`primitives/KidFigure.jsx` + `kidFigure.js`**: a drawn 11–13-year-old — boys in a hoodie (hair `short | curly`), **girls always in
  Islamic dress** (owner, 2026-10-14): `hairStyle="hijab"` with a `scarf` (`SCARVES`: rose, lavender, mint, sky, sand — a draped scarf over
  the shoulders and chest, a forehead band, a pin) and a long tunic over wide trousers (`tunic`, default with the hijab); no uncovered-hair
  style exists (tested). Skins, outfits, moods `happy | neutral | wonder | proud`, the « ؟ » badge. Its geometry is the measure: the crown is exactly `top`, the soles
  touch `foot` (tested at every scale). A drawing that floats above the ruler's zero is a lie — never do it.

Rules: (1) the PromptCard never states the rule to discover — a `LabNote` guides the gesture only (« discover, don't be told »);
(2) the verdict sits beside the control or below the stage, never between the prompt and the stage (the stage must not jump when a
verdict appears); (3) on a narrow lab the controls go INSIDE the stage (a lane), not in an extra row; (4) numbers with Latin units are LTR
islands; (5) light surfaces only. Tests: `primitives/labKit.test.jsx`. Reference implementation: `operations/StoryBars.jsx`.

**Phone frames (same day).** A lesson module nested two `.sa-page` (ModuleLayout's `<main>` and ContentModule's `<div>`): under 640 px the
inner page no longer adds gutters (`index.css`), and the lab frames are thinner on phones (ManipulationWorkspace / Shell / Stage
`p-1.5`, 1 px border): a lab gets ≈ 256 px instead of ≈ 200 px at 320 px. On desktop the double gutter (2 × 60 px) remains — owner's
call (it would widen every lesson).

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
[ ] Auto-completion decided (§6bis): AUTO with a shared rule and a mixed-start test, or MANUAL with a reason
[ ] Classroom Mode (if wrapped): enter/exit keeps the state, fits the screen, no page scroll
[ ] Student mode works
[ ] Mobile works (320 px, ≥44 px targets, no horizontal scroll)
[ ] One screen (§8bis): object + its controls + its reading visible together, no vertical scroll, at 1280×800 / 1366×768 / 390×844 / 320×640, both levels
[ ] Large activity: secondary blocks in LabFold, floating readings in MovablePanel, many objects in a near-square block
[ ] RTL works
[ ] Mathematical notation is LTR where needed
[ ] Reduced motion works
[ ] No unnecessary animation
[ ] No decorative interaction
[ ] Exactly two levels in levels.js (beginner / advanced), advanced cites the extraction
[ ] Lesson callbacks go through state.report (never fire on the other level)
[ ] Uses core arithmetic functions
[ ] Mathematical result is tested (logic/logic.test.js)
```

## 10. Tests

- `packages/core/arithmetic/linear.test.js` and `logic/equationBalance.test.js`, `logic/vanishingPitch.test.js`,
  `logic/solutionRay.test.js`, `logic/growthRace.test.js` — unit 4: act-1 (−3, −1/7), معارف 1 (9/2), the
  طرائق decimals (−4), an equation without solution (ex-9); the tip / mirror / refusal rules and the k-groups
  split; 3(x − 5) and (x − 2)(x + 5) pins swept over every graduation at five widths; inequality rays swept against
  direct evaluation, the bracket witness, the invariance of the traces under legal transformations; the build
  refusals and the meeting point of both race worlds.
- `packages/core/arithmetic/polynomials.test.js` and `logic/algebraLabs.test.js` — unit 3: the
  textbook's expansions (معارف 1–2), the Descartes grid, $(3x - 1)(3 + x) → 3x^2 + 8x - 3$ by carry and
  merge, the refused merge, the cancelling $\pm 3x$, the forgotten zones of $(x + 3)^2$, the two-x
  discovery rule, the signed geometry swept for 8 expressions over every x of their ruler; rows
  $6x^2 + 4x$ (3 refused, 2 → $2x(3x + 2)$), $9x + 3$, $7x - 21$, the gcd-and-refusal rule, every r
  swept; square $x^2 + 6x + 9$ (2 | 4 refused, 3 | 3 closes), $x^2 + 25$ never closes, closing swept.
- `packages/core/arithmetic/squareRoots.test.js` — unit 2's exact arithmetic: perfect squares,
  √ of a rational (rational ⇔ numerator and denominator squares), squares compared in integers
  (no decimal up to 1/1000 squares to 5, swept), the calculator's 2,236067978² = 5,000000002237008484,
  n = a² × b with b square-free, and every k² dividing n.
- `logic/squareLabs.test.js` — the three unit-2 labs on the textbook's numbers: 36 exact / 5 bracketed
  to 1/1000 with the zoom locked until the student brackets by hand; 16/9 on the thirds while 6, 7, 13
  and 25/13 resist every graduation 1…12 (swept); x² = 9 needs −3 too, x² = 0 one pin, x² = −9 refuses
  pins and accepts « لا حل », √3 pinned exactly; 28 = 2² × 7 (k = 3 refused), 144 always gives side 12,
  288 needs k = 12; every tiling of 11 numbers swept.
- `packages/core/arithmetic/equalGrouping.test.js` — the equal-sharing model behind the library
  and the pitch: partition vs quotition, and a remainder that is always a number of objects.
- `divisibility/teamFormation.test.js` — the formation geometry, **swept over every reachable
  squad size** (no overlap, nothing outside the pitch) rather than sampled at the default.
- `autoComplete.test.js` — §6bis: which types the registry grants (exactly the three), the button
  status, the animation plan, and that auto-completion reaches the manual state — team-builder
  swept over the whole registry domain (`n = k × q + r`, no rounding), step×remaining = fill, a
  mixed manual start, manual rearrangement afterwards; the differences and Euclid chains without
  filling the PGCD box.
- `workspaceLevels.test.js` — the workspace's decisions: default level, always an active level,
  and a mount key that changes only when the mathematical model does.
- `primitives/groupingLayout.test.js` — the drawn grouping says what the division says (9 bouquets
  of 90 and 54, 17 and 18 in k bags for every k, 84/48 in 4 portions), the resume beyond
  `maxGroups`, and that every drawn theme is a registered `VISUAL_THEMES` id.
- `primitives/brickLayout.test.js` — walls in bricks of n: sum, difference and remainder are whole
  walls for every case of activity 3 and for 900/90/9; a wall that does not fall exactly keeps its
  partial brick; bricks cover the length with no gap or overlap.
- `logic/bookshelf.test.js` — the shelf lab's REAL logic (2026-09-30): `arrange` on the whole
  ruler (shelves × b + floor = a, floor < b), the exact lengths are the divisors, a trial is
  memorised once, discovery needs 3 trials with contrast, the 11/13 symmetry, counter-examples
  from the range, and `bookcaseLayout` **swept** over every b of 420 (10–60), 143 (5–30) and
  24 (2–12) at five widths: every book drawn once, full shelves = q, ghost = r books + b − r
  slots, nothing outside the width, no two shelves overlapping.
- `logic/logic.test.js` additions of 2026-09-30 (lessons 2–8): factor-pairs « turned » is
  order-independent, its ruler range and the rectangle geometry swept for 24/48/60/105;
  divisor-properties prediction (`predictFirst`, `outcome`); common-divisors `addGroup` builds the
  ✓/✗ pattern and « greatest » needs the next k; the PGCD boxes (differences, Euclid) refuse by
  divisibility (`notDividesA/B`, `notGreatest`); Euclid's overflow must be *tried* (`tryCopy`,
  `tryOneMore`); coprime lists need every divisor of the smaller number tested, and one common
  > 1 refutes; fraction path A offers non-common numbers, the irreducibility claim is judged,
  path B shows what a non-greatest divisor gives, and « equal paths » is right after a one-step
  path A.
- `logic/logic.test.js` — mathematics, allowed/refused actions, discovery conditions, final states,
  on the textbook numbers (60, 105, 18-12-3, 90/54, 42/60, 252/140, 765/135, 1938/836,
  17/18, 27/36, 84/48, 595/560). Team-builder's refusal reasons and their numbers
  (`rejectDetails`, the source of the refusal message) are asserted. The `divisor-explorer`
  block tests only that registered-but-unused type's logic; it was titled « 420 livres » and
  gave false assurance about the books lab until 2026-09-30.
- `apps/web/e2e/lesson-kit/manipulations.mjs` — real pointer drags, the tap alternative, keyboard,
  reset, hints, levels, mobile at 320 px, reduced motion, the absence of any mode toggle, the
  Classroom Mode blocks (C1–C3) on the shelf lab, the shelf itself (L1: a real drag of the
  bookend with the library following mid-gesture, keyboard, −/+, a tap on the ruler, the
  extremes 10 and 60, the refuted conjecture, the formal rule with 28 × 15 = 15 × 28, reset;
  L1m at 320 px), the **edge auto-scroll** drag from the bench to team 1 on a phone (DS), and the **two-level workspace** blocks
  (W1–W3): default level, both tabs, the inactive panel `hidden`, drag/tap/keyboard on the
  football lab, the explained refusal, `15 = 3 × 5` then `16 = 3 × 5 + 1` with one player drawn
  outside, discovery opening only after both cases, state surviving a level round trip, arrow-key
  navigation, and the pitch keeping its 2:3 proportions at 320 px.
  Block **9bis** (2026-09-21) counts the drawn worlds: 144 objects in the two piles, 9 bouquets
  of 16 drawn flowers, 4 leftover flowers drawn on the tray, the coprime insight after 1/2/3
  bags, 4 portions of 33 in the recipe, three built zones with no partial brick, the scissors
  mark and 252 − 140 = 112.
  Block **12** (2026-09-24, AC1–AC11; rewritten 2026-09-30) covers auto-completion: « أنشئ الفرق »
  **locked** on load, then unlocked by one sharing done by hand, a mixed start on 20/4 (two
  players by hand stay put), no duplicate, no discovery triggered, manual rearrangement
  afterwards, 16/3 leaving one player drawn on a bench renamed « الباقي », a configuration change
  in mid-animation, « إعادة » in mid-animation restoring 15/3 and re-locking, reduced motion,
  320 px, the locked → ready ribbons of the PGCD machines, and no button on the choice-type
  manipulations. **223/223 green on 2026-09-30** against the dev server (with `4am-aadad-tabiiya-natiqa.mjs` 29/29 and `classroom.mjs` 73/73), including the معارف 143 block (M3) and the blocks for the redesigned lessons 2–8 (L2 rectangle, chantier prediction + LTR equations, bouquets add/remove + « greatest » beyond, ribbons without pre-cut, Euclid's tried overflow, coprime proof, recipe decisions). On 2026-09-24 the suite was 176/177 against the dev
  server; the one failure, C3, was the Math Lab « المختبر » button in the Classroom toolbar (36 px
  wide under 640 px). Fixed 2026-09-29 (`MathLabEntryButton` `min-w-[44px]`); C3 now also ignores
  the pointer controls, which are `hidden` below `sm` on purpose.
  **139/139 green on 2026-09-21**, with `4am-aadad-tabiiya-natiqa.mjs` at 27/27.
  Run it against the **dev** server: `KIT_BASE=http://localhost:5173 node
  apps/web/e2e/lesson-kit/manipulations.mjs`. The helper's default is 5183,
  which is `vite preview` serving a stale build with no API — several suite
  headers still print 5183, and that is a documentation bug, not a setting.

  **Not covered, despite what the suite header says:** class mode
  (`ManipulationTeacherMode`) is never exercised, and the "result never appears
  before اكتشف" invariant is only spot-checked in the Euclid block — there is no
  general assertion on `data-phase`.
