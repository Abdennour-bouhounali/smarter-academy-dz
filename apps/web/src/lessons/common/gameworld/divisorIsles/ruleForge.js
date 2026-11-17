/**
 * « مصهر القاعدة » — the RULE FORGE (2026-11-18, owner: « the student … discover, touch, see, observe … until concluding the
 * maths rule — how are we giving him the chance to do that? »). PURE logic; the screen is RuleForge.jsx.
 *
 * A rule is not told, and it is not written in an empty box either: the student DEFENDS it.
 *   predict  three bridges he has not built: « will it hold? » — three right in a row and the rule is in his head;
 *   build    he composes his rule from two tiles: WHAT he looks at, and WHAT it must be (16 rules can be written, one holds);
 *   test     the rule is run on HIS OWN crossing — every bridge he fired, one by one; the first that contradicts it stops it;
 *   attack   a new gap chosen to BREAK his rule (the counterexample), or, when the rule is the right one, two hard gaps;
 *   seal     a rule that survives becomes his key; he may say it in his own words;
 *   use      one gap too long to count: the rule must decide.
 * The verdict is never the platform's opinion: it is a bridge that held or crumbled. The help never gives the rule.
 *
 * A rule = { q, c }: a QUANTITY read on the gap (a cells) and the plank (b cells), and a CONDITION on it. It can be evaluated
 * on any (a, b): that is what lets the game test it and look for the case that breaks it.
 */
import { divide } from './logic';

export const QUANTITIES = [
  {
    id: 'r',
    label: 'باقي قسمة طول الهوّة على طول اللوح',
    short: (a, b) => `باقي قسمة ${a} على ${b}`,
    of: (a, b) => a % b,
  },
  {
    id: 'q',
    label: 'حاصل قسمة طول الهوّة على طول اللوح',
    short: (a, b) => `حاصل قسمة ${a} على ${b}`,
    of: (a, b) => Math.floor(a / b),
  },
  { id: 'b', label: 'طول اللوح', short: () => 'طول اللوح', of: (a, b) => b },
  { id: 'a', label: 'طول الهوّة', short: () => 'طول الهوّة', of: (a) => a },
];
export const CONDITIONS = [
  { id: 'zero', label: 'يساوي 0', yes: 'يساوي 0', no: 'لا يساوي 0', test: (v) => v === 0 },
  { id: 'even', label: 'عدد زوجي', yes: 'عدد زوجي', no: 'عدد فردي', test: (v) => v % 2 === 0 },
  {
    id: 'lessB',
    label: 'أصغر من طول اللوح',
    yes: 'أصغر من طول اللوح',
    no: 'ليس أصغر من طول اللوح',
    test: (v, a, b) => v < b,
  },
  { id: 'gt1', label: 'أكبر من 1', yes: 'أكبر من 1', no: 'ليس أكبر من 1', test: (v) => v > 1 },
];
const Q = Object.fromEntries(QUANTITIES.map((x) => [x.id, x]));
const C = Object.fromEntries(CONDITIONS.map((x) => [x.id, x]));

/** Does the bridge really hold? The plank must fit at least once, and nothing may be left. */
export const holds = (a, b) => b >= 1 && b <= a && a % b === 0;
export const complete = (rule) => Boolean(rule && Q[rule.q] && C[rule.c]);
/** What the student's rule says of a bridge: « it holds » (true) or « it crumbles » (false). */
export const ruleSays = (rule, a, b) => C[rule.c].test(Q[rule.q].of(a, b), a, b);
export const isTheRule = (rule) => rule?.q === 'r' && rule?.c === 'zero';
export const ruleText = (rule) => `يثبت الجسر عندما: ${Q[rule.q].label} ${C[rule.c].label}.`;
/** His rule applied to one bridge, in words: « باقي قسمة 18 على 4 هو 2، و 2 لا يساوي 0: قاعدتك تقول إنّ الجسر ينهار ». */
export function explain(rule, a, b) {
  const v = Q[rule.q].of(a, b);
  const yes = ruleSays(rule, a, b);
  return `${Q[rule.q].short(a, b)} هو ${v}، و ${v} ${yes ? C[rule.c].yes : C[rule.c].no}: قاعدتك تقول إنّ الجسر ${yes ? 'يثبت' : 'ينهار'}.`;
}
export const outcome = (a, b) => {
  const { q, r } = divide(a, b);
  return { a, b, q, r, held: holds(a, b) };
};
export const sameCase = (x, y) => x.a === y.a && x.b === y.b;
export const EVIDENCE_MAX = 8;
const OWN_MAX = 5;

/**
 * The evidence: one line per different bridge, oldest first — the student's OWN crossing first (its last five bridges are
 * never pushed out), then the bridges the mirror built in front of him (`mirror: true`), eight lines at most.
 */
export function evidence(log) {
  const out = [];
  for (const row of log) {
    const i = out.findIndex((x) => sameCase(x, row));
    const was = i >= 0 ? out.splice(i, 1)[0] : null;
    out.push({ ...outcome(row.a, row.b), mirror: Boolean(row.mirror) && (was ? was.mirror : true) });
  }
  const own = out.filter((x) => !x.mirror).slice(-OWN_MAX);
  return [...own, ...out.filter((x) => x.mirror).slice(-(EVIDENCE_MAX - own.length))];
}

/** The rule run on the evidence, in order: each row agrees or not; `bad` = the first row that contradicts it (or −1). */
export function runOnEvidence(rule, rows) {
  const marks = rows
    .map((row) => ({ ...row, says: ruleSays(rule, row.a, row.b) }))
    .map((row) => ({ ...row, agrees: row.says === row.held }));
  return { marks, bad: marks.findIndex((m) => !m.agrees) };
}

const SMALL = (() => {
  const out = [];
  for (let a = 8; a <= 30; a += 1) for (let b = 2; b <= 9; b += 1) if (b < a) out.push({ a, b });
  return out;
})();
const fresh = (rows) => (c) => !rows.some((row) => sameCase(row, c));

/**
 * THE ATTACK. A wrong rule: the smallest new gap where the rule and the bridge disagree — the counterexample the student will
 * SEE (a rule that says « holds » on a bridge that crumbles is shown first: a fall is the clearest refutation). The right
 * rule: two gaps chosen against the usual false ideas — two even numbers that crumble, an odd plank that holds.
 */
export function attacks(rule, rows) {
  const free = SMALL.filter(fresh(rows));
  if (!isTheRule(rule)) {
    const breaks = free.filter((c) => ruleSays(rule, c.a, c.b) !== holds(c.a, c.b));
    const best = breaks.find((c) => ruleSays(rule, c.a, c.b)) ?? breaks[0];
    return best ? [outcome(best.a, best.b)] : [];
  }
  const evenFall = free.find((c) => c.a % 2 === 0 && c.b % 2 === 0 && c.b >= 4 && !holds(c.a, c.b) && c.a >= 14);
  const oddHold = free.find(
    (c) => c.b % 2 === 1 && c.b >= 3 && holds(c.a, c.b) && c.a / c.b >= 3 && c.a >= 15 && c.a !== evenFall?.a,
  );
  return [evenFall, oddHold].filter(Boolean).map((c) => outcome(c.a, c.b));
}

/** The predictions: bridges he has not built, which alternate — an easy one that holds, a trap that crumbles, an odd plank… */
export function predictCases(rows, rand = Math.random) {
  const free = SMALL.filter(fresh(rows));
  const pick = (list) => list[Math.floor(rand() * list.length)];
  const kinds = [
    (c) => holds(c.a, c.b) && c.b <= 5 && c.a <= 20,
    (c) => !holds(c.a, c.b) && c.a % 2 === 0 && c.b % 2 === 0,
    (c) => holds(c.a, c.b) && c.b % 2 === 1 && c.a % 2 === 1,
    (c) => !holds(c.a, c.b) && c.a % c.b === 1,
    (c) => holds(c.a, c.b) && c.b >= 6,
    (c) => !holds(c.a, c.b) && c.b % 2 === 1,
  ];
  const out = [];
  for (const kind of kinds) {
    const c = pick(free.filter((x) => kind(x) && !out.some((y) => sameCase(x, y) || y.a === x.a)));
    if (c) out.push(outcome(c.a, c.b));
  }
  return out;
}
export const PREDICT_NEED = 3;
/** How many right predictions end the list: three in a row and the rule is in his head. */
export const streak = (results) => {
  let n = 0;
  for (let i = results.length - 1; i >= 0 && results[i]; i -= 1) n += 1;
  return n;
};

/**
 * The help of the robot — it NEVER gives the rule. Three nudges, in this order:
 *   1 compare     two bridges of his own crossing over the same gap, one that held and one that crumbled (when he has them);
 *   2 experiment  two bridges built in the mirror in front of him: the same plank, a gap that fits and the next one that does not;
 *   3 choice      two rules to test — the right one and a false one. He must still test them: nothing is ticked for him.
 */
export function nudge(n, rows) {
  if (n === 1) {
    for (const x of rows) {
      const y = rows.find((z) => z.a === x.a && z.held !== x.held);
      if (y) return { kind: 'compare', cases: x.held ? [x, y] : [y, x] };
    }
  }
  if (n <= 2) {
    const b = [4, 3, 5].find((k) => !rows.some((row) => row.b === k && (row.a === k * 3 || row.a === k * 3 + 1))) ?? 4;
    return { kind: 'experiment', cases: [outcome(b * 3, b), outcome(b * 3 + 1, b)] };
  }
  return {
    kind: 'choice',
    rules: [
      { q: 'r', c: 'lessB' },
      { q: 'r', c: 'zero' },
    ],
  };
}

/** How the rule was found — what a teacher wants to know: alone, with a nudge of the robot, or guided to a choice of two. */
export const discoveryLevel = (nudges) => (nudges === 0 ? 'alone' : nudges < 3 ? 'nudged' : 'guided');

/** The last step: a gap too long to count. Half the time it holds. */
export function keyCase(rand = Math.random) {
  const list = [
    [96, 8],
    [91, 7],
    [108, 9],
    [100, 7],
    [110, 9],
    [94, 8],
  ];
  const [a, b] = list[Math.floor(rand() * list.length)];
  return outcome(a, b);
}
/** Is the division he wrote for the last step THE Euclidean division? */
export const keyRight = (c, q, r, verdict) => Number(q) === c.q && Number(r) === c.r && verdict === c.held;
