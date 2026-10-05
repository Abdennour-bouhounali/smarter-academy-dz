/**
 * الدرس 1 — مفهوم الدوران وإنشاء صور أشكال هندسية بدوران (مدخل الوحدة 13 « الدوران - الزوايا - المضلّعات المنتظمة »)
 * Manuel (4AM) : « أستعدّ » 3 (p. 151, module 0), نشاط 1, 2, 3 (pp. 152–153, module 1), معارف 1 et 2 (p. 154, module 2),
 * طرائق تمرين 1 et 2 + دوري الآن (p. 155, doublon, module 3), exercices 1, 2, 3, 5, 7 (pp. 158–159, module 4), QCM 1 (p. 160,
 * doublon CORRIGÉ « صورة B », module 5). Source de vérité : docs/sources/4am/unit13/extraction.json.
 *
 * LE PARCOURS (REAL → DISCOVER → MANIPULATE → UNDERSTAND → TOUCH THE MATH → FORMALIZE → AUTOMATIZE → TRANSFER) :
 *   M0 أستعدّ        — l'angle supplémentaire (item 3), les symétries, la translation, le compas, la منقلة ;
 *   M1 أنشطة 1–3     — REAL (la grande roue de Ben Aknoun) → DISCOVER (le papier calque du نشاط 1) → MANIPULATE (rotation-dial :
 *                      la roue ; متقدم = نشاط 2 et 3 au compas et à la منقلة) → UNDERSTAND (les questions sous les essais de
 *                      l'élève ; la brique « نقطة وصورتها ») ;
 *   M2 معارف 1–2     — FORMALIZE : الدوران، الاتجاهان، صورة نقطة، 180° = التناظر المركزي ;
 *   M3 طرائق         — TOUCH THE MATH : la construction d'une image de point, d'une قطعة (révélées ligne à ligne), les
 *                      images des figures (le نشاط 3 formalisé), دوري الآن (doublon) ;
 *   M4 أوظّف تعلّماتي — AUTOMATIZE (ex-1, 2, 7) et TRANSFER (ex-3, 5) ;
 *   M5 إختبار أولي   — QCM 1 corrigé et quatre épreuves de la plateforme ; P1, P2, P3 couverts.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/handasa/mafhum-dawaran';

export const LESSON_CONFIG = {
  id: 'mafhum-dawaran',
  kind: 'lesson',
  unit: 'dawaran-mudalaat',
  unitTitle: 'الدوران - الزوايا - المضلّعات المنتظمة',
  sequentialUnlock: true,
  title: 'مفهوم الدوران وإنشاء صور أشكال هندسية بدوران',
  description: 'مدخل الوحدة: العجلة الدوّارة في حديقة بن عكنون تقود إلى الدوران الذي يتميّز بمركز وزاوية واتجاه، وإلى صورة نقطة (البعد نفسه عن المركز والزاوية المطلوبة في الاتجاه المطلوب)، ثم إلى صور القطعة والمستقيم ونصف المستقيم والدائرة بالمدور والمنقلة.',
  level: 'moyen',
  grade: '4am',
  chapter: 'handasa',
  chapterTitle: 'ميدان الهندسة',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🎡',
  estimatedDurationMin: 55,
  textbookRef: { unit: 13, activity: 1, pages: '151, 152, 153, 154, 155, 158, 159, 160' },
  skills: [
    'التعرّف على الدوران بمركزه وزاويته واتجاهه (المباشر أو غير المباشر)',
    'إنشاء صورة نقطة بدوران بالمدور والمنقلة',
    'إنشاء صور القطعة والمستقيم ونصف المستقيم والدائرة بدوران',
  ],
  teachingScope: {
    include: [
      'نشاط 1: الورق الشفاف، الدوران بزاوية 90 درجة في اتجاه عقارب الساعة',
      'نشاط 2: مراحل إنشاء صورة نقطة بزاوية 70 درجة',
      'نشاط 3: صور القطعة والمستقيم ونصف المستقيم والدائرة بزاوية 72 درجة',
      'معارف 1 و 2: تعريف الدوران، الاتجاه المباشر وغير المباشر، صورة نقطة، الحالة الخاصة 180 درجة',
      'طرائق: إنشاء صورة نقطة وصورة قطعة',
    ],
    exclude: [
      'خواص الدوران (الحفاظ على الأطوال والزوايا والاستقامية والمساحات) وتوظيفها في البراهين (الدرس 2)',
      'الزاوية المحيطية والزاوية المركزية (الدرس 3) والمضلعات المنتظمة (الدرس 4)',
    ],
  },
  knowledgeMap: true,
  knowledgeMapMode: 'progressive',
  // Les acquis que « أستعدّ » diagnostique (prérequis du propriétaire) : les angles supplémentaires (item 3 du manuel), les
  // symétries axiale et centrale, la translation (le درس précédent), le compas (cercle = points à égale distance), la منقلة.
  priorKnowledge: ['zawaya-mutakamila', 'tanazur-mihwari', 'tanazur-markazi', 'insihab', 'mudawwar', 'minqala'],
  resources: [
    // Le module 1 ouvre sur LA GRANDE ROUE (rotation-dial). متقدم (ouvert par défaut : les نشاطان 2 et 3) : la feuille, le
    // compas et la منقلة ; مبتدئ : la roue à six nacelles, chaque rotation dans les deux sens.
    {
      kind: 'manipulation', code: 'rotation-dial-wheel', type: 'rotation-dial', module: 1,
      level: 'beginner',
      title: 'العجلة الدوّارة: أين تصل المقصورة؟',
      objective: 'صورة نقطة M بالدوران الذي مركزه O وزاويته α في اتجاه معيّن هي النقطة M′ حيث OM′ = OM والزاوية MOM′ = α في ذلك الاتجاه، ومنها صور القطعة والدائرة',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'ferris-wheel' },
      learningPointIds: ['4am_mafhum-dawaran_P1', '4am_mafhum-dawaran_P2'],
      sourceElementIds: ['act-2'],
    },
    {
      kind: 'manipulation', code: 'rotation-dial-act2-act3', type: 'rotation-dial', module: 1,
      level: 'advanced',
      title: 'نشاطان 2 و 3: بالمدور والمنقلة، 70 و 72 درجة',
      objective: 'صورة نقطة M بالدوران الذي مركزه O وزاويته α في اتجاه معيّن هي النقطة M′ حيث OM′ = OM والزاوية MOM′ = α في ذلك الاتجاه، ومنها صور القطعة والدائرة',
      autonomy: 'زوايا الكتاب 70 و 72 درجة لا تقع على أي شعاع جاهز: التلميذ يفتح المدور ويدير المنقلة ويضع الصورة بنفسه، دون مؤشرات أثناء السحب، لكل نقطة من نقطة وقطعة ودائرة',
      experience: { type: 'textbook', reason: '', theme: 'ferris-wheel' },
      learningPointIds: ['4am_mafhum-dawaran_P2', '4am_mafhum-dawaran_P3'],
      sourceElementIds: ['act-2', 'act-3'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'ست عبارات: الزوايا المتكاملة، التناظر المحوري والمركزي، الانسحاب، المدور والمنقلة. صحيح أم خاطئ؟',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 5, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'anshita', path: `${LESSON_BASE_PATH}/anshita`,
      title: 'أنشطة 1 و 2 و 3 — العجلة الدوّارة', desc: 'دوّر الورق الشفاف حول O، ثم ضع مكان كل مقصورة بعد الدوران، وابنِ بالمدور والمنقلة صور نقطة وقطعة ودائرة.',
      stage: 'trigger', teachesLearningPointIds: ['4am_mafhum-dawaran_P1', '4am_mafhum-dawaran_P2', '4am_mafhum-dawaran_P3'],
      color: 'indigo', style: 'featured', estimatedMin: 20, difficulty: 1, actionText: 'أركب العجلة' },
    { id: '02', number: 2, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`,
      title: 'معارف — الدوران وصورة نقطة', desc: 'تعريف الدوران، الاتجاه المباشر وغير المباشر، صورة نقطة، والدوران بزاوية 180 درجة.',
      stage: 'discovery', teachesLearningPointIds: ['4am_mafhum-dawaran_P1', '4am_mafhum-dawaran_P2'],
      color: 'violet', style: 'featured', estimatedMin: 9, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'taraiq', path: `${LESSON_BASE_PATH}/taraiq`,
      title: 'طرائق — إنشاء صور أشكال هندسية', desc: 'إنشاء صورة نقطة وصورة قطعة سطرا بسطر، وصور المستقيم ونصف المستقيم والدائرة.',
      stage: 'formalization', teachesLearningPointIds: ['4am_mafhum-dawaran_P2', '4am_mafhum-dawaran_P3'],
      color: 'emerald', style: 'featured', estimatedMin: 8, difficulty: 2, actionText: 'أتعلّم الطريقة' },
    { id: '04', number: 4, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'تمارين الكتاب 1 و 2 و 3 و 5 و 7.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_mafhum-dawaran_P1', '4am_mafhum-dawaran_P2', '4am_mafhum-dawaran_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 2, actionText: 'أتدرّب' },
    { id: '05', number: 5, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'خمسة أسئلة تُقيّم نقاط التعلّم الثلاث، منها السؤال 1 من أؤكّد تعلّماتي.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 5, difficulty: 2, actionText: 'أدخل التقويم' },
  ],
};
