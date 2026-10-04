/**
 * Les exercices du module 3 « أتعمّق » (p. 149) — extraction › destinations : ex-22, ex-23, ex-25 → la synthèse.
 *   ex-22 — A(1 ; 3), B(2 ; 4), C(5 ; 1), D(2 ; 0) : AB² + BC² = 2 + 18 = 20 = AC² (rectangle en B) ; I(3 ; 2) milieu de [AC],
 *           IA = IB = IC = ID = √5 (un cercle) ; ACD rectangle isocèle en D (DA = DC = √10) : ACD = 45° ; tan BCA = √2 / 3√2 = 1/3,
 *           BCA ≈ 18,4° ; angles de ABCD : B = D = 90°, C ≈ 63,4°, A ≈ 116,6° (somme 360°) — l'unité 10 (tan) entre ici ;
 *   ex-23 — A(−3 ; 1), B(3 ; 5), C(5 ; 2) : AB² + BC² = 52 + 13 = 65 = AC² (rectangle en B) ; BD = BA + BC = (−4 ; −7),
 *           D(−1 ; −2) ; ABCD متوازي أضلاع (règle du parallélogramme) avec un angle droit : مستطيل, pas un carré
 *           (AB = 2√13 ≠ BC = √13) ; aire 2√13 × √13 = 26 cm² ; images par u(2 ; 0) : A′(−1 ; 1), B′(5 ; 5), C′(7 ; 2), D′(1 ; −2) ;
 *   ex-25 (شهادة التعليم المتوسط) — A(−2 ; −3), B(4 ; 1), C(2 ; 4) : AB = √52 = 2√13 ; AB² + BC² = 52 + 13 = 65 = AC² ;
 *           E image de A par BC(−2 ; 3) : E(−4 ; 0) ; AE = BC ⇒ ABCE متوازي أضلاع (l'ordre !), angle droit en B : مستطيل.
 * Toutes les réponses sont recalculées par lab.render.test.jsx avec packages/core (vectors.js). Un exercice est découpé en une
 * entrée par question (la première porte l'énoncé). Figures : content/figures.js (les points DONNÉS seulement).
 */
import { src } from '../../_unit/unitMeta.js';

export const LP = {
  P1: '4am_wadiya-idmajiya-maalam_P1',
  P2: '4am_wadiya-idmajiya-maalam_P2',
  P3: '4am_wadiya-idmajiya-maalam_P3',
};

const C = (prompt, options, correct, explain, cols = 1) => ({ prompt, options, correct, cols, explain });

export const EX22_SOURCE = src('ex-22', 149, 'أتعمّق', 22);
export const EX23_SOURCE = src('ex-23', 149, 'أتعمّق', 23);
export const EX25_SOURCE = src('ex-25', 149, 'أتعمّق', 25);

export const EXERCISES = [
  /* ── تمرين 22 ── */
  {
    id: 'ex-22-1', source: EX22_SOURCE, learningPointId: LP.P1, difficulty: 'moyen',
    statement: 'المستوي منسوب إلى معلم متعامد ومتجانس مبدؤه O. (الوحدة 1cm). A، B، C و D أربع نقط حيث $A(1\\,;\\,3)$ ، $B(2\\,;\\,4)$ ، $C(5\\,;\\,1)$ و $D(2\\,;\\,0)$ . 1) بيّن أنّ المثلث ABC قائم.',
    interaction: 'choice',
    question: C('أيّ حساب يبيّن ذلك؟', [
      'قائم في B: $AB^2 + BC^2 = 2 + 18 = 20 = AC^2$',
      'قائم في A: $AB^2 + AC^2 = 2 + 20 = 22 = BC^2$',
      'متساوي الساقين في B لأنّ $AB = BC$',
    ], 0, '$AB^2 = 1^2 + 1^2 = 2$ ، $BC^2 = 3^2 + (-3)^2 = 18$ ، $AC^2 = 4^2 + (-2)^2 = 20$ . أطول ضلع [AC]، و $2 + 18 = 20$ : حسب عكس خاصية فيثاغورس المثلث قائم في B (الرأس المقابل للضلع الأطول). $BC^2 = 18$ لا 22، و $AB = \\sqrt{2} \\neq BC = 3\\sqrt{2}$ .'),
    commonError: 'اختبار الزاوية القائمة في رأس غير الرأس المقابل لأطول ضلع.',
  },
  {
    id: 'ex-22-2', source: EX22_SOURCE, learningPointId: LP.P3, difficulty: 'moyen',
    statement: '2) بيّن أن النقط A، B، C و D تنتمي إلى دائرة واحدة، يُطلب تعيين إحداثيتي مركزها I ونصف قطرها.',
    interaction: 'pair',
    question: {
      prompt: 'المثلث ABC قائم في B: مركز الدائرة المحيطة به هو منتصف الوتر [AC]. إحداثيتا I هما:',
      expected: { x: '3', y: '2' },
      explain: '$x_I = \\dfrac{1 + 5}{2} = 3$ و $y_I = \\dfrac{3 + 1}{2} = 2$ : $I(3\\,;\\,2)$ .',
    },
    commonError: 'حساب نصف الفرق $\\dfrac{5 - 1}{2}$ بدل نصف المجموع.',
  },
  {
    id: 'ex-22-3', source: EX22_SOURCE, learningPointId: LP.P3, difficulty: 'difficile',
    interaction: 'choice',
    question: C('لماذا تنتمي النقط الأربع إلى الدائرة التي مركزها I؟ وما نصف قطرها؟', [
      '$IA = IB = IC = ID = \\sqrt{5}$ : نصف القطر $\\sqrt{5}$',
      '$IA = IC = \\sqrt{5}$ وهذا يكفي: نصف القطر $\\sqrt{5}$',
      '$IA = IB = IC = ID = 5$ : نصف القطر $5$',
      '$AC = 2\\sqrt{5}$ : نصف القطر $2\\sqrt{5}$',
    ], 0, '$IA^2 = 2^2 + 1^2 = 5$ ، $IB^2 = 1^2 + 2^2 = 5$ ، $IC^2 = 2^2 + 1^2 = 5$ ، $ID^2 = 1^2 + 2^2 = 5$ : النقط الأربع على بعد $\\sqrt{5}$ من I. يجب التحقّق من كل نقطة (ومنها D)، و $5$ هو مربع البعد لا البعد، و $2\\sqrt{5}$ هو القطر.'),
    commonError: 'أخذ القطر $AC$ مكان نصف القطر، أو نسيان الجذر.',
  },
  {
    id: 'ex-22-4', source: EX22_SOURCE, learningPointId: LP.P1, difficulty: 'difficile',
    statement: '3) احسب قيمة مقرّبة لكل من الزاويتين $\\widehat{ACD}$ و $\\widehat{BCA}$ ، ثم أعط قيم زوايا الرباعي ABCD.',
    interaction: 'batch',
    question: {
      prompt: 'المثلث ACD قائم في D و $DA = DC = \\sqrt{10}$ ، و $\\tan\\widehat{BCA} = \\dfrac{AB}{BC}$ . اختر القيمة في كل سطر.',
      rows: [
        { label: '$\\widehat{ACD}$', options: ['$45^{\\circ}$', '$90^{\\circ}$', '$63{,}4^{\\circ}$'], correct: 0, correction: 'المثلث ACD قائم ومتساوي الساقين في D: $\\tan\\widehat{ACD} = \\dfrac{DA}{DC} = 1$ ، أي $45^{\\circ}$ .' },
        { label: '$\\widehat{BCA}$', options: ['$18{,}4^{\\circ}$', '$71{,}6^{\\circ}$', '$30^{\\circ}$'], correct: 0, correction: '$\\tan\\widehat{BCA} = \\dfrac{\\sqrt{2}}{3\\sqrt{2}} = \\dfrac{1}{3}$ ومنه $\\widehat{BCA} \\approx 18{,}4^{\\circ}$ ( $71{,}6^{\\circ}$ هي $\\widehat{BAC}$ ).' },
        { label: 'زوايا ABCD', options: ['$\\widehat{B} = \\widehat{D} = 90^{\\circ}$ ، $\\widehat{C} \\approx 63{,}4^{\\circ}$ ، $\\widehat{A} \\approx 116{,}6^{\\circ}$', 'الزوايا الأربع قائمة', '$\\widehat{C} \\approx 26{,}6^{\\circ}$ ، $\\widehat{A} \\approx 153{,}4^{\\circ}$'], correct: 0, correction: '$\\widehat{C} = \\widehat{ACD} + \\widehat{BCA} \\approx 45 + 18{,}4 = 63{,}4$ ، و $\\widehat{A} \\approx 360 - 90 - 90 - 63{,}4 = 116{,}6$ (درجة).' },
      ],
    },
    commonError: 'طرح الزاويتين بدل جمعهما: B و D على جهتين مختلفتين من القطر [AC].',
  },

  /* ── تمرين 23 ── */
  {
    id: 'ex-23-1', source: EX23_SOURCE, learningPointId: LP.P1, difficulty: 'moyen',
    statement: 'المستوي منسوب إلى معلم متعامد ومتجانس مبدؤه O. (الوحدة 1cm). A، B، C ثلاث نقط بحيث $A(-3\\,;\\,1)$ ، $B(3\\,;\\,5)$ ، $C(5\\,;\\,2)$ . 1) علّم النقط A، B، C. 2) ما نوع المثلث ABC؟',
    interaction: 'choice',
    question: C('نوع المثلث ABC:', [
      'قائم في B: $AB^2 + BC^2 = 52 + 13 = 65 = AC^2$',
      'ليس قائما: $AB^2 + AC^2 = 52 + 65 = 117$ لا يساوي $BC^2 = 13$',
      'متساوي الساقين في B: $AB = BC$',
    ], 0, '$AB^2 = 6^2 + 4^2 = 52$ ، $BC^2 = 2^2 + (-3)^2 = 13$ ، $AC^2 = 8^2 + 1^2 = 65$ . أطول ضلع [AC]: نقارن $AC^2$ بـ $AB^2 + BC^2$ فنجد المساواة، والمثلث قائم في B. اختبار الرأس A خطأ في الطريقة (الزاوية القائمة تقابل الضلع الأطول)، و $AB = 2\\sqrt{13} \\neq BC = \\sqrt{13}$ .'),
    commonError: 'مقارنة مربع ضلع غير الأطول بمجموع مربعي الضلعين الآخرين، ثم الحكم بأنّ المثلث ليس قائما.',
  },
  {
    id: 'ex-23-2', source: EX23_SOURCE, learningPointId: LP.P3, difficulty: 'moyen',
    statement: '3) علّم النقطة D بحيث $\\overrightarrow{BD} = \\overrightarrow{BA} + \\overrightarrow{BC}$ ثم احسب إحداثيتي النقطة D.',
    interaction: 'pair',
    question: {
      prompt: '$\\overrightarrow{BA}\\begin{pmatrix} -6 \\\\ -4 \\end{pmatrix}$ و $\\overrightarrow{BC}\\begin{pmatrix} 2 \\\\ -3 \\end{pmatrix}$ . إحداثيتا D هما:',
      expected: { x: '-1', y: '-2' },
      explain: '$\\overrightarrow{BD}\\begin{pmatrix} -6 + 2 \\\\ -4 - 3 \\end{pmatrix} = \\begin{pmatrix} -4 \\\\ -7 \\end{pmatrix}$ ، و $x_D = 3 - 4 = -1$ ، $y_D = 5 - 7 = -2$ : $D(-1\\,;\\,-2)$ .',
    },
    commonError: 'أخذ مركبتي $\\overrightarrow{BD}$ إحداثيتين للنقطة D (نسيان إضافة إحداثيتي B).',
  },
  {
    id: 'ex-23-3', source: EX23_SOURCE, learningPointId: LP.P1, difficulty: 'moyen',
    statement: '4) ما نوع الرباعي ABCD؟',
    interaction: 'choice',
    question: C('الرباعي ABCD هو:', ['مستطيل', 'مربع', 'معيّن', 'متوازي أضلاع ليس له زاوية قائمة'], 0,
      '$\\overrightarrow{BA} + \\overrightarrow{BC} = \\overrightarrow{BD}$ : حسب قاعدة متوازي الأضلاع ABCD متوازي أضلاع، وزاويته B قائمة (السؤال 2): مستطيل. ليس مربعا ولا معيّنا لأنّ $AB = 2\\sqrt{13} \\neq BC = \\sqrt{13}$ .'),
    commonError: 'الاكتفاء بـ « متوازي أضلاع » دون استعمال الزاوية القائمة في B.',
  },
  {
    id: 'ex-23-4', source: EX23_SOURCE, learningPointId: LP.P3, difficulty: 'moyen',
    statement: '5) احسب مساحة الرباعي ABCD.',
    interaction: 'numeric',
    question: { prompt: 'مساحة المستطيل ABCD (بالسنتيمتر المربع):', expected: 26, display: '26', explain: '$\\mathcal{A} = AB \\times BC = 2\\sqrt{13} \\times \\sqrt{13} = 2 \\times 13 = 26\\,\\mathrm{cm^2}$ .' },
    commonError: 'ضرب المربعين $52 \\times 13$ أو جمع الطولين.',
  },
  {
    id: 'ex-23-5', source: EX23_SOURCE, learningPointId: LP.P3, difficulty: 'moyen',
    statement: '6) $\\vec{u}$ شعاع حيث $\\vec{u}\\begin{pmatrix} 2 \\\\ 0 \\end{pmatrix}$ . الرباعي A′B′C′D′ هو صورة الرباعي ABCD بالانسحاب الذي شعاعه $\\vec{u}$ . استنتج إحداثيتي كل رأس من رؤوس الرباعي A′B′C′D′.',
    interaction: 'batch',
    question: {
      prompt: 'نضيف مركبتي $\\vec{u}$ إلى إحداثيتي كل رأس: اختر الصورة في كل سطر.',
      rows: [
        { label: "$A'$", options: ['$(-1\\,;\\,1)$', '$(-3\\,;\\,3)$', '$(-5\\,;\\,1)$'], correct: 0, correction: '$(-3 + 2\\,;\\,1 + 0) = (-1\\,;\\,1)$' },
        { label: "$B'$", options: ['$(5\\,;\\,5)$', '$(3\\,;\\,7)$', '$(1\\,;\\,5)$'], correct: 0, correction: '$(3 + 2\\,;\\,5 + 0) = (5\\,;\\,5)$' },
        { label: "$C'$", options: ['$(7\\,;\\,2)$', '$(5\\,;\\,4)$', '$(3\\,;\\,2)$'], correct: 0, correction: '$(5 + 2\\,;\\,2 + 0) = (7\\,;\\,2)$' },
        { label: "$D'$", options: ['$(1\\,;\\,-2)$', '$(-1\\,;\\,0)$', '$(-3\\,;\\,-2)$'], correct: 0, correction: '$(-1 + 2\\,;\\,-2 + 0) = (1\\,;\\,-2)$' },
      ],
    },
    commonError: 'إضافة المركبة الأولى إلى الترتيب (تبديل x و y) أو طرحها.',
  },

  /* ── تمرين 25 — من امتحان شهادة التعليم المتوسط ── */
  {
    id: 'ex-25-1', source: EX25_SOURCE, learningPointId: LP.P3, difficulty: 'moyen',
    statement: 'من امتحان شهادة التعليم المتوسط. المستوي مزود بمعلم متعامد ومتجانس $(O\\,;\\,\\vec{i},\\,\\vec{j})$ . 1) علّم النقط: $A(-2\\,;\\,-3)$ ، $B(4\\,;\\,1)$ ، $C(2\\,;\\,4)$ . 2) أ) أعط القيمة المضبوطة للطول AB.',
    interaction: 'choice',
    question: C('القيمة المضبوطة للطول AB:', ['$2\\sqrt{13}$', '$10$', '$52$', '$\\sqrt{20}$'], 0,
      '$\\overrightarrow{AB}\\begin{pmatrix} 6 \\\\ 4 \\end{pmatrix}$ ، $AB = \\sqrt{6^2 + 4^2} = \\sqrt{52} = \\sqrt{4 \\times 13} = 2\\sqrt{13}$ . 10 هو $6 + 4$ ، و 52 هو $AB^2$ ، و $\\sqrt{20}$ من $6^2 - 4^2$ .', 2),
    commonError: 'جمع المركبتين $6 + 4 = 10$ بدل حساب الجذر.',
  },
  {
    id: 'ex-25-2', source: EX25_SOURCE, learningPointId: LP.P1, difficulty: 'moyen',
    statement: 'ب) علما أنّ: $AC = \\sqrt{65}$ و $BC = \\sqrt{13}$ ، بيّن أنّ المثلث ABC قائم.',
    interaction: 'choice',
    question: C('المثلث ABC:', [
      'قائم في B لأنّ $AB^2 + BC^2 = 52 + 13 = 65 = AC^2$',
      'قائم في C لأنّ $AC^2 + BC^2 = 65 + 13 = 78$',
      'قائم في A لأنّ [BC] أقصر ضلع',
    ], 0, 'أطول ضلع هو [AC] ( $AC^2 = 65$ )، و $AB^2 + BC^2 = 52 + 13 = 65$ : حسب عكس خاصية فيثاغورس المثلث قائم في B، الرأس المقابل لـ [AC]. $78 \\neq 52$ ، والقائمة لا تقابل أقصر ضلع.'),
    commonError: 'وضع الزاوية القائمة في رأس لا يقابل أطول ضلع.',
  },
  {
    id: 'ex-25-3', source: EX25_SOURCE, learningPointId: LP.P3, difficulty: 'moyen',
    statement: '3) أنشئ النقطة E صورة A بالإنسحاب الذي شعاعه $\\overrightarrow{BC}$ ، أثبت أنّ ABCE مستطيل.',
    interaction: 'pair',
    question: {
      prompt: '$\\overrightarrow{BC}\\begin{pmatrix} -2 \\\\ 3 \\end{pmatrix}$ و $\\overrightarrow{AE} = \\overrightarrow{BC}$ . إحداثيتا E هما:',
      expected: { x: '-4', y: '0' },
      explain: '$x_E = -2 + (-2) = -4$ و $y_E = -3 + 3 = 0$ : $E(-4\\,;\\,0)$ .',
    },
    commonError: 'طرح مركبتي الشعاع بدل إضافتهما ( $E(0\\,;\\,-6)$ ).',
  },
  {
    id: 'ex-25-4', source: EX25_SOURCE, learningPointId: LP.P1, difficulty: 'difficile',
    interaction: 'choice',
    question: C('لماذا ABCE مستطيل؟', [
      '$\\overrightarrow{AE} = \\overrightarrow{BC}$ فالرباعي ABCE متوازي أضلاع، وزاويته في B قائمة',
      '$\\overrightarrow{AE} = \\overrightarrow{BC}$ فالرباعي ABCE مستطيل مباشرة',
      '$\\overrightarrow{AE} = \\overrightarrow{CB}$ فالرباعي ABCE متوازي أضلاع، وزاويته في B قائمة',
    ], 0, '$\\overrightarrow{AE} = \\overrightarrow{BC}$ معناه $\\overrightarrow{AB} = \\overrightarrow{EC}$ : ABCE متوازي أضلاع (ترتيب الرؤوس)، وله زاوية قائمة في B (السؤال 2) فهو مستطيل. تساوي شعاعين وحده لا يعطي إلا متوازي أضلاع، و $\\overrightarrow{AE} = \\overrightarrow{CB}$ خاطئة (الشعاعان متعاكسان).'),
    commonError: 'الاكتفاء بتساوي شعاعين لاستنتاج مستطيل.',
  },
];

/** Les entrées d'un exercice (préfixe d'id), dans l'ordre. */
export const partsOf = (prefix) => EXERCISES.filter((ex) => ex.id.startsWith(`${prefix}-`));
