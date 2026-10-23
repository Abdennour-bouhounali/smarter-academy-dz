import { describe, expect, it } from 'vitest';
import { LEVEL_IDS, keyOf, makeRound, plain, rat, surd, valueTokens } from './cards.js';

/**
 * Un évaluateur INDÉPENDANT de ce qui est AFFICHÉ : l'écriture d'une carte est
 * relue comme une expression (× ÷ − , % fractions √ exposants, x) et calculée en
 * flottants pour deux valeurs de x. Le paquet ne peut donc pas déclarer
 * « égale » une carte qui ne l'est pas à l'écran.
 */
function toJs(tokens) {
  const part = (t) => {
    if (typeof t === 'string') return t;
    if (t.frac) return `((${toJs([t.frac[0]])})/(${toJs([t.frac[1]])}))`;
    if (t.sqrt) return `Math.sqrt(${toJs([t.sqrt])})`;
    return `**(${toJs([t.sup])})`;
  };
  return tokens.map(part).join('')
    .replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-')
    .replace(/(\d),(\d)/g, '$1.$2')
    .replace(/%/g, '/100')
    .replace(/(\d|\)|x)\s*(?=\(|x|M)/g, '$1*');
}

function evaluate(tokens, x) {
  // eslint-disable-next-line no-new-func
  return new Function('x', `return (${toJs(tokens)});`)(x);
}

const same = (a, b) => [2, 5].every((x) => Math.abs(evaluate(a, x) - evaluate(b, x)) < 1e-9 * Math.max(1, Math.abs(evaluate(b, x))));

const SEEDS = Array.from({ length: 60 }, (_, i) => 1000 + i * 7919);
const ROUNDS = Array.from({ length: 24 }, (_, k) => k);

describe('sniper card deck', () => {
  it('simplifies exact values', () => {
    expect(keyOf(surd(1, 50))).toBe(keyOf(surd(5, 2)));
    expect(keyOf(surd(2, 9))).toBe(keyOf(rat(6)));
    expect(keyOf(rat(6, 8))).toBe(keyOf(rat(3, 4)));
    expect(plain(valueTokens(surd(1, 12)))).toBe('2√3');
  });

  it('reads each card as what it SHOWS: equal cards equal the target, traps never do', () => {
    let checked = 0;
    for (const seed of SEEDS) {
      for (const k of ROUNDS) {
        const round = makeRound(seed, k);
        for (const c of round.cards) {
          expect(same(c.tokens, round.target.tokens), `${plain(c.tokens)} vs ${plain(round.target.tokens)} (seed ${seed}, round ${k})`).toBe(c.equal);
          // La valeur exacte gardée par la carte est bien celle qu'elle affiche.
          expect(same(c.tokens, valueTokens(c.value)), `${plain(c.tokens)} ≠ ${plain(valueTokens(c.value))}`).toBe(true);
          checked += 1;
        }
      }
    }
    expect(checked).toBe(SEEDS.length * ROUNDS.length * 8);
  });

  it('deals eight distinct cards, three or four of them equal, never the target written as is', () => {
    for (const seed of SEEDS) {
      for (const k of ROUNDS) {
        const { cards, target } = makeRound(seed, k);
        expect(cards).toHaveLength(8);
        const equal = cards.filter((c) => c.equal).length;
        expect(equal).toBeGreaterThanOrEqual(3);
        expect(equal).toBeLessThanOrEqual(4);
        expect(new Set(cards.map((c) => c.text)).size).toBe(8);
        expect(cards.map((c) => c.text)).not.toContain(plain(target.tokens));
      }
    }
  });

  it('opens the six levels in order, three rounds each, then mixes the harder ones', () => {
    const levels = Array.from({ length: 18 }, (_, k) => makeRound(42, k).levelId);
    expect(levels).toEqual(LEVEL_IDS.flatMap((id) => [id, id, id]));
    const later = new Set(Array.from({ length: 30 }, (_, i) => makeRound(42, 18 + i).levelId));
    expect(later.has('ops')).toBe(false);
    expect(later.size).toBeGreaterThan(1);
  });

  it('is the same round for the same seed', () => {
    expect(makeRound(7, 5)).toEqual(makeRound(7, 5));
    expect(plain(makeRound(7, 5).target.tokens) + makeRound(7, 5).cards.map((c) => c.text).join()).not.toBe(
      plain(makeRound(8, 5).target.tokens) + makeRound(8, 5).cards.map((c) => c.text).join(),
    );
  });
});
