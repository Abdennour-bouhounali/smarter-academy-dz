import { describe, it, expect } from 'vitest';
import { rat, ratText } from './powers.js';
import * as Q from './equation2.js';
import * as S from './substitution.js';

describe('substitution — the letters option (2AM, additive)', () => {
  it('3AM callers keep x and y only', () => {
    expect(() => S.parseExpression('5n+1')).toThrow();
    expect(() => S.parseExpression('3a')).toThrow();
    expect(S.letters(S.parseExpression('3x+y'))).toEqual(['x', 'y']);
  });
  it('2AM letters n a b parse, evaluate, implicit products and toTerms in the chosen letter', () => {
    const o = { letters: S.LETTERS_2AM };
    expect(ratText(S.evaluate(S.parseExpression('5n+1', o), { n: rat(40) }))).toBe('201');
    expect(ratText(S.evaluate(S.parseExpression('3ab', o), { a: rat(2), b: rat(5) }))).toBe('30');
    expect(ratText(S.evaluate(S.parseExpression('a²+b³', o), { a: rat(3), b: rat(2) }))).toBe('17');
    expect(S.toTerms(S.parseExpression('2n+3n', o), 'n')).toEqual([{ c: 5, p: 1 }]);
    expect(S.toTerms(S.parseExpression('2n+3n', o))).toBe(null); // the default letter is still x
    expect(S.samePolynomial(S.parseExpression('4(n+1)', o), S.parseExpression('4n+4', o), 'n')).toBe(true);
  });
});

describe('equation2 E1 — valueTable', () => {
  it('writes the textbook line and the exact value', () => {
    const rows = Q.valueTable('5n+1', 'n', [1, 2, 3, 4, 40]);
    expect(rows.map((r) => ratText(r.value))).toEqual(['6', '11', '16', '21', '201']);
    expect(rows[4].line).toBe('5 × 40 + 1');
    expect(rows[4].text).toBe('5 × 40 + 1 = 201');
  });
  it('decimals and two letters', () => {
    expect(Q.valueTable('4x+3', 'x', ['0', '2', '2,5']).map((r) => ratText(r.value))).toEqual(['3', '11', '13']);
    expect(Q.valueTable('4x+3', 'x', ['2,5'])[0].line).toBe('4 × 2,5 + 3');
    expect(ratText(Q.valueTable('3x+4y+1', 'x', [2], { y: 3 })[0].value)).toBe('19');
    expect(ratText(Q.valueTable('3x+2y', 'x', [4], { y: 5 })[0].value)).toBe('22');
    expect(ratText(Q.valueTable('2x²+1', 'x', [3])[0].value)).toBe('19');
  });
});

describe('equation2 E1 — firstMismatch, sameCount', () => {
  it('the two ways of counting the wax cells give one table', () => {
    expect(Q.firstMismatch('5n+1', '6+5(n-1)', 'n', [1, 2, 3, 4, 5, 6, 7, 8])).toBe(null);
    expect(ratText(Q.firstMismatch('5n+1', '6n', 'n', [1, 2, 3]))).toBe('2');
    expect(Q.sameCount('5n+1', '1+5n')).toBe(true);
    expect(Q.sameCount('5n+1', '6n')).toBe(false);
  });
});

describe('equation2 E1 — simplified, showTimes', () => {
  it('the simplified writing', () => {
    expect(Q.simplified('3×a×b')).toBe('3ab');
    expect(Q.simplified('1×x+0×y')).toBe('x');
    expect(Q.simplified('2a+3a+a')).toBe('6a');
    expect(Q.simplified('a×a×5')).toBe('5a²');
    expect(Q.simplified('2a+0×b-4+a')).toBe('3a − 4');
    expect(Q.simplified('c+c×c+c')).toBe('c² + 2c');
    expect(Q.simplified('a×a-2×a×b+b×b')).toBe('a² − 2ab + b²');
    expect(Q.simplified('5x+2x+3×8')).toBe('7x + 24');
    expect(Q.simplified('2a+5a-3a')).toBe('4a');
    expect(Q.simplified('x-x')).toBe('0');
    expect(Q.simplified('2(x+4)-2x')).toBe('8');
  });
  it('the hidden × written back', () => {
    expect(Q.showTimes('7x')).toBe('7 × x');
    expect(Q.showTimes('2x+y')).toBe('2 × x + y');
    expect(Q.showTimes('3(2x+y)')).toBe('3 × (2 × x + y)');
    expect(Q.showTimes('x³')).toBe('x × x × x');
    expect(Q.showTimes('2x²+12')).toBe('2 × x × x + 12');
  });
});
