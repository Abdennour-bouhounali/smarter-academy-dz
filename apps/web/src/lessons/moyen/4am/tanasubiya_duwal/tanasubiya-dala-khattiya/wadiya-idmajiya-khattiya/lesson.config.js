/**
 * أدمج تعلّماتي — الوحدة 6 « الدالة الخطية والتناسبية » (kind: synthesis)
 * Manuel 4AM, unité 6 : « أؤكّد تعلّماتي » (QCM 1–8, p. 74), « أدمج تعلّماتي » (وضعية المصعد
 * الهوائي + تحليل الوضعية, p. 74) et « أتعمّق » (ex. 32, 37, 38, 39, p. 75) —
 * extraction.json › destinations. Ce n'est PAS un sixième درس : c'est la synthèse de l'unité.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/tanasubiya_duwal/wadiya-idmajiya-khattiya';

export const LESSON_CONFIG = {
  id: 'wadiya-idmajiya-khattiya',
  kind: 'synthesis',
  unit: 'tanasubiya-dala-khattiya',
  unitTitle: 'الدالة الخطية والتناسبية',
  sequentialUnlock: true,
  title: 'أدمج تعلّماتي — الدالة الخطية والتناسبية',
  description: 'إدماج موارد الوحدة في وضعية مركبة: المصعد الهوائي (مبرهنة فيثاغورس لطول الحبل، السرعة المتوسطة لمدة الصعود، ثم تكلفة رحلة العائلة كدالة خطية لسعر التذكرة مع تخفيض 40% للأطفال، وقراءة بيانية لحد الميزانية)، يسبقها اختبار «أؤكّد تعلّماتي» الذي يعيد كل سؤال إلى درسه، ثم تمارين «أتعمّق».',
  level: 'moyen',
  grade: '4am',
  chapter: 'tanasubiya_duwal',
  chapterTitle: 'ميدان التناسبية والدوال',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🚡',
  estimatedDurationMin: 50,
  textbookRef: { unit: 6, pages: '74, 75' },
  skills: [
    'تجنيد موارد الوحدة (التناسبية، الدالة الخطية، التمثيل البياني، النسب المئوية والمقادير المركبة) لحل وضعية مركبة',
    'تحليل وضعية واقعية: طول حبل مصعد هوائي، مدة الصعود، وتكلفة رحلة عائلة مع تخفيض للأطفال كدالة خطية لسعر التذكرة',
    'اختيار استراتيجية تجمع مبرهنة فيثاغورس والتمثيل البياني والدالة الخطية، ثم تفسير النتيجة في سياق الوضعية',
  ],
  teachingScope: {
    include: ['أؤكّد تعلّماتي: 8 أسئلة', 'أدمج تعلّماتي: وضعية المصعد الهوائي وتحليلها في ثلاث مراحل', 'أتعمّق: التمارين 32 و 37 و 38 و 39'],
    exclude: ['أي مفهوم جديد', 'الدالة التآلفية (غير واردة في الوحدة)'],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Ce que la situation, « أؤكّد تعلّماتي » et « أتعمّق » mobilisent, diagnostiqué par « أستعدّ »
  // (affirmations de la plateforme) : Pythagore (années précédentes), les grandeurs composées
  // (درس 4 : vitesse, masse volumique, conversions), la réduction en % (درس 4), la lecture
  // graphique (درس 3), l'image et le coefficient (درس 2), la forme ax (درس 2), un % d'un tout.
  priorKnowledge: ['fithaghuras', 'maqadir-murakkaba', 'nisba-takhfid', 'qiraa-bayaniya', 'sura-adad', 'tayin-muamil', 'shakl-khatti', 'nisba-mia'],
  resources: [
    { kind: 'situation', code: 'situation-misad-hawai', module: 1, title: 'وضعية: المصعد الهوائي', learningPointIds: ['4am_wadiya-idmajiya-khattiya_P2', '4am_wadiya-idmajiya-khattiya_P3'], sourceElementIds: ['situation'] },
    // Module 1 — la droite de coût (origin-line, réutilisé de « التمثيل البياني لدالة خطية »,
    // mode `read`, monde `budget`) : la droite y = a·x par O est donnée, la ligne du budget
    // y = cap aussi ; l'élève glisse la sonde jusqu'au point où le coût atteint le budget et
    // lit le plus grand prix d'une tranche de billet.
    {
      kind: 'manipulation', code: 'origin-line-aila-ukhra', type: 'origin-line', module: 1, level: 'beginner',
      title: 'عائلة أخرى: تكلفة 3x وميزانية 1500 DA',
      objective: 'قراءة بيانية لحد الميزانية: تكلفة رحلة العائلة دالة خطية لسعر تذكرة البالغ، وأكبر سعر مسموح هو فاصلة نقطة تقاطع مستقيم التكلفة مع خط الميزانية',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'cablecar' },
      learningPointIds: ['4am_wadiya-idmajiya-khattiya_P3'],
      sourceElementIds: ['situation'],
    },
    {
      kind: 'manipulation', code: 'origin-line-misad-hawai', type: 'origin-line', module: 1, level: 'advanced',
      title: 'عائلة الكتاب: تكلفة 3,8x وميزانية 2000 DA',
      objective: 'قراءة بيانية لحد الميزانية: تكلفة رحلة العائلة دالة خطية لسعر تذكرة البالغ، وأكبر سعر مسموح هو فاصلة نقطة تقاطع مستقيم التكلفة مع خط الميزانية',
      autonomy: 'أعداد الكتاب: المعامل 3,8 عشري ونقطة التقاطع لا تقع على عقدة من الشبكة؛ التلميذ يقرأ قيمة تقريبية ثم يقرّر بنفسه كيف يدوّر حتى لا تتجاوز التكلفة الميزانية',
      experience: { type: 'textbook', reason: '', theme: 'cablecar' },
      learningPointIds: ['4am_wadiya-idmajiya-khattiya_P3', '4am_wadiya-idmajiya-khattiya_P2'],
      sourceElementIds: ['situation'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'تسع عبارات: صحيح أم خاطئ؟ فيثاغورس، السرعة والوحدات، التخفيض بنسبة مئوية، القراءة البيانية، الصورة والمعامل.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'al-wadiya', path: `${LESSON_BASE_PATH}/al-wadiya`,
      title: 'الوضعية وتحليلها', desc: 'المصعد الهوائي: طول الحبل بفيثاغورس، مدة الصعود، تكلفة العائلة كدالة خطية، ثم أكبر سعر على خط الميزانية — نتدرّب على مصعد آخر وعائلة أخرى.',
      stage: 'trigger', teachesLearningPointIds: ['4am_wadiya-idmajiya-khattiya_P2', '4am_wadiya-idmajiya-khattiya_P3'],
      color: 'amber', style: 'featured', estimatedMin: 16, difficulty: 3, actionText: 'أقرأ الوضعية' },
    { id: '02', number: 2, slug: 'uakkid', path: `${LESSON_BASE_PATH}/uakkid`,
      title: 'أؤكّد تعلّماتي', desc: 'ثمانية أسئلة من الكتاب؛ عند الحاجة أعود إلى الدرس.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_wadiya-idmajiya-khattiya_P1'], color: 'sky', style: 'featured', estimatedMin: 10, difficulty: 2, actionText: 'أؤكّد' },
    { id: '03', number: 3, slug: 'atamaqq', path: `${LESSON_BASE_PATH}/atamaqq`,
      title: 'أتعمّق', desc: 'دالة خطية أم لا؟ نترات الماء، الناخبون، وعصير البرتقال: التمارين 32 و 37 و 38 و 39.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_wadiya-idmajiya-khattiya_P1', '4am_wadiya-idmajiya-khattiya_P3'],
      color: 'rose', style: 'featured', estimatedMin: 11, difficulty: 4, actionText: 'أتعمّق' },
    { id: '04', number: 4, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'وضعية الكتاب كاملة: طول الحبل، مدة الصعود، تكلفة العائلة، تمثيلها البياني، وأكبر سعر للتذكرة.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 7, difficulty: 4, actionText: 'أحلّ' },
  ],
};
