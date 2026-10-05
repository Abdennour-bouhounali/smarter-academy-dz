/**
 * أدمج تعلّماتي — الوحدة 14 « الهندسة في الفضاء » (kind: synthesis)
 * Manuel 4AM, unité 14 : le scan (pp. 163–169) n'a ni « أؤكّد تعلّماتي », ni « أدمج تعلّماتي », ni « أتعمّق »
 * (extraction.json › scope, missingPages) ; la وضعية de synthèse est le تحدّ de la page d'ouverture (p. 163 : le seau en
 * مخروط مبتور — extraction › destinations › challenge → module 1). Tout le reste est un AJOUT DÉCLARÉ de la plateforme
 * (`synthesis_generation`, `prerequisite_diagnostic`). Ce n'est PAS un cinquième درس.
 *
 * Le parcours demandé par le propriétaire, phase par phase :
 *   RÉEL               module 1 — un seau d'eau (le تحدّ) : Ø 40 cm au bord, Ø 30 cm au fond, l'eau 7 cm sous le bord
 *   DÉCOUVRIR          module 1 — le lab : l'élève fait monter l'eau au niveau du dessin, puis cherche le sommet du cône
 *   MANIPULER          module 1 — UN workspace, le lab `bucket-fill` (écrit pour cette leçon, vraie scène 3D) : l'eau, le sommet S
 *                      descendu sur l'axe jusqu'à ce que les génératrices passent par le bord, la méthode de calcul choisie
 *                      (مبتدئ : un petit seau de plage plein, 3 / 4 / 6 ; متقدم : le تحدّ)
 *   COMPRENDRE         module 1 — étapes 1–2 : lire le dessin (les cotes empilées), la forme de l'eau (un autre tronc de cône)
 *   TOUCHER LES MATHS  module 1 — étapes 3–5 : Thalès dans la coupe axiale (SO = 105, ρ = 19), la réduction k = 15/19
 *   FORMALISER         module 1 — étapes 6–8 : V = V₁ − V₂ = V₁(1 − k³) = 24388π/3 ≈ 25,54 L, la vérification, les briques
 *   AUTOMATISER        module 2 — « أؤكّد تعلّماتي » : cinq QCM de la plateforme, chacun renvoyé à son درس
 *   TRANSFÉRER         module 3 — « أتعمّق » : la وضعية transposée (une boule de glace qui fond dans un cornet : boule + cône +
 *                      réduction) ; module 4 — un verre de frappé à Oran en « إختبار أولي » (réponses nulle part ailleurs)
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/handasa/wadiya-idmajiya-fada';

export const LESSON_CONFIG = {
  id: 'wadiya-idmajiya-fada',
  kind: 'synthesis',
  unit: 'handasa-fada',
  unitTitle: 'الهندسة في الفضاء',
  sequentialUnlock: true,
  title: 'أدمج تعلّماتي — ترييض وضعيات فضائية مركبة بتوظيف المقاطع والحجوم والتكبير والتصغير',
  description: 'إدماج المعارف: دلو ماء على شكل مخروط مبتور (تحدّي الوحدة) — نكمل المخروط بخاصية طالس في المقطع المحوري، ونحسب حجم الماء كفرق حجمي مخروطين أحدهما تصغير للآخر (k³)، بالتحليل المنهجي (قراءة · تحليل · تنفيذ)، يسبقها اختبار «أؤكّد تعلّماتي» الذي يعيد كل سؤال إلى درسه.',
  level: 'moyen',
  grade: '4am',
  chapter: 'handasa',
  chapterTitle: 'ميدان الهندسة',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🪣',
  estimatedDurationMin: 55,
  textbookRef: { unit: 14, pages: '163' },
  skills: [
    'تجنيد موارد الوحدة (الكرة والجلة، المساحة والحجم، المقاطع المستوية، التكبير والتصغير) لحل وضعية فضائية مركبة: حجم الماء في دلو',
    'قراءة الوضعية وتحليلها: قراءة أبعاد الشكل، نمذجة الماء بمخروط مبتور، والربط بين المخروط الكامل والمخروط المقتطع منه',
    'اختيار استراتيجية الحل وتنفيذها: خاصية طالس في المقطع المحوري، حجم المخروط، نسبة التصغير k وأثرها k³ على الحجوم، ثم التدوير والتحويل إلى اللتر',
  ],
  teachingScope: {
    include: ['أدمج تعلّماتي: تحدّي الوحدة (الدلو) وتحليله في ثلاث مراحل', 'أؤكّد تعلّماتي: 5 أسئلة يعيد كل منها إلى درسه', 'أتعمّق: وضعية مركبة أخرى (كرة مثلجات تذوب في مخروط)'],
    exclude: ['أي مفهوم جديد', 'صيغة حجم المخروط المبتور كقانون للحفظ (خارج البرنامج)', 'المساحة الجانبية للمخروط'],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Ce que la وضعية, « أؤكّد تعلّماتي » et « أتعمّق » mobilisent, diagnostiqué par « أستعدّ » (affirmations de la plateforme) :
  // la كرة et la جلّة (درس 1), l'aire et le volume (درس 2), les sections (درس 3), l'effet de k (درس 4), le volume du cône,
  // Thalès (unité 9) et le litre.
  priorKnowledge: ['kura-julla', 'misaha-kura', 'hajm-julla', 'maqta-kura', 'maqta-mukhrut', 'takbir-k3', 'hajm-makhrut', 'talis', 'litr'],
  resources: [
    { kind: 'situation', code: 'situation-dalw', module: 1, title: 'وضعية: حجم الماء في دلو على شكل مخروط مبتور', learningPointIds: ['4am_wadiya-idmajiya-fada_P1', '4am_wadiya-idmajiya-fada_P2', '4am_wadiya-idmajiya-fada_P3'], sourceElementIds: ['challenge'] },
    // Module 1 — مبتدئ : un petit seau de plage plein (nombres de la plateforme : r = 3, R = 4, H = 6 ⇒ SO = 18, k = 3/4, 74π).
    {
      kind: 'manipulation', code: 'bucket-fill-small', type: 'bucket-fill', module: 1, level: 'beginner',
      title: 'دلو رمل صغير ممتلئ (مثال من المنصّة)',
      objective: 'حساب حجم ماء في دلو على شكل مخروط مبتور: نكمل المخروط بخاصية طالس، والمخروط الصغير تصغير للكبير نسبته k، فحجم الماء هو حجم الكبير مضروبا في (1 − k³)',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'beach-bucket' },
      learningPointIds: ['4am_wadiya-idmajiya-fada_P2', '4am_wadiya-idmajiya-fada_P3'],
      sourceElementIds: ['challenge'],
    },
    // Module 1 — متقدم : le تحدّ du manuel (Ø 40 / Ø 30, H = 35, eau sur 28 cm).
    {
      kind: 'manipulation', code: 'bucket-fill-challenge', type: 'bucket-fill', module: 1, level: 'advanced',
      title: 'تحدّي الكتاب: دلو قطراه 40 و 30 سنتيمترا، والماء على بعد 7 سنتيمترات من الحافة',
      objective: 'حساب حجم ماء في دلو على شكل مخروط مبتور: نكمل المخروط بخاصية طالس، والمخروط الصغير تصغير للكبير نسبته k، فحجم الماء هو حجم الكبير مضروبا في (1 − k³)',
      autonomy: 'تحدّي الكتاب بأعداده: مستوى الماء يُقرأ من الشكل (من الحافة لا من القاع)، والرأس S يُبحث عنه على مجال واسع حتى يمرّ الخطّان بحافة الدلو، ثم يختار التلميذ بنفسه طريقة حساب الحجم بين أربع طرائق قبل أن يرى الحجم',
      experience: { type: 'textbook', reason: '', theme: 'beach-bucket' },
      learningPointIds: ['4am_wadiya-idmajiya-fada_P1', '4am_wadiya-idmajiya-fada_P2', '4am_wadiya-idmajiya-fada_P3'],
      sourceElementIds: ['challenge'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'تسع عبارات: صحيح أم خاطئ؟ الكرة والجلة، مساحة الكرة وحجم الجلة، مقطع كرة ومقطع مخروط، أثر التكبير على الحجم، حجم المخروط، خاصية طالس، واللتر.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'al-wadiya', path: `${LESSON_BASE_PATH}/al-wadiya`,
      title: 'الوضعية وتحليلها', desc: 'الدلو المملوء بالماء: قراءة الشكل، شكل الماء، إكمال المخروط بخاصية طالس، نسبة التصغير k، ثم حجم الماء كفرق حجمي مخروطين، باللتر.',
      stage: 'trigger', teachesLearningPointIds: ['4am_wadiya-idmajiya-fada_P1', '4am_wadiya-idmajiya-fada_P2', '4am_wadiya-idmajiya-fada_P3'],
      color: 'amber', style: 'featured', estimatedMin: 22, difficulty: 3, actionText: 'أقرأ الوضعية' },
    { id: '02', number: 2, slug: 'uakkid', path: `${LESSON_BASE_PATH}/uakkid`,
      title: 'أؤكّد تعلّماتي', desc: 'خمسة أسئلة من المنصّة، سؤال لكل فكرة من دروس الوحدة؛ عند الحاجة أعود إلى الدرس.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_wadiya-idmajiya-fada_P1'], color: 'sky', style: 'featured', estimatedMin: 9, difficulty: 2, actionText: 'أؤكّد' },
    { id: '03', number: 3, slug: 'atamaqq', path: `${LESSON_BASE_PATH}/atamaqq`,
      title: 'أتعمّق', desc: 'وضعية مركبة أخرى: كرة مثلجات تذوب داخل مخروط بسكويت — حجم الجلة، حجم المخروط، ونسبة التصغير من نسبة الحجمين.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_wadiya-idmajiya-fada_P1', '4am_wadiya-idmajiya-fada_P3'],
      color: 'rose', style: 'featured', estimatedMin: 11, difficulty: 4, actionText: 'أتعمّق' },
    { id: '04', number: 4, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'وضعية أخرى: كأس فرابيه على شكل مخروط مبتور في مقهى بوهران.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 7, difficulty: 4, actionText: 'أحلّ' },
  ],
};
