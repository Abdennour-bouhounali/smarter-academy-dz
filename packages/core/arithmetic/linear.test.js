import { describe, it, expect } from 'vitest';
import {
  frac, parseNumber, linear, linLatex, linAt, solveEquation, solveInequality, satisfies, inRay,
  applyBoth, factors, productAt, fracText, fracLatex, fracDecimal, holds, cmp,
} from './linear.js';

// Les nombres sont ceux du manuel (docs/sources/4am/unit4/extraction.json).
const t = (p) => fracText(p);

describe('linear — lecture et écriture', () => {
  it('lit les écritures du manuel', () => {
    expect(linear('4x-3')).toEqual({ a: frac(4), b: frac(-3) });
    expect(linear('2,5x+100')).toEqual({ a: frac(5, 2), b: frac(100) });
    expect(linear('-x/2+2')).toEqual({ a: frac(-1, 2), b: frac(2) });
    expect(linear('3/2x-1')).toEqual({ a: frac(3, 2), b: frac(-1) });
    expect(linear('-26')).toEqual({ a: frac(0), b: frac(-26) });
    expect(linear('1,2x + 4,6 - 1,3x')).toEqual({ a: frac(-1, 10), b: frac(23, 5) });
    expect(() => linear('3(x-5)')).toThrow();
    expect(() => linear('x^2')).toThrow();
  });

  it('écrit comme le manuel', () => {
    expect(linLatex(linear('4x-3'))).toBe('4x - 3');
    expect(linLatex(linear('-x+5'))).toBe('-x + 5');
    expect(linLatex(linear('0x'))).toBe('0');
    expect(fracLatex(frac(-1, 7))).toBe('-\\dfrac{1}{7}');
    expect(fracDecimal(frac(9, 2))).toBe('4,5');
    expect(fracDecimal(frac(1, 3))).toBeNull();
    expect(t(parseNumber('-0,2'))).toBe('-1/5');
  });
});

describe('équations du premier degré', () => {
  it('act-1 : 9x + 1 = −26 et 9x + 1 = 2x', () => {
    expect(t(solveEquation(linear('9x+1'), linear('-26')).x)).toBe('-3');
    expect(t(solveEquation(linear('9x+1'), linear('2x')).x)).toBe('-1/7');
  });
  it('معارف 1 : 4x − 3 = 2x + 6 a pour solution unique 9/2', () => {
    const s = solveEquation(linear('4x-3'), linear('2x+6'));
    expect(s.kind).toBe('unique');
    expect(t(s.x)).toBe('9/2');
    expect(holds(linear('4x-3'), linear('2x+6'), s.x)).toBe(true);
  });
  it('طرائق : 2,5x + 4,6 = 1,3x − 0,2 → −4', () => {
    expect(t(solveEquation(linear('2,5x+4,6'), linear('1,3x-0,2')).x)).toBe('-4');
  });
  it('ex-9 : une équation sans solution, une identité', () => {
    // (2 + x)/2 = (2x + 1)/4 ⇔ 4 + 2x = 2x + 1
    expect(solveEquation(linear('2x+4'), linear('2x+1')).kind).toBe('none');
    expect(solveEquation(linear('x+3'), linear('x+3')).kind).toBe('all');
  });
  it('applyBoth garde l’équation équivalente, refuse ×0', () => {
    let L = linear('4x-3'); let R = linear('2x+6');
    ({ left: L, right: R } = applyBoth(L, R, 'subX', 2));
    ({ left: L, right: R } = applyBoth(L, R, 'add', 3));
    expect([linLatex(L), linLatex(R)]).toEqual(['2x', '9']);
    ({ left: L, right: R } = applyBoth(L, R, 'div', 2));
    expect(linLatex(L)).toBe('x');
    expect(linLatex(R)).toBe('\\dfrac{9}{2}');
    expect(applyBoth(L, R, 'mul', 0).refused).toBe('zero');
  });
});

describe('inéquations du premier degré', () => {
  it('act-3 : 2,5x + 100 ≤ 150 ⇔ x ≤ 20 ; 21 n’est pas solution, 20 l’est', () => {
    const L = linear('2,5x+100'); const R = linear('150');
    expect(solveInequality(L, '<=', R)).toMatchObject({ kind: 'ray', rel: '<=', flipped: false });
    expect(t(solveInequality(L, '<=', R).bound)).toBe('20');
    expect(satisfies(L, '<=', R, frac(20))).toBe(true);
    expect(satisfies(L, '<=', R, frac(21))).toBe(false);
  });
  it('act-3 : −3x + 5 ≤ 20 ⇔ x ≥ −5 — le sens change (division par −3)', () => {
    const s = solveInequality(linear('-3x+5'), '<=', linear('20'));
    expect(s).toMatchObject({ rel: '>=', flipped: true });
    expect(t(s.bound)).toBe('-5');
  });
  it('طرائق : −7x + 1 < x − 3 ⇔ x > 1/2', () => {
    const s = solveInequality(linear('-7x+1'), '<', linear('x-3'));
    expect([s.rel, t(s.bound)]).toEqual(['>', '1/2']);
  });
  it('balayage : l’ensemble résolu coïncide avec la vérification directe', () => {
    const cases = [['-3x+5', '<=', '20'], ['5x', '<=', '3'], ['-x/2+2', '<', '-1'], ['4x-1', '<=', 'x+3'], ['-3x+2', '>', '20']];
    for (const [l, rel, r] of cases) {
      const s = solveInequality(linear(l), rel, linear(r));
      for (let k = -80; k <= 80; k += 1) {
        const x = frac(k, 4);
        expect(inRay(s, x), `${l} ${rel} ${r} @ ${k}/4`).toBe(satisfies(linear(l), rel, linear(r), x));
      }
    }
  });
  it('applyBoth inverse le sens pour un multiplicateur négatif seulement', () => {
    expect(applyBoth(linear('-3x'), linear('15'), 'div', -3, '<=')).toMatchObject({ rel: '>=', flipped: true });
    expect(applyBoth(linear('3x'), linear('15'), 'div', 3, '<=')).toMatchObject({ rel: '<=', flipped: false });
    expect(applyBoth(linear('3x'), linear('15'), 'sub', 7, '<')).toMatchObject({ rel: '<', flipped: false });
  });
});

describe('produits nuls', () => {
  it('3(x − 5) : un seul zéro, le facteur 3 ne s’annule jamais', () => {
    const f = factors('3|x-5');
    expect(f.zeros[0]).toBeNull();
    expect(f.roots.map(t)).toEqual(['5']);
  });
  it('(3x − 4)(−2x + 1) : 1/2 et 4/3 ; (2x + 1)² : un zéro', () => {
    expect(factors('3x-4|-2x+1').roots.map(t)).toEqual(['1/2', '4/3']);
    expect(factors('2x+1').roots.map(t)).toEqual(['-1/2']);
  });
  it('le produit est nul exactement aux zéros (balayage)', () => {
    for (const src of ['3|x-5', 'x-2|x+5', '3x-4|-2x+1', '2x+1', 'x+3|8-4x']) {
      const f = factors(src);
      for (let k = -60; k <= 60; k += 1) {
        const x = frac(k, 6);
        const zero = productAt(f.factors, x).n === 0;
        expect(zero, `${src} @ ${k}/6`).toBe(f.roots.some((r) => cmp(r, x) === 0));
      }
    }
  });
  it('linAt reste exact', () => {
    expect(t(linAt(linear('2,5x+100'), frac(21)))).toBe('305/2');
  });
});
