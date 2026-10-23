/**
 * « قنّاص القيم » — la simulation (pure : aucun DOM, aucune horloge).
 *
 * Des cartes tombent ; chacune porte une écriture. En haut, la CIBLE (une
 * valeur). L'élève touche les cartes qui lui sont ÉGALES :
 *
 *   carte égale touchée     +points (10 × niveau × multiplicateur ≤ ×4)
 *   carte piège touchée     −1 bouclier, la série retombe ; on voit ce qu'elle valait
 *   carte égale qui tombe   −1 bouclier (« c'était égal »)
 *   piège qui tombe         rien : bien vu
 *   manche parfaite         +bonus et un bouclier rendu (3 au plus)
 *
 * Plus de bouclier : la partie s'arrête (pas de reprise — le jeu est gratuit).
 * Le calendrier est FIXE (constants.js) : la cible change à des instants
 * connus, quoi que fasse l'élève, et le serveur peut borner le score.
 *
 *   step(game, dt) → événements   (hit, wrong, missed, dodged, round, roundEnd, over)
 *   tap(game, cardId) → événement | null
 */
import { createRng } from '../engine/rng';
import { makeRound } from './cards';
import { LANES, LIVES, SCHEDULE, STREAK_STEP, fall, levelOf, roundStart, spawnAt } from './constants';

export function multiplierFor(streak) {
  return Math.min(SCHEDULE.maxMultiplier, 1 + Math.floor(streak / STREAK_STEP));
}

export function createSniper(seed, { autopilot = false } = {}) {
  return {
    seed: seed >>> 0 || 1,
    autopilot,
    rng: createRng((seed ^ 0x5bd1e995) >>> 0),
    t: 0,
    status: 'playing',
    lives: LIVES,
    score: 0,
    streak: 0,
    bestStreak: 0,
    hits: 0,
    wrong: 0,
    missed: 0,
    round: null,
    roundIndex: -1,
    nextCard: 0,
    roundStats: null,
    cards: [],
    lastLanes: [],
  };
}

export const scoreOf = (game) => game.score;

/** La position verticale (0 en haut, 1 au sol) d'une carte à l'instant t. */
export function cardY(card, t) {
  return (t - card.born) / card.fall;
}

function openRound(game, k, events) {
  game.round = makeRound(game.seed, k, SCHEDULE);
  game.roundIndex = k;
  game.nextCard = 0;
  game.roundStats = { k, equal: game.round.cards.filter((c) => c.equal).length, hits: 0, faults: 0, closed: false };
  events.push({ type: 'round', k, level: levelOf(k), levelId: game.round.levelId });
}

function pickLane(game) {
  const options = Array.from({ length: LANES }, (_, i) => i).filter((i) => !game.lastLanes.includes(i));
  const lane = game.rng.pick(options);
  game.lastLanes = [lane, ...game.lastLanes].slice(0, 2);
  return lane;
}

function loseLife(game, events) {
  if (game.autopilot) return;
  game.lives -= 1;
  if (game.lives <= 0 && game.status === 'playing') {
    game.status = 'over';
    events.push({ type: 'over' });
  }
}

function closeRound(game, events) {
  const s = game.roundStats;
  if (!s || s.closed) return;
  s.closed = true;
  const perfect = s.faults === 0 && s.hits === s.equal;
  let bonus = 0;
  if (perfect) {
    bonus = SCHEDULE.perfectBonus * levelOf(s.k);
    game.score += bonus;
    if (game.lives < LIVES) game.lives += 1;
  }
  events.push({ type: 'roundEnd', k: s.k, perfect, bonus });
}

export function step(game, dt) {
  const events = [];
  if (game.status !== 'playing') return events;
  game.t += dt;
  const { t } = game;

  // La manche suivante s'ouvre à son instant fixe (la précédente est close).
  const next = game.roundIndex + 1;
  if (t >= roundStart(next)) {
    closeRound(game, events);
    openRound(game, next, events);
  }

  // Les cartes de la manche apparaissent, une par une, à leur instant.
  const k = game.roundIndex;
  while (game.round && game.nextCard < game.round.cards.length && t >= spawnAt(k, game.nextCard)) {
    const c = game.round.cards[game.nextCard];
    game.cards.push({ ...c, lane: pickLane(game), born: spawnAt(k, game.nextCard), fall: fall(k), level: levelOf(k), state: 'falling' });
    game.nextCard += 1;
  }

  for (const c of game.cards) {
    if (c.state !== 'falling') continue;
    if (game.autopilot && c.equal && cardY(c, t) > 0.42 + ((c.id.charCodeAt(c.id.length - 1) % 5) * 0.06)) {
      events.push(tap(game, c.id));
      continue;
    }
    if (cardY(c, t) >= 1) {
      c.state = 'landed';
      if (c.equal) {
        game.missed += 1;
        game.streak = 0;
        if (game.roundStats?.k === k) game.roundStats.faults += 1;
        events.push({ type: 'missed', id: c.id, lane: c.lane, tokens: c.tokens });
        loseLife(game, events);
      } else {
        events.push({ type: 'dodged', id: c.id, lane: c.lane });
      }
    }
  }
  game.cards = game.cards.filter((c) => c.state === 'falling');

  // Toutes les cartes de la manche sont tombées ou touchées : le bilan, sans attendre la suivante.
  if (game.round && game.nextCard >= game.round.cards.length && !game.cards.some((c) => c.id.startsWith(`${k}:`))) {
    closeRound(game, events);
  }
  return events.filter(Boolean);
}

/** Toucher une carte. Une carte déjà touchée ou tombée ne répond plus. */
export function tap(game, cardId) {
  if (game.status !== 'playing') return null;
  const c = game.cards.find((x) => x.id === cardId && x.state === 'falling');
  if (!c) return null;
  const y = cardY(c, game.t);
  const sameRound = game.roundStats && c.id.startsWith(`${game.roundStats.k}:`);
  if (c.equal) {
    c.state = 'hit';
    game.streak += 1;
    game.bestStreak = Math.max(game.bestStreak, game.streak);
    const mult = multiplierFor(game.streak);
    const points = SCHEDULE.pointsPerLevel * c.level * mult;
    game.score += points;
    game.hits += 1;
    if (sameRound) game.roundStats.hits += 1;
    return { type: 'hit', id: c.id, lane: c.lane, y, points, mult, streak: game.streak };
  }
  c.state = 'wrong';
  game.wrong += 1;
  game.streak = 0;
  if (sameRound) game.roundStats.faults += 1;
  const event = { type: 'wrong', id: c.id, lane: c.lane, y, tokens: c.tokens, value: c.value };
  const extra = [];
  loseLife(game, extra);
  if (extra.length) event.over = true;
  return event;
}

/** Ce que la page envoie au serveur et montre à la fin. */
export function resultOf(game) {
  return {
    score: game.score,
    hits: game.hits,
    wrong: game.wrong,
    missed: game.missed,
    bestStreak: game.bestStreak,
    round: game.roundIndex + 1,
    level: game.roundIndex >= 0 ? levelOf(game.roundIndex) : 1,
    accuracy: game.hits + game.wrong > 0 ? game.hits / (game.hits + game.wrong) : null,
  };
}
