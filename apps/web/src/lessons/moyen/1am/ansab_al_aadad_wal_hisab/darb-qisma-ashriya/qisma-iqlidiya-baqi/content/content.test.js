import { describe, it, expect } from 'vitest';
import { ACTIVITY, FLOWERS, KNOWLEDGE, ICT } from './textbook';
import { EX } from './exercises';

const dm = (a, b) => ({ q: Math.floor(a / b), r: a % b });

describe('« القسمة الإقليدية » — les mathématiques du contenu', () => {
  it('نشاط 3 : 279 = 14 × 19 + 13, 10 bouquets oui, 20 non', () => {
    const { a, b } = ACTIVITY.numbers;
    expect(dm(a, b)).toEqual({ q: 19, r: 13 });
    expect(b * 10 <= a).toBe(true);
    expect(b * 20 <= a).toBe(false);
  });

  it('le monde des fleurs : 47 = 6 × 7 + 5, puis 48 = 6 × 8', () => {
    expect(dm(FLOWERS.numbers.a, FLOWERS.numbers.b)).toEqual({ q: 7, r: 5 });
    expect(dm(FLOWERS.numbers.then, FLOWERS.numbers.b)).toEqual({ q: 8, r: 0 });
  });

  it('معارف 2 : 253 = 17 × 14 + 15, la disposition et la calculatrice', () => {
    const { a, b, q, r } = KNOWLEDGE.example1.numbers;
    expect(dm(a, b)).toEqual({ q, r });
    expect([17 * 4, 17 * 5, 25 - 17, 83 - 68]).toEqual([68, 85, 8, 15]);
    expect(dm(ICT.numbers.a, ICT.numbers.b)).toEqual({ q: ICT.numbers.q, r: ICT.numbers.r });
    expect(ICT.screen.startsWith('19,58')).toBe(true);
  });

  it('les exercices : chaque clé recalculée', () => {
    const rows15 = EX['ex-15'].question.rows;
    expect([dm(43, 8).q, dm(99, 13).q, dm(215, 7).q]).toEqual([5, 7, 30]);
    expect(rows15.map((r) => r.correct)).toEqual([0, 1, 0]);
    expect(EX['ex-16'].question.correct).toBe(1);
    expect([25 * 80 + 17, 21 * 90 + 127, 24 * 84 + 1]).toEqual([2017, 2017, 2017]);
    expect([dm(762, 3), dm(408, 9), dm(457, 6)]).toEqual([{ q: 254, r: 0 }, { q: 45, r: 3 }, { q: 76, r: 1 }]);
    expect(EX['ex-18-a'].question.expected).toBe(dm(3025, 48).q);
    expect(EX['ex-18-b'].question.expected).toBe(dm(659, 32).r);
    expect([dm(531, 5), dm(602, 4)]).toEqual([{ q: 106, r: 1 }, { q: 150, r: 2 }]);
    expect(EX['ex-20'].question.expected).toBe(dm(123, 30).r);
    expect(dm(365, 7).r).toBe(1);
  });
});
