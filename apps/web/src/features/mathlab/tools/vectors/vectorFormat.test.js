import { describe, it, expect } from 'vitest';
import { formatPair, formatNorm, formatAngle, formatFactor, formatSlope } from './vectorFormat.js';
import { exactNorm, slope } from './vectorMath.js';

const P = (x, y) => ({ x, y });

describe('écriture d’un couple', () => {
  it('écrit (3 ; −2) avec un vrai signe moins et une virgule décimale', () => {
    expect(formatPair(P(3, -2))).toBe('(3 ; −2)');
    expect(formatPair(P(1.5, 0))).toBe('(1,5 ; 0)');
  });

  it('n’invente rien pour un objet non résolu', () => {
    expect(formatPair(null)).toBe('—');
    expect(formatPair(P(Number.NaN, 1))).toBe('—');
  });

  it('n’utilise JAMAIS de chiffres arabo-indiens — convention des manuels algériens', () => {
    expect(formatPair(P(3, -2))).not.toMatch(/[٠-٩]/);
  });

  it('utilise le signe moins typographique, pas le trait d’union', () => {
    expect(formatPair(P(-4, -4))).not.toContain('-');
    expect(formatPair(P(-4, -4))).toContain('−');
  });
});

describe('écriture de la norme (§9)', () => {
  it('‖(3,4)‖ s’écrit 5, sans décimales inutiles', () => {
    expect(formatNorm(exactNorm(P(3, 4)))).toEqual({ text: '5', approx: null, isExact: true });
  });

  it('‖(1,2)‖ s’écrit √5 et donne la valeur approchée à côté', () => {
    const out = formatNorm(exactNorm(P(1, 2)));
    expect(out.text).toBe('√5');
    expect(out.approx).toBe('2,24');
  });

  it('‖(2,4)‖ se simplifie en 2√5', () => {
    expect(formatNorm(exactNorm(P(2, 4))).text).toBe('2√5');
  });

  it('des composantes décimales donnent un décimal, sans fausse exactitude', () => {
    const out = formatNorm(exactNorm(P(1.5, 2.5)));
    expect(out.isExact).toBe(false);
    expect(out.text).toBe('2,92');
  });
});

describe('écriture de la direction (§10)', () => {
  it('53,13°', () => {
    expect(formatAngle(53.13010235)).toBe('53,13°');
  });

  it('le شعاع nul n’a pas de direction : « — », jamais 0°', () => {
    expect(formatAngle(Number.NaN)).toBe('—');
  });
});

describe('écriture du facteur k (§21)', () => {
  it('écrit ½ en fraction, comme le manuel', () => {
    expect(formatFactor(0.5)).toBe('1/2');
    expect(formatFactor(-0.5)).toBe('−1/2');
    expect(formatFactor(1.5)).toBe('3/2');
  });

  it('garde les entiers entiers', () => {
    expect(formatFactor(3)).toBe('3');
    expect(formatFactor(-2)).toBe('−2');
  });

  it('retombe sur le décimal quand il n’y a pas de fraction simple', () => {
    expect(formatFactor(0.37)).toBe('0,37');
  });
});

describe('écriture de la pente (§20)', () => {
  it('dit « verticale » plutôt qu’un faux nombre', () => {
    expect(formatSlope(slope(P(2, 1), P(2, 5)))).toEqual({ kind: 'vertical', text: null });
  });

  it('écrit la valeur quand elle existe', () => {
    expect(formatSlope(slope(P(0, 0), P(2, 4)))).toEqual({ kind: 'value', text: '2' });
  });

  it('distingue « pas de droite » de « verticale »', () => {
    expect(formatSlope(slope(P(1, 1), P(1, 1))).kind).toBe('undefined');
  });
});
