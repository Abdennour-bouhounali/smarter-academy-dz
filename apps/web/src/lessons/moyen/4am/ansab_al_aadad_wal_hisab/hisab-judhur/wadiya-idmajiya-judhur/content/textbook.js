import { src, addition, BASE } from '../../_unit/unitMeta.js';

/**
 * « أستعدّ » (module 0) — aucun item du « أستعدّ » du manuel (p. 19) n'est
 * attribué à la synthèse : ces affirmations sont des AJOUTS DE LA PLATEFORME
 * (SourceTag « عبارة إضافية من المنصّة »), dans la forme du manuel, deux par
 * acquis de `priorKnowledge` (√a — leçon 1, x² = a — leçon 3, a√b — leçon 5),
 * jamais les nombres de la situation (24, 12, 2√3…).
 */
export const PREP_ITEMS = [
  { n: 1, skill: 'jidhr', text: '$\\sqrt{0{,}09} = 0{,}3$ لأنّ 0,3 عدد موجب و $0{,}3^2 = 0{,}09$.', answer: true, why: 'الجذر التربيعي للعدد 0,09 هو العدد الموجب الذي مربعه 0,09، وهو 0,3.' },
  { n: 2, skill: 'jidhr', text: 'الجذر التربيعي للعدد 49 هو $-7$، لأنّ $(-7)^2 = 49$.', answer: false, why: 'الجذر التربيعي عدد موجب: $\\sqrt{49} = 7$. العدد $-7$ مربعه 49 لكنه سالب.' },
  { n: 3, skill: 'muadala', text: 'المعادلة $x^2 = 81$ تقبل حلين هما 9 و $-9$.', answer: true, why: '$81 > 0$، و $9^2 = (-9)^2 = 81$.' },
  { n: 4, skill: 'muadala', text: 'المعادلة $x^2 = -4$ تقبل حلين هما 2 و $-2$.', answer: false, why: '$2^2 = (-2)^2 = 4$ وليس $-4$: مربع أي عدد موجب، فالمعادلة لا تقبل أي حل.' },
  { n: 5, skill: 'kitaba', text: '$\\sqrt{50} = 5\\sqrt{2}$، لأنّ $50 = 25 \\times 2$ و 25 مربع تام.', answer: true, why: '$\\sqrt{50} = \\sqrt{25 \\times 2} = \\sqrt{25} \\times \\sqrt{2} = 5\\sqrt{2}$.' },
  { n: 6, skill: 'kitaba', text: 'الكتابة $2\\sqrt{18}$ هي أبسط كتابة للعدد $\\sqrt{72}$.', answer: false, why: '18 يقبل التبسيط ($18 = 9 \\times 2$): أكبر مربع يقسم 72 هو 36، فـ $\\sqrt{72} = \\sqrt{36 \\times 2} = 6\\sqrt{2}$.' },
].map((it) => ({ ...it, source: addition('prerequisite_diagnostic') }));

/**
 * « أدمج تعلّماتي » (p. 28) — la وضعية, au mot près. L'analyse du manuel en
 * trois étapes ; la DEUXIÈME est affichée dans sa version corrigée
 * (`correction.analysis1` de l'extraction, décision du propriétaire du
 * 2026-09-30) : le manuel imprime « استبعاد المعطيات المُشوّشة 24m² », or
 * l'aire est nécessaire au calcul — la donnée parasite est le prix.
 */
export const SITUATION = {
  source: src('situation', 28, 'أدمج تعلّماتي'),
  title: 'وضعية',
  text: 'أرادت أم شراء زربية مستطيلة الشكل لوضعها على أرضية غرفة الاستقبال. عندما طلبت من البائع سعر الزربية وبعديها أجاب التاجر بالعبارات التالية: سعر الزربية هو 12000DA ومساحتها $24m^2$ وطولها ضعف عرضها. ساعد هذه الأم على معرفة طول هذه الزربية وعرضها. (تدوّر النتائج إلى cm)',
  caption: 'زربية وادي سوف',
  data: [
    { id: 'shakl', text: 'الزربية مستطيلة الشكل', useful: true },
    { id: 'masaha', text: 'مساحة الزربية 24 مترًا مربّعًا', useful: true },
    { id: 'diaf', text: 'طول الزربية ضعف عرضها', useful: true },
    { id: 'sir', text: 'سعر الزربية هو 12000DA', useful: false },
    { id: 'ghurfa', text: 'الزربية توضع على أرضية غرفة الاستقبال', useful: false },
    { id: 'bai', text: 'التاجر هو الذي أجاب الأم', useful: false },
  ],
  analysis: [
    { label: 'قراءة الوضعية وفهمها', text: 'المطلوب البحث عن بُعدي الزربية علما أنّ: الزربية مستطيلة الشكل، طولها ضعف عرضها، مساحتها $24m^2$، ثمنها 12000DA.' },
    { label: 'تحليل التعليمة واختيار إستراتيجية حل مناسبة', text: 'إذا كان L طول الزربية و $\\ell$ عرضها فإنّ $L = 2\\ell$، العلاقة الموجودة بين المساحة والبعدين. استبعاد المعطيات المُشوّشة: 12000DA.' },
    { label: 'تنفيذ استراتيجية الحل', text: 'كتابة عبارة المساحة بدلالة $\\ell$ ، القيام بالعمليات المناسبة ( التبسيط، حل معادلة ، ...)' },
  ],
  // Une phrase, discrète (brief de round 2) : la plateforme a corrigé une coquille du manuel.
  correctionNote: 'صحّحت المنصّة خطأً مطبعيًا في الكتاب: المعطى المشوِّش هو الثمن 12000DA، أمّا المساحة فضرورية للحساب.',
};

/**
 * Les corrections des questions du module 1 — importées aussi par la carte
 * (knowledgeGraph.js) : une aide de la carte cite la leçon mot pour mot.
 */
export const REMARKS = {
  masaha: 'مساحة المستطيل هي جداء طوله في عرضه، والطول هنا ضعف العرض: $L \\times \\ell = 2\\ell \\times \\ell = 2\\ell^2$.',
  sirWrong: 'نستعمل سعر الزربية 12000DA في المعادلة التي تترجم المساحة.',
  sirWhy: 'السعر بالدينار لا علاقة له بالمساحة ولا بالبعدين: إنه معطى مشوِّش.',
  sirRight: 'المساحة والعلاقة بين الطول والعرض تكفيان لإيجاد البعدين.',
  mujab: 'العرض طول، والطول عدد موجب: من حلّي المعادلة نحتفظ بالحل الموجب وحده.',
  tadwirWrong: 'ندوّر العرض إلى 1cm أولًا، ثم نضرب هذه القيمة المدوّرة في 2 لنحصل على الطول.',
  tadwirWhy: 'الطول ضعف العرض، فضربُ قيمة مدوّرة في 2 يضاعف خطأ التدوير، وقد يتغيّر الرقم الأخير من الطول.',
  tadwirRight: 'نحسب القيمتين المضبوطتين للعرض والطول، ثم ندوّر كلًّا منهما في النهاية فقط.',
  notSolvedHere: 'الحلّ نفسه في «أحلّ الوضعية»: هنا فهمنا واختطّينا الاستراتيجية فقط.',
};

/** « أؤكّد تعلّماتي » (p. 28) : les onze QCM, au mot près ; chaque item renvoie au درس qui l'enseigne (le manuel renvoie à la page). */
export const QCM = [
  { n: 1, text: 'الجذر التربيعي للعدد 0,25 هو .......', options: ['0,5', '$-0{,}5$', '0,05'], correct: 0, pages: [22], lesson: 'jidhr-tarbii',
    explain: '0,5 عدد موجب و $0{,}5^2 = 0{,}25$. أما $-0{,}5$ فسالب، و $0{,}05^2 = 0{,}0025$.' },
  { n: 2, text: '$\\sqrt{3^2}$ يساوي ........', options: ['$\\sqrt{3}$', '3', '$2\\sqrt{3}$'], correct: 1, pages: [22], lesson: 'jidhr-tarbii',
    explain: '$\\sqrt{3^2} = \\sqrt{9} = 3$.' },
  { n: 3, text: '$\\sqrt{(-2)^2}$ يساوي ........', options: ['$-2$', '2', '4'], correct: 1, pages: [22], lesson: 'jidhr-tarbii',
    explain: '$\\sqrt{(-2)^2} = \\sqrt{4} = 2$: الجذر التربيعي عدد موجب.' },
  { n: 4, text: 'المعادلة $x^2 = 0{,}25$ ........', options: ['تقبل حلين هما $-0{,}5$ و $0{,}5$', 'تقبل حلين هما $-5$ و 5', 'لا تقبل أي حل'], correct: 0, pages: [22, 23], lesson: 'muadalat-x-murabba',
    explain: '$0{,}25 > 0$ و $0{,}5^2 = (-0{,}5)^2 = 0{,}25$؛ أما $5^2 = 25$.' },
  { n: 5, text: 'المعادلة $x^2 = (-1)^2$ ........', options: ['تقبل حلين هما $-1$ و 1', 'تقبل حلا واحدا هو 1', 'لا تقبل أي حل'], correct: 0, pages: [22, 23], lesson: 'muadalat-x-murabba',
    explain: '$(-1)^2 = 1$، فالمعادلة هي $x^2 = 1$: حلّان متعاكسان 1 و $-1$.' },
  { n: 6, text: 'المعادلة $x^2 = -\\sqrt{3}$ ........', options: ['تقبل حلين هما $-3$ و 3', 'تقبل حلا واحدا هو 3', 'لا تقبل أي حل'], correct: 2, pages: [22, 23], lesson: 'muadalat-x-murabba',
    explain: '$-\\sqrt{3} < 0$، ومربع أي عدد هو دائما عدد موجب.' },
  { n: 7, text: 'العدد $\\sqrt{3^2 \\times 7}$ يكتب على الشكل .....', options: ['$3\\sqrt{7}$', '$3 \\times 7$', '$3^2 \\times 7^2$'], correct: 0, pages: [24, 25], lesson: 'tawzif-khawass-judhur',
    explain: '$\\sqrt{3^2 \\times 7} = \\sqrt{3^2} \\times \\sqrt{7} = 3\\sqrt{7}$.' },
  { n: 8, text: 'العدد $\\sqrt{\\dfrac{9}{25}}$ يبسط على الشكل......', options: ['$\\dfrac{81}{625}$', '$\\dfrac{3}{5}$', '$\\dfrac{5}{3}$'], correct: 1, pages: [24, 25], lesson: 'amaliyat-judhur',
    explain: '$\\sqrt{\\dfrac{9}{25}} = \\dfrac{\\sqrt{9}}{\\sqrt{25}} = \\dfrac{3}{5}$.' },
  // Item 9 : DEUX options justes dans le manuel (1 et 3) — posé en lignes « يساويه / لا يساويه ».
  { n: 9, text: 'العدد $\\sqrt{\\dfrac{1}{28}}$ يكتب ........', options: ['$\\dfrac{1}{\\sqrt{28}}$', '$\\sqrt{28}$', '$\\dfrac{1}{2\\sqrt{7}}$'], correctSet: [0, 2], pages: [24, 25], lesson: 'amaliyat-judhur',
    rowCorrections: [
      '$\\sqrt{\\dfrac{1}{28}} = \\dfrac{\\sqrt{1}}{\\sqrt{28}} = \\dfrac{1}{\\sqrt{28}}$.',
      '$\\sqrt{28}$ أكبر من 1، بينما $\\dfrac{1}{28}$ أصغر من 1 وجذره كذلك.',
      '$\\sqrt{28} = \\sqrt{4 \\times 7} = 2\\sqrt{7}$، إذن $\\dfrac{1}{\\sqrt{28}} = \\dfrac{1}{2\\sqrt{7}}$.',
    ] },
  { n: 10, text: 'المعادلة $x^2 - 7 = 0$ ..........', options: ['تقبل حلا واحدا هو $\\dfrac{7}{2}$', 'تقبل حلين هما $\\sqrt{7}$ و $-\\sqrt{7}$', 'تقبل حلا واحدا هو 14'], correct: 1, pages: [22, 23], lesson: 'muadalat-x-murabba',
    explain: '$x^2 - 7 = 0$ يعني $x^2 = 7$، و $7 > 0$: حلّان متعاكسان.' },
  { n: 11, text: 'المعادلة $-x^2 - 16 = 0$ ..........', options: ['تقبل حلا واحدا هو 4', 'تقبل حلين هما $-4$ و 4', 'لا تقبل أي حل'], correct: 2, pages: [22, 23], lesson: 'muadalat-x-murabba',
    explain: '$-x^2 - 16 = 0$ يعني $x^2 = -16$، و $-16 < 0$.' },
].map((it) => ({ ...it, source: src('qcm', 28, 'أؤكّد تعلّماتي', it.n), lessonPath: `${BASE}/${it.lesson}` }));

export const LESSON_TITLES = {
  'jidhr-tarbii': 'الدرس 1 — الجذر التربيعي لعدد موجب',
  'muadalat-x-murabba': 'الدرس 3 — حل المعادلة من الشكل $x^2 = a$',
  'amaliyat-judhur': 'الدرس 4 — العمليات على الجذور التربيعية',
  'tawzif-khawass-judhur': 'الدرس 5 — توظيف خواص الجذور التربيعية',
};
