/**
 * Les exercices du MANUEL rattachés au درس 3 « المتراجحات من الدرجة الأولى بمجهول واحد »
 * (couverture : extraction.json → destinations). Chaque énoncé est celui du livre, au mot
 * près ; un exercice à plusieurs inéquations est découpé en une entrée par inéquation (la
 * première porte l'énoncé).
 *
 * Une solution d'inéquation est un CHOIX (`choice`) : les distracteurs sont FAUX (calculés
 * à la main et par l'oracle du banc) et viennent d'erreurs réelles — le sens gardé après
 * une division par un négatif, le sens changé sans raison, un terme oublié en développant,
 * une division faite avant la soustraction. Une question « مثّل بيانيا » porte un `graph`
 * (trois droites DESSINÉES, components/RayFigure.jsx) : la bonne, le mauvais côté, le
 * mauvais crochet.
 */
import { src } from '../../_unit/unitMeta.js';

export const LP = {
  P1: '4am_mutarajiha-ula_P1',
  P2: '4am_mutarajiha-ula_P2',
  P3: '4am_mutarajiha-ula_P3',
};

const E = (n, part) => ({ ...src(`ex-${n}`, 51, 'أوظّف تعلّماتي', n), ...(part ? { part } : {}) });
const C = (prompt, options, correct, explain, cols = 3) => ({ prompt, options, correct, cols, explain });
/** Les trois droites d'une question « مثّل بيانيا » : juste, côté inversé, crochet inversé. */
const G = (from, to, at, side, closed, boundTex, explain) => ({
  prompt: 'أيّ تمثيل بياني لحلول هذه المتراجحة صحيح؟',
  options: [
    { from, to, at, side, closed, boundTex },
    { from, to, at, side: side === 'left' ? 'right' : 'left', closed, boundTex },
    { from, to, at, side, closed: !closed, boundTex },
  ],
  correct: 0,
  explain,
});

/* ── Module 4 — دوري الآن (p. 49) ────────────────────────────────────────── */
export const NOW_49_1 = [
  {
    id: 'now-49-1-a', source: { ...src('now-49-1', 49, 'دوري الآن', 1), part: 'أ' }, learningPointId: LP.P2, difficulty: 'moyen',
    statement: 'حل كل متراجحة مما يلي ثم مثل بيانيا حلولها : $-5(2x - 1) \\leq 2 - 4x$ ، $\\dfrac{5x - 1}{2} + 3 > 1 + 2x$ .',
    interaction: 'choice',
    question: C('$-5(2x - 1) \\leq 2 - 4x$', ['$x \\leq \\dfrac{1}{2}$', '$x \\geq \\dfrac{1}{2}$', '$x \\geq -\\dfrac{1}{2}$'], 1,
      '$-10x + 5 \\leq 2 - 4x$ ثم $-6x \\leq -3$ ، ونقسم على $-6$ (سالب) فنغيّر الاتجاه: $x \\geq \\dfrac{1}{2}$'),
    method: 'ننشر أولًا، ثم ننقل حدود $x$ إلى طرف والأعداد إلى الطرف الآخر، ثم نقسم على المعامل.',
    commonError: 'إبقاء الاتجاه بعد القسمة على $-6$ : $x \\leq \\dfrac{1}{2}$.',
    graph: G(-2, 3, 0.5, 'right', true, '\\dfrac{1}{2}', 'الحلول هي الأعداد الأكبر من أو تساوي $\\dfrac{1}{2}$ : الجزء الملوّن على يمين $\\dfrac{1}{2}$ والرمز موجّه نحوه.'),
  },
  {
    id: 'now-49-1-b', source: { ...src('now-49-1', 49, 'دوري الآن', 1), part: 'ب' }, learningPointId: LP.P2, difficulty: 'difficile',
    interaction: 'choice',
    question: C('$\\dfrac{5x - 1}{2} + 3 > 1 + 2x$', ['$x > -3$', '$x < -3$', '$x > -1$'], 0,
      'نضرب الطرفين في 2: $5x - 1 + 6 > 2 + 4x$ أي $5x + 5 > 2 + 4x$ ، ثم $x > -3$'),
    method: 'نضرب الطرفين في المقام 2 (موجب: الاتجاه لا يتغيّر)، دون أن ننسى ضرب كل الحدود.',
    commonError: 'ضرب الكسر وحده في 2 ونسيان العددين 3 و $1 + 2x$ : $5x - 1 + 3 > 1 + 2x$ أي $x > -1$.',
    graph: G(-6, 1, -3, 'right', false, null, 'الحلول هي الأعداد الأكبر من $-3$ : الجزء الملوّن على يمين $-3$ ، و $-3$ ليس حلًّا فالرمز غير موجّه نحوه.'),
  },
];

/* ── Module 5 — أوظّف تعلّماتي (p. 51) ───────────────────────────────────── */
const ORDER = ['$<$', '$>$'];
const FITS = ['يحقّقها', 'لا يحقّقها'];

export const EXERCISES = [
  {
    id: 'ex-21', source: E(21), learningPointId: LP.P1, difficulty: 'facile',
    statement: 'أكمل في كل حالة مما يلي بالرمز المناسب < أو >.',
    interaction: 'batch',
    question: {
      rows: [
        { label: '1) $-1{,}8 \\ldots -1{,}84$', options: ORDER, correct: 1, correction: '$1{,}8 < 1{,}84$ ، والعدد السالب الأقرب إلى الصفر هو الأكبر: $-1{,}8 > -1{,}84$' },
        { label: '2) $3{,}49 \\times 10^3 \\ldots 3{,}5 \\times 10^3$', options: ORDER, correct: 0, correction: '$3{,}49 < 3{,}50$ والقوة نفسها: $3{,}49 \\times 10^3 < 3{,}5 \\times 10^3$' },
        { label: '3) $1 + \\dfrac{3}{2} \\ldots \\dfrac{7}{3}$', options: ORDER, correct: 1, correction: '$1 + \\dfrac{3}{2} = \\dfrac{15}{6}$ و $\\dfrac{7}{3} = \\dfrac{14}{6}$ : $1 + \\dfrac{3}{2} > \\dfrac{7}{3}$' },
      ],
      explain: 'نقارن بعد كتابة العددين بنفس الشكل (نفس عدد الأرقام العشرية، نفس القوة، نفس المقام).',
    },
    method: 'نكتب العددين بنفس الشكل ثم نقارن.',
    commonError: 'اعتبار $-1{,}84$ أكبر من $-1{,}8$ لأنّ $1{,}84 > 1{,}8$ : بين عددين سالبين، الأكبر هو الأقرب إلى الصفر.',
  },
  {
    id: 'ex-22', source: E(22), learningPointId: LP.P2, difficulty: 'facile',
    statement: 'إذا علمت أن $x > \\dfrac{3}{2}$ . أكمل كلا مما يلي: $2x > \\ldots$ ، $-4x \\ldots -6$ ، $2x + 5 \\ldots\\ldots$ .',
    interaction: 'batch',
    question: {
      rows: [
        { label: '$2x > \\ldots$', options: ['$3$', '$\\dfrac{7}{2}$', '$4$'], correct: 0, correction: 'نضرب في 2 (موجب): $2x > 2 \\times \\dfrac{3}{2} = 3$' },
        { label: '$-4x \\ldots -6$', options: ORDER, correct: 0, correction: 'نضرب في $-4$ (سالب) فنغيّر الاتجاه: $-4x < -4 \\times \\dfrac{3}{2} = -6$' },
        { label: '$2x + 5 \\ldots\\ldots$', options: ['$> 8$', '$< 8$', '$> 10$'], correct: 0, correction: 'من $2x > 3$ نضيف 5: $2x + 5 > 8$' },
      ],
      explain: 'الضرب في عدد موجب أو إضافة عدد يحافظ على الاتجاه؛ الضرب في عدد سالب يغيّره. والإكمال المطلوب هو ما ينتج بالضبط من $x > \\dfrac{3}{2}$.',
    },
    method: 'نطبّق على طرفي $x > \\dfrac{3}{2}$ العملية نفسها، ونغيّر الاتجاه عند الضرب في عدد سالب.',
    commonError: 'كتابة $-4x > -6$ : الضرب في $-4$ يغيّر الاتجاه.',
  },
  {
    id: 'ex-23', source: E(23), learningPointId: LP.P2, difficulty: 'facile',
    statement: 'إذا علمت أن $x < -2$ . أكمل كلا مما يلي: $5x < \\ldots$ ، $-2x \\ldots 4$ ، $3x - 1 \\ldots\\ldots$ .',
    interaction: 'batch',
    question: {
      rows: [
        { label: '$5x < \\ldots$', options: ['$-10$', '$-12$', '$-20$'], correct: 0, correction: 'نضرب في 5 (موجب): $5x < 5 \\times (-2) = -10$' },
        { label: '$-2x \\ldots 4$', options: ORDER, correct: 1, correction: 'نضرب في $-2$ (سالب) فنغيّر الاتجاه: $-2x > (-2) \\times (-2) = 4$' },
        { label: '$3x - 1 \\ldots\\ldots$', options: ['$< -7$', '$> -7$', '$< -9$'], correct: 0, correction: '$3x < -6$ ثم نطرح 1: $3x - 1 < -7$' },
      ],
      explain: 'الإشارة السالبة للطرف الثاني لا تغيّر شيئًا: وحده الضرب في عدد سالب يغيّر الاتجاه.',
    },
    commonError: 'كتابة $5x > -10$ لأنّ $-2$ سالب: الضرب في 5 (موجب) يحافظ على الاتجاه.',
  },
  {
    id: 'ex-24-1', source: E(24, '1'), learningPointId: LP.P2, difficulty: 'facile',
    statement: 'حل كل متراجحة مما يلي:',
    items: ['$3x \\geq -2$', '$-2x < 4$', '$\\dfrac{5}{3}x > 10$'],
    interaction: 'choice',
    question: C('$3x \\geq -2$', ['$x \\geq -\\dfrac{2}{3}$', '$x \\leq -\\dfrac{2}{3}$', '$x \\geq -\\dfrac{3}{2}$'], 0,
      'نقسم على 3 (موجب): $x \\geq -\\dfrac{2}{3}$'),
    commonError: 'تغيير الاتجاه لأنّ $-2$ سالب: المعامل 3 موجب.',
  },
  {
    id: 'ex-24-2', source: E(24, '2'), learningPointId: LP.P2, difficulty: 'moyen',
    interaction: 'choice',
    question: C('$-2x < 4$', ['$x < -2$', '$x > -2$', '$x > 2$'], 1, 'نقسم على $-2$ (سالب) فنغيّر الاتجاه: $x > -2$'),
    commonError: 'الإبقاء على الاتجاه: $x < -2$.',
  },
  {
    id: 'ex-24-3', source: E(24, '3'), learningPointId: LP.P2, difficulty: 'moyen',
    interaction: 'choice',
    question: C('$\\dfrac{5}{3}x > 10$', ['$x > \\dfrac{50}{3}$', '$x > 6$', '$x < 6$'], 1, 'نضرب في $\\dfrac{3}{5}$ (موجب): $x > 10 \\times \\dfrac{3}{5} = 6$'),
    commonError: 'الضرب في $\\dfrac{5}{3}$ بدل $\\dfrac{3}{5}$ : $x > \\dfrac{50}{3}$.',
  },
  {
    id: 'ex-25-1', source: E(25, '1)'), learningPointId: LP.P1, difficulty: 'facile',
    statement: '1) إليك المتراجحة $3x - 2 < 6$ . عين قيم $x$ التي تحقّق هذه المتراجحة من بين القيم الآتية: $x = 0$ ، $x = -2$ ، $x = 3$ ، $x = \\dfrac{8}{3}$ . 2) حل المتراجحة المعطاة.',
    interaction: 'batch',
    question: {
      prompt: '1) هل القيمة تحقّق المتراجحة $3x - 2 < 6$ ؟',
      rows: [
        { label: '$x = 0$', options: FITS, correct: 0, correction: '$3 \\times 0 - 2 = -2$ و $-2 < 6$ صحيحة' },
        { label: '$x = -2$', options: FITS, correct: 0, correction: '$3 \\times (-2) - 2 = -8$ و $-8 < 6$ صحيحة' },
        { label: '$x = 3$', options: FITS, correct: 1, correction: '$3 \\times 3 - 2 = 7$ و $7 < 6$ خاطئة' },
        { label: '$x = \\dfrac{8}{3}$', options: FITS, correct: 1, correction: '$3 \\times \\dfrac{8}{3} - 2 = 6$ و $6 < 6$ خاطئة (المتراجحة صارمة)' },
      ],
      explain: 'نعوّض $x$ ثم نحكم على المتباينة العددية الناتجة.',
    },
    method: 'نعوّض $x$ بالقيمة في الطرف الأول ثم نقارن بالطرف الثاني.',
    commonError: 'قبول $x = \\dfrac{8}{3}$ : نجد $6 < 6$ وهي خاطئة لأنّ الرمز $<$ صارم.',
  },
  {
    id: 'ex-25-2', source: E(25, '2)'), learningPointId: LP.P2, difficulty: 'facile',
    interaction: 'choice',
    question: C('2) $3x - 2 < 6$', ['$x < \\dfrac{8}{3}$', '$x > \\dfrac{8}{3}$', '$x < \\dfrac{4}{3}$'], 0,
      'نضيف 2: $3x < 8$ ، ثم نقسم على 3: $x < \\dfrac{8}{3}$ — وهذا يوافق الجزء 1): 0 و $-2$ حلّان، 3 و $\\dfrac{8}{3}$ ليسا حلّين.'),
    commonError: 'طرح 2 بدل إضافته: $3x < 4$.',
  },
  {
    id: 'ex-26', source: E(26), learningPointId: LP.P2, difficulty: 'moyen',
    statement: 'حل المتراجحة $4x - 1 \\leq 17 - 2x$ .',
    interaction: 'choice',
    question: C('$4x - 1 \\leq 17 - 2x$', ['$x \\leq 3$', '$x \\geq 3$', '$x \\leq 9$'], 0,
      'نضيف $2x$ ثم 1 إلى الطرفين: $6x \\leq 18$ ، ونقسم على 6: $x \\leq 3$'),
    method: 'ننقل $-2x$ بإضافة $2x$ إلى الطرفين، ثم ننقل $-1$ بإضافة 1.',
    commonError: 'طرح $2x$ بدل إضافته: $2x \\leq 18$ أي $x \\leq 9$.',
  },
  {
    id: 'ex-27-1', source: E(27, '1'), learningPointId: LP.P2, difficulty: 'moyen',
    statement: 'حل كل متراجحة مما يلي:',
    items: ['$\\dfrac{5}{2}x - \\dfrac{1}{3} > 0$', '$1{,}2x - 0{,}6 \\leq 3$', '$\\dfrac{x}{2} - \\dfrac{3}{4} \\geq 1$', '$\\dfrac{x + 1}{2} < 3x - 1$'],
    interaction: 'choice',
    question: C('$\\dfrac{5}{2}x - \\dfrac{1}{3} > 0$', ['$x > \\dfrac{2}{15}$', '$x > \\dfrac{5}{6}$', '$x < \\dfrac{2}{15}$'], 0,
      '$\\dfrac{5}{2}x > \\dfrac{1}{3}$ ، ثم نضرب في $\\dfrac{2}{5}$ : $x > \\dfrac{2}{15}$'),
    commonError: 'الضرب في $\\dfrac{5}{2}$ بدل $\\dfrac{2}{5}$ : $x > \\dfrac{5}{6}$.',
  },
  {
    id: 'ex-27-2', source: E(27, '2'), learningPointId: LP.P2, difficulty: 'moyen',
    interaction: 'choice',
    question: C('$1{,}2x - 0{,}6 \\leq 3$', ['$x \\leq 2$', '$x \\geq 3$', '$x \\leq 3$'], 2,
      '$1{,}2x \\leq 3{,}6$ ، ثم نقسم على $1{,}2$ : $x \\leq 3$'),
    commonError: 'طرح $0{,}6$ بدل إضافته: $1{,}2x \\leq 2{,}4$ أي $x \\leq 2$.',
  },
  {
    id: 'ex-27-3', source: E(27, '3'), learningPointId: LP.P2, difficulty: 'moyen',
    interaction: 'choice',
    question: C('$\\dfrac{x}{2} - \\dfrac{3}{4} \\geq 1$', ['$x \\geq \\dfrac{7}{4}$', '$x \\geq \\dfrac{7}{2}$', '$x \\geq \\dfrac{1}{2}$'], 1,
      '$\\dfrac{x}{2} \\geq \\dfrac{7}{4}$ ، ثم نضرب في 2: $x \\geq \\dfrac{7}{2}$'),
    commonError: 'نسيان الضرب في 2 في الأخير: $x \\geq \\dfrac{7}{4}$.',
  },
  {
    id: 'ex-27-4', source: E(27, '4'), learningPointId: LP.P2, difficulty: 'difficile',
    interaction: 'choice',
    question: C('$\\dfrac{x + 1}{2} < 3x - 1$', ['$x < \\dfrac{3}{5}$', '$x > 1$', '$x > \\dfrac{3}{5}$'], 2,
      'نضرب في 2: $x + 1 < 6x - 2$ ، ثم $-5x < -3$ ونقسم على $-5$ فنغيّر الاتجاه: $x > \\dfrac{3}{5}$'),
    commonError: 'ضرب الطرف الأول وحده في 2: $x + 1 < 3x - 1$ أي $x > 1$ ؛ أو إبقاء الاتجاه بعد القسمة على $-5$.',
  },
  {
    id: 'ex-28', source: E(28), learningPointId: LP.P3, difficulty: 'facile',
    statement: '1) حل المتراجحة $2x - 1 \\leq 6$ . 2) مثّل بيانيا حلول هذه المتراجحة.',
    interaction: 'choice',
    question: C('1) $2x - 1 \\leq 6$', ['$x \\leq \\dfrac{7}{2}$', '$x \\leq \\dfrac{5}{2}$', '$x \\geq \\dfrac{7}{2}$'], 0,
      '$2x \\leq 7$ ، ثم نقسم على 2: $x \\leq \\dfrac{7}{2}$'),
    commonError: 'طرح 1 بدل إضافته: $2x \\leq 5$.',
    graph: G(1, 6, 3.5, 'left', true, '\\dfrac{7}{2}', 'الحلول هي الأعداد الأصغر من أو تساوي $\\dfrac{7}{2}$ : الجزء الملوّن على يسار $\\dfrac{7}{2}$ ، و $\\dfrac{7}{2}$ حلّ فالرمز موجّه نحوه.'),
  },
  {
    id: 'ex-29-1', source: E(29, '1)'), learningPointId: LP.P2, difficulty: 'moyen',
    statement: '1) انشر وبسّط العبارة P حيث: $P = (-3x - 1)^2 - 3x(3x + 7)$ . 2) حلّل العبارة $R = (4x^2 - 1) - (2x + 1)(2x + 3)$ 3) حل المتراجحة $P \\leq R$ ثمّ مثّل بيانيا حلولها.',
    interaction: 'choice',
    question: C('1) $P = $', ['$-15x + 1$', '$-27x + 1$', '$18x^2 - 15x + 1$'], 0,
      '$(-3x - 1)^2 = 9x^2 + 6x + 1$ و $-3x(3x + 7) = -9x^2 - 21x$ ، إذن $P = -15x + 1$'),
    commonError: 'كتابة $(-3x - 1)^2 = 9x^2 - 6x + 1$ : الحد المضاعف $2 \\times (-3x) \\times (-1) = +6x$.',
  },
  {
    id: 'ex-29-2', source: E(29, '2)'), learningPointId: LP.P2, difficulty: 'moyen',
    interaction: 'choice',
    question: C('2) $R = $', ['$4(2x + 1)$', '$-4(2x + 1)$', '$(2x + 1)(4x + 2)$'], 1,
      '$4x^2 - 1 = (2x - 1)(2x + 1)$ ، إذن $R = (2x + 1)[(2x - 1) - (2x + 3)] = (2x + 1)(-4) = -4(2x + 1)$'),
    commonError: 'حذف القوس المسبوق بـ «−» دون تغيير الإشارات: $(2x - 1) - 2x + 3$.',
  },
  {
    id: 'ex-29-3', source: E(29, '3)'), learningPointId: LP.P2, difficulty: 'difficile',
    interaction: 'choice',
    question: C('3) $P \\leq R$ أي $-15x + 1 \\leq -8x - 4$', ['$x \\leq \\dfrac{5}{7}$', '$x \\geq -\\dfrac{5}{7}$', '$x \\geq \\dfrac{5}{7}$'], 2,
      '$-7x \\leq -5$ ، ونقسم على $-7$ (سالب) فنغيّر الاتجاه: $x \\geq \\dfrac{5}{7}$'),
    commonError: 'إبقاء الاتجاه بعد القسمة على $-7$ : $x \\leq \\dfrac{5}{7}$.',
    graph: G(-2, 3, 5 / 7, 'right', true, '\\dfrac{5}{7}', 'الجزء الملوّن على يمين $\\dfrac{5}{7}$ ، و $\\dfrac{5}{7}$ حلّ فالرمز موجّه نحوه.'),
  },
  {
    id: 'ex-31', source: E(31), learningPointId: LP.P3, difficulty: 'moyen',
    statement: '1) حل المتراجحة الآتية: $5(2x - 1) \\geq 4x - 1$ . 2) مثّل بيانيا حلول هذه المتراجحة.',
    interaction: 'choice',
    question: C('1) $5(2x - 1) \\geq 4x - 1$', ['$x \\geq \\dfrac{2}{3}$', '$x \\geq 0$', '$x \\leq \\dfrac{2}{3}$'], 0,
      '$10x - 5 \\geq 4x - 1$ ، ثم $6x \\geq 4$ أي $x \\geq \\dfrac{2}{3}$'),
    commonError: 'نسيان ضرب $-1$ في 5: $10x - 1 \\geq 4x - 1$ أي $x \\geq 0$.',
    graph: G(-2, 3, 2 / 3, 'right', true, '\\dfrac{2}{3}', 'الجزء الملوّن على يمين $\\dfrac{2}{3}$ ، و $\\dfrac{2}{3}$ حلّ فالرمز موجّه نحوه.'),
  },
  {
    id: 'ex-32-1', source: E(32, '1'), learningPointId: LP.P2, difficulty: 'difficile',
    statement: '1) حلّ كلا من المتراجحتين الآتيتين: 2) مثّل بيانيا حلول كل متراجحة.',
    items: ['$3(2x - 6) + 4(2x - 3) \\geq 2x - 5(2x - 3)$', '$6(1 - 2x) - 4(-2x - 5) > 3(x - 7) - 2(8 - 9x)$'],
    interaction: 'choice',
    question: C('$3(2x - 6) + 4(2x - 3) \\geq 2x - 5(2x - 3)$', ['$x \\geq \\dfrac{45}{22}$', '$x \\leq \\dfrac{45}{22}$', '$x \\geq \\dfrac{15}{22}$'], 0,
      '$14x - 30 \\geq -8x + 15$ ، ثم $22x \\geq 45$ أي $x \\geq \\dfrac{45}{22}$'),
    commonError: 'كتابة $-5(2x - 3) = -10x - 15$ : $-5 \\times (-3) = +15$.',
    graph: G(0, 4, 45 / 22, 'right', true, '\\dfrac{45}{22}', 'الجزء الملوّن على يمين $\\dfrac{45}{22}$ ، و $\\dfrac{45}{22}$ حلّ فالرمز موجّه نحوه.'),
  },
  {
    id: 'ex-32-2', source: E(32, '2'), learningPointId: LP.P2, difficulty: 'difficile',
    interaction: 'choice',
    question: C('$6(1 - 2x) - 4(-2x - 5) > 3(x - 7) - 2(8 - 9x)$', ['$x > \\dfrac{63}{25}$', '$x < \\dfrac{63}{25}$', '$x < -\\dfrac{63}{11}$'], 1,
      '$26 - 4x > 21x - 37$ ، ثم $-25x > -63$ ونقسم على $-25$ فنغيّر الاتجاه: $x < \\dfrac{63}{25}$'),
    commonError: 'إبقاء الاتجاه بعد القسمة على $-25$ : $x > \\dfrac{63}{25}$.',
    graph: G(0, 5, 63 / 25, 'left', false, '\\dfrac{63}{25}', 'الجزء الملوّن على يسار $\\dfrac{63}{25}$ ، و $\\dfrac{63}{25}$ ليس حلًّا فالرمز غير موجّه نحوه.'),
  },
];

/** Les entrées d'un exercice du manuel (module 5), par numéro : « 21 », « 27 »… */
export const partsOf = (n) => EXERCISES.filter((ex) => ex.id === `ex-${n}` || ex.id.startsWith(`ex-${n}-`));

/** Accès par id. */
export const EX = Object.fromEntries([...NOW_49_1, ...EXERCISES].map((ex) => [ex.id, ex]));
