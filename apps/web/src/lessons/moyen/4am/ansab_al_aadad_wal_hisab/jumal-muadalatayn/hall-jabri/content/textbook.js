/**
 * Le contenu du MANUEL pour le درس 2 « حل جملة معادلتين من الدرجة الأولى بمجهولين جبرياً (طريقتا
 * التعويض والجمع) » — données pures (aucun JSX), au mot près ; chaque bloc cite son élément de
 * docs/sources/4am/unit5/extraction.json. Les modules rendent ces données ; ils n'en
 * réécrivent aucune.
 */
import { src, addition } from '../../_unit/unitMeta.js';

/** نشاط 2 (p. 56) — « حل جملة معادلتين من الدرجة الأولى بمجهولين جبريا ». */
const ACT_SRC = src('act-2', 56, 'أنشطة', 2);
export const ACTIVITY = {
  source: ACT_SRC,
  title: 'حل جملة معادلتين من الدرجة الأولى بمجهولين جبريا',
  text: 'إليك جملة المعادلتين الآتية: $\\begin{cases} 2x + y = 7 & ...(1) \\\\ 3x - 2y = 4{,}2 & ...(2) \\end{cases}$',
  questions: [
    'أ) تحقق أنّ الثنائيّة $(2 ; 3)$ حل للمعادلة (1)؟ هل هي حل لجملة المعادلتين؟',
    'ب) اقترح ثنائية أخرى حلا للمعادلة (1). هل هي حل لجملة المعادلتين؟',
    'جـ) لحل هذه الجملة كتب تلميذان:',
    '1) اشرح عمل كل من التلميذين، واستنتج حل الجملة.',
    '2) حل باستعمال الطريقتين السّابقتين جملة المعادلتين الآتية: $\\begin{cases} x + 4y = 7 \\\\ 5x + 3y = 1 \\end{cases}$',
  ],
  // Le tableau « لحل هذه الجملة كتب تلميذان » (figure de la p. 56), ligne par ligne, au mot près.
  students: {
    1: [
      'من المعادلتين (1) و (2) نحصل على المعادلة: $3x - 2(7 - 2x) = 4{,}2$ وهي معادلة من الدرجة الأولى بالمجهول $x$ .',
      'وبحلها نجد $x = 2{,}6$ .',
      'وبالتعويض في إحدى المعادلتين (1) أو (2) نجد $y = 1{,}8$ .',
    ],
    2: [
      'بضرب المعادلة (1) في العدد 2 نجد $4x + 2y = 14$',
      'وبالجمع مع المعادلة (2) طرفا الى طرف نجد المعادلة ذات المجهول $x$ : $7x = 18{,}2$ وهي المعادلة من الدرجة الأولى',
      'وبحلّها نجد $x = 2{,}6$ .',
      'وبالتعويض في إحدى المعادلتين (1) أو (2) نجد $y = 1{,}8$ .',
    ],
  },
  // Les jumal du نشاط (la forme « (1)|(2) » que lit le laboratoire et linearSystem).
  systems: { main: '2x+y=7|3x-2y=4,2', second: 'x+4y=7|5x+3y=1' },
};

/**
 * L'ACCROCHE (REAL) — une situation de la PLATEFORME : le kiosque du quartier. Ses deux cartes
 * donnent 2x + y = 70 et 3x − 2y = 42 : les coefficients du نشاط 2, des seconds membres dix
 * fois plus grands. Elle revient en TRANSFERT à la fin du module 1. Déclarée, jamais cachée.
 */
export const HOOK = {
  source: addition('interaction_generation'),
  headline: 'لغز كشك الحي!',
  text: 'سقطت لوحة الأسعار في كشك «عمّي الطاهر» قرب المتوسطة، وبقيت بطاقتان بخط البائع: «قطعتا كرنتيكة وقارورة قازوز: 70 DA» و«ثمن 3 قطع كرنتيكة يزيد بـ 42 DA عن ثمن قارورتي قازوز». كل بطاقة وحدها تقبل أثمانًا كثيرة… أمّا البطاقتان معًا فتحدّدان الثمنين. كيف نجدهما دون أن نجرّب كل الأعداد؟',
  unknowns: 'نرمز بـ $x$ إلى ثمن قطعة كرنتيكة وبـ $y$ إلى ثمن قارورة قازوز (بالدينار).',
  system: '2x+y=70|3x-2y=42',
  systemTex: '\\begin{cases} 2x + y = 70 \\\\ 3x - 2y = 42 \\end{cases}',
  answer: { x: '26', y: '18' },
  closing: 'المعاملات هي معاملات جملة النشاط 2، والطرفان الثانيان مضروبان في 10: فالحل هو حل النشاط مضروبًا في 10، $(26 ; 18)$ . للتحقق: $2 \\times 26 + 18 = 70$ و $3 \\times 26 - 2 \\times 18 = 78 - 36 = 42$ . قطعة الكرنتيكة بـ 26 DA وقارورة القازوز بـ 18 DA.',
};

/**
 * Ce que les deux élèves ont fait, posé en briques au module 1 — des phrases de la PLATEFORME
 * qui disent avec les nombres du نشاط ce que le tableau du manuel montre sans l'encadrer.
 */
export const IDEAS = {
  source: addition('interaction_generation'),
  takhallus: 'في العملين تخلّص التلميذ من أحد المجهولين فحصل على معادلة من الدرجة الأولى بمجهول واحد: $3x - 2(7 - 2x) = 4{,}2$ عند التلميذ 1، و $7x = 18{,}2$ عند التلميذ 2.',
  thunaiya: 'بعد إيجاد $x = 2{,}6$ نعوّض في إحدى المعادلتين لنجد $y = 1{,}8$ : حل الجملة هو الثنائية $(2{,}6 ; 1{,}8)$ ، ونتحقّق منها في المعادلتين: $2 \\times 2{,}6 + 1{,}8 = 7$ و $3 \\times 2{,}6 - 2 \\times 1{,}8 = 4{,}2$ .',
  check: 'للتحقق، نعوّض $x$ و $y$ في المعادلتين معًا: الثنائية حل للجملة إذا تحقّقت المعادلتان في آن واحد.',
};

/** طرائق p. 59 — « حل جملة معادلتين من الدرجة الأولى بمجهولين » : l'exercice résolu (deux jumal). */
const METHOD_SRC = src('method-example', 59, 'طرائق');
export const METHOD = {
  source: METHOD_SRC,
  title: 'حل جملة معادلتين من الدرجة الأولى بمجهولين',
  exercise: 'حل كل من الجملتين: $\\begin{cases} 3x + y = -4 \\\\ x - y = 2 \\end{cases}$ ....(1) و $\\begin{cases} 4x + 2y = 9 \\\\ -4x + 3y = 6 \\end{cases}$ ....(2)',
  one: {
    source: METHOD_SRC,
    exercise: 'الجملة (1): $\\begin{cases} 3x + y = -4 \\\\ x - y = 2 \\end{cases}$',
    solution: [
      'حل الجملة (1) بطريقة التعويض.',
      'من المعادلة $x - y = 2$ ينتج أن $y = x - 2$ .',
      'بتعويض $y$ بالعبارة $x - 2$ في المعادلة $3x + y = -4$ نجد: $3x + (x - 2) = -4$ . هذه المعادلة تبسّط على الشكل $4x - 2 = -4$ . إذن $4x = -2$ . بالتالي $x = -\\dfrac{1}{2}$',
      'نعوض $x$ بالعدد $-\\dfrac{1}{2}$ في المعادلة $y = x - 2$ ونجد $y = -\\dfrac{1}{2} - 2$ . بالتالي $y = -\\dfrac{5}{2}$ . إذن $x = -\\dfrac{1}{2}$ و $y = -\\dfrac{5}{2}$ .',
      'للتحقق، نعوض $x$ بالعدد $-\\dfrac{1}{2}$ و $y$ بالعدد $-\\dfrac{5}{2}$ في الجملة المعطاة ونجد: $3\\left(-\\dfrac{1}{2}\\right) - \\dfrac{5}{2} = -4$ و $-\\dfrac{1}{2} - \\left(-\\dfrac{5}{2}\\right) = 2$ بالتالي الثنائية $\\left(-\\dfrac{1}{2} ; -\\dfrac{5}{2}\\right)$ تحقق الجملة (1).',
      'إذن الثنائية $\\left(-\\dfrac{1}{2} ; -\\dfrac{5}{2}\\right)$ هي الحل الوحيد للجملة.',
    ],
  },
  two: {
    source: METHOD_SRC,
    exercise: 'الجملة (2): $\\begin{cases} 4x + 2y = 9 \\\\ -4x + 3y = 6 \\end{cases}$',
    solution: [
      'حل الجملة (2) بطريقة الجمع والتعويض.',
      'بجمع المعادلتين في الجملة (2) طرفا بطرف، نحصل على: $5y = 15$ . منه $y = 3$ .',
      'بالتعويض عن قيمة $y$ في إحدى المعادلتين، نجد: $4x + 2 \\times 3 = 9$ . منه $x = \\dfrac{3}{4}$ .',
      'للتحقق، نعوّض $x$ بالقيمة $\\dfrac{3}{4}$ و $y$ بالقيمة 3 في المعادلتين ونجد: $4\\left(\\dfrac{3}{4}\\right) + 2 \\times 3 = 9$ و $-4\\left(\\dfrac{3}{4}\\right) + 3 \\times 3 = 6$ أي أنّ الثنائية $\\left(\\dfrac{3}{4} ; 3\\right)$ تحقق الجملة (2).',
      'إذن الثنائية $\\left(\\dfrac{3}{4} ; 3\\right)$ هي الحل الوحيد للجملة.',
    ],
  },
};

/** طرائق p. 59 — l'encadré « طريقة ». */
export const METHOD_BOX = {
  source: src('method-systems', 59, 'طرائق'),
  title: 'طريقة',
  text: 'لحل جملة معادلتين من الدرجة الأولى بمجهولين، يمكن استعمال إحدى الطريقتين:',
  items: [
    'طريقة التعويض: بالتعبير عن أحد المجهولين بدلالة الآخر من إحدى المعادلتين، ثم تعويض ذلك المجهول بالعبارة الناتجة في المعادلة الأخرى.',
    'طريقة الجمع: نضرب طرفي كل معادلة بمعامل مناسب ثم نجمع المعادلتين طرفًا لطرف للحصول على معادلة من الدرجة الأولى بمجهول واحد.',
  ],
};

/**
 * Choisir la méthode (point d'apprentissage P3 du catalogue) : le manuel dit « طريقة من اختيارك »
 * et « باختيار طريقة مناسبة » (تمارين 9 → 13) sans encadré. La règle de choix est une phrase de
 * la PLATEFORME, lue sur les coefficients — déclarée comme telle.
 */
export const CHOICE = {
  source: addition('interaction_generation'),
  rule: 'نختار الطريقة الأنسب بالنظر إلى المعاملات: إذا كان معامل أحد المجهولين $1$ أو $-1$ في إحدى المعادلتين فالتعويض سهل، لأنّ العبارة الناتجة لا كسور فيها؛ وإذا كان معاملا أحد المجهولين متعاكسين، أو يصيران كذلك بضرب معادلة في عدد بسيط، فالجمع أسرع.',
  sub: 'في الجملة (1) معامل $y$ في $x - y = 2$ هو $-1$ : التعويض مناسب.',
  add: 'في الجملة (2) معاملا $x$ متعاكسان ($4x$ و $-4x$): الجمع مباشرة.',
};

/**
 * « أؤكّد تعلّماتي » (p. 62) — les items 5 et 6 (extraction.json → destinations › qcm ›
 * duplicatedIn › hall-jabri, module 4 de l'extraction) : l'إختبار أولي, module 7 depuis les « مسائل ».
 */
const QCM_SRC = (n) => src('qcm', 62, 'أؤكّد تعلّماتي', n);
export const QCM = {
  5: {
    n: 5, source: QCM_SRC(5),
    text: 'إليك الجملة الآتية: $\\begin{cases} 3x - y = -1 \\\\ 3x + y = 5 \\end{cases}$ حل هذه الجملة هو...',
    options: ['$(1 ; 4)$', '$(4 ; 1)$', '$\\left(\\dfrac{2}{3} ; 3\\right)$'],
    correct: 2,
    explain: 'بجمع المعادلتين طرفًا لطرف: $6x = 4$ أي $x = \\dfrac{2}{3}$ ، ثم $y = 3x + 1 = 3$ . للتحقق: $3 \\times \\dfrac{2}{3} - 3 = -1$ و $3 \\times \\dfrac{2}{3} + 3 = 5$ . أمّا $(1 ; 4)$ فتحقق المعادلة الأولى وحدها، و $(4 ; 1)$ لا تحقق أيًّا منهما.',
  },
  6: {
    n: 6, source: QCM_SRC(6),
    text: 'من المعادلة $3x - y = 1$ ينتج أن...',
    options: ['$y = 3x - 1$', '$x = \\dfrac{y + 1}{3}$', '$3x = y + 1$'],
    correct: [0, 1, 2],
    explain: 'الكتابات الثلاث صحيحة: ننقل $-y$ أو $1$ بتغيير الإشارة ($3x = y + 1$ ثم $y = 3x - 1$)، ونقسم طرفي $3x = y + 1$ على 3 ($x = \\dfrac{y + 1}{3}$).',
  },
};

/**
 * « أستعدّ » — items 9 et 10 du manuel (p. 55 : extraction › prep › items 9-10 → hall-jabri),
 * puis des affirmations de la PLATEFORME, même forme (« أصحيح أم خاطئ؟ برّر إجابتك »), pour les
 * autres acquis supposés : transposer un terme, remplacer une inconnue par une valeur, multiplier
 * les deux membres d'une égalité, résoudre une équation du premier degré à une inconnue. Aucune
 * n'utilise les nombres du module 1 (2x + y = 7, 3x − 2y = 4,2, x + y = 10, x − y = 2).
 */
export const PREP_ITEMS = [
  { n: 9, skill: 'naql', text: 'إذا كان $y + 2x = 1$ فإنّ $y = 1 + 2x$ .', answer: false, why: 'نطرح $2x$ من الطرفين: $y = 1 - 2x$', source: src('prep', 55, 'أستعدّ', 9) },
  { n: 10, skill: 'taawid', text: 'إذا كان $y + 2x = 1$ و $x = 3$ فإنّ $y = 5$ .', answer: false, why: '$y + 6 = 1$ أي $y = -5$', source: src('prep', 55, 'أستعدّ', 10) },
  { skill: 'naql', text: 'إذا كان $x - 3y = 6$ فإنّ $x = 6 + 3y$ .', answer: true, why: 'نضيف $3y$ إلى الطرفين: $x - 3y + 3y = 6 + 3y$ .', source: addition('prerequisite_diagnostic') },
  { skill: 'taawid', text: 'إذا كان $3x + y = 10$ و $y = 4$ فإنّ $x = 2$ .', answer: true, why: '$3x + 4 = 10$ أي $3x = 6$ ومنه $x = 2$ .', source: addition('prerequisite_diagnostic') },
  { skill: 'darb', text: 'إذا كان $x + 2y = 5$ فإنّ $3x + 6y = 15$ .', answer: true, why: 'نضرب الطرفين معًا في 3: $3(x + 2y) = 3 \\times 5$ .', source: addition('prerequisite_diagnostic') },
  { skill: 'darb', text: 'إذا كان $a - b = 4$ فإنّ $2a - 2b = 4$ .', answer: false, why: 'ضربنا طرفًا واحدًا في 2: $2a - 2b = 2 \\times 4 = 8$ .', source: addition('prerequisite_diagnostic') },
  { skill: 'hal', text: 'حل المعادلة $-5x = 15$ هو $-3$ .', answer: true, why: '$x = \\dfrac{15}{-5} = -3$ ، وللتحقق $-5 \\times (-3) = 15$ .', source: addition('prerequisite_diagnostic') },
  { skill: 'hal', text: 'حل المعادلة $4x - 3 = 9$ هو $\\dfrac{3}{2}$ .', answer: false, why: '$4x = 9 + 3 = 12$ ومنه $x = 3$ ؛ و $4 \\times \\dfrac{3}{2} - 3 = 3 \\neq 9$ .', source: addition('prerequisite_diagnostic') },
];
