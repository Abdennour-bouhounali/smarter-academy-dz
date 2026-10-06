import { describe, it, expect } from 'vitest';
import { validateProblem } from '../../../../../../common/problems/guidedProblem';
import { PROBLEMS, PROBLEM } from './problems';
import { LESSON_CONFIG } from '../lesson.config';

const div = (a, b) => ({ q: Math.floor(a / b), r: a % b });
const divisors = (n) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
/** Le plus grand d tel que d² ≤ n : la borne de la طريقة. */
const bound = (n) => { let d = 1; while ((d + 1) * (d + 1) <= n) d += 1; return d; };
const list = (ds) => ds.join(' ، ');
const stepsOf = (id, part) => PROBLEM[id].parts[part].steps;
const expectedOf = (id, part) => stepsOf(id, part).filter((s) => s.kind === 'numeric').map((s) => s.expected);
const chosen = (step) => step.options[step.correct];
const conclusions = (id, part) => stepsOf(id, part).filter((s) => s.kind === 'choice' && s.role === 'conclude');
const batchOf = (id, part) => stepsOf(id, part).find((s) => s.kind === 'batch');
/** Chaque ligne « d … n » : « يقسم » exactement quand d divise n. */
const checkBatch = (batch) => {
  for (const row of batch.rows) {
    const [d, n] = row.label.split(' … ').map(Number);
    expect(row.options[row.correct], row.label).toBe(n % d === 0 ? 'يقسم' : 'لا يقسم');
    expect(row.correction.startsWith(`${d} ${n % d === 0 ? 'يقسم' : 'لا يقسم'} ${n}`), row.label).toBe(true);
  }
};
/** Toutes les égalités « a = b \times c (+ r) » écrites dans un texte sont vraies. */
const checkEqualities = (text) => {
  const chain = /\$([^$]*)\$/g;
  const evalMember = (m) => {
    const clean = m.trim().replace(/\\times/g, '*').replace(/\^/g, '**');
    return /^[\d\s*+-]+$/.test(clean) ? Function(`return (${clean});`)() : null;
  };
  for (const [, tex] of text.matchAll(chain)) {
    // Un encadrement « 9^2 = 81 \leq 96 < 100 = 10^2 » : des chaînes d'égalités
    // reliées par ≤ / < — chaque chaîne est constante, et l'ordre est respecté.
    const ops = tex.match(/\\leq|</g) ?? [];
    const segments = tex.split(/\\leq|</).map((seg) => seg.split('=').map(evalMember));
    for (const seg of segments) {
      const nums = seg.filter((v) => v !== null);
      if (nums.length >= 2) expect(new Set(nums).size, tex).toBe(1);
    }
    ops.forEach((op, i) => {
      const left = segments[i].at(-1), right = segments[i + 1][0];
      if (left === null || right === null) return;
      if (op === '<') expect(left < right, tex).toBe(true);
      else expect(left <= right, tex).toBe(true);
    });
  }
};

describe('les مسائل du درس 2', () => {
  it('respect the GuidedProblem contract', () => {
    for (const p of PROBLEMS) expect(validateProblem(p)).toEqual([]);
  });

  it('match their modules (4, 5, 6 — track problem, practice_lab, before the test)', () => {
    const problemModules = LESSON_CONFIG.modules.filter((m) => m.track === 'problem');
    expect(problemModules.map((m) => [m.number, m.id, m.slug, m.stage, m.estimatedMin])).toEqual([
      [4, '04', 'masala-1', 'practice_lab', 8], [5, '05', 'masala-2', 'practice_lab', 8], [6, '06', 'masala-3', 'practice_lab', 8],
    ]);
    expect(LESSON_CONFIG.modules.at(-1)).toMatchObject({ id: '07', number: 7, slug: 'itqan', stage: 'evaluation' });
    expect(LESSON_CONFIG.modules.map((m) => m.number)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    expect(LESSON_CONFIG.modules.reduce((t, m) => t + m.estimatedMin, 0)).toBeLessThanOrEqual(90);
    expect(LESSON_CONFIG.lessonProblem.module).toBe(4);
    expect(PROBLEM['masala-1'].statement).toBe(LESSON_CONFIG.lessonProblem.statement);
    expect(LESSON_CONFIG.resources.filter((r) => r.kind === 'situation').map((r) => [r.code, r.module])).toEqual([
      ['masala-1', 4], ['masala-2', 5], ['masala-3', 6],
    ]);
  });

  it('every demand has its own answer (owner rule 2026-10-06)', () => {
    for (const p of PROBLEMS) for (const part of p.parts) {
      part.asks.forEach((_, k) => {
        expect(part.steps.some((s) => s.ask === k && s.kind !== 'solution'), `${p.id} ${part.label} ask ${k + 1}`).toBe(true);
      });
    }
  });

  it('the decoys include a number, and every statement number of a useful item is in the statement', () => {
    for (const p of PROBLEMS) {
      const useless = p.data.filter((d) => !d.useful);
      expect(useless.some((d) => /\d/.test(d.text)), p.id).toBe(true);
      for (const d of p.data) for (const n of d.text.match(/\d+/g) ?? []) expect(p.statement.includes(n), `${p.id} ${n}`).toBe(true);
    }
  });

  it('every written equality is true', () => {
    for (const p of PROBLEMS) for (const part of p.parts) for (const s of part.steps) {
      for (const t of [s.explain, s.prompt, ...(s.lines ?? []), ...(s.options ?? []), ...(s.rows ?? []).map((r) => r.correction)]) {
        if (typeof t === 'string') checkEqualities(t);
      }
    }
  });

  it('مسألة 1 — 96 livres : the numbers are computed, not typed', () => {
    const n = 96, b = bound(n), ds = divisors(n);
    expect(b).toBe(9);
    expect(b * b <= n && (b + 1) * (b + 1) > n).toBe(true);
    expect(expectedOf('masala-1', 0)).toEqual([b, n / 3, n / 8]);
    checkBatch(batchOf('masala-1', 0));
    expect(batchOf('masala-1', 0).rows.map((r) => Number(r.label.split(' … ')[0]))).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
    expect(chosen(conclusions('masala-1', 0)[0])).toBe(list(ds));
    // Les distracteurs sont faux : arrêt à la borne, 1 et 96 oubliés, 9 ajouté.
    for (const o of conclusions('masala-1', 0)[0].options.slice(1)) expect(o).not.toBe(list(ds));
    expect(conclusions('masala-1', 0)[0].options[1]).toBe(list(ds.filter((d) => d <= b)));

    // 2) 14 échoue ; entre 10 et 20 : 12 et 16.
    const d14 = div(n, 14);
    expect(d14.r).not.toBe(0);
    const ok = ds.filter((d) => d >= 10 && d <= 20);
    expect(ok).toEqual([12, 16]);
    expect(chosen(conclusions('masala-1', 1)[1])).toBe(ok.join(' أو '));
    expect(expectedOf('masala-1', 1)).toEqual([d14.q, d14.r, n / 12, n / 16]);

    // 3) rayons courts (≤ 12) pour 12, longs pour 16 : le moins de rayons n'est pas le moins cher.
    const shortCost = (n / 12) * 1400, longCost = (n / 16) * 2200;
    expect(expectedOf('masala-1', 2)).toEqual([shortCost, longCost, longCost - shortCost]);
    expect(shortCost).toBeLessThan(longCost);
    expect(n / 12).toBeGreaterThan(n / 16);
  });

  it('مسألة 2 — 135 scouts : the numbers are computed, not typed', () => {
    const n = 135, b = bound(n), ds = divisors(n);
    expect(b).toBe(11);
    checkBatch(batchOf('masala-2', 0));
    expect(expectedOf('masala-2', 0)).toEqual([b, div(n, 7).r, n / 5, n / 9]);
    expect(chosen(conclusions('masala-2', 0)[0])).toBe(list(ds));
    expect(ds.filter((d) => d <= b)).toEqual([1, 3, 5, 9]);
    expect(conclusions('masala-2', 0)[0].options[1]).toBe(list(ds.filter((d) => d <= b)));

    const ok = ds.filter((d) => d >= 6 && d <= 20);
    expect(ok).toEqual([9, 15]);
    expect(chosen(conclusions('masala-2', 1)[0])).toBe(ok.join(' أو '));
    expect(n % 10).not.toBe(0);
    expect(expectedOf('masala-2', 1)).toEqual([n / 9, n / 15]);

    const tents = Math.min(n / 9, n / 15), rent = tents * 2700;
    expect(rent % n).toBe(0);
    expect(expectedOf('masala-2', 2)).toEqual([tents, rent, rent / n]);
    expect(2700 / 15).toBe(rent / n); // cohérence : chaque خيمة partagée par 15
  });

  it('مسألة 3 — 90 makrout, then 89 : the numbers are computed, not typed', () => {
    const n = 90, b = bound(n), ds = divisors(n);
    expect(b).toBe(9);
    checkBatch(batchOf('masala-3', 0));
    expect(expectedOf('masala-3', 0)).toEqual([b, n / 6]);
    expect(chosen(conclusions('masala-3', 0)[0])).toBe(list(ds));
    expect(conclusions('masala-3', 0)[0].options[1]).toBe(list(ds.filter((d) => d <= b)));

    const m = n - 1;
    expect(divisors(m)).toEqual([1, m]);
    expect(bound(m)).toBe(9);
    checkBatch(batchOf('masala-3', 1));
    expect(expectedOf('masala-3', 1)).toEqual([m, bound(m)]);
    expect(chosen(conclusions('masala-3', 1)[0])).toBe(`1 و ${m} فقط`);
    expect(div(m, 9)).toEqual({ q: 9, r: 8 });
    expect(div(m, 7)).toEqual({ q: 12, r: 5 });

    const size = Math.max(...ds.filter((d) => d <= 20)), boxes = n / size;
    expect(size).toBe(18);
    expect(n % 20).not.toBe(0);
    const pieces = n * 40, boxCost = boxes * 150;
    expect(expectedOf('masala-3', 2)).toEqual([size, boxes, pieces, boxCost, pieces + boxCost]);
  });
});
