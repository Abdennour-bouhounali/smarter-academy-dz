/**
 * Les exercices du MANUEL rattachés au درس 1 « حل معادلة من الدرجة الأولى بمجهول واحد »
 * (couverture : extraction.json → destinations). Chaque énoncé est celui du livre, au mot
 * près ; un exercice à plusieurs équations est découpé en une entrée par équation (la
 * première porte l'énoncé).
 *
 * Une solution est un NOMBRE tapé (`fraction`, sans exiger la forme irréductible : 1,8 et
 * 9/5 sont tous deux justes) ; les solutions écrites avec √ et l'équation SANS solution
 * (تمرين 9، الثانية) sont des CHOIX dont chaque distracteur est faux (vérifié par le calcul).
 */
import { src } from '../../_unit/unitMeta.js';

export const LP = {
  P1: '4am_muadala-ula_P1',
  P2: '4am_muadala-ula_P2',
};

const E = (n, part) => ({ ...src(`ex-${n}`, 50, 'أوظّف تعلّماتي', n), ...(part ? { part } : {}) });
const F = (prompt, expected, explain) => ({ interaction: 'fraction', question: { prompt, expected, explain, requireIrreducible: false } });
const C = (prompt, options, correct, explain, cols = 1) => ({ interaction: 'choice', question: { prompt, options, correct, cols, explain } });

/* ── Module 3 — دوري الآن (p. 47) ──────────────────────────────────────────── */
const NOW_SRC = (part) => ({ ...src('now-47-1', 47, 'دوري الآن', 1), part });
export const NOW_47_1 = [
  {
    id: 'now-47-1-a', source: NOW_SRC('a'), learningPointId: LP.P2, difficulty: 'facile',
    statement: 'حل كل معادلة مما يلي: $7 - 2x = 0$ ، $\\dfrac{-x + 3}{2} = \\dfrac{2x + 1}{3}$ ، $2x - \\dfrac{1}{3} = \\dfrac{x}{5} + 2$ .',
    ...F('$7 - 2x = 0$ ، الحل:', '7/2', 'نطرح 7 من الطرفين: $-2x = -7$ ، ثم نقسم على $-2$ : $x = \\dfrac{-7}{-2} = \\dfrac{7}{2}$.'),
    method: 'نجمع الأعداد في طرف والحد الذي فيه $x$ في الطرف الآخر، ثم نقسم على المعامل مع إشارته.',
    commonError: 'نسيان إشارة المعامل $-2$ عند القسمة: $x = -\\dfrac{7}{2}$.',
  },
  {
    id: 'now-47-1-b', source: NOW_SRC('b'), learningPointId: LP.P2, difficulty: 'difficile',
    ...F('$\\dfrac{-x + 3}{2} = \\dfrac{2x + 1}{3}$ ، الحل:', '1', 'نضرب الطرفين في 6: $3(-x + 3) = 2(2x + 1)$ أي $-3x + 9 = 4x + 2$ ، ومنه $-7x = -7$ و $x = 1$.'),
    method: 'نضرب الطرفين في العدد نفسه 6 لنتخلّص من المقامات، ثم ننشر.',
    commonError: 'ضرب البسطين فقط دون نشر: $-x + 3 \\times 3 = \\dots$ بدل $3(-x + 3)$.',
  },
  {
    id: 'now-47-1-c', source: NOW_SRC('c'), learningPointId: LP.P2, difficulty: 'difficile',
    ...F('$2x - \\dfrac{1}{3} = \\dfrac{x}{5} + 2$ ، الحل:', '35/27', 'نضرب الطرفين في 15: $30x - 5 = 3x + 30$ أي $27x = 35$ ، ومنه $x = \\dfrac{35}{27}$.'),
    method: 'نضرب كل حدود الطرفين في 15، ثم ننقل المجاهيل إلى طرف والمعاليم إلى الآخر.',
    commonError: 'ضرب حدّ واحد فقط في 15: كل حدود الطرفين تُضرب.',
  },
];

/* ── Module 4 — أوظّف تعلّماتي (p. 50) ─────────────────────────────────────── */
const SOLVE = 'حل كل معادلة من المعادلات المقترحة:';
export const EXERCISES = [
  // تمرين 1 — ax = b
  { id: 'ex-1-a', source: E(1, 'a'), learningPointId: LP.P1, difficulty: 'facile', statement: SOLVE,
    items: ['$2x = 11$', '$-3x = 5$', '$2{,}8x = 5{,}6$', '$\\dfrac{x}{4} = 7$'],
    ...F('$2x = 11$ ، الحل:', '11/2', '$ax = b$ مع $a = 2$ و $b = 11$ : $x = \\dfrac{11}{2}$.'),
    method: 'المعادلة من الشكل $ax = b$ : نقسم الطرفين على $a$.',
    commonError: 'قلب حاصل القسمة: $x = \\dfrac{2}{11}$.' },
  { id: 'ex-1-b', source: E(1, 'b'), learningPointId: LP.P1, difficulty: 'facile',
    ...F('$-3x = 5$ ، الحل:', '-5/3', 'نقسم الطرفين على $-3$ : $x = \\dfrac{5}{-3} = -\\dfrac{5}{3}$.'),
    commonError: 'إهمال إشارة المعامل: $x = \\dfrac{5}{3}$.' },
  { id: 'ex-1-c', source: E(1, 'c'), learningPointId: LP.P1, difficulty: 'facile',
    ...F('$2{,}8x = 5{,}6$ ، الحل:', '2', '$x = \\dfrac{5{,}6}{2{,}8} = 2$.'),
    commonError: 'طرح 2,8 بدل القسمة عليه: $x = 2{,}8$.' },
  { id: 'ex-1-d', source: E(1, 'd'), learningPointId: LP.P1, difficulty: 'moyen',
    ...F('$\\dfrac{x}{4} = 7$ ، الحل:', '28', '$\\dfrac{x}{4} = \\dfrac{1}{4}x$ : نضرب الطرفين في 4، $x = 28$.'),
    commonError: 'القسمة على 4 بدل الضرب: $x = \\dfrac{7}{4}$.' },
  // تمرين 2 — puissances
  { id: 'ex-2-a', source: E(2, 'a'), learningPointId: LP.P1, difficulty: 'facile', statement: SOLVE,
    items: ['$10x = 10^2$', '$10^5x = 10^3$', '$7^2x = 7^3$'],
    ...F('$10x = 10^2$ ، الحل:', '10', '$x = \\dfrac{10^2}{10} = 10$.') },
  { id: 'ex-2-b', source: E(2, 'b'), learningPointId: LP.P1, difficulty: 'moyen',
    ...F('$10^5x = 10^3$ ، الحل:', '1/100', '$x = \\dfrac{10^3}{10^5} = \\dfrac{1}{10^2} = \\dfrac{1}{100}$ (أي $0{,}01$).'),
    commonError: 'قلب حاصل القسمة: $x = \\dfrac{10^5}{10^3} = 100$.' },
  { id: 'ex-2-c', source: E(2, 'c'), learningPointId: LP.P1, difficulty: 'facile',
    ...F('$7^2x = 7^3$ ، الحل:', '7', '$x = \\dfrac{7^3}{7^2} = 7$.') },
  // تمرين 3 — x + b = c
  { id: 'ex-3-a', source: E(3, 'a'), learningPointId: LP.P2, difficulty: 'facile', statement: SOLVE,
    items: ['$x + 11 = 2$', '$x - 4 = 4$', '$\\sqrt{2} - x = 1 - \\sqrt{2}$', '$3{,}2 + x = 5$'],
    ...F('$x + 11 = 2$ ، الحل:', '-9', 'نطرح 11 من الطرفين: $x = 2 - 11 = -9$.'),
    method: 'نطرح العدد نفسه من الطرفين (أو نضيفه) ليبقى $x$ وحده.',
    commonError: 'نقل 11 دون تغيير إشارته: $x = 2 + 11 = 13$.' },
  { id: 'ex-3-b', source: E(3, 'b'), learningPointId: LP.P2, difficulty: 'facile',
    ...F('$x - 4 = 4$ ، الحل:', '8', 'نضيف 4 إلى الطرفين: $x = 4 + 4 = 8$.'),
    commonError: 'طرح 4 من الطرفين: $x - 8 = 0$ ثم $x = 0$.' },
  { id: 'ex-3-c', source: E(3, 'c'), learningPointId: LP.P2, difficulty: 'difficile',
    ...C('$\\sqrt{2} - x = 1 - \\sqrt{2}$ ، الحل:', ['$1 - 2\\sqrt{2}$', '$2\\sqrt{2} - 1$', '$1$'], 1,
      'نطرح $\\sqrt{2}$ من الطرفين: $-x = 1 - 2\\sqrt{2}$ ، ثم نضرب في $-1$ : $x = 2\\sqrt{2} - 1$.'),
    commonError: 'نسيان أنّ $-x = 1 - 2\\sqrt{2}$ يعطي $x = -(1 - 2\\sqrt{2})$.' },
  { id: 'ex-3-d', source: E(3, 'd'), learningPointId: LP.P2, difficulty: 'facile',
    ...F('$3{,}2 + x = 5$ ، الحل:', '9/5', 'نطرح 3,2 من الطرفين: $x = 5 - 3{,}2 = 1{,}8 = \\dfrac{9}{5}$.') },
  // تمرين 4 — ax + b = cx + d
  { id: 'ex-4-a', source: E(4, 'a'), learningPointId: LP.P2, difficulty: 'facile', statement: SOLVE,
    items: ['$5x + 6 = 11$', '$2x - 3 = 3x + 1$', '$4x - 3 = -2x + 5$', '$5x + 11 = 11x + 5$'],
    ...F('$5x + 6 = 11$ ، الحل:', '1', '$5x = 11 - 6 = 5$ ، ومنه $x = 1$.') },
  { id: 'ex-4-b', source: E(4, 'b'), learningPointId: LP.P2, difficulty: 'moyen',
    ...F('$2x - 3 = 3x + 1$ ، الحل:', '-4', 'نطرح $2x$ من الطرفين: $-3 = x + 1$ ، ثم نطرح 1: $x = -4$.'),
    method: 'ننقل المجاهيل إلى طرف والمعاليم إلى الطرف الآخر، ثم نجمع الحدود المتشابهة.',
    commonError: 'جمع $2x$ و $3x$ بدل طرح أحدهما من الطرفين: $5x = 4$.' },
  { id: 'ex-4-c', source: E(4, 'c'), learningPointId: LP.P2, difficulty: 'moyen',
    ...F('$4x - 3 = -2x + 5$ ، الحل:', '4/3', 'نضيف $2x$ و 3 إلى الطرفين: $6x = 8$ ، ومنه $x = \\dfrac{8}{6} = \\dfrac{4}{3}$.'),
    commonError: 'نقل $-2x$ دون تغيير إشارته: $2x = 8$.' },
  { id: 'ex-4-d', source: E(4, 'd'), learningPointId: LP.P2, difficulty: 'moyen',
    ...F('$5x + 11 = 11x + 5$ ، الحل:', '1', '$11 - 5 = 11x - 5x$ أي $6 = 6x$ ، ومنه $x = 1$.') },
  // تمرين 5 — coefficients avec √
  { id: 'ex-5-a', source: E(5, 'a'), learningPointId: LP.P1, difficulty: 'moyen', statement: 'حل كل معادلة من المعادلات الآتية:',
    items: ['$\\sqrt{2}x = \\sqrt{8}$', '$2\\sqrt{3}x = \\sqrt{3}x + \\sqrt{27}$', '$\\sqrt{2}x + \\sqrt{8}x = 4\\sqrt{2} + 8\\sqrt{2}$', '$\\dfrac{1}{\\sqrt{2}}x - \\dfrac{1}{2}x = \\dfrac{5}{\\sqrt{2} + 1}$', '$2\\sqrt{5}x - \\dfrac{\\sqrt{5}}{3}x = \\dfrac{\\sqrt{5}}{5}$'],
    ...F('$\\sqrt{2}x = \\sqrt{8}$ ، الحل:', '2', '$x = \\dfrac{\\sqrt{8}}{\\sqrt{2}} = \\sqrt{4} = 2$.') },
  { id: 'ex-5-b', source: E(5, 'b'), learningPointId: LP.P2, difficulty: 'moyen',
    ...F('$2\\sqrt{3}x = \\sqrt{3}x + \\sqrt{27}$ ، الحل:', '3', 'نطرح $\\sqrt{3}x$ من الطرفين: $\\sqrt{3}x = \\sqrt{27} = 3\\sqrt{3}$ ، ومنه $x = 3$.') },
  { id: 'ex-5-c', source: E(5, 'c'), learningPointId: LP.P2, difficulty: 'moyen',
    ...F('$\\sqrt{2}x + \\sqrt{8}x = 4\\sqrt{2} + 8\\sqrt{2}$ ، الحل:', '4', '$\\sqrt{8} = 2\\sqrt{2}$ : $3\\sqrt{2}x = 12\\sqrt{2}$ ، ومنه $x = 4$.') },
  { id: 'ex-5-d', source: E(5, 'd'), learningPointId: LP.P1, difficulty: 'difficile',
    ...F('$\\dfrac{1}{\\sqrt{2}}x - \\dfrac{1}{2}x = \\dfrac{5}{\\sqrt{2} + 1}$ ، الحل:', '10', '$\\dfrac{1}{\\sqrt{2}} - \\dfrac{1}{2} = \\dfrac{\\sqrt{2} - 1}{2}$ و $\\dfrac{5}{\\sqrt{2} + 1} = 5(\\sqrt{2} - 1)$ : $\\dfrac{\\sqrt{2} - 1}{2}x = 5(\\sqrt{2} - 1)$ ، ومنه $x = 10$.') },
  { id: 'ex-5-e', source: E(5, 'e'), learningPointId: LP.P1, difficulty: 'difficile',
    ...F('$2\\sqrt{5}x - \\dfrac{\\sqrt{5}}{3}x = \\dfrac{\\sqrt{5}}{5}$ ، الحل:', '3/25', '$\\left(2 - \\dfrac{1}{3}\\right)\\sqrt{5}x = \\dfrac{5}{3}\\sqrt{5}x = \\dfrac{\\sqrt{5}}{5}$ ، ومنه $x = \\dfrac{1}{5} \\times \\dfrac{3}{5} = \\dfrac{3}{25}$.') },
  // تمرين 6
  { id: 'ex-6-1', source: E(6, '1)'), learningPointId: LP.P2, difficulty: 'moyen',
    statement: '1) انشر العبارة وبسطها $2x + 24 - 7(x - 2)$ . 2) حل المعادلة $2x + 24 - 7(x - 2) = 138$ .',
    ...C('1) $2x + 24 - 7(x - 2) = $', ['$-5x + 10$', '$-5x + 38$', '$-5x + 22$'], 1,
      '$2x + 24 - 7x + 14 = -5x + 38$ : $-7 \\times (-2) = +14$.', 3),
    commonError: 'نسيان أنّ $-7 \\times (-2) = +14$ : $-5x + 10$.' },
  { id: 'ex-6-2', source: E(6, '2)'), learningPointId: LP.P2, difficulty: 'moyen',
    ...F('2) حل المعادلة $2x + 24 - 7(x - 2) = 138$ ، الحل:', '-20', '$-5x + 38 = 138$ أي $-5x = 100$ ، ومنه $x = -20$.') },
  // تمرين 7
  { id: 'ex-7-1', source: E(7, '1)'), learningPointId: LP.P2, difficulty: 'moyen',
    statement: '1) انشر كلا من العبارتين وبسطها $2(2x - 1) + 3$ و $5(x + 3) - 3x$ . 2) حل المعادلة $2(2x - 1) + 3 = 5(x + 3) - 3x$ .',
    interaction: 'batch',
    question: {
      prompt: '1) النشر والتبسيط:',
      rows: [
        { label: '$2(2x - 1) + 3 = $', options: ['$4x + 1$', '$4x + 5$', '$4x + 2$'], correct: 0, correction: '$4x - 2 + 3 = 4x + 1$' },
        { label: '$5(x + 3) - 3x = $', options: ['$2x + 3$', '$2x + 15$', '$8x + 15$'], correct: 1, correction: '$5x + 15 - 3x = 2x + 15$' },
      ],
    },
    commonError: 'ضرب الحد الأول وحده: $5(x + 3) = 5x + 3$.' },
  { id: 'ex-7-2', source: E(7, '2)'), learningPointId: LP.P2, difficulty: 'moyen',
    ...F('2) حل المعادلة $2(2x - 1) + 3 = 5(x + 3) - 3x$ ، الحل:', '7', '$4x + 1 = 2x + 15$ أي $2x = 14$ ، ومنه $x = 7$.') },
  // تمرين 8
  { id: 'ex-8-a', source: E(8, 'a'), learningPointId: LP.P2, difficulty: 'difficile', statement: 'حل كل معادلة من المعادلتين الآتيتين:',
    items: ['$\\dfrac{1}{2}(2x - 1) - 3\\left(\\dfrac{2}{3}x - \\dfrac{1}{2}\\right) = 0$', '$4x^2 - 2(x + 5) - 3 - 2x(2x - 3) = 0$'],
    ...F('$\\dfrac{1}{2}(2x - 1) - 3\\left(\\dfrac{2}{3}x - \\dfrac{1}{2}\\right) = 0$ ، الحل:', '1', '$x - \\dfrac{1}{2} - 2x + \\dfrac{3}{2} = 0$ أي $-x + 1 = 0$ ، ومنه $x = 1$.') },
  { id: 'ex-8-b', source: E(8, 'b'), learningPointId: LP.P2, difficulty: 'difficile',
    ...F('$4x^2 - 2(x + 5) - 3 - 2x(2x - 3) = 0$ ، الحل:', '13/4', '$4x^2 - 2x - 10 - 3 - 4x^2 + 6x = 4x - 13$ : الحدّان $4x^2$ يتلاشيان، $4x - 13 = 0$ ومنه $x = \\dfrac{13}{4}$.'),
    commonError: 'التوقّف عند $x^2$ : بعد النشر يتلاشى $4x^2 - 4x^2$ والمعادلة من الدرجة الأولى.' },
  // تمرين 9
  { id: 'ex-9-a', source: E(9, 'a'), learningPointId: LP.P2, difficulty: 'moyen', statement: 'حل كل معادلة من المعادلات الآتية:',
    items: ['$\\dfrac{x - 1}{9} = \\dfrac{x + 1}{3}$', '$\\dfrac{2 + x}{2} = \\dfrac{2x + 1}{4}$', '$\\dfrac{x + 4}{10} = \\dfrac{3}{10} - \\dfrac{2x}{5}$', '$x = \\dfrac{x + 3}{5} + 1$'],
    ...F('$\\dfrac{x - 1}{9} = \\dfrac{x + 1}{3}$ ، الحل:', '-2', 'نضرب الطرفين في 9: $x - 1 = 3(x + 1) = 3x + 3$ ، أي $-2x = 4$ ومنه $x = -2$.') },
  { id: 'ex-9-b', source: E(9, 'b'), learningPointId: LP.P2, difficulty: 'difficile',
    ...C('$\\dfrac{2 + x}{2} = \\dfrac{2x + 1}{4}$ :', ['$x = 0$', '$x = -\\dfrac{3}{2}$', 'لا يوجد أي عدد يحقّق المساواة'], 2,
      'نضرب الطرفين في 4: $2(2 + x) = 2x + 1$ أي $4 + 2x = 2x + 1$ ، ثم نطرح $2x$ من الطرفين: يبقى 4 في طرف و 1 في الآخر، و $4 \\neq 1$ مهما كان $x$ — لا يوجد أي عدد يحقّق المساواة.'),
    commonError: 'البحث عن قيمة لـ $x$ بعد أن يختفي من الطرفين: حين يبقى عددان مختلفان، لا يوجد أي عدد يحقّق المساواة.' },
  { id: 'ex-9-c', source: E(9, 'c'), learningPointId: LP.P2, difficulty: 'difficile',
    ...F('$\\dfrac{x + 4}{10} = \\dfrac{3}{10} - \\dfrac{2x}{5}$ ، الحل:', '-1/5', 'نضرب الطرفين في 10: $x + 4 = 3 - 4x$ ، أي $5x = -1$ ومنه $x = -\\dfrac{1}{5}$.') },
  { id: 'ex-9-d', source: E(9, 'd'), learningPointId: LP.P2, difficulty: 'moyen',
    ...F('$x = \\dfrac{x + 3}{5} + 1$ ، الحل:', '2', 'نضرب الطرفين في 5: $5x = x + 3 + 5$ ، أي $4x = 8$ ومنه $x = 2$.'),
    commonError: 'ضرب الكسر وحده في 5 ونسيان الحد 1: $5x = x + 3 + 1$.' },
];

/** Les parties d'un exercice. */
export const partsOf = (n) => EXERCISES.filter((ex) => ex.id === `ex-${n}` || ex.id.startsWith(`ex-${n}-`));

/** Accès par id. */
export const EX = Object.fromEntries([...NOW_47_1, ...EXERCISES].map((ex) => [ex.id, ex]));
