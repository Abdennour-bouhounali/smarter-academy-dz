---
name: lesson-v2
description: Build, review or repair a « v2 » lesson of this repository (a lesson on a game world, like the pilot `qasim-adad-tabii`) — the pipeline, the brief of each agent, the ledger of every defect met so far with the check that catches it, the screenshot review. Use it BEFORE designing a lesson, before briefing any agent on a lesson, before reviewing a lesson's screenshots, and at the END of every lesson to write back what it taught.
---

# Lesson v2 — how a lesson is generated here, and how the next one is generated better

This skill is the project's memory of lesson generation. A session remembers nothing of the session before: what was
learned exists only if it is written HERE (or is a test in the code). So the skill has two halves that matter equally:

- **Before and during a lesson**: follow the pipeline below; build every agent brief from `briefs.md`; give every agent
  the ledger `defects.md`; review the screenshots with `review.md`; walk only what `trusted.md` does not already cover (§6).
- **After a lesson** (part of « done »): write back — §5.

The binding rules are the repository's: root `CLAUDE.md`, then `docs/architecture/LESSON_V2.md` (the pack, the folder,
the definition of done), `GAME_WORLD.md` (the kit, a world, the forge, « استكشف »), `LAUNCH_KIT.md`, `LESSON_LAB.md`,
`CLASS_SESSION.md`. The live state of the rollout is `docs/reports/LESSON_V2_MASTER_PLAN.md` §4ter-0. This skill never
restates those documents: it says how to WORK with them. If the skill and a contract disagree, the contract wins and the
skill is corrected in the same task.

## 1. Who does what

- **The main session designs, briefs, reviews, runs the walks and reports. Agents on `opus` write the code** (the 3D and a
  task judged complicated are coded by the main session). No cap on agents; agents that write at the same time touch
  files that do not overlap — say in each brief which files belong to whom.
- **One heavy check at a time** (a walk, the whole suite, a build, `check:lessons`, lint on the tree). An agent runs only
  the unit tests of what it touched (`npx vitest run <files> --maxWorkers=2`), `eslint` and `prettier --check` on its files.
- **Never edit source while a walk runs on that tree.** To walk while agents write, walk a FROZEN COPY: §4.

## 2. The pipeline of one lesson

| # | Step | Who | Output |
|---|---|---|---|
| 0 | `npm run lesson:brief -- <id>`, `npm run status:lesson-v2 -- --lesson <id>`; **never read the lesson's old version**; the exercise bank `content/practice/<grade>/<id>/` is used as it is | main | what the lesson must teach, الكفاءات and their weights in the bank |
| 1 | **Design** (`review.md` §A is the checklist): one key per rule; for each key its NATURE and the experiment of that nature — a (kind, mode) no other key of the lesson uses; the numbers; what the student holds when each forge opens; the final mission, which must NEED the lesson. Written in the unit's design page (`docs/reports/BATCH_2_DESIGN.md` is the model). A new kind or a new world mechanic is the owner's « go » | main | the design section |
| 2 | Kit work, only if a kind or a mode is missing — brief `briefs.md` §K | agent(s) | new files in the world's folder, registered LAST |
| 3 | **Wave 1, in parallel**: the written world (§W) ∥ the board, the class test, the launch-kit family (§B) | 2 agents | `world/` without forges, `board/`, `content/class-tests/…`, the family |
| 4 | **Wave 2, in parallel**: the forges and their experiments (§F) ∥ the pack, the satellites, the old version deleted (§P) | 2 agents | `world/forges.js`, `inquiries.js`, `lesson.pack.js`, the generated index |
| 5 | **The walks**, written and run at 1366×768 then 1024×768 by ONE agent that is alone in the tree (§X) | 1 agent | six walks, the defects they find fixed |
| 6 | **Review**: a frozen copy; the six walks at 1366×768, 1024×768, 1840×900; EVERY new screen looked at with the eyes (`review.md` §B) | main | a list of defects |
| 7 | **Fix batches** by agents that do not run walks (§R), then step 6 again on a new frozen copy, until nothing is left | agents, main | — |
| 8 | Repo checks, one at a time: `npm run lint`, `check:format`, `check:unused`, `check:unreached`, `check:lessons`, the web unit suite; published locally (lesson `available`, modules and exercises `published`) | main | — |
| 9 | Docs (`GAME_WORLD.md`, the design page, the master plan §4ter-0, a gate report), then the commit `feat(lessons): <id> — v2` on `dev`. **Never push, never touch `main`, without the owner's word** | main | the commit |
| 10 | **Write back into this skill** — §5 | main | `defects.md`, `briefs.md`, `review.md` updated in the same commit |

A lesson is done when its status line prints ✅, its tests pass, its walks pass at the three sizes and its screenshots
were looked at — and step 10 is made.

## 3. Briefing an agent

- Start from the template of `briefs.md`; fill its `<…>`; never write a brief from memory.
- Paste into EVERY brief the block « Limits » of `briefs.md` §0 and tell the agent to read `defects.md` — the ledger is
  the part of the brief that grows.
- Say what the agent holds that it cannot see: what the agents before it reported (hooks, numbers, what a walk must do).
- Ask for a report in the fixed shape of §0: what changed, what was run with numbers, what was NOT verified, what it is
  unsure of. An agent's report is not a fact: check the diff of anything shared (the kit, the walk library).
- An agent that hands back an open design choice gets an answer or the choice goes to the owner — never silence.

## 4. Walking while agents write: the frozen copy

Hot reload contaminates a walk, and waiting for every agent before every walk wastes hours. So a walk runs on a copy:

1. copy `apps/web` (without `node_modules`, `dist`, the screenshots under `e2e/`), `packages/core`, `content/` and the
   root `package.json` into a scratch folder; make its `node_modules` a folder of links to the real packages, except
   `@smarter-academy/core` and `web`, which point INSIDE the copy;
2. add a Vite config that merges the real one with `server: { port: 5174, strictPort: true, hmr: false, watch: null,
   fs: { strict: false } }` and start it from the copy;
3. run the copy's walks with `E2E_BASE=http://localhost:5174`;
4. after a new copy, RESTART that server (with no watcher it keeps the old modules).

`git archive HEAD` instead of a copy gives the same for the last commit (the walks owed on what was pushed).
The two scripts used on 2026-11-19 lived in the session's scratchpad; when this is done a third time, put them in
`apps/web/scripts/` and name them here.

## 5. The closing step — what makes the next lesson better

Before the lesson's commit, for EVERY defect met in the lesson (by a walk, by the eyes, by an agent, by the owner):

1. **Can a machine catch it?** Then add the check where it will run for every lesson: a unit test over all lessons (a
   glob of `world/*.js`), a check of the walk library (`e2e/lib/`), a line of `scripts/lesson-v2-status.mjs`. A check
   written inside one lesson's walk only is half done: note in `defects.md` that it must move to the shared library.
2. **Write its line in `defects.md`**: what it was, where it was first seen, what catches it now (the test's path, or
   « eye: `review.md` §… »), and the sentence a brief must carry so it is not made again.
3. **Correct the template** of `briefs.md` that let it through, and `review.md` if the eyes found something the list
   did not name.
4. Record the lesson's cost in `defects.md` §« Cost » (agents, tokens, minutes — the task notifications give them).

A defect that comes back although its line is in the ledger is the ledger's failure: the line is rewritten as a check.

## 6. What a new lesson does NOT check again (owner, 2026-11-19)

His words: « always enhance and improve the skill of building lessons by the feedback you get on the walk, so in the
future when you generate a lesson you do not check what 100 % works ». A walk is the most expensive part of a lesson
(`defects.md` « Cost »): it must be spent on what is NEW, never on re-proving what earlier lessons already proved.

**Every screen of a lesson is one of three things — say which in the walks' brief:**

| | What it is | How it is checked |
|---|---|---|
| **Proven kit** | a screen of the kit or of the world that the lesson only fills with data, already walked at the three sizes by earlier lessons and unchanged since (`trusted.md` lists them, with the commit that last changed each) | NOT walked again for this lesson. Its DATA is checked by a unit test that runs in seconds: the lesson's longest sentence, list and number against the limits the walks measured (`trusted.md` gives each limit) |
| **Changed kit** | a proven screen whose code changed since its last walk (`git log` on its files against the commit in `trusted.md`) | walked once, on ONE reference lesson, at the three sizes — not once per lesson |
| **New** | the lesson's own story, its forges' content, a world piece or an experiment kind used for the first time | walked at the three sizes and looked at with the eyes, as today |

**After every lesson, the closing step (§5) also feeds this:**
1. Every screen that passed at the three sizes and was looked at goes into `trusted.md`, with the commit, the lesson
   that proved it, and the LIMITS it was proved for (how long a sentence, how many items, how large a number).
2. Every failure a walk found that depended only on the lesson's DATA (a sentence too long for its card, a list on
   three lines, a tablet too tall) becomes a unit test over the lesson's data — so the next lesson learns it in seconds,
   without a browser.
3. A screen leaves `trusted.md` the moment its code changes or a lesson breaks it; it comes back after one walk.

**What is never trusted without a walk:** anything a student does for the first time in this lesson (its story from
the first island to the end), and any screen whose content exceeds the limits it was proved for. « It worked in the
last lesson » is not a proof for content of another size: the gate dash worked for five lessons and sent the hero to
the wrong island in the first lesson with a longer road (`defects.md` D6).
