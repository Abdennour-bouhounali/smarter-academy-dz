# Lesson v2 — the lesson as data plus one world

**Status: Phase 0 of the rollout (plan `docs/reports/LESSON_V2_MASTER_PLAN.md`). One lesson is built this way today — the
pilot `qasim-adad-tabii`. This document is the contract a v2 lesson follows; sections marked `Planned` are not built.**

A v2 lesson is what the pilot became: a game world the student plays, a practice space, exam sittings, a knowledge page,
a launch kit, a lab, and for the teacher a class session with its board and its memo. The pilot was written as one
lesson's code; Phase 0 turns it into a **kit** plus **the lesson's own content**, so the next lesson is content and — at
most once per unit — one world mechanic.

| Layer | Where | Authority |
|---|---|---|
| The kit (screens, frames, the world runtime, the shell) | `apps/web/src/lessons/common/gameworld/kit/` | `GAME_WORLD.md` §3 |
| A world (a mechanic, one per unit unless a lesson needs its own) | `apps/web/src/lessons/common/gameworld/<world>/` | `GAME_WORLD.md` §3 |
| The lesson's content | the lesson's own folder | this document |
| The class session | `apps/web/src/features/classSession/` | `CLASS_SESSION.md` |
| The launch kit, the lab | `lessons/common/launchkit/`, `lessons/common/lessonlab/` | `LAUNCH_KIT.md`, `LESSON_LAB.md` |

## 1. The pack — `lesson.pack.js`

**One file in the lesson's folder says everything the lesson gives the platform beyond its modules. No list anywhere
else names a lesson.** Before 2026-11-17 a lesson had to be added by hand to `PHONE_LESSONS`, `BOARD_LESSONS`, `SCRIPTS`,
`BOARD_MEMOS`, `KNOWLEDGE_LOADERS`, the exam coach's table, `content/practice/exam-coach.json`, the `gameWorld` and
`classSession` keys of its config, and the world's own import of its one lesson. All of these are gone.

```js
// lessons/moyen/4am/…/qasim-adad-tabii/lesson.pack.js
export const LESSON_PACK = {
  id: 'qasim-adad-tabii',
  phone: true,
  world: { id: 'divisor-isles', content: () => import('./world').then((m) => m.lesson) },
  knowledge: () => import('./knowledge.jsx').then((m) => m.LESSON_KNOWLEDGE),
  coach: { P1: 'qasim-baqi', P2: 'qasim-jidaa', P3: 'siyagh-mutakafia', P4: 'wahid-wa-nafsuh' },
  board: {
    script: () => import('./board/script.js').then((m) => m.SCRIPT),
    memo: () => import('./board/memo.js').then((m) => m.MEMO),
  },
};
```

| Key | Meaning | Who reads it |
|---|---|---|
| `id` | the lesson's id — the generator fails when it differs from the folder | — |
| `phone` | its home was designed AND walked on a phone held sideways (`GAME_WORLD.md` « On a phone ») | `components/auth/phoneLessons.js`, the launch kit |
| `world` | `id` = a world of `gameworld/LessonGameWorld.jsx › WORLDS`; `content` = what the world is played with (`GAME_WORLD.md` §3 « The pilot's content ») | `LessonIndex.jsx`, `LessonGameWorld.jsx` |
| `knowledge` | the lesson's knowledge sheets (`LESSON_KNOWLEDGE`) | « بطاقة المعارف » on the board, the exam coach |
| `coach` | `{ <الكفاءة>: <knowledge item id> }` — the sheet « مدرّب الامتحان » reminds; needs `knowledge` | `features/practice/exam/examCoach.js` |
| `board` | « حصّة القسم »: the lesson on the board (`script`) and its written memo (`memo`) — both or none. The teacher's card shows « في القسم » only for a lesson that has it; a class session with the tests alone, without a script, cannot be declared (the old `classSession: true` of the config is gone) | `boardLessons.js`, `ClassSessionPage`, `LessonMemoPage`, the teacher's card |

Rules:

- **A data module without a static import** — Node reads it. Everything heavy is behind `() => import()` that resolves to
  the thing itself (the script, not its module).
- **The flags are generated.** `node scripts/generate-lesson-index.mjs` (`npm run generate:lesson-index`) reads every
  pack and writes `pack: { phone?, world?, knowledge?, coach?, board? }` on the lesson's line of
  `lessons/lessonIndex.generated.json`. The entry bundle asks the flags (`registry.js › lessonPackFlags(id)`,
  `lessonsWithPack(flag)`) and loads nothing. `check:lesson-index` (in `check:lessons` and CI) fails when a pack changed
  and the index did not; the generator refuses an unknown key, a wrong shape, an id that is not the folder's.
- **A page asks for ONE part**: `lessons/lessonPack.js › loadPackPart(lessonId, part)` or, in a component,
  `usePackPart(lessonId, part)` — `undefined` while it loads, `null` when the lesson has none. Parts: `world`,
  `knowledge`, `coach`, `script`, `memo`. Never import a lesson's file by its path from shared code.
- **Tests**: `lessons/lessonPack.test.js` loads every pack of the index and every part it names; a lesson's own tests
  import its files directly.

**To give a lesson a pack**: write `lesson.pack.js` beside `lesson.config.js` with the keys it really has, run
`npm run generate:lesson-index`, run the tests. Nothing else is edited.

### What is NOT in the pack (and why)

| Still elsewhere | Why |
|---|---|
| `lessonlab/registry.js › TOOLS` — an instrument is tagged with the lesson that introduces it | an instrument is shared CODE; lessons without a pack (1AM–3AM) own instruments too |
| `launchkit/families.js` — a question family per earlier الكفاءة | keyed by the الكفاءة of the learning net, shared by every lesson that needs it |
| `content/practice/exam-style.json` — the lessons whose bank is the BEM exam sheet | read by `scripts/validate-exercises.mjs` for all 74+ converted lessons, most of which have no pack |
| `content/class-tests/<grade>/<lesson>.json` — the default class test | already one file per lesson, served by the API |
| `pages/unit/unitMissions.js` — the student's unit page | one entry per UNIT |

## 2. The lesson's folder

```
<lesson>/
  lesson.config.js     modules, الكفاءات, mission (the frozen lesson contract, LESSON_DEVELOPMENT_GUIDE §14)
  lesson.pack.js       the pack (§1)
  knowledge.jsx        the knowledge sheets and the mind map
  world/               what the game world is played with — index.js exports `lesson` (GAME_WORLD.md §3)
  board/script.js      « الدرس على السبّورة » (CLASS_SESSION.md §5ter)
  board/memo.js        the written memo (CLASS_SESSION.md §2quater)
  modules/, content/   the modules a v2 lesson still shows through the classic player (decision D3 retires them per lesson)
```

## 3. Definition of done, status script

`Planned` — `apps/web/scripts/lesson-v2-status.mjs` and the definition of done of a v2 lesson are written at step 6 of
the plan's list (§4ter-0), after the pilot's last rules are forged.
