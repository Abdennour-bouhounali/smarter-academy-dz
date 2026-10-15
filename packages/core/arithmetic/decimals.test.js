import { describe, it, expect } from 'vitest';
import {
  make, fromSlip, parse, cmp, eq, normalize, format, formatTrim, slipText, slipValueText, fractionOf, fractionText, shift, opExponent, OPERATORS,
  integerPart, countOfExp, rankName, exponentsOf, decomposeDigits, rankTable, decomposition, partName, readFraction, readTail, piecesOf, pow10,
} from './decimals.js';

describe('decimals — parse and format are exact and round-trip', () => {
  it('parse reads comma, point, fraction with a power-of-ten denominator; rejects the rest', () => {
    expect(parse('2,35')).toEqual({ n: 235, k: 2 });
    expect(parse('2.35')).toEqual({ n: 235, k: 2 });
    expect(parse('12')).toEqual({ n: 12, k: 0 });
    expect(parse('0,05')).toEqual({ n: 5, k: 2 });
    expect(parse('3125/1000')).toEqual({ n: 3125, k: 3 });
    expect(parse('605/100')).toEqual({ n: 605, k: 2 });
    expect(parse('7/1')).toEqual({ n: 7, k: 0 });
    expect(parse('1 234,5')).toEqual({ n: 12345, k: 1 });
    for (const bad of ['', 'x', '1/3', '3/0', '3/25', '2,', ',5', '--1', '1,2,3', null, undefined]) expect(parse(bad), String(bad)).toBeNull();
  });

  it('format keeps the k decimals; formatTrim drops the useless trailing zeros; slipText prints the slip as written', () => {
    expect(format({ n: 250, k: 2 })).toBe('2,50');
    expect(formatTrim({ n: 250, k: 2 })).toBe('2,5');
    expect(formatTrim({ n: 1200, k: 2 })).toBe('12');
    expect(format({ n: 5, k: 2 })).toBe('0,05');
    expect(format({ n: 0, k: 0 })).toBe('0');
    expect(slipText('235', 2)).toBe('2,35');
    expect(slipText('235', 0)).toBe('235');
    expect(slipText('235', 3)).toBe('0,235');
    expect(slipText('05', 2)).toBe('0,05');
    expect(slipText('05', 0)).toBe('05');
    expect(slipText('250', 2)).toBe('2,50');
    expect(slipValueText('250', 2)).toBe('2,5');
  });

  it('every digit string of ≤ 5 digits at every comma place: value is N / 10^p, text round-trips', () => {
    let seen = 0;
    for (let len = 1; len <= 5; len += 1) {
      for (let n = 0; n < 10 ** len; n += len < 4 ? 1 : 137) {
        const digits = String(n).padStart(len, '0');
        for (let p = 0; p <= len; p += 1) {
          const v = fromSlip(digits, p);
          expect(v).toEqual({ n, k: p });
          const back = parse(format(v));
          expect(eq(back, v), `${digits}/${p}`).toBe(true);
          expect(format(v).replace(',', '').replace(/^0+(?=\d)/, '')).toBe(String(n).padStart(p + 1, '0').replace(/^0+(?=\d)/, ''));
          expect(slipText(digits, p).replace(',', '').length).toBeGreaterThanOrEqual(len);
          seen += 1;
        }
      }
    }
    expect(seen).toBeGreaterThan(5000);
  });

  it('compare is exact across scales', () => {
    expect(cmp(parse('2,5'), parse('2,50'))).toBe(0);
    expect(cmp(parse('0,235'), parse('2,35'))).toBe(-1);
    expect(cmp(parse('23,5'), parse('2,35'))).toBe(1);
    expect(eq(parse('3125/1000'), parse('3,125'))).toBe(true);
    expect(eq(parse('605/100'), parse('6,05'))).toBe(true);
    expect(normalize(make(250, 2))).toEqual({ n: 25, k: 1 });
    expect(normalize(make(0, 3))).toEqual({ n: 0, k: 0 });
  });

  it('the fraction has as many zeros as digits after the comma', () => {
    expect(fractionOf(parse('2,35'))).toMatchObject({ num: 235, den: 100, zeros: 2, text: '235/100' });
    expect(fractionText(parse('31,25'))).toBe('3125/100');
    expect(fractionText(make(235, 0))).toBe('235/1');
    expect(fractionText(make(5, 3))).toBe('5/1000');
    expect(pow10(6)).toBe(1000000);
  });
});

describe('decimals — shifting the comma by a power of ten', () => {
  it('× 10^e and ÷ 10^e, zeros appear where they must', () => {
    expect(formatTrim(shift(parse('143,75'), 3))).toBe('143750');
    expect(formatTrim(shift(parse('3,5'), 2))).toBe('350');
    expect(formatTrim(shift(parse('3,5'), 1))).toBe('35');
    expect(formatTrim(shift(parse('3,5'), -2))).toBe('0,035');
    expect(formatTrim(shift(parse('43,7'), -3))).toBe('0,0437');
    expect(formatTrim(shift(parse('27,5'), -1))).toBe('2,75');
    expect(formatTrim(shift(parse('0,6'), -2))).toBe('0,006');
    expect(formatTrim(shift(parse('15'), -4))).toBe('0,0015');
  });

  it('shift ± 3 keeps the digits and is reversible, for every value of ≤ 5 digits at every place', () => {
    for (let n = 0; n < 3000; n += 7) {
      for (let p = 0; p <= 4; p += 1) {
        const v = make(n, p);
        for (let e = -3; e <= 3; e += 1) {
          const w = shift(v, e);
          expect(eq(shift(w, -e), v), `${n}/${p}/${e}`).toBe(true);
          // the digit string is unchanged apart from zeros at its ends
          expect(String(w.n).replace(/0+$/, '').replace(/^0+/, '')).toBe(String(n).replace(/0+$/, '').replace(/^0+/, ''));
        }
      }
    }
  });

  it('opExponent covers the nine operators of the machine', () => {
    expect(OPERATORS.map(opExponent)).toEqual([1, 2, 3, -1, -2, -3, -1, -2, -3]);
    expect(opExponent('÷0,1')).toBe(1);
    expect(opExponent('× 100')).toBe(2);
    expect(opExponent('+10')).toBeNull();
  });
});

describe('decimals — ranks, decomposition, counts', () => {
  it('names of ranks and exponents of a slip', () => {
    expect(rankName(0)).toBe('الآحاد');
    expect(rankName(1)).toBe('العشرات');
    expect(rankName(-1)).toBe('الأعشار');
    expect(rankName(-2)).toBe('الأجزاء من مائة');
    expect(rankName(-3)).toBe('الأجزاء من ألف');
    expect(exponentsOf('14375', 2)).toEqual([2, 1, 0, -1, -2]);
    expect(exponentsOf('35', 2)).toEqual([-1, -2]);
  });

  it('decomposition drops empty ranks; rankTable keeps them', () => {
    expect(decomposition(parse('2,35'))).toMatchObject({ fraction: '2 + 3/10 + 5/100', times: '2 + 3 × 0,1 + 5 × 0,01' });
    expect(decomposition(parse('6,05')).fraction).toBe('6 + 5/100');
    expect(decomposition(parse('0,05')).times).toBe('5 × 0,01');
    expect(decomposition(parse('30,2')).fraction).toBe('3 × 10 + 2/10');
    expect(decomposition(parse('0')).fraction).toBe('0');
    expect(rankTable(parse('0,05')).map((r) => r.digit)).toEqual([0, 0, 5]);
    expect(decomposeDigits(parse('2,50'))).toEqual([{ digit: 2, exp: 0 }, { digit: 5, exp: -1 }]);
  });

  it('the NUMBER of tenths / hundredths is not the digit of the rank', () => {
    const v = parse('217,48');
    expect(countOfExp(v, -1)).toBe(2174);
    expect(countOfExp(v, -2)).toBe(21748);
    expect(countOfExp(v, 0)).toBe(217);
    expect(countOfExp(v, 1)).toBe(21);
    expect(integerPart(v)).toBe(217);
  });

  it('piecesOf: panels, strips, tiles, shards — exact', () => {
    expect(piecesOf(parse('2,35'))).toMatchObject({ units: 2, tenths: 3, hundredths: 5, thousandths: 0, panels: 2, finer: null });
    expect(piecesOf(parse('3,125'))).toMatchObject({ units: 3, tenths: 1, hundredths: 2, thousandths: 5 });
    expect(piecesOf(parse('235'))).toMatchObject({ units: 5, tens: 3, hundreds: 2, panels: 235, tenths: 0 });
    expect(piecesOf(parse('0,235'))).toMatchObject({ units: 0, tenths: 2, hundredths: 3, thousandths: 5, panels: 0 });
    expect(piecesOf(parse('3125')).more).toBe(3000);
    expect(piecesOf(parse('0,12345')).finer).toEqual({ n: 45, k: 5 });
    expect(piecesOf(parse('0,1230')).finer).toBeNull();
    for (let n = 0; n < 2000; n += 13) {
      for (let p = 0; p <= 3; p += 1) {
        const q = piecesOf(make(n, p));
        // the pieces rebuild the value exactly
        const rebuilt = (q.more + q.hundreds * 100 + q.tens * 10 + q.units) * 1000 + q.tenths * 100 + q.hundredths * 10 + q.thousandths;
        expect(rebuilt, `${n}/${p}`).toBe(Math.floor((n * 1000) / 10 ** p));
      }
    }
  });
});

describe('decimals — Arabic reading', () => {
  it('plural agreement of the pieces', () => {
    expect([1, 2, 3, 10, 11, 35].map((c) => partName(1, c))).toEqual(['عُشر', 'عُشران', 'أعشار', 'أعشار', 'عُشرًا', 'عُشرًا']);
    expect([1, 2, 5, 235].map((c) => partName(2, c))).toEqual(['جزء من مائة', 'جزآن من مائة', 'أجزاء من مائة', 'جزءًا من مائة']);
    expect(partName(3, 125)).toBe('جزءًا من ألف');
    // beyond 100 the noun follows the last two digits
    expect([100, 101, 102, 103, 105, 110, 111, 205, 600].map((c) => partName(2, c))).toEqual(['جزء من مائة', 'جزء من مائة', 'جزء من مائة', 'أجزاء من مائة', 'أجزاء من مائة', 'أجزاء من مائة', 'جزءًا من مائة', 'أجزاء من مائة', 'جزء من مائة']);
  });
  it('reads the fraction and the tail', () => {
    expect(readFraction(parse('2,35'))).toBe('مائتان وخمسة وثلاثون جزءًا من مائة');
    expect(readFraction(parse('3,5'))).toBe('خمسة وثلاثون عُشرًا');
    expect(readFraction(parse('7'))).toBe('سبعة');
    expect(readTail(parse('2,35'))).toBe('ثلاثة أعشار وخمسة أجزاء من مائة');
    expect(readTail(parse('6,05'))).toBe('خمسة أجزاء من مائة');
    expect(readTail(parse('2,00'))).toBe('');
    expect(readFraction(parse('6,05'))).toBe('ستمائة وخمسة أجزاء من مائة');
    for (let n = 0; n < 4000; n += 11) for (let p = 0; p <= 3; p += 1) {
      const s = readFraction(make(n, p)) + readTail(make(n, p));
      expect(s).not.toMatch(/undefined|NaN|\s{2}|10\^/);
    }
  });
});
