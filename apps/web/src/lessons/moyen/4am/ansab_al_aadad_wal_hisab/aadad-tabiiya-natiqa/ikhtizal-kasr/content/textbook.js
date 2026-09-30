import { src, addition } from '../../_unit/unitMeta.js';
export const PREP_ITEMS = [
  { n: 7, skill: 'natiq', text: 'العدد المجهول في المساواة $\\dfrac{13}{5} = \\dfrac{\\ldots}{-10}$ هو $-26$.', answer: true, why: '$13 \\times (-2) = -26$ و $5 \\times (-2) = -10$.' },
  { n: 8, skill: 'kusur', text: 'الكسر $\\dfrac{34}{9}$ يساوي $\\dfrac{238}{63}$.', answer: true, why: '$34 \\times 7 = 238$ و $9 \\times 7 = 63$.' },
  { n: 9, skill: 'natiq', text: 'مقلوب العدد الناطق $\\dfrac{-11}{13}$ هو $\\dfrac{-13}{11}$ وحاصل القسمة $9 \\div \\left(-\\dfrac{9}{4}\\right)$ يساوي $-\\dfrac{81}{4}$.', answer: false, why: 'المقلوب صحيح، لكن $9 \\div \\left(-\\dfrac{9}{4}\\right) = 9 \\times \\left(-\\dfrac{4}{9}\\right) = -4$.' },
  { n: 10, skill: 'kusur', text: 'المجموع $\\dfrac{7}{6} + \\dfrac{6}{7}$ يساوي 1 والمجموع $1 + \\dfrac{3}{5}$ يساوي $\\dfrac{4}{5}$.', answer: false, why: '$\\dfrac{7}{6} + \\dfrac{6}{7} = \\dfrac{49 + 36}{42} = \\dfrac{85}{42}$ و $1 + \\dfrac{3}{5} = \\dfrac{8}{5}$.' },
].map((it) => ({ ...it, source: src('prep', 7, 'أستعدّ', it.n) }));
/**
 * Deux ajouts de la plateforme, déclarés comme tels : les items 7–10 du manuel
 * ne diagnostiquent que les nombres rationnels, alors que la leçon s'appuie
 * aussi sur « أوليان فيما بينهما » et sur l'algorithme d'Euclide (leçons 6, 7).
 */
export const PREP_PLATFORM_ITEMS = [
  { n: 'a', skill: 'pgcd', text: 'العددان 14 و 25 أوليان فيما بينهما لأنّ PGCD$(14 ; 25) = 1$.', answer: true, why: 'قواسم 14: 1 ، 2 ، 7 ، 14؛ قواسم 25: 1 ، 5 ، 25؛ القاسم المشترك الوحيد هو 1.' },
  { n: 'b', skill: 'pgcd', text: '$91 = 65 \\times 1 + 26$ ؛ $65 = 26 \\times 2 + 13$ ؛ $26 = 13 \\times 2 + 0$، إذن PGCD$(91 ; 65) = 26$.', answer: false, why: 'القاسم المشترك الأكبر هو آخر باقٍ غير معدوم: PGCD$(91 ; 65) = 13$.' },
].map((it) => ({ ...it, source: addition('prerequisite_diagnostic') }));

export const ACTIVITY = {
  source: src('act-8', 9, 'أنشطة', 8), title: 'اختزال كسر',
  questions: ['أ) لاحظ كيف اختزل سمير الكسر $\\dfrac{84}{48}$ واشرح طريقته.', 'هل يمكن مواصلة اختزال الكسر $\\dfrac{7}{4}$؟ لماذا؟', 'نقول إنّ الكسر $\\dfrac{7}{4}$ غير قابل للاختزال.', 'ب) احسب القاسم المشترك الأكبر للعددين 84 و 48، ثمّ استعمله لاختزال الكسر السابق.', 'جـ) استنتج طريقة تسمح بكتابة كسر على الشكل غير القابل للاختزال.', 'د) هل الكسر $\\dfrac{188}{252}$ قابل للاختزال؟ إذا كانت الإجابة «نعم»، اكتبه على شكل كسر غير قابل للاختزال.'],
  samirPath: '$\\dfrac{84}{48} = \\dfrac{84 \\div 4}{48 \\div 4} = \\dfrac{21}{12} = \\dfrac{21 \\div 3}{12 \\div 3} = \\dfrac{7}{4}$',
  numbers: { n: 84, d: 48, path: [4, 3], last: { n: 188, d: 252 } },
};
export const KNOWLEDGE = {
  source: src('know-6', 12, 'معارف', 6),
  definition: '$a$ و $b$ عددان طبيعيان حيث $b \\neq 0$. الكسر $\\dfrac{a}{b}$ غير قابل للاختزال يعني $a$ و $b$ أوليان فيما بينهما.',
  remark: 'عندما نقسم كلا من بسط و مقام كسر على قاسمهما المشترك الأكبر نحصل على كسر غير قابل للاختزال.',
  examples: ['الكسر $\\dfrac{15}{22}$ غير قابل للاختزال لأن 15 و 22 أوليان فيما بينهما أي PGCD(22 ; 15) = 1.', 'الكسر $\\dfrac{28}{42}$ قابل للاختزال لأن 28 و 42 ليسا أوليين فيما بينهما. بالفعل لدينا PGCD(28 ; 42) = 14 إذن $\\dfrac{28}{42} = \\dfrac{14 \\times 2}{14 \\times 3} = \\dfrac{2}{3}$ (أي اختزلنا الكسر $\\dfrac{28}{42}$ على 14). بالتالي $\\dfrac{28}{42} = \\dfrac{2}{3}$ والكسر $\\dfrac{2}{3}$ غير قابل للاختزال.'],
};
export const METHOD = {
  source: src('method-reduce', 13, 'طرائق'), title: 'استعمل القاسم المشترك الأكبر لكتابة كسر على الشكل غير القابل للاختزال',
  exercise: 'اكتب الكسر $\\dfrac{595}{560}$ على شكل غير قابل للاختزال.',
  solution: ['حساب PGCD(595 ; 560). لذلك نستعمل خوارزمية إقليدس.', 'لدينا $595 = 560 \\times 1 + 35$ ؛ $560 = 35 \\times 16 + 0$ إذن PGCD(595 ; 560) = 35.', 'بالتالي $\\dfrac{595}{560} = \\dfrac{595 \\div 35}{560 \\div 35} = \\dfrac{17}{16}$ أي $\\dfrac{595}{560} = \\dfrac{17}{16}$.'],
  rule: 'لكتابة كسر على الشكل غير القابل للاختزال، نقسم كلا من بسطه و مقامه على القاسم المشترك الأكبر لهما.',
};
