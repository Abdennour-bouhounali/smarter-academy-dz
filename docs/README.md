# Documentation map — Smarter Academy DZ

> **The code is the source of truth. This documentation describes what is
> implemented today.** Where something is planned but not built, it says
> `Planned` or `Not yet implemented`. If you find a document that contradicts
> the code, the code wins — and fixing the document is part of the task that
> found it (root `CLAUDE.md`, Documentation Synchronization Rule).

The platform is Arabic-first (ar-DZ, RTL) and follows the Algerian curriculum.
The live content is the 4AM textbook unit 1 under
`apps/web/src/lessons/moyen/4am/`. The French-era lessons under
`lessons/college/` and `lessons/lycee/` are **dormant**: present on disk, not
indexed by the registry, not mounted, not reachable.

## Start here

| If you are about to… | Read |
|---|---|
| Create or modify a lesson, module, manipulation or exercise | **[`lessons/LESSON_DEVELOPMENT_GUIDE.md`](./lessons/LESSON_DEVELOPMENT_GUIDE.md)** — the single entry point |
| Understand the whole system | [`architecture/ARCHITECTURE.md`](./architecture/ARCHITECTURE.md) |
| Work on Classroom Mode (وضع القسم) | [`architecture/CLASSROOM_MODE.md`](./architecture/CLASSROOM_MODE.md) |
| Work on a manipulation | [`architecture/MANIPULATION_CONTRACT.md`](./architecture/MANIPULATION_CONTRACT.md) |
| Work on exercises or the practice engine | [`architecture/EXERCISE_CONTRACT.md`](./architecture/EXERCISE_CONTRACT.md) |
| Write Arabic UI or lesson text | [`architecture/ARABIC_RTL_CONTRACT.md`](./architecture/ARABIC_RTL_CONTRACT.md) |
| Work on the Math Lab (مختبر الرياضيات) or add an instrument to it | [`architecture/MATH_LAB.md`](./architecture/MATH_LAB.md) |
| Work on teachers — how a teacher reads lessons (free navigation, no progress), classes (الأقسام), seat-based plans and pricing tiers, subscriptions, requests or plan-bound activation codes | [`architecture/TEACHER_CLASSROOM_ARCHITECTURE.md`](./architecture/TEACHER_CLASSROOM_ARCHITECTURE.md) |
| Build or change an admin screen (Arabic, RTL, shared design system) | [`architecture/ADMIN_PANEL_ARCHITECTURE.md`](./architecture/ADMIN_PANEL_ARCHITECTURE.md) §33.0 |
| Regenerate or extend the recette/demo dataset (`DemoDataSeeder`) | [`architecture/DEMO_DATASET.md`](./architecture/DEMO_DATASET.md) |

## Authoritative documents (one owner per contract)

Each row names the **one** document that decides its subject. Other documents
may describe it, but they defer to this one.

| Subject | Authoritative document |
|---|---|
| Curriculum hierarchy (المجال → الوحدة → الدرس → نقاط التعلّم), lesson & module contract, stages, unlock rules, non-blocking progression | [`architecture/LESSON_CONTRACT.md`](./architecture/LESSON_CONTRACT.md) |
| How a lesson is wired end to end (files, routes, registry, storage) | [`architecture/LESSON_INTEGRATION_GUIDE.md`](./architecture/LESSON_INTEGRATION_GUIDE.md) |
| How a lesson should teach (interaction & manipulation pedagogy) | [`architecture/INTERACTION_PEDAGOGY.md`](./architecture/INTERACTION_PEDAGOGY.md) |
| How a lesson is designed and built, end to end, by a human or an agent | [`architecture/LESSON_DESIGN_PLAYBOOK.md`](./architecture/LESSON_DESIGN_PLAYBOOK.md) |
| Manipulations (tactile laboratories) | [`architecture/MANIPULATION_CONTRACT.md`](./architecture/MANIPULATION_CONTRACT.md) |
| Classroom Mode / presentation layer | [`architecture/CLASSROOM_MODE.md`](./architecture/CLASSROOM_MODE.md) |
| Arabic, RTL, typography, terminology, bidi rules | [`architecture/ARABIC_RTL_CONTRACT.md`](./architecture/ARABIC_RTL_CONTRACT.md) |
| Exercise validation boundary, answer shapes, practice engine | [`architecture/EXERCISE_CONTRACT.md`](./architecture/EXERCISE_CONTRACT.md) |
| Question metadata, evidence, assessment rules for generated lessons | [`architecture/AI_LESSON_CONTRACT.md`](./architecture/AI_LESSON_CONTRACT.md) |
| Knowledge before demand (`priorKnowledge`, `KnowledgeBrick`, `requires`) | [`architecture/KNOWLEDGE_DEPENDENCY.md`](./architecture/KNOWLEDGE_DEPENDENCY.md) |
| The cumulative Knowledge Map and `knowledge.jsx` | [`architecture/KNOWLEDGE_MAP.md`](./architecture/KNOWLEDGE_MAP.md) |
| Completion vs mastery, progress storage and sync | [`architecture/PROGRESS_MODEL.md`](./architecture/PROGRESS_MODEL.md) |
| Curriculum sync, evidence flow, mastery model | [`architecture/LEARNING_ARCHITECTURE.md`](./architecture/LEARNING_ARCHITECTURE.md) |
| The student notebook (كرّاسي) — including the teacher's **read-only** access to the notebook of a student in their قسم (since 2026-09-24) | [`architecture/NOTEBOOK.md`](./architecture/NOTEBOOK.md) |
| The Math Lab (مختبر الرياضيات): tool contract & registry, document model & API, whiteboard V1, function grapher V1 (expression subset, sampling, viewport, tangent/derivative mode), 3D geometry explorer V1 (solids, dimensions, volume/area, three.js scene), probability & statistics lab V1 (experiments, simulation engine, law of large numbers, dataset summary, SVG charts, the physical dice/coin table on three.js and its result → orientation contract), algebra & equation lab V1 (exact rationals, linear normal form, equations *and* inequalities with the sign flip, balance, number line, step history with undo/redo), vectors & coordinate geometry lab V1 (الأشعة: the grapher's repère reused, dependency-resolved scene, tip-to-tail and parallelogram, scalar slider, انسحاب of a point and of a shape, exact norms, relative-tolerance relations), trigonometry & unit circle lab V1 (مختبر المثلثات: the right triangle of the 4AM programme first, the unit circle one click away, exact values for the remarkable angles, the honestly undefined tangent, the wave born from the rotation, predict → reveal practice), sequences & recurrences lab V1 (مختبر المتتاليات: the arithmetic sequence and its «الفروق المتتالية» first — sequences are *not* in the 4AM programme — the cobweb diagram, fixed points and convergence one toggle away, the grapher's parser and camera reused rather than rebuilt, numerical observation never dressed as proof), transformations & dynamic geometry lab V1 (مختبر التحويلات: an affine engine where a transformation is a matrix and composition a product, the انسحاب of the 4AM programme first with التحاكي and the composition stack one click away, centres and axes that follow the figure's own vertices, invariants MEASURED on the student's figure rather than recited, order reordering as the experiment itself, animations that interpolate the transformation and not the matrix, predict → transform → verify practice that never blocks, and puzzles judged by superposition), conic sections & analytic geometry lab V1 (مختبر المقاطع المخروطية: the circle of the 4AM programme first with the parabola, ellipse and hyperbola one click away, a canonical model where a conic is five numbers and never its points, a safe recursive-descent equation parser that completes the square exactly and never executes the student's input, intersections solved by discriminant so that 0/1/2 is a mathematical fact, the equation shown live beside the sliders *and* editable in the inspector so both directions of the link are visible, focal properties MEASURED on the student's own point, predict → reveal → verify practice that never blocks), number & arithmetic lab V1 (مختبر الأعداد والحساب: thirteen modes in one laboratory — explorer, place value with animated regrouping, number line, fractions, decimals, percentages, proportionality, divisibility, primes, factors, PGCD/PPCM, rounding, operations — an exact integer engine where a fraction is never reduced behind the student's back, « one value many representations » guaranteed by storing a single fraction and deriving every writing, divisibility that shows its REASON, Euclid whose squares are linked line-by-line to the divisions and zoomable down to the last one, a practice engine that never blocks and explains errors by drawing), the symbolic engine (Nerdamer behind a facade: nothing imports it directly, it is loaded lazily, guarded against the calls that never return, and — measured wrong 5 times out of 22 on limits at infinity — its answers are confronted with the function's real behaviour before being shown, so a student sees a right answer or none), analysis & calculus lab V1 (مختبر التحليل والدوال: the average rate of change of the 4AM affine function first — the only authentic 4AM anchor of differential calculus — with the tangent, the derivative, limits, integrals, function study and transformations one click away; a symbolic derivative written as one AST → AST pass over the grapher's own tree, with no computer-algebra dependency, cross-validated against the grapher's numerical derivative and falling back to it honestly when a rule is missing; a live readout that keeps the numbers visible while the student manipulates, because reading and setting live in different tabs; exact vs approximate never conflated — `= 4` for a rule, `≈ 4` for a measurement; limits read from two side-by-side approach tables and never claimed as proofs; a signed integral drawn apart from the geometric area; Riemann rectangles returned as objects because the drawing is the lesson; and five numerical defects found only by verification — the pole taken for a root, the vanishing stationary point, the removable hole a grid steps over, the oblique asymptote lost to catastrophic cancellation, and noise displayed as an asymptote), logic & proof lab V1 (مختبر المنطق والبرهان: ten areas in one laboratory that opens on an EXPERIMENT rather than a menu — « can you prove this statement false? » — where truth is a region of the number line you slide x along, a counterexample is something you hunt for and the lab explains why one sufficed, an implication's four forms are read column against column so the contrapositive's agreement and the converse's disagreement are seen rather than asserted, a proof is a DEPENDENCY GRAPH (several valid orders, a refusal that names what is missing instead of saying « wrong »), and — the rule the whole instrument serves — a search that finds no counterexample is reported as an observation and never as a proof; plus « قاموس الرموز », which says how each Latin symbol is READ in Arabic, since the interface is Arabic but the notation is not), measurement & rule-discovery lab V1 (مختبر القياس: ten OPEN investigations where the student is never given the formula — they pull an object about, count the unit grid, fill an observation table and only then BUILD a rule from tokens and put it on trial; a declarative investigation catalogue so an eleventh is one entry and not a screen; a rule engine that answers a wrong rule with a COUNTEREXAMPLE — « your rule gives 11 where I measured 28 » — and never with a verdict, comparing two writings of one relation by value so `2 × (L + l)` and `L + l + L + l` are recognised as the same; an evidence gate that refuses to conclude on three measurements of the same square or without a trial on an object the student did not choose, so guessing does not pay; « it held on what you measured » never dressed as a proof, with the geometric explanation — two triangles making the rectangle, the disc cut into sectors, the squares of Pythagoras — arriving only once the evidence is in; and scenes drawn entirely in SVG, the unrolled thread that makes π visible and the cuboid's three countable faces), the personal workspace « أعمالي » (search, filters, sorting, grid/list, multi-selection and bulk actions, favourites, rename and duplicate — and previews drawn in SVG from each tool's own `summarize(data)`, so a card never mounts an instrument), the Lab opened **over** a lesson (« 🧪 المختبر »: a layer above the router so the lesson is never unmounted, the tool picker, and a fullscreen open to students *and* teachers — distinct from وضع القسم), the column writing of a شعاع, lesson-integration point | [`architecture/MATH_LAB.md`](./architecture/MATH_LAB.md) |
| Admin panel | [`architecture/ADMIN_PANEL_ARCHITECTURE.md`](./architecture/ADMIN_PANEL_ARCHITECTURE.md) (the Annexe wins where it conflicts with the body) |
| Teacher role, classes (الأقسام), membership & invitations, per-class lesson visibility, study context, the DZ commercial model (no online payment; teacher plans sold by student seats, classes unlimited), plans / versions / pricing tiers / entitlements, subscription requests, manual activation, plan-bound activation codes with seat capacity, admin commercial controls | [`architecture/TEACHER_CLASSROOM_ARCHITECTURE.md`](./architecture/TEACHER_CLASSROOM_ARCHITECTURE.md) |
| Product scope, access model, Algerian terminology policy | [`ALGERIA_PLATFORM_MASTER_SPEC.md`](./ALGERIA_PLATFORM_MASTER_SPEC.md) |
| 4AM curriculum inventory and terminology register | [`ALGERIA_4AM_CURRICULUM.md`](./ALGERIA_4AM_CURRICULUM.md) |

## Reference material

- [`sources/4am/unit1/extraction.json`](./sources/4am/unit1/) — the textbook
  extraction every unit-1 content element cites. The PDF itself
  (`official-book-pdfs/`) is copyrighted and untracked.
- [`architecture/CURRICULUM_MATRIX_5E_4E.md`](./architecture/CURRICULUM_MATRIX_5E_4E.md) — generated, regenerable.
- `data-verification/` — curriculum-scope reference data.
- `deployment/` — deployment procedures.
- [`reports/PREEXISTING_ISSUES_2026-09-23.md`](./reports/PREEXISTING_ISSUES_2026-09-23.md)
  — **open issues, not history.** Things found while building the analysis lab
  that it did not cause: a flaky grapher QA check (the feature itself works), an
  unreproduced sequences assertion, pre-existing npm advisories, and two
  upstream Nerdamer defects whose workarounds are load-bearing. Read it before
  upgrading `nerdamer`.

## Historical — do not treat as current

These are point-in-time records. They explain **why** things are the way they
are; they do not describe today's behaviour and must not be used as a
contract.

| Document | Status |
|---|---|
| [`architecture/CLAUDE.md`](./architecture/CLAUDE.md) | **Product & pedagogy philosophy only.** Its technology sections are wrong: it prescribes TypeScript, NestJS, Prisma, PostgreSQL, Zustand and TanStack Query; the real stack is JavaScript, React 18 + Vite, Laravel + MySQL, React Context and a fetch client. It also predates the Algerian platform and describes a French product. |
| `ALGERIA_*_REPORT.md`, `ALGERIA_MIGRATION_AUDIT.md`, `ALGERIA_IMPLEMENTATION_ROADMAP.md` | Phase records. `ALGERIA_PHASE8_UNIT1_TEXTBOOK_REPORT.md` is the most useful: it records how unit 1 was built. |
| `reports/` | Point-in-time audits. Several predate the Algerian takeover and describe the French product or a two-table backend. Cross-check every number against the code. |
| `architecture/EXERCISE_ENGINE_INTEGRATION_AUDIT.md` | Superseded by `EXERCISE_ENGINE_REFERENCE_IMPLEMENTATION.md`. |
| `architecture/EXERCISE_ENGINE_ARCHITECTURE.md` | Target design. Largely implemented, but some paths in it are illustrative, not real. |
| `architecture/DIAGNOSTIC_6E.md`, `KNOWLEDGE_MAP_MIGRATION_2NDE.md`, `KNOWLEDGE_MAP_REFONTE_6E.md`, `CURRICULUM_MATRIX_5E_4E.md` | Scoped to dormant French grades. |
| `lessons/*_SPEC.md` (French lesson specs) | Specifications of dormant French lessons. Useful as pedagogical examples only. |
| `experiments/JSXGRAPH_PILOT.md` | Concluded: rejected, removed from the codebase. |

## Language of the documentation

Documents and code comments are written in English and French; this is the
repository's authoring convention. It has no bearing on the **product**, whose
every user-facing surface — student, teacher and admin alike — is Arabic. See
[`architecture/ARABIC_RTL_CONTRACT.md`](./architecture/ARABIC_RTL_CONTRACT.md).
