/**
 * أدمج تعلّماتي — الوحدة 4 « معادلات ومتراجحات من الدرجة الأولى بمجهول واحد » (kind: synthesis)
 * Manuel 4AM, unité 4 : « أؤكّد تعلّماتي » (QCM 1–9, p. 52), « أدمج تعلّماتي »
 * (وضعية المسبح البلدي + تحليل الوضعية, p. 52) et « أتعمّق » (ex. 34, 35, 36,
 * 41, 42, p. 53) — extraction.json › destinations.
 * Ce n'est PAS un cinquième درس : c'est la synthèse de l'unité, affichée après les quatre leçons.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/wadiya-idmajiya-muadalat';

export const LESSON_CONFIG = {
  id: 'wadiya-idmajiya-muadalat',
  kind: 'synthesis',
  unit: 'muadalat-mutarajihat',
  unitTitle: 'معادلات ومتراجحات من الدرجة الأولى بمجهول واحد',
  sequentialUnlock: true,
  title: 'أدمج تعلّماتي — المعادلات والمتراجحات',
  description: 'وضعية المسبح البلدي: صيغتان للاشتراك (75 دينارًا للحصة، أو 560 دينارًا سنويًا و 5 دنانير للحصة) نترجمهما بعبارتين حرفيتين ونقارنهما بمتراجحة؛ يسبقها اختبار «أؤكّد تعلّماتي» الذي يعيد كل سؤال إلى درسه، ثم تمارين «أتعمّق».',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🏊',
  estimatedDurationMin: 52,
  textbookRef: { unit: 4, pages: '52, 53' },
  skills: [
    'تجنيد مكتسبات الوحدة (المعادلات، الجداء المعدوم، المتراجحات وتمثيل حلولها) لحل وضعيات مركبة وتنافسية',
    'ترجمة صيغ تسعير أو اشتراك بعبارات حرفية بدلالة عدد الحصص',
    'كتابة متراجحة للمفاضلة بين خيارين، حلها، وتفسير النتيجة للوصول إلى الخيار الأفضل',
  ],
  teachingScope: {
    include: ['أؤكّد تعلّماتي: 9 أسئلة', 'أدمج تعلّماتي: الوضعية وتحليلها في ثلاث مراحل', 'أتعمّق: التمارين 34 و 35 و 36 و 41 و 42'],
    exclude: ['أي مفهوم جديد', 'المتراجحات من الدرجة الثانية (الحدود $x^2$ تختفي من الطرفين في كل تمارين الكتاب)'],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Ce que la situation et « أتعمّق » mobilisent, diagnostiqué par « أستعدّ » (affirmations de la
  // plateforme : les items du manuel sont ceux des leçons 1–3) : résoudre une équation (درس 1), le produit
  // nul (درس 2), résoudre une inéquation (درس 3) et la représenter (درس 3), traduire un texte (درس 4),
  // développer / factoriser (الوحدة 3).
  priorKnowledge: ['hall-muadala', 'jidaa-maadum-khassiya', 'hall-mutarajiha', 'tamthil-hulul', 'tarrid-tarjama', 'nashr-tahlil'],
  resources: [
    { kind: 'situation', code: 'situation-masbah-baladi', module: 1, title: 'وضعية: المسبح البلدي', learningPointIds: ['4am_wadiya-idmajiya-muadalat_P2', '4am_wadiya-idmajiya-muadalat_P1'], sourceElementIds: ['situation'] },
    // Module 1 — la course des deux formules (growth-race, réutilisé de « ترييض مشكلة ») :
    // l'élève CONSTRUIT chaque formule en portant « × x » sur ce qui se paie à chaque séance,
    // puis ÉTIRE x (le nombre de séances) et voit les deux coûts se rejoindre puis se dépasser.
    {
      kind: 'manipulation', code: 'growth-race-masbah-hayy', type: 'growth-race', module: 1, level: 'beginner',
      title: 'مسبح الحيّ: 50x أم 200 + 10x؟',
      objective: 'المفاضلة بين صيغتين: نترجم كل صيغة بعبارة حرفية بدلالة عدد الحصص x، ونبحث عن الأعداد x التي تجعل إحداهما أقل تكلفة',
      autonomy: '',
      experience: { type: 'platform_adaptation', reason: 'smaller_numbers_for_first_contact', theme: 'pool' },
      learningPointIds: ['4am_wadiya-idmajiya-muadalat_P2'],
      sourceElementIds: ['situation'],
    },
    {
      kind: 'manipulation', code: 'growth-race-masbah-baladi', type: 'growth-race', module: 1, level: 'advanced',
      title: 'المسبح البلدي: 75x أم 560 + 5x؟',
      objective: 'المفاضلة بين صيغتين: نترجم كل صيغة بعبارة حرفية بدلالة عدد الحصص x، ونبحث عن الأعداد x التي تجعل إحداهما أقل تكلفة',
      autonomy: 'أرقام الكتاب كما هي: لا يلتقي الثمنان إلا بعد ثماني حصص، فيختار التلميذ بنفسه مدى التجريب ويقرّر متى تكفي محاولاته قبل لحظة التساوي وبعدها',
      experience: { type: 'textbook', reason: '', theme: 'pool' },
      learningPointIds: ['4am_wadiya-idmajiya-muadalat_P2', '4am_wadiya-idmajiya-muadalat_P1'],
      sourceElementIds: ['situation'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'سبع عبارات: صحيح أم خاطئ؟ المعادلة، الجداء المعدوم، المتراجحة وتمثيل حلولها، الترجمة، والتحليل.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'al-wadiya', path: `${LESSON_BASE_PATH}/al-wadiya`,
      title: 'الوضعية وتحليلها', desc: 'المسبح البلدي: ابنِ عبارتي الصيغتين، مدّد عدد الحصص في السباق، واكتب المتراجحة التي تقارن بينهما.',
      stage: 'trigger', teachesLearningPointIds: ['4am_wadiya-idmajiya-muadalat_P2', '4am_wadiya-idmajiya-muadalat_P1'],
      color: 'amber', style: 'featured', estimatedMin: 16, difficulty: 3, actionText: 'أقرأ الوضعية' },
    { id: '02', number: 2, slug: 'uakkid', path: `${LESSON_BASE_PATH}/uakkid`,
      title: 'أؤكّد تعلّماتي', desc: 'تسعة أسئلة من الكتاب؛ عند الحاجة أعود إلى الدرس.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_wadiya-idmajiya-muadalat_P1'], color: 'sky', style: 'featured', estimatedMin: 10, difficulty: 2, actionText: 'أؤكّد' },
    { id: '03', number: 3, slug: 'atamaqq', path: `${LESSON_BASE_PATH}/atamaqq`,
      title: 'أتعمّق', desc: 'نشر وتحليل، جداء معدوم ومتراجحات: التمارين 34 و 35 و 36 و 41 (شهادة التعليم المتوسط) و 42.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_wadiya-idmajiya-muadalat_P1'],
      color: 'rose', style: 'featured', estimatedMin: 14, difficulty: 4, actionText: 'أتعمّق' },
    { id: '04', number: 4, slug: 'ahill', path: `${LESSON_BASE_PATH}/ahill`,
      title: 'أحلّ الوضعية', desc: 'خمس مراحل تُقيَّم: عبارتا الصيغتين، المتراجحة، حلها، لحظة التساوي، ثم الصيغة الأفضل.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 6, difficulty: 4, actionText: 'أحلّ' },
  ],
};
