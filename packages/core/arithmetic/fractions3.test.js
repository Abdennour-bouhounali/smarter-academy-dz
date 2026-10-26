import { describe, it, expect } from 'vitest';
import * as F from './fractions3.js';
import { ratText } from './powers.js';

describe('fractions3 — brut, inverse, division', () => {
  it('raw garde l\'écriture non réduite et refuse d = 0', () => {
    const p = F.raw(6, 8);
    expect(F.rawText(p)).toBe('6/8');
    expect(ratText(F.valueOf(p))).toBe('3/4');
    expect(F.rawText(F.raw(3, -4))).toBe('-3/4');
    expect(() => F.raw(1, 0)).toThrow();
    expect(F.rawTex(F.raw(6, 8))).toBe('\\frac{6}{8}');
    expect(F.rawTex(F.raw(6, 1))).toBe('6');
  });
  it('le مقلوب d\'un naturel, d\'un décimal et d\'une fraction ; 0 n\'en a pas', () => {
    expect(F.rawText(F.reciprocal(8))).toBe('1/8');
    expect(ratText(F.valueOf(F.reciprocal('0,25')))).toBe('4');
    expect(ratText(F.valueOf(F.reciprocal('0,8')))).toBe('5/4');
    expect(F.rawText(F.reciprocal('0,4'))).toBe('10/4');
    expect(F.rawText(F.reciprocal(F.raw(7, 5)))).toBe('5/7');
    expect(() => F.reciprocal(0)).toThrow();
    expect(() => F.reciprocal('0,0')).toThrow();
  });
  it('x · y = 1 caractérise les inverses ; 0,33 n\'est pas le مقلوب de 3', () => {
    expect(F.isReciprocalPair(F.raw(3, 4), F.raw(4, 3))).toBe(true);
    expect(F.isReciprocalPair(3, '0,33')).toBe(false);
    expect(F.isReciprocalPair(3, F.raw(1, 3))).toBe(true);
    expect(F.isReciprocalPair(F.raw(3, 4), F.raw(-3, 4))).toBe(false);
  });
  it('a/b ÷ c/d = a/b × d/c', () => {
    const r = F.divideFractions(F.raw(14, 15), F.raw(21, 10));
    expect(r.product.map(F.rawText)).toEqual(['14/15', '10/21']);
    expect(ratText(r.value)).toBe('4/9');
    expect(ratText(F.divideFractions(6, F.raw(3, 4)).value)).toBe('8');
    expect(ratText(F.divideFractions(F.raw(5, 6), 10).value)).toBe('1/12');
    expect(ratText(F.divideFractions(F.raw(9, 2), F.raw(3, 4)).value)).toBe('6');
    expect(() => F.divideFractions(F.raw(1, 2), 0)).toThrow();
  });
  it('simplifier avant de multiplier', () => {
    const s = F.simplifyBeforeMultiply(F.raw(14, 15), F.raw(10, 21));
    expect(s.cancels.map((c) => `${c.top}/${c.bottom}:${c.g}`)).toEqual(['a/d:7', 'c/b:5']);
    expect(F.rawText(s.result)).toBe('4/9');
    expect(F.simplifyBeforeMultiply(F.raw(2, 3), F.raw(5, 7)).cancels).toEqual([]);
  });
  it('les tours de pédale et de roue (le labo gear-crank)', () => {
    const g = F.gearTurns(24, 32, 192);
    expect(ratText(g.pedal)).toBe('8');
    expect(ratText(g.wheel)).toBe('6');
    expect(ratText(F.gearTurns(24, 32, 32).pedal)).toBe('4/3');
    expect(ratText(F.teethFor(32, '7/5'))).toBe('224/5');
    expect(ratText(F.teethFor(24, 3))).toBe('72');
    expect(() => F.gearTurns(0, 5, 3)).toThrow();
  });
});

describe('fractions3 — égalité et comparaison (tasawi-muqaranat-kasrayn)', () => {
  it('les produits en croix décident l\'égalité, dans les deux sens', () => {
    expect(F.crossProducts(F.raw(3, 4), F.raw(6, 8))).toEqual({ left: 24n, right: 24n });
    expect(F.sameFraction(F.raw(3, 4), F.raw(6, 8))).toBe(true);
    expect(F.sameFraction(F.raw(7, 10), F.raw(3, 4))).toBe(false);
    expect(F.sameFraction(F.raw(2018, 2017), F.raw(2017, 2016))).toBe(false);
    expect(F.sameFraction(F.raw(336, 609), F.raw(16, 29))).toBe(true);
    expect(F.sameFraction('5/6', '10/12')).toBe(true);
  });
  it('compareFractions : −1, 0, 1 (7/10 < 3/4, 10/13 < 7/9, 11/14 > 7/9)', () => {
    expect(F.compareFractions(F.raw(7, 10), F.raw(3, 4))).toBe(-1);
    expect(F.compareFractions(F.raw(3, 4), F.raw(7, 10))).toBe(1);
    expect(F.compareFractions(F.raw(10, 13), F.raw(7, 9))).toBe(-1);
    expect(F.compareFractions(F.raw(7, 9), F.raw(11, 14))).toBe(-1);
    expect(F.compareFractions(F.raw(5, 7), F.raw(5, 7))).toBe(0);
    expect(F.compareFractions(F.raw(47, 23), F.raw(47, 25))).toBe(1);
  });
  it('lcm, multiples communs, écriture sur un dénominateur donné', () => {
    expect(F.lcm(4, 10)).toBe(20n);
    expect(F.lcm(12, 18)).toBe(36n);
    expect(F.commonMultiples(4, 10, 3)).toEqual([20n, 40n, 60n]);
    expect(() => F.lcm(0, 4)).toThrow();
    const t = F.toDenominator(F.raw(3, 4), 20);
    expect([t.k, t.n, t.d]).toEqual([5n, 15n, 20n]);
    expect(() => F.toDenominator(F.raw(3, 4), 10)).toThrow();
  });
  it('le terme manquant : x/16 = 5/8, 4/x = 6/9, 3/4 = x/20 …', () => {
    expect(ratText(F.missingTerm([null, 16, 5, 8]))).toBe('10');
    expect(ratText(F.missingTerm([4, null, 6, 9]))).toBe('6');
    expect(ratText(F.missingTerm([3, 4, null, 20]))).toBe('15');
    expect(ratText(F.missingTerm([3, 4, 15, null]))).toBe('20');
    expect(ratText(F.missingTerm([null, 15, 4, 6]))).toBe('10');
    expect(() => F.missingTerm([1, 2, 3, 4])).toThrow();
    expect(() => F.missingTerm([null, 0, 5, 8])).toThrow();
  });
  it('matchNumerator : 3/4 sur 8 blancs → 6 exact ; 3/4 sur 10 → entre 7 et 8 ; 4/7 sur 12 → entre 6 et 7', () => {
    expect(F.matchNumerator(3, 4, 8)).toMatchObject({ exact: true, c: 6n });
    const m = F.matchNumerator(3, 4, 10);
    expect([m.exact, m.below, m.above, ratText(m.value)]).toEqual([false, 7n, 8n, '15/2']);
    const n = F.matchNumerator(4, 7, 12);
    expect([n.exact, n.below, n.above]).toEqual([false, 6n, 7n]);
    expect(F.matchNumerator(9, 12, 8)).toMatchObject({ exact: true, c: 6n });
    expect(F.matchNumerator(5, 6, 18)).toMatchObject({ exact: true, c: 15n });
    expect(() => F.matchNumerator(3, 0, 8)).toThrow();
  });
  it('shadeVerdict : 5 plus clair, 6 pile, 7 plus foncé (3/4 sur 8)', () => {
    expect(F.shadeVerdict(3, 4, 5, 8).verdict).toBe('lighter');
    expect(F.shadeVerdict(3, 4, 6, 8)).toEqual({ verdict: 'match', gap: 0n });
    expect(F.shadeVerdict(3, 4, 7, 8).verdict).toBe('darker');
    expect(F.shadeVerdict(3, 4, 7, 10).verdict).toBe('lighter');
    expect(F.shadeVerdict(3, 4, 8, 10).verdict).toBe('darker');
    expect(F.shadeVerdict(7, 9, 10, 13).verdict).toBe('lighter');
  });
  it('le chiffre des unités d\'un produit : 3217 × 8133 finit par 1, 5419 × 4826 par 4', () => {
    expect(F.unitsDigitOfProduct(3217, 8133)).toBe(1);
    expect(F.unitsDigitOfProduct(5419, 4826)).toBe(4);
    expect(3217 * 8133 % 10).toBe(1);
  });
});

