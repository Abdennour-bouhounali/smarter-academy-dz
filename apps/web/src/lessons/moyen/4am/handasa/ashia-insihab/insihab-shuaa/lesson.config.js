/**
 * الدرس 1 — مفهوم الانسحاب والشعاع وتساوي شعاعين (مدخل الوحدة 11 « الأشعة والانسحاب »)
 * Manuel (4AM) : « أستعدّ » 1, 2, 5, 6 (p. 127, module 0), نشاط 1 (p. 128, module 1), معارف 1 (p. 130, module 2),
 * نشاط 2 أ et معارف 2 (pp. 128 et 130, module 3), exercices 1, 2, 3, 4, 5, 8 (p. 134, module 4), QCM 1–3 (p. 136,
 * doublon, module 5). Source de vérité : docs/sources/4am/unit11/extraction.json.
 *
 * LE PARCOURS (REAL → DISCOVER → MANIPULATE → UNDERSTAND → TOUCH THE MATH → FORMALIZE → AUTOMATIZE → TRANSFER) :
 *   M0 أستعدّ          — متوازي الأضلاع (قطران متناصفان، تعريفه)، الانسحاب في السنة الثالثة، التوازي ;
 *   M1 نشاط 1          — REAL (un spectacle de drones au-dessus de la baie d'Alger) → DISCOVER → MANIPULATE
 *                        (translation-glide : porter le meneur, poser les images, réparer le drone égaré ; متقدم : les
 *                        quatre translations du manuel) ; les questions du نشاط 1 répondues sous les placements de
 *                        l'élève ; la brique « الانسحاب يعرّف شعاعا » ;
 *   M2 معارف 1         — UNDERSTAND / FORMALIZE : المنحى والاتجاه، الشعاع (ثلاثة عناصر، مُمثّل)، تساوي شعاعين ;
 *   M3 نشاط 2 أ + معارف 2 — TOUCH THE MATH (construire D, AB = DC) puis FORMALIZE (ABCD متوازي أضلاع, l'ordre des
 *                        lettres, les milieux, le cas aligné) ;
 *   M4 أوظّف تعلّماتي  — AUTOMATIZE (ex-1, 2, 4) et TRANSFER (ex-3, 5, 8 ; deux coquilles corrigées : ex-4, ex-8) ;
 *   M5 إختبار أولي     — QCM 1–3 et deux épreuves de la plateforme ; P1, P2, P3 couverts.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/handasa/insihab-shuaa';

export const LESSON_CONFIG = {
  id: 'insihab-shuaa',
  kind: 'lesson',
  unit: 'ashia-insihab',
  unitTitle: 'الأشعة والانسحاب',
  sequentialUnlock: true,
  title: 'مفهوم الانسحاب والشعاع وتساوي شعاعين',
  description: 'مدخل الوحدة: عرض مسيّرات فوق خليج الجزائر يقود إلى الانسحاب الذي يحرّك كل النقط بنفس الحركة، وإلى الشعاع الذي يميّزه بمنحاه واتجاهه وطوله، ثم إلى تساوي شعاعين ومتوازي الأضلاع.',
  level: 'moyen',
  grade: '4am',
  chapter: 'handasa',
  chapterTitle: 'ميدان الهندسة',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '➡️',
  estimatedDurationMin: 55,
  textbookRef: { unit: 11, activity: 1, pages: '127, 128, 130, 134, 136' },
  skills: [
    'تعيين صورة نقطة أو شكل بانسحاب وربط الانسحاب بالشعاع الذي يعرّفه',
    'تحديد منحى شعاع واتجاهه وطوله، وتعيين ممثّلات له',
    'التعرّف على شعاعين متساويين، وربط تساوي شعاعين بمتوازي الأضلاع',
  ],
  teachingScope: {
    include: [
      'نشاط 1: صور مثلث بأربعة انسحابات على المرصوفة، المنحى والاتجاه والطول، الثنائيات التي تعرّف شعاعا وممثّلاته',
      'معارف 1: المنحى والاتجاه، الانسحاب ومفهوم الشعاع، تساوي شعاعين',
      'نشاط 2 أ ومعارف 2: إنشاء D حيث ABCD متوازي أضلاع، الخاصية، المنتصف المشترك للقطرين، الحالة الخاصة (الاستقامية)',
    ],
    exclude: [
      'منتصف قطعة بالأشعة وطرائق إنشاء صورة نقطة (الدرس 2)',
      'مجموع شعاعين وعلاقة شال وقاعدة متوازي الأضلاع والشعاعان المتعاكسان والشعاع المعدوم (الدرس 3)',
      'البراهين بالأشعة (الدرس 4) والوضعية الإدماجية (أدمج تعلّماتي)',
    ],
  },
  knowledgeMap: true,
  knowledgeMapMode: 'progressive',
  // Les acquis que « أستعدّ » diagnostique : le parallélogramme (diagonales, définition), la translation de 3AM (et la
  // conservation des longueurs), le parallélisme (« نفس المنحى » de معارف 1).
  priorKnowledge: ['tanasuf-qutrayn', 'tarif-mutawazi', 'insihab-3am', 'insihab-atwal', 'tawazi-mustaqimat'],
  resources: [
    // Le module 1 ouvre sur LE SPECTACLE DE DRONES (translation-glide). متقدم (ouvert par défaut : le نشاط 1) : la figure
    // du manuel et ses quatre translations ; مبتدئ : trois drones dont l'élève choisit lui-même la flèche du meneur.
    {
      kind: 'manipulation', code: 'translation-glide-show-3', type: 'translation-glide', module: 1,
      level: 'beginner',
      title: 'عرض المسيّرات: حرّك القائدة وضع صور التشكيلة',
      objective: 'الانسحاب يحرّك كل نقطة بسهم واحد: نقطة وصورتها تعرّفان شعاعا له منحى واتجاه وطول، وصورة نقطة أخرى تُقبل فقط إذا كان لسهمها نفس المنحى ونفس الاتجاه ونفس الطول',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'drone-show' },
      learningPointIds: ['4am_insihab-shuaa_P1', '4am_insihab-shuaa_P2'],
      sourceElementIds: ['act-1'],
    },
    {
      kind: 'manipulation', code: 'translation-glide-act1', type: 'translation-glide', module: 1,
      level: 'advanced',
      title: 'نشاط 1: أربعة انسحابات للمثلث ABC',
      objective: 'الانسحاب يحرّك كل نقطة بسهم واحد: نقطة وصورتها تعرّفان شعاعا له منحى واتجاه وطول، وصورة نقطة أخرى تُقبل فقط إذا كان لسهمها نفس المنحى ونفس الاتجاه ونفس الطول',
      autonomy: 'أربعة انسحابات من الكتاب، كل منها معطى بنقطة وصورتها فقط: التلميذ يعدّ المربعات بنفسه ويضع تسع صور دون أضواء أثناء السحب، ويكتشف أن الثنائية (K ; H) تعطي الانسحاب نفسه الذي يحوّل A إلى A′',
      experience: { type: 'textbook', reason: '', theme: 'drone-show' },
      learningPointIds: ['4am_insihab-shuaa_P1'],
      sourceElementIds: ['act-1'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'ست عبارات: متوازي الأضلاع وقطراه، الانسحاب الذي عرفته في السنة الثالثة، والمستقيمات المتوازية. صحيح أم خاطئ؟',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 5, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'nashat', path: `${LESSON_BASE_PATH}/nashat`,
      title: 'نشاط 1 — عرض المسيّرات فوق الخليج', desc: 'حرّك المسيّرة القائدة وضع صور التشكيلة بنفس السهم، ثم أعد بناء صور المثلث ABC بالانسحابات الأربعة للكتاب وأجب عن أسئلة النشاط.',
      stage: 'trigger', teachesLearningPointIds: ['4am_insihab-shuaa_P1', '4am_insihab-shuaa_P2'],
      color: 'indigo', style: 'featured', estimatedMin: 16, difficulty: 1, actionText: 'أبدأ العرض' },
    { id: '02', number: 2, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`,
      title: 'معارف — الشعاع وتساوي شعاعين', desc: 'المنحى والاتجاه، الشعاع بعناصره الثلاثة وممثّلاته، ومتى يتساوى شعاعان.',
      stage: 'discovery', teachesLearningPointIds: ['4am_insihab-shuaa_P2', '4am_insihab-shuaa_P3'],
      color: 'violet', style: 'featured', estimatedMin: 10, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'mutawazi', path: `${LESSON_BASE_PATH}/mutawazi`,
      title: 'نشاط 2 أ — الشعاعان المتساويان ومتوازي الأضلاع', desc: 'أنشئ D بحيث يكون ABCD متوازي أضلاع وقارن الشعاعين AB و DC، ثم الخاصية وترتيب الحروف والمنتصف المشترك والحالة الخاصة.',
      stage: 'formalization', teachesLearningPointIds: ['4am_insihab-shuaa_P3'],
      color: 'emerald', style: 'featured', estimatedMin: 9, difficulty: 2, actionText: 'أتعلّم الخاصية' },
    { id: '04', number: 4, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'تمارين الكتاب 1 و 2 و 3 و 4 و 5 و 8.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_insihab-shuaa_P1', '4am_insihab-shuaa_P2', '4am_insihab-shuaa_P3'],
      color: 'amber', style: 'featured', estimatedMin: 10, difficulty: 2, actionText: 'أتدرّب' },
    { id: '05', number: 5, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'خمسة أسئلة تُقيّم نقاط التعلّم الثلاث، منها الأسئلة 1 إلى 3 من أؤكّد تعلّماتي.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 5, difficulty: 2, actionText: 'أدخل التقويم' },
  ],
};
