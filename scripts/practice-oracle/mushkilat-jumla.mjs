// Oracle du banc « mushkilat-jumla » (unité 5 « جمل معادلتين من الدرجة الأولى بمجهولين ») — chaque réponse
// RECALCULÉE ici, sans lire le contenu ni le code testé. Fusionné dans scripts/practice-answer-oracle.test.mjs.
//
// Un exercice de ce banc est une HISTOIRE : l'oracle la REJOUE avec ses propres nombres (relus dans
// l'énoncé), jamais avec la jumla de la clé.
//   findPair(histoire, max)   le couple d'entiers naturels de [0, max]² qui vérifie l'histoire — UNIQUE
//                             (zéro ou deux couples → l'oracle lève une erreur) ; findPairs : tous
//   solve2(…)                 Cramer en rationnels exacts (helpers.mjs) quand la réponse n'est pas
//                             entière (Thalès, une histoire sans solution naturelle, la NISBA négative)
//   pickEq(couple, options)   chaque option est UNE équation a·x + b·y = c RELUE dans son texte ; la
//                             bonne est l'unique que le couple de l'histoire vérifie
//   pickSys(couple, options)  chaque option est une jumla [a1, b1, c1, a2, b2, c2] relue ; la bonne est
//                             l'unique dont la solution (Cramer) est le couple de l'histoire
//   pickPair(histoire, opts)  chaque option est une phrase-réponse lue comme un couple (null : une phrase
//                             qui n'en annonce qu'un nombre) ; la bonne est l'unique qui vérifie l'histoire
// Généré avec le banc par le script de l'auteur ; ne pas éditer une entrée sans recalculer l'autre côté.
import { R, C, P, q, solve2 } from './helpers.mjs';

const LETTERS = ['A', 'B', 'C', 'D'];

/** Tous les couples d'entiers naturels de [0, max]² qui vérifient l'histoire. */
const findPairs = (story, max = 200) => {
  const out = [];
  for (let x = 0; x <= max; x += 1) for (let y = 0; y <= max; y += 1) if (story(x, y)) out.push([x, y]);
  return out;
};

/** Le couple UNIQUE de l'histoire. */
function findPair(story, max = 200) {
  const all = findPairs(story, max);
  if (all.length !== 1) throw new Error(`mushkilat-jumla oracle: ${all.length} couples vérifient l'histoire`);
  return all[0];
}

const unique = (flags, what) => {
  const ok = flags.map((f, i) => (f ? LETTERS[i] : null)).filter(Boolean);
  if (ok.length !== 1) throw new Error(`mushkilat-jumla oracle: ${ok.length} ${what} acceptables`);
  return C(ok[0]);
};

function pickEq([x, y], options) {
  return unique(options.map(([a, b, c]) => q(a).mul(x).add(q(b).mul(y)).sub(c).isZero()), 'équations');
}

function pickSys([x, y], options) {
  const want = [q(x).toString(), q(y).toString()];
  return unique(options.map((o) => {
    if (!o) return false;
    try { const [sx, sy] = solve2(...o); return sx === want[0] && sy === want[1]; } catch { return false; }
  }), 'jumal');
}

function pickPair(story, options) {
  return unique(options.map((o) => !!o && story(...o)), 'phrases');
}

export const ORACLE = {
  'ex-4am-mushkilat-jumla-l1-001:q1': C('A') /* le seul couple de quantités que le texte NE donne PAS (610 et 37 sont donnés) */,
  'ex-4am-mushkilat-jumla-l1-001:q2': pickEq(findPair((x, y) => x + y === 37 && 20 * x + 10 * y === 610), [[20, 10, 37], [1, 1, 37], [1, 1, 610]]),
  'ex-4am-mushkilat-jumla-l1-002:q1': pickEq(findPair((x, y) => x + y === 140 && 300 * x + 150 * y === 30300), [[300, 150, 140], [1, 1, 30300], [1, 1, 140]]),
  'ex-4am-mushkilat-jumla-l1-002:q2': pickEq(findPair((x, y) => x + y === 140 && 300 * x + 150 * y === 30300), [[300, 150, 30300], [150, 300, 30300], [1, 1, 30300]]),
  'ex-4am-mushkilat-jumla-l1-003:q1': pickSys(findPair((x, y) => x + y === 20 && 300 * x + 150 * y === 4800), [[1, 1, 20, 300, 150, 4800], [1, 1, 4800, 300, 150, 20], [1, 1, 20, 150, 300, 4800]]),
  'ex-4am-mushkilat-jumla-l1-003:q2': P(...findPair((x, y) => x + y === 20 && 300 * x + 150 * y === 4800)),
  'ex-4am-mushkilat-jumla-l1-004:q1': pickEq(findPair((x, y) => 2 * x + y === 160 && x + y === 110), [[1, 2, 160], [2, 1, 110], [2, 1, 160]]),
  'ex-4am-mushkilat-jumla-l1-004:q2': P(...findPair((x, y) => 2 * x + y === 160 && x + y === 110)),
  'ex-4am-mushkilat-jumla-l1-005:q1': C('B') /* seules les deux quantités par sorte ne sont pas données (200, 100, 7, 1100 le sont) */,
  'ex-4am-mushkilat-jumla-l1-005:q2': pickSys(findPair((x, y) => x + y === 7 && 200 * x + 100 * y === 1100), [[1, 1, 1100, 200, 100, 7], [1, 1, 7, 100, 200, 1100], [1, 1, 7, 200, 100, 1100]]),
  'ex-4am-mushkilat-jumla-l1-006:q1': pickSys(findPair((x, y) => x + y === 20 && x === y + 4), [[1, 1, 20, 1, -1, -4], [1, 1, 20, 1, -1, 4], [1, 1, 4, 1, -1, 20]]),
  'ex-4am-mushkilat-jumla-l1-006:q2': P(...findPair((x, y) => x + y === 20 && x === y + 4)),
  'ex-4am-mushkilat-jumla-l1-007:q1': pickEq(findPair((x, y) => x + y === 10 && 3 * x + y === 24), [[1, 3, 24], [3, 1, 24], [1, 1, 24]]),
  'ex-4am-mushkilat-jumla-l1-007:q2': P(...findPair((x, y) => x + y === 10 && 3 * x + y === 24)),
  'ex-4am-mushkilat-jumla-l1-008:q1': pickEq(findPair((x, y) => x + y === 36 && 4 * x + 2 * y === 90), [[1, 1, 36], [4, 2, 36], [2, 4, 36]]),
  'ex-4am-mushkilat-jumla-l1-008:q2': pickEq(findPair((x, y) => x + y === 36 && 4 * x + 2 * y === 90), [[2, 4, 90], [1, 1, 90], [4, 2, 90]]),
  'ex-4am-mushkilat-jumla-l1-009:q1': C((24 + 6 === 30 && 150 * 24 + 250 * 6 === 5100) ? 'A' : 'B'),
  'ex-4am-mushkilat-jumla-l1-009:q2': C((6 + 24 === 30 && 150 * 6 + 250 * 24 !== 5100) ? 'B' : 'A'),
  'ex-4am-mushkilat-jumla-l1-010:q1': pickSys(findPair((x, y) => x + y === 50 && 250 * x + 400 * y === 15500), [[1, 1, 50, 250, 400, 15500], [1, 1, 50, 400, 250, 15500], [1, 1, 15500, 250, 400, 50]]),
  'ex-4am-mushkilat-jumla-l1-010:q2': pickPair((x, y) => x + y === 50 && 250 * x + 400 * y === 15500, [[20, 30], null, [30, 20]]),
  'ex-4am-mushkilat-jumla-l2-001:q1': pickSys(findPair((x, y) => x + y === 140 && 300 * x + 150 * y === 30300), [[1, 1, 30300, 300, 150, 140], [1, 1, 140, 300, 150, 30300], [1, 1, 140, 150, 300, 30300]]),
  'ex-4am-mushkilat-jumla-l2-001:q2': P(...findPair((x, y) => x + y === 140 && 300 * x + 150 * y === 30300)),
  'ex-4am-mushkilat-jumla-l2-001:q3': C(['A', 'B', 'C'][[() => false /* « فقط » : une seule information n'est pas une vérification */, (x, y) => 300 * y + 150 * x === 30300, (x, y) => x + y === 140 && 300 * x + 150 * y === 30300].findIndex((f) => f(...findPair((x, y) => x + y === 140 && 300 * x + 150 * y === 30300)))]),
  'ex-4am-mushkilat-jumla-l2-002:q1': pickSys(findPair((x, y) => x + y === 2019 && x - y === 25, 2100), [[1, 1, 25, 1, -1, 2019], [1, 1, 2019, 1, -1, 25], [1, 1, 2019, -1, 1, 25]]),
  'ex-4am-mushkilat-jumla-l2-002:q2': P(...findPair((x, y) => x + y === 2019 && x - y === 25, 2100)),
  'ex-4am-mushkilat-jumla-l2-003:q1': pickSys(findPair((x, y) => x + y === 206 && x === 4 * y + 1 && 1 < y, 210), [[1, 1, 206, 1, -4, 0], [1, 1, 206, -4, 1, 1], [1, 1, 206, 1, -4, 1]]),
  'ex-4am-mushkilat-jumla-l2-003:q2': P(...findPair((x, y) => x + y === 206 && x === 4 * y + 1 && 1 < y, 210)),
  'ex-4am-mushkilat-jumla-l2-004:q1': pickSys(findPair((x, y) => x + y === 12 && 400 * x + 250 * y === 3750), [[1, 1, 12, 400, 250, 3750], [1, 1, 3750, 400, 250, 12], [1, 1, 12, 250, 400, 3750]]),
  'ex-4am-mushkilat-jumla-l2-004:q2': P(...findPair((x, y) => x + y === 12 && 400 * x + 250 * y === 3750)),
  'ex-4am-mushkilat-jumla-l2-005:q1': pickSys(findPair((x, y) => x + y === 50 && 10 * x + 20 * y === 700), [[1, 1, 50, 20, 10, 700], [1, 1, 50, 10, 20, 700], [10, 20, 50, 1, 1, 700]]),
  'ex-4am-mushkilat-jumla-l2-005:q2': P(...findPair((x, y) => x + y === 50 && 10 * x + 20 * y === 700)),
  'ex-4am-mushkilat-jumla-l2-006:q1': pickEq(findPair((x, y) => x + y === 18 && 4500 * x + 6000 * y === 93000), [[1, 1, 93000], [6000, 4500, 93000], [4500, 6000, 93000]]),
  'ex-4am-mushkilat-jumla-l2-006:q2': P(...findPair((x, y) => x + y === 18 && 4500 * x + 6000 * y === 93000)),
  'ex-4am-mushkilat-jumla-l2-007:q1': pickSys(findPair((x, y) => 3 * x + 2 * y === 520 && x + 2 * y === 240, 300), [[3, 2, 520, 1, 2, 240], [3, 2, 520, 2, 1, 240], [2, 3, 520, 1, 2, 240]]),
  'ex-4am-mushkilat-jumla-l2-007:q2': P(...findPair((x, y) => 3 * x + 2 * y === 520 && x + 2 * y === 240, 300)),
  'ex-4am-mushkilat-jumla-l2-008:q1': pickSys(findPair((x, y) => x - y === 24 && x + 8 === 3 * (y + 8)), [[1, -1, 24, 1, -3, 16], [1, -1, 24, 1, -3, 0], [1, -1, 24, 3, -1, -16]]),
  'ex-4am-mushkilat-jumla-l2-008:q2': P(...findPair((x, y) => x - y === 24 && x + 8 === 3 * (y + 8))),
  'ex-4am-mushkilat-jumla-l2-009:q1': pickSys(findPair((x, y) => x + y === 48 && x === 3 * y), [[1, 1, 48, -3, 1, 0], [1, 1, 48, 1, -3, 0], [1, 1, 48, 1, -1, 3]]),
  'ex-4am-mushkilat-jumla-l2-009:q2': P(...findPair((x, y) => x + y === 48 && x === 3 * y)),
  'ex-4am-mushkilat-jumla-l2-010:q1': pickSys(findPair((x, y) => 2 * x + 3 * y === 550 && x + 3 * y === 350, 400), [[2, 3, 350, 1, 3, 550], [2, 3, 550, 1, 3, 350], [1, 1, 5, 1, 1, 4]]),
  'ex-4am-mushkilat-jumla-l2-010:q2': P(...findPair((x, y) => 2 * x + 3 * y === 550 && x + 3 * y === 350, 400)),
  'ex-4am-mushkilat-jumla-l3-001:q1': pickSys(findPair((x, y) => x + y === 37 && 20 * x + 10 * y === 610), [[1, 1, 610, 20, 10, 37], [1, 1, 37, 10, 20, 610], [1, 1, 37, 20, 10, 610]]),
  'ex-4am-mushkilat-jumla-l3-001:q2': P(...findPair((x, y) => x + y === 37 && 20 * x + 10 * y === 610)),
  'ex-4am-mushkilat-jumla-l3-001:q3': pickPair((x, y) => x + y === 37 && 20 * x + 10 * y === 610, [[24, 13], [13, 24], null]),
  'ex-4am-mushkilat-jumla-l3-002:q1': pickSys(findPair((a, b) => a + b === 133 && 7 * (a + 5) === 4 * (b + 5)), [[1, 1, 133, 4, -7, 15], [1, 1, 133, 7, -4, -15], [1, 1, 133, 7, -4, 0]]),
  'ex-4am-mushkilat-jumla-l3-002:q2': P(...findPair((a, b) => a + b === 133 && 7 * (a + 5) === 4 * (b + 5))),
  'ex-4am-mushkilat-jumla-l3-003:q1': pickEq(findPair((x, y) => x + y === 34 && x + 4 === 2 * (y + 4)), [[1, -2, 0], [2, -1, -4], [1, -2, 4]]),
  'ex-4am-mushkilat-jumla-l3-003:q2': P(...findPair((x, y) => x + y === 34 && x + 4 === 2 * (y + 4))),
  'ex-4am-mushkilat-jumla-l3-004:q1': pickSys(findPair((x, y) => 2 * x + y === 33 && x + 2 * y === 39, 20), [[2, 1, 11, 1, 2, 13], [2, 1, 33, 1, 2, 39], [2, 1, 22, 1, 2, 26]]),
  'ex-4am-mushkilat-jumla-l3-004:q2': P(...findPair((x, y) => (2 * x + y) / 3 === 11 && (x + 2 * y) / 3 === 13, 20)),
  'ex-4am-mushkilat-jumla-l3-005:q1': pickSys(findPair((x, y) => x + y === 52 && 800 * x + 1200 * y === 44000), [[1, 1, 52, 800, 1200, 44000], [1, 1, 52, 1200, 800, 44000], [1, 1, 44000, 800, 1200, 52]]),
  'ex-4am-mushkilat-jumla-l3-005:q2': P(...findPair((x, y) => x + y === 52 && 800 * x + 1200 * y === 44000)),
  'ex-4am-mushkilat-jumla-l3-005:q3': pickPair((x, y) => x + y === 52 && 800 * x + 1200 * y === 44000, [[6, 46], [46, 6], null]),
  'ex-4am-mushkilat-jumla-l3-006:q1': pickSys(findPair((x, y) => x + y + 2 === 14 && 3 * x + y + 0 * 2 === 26), [[1, 1, 14, 3, 1, 26], [1, 1, 12, 3, 1, 26], [1, 1, 12, 1, 3, 26]]),
  'ex-4am-mushkilat-jumla-l3-006:q2': P(...findPair((x, y) => x + y + 2 === 14 && 3 * x + y === 26)),
  'ex-4am-mushkilat-jumla-l3-007:q1': pickSys(findPair((x, y) => x + y === 38 && 40 * x + 25 * y === 1220), [[1, 1, 38, 40, 25, 1220], [1, 1, 1220, 40, 25, 38], [1, 1, 38, 25, 40, 1220]]),
  'ex-4am-mushkilat-jumla-l3-007:q2': P(...findPair((x, y) => x + y === 38 && 40 * x + 25 * y === 1220)),
  'ex-4am-mushkilat-jumla-l3-007:q3': pickPair((x, y) => x + y === 38 && 40 * x + 25 * y === 1220, [[18, 20], [20, 18], null]),
  'ex-4am-mushkilat-jumla-l3-008:q1': pickSys(findPair((x, y) => x + y === 1000 && 200 * x + 500 * y === 260000, 1000), [[1, 1, 1000, 500, 200, 260000], [1, 1, 1000, 200, 500, 260000], [1, 1, 260000, 200, 500, 1000]]),
  'ex-4am-mushkilat-jumla-l3-008:q2': P(...findPair((x, y) => x + y === 1000 && 200 * x + 500 * y === 260000, 1000)),
  'ex-4am-mushkilat-jumla-l3-009:q1': pickSys(findPair((x, y) => 2 * (x + y) === 46 && x === y + 7), [[2, 2, 46, 1, -1, 7], [1, 1, 46, 1, -1, 7], [2, 2, 46, -1, 1, 7]]),
  'ex-4am-mushkilat-jumla-l3-009:q2': P(...findPair((x, y) => 2 * (x + y) === 46 && x === y + 7)),
  'ex-4am-mushkilat-jumla-l3-010:q1': C(['A', 'B', 'C'][[(x, y) => (x + 5) * (y - 2) === 0, (x, y) => (x - 5) * (y + 2) === x * y, (x, y) => (x + 5) * (y - 2) === x * y].findIndex((f) => f(...findPair((x, y) => x + y === 30 && (x + 5) * (y - 2) === x * y)))]),
  'ex-4am-mushkilat-jumla-l3-010:q2': P(...findPair((x, y) => x + y === 30 && (x + 5) * (y - 2) === x * y)),
  'ex-4am-mushkilat-jumla-l4-001:q1': pickEq(findPair((x, y) => 2 * (x + y) === 220 && (x - 2) * (y + 2) === x * y + 16, 120), [[2, -2, 16], [2, -2, 20], [2, 2, 20]]),
  'ex-4am-mushkilat-jumla-l4-001:q2': P(...findPair((x, y) => 2 * (x + y) === 220 && (x - 2) * (y + 2) === x * y + 16, 120)),
  'ex-4am-mushkilat-jumla-l4-002:q1': pickSys(findPair((x, y) => x + y + y === 180 && y === 2 * x, 180), [[1, 1, 180, -2, 1, 0], [1, 2, 180, -2, 1, 0], [2, 1, 180, -2, 1, 0]]),
  'ex-4am-mushkilat-jumla-l4-002:q2': P(...findPair((x, y) => x + y + y === 180 && y === 2 * x, 180)),
  'ex-4am-mushkilat-jumla-l4-003:q1': pickSys(solve2(1, 1, '4.8', -10, 14, 0), [[1, 1, '4.8', -10, 14, 0], [1, 1, '13.8', -10, 14, 0], [1, 1, '4.8', -10, 4, 0]]),
  'ex-4am-mushkilat-jumla-l4-003:q2': P(...solve2(1, 1, q(13.8).sub(4).sub(5).toString(), q(10).div(14).toString(), -1, 0)),
  'ex-4am-mushkilat-jumla-l4-004:q1': pickEq(findPair((x, y) => 5 * x + 3 * y === 1000 + 50 && 3 * y === 2 * x, 400), [[5, 3, '1.5'], [5, 3, 1050], [5, 3, 150]]),
  'ex-4am-mushkilat-jumla-l4-004:q2': P(...findPair((x, y) => 5 * x + 3 * y === 1050 && 3 * y === 2 * x, 400)),
  'ex-4am-mushkilat-jumla-l4-005:q1': pickSys(solve2(1, -3, -2, 1, -4, 2), [[1, 0, 1, 1, 0, 6], [1, -3, -2, 1, -4, 2], [1, 2, 3, 1, -2, 4]]),
  'ex-4am-mushkilat-jumla-l4-005:q2': R(q(solve2(1, -3, -2, 1, -4, 2)[0]).div(solve2(1, -3, -2, 1, -4, 2)[1]).toString()),
  'ex-4am-mushkilat-jumla-l4-006:q1': pickEq(findPair((x, y) => 6 * x + 10 * y === 21000 && 66 * x + 80 * y === 195000, 3000), [['6.6', 8, 19500], [6, 10, 19500 - 60 + 200], ['0.6', 2, 19500]]),
  'ex-4am-mushkilat-jumla-l4-006:q2': P(...findPair((x, y) => 6 * x + 10 * y === 21000 && 66 * x + 80 * y === 195000, 3000)),
  'ex-4am-mushkilat-jumla-l4-007:q1': pickSys(findPair((x, y) => x + y === 30 && 6 * x * 1 === 4 * y), [[1, 1, 30, 6, -4, 0], [1, 1, 30, 4, -6, 0], [1, 1, 30, 6, 4, 0]]),
  'ex-4am-mushkilat-jumla-l4-007:q2': R(findPair((x, y) => x + y === 30 && 6 * x === 4 * y)[0]),
  'ex-4am-mushkilat-jumla-l4-008:q1': pickEq(findPair((x, y) => x + y === 9 && 1000 * x + 500 * y === 6 * 1000), [[1, 500, 6], [1000, 500, 6000], [1000, 500, 6]]),
  'ex-4am-mushkilat-jumla-l4-008:q2': P(...findPair((x, y) => x + y === 9 && 1000 * x + 500 * y === 6000)),
  'ex-4am-mushkilat-jumla-l4-008:q3': R(((x, y) => 100 * x + 70 * y)(...findPair((x, y) => x + y === 9 && 1000 * x + 500 * y === 6000))),
  'ex-4am-mushkilat-jumla-l4-009:q1': pickEq(findPair((x, y) => x + y === 37 && x - 5 === 2 * (y - 5)), [[1, -2, -5], [1, -2, 0], [2, -1, 5]]),
  'ex-4am-mushkilat-jumla-l4-009:q2': P(...findPair((x, y) => x + y === 37 && x - 5 === 2 * (y - 5))),
  'ex-4am-mushkilat-jumla-l4-010:q1': pickEq(findPair((x, y) => x + y === 20 && 150 * x + 100 * y === 130 * 20), [[150, 100, 130], [150, 100, 2600], [150, 100, 5000]]),
  'ex-4am-mushkilat-jumla-l4-010:q2': P(...findPair((x, y) => x + y === 20 && 150 * x + 100 * y === 2600)),
  'ex-4am-mushkilat-jumla-l5-001:q1': P(...solve2(1, 1, 25, 300, 500, 9000)),
  'ex-4am-mushkilat-jumla-l5-001:q2': C(findPairs((x, y) => x + y === 25 && 300 * x + 500 * y === 9000).length === 0 && !(17 + 8 === 25 && 300 * 17 + 500 * 8 === 9000) ? 'B' : 'A'),
  'ex-4am-mushkilat-jumla-l5-002:q1': pickEq([300, 700], [[20, 2, 4400], [10, 1, 4400], [10, 2, 4400]]),
  'ex-4am-mushkilat-jumla-l5-002:q2': P(...solve2(10, 4, 5800, 10, 2, 4400)),
  'ex-4am-mushkilat-jumla-l5-003:q1': pickEq(findPair((x, y) => x + y === 11 && 10 * y + x === 10 * x + y + 27, 9), [[9, -9, 27], [-9, 9, 27], [0, 0, 27]]),
  'ex-4am-mushkilat-jumla-l5-003:q2': R(((x, y) => 10 * x + y)(...findPair((x, y) => x + y === 11 && 10 * y + x === 10 * x + y + 27, 9))),
  'ex-4am-mushkilat-jumla-l5-004:q1': pickSys(findPair((x, y) => x + y === 23 && 2 * x + 5 * y === 76), [[1, 1, 76, 2, 5, 23], [1, 1, 23, 5, 2, 76], [1, 1, 23, 2, 5, 76]]),
  'ex-4am-mushkilat-jumla-l5-004:q2': P(...findPair((x, y) => x + y === 23 && 2 * x + 5 * y === 76)),
  'ex-4am-mushkilat-jumla-l5-004:q3': pickPair((x, y) => x + y === 23 && 2 * x + 5 * y === 76, [[10, 13], [13, 10], null]),
  'ex-4am-mushkilat-jumla-l5-005:q1': pickEq(findPair((x, y) => 2 * (x + y) === 120 && (x + 4) * (y - 4) === x * y - 96, 70), [[-4, 4, -96], [4, -4, -80], [-4, 4, -80]]),
  'ex-4am-mushkilat-jumla-l5-005:q2': P(...findPair((x, y) => 2 * (x + y) === 120 && (x + 4) * (y - 4) === x * y - 96, 70)),
  'ex-4am-mushkilat-jumla-l5-006:q1': C(findPair((x, y) => x + y === 120 && 600 * x + 450 * y === 61500)[0] === 50 ? 'B' : 'C'),
  'ex-4am-mushkilat-jumla-l5-006:q2': P(...findPair((x, y) => x + y === 120 && 600 * x + 450 * y === 61500)),
  'ex-4am-mushkilat-jumla-l5-007:q1': pickSys(findPair((x, y) => x + y === 17 && 80 * x + 150 * y === 1850), [[1, 1, 17, 150, 80, 1850], [1, 1, 17, 80, 150, 1850], [80, 150, 17, 1, 1, 1850]]),
  'ex-4am-mushkilat-jumla-l5-007:q2': pickPair((x, y) => x + y === 17 && 80 * x + 150 * y === 1850, [[7, 10], [12, 5], [10, 7]]),
  'ex-4am-mushkilat-jumla-l5-008:q1': pickSys(findPair((x, y) => 4 * x + 6 * y === 900 && 6 * x + 4 * y === 850, 300), [[4, 6, 900, 6, 4, 850], [6, 4, 900, 4, 6, 850], [1, 1, 10, 4, 6, 900]]),
  'ex-4am-mushkilat-jumla-l5-008:q2': P(...findPair((x, y) => 4 * x + 6 * y === 900 && 6 * x + 4 * y === 850, 300)),
  'ex-4am-mushkilat-jumla-l5-009:q1': pickSys(findPair((x, y) => y === 4 * x + 6 && y === 5 * x - 3), [[-4, 1, -6, -5, 1, 3], [-4, 1, 6, -5, 1, -3], [-4, 1, 6, -5, 1, 3]]),
  'ex-4am-mushkilat-jumla-l5-009:q2': P(...findPair((x, y) => y === 4 * x + 6 && y === 5 * x - 3)),
  'ex-4am-mushkilat-jumla-l5-010:q1': C('A') /* 500, 300, 260 et 106000 sont donnés ; restent les deux effectifs */,
  'ex-4am-mushkilat-jumla-l5-010:q2': P(...findPair((x, y) => x + y === 260 && 500 * x + 300 * y === 106000, 300)),
  'ex-4am-mushkilat-jumla-l5-010:q3': pickPair((x, y) => x + y === 260 && 500 * x + 300 * y === 106000, [[120, 140], null, [140, 120]]),
};
