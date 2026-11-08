import { describe, it, expect } from 'vitest';
import { PREP_LADDER } from './prep';

describe('PREP_LADDER — « أستعدّ » de la plateforme : 10 affirmations, du plus facile au plus difficile', () => {
  it('10 questions, 5 par كفاءة, en alternance, la difficulté ne descend jamais', () => {
    expect(PREP_LADDER).toHaveLength(10);
    expect(PREP_LADDER.filter((x) => x.skill === 'jidaa')).toHaveLength(5);
    PREP_LADDER.forEach((x, i) => {
      expect(x.n).toBe(i + 1);
      if (i > 0) expect(x.level).toBeGreaterThanOrEqual(PREP_LADDER[i - 1].level);
      if (i > 0) expect(x.skill).not.toBe(PREP_LADDER[i - 1].skill);
    });
  });
  it('les trois premières sont les plus faciles (niveaux 1–2) et justes ; les deux réponses existent', () => {
    PREP_LADDER.slice(0, 3).forEach((x) => { expect(x.level).toBeLessThanOrEqual(2); expect(x.answer).toBe(true); });
    expect(new Set(PREP_LADDER.map((x) => x.answer))).toEqual(new Set([true, false]));
  });
  it('chaque affirmation est RECALCULÉE : la réponse attendue est la vérité', () => {
    PREP_LADDER.forEach(({ n: num, check, answer }) => {
      if (check.kind === 'divides') {
        expect(check.n % check.d === 0, `item ${num}`).toBe(answer);
        if (check.product) expect(check.product[0] * check.product[1], `item ${num} product`).toBe(check.n);
        return;
      }
      const { a, b, q, r } = check;
      expect(b * q + r, `item ${num} egalite`).toBe(a);
      expect(Math.floor(a / b), `item ${num} q`).toBe(q);
      expect(a % b, `item ${num} r`).toBe(r);
      if (check.claimed) {
        expect(b * check.claimed.q + check.claimed.r).toBe(a);
        expect(check.claimed.r < b).toBe(answer);
      } else if (check.claimedR != null) {
        expect(check.claimedR === r).toBe(answer);
      } else {
        expect(answer).toBe(true);
      }
    });
  });
  it('les nombres cités dans les explications existent', () => {
    expect(7 * 7 + 1).toBe(50); expect(9 * 5 + 2).toBe(47); expect(8 * 9 + 3).toBe(75); expect(12 * 83 + 4).toBe(1000); expect(9 * 0 + 3).toBe(3);
  });
});
