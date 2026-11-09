/**
 * الدرس 6 — البحث عن القاسم المشترك الأكبر لعددين طبيعيين
 * Manuel 4AM, unité 1 : activité 6 أ/ب (p. 9), معارف 4 خاصيتان (p. 12), طرائق p. 13 (الفروق المتتابعة، خوارزمية إقليدس),
 * دوري الآن p. 13 (1), exercices 19, 20, 21 (p. 14), et le تحدّ d'ouverture (p. 7),
 * puis trois « مسائل » de la plateforme (modules 5–7).
 *
 * CONCEPTION (LESSON_DEVELOPMENT_GUIDE §4ter, rétrofit du 2026-10-15) — le manuel fixe les الكفاءات, pas le parcours.
 *   Entrée retenue (modules 1 et 3) : l'atelier de couture — deux rubans, le petit coupé dans le grand (M1) puis REPORTÉ le long
 *   du grand (M3). L'élève commence par le petit couple (21 et 14 ; 45 et 18), le couple du manuel (252 et 140 ; 765 et 135) est à
 *   un clic ; la fatigue de la longue chaîne de M1 est ce qui rend la division désirable en M3.
 *   Rejetées : (1) l'énoncé du نشاط 6 posé en carte au-dessus du labo (« احسب الفرق ثم اشرح… » avant tout geste) ; (2) le تحدّ des
 *   936 et 845 mètres de tabliers comme entrée — il suppose déjà la méthode, il reste l'application de أوظّف تعلّماتي.
 *   Ordre des idées : couper (le PGCD ne bouge pas) → POURQUOI → la brique APRÈS la réponse → 378 et 315 (la méthode se
 *   formule après la chaîne) → معارف : pourquoi 7 et 7 → la propriété → plusieurs soustractions = une division (l'exemple et la
 *   brique APRÈS la question) → M3 : reporter, pourquoi continuer avec le reste → 3356 et 1528 → le choix de la méthode.
 *   Aucune destination du manuel n'a bougé. Pas de lab dont le type change ; aucune ressource `platform_designed_entry` (les
 *   deux couples sont les nombres du manuel ou une réduction de ceux-ci, déjà déclarée `platform_adaptation`).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/bahth-pgcd';

export const LESSON_CONFIG = {
  id: 'bahth-pgcd',
  kind: 'lesson',
  unit: 'aadad-tabiiya-natiqa',
  unitTitle: 'الأعداد الطبيعيّة والأعداد النّاطقة',
  sequentialUnlock: true,
  // Regard de l'élève : 'mission' (modèle du pilote qasim-adad-tabii, VALIDÉ par le propriétaire le 2026-11-08 ; rollout leçon par
  // leçon, docs/reports/MISSION_ROLLOUT_PROGRESS.md) — implique le regard « focus » ; l'enseignant et le mode classe ne voient aucun changement.
  studentView: 'mission',
  // LA MISSION : l'ouverture avoue qu'on ne sait pas encore la résoudre vite ; les outils sont les connaissances de knowledge.jsx ; les points
  // d'étape RAPPROCHENT de la mission sans en résoudre aucune question (la مسألة 1 du module 5 reste entière : ils parlent de 35, 20, 27, 12, 49
  // et 14 — jamais de 210, de 150 ni de leur PGCD) ; formatifs, jamais une preuve de maîtrise.
  mission: {
    scene: 'sewing-workshop',
    title: 'ورشة الخياطة',
    opening: {
      text: 'لدى الخيّاطة شريطان مطرّزان: 210 سم و 150 سم. تريد قصّهما إلى قطع متساوية، أطول ما يمكن، دون أن يضيع شيء. حصر كل القواسم طويل: هل توجد طريقة أسرع تصل بها إلى طول القطعة؟',
      cta: 'لا أعرف بعد… هيا نجمع الأدوات',
    },
    tools: [
      { id: 'pgcd-farq', icon: '➖', label: 'الفرق' },
      { id: 'khwarizmiyat-al-furuq', icon: '✂️', label: 'الفروق المتتابعة' },
      { id: 'pgcd-baqi', icon: '➗', label: 'الباقي' },
      { id: 'khwarizmiyat-iqlidus', icon: '🔁', label: 'خوارزمية إقليدس' },
      { id: 'ikhtiyar-al-tariqa', icon: '🧭', label: 'أيّ طريقة؟' },
    ],
    climaxModule: 5,
    checkpoints: [
      {
        id: 'cp-farq', afterModule: 1,
        prompt: 'قصصتَ شريطًا من 20 سم من شريط من 35 سم. أيّ زوج له القاسم المشترك الأكبر نفسه؟',
        options: ['20 و 15', '35 و 55', '20 و 35 فقط، لا غير'],
        correct: 0,
        explain: '$\\mathrm{PGCD}(35\\ ;\\ 20) = \\mathrm{PGCD}(20\\ ;\\ 15)$ لأنّ $35 - 20 = 15$: القاسم المشترك يقسم الفرق.',
      },
      {
        id: 'cp-silsila', afterModule: 2,
        prompt: 'سلسلة الفروق للعددين 27 و 12 انتهت هكذا: … $6 - 3 = 3$ ثم $3 - 3 = 0$. ما $\\mathrm{PGCD}(27\\ ;\\ 12)$ ؟',
        options: ['3', '0', '6'],
        correct: 0,
        explain: 'آخر فرق غير معدوم هو 3. الفرق 0 يعني أنّنا توقّفنا، لا أنّه القاسم المشترك الأكبر.',
      },
      {
        id: 'cp-baqi', afterModule: 3,
        prompt: '$49 = 14 \\times 3 + 7$. إذن $\\mathrm{PGCD}(49\\ ;\\ 14) = \\mathrm{PGCD}(14\\ ;\\ ?)$',
        options: ['7', '3', '35'],
        correct: 0,
        explain: 'خاصية 2: القاسم المشترك يقسم الباقي 7، فنُكمل بالعددين 14 و 7.',
      },
      {
        id: 'cp-khitta', afterModule: 4,
        prompt: 'لقصّ شريطين إلى أطول قطع متساوية دون أن يضيع شيء، ماذا نحسب؟',
        options: ['القاسم المشترك الأكبر لطولي الشريطين', 'الفرق بين طولي الشريطين', 'مجموع طولي الشريطين'],
        correct: 0,
        explain: 'طول القطعة يقسم الطولين معًا، وأطوله هو PGCD — بالفروق أو بالقسمات. هذه خطّتك في المسألة التالية.',
      },
    ],
  },
  title: 'البحث عن القاسم المشترك الأكبر لعددين طبيعيين',
  description: 'البحث عن القاسم المشترك الأكبر لعددين بخوارزمية الفروق المتتابعة ثم بخوارزمية عمليات القسمات المتتابعة (خوارزمية إقليدس)، مع تبرير كل خطوة بالخاصيتين PGCD(a ; b) = PGCD(b ; a − b) و PGCD(a ; b) = PGCD(b ; r).',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🔁',
  estimatedDurationMin: 65,
  textbookRef: { unit: 1, activity: 6, pages: '7, 9, 12, 13, 14' },
  skills: [
    'تبرير المساواة PGCD(a ; b) = PGCD(b ; a − b) واستعمالها',
    'حساب القاسم المشترك الأكبر بخوارزمية الفروق المتتابعة (آخر فرق غير معدوم)',
    'تبرير المساواة PGCD(a ; b) = PGCD(b ; r) واستعمالها',
    'حساب القاسم المشترك الأكبر بخوارزمية إقليدس (آخر باقٍ غير معدوم)',
    'مقارنة الخوارزميتين من حيث عدد الخطوات واختيار الأنسب',
  ],
  teachingScope: { include: ['الخاصيتان وخوارزميتا الكتاب', 'مقارنة عدد الخطوات (765 و 135)'], exclude: ['التحليل إلى عوامل أولية', 'المضاعف المشترك الأصغر (غير وارد في البرنامج)'] },
  // « مسألة الدرس » (rollout مسائل, 2026-10-06) : montrée dès le sommaire,
  // rappelée au module 1, résolue pas à pas au module 5 (content/problems.js).
  // Prolonge l'atelier de couture du niveau متقدم : deux rubans, les différences
  // successives, d'autres nombres.
  lessonProblem: {
    module: 5,
    title: 'ورشة الخياطة: شريطان من 210 سم و 150 سم',
    statement: 'في ورشة خياطة، تحرص الخيّاطة على إتقان عملها وعلى ألّا يضيع من القماش شيء، ولديها شريطان مطرّزان بخيط ذهبي: الأوّل طوله 210 سم والثاني طوله 150 سم. تفتح الورشة أبوابها 6 أيام في الأسبوع. تريد الخيّاطة قصّ الشريطين إلى قطع لها كلّها الطول نفسه، أطول ما يمكن، دون أن يضيع أيّ جزء من الشريطين. تزيّن بكل قطعة قندورة واحدة، وتتقاضى 450 دج عن تزيين القندورة الواحدة.',
    illustration: { kind: 'timeline', icon: 'shirt', title: 'شريطان مطرّزان', marks: [{ label: 'الشريط الثاني', value: 150, unit: 'سم' }, { label: 'الشريط الأوّل', value: 210, unit: 'سم' }], ariaLabel: 'شريطان مطرّزان طولاهما 150 سم و 210 سم يُقصّان إلى قطع متساوية' },
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // La carte TOUTE OUVERTE (règle des pilotes, propriétaire 2026-11-08) : toutes les connaissances dès le début, sans verrou par محور.
  knowledgeMapOpen: true,
  priorKnowledge: ['khassiya-1', 'khassiya-2', 'pgcd-taarif', 'nataij-mubashira'],
  resources: [
    // Module 1 — workspace à deux niveaux sur les différences successives,
    // dans l'ATELIER DE COUTURE (thème `workshop`) : deux rubans, le petit
    // coupé dans le grand, encore et encore. L'invariant
    // PGCD(a ; b) = PGCD(b ; a − b) est le même ; ce qui change est la
    // LONGUEUR de la chaîne, donc la fatigue — et c'est précisément cette
    // fatigue qui motivera la division au module 3. Les nombres du manuel
    // sont gardés ; seule la situation est dessinée, et c'est déclaré.
    { kind: 'manipulation', code: 'pgcd-differences-21-14', type: 'pgcd-differences', module: 1,
      level: 'beginner',
      title: 'شريطان: 21 سم و 14 سم (سلسلة قصيرة)',
      objective: 'PGCD(a ; b) = PGCD(b ; a − b) والقاسم المشترك الأكبر هو آخر فرق غير معدوم',
      autonomy: '',
      experience: { type: 'platform_adaptation', reason: 'smaller_numbers_for_first_contact', theme: 'workshop' },
      learningPointIds: ['4am_bahth-pgcd_P1'], sourceElementIds: ['act-6a'] },
    { kind: 'manipulation', code: 'pgcd-differences-252-140', type: 'pgcd-differences', module: 1,
      level: 'advanced',
      title: 'شريطان: 252 سم و 140 سم — الفروق المتتابعة',
      objective: 'PGCD(a ; b) = PGCD(b ; a − b) والقاسم المشترك الأكبر هو آخر فرق غير معدوم',
      autonomy: 'سلسلة طويلة بأعداد الكتاب: التلميذ يحافظ على الترتيب حتى الفرق المعدوم دون توجيه',
      experience: { type: 'platform_adaptation', reason: 'multiple_representations', theme: 'workshop' },
      learningPointIds: ['4am_bahth-pgcd_P1', '4am_bahth-pgcd_P2'], sourceElementIds: ['act-6a'] },
    { kind: 'method', code: 'method-differences-117-91', module: 2, title: 'طريقة: خوارزمية الفروق المتتابعة (117 و 91)', learningPointIds: ['4am_bahth-pgcd_P2'], sourceElementIds: ['method-differences'] },
    // Module 3 — workspace à deux niveaux sur la division euclidienne, dans
    // le MÊME atelier : on ne coupe plus, on reporte le petit ruban le long
    // du grand ; le bout qui dépasse est le reste.
    //   مبتدئ  — 45 et 18 : deux divisions, on voit l'algorithme en entier.
    //   متقدم  — 765 et 135, les nombres du manuel : trois divisions contre
    //            huit différences, la comparaison que l'activité demande.
    { kind: 'manipulation', code: 'euclid-45-18', type: 'euclidean-algorithm', module: 3,
      level: 'beginner',
      title: 'خوارزمية إقليدس: شريطان 45 سم و 18 سم (قسمتان)',
      objective: 'PGCD(a ; b) = PGCD(b ; r) والقاسم المشترك الأكبر هو آخر باقٍ غير معدوم',
      autonomy: '',
      experience: { type: 'platform_adaptation', reason: 'smaller_numbers_for_first_contact', theme: 'workshop' },
      learningPointIds: ['4am_bahth-pgcd_P3'], sourceElementIds: ['act-6b'] },
    { kind: 'manipulation', code: 'euclid-765-135', type: 'euclidean-algorithm', module: 3,
      level: 'advanced',
      title: 'خوارزمية إقليدس: 765 و 135 (3 قسمات بدل 8 خطوات)',
      objective: 'PGCD(a ; b) = PGCD(b ; r) والقاسم المشترك الأكبر هو آخر باقٍ غير معدوم',
      autonomy: 'أعداد الكتاب مع المقارنة بالفروق: التلميذ يحكم بنفسه أيّ الطريقتين أنجع',
      experience: { type: 'platform_adaptation', reason: 'multiple_representations', theme: 'workshop' },
      learningPointIds: ['4am_bahth-pgcd_P3', '4am_bahth-pgcd_P4', '4am_bahth-pgcd_P5'], sourceElementIds: ['act-6b'] },
    { kind: 'method', code: 'method-euclid-1938-836', module: 3, title: 'طريقة: خوارزمية إقليدس (836 و 1938)', learningPointIds: ['4am_bahth-pgcd_P4'], sourceElementIds: ['method-euclid'] },
    { kind: 'situation', code: 'challenge-936-845', module: 4, title: 'تحدّ: 936 مئزرًا ورديًا و 845 مئزرًا أزرقًا', learningPointIds: ['4am_bahth-pgcd_P5'], sourceElementIds: ['challenge'] },
    // Modules 5–7 — les « مسائل » : exercices complets de type امتحان, ajouts
    // de la plateforme (content/problems.js), sans aucune preuve de maîtrise.
    { kind: 'situation', code: 'masala-1', module: 5, title: 'مسألة الدرس — ورشة الخياطة: شريطان من 210 سم و 150 سم', learningPointIds: ['4am_bahth-pgcd_P1', '4am_bahth-pgcd_P2'] },
    { kind: 'situation', code: 'masala-2', module: 6, title: 'مسألة — التعاونية الحليبية: 1170 قطعة جبن و 702 قارورة لبن', learningPointIds: ['4am_bahth-pgcd_P3', '4am_bahth-pgcd_P4'] },
    { kind: 'situation', code: 'masala-3', module: 7, title: 'مسألة — تبليط قاعة: 585 سم و 405 سم', learningPointIds: ['4am_bahth-pgcd_P3', '4am_bahth-pgcd_P4', '4am_bahth-pgcd_P5'] },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'ست عبارات: صحيح أم خاطئ؟ خاصيتا القواسم وPGCD.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'al-furuq', path: `${LESSON_BASE_PATH}/al-furuq`,
      title: 'نشاط 6 أ — الفروق المتتابعة', desc: '252 و 140: اطرح، وعوّض، وأعد — إلى أن يصير الفرق معدومًا.',
      stage: 'trigger', teachesLearningPointIds: ['4am_bahth-pgcd_P1', '4am_bahth-pgcd_P2'], color: 'indigo', style: 'featured', estimatedMin: 14, difficulty: 2, actionText: 'أطرح وأعيد' },
    { id: '02', number: 2, slug: 'khassiyatan', path: `${LESSON_BASE_PATH}/khassiyatan`,
      title: 'معارف — خاصيتان، وطريقة الفروق', desc: 'PGCD(a ; b) = PGCD(b ; a − b) و PGCD(a ; b) = PGCD(b ; r)، ثم مثال الكتاب 117 و 91.',
      stage: 'discovery', teachesLearningPointIds: ['4am_bahth-pgcd_P1', '4am_bahth-pgcd_P2', '4am_bahth-pgcd_P3'], color: 'violet', style: 'featured', estimatedMin: 14, difficulty: 2, actionText: 'أبرّر' },
    { id: '03', number: 3, slug: 'khwarizmiyat-iqlidus', path: `${LESSON_BASE_PATH}/khwarizmiyat-iqlidus`,
      title: 'نشاط 6 ب — خوارزمية إقليدس', desc: '765 و 135: ثمان خطوات بالفروق، ثلاث قسمات بإقليدس. ثم 836 و 1938.',
      stage: 'manipulation', teachesLearningPointIds: ['4am_bahth-pgcd_P3', '4am_bahth-pgcd_P4', '4am_bahth-pgcd_P5'], color: 'emerald', style: 'featured', estimatedMin: 15, difficulty: 3, actionText: 'أقسم وأعيد' },
    { id: '04', number: 4, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'دوري الآن (285 و 45)، تمارين 19 ← 21، والعودة إلى تحدّي المآزر.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_bahth-pgcd_P2', '4am_bahth-pgcd_P4', '4am_bahth-pgcd_P5'], color: 'amber', style: 'featured', estimatedMin: 14, difficulty: 3, actionText: 'أتدرّب' },
    // Les « مسائل » (track: 'problem') : practice_lab, avant le test, qui
    // reste toujours ouvert. Elles comptent dans la complétion, jamais dans
    // la maîtrise — docs/architecture/LESSON_CONTRACT.md § Modules « مسائل ».
    // 6 min chacune : la leçon est déjà à 71 min (plafond 90).
    { id: '05', number: 5, slug: 'masala-1', path: `${LESSON_BASE_PATH}/masala-1`,
      title: 'مسألة 1 — ورشة الخياطة', desc: 'مسألة الدرس: شريطان من 210 سم و 150 سم، والفروق المتتابعة. حلّ كامل خطوة بخطوة.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_bahth-pgcd_P1', '4am_bahth-pgcd_P2'],
      color: 'amber', style: 'featured', estimatedMin: 6, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '06', number: 6, slug: 'masala-2', path: `${LESSON_BASE_PATH}/masala-2`,
      title: 'مسألة 2 — صناديق التعاونية الحليبية', desc: 'خوارزمية إقليدس: كم صندوقًا متماثلًا للمطاعم المدرسية؟ ماذا في كل صندوق؟ وكم قيمته؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_bahth-pgcd_P3', '4am_bahth-pgcd_P4'],
      color: 'amber', style: 'featured', estimatedMin: 6, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '07', number: 7, slug: 'masala-3', path: `${LESSON_BASE_PATH}/masala-3`,
      title: 'مسألة 3 — تبليط قاعة', desc: 'أيّ خوارزمية أنسب؟ أكبر بلاطة مربّعة، عدد البلاطات، والثمن.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_bahth-pgcd_P3', '4am_bahth-pgcd_P4', '4am_bahth-pgcd_P5'],
      color: 'amber', style: 'featured', estimatedMin: 6, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '08', number: 8, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'ست أسئلة تُقيّم الكفاءات الخمس.', stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 8, difficulty: 4, actionText: 'أدخل التقويم' },
  ],
};
