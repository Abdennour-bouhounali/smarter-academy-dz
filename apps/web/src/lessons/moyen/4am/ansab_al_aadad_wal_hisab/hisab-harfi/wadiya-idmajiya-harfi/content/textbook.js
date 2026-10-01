import { src, addition, BASE } from '../../_unit/unitMeta.js';

/**
 * « أستعدّ » (module 0) — les items 1 et 2 du « أستعدّ » du manuel (p. 31,
 * extraction › destinations › prep › items 1-2 : la valeur d'une expression
 * pour un x donné), puis des AFFIRMATIONS DE LA PLATEFORME (SourceTag
 * « عبارة إضافية من المنصّة ») dans la forme du manuel sur ce que la situation
 * mobilise : un développement (درس 1), une identité (درس 2), une factorisation
 * (درس 3), une aire, Pythagore. Jamais les nombres du bassin (10, 44, 11).
 */
export const PREP_ITEMS = [
  { n: 1, skill: 'qima', text: 'من أجل $x = 0$ العبارة $3x - 3$ تساوي 0.', answer: false, why: '$3 \\times 0 - 3 = -3$', source: src('prep', 31, 'أستعدّ', 1) },
  { n: 2, skill: 'qima', text: 'من أجل $x = \\sqrt{3}$ العبارة $x^2 - 3$ تساوي 0.', answer: true, why: '$(\\sqrt{3})^2 - 3 = 3 - 3 = 0$', source: src('prep', 31, 'أستعدّ', 2) },
  { n: 3, skill: 'nashr', text: 'نشر الجداء $(x + 3)(x + 2)$ هو $x^2 + 5x + 6$.', answer: true, why: '$(x + 3)(x + 2) = x^2 + 2x + 3x + 6 = x^2 + 5x + 6$', source: addition('prerequisite_diagnostic') },
  { n: 4, skill: 'mutatabiqa', text: '$(x + 4)^2 = x^2 + 16$', answer: false, why: 'ينقص الحد المضاعف: $(x + 4)^2 = x^2 + 2 \\times x \\times 4 + 4^2 = x^2 + 8x + 16$', source: addition('prerequisite_diagnostic') },
  { n: 5, skill: 'tahlil', text: 'تحليل العبارة $x^2 - 9$ هو $(x - 3)(x + 3)$.', answer: true, why: '$x^2 - 9 = x^2 - 3^2 = (x - 3)(x + 3)$ : فرق مربعين.', source: addition('prerequisite_diagnostic') },
  { n: 6, skill: 'masaha', text: 'مساحة مثلث قائم طولا ضلعيه القائمين 6cm و 8cm هي $48\\,cm^2$.', answer: false, why: 'مساحة المثلث القائم نصف جداء ضلعيه القائمين: $\\dfrac{6 \\times 8}{2} = 24$، أي $24\\,cm^2$.', source: addition('prerequisite_diagnostic') },
  { n: 7, skill: 'fithaghuras', text: 'المثلث الذي أطوال أضلاعه 6cm و 8cm و 10cm قائم.', answer: true, why: '$6^2 + 8^2 = 36 + 64 = 100 = 10^2$ : حسب الخاصية العكسية لفيثاغورس المثلث قائم.', source: addition('prerequisite_diagnostic') },
];

/**
 * « أدمج تعلّماتي » (p. 40) — la وضعية, au mot près, et son « تحليل الوضعية »
 * en trois étapes (le manuel les nomme). L'« مساعدة » du manuel est la seule
 * factorisation donnée : la plateforme n'enseigne rien de plus (le produit est
 * nul quand un facteur est nul — on vérifie par substitution).
 */
export const SITUATION = {
  source: src('situation', 40, 'أدمج تعلّماتي'),
  title: 'وضعية',
  text: 'الشكل الملوّن بالأزرق هو حوض شكله مربع، طول ضلعه 10m. نريد تهيئة شريط منتظم حول هذا الحوض يخصص للراجلين عرضه $x$. ماهي قيمة $x$ حتى تكون مساحة الشريط تساوي $44m^2$؟',
  help: 'مساعدة : $x^2 + 10x - 11 = (x - 1)(x + 11)$',
  figure: 'حوض مربع ضلعه 10m (أزرق)، يحيط به من كل الجهات شريط عرضه $x$.',
  caption: 'الحوض والشريط',
  analysis: [
    { label: 'قراءة الوضعية وفهمها', text: 'المطلوب البحث عن العرض $x$ للشريط الذي من أجله تكون مساحة هذا الشريط $44m^2$.' },
    { label: 'تحليل الوضعية واختيار استراتيجية حل مناسبة', text: 'التعبير عن مساحة الشريط بدلالة $x$ (هناك طرق متعددة)؛ توظيف المعلومة « مساحة هذا الشريط $44m^2$ »' },
    { label: 'تنفيذ استراتيجية الحل', text: 'كتابة المساواة المناسبة ، حل معادلة ، ...' },
  ],
};

/** « تحدّ » de la page d'unité (p. 31) — l'accroche de la synthèse, résolue à la fin du module 1 (extraction › challenge › duplicatedIn). */
export const CHALLENGE = {
  source: src('challenge', 31, 'تحدّ'),
  text: 'لاحظ الشكل المقابل حيث ABC مثلث. ما هي قيمة العدد $x$ التي من أجلها يكون المثلث ABC قائما في A ؟',
  figure: 'مثلث ABC حيث $AB = x + 1$ ، $AC = x + 2$ ، $BC = x + 3$.',
};

/**
 * Les corrections du module 1 — importées aussi par la carte (knowledgeGraph.js) :
 * une aide de la carte cite la leçon mot pour mot. Toute égalité dans `$…$`.
 */
export const REMARKS = {
  dilWrong: 'ضلع المربع الخارجي هو $10 + x$ : نضيف عرض الشريط مرّة واحدة.',
  dilWhy: 'الشريط يحيط بالحوض من كل الجهات: على الضلع الواحد يوجد شريط من اليسار وشريط من اليمين.',
  dilRight: 'ضلع المربع الخارجي هو $x + 10 + x = 10 + 2x$.',
  murabbaWrong: 'نكتب $(10 + 2x)^2 = 100 + 4x^2$ ، فتصبح مساحة الشريط $4x^2$ فقط.',
  murabbaWhy: 'مربع مجموع ليس مجموع المربعين: ينقص الحد المضاعف، وهو في الشكل المستطيلات الأربعة التي بعداها 10 و $x$.',
  murabbaRight: 'مربع مجموع: $(10 + 2x)^2 = 100 + 40x + 4x^2$.',
  twoWays: 'طريقتان من «الطرق المتعددة»: مساحة المربع الخارجي ناقص مساحة الحوض، أو أربعة مستطيلات بعداها 10 و $x$ وأربعة أركان مربعة ضلعها $x$.',
  equation: 'نكتب المساواة «مساحة الشريط = 44»، ثم نقسم طرفيها على 4 لنصل إلى العبارة التي يعطيها الكتاب في المساعدة.',
  help: 'إذا كان أحد عاملي جداء معدومًا فإنّ الجداء معدوم: هذا ما يجعل الشكل المحلّل مفيدًا لحل المعادلة.',
  check: 'نتحقق من كل قيمة بالتعويض في مساحة الشريط، ونرفض القيمة السالبة لأنّ العرض طول.',
  notSolvedHere: 'الحل الكامل في «أحلّ الوضعية»: هنا نمذجنا الوضعية واخترنا الاستراتيجية.',
};

/**
 * « أؤكّد تعلّماتي » (p. 40) : les treize QCM, au mot près ; chaque item renvoie
 * au درس qui l'enseigne (le manuel renvoie à la page : colonne « عند الحاجة
 * أعود إلى الصفحة »). L'item 5 a DEUX bonnes réponses dans le manuel.
 */
export const QCM = [
  { n: 1, text: 'نشر الجداء $2x(x + 2)$ هو ........', options: ['$2x^2 + 2x$', '$2x^2 + 4x$', '$2x + 4x$'], correct: 1, pages: [34], lesson: 'nashr-tabsit',
    explain: '$2x(x + 2) = 2x \\times x + 2x \\times 2 = 2x^2 + 4x$. العدد 2 يُضرب أيضًا في $2x$، و $2x \\times x = 2x^2$.' },
  { n: 2, text: 'نشر الجداء $(1 - x)(-x)$ هو ........', options: ['$x^2 - x$', '$x + x^2$', '$1 - x^2$'], correct: 0, pages: [34], lesson: 'nashr-tabsit',
    explain: '$(1 - x)(-x) = 1 \\times (-x) + (-x) \\times (-x) = -x + x^2 = x^2 - x$.' },
  { n: 3, text: 'نشر الجداء $(4 + x)(1 - x)$ هو ........', options: ['$4 - x^2$', '$4 - 3x - x^2$', '$5 - x^2$'], correct: 1, pages: [34], lesson: 'nashr-tabsit',
    explain: '$(4 + x)(1 - x) = 4 - 4x + x - x^2 = 4 - 3x - x^2$ : أربعة جداءات، ثم نجمع الحدّين $-4x$ و $x$.' },
  { n: 4, text: 'تحليل العبارة $ab + b$ هو ........', options: ['$ab^2$', '$(a + 1)b$', '$2ab$'], correct: 1, pages: [34], lesson: 'tahlil-ibara',
    explain: 'العامل المشترك $b$ ، و $b = b \\times 1$ : $ab + b = (a + 1)b$.' },
  // Item 5 : DEUX options justes dans le manuel (1 et 3) — posé en lignes « يساويه / لا يساويه ».
  { n: 5, text: 'تحليل العبارة $\\sqrt{2}x + 2$ هو ........', options: ['$\\sqrt{2}(x + \\sqrt{2})$', '$2\\sqrt{2}x$', '$2\\left(\\dfrac{\\sqrt{2}}{2}x + 1\\right)$'], correctSet: [0, 2], pages: [34, 35], lesson: 'tahlil-ibara',
    rowCorrections: [
      '$\\sqrt{2}(x + \\sqrt{2}) = \\sqrt{2}x + \\sqrt{2} \\times \\sqrt{2} = \\sqrt{2}x + 2$.',
      '$\\sqrt{2}x$ و 2 حدّان غير متشابهين: لا يُجمعان في حدّ واحد.',
      '$2\\left(\\dfrac{\\sqrt{2}}{2}x + 1\\right) = \\sqrt{2}x + 2$ : العامل المشترك هنا 2.',
    ] },
  { n: 6, text: 'تحليل العبارة $a - ab$ هو ........', options: ['$a(1 - b)$', '$b(a - 1)$', '$-a^2b$'], correct: 0, pages: [34, 35], lesson: 'tahlil-ibara',
    explain: '$a - ab = a \\times 1 - a \\times b = a(1 - b)$.' },
  { n: 7, text: 'نشر العبارة $(\\sqrt{3} + x)^2$ هو ........', options: ['$3 + x^2$', '$\\sqrt{3} + x^2$', '$3 + 2\\sqrt{3}x + x^2$'], correct: 2, pages: [34, 35], lesson: 'mutatabiqat-shahira',
    explain: 'مربع مجموع: $(\\sqrt{3})^2 + 2 \\times \\sqrt{3} \\times x + x^2 = 3 + 2\\sqrt{3}x + x^2$.' },
  { n: 8, text: 'نشر العبارة $(1 - \\sqrt{2}x)^2$ هو ........', options: ['$1 - 2x^2$', '$1 - 2\\sqrt{2}x + 2x^2$', '$-2x^2$'], correct: 1, pages: [34, 35], lesson: 'mutatabiqat-shahira',
    explain: 'مربع فرق: $1^2 - 2 \\times 1 \\times \\sqrt{2}x + (\\sqrt{2}x)^2 = 1 - 2\\sqrt{2}x + 2x^2$.' },
  { n: 9, text: 'العبارة $x^2 + 25$ تحلل على الشكل', options: ['$(x + 5)^2$', '$x^2 + 5^2$', 'لا تقبل تحليلا'], correct: 2, pages: [34, 35], lesson: 'tahlil-ibara',
    explain: '$(x + 5)^2 = x^2 + 10x + 25$ ، و $x^2 + 5^2$ مجموع لا جداء: مجموع مربعين لا يقبل تحليلا بالمتطابقات الشهيرة.' },
  { n: 10, text: 'العبارة $x^2 + 10x + 25$ تحلل على الشكل', options: ['$(x + 5)^2$', '$x^2 + 5^2$', 'لا تقبل تحليلا'], correct: 0, pages: [34, 36], lesson: 'tahlil-ibara',
    explain: '$x^2 + 2 \\times x \\times 5 + 5^2 = (x + 5)^2$.' },
  { n: 11, text: 'العبارة $x^2 - 25$ تحلل على الشكل', options: ['$(x - 5)^2$', '$(x - 5)(x + 5)$', 'لا تقبل تحليلا'], correct: 1, pages: [34, 36], lesson: 'tahlil-ibara',
    explain: 'فرق مربعين: $x^2 - 5^2 = (x - 5)(x + 5)$. أما $(x - 5)^2 = x^2 - 10x + 25$.' },
  { n: 12, text: 'العبارة $x^2 - 10x + 25$ تحلل على الشكل', options: ['$(x - 5)(x + 5)$', '$(x - 5)^2$', 'لا تقبل تحليلا'], correct: 1, pages: [34, 36], lesson: 'tahlil-ibara',
    explain: '$x^2 - 2 \\times x \\times 5 + 5^2 = (x - 5)^2$.' },
  { n: 13, text: 'الجداء $19 \\times 21$ يساوي', options: ['399', '401', '309'], correct: 0, pages: [34, 36], lesson: 'mutatabiqat-shahira',
    explain: '$19 \\times 21 = (20 - 1)(20 + 1) = 20^2 - 1^2 = 400 - 1 = 399$.' },
].map((it) => ({ ...it, source: src('qcm', 40, 'أؤكّد تعلّماتي', it.n), lessonPath: `${BASE}/${it.lesson}` }));

export const LESSON_TITLES = {
  'nashr-tabsit': 'الدرس 1 — نشر وتبسيط عبارة جبرية',
  'mutatabiqat-shahira': 'الدرس 2 — المتطابقات الشهيرة',
  'tahlil-ibara': 'الدرس 3 — تحليل عبارة جبرية',
};
