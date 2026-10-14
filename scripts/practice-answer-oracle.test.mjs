// L'ORACLE des réponses du banc d'exercices (4AM depuis l'audit d'intégrité du 2026-09-24 ; toutes les années du cycle moyen depuis le 2026-10-14).
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
import { ORACLE as ORACLE_MAFHUM_DAWARAN } from './practice-oracle/mafhum-dawaran.mjs';
import { ORACLE as ORACLE_KHAWAS_DAWARAN } from './practice-oracle/khawas-dawaran.mjs';
import { ORACLE as ORACLE_ZAWIYA_MUHITIYA } from './practice-oracle/zawiya-muhitiya.mjs';
import { ORACLE as ORACLE_MUDALAAT_MUNTAZAMA } from './practice-oracle/mudalaat-muntazama.mjs';
import { ORACLE as ORACLE_WADIYA_DAWARAN } from './practice-oracle/wadiya-idmajiya-dawaran.mjs';
import { ORACLE as ORACLE_KURA_JULLA } from './practice-oracle/kura-julla.mjs';
import { ORACLE as ORACLE_MISAHA_HAJM } from './practice-oracle/misaha-hajm-kura.mjs';
import { ORACLE as ORACLE_MAQATI } from './practice-oracle/maqati-mustawiya.mjs';
import { ORACLE as ORACLE_TAKBIR } from './practice-oracle/takbir-tasghir.mjs';
import { ORACLE as ORACLE_WADIYA_FADA } from './practice-oracle/wadiya-idmajiya-fada.mjs';
// Prototype BEM (2026-10-06) : banc bahth-pgcd réécrit.
import { ORACLE as ORACLE_BAHTH } from './practice-oracle/bahth-pgcd.mjs';
// Déploiement BEM, unité 2 (2026-10-06) : un oracle par leçon (les anciennes entrées en ligne de l'unité 2 sont retirées).
import { ORACLE as ORACLE_BEM_JIDHR } from './practice-oracle/jidhr-tarbii.mjs';
import { ORACLE as ORACLE_BEM_AMALIYAT } from './practice-oracle/amaliyat-judhur.mjs';
import { ORACLE as ORACLE_BEM_TAWZIF } from './practice-oracle/tawzif-khawass-judhur.mjs';
import { ORACLE as ORACLE_BEM_NATIQA } from './practice-oracle/natiqa-ghayr-natiqa.mjs';
import { ORACLE as ORACLE_BEM_X_MURABBA } from './practice-oracle/muadalat-x-murabba.mjs';
import { ORACLE as ORACLE_BEM_WADIYA_JUDHUR } from './practice-oracle/wadiya-idmajiya-judhur.mjs';
// Unité 1, au format BEM, une leçon à la fois (2026-10-06).
import { ORACLE as ORACLE_BEM_QASIM } from './practice-oracle/qasim-adad-tabii.mjs';
import { ORACLE as ORACLE_BEM_QAWASIM_ADAD_TABII } from './practice-oracle/qawasim-adad-tabii.mjs';
import { ORACLE as ORACLE_BEM_KHAWASS_QAWASIM } from './practice-oracle/khawass-qawasim.mjs';
import { ORACLE as ORACLE_BEM_QASIM_MUSHTARAK_AKBAR } from './practice-oracle/qasim-mushtarak-akbar.mjs';
import { ORACLE as ORACLE_BEM_TAYIN_PGCD } from './practice-oracle/tayin-pgcd.mjs';
import { ORACLE as ORACLE_BEM_AWWALIYAN_FIMA_BAYNAHUMA } from './practice-oracle/awwaliyan-fima-baynahuma.mjs';
import { ORACLE as ORACLE_BEM_IKHTIZAL_KASR } from './practice-oracle/ikhtizal-kasr.mjs';
import { ORACLE as ORACLE_BEM_WADIYA_IDMAJIYA_AADAD } from './practice-oracle/wadiya-idmajiya-aadad.mjs';
import { ORACLE as ORACLE_BEM_TAKRAR_MUJAMMA } from './practice-oracle/takrar-mujamma.mjs';
import { ORACLE as ORACLE_BEM_MADA_WASIT_MUTAWASSIT } from './practice-oracle/mada-wasit-mutawassit.mjs';
import { ORACLE as ORACLE_BEM_MAJDULAT_IHSAIYA } from './practice-oracle/majdulat-ihsaiya.mjs';
import { ORACLE as ORACLE_BEM_QIRAAT_WADIYAT_IHSAIYA } from './practice-oracle/qiraat-wadiyat-ihsaiya.mjs';
import { ORACLE as ORACLE_BEM_WADIYA_IDMAJIYA_IHSA } from './practice-oracle/wadiya-idmajiya-ihsa.mjs';
import { ORACLE as ORACLE_BEM_TALIS_HISAB_ATWAL } from './practice-oracle/talis-hisab-atwal.mjs';
import { ORACLE as ORACLE_BEM_AKSIYA_TALIS } from './practice-oracle/aksiya-talis.mjs';
import { ORACLE as ORACLE_BEM_INSHAAT_TALIS } from './practice-oracle/inshaat-talis.mjs';
import { ORACLE as ORACLE_BEM_WADIYA_IDMAJIYA_TALIS } from './practice-oracle/wadiya-idmajiya-talis.mjs';
import { ORACLE as ORACLE_BEM_NISAB_MUTHALLATHIYA } from './practice-oracle/nisab-muthallathiya.mjs';
import { ORACLE as ORACLE_BEM_HASIBA_MUTHALLATHIYA } from './practice-oracle/hasiba-muthallathiya.mjs';
import { ORACLE as ORACLE_BEM_ALAQAT_MUTHALLATHIYA } from './practice-oracle/alaqat-muthallathiya.mjs';
import { ORACLE as ORACLE_BEM_TARRID_MUTHALLATHIYA } from './practice-oracle/tarrid-muthallathiya.mjs';
import { ORACLE as ORACLE_BEM_WADIYA_IDMAJIYA_MUTHALLATHAT } from './practice-oracle/wadiya-idmajiya-muthallathat.mjs';
// Cycle moyen, phase 3 (2026-10-14) : le premier banc 1AM–3AM (feuilles « على منوال اختبار الفصل »).
import { ORACLE as ORACLE_1AM_MANA_JAM_TARH } from './practice-oracle/mana-jam-tarh.mjs';
import { ORACLE as ORACLE_1AM_QISMA_IQLIDIYA_BAQI } from './practice-oracle/qisma-iqlidiya-baqi.mjs';
// Le premier banc 2AM (2026-10-14) : القسمة الإقليدية وحصر حاصل القسمة.
import { ORACLE as ORACLE_2AM_QISMA_IQLIDIYA_HASR } from './practice-oracle/qisma-iqlidiya-hasr.mjs';
import { ORACLE as ORACLE_1AM_IKHTIZAL_KITABA_KASRIYA } from './practice-oracle/ikhtizal-kitaba-kasriya.mjs';
import { ORACLE as ORACLE_1AM_QAWAID_QABILIYAT_QISMA } from './practice-oracle/qawaid-qabiliyat-qisma.mjs';
import { ORACLE as ORACLE_1AM_KITABAT_ADAD_TABII } from './practice-oracle/kitabat-adad-tabii.mjs';

// Toutes les années du cycle moyen (content/practice/<1am…4am>/<leçon>/level-N) : jusqu'au 2026-10-14 seul 4am
// existait et la racine y était codée en dur — un banc 1AM–3AM aurait échappé à l'oracle sans rien dire.
const practiceRoot = join(dirname(fileURLToPath(import.meta.url)), '..', 'content/practice');
const gradeRoots = readdirSync(practiceRoot).filter((g) => /^[1-4]am$/.test(g)).map((g) => join(practiceRoot, g));

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
  // ikhtizal-kasr
  // khawass-qawasim
  // Tous les pgcd(n + 19, n + 1) atteints — c'est ce que « يمكن أن تكون » demande.
  // qasim-adad-tabii
  // qasim-mushtarak-akbar
  // qawasim-adad-tabii
  // tayin-pgcd

  /* ── سلسلة التفوق رقم 01 (docs/sources/4am/unit1/worksheet-tafawwuq-01.json) ── */
  // تمرين 1
  // تمرين 2
  // تمرين 5 — 25 < a < 40 : un seul
  // تمرين 6 — deux solutions
  // تمرين 7 — PGCD(3a ; 6b) ≠ 1 pour tout couple premier entre eux (vérifié plus bas)
  // تمرين 8
  // تمرين 9
  // تمرين 10 — 240x = 320y
  // تمرين 11
  // تمرين 12 — E = 2175/1044 + 5/6 = a + b/c
  // تمرين 13
  // تمرين 14 (السؤال الأوّل فقط)
  // تمرين 15
  // الوضعيات 1–10 → أدمج تعلّماتي
  // poteaux / arbres : un coin = un poteau ⇒ la distance divise chaque côté ; clôture fermée ⇒ n = périmètre ÷ distance
  // Unité 2 « الحساب على الجذور » : oracles au format BEM dans scripts/practice-oracle/<leçon>.mjs (2026-10-06).
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
  ...ORACLE_MAFHUM_DAWARAN,
  ...ORACLE_KHAWAS_DAWARAN,
  ...ORACLE_ZAWIYA_MUHITIYA,
  ...ORACLE_MUDALAAT_MUNTAZAMA,
  ...ORACLE_WADIYA_DAWARAN,
  ...ORACLE_KURA_JULLA,
  ...ORACLE_MISAHA_HAJM,
  ...ORACLE_MAQATI,
  ...ORACLE_TAKBIR,
  ...ORACLE_WADIYA_FADA,
  ...ORACLE_BAHTH,
  ...ORACLE_BEM_JIDHR,
  ...ORACLE_BEM_AMALIYAT,
  ...ORACLE_BEM_TAWZIF,
  ...ORACLE_BEM_NATIQA,
  ...ORACLE_BEM_X_MURABBA,
  ...ORACLE_BEM_WADIYA_JUDHUR,
  ...ORACLE_BEM_QASIM,
  ...ORACLE_BEM_QAWASIM_ADAD_TABII,
  ...ORACLE_BEM_KHAWASS_QAWASIM,
  ...ORACLE_BEM_QASIM_MUSHTARAK_AKBAR,
  ...ORACLE_BEM_TAYIN_PGCD,
  ...ORACLE_BEM_AWWALIYAN_FIMA_BAYNAHUMA,
  ...ORACLE_BEM_IKHTIZAL_KASR,
  ...ORACLE_BEM_WADIYA_IDMAJIYA_AADAD,
  ...ORACLE_BEM_TAKRAR_MUJAMMA,
  ...ORACLE_BEM_MADA_WASIT_MUTAWASSIT,
  ...ORACLE_BEM_MAJDULAT_IHSAIYA,
  ...ORACLE_BEM_QIRAAT_WADIYAT_IHSAIYA,
  ...ORACLE_BEM_WADIYA_IDMAJIYA_IHSA,
  ...ORACLE_BEM_TALIS_HISAB_ATWAL,
  ...ORACLE_BEM_AKSIYA_TALIS,
  ...ORACLE_BEM_INSHAAT_TALIS,
  ...ORACLE_BEM_WADIYA_IDMAJIYA_TALIS,
  ...ORACLE_BEM_NISAB_MUTHALLATHIYA,
  ...ORACLE_BEM_HASIBA_MUTHALLATHIYA,
  ...ORACLE_BEM_ALAQAT_MUTHALLATHIYA,
  ...ORACLE_BEM_TARRID_MUTHALLATHIYA,
  ...ORACLE_BEM_WADIYA_IDMAJIYA_MUTHALLATHAT,
  ...ORACLE_1AM_MANA_JAM_TARH,
  ...ORACLE_1AM_QISMA_IQLIDIYA_BAQI,
  ...ORACLE_2AM_QISMA_IQLIDIYA_HASR,
  ...ORACLE_1AM_IKHTIZAL_KITABA_KASRIYA,
  ...ORACLE_1AM_QAWAID_QABILIYAT_QISMA,
  ...ORACLE_1AM_KITABAT_ADAD_TABII,
};

/**
 * Le cas signalé : « 6 مضاعف للعدد 120 » confondu avec « 6 قاسم للعدد 120 ». Depuis la feuille
 * BEM (2026-10-06), le piège est une question fermée : l3-001 q3 « هل 6 مضاعف للعدد 120؟ » —
 * « 6 مضاعف لـ 120 » ⇔ 120 | 6, faux, alors que 6 | 120 est vrai : seul « لا » (B) est accepté.
 */
const divides = (d, n) => n % d === 0;
const REPORTED = { key: 'ex-4am-qasim-adad-tabii-l3-001:q3', isMultiple: divides(120, 6), isDivisor: divides(6, 120) };

/* ── Lecture du banc ───────────────────────────────────────────────────── */
function* questions() {
  for (const root of gradeRoots) for (const lesson of readdirSync(root)) {
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

  it('le cas signalé (6 | 120) : « 6 مضاعف للعدد 120 » est faux, seul « لا » est accepté', () => {
    const q = bank.find((b) => b.key === REPORTED.key).q;
    expect(REPORTED.isDivisor).toBe(true);
    expect(REPORTED.isMultiple).toBe(false);
    for (const id of ['A', 'B']) {
      expect(isSuccessOutcome(evaluateAnswer(C(id), q).outcome)).toBe(id === 'B');
    }
  });

  for (const { key, q } of bank) {
    if (q.answerType === 'selfCheck') continue; // « بيّن أن » : pas de clé, l'élève se note sur le corrigé type
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
