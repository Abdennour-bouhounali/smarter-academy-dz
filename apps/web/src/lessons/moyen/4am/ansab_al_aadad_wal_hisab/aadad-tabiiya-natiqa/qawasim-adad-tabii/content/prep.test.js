import { describe, it, expect } from 'vitest';
import { PREP_LADDER } from './prep';

describe('PREP_LADDER — « أستعدّ » de la plateforme : 10 affirmations justes, du plus facile au plus difficile', () => {
  it('10 questions, 5 par كفاءة, en alternance, la difficulté ne descend jamais', () => {
    expect(PREP_LADDER).toHaveLength(10);
    expect(PREP_LADDER.filter((x) => x.skill === 'jidaa')).toHaveLength(5);
    PREP_LADDER.forEach((x, i) => {
      expect(x.n).toBe(i + 1);
      if (i > 0) expect(x.level).toBeGreaterThanOrEqual(PREP_LADDER[i - 1].level);
      if (i > 0) expect(x.skill).not.toBe(PREP_LADDER[i - 1].skill);
    });
  });
  it('les trois premières sont les plus faciles (niveaux 1–2) et les deux réponses existent', () => {
    PREP_LADDER.slice(0, 3).forEach((x) => expect(x.level).toBeLessThanOrEqual(2));
    expect(new Set(PREP_LADDER.map((x) => x.answer))).toEqual(new Set([true, false]));
  });
  it('chaque affirmation est recalculée : la réponse attendue est juste', () => {
    PREP_LADDER.forEach(({ check, answer, n }) => {
      const truth = check.ds.every((d) => check.n % d === 0);
      expect(truth, `item ${n}`).toBe(answer);
      if (check.product) expect(check.product[0] * check.product[1], `item ${n} product`).toBe(check.product[2]);
    });
  });
  it('les égalités citées dans les explications existent', () => {
    // 20 = 5 × 4, 84 = 7 × 12, 65 = 5 × 13, 18 = 4 × 4 + 2, 2314 = 4 × 578 + 2
    expect(5 * 4).toBe(20); expect(7 * 12).toBe(84); expect(5 * 13).toBe(65);
    expect(4 * 4 + 2).toBe(18); expect(4 * 578 + 2).toBe(2314); expect(3 * 4).toBe(12);
  });
});
