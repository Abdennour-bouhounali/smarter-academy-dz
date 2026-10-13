import { src, addition } from '../../_unit/unitMeta.js';

/**
 * « أستعدّ » (module 0) — le « أستعدّ » du manuel (p. 43, items 1–11) est
 * réparti entre les leçons 1 à 3 (extraction › destinations › prep) : la
 * synthèse n'en reçoit aucun. Ses affirmations sont donc des AFFIRMATIONS DE
 * LA PLATEFORME (SourceTag « عبارة إضافية من المنصّة »), dans la forme du
 * manuel, sur ce que la situation mobilise : résoudre une
 * équation (درس 1), le produit nul (درس 2), résoudre une inéquation et la
 * représenter (درس 3), traduire un texte (درس 4), développer / factoriser
 * (الوحدة 3). Jamais les nombres du مسبح (75, 560, 5).
 */
export const PREP_ITEMS = [
  { n: 1, skill: 'muadala', text: 'حل المعادلة $3x - 7 = 11$ هو 6.', answer: true, why: '$3 \\times 6 - 7 = 18 - 7 = 11$ : الحل الوحيد هو 6.', source: addition('prerequisite_diagnostic') },
  { n: 2, skill: 'muadala', text: 'حل المعادلة $5x + 2 = 2x - 4$ هو 2.', answer: false, why: '$5x - 2x = -4 - 2$ أي $3x = -6$ ، إذن $x = -2$ (ننقل الحد بتغيير إشارته).', source: addition('prerequisite_diagnostic') },
  { n: 3, skill: 'jidaa', text: 'المعادلة $(x + 4)(2x - 6) = 0$ تقبل حلين هما $-4$ و 3.', answer: true, why: 'جداء معدوم: $x + 4 = 0$ أو $2x - 6 = 0$ ، أي $x = -4$ أو $x = 3$.', source: addition('prerequisite_diagnostic') },
  { n: 4, skill: 'mutarajiha', text: 'حلول المتراجحة $-2x > 8$ هي الأعداد $x$ حيث $x > -4$.', answer: false, why: 'نقسم الطرفين على $-2$ ، وهو عدد سالب، فنغيّر اتجاه المتراجحة: $x < -4$.', source: addition('prerequisite_diagnostic') },
  { n: 5, skill: 'tamthil', text: 'لتمثيل حلول المتراجحة $x \\leq 5$ نلوّن بالأحمر الجزء الواقع على يسار العدد 5، والعدد 5 حل لها.', answer: true, why: 'الحلول هي الأعداد الأصغر من 5 أو المساوية له: الجزء على اليسار، و 5 منها لأنّ $5 \\leq 5$ صحيحة.', source: addition('prerequisite_diagnostic') },
  { n: 6, skill: 'tarrid', text: 'إذا كان ثمن كرّاس $x$ دينارًا، فإنّ ثمن 4 كراريس وقلم ثمنه 30 دينارًا هو $4(x + 30)$.', answer: false, why: 'القلم يُشترى مرّة واحدة: الثمن $4x + 30$ ، أمّا $4(x + 30)$ فثمن 4 كراريس و 4 أقلام.', source: addition('prerequisite_diagnostic') },
  { n: 7, skill: 'tahlil', text: '$(2x - 1)^2 - (2x - 1)(x + 3) = (2x - 1)(x - 4)$', answer: true, why: 'العامل المشترك $2x - 1$ : $(2x - 1)[(2x - 1) - (x + 3)] = (2x - 1)(x - 4)$.', source: addition('prerequisite_diagnostic') },
];

/**
 * « أدمج تعلّماتي » (p. 52) — la وضعية du مسبح البلدي, au mot près, et son
 * « تحليل الوضعية » en trois étapes NOMMÉES par le manuel (gardées telles
 * quelles, comme la synthèse de l'unité 3). La photographie du manuel est
 * redessinée (components/PoolScene.jsx), jamais reproduite.
 */
export const SITUATION = {
  source: src('situation', 52, 'أدمج تعلّماتي'),
  title: 'وضعية',
  text: 'لممارسة رياضة السباحة في المسبح البلدي، يقترح نادٍ رياضيٌّ على التلاميذ المتمدرسين صيغتين للاشتراك. الصيغة الأولى: الدفع الفوري 75 دينارًا لكل حصة. الصيغة الثانية: اشتراك سنوي قدره 560 دينارا ودفع فوري قدره 5 دنانير لكل حصة. ابتداءً من أي عدد للحصص تكون التسعيرة الثانية أفضل ؟',
  intro: 'لممارسة رياضة السباحة في المسبح البلدي، يقترح نادٍ رياضيٌّ على التلاميذ المتمدرسين صيغتين للاشتراك.',
  formula1: 'الصيغة الأولى: الدفع الفوري 75 دينارًا لكل حصة.',
  formula2: 'الصيغة الثانية: اشتراك سنوي قدره 560 دينارا ودفع فوري قدره 5 دنانير لكل حصة.',
  question: 'ابتداءً من أي عدد للحصص تكون التسعيرة الثانية أفضل ؟',
  figure: 'صورة مسبح مغطّى في الكتاب — ترسمه المنصّة.',
  caption: 'المسبح البلدي',
  analysis: [
    { label: 'قراءة الوضعية وفهمها', text: 'ترجمة كل صيغة بعبارة حرفية، لتحديد الصيغة الأفضل نقارن الصيغتين.' },
    { label: 'تحليل الوضعية واختيار استراتيجية حل مناسبة', text: 'يمكن التفكير في التجريب، كتابة متراجحة مناسبة وحلّها فيما بعد.' },
    { label: 'تنفيذ استراتيجية الحل', text: 'إجراء تجريب ، حل متراجحة ، ....، تفسير النتائج' },
  ],
  // Les nombres de la situation : la plateforme ne les retape nulle part ailleurs.
  numbers: { perSession1: 75, yearly: 560, perSession2: 5 },
};

/**
 * Le niveau مبتدئ du laboratoire (module 7) : une tarification de la PLATEFORME
 * (déclarée), même structure — un prix par séance contre un forfait + un petit
 * prix par séance — avec des nombres ronds et un croisement entier (x = 5).
 * Elle sert aussi l'étape « تفسير النتائج », pour que la réponse du manuel
 * (9 séances) reste celle de « أحلّ الوضعية ».
 */
export const WARMUP = {
  source: addition('interaction_generation'),
  text: 'مسبح الحيّ، حرصًا على النظافة وعلى احترام مواعيد الحصص، يقترح صيغتين: الصيغة (أ) الدفع الفوري 50 دينارًا لكل حصة؛ الصيغة (ب) اشتراك سنوي قدره 200 دينار ودفع فوري قدره 10 دنانير لكل حصة.',
  left: '50x',
  right: '200+10x',
  numbers: { perSessionA: 50, fixedB: 200, perSessionB: 10 },
};

/**
 * Les props du laboratoire growth-race du module 7, à ses DEUX niveaux (contrat
 * des props : manipulations/equations/GrowthRace.jsx). Écrites ici une fois :
 * le module les étale, le test de rendu (wadiyaMuadalat.render.test.jsx) rend
 * le laboratoire avec exactement ces props. `goal: 'greater'` : la question est
 * « quand la formule 1 coûte-t-elle PLUS que la formule 2 ? », c'est-à-dire
 * quand la formule 2 est meilleure.
 */
export const LAB = {
  beginner: { left: WARMUP.left, right: WARMUP.right, theme: 'pool', domain: 'natural', goal: 'greater', maxX: 10, context: { leftTitle: 'الصيغة (أ)', rightTitle: 'الصيغة (ب)' } },
  advanced: { left: '75x', right: '560+5x', theme: 'pool', domain: 'natural', goal: 'greater', maxX: 16, context: { leftTitle: 'الصيغة الأولى', rightTitle: 'الصيغة الثانية' } },
};

/**
 * Les corrections du module 7 — importées aussi par la carte (knowledgeGraph.js) :
 * une aide de la carte cite la leçon mot pour mot. Toute égalité dans `$…$`.
 */
export const REMARKS = {
  tarjamaWrong: 'نكتب تكلفة الصيغة الثانية $(560 + 5)x$ : نضرب الاشتراك أيضًا في عدد الحصص.',
  tarjamaWhy: 'الاشتراك السنوي يُدفع مرّة واحدة مهما كان عدد الحصص؛ وحده الدفع الفوري يتكرّر مع كل حصة.',
  tarjamaRight: 'تكلفة الصيغة الثانية من أجل $x$ حصة: $560 + 5x$ ، وتكلفة الصيغة الأولى $75x$.',
  tajrib: 'التجريب: نحسب تكلفة الصيغتين من أجل عدة أعداد للحصص، فنرى متى تصبح الصيغة الثانية أقل تكلفة.',
  mufadala: 'الصيغة الثانية أفضل تعني أنّ تكلفتها أقل: $560 + 5x < 75x$.',
  tasawiWrong: 'من $x > 5$ نستنتج أنّ الصيغة (ب) تصبح أفضل ابتداءً من 5 حصص.',
  tasawiWhy: 'من أجل 5 حصص تتساوى التكلفتان، و 5 لا يحقّق $x > 5$ : لا تكون الصيغة (ب) أفضل.',
  tasawiRight: 'عدد الحصص عدد طبيعي: أصغر عدد طبيعي يحقّق $x > 5$ هو 6.',
  notSolvedHere: 'الحل الكامل للمسبح في «أحلّ الوضعية»: هنا قرأنا الوضعية، ترجمنا الصيغتين، جرّبنا وكتبنا المتراجحة.',
};

/** Les lignes du tableau d'essais (étape « التجريب ») : quelques nombres de séances, choisis par la plateforme. */
export const TRIAL_ROWS = [2, 6, 10, 12];
