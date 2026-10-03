/**
 * الدرس 3 — إنشاءات هندسية وتطبيقات خاصية طالس (تقسيم قطعة مستقيم) (unité 9 « خاصية طالس », manuel pp. 103–113).
 * La leçon n'a PAS d'activité du manuel : son entrée est le laboratoire `segment-divider` (déclaré
 * `platform_adaptation`, comme `tarrid-mushkila` de l'unité 4) ; ses éléments du manuel sont des طرائق
 * (pp. 107, 109), un دوري الآن (p. 109), quatre exercices (17, 18, 19 p. 111 ; 21 p. 113) et l'item 4 du QCM
 * (p. 112) — extraction › destinations.
 *
 * Le parcours, module par module (REAL → DISCOVER → MANIPULATE → UNDERSTAND → TOUCH → FORMALIZE → AUTOMATIZE → TRANSFER) :
 *   0 أستعدّ               diagnostic : parallèle à l'équerre, report au compas, proportion, Thalès (L1),
 *                          réciproque (L2), droite des milieux, Pythagore
 *   1 اللافتة (trigger)     REAL (le tifo du derby : 10 ÷ 3 ne se mesure pas) → MANIPULATE (règle, compas, équerre)
 *                          → UNDERSTAND (combien de marques, pourquoi Thalès, l'ouverture n'importe pas) →
 *                          la méthode du manuel (طرائق ص 107) révélée ligne à ligne
 *   2 طرائق (discovery)    TOUCH → FORMALIZE : le point de rapport 3/2 (ص 109) et le second point K/N, دوري الآن 2/5 au
 *                          laboratoire, la longueur 14/3 (ص 107), puis 2√13/3 (plateforme, déclaré)
 *   3 أوظّف (practice_lab)  AUTOMATIZE → TRANSFER : تمارين 17, 18, 19, 21
 *   4 إختبار أولي (evaluation)
 *
 * Le module 2 porte le stage `discovery` (comme les طرائق de `tawzif-khawass-judhur`) : la leçon a sa carte
 * des connaissances, qui formalise en continu — aucun module `formalization` n'est requis (validate-lessons).
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/handasa/inshaat-talis';

export const LESSON_CONFIG = {
  id: 'inshaat-talis',
  kind: 'lesson',
  unit: 'khassiyat-talis',
  unitTitle: 'خاصية طالس',
  sequentialUnlock: true,
  title: 'إنشاءات هندسية وتطبيقات خاصية طالس (تقسيم قطعة مستقيم)',
  description: 'بالمسطرة غير المدرجة والمدور فقط: نقسم قطعة مستقيم إلى قطع متقايسة أو بنسبة معطاة، وننشئ قطعة طولها معلوم بكسر مثل $\\dfrac{14}{3}$ ، ونبرّر كل إنشاء بخاصية طالس.',
  level: 'moyen',
  grade: '4am',
  chapter: 'handasa',
  chapterTitle: 'ميدان الهندسة',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🧭',
  estimatedDurationMin: 45,
  textbookRef: { unit: 9, activity: 0, pages: '107, 109, 111, 113' },
  skills: [
    'تقسيم قطعة مستقيم إلى قطع متقايسة بنصف مستقيم مساعد وموازيات، دون قياس',
    'تبرير التقسيم بخاصية طالس: نقطة التقسيم رقم k تحقّق $\\dfrac{AM_k}{AB} = \\dfrac{k}{n}$',
    'إنشاء النقطة التي تقسم قطعة بنسبة معلومة، داخل القطعة وخارجها',
    'إنشاء قطعة طولها معلوم بكسر (الرابع المتناسب) أو بعدد غير ناطق مثل $\\dfrac{2\\sqrt{13}}{3}$',
  ],
  teachingScope: {
    include: [
      'المسطرة غير المدرّجة والمدور والكوس: نقل الأطوال ورسم الموازيات',
      'طرائق ص 107: تقسيم قطعة مستقيمة، إنشاء قطعة طولها $\\dfrac{14}{3}$',
      'طرائق ص 109: النقطة M حيث $\\dfrac{MA}{MB} = \\dfrac{3}{2}$ ، والنقطة الثانية خارج [AB]، ودوري الآن',
      'التمارين 17 و 18 و 19 (ص 111) و 21 (ص 113)',
      'طول غير ناطق: وتر مثلث قائم ثم ثلثاه (مثال من المنصّة)',
    ],
    exclude: [
      'اكتشاف خاصية طالس وحساب الأطوال (الدرس 1)',
      'الخاصية العكسية وإثبات التوازي (الدرس 2)، إلا تذكيرًا في التمرين 21',
      'قياس الأطوال بالمسطرة المدرّجة',
    ],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Les acquis que « أستعدّ » diagnostique (années précédentes et leçons 1–2 de l'unité).
  priorKnowledge: ['insha-muwazi', 'qitaa-mutaqayisa', 'kitabat-tanasub', 'talis-nisab', 'talis-aksiya', 'mustaqim-muntasafayn', 'fithaghuris'],
  resources: [
    // Module 1 : l'entrée (pas d'activité du manuel). مبتدئ (défaut) : la banderole du tifo en 3 parts — la
    // méthode générale du rayon auxiliaire ; متقدم : le point M de rapport 3/2 de la طريقة p. 109 (et le second point).
    {
      kind: 'manipulation', code: 'segment-divider-tifo-3', type: 'segment-divider', module: 1,
      level: 'beginner',
      title: 'لافتة التيفو: ثلاث قطع متقايسة',
      objective: 'تقسيم قطعة مستقيم بالمسطرة غير المدرّجة والمدور: قطع متقايسة على مستقيم مساعد وموازيات، وخاصية طالس تبرّر التقسيم',
      autonomy: '',
      experience: { type: 'platform_adaptation', reason: 'improved_interactivity_and_age_appropriateness', theme: 'tifo' },
      learningPointIds: ['4am_inshaat-talis_P1'],
      sourceElementIds: ['method-divide'],
    },
    {
      kind: 'manipulation', code: 'segment-divider-ratio-3-2', type: 'segment-divider', module: 1,
      level: 'advanced',
      title: 'طرائق ص 109: نقطة تقسم اللافتة بنسبة 3 إلى 2',
      objective: 'تقسيم قطعة مستقيم بالمسطرة غير المدرّجة والمدور: قطع متقايسة على مستقيم مساعد وموازيات، وخاصية طالس تبرّر التقسيم',
      autonomy: 'مستقيمان متوازيان يدرّجهما التلميذ بنفسه من الجهتين: يختار عدد العلامات على كل مستقيم وجهتها دون أي اقتراح، ويبحث عن نقطتين من (AB) تحقّقان النسبة — داخل [AB] وخارجها',
      experience: { type: 'platform_adaptation', reason: 'improved_interactivity_and_age_appropriateness', theme: 'tifo' },
      learningPointIds: ['4am_inshaat-talis_P1', '4am_inshaat-talis_P2'],
      sourceElementIds: ['method-ratio-point'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'سبع عبارات: الموازي بالكوس، نقل طول بالمدور، التناسب، خاصية طالس وعكسيتها، مستقيم المنتصفين، فيثاغورس. صحيح أم خاطئ؟',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 5, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'lafita', path: `${LESSON_BASE_PATH}/lafita`,
      title: 'لافتة التيفو — قطع متقايسة دون قياس', desc: 'نصف مستقيم، مدور، كوس: قسّم اللافتة إلى ثلاثة أشرطة متساوية، ثم برّر بخاصية طالس وطالع طريقة الكتاب (ص 107).',
      stage: 'trigger', teachesLearningPointIds: ['4am_inshaat-talis_P1'],
      color: 'indigo', style: 'featured', estimatedMin: 13, difficulty: 2, actionText: 'أقسم اللافتة' },
    { id: '02', number: 2, slug: 'taraiq', path: `${LESSON_BASE_PATH}/taraiq`,
      title: 'طرائق — نسبة معلومة وطول معلوم', desc: 'النقطة M حيث MA على MB يساوي 3 على 2 ونقطة ثانية خارج [AB] (ص 109)، دوري الآن، طول $\\dfrac{14}{3}$ (ص 107)، ثم طول غير ناطق.',
      stage: 'discovery', teachesLearningPointIds: ['4am_inshaat-talis_P1', '4am_inshaat-talis_P2'],
      color: 'emerald', style: 'featured', estimatedMin: 12, difficulty: 3, actionText: 'أنشئ وأبرّر' },
    { id: '03', number: 3, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'تمارين الكتاب 17 و 18 و 19 (وضع نقط على مستقيم) و 21 (أتعمّق).',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_inshaat-talis_P1', '4am_inshaat-talis_P2'],
      color: 'amber', style: 'featured', estimatedMin: 9, difficulty: 3, actionText: 'أتدرّب' },
    { id: '04', number: 4, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'خمسة أسئلة تُقيّم نقطتي التعلّم: التقسيم بنسبة معطاة، وإنشاء طول معلوم.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 6, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
