import { describe, it, expect } from 'vitest';
import { M1_ROUNDS, M2_ROUNDS, FREE_M1, FREE_M2 } from './squares';
import { roundWon, emptyLog, logEvent, starsFor } from '../../../../../../common/manipulations/rounds/roundsModel';
import * as L from '../../../../../../common/manipulations/logic/squareRootSide';

const ALL = [...M1_ROUNDS, ...M2_ROUNDS];
const val = (a) => a.num / a.den;

/**
 * Ce que le labo remonte quand l'élève encadre par dichotomie jusqu'à la découverte (ou jusqu'à `until`) : un verdict par relâchement, un
 * événement `bracket` par encadrement serré — exactement ce que fait SquareRootSide.commit.
 */
function play({ num, den, scale }, until = () => false) {
  let s = L.init({ mode: 'refine', areas: [{ num, den }], maxScale: scale });
  let log = emptyLog();
  for (let guard = 0; guard < 200 && !L.discoveryReady(s) && !until(log); guard += 1) {
    if (L.canRefine(s)) { s = L.refine(s); continue; }
    const r = L.range(s); const c = L.cellOf(s);
    const lo = c.below ?? r.min; const hi = c.above ?? r.max;
    const mid = Math.floor((lo + hi) / 2);
    const prev = s;
    s = L.test(s, mid === lo && c.below != null ? lo + 1 : mid);
    log = logEvent(log, 'verdict', { groups: s.scale, exact: s.last.cmp === 0 });
    if (!L.tight(L.cellOf(prev)) && L.tight(L.cellOf(s))) log = logEvent(log, 'trial', { tk: 'bracket', card: 0, scale: s.scale, resisting: false });
  }
  return { s, log };
}

describe('the square rounds of jidhr-tarbii (square-root-side, refine)', () => {
  it('module 1: 16 by hand with the exact chain, 5 with the never chain and two non-consecutive predictions, 2,25 required, a challenge, a free garden', () => {
    expect(M1_ROUNDS.map((r) => r.id)).toEqual(['r1', 'r2', 'r3', 'challenge', 'free']);
    expect(M1_ROUNDS[0].props.chains).toEqual(['exact']);
    expect(M1_ROUNDS[0].props.handDone).toBeUndefined();
    expect(M1_ROUNDS[1].props).toMatchObject({ num: 5, den: 1, scale: 1000, chains: ['never'], predict: true, predictAt: [1, 100] });
    expect(M1_ROUNDS[2].optional).toBeUndefined();
    M1_ROUNDS.slice(1).filter((r) => !r.optional).forEach((r) => expect(r.props.handDone).toBe(true));
    [M1_ROUNDS, M2_ROUNDS].forEach((rs) => { expect(rs.some((r) => r.optional)).toBe(true); expect(rs.some((r) => r.free)).toBe(true); });
  });

  it('the exact rounds really land, the never round really never does', () => {
    [M1_ROUNDS[0], M1_ROUNDS[2], M2_ROUNDS[0], M2_ROUNDS[1]].forEach((r) => expect(L.landsSomewhere(r.props, r.props.scale), r.title).toBe(true));
    expect(L.landsSomewhere(M1_ROUNDS[1].props, 1000)).toBe(false);
    expect(L.landsSomewhere(M1_ROUNDS[3].props, 100)).toBe(false);
    // 2,25 : the prediction that flips — not at 1, yes at 0,1
    expect(L.landsAt(M1_ROUNDS[2].props, 1)).toBe(false);
    expect(L.landsAt(M1_ROUNDS[2].props, 10)).toBe(true);
  });

  it('rounds without questions are won only by DOING; their stars fit the per-graduation budget', () => {
    ALL.filter((r) => !r.free && r.goal.every((c) => !c.checkpoint)).forEach((r) => {
      expect(roundWon(r, emptyLog())).toBe(false);
      const { log } = play(r.props);
      expect(roundWon(r, log), r.title).toBe(true);
      expect(starsFor({ ...r, stars: { ...r.stars, predict: false } }, log), r.title).toBe(3);
    });
    // the challenge: bracketing only to 0,1 is not enough
    const ch = M1_ROUNDS.find((r) => r.id === 'challenge');
    const half = play(ch.props, (log) => log.brackets.some((b) => b.scale === 10));
    expect(roundWon(ch, half.log)).toBe(false);
  });

  it('the rounds with questions reach their chains (16 lands; 5 ends tight at 0,001)', () => {
    expect(L.discoveryReady(play(M1_ROUNDS[0].props).s)).toBe(true);
    expect(L.foundSide(play(M1_ROUNDS[0].props).s, 0)).toEqual({ v: 4, scale: 1 });
    const five = play(M1_ROUNDS[1].props);
    expect(L.refineOutcome(five.s)).toBe('never');
    expect(five.s.scale).toBe(1000);
    expect(L.foundSide(play(M2_ROUNDS[0].props).s, 0)).toEqual({ v: 2, scale: 10 });
  });

  it('the easier rounds are really smaller, and are won by doing', () => {
    ALL.filter((r) => r.easier).forEach((r) => {
      expect(val(r.easier.props)).toBeLessThan(val(r.props));
      expect(roundWon(r.easier, play(r.easier.props).log), r.title).toBe(true);
    });
  });

  it('never uses the climax numbers (34, 5,83, the 3 m and 5 m sides together)', () => {
    const text = JSON.stringify(ALL);
    expect(/(^|[^0-9])34([^0-9]|$)/.test(text)).toBe(false);
    expect(text.includes('5,83')).toBe(false);
    ALL.forEach((r) => expect(r.props.num / r.props.den).not.toBe(34));
  });

  it('each free round offers its own area', () => {
    ALL.filter((r) => r.free).forEach((r) => expect(r.props.choices.some((c) => c.num === r.props.num && c.den === r.props.den)).toBe(true));
    [...FREE_M1, ...FREE_M2].forEach((a) => expect(a.num / a.den).not.toBe(34));
  });
});
