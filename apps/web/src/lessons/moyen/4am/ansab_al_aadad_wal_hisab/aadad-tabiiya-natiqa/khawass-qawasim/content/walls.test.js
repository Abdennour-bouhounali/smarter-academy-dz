import { describe, it, expect } from 'vitest';
import { M1_ROUNDS, PRACTICE_CASES, BIG_CASE, CHALLENGE_CASE, FREE_CASES } from './walls';
import { roundWon, emptyLog, logEvent } from '../../../../../../common/manipulations/rounds/roundsModel';

const valid = ({ n, a, b }) => a % n === 0 && b % n === 0 && a >= b;
const CLIMAX = [25, 875, 350];

describe('rounds of the work site (divisor-properties)', () => {
  it('every case is valid: n divides a and b, a ≥ b', () => {
    [...Object.values(PRACTICE_CASES), BIG_CASE, CHALLENGE_CASE, ...FREE_CASES].forEach((c) => expect(valid(c), JSON.stringify(c)).toBe(true));
    M1_ROUNDS.forEach((r) => { expect(valid(r.props), r.id).toBe(true); (r.props.sequence ?? []).forEach((c) => expect(valid(c)).toBe(true)); });
  });
  it('round 1 by hand with its questions; the next rounds open with the learned gesture', () => {
    const [r1, ...rest] = M1_ROUNDS;
    expect(r1.props.handDone).toBeUndefined();
    expect(r1.props.chains).toEqual(['sum', 'diff', 'rem']);
    rest.forEach((r) => expect(r.props.handDone).toBe(true));
  });
  it('a free round, a challenge, and an easier practice round on every hard round', () => {
    expect(M1_ROUNDS.some((r) => r.free)).toBe(true);
    expect(M1_ROUNDS.some((r) => r.optional)).toBe(true);
    ['r2', 'r3'].forEach((id) => expect(M1_ROUNDS.find((r) => r.id === id).easier).toBeTruthy());
  });
  it('never uses the numbers of the climax problem (bricks of 25, walls of 875 and 350)', () => {
    const text = JSON.stringify(M1_ROUNDS) + JSON.stringify(FREE_CASES);
    CLIMAX.forEach((x) => expect(new RegExp(`(^|[^0-9])${x}([^0-9]|$)`).test(text), `${x}`).toBe(false));
  });
  it('the sequence round is won when the six walls of both cases are built, not before', () => {
    const r2 = M1_ROUNDS.find((r) => r.id === 'r2');
    let log = emptyLog();
    [1, 2, 3, 4, 5].forEach((g) => { log = logEvent(log, 'verdict', { groups: g, exact: true }); });
    expect(roundWon(r2, log)).toBe(false);
    log = logEvent(log, 'verdict', { groups: 6, exact: true });
    expect(roundWon(r2, log)).toBe(true);
  });
  it('the real property holds on every case: n divides a + b, a − b and the remainder of a by b', () => {
    [...M1_ROUNDS.map((r) => r.props), ...M1_ROUNDS.flatMap((r) => r.props.sequence ?? []), ...FREE_CASES].forEach(({ n, a, b }) => {
      expect((a + b) % n).toBe(0); expect((a - b) % n).toBe(0); expect((a % b) % n).toBe(0);
    });
  });
});
