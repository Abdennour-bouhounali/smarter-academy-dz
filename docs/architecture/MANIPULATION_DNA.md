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
- **Mobile is first-class.** Test at 320, 360, 390, 430, 768, 1366 and 1920
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

