/**
 * Le contenu du MANUEL pour le درس 2 « معادلات جداء معدوم » — données pures
 * (aucun JSX), au mot près ; chaque bloc cite son élément de
 * docs/sources/4am/unit4/extraction.json. Les modules rendent ces données ;
 * ils n'en réécrivent aucune.
 *
 * Le تحدّ (challenge) et l'encadré الخوارزمي (history-khwarizmi) de la page
 * d'ouverture (p. 43) sont destinés à la page de l'unité et DUPLIQUÉS ici
 * (destinations › duplicatedIn › jidaa-maadum, module 3).
 */
import { src, addition } from '../../_unit/unitMeta.js';

/** نشاط 2 (p. 44), partie « الجداء المعدوم ». */
export const ACTIVITY_A = {
  source: src('act-2a', 44, 'أنشطة', 2),
  title: 'خاصية الجداء المعدوم',
  questions: [
    'الجداء المعدوم: انقل وأكمل كلا مما يلي: 1) $2 \\times \\ldots = 0$ ، $\\ldots \\times 5 = 0$ ، $-\\dfrac{3}{7} \\times \\ldots = 0$ ، $\\ldots \\times \\sqrt{3} = 0$',
    '2) $a$ و $b$ عددان، إذا كان $a \\times b = 0$ فإنّ $a = \\ldots$ أو $b = \\ldots$ .',
    '3) عبّر لغويا عن الخاصية السابقة، التي تُسمى خاصية الجداء المعدوم.',
  ],
  // Les quatre produits de س 1, dans l'ordre du livre : le facteur connu et sa place.
  products: [
    { known: '2', missing: 'right' },
    { known: '5', missing: 'left' },
    { known: '-\\dfrac{3}{7}', missing: 'right' },
    { known: '\\sqrt{3}', missing: 'left' },
  ],
  // La réponse de س 3 (extraction › answer.q3) : c'est aussi la phrase de معارف 2.
  statement: 'إذا كان جداء عاملين معدوما فإن أحد هذين العاملين على الأقل معدوم.',
};

/** نشاط 2 (p. 44), « تطبيق أ » — حل معادلة من الشكل (ax + b)(cx + d) = 0. */
export const ACTIVITY = {
  source: src('act-2b', 44, 'أنشطة', 2),
  title: 'حل معادلة من الشكل $(ax + b)(cx + d) = 0$',
  // Les deux cahiers, ligne à ligne (extraction › figure).
  elias: ['$3(x - 5) = 0$', '$3x - 15 = 0$', '$3x = 15$', 'ومنه نجد $x = 5$'],
  amine: ['$3(x - 5) = 0$', '$x - 5 = 0$ بما أنّ $3 \\neq 0$', 'ومنه $x = 5$'],
  questions: [
    '1) لاحظ عمل كل من إلياس وأمين لحل المعادلة $3(x - 5) = 0$ ، وحدّد أيّا منهما استعمل خاصية الجداء المعدوم، واشرح طريقة الآخر.',
    '2) حل المعادلة $-1{,}2(3x + 2{,}7) = 0$ بالطريقة التي استعملها إلياس، ثم بطريقة أمين.',
    '3) حل المعادلة $(x - 2)(x + 5) = 0$ .',
  ],
  // Les nombres du livre : les labs les reçoivent, les questions les lisent.
  numbers: { beginner: '3|x-5', advanced: 'x-2|x+5', q2: { k: '-1,2', a: 3, b: '2,7' } },
  q3note: 'بطريقة إلياس نحصل على $x^2 + 3x - 10 = 0$ : ليست من الدرجة الأولى.',
};

/**
 * L'ACCROCHE — une expérience de la PLATEFORME : le monde est le terrain de football
 * de l'unité 3 (« un produit de deux sommes est l'aire d'un rectangle de côtés ces
 * sommes »). Ici les deux CÔTÉS sont les deux FACTEURS, et l'aire est leur produit.
 * Déclarée, jamais cachée.
 */
export const HOOK = {
  source: addition('interaction_generation'),
  headline: 'متى يختفي الملعب؟',
  text: 'يرسم مدرّب الحيّ ملعب تدريب مستطيلًا، طولا ضلعيه يتعلّقان بعدد $x$ : ضلع طوله $x - 2$ وضلع طوله $x + 5$. مساحة الملعب هي جداء الضلعين $(x - 2)(x + 5)$. حرّك $x$ : متى يصير الملعب خطًّا، أي متى تنعدم مساحته؟',
};

/** نشاط 2 (p. 44), « تطبيق ب » — المعادلة (E). */
export const ACTIVITY_C = {
  source: src('act-2c', 44, 'أنشطة', 2),
  title: 'حل معادلة تؤول إلى الشكل $(ax + b)(cx + d) = 0$',
  text: 'إليك المعادلة (E): $(1 - 4x)(x + 3) + 7(x + 3) = 0$ .',
  questions: [
    '1) تحقّق من أنّ $(1 - 4x)(x + 3) + 7(x + 3) = (x + 3)(8 - 4x)$ .',
    '2) حل المعادلة (E).',
  ],
};

/** معارف 2 (p. 46) — « معادلات جداء معدوم ». */
export const KNOWLEDGE = {
  source: src('know-2', 46, 'معارف', 2),
  title: 'معادلات جداء معدوم',
  definition: 'كل معادلة من الشكل $(ax + b)(cx + d) = 0$ حيث $a$ ، $b$ ، $c$ و $d$ أعداد معلومة، تُسمّى معادلة جداء معدوم.',
  propertyTitle: 'خاصية الجداء المعدوم',
  property: [
    'إذا كان جداء عاملين معدومًا فإن أحد هذين العاملين على الأقل معدوم.',
    'بعبارة أخرى إذا كان $a \\times b = 0$ فإن $a = 0$ أو $b = 0$ .',
  ],
  note: 'تسمح هذه الخاصية بحل معادلة «جُداء معدوم».',
  solutions: 'حلول المعادلة $(ax + b)(cx + d) = 0$ هي حلول المعادلتين $ax + b = 0$ و $cx + d = 0$ .',
  examples: [
    'مثال 1: $(3x - 4)(-2x + 1) = 0$ هي معادلة جُداء معدوم.',
    'مثال 2: $2x = 0$ يعني أنّ $x = 0$ لأنّ $2 \\neq 0$ .',
    'مثال 3: نحل المعادلة $(3x - 4)(-2x + 1) = 0$ .',
  ],
  // مثال 3, ligne à ligne (révélé par MethodSteps).
  example3: [
    '$(3x - 4)(-2x + 1) = 0$ يعني $3x - 4 = 0$ أو $-2x + 1 = 0$ .',
    '$3x - 4 = 0$ يعني $3x = 4$ أي $x = \\dfrac{4}{3}$ .',
    '$-2x + 1 = 0$ يعني $-2x = -1$ أي $x = \\dfrac{1}{2}$ .',
    'إذن للمعادلة $(3x - 4)(-2x + 1) = 0$ حلان هما $\\dfrac{1}{2}$ و $\\dfrac{4}{3}$ .',
  ],
  example3Expr: '3x-4|-2x+1',
};

/** طرائق p. 47 — « حل معادلة من الشكل (ax + b)(cx + d) = 0 ». */
export const METHOD = {
  source: src('method-zero-product', 47, 'طرائق'),
  title: 'حل معادلة من الشكل $(ax + b)(cx + d) = 0$',
  exercise: 'لتكن العبارة $F = (1 - 2x)(4x - 3) - 3(4x - 3)$ . 1) حلّل العبارة F إلى جداء عاملين من الدرجة الأولى. 2) حل المعادلة $(1 - 2x)(4x - 3) - 3(4x - 3) = 0$ .',
  solution: [
    '1) لاحظ: العامل المشترك للجدائين $(1 - 2x)(4x - 3)$ و $3(4x - 3)$ هو $(4x - 3)$ . إذن $F = (4x - 3)[(1 - 2x) - 3]$ ومنه $F = (4x - 3)(-2x - 2)$',
    '2) ممّا سبق نستنتج أنّ حل المعادلة $(1 - 2x)(4x - 3) - 3(4x - 3) = 0$ يؤول إلى حل المعادلة $(4x - 3)(-2x - 2) = 0$ .',
    'ينتج من المعادلة $(4x - 3)(-2x - 2) = 0$ أنّ: $4x - 3 = 0$ أو $-2x - 2 = 0$ . أي $x = \\dfrac{3}{4}$ أو $x = -1$ .',
    'إذن للمعادلة $(1 - 2x)(4x - 3) - 3(4x - 3) = 0$ حلّان هما: $-1$ و $\\dfrac{3}{4}$',
  ],
  // Les deux temps de la solution du manuel, nommés (la plateforme ne fait que les titrer).
  steps: {
    source: addition('interaction_generation'),
    lines: [
      'نحلّل الطرف الأول إلى جداء عاملين من الدرجة الأولى (عامل مشترك أو متطابقة شهيرة).',
      'نطبّق خاصية الجداء المعدوم: نحلّ المعادلتين من الدرجة الأولى، وحلولهما هي حلول المعادلة.',
    ],
  },
};

/** تحدّ (p. 43) — dupliqué depuis la page de l'unité. */
export const CHALLENGE = {
  source: src('challenge', 43, 'تحدّ'),
  text: 'في الشكل المقابل، $x$ يُمثل طول ضلع المربع AEGF. عيّن قيمة $x$ علما أنّ $x^2 + 12x = 85$',
  figure: 'مربع ABCD مقسّم إلى المربع AEGF (ضلعه $x$)، والمستطيلين EBHG و FGKD (بعدا كل منهما $x$ و 6)، والمربع GHCK (ضلعه 6) ؛ $EB = 6$ و $FD = 6$.',
  side: 6,
  rhs: 85,
};

/** Le الخوارزمي (p. 43) — dupliqué depuis la page de l'unité. */
export const KHWARIZMI = {
  source: src('history-khwarizmi', 43, 'الخوارزمي'),
  caption: 'الخوارزمي (780م-850م)',
  quote: 'جاء في كتاب الخوارزمي المثل الآتي: «... وأمّا الأموال والعدد التي تعدل الجذور فنحو قولك مال وواحد وعشرون من العدد يعدل 10 أجذاره» وبحسب الرموز الحالية تكون المعادلة: $x^2 + 21 = 10x$ . وقد حلّها واستخرج جذريها 3 و 7.',
  kinds: 'قسّم الخوارزمي الأعداد التي يحتاج إليها في الجبر إلى ثلاثة أنواع : جذر أي «$x$» ومال أي «$x^2$» ومفرد وهو العدد الخالي من «$x$».',
};

/** Ligne discrète sur l'exercice 19 (extraction › ex-19.discrepancy). */
export const EX19_NOTE = {
  source: addition('interaction_generation'),
  text: 'ملاحظة: هنا $p = 10(x + 5)$ ، جداء العدد 10 والعامل $(x + 5)$ من الدرجة الأولى. العامل 10 لا ينعدم، فللمعادلة $p = 0$ حلّ واحد.',
};

/**
 * « أؤكّد تعلّماتي » (p. 52) — les items 3 et 4 (destinations › qcm › duplicatedIn ›
 * jidaa-maadum, module 5) : l'إختبار أولي.
 */
const QCM_SRC = (n) => src('qcm', 52, 'أؤكّد تعلّماتي', n);
export const QCM = {
  3: { n: 3, source: QCM_SRC(3), text: 'المعادلة $(x - 3)(2x + 2) = 0$ تقبل...', options: ['حلا واحدا هو 3', 'حلا واحدا هو $-1$', 'حلين هما 3 و $-1$'], correct: 2,
    explain: '$(x - 3)(2x + 2) = 0$ يعني $x - 3 = 0$ أو $2x + 2 = 0$ ، أي $x = 3$ أو $x = -1$ : حلّان.' },
  4: { n: 4, source: QCM_SRC(4), text: 'المعادلة $x^2 - 1 = 0$ تقبل ...', options: ['حلين هما 1 و $-1$', 'حلا واحدا هو 1', 'حلا واحدا هو $-1$'], correct: 0,
    explain: '$x^2 - 1 = (x - 1)(x + 1)$ ، و $(x - 1)(x + 1) = 0$ يعني $x = 1$ أو $x = -1$ .' },
};

/**
 * « أستعدّ » — items 3, 4 et 5 du manuel (p. 43 : le نشر et l'analyse), puis des
 * affirmations de la PLATEFORME, dans la même forme, pour les autres acquis que la
 * leçon suppose : résoudre ax + b = 0 (leçon 1), le produit de relatifs, et une
 * affirmation FAUSSE par compétence (les trois items du livre sont vrais). Aucune
 * n'utilise les nombres du module 1 (3(x − 5), (x − 2)(x + 5), −1,2(3x + 2,7)).
 */
export const PREP_ITEMS = [
  { n: 3, skill: 'nashr', text: 'الجداء $x(x - 1)$ ينشر على الشكل $x^2 - x$ .', answer: true, why: '$x \\times x - x \\times 1 = x^2 - x$', source: src('prep', 43, 'أستعدّ', 3) },
  { n: 4, skill: 'tahlil', text: 'المجموع $x + 4x^2$ يحلل على الشكل $x(4x + 1)$ .', answer: true, why: '$x(4x + 1) = 4x^2 + x$', source: src('prep', 43, 'أستعدّ', 4) },
  { n: 5, skill: 'huwiya', text: 'المجموع $b^2 + 16b + 64$ يحلل على الشكل $(b + 8)^2$ .', answer: true, why: '$(b + 8)^2 = b^2 + 2 \\times 8 \\times b + 8^2 = b^2 + 16b + 64$', source: src('prep', 43, 'أستعدّ', 5) },
  { skill: 'nashr', text: 'الجداء $-2(x - 4)$ ينشر على الشكل $-2x - 8$ .', answer: false, why: '$-2 \\times x - 2 \\times (-4) = -2x + 8$', source: addition('prerequisite_diagnostic') },
  { skill: 'huwiya', text: 'المجموع $x^2 - 9$ يحلل على الشكل $(x - 3)^2$ .', answer: false, why: '$(x - 3)^2 = x^2 - 6x + 9$ ؛ الصحيح $x^2 - 9 = x^2 - 3^2 = (x - 3)(x + 3)$', source: addition('prerequisite_diagnostic') },
  { skill: 'muadala', text: 'حل المعادلة $4x + 6 = 0$ هو $\\dfrac{3}{2}$ .', answer: false, why: '$4x = -6$ أي $x = -\\dfrac{6}{4} = -\\dfrac{3}{2}$ ؛ والتحقّق: $4 \\times \\dfrac{3}{2} + 6 = 12 \\neq 0$', source: addition('prerequisite_diagnostic') },
  { skill: 'muadala', text: 'حل المعادلة $-5x + 2 = 0$ هو $\\dfrac{2}{5}$ .', answer: true, why: '$-5 \\times \\dfrac{2}{5} + 2 = -2 + 2 = 0$', source: addition('prerequisite_diagnostic') },
  { skill: 'darb', text: '$\\left(-\\dfrac{7}{2}\\right) \\times 0 = -\\dfrac{7}{2}$ .', answer: false, why: 'جداء أي عدد في 0 يساوي 0 : $\\left(-\\dfrac{7}{2}\\right) \\times 0 = 0$', source: addition('prerequisite_diagnostic') },
  { skill: 'darb', text: '$(-6) \\times (-1{,}5) = 9$ .', answer: true, why: 'جداء عددين سالبين موجب، و $6 \\times 1{,}5 = 9$', source: addition('prerequisite_diagnostic') },
];

/**
 * إلياس وأمين — les corrections que le module 1 écrit (س 1 et س 3), réunies ici
 * pour que la carte les cite au mot près.
 */
export const ELIAS_AMINE = {
  source: addition('interaction_generation'),
  eliasMethod: 'إلياس لم يستعمل الخاصية: نشر $3(x - 5)$ فحصل على معادلة من الدرجة الأولى $3x - 15 = 0$ ثم حلّها.',
  amineMethod: 'أمين استعمل خاصية الجداء المعدوم: بما أنّ $3 \\neq 0$ فإنّ العامل الآخر معدوم، $x - 5 = 0$ .',
  expandFails: 'نشر $(x - 2)(x + 5)$ لا يوصلنا إلى معادلة من الدرجة الأولى، أمّا خاصية الجداء المعدوم فتعطي معادلتين من الدرجة الأولى: $x - 2 = 0$ أو $x + 5 = 0$ ، أي $x = 2$ أو $x = -5$ .',
};
