import { describe, it, expect } from 'vitest';
import * as F from './fractions2.js';
import * as D from './decimals.js';

describe('fractions2 — E1 (kasr-hasil-qisma)', () => {
  it('clearDecimals : le rang qui rend le diviseur naturel', () => {
    expect(F.clearDecimals('4,2', '0,35')).toEqual({ ka: 1, kb: 2, k: 2, a10: 420, b10: 35 });
    expect(F.clearDecimals('15,96', '2,8')).toMatchObject({ kb: 1, k: 2, a10: 1596, b10: 280 });
    expect(F.clearDecimals('4,6', '0,7')).toMatchObject({ k: 1, a10: 46, b10: 7 });
    expect(F.clearDecimals('8', '3')).toMatchObject({ k: 0, a10: 8, b10: 3 });
    expect(F.clearDecimals('2,50', '1,0')).toMatchObject({ kb: 0, k: 1, a10: 25, b10: 10 });
    expect(() => F.clearDecimals('1', '0')).toThrow();
  });
  it('decimalQuotientBracket : 8/3, 9/4, 12,5/0,35, 5/7', () => {
    const t = (r) => [D.format(r.lo), D.format(r.hi), r.exact];
    expect(t(F.decimalQuotientBracket('8', '3', 0))).toEqual(['2', '3', false]);
    expect(t(F.decimalQuotientBracket('8', '3', 1))).toEqual(['2,6', '2,7', false]);
    expect(t(F.decimalQuotientBracket('8', '3', 2))).toEqual(['2,66', '2,67', false]);
    expect(t(F.decimalQuotientBracket('9', '4', 2))).toEqual(['2,25', '2,25', true]);
    expect(t(F.decimalQuotientBracket('12,5', '0,35', 2))).toEqual(['35,71', '35,72', false]);
    expect(t(F.decimalQuotientBracket('5', '7', 2))).toEqual(['0,71', '0,72', false]);
    expect(t(F.decimalQuotientBracket('4,6', '0,7', 2))).toEqual(['6,57', '6,58', false]);
  });
  it('decimalQuotientBracket : balayage — b × lo ≤ a < b × hi, largeur 10^-k', () => {
    for (let a10 = 1; a10 <= 999; a10 += 7) for (const b of ['2', '3', '7', '12', '0,7', '1,8', '0,35']) {
      const a = D.format(D.make(a10, 1));
      for (const k of [0, 1, 2]) {
        const r = F.decimalQuotientBracket(a, b, k);
        expect(F.fitsAtRank(a, b, D.format(r.lo)).verdict).not.toBe('over');
        const hi = F.fitsAtRank(a, b, D.format(r.hi)).verdict;
        expect(hi).toBe(r.exact ? 'exact' : 'over');
        expect(r.hi.n - r.lo.n).toBe(r.exact ? 0 : 1);
      }
    }
  });
  it('fitsAtRank : 3 × 2,66 laisse 0,02 ; 3 × 2,67 déborde de 0,01 ; 4 × 2,25 tombe juste', () => {
    const f = (a, b, q) => { const r = F.fitsAtRank(a, b, q); return [r.verdict, D.format(r.gap)]; };
    expect(f('8', '3', '2,66')).toEqual(['fits', '0,02']);
    expect(f('8', '3', '2,67')).toEqual(['over', '0,01']);
    expect(f('9', '4', '2,25')).toEqual(['exact', '0,00']);
    expect(f('4,6', '0,7', '6,57')).toEqual(['fits', '0,001']);
    expect(F.fitsAtRank('8', '3', '2').product).toEqual(D.make(6, 0));
  });
  it('isDecimalQuotient : 9/4 oui, 8/3 non, 4,6/0,7 non, 13,5/1,8 oui, 5/6 non, 7/8 oui', () => {
    expect(['9|4', '8|3', '4,6|0,7', '13,5|1,8', '5|6', '7|8', '3,6|0,08'].map((s) => F.isDecimalQuotient(...s.split('|')))).toEqual([true, false, false, true, false, true, true]);
  });
});
