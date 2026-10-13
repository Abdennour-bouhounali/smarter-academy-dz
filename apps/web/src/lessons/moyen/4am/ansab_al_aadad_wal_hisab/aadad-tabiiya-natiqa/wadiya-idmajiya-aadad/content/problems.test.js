import { describe, it, expect } from 'vitest';
import { validateProblem, demandsOf } from '../../../../../../common/problems/guidedProblem';
import { PROBLEMS, PROBLEM } from './problems';
import { LESSON_CONFIG } from '../lesson.config';

// ── L'arithmétique de la leçon, réécrite ici pour tout recalculer ──────────
const div = (a, b) => ({ q: Math.floor(a / b), r: a % b });
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

/** Les différences successives, comme le manuel : on soustrait le petit du grand jusqu'au 0. */
function differences(a, b) {
  const steps = [];
  let [x, y] = a >= b ? [a, b] : [b, a];
  for (;;) {
    const d = x - y;
    steps.push({ x, y, d });
    if (d === 0) return steps;
    [x, y] = y >= d ? [y, d] : [d, y];
  }
}
/** Les divisions successives d'Euclide jusqu'au reste nul. */
function euclid(a, b) {
  const steps = [];
  let [x, y] = a >= b ? [a, b] : [b, a];
  while (y !== 0) {
    const { q, r } = div(x, y);
    steps.push({ x, y, q, r });
    [x, y] = [y, r];
  }
  return steps;
}
const lastNonZeroDifference = (a, b) => differences(a, b).filter((s) => s.d !== 0).at(-1).d;
const lastNonZeroRemainder = (a, b) => euclid(a, b).filter((s) => s.r !== 0).at(-1).r;

const steps = (id, part) => PROBLEM[id].parts[part].steps;
const expectedOf = (id, part) => steps(id, part).filter((s) => s.kind === 'numeric').map((s) => s.expected);

// ── Toute égalité écrite (explain, lines, options, prompts, rows) est recalculée ──
// On lit « a = b = c » où chaque membre est fait d'entiers, + − ×, parenthèses
// et PGCD( ; ) ; un membre qui contient « … » (une case à compléter) est sauté
// et doit figurer dans la liste des trous attendus.
function evaluate(src) {
  let i = 0;
  const s = src.replace(/\s+/g, '');
  const peek = () => s[i];
  const num = () => {
    const m = /^\d+/.exec(s.slice(i));
    if (!m) throw new Error(`number expected in « ${src} »`);
    i += m[0].length;
    return Number(m[0]);
  };
  function factor() {
    if (s.startsWith('PGCD(', i)) {
      i += 5;
      let g = expr();
      // PGCD de deux OU trois nombres (وضعية 4) : PGCD(a ; b ; c) = PGCD(PGCD(a ; b) ; c).
      while (peek() === ';') { i += 1; g = gcd(g, expr()); }
      if (peek() !== ')') throw new Error(`) expected in « ${src} »`);
      i += 1;
      return g;
    }
    if (peek() === '(') { i += 1; const v = expr(); if (peek() !== ')') throw new Error(`) expected in « ${src} »`); i += 1; return v; }
    return num();
  }
  function term() { let v = factor(); while (peek() === '*') { i += 1; v *= factor(); } return v; }
  function expr() { let v = term(); while (peek() === '+' || peek() === '-') { const op = s[i]; i += 1; const t = term(); v = op === '+' ? v + t : v - t; } return v; }
  const v = expr();
  if (i !== s.length) throw new Error(`trailing input in « ${src} »`);
  return v;
}
const normalise = (text) => text
  .replace(/\\times/g, '*').replace(/\\ldots/g, '…').replace(/\\(?:mathrm|text)\{PGCD\}/g, 'PGCD')
  .replace(/\$/g, ' ').replace(/−/g, '-').replace(/×/g, '*');
/** Les chaînes d'égalités d'un texte : [[membre, membre, …], …]. */
const equalityChains = (text) => (normalise(text).match(/[0-9PGCD()+\-*;=…\s]+/g) ?? [])
  .filter((seg) => seg.includes('='))
  .map((seg) => seg.split('=').map((side) => side.trim()));

function textsOf(problem) {
  const out = [];
  for (const part of problem.parts) {
    out.push(part.question);
    for (const st of part.steps) {
      for (const k of ['prompt', 'explain']) if (st[k]) out.push(st[k]);
      for (const o of st.options ?? []) out.push(o);
      for (const l of st.lines ?? []) out.push(l);
      for (const r of st.rows ?? []) out.push(r.label, r.correction);
    }
  }
  return out.filter(Boolean);
}

describe('les six وضعيات d\'entraînement de أدمج تعلّماتي (wadiya-idmajiya-aadad)', () => {
  it('respect the GuidedProblem contract', () => {
    for (const p of PROBLEMS) expect(validateProblem(p)).toEqual([]);
  });

  it('match their modules (1 to 6, practice_lab, then the analysis 7, then the final test 8)', () => {
    const problemModules = LESSON_CONFIG.modules.filter((m) => m.track === 'problem');
    expect(problemModules.map((m) => [m.number, m.id, m.slug, m.stage])).toEqual(
      [1, 2, 3, 4, 5, 6].map((k) => [k, `0${k}`, `wadiya-${k}`, 'practice_lab']),
    );
    // « تحليل الوضعية النهائية للاختبار » : juste avant le test, après tous les entraînements
    expect(LESSON_CONFIG.modules.at(-2)).toMatchObject({ id: '07', number: 7, slug: 'al-wadiya', title: 'تحليل الوضعية النهائية للاختبار', stage: 'practice_lab' });
    expect(LESSON_CONFIG.modules.at(-2).track).toBeUndefined();
    expect(LESSON_CONFIG.modules.at(-1)).toMatchObject({ id: '08', number: 8, slug: 'ahill', stage: 'evaluation', title: 'وضعية الاختبار النهائي' });
    expect(LESSON_CONFIG.modules.map((m) => m.number)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    expect(LESSON_CONFIG.modules.reduce((t, m) => t + m.estimatedMin, 0)).toBeLessThanOrEqual(90);
    expect(PROBLEMS.map((p) => p.id)).toEqual(problemModules.map((m) => m.slug));
    const situations = LESSON_CONFIG.resources.filter((r) => r.code.startsWith('wadiya-'));
    expect(situations.map((r) => [r.code, r.module])).toEqual([1, 2, 3, 4, 5, 6].map((k) => [`wadiya-${k}`, k]));
  });

  it('every training module is titled « الوضعية التدريبية N », and the aprons situation of the final test is NOT trained on', () => {
    const problemModules = LESSON_CONFIG.modules.filter((m) => m.track === 'problem');
    problemModules.forEach((m, i) => expect(m.title.startsWith(`الوضعية التدريبية ${i + 1} —`), m.title).toBe(true));
    PROBLEMS.forEach((p, i) => expect(p.title.startsWith(`الوضعية التدريبية ${i + 1} —`), p.title).toBe(true));
    // the final-test situation (936 / 845) must stay unseen: no training statement or step mentions it
    for (const p of PROBLEMS) expect(JSON.stringify(p), p.id).not.toMatch(/936|845/);
    expect(LESSON_CONFIG.modules.some((m) => m.slug === 'uakkid')).toBe(false);
  });

  it('no sub-step is an assessment: mastery comes from module 8 only', () => {
    for (const p of PROBLEMS) for (const part of p.parts) for (const s of part.steps) expect(s.assessment, p.id).toBeUndefined();
    for (const m of LESSON_CONFIG.modules.filter((x) => x.track === 'problem')) expect(m.stage).toBe('practice_lab');
  });

  it('every demand has its own answer (owner rule 2026-10-06)', () => {
    for (const p of PROBLEMS) for (const part of p.parts) {
      expect(part.asks.length, `${p.id} ${part.label}`).toBeGreaterThanOrEqual(demandsOf(part.question));
      part.asks.forEach((_, k) => {
        expect(part.steps.some((s) => s.ask === k && s.kind !== 'solution'), `${p.id} ${part.label} ask ${k + 1}`).toBe(true);
      });
    }
  });

  it('every number written in an exam-sheet statement is in the statement', () => {
    for (const p of PROBLEMS) expect(p.statement).toMatch(/\d/);
  });

  it('every written equality is true (explain, lines, options, prompts)', () => {
    const holes = [];
    let checked = 0;
    for (const p of PROBLEMS) for (const text of textsOf(p)) for (const chain of equalityChains(text)) {
      if (chain.some((side) => side === '' || side.includes('…'))) { holes.push(`${p.id}: ${chain.join(' = ')}`); continue; }
      const values = chain.map(evaluate);
      for (const v of values) expect(v, `${p.id}: « ${chain.join(' = ')} »`).toBe(values[0]);
      checked += 1;
    }
    expect(holes).toEqual([]);
    expect(checked).toBeGreaterThan(80);
  });

  it('the equality reader really reads (self-check)', () => {
    expect(evaluate('PGCD(3090 ; 1854)')).toBe(618);
    expect(evaluate('262 * 650 + 1572 * 350 + 65000 + 25000')).toBe(810500);
    expect(evaluate('60 * 3 + 30') === evaluate('211')).toBe(false);
  });

  // ── Chaque nombre attendu, recalculé depuis l'énoncé ─────────────────────
  const remainders = (a, b) => euclid(a, b).map((s) => s.r);

  it('وضعية 1 — 3090 notebooks and 1854 books', () => {
    const g = gcd(3090, 1854);
    expect(g).toBe(618);
    expect(expectedOf('wadiya-1', 0)).toEqual([...remainders(3090, 1854), g]);
    expect(expectedOf('wadiya-1', 1)).toEqual([3090 / g, 1854 / g]);
    expect(3090 % g + 1854 % g).toBe(0);
  });

  it('وضعية 2 — 161 white and 133 red flowers', () => {
    const g = gcd(161, 133);
    expect(expectedOf('wadiya-2', 0)).toEqual([...remainders(161, 133), g]);
    expect(g).toBe(7);
    expect(expectedOf('wadiya-2', 1)).toEqual([133 / g, 161 / g]); // red, then white (asks order)
    expect(161 % g + 133 % g).toBe(0);
  });

  it('وضعية 3 — the 612 × 174 field: spacing, posts, cost', () => {
    const g = gcd(612, 174);
    expect(expectedOf('wadiya-3', 0)).toEqual([...remainders(612, 174), g, g]);
    const perimeter = 2 * (612 + 174);
    const posts = perimeter / g; // closed contour: as many posts as intervals
    expect(Number.isInteger(posts)).toBe(true);
    expect(expectedOf('wadiya-3', 1)).toEqual([perimeter, posts]);
    const postsCost = posts * 650, fenceCost = perimeter * 350;
    expect(expectedOf('wadiya-3', 2)).toEqual([postsCost, fenceCost, postsCost + fenceCost + 65000 + 25000]);
    // the closed-contour trap: the three wrong options are really different numbers
    expect(posts).not.toBe(posts - 1);
  });

  it('وضعية 4 — the 183 / 135 / 99 triangle: PGCD of three numbers, trees, cost', () => {
    const g2 = gcd(183, 135);
    const g3 = gcd(g2, 99);
    expect(g2).toBe(3);
    expect(g3).toBe(gcd(gcd(183, 99), 135)); // associativity: the order of the numbers does not matter
    expect(expectedOf('wadiya-4', 0)).toEqual([...remainders(183, 135), 99 % g2, g3, g3]);
    const perimeter = 183 + 135 + 99;
    const trees = perimeter / g3;
    expect(Number.isInteger(trees)).toBe(true);
    expect(expectedOf('wadiya-4', 1)).toEqual([perimeter, trees]);
    expect(expectedOf('wadiya-4', 2)).toEqual([trees * 1200, trees * 600, trees * 1200 + trees * 600]);
    // 183, 135 and 99 are all multiples of the spacing (a tree at each corner)
    for (const side of [183, 135, 99]) expect(side % g3).toBe(0);
  });

  it('وضعية 5 — the 2.20 m × 1.40 m glass sheet, in centimetres', () => {
    const [L, W] = [Math.round(2.2 * 100), Math.round(1.4 * 100)];
    expect([L, W]).toEqual([220, 140]);
    const g = gcd(L, W);
    expect(expectedOf('wadiya-5', 0)).toEqual([L, W, ...remainders(L, W), g, g]);
    expect(expectedOf('wadiya-5', 1)).toEqual([L / g, W / g, (L / g) * (W / g)]);
    expect((L / g) * (W / g) * g * g).toBe(L * W); // the squares tile the sheet exactly
  });

  it('وضعية 6 — the 8.4 m × 4.4 m hall, in centimetres', () => {
    const [L, W] = [Math.round(8.4 * 100), Math.round(4.4 * 100)];
    expect([L, W]).toEqual([840, 440]);
    const g = gcd(L, W);
    expect(expectedOf('wadiya-6', 0)).toEqual([L, W, ...remainders(L, W), g]);
    expect(expectedOf('wadiya-6', 1)).toEqual([L / g, W / g, (L / g) * (W / g)]);
    expect((L / g) * (W / g) * g * g).toBe(L * W);
  });

  it('the statements keep the sheet\'s numbers (رياضيات ببساطة)', () => {
    const has = (id, ...nums) => nums.forEach((n) => expect(PROBLEM[id].statement, `${id} ${n}`).toContain(String(n)));
    has('wadiya-1', 3090, 1854);
    has('wadiya-2', 161, 133);
    has('wadiya-3', 612, 174, 650, 350, 65000, 25000);
    has('wadiya-4', 183, 135, 99, 1200, 600);
    has('wadiya-5', '2.20', '1.40');
    has('wadiya-6', '8.4', '4.4');
  });
});
