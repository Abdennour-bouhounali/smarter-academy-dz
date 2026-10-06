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
      const a = expr();
      if (peek() !== ';') throw new Error(`; expected in « ${src} »`);
      i += 1;
      const b = expr();
      if (peek() !== ')') throw new Error(`) expected in « ${src} »`);
      i += 1;
      return gcd(a, b);
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
  .replace(/\\times/g, '*').replace(/\\ldots/g, '…').replace(/\\mathrm\{PGCD\}/g, 'PGCD')
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

describe('les مسائل du درس 6 (bahth-pgcd)', () => {
  it('respect the GuidedProblem contract', () => {
    for (const p of PROBLEMS) expect(validateProblem(p)).toEqual([]);
  });

  it('match their modules (5, 6, 7 — track problem, practice_lab, before the test 8)', () => {
    const problemModules = LESSON_CONFIG.modules.filter((m) => m.track === 'problem');
    expect(problemModules.map((m) => [m.number, m.id, m.slug, m.stage, m.estimatedMin])).toEqual([
      [5, '05', 'masala-1', 'practice_lab', 6], [6, '06', 'masala-2', 'practice_lab', 6], [7, '07', 'masala-3', 'practice_lab', 6],
    ]);
    expect(LESSON_CONFIG.modules.at(-1)).toMatchObject({ id: '08', number: 8, slug: 'itqan', stage: 'evaluation' });
    expect(LESSON_CONFIG.modules.map((m) => m.number)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    expect(LESSON_CONFIG.modules.reduce((t, m) => t + m.estimatedMin, 0)).toBeLessThanOrEqual(90);
    expect(LESSON_CONFIG.lessonProblem.module).toBe(5);
    expect(PROBLEM['masala-1'].statement).toBe(LESSON_CONFIG.lessonProblem.statement);
    expect(PROBLEMS.map((p) => p.id)).toEqual(['masala-1', 'masala-2', 'masala-3']);
    const situations = LESSON_CONFIG.resources.filter((r) => r.kind === 'situation' && r.code.startsWith('masala-'));
    expect(situations.map((r) => [r.code, r.module])).toEqual([['masala-1', 5], ['masala-2', 6], ['masala-3', 7]]);
  });

  it('every demand has its own answer (owner rule 2026-10-06)', () => {
    for (const p of PROBLEMS) for (const part of p.parts) {
      expect(part.asks.length, `${p.id} ${part.label}`).toBeGreaterThanOrEqual(demandsOf(part.question));
      part.asks.forEach((_, k) => {
        expect(part.steps.some((s) => s.ask === k && s.kind !== 'solution'), `${p.id} ${part.label} ask ${k + 1}`).toBe(true);
      });
    }
  });

  it('data: useful items, and at least one useless NUMBER (the decoy)', () => {
    for (const p of PROBLEMS) {
      expect(p.data.filter((d) => d.useful).length, p.id).toBeGreaterThanOrEqual(4);
      expect(p.data.some((d) => !d.useful && /\d/.test(d.text)), p.id).toBe(true);
      for (const d of p.data) for (const n of d.text.match(/\d+/g) ?? []) expect(p.statement, `${p.id} ${d.id}`).toContain(n);
    }
  });

  it('every written equality is true (explain, lines, options, prompts)', () => {
    const holes = [];
    let checked = 0;
    for (const p of PROBLEMS) for (const text of textsOf(p)) for (const chain of equalityChains(text)) {
      if (chain.some((side) => side === '' || side.includes('…'))) { holes.push(chain.join(' = ')); continue; }
      const values = chain.map(evaluate);
      for (const v of values) expect(v, `${p.id}: « ${chain.join(' = ')} »`).toBe(values[0]);
      checked += 1;
    }
    // La seule égalité non vérifiée est la case à compléter du prompt « $30 = 15 \\times \\ldots$ ».
    expect(holes).toEqual(['30 = 15 * …']);
    expect(checked).toBeGreaterThan(40);
  });

  it('the equality reader really reads (self-check)', () => {
    expect(equalityChains('$210 = 60 \\times 3 + 30$ مع $30 < 60$، إذن PGCD$(210 ; 150) = $ PGCD$(150 ; 60)$.').map((c) => c.map((side) => side.replace(/\s+/g, ''))))
      .toEqual([['210', '60*3+30'], ['PGCD(210;150)', 'PGCD(150;60)']]);
    expect(evaluate('PGCD(210 ; 150)')).toBe(30);
    expect(evaluate('5 * 380 + 3 * 110')).toBe(2230);
    expect(evaluate('60 * 3 + 30') === evaluate('211')).toBe(false);
  });

  it('مسألة 1 — the differences of 210 and 150, recomputed', () => {
    const chain = differences(210, 150);
    expect(chain.map((s) => s.d)).toEqual([60, 90, 30, 30, 0]);
    const g = lastNonZeroDifference(210, 150);
    expect(g).toBe(gcd(210, 150));
    // les trois premières différences, puis le PGCD (dernière différence non nulle)
    expect(expectedOf('masala-1', 0)).toEqual([chain[0].d, chain[1].d, chain[2].d, g]);
    // 2) 60 (dans la chaîne) ne divise pas 210 ; 15 divise le PGCD donc les deux
    expect(expectedOf('masala-1', 1)).toEqual([div(210, 60).r, g / 15]);
    expect(div(210, 60).r).not.toBe(0);
    expect(g % 15).toBe(0);
    expect(210 % 15 + 150 % 15).toBe(0);
    expect(chain.some((s) => s.d === 60)).toBe(true);
    // 3) nombre de pièces et montant
    const pieces = 210 / g + 150 / g;
    expect(expectedOf('masala-1', 2)).toEqual([210 / g, 150 / g, pieces, pieces * 450]);
  });

  it('مسألة 2 — Euclid on 1170 and 702, the crates and their value', () => {
    const chain = euclid(1170, 702);
    expect(chain.map((s) => [s.x, s.y, s.q, s.r])).toEqual([[1170, 702, 1, 468], [702, 468, 1, 234], [468, 234, 2, 0]]);
    const g = lastNonZeroRemainder(1170, 702);
    expect(g).toBe(gcd(1170, 702));
    expect(expectedOf('masala-2', 0)).toEqual([...chain.map((s) => s.r), g]);
    const cheese = 1170 / g, lben = 702 / g;
    expect(Number.isInteger(cheese) && Number.isInteger(lben)).toBe(true);
    expect(expectedOf('masala-2', 1)).toEqual([g, cheese, lben]);
    const value = cheese * 380 + lben * 110;
    expect(expectedOf('masala-2', 2)).toEqual([cheese * 380, lben * 110, value]);
    expect(value).toBeLessThanOrEqual(2500);
    expect(2500 - value).toBe(270);
    // le distracteur « 1872 » est bien le total des produits
    expect(1170 + 702).toBe(1872);
  });

  it('مسألة 3 — Euclid on 585 and 405, the method comparison, the tiles and their price', () => {
    const chain = euclid(585, 405);
    expect(chain.map((s) => [s.x, s.y, s.q, s.r])).toEqual([[585, 405, 1, 180], [405, 180, 2, 45], [180, 45, 4, 0]]);
    const g = lastNonZeroRemainder(585, 405);
    expect(g).toBe(gcd(585, 405));
    expect(lastNonZeroDifference(585, 405)).toBe(g);
    expect(expectedOf('masala-3', 0)).toEqual([...chain.map((s) => s.r), g]);
    // Le comptage du manuel (765 et 135 : 8 خطوات بالفروق، 3 قسمات) appliqué ici : 7 contre 3.
    expect([differences(765, 135).length, euclid(765, 135).length]).toEqual([8, 3]);
    const nDiff = differences(585, 405).length, nDiv = chain.length;
    expect([nDiff, nDiv]).toEqual([7, 3]);
    const conclude = steps('masala-3', 0).find((s) => s.kind === 'choice' && s.ask === 1);
    expect(conclude.options[conclude.correct]).toContain(`${nDiv} قسمات`);
    expect(conclude.options[conclude.correct]).toContain(`${nDiff} طرحات`);
    expect(steps('masala-3', 0).at(-1).lines.at(-1)).toContain(`${nDiv} قسمات`);
    expect(steps('masala-3', 0).at(-1).lines.at(-1)).toContain(`${nDiff} طرحات`);
    const along = 585 / g, across = 405 / g;
    expect(expectedOf('masala-3', 1)).toEqual([g, along, across, along * across]);
    const bought = along * across + 10;
    expect(expectedOf('masala-3', 2)).toEqual([bought, bought * 280]);
  });
});
