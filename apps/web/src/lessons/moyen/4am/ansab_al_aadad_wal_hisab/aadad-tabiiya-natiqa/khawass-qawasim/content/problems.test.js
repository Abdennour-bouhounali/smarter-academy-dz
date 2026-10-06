import { describe, it, expect } from 'vitest';
import { validateProblem, demandsOf } from '../../../../../../common/problems/guidedProblem';
import { PROBLEMS, PROBLEM } from './problems';
import { LESSON_CONFIG } from '../lesson.config';

const div = (a, b) => ({ q: Math.floor(a / b), r: a % b });
const divides = (d, m) => m % d === 0;
const divisors = (m) => Array.from({ length: m }, (_, i) => i + 1).filter((d) => divides(d, m));
const expectedOf = (id, part) => PROBLEM[id].parts[part].steps.filter((s) => s.kind === 'numeric').map((s) => s.expected);
const stepsOf = (id, part, kind) => PROBLEM[id].parts[part].steps.filter((s) => s.kind === kind);
/** Toutes les égalités « a = b × c » / « a = b × c + r » écrites dans un texte (explain, lines, options). */
const EQ = /(?<![\d.,]|\\times\s*|[+\-(]\s*)(\d+)\s*=\s*(\d+)\s*\\times\s*(\d+)(?!\d|\s*\\times)(?:\s*\+\s*(\d+)(?!\d))?/g;
/** Toutes les opérations « x × y = z », « x + y = z », « x − y = z » écrites (une seule opération à gauche). */
const OP = /(?<![\d.,]|\\times\s*|[+\-(]\s*)(\d+)\s*(\\times|\+|-)\s*(\d+)\s*=\s*(\d+)(?![\d.,]|\s*\\times|\s*[+\-])/g;
const apply = (x, op, y) => (op === '+' ? x + y : op === '-' ? x - y : x * y);
const textsOf = (p) => p.parts.flatMap((part) => [part.question, ...part.steps.flatMap((s) => [s.prompt, s.explain, ...(s.lines ?? []), ...(s.options ?? [])])]).filter(Boolean);

describe('les مسائل du درس 3', () => {
  it('respect the GuidedProblem contract', () => {
    for (const p of PROBLEMS) expect(validateProblem(p)).toEqual([]);
  });

  it('match their modules (5, 6, 7 — track problem, practice_lab, before the test)', () => {
    const problemModules = LESSON_CONFIG.modules.filter((m) => m.track === 'problem');
    expect(problemModules.map((m) => [m.number, m.id, m.slug, m.stage, m.estimatedMin])).toEqual([
      [5, '05', 'masala-1', 'practice_lab', 8], [6, '06', 'masala-2', 'practice_lab', 8], [7, '07', 'masala-3', 'practice_lab', 8],
    ]);
    expect(LESSON_CONFIG.modules.at(-1)).toMatchObject({ id: '08', number: 8, slug: 'itqan', stage: 'evaluation' });
    expect(LESSON_CONFIG.modules.map((m) => m.number)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    expect(LESSON_CONFIG.lessonProblem.module).toBe(5);
    expect(PROBLEM['masala-1'].statement).toBe(LESSON_CONFIG.lessonProblem.statement);
    expect(LESSON_CONFIG.resources.filter((r) => r.kind === 'situation').map((r) => [r.code, r.module])).toEqual([
      ['masala-1', 5], ['masala-2', 6], ['masala-3', 7],
    ]);
    expect(LESSON_CONFIG.modules.reduce((t, m) => t + m.estimatedMin, 0)).toBeLessThanOrEqual(90);
  });

  it('every demand has its own answer (owner rule 2026-10-06)', () => {
    for (const p of PROBLEMS) for (const part of p.parts) {
      expect(part.asks.length, `${p.id} ${part.label}`).toBeGreaterThanOrEqual(Math.max(1, demandsOf(part.question)));
      part.asks.forEach((_, k) => {
        expect(part.steps.some((s) => s.ask === k && s.kind !== 'solution'), `${p.id} ${part.label} ask ${k + 1}`).toBe(true);
      });
    }
  });

  it('data: a numeric decoy in each problem, plain strings', () => {
    for (const p of PROBLEMS) {
      expect(p.data.filter((d) => d.useful).length).toBeGreaterThanOrEqual(4);
      expect(p.data.some((d) => !d.useful && /\d/.test(d.text)), p.id).toBe(true);
      for (const d of p.data) expect(d.text).not.toMatch(/\$/);
    }
  });

  it('every written equality « a = b × c (+ r) » is true, with r < b', () => {
    for (const p of PROBLEMS) for (const text of textsOf(p)) {
      for (const [, a, b, c, r] of text.matchAll(EQ)) {
        // « 1950 = 15 × 130 » ou « 875 = 350 × 2 + 175 » — jamais un nombre tapé faux.
        expect(Number(b) * Number(c) + Number(r ?? 0), `${p.id}: ${text}`).toBe(Number(a));
        if (r != null) expect(Number(r), `${p.id}: ${text}`).toBeLessThan(Number(b));
      }
    }
  });

  it('every written operation « x op y = z » is true', () => {
    let count = 0;
    for (const p of PROBLEMS) for (const text of textsOf(p)) {
      for (const [, x, op, y, z] of text.matchAll(OP)) {
        count += 1;
        expect(apply(Number(x), op, Number(y)), `${p.id}: ${text}`).toBe(Number(z));
      }
    }
    expect(count).toBeGreaterThan(20);
  });

  it('مسألة 1 — the numbers are computed, not typed', () => {
    const brick = 25, w1 = 875, w2 = 350, rows = 15, price = 40;
    // 1) 25 divise chaque mur, donc leur somme (خاصية 1).
    expect(divides(brick, w1) && divides(brick, w2)).toBe(true);
    expect(divides(brick, w1 + w2)).toBe(true);
    expect(expectedOf('masala-1', 0)).toEqual([w1 / brick, w2 / brick]);
    // 2) les panneaux de 350 sur le mur de 875 : le reste est fait de briques entières (خاصية 2).
    const d = div(w1, w2);
    expect(d.r).not.toBe(0);
    expect(divides(brick, d.r)).toBe(true);
    expect(expectedOf('masala-1', 1)).toEqual([d.q, d.r, d.q, d.r / brick]);
    // 3) briques : mur 2 entier + reste du mur 1, sur 15 rangs, à 40 دج.
    const perRow = w2 / brick + d.r / brick;
    expect(perRow).toBe((w2 + d.r) / brick);
    expect(expectedOf('masala-1', 2)).toEqual([perRow, perRow * rows, perRow * rows * price]);
    expect(perRow * rows * price).toBe(12600);
  });

  it('مسألة 2 — the numbers are computed, not typed', () => {
    const t1 = 1350, t2 = 600, weeks = 4;
    // 1) 15 divise les deux cuves ; 20 n'en divise qu'une (le piège).
    expect(divides(15, t1) && divides(15, t2)).toBe(true);
    expect(divides(20, t2)).toBe(true);
    expect(divides(20, t1)).toBe(false);
    expect(div(t1, 20)).toEqual({ q: 67, r: 10 });
    expect(expectedOf('masala-2', 0)).toEqual([t1 / 15, t2 / 15, t1 / 15, t2 / 15]);
    // 2) la citerne : 15 divise la somme sans calcul ; 20 ne la divise pas.
    const tank = t1 + t2, d20 = div(tank, 20);
    expect(divides(15, tank)).toBe(true);
    expect(d20.r).not.toBe(0);
    expect(expectedOf('masala-2', 1)).toEqual([tank, d20.r]);
    // 3) 15 divise 4 × 1950 (multiple), et le nombre de bidons.
    expect(divides(15, weeks * tank)).toBe(true);
    expect(expectedOf('masala-2', 2)).toEqual([tank / 15, (weeks * tank) / 15]);
    expect(weeks * (tank / 15)).toBe((weeks * tank) / 15);
  });

  it('مسألة 3 — the numbers are computed, not typed', () => {
    const gap = 30, h1 = 42, h2 = 54, pay = 6000;
    // 1) 42 et 72 : 6 convient, 8 non.
    const k1 = h1 + gap;
    expect(divides(6, h1) && divides(6, k1)).toBe(true);
    expect(divides(8, k1)).toBe(true);
    expect(divides(8, h1)).toBe(false);
    expect(expectedOf('masala-3', 0)).toEqual([k1, h1 / 6, k1 / 6, div(h1, 8).r]);
    // 2) la preuve : tout diviseur commun de h et h + 30 divise 30 — vérifié pour chaque h jusqu'à 300 ;
    //    8 ne divise pas 30, donc 8 ne marche pour aucun h.
    for (let h = 1; h <= 300; h += 1) {
      for (let d = 1; d <= h; d += 1) if (divides(d, h) && divides(d, h + gap)) expect(divides(d, gap)).toBe(true);
      expect(divides(8, h) && divides(8, h + gap)).toBe(false);
    }
    expect(div(gap, 8)).toEqual({ q: 3, r: 6 });
    // 3) h = 54, groupes de 5 à 10 : seuls les diviseurs de 30 sont candidats, et seul 6 convient.
    const k2 = h2 + gap;
    const candidates = divisors(gap).filter((d) => d >= 5 && d <= 10);
    expect(candidates).toEqual([5, 6, 10]);
    const fits = [5, 6, 7, 8, 9, 10].filter((d) => divides(d, h2) && divides(d, k2));
    expect(fits).toEqual([6]);
    expect(div(k2, 9)).toEqual({ q: 9, r: 3 });
    const groups = h2 / 6 + k2 / 6;
    expect(expectedOf('masala-3', 2)).toEqual([k2, div(h2, 5).r, groups, groups * pay]);
    expect(groups * pay).toBe(138000);
    // la conclusion choisie au 3) est bien 6
    const pick = stepsOf('masala-3', 2, 'choice').find((s) => s.prompt.startsWith('عدد منخرطي الفوج'));
    expect(Number(pick.options[pick.correct])).toBe(fits[0]);
  });
});
