import { describe, it, expect } from 'vitest';
import * as R from './relativeOps.js';
import * as P from './powers.js';

describe('relativeOps — lecture et écriture', () => {
  it('parseRel accepte virgule, point, vrai moins, chiffres arabes et fractions', () => {
    expect(R.parseRel('−2,5')).toEqual(P.rat(-5, 2));
    expect(R.parseRel('-2.5')).toEqual(P.rat(-5, 2));
    expect(R.parseRel('٣')).toEqual(P.rat(3));
    expect(R.parseRel('٠٫٤')).toEqual(P.rat(2, 5));
    expect(R.parseRel('3/4')).toEqual(P.rat(3, 4));
    expect(() => R.parseRel('abc')).toThrow();
  });
  it('relText / relTex : virgule décimale, vrai moins, fraction si non décimal', () => {
    expect(R.relText(P.rat(-5, 2))).toBe('−2,5');
    expect(R.relText(P.rat(6, 100))).toBe('0,06');
    expect(R.relText(P.rat(12))).toBe('12');
    expect(R.relText(P.rat(-1, 3))).toBe('−1/3');
    expect(R.relTex(P.rat(-5, 2))).toBe('-2{,}5');
    expect(R.relTex(P.rat(1, 100))).toBe('0{,}01');
    expect(R.relTex(P.rat(-1, 3))).toBe('-\\frac{1}{3}');
    expect(R.isFiniteDecimal(P.rat(7, 20))).toBe(true);
    expect(R.isFiniteDecimal(P.rat(1, 3))).toBe(false);
  });
});

describe('relativeOps — le produit', () => {
  it('la règle des signes, balayée sur des entiers et des décimaux', () => {
    const vals = ['-7', '-2,5', '-1', '0', '0,4', '3', '9'].map(R.parseRel);
    for (const a of vals) for (const b of vals) {
      const p = R.times(a, b);
      expect(P.sign(p)).toBe(R.productSign(a, b));
      expect(R.distance(p)).toEqual(P.mul(R.distance(a), R.distance(b)));
    }
  });
  it('a × 0 = 0 ; (−0,3) × (−0,2) = 0,06', () => {
    expect(R.times(R.parseRel('-12'), 0)).toEqual(P.rat(0));
    expect(R.relText(R.times(R.parseRel('-0,3'), R.parseRel('-0,2')))).toBe('0,06');
  });
  it('repeatedSum : (−2) + (−2) + (−2) = (−2) × 3', () => {
    expect(R.repeatedSum(P.rat(-2), 3).map(R.relText)).toEqual(['−2', '−4', '−6']);
    for (let n = 1; n <= 9; n += 1) expect(R.repeatedSum(P.rat(-2), n).at(-1)).toEqual(R.times(-2, n));
    expect(() => R.repeatedSum(1, 0)).toThrow();
  });
  it('distributeCheck : k × b + k × (−b) = k × 0 = 0 pour tout k, b', () => {
    for (const k of [-4, -1.5, 3]) for (const b of [4, -4, 0.5]) {
      const c = R.distributeCheck(R.parseRel(String(k)), R.parseRel(String(b)));
      expect(c.left).toEqual(c.right);
      expect(c.right).toEqual(P.rat(0));
    }
  });
});
