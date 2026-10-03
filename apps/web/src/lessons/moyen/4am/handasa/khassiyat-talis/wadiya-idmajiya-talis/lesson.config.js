/**
 * أدمج تعلّماتي — الوحدة 9 « خاصية طالس » (kind: synthesis)
 * Manuel 4AM, unité 9 : « أؤكّد تعلّماتي » (QCM 1–4, p. 112), « أدمج تعلّماتي » (وضعية الأسطوانة داخل المخروط +
 * تحليل الوضعية, p. 112), « أتعمّق » (ex. 20 et 22, p. 113), et — doublons DÉCLARÉS de la page d'unité — le تحدّ (la
 * minaret, p. 103) et l'encadré « طالس » (extraction.json › destinations). Ce n'est PAS un quatrième درس.
 *
 * Le parcours demandé par le propriétaire, phase par phase :
 *   RÉEL               module 1 — la minaret du quartier (le تحدّ) puis le cornet et son pot (la وضعية)
 *   DÉCOUVRIR          module 1 — étapes 1, 3, 4 : la méthode de l'ombre, ce que demande la وضعية, quelle figure plane
 *   MANIPULER          module 1 — UN workspace, deux labs : مبتدئ `shadow-stick` (planter le bâton jusqu'à ce que les
 *                      ombres finissent en O, puis la perche qui touche le rayon) ; متقدم `cone-cylinder` (h et r tenus
 *                      par la main, le cône refuse le cylindre qui le perce)
 *   COMPRENDRE         module 1 — étapes 2 et 5 : deux triangles de sommet O, côtés parallèles
 *   TOUCHER LES MATHS  module 1 — étapes 6 à 8 : r ÷ 6 = (18 − h) ÷ 18, 24r = 108, V = 91,125π
 *   FORMALISER         module 1 — les briques et les trois phases du manuel (قراءة · تحليل · تنفيذ), la vérification
 *   AUTOMATISER        module 2 — « أؤكّد تعلّماتي » : les quatre QCM, chacun renvoyé à son درس
 *   TRANSFÉRER         module 3 — « أتعمّق » : ex. 20, ex. 22 (la largeur de l'oued), la pyramide de Thalès ;
 *                      module 4 — la وضعية et le تحدّ TRANSPOSÉS (autres nombres) en « إختبار أولي »
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/handasa/wadiya-idmajiya-talis';

export const LESSON_CONFIG = {
  id: 'wadiya-idmajiya-talis',
  kind: 'synthesis',
  unit: 'khassiyat-talis',
  unitTitle: 'خاصية طالس',
  sequentialUnlock: true,
  title: 'أدمج تعلّماتي — ترييض وضعيات هندسية مركبة بتوظيف خاصية طالس',
  description: 'إدماج المعارف: تجنيد خاصية طالس وعكسيتها في وضعيات مركبة — ارتفاع مئذنة بطريقة الظل، أسطوانة داخل مخروط (مقطع محوري، معادلة، حجم)، عرض نهر — بتحليلها المنهجي (قراءة · تحليل · تنفيذ)، يسبقها اختبار «أؤكّد تعلّماتي» الذي يعيد كل سؤال إلى درسه.',
  level: 'moyen',
  grade: '4am',
  chapter: 'handasa',
  chapterTitle: 'ميدان الهندسة',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🕌',
  estimatedDurationMin: 50,
  textbookRef: { unit: 9, pages: '103, 112, 113' },
  skills: [
    'تجنيد خاصية طالس وعكسيتها لحل وضعيات واقعية مركبة: ارتفاع مئذنة بطريقة الظل، عرض نهر',
    'ربط المجسّمات (المخروط والأسطوانة) بمقطعها المحوري، وصياغة معادلة لحساب بُعد ثم حجم',
    'اختيار استراتيجية الحل وتنفيذها والتحقّق من ملاءمة النتيجة للواقع',
  ],
  teachingScope: {
    include: ['تحدّ الوحدة: ارتفاع المئذنة بطريقة الظل', 'أدمج تعلّماتي: الأسطوانة داخل المخروط وتحليلها في ثلاث مراحل', 'أؤكّد تعلّماتي: 4 أسئلة يعيد كل منها إلى درسه', 'أتعمّق: التمرينان 20 و 22 ووضعية الهرم من المنصّة'],
    exclude: ['أي مفهوم جديد', 'حجم المخروط وحساب القيمة العظمى لحجم الأسطوانة'],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Ce que le تحدّ, la وضعية, « أؤكّد تعلّماتي » et « أتعمّق » mobilisent, diagnostiqué par « أستعدّ » (affirmations
  // de la plateforme) : Thalès (درس 1) et sa réciproque (درس 2), le quatrième proportionnel, la coupe axiale d'un
  // cône, le volume d'un cylindre, une équation du premier degré, les médianes d'un triangle.
  priorKnowledge: ['talis-mubashira', 'talis-aksiya', 'rabi-mutanasib', 'maqta-mihwari', 'hajm-ustuwana', 'muadala-ula', 'mutawassitat'],
  resources: [
    { kind: 'situation', code: 'situation-ustuwana-makhrut', module: 1, title: 'وضعية: أسطوانة داخل مخروط', learningPointIds: ['4am_wadiya-idmajiya-talis_P2', '4am_wadiya-idmajiya-talis_P3'], sourceElementIds: ['situation'] },
    // Module 1 — مبتدئ : le تحدّ de la page d'unité (doublon déclaré), sur `shadow-stick` (monde `minaret`).
    {
      kind: 'manipulation', code: 'shadow-stick-midhana', type: 'shadow-stick', module: 1, level: 'beginner',
      title: 'تحدّ الوحدة: عصا طولها 1 m وظلّان ينتهيان معًا',
      objective: 'ترييض وضعية بمثلثين في وضعية طالس وحل معادلة لإيجاد طول غير مباشر',
      autonomy: '',
      experience: { type: 'textbook', reason: '', theme: 'minaret' },
      learningPointIds: ['4am_wadiya-idmajiya-talis_P1'],
      sourceElementIds: ['challenge'],
    },
    // Module 1 — متقدم : la وضعية du manuel sur `cone-cylinder` (monde `cornet`, décor seulement).
    {
      kind: 'manipulation', code: 'cone-cylinder-wadiya', type: 'cone-cylinder', module: 1, level: 'advanced',
      title: 'وضعية الكتاب: أسطوانة داخل مخروط ارتفاعه 18 ونصف قطر قاعدته 6',
      objective: 'ترييض وضعية بمثلثين في وضعية طالس وحل معادلة لإيجاد طول غير مباشر',
      autonomy: 'وضعية الكتاب: بعدان تمسكهما اليد بدل بُعد واحد (طول الأسطوانة ونصف قطرها)، والمخروط يرفض كل أسطوانة تخرقه؛ لا مكان مقترح: التلميذ يبحث بنفسه عن الأسطوانات المحاطة، ثم عن الأسطوانة التي يتساوى فيها h و r، ويقرأ حجمها',
      experience: { type: 'textbook', reason: '', theme: 'cornet' },
      learningPointIds: ['4am_wadiya-idmajiya-talis_P2', '4am_wadiya-idmajiya-talis_P3'],
      sourceElementIds: ['situation'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'سبع عبارات: صحيح أم خاطئ؟ خاصية طالس وعكسيتها، الرابع المتناسب، المقطع المحوري للمخروط، حجم الأسطوانة، معادلة، ومتوسطات المثلث.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'al-wadiya', path: `${LESSON_BASE_PATH}/al-wadiya`,
      title: 'الوضعية وتحليلها', desc: 'تحدّ الوحدة (ارتفاع المئذنة بعصا وظلّين) ثم الوضعية: أسطوانة داخل مخروط، مقطعها المحوري، معادلة في r وحجمها، والتحقّق من ملاءمة النتيجة.',
      stage: 'trigger', teachesLearningPointIds: ['4am_wadiya-idmajiya-talis_P1', '4am_wadiya-idmajiya-talis_P2', '4am_wadiya-idmajiya-talis_P3'],
      color: 'amber', style: 'featured', estimatedMin: 18, difficulty: 3, actionText: 'أقرأ الوضعية' },
    { id: '02', number: 2, slug: 'uakkid', path: `${LESSON_BASE_PATH}/uakkid`,
      title: 'أؤكّد تعلّماتي', desc: 'أربعة أسئلة من الكتاب؛ عند الحاجة أعود إلى الدرس.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_wadiya-idmajiya-talis_P1'], color: 'sky', style: 'featured', estimatedMin: 9, difficulty: 2, actionText: 'أؤكّد' },
    { id: '03', number: 3, slug: 'atamaqq', path: `${LESSON_BASE_PATH}/atamaqq`,
      title: 'أتعمّق', desc: 'شبه منحرف ووضعيات طالس الثلاث (التمرين 20)، عرض نهر (التمرين 22)، وارتفاع الهرم بطريقة الظل.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_wadiya-idmajiya-talis_P1', '4am_wadiya-idmajiya-talis_P3'],
      color: 'rose', style: 'featured', estimatedMin: 10, difficulty: 4, actionText: 'أتعمّق' },
    { id: '04', number: 4, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'وضعية أخرى: أسطوانة داخل مخروط آخر، ومنارة أخرى بطريقة الظل.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 7, difficulty: 4, actionText: 'أحلّ' },
  ],
};
