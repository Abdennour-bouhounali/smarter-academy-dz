/**
 * Les exercices du MANUEL rattachés à la synthèse (extraction › destinations :
 * ex-34 p. 39, ex-37 à ex-40 p. 41 — module 3 « أتعمّق »). Chaque énoncé est
 * celui du livre, au mot près ; un exercice à plusieurs questions est découpé
 * en une entrée par question (la première porte l'énoncé).
 *
 * Une FORME (développée, factorisée, encadrement) est demandée en choix, dont
 * les distracteurs sont FAUX et viennent d'erreurs réelles (2ab oublié, signe
 * perdu devant une parenthèse, coefficient non élevé au carré) ; une VALEUR est
 * tapée (`numeric`, lue par parseDec).
 */
import { src } from '../../_unit/unitMeta.js';

export const LP = {
  P1: '4am_wadiya-idmajiya-harfi_P1',
  P2: '4am_wadiya-idmajiya-harfi_P2',
  P3: '4am_wadiya-idmajiya-harfi_P3',
};

const E = (n, page, section, part) => ({ ...src(`ex-${n}`, page, section, n), ...(part ? { part } : {}) });
const C = (prompt, options, correct, explain, cols = 2) => ({ prompt, options, correct, cols, explain });
const N = (prompt, expected, explain, display) => ({ prompt, expected, explain, ...(display ? { display } : {}) });

export const EXERCISES = [
  /* ── تمرين 34 (p. 39) — مثلث قائم في B : AB = x + 4 ، BC = 4x ── */
  {
    id: 'ex-34-1a', source: E(34, 39, 'أوظّف تعلّماتي', '1)'), learningPointId: LP.P2, difficulty: 'facile',
    statement: 'ABC مثلث قائم في B، و $x$ عدد موجب، ووحدة الطول هي السنتيمتر. 1) تحقّق من أنّ مساحة المثلث ABC تساوي $2x^2 + 8x$ ، واحسب هذه المساحة من أجل $x = 1$ . 2) عبّر عن $AC^2$ بدلالة $x$، واكتب العبارة على شكل نشر مبسّط. 3) احسب الطول AC من أجل $x = 2$ .',
    items: ['في الشكل: $AB = x + 4$ و $BC = 4x$.'],
    interaction: 'choice',
    question: C('مساحة المثلث ABC هي:', [
      '$\\dfrac{AB \\times BC}{2} = \\dfrac{4x(x + 4)}{2} = 2x^2 + 8x$',
      '$AB \\times BC = 4x(x + 4) = 4x^2 + 16x$',
      '$\\dfrac{AB + BC}{2} = \\dfrac{5x + 4}{2}$',
    ], 0, 'المثلث قائم في B، فضلعاه القائمان AB و BC: المساحة نصف جداءيهما، $\\dfrac{4x^2 + 16x}{2} = 2x^2 + 8x$.', 1),
    method: 'نعبّر عن المساحة بدلالة $x$ بقاعدة مساحة المثلث القائم، ثم ننشر ونبسّط.',
    commonError: 'نسيان القسمة على 2: $4x^2 + 16x$ هي مساحة المستطيل الذي بعداه AB و BC.',
  },
  {
    id: 'ex-34-1b', source: E(34, 39, 'أوظّف تعلّماتي', '1)'), learningPointId: LP.P3, difficulty: 'facile',
    interaction: 'numeric',
    question: N('مساحة المثلث ABC (بـ $cm^2$) من أجل $x = 1$ :', 10, '$2 \\times 1^2 + 8 \\times 1 = 2 + 8 = 10$ ؛ ونتحقق: $AB = 5$ و $BC = 4$ و $\\dfrac{5 \\times 4}{2} = 10$.'),
  },
  {
    id: 'ex-34-2', source: E(34, 39, 'أوظّف تعلّماتي', '2)'), learningPointId: LP.P1, difficulty: 'moyen',
    interaction: 'choice',
    question: C('$AC^2 = AB^2 + BC^2 = $', ['$17x^2 + 8x + 16$', '$17x^2 + 16$', '$5x^2 + 8x + 16$', '$17x^2 + 4x + 16$'], 0,
      'خاصية فيثاغورس: $AC^2 = (x + 4)^2 + (4x)^2 = x^2 + 8x + 16 + 16x^2 = 17x^2 + 8x + 16$.'),
    method: 'خاصية فيثاغورس، ثم متطابقة مربع مجموع و $(4x)^2 = 16x^2$.',
    commonError: 'كتابة $(4x)^2 = 4x^2$ (المعامل لا يُربَّع)، أو نسيان الحد المضاعف $8x$.',
  },
  {
    id: 'ex-34-3', source: E(34, 39, 'أوظّف تعلّماتي', '3)'), learningPointId: LP.P3, difficulty: 'moyen',
    interaction: 'numeric',
    question: N('الطول AC (بـ cm) من أجل $x = 2$ :', 10, '$AC^2 = 17 \\times 4 + 8 \\times 2 + 16 = 68 + 16 + 16 = 100$ ، والطول موجب: $AC = 10$. (نتحقق: $AB = 6$ ، $BC = 8$.)'),
  },

  /* ── تمرين 37 (p. 41) — المربع ABCD ── */
  {
    id: 'ex-37-1', source: E(37, 41, 'أتعمّق', '1)'), learningPointId: LP.P2, difficulty: 'moyen',
    statement: 'وحدة الطول هي السنتيمتر، و $x$ عدد موجب. لوّنا في المربع ABCD مستطيلين ومربّعا كما في الشكل. 1) أوجد حصرا للعدد $x$. 2) بيّن أنّ الطولين EF و GH متساويان، وعبّر عنهما بدلالة $x$. 3) تحقّق بطريقتين مختلفتين أنّ مساحة الجزء غير الملوّن من الشكل هي $\\mathcal{A} = 60 - 4x - x^2$ . 4) احسب مساحة الجزء غير الملوّن من أجل $x = 4$ .',
    interaction: 'choice',
    question: C('حصر للعدد $x$ :', ['$0 < x < 6$', '$0 < x < 10$', '$0 < x < 4$', '$4 < x < 10$'], 0,
      'على الضلع AB: $AE + EF + FB = 10$ أي $x + EF + 4 = 10$ ، و $EF > 0$ : إذن $x < 6$ ، و $x > 0$.'),
    method: 'نكتب أنّ مجموع الأطوال على ضلع واحد يساوي 10، وأنّ كل طول موجب.',
    commonError: 'الاكتفاء بـ $x < 10$ (ضلع المربع) ونسيان المستطيل (1) الذي عرضه 4.',
  },
  {
    id: 'ex-37-2', source: E(37, 41, 'أتعمّق', '2)'), learningPointId: LP.P2, difficulty: 'moyen',
    interaction: 'choice',
    question: C('$EF = GH = $', ['$6 - x$', '$10 - x$', '$x - 6$', '$6 + x$'], 0,
      '$EF = AB - AE - FB = 10 - x - 4 = 6 - x$ و $GH = AD - AG - HD = 10 - x - 4 = 6 - x$ (المربع ضلعه $x$ و $HD = 4$).'),
    commonError: 'طرح $x$ وحده: $10 - x$ ، ونسيان الطول 4.',
  },
  {
    id: 'ex-37-3', source: E(37, 41, 'أتعمّق', '3)'), learningPointId: LP.P1, difficulty: 'difficile',
    interaction: 'batch',
    question: {
      prompt: 'أيّ كتابة تعطي مساحة الجزء غير الملوّن $\\mathcal{A} = 60 - 4x - x^2$ ؟',
      rows: [
        { label: 'الطريقة 1: $10^2 - x^2 - 4 \\times 10 - 4x$ (المربع ABCD ناقص الأجزاء الملوّنة)', options: ['يساويه', 'لا يساويه'], correct: 0, correction: '$100 - x^2 - 40 - 4x = 60 - 4x - x^2$' },
        { label: 'الطريقة 2: $10(6 - x) + x(6 - x)$ (الشريطان غير الملوّنين)', options: ['يساويه', 'لا يساويه'], correct: 0, correction: '$60 - 10x + 6x - x^2 = 60 - 4x - x^2$' },
        { label: '$(10 - x)(6 - x)$', options: ['يساويه', 'لا يساويه'], correct: 1, correction: '$(10 - x)(6 - x) = 60 - 16x + x^2$ : عبارة أخرى.' },
      ],
    },
    method: 'طريقتان: الكل ناقص الأجزاء، أو مجموع الأجزاء غير الملوّنة — ثم ننشر ونبسّط.',
    commonError: 'نسيان أنّ المستطيل (2) بعداه $x$ و 4، فمساحته $4x$ لا $x$.',
  },
  {
    id: 'ex-37-4', source: E(37, 41, 'أتعمّق', '4)'), learningPointId: LP.P3, difficulty: 'facile',
    interaction: 'numeric',
    question: N('مساحة الجزء غير الملوّن (بـ $cm^2$) من أجل $x = 4$ :', 28, '$60 - 4 \\times 4 - 4^2 = 60 - 16 - 16 = 28$ ؛ وبالطريقة 2: $10 \\times 2 + 4 \\times 2 = 28$.'),
  },

  /* ── تمرين 38 (p. 41) — مثلث قائم في B : BC = x + 2 ، AC = 2x + 5 ── */
  {
    id: 'ex-38-1', source: E(38, 41, 'أتعمّق', '1)'), learningPointId: LP.P2, difficulty: 'moyen',
    statement: 'باستعمال معطيات الشّكل المرفق. 1) عبّر بدلالة $x$ عن $AB^2$. 2) اكتب عبارة $AB^2$ التي وجدتها مرّة على شكل جداء، ومرّة أخرى على شكل نشر مبسّط. 3) احسب في حالة $x = 0$ وبطريقتين مختلفتين الطول AB بالتدوير إلى $10^{-2}$.',
    items: ['في الشكل: مثلث ABC قائم في B حيث $BC = x + 2$ و $AC = 2x + 5$.'],
    interaction: 'choice',
    question: C('$AB^2 = $', ['$(2x + 5)^2 - (x + 2)^2$', '$(2x + 5)^2 + (x + 2)^2$', '$(x + 2)^2 - (2x + 5)^2$', '$(2x + 5 - x - 2)^2$'], 0,
      'المثلث قائم في B، فالوتر AC: $AC^2 = AB^2 + BC^2$ ، إذن $AB^2 = AC^2 - BC^2 = (2x + 5)^2 - (x + 2)^2$.'),
    commonError: 'جمع المربعين كأنّ AB هو الوتر.',
  },
  {
    id: 'ex-38-2a', source: E(38, 41, 'أتعمّق', '2)'), learningPointId: LP.P1, difficulty: 'difficile',
    interaction: 'choice',
    question: C('على شكل جداء: $AB^2 = $', ['$(x + 3)(3x + 7)$', '$(x + 7)(3x + 7)$', '$(x + 3)^2$', '$(x + 3)(3x + 3)$'], 0,
      'فرق مربعين: $\\big((2x + 5) - (x + 2)\\big)\\big((2x + 5) + (x + 2)\\big) = (x + 3)(3x + 7)$.'),
    method: 'نتعرّف على الشكل $a^2 - b^2 = (a - b)(a + b)$ حيث $a = 2x + 5$ و $b = x + 2$.',
    commonError: 'حذف القوسين المسبوقين بـ − دون تغيير الإشارة: $2x + 5 - x + 2 = x + 7$.',
  },
  {
    id: 'ex-38-2b', source: E(38, 41, 'أتعمّق', '2)'), learningPointId: LP.P1, difficulty: 'moyen',
    interaction: 'choice',
    question: C('على شكل نشر مبسّط: $AB^2 = $', ['$3x^2 + 16x + 21$', '$3x^2 + 21$', '$5x^2 + 24x + 29$', '$3x^2 + 16x + 29$'], 0,
      '$(4x^2 + 20x + 25) - (x^2 + 4x + 4) = 3x^2 + 16x + 21$ ؛ ونجد النتيجة نفسها بنشر $(x + 3)(3x + 7)$.'),
    commonError: 'طرح $x^2$ وحده ونسيان تغيير إشارة $4x$ و 4.',
  },
  {
    id: 'ex-38-3', source: E(38, 41, 'أتعمّق', '3)'), learningPointId: LP.P3, difficulty: 'moyen',
    interaction: 'numeric',
    question: N('الطول AB من أجل $x = 0$ ، بالتدوير إلى $10^{-2}$ :', 4.58,
      'بالشكل المحلّل: $AB^2 = 3 \\times 7 = 21$ ، وبالنشر: $AB^2 = 21$. إذن $AB = \\sqrt{21} \\approx 4{,}58$.', '4,58'),
  },

  /* ── تمرين 39 (p. 41) — D = x² − 4 + (x − 2)(3x + 5) ── */
  {
    id: 'ex-39-1', source: E(39, 41, 'أتعمّق', '1)'), learningPointId: LP.P1, difficulty: 'moyen',
    statement: 'إليك العبارة الجبرية D حيث $D = x^2 - 4 + (x - 2)(3x + 5)$ . 1) انشر العبارة D. 2) حلّل $x^2 - 4$ استنتج تحليلا للعبارة D. 3) استعمل العبارة المناسبة لحساب قيمة D من أجل: $x = 2$ ؛ $x = 0$ ؛ $x = -1{,}75$ .',
    interaction: 'choice',
    question: C('$D = $', ['$4x^2 - x - 14$', '$4x^2 + 11x - 14$', '$4x^2 - x - 10$', '$3x^2 - x - 14$'], 0,
      '$(x - 2)(3x + 5) = 3x^2 + 5x - 6x - 10 = 3x^2 - x - 10$ ، إذن $D = x^2 - 4 + 3x^2 - x - 10 = 4x^2 - x - 14$.'),
    commonError: 'إشارة الجداء $(-2) \\times 3x = -6x$ ، أو نسيان الحد $-4$.',
  },
  {
    id: 'ex-39-2a', source: E(39, 41, 'أتعمّق', '2)'), learningPointId: LP.P1, difficulty: 'facile',
    interaction: 'choice',
    question: C('$x^2 - 4 = $', ['$(x - 2)(x + 2)$', '$(x - 2)^2$', '$(x - 4)(x + 4)$'], 0, 'فرق مربعين: $x^2 - 2^2 = (x - 2)(x + 2)$.', 3),
  },
  {
    id: 'ex-39-2b', source: E(39, 41, 'أتعمّق', '2)'), learningPointId: LP.P1, difficulty: 'moyen',
    interaction: 'choice',
    question: C('$D = $', ['$(x - 2)(4x + 7)$', '$(x - 2)(3x + 7)$', '$(x + 2)(4x + 7)$', '$(x - 2)(4x + 3)$'], 0,
      'العامل المشترك $(x - 2)$ : $D = (x - 2)(x + 2) + (x - 2)(3x + 5) = (x - 2)(x + 2 + 3x + 5) = (x - 2)(4x + 7)$.'),
    commonError: 'نسيان أحد الحدّين داخل القوس الثاني بعد استخراج العامل المشترك.',
  },
  {
    id: 'ex-39-3a', source: E(39, 41, 'أتعمّق', '3)'), learningPointId: LP.P3, difficulty: 'facile',
    interaction: 'numeric',
    question: N('$D$ من أجل $x = 2$ :', 0, 'الشكل المحلّل هو المناسب: $x - 2 = 0$ ، إذن $D = 0 \\times (4 \\times 2 + 7) = 0$.'),
    method: 'نختار الشكل الذي يسهّل الحساب: المحلّل إذا انعدم أحد عوامله، والمنشور من أجل $x = 0$.',
  },
  {
    id: 'ex-39-3b', source: E(39, 41, 'أتعمّق', '3)'), learningPointId: LP.P3, difficulty: 'facile',
    interaction: 'numeric',
    question: N('$D$ من أجل $x = 0$ :', -14, 'الشكل المنشور هو المناسب: كل الحدود التي فيها $x$ تنعدم، فيبقى الحد الثابت $-14$.'),
  },
  {
    id: 'ex-39-3c', source: E(39, 41, 'أتعمّق', '3)'), learningPointId: LP.P3, difficulty: 'moyen',
    interaction: 'numeric',
    question: N('$D$ من أجل $x = -1{,}75$ :', 0, 'الشكل المحلّل: $4 \\times (-1{,}75) + 7 = -7 + 7 = 0$ ، إذن $D = 0$ دون حساب مربّع.'),
    commonError: 'استعمال الشكل المنشور مع عدد عشري سالب: الحساب أطول ومصدر للأخطاء.',
  },

  /* ── تمرين 40 (p. 41) — E et F ── */
  {
    id: 'ex-40-1', source: E(40, 41, 'أتعمّق', '1)'), learningPointId: LP.P3, difficulty: 'facile',
    statement: '1) نضع : $E = 4x^2 - 8x - 5$ . احسب E من أجل $x = 0{,}5$ . 2) نضع : $F = (2x - 2)^2 - 9$ . أ) انشر ثمّ بسّط العبارة F. ب) حلّل العبارة F. جـ) ميّز العبارة المناسبة التي تسمح بمعرفة قيمة F من أجل $x = 0{,}5$ . دون حساب.',
    interaction: 'numeric',
    question: N('$E$ من أجل $x = 0{,}5$ :', -8, '$4 \\times 0{,}25 - 8 \\times 0{,}5 - 5 = 1 - 4 - 5 = -8$.'),
  },
  {
    id: 'ex-40-2a', source: E(40, 41, 'أتعمّق', '2) أ'), learningPointId: LP.P1, difficulty: 'moyen',
    interaction: 'choice',
    question: C('$F = $', ['$4x^2 - 8x - 5$', '$4x^2 - 5$', '$4x^2 - 4x - 5$', '$4x^2 + 8x - 5$'], 0,
      'مربع فرق: $(2x - 2)^2 = 4x^2 - 8x + 4$ ، إذن $F = 4x^2 - 8x + 4 - 9 = 4x^2 - 8x - 5$.'),
    commonError: 'كتابة $(2x - 2)^2 = 4x^2 + 4$ دون الحد المضاعف.',
  },
  {
    id: 'ex-40-2b', source: E(40, 41, 'أتعمّق', '2) ب'), learningPointId: LP.P1, difficulty: 'moyen',
    interaction: 'choice',
    question: C('$F = $', ['$(2x - 5)(2x + 1)$', '$(2x - 11)(2x + 7)$', '$(2x - 5)^2$', '$(2x + 5)(2x - 1)$'], 0,
      'فرق مربعين لأنّ $9 = 3^2$ : $F = (2x - 2 - 3)(2x - 2 + 3) = (2x - 5)(2x + 1)$.'),
    commonError: 'نسيان أنّ $9 = 3^2$ : $(2x - 2 - 9)(2x - 2 + 9)$ خطأ.',
  },
  {
    id: 'ex-40-2c', source: E(40, 41, 'أتعمّق', '2) جـ'), learningPointId: LP.P3, difficulty: 'difficile',
    interaction: 'choice',
    question: C('لمعرفة قيمة F من أجل $x = 0{,}5$ دون حساب:', [
      'الشكل المنشور: $F = 4x^2 - 8x - 5$ هو العبارة E نفسها، إذن $F = -8$ (السؤال 1)',
      'الشكل المحلّل: أحد عاملي $(2x - 5)(2x + 1)$ معدوم من أجل $x = 0{,}5$ ، إذن $F = 0$',
      'لا توجد عبارة مناسبة: يجب الحساب في كل الحالات',
    ], 0, 'النشر المبسّط لـ F هو E، وقد حسبنا $E = -8$ من أجل $x = 0{,}5$. أما العاملان فقيمتاهما $-4$ و 2، وليس أحدهما معدومًا.', 1),
  },
];

/** Les questions d'un exercice du manuel, dans l'ordre. */
export const partsOf = (n) => EXERCISES.filter((e) => e.id === `ex-${n}` || e.id.startsWith(`ex-${n}-`));
