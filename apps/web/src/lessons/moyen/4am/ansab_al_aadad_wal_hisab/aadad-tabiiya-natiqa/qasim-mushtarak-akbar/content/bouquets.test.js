import { describe, it, expect } from 'vitest';
import { M1_ROUNDS, M2_ROUNDS, FREE_GROUPS, FREE_LISTS, PRACTICE } from './bouquets';
import { roundWon, emptyLog, logEvent } from '../../../../../../common/manipulations/rounds/roundsModel';

const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const ALL = [...M1_ROUNDS, ...M2_ROUNDS];
const CLIMAX = [120, 84];

describe('rounds of the flower shop (common-divisors)', () => {
  it('module 1: by hand with questions, then the book numbers with predictions, then the lists, a challenge and a free shop', () => {
    const [r1, r2, r3] = M1_ROUNDS;
    expect(r1.props.handDone).toBeUndefined();
    expect(r1.props.chains).toEqual(['groups']);
    expect(r2.props.handDone).toBe(true);
    expect(r2.props.predict).toBe(true);
    expect(r3.props.startWith).toBe('lists');
    expect(r3.props.chains).toEqual(['lists']);
    expect(M1_ROUNDS.some((r) => r.optional)).toBe(true);
    expect(M1_ROUNDS.some((r) => r.free)).toBe(true);
    expect(M2_ROUNDS[0].props.startWith).toBe('lists');
  });
  it('every hard round has an easier practice round, which is really smaller', () => {
    ['r2', 'r3'].forEach((id) => {
      const r = M1_ROUNDS.find((x) => x.id === id);
      expect(r.easier).toBeTruthy();
      expect(r.easier.props.a + r.easier.props.b).toBeLessThan(r.props.a + r.props.b);
    });
    expect(M2_ROUNDS[0].easier.props.a).toBe(PRACTICE.lists2.a);
  });
  it('a groups round is won only when the PGCD fell exactly AND a larger number of groups was tried', () => {
    const r2 = M1_ROUNDS.find((r) => r.id === 'r2');
    const g = gcd(r2.props.a, r2.props.b);
    expect(g).toBe(18);
    let log = emptyLog();
    for (let k = 1; k <= g; k += 1) log = logEvent(log, 'verdict', { groups: k, exact: r2.props.a % k === 0 && r2.props.b % k === 0 });
    expect(roundWon(r2, log)).toBe(false);
    log = logEvent(log, 'verdict', { groups: g + 1, exact: false });
    expect(roundWon(r2, log)).toBe(true);
    expect(log.verdicts.length).toBeLessThanOrEqual(r2.stars.maxTrials); // one by one up to g + 1 still earns the third star
  });
  it('a lists challenge is won by placing the PGCD (the lab reports it as a verdict)', () => {
    const c = M2_ROUNDS.find((r) => r.id === 'challenge');
    const log = logEvent(emptyLog(), 'verdict', { groups: gcd(c.props.a, c.props.b), exact: true });
    expect(roundWon(c, log)).toBe(true);
  });
  it('never uses the numbers of the climax problem (120 red roses, 84 white), nor its answer as a PGCD', () => {
    const text = JSON.stringify(ALL);
    CLIMAX.forEach((x) => expect(new RegExp(`(^|[^0-9])${x}([^0-9]|$)`).test(text), `${x}`).toBe(false));
    [...FREE_GROUPS, ...FREE_LISTS, ...ALL.map((r) => r.props)].forEach(({ a, b }) => expect(gcd(a, b), `${a},${b}`).not.toBe(12));
  });
  it('every pair has more than one common divisor (something to discover), and the free choices hold the round\'s own pair', () => {
    [...FREE_GROUPS, ...FREE_LISTS, ...ALL.map((r) => r.props)].forEach(({ a, b }) => expect(gcd(a, b)).toBeGreaterThan(1));
    ALL.filter((r) => r.free).forEach((r) => expect(r.props.choices.some((c) => c.a === r.props.a && c.b === r.props.b)).toBe(true));
  });
});
