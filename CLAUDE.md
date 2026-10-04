# smarter-academy-dz

Arabic-first, RTL mathematics platform for the Algerian curriculum (المتوسط,
starting with 4AM). Lesson content lives in `apps/web/src/lessons/moyen/`;
shared engine in `apps/web/src/lessons/common/`; pure logic in `packages/core`;
API in `apps/api` (Laravel). The lesson content in the repository is ten 4AM
textbook units. Since 2026-10-04 unit 10 « حساب المثلثات في المثلث القائم » (4 lessons + its synthesis,
`lessons/moyen/4am/handasa/hisab-muthallathat/`) is the second unit under « ميدان الهندسة » (exact trigonometry with
surds in `packages/core/arithmetic/trigonometry.js`; authors' brief and lock in `docs/sources/4am/unit10/`). Since 2026-10-02 unit 9 « خاصية طالس » (3 lessons + its synthesis,
`lessons/moyen/4am/handasa/khassiyat-talis/`) is the first unit under the programme's « ميدان الهندسة »
(no `placement`; geometry figures are `GeoFigure` data, Thales maths in `packages/core/arithmetic/thales.js`). Since 2026-10-02 unit 6 « الدالة الخطية والتناسبية » (5 lessons + its synthesis,
`lessons/moyen/4am/tanasubiya_duwal/tanasubiya-dala-khattiya/`) and unit 7 « الدالة التآلفية » (5 lessons + its synthesis,
`…/tanasubiya_duwal/dala-taalufiya/`, the same day) and unit 8 « الإحصاء » (4 lessons + its synthesis,
`…/tanasubiya_duwal/ihsa/`, the same day; programme domain « ميدان تنظيم المعطيات ») sit under « ميدان التناسبية والدوال »,
a DISPLAY ميدان decided by the owner (`units_4am_2026_2027.json › ownerChapters`; the programme file is
untouched and each unit declares its programme domain in `placement`). The other five are units of
ميدان أنساب الأعداد والحساب: « الأعداد الطبيعيّة والأعداد
النّاطقة » (9 lessons), since 2026-09-30 « الحساب على الجذور » (5 lessons + its synthesis,
`…/hisab-judhur/`) and, since 2026-10-01, « الحساب الحرفي » (3 lessons + its synthesis,
`…/hisab-harfi/`, placed under this ميدان by the owner) and, the same day, « معادلات ومتراجحات
من الدرجة الأولى بمجهول واحد » (4 lessons + its synthesis, `…/muadalat-mutarajihat/`, placed likewise) and
« جمل معادلتين من الدرجة الأولى بمجهولين » (3 lessons + its synthesis, `…/jumal-muadalatayn/`, placed likewise);
the French-era
lessons (`lessons/college/`, `lessons/lycee/`) and the French reference
catalogue were **deleted on 2026-09-25** — older docs that cite them describe
code that no longer exists.

## Read before any task

- `docs/README.md` — the documentation map: which document is authoritative
  for what, and which ones are historical.
- `docs/lessons/LESSON_DEVELOPMENT_GUIDE.md` — the entry point before creating
  or modifying a lesson, a module, a manipulation or an exercise.
  Its §14 is the lesson reference architecture, **frozen for generation on
  2026-09-29**: a generated lesson implements that contract and reuses that
  architecture — never a parallel one.
- `docs/architecture/MANIPULATION_DNA.md` before designing or redesigning a
  manipulation: the student's hand must control a mathematical variable, and
  the platform must not converge toward one manipulation style.
- The contract that governs the area you touch (`docs/architecture/*.md`).
- `docs/architecture/BUNDLE_BOUNDARIES.md` before adding a provider, a route,
  a heavy dependency, an `import.meta.glob` or an i18n namespace — it says
  what may enter the entry bundle and where lazy boundaries sit.

## DOCUMENTATION SYNCHRONIZATION RULE (permanent, applies to every prompt)

For every development task — feature, bug fix, refactor, architectural change,
UI change, lesson change, exercise change, interaction change, or any other
meaningful modification — you MUST first determine whether the change affects
any documentation, and if it does, update the relevant `.md` files as part of
the SAME task. Documentation is not an optional final step, and the user must
never have to ask for it.

The implicit workflow of every development prompt in this repository is:

1. Read the relevant existing documentation.
2. Read the relevant current implementation.
3. Implement the requested change.
4. Determine what documentation is affected.
5. Update the relevant `.md` files.
6. Verify documentation consistency with the implementation.
7. Run the relevant tests.
8. Report the documentation changes in the final response.

Before considering a task complete, verify:

1. Did this change modify or introduce an architecture?
2. Did this change modify an existing component/API/contract?
3. Did this change introduce a new reusable pattern?
4. Did this change modify lesson-generation rules?
5. Did this change modify pedagogy or interaction rules?
6. Did this change modify UI/UX conventions?
7. Did this change modify RTL/Arabic rules?
8. Did this change modify exercises, progression, mastery, or student behavior?
9. Did this change modify Classroom Mode?
10. Did this change introduce a new testing requirement?

If YES to any of these, update the appropriate documentation immediately. Even
when the answer appears to be NO, briefly verify that no documentation is
affected before finishing.

- NEVER leave the repository documentation knowingly outdated after a
  meaningful architectural or behavioral change.
- Do not create unnecessary documentation for trivial changes. Use judgment.
- Always use the CURRENT CODE as the source of truth; never document behavior
  that is not actually implemented. Mark planned behavior `Planned` or
  `Not yet implemented`.
- If a new reusable pattern is introduced, document it so future developers
  and AI agents reuse it instead of creating another one-off implementation.
- Prefer updating the existing authoritative document over creating a new
  file. When two documents would define the same contract, one is
  authoritative and the other links to it.
- At the end of every task, include a short **"Documentation Sync"** section
  in the final report stating which `.md` files were updated and what was
  documented — or, if no documentation was required, why the change does not
  affect the documented architecture/contracts.

### Lesson-generation documentation rule

Whenever a task creates, modifies, or establishes a pattern that could be
reused in future lessons — a lesson structure, module pattern, activity
pattern, question type, manipulation or reusable manipulation behaviour,
exercise type, feedback pattern, `KnowledgeBrick` usage, progression
behaviour, Classroom presentation pattern, Arabic/RTL convention, responsive
interaction pattern, or reusable lesson component — the relevant
lesson-development documentation (`docs/lessons/LESSON_DEVELOPMENT_GUIDE.md`
and the contract it points to) MUST be updated in the same task. Future
lesson-generation agents must be able to learn the correct pattern from the
documentation without reverse-engineering old lessons.

## Images — where they may and may not be generated

### Lesson content: drawn in code, never generated

Everything under `apps/web/src/lessons/` — and `manipulations/` above all — is
drawn in code: inline SVG and styled DOM, parameterised by props, unit-tested,
with Arabic as live DOM text. There is not one raster image in the tree, and
that is deliberate.

**Never generate a raster image (`cf-image`, or any diffusion model) for lesson
content.** If a manipulation needs a new visual, extend its SVG. Four reasons:

1. **It must react.** A shelf re-shelves 420 books while the student drags its
   bookend; a player shakes when a full team refuses it. A flat JPG takes no
   props. See the hand-drawn book at `manipulations/primitives/BookFigure.jsx`
   and the shelf in `manipulations/divisibility/DivisorExplorerBooks.jsx`.
2. **Arabic.** Diffusion models mangle Latin text and cannot render RTL Arabic
   at all. Labels like `رفّ ناقص` are DOM text so they stay correct and selectable.
3. **Determinism.** `logic/bookshelf.test.js` asserts on computed geometry.
   Generated output differs every run.
4. **Mathematical truth.** A generated "10 books on a shelf" may show 9 or 11.
   When the drawing *is* the divisibility argument, that is a wrong lesson.

> Le dessin n'est pas une illustration — il se LIT.
> See `docs/architecture/MANIPULATION_CONTRACT.md`.

### Marketing and shell surfaces: generation is fine

Homepage hero, OG/social cards, blog headers, empty-state art, print covers —
anything outside `lessons/`.

- **`prompt-to-design`** — preferred. Deterministic, real typography, free, and
  the output is reproducible from a committed script.
- **`cf-image`** — only for photographic or illustrative art, and only when the
  image carries **no Arabic text**.

### OG share cards

`scripts/og-card.py` renders branded share cards with correctly shaped Arabic
(Cairo, via Pillow + raqm). Use it rather than generating cards:

```bash
python3 scripts/og-card.py "عنوان الدرس" --eyebrow "الرياضيات · 4 متوسط" -o card.png
```

The **site-wide** card is `apps/web/public/og-image.png` (1200×630), served
at `https://smarter-academy.com/og-image.png` and named by static `og:*` /
`twitter:*` tags in `apps/web/index.html`. Keep those tags static HTML with an
absolute URL — share crawlers never run React — and keep the PNG under
~300 KB (it is 256-colour for that reason): WhatsApp drops heavier previews.
