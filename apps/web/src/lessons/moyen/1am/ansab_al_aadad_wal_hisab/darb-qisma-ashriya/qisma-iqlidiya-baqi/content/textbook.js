/**
 * Le contenu du MANUEL pour le درس « القسمة الإقليدية » (1AM, unité 3) — données pures, au mot près, chaque bloc cite
 * son élément de docs/sources/1am/unit3/extraction.json. Les modules rendent ces données ; ils n'en réécrivent aucune.
 */
import { src, addition } from '../../_unit/unitMeta.js';

/** نشاط 3 (p. 37) — 279 fleurs, des bouquets de 14. */
export const ACTIVITY = {
  source: src('act-3', 37, 'اكتشف', 3),
  title: 'القسمة الإقليدية',
  situation: 'لدى بائع زهور 279 زهرة، يريد تشكيل باقات، تحتوي كل باقة على 14 زهرة .',
  questions: [
    'أ) هل يمكن للبائع تشكيل 10 باقات؟ 20 باقة؟',
    'ب) أتمم الحصر الآتي بعددين طبيعيين متتاليين: $14 \\times \\ldots < 279 < 14 \\times \\ldots$',
    'ج) استنتج أكبر عدد ممكن من الباقات يمكن تشكيله. هل تبقّى زهورٌ؟ إذا كان الجواب بنعم، كم عددها؟',
    'د) يُصرّح زميلك يونس قائلا: « بإمكاني الإجابة عن الأسئلة الواردة في السؤال ج) بإجراء عملية قسمة عمودية » هل توافقه ؟ اشرح.',
    'هـ) أتمم المساواة $279 = 14 \\times \\ldots + \\ldots$',
  ],
  numbers: { a: 279, b: 14 },
};

/**
 * LE CONTEXTE « بطاقات التهنئة » — l'expérience de la plateforme au niveau مبتدئ (lab `division-jumps`, monde `flowers`,
 * thème `garden`), jamais le manuel. La MATHÉMATIQUE est celle de نشاط 3 (le plus grand nombre de bouquets, le reste) ;
 * seuls les nombres sont plus petits, pour que chaque fleur soit dessinée et comptée.
 */
export const FLOWERS = {
  source: addition('interaction_generation'),
  situation: 'لعيد المعلّم، جمع تلاميذ النادي الأخضر 47 زهرة من حديقة المتوسطة، عرفانًا لأساتذتهم. يريدون تشكيل باقات، في كل باقة 6 زهرات.',
  question: 'اسحب الشريط على صفّ الزهور: كم باقة كاملة تستطيع أن تربط؟ ومتى تتوقّف؟',
  numbers: { a: 47, b: 6, then: 48 },
};

/** معارف 2 (p. 41) — la définition, la disposition, deux exemples, la remarque de la droite graduée. */
export const KNOWLEDGE = {
  source: src('know-2', 41, 'أوظّف تعلّماتي', 2),
  definition: 'القسمة الإقليدية لعدد طبيعي (يُسمّى المقسوم) على عدد طبيعي غير معدوم (يُسمّى المقسوم عليه)، تعني إيجاد عددين طبيعيين، يُسمّيان الحاصل والباقي ويُحقّقان: المقسوم = المقسوم عليه × الحاصل + الباقي ، الباقي أصغر من المقسوم عليه.',
  example1: {
    text: 'لدى صانع مجوهرات 253 لؤلؤة، يريد استعمالها لصنع عقود، يتضمن كل عِقدٍ 17 لؤلؤة. فعليه أن يبحث : كم يتضمن العدد 253 من مرّة 17 .',
    equality: '$253 = 17 \\times 14 + 15$',
    conclusion: 'يُمكن للصانع صنع 14 عقدا، ويتبقى معه 15 لؤلؤة.',
    numbers: { a: 253, b: 17, q: 14, r: 15 },
  },
  example2: {
    equality: '$60 = 4 \\times 15$',
    text: 'المساواة $60 = 4 \\times 15$ تعني باقي قسمة العدد 60 على 4 هو 0. في هذه الحالة نقول إنّ : 60 مضاعف للعدد 4 أو 60 يقبل القسمة على 4 أو 4 قاسم لـ 60.',
  },
  remark: 'إيجاد حاصل القسمة الإقليدية للعدد 253 على 17، يعني البحث عن العدد الطبيعي الذي نضربه في 17 لنقترب قدر الإمكان من 253 بقيم أقل، والتباعد عن 253 يُمثّل باقي القسمة .',
  // La disposition du manuel (253 | 17) : chaque ligne de l'opération posée, dans l'ordre où le manuel l'écrit.
  layout: [
    'نبدأ بـ 25 (أوّل رقمين من 253): كم مرّة 17 في 25؟ مرّة واحدة. نكتب 1 في الحاصل.',
    '$25 - 17 = 8$ ، ثم ننزل الرقم 3 : نحصل على 83.',
    'كم مرّة 17 في 83؟ $17 \\times 4 = 68$ و $17 \\times 5 = 85$ أكبر من 83 : 4 مرّات. نكتب 4 في الحاصل.',
    '$83 - 68 = 15$ و $15 < 17$ : نتوقّف. الحاصل 14 والباقي 15 ، أي $253 = 17 \\times 14 + 15$.',
  ],
};

/** « أستعدّ » — استحضر مكتسباتي (p. 36), item 8 (les autres items vont aux autres leçons de l'unité). */
export const PREP_ITEMS = [
  { n: 8, skill: 'qisma', text: 'أكبر عدد من باقات الزهور الذي يُمكن تشكيله باستخدام 2016 زهرة، علما أنّ كل باقة تتكوّن من 9 أزهار، هو 224.', answer: true, why: '$9 \\times 224 = 2016$ : تُستعمل كل الأزهار في 224 باقة.' },
].map((it) => ({ ...it, source: src('prep', 36, 'استحضر مكتسباتي', it.n) }));

/**
 * Les items de la PLATEFORME : le réseau dit que la leçon s'appuie sur `1am.m1.r01` (جمع، طرح وضرب أعداد طبيعية في
 * وضعيات معطاة — leçon « معنى الجمع والطرح »), que « أستعدّ » doit mesurer (LEARNING_NET.md §4.4).
 */
export const PREP_PLATFORM_ITEMS = [
  { skill: 'darb', text: '$14 \\times 20 = 280$', answer: true, why: '$14 \\times 2 = 28$ ، ثم نضرب في 10 : $280$.' },
  { skill: 'darb', text: 'في صندوق 8 علب، وفي كل علبة 6 أقلام. عدد الأقلام في الصندوق هو $8 + 6 = 14$.', answer: false, why: 'نكرّر 6 أقلام 8 مرّات: $8 \\times 6 = 48$ قلمًا.' },
  { skill: 'tarh', text: '$279 - 266 = 23$', answer: false, why: '$279 - 266 = 13$ : نطرح الآحاد $9 - 6 = 3$ ثم العشرات $7 - 6 = 1$.' },
].map((it) => ({ ...it, source: addition('prerequisite_diagnostic') }));

/** استعمل تكنولوجيات الإعلام والاتصال (p. 50) — la calculatrice. */
export const ICT = {
  source: src('ict', 50, 'استعمل تكنولوجيات الإعلام والاتصال'),
  text: 'احجز على آلتك الحاسبة $235 \\div 12 =$ : يظهر على الشاشة 19,58333333. ماذا يُمثّل العدد 19 بالنسبة إلى العددين 235 و 12؟ احسب $19 \\times 12$، ثمّ اطرح الناتج من العدد 235.',
  screen: '19,58333333',
  numbers: { a: 235, b: 12, q: 19, r: 7 },
};

/**
 * Les phrases de correction partagées par les modules ET la carte (knowledgeGraph.js les cite mot pour mot).
 */
export const GUIDE = {
  stop: {
    wrong: 'نتوقّف عن تشكيل الباقات عندما لا يبقى أيّ زهرة.',
    why: 'مع 279 زهرة وباقات من 14 لا يمكن أبدًا أن لا يبقى شيء: بعد 19 باقة تبقى 13 زهرة، وهي لا تكفي لباقة أخرى.',
    right: 'نتوقّف عندما يصبح الباقي أصغر من المقسوم عليه: $13 < 14$.',
  },
  remainder: 'الباقي أصغر دائمًا من المقسوم عليه، وإلّا أمكن تشكيل مجموعة أخرى.',
};
