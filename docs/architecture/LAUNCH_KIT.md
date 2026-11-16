# « عُدّة الانطلاق » — the launch of a lesson

> **Status: phase 1 built on 2026-11-17 on the pilot lesson `qasim-adad-tabii` — NOT validated by the owner, no real student has
> played it.** Owner's idea (2026-11-16/17): before a lesson, a game of five minutes at most, fun, that tests the earlier
> الكفاءات the lesson needs, gives a score with the lessons to revise, and feeds the picture of the student's learning that the
> student and the teacher read. Build plan and the phases not built yet: `docs/reports/LAUNCH_KIT_PLAN_2026-11-17.md`.
> Code: `apps/web/src/lessons/common/launchkit/`.

## 1. What it is

Before a lesson, the robot **charges the tools it needs**, then takes off into the lesson. A tool is ONE earlier الكفاءة the
lesson stands on — a programme item of the learning net, of the same grade or of an earlier one.

| Moment | What happens |
|---|---|
| The bag (10 s) | 2–4 empty slots, each named in the student's words with the year it comes from. A tool measured « ثابتة » in the last 21 days arrives charged and is not asked again |
| A station per tool | 2 or 3 questions; each right answer lights a segment; a miss says « سنعود إليه » |
| The quick workshop (≈ 1 min, only if needed) | the weakest tool is repaired on the spot: a worked example revealed step by step, opened on the mistake the answers showed, then two similar questions |
| The kit | each tool in one of four states, the score, « نجمة الصدق », ONE lesson to revise first with four actions |
| The capsule (≈ 3 min, only when the gate asks) | a CORE tool left at « نبدأ منها »: its card, a worked example, its instrument in the lab, two easy questions — then the door is open (§3bis) |
| The take-off | countdown, then the lesson starts |

It is **one component for every lesson**: `<LaunchKit lessonCode lessonTitle onDone onClose inline />` needs only the lesson's
code. Nothing scrolls (designed 1280 × 720, and 1000 × 740 for a 4:3 screen, zoomed to the window — like « مختبري »).

## 2. Rules (binding for the launch)

1. **Tools come from the net, never from a list typed in the lesson**: `planTools(toolsForLesson(code), …)` — the direct
   prerequisites, the CORE ones first (`LEARNING_NET.md` §2.2bis), then the supports, the nearest year first, at most four,
   only those that have a question family.
2. **A tool is never judged on one answer, and the game stops as soon as it knows.** The band machine is the one of
   « بوصلتي » (`packages/core/compass/engine.js › itemProgress`, also held by the server in PHP): easy → harder; a miss gets a
   second easy one. Two or three answers per tool.
3. **Never the right answer during a station** — ✓ or « سنعود إليه », never « wrong »: showing it would spoil the next question
   of the same tool. The workshop is where the launch teaches.
4. **The answer is a gesture** (`gestures.jsx`): *write* the value in its own shape on the game's keypad, *sort* cards by
   DRAGGING each into one of two boxes (owner, 2026-11-17; a tap on a box does the same), *place* a flag on a number line.
   Nothing moves by itself and nothing is timed per question. The answer is handed in with « تمّ »: until then everything can be
   changed (a slip does not count).
5. **No life, no losing, no speed score, no ranking, no luck.** The time of an answer is recorded (`ms`), never scored.
6. **« غير متأكّد »** can be said before handing in. It counts as not succeeded for the band — never as a fault — and
   **« نجمة الصدق »** rewards a student who knew what he knew: sure and right, or unsure and wrong, on 4 answers out of 5.
7. **A repaired tool is not « ثابتة »**: from « نبدأ منها » it rises to « تحتاج تثبيتًا », and the next launch asks it again.
8. **Five minutes and twelve questions at most**; what was not asked stays « لم نفحصها بعد » and costs no point.
9. **The game is felt between the questions**: the segment that lights, the bed of music that gains a layer with each right
   answer in a row (`LaunchSound.layers`, show only), the countdown. A sound never tells right from wrong before « تمّ » (each
   box of a sort has its own note, whatever the card).
10. No person is drawn (a robot, drawn in code). Respect of Islam: no luck, no gambling image.

## 3. The bands, the score, the kit

| Band | Label | Segments | How |
|---|---|---|---|
| `solid` | « ثابتة » | 2 | easy ✓ then harder ✓ |
| `consolidate` | « تحتاج تثبيتًا » | 1 | one of the two missed — or « نبدأ منها » repaired in the workshop (« أُصلحت الآن ») |
| `start` | « نبدأ منها » | 0 | two easy questions missed |
| `unseen` | « لم نفحصها بعد » | — | the clock ended first; not counted in the score |

Score = lit segments / (2 × tools measured). The kit screen names ONE lesson to revise first (`priorities`: « نبدأ منها », then
« تحتاج تثبيتًا » not repaired, then repaired) and offers, for the tool shown:

- **« بطاقة المراجعة »** — the family's `memo` (three or four lines);
- **« جرّب الأداة في مختبري »** — the lab opened ON the family's instrument (`LessonLab initialTool`);
- **« أعد فحص الأداة »** — that tool alone is asked again (no workshop; the try is not counted twice);
- **« الدرس كاملًا »** — the earlier lesson, with the existing one-click return (`mission/returnToLesson.js`); « الدرس قريبًا »
  when the lesson is not published.

## 3bis. The gate — the door opens by doing, not by scoring (owner, 2026-11-17)

`engine.js › gateOf(kit)`. It replaced the first idea of a lock under a percentage (with two tools, 10 % only blocks a student
with nothing right; a score can be guessed; a wall sends a child away).

- **When:** a **core** tool (the weight of the learning net: the lesson cannot be passed without it; a tool not classified yet
  counts as core) is left at « نبدأ منها » — two easy questions missed and the workshop did not repair it. A **support** tool
  never closes the door; « تحتاج تثبيتًا » is enough to go.
- **What:** the take-off button is replaced by « ابدأ الكبسولة · 3 دقائق ». The capsule has four steps, always shown:
  ① « البطاقة » (the family's `memo`) → ② « المثال » (a worked example, revealed step by step, opened on the named mistake) →
  ③ « جرّب بيدك » (the family's instrument, in « مختبري ») → ④ « سؤالان » (two easy questions, phase `capsule`).
- **Then the door is open, whatever the two answers say.** Both right: the tool rises to « تحتاج تثبيتًا » (« أُصلحت الآن »).
  Otherwise it stays « نبدأ منها », flagged « كبسولة منجزة » (`items[<item>].capsule` in the toolbox): nothing is pretended.
- **Never a second capsule in the same launch, never a dead end.** Re-checking the tool with success also opens the door.
- **For every student** — the one of a class and the independent one (owner, 2026-11-17, after seeing it: « yes »).

## 4. A question family (`families.js`) — how to add one

One entry in `FAMILIES`, keyed by the item id of the net:

```js
'1am.m3.r01': { item, lesson, name, icon, labTool, forms: { 1: [...], 2: [...] }, make(rand, level, form, { first }), example(rand, level, { k }), memo: [...] }
```

- **It generates** its questions on two levels (1 very easy, 2 harder), in several forms; a retake never shows the same numbers.
  The very first question of a launch is a near-certain win (`first`).
- **A question is plain data**; `grade(q, answer)` says right or not and NAMES the mistake when the answer shows one
  (`MISTAKES`: « الباقي دائمًا أصغر من المقسوم عليه », « في قاعدتي 3 و 9 نجمع الأرقام »…). A sort card that is a trap carries the
  mistake it catches. The workshop opens on that sentence.
- **Tests are part of the family** (`launchkit.test.js`): every generated question is re-computed apart and graded right, the
  numbers of each level stay in their range, every trap names a known mistake, the worked example is true.

Families on 2026-11-17 (the two prerequisites of the pilot lesson):

| Item | Tool | Level 1 | Level 2 | Instrument |
|---|---|---|---|---|
| `1am.m3.r01` | القسمة الإقليدية | write « 47 = 6 × ▢ + ▢ »; place the greatest multiple not beyond the number | write with a two-digit divisor; sort three equalities (is it THE Euclidean division?) | `paper` |
| `1am.m3.r02` | قواعد قابلية القسمة | sort by 2, by 5 | sort by 3, by 9, by 4 — with numbers chosen to trap the wrong rule | `rules` |

## 5. Where it opens (phase 1)

Only the pilot lesson: in its game world, the FIRST « ابدأ المغامرة » plays the launch, then the world starts
(`DivisorIsles.jsx › onBegin`, overlay `{ type: 'launch', then: 'start' }`, `Game.js › openLaunch / launched`); afterwards
« واصل » goes straight in, and « 🎒 عُدّتي » on the title screen opens the kit again (`data-di-launch-open`). The 3D world is
not drawn behind it. Other lessons keep « أستعدّ » unchanged until the owner validates this.

## 6. State and what it is NOT yet

`scopedStorage` key `smarter_launch_kit` (`store.js`; per student, **browser only**): `items[<item>] = { band, repaired, at }`,
`lessons[<code>] = { first, last, tries }`, the sound switch.

Phase 1 is a prototype to judge the feel. **Not built** (plan, phases 2–4):

- the server does not ask or grade: the result is **not learning evidence**, is **not seen by a teacher**, is not synced;
- the gate (§3bis) lives in the browser like the rest: a teacher does not see who needed a capsule;
- no picture of a الكفاءة with its sources (measured / deduced), no window of earlier الكفاءات, no automatic update from a
  later success, no « prerequisite or new idea? » diagnosis, no class grid;
- only two families: every other lesson has no launch.

## 7. Check

- Unit: `npx vitest run src/lessons/common/launchkit` in `apps/web` (17 tests: families true and in range, named mistakes,
  the engine — never one answer, the workshop, the caps, the fresh tools, the gate and its capsule, the honesty star — and
  the sounds).
- Walk: `node apps/web/e2e/launch-kit.mjs [outDir]` (dev server up; also `E2E_SIZE=1024x768` and `1840x900`): 56 checks — the
  first « ابدأ », the three gestures with real taps and drags, the two verdicts, the workshop, the kit, the lab opened on the
  instrument, a tool re-checked, the take-off, « played once », a student who misses everything: the gate, the four steps of
  the capsule, the door open after two missed answers, then the earlier lesson and the return. At every screenshot nothing scrolls and nothing leaves its panel; the walk also listens to the sounds played.
- The older game-world walks seed the launch as already played (`u_<id>_smarter_launch_kit`).
