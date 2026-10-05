/**
 * أدمج تعلّماتي — الوحدة 13 « الدوران - الزوايا - المضلّعات المنتظمة » (kind: synthesis)
 * Manuel 4AM, unité 13 : « أؤكّد تعلّماتي » (QCM 1–4, p. 160), « أدمج تعلّماتي » (وضعية « الحديقة العمومية » + تحليل الوضعية,
 * p. 160), « أتعمّق » (ex. 15 et 20, p. 161) — extraction.json › destinations. Ce n'est PAS un cinquième درس.
 *
 * Le parcours demandé par le propriétaire, phase par phase :
 *   RÉEL               module 1 — la commune entoure un massif de fleurs de 3 m de six lampadaires également espacés
 *   DÉCOUVRIR          module 1 — le lab : l'élève pose les poteaux à la main, « أشعل » refuse des écarts inégaux
 *   MANIPULER          module 1 — UN workspace, le lab `lamp-ring` (écrit pour cette leçon) : le دوران pose chaque poteau comme
 *                      image du précédent, le tour ne se referme que si n·α = 360°, puis la distance se calcule dans le triangle
 *                      (مبتدئ : 4 poteaux sur 2 m ; متقدم : la وضعية, 6 sur 3 m, puis 12 en extra)
 *   COMPRENDRE         module 1 — étapes 1–4 : la forme, l'hexagone régulier, l'angle de 60°, les écarts égaux par le دوران
 *   TOUCHER LES MATHS  module 1 — étapes 5–6 : le triangle équilatéral (d = r = 3 m), puis le triangle rectangle et le sinus
 *   FORMALISER         module 1 — les briques et les trois phases du manuel (قراءة · تحليل · تنفيذ), le plan au compas
 *   AUTOMATISER        module 2 — « أؤكّد تعلّماتي » : les quatre QCM (l'item 1 corrigé), chacun renvoyé à son درس
 *   TRANSFÉRER         module 3 — « أتعمّق » : ex. 15 (cinq دورانات de 72° ⇒ pentagone régulier, corrigé BCDEF), ex. 20 (BEM :
 *                      angle inscrit, translation, Thales) ; module 4 — la وضعية TRANSPOSÉE (8 lampadaires autour d'un
 *                      rond-point d'Oran) en « إختبار أولي »
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/handasa/wadiya-idmajiya-dawaran';

export const LESSON_CONFIG = {
  id: 'wadiya-idmajiya-dawaran',
  kind: 'synthesis',
  unit: 'dawaran-mudalaat',
  unitTitle: 'الدوران - الزوايا - المضلّعات المنتظمة',
  sequentialUnlock: true,
  title: 'أدمج تعلّماتي — ترييض وضعيات هندسية مركبة بتوظيف الدوران والمضلعات المنتظمة',
  description: 'إدماج المعارف: ستة أعمدة إنارة متباعدة بنفس المسافة حول حيّز دائري لغرس الأزهار (الدوران، الزاوية المركزية، المضلع المنتظم، والنسب المثلثية في المثلث القائم) — بالتحليل المنهجي (قراءة · تحليل · تنفيذ)، يسبقها اختبار «أؤكّد تعلّماتي» الذي يعيد كل سؤال إلى درسه.',
  level: 'moyen',
  grade: '4am',
  chapter: 'handasa',
  chapterTitle: 'ميدان الهندسة',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🌸',
  estimatedDurationMin: 55,
  textbookRef: { unit: 13, pages: '160, 161' },
  skills: [
    'تجنيد الدوران وخواصه والزاوية المركزية والمضلعات المنتظمة لحل وضعية مركبة: توزيع أعمدة إنارة بانتظام حول حيّز دائري',
    'قراءة الوضعية وتحليلها: نمذجة الأعمدة برؤوس مضلع منتظم محاط بدائرة، وتحديد عدد الأعمدة ونصف القطر وزاوية الدوران',
    'اختيار استراتيجية الحل وتنفيذها: إنشاء المضلع المنتظم بمقياس مناسب، وحساب المسافة بين عمودين في المثلث القائم بالنسب المثلثية وتفسير النتيجة',
  ],
  teachingScope: {
    include: ['أدمج تعلّماتي: وضعية «الحديقة العمومية» وتحليلها في ثلاث مراحل', 'أؤكّد تعلّماتي: 4 أسئلة يعيد كل منها إلى درسه', 'أتعمّق: التمرينان 15 (خماسي منتظم بدورانات متتالية) و 20 (شهادة التعليم المتوسط)'],
    exclude: ['أي مفهوم جديد', 'التحويلات المركبة (تركيب دورانين)', 'طول القوس كمفهوم مستقل عن محيط الدائرة'],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Ce que la وضعية, « أؤكّد تعلّماتي » et « أتعمّق » mobilisent, diagnostiqué par « أستعدّ » (affirmations de la plateforme) :
  // l'image par un دوران et ses propriétés, l'angle inscrit et l'angle au centre, l'angle au centre 360°/n et la définition d'un
  // polygone régulier — les dourous 1 à 4 —, les angles et la hauteur d'un triangle isocèle, le sinus (unité 10), le cercle.
  priorKnowledge: ['sura-dawaran', 'khawas-dawaran-atwal', 'zawiya-muhitiya-markaziya', 'zawiya-markaziya-muntazam', 'mudalla-muntazam', 'zawaya-mutasawi-saqayn', 'irtifa-mutasawi-saqayn', 'jaib-zawiya', 'muhit-daira'],
  resources: [
    { kind: 'situation', code: 'situation-hadiqa-umumiya', module: 1, title: 'وضعية: أعمدة الإنارة حول حوض الأزهار في الحديقة العمومية', learningPointIds: ['4am_wadiya-idmajiya-dawaran_P1', '4am_wadiya-idmajiya-dawaran_P2', '4am_wadiya-idmajiya-dawaran_P3'], sourceElementIds: ['situation'] },
    // Module 1 — مبتدئ : un petit massif (2 m) et 4 lampadaires (nombres de la plateforme : un carré, 2√2 m).
    {
      kind: 'manipulation', code: 'lamp-ring-4', type: 'lamp-ring', module: 1, level: 'beginner',
      title: 'حوض صغير وأربعة أعمدة (مثال من المنصّة)',
      objective: 'توزيع n عمودا بانتظام على دائرة: كل عمود صورة السابق بالدوران الذي زاويته 360°/n، والمسافة بين عمودين متتاليين تُحسب في المثلث القائم',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'flower-bed' },
      learningPointIds: ['4am_wadiya-idmajiya-dawaran_P2', '4am_wadiya-idmajiya-dawaran_P3'],
      sourceElementIds: ['situation'],
    },
    // Module 1 — متقدم : la وضعية du manuel (6 lampadaires, 3 m), puis 12 en extra.
    {
      kind: 'manipulation', code: 'lamp-ring-6', type: 'lamp-ring', module: 1, level: 'advanced',
      title: 'وضعية الكتاب: ستة أعمدة حول حيّز نصف قطره 3m',
      objective: 'توزيع n عمودا بانتظام على دائرة: كل عمود صورة السابق بالدوران الذي زاويته 360°/n، والمسافة بين عمودين متتاليين تُحسب في المثلث القائم',
      autonomy: 'وضعية الكتاب: ستة أعمدة تُوضع باليد دون اقتراح (يُرفض كل توزيع غير متساوي المسافات)، ثم عمود ثان واحد يحدّد زاوية الدوران دون قيمة مقترحة (تبقى الحلقة مفتوحة إن لم تكن 6 × α = 360°)، ثم يختار التلميذ طريقة حساب المسافة بنفسه بين أربع طرائق، ثم يغيّر عدد الأعمدة',
      experience: { type: 'textbook', reason: '', theme: 'flower-bed' },
      learningPointIds: ['4am_wadiya-idmajiya-dawaran_P1', '4am_wadiya-idmajiya-dawaran_P2', '4am_wadiya-idmajiya-dawaran_P3'],
      sourceElementIds: ['situation'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'تسع عبارات: صحيح أم خاطئ؟ صورة نقطة بدوران، الدوران يحافظ على الأطوال، الزاوية المحيطية والمركزية، الزاوية المركزية لمضلع منتظم وتعريفه، زوايا المثلث المتساوي الساقين وارتفاعه، الجيب، ومحيط الدائرة.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'al-wadiya', path: `${LESSON_BASE_PATH}/al-wadiya`,
      title: 'الوضعية وتحليلها', desc: 'أعمدة الإنارة حول حوض الأزهار: قراءة الوضعية، السداسي المنتظم والدوران الذي زاويته 60°، المسافة بين عمودين في المثلث المتقايس الأضلاع ثم في المثلث القائم، والمخطط بمقياس.',
      stage: 'trigger', teachesLearningPointIds: ['4am_wadiya-idmajiya-dawaran_P1', '4am_wadiya-idmajiya-dawaran_P2', '4am_wadiya-idmajiya-dawaran_P3'],
      color: 'amber', style: 'featured', estimatedMin: 22, difficulty: 3, actionText: 'أقرأ الوضعية' },
    { id: '02', number: 2, slug: 'uakkid', path: `${LESSON_BASE_PATH}/uakkid`,
      title: 'أؤكّد تعلّماتي', desc: 'أربعة أسئلة من الكتاب؛ عند الحاجة أعود إلى الدرس.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_wadiya-idmajiya-dawaran_P1'], color: 'sky', style: 'featured', estimatedMin: 9, difficulty: 2, actionText: 'أؤكّد' },
    { id: '03', number: 3, slug: 'atamaqq', path: `${LESSON_BASE_PATH}/atamaqq`,
      title: 'أتعمّق', desc: 'خماسي منتظم بدورانات متتالية (التمرين 15)، وزاوية محيطية وانسحاب وخاصية طالس (التمرين 20، شهادة التعليم المتوسط).',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_wadiya-idmajiya-dawaran_P1', '4am_wadiya-idmajiya-dawaran_P3'],
      color: 'rose', style: 'featured', estimatedMin: 11, difficulty: 4, actionText: 'أتعمّق' },
    { id: '04', number: 4, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'وضعية أخرى: أعمدة الإنارة حول دوّار بوهران.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 7, difficulty: 4, actionText: 'أحلّ' },
  ],
};
