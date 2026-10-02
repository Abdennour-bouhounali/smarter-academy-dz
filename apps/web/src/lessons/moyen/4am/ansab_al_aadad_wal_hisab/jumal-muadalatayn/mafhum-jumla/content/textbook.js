/**
 * Le contenu du MANUEL pour le درس 1 « مفهوم جملة معادلتين من الدرجة الأولى بمجهولين » — données
 * pures (aucun JSX), au mot près ; chaque bloc cite son élément de
 * docs/sources/4am/unit5/extraction.json. Les modules rendent ces données ; ils n'en réécrivent
 * aucune. Ce que la plateforme ajoute est déclaré (`addition(…)`).
 */
import { src, addition } from '../../_unit/unitMeta.js';

/** تحدّ (p. 55) — la cagnotte de la classe : l'accroche RÉELLE du module 1, puis son transfert. */
export const CHALLENGE = {
  source: src('challenge', 55, 'تحدّ'),
  text: 'لتزيين قسمهم، جمع التلاميذ مبلغ 610DA مُشكّلا من 37 قطعة نقدية من فئتي 20DA و 10DA. ما هو عدد القطع النقدية التي جمعها التلاميذ من كل فئة؟',
  system: 'x+y=37|20x+10y=610',
  // les inconnues, dites par la plateforme (le manuel ne les nomme pas ici)
  unknowns: 'نسمّي $x$ عدد قطع 20DA و $y$ عدد قطع 10DA.',
  answer: { x: '24', y: '13' },
};

/** Ce que la plateforme dit autour du تحدّ (l'accroche) — déclaré. */
export const HOOK = {
  source: addition('interaction_generation'),
  headline: 'تحدّ القسم: شرطان في آن واحد!',
  text: 'في هذا التحدّي شرطان يجب أن يتحقّقا معًا: عدد القطع، والمبلغ. قبل أن نحلّه، نكتشف مع عمّال مصلحة إدارية ماذا يعني أن تحقّق ثنائية من عددين شرطين في آن واحد.',
};

/** نشاط 1 (p. 56) — « جملة معادلتين من الدرجة الأولى بمجهولين » : les 32 agents. */
export const ACTIVITY = {
  source: src('act-1', 56, 'أنشطة', 1),
  title: 'جملة معادلتين من الدرجة الأولى بمجهولين',
  text: 'يعمل في مصلحة إدارية 32 عاملا. أُحيل 5 رجال و 3 نساء إلى التقاعد ولم يتم تعويضهم، فأصبح عدد النساء بالمصلحة ضعف عدد الرجال. نريد معرفة عدد الرجال و عدد النساء العاملين بهذه المؤسسة قبل الإحالة على التقاعد.',
  questions: [
    'أ) هل يمكن أن يكون عدد الرجال 24 وعدد النساء 8؟ اشرح.',
    'ب) نرمز بـ $x$ إلى عدد الرجال وبـ $y$ إلى عدد النساء. بيّن أنّ الوضعية السابقة تُترجم بالمعادلتين الآتيتين معا: $x + y = 32$ ...(1) و $2(x - 5) = y - 3$ ...(2)',
    'جـ) بسط المعادلة (2)، وتحقّق أنّ المعادلتين محققتان معًا من أجل $x = 13$ و $y = 19$ . ولكنّهما غير محققتين معا من أجل $x = 24$ و $y = 8$ .',
    'د) استنتج عدد الرجال و عدد النساء العاملين بهذه المؤسسة قبل الإحالة على التقاعد.',
  ],
  // « نقول أنّ … » — la phrase du manuel qui NOMME ce que l'activité vient de faire.
  closing: 'نقول أنّ $\\begin{cases} x + y = 32 \\\\ 2x - y = 7 \\end{cases}$ هي جملة معادلتين من الدرجة الأولى بمجهولين، والثنائيّة $(13 ; 19)$ هي حل لهذه الجملة.',
  system: 'x+y=32|2(x-5)=y-3',
  answer: { x: '13', y: '19' },
};

/**
 * Les calculs du نشاط 1 écrits par la plateforme (le livre les demande sans les écrire) —
 * les lectures exactes que les jauges du lab affichent.
 */
export const ACTIVITY_LINES = {
  source: addition('interaction_generation'),
  a: 'بعد التقاعد يبقى $24 - 5 = 19$ رجلا و $8 - 3 = 5$ نساء، و $2 \\times 19 = 38 \\neq 5$ : عدد النساء ليس ضعف عدد الرجال. إذن لا يمكن، رغم أنّ $24 + 8 = 32$.',
  b: 'عدد العمّال $x + y = 32$ . بعد التقاعد يبقى $x - 5$ رجلا و $y - 3$ امرأة، وعدد النساء ضعف عدد الرجال: $y - 3 = 2(x - 5)$ ، أي $2(x - 5) = y - 3$.',
  c: '$2(x - 5) = y - 3$ تعطي $2x - 10 = y - 3$ ، أي $2x - y = 7$.',
  check13: 'من أجل $x = 13$ و $y = 19$ : $13 + 19 = 32$ و $2 \\times 13 - 19 = 7$ : المعادلتان محقّقتان معًا.',
  check24: 'من أجل $x = 24$ و $y = 8$ : $24 + 8 = 32$ لكن $2 \\times 24 - 8 = 40 \\neq 7$ : المعادلتان غير محقّقتين معًا.',
  d: 'قبل الإحالة على التقاعد: 13 رجلا و 19 امرأة. وللتحقّق في النص: $13 + 19 = 32$ ، وبعد التقاعد $8$ رجال و $16$ امرأة، و $16 = 2 \\times 8$.',
};

/**
 * س أ) : les trois réponses proposées (module 1). La première est l'erreur du piège (24 ; 8) — elle
 * ne regarde que la condition des 32 agents (MISC-JUMLA-MUADALA-WAHIDA) ; la troisième est un
 * calcul faux. La carte des connaissances cite la première comme « خطأ شائع ».
 */
export const ACT_A_OPTIONS = [
  'نعم: $24 + 8 = 32$ ، فالعدد الكلّي للعمّال صحيح.',
  'لا: بعد التقاعد لا يكون عدد النساء ضعف عدد الرجال.',
  'لا: لأنّ $24 + 8$ لا يساوي 32.',
];

/** معارف (p. 58) — 1) جملة معادلتين, 2) حل جملة, ملاحظة (le ordre), حالات خاصة. */
export const KNOWLEDGE = {
  system: {
    source: src('know-1', 58, 'معارف', 1),
    title: 'جملة معادلتين من الدرجة الأولى بمجهولين',
    definition: 'نسمّي جملة معادلتين من الدرجة الأولى بمجهولين $x$ و $y$ كل جملة من الشكل $\\begin{cases} ax + by = c \\\\ a\'x + b\'y = c\' \\end{cases}$ حيث $a$ ، $b$ ، $c$ و $a\'$ ، $b\'$ ، $c\'$ أعداد معلومة.',
    example: 'الجملة $\\begin{cases} x - y = 2 \\\\ 2x - 5y = 4 \\end{cases}$ هي جملة معادلتين من الدرجة الأولى، حيث $a = 1$ ، $b = -1$ ، $c = 2$ و $a\' = 2$ ، $b\' = -5$ ، $c\' = 4$',
  },
  solution: {
    source: src('know-2', 58, 'معارف', 2),
    title: 'حل جملة معادلتين من الدرجة الأولى بمجهولين جبريا',
    definition: 'نسمّي حلا للجملة $\\begin{cases} ax + by = c \\\\ a\'x + b\'y = c\' \\end{cases}$ : كل ثنائية $(x_0 ; y_0)$ تكون من أجلها معادلتا الجملة محققتين في آن واحد.',
    rule: 'حل جملة، يعني إيجاد كلّ الثنائيات $(x ; y)$ التي من أجلها تكون معادلتا الجملة محققتين في آن واحد.',
    examples: [
      'في المثال أعلاه: • من أجل $x = 2$ و $y = 0$ نجد: $2 - 0 = 2$ و $2(2) - 5(0) = 4$ منه الثنائية $(2 ; 0)$ حل للجملة.',
      '• من أجل $x = 3$ و $y = 1$ نجد: $3 - 1 = 2$ و $2(3) - 5(1) \\neq 4$ منه الثنائية $(3 ; 1)$ ليست حلا للجملة.',
    ],
    note: 'ملاحظة: في الثنائية $(x ; y)$ الترتيب مهم، فمثلا: إنّ الثنائية $(2 ; 0)$ تختلف عن الثنائية $(0 ; 2)$ ففي الثنائية $(2 ; 0)$ لدينا $x = 2$ و $y = 0$ بينما في الثنائية $(0 ; 2)$ لدينا $x = 0$ و $y = 2$ وهي ليست حلا للجملة في المثال أعلاه.',
  },
  cases: {
    source: src('know-cases', 58, 'معارف'),
    title: 'حالات خاصة',
    items: [
      '1) الجملة $\\begin{cases} 4x + 6y = 2 \\\\ -2x - 3y = -1 \\end{cases}$ تبسّط إلى الشكل $\\begin{cases} 2x + 3y = 1 \\\\ 2x + 3y = 1 \\end{cases}$ أي معادلة واحدة بمجهولين $2x + 3y = 1$ وفيها يمكن حساب قيمة $y$ من أجل أي قيمة نعطيها لـ $x$ ، إذن الجملة المعتبرة لها عدد غير منته من الحلول.',
      '2) الجملة $\\begin{cases} 2x - y = 0 \\\\ -x + \\dfrac{y}{2} = -2 \\end{cases}$ تبسّط إلى الشكل $\\begin{cases} 2x - y = 0 \\\\ 2x - y = 4 \\end{cases}$ وهذا غير ممكن. إذن الجملة المعتبرة ليس لها حلول.',
    ],
  },
};

/**
 * Les calculs que le manuel FAIT sans les écrire dans les حالات خاصة — écrits par la plateforme
 * (déclarés), pour que l'élève voie d'où vient « تبسّط إلى الشكل ».
 */
export const CASES_LINES = {
  source: addition('interaction_generation'),
  infinite: [
    'نقسم طرفي $4x + 6y = 2$ على 2: $2x + 3y = 1$.',
    'نضرب طرفي $-2x - 3y = -1$ في $-1$ : $2x + 3y = 1$.',
    'المعادلتان صارتا معادلة واحدة: كل ثنائية تحقّق $2x + 3y = 1$ حل للجملة، مثل $(2 ; -1)$ و $(-1 ; 1)$.',
  ],
  none: [
    'نضرب طرفي $-x + \\dfrac{y}{2} = -2$ في $-2$ : $2x - y = 4$.',
    'لو وُجدت ثنائية حلّا لكان $2x - y$ يساوي $0$ ويساوي $4$ في آن واحد، و $0 \\neq 4$.',
    'إذن لا توجد أي ثنائية تحقّق المعادلتين معًا: الجملة ليس لها حلول.',
  ],
  // Le cas ordinaire, rappelé : l'activité (une seule ثنائية).
  unique: 'وفي النشاط 1 وجدنا ثنائية واحدة تحقّق المعادلتين: $(13 ; 19)$ — حل وحيد.',
};

/**
 * Les deux exemples de معارف 2 récrits par la plateforme avec « × » (le livre écrit « 2(2) − 5(0) »),
 * pour la carte des connaissances, qui vérifie chaque égalité qu'elle affiche.
 */
export const EXAMPLE_LINES = {
  source: addition('interaction_generation'),
  yes: 'من أجل $x = 2$ و $y = 0$ : $2 - 0 = 2$ و $2 \\times 2 - 5 \\times 0 = 4$ ، فالثنائية $(2 ; 0)$ حل للجملة.',
  no: 'من أجل $x = 3$ و $y = 1$ : $3 - 1 = 2$ لكن $2 \\times 3 - 5 \\times 1 = 1 \\neq 4$ ، فالثنائية $(3 ; 1)$ ليست حلا للجملة.',
};

/**
 * La méthode de vérification d'une ثنائية, dite avec les mots du manuel (معارف 2, ses deux
 * exemples) : on remplace x et y dans CHAQUE équation.
 */
export const CHECK_METHOD = {
  source: src('know-2', 58, 'معارف', 2),
  rule: 'لنعرف هل ثنائية $(x_0 ; y_0)$ حل لجملة، نعوّض $x$ بـ $x_0$ و $y$ بـ $y_0$ في كل معادلة: إذا تحقّقت المعادلتان معًا فهي حل للجملة، وإذا لم تتحقّق إحداهما فليست حلا.',
};

/**
 * « أؤكّد تعلّماتي » (p. 62) — les items 1 à 4 (extraction.json → destinations › qcm ›
 * duplicatedIn › mafhum-jumla, module 4) : l'إختبار أولي.
 */
const QCM_SRC = (n) => src('qcm', 62, 'أؤكّد تعلّماتي', n);
export const QCM = {
  1: { n: 1, source: QCM_SRC(1), text: 'المعادلة $8x - 1 = y$ هي معادلة من الدرجة الأولى ...', options: ['ذات المجهول $x$ .', 'ذات المجهولين $x$ و $y$ .', 'ذات المجهول $y$ .'], correct: 1,
    explain: 'في المعادلة $8x - 1 = y$ مجهولان، $x$ و $y$ ، كلاهما من الدرجة الأولى: تُكتب $8x - y = 1$ ، من الشكل $ax + by = c$ مع $a = 8$ و $b = -1$ و $c = 1$.' },
  2: { n: 2, source: QCM_SRC(2), text: 'الثنائية $(0 ; 0)$ هي حل للمعادلة ...', options: ['$3x + y = 0$', '$x - 3y = 0$', '$\\dfrac{1}{3}x - y = 3$'], correct: [0, 1],
    explain: 'من أجل $x = 0$ و $y = 0$ : $3 \\times 0 + 0 = 0$ و $0 - 3 \\times 0 = 0$ ، أما $\\dfrac{1}{3} \\times 0 - 0 = 0 \\neq 3$.' },
  3: { n: 3, source: QCM_SRC(3), text: 'الثنائية $\\left(\\dfrac{1}{2} ; -\\dfrac{1}{2}\\right)$ هي حل للمعادلة...', options: ['$x + y = 0$', '$2x - \\dfrac{1}{2}y = 0$', '$\\dfrac{1}{2}x + y - \\dfrac{1}{4} = 0$'], correct: 0,
    explain: '$\\dfrac{1}{2} + \\left(-\\dfrac{1}{2}\\right) = 0$ ؛ أما $2 \\times \\dfrac{1}{2} - \\dfrac{1}{2} \\times \\left(-\\dfrac{1}{2}\\right) = \\dfrac{5}{4} \\neq 0$ و $\\dfrac{1}{4} - \\dfrac{1}{2} - \\dfrac{1}{4} = -\\dfrac{1}{2} \\neq 0$.' },
  4: { n: 4, source: QCM_SRC(4), text: 'الجملة $\\begin{cases} 2a - b = 3 \\\\ a - 2b = -5 \\end{cases}$ ...', options: ['هي جملة معادلتين ذات مجهول واحد.', 'ليست جملة معادلتين من الدرجة الأولى.', 'هي جملة معادلتين من الدرجة الأولى ذات المجهولين $a$ و $b$ .'], correct: 2,
    explain: 'المجهولان هنا $a$ و $b$ (اسماهما لا يهمّان)، وكل معادلة من الشكل $\\alpha a + \\beta b = \\gamma$ : جملة معادلتين من الدرجة الأولى بمجهولين.' },
};

/**
 * « أستعدّ » — les items 1 à 8 du manuel (p. 55 ; 9 et 10 vont à la leçon hall-jabri).
 * Trois acquis supposés, diagnostiqués chacun : résoudre une équation du premier degré à une
 * inconnue (1, 3, 8), tester un nombre dans une équation (2, 4, 7), remplacer DEUX lettres pour
 * tester une égalité (5, 6). Aucun n'utilise les nombres du module 1 (32, 13, 19).
 */
const PREP = (n) => src('prep', 55, 'أستعدّ', n);
export const PREP_ITEMS = [
  { n: 1, skill: 'hal', text: 'إذا كان $5x = -3$ فإن $x = -3 - 5$ .', answer: false, why: 'نقسم على 5 ولا نطرح: $x = -\\dfrac{3}{5}$', source: PREP(1) },
  { n: 2, skill: 'taawid', text: 'حل المعادلة $5x = -8$ هو العدد 0.', answer: false, why: '$5 \\times 0 = 0 \\neq -8$ ؛ الحل هو $-\\dfrac{8}{5}$', source: PREP(2) },
  { n: 3, skill: 'hal', text: 'العلاقة $x + 6 = 6x + 1$ هي معادلة من الدرجة الأولى ذات المجهول $x$ .', answer: true, why: 'تؤول إلى $-5x = -5$ : المجهول $x$ من الدرجة الأولى', source: PREP(3) },
  { n: 4, skill: 'taawid', text: 'حل المعادلة $5x - 5 = 5 - 5x$ هو العدد 5.', answer: false, why: '$5 \\times 5 - 5 = 20$ و $5 - 5 \\times 5 = -20$ ؛ الحل هو 1', source: PREP(4) },
  { n: 5, skill: 'harfan', text: 'من أجل $x = 1$ و $y = 0$ ، المساواة $2x - y = 0$ محققة.', answer: false, why: '$2 \\times 1 - 0 = 2 \\neq 0$', source: PREP(5) },
  { n: 6, skill: 'harfan', text: 'من أجل $x = -3$ و $y = -2$ ، المساواتان $x - 2y = 7$ و $\\dfrac{1}{3}x + \\dfrac{1}{3}y = 0$ محققتان معا.', answer: false, why: '$-3 - 2 \\times (-2) = 1 \\neq 7$', source: PREP(6) },
  { n: 7, skill: 'taawid', text: '4 هو حل للمعادلة $3 - 2x = 5$ .', answer: false, why: '$3 - 2 \\times 4 = -5 \\neq 5$ ؛ الحل هو $-1$', source: PREP(7) },
  { n: 8, skill: 'hal', text: 'حل المعادلة $2x + 7 = 3 - x$ هو نفسه حل المعادلة $3x = -4$ .', answer: true, why: 'ننقل $-x$ و 7: $2x + x = 3 - 7$ أي $3x = -4$', source: PREP(8) },
];
