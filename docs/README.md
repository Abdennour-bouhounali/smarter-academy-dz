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
| The student notebook (كرّاسي) | [`architecture/NOTEBOOK.md`](./architecture/NOTEBOOK.md) |
| The Math Lab (مختبر الرياضيات): tool contract & registry, document model & API, whiteboard V1, function grapher V1 (expression subset, sampling, viewport, tangent/derivative mode), 3D geometry explorer V1 (solids, dimensions, volume/area, three.js scene), probability & statistics lab V1 (experiments, simulation engine, law of large numbers, dataset summary, SVG charts, the physical dice/coin table on three.js and its result → orientation contract), lesson-integration point | [`architecture/MATH_LAB.md`](./architecture/MATH_LAB.md) |
| Admin panel | [`architecture/ADMIN_PANEL_ARCHITECTURE.md`](./architecture/ADMIN_PANEL_ARCHITECTURE.md) (the Annexe wins where it conflicts with the body) |
| Product scope, access model, Algerian terminology policy | [`ALGERIA_PLATFORM_MASTER_SPEC.md`](./ALGERIA_PLATFORM_MASTER_SPEC.md) |
| 4AM curriculum inventory and terminology register | [`ALGERIA_4AM_CURRICULUM.md`](./ALGERIA_4AM_CURRICULUM.md) |

## Reference material

- [`sources/4am/unit1/extraction.json`](./sources/4am/unit1/) — the textbook
  extraction every unit-1 content element cites. The PDF itself
  (`official-book-pdfs/`) is copyrighted and untracked.
- [`architecture/CURRICULUM_MATRIX_5E_4E.md`](./architecture/CURRICULUM_MATRIX_5E_4E.md) — generated, regenerable.
- `data-verification/` — curriculum-scope reference data.
- `deployment/` — deployment procedures.

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
student-facing surface is Arabic — see
[`architecture/ARABIC_RTL_CONTRACT.md`](./architecture/ARABIC_RTL_CONTRACT.md).
