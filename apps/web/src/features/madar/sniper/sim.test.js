import { describe, expect, it } from 'vitest';
import { createSniper, multiplierFor, resultOf, step, tap } from './sim.js';
import { LIVES, SCHEDULE, roundStart, spawnAt } from './constants.js';
import { maxRound, perfectScore } from './bound.js';

const DT = 1 / 60;

const runUntil = (game, seconds, onEvent = () => {}) => {
  while (game.t < seconds && game.status === 'playing') {
    for (const e of step(game, DT)) onEvent(e, game);
  }
};

/** Un joueur parfait : il touche chaque carte égale dès qu'elle apparaît, jamais un piège. */
const perfect = (e, game) => {
  for (const c of [...game.cards]) if (c.equal) tap(game, c.id);
};

describe('value sniper simulation', () => {
  it('opens rounds at their fixed instants and drops eight cards per round', () => {
    const game = createSniper(9);
    const rounds = [];
    let spawned = 0;
    runUntil(game, roundStart(2) + 0.01, (e, g) => {
      perfect(e, g);
      if (e.type === 'round') rounds.push([e.k, g.t]);
    });
    expect(rounds.map(([k]) => k)).toEqual([0, 1, 2]);
    rounds.forEach(([k, t]) => expect(t).toBeCloseTo(roundStart(k), 1));
    const g2 = createSniper(9);
    runUntil(g2, spawnAt(0, 7) + 0.01, () => {});
    spawned = g2.nextCard;
    expect(spawned).toBe(SCHEDULE.cardsPerRound);
  });

  it('a hit scores, a trap costs a shield, and an equal card that lands costs one too', () => {
    const game = createSniper(3);
    // Avant que la première carte touche le sol : une égale et un piège en l'air.
    while (!(game.cards.some((c) => c.equal) && game.cards.some((c) => !c.equal))) step(game, DT);
    expect(game.lives).toBe(LIVES);
    const equal = game.cards.find((c) => c.equal);
    const trap = game.cards.find((c) => !c.equal);
    const hit = tap(game, equal.id);
    expect(hit.type).toBe('hit');
    expect(hit.points).toBe(SCHEDULE.pointsPerLevel * 1 * 1);
    expect(tap(game, equal.id)).toBeNull();
    const wrong = tap(game, trap.id);
    expect(wrong.type).toBe('wrong');
    expect(wrong.tokens).toEqual(trap.tokens);
    expect(game.lives).toBe(LIVES - 1);
    expect(game.streak).toBe(0);

    const missed = [];
    runUntil(game, roundStart(1) - 0.1, (e) => e.type === 'missed' && missed.push(e));
    expect(missed.length).toBeGreaterThan(0);
    expect(game.lives).toBe(Math.max(0, LIVES - 1 - missed.length));
  });

  it('ends with no revive when the shields are gone', () => {
    const game = createSniper(5);
    const events = [];
    runUntil(game, 400, (e) => events.push(e.type));
    expect(game.status).toBe('over');
    expect(events).toContain('over');
    expect(step(game, 1)).toEqual([]);
  });

  it('the multiplier climbs every five hits up to ×4, and a perfect round gives a shield back', () => {
    expect([0, 4, 5, 9, 10, 15, 40].map(multiplierFor)).toEqual([1, 1, 2, 2, 3, 4, 4]);
    const game = createSniper(11);
    game.lives = 2;
    const ends = [];
    runUntil(game, roundStart(1) + 0.01, (e, g) => {
      perfect(e, g);
      if (e.type === 'roundEnd') ends.push(e);
    });
    expect(ends[0]).toMatchObject({ k: 0, perfect: true, bonus: SCHEDULE.perfectBonus });
    expect(game.lives).toBe(3);
  });

  it('a perfect player never goes above the server bound nor beyond the reachable round', () => {
    for (const seed of [1, 2, 77, 2026]) {
      const game = createSniper(seed);
      for (let s = 30; s <= 300; s += 30) {
        runUntil(game, s, perfect);
        expect(game.status).toBe('playing');
        expect(game.score).toBeLessThanOrEqual(perfectScore(game.t));
        expect(resultOf(game).round).toBeLessThanOrEqual(maxRound(game.t));
      }
    }
  });

  it('the attract mode plays alone and never ends', () => {
    const game = createSniper(20261022, { autopilot: true });
    runUntil(game, 240);
    expect(game.status).toBe('playing');
    expect(game.hits).toBeGreaterThan(20);
    expect(game.wrong).toBe(0);
  });

  it('is the same game for the same seed', () => {
    const trace = (seed) => {
      const g = createSniper(seed);
      const out = [];
      runUntil(g, roundStart(1) + 1, (e) => e.type === 'round' && out.push(g.round.target.key));
      return out.concat(g.cards.map((c) => `${c.id}@${c.lane}`));
    };
    expect(trace(42)).toEqual(trace(42));
  });
});
