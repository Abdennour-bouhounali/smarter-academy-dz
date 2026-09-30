import { src, addition } from '../../_unit/unitMeta.js';

/**
 * « أستعدّ » (module 0) — le manuel n'a qu'un seul « أستعدّ » pour toute
 * l'unité (p. 7, items 1–10 : leçons 1 et 8). Ces affirmations sont donc des
 * AJOUTS DE LA PLATEFORME, déclarés comme tels (SourceTag « عبارة إضافية من المنصّة ») : même
 * forme que le manuel (« أصحيح أم خاطئ؟ برّر إجابتك »), une ou plusieurs par
 * acquis de `priorKnowledge`, jamais les nombres de l'activité qui suit.
 */
export const PREP_ITEMS = [
  { n: 1, skill: 'jidaa', text: 'العدد 12 يقسم 84 لأنّ $84 = 12 \\times 7$.', answer: true, why: 'نجد عددًا طبيعيًا $q = 7$ حيث $84 = 12 \\times q$.' },
  { n: 2, skill: 'jidaa', text: 'العدد 4 يقسم 30 لأنّ 30 عدد زوجي.', answer: false, why: '$30 = 4 \\times 7 + 2$: الباقي غير معدوم. كون العدد زوجيًا يعني فقط أنّ 2 يقسمه.' },
  { n: 3, skill: 'jidaa', text: 'العدد 5 يقسم $5 \\times 23$.', answer: true, why: '$5 \\times 23 = 5 \\times q$ مع $q = 23$: هذه هي الكتابة $a = b \\times q$ نفسها.' },
  { n: 4, skill: 'qisma', text: 'المساواة $100 = 7 \\times 13 + 9$ تعبّر عن القسمة الإقليدية للعدد 100 على 7.', answer: false, why: 'المساواة صحيحة لكنّ الباقي 9 ليس أصغر من 7؛ القسمة الإقليدية: $100 = 7 \\times 14 + 2$.' },
  { n: 5, skill: 'qisma', text: 'المساواة $100 = 7 \\times 14 + 2$ تعبّر أيضًا عن القسمة الإقليدية للعدد 100 على 14.', answer: true, why: 'الباقي 2 أصغر من 14: حاصل قسمة 100 على 14 هو 7 والباقي 2.' },
  { n: 6, skill: 'qisma', text: 'باقي القسمة الإقليدية للعدد 250 على 25 هو 10.', answer: false, why: '$250 = 25 \\times 10 + 0$: حاصل القسمة 10 والباقي معدوم.' },
].map((it) => ({ ...it, source: addition('prerequisite_diagnostic') }));

export const ACTIVITY = {
  source: src('act-3', 8, 'أنشطة', 3),
  title: 'خواص قواسم عدد طبيعي',
  cases: [{ a: 18, b: 12, n: 3 }, { a: 35, b: 15, n: 5 }, { a: 56, b: 21, n: 7 }],
  questions: [
    'أ) تحقّق من أن $n$ يقسم كلا من العددين $a$ و $b$ في كل حالة من الحالات التالية:',
    'ب) تحقّق في كل حالة، من أن العدد $n$ يقسم العدد $a + b$ ويقسم العدد $a - b$.',
    'جـ) تحقّق في كل حالة من أنّ $n$ يقسم باقي القسمة الإقليدية للعدد $a$ على العدد $b$.',
  ],
  conjectures: [
    { blank: '(إذا كان العدد $n$ ..... كلا من العددين $a$ و $b$ فإن $n$ يقسم ...... و $n$ يقسم ......).', full: 'إذا كان العدد n يقسم كلا من العددين a و b فإن n يقسم a + b و n يقسم a − b.' },
    { blank: '(إذا كان العدد $n$ ..... كلا من العددين $a$ و $b$ فإن $n$ يقسم باقي القسمة .....).', full: 'إذا كان العدد n يقسم كلا من العددين a و b فإن n يقسم باقي القسمة الإقليدية للعدد a على b.' },
  ],
};

export const KNOWLEDGE = {
  source: src('know-2', 10, 'معارف', 2),
  properties: [
    { id: 'prop-1', title: 'خاصية 1', text: '$a$ ، $b$ و $n$ أعداد طبيعية غير معدومة. • إذا كان $n$ يقسم كلا من $a$ و $b$ فإن $n$ يقسم $a + b$ و $a - b$ $(a \\geq b)$. • إذا كان $n$ يقسم $a$ فإن $n$ يقسم $k \\times a$ حيث $k$ عدد طبيعي.',
      example: '9 يقسم 90 و يقسم 900. إذن 9 يقسم $900 - 90$ أي يقسم 810. و 9 يقسم $900 + 90$ أي يقسم 990.' },
    { id: 'prop-2', title: 'خاصية 2', text: '$a$ ، $b$ ، $n$ أعداد طبيعية غير معدومة حيث $a > b$. إذا كان $n$ يقسم كلا من $a$ و $b$ فإن $n$ يقسم باقي القسمة الإقليدية للعدد $a$ على $b$.',
      example: '5 يقسم كلا من 90 و 25 إذن 5 يقسم باقي القسمة الإقليدية للعدد 90 على 25 أي يقسم 15.', division: { dividend: 90, divisor: 25, quotient: 3, remainder: 15 } },
  ],
};

export const PROOF = {
  source: src('method-proof', 11, 'طرائق'),
  title: 'أتعلّم البرهنة',
  question: '«كيف أبرهن صحة خاصية من الشّكل «إذا ... فإنّ ...»؟»',
  exercise: '$n$ ، $a$ و $b$ أعداد طبيعية حيث $n \\neq 0$. برهن أنه إذا كان $n$ يقسم كلا من $a$ و $b$ فإنّ $n$ يقسم $a + b$.',
  solution: [
    'المعطيات: $n$ ، $a$ و $b$ أعداد طبيعية حيث $n \\neq 0$. $n$ يقسم كلا من $a$ و $b$.',
    'المطلوب: $n$ يقسم $a + b$.',
    'برهان: لكي نبرهن أن $n$ يقسم $a + b$ يكفي إيجاد عدد طبيعي $k$ حيث $a + b = n \\times k$.',
    'لدينا من المعطيات $n$ يقسم كلا من $a$ و $b$.',
    'إذن يوجد عددان طبيعيان $q$ و $q\'$ حيث $a = n \\times q$ و $b = n \\times q\'$.',
    'ومنه $a + b = n \\times q + n \\times q\'$ وبالتالي $a + b = n(q + q\')$.',
    'بوضع $q + q\' = k$ نجد $a + b = n \\times k$.',
    'بالتالي فإنّ $a + b = n \\times k$ وهذا يعني أنّ $n$ يقسم $a + b$.',
  ],
  rule: ['• لإثبات صحة خاصية من الشّكل «إذا ... فإنّ ...» نفرض صحة الشرط ونتأكد من صحة النتيجة.', '• لإثبات أنّ عددا طبيعيا $d$ يقسم عددا آخر $m$ يكفي إيجاد عدد طبيعي $k$ حيث $m = d \\times k$.'],
};

export const TRY_NOW_2 = {
  source: src('now-11-2', 11, 'دوري الآن', 2),
  text: '$n$ ، $a$ و $b$ أعداد طبيعية حيث $a > b$ و $n \\neq 0$. برهن أنه إذا كان $n$ يقسم كلا من $a$ و $b$ فإن $n$ يقسم $a - b$.',
  solution: ['المعطيات: $n$ يقسم $a$ و $b$؛ المطلوب: $n$ يقسم $a - b$.', 'يوجد $q$ و $q\'$ حيث $a = n \\times q$ و $b = n \\times q\'$ (مع $q \\geq q\'$ لأن $a > b$).', 'ومنه $a - b = n \\times q - n \\times q\' = n(q - q\')$.', 'بوضع $k = q - q\'$ (عدد طبيعي) نجد $a - b = n \\times k$، إذن $n$ يقسم $a - b$.'],
};
