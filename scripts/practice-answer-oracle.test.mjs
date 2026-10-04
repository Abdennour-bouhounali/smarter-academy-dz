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
// Unité 3 « الحساب الحرفي » : un module d'oracle par leçon (écrits en parallèle, fusionnés ici).
import { ORACLE as ORACLE_NASHR } from './practice-oracle/nashr-tabsit.mjs';
import { ORACLE as ORACLE_MUTATABIQAT } from './practice-oracle/mutatabiqat-shahira.mjs';
import { ORACLE as ORACLE_TAHLIL } from './practice-oracle/tahlil-ibara.mjs';
import { ORACLE as ORACLE_WADIYA_HARFI } from './practice-oracle/wadiya-idmajiya-harfi.mjs';
// Unité 4 « معادلات ومتراجحات » : même principe, un module par leçon.
import { ORACLE as ORACLE_MUADALA } from './practice-oracle/muadala-ula.mjs';
import { ORACLE as ORACLE_JIDAA } from './practice-oracle/jidaa-maadum.mjs';
import { ORACLE as ORACLE_MUTARAJIHA } from './practice-oracle/mutarajiha-ula.mjs';
import { ORACLE as ORACLE_TARRID } from './practice-oracle/tarrid-mushkila.mjs';
import { ORACLE as ORACLE_WADIYA_MUADALAT } from './practice-oracle/wadiya-idmajiya-muadalat.mjs';
// Unité 5 « جمل معادلتين » : même principe ; les ثنائيات sont des `point` (P(x, y)).
import { ORACLE as ORACLE_MAFHUM_JUMLA } from './practice-oracle/mafhum-jumla.mjs';
import { ORACLE as ORACLE_HALL_JABRI } from './practice-oracle/hall-jabri.mjs';
import { ORACLE as ORACLE_MUSHKILAT_JUMLA } from './practice-oracle/mushkilat-jumla.mjs';
import { ORACLE as ORACLE_WADIYA_JUMAL } from './practice-oracle/wadiya-idmajiya-jumal.mjs';
// Unité 6 « الدالة الخطية والتناسبية » (2026-10-02).
import { ORACLE as ORACLE_TANASUB } from './practice-oracle/tanasub-muamil.mjs';
import { ORACLE as ORACLE_DALA } from './practice-oracle/dala-khattiya.mjs';
import { ORACLE as ORACLE_TAMTHIL } from './practice-oracle/tamthil-bayani-khatti.mjs';
import { ORACLE as ORACLE_TATBIQAT } from './practice-oracle/tatbiqat-tanasub.mjs';
import { ORACLE as ORACLE_TARRID_KHATTI } from './practice-oracle/tarrid-khatti.mjs';
import { ORACLE as ORACLE_WADIYA_KHATTIYA } from './practice-oracle/wadiya-idmajiya-khattiya.mjs';
// Unité 7 « الدالة التآلفية » (2026-10-02).
import { ORACLE as ORACLE_MAFHUM_TAALUFIYA } from './practice-oracle/mafhum-taalufiya.mjs';
import { ORACLE as ORACLE_TAMTHIL_TAALUFI } from './practice-oracle/tamthil-bayani-taalufi.mjs';
import { ORACLE as ORACLE_TAGHAYYURAT } from './practice-oracle/tanasub-taghayyurat.mjs';
import { ORACLE as ORACLE_TAFSIR_JUMLA } from './practice-oracle/tafsir-bayani-jumla.mjs';
import { ORACLE as ORACLE_TARRID_TAALUFI } from './practice-oracle/tarrid-taalufi.mjs';
import { ORACLE as ORACLE_WADIYA_TAALUFIYA } from './practice-oracle/wadiya-idmajiya-taalufiya.mjs';
// Unité 8 « الإحصاء » (2026-10-02).
import { ORACLE as ORACLE_TAKRAR_MUJAMMA } from './practice-oracle/takrar-mujamma.mjs';
import { ORACLE as ORACLE_MADA_WASIT } from './practice-oracle/mada-wasit-mutawassit.mjs';
import { ORACLE as ORACLE_MAJDULAT } from './practice-oracle/majdulat-ihsaiya.mjs';
import { ORACLE as ORACLE_QIRAAT_WADIYAT } from './practice-oracle/qiraat-wadiyat-ihsaiya.mjs';
import { ORACLE as ORACLE_WADIYA_IHSA } from './practice-oracle/wadiya-idmajiya-ihsa.mjs';
// Unité 9 « خاصية طالس »
import { ORACLE as ORACLE_TALIS_HISAB } from './practice-oracle/talis-hisab-atwal.mjs';
import { ORACLE as ORACLE_AKSIYA_TALIS } from './practice-oracle/aksiya-talis.mjs';
import { ORACLE as ORACLE_INSHAAT_TALIS } from './practice-oracle/inshaat-talis.mjs';
import { ORACLE as ORACLE_WADIYA_TALIS } from './practice-oracle/wadiya-idmajiya-talis.mjs';
import { ORACLE as ORACLE_NISAB_MUTH } from './practice-oracle/nisab-muthallathiya.mjs';
import { ORACLE as ORACLE_HASIBA_MUTH } from './practice-oracle/hasiba-muthallathiya.mjs';
import { ORACLE as ORACLE_ALAQAT_MUTH } from './practice-oracle/alaqat-muthallathiya.mjs';
import { ORACLE as ORACLE_TARRID_MUTH } from './practice-oracle/tarrid-muthallathiya.mjs';
import { ORACLE as ORACLE_WADIYA_MUTH } from './practice-oracle/wadiya-idmajiya-muthallathat.mjs';
import { ORACLE as ORACLE_INSIHAB_SHUAA } from './practice-oracle/insihab-shuaa.mjs';
import { ORACLE as ORACLE_SHUAAYN_MUT } from './practice-oracle/shuaayn-mutasawiyayn.mjs';
import { ORACLE as ORACLE_MAJMU_SHUAAYN } from './practice-oracle/majmu-shuaayn.mjs';
import { ORACLE as ORACLE_BARAHIN_ASHIA } from './practice-oracle/barahin-ashia.mjs';
import { ORACLE as ORACLE_WADIYA_ASHIA } from './practice-oracle/wadiya-idmajiya-ashia.mjs';
import { ORACLE as ORACLE_MURAKKIBATA } from './practice-oracle/murakkibata-shuaa.mjs';
import { ORACLE as ORACLE_HISAB_MURAKKIBATAY } from './practice-oracle/hisab-murakkibatay.mjs';
import { ORACLE as ORACLE_MUNTASAF_MASAFA } from './practice-oracle/muntasaf-masafa.mjs';
import { ORACLE as ORACLE_ITHBAT_KHAWAS } from './practice-oracle/ithbat-khawas-maalam.mjs';
import { ORACLE as ORACLE_WADIYA_MAALAM } from './practice-oracle/wadiya-idmajiya-maalam.mjs';

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
  'ex-4am-wadiya-idmajiya-aadad-l5-002:q2': R((32 + 60 + 68) / gcd3(32, 60, 68)),  // ── Unité 2 « الحساب على الجذور » (2026-09-30) — chaque réponse recalculée ici. ──
  // jidhr-tarbii — √a : le nombre POSITIF dont le carré est a ; racines de décimaux par entiers (√49 / √100)
  'ex-4am-jidhr-tarbii-l1-001:q1': R(13 * 13),                                   // 13 هو الجذر التربيعي للعدد 169
  'ex-4am-jidhr-tarbii-l1-001:q2': R(25 * 25),                                   // … هو مربع العدد 25
  'ex-4am-jidhr-tarbii-l1-001:q3': R(range(0, 25).find((x) => x * x === 25)),    // le seul x ≥ 0 tel que x² = 25
  'ex-4am-jidhr-tarbii-l1-002:q1': R(range(0, 36).find((x) => x * x === 36)),
  'ex-4am-jidhr-tarbii-l1-002:q2': R(range(0, 81).find((x) => x * x === 81)),
  'ex-4am-jidhr-tarbii-l1-002:q3': R(frac(range(0, 49).find((x) => x * x === 49), 10)),       // √0,49 = √49 / √100
  'ex-4am-jidhr-tarbii-l2-001:q1': R(range(0, 289).find((x) => x * x === 289)),
  'ex-4am-jidhr-tarbii-l2-001:q2': R(frac(range(0, 144).find((x) => x * x === 144), 10)),     // √1,44 = √144 / √100
  'ex-4am-jidhr-tarbii-l2-001:q3': R(frac(1, range(0, 10000).find((x) => x * x === 10000))),  // √0,0001 = √1 / √10000
  'ex-4am-jidhr-tarbii-l2-002:q1': C('A'),                                       // (5/3)² = 25/9 et 5/3 > 0 ; 25/3 : (25/3)² ≠ 25/9 ; −5/3 < 0
  'ex-4am-jidhr-tarbii-l2-002:q2': C('B'),                                       // √7 se lit « الجذر التربيعي للعدد 7 » (معارف 1)
  'ex-4am-jidhr-tarbii-l3-001:q1': R(frac(100, 49)),                             // (√a)² = a
  'ex-4am-jidhr-tarbii-l3-001:q2': R((-1) * (-1) * 17),                         // (−√17)² = (−1)² × (√17)² = 17
  'ex-4am-jidhr-tarbii-l3-002:q1': R(range(0, 1).find((x) => x * x === (-1) ** 2)),
  'ex-4am-jidhr-tarbii-l3-002:q2': R(range(0, 49).find((x) => x * x === -(-49))),
  'ex-4am-jidhr-tarbii-l4-001:q1': C('B'),                                       // 3 − π < 0 ⇒ √((3 − π)²) = π − 3
  'ex-4am-jidhr-tarbii-l4-001:q2': C('C'),                                       // π − 5 < 0 ⇒ √((π − 5)²) = 5 − π
  'ex-4am-jidhr-tarbii-l4-002:q1': C('A'),                                       // 2236067978² ≠ 5 × 10¹⁸ : valeur approchée
  'ex-4am-jidhr-tarbii-l4-002:q2': C('B'),                                       // la valeur exacte se note √5 (نشاط 1)
  'ex-4am-jidhr-tarbii-l5-001:q1': R(frac(9 * 3, 1000)),                         // √0,81 × √((−0,03)²) = 0,9 × 0,03 = 27/1000
  'ex-4am-jidhr-tarbii-l5-001:q2': C('B'),                                       // 1 − √2 < 0 ⇒ √((1 − √2)²) + 1 = √2 − 1 + 1 = √2
  'ex-4am-jidhr-tarbii-l5-002:q1': R(frac(3301 - 3141, 1000)),                   // (3,301 − π) + (π − 3,141) = 0,16 (3,141 < π < 3,301)
  // natiqa-ghayr-natiqa — racines rationnelles / irrationnelles, valeurs approchées (unité 2, درس 2).
  // Encadrements CALCULÉS en entiers : à la précision 1/p, la valeur par défaut de √n est
  // floor(√(n·p²))/p (le plus grand k tel que k² ≤ n·p²), par excès ce k + 1 (n non carré).
  'ex-4am-natiqa-ghayr-natiqa-l1-001:q1': C((() => { const r = range(1, 169).find((k) => k * k === 169); return r ? 'A' : 'B'; })()), // 13² = 169 → صنف أول
  'ex-4am-natiqa-ghayr-natiqa-l1-001:q2': C('A'), // 16/9 (صنف أول) n'est pas entier, 100 > 7 : seul le critère « مربع لعدد ناطق » sépare les deux classes
  'ex-4am-natiqa-ghayr-natiqa-l1-002:q1': R(frac(range(1, 25).find((k) => k * k === 25), range(1, 9).find((k) => k * k === 9))),
  'ex-4am-natiqa-ghayr-natiqa-l2-001:q1': R(frac(range(1, 16).find((k) => k * k === 16), range(1, 9).find((k) => k * k === 9))),
  'ex-4am-natiqa-ghayr-natiqa-l2-001:q2': C(['A', 'B', 'C', 'D'][[[13, 1], [100, 1], [25, 100], [9, 1]].findIndex(([n, d]) => !range(0, n * d).some((k) => k * k === n * d))]), // n/d carré d'un rationnel ⇔ n·d carré parfait : seul 13 ne l'est pas
  'ex-4am-natiqa-ghayr-natiqa-l2-002:q1': R(range(0, 41).filter((k) => k * k <= 41).at(-1)),
  'ex-4am-natiqa-ghayr-natiqa-l2-002:q2': R(range(0, 113).filter((k) => k * k <= 113).at(-1)),
  'ex-4am-natiqa-ghayr-natiqa-l3-001:q1': R(frac(range(0, 700).filter((k) => k * k <= 43 * 100).at(-1), 10)),          // par défaut à 0,1
  'ex-4am-natiqa-ghayr-natiqa-l3-001:q2': R(frac(range(0, 300).filter((k) => k * k <= 8 * 100).at(-1) + 1, 10)),        // par excès à 0,1
  'ex-4am-natiqa-ghayr-natiqa-l3-001:q3': R(frac(130 - (range(0, 300).filter((k) => k * k <= 7 * 100).at(-1) + 1), 10)), // 13 − √7 par défaut = 13 − (√7 par excès)
  'ex-4am-natiqa-ghayr-natiqa-l3-002:q1': R(frac((() => { const k = range(0, 400).filter((j) => j * j <= 12 * 100).at(-1); return (2 * k + 1) * (2 * k + 1) <= 4 * 12 * 100 ? k + 1 : k; })(), 10)), // arrondi : k + ½ comparé en entiers
  'ex-4am-natiqa-ghayr-natiqa-l4-001:q1': R(2 * 2 - 1 * 1),                                                              // AH² = AB² − BH², BH = 1
  'ex-4am-natiqa-ghayr-natiqa-l4-001:q2': R(frac(range(0, 200).filter((k) => k * k <= (2 * 2 - 1 * 1) * 100).at(-1) + 1, 10)), // aire = √3, par excès à 0,1
  'ex-4am-natiqa-ghayr-natiqa-l4-002:q1': R(frac((() => { const k = range(0, 1000).filter((j) => j * j <= 54 * 10000).at(-1); return (2 * k + 1) * (2 * k + 1) <= 4 * 54 * 10000 ? k + 1 : k; })(), 100)),
  'ex-4am-natiqa-ghayr-natiqa-l4-002:q2': R(frac(Math.round((Math.sqrt(7) + 3) * 100), 100)),                           // 564,575… : loin de la demi-unité
  'ex-4am-natiqa-ghayr-natiqa-l4-002:q3': R(frac(Math.round((Math.sqrt(7) + Math.sqrt(11)) * 100), 100)),               // 596,237…
  'ex-4am-natiqa-ghayr-natiqa-l5-001:q1': C(range(1, 2).some((k) => k * k === 2) ? 'B' : 'A'), // 2 n'est pas un carré parfait → √2 irrationnel ≠ tout décimal
  'ex-4am-natiqa-ghayr-natiqa-l5-002:q1': R(frac(Math.round((15 / (3 + Math.sqrt(2))) * 100), 100)),                    // 339,81… → 340/100
  // muadalat-x-murabba — x² = a (unité 2, leçon 3). Les solutions sont CHERCHÉES
  // par balayage (ou calculées par √ sur des carrés parfaits), jamais recopiées.
  'ex-4am-muadalat-x-murabba-l1-001:q1': R(frac(...mul([-3, 2], [-3, 2]))),                    // (−3/2)² = 9/4
  'ex-4am-muadalat-x-murabba-l1-001:q2': C('A'),                                               // (−b)² = b² : mêmes carrés (B « opposés » faux sauf b = 0, C « −b négatif au carré » faux)
  'ex-4am-muadalat-x-murabba-l1-002:q1': C('B'),                                               // « 36 مربع العدد الوحيد 6 » : faux, (−6)² = 36 aussi
  'ex-4am-muadalat-x-murabba-l2-001:q1': C('A'),                                               // x² = 9 : {3, −3} (4,5² = 20,25)
  'ex-4am-muadalat-x-murabba-l2-001:q2': R(range(-100, 100).filter((x) => x * x === 0).length), // x² = 0 : une seule solution
  'ex-4am-muadalat-x-murabba-l2-001:q3': C('C'),                                               // x² = −9 : aucun carré n'est négatif
  'ex-4am-muadalat-x-murabba-l2-002:q1': R(frac(...mul([-2, 3], [-2, 3]))),                    // (−2/3)² = 4/9
  'ex-4am-muadalat-x-murabba-l2-002:q2': C('A'),                                               // x² = 5, 5 > 0 : ±√5 (2,5² = 6,25)
  'ex-4am-muadalat-x-murabba-l3-001:q1': R(range(0, 300).find((n) => n * n === 289) / 10),     // x² = 2,89 = 289/100 → 1,7
  'ex-4am-muadalat-x-murabba-l3-001:q2': R(-range(0, 400).find((n) => n * n === 361)),         // x² = 361 → −19
  'ex-4am-muadalat-x-murabba-l3-001:q3': C('C'),                                               // x² = −16 : aucune solution
  'ex-4am-muadalat-x-murabba-l3-002:q1': C('B'),                                               // x² = (−1)² = 1 : ±1
  'ex-4am-muadalat-x-murabba-l3-002:q2': R(frac(range(1, 10).find((n) => n * n === 1), range(1, 10).find((n) => n * n === 4))), // √(1/4) = 1/2
  'ex-4am-muadalat-x-murabba-l4-001:q1': C('C'),                                               // −x² = 2 ⇔ x² = −2 : aucune solution
  'ex-4am-muadalat-x-murabba-l4-001:q2': C('B'),                                               // 2x² − 6 = 0 ⇔ x² = 3 : ±√3
  'ex-4am-muadalat-x-murabba-l4-001:q3': R(range(1, 100).find((x) => x + 1 - x * x === x)),   // x + 1 − x² = x : solution positive
  'ex-4am-muadalat-x-murabba-l4-002:q1': R(frac(range(1, 10).find((n) => n * n === 1), range(1, 10).find((n) => n * n === 9))), // 1 − 9x² = 0 ⇔ x² = 1/9 → 1/3
  'ex-4am-muadalat-x-murabba-l4-002:q2': C('C'),                                               // 3 + x² = 0 ⇔ x² = −3 : aucune solution
  'ex-4am-muadalat-x-murabba-l5-001:q1': C('C'),                                               // (x − 7)(x + 4) + 3x + 21 = x² − 7 (vérifié en x = 0 : −28 + 21 = −7 ; x = 1 : −30 + 24 = −6)
  'ex-4am-muadalat-x-murabba-l5-001:q2': C('B'),                                               // x² − 7 = 0 ⇔ x² = 7 : ±√7
  // amaliyat-judhur — العمليات على الجذور التربيعية (الوحدة 2، الدرس 4)
  // Racines de carrés parfaits recalculées par Math.sqrt ; décimaux et quotients en fractions exactes (frac).
  'ex-4am-amaliyat-judhur-l1-001:q1': R(Math.sqrt(4) * Math.sqrt(36)),                     // نشاط 4 : √4 × √36
  'ex-4am-amaliyat-judhur-l1-001:q2': R(frac(Math.sqrt(16) * Math.sqrt(49), 10)),          // √(0,16 × 49) = (4/10) × 7
  'ex-4am-amaliyat-judhur-l1-002:q1': R(Math.sqrt(36) / Math.sqrt(4)),                     // √36 / √4
  'ex-4am-amaliyat-judhur-l1-002:q2': R(frac(Math.sqrt(25), Math.sqrt(100))),              // √(25/100)
  'ex-4am-amaliyat-judhur-l2-001:q1': R(Math.sqrt(9) * Math.sqrt(81)),                     // تمرين 15
  'ex-4am-amaliyat-judhur-l2-001:q2': R(Math.sqrt(121) * Math.sqrt(100)),
  'ex-4am-amaliyat-judhur-l2-001:q3': R(Math.sqrt(16) * Math.sqrt(900)),
  'ex-4am-amaliyat-judhur-l2-001:q4': R(frac(Math.sqrt(144) * Math.sqrt(25), 10 * 10)),    // √1,44 × √0,25 = (12/10)(5/10)
  'ex-4am-amaliyat-judhur-l2-002:q1': R(Math.sqrt(16 + 9)),                                // نشاط 4 : √(16 + 9)
  'ex-4am-amaliyat-judhur-l2-002:q2': R(Math.sqrt(16) + Math.sqrt(9)),                     // √16 + √9
  'ex-4am-amaliyat-judhur-l2-002:q3': C('B'), // « خطأ » : √(16 + 9) = 5 ≠ 7 = √16 + √9
  'ex-4am-amaliyat-judhur-l3-001:q1': R(Math.sqrt(2 * 50)),                                // تمرين 17
  'ex-4am-amaliyat-judhur-l3-001:q2': R(Math.sqrt(32 * 2)),
  'ex-4am-amaliyat-judhur-l3-001:q3': R(Math.sqrt(3 * 48)),
  'ex-4am-amaliyat-judhur-l3-001:q4': R(Math.sqrt(125 * 5)),
  'ex-4am-amaliyat-judhur-l3-002:q1': R(frac(Math.sqrt(49), Math.sqrt(16))),               // تمرين 20
  'ex-4am-amaliyat-judhur-l3-002:q2': R(frac(Math.sqrt(36), Math.sqrt(81))),
  'ex-4am-amaliyat-judhur-l3-002:q3': R(frac(Math.sqrt(12100), Math.sqrt(900))),
  'ex-4am-amaliyat-judhur-l3-002:q4': R(frac(Math.sqrt(4900), Math.sqrt(32400))),
  'ex-4am-amaliyat-judhur-l4-001:q1': R(frac(1, Math.sqrt(18 / 2))),                      // تمرين 21 : √(2/18) = 1/√9
  'ex-4am-amaliyat-judhur-l4-001:q2': R(frac(1, Math.sqrt(48 / 3))),                       // √(3/48) = 1/√16
  'ex-4am-amaliyat-judhur-l4-001:q3': R(frac(Math.sqrt(6875 / gcd(6875, 1100)), Math.sqrt(1100 / gcd(6875, 1100)))), // √(25/4)
  'ex-4am-amaliyat-judhur-l4-001:q4': R(frac(1, Math.sqrt(448 / 7))),                      // √(7/448) = 1/√64
  'ex-4am-amaliyat-judhur-l4-002:q1': R(frac(Math.sqrt(81) * Math.sqrt(1), 10 * 100)),     // تمرين 16 : √0,81 × √0,0001 = (9/10)(1/100)
  'ex-4am-amaliyat-judhur-l4-002:q2': R(frac(Math.sqrt(576) * Math.sqrt(144), 10 * 100)),  // √5,76 × √0,0144 = (24/10)(12/100)
  'ex-4am-amaliyat-judhur-l5-001:q1': C('C'), // √(a + b) = √a + √b ⇔ 2√a√b = 0 ⇔ a = 0 ou b = 0 (a = b = 1 : √2 ≠ 2)
  'ex-4am-amaliyat-judhur-l5-001:q2': C('B'), // (−9) × (−4) = 36, √36 = 6 (positif) ; la racine d'un produit positif existe
  'ex-4am-amaliyat-judhur-l5-001:q3': C('B'), // 63 = 3² × 7 → 3√7 ; 9√7 = √567, 7√3 = √147
  'ex-4am-amaliyat-judhur-l5-001:q4': C('C'), // √(7/36) = √7 / 6 ; 7/6 = √(49/36), √7/36 = √(7/1296)
  'ex-4am-amaliyat-judhur-l5-002:q1': R(frac(...add([1, 1], [1, 4]))),                     // تمرين 33 : ED² = 1² + (1/2)²
  'ex-4am-amaliyat-judhur-l5-002:q2': C('C'), // ED = √(5/4) = √5/2 ; 3/2 = √1 + √(1/4) (faux), 5/4 = ED² (racine oubliée)
  'ex-4am-amaliyat-judhur-l5-002:q3': C('A'), // AB = AE + EB = 1/2 + √5/2 ; √6/2 = √(1 + 5)/2 faux ; 1 + √5/2 prend AD pour AE
  // tawzif-khawass-judhur — each key recomputed from the mathematics
  // √(a²b) = a√b : n under the root after bringing the coefficient in
  'ex-4am-tawzif-khawass-judhur-l1-002:q1': R(4 * 4 * 3),                      // 4√3 = √(4² × 3)
  'ex-4am-tawzif-khawass-judhur-l1-002:q2': R(2 * 2 * 7),                      // 2√7 = √(2² × 7)
  // largest square dividing 18 is 9 = 3² → √18 = 3√2 ; A = (1·2 − 3·3 + 2·5 − 7)√2
  'ex-4am-tawzif-khawass-judhur-l2-001:q1': R(Math.max(...range(1, 18).filter((a) => 18 % (a * a) === 0))),
  'ex-4am-tawzif-khawass-judhur-l2-001:q2': R(1 * Math.sqrt(8 / 2) - 3 * Math.sqrt(18 / 2) + 2 * Math.sqrt(50 / 2) - 7),
  // B = √250 − √490 + 2√81 = 2·9 + (5 − 7)√10, c = 250 ÷ 5²
  'ex-4am-tawzif-khawass-judhur-l3-001:q1': R(2 * Math.sqrt(81)),
  'ex-4am-tawzif-khawass-judhur-l3-001:q2': R(Math.sqrt(250 / 10) - Math.sqrt(490 / 10)),
  'ex-4am-tawzif-khawass-judhur-l3-001:q3': R(250 / Math.max(...range(1, 15).filter((a) => 250 % (a * a) === 0)) ** 2),
  // A = 2√12 − 4√3 + √75 − √147 = (2·2 − 4 + 5 − 7)√3
  'ex-4am-tawzif-khawass-judhur-l3-002:q1': R(2 * Math.sqrt(12 / 3) - 4 + Math.sqrt(75 / 3) - Math.sqrt(147 / 3)),
  // √(50/3) × √2 × √12 = √(50 × 2 × 12 / 3) = √400 ; 3√8 × √2 = 3√16
  'ex-4am-tawzif-khawass-judhur-l4-001:q1': R(Math.sqrt((50 * 2 * 12) / 3)),
  'ex-4am-tawzif-khawass-judhur-l4-001:q2': R(3 * Math.sqrt(8 * 2)),
  // A = 7 + 4√2, B = 7 − 4√2 : A + B = 14, A × B = 7² − 2 × 4²
  'ex-4am-tawzif-khawass-judhur-l4-002:q1': R(7 + 7),
  'ex-4am-tawzif-khawass-judhur-l4-002:q2': R(7 * 7 - 4 * 4 * 2),
  // A/B = (7 + 4√2)²/17 = (81 + 56√2)/17 ≈ 9.4233 — only choice B has that value
  'ex-4am-tawzif-khawass-judhur-l4-002:q3': C('B'),
  // √8/a = −3√15/√3 ⇒ a = −√8/(3√5) = −2√10/15 (choice B) ; (2√3 − 6)/√6 = √2 − √6 (choice A)
  'ex-4am-tawzif-khawass-judhur-l5-001:q1': C('B'),
  'ex-4am-tawzif-khawass-judhur-l5-001:q2': C('A'),
  // x² = 3 + √27 = 3 + 3√3, y² = −3 + √12 = −3 + 2√3, z² = √75 = 5√3
  'ex-4am-tawzif-khawass-judhur-l5-002:q1': R(Math.sqrt(27 / 3)),
  'ex-4am-tawzif-khawass-judhur-l5-002:q2': R(Math.sqrt(12 / 3)),
  'ex-4am-tawzif-khawass-judhur-l5-002:q3': R(Math.sqrt(75 / 3)),
  // ── Unité 2 — banques de pratique à 50 exercices (2026-09-30) ──
  // jidhr-tarbii — banc généré (round 2) : 40 exercices l{1..5}-003 … -010. √n recalculé par balayage (x ≥ 0, x² = n),
  // √ d'un décimal = √(entier) / √(10^2k) ; (√a)² = a ; √(a²) = |a|.
  // Clés existantes (l*-001, l*-002) inchangées : seuls des misconceptionId ont été ajoutés à des distracteurs
  // (l2-002, l4-001, l4-002, l5-001) — mêmes choix justes.
  // — niveau 1
  'ex-4am-jidhr-tarbii-l1-003:q1': C('C'),                                       // 7 ≥ 0 et 7² = 49 ; 24,5 = 49/2, −7 < 0, 2401 = 49²
  'ex-4am-jidhr-tarbii-l1-004:q1': C('B'),                                       // « الجذر التربيعي للعدد 11 » s'écrit √11 (11² est le carré, 11/2 la moitié)
  'ex-4am-jidhr-tarbii-l1-004:q2': C('C'),                                       // √0,6 se lit « الجذر التربيعي للعدد 0,6 »
  'ex-4am-jidhr-tarbii-l1-005:q1': C('B'),                                       // (−4)² = 16 mais −4 < 0 : √16 = 4 ; A oublie la positivité, C faux ((−4)² = 16 ≠ −16)
  'ex-4am-jidhr-tarbii-l1-006:q1': R(range(0, 64).find((x) => x * x === 64)),
  'ex-4am-jidhr-tarbii-l1-006:q2': R(range(0, 121).find((x) => x * x === 121)),
  'ex-4am-jidhr-tarbii-l1-007:q1': R(19),                                        // (√a)² = a, a = 19
  'ex-4am-jidhr-tarbii-l1-007:q2': R(range(0, 23 * 23).find((x) => x * x === 23 * 23)),
  'ex-4am-jidhr-tarbii-l1-008:q1': C('C'),                                       // aucun x avec x² = −9 (x² ≥ 0) : √−9 n'a pas de sens
  'ex-4am-jidhr-tarbii-l1-009:q1': R(range(0, 1).find((x) => x * x === 0)),
  'ex-4am-jidhr-tarbii-l1-009:q2': R(range(0, 1).find((x) => x * x === 1)),
  'ex-4am-jidhr-tarbii-l1-010:q1': R(range(0, 81).find((x) => x * x === 81)),    // côté du carré d'aire 81
  // — niveau 2
  'ex-4am-jidhr-tarbii-l2-003:q1': R(frac(range(0, 36).find((x) => x * x === 36), 10)),        // √0,36 = √36 / √100
  'ex-4am-jidhr-tarbii-l2-003:q2': R(frac(range(0, 25).find((x) => x * x === 25), 100)),       // √0,0025 = √25 / √10000
  'ex-4am-jidhr-tarbii-l2-004:q1': R(frac(range(0, 49).find((x) => x * x === 49), range(0, 64).find((x) => x * x === 64))),
  'ex-4am-jidhr-tarbii-l2-004:q2': R(frac(1, range(0, 100).find((x) => x * x === 100))),
  'ex-4am-jidhr-tarbii-l2-005:q1': R(range(0, 40000).find((x) => x * x === 40000)),
  'ex-4am-jidhr-tarbii-l2-005:q2': C('B'),                                       // (10⁶)² = 10¹² et 10⁶ > 0 ; (10¹⁰)² = 10²⁰, (10²⁴)² = 10⁴⁸, (5·10¹²)² ≠ 10¹²
  'ex-4am-jidhr-tarbii-l2-006:q1': R(frac(27, 10)),                              // (√2,7)² = 2,7
  'ex-4am-jidhr-tarbii-l2-006:q2': R(frac(3, 11)),                               // (√(3/11))² = 3/11
  'ex-4am-jidhr-tarbii-l2-007:q1': R(frac(range(0, 169).find((x) => x * x === 13 * 13), 10)),  // √(1,3²) = √169 / √100
  'ex-4am-jidhr-tarbii-l2-007:q2': R(range(0, 36).find((x) => x * x === (-6) * (-6))),
  'ex-4am-jidhr-tarbii-l2-008:q1': R(frac(13 * 13, 100)),                        // 1,3² = 1,69
  'ex-4am-jidhr-tarbii-l2-008:q2': R(frac(range(0, 16).find((x) => x * x === 16), 10)),        // √0,16 = √16 / √100
  'ex-4am-jidhr-tarbii-l2-009:q1': C('C'),                                       // 0,3² = 9/100 ≠ 90/100 : √0,9 ≠ 0,3 ; A et B faux, D : √0,9 ≠ 0,45 (0,45² = 0,2025)
  'ex-4am-jidhr-tarbii-l2-010:q1': C('C'),                                       // valeur exacte √7 ; 2,645751311² ≠ 7, 2,65² = 7,0225, 3,5² = 12,25
  // — niveau 3
  'ex-4am-jidhr-tarbii-l3-003:q1': R(frac(15 * 15, 100)),                        // a = 1,5² = 225/100
  'ex-4am-jidhr-tarbii-l3-003:q2': R(frac(2 * 2, 5 * 5)),                        // b = (2/5)²
  'ex-4am-jidhr-tarbii-l3-004:q1': R(range(0, 100).find((x) => x * x === 6 * 6 + 8 * 8)),
  'ex-4am-jidhr-tarbii-l3-004:q2': R(range(0, 25).find((x) => x * x === 13 * 13 - 12 * 12)),
  'ex-4am-jidhr-tarbii-l3-005:q1': R(5 + range(0, 9).find((x) => x * x === (-3) * (-3))),       // (√5)² + √((−3)²)
  'ex-4am-jidhr-tarbii-l3-005:q2': R(2 * 7 - range(0, 16).find((x) => x * x === 4 * 4)),         // 2(√7)² − √(4²)
  'ex-4am-jidhr-tarbii-l3-006:q1': R((-1) * (-1) * 6),                           // (−√6)² = (−1)²(√6)²
  'ex-4am-jidhr-tarbii-l3-006:q2': R(-6),                                        // −(√6)²
  'ex-4am-jidhr-tarbii-l3-007:q1': R(30),                                        // aire = (√30)²
  'ex-4am-jidhr-tarbii-l3-007:q2': R(2 * 2 * 30),                                // (2√30)² = 2² × (√30)²
  'ex-4am-jidhr-tarbii-l3-008:q1': C('D'),                                       // −4² = −16 < 0 ; √0, √((−4)²) = √16, √(−(−2)) = √2 ont un sens
  'ex-4am-jidhr-tarbii-l3-009:q1': R(frac(range(0, 9).find((x) => x * x === 9) + 10 * range(0, 4).find((x) => x * x === 4), 100)), // 3/100 + 2/10
  'ex-4am-jidhr-tarbii-l3-010:q1': C('B'),                                       // 1,732² = 2,999824 ≠ 3 : valeur approchée seulement
  'ex-4am-jidhr-tarbii-l3-010:q2': C('C'),                                       // (√3)² = 3 exactement
  // — niveau 4
  'ex-4am-jidhr-tarbii-l4-003:q1': C('C'),                                       // √((−7)²) = √49 = 7 ; B faux ((−7)² = 49), D faux (√49 ≠ 49)
  'ex-4am-jidhr-tarbii-l4-004:q1': C('B'),                                       // 5 > 4 ⇒ √5 > 2 ⇒ 2 − √5 < 0 ⇒ √((2 − √5)²) = √5 − 2
  'ex-4am-jidhr-tarbii-l4-004:q2': R(4),                                         // 10 < 16 ⇒ √10 < 4 ⇒ (4 − √10) + √10 = 4
  'ex-4am-jidhr-tarbii-l4-005:q1': C('D'),                                       // 0,7 ≥ 0 et 0,7² = 0,49 ; 0,49/2 = 0,245, 0,07² = 0,0049, √ jamais négatif
  'ex-4am-jidhr-tarbii-l4-006:q1': C('B'),                                       // 0,4² = 16/100 : seule (2) ; 1,6 = 160/100, 0,016 = 1,6/100
  'ex-4am-jidhr-tarbii-l4-007:q1': R(frac(3 * 2 * 10 - 4 * 10 + 5, 10)),        // 3(√2)² − √((−4)²) + (√0,5)² = 6 − 4 + 0,5
  'ex-4am-jidhr-tarbii-l4-008:q1': C('B'),                                       // x ≥ 0 : √((3x)²) = 3x, (√x)² = x ⇒ 4x
  'ex-4am-jidhr-tarbii-l4-008:q2': R(2),                                         // √(9y⁴) = 3y² (≥ 0) ⇒ 3y² + 2 − 3y² = 2
  'ex-4am-jidhr-tarbii-l4-009:q1': R(6 * 6),
  'ex-4am-jidhr-tarbii-l4-009:q2': R(range(0, 49).find((x) => x * x === 6 * 6 + 13)),
  'ex-4am-jidhr-tarbii-l4-010:q1': C('C'),                                       // un seul nombre positif de carré 36 : 6 ; B faux ((−6)² = 36), D faux (18² = 324)
  // — niveau 5
  'ex-4am-jidhr-tarbii-l5-003:q1': R(frac(45 * 100, 125)),                       // aire de base = 45 ÷ 1,25
  'ex-4am-jidhr-tarbii-l5-003:q2': R(range(0, 36).find((x) => x * x === 45 * 100 / 125)),
  'ex-4am-jidhr-tarbii-l5-004:q1': C('D'),                                       // BC² = 1 + 9 = 10, 10 n'est pas un carré d'entier : BC = √10
  'ex-4am-jidhr-tarbii-l5-004:q2': R(range(0, 225).find((x) => x * x === 9 * 9 + 12 * 12)),
  'ex-4am-jidhr-tarbii-l5-005:q1': C('B'),                                       // 1414213562² = 1999999998944727844 ≠ 2 × 10¹⁸ : longueur exacte √2
  'ex-4am-jidhr-tarbii-l5-005:q2': C('B'),                                       // diagonale² = 1² + 1² = 2 ⇒ √2 (2² = 4, 1² = 1)
  'ex-4am-jidhr-tarbii-l5-006:q1': R(5 + 11),                                    // BC² = (√5)² + (√11)²
  'ex-4am-jidhr-tarbii-l5-006:q2': R(range(0, 16).find((x) => x * x === 5 + 11)),
  'ex-4am-jidhr-tarbii-l5-007:q1': R(frac(range(0, 2025).find((x) => x * x === 2025), 10)),    // √20,25 = √2025 / √100
  'ex-4am-jidhr-tarbii-l5-007:q2': R(4 * range(0, 2025).find((x) => x * x === 2025) / 10),      // périmètre = 4 × côté
  'ex-4am-jidhr-tarbii-l5-008:q1': R(6 * 6 / 2),                                 // 2·AB² = AC² = 36
  'ex-4am-jidhr-tarbii-l5-008:q2': C('C'),                                       // AB² = 18, aucun entier de carré 18 (3² = 9, 9² = 81) : AB = √18
  'ex-4am-jidhr-tarbii-l5-009:q1': C('B'),                                       // 3 < 4 ⇒ √3 < 2 ⇒ √3 − 2 < 0
  'ex-4am-jidhr-tarbii-l5-009:q2': R(2 + 1),                                     // (2 − √3) + (√3 + 1) = 3
  'ex-4am-jidhr-tarbii-l5-010:q1': R(range(0, 9).find((x) => x * x === 45 / 5)),
  'ex-4am-jidhr-tarbii-l5-010:q2': R(frac(range(0, 25).find((x) => x * x === 125 / 5), 10)),  // 1,25/5 = 0,25 ; √0,25 = √25 / √100
  // natiqa-ghayr-natiqa — banc généré (round 2, 2026-09-30) : 40 exercices l{1..5}-003…010.
  // Aucune clé existante n'a changé (seuls des misconceptionId ont été ajoutés aux distracteurs
  // de l1-001 q2 B, l2-001 q2 C, l5-001 q1 B/C).
  // Conventions : un carré parfait se teste par balayage entier (range(...).some(k => k*k === n)) ;
  // n/d (irréductible ou non) est le carré d'un rationnel ⇔ n·d est un carré parfait ;
  // à la précision 1/p, la valeur par défaut de √n est k/p avec k le plus grand entier tel que
  // k² ≤ n·p² ; par excès k + 1 ; l'arrondi compare (2k+1)² à 4·n·p² (tout en entiers).
  'ex-4am-natiqa-ghayr-natiqa-l1-003:q1': C(['A', 'B', 'C', 'D'][[12, 20, 36, 50].findIndex((n) => range(0, n).some((k) => k * k === n))]),
  'ex-4am-natiqa-ghayr-natiqa-l1-004:q1': C(['A', 'B', 'C', 'D'][[[144, 100], [36, 100], [4, 25], [11, 1]].findIndex(([n, d]) => !range(0, n * d).some((k) => k * k === n * d))]), // seul 11 n'est pas le carré d'un rationnel
  'ex-4am-natiqa-ghayr-natiqa-l1-005:q1': C(7 * 7 === 49 ? 'A' : 'B'), // 0,7² = 0,49 : rationnel (B = « décimal donc irrationnel », C = 0,07² = 0,0049)
  'ex-4am-natiqa-ghayr-natiqa-l1-006:q1': R(frac(range(1, 49).find((k) => k * k === 49), range(1, 64).find((k) => k * k === 64))),
  'ex-4am-natiqa-ghayr-natiqa-l1-006:q2': R(frac(range(1, 81).find((k) => k * k === 81), 10)), // 0,81 = 81/100
  'ex-4am-natiqa-ghayr-natiqa-l1-007:q1': C(range(0, 3).some((k) => k * k === 3) ? 'B' : 'A'), // 3 non carré → affichage = valeur approchée
  'ex-4am-natiqa-ghayr-natiqa-l1-008:q1': C(range(0, 25).some((k) => k * k === 25) && !range(0, 26).some((k) => k * k === 26) ? 'A' : 'B'),
  'ex-4am-natiqa-ghayr-natiqa-l1-009:q1': R(range(0, 30).filter((k) => k * k <= 30).at(-1)),
  'ex-4am-natiqa-ghayr-natiqa-l1-010:q1': S([4, 8, 16, 32, 64, 128].filter((n) => range(0, n).some((k) => k * k === n))),
  'ex-4am-natiqa-ghayr-natiqa-l2-003:q1': R(frac(range(0, 121).find((k) => k * k === 121), 10)), // 1,21 = 121/100
  'ex-4am-natiqa-ghayr-natiqa-l2-003:q2': R(frac(range(0, 225).find((k) => k * k === 225), 10)), // 2,25 = 225/100
  'ex-4am-natiqa-ghayr-natiqa-l2-004:q1': R(range(1, 9).filter((n) => range(0, n).some((k) => k * k === n)).length),
  'ex-4am-natiqa-ghayr-natiqa-l2-005:q1': R(frac(range(0, 100).filter((k) => k * k <= 5 * 100).at(-1), 10)),         // par défaut à 0,1
  'ex-4am-natiqa-ghayr-natiqa-l2-006:q1': C(['A', 'B', 'C'][[44, 45, 100].indexOf(range(0, 100).filter((k) => k * k <= 20 * 100).at(-1) + 1)]), // dixièmes ×10 : 4,4 · 4,5 · 10 ; par excès = k + 1
  'ex-4am-natiqa-ghayr-natiqa-l2-007:q1': C(frac(range(1, 36).find((k) => k * k === 36), range(1, 49).find((k) => k * k === 49)) === '6/7' ? 'A' : 'C'),
  'ex-4am-natiqa-ghayr-natiqa-l2-008:q1': R(frac(range(1, 9).find((k) => k * k === 9), range(1, 16).find((k) => k * k === 16))),
  'ex-4am-natiqa-ghayr-natiqa-l2-009:q1': C(range(0, 7).some((k) => k * k === 7) ? 'B' : 'A'), // 7 non carré : valeur exacte √7, les décimaux sont approchés
  'ex-4am-natiqa-ghayr-natiqa-l2-010:q1': C(!range(0, 25 * 13).some((k) => k * k === 25 * 13) ? 'A' : 'B'), // 25·13 = 325 non carré
  'ex-4am-natiqa-ghayr-natiqa-l3-003:q1': R(frac(3 * 3, 7 * 7)),
  'ex-4am-natiqa-ghayr-natiqa-l3-003:q2': R(frac(12 * 12, 100)),
  'ex-4am-natiqa-ghayr-natiqa-l3-004:q1': C(['A', 'B', 'C', 'D'][[[4, 100], [4, 10], [4, 9], [4, 10000]].findIndex(([n, d]) => !range(0, n * d).some((k) => k * k === n * d))]), // 0,4 = 4/10 → 40 non carré
  'ex-4am-natiqa-ghayr-natiqa-l3-005:q1': R((() => { const g = gcd(8, 18); const n = 8 / g; const d = 18 / g; return frac(range(1, n).find((k) => k * k === n), range(1, d).find((k) => k * k === d)); })()),
  'ex-4am-natiqa-ghayr-natiqa-l3-006:q1': S(range(50, 100).filter((n) => range(0, n).some((k) => k * k === n))),
  'ex-4am-natiqa-ghayr-natiqa-l3-007:q1': R([[16, 100], [16, 10], [16, 1], [160, 1], [1600, 1]].filter(([n, d]) => range(0, n * d).some((k) => k * k === n * d)).length),
  'ex-4am-natiqa-ghayr-natiqa-l3-008:q1': C(range(0, 1225 * 100).some((k) => k * k === 1225 * 100) && !range(0, 1225 * 1000).some((k) => k * k === 1225 * 1000) ? 'A' : 'B'), // 12,25 = 1225/100 ; 1,225 = 1225/1000
  'ex-4am-natiqa-ghayr-natiqa-l3-009:q1': R(frac(range(0, 100).filter((k) => k * k <= 40 * 100).at(-1) + 1, 10)),    // par excès à 0,1
  'ex-4am-natiqa-ghayr-natiqa-l3-010:q1': R(frac((() => { const k = range(0, 100).filter((j) => j * j <= 5000).at(-1); return (2 * k + 1) * (2 * k + 1) <= 4 * 5000 ? k + 1 : k; })(), 100)), // 0,5·100² = 5000
  'ex-4am-natiqa-ghayr-natiqa-l4-003:q1': C(frac(range(1, 1).find((k) => k * k === 1), range(1, 9).find((k) => k * k === 9)) === '1/3' ? 'A' : 'B'), // (1/3)² = 1/9 : Amine a tort
  'ex-4am-natiqa-ghayr-natiqa-l4-004:q1': C(3 * 3 !== 90 && !range(0, 90).some((k) => k * k === 9 * 10) ? 'A' : 'B'), // 0,3² = 0,09 ≠ 0,9 ; 9/10 → 90 non carré
  'ex-4am-natiqa-ghayr-natiqa-l4-005:q1': C(range(0, 50 * 8).some((k) => k * k === 50 * 8) ? 'A' : 'C'), // 50·8 = 400 = 20² → rationnel (= 5/2, pas 25/4)
  'ex-4am-natiqa-ghayr-natiqa-l4-006:q1': C(!range(0, 3 * 3 + 1 * 1).some((k) => k * k === 3 * 3 + 1 * 1) ? 'A' : 'B'), // d² = 10 non carré
  'ex-4am-natiqa-ghayr-natiqa-l4-006:q2': R(frac(range(0, 1000).filter((k) => k * k <= (3 * 3 + 1 * 1) * 10000).at(-1), 100)), // par défaut à 0,01
  'ex-4am-natiqa-ghayr-natiqa-l4-007:q1': S(range(1, 20).filter((n) => range(0, 2 * n).some((k) => k * k === 2 * n))),
  'ex-4am-natiqa-ghayr-natiqa-l4-008:q1': C(range(0, 100).filter((k) => k * k <= 7 * 100).at(-1) === 26 ? 'A' : 'B'), // 2,6 est la valeur PAR DÉFAUT → Yassine a tort
  'ex-4am-natiqa-ghayr-natiqa-l4-009:q1': R(frac((() => { const k = range(0, 100).filter((j) => j * j <= 42 * 100).at(-1); return (2 * k + 1) * (2 * k + 1) <= 4 * 42 * 100 ? k + 1 : k; })(), 10)),
  'ex-4am-natiqa-ghayr-natiqa-l4-009:q2': R(frac((() => { const k = range(0, 1000).filter((j) => j * j <= 42 * 10000).at(-1); return (2 * k + 1) * (2 * k + 1) <= 4 * 42 * 10000 ? k + 1 : k; })(), 100)),
  'ex-4am-natiqa-ghayr-natiqa-l4-010:q1': C(['A', 'B', 'C'][[3 * 3 + 4 * 4, 1 + 2 * 2, 2 * 2 + 2 * 2].findIndex((n) => range(0, n).some((k) => k * k === n))]),
  'ex-4am-natiqa-ghayr-natiqa-l5-003:q1': R(frac(range(0, 2025).find((k) => k * k === 2025), 10)),  // 20,25 = 2025/100
  'ex-4am-natiqa-ghayr-natiqa-l5-003:q2': R(range(0, 2025).find((k) => k * k === 2025) / 5),        // 4,5 ÷ 0,5 = 45 ÷ 5
  'ex-4am-natiqa-ghayr-natiqa-l5-004:q1': R(frac(range(0, 100).filter((k) => k * k <= 50 * 100).at(-1) + 1, 10)),    // par excès à 0,1
  'ex-4am-natiqa-ghayr-natiqa-l5-004:q2': R(frac(4 * (range(0, 100).filter((k) => k * k <= 50 * 100).at(-1) + 1), 10)),
  'ex-4am-natiqa-ghayr-natiqa-l5-005:q1': C(range(0, 5 * 5 + 12 * 12).find((k) => k * k === 5 * 5 + 12 * 12) === 13 ? 'A' : 'C'),
  'ex-4am-natiqa-ghayr-natiqa-l5-005:q2': C(!range(0, 4 * 4 + 6 * 6).some((k) => k * k === 4 * 4 + 6 * 6) ? 'A' : 'B'), // 52 non carré
  'ex-4am-natiqa-ghayr-natiqa-l5-006:q1': R(range(0, 18 / 2).find((k) => k * k === 18 / 2)),
  'ex-4am-natiqa-ghayr-natiqa-l5-006:q2': R(frac((() => { const n = 24 / 2; const k = range(0, 1000).filter((j) => j * j <= n * 10000).at(-1); return (2 * k + 1) * (2 * k + 1) <= 4 * n * 10000 ? k + 1 : k; })(), 100)),
  'ex-4am-natiqa-ghayr-natiqa-l5-007:q1': C(range(0, 3).some((k) => k * k === 3) ? 'B' : 'A'),
  'ex-4am-natiqa-ghayr-natiqa-l5-007:q2': R(frac(1732 * 1732, 1000000)),
  'ex-4am-natiqa-ghayr-natiqa-l5-008:q1': R(frac(range(0, 2025).find((k) => k * k === 2025), 100)), // 0,2025 = 2025/10000
  'ex-4am-natiqa-ghayr-natiqa-l5-008:q2': R(frac(range(0, 2025).find((k) => k * k === 2025), 8)),  // 45 cm ÷ 8
  'ex-4am-natiqa-ghayr-natiqa-l5-009:q1': R(8 * 8 + 4 * 4),
  'ex-4am-natiqa-ghayr-natiqa-l5-009:q2': R(frac((() => { const n = 8 * 8 + 4 * 4; const k = range(0, 100).filter((j) => j * j <= n * 100).at(-1); return (2 * k + 1) * (2 * k + 1) <= 4 * n * 100 ? k + 1 : k; })(), 10)),
  'ex-4am-natiqa-ghayr-natiqa-l5-010:q1': S([225, 250, 256].filter((n) => range(0, n).some((k) => k * k === n))),
  // muadalat-x-murabba — banque « تدريب » (round 2, 2026-09-30). Les solutions sont CHERCHÉES par
  // balayage d'entiers (k² = n), jamais recopiées ; les décimaux passent par n/100 = (k/10)².
  // Clé modifiée : ex-4am-muadalat-x-murabba-l5-002 (la زربية, `situation`) est REMPLACÉ par un exercice
  // généré (carré d'aire 50) — ses trois anciennes entrées (q1 C, q2 346, q3 693) doivent être SUPPRIMÉES
  // du test et remplacées par les deux lignes l5-002 ci-dessous.
  'ex-4am-muadalat-x-murabba-l1-003:q1': R(range(-100, 100).filter((x) => x * x === 49).length),   // x² = 49 : ±7
  'ex-4am-muadalat-x-murabba-l1-003:q2': R(range(-100, 100).filter((x) => x * x === -49).length),  // aucun carré négatif
  'ex-4am-muadalat-x-murabba-l1-004:q1': C('C'),                                                   // x² = −7 : seule avec a < 0 (A : 0, B : 7, D : 0,7)
  'ex-4am-muadalat-x-murabba-l1-005:q1': C('D'),                                                   // x² = 0 : seule avec a = 0
  'ex-4am-muadalat-x-murabba-l1-006:q1': R((-9) * (-9)),
  'ex-4am-muadalat-x-murabba-l1-006:q2': R(range(-20, 0).find((x) => x * x === 64)),
  'ex-4am-muadalat-x-murabba-l1-007:q1': C('A'),                                                   // x·x ≥ 0 : صحيح
  'ex-4am-muadalat-x-murabba-l1-007:q2': C((-5) * (-5) === 25 ? 'A' : 'B'),                        // (−5)² = 25 : صحيح
  'ex-4am-muadalat-x-murabba-l1-008:q1': C('A'),                                                   // 11 > 0 : ±√11 (5,5² = 30,25 ≠ 11)
  'ex-4am-muadalat-x-murabba-l1-009:q1': R(range(0, 100).find((x) => x * x - 81 === 0)),
  'ex-4am-muadalat-x-murabba-l1-009:q2': C('C'),                                                   // x² = −4 : aucune solution
  'ex-4am-muadalat-x-murabba-l1-010:q1': C('B'),                                                   // x² − 6 = 0 ⇔ x² = 6
  'ex-4am-muadalat-x-murabba-l1-010:q2': C('C'),                                                   // −√6 (3² = 9 ≠ 6, 36² ≠ 6)
  'ex-4am-muadalat-x-murabba-l2-003:q1': R(range(0, 100).find((x) => x * x === 144)),
  'ex-4am-muadalat-x-murabba-l2-003:q2': R(-range(0, 100).find((k) => k * k === 9) / 10),         // 0,09 = (k/10)², k² = 9
  'ex-4am-muadalat-x-murabba-l2-004:q1': R(frac(-range(0, 20).find((k) => k * k === 49), range(1, 20).find((k) => k * k === 64))),
  'ex-4am-muadalat-x-murabba-l2-004:q2': R(range(0, 100).find((k) => k * k === 121) / 10),        // 1,21 = 121/100
  'ex-4am-muadalat-x-murabba-l2-005:q1': C('B'),                                                   // x² = 0 : seul 0
  'ex-4am-muadalat-x-murabba-l2-005:q2': C('B'),                                                   // 0,5 > 0 : ±√0,5 (0,25² = 0,0625)
  'ex-4am-muadalat-x-murabba-l2-006:q1': C('C'),                                                   // −√13 (opposé)
  'ex-4am-muadalat-x-murabba-l2-006:q2': R(13),                                                    // (−√13)² = (√13)² = 13 (définition de √)
  'ex-4am-muadalat-x-murabba-l2-007:q1': R(range(0, 100).find((k) => k * k === 225) / 10),        // 2,25 = 225/100
  'ex-4am-muadalat-x-murabba-l2-007:q2': R(range(-1000, 1000).filter((x) => x * x === -225).length),
  'ex-4am-muadalat-x-murabba-l2-008:q1': R(range(0, 100).find((x) => x * x - 121 === 0)),
  'ex-4am-muadalat-x-murabba-l2-008:q2': R(range(-100, 0).find((x) => x * x + 5 === 30)),
  'ex-4am-muadalat-x-murabba-l2-009:q1': R(range(0, 100).find((x) => 4 * x * x === 36)),
  'ex-4am-muadalat-x-murabba-l2-009:q2': R(range(-100, 0).find((x) => 5 * x * x === 80)),
  'ex-4am-muadalat-x-murabba-l2-010:q1': C('B'),                                                   // −x² = −16 ⇔ x² = 16 : ±4
  'ex-4am-muadalat-x-murabba-l2-010:q2': C('B'),                                                   // −x² = 16 ⇔ x² = −16 : aucune
  'ex-4am-muadalat-x-murabba-l3-003:q1': R(frac(...mul([5, 3], [5, 3]))),
  'ex-4am-muadalat-x-murabba-l3-003:q2': R(frac(...mul([-4, 10], [-4, 10]))),                                // (−4/10)² = 16/100 = 0,16
  'ex-4am-muadalat-x-murabba-l3-004:q1': C('C'),                                                   // (√10)² = 10
  'ex-4am-muadalat-x-murabba-l3-004:q2': C('D'),                                                   // seul a = −0,01 < 0
  'ex-4am-muadalat-x-murabba-l3-005:q1': R([4, 0, -4, 0.4, -0.04].filter((a) => a > 0).length),
  'ex-4am-muadalat-x-murabba-l3-005:q2': R([4, 0, -4, 0.4, -0.04].map((a) => (a > 0 ? 2 : a === 0 ? 1 : 0)).reduce((s, n) => s + n, 0)),
  'ex-4am-muadalat-x-murabba-l3-006:q1': R(range(-20, 20).find((a) => a - 3 === 0)),
  'ex-4am-muadalat-x-murabba-l3-006:q2': C('C'),                                                   // 5 − a < 0 ⇔ a > 5 (a = 1 : x² = 4 réfute D)
  'ex-4am-muadalat-x-murabba-l3-007:q1': R(range(0, 100).find((x) => 3 * x * x - 12 === 0)),
  'ex-4am-muadalat-x-murabba-l3-007:q2': R(range(-100, 0).find((x) => 7 - x * x === 3)),
  'ex-4am-muadalat-x-murabba-l3-008:q1': R(range(0, 100).find((x) => x * x / 2 === 8)),
  'ex-4am-muadalat-x-murabba-l3-008:q2': R(range(-100, 100).filter((x) => 2 * x * x + 7 === 7).length),
  'ex-4am-muadalat-x-murabba-l3-009:q1': C('C'),                                                   // x² = 2 − 9 = −7 < 0
  'ex-4am-muadalat-x-murabba-l3-009:q2': C('B'),                                                   // 2x² = 18, x² = 9 : ±3 (vérif. 5 − 18 = −13)
  'ex-4am-muadalat-x-murabba-l3-010:q1': R(range(0, 100).find((x) => (2 * x) ** 2 === 36)),
  'ex-4am-muadalat-x-murabba-l3-010:q2': R(range(-100, 0).find((x) => x * x === 9 * 1)),          // (x/3)² = 1 ⇔ x² = 9
  'ex-4am-muadalat-x-murabba-l4-003:q1': C('B'),                                                   // (−8)² = 64 : Amine oublie −8
  'ex-4am-muadalat-x-murabba-l4-004:q1': C('C'),                                                   // (−6)² = 36 ; x² = −36 sans solution
  'ex-4am-muadalat-x-murabba-l4-005:q1': C('B'),                                                   // x² ≥ 0 ⇒ x² + 1 ≥ 1 (A faux : 1 = 1²)
  'ex-4am-muadalat-x-murabba-l4-006:q1': C('B'),                                                   // s = √20, t = −√20 : s + t = 0
  'ex-4am-muadalat-x-murabba-l4-006:q2': R(-20),                                                   // √20 × (−√20) = −(√20)² = −20
  'ex-4am-muadalat-x-murabba-l4-007:q1': C('B'),                                                   // x² − 9 = 16 ⇔ x² = 25
  'ex-4am-muadalat-x-murabba-l4-007:q2': R(range(-100, 0).find((x) => (x - 3) * (x + 3) === 16)),
  'ex-4am-muadalat-x-murabba-l4-008:q1': C('C'),                                                   // x² + 4x = 4x + 10 ⇔ x² = 10
  'ex-4am-muadalat-x-murabba-l4-008:q2': C('B'),                                                   // x(x − 2) + 2x + 9 = x² + 9 = 0 ⇔ x² = −9 : aucune
  'ex-4am-muadalat-x-murabba-l4-009:q1': C('A'),                                                   // 3x² = 32 − 5 = 27 (et non 37)
  'ex-4am-muadalat-x-murabba-l4-009:q2': R(range(0, 100).find((x) => 3 * x * x + 5 === 32)),
  'ex-4am-muadalat-x-murabba-l4-010:q1': C('D'),                                                   // 2x² − 3 = 5 ⇔ x² = 4
  'ex-4am-muadalat-x-murabba-l4-010:q2': R(range(-100, 100).filter((x) => 5 * x * x + 3 === 3).length),
  'ex-4am-muadalat-x-murabba-l5-002:q1': C('B'),                                                   // c² = 50, c > 0 : √50 (25² = 625)
  'ex-4am-muadalat-x-murabba-l5-002:q2': R(Math.round(Math.sqrt(50) * 10) / 10),                   // √50 ≈ 7,071 → 7,1
  'ex-4am-muadalat-x-murabba-l5-003:q1': C('C'),                                                   // 2x² = 6² ⇒ x² = 18, x > 0 : √18
  'ex-4am-muadalat-x-murabba-l5-003:q2': R((6 * 6 / 2) / 2),                                       // aire = x²/2 avec x² = 36/2
  'ex-4am-muadalat-x-murabba-l5-004:q1': R(range(0, 100).find((r) => r * r === 49)),
  'ex-4am-muadalat-x-murabba-l5-004:q2': C('B'),                                                   // r² = 20, r > 0 : √20 (10² = 100)
  'ex-4am-muadalat-x-murabba-l5-005:q1': R(32 / 2),
  'ex-4am-muadalat-x-murabba-l5-005:q2': R(range(0, 100).find((c) => c * c * 2 === 32)),
  'ex-4am-muadalat-x-murabba-l5-006:q1': C('C'),                                                   // x² = 3 − 7 = −4 < 0
  'ex-4am-muadalat-x-murabba-l5-006:q2': R(range(-100, 0).find((x) => x * x - 5 === 44)),
  'ex-4am-muadalat-x-murabba-l5-007:q1': C('C'),                                                   // 3ℓ·ℓ = 75 ⇔ ℓ² = 25
  'ex-4am-muadalat-x-murabba-l5-007:q2': R(2 * (range(0, 100).find((l) => 3 * l * l === 75) * 4)), // 2(3ℓ + ℓ) = 8ℓ
  'ex-4am-muadalat-x-murabba-l5-008:q1': R(range(0, 100).find((t) => 5 * t * t === 80)),
  'ex-4am-muadalat-x-murabba-l5-008:q2': R(range(0, 100).find((t) => 5 * t * t === 45)),
  'ex-4am-muadalat-x-murabba-l5-009:q1': C('B'),                                                   // (2x+1)² − 4x = 4x² + 1 (x = 1 : 9 − 4 = 5 = 4 + 1)
  'ex-4am-muadalat-x-murabba-l5-009:q2': R(frac(-range(0, 20).find((k) => k * k === 9), range(1, 20).find((k) => k * k === 4))), // 4x² = 9 ⇔ x² = 9/4
  'ex-4am-muadalat-x-murabba-l5-009:q3': C('C'),                                                   // 4x² + 1 = 0 ⇔ x² = −1/4
  'ex-4am-muadalat-x-murabba-l5-010:q1': R(range(0, 100).find((c) => 6 * c * c === 150)),
  'ex-4am-muadalat-x-murabba-l5-010:q2': R(range(0, 100).find((c) => 6 * c * c === 150) ** 3),
  'ex-4am-muadalat-x-murabba-l5-010:q3': C('C'),                                                   // 6c² = 48 ⇔ c² = 8, c > 0 : √8
  // amaliyat-judhur — banc généré (round 2, 2026-09-30) : 003 → 010 de chaque niveau.
  // Aucune clé existante (001, 002) n'a été modifiée. Racines de carrés parfaits par Math.sqrt,
  // décimaux réécrits en fractions entières (0,09 = 9/100 …) et réduits par frac.
  // — niveau 1
  'ex-4am-amaliyat-judhur-l1-003:q1': C('C'), // √5 × √3 = √(5 × 3) = √15 ; √8 = √(5 + 3) (JIDAA-JAMA) ; 15 = (√15)² ≠ √15
  'ex-4am-amaliyat-judhur-l1-003:q2': R(Math.sqrt(2 * 18)),                                // √(2 × 18) = √36
  'ex-4am-amaliyat-judhur-l1-004:q1': C('B'), // √21 / √7 = √(21/7) = √3 ; √14 = √(21 − 7) ; 3 = 21/7 (racine oubliée, 3² = 9 ≠ 3)
  'ex-4am-amaliyat-judhur-l1-004:q2': R(Math.sqrt(45 / 5)),                                // √(45/5) = √9
  'ex-4am-amaliyat-judhur-l1-005:q1': C('B'), // « خطأ » : √36 + √64 = 6 + 8 = 14 ≠ 10 = √100
  'ex-4am-amaliyat-judhur-l1-005:q2': R(Math.sqrt(36 + 64)),
  'ex-4am-amaliyat-judhur-l1-006:q1': R(frac(Math.sqrt(9) * Math.sqrt(100), Math.sqrt(100))), // √(9/100) × √100 = (3/10) × 10
  'ex-4am-amaliyat-judhur-l1-006:q2': R(frac(Math.sqrt(49) * Math.sqrt(4), Math.sqrt(100))),   // √49 × √(4/100) = 7 × 2/10
  'ex-4am-amaliyat-judhur-l1-007:q1': R(frac(Math.sqrt(81), Math.sqrt(4))),
  'ex-4am-amaliyat-judhur-l1-007:q2': R(frac(Math.sqrt(16), Math.sqrt(121))),
  'ex-4am-amaliyat-judhur-l1-008:q1': R(Math.sqrt(25 - 16)),
  'ex-4am-amaliyat-judhur-l1-008:q2': R(Math.sqrt(25) - Math.sqrt(16)),
  'ex-4am-amaliyat-judhur-l1-008:q3': C('B'), // « خطأ » : √(25 − 16) = 3 ≠ 1 = √25 − √16
  'ex-4am-amaliyat-judhur-l1-009:q1': C('C'), // √(9 × 5) = √9 × √5 = 3√5 ; 9√5 = √405 ; 5√3 = √75
  'ex-4am-amaliyat-judhur-l1-009:q2': R(Math.sqrt((-4) * (-25))),                          // (−4)(−25) = 100 > 0
  'ex-4am-amaliyat-judhur-l1-010:q1': R(frac(Math.sqrt(-49 / -4 * 4), Math.sqrt(4))),      // (−49)/(−4) = 49/4 → 7/2
  'ex-4am-amaliyat-judhur-l1-010:q2': C('A'), // √(−49) et √(−4) n'existent pas : « لا معنى لها » ; 7/2 et −7/2 attribuent un sens
  // — niveau 2
  'ex-4am-amaliyat-judhur-l2-003:q1': R(Math.sqrt(8 * 32)),                                // √256
  'ex-4am-amaliyat-judhur-l2-003:q2': R(frac(Math.sqrt(5 * 45), 10)),                      // √(5/10 × 45/10) = √225 / 10
  'ex-4am-amaliyat-judhur-l2-003:q3': R(Math.sqrt(7 * 63)),                                // √441
  'ex-4am-amaliyat-judhur-l2-004:q1': R(Math.sqrt(300 / 3)),
  'ex-4am-amaliyat-judhur-l2-004:q2': R(Math.sqrt(16 / 1)),                                // 1,6 / 0,1 = 16/1
  'ex-4am-amaliyat-judhur-l2-004:q3': R(frac(Math.sqrt(49), Math.sqrt(25))),               // √(49/100) / √(25/100)
  'ex-4am-amaliyat-judhur-l2-005:q1': C('A'), // 50 = 5² × 2 → 5√2 ; 25√2 = √1250 ; 2√5 = √20
  'ex-4am-amaliyat-judhur-l2-005:q2': C('C'), // 75 = 5² × 3 → 5√3 ; 25√3 = √1875 ; 3√5 = √45
  'ex-4am-amaliyat-judhur-l2-006:q1': R(Math.sqrt(144 + 25)),
  'ex-4am-amaliyat-judhur-l2-006:q2': R(Math.sqrt(144) + Math.sqrt(25)),
  'ex-4am-amaliyat-judhur-l2-006:q3': C('B'), // 13 < 17 ; « = » est la faute JIDHR-JAMA, « > » faux
  'ex-4am-amaliyat-judhur-l2-007:q1': C('B'), // √(5/9) = √5/3 ; 5/3 = √(25/9) ; √5/9 = √(5/81)
  'ex-4am-amaliyat-judhur-l2-007:q2': C('C'), // √(11/49) = √11/7 ; √11/49 = √(11/2401) ; 11/7 = √(121/49)
  'ex-4am-amaliyat-judhur-l2-008:q1': R(frac(Math.sqrt(2 * 8), 10)),                       // √(2/10 × 8/10) = √16 / 10
  'ex-4am-amaliyat-judhur-l2-008:q2': R(Math.sqrt(12 * 30 / 10)),                          // 1,2 × 30 = 36
  'ex-4am-amaliyat-judhur-l2-009:q1': R(Math.sqrt(169 - 25)),
  'ex-4am-amaliyat-judhur-l2-009:q2': C('A'), // √(169 − 25) = 12 ≠ 8 : 1re égalité fausse ; 13 − 5 = 8 est juste (B faux) ; C = TARH
  'ex-4am-amaliyat-judhur-l2-010:q1': R(frac(Math.sqrt(12 / gcd(12, 27)), Math.sqrt(27 / gcd(12, 27)))),   // √(4/9)
  'ex-4am-amaliyat-judhur-l2-010:q2': R(frac(Math.sqrt(200 / gcd(200, 18)), Math.sqrt(18 / gcd(200, 18)))), // √(100/9)
  // — niveau 3
  'ex-4am-amaliyat-judhur-l3-003:q1': R(6 ** 2 / 3),                                      // √(3a) = 6 ⇔ 3a = 36
  'ex-4am-amaliyat-judhur-l3-003:q2': R(10 ** 2 / 5),                                     // √(5a) = 10 ⇔ 5a = 100
  'ex-4am-amaliyat-judhur-l3-004:q1': R(2 * 5 * 3),                                        // 2√3 × 5√3 = 10 (√3)²
  'ex-4am-amaliyat-judhur-l3-004:q2': R(3 * 4 * Math.sqrt(2 * 8)),                         // 12 √16
  'ex-4am-amaliyat-judhur-l3-005:q1': R(frac(Math.sqrt(16 + 9), Math.sqrt(16))),           // √(25/16)
  'ex-4am-amaliyat-judhur-l3-005:q2': R(frac(Math.sqrt(2 * 4 + 1), Math.sqrt(4))),         // √(9/4)
  'ex-4am-amaliyat-judhur-l3-006:q1': C('D'), // √(9 + 0) = 3 = 3 + 0 ; A 5 ≠ 7 ; B √40 ≠ 4 ; C √8 ≠ 4
  'ex-4am-amaliyat-judhur-l3-006:q2': R(Math.sqrt(64) + Math.sqrt(36) - Math.sqrt(64 + 36)),
  'ex-4am-amaliyat-judhur-l3-007:q1': R(3 ** 2 * 5),                                       // x/5 = 9
  'ex-4am-amaliyat-judhur-l3-007:q2': R(72 / 6 ** 2),                                      // 72/x = 36
  'ex-4am-amaliyat-judhur-l3-008:q1': C('B'), // √180 = √(6² × 5) = 6√5 ; 36√5, √27 = √(12 + 15), 5√6 = √150 faux
  'ex-4am-amaliyat-judhur-l3-008:q2': C('C'), // √60 = √(2² × 15) = 2√15 ; 4√15 = √240, 4 = √(6 + 10), 15√2 = √450
  'ex-4am-amaliyat-judhur-l3-009:q1': R(Math.sqrt(81 + 144)),
  'ex-4am-amaliyat-judhur-l3-009:q2': R(Math.sqrt(81) + Math.sqrt(144) - Math.sqrt(81 + 144)),
  'ex-4am-amaliyat-judhur-l3-010:q1': R(Math.sqrt(50 / 2) - Math.sqrt(27 / 3)),
  'ex-4am-amaliyat-judhur-l3-010:q2': R(frac(Math.sqrt(8 / gcd(8, 50)), Math.sqrt(50 / gcd(8, 50)))), // √(4/25)
  // — niveau 4
  'ex-4am-amaliyat-judhur-l4-003:q1': C('A'), // √8 × √2 = √16 = 4 ; 16 oublie la racine ; √10 = √(8 + 2) (JIDAA-JAMA)
  'ex-4am-amaliyat-judhur-l4-003:q2': R(Math.sqrt(5 * 5) + Math.sqrt(20 * 5)),             // √25 + √100
  'ex-4am-amaliyat-judhur-l4-004:q1': C('C'), // un contre-exemple réfute une égalité universelle ; un cas vrai ne prouve rien ; la positivité ne conclut pas
  'ex-4am-amaliyat-judhur-l4-004:q2': R((Math.sqrt(9) + Math.sqrt(16)) ** 2 - (9 + 16)),
  'ex-4am-amaliyat-judhur-l4-005:q1': R(Math.sqrt((7 * 8) / (2 * 7))),                     // √(56/14) = √4
  'ex-4am-amaliyat-judhur-l4-005:q2': R(frac(...add([Math.sqrt(24 / 6), 1], [Math.sqrt(49), Math.sqrt(4)]))), // 2 + 7/2
  'ex-4am-amaliyat-judhur-l4-006:q1': C('D'), // √108 = √(6² × 3) = 6√3 ; 36√3, √24 = √(18 + 6), 3√6 = √54 faux
  'ex-4am-amaliyat-judhur-l4-006:q2': R(3 ** 2 * 2),                                       // (3√2)² = 9 × (√2)²
  'ex-4am-amaliyat-judhur-l4-007:q1': C('C'), // √(100 − 64) = √36 = 6 ; A = TARH ; B : 10 − 8 = 2 est juste
  'ex-4am-amaliyat-judhur-l4-007:q2': R(Math.sqrt(13 ** 2 - 12 ** 2)),
  'ex-4am-amaliyat-judhur-l4-008:q1': C('B'), // √0,16 = 0,4 → 8/0,4 = 20 ; A = 50 faux ; C : √0,16 ≠ 0,04 (0,04² = 0,0016)
  'ex-4am-amaliyat-judhur-l4-008:q2': R(frac(Math.sqrt(36) * 100, Math.sqrt(49) * 10)),    // (6/10) / (7/100)
  'ex-4am-amaliyat-judhur-l4-009:q1': C('C'), // a, b < 0 ⇒ ab > 0 : √(ab) existe ; √a, √b sans sens (A et B faux)
  'ex-4am-amaliyat-judhur-l4-009:q2': R(Math.sqrt((-2) * (-18))),
  'ex-4am-amaliyat-judhur-l4-010:q1': C('B'), // √(50/2) = 5 ; (√50/2)² = 50/4 = 12,5 < 25 ⇒ √50/2 < 5
  'ex-4am-amaliyat-judhur-l4-010:q2': R(Math.sqrt(50 / 2) - Math.sqrt(50 / 2)),            // √50/√2 = √(50/2)
  // — niveau 5
  'ex-4am-amaliyat-judhur-l5-003:q1': R(Math.sqrt(45 * 5)),
  'ex-4am-amaliyat-judhur-l5-003:q2': C('C'), // AC = √(45 + 5) = √50 = 5√2 ; √45 + √5 ≈ 8,94 ; 25√2 ; 50 = AC²
  'ex-4am-amaliyat-judhur-l5-004:q1': R(frac(Math.sqrt(50 / gcd(50, 8)), Math.sqrt(8 / gcd(50, 8)))), // √(25/4)
  'ex-4am-amaliyat-judhur-l5-004:q2': R(Math.sqrt(45 / 5)),                                // 4,5 / 0,5 = 45/5
  'ex-4am-amaliyat-judhur-l5-005:q1': R(Math.sqrt(9 ** 2 + 12 ** 2)),
  'ex-4am-amaliyat-judhur-l5-005:q2': R(Math.sqrt(25 ** 2 - 7 ** 2)),
  'ex-4am-amaliyat-judhur-l5-006:q1': R(3 ** 2 * 2),
  'ex-4am-amaliyat-judhur-l5-006:q2': R(Math.sqrt(2 * (3 ** 2 * 2))),                     // AC² = AB² + BC² = 18 + 18
  'ex-4am-amaliyat-judhur-l5-007:q1': R(Math.sqrt(98 / 2)),
  'ex-4am-amaliyat-judhur-l5-007:q2': R(frac(1, Math.sqrt(45 / 5))),                       // √(5/45) = √(1/9)
  'ex-4am-amaliyat-judhur-l5-007:q3': R(frac(...mul([Math.sqrt(98 / 2), 1], [1, Math.sqrt(45 / 5)]))),
  'ex-4am-amaliyat-judhur-l5-008:q1': C('C'), // arête = √12 = √(2² × 3) = 2√3 ; 4√3 = √48 ; 6 = 12/2 (6² = 36) ; 3√2 = √18
  'ex-4am-amaliyat-judhur-l5-008:q2': C('C'), // diag = √(12 + 12) = √24 = 2√6 ; √12 + √12 = √48 ; 4√6 = √96 ; 6√2 = √72
  'ex-4am-amaliyat-judhur-l5-009:q1': R(Math.sqrt(400 + 225)),
  'ex-4am-amaliyat-judhur-l5-009:q2': C('B'), // √(400 − 225) = √175 = √(5² × 7) = 5√7 ; 5 = √400 − √225 (TARH) ; 25√7 ; 7√5 = √245
  'ex-4am-amaliyat-judhur-l5-010:q1': R(frac(Math.sqrt(45 / gcd(45, 20)), Math.sqrt(20 / gcd(45, 20)))), // √(9/4)
  'ex-4am-amaliyat-judhur-l5-010:q2': R(Math.sqrt(90 / 10)),
  // tawzif-khawass-judhur — round 2 bank (l{1..5}-003 … -010), each key recomputed from the mathematics.
  // Existing keys (l*-001, l*-002) unchanged; only misconceptionId tags were added to some of their distractors.
  // Choice checks: the correct option's numeric value equals the expression; every distractor's value differs.
  // Round-1 choice keys that had no oracle entry (skipped by the test until now):
  // √8 = √(2² × 2) = 2√2 ≈ 2.828 (B) ; 4√2, 2√4 = 4 differ
  'ex-4am-tawzif-khawass-judhur-l1-001:q1': C('B'),
  // √75 = √(5² × 3) = 5√3 ≈ 8.660 (C) ; 25√3, 3√5 ≈ 6.71 differ
  'ex-4am-tawzif-khawass-judhur-l1-001:q2': C('C'),
  // 2/√3 = 2√3/3 ≈ 1.1547 (B) ; 2/3, 2√3/9 differ
  'ex-4am-tawzif-khawass-judhur-l2-002:q1': C('B'),
  // 1/√5 = √5/5 ≈ 0.4472 (A) ; 1/5, √5/25 differ
  'ex-4am-tawzif-khawass-judhur-l2-002:q2': C('A'),
  // ── Level 1
  // √12 = √(2² × 3) = 2√3 ≈ 3.4641 (B) ; 4√3 ≈ 6.93, 3√2 ≈ 4.24 differ
  'ex-4am-tawzif-khawass-judhur-l1-003:q1': C('B'),
  // √45 = √(3² × 5) = 3√5 ≈ 6.708 (C) ; 5√3 ≈ 8.66, 9√5 ≈ 20.1 differ
  'ex-4am-tawzif-khawass-judhur-l1-003:q2': C('C'),
  // largest perfect square dividing 72 : squares a² | 72 → a ∈ {1, 2, 3, 6} → 36 (B)
  'ex-4am-tawzif-khawass-judhur-l1-004:q1': C('B'),
  'ex-4am-tawzif-khawass-judhur-l1-004:q2': R(Math.max(...range(1, 72).filter((a) => 72 % (a * a) === 0))),
  // 12 = 4·3, 18 = 9·2, 8 = 4·2 are reducible ; 7 has no square factor > 1 → 3√7 (C)
  'ex-4am-tawzif-khawass-judhur-l1-005:q1': C('C'),
  // (5 + 2)√3 = 7√3 (A)
  'ex-4am-tawzif-khawass-judhur-l1-006:q1': C('A'),
  // (4 − 9)√5 = −5√5 (B)
  'ex-4am-tawzif-khawass-judhur-l1-006:q2': C('B'),
  'ex-4am-tawzif-khawass-judhur-l1-007:q1': R(3 + 5 - 1),
  'ex-4am-tawzif-khawass-judhur-l1-007:q2': R(2 - 6 + 1),
  // 3/√2 = 3√2/2 ≈ 2.1213 (B) ; 3/2, 3√2/4 ≈ 1.06, 2/(3√2) ≈ 0.471 differ
  'ex-4am-tawzif-khawass-judhur-l1-008:q1': C('B'),
  // 5/√5 = 5√5/5 = √5 ≈ 2.236 (B) ; 5√5, √5/5, 1 differ
  'ex-4am-tawzif-khawass-judhur-l1-008:q2': C('B'),
  // 7/√3 : multiply numerator and denominator by √3 (B) — the only option whose product with √3 is natural
  'ex-4am-tawzif-khawass-judhur-l1-009:q1': C('B'),
  'ex-4am-tawzif-khawass-judhur-l1-009:q2': R(3),                                   // (√3)² = 3 by definition
  'ex-4am-tawzif-khawass-judhur-l1-010:q1': R(3 * 3 * 5),                           // 3√5 = √(3² × 5)
  'ex-4am-tawzif-khawass-judhur-l1-010:q2': R(5 * 5 * 2),                           // 5√2 = √(5² × 2)
  // ── Level 2
  // 98 = 7² × 2
  'ex-4am-tawzif-khawass-judhur-l2-003:q1': R(Math.max(...range(1, 98).filter((a) => 98 % (a * a) === 0))),
  'ex-4am-tawzif-khawass-judhur-l2-003:q2': R(98 / Math.max(...range(1, 98).filter((a) => 98 % (a * a) === 0)) ** 2),
  // √180 = √(6² × 5) = 6√5 ≈ 13.416 (C) ; 3√20 and 2√45 equal in value but b not smallest (not the form), 36√5 differs
  'ex-4am-tawzif-khawass-judhur-l2-004:q1': C('C'),
  'ex-4am-tawzif-khawass-judhur-l2-005:q1': R(Math.sqrt(500 / 5)),
  'ex-4am-tawzif-khawass-judhur-l2-005:q2': R(Math.sqrt(363 / 3)),
  'ex-4am-tawzif-khawass-judhur-l2-006:q1': R(Math.sqrt(12 / 3) + Math.sqrt(27 / 3)),
  'ex-4am-tawzif-khawass-judhur-l2-006:q2': R(Math.sqrt(50 / 2) - Math.sqrt(8 / 2)),
  // 2√20 − √45 = (2·2 − 3)√5 = √5 (C) ; −√5, √35, 7√5 differ
  'ex-4am-tawzif-khawass-judhur-l2-007:q1': C('C'),
  'ex-4am-tawzif-khawass-judhur-l2-008:q1': R(12 / 3),                              // 12/√3 = 12√3/3
  'ex-4am-tawzif-khawass-judhur-l2-008:q2': R(10 / 5),                              // 10/√5 = 10√5/5
  // √5/(3√2) = √10/(3 × 2) = √10/6 ≈ 0.5270 (C) ; √10/12, √5/6 ≈ 0.373, √10/2 differ
  'ex-4am-tawzif-khawass-judhur-l2-009:q1': C('C'),
  'ex-4am-tawzif-khawass-judhur-l2-010:q1': R(3),                                   // √3 × √3 = 3
  'ex-4am-tawzif-khawass-judhur-l2-010:q2': R(2),                                   // √3 × 2 = 2√3
  // ── Level 3
  // √75 − 2√12 + √27 = (5 − 2·2 + 3)√3 = 4√3 ≈ 6.928 (B) ; 6√3, 3√10 ≈ 9.49, 12√3 differ
  'ex-4am-tawzif-khawass-judhur-l3-003:q1': C('B'),
  'ex-4am-tawzif-khawass-judhur-l3-004:q1': R(Math.sqrt(192 / 3)),
  'ex-4am-tawzif-khawass-judhur-l3-004:q2': R(6 * 6 * 2),
  'ex-4am-tawzif-khawass-judhur-l3-005:q1': R(4 * 4 * 3),
  // 3√5 = √45, 2√11 = √44, 4√3 = √48, 5√2 = √50 → 5√2 largest (C)
  'ex-4am-tawzif-khawass-judhur-l3-005:q2': C('C'),
  'ex-4am-tawzif-khawass-judhur-l3-006:q1': R((6 / Math.sqrt(12 / 3)) / 3),        // 6/(2√3) = 3/√3 = 3√3/3 → k = 1
  'ex-4am-tawzif-khawass-judhur-l3-006:q2': R((15 * 2) / (Math.sqrt(20 / 5) * 5)), // 15/(2√5) = 15√5/10 = p√5/2 → p = 15·2/10
  // 2/(3√7) = 2√7/(3 × 7) = 2√7/21 ≈ 0.2520 (B) ; 2/21, 2√7/147, 2√7/7 differ
  'ex-4am-tawzif-khawass-judhur-l3-007:q1': C('B'),
  // √x = 8√2 − 5√2 = 3√2 → x = 3² × 2
  'ex-4am-tawzif-khawass-judhur-l3-008:q1': R((8 - Math.sqrt(50 / 2)) ** 2 * 2),
  'ex-4am-tawzif-khawass-judhur-l3-009:q1': R(5 + 1),                               // (√5)² + 1²
  'ex-4am-tawzif-khawass-judhur-l3-009:q2': R(2 * 1),                               // 2 × √5 × 1
  'ex-4am-tawzif-khawass-judhur-l3-010:q1': R(Math.sqrt(48 / 3)),
  'ex-4am-tawzif-khawass-judhur-l3-010:q2': R(Math.sqrt((48 + 48) / 6)),            // diagonal² = 96 = 4² × 6
  // ── Level 4
  // √72 = 2√18 is true but 18 = 9·2 is reducible ; largest square is 36 → 6√2 (B). A, D claim b smallest (false), C is a false equality
  'ex-4am-tawzif-khawass-judhur-l4-003:q1': C('B'),
  // 3√8 − √18 = 6√2 − 3√2 = 3√2 ≠ −√2 : the coefficient 3 was dropped (D) ; √18 = 3√2 is right, √6 ≠ 3√2
  'ex-4am-tawzif-khawass-judhur-l4-004:q1': C('D'),
  // √6 × √6 = 6, 4/√6 = 4√6/6 = 2√6/3 ≈ 1.633 ≠ √6/9 ≈ 0.272 (C) ; 2/3 and √6/4 are not equal to 4/√6
  'ex-4am-tawzif-khawass-judhur-l4-005:q1': C('C'),
  'ex-4am-tawzif-khawass-judhur-l4-006:q1': R(2 * 2 * 3 + 1),                       // (2√3)² + 1²
  'ex-4am-tawzif-khawass-judhur-l4-006:q2': R(-2 * 2 * 1),                          // −2 × 2√3 × 1
  'ex-4am-tawzif-khawass-judhur-l4-007:q1': R(5 - 2 * 2),                           // (√5)² − 2²
  // 1/(√5 − 2) = (√5 + 2)/1 ≈ 4.236 (B) ; √5 − 2 ≈ 0.236, √5/5 − 1/2 ≈ −0.053, (√5 + 2)/9 ≈ 0.471 differ
  'ex-4am-tawzif-khawass-judhur-l4-007:q2': C('B'),
  // √200 = 10√2, 5√8 = 5·2√2 = 10√2, 2√50 = 2·5√2 = 10√2 → all equal (C)
  'ex-4am-tawzif-khawass-judhur-l4-008:q1': C('C'),
  'ex-4am-tawzif-khawass-judhur-l4-009:q1': R(3 * Math.sqrt(28 / 7) - 2 * Math.sqrt(63 / 7) + Math.sqrt(700 / 7)),
  'ex-4am-tawzif-khawass-judhur-l4-009:q2': R((3 * Math.sqrt(28 / 7) - 2 * Math.sqrt(63 / 7) + Math.sqrt(700 / 7)) ** 2 * 7),
  // 1/√2 = 2√2/4, 1/√8 = 1/(2√2) = √2/4 → p = 2 + 1
  'ex-4am-tawzif-khawass-judhur-l4-010:q1': R(4 / 2 + 4 / (2 * 2)),
  // ── Level 5
  'ex-4am-tawzif-khawass-judhur-l5-003:q1': R(Math.sqrt((6 * 6 + 3 * 3) / 5)),     // AC² = 45 = 3² × 5
  'ex-4am-tawzif-khawass-judhur-l5-003:q2': R(6 + 3),
  'ex-4am-tawzif-khawass-judhur-l5-004:q1': R(Math.sqrt(12 / 3) + Math.sqrt(27 / 3)),
  'ex-4am-tawzif-khawass-judhur-l5-004:q2': R(12 + 27),
  'ex-4am-tawzif-khawass-judhur-l5-004:q3': R(Math.sqrt(12 * 27) / 2),             // √324 / 2
  'ex-4am-tawzif-khawass-judhur-l5-005:q1': R(10 / 5),                              // 10/√5 = 10√5/5
  'ex-4am-tawzif-khawass-judhur-l5-005:q2': R(2 * (1 + 10 / 5)),                    // 2(√5 + 2√5)
  'ex-4am-tawzif-khawass-judhur-l5-006:q1': R(Math.sqrt(48 / 3) - 2 * Math.sqrt(27 / 3) + Math.sqrt(75 / 3)),
  'ex-4am-tawzif-khawass-judhur-l5-006:q2': R(6 / 3),
  'ex-4am-tawzif-khawass-judhur-l5-006:q3': R((Math.sqrt(48 / 3) - 2 * Math.sqrt(27 / 3) + Math.sqrt(75 / 3)) * (6 / 3) * 3),
  // edge e = 2√2 → e² = 8 ; AC² = 16 ; AG² = 24 = 2² × 6
  'ex-4am-tawzif-khawass-judhur-l5-007:q1': R(Math.sqrt(2 * 2 * 2 * 2)),
  'ex-4am-tawzif-khawass-judhur-l5-007:q2': R(Math.max(...range(1, 24).filter((a) => (3 * 8) % (a * a) === 0))),
  'ex-4am-tawzif-khawass-judhur-l5-007:q3': R((3 * 8) / Math.max(...range(1, 24).filter((a) => (3 * 8) % (a * a) === 0)) ** 2),
  'ex-4am-tawzif-khawass-judhur-l5-008:q1': R(6 / 3),                               // 6/√3 = 6√3/3
  // √3/√15 = 1/√5 = √5/5 ≈ 0.4472 (D) ; 1/5, √5/25 ≈ 0.089, √5 differ
  'ex-4am-tawzif-khawass-judhur-l5-008:q2': C('D'),
  'ex-4am-tawzif-khawass-judhur-l5-009:q1': R(1 + 1),
  'ex-4am-tawzif-khawass-judhur-l5-009:q2': R(2 - 1),                               // (√2)² − 1²
  'ex-4am-tawzif-khawass-judhur-l5-009:q3': R(2 * 1),                               // 2 × √2 × 1
  'ex-4am-tawzif-khawass-judhur-l5-010:q1': R(3 * 3 - 5),
  'ex-4am-tawzif-khawass-judhur-l5-010:q2': R(3 * 3 - 5),
  // 8/(3 + √5) = 8(3 − √5)/4 = 6 − 2√5 ≈ 1.528 (B) ; 6 + 2√5, 8/3 + 8√5/5 ≈ 6.24, 24 − 8√5 ≈ 6.11 differ
  'ex-4am-tawzif-khawass-judhur-l5-010:q3': C('B'),
  // ── Synthèse de l'unité 2 « أدمج تعلّماتي » (2026-09-30) ──
  // wadiya-idmajiya-judhur — أدمج تعلّماتي (الوحدة 2) : 50 exercices intégratifs générés par la plateforme
  'ex-4am-wadiya-idmajiya-judhur-l1-001:q1': R(Math.sqrt(49)),
  'ex-4am-wadiya-idmajiya-judhur-l1-001:q2': C('A'), // 49 > 0 : deux solutions opposées ±7
  'ex-4am-wadiya-idmajiya-judhur-l1-002:q1': R(0.6),
  'ex-4am-wadiya-idmajiya-judhur-l1-002:q2': C('C'), // 0,36 = 0,6² : racine rationnelle
  'ex-4am-wadiya-idmajiya-judhur-l1-003:q1': C('B'), // √(5²×2) = √(5²)×√2 = 5√2
  'ex-4am-wadiya-idmajiya-judhur-l1-003:q2': R(Math.sqrt((-6) ** 2)),
  'ex-4am-wadiya-idmajiya-judhur-l1-004:q1': R((2 * 3) * 3),
  'ex-4am-wadiya-idmajiya-judhur-l1-004:q2': C('D'), // √18 = √(9×2) = 3√2
  'ex-4am-wadiya-idmajiya-judhur-l1-005:q1': C('D'), // 20 > 0 ; √20 = 2√5 ; deux solutions opposées
  'ex-4am-wadiya-idmajiya-judhur-l1-006:q1': C('C'), // le carré se termine par 4, donc ≠ 2 : valeur approchée
  'ex-4am-wadiya-idmajiya-judhur-l1-006:q2': R((Math.round(Math.sqrt(50) * 10) / 10).toFixed(1)),
  'ex-4am-wadiya-idmajiya-judhur-l1-007:q1': R(Math.round(Math.sqrt(8) ** 2)),
  'ex-4am-wadiya-idmajiya-judhur-l1-007:q2': C('C'), // 4√8 = 4×2√2 = 8√2 ; √32 = 4√2
  'ex-4am-wadiya-idmajiya-judhur-l1-008:q1': C('C'), // 6/√3 = 6√3/3 = 2√3 ; 6/3 = 2 ≠ 2√3
  'ex-4am-wadiya-idmajiya-judhur-l1-009:q1': C('D'), // BC² = 1 + 9 = 10 ; √20 = 2√5 ≠ √10
  'ex-4am-wadiya-idmajiya-judhur-l1-009:q2': C('A'), // 10 non carré parfait : √10 irrationnel
  'ex-4am-wadiya-idmajiya-judhur-l1-010:q1': C('A'), // x² = 0,49 > 0 ; 0,7² = 0,49
  'ex-4am-wadiya-idmajiya-judhur-l2-001:q1': C('A'), // √45 = 3√5 ; (5√3)² = 75
  'ex-4am-wadiya-idmajiya-judhur-l2-001:q2': R((Math.round(Math.sqrt(45) * 100) / 100).toFixed(2)),
  'ex-4am-wadiya-idmajiya-judhur-l2-002:q1': R(Math.sqrt(18 / 2)),
  'ex-4am-wadiya-idmajiya-judhur-l2-002:q2': C('C'), // 24/2 = 12 ; √12 = 2√3 ; 2√6 = √24
  'ex-4am-wadiya-idmajiya-judhur-l2-003:q1': R(Math.sqrt(12 * 3)),
  'ex-4am-wadiya-idmajiya-judhur-l2-003:q2': R(Math.sqrt(50 / 2)),
  'ex-4am-wadiya-idmajiya-judhur-l2-004:q1': C('D'), // (3 + 5 − 1)√2 = 7√2
  'ex-4am-wadiya-idmajiya-judhur-l2-004:q2': C('A'), // 3√2 + 2√2 = 5√2 ; √26 ≠ 5√2 (26 ≠ 50)
  'ex-4am-wadiya-idmajiya-judhur-l2-005:q1': C('A'), // x² = 27/3 = 9 : ±3
  'ex-4am-wadiya-idmajiya-judhur-l2-005:q2': C('B'), // x² = 15 > 0 : ±√15
  'ex-4am-wadiya-idmajiya-judhur-l2-006:q1': R(Math.sqrt(20 * 5)),
  'ex-4am-wadiya-idmajiya-judhur-l2-006:q2': C('C'), // 2(2√5 + √5) = 6√5 ; 2√25 = 10
  'ex-4am-wadiya-idmajiya-judhur-l2-007:q1': R(Math.sqrt(16)),
  'ex-4am-wadiya-idmajiya-judhur-l2-007:q2': C('D'), // r² = 12 ; r = 2√3 ; 3√2 = √18
  'ex-4am-wadiya-idmajiya-judhur-l2-008:q1': C('D'), // √(25 + 25) = √50 = 5√2
  'ex-4am-wadiya-idmajiya-judhur-l2-008:q2': R((Math.round(5 * Math.sqrt(2) * 10) / 10).toFixed(1)),
  'ex-4am-wadiya-idmajiya-judhur-l2-009:q1': R(7 + Math.sqrt(49)),
  'ex-4am-wadiya-idmajiya-judhur-l2-009:q2': R(Math.sqrt((-5) ** 2) * 0.2),
  'ex-4am-wadiya-idmajiya-judhur-l2-010:q1': C('B'), // (2√7)² = 28 > 25
  'ex-4am-wadiya-idmajiya-judhur-l2-010:q2': C('C'), // 18 > 12
  'ex-4am-wadiya-idmajiya-judhur-l3-001:q1': R(2 ** 2 * 6),
  'ex-4am-wadiya-idmajiya-judhur-l3-001:q2': C('C'), // √48 = 4√3 ; (4√6)² = 96
  'ex-4am-wadiya-idmajiya-judhur-l3-002:q1': R(Math.sqrt(50 / 2)),
  'ex-4am-wadiya-idmajiya-judhur-l3-002:q2': R(2 * Math.sqrt(50 / 2)),
  'ex-4am-wadiya-idmajiya-judhur-l3-003:q1': C('D'), // 4ℓ × ℓ = 4ℓ²
  'ex-4am-wadiya-idmajiya-judhur-l3-003:q2': C('A'), // ℓ² = 18/4 = 9/2 ; ℓ = 3/√2 = 3√2/2 ; (3/2)² = 9/4 ≠ 9/2
  'ex-4am-wadiya-idmajiya-judhur-l3-004:q1': C('A'), // (2√3)² = 12
  'ex-4am-wadiya-idmajiya-judhur-l3-004:q2': C('B'), // x² = 5/4 ⇔ 4x² = 5
  'ex-4am-wadiya-idmajiya-judhur-l3-005:q1': R(3 ** 2 * 5),
  'ex-4am-wadiya-idmajiya-judhur-l3-005:q2': R((0.3 ** 2).toFixed(2)),
  'ex-4am-wadiya-idmajiya-judhur-l3-006:q1': C('B'), // √25 = 5 ≠ 7
  'ex-4am-wadiya-idmajiya-judhur-l3-006:q2': R(Math.sqrt(16 + 9)),
  'ex-4am-wadiya-idmajiya-judhur-l3-007:q1': R(Math.sqrt(5 + 11)),
  'ex-4am-wadiya-idmajiya-judhur-l3-007:q2': C('A'), // 4 + 8 = 12 ; √12 = 2√3
  'ex-4am-wadiya-idmajiya-judhur-l3-008:q1': C('A'), // x² = 1/2 ; 1/√2 = √2/2
  'ex-4am-wadiya-idmajiya-judhur-l3-009:q1': R(3 - 1),
  'ex-4am-wadiya-idmajiya-judhur-l3-009:q2': R(2 ** 2 * 2 - 5),
  'ex-4am-wadiya-idmajiya-judhur-l3-010:q1': C('C'), // 4√10 ; √40 = 2√10
  'ex-4am-wadiya-idmajiya-judhur-l3-010:q2': R((Math.round(4 * Math.sqrt(10) * 100) / 100).toFixed(2)),
  'ex-4am-wadiya-idmajiya-judhur-l4-001:q1': C('C'), // ℓ² = 15 ; 3√5 = √45
  'ex-4am-wadiya-idmajiya-judhur-l4-001:q2': R(Math.round(2 * Math.sqrt(15) * 100)),
  'ex-4am-wadiya-idmajiya-judhur-l4-001:q3': C('C'), // 2 × 387,298… = 774,597… → 775 ≠ 774
  'ex-4am-wadiya-idmajiya-judhur-l4-002:q1': C('B'), // 18 = 9×2 ; √72 = 6√2
  'ex-4am-wadiya-idmajiya-judhur-l4-002:q2': C('A'), // √72 = 6√2 ; (8√3)² = 192
  'ex-4am-wadiya-idmajiya-judhur-l4-003:q1': C('A'), // 1 + 2√2 + 2 = 3 + 2√2
  'ex-4am-wadiya-idmajiya-judhur-l4-003:q2': C('A'), // (3+2√2) − (2+2√2) − 1 = 0
  'ex-4am-wadiya-idmajiya-judhur-l4-004:q1': C('A'), // 3 + 6 = 9 = 3²
  'ex-4am-wadiya-idmajiya-judhur-l4-004:q2': C('C'), // √18/2 = 3√2/2 ; √9/2 = 3/2
  'ex-4am-wadiya-idmajiya-judhur-l4-005:q1': C('B'), // multiplier haut et bas par √5 ; √5×√5 = 5
  'ex-4am-wadiya-idmajiya-judhur-l4-005:q2': C('D'), // 3/(2√3) = 3√3/6 = √3/2
  'ex-4am-wadiya-idmajiya-judhur-l4-006:q1': C('D'), // 5 − 4 + 3 = 4 → 4√3
  'ex-4am-wadiya-idmajiya-judhur-l4-006:q2': R(4 ** 2 * 3),
  'ex-4am-wadiya-idmajiya-judhur-l4-007:q1': C('A'), // 2x² = 18 → x² = 9
  'ex-4am-wadiya-idmajiya-judhur-l4-007:q2': R(1),
  'ex-4am-wadiya-idmajiya-judhur-l4-007:q3': R(0),
  'ex-4am-wadiya-idmajiya-judhur-l4-008:q1': R(3 * 2 * 2),
  'ex-4am-wadiya-idmajiya-judhur-l4-008:q2': C('C'), // √12 = 2√3
  'ex-4am-wadiya-idmajiya-judhur-l4-008:q3': C('A'), // 200 > 192
  'ex-4am-wadiya-idmajiya-judhur-l4-009:q1': C('C'), // (1+√5)² = 6 + 2√5 ; /4 → (3+√5)/2
  'ex-4am-wadiya-idmajiya-judhur-l4-009:q2': C('A'), // φ + 1 = (3+√5)/2 = φ²
  'ex-4am-wadiya-idmajiya-judhur-l4-010:q1': R(frac(Math.sqrt(16), Math.sqrt(9))),
  'ex-4am-wadiya-idmajiya-judhur-l4-010:q2': R(Math.sqrt(98 / 2)),
  'ex-4am-wadiya-idmajiya-judhur-l5-001:q1': C('D'), // √18 = 3√2
  'ex-4am-wadiya-idmajiya-judhur-l5-001:q2': C('A'), // 18 + 9 = 27 ; √27 = 3√3
  'ex-4am-wadiya-idmajiya-judhur-l5-001:q3': R((Math.round(3 * Math.sqrt(3) * 10) / 10).toFixed(1)),
  'ex-4am-wadiya-idmajiya-judhur-l5-002:q1': R(12 / 1.5),
  'ex-4am-wadiya-idmajiya-judhur-l5-002:q2': C('B'), // √8 = 2√2
  'ex-4am-wadiya-idmajiya-judhur-l5-002:q3': R(Math.round(Math.sqrt(8) * 100)),
  'ex-4am-wadiya-idmajiya-judhur-l5-003:q1': C('B'), // √72 = 6√2 (les deux autres écritures ne sont pas simplifiées : b non minimal)
  'ex-4am-wadiya-idmajiya-judhur-l5-003:q2': R((Math.round(4 * Math.sqrt(72) * 100) / 100).toFixed(2)),
  'ex-4am-wadiya-idmajiya-judhur-l5-004:q1': R(Math.sqrt(27 / 3)),
  'ex-4am-wadiya-idmajiya-judhur-l5-004:q2': R(3 * Math.sqrt(27 / 3)),
  'ex-4am-wadiya-idmajiya-judhur-l5-004:q3': C('A'), // 8 < 9
  'ex-4am-wadiya-idmajiya-judhur-l5-005:q1': C('D'), // x² + 4x² = 100
  'ex-4am-wadiya-idmajiya-judhur-l5-005:q2': C('A'), // x² = 20 ; x = 2√5
  'ex-4am-wadiya-idmajiya-judhur-l5-005:q3': R(20),
  'ex-4am-wadiya-idmajiya-judhur-l5-006:q1': C('A'), // √50 = 5√2
  'ex-4am-wadiya-idmajiya-judhur-l5-006:q2': C('B'), // (5√2 + 4)² = 66 + 40√2
  'ex-4am-wadiya-idmajiya-judhur-l5-007:q1': C('B'), // 3 − 2 + 1 = 2 → 2√5
  'ex-4am-wadiya-idmajiya-judhur-l5-007:q2': C('C'), // 10√5/5 = 2√5
  'ex-4am-wadiya-idmajiya-judhur-l5-007:q3': R(2 * 2 * 5),
  'ex-4am-wadiya-idmajiya-judhur-l5-008:q1': C('C'), // √(25 − 1) = √24 = 2√6 ; √26 est l’hypoténuse de côtés 5 et 1
  'ex-4am-wadiya-idmajiya-judhur-l5-008:q2': R(Math.round(2 * Math.sqrt(6) * 100)),
  'ex-4am-wadiya-idmajiya-judhur-l5-009:q1': C('D'), // 3√2 + 4√2 = 7√2 ; √50 = 5√2
  'ex-4am-wadiya-idmajiya-judhur-l5-009:q2': C('A'), // √50 = 5√2
  'ex-4am-wadiya-idmajiya-judhur-l5-009:q3': R(7 ** 2 * 2),
  'ex-4am-wadiya-idmajiya-judhur-l5-010:q1': C('A'), // √20 = 2√5
  'ex-4am-wadiya-idmajiya-judhur-l5-010:q2': R(Math.sqrt(8 / 2)),
  'ex-4am-wadiya-idmajiya-judhur-l5-010:q3': C('A'), // 16 < 20
  ...ORACLE_NASHR,
  ...ORACLE_MUTATABIQAT,
  ...ORACLE_TAHLIL,
  ...ORACLE_WADIYA_HARFI,
  ...ORACLE_MUADALA,
  ...ORACLE_JIDAA,
  ...ORACLE_MUTARAJIHA,
  ...ORACLE_TARRID,
  ...ORACLE_WADIYA_MUADALAT,
  ...ORACLE_MAFHUM_JUMLA,
  ...ORACLE_HALL_JABRI,
  ...ORACLE_MUSHKILAT_JUMLA,
  ...ORACLE_WADIYA_JUMAL,
  ...ORACLE_TANASUB,
  ...ORACLE_DALA,
  ...ORACLE_TAMTHIL,
  ...ORACLE_TATBIQAT,
  ...ORACLE_TARRID_KHATTI,
  ...ORACLE_WADIYA_KHATTIYA,
  ...ORACLE_MAFHUM_TAALUFIYA,
  ...ORACLE_TAMTHIL_TAALUFI,
  ...ORACLE_TAGHAYYURAT,
  ...ORACLE_TAFSIR_JUMLA,
  ...ORACLE_TARRID_TAALUFI,
  ...ORACLE_WADIYA_TAALUFIYA,
  ...ORACLE_TAKRAR_MUJAMMA,
  ...ORACLE_MADA_WASIT,
  ...ORACLE_MAJDULAT,
  ...ORACLE_QIRAAT_WADIYAT,
  ...ORACLE_WADIYA_IHSA,
  ...ORACLE_TALIS_HISAB,
  ...ORACLE_AKSIYA_TALIS,
  ...ORACLE_INSHAAT_TALIS,
  ...ORACLE_WADIYA_TALIS,
  ...ORACLE_NISAB_MUTH,
  ...ORACLE_HASIBA_MUTH,
  ...ORACLE_ALAQAT_MUTH,
  ...ORACLE_TARRID_MUTH,
  ...ORACLE_WADIYA_MUTH,
  ...ORACLE_INSIHAB_SHUAA,
  ...ORACLE_SHUAAYN_MUT,
  ...ORACLE_MAJMU_SHUAAYN,
  ...ORACLE_BARAHIN_ASHIA,
  ...ORACLE_WADIYA_ASHIA,
  ...ORACLE_MURAKKIBATA,
  ...ORACLE_HISAB_MURAKKIBATAY,
  ...ORACLE_MUNTASAF_MASAFA,
  ...ORACLE_ITHBAT_KHAWAS,
  ...ORACLE_WADIYA_MAALAM,
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
      if (q.answerType === 'point') expect(evaluateAnswer({ x: String(q.expectedAnswer.x), y: String(q.expectedAnswer.y) }, { ...q, expectedAnswer: ORACLE[key] }).isCorrect).toBe(true);
      if (q.answerType === 'choice') {
        for (const c of q.choices) expect(isSuccessOutcome(evaluateAnswer(C(c.id), q).outcome)).toBe(c.id === ORACLE[key].choiceId);
      }
    });
  }
});
