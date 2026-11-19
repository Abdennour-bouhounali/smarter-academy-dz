# Proven screens — what a new lesson does not walk again

Read with `SKILL.md` §6. A line is added when a screen passed at 1366×768, 1024×768 and 1840×900 AND was looked at with
the eyes; it gives the commit, the lesson that proved it, and the LIMITS it was proved for. A lesson whose data stays
inside the limits checks that data by a unit test and does not walk the screen; a lesson that exceeds a limit walks it.
A line is REMOVED when the screen's code changes after its commit (`git log <commit>..HEAD -- <files>`) or a lesson
breaks it. **An empty table means: walk everything.**

| Screen | Files | Proved by, at commit | Proved for (limits) | Data test that stands in for the walk |
|---|---|---|---|---|
| The exam sitting « الامتحان الأبيض » — reading, sitting, corrected copy, the ladder | `kit/ExamSitting.jsx`, `kit/bankSitting.js`, `kit/Paper.jsx` | lessons 4 and 5 (`qasim-mushtarak-akbar`, `tayin-pgcd`), `919e2307`; every sheet of two banks, 100 sheets | sheets of the bank as they are; NOT proved: a table wider than the sheet (lesson `qawaid`: three sheets scroll sideways), a table drawn under 12 px (lesson 2 `l5-005`) | none yet — a lesson's bank is walked sheet by sheet until a test measures a sheet's widest table and longest line |
| The forge's frame — tiles, the mirror's test, a refutation, attacks, the seal, the last step, a tablet | `kit/RuleForge.jsx`, `kit/Tablet.jsx`, `divisorIsles/forgeParts.jsx` | lessons 4 and 5, `919e2307` + lesson 5's commit | 2 to 4 slots of tiles; a column heading up to « هوّة وهوّة من 0 خانة »; pair cases with gaps up to 90 cells in the mirror; a tablet of a method line, two lists and one note | each lesson's `forges.test.js` (tile and tag lengths); a tablet's size: none yet |
| The board — situation, `ask` stations, naming stations, copybook pages | `features/classSession/LessonBoard.jsx` | lessons 4 and 5 | up to 6 cards on an `ask`; an `after` of three chained equalities; a tablet as above | each lesson's `board.test.js` (cue ≤ 70 characters, tablet math ≤ 2 rows) |

Not yet proven (walk them for every lesson): the story of each lesson (always new); the practice hub and its mind map
(positions are the lesson's); the knowledge map (positions are the lesson's); « تدرّب » (its sheets are generated: a
random draw can exceed a line — lesson 5); the launch kit (cards drawn at random); the workshop and its bench (one
lesson only); a gap of 0 cells (one lesson only); the lab's instruments.
