/**
 * الدرس 4 — ترييض مشكلة
 * Unité 4 du manuel (4AM) : طرائق p. 49 (« ترييض مشكلة » : le père de 36 ans et ses
 * trois enfants, دوري الآن 2), exercices 10–13 (p. 50), 30 et 33 (p. 51), 37–40
 * (p. 53, أتعمّق). Le manuel n'a ni نشاط ni « أستعدّ » pour ce sujet : le laboratoire
 * est l'entrée de la PLATEFORME dans la طريقة, déclarée (`platform_adaptation`) ;
 * « أستعدّ » est fait d'affirmations de la plateforme.
 * Source de vérité : docs/sources/4am/unit4/extraction.json.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/tarrid-mushkila';

export const LESSON_CONFIG = {
  id: 'tarrid-mushkila',
  kind: 'lesson',
  unit: 'muadalat-mutarajihat',
  unitTitle: 'معادلات ومتراجحات من الدرجة الأولى بمجهول واحد',
  sequentialUnlock: true,
  title: 'ترييض مشكلة',
  description: 'حل مشكلات بتوظيف المعادلات والمتراجحات: اختيار المجهول المناسب، ترجمة نص المشكلة إلى معادلة أو متراجحة من الدرجة الأولى بمجهول واحد، حلها، ثم تفسير النتائج والتأكد من ملاءمتها للواقع.',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🧩',
  estimatedDurationMin: 53,
  textbookRef: { unit: 4, activity: null, pages: '49, 50, 51, 53' },
  skills: [
    'اختيار المجهول المناسب وتسميته x',
    'ترجمة نص مشكلة (أعمار، أعداد، محيطات، مساحات، تكاليف) إلى معادلة أو متراجحة من الدرجة الأولى بمجهول واحد',
    'حل المعادلة أو المتراجحة المحصل عليها',
    'التحقق من الحل وتفسيره والتأكد من ملاءمته للواقع',
  ],
  teachingScope: {
    include: [
      'طريقة الكتاب ص 49: نسمّي x، نعبّر بالمعادلة، نحلّ، نتحقّق',
      'نمذجة وضعية بمتراجحة (دوري الآن 2 ص 49: المربع والمثلث المتقايس الأضلاع)',
      'التأكد من ملاءمة الحل للواقع: عدد طبيعي، طول موجب، حل مرفوض',
      'تمارين أوظّف تعلّماتي 10 ← 13، 30، 33 وأتعمّق 37 ← 40',
    ],
    exclude: [
      'تقنيات حل المعادلة من الدرجة الأولى (الدرس 1)',
      'خاصية الجداء المعدوم (الدرس 2)',
      'تقنيات حل المتراجحة وتمثيل حلولها (الدرس 3)',
    ],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Les acquis que « أستعدّ » diagnostique (prérequis du propriétaire) : résoudre une
  // équation du premier degré (leçon 1), une équation produit nul (leçon 2), une
  // inéquation (leçon 3), les formules de périmètre/aire, les coûts et pourcentages.
  priorKnowledge: ['hal-muadala', 'jidaa-maadum', 'hal-mutarajiha', 'muhit-misaha', 'taklifa-nisba'],
  resources: [
    // Module 1 : PAS d'activité du manuel (la leçon est une page de طرائق) — le
    // laboratoire est l'entrée de la plateforme dans la طريقة « ترييض مشكلة ».
    // مبتدئ : deux personnes, un « + x » chacune ; متقدم : l'exercice du manuel
    // (le père de 36 ans et trois enfants : trois « + x » à porter).
    {
      kind: 'manipulation', code: 'growth-race-30-6', type: 'growth-race', module: 1,
      level: 'beginner',
      title: 'أب عمره 30 سنة وابنه 6 سنوات: متى يكون عمر الأب ضعف عمر ابنه؟',
      objective: 'ترييض مشكلة: نسمّي x، كل ما يتغيّر مع x يحمل x، فالمعادلة لحظة تساوي الطرفين — ثم نحلّ ونتحقّق',
      autonomy: '',
      experience: { type: 'platform_adaptation', reason: 'smaller_numbers_for_first_contact', theme: 'family' },
      learningPointIds: ['4am_tarrid-mushkila_P1', '4am_tarrid-mushkila_P2'],
      sourceElementIds: ['method-modelling'],
    },
    {
      kind: 'manipulation', code: 'growth-race-36-4-6-8', type: 'growth-race', module: 1,
      level: 'advanced',
      title: 'أب عمره 36 سنة وأبناؤه 4 و 6 و 8: مثال الكتاب',
      objective: 'ترييض مشكلة: نسمّي x، كل ما يتغيّر مع x يحمل x، فالمعادلة لحظة تساوي الطرفين — ثم نحلّ ونتحقّق',
      autonomy: 'ثلاثة أبناء دون أي اقتراح: التلميذ يقرّر وحده أنّ كل واحد منهم يحمل «+ x» (المجموع يزيد بـ 3x لا بـ x)، ثم يجد بنفسه لحظة التساوي ويتحقّق منها بقيمة قبلها وقيمة بعدها',
      experience: { type: 'platform_adaptation', reason: 'improved_interactivity_and_age_appropriateness', theme: 'family' },
      learningPointIds: ['4am_tarrid-mushkila_P1', '4am_tarrid-mushkila_P2'],
      sourceElementIds: ['method-modelling'],
    },
    // Module 2 : le même instrument, un seul niveau, sur une question dont la
    // solution est NÉGATIVE (« ثلاثة أضعاف » : 36 + x = 3(14 + x) ⇔ x = −3) — la
    // solution ne convient pas à l'histoire (P2).
    {
      kind: 'manipulation', code: 'growth-race-36-14', type: 'growth-race', module: 2,
      title: 'أب عمره 36 سنة وابنه 14 سنة: متى يكون عمره ثلاثة أضعاف عمر ابنه؟',
      learningPointIds: ['4am_tarrid-mushkila_P2'],
      sourceElementIds: ['method-modelling'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'تسع عبارات: حل معادلة ومعادلة جداء معدوم، حل متراجحة، المحيطات والمساحات، والتكاليف والنسب. صحيح أم خاطئ؟',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'sibaq', path: `${LESSON_BASE_PATH}/sibaq`,
      title: 'سباق الأعمار — من النص إلى المعادلة', desc: 'ضع «+ x» على كل من يكبر، ثم مدّد الزمن: متى يتساوى عمر الأب ومجموع أعمار أبنائه؟ مثال الكتاب ص 49.',
      stage: 'trigger', teachesLearningPointIds: ['4am_tarrid-mushkila_P1', '4am_tarrid-mushkila_P2'],
      color: 'indigo', style: 'featured', estimatedMin: 13, difficulty: 2, actionText: 'أبني النموذج' },
    { id: '02', number: 2, slug: 'tarayiq', path: `${LESSON_BASE_PATH}/tarayiq`,
      title: 'طرائق — ترييض مشكلة', desc: 'خطوات الكتاب الأربع سطرًا سطرًا، ثم دوري الآن 2 (المربع والمثلث) وحلّ لا يلائم الواقع.',
      stage: 'discovery', teachesLearningPointIds: ['4am_tarrid-mushkila_P1', '4am_tarrid-mushkila_P2'],
      color: 'violet', style: 'featured', estimatedMin: 13, difficulty: 3, actionText: 'أتعلّم الطريقة' },
    { id: '03', number: 3, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'تمارين الكتاب 10، 11، 12، 13، 30، 33 وأتعمّق 37، 38، 39، 40: أعداد، أعمار، سدّ، محيطات ومساحات.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_tarrid-mushkila_P1', '4am_tarrid-mushkila_P2'],
      color: 'amber', style: 'featured', estimatedMin: 15, difficulty: 3, actionText: 'أتدرّب' },
    { id: '04', number: 4, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'خمسة أسئلة تُقيّم نقطتي التعلّم: الترييض، ثم الحل والتفسير.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 6, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
