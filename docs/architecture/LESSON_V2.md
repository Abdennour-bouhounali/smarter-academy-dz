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
- **Tests**: `lessons/lessonPack.test.js` loads every pack of the index and every part it names, and FAILS when shared
  code (`lessons/common`, `features`, `components`, `services`, `utils`, `hooks`, `contexts`) names a lesson that has a
  pack — the one exception is the instrument tags of `lessonlab/registry.js`. A lesson's own tests import its files
  directly.

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

## 1bis. What the server must know about a lesson — nothing

The server holds no code of a lesson's game. An answer that counts toward a الكفاءة is sent as a **claim** (the numbers of
the question and what the student wrote) to `POST /lessons/{code}/game-evidence`, and `Domain/GameWorld/ClaimVerifier.php`
re-computes its verdict from the numbers alone. The kinds of claim (`division`, `product`, `phrase`, `sure`,
`containers`) are statements about natural numbers — they belong to no lesson.

- A lesson says, in its `world/evidence.js`, WHICH claim each of its answers makes and which الكفاءة each key proves
  (`createEvidence({ grade, points })`); the verdict is the kit's `kit/claims.js › verifyClaim`.
- **To add a kind** (a lesson needs a statement none of the kinds makes): write it in `kit/claims.js` AND in
  `ClaimVerifier.php` (`KINDS`, `verify`), and add rows that are true and rows that are false to the one fixture
  `apps/api/tests/Fixtures/game-claims.json`. `kit/claims.test.js` fails when the two lists differ, when a kind lacks a
  row of each verdict, or when the two sides disagree; `ClaimVerifierTest` replays the fixture on the server.
- An answer whose verdict cannot be re-computed from numbers (« صحيح أم خطأ؟ علّل ») is never evidence.

## 1ter. The student's journey, his progress, and a lesson that is rebuilt

**The journey follows him** (`gameworld/kit/saveSync.js`, 2026-11-17). The world's save stays in the browser so the game
never waits for the network; a copy is kept on the server in the student's PRIVATE answers store
(`GET/PUT /lessons/{code}/answers` — his alone, never evidence, never read by a teacher, a school or a parent; no new
table):

- **pull** before the world mounts (`LessonGameWorld.jsx`, at most 2.5 s, never blocking): the server's copy replaces
  the browser's only when it is strictly newer;
- **push** a few seconds after a save (one request for a burst of saves), when the page is hidden, when the world closes;
- the store takes small values and reads keys by dot paths, so the save is cut into pieces under keys WITHOUT a dot:
  `world:n` = how many, `world:0` … = slices of base64, all stamped with the time of the save; a copy whose pieces do
  not all carry that time is ignored;
- the newest WHOLE save wins (the device's clock): two devices played at the same time do not merge;
- a teacher's preview pulls nothing and pushes nothing.
- Check: `kit/saveSync.test.js` (the pieces, an incomplete copy, who wins), `StudentLessonAnswersTest` (a real chunked
  save through the controller), and the walk `e2e/gameworld-sync.mjs` (two devices, a slow server, a server that is
  down, a teacher's preview — 12 checks, laptop and phone).

**While the world arrives** the student sees his lesson's name and a bar that fills (`LessonGameWorld.jsx`,
`lessonGameWorld.css`), and a sentence with « حاول من جديد » when the network gives up. three.js is ONE chunk shared by
every world (135 KB gzip, measured); the pilot's world is 73 KB gzip of code and 17 KB of styles; a lesson adds its own
content. A budget per lesson is `Planned` (the status script, §3).

**Progress, mastery and the reports still read MODULES — and a v2 lesson still has them.** Its `lesson.config.js` keeps
its modules and its الكفاءات; the world marks a module done when the story reaches what that module taught
(`onModule`), and the exam-format answers are evidence (§1bis). So « بوصلتي », the parent's « التقدّم بالتفصيل », the
school's reports and the teacher's tracking need no change for a v2 lesson.

**When a lesson in use is rebuilt as v2** (rule taken from the pilot — it was never decided otherwise; the owner may
change it):

- nothing the student earned is taken: his الكفاءات, his evidence and the modules he completed stay (the module numbers
  of the lesson do not change);
- the keys his own progress proves are his from the first screen (`lesson.keysFromModules(done)`): the practice space
  and the knowledge page are open to him as far as he went;
- the STORY of the world is new to him: he starts it at the first island, and may leave it for the practice space.

## 2. The lesson's folder

```
<lesson>/
  lesson.config.js     modules, الكفاءات, mission (the frozen lesson contract, LESSON_DEVELOPMENT_GUIDE §14)
  lesson.pack.js       the pack (§1)
  knowledge.jsx        the knowledge sheets and the mind map
  world/               what the game world is played with — index.js exports `lesson`: its keys and their tablets, its
                       FORGES (one per key: no rule is told — GAME_WORLD.md §2sexies), the practice ladder, the trainer,
                       the exam sittings, the journey, the evidence, the knowledge page, its sentences (GAME_WORLD.md §3)
  board/script.js      « الدرس على السبّورة » (CLASS_SESSION.md §5ter)
  board/memo.js        the written memo (CLASS_SESSION.md §2quater)
  modules/, content/   the modules a v2 lesson still shows through the classic player (decision D3 retires them per lesson)
```

## 3. Is a lesson done? — the status script and the definition of done

```bash
npm run status:lesson-v2                      # every lesson that has a pack, then the retirement ledger
npm run status:lesson-v2 -- --lesson <id>     # one lesson, part by part; exit 1 unless it prints ✅
```

`apps/web/scripts/lesson-v2-status.mjs` reads files and markers and judges nothing. Its parts, for one lesson:

| Part | What it looks at |
|---|---|
| the pack | `lesson.pack.js` and its flags in the generated index |
| S2 the world | `pack.world`; the nine files of `world/` (`index`, `forges`, `practice`, `trainer`, `sitting`, `journey`, `evidence`, `knowledge`, `text`); a test for six of them |
| S2 every rule is forged | every key of `world/journey.js › KEYS` has its forge in `world/forges.js` |
| S3 knowledge, S6 exam coach | `pack.knowledge`, `pack.coach` |
| S4 the practice bank is the BEM exam sheet | the lesson is in `content/practice/exam-style.json` |
| S8 « مختبري » | an instrument tagged with the lesson in `lessonlab/registry.js` |
| S1 the launch kit | every CORE tool of the learning net for the lesson has a family in `launchkit/families.js` |
| T1–T3 the board | `pack.board`, `board/script.js`, `board/memo.js` |
| T2 the class test | `content/class-tests/<grade>/<id>.json` |
| the phone | **PAUSED (owner, 2026-11-18)**: `pack.phone` stays `false`; not part of « done ». Set only after its home was designed and walked on a phone, when phones resume |
| a walk | a walk of `apps/web/e2e/` that names the lesson and plays its world |
| published | status `available` in the catalogue |

**A lesson is done when** (plan §6):

1. the status script prints ✅ for it;
2. its unit tests pass — in particular `world/forges.test.js`: for every forge exactly one rule holds and every other is
   refuted in front of the student;
3. its walk passes at 1366×768, 1024×768 and 1840×900 (**the phone walk, `E2E_TOUCH=1 E2E_SIZE=800x370`, is PAUSED since 2026-11-18** — phones are built later, see `GAME_WORLD.md` « On a phone »);
4. its screenshots were looked at with the eyes, student and teacher;
5. `check:lessons`, the entry budget, lint, `check:unused`, `check:unreached` and `check:format` pass;
6. what it replaced is deleted in the same change; its docs are updated; it is committed `feat(lessons): <id> — v2`.

**The retirement ledger** is printed by the same script: how many lessons still stand on each old system (the mission
player, the older lesson page, « أستعدّ », « وضع القسم » and the derived memo). A legacy system is deleted in the commit
that converts its last lesson — never before, never later. On 2026-11-17: 140 lessons built, 1 with a v2 world, 31 on the
mission player only, 108 on the older lesson page, 139 without a board.

NOT in the script yet: a weight budget per lesson; the content checks of `check:lessons` (respect of Islam, independence
from the book, « دج », counters, formulas) do not read a lesson's `world/` and `board/` folders — plan B8.
