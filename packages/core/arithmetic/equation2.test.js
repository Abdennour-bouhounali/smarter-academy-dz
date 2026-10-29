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

describe('equation2 E2 — solveForm / checkForm / undoChain / formOf', () => {
  const T = (r) => ratText(r);
  it('solves the three forms by the inverse operation, exactly', () => {
    expect(T(Q.solveForm({ form: 'times', a: '12', b: '18' }).x)).toBe('3/2');
    expect(Q.solveForm({ form: 'times', a: '12', b: '18' }).line).toBe('x = 18 ÷ 12 = 1,5');
    expect(Q.solveForm({ form: 'under', a: '489', b: '163' }).x).toEqual(rat(3));
    expect(Q.solveForm({ form: 'under', a: '30', b: '40' }).line).toBe('x = 30 ÷ 40 = 0,75');
    expect(T(Q.solveForm({ form: 'over', a: '24', b: '0,25' }).x)).toBe('6');
    expect(Q.solveForm({ form: 'over', a: '24', b: '0,25' }).inverse).toBe('×');
    expect(T(Q.solveForm({ form: 'plus', a: '7', b: '12,5' }).x)).toBe('11/2');
    expect(T(Q.solveForm({ form: 'under', a: '63', b: '4,5' }).x)).toBe('14');
  });
  it('refuses a = 0, b = 0 for a ÷ x, and a negative x unless asked', () => {
    expect(() => Q.solveForm({ form: 'times', a: '0', b: '3' })).toThrow();
    expect(() => Q.solveForm({ form: 'under', a: '5', b: '0' })).toThrow();
    expect(() => Q.solveForm({ form: 'plus', a: '7', b: '2' })).toThrow();
    expect(T(Q.solveForm({ form: 'plus', a: '7', b: '2' }, { allowNegative: true }).x)).toBe('-5');
  });
  it('checks a value by doing the ONE operation', () => {
    expect(Q.checkForm({ form: 'under', a: '12', b: '4' }, 3)).toMatchObject({ holds: true, line: '12 ÷ 3 = 4' });
    expect(Q.checkForm({ form: 'under', a: '4,8', b: '1,6' }, 3).holds).toBe(true);
    expect(Q.checkForm({ form: 'times', a: '2,5', b: '10' }, 5).holds).toBe(false);
    expect(Q.checkForm({ form: 'under', a: '5', b: '1' }, 0).holds).toBe(false);
  });
  it('undoes the LAST operation first', () => {
    const t = Q.undoChain({ k: 2, c: 240, d: 300, order: 'times-first' });
    expect(t.last).toBe('+ 240'); expect(T(t.mid)).toBe('60'); expect(T(t.x)).toBe('30');
    const p = Q.undoChain({ k: '0,25', c: 4, d: 40, order: 'plus-first' });
    expect(p.last).toBe('÷ 0,25'); expect(T(p.mid)).toBe('10'); expect(T(p.x)).toBe('6');
    expect(() => Q.undoChain({ k: 2, c: 400, d: 300, order: 'times-first' })).toThrow();
  });
  it('reads what the student types', () => {
    expect(Q.formOf('2,5x = 10')).toEqual({ form: 'times', a: '2.5', b: '10' });
    expect(Q.formOf('12 × x = 18')).toEqual({ form: 'times', a: '12', b: '18' });
    expect(Q.formOf('x ÷ 0,4 = 15')).toEqual({ form: 'over', a: '0.4', b: '15' });
    expect(Q.formOf('56/x=7')).toEqual({ form: 'under', a: '56', b: '7' });
    expect(Q.formOf('18 ÷ x = 12')).toEqual({ form: 'under', a: '18', b: '12' });
    expect(Q.formOf('x ÷ 12 = 18')).toEqual({ form: 'over', a: '12', b: '18' });
    expect(Q.formOf('blah')).toBe(null);
  });
});
