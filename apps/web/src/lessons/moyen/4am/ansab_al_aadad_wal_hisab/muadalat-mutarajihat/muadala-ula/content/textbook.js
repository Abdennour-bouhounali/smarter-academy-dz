/**
 * Le contenu du MANUEL pour le درس 1 « حل معادلة من الدرجة الأولى بمجهول واحد » — données
 * pures (aucun JSX), au mot près ; chaque bloc cite son élément de
 * docs/sources/4am/unit4/extraction.json. Les modules rendent ces données ; ils n'en
 * réécrivent aucune.
 */
import { src, addition } from '../../_unit/unitMeta.js';

/** نشاط 1 (p. 44) — « المعادلات من الدرجة الأولى بمجهول واحد » : le programme de calcul. */
export const ACTIVITY = {
  source: src('act-1', 44, 'أنشطة', 1),
  title: 'المعادلات من الدرجة الأولى بمجهول واحد',
  text: 'إليك برنامج الحساب التالي :',
  program: ['اختر عددا.', 'اضربه في 3 ثمّ أضف 2.', 'اضرب الناتج في 3.', 'اطرح 5.', 'أعلن النتيجة.'],
  questions: [
    '1) تحقّق أنّه عند اختيار العدد 2 في البداية، نتحصّل على العدد 19 في نهاية البرنامج.',
    '2) بيّن أنّه عند اختيار العدد $x$ في البداية، نتحصّل على العبارة $9x + 1$ في نهاية البرنامج.',
    '3) اختارت فاطمة عددا وقامت بتفعيل البرنامج، فحصلت على $-26$ . • ما هو العدد الذي اختارته في البداية؟',
    '4) اختار مصطفى عددا وقام بتفعيل البرنامج، فحصل على ضعف العدد الذي اختاره في البداية. • ما هو العدد الذي اختاره في البداية؟',
  ],
  // Les nombres du livre (les calculs sont faits dans le module).
  numbers: { start: 2, end: 19, fatima: -26 },
};

/**
 * L'ACCROCHE — une expérience de la PLATEFORME : la balance du vestiaire de l'équipe.
 * La balance est le geste même de la leçon (« المقابلة »). Déclarée, jamais cachée.
 */
export const HOOK = {
  source: addition('interaction_generation'),
  headline: 'ميزان غرفة الملابس!',
  text: 'في غرفة ملابس الفريق، التي يحافظ لاعبوه على نظافتها وترتيبها، ميزان بكفّتين، وأكياس مغلقة في كل منها العدد نفسه من الكرات. لا نستطيع فتح الكيس… لكن الميزان لا يكذب: ما الذي يمكن أن نفعله بالكفّتين ليبقى متوازنًا، حتى نعرف ما في كيس واحد؟',
};

/** Le خوارزمي (p. 43) — l'aparté de la page d'ouverture, repris ici (duplicatedIn). */
export const HISTORY = {
  source: src('history-khwarizmi', 43, 'الخوارزمي'),
  caption: 'الخوارزمي (780م-850م)',
  text: 'أبو جعفر محمد بن موسى الخوارزمي عالم موسوعي، برز في الرياضيات والفلك؛ فهو أول من استعمل كلمة «جبر» للعلم المعروف الآن بهذا الاسم. وكفاه فخرا أنّه ألّف « كتاب الجبر والمقابلة».',
};
/** Une ligne de la plateforme sur le mot « المقابلة ». */
export const HISTORY_NOTE = {
  source: addition('interaction_generation'),
  text: 'في «المقابلة» يُحذف من طرفي المعادلة ما هو مشترك بينهما، فيبقى الطرفان متقابلين متساويين: هو ما فعلته بالميزان.',
};

/**
 * Ce que la balance du module 1 vient de faire, posé en brique (muadala-tarafayn) : une
 * phrase de la PLATEFORME (le livre l'applique dans ses solutions — « نضيف 5 إلى كل
 * طرف » — sans l'énoncer en encadré). Le calcul de فاطمة est celui du نشاط 1، س 3.
 */
export const BALANCE_LINES = {
  source: addition('interaction_generation'),
  rule: 'نحصل على معادلة لها الحل نفسه إذا أجرينا العملية نفسها على طرفيها: نضيف العدد نفسه إلى الطرفين أو نطرحه منهما، أو نقسم الطرفين على العدد نفسه غير المعدوم.',
  fatima: '$9x + 1 = -26$ ، نطرح 1 من كل طرف: $9x = -27$ ، نقسم كل طرف على 9: $x = -3$.',
  mustafa: '$9x + 1 = 2x$ ، نطرح $2x$ من كل طرف: $7x + 1 = 0$ ، نطرح 1: $7x = -1$ ، نقسم على 7: $x = -\\dfrac{1}{7}$.',
  verify: 'نتحقّق بالتعويض: $9 \\times (-3) + 1 = -27 + 1 = -26$.',
};

/** معارف 1 (p. 46) — « المعادلة من الدرجة الأولى بمجهول واحد ». */
export const KNOWLEDGE = {
  source: src('know-1', 46, 'معارف', 1),
  title: 'المعادلة من الدرجة الأولى بمجهول واحد',
  property: 'يؤول حل كل معادلة من الدرجة الأولى بمجهول واحد إلى حل معادلة من الشكل $ax = b$ حيث $a \\neq 0$ . الحل الوحيد لهذه المعادلة هو العدد $\\dfrac{b}{a}$ .',
  example: 'المعادلة $4x - 3 = 2x + 6$ . تكتب $4x - 3 - 2x = 2x + 6 - 2x$ . أي $2x - 3 = 6$ ويمكن كتابة هذه المعادلة الأخيرة على الشكل $2x = 9$ . بتقسيم الطرفين على العدد 2 أي $x = \\dfrac{9}{2}$ . ينتج أنّ $\\dfrac{9}{2}$ هو الحل الوحيد للمعادلة $4x - 3 = 2x + 6$ .',
  // L'exemple du livre en LIGNES (au mot près), pour une lecture ligne à ligne.
  exampleLines: {
    exercise: 'المعادلة $4x - 3 = 2x + 6$ .',
    solution: [
      'تكتب $4x - 3 - 2x = 2x + 6 - 2x$ . أي $2x - 3 = 6$',
      'ويمكن كتابة هذه المعادلة الأخيرة على الشكل $2x = 9$ .',
      'بتقسيم الطرفين على العدد 2 أي $x = \\dfrac{9}{2}$ .',
      'ينتج أنّ $\\dfrac{9}{2}$ هو الحل الوحيد للمعادلة $4x - 3 = 2x + 6$ .',
    ],
  },
};

/** طرائق p. 47 — « حل معادلة من الدرجة الأولى بمجهول واحد » (deux solutions). */
const METHOD_SRC = src('method-equation', 47, 'طرائق');
export const METHOD = {
  source: METHOD_SRC,
  title: 'حل معادلة من الدرجة الأولى بمجهول واحد',
  exercise: 'حل كل معادلة من المعادلتين الآتيين: أ) $2x - 5 = 8$ ب) $2{,}5x + 4{,}6 = 1{,}3x - 0{,}2$',
  a: {
    source: METHOD_SRC,
    exercise: 'أ) $2x - 5 = 8$',
    solution: [
      'أ) لحل المعادلة $2x - 5 = 8$ نضيف 5 إلى كل طرف فنجد $2x - 5 + 5 = 8 + 5$',
      'أي $2x = 13$ ومنه $x = \\dfrac{13}{2}$',
      'وللمعادلة $2x - 5 = 8$ حل وحيد هو $\\dfrac{13}{2}$ .',
    ],
  },
  b: {
    source: METHOD_SRC,
    exercise: 'ب) $2{,}5x + 4{,}6 = 1{,}3x - 0{,}2$',
    solution: [
      'ب) حل المعادلة $2{,}5x + 4{,}6 = 1{,}3x - 0{,}2$ . نطرح $1{,}3x$ من كل طرف فنجد $2{,}5x + 4{,}6 - 1{,}3x = 1{,}3x - 0{,}2 - 1{,}3x$',
      'أي $1{,}2x + 4{,}6 = -0{,}2$ . نطرح $4{,}6$ من كل طرف فنجد $1{,}2x + 4{,}6 - 4{,}6 = -0{,}2 - 4{,}6$',
      'أي $1{,}2x = -4{,}8$ ومنه $x = -\\dfrac{4{,}8}{1{,}2} = -4$ .',
      'وللمعادلة $2{,}5x + 4{,}6 = 1{,}3x - 0{,}2$ حل وحيد هو $-4$ .',
    ],
  },
  // Ce que les deux solutions font, dit avec les mots du point d'apprentissage P2 (catalogue).
  rule: 'لحل معادلة من الدرجة الأولى بمجهول واحد ننقل المجاهيل إلى طرف والمعاليم إلى الطرف الآخر بإجراء العملية نفسها على الطرفين، ونجمع الحدود المتشابهة حتى نصل إلى الشكل $ax = b$ ، ثم نقسم الطرفين على $a$.',
};

/**
 * « أؤكّد تعلّماتي » (p. 52) — les items 1 et 2 (extraction.json → destinations › qcm ›
 * duplicatedIn › muadala-ula, module 5) : l'إختبار أولي.
 */
const QCM_SRC = (n) => src('qcm', 52, 'أؤكّد تعلّماتي', n);
export const QCM = {
  1: { n: 1, source: QCM_SRC(1), text: 'حل المعادلة $-2 + x = 5$ هو...', options: ['2', '7', '3'], correct: 1,
    explain: 'نضيف 2 إلى الطرفين: $-2 + x + 2 = 5 + 2$ أي $x = 7$ ؛ وللتحقّق $-2 + 7 = 5$.' },
  2: { n: 2, source: QCM_SRC(2), text: 'حل المعادلة $4x = 5x$ هو ...', options: ['$\\dfrac{5}{4}$', '0', '$\\dfrac{4}{5}$'], correct: 1,
    explain: 'نطرح $4x$ من الطرفين: $0 = x$ ، فالحل هو 0 ؛ وللتحقّق $4 \\times 0 = 5 \\times 0$.' },
};

/**
 * « أستعدّ » — items 1 et 2 du manuel (p. 43), puis des affirmations de la PLATEFORME,
 * même forme (« أصحيح أم خاطئ؟ برّر إجابتك »), pour les autres acquis supposés : les
 * opérations sur les deux membres d'une égalité, et le نشر / التبسيط (leçon nashr-tabsit).
 * Aucune n'utilise les nombres du module 1 (9x + 1, −26, 3x + 2 = 11).
 */
export const PREP_ITEMS = [
  { n: 1, skill: 'taawid', text: 'إذا كان $2x - 1 = 0$ فإن $x = 1$ .', answer: false, why: '$2 \\times 1 - 1 = 1 \\neq 0$ ؛ الحل هو $x = \\dfrac{1}{2}$', source: src('prep', 43, 'أستعدّ', 1) },
  { n: 2, skill: 'taawid', text: 'حل المعادلة $x + 3 = 2x + 3$ هو 0.', answer: true, why: '$0 + 3 = 3$ و $2 \\times 0 + 3 = 3$', source: src('prep', 43, 'أستعدّ', 2) },
  { skill: 'musawat', text: 'إذا كان $a = b$ فإن $a - 7 = b - 7$ .', answer: true, why: 'نطرح العدد نفسه 7 من طرفي المساواة فتبقى صحيحة.', source: addition('prerequisite_diagnostic') },
  { skill: 'musawat', text: 'إذا كان $a = b$ فإن $4a = b + 4$ .', answer: false, why: 'ضربنا طرفًا في 4 وأضفنا 4 إلى الآخر: عمليتان مختلفتان. مثلًا $a = b = 1$ : $4 \\times 1 = 4$ و $1 + 4 = 5$.', source: addition('prerequisite_diagnostic') },
  { skill: 'tabsit', text: 'العبارة $3(x - 2) + x$ تُبسَّط على الشكل $4x - 6$ .', answer: true, why: '$3x - 6 + x = 4x - 6$', source: addition('prerequisite_diagnostic') },
  { skill: 'tabsit', text: 'العبارة $5x - 2 - x$ تساوي $2x$ .', answer: false, why: '$5x - x = 4x$ ، و $-2$ حدّ غير مشابه لـ $4x$ : العبارة تساوي $4x - 2$.', source: addition('prerequisite_diagnostic') },
];
