/**
 * Les exercices du MANUEL rattachés au درس 3 « حل مشكلات بتوظيف جمل معادلتين » (couverture :
 * extraction.json → destinations). Chaque énoncé est celui du livre, au mot près.
 *
 * Un exercice de modélisation se fait en ÉTAPES (les cinq du tableau p. 57) : il est posé en deux
 * entrées — la TRADUCTION (`batch`, une décision par ligne, chaque distracteur étant une jumla
 * FAUSSE — non équivalente — qui vient d'une erreur réelle : un prix compté comme un nombre
 * (MISC-JUMLA-TARJAMA), des parenthèses oubliées, deux unités dans une équation (MISC-JUMLA-WIHDA),
 * un rapport retourné) puis la RÉSOLUTION (`pair`, la ثنائية tapée, jugée par l'évaluateur `point`).
 * Toutes les solutions sont recalculées ci-dessous en commentaire.
 */
import { src, addition } from '../../_unit/unitMeta.js';

export const LP = {
  P1: '4am_mushkilat-jumla_P1',
  P2: '4am_mushkilat-jumla_P2',
};

const E = (n, page, section) => src(`ex-${n}`, page, section, n);
const CASES = (a, b) => `$\\begin{cases} ${a} \\\\ ${b} \\end{cases}$`;

/* ── Module 2 — la طريقة appliquée : le تحدّ (p. 55), أبو كامل (p. 55), une histoire de la plateforme ── */
export const EXERCISES_1 = [
  {
    // x + y = 37 ; 20x + 10y = 610 → 10x = 240 → (24 ; 13)
    id: 'challenge', source: src('challenge', 55, 'تحدّ'), learningPointId: LP.P1, difficulty: 'moyen',
    statement: 'لتزيين قسمهم بروح التعاون، جمع التلاميذ مبلغ 610DA مُشكّلا من 37 قطعة نقدية من فئتي 20DA و 10DA. ما هو عدد القطع النقدية التي جمعها التلاميذ من كل فئة؟',
    interaction: 'batch',
    question: {
      prompt: 'المرحلتان 1) و 2): نختار المجهولين ثم نترجم المشكلة.',
      rows: [
        { label: '1) المجهولان', options: ['$x$ عدد قطع 20DA و $y$ عدد قطع 10DA', '$x$ المبلغ و $y$ عدد القطع', '$x$ عدد القطع و $y$ قيمة القطعة الواحدة'], correct: 0, correction: 'المجهولان ما يسأل عنه السؤال: عدد القطع من كل فئة. المبلغ (610DA) وعدد القطع (37) معلومان.' },
        { label: '2) الجملة', options: [CASES('x + y = 37', '20x + 10y = 610'), CASES('x + y = 610', '20x + 10y = 37'), CASES('20x + 10y = 37', 'x + y = 610')], correct: 0, correction: '«37 قطعة» تعدّ القطع: $x + y = 37$ ؛ «610DA» مبلغ: كل قطعة من فئة 20DA تساوي 20 : $20x + 10y = 610$ .' },
      ],
    },
    method: 'نسمّي ما يسأل عنه السؤال، ثم نترجم كل معلومة (العدد، المبلغ) بمعادلة.',
    commonError: 'ترجمة «37 قطعة» بالمعادلة $20x + 10y = 37$ : مساواة مبلغ بعدد قطع.',
  },
  {
    id: 'challenge-2', source: src('challenge', 55, 'تحدّ'), learningPointId: LP.P2, difficulty: 'moyen',
    interaction: 'pair',
    question: {
      prompt: '3) حل الجملة $\\begin{cases} x + y = 37 \\\\ 20x + 10y = 610 \\end{cases}$ :',
      expected: { x: '24', y: '13' },
      explain: 'من الأولى $y = 37 - x$ ، نعوّض: $20x + 10(37 - x) = 610$ أي $10x = 240$ ومنه $x = 24$ ثم $y = 13$ .',
    },
  },
  {
    // 24 + 13 = 37 ; 20 × 24 + 10 × 13 = 480 + 130 = 610
    id: 'challenge-3', source: src('challenge', 55, 'تحدّ'), learningPointId: LP.P2, difficulty: 'moyen',
    interaction: 'batch',
    question: {
      prompt: 'المرحلتان 4) و 5): نتحقق في النص، ثم نجيب.',
      rows: [
        { label: '4) التحقق', options: ['$24 + 13 = 37$ و $20 \\times 24 + 10 \\times 13 = 610$', '$24 + 13 = 37$ فقط', '$20 \\times 13 + 10 \\times 24 = 610$'], correct: 0, correction: 'نتحقق من المعلومتين معا: 37 قطعة، و $480 + 130 = 610$ DA. (أما $20 \\times 13 + 10 \\times 24 = 500$ .)' },
        { label: '5) الإجابة', options: ['جمع التلاميذ 24 قطعة من فئة 20DA و 13 قطعة من فئة 10DA.', 'جمع التلاميذ 13 قطعة من فئة 20DA و 24 قطعة من فئة 10DA.', 'جمع التلاميذ 24 قطعة.'], correct: 0, correction: '$x$ عدد قطع 20DA و $y$ عدد قطع 10DA : الجملة تذكر العددين، كلّ بفئته.' },
      ],
    },
    commonError: 'التحقق في معلومة واحدة: $(13 ; 24)$ تحقق «37 قطعة» أيضا، لكنها تعطي 500DA لا 610DA.',
  },
  {
    // x + y = 30 ; 6x = 4y → 6x = 4(30 − x) → 10x = 120 → (12 ; 18)
    id: 'abu-kamil', source: src('history-abu-kamil', 55, 'أبو كامل'), learningPointId: LP.P1, difficulty: 'difficile',
    statement: '«إذا وظفت أجيرا و اشترطت عليه أنه إذا عمل شهرا كاملا يتقاضى 6 دراهم و إذا انقطع عن العمل شهرا كاملا يدفع 4 دراهم و في أحد الشهور عمل و انقطع و في النهاية لم يدفع و لم يتقاض أي درهم. كم يوما عمل في الشهر؟»',
    interaction: 'batch',
    question: {
      prompt: 'نسمّي $x$ عدد أيام العمل و $y$ عدد أيام الانقطاع في شهر من 30 يوما.',
      rows: [
        { label: 'الجملة', options: [CASES('x + y = 30', '6x = 4y'), CASES('x + y = 30', '4x = 6y'), CASES('x + y = 30', '6x + 4y = 0')], correct: 0, correction: 'لم يتقاض شيئا ولم يدفع شيئا: ما كسبه بأيام العمل يساوي ما دفعه بأيام الانقطاع، $6x = 4y$ (بأجزاء الشهر نفسها).' },
      ],
    },
    commonError: 'قلب الأجرين: $4x = 6y$ تجعل أيام العمل تُدفع 4 والانقطاع 6.',
  },
  {
    id: 'abu-kamil-2', source: src('history-abu-kamil', 55, 'أبو كامل'), learningPointId: LP.P2, difficulty: 'difficile',
    interaction: 'pair',
    question: {
      prompt: 'حل الجملة $\\begin{cases} x + y = 30 \\\\ 6x = 4y \\end{cases}$ :',
      expected: { x: '12', y: '18' },
      explain: '$y = 30 - x$ ، نعوّض: $6x = 4(30 - x)$ أي $10x = 120$ ومنه $x = 12$ ثم $y = 18$ . تحقق: $6 \\times 12 = 72 = 4 \\times 18$ . عمل الأجير 12 يوما.',
    },
  },
  {
    // x + y = 10 ; 300x + 150y = 2000 → 150x = 500 → x = 10/3 : pas un nombre de personnes
    id: 'not-natural', source: addition('interaction_generation'), learningPointId: LP.P2, difficulty: 'moyen',
    statement: 'دخل 10 أشخاص إلى قاعة ألعاب تحرص على نظافتها: تذكرة الكبير 300 DA وتذكرة الصغير 150 DA، وقيل إنهم دفعوا 2000 DA. نسمّي $x$ عدد الكبار و $y$ عدد الصغار: $x + y = 10$ و $300x + 150y = 2000$ ، وحل الجملة $\\left(\\dfrac{10}{3} ; \\dfrac{20}{3}\\right)$ .',
    interaction: 'choice',
    question: {
      prompt: 'ماذا نستنتج؟',
      options: [
        'دخل $\\dfrac{10}{3}$ كبير و $\\dfrac{20}{3}$ صغير.',
        'المعطيات لا تتّفق: عدد الأشخاص عدد طبيعي، فلا جواب لهذه المشكلة.',
        'دخل 3 كبار و 7 صغار.',
      ],
      correct: 1, cols: 1,
      explain: 'الثنائية تحقق الجملة، لكنها لا تجيب عن القصة: لا يدخل ثلث شخص. (و 3 كبار و 7 صغار يدفعون $900 + 1050 = 1950$ DA لا 2000 DA.)',
    },
    commonError: 'كتابة الجواب بعدد غير طبيعي من الأشخاص دون الرجوع إلى القصة.',
  },
];

/* ── Module 3 — أوظّف تعلّماتي (p. 61) et أتعمّق (p. 63) ──────────────────────────────────── */
export const EXERCISES = [
  {
    // a + b = 133 ; 7(a + 5) = 4(b + 5) ⇔ 7a − 4b = −15 → 11a = 517 → (47 ; 86) ; 52/91 = 4/7
    id: 'ex-14', source: E(14, 61, 'أوظّف تعلّماتي'), learningPointId: LP.P1, difficulty: 'moyen',
    statement: 'مجموع عددين $a$ و $b$ هو 133. إذا أضفنا إلى كل منهما 5، أصبحت نسبتهما $\\dfrac{4}{7}$ . ما هما العددان؟',
    interaction: 'batch',
    question: {
      prompt: 'نسبتهما: $\\dfrac{a + 5}{b + 5} = \\dfrac{4}{7}$ .',
      rows: [
        { label: 'الجملة', options: [CASES('a + b = 133', '7(a + 5) = 4(b + 5)'), CASES('a + b = 133', '4(a + 5) = 7(b + 5)'), CASES('a + b = 133', '7a + 5 = 4b + 5')], correct: 0, correction: 'الجداءان المتصالبان: $\\dfrac{a + 5}{b + 5} = \\dfrac{4}{7}$ تعني $7(a + 5) = 4(b + 5)$ ، والقوسان يبقيان.' },
      ],
    },
    method: 'نكتب النسبة كسرًا، ثم نستعمل تساوي الجداءين المتصالبين.',
    commonError: 'نسيان القوسين: $7a + 5$ بدل $7(a + 5)$ .',
  },
  {
    id: 'ex-14-2', source: E(14, 61, 'أوظّف تعلّماتي'), learningPointId: LP.P2, difficulty: 'moyen',
    interaction: 'pair',
    question: {
      prompt: 'العددان $(a ; b)$ :',
      expected: { x: '47', y: '86' }, names: ['a', 'b'],
      explain: '$7a - 4b = -15$ و $b = 133 - a$ : $7a - 4(133 - a) = -15$ أي $11a = 517$ ومنه $a = 47$ و $b = 86$ . تحقق: $\\dfrac{52}{91} = \\dfrac{4}{7}$ .',
    },
  },
  {
    // a + 2 = 3b ; a − 2 = 4b → (a + 2) − (a − 2) = 3b − 4b → b = −4, a = −14 ; a/b = 7/2
    id: 'ex-15', source: E(15, 61, 'أوظّف تعلّماتي'), learningPointId: LP.P1, difficulty: 'difficile',
    statement: 'نعتبر النسبة $\\dfrac{a}{b}$ حيث $b \\neq 0$ . إذا أضفنا 2 إلى البسط $a$ ، تكون النسبة تساوي 3. إذا أنقصنا 2 من البسط $a$ ، تكون النسبة تساوي 4. ما هي هذه النسبة؟',
    interaction: 'batch',
    question: {
      prompt: '$\\dfrac{a + 2}{b} = 3$ و $\\dfrac{a - 2}{b} = 4$ .',
      rows: [
        { label: 'الجملة', options: [CASES('a + 2 = 3b', 'a - 2 = 4b'), CASES('a + 2 = 3', 'a - 2 = 4'), CASES('a + 2b = 3', 'a - 2b = 4')], correct: 0, correction: 'نضرب طرفي كل مساواة في $b$ ($b \\neq 0$): $a + 2 = 3b$ و $a - 2 = 4b$ .' },
        { label: 'النسبة $\\dfrac{a}{b}$', options: ['$\\dfrac{7}{2}$', '$-\\dfrac{7}{2}$', '$\\dfrac{2}{7}$'], correct: 0, correction: 'بالطرح: $4 = -b$ أي $b = -4$ ، ثم $a = 3 \\times (-4) - 2 = -14$ : $\\dfrac{-14}{-4} = \\dfrac{7}{2}$ .' },
      ],
    },
    commonError: 'رفض الحل لأن $a$ و $b$ سالبان: النص لا يشترط عددين موجبين، والنسبة $\\dfrac{7}{2}$ .',
  },
  {
    id: 'ex-15-2', source: E(15, 61, 'أوظّف تعلّماتي'), learningPointId: LP.P2, difficulty: 'difficile',
    interaction: 'pair',
    question: {
      prompt: 'الثنائية $(a ; b)$ :',
      expected: { x: '-14', y: '-4' }, names: ['a', 'b'],
      explain: 'تحقق: $\\dfrac{-14 + 2}{-4} = 3$ و $\\dfrac{-14 - 2}{-4} = 4$ . العددان سالبان، والنسبة $\\dfrac{7}{2}$ .',
    },
  },
  {
    // x + y = 206 ; x = 4y + 1 → 5y = 205 → (165 ; 41), باقي 1 < 41
    id: 'ex-16', source: E(16, 61, 'أوظّف تعلّماتي'), learningPointId: LP.P1, difficulty: 'facile',
    statement: 'عددان مجموعهما يساوي 206. عند قسمة أكبرهما على أصغرهما، يكون حاصل القسمة 4 وباقي القسمة 1 . ما هما العددان؟',
    interaction: 'batch',
    question: {
      prompt: 'نسمّي $x$ الأكبر و $y$ الأصغر.',
      rows: [
        { label: 'الجملة', options: [CASES('x + y = 206', 'x = 4y + 1'), CASES('x + y = 206', 'y = 4x + 1'), CASES('x + y = 206', 'x = 4y')], correct: 0, correction: 'القسمة الإقليدية للأكبر على الأصغر: $x = 4y + 1$ (المقسوم = القاسم × حاصل القسمة + الباقي).' },
      ],
    },
    commonError: 'نسيان الباقي: $x = 4y$ .',
  },
  {
    id: 'ex-16-2', source: E(16, 61, 'أوظّف تعلّماتي'), learningPointId: LP.P2, difficulty: 'facile',
    interaction: 'pair',
    question: {
      prompt: 'العددان $(x ; y)$ :',
      expected: { x: '165', y: '41' },
      explain: 'نعوّض $x = 4y + 1$ : $5y + 1 = 206$ أي $y = 41$ و $x = 165$ . تحقق: $165 = 4 \\times 41 + 1$ و $1 < 41$ .',
    },
  },
  {
    // x − y = 24 ; x + 8 = 3(y + 8) → y + 32 = 3y + 24 → (28 ; 4)
    id: 'ex-17', source: E(17, 61, 'أوظّف تعلّماتي'), learningPointId: LP.P1, difficulty: 'moyen',
    statement: 'الفرق بين عددين هو 24. إذا أضفنا 8 إلى كل من العددين، نحصل على عددين آخرين أكبرهما هو ثلاث مرات أكثر من أصغرهما. ما هما العددان؟',
    interaction: 'batch',
    question: {
      prompt: 'نسمّي $x$ الأكبر و $y$ الأصغر.',
      rows: [
        { label: 'الجملة', options: [CASES('x - y = 24', 'x + 8 = 3(y + 8)'), CASES('x - y = 24', 'x + 8 = 3y + 8'), CASES('x - y = 24', '3(x + 8) = y + 8')], correct: 0, correction: 'بعد الإضافة: الأكبر $x + 8$ ثلاث مرات الأصغر $y + 8$ كله: $x + 8 = 3(y + 8)$ .' },
      ],
    },
    commonError: 'ضرب $y$ وحده في 3: $3y + 8$ بدل $3(y + 8)$ .',
  },
  {
    id: 'ex-17-2', source: E(17, 61, 'أوظّف تعلّماتي'), learningPointId: LP.P2, difficulty: 'moyen',
    interaction: 'pair',
    question: {
      prompt: 'العددان $(x ; y)$ :',
      expected: { x: '28', y: '4' },
      explain: '$x = y + 24$ : $y + 32 = 3y + 24$ أي $2y = 8$ ومنه $y = 4$ و $x = 28$ . تحقق: $36 = 3 \\times 12$ .',
    },
  },
  {
    // 2(x + y) = 220 ; (x − 2)(y + 2) = xy + 16 ⇔ 2x − 2y = 20 → x − y = 10 → (60 ; 50)
    id: 'ex-18', source: E(18, 61, 'أوظّف تعلّماتي'), learningPointId: LP.P1, difficulty: 'difficile',
    statement: 'حقل مستطيل الشكل محيطه يساوي 220m. عند إنقاص 2m من طوله وزيادة 2m إلى عرضه، تزداد مساحته بـ $16m^2$ . ما هما بعدا الحقل في البداية؟',
    interaction: 'batch',
    question: {
      prompt: 'نسمّي $x$ الطول و $y$ العرض (بالمتر).',
      rows: [
        { label: 'المحيط', options: ['$x + y = 220$', '$2(x + y) = 220$', '$xy = 220$'], correct: 1, correction: 'محيط المستطيل $2(x + y)$ ، أي $x + y = 110$ .' },
        { label: 'المساحة', options: ['$(x - 2)(y + 2) = 16$', '$(x + 2)(y - 2) = xy + 16$', '$(x - 2)(y + 2) = xy + 16$'], correct: 2, correction: 'المساحة الجديدة تزيد على القديمة $xy$ بـ 16.' },
        { label: 'تؤول معادلة المساحة إلى', options: ['$2x - 2y = 20$', '$2x - 2y = 16$', '$2x + 2y = 20$'], correct: 0, correction: '$xy + 2x - 2y - 4 = xy + 16$ : الحد $xy$ يختفي، و $2x - 2y = 20$ .' },
      ],
    },
    commonError: 'كتابة المحيط $x + y$ (نصف المحيط) بدل $2(x + y)$ .',
  },
  {
    id: 'ex-18-2', source: E(18, 61, 'أوظّف تعلّماتي'), learningPointId: LP.P2, difficulty: 'difficile',
    interaction: 'pair',
    question: {
      prompt: 'البعدان $(x ; y)$ بالمتر:',
      expected: { x: '60', y: '50' },
      explain: '$x + y = 110$ و $x - y = 10$ : بالجمع $2x = 120$ ، ومنه $x = 60$ و $y = 50$ . تحقق: $58 \\times 52 = 3016 = 3000 + 16$ .',
    },
  },
  {
    // Ĉ = B̂ = y ; ACD = Â = x et (d) bissectrice : Ĉ = 2x ; x + 2y = 180 et y = 2x → 5x = 180 → (36 ; 72)
    id: 'ex-19', source: E(19, 61, 'أوظّف تعلّماتي'), learningPointId: LP.P1, difficulty: 'difficile',
    statement: 'في الشكل الآتي، المثلث ABC متقايس الساقين. (d) منصّف الزاوية $\\widehat{C}$ يقطع [AB] في D و AD = DC. عيّن $x$ و $y$ قيسي الزاويتين $\\widehat{A}$ و $\\widehat{B}$ .',
    interaction: 'batch',
    question: {
      prompt: 'المثلث ABC رأسه A ، و $\\widehat{A} = x$ و $\\widehat{B} = y$ (بالدرجات).',
      rows: [
        { label: 'ABC متقايس الساقين رأسه A', options: ['$\\widehat{C} = x$', '$\\widehat{C} = y$', '$\\widehat{C} = 2y$'], correct: 1, correction: 'زاويتا القاعدة متقايستان: $\\widehat{C} = \\widehat{B} = y$ .' },
        { label: 'AD = DC و (d) منصّف $\\widehat{C}$', options: ['$\\widehat{C} = 2x$', '$\\widehat{C} = x$', '$\\widehat{C} = \\dfrac{x}{2}$'], correct: 0, correction: 'ADC متقايس الساقين: $\\widehat{ACD} = \\widehat{A} = x$ ، و (d) منصّف فـ $\\widehat{C} = 2x$ .' },
        { label: 'الجملة', options: [CASES('x + y = 180', 'y = 2x'), CASES('x + 2y = 180', 'y = 2x'), CASES('2x + y = 180', 'y = 2x')], correct: 1, correction: 'مجموع زوايا المثلث: $x + y + y = 180$ ، و $\\widehat{C} = y = 2x$ .' },
      ],
    },
    commonError: 'نسيان أنّ $\\widehat{C} = y$ في مجموع الزوايا: $x + y = 180$ .',
  },
  {
    id: 'ex-19-2', source: E(19, 61, 'أوظّف تعلّماتي'), learningPointId: LP.P2, difficulty: 'difficile',
    interaction: 'pair',
    question: {
      prompt: 'القيسان $(x ; y)$ بالدرجات:',
      expected: { x: '36', y: '72' },
      explain: 'نعوّض $y = 2x$ : $x + 4x = 180$ أي $x = 36$ و $y = 72$ . تحقق: $36 + 72 + 72 = 180$ .',
    },
  },
  {
    // x + y = 36 ; 4x + 2y = 90 → 2x = 18 → (9 ; 27)
    id: 'ex-20', source: E(20, 61, 'أوظّف تعلّماتي'), learningPointId: LP.P1, difficulty: 'facile',
    statement: 'يريد فلّاح يعتني بحيواناته كل صباح أن يعرف عدد الأرانب وعدد الدجاج في مزرعته. عندما عدّ الرؤوس، وجد 36 رأسا. عندما عدّ السيقان، وجد 90 ساقا. ما هو عدد الأرانب وعدد الدجاج في المزرعة؟',
    interaction: 'batch',
    question: {
      prompt: 'نسمّي $x$ عدد الأرانب و $y$ عدد الدجاج.',
      rows: [
        { label: '«36 رأسا»', options: ['$4x + 2y = 36$', '$x + y = 36$', '$2x + 4y = 36$'], correct: 1, correction: 'لكل حيوان رأس واحد: $x + y = 36$ .' },
        { label: '«90 ساقا»', options: ['$4x + 2y = 90$', '$2x + 4y = 90$', '$x + y = 90$'], correct: 0, correction: 'للأرنب 4 سيقان وللدجاجة ساقان: $4x + 2y = 90$ .' },
      ],
    },
    commonError: 'قلب المعاملين: $2x + 4y$ يعطي الأرانب ساقين.',
  },
  {
    id: 'ex-20-2', source: E(20, 61, 'أوظّف تعلّماتي'), learningPointId: LP.P2, difficulty: 'facile',
    interaction: 'pair',
    question: {
      prompt: '(عدد الأرانب ; عدد الدجاج) :',
      expected: { x: '9', y: '27' },
      explain: 'نطرح ضعف الأولى من الثانية: $2x = 18$ أي $x = 9$ و $y = 27$ . تحقق: $36 + 54 = 90$ ساقا.',
    },
  },
  {
    // COQUILLE DU MANUEL corrigée (propriétaire, 2026-10-07) : avec EA = 10, AB = 4, DC = 5 et un périmètre de 13,8
    // le triangle EBC est impossible (EB = 14, BC = 2,8, EC = 17,5 et 14 + 2,8 < 17,5). Données cohérentes, les
    // mêmes que la feuille de pratique l4-003 : EA = 6, AB = 4, DC = 5, périmètre 25.
    // 4 + 5 + x + y = 25 → x + y = 16 ; AD/BC = EA/EB = 6/10 → 10y = 6x → (10 ; 6) ; triangles (10 ; 10 ; 12,5) et (6 ; 6 ; 7,5)
    id: 'ex-21', source: E(21, 61, 'أوظّف تعلّماتي'), learningPointId: LP.P1, difficulty: 'difficile',
    statement: 'وحدة الطول هي السنتيمتر، والأطوال على الشكل ليست حقيقية. علما أنّ ABCD شبه منحرف محيطه يساوي 25cm احسب كلا من $x$ و $y$ .',
    interaction: 'batch',
    question: {
      prompt: 'في المثلث EBC: A من [EB] و D من [EC] و (AD) يوازي (BC) ؛ EA = 6 ، AB = 4 ، DC = 5 ، AD = $y$ ، BC = $x$ .',
      rows: [
        { label: 'المحيط', options: ['$x + y = 25$', '$x + y + 9 = 25$', '$2(x + y) = 25$'], correct: 1, correction: 'محيط ABCD هو $AB + BC + CD + DA = 4 + x + 5 + y$ .' },
        { label: 'خاصية طالس', options: ['$\\dfrac{y}{x} = \\dfrac{6}{4}$', '$\\dfrac{x}{y} = \\dfrac{6}{10}$', '$\\dfrac{y}{x} = \\dfrac{6}{10}$'], correct: 2, correction: '$\\dfrac{AD}{BC} = \\dfrac{EA}{EB}$ و $EB = 6 + 4 = 10$ : $\\dfrac{y}{x} = \\dfrac{6}{10}$ أي $10y = 6x$ .' },
      ],
    },
    commonError: 'أخذ $\\dfrac{EA}{AB} = \\dfrac{6}{4}$ بدل $\\dfrac{EA}{EB} = \\dfrac{6}{10}$ .',
  },
  {
    id: 'ex-21-2', source: E(21, 61, 'أوظّف تعلّماتي'), learningPointId: LP.P2, difficulty: 'difficile',
    interaction: 'pair',
    question: {
      prompt: 'الطولان $(x ; y)$ بالسنتيمتر:',
      expected: { x: '10', y: '6' },
      explain: '$y = \\dfrac{3}{5}x$ : $x + \\dfrac{3}{5}x = 16$ أي $\\dfrac{8}{5}x = 16$ ومنه $x = 10$ و $y = 6$ . تحقق: $4 + 10 + 5 + 6 = 25$ .',
    },
  },
  {
    // x + y = 2019 ; x − y = 25 → 2x = 2044 → (1022 ; 997)
    id: 'ex-24', source: E(24, 63, 'أتعمّق'), learningPointId: LP.P1, difficulty: 'facile',
    statement: 'عددان طبيعيان مجموعهما 2019 والفرق بينهما 25. عيّن هذين العددين.',
    interaction: 'batch',
    question: {
      prompt: 'نسمّي $x$ الأكبر و $y$ الأصغر.',
      rows: [
        { label: 'الجملة', options: [CASES('x + y = 25', 'x - y = 2019'), CASES('x + y = 2019', 'x - y = 25'), CASES('x + y = 2019', 'y - x = 25')], correct: 1, correction: 'المجموع 2019 والفرق (الأكبر ناقص الأصغر) 25.' },
      ],
    },
    commonError: 'كتابة الفرق $y - x$ والأصغر أولا: يعطي عددا سالبا.',
  },
  {
    id: 'ex-24-2', source: E(24, 63, 'أتعمّق'), learningPointId: LP.P2, difficulty: 'facile',
    interaction: 'pair',
    question: {
      prompt: 'العددان $(x ; y)$ :',
      expected: { x: '1022', y: '997' },
      explain: 'بالجمع طرفا لطرف: $2x = 2044$ أي $x = 1022$ ، ثم $y = 997$ . عددان طبيعيان: $1022 + 997 = 2019$ و $1022 - 997 = 25$ .',
    },
  },
  {
    // x + y = 30 ; (x + 5)(y − 2) = xy ⇔ −2x + 5y = 10 → 7y = 70 → (20 ; 10)
    id: 'ex-25', source: E(25, 63, 'أتعمّق'), learningPointId: LP.P1, difficulty: 'difficile',
    statement: 'مستطيل محيطه 60cm. إذا زدنا طوله بـ 5cm وأنقصنا عرضه بـ 2cm، بقيت مساحته نفسها. عيّن بُعدَي هذا المستطيل.',
    interaction: 'batch',
    question: {
      prompt: 'نسمّي $x$ الطول و $y$ العرض (بالسنتيمتر).',
      rows: [
        { label: 'المحيط', options: ['$x + y = 60$', '$x + y = 30$', '$xy = 60$'], correct: 1, correction: '$2(x + y) = 60$ أي $x + y = 30$ .' },
        { label: 'المساحة', options: ['$(x + 5)(y - 2) = xy$', '$(x - 5)(y + 2) = xy$', '$(x + 5)(y - 2) = 0$'], correct: 0, correction: 'المساحة الجديدة تساوي المساحة القديمة $xy$ .' },
        { label: 'تؤول إلى', options: ['$5x - 2y = 10$', '$-2x + 5y = 0$', '$-2x + 5y = 10$'], correct: 2, correction: '$xy - 2x + 5y - 10 = xy$ أي $-2x + 5y = 10$ .' },
      ],
    },
    commonError: 'معادلة المساحة $(x + 5)(y - 2) = 0$ : «بقيت مساحته نفسها» لا تعني أنها معدومة.',
  },
  {
    id: 'ex-25-2', source: E(25, 63, 'أتعمّق'), learningPointId: LP.P2, difficulty: 'difficile',
    interaction: 'pair',
    question: {
      prompt: 'البعدان $(x ; y)$ بالسنتيمتر:',
      expected: { x: '20', y: '10' },
      explain: '$x = 30 - y$ : $-60 + 2y + 5y = 10$ أي $y = 10$ و $x = 20$ . تحقق: $25 \\times 8 = 200 = 20 \\times 10$ .',
    },
  },
  {
    // x + y = 34 ; x + 4 = 2(y + 4) → 3y + 4 = 34 → (24 ; 10)
    id: 'ex-26', source: E(26, 63, 'أتعمّق'), learningPointId: LP.P1, difficulty: 'moyen',
    statement: 'أمين وحمزة صديقان يتعاونان في مراجعة دروسهما. اليوم، مجموع عمرَيْ أمين وحمزة هو 34 سنة. بعد 4 سنوات، يصير عمر أمين ضعف عمر حمزة. عيّن عمر أمين وعمر حمزة.',
    interaction: 'batch',
    question: {
      prompt: 'نسمّي $x$ عمر أمين و $y$ عمر حمزة اليوم.',
      rows: [
        { label: '«بعد 4 سنوات»', options: ['$x + 4 = 2y + 4$', '$x + 4 = 2(y + 4)$', '$2(x + 4) = y + 4$'], correct: 1, correction: 'بعد 4 سنوات يكبر كل واحد بـ 4، وعمر أمين ضعف عمر حمزة كله: $x + 4 = 2(y + 4)$ .' },
      ],
    },
    commonError: 'مضاعفة $y$ وحده: $2y + 4$ بدل $2(y + 4)$ .',
  },
  {
    id: 'ex-26-2', source: E(26, 63, 'أتعمّق'), learningPointId: LP.P2, difficulty: 'moyen',
    interaction: 'pair',
    question: {
      prompt: '(عمر أمين ; عمر حمزة) :',
      expected: { x: '24', y: '10' },
      explain: '$x = 2y + 4$ : $3y + 4 = 34$ أي $y = 10$ و $x = 24$ . تحقق: بعد 4 سنوات $28 = 2 \\times 14$ .',
    },
  },
  {
    // 1kg 50g = 1050 g ; 5x + 3y = 1050 ; y = 2x/3 → 7x = 1050 → (150 ; 100)
    id: 'ex-27', source: E(27, 63, 'أتعمّق'), learningPointId: LP.P1, difficulty: 'moyen',
    statement: 'تبرّعت أسرة بفاكهة لجيرانها المحتاجين: تزن 5 تفاحات و 3 إجاصات معا 1kg 50g. إذا علمت أنّ وزن إجّاصة هو $\\dfrac{2}{3}$ وزن تفاحة. عيّن وزن كلّ ثمرة. (الثمرات متماثلة).',
    interaction: 'batch',
    question: {
      prompt: 'نسمّي $x$ وزن تفاحة و $y$ وزن إجاصة (بالغرام).',
      rows: [
        { label: '«1kg 50g»', options: ['$5x + 3y = 1{,}50$', '$5x + 3y = 150$', '$5x + 3y = 1050$'], correct: 2, correction: 'وحدة واحدة في المعادلة: 1kg 50g = 1050g .' },
        { label: '«$\\dfrac{2}{3}$ وزن تفاحة»', options: ['$y = \\dfrac{2}{3}x$', '$x = \\dfrac{2}{3}y$', '$y = x - \\dfrac{2}{3}$'], correct: 0, correction: 'وزن الإجاصة $y$ هو $\\dfrac{2}{3}$ وزن التفاحة $x$ .' },
      ],
    },
    commonError: 'خلط الوحدتين: كتابة 1kg 50g على شكل 1,50 أو 150.',
  },
  {
    id: 'ex-27-2', source: E(27, 63, 'أتعمّق'), learningPointId: LP.P2, difficulty: 'moyen',
    interaction: 'pair',
    question: {
      prompt: 'الوزنان $(x ; y)$ بالغرام:',
      expected: { x: '150', y: '100' },
      explain: '$5x + 3 \\times \\dfrac{2}{3}x = 1050$ أي $7x = 1050$ ومنه $x = 150$ و $y = 100$ . تحقق: $750 + 300 = 1050$ .',
    },
  },
  {
    // (2x + y)/3 = 11 ; (x + 2y)/3 = 13 → 2x + y = 33 ; x + 2y = 39 → (9 ; 15)
    id: 'ex-28', source: E(28, 63, 'أتعمّق'), learningPointId: LP.P1, difficulty: 'moyen',
    statement: 'تنقّط أعمال التلاميذ على 20. تحصّل تلميذ مجتهد على علامة في فرض محروس بمعامل 2 وعلامة ثانية في واجب منزلي بمعامل 1 وكان معدله 11. بتبادل المعاملين، كان معدل التلميذ 13. ما هي العلامة التي تحصل عليها التلميذ في الفرض وفي الواجب المنزلي؟',
    interaction: 'batch',
    question: {
      prompt: 'نسمّي $x$ علامة الفرض و $y$ علامة الواجب.',
      rows: [
        { label: 'الجملة', options: [CASES('2x + y = 11', 'x + 2y = 13'), CASES('\\dfrac{2x + y}{3} = 11', '\\dfrac{x + 2y}{3} = 13'), CASES('\\dfrac{2x + y}{2} = 11', '\\dfrac{x + 2y}{2} = 13')], correct: 1, correction: 'المعدل = مجموع (العلامة × المعامل) ÷ مجموع المعاملات $2 + 1 = 3$ .' },
      ],
    },
    commonError: 'نسيان القسمة على مجموع المعاملات: $2x + y = 11$ .',
  },
  {
    id: 'ex-28-2', source: E(28, 63, 'أتعمّق'), learningPointId: LP.P2, difficulty: 'moyen',
    interaction: 'pair',
    question: {
      prompt: '(علامة الفرض ; علامة الواجب) :',
      expected: { x: '9', y: '15' },
      explain: '$2x + y = 33$ و $x + 2y = 39$ : بالجمع $3x + 3y = 72$ أي $x + y = 24$ ، وبالطرح $x - y = -6$ ، ومنه $x = 9$ و $y = 15$ .',
    },
  },
];

/** Les entrées d'un exercice du manuel (module 3), par numéro : « 14 », « 21 »… */
export const partsOf = (n) => EXERCISES.filter((ex) => ex.id === `ex-${n}` || ex.id.startsWith(`ex-${n}-`));

/** Accès par id. */
export const EX = Object.fromEntries([...EXERCISES_1, ...EXERCISES].map((ex) => [ex.id, ex]));
