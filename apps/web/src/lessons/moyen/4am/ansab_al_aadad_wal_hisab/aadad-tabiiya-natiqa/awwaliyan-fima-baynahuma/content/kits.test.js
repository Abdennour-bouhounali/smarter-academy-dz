import { describe, it, expect } from 'vitest';
import { M1_ROUNDS, M2_ROUNDS, FREE_PAIRS, FREE_LISTS, gcd } from './kits';
import { roundWon, emptyLog, logEvent, starsFor } from '../../../../../../common/manipulations/rounds/roundsModel';
import * as L from '../../../../../../common/manipulations/logic/coprime';

const ALL = [...M1_ROUNDS, ...M2_ROUNDS];
const pairsOf = (rounds) => [...rounds.map((r) => r.props), ...rounds.filter((r) => r.easier).map((r) => r.easier.props)];
/** Ce que la scène des trousses remonte quand l'élève ajoute les trousses une à une jusqu'à la preuve. */
const groupVerdicts = ({ a, b }) => {
  let s = L.initGroups({ a, b }); let log = emptyLog();
  while (!L.groupsInsightReady(s)) {
    s = L.addGroupTo(s);
    log = logEvent(log, 'verdict', { groups: s.k, exact: s.works });
  }
  return log;
};

describe('rounds of the kits and the lists (coprime-explorer)', () => {
  it('module 1 is played with the groups, module 2 with the lists; each has a challenge and a free round', () => {
    M1_ROUNDS.forEach((r) => expect(r.props.startWith).toBe('groups'));
    M2_ROUNDS.forEach((r) => expect(r.props.startWith).toBeUndefined());
    expect(M1_ROUNDS[0].props.chains).toEqual(['groups']);
    expect(M2_ROUNDS[0].props.chains).toEqual(['lists']);
    expect([M1_ROUNDS[1].props.a, M1_ROUNDS[1].props.b]).toEqual([17, 18]);
    expect([M2_ROUNDS[0].props.a, M2_ROUNDS[0].props.b]).toEqual([15, 22]);
    [M1_ROUNDS, M2_ROUNDS].forEach((rs) => { expect(rs.some((r) => r.optional)).toBe(true); expect(rs.some((r) => r.free)).toBe(true); });
  });
  it('the rounds that must prove « coprime » are coprime; the challenges are not, and their goal is the hidden common divisor', () => {
    ALL.filter((r) => !r.free && r.id !== 'challenge').forEach((r) => expect(gcd(r.props.a, r.props.b), `${r.props.a}/${r.props.b}`).toBe(1));
    ALL.filter((r) => r.id === 'challenge').forEach((r) => {
      const g = gcd(r.props.a, r.props.b);
      expect(g).toBeGreaterThan(1);
      expect(r.goal).toEqual([{ exact: g }]);
    });
  });
  it('the easier rounds are really smaller', () => {
    ALL.filter((r) => r.easier).forEach((r) => expect(r.easier.props.a + r.easier.props.b).toBeLessThan(r.props.a + r.props.b));
  });
  it('17 and 18: trying every number of kits one by one wins the round, stopping before does not', () => {
    const r2 = M1_ROUNDS.find((r) => r.id === 'r2');
    const log = groupVerdicts(r2.props);
    expect(roundWon(r2, log)).toBe(true);
    expect(starsFor({ ...r2, stars: { ...r2.stars, predict: false } }, log)).toBe(3);
    const partial = { ...log, verdicts: log.verdicts.slice(0, 10) };
    expect(roundWon(r2, partial)).toBe(false);
  });
  it('the module-1 challenge is won as soon as 7 kits work (21 and 28), by hand', () => {
    const ch = M1_ROUNDS.find((r) => r.id === 'challenge');
    const log = groupVerdicts(ch.props);
    expect(log.verdicts.at(-1)).toEqual({ groups: 7, exact: true });
    expect(roundWon(ch, log)).toBe(true);
    expect(starsFor(ch, log)).toBe(3);
  });
  it('a list round without questions is won by a conclusive «تحقّق», not by an early one', () => {
    const r2 = M2_ROUNDS.find((r) => r.id === 'r2');
    expect(roundWon(r2, logEvent(emptyLog(), 'verdict', { groups: 0, exact: false }))).toBe(false);
    expect(roundWon(r2, logEvent(emptyLog(), 'verdict', { groups: 1, exact: true }))).toBe(true);
    const ch = M2_ROUNDS.find((r) => r.id === 'challenge');
    expect(roundWon(ch, logEvent(emptyLog(), 'verdict', { groups: 17, exact: true }))).toBe(true);
  });
  it('never uses the climax numbers (26, 45, 39, 65) nor a pair whose PGCD is 13', () => {
    const text = JSON.stringify(ALL);
    [26, 45, 39, 65].forEach((x) => expect(new RegExp(`(^|[^0-9])${x}([^0-9]|$)`).test(text), `${x}`).toBe(false));
    [...pairsOf(ALL), ...FREE_PAIRS, ...FREE_LISTS].forEach(({ a, b }) => expect(gcd(a, b)).not.toBe(13));
  });
  it('each free round offers its own pair', () => {
    ALL.filter((r) => r.free).forEach((r) => expect(r.props.choices.some((c) => c.a === r.props.a && c.b === r.props.b)).toBe(true));
  });
});
