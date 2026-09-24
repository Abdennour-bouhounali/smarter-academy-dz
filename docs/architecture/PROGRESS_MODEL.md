# Progress Model

> **Two progressions, two vocabularies (Mastery V2, 2026-09-24).**
> **Completion** answers « did the student go through the material? » —
> modules done, lessons done, percentages. **Mastery** answers « what does the
> student actually know about each Learning Point? » — the evidence-driven
> state in `student_learning_point_progress`, owned by
> [`LEARNING_ARCHITECTURE.md`](./LEARNING_ARCHITECTURE.md) § « Mastery model
> (V2) ». They are two tables, two APIs, and — since 2026-09-24 — two sets of
> words: completion never says إتقان / متحكَّم (« أنهيت مسار الدرس ✓ »), and the
> four mastery states have ONE label set (`student:mastery.*`).
>
> Still true from the 2026-09-20 corrections: the lesson-completion
> denominator is `modules.length` (registry); module `0` counts like any other
> module (`isValidModuleNumber`); `completion_mode` is recorded once and the
> client still never sends `'mastery'` (every completion is `'path'`) — the
> claim « this student masters the lesson » is made by the Learning Point
> states, not by this column. XP is still client-only.

The cleanup phase unified *how* completion percentage is calculated (one pure function, `calculateCompletionPercentage`, replacing four divergent formulas). This document defines *what* completion means at each level, and draws the line between completion and mastery that the codebase currently blurs.

## The two progressions (and their two tables)

The pedagogical vision distinguishes **lesson progression** (where the student
is within a lesson's journey) from **knowledge progression** (what they have
demonstrated per Learning Point). These are two separate server-side tables,
never merged:

| | Lesson progression | Knowledge progression |
|---|---|---|
| Table | `student_lesson_progress` | `student_learning_point_progress` |
| Granularity | lesson (status, current module, completed modules) | learning point (confidence 0–1, mastered/reinforce/gap) |
| Written by | `PUT /api/v1/lessons/{code}/progress` (`LessonProgressService`) | `POST /api/v1/lessons/{code}/evidence` (`ProgressEngine`) |
| Read by | `GET /api/v1/students/me/lesson-progress` | `GET /api/v1/students/me/learning-profile` |
| Fed from | `useProgress` → `progressQueue.js` (debounced snapshots) | `useEvidenceSubmission` (evaluation questions only) |

**Completion is not mastery** — a student can complete every module without
mastering a Learning Point, and vice versa.

### Cross-device merge semantics (`LessonProgressService::upsert`)

- `completed_modules` → **union**: merging never removes a completion, which
  makes offline-queue replays and multi-device races safe.
- `current_module` + `last_activity_at` → **latest wins**: only a snapshot
  whose `lastActivityAt` is at or after the stored one may move the position.
- `status` → **monotonic**: `in_progress → completed` only; `completed_at` is
  set once and never cleared.
- `completion_mode` → recorded once with `completed_at`: `'path'` (the
  student followed the journey to the final evaluation — the default) or
  `'mastery'` (the always-open final evaluation demonstrated mastery
  directly, the "Je pense déjà maîtriser" path). Later snapshots cannot
  rewrite it. The client never sends `'mastery'` today (every completion is
  `'path'`), and the column is not a mastery claim: whether a student KNOWS
  the lesson's points is `student_learning_point_progress`, judged by the
  server since Mastery V2.

### localStorage is a cache, not the source of truth

`smarter_lesson_{id}` remains the synchronous read path and the offline
cache. For authenticated students, every module write schedules a debounced
push (`progressQueue.js`, last-snapshot-wins per lesson) and the server's
merged answer is folded back into storage; on login,
`useLessonProgressSync` hydrates storage from
`GET /students/me/lesson-progress` before any lesson page opens. Anonymous
visitors stay purely local.

**Known follow-up:** XP (`smarter_global_xp`) is still client-side only — it
has no server table yet and is lost across devices.

### Module counts come from the lesson registry

`apps/web/src/lessons/registry.js` derives a lesson's module count from its
`LESSON_CONFIG.modules.length`. Nothing may fabricate a module count: a
catalogue lesson without a built config is not resumable and contributes no
completion percentage (the old `totalModules || 7` fallbacks are gone, as is
`LESSON_CONFIG.totalModules` itself).

## Completion levels

### Module completion

- **Definition:** binary. A module is complete iff `useProgress(lessonId).markModuleCompleted(moduleId)` has been called for it, ever.
- **Module `0` counts.** The id is written as the module's number stringified, so a lesson opening on « أستعدّ » stores `'0'`. `calculateCompletionPercentage` already normalises it (its regex matches `^(\d+)`), and callers must test module numbers with `isValidModuleNumber`, never for truthiness.
- **Numerator/denominator:** N/A — not a percentage, a boolean (`isModuleCompleted(moduleId)`, `lessonAccess.js`).
- **Who decides when this fires:** the module itself, at whatever point its own author considers it "done" (§Module contract, `LESSON_CONTRACT.md`) — intentionally not standardized across module types.
- **Edge case:** calling `markModuleCompleted` twice for the same id is a no-op (`useProgress.js` checks `.includes()` first) — idempotent by construction.

### Lesson completion

- **Definition:** `calculateCompletionPercentage(completedModuleIds, totalModules)`.
- **Numerator:** count of *unique* completed module numbers, after normalizing mixed-format ids (`"3"`, `"L03"`, `"L03-4e"` all → `3`) via regex and de-duplicating through a `Set`.
- **Denominator:** `modules.length`, served by the lesson registry (`apps/web/src/lessons/registry.js`); `LESSON_CONFIG.totalModules` no longer exists.
- **Edge cases, explicit:** `totalModules` missing/zero → `0` (never `NaN`/`Infinity`); `completedModuleIds` missing/not an array → `0`; more completed than total (shouldn't happen, but a stale/corrupted `localStorage` value could produce it) → capped at `100`.
- **Weighting:** none — every module counts equally. There is no concept of "this module is worth more" anywhere in the current data model.

### Chapter completion

- **Definition:** the mean of each available lesson's completion percentage within that chapter (`Courses.jsx`'s `getChapterProgress`, now itself calling `calculateCompletionPercentage` per lesson instead of the pre-cleanup inaccurate raw-length formula).
- **Numerator/denominator:** `sum(calculateCompletionPercentage(lesson) for lesson in availableLessons) / availableLessons.length`.
- **Edge case:** a chapter with zero available lessons (e.g. every lesson still `status: 'coming_soon'`, true for all of 5e today) → `0`, not `NaN` (`getChapterProgress` early-returns before dividing).
- **Weighting:** every *lesson* counts equally regardless of its module count — a 5-module lesson and an 11-module lesson each contribute one vote to the chapter average. This is a real modeling decision already baked into the existing code, documented here rather than changed (changing it would alter what number a student currently sees).

### Course completion (= grade, per the domain model in `ARCHITECTURE.md` §1)

- **Does not exist as a computed value anywhere today.** `Courses.jsx` computes chapter-level aggregates but never rolls them further up to a single "your 6e progress is X%" number. Not added in this phase (no UI currently asks for it; adding it would be speculative).

## Completion vs. Mastery

| | Completion | Mastery |
|---|---|---|
| **Question** | « did the student go through the material? » | « what does the student know about this Learning Point? » |
| **Unit** | module, lesson, chapter | Learning Point (and counts of Learning Points per lesson/unit) |
| **Source** | `student_lesson_progress` (+ `smarter_lesson_{id}` cache) | `student_learning_point_progress`, derived from `learning_evidence` by the mastery engine |
| **Written by** | `PUT /lessons/{code}/progress` | `ProgressEngine` only (final test + practice engine) |
| **Read by** | lesson index %, unit %, « أنهيت مسار الدرس ✓ », Knowledge Map visibility | coloured dots/pills, «للعمل الآن», practice hub, teacher class × LP, recommendations |
| **Code names** | `calculateCompletionPercentage`, `getModuleMastery` (a historical name — it returns module COMPLETION, 100/0, and drives unlocking only) | `status`, `status_reason`, `confidence`, evidence counters |

**A student can complete a lesson without mastering its Learning Points, and
master a Learning Point without completing the lesson** (the final test is
always open) — `RepeatedAttemptsFlowTest::test_completion_and_mastery_are_independent`.

**Aggregation above the Learning Point is a COUNT, never a score.** A lesson
or unit shows « 3 / 4 متحكَّم فيها » and the four-status distribution; there is
no « lesson mastery = 87 % ». A numeric lesson mastery would hide which point
is weak — the one thing a teacher needs to know.


## Who reads progress (2026-09-22)

Three readers, **one set of tables**: the student (their own space), the
administrator (`Admin\StudentService`) and, since the teacher phase, the
teacher of a class (قسم) through `Domain\Classroom\ClassroomProgressService`
and `Domain\Progress\StudentDossier` (extracted from the admin service and
used by both). They read `student_lesson_progress`,
`student_learning_point_progress`, the practice attempts and
`users.last_activity_at`, scoped to the class's grade and to the lessons the
class makes *effective* (a lesson the teacher hid is not counted). Since
Mastery V2 the teacher also reads **class × Learning Point**
(`Domain\Classroom\ClassroomLearningPointService`): one `GROUP BY` over the
canonical state, never a copy. Success rates everywhere come from
`Domain\Progress\Support\OutcomeStats`. **No
teacher-side progress table exists and none may be added**: a class view is a
query over the student's data, never a copy of it. Leaving or being removed
from a class changes a membership row only — every progress, attempt and
mastery row stays. The notebook is never read (`NOTEBOOK.md`). Contract:
[`TEACHER_CLASSROOM_ARCHITECTURE.md`](./TEACHER_CLASSROOM_ARCHITECTURE.md) §4.

## Who writes progress

Only a **student** does. A teacher (or an admin) opens the same lessons,
modules and **parts** with `freeNavigation` (no sequential lock, at either
level: `utils/moduleGate.js` for modules, `utils/stepUnlock.js` for the steps
inside one and for the « التالي » gesture) and `tracksProgress = false`
(`features/learning/learningViewer.js`): `useProgress`, the progress sync, the
evidence queue and the final-test hook are silent for them. Opening a part out
of order therefore records nothing — a teacher reading part 7 never marks
parts 1–6 as done, for themselves or for any student. Server side the
`learner` middleware refuses `PUT /lessons/{code}/progress`,
`POST …/evidence` and `PUT|DELETE …/final-test-attempt` for any non-student
(403 `not_a_learner`), so a teacher can never create a `student_lesson_progress`
or `learning_evidence` row — for themselves or for anyone. Locked by
`TeacherLearningAccessTest`. See `TEACHER_CLASSROOM_ARCHITECTURE.md` §8b.
