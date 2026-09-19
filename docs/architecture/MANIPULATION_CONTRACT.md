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
├── ManipulationProgress.jsx    جرّب › اكتشف › صِغ  +  الخطوة n من N
├── ManipulationControls.jsx    student: إعادة · تلميح · تحقّق · الشرح
├── ManipulationTeacherMode.jsx class mode: step, replay, hide answer, show solution, change numbers
├── ManipulationHint.jsx        progressive hints (never the answer)
├── ManipulationDiscovery.jsx   conjecture → formal rule (never before the action)
├── ManipulationLevels.jsx      4 levels + مختبر حر (constrained)
├── useManipulation.js          numbers · phase · hints · level · mode · epoch
├── useStepSequence.js          bounded step cursor
├── useDragInteraction.js       pointer drag + magnet + reject + keyboard alternative
├── levels.js                   the 4 levels per type, each citing a textbook element
├── logic/                      PURE interaction logic per type (unit-tested, no React)
├── primitives/                 shared building blocks, never duplicated by a type
└── divisibility/               the 9 types of unit 1
```

`divisibility/DivisorExplorerBooks.jsx` (`divisor-explorer-books`, Module 1 of
`qasim-adad-tabii`) is the one **standalone** type: it ships its own styles and
its own HTML5 drag, and does not go through `ManipulationShell`. It was adopted
as delivered, complete visual game included; its contract with the module is
only `onVerdict({ b, divides, quotient, remainder })`.

**Rule:** a type composes primitives and calls `logic/`. It never re-implements a gesture, a
tile, a drop zone, or a piece of mathematics.

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

**The toggle is never shown to a student.** `allowModeSwitch` defaults to `false` in
`ManipulationShell` and in all eight types, so a lesson module renders وضع التلميذ only
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
the discovery, and its inputs are bounded.

## 8. Arabic, RTL, mobile, motion

Interface RTL in Cairo; every numeric block (`dir="ltr"`): tiles, bars, equations, divisions,
chains. `PGCD` stays Latin, as in the textbook. Touch targets ≥ 44 px. Layout works from 320 px:
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

- `logic/logic.test.js` — mathematics, allowed/refused actions, discovery conditions, final states,
  on the textbook numbers (420/26/28, 60, 105, 18-12-3, 90/54, 42/60, 252/140, 765/135, 1938/836,
  17/18, 27/36, 84/48, 595/560).
- `apps/web/e2e/lesson-kit/manipulations.mjs` — real pointer drags, the tap alternative, keyboard,
  reset, hints, teacher mode, levels, mobile at 320 px, reduced motion, and the invariant that the
  answer never appears before the discovery.
