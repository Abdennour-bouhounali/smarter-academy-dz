/**
 * الدرس 2 — الأعداد الناطقة والأعداد غير الناطقة
 * Unité 2 du manuel (4AM), نشاط 2 (p. 20), معارف 2 (p. 22), exercices 9, 10
 * (p. 26), 25 (p. 27), 31-1 et 35 (p. 29), أوظّف تكنولوجيات الإعلام والاتصال
 * « √2 » (p. 30), puis trois « مسائل » de la plateforme (modules 4–6).
 * Source de vérité : docs/sources/4am/unit2/extraction.json.
 *
 * CONCEPTION (LESSON_DEVELOPMENT_GUIDE §4ter, rétrofit du 2026-10-15) — le manuel fixe les الكفاءات, pas le parcours.
 *   Entrée retenue : la règle graduée sur TROIS aires seulement (9, 0,25, 7 — le niveau مبتدئ) : pour savoir si un côté « tombe » sur
 *   une graduation il faut le TIRER, et 7 refuse toute graduation sans dire pourquoi. Rejeté : le classement imprimé du manuel
 *   (huit racines déjà rangées en deux صنفين, puis « à quel صنف appartient √169 ? ») comme ouverture — la liste donne la réponse et
 *   √169 se tranche de mémoire (13² = 169). Le classement n'apparaît qu'APRÈS la 1re réponse, comme encadré du manuel dont on cherche le
 *   critère ; la question أ (√169) devient l'APPLICATION du critère ; les six autres aires du manuel restent le niveau متقدم du MÊME labo.
 *   Le labo reste une activité du manuel (pas de `platform_designed_entry`).
 *   Ordre des idées : pourquoi √0,25 tombe sur les demis → le classement du manuel et son critère (écrit d'abord avec les mots de
 *   l'élève), PUIS la brique `murabba-natiq` → le صنف de √169 → (module 2) rationnel ou non ? (le critère seul), PUIS la brique
 *   `ghayr-natiq` → ce que la calculatrice cache de √2.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/natiqa-ghayr-natiqa';

export const LESSON_CONFIG = {
  id: 'natiqa-ghayr-natiqa',
  kind: 'lesson',
  unit: 'hisab-judhur',
  unitTitle: 'الحساب على الجذور',
  sequentialUnlock: true,
  // Regard de l'élève : 'mission' (modèle du pilote qasim-adad-tabii, VALIDÉ par le propriétaire le 2026-11-08 ; rollout leçon par leçon,
  // docs/reports/MISSION_ROLLOUT_PROGRESS.md — unité 2, leçon 2, 2026-11-09) — implique le regard « focus » ; l'enseignant et le mode classe ne voient
  // aucun changement.
  studentView: 'mission',
  // LA MISSION : l'ouverture avoue qu'on ne sait pas encore la résoudre ; les outils sont les connaissances de knowledge.jsx ; les points d'étape
  // RAPPROCHENT de la mission sans en résoudre aucune question (la مسألة du module 4 reste entière : ils parlent de 49/25, 11, 0,36, 1/25 et 7 —
  // jamais de 2,89, 1,7, 4, des 9 pièces, de 3, √3, 1,74, des 12 jours ni des 500 دج) ; formatifs, jamais une preuve de maîtrise.
  mission: {
    scene: 'carpet-loom',
    title: 'ثلاث زرابي مربّعة',
    opening: {
      text: 'في ورشة لنسج الزرابي، يقيس الحرفي أطوال زرابيه بشريط متري مدرّج بالسنتيمتر. طُلبت منه ثلاث زرابي مربّعة: الزربية A مساحتها 2,89 م²، والزربية B مساحتها 4 م² وتتكوّن من 9 قطع مربّعة متقايسة، والزربية C مساحتها 3 م². أيّ هذه الأضلاع يقرؤه على شريطه بالضبط، وأيّها لن يقرأه أبدًا؟ وكم يدفع ثمنًا لشريط الصوف حول الزربية C، والمتر منه بـ 500 دج؟',
      cta: 'لا أعرف بعد… هيا نجمع الأدوات',
    },
    tools: [
      { id: 'murabba-natiq', icon: '✅', label: 'جذر مربّع عدد ناطق' },
      { id: 'ghayr-natiq', icon: '🌀', label: 'جذر غير ناطق' },
      { id: 'qima-muqarraba', icon: '📏', label: 'القيم المقرّبة والمدوّر' },
    ],
    climaxModule: 4,
    checkpoints: [
      {
        id: 'cp-natiq', afterModule: 1,
        prompt: '$\\sqrt{\\dfrac{49}{25}} = \\ldots$',
        options: ['$\\dfrac{7}{5}$', '$\\dfrac{49}{5}$', '$\\dfrac{7}{25}$'],
        correct: 0,
        explain: '$\\dfrac{7}{5}$ عدد موجب و $\\left(\\dfrac{7}{5}\\right)^2 = \\dfrac{49}{25}$: البسط والمقام كلاهما مربّع.',
      },
      {
        id: 'cp-ghayr', afterModule: 2,
        prompt: 'أيّ هذه الأعداد ليس عددًا ناطقًا؟',
        options: ['$\\sqrt{11}$', '$\\sqrt{0{,}36}$', '$\\sqrt{\\dfrac{1}{25}}$'],
        correct: 0,
        explain: '$\\sqrt{0{,}36} = 0{,}6$ و $\\sqrt{\\dfrac{1}{25}} = \\dfrac{1}{5}$ ناطقان؛ أمّا 11 فعدد طبيعي ليس مربّع أيّ عدد طبيعي، فليس مربّع عدد ناطق: $\\sqrt{11}$ ليس عددًا ناطقًا.',
      },
      {
        id: 'cp-muqarraba', afterModule: 3,
        prompt: 'القيمة المقرّبة إلى $0{,}1$ بالنقصان للعدد $\\sqrt{7}$ هي:',
        options: ['$2{,}6$', '$2{,}7$', '$3{,}5$'],
        correct: 0,
        explain: '$2{,}6^2 = 6{,}76$ أصغر من 7، و $2{,}7^2 = 7{,}29$ أكبر من 7: إذن $\\sqrt{7}$ بين 2,6 و 2,7، والقيمة بالنقصان هي $2{,}6$.',
      },
    ],
  },
  title: 'الأعداد الناطقة والأعداد غير الناطقة',
  description: 'التمييز بين العدد الناطق والعدد غير الناطق من خلال جذره التربيعي: جذر مربع عدد ناطق عدد ناطق، وجذر عدد ليس مربعًا لعدد ناطق عدد غير ناطق، نكتفي له بقيم مقرّبة.',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🔍',
  estimatedDurationMin: 45,
  textbookRef: { unit: 2, activity: 2, pages: '20, 22, 26, 27, 29, 30' },
  skills: [
    'تصنيف جذور تربيعية: جذر ناطق أو جذر غير ناطق',
    'التعرّف على الأعداد التي هي مربعات لأعداد ناطقة وحساب جذورها التربيعية',
    'معرفة أن الجذر التربيعي لعدد ليس مربعًا لعدد ناطق ليس عددًا ناطقًا، وأن الحاسبة لا تعرض له إلا قيمة مقرّبة',
    'حصر جذر تربيعي بين قيمتين مقرّبتين بالنقصان وبالزيادة، وإعطاء مدوّره',
  ],
  teachingScope: {
    include: [
      'معارف 2: إذا كان a مربعًا لعدد ناطق فإن √a عدد ناطق، وإلا فإن √a ليس عددًا ناطقًا',
      'القيمة التي تعرضها الحاسبة لعدد غير ناطق قيمة مقرّبة (√2)',
      'القيم المقرّبة بالنقصان وبالزيادة والمدوّر لجذر تربيعي (تمارين 9، 10، 25، 35)',
    ],
    exclude: [
      'تعريف الجذر التربيعي وخاصيتاه (الدرس 1)',
      'حل المعادلة x² = a (الدرس 3)',
      'جداء جذرين وحاصل قسمتهما (الدرس 4)',
      'برهان أنّ عددًا ما غير ناطق: الكتاب يكتفي بالنتيجة',
    ],
  },
  // « مسألة الدرس » : montrée dès le sommaire, rappelée au module 1, résolue
  // pas à pas au module 4 (content/problems.js). Prolonge la règle graduée du
  // niveau متقدم : des carrés d'aire connue, un côté qui tombe ou non sur une
  // graduation (le mètre ruban du tisserand).
  lessonProblem: {
    module: 4,
    title: 'ورشة الزرابي: ثلاث زرابي مربّعة',
    illustration: { kind: 'tags', cards: [{ title: 'الزربية A', lines: [{ label: 'المساحة', value: '2,89', unit: 'm²' }] }, { title: 'الزربية B', lines: [{ label: 'المساحة', value: '4', unit: 'm²' }, { label: 'عدد القطع', value: '9' }] }, { title: 'الزربية C', lines: [{ label: 'المساحة', value: '3', unit: 'm²' }] }], ariaLabel: 'ثلاث زرابي مربّعة: A مساحتها 2,89 م² و B مساحتها 4 م² من 9 قطع و C مساحتها 3 م²' },
    statement: 'في ورشة لنسج الزرابي، يتقن الحرفي صنعته حفاظًا على تراث وطنه، فيقيس أطوال زرابيه بشريط متري مدرّج بالسنتيمتر. طُلبت منه ثلاث زرابي مربّعة الشكل: الزربية A مساحتها 2,89 m²، والزربية B مساحتها 4 m² وتتكوّن من 9 قطع مربّعة متقايسة (3 صفوف في كل صفّ 3 قطع)، والزربية C مساحتها 3 m². يستغرق نسج المتر المربّع الواحد 12 يومًا. يخيط الحرفي على كل ضلع من أضلاع الزربية C شريطًا من الصوف، ثمن المتر منه 500 دج.',
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // La carte TOUTE OUVERTE (règle des pilotes, propriétaire 2026-11-08) : toutes les connaissances dès le début, sans verrou par محور.
  knowledgeMapOpen: true,
  // الدرس 1 (jidhr-taarif, qima-mudbuta) et l'année précédente (adad-natiq),
  // diagnostiqués par « أستعدّ » (module 0).
  priorKnowledge: ['jidhr-taarif', 'qima-mudbuta', 'adad-natiq'],
  resources: [
    // Le module 1 est un WORKSPACE À DEUX NIVEAUX : la même règle graduée,
    // les nombres du manuel aux deux niveaux (نشاط 2 p. 20).
    //   مبتدئ  — trois aires du classement (9, 0,25, 7), graduations 1/1 … 1/10.
    //   متقدم  — les six autres aires du classement, graduations 1/1 … 1/12.
    {
      kind: 'manipulation', code: 'square-root-side-act2-3', type: 'square-root-side', module: 1,
      level: 'beginner',
      title: 'على أيّ تدريجة يقع الجذر؟ — ثلاث مساحات',
      objective: 'إذا كان a مربعًا لعدد ناطق فإن √a عدد ناطق يقع على تدريجة، وإلا فإن √a ليس عددًا ناطقًا',
      autonomy: '',
      experience: { type: 'textbook', reason: '', theme: '' },
      learningPointIds: ['4am_natiqa-ghayr-natiqa_P1', '4am_natiqa-ghayr-natiqa_P2'],
      sourceElementIds: ['act-2'],
    },
    {
      kind: 'manipulation', code: 'square-root-side-act2-6', type: 'square-root-side', module: 1,
      level: 'advanced',
      title: 'صنفان من الجذور — ست مساحات وتدريجات حتى الجزء من 12',
      objective: 'إذا كان a مربعًا لعدد ناطق فإن √a عدد ناطق يقع على تدريجة، وإلا فإن √a ليس عددًا ناطقًا',
      autonomy: 'ست مساحات دون ترتيب مقترح وتدريجات من الوحدة إلى الجزء من 12: التلميذ يختار بنفسه التدريجة التي قد يقع عليها كل جذر، ويقرّر متى يتوقّف عن البحث',
      experience: { type: 'textbook', reason: '', theme: '' },
      learningPointIds: ['4am_natiqa-ghayr-natiqa_P1', '4am_natiqa-ghayr-natiqa_P2', '4am_natiqa-ghayr-natiqa_P3'],
      sourceElementIds: ['act-2'],
    },
    // Modules 4–6 — les « مسائل » : exercices complets de type امتحان, ajouts
    // de la plateforme (content/problems.js), sans aucune preuve de maîtrise.
    { kind: 'situation', code: 'masala-1', module: 4, title: 'مسألة الدرس — ورشة الزرابي: ثلاث زرابي مربّعة', learningPointIds: ['4am_natiqa-ghayr-natiqa_P1', '4am_natiqa-ghayr-natiqa_P2', '4am_natiqa-ghayr-natiqa_P3'] },
    { kind: 'situation', code: 'masala-2', module: 5, title: 'مسألة — ورشة الحدادة: قضبان التقوية', learningPointIds: ['4am_natiqa-ghayr-natiqa_P1', '4am_natiqa-ghayr-natiqa_P2', '4am_natiqa-ghayr-natiqa_P3'] },
    { kind: 'situation', code: 'masala-3', module: 6, title: 'مسألة — مطبعة الحيّ: ملصقان مربّعان', learningPointIds: ['4am_natiqa-ghayr-natiqa_P1', '4am_natiqa-ghayr-natiqa_P2', '4am_natiqa-ghayr-natiqa_P3'] },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'عشر عبارات: صحيح أم خاطئ؟ العدد الناطق والجذر التربيعي، من السهل إلى الأصعب.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'nashat', path: `${LESSON_BASE_PATH}/nashat`,
      title: 'نشاط 2 — صنفان من الجذور', desc: 'اسحب ضلع المربّع على مسطرة مدرّجة: بعض الجذور تقع على تدريجة وبعضها لا يقع أبدًا.',
      stage: 'trigger', teachesLearningPointIds: ['4am_natiqa-ghayr-natiqa_P1', '4am_natiqa-ghayr-natiqa_P2'],
      color: 'indigo', style: 'featured', estimatedMin: 12, difficulty: 1, actionText: 'أجرّب' },
    { id: '02', number: 2, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`,
      title: 'معارف — ناطق أم غير ناطق؟', desc: 'نتيجتان ومثالان، ثم ما تخفيه الحاسبة عن √2، وورقة زميل فيها خطأ.',
      stage: 'discovery', teachesLearningPointIds: ['4am_natiqa-ghayr-natiqa_P1', '4am_natiqa-ghayr-natiqa_P2', '4am_natiqa-ghayr-natiqa_P3'],
      color: 'violet', style: 'featured', estimatedMin: 10, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'قيم مقرّبة بالنقصان وبالزيادة ومدوّرات لجذور تربيعية.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_natiqa-ghayr-natiqa_P1', '4am_natiqa-ghayr-natiqa_P3'],
      color: 'amber', style: 'featured', estimatedMin: 11, difficulty: 2, actionText: 'أتدرّب' },
    // Les « مسائل » (track: 'problem') : practice_lab, avant le test, qui
    // reste toujours ouvert. Elles comptent dans la complétion, jamais dans
    // la maîtrise — docs/architecture/LESSON_CONTRACT.md § Modules « مسائل ».
    { id: '04', number: 4, slug: 'masala-1', path: `${LESSON_BASE_PATH}/masala-1`,
      title: 'مسألة 1 — ورشة الزرابي', desc: 'مسألة الدرس: ثلاث زرابي مربّعة، ضلع عشري وضلع ناطق وضلع غير ناطق. حلّ كامل خطوة بخطوة.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_natiqa-ghayr-natiqa_P1', '4am_natiqa-ghayr-natiqa_P2', '4am_natiqa-ghayr-natiqa_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '05', number: 5, slug: 'masala-2', path: `${LESSON_BASE_PATH}/masala-2`,
      title: 'مسألة 2 — ورشة الحدادة', desc: 'قطر شبّاك مستطيل وقطر شبّاك مربّع: أيّهما ناطق؟ وكم قضيبًا يشتري الحدّاد؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_natiqa-ghayr-natiqa_P1', '4am_natiqa-ghayr-natiqa_P2', '4am_natiqa-ghayr-natiqa_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '06', number: 6, slug: 'masala-3', path: `${LESSON_BASE_PATH}/masala-3`,
      title: 'مسألة 3 — مطبعة الحيّ', desc: 'ملصقان مربّعان: هل ضلع الثاني 29,7 cm بالضبط؟ وعلى أيّ ورقة يُطبع؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_natiqa-ghayr-natiqa_P1', '4am_natiqa-ghayr-natiqa_P2', '4am_natiqa-ghayr-natiqa_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '07', number: 7, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'خمسة أسئلة تُقيّم الكفاءات الثلاث.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 6, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
