import { describe, it, expect } from 'vitest';
import { validateProblem, demandsOf } from '../../../../../../common/problems/guidedProblem';
import { PROBLEMS, PROBLEM } from './problems';
import { LESSON_CONFIG } from '../lesson.config';

const div = (a, b) => ({ q: Math.floor(a / b), r: a % b });
const divisors = (n) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
const common = (a, b) => divisors(a).filter((d) => b % d === 0);
const pgcd = (a, b) => Math.max(...common(a, b));
const list = (xs) => xs.join(' ، ');
const expectedOf = (id, part) => PROBLEM[id].parts[part].steps.filter((s) => s.kind === 'numeric').map((s) => s.expected);
const stepsOf = (id, part, kind) => PROBLEM[id].parts[part].steps.filter((s) => s.kind === kind);
const chosen = (s) => s.options[s.correct];

describe('les مسائل du درس 4 (القاسم المشترك الأكبر)', () => {
  it('respect the GuidedProblem contract', () => {
    for (const p of PROBLEMS) expect(validateProblem(p)).toEqual([]);
  });

  it('match their modules (4, 5, 6 — track problem, practice_lab, before the test 7)', () => {
    const problemModules = LESSON_CONFIG.modules.filter((m) => m.track === 'problem');
    expect(problemModules.map((m) => [m.number, m.id, m.slug, m.stage])).toEqual([
      [4, '04', 'masala-1', 'practice_lab'], [5, '05', 'masala-2', 'practice_lab'], [6, '06', 'masala-3', 'practice_lab'],
    ]);
    expect(LESSON_CONFIG.modules.at(-1)).toMatchObject({ id: '07', number: 7, slug: 'itqan', stage: 'evaluation' });
    expect(LESSON_CONFIG.lessonProblem.module).toBe(4);
    expect(PROBLEM['masala-1'].statement).toBe(LESSON_CONFIG.lessonProblem.statement);
    expect(LESSON_CONFIG.resources.filter((r) => r.kind === 'situation').map((r) => [r.code, r.module])).toEqual([
      ['masala-1', 4], ['masala-2', 5], ['masala-3', 6],
    ]);
    expect(LESSON_CONFIG.modules.reduce((t, m) => t + m.estimatedMin, 0)).toBe(75);
  });

  it('every demand has its own answer (owner rule 2026-10-06)', () => {
    for (const p of PROBLEMS) for (const part of p.parts) {
      expect(part.asks.length, `${p.id} ${part.label}`).toBeGreaterThanOrEqual(demandsOf(part.question));
      part.asks.forEach((_, k) => {
        expect(part.steps.some((s) => s.ask === k && s.kind !== 'solution'), `${p.id} ${part.label} ask ${k + 1}`).toBe(true);
      });
    }
  });

  it('each sort has a useless NUMBER among its data', () => {
    for (const p of PROBLEMS) expect(p.data.some((d) => !d.useful && /\d/.test(d.text)), p.id).toBe(true);
  });

  it('مسألة 1 — the numbers are computed, not typed', () => {
    const R = 120, W = 84;
    // 1) 8 divise 120 mais pas 84 ; 6 divise les deux.
    const r8 = div(R, 8), w8 = div(W, 8);
    expect(r8.r).toBe(0);
    expect(w8.r).not.toBe(0);
    expect(expectedOf('masala-1', 0)).toEqual([r8.r, w8.r, R / 6, W / 6]);
    expect(R % 6 + W % 6).toBe(0);
    expect(w8.q).toBe(10); // 84 = 8 × 10 + 4 (rédaction)
    expect(r8.q).toBe(15);  // 120 = 8 × 15
    // 2) listes, قواسم مشتركة, PGCD, composition d'une باقة.
    const [, list84, listCommon] = PROBLEM['masala-1'].parts[1].steps;
    expect(chosen(list84)).toBe(list(divisors(W)));
    expect(listCommon.prompt).toContain(list(divisors(R)));
    expect(chosen(listCommon)).toBe(list(common(R, W)));
    const g = pgcd(R, W);
    expect(g).toBe(12);
    expect(expectedOf('masala-1', 1)).toEqual([g, R / g, W / g]);
    // 3) argent : 12 باقات à 1450 دج, روزات à 40 / 30 دج, تغليف 100 دج.
    const roses = R * 40 + W * 30, sales = g * 1450, wrap = g * 100;
    expect(expectedOf('masala-1', 2)).toEqual([R * 40, W * 30, roses, sales, wrap, sales - (roses + wrap)]);
    expect(sales - (roses + wrap)).toBe(8880);
  });

  it('مسألة 2 — the numbers are computed, not typed', () => {
    const M = 96, S = 72, g = pgcd(M, S);
    // 1) 18 divise 72 mais pas 96 ; puis PGCD.
    expect(S % 18).toBe(0);
    expect(div(M, 18)).toEqual({ q: 5, r: 6 });
    expect(expectedOf('masala-2', 0)).toEqual([S % 18, M % 18, g]);
    const listStep = stepsOf('masala-2', 0, 'choice')[2];
    expect(listStep.prompt).toContain(list(divisors(M)));
    expect(listStep.prompt).toContain(list(divisors(S)));
    expect(chosen(listStep)).toBe(list(common(M, S)));
    expect(g).toBe(24);
    // 2) par la ملاحظة : 16 ne divise pas 24 (et en effet pas 72 : 8 كغ de crevettes restent), 12 divise 24.
    expect(expectedOf('masala-2', 1)).toEqual([g % 16, g / 12]);
    expect(div(g, 16)).toEqual({ q: 1, r: 8 });
    expect(common(M, S).includes(16)).toBe(false);
    expect(div(S, 16)).toEqual({ q: 4, r: 8 });
    expect(common(M, S).includes(12)).toBe(true);
    expect([M / 12, S / 12]).toEqual([8, 6]);
    expect(common(M, S)).toEqual(divisors(g)); // la ملاحظة, vérifiée sur ces nombres
    // 3) composition (kg) et valeur d'un صندوق.
    expect(expectedOf('masala-2', 2)).toEqual([M / g, S / g, (M / g) * 400 + (S / g) * 1800]);
    expect((M / g) * 400 + (S / g) * 1800).toBe(7000);
  });

  it('مسألة 3 — the numbers are computed, not typed', () => {
    const L = 480, W = 360, g = pgcd(L, W);
    // 1) 45 divise 360 mais pas 480.
    expect(W % 45).toBe(0);
    expect(div(W, 45).q).toBe(8);
    expect(div(L, 45)).toEqual({ q: 10, r: 30 });
    expect(expectedOf('masala-3', 0)).toEqual([W % 45, L % 45]);
    // 2) PGCD donné = 120 ; les dalles du magasin par la ملاحظة.
    expect(g).toBe(120);
    expect(PROBLEM['masala-3'].parts[1].question).toContain(`(${L}\\ ;\\ ${W}) = ${g}`);
    expect(expectedOf('masala-3', 1)).toEqual([L / g, W / g, g]);
    const batch = stepsOf('masala-3', 1, 'batch')[0];
    const shop = [25, 30, 40, 45, 60];
    expect(batch.rows.map((r) => r.label)).toEqual(shop.map((s) => `بلاطة ${s} سم`));
    shop.forEach((s, i) => {
      const fits = g % s === 0;
      expect(fits).toBe(L % s === 0 && W % s === 0); // la ملاحظة = la double division
      expect(batch.rows[i].options[batch.rows[i].correct]).toBe(fits ? 'تصلح' : 'لا تصلح');
      const d = div(g, s);
      expect(batch.rows[i].correction).toContain(d.r ? `$120 = ${s} \\times ${d.q} + ${d.r}$` : `$120 = ${s} \\times ${d.q}$`);
    });
    // 3) la plus grande dalle offerte qui convient, nombre et prix.
    const best = Math.max(...shop.filter((s) => g % s === 0));
    expect(best).toBe(60);
    const n = (L / best) * (W / best);
    expect(expectedOf('masala-3', 2)).toEqual([L / best, W / best, n, n * 450]);
    expect(n * 450).toBe(21600);
  });

  it('every explicit equality « a = b × q (+ r) » and « a × b = c » in the texts is true', () => {
    const texts = [];
    for (const p of PROBLEMS) {
      texts.push(p.statement);
      for (const part of p.parts) {
        texts.push(part.question);
        for (const s of part.steps) {
          texts.push(s.prompt ?? '', s.explain ?? '', ...(s.options ?? []), ...(s.lines ?? []));
          for (const r of s.rows ?? []) texts.push(r.correction ?? '');
        }
      }
    }
    // Évalue chaque chaîne « x = y = z » faite seulement de nombres et + − × ÷ ( ).
    const toJs = (e) => e.replace(/\\times/g, '*').replace(/\\div/g, '/').trim();
    let checked = 0;
    for (const t of texts) {
      for (const [, math] of t.matchAll(/\$([^$]+)\$/g)) {
        const sides = math.split('=');
        if (sides.length < 2 || !sides.every((x) => /^[\d\s+\-()]*(?:(?:\\times|\\div)[\d\s+\-()]*)*$/.test(x.trim()) && /\d/.test(x))) continue;
        const values = sides.map((x) => Function(`return (${toJs(x)});`)());
        values.forEach((v) => expect(v, `${math}`).toBe(values[0]));
        checked += 1;
      }
    }
    expect(checked).toBeGreaterThan(40);
  });
});
