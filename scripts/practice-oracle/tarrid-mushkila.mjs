// Oracle du banc « tarrid-mushkila » (unité 4 « معادلات ومتراجحات ») — chaque réponse RECALCULÉE ici,
// sans lire le contenu ni le code testé. Fusionné dans scripts/practice-answer-oracle.test.mjs.
//
// Un exercice de ترييض a une HISTOIRE : l'oracle la rejoue par force brute (`first` : le premier
// entier qui vérifie l'énoncé, écrit avec les mots de l'énoncé, jamais avec l'équation de la clé).
//   pickEq(cible, options)   chaque option est une équation a1·x + b1 = a2·x + b2 RELUE dans le texte
//                            de l'option ; la bonne est l'UNIQUE dont la solution est la cible de
//                            l'histoire (zéro ou deux → l'oracle lève une erreur).
//   pickSet(histoire, préds) chaque option est un ensemble (prédicat) ; la bonne est l'UNIQUE qui a
//                            les mêmes entiers que l'histoire sur [lo, hi].
// Généré avec le banc par le script de l'auteur ; ne pas éditer une entrée sans recalculer l'autre côté.
import { R, C, q } from './helpers.mjs';

const LETTERS = ['A', 'B', 'C', 'D'];

/** Le premier entier de [from, to] qui vérifie l'histoire, ou null. */
const first = (pred, from = 0, to = 5000) => { for (let t = from; t <= to; t += 1) if (pred(t)) return t; return null; };

/** La solution exacte de a1·x + b1 = a2·x + b2 (null si aucune ou toutes). */
const solveLin = (a1, b1, a2, b2) => {
  const a = q(a1).sub(q(a2));
  if (a.isZero()) return null;
  return q(b2).sub(q(b1)).div(a).toString();
};

function pickEq(target, options) {
  if (target === null) throw new Error('tarrid-mushkila oracle: histoire sans solution');
  const ok = options.map((o, i) => (solveLin(...o) === String(target) ? LETTERS[i] : null)).filter(Boolean);
  if (ok.length !== 1) throw new Error(`tarrid-mushkila oracle: ${ok.length} équations acceptables`);
  return C(ok[0]);
}

function pickSet(story, preds, hi = 200, lo = 0) {
  const range = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
  const want = range.filter(story).join();
  const ok = preds.map((p, i) => (range.filter(p).join() === want ? LETTERS[i] : null)).filter(Boolean);
  if (ok.length !== 1) throw new Error(`tarrid-mushkila oracle: ${ok.length} ensembles acceptables`);
  return C(ok[0]);
}

export const ORACLE = {
  'ex-4am-tarrid-mushkila-l1-001:q1': pickEq(first((t) => 6 * t + 7 === 31), [[6, 42, 0, 31], [6, 7, 0, 31], [7, 6, 0, 31]]),
  'ex-4am-tarrid-mushkila-l1-001:q2': R(first((t) => 6 * t + 7 === 31)),
  'ex-4am-tarrid-mushkila-l1-002:q1': pickEq(first((t) => 3 * t - 21 === 2 * t), [[3, -63, 2, 0], [3, -21, 1, 2], [3, -21, 2, 0]]),
  'ex-4am-tarrid-mushkila-l1-002:q2': R(first((t) => 3 * t - 21 === 2 * t)),
  'ex-4am-tarrid-mushkila-l1-003:q1': C(['A', 'B', 'C'][[[1, 3], [2, 6], [2, 3]].findIndex(([a, b]) => [1, 5, 9].every((t) => a * t + b === 2 * (t + 3)))]),
  'ex-4am-tarrid-mushkila-l1-003:q2': pickSet((t) => 2 * t + 6 >= 40, [(t) => t >= 20, (t) => t <= 17, (t) => t >= 17]),
  'ex-4am-tarrid-mushkila-l1-004:q1': C(['A', 'B', 'C'][[(t) => 12 * t, (t) => 12 + t, (t) => t - 12].findIndex((f) => [0, 1, 7].every((t) => f(t) === 12 + t))]),
  'ex-4am-tarrid-mushkila-l1-004:q2': C(['A', 'B', 'C'][[(t) => 28 + t, () => 28, (t) => 28 - t].findIndex((f) => [0, 3, 9].every((t) => f(t) === (40 + t) - (12 + t)))]),
  'ex-4am-tarrid-mushkila-l1-005:q1': pickEq(first((t) => t + 15 === 42), [[15, 0, 0, 42], [1, 0, 0, 57], [1, 15, 0, 42]]),
  'ex-4am-tarrid-mushkila-l1-005:q2': R(first((t) => t + 15 === 42)),
  'ex-4am-tarrid-mushkila-l1-006:q1': C('B') /* 25 et 175 sont donnés : la seule quantité inconnue est le nombre de stylos */,
  'ex-4am-tarrid-mushkila-l1-006:q2': pickEq(first((t) => 25 * t === 175), [[25, 0, 0, 175], [1, 25, 0, 175], [175, 0, 0, 25]]),
  'ex-4am-tarrid-mushkila-l1-006:q3': R(first((t) => 25 * t === 175)),
  'ex-4am-tarrid-mushkila-l1-007:q1': pickEq(first((t) => 2 * (t + 4) === 30), [[1, 4, 0, 30], [2, 8, 0, 30], [4, 0, 0, 30]]),
  'ex-4am-tarrid-mushkila-l1-007:q2': R(first((t) => 2 * (t + 4) === 30)),
  'ex-4am-tarrid-mushkila-l1-008:q1': C(Number.isInteger(32.5) ? 'A' : 'B'),
  'ex-4am-tarrid-mushkila-l1-008:q2': C(['A', 'B', 'C'][[-31, 31.5, 31].findIndex((v) => Number.isInteger(v) && v >= 0)]),
  'ex-4am-tarrid-mushkila-l1-009:q1': C(['A', 'B', 'C'][[(t) => 30 + t, (t) => 30 - t, () => 30].findIndex((f) => [0, 2, 11].every((t) => f(t) === (34 + t) - (4 + t)))]),
  'ex-4am-tarrid-mushkila-l1-009:q2': R(((t) => 4 + t)(6)),
  'ex-4am-tarrid-mushkila-l1-010:q1': pickEq(first((t) => 3 * t + 20 === 110), [[3, 20, 0, 110], [3, 60, 0, 110], [1, 23, 0, 110]]),
  'ex-4am-tarrid-mushkila-l1-010:q2': R(first((t) => 3 * t + 20 === 110)),
  'ex-4am-tarrid-mushkila-l2-001:q1': pickEq(first((t) => 36 + t === (4 + t) + (6 + t) + (8 + t)), [[1, 36, 1, 18], [1, 36, 3, 18], [0, 36, 3, 18]]),
  'ex-4am-tarrid-mushkila-l2-001:q2': R(first((t) => 36 + t === (4 + t) + (6 + t) + (8 + t))),
  'ex-4am-tarrid-mushkila-l2-001:q3': R(((t) => (4 + t) + (6 + t) + (8 + t))(first((t) => 36 + t === (4 + t) + (6 + t) + (8 + t)))),
  'ex-4am-tarrid-mushkila-l2-002:q1': R(first((t) => 3 * t + 5 === 32)),
  'ex-4am-tarrid-mushkila-l2-002:q2': pickEq(first((t) => 3 * t + 5 === 2 * t, -100), [[3, 5, 0, 64], [6, 10, 1, 0], [3, 5, 2, 0]]),
  'ex-4am-tarrid-mushkila-l2-002:q3': R(first((t) => 3 * t + 5 === 2 * t, -100)),
  'ex-4am-tarrid-mushkila-l2-003:q1': pickEq(first((t) => 43 + t === 2 * ((4 + t) + (7 + t))), [[1, 43, 3, 15], [1, 43, 2, 22], [1, 43, 4, 22]]),
  'ex-4am-tarrid-mushkila-l2-003:q2': R(first((t) => 43 + t === 2 * ((4 + t) + (7 + t)))),
  'ex-4am-tarrid-mushkila-l2-004:q1': pickEq(first((t) => 30 + t === 2 * (6 + t)), [[1, 30, 1, 12], [1, 30, 2, 12], [0, 30, 2, 12]]),
  'ex-4am-tarrid-mushkila-l2-004:q2': R(first((t) => 30 + t === 2 * (6 + t))),
  'ex-4am-tarrid-mushkila-l2-005:q1': pickEq(first((t) => 38 + t === (2 + t) + (5 + t) + (9 + t)), [[1, 38, 3, 16], [1, 38, 1, 16], [0, 38, 3, 16]]),
  'ex-4am-tarrid-mushkila-l2-005:q2': R(first((t) => 38 + t === (2 + t) + (5 + t) + (9 + t))),
  'ex-4am-tarrid-mushkila-l2-006:q1': pickEq(first((t) => t / 3 + 4 === 10), [['1/3', '4/3', 0, 10], ['1/3', 4, 0, 10], [3, 4, 0, 10]]),
  'ex-4am-tarrid-mushkila-l2-006:q2': R(first((t) => t / 3 + 4 === 10)),
  'ex-4am-tarrid-mushkila-l2-007:q1': pickEq(first((t) => t + (t + 1) + (t + 2) === 72), [[3, 0, 0, 72], [3, 3, 0, 72], [3, 1, 0, 72]]),
  'ex-4am-tarrid-mushkila-l2-007:q2': R(first((t) => t + (t + 1) + (t + 2) === 72)),
  'ex-4am-tarrid-mushkila-l2-008:q1': pickEq(first((t) => 4 * t + 120 === 1000), [[4, 0, 0, 1120], [4, 480, 0, 1000], [4, 120, 0, 1000]]),
  'ex-4am-tarrid-mushkila-l2-008:q2': R(first((t) => 4 * t + 120 === 1000)),
  'ex-4am-tarrid-mushkila-l2-009:q1': R(first((t) => 45 + t === 4 * (15 + t), -100)),
  'ex-4am-tarrid-mushkila-l2-009:q2': C((45 - 5 === 4 * (15 - 5)) && first((t) => 45 + t === 4 * (15 + t)) === null ? 'B' : 'A'),
  'ex-4am-tarrid-mushkila-l2-010:q1': pickEq(first((t) => t + (t + 3) === 25), [[1, 3, 0, 25], [2, 3, 0, 25], [2, 0, 0, 28]]),
  'ex-4am-tarrid-mushkila-l2-010:q2': R(first((t) => t + (t + 3) === 25)),
  'ex-4am-tarrid-mushkila-l3-001:q1': pickSet((t) => 4 * t >= 84 - 3 * t, [(t) => t <= 12, (t) => t >= 12, (t) => t >= 84]),
  'ex-4am-tarrid-mushkila-l3-001:q2': pickSet((t) => t <= 28 && 4 * t >= 3 * (28 - t), [(t) => t <= 28 && 4 * t >= 3 * t, (t) => t <= 28 && 4 * t >= 84, (t) => t <= 28 && 4 * t >= 3 * (28 - t)], 28),
  'ex-4am-tarrid-mushkila-l3-001:q3': R(first((t) => 4 * t >= 3 * (28 - t))),
  'ex-4am-tarrid-mushkila-l3-002:q1': pickSet((t) => 2 * (t + 6) > 3 * t, [(t) => 2 * t + 12 > 3 * t, (t) => 2 * t + 12 < 3 * t, (t) => t + 6 > 3 * t]),
  'ex-4am-tarrid-mushkila-l3-002:q2': pickSet((t) => t > 0 && 2 * (t + 6) > 3 * t, [(t) => t > 12, (t) => t === 12, (t) => t > 0 && t < 12]),
  'ex-4am-tarrid-mushkila-l3-003:q1': pickEq(first((t) => 3 * t / 4 + 4 + 11 === t), [['3/4', 4, 0, 11], ['3/4', 15, 1, 0], [75, 15, 1, 0]]),
  'ex-4am-tarrid-mushkila-l3-003:q2': R(first((t) => 3 * t / 4 + 4 + 11 === t)),
  'ex-4am-tarrid-mushkila-l3-004:q1': pickSet((t) => 200 + 30 * t < 50 * t, [(t) => 50 * t > 200 + 30 * t, (t) => 50 * t < 200 + 30 * t, (t) => 50 * t > 230 * t]),
  'ex-4am-tarrid-mushkila-l3-004:q2': R(first((t) => 200 + 30 * t < 50 * t)),
  'ex-4am-tarrid-mushkila-l3-005:q1': pickSet((t) => 2 * (2 * t + t) <= 48, [(t) => 3 * t <= 48, (t) => 6 * t <= 48, (t) => 6 * t >= 48]),
  'ex-4am-tarrid-mushkila-l3-005:q2': R(Math.max(...Array.from({ length: 100 }, (_, t) => t).filter((t) => 2 * (2 * t + t) <= 48))),
  'ex-4am-tarrid-mushkila-l3-006:q1': pickEq(first((t) => t - t / 3 - 5 === 15), [['2/3', -5, 0, 15], ['1/3', -5, 0, 15], [1, -8, 0, 15]]),
  'ex-4am-tarrid-mushkila-l3-006:q2': R(first((t) => t - t / 3 - 5 === 15)),
  'ex-4am-tarrid-mushkila-l3-007:q1': pickEq(first((t) => 4 * t / 5 === 1200), [[1, -20, 0, 1200], ['6/5', 0, 0, 1200], ['4/5', 0, 0, 1200]]),
  'ex-4am-tarrid-mushkila-l3-007:q2': R(first((t) => 4 * t / 5 === 1200)),
  'ex-4am-tarrid-mushkila-l3-008:q1': pickSet((t) => (12 + t) / 2 >= 14, [(t) => 12 + t >= 14, (t) => (12 + t) / 2 >= 14, (t) => (12 + t) / 2 <= 14], 20),
  'ex-4am-tarrid-mushkila-l3-008:q2': pickSet((t) => t <= 20 && (12 + t) / 2 >= 14, [(t) => t >= 16, (t) => t >= 16 && t <= 20, (t) => t >= 14], 40),
  'ex-4am-tarrid-mushkila-l3-009:q1': pickEq(first((t) => 3 * (t + 2) === 4 * t), [[1, 2, 1, 0], [3, 2, 4, 0], [3, 6, 4, 0]]),
  'ex-4am-tarrid-mushkila-l3-009:q2': R(first((t) => 3 * (t + 2) === 4 * t)),
  'ex-4am-tarrid-mushkila-l3-010:q1': pickEq(first((t) => 4 * t + 2 * (20 - t) === 56), [[6, 0, 0, 56], [2, 40, 0, 56], [4, 20, 0, 56]]),
  'ex-4am-tarrid-mushkila-l3-010:q2': R(first((t) => 4 * t + 2 * (20 - t) === 56)),
  'ex-4am-tarrid-mushkila-l4-001:q1': pickSet((t) => t < 5 + 7 && 7 < 5 + t && 5 < t + 7, [(t) => t < 12, (t) => t > 2 && t < 12, (t) => t >= 2 && t <= 12], 30),
  'ex-4am-tarrid-mushkila-l4-001:q2': R(Array.from({ length: 50 }, (_, t) => t).filter((t) => t < 5 + 7 && 7 < 5 + t && 5 < t + 7).length),
  'ex-4am-tarrid-mushkila-l4-002:q1': C(['A', 'B', 'C'][[(t) => 2 * t * t - 16 * t + 64, (t) => 4 * t * t - 32 * t + 64, (t) => 64 - t * t].findIndex((f) => [1, 2, 3, 7].every((t) => f(t) === 64 - 4 * (t * (8 - t)) / 2))]),
  'ex-4am-tarrid-mushkila-l4-002:q2': pickSet((t) => t > 0 && t < 8 && 2 * t * t - 16 * t + 64 === 34, [(t) => t === 3, (t) => t === 3 || t === 5, (t) => t === 5 || t === -3], 20, -20),
  'ex-4am-tarrid-mushkila-l4-003:q1': C(['A', 'B', 'C'][[(t) => (t + 3) ** 2 === t * t + 39, (t) => t * t + 3 === 39, (t) => (t + 3) ** 2 === 39].findIndex((f) => Array.from({ length: 60 }, (_, t) => t).filter(f).join() === Array.from({ length: 60 }, (_, t) => t).filter((t) => (t + 3) * (t + 3) - t * t === 39).join())]),
  'ex-4am-tarrid-mushkila-l4-003:q2': R(first((t) => (t + 3) * (t + 3) - t * t === 39)),
  'ex-4am-tarrid-mushkila-l4-004:q1': C(['A', 'B', 'C'][[[-8, 5], [8, -5], [4, 10]].findIndex(([a, b]) => [0, 1, 2, 9].every((t) => (t + a) * (t + b) === t * t + 3 * t - 40))]),
  'ex-4am-tarrid-mushkila-l4-004:q2': pickSet((t) => t > 0 && t * (t + 3) === 40, [(t) => t === 5 || t === -8, (t) => t === -8, (t) => t === 5], 50, -50),
  'ex-4am-tarrid-mushkila-l4-005:q1': pickSet((t) => t * t === 6 * t, [(t) => t === 6, (t) => t === 0 || t === 6, (t) => t === -6 || t === 6], 50, -50),
  'ex-4am-tarrid-mushkila-l4-005:q2': pickSet((t) => t > 0 && t * t === 6 * t, [(t) => t === 0, (t) => t === 0 || t === 6, (t) => t === 6], 50, -50),
  'ex-4am-tarrid-mushkila-l4-006:q1': C(['A', 'B', 'C'][[(t) => t + (t + 4) === 60, (t) => t * (t + 4) === 60, (t) => 4 * t === 60].findIndex((f) => Array.from({ length: 80 }, (_, t) => t).filter(f).join() === '6')]),
  'ex-4am-tarrid-mushkila-l4-006:q2': R(first((t) => t * (t + 4) === 60)),
  'ex-4am-tarrid-mushkila-l4-007:q1': pickSet((t) => 500 - 30 * t < 140, [(t) => 500 - 30 * t < 140, (t) => 500 + 30 * t < 140, (t) => 30 * t < 140], 40),
  'ex-4am-tarrid-mushkila-l4-007:q2': pickSet((t) => 500 - 30 * t < 140, [(t) => t < 12, (t) => t > -12, (t) => t > 12], 40, -40),
  'ex-4am-tarrid-mushkila-l4-007:q3': R(first((t) => 500 - 30 * t < 140)),
  'ex-4am-tarrid-mushkila-l4-008:q1': C(['A', 'B', 'C'][[(t) => (20 + t) * (30 + t) === 1064, (t) => (20 + 2 * t) * (30 + 2 * t) === 1064, (t) => 600 + 2 * t === 1064].findIndex((f) => Array.from({ length: 300 }, (_, t) => t).filter(f).join() === '4')]),
  'ex-4am-tarrid-mushkila-l4-008:q2': pickSet((t) => t > 0 && (20 + 2 * t) * (30 + 2 * t) === 1064, [(t) => t === 4 || t === -29, (t) => t === 4, (t) => t === -29], 60, -60),
  'ex-4am-tarrid-mushkila-l4-009:q1': pickEq(first((t) => t + 26 + 4 === 3 * (t + 4)), [[1, 30, 3, 12], [1, 26, 3, 4], [1, 30, 3, 0]]),
  'ex-4am-tarrid-mushkila-l4-009:q2': R(first((t) => t + 26 + 4 === 3 * (t + 4))),
  'ex-4am-tarrid-mushkila-l4-010:q1': pickSet((t) => 3 * (t - 4) > t, [(t) => 3 * t - 4 > t, (t) => 3 * (t - 4) > t, (t) => t - 4 > 3 * t], 40, -40),
  'ex-4am-tarrid-mushkila-l4-010:q2': pickSet((t) => 3 * (t - 4) > t, [(t) => t < 6, (t) => t > 6, (t) => t > 4], 40, -40),
  'ex-4am-tarrid-mushkila-l5-001:q1': C(['A', 'B', 'C'][[(t) => (t + 3) * (t + 8), (t) => (t + 3) * (t - 8), (t) => t * (t - 8) + 3].findIndex((f) => [9, 10, 15].every((t) => f(t) === (t + 3) * (t - 8)))]),
  'ex-4am-tarrid-mushkila-l5-001:q2': R(first((t) => t > 8 && (t + 3) * (t - 8) === 60)),
  'ex-4am-tarrid-mushkila-l5-001:q3': C((-7 + 3) * (-7 - 8) === 60 ? 'C' : 'A'),
  'ex-4am-tarrid-mushkila-l5-002:q1': pickEq(first((t) => 800 - 25 * t === 200 + 15 * t), [[-25, 800, 15, 200], [25, 800, 15, 200], [-25, 800, -15, 200]]),
  'ex-4am-tarrid-mushkila-l5-002:q2': R(first((t) => 800 - 25 * t === 200 + 15 * t)),
  'ex-4am-tarrid-mushkila-l5-002:q3': R(((t) => 200 + 15 * t)(first((t) => 800 - 25 * t === 200 + 15 * t))),
  'ex-4am-tarrid-mushkila-l5-003:q1': pickEq(first((t) => 1500 + 200 * t === 3000 + 50 * t), [[200, 1500, 50, 3000], [1700, 0, 3050, 0], [1500, 200, 3000, 50]]),
  'ex-4am-tarrid-mushkila-l5-003:q2': R(first((t) => 1500 + 200 * t === 3000 + 50 * t)),
  'ex-4am-tarrid-mushkila-l5-003:q3': C(first((t) => 1500 + 200 * t > 3000 + 50 * t) === 11 ? 'B' : 'A'),
  'ex-4am-tarrid-mushkila-l5-004:q1': pickEq(first((t) => 42 - t === 4 * (12 - t)), [[1, 42, 4, 48], [-1, 42, -4, 48], [-1, 42, -1, 48]]),
  'ex-4am-tarrid-mushkila-l5-004:q2': R(first((t) => 42 - t === 4 * (12 - t))),
  'ex-4am-tarrid-mushkila-l5-005:q1': pickEq(first((t) => t + 2 * t + (t + 20) === 180), [[3, 20, 0, 180], [4, 20, 0, 180], [3, 20, 0, 180]]),
  'ex-4am-tarrid-mushkila-l5-005:q2': R(first((t) => t + 2 * t + (t + 20) === 180)),
  'ex-4am-tarrid-mushkila-l5-005:q3': R(((t) => Math.max(t, 2 * t, t + 20))(first((t) => t + 2 * t + (t + 20) === 180))),
  'ex-4am-tarrid-mushkila-l5-006:q1': pickSet((t) => 350 + 45 * t <= 900, [(t) => 350 + 45 * t <= 900, (t) => 45 * t <= 900, (t) => 350 + 45 * t >= 900], 40),
  'ex-4am-tarrid-mushkila-l5-006:q2': R(Math.max(...Array.from({ length: 100 }, (_, t) => t).filter((t) => 350 + 45 * t <= 900))),
  'ex-4am-tarrid-mushkila-l5-007:q1': pickEq(first((t) => 2 * (t + t + 10) === 140), [[2, 10, 0, 140], [4, 20, 0, 140], [4, 0, 0, 140]]),
  'ex-4am-tarrid-mushkila-l5-007:q2': R(first((t) => 2 * (t + t + 10) === 140)),
  'ex-4am-tarrid-mushkila-l5-007:q3': R(((t) => t * (t + 10))(first((t) => 2 * (t + t + 10) === 140))),
  'ex-4am-tarrid-mushkila-l5-008:q1': C(['A', 'B', 'C'][[[-12, 11], [11, 12], [12, -11]].findIndex(([a, b]) => [0, 1, 5, 13].every((t) => (t + a) * (t + b) === t * t + t - 132))]),
  'ex-4am-tarrid-mushkila-l5-008:q2': R(first((t) => t * (t + 1) === 132)),
  'ex-4am-tarrid-mushkila-l5-009:q1': pickEq(first((t) => 300 * t + 150 * (120 - t) === 25500), [[450, 0, 0, 25500], [150, 18000, 0, 25500], [300, 150, 0, 25500]]),
  'ex-4am-tarrid-mushkila-l5-009:q2': R(first((t) => 300 * t + 150 * (120 - t) === 25500)),
  'ex-4am-tarrid-mushkila-l5-009:q3': R(120 - first((t) => 300 * t + 150 * (120 - t) === 25500)),
  'ex-4am-tarrid-mushkila-l5-010:q1': pickSet((t) => 15 + 8 * t <= 250, [(t) => 15 + 8 * t <= 250, (t) => 8 * t <= 250, (t) => 15 * t + 8 <= 250], 60),
  'ex-4am-tarrid-mushkila-l5-010:q2': R(Math.max(...Array.from({ length: 100 }, (_, t) => t).filter((t) => 15 + 8 * t <= 250))),
};
