/**
 * أدمج تعلّماتي — الوحدة 10 « حساب المثلثات في المثلث القائم » (kind: synthesis)
 * Manuel 4AM, unité 10 : « أؤكّد تعلّماتي » (QCM 1–6, p. 124), « أدمج تعلّماتي » (وضعية « مقام الشهيد » + تحليل
 * الوضعية, p. 124), « أتعمّق » (ex. 31 et 32, p. 125) — extraction.json › destinations. Ce n'est PAS un cinquième درس.
 *
 * Le parcours demandé par le propriétaire, phase par phase :
 *   RÉEL               module 1 — أريس veut la hauteur de مقام الشهيد (Alger) avec un poteau électrique de 2,30 m
 *   DÉCOUVRIR          module 1 — étapes 1–2 : ce que demande la وضعية, quelles connaissances la figure appelle
 *   MANIPULER          module 1 — UN workspace, le lab `clinometer` (mode « align », monde `maqam`) réutilisé de la
 *                      leçon 4 : l'observateur glisse au sol jusqu'à ce que le sommet du poteau cache celui du مقام
 *                      (مبتدئ : un réverbère de 3 m planté à 89 m ; متقدم : les nombres du manuel)
 *   COMPRENDRE         module 1 — étapes 2–3 : deux triangles de sommet l'œil d'أريس, côtés verticaux parallèles
 *   TOUCHER LES MATHS  module 1 — étapes 3–6 : h ÷ 2,30 = 98,1 ÷ 2,45 ⇒ h ≈ 92,09 m ; tan x = 2,30 ÷ 2,45 ⇒ x ≈ 43°
 *   FORMALISER         module 1 — les briques et les trois phases du manuel (قراءة · تحليل · تنفيذ), la vérification
 *   AUTOMATISER        module 2 — « أؤكّد تعلّماتي » : les six QCM, chacun renvoyé à son درس
 *   TRANSFÉRER         module 3 — « أتعمّق » : ex. 31 (le pavé, Pythagore deux fois puis le sinus), ex. 32 (Khéops) ;
 *                      module 4 — la وضعية TRANSPOSÉE (la minaret de جامع الجزائر, un conteneur) en « إختبار أولي »
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/handasa/wadiya-idmajiya-muthallathat';

export const LESSON_CONFIG = {
  id: 'wadiya-idmajiya-muthallathat',
  kind: 'synthesis',
  unit: 'hisab-muthallathat',
  unitTitle: 'حساب المثلثات في المثلث القائم',
  sequentialUnlock: true,
  title: 'أدمج تعلّماتي — إدماج المعارف والحل المنهجي للوضعية المركبة',
  description: 'إدماج المعارف: ارتفاع «مقام الشهيد» بعمود كهربائي وخط نظر (خاصية طالس ثم الظل)، وأبعاد مجسمات (متوازي مستطيلات، هرم خوفو) — بالتحليل المنهجي (قراءة · تحليل · تنفيذ)، يسبقها اختبار «أؤكّد تعلّماتي» الذي يعيد كل سؤال إلى درسه.',
  level: 'moyen',
  grade: '4am',
  chapter: 'handasa',
  chapterTitle: 'ميدان الهندسة',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🏛️',
  estimatedDurationMin: 55,
  textbookRef: { unit: 10, pages: '124, 125' },
  skills: [
    'تجنيد خاصية طالس والنسب المثلثية والحاسبة لحل وضعية واقعية مركبة: ارتفاع «مقام الشهيد» وقيس زاوية خط النظر',
    'قراءة الوضعية وتحليلها: تحديد المعطيات والمطلوب، ورسم المثلث القائم أو المثلثين في وضعية طالس داخل الواقع أو داخل مجسّم',
    'اختيار المساواة المناسبة وتنفيذها: حساب الأطوال والزوايا وتدوير النتائج في آخر الحساب والتحقّق من ملاءمتها للواقع',
  ],
  teachingScope: {
    include: ['أدمج تعلّماتي: وضعية «مقام الشهيد» وتحليلها في ثلاث مراحل', 'أؤكّد تعلّماتي: 6 أسئلة يعيد كل منها إلى درسه', 'أتعمّق: التمرينان 31 (متوازي مستطيلات) و 32 (هرم خوفو)'],
    exclude: ['أي مفهوم جديد', 'العلاقات المثلثية في مثلث غير قائم'],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Ce que la وضعية, « أؤكّد تعلّماتي » et « أتعمّق » mobilisent, diagnostiqué par « أستعدّ » (affirmations de la
  // plateforme) : Thalès dans une ligne de visée (unité 9), les définitions des rapports (درس 1), l'inconnue au
  // dénominateur (درس 4), la touche inverse de la calculatrice (درس 2), Pythagore dans un solide, l'arrondi,
  // la relation cos² + sin² = 1 (درس 3).
  priorKnowledge: ['talis-nazar', 'nisab-tarif', 'majhul-maqam', 'hasiba-aks', 'fithaghuris-fada', 'tadwir', 'alaqa-asasiya'],
  resources: [
    { kind: 'situation', code: 'situation-maqam-echahid', module: 1, title: 'وضعية: ارتفاع «مقام الشهيد»', learningPointIds: ['4am_wadiya-idmajiya-muthallathat_P1', '4am_wadiya-idmajiya-muthallathat_P2', '4am_wadiya-idmajiya-muthallathat_P3'], sourceElementIds: ['situation'] },
    // Module 1 — مبتدئ : un réverbère de 3 m planté à 89 m du مقام (nombres de la plateforme, alignement à 3 m : tan x = 1).
    {
      kind: 'manipulation', code: 'clinometer-maqam-mubtadi', type: 'clinometer', module: 1, level: 'beginner',
      title: 'عمود إنارة طوله 3 أمتار على بعد 89 مترا من «مقام الشهيد»',
      objective: 'ترييض خط النظر بمثلثين في وضعية طالس ثم بمثلث قائم: حساب ارتفاع لا نصل إليه وقيس زاوية النظر',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'maqam' },
      learningPointIds: ['4am_wadiya-idmajiya-muthallathat_P1', '4am_wadiya-idmajiya-muthallathat_P2'],
      sourceElementIds: ['situation'],
    },
    // Module 1 — متقدم : la وضعية du manuel (poteau 2,30 m à 95,65 m, أريس à 2,45 m du poteau).
    {
      kind: 'manipulation', code: 'clinometer-maqam-wadiya', type: 'clinometer', module: 1, level: 'advanced',
      title: 'وضعية الكتاب: عمود كهربائي طوله 2,30 مترا على بعد 95,65 مترا من «مقام الشهيد»',
      objective: 'ترييض خط النظر بمثلثين في وضعية طالس ثم بمثلث قائم: حساب ارتفاع لا نصل إليه وقيس زاوية النظر',
      autonomy: 'وضعية الكتاب: أعداد عشرية وموضع غير مقترح؛ التلميذ يبحث بنفسه عن المكان الذي يختفي فيه رأس المقام خلف رأس العمود، ثم يقرأ المثلثين ويحسب الارتفاع والزاوية ويدوّر في آخر الحساب',
      experience: { type: 'textbook', reason: '', theme: 'maqam' },
      learningPointIds: ['4am_wadiya-idmajiya-muthallathat_P1', '4am_wadiya-idmajiya-muthallathat_P2', '4am_wadiya-idmajiya-muthallathat_P3'],
      sourceElementIds: ['situation'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'سبع عبارات: صحيح أم خاطئ؟ خاصية طالس في خط النظر، تعريف النسب المثلثية، مجهول في المقام، الحاسبة، فيثاغورس في مجسّم، التدوير، والعلاقة بين الجيب وجيب التمام.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'al-wadiya', path: `${LESSON_BASE_PATH}/al-wadiya`,
      title: 'الوضعية وتحليلها', desc: 'ارتفاع «مقام الشهيد» بعمود كهربائي وخط نظر: قراءة الوضعية، اختيار خاصية طالس ثم الظل، حساب الارتفاع وقيس الزاوية x وتدويرهما، والتحقّق من ملاءمة النتيجة.',
      stage: 'trigger', teachesLearningPointIds: ['4am_wadiya-idmajiya-muthallathat_P1', '4am_wadiya-idmajiya-muthallathat_P2', '4am_wadiya-idmajiya-muthallathat_P3'],
      color: 'amber', style: 'featured', estimatedMin: 20, difficulty: 3, actionText: 'أقرأ الوضعية' },
    { id: '02', number: 2, slug: 'uakkid', path: `${LESSON_BASE_PATH}/uakkid`,
      title: 'أؤكّد تعلّماتي', desc: 'ستة أسئلة من الكتاب؛ عند الحاجة أعود إلى الدرس.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_wadiya-idmajiya-muthallathat_P1'], color: 'sky', style: 'featured', estimatedMin: 10, difficulty: 2, actionText: 'أؤكّد' },
    { id: '03', number: 3, slug: 'atamaqq', path: `${LESSON_BASE_PATH}/atamaqq`,
      title: 'أتعمّق', desc: 'قطر متوازي مستطيلات وزاويته (التمرين 31)، وارتفاع هرم خوفو (التمرين 32).',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_wadiya-idmajiya-muthallathat_P1', '4am_wadiya-idmajiya-muthallathat_P2', '4am_wadiya-idmajiya-muthallathat_P3'],
      color: 'rose', style: 'featured', estimatedMin: 11, difficulty: 4, actionText: 'أتعمّق' },
    { id: '04', number: 4, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'وضعية أخرى: مئذنة جامع الجزائر بعمود إنارة، وقطر حاوية.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 8, difficulty: 4, actionText: 'أحلّ' },
  ],
};
