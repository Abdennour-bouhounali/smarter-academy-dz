/**
 * الدرس 3 — حل مشكلات بتوظيف جمل معادلتين من الدرجة الأولى بمجهولين
 * Unité 5 du manuel (4AM) : نشاط 3 p. 57 (le musée et le tableau des cinq étapes), le تحدّ et
 * أبو كامل (p. 55, dupliqués en module 2), exercices 14–21 (p. 61) et 24–28 (p. 63, أتعمّق),
 * أؤكّد تعلّماتي item 7 (p. 62, test final). Le manuel n'a pas d'item « أستعدّ » pour ce sujet :
 * module 0 fait d'affirmations de la plateforme.
 * Source de vérité : docs/sources/4am/unit5/extraction.json.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/mushkilat-jumla';

export const LESSON_CONFIG = {
  id: 'mushkilat-jumla',
  kind: 'lesson',
  unit: 'jumal-muadalatayn',
  unitTitle: 'جمل معادلتين من الدرجة الأولى بمجهولين',
  sequentialUnlock: true,
  title: 'حل مشكلات بتوظيف جمل معادلتين من الدرجة الأولى بمجهولين',
  description: 'ترييض وضعيات من الحياة اليومية ومسائل هندسية وعددية بجملة معادلتين: اختيار المجهولين المناسبين x و y، ترجمة معطيات النص إلى جملة معادلتين، حلها بطريقة جبرية مناسبة، ثم التحقق من النتائج وتفسيرها والإجابة عن سؤال المشكلة.',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🏟️',
  estimatedDurationMin: 57,
  textbookRef: { unit: 5, activity: 3, pages: '55, 57, 61, 62, 63' },
  skills: [
    'اختيار المجهولين المناسبين x و y: ما يسأل عنه السؤال',
    'ترجمة معطيات نص (أعداد، أثمان، أعمار، محيطات ومساحات، زوايا) إلى جملة معادلتين من الدرجة الأولى بمجهولين',
    'حل الجملة باختيار طريقة جبرية مناسبة (التعويض أو الجمع)',
    'التحقق من النتيجة في نص المشكلة نفسه وتفسيرها، ثم الإجابة عن السؤال بجملة',
  ],
  teachingScope: {
    include: [
      'نشاط 3 ص 57: المتحف وجدول مراحل الحل الخمس',
      'التحدّي ص 55 (القطع النقدية) ومسألة أبي كامل ص 55 بالمراحل الخمس',
      'التحقق في نص المشكلة: عدد الأشخاص أو القطع عدد طبيعي',
      'تمارين أوظّف تعلّماتي 14 ← 21 وأتعمّق 24 ← 28',
    ],
    exclude: [
      'تقنيات طريقتي التعويض والجمع (الدرس 2)',
      'مفهوم الجملة والتحقق من ثنائية وحالات الحلول (الدرس 1)',
      'الحل البياني لجملة معادلتين',
    ],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Les acquis que « أستعدّ » diagnostique : traduire une phrase en expression ou en équation
  // (unité 4, ترييض مشكلة), périmètres et aires, pourcentages, vérifier une ثنائية (leçon 1),
  // résoudre une jumla (leçon 2).
  priorKnowledge: ['tarjama-ibara', 'muhit-misaha', 'nisba-mia', 'tahaqquq-thunaiya', 'hall-jumla'],
  resources: [
    // Module 1 : نشاط 3. مبتدئ : un derby (plateforme), inconnues déjà nommées, petits nombres ;
    // متقدم : le musée du manuel — l'élève choisit lui-même les inconnues et chaque nombre.
    {
      kind: 'manipulation', code: 'story-modeller-derby-20', type: 'story-modeller', module: 1,
      level: 'beginner',
      title: 'تذاكر الديربي: 20 تذكرة و 4800 DA',
      objective: 'حل مشكلة بجملة معادلتين: نختار المجهولين، نترجم كل معلومة بمعادلة، نحل الجملة، نتحقق في القصة نفسها، ثم نجيب',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'stadium' },
      learningPointIds: ['4am_mushkilat-jumla_P1', '4am_mushkilat-jumla_P2'],
      sourceElementIds: ['act-3'],
    },
    {
      kind: 'manipulation', code: 'story-modeller-museum-140', type: 'story-modeller', module: 1,
      level: 'advanced',
      title: 'نشاط 3: المتحف — 140 زائرا و 30300 DA',
      objective: 'حل مشكلة بجملة معادلتين: نختار المجهولين، نترجم كل معلومة بمعادلة، نحل الجملة، نتحقق في القصة نفسها، ثم نجيب',
      autonomy: 'التلميذ يختار المجهولين بنفسه بين ما تذكره القصة (الأعداد المعطاة ترفض الحرف)، ويقرّر وحده أيّ عدد يذهب إلى أيّ خانة في كل معادلة، ثم يختار طريقة الحل ويعيد القصة بالعددين',
      experience: { type: 'textbook', reason: '', theme: 'museum' },
      learningPointIds: ['4am_mushkilat-jumla_P1', '4am_mushkilat-jumla_P2'],
      sourceElementIds: ['act-3'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'تسع عبارات: ترجمة جملة، المحيطات والمساحات، النسب المئوية، التحقق من ثنائية وحل جملة. صحيح أم خاطئ؟',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'mathaf', path: `${LESSON_BASE_PATH}/mathaf`,
      title: 'نشاط 3 — زوار المتحف', desc: 'من القصة إلى الجملة بيدك: اختر المجهولين، احمل أعداد القصة إلى المعادلتين، حلّ، ثم أعد القصة بالعددين. جدول الكتاب ص 57.',
      stage: 'trigger', teachesLearningPointIds: ['4am_mushkilat-jumla_P1', '4am_mushkilat-jumla_P2'],
      color: 'indigo', style: 'featured', estimatedMin: 15, difficulty: 2, actionText: 'أترجم القصة' },
    { id: '02', number: 2, slug: 'marahil', path: `${LESSON_BASE_PATH}/marahil`,
      title: 'المراحل الخمس — التحدّي وأبو كامل', desc: 'نطبّق المراحل الخمس على قطع القسم النقدية وعلى مسألة أبي كامل، ثم نرى حلا لا يجيب عن القصة.',
      stage: 'discovery', teachesLearningPointIds: ['4am_mushkilat-jumla_P1', '4am_mushkilat-jumla_P2'],
      color: 'violet', style: 'featured', estimatedMin: 12, difficulty: 3, actionText: 'أطبّق المراحل' },
    { id: '03', number: 3, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'تمارين الكتاب 14 ← 21 وأتعمّق 24 ← 28: أعداد ونسب، حقول ومستطيلات، زوايا وطالس، مزرعة وأعمار وأوزان وعلامات.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_mushkilat-jumla_P1', '4am_mushkilat-jumla_P2'],
      color: 'amber', style: 'featured', estimatedMin: 18, difficulty: 3, actionText: 'أتدرّب' },
    { id: '04', number: 4, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'خمسة أسئلة تُقيّم نقطتي التعلّم: الترجمة بجملة، ثم المراحل حتى الإجابة.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 6, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
