/**
 * أدمج تعلّماتي — الوحدة 12 « الأشعة في معلم » (kind: synthesis)
 * Manuel 4AM, unité 12 : « أؤكّد تعلّماتي » (QCM 1–5, p. 148), « أدمج تعلّماتي » (وضعية « عدّاءان » + تحليل الوضعية, p. 148),
 * « أتعمّق » (ex. 22, 23 et 25, p. 149) — extraction.json › destinations. Ce n'est PAS un cinquième درس.
 *
 * Le parcours demandé par le propriétaire, phase par phase :
 *   RÉEL               module 1 — deux coureurs s'entraînent sur deux parcours dessinés dans un معلم : lequel est le plus court ?
 *   DÉCOUVRIR          module 1 — le lab : l'élève PARIE (à l'œil), puis découvre que l'œil ne tranche pas (9,42 contre 9,96)
 *   MANIPULER          module 1 — UN workspace, le lab `route-compare` (écrit pour cette leçon) : il construit chaque parcours
 *                      morceau par morceau — le CENTRE de chaque demi-cercle (l'arc ne se referme qu'au milieu du diamètre),
 *                      la balise suivante de la ligne brisée (composantes et √(Δx² + Δy²) sous la main) —, deux montres
 *                      additionnent (مبتدئ : un rallye au Sahara ; متقدم : la وضعية, le cross des Sablettes)
 *   COMPRENDRE         module 1 — étapes 1–2 : lire le texte et la figure, choisir les outils (milieu, π r, distance)
 *   TOUCHER LES MATHS  module 1 — étapes 3–6 : les points de (1) sur l'axe, les centres, 3π ; les sommets de (2), √13, √5, √17
 *   FORMALISER         module 1 — étapes 7–8 : la comparaison exacte puis approchée (arrondir à la fin), les briques
 *   AUTOMATISER        module 2 — « أؤكّد تعلّماتي » : les cinq QCM, chacun renvoyé à son درس
 *   TRANSFÉRER         module 3 — « أتعمّق » : ex. 22 (cercle, angles par la tangente), 23 (rectangle, aire, translation),
 *                      25 (شهادة التعليم المتوسط) ; module 4 — la وضعية TRANSPOSÉE (deux pistes de VTT à Constantine)
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/handasa/wadiya-idmajiya-maalam';

export const LESSON_CONFIG = {
  id: 'wadiya-idmajiya-maalam',
  kind: 'synthesis',
  unit: 'ashia-maalam',
  unitTitle: 'الأشعة في معلم',
  sequentialUnlock: true,
  title: 'أدمج تعلّماتي — ترييض وضعيات هندسية وحساب مسارات في معلم',
  description: 'إدماج المعارف: مقارنة طولي مسارين لعدّاءين في معلم (أنصاف دوائر مراكزها منتصفات، وقطع أطوالها مسافات بين نقطتين) — بالتحليل المنهجي (قراءة · تحليل · تنفيذ)، يسبقها اختبار «أؤكّد تعلّماتي» الذي يعيد كل سؤال إلى درسه، وتليها تمارين «أتعمّق» في إثبات طبيعة الأشكال بالحساب.',
  level: 'moyen',
  grade: '4am',
  chapter: 'handasa',
  chapterTitle: 'ميدان الهندسة',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🏃',
  estimatedDurationMin: 55,
  textbookRef: { unit: 12, pages: '148, 149' },
  skills: [
    'تجنيد موارد الوحدة (قراءة الإحداثيات والمركبات، إحداثيتا المنتصف، المسافة بين نقطتين، إثبات الخواص) لمقارنة طولي مسارين في معلم',
    'قراءة الوضعية وتحليلها: تفسير التمثيلين البيانيين، ترتيب المعطيات، وتعيين نقاط المسار على محور الفواصل',
    'تنفيذ الاستراتيجية: حساب مراكز أنصاف الدوائر وأطوالها وأطوال القطع، ثم المقارنة بالقيم المضبوطة والمقرّبة وتفسير النتيجة',
  ],
  teachingScope: {
    include: ['أدمج تعلّماتي: وضعية «عدّاءان» وتحليلها في ثلاث مراحل', 'أؤكّد تعلّماتي: 5 أسئلة يعيد كل منها إلى درسه', 'أتعمّق: التمارين 22 و 23 و 25 (شهادة التعليم المتوسط)'],
    exclude: ['أي مفهوم جديد', 'الجداء السلمي', 'معادلة دائرة أو مستقيم'],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Ce que la وضعية, « أؤكّد تعلّماتي » et « أتعمّق » mobilisent, diagnostiqué par « أستعدّ » (affirmations de la plateforme) :
  // lire un point (درس 1), les composantes (درس 2), le milieu et la distance (درس 3), la nature par le calcul (درس 4), la longueur
  // d'un demi-cercle et la valeur approchée d'une racine (années précédentes), l'ordre des sommets (الوحدة 11).
  priorKnowledge: ['ihdathiyat-nuqta', 'hisab-murakkibat', 'muntasaf-qita', 'masafa-nuqtatayn', 'tul-nisf-daira', 'aks-fithaghuris', 'qima-muqarraba', 'mutawazi-tartib'],
  resources: [
    { kind: 'situation', code: 'situation-addaan', module: 1, title: 'وضعية: عدّاءان ومساران', learningPointIds: ['4am_wadiya-idmajiya-maalam_P1', '4am_wadiya-idmajiya-maalam_P2', '4am_wadiya-idmajiya-maalam_P3'], sourceElementIds: ['situation'] },
    // Module 1 — مبتدئ : un rallye au Sahara (nombres de la plateforme : deux morceaux par parcours, A et B communs).
    {
      kind: 'manipulation', code: 'route-compare-rally', type: 'route-compare', module: 1, level: 'beginner',
      title: 'رالي في الصحراء: مساران بين المخيّم والواحة (مثال من المنصّة)',
      objective: 'نقارن طولي مسارين في معلم: طول القطعة هو المسافة بين طرفيها، ونصف الدائرة مركزه منتصف قطرها وطوله πr، ثم نجمع ونقارن',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'rally' },
      learningPointIds: ['4am_wadiya-idmajiya-maalam_P2', '4am_wadiya-idmajiya-maalam_P3'],
      sourceElementIds: ['situation'],
    },
    // Module 1 — متقدم : la وضعية du manuel (p. 148) — trois demi-cercles contre une ligne brisée.
    {
      kind: 'manipulation', code: 'route-compare-addaan', type: 'route-compare', module: 1, level: 'advanced',
      title: 'وضعية الكتاب: عدّاءان ومساران في معلم',
      objective: 'نقارن طولي مسارين في معلم: طول القطعة هو المسافة بين طرفيها، ونصف الدائرة مركزه منتصف قطرها وطوله πr، ثم نجمع ونقارن',
      autonomy: 'وضعية الكتاب: ثلاثة أنصاف دوائر بلا علامة عند نقاط الالتقاء وثلاث قطع، ومساران لا يبدآن من نفس النقطة؛ التلميذ يجد بنفسه كل مركز (منتصف القطر، بخطوة نصف مربع) وكل طرف قطعة، ثم يقارن طولين متقاربين (حوالي 9,42 و 9,96) لا تفصل بينهما العين',
      experience: { type: 'textbook', reason: '', theme: 'cross' },
      learningPointIds: ['4am_wadiya-idmajiya-maalam_P1', '4am_wadiya-idmajiya-maalam_P2', '4am_wadiya-idmajiya-maalam_P3'],
      sourceElementIds: ['situation'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'ثماني عبارات: صحيح أم خاطئ؟ قراءة نقطة، مركبتا شعاع، المنتصف، المسافة، طول نصف دائرة، عكس فيثاغورس، القيمة المقرّبة، وترتيب رؤوس متوازي الأضلاع.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'al-wadiya', path: `${LESSON_BASE_PATH}/al-wadiya`,
      title: 'الوضعية وتحليلها', desc: 'عدّاءان ومساران في معلم: قراءة الوضعية، تفسير التمثيلين البيانيين، ثم حساب طول المسار (1) بأنصاف الدوائر وطول المسار (2) بالمسافات، والمقارنة.',
      stage: 'trigger', teachesLearningPointIds: ['4am_wadiya-idmajiya-maalam_P1', '4am_wadiya-idmajiya-maalam_P2', '4am_wadiya-idmajiya-maalam_P3'],
      color: 'amber', style: 'featured', estimatedMin: 22, difficulty: 3, actionText: 'أقرأ الوضعية' },
    { id: '02', number: 2, slug: 'uakkid', path: `${LESSON_BASE_PATH}/uakkid`,
      title: 'أؤكّد تعلّماتي', desc: 'خمسة أسئلة من الكتاب؛ عند الحاجة أعود إلى الدرس.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_wadiya-idmajiya-maalam_P2', '4am_wadiya-idmajiya-maalam_P3'], color: 'sky', style: 'featured', estimatedMin: 9, difficulty: 2, actionText: 'أؤكّد' },
    { id: '03', number: 3, slug: 'atamaqq', path: `${LESSON_BASE_PATH}/atamaqq`,
      title: 'أتعمّق', desc: 'دائرة وزوايا (التمرين 22)، مستطيل ومساحة وانسحاب (التمرين 23)، ومستطيل من شهادة التعليم المتوسط (التمرين 25).',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_wadiya-idmajiya-maalam_P1', '4am_wadiya-idmajiya-maalam_P3'],
      color: 'rose', style: 'featured', estimatedMin: 11, difficulty: 4, actionText: 'أتعمّق' },
    { id: '04', number: 4, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'وضعية أخرى: مسلكان للدراجات الجبلية في غابة جبل الوحش بقسنطينة.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 7, difficulty: 4, actionText: 'أحلّ' },
  ],
};
