/**
 * Les exercices du MANUEL rattachés au درس « نشر وتبسيط عبارة جبرية »
 * (extraction.json → destinations : دوري الآن 1 p. 35, ex-1 … ex-8 p. 37).
 * Chaque exercice garde son énoncé et ses nombres ; l'interaction le rend sans
 * changer sa tâche mathématique. Réponses calculées (le manuel n'a pas de corrigé) ;
 * chaque distracteur est FAUX et reproduit une erreur réelle (un seul terme
 * multiplié, signe oublié, deux produits sur quatre, parenthèses précédées de −).
 *
 * Les OPTIONS et CORRECTIONS d'une ligne `batch` passent par MathText
 * (TextbookExercise) : toute écriture mathématique y est un îlot `$…$`.
 */
import { src } from '../../_unit/unitMeta.js';

export const LP = {
  P1: '4am_nashr-tabsit_P1',
  P2: '4am_nashr-tabsit_P2',
  P3: '4am_nashr-tabsit_P3',
  P4: '4am_nashr-tabsit_P4',
};

const S = (n) => src(`ex-${n}`, 37, 'أوظّف تعلّماتي', n);
const OK = 'صحيحة';
const KO = 'خاطئة';

export const EXERCISES = [
  {
    id: 'ex-1', source: S(1), learningPointId: LP.P2, difficulty: 'facile',
    statement: 'انشر كل عبارة مما يلي وبسّطها:',
    items: ['$A = 2(5x - 1)$', '$B = -3(3 - x)$', '$C = \\dfrac{2}{5}\\left(-20x + \\dfrac{15}{2}\\right)$', '$D = -4\\left(7 - \\dfrac{3}{2}x\\right)$'],
    interaction: 'batch',
    question: {
      prompt: 'اختر النشر المبسّط لكل عبارة.',
      rows: [
        { label: '$A = 2(5x - 1)$', options: ['$10x - 2$', '$10x - 1$', '$10x + 2$'], correct: 0, correction: '$2 \\times 5x - 2 \\times 1 = 10x - 2$' },
        { label: '$B = -3(3 - x)$', options: ['$-9 - 3x$', '$3x - 9$', '$-9 + x$'], correct: 1, correction: '$-3 \\times 3 - (-3) \\times x = -9 + 3x$' },
        { label: '$C = \\dfrac{2}{5}\\left(-20x + \\dfrac{15}{2}\\right)$', options: ['$-8x + 3$', '$-8x + \\dfrac{15}{2}$', '$8x + 3$'], correct: 0, correction: '$\\dfrac{2}{5} \\times (-20x) + \\dfrac{2}{5} \\times \\dfrac{15}{2} = -8x + 3$' },
        { label: '$D = -4\\left(7 - \\dfrac{3}{2}x\\right)$', options: ['$-28 - 6x$', '$6x - 28$', '$28 - 6x$'], correct: 1, correction: '$-4 \\times 7 - (-4) \\times \\dfrac{3}{2}x = -28 + 6x$' },
      ],
      explain: 'نضرب العدد الذي أمام القوسين في كل حد داخلهما، مع إشارته: $k(a + b) = ka + kb$ و $k(a - b) = ka - kb$.',
    },
    method: 'نضرب $k$ في كل حد من حدّي المجموع أو الفرق، ثم نحسب كل جداء مع إشارته.',
    commonError: 'ضرب العدد في الحد الأول فقط، أو نسيان إشارته: $-3(3 - x)$ يساوي $-9 + 3x$ وليس $-9 - 3x$.',
  },
  {
    id: 'ex-2', source: S(2), learningPointId: LP.P3, difficulty: 'facile',
    statement: 'لتكن العبارة A: $A = (x + 2)(3x - 1)$ . 1) احسب قيمة A من أجل $x = 0$ . 2) انشر العبارة A وبسّطها. 3) احسب، باستعمال عبارة A التي حصلت عليها في السؤال 2، قيمة A من أجل $x = 0$ . هل وجدت نفس القيمة التي حصلت عليها في السؤال 1؟ إذا كان الجواب (لا) ابحث عن الخطأ وصحّحه.',
    interaction: 'batch',
    question: {
      prompt: 'أجب عن الأسئلة الثلاثة بالترتيب.',
      rows: [
        { label: '1) قيمة A من أجل $x = 0$', options: ['$-2$', '$2$', '$0$'], correct: 0, correction: '$(0 + 2)(3 \\times 0 - 1) = 2 \\times (-1) = -2$' },
        { label: '2) النشر المبسّط للعبارة A', options: ['$3x^2 - 2$', '$3x^2 + 5x - 2$', '$3x^2 + 7x - 2$'], correct: 1, correction: '$3x^2 - x + 6x - 2 = 3x^2 + 5x - 2$' },
        { label: '3) قيمة العبارة المنشورة من أجل $x = 0$', options: ['$0$', '$5$', '$-2$'], correct: 2, correction: '$3 \\times 0^2 + 5 \\times 0 - 2 = -2$: نفس القيمة.' },
      ],
      explain: 'العبارة وشكلها المنشور متساويتان من أجل كل قيمة لـ $x$: إن اختلفت القيمتان ففي النشر خطأ.',
    },
    method: 'نتحقّق من نشر بحساب العبارتين من أجل قيمة بسيطة لـ $x$.',
    commonError: 'نشر جداء القوسين بجداءين فقط: $(x + 2)(3x - 1) = 3x^2 - 2$ يعطي من أجل $x = 1$ القيمة 1 بدل 6.',
  },
  {
    id: 'ex-3', source: S(3), learningPointId: LP.P3, difficulty: 'moyen',
    statement: 'انشر كل عبارة مما يلي وبسّطها:',
    items: ['$K = (2x + 1)(x + 2)$', '$L = (3x + 2)(4x - 5)$', '$M = (x - 7)(1 - x)$', '$P = (-x - 2)(5 - x)$'],
    interaction: 'batch',
    question: {
      prompt: 'اختر النشر المبسّط لكل عبارة.',
      rows: [
        { label: '$K = (2x + 1)(x + 2)$', options: ['$2x^2 + 5x + 2$', '$2x^2 + 2$', '$2x^2 + 4x + 2$'], correct: 0, correction: '$2x^2 + 4x + x + 2 = 2x^2 + 5x + 2$' },
        { label: '$L = (3x + 2)(4x - 5)$', options: ['$12x^2 - 10$', '$12x^2 - 7x - 10$', '$12x^2 + 7x - 10$'], correct: 1, correction: '$12x^2 - 15x + 8x - 10 = 12x^2 - 7x - 10$' },
        { label: '$M = (x - 7)(1 - x)$', options: ['$-x^2 - 6x - 7$', '$x^2 + 8x - 7$', '$-x^2 + 8x - 7$'], correct: 2, correction: '$x - x^2 - 7 + 7x = -x^2 + 8x - 7$' },
        { label: '$P = (-x - 2)(5 - x)$', options: ['$x^2 - 3x - 10$', '$-x^2 - 3x - 10$', '$x^2 - 7x - 10$'], correct: 0, correction: '$-5x + x^2 - 10 + 2x = x^2 - 3x - 10$' },
      ],
      explain: '$(a + b)(c + d) = ac + ad + bc + bd$: أربعة جداءات، كل منها بإشارته، ثم نجمع الحدود المتشابهة.',
    },
    method: 'نضرب كل حد من القوس الأول في كل حد من القوس الثاني، ثم نبسّط.',
    commonError: 'إهمال إشارة جداء حدّين سالبين: في $M$ لدينا $(-7) \\times (-x) = +7x$.',
  },
  {
    id: 'ex-4', source: S(4), learningPointId: LP.P3, difficulty: 'moyen',
    statement: 'لتكن العبارة A حيث: $A = \\left(\\dfrac{2}{3}x + 5\\right)\\left(4 - \\dfrac{1}{3}x\\right)$ . 1) تحقّق من أنّه من أجل $x = 3$ فإنّ $A = 21$ . 2) انشر وبسط العبارة A. 3) استعمل عبارة A التي حصلت عليها في السؤال 2 للتحقق من قيمة A من أجل $x = 3$ مرّة ثانية.',
    interaction: 'batch',
    question: {
      prompt: 'أجب عن الأسئلة الثلاثة بالترتيب.',
      rows: [
        { label: '1) قيمة A من أجل $x = 3$', options: ['$7$', '$21$', '$27$'], correct: 1, correction: '$\\left(\\dfrac{2}{3} \\times 3 + 5\\right)\\left(4 - \\dfrac{1}{3} \\times 3\\right) = 7 \\times 3 = 21$' },
        { label: '2) النشر المبسّط للعبارة A', options: ['$-\\dfrac{2}{9}x^2 + x + 20$', '$-\\dfrac{2}{9}x^2 + 20$', '$-\\dfrac{2}{3}x^2 + x + 20$'], correct: 0, correction: '$\\dfrac{8}{3}x - \\dfrac{2}{9}x^2 + 20 - \\dfrac{5}{3}x = -\\dfrac{2}{9}x^2 + x + 20$' },
        { label: '3) قيمة العبارة المنشورة من أجل $x = 3$', options: ['$23$', '$25$', '$21$'], correct: 2, correction: '$-\\dfrac{2}{9} \\times 9 + 3 + 20 = -2 + 23 = 21$' },
      ],
      explain: '$\\dfrac{2}{3}x \\times \\left(-\\dfrac{1}{3}x\\right) = -\\dfrac{2}{9}x^2$ ، و $\\dfrac{8}{3}x - \\dfrac{5}{3}x = x$: والقيمة 21 نفسها في الشكلين.',
    },
    method: 'نحسب كل جداء بالكسور كما نحسب بالأعداد الطبيعية، ثم نجمع الحدود المتشابهة.',
    commonError: 'ضرب البسطين فقط: $\\dfrac{2}{3}x \\times \\dfrac{1}{3}x = \\dfrac{2}{9}x^2$ وليس $\\dfrac{2}{3}x^2$.',
  },
  {
    id: 'ex-5', source: S(5), learningPointId: LP.P3, difficulty: 'difficile',
    statement: 'انشر كل عبارة مما يلي وبسّطها:',
    items: ['$B = \\left(2x + \\dfrac{1}{5}\\right)\\left(x + \\dfrac{2}{5}\\right)$', '$C = \\left(\\dfrac{4}{3}x - 2\\right)\\left(\\dfrac{3}{2}x - \\dfrac{1}{4}\\right)$'],
    interaction: 'batch',
    question: {
      prompt: 'اختر النشر المبسّط لكل عبارة.',
      rows: [
        { label: '$B = \\left(2x + \\dfrac{1}{5}\\right)\\left(x + \\dfrac{2}{5}\\right)$', options: ['$2x^2 + \\dfrac{2}{25}$', '$2x^2 + x + \\dfrac{3}{5}$', '$2x^2 + x + \\dfrac{2}{25}$'], correct: 2, correction: '$2x^2 + \\dfrac{4}{5}x + \\dfrac{1}{5}x + \\dfrac{2}{25} = 2x^2 + x + \\dfrac{2}{25}$' },
        { label: '$C = \\left(\\dfrac{4}{3}x - 2\\right)\\left(\\dfrac{3}{2}x - \\dfrac{1}{4}\\right)$', options: ['$2x^2 - \\dfrac{10}{3}x + \\dfrac{1}{2}$', '$2x^2 - \\dfrac{8}{3}x + \\dfrac{1}{2}$', '$2x^2 + \\dfrac{1}{2}$'], correct: 0, correction: '$2x^2 - \\dfrac{1}{3}x - 3x + \\dfrac{1}{2} = 2x^2 - \\dfrac{10}{3}x + \\dfrac{1}{2}$' },
      ],
      explain: 'أربعة جداءات في كل مرّة: $\\dfrac{4}{3}x \\times \\dfrac{3}{2}x = 2x^2$ ، $\\dfrac{4}{3}x \\times \\left(-\\dfrac{1}{4}\\right) = -\\dfrac{1}{3}x$ ، $(-2) \\times \\dfrac{3}{2}x = -3x$ و $(-2) \\times \\left(-\\dfrac{1}{4}\\right) = \\dfrac{1}{2}$.',
    },
    commonError: 'جمع الثابتين بدل ضربهما: في $B$ الحد الثابت هو $\\dfrac{1}{5} \\times \\dfrac{2}{5} = \\dfrac{2}{25}$ وليس $\\dfrac{3}{5}$.',
  },
  {
    id: 'ex-6', source: S(6), learningPointId: LP.P4, difficulty: 'moyen',
    // La copie du premier élève est gardée TELLE QUELLE (extraction › ex-6.note) : c'est elle qu'on juge.
    statement: 'إليك إجابة تلميذين حول نشر وتبسيط العبارة $P = 3(x - 1) - (x + 1)(4x - 3)$ . أجاب الأول: $P = 3x - 3 - 4x^2 - 3x + 4x - 3 = -4x^2 + 4x + 6$ . أجاب الثاني: $P = 3x - 3 - (4x^2 - 3x + 4x - 3) = 3x - 3 - 4x^2 + 3x - 4x + 3 = -4x^2 + 2x$ . أي الإجابتين صحيحة؟',
    interaction: 'batch',
    question: {
      prompt: 'احكم على كل إجابة، ثم اختر النشر المبسّط للعبارة P.',
      rows: [
        { label: 'إجابة التلميذ الأول', options: [OK, KO], correct: 1, correction: 'حذف القوسين المسبوقين بـ $-$ دون تغيير إشارات الحدود داخلهما؛ ثم إن حسابه نفسه يعطي $-3 - 3 = -6$ لا $+6$.' },
        { label: 'إجابة التلميذ الثاني', options: [OK, KO], correct: 0, correction: 'حفظ القوسين ثم غيّر إشارة كل حد عند حذفهما: $-(4x^2 - 3x + 4x - 3) = -4x^2 + 3x - 4x + 3$' },
        { label: 'النشر المبسّط للعبارة P', options: ['$-4x^2 + 4x - 6$', '$-4x^2 + 2x$', '$-4x^2 + 4x + 6$'], correct: 1, correction: '$3x - 3 - 4x^2 + 3x - 4x + 3 = -4x^2 + 2x$' },
      ],
      explain: 'الجداء $(x + 1)(4x - 3)$ مسبوق بـ $-$: نكتبه أولًا بين قوسين، ثم نحذف القوسين ونغيّر إشارة كل حد بداخلهما.',
    },
    method: 'نضع نشر الجداء المسبوق بـ $-$ بين قوسين قبل حذفهما.',
    commonError: 'حذف القوسين المسبوقين بـ $-$ دون تغيير الإشارات: $-(4x^2 - 3x + 4x - 3)$ يساوي $-4x^2 + 3x - 4x + 3$.',
  },
  {
    id: 'ex-7', source: S(7), learningPointId: LP.P4, difficulty: 'difficile',
    statement: 'انشر كل عبارة مما يلي وبسّطها:',
    items: ['$R = a - 3 - 2(a + 3)$', '$S = -(a + 2) - (3a - 5)(2a - 4)$', '$T = (a + 3)\\left(a + \\dfrac{1}{3}\\right) - (a + 2)\\left(a - \\dfrac{1}{2}\\right)$'],
    interaction: 'batch',
    question: {
      prompt: 'اختر النشر المبسّط لكل عبارة.',
      rows: [
        { label: '$R = a - 3 - 2(a + 3)$', options: ['$-a$', '$-a + 3$', '$-a - 9$'], correct: 2, correction: '$a - 3 - 2a - 6 = -a - 9$' },
        { label: '$S = -(a + 2) - (3a - 5)(2a - 4)$', options: ['$-6a^2 + 21a - 22$', '$-6a^2 - 23a + 18$', '$6a^2 - 23a + 18$'], correct: 0, correction: '$-a - 2 - (6a^2 - 22a + 20) = -a - 2 - 6a^2 + 22a - 20 = -6a^2 + 21a - 22$' },
        { label: '$T = (a + 3)\\left(a + \\dfrac{1}{3}\\right) - (a + 2)\\left(a - \\dfrac{1}{2}\\right)$', options: ['$2a^2 + \\dfrac{11}{6}a + 2$', '$\\dfrac{11}{6}a + 2$', '$\\dfrac{29}{6}a$'], correct: 1, correction: '$\\left(a^2 + \\dfrac{10}{3}a + 1\\right) - \\left(a^2 + \\dfrac{3}{2}a - 1\\right) = \\dfrac{11}{6}a + 2$' },
      ],
      explain: 'كل جداء مسبوق بـ $-$ نكتب نشره بين قوسين، ثم نحذفهما بتغيير الإشارات، ونجمع الحدود المتشابهة: في $T$ يتعادم $a^2$ و $-a^2$.',
    },
    method: 'ننشر كل جداء بين قوسين، ثم نحذف الأقواس، ثم نجمع الحدود المتشابهة.',
    commonError: 'في $R$: $-2(a + 3) = -2a - 6$ وليس $-2a + 6$؛ الإشارة $-$ تُضرب في الحدّين.',
  },
  {
    id: 'ex-8', source: S(8), learningPointId: LP.P3, difficulty: 'difficile',
    statement: 'لنشر العبارة $A = -5(x + 2)(3x - 1)$ وتبسيطها، إليك بداية عمل كل من رياض وإيمان. رياض: $A = -5(x + 2)(3x - 1) = (-5x - 10)(3x - 1)$ . إيمان: $A = -5(x + 2)(3x - 1) = -5(3x^2 - x + 6x - 2)$ . 1) اشرح عمل كل من رياض وإيمان. 2) أكمل عمل كل منهما. ماذا تلاحظ؟',
    interaction: 'batch',
    question: {
      prompt: 'اشرح كل بداية، ثم أكملها.',
      rows: [
        { label: '1) ماذا فعل رياض أولًا؟', options: ['ضرب $-5$ في القوس الأول', 'نشر جداء القوسين'], correct: 0, correction: '$-5(x + 2) = -5x - 10$' },
        { label: '1) ماذا فعلت إيمان أولًا؟', options: ['ضربت $-5$ في القوس الأول', 'نشرت جداء القوسين'], correct: 1, correction: '$(x + 2)(3x - 1) = 3x^2 - x + 6x - 2$' },
        { label: '2) إكمال عمل رياض: $(-5x - 10)(3x - 1) = \\ldots$', options: ['$-15x^2 - 25x + 10$', '$-15x^2 - 35x + 10$', '$-15x^2 + 10$'], correct: 0, correction: '$-15x^2 + 5x - 30x + 10 = -15x^2 - 25x + 10$' },
        { label: '2) إكمال عمل إيمان: $-5(3x^2 + 5x - 2) = \\ldots$', options: ['$-15x^2 + 5x - 2$', '$-15x^2 - 25x - 10$', '$-15x^2 - 25x + 10$'], correct: 2, correction: '$-5 \\times 3x^2 - 5 \\times 5x - 5 \\times (-2) = -15x^2 - 25x + 10$' },
        { label: 'ماذا تلاحظ؟', options: ['النتيجتان مختلفتان: إحدى الطريقتين خاطئة', 'نحصل على النتيجة نفسها بالطريقتين'], correct: 1, correction: 'الطريقتان صحيحتان: يمكن البدء بأي جداء.' },
      ],
      explain: 'رياض وزّع $-5$ على القوس الأول، وإيمان نشرت جداء القوسين أولًا: النتيجة واحدة، $-15x^2 - 25x + 10$.',
    },
    commonError: 'في عمل رياض: $(-5x) \\times (-1) = +5x$ وليس $-5x$؛ وفي عمل إيمان: $-5$ تُضرب في الحدود الثلاثة.',
  },
];

/** دوري الآن 1 (p. 35) — l'application directe de معارف 1. */
export const NOW_EXERCISE = {
  id: 'now-35-1', source: src('now-35-1', 35, 'دوري الآن', 1), learningPointId: LP.P3, difficulty: 'moyen',
  statement: 'انشر وبسّط كل مما يلي وبسّطها:',
  items: ['$(3x - 2)(7x - 4)$', '$(8 - 3x)(x + \\sqrt{7}) + (8 + 3x)(x - \\sqrt{7})$'],
  interaction: 'batch',
  question: {
    prompt: 'اختر النشر المبسّط لكل عبارة.',
    rows: [
      { label: '$(3x - 2)(7x - 4)$', options: ['$21x^2 + 8$', '$21x^2 - 26x + 8$', '$21x^2 - 26x - 8$'], correct: 1, correction: '$21x^2 - 12x - 14x + 8 = 21x^2 - 26x + 8$' },
      { label: '$(8 - 3x)(x + \\sqrt{7}) + (8 + 3x)(x - \\sqrt{7})$', options: ['$16x - 6\\sqrt{7}x$', '$16x$', '$-6x^2 + 16x - 6\\sqrt{7}x$'], correct: 0, correction: '$(8x + 8\\sqrt{7} - 3x^2 - 3\\sqrt{7}x) + (8x - 8\\sqrt{7} + 3x^2 - 3\\sqrt{7}x) = 16x - 6\\sqrt{7}x$' },
    ],
    explain: 'في العبارة الثانية تتعادم الحدود $-3x^2$ و $3x^2$، و $8\\sqrt{7}$ و $-8\\sqrt{7}$؛ ويبقى $8x + 8x = 16x$ و $-3\\sqrt{7}x - 3\\sqrt{7}x = -6\\sqrt{7}x$.',
  },
  method: 'ننشر كل جداء بالقاعدة $(a + b)(c + d) = ac + ad + bc + bd$، ثم نجمع الحدود المتشابهة.',
  commonError: 'نشر جداء القوسين بجداءين فقط: $(3x - 2)(7x - 4) = 21x^2 + 8$ ينسى $-12x$ و $-14x$.',
};

export const EX = Object.fromEntries([...EXERCISES, NOW_EXERCISE].map((e) => [e.id, e]));
