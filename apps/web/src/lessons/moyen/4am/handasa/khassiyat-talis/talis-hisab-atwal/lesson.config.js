/**
 * الدرس 1 — خاصية طالس وحساب الأطوال (مدخل الوحدة 9 « خاصية طالس »)
 * Manuel (4AM) : « أستعدّ » 1–3 (p. 103, module 0) et 4–5 (revisités, module 4), نشاط 1 (p. 104), معارف 1 et 2
 * (p. 106), طرائق « حساب أطوال » + دوري الآن (p. 107), exercices 1–6, 8, 9 (p. 110) et 26 (p. 113), QCM 1–2 (p. 112).
 * Source de vérité : docs/sources/4am/unit9/extraction.json.
 *
 * LE PARCOURS (REAL → DISCOVER → MANIPULATE → UNDERSTAND → TOUCH THE MATH → FORMALIZE → AUTOMATIZE → TRANSFER) :
 *   M0 أستعدّ          — le quatrième proportionnel, la droite des milieux, le tableau de proportionnalité ;
 *   M1 نشاط 1          — REAL (la projection du quartier) → DISCOVER → MANIPULATE (thales-beam : l'écran glissé,
 *                        incliné, poussé à travers A) ; les questions du نشاط 1 répondues depuis les arrêts de
 *                        l'élève ; la brique qui NOMME « خاصية طالس » ;
 *   M2 معارف           — UNDERSTAND (la propriété dans ses trois positions, le tableau de proportionnalité),
 *                        TOUCH THE MATH (ملاحظة 1 : deux rapports inégaux), FORMALIZE (k, تكبير / تصغير) ;
 *   M3 طرائق           — FORMALIZE (حساب أطوال, révélé ligne à ligne, la ligne 2/1 corrigée) + دوري الآن ;
 *   M4 أوظّف تعلّماتي  — AUTOMATIZE (ex-1, 2, 3, 4, 5, 6, 8) et TRANSFER (ex-9 : Pythagore puis Thalès, ex-26 أتعمّق,
 *                        les deux affirmations de « أستعدّ » que l'élève peut maintenant trancher) ;
 *   M5–M7 مسائل        — puis trois « مسائل » de la plateforme (modules 5–7) ;
 *   M8 إختبار أولي     — QCM 1–2 et quatre épreuves de la plateforme ; P1, P2, P3 couverts.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/handasa/talis-hisab-atwal';

export const LESSON_CONFIG = {
  id: 'talis-hisab-atwal',
  kind: 'lesson',
  unit: 'khassiyat-talis',
  unitTitle: 'خاصية طالس',
  sequentialUnlock: true,
  title: 'خاصية طالس وحساب الأطوال',
  description: 'مدخل الوحدة: شاشة تنزلق في حزمة ضوئية تقود إلى خاصية طالس، فالنسب المتساوية بين أطوال مثلثين في وضعية طالس تُوظَّف لحساب أطوال مجهولة، ويُقرأ أحد المثلثين تكبيرا أو تصغيرا للآخر بمعامل التناسبية k.',
  level: 'moyen',
  grade: '4am',
  chapter: 'handasa',
  chapterTitle: 'ميدان الهندسة',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '📐',
  estimatedDurationMin: 50,
  textbookRef: { unit: 9, activity: 1, pages: '103, 104, 106, 107, 110, 112, 113' },
  skills: [
    'التعرف على وضعية طالس واستخراج النسب الثلاث المتساوية',
    'توظيف خاصية طالس لحساب أطوال مجهولة في أشكال هندسية مستوية',
    'تحديد معامل التناسبية k وقراءة أحد المثلثين تكبيرا أو تصغيرا للآخر',
  ],
  teachingScope: {
    include: [
      'نشاط 1: الحالة الأولى (AB′ = 3,2 ، AC′ = 56/15) والحالة الثانية (وضعية الفراشة، k = 1/2) ونص خاصية طالس',
      'خاصية طالس في وضعياتها الثلاث، جدول التناسبية، والملاحظتان (معارف 1)',
      'معامل التناسبية k والتكبير والتصغير (معارف 2)',
      'طريقة حساب أطوال (متوازي الأضلاع ABCD) ودوري الآن',
    ],
    exclude: [
      'الخاصية العكسية لخاصية طالس وإثبات التوازي (الدرس 2)',
      'تقسيم قطعة وإنشاء طول معلوم (الدرس 3)',
      'الوضعية الإدماجية: المئذنة والأسطوانة في المخروط (أدمج تعلّماتي)',
    ],
  },
  knowledgeMap: true,
  knowledgeMapMode: 'progressive',
  // Les acquis que « أستعدّ » diagnostique : le quatrième proportionnel et le produit en croix, la droite des
  // milieux (et sa longueur), le tableau de proportionnalité (on multiplie, on n'ajoute pas).
  priorKnowledge: ['rabi-mutanasib', 'mustaqim-muntasafayn', 'jadwal-tanasub'],
  // « مسألة الدرس » (MASAIL_GENERATION_GUIDE.md) : annoncée dès le sommaire et rappelée au module 1, résolue
  // pas à pas au module 5 (content/problems.js). Prolonge le niveau متقدم du faisceau (thales-beam) : le
  // projecteur en A, la grande toile [BC], un écran parallèle, d'autres nombres. Sa figure (vue de dessus,
  // 1 unité = 1 m) est ICI, en littéraux : B′ = 0,4·B, C′ = 0,4·C, D = 1,5·B, E = 1,5·C (problems.test.js).
  lessonProblem: {
    module: 5,
    title: 'عرض في ساحة الحيّ: لوحة في الحزمة وشاشة أبعد',
    statement: "يحضّر نادي السينما بالمتوسطة عرضًا ليليًا في ساحة الحيّ التي تتّسع لـ 180 كرسيًّا. جهاز الإسقاط في النقطة $A$ يرسل حزمة ضوئية يحدّها نصفا المستقيمين $[AB)$ و $[AC)$، فتأتي الصورة على الشاشة الكبيرة $[BC]$، كما في الشكل (منظر من الأعلى)، حيث $AB = 10\\,\\mathrm{m}$ و $AC = 12\\,\\mathrm{m}$ و $BC = 6\\,\\mathrm{m}$. لضبط وضوح الصورة قبل العرض، يضع التقنيّ في الحزمة لوحة بيضاء عرضها 3 m، فتأتي الصورة عليها بين النقطتين $B'$ من $[AB]$ و $C'$ من $[AC]$، حيث $(B'C') \\parallel (BC)$. يضعها أوّلًا بحيث $AB' = 4\\,\\mathrm{m}$. القطعة $[DE]$ في الشكل هي موضع الشاشة في العرض الثاني (السؤال 3).",
    figure: {
      points: { A: [0, 0], "B'": [2.575, 3.061], "C'": [4.511, 1.642], B: [6.438, 7.652], C: [11.276, 4.104], D: [9.657, 11.478], E: [16.914, 6.156] },
      segments: [['A', 'D'], ['A', 'E'], { from: 'B', to: 'C', arrows: 1 }, { from: "B'", to: "C'", arrows: 1, tone: 'amber' }, { from: 'D', to: 'E', arrows: 1, tone: 'indigo' }],
      labels: { A: 'sw' },
      ariaLabel: 'جهاز الإسقاط في A، والحزمة بين نصفي المستقيمين [AB) و [AC)؛ الصورة على اللوحة [B′C′] وعلى الشاشة [BC] وعلى الشاشة الأبعد [DE]، والقطع الثلاث متوازية',
      maxWidth: 340,
    },
  },
  resources: [
    // Le module 1 ouvre sur LE FAISCEAU (thales-beam). متقدم (ouvert par défaut : le نشاط 1) : AB = 6, AC = 7,
    // BC = 6,1, l'écran à placer à AB′ = 3,2, puis à pousser à travers A ; مبتدئ : la projection du quartier.
    {
      kind: 'manipulation', code: 'thales-beam-cinema-4-5-3', type: 'thales-beam', module: 1,
      level: 'beginner',
      title: 'عرض في الحي: شاشة في الحزمة',
      objective: 'إذا كان (B′C′) يوازي (BC) فإن AB′/AB = AC′/AC = B′C′/BC، أينما كانت B′ على المستقيم (AB)؛ وإذا مال (B′C′) لم تعد النسب متساوية',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'cinema' },
      learningPointIds: ['4am_talis-hisab-atwal_P1'],
      sourceElementIds: ['act-1'],
    },
    {
      kind: 'manipulation', code: 'thales-beam-act1-6-7-61', type: 'thales-beam', module: 1,
      level: 'advanced',
      title: 'نشاط 1: AB = 6 ، AC = 7 ، AB′ = 3,2',
      objective: 'إذا كان (B′C′) يوازي (BC) فإن AB′/AB = AC′/AC = B′C′/BC، أينما كانت B′ على المستقيم (AB)؛ وإذا مال (B′C′) لم تعد النسب متساوية',
      autonomy: 'أطوال الكتاب بالجزء من عشرة: التلميذ يضع الشاشة بنفسه عند 3,2، ويحكم على تساوي نسب مقيسة بقيم مدوّرة (3,73 و 3,25) دون أن تُبسَّط له، ويقرّر أن يدفع الشاشة عبر A إلى الجهة الأخرى (وضعية الفراشة) ليتحقق أن الخاصية تبقى صحيحة',
      experience: { type: 'textbook', reason: '', theme: 'camera' },
      learningPointIds: ['4am_talis-hisab-atwal_P1', '4am_talis-hisab-atwal_P2'],
      sourceElementIds: ['act-1'],
    },
    { kind: 'situation', code: 'masala-1', module: 5, title: 'مسألة الدرس — عرض في ساحة الحيّ: لوحة في الحزمة وشاشة أبعد', learningPointIds: ['4am_talis-hisab-atwal_P1', '4am_talis-hisab-atwal_P2', '4am_talis-hisab-atwal_P3'] },
    { kind: 'situation', code: 'masala-2', module: 6, title: 'مسألة — ظلّ النخلة وعمود الإنارة', learningPointIds: ['4am_talis-hisab-atwal_P1', '4am_talis-hisab-atwal_P2'] },
    { kind: 'situation', code: 'masala-3', module: 7, title: 'مسألة — جمالون السقف وعارضتاه', learningPointIds: ['4am_talis-hisab-atwal_P1', '4am_talis-hisab-atwal_P2', '4am_talis-hisab-atwal_P3'] },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'ست عبارات: الرابع المتناسب والجداء المتصالب، مستقيم المنتصفين، وجدول التناسبية. صحيح أم خاطئ؟',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 5, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'nashat', path: `${LESSON_BASE_PATH}/nashat`,
      title: 'نشاط 1 — الشاشة في الحزمة', desc: 'اسحب الشاشة في حزمة جهاز الإسقاط، أمِلها، ادفعها عبر A؛ ثم أسئلة النشاط: الحالة الأولى (AB′ = 3,2)، الحالة الثانية (وضعية الفراشة)، ونص خاصية طالس.',
      stage: 'trigger', teachesLearningPointIds: ['4am_talis-hisab-atwal_P1', '4am_talis-hisab-atwal_P2'],
      color: 'indigo', style: 'featured', estimatedMin: 12, difficulty: 1, actionText: 'أجرّب الحزمة' },
    { id: '02', number: 2, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`,
      title: 'معارف — خاصية طالس ومعامل التناسبية', desc: 'الخاصية في وضعياتها الثلاث، جدول التناسبية، متى لا يكون المستقيمان متوازيين، ومعامل التكبير والتصغير k.',
      stage: 'discovery', teachesLearningPointIds: ['4am_talis-hisab-atwal_P1', '4am_talis-hisab-atwal_P3'],
      color: 'violet', style: 'featured', estimatedMin: 10, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'taraiq', path: `${LESSON_BASE_PATH}/taraiq`,
      title: 'طرائق — حساب أطوال', desc: 'متوازي الأضلاع ABCD والنقطة N: الطريقة سطرا سطرا، ثم دوري الآن (EW).',
      stage: 'formalization', teachesLearningPointIds: ['4am_talis-hisab-atwal_P2'],
      color: 'emerald', style: 'featured', estimatedMin: 7, difficulty: 2, actionText: 'أتعلّم الطريقة' },
    { id: '04', number: 4, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'تمارين الكتاب 1 إلى 6 و 8 و 9 و 26، وعبارتا «أستعدّ» 4 و 5 تحكم عليهما الآن.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_talis-hisab-atwal_P1', '4am_talis-hisab-atwal_P2', '4am_talis-hisab-atwal_P3'],
      color: 'amber', style: 'featured', estimatedMin: 10, difficulty: 2, actionText: 'أتدرّب' },
    // Les « مسائل » (track: 'problem') : practice_lab, avant le test, qui reste toujours ouvert. Elles comptent
    // dans la complétion, jamais dans la maîtrise — docs/architecture/LESSON_CONTRACT.md § Modules « مسائل ».
    { id: '05', number: 5, slug: 'masala-1', path: `${LESSON_BASE_PATH}/masala-1`,
      title: 'مسألة 1 — شاشة العرض في الحيّ', desc: 'مسألة الدرس: لوحة في الحزمة الضوئية، هل هي موازية؟ وشاشة أبعد للعرض الثاني. حلّ كامل خطوة بخطوة.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_talis-hisab-atwal_P1', '4am_talis-hisab-atwal_P2', '4am_talis-hisab-atwal_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '06', number: 6, slug: 'masala-2', path: `${LESSON_BASE_PATH}/masala-2`,
      title: 'مسألة 2 — ظلّ النخلة', desc: 'ظلّان ينتهيان في نقطة واحدة: ارتفاع النخلة، طول الحبل، وثمن سلسلة المصابيح.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_talis-hisab-atwal_P1', '4am_talis-hisab-atwal_P2'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '07', number: 7, slug: 'masala-3', path: `${LESSON_BASE_PATH}/masala-3`,
      title: 'مسألة 3 — جمالون السقف', desc: 'عارضتان موازيتان للقاعدة: طولاهما، معامل التصغير، وثمن الخشب.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_talis-hisab-atwal_P1', '4am_talis-hisab-atwal_P2', '4am_talis-hisab-atwal_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '08', number: 8, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'ستة أسئلة تُقيّم الكفاءات الثلاث، منها السؤالان 1 و 2 من أؤكّد تعلّماتي.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 6, difficulty: 2, actionText: 'أدخل التقويم' },
  ],
};
