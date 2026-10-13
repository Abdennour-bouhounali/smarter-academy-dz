/**
 * أدمج تعلّماتي — الوحدة 5 « جمل معادلتين من الدرجة الأولى بمجهولين » (kind: synthesis)
 * Manuel 4AM, unité 5 : « أدمج تعلّماتي » (وضعية حفل البلدية + تحليل الوضعية, p. 62) —
 * extraction.json › destinations.
 * Ce n'est PAS un quatrième درس : c'est la synthèse de l'unité, affichée après les trois leçons.
 *
 * Format de wadiya-idmajiya-aadad (MASAIL_GENERATION_GUIDE.md §14), et rien d'autre :
 * « أستعدّ » (module 0), SIX « وضعيات تدريبية » (modules 1 à 6, `track: 'problem'`, content/problems.js),
 * « تحليل الوضعية » du حفل البلدية (module 7, practice_lab : on lit et on analyse, on ne résout pas)
 * et « أحلّ الوضعية » (module 8, l'évaluation).
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/wadiya-idmajiya-jumal';

export const LESSON_CONFIG = {
  id: 'wadiya-idmajiya-jumal',
  kind: 'synthesis',
  unit: 'jumal-muadalatayn',
  unitTitle: 'جمل معادلتين من الدرجة الأولى بمجهولين',
  sequentialUnlock: true,
  title: 'أدمج تعلّماتي — جمل معادلتين من الدرجة الأولى بمجهولين',
  description: 'إدماج المعارف والحل المنهجي للوضعيات المركبة: ست وضعيات تدريبية (قفف رمضان، كرة السلة، ورشة النجارة، أعلام نوفمبر، حديقة النادي، هدية الوالد) ثم وضعية حفل البلدية (علب العصير وقطع الحلوى) تُحلّ بتحديد المجهولين وكتابة جملة معادلتين واختيار طريقة الحل الأنجع ثم التحقق وتفسير النتائج، وتنتهي بتقييم وضعية حفل البلدية.',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🎉',
  estimatedDurationMin: 30,
  textbookRef: { unit: 5, pages: '62' },
  skills: [
    'تجنيد موارد الوحدة (مفهوم الجملة، طريقتا التعويض والجمع، ترييض المشكلات) لحل وضعيات شراء وتكاليف',
    'تحديد المجهولين وترجمة كل معلومة من النص بمعادلة، ثم كتابة جملة المعادلتين',
    'اختيار طريقة الحل الأنجع، التحقق من الحل في نص الوضعية وتحرير الجواب',
  ],
  teachingScope: {
    include: ['ست وضعيات تدريبية بجمل معادلتين (مجموع وكتلة، نقاط، ورشة، تخفيض 10%، مستطيل، أعمار)', 'أدمج تعلّماتي: وضعية حفل البلدية وتحليلها في ثلاث مراحل'],
    exclude: ['أي مفهوم جديد', 'الحل البياني لجملة معادلتين (غير وارد في الوحدة)'],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Ce que la situation mobilise, diagnostiqué par « أستعدّ » (affirmations de la
  // plateforme : les items du manuel appartiennent aux leçons 1 et 2) : la notion d'équation à deux
  // inconnues et de solution d'une جملة (درس 1), la substitution et l'addition (درس 2), la traduction
  // d'un texte et la vérification dans le texte (درس 3), les pourcentages (années précédentes, utiles aux entraînements).
  priorKnowledge: ['mafhum-jumla', 'hall-jumla', 'tawid', 'jam', 'tarjama-jumla', 'tahaqquq-wadiya', 'nisba-mia'],
  resources: [
    { kind: 'situation', code: 'situation-hafl-baladiya', module: 7, title: 'وضعية: حفل البلدية', learningPointIds: ['4am_wadiya-idmajiya-jumal_P2', '4am_wadiya-idmajiya-jumal_P1'], sourceElementIds: ['situation'] },
    // Module 7 — l'histoire qu'on traduit (story-modeller, réutilisé de « حل مشكلات بتوظيف جمل
    // معادلتين ») sur la table du goûter (`theme="party"`) : l'élève nomme les inconnues, porte les
    // nombres de chaque information dans les cases de deux équations (deux informations d'ARGENT,
    // avec des quantités différentes), résout, puis rejoue l'histoire avec sa ثنائية.
    {
      kind: 'manipulation', code: 'story-modeller-rihlat-qism', type: 'story-modeller', module: 7, level: 'beginner',
      title: 'رحلة القسم: علب العصير وقطع الحلوى',
      objective: 'ترييض وضعية شراء بجملة معادلتين: نختار المجهولين، نترجم كل معلومة عن المبلغ بمعادلة، نحل الجملة ثم نتحقق من الحل في نص الوضعية',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'party' },
      learningPointIds: ['4am_wadiya-idmajiya-jumal_P2'],
      sourceElementIds: ['situation'],
    },
    {
      kind: 'manipulation', code: 'story-modeller-hafl-baladiya', type: 'story-modeller', module: 7, level: 'advanced',
      title: 'حفل البلدية: 150 علبة و 150 قطعة',
      objective: 'ترييض وضعية شراء بجملة معادلتين: نختار المجهولين، نترجم كل معلومة عن المبلغ بمعادلة، نحل الجملة ثم نتحقق من الحل في نص الوضعية',
      autonomy: 'أرقام الكتاب كما هي والمجهولان غير مسمّيين: التلميذ يقرّر بنفسه ماذا يسمّي x و y، ويلاحظ أنّ المعادلة الأولى تُبسَّط بالقسمة على 150 قبل اختيار الطريقة',
      experience: { type: 'textbook', reason: '', theme: 'party' },
      learningPointIds: ['4am_wadiya-idmajiya-jumal_P2', '4am_wadiya-idmajiya-jumal_P1'],
      sourceElementIds: ['situation'],
    },
    // Modules 1–6 — six وضعيات d'entraînement (content/problems.js), ajouts de la plateforme ;
    // le module 7 lit la situation évaluée au module 8.
    { kind: 'situation', code: 'wadiya-1', module: 1, title: 'وضعية 1 — قفف رمضان: 40 قفة و 248 kg', learningPointIds: ['4am_wadiya-idmajiya-jumal_P2', '4am_wadiya-idmajiya-jumal_P1'] },
    { kind: 'situation', code: 'wadiya-2', module: 2, title: 'وضعية 2 — مباراة كرة السلة: 24 سلة و 52 نقطة', learningPointIds: ['4am_wadiya-idmajiya-jumal_P2', '4am_wadiya-idmajiya-jumal_P1'] },
    { kind: 'situation', code: 'wadiya-3', module: 3, title: 'وضعية 3 — ورشة النجارة: 50 لوحًا و 48 ساعة', learningPointIds: ['4am_wadiya-idmajiya-jumal_P2', '4am_wadiya-idmajiya-jumal_P1'] },
    { kind: 'situation', code: 'wadiya-4', module: 4, title: 'وضعية 4 — أعلام الفاتح من نوفمبر وتخفيض 10%', learningPointIds: ['4am_wadiya-idmajiya-jumal_P2', '4am_wadiya-idmajiya-jumal_P1'] },
    { kind: 'situation', code: 'wadiya-5', module: 5, title: 'وضعية 5 — حديقة نادي البيئة: محيطها 140 م', learningPointIds: ['4am_wadiya-idmajiya-jumal_P2', '4am_wadiya-idmajiya-jumal_P1'] },
    { kind: 'situation', code: 'wadiya-6', module: 6, title: 'وضعية 6 — أعمار الأب وابنه وهدية الوالد', learningPointIds: ['4am_wadiya-idmajiya-jumal_P2', '4am_wadiya-idmajiya-jumal_P1'] },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'سبع عبارات: صحيح أم خاطئ؟ مفهوم الجملة وحلها، التعويض والجمع، الترجمة والتحقق، والنسبة المئوية.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    // Les وضعيات d'entraînement (track: 'problem') : practice_lab, formatives (complétion, jamais la maîtrise) —
    // docs/lessons/MASAIL_GENERATION_GUIDE.md, §14 (synthèses).
    { id: '01', number: 1, slug: 'wadiya-1', path: `${LESSON_BASE_PATH}/wadiya-1`,
      title: 'الوضعية التدريبية 1 — قفف رمضان', desc: '40 قفة من نوعين و 248 kg: كم قفة من كل نوع؟ وهل يصحّ اقتراح (20 ; 20)؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_wadiya-idmajiya-jumal_P2', '4am_wadiya-idmajiya-jumal_P1'],
      color: 'emerald', style: 'featured', estimatedMin: 6, difficulty: 3, actionText: 'أحلّ الوضعية' },
    { id: '02', number: 2, slug: 'wadiya-2', path: `${LESSON_BASE_PATH}/wadiya-2`,
      title: 'الوضعية التدريبية 2 — مباراة كرة السلة', desc: '24 سلة و 52 نقطة: سلات النقطتين والثلاث نقاط، وتدوين مستحيل.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_wadiya-idmajiya-jumal_P2', '4am_wadiya-idmajiya-jumal_P1'],
      color: 'sky', style: 'featured', estimatedMin: 6, difficulty: 3, actionText: 'أحلّ الوضعية' },
    { id: '03', number: 3, slug: 'wadiya-3', path: `${LESSON_BASE_PATH}/wadiya-3`,
      title: 'الوضعية التدريبية 3 — ورشة النجارة', desc: '50 لوحًا و 48 ساعة عمل: الطاولات والكراسي، والمدخول والربح.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_wadiya-idmajiya-jumal_P2', '4am_wadiya-idmajiya-jumal_P1'],
      color: 'amber', style: 'featured', estimatedMin: 7, difficulty: 3, actionText: 'أحلّ الوضعية' },
    { id: '04', number: 4, slug: 'wadiya-4', path: `${LESSON_BASE_PATH}/wadiya-4`,
      title: 'الوضعية التدريبية 4 — أعلام الفاتح من نوفمبر', desc: 'طلبيتان وتخفيض 10%: ثمن العلم الصغير والكبير ثم طلبية جديدة.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_wadiya-idmajiya-jumal_P2', '4am_wadiya-idmajiya-jumal_P1'],
      color: 'rose', style: 'featured', estimatedMin: 7, difficulty: 3, actionText: 'أحلّ الوضعية' },
    { id: '05', number: 5, slug: 'wadiya-5', path: `${LESSON_BASE_PATH}/wadiya-5`,
      title: 'الوضعية التدريبية 5 — حديقة نادي البيئة', desc: 'محيط 140 م وطول يزيد عن العرض بـ 10 م: بُعدا الحديقة، السياج والتربة.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_wadiya-idmajiya-jumal_P2', '4am_wadiya-idmajiya-jumal_P1'],
      color: 'teal', style: 'featured', estimatedMin: 6, difficulty: 3, actionText: 'أحلّ الوضعية' },
    { id: '06', number: 6, slug: 'wadiya-6', path: `${LESSON_BASE_PATH}/wadiya-6`,
      title: 'الوضعية التدريبية 6 — هدية الوالد', desc: 'مجموع عمرين وشرط قبل 5 سنوات، ثم تقاسم ثمن هدية.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_wadiya-idmajiya-jumal_P2', '4am_wadiya-idmajiya-jumal_P1'],
      color: 'violet', style: 'featured', estimatedMin: 7, difficulty: 3, actionText: 'أحلّ الوضعية' },
    { id: '07', number: 7, slug: 'al-wadiya', path: `${LESSON_BASE_PATH}/al-wadiya`,
      title: 'الوضعية وتحليلها', desc: 'حفل البلدية: سمِّ المجهولين، ترجم كل معلومة بمعادلة على طاولة الحفل، اختر طريقة الحل ثم تحقّق في النص.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_wadiya-idmajiya-jumal_P2', '4am_wadiya-idmajiya-jumal_P1'],
      color: 'amber', style: 'featured', estimatedMin: 16, difficulty: 3, actionText: 'أقرأ الوضعية' },
    { id: '08', number: 8, slug: 'ahill', path: `${LESSON_BASE_PATH}/ahill`,
      title: 'أحلّ الوضعية', desc: 'خمس مراحل تُقيَّم: المجهولان، الجملة، تبسيطها، الحل، ثم التحقق والجواب.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 6, difficulty: 4, actionText: 'أحلّ' },
  ],
};
