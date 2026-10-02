/**
 * أدمج تعلّماتي — الوحدة 5 « جمل معادلتين من الدرجة الأولى بمجهولين » (kind: synthesis)
 * Manuel 4AM, unité 5 : « أؤكّد تعلّماتي » (QCM 1–7, p. 62), « أدمج تعلّماتي »
 * (وضعية حفل البلدية + تحليل الوضعية, p. 62) et « أتعمّق » (ex. 29, 30, 31, p. 63)
 * — extraction.json › destinations.
 * Ce n'est PAS un quatrième درس : c'est la synthèse de l'unité, affichée après les trois leçons.
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
  description: 'إدماج المعارف والحل المنهجي للوضعيات المركبة: وضعية حفل البلدية (علب العصير وقطع الحلوى) تُحلّ بتحديد المجهولين وكتابة جملة معادلتين واختيار طريقة الحل الأنجع ثم التحقق وتفسير النتائج، يسبقها اختبار «أؤكّد تعلّماتي» الذي يعيد كل سؤال إلى درسه، ثم تمارين «أتعمّق».',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🎉',
  estimatedDurationMin: 50,
  textbookRef: { unit: 5, pages: '62, 63' },
  skills: [
    'تجنيد موارد الوحدة (مفهوم الجملة، طريقتا التعويض والجمع، ترييض المشكلات) لحل وضعيات شراء وتكاليف',
    'تحديد المجهولين وترجمة كل معلومة من النص بمعادلة، ثم كتابة جملة المعادلتين',
    'اختيار طريقة الحل الأنجع، التحقق من الحل في نص الوضعية وتحرير الجواب',
  ],
  teachingScope: {
    include: ['أؤكّد تعلّماتي: 7 أسئلة', 'أدمج تعلّماتي: الوضعية وتحليلها في ثلاث مراحل', 'أتعمّق: التمارين 29 و 30 و 31'],
    exclude: ['أي مفهوم جديد', 'الحل البياني لجملة معادلتين (غير وارد في الوحدة)'],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Ce que la situation et « أتعمّق » mobilisent, diagnostiqué par « أستعدّ » (affirmations de la
  // plateforme : les items du manuel appartiennent aux leçons 1 et 2) : la notion d'équation à deux
  // inconnues et de solution d'une جملة (درس 1), la substitution et l'addition (درس 2), la traduction
  // d'un texte et la vérification dans le texte (درس 3), les pourcentages (années précédentes, ex. 31).
  priorKnowledge: ['mafhum-jumla', 'hall-jumla', 'tawid', 'jam', 'tarjama-jumla', 'tahaqquq-wadiya', 'nisba-mia'],
  resources: [
    { kind: 'situation', code: 'situation-hafl-baladiya', module: 1, title: 'وضعية: حفل البلدية', learningPointIds: ['4am_wadiya-idmajiya-jumal_P2', '4am_wadiya-idmajiya-jumal_P1'], sourceElementIds: ['situation'] },
    // Module 1 — l'histoire qu'on traduit (story-modeller, réutilisé de « حل مشكلات بتوظيف جمل
    // معادلتين ») sur la table du goûter (`theme="party"`) : l'élève nomme les inconnues, porte les
    // nombres de chaque information dans les cases de deux équations (deux informations d'ARGENT,
    // avec des quantités différentes), résout, puis rejoue l'histoire avec sa ثنائية.
    {
      kind: 'manipulation', code: 'story-modeller-rihlat-qism', type: 'story-modeller', module: 1, level: 'beginner',
      title: 'رحلة القسم: علب العصير وقطع الحلوى',
      objective: 'ترييض وضعية شراء بجملة معادلتين: نختار المجهولين، نترجم كل معلومة عن المبلغ بمعادلة، نحل الجملة ثم نتحقق من الحل في نص الوضعية',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'party' },
      learningPointIds: ['4am_wadiya-idmajiya-jumal_P2'],
      sourceElementIds: ['situation'],
    },
    {
      kind: 'manipulation', code: 'story-modeller-hafl-baladiya', type: 'story-modeller', module: 1, level: 'advanced',
      title: 'حفل البلدية: 150 علبة و 150 قطعة',
      objective: 'ترييض وضعية شراء بجملة معادلتين: نختار المجهولين، نترجم كل معلومة عن المبلغ بمعادلة، نحل الجملة ثم نتحقق من الحل في نص الوضعية',
      autonomy: 'أرقام الكتاب كما هي والمجهولان غير مسمّيين: التلميذ يقرّر بنفسه ماذا يسمّي x و y، ويلاحظ أنّ المعادلة الأولى تُبسَّط بالقسمة على 150 قبل اختيار الطريقة',
      experience: { type: 'textbook', reason: '', theme: 'party' },
      learningPointIds: ['4am_wadiya-idmajiya-jumal_P2', '4am_wadiya-idmajiya-jumal_P1'],
      sourceElementIds: ['situation'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'سبع عبارات: صحيح أم خاطئ؟ مفهوم الجملة وحلها، التعويض والجمع، الترجمة والتحقق، والنسبة المئوية.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'al-wadiya', path: `${LESSON_BASE_PATH}/al-wadiya`,
      title: 'الوضعية وتحليلها', desc: 'حفل البلدية: سمِّ المجهولين، ترجم كل معلومة بمعادلة على طاولة الحفل، اختر طريقة الحل ثم تحقّق في النص.',
      stage: 'trigger', teachesLearningPointIds: ['4am_wadiya-idmajiya-jumal_P2', '4am_wadiya-idmajiya-jumal_P1'],
      color: 'amber', style: 'featured', estimatedMin: 16, difficulty: 3, actionText: 'أقرأ الوضعية' },
    { id: '02', number: 2, slug: 'uakkid', path: `${LESSON_BASE_PATH}/uakkid`,
      title: 'أؤكّد تعلّماتي', desc: 'سبعة أسئلة من الكتاب؛ عند الحاجة أعود إلى الدرس.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_wadiya-idmajiya-jumal_P1'], color: 'sky', style: 'featured', estimatedMin: 10, difficulty: 2, actionText: 'أؤكّد' },
    { id: '03', number: 3, slug: 'atamaqq', path: `${LESSON_BASE_PATH}/atamaqq`,
      title: 'أتعمّق', desc: 'العسل والموزّع الآلي ومشتريات المتجر: التمارين 29 و 30 و 31 (مع تخفيض 20%).',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_wadiya-idmajiya-jumal_P1', '4am_wadiya-idmajiya-jumal_P2'],
      color: 'rose', style: 'featured', estimatedMin: 12, difficulty: 4, actionText: 'أتعمّق' },
    { id: '04', number: 4, slug: 'ahill', path: `${LESSON_BASE_PATH}/ahill`,
      title: 'أحلّ الوضعية', desc: 'خمس مراحل تُقيَّم: المجهولان، الجملة، تبسيطها، الحل، ثم التحقق والجواب.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 6, difficulty: 4, actionText: 'أحلّ' },
  ],
};
