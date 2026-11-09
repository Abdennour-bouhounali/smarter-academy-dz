import { describe, it, expect } from 'vitest';
import { M1_ROUNDS, M2_ROUNDS, FREE_FRACS, gcd } from './recipes';
import { roundWon, emptyLog, logEvent, starsFor } from '../../../../../../common/manipulations/rounds/roundsModel';

const ALL = [...M1_ROUNDS, ...M2_ROUNDS];
const fracsOf = (rounds) => [...rounds.map((r) => r.props), ...rounds.filter((r) => r.easier).map((r) => r.easier.props)];

describe('rounds of the kitchen (fraction-reduction)', () => {
  it('every fraction is reducible (something to do) and has a non-zero denominator', () => {
    [...fracsOf(ALL), ...FREE_FRACS].forEach(({ n, d }) => { expect(d).not.toBe(0); expect(gcd(n, d), `${n}/${d}`).toBeGreaterThan(1); });
  });
  it('module 1: by hand with both question sets, then Samir\'s 84/48 with predictions; module 2: the one-step question set first', () => {
    expect(M1_ROUNDS[0].props.chains).toEqual(['steps', 'pgcd']);
    expect([M1_ROUNDS[1].props.n, M1_ROUNDS[1].props.d]).toEqual([84, 48]);
    expect(M1_ROUNDS[1].props.predict).toBe(true);
    expect(M2_ROUNDS[0].props.chains).toEqual(['pgcd']);
    [M1_ROUNDS, M2_ROUNDS].forEach((rs) => { expect(rs.some((r) => r.optional)).toBe(true); expect(rs.some((r) => r.free)).toBe(true); });
  });
  it('the easier rounds are really smaller', () => {
    ALL.filter((r) => r.easier).forEach((r) => expect(r.easier.props.n + r.easier.props.d).toBeLessThan(r.props.n + r.props.d));
  });
  it('a round without questions is won by the one-step division; right first time earns the third star', () => {
    const r2 = M2_ROUNDS.find((r) => r.id === 'r2');
    const g = gcd(r2.props.n, r2.props.d);
    expect(roundWon(r2, logEvent(emptyLog(), 'verdict', { groups: 6, exact: false }))).toBe(false);
    expect(starsFor({ ...r2, stars: { maxTrials: 1, predict: false } }, logEvent(emptyLog(), 'verdict', { groups: g, exact: true }))).toBe(3);
  });
  it('the challenge 595/560 really needs a divisor above 12 (path B offers the common divisors)', () => {
    expect(gcd(595, 560)).toBe(35);
  });
  it('never uses the climax problem (105 spoons, 147 cups) nor its PGCD 21', () => {
    const text = JSON.stringify(ALL);
    [105, 147].forEach((x) => expect(new RegExp(`(^|[^0-9])${x}([^0-9]|$)`).test(text), `${x}`).toBe(false));
    [...fracsOf(ALL), ...FREE_FRACS].forEach(({ n, d }) => expect(gcd(n, d)).not.toBe(21));
  });
  it('each free round offers its own fraction', () => {
    ALL.filter((r) => r.free).forEach((r) => expect(r.props.choices.some((c) => c.n === r.props.n && c.d === r.props.d)).toBe(true));
  });
});
