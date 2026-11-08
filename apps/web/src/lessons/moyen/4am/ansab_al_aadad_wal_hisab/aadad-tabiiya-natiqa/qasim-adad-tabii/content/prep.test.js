import { describe, it, expect } from 'vitest';
import { PREP_LADDER } from './prep';

describe('PREP_LADDER — « أستعدّ » de la plateforme : 10 affirmations justes, du plus facile au plus difficile', () => {
  it('10 questions, 5 par كفاءة, en alternance, la difficulté ne descend jamais', () => {
    expect(PREP_LADDER).toHaveLength(10);
    expect(PREP_LADDER.filter((x) => x.skill === 'qisma')).toHaveLength(5);
    PREP_LADDER.forEach((x, i) => {
      expect(x.n).toBe(i + 1);
      if (i > 0) expect(x.level).toBeGreaterThanOrEqual(PREP_LADDER[i - 1].level);
      if (i > 0) expect(x.skill).not.toBe(PREP_LADDER[i - 1].skill);
    });
  });
  it('les trois premières sont les plus faciles (niveaux 1–2)', () => {
    PREP_LADDER.slice(0, 3).forEach((x) => expect(x.level).toBeLessThanOrEqual(2));
  });
  it('chaque division est EXACTE (a = b × q + r, 0 ≤ r < b) et la réponse attendue est juste', () => {
    PREP_LADDER.filter((x) => x.skill === 'qisma').forEach(({ check, answer }) => {
      expect(check.b * check.q + check.r).toBe(check.a);
      expect(check.r).toBeLessThan(check.b);
      if (check.claimed) expect(answer).toBe(check.claimed.r < check.a && check.claimed.r < check.b);
    });
  });
  it('chaque règle de divisibilité dit vrai', () => {
    PREP_LADDER.filter((x) => x.skill === 'qawaid').forEach(({ check, answer }) => {
      expect(check.n % check.d === 0).toBe(check.divisible);
      expect(answer).toBe(check.divisible);
    });
  });
});
