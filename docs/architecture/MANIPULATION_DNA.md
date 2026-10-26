# Manipulation DNA — when the student's hand makes the mathematics

> **Status: authoritative design philosophy (2026-09-30).** It sits *above* the
> two contracts and says **why** a manipulation is built the way it is. It is
> not a visual template, and it does not replace a contract.
>
> ```
> MANIPULATION_DNA            (this file)    why — the design philosophy
>         ↓
> INTERACTION_PEDAGOGY.md                    how a lesson uses interaction
>         ↓
> MANIPULATION_CONTRACT.md                   how a manipulation is built in code
>         ↓
> lesson-specific design                     the design sheet (§7) in the component header
>         ↓
> implementation                             logic/*.js → component → e2e
> ```
>
> The reference implementation is lesson 1 of the 4AM unit, `qasim-adad-tabii`
> module 1: `team-builder` (partition) and `divisor-explorer-books` (quotition),
> redesigned on 2026-09-30 from the forensic audit
> (`docs/reports/REFERENCE_MANIPULATIONS_FORENSIC_AUDIT.md`). Treat it as a
> **quality bar**, not as a shape to copy (§12).

## 1. The one question

Do not ask: *"How can we make this lesson interactive?"*

Ask: **"What should the student's hand be able to do that makes this mathematical
idea inevitable?"**

A manipulation succeeds when the student can say: *"I didn't just see the
mathematics. I touched it, changed it, tested it, and discovered why it works."*

## 2. The design chain — always top to bottom

```
MATHEMATICAL PHENOMENON      "sharing sometimes leaves something over"
        ↓
MATHEMATICAL RELATIONSHIP    a = b × q + r, 0 ≤ r < b
        ↓
MATHEMATICAL VARIABLES       what can vary? b (and a)
        ↓
NATURAL REPRESENTATION       groups of real objects: teams, shelves
        ↓
STUDENT ACTION               the hand controls ONE variable: carry a player / stretch a shelf
        ↓
MATHEMATICAL CONSEQUENCE     q and r change — computed by logic/, never by the view
        ↓
VISIBLE EVIDENCE             the player who fits nowhere; the books in the ghost shelf
        ↓
CONTRAST                     one case that leaves nothing, one that leaves something
        ↓
CONJECTURE                   "the floor empties when…" — chosen, with refutable distractors
        ↓
FORMALIZATION                a = b × q + r names what the hand just did
```

Never start from *"which component should we use?"*. Start from the
phenomenon, and only reach the component catalogue at the end.

## 3. The seven principles

### 3.1 The finger controls a mathematical variable

Ask what the finger actually controls. Strong: the length of a shelf *is* b;
moving a player *is* changing a team's size. Weak: a number button that makes
the application compute. The old books lab had 17 size buttons; the finger
controlled a UI selection, and the mathematics happened elsewhere. The
redesigned lab gives the finger the bookend of a shelf, so b is a length the
student holds (`useStretchInteraction`).

### 3.2 The action causes the mathematics

```
student action → mathematical state changes → representation changes      (causal)
student action → JavaScript calculates → UI displays the answer            (calculator)
```

The computation exists internally in both cases. What matters is what the
student *experiences*. In the shelf lab, all 420 books re-shelve *during* the
drag, so the consequence stays under the finger. Under the old design the
floor was usually off-screen at the moment of the tap.

### 3.3 Mathematics may resist — the refusal is the evidence

A strong manipulation sometimes says *"that cannot work"*, and the refusal
comes from the rule itself:

- **team-builder:** `canPlace` refuses a player who would break equality, so
  the 16th player can go nowhere and stays drawn on the bench.
- **bookshelf:** r books cannot fill a shelf. They sit in a **ghost shelf**
  whose b − r empty slots show what is missing: *« ينقصه 22 كتابًا »*.

The resistance is drawn and explained with the numbers on screen. It is never
a red state or a generic message.

### 3.4 Failure is information — four kinds, four responses

| Kind | Example | Response |
|---|---|---|
| Mathematical exploration | a 26-book shelf | not an error; it is a result with a remainder, shown neutrally (no « رائع! / توقّف! ») |
| Mathematical impossibility | a 6th player into a full team | the refusal is explained with the on-screen numbers (`rejectDetails`) |
| Accidental UI error | a small drag that falls back on the player's own team; a drag released in empty space | silent (`''` reason); the object returns home and is no longer held |
| Genuine misconception | "it works when the number is even" | a counter-example taken from the student's own range (`counterExamples`: 26 is even and leaves 4) |

### 3.5 Preserve and show invariants

Name what stays constant while something changes. In both labs:

- `a` never changes (15 players, 420 books; shelved + floor = 420).
- Every group is equal: a single bookend sets every shelf, and `canPlace`
  keeps the teams equal.
- r < b: the leftover never makes one more group.

The invariant is often the lesson. «r أصغر دائمًا من b» is written in the roles
line (`DivisionRoles`) every time.

### 3.6 Contrast is required

Discovery never opens on one case. Both labs require an exact case **and** an
inexact case: `discoveryReady(memory)` for the teams, and
`remainderDiscoveryReady(tried)` for the shelves, which also requires three
validated trials. A trial is a **validated** gesture (release, or a key/button
followed by a pause), not a value the finger passed over.

### 3.7 Formalization names an experience

```
experience → observation → conjecture (chosen) → mathematical language → formula
```

`a = b × q + r` appears only after the correct conjecture. «الشرح», which restates
the rule, is not offered before the discovery phase (`ManipulationControls`).
The formula should feel like *"ah — that's what just happened"*.

## 4. Interaction distance

**Definition.** The number of conceptual transformations between the student's
physical action and the mathematical consequence they see.

```
finger → mathematical object → mathematical consequence                    (short)
finger → button → UI state → event → calculation → redraw → interpretation (long)
```

Measured on the reference lesson:

| Lab | Chain | Distance |
|---|---|---|
| books, before 2026-09-30 | tap a number → state → redraw below the fold → scroll → read the floor | long; the consequence was often off-screen |
| books, now | drag the bookend (b) → every shelf follows → floor fills/empties under the finger | short |
| teams | carry a player → the team grows / the refusal shakes | short |

The goal is **minimum unnecessary distance**, not a minimum number of steps.
A worked example may legitimately be one step further away.

## 5. Causal visibility — the internal scale

| Level | Name | Meaning |
|---|---|---|
| 0 | decorative | the interaction is decoration |
| 1 | reactive | something reacts to the student |
| 2 | representational | the interaction represents mathematics |
| 3 | causal | the action causes a mathematical transformation |
| 4 | constraining | the mathematics constrains the possible actions |
| 5 | generative | the student constructs states and the phenomenon emerges from them |

The reference lesson:

| Lab | Level | Why |
|---|---|---|
| team-builder | 4 | equal-parts refusal; the leftover is physically unplaceable |
| books, before | 2 | a picture of the division, chosen from a list |
| books, now | 4–5 | the student generates every b in a continuous range; the "floor empties only at certain lengths" pattern emerges from their own sweep; the ghost shelf constrains |

Not every manipulation must reach 5. Do not build an important learning
experience at 0–2 when a causal one is naturally available.

## 6. Mathematical interaction vocabulary — starting points, not templates

| Mathematics | Natural action | | Mathematics | Natural action |
|---|---|---|---|---|
| partition | distribute | | fraction | cut / recombine |
| grouping (quotition) | gather / **size the group** | | function | input → transform |
| equality, equation | balance | | inequality | move a boundary |
| comparison | align | | geometry | construct |
| ordering | position | | transformation | move / rotate / reflect |
| measurement | measure / stretch | | probability | repeat |
| ratio, proportion | resize / scale | | statistics | classify / filter |
| factorisation | tile | | sequence | extend / predict |
| PGCD | cut | | PPCM | synchronise |
| percentage | fill / resize | | coordinates, vectors | position / move |
| slope | climb / run | | sets, systems | overlap / intersect |

Always check that the metaphor preserves the mathematics. The same division
is a *distribute* (teams: fix the number of groups) **and** a *size the group*
(shelves: fix the group size). The lesson must say which one is in use
(§8).

**Gesture engines available** (engineering, reusable):

- `useDragInteraction`: carry an object and drop it in a zone. It has a
  magnet (only zones that would accept), a visible "will refuse" state, edge
  auto-scroll on phones, tap-tap and keyboard.
- `useStretchInteraction`: stretch a magnitude. It is direct (the handle
  stays under the finger), live during the gesture, commits on release, and
  works as a slider on the keyboard and with −/+ buttons.

A new concept that needs a genuinely different gesture (rotate, cut, balance)
gets a new engine, documented in `MANIPULATION_CONTRACT.md` §4. It should not
be squeezed into one of these two.

## 7. The design sheet — write it before coding

Put it in the component header, next to the contract's five questions.
Filled examples: `divisibility/TeamBuilder.jsx`, `divisibility/DivisorExplorerBooks.jsx`.

```
CONCEPT        what idea is discovered?
OBJECT         what is the learner actually manipulating?
VARIABLE       which quantity does the learner control?
INVARIANT      what stays constant?
TRANSFORMATION what changes when the learner acts?
CONSTRAINT     which rule limits the action?
RESISTANCE     how is impossibility expressed, physically/visually?
EVIDENCE       what observable consequence proves the idea?
CONTRAST       which second case must be met?
PREDICTION     what can the learner anticipate before confirmation?
DISCOVERY      what should they be able to say afterwards?
FORMALIZATION  which notation names the experience?
TRANSFER       where is this reused later?
```

**The bookshelf, filled in.**

| Field | Content |
|---|---|
| Concept | b divides a ⇔ the Euclidean remainder is 0 (quotition reading) |
| Object | a shelf, through its bookend |
| Variable | b = books per shelf (10–60) |
| Invariant | 420 books; all shelves equal; r < b |
| Transformation | q shelves, r books on the floor, live |
| Constraint | a shelf is full or it does not count |
| Resistance | the ghost shelf with b − r dashed empty slots, «ينقصه …» |
| Evidence | the floor empty or not; counters; equation on release |
| Contrast | at least 3 trials, including one exact and one inexact (textbook: 26 vs 28) |
| Prediction | the textbook's 26 and 28 are marks on the ruler: the student places the shelf on them. The marks orient; they are not answer buttons |
| Discovery | «the floor empties exactly when the remainder is 0» |
| Formalization | `a = b × q + r`, then «q is also a divisor: 420 = 28 × 15 = 15 × 28» |
| Transfer | معارف 143 (worked example, `discovery="symmetry"`), then step 2's 120 = 6 × 20 |

## 8. Two readings of one division — never switched silently

| | Partition (teams) | Quotition (shelves) |
|---|---|---|
| The student fixes | the **number** of groups (k teams) | the **size** of a group (b per shelf) |
| What emerges | the size of each group | the number of groups |
| In `a = b × q + r` | b = number of groups | b = size of a group |
| What never changes | **b is what you chose; q is what results; r < b** | same |

Both labs render `primitives/DivisionRoles.jsx` under the equation. It names
b, q and r in the scene's own words. The module then puts the two readings
side by side before the question (`Module01AlMaktaba.jsx`,
`[data-division-bridge]`). When `r = 0`, the two readings meet: b **and** q
both divide a. The shelf lab's formal block shows it with the student's own
exact trial.

## 9. Orientation is not an answer — remove premature answers

The student must know **what** they manipulate, **what** the objects
represent and **what** the goal is. They must not be told **what they will
find**. Audit every screen for:

- The quotient shown as a target before sharing: the badges were `0/5`, and
  now they show the count only.
- The rule readable before discovery: «الشرح» and the registry `shows` line
  are now hidden until discovery.
- The verdict vocabulary («قاسم») in a tooltip or a title before
  formalization.
- A pre-pressed conjecture: `ManipulationDiscovery` now forgets its pick on
  every new scene.
- Question options that carry the evidence («… تبقى 4 كتب»). They now carry
  the choice only, and the student's own trials are listed above the
  question (`[data-activity-evidence]`).
- A knowledge-brick lead that answers the next question.
- Discovery reachable with no hand gesture: `team-builder` auto-completion is
  now `first-gesture`, so one sharing must be done fully by hand.

## 10. Touch, mobile, accessibility — the same mathematics by every path

- **Immediate, direct, stable, forgiving.** The handle stays under the
  finger. A refused or out-of-zone drag returns the object. The magnet never
  pulls toward a zone that would refuse.
- **Tablet and laptop only (owner, 2026-10-15) — phones are NOT supported.** Test at 768, 1024, 1280, 1366 and 1920 (older text about 320–430 px is superseded; ignore it).
- ~~Mobile is first-class.~~ Test at 768, 1366 and 1920
  px. Do not solve mobile by shrinking; reorganise instead. Examples: the
  shelf lab draws every shelf in columns that fit the width (no inner scroll
  box), and the carry engine scrolls the page at the screen edge, so the bench
  and team 1 can be joined by one gesture on a phone.
- **Non-drag parity.** Every gesture has a keyboard and a tap path that
  performs the **same mathematical task**: tap-tap and Enter for carrying;
  slider keys, −/+ and tapping the ruler for stretching. The accessible
  version is never a different exercise.
- **Announce the mathematics.** The representation is `aria-live="polite"`,
  so the equation is announced when a trial is validated, not at every pixel
  of the drag. Zone labels carry their counts («الفريق 1: 3 لاعبين»).

## 11. Feedback states the mathematical consequence

Prefer *"what happened mathematically"* over *"did you win"*:

- «في هذا الفريق 5 لاعبين، وفي أصغر فريق 4 لاعبين. ضع اللاعب في فريق أصغر أولًا.»
- «ما على الأرض لا يملأ رفًّا جديدًا: ينقصه 22 كتابًا.»
- «لو كان عدد اللاعبين 18 أو 15، لما بقي أحد خارج الفرق.»

Arabic counted nouns go through i18next plural keys (`_zero … _other`), so
«15 رفًّا», «4 كتب» and «لاعب واحد» agree. See `ARABIC_RTL_CONTRACT.md`,
"Counting nouns".

## 12. Reuse engineering, never the pedagogical experience

```
REUSE ENGINEERING  ≠  REUSE PEDAGOGICAL EXPERIENCE
```

**Reusable infrastructure:**

- `useManipulation`: phase, hints, levels, reset semantics.
- Both gesture engines.
- `ManipulationShell` and `ManipulationDiscovery`.
- `DivisionRoles` and the drawn-world primitives.
- Pure `logic/` modules and their tests.

**Concept-specific, always:**

- what the hand holds;
- what resists;
- what the drawing proves;
- which contrast opens the discovery.

**The platform must not converge toward a single manipulation style.** If a
new lab looks like another lesson's lab with other colours and objects, stop
and redesign. The football lab is a reference for *causal quality*, not for
"drag players into containers". Do not copy it mechanically into other
lessons. Do not turn every concept into drag-and-drop. Do not use animation
as a substitute for causality: every motion must show a mathematical change.

## 13. Engineering boundaries

- **One source of truth for each rule.** The rule that refuses the hand also
  drives the auto-completion, the refusal message (`rejectDetails`), the
  discovery condition and the tests. A view never recomputes it.
- **Test the logic the component imports.** A test named after a lab must
  exercise that lab's own logic file. Until 2026-09-30, the "420 livres"
  tests covered `logic/divisorExplorer.js`, which the books lab did not use.
- **Sweep, don't sample.** `bookshelf.test.js` draws every b of every range
  at five widths: each book once, no overlap, nothing outside the width.
- **Reset means start over** (`useManipulation.reset`). It restores the
  level's numbers, closes the free lab, clears the type's trial memory
  (`resetCount`) and closes the discovery. Changing numbers (`setNumbers`)
  resets the scene but keeps the memory, because changing 15 → 16 is how the
  contrast is produced.

## 14. The gold standard — ask before calling a manipulation done

1. If all explanatory text were removed, would touching it still teach
   something mathematical?
2. Does the action perform, constrain, transform, construct, compare, measure
   or reveal a relationship?
3. Could it be replaced by a button without losing the experience? If yes, it
   is not causal enough yet.
4. Does it feel like another lesson's lab with different colours? If yes,
   **stop and redesign**.
5. Can the student see the object AND the controls that move it in one
   screen, without scrolling, on a phone as on a laptop? If not, the hand
   moves something it cannot see — **not done** (owner rule, 2026-10-01;
   `MANIPULATION_CONTRACT.md` §8bis).
6. Would an 11–13-year-old (Gen Alpha) WANT to touch it — is it as good as the best app on their phone? If it only
   « works », it is **not done**: push it to the limit (§17, owner rule, 2026-10-14).

## 15. Status

| Item | Status |
|---|---|
| Reference lesson M1 (teams + shelf), M2 (143, symmetry) | **Implemented 2026-09-30** |
| Shared shell fixes: magnet, refused drag, edge scroll, «الشرح» after discovery, stale conjecture, reset semantics, `withLevels: false` | **Implemented**; they reach every shell type |
| Lessons 2–9 redesigned against this DNA, at the owner's request (see below) | **Implemented 2026-09-30** |
| A prediction step before a lab (explicit) | **Implemented** at the متقدم level of lesson 3 only; elsewhere the textbook's own numbers serve as orientation |
| Standalone labs whose second level duplicates another lab (audit, defect k) | **Not yet implemented**, except the معارف 143 worked example (`levels={false}`) |
| Dormant class-mode code (next step, replay, solution) | Untested, never shown to students (unchanged) |
| Unit 2 « الحساب على الجذور »: three new labs designed from this DNA (see below) | **Implemented 2026-09-30** |
| Unit 3 « الحساب الحرفي »: two new labs, one world (the football pitch) for both directions of one reading (see below) | **Implemented 2026-10-01** |
| Unit 4 « معادلات ومتراجحات »: four new labs, four gestures (balance, collapse, boundary, race) on one exact module (see below) | **Implemented 2026-10-01** |
| 1AM unit 2 « الجمع والطرح »: `story-bars` — the hand holds the UNKNOWN (a child's height stretched until the story's sentence is true) or the OPERATION (the textbook's calc cards); the tape closes only when the parts make the whole, so « يزيد » with − and « ينقص » with + are refuted by the drawing (`MANIPULATION_CONTRACT.md` §2sedecies) | **Implemented 2026-10-14** |
| 1AM unit 3 « الضرب والقسمة »: `division-jumps` — b is given, the hand holds q (a ribbon tying bouquets along a row of flowers, or jumps along a line); one group too many lacks objects, one too few leaves enough for another, so the stop « r < b » is felt from both sides (`MANIPULATION_CONTRACT.md` §2septdecies) | **Implemented 2026-10-14** |
| 1AM unit 3 « الضرب والقسمة »: `digit-cards` — the divisibility rule is DISCOVERED, never stated: مبتدئ colours the multiples of 2, 5, 3 in the textbook's 0..48 table (a non-multiple refused with its remainder), متقدم arranges the cards 4, 5, 9, 3 and claims divisibility on closed lamps that a swap re-judges (÷3 never flips, ÷2 does); wrong rules refuted with the student's own cells and swap (`MANIPULATION_CONTRACT.md` §2octodecies) | **Implemented 2026-10-14** |
| 1AM unit 4 « الكتابات الكسرية »: `fraction-knife` — the share is FIXED (its edge never moves), the hand holds the KNIFE, d the number of equal pieces of the whole; the numerator is READ, and exists only when the edge falls on a cut — a straddling piece is the refusal. مبتدئ: grandmother's tray of « قلب اللوز » (3/5 for the neighbours) and Amine's « 4/6 » whose ghost pieces overflow the ribbon; متقدم: the textbook's three rectangles drawn superposed, then 27/45 PREDICTED with pins (9 and 3 divide 45 but straddle) and glued back to 3/5 (`MANIPULATION_CONTRACT.md` §2vicies) | **Implemented 2026-10-14** |
| 2AM unit 2 « الكسور والعمليات عليها »: `egg-trays` — the first lab whose hand holds the DIVIDEND a (eggs swept from a conveyor into trays of b); a tray CLOSES by itself at b, so r < b is physical at every scale, and the trays ruler under the belt is the same line read ÷ b: the marker « a ÷ b » sits at q + r/b, strictly inside a one-unit frame the student PREDICTED before the first egg (judged with the models below / above / remainder / onMark), and ON a graduation only when the last tray closes exactly (2145 then 2160 ÷ 30); the farmer's son's « 2145 = 30 × 70 + 45 » is refuted by the same closing tray (`MANIPULATION_CONTRACT.md` §2unvicies) | **Implemented 2026-10-14** |
| 3AM unit 4, lesson « نشر عبارات جبرية » (2026-10-21): `area-split` — the hand holds a CUT LINE: a knob slides along the edge of a school-garden plot (sides `m·x + n`) to where the side's writing changes term, then DECIDES what each parcel counts as (added; or taken away — the paved path, and the corner removed twice that must be given back); the second world (`arrows`) draws a red arrow from each term of the first factor to each term of the other bracket and decides each partial product's sign. The resistance is an AREA / a VALUE counted independently at x (which the hand also sets): a cut away from a term's edge is refused with the two numeric lengths it makes (« 5 و 7 »), a wrong sign with the counted area and the written sum, a wrong product sign with the two values at x; two meters (the plot's area / the parcels' sum, the expression / the products) never part. مبتدئ `3(x + 4)`, `2(x − 3)` (braces, areas shown, the reduced line writes itself); متقدم `(x + 3)(x + 2)`, `(x − 2)(x − 3)` (two cuts, four parcels, no helps, the student writes each coefficient). Differs from `pitch-expansion` / `turf-factoring` (a length stretched on a football pitch, zones carried into a sum) and `like-terms` (piles carried into trays). Contract §2tricies. | **Implemented 2026-10-21** |
| 1AM unit 4 « الكتابات الكسرية » (2026-10-15): `fair-share` — the hand holds the SHARE of ONE child (the unknown quotient itself) by cutting every cake in n slices then choosing m slices each (two discrete steppers, no slider); the lab paints b shares as coloured slices of the a ROUND cakes (the circle IS the fraction; 2026-10-15 redesign from loaves) and keeps « جرّب أعدادك » (own numbers) always open: the decimal ruler lands for 3 ÷ 4 and never for 2 ÷ 3 / 5 ÷ 6 / 7 ÷ 3, the cut ruler always (m = a) — a/b is the number that times b gives a, decimal only sometimes. Differs from `division-jumps` (holds the number of groups), `fraction-knife` (fixed share, holds the number of pieces) and `egg-trays` (holds the dividend). Contract §2duovicies. |
| 1AM unit 1 « الأعداد الطبيعية والأعداد العشرية » (2026-10-15): `decimal-comma` — the DIGITS are printed and fixed, the hand holds the COMMA (its place in the string of digits = the number of digits after it; a big round handle dragged between the tiles, a tapped gap, ← → on the keyboard); the amount N / 10^p is an OUTPUT drawn in honest blocks (`mosaic`: panel 1, strip 1/10, tile 1/100, shard 1/1000 in a magnifier) and judged against the client's table or a given decimal fraction, or read on rank names in the `machine` world (×10 … ÷1000, ×0,1 …: the same digits slide under the comma, a zero must be ADDED where the digits run out, the comma never passes the last digit). Differs from `rank-exchange` (the hand moves QUANTITIES between ranks; the written digits are an output), `digit-cards` (the digit is the object), `fraction-knife` / `fair-share` (the hand holds a number of pieces / a share). « جرّب أعدادك أنت » always open (free trials never count). Contract §2tervicies. |
| 1AM unit 1, lesson « مقارنة الأعداد العشرية وترتيبها » (2026-10-15): `ruler-compare` — the hand holds the GRADUATION of the ruler (m · dm · cm · mm, a knob on a four-cell tape-measure strip); long jumps are numbers, read at that graduation as a WHOLE number of graduations plus an exact hatched leftover; the verdict `< = >` (or the podium check in `order`) is refused while the ruler cannot separate the numbers and refuted by the readings when wrong. Differs from `decimal-comma` (digits fixed, the hand holds the comma), `rank-exchange` (quantities between ranks), `fraction-knife` (number of equal pieces of one whole). « جرّب أعدادك أنت » always open. Contract §2quatervicies. |
| 1AM unit 11, lesson « مساحة سطح مستو ومحيطه » (2026-10-15): `tile-yard` — the hand holds ONE TILE (a unit area) and carries it: the area is the number of tiles, the perimeter the number of fence sticks round them, two readings that the same gesture moves independently (fence: 12 tiles moved, area fixed; rope: a fixed roll of 12 sticks, free tiles; floor: whole, half and double tiles on a terrace, the number depends on the unit). Resistance is geometric (a corner contact, a split, a hollow, a burst rope). Differs from `square-tiling` (stretches k), `fraction-knife` (pieces of one area), `ruler-compare` (the ruler's graduation). The gardener walks the fence. Contract §2quinvicies. |
| 3AM unit 4, lesson « تبسيط عبارة جبرية وحذف الأقواس » (2026-10-20): `like-terms` — the hand holds a TERM, a pile of wooden pieces drawn to scale in the shape of its literal part (rod x, plate x² whose side IS the rod, unit cube; a negative term in the red « opposite » finish), and carries it into the tray of its shape (`collect`) or out of a « +( ) » / « −( ) » crate onto « كما هي » / « بعكس إشارتها » (`brackets`). The resistance is the VALUE at x, which the hand also sets: a tray of another shape is refused with the two pieces' values (a witness x when x = 1 hides the difference), a wrong exit is refused with the expression's value and the one the table would hold; a piece and its opposite vanish in pairs; the written and table values never part. Exits are judged only on drop (no magnet / hover leak). Differs from `pitch-expansion` / `turf-factoring` (an expression read as an AREA). Contract §2sexvicies. |
| 3AM unit 11, lesson « خاصية فيثاغورس » (2026-10-20): `pythagoras-tanks` — the hand holds the ANGLE at A (مبتدئ) or the LENGTH of the third side on a tape in tenths (متقدم, the angle hidden: the length must be predicted) of a triangle whose sides carry three thin square TANKS; pouring the two small tanks into the big one is the experiment: plain full only at 90°, an overflow (a puddle in cm²) at every acute angle, an empty corner at every obtuse one — so BC² = AB² + AC² and its contrapositive are seen in one gesture; with 2 and 3 no tenth fills and the calculator's √ KEY (only the key: 4AM `jidhr-tarbii` builds the root) sets √13. Differs from `square-root-side` / `square-fold` / `square-tiling` (they build √), `angle-compass` / `ramp-ratios` (ratios). Contract §2septvicies. |
| 2AM unit 3, lesson « مقارنة وترتيب أعداد نسبية » (2026-10-21): `zero-probe` — the hand holds the DISTANCE to zero `d` of a sensor B hanging at the end of a cable that unrolls from the sea surface; the SIDE (فوق / تحت الصفر) is a separate switch and B's relative number an OUTPUT; a sensor A is fixed. Under the zero MORE cable makes B LOWER (the inverse of the naturals' intuition), a forced side can forbid a task (the « لا يوجد طول » button, judged exactly and refused with ONE fitting length when one exists), a zone is one tenth wide. مبتدئ (step 1): −3 lower / higher, 4 lower, 2 impossible; متقدم (step 0,1): −4,5 < B < −4,3, lower than 1,2 on BOTH sides, −0,4 < B < −0,2. Differs from `ruler-compare` (graduation of positive decimals) and `solution-ray` (x on a ray). Contract §2novemvicies. | **Implemented 2026-10-21** |
| 3AM unit 5, lesson « المساويات والعمليات » (2026-10-21): `equality-lanes` — the hand holds the NUMBER c of an operation (+ − × ÷, −9 … 9) and chooses WHO receives it: two runners stand each at the value of one side of an equality with a hidden x; the operation given to both keeps them on the same graduation (the equality is rewritten), given to one only it separates them by c (gap drawn); ÷ 0 is refused, × 0 empties the equality (0 = 0). Differs from `equation-balance` (the contents of a pan). Contract §2untricies. |
| 3AM unit 5, lesson « المعادلات من الدرجة الأولى بمجهول واحد » (2026-10-21): `term-ferry` — the hand carries a term (a crate) across the « = » and CHOOSES its sign on arrival; the resistance is the CALCULATION of both sides at the hidden solution (« كما هو » breaks the equation, shown with the two values), then the hand sets the divisor; « عوّض » substitutes. Differs from `equation-balance` (contents of a pan), `solution-ray` (a probe) and `like-terms` (trays of like terms). Contract §2duotricies. |
| 2AM unit 5, lesson « حساب الرابع المتناسب » (2026-10-21): `fourth-gauges` — the hand holds the number that is MISSING in a 2×2 price board (a QUANTITY can be the unknown): a brass knob on a measuring rod (−/+, field, keyboard); three small brass balances under the board (« في الواحدة » the price of one unit in each column, « بين العمودين » how many times the quantity and the price grew, « الجداءان » the two cross products) tilt under the finger, light a lamp when balanced and are balanced TOGETHER for ONE number only (they always lean the same way). The resistance is the VEIL (متقدم: the balances are covered until the release — the number is computed BEFORE), a 4th balance « الفرق » (`c − a` vs `d − b`) that balances at the WRONG number (404 instead of 600) and, in « جرّب أعدادك », a table whose fourth proportional is not a decimal (10/3: no number of the rod balances). مبتدئ `4 kg → 520 / 6 kg → ?`, `3 kg → 840 / ? kg → 1400`, `8 → 400 / 12 → ?` with the decoy; متقدم covered `2,5 → 325 / 4 → ?`, a hole in `b`, a hole in `a` (step 0,1), `12 m² → 3 L / 18 → ?`. The notebook writes the five paths (coefficient, unit, additive, multiplicative, cross) with HIS numbers — a path whose numbers are not clean decimals is not written. Differs from `linear-machine` (the hand holds the input x), `origin-line`, `ratio-ride` (the hand holds the duration), `percent-tag`, `solution-ray`. Contract §2tertricies. | **Implemented 2026-10-21** |
| 3AM unit 6, lesson « التناسبية والتمثيل البياني » (2026-10-21): `pin-rails` — the hand SLIDES a pin along the rail of its column to its price (a table becomes points) and lays a RULER on two nodes it chooses (O or a pin); the resistance is the ruler's own touch — green nodes, orange gaps, « تقطع المحور عند 10 » when every pin is touched but O is out — and the pin released at the wrong price that falls back with the table's price. Distinct from `origin-line` (4AM: slope held, points imposed) and `ratio-ride` (input x held). |
| 3AM unit 6, lesson « النسبة المئوية » (2026-10-21): `hundred-grid` — the hand PAINTS t cells of a 10 × 10 tray whose stock is cut into 100 equal packets (one cell = x ÷ 100, the coefficient t/100 made visible); an increase ADDS t cells, a decrease REMOVES them; the resistance is the basket that does not open on a wrong written answer (the line says what the grid gave) and the chain +20 % then −20 % whose second change is taken of the NEW stock. Distinct from `percent-tag` (continuous bar, 4AM) — mechanic, representation and variable-per-cell differ. |
| 3AM unit 2, lesson « مقلوب عدد وقسمة كسرين » (2026-10-25): `gear-crank` — the hand TURNS the crank of a bicycle (drag around the axle, full turns accumulate; ‹ سنّ › one tooth): the chain advances tooth by tooth on a chainring of F teeth and a sprocket of R teeth drawn with their REAL numbers, the pedal turns teeth/F and the wheel teeth/R; the flag stands at a number of WHEEL turns to scale, so the student finds the PEDAL turns — the division by the ratio F/R made by the hand (6 wheel turns need 8 pedal turns: a quotient LARGER than the dividend). The resistance is the flag (overshoot / shortfall written in wheel turns, stamp on the flag) and, in متقدم, the locked crank until a fraction is predicted with the counters veiled; swapping chainring and sprocket gives the reciprocal. Distinct from `fair-share` (one child's share), `egg-trays` (grouping of naturals), `fourth-gauges` (a missing cell) and `code-lockers` (code wheels). Contract §2sextricies. |
| 3AM unit 1, lesson « جداء عددين نسبيين » (2026-10-26): `elevator-reel` — the hand holds the SIGNED TIME of a security-camera replay (a knob on a timeline −3 … 3, −/+, keys; in متقدم also the signed speed with a lever « يصعد / ينزل »): a freight elevator passes the ground floor at time 0 and is at floor r × t. Rewinding a DESCENDING elevator (negative time) lifts the cabin ABOVE the street — (−) × (−) = (+) becomes a fact of the world before it is a rule; stacked arrows (solid after, dashed before) show « r + r + … + r »; a wrong stop writes its calculation; متقدم predicts the floor among four cards that each carry a belief (NEGNEG, ADD, SUB) before seeing. Distinct from `zero-probe` (the hand holds a DISTANCE) and `power-train` (the hand holds an EXPONENT). Contract §2septentricies. |
| 3AM unit 1, lesson « جداء عدة أعداد نسبية » (2026-10-26): `robot-track` — the hand holds the SIGN of each card and the ORDER of the cards of a small robot's programme on a graduated floor mat (a gate at 0, a flag at the target): each card multiplies the robot's position, a negative card makes it JUMP over the gate. The side of the final stop follows the NUMBER of negative cards (one or three negative signs reach −24, never two; two negatives give +24, so « any negative ⇒ negative » and « the majority decides » are refuted by the student's own stop), never their order (متقدم a2 replays every order to 20); a card put TWICE (`square` world) never lands on the negative side, and the button « لا يمكن » opens only after a positive and a negative trial. Gesture family: carry + tap-flip + swap (not the scrub of `elevator-reel`, not the wheels of `code-lockers`); world: a robotics-club floor mat. Why not `power-train` (equal factors, the exponent in the hand) nor `rotation-dial` (an angle): see the plan §6. |
| 3AM unit 2, lesson « تساوي كسرين ومقارنتهما » (2026-10-26): `shade-match` — the hand POURS c blue shots into a bucket that has d white (press-and-hold lever, one shot per 0,45 s, « تصريف » takes one back); the bucket's colour is computed from the exact share c/(c+d) so equal ratios are IDENTICAL colours, a needle meter leans by the sign of c × b − a × d (« أفتح » / « أغمق », lamp « تطابق »), each release pins a tick labelled with its c. The resistance is the IMPOSSIBLE case (3/4 over 10 white: 7 is lighter, 8 darker, no integer fits — the cross products compare), the « +4 white so +4 blue » belief refuted by the needle, and in متقدم the VEILED meter (a commitment, or the two written neighbours). مبتدئ `3/4 on 8 → 6`, `2/3 on 9 → 6`, `3/4 on 10 → none`; متقدم `5/6 on 18`, `4/7 on 12 → none`, `9/12 on 8`, then which of 7/9 and 10/13 is darker (numerators refuted). Distinct from `fraction-knife`, `fourth-gauges`, `scoop-scale`. Contract §2octentricies. | **Implemented 2026-10-26** |
| 3AM unit 2, lesson « جمع وطرح كسرين » (2026-10-26): `seed-rake` — the hand STRETCHES a garden rake (spacing 1/N m, N = 2 … 60) over a 1 m bed painted with 1–3 crop zones (1/4 tomatoes, 1/6 peppers…, the last may be a harvest); « ازرع » plants one seedling per cell. A spacing works iff every zone holds a WHOLE number of cells (a common multiple); otherwise a cell straddles a border (wilted plant, nothing counted). The invariant is the planted length (5/12 m for 1/12 and for 1/24) and the gardener's need for room makes the smallest common multiple the widest spacing. متقدم locks the rake: write N and the length first. Distinct from `fraction-knife`, `tile-yard`, `ruler-compare`, `unit-ladder`. Contract §2undequadragies. | **Implemented 2026-10-26** |
| 3AM unit 1, lesson « حاصل قسمة عددين نسبيين » (2026-10-26): `code-lockers` — the hand holds the missing CODE of a combination lock: a SIGN wheel and digit wheels (or, in fraction mode, three signs and two numbers) on a locker of the municipal library whose door carries the rule « (−6) × ? = 48 ». The screen multiplies live, so `a ÷ b = q ⇔ b × q = a` IS the mechanism and the sign of the quotient is what opens the door; a wrong code is refused with its calculation (same distance, wrong sign); متقدم makes the SIGN a prediction (« ثبّت » before the digits unlock); when no decimal code exists three writings (−a/b, a/−b, −(a/b)) open the same door, and `b = 0` in the free panel shows that no code (or every code) fits. Gesture family: ROLL wheels (not the scrub of `elevator-reel`, the carry + flip of `robot-track`, nor the stretch of `seed-rake`); world: a library entrance hall. Why not `division-jumps` (1AM, q as jumps), `egg-trays` (the dividend in the hand), `fourth-gauges` (a proportion cell) nor `term-ferry` (the divisor of an equation's last step): see the plan §6. |

**Lessons 2–9, what the hand now does (2026-09-30).** The instrument is chosen per concept
(§6, §12). Lessons 4, 5 and 7 share the reserve **on purpose**: coprime is the PGCD = 1 case of
common divisors, so the student recognises the instrument.

| Lesson | Gesture (engine) | What resists / what the student decides | Leaks removed |
|---|---|---|---|
| 2 factor-pairs | pull the row's edge; the books re-form into a rectangle in a square frame (stretch) | the incomplete row; past the square every perfect rectangle is a **turned** earlier one (geometric, order-independent) | tiles dimmed past √n, leads printing the bound, the ² inequality that rendered false |
| 3 divisor-properties | carry wall b (carry); at متقدم **predict** before each build | a wrong prediction is refuted by the wall | bidi-scrambled wall labels (now `<bdi>`); the dead proof builder |
| 4 common-divisors | **add a group at a time** from the reserve (carry, `GroupStock`) | leftovers drawn in their colours; « greatest » needs the next k seen failing | the 1…24 numeral rail (a jump to 18); the brick lead that answered step 1 |
| 5 common-divisors | bags (مبتدئ) / **the lists** (متقدم, the lesson's method) | a chip that divides one number only is refused with the number | the advanced level that re-opened lesson 4's bags |
| 6 differences / Euclid | cut the short ribbon out of the long one / lay copies **and try the copy too many** | the PGCD box refuses by divisibility («56 لا يقسم 252»); the extra copy does not fit | the pre-labelled cut («140 \| 112»), the automatic «توقّف», a raw i18n key; the dead `d1`/`e1` gates are real now |
| 7 coprime-explorer | add bags one at a time up to 17 / confront the smaller number's divisors | «only 1» only after 2…17 all failed; lists conclude only with complete evidence, or one common > 1 | the insight after two tries, one-chip completion, the silent «تحقّق», the dead `c1` gate |
| 8 fraction-reduction | carry a number of portions (2…12, **not only the good ones**) | non-common numbers refused with the reason; the student **declares** irreducibility (judged); a non-greatest divisor in one step shows what it would give | only-valid chips, the forced second step, the gold PGCD, the announced «غير قابل للاختزال», the hard-coded «2 vs 1» conjecture |
| 9 InfoSorter | sort the data cards (carry, now `useDragInteraction`) | — | the legacy second drag engine and the `motion.button layout` that broke drags |

**Unit 2, what the hand does (2026-09-30).** Three new instruments, one per concept, all on the
stretch engine but each holding a different variable (`MANIPULATION_CONTRACT.md` §2quater):

| Lesson | Gesture (engine) | What resists / what the student decides |
|---|---|---|
| L1 `square-root-side` refine | stretch the side of a square on a graduated ruler (stretch) | for 5, every graduation gives too small or too big; the ×10 zoom opens only after the student brackets the side by hand — no decimal is ever « equal » |
| L2 `square-root-side` graduation | choose the graduation 1/g, then stretch | a card resists every graduation tried; the student classifies the roots by whether one graduation lands exactly |
| L3 `square-fold` | move x; its arrow lands on the line of squares (stretch) | the negative half is hatched and pinning there is refused; x² = 9 stays open until −3 is pinned too |
| L4 / L5 `square-tiling` | stretch k, the tiles per side of a square of area n (stretch) | k² ∤ n refuses the tiling with n ÷ k² read exactly; L5: only the largest k gives a tile that cannot be tiled again |

**Unit 3, what the hand does (2026-10-01).** One reading — a product of sums is the AREA of a rectangle
whose sides are those sums (the textbook's own figures) — and its two directions, each with its own
gesture (`MANIPULATION_CONTRACT.md` §2quinquies):

| Lesson | Gesture (engine) | What resists / what the student decides |
|---|---|---|
| L1 / L2 `pitch-expansion` | stretch **x** — the LETTER is a length (stretch); carry each zone into the sum and a term onto a like term (carry) | an incomplete sum is too small for the x on screen and the forgotten zones light up with their area; unlike terms refuse to merge; ONE verified value of x opens nothing — the identity needs two |
| L3 / synthesis `turf-factoring` | stretch **r**, the number of identical rows (rows); carry each strip to a side of $x^2$ (square) | pieces that cannot be shared fall off the pitch; the corner refuses a split whose right × bottom is not the number of unit squares; $x^2 + 25$ never closes |

The owner asked to keep, BESIDE the causal gestures, a decorative interaction (the ball, the goals):
it is confined to the drawn world, `aria-hidden`, off the keyboard path and reduced-motion-safe — an
exception recorded in the contract, not a licence to animate mathematics.

**Unit 4, what the hand does (2026-10-01).** Four concepts, four different variables — the platform does not
converge (§12), and the football pitch reappears only where the reading « product = area » carries the argument
(`MANIPULATION_CONTRACT.md` §2sexies):

| Lesson | Gesture (engine) | What resists / what the student decides |
|---|---|---|
| L1 `equation-balance` | carry pieces on and off two pans (carry); stretch k, the equal groups per pan (stretch) | one pan changed alone TIPS the beam by the true hidden x; only the mirror gesture restores it; a piece carried across is refused; bags that cannot be shared refuse the split |
| L2 `vanishing-pitch` | stretch x — the pitch's SIGNED sides are the factors (stretch); pin a solution | the pitch collapses only when a side is 0; a pin elsewhere is refused with the exact area; « no other solution » needs the sweep |
| L3 `solution-ray` | stretch a probe — every validated x leaves a red / grey trace (stretch); place the bracket; choose each new line's direction | the bracket is refused with a witness from the student's own traces; ÷(−3) kept as ≤ contradicts the red traces |
| L4 / synthesis `growth-race` | carry « + x » onto each person / price (carry), then stretch x on a timeline (stretch) | a model that forgets a child (or pays the yearly card every session) is refused in the story's words; the columns meet only at the equation's solution |

The owner asked again to keep, beside the causal gestures, a decorative interaction in each world (ball, phone,
flag, candle, ripples) — same confinement as unit 3.

**Unit 5, what the hand does (2026-10-01).** Three concepts, three different variables — a ثنائية is not weighed
on a balance (`MANIPULATION_CONTRACT.md` §2septies):

| Lesson | Gesture (engine) | What resists / what the student decides |
|---|---|---|
| L1 `pair-scoreboard` | stretch BOTH numbers of the pair, one handle each (stretch); swap the pair; claim « حل للجملة » | two gauges read each equation on the student's own pair; the claim is refused while only one lights (« تحقّق المعادلة (1) فقط »); the swapped pair is a refused trial (order matters) |
| L2 `elimination-cards` | carry an isolated expression onto the OTHER card's tiles (التعويض); stretch ×k on a card, lay one card on the other (الجمع) | the expression on its own card gives « 7 = 7 » and is refused; stacking when nothing cancels is refused with the sum written; ×0 wipes the card; done only with (x ; y) checked in both |
| L3 / synthesis `story-modeller` | carry x, y onto the story's nouns, then the story's numbers into □x + □y = □ (carry); choose the method; carry the values to the story's gates | « تحقّق » refuses a model in the story's words (a price counted as people, swapped quantities, an empty slot is not 1); the story is REPLAYED with the pair — a non-natural count is flagged |

Every one of the three also obeys the new one-screen rule (`MANIPULATION_CONTRACT.md` §8bis, §14 question 5).

**Unit 9 synthesis, a living world (2026-10-13).** `shadow-world` replaces `shadow-stick` in `wadiya-idmajiya-talis` M1 (مبتدئ).
It is the first lab built on §16 below; `shadow-stick` stays in the registry (its tests still run) but no lesson uses it.

## 16. Living worlds — the student writes the law (owner directive, 2026-10-13)

> The owner asked for « the full power » of a manipulation and set two rules: **the documentation is not a ceiling** (a lab may
> go beyond every pattern above when learning needs it — then this file is extended, not the lab shrunk), and **the student
> discovers the concept himself — it is never given**. Reference implementation: `geometry/ShadowWorld.jsx` on
> `logic/shadowWorld.js` (« ساحة الحيّ », Thales by the shadows).

The labs of §1–§15 give the hand ONE variable and ask for a conjecture among options. A living world goes further on five axes.

### 16.1 The hand holds the CAUSE, the world holds many objects

The student does not move one object's parameter: they move the **cause** (the sun), and **every** object of the world obeys the
same law at once (minaret, palm, stick, Farid, the installations). The law is then the only thing that explains everything on
screen. Data from the real world when it exists: the sun is Algiers's real sun on 13 October (12:30 → 16:00, k = 1 ÷ tan(altitude),
rounded to n ÷ 25 so every shadow is an exact number of centimetres; the textbook's 1,6 at 15:00).

### 16.2 Tools that can refuse

The tape measures horizontal distances from an object's foot; pulled up the minaret it **falls back** — the inaccessible height is
the problem, felt, not read. The stick's head enters the minaret's shadow and **its shadow disappears**: the textbook's place
(both shadows end at O) is the exact edge where it reappears — the method is discovered as a physical boundary.

### 16.3 A prediction is a diagnostic instrument

Before the municipality installs an object (3 m lamp post, then 6 m flagpole), the student plants a flag where its shadow will end.
`classify(H, hour, p)` compares the bet with the **models a student can hold** — `right` (k·H), `additive` (H + the stick's
difference), `copy` (the stick's shadow), `equal` (H), `inverse` (H ÷ k) — and the companion answers the model, not the score.
**Evidence that cannot discriminate is flagged:** at 12:30 (k = 1) adding and multiplying give the same shadow, so a right bet there
is `discriminating: false` and the companion asks for another hour instead of praising.

### 16.4 The student authors the law; the world tests it everywhere; the cause refutes it

« قاعدتي »: `الظلّ = الطول [+ | ×] [n]` — no operation is pre-selected, the number is typed. `ruleCheck` applies it **exactly** to
every known object present and the world plants violet flags at the predicted tips, with the gap drawn to each real tip. A rule fit
on the stick alone is refuted by Farid. The flags **stay** when the sun moves: the student watches their own rule come unstuck and
must repair it. The discovery gate (`discoveryReady`): three hours seen, two shadows measured at one hour, one bet, a × rule that fits
everything, **and its repair at another hour**. The conjecture prompt and the refutations are written with **the student's two
rules** (`fittingRules`) and their own numbers; the notebook's ratio column appears only after the formal step.

### 16.5 A companion that asks, never tells

`react(state)` answers the last gesture with a numbered observation then a question; `guide(state)` is the standing question of the
current goal; `help(state, level)` opens three levels of tighter questions (`h_<goal>[variant]_<1..3>`), with variants that follow the
student's situation (`rulePlus` after an additive rule, `rule2Same` before the sun has moved). Wrong final answers are **read**:
`judgeHeight` recognises the shadow taken for the height, the inverted ratio, the subtracted difference, two hours mixed, and the
distance AB. A render test asserts that **no message reachable before the student wrote their rule contains the law**
(`1,6`, `\times`, `× n`).

### 16.5bis The tutor chain — a question the student must ANSWER, not just read (owner directive, 2026-10-13)

§16.5's `react`/`guide`/`help` narrate gestures; they never required an answer. The owner asked for more: مقران must
run a real question → typed/tapped answer → judged feedback → next question loop from zero knowledge to the
formal rule — a tutor, not commentary beside a simulation.

**The checkpoint layer** (`logic/shadowWorld.js`, `judgeTrend` / `judgeFastest` / `judgeRatioSeed` /
`judgePredictReflect` / `judgeRuleReflect`, `CHECKPOINT_ORDER`, `currentCheckpoint`, `answerQuiz`): five fixed
points in the discovery, each with a real two-(or more-)option question JUDGED against the student's own just-
produced numbers — never rhetorical, never answerable by continuing to drag:

| Checkpoint | Opens when | Question | Correct answer comes from |
|---|---|---|---|
| `trend` | a sun move happened | do shadows lengthen or shorten? | the minaret's own shadow before/after (monotone, always decidable) |
| `fastest` | two distinct hours seen | which shadow changed more, in cm? | the taller object always wins in cm, though both tie in **percent** — the seed of k |
| `ratioSeed` | two KNOWN objects measured at one hour | is shadow÷height the same or different for both? | always "same"; the two ratios are computed and compared exactly |
| `predictReflect` | a bet resolved WRONG | which model did you use (additive / copy / equal / inverse)? | `classify`'s own diagnosis of the student's bet; skipped entirely on a right bet |
| `ruleReflect` | a × rule fits everything, once | does the FORM survive the sun moving, or the NUMBER? | always "form" — the number changes, which `rRuleBroken` then shows |

**It blocks, both ends.** `currentGoal` checks `currentCheckpoint` FIRST: while one is open the goal is
`quiz_<id>`, the shell shows mقران's prompt plus its two tap buttons instead of the step's normal content, and
`answerQuiz` itself refuses an id that is not `currentCheckpoint(s)` — a student (or a bug) cannot answer
"fastest" before "trend" even by calling the function directly. A wrong tap gets a rose highlight, an explanation
built from the student's OWN numbers (never a canned line), and the same two buttons stay live for a retry — it
never advances. `goals.observe` / `measure` / `predict` / `rule` are gated on their checkpoint in addition to the
old gesture count, so discovery cannot be reached by gesture volume alone.

**Why a judge, not a judge-then-forget.** Each `judge*` is a pure function of PERSISTENT state (`hoursSeen`,
`notebook`, `predictions`, `rule`), never of `s.last` — a real bug found the hard way: `judgeTrend` first read
`s.last.kind === 'sun'`, so answering it (which sets `last.kind = 'quiz'`) made the question *unjudgeable* on the
very next check, and the tutor silently skipped to the next checkpoint instead of allowing a retry.
`setHour` now also writes a dedicated `lastSunMove` field that a quiz answer does not overwrite.

**Option labels are STATIC — never put a student's own number inside one.** A second real bug: an option label
(`quizOpt_ruleReflect_number`) contained `{{numText}}`, but option buttons are rendered with `k('quizOpt_…')`
with no interpolation object (matching every `ManipulationDiscovery` option elsewhere in the codebase) — the
literal `{{numText}}` showed on the button. The number belongs in the PROMPT (which IS interpolated with the
judge's numbers), never in an option's own label. A render test (`shadowWorld.render.test.jsx`) scans every
`quizOpt_*` string for `{{` and fails if interpolation syntax survived into a static label.

**A dynamic set of options needs a dynamic distractor, from the logic layer, never guessed in the view.**
`predictReflect`'s correct answer is whichever model the student's own bet matched; showing all four possible
models every time would make it guessable by elimination rather than genuine recognition. `judgePredictReflect`
returns `options: [correct, PREDICT_DISTRACTOR[correct]]` — a fixed, deterministic pairing per model, computed in
`logic/`, so the view never invents which two options to show.

**Centimetres vs already-formatted text — one more key-name collision to avoid.** `say()`'s `CM` set lists which
message params are raw centimetres needing `tex()` (metres, LaTeX); a param already formatted by its judge
(`m()`, e.g. `ra`/`rb`/`numText`) must stay OUT of `CM`, and a param meant to display as a plain integer or
percent (`dStick`, `pctMinaret`) must stay out too, even though both look like "just a number" — the Arabic
template, not the key's type, decides the unit. The browser QA (not the unit tests, which only check judge
correctness) is what caught both directions of this mistake: "870 m" (cm shown unconverted) and "0{,}87 سم"
(a percent run through the metre converter). **A number formatting bug is invisible to `renderToString` snapshot
tests and to pure-logic tests alike — only a rendered, read screenshot catches it.**

### 16.5ter The tutor panel — one question at a time, a visible conversation, no dead ends (owner, 2026-10-13)

The first version of the chain put four things in one bubble — a reaction ending in a rhetorical question, the answer
buttons, a small « ماذا بعد؟ » line holding the REAL question, and a help button — so the student saw two questions and
could answer only one, and each gesture replaced the message. The owner asked for an interaction that is « clear, easy,
and makes progress ». `geometry/ShadowTutor.jsx` (pure view; ShadowWorld passes formatted nodes) now has three zones:

1. **Progress** — « أسئلة مقران », one dot per checkpoint from `checkpointStatus(s)`: `done`, `current`, `pending`,
   `skipped` (a right bet has nothing to reflect on, so `predictReflect` is skipped, not owed).
2. **The thread** — مقران's messages AND the student's own answers as bubbles (✓ green / ✗ rose): the tapped option, the
   rule written, the bet, the height answered. Built in ShadowWorld from each judged event (`lab.last`), the student's
   bubble first, then مقران's reaction; two consecutive sun or stick moves (or two messages carrying the same action)
   collapse into one so the thread does not drown. Last 3 messages (2 below 420 px), the rest unfolds.
3. **ONE pinned card** — either « سؤال مقران » (the only question on screen, big options, « سؤال n من N ») or
   « مهمّتك الآن » (one instruction in the world, never a question). A wrong option, once tried, is disabled and
   struck (« جرّبتَ هذا ») under the explanation that just landed in the thread: the student progresses by reading,
   not by guessing. « تلميح » opens the hint levels INSIDE the card (`hq_<quiz>_<1..3>` for a question, `h_<goal>_<1..3>`
   for a task) and they reset only when the card changes, never at each gesture.

**Rules this enforces (tested in `shadowWorld.render.test.jsx`):** a reaction (`r*`, except the challenge's `rAns_*`)
and a task (`g_*`) contain no « ؟ » — مقران asks only where a button or a field can answer; every checkpoint has its
prompt, its right/wrong feedback, its option labels and its three hints; no `quizOpt_*` contains `{{`.

**No dead end with the stick.** The stick used to start 3 m from the minaret, inside its shadow, and its handle was
hidden in measure mode — so the student's first « قِس ظلّ العصا » failed and مقران's « أبعِد العصا » could not be obeyed.
Now: the stick starts in the sun (`STICK_MAX`, measurable at every hour for both levels — tested); its handle stays
draggable in measure mode (above the tape zone, lifted above a 16 px stick on phones, pulsing while its shadow is
swallowed); and a reaction may carry an `action` — `rStickHidden` / `rMeasureHidden` carry `freeStick`, rendered as a
button under the last message that moves the stick just beyond O (`stickOutOfShadow`, never the textbook's edge, so
escaping the shadow does not hand over the method). **General rule: any instruction a companion gives must be
executable from where the student is, in one gesture or one button.**

### 16.6 Engineering rules for a world

- The companion's brain is **pure logic** (`react` / `guide` / `help` / `classify` / `judgeHeight` in `logic/`), tested like the
  mathematics; the view only formats messages (`say`: cm → `tex`, ids → names).
- Exact integers (cm) decide every verdict; floats only draw. Sweep the layout at every width (`layout`, `hourFromPoint` round trip,
  the sun collinear with (O, M) at every hour).
- Several gestures, one world: local pointer grabs (`grab(kind)`) with capture, plus a keyboard and a button path for each (sun
  slider and −/+, stick slider, flag slider, « قِس ظلّ … » buttons for the tape). Not yet extracted into a shared engine.
- Every gesture reports through `state.report` (`onTrial` evidence: measure / predict / rule / meet / answer).
- One-screen (§14 q. 5): the scene is budgeted on the lesson viewport minus what surrounds it in `[data-sw-glance]`
  (240 → 640 px; the true-scale world needs ≈ 590 px at full desktop width); the companion is beside the scene from `lg`,
  above it below `lg`, and is not subtracted from the budget.
- **Trap — a measured block inside a grid must be `self-start`.** The glance block spans two grid rows beside the
  companion; grid items stretch by default, so when مقران's thread grew the block was stretched to the companion's
  height, the « what surrounds the drawing » measure exploded and the world fell to its minimum height (owner QA,
  2026-10-13: a 230 px world on a 926 px screen). Any lab that budgets its scene from a measured wrapper next to a
  growing column must align that wrapper to its own content.
- **One action panel at a time.** Under the scene: the measure buttons only in measure mode, the bet only at its step
  (or while a flag is placed — the optional second installation waits in a chip), the rule from the bet on, the
  challenge after the formal step. Every stacked panel is height taken from the world.

| Item | Status |
|---|---|
| `shadow-world` in `wadiya-idmajiya-talis` M1 (مبتدئ); 45 logic tests + 8 render tests; Playwright journey at 1366 and 390 px | **Implemented 2026-10-13** |
| The tutor chain (§16.5bis): 5 blocking checkpoints, tapped answers, judged feedback, retry-until-correct | **Implemented 2026-10-13** |
| The tutor panel (§16.5ter): progress, conversation thread, one pinned question/task card, in-card hints, the stick never a dead end | **Implemented 2026-10-13** |
| The pattern on other units (a world + diagnostic bets + an authored rule + a questioning companion) | **Not yet implemented** |
| A shared multi-gesture engine (pivot, tape) extracted from `ShadowWorld` | **Not yet implemented** |
| Phone scale: the 22 m world is drawn at ≈ 16 px/m at 390 px (readable, small) | known limit |

## 17. The Gen Alpha quality bar — always push the UI/UX to the limit (owner rule, 2026-10-14, binding on every generation)

Owner: « always use your limit for the UI/UX of the manipulations for the Gen Alpha 11–13 years old ». Our students grew up on
polished games and apps; a lab that merely works reads as « school software » and loses them. Every NEW or REDESIGNED manipulation is
built to the highest finish the agent can produce — never the first version that passes the tests. The bar, all of it, every time:

1. **A drawn world, rich and alive.** A real scene in inline SVG (a stall, a track, a padlock, a ruler on a wall), with depth (soft
   shadows, raised edges, gradients on light surfaces), characters and objects drawn with care — never bare rectangles, circles or
   emoji. People are always `KidFigure` (girls in hijab; guide §6 « People are the platform's CHARACTERS »). Reference: the three 1AM
   labs of 2026-10-14 (`story-bars`, `division-jumps`, `digit-cards`).
2. **The shared visual language.** Compose `primitives/LabKit.jsx` + `SvgPill.jsx` (`MANIPULATION_CONTRACT.md` §8ter): question chip,
   the big sentence with its lamp, big tactile answer cards, a control card with a BIG readout and round −/+, value and name pills,
   a verdict banner that never makes the stage jump. Extend the kit (with tests) rather than writing a look-alike.
3. **The gesture feels physical.** Grab handles ≥ 44 px that lift under the finger, cards that press down, a « stamp » when right, a
   gentle shake when refused, a character that reacts (`mood`), a hop, a tie, a glow — each micro-animation SERVES the mathematics
   and stops under `prefers-reduced-motion`.
4. **Feedback is immediate, visual and in the student's own numbers** — a pill, a ghost, a remainder circled, a bulb that lights — and
   NEVER states the rule to discover (« discover, don't be told »; §16).
5. **One screen at the tablet and laptop sizes (phones are not supported, 2026-10-15).** 1024×768, 1280×800, 1366×768, 1920×1080 (the old 390×844 / 320×640 are retired), both levels: the glance fits, no overflow, controls
   inside the stage on narrow widths, type large and bold (the sentence ≥ 18 px, numbers big), contrast high, Arabic DOM text,
   numbers in LTR islands.
6. **Honest drawing.** The picture IS the argument: sizes to scale, a child's crown on its height, counts exact — beauty never bends
   the mathematics.
7. **Say it ONCE — Gen Alpha does not read walls of text** (owner, 2026-10-14). Each thing is written in ONE place on the lab:
   the QUESTION (the `PromptCard` chip + sentence — a kit lab then passes NO shell `mission`), the GESTURE (one line: the idle
   `VerdictBanner` / `LabNote` — not again under the stepper, not as hint 1, not in the lesson's `lead`), the STORY mapping (the
   lesson's `lead`, one short line: « كل قفزة = عقد من 17 لؤلؤة. »). Hints are CLOSED by default (`useManipulation › hintsOpen =
   false`, platform-wide) and each is one short THINKING question — never the gesture again, never the strategy (« اقترب دون أن
   تتجاوز » is the rule). Before calling a lab done, read every visible string top to bottom: a number, a verb or an instruction that
   appears twice is cut. Reference: `division-jumps` (2026-10-14: 7 text blocks → 4; `divisionJumps.render.test.jsx` « says each
   thing ONCE »).
8. **Reviewed with the eyes, not only the tests.** Before calling it done, the agent takes screenshots of the initial state AND
   mid-activity states (a refusal, a success, the formal phase) at the four sizes, LOOKS at every one, and iterates until it would be
   proud to show it to the owner. Tests and e2e green are necessary, never sufficient.

9. **Context, then ONE direct question — no title** (owner, 2026-10-14, binding on every lab, retrofitted on the earlier ones). The top
   of a lab has exactly two things, in this order: (a) the CONTEXT in one or two plain sentences that give every number the student
   needs (« في الورشة 13 صندوقًا، في كل صندوق 10 علب… »), then (b) ONE direct question or instruction that names the GOAL and the END
   STATE, so the student starts moving at once and knows where to stop (« اربط الأقلام حتى تستطيع كتابة عدد الأقلام. »,
   « اقطع الحلوى حتى تقع حافة الحصّة على قطع. »). There is NO title above them — no « اسم المختبر: سؤال؟ » banner, no chip that only
   names the lab, no riddle. The question is a verb the hand can do, never « ما هو… ؟ » about a concept; it never states the rule to
   discover (§17.4) and says nothing the context already said (§17.7). Test before « done »: cover the lab with a hand, read only the top —
   can a 12-year-old start dragging and tell when she has finished? If not, rewrite it.
   **No ambiguity anywhere on the stage (same absolute rule).** Every thing the student can see or touch says what it is FOR: a
   row of cards, numbers, pills or buttons never appears bare — it sits under its own question or label that tells what to do
   with it (« توقّع قبل أن تربط: كم قلمًا في الورشة؟ » above the three prediction cards, not three naked numbers « 1 132 437 · 2 577
   · 75 »). Each control's purpose, each number's meaning (what it counts, in which unit) and each step's end are explicit; if a
   student could ask « ماذا أفعل بهذا؟ », the lab is not done. Reference: `rank-exchange`, `fraction-knife`,
   `egg-trays` after the 2026-10-14 retrofit (with `story-bars`, `division-jumps`, `digit-cards`: kit `PromptCard › context`, shell
   `titleHidden`, render tests « opens on its CONTEXT then ONE question »).

10. **Nothing above the lab** (owner, 2026-10-14). In a module, the lab IS the start: no textbook card, no list of questions, no
   workspace `title` / `lead` above it — they would be a second, competing start. The module's questions come AFTER the lab and
   ask about what the student did in it (`LESSON_DEVELOPMENT_GUIDE.md` §4quater). And the lab's situation is chosen by the
   platform, not copied from the book: the textbook fixes the الكفاءة, the lab is the best situation in which the hand makes it
   necessary (guide §4ter).

11. **Onboarding — « what do I do now? » must never be a question — MANDATORY for EVERY manipulation** (owner, 2026-10-14: « one of
   the best features »; validated on `rank-exchange`). Every lab — new, redesigned or already shipped, in every lesson of every grade —
   shows, at each moment, the button or gesture the hand needs NOW with `LabCoach` (MANIPULATION_CONTRACT §8quater): a pulsing ring
   and a ONE-sentence bubble placed on the element, never over it, shown once, hidable (« فهمت » / « إيقاف الإرشاد » / Esc) and
   re-summonable by the always-visible switch under the question. It shows the CONTROL, never the rule. Identical design details in
   every lab (same component, same strings structure, same gates): a lab without it is not done, like a lab without its screenshots.

A generation report states, for each lab, the screenshots reviewed and what was improved after looking at them.
