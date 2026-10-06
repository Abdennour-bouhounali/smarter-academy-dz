import { describe, it, expect } from 'vitest';
import { validateProblem } from '../../../../../../common/problems/guidedProblem';
import { PROBLEMS, PROBLEM } from './problems';
import { LESSON_CONFIG } from '../lesson.config';

// ── Arithmétique ENTIÈRE : aucune virgule flottante dans une fraction. ──────
const div = (a, b) => ({ q: Math.floor(a / b), r: a % b });
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
/** Les restes successifs de l'algorithme d'Euclide sur (a ; b), a > b. */
const euclidRemainders = (a, b) => {
  const rs = [];
  while (b !== 0) { const r = a % b; rs.push(r); a = b; b = r; }
  return rs;
};
/** Forme irréductible [n, d] par division par le PGCD. */
const reduce = (n, d) => { const g = gcd(n, d); return [n / g, d / g]; };
const fracTex = ([n, d]) => `$\\frac{${n}}{${d}}$`;
/** Somme / différence de fractions, en entiers. */
const add = ([a, b], [c, d]) => reduce(a * d + c * b, b * d);
const sub = ([a, b], [c, d]) => reduce(a * d - c * b, b * d);

const expectedOf = (id, part) => PROBLEM[id].parts[part].steps.filter((s) => s.kind === 'numeric').map((s) => s.expected);
const correctOf = (id, part, k) => { const s = PROBLEM[id].parts[part].steps.filter((st) => st.kind === 'choice')[k]; return s.options[s.correct]; };

// ── Vérificateur des ÉGALITÉS écrites (explain, lines, bonnes options) ───────
// Rationnels exacts [num, den] ; évalue + − × ÷ \frac, parenthèses.
const R = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(Math.abs(n), d) || 1; return [n / g, d / g]; };
const rAdd = (x, y) => R(x[0] * y[1] + y[0] * x[1], x[1] * y[1]);
const rSub = (x, y) => R(x[0] * y[1] - y[0] * x[1], x[1] * y[1]);
const rMul = (x, y) => R(x[0] * y[0], x[1] * y[1]);
const rDiv = (x, y) => R(x[0] * y[1], x[1] * y[0]);
function evalExpr(src) {
  const s = src.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '(($1)/($2))').replace(/\\times/g, '*').replace(/\\div/g, '/').replace(/\s+/g, '');
  if (!/^[\d+\-*/()]+$/.test(s)) return null; // contient une lettre, ; ou \ldots : non vérifiable ici
  let i = 0;
  const num = () => {
    if (s[i] === '(') { i++; const v = sum(); i++; return v; }
    if (s[i] === '-') { i++; const v = num(); return [-v[0], v[1]]; }
    let j = i; while (/\d/.test(s[i])) i++;
    return R(Number(s.slice(j, i)));
  };
  const prod = () => { let v = num(); while (s[i] === '*' || s[i] === '/') { const op = s[i++]; const w = num(); v = op === '*' ? rMul(v, w) : rDiv(v, w); } return v; };
  const sum = () => { let v = prod(); while (s[i] === '+' || s[i] === '-') { const op = s[i++]; const w = prod(); v = op === '+' ? rAdd(v, w) : rSub(v, w); } return v; };
  const v = sum();
  return i === s.length ? v : null;
}
/** Chaque formule $…$ : ses membres « = » sont égaux, « < » est vrai ; et PGCD$(a ; b) = g$ est exact. */
function checkText(text, where) {
  let checked = 0;
  for (const [, a, b, g] of text.matchAll(/PGCD\$\((\d+) ; (\d+)\) = (\d+)\$/g)) {
    expect(gcd(Number(a), Number(b)), `${where}: PGCD(${a} ; ${b})`).toBe(Number(g)); checked++;
  }
  for (const [, f] of text.matchAll(/\$([^$]+)\$/g)) {
    if (f.includes(';')) continue;
    const lt = f.split('<');
    if (lt.length === 2) {
      const [x, y] = lt.map(evalExpr);
      if (x && y) { expect(x[0] * y[1] < y[0] * x[1], `${where}: ${f}`).toBe(true); checked++; }
      continue;
    }
    const sides = f.split('=').map(evalExpr);
    if (sides.length < 2 || sides.some((v) => v == null)) continue;
    for (const v of sides.slice(1)) expect(v, `${where}: ${f}`).toEqual(sides[0]);
    checked++;
  }
  return checked;
}

describe('les مسائل du درس 8 « اختزال كسر »', () => {
  it('respect the GuidedProblem contract', () => {
    for (const p of PROBLEMS) expect(validateProblem(p)).toEqual([]);
  });

  it('match their modules (5, 6, 7 — track problem, practice_lab, before the test 8)', () => {
    const problemModules = LESSON_CONFIG.modules.filter((m) => m.track === 'problem');
    expect(problemModules.map((m) => [m.number, m.id, m.slug, m.stage, m.estimatedMin])).toEqual([
      [5, '05', 'masala-1', 'practice_lab', 8], [6, '06', 'masala-2', 'practice_lab', 8], [7, '07', 'masala-3', 'practice_lab', 8],
    ]);
    expect(LESSON_CONFIG.modules.at(-1)).toMatchObject({ id: '08', number: 8, slug: 'itqan', stage: 'evaluation' });
    expect(LESSON_CONFIG.modules.map((m) => m.number)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    expect(LESSON_CONFIG.modules.reduce((t, m) => t + m.estimatedMin, 0)).toBeLessThanOrEqual(90);
    expect(LESSON_CONFIG.lessonProblem.module).toBe(5);
    expect(PROBLEM['masala-1'].statement).toBe(LESSON_CONFIG.lessonProblem.statement);
    const situations = LESSON_CONFIG.resources.filter((r) => r.kind === 'situation');
    expect(situations.map((r) => [r.code, r.module])).toEqual([['masala-1', 5], ['masala-2', 6], ['masala-3', 7]]);
  });

  it('every demand has its own answer (owner rule 2026-10-06)', () => {
    for (const p of PROBLEMS) for (const part of p.parts) {
      part.asks.forEach((_, k) => {
        expect(part.steps.some((s) => s.ask === k && s.kind !== 'solution'), `${p.id} ${part.label} ask ${k + 1}`).toBe(true);
      });
    }
  });

  it('data: useful items, and at least one useless item that is a number', () => {
    for (const p of PROBLEMS) {
      expect(p.data.filter((d) => d.useful).length).toBeGreaterThanOrEqual(4);
      expect(p.data.some((d) => !d.useful && /\d/.test(d.text)), p.id).toBe(true);
      for (const d of p.data) expect(d.text.includes('$'), `${p.id} ${d.id}`).toBe(false);
    }
  });

  it('no bare « a/b » fraction in the Arabic text — every fraction is a $\\frac$', () => {
    const texts = (p) => [p.statement, ...p.parts.flatMap((part) => [part.question, ...part.asks, ...part.steps.flatMap((s) => [s.prompt, s.explain, ...(s.options ?? []), ...(s.lines ?? [])])])].filter(Boolean);
    for (const p of PROBLEMS) for (const t of texts(p)) expect(t.replace(/\$[^$]*\$/g, ''), `${p.id}: ${t}`).not.toMatch(/\d\s*\/\s*\d/);
  });

  it('every written equality (explain, solution lines, correct options) is exact', () => {
    let checked = 0;
    for (const p of PROBLEMS) p.parts.forEach((part, pi) => part.steps.forEach((s, si) => {
      const where = `${p.id} ${part.label} step ${si + 1}`;
      for (const t of [s.explain, s.prompt, ...(s.lines ?? [])].filter(Boolean)) checked += checkText(t, where);
      if (s.kind === 'choice') checked += checkText(s.options[s.correct], `${where} (correct option)`);
    }));
    expect(checked).toBeGreaterThan(60);
  });

  it('مسألة 1 — the numbers are computed, not typed', () => {
    const [S, F] = [105, 147];
    // 1) trois حصص : 3 divise les deux termes.
    expect([div(S, 3).r, div(F, 3).r]).toEqual([0, 0]);
    expect(expectedOf('masala-1', 0)).toEqual([S / 3, F / 3]);
    // 2) 5 divise 35 mais pas 49 ; 7 divise les deux ; 5/7 irréductible.
    const [s1, f1] = [S / 3, F / 3];
    expect(s1 % 5).toBe(0);
    expect(f1 % 5).not.toBe(0);
    expect([s1 % 7, f1 % 7]).toEqual([0, 0]);
    expect(expectedOf('masala-1', 1)).toEqual([div(f1, 5).r, s1 / 7, f1 / 7]);
    expect(gcd(s1 / 7, f1 / 7)).toBe(1);
    expect(reduce(S, F)).toEqual([s1 / 7, f1 / 7]);
    // 3) Euclide sur (147 ; 105), PGCD = 3 × 7 = nombre de حصص, prix.
    const g = gcd(F, S);
    expect(g).toBe(3 * 7);
    expect(expectedOf('masala-1', 2)).toEqual([...euclidRemainders(F, S), g, g, g * 2500]);
  });

  it('مسألة 2 — the numbers are computed, not typed', () => {
    const [T, rent, bills] = [54000, 12600, 16200];
    const rest = T - rent - bills;
    // 1) 12600/54000 : Euclide, PGCD 1800, 7/30.
    const g1 = gcd(T, rent);
    expect(expectedOf('masala-2', 0)).toEqual([...euclidRemainders(T, rent), g1, rent / g1, T / g1]);
    const f1 = reduce(rent, T);
    expect(correctOf('masala-2', 0, 0)).toBe(fracTex([rent, T]));
    expect(correctOf('masala-2', 0, 1)).toBe(fracTex(f1));
    // 2) 16200/54000 = 3/10 ; 7/30 + 3/10 = 16/30 = 8/15 ; = (12600 + 16200)/54000.
    const f2 = reduce(bills, T);
    expect(f2).toEqual([3, 10]);
    const n16 = f1[0] * (30 / f1[1]) + f2[0] * (30 / f2[1]);
    expect(expectedOf('masala-2', 1)).toEqual([...euclidRemainders(T, bills), f2[0] * (30 / f2[1]), n16]);
    const two = add(f1, f2);
    expect(two).toEqual(reduce(rent + bills, T));
    expect(reduce(n16, 30)).toEqual(two);
    expect(gcd(n16, 30)).toBe(2);
    expect(correctOf('masala-2', 1, 1)).toBe(fracTex(two));
    // 3) 1 − 8/15 = 7/15 = 25200/54000 ; 2/7 de 25200.
    const left = sub([1, 1], two);
    expect(left).toEqual(reduce(rest, T));
    expect(correctOf('masala-2', 2, 1)).toBe(fracTex(left));
    expect(rest % 7).toBe(0);
    expect(expectedOf('masala-2', 2)).toEqual([rent + bills, rest, (2 * rest) / 7]);
  });

  it('مسألة 3 — the numbers are computed, not typed', () => {
    const typeA = [84, 147], typeB = [72, 120], sown = 350, price = 150;
    // 1) Euclide sur (147 ; 84) → 21 → 4/7.
    const ga = gcd(typeA[1], typeA[0]);
    expect(expectedOf('masala-3', 0)).toEqual([...euclidRemainders(typeA[1], typeA[0]), ga]);
    expect(correctOf('masala-3', 0, 0)).toBe(fracTex(reduce(...typeA)));
    // 2) 72/120 = 3/5 ; au dénominateur 35 : 20 < 21 ; le piège : 84 > 72.
    const a = reduce(...typeA), b = reduce(...typeB);
    expect(correctOf('masala-3', 1, 0)).toBe(fracTex(b));
    expect(a[1] * b[1]).toBe(35);
    expect(expectedOf('masala-3', 1)).toEqual([gcd(...typeB), a[0] * b[1], b[0] * a[1]]);
    expect(a[0] * b[1]).toBeLessThan(b[0] * a[1]); // « ب » meilleur en proportion…
    expect(typeA[0]).toBeGreaterThan(typeB[0]); // …alors que « أ » a plus de graines levées
    // 3) 350 graines : 3/5 × 350 et 4/7 × 350 sont entiers.
    const pb = (b[0] * sown) / b[1], pa = (a[0] * sown) / a[1];
    expect([Number.isInteger(pb), Number.isInteger(pa)]).toEqual([true, true]);
    expect(expectedOf('masala-3', 2)).toEqual([pb, pa, pb - pa, (pb - pa) * price]);
  });
});
