import { src, addition } from '../../_unit/unitMeta.js';

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
 * « أدمج تعلّماتي » (p. 40) — la وضعية, au mot près (+ une phrase de contexte, valeur « التعاون », 2026-10-13 ; le texte du manuel reste dans extraction.json), et son « تحليل الوضعية »
 * en trois étapes (le manuel les nomme). L'« مساعدة » du manuel est la seule
 * factorisation donnée : la plateforme n'enseigne rien de plus (le produit est
 * nul quand un facteur est nul — on vérifie par substitution).
 */
export const SITUATION = {
  source: src('situation', 40, 'أدمج تعلّماتي'),
  title: 'وضعية',
  text: 'يتعاون سكّان الحيّ على تهيئة حديقة عامة يرتادها الجميع. الشكل الملوّن بالأزرق هو حوض شكله مربع، طول ضلعه 10m. نريد تهيئة شريط منتظم حول هذا الحوض يخصص للراجلين عرضه $x$. ماهي قيمة $x$ حتى تكون مساحة الشريط تساوي $44m^2$؟',
  help: 'مساعدة : $x^2 + 10x - 11 = (x - 1)(x + 11)$',
  figure: 'حوض مربع ضلعه 10m (أزرق)، يحيط به من كل الجهات شريط عرضه $x$.',
  caption: 'الحوض والشريط',
  analysis: [
    { label: 'قراءة الوضعية وفهمها', text: 'المطلوب البحث عن العرض $x$ للشريط الذي من أجله تكون مساحة هذا الشريط $44m^2$.' },
    { label: 'تحليل الوضعية واختيار استراتيجية حل مناسبة', text: 'التعبير عن مساحة الشريط بدلالة $x$ (هناك طرق متعددة)؛ توظيف المعلومة « مساحة هذا الشريط $44m^2$ »' },
    { label: 'تنفيذ استراتيجية الحل', text: 'كتابة المساواة المناسبة ، حل معادلة ، ...' },
  ],
};

/** « تحدّ » de la page d'unité (p. 31) — l'accroche de la synthèse, résolue à la fin du module 7 (extraction › challenge › duplicatedIn). */
export const CHALLENGE = {
  source: src('challenge', 31, 'تحدّ'),
  text: 'لاحظ الشكل المقابل حيث ABC مثلث. ما هي قيمة العدد $x$ التي من أجلها يكون المثلث ABC قائما في A ؟',
  figure: 'مثلث ABC حيث $AB = x + 1$ ، $AC = x + 2$ ، $BC = x + 3$.',
};

/**
 * Les corrections du module 7 — importées aussi par la carte (knowledgeGraph.js) :
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
