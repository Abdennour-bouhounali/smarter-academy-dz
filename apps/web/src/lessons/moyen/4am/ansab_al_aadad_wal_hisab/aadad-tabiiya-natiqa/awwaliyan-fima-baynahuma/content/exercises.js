import { src } from '../../_unit/unitMeta.js';
export const LP = { P1: '4am_awwaliyan-fima-baynahuma_P1', P2: '4am_awwaliyan-fima-baynahuma_P2', P3: '4am_awwaliyan-fima-baynahuma_P3' };
const S = (n) => src(`ex-${n}`, 15, 'أوظّف تعلّماتي', n);
export const EXERCISES = [
  { id: 'ex-23', source: S(23), learningPointId: LP.P2, difficulty: 'facile', statement: 'بيّن أن العددين 143 و 153 أوليان فيما بينهما.', interaction: 'numeric',
    question: { prompt: 'PGCD(143 ; 153) = ?', expected: 1, explain: '$153 = 143 \\times 1 + 10$ ، $143 = 10 \\times 14 + 3$ ، $10 = 3 \\times 3 + 1$ ، $3 = 1 \\times 3 + 0$: القاسم المشترك الأكبر 1، فالعددان أوليان فيما بينهما.' } },
  { id: 'ex-24', source: S(24), learningPointId: LP.P2, difficulty: 'facile', statement: 'هل العددان 104 و 147 أوليان فيما بينهما؟', interaction: 'choice',
    question: { options: ['نعم: PGCD(104 ; 147) = 1', 'لا: كلاهما يقبل القسمة على 2', 'لا: كلاهما يقبل القسمة على 3', 'لا: PGCD(104 ; 147) = 13'], correct: 0, cols: 2,
      explain: '$147 = 104 \\times 1 + 43$ ، $104 = 43 \\times 2 + 18$ ، $43 = 18 \\times 2 + 7$ ، $18 = 7 \\times 2 + 4$ ، $7 = 4 \\times 1 + 3$ ، $4 = 3 \\times 1 + 1$: آخر باقٍ غير معدوم 1.' } },
  { id: 'ex-25', source: S(25), learningPointId: LP.P2, difficulty: 'facile', statement: 'بيّن أن العددين الطبيعيين 56 و 65 أوليان فيما بينهما.', interaction: 'numeric',
    question: { prompt: 'PGCD(56 ; 65) = ?', expected: 1, explain: '$65 = 56 \\times 1 + 9$ ، $56 = 9 \\times 6 + 2$ ، $9 = 2 \\times 4 + 1$ ، $2 = 1 \\times 2 + 0$.' } },
  { id: 'ex-26', source: S(26), learningPointId: LP.P2, difficulty: 'moyen', items: ['1) بين أن العددين الطبيعيين 23 و 29 أوليان فيما بينهما.', '2) برهن أن $\\dfrac{207}{261} = \\dfrac{23}{29}$.', '3) عيّن العدد الطبيعي $a$ حيث $\\dfrac{207}{261} = \\dfrac{161}{161 + a}$.'], interaction: 'numeric',
    question: { prompt: '3) a = ?', expected: 42, explain: '1) قواسم 23: 1 ، 23؛ قواسم 29: 1 ، 29 → PGCD = 1. 2) $207 = 9 \\times 23$ و $261 = 9 \\times 29$. 3) $161 = 7 \\times 23$ فالمقام $7 \\times 29 = 203$، أي $a = 42$.' } },
  { id: 'ex-27', source: S(27), learningPointId: LP.P3, difficulty: 'moyen', statement: 'بيّن بدون إجراء أي حساب، في كل حالة من الحالات الآتية، أن العددين $a$ و $b$ ليسا أوليين فيما بينهما.', interaction: 'batch',
    question: { prompt: 'اختر قاسمًا مشتركًا يختلف عن 1 لكل زوج:', rows: [
      { label: 'أ) $a = 152$ و $b = 250$', options: ['2', '5', '9'], correct: 0, correction: 'كلاهما زوجي.' },
      { label: 'ب) $a = 18$ و $b = 135$', options: ['2', '5', '9'], correct: 2, correction: 'مجموع أرقام كل منهما 9.' },
      { label: 'جـ) $a = 235$ و $b = 1840$', options: ['2', '9', '5'], correct: 2, correction: 'ينتهي أحدهما بـ 5 والآخر بـ 0.' },
      { label: 'د) $a = 87$ و $b = 84$', options: ['3', '5', '2'], correct: 0, correction: '8 + 7 = 15 و 8 + 4 = 12.' },
      { label: 'هـ) $a = 12\\,345$ و $b = 67\\,895$', options: ['2', '3', '5'], correct: 2, correction: 'كلاهما ينتهي بـ 5.' } ],
      explain: 'قاسم مشترك يختلف عن 1 يكفي لنفي أن العددين أوليان فيما بينهما — قواعد قابلية القسمة تعطيه دون حساب.' } },
  { id: 'ex-39', source: S(39), learningPointId: LP.P3, difficulty: 'difficile',
    statement: 'اختبرت ليلى قواعد قابلية القسمة على 2 ، 3 ، 4 ، 5 ، 9 و 10 فلاحظت أن كلا من العددين 253 و 407 لا يقبلان القسمة على هذه الأعداد. عندئذ، استنتجت أن العددين 253 و 407 أوليان فيما بينهما. هل توافقها؟ علّل. إذا كانت الإجابة «لا»، اقترح طريقة مناسبة لذلك.', interaction: 'choice',
    question: { options: ['لا: قد يكون لهما قاسم مشترك آخر؛ بخوارزمية إقليدس PGCD(253 ; 407) = 11', 'نعم: من لا يقبل القسمة على هذه الأعداد أولي فيما بينه وبين أي عدد', 'لا: لأن 253 و 407 عددان فرديان', 'نعم: PGCD(253 ; 407) = 1'], correct: 0, cols: 1,
      explain: '$407 = 253 \\times 1 + 154$ ، $253 = 154 \\times 1 + 99$ ، $154 = 99 \\times 1 + 55$ ، $99 = 55 \\times 1 + 44$ ، $55 = 44 \\times 1 + 11$ ، $44 = 11 \\times 4 + 0$: القاسم المشترك الأكبر 11 = 253 ÷ 23 = 407 ÷ 37.' },
    commonError: 'الاعتقاد أن قواعد قابلية القسمة الست تكفي: القواسم المشتركة ليست بالضرورة من بين 2 ، 3 ، 4 ، 5 ، 9 ، 10.' },
];
export const EX = Object.fromEntries(EXERCISES.map((e) => [e.id, e]));
