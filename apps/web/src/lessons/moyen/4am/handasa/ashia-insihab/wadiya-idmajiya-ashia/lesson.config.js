/**
 * أدمج تعلّماتي — الوحدة 11 « الأشعة والانسحاب » (kind: synthesis)
 * Manuel 4AM, unité 11 : « أؤكّد تعلّماتي » (QCM 1–7, p. 136), « أدمج تعلّماتي » (وضعية « ممر الراجلين » + تحليل
 * الوضعية, p. 136), « أتعمّق » (ex. 19 et 22, p. 137) — extraction.json › destinations. Ce n'est PAS un cinquième درس.
 *
 * Le parcours demandé par le propriétaire, phase par phase :
 *   RÉEL               module 1 — la commune place un passage piéton devant l'école : le plus court trajet du quartier
 *   DÉCOUVRIR          module 1 — le lab : l'élève déplace le passage, lit la longueur du trajet, en essaie plusieurs
 *   MANIPULER          module 1 — UN workspace, le lab `bridge-path` (écrit pour cette leçon) : il porte B sur B′ par la
 *                      translation de vecteur NM (refusée si BB′ ≠ NM), puis redresse la ligne A–M–B′
 *                      (مبتدئ : une passerelle sur la gorge du Rhummel ; متقدم : la وضعية avec l'exemple de l'extraction)
 *   COMPRENDRE         module 1 — étapes 1–3 : ce qui est fixe / variable, la distance entre deux parallèles, la ligne droite
 *   TOUCHER LES MATHS  module 1 — étapes 4–7 : MB′BN متوازي أضلاع, NB = MB′, M sur [AB′], AB′ = √85 par Pythagore
 *   FORMALISER         module 1 — les briques et les trois phases du manuel (قراءة · تحليل · تنفيذ)
 *   AUTOMATISER        module 2 — « أؤكّد تعلّماتي » : les sept QCM, chacun renvoyé à son درس
 *   TRANSFÉRER         module 3 — « أتعمّق » : ex. 19 (BEM : translations, carré, somme de trois vecteurs), ex. 22 (milieux
 *                      d'un quadrilatère) ; module 4 — la وضعية TRANSPOSÉE (passerelle sur l'autoroute à Oran) en « إختبار أولي »
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/handasa/wadiya-idmajiya-ashia';

export const LESSON_CONFIG = {
  id: 'wadiya-idmajiya-ashia',
  kind: 'synthesis',
  unit: 'ashia-insihab',
  unitTitle: 'الأشعة والانسحاب',
  sequentialUnlock: true,
  title: 'أدمج تعلّماتي — ترييض وضعية هندسية مركبة بتوظيف الأشعة والانسحاب',
  description: 'إدماج المعارف: أقصر مسلك يعبر ممرا للراجلين بين حافتين متوازيتين (الانسحاب، تساوي شعاعين، متوازي الأضلاع، والخط المستقيم) — بالتحليل المنهجي (قراءة · تحليل · تنفيذ)، يسبقها اختبار «أؤكّد تعلّماتي» الذي يعيد كل سؤال إلى درسه.',
  level: 'moyen',
  grade: '4am',
  chapter: 'handasa',
  chapterTitle: 'ميدان الهندسة',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🌉',
  estimatedDurationMin: 55,
  textbookRef: { unit: 11, pages: '136, 137' },
  skills: [
    'تجنيد الانسحاب وتساوي شعاعين ومتوازي الأضلاع وعلاقة شال لحل وضعية مركبة: أقصر مسلك يعبر ممرا عموديا على حافتين متوازيتين',
    'قراءة الوضعية وتحليلها: التعبير عن طول المسلك بـ AM + MN + NB، وتعيين النقط الثابتة والمتغيّرة، ونمذجة المشكلة بشكل',
    'اختيار استراتيجية الحل وتنفيذها: إنشاء B′ صورة B بالانسحاب الذي شعاعه NM، واستعمال متوازي الأضلاع والخط المستقيم لتعيين M و N وحساب أقصر طول',
  ],
  teachingScope: {
    include: ['أدمج تعلّماتي: وضعية «ممر الراجلين» وتحليلها في ثلاث مراحل', 'أؤكّد تعلّماتي: 7 أسئلة يعيد كل منها إلى درسه', 'أتعمّق: التمرينان 19 (شهادة التعليم المتوسط) و 22 (منتصفات أضلاع رباعي)'],
    exclude: ['أي مفهوم جديد', 'ضرب شعاع في عدد حقيقي', 'الأشعة في معلم (الوحدة 12)'],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Ce que la وضعية, « أؤكّد تعلّماتي » et « أتعمّق » mobilisent, diagnostiqué par « أستعدّ » (affirmations de la
  // plateforme) : deux vecteurs égaux, l'image par une translation, AB = DC ⇔ ABCD متوازي أضلاع (l'ordre), Chasles —
  // les dourous 1 à 3 —, la distance entre deux parallèles, l'inégalité triangulaire, Pythagore, la droite des milieux.
  priorKnowledge: ['tasawi-shuaayn', 'sura-insihab', 'mutawazi-tartib', 'alaqat-shal', 'bud-mutawaziyayn', 'mutabayina-muthallathiya', 'fithaghuris', 'mustaqim-muntasafayn'],
  resources: [
    { kind: 'situation', code: 'situation-mamar-rajilin', module: 1, title: 'وضعية: ممر الراجلين أمام المدرسة', learningPointIds: ['4am_wadiya-idmajiya-ashia_P1', '4am_wadiya-idmajiya-ashia_P2', '4am_wadiya-idmajiya-ashia_P3'], sourceElementIds: ['situation'] },
    // Module 1 — مبتدئ : une passerelle sur la gorge du Rhummel (nombres de la plateforme, fantôme de NM attaché à B).
    {
      kind: 'manipulation', code: 'bridge-path-rhummel', type: 'bridge-path', module: 1, level: 'beginner',
      title: 'جسر للراجلين فوق وادي الرمال بقسنطينة (مثال من المنصّة)',
      objective: 'أقصر مسلك يعبر ممرا عموديا على حافتين متوازيتين: ننقل B بالانسحاب الذي شعاعه NM إلى B′ ثم تكون M على [AB′]',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'bridge' },
      learningPointIds: ['4am_wadiya-idmajiya-ashia_P2', '4am_wadiya-idmajiya-ashia_P3'],
      sourceElementIds: ['situation'],
    },
    // Module 1 — متقدم : la وضعية du manuel (rue, deux trottoirs, l'école) avec l'exemple chiffré de l'extraction.
    {
      kind: 'manipulation', code: 'bridge-path-mamar', type: 'bridge-path', module: 1, level: 'advanced',
      title: 'وضعية الكتاب: ممر الراجلين بين الحي والمدرسة',
      objective: 'أقصر مسلك يعبر ممرا عموديا على حافتين متوازيتين: ننقل B بالانسحاب الذي شعاعه NM إلى B′ ثم تكون M على [AB′]',
      autonomy: 'وضعية الكتاب: تسعة عشر موضعا للممر بخطوة نصف مربع، ولا شعاع مساعد عند B؛ التلميذ يقارن الأطوال بنفسه، ثم يضع B′ دون اقتراح (يُرفض كل شعاع يختلف عن NM في المنحى أو الاتجاه أو الطول)، ثم يجد الموضع الذي يستقيم فيه المسلك A ثم M ثم B′',
      experience: { type: 'textbook', reason: '', theme: 'crosswalk' },
      learningPointIds: ['4am_wadiya-idmajiya-ashia_P1', '4am_wadiya-idmajiya-ashia_P2', '4am_wadiya-idmajiya-ashia_P3'],
      sourceElementIds: ['situation'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'ثماني عبارات: صحيح أم خاطئ؟ تساوي شعاعين، صورة نقطة بانسحاب، متوازي الأضلاع وترتيب رؤوسه، علاقة شال، المسافة بين مستقيمين متوازيين، أقصر طريق بين نقطتين، خاصية فيثاغورس، ومستقيم المنتصفين.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'al-wadiya', path: `${LESSON_BASE_PATH}/al-wadiya`,
      title: 'الوضعية وتحليلها', desc: 'ممر الراجلين أمام المدرسة: قراءة الوضعية، تحويل المسلك بالانسحاب الذي شعاعه NM إلى مسلك له نفس الطول، تعيين M و N وحساب أقصر طول.',
      stage: 'trigger', teachesLearningPointIds: ['4am_wadiya-idmajiya-ashia_P1', '4am_wadiya-idmajiya-ashia_P2', '4am_wadiya-idmajiya-ashia_P3'],
      color: 'amber', style: 'featured', estimatedMin: 22, difficulty: 3, actionText: 'أقرأ الوضعية' },
    { id: '02', number: 2, slug: 'uakkid', path: `${LESSON_BASE_PATH}/uakkid`,
      title: 'أؤكّد تعلّماتي', desc: 'سبعة أسئلة من الكتاب؛ عند الحاجة أعود إلى الدرس.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_wadiya-idmajiya-ashia_P1'], color: 'sky', style: 'featured', estimatedMin: 10, difficulty: 2, actionText: 'أؤكّد' },
    { id: '03', number: 3, slug: 'atamaqq', path: `${LESSON_BASE_PATH}/atamaqq`,
      title: 'أتعمّق', desc: 'انسحابان ومربع ومجموع ثلاثة أشعة (التمرين 19، شهادة التعليم المتوسط)، ومنتصفات أضلاع رباعي (التمرين 22).',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_wadiya-idmajiya-ashia_P1', '4am_wadiya-idmajiya-ashia_P3'],
      color: 'rose', style: 'featured', estimatedMin: 10, difficulty: 4, actionText: 'أتعمّق' },
    { id: '04', number: 4, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'وضعية أخرى: جسر للراجلين فوق الطريق السيار بوهران.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 7, difficulty: 4, actionText: 'أحلّ' },
  ],
};
