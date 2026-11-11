/**
 * الدرس 1 من الوحدة 2 — الجذر التربيعي لعدد موجب
 * Manuel 4AM, unité 2 « الحساب على الجذور » : تحدّ et أستعدّ (p. 19), نشاط 1 (p. 20),
 * معارف 1 (p. 22), طرائق et دوري الآن 1 (p. 23), exercices 1–8 (p. 26), QCM 1–3 (p. 28),
 * أوظّف تكنولوجيات الإعلام والاتصال (p. 30),
 * puis trois « مسائل » de la plateforme (modules 4–6).
 * Source de vérité : docs/sources/4am/unit2/extraction.json.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 *
 * CONCEPTION (LESSON_DEVELOPMENT_GUIDE §4ter, rétrofit du 2026-10-15) — le manuel fixe les الكفاءات, pas le parcours.
 *   Entrée retenue : le carré de côté BC (labo `square-root-side`, mode refine) — la main étire le côté d'un carré d'aire 5 : aucune graduation ne
 *   tombe juste, on l'encadre, et c'est CE refus qui rend nécessaires un nom et un symbole ; le niveau مبتدئ (aire 36, le côté tombe sur 6) donne
 *   le contraste. Rejetées : (1) le تحدّ du réservoir (volume 36, hauteur 1,80 m) comme accroche — il suppose déjà le symbole et l'arrondi ; il devient
 *   l'APPLICATION de l'étape 7 ; (2) la carte du manuel « triangle puis BC² » au-dessus du labo — un deuxième début ; le triangle passe à l'étape 1,
 *   qui demande POURQUOI l'aire du carré sur BC vaut 5 (Pythagore) après que la main a cherché le côté.
 *   Ordre des idées : le labo (36 puis 5, encadrement) → pourquoi aire 5 → la calculatrice et إيمان, sur les encadrements de l'élève → brique `qima-mudbuta`
 *   APRÈS la réponse → √36, √81, √0,49 → brique `jidhr-taarif` APRÈS la réponse → √(a²) et (√a)² → spirale → réservoir ; module 2 : le labo 0,04 ouvre,
 *   la définition du manuel et les briques `murabba-jidhr` / `jidhr-murabba` viennent APRÈS les réponses. Aucune destination du manuel n'a bougé.
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/jidhr-tarbii';

export const LESSON_CONFIG = {
  id: 'jidhr-tarbii',
  kind: 'lesson',
  unit: 'hisab-judhur',
  unitTitle: 'الحساب على الجذور',
  sequentialUnlock: true,
  // Regard de l'élève : 'mission' (modèle du pilote qasim-adad-tabii, VALIDÉ par le propriétaire le 2026-11-08 ; rollout leçon par leçon,
  // docs/reports/MISSION_ROLLOUT_PROGRESS.md — unité 2, leçon 1, 2026-11-09) — implique le regard « focus » ; l'enseignant et le mode classe ne voient
  // aucun changement.
  studentView: 'mission',
  // LA MISSION : l'ouverture avoue qu'on ne sait pas encore la résoudre ; les outils sont les connaissances de knowledge.jsx ; les points d'étape
  // RAPPROCHENT de la mission sans en résoudre aucune question (la مسألة du module 4 reste entière : ils parlent de 7, 11 et 20 — jamais des côtés
  // 3 m et 5 m, de l'aire 34, de √34 ni de la lecture 5,83…) ; formatifs, jamais une preuve de maîtrise.
  mission: {
    scene: 'garden-bed',
    title: 'حوض الأزهار على الوتر',
    opening: {
      text: 'في حديقة البلدية ركن على شكل مثلث قائم ضلعا زاويته القائمة 3 م و 5 م. يريد البستاني حوض أزهار مربّعًا مبنيًّا على الوتر، يغطّيه بعشب ثمن المتر المربّع منه 350 دج، ويحيطه بإطار من الحجارة يُباع بالمتر الكامل. حسب طول الوتر بالحاسبة فعرضت 5,830951895. كم يدفع ثمنًا للعشب بالضبط؟ وكم مترًا من الإطار يشتري؟',
      cta: 'لا أعرف بعد… هيا نجمع الأدوات',
    },
    tools: [
      { id: 'qima-mudbuta', icon: '🎯', label: 'القيمة المضبوطة' },
      { id: 'jidhr-taarif', icon: '√', label: 'الجذر التربيعي' },
      { id: 'murabba-jidhr', icon: '🔲', label: 'مربّع الجذر' },
      { id: 'jidhr-murabba', icon: '🔁', label: 'جذر المربّع' },
    ],
    climaxModule: 4,
    checkpoints: [
      {
        id: 'cp-mudbuta', afterModule: 1,
        prompt: 'مربّع مساحته $7\\,cm^2$. ما القيمة المضبوطة لطول ضلعه؟',
        options: ['$\\sqrt{7}\\,cm$', '$3{,}5\\,cm$', '$2{,}6457\\,cm$'],
        correct: 0,
        explain: 'الضلع هو العدد الموجب الذي مربّعه 7: $\\sqrt{7}$. أمّا 2,6457 فقيمة مقرّبة فقط، و 3,5 نصف 7.',
      },
      {
        id: 'cp-murabba', afterModule: 2,
        prompt: '$(\\sqrt{11})^2 = \\ldots$',
        options: ['11', '121', '$\\sqrt{11}$'],
        correct: 0,
        explain: '$\\sqrt{11}$ هو العدد الموجب الذي مربّعه 11: إذن $(\\sqrt{11})^2 = 11$.',
      },
      {
        id: 'cp-khitta', afterModule: 3,
        prompt: '$\\sqrt{9^2} = \\ldots$',
        options: ['9', '81', '3'],
        correct: 0,
        explain: '9 عدد موجب ومربّعه $9^2$: إذن $\\sqrt{9^2} = 9$، دون حساب $9^2 = 81$.',
      },
    ],
  },
  title: 'الجذر التربيعي لعدد موجب',
  description: 'تعريف الجذر التربيعي لعدد موجب a بأنه العدد الموجب الذي مربعه a، واستعمال الرمز √a، وتطبيق الخاصيتين (√a)² = a و √(a²) = a.',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '√',
  estimatedDurationMin: 50,
  textbookRef: { unit: 2, activity: 1, pages: '19, 20, 22, 23, 26, 28, 30' },
  skills: [
    'التعرّف على الجذر التربيعي لعدد موجب a: العدد الموجب الذي مربعه a',
    'قراءة الرمز √a وكتابته، والتمييز بين القيمة المضبوطة وما تعرضه الحاسبة',
    'تطبيق الخاصيتين (√a)² = a و √(a²) = a حيث a عدد موجب',
  ],
  teachingScope: {
    include: ['تعريف الجذر التربيعي لعدد موجب والرمز √a وقراءته', 'القيمة المضبوطة √5 وقراءة الحاسبة', 'الخاصيتان (√a)² = a و √(a²) = a، واستعمال التعريف لإنجاز حساب'],
    exclude: ['الأعداد الناطقة وغير الناطقة والقيم المقربة بالنقصان وبالزيادة (الدرس 2)', 'حل المعادلة x² = a (الدرس 3)', 'جداء وحاصل قسمة جذرين (الدرس 4)', 'تبسيط الجذور وجعل المقام ناطقا (الدرس 5)'],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // La carte TOUTE OUVERTE (règle des pilotes, propriétaire 2026-11-08) : toutes les connaissances dès le début, sans verrou par محور.
  knowledgeMapOpen: true,
  // Les acquis que « أستعدّ » (p. 19, items 1, 2, 4, 10 + deux ajouts) diagnostique.
  priorKnowledge: ['murabba-adad', 'khassiyat-fithaghuras', 'alat-hasiba-jidhr'],
  // « مسألة الدرس » (content/problems.js › masala-1) : montrée sur la page de l'unité (LessonProblemCard, plus dans le module 1),
  // résolue au module 4 — le carré construit sur l'hypoténuse du niveau متقدم,
  // avec d'autres nombres (côtés 3 m et 5 m, aire 34).
  lessonProblem: {
    module: 4,
    title: 'حديقة البلدية: حوض أزهار مربّع على الوتر',
    statement: 'في حديقة البلدية ركن على شكل مثلث $ABC$ قائم في $A$، حيث $AB = 3\\,m$ و $AC = 5\\,m$. يمرّ بجانب هذا الركن ممرّ عرضه $2\\,m$. يريد البستاني، حرصًا على جمال الحديقة ونظافتها، أن ينشئ على الضلع $[BC]$، خارج المثلث، حوض أزهار مربّع الشكل $BCDE$. حسب البستاني طول الضلع $BC$ بالحاسبة فعرضت الشاشة 5,830951895. سيُغطّى الحوض بعشب طبيعي ثمن المتر المربّع منه 350 دج، ويُحاط بإطار من الحجارة يُباع بالمتر الكامل، ثمن المتر منه 450 دج.',
    illustration: { kind: 'plan', shape: 'tri', fill: 'garden', sides: ['؟', 3, 5], unit: 'm', ariaLabel: 'ركن حديقة على شكل مثلث ABC قائم في A فيه AB = 3 m و AC = 5 m والضلع BC مجهول' },
  },
  resources: [
    // Module 1 — WORKSPACE À DEUX NIVEAUX, un seul instrument : le carré qu'on étire.
    //   مبتدئ  — 36 (question 3 de l'activité) : le côté TOMBE sur une graduation.
    //   متقدم  — 5 (BC, questions 1–2) : le côté ne tombe sur aucune ; l'élève
    //            l'encadre lui-même, loupe après loupe, jusqu'au millième.
    {
      kind: 'manipulation', code: 'square-root-side-36', type: 'square-root-side', module: 1,
      level: 'beginner',
      title: 'مربّع مساحته 36: كم طول ضلعه؟',
      objective: 'الجذر التربيعي لعدد موجب a هو طول ضلع المربّع الذي مساحته a: العدد الموجب الذي مربّعه a',
      autonomy: '',
      experience: { type: 'textbook', reason: '', theme: '' },
      learningPointIds: ['4am_jidhr-tarbii_P1'],
      sourceElementIds: ['act-1'],
    },
    {
      kind: 'manipulation', code: 'square-root-side-5', type: 'square-root-side', module: 1,
      level: 'advanced',
      title: 'نشاط 1 — مربّع مساحته 5 مبني على BC',
      objective: 'الجذر التربيعي لعدد موجب a هو طول ضلع المربّع الذي مساحته a: العدد الموجب الذي مربّعه a',
      autonomy: 'لا يقع الضلع على أي تدريجة: التلميذ يحصره بنفسه بين تدريجتين متجاورتين قبل كل تدقيق (1 ثم 0,1 ثم 0,01 ثم 0,001)، ثم يقارن قراءة الحاسبة 2,236067978 بمربّعها',
      experience: { type: 'textbook', reason: '', theme: '' },
      learningPointIds: ['4am_jidhr-tarbii_P1', '4am_jidhr-tarbii_P2'],
      sourceElementIds: ['act-1'],
    },
    // Module 2 (معارف) — l'exemple du manuel √0,04 = 0,2 dans le MÊME instrument ;
    // un seul niveau (`levels={false}`) : c'est un exemple travaillé.
    {
      kind: 'manipulation', code: 'square-root-side-0-04', type: 'square-root-side', module: 2,
      title: 'مثال: مربّع مساحته 0,04',
      learningPointIds: ['4am_jidhr-tarbii_P1'],
      sourceElementIds: ['know-1'],
    },
    // Les trois « مسائل » (modules 4–6) — MASAIL_GENERATION_GUIDE.md.
    { kind: 'situation', code: 'masala-1', module: 4, title: 'مسألة الدرس — حوض أزهار مربّع على الوتر', learningPointIds: ['4am_jidhr-tarbii_P1', '4am_jidhr-tarbii_P2', '4am_jidhr-tarbii_P3'] },
    { kind: 'situation', code: 'masala-2', module: 5, title: 'مسألة — معرض الصور: لوحات مربّعة', learningPointIds: ['4am_jidhr-tarbii_P1', '4am_jidhr-tarbii_P2'] },
    { kind: 'situation', code: 'masala-3', module: 6, title: 'مسألة — سلّم الحماية المدنية', learningPointIds: ['4am_jidhr-tarbii_P1', '4am_jidhr-tarbii_P2', '4am_jidhr-tarbii_P3'] },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'ست عبارات: صحيح أم خاطئ؟ مربع عدد، خاصية فيثاغورس، اللمسة √ في الحاسبة.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'nashat', path: `${LESSON_BASE_PATH}/nashat`,
      title: 'نشاط 1 — الوتر BC ومربّعه 5', desc: 'اسحب ضلع مربّع مساحته 5: هل يقع على تدريجة؟ ثم الحاسبة وقول إيمان.',
      stage: 'trigger', teachesLearningPointIds: ['4am_jidhr-tarbii_P1', '4am_jidhr-tarbii_P2'],
      color: 'indigo', style: 'featured', estimatedMin: 14, difficulty: 1, actionText: 'أجرّب' },
    { id: '02', number: 2, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`,
      title: 'معارف — الجذر التربيعي لعدد موجب', desc: 'التعريف والرمز، ثم خاصيتان: مربع الجذر وجذر المربع.',
      stage: 'discovery', teachesLearningPointIds: ['4am_jidhr-tarbii_P1', '4am_jidhr-tarbii_P2', '4am_jidhr-tarbii_P3'],
      color: 'violet', style: 'featured', estimatedMin: 10, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'طريقة محلولة ودوري الآن، ثم ثمانية تمارين.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_jidhr-tarbii_P1', '4am_jidhr-tarbii_P2', '4am_jidhr-tarbii_P3'],
      color: 'amber', style: 'featured', estimatedMin: 14, difficulty: 2, actionText: 'أتدرّب' },
    // Les « مسائل » (track: 'problem') : practice_lab, avant le test, qui
    // reste toujours ouvert. Elles comptent dans la complétion, jamais dans
    // la maîtrise — docs/architecture/LESSON_CONTRACT.md § Modules « مسائل ».
    { id: '04', number: 4, slug: 'masala-1', path: `${LESSON_BASE_PATH}/masala-1`,
      title: 'مسألة 1 — حوض الأزهار', desc: 'مسألة الدرس: مربّع مبني على وتر مثلث قائم ضلعاه 3 m و 5 m. حلّ كامل خطوة بخطوة.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_jidhr-tarbii_P1', '4am_jidhr-tarbii_P2', '4am_jidhr-tarbii_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '05', number: 5, slug: 'masala-2', path: `${LESSON_BASE_PATH}/masala-2`,
      title: 'مسألة 2 — معرض الصور', desc: 'لوحات صور مربّعة: طول الضلع من المساحة، خطأ المساعد، وثمن إطار الألمنيوم.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_jidhr-tarbii_P1', '4am_jidhr-tarbii_P2'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '06', number: 6, slug: 'masala-3', path: `${LESSON_BASE_PATH}/masala-3`,
      title: 'مسألة 3 — سلّم الحماية المدنية', desc: 'إلى أيّ ارتفاع يصل السلّم؟ وأين نضع قاعدته لنبلغ الشرفة؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_jidhr-tarbii_P1', '4am_jidhr-tarbii_P2', '4am_jidhr-tarbii_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '07', number: 7, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'خمسة أسئلة تُقيّم الكفاءات الثلاث.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 6, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
