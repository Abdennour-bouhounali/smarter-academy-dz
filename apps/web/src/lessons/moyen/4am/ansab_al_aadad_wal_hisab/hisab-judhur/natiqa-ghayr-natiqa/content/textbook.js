/**
 * Le contenu du MANUEL pour le درس 2 de l'unité 2 — données pures, au mot
 * près ; chaque bloc cite son élément de docs/sources/4am/unit2/extraction.json.
 * Les modules rendent ces données ; ils n'en réécrivent aucune.
 */
import { src, addition } from '../../_unit/unitMeta.js';

/**
 * نشاط 2 (p. 20). L'énoncé imprimé listait √(25/9) et √(16/13) alors que le
 * classement porte √(16/9) et √(25/13) : on affiche la VERSION CORRIGÉE
 * (extraction.json → act-2.correction.text, décidée par le propriétaire),
 * avec une seule phrase discrète (`correctionNote`).
 */
export const ACTIVITY = {
  source: src('act-2', 20, 'أنشطة', 2),
  title: 'الأعداد الناطقة والأعداد غير الناطقة',
  text: 'تم تصنيف الأعداد $\\sqrt{100}$ ، $\\sqrt{7}$ ، $\\sqrt{13}$ ، $\\sqrt{9}$ ، $\\sqrt{\\dfrac{16}{9}}$ ، $\\sqrt{\\dfrac{25}{13}}$ ، $\\sqrt{0{,}25}$ ، $\\sqrt{6}$ كما يلي:',
  classes: {
    first: { label: 'الصنف الأول:', items: ['$\\sqrt{100}$', '$\\sqrt{9}$', '$\\sqrt{\\dfrac{16}{9}}$', '$\\sqrt{0{,}25}$'] },
    second: { label: 'الصنف الثاني:', items: ['$\\sqrt{7}$', '$\\sqrt{13}$', '$\\sqrt{\\dfrac{25}{13}}$', '$\\sqrt{6}$'] },
  },
  questions: [
    'أ) إلى أي الصنفين ينتمي العدد $\\sqrt{169}$ ؟ برّر إجابتك.',
    'ب) ما هي معايير التصنيف السابق؟',
  ],
  correctionNote: 'صحّحت المنصّة خطأً مطبعيًا في قائمة الكتاب لتوافق التصنيف.',
  // Les aires { num, den } du classement, pour la règle graduée. 0,25 s'écrit
  // 25/100 (le laboratoire réduit une aire : sa carte affiche 1/4).
  numbers: {
    first: [{ num: 100, den: 1 }, { num: 9, den: 1 }, { num: 16, den: 9 }, { num: 25, den: 100 }],
    second: [{ num: 7, den: 1 }, { num: 13, den: 1 }, { num: 25, den: 13 }, { num: 6, den: 1 }],
    question: 169,
  },
};

/** معارف 2 (p. 22). */
export const KNOWLEDGE = {
  source: src('know-2', 22, 'معارف', 2),
  title: 'الأعداد الناطقة والأعداد غير الناطقة',
  text: '$a$ عدد ناطق موجب.',
  results: [
    'في حالة $a$ مربعا لعدد ناطق، يكون $\\sqrt{a}$ عددا ناطقا.',
    'في حالة $a$ ليس مربعا لعدد ناطق، فإنّ $\\sqrt{a}$ ليس عددا ناطقا.',
  ],
  examples: [
    'نعلم أنّ $\\dfrac{25}{9} = \\left(\\dfrac{5}{3}\\right)^2$ إذن $\\sqrt{\\dfrac{25}{9}}$ عدد ناطق، ولدينا $\\sqrt{\\dfrac{25}{9}} = \\dfrac{5}{3}$ .',
    'نعلم أنّه لا يوجد عدد ناطق مربعه 6. إذن $\\sqrt{6}$ عدد غير ناطق.',
  ],
};

/**
 * أوظّف تكنولوجيات الإعلام والاتصال (p. 30) — « قيمة العدد √2 المخزنة في
 * ذاكرة حاسبة وقيمة مقرّبة له ». Le carré de la lecture est CALCULÉ ici en
 * entiers (jamais un flottant) : 1414213562² = 1999999998944727844.
 */
const READING = '1,414213562';
const readingSquare = (() => {
  const n = 1414213562n;
  const s = (n * n).toString(); // 18 décimales
  return `${s.slice(0, s.length - 18)},${s.slice(-18)}`;
})();
export const ICT_SQRT2 = {
  source: src('ict-sqrt2', 30, 'أوظّف تكنولوجيات الإعلام والاتصال'),
  title: 'قيمة العدد $\\sqrt{2}$ المخزنة في ذاكرة حاسبة وقيمة مقرّبة له.',
  steps: [
    'عند استعمال اللمسة $\\sqrt{\\;}$ لحساب $\\sqrt{2}$ تظهر الحاسبة قيمة $a = 1{,}414213562$',
    'أُحسب باستعمال حاسبة الفرق $\\sqrt{2} - a$ . كيف تفسّر النتيجة؟',
  ],
  reading: READING,
  readingSquare,
  // Ce qu'une calculatrice scientifique affiche pour √2 − a (≈ 3,730950488 × 10⁻¹⁰).
  difference: '3{,}730950488 \\times 10^{-10}',
  // L'interprétation attendue (extraction.json → answer, `answerSource: computed`).
  interpretation: 'الفرق ليس معدومًا: الحاسبة تخزّن أرقامًا أكثر مما تعرض، و 1,414213562 قيمة مقرّبة فقط للعدد $\\sqrt{2}$.',
};

/**
 * « أستعدّ » — le manuel n'attribue aucun item de « أستعدّ » (p. 19) à ce
 * درس : cinq affirmations de la PLATEFORME, même forme (« أصحيح أم خاطئ؟
 * برّر إجابتك »), les deux réponses présentes, aucun nombre de نشاط 2.
 */
export const PREP_ITEMS = [
  { n: 1, skill: 'natiq', text: 'العدد $\\dfrac{3}{4}$ عدد ناطق.', answer: true,
    why: 'يُكتب على الشكل $\\dfrac{a}{b}$ حيث $a$ و $b$ عددان صحيحان و $b \\neq 0$.' },
  { n: 2, skill: 'natiq', text: 'العدد العشري 2,5 ليس عددًا ناطقًا لأنه ليس مكتوبًا على شكل كسر.', answer: false,
    why: '$2{,}5 = \\dfrac{25}{10} = \\dfrac{5}{2}$: كل عدد عشري عدد ناطق.' },
  { n: 3, skill: 'jidhr', text: '$\\sqrt{49} = 7$ لأن 7 عدد موجب و $7^2 = 49$.', answer: true,
    why: 'الجذر التربيعي للعدد 49 هو العدد الموجب الذي مربعه 49، وهو 7.' },
  { n: 4, skill: 'jidhr', text: '$\\sqrt{64} = 32$.', answer: false,
    why: '$32^2 = 1024$ وليس 64. العدد الموجب الذي مربعه 64 هو 8، إذن $\\sqrt{64} = 8$.' },
  { n: 5, skill: 'mudbuta', text: 'العدد 2,236067978 الذي تعرضه الحاسبة هو القيمة المضبوطة للعدد $\\sqrt{5}$.', answer: false,
    why: 'مربعه $5{,}000000002237008484$ لا يساوي 5: إنه قيمة مقرّبة، والقيمة المضبوطة نرمز لها بـ $\\sqrt{5}$.' },
].map((it) => ({ ...it, source: addition('prerequisite_diagnostic') }));

/**
 * تذكير — القيم المقرّبة (بالنقصان، بالزيادة، المدوّر) sont des mots des
 * années précédentes que les exercices 9, 10, 25 et 35 emploient sans les
 * redéfinir. Rappel de la PLATEFORME, déclaré comme tel ; son exemple est
 * √2, le nombre de « أوظّف تكنولوجيات الإعلام والاتصال » (p. 30).
 */
export const QIMA_MUQARRABA = {
  source: addition('prior_year_reminder'),
  text: 'نحصر العدد بين عددين عشريين متتاليين بالدقة المطلوبة: الأصغر هو قيمته المقرّبة بالنقصان، والأكبر هو قيمته المقرّبة بالزيادة. المدوّر هو أقرب القيمتين إلى العدد.',
  example: 'من $1{,}41 < \\sqrt{2} < 1{,}42$: القيمة المقرّبة إلى الجزء من 100 بالنقصان هي 1,41 وبالزيادة 1,42. و $\\sqrt{2}$ (الحاسبة تعرض 1,414213562) أقرب إلى 1,41: المدوّر إلى الجزء من 100 هو 1,41.',
  rule: 'لنجد المدوّر ننظر إلى الرقم الذي يلي الرقم المطلوب: إن كان 5 أو أكثر نأخذ القيمة بالزيادة، وإلا نأخذ القيمة بالنقصان.',
};
