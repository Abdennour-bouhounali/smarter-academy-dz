/**
 * الدرس 4 — توظيف الحساب الشعاعي والإحداثيات لإثبات الخواص الهندسية (unité 12 « الأشعة في معلم », manuel pp. 139–149).
 * La leçon n'a PAS d'activité du manuel : son entrée est le laboratoire `shape-prover` (le « فار » du ملعب الحي), dont le
 * niveau متقدم est la طريقة p. 145 « حساب مسافات » (DÉCLARÉ — extraction › notes › labAdvancedLevel) ; ses éléments du
 * manuel sont les طرائق p. 145 et دوري الآن (module 3) et les exercices 13, 18, 19, 21, 24, 26, 27 (module 4). Le savoir
 * « prouver une nature par le calcul » est une ADDITION DÉCLARÉE (`knowledge_formalization`, « معارف من المنصّة »).
 *
 * Le parcours (REAL → DISCOVER → MANIPULATE → UNDERSTAND → TOUCH → FORMALIZE → AUTOMATIZE → TRANSFER) :
 *   0 أستعدّ                     diagnostic : distance, composantes, milieu, réciproque de Pythagore, parallélogramme,
 *                                quadrilatères usuels, cercle
 *   1 ملعب الحي (trigger)         REAL (des plots, un téléphone qui filme, le فار) → MANIPULATE (déplacer, prouver) →
 *                                UNDERSTAND (la figure ne prouve pas ; le côté seul ; les preuves suffisantes)
 *   2 نثبت بالحساب (discovery)    TOUCH → FORMALIZE : triangle, perpendicularité sans produit scalaire, quadrilatère, cercle
 *   3 طرائق (formalization)        la طريقة p. 145 ligne à ligne, l'inconnue y, دوري الآن 1 et 2 prouvés par l'élève
 *   4 أوظّف تعلّماتي (practice_lab) AUTOMATIZE → TRANSFER : تمارين 13, 18, 19, 21 (corrigé), 24, 26 (corrigé), 27
 *   5 إختبار أولي (evaluation)
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/handasa/ithbat-khawas-maalam';

export const LESSON_CONFIG = {
  id: 'ithbat-khawas-maalam',
  kind: 'lesson',
  unit: 'ashia-maalam',
  unitTitle: 'الأشعة في معلم',
  sequentialUnlock: true,
  title: 'توظيف الحساب الشعاعي والإحداثيات لإثبات الخواص الهندسية',
  description: 'في ملعب الحي يحكم الفار: نثبت طبيعة مثلث بمربعات المسافات وعكس خاصية فيثاغورس، وطبيعة رباعي بتساوي شعاعين ثم بالقطرين أو الضلعين المتتاليين، وانتماء نقطة إلى دائرة بالمسافة إلى المركز — بالحساب لا بالنظر.',
  level: 'moyen',
  grade: '4am',
  chapter: 'handasa',
  chapterTitle: 'ميدان الهندسة',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '📐',
  estimatedDurationMin: 55,
  textbookRef: { unit: 12, activity: 0, pages: '145, 147, 149' },
  skills: [
    'إثبات طبيعة مثلث (قائم، متساوي الساقين، متقايس الأضلاع) بحساب مربعات المسافات وتطبيق الخاصية العكسية لخاصية فيثاغورس',
    'إثبات طبيعة رباعي (متوازي أضلاع، مستطيل، معيّن، مربّع) بتساوي مركبتي شعاعين وتناصف القطرين وتقايسهما أو تقايس ضلعين متتاليين',
    'إثبات انتماء نقطة إلى دائرة بمقارنة بعدها عن المركز بنصف القطر، وتعيين إحداثية مجهولة بشرط هندسي',
  ],
  teachingScope: {
    include: [
      'طريقتا الكتاب «إنجاز برهان» و«حساب مسافات» ودوري الآن (ص 145)',
      'إثبات طبيعة مثلث ورباعي وانتماء نقطة إلى دائرة بالحساب في معلم (معارف من المنصّة)',
      'تعامد مستقيمين بالخاصية العكسية لخاصية فيثاغورس أو بالمثلث متساوي الساقين (دون الجداء السلمي)',
      'التمارين 13 و 18 و 19 (ص 147) و 21 و 24 و 26 و 27 (ص 149)',
    ],
    exclude: [
      'قراءة وحساب مركبتي شعاع وإحداثيتي المنتصف والمسافة كتعاريف (الدروس 1 إلى 3)، إلا توظيفا',
      'الجداء السلمي وميل مستقيم (خارج برنامج السنة الرابعة متوسط)',
      'معادلة الدائرة (السنوات اللاحقة)',
    ],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Les acquis que « أستعدّ » diagnostique (leçons 1–3 de l'unité, unité 11 et années précédentes).
  priorKnowledge: ['masafa-maalam', 'murakkibat-shuaa', 'muntasaf-maalam', 'aks-fithaghuras', 'tasawi-mutawazi', 'khawass-rubaiyat', 'daira-nisf-qutr'],
  resources: [
    // Module 1 : l'entrée (pas d'activité du manuel). مبتدئ : le triangle du ملعب الحي (plateforme) — un départ qui a l'air
    // droit ; متقدم : la طريقة p. 145 — C(−2 ; y) sur sa droite, puis le carré ABCD et le cercle de diamètre [AC].
    {
      kind: 'manipulation', code: 'shape-prover-malab', type: 'shape-prover', module: 1,
      level: 'beginner',
      title: 'ملعب الحي: مثلث يبدو قائما',
      objective: 'إثبات طبيعة شكل في معلم متعامد ومتجانس بمساواة محسوبة من الإحداثيات وبأدلة كافية، لا بما نراه على الشكل',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'football' },
      learningPointIds: ['4am_ithbat-khawas-maalam_P1'],
      sourceElementIds: ['method-unknown'],
    },
    {
      kind: 'manipulation', code: 'shape-prover-taraiq', type: 'shape-prover', module: 1,
      level: 'advanced',
      title: 'طريقة الكتاب (ص 145): $C(-2\\,;\\,y)$ ، ثم المربّع والدائرة',
      objective: 'إثبات طبيعة شكل في معلم متعامد ومتجانس بمساواة محسوبة من الإحداثيات وبأدلة كافية، لا بما نراه على الشكل',
      autonomy: 'لا موضع مقترح ولا بطاقة مقترحة: التلميذ يجد y على المستقيم، ثم يضع الشاخص الرابع D ويختار بنفسه الأدلة الكافية للمربّع وللدائرة؛ بطاقة زاوية أخرى أو دليل ناقص يُرفضان',
      experience: { type: 'platform_adaptation', reason: 'improved_interactivity_and_age_appropriateness', theme: 'football' },
      learningPointIds: ['4am_ithbat-khawas-maalam_P1', '4am_ithbat-khawas-maalam_P2', '4am_ithbat-khawas-maalam_P3'],
      sourceElementIds: ['method-unknown'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'سبع عبارات: المسافة، مركبتا شعاع، المنتصف، عكس خاصية فيثاغورس، متوازي الأضلاع، الرباعيات الشهيرة، الدائرة. صحيح أم خاطئ؟',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 5, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'malab', path: `${LESSON_BASE_PATH}/malab`,
      title: 'ملعب الحي — الفار لا يصدّق عينيه', desc: 'شواخص على أرضية مرصوفة: حرّك شاخصا واطلب الفار. لا يقبل شكلا إلا بمساواة محسوبة من الإحداثيات وبأدلة كافية.',
      stage: 'trigger', teachesLearningPointIds: ['4am_ithbat-khawas-maalam_P1', '4am_ithbat-khawas-maalam_P2'],
      color: 'emerald', style: 'featured', estimatedMin: 12, difficulty: 2, actionText: 'أدخل الملعب' },
    { id: '02', number: 2, slug: 'bil-hisab', path: `${LESSON_BASE_PATH}/bil-hisab`,
      title: 'نثبت بالحساب — معارف من المنصّة', desc: 'طبيعة مثلث، تعامد مستقيمين دون جداء سلمي، طبيعة رباعي بأدلة متدرّجة، وانتماء نقطة إلى دائرة.',
      stage: 'discovery', teachesLearningPointIds: ['4am_ithbat-khawas-maalam_P1', '4am_ithbat-khawas-maalam_P2', '4am_ithbat-khawas-maalam_P3'],
      color: 'indigo', style: 'featured', estimatedMin: 10, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'taraiq', path: `${LESSON_BASE_PATH}/taraiq`,
      title: 'طرائق — إنجاز برهان وحساب مجهول', desc: 'طريقتا الكتاب (ص 145) سطرا سطرا، ثم دوري الآن: مربّع ونقطة على دائرة تبرهنهما بنفسك.',
      stage: 'formalization', teachesLearningPointIds: ['4am_ithbat-khawas-maalam_P1', '4am_ithbat-khawas-maalam_P2', '4am_ithbat-khawas-maalam_P3'],
      color: 'sky', style: 'featured', estimatedMin: 11, difficulty: 3, actionText: 'أبرهن' },
    { id: '04', number: 4, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'تمارين الكتاب 13 و 18 و 19 (ص 147) و 21 و 24 و 26 و 27 (ص 149).',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_ithbat-khawas-maalam_P1', '4am_ithbat-khawas-maalam_P2', '4am_ithbat-khawas-maalam_P3'],
      color: 'amber', style: 'featured', estimatedMin: 10, difficulty: 3, actionText: 'أتدرّب' },
    { id: '05', number: 5, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'ستة أسئلة تُقيّم نقاط التعلّم الثلاث: طبيعة مثلث، طبيعة رباعي، الانتماء إلى دائرة.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 7, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
