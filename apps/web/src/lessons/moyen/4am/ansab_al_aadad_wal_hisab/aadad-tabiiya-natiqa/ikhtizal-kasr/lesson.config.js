/**
 * الدرس 8 — اختزال كسر
 * Manuel 4AM, unité 1 : أستعدّ 7–10 (p. 7), activité 8 (p. 9), معارف 6 (p. 12), طريقة الاختزال 595/560 (p. 13), دوري الآن p. 13 (2),
 * exercices 28–38, 40 (p. 15),
 * puis trois « مسائل » de la plateforme (modules 5–7).
 *
 * CONCEPTION (LESSON_DEVELOPMENT_GUIDE §4ter, rétrofit du 2026-10-15) — le manuel fixe les الكفاءات, pas le parcours.
 *   Entrée retenue : la RECETTE qu'on partage (labo fraction-reduction, thème cuisine, niveau مبتدئ 12/18) — la main choisit
 *   le nombre de parts égales et lit UNE part ; diviser par un diviseur commun ne change pas la recette, et la main décide
 *   d'elle-même quand elle ne peut plus continuer. Rejetée : le نشاط 8 comme entrée (la chaîne de سمير ÷4 puis ÷3 est
 *   énoncée dans une carte au-dessus du labo avant tout geste, et la question « que fait سمير ? » se répond de mémoire) ;
 *   il reste le niveau متقدم (84/48) et le chemin de سمير est montré APRÈS la réponse. Ordre des idées : POURQUOI la recette ne
 *   change pas (brique `ikhtizal` après) → POURQUOI 7/4 ne se réduit plus (brique `kasr-ghayr-qabil` après) → معارف :
 *   POURQUOI une seule division (12 = 4 × 3 = PGCD) → la définition APRÈS la question sur 15/22 → la méthode PGCD (brique
 *   après 28/42) → la méthode du livre 595/560.
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/ikhtizal-kasr';

export const LESSON_CONFIG = {
  id: 'ikhtizal-kasr',
  kind: 'lesson',
  unit: 'aadad-tabiiya-natiqa',
  unitTitle: 'الأعداد الطبيعيّة والأعداد النّاطقة',
  sequentialUnlock: true,
  // Regard de l'élève : 'mission' (modèle du pilote qasim-adad-tabii, VALIDÉ par le propriétaire le 2026-11-08 ; rollout leçon par
  // leçon, docs/reports/MISSION_ROLLOUT_PROGRESS.md) — implique le regard « focus » ; l'enseignant et le mode classe ne voient aucun changement.
  studentView: 'mission',
  // LA MISSION : l'ouverture avoue qu'on ne sait pas encore la résoudre ; les outils sont les connaissances de knowledge.jsx ; les points
  // d'étape RAPPROCHENT de la mission sans en résoudre aucune question (la مسألة 1 du module 5 reste entière : ils parlent de 18/30, 20/32, 9/14 —
  // jamais de 105, de 147 ni de leur PGCD) ; formatifs, jamais une preuve de maîtrise.
  mission: {
    scene: 'bakery',
    title: 'عجينة الخبّاز',
    opening: {
      text: 'في وصفة الخبّاز 105 ملاعق سكّر و 147 كوبًا من الدقيق. يريد أن يكتب نسبة السكّر إلى الدقيق بأبسط كسر، ليقسم العجينة حصصًا متماثلة. كيف يصل إلى أبسط كسر دون أن يتيه في القسمات؟',
      cta: 'لا أعرف بعد… هيا نجمع الأدوات',
    },
    tools: [
      { id: 'ikhtizal', icon: '➗', label: 'اختزال كسر' },
      { id: 'kasr-ghayr-qabil', icon: '🔒', label: 'غير قابل للاختزال' },
      { id: 'ikhtizal-bil-pgcd', icon: '⚡', label: 'قسمة واحدة' },
      { id: 'tahaqquq-al-ikhtizal', icon: '✅', label: 'هل انتهيت؟' },
    ],
    climaxModule: 5,
    checkpoints: [
      {
        id: 'cp-ikhtizal', afterModule: 1,
        prompt: 'قسمنا بسط الكسر $\\dfrac{18}{30}$ ومقامه على 2 ثم على 3. ما الكسر الذي وصلنا إليه؟',
        options: ['$\\dfrac{3}{5}$', '$\\dfrac{9}{15}$', '$\\dfrac{6}{10}$'],
        correct: 0,
        explain: '$\\dfrac{18}{30} = \\dfrac{9}{15} = \\dfrac{3}{5}$، و 3 و 5 لا قاسم مشترك لهما غير 1.',
      },
      {
        id: 'cp-pgcd', afterModule: 2,
        prompt: '$\\mathrm{PGCD}(20\\ ;\\ 32) = 4$. ما الشكل غير القابل للاختزال للكسر $\\dfrac{20}{32}$ ؟',
        options: ['$\\dfrac{5}{8}$', '$\\dfrac{10}{16}$', '$\\dfrac{4}{8}$'],
        correct: 0,
        explain: 'قسمة واحدة على PGCD: $\\dfrac{20 \\div 4}{32 \\div 4} = \\dfrac{5}{8}$.',
      },
      {
        id: 'cp-tahaqquq', afterModule: 3,
        prompt: 'هل الكسر $\\dfrac{9}{14}$ قابل للاختزال؟',
        options: ['لا: $\\mathrm{PGCD}(9\\ ;\\ 14) = 1$', 'نعم: نقسم على 2', 'نعم: 9 و 14 ليسا أوّليين'],
        correct: 0,
        explain: 'قواسم 9: 1 ، 3 ، 9 — ولا أحد منها غير 1 يقسم 14. الكسر غير قابل للاختزال.',
      },
      {
        id: 'cp-khitta', afterModule: 4,
        prompt: 'يريد الخبّاز أن يكتب نسبة السكّر إلى الدقيق بأبسط كسر. ماذا يحسب أوّلًا؟',
        options: ['PGCD عدد الملاعق وعدد الأكواب', 'مجموع العددين', 'الفرق بين العددين'],
        correct: 0,
        explain: 'القسمة على PGCD تعطي الشكل غير القابل للاختزال مرّة واحدة. هذه خطّتك في المسألة التالية.',
      },
    ],
  },
  title: 'اختزال كسر',
  description: 'اختزال كسر بالقسمة المتتابعة على قواسم مشتركة، التعرّف على الكسر غير القابل للاختزال، وكتابة كسر على الشكل غير القابل للاختزال بالقسمة على القاسم المشترك الأكبر.',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '➗',
  estimatedDurationMin: 65,
  textbookRef: { unit: 1, activity: 8, pages: '7, 9, 12, 13, 15' },
  skills: [
    'اختزال كسر بالقسمة المتتابعة على قواسم مشتركة',
    'التعرّف على الكسر غير القابل للاختزال (بسطه ومقامه أوليان فيما بينهما)',
    'كتابة كسر على الشكل غير القابل للاختزال بالقسمة على القاسم المشترك الأكبر',
    'إعطاء نتيجة حساب على الأعداد الناطقة على شكل كسر غير قابل للاختزال',
  ],
  teachingScope: { include: ['اختزال خطوة بخطوة، والاختزال بـ PGCD في خطوة واحدة', 'الكسر غير القابل للاختزال ≡ بسط ومقام أوليان فيما بينهما'], exclude: ['التحليل إلى عوامل أولية', 'العمليات على الكسور كموضوع مستقل (مكتسب سابق)'] },
  // « مسألة الدرس » (rollout مسائل, 2026-10-06) : montrée dès le sommaire,
  // rappelée au module 1, résolue pas à pas au module 5 (content/problems.js).
  // Prolonge la recette du niveau متقدم : partager la recette en حصص متماثلة,
  // d'autres nombres.
  lessonProblem: {
    module: 5,
    title: 'عجينة الخبّاز: 105 ملاعق سكّر و 147 كوبًا من الدقيق',
    statement: 'يحرص خبّاز الحيّ على إتقان عمله وعلى الأمانة في مقاديره، فيحضّر ومساعده عجينة كعك: يخلطان 105 ملاعق سكّر مع 147 كوبًا من الدقيق. في المخبزة 4 أفران، وتفتح على الساعة 6 صباحًا لأنّه يحترم وقت زبائنه ولا يتأخّر عليهم. يريد الخبّاز أن يقسم العجينة إلى حصص متماثلة أصغر ما يمكن (في كل حصة العدد نفسه من ملاعق السكّر والعدد نفسه من أكواب الدقيق)، ثم يصنع من كل حصة صغيرة صينية كعك يبيعها بـ 2500 دج.',
    illustration: { kind: 'stacks', rows: [{ icon: 'sweet', count: 105, label: 'ملعقة سكّر' }, { icon: 'jar', count: 147, label: 'كوب دقيق' }], ariaLabel: 'مقادير العجينة: 105 ملاعق سكّر و 147 كوبًا من الدقيق' },
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // La carte TOUTE OUVERTE (règle des pilotes, propriétaire 2026-11-08) : toutes les connaissances dès le début, sans verrou par محور.
  knowledgeMapOpen: true,
  // Acquis des années antérieures (أستعدّ 7–10) et des دروس 6–7 (deux ajouts
  // de la plateforme dans « أستعدّ », déclarés « عبارة إضافية من المنصّة »).
  priorKnowledge: ['al-aadad-al-natiqa', 'awwaliyan-taarif', 'khwarizmiyat-iqlidus'],
  resources: [
    // Module 1 — workspace à deux niveaux. Réduire, c'est diviser les deux
    // termes par un diviseur COMMUN jusqu'à ce qu'il n'en reste plus. Le
    // kasr est DESSINÉ en recette (thème `kitchen`) : diviser par k, c'est
    // répartir sucre et farine en k parts identiques et lire UNE part. Les
    // nombres du manuel sont gardés ; la situation est une adaptation
    // déclarée de la plateforme.
    //   مبتدئ  — 12/18 : peu de chemins, l'idée nue.
    //   متقدم  — 84/48, le kasr de سمير : plusieurs chemins, et la question
    //            « أي الطريقين أوفر؟ » qui donne son sens au PGCD.
    { kind: 'manipulation', code: 'fraction-reduction-12-18', type: 'fraction-reduction', module: 1,
      level: 'beginner',
      title: 'وصفة صغيرة: 12 ملعقة سكّر لـ 18 كوب دقيق (12/18)',
      objective: 'اختزال كسر = القسمة على قاسم مشترك؛ نتوقف عندما لا يبقى قاسم مشترك أكبر من 1',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'platform_designed_entry', theme: 'kitchen' },
      learningPointIds: ['4am_ikhtizal-kasr_P1'], sourceElementIds: ['act-8'] },
    { kind: 'manipulation', code: 'fraction-reduction-84-48', type: 'fraction-reduction', module: 1,
      level: 'advanced',
      title: 'اختزال الكسر 84/48 كما فعل سمير',
      objective: 'اختزال كسر = القسمة على قاسم مشترك؛ نتوقف عندما لا يبقى قاسم مشترك أكبر من 1',
      autonomy: 'عدّة قواسم مشتركة ممكنة في كل خطوة: التلميذ يختار طريقه ويقارن عدد الخطوات',
      experience: { type: 'platform_adaptation', reason: 'multiple_representations', theme: 'kitchen' },
      learningPointIds: ['4am_ikhtizal-kasr_P1', '4am_ikhtizal-kasr_P2', '4am_ikhtizal-kasr_P3'], sourceElementIds: ['act-8'] },
    { kind: 'method', code: 'method-reduce-595-560', module: 2, title: 'طريقة: استعمال PGCD لكتابة كسر على الشكل غير القابل للاختزال', learningPointIds: ['4am_ikhtizal-kasr_P3'], sourceElementIds: ['method-reduce'] },
    // Modules 5–7 — les « مسائل » : exercices complets de type امتحان, ajouts
    // de la plateforme (content/problems.js), sans aucune preuve de maîtrise.
    { kind: 'situation', code: 'masala-1', module: 5, title: 'مسألة الدرس — عجينة الخبّاز: 105 ملاعق سكّر و 147 كوبًا من الدقيق', learningPointIds: ['4am_ikhtizal-kasr_P1', '4am_ikhtizal-kasr_P2', '4am_ikhtizal-kasr_P3'] },
    { kind: 'situation', code: 'masala-2', module: 6, title: 'مسألة — ميزانية العائلة: أجرة 54000 دج', learningPointIds: ['4am_ikhtizal-kasr_P3', '4am_ikhtizal-kasr_P4'] },
    { kind: 'situation', code: 'masala-3', module: 7, title: 'مسألة — المشتلة: أيّ بذور الطماطم أفضل؟', learningPointIds: ['4am_ikhtizal-kasr_P2', '4am_ikhtizal-kasr_P3'] },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`, title: 'أستعدّ', desc: 'ست عبارات: أربع عن الأعداد الناطقة واثنتان عن PGCD. صحيح أم خاطئ؟',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'samir', path: `${LESSON_BASE_PATH}/samir`, title: 'نشاط 8 — كيف اختزل سمير 84/48؟', desc: '÷4 ثم ÷3 … لماذا لا يمكن مواصلة اختزال 7/4؟',
      stage: 'trigger', teachesLearningPointIds: ['4am_ikhtizal-kasr_P1', '4am_ikhtizal-kasr_P2'], color: 'indigo', style: 'featured', estimatedMin: 12, difficulty: 1, actionText: 'أختزل' },
    { id: '02', number: 2, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`, title: 'معارف — الكسور غير القابلة للاختزال، وطريقة PGCD', desc: 'التعريف، ملاحظة مهمّة، 15/22 و 28/42، ثم 595/560 بإقليدس.',
      stage: 'discovery', teachesLearningPointIds: ['4am_ikhtizal-kasr_P2', '4am_ikhtizal-kasr_P3'], color: 'violet', style: 'featured', estimatedMin: 14, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'awazzif-1', path: `${LESSON_BASE_PATH}/awazzif-1`, title: 'أوظّف تعلّماتي (1)', desc: '188/252، دوري الآن 915/372، وتمارين 28، 34، 35، 36.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_ikhtizal-kasr_P3'], color: 'amber', style: 'featured', estimatedMin: 13, difficulty: 2, actionText: 'أتدرّب' },
    { id: '04', number: 4, slug: 'awazzif-2', path: `${LESSON_BASE_PATH}/awazzif-2`, title: 'أوظّف تعلّماتي (2)', desc: 'كسور بحرف n، وحساب على الأعداد الناطقة: تمارين 29 ← 33، 37، 38، 40.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_ikhtizal-kasr_P2', '4am_ikhtizal-kasr_P4'], color: 'rose', style: 'featured', estimatedMin: 14, difficulty: 3, actionText: 'أتدرّب أكثر' },
    // Les « مسائل » (track: 'problem') : practice_lab, avant le test, qui
    // reste toujours ouvert. Elles comptent dans la complétion, jamais dans
    // la maîtrise — docs/architecture/LESSON_CONTRACT.md § Modules « مسائل ».
    { id: '05', number: 5, slug: 'masala-1', path: `${LESSON_BASE_PATH}/masala-1`,
      title: 'مسألة 1 — عجينة الخبّاز', desc: 'مسألة الدرس: 105 ملاعق سكّر و 147 كوبًا من الدقيق. حلّ كامل خطوة بخطوة.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_ikhtizal-kasr_P1', '4am_ikhtizal-kasr_P2', '4am_ikhtizal-kasr_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '06', number: 6, slug: 'masala-2', path: `${LESSON_BASE_PATH}/masala-2`,
      title: 'مسألة 2 — ميزانية العائلة', desc: 'أجرة 54000 دج: أيّ كسر منها للكراء وللفواتير؟ وكم يبقى للأدوات المدرسية؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_ikhtizal-kasr_P3', '4am_ikhtizal-kasr_P4'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '07', number: 7, slug: 'masala-3', path: `${LESSON_BASE_PATH}/masala-3`,
      title: 'مسألة 3 — المشتلة', desc: 'نوعان من البذور: نسبتا الإنبات على الشكل غير القابل للاختزال، ثم الشتلات والمدخول.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_ikhtizal-kasr_P2', '4am_ikhtizal-kasr_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '08', number: 8, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`, title: 'إختبار أولي', desc: 'خمس أسئلة تُقيّم الكفاءات الأربع.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 6, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
