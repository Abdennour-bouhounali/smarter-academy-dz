// L'ORACLE des réponses du banc d'exercices 4AM (audit d'intégrité, 2026-09-24).
//
// Les tests de l'évaluateur prouvent seulement qu'il accepte la clé
// CONFIGURÉE. Ce test prouve autre chose : que la clé configurée est la
// réponse MATHÉMATIQUEMENT juste. Chaque réponse attendue ci-dessous est
// RECALCULÉE ici, avec une arithmétique écrite dans ce fichier (pgcd par
// Euclide, liste de diviseurs par balayage, fractions réduites), jamais lue
// dans le contenu. Puis :
//   1. l'oracle doit être accepté par l'évaluateur réel (réponse juste acceptée) ;
//   2. la clé du contenu doit valoir l'oracle (clé juste) ;
//   3. pour les QCM, seul le choix de l'oracle est accepté.
//
// Une question du banc qui n'a pas d'entrée ici fait échouer le test : un
// nouvel exercice doit arriver avec sa vérification indépendante.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluateAnswer, isSuccessOutcome } from '../packages/core/practice/answerEvaluator.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'content/practice/4am');

/* ── Arithmétique indépendante ─────────────────────────────────────────── */
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const divisors = (n) => { const out = []; for (let d = 1; d <= n; d++) if (n % d === 0) out.push(d); return out; };
const common = (a, b) => divisors(a).filter((d) => b % d === 0);
const frac = (n, d) => { const g = gcd(n, d); const s = Math.sign(n) * Math.sign(d); return `${s * Math.abs(n) / g}/${Math.abs(d) / g}`; };
const reduce = (n, d) => { const g = gcd(n, d); return (d / g === 1) ? String(n / g) : frac(n, d); };
/** a/b − c/d etc. en entiers : [numérateur, dénominateur] */
const sub = ([a, b], [c, d]) => [a * d - c * b, b * d];
const mul = ([a, b], [c, d]) => [a * c, b * d];
const add = ([a, b], [c, d]) => [a * d + c * b, b * d];
const div = ([a, b], [c, d]) => [a * d, b * c];
const gcd3 = (a, b, c) => gcd(gcd(a, b), c);
/** nombre d'étapes de l'algorithme d'Euclide */
const euclidSteps = (a, b) => { let n = 0; while (b) { [a, b] = [b, a % b]; n++; } return n; };
const range = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);

/* ── L'oracle : item → réponse de l'élève qui DOIT être acceptée ────────── */
const R = (v) => ({ value: String(v) });
const S = (arr) => ({ value: arr.join(', ') });
const C = (id) => ({ choiceId: id });

const ORACLE = {
  // awwaliyan-fima-baynahuma
  'ex-4am-awwaliyan-fima-baynahuma-l2-001:q1': R(gcd(15, 22)),
  'ex-4am-awwaliyan-fima-baynahuma-l3-001:q1': R(gcd(56, 65)),
  'ex-4am-awwaliyan-fima-baynahuma-l5-001:q2': R(gcd(253, 407)),
  // bahth-pgcd
  'ex-4am-bahth-pgcd-l2-001:q1': R(252 - 140),
  'ex-4am-bahth-pgcd-l2-001:q2': R(gcd(252, 140)),
  'ex-4am-bahth-pgcd-l2-002:q1': R(117 - 91),
  'ex-4am-bahth-pgcd-l2-002:q2': R(gcd(117, 91)),
  'ex-4am-bahth-pgcd-l3-001:q1': R(765 % 135),
  'ex-4am-bahth-pgcd-l3-001:q2': R(gcd(765, 135)),
  'ex-4am-bahth-pgcd-l3-001:q3': R(euclidSteps(765, 135)),
  'ex-4am-bahth-pgcd-l3-002:q1': R(1938 - 836 * 2),
  'ex-4am-bahth-pgcd-l3-002:q2': R(gcd(1938, 836)),
  'ex-4am-bahth-pgcd-l4-001:q1': R(gcd(437, 1035)),
  'ex-4am-bahth-pgcd-l4-001:q2': R(gcd(943, 861)),
  'ex-4am-bahth-pgcd-l4-001:q3': R(gcd(1111, 111111)),
  'ex-4am-bahth-pgcd-l4-002:q1': R(gcd(5858, 6767)),
  'ex-4am-bahth-pgcd-l5-001:q1': R(gcd(21957, 43351)),
  'ex-4am-bahth-pgcd-l5-002:q1': R(gcd(936, 845)),                // écoles : plus grand diviseur commun
  'ex-4am-bahth-pgcd-l5-002:q2': R(936 / gcd(936, 845)),          // مآزر وردية par école
  // ikhtizal-kasr
  'ex-4am-ikhtizal-kasr-l1-001:q1': C('A'),                       // « بعد القسمة على 4 » : 84/4 = 21, 48/4 = 12 → 21/12 (choix A)
  'ex-4am-ikhtizal-kasr-l2-001:q1': R(frac(28, 42)),
  'ex-4am-ikhtizal-kasr-l2-002:q1': R(gcd(84, 48)),
  'ex-4am-ikhtizal-kasr-l2-002:q2': R(frac(84, 48)),
  'ex-4am-ikhtizal-kasr-l3-001:q1': R(gcd(595, 560)),
  'ex-4am-ikhtizal-kasr-l3-001:q2': R(frac(595, 560)),
  'ex-4am-ikhtizal-kasr-l3-002:q1': R(frac(529, 69)),
  'ex-4am-ikhtizal-kasr-l3-002:q2': R(frac(91, 28)),
  'ex-4am-ikhtizal-kasr-l3-002:q3': R(frac(707, 909)),
  'ex-4am-ikhtizal-kasr-l3-002:q4': R(frac(1111, 1919)),
  'ex-4am-ikhtizal-kasr-l4-001:q1': R(gcd(1005, 315)),
  'ex-4am-ikhtizal-kasr-l4-001:q2': R(frac(1005, 315)),
  'ex-4am-ikhtizal-kasr-l4-002:q1': R(frac(...sub([2, 7], mul([3, 7], [8, 21])))),
  'ex-4am-ikhtizal-kasr-l4-002:q2': R(frac(...mul(sub([7, 6], [3, 4]), [4, 5]))),
  'ex-4am-ikhtizal-kasr-l5-001:q1': R(frac(13 + 7, 13 + 1)),       // A = (n + 7)/(n + 1) = 1 + 6/(n + 1)
  'ex-4am-ikhtizal-kasr-l5-001:q2': S(range(0, 100).filter((n) => 6 % (n + 1) === 0)),
  'ex-4am-ikhtizal-kasr-l5-002:q1': R(gcd(19251, 22816)),
  'ex-4am-ikhtizal-kasr-l5-002:q2': R(frac(22816, 19251)),
  // khawass-qawasim
  'ex-4am-khawass-qawasim-l2-001:q1': R(900 - 90),
  'ex-4am-khawass-qawasim-l2-001:q2': R(900 + 90),
  'ex-4am-khawass-qawasim-l3-001:q1': R(90 % 25),
  'ex-4am-khawass-qawasim-l4-002:q1': R(18),                       // (n + 19) − (n + 1)
  // Tous les pgcd(n + 19, n + 1) atteints — c'est ce que « يمكن أن تكون » demande.
  'ex-4am-khawass-qawasim-l4-002:q2': S([...new Set(range(0, 500).map((n) => gcd(n + 19, n + 1)))].sort((a, b) => a - b)),
  'ex-4am-khawass-qawasim-l5-002:q1': S([...new Set(range(0, 500).map((n) => gcd(n + 2, n + 32)))].sort((a, b) => a - b)),
  // qasim-adad-tabii
  'ex-4am-qasim-adad-tabii-l2-001:q1': S([80, 120, 132, 295].filter((n) => n % 6 === 0)),
  'ex-4am-qasim-adad-tabii-l2-002:q1': R(Math.floor(1512 / 21)),
  'ex-4am-qasim-adad-tabii-l2-002:q2': R(1512 % 21),
  // qasim-mushtarak-akbar
  'ex-4am-qasim-mushtarak-akbar-l1-001:q1': S(common(12, 18)),
  'ex-4am-qasim-mushtarak-akbar-l2-001:q2': R(gcd(90, 54)),
  'ex-4am-qasim-mushtarak-akbar-l3-001:q1': S(common(28, 42)),
  'ex-4am-qasim-mushtarak-akbar-l3-001:q2': R(gcd(28, 42)),
  'ex-4am-qasim-mushtarak-akbar-l4-001:q1': S(divisors(155)),
  'ex-4am-qasim-mushtarak-akbar-l4-001:q2': S(divisors(141)),
  'ex-4am-qasim-mushtarak-akbar-l4-001:q3': R(gcd(155, 141)),
  // qawasim-adad-tabii
  'ex-4am-qawasim-adad-tabii-l1-001:q1': S(divisors(60)),
  'ex-4am-qawasim-adad-tabii-l1-002:q1': S(divisors(84)),
  'ex-4am-qawasim-adad-tabii-l2-001:q1': S(divisors(48)),
  'ex-4am-qawasim-adad-tabii-l2-001:q2': S(divisors(17)),
  'ex-4am-qawasim-adad-tabii-l2-002:q1': S(divisors(18)),          // 18/a naturel ⇔ a | 18
  'ex-4am-qawasim-adad-tabii-l3-001:q2': S(divisors(105)),
  'ex-4am-qawasim-adad-tabii-l3-002:q1': S(divisors(5 * 11)),
  'ex-4am-qawasim-adad-tabii-l3-002:q2': S(divisors(1000)),
  'ex-4am-qawasim-adad-tabii-l4-001:q1': S(range(0, 100).filter((a) => 24 % (a + 7) === 0)),
  'ex-4am-qawasim-adad-tabii-l5-001:q1': S(range(100, 999).filter((n) => Math.floor(n / 10) % 10 === 7 && n % 15 === 0)),
  // tayin-pgcd
  'ex-4am-tayin-pgcd-l1-001:q1': S(common(42, 60)),
  'ex-4am-tayin-pgcd-l1-001:q2': R(gcd(42, 60)),
  'ex-4am-tayin-pgcd-l2-001:q1': R(gcd(28, 28)),
  'ex-4am-tayin-pgcd-l2-001:q2': R(gcd(7, 0)),
  'ex-4am-tayin-pgcd-l2-001:q3': R(gcd(8, 40)),
  'ex-4am-tayin-pgcd-l3-001:q1': R(gcd(18, 36)),
  'ex-4am-tayin-pgcd-l3-001:q2': R(gcd(27, 30)),
  'ex-4am-tayin-pgcd-l3-001:q3': R(gcd(57, 95)),
  'ex-4am-tayin-pgcd-l4-001:q1': R(gcd(112, 120)),
  'ex-4am-tayin-pgcd-l4-001:q2': R(gcd(120, 88)),
  'ex-4am-tayin-pgcd-l4-001:q3': R(gcd(gcd(112, 120), 88)),
  'ex-4am-tayin-pgcd-l5-001:q1': R(range(41, 54).filter((a) => gcd(a, 15) === 5).join('')), // 40 < a < 55 : un seul

  /* ── سلسلة التفوق رقم 01 (docs/sources/4am/unit1/worksheet-tafawwuq-01.json) ── */
  // تمرين 1
  'ex-4am-qawasim-adad-tabii-l3-003:q1': S(divisors(48)),
  'ex-4am-qawasim-adad-tabii-l3-003:q2': S(divisors(75)),
  'ex-4am-qawasim-adad-tabii-l3-003:q3': S(divisors(2 * 13)),
  'ex-4am-qawasim-adad-tabii-l3-003:q4': S(divisors(3 * 11 * 17)),
  // تمرين 2
  'ex-4am-qasim-mushtarak-akbar-l2-002:q1': S(divisors(105)),
  'ex-4am-qasim-mushtarak-akbar-l2-002:q2': S(divisors(60)),
  'ex-4am-qasim-mushtarak-akbar-l2-002:q3': R(Math.max(...common(105, 60))),
  'ex-4am-qasim-mushtarak-akbar-l2-002:q4': R(Math.min(...common(105, 60))),
  // تمرين 3 (فروق) و 4 (إقليدس)
  'ex-4am-bahth-pgcd-l3-003:q1': R(gcd(88, 40)),
  'ex-4am-bahth-pgcd-l3-003:q2': R(gcd(837, 341)),
  'ex-4am-bahth-pgcd-l3-003:q3': R(gcd(3465, 1575)),
  'ex-4am-bahth-pgcd-l4-003:q1': R(gcd(845, 693)),
  'ex-4am-bahth-pgcd-l4-003:q2': R(gcd(725, 348)),
  'ex-4am-bahth-pgcd-l4-003:q3': R(gcd(2736, 1216)),
  // تمرين 5 — 25 < a < 40 : un seul
  'ex-4am-tayin-pgcd-l5-002:q1': R(range(26, 39).filter((a) => gcd(a, 15) === 5).join('')),
  // تمرين 6 — deux solutions
  'ex-4am-qasim-mushtarak-akbar-l5-002:q1': S(range(13, 488).filter((x) => 402 % x === 12 && 488 % x === 8)),
  // تمرين 7 — PGCD(3a ; 6b) ≠ 1 pour tout couple premier entre eux (vérifié plus bas)
  'ex-4am-awwaliyan-fima-baynahuma-l3-003:q1': C('A'),
  // تمرين 8
  'ex-4am-ikhtizal-kasr-l3-003:q1': R(frac(136, 104)),
  'ex-4am-ikhtizal-kasr-l3-003:q2': R(frac(240, 520)),
  'ex-4am-ikhtizal-kasr-l3-003:q3': R(frac(651, 310)),
  'ex-4am-ikhtizal-kasr-l3-003:q4': R(frac(333, 666)),
  'ex-4am-ikhtizal-kasr-l3-003:q5': R(frac(1978, 732)),
  // تمرين 9
  'ex-4am-ikhtizal-kasr-l4-003:q1': R(gcd(63, 110)),
  'ex-4am-ikhtizal-kasr-l4-003:q2': R(gcd(441, 770)),
  'ex-4am-ikhtizal-kasr-l4-003:q3': R(range(0, 2000).find((n) => 441 * (315 + n) === 770 * 315)),
  // تمرين 10 — 240x = 320y
  'ex-4am-ikhtizal-kasr-l4-004:q1': R(frac(320, 240)),
  'ex-4am-ikhtizal-kasr-l4-004:q2': R(frac(320, 240)),
  // تمرين 11
  'ex-4am-ikhtizal-kasr-l5-003:q1': R(frac(...mul(sub([3, 2], [1, 4]), [7, 5]))),
  'ex-4am-ikhtizal-kasr-l5-003:q2': R(frac(...sub([1, 6], div([7, 2], [14, 3])))),
  'ex-4am-ikhtizal-kasr-l5-003:q3': R(frac(...mul([5, 2], div(add([7, 3], div([2, 3], [5, 1])), sub([7, 2], mul([5, 2], [1, 4])))))),
  'ex-4am-ikhtizal-kasr-l5-003:q4': R(frac(...div(sub([2, 1], [3, 4]), add([1, 1], div([1, 1], add([1, 1], [1, 3])))))),
  // تمرين 12 — E = 2175/1044 + 5/6 = a + b/c
  'ex-4am-ikhtizal-kasr-l5-004:q1': C('A'),
  'ex-4am-ikhtizal-kasr-l5-004:q2': R(frac(2175, 1044)),
  'ex-4am-ikhtizal-kasr-l5-004:q3': R((() => { const [n, d] = add([2175, 1044], [5, 6]); return Math.floor(n / d); })()),
  'ex-4am-ikhtizal-kasr-l5-004:q4': R((() => { const [n, d] = add([2175, 1044], [5, 6]); return frac(n % d, d); })()),
  // تمرين 13
  'ex-4am-ikhtizal-kasr-l4-005:q1': R(gcd(1631, 932)),
  'ex-4am-ikhtizal-kasr-l4-005:q2': R(frac(1631, 932)),
  'ex-4am-ikhtizal-kasr-l4-005:q3': R(reduce(...sub([1631, 932], mul([1, 2], [3, 2])))),
  // تمرين 14 (السؤال الأوّل فقط)
  'ex-4am-ikhtizal-kasr-l2-003:q1': R(gcd(133, 27)),
  'ex-4am-ikhtizal-kasr-l2-003:q2': C('A'),
  // تمرين 15
  'ex-4am-ikhtizal-kasr-l3-004:q1': R(frac(210, 301)),
  'ex-4am-ikhtizal-kasr-l3-004:q2': R(frac(...sub([17, 86], [210, 301]))),
  // الوضعيات 1–10 → أدمج تعلّماتي
  'ex-4am-wadiya-idmajiya-aadad-l1-001:q1': R(gcd(24, 18)),
  'ex-4am-wadiya-idmajiya-aadad-l1-001:q2': R(24 / gcd(24, 18)),
  'ex-4am-wadiya-idmajiya-aadad-l1-001:q3': R(18 / gcd(24, 18)),
  'ex-4am-wadiya-idmajiya-aadad-l1-002:q1': R(gcd(240, 105)),
  'ex-4am-wadiya-idmajiya-aadad-l1-002:q2': R(240 / gcd(240, 105)),
  'ex-4am-wadiya-idmajiya-aadad-l1-002:q3': R(105 / gcd(240, 105)),
  'ex-4am-wadiya-idmajiya-aadad-l2-001:q1': R(gcd(165, 88)),
  'ex-4am-wadiya-idmajiya-aadad-l2-001:q2': R((165 / gcd(165, 88)) * (88 / gcd(165, 88))),
  'ex-4am-wadiya-idmajiya-aadad-l2-002:q1': R(gcd3(30, 45, 60)),
  'ex-4am-wadiya-idmajiya-aadad-l3-001:q1': R(gcd(1392, 812)),
  'ex-4am-wadiya-idmajiya-aadad-l3-001:q2': R(1392 / gcd(1392, 812)),
  'ex-4am-wadiya-idmajiya-aadad-l3-001:q3': R(812 / gcd(1392, 812)),
  'ex-4am-wadiya-idmajiya-aadad-l3-002:q1': R(gcd(114, 84)),
  'ex-4am-wadiya-idmajiya-aadad-l3-002:q2': R((114 / gcd(114, 84)) * 3 + (84 / gcd(114, 84)) * 2.5), // cm
  'ex-4am-wadiya-idmajiya-aadad-l4-001:q1': R(gcd(460, 300)), // 4,6 m × 3 m en cm
  'ex-4am-wadiya-idmajiya-aadad-l4-001:q2': R((460 / gcd(460, 300)) * (300 / gcd(460, 300))),
  'ex-4am-wadiya-idmajiya-aadad-l4-002:q1': R(gcd(140, 220)),
  'ex-4am-wadiya-idmajiya-aadad-l4-002:q2': R(gcd(140, 220)), // 1,40 m × 2,20 m en cm
  'ex-4am-wadiya-idmajiya-aadad-l4-002:q3': R((140 / gcd(140, 220)) * (220 / gcd(140, 220))),
  // poteaux / arbres : un coin = un poteau ⇒ la distance divise chaque côté ; clôture fermée ⇒ n = périmètre ÷ distance
  'ex-4am-wadiya-idmajiya-aadad-l5-001:q1': R(common(135, 39).filter((d) => d > 2)[0]),
  'ex-4am-wadiya-idmajiya-aadad-l5-001:q2': R((2 * (135 + 39)) / common(135, 39).filter((d) => d > 2)[0]),
  'ex-4am-wadiya-idmajiya-aadad-l5-002:q1': R(gcd3(32, 60, 68)),
  'ex-4am-wadiya-idmajiya-aadad-l5-002:q2': R((32 + 60 + 68) / gcd3(32, 60, 68)),
};

/**
 * Le cas signalé : « أي جملة ليس لها نفس معنى «6 قاسم للعدد 120»؟ ».
 * Chaque option est une RELATION, modélisée ici ; la bonne réponse est
 * l'unique option dont la valeur de vérité n'est pas celle de « 6 | 120 ».
 */
const divides = (d, n) => n % d === 0;
const REPORTED = {
  key: 'ex-4am-qasim-adad-tabii-l3-001:q2',
  reference: divides(6, 120),
  options: {
    A: divides(120, 6),          // « 6 مضاعف للعدد 120 » ⇔ 120 | 6
    B: divides(6, 120),          // « 6 يقسم 120 »
    C: divides(6, 120),          // « 120 يقبل القسمة على 6 »
    D: divides(6, 120),          // « 120 مضاعف للعدد 6 »
  },
};

/* ── Lecture du banc ───────────────────────────────────────────────────── */
function* questions() {
  for (const lesson of readdirSync(root)) {
    const ldir = join(root, lesson);
    if (!statSync(ldir).isDirectory()) continue;
    for (const lvl of readdirSync(ldir)) {
      for (const f of readdirSync(join(ldir, lvl))) {
        const ex = JSON.parse(readFileSync(join(ldir, lvl, f), 'utf8'));
        for (const q of ex.questions) yield { key: `${ex.id}:${q.id}`, q };
      }
    }
  }
}
const bank = [...questions()];

describe('oracle indépendant du banc 4AM — la clé est-elle la réponse juste ?', () => {
  it('سلسلة التفوق، تمرين 7 : 3a et 6b ne sont JAMAIS premiers entre eux quand a et b le sont', () => {
    for (let a = 1; a <= 80; a++) for (let b = 1; b <= 80; b++) {
      if (gcd(a, b) === 1) expect(gcd(3 * a, 6 * b)).not.toBe(1);
    }
  });

  it('سلسلة التفوق، تمرين 6 et 5 : les deux ambiguïtés de la feuille sont réelles', () => {
    // « جد العدد x » : deux valeurs vérifient les deux divisions
    expect(range(13, 488).filter((x) => 402 % x === 12 && 488 % x === 8)).toEqual([15, 30]);
    // « بين 25 و 40 » lu au sens large : trois valeurs ; au sens strict : une seule
    expect(range(25, 40).filter((a) => gcd(a, 15) === 5)).toEqual([25, 35, 40]);
  });

  it('le cas signalé (6 | 120) : A est l’unique réponse, et seul A est accepté', () => {
    const q = bank.find((b) => b.key === REPORTED.key).q;
    const differing = Object.entries(REPORTED.options).filter(([, v]) => v !== REPORTED.reference).map(([id]) => id);
    expect(differing).toEqual(['A']);
    for (const id of ['A', 'B', 'C', 'D']) {
      expect(isSuccessOutcome(evaluateAnswer(C(id), q).outcome)).toBe(id === 'A');
    }
  });

  for (const { key, q } of bank) {
    if (q.answerType === 'choice' || q.answerType === 'multiChoice') {
      if (!(key in ORACLE)) continue; // QCM conceptuels : vérifiés par l'audit, couverts par l'aller-retour du validateur
    }
    it(`${key} — la réponse mathématiquement juste est acceptée`, () => {
      expect(key in ORACLE, `aucune vérification indépendante pour ${key}`).toBe(true);
      const verdict = evaluateAnswer(ORACLE[key], q);
      expect(isSuccessOutcome(verdict.outcome), `${key} refuse ${JSON.stringify(ORACLE[key])} (${verdict.outcome})`).toBe(true);
      // Et la clé du contenu EST cette réponse (même valeur / même ensemble).
      if (q.answerType === 'rational') expect(evaluateAnswer({ value: String(q.expectedAnswer) }, { ...q, expectedAnswer: ORACLE[key].value }).isCorrect).toBe(true);
      if (q.answerType === 'integerSet') expect([...q.expectedAnswer].sort((a, b) => a - b).join(',')).toBe(ORACLE[key].value.split(', ').join(','));
      if (q.answerType === 'choice') {
        for (const c of q.choices) expect(isSuccessOutcome(evaluateAnswer(C(c.id), q).outcome)).toBe(c.id === ORACLE[key].choiceId);
      }
    });
  }
});
