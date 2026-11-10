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
| 8 | `awwaliyan-fima-baynahuma` | `coprime-explorer` (v2 treatment, new) | ✅ done 2026-11-09 | `feat(lessons): awwaliyan-fima-baynahuma — mission prototype` | See « Lesson 8 » below. |
| 9 | `wadiya-idmajiya-aadad` | — | ⏳ next in catalogue order | | |

Catalogue order: `packages/core/curriculum/dz/lessons_4am_2026_2027.json`. Units 2–14 are not started. The full prompt for unit 2 « الحساب على الجذور » (every rule, check and review step of unit 1): `docs/reports/UNIT2_HISAB_JUDHUR_MISSION_PROMPT.md`. Still open in unit 1: its synthesis `wadiya-idmajiya-aadad` (no synthesis recipe yet — the prompt's §5).

## Unit 2 « الحساب على الجذور » — the table

Prompt for the whole unit: `UNIT2_HISAB_JUDHUR_MISSION_PROMPT.md`. Folder `lessons/moyen/4am/ansab_al_aadad_wal_hisab/hisab-judhur/`.

| # | Lesson (unit 2) | Labs converted | Status | Commit | Notes |
|---|---|---|---|---|---|
| 1 | `jidhr-tarbii` | `square-root-side` (v2 treatment, new, both modes) | ✅ done 2026-11-09 | `feat(lessons): jidhr-tarbii — mission prototype` | See « Unit 2, lesson 1 » below. |
| 2 | `natiqa-ghayr-natiqa` | `square-root-side` (graduation mode; `truthful` « resists », compact rule, plain journal) | ✅ done 2026-11-09 | `feat(lessons): natiqa-ghayr-natiqa — mission prototype` | See « Unit 2, lesson 2 » below. |
| 3 | `muadalat-x-murabba` | `square-fold` (v2 treatment + LabCoach, new; exact-only pin in the player) | ✅ done 2026-11-10 | `feat(lessons): muadalat-x-murabba — mission prototype` | See « Unit 2, lesson 3 » below. |
| 4 | `amaliyat-judhur` | `square-tiling` (v2 treatment + LabCoach, new; both modes `product` and `simplest`) | ✅ done 2026-11-10 | `feat(lessons): amaliyat-judhur — mission prototype` | See « Unit 2, lesson 4 » below. |
| 5 | `tawzif-khawass-judhur` | `square-tiling` | ⏳ | | content only after lesson 4 |
| S | `wadiya-idmajiya-judhur` | — | ⏳ council first (prompt §5) | | |

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
| `coprime-explorer` | ✅ (2026-11-09) | `awwaliyan-fima-baynahuma` |
| `square-root-side` | ✅ (2026-11-09, both modes `refine` and `graduation`) | `jidhr-tarbii` (unit 2) |
| `square-fold` | ✅ (2026-11-10) | `muadalat-x-murabba` (unit 2) |
| `square-tiling` | ✅ (2026-11-10, both modes `product` and `simplest`) | `amaliyat-judhur` (unit 2) |
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

## Lesson 8 — `awwaliyan-fima-baynahuma` « العددان الأوّليّان فيما بينهما » (2026-11-09)

**What was written (per lesson):** `lesson.config.js` (`studentView: 'mission'`, `mission` with the new scene `math-club`, title « لعبة الزوج الرابح », 4 tools =
`awwaliyan-taarif`, `nafy-awwaliyan`, `laysa-awwali`, `ithbat-awwaliyan`, climax = module 4 « مسألة الدرس » (26 و 45، 39 و 65 and سلمى's claim), 3 checkpoints on
14/15, 34/51 and the plan — never 26, 45, 39, 65 or 13, open knowledge map) · `content/prep.js` + test (10 « أستعدّ » questions: « PGCD وخوارزمية إقليدس » to revise
with `bahth-pgcd`, « قواعد قابلية القسمة » with `qawaid-qabiliyat-qisma`; the five statements of before stay in `textbook.js`) · `content/kits.js` + test
(module 1, the kits: 8 and 9 by hand with the questions → 17 and 18 with predictions and « جرّب كل الإمكانيات » → ⭐ 21 and 28 → free; module 2, the lists: 15 and
22 with the questions → 35 and 48 with one prediction → ⭐ 51 and 85 → free; `easier` rounds) · `content/peerSheet.js` + test (« ورقة أنس »: 8 and 15 are not prime,
« so they are not coprime » — the couple's property confused with each number's) · modules 0, 1 (both steps wait for round 2, 17 and 18), 2 (step 1 waits for
round 1, the peer sheet is step 3). The mission draws numbered TILES, never playing cards (CLAUDE.md, respect of values).

**What was added to the shared code:**
- `coprime-explorer` v2 treatment (`CoprimeExplorer.jsx`, see `MANIPULATION_CONTRACT.md` « Seventh example ») and its first `LabCoach` (`logic/coprime.js ›
  coachOf`); `GroupTrials` exported by `CommonDivisors.jsx` and reused; the check button carries `[data-manipulation-check]` (`Btn` passes `data-*`).
- `mission/MathClubScene.jsx` registered as `mission.scene: 'math-club'` (four pairs of tiles go from « ? » to « ✓ » as tools are earned; a `KidFigure` in hijab).

**Traps met:** a string whose value is already wrapped in `$…$` must not be wrapped again in the translation (`$$2$$` renders as display math on its own line);
`PredictTray` shows plain text — no `$` in a prediction prompt; in a lists round the win dialog offers « عُد إلى السؤال » (the step waiting for it), not « next
round ».

**Verification:** `vitest run` of the unit, `common/mission` and `common/manipulations` green (295 files, 4 335 tests; new: `prep.test`, `kits.test`,
`peerSheet.test`, `coprimePlayer.test`), `check:lessons` exit 0 (entry 240.7 KB ≤ 245), `lab-rollout-status --lesson awwaliyan-fima-baynahuma` ✅, Playwright walk
with a mocked student session: module 1 round 1 by hand (8 kits, count 0, build 9 = 2 × 4 + 1, rule → ★★★), round 2 (two predictions, « جرّب كل الإمكانيات » →
★★★); module 2 round 1 (four chips, « تحقّق », count 4, commons, rule → ★★★), round 2 (prediction tray first, four chips, « تحقّق » → ★★★, prediction result shown);
home first visit and return (scene `math-club`, 4 tools); modules 1–7 unit by unit at 1366×768, 1024×768 and 1920×1080 (0 `data-fit-overflow`, 0 page scroll,
no console error); teacher view and Classroom Mode unchanged.

**Open on this lesson:** e2e specs of the old student view (plan §9.7); `resources` still describe the two-level labs for the teacher's page; the module-1 station
label still reads « 17 و 18، 22 و 35، ومريم » (22 and 35 now live only in the teacher's متقدم level).

## The unit page — student view of a converted unit (2026-11-09, owner)

The unit page showed everything at once (6 000 px: الكفاءات, prerequisites, labs and textbook pages of every lesson). The owner approved the
mockup `docs/experiments/unit-home-mockup-2026-11-09.html`, then the council chose a centred window over the side drawer, and the owner asked for a
wider window with a centred title, no empty sides on wide screens, and no scrolling on a laptop. Built as `pages/unit/UnitMissionView.jsx` (guide §
« Mission player », row `UnitMissionView`) for unit 1 « الأعداد الطبيعيّة والأعداد النّاطقة »; content in `pages/unit/unitMissions.js`.

**Rule (owner):** each time ALL lessons of a unit are converted, write its entry in `unitMissions.js` (station icons and short labels, the challenge
rewritten in the platform's words, the keys, the history note) — the unit's students then get this page. The teacher keeps the detailed page.

**Verification:** `unitMissions.test.js`; `node apps/web/e2e/unit-mission-view.mjs` passes at 1366×768, 1024×768 (sidebar open and collapsed),
1920×1080 and 1856×959: no page scroll, nothing cut on the sides, every lesson window and chip window fits folded and unfolded, the teacher keeps the
old page. The student tour `student.unit` targets both pages; its two lines that cited the textbook were rewritten.

## Cross-lesson fix — the main button on the right (2026-11-09, owner)

On the lesson home the big « واصل » was in the LEFT column (x ≈ 460 at 1366 px) while the unit page's « واصل الدرس » is on the right (x ≈ 877): the
student crossed the screen between two clicks. `MissionHome` now puts its text column and « واصل » on the RIGHT and the scene on the left (x ≈ 906), and the
first visit's CTA is aligned right (x ≈ 938). Applies to every converted lesson (shared component). The player's bottom bar keeps the RTL convention
— « واصل » on the left, « السابق » on the right (owner: tried and refused the same day).

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

## Unit 2, lesson 1 — `jidhr-tarbii` « الجذر التربيعي لعدد موجب » (2026-11-09)

**Council (2026-11-09) on the lab's player design** — five advisors, verdict applied: keep BUILDING an inequality for a side that never lands
(« 4 < 5 < 9 » is the bracket the hand made; « 2 × 2 = 4 » adds nothing); the yes/no prediction « lands on a tick? » becomes a pattern after one
« no » on area 5, so it is asked at graduation 1 and at 0,01 only, and 2,25 (« no » at 1, « yes » at 0,1 — the prediction that FLIPS) is a REQUIRED
round right after 5; « will a finer graduation EVER land? » cannot be proven by doing, so the old « zoom » choice is replaced in the player by an
OBSERVABLE fact — « c has k decimals → c² has 2k, its last digit is never 0, so c² is never the whole number 5 »; the « few trials » star is a
per-graduation budget (bisection ≈ 4 releases per refined graduation); graduation mode asks the « resists » question only after a card really
resisted and names graduations « 1/3 », never a bare g. Rejected: a « digit prediction » (0–9) at each graduation (more UI than the lesson needs) and
coprime denominators for `resists` (the lab's own `cardStatus` already decides it).

**What was written (per lesson):** `lesson.config.js` (`studentView: 'mission'`, `mission` with the new scene `garden-bed`, title « حوض الأزهار على الوتر »,
4 tools = `qima-mudbuta`, `jidhr-taarif`, `murabba-jidhr`, `jidhr-murabba`, climax = module 4 (the flower bed on the hypotenuse of a 3 م / 5 م corner), 3
checkpoints on 7, 11 and √20 — never 34, √34, the 3 / 5 sides or 5,83…, open knowledge map; the opening writes « م », not « m », so « 5 م. » cannot
bidi-scramble) · `content/prep.js` + test (10 « أستعدّ » questions: « مربع عدد » with `quwat-adad-nisbi` and « خاصية فيثاغورس » with
`khassiyat-fitaghuras` to revise; a formula-only statement has no final period — it jumps left in RTL; the six statements of before stay in
`textbook.js`) · `content/squares.js` + test (module 1: 16 by hand → 5 to 0,001 with two predictions → 2,25 → ⭐ 20 to 0,01 → free garden; module 2:
0,04 → ⭐ 1,69 → free; `easier` rounds 4, 2, 0,25, 0,01) · `content/peerSheet.js` + test (« ورقة إلياس »: « 0,06 × 0,06 = 0,36 » so « √0,36 = 0,06 » — the
square of a decimal) · modules 0, 1 (steps 1–3 wait for round 2, whose trials still fill step 3's evidence through `onTrial`; « المستوى المتقدّم »
became « المختبر » in three lines), 2 (step 1 waits for round 1, the peer sheet is step 4) · the catalogue: `prerequisiteLessonCodes` =
`quwat-adad-nisbi`, `khassiyat-fitaghuras` (the net's `requires` links; the two free-text prerequisites they replace are removed — same rule as
`qasim-adad-tabii`), without which « راجع قبل أن تنطلق » and the review's priority card were empty.

**What was added to the shared code:**
- `square-root-side` v2 treatment (`roots/SquareRootSide.jsx`, contract « Eighth example ») and its first `LabCoach` (`logic/squareRootSide.js › coachOf`:
  the handle → again → « دقّق » / another graduation → another card; never a value). Pure helpers `landsAt`, `landsSomewhere`, `decimalsOf`, `cellOf`.
- `roundsModel`: goals `{ bracketed: g }` and `{ resists: true }`, fed by the lab's `onTrial { tk: 'bracket', card, scale, resisting }` (tested).
- `mission/GardenBedScene.jsx` registered as `mission.scene: 'garden-bed'` (a right-triangle corner; the square bed on its hypotenuse fills with rows of
  flowers as tools are earned, its stone frame closes at the end; a `KidFigure` gardener).
- `BatchChoiceQuestion rowCols` (default 1): `TextbookExercise` lays a batch of ≥ 6 rows on two columns INSIDE the player only, as one designed screen
  (`data-paging-keep`) — module 3's exercises 3 and 5 (7 rows) were 524 px in a 497 px area at 1024×768 (`data-fit-overflow`). Applies to every converted
  lesson; the page and the teacher are unchanged.
- `coprimePlayer.test.jsx`: `RAW` → `rawKey` (the static i18n-scope scanner read an upper-case `const` as a component calling `t()` — the suite was red on HEAD).

**Traps met:**
- A chain chosen by what is FOUND hides the stepper of an exact area until the side lands (0,04 is first bracketed between 0 and 1): in the player the
  chain follows the computed TRUTH (`truthKeyOf`), and the « exact » chain opens when the side lands.
- A prediction this lab cannot judge at once (the ruler answers later) is judged by the computed truth when it is made (the star), and its result is SHOWN
  when the graduation has decided.
- A Python patch script with `\\times` in a normal string writes `\times` → a TAB in a JS template string (`\t`): one formula and seven config strings lost
  their backslash (`check:katex` caught the config; a test now asserts the built equality keeps ` \\times `).
- A long list made two-column grows rows ≥ 110 px, and the player then pages it ONE ROW per screen: mark the grid `data-paging-keep`.
- The coach bubble sits over the −/+ buttons until « فهمت » (once per tip): a walk must tap it before using them.
- A lab whose rule explanation lists every step (four brackets) overflows the side column at 1024×768 once the answer opens, and again in the
  formal block after the win: in the player both are compact (the last bracket only).

**Verification:** `vitest run src/lessons` 631 files / 11 924 tests green after the fixes (new: `prep.test`, `squares.test`, `peerSheet.test`,
`squareRootPlayer.test`, `roundsModel` « bracketed / resists »), `check:lessons` exit 0 (entry 241.3 KB ≤ 245), `lab-rollout-status --lesson jidhr-tarbii` ✅,
Playwright walk with a mocked student session: module 1 round 1 by hand (16 → 4, fill 4, build 16 = 4 × 4, rule → ★★★), round 2 (prediction « no » at 1,
bracket 2 / 3, fill, build 4 < 5 < 9, prediction « no » at 0,01, down to 2,236 / 2,237, decimals 6, rule → ★★★, « عُد إلى السؤال »), round 3 (no → yes, 1,5 →
★★★), challenge 20 (4,47 / 4,48 → ★★★), free garden (choices, « جرّب كل الإمكانيات »), the « easier » round after five misses (4 → back to round 1);
module 2 round 1 (0 / 1, then 0,2 → fill, build, rule → ★★★); peer sheet (wrong line, wrong fix, fix, restored after reload with its chip); home first visit
and return, « أستعدّ » (notice, 10 questions, one-screen review with « خاصية فيثاغورس » as the priority lesson), final test (5 questions, review), knowledge
map; modules 1–7 unit by unit at 1366×768, 1024×768 and 1920×1080 (0 `data-fit-overflow`, 0 page scroll, no console error); teacher view unchanged (no
player, no rounds, the two levels) and Classroom Mode untouched.

**ECC review (react, code, a11y — 2026-11-09), fixed:** the free-round chip kept no graduation (`setNumbers` now keeps `scale`); the coach could show
over an open question on the page (`!cp.open`); « إعادة » left the round's log full — the lab now reports `{ tk: 'reset' }` and `logEvent` empties the log
(tested); releasing on the same value counted as a new trial; the third checkpoint (√20 → its area) was the climax's own operation and named the plan —
now « √(9²) »; five student-visible lines sent to the textbook (modules 1–3, module 3's map `desc`); « {{n}} أرقام » with n = 1 or 2 (now « عدد أرقامه… »);
the card ✓ / ✗ is `aria-hidden` with a screen-reader word, the frozen handle is `aria-disabled`, every « {,} » becomes a comma in labels (`replaceAll`),
the journal's headers have `scope="col"`, the scene is `aria-hidden` without a label, and two columns of a long batch apply from `lg` only (a
768-px tablet keeps one). **Kept, with reason:** `alat-hasiba-jidhr` stays in `priorKnowledge` — module 1's calculator question `requires` it (the
audit needs every literal `requires` declared); the release verdict is already announced by the shell's live representation (`aria-live`). Rejected by
the coordinator: two « no » predictions on area 5 (council decision; round 3 gives the « yes »), the unused `resists` goal (lesson 2's groundwork).

**Open on this lesson:** the unit-1 labs do not report `{ tk: 'reset' }` yet; e2e specs of the old student view (plan §9.7); `resources` still describe the two-level labs for the teacher's page; the API's
catalogue import is not re-run for the new `prerequisiteLessonCodes` (local database: owner's publish step).

## Unit 2, lesson 2 — `natiqa-ghayr-natiqa` « الأعداد الناطقة والأعداد غير الناطقة » (2026-11-09)

**Council (2026-11-09) on the graduation-mode rounds** — five lenses (contrarian, first principles, expansionist, outsider, executor) run inline by the
lesson's agent, with a peer-review pass and a chairman synthesis. Agreed: (1) a « resists » verdict must be TRUE — the lab's rule « three graduations
bracketed without landing » marks 16/9 ✗ after 1/1, 1/2, 1/4, and the question then says « it will never land »; in the player a card whose side lands on
an offered graduation never resists (`init({ truthful })`), and no round offers a rational card a ruler too short for it (test); (2) every round has one
card that lands and one that never does, and its two predictions have DIFFERENT truths, with the card open at the start alternating « no » / « yes » /
« no » across rounds — always answering « no » cannot win the star; (3) round 1 is small and played with the full `grad` chain (read the ruler → BUILD
« 16 = 4 × 4 » → the card that resisted → the rule); the activity's numbers come second with predictions; 16/9 (it needs 1/3) is a REQUIRED round;
(4) the challenge asks for the right ruler at once (49/36 → 1/6: « the denominator tells you »). Clash: the expansionist wanted a ruler-choice
prediction (« on which ruler? ») instead of yes/no — rejected for now (one more tray type; the yes/no with varied truth already makes the student
think); the contrarian wanted `truthful` on the page too — kept player-only (the page is unchanged by rule; noted below as open).

**What was written (per lesson):** `lesson.config.js` (`studentView: 'mission'`, `mission` with the new scene `carpet-loom`, title « ثلاث زرابي مربّعة »,
3 tools = `murabba-natiq`, `ghayr-natiq`, `qima-muqarraba`, climax = module 4 (the three square carpets: 2,89 م², 4 م² of 9 pieces, 3 م²; wool ribbon at
500 دج), 3 checkpoints on √(49/25), « which is not rational: √11, √0,36, √(1/25) » and the lower value of √7 to 0,1 — never 2,89, 1,7, 4, the 9 pieces, 3,
√3, 1,74 or 500; open knowledge map; three module `desc` lines no longer cite the textbook) · `content/prep.js` + test (10 « أستعدّ » questions:
« العدد الناطق » with `adad-natiq` (3AM) and « الجذر التربيعي » with `jidhr-tarbii` to revise; the five statements of before stay in `textbook.js`) ·
`content/rulers.js` + test (module 1, graduation mode: 16 and 2 by hand to 1/4 → 7 and 0,25 to 1/6 with predictions → 16/9 and 13 to 1/6 → ⭐ 25/13 and
49/36 to 1/8 → free workshop of the activity's six areas to 1/12; `easier` rounds on rulers to 1/3: 1 and 2, 0,25 and 2, 1/9 and 5; every goal is checked
by PLAYING it in the test) · `content/peerSheet.js` + test (« ورقة يونس »: « 49 = 7², so √(49/20) is rational » — judging the numerator alone; fixes: the
denominator 20 is not a square, « √(49/20) = 7/10 » (half of 20), « the calculator shows 1,565247584 »; every number computed) · modules 0 (the ladder),
1 (`PlayerSwitch` + `LabRounds labId="m1-rulers"`; steps 1 and 2 wait for round 2, whose trials still fill the evidence; the TextbookBox's « typo
corrected in the textbook » note and the brick lead « يقوله الكتاب » are gone), 2 (no lab; « ورقة يونس » is step 4; tag and lead no longer cite the
textbook), 3 (step titles lose the textbook's exercise numbers; subtitle and tag no longer cite pages).

**What was added to the shared code:**
- `logic/squareRootSide.js › init({ truthful })` and `cardStatus`: in the player a rational card never « resists » (`SquareRootSide` passes
  `truthful: gameScreen`; the page keeps its three-graduation rule).
- `roots/SquareRootSide.jsx`: the graduation rule's explanation is compact in the player (the rule alone); the journal writes a fraction square
  plainly — `squareLine`: « (5/4)² = 25/16 », never raw `\dfrac` nor « 5/4² »; the square's `aria-label` uses the same plain text.
- `kit/ContentModule.jsx`: the player's bottom button « العب الجولة … » now turns into « واصل » as soon as the round is won (`needsRound.won` was missing
  from the `playNav` memo — the button stayed stale in every converted lesson).
- `mission/CarpetLoomScene.jsx` registered as `mission.scene: 'carpet-loom'` (a loom; the square carpet is woven row by row with diamond motifs as tools
  are earned, its border and fringes close at the end; a `KidFigure` weaver in hijab beside a measuring tape, no number drawn).

**Traps met:**
- An inequality chain inside Arabic prose (« ($16 < 20 < 25$) ») reads mirrored: write the two neighbouring squares one by one (« $4^2 = 16$ و
  $5^2 = 25$ »).
- A walk that answers a choice question wrongly twice triggers « لا بأس — جرّب أصغر » on the round (two misses): expected behaviour, not a bug.
- Edits during a walk hot-reload the page and can log a one-off `MissionLayer` error (`?t=` in the stack): re-run before believing it.

**Verification:** `vitest run src/lessons` 635 files / 11 951 tests green (new: `prep.test`, `rulers.test`, `peerSheet.test`, `mission.test`, `roundsModel` « jumpTarget », two `squareRootPlayer`
tests — `truthful` « resists » and the plain journal), `check:lessons` exit 0 (entry 241.2 KB ≤ 245), `lab-rollout-status --lesson natiqa-ghayr-natiqa` ✅, Playwright (mocked student session) at 1366×768, 1024×768 and 1920×1080: every round of module 1 ★★★ (r1 by hand with fill, build,
« resists » and rule; r2 « no » then « yes »; r3 with 16/9 bracketed on three wrong rulers staying open, then landing on 1/3; challenge; free workshop of six
cards), the reset path (wrong prediction → « إعادة » → clean play ★★★), the « easier » round after two wrong predictions and back, module 2's peer sheet
(wrong fix, fix, restored after reload), home first visit and return, « أستعدّ » (10 questions, review), final test, knowledge map, modules 1–7 unit by unit
(0 `data-fit-overflow`, 0 page scroll, no console error), teacher view unchanged.

**ECC review (react, code, a11y — 2026-11-09), fixed:** step 2 could become impossible — its rule flag lived in memory and only round 1 carries the
« rule » chain: it now also reads round 1's stored stars (`won.r1`) and a SAVED copy (`useSavedAnswer` key `lab-rulers`, with the trials, so the evidence
no longer says « لم تجرّبه بعد » after a reload); the module's door « العب الجولة 2 » could skip an unplayed round 1 — `LabRounds` now jumps through
`roundsModel › jumpTarget` (a closed round leads to the first required round not won; tested; shared by every converted lesson); the same reload gap in
lesson 1's step-3 evidence is closed the same way (`lab-squares`), and its step 6 lost a « (ص 30) »; the checkpoint after module 2 used 3² = 9 and
4² = 16 (the climax's numbers and its bracketing of √3) — now « 11 is a whole number that is no whole number's square » and √(1/25), with a test that no
checkpoint uses a climax number or a textbook line (`content/mission.test.js`); the teacher-facing `resources` lines no longer say « الكتاب »; the peer
sheet's conclusion is corrected too (`fixedLines`), and its fix no longer puts a formula inside parentheses; a11y of the lab: the 1/g buttons' name
starts with the visible « 1/g » (and « مسطرة مدرّجة بالجزء من g من الوحدة » replaces a wrong plural), focus rings indigo-600 with an offset, the selected
ruler sky-700, the « too small » colour amber-700 (#B45309), the journal is a table labelled by its heading with row headers and « — » for empty cells,
the choices row is a labelled group with `aria-pressed`, the value pill is `aria-hidden` (the slider says it), and the prediction result fills an
always-mounted live region. **Kept:** `qima-mudbuta` in `priorKnowledge` (modules 2–3 and the problems `require` it). **Rejected by the coordinator:**
`disabled` → `aria-disabled` on every control (a pattern across every lab — out of scope), the √7 checkpoint (the lesson's own skill, other numbers).

**Open on this lesson:** `truthful` « resists » is player-only — the page still marks a rational card ✗ after three wrong rulers (owner's call); the
`resources` still describe the two-level lab for the teacher's page; e2e specs of the old student view.

## Unit 2, lesson 3 — `muadalat-x-murabba` « حل المعادلة من الشكل x² = a » (2026-11-10)

**Council (2026-11-10, a real council: 5 advisors, 5 anonymous peer reviews, chairman)** on how `square-fold` lives in the player. Verdict applied:
- **The irrational-root pin (the first change).** In the player a graduation NEXT to √3 is never accepted as a value: pinning 1,7 for x² = 3 answers
  « $1{,}7^2 = 2{,}89 \neq 3$ — لا تدريجة تعطي 3 بالضبط » (computed), then a distinct exact mark √3 appears between the ticks and the student pins it
  deliberately (« ثبّت √3 » — the pin is √3, never 1,7); −√3 the same way. That first nearest-tick try, on each side of zero, is the intended discovery and
  is NOT a trial. The page keeps its behaviour (the nearest tick pins √3 directly).
- **Chains.** r1: the full chain — the square of the pinned solution and the relation (opposites) by a tap, the number of solutions by a tap for 0 and
  for a < 0, then at the third sign BUILD « x² = a ⇔ x = √a أو x = −√a » (« يعني » beside ⇔) and the rule. r2: one tap question on the predicted cards
  only. r3: one build after √3 is pinned (its decoy tile is the nearest tick 1,7). Early in r1 a refused arrow (a < 0) visibly bounces off the hatched half.
- **Goal.** One new goal `{ solvedAll: n }` (reuses the `exact` set of `allExact`) — tested. Refused pins and a wrong « لا حل » are trials; the
  first nearest-tick beat and a repeated identical refusal are not.
- **Predictions.** r1 (4, 0, −4) « كم حلًّا ؟ » on cards 1 and 2 → 2 / 1; r2 reordered −9, 0,04, 1,44, 0 → 0 / 2; r3 (3, 2,25) « هل تقع تدريجة على
  حلّ ؟ » → no / yes. A test checks the truths differ in every round.
- **Rounds.** r1 4, 0, −4 at 1/2 with the table of squares in the journal; r2 −9, 0,04, 1,44, 0 at 1/10 (25 replaced by 1,44); r3 required 3 and 2,25;
  ⭐ 1,21, 7, −0,5, 0; free 9, 2, −1, 6,25, 0, −16; easier rounds 1, 0, −1 (and 2, 1 for r3) on the unit line. a = 0 in r1, r2, ⭐ and free — not in r3.
- **Checkpoints.** « x² = 49 ? x² = −49 ? » (2 / 0); « as a shrinks, where do the two pins meet? » (at 0); « (−2,5)² — where does the arrow land? »
  (6,25). No ±, no exact-√ fix, no climax number — `content/mission.test.js` also checks what the rounds SHOW (cards, leads).
- **Scene.** A folding paper strip at a school science fair, two `KidFigure` pupils (a girl in hijab, a boy), no number on the fold.
- **Also.** Few words per screen (a one-line round mission), the dragged value in `<bdi dir="ltr">` (decimal comma, minus sign), a shorter line per round
  (`radius`) so 1/10 can be aimed at and − / + always there, no scroll with chain + cards + tiles; the peer sheet targets a real misconception without
  the climax's errors.

**What was written (per lesson):** `lesson.config.js` (`studentView: 'mission'`, `mission` — scene `fold-strip`, title « بطاقات سلمى الخمس », tools
`murabba-mutaakisayn`, `hulul-x2-a`, `tariqat-hall-x2`, climax = module 4 (Salma's five cards 64, 0,09, 11, 0, −36 and her points), the three checkpoints
above; `knowledgeMapOpen`; module and resource lines no longer cite the textbook) · `content/prep.js` + test (10 « أستعدّ »: « مربّع عدد ومعاكسه » with
`quwat-adad-nisbi` and « الجذر التربيعي » with `jidhr-tarbii` to revise; the first-degree equations stay a `priorKnowledge` — module 3 requires them) ·
`content/folds.js` + test (every goal PLAYED, three stars on a clean play, the line never too short for a card, no climax value among cards, roots,
nearest ticks and build decoys; no equation in a plain-text lead) · `content/peerSheet.js` + test (« ورقة أمينة »: « √0,16 = 0,08 because 0,16 ÷ 2 =
0,08 »; the number of solutions is RIGHT on the sheet) · `content/mission.test.js` · modules 0 (the ladder), 1 (`PlayerSwitch` + `LabRounds labId="m1-folds"`;
step 1 waits for r1, step 5 for r2; what the lab did is SAVED — `useSavedAnswer` key `lab-folds` + stars — so a reload never blocks a step; step 1's title
no longer names 9 and −3), 2 (`LabRounds labId="m2-folds"`: 9, 5, −1 with √5 pinned exact and the build, then a free line; step 2 waits for it; « ورقة
أمينة » is step 4), 3 (title tag and step titles lose the pages and the textbook's exercise numbers).

**What was added to the shared code:**
- `logic/squareFold.js`: `init({ exactOnly, radius })`, `tickRoot` / `landsOnTick`, `pin` (the `nearTick` verdict with `free`), `pinExact`, `exactToPin`,
  `allSolved`, `coachOf`; `xText` writes « 3 », never « 3,0 ».
- `roots/SquareFold.jsx`: the v2 treatment (`onVerdict`, `chains` 'full' / 'predicted' / 'build' / 'none', `predict` + `predictCards` + `predictKind`,
  `handDone`, `radius`, the journal, the bounce, controls locked during a prediction or a question, always guided, `{ tk: 'reset' }`) and its first LabCoach;
  `CHAINS_PLAYER`, `chainOfPlayer`, `eqBuildOf`, questions `posSqFill`, `zeroCountFill`, `negCountFill`, `eqBuild`; a11y (indigo focus rings with offset,
  live verdict and prediction regions always mounted, `aria-disabled` handle, sr-only « solved » word, table row headers). Page and teacher unchanged.
- `rounds/roundsModel.js`: `{ solvedAll: n }`.
- `kit/questions.jsx`: in the two-column batch (player), the row label no longer reserves 14rem — it stacked the choices and overflowed at 1024 × 768.
- `mission/FoldStripScene.jsx` registered as `mission.scene: 'fold-strip'`.

**Traps met:**
- **`ns` is a reserved i18next option** (the namespace): a string interpolated with `{{ns}}` comes out as its RAW KEY in the browser while the jsdom
  render test passed. The lab's page questions `posMirror` and `negWhy` had it already (a page bug too); renamed `{{neg}}`, and a test forbids `{{ns}}` in
  `squareFold`. (Another lab's string still uses `{{ns}}` — `lesson.manipulation.json` line ≈ 5801 — not touched here.)
- Several `$…$` runs in one Arabic sentence reorder (the build prompt « ابنِ: □ ⇔ □ أو □ ») — one formula per sentence; the ⇔ « يعني » lives in the
  build's operator.
- An equation in a PLAIN-text lead (« x² = 1 ، x² = 0 ») reorders in RTL — the cards carry the equations (test).
- A Node script imports the content files (`check:lessons` coverage): `content/*.js` must not import a sibling without its extension — the r1 table is
  inlined (`TABLE`, tested equal to the activity's).
- The help card « لا بأس — جرّب أصغر » appears after two wrong answers — answer right in a walk.

**Verification:** see the commit message (vitest `src/lessons`, `check:lessons`, `lab-rollout-status --lesson muadalat-x-murabba` ✅, Playwright at
1366×768, 1024×768 and 1920×1080: every round ★★★, the reset path, the easier round and back, a reload after r1 (step 1 complete), module 2's round and
peer sheet (restored after reload), home, « أستعدّ », final test, knowledge map, modules 1–7 unit by unit — 0 `data-fit-overflow`, 0 page scroll —,
teacher view unchanged).

**ECC review (react, code, a11y — 2026-11-10), fixed:**
- the checkpoint after module 3 held `\times` in a single-quoted string — a TAB and « imes » on screen: now `\\times`, and `_unit/missionStrings.test.js`
  forbids a control character in every unit-2 checkpoint and opening;
- « أمثلة الكتاب » in the knowledge maps of this lesson AND of `jidhr-tarbii` (missed in lesson 1) → « أمثلة محلولة », and the same test scans every
  unit-2 `knowledgeGraph.js`;
- **shared:** every converted lesson (unit 1 included) wrote the right checkpoint answer FIRST — `MissionCheckpoint` now shows the options in an order
  drawn from the checkpoint's `id` (`missionModel › checkpointOrder`: stable across reloads, different between checkpoints; the stored answer stays the
  ORIGINAL index; test over every converted lesson that the right answer is not mostly first). No config was edited;
- the lab kept ONE prediction — predicting card 2 before solving card 1 lost card 1's verdict: now one per card; a repeated refused answer is counted again
  once x has moved (3 → 5 → 3), and still not when the same refusal is sent twice at the same x (a second non-free « nearTick » at the same x included);
- **shared:** `useSavedAnswer` returns `ready` (the server's copy has arrived, or the server did not answer): the module-1 effects of lessons 1, 2 and 3
  that MERGE what is kept no longer save before it — a partial, newer save could have overwritten the server's copy;
- the scene's graduations now cross the strip (they were parallel to it);
- **teacher view note:** `square-fold › xText` writes « 3 », never « 3,0 » — on the page and the teacher's view too (handle, journal, table, messages);
- a11y of the lab: a negative a inside an Arabic verdict is an isolated LTR run (« −4 », never « 4− »); − / + follow the LTR line (− on the left); every
  verdict is re-announced (keyed by the answer) after a hidden « صحيح. » / « خطأ. »; the slider says « x يساوي X ومربّعه Y »; the hatch is drawn at full
  contrast and the refused arrow ends opaque; the note says « الأعداد السالبة … لا يبلغها أيّ مربّع »; « … » cells say « لم تُجرَّب بعد » to a screen
  reader, and the page's table has a hidden caption;
- **shared:** `BatchChoiceQuestion` — each choice group is named by its row label, a hidden « (صحيح) / (خطأ) » follows each row after checking, the
  feedback sits in an always-mounted live region, emerald-700 / rose-700 behind white text, indigo focus rings with an offset.
**Rejected by the coordinator (not now):** moving the focus into the prediction / question column when the lab locks (the same pattern in every lab);
the SVG's `role="img"` content (the slider and the text carry it); the selected card's colour (`aria-pressed` is there); a TTS reading of the minus
sign and the decimal comma; module 2's peer sheet on the page (as in lessons 1–2); x² = 5 in module 2.

**Open on this lesson:** module 2 keeps x² = 5 (its step 2 asks how to write the solutions of x² = 5; in the climax 5 is only a points penalty) — the
test allows it there only; textbook exercise badges (« تمرين 12 ») stay inside `TextbookExercise` as in lessons 1–2; e2e specs of the old student view.

## Unit 2, lesson 4 — `amaliyat-judhur` « العمليات على الجذور التربيعية (الجداء والقسمة) » (2026-11-10)

**Council (2026-11-10, a real council: 5 advisors, 5 anonymous peer reviews, chairman; the arithmetic re-verified by the coordinator)** on how
`square-tiling` lives in the player. Verdict applied:
- **The content test FIRST.** `content/tilings.test.js` was written before the round data: per card, the accepted k > 1; every goal reachable by a
  student who tiles (three stars on a clean play); every value the lab DISPLAYS — tile area, side k√b, refused quotient, chips and decoys of the
  questions, predicted k — scanned against the climax's numbers (180, √180, 6√5, 5 as a tile area, 12, √12, 2√3, 192, 8√3, 108, 45, 3√5, 18, 90, 150) and
  lesson 5's (200, 10√2). The values come from `logic/squareTiling.js › shownValues`, built on the SAME pure builders as the lab's questions. It would
  have caught 72 → 18 and 288 → 12 (both dropped, with 36 and 48).
- **Chains.** r1 (27): « مساحة البلاطة؟ » (3) → « الضلع؟ » among 3 × √3 / 9 × √3 / √3 × √3 → BUILD « √27 = 3 × √3 » (the decoy tile 9, « × » visible) →
  the rule « √(k²×b) = k×√b » only (« جذر جداء = جداء الجذرين » stays on the page's steps). r2 (32): one chip at the discovery, the BRIDGE « √(4 × 8) =
  √4 × … » → √8. r3 (98): the QUOTIENT chip « √2 = √(98 ÷ …) » → 49. ⭐ (96): the tile area. Lesson 5's chain is fixed now as data (`fullS`): the
  largest-k tile's area → BUILD « √n = k × √m » (decoy: a smaller valid k and the root of ITS bigger tile) → the rule « أكبر بلاط يصلح ← بلاطة لا تُقسَم
  من جديد ».
- **Goals.** `{ discovered: true }` — the lab's own mode-aware `discoveryReady` (two valid k > 1 and a refusal; the largest k and a contrast), announced
  once by `onTrial { tk: 'discovered' }` — on cards with two valid k > 1 (32, 96); `{ exact: k }` on single-valid cards (27 → 3, 98 → 7, practice 8 →
  2). The FIRST refusal of a round is free (verdict `free: true`: it counts for the goals, never for the « few trials » star); trials count from the
  second refusal. A k tried again is not a new trial.
- **Predictions.** Two yes/no per round « هل يعطي k = … بلاطًا مساحته عدد طبيعي؟ », one on a valid k and one on a refused k (truths differ, also on
  single-valid rounds): r1 2 ✗ / 3 ✓, r2 2 ✓ / 3 ✗, r3 4 ✗ / 7 ✓, ⭐ 4 ✓ / 3 ✗ — asked before the first gesture, judged when that k is tried. Lesson 5
  (`predictKind: 'smallest'`): « which k gives the smallest tile? » among given k — which must include a refused k above the largest valid one.
- **Rounds.** r1 27 · r2 32 (2√8 and 4√2: the same side, two names) · r3 required 98 · ⭐ 96 · free chips 27, 32, 50, 75, 96, 98 · practice 8 (2√2).
- **No tile counts anywhere in the player.** k = 4 (16 tiles) or k = 6 (36 tiles) are accepted in the DRAWING only: no number of tiles, no question on
  it, never « count × area » — only k, the tile area and the side. A refusal shows a large « ✗ مساحة البلاطة ليست عددًا طبيعيًا » with the exact quotient
  small underneath, NOT reduced (« 98 ÷ 36 », never 49/18 — a reduced fraction can bring in another number).
- **Stuck student.** Three refusals in a round offer « جرّب أصغر » (round field `helpAfterRefusals: 3`) → the practice round, whose win returns to
  the round left. The guide (LabCoach) NEVER points at a valid k (the coordinator overrode the chairman): the handle, then the ruler for another try.
- **Checkpoints.** « √7 × √28 = ? » (14 / √35 / 196); « √2 + √2 = √4 ؟ » (لا / نعم); « √147 ÷ √3 = ? » (7 / 49 / 7√3). No k√b reconstruction of an
  area — `content/mission.test.js`.
- **Scene.** A school courtyard paved with square slabs by two pupils (`KidFigure`, a girl in hijab, a boy), no numbers; `slabs` lets lesson 5 reuse it
  with bigger slabs.
- **Also.** A visible tally « ✓ … · ✗ … » so the student knows when the round is done; a refused tiling is crossed out in the drawing (not only its
  colour); k√b inside Arabic text through `MathText`.

**What was written (per lesson):** `lesson.config.js` (`studentView: 'mission'`, `mission` — scene `courtyard-slabs`, title « لوحة الزليج: أيّ البلاطات
تصلح؟ », tools `jidaa-jidhrayn`, `qismat-jidhrayn`, `la-tawzi-jam`, `jidhr-a2b`, climax = module 5 (the zellige panel of 180 dm²), the three checkpoints
above; `knowledgeMapOpen`; the description, module and resource lines no longer cite the textbook) · `content/prep.js` + test (10 « أستعدّ »: « مربّع
جداء ومربّع حاصل قسمة » with `quwat-adad-nisbi`, « الجذر التربيعي » with `jidhr-tarbii` to revise; the three `priorKnowledge` are measured) ·
`content/tilings.js` + test · `content/peerSheet.js` + test (« ورقة ياسمين »: « √(4 + 9) = √4 + √9 = 5 »; the module's own examples 16 + 9 and 100 − 36
are not reused) · `content/mission.test.js` · modules 0 (the ladder), 1 (`PlayerSwitch` + `LabRounds labId="m1-tilings"`; step 1 waits for r1, step 6
(the quotient table) for r3; the lab's trials and finished questions are SAVED — `useSavedAnswer` key `lab-tilings`, merged only once `ready` — so a
reload never blocks a step), 2 (« ورقة ياسمين » is step 4), 3 and 4 (tags, step titles and objectives lose the pages and the textbook's exercise numbers).

**What was added to the shared code:**
- `logic/squareTiling.js`: `tilesWhole`, `validBig`, `tally`, `coachOf`, `rootText`, `refusedPlain` / `refusedPlainTex`, the question builders
  `areaOptions`, `sideOptions`, `tileBuildOf`, `bridgeOptions`, `quotientOptions`, `simplestBuildOf`, and `shownValues` (what a player screen can show).
- `roots/SquareTiling.jsx`: the v2 treatment in both modes (`onVerdict` with the free first refusal, `{ tk: 'discovered' }`, `chains` 'full' / 'bridge'
  / 'quotient' / 'area' / 'fullS' / 'none', `predict` + `predictKs` + `predictKind` 'whole' / 'smallest', `choices`, `handDone`, the tally, the journal,
  the crossed-out refusal, controls locked during a prediction or a question, always guided, `{ tk: 'reset' }`) and its first LabCoach; `CHAINS_PLAYER`,
  `chainOfPlayer`, questions `areaFill`, `sideChoice`, `tileBuild`, `ruleP1`, `bridge`, `quotient`, `bestFill`, `simplestBuild`, `ruleS1`; a11y as in
  `square-fold` (indigo rings with offset, `aria-disabled` handle, live prediction region always mounted, sr-only « صحيح. / خطأ. » before a verdict,
  − / + in the ruler's LTR order, journal row headers). Page and teacher unchanged.
- `rounds/roundsModel.js`: `{ discovered: true }`, verdicts `free`, `countedTrials`, round field `helpAfterRefusals`.
- `mission/CourtyardSlabsScene.jsx` registered as `mission.scene: 'courtyard-slabs'`.
- **shared:** `primitives/LabCheckpoint.jsx` — the content of a choice button no longer takes the pointer (`pointer-events-none`): a KaTeX
  formula (√…) overflows, invisibly, ABOVE its button, so a tap on a choice selected the one BELOW it (found by the walk: the centre of choice 1
  belonged to choice 2). Every lab's questions benefit.
- **shared:** `kit/questions.jsx › BatchChoiceQuestion` takes `rowCols="auto"` — two columns in the player for 6 rows or more, one elsewhere —
  because a MODULE does not see the player's context (`useInMissionPlayer` is false at a module's top level; only components inside the player
  tree read it). Used by module 1's two tables (6 and 8 rows), which overflowed at 1024 × 768.
- **shared:** `components/StatementFigure.jsx` draws nothing for a plane figure WITHOUT points (the golden-number exercise of this lesson keeps
  its extraction data `{ AD: 1, AE: '1/2' }`, drawn apart by `GoldenFigure`): it rendered an empty box and logged « viewBox NaN » — on the page too.

**Traps met:**
- A tiling's refused quotient, once REDUCED, can show a number the lesson forbids (98 ÷ 36 = 49/18, 50 ÷ 4 = 12,5): the player shows it unreduced.
- A count in Arabic (« 2 بلاطات », « 1 بلاطات ») is wrong grammar for k = 1, 2 and 11+: the player strings say « عدد البلاطات على كل ضلع: k ».
- `useInMissionPlayer()` called at a module's top level is always false (the provider wraps the player's content, not the module): use a
  component-level option (`rowCols="auto"`) instead.
- The shell refused a heredoc holding JS template literals (« could not be checked for dangerous rm ») — those files were written with the file tool.

**Verification:** vitest `src/lessons` green; `check:lessons` exit 0 (entry 241.3 KB ≤ 245); `lab-rollout-status --lesson amaliyat-judhur` ✅;
Playwright at 1366×768, 1024×768 and 1920×1080: every round ★★★ (27, 32, 98, ⭐ 96, the free workshop on 50), the reset path, three refusals → the
practice round 8 and back, a reload after r1 (step 1 complete), the peer sheet (restored after reload), home, « أستعدّ » (10), the final test (6),
the knowledge map, modules 1–8 unit by unit — 0 `data-fit-overflow`, 0 page scroll, no console error —, teacher view unchanged.

**ECC review (react, code, a11y — 2026-11-10), fixed:**
- **shared:** the win card's « few trials » line counted the free verdicts while the stars did not — both now read `roundsModel › starCriteria`
  (`clean`, `few`), one source, tested.
- **shared, lessons 3 and 4:** a round could be WON while its question was open (the bridge of r2 met the goal `{ discovered }` in the same tick it
  opened, and could be skipped). Every question a round asks is now in its goal: here `{ checkpoint: 'tile' }` on r2, r3 and ⭐ (r1 already waits for
  `rule`); in `muadalat-x-murabba` `c0` / `c1` on its r2, `c0` on r3 and `c1` on module 2's round (a card solved in another order met the goal
  first). Lessons 1–2: their only chains end on `rule`, already a goal. Tests in both content files.
- **shared:** « أعِد التجربة » of a lab question put the task back but the round KEPT what the lab undid. New event `{ tk: 'retry', groups? }`
  (`logEvent`): `square-tiling` drops every verdict and the discovery (its first refusal is free again), `square-fold` drops the retried card's
  answers, `square-root-side` drops everything when step 1 restarts (a step-2 retry returns to the step-1 snapshot, whose trials stay trials).
  Predictions and answered questions stay. Tested.
- k = 1 (the tile IS the square) is no longer a trial nor a journal column.
- Module 1's trial memory is keyed by SQUARE then by k (a one-level merge let one square's trials overwrite another's); the area of a trial is
  recovered from the trial (b × k², or the reduced quotient × k²); the step-1 line speaks of round 1's square only (27) in the player.
- The chains are never posed without a valid k > 1 (`firstValid`) — a latent crash on a card with a single valid tiling.
- **Answer positions:** the chips and choices of the lab's questions turn with the numbers (`logic › spin`); **shared:** `PeerSheet` shows its fixes
  in an order drawn from the sheet's id (`peerSheet › peerFixOrder`, the checkpoints' own `checkpointOrder`) — the right fix was first on every
  sheet; tested over every converted lesson's sheet.
- The wrong-prediction line is the lab's own (« انظر إلى مساحة البلاطة: هل هي عدد طبيعي؟ »), not the football's « ما بقي ».
- `sideOptions` never writes the right side twice when √b = k (n = k⁴).
- **a11y, shared (`LabCheckpoint`, every lab):** focus ring `ring-2 ring-indigo-600 ring-offset-2`; the input border indigo-500; white on sky-700,
  emerald-700 and amber-700 (not sky-500 / emerald-600 / amber-500); the number badge slate-600; the card is `role="group"` beside the lab in the
  player (a modal dialog only on the page, where it covers the lab); an answered option says « (صحيح) / (خطأ) » to a screen reader, and
  `aria-pressed` is true only on the option the student chose. **`BatchChoiceQuestion`:** a text option (no formula) keeps the text font and may
  wrap; the right option says « (صحيح) » after checking. **The tiling lab:** the journal's k cells are column headers; « k = N » under the ruler
  is hidden from screen readers (the slider's value text carries it).

**Rejected / later (coordinator):** `disabled` → `aria-disabled` focus loss on − / +, the checkpoint options and the choices (the same pattern in
every lab — final report); the handle ring at k = min (verified on the screenshots, not clipped); reflow at 400 % zoom (phones unsupported); the
slab-area font inside the decorative SVG; a full render test of `<SquareTiling>` in the player; « نشاط 4 » in a title (an activity number, not a page).
