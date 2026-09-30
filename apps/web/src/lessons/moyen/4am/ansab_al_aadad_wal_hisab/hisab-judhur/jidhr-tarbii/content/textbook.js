/**
 * Le contenu du MANUEL pour le درس « الجذر التربيعي لعدد موجب » (unité 2,
 * pp. 19–30) — données pures, au mot près ; chaque bloc cite son élément de
 * docs/sources/4am/unit2/extraction.json. Les modules rendent ces données ;
 * ils n'en réécrivent aucune. Dans les formules, la virgule décimale s'écrit
 * `{,}` (KaTeX) ; le texte arabe est celui du livre.
 */
import { src, addition } from '../../_unit/unitMeta.js';

/** « تحدّ » (p. 19) — l'accroche de la leçon (extraction : duplicatedIn jidhr-tarbii, module 1). */
export const CHALLENGE = {
  source: src('challenge', 19, 'تحدّ'),
  text: 'أراد فلاح بناء خزان ماء على شكل متوازي مستطيلات قاعدته مربعة، ارتفاعه 1,80m وسعته $36\\,m^3$. ساعد هذا الفلاح على إيجاد طول ضلع قاعدة الخزان. (تعطى النتيجة مدورة إلى 1cm)',
  // Les nombres du livre : le volume et la hauteur ; l'aire de la base se CALCULE (36 ÷ 1,8).
  numbers: { volume: 36, heightTenths: 18 },
};

/** نشاط 1 (p. 20). */
export const ACTIVITY = {
  source: src('act-1', 20, 'أنشطة', 1),
  title: 'الجذر التربيعي لعدد موجب',
  text: 'وحدة الطول هي السنتيمتر. والشكل ليس بالأطوال الحقيقية.',
  figure: 'مثلث ABC قائم في A حيث AB = 1 و AC = 2.',
  questions: [
    '1) أ) أحسب، باستعمال خاصية فيثاغورس، $BC^2$.',
    'ب) انقل وأكمل: الطول BC هو العدد الموجب الذي مربعه .... .',
    '2) تعطي اللمسة $\\sqrt{\\;}$ في الحاسبة القيمة المضبوطة أو قيمة مقربة لعدد عُلِمَ مربّعه.',
    'أ) تأكد أنه عند استعمال الحاسبة لإيجاد الطول BC تظهر على الشاشة القيمة 2,236067978.',
    'ب) تقول إيمان: « إنّ 2,236067978 ليست القيمة المضبوطة للعدد الذي مربعه 5». هل توافقها؟ اشرح.',
    '3) أكتب، باستعمال الرمز $\\sqrt{\\;}$، الجذر التربيعي لكل من الأعداد 36، 81، 0,49، أعط الناتج ذهنيا.',
    '4) أنقل وأتمم ما يلي: أ) $\\sqrt{2^2} = \\ldots$ ، $\\sqrt{3^2} = \\ldots$ ، $\\sqrt{5^2} = \\ldots$ ، $(\\sqrt{5})^2 = \\ldots$ .',
    'ب) $\\sqrt{a^2} = \\ldots$ و $(\\sqrt{a})^2 = \\ldots$ (علما أنّ $a$ عدد موجب).',
  ],
  box: 'نرمز بـ $\\sqrt{5}$ للقيمة المضبوطة للعدد الموجب الذي مربعه 5، ونقرأ: الجذر التربيعي للعدد 5.',
  // Les nombres du livre, lus par le module et par la carte (jamais retapés).
  numbers: {
    ab: 1, ac: 2,
    calculator: '2,236067978',
    // Question 3 : 36, 81, 0,49 — aires { num, den } exactes.
    q3: [{ num: 36, den: 1 }, { num: 81, den: 1 }, { num: 49, den: 100 }],
    // Question 4 a) : √2², √3², √5².
    q4: [2, 3, 5],
  },
};

/** « أوظّف تكنولوجيات الإعلام والاتصال » (p. 30) — la spirale des √n (question du livre, sans GeoGebra). */
export const ICT_CONSTRUCT = {
  source: src('ict-construct', 30, 'أوظّف تكنولوجيات الإعلام والاتصال'),
  title: 'إنشاء قطعة مستقيم طولها $\\sqrt{n}$ حيث $n$ عدد طبيعي باستعمال برمجية جيوجبرا.',
  steps: [
    'ضع نقطة A ثمّ انقر على … وعلى النقطة A لتعيين قطعة مستقيم بالطول 1، سمّ طرفها الآخر B.',
    'ارسم، باستعمال …، المستقيم العمودي على (AB) في A، وباستعمال … الدائرة ذات المركز A ونصف القطر 1. تتقاطع الدائرة مع المستقيم في نقطتين سمّ C النقطة الواقعة أعلى (AB).',
    'واصل بنفس الطريقة وعيّن النقط D، E، F، G، H كما في الشكل.',
  ],
  questions: ['ما هي القيمة المضبوطة للطول BC؟', 'ما هي القيمة المضبوطة للطول BH؟'],
  // La figure du livre : B, puis C, D, E, F, G, H, chaque côté ajouté vaut 1 et est perpendiculaire au précédent.
  points: ['C', 'D', 'E', 'F', 'G', 'H'],
};

/** معارف 1 (p. 22). */
export const KNOWLEDGE = {
  source: src('know-1', 22, 'معارف', 1),
  title: 'الجذر التربيعي لعدد موجب',
  definition: '$a$ عدد موجب. الجذر التربيعي للعدد $a$ هو العدد الموجب الذي مربعه يساوي $a$. نرمز للجذر التربيعي للعدد $a$ بالرمز $\\sqrt{a}$ ونقرأ: «الجذر التربيعي لـ $a$».',
  examples: [
    '$\\sqrt{4} = 2$ لأن 4 عدد موجب و $2^2 = 4$.',
    'كذلك $\\sqrt{25} = 5$ ، $\\sqrt{0} = 0$ ، $\\sqrt{1} = 1$ .',
    '$\\sqrt{\\dfrac{25}{9}} = \\dfrac{5}{3}$ لأن $\\dfrac{5}{3}$ عدد موجب و $\\left(\\dfrac{5}{3}\\right)^2 = \\dfrac{25}{9}$ .',
    '$\\sqrt{0{,}04} = 0{,}2$ لأن 0,2 عدد موجب و $(0{,}2)^2 = 0{,}04$ .',
    '$\\sqrt{7}$ هو العدد الموجب الذي مربعه 7.',
    '$\\sqrt{7}$ ليس عددا ناطقا، لأنه لا يوجد عدد ناطق مربعه 7.',
  ],
  properties: [
    '$a$ عدد موجب. $\\sqrt{a}$ هو العدد الموجب الذي مربعه $a$. أي $(\\sqrt{a})^2 = a$.',
    '$a$ عدد موجب. $\\sqrt{a^2}$ هو العدد الموجب الذي مربعه $a^2$. أي $\\sqrt{a^2} = a$.',
  ],
  propertyExamples: [
    '$(\\sqrt{5})^2 = 5$ ، $(\\sqrt{1{,}7})^2 = 1{,}7$ ، $\\left(\\sqrt{\\dfrac{1}{3}}\\right)^2 = \\dfrac{1}{3}$ .',
    '$\\sqrt{3^2} = 3$ ، $\\sqrt{21{,}6^2} = 21{,}6$ ، $\\left(\\sqrt{\\dfrac{4}{7}}\\right)^2 = \\dfrac{4}{7}$ .',
  ],
};

/** طرائق (p. 23) — « استعمال تعريف الجذر التربيعي لإنجاز حساب ». */
export const METHOD = {
  source: src('method-compute', 23, 'طرائق'),
  title: 'استعمال تعريف الجذر التربيعي لإنجاز حساب',
  exercise: 'احسب ما يلي: أ) $1 - 4b^2 + \\sqrt{16b^4}$ ($b$ عدد كيفي) ب) $\\sqrt{0{,}81} \\times \\sqrt{(-0{,}03)^2}$ جـ) $\\sqrt{(1 - \\sqrt{2})^2} + 1$',
  solution: [
    'أ) لدينا $\\sqrt{16b^4} = \\sqrt{(4b^2)^2} = 4b^2$ لأنّ $4b^2$ هو دائما عدد موجب. إذن $1 - 4b^2 + \\sqrt{16b^4} = 1 - 4b^2 + 4b^2 = 1$ .',
    'ب) لدينا $0{,}81 = 0{,}9^2$ و $(-0{,}03)^2 = (0{,}03)^2$ . إذن $\\sqrt{0{,}81} \\times \\sqrt{(-0{,}03)^2} = \\sqrt{0{,}9^2} \\times \\sqrt{0{,}03^2} = 0{,}9 \\times 0{,}03 = 0{,}027$ .',
    'جـ) لاحظ أنّ $\\sqrt{(1 - \\sqrt{2})^2}$ لا يساوي $1 - \\sqrt{2}$ لأنّ العدد $1 - \\sqrt{2}$ سالب. لدينا $1 - \\sqrt{2} = -(\\sqrt{2} - 1)$ و $(1 - \\sqrt{2})^2 = [-(\\sqrt{2} - 1)]^2$ . إذن $\\sqrt{(1 - \\sqrt{2})^2} = \\sqrt{(\\sqrt{2} - 1)^2} = \\sqrt{2} - 1$ لأنّ العدد $\\sqrt{2} - 1$ موجب. ونستنتج أنّ $\\sqrt{(1 - \\sqrt{2})^2} + 1 = (\\sqrt{2} - 1) + 1 = \\sqrt{2}$ .',
  ],
  asides: [
    '$\\sqrt{a^2} = a$ عندما $a \\geq 0$.',
    '$b^2 = (-b)^2$ من أجل كل عدد $b$.',
  ],
};

/** دوري الآن 1 (p. 23). */
export const NOW = {
  source: src('now-23-1', 23, 'دوري الآن', 1),
  text: 'احسب ما يلي: $\\sqrt{(3{,}301 - \\pi)^2} + \\sqrt{(3{,}141 - \\pi)^2}$ .',
};

/**
 * « أستعدّ » (p. 19), items 1, 2, 4 et 10 (extraction → destinations.prep.items) :
 * le carré d'un nombre, la touche √ de la calculatrice, la réciproque de Pythagore.
 */
export const PREP_ITEMS = [
  { n: 1, skill: 'murabba', text: 'مربع العدد 4 هو 8.', answer: false, why: '$4^2 = 4 \\times 4 = 16$' },
  { n: 2, skill: 'murabba', text: 'مربع العدد $-5$ هو $-25$.', answer: false, why: '$(-5)^2 = (-5) \\times (-5) = 25$' },
  { n: 4, skill: 'hasiba', text: 'إذا حجزنا على الآلة الحاسبة: $\\sqrt{\\;}$ 9، يظهر على الشاشة العدد 81.', answer: false, why: 'يظهر 3، لأن 3 هو العدد الموجب الذي مربعه 9.' },
  { n: 10, skill: 'fithaghuras', text: 'ABC مثلث حيث AB = 4cm ، AC = 3cm و BC = 5cm إذن المثلث ABC قائم في A.', answer: true, why: '$AB^2 + AC^2 = 16 + 9 = 25 = BC^2$، حسب الخاصية العكسية لفيثاغورس.' },
].map((it) => ({ ...it, source: src('prep', 19, 'أستعدّ', it.n) }));

/**
 * Deux ajouts de la plateforme, déclarés comme tels : les items du livre
 * attribués à cette leçon sont tous « faux » sauf un, et aucun ne demande de
 * CALCULER une hypoténuse (خاصية فيثاغورس directe, qu'exige la question 1 de
 * l'activité) ni le carré d'un décimal négatif. Nombres étrangers à l'activité.
 */
export const PREP_PLATFORM_ITEMS = [
  { n: 'a', skill: 'murabba', text: 'مربع العدد $-0{,}3$ هو $0{,}09$.', answer: true, why: '$(-0{,}3)^2 = (-0{,}3) \\times (-0{,}3) = 0{,}09$: جداء عددين سالبين عدد موجب.' },
  { n: 'b', skill: 'fithaghuras', text: 'EFG مثلث قائم في E حيث EF = 6cm و EG = 8cm إذن $FG^2 = 100$.', answer: true, why: 'حسب خاصية فيثاغورس: $FG^2 = EF^2 + EG^2 = 36 + 64 = 100$.' },
].map((it) => ({ ...it, source: addition('prerequisite_diagnostic') }));
