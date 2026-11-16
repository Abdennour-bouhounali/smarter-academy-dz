/**
 * THE STUDENT'S ROAD through the lesson — PURE (2026-11-16): the two practice spaces and the progress page.
 *   « فضاء اللعب »     the gaming space first (the gate dash and the field missions — practice.js);
 *   « فضاء الامتحان »  then the real one: a ladder of exam sittings (sitting.js › LEVELS). The game lives BETWEEN its levels
 *                      (stars, a promotion), never inside a sitting.
 * `lessonProgress` is what the page « تقدّمي » shows, and `nextStep` the ONE thing to do now.
 */
import { PRACTICE_NODES, EXAM, levelId, nodeOpen, nextLevel, practiceStars, MAX_PRACTICE_STARS } from './practice';
import { LEVELS, PASS, sittingStars } from './sitting';

export const KEYS = ['qasim-baqi', 'qasim-jidaa', 'siyagh-mutakafia', 'wahid-wa-nafsuh'];
export const emptyExam = () => ({ best: {}, fails: {}, weak: {}, sittings: 0 });

/** The exam space opens once the student has PLAYED: the first run of each of the four keys is passed. */
export const examOpen = (keys, practice) => KEYS.every((k) => keys.includes(k)) && nodeOpen(PRACTICE_NODES.findIndex((n) => n.id === EXAM), keys, practice);
export const examLevelOpen = (exam, n) => n === 1 || (exam.best?.[n - 1]?.stars ?? 0) > 0;
export const examLevelsPassed = (exam) => LEVELS.filter((l) => (exam.best?.[l.n]?.stars ?? 0) > 0).length;
export const nextExamLevel = (exam) => LEVELS.find((l) => !((exam.best?.[l.n]?.stars ?? 0) > 0))?.n ?? null;

/**
 * A sitting was handed in. Returns the new exam state and what the student is told:
 *   passed (≥ 80 % of the points) — `promoted` when it is the first time this level is passed (the next level opens);
 *   otherwise the kinds of exercise to work on: the NEXT sheet of this level puts them first, with other numbers.
 */
export function applySitting(exam, level, mark, total, weak) {
  const stars = sittingStars(mark, total); const passed = mark >= total * PASS; const before = exam.best?.[level] ?? { stars: 0, mark: 0 };
  const next = {
    ...exam, sittings: (exam.sittings ?? 0) + 1,
    best: passed ? { ...exam.best, [level]: { stars: Math.max(before.stars, stars), mark: Math.max(before.mark, mark), total } } : { ...exam.best },
    fails: { ...exam.fails, [level]: passed ? 0 : (exam.fails?.[level] ?? 0) + 1 },
    weak: { ...exam.weak, [level]: passed ? [] : weak },
  };
  return { exam: next, result: { level, mark, total, stars, passed, promoted: passed && before.stars === 0, newBest: passed && stars > before.stars, weak: passed ? [] : weak, fails: next.fails[level], nextLevel: passed && level < LEVELS.length ? level + 1 : null, finished: passed && level === LEVELS.length } };
}

/** What « تقدّمي » shows: the road (five stations) and, per key, everything the student did with it. */
export function lessonProgress({ stage = 0, finished = false, keys = [], openKeys = [], practice = {}, know = {}, exam = emptyExam(), tally = {} }) {
  const has = (k) => openKeys.includes(k) || keys.includes(k);
  const rows = KEYS.map((key, i) => {
    const node = PRACTICE_NODES[i]; const stars = node.levels.reduce((t, _, l) => t + (practice[levelId(i, l)]?.stars ?? 0), 0); const t = tally[key] ?? { ok: 0, n: 0 };
    return { key, earned: has(key), game: { stars, max: node.levels.length * 3 }, sealed: (know.sealed ?? []).includes(key), exam: { ok: t.ok, n: t.n, rate: t.n ? t.ok / t.n : null } };
  });
  const passed = examLevelsPassed(exam);
  const road = [
    { id: 'story', done: finished ? 1 : Math.min(1, stage / 8), label: `${Math.min(stage, 8)} / 8` },
    { id: 'keys', done: rows.filter((r) => r.earned).length / 4, label: `${rows.filter((r) => r.earned).length} / 4` },
    { id: 'game', done: practiceStars(practice) / MAX_PRACTICE_STARS, label: `${practiceStars(practice)}\u00a0/\u00a0${MAX_PRACTICE_STARS}` },
    { id: 'exam', done: passed / LEVELS.length, label: `${passed}\u00a0/\u00a0${LEVELS.length}` },
    { id: 'know', done: (know.read ?? []).length / 13, label: `${(know.read ?? []).length} / 13` },
  ];
  // « جاهزيّتي للامتحان »: only what was done as in an exam counts — first tries on paper, and the ladder. Never the game's stars.
  const tries = rows.reduce((t, r) => ({ ok: t.ok + r.exam.ok, n: t.n + r.exam.n }), { ok: 0, n: 0 });
  const readiness = Math.round(100 * (0.5 * (passed / LEVELS.length) + 0.5 * (tries.n >= 4 ? tries.ok / tries.n : 0)));
  return { rows, road, readiness, tries };
}

/** The ONE thing to do now: finish the story, then play, then sit the exams — and train the weakest rule after two fails. */
export function nextStep(state) {
  const { stage = 0, finished = false, openKeys = [], practice = {}, exam = emptyExam(), tally = {} } = state;
  if (!finished && stage < 8 && openKeys.length < 4) return { do: 'story' };
  if (!examOpen(openKeys, practice)) { const n = nextLevel(openKeys, practice); return n ? { do: 'game', node: n.node, level: n.level } : { do: 'story' }; }
  const lvl = nextExamLevel(exam);
  if (lvl === null) { const n = nextLevel(openKeys, practice); return n ? { do: 'game', node: n.node, level: n.level } : { do: 'done' }; }
  if ((exam.fails?.[lvl] ?? 0) >= 2) { const worst = KEYS.map((k) => ({ k, r: tally[k]?.n ? tally[k].ok / tally[k].n : 1 })).sort((x, y) => x.r - y.r)[0]; return { do: 'train', key: worst.k, level: lvl }; }
  return { do: 'exam', level: lvl };
}
