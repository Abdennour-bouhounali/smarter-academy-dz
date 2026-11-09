# Mission prototype — rollout log (lesson by lesson)

> Started 2026-11-08, when the owner **validated** the pilot `qasim-adad-tabii`. Plan and checklist:
> `PILOT_PROTOTYPE_ROLLOUT_PLAN_2026-11-08.md` (§5 convert, §6 definition of done, §7 traps, §8 test toolkit); rules:
> `docs/lessons/LESSON_DEVELOPMENT_GUIDE.md` §4sexies, §4septies and its « Rollout recipe ». One commit per lesson,
> `feat(lessons): <id> — mission prototype`. A lesson is DONE when `vitest run src/lessons`, `check:lessons`,
> `lab-rollout-status --lesson <id>` and the Playwright walk of §6 (1366×768, 1024×768, 1920×1080; no `data-fit-overflow`) all pass.

## The table

| # | Lesson (unit 1) | Labs converted | Status | Commit | Notes |
|---|---|---|---|---|---|
| 1 | `qasim-adad-tabii` (pilot) | `team-builder` | ✅ validated 2026-11-08 | (pilot stages) | The reference implementation. |
| 2 | `qawasim-adad-tabii` | `factor-pairs` (v2 treatment, new) | ✅ done 2026-11-08 | `feat(lessons): qawasim-adad-tabii — mission prototype` | See « Lesson 2 » below. |
| 3 | `khawass-qawasim` | `divisor-properties` (v2 treatment, new) | ✅ done 2026-11-08 | `feat(lessons): khawass-qawasim — mission prototype` | See « Lesson 3 » below. |
| 4 | `qasim-mushtarak-akbar` | `common-divisors` (v2 treatment, new) | ✅ done 2026-11-08 | `feat(lessons): qasim-mushtarak-akbar — mission prototype` | See « Lesson 4 » below. |
| 5 | `tayin-pgcd` | `common-divisors` (already converted) | ✅ done 2026-11-08 | `feat(lessons): tayin-pgcd — mission prototype` | See « Lesson 5 » below. |
| 6 | `bahth-pgcd` | `pgcd-differences`, `euclidean-algorithm` (v2 treatment, new) | ✅ done 2026-11-09 | `feat(lessons): bahth-pgcd — mission prototype` | Also the BEM exam-sheet prototype lesson (practice untouched). See « Lesson 6 » below. |
| 7 | `ikhtizal-kasr` | `fraction-reduction` (v2 treatment, new) | ✅ done 2026-11-09 | `feat(lessons): ikhtizal-kasr — mission prototype` | See « Lesson 7 » below. |
| 8 | `awwaliyan-fima-baynahuma` | — | ⏳ next in catalogue order | | |
| 9 | `wadiya-idmajiya-aadad` | — | ⏳ | | |

Catalogue order: `packages/core/curriculum/dz/lessons_4am_2026_2027.json`. Units 2–14 are not started.

## Lab families — which have the v2 treatment

| Lab (`type`) | v2 treatment | First converted in |
|---|---|---|
| `team-builder` | ✅ (pilot) | `qasim-adad-tabii` |
| `factor-pairs` | ✅ (2026-11-08) | `qawasim-adad-tabii` |
| `divisor-properties` | ✅ (2026-11-08) | `khawass-qawasim` |
| `common-divisors` | ✅ (2026-11-08) | `qasim-mushtarak-akbar` |
| `pgcd-differences` | ✅ (2026-11-09) | `bahth-pgcd` |
| `euclidean-algorithm` | ✅ (2026-11-09) | `bahth-pgcd` |
| `fraction-reduction` | ✅ (2026-11-09) | `ikhtizal-kasr` |
| every other lab | ⏳ | — |

## Lesson 2 — `qawasim-adad-tabii` « قواسم عدد طبيعي » (2026-11-08)

**What was written (per lesson):** `lesson.config.js` (`studentView: 'mission'`, `mission` with scene `library-wall`, 4 tools = the 4
knowledge items, climax = module 4 « جدار المكتبة: 96 كتابًا », 3 checkpoints on 30 / 50 / n — never 96, `knowledgeMapOpen`) ·
`content/prep.js` + `prep.test.js` (10 « أستعدّ » questions, easy → hard, `qasim-adad-tabii` and `qawaid-qabiliyat-qisma` to revise) ·
`content/books.js` (rounds: module 1 = 24 → 60 → 48 → ⭐ 36 → free; module 2 = 105 → ⭐ 84 → free; `easier` practice rounds) ·
`content/peerSheet.js` + test (« ورقة ريما »: tested numbers only, partners forgotten — 84 → 12 divisors) · modules 0, 1, 2 wired
(`PlayerSwitch` + `LabRounds`, `needsRound`). The « رتّب أفكارك » step does not exist in this lesson (nothing to drop); modules
3–7 needed no change (kit modules).

**What was added to the shared code:**
- `factor-pairs` v2 treatment (`FactorPairs.jsx`): prediction (≤ 2 per round, rectangle veiled), observe (`fill`) → build (`build`),
  trials table + pairs inside the lab, scene sized from `useMissionArea`, controls frozen during a question, `handDone`, `chains`,
  `predict`, `nChoices`, `levels={false}`, always guided in the player.
- `roundsModel`: goals `{ anyExact }`, `{ allPairs: n }` (tested). `LabRounds`: `icon`, `freeIcon`, `round.easier.helpLine`.
- `ContentModule`: `needsRound.icon`, `needsRound.won` (door and soft gate stop once the round is won).
- `primitives/PredictTray.jsx` (extracted from `TeamBuilder`, which now imports it).
- `mission/MissionScene.jsx` registry + `LibraryWallScene.jsx` (`mission.scene`); `MissionHome`, `MissionCheckpoint`, `MissionLayer`.
- `logic/factorPairs.rectangleLayout({ maxCell })`.

**Traps met (add to the plan's §7):**
- The player mounts a lab in a hidden measuring copy: a lab that sizes itself with a `ResizeObserver` keeps the hidden copy's width
  (200 px ruler, 160 px frame). Re-measure on every render as well (`FactorPairs`).
- A step that holds a round AND its question cannot declare `needsRound` alone: the door stays until the question is answered →
  `needsRound.won`.
- A lab played with `checkpoints: false` is not « guided » → the page's progress bar, hint buttons and « ماذا لاحظت؟ » card appear in
  the player (practice and free rounds). In the player a lab is always guided.
- The answers service returns `{ success, answers }` (not `data.answers`): a mocked server must match, or « restore after reload » looks broken.
- Never `rm` helper scripts created inside the repo from a shell with a heredoc: run the Playwright scripts from the scratchpad and import
  `playwright` with `createRequire('<repo>/apps/web/package.json')`.

**Verification:** `npx vitest run src/lessons` 601 files / 11 760 tests green (+ the new tests) · `npm run check:lessons` exit 0 (entry
239.0 KB gzip ≤ 245) · `lab-rollout-status --lesson qawasim-adad-tabii` ✅ · Playwright walk with a mocked student session at 1366×768,
1024×768 and 1920×1080: opening scene → « أستعدّ » (notice, 10 questions, signal, auto result, one priority lesson) → module 1 rounds
(r1 by hand with prediction + observe + build → ★★★ → « عُد إلى السؤال »; r2 with predictions, journal, pairs, « جرّب كل الإمكانيات »;
second chance after 2 wrong predictions and its return; challenge 36; free pitch) → module 2 (round 105 → stopping-rule questions;
fresh « أتوقّع القاعدة »; peer sheet: wrong line, fix, restore after reload from the server) → modules 3–6 unit by unit (0
`data-fit-overflow`, 0 page scroll) → final test (notice, 6 questions, result, profile) → knowledge map (full window, finger) → mission
home and path (real locks, practice station). Teacher view (`role: teacher`) and Classroom Mode: unchanged (no player, no rounds).

**Open on this lesson:** the Playwright e2e specs that exercise this lesson's old student view (`apps/web/e2e/lesson-kit/4am-aadad-tabiiya-natiqa.mjs`,
`manipulations.mjs`, `lab-coach.mjs`, `moyen-retrofit-phase1.mjs`, `predict-lesson.mjs`, `masail-lesson.mjs`, `knowledge-map.mjs`,
`progression.mjs`, `notebook-lesson.mjs`) are not rewritten (plan §9.7). `resources` in the config still describe the two-level labs for the
teacher's page. A phone layout is not built (laptop and tablet only).

## Lesson 3 — `khawass-qawasim` « خواص قواسم عدد طبيعي » (2026-11-08)

**What was written (per lesson):** `lesson.config.js` (`studentView: 'mission'`, `mission` with the new scene `construction-wall`, 4 tools =
`qasim-mushtarak-rappel`, `khassiya-1`, `khassiya-2`, `burhan-idha-fainna`, climax = module 5 « ورشة البناء: جداران بطوب 25 سم », 4 checkpoints that
speak of 6, 7, 30, 50 and n — never of the brick of 25 or the walls of 875 / 350, open knowledge map) · `content/prep.js` + `prep.test.js` (10
« أستعدّ » questions, easy → hard, `qasim-adad-tabii` and `qisma-iqlidiya-baqi` to revise) · `content/walls.js` + `walls.test.js` (rounds: 3 | 18 and 12
by hand with its questions → cases 2 and 3 of the activity in ONE round (`sequence`) → 9 | 900 and 90 → ⭐ 12 | 480 and 84 → free pitch with 7 case chips;
`easier` practice rounds) · `content/peerSheet.js` + test (« ورقة هند »: the converse of the property — 6 divides 48 = 40 + 8, so « 6 divides 40 and 8 ») ·
modules 0, 1, 2 wired. Modules 3–8 needed no change (kit modules).

**What was added to the shared code:**
- `divisor-properties` v2 treatment (`DivisorProperties.jsx`): props `onVerdict` (groups 1 = ألصق · 2 = انزع · 3 = قِس, +3 per case of a `sequence`),
  `levels`, `handDone` (each zone of the site becomes a button), `chains` (`['sum','diff','rem']`), `predict` (the shared `PredictTray`, « طوب كامل ؟ »
  before each wall), `choices` (free pitch), `sequence` (cases played one after the other inside one round); `CHAINS_PLAYER` = observe (`fill`) → « whole »
  question for the sum and the difference, observe → BUILD `a = b × k + r` (`build`) → rule for the remainder; the walls' labels `a = n × q` and the written results
  hide while a question is open; the journal « 📋 جدول تجاربك » (operation · length · whole bricks ✓) sits in the lab; controls freeze during a question;
  always guided in the player; no « كل المهام » celebration when the stepper is hidden.
- `mission/ConstructionWallScene.jsx` registered as `mission.scene: 'construction-wall'` (brick courses laid as tools are earned, a `KidFigure` apprentice).

**Traps met (add to the plan's §7):**
- A round without a `sequence` must report `groups` 1–3, not `seqIdx × 3 + …` with `seqIdx = −1` (verdicts were −2, −1, 0 and the round could never be won: the
  « جرّب أصغر » practice round never ended). Use `Math.max(seqIdx, 0)`; test every round type by playing it, not only the first.
- A heredoc-written patch with long Arabic text was refused twice by the shell safety check (it « could not be checked for dangerous rm »): write patch scripts
  and new files with the file tool, run them with `python3 <path>`.

**Verification:** `vitest run src/lessons` green (new: `prep.test`, `walls.test`, `peerSheet.test`, `divisorPropertiesPlayer.test`), `check:lessons` exit 0,
`lab-rollout-status --lesson khawass-qawasim` ✅, Playwright walk with a mocked student session at 1366×768, 1024×768 and 1920×1080: opening scene and home
(2 lessons to revise, real locks) → « أستعدّ » (10 questions, result) → round 1 by hand (observe, whole, observe, whole, observe, build, rule → ★★★ →
« عُد إلى السؤال ») → round 2 (« الحالة 1 من 2 » → 2, predictions, buttons, journal) → round 3 → second chance after 2 wrong predictions and its return → free pitch →
modules 1–7 unit by unit (0 `data-fit-overflow`, 0 page scroll) → peer sheet (wrong line, wrong fix, fix, restore after reload from the server) → final test
(5 questions, result, profile) → knowledge map → teacher view unchanged (no player, no rounds) and Classroom Mode unchanged.

**Open on this lesson:** the e2e specs that exercise its old student view are not rewritten (plan §9.7); `resources` in the config still describe the two-level labs
for the teacher's page.

## Lesson 4 — `qasim-mushtarak-akbar` « القاسم المشترك الأكبر لعددين طبيعيين » (2026-11-08)

**What was written (per lesson):** `lesson.config.js` (`studentView: 'mission'`, `mission` with the new scene `flower-shop`, 4 tools =
`qawasim-mushtaraka`, `pgcd-taarif`, `pgcd-ramz`, `qawasim-al-pgcd`, climax = module 4 « بائع الورود: 120 وردة حمراء و 84 وردة بيضاء », 3 checkpoints that
speak of 20, 30 and 10 — never of 120, 84 or their PGCD, open knowledge map) · `content/prep.js` + `prep.test.js` (10 « أستعدّ » questions, easy → hard,
« d يقسم n » and « كل قواسم عدد », `qasim-adad-tabii` and `qawasim-adad-tabii` to revise) · `content/bouquets.js` + `bouquets.test.js` (module 1: 12 balls and
18 shirts by hand with its questions → the activity's 90 red and 54 white flowers with predictions → the LISTS of 90 and 54 → ⭐ 60 and 45 → free shop with 6
pairs; module 2: the lists of 28 and 42 → ⭐ 45 and 75 → free lists; `easier` practice rounds; no pair has 12 as PGCD) · `content/peerSheet.js` + test
(« ورقة سلمى »: an incomplete list of the divisors of 30 — the partners 10 and 15 forgotten — gives PGCD(30 ; 45) = 5 instead of 15) · modules 0, 1, 2 wired
(module 2 gains step 5, the peer sheet). Modules 3–7 needed no change (kit modules).

**What was added to the shared code:**
- `common-divisors` v2 treatment (`CommonDivisors.jsx`): props `onVerdict` (each number of groups TRIED once, `{ groups: k, exact }`; in the lists, the PGCD
  placed is the verdict), `levels`, `handDone` (opens « جرّب كل الإمكانيات »), `chains` (`['groups', 'lists']`), `predict` (the shared `PredictTray` « هل يتوزّع
  الكل ؟ » before a NEW number of groups k ≥ 2, ≤ 2 per round), `choices` (pairs `{ a, b }` for the free shop); in the player a round is ONE stage (groups OR
  lists, `startWith`); `CHAINS_PLAYER` = groups: observe (`fill`: the greatest, per group of each item) → BUILD `a = k × q` (`build`, one extra tile) → beyond
  (`fill`) → rule; lists: count (`fill`) → why → rule; the journal « 📋 جدول تجاربك » (k · what is left of each item) in the lab's column; while a question is
  open the scene shows the distribution THE QUESTION is about (the greatest, then the first number beyond), not the last try, and its written per-group
  label is quiet; controls frozen during a prediction or a question; always guided; no celebration when the stepper is hidden.
- `useLabCheckpoint` returns `qid` (the question on screen) — a lab can show the scene a question speaks of.
- `roundsModel`: goal `{ above: g }` (a number of groups larger than g tried) — with `{ exact: g }` it is « the greatest is SEEN » (tested).
- `mission/FlowerShopScene.jsx` registered as `mission.scene: 'flower-shop'` (identical bouquets appear on the counter as tools are earned, two buckets
  empty, a `KidFigure` florist in hijab).

**Traps met (add to the plan's §7):**
- A question about « the greatest that worked » must not sit beside the LAST try (7 teams, 9 items left): the scene follows the question (`cp.qid`).
- A component that calls `t()` must declare `useTranslation` itself (`i18nHookScope.test.js`); passing `t` as a prop fails the suite.
- Playwright: a tap-carry onto a drop zone must click an EMPTY part of the zone — its centre may be a token, which selects that token instead of dropping.
- `vite build` with default node memory aborts on this repo; `check:lessons` builds with its own settings.

**Verification:** `vitest run src/lessons` green (new: `prep.test`, `bouquets.test`, `peerSheet.test`, `commonDivisorsPlayer.test`, `roundsModel` « above »),
`check:lessons` exit 0, `lab-rollout-status --lesson qasim-mushtarak-akbar` ✅, Playwright walk with a mocked student session at 1366×768, 1024×768 and
1920×1080: opening scene and home (1 lesson to revise, real locks) → « أستعدّ » (10 questions, review) → round 1 by hand (7 teams, observe 6 · 2 · 3, build
12 = 6 × 2, beyond 5, rule → ★★★) → round 2 (predictions right, 19 bouquets one by one ★★★, or « جرّب كل الإمكانيات » ★★) → second chance after 2 wrong
predictions (8 and 12) and its return → round 3 lists (6 commons, PGCD 18, 3 questions, ★★★, « عُد إلى السؤال ») → free shop (pairs, try all, journal) →
formative checkpoint after module 1 → module 2 lists round → peer sheet (wrong line, wrong fix, fix, restore after reload from the server) → modules 1–6 unit
by unit (0 `data-fit-overflow`, 0 page scroll) → final test (5 questions, result, profile) → knowledge map → teacher view unchanged (levels, no player, no
rounds) and Classroom Mode unchanged.

**Open on this lesson:** the e2e specs that exercise its old student view are not rewritten (plan §9.7); `resources` in the config still describe the two-level
labs for the teacher's page.

## Lesson 5 — `tayin-pgcd` « تعيين القاسم المشترك الأكبر لعددين طبيعيين » (2026-11-08)

**The first lesson whose lab family was ALREADY converted** (`common-divisors`, lesson 4): no shared lab code changed — only content and wiring.

**What was written (per lesson):** `lesson.config.js` (`studentView: 'mission'`, `mission` with the new scene `school-bags`, 3 tools = `tayin-bil-hasr`,
`nataij-mubashira`, `pgcd-idha-qasim` (label « أحدهما يقسم الآخر » — no Latin letters in a tool label, they reorder in RTL), climax = module 4 « حقائب
التضامن: 90 قلمًا و 126 كرّاسًا », 3 checkpoints on 12 / 20, 45 / 15 and the plan — never 90, 126 or 18, open knowledge map) · `content/prep.js` + test (10
« أستعدّ » questions: « كل قواسم عدد » and « PGCD », `qawasim-adad-tabii` and `qasim-mushtarak-akbar` to revise) · `content/bags.js` + test (8 pens and 12
notebooks by hand → 20 and 30 with predictions → the LISTS of 42 and 60 (the activity) → ⭐ 48 and 72 → free lists; `easier` rounds) · `content/peerSheet.js` +
test (« ورقة ياسين »: « PGCD(36 ; 9) = 36, the larger number » — fixed by « b divides a ⇒ PGCD(a ; b) = b ») · module 0 (ladder), module 1 (`PlayerSwitch` +
`LabRounds`, step 1 ← round 1, step 2 ← round 3), module 2 (no lab: the peer sheet becomes step 3). Modules 3–7 needed no change.

**Shared code:** `mission/SchoolBagsScene.jsx` registered as `mission.scene: 'school-bags'` (identical school bags fill on a table as tools are earned,
a `KidFigure` volunteer). Nothing else.

**Verification:** `vitest run src/lessons` green, `check:lessons` exit 0, `lab-rollout-status --lesson tayin-pgcd` ✅, Playwright walk with a mocked student
session at 1366×768, 1024×768 and 1920×1080: home (1 lesson to revise, real locks) → « أستعدّ » (10 questions, review) → round 1 by hand (observe 4 · 2 · 3,
build 8 = 4 × 2, beyond 3, rule → ★★★) → round 2 (predictions, 11 bags one by one → ★★★) → round 3 lists of 42 and 60 (4 commons, PGCD 6, 3 questions → ★★★,
« عُد إلى السؤال ») → peer sheet (wrong line, wrong fix, fix, restore after reload) → modules 1–6 unit by unit (0 `data-fit-overflow`, 0 page scroll) → final test
(4 questions, result, profile) → knowledge map → teacher view and Classroom Mode unchanged.

**Open on this lesson:** e2e specs of the old student view (plan §9.7); `resources` still describe the two-level labs for the teacher's page.

## Lesson 6 — `bahth-pgcd` « البحث عن القاسم المشترك الأكبر لعددين » (2026-11-09)

**Two labs converted at once** — `pgcd-differences` (module 1) and `euclidean-algorithm` (module 3) share one shape (a chain of steps, then the PGCD
placed), so they got the same v2 treatment.

**What was written (per lesson):** `lesson.config.js` (`studentView: 'mission'`, `mission` with the new scene `sewing-workshop`, 5 tools = `pgcd-farq`,
`khwarizmiyat-al-furuq`, `pgcd-baqi`, `khwarizmiyat-iqlidus`, `ikhtiyar-al-tariqa`, climax = module 5 « ورشة الخياطة: شريطان من 210 سم و 150 سم », 4
checkpoints on 35 / 20, 27 / 12, 49 / 14 and the plan — never 210, 150 or 30, open knowledge map) · `content/prep.js` + test (10 « أستعدّ » questions:
« خاصيتا القواسم » and « PGCD ونتائجه المباشرة », `khawass-qawasim` and `tayin-pgcd` to revise) · `content/ribbons.js` + test (module 1: 21 and 14 by hand →
252 and 140 with predictions → 378 and 315 → ⭐ 91 and 65 → free; module 3: 45 and 18 by hand → 765 and 135 with predictions → 3356 and 1528 → ⭐ 1938 and
836 → free; `easier` rounds; every pair passes the lab's own validation) · `content/peerSheet.js` + test (« ورقة مريم »: after 84 − 60 = 24 she computes
84 − 24 instead of 60 − 24 and the chain loops) · module 0 (ladder), modules 1 and 3 (`PlayerSwitch` + `LabRounds`; the steps that held a second lab now
wait for round 3 and show an evidence line in the player — the teacher page keeps its lab), module 2 (no lab: the peer sheet becomes step 4).

**What was added to the shared code:**
- `pgcd-differences` and `euclidean-algorithm` v2 treatment (`DifferenceAlgorithm.jsx`, `EuclidAlgorithm.jsx`): props `onVerdict` (the PGCD placed,
  `{ groups: v, exact }`; a refused PGCD box is a missed trial), `levels`, `handDone` (opens « أكمل الفروق » / « أكمل القسمات »), `chains`
  (`['cuts' | 'divs', 'pgcd']`), `predict` (the shared `PredictTray` at the START of a step — « كم سيبقى من الشريط الأكبر؟ » / « كم نسخة تدخل؟ », ≤ 2 per
  round), `choices`; `CHAINS_PLAYER` = count (`fill`) → BUILD the first step (`build`) → invariant, then stop → rule; the chain of steps is the journal
  « 📋 جدول تجاربك » in the lab's column (Euclid: one line per division plus the live equation — the page's two-column chain is too wide there); controls
  frozen during a prediction or a question; always guided; no celebration when the stepper is hidden.
- `LabCheckpoint` `build` questions take `ops` (the signs between slots, default `['=', '×', '+']`) — « 252 = 140 + 112 » uses `['=', '+']`.
- `mission/SewingWorkshopScene.jsx` registered as `mission.scene: 'sewing-workshop'` (two embroidered ribbons cut into equal pieces as tools are
  earned, a `KidFigure` seamstress in hijab).

**Traps met (add to the plan's §7):**
- A round goal for a lab whose steps are forced (cuts, divisions) must not count steps as trials: the verdict is the PGCD placement only, and
  `maxTrials: 1` means « right first time ».
- A page `representation` reused in the player's side column can be too wide (Euclid's two-column chain): render a one-column journal there.
- The scratchpad may be cleared between sessions: the walk library (mocked session) must give the user `nameComplete: true` and Arabic `firstName` /
  `lastName`, or the student is sent to « عرّفنا بنفسك » (`utils/personName.js › needsName`).

**Verification:** `vitest run src/lessons` green (new: `prep.test`, `ribbons.test`, `peerSheet.test`, `algorithmsPlayer.test`), `check:lessons` exit 0,
`lab-rollout-status --lesson bahth-pgcd` ✅, Playwright walk with a mocked student session: module 1 round 1 by hand (3 cuts, count 3, build 21 = 14 + 7,
invariant, PGCD 7, stop, rule → ★★★), round 2 (predictions 112 and 28, 6 cuts, PGCD 28 → ★★★, journal of 6 lines); module 3 round 1 by hand (copies,
overflow, carries, count 2, build 45 = 18 × 2 + 9, PGCD 9 → ★★★), round 2 (predictions 5 and 1, PGCD 45 → ★★★); home (2 of 5 tools), « أستعدّ » (10
questions, review), peer sheet (fix, restore after reload), final test, knowledge map; modules 1–7 unit by unit at 1366×768, 1024×768 and 1920×1080 (0
`data-fit-overflow`, 0 page scroll); teacher view (levels, no player, no rounds) and Classroom Mode unchanged. The BEM exam-sheet practice is not touched.

**Open on this lesson:** e2e specs of the old student view (plan §9.7); `resources` still describe the two-level labs for the teacher's page.

## Lesson 7 — `ikhtizal-kasr` « اختزال كسر » (2026-11-09)

**What was written (per lesson):** `lesson.config.js` (`studentView: 'mission'`, `mission` with the new scene `bakery`, 4 tools = `ikhtizal`,
`kasr-ghayr-qabil`, `ikhtizal-bil-pgcd`, `tahaqquq-al-ikhtizal`, climax = module 5 « عجينة الخبّاز: 105 ملاعق سكّر و 147 كوبًا من الدقيق », 4 checkpoints on
18/30, 20/32, 9/14 and the plan — never 105, 147 or 21, open knowledge map) · `content/prep.js` + test (10 « أستعدّ » questions: « الكسور المتساوية » and
« PGCD », `bahth-pgcd` to revise; the six statements of before stay in `textbook.js` as source) · `content/recipes.js` + test (module 1: 12/18 by hand →
Samir's 84/48 with predictions → ⭐ 126/90 → free kitchen; module 2: 84/48 with the one-step questions → 60/36 with predictions → ⭐ 595/560 → free; `easier`
rounds) · `content/peerSheet.js` + test (« ورقة رانية »: 36 ÷ 6 and 48 ÷ 4 — numerator and denominator divided by DIFFERENT numbers) · modules 0, 1 (both steps
wait for round 1), 2 (step 1 waits for round 1, the peer sheet becomes step 5).

**What was added to the shared code:**
- `fraction-reduction` v2 treatment (`FractionReduction.jsx`): props `onVerdict` (path B, the one division by the PGCD, `{ groups: k, exact }`; a refused path-B
  box or a premature « لا يمكن الاختزال أكثر » is a missed trial), `levels`, `chains` (`['steps', 'pgcd']`), `predict` (TWO predictions: before the first
  division « هل تتغيّر قيمة الكسر؟ », and at the start of path B « بأيّ عدد نقسم مرّة واحدة؟ »), `choices` (fractions `{ n, d }`); `CHAINS_PLAYER` = steps: count
  (`fill`) → BUILD the first division `n = k × n′` (`build`, `ops ['=', '×']`) → why stop; pgcd: one step → rule; the chain of reductions is the journal in the
  lab's column; controls frozen during a prediction or a question; always guided; no celebration when the stepper is hidden.
- `mission/BakeryScene.jsx` registered as `mission.scene: 'bakery'` (identical dough portions appear on a tray as tools are earned, a `KidFigure` baker).

**Traps met:** a patch anchored on a line that occurs twice (`const cmp = L.pathComparison(lab);` is in the component AND in a question) must anchor on
its context; a patch script that edits several files must not be re-run whole after a partial failure — re-run only the files it did not reach.

**Verification:** `vitest run src/lessons` green (new: `prep.test`, `recipes.test`, `peerSheet.test`, `fractionReductionPlayer.test`), `check:lessons` exit 0,
`lab-rollout-status --lesson ikhtizal-kasr` ✅, Playwright walk with a mocked student session: module 1 round 1 by hand (÷ 2, ÷ 3, claim, count 2, build
12 = 2 × 6, why, path B ÷ 6, one step, rule → ★★★), round 2 (predictions « same » and « 12 », ÷ 4, ÷ 3, path B ÷ 12 → ★★★); module 2 round 1 (path B ÷ 12, one step,
rule → ★★★); home (2 of 4 tools), « أستعدّ » (10 questions, review), peer sheet (fix, restore after reload), final test (5 questions), knowledge map; modules
1–7 unit by unit at 1366×768, 1024×768 and 1920×1080 (0 `data-fit-overflow`, 0 page scroll); teacher view and Classroom Mode unchanged.

**Open on this lesson:** e2e specs of the old student view (plan §9.7); `resources` still describe the two-level labs for the teacher's page.

## Cross-lesson fix — the guide and the « أستعدّ » card (2026-11-09, owner)

Applies to every converted lesson (and, for the card, to every lesson's « أستعدّ » and « إختبار أولي »):
- **« المرشد » (LabCoach) in the player:** the player's look (wider bubble, larger text, thick « فهمت », amber icon and ring) and an always-visible
  « 💡 المرشد » pill — under the goal line, and in the side column's top bar while a question or prediction is open. `pgcd-differences`,
  `euclidean-algorithm` and `fraction-reduction` had NO coach: they got one (pure `coachOf` + strings + test). Contract: `MANIPULATION_CONTRACT.md`
  §8quater. Checked: the pill and the new bubble on the 11 lab modules of the 7 converted lessons at 1366×768 and 1024×768, 0 overflow, 0 scroll.
- **The play question never moves:** the « أحسنت » / « سنعود إليه » signal is a stamp over the card, the undo bar has a fixed row, « غير متأكّد » keeps
  its place (`kit/DiagnosticPlayQuestion.jsx`, guide §4septies). Checked: card top and options top identical before, during the undo second and
  under the signal.
- **The guide's ring was misplaced** (owner, 2026-11-09): the player zooms its content (`FitToArea`, CSS `zoom`), and `CoachOverlay` placed the ring
  and the bubble with screen pixels inside the zoomed layer (zoomed twice). Fixed by dividing by the layer's scale; the SAME error made the
  factor-pairs ruler (`useStretchInteraction`) pick the wrong width under zoom (tick 6 → 2) — fixed the same way. Rule and checks:
  `MANIPULATION_CONTRACT.md` §8quater « Screen pixels vs layer pixels ».
- **The build question names the item** (owner, 2026-11-09): in `common-divisors` the « build » question said « العدد الكلّي / عدد المجموعات »
  without saying whether the balls or the shirts were meant. Themes now carry DEFINITE forms (`themes.<id>.theA / theB / theGroups`, read by
  `themeWords`, falling back to the bare words): « ابنِ المساواة التي يقولها توزيع الكرات — لا القمصان », slots « كل الكرات = عدد الفرق × كرات في كل
  فريق »; the extra tile is the other item's count per group.
- **A memo rule never gets cut** (owner, 2026-11-09): the rule of an end-of-module memo card (`knowledge/MemoCard.jsx`) was centred in a box too
  narrow for it, cut on BOTH sides with a scrollbar (`d∣a ∧ d∣b ⟺ d∣PGCD(a ; b)`). The rule and the example now go through
  `components/FitLine.jsx` (one line that lowers its font size just enough to fit, ≥ 0.55; layout pixels, zoom-safe). Checked: 94 %, inside, no
  scrollbar at 1366×768 and 1920×1080.
- **The mission home uses the width** (owner, 2026-11-09): mission card → « مسار المهمة » → « راجع قبل أن تنطلق » and « ابدأ التمارين » side by side
  (`MissionHome`, `[data-mission-home-row]`; « راجع » lists in one column there). Checked on the 7 converted lessons at 1920×1080, 1366×768 and
  1024×768: order, two equal cards, no page scroll, 0 overflow.
- **The mission home redesigned** (owner, 2026-11-09: « more clear, attractive, motivated »): first visit = question bubble beside the scene, its numbers
  highlighted, duration / tools / big problem, the tools to collect, one CTA, a slim « قبل أن تبدأ »; return = one big « التالي » card (station, what to do,
  time, « المهمة الكبرى بعد N محطّات », « واصل ») beside the scene with a tools ring and stars, then the path (« ✓ k من N »), then revise + exercises side by
  side. Guide § « Mission player » (`MissionHome` row). Checked on `qasim-mushtarak-akbar` and `qasim-adad-tabii` at 1366×768, 1920×1080, 1024×768:
  no scroll, 0 overflow, no console error.
- **The return home v2 — no « التالي » card, the screen filled** (owner, 2026-11-09: the separate next card was not needed and the home was shrunk
  by the player's fit, so the student had to zoom): ONE wide hero card (scene + title, ⭐, tools ring, tool chips, ONE big « واصل: <station> »,
  « 📝 التمارين » → `/espace/pratique/<lesson>` when practice is active), then « مسار المهمة », then « قبل أن تبدأ » and the two small links on ONE
  row (`[data-mission-home-foot]`). The `PracticeEntryCard` left the home (practice is the button and the path's last station). Being short, the home
  is now ENLARGED by `FitToArea`: zoom 1–1.04 at 1366×768 and 1024×768, 1.46–1.51 at 1920×1080 (was 0.85–0.92), no scroll, 0 overflow, on
  `qasim-mushtarak-akbar` and `qasim-adad-tabii`.
