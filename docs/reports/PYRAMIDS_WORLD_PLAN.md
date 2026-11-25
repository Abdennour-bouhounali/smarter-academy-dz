# The world of 4AM unit 9 « خاصية طالس » — « الأهرامات » — PLAN (2026-11-24, nothing is built)

**Status: a design page, revised after gate A (verdict « PASS WITH FIXES », report
`scratchpad/reports/pyramids-gate-A.md`; every point is answered in §8). No code was written; no build, walk, test suite
or `check:lessons` was run.** Branch `feat/thales-pyramids` (local, never pushed). The owner validated the world on
2026-11-24 from the 3D mock-up (`docs/reports/mockups/thales-egypt-3d/main.js`, `page.html`). This page turns it into a
world of the kit and designs its first lesson `talis-hisab-atwal`.

**Decisions taken (main session for the owner, 2026-11-24, final):** the metre everywhere (no cubit); the capstone stage
and Ibn al-Haytham's box are accepted; hearts are lost only on the felucca, and losing all three restarts the trip.

What was read: `CLAUDE.md`, the skill `.claude/skills/lesson-v2/` (`SKILL.md` §0–§6, `review.md` §A, `play.md`),
`GAME_WORLD.md` (§1, §2, §2ter-0/1/3, §2sexies, « استكشف », §3), `ROOTS_WORLD_PLAN.md` (the template of this page), the
headers of `rootCourts/` (`calc.js`, `Inquiry.jsx`), `kit/GateRun.js`, `kit/claims.js`, `kit/ExamSitting.jsx`,
`components/GeoFigure.jsx`, `engine/robot.js`, the walk library's `worlds/`, `npm run lesson:brief -- talis-hisab-atwal`,
the 50 sheets of the bank (every statement, answer and misconception signature), and in `../smarter-academy-fr-next`:
`lesson:brief -- thales-configuration-papillon`, `docs/curriculum/net-3e/fr_dz_table.json`, `docs/TWO_PLATFORMS_PLAN.md`.
NOT read, by the owner's rule: the textbook, `docs/sources/**`, and the old lesson
(`lessons/moyen/4am/handasa/khassiyat-talis/talis-hisab-atwal/`, v1). It is traced and deleted at wave 2 and never opened.

**One question is left for the owner (§7). Phase 1 (a grey box) is the next stop.** Every number was checked against
the bank twice, by the repo's `scripts/lesson-bank-numbers.mjs --check` and by a stricter scratchpad script (§3.8). The
forge tests check them again when they are written.

---

## 0. What binds — the bank in five facts

`talis-hisab-atwal` has 50 sheets, 144 questions and 5 levels:

- P1 « التعرّف على وضعية طالس واستخراج النسب الثلاث »: 16 primary, 67 secondary.
- **P2 « حساب أطوال مجهولة »: 99 primary.**
- P3 « معامل التناسبية k، تكبير أو تصغير »: 29 primary.

1. **The work is computing a length**: 130 of the 144 answers are a rational number, 55 of them decimals and 15 of them
   fractions. P2 carries two thirds of the bank, so its key gets the richest world and the `use` step closest to the
   exam (`review.md` §A.8).
2. **The errors the bank fights most** are:
   - the inverted ratio (`MISC-TALIS-NISBA-MAQLUBA`, 70 signatures);
   - **the piece in place of the side** (`MISC-TALIS-QITAA-BADAL-DILA`, 36: MB where AB is needed);
   - the inverted k (`MISC-TALIS-MUAMIL-MAQLUB`, 26);
   - adding instead of multiplying (`MISC-TALIS-JAMA-BADAL-DARB`, 7).

   Every key below holds a computed case against one of them, and the final mission's distractor is the piece.
3. **14 questions are the butterfly** (« وضعية الفراشة », the points on the other side of the vertex). It gets a key of
   its own.
4. **38 of the 50 sheets carry a figure** (`statement.figure`, drawn by `components/GeoFigure.jsx`). Today the kit's exam
   sitting (`kit/ExamSitting.jsx`) draws no figure, so 38 sheets would say « في الشكل المقابل » over nothing. This is
   kit work K-a (§2.4).
5. **Pythagoras comes before Thalès in 7 sheets.** Level 5 is ten real situations: a valley, a ramp, a water tower, a
   cable car, a fence, a folding table, a ladder, a double ladder, a lamp's shadow and a logo. The world's situations
   are ours, and the bank's stay in the sitting as they are.

   Disclosed overlaps (§8, O1–O2):
   - Stage 1's figure (a triangular plot cut parallel to (BC)) is the canonical figure of the property, which l5-005
     also uses.
   - Stage 2's face (isosceles, apex S) is the figure of l5-008.
   - Stage 3 uses the surveyor's method of l5-001.

   No stage copies a sheet's letters, numbers or question.

---

## 1. The world « الأهرامات » (id `nile-pyramids`)

### 1.1 The map — docks on the Nile, one line into the screen

The Nile runs AWAY from the camera, towards the plateau where the Great Pyramid stands. From the first second it is
visible on the horizon, through a horizon layer with its own fog range (kit work K-f), so the goal is always in view.

On the east bank, five DOCKS (« مرسى ») stand one after another in the order of play (`play.md` §2: the places stand in
one line, on the axis that goes into the screen). The mock-up's bend of the river is kept as a gentle curve of the banks,
and the docks stay on the axis. A dock opens on its STAGE, a ground of its own. **A stage is one key, or the final
mission.**

| # | Dock / stage | Ground | The key | Its parallels |
|---|---|---|---|---|
| 1 | « حقل النيل » | a triangular field of black silt and green crops after the flood, its two canals | 🔑 وضعية طالس (P1) | a canal parallel to the field's side along the river — any direction on the ground |
| 2 | « ورشة البنّائين » | an unfinished limestone pyramid (base 99 m, edge 90 m), its ramp, the quarry across the water | 📐 حساب طول مجهول (P2) | the courses, horizontal on a slanted face |
| 3 | « عرض النيل » | the bank at the ferry, the far landing post, an old stake | 🦋 وضعية الفراشة (P1, P2) | two lines perpendicular to the bank |
| 4 | « حجر القمّة » | the summit of the stage-2 pyramid, the capstone yard | 🔍 المعامل k (P3) | the capstone's base, parallel to the pyramid's base |
| 5 | « ظلّ الهرم الأكبر » | the plateau, the Great Pyramid (h = 146 m), the morning sun | the final mission (P1–P3) | the stick and the pyramid's height, both vertical; the sun's rays |

No stage name says a rule (`review.md` §A.4): « فراشة », « معامل » and « طالس » are never written before their seal.

### 1.2 Zero, hearts, stars

- **Zero** (`engine/robot.js › makeRobot`) is the only character, about 1,2 m tall, as in every world. No Thalès, no
  builder and no surveyor is drawn. The story card names Thalès once, AFTER the first seal (§3.3). No `KidFigure` is
  planned.
- **❤️ Three hearts are lost only on the felucca**: a crocodile, or a wrong buoy. Losing all three restarts the trip from
  its dock, and the stage already won is kept. **Inside a stage no heart is ever lost**: a course that leaves a gap is a
  FACT of the world, drawn in amber or violet and never in red (`GAME_WORLD.md` §2, « never wrong »).
- **⭐ Stars**: three per stage.
  - The prediction or order is right at the first try.
  - The forge is sealed `alone` (the kit's level).
  - The last step is right at the first try.

  A trip gives the hearts left (the kit's rule for a run). The top bar shows ❤️ and ⭐.

### 1.3 The felucca between two docks — what it trains

After each stage Zero boards the felucca and sails to the next dock. This is the kit's gate run (`kit/GateRun.js`) in
the skin of the river (kit work K-b):

- the rail becomes the water between two banks of palms, and the robot rides the boat;
- the three arches become three NUMBER BUOYS;
- a CROCODILE surfaces in one lane between two buoys and costs a heart if the boat is in that lane.

Four right buoys reach the dock (`total: 4`). **Every leg is numeric**, and a gate passes in about 3 s. Since
2026-11-25 (owner) a buoy that names points carries its FIGURE beside the order (`run.js` → `figure.js › buoyFigure`,
drawn by `kit/GateRunHud.jsx`; `GAME_WORLD.md` « The kit's gate run »); the buoys of k only have none. Each leg trains only what he has just sealed:

| Leg | After | What a buoy asks (mental numbers) | The error its wrong buoys hold |
|---|---|---|---|
| 1 → 2 | 🔑 | « AM = 6, AB = 14, AN = 9 ⟹ AC = ? » (the nested chain) | the piece (AN × MB / AM); the inverted ratio |
| 2 → 3 | 📐 | « $\frac{AM}{AB} = \frac{p}{q}$, AB = q × m ⟹ AM = ? » | AB − p; AB × q / p |
| 3 → 4 | 🦋 | « $\frac{OC}{OB} = \frac{2}{7}$, OT = 21 ⟹ OD = ? » | OT − 5; OT × 7 / 2 |
| 4 → 5 | 🔍 | « k = 0,7: تكبير أو تصغير؟ », « k = $\frac{7}{4}$, side 12 → ? » | k < 1 read as an enlargement; side + k |

**The numbers.** The lesson's `world/run.js` generates them with `rand`, and its test uses `rng(seed)`. k = p/q with
q ≤ 9, and sides are q × m with m ≤ 9. The test refuses:

- every k of the bank;
- every (piece, side) pair of the bank;
- **any wave whose wrong buoy equals its right one**, for example AB − p = AM when m(q − p) = p, or side × k = side + k.

**The same rail is the practice ladder** (« فضاء التدريب », one node per key plus « تحدّي الامتحان », `kit/ladder.js`). The
trip is the first level of the node of the key just sealed.

### 1.4 The look — from the mock-up, kept

The look is realistic, « not a boy game ». It is drawn in code:

- a physical sky: three's `Sky` shader, with the sun's elevation set per stage;
- ONE directional sun casting decorative shadows;
- procedural textures: sand and dunes beyond the play area, limestone blocks with offset rows and joints, Nile silt,
  crops;
- the river in a physical material, date palms, the felucca with its lateen sail, crocodiles half under water, number
  buoys.

All of it exists in `main.js` (`stage`, `desert`, `pyramid`, `palm`, `ribbon`, `felucca`, `crocodile`, `buoy`, `SAND`,
`LIMESTONE`, `SILT`, `CROPS`). It is PORTED into `scenery.js`, not redrawn.

**A shadow that carries mathematics is never the shadow map** (§2.1 and kit work K-f). A slow machine drops the shadow
map (`WorldRuntime › adaptQuality`), so a mathematical shadow is a drawn mesh computed by `logic.js`.

**Respect** (CLAUDE.md): the pyramids are monuments of BUILDING and KNOWLEDGE — courses, ramps, quarries, the capstone,
the rope-stretchers' fields.

- No god, ankh, scarab, eye, cartouche or hieroglyph is drawn.
- Nothing is funerary: no tomb, no mummy, no word of burial.
- The mock-up's placeholder « مسلّة الواحة » is dropped, because an obelisk is a sun-cult monument.
- The capstone is plain limestone, never gilded or inscribed.
- The final mission's box is « صندوق ابن الهيثم », the camera obscura that Ibn al-Haytham described in Cairo, beside the
  Nile.

### 1.5 The scale rule — from a 2 m stick to a 416 m river (gate B6)

- **One unit is one metre**, everywhere.
- Zero keeps his real size, so the world never rescales him.
- Labels are billboards of a fixed screen size, at least 18 px at 1366×768.
- **The rope's speed**: the knots go by faster the longer the key is held, from 3 to 30 knots per second. Its speed is
  set per stage so that the longest rope of that stage takes 8 s at most. The longest ropes are the river bank, 72 m
  (3 s), and the Great Pyramid's base, 230 m (8 s). The whole lesson is about 900 knots.
- **The camera** follows Zero while he holds the rope (the kit's follow camera, with `freeLook`). When the world BUILDS,
  it takes a stage shot (`cameraShot('frame', box)`) that fits the stage's box at 1366×768 with a 50° field of view:
  - the field, 50 m: about 60 m away;
  - the face of the stage-2 pyramid: about 110 m;
  - the river: from Zero's bank, the far post at 416 m in view;
  - the summit of stage 4: the top 8 m only, so the capstone (base 2,75 m) is drawn about 250 px wide;
  - the plateau: about 350 m.
- **Phase 1 grey-boxes the two hardest scales**: the river bank of stage 3 and the plateau of stage 5.

---

## 2. The world's mechanics as code pieces

### 2.1 The law of the world (`nilePyramids/logic.js`, pure and exact) — written once

**The rope.** Zero's hand holds a KNOTTED ROPE (« الحبل المعقود »), with a knot every metre and half-knots when a stage
opens them. **The rope lies on the ground or on what is BUILT. It never crosses the river and never reaches into the
air**: not a course that is not built yet, and not the apex.

**What it cannot reach, he computes, then the world builds it.** The thing built is the verdict. A mark for something
not built yet is the number he typed: the masons build up to it.

**ONE gesture** (the gate's cut 1). Every gesture is a SLIDE along a line marked with knots:

- along the ground from a stake;
- up a pyramid's edge, on the built steps;
- inland, perpendicular to the bank;
- the stick moved along the shadow's axis.

He takes the end with E at a stake, and ← → move the knot. His slide is the length (`play.md` §4: the main gesture runs
as the concept does — from what the rope reaches to what it cannot). The gesture is coded once, as `slide(line, knots)`.

**ONE order.** Every order is one number. The world builds one thing from it, and the verdict is one of three outcomes.
It is coded once, as `order(kind, value) → built → verdict`:

| Order | What the world builds | The three facts (no size is written in the world — gate P1) |
|---|---|---|
| a canal's length, typed BEFORE the rope reads it (stage 1) | the rope is laid along the canal and reads its length | **as typed** · **longer** · **shorter** — the rope's reading is written, the difference is not |
| a course of a length | the quarry cuts it, the boat brings it, it is laid at its level | **fits** edge to edge · **gap** at both corners (amber) · **overhang** past the edges (violet) |
| a ferry rope of a length | thrown from the bank to the far post | **ties** · **falls short** in the water · **slack** on the water |
| a capstone, by « كلّ طول × [k] » | cut by the quarry and lifted to the top (a block too big for the yard is written as the quarry's order: « قاعدة طولها 3564 م ») | **sits** · **too small** (a step left round it) · **too big** |
| a height h | Zero rises along the pyramid's axis to h | **at the apex** · **below** it · **above** it |

The sizes of a gap or a shortfall are NOT written in the world, so that one addition never gives the answer. They are
shown in the forge's mirror, where the case is evidence. A missed order stays in the log, and the next try is a new
order of his own.

**Lengths are exact rationals**: written « 77,5 » or « 5/6 », and never compared as floats. The exact helpers of
`rootCourts/logic.js` (BigInt fractions, `read`, `write`) MOVE to the kit as `kit/exact.js`, so that a world never
imports another world.

**Shadows that carry mathematics** are computed by `logic.js › shadowTip(elevation, azimuth, height, foot)` and drawn as
meshes, outlines and rays. The renderer's shadow map is decoration only.

### 2.2 The runtime class — `nilePyramids/Game.js › NilePyramidsGame extends WorldRuntime`

| Hook (`GAME_WORLD.md` §3) | What this world answers |
|---|---|
| `initWorld(save)`, `worldState`, `worldSave` | the stage reached, the docks done, the rope's log, the orders and their facts, the trip in progress, `flags` |
| `worldCentre`, `buildWorld(rand)` | `scenery.js`: the river, the five stage grounds, the docks, the felucca, the Great Pyramid on the horizon; `this.gateRun = new GateRun(this, { look: RIVER_LOOK, hazards })` |
| `spawnPoint`, `restore` | dock 1; the courses laid, the canals measured, the ferry rope tied, the capstone set |
| `walkable(x, z)`, `onGround`, `respawnPoint`, `onFall` | the banks and the grounds; the water's edge pushes him back (no fall); arriving on a stage ground runs `story.onArrive` |
| `onStart` | the story begins or resumes; a forge left open reopens (`pendingForge`) |
| `stepPhase('trip')`, `lanesLive`, `robotPose`, `cameraShot` | the felucca on the kit's rail; poses: holding the rope, riding the boat, rising along the axis; shots: `frame` (§1.5), `top` (the field from above), `sight` (Zero's eye along the line of sight, stage 3), `rise` (the flight to h) |
| `freeLook() → true`, `steers()`, `heading()` | clock controls on open ground (the kit's); `steers` is false during a slide; the heading is down the river |
| **NEW (K-f)** `sunDir()`, `shadowBox()`, `fogRange()` | the sun's direction per stage (stage 5: elevation with tan = 2/3, azimuth square to a face); a shadow box wide enough for each stage; a fog that leaves the horizon pyramid visible |
| `busy`, `pausesWorld` | as the kit |

The code is split as follows:

- `Game.js` holds the five stages as DATA and skins, on top of the shared `slide` and `order` (`gestures.js`,
  `orders.js`).
- `NilePyramids.jsx` gives the shell what it needs:
  - `Hud`: the rope's length written on both sides of the rope (`play.md` §4), and the live line of an order once typed;
  - `Under`: the kit's `Instruction` and `Recall`, and the register card;
  - `overlay(o)`: `order` (one typed box with its printed unit « م »), `register` (« سجلّ الحقل »), `mission` (the kit's
    `UseLines` with a figure, §3.7), and `sight`.

### 2.3 The experiment kinds — the first geometry kinds of the kit

A case of this world is a **Thalès figure**: `{ kind: 'nested' | 'butterfly', vertex, points, lengths, parallel }`.
**There is ONE drawing for it** (the gate's cut 4): `GeoFigure`, extended with a `gauge` part (below) and a
not-to-scale flag. It is shared by the mirror, the three kinds, the trainer, the knowledge cards, the lab instrument
and the board. Three kinds are NEW, one for each key that needs an experiment (`GAME_WORLD.md` « استكشف »). Key 🔑 uses
the world's log.

| Kind | Key | What the student does | What the world shows as FACT | Hooks for walks |
|---|---|---|---|---|
| — (the world's log) | 🔑 | in the field, measures AM and AN of a canal, TYPES the canal's length, then the rope reads it (§3.3) | the rope's reading. In the mirror, **the ratio gauge**: each whole side from the vertex is stretched to ONE common length and its piece marked on it. When the three marks stand on one vertical line, the ratios are equal (gold line); otherwise the marks stand apart. **One canal per case** (gate F5) | `data-np-predict`, `data-np-rope`, `data-rf-field="AB:AC:BC:AM:AN:MN"`, `data-rf-gauge`, `data-rf-aligned` |
| **`plan`** « خطّة الحساب » | 📐 | on a figure with ONE unknown: (1) picks two of the **three ratio cards** of the chain; (2) when a side from the vertex is given in pieces, JOINS the two ropes end to end, or cuts a piece off a side; (3) types the unknown — the cross product is his | a picked card is filled with the known lengths and « ؟ » for the others; a card with two « ؟ » is answered « نسبة فيها طولان مجهولان »; the joined pieces show the side with its sum; the course of his number is laid on the drawn face: fits · gap · overhang (sizes written here: this is the mirror) | `data-iq-stage`, `data-iq-card=<ratio>`, `data-iq-picked`, `data-iq-join="AM+MB"`, `data-iq-in="x"`, `data-iq-laid="fits\|gap\|overhang"`, `data-iq-fact` |
| **`halfturn`** « نصف دورة » | 🦋 | BEFORE the turn, says where C will land (on line (OB) or on line (OT)) and whether its side will be parallel to the big one's; then turns the small triangle round the vertex with ← → (steps of 30°, it stops at 180°) — the gate's cut 5: his act is the prediction | the turned triangle lands INSIDE the big one: key 🔑's nested figure appears with its gauge; the chain is written twice — with the turned letters, then with the butterfly's own | `data-iq-angle`, `data-iq-predict="OB\|OT"`, `data-iq-landed`, `data-iq-parallel`, `data-iq-aligned` |
| **`scale`** « آلة النسخ » | 🔍 | sets a number k on a dial and feeds a triangle to the copying frame fixed at the vertex; BEFORE each copy says « larger / exact / smaller », and last, which perimeter the copy will have (three choices) | the copy is drawn from the vertex, its sides × k: it covers the target triangle exactly, falls inside it, or goes beyond it; the copy's sides and perimeter are written. Round 1 (k = 1/36) is the world's capstone, entered as a fact: drawn to scale it would be 13 px (gate F1) | `data-iq-k`, `data-iq-feed="1\|2"`, `data-iq-predict`, `data-iq-image="inside\|exact\|outside"`, `data-iq-perimeter` |

Each kind is a pure reducer plus a pure view, in the shape of `rootCourts/calc.js`, and is played and tested without a
browser. Its sentences say facts, never the rule (the lesson's `inquiries.test.js` forbids the rule's words in them). A
miss is answered « توقّعك لم يصب هذه المرّة », followed by a fact.

### 2.4 What is reused, what is new

**Reused as it is**: `LessonWorld`, `Instruction`/`Recall`, `RuleForge` + `forge.js`, `Tablet` and « قواعدي »,
`Trainer`, `KnowledgePage`, `PracticeHub`, `ladder.js`, `journey.js`, `evidence.js`, `bankSitting.js`, `Paper`,
`Spaces`, `Title`, `End`, `Fit`, `saveSync`; the claim `fraction` (with its `op`) for `ratio` and `fourth`; `GeoFigure`;
the launch kit, « مختبري », the class board; `worlds.js` (one line).

`WorldRuntime` is reused **with three hooks added** (K-f). The kit names no lesson and no world.

**New in the kit:**

| # | Piece | Files | Lines | Owner |
|---|---|---|---|---|
| K-a | the sitting draws `statement.figure` (`StatementFigure`) beside its questions, inside the no-scroll layout; `bankDisplay.test.js` draws the 38 figure sheets | `kit/ExamSitting.jsx`, `kit/examSitting.css`, test | ~90 + 100 | agent |
| K-b | **BUILT 2026-11-24** — the gate run takes a SKIN (`skin: { name, track, rider, gate, lanes, labelY, lead, camera }`, meshes from the world; default: the rail of light) and HAZARDS (`hazards: { mesh, every, cost }`: one lane closed between two gates, `data-gr-hazard=<lane>`); contract in `GAME_WORLD.md` « The kit's gate run »; the felucca's meshes `nilePyramids/riverMeshes.js › riverRun()` | `kit/GateRun.js`, `kit/GateRunHud.jsx`, test | ~150 + 100 | agent |
| K-c | (B3) **a DECIMAL box** — digits and one comma, « 77,5 » — in `RuleForge › UseLines` and the trainer's form (both strip every non-digit today); **a CHOICE token `{ choice, options }` in `UseLines` and inside a `{ frac }`** (a ratio written with segment names is `{ frac: { n: { choice }, d: { choice } } }`); `forgeBlocks.decimalBox`, `choiceBox`; the suites read them; plus the ONE new claim `scale` (k < 1 ⟺ reduction) in `kit/claims.js` and `ClaimVerifier.php`, with a fixture row | `kit/RuleForge.jsx`, `kit/Trainer.jsx`, `kit/trainer.js`, `kit/authoring/forgeBlocks.js`, `authoring/test/suites.js`, `kit/claims.js`, `ClaimVerifier.php`, tests | ~160 + 160 | agent |
| K-e | `kit/exact.js` (moved from `rootCourts/logic.js`, with rootCourts re-pointed); `authoring/test/bank.js` and `scripts/lesson-bank-numbers.mjs` read DECIMALS and figure labels and SKIP the metadata (today 104 and 110 are found as textbook page numbers) | 4 files + tests | ~200 + 120 | agent |
| K-f | (B2) `WorldRuntime`: `sunDir()`, `shadowBox()`, `fogRange()` hooks (today the sun is fixed at 54° every frame, the shadow box is ±26 units, the fog ends at 300); `adaptQuality` documented: it may drop the shadow MAP, never a world's drawn shadows | `kit/WorldRuntime.js`, test | ~70 + 60 | main session (3D) |

**New — the world** `gameworld/nilePyramids/` (registered LAST in `worlds.js › WORLDS`):

| File | What | Lines (tests apart) |
|---|---|---|
| `Game.js` | the class above; the five stages as data and skins | ~1100 |
| `gestures.js`, `orders.js` | the ONE slide and the ONE order (§2.1) | ~250 + 250 |
| `scenery.js` | the mock-up's scene, ported: sky, sun, textures, river, palms, felucca, crocodile, buoys, docks, pyramids, the horizon layer | ~900 |
| `logic.js` (+ test) | the law: rope readings, `laid`, `ferry`, `capstone`, `flight`, `shadowTip` — exact | ~300 (+300) |
| `NilePyramids.jsx`, `nilePyramids.css` | `WORLD`, `Hud`, `Under`, overlays | ~350 + 250 |
| `strings.ar.js` | every Arabic sentence of the world, and `DIR = 'rtl'` (new engine code has one text file per country — `TWO_PLATFORMS_PLAN.md`) | ~300 |
| `ruleForge.js` (+ test), `forgeParts.jsx` (+ render test) | a case is a Thalès figure; the mirror draws it through the extended `GeoFigure` | ~220 + 250 (+400) |
| `Inquiry.jsx` + `plan.js`/`InquiryPlan.jsx`, `halfturn.js`/`InquiryHalfturn.jsx`, `scale.js`/`InquiryScale.jsx`, three css | the three kinds | ~40 + 750 + 550 + 700 + 400 (+1300) |

That is about 6 600 lines of source and 2 400 of tests, smaller than « قصر الساحات » (10 200 with its tests).

### 2.5 What a walk needs (`apps/web/e2e/lib/lessonWalk/worlds/`)

- **`nilePyramids.mjs`**: `NILE_PYRAMIDS = { id, story, practice, names }`, registered in `worlds/index.mjs › WORLDS`.
  It plays ONE slide player and ONE order player, because the world has only one of each.
  - BY HAND, as a student: « ابدأ »; E at a stake; ← → held until the rope shows the knot and released THERE; the order's
    box; the stick's slide; the boat's lanes; the mission's boxes.
  - BY THE DEV HANDLE (`window.__world`): Zero placed at a stake or a dock; the clock fast-forwarded; the state READ for
    the question. The state is never read for an answer: every order is computed by `./exact.mjs` from what the SCREEN
    shows.
  - World hooks: `data-np-rope=<knots>`, `data-np-stake`, `data-np-register` (rows), `data-np-order`,
    `data-np-predict`, `data-np-fact="as|longer|shorter|fits|gap|overhang|ties|short|slack|sits|small|big|apex|below|above"`,
    `data-np-sight`, `data-np-stage`, `data-np-dock`.
- **`nilePyramidsExperiments.mjs`**: the players of `plan`, `halfturn` and `scale`, registered in `experiments.mjs ›
  EXPERIMENTS`. Each ends before its last « next ». `NP_FRAME` is the frame for `inquiryFits`.
- **Move `rcPractice` to `lessonWalk/gateRun.mjs`** (today it is inside `rootCourts.mjs`). The felucca and the practice
  levels run on the kit's rail, so their player belongs to the library; it reads the crocodile lane from
  `data-gr-hazard`.
- The board's walk (`board.mjs`) gets a `figure` station if the board has none (this is reported at wave 1, not bent).
- **Not walked again** (`SKILL.md` §6, `trusted.md`): the forge frame, the tablet, the trainer frame, the hub, the
  knowledge page, the sitting frame.
- **Walked once on ONE reference lesson**: the gate run (changed by K-b), `WorldRuntime` (changed by K-f), and the trainer
  and forge boxes (changed by K-c) — all on `jidhr-tarbii`. The sitting (K-a) is walked on one v2 sitting, then on this
  bank's figure sheets.
- Everything of the world is new.

---

## 3. Lesson 1 `talis-hisab-atwal` — design

### 3.1 §0ter first — what he holds, what is new

**What earlier years gave him.** These are tools he owns; they are never forged again, and the launch kit measures them.

- 3AM `3am.m2.r03`: the proportionality of the lengths of two triangles cut by two parallels in the NESTED position
  (`tanasub-atwal-muthallath`). It is not built on the platform, so the launch family « النسب في المثلث » checks it
  first.
- 3AM `3am.m1.r08`: operations on rationals — the fourth proportional and the cross product (the bank's l1-001).
- Pythagoras and its converse (7 sheets).
- Two lines perpendicular to one line are parallel (l4-007).
- The central symmetry, from earlier years. Key 🦋's half-turn uses it and never teaches it.

**What is NEW for him in this lesson.** Four things, so four keys, in HIS order:

1. A « Thalès configuration » is recognised in ANY position and with any letters. He learns what allows the chain (the
   parallel) and how its terms pair: each ratio is a length from the vertex over the WHOLE side, and the parallel side
   goes over the parallel side. The 36 « piece » signatures live here.
2. Any one of the lengths is computed from three others, also when the data are pieces (compose, decompose). This is the
   bank's main work.
3. The butterfly: the points on the OTHER side of the vertex, with the same chain.
4. k as an operator with a direction: one number for every side and for the perimeter; k < 1 is a reduction, k > 1 an
   enlargement; from the second triangle back to the first, the number is 1/k.

Said at the design stop: the nested chain itself is 3AM's, and key 🔑 does not forge it as new. Stage 1 USES it as a
tool he owns (his prediction of the canal's length), and the old canal is where that tool fails. What key 🔑 seals is
the configuration — the condition and the pairing together. Its tiles hold the 3AM chain as ONE of four.

The old canal is the contrapositive of the converse. Lesson 2 (`aksiya-talis`) forges the converse and must build on
it (§4).

### 3.2 The story — the stages and what he holds at each forge

| # | Stage | What he does | Key | He holds when the forge opens |
|---|---|---|---|---|
| 1 | « حقل النيل » | six rope measures; two predictions of a canal's length, one right and one refused by the rope; forge 🔑 at the field's shaduf | 🔑 | the field's record and his two canals |
| ⛵ | leg 1 → 2 | four buoys, crocodiles | 🔑 | — |
| 2 | « ورشة البنّائين » | orders three courses from the plan and his rope; forge 📐 at the masons' table | 📐 | his three orders and what was laid |
| ⛵ | leg 2 → 3 | | 📐 | — |
| 3 | « عرض النيل » | the stake, the right angles, the sight line, the rope; the ferry rope cut before crossing; forge 🦋 | 🦋 | his river: 72, 9, 52 → 416 |
| ⛵ | leg 3 → 4 | | 🦋 | — |
| 4 | « حجر القمّة » | sends « كلّ طول × [k] » to the quarry; the capstone is lifted; forge 🔍 | 🔍 | his capstone order |
| ⛵ | leg 4 → 5 | | 🔍 | — |
| 5 | « ظلّ الهرم الأكبر » | the stick in the sun, the shadows, the rope; the mission card; Zero rises; the box at noon | P1–P3 | everything |

These rules hold on every stage:

- The instruction of each step is whole and stays on screen (`story.objective`).
- The card « من المرسى السابق » carries what the stage before gave (`story.recall`).
- The next place is lit (`play.md` §1).
- The game holds the order: he cannot board before the stage is finished.

### 3.3 Key 1 🔑 `wadiyat-talis` « وضعية طالس » — P1

- **Rule**: in triangle ABC, with M on [AB] and N on [AC], when (MN) ∥ (BC):
  $\frac{AM}{AB} = \frac{AN}{AC} = \frac{MN}{BC}$.
- **Nature**: a condition on one case. **It is found in the world** (`review.md` §A.0). The forge has no `inquiry` and
  opens directly on ②, its tiles (`GAME_WORLD.md` §2ter-1).

**The stage — a NEED and a PREDICTION (gate B1).** After the flood, only the three corner stakes survived. The
rope-stretchers' record gives AB = 63, AC = 72, BC = 81, and the masons must order the stone lining of the field's two
canals before the water comes back. For each canal:

1. He measures with the rope from A.
2. He TYPES the canal's length.
3. Then the rope is laid along the canal's dry bank and reads it.

This is six rope gestures. The world never asks a number it already shows: the rope reads after he types.

- **The new canal**, dug parallel to the river side (BC): AM = 14 and AN = 16. With his 3AM tool he types
  14 × 81/63 = **18** (16 × 81/72 gives the same), and the rope reads 18 (a star).
- **The old crooked canal**: AP = 39 and AQ = 28. The same tool gives 39 × 81/63 = 50,1… from one side and
  28 × 81/72 = 31,5 from the other. The rope reads **41**.

« Why did it hold there and not here? » is the condition, found by him.

The numbers are exact: cos A = 2/7, so MN² = 14² + 16² − 2·14·16·2/7 = 324 and PQ² = 39² + 28² − 2·39·28·2/7 = 1681.
Every rope reading is a whole knot. The pieces are MB = 49 and NC = 56 for the new canal, and PB = 24 and QC = 44 for
the old one.

**The tiles** — « تُكتب النسب الثلاث متساوية عندما [شرط] ، وهي [سلسلة] ». A rule says « the chain holds exactly when the
condition holds » and is run on each canal. This gives sixteen rules.

- Condition: c1 القناة موازية للضلع (BC) ✓ · c2 القناة تقطع الضلعين · c3 M منتصف [AB] · c4 AM = AN.
- Chain:
  - s1 $\frac{AM}{AB}=\frac{AN}{AC}=\frac{MN}{BC}$ ✓;
  - s2 $\frac{AM}{MB}=\frac{AN}{NC}=\frac{MN}{BC}$ (the piece);
  - s3 AB − AM = AC − AN = BC − MN (the difference);
  - s4 $\frac{AM}{AB}=\frac{AC}{AN}=\frac{MN}{BC}$ (one ratio upside down).

**Each wrong rule and the case that refutes it** (computed, recomputed by gate A):

- **c2 with any chain** is refuted by the old canal, which cuts both sides: s1 there gives 39/63, 28/72 and 41/81, which
  are not equal.
- **c3 or c4 with s1** is refuted by the new canal. M is not the midpoint (14 of 63) and AM ≠ AN (14 and 16), yet
  14/63 = 16/72 = 18/81 = 2/9.
- **c1 with s2** is refuted by the new canal: 14/49 = 16/56 = 2/7, but 18/81 = 2/9. The gauge shows two marks together
  and the third apart — the bank's 36 signatures, seen.
- **c1 with s3** gives 49, 56, 63 on the new canal; **c1 with s4** gives 2/9 against 72/16 = 9/2.
- **c3 or c4 with s2, s3 or s4** survive the evidence: they say « never », and those chains never hold there. **Attack
  1** refutes them: an isosceles field KL = KP = 38, LP = 32, with its canal through the midpoints (KE = KF = 19,
  EF = 16). There c3 and c4 hold, yet s2 gives 1, 1, 1/2; s3 gives 19, 19, 16; s4 gives 1/2 and 2. s1 gives 1/2 three
  times.
- **The right rule is attacked twice**: by attack 1, and by **attack 2**, a field in another position with other
  letters: RS = 66, RT = 77, ST = 88, (UV) ∥ (ST), RU = 48, RV = 56, UV = 64 (k = 8/11).

**The last step** (`use`): a triangle DEF turned on its side, with G on [DE], H on [DF] and (GH) ∥ (EF). He picks the
condition (a CHOICE token, K-c), then writes the three equal ratios with the segment-name choices inside fractions (K-c).
This is the bank's « اكتب النسب الثلاث ».

**The tablet**: his rule first, then « خاصية طالس » and « وضعية طالس ». The story card about Thalès and the pyramid opens
here, not before.

### 3.4 Key 2 📐 `hisab-tul` « حساب طول مجهول » — P2 (two thirds of the bank)

- **Rule**: from the three equal ratios, keep the two that hold the unknown and three known lengths. When a length from
  the vertex is given in pieces, rebuild the whole side (AB = AM + MB) or take the piece off it. Then use the cross
  product.
- **Nature**: a PROCEDURE. Its experiment `plan` WRITES the rule (`inquiry.writes`): the plan he builds is his rule, and
  the tiles are skipped. The false procedures are refused where he makes them, and the mirror then attacks his plan
  (`GAME_WORLD.md` §2sexies).

**The stage — a situation that makes it necessary.** The workshop's pyramid is unfinished: a square base of 99 m and a
lateral edge of 90 m (height ≈ 56,6 m — a squat pyramid, as the real ones are). On a face SBC, SB = SC = 90 and
BC = 99. **A course that is not built yet
cannot be measured; it is computed**, and the quarry across the water cuts it in advance. The rope slides up the edge
only on the built steps, FROM THE BASE CORNER B.

- **Course 1**: the mark at BM = 10, so SM = 80 and MN = 99 × 80/90 = **88**. The errors and what the world does with
  them:
  - the piece (99 × 10/90 = 11) is laid as an 11 m row on an 88 m level: gaps;
  - the difference (99 − 10 = 89): an overhang;
  - the inverted ratio (111,3…): an overhang.

  No size is written in the world (gate P1); the sizes are in the mirror.
- **Course 2**: BM = 20, so SM = 70 and MN = **77**.
- **Course 3, the other way**: the quarry has already cut a row of **55**. Where does it go? SM = 90 × 55/99 = 50, so its
  mark is at BM = **40** from the corner. That is above what is built, so he TYPES the mark, and the masons build up to
  it and lay the row there.

The courses' k are 8/9, 7/9 and 5/9; none is a number the bank writes (gate N3).

**The experiment `plan`.** Round 1 is HIS course 1, drawn flat. Then comes one figure, AB = 54, AC = 72, BC = 81,
(MN) ∥ (BC), AM = 42, AN = 56, MN = 63 (MB = 12, NC = 16; k = 7/9), with another unknown in each round:

- MN from AM, MB and BC (join AM + MB);
- BC from AN, NC and MN (join AN + NC);
- MB from AM, AN and NC (rebuild AB, then cut AM off).

**There are three ratio cards and the join/cut tool, nothing else** (gate F7). The false procedures and their facts:

- a card with two « ؟ » is refused by the card itself;
- the piece (MB over AB, or MB/AM) — his course is laid with its gap; no sentence names the criterion (gate P2);
- the difference and the inverted cross product show in his typed value — laid with a gap or an overhang.

The mirror's **attacks**: one figure where the unknown is a piece, and one where all the data are pieces.

**The last step**, in the exam's shape: (EF) ∥ (BC), E on [AB], F on [AC], AE = 45, EB = 10, AC = 66, BC = 77. He fills
`AB = [ ] + [ ] = [55]`, `AF = [54]` and `EF = [63]` (k = 9/11).

**The tablet**: his plan, then « الرابع المتناسب » and « الجداء المتصالب » as names.

### 3.5 Key 3 🦋 `wadiyat-al-farasha` « وضعية الفراشة » — P1, P2 (14 questions)

- **Rule**: two lines cut at S, with A, S, E aligned and F, S, R aligned. When (AF) ∥ (ER):
  $\frac{SE}{SA} = \frac{SR}{SF} = \frac{ER}{AF}$.
- **Nature**: a reduction to the known case. The half-turn round S carries the butterfly onto key 🔑's nested figure.
  The experiment is `halfturn`, which no other key uses.

**The stage « عرض النيل » — the river's width without crossing it.** The ferry needs a rope cut BEFORE anyone crosses.

- The far landing post F stands on the other bank, and A is on this bank opposite it: AF ⟂ the bank, using the
  rope-stretchers' right angle of the 3-4-5 rope.
- An old stake S stands at AS = **72** along the bank.
- He goes on to E, SE = **9**, then walks inland perpendicular to the bank (the 3-4-5 rope again) until, in Zero's eye,
  the stake hides the post (`cameraShot('sight')`). That is R, with ER = **52**.
- Both lines are perpendicular to the bank, so they are parallel: the condition is in his feet.
- The width is AF = 72 × 52/9 = **416** m. The ferry rope of his number ties. 52 × 9/72 = 6,5 falls short; the data's
  sum, 133, and the piece across S (AS + SE = 81) fall short too. No sum of the data comes near the width (gate B4: with
  405/45/56 it was 506 for 504).

The method is the surveyor's classic one, the same as the bank's l5-001. The letters (F, A, S, E, R), the numbers and
the question (cut the ferry rope) are ours. l5-001 asks « justify that the lines are parallel » about a valley; here no
justification is asked (disclosed, §7).

**The experiment.**

1. Round 1 is HIS river, with the measured lengths only.
2. A parallel butterfly: IK = 35, IL = 49, KL = 63 against IP = 50, IQ = 70, PQ = 90 (k = 7/10).
3. A butterfly that is NOT parallel: IK = 35, IL = 49, KL = 63, IP = 60, IQ = 64. Then cos I = −1/10, so
   PQ² = 60² + 64² + 2·60·64/10 = 8464 and PQ = **92** (gate N2). After the half-turn, the side lands crooked: 35/60 =
   7/12 and 49/64.

Before each turn he says where K lands, on line (IP) or line (IQ). The turn shows the partner on the SAME line through
the vertex.

**The tiles** — « في الفراشة مع (AF) ∥ (ER) : [نسبة 1] = [نسبة 2] = $\frac{ER}{AF}$ »:

- First slot: $\frac{SE}{SA}$ ✓ · $\frac{SE}{SF}$ (the crossed partner) · $\frac{SA}{SE}$ (upside down) ·
  $\frac{SE}{EA}$ (EA = SE + SA, the butterfly's « piece »).
- Second slot: $\frac{SR}{SF}$ ✓ · $\frac{SR}{SA}$ · $\frac{SF}{SR}$ · $\frac{SR}{RF}$.

The rules are run on the integer rounds. On the river only its measured lengths are used, because SF and SR were never
measured. Two wrong pairs are TRUE equalities between themselves: SA/SE = SF/SR (10/7) and SE/EA = SR/RF (7/17). **Their
refutation names the third ratio**: ER/AF = 7/10, never « your two ratios differ » (gate P4).

**Attacks** on the right rule:

- a butterfly with other letters: centre O, OU = 24, OV = 32, UV = 40 against OW = 54, OT = 72, WT = 90 (k = 4/9);
- the crooked butterfly, where the rule's condition fails and so does the chain.

**The last step**: (AB) ∥ (CD) cut at O, OA = 18, OC = 48, OB = 21, CD = 88. He fills `OD = [56]` and `AB = [33]`
(k = 3/8). The trap OA + OC = 66 is not a side.

**The tablet**: « وضعية الفراشة », and his own sentence « نصف دورة حول نقطة التقاطع تعيدها إلى وضعية طالس ».

### 3.6 Key 4 🔍 `muamil-k` « معامل التناسبية » — P3

- **Rule**: in a Thalès configuration, triangle (2) is the image of triangle (1) by ONE number, k = a side of (2) ÷ its
  partner in (1). Every side and the perimeter of (2) are k times those of (1). k > 1 is an enlargement and k < 1 a
  reduction. From (2) back to (1), the number is 1/k.
- **Nature**: an operator with a direction. The experiment is `scale`, which no other key uses.

**The stage « حجر القمّة ».** Zero is on the summit of the stage-2 pyramid, framed close (§1.5). The pyramid waits for its
capstone, a small pyramid of the same shape: its face SMN is in Thalès position with the face SBC (MN ∥ BC). The
stone-cutter takes ONE order card, « كلّ طول × [ ] » (gate P7).

- The capstone's base must be MN = 2,75, so he writes **1/36** (2,75/99). The capstone comes back with edges of 2,5 and
  a face perimeter of 7,75 (= 279/36), and it sits on the top.
- Written 36: the quarry's order reads « قاعدة طولها 3564 م ».
- Written as a difference, « every length less 87,5 »: base 11,5, edges 2,5 — it does not sit.

**The experiment.**

1. Round 1 is HIS capstone, entered as the world's fact (gate F1).
2. AMN with AM = 20, AN = 40, MN = 55, and ABC with AB = 24, AC = 48, BC = 66. The frame set at 6/5 and fed AMN covers
   ABC; fed ABC it goes beyond.
3. He finds the k that brings ABC back to AMN (5/6).
4. Last, the perimeters 115 and 138: « × k », « + k » or « × 3k ». The copy writes its own perimeter.

**The tiles** — « المعامل الذي يحوّل (1) إلى (2) = [ضلع من (2) ÷ موافقه من (1) ✓ · ضلع من (1) ÷ موافقه من (2) ·
ضلع من (2) − موافقه من (1) · أطول ضلع ÷ أقصر ضلع] ، و(2) تكبير لـ(1) عندما [k > 1 ✓ · k < 1 · دائمًا · k عدد طبيعي] ».

The refutations:

- (1) ÷ (2) gives 5/6 on round 2, and the copy falls inside;
- the difference gives 4, and the copy goes far beyond;
- longest ÷ shortest gives 66/20;
- « k < 1 enlarges » is refuted by round 2;
- « always » is refuted by the capstone, which is a reduction;
- « k natural » is refuted by 6/5, an enlargement that is not a whole number.

**The last step**: ABC with AB = 68, BC = 92, and AMN in Thalès position with AM = 42,5. He fills:

- `k = [5]/[8]` from ABC to AMN — any equal fraction is accepted (85/136 too), because the claim `fraction` compares
  values (gate O3);
- the choice « [تصغير] »;
- `MN = [57,5]`, a DECIMAL box (K-c);
- the k from AMN to ABC, `[8]/[5]` — the inverted-k error, typed against itself.

**The tablet**: « معامل التناسبية k », « تكبير », « تصغير ».

No two keys share a (kind, mode): the world's log, `plan`, `halfturn`, `scale`.

### 3.7 The final mission « ظلّ الهرم الأكبر » — it needs the whole lesson

**In the world — true geometry (gate B5).** It is a morning, with the sun's elevation at tan = 2/3 and its azimuth
square to a face.

- He plants a stick of **2 m** in the SUN, beside the pyramid's shadow. Its shadow is visible, parallel to the
  pyramid's, and he measures it with the rope: **3**.
- He measures the pyramid's shadow from the middle of its base edge to its tip A, **104**, and the base side, **230**.
- The tip A and the shadows are drawn meshes from `shadowTip`, never the shadow map.
- Then he SLIDES the stick's drawn triangle (the stick, its shadow and its ray, as an overlay) along the shadow's axis,
  until its shadow tip sits on A. The nested figure appears: the stick's top is on the ray that grazes the apex. The
  stick never stands inside the shade.

**The card** (`story.mission`, the kit's `UseLines`) carries **a schematic figure**: `GeoFigure` not to scale, which says
so (gate F4). Its lines stand in two columns:

1. `AB = [104] + [115] = [219]`. The shadow starts under the APEX, at the centre of the base, so the half side is added
   (key 📐's piece). The distractor 104 gives 69,3….
2. « (MN) و (BC) متوازيان لأنّ [كلاهما شاقولي] », a CHOICE token (key 🔑's condition; the sun's rays are the third
   parallel).
3. `[3] / [219] = [2] / h  ⟹  h = [146]` (key 📐). The inverted ratio gives 328,5.
4. « المثلث ABC تكبير للمثلث AMN بمعامل k = [73] » (key 🔍). The distractor is 1/73.

« تحقّق »: Zero RISES along the axis to his h, and ends at the apex, below it or above it.

**Then noon.** The sun is so high that no shadow leaves the base: at Giza in summer the shadow is about 17 m from the
centre, under 115 (gate N5). The robot asks to check the height another way, with **« صندوق ابن الهيثم »**: a dark box
with a hole O at its front, set at 177 m from the base edge. On its back wall, 0,5 m behind the hole, the pyramid's image
stands upside down, 0,25 m tall. This is a butterfly (key 🦋), on a schematic figure:

- `OH = [177] + [115] = [292]`;
- `SH = 0,25 × 292 / 0,5 = [146]`.

Two methods give one height, and the story ends.

Played in the head with last year's tools only, the mission is not won. The nested proportionality gives line 3 only if
he knows that the shadow starts under the apex (the piece rule) and that a stick and a pyramid form a configuration
(the condition). The box is a butterfly, and line 4 is k. It cannot be won without the four keys.

Note (gate P6): k = 73 also equals 219 − 146, because the stick and its shadow differ by 1. « A side minus a side of the
same triangle » is not a known error, so this is accepted and said here.

### 3.8 The numbers — computed and checked

Every number was recomputed exactly (scratchpad `final.py`, `pyr.py`) and checked twice:

- **the repo's `scripts/lesson-bank-numbers.mjs --check`** (since commit cb17ffb9 it reads decimals and fractions
  and skips the metadata), run on **EVERY pair within each group**: a pair on one line of the bank or of another
  lesson's story, or a number ≥ 100 found there (scratchpad `allgroups.py`; the pairs of 2 … 150 cached in
  `badpairs.json`, 2 833 of 11 026 collide);
- **a stricter scratchpad script** (`banknums.py`): one sheet holding two of the group's lengths ≥ 10, read from every
  statement, figure label and expected answer.

| Group | Numbers | Repo script, every pair | Strict script |
|---|---|---|---|
| field, new canal | 63, 72, 81 · 14, 16, 18 · 49, 56 | clear | free |
| field, old canal | 63, 72, 81 · 39, 28, 41 · 24, 44 | clear | free |
| 🔑 attacks | 38, 32, 19, 16 · 66, 77, 88, 48, 56, 64, 18, 21 | clear | free |
| courses, capstone | 90, 99 · 10, 80, 88 · 20, 70, 77 · 55, 50, 40 · errors 11, 89 · 2,75, 2,5, 36, 279, 7,75, 3564 | clear | free |
| 📐 plan, last step | 54, 72, 81, 42, 56, 63, 12, 16 · 55, 66, 77, 45, 54, 63, 10, 12 | clear | free |
| river | 72, 9, 52, 416, 133 | clear | free |
| 🦋 rounds, attack, last step | 35, 49, 63, 50, 70, 90 · 60, 64, 92 · 24, 32, 40, 54, 72, 90 · 18, 21, 33, 48, 56, 88 | clear (the trap result 66 meets 33 on a 4AM story line: a result, not a datum) | free |
| 🔍 rounds, last step | 20, 40, 55, 24, 48, 66, 115, 138 · 68, 92, 42,5, 57,5, 5/8, 8/5 | clear | free |
| final, box | 2, 3, 104, 115, 219, 230, 146, 73 · 177, 292, 0,5, 0,25, 584 | clear except « 2 ; 3 » (the stick and its shadow, the owner's mock-up numbers; single digits stand together in most sheets) | free |

**What changed since gate A, and why** (§8):

| Part | Was | Now | Why |
|---|---|---|---|
| river | 405, 45, 56, then 135, 15, 56 | 72, 9, 52 → 416 | the first sum was 506 for 504; then « 15 ; 56 » = l3-001's answer 56/15 |
| workshop pyramid | 130/100, then 76/57 | 90/99 (courses 10 → 88, 20 → 77, row 55 → 40) | 130 in a 2AM story, 100 in four sheets, course k 4/5; then « 68 ; 51 » on a 4AM story line |
| 🦋 last step | 60, 96, 114 / 70, 112, 133, then 40, 64, 50, 88 | 18, 48, 21, 88 → 56, 33 | 70 with 112 is l5-006; then « 64 ; 50 » |
| 🦋 attack | 51, 57, 60 / 119, 133, 140 | 24, 32, 40 / 54, 72, 90 | 119 and 140 stand in other stories |
| 🔑 attack 2 | 102, 114, 132 / 85, 95, 110, then 66, 88, 99 / 24, 32, 36 | 66, 77, 88 / 48, 56, 64 | 110 is in the bank; then « 24 ; 36 » (l5-005) and « 66 ; 99 » |
| 🦋 rounds | 48, 66, 84 / 56, 77, 98; crooked IQ = 74 (PQ = √9130), then 64, 69 → 97 | 35, 49, 63 / 50, 70, 90; crooked 60, 64 → 92 | an irrational side; then « 48 ; 84 », « 56 ; 98 » |

| field | 35, 42, 49 / 15, 18, 21; old canal 24, 25, 31 | 63, 72, 81 / 14, 16, 18; old canal 39, 28, 41 | « 15 ; 21 » and « 11 ; 17 » stand on 4AM story lines |
| 🔑 attack 1, 📐 plan, 📐 last step, 🔍 rounds, capstone | 34, 26, 17, 13 · 22, 33, 44 … · 52, 32, 20, 65 … · 40, 56, 64 … · 1/38 | 38, 32, 19, 16 · 54, 72, 81 … · 55, 66, 77 … · 20, 40, 55 … · 1/36 | pairs on other stories' lines (« 34 ; 17 », « 21 ; 28 », « 40 ; 56 », « 99 ; 2 » …) |

The mock-up's numbers are NOT reused. Its field (30, 40, 45, AM = 18 → 27, k = 0,6) is the bank's l5-005.

**The lesson's k**: 2/9 (the field), 1/2 (attack 1, the midpoint canal, by design), 8/11, 8/9, 7/9, 5/9, 7/9, 9/11,
1/8 (the river), 7/10, 4/9, 3/8, 1/36, 6/5 and 5/6, 5/8, and 73.

- None of them is written in the bank (`--numbers`), except 6/5 = 1,2, which l3-005 writes as a LENGTH, not as a k.
  The earlier field k 3/7 (l2-010's ratio AN/AC) is gone (gate N3).
- Small numbers (2 … 12) are in every sheet, so the rule applied is the headline pair, not the digit.

### 3.9 Around the story (the kit, the lesson's data)

| Part | What it is | New or kit |
|---|---|---|
| the felucca legs and the practice ladder | `world/run.js` (four numeric legs) and `world/practice.js` (a node per key plus « تحدّي الامتحان », levels on the river rail) | kit rail (K-b) + data |
| « تدرّب » | per knowledge card: segment-name ratios (P1), a length typed in its shape with its unit (P2, decimal box), k as a fraction box plus « تكبير / تصغير » (P3); figures by `GeoFigure` | kit + K-c + data |
| « الامتحان الأبيض » | the bank as it is: `createBankSittings({ lesson: 'talis-hisab-atwal' })` | kit (K-a: the figures) |
| « خريطة المعارف » | the four keys and the lesson's memo cards | kit + data |
| « عُدّة الانطلاق » | ONE family, « النسب في المثلث والرابع المتناسب » (3am.m2.r03 + 3am.m1.r08) | kit + a new family |
| « مختبري » | one instrument, « الحبل والمثلّث »: a triangle, a cut he moves, the gauge — drawn by the extended `GeoFigure` | NEW tool in `lessonlab/tools/` |
| the board | the hour runs on numbers other than the story's; each key is proved before its name; a `figure` station if one is missing | kit + data |
| the class test | every الكفاءة, with the keys re-computed | data |
| the evidence | 🔑 → P1; 📐 → P2; 🦋 → P1 and P2 (its computations); 🔍 → P3. Claims: `fraction` (existing) and `scale` (K-c) | data |

---

## 4. Lessons 2–4 of the unit on the same world

1. **`aksiya-talis`** (the converse, proving that lines are parallel). Back at « حقل النيل » at the next flood, he plants
   the stakes of a NEW canal and the world digs it. It is parallel only when $\frac{AM}{AB} = \frac{AN}{AC}$ AND the
   points stand in the same order; a butterfly stake on the wrong side is the trap. It builds on lesson 1's old canal,
   which is already its contrapositive. It adds a « level test » of the workshop's courses.
2. **`inshaat-talis`** (constructions: a segment cut into equal parts or in a ratio, the fourth proportional drawn). The
   rope-stretchers share a boundary into n equal lots with a fan of parallel ropes from an auxiliary line. It needs a
   new kind, `construct` (ruler and set-square on the sand); the rope's knots are the equal steps.
3. **`wadiya-idmajiya-talis`** (integration). It has no key: the docks become mission docks (`mission-isle`'s missions as
   data) — the felucca's endless river run, a ramp with its supports, a water tower seen over a pole, Pythagoras first.
   The bank's level-5 situations stay in the sitting.

---

## 5. France — `thales-configuration-papillon` (3e, « Thalès dans le papillon »)

`fr_dz_table.json` pairs this lesson with `talis-hisab-atwal` as `partial` (FR P1 ↔ DZ P1, FR P3 ↔ DZ P2) and notes
« check the DZ lesson before reuse ». **This design answers the note: the DZ lesson covers the butterfly, as key 🦋.**

- **Shared whole**:
  - the world: the scene, the law, the one slide and the one order, the kinds `plan`, `halfturn` and `scale`, and the
    forge's parts;
  - engine patches for the files that hold no sentence (`scripts/engine-patch.mjs`);
  - `strings.fr.js` with `DIR = 'ltr'` beside `strings.ar.js` — new code is split by country from its first day.
- **Shared keys**:
  - 🦋 is the heart of the French lesson, and `halfturn` IS the programme's own wording (« démonstration possible,
    utilisant une symétrie centrale pour se ramener à la configuration étudiée en quatrième »).
  - 📐 serves FR P3 (computing in the butterfly), with its `plan` rounds on butterflies.
  - 🔑's field becomes FR P2 « l'ordre des longueurs selon la configuration »: the same forge, with nested AND butterfly
    cases.
- **France cuts**:
  - 🔍 k, which 3e places in `triangles-semblables` and `homothetie`. The capstone stays in the world as a practice
    dock.
  - The 3AM nested chain is 4e in France, and no 4e lesson exists, so it becomes a launch family.
- **France adds**:
  - the brevet's written justification as the last step, a CHOICE of sentences (K-c);
  - its OWN bank, because none exists — the largest French cost;
  - a final mission led by the box (a butterfly), with the shadow as its warm-up.
- **Order**: DZ first (the owner, 2026-11-23). France takes the world once the DZ lesson is validated.

---

## 6. Build phases — files, owners, tokens (revised after gate A: cut hard)

These rules hold for every phase:

- One heavy check at a time.
- Agents that write at once touch files that do not overlap.
- No source is edited while a walk runs; walks run on a frozen copy (`SKILL.md` §4).
- Every agent is on **opus**, briefed from `briefs.md` with the ledger `defects.md`.

The figures are estimates from the ledger's measured lessons. A lesson on an existing world costs 2.3–2.9 M; the first
lesson of « قصر الساحات » cost 2.6 M of agents, its 3D not counted.

| # | Phase | Files | Owner | Tokens |
|---|---|---|---|---|
| 1 | **Grey box of the risks**: stage 1 WITH its prediction; ONE course order of stage 2 (compute → built → verdict); the two scale boxes of B6 (stage 3's bank and stage 5's plateau); the K-f hooks; sailing on the kit's rail AS IT IS (gate F3) | `nilePyramids/Game.js`, `gestures.js`, `orders.js`, `logic.js`, `scenery.js`, `NilePyramids.jsx`, `kit/WorldRuntime.js`, `worlds.js` | main session (3D) | ~0.5 M main |
| — | **STOP — the owner plays the grey box** | | owner | — |
| 2 | **Kit**, in parallel: K-a sitting figure ∥ K-b river look + hazards ∥ K-c decimal box, choice token, `scale` claim ∥ K-e exact, decimal bank check | §2.4 | 4 agents | 0.12 + 0.15 + 0.15 + 0.10 ≈ 0.52 M |
| 3 | **The world**: stages 2–5 as data and skins on the one slide and the one order (main session) ∥ the kinds `plan` ∥ `halfturn` ∥ `scale` (one agent each, own files) ∥ `ruleForge.js` + `forgeParts.jsx` through `GeoFigure` | §2.4 | main + 4 agents | ~0.5 M main + 0.22 + 0.15 + 0.20 + 0.12 ≈ 0.69 M |
| 4 | **Wave 1**, three agents in parallel: | | 3 agents | 0.35 + 0.30 + 0.20 ≈ 0.85 M |
| | (a) the written world — `practice.js`, `run.js` with the duplicate-buoy test, `trainer.js`, `sitting.js`, `journey.js`, `evidence.js`, `knowledge.js`, `text.js` | `lessons/moyen/4am/handasa/khassiyat-talis/talis-hisab-atwal/world/` | | |
| | (b) the board + the class test | `board/`, `content/class-tests/…` | | |
| | (c) the launch family + « الحبل والمثلّث » | `lessonlab/tools/` | | |
| 5 | **Wave 2**: `story.js`, `forges.js` and its test (per forge: sixteen rules, one holds, every false rule refuted, the bank guard), `inquiries.js` ∥ `lesson.pack.js`, the generated index, the old version traced and deleted | the lesson folder | 2 agents | 0.40 + 0.22 ≈ 0.62 M |
| 6 | **Walks** at 1366×768 on a frozen copy: `worlds/nilePyramids.mjs` (one slide player, one order player), `nilePyramidsExperiments.mjs`, `gateRun.mjs` (moved), the board's station; ONE reference walk on `jidhr-tarbii` for K-b, K-c and K-f, and one v2 sitting for K-a | `apps/web/e2e/lib/lessonWalk/` | 1 agent, alone in the tree | ~0.5 M |
| 7 | **Review** (every screen of a new world is new, so all of them, `review.md` §B) and **fix batches** | — | main + agents | ~0.2 M main + 0.25 M |
| 8 | **Checks**, one at a time: `lint`, `check:format`, `check:unused`, `check:unreached`, `check:lessons`, the web unit suite. Then: publish locally; the docs (`GAME_WORLD.md` §2ter-4, the master plan §4ter-0, this page); write the skill back (`defects.md`, `trusted.md`, `play.md`); a local commit on `feat/thales-pyramids` — **never pushed without the owner's word** | — | main | ~0.15 M main |
| 9 | **France**: the engine patch + `strings.fr.js`; the FR lesson's design stop; its bank; its waves | `../smarter-academy-fr-next` | main + agents | ~1.2–1.6 M |

**DZ total ≈ 3.4 M tokens of agents + ≈ 1.35 M of the main session ≈ 4.8 M.** The first version of this plan estimated
6.7 M. The cuts that made the difference:

- one gesture and one order;
- one drawing through `GeoFigure`;
- `ratio` and `fourth` are the existing `fraction` claim;
- K-c shrunk to two tokens;
- `halfturn` by ← →;
- numeric legs;
- one board and lab pass.

It is still over `TWO_PLATFORMS_PLAN.md`'s target for a world and its first lesson (2.5 M). A first world has never cost
that little, and this one also brings the kit's first geometry (figures in the sitting, decimal and choice boxes, three
runtime hooks, the river look of the rail). The target applies to lessons 2–4 on this world and to France.

---

## 7. Open question for the owner

**Stage 3 « عرض النيل »** uses the surveyor's classic method — two perpendiculars to the bank and a sight line — which the
bank's l5-001 also uses (a valley, BEM 2022). Here the letters (F, A, S, E, R), the numbers (72, 9, 52 → 416), the
place (the Nile's ferry) and the question (cut the ferry rope; no « justify the parallel ») are ours. Is that enough, or
should key 🦋 have another situation?

The STOP of phase 1 follows: the owner plays the grey box before anything else is built. Before the nouns spread over
forty strings (`play.md` §3), he reads them once: الحبل المعقود، العقدة، الوتد، سجلّ الحقل، القناة، المدماك، المقلع،
المرسى، الفلوكة، العوّامة، عمود المرسى المقابل، حجر القمّة، العصا، صندوق ابن الهيثم.

---

## 8. Gate A, answered

| # | Gate A's defect | The fix in this page |
|---|---|---|
| B1 | Stage 1 has no need and no prediction; thirteen rope measures | the lining must be ordered; he TYPES each canal's length before the rope reads it (21 right; 33,6 or 29,17 against 31); six rope measures (§3.3) |
| B2 | `WorldRuntime` is not « reused as it is »: fixed sun, ±26 shadow box, fog at 300, shadows dropped on slow machines | kit work K-f: `sunDir`, `shadowBox`, `fogRange` (main session, phase 1); a shadow that carries mathematics is a drawn mesh from `shadowTip`, never the shadow map (§1.4, §2.1, §2.4) |
| B3 | Boxes take digits only; `UseLines` has no choice token | K-c: a decimal box (« 77,5 ») in `UseLines` and the trainer, and a choice token in `UseLines` and inside a fraction (§2.4) |
| B4 | River: 405 + 45 + 56 = 506 for a width of 504 | 72, 9, 52 → 416, sum 133; every pair clear by the repo's script (§3.5) |
| B5 | The stick stands inside the pyramid's shadow | the stick stands in the sun beside it, its shadow parallel and measured; its drawn triangle slides along the axis until its tip sits on A (§3.7) |
| B6 | No scale rule from 2 m to the river's width | §1.5: one unit is a metre, the rope's speed per stage (≤ 8 s), `cameraShot('frame', box)`, fixed-size labels; stages 3 and 5 grey-boxed in phase 1 |
| P1 | A written gap gives the answer by one addition | the world writes no size; sizes are in the mirror only; a missed order stays as evidence (§2.1) |
| P2 | « [MB] لا يبدأ من الرأس A » says the criterion | sentence dropped; the fact is the course laid with its gap (§3.4) |
| P3 | Letter ratios on the rail with no figure | every leg is numeric (§1.3) |
| P4 | Two wrong 🦋 pairs are true equalities | their refutation names the third ratio (§3.5) |
| P5 | The old canal is the contrapositive of the converse | noted for lesson 2 (§3.1, §4) |
| P6 | k = 73 = 219 − 146 | accepted, said (§3.7) |
| P7 | « ONE number »: 40 may mean « forty times smaller » | the order card prints « كلّ طول × [ ] » (§3.6) |
| N1 | The generator can deal a wrong buoy equal to the right one | `run.js`'s test refuses it (§1.3) |
| N2 | The crooked butterfly's third side is irrational | IP = 60, IQ = 64 → PQ = 92 (§3.5) |
| N3 | « no k of the bank » was false (4/5; legs 0,8 and 3/2) | the courses now give 8/9, 7/9, 5/9; the legs say 0,7 and 7/4; the claim is withdrawn and 3/7 disclosed (§3.8) |
| N4 | The repo's check is stricter on numbers ≥ 100 and other stories | both scripts are run; OC = 70 / 112, 130, 100, 110, 119, 140 changed; 104 declared a metadata false hit, skipped by K-e (§3.8) |
| N5 | Noon shadow « about 18 m » | « about 17 m » (§3.7) |
| F1 | Extreme ratios cannot be drawn to scale | `scale` round 1 enters as a world fact; the mission's figures are schematic and say so (§2.3, §3.7) |
| F2 | `Game.js` was budgeted 1 600 lines for five mechanics | one slide and one order (`gestures.js`, `orders.js`); the stages are data (§2.4) |
| F3 | Phase 1 included the felucca before K-b | phase 1 sails on the rail as it is (§6) |
| F4 | The mission card names points and shows no figure | a schematic `GeoFigure` on the card; two columns (§3.7) |
| F5 | Both canals on one triangle crowd side AB | the mirror draws one canal per case (§2.3) |
| F6 | The law contradicted itself (the edge, water, the flat ground) | the rule is written once (§2.1): ground or built steps; never the river, never the air; a mark not yet built is typed and the masons build up to it |
| F7 | `plan`: three cards against the piece and difference cards | three ratio cards and the join/cut tool; the errors show in the typed value (§3.4) |
| O1 | Stage 3 was l5-001 letter for letter | letters, numbers, place and question changed; the method is disclosed; the owner's question (§7) |
| O2 | Stage 1 is l5-005's situation, undisclosed; stage 2's face is l5-008's figure | disclosed (§0.5); the canonical figure stays, with our numbers and our two-canal situation |
| O3 | Does `[5]/[8]` accept 85/136? | yes: values are compared (§3.6) |
| — | Capstone visible at 1366×768 | the summit is framed at its top 8 m: the capstone's 2,75 m base is about 250 px wide (§1.5) |

**After gate A — the pair-by-pair check (2026-11-24).** The decimal-aware `lesson-bank-numbers.mjs` (commit cb17ffb9),
run on EVERY pair within each group, found three collisions named by the coordinator — « 11 ; 17 » (the old canal's
pieces, on a line of `ikhtizal-kasr`'s story), « 15 ; 56 » (the river: l3-001's answer AC′ = 56/15), « 24 ; 36 » (🔑 attack
2: l5-005's « 60 − 36 = 24 ») — and fourteen more on other stories' lines. Every group was changed until every pair is
clear (§3.8; the one pair kept, « 2 ; 3 », is the stick and its shadow). What gate A checked still holds, recomputed:
the field's two predictions (18 right; 50,1… or 31,5 against the rope's 41); no sum of the river's data near its width
(133 and 81 for 416); no written size in the world; every k absent from the bank; the capstone framed at about 250 px.
**Stages 1 and 2 changed**: the field 63/72/81 with the canals 14/16/18 and 39/28/41; the pyramid's face 90/90/99 with
the courses BM 10 → 88, BM 20 → 77 and the row 55 → BM 40; the capstone 2,75 → k = 1/36.

**The gate's cheaper paths, all seven adopted.** None loses quality:

1. One gesture and one order.
2. K-d folds into `fraction` + `scale`.
3. K-c shrinks to two tokens.
4. One drawing through `GeoFigure` (the gauge is its one extension).
5. `halfturn` by ← → (his act is the prediction, not the rotation).
6. Numeric legs (P1's recognition is trained in « تدرّب » with figures, where a figure can be read).
7. Six rope measures.

## Documentation Sync

This pass wrote ONE file: this page. `docs/README.md`, `LESSON_V2_MASTER_PLAN.md` §4ter-0 and `GAME_WORLD.md` do not
name the world yet; they are updated with the first change that follows phase 1. No contract changed.
