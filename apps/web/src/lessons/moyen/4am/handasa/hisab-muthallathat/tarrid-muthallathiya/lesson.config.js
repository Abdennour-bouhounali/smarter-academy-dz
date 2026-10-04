/**
 * الدرس 4 — حل مشكلات وترييض وضعيات بتوظيف النسب المثلثية (unité 10 « حساب المثلثات في المثلث القائم », manuel
 * pp. 115–125). La leçon n'a PAS d'activité du manuel : son entrée est le تحدّ de la page d'unité (p. 115, DOUBLON
 * DÉCLARÉ — extraction › destinations › challenge › duplicatedIn, comme la leçon 4 de l'unité 8), posé sur le
 * laboratoire `clinometer` ; ses éléments du manuel sont les exercices 13 (p. 123) et 24 à 29 (p. 125 « أتعمّق »). La
 * connaissance qu'elle formalise (les étapes de la modélisation, la résolution complète du triangle rectangle) est une
 * ADDITION DÉCLARÉE de la plateforme (`knowledge_formalization`, « معارف من المنصّة »).
 *
 * Le parcours (REAL → DISCOVER → MANIPULATE → UNDERSTAND → TOUCH → FORMALIZE → AUTOMATIZE → TRANSFER) :
 *   0 أستعدّ                  diagnostic : a/x = b et x/a = b, les angles aigus d'un triangle rectangle, vertical ⟂
 *                             horizontal, les définitions de la leçon 1, la calculatrice (leçon 2), Pythagore
 *   1 التحدّ (trigger)         REAL (l'échelle des graffeurs, le projecteur du stade) → MANIPULATE (le clinomètre du
 *                             téléphone : viser, allonger l'échelle, choisir le rapport) → UNDERSTAND (lire la figure,
 *                             choisir sin, diviser, arrondir à la fin : L ≈ 1,9 m)
 *   2 طرائق من المنصّة (discovery) TOUCH → FORMALIZE : ex-26 résolu ligne à ligne (l'arrondi précoce change le résultat),
 *                             ex-27 résolu par l'élève (le triangle entier), un angle à partir de deux côtés
 *   3 أوظّف تعلّماتي (practice_lab) AUTOMATIZE → TRANSFER : تمارين 29, 24, 25, 28, 13
 *   4 إختبار أولي (evaluation)
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/handasa/tarrid-muthallathiya';

export const LESSON_CONFIG = {
  id: 'tarrid-muthallathiya',
  kind: 'lesson',
  unit: 'hisab-muthallathat',
  unitTitle: 'حساب المثلثات في المثلث القائم',
  sequentialUnlock: true,
  title: 'حل مشكلات وترييض وضعيات بتوظيف النسب المثلثية',
  description: 'ارتفاعات لا نصل إليها، زوايا نظر، ومسافات أفقية وعمودية: نترجم الوضعية إلى مثلث قائم، نختار النسبة المناسبة للمعطيات (أو خاصية فيثاغورس) ونحلّ المثلث القائم كاملا.',
  level: 'moyen',
  grade: '4am',
  chapter: 'handasa',
  chapterTitle: 'ميدان الهندسة',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '📱',
  estimatedDurationMin: 55,
  textbookRef: { unit: 10, activity: 0, pages: '115, 123, 125' },
  skills: [
    'ترجمة وضعية واقعية (ارتفاع لا نصل إليه، زاوية نظر، سلّم مستند إلى جدار) إلى مثلث قائم',
    'اختيار النسبة المثلثية التي تربط الضلع المعلوم بالضلع المطلوب (أو بالزاوية) ثم الضرب أو القسمة',
    'حل المثلث القائم كاملا بخاصية فيثاغورس والنسب المثلثية والزاوية المتممة، والتدوير في النهاية فقط',
  ],
  teachingScope: {
    include: [
      'تحدّ الوحدة: طول السلّم (ص 115)',
      'خطوات ترييض وضعية بالنسب المثلثية (معارف من المنصّة)',
      'التمرينان 26 و 27 (ص 125): طرق متعددة لحساب ضلع وأثر التدوير المبكر',
      'التمارين 13 (ص 123) و 24 و 25 و 28 و 29 (ص 125)',
    ],
    exclude: [
      'تعريف النسب المثلثية (الدرس 1) واستعمال الحاسبة (الدرس 2)، إلا تذكيرًا',
      'العلاقات بين النسب والإنشاءات (الدرس 3)',
      'وضعية مقام الشهيد (أدمج تعلّماتي)',
    ],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Les acquis que « أستعدّ » diagnostique (années précédentes et leçons 1–2 de l'unité).
  priorKnowledge: ['muadala-majhul-maqam', 'muadala-majhul-bast', 'zawiyatan-hadatan', 'shaquli-ufuqi', 'tarif-nisab', 'hasiba', 'fithaghuris'],
  resources: [
    // Module 1 : l'entrée (pas d'activité du manuel). مبتدئ : le projecteur du stade (24 m caché, distance 10…40 m) — le
    // plan h = d × tan α ; متقدم (défaut) : le تحدّ, l'échelle des graffeurs (1,60 m, 59°) — le وتر par sin et une division.
    {
      kind: 'manipulation', code: 'clinometer-floodlight-24', type: 'clinometer', module: 1,
      level: 'beginner',
      title: 'كشّاف الملعب: ارتفاع من مسافتين',
      objective: 'ترييض وضعية بمثلث قائم واختيار النسبة المثلثية التي تربط الطول المعلوم بالطول المجهول، ثم الحساب والتدوير في النهاية',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'improved_interactivity_and_age_appropriateness', theme: 'floodlight' },
      learningPointIds: ['4am_tarrid-muthallathiya_P1', '4am_tarrid-muthallathiya_P2'],
      sourceElementIds: ['challenge'],
    },
    {
      kind: 'manipulation', code: 'clinometer-ladder-160-59', type: 'clinometer', module: 1,
      level: 'advanced',
      title: 'تحدّ الوحدة: سلّم على جدار، 1,60 متر و 59 درجة',
      objective: 'ترييض وضعية بمثلث قائم واختيار النسبة المثلثية التي تربط الطول المعلوم بالطول المجهول، ثم الحساب والتدوير في النهاية',
      autonomy: 'الشكل دون أسماء الأضلاع: التلميذ يحدّد بنفسه أن الارتفاع مقابل للزاوية وأن السلّم هو الوتر، ويحصر طول السلّم بيده بين طولين قبل أن يحسبه، ثم يختار النسبة والعملية (القسمة)',
      experience: { type: 'textbook', reason: '', theme: 'mural' },
      learningPointIds: ['4am_tarrid-muthallathiya_P1', '4am_tarrid-muthallathiya_P2'],
      sourceElementIds: ['challenge'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'سبع عبارات: معادلة مجهولها في المقام أو في البسط، زاويتان حادتان، الشاقولي والأفقي، النسب المثلثية، الحاسبة، فيثاغورس. صحيح أم خاطئ؟',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'at-tahaddi', path: `${LESSON_BASE_PATH}/at-tahaddi`,
      title: 'التحدّ — سلّم الجدارية', desc: 'بهاتفك ومقياس الميل: سدّد إلى كشّاف الملعب، وأطِل سلّم الرسّامين حتى العلامة، ثم اختر النسبة المثلثية واحسب طول السلّم إلى الجزء من 10.',
      stage: 'trigger', teachesLearningPointIds: ['4am_tarrid-muthallathiya_P1', '4am_tarrid-muthallathiya_P2'],
      color: 'indigo', style: 'featured', estimatedMin: 14, difficulty: 2, actionText: 'أحمل الهاتف' },
    { id: '02', number: 2, slug: 'taraiq', path: `${LESSON_BASE_PATH}/taraiq`,
      title: 'طرائق — من الوضعية إلى المثلث القائم', desc: 'خطوات الترييض، التمرين 26 محلولا سطرا سطرا (التدوير المبكر يغيّر النتيجة)، التمرين 27 تحلّه بنفسك، وزاوية من ضلعين.',
      stage: 'discovery', teachesLearningPointIds: ['4am_tarrid-muthallathiya_P1', '4am_tarrid-muthallathiya_P2', '4am_tarrid-muthallathiya_P3'],
      color: 'emerald', style: 'featured', estimatedMin: 14, difficulty: 3, actionText: 'أرسم وأختار' },
    { id: '03', number: 3, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'تمارين الكتاب 29 (النخلة) و 24 و 25 و 28 (ص 125) و 13 (ص 123).',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_tarrid-muthallathiya_P1', '4am_tarrid-muthallathiya_P2', '4am_tarrid-muthallathiya_P3'],
      color: 'amber', style: 'featured', estimatedMin: 14, difficulty: 3, actionText: 'أتدرّب' },
    { id: '04', number: 4, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'خمسة أسئلة تُقيّم نقاط التعلّم الثلاث: ترييض وضعية، اختيار النسبة، حل المثلث القائم.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 7, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
