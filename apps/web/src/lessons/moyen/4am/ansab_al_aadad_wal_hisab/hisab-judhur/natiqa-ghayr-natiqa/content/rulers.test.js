import { describe, it, expect } from 'vitest';
import * as squareRoots from '@smarter-academy/core/arithmetic/squareRoots.js';
import * as L from '../../../../../../common/manipulations/logic/squareRootSide';
import { conditionMet, emptyLog } from '../../../../../../common/manipulations/rounds/roundsModel';
import { M1_ROUNDS, FREE } from './rulers';

const { rationalSqrt } = squareRoots;
const lands = (a, g) => L.landsSomewhere(a, g);
const key = (a) => `${a.num}/${a.den}`;

/** Joue une manche graduation comme un élève : chaque carte, graduation après graduation, jusqu'à la tomber juste ou l'encadrer. */
function play(round) {
  const { areas, scale } = round.props;
  let s = L.init({ mode: 'graduation', areas, maxScale: scale, truthful: true });
  const log = emptyLog();
  areas.forEach((_, i) => {
    s = L.setCard(s, i);
    for (let g = 1; g <= scale && L.cardStatus(s, i) === 'open'; g += 1) {
      s = L.setScale(s, g);
      const r = L.range(s);
      for (let v = r.min; v <= r.max; v += 1) {
        const before = L.tight(L.cellOf(s));
        s = L.test(s, v);
        log.verdicts.push({ groups: g, exact: s.last.cmp === 0 });
        if (!before && L.tight(L.cellOf(s))) log.brackets.push({ card: i, scale: g, resisting: L.cardStatus(s, i) === 'resisting' });
        if (s.last.cmp >= 0) break;
      }
    }
  });
  return { s, log };
}

const ALL = [...M1_ROUNDS, ...M1_ROUNDS.filter((r) => r.easier).map((r) => ({ ...r.easier, id: `${r.id}-easy` }))];

describe('the rulers of natiqa-ghayr-natiqa (graduation rounds)', () => {
  it('every round puts at least one card that lands and one that never lands, on rulers long enough to resist', () => {
    ALL.filter((r) => !r.free).forEach((r) => {
      const { areas, scale } = r.props;
      expect(scale, r.id).toBeGreaterThanOrEqual(L.RESIST_AFTER);
      expect(areas.some((a) => lands(a, scale)), r.id).toBe(true);
      expect(areas.some((a) => !rationalSqrt(a)), r.id).toBe(true);
    });
  });
  it('a rational card always fits its rulers — « it will never land » stays true for every card that resists', () => {
    ALL.forEach((r) => r.props.areas.forEach((a) => {
      if (rationalSqrt(a)) expect(lands(a, r.props.scale), `${r.id} ${key(a)}`).toBe(true);
    }));
  });
  it('rounds with predictions ask one « yes » and one « no »: always saying « no » cannot win the star', () => {
    M1_ROUNDS.filter((r) => r.props.predict).forEach((r) => {
      const truths = r.props.areas.slice(0, 2).map((a) => lands(a, r.props.scale));
      expect(new Set(truths).size, r.id).toBe(2);
    });
  });
  it('every goal is met by playing, never by reading', () => {
    ALL.filter((r) => !r.free).forEach((r) => {
      const { log } = play(r);
      r.goal.filter((c) => !c.checkpoint).forEach((c) => expect(conditionMet(c, log), `${r.id} ${JSON.stringify(c)}`).toBe(true));
    });
  });
  it('16/9 bracketed on 1/1, 1/2 and 1/4 does not resist in the player (it lands on 1/3)', () => {
    let s = L.init({ mode: 'graduation', areas: [{ num: 16, den: 9 }], maxScale: 6, truthful: true });
    [1, 2, 4].forEach((g) => {
      s = L.setScale(s, g);
      const r = L.range(s);
      for (let v = r.min; v <= r.max; v += 1) { s = L.test(s, v); if (s.last.cmp > 0) break; }
    });
    expect(L.brackets(s, 0).filter(L.tight)).toHaveLength(3);
    expect(L.cardStatus(s, 0)).toBe('open');
    const page = { ...s, truthful: false };
    expect(L.cardStatus(page, 0)).toBe('resisting');
  });
  it('the easier rounds are really smaller: shorter rulers', () => {
    M1_ROUNDS.filter((r) => r.easier).forEach((r) => expect(r.easier.props.scale, r.id).toBeLessThan(r.props.scale));
  });
  it('the free round is the activity: the six areas', () => {
    expect(FREE.map(key)).toEqual(['100/1', '16/9', '25/100', '6/1', '13/1', '25/13']);
  });
  it('never uses the climax numbers (2,89 ; 4 ; 4/9 ; 3 ; 1,7)', () => {
    const forbidden = ['289/100', '4/1', '4/9', '3/1', '17/10'];
    ALL.forEach((r) => r.props.areas.forEach((a) => {
      const red = squareRoots.reduce(a);
      expect(forbidden.includes(`${red.num}/${red.den}`), `${r.id} ${key(a)}`).toBe(false);
    }));
  });
});
