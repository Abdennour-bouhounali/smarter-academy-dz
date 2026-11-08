/**
 * الدرس 3 — خواص قواسم عدد طبيعي
 * Manuel 4AM, unité 1 : activité 3 (p. 8), معارف 2 (p. 10), « أتعلّم البرهنة » (p. 11), دوري الآن p. 11 (2),
 * exercices 12, 13, 14, 15, 16 (p. 14), puis trois « مسائل » de la plateforme (modules 5–7).
 * Source : docs/sources/4am/unit1/extraction.json.
 *
 * CONCEPTION (LESSON_DEVELOPMENT_GUIDE §4ter, rétrofit du 2026-10-15) — le manuel fixe les الكفاءات, pas le parcours.
 *   Entrée retenue : le CHANTIER (labo divisor-properties, murs de briques de longueur n) posé seul en tête — la main colle,
 *   retire, mesure, et au niveau متقدم (9 | 900 et 90) elle PRÉDIT avant de bâtir ; la première question demande POURQUOI
 *   aucune demi-brique n'est apparue. Rejetée : le نشاط 3 comme entrée (trois triplets a, b, n à « vérifier » sous une carte
 *   qui annonce déjà ce qui est vrai : on vérifie une propriété énoncée, on ne la découvre pas) ; les cas 2 et 3 y deviennent
 *   une APPLICATION, après la réponse. Ordre des idées : POURQUOI pas de demi-brique (rappel « n divise a » APRÈS) → cas 2 et 3
 *   du livre → conjecture à compléter → معارف : خاصية 1 / 2, chacune avec sa brique APRÈS la question → أتعلّم البرهنة.
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/khawass-qawasim';

export const LESSON_CONFIG = {
  id: 'khawass-qawasim',
  kind: 'lesson',
  unit: 'aadad-tabiiya-natiqa',
  unitTitle: 'الأعداد الطبيعيّة والأعداد النّاطقة',
  sequentialUnlock: true,
  // Regard de l'élève : 'mission' (modèle du pilote qasim-adad-tabii, VALIDÉ par le propriétaire le 2026-11-08 ; rollout leçon par
  // leçon, docs/reports/MISSION_ROLLOUT_PROGRESS.md) — implique le regard « focus » ; l'enseignant et le mode classe ne voient aucun changement.
  studentView: 'mission',
  // LA MISSION : l'ouverture avoue qu'on ne sait pas encore la résoudre ; les outils sont les connaissances de knowledge.jsx ; les points
  // d'étape RAPPROCHENT de la mission sans en résoudre aucune question (la مسألة 1 du module 5 reste entière : ils parlent de 6, 7, 18,
  // de n — jamais de la brique de 25, ni des murs de 875 et 350) ; formatifs, jamais une preuve de maîtrise.
  mission: {
    scene: 'construction-wall',
    title: 'ورشة البناء',
    opening: {
      text: 'يبني البنّاء في الورشة جدارين بطوب طول الطوبة الواحدة منه 25 سم، ويرصّ كل صفّ دون أن يقطع أيّ طوبة. هل يستطيع أن يعرف، من غير أن يقسم من جديد، أنّ الجدارين معًا — وما بينهما من فرق — مبنيّان أيضًا بطوب كامل؟',
      cta: 'لا أعرف بعد… هيا نجمع الأدوات',
    },
    tools: [
      { id: 'qasim-mushtarak-rappel', icon: '🧱', label: 'n يقسم a' },
      { id: 'khassiya-1', icon: '➕', label: 'المجموع والفرق' },
      { id: 'khassiya-2', icon: '➗', label: 'باقي القسمة' },
      { id: 'burhan-idha-fainna', icon: '✍️', label: 'البرهان' },
    ],
    climaxModule: 5,
    checkpoints: [
      {
        id: 'cp-jidaa', afterModule: 1,
        prompt: 'جدارا بنّاء آخر مبنيّان بطوب طوله 6 سم: طولاهما 30 سم و 18 سم. ماذا يعرف عن طولهما معًا، أي عن العدد 48؟',
        options: ['6 يقسم 48 أيضًا: الجدار الملصوق مبنيّ بطوب كامل', 'قد تظهر نصف طوبة في الجدار الملصوق', 'لا يعرف شيئًا قبل أن يجري القسمة'],
        correct: 0,
        explain: 'كل جدار مبنيّ بطوب كامل، فالجداران معًا طوب كامل. هذه هي الفكرة التي ستستعملها في المهمة الكبرى.',
      },
      {
        id: 'cp-khassiya', afterModule: 2,
        prompt: '7 يقسم 63 ويقسم 28. أيّ هذه الأعداد يقسمه 7 دون أن نجري قسمة جديدة؟',
        options: ['الفرق 35 والمجموع 91', 'العدد 63 + 1', 'العدد 28 − 1'],
        correct: 0,
        explain: 'خاصية 1: العدد الذي يقسم عددين يقسم مجموعهما وفرقهما: $63 - 28 = 35 = 7 \\times 5$ و $63 + 28 = 91 = 7 \\times 13$.',
      },
      {
        id: 'cp-burhan', afterModule: 3,
        prompt: 'لبرهان أنّ عددًا طبيعيًّا $d$ يقسم عددًا $m$، ماذا يكفي أن نجد؟',
        options: ['عددًا طبيعيًّا $k$ حيث $m = d \\times k$', 'عددًا أصغر من $m$ فقط', 'مثالًا عدديًّا واحدًا يتحقّق'],
        correct: 0,
        explain: 'هذه هي جملة الطريقة: نفرض الشرط ونصل إلى $m = d \\times k$ بحروف لا بأعداد معيّنة.',
      },
      {
        id: 'cp-khitta', afterModule: 4,
        prompt: 'يريد البنّاء أن يتأكّد أنّ طولًا مثل $a + b$ مبنيّ بطوب طوله $n$ كامل. ما أفضل خطّة؟',
        options: ['يكتب $a$ و $b$ جداءين في $n$ ثم يجمع', 'يرسم الجدار كلّه ويعدّ الطوب', 'يقسّم الجدار إلى نصفين'],
        correct: 0,
        explain: 'إذا كان $a = n \\times q$ و $b = n \\times q\'$ فإنّ $a + b = n \\times (q + q\')$: لا حاجة إلى قسمة جديدة. هذه خطّتك في المسألة التالية.',
      },
    ],
  },
  title: 'خواص قواسم عدد طبيعي',
  description: 'خواص قواسم عدد طبيعي: القاسم المشترك لعددين يقسم مجموعهما وفرقهما وباقي القسمة الإقليدية لأحدهما على الآخر، وتعلّم البرهنة على خاصية من الشكل «إذا … فإنّ …».',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🧩',
  estimatedDurationMin: 55,
  textbookRef: { unit: 1, activity: 3, pages: '8, 10, 11, 14' },
  skills: [
    'معرفة أن القاسم المشترك لعددين يقسم مجموعهما وفرقهما',
    'معرفة أن قاسم عدد يقسم كل مضاعف له',
    'معرفة أن القاسم المشترك لعددين يقسم باقي القسمة الإقليدية لأحدهما على الآخر',
    'البرهان على خاصية من الشكل «إذا … فإنّ …» بإيجاد عدد طبيعي k حيث m = d × k',
  ],
  teachingScope: {
    include: ['خاصية 1 وخاصية 2 من الكتاب', 'البرهنة: المعطيات، المطلوب، البرهان'],
    exclude: ['القاسم المشترك الأكبر (الدرس 4)', 'خوارزميات البحث عن PGCD (الدرس 6) — تُبرَّر لاحقًا بهذه الخواص'],
  },
  // « مسألة الدرس » (rollout مسائل, 2026-10-06) : montrée dès le sommaire,
  // rappelée au module 1, résolue pas à pas au module 5 (content/problems.js).
  // Prolonge le chantier du niveau متقدم : murs en briques entières, d'autres nombres.
  lessonProblem: {
    module: 5,
    title: 'ورشة البناء: جداران بطوب طوله 25 سم',
    statement: 'في ورشة بناء مسكن بالبليدة، يحرص البنّاء على إتقان عمله وأداء الأمانة التي أُوكلت إليه، فيبني جدارين بطوب طول الطوبة الواحدة منه 25 سم، ويرصّ كل صفّ على طول الجدار دون أن يقطع أيّ طوبة. طول الجدار الأول 875 سم وطول الجدار الثاني 350 سم، وفي كل جدار 15 صفًّا من الطوب. يشتغل في الورشة 4 عمّال، وثمن الطوبة الواحدة 40 دج.',
    illustration: { kind: 'scene', icon: 'tile', bg: 'rose', chips: [{ label: 'طول الطوبة', value: 25, unit: 'سم' }, { label: 'الجدار الأول', value: 875, unit: 'سم' }, { label: 'الجدار الثاني', value: 350, unit: 'سم' }, { label: 'ثمن الطوبة', value: 40, unit: 'دج', tone: 'green' }], ariaLabel: 'جداران من الطوب: طول الطوبة 25 سم وطولا الجدارين 875 سم و 350 سم' },
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // La carte TOUTE OUVERTE (règle des pilotes, propriétaire 2026-11-08) : toutes les connaissances dès le début, sans verrou par محور.
  knowledgeMapOpen: true,
  priorKnowledge: ['qasim-jidaa', 'qisma-iqlidiya'],
  resources: [
    // Module 1 — workspace à deux niveaux. La propriété est la même ; ce qui
    // change est la possibilité de la VÉRIFIER en comptant. Les nombres du
    // manuel sont DESSINÉS en murs de briques de longueur n (thème
    // `construction`) : accoler, enlever, mesurer — le résultat est toujours
    // un mur de briques entières. Le contexte est déclaré : une adaptation
    // de la plateforme, jamais silencieuse.
    //   مبتدئ  — le cas 1 du manuel (3 | 18 et 12) : les briques se comptent.
    //   متقدم  — 9 | 900 et 90 : impossible à compter, il faut PRÉDIRE avec
    //            la propriété avant de poser. Les cas 2 et 3 du manuel
    //            restent à l'étape 1, où le manuel les pose.
    { kind: 'manipulation', code: 'divisor-properties-18-12', type: 'divisor-properties', module: 1,
      level: 'beginner',
      title: 'الحالة 1: n = 3، a = 18، b = 12',
      objective: 'n يقسم a و b ⇒ n يقسم a + b و a − b وباقي قسمة a على b',
      autonomy: '',
      experience: { type: 'platform_adaptation', reason: 'multiple_representations', theme: 'construction' },
      learningPointIds: ['4am_khawass-qawasim_P1'], sourceElementIds: ['act-3'] },
    { kind: 'manipulation', code: 'divisor-properties-900-90', type: 'divisor-properties', module: 1,
      level: 'advanced',
      title: 'أعداد لا تُعدّ: n = 9، a = 900، b = 90',
      objective: 'n يقسم a و b ⇒ n يقسم a + b و a − b وباقي قسمة a على b',
      autonomy: 'أعداد كبيرة لا تُتحقّق بالعدّ: على التلميذ أن يتوقّع بالخاصية قبل الكشف',
      experience: { type: 'platform_context', reason: 'platform_designed_entry', theme: 'construction' },
      learningPointIds: ['4am_khawass-qawasim_P1', '4am_khawass-qawasim_P3'], sourceElementIds: ['act-3'] },
    { kind: 'method', code: 'method-proof', module: 3, title: 'أتعلّم البرهنة: «إذا … فإنّ …»',
      learningPointIds: ['4am_khawass-qawasim_P4'], sourceElementIds: ['method-proof'] },
    // Modules 5–7 — les « مسائل » : exercices complets de type امتحان, ajouts
    // de la plateforme (content/problems.js), sans aucune preuve de maîtrise.
    { kind: 'situation', code: 'masala-1', module: 5, title: 'مسألة الدرس — ورشة البناء: جداران بطوب من 25 سم', learningPointIds: ['4am_khawass-qawasim_P1', '4am_khawass-qawasim_P3'] },
    { kind: 'situation', code: 'masala-2', module: 6, title: 'مسألة — تعاونية زيت الزيتون: صفائح من 15 لترًا', learningPointIds: ['4am_khawass-qawasim_P1', '4am_khawass-qawasim_P2'] },
    { kind: 'situation', code: 'masala-3', module: 7, title: 'مسألة — النادي الرياضي: أفواج متساوية', learningPointIds: ['4am_khawass-qawasim_P1', '4am_khawass-qawasim_P4'] },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'ست عبارات: صحيح أم خاطئ؟ «n يقسم a» والقسمة الإقليدية.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'thalath-halat', path: `${LESSON_BASE_PATH}/thalath-halat`,
      title: 'نشاط 3 — ثلاث حالات', desc: 'n يقسم a و b. هل يقسم a + b؟ و a − b؟ وباقي قسمة a على b؟',
      stage: 'trigger', teachesLearningPointIds: ['4am_khawass-qawasim_P1', '4am_khawass-qawasim_P3'],
      color: 'indigo', style: 'featured', estimatedMin: 12, difficulty: 1, actionText: 'أتحقّق' },
    { id: '02', number: 2, slug: 'khassiyatan', path: `${LESSON_BASE_PATH}/khassiyatan`,
      title: 'معارف — خاصيتان', desc: 'من التخمين إلى الخاصية: 9 يقسم 90 و 900، و 5 يقسم 90 و 25.',
      stage: 'discovery', teachesLearningPointIds: ['4am_khawass-qawasim_P1', '4am_khawass-qawasim_P2', '4am_khawass-qawasim_P3'],
      color: 'violet', style: 'featured', estimatedMin: 12, difficulty: 2, actionText: 'أصوغ الخاصية' },
    { id: '03', number: 3, slug: 'ataallam-al-burhana', path: `${LESSON_BASE_PATH}/ataallam-al-burhana`,
      title: 'أتعلّم البرهنة', desc: 'كيف أبرهن صحة خاصية من الشكل «إذا … فإنّ …»؟',
      stage: 'discovery', teachesLearningPointIds: ['4am_khawass-qawasim_P4'],
      color: 'emerald', style: 'featured', estimatedMin: 12, difficulty: 3, actionText: 'أبرهن' },
    { id: '04', number: 4, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'دوري الآن، وتمارين الكتاب 12 ← 16.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_khawass-qawasim_P1', '4am_khawass-qawasim_P2', '4am_khawass-qawasim_P4'],
      color: 'amber', style: 'featured', estimatedMin: 12, difficulty: 2, actionText: 'أتدرّب' },
    // Les « مسائل » (track: 'problem') : practice_lab, avant le test, qui
    // reste toujours ouvert. Elles comptent dans la complétion, jamais dans
    // la maîtrise — docs/architecture/LESSON_CONTRACT.md § Modules « مسائل ».
    { id: '05', number: 5, slug: 'masala-1', path: `${LESSON_BASE_PATH}/masala-1`,
      title: 'مسألة 1 — ورشة البناء', desc: 'مسألة الدرس: جداران من 875 سم و 350 سم بطوب من 25 سم. حلّ كامل خطوة بخطوة.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_khawass-qawasim_P1', '4am_khawass-qawasim_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '06', number: 6, slug: 'masala-2', path: `${LESSON_BASE_PATH}/masala-2`,
      title: 'مسألة 2 — تعاونية زيت الزيتون', desc: 'خزّانان وصفائح من 15 أو 20 لترًا: أيّها يصلح؟ وكم صفيحة في أربعة أسابيع؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_khawass-qawasim_P1', '4am_khawass-qawasim_P2'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '07', number: 7, slug: 'masala-3', path: `${LESSON_BASE_PATH}/masala-3`,
      title: 'مسألة 3 — النادي الرياضي', desc: 'أفواج متساوية في فرعين: أبرهن، ثم أختار، ثم أحسب ما يدفعه النادي.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_khawass-qawasim_P1', '4am_khawass-qawasim_P4'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '08', number: 8, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'خمس أسئلة تُقيّم الكفاءات الأربع.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 7, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
