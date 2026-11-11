import { describe, it, expect } from 'vitest';
import { M1_ROUNDS, FREE_LISTS, PRACTICE, CHALLENGE } from './bags';
import { roundWon, emptyLog, logEvent } from '../../../../../../common/manipulations/rounds/roundsModel';

const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const divisors = (n) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);

describe('rounds of the solidarity bags (common-divisors)', () => {
  it('by hand with questions → predictions → the book lists with questions → a challenge → free lists', () => {
    const [r1, r2, r3] = M1_ROUNDS;
    expect(r1.props.handDone).toBeUndefined();
    expect(r1.props.chains).toEqual(['groups']);
    expect(r2.props.predict).toBe(true);
    expect(r2.props.handDone).toBe(true);
    expect([r3.props.a, r3.props.b]).toEqual([42, 60]);
    expect(r3.props.startWith).toBe('lists');
    expect(r3.props.chains).toEqual(['lists']);
    expect(M1_ROUNDS.some((r) => r.optional)).toBe(true);
    expect(M1_ROUNDS.some((r) => r.free)).toBe(true);
  });
  it('the easier rounds are really smaller', () => {
    expect(PRACTICE.groups.a + PRACTICE.groups.b).toBeLessThan(M1_ROUNDS[1].props.a + M1_ROUNDS[1].props.b);
    expect(PRACTICE.lists.a + PRACTICE.lists.b).toBeLessThan(M1_ROUNDS[2].props.a + M1_ROUNDS[2].props.b);
  });
  it('round 2 is won only once the PGCD fell AND a larger number of bags was tried; one by one still earns the third star', () => {
    const r2 = M1_ROUNDS[1];
    const g = gcd(r2.props.a, r2.props.b);
    let log = emptyLog();
    for (let k = 1; k <= g; k += 1) log = logEvent(log, 'verdict', { groups: k, exact: r2.props.a % k === 0 && r2.props.b % k === 0 });
    expect(roundWon(r2, log)).toBe(false);
    log = logEvent(log, 'verdict', { groups: g + 1, exact: false });
    expect(roundWon(r2, log)).toBe(true);
    expect(log.verdicts.length).toBeLessThanOrEqual(r2.stars.maxTrials);
  });
  it('the challenge lead tells the truth (72 has twelve divisors)', () => {
    expect(divisors(CHALLENGE.b)).toHaveLength(12);
  });
  it('never uses the climax problem (90 pens, 126 notebooks) nor its PGCD 18 as an answer', () => {
    const text = JSON.stringify(M1_ROUNDS);
    [90, 126].forEach((x) => expect(new RegExp(`(^|[^0-9])${x}([^0-9]|$)`).test(text), `${x}`).toBe(false));
    [...FREE_LISTS, ...M1_ROUNDS.map((r) => r.props)].forEach(({ a, b }) => expect(gcd(a, b)).not.toBe(18));
  });
  it('the free round offers its own pair', () => {
    const f = M1_ROUNDS.find((r) => r.free);
    expect(f.props.choices.some((c) => c.a === f.props.a && c.b === f.props.b)).toBe(true);
  });
});
