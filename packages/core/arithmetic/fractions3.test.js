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
