/**
 * الدرس 3 — المقاطع المستوية للمجسمات المألوفة (الكرة، البلاطة القائمة، أسطوانة الدوران، والهرم) — الوحدة 14 « الهندسة في الفضاء »
 * Manuel (4AM) : نشاط 2, 3, 4, 5 (pp. 164–165, module 1 ; le نشاط 5 est doublé dans « التكبير والتصغير »), معارف 3 (p. 168,
 * module 2, « ب) » rétabli), طرائق « حساب نصف قطر مقطع كرة بمستو » et دوري الآن (p. 169, module 3). Le scan s'arrête p. 169 :
 * la معرفة des sections de pyramide / cône, les exercices, le « أستعدّ » de cette leçon sont des AJOUTS DÉCLARÉS de la
 * plateforme. Source de vérité : docs/sources/4am/unit14/extraction.json.
 *
 * LE PARCOURS (REAL → DISCOVER → MANIPULATE → UNDERSTAND → TOUCH THE MATH → FORMALIZE → AUTOMATIZE → TRANSFER) :
 *   M0 أستعدّ        — Pythagore, le pavé, le cylindre, la diagonale d'un carré, la sphère (OM = R), Thalès ;
 *   M1 أنشطة 2–5     — REAL (l'imprimante 3D du fablab : chaque couche est une section) → MANIPULATE (section-slicer :
 *                      مبتدئ la sphère R = 5 ; متقدم le نشاط 2 puis la بلاطة, la أسطوانة, le هرم) → UNDERSTAND (les questions
 *                      des نشاطات sous les couches imprimées par l'élève) ;
 *   M2 معارف 3       — FORMALIZE : la sphère (le tableau des cas h), la بلاطة, la أسطوانة ; la pyramide et le cône (ajout) ;
 *   M3 طرائق         — TOUCH THE MATH : le rayon d'une section (R = 2,5 ; OO′ = 1,5) révélé ligne à ligne, دوري الآن (6√3) ;
 *   M4 أوظّف تعلّماتي — AUTOMATIZE / TRANSFER (ajouts) : la pastèque, le silo, le gâteau, la couche de l'imprimante ;
 *   M5 إختبار أولي   — cinq épreuves de la plateforme, P1–P4 couverts.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/handasa/maqati-mustawiya';

export const LESSON_CONFIG = {
  id: 'maqati-mustawiya',
  kind: 'lesson',
  unit: 'handasa-fada',
  unitTitle: 'الهندسة في الفضاء',
  sequentialUnlock: true,
  title: 'المقاطع المستوية للمجسمات المألوفة (الكرة، البلاطة القائمة، أسطوانة الدوران، والهرم)',
  description: 'طابعة ثلاثية الأبعاد تبني المجسم طبقة بعد طبقة: كل طبقة مقطع مستو. مقطع الكرة دائرة نصف قطرها $r = \\sqrt{R^2 - h^2}$ أو نقطة أو لا شيء، مقطع البلاطة القائمة مستطيل، مقطع أسطوانة الدوران دائرة أو مستطيل، ومقطع الهرم أو المخروط بمستو موازٍ للقاعدة تصغير لها.',
  level: 'moyen',
  grade: '4am',
  chapter: 'handasa',
  chapterTitle: 'ميدان الهندسة',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🔪',
  estimatedDurationMin: 55,
  textbookRef: { unit: 14, activity: 2, pages: '164, 165, 168, 169' },
  skills: [
    'تعيين طبيعة مقطع كرة بمستو وحساب نصف قطره بخاصية فيثاغورس',
    'تعيين مقطع بلاطة قائمة بمستو موازٍ لوجه أو لحرف وحساب بعديه',
    'تعيين مقطع أسطوانة دوران بمستو موازٍ لقاعدتها أو لمحورها',
    'التعرّف على مقطع هرم أو مخروط دوران بمستو موازٍ للقاعدة كتصغير لها',
  ],
  teachingScope: {
    include: [
      'نشاط 2: مقطع كرة بمستو عمودي على قطر، $IM^2 = 9 - x^2$ ، والحالات x = 0 و 1,25 و 2 و 2,8 و 3',
      'نشاط 3: مقطع بلاطة قائمة 25 × 20 × 6 بمستو موازٍ للوجه CBFG ثم للحرف [CG]',
      'نشاط 4: مقطع أسطوانة دوران نصف قطرها 1,7 وارتفاعها 6 بمستو موازٍ للمحور ثم للقاعدة',
      'نشاط 5: مقطع الهرم المنتظم SABCD بمستو موازٍ للقاعدة، المربع EFGH',
      'معارف 3 وطرائق ص 169: المقاطع المستوية، نصف قطر مقطع كرة بخاصية فيثاغورس',
    ],
    exclude: [
      'مساحة الكرة وحجم الجلة (الدرس 2)',
      'أثر التكبير والتصغير على المساحات والحجوم (الدرس 4)',
      'مقاطع مائلة لا توازي وجها ولا حرفا ولا قاعدة',
    ],
  },
  knowledgeMap: true,
  knowledgeMapMode: 'progressive',
  // Les acquis que « أستعدّ » diagnostique (les المكتسبات القبلية du propriétaire et la leçon « الكرة والجلة ») :
  // Pythagore, le pavé droit, le cylindre de révolution, la diagonale d'un carré, la sphère (OM = R), Thalès.
  priorKnowledge: ['fithaghuras', 'balata-qaima', 'ustuwana-dawaran', 'qutr-murabba', 'kura-markaz', 'talis-nisab'],
  resources: [
    // Le module 1 ouvre sur L'IMPRIMANTE 3D (section-slicer). متقدم (ouvert par défaut : le نشاط 2 — puis la بلاطة, la أسطوانة,
    // le هرم des نشاطات 3–5, ouverts par l'élève) ; مبتدئ : une sphère de rayon 5 aux couches entières.
    {
      kind: 'manipulation', code: 'section-slicer-sphere-5', type: 'section-slicer', module: 1,
      level: 'beginner',
      title: 'الطابعة ثلاثية الأبعاد: طبقات كرة نصف قطرها 5',
      objective: 'مقطع مجسم مألوف بمستو: طبيعته وأبعاده، ومقطع الكرة بمستو يبعد عن مركزها بـ h دائرة نصف قطرها √(R² − h²) أو نقطة أو لا شيء',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: '3d-printer' },
      learningPointIds: ['4am_maqati-mustawiya_P1'],
      sourceElementIds: ['act-2'],
    },
    {
      kind: 'manipulation', code: 'section-slicer-act2-act5', type: 'section-slicer', module: 1,
      level: 'advanced',
      title: 'نشاط 2: كرة نصف قطرها 3، ثم البلاطة والأسطوانة والهرم',
      objective: 'مقطع مجسم مألوف بمستو: طبيعته وأبعاده، ومقطع الكرة بمستو يبعد عن مركزها بـ h دائرة نصف قطرها √(R² − h²) أو نقطة أو لا شيء',
      autonomy: 'قيم x الخمس للكتاب تعطي أنصاف أقطار جذرية (√119/4، √5، √29/5) لا تُخمَّن بالنظر، والمستوي يُحرَّك دون علامات مساعدة في البلاطة والأسطوانة والهرم: التلميذ يتوقّع كل مقطع ثم تحكم الطابعة، ويفتح المجسمات الأخرى بنفسه',
      experience: { type: 'textbook', reason: '', theme: '3d-printer' },
      learningPointIds: ['4am_maqati-mustawiya_P1', '4am_maqati-mustawiya_P2', '4am_maqati-mustawiya_P3', '4am_maqati-mustawiya_P4'],
      sourceElementIds: ['act-2', 'act-3', 'act-4', 'act-5'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'ست عبارات: خاصية فيثاغورس، البلاطة القائمة، أسطوانة الدوران، قطر المربع، الكرة، خاصية طالس. صحيح أم خاطئ؟',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 5, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'anshita', path: `${LESSON_BASE_PATH}/anshita`,
      title: 'أنشطة 2 و 3 و 4 و 5 — الطابعة ثلاثية الأبعاد', desc: 'حرّك مستوي القطع في الكرة والبلاطة والأسطوانة والهرم، توقّع كل طبقة ثم اطبعها، وأجب عن أسئلة الكتاب بطبقاتك.',
      stage: 'trigger', teachesLearningPointIds: ['4am_maqati-mustawiya_P1', '4am_maqati-mustawiya_P2', '4am_maqati-mustawiya_P3', '4am_maqati-mustawiya_P4'],
      color: 'indigo', style: 'featured', estimatedMin: 20, difficulty: 2, actionText: 'أشغّل الطابعة' },
    { id: '02', number: 2, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`,
      title: 'معارف — المقاطع المستوية لمجسمات مألوفة', desc: 'مقطع الكرة بمستو وحالاته الأربع، مقطع البلاطة القائمة، مقطعا أسطوانة الدوران، ومقطع الهرم والمخروط بمستو موازٍ للقاعدة.',
      stage: 'discovery', teachesLearningPointIds: ['4am_maqati-mustawiya_P1', '4am_maqati-mustawiya_P2', '4am_maqati-mustawiya_P3', '4am_maqati-mustawiya_P4'],
      color: 'violet', style: 'featured', estimatedMin: 10, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'taraiq', path: `${LESSON_BASE_PATH}/taraiq`,
      title: 'طرائق — نصف قطر مقطع كرة بمستو', desc: 'خاصية فيثاغورس لحساب نصف قطر مقطع كرة سطرا بسطر، ثم دوري الآن: مقطع أسطوانة بمستو موازٍ لمحورها.',
      stage: 'formalization', teachesLearningPointIds: ['4am_maqati-mustawiya_P1', '4am_maqati-mustawiya_P3'],
      color: 'emerald', style: 'featured', estimatedMin: 8, difficulty: 2, actionText: 'أتعلّم الطريقة' },
    { id: '04', number: 4, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'تمارين من المنصّة: شريحة دلّاع، صومعة الحبوب، كعكة العيد، وطبقة الطابعة في هرم ومخروط.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_maqati-mustawiya_P1', '4am_maqati-mustawiya_P2', '4am_maqati-mustawiya_P3', '4am_maqati-mustawiya_P4'],
      color: 'amber', style: 'featured', estimatedMin: 7, difficulty: 2, actionText: 'أتدرّب' },
    { id: '05', number: 5, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'خمسة أسئلة تُقيّم نقاط التعلّم الأربع.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 5, difficulty: 2, actionText: 'أدخل التقويم' },
  ],
};
