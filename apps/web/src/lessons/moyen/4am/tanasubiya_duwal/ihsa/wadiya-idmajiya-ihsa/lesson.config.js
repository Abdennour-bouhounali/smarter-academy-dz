/**
 * أدمج تعلّماتي — الوحدة 8 « الإحصاء » (kind: synthesis)
 * Manuel 4AM, unité 8 : « أؤكّد تعلّماتي » (QCM 1–6, p. 100), « أدمج تعلّماتي » (وضعية الميداليات الذهبية
 * الأولمبية + تحليل الوضعية, p. 100) et « أتعمّق » (ex. 20, p. 101, CORRIGÉ : médiane 6 → 6,5) —
 * extraction.json › destinations. Ce n'est PAS un cinquième درس : c'est la synthèse de l'unité.
 *
 * Le parcours demandé par le propriétaire, phase par phase :
 *   RÉEL               module 1 — le tableau des médailles d'or et ses deux hexagones cachés
 *   DÉCOUVRIR          module 1 — étapes 1 à 3 : lire le tableau, ranger les données (N = 30), choisir l'indicateur
 *   MANIPULER          module 1 — `stat-balance` mode hidden : la main pose les jetons cachés jusqu'à ce que le
 *                      rideau du وسيط tombe sur 3 et que la poutre s'équilibre sur 7
 *   COMPRENDRE         module 1 — étapes 4 à 6 : pourquoi le وسيط donne la première valeur et le متوسط la seconde
 *   TOUCHER LES MATHS  module 1 — l'équation 176 + 2 × 3 + y = 210, puis 0,69 × T = 30
 *   FORMALISER         module 1 — les briques et les trois phases du manuel (قراءة · تحليل · تنفيذ)
 *   AUTOMATISER        module 2 — « أؤكّد تعلّماتي » : les six QCM, chacun renvoyé à son درس
 *   TRANSFÉRER         module 3 — « أتعمّق » : ex. 20 et deux situations de la plateforme qui croisent les دروس ;
 *                      module 4 — la situation TRANSPOSÉE (autres nombres) en « إختبار أولي »
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/tanasubiya_duwal/wadiya-idmajiya-ihsa';

export const LESSON_CONFIG = {
  id: 'wadiya-idmajiya-ihsa',
  kind: 'synthesis',
  unit: 'ihsa',
  unitTitle: 'الإحصاء',
  sequentialUnlock: true,
  title: 'أدمج تعلّماتي — إدماج المعارف والتحليل المنهجي للوضعية الإحصائية',
  description: 'إدماج المعارف: تجنيد موارد الوحدة (التكرارات المجمعة، المدى، الوسيط، المتوسط الحسابي، والنسب المئوية) في الوضعية الإحصائية للميداليات الأولمبية بتحليلها المنهجي (قراءة · تحليل · تنفيذ)، يسبقها اختبار «أؤكّد تعلّماتي» الذي يعيد كل سؤال إلى درسه.',
  level: 'moyen',
  grade: '4am',
  chapter: 'tanasubiya_duwal',
  chapterTitle: 'ميدان التناسبية والدوال',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🏅',
  estimatedDurationMin: 50,
  textbookRef: { unit: 8, pages: '100, 101' },
  skills: [
    'تجنيد موارد الوحدة (التكرارات المجمعة، المدى، الوسيط، المتوسط الحسابي، والنسب المئوية) لحل وضعية إحصائية مركبة',
    'تحليل الوضعية الإحصائية: قراءة النص والجدول، تحديد المطلوب وترتيب المعطيات',
    'اختيار استراتيجية الحل وتنفيذها (الوسيط، الوسط الحسابي وحل معادلة، أخذ نسبة من عدد) وتحرير النتائج بجمل واضحة',
  ],
  teachingScope: {
    include: ['أدمج تعلّماتي: وضعية الميداليات الذهبية الأولمبية وتحليلها في ثلاث مراحل', 'أؤكّد تعلّماتي: 6 أسئلة يعيد كل منها إلى درسه', 'أتعمّق: التمرين 20 (مصحّح) ووضعيتان من المنصّة'],
    exclude: ['أي مفهوم جديد', 'المجدولات (درس 3) خارج ما تحتاجه الوضعية'],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Ce que la situation, « أؤكّد تعلّماتي » et « أتعمّق » mobilisent, diagnostiqué par « أستعدّ »
  // (affirmations de la plateforme) : l'effectif total et les effectifs cumulés (درس 1), l'étendue, le
  // rang de la médiane, la moyenne pondérée (درس 2), le tout à partir d'un pourcentage et une équation.
  priorKnowledge: ['takrar-kulli', 'takrar-mujamma', 'mada', 'wasit-rutba', 'mutawassit-murajjah', 'nisba-min-adad', 'muadala-ula'],
  resources: [
    { kind: 'situation', code: 'situation-midaliyat', module: 1, title: 'وضعية: الميداليات الذهبية الأولمبية', learningPointIds: ['4am_wadiya-idmajiya-ihsa_P2', '4am_wadiya-idmajiya-ihsa_P3'], sourceElementIds: ['situation'] },
    // Module 1 — la balance des valeurs (stat-balance, RÉUTILISÉ de « مدى ووسيط ومتوسط سلسلة إحصائية »,
    // mode `hidden`, monde `medals`) : la main pose chaque jeton caché entre ses voisins du tableau jusqu'à
    // ce que le rideau du وسيط et l'équilibre du متوسط tombent sur les valeurs données.
    {
      kind: 'manipulation', code: 'stat-balance-alaab-madrasiya', type: 'stat-balance', module: 1, level: 'beginner',
      title: 'الألعاب المدرسية: عشر متوسطات وقيمة مخفية واحدة',
      objective: 'إيجاد قيم مخفية في جدول إحصائي: الوسيط يكشف القيمة التي تقع فيها رتبتاه، والمتوسط يعطي معادلة في القيمة الباقية',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'medals' },
      learningPointIds: ['4am_wadiya-idmajiya-ihsa_P3'],
      sourceElementIds: ['situation'],
    },
    {
      kind: 'manipulation', code: 'stat-balance-midaliyat', type: 'stat-balance', module: 1, level: 'advanced',
      title: 'الميداليات الأولمبية: ثلاثون دولة وقيمتان مخفيتان',
      objective: 'إيجاد قيم مخفية في جدول إحصائي: الوسيط يكشف القيمة التي تقع فيها رتبتاه، والمتوسط يعطي معادلة في القيمة الباقية',
      autonomy: 'جدول الكتاب: قيمتان مخفيتان بدل واحدة، ثلاثون دولة على الميزان منها إحدى عشرة مكدّسة عند 1؛ التلميذ يقرّر بنفسه أيّ قيمة يحرّك أولا (الوسيط قبل المتوسط) لأنّ الثانية لا تُعرف إلا بعد الأولى',
      experience: { type: 'textbook', reason: '', theme: 'medals' },
      learningPointIds: ['4am_wadiya-idmajiya-ihsa_P3', '4am_wadiya-idmajiya-ihsa_P2'],
      sourceElementIds: ['situation'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'ثماني عبارات: صحيح أم خاطئ؟ التكرار الكلي والتكرار المجمع، المدى، رتبة الوسيط، المتوسط المتوازن، النسبة المئوية ومعادلة.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'al-wadiya', path: `${LESSON_BASE_PATH}/al-wadiya`,
      title: 'الوضعية وتحليلها', desc: 'الميداليات الذهبية الأولمبية: قيمتان مخفيتان نجدهما باليد على ميزان القيم (الوسيط ثم المتوسط)، ثم عدد الدول التي لم تفز بالذهب بأخذ نسبة من عدد.',
      stage: 'trigger', teachesLearningPointIds: ['4am_wadiya-idmajiya-ihsa_P2', '4am_wadiya-idmajiya-ihsa_P3'],
      color: 'amber', style: 'featured', estimatedMin: 18, difficulty: 3, actionText: 'أقرأ الوضعية' },
    { id: '02', number: 2, slug: 'uakkid', path: `${LESSON_BASE_PATH}/uakkid`,
      title: 'أؤكّد تعلّماتي', desc: 'ستة أسئلة من الكتاب؛ عند الحاجة أعود إلى الدرس.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_wadiya-idmajiya-ihsa_P1'], color: 'sky', style: 'featured', estimatedMin: 9, difficulty: 2, actionText: 'أؤكّد' },
    { id: '03', number: 3, slug: 'atamaqq', path: `${LESSON_BASE_PATH}/atamaqq`,
      title: 'أتعمّق', desc: 'تكراران مجهولان بالوسيط (التمرين 20)، زمن الشاشة في القسم، ومسابقة بين مجموعتين.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_wadiya-idmajiya-ihsa_P1', '4am_wadiya-idmajiya-ihsa_P3'],
      color: 'rose', style: 'featured', estimatedMin: 10, difficulty: 4, actionText: 'أتعمّق' },
    { id: '04', number: 4, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'وضعية أخرى: البطولة الإفريقية لألعاب القوى — قيمتان مخفيتان، ثم عدد الدول دون ميدالية ذهبية.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 7, difficulty: 4, actionText: 'أحلّ' },
  ],
};
