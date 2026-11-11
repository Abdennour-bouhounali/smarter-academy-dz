import { describe, it, expect } from 'vitest';
import * as divisibility from '@smarter-academy/core/arithmetic/divisibility.js';
import { M1_ROUNDS, M3_ROUNDS, D_FREE, E_FREE, gcd } from './ribbons';
import { roundWon, emptyLog, logEvent, starsFor } from '../../../../../../common/manipulations/rounds/roundsModel';

const { differenceSteps, euclidSteps } = divisibility;
const allPairs = (rounds, free) => [...rounds.map((r) => r.props), ...rounds.filter((r) => r.easier).map((r) => r.easier.props), ...free];

describe('rounds of the sewing workshop (pgcd-differences, euclidean-algorithm)', () => {
  it('every pair is valid for its lab (no a = b; Euclid: neither divides the other, ≤ 12 divisions; differences ≤ 30 cuts)', () => {
    allPairs(M1_ROUNDS, D_FREE).forEach(({ a, b }) => {
      expect(a).not.toBe(b);
      expect(differenceSteps(a, b).steps.length, `${a},${b}`).toBeLessThanOrEqual(30);
    });
    allPairs(M3_ROUNDS, E_FREE).forEach(({ a, b }) => {
      expect(Math.max(a, b) % Math.min(a, b), `${a},${b}`).not.toBe(0);
      expect(euclidSteps(a, b).steps.length, `${a},${b}`).toBeLessThanOrEqual(12);
    });
  });
  it('round 1 by hand with both question sets; round 2 with predictions and the learned button; the others without questions', () => {
    [[M1_ROUNDS, ['cuts', 'pgcd']], [M3_ROUNDS, ['divs', 'pgcd']]].forEach(([rounds, chains]) => {
      const [r1, r2, r3] = rounds;
      expect(r1.props.handDone).toBeUndefined();
      expect(r1.props.chains).toEqual(chains);
      expect(r2.props.predict).toBe(true);
      expect(r2.props.handDone).toBe(true);
      expect(r3.props.chains).toEqual([]);
      expect(rounds.some((r) => r.optional)).toBe(true);
      expect(rounds.some((r) => r.free)).toBe(true);
      ['r2', 'r3'].forEach((id) => expect(rounds.find((r) => r.id === id).easier).toBeTruthy());
    });
  });
  it('a round without questions is won by placing the PGCD; placing it right first time earns the third star', () => {
    const r3 = M1_ROUNDS.find((r) => r.id === 'r3');
    const g = gcd(r3.props.a, r3.props.b);
    const wrong = logEvent(emptyLog(), 'verdict', { groups: g * 2, exact: false });
    expect(roundWon(r3, wrong)).toBe(false);
    const thenRight = logEvent(wrong, 'verdict', { groups: g, exact: true });
    expect(starsFor(r3, thenRight)).toBe(2);
    expect(starsFor(r3, logEvent(emptyLog(), 'verdict', { groups: g, exact: true }))).toBe(3);
  });
  it('the textbook pairs are the activity numbers', () => {
    expect([M1_ROUNDS[1].props.a, M1_ROUNDS[1].props.b]).toEqual([252, 140]);
    expect([M3_ROUNDS[1].props.a, M3_ROUNDS[1].props.b]).toEqual([765, 135]);
  });
  it('never uses the climax problem (ribbons of 210 and 150) nor its PGCD 30', () => {
    const text = JSON.stringify([...M1_ROUNDS, ...M3_ROUNDS]);
    [210, 150].forEach((x) => expect(new RegExp(`(^|[^0-9])${x}([^0-9]|$)`).test(text), `${x}`).toBe(false));
    [...allPairs(M1_ROUNDS, D_FREE), ...allPairs(M3_ROUNDS, E_FREE)].forEach(({ a, b }) => expect(gcd(a, b)).not.toBe(30));
  });
  it('each free round offers its own pair', () => {
    [...M1_ROUNDS, ...M3_ROUNDS].filter((r) => r.free).forEach((r) => expect(r.props.choices.some((c) => c.a === r.props.a && c.b === r.props.b)).toBe(true));
  });
});
