/**
 * الدرس 1 — النسب المثلثية لزاوية حادة في مثلث قائم (مدخل الوحدة 10 « حساب المثلثات في المثلث القائم »)
 * Manuel (4AM) : « أستعدّ » 1, 4–6 (p. 115, module 0), نشاط 1 et 2 (p. 116, module 1), نشاط 3, معارف 1 et 2 et
 * l'encadré « نصير الدين الطوسي » (doublon, les noms) (pp. 115–118, module 2), طرائق sin / cos / tan + دوري الآن (p. 119,
 * module 3), exercices 1, 2, 4, 5, 6, 9, 10, 12, 14, 15 (pp. 122–123, module 4), QCM 1–5 (p. 124, doublon, module 5).
 * Source de vérité : docs/sources/4am/unit10/extraction.json.
 *
 * LE PARCOURS (REAL → DISCOVER → MANIPULATE → UNDERSTAND → TOUCH THE MATH → FORMALIZE → AUTOMATIZE → TRANSFER) :
 *   M0 أستعدّ          — la somme des angles, l'hypoténuse, côtés opposé / adjacent, le cosinus de 3AM, Pythagore, Thalès ;
 *   M1 نشاط 1 و 2      — REAL (les rampes du skatepark) → DISCOVER → MANIPULATE (ramp-ratios : nommer les côtés,
 *                        composer cos / sin / tan, lever la rampe ; trois rampes à 40° puis un autre angle) ; les
 *                        questions des نشاط 1 et 2 répondues depuis les lectures de l'élève, la preuve par Thalès ;
 *   M2 معارف           — UNDERSTAND (نشاط 3 : compléter avec les mots), FORMALIZE (معارف 1–2 avec WordFraction, la
 *                        coquille de معارف 2 corrigée), TOUCH THE MATH (valeur exacte / approchée, 0 < sin, cos < 1) ;
 *   M3 طرائق           — FORMALIZE (les trois longueurs révélées ligne à ligne, les touches en code LTR) + دوري الآن ;
 *   M4 أوظّف تعلّماتي  — AUTOMATIZE (ex-1, 2, 4, 5, 6, 9, 12) et TRANSFER (ex-10 l'impossible 1,5 ; ex-14 la preuve ;
 *                        ex-15 le bon rapport) ;
 *   M5 إختبار أولي     — QCM 1–5 et une épreuve de la plateforme ; P1, P2, P3 couverts.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/handasa/nisab-muthallathiya';

export const LESSON_CONFIG = {
  id: 'nisab-muthallathiya',
  kind: 'lesson',
  unit: 'hisab-muthallathat',
  unitTitle: 'حساب المثلثات في المثلث القائم',
  sequentialUnlock: true,
  title: 'النسب المثلثية لزاوية حادة في مثلث قائم',
  description: 'مدخل الوحدة: منحدرات حديقة التزلج تقود إلى جيب التمام والجيب والظل لزاوية حادة في مثلث قائم، نسبٌ بين أطوال الأضلاع لا تتعلق إلا بقيس الزاوية، والجيب وجيب التمام محصوران بين 0 و 1، ثم نوظّفها لحساب أطوال مجهولة.',
  level: 'moyen',
  grade: '4am',
  chapter: 'handasa',
  chapterTitle: 'ميدان الهندسة',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🛹',
  estimatedDurationMin: 55,
  textbookRef: { unit: 10, activity: 1, pages: '115, 116, 118, 119, 122, 123, 124' },
  skills: [
    'تسمية الوتر والضلعين المقابل والمجاور بالنسبة إلى زاوية حادة، وكتابة جيب التمام والجيب والظل',
    'إدراك أن الجيب وجيب التمام لزاوية حادة عددان محصوران تماما بين 0 و 1',
    'حساب طول ضلع في مثلث قائم بتوظيف الجيب أو جيب التمام أو الظل',
  ],
  teachingScope: {
    include: [
      'نشاط 1: الوتر، المجاور والمقابل للزاوية C، جيب التمام cos 25° = AC/BC، القيم المدوّرة',
      'نشاط 2: النسبتان AC/BC و AC/AB لا تتعلقان بالأطوال (التخمين والبرهان بخاصية طالس)، الجيب والظل',
      'نشاط 3 ومعارف 1 و 2: تعريف الجيب والظل، القيمة المضبوطة والقيمة المقربة، 0 < sin, cos < 1',
      'طرائق: حساب طول ضلع باستعمال الجيب أو جيب التمام أو الظل، ودوري الآن',
    ],
    exclude: [
      'استعمال الحاسبة لتعيين قيس زاوية بمعرفة نسبتها (الدرس 2)',
      'العلاقات بين النسب المثلثية والإنشاءات الهندسية (الدرس 3)',
      'ترييض وضعيات ومشكلات (الدرس 4) والوضعية الإدماجية (أدمج تعلّماتي)',
    ],
  },
  knowledgeMap: true,
  knowledgeMapMode: 'progressive',
  // Les acquis que « أستعدّ » diagnostique : la somme des angles d'un triangle, l'hypoténuse, côtés opposé et adjacent
  // d'un angle aigu, le cosinus (3AM), Pythagore, Thalès (unité 9, la preuve du نشاط 2).
  priorKnowledge: ['majmu-zawaya', 'watar', 'muqabil-mujawir', 'jayb-tamam-3am', 'fithaghuras', 'talis-wahda-9'],
  resources: [
    // Le module 1 ouvre sur LES RAMPES (ramp-ratios). متقدم (ouvert par défaut : le نشاط 2) : B̂ = 40° imposé, trois
    // rampes que l'élève construit (4, 6, 8 en repères) puis un autre angle ; مبتدئ : la rampe à nommer (30°, planche 4 m).
    {
      kind: 'manipulation', code: 'ramp-ratios-skatepark-30-4', type: 'ramp-ratios', module: 1,
      level: 'beginner',
      title: 'منحدر حديقة التزلج: سمِّ الأضلاع وركّب النسب',
      objective: 'في مثلث قائم، بالنسبة إلى زاوية حادة: جيب التمام = المجاور ÷ الوتر، الجيب = المقابل ÷ الوتر، الظل = المقابل ÷ المجاور؛ هذه النسب لا تتعلق إلا بقيس الزاوية، والجيب وجيب التمام محصوران بين 0 و 1',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'skatepark' },
      learningPointIds: ['4am_nisab-muthallathiya_P1', '4am_nisab-muthallathiya_P2'],
      sourceElementIds: ['act-1'],
    },
    {
      kind: 'manipulation', code: 'ramp-ratios-act2-40', type: 'ramp-ratios', module: 1,
      level: 'advanced',
      title: 'نشاط 2: ثلاثة منحدرات بزاوية 40°',
      objective: 'في مثلث قائم، بالنسبة إلى زاوية حادة: جيب التمام = المجاور ÷ الوتر، الجيب = المقابل ÷ الوتر، الظل = المقابل ÷ المجاور؛ هذه النسب لا تتعلق إلا بقيس الزاوية، والجيب وجيب التمام محصوران بين 0 و 1',
      autonomy: 'لا شيء مقترح: التلميذ يبني بنفسه المنحدرات بأطوال يختارها عند الزاوية المفروضة 40°، ويحكم قبل القراءة هل تغيّرت النسبتان AC/BC و AC/AB، ثم يقرّر أن يدير الزاوية ليختبر تخمينه',
      experience: { type: 'textbook', reason: '', theme: 'skatepark' },
      learningPointIds: ['4am_nisab-muthallathiya_P1'],
      sourceElementIds: ['act-2'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'عشر عبارات: مجموع زوايا مثلث، الوتر، الضلعان المقابل والمجاور، جيب التمام، خاصية فيثاغورس وخاصية طالس. صحيح أم خاطئ؟',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 5, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'nashat', path: `${LESSON_BASE_PATH}/nashat`,
      title: 'نشاط 1 و 2 — منحدرات حديقة التزلج', desc: 'سمِّ أضلاع المنحدر وركّب جيب التمام والجيب والظل، ثم ابنِ ثلاثة منحدرات بزاوية 40°: هل تتعلق النسب بالطول؟ ثم أسئلة النشاطين وبرهان طالس.',
      stage: 'trigger', teachesLearningPointIds: ['4am_nisab-muthallathiya_P1'],
      color: 'indigo', style: 'featured', estimatedMin: 14, difficulty: 1, actionText: 'أجرّب المنحدرات' },
    { id: '02', number: 2, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`,
      title: 'معارف — الجيب والظل', desc: 'نشاط 3، تعريف جيب زاوية حادة وظلها، القيمة المضبوطة والقيمة المقربة، ولماذا الجيب وجيب التمام بين 0 و 1.',
      stage: 'discovery', teachesLearningPointIds: ['4am_nisab-muthallathiya_P1', '4am_nisab-muthallathiya_P2'],
      color: 'violet', style: 'featured', estimatedMin: 11, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'taraiq', path: `${LESSON_BASE_PATH}/taraiq`,
      title: 'طرائق — حساب طول ضلع', desc: 'ثلاث طرائق من الكتاب، بالجيب وجيب التمام والظل، سطرا سطرا مع برنامج الحاسبة، ثم دوري الآن.',
      stage: 'formalization', teachesLearningPointIds: ['4am_nisab-muthallathiya_P3'],
      color: 'emerald', style: 'featured', estimatedMin: 9, difficulty: 2, actionText: 'أتعلّم الطريقة' },
    { id: '04', number: 4, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'تمارين الكتاب 1 و 2 و 4 و 5 و 6 و 9 و 10 و 12 و 14 و 15.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_nisab-muthallathiya_P1', '4am_nisab-muthallathiya_P2', '4am_nisab-muthallathiya_P3'],
      color: 'amber', style: 'featured', estimatedMin: 10, difficulty: 2, actionText: 'أتدرّب' },
    { id: '05', number: 5, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'ستة أسئلة تُقيّم نقاط التعلّم الثلاث، منها الأسئلة 1 إلى 5 من أؤكّد تعلّماتي.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 6, difficulty: 2, actionText: 'أدخل التقويم' },
  ],
};
