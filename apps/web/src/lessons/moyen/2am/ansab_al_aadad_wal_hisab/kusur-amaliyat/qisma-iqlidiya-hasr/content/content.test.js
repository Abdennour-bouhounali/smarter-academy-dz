import { describe, it, expect } from 'vitest';
import { ACTIVITY, BASKET, KNOWLEDGE, METHOD, PREP_ITEMS, PREP_PLATFORM_ITEMS } from './textbook';
import { EX } from './exercises';

const dm = (a, b) => ({ q: Math.floor(a / b), r: a % b });
/** n < a/b < n + 1, en entiers. */
const between = (a, b, n) => n * b < a && a < (n + 1) * b;
/** « q + r/b » écrit dans une option : on recalcule a = qb + r. */
const mixedValue = (s, b) => { const m = /\$(\d+) \+ \\frac\{(\d+)\}\{(\d+)\}\$/.exec(s); return m && Number(m[3]) === b ? Number(m[1]) * b + Number(m[2]) : null; };

describe('« القسمة الإقليدية وحصر حاصل القسمة » — les mathématiques du contenu', () => {
  it('نشاط 1 : 2145 = 30 × 71 + 15, 71 < 2145/30 < 72, la division du fils est vraie mais pas euclidienne, 2160 = 30 × 72', () => {
    const { a, b, q, r, then } = ACTIVITY.numbers;
    expect(dm(a, b)).toEqual({ q, r });
    expect(between(a, b, q)).toBe(true);
    expect(b * ACTIVITY.son.q + ACTIVITY.son.r).toBe(a);
    expect(ACTIVITY.son.r >= b).toBe(true);
    expect(dm(then, b)).toEqual({ q: q + 1, r: 0 });
  });

  it('le panier : 50 = 12 × 4 + 2, puis 60 = 12 × 5', () => {
    const { a, b, q, r, then } = BASKET.numbers;
    expect(dm(a, b)).toEqual({ q, r });
    expect(dm(then, b)).toEqual({ q: q + 1, r: 0 });
  });

  it('معارف 1 : 180 = 8 × 22 + 4 et 22 < 180/8 < 23', () => {
    const { a, b, q, r } = KNOWLEDGE.example.numbers;
    expect(dm(a, b)).toEqual({ q, r });
    expect(between(a, b, 22)).toBe(true);
  });

  it('la طريقة : 4750 = 37 × 128 + 14 (et chaque ligne), 9000 = 125 × 72', () => {
    const { a, b, q, r } = METHOD.numbers;
    expect(dm(a, b)).toEqual({ q, r });
    expect([37 * 100, 37 * 200, 37 * 120, 37 * 130, 37 * 128, 37 * 129]).toEqual([3700, 7400, 4440, 4810, 4736, 4773]);
    expect(dm(METHOD.practice.a, METHOD.practice.b)).toEqual({ q: METHOD.practice.q, r: METHOD.practice.r });
  });

  it('« أستعدّ » : chaque affirmation recalculée', () => {
    expect(PREP_ITEMS.map((i) => i.answer)).toEqual([true, 19 === 5 * 3 + 4]);
    expect(PREP_PLATFORM_ITEMS.map((i) => i.answer)).toEqual([
      dm(47, 6).q === 7 && dm(47, 6).r === 5,
      dm(50, 6).r === 8,
      7 < 7.4 && 7.4 < 8,
      11 < 12.6 && 12.6 < 12,
    ]);
  });

  it('les exercices : chaque clé recalculée, chaque distracteur FAUX', () => {
    const rows33 = EX['ex-33'].question.rows;
    [[129, 11], [81, 7], [67, 15], [17, 3]].forEach(([a, b], i) => {
      const values = rows33[i].options.map((o) => mixedValue(o, b));
      expect(values[rows33[i].correct]).toBe(a);
      values.forEach((v, k) => { if (k !== rows33[i].correct) expect(v).not.toBe(a); });
      expect(Number(/\$(\d+)/.exec(rows33[i].options[rows33[i].correct])[1])).toBe(dm(a, b).q);
    });
    expect(dm(337, 13)).toEqual({ q: 25, r: 12 });
    expect(EX['ex-p1'].question.rows.map((r) => r.correct)).toEqual([0, 2]);
    expect([13 * 24 + 25, 13 * 26 - 1]).toEqual([337, 337]);
    expect(dm(1000, 45)).toEqual({ q: 22, r: 10 });
    expect(EX['ex-p2'].question.correct).toBe(1);
    expect([45 * 21 + 55, 45 * 20 + 100]).toEqual([1000, 1000]);
    expect(between(3246, 400, 8)).toBe(true);
    expect(EX['ex-p4'].question.rows.map((r) => r.answer)).toEqual([2160 % 30 === 0, 2160 / 30 === 72, 30 % 2160 === 0, 2145 % 30 === 0]);
  });
});
