/**
 * The helpers of the shared suites (`test/suites.js`) and of the Node reader (`test/bank.js`) catch what they claim to:
 * a false equality, a number glued to the wrong form of its noun, a list with a plain space before its comma, a pair a
 * line of the bank chains. A suite whose helper said « fine » to everything would prove nothing.
 */
import { describe, it, expect } from 'vitest';
import {
  NOUNS,
  PROVEN_LIMITS,
  agreementErrors,
  answersOf,
  equalitiesHold,
  looseComma,
  plain,
  said,
  stringsIn,
  trueEqualities,
  valueOf,
} from './test/suites.js';
import { alone, bankPairs, collisions, gradeOf, islandNamesIn, pairLines, readBank } from './test/bank.js';

describe('the shared suites’ helpers', () => {
  it('reads an arithmetic side, a PGCD of numbers — and nothing with a letter or a box', () => {
    expect(valueOf('19 \\times 4 + 3')).toBe(79);
    expect(valueOf('152 - 95')).toBe(57);
    expect(valueOf('152 − 95 - 50')).toBe(7);
    expect(valueOf('\\mathrm{PGCD}(32 ; 44)')).toBe(4);
    expect(valueOf('PGCD(1833 ; 546)')).toBe(39);
    expect(valueOf('a - b')).toBe(null);
    expect(valueOf('\\square')).toBe(null);
  });

  it('an equality must be TRUE; a sentence’s formulas and isolated equalities are read', () => {
    expect(equalitiesHold('962 = 296 \\times 3 + 74 \\qquad 296 = 74 \\times 4 + 0')).toBe(2);
    expect(equalitiesHold('\\mathrm{PGCD}(152 ; 95) = \\mathrm{PGCD}(95 ; 57)')).toBe(1);
    expect(equalitiesHold('a = b \\times q + r')).toBe(0);
    expect(() => equalitiesHold('\\mathrm{PGCD}(152 ; 95) = 57')).toThrow();
    expect(trueEqualities('لدينا $259 - 185 = 74$ و ⁦7 + 5 = 12⁩')).toBe(2);
    expect(() => trueEqualities('لدينا ⁦7 + 5 = 13⁩')).toThrow();
  });

  it('finds a number glued to the wrong form of its noun — and accepts the right ones', () => {
    expect(agreementErrors('في الكيس 12 قطعة، و 5 قطع، وهوّة 152 خانة، و 7 خانات، و 0 خانة')).toEqual([]);
    expect(agreementErrors('بقيت 6 خانة')).toEqual(['6 خانة']);
    expect(agreementErrors('في الكيس 12 قطع')).toEqual(['12 قطع']);
    expect(agreementErrors('2 قسمات')).toEqual(['2 قسمات']);
    expect(agreementErrors('31 عملية طرح مقابل 3 عمليات طرح')).toEqual([]);
    expect(agreementErrors('هوّة 1003 خانة')).toEqual(['1003 خانة']);
    expect(agreementErrors('هوّة 1003 خانة', NOUNS, { past100: false })).toEqual([]);
  });

  it('a list with a plain space before its comma; strings found anywhere in a value', () => {
    expect(looseComma('1 ، 2')).toBe(true);
    expect(looseComma('1 ، 2')).toBe(false);
    expect(stringsIn({ a: 'x', b: ['y', { c: 'z' }], f: () => 'no', n: 3 })).toEqual(['x', 'y', 'z']);
    said('جملة كاملة');
    plain('جملة بلا معادلة');
    expect(() => said('اللوح undefined')).toThrow();
    expect(() => plain('$1 + 1$')).toThrow();
  });

  it('the answers a student can write: the right one, every box wrong, swapped, empty, then the lesson’s own', () => {
    const out = answersOf({ kind: 'k' }, { e: 57, g: 19 }, ['e', 'g'], (q, r) => [{ ...r, g: 57 }]);
    expect(out[0]).toEqual({ e: 57, g: 19 });
    expect(out).toContainEqual({ e: 19, g: 57 });
    expect(out).toContainEqual({ e: 57, g: '' });
    expect(out).toContainEqual({ e: 57, g: 57 });
    expect(out.at(-1)).toBe(null);
  });

  it('the proven limits are the walks’ numbers (trusted.md: 2 to 4 columns of tiles)', () => {
    expect(PROVEN_LIMITS.slots).toEqual([2, 4]);
    expect(PROVEN_LIMITS.useBoxes).toBe(4);
  });
});

describe('the Node reader of a bank and of the stories', () => {
  const fake = {
    id: 'x',
    sheets: [
      { file: 'level-1/a.json', text: '"$\\\\text{PGCD}(21 ; 14)$"\n"للعددين 30 و 45"\n"$161 - 115 = 46$"' },
      { file: 'level-2/b.json', text: '"قواسم العدد 360 هي: 1 ، 2 ، 3 ، 4 ، 5 ، 6 ، 36 ، 90"' },
    ],
  };
  it('the pairs a bank names, however « PGCD » is written', () => {
    expect([...bankPairs(fake)].sort()).toEqual(['14;21', '30;45']);
  });
  it('a pair a line chains collides; a list of divisors is not a pair', () => {
    expect(pairLines(fake.sheets[0].text, 161, 115)).toHaveLength(1);
    expect(pairLines(fake.sheets[1].text, 36, 90)).toEqual([]);
    expect(alone(16).test('161')).toBe(false);
    const r = collisions(fake, [115, 161], { stories: [], pairs: bankPairs(fake) });
    expect(r.clear).toBe(false);
    expect(r.bankLines).toHaveLength(1);
    expect(collisions(fake, [37, 74], { stories: [], pairs: bankPairs(fake) }).clear).toBe(true);
  });
  it('finds a real bank and its grade; an island’s name in a story', () => {
    expect(gradeOf('no-such-lesson')).toBe(null);
    expect(() => readBank('no-such-lesson')).toThrow(/no exercise bank/);
    expect(islandNamesIn("{ id: 'A', name: 'مرسى الخشّابين', R: 9 }")).toEqual(['مرسى الخشّابين']);
  });
});
