/**
 * الدرس 7 — العددان الأوّليّان فيما بينهما
 * Manuel 4AM, unité 1 : activité 7 (p. 9), معارف 5 (p. 12), exercices 23–27, 39 (p. 15),
 * puis trois « مسائل » de la plateforme (modules 4–6).
 *
 * CONCEPTION (LESSON_DEVELOPMENT_GUIDE §4ter, rétrofit du 2026-10-15) — le manuel fixe les الكفاءات, pas le parcours.
 *   Entrée retenue : 17 stylos et 18 cahiers à ranger en trousses identiques (thème `school`) — la main ajoute une trousse à la
 *   fois et RIEN ne marche sauf 1 ; l'idée « le seul diviseur commun est 1 » devient nécessaire pour expliquer ce qu'elle a vu.
 *   Rejetée : l'énoncé du نشاط 7 posé en carte au-dessus du labo (« اشرح لماذا PGCD = 1 » avant tout geste) ; et l'entrée par
 *   les listes (22 et 35) : trop abstraite pour un premier contact, elle reste le niveau متقدم. Ordre des idées : trousses
 *   (seul 1 marche) → POURQUOI (question sur ce qu'on a fait) → la définition (brique + remarque du manuel APRÈS la réponse) →
 *   مريم (27 et 36) : qu'est-ce qui suffit à la contredire ? → la brique de réfutation → معارف : le labo 15 / 22 en tête, « 15
 *   est-il premier ? », puis la définition et l'exemple du manuel, puis comment PROUVER (PGCD, Euclide).
 *   Aucune destination du manuel n'a bougé (act-7 reste au module 1, know-5 au module 2).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/awwaliyan-fima-baynahuma';

export const LESSON_CONFIG = {
  id: 'awwaliyan-fima-baynahuma',
  kind: 'lesson',
  unit: 'aadad-tabiiya-natiqa',
  unitTitle: 'الأعداد الطبيعيّة والأعداد النّاطقة',
  sequentialUnlock: true,
  // Regard de l'élève : 'mission' (modèle du pilote qasim-adad-tabii, VALIDÉ par le propriétaire le 2026-11-08 ; rollout leçon par
  // leçon, docs/reports/MISSION_ROLLOUT_PROGRESS.md) — implique le regard « focus » ; l'enseignant et le mode classe ne voient aucun changement.
  studentView: 'mission',
  // LA MISSION : l'ouverture avoue qu'on ne sait pas encore la résoudre ; les outils sont les connaissances de knowledge.jsx ; les points
  // d'étape RAPPROCHENT de la mission sans en résoudre aucune question (la مسألة 1 du module 4 reste entière : ils parlent de 14/15, 34/51 et
  // de la méthode — jamais de 26, 45, 39, 65 ni de leur PGCD 13) ; formatifs, jamais une preuve de maîtrise. Des TUILES numérotées, jamais
  // des cartes à jouer (respect des valeurs, CLAUDE.md).
  mission: {
    scene: 'math-club',
    title: 'لعبة الزوج الرابح',
    opening: {
      text: 'في نادي الرياضيات، يسحب كل لاعب بطاقتين مرقّمتين، ويكسب نقاطًا إذا كان العددان أوليين فيما بينهما. سحب ياسين 26 و 45، وتقول سلمى إنّ عدديها 39 و 65 أوليان فيما بينهما لأنّهما فرديّان. من الرابح؟ وهل سلمى على صواب؟',
      cta: 'لا أعرف بعد… هيا نجمع الأدوات',
    },
    tools: [
      { id: 'awwaliyan-taarif', icon: '🤝', label: 'أوليان فيما بينهما' },
      { id: 'nafy-awwaliyan', icon: '✋', label: 'قاسم مشترك يكفي للنفي' },
      { id: 'laysa-awwali', icon: '⚠️', label: 'ليسا عددين أوليين بالضرورة' },
      { id: 'ithbat-awwaliyan', icon: '✅', label: 'الإثبات بـ PGCD' },
    ],
    climaxModule: 4,
    checkpoints: [
      {
        id: 'cp-taarif', afterModule: 1,
        prompt: 'هل العددان 14 و 15 أوليان فيما بينهما؟',
        options: ['نعم: $\\mathrm{PGCD}(14\\ ;\\ 15) = 1$', 'لا: لأنّ 14 و 15 ليسا عددين أوليين', 'لا: لأنّ أحدهما زوجي'],
        correct: 0,
        explain: 'قواسم 14: 1 ، 2 ، 7 ، 14 — ولا يقسم 15 منها إلا 1.',
      },
      {
        id: 'cp-nafy', afterModule: 2,
        prompt: 'لتبيّن أنّ 34 و 51 ليسا أوليين فيما بينهما، يكفي أن:',
        options: ['تجد قاسمًا مشتركًا لهما غير 1، مثل 17', 'تكتب كل قواسم العددين', 'تلاحظ أنّ أحدهما زوجي'],
        correct: 0,
        explain: '$34 = 17 \\times 2$ و $51 = 17 \\times 3$: القاسم المشترك 17 ≠ 1 يكفي.',
      },
      {
        id: 'cp-khitta', afterModule: 3,
        prompt: 'في لعبة الزوج الرابح، كيف تعرف أنّ بطاقتيك رابحتان؟',
        options: ['أحسب PGCD العددين: إن كان 1 فهما رابحتان', 'أنظر هل العددان فرديان', 'أنظر هل كل عدد منهما أوّلي'],
        correct: 0,
        explain: 'أوليان فيما بينهما يعني PGCD = 1. هذه خطّتك في المسألة التالية.',
      },
    ],
  },
  title: 'العددان الأوّليّان فيما بينهما',
  description: 'العددان الأوليان فيما بينهما: قاسمهما المشترك الأكبر يساوي 1؛ إثبات ذلك بحساب PGCD، ونفيه بإظهار قاسم مشترك يختلف عن 1.',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 3,
  masteryThreshold: 0.8,
  emoji: '1️⃣',
  estimatedDurationMin: 40,
  textbookRef: { unit: 1, activity: 7, pages: '9, 12, 15' },
  skills: [
    'التعرّف على عددين أوليين فيما بينهما (PGCD (a ; b) = 1)',
    'إثبات أن عددين أوليان فيما بينهما بحساب قاسمهما المشترك الأكبر',
    'إثبات أن عددين ليسا أوليين فيما بينهما بإظهار قاسم مشترك يختلف عن 1',
  ],
  teachingScope: { include: ['تعريف الكتاب ومثاله (22 و 15)', 'الإثبات والنفي'], exclude: ['الأعداد الأولية (موضوع رسمي آخر)', 'الكسور غير القابلة للاختزال (الدرس 8)'] },
  // « مسألة الدرس » (rollout مسائل, 2026-10-06) : montrée dès le sommaire,
  // rappelée au module 1, résolue pas à pas au module 4 (content/problems.js).
  // Prolonge le laboratoire du niveau متقدم (22 et 35 sur les listes) : on
  // confronte les diviseurs du plus petit à l'autre, avec d'autres nombres.
  lessonProblem: {
    module: 4,
    title: 'نادي الرياضيات: لعبة «الزوج الرابح»',
    statement: 'في نادي الرياضيات بالمتوسطة لعبة اسمها «الزوج الرابح»: في علبة 99 بطاقة مرقّمة من 1 إلى 99، ويسحب كل لاعب بطاقتين. يبدأ كل لاعب برصيد 100 نقطة؛ إذا كان العددان المسحوبان أوليين فيما بينهما ربح 50 نقطة، وإلا خسر 20 نقطة. تدوم الجولة 15 دقيقة، ويحرص اللاعبون على احترام وقتها وعلى الصدق في حساب نقاطهم. سحب ياسين البطاقتين 26 و 45، وسحبت سلمى البطاقتين 39 و 65 وقالت: «عدداي فرديان، إذن هما أوليان فيما بينهما».',
    illustration: { kind: 'tags', cards: [{ title: 'ياسين', icon: 'ticket', lines: [{ label: 'البطاقة الأولى', value: 26 }, { label: 'البطاقة الثانية', value: 45 }] }, { title: 'سلمى', icon: 'ticket', lines: [{ label: 'البطاقة الأولى', value: 39 }, { label: 'البطاقة الثانية', value: 65 }] }], ariaLabel: 'بطاقتان لياسين عليهما العددان 26 و 45 وبطاقتان لسلمى عليهما العددان 39 و 65' },
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // La carte TOUTE OUVERTE (règle des pilotes, propriétaire 2026-11-08) : toutes les connaissances dès le début, sans verrou par محور.
  knowledgeMapOpen: true,
  priorKnowledge: ['pgcd-taarif', 'khwarizmiyat-iqlidus', 'qawaid-qisma'],
  resources: [
    // Module 1 — workspace à deux niveaux, sur les couples du manuel :
    //   مبتدئ  — 17 et 18 (question أ), VÉCUS d'abord : 17 stylos et 18
    //            cahiers à ranger en trousses identiques (thème `school`, un
    //            contexte de la plateforme) — rien ne marche sauf 1 ; puis
    //            les listes le confirment ;
    //   متقدم  — 22 et 35 (question ب), sur les listes, sans aucun guidage.
    // Le couple de مريم (27 et 36), le seul dont la réponse est « non »,
    // reste à l'étape 2 : le manuel l'y pose, et une manipulation ne se
    // rend jamais deux fois sur la même page.
    { kind: 'manipulation', code: 'coprime-17-18', type: 'coprime-explorer', module: 1,
      level: 'beginner',
      title: '17 قلمًا و 18 كراسًا: كم حقيبة متماثلة؟',
      objective: 'عددان أوليان فيما بينهما ⇔ قاسمهما المشترك الوحيد هو 1',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'platform_designed_entry', theme: 'school' },
      learningPointIds: ['4am_awwaliyan-fima-baynahuma_P1'], sourceElementIds: ['act-7'] },
    { kind: 'manipulation', code: 'coprime-22-35', type: 'coprime-explorer', module: 1,
      level: 'advanced',
      title: '22 و 35: أثبت بنفسك دون توجيه',
      objective: 'عددان أوليان فيما بينهما ⇔ قاسمهما المشترك الوحيد هو 1',
      autonomy: 'لا مجموعات ولا توجيه: التلميذ يواجه قواسم العدد الأصغر بالعدد الآخر واحدًا واحدًا، ولا يُقبل حكمه إلا بعد أن يكتمل الدليل',
      experience: { type: 'textbook', reason: '', theme: 'abstract' },
      learningPointIds: ['4am_awwaliyan-fima-baynahuma_P1', '4am_awwaliyan-fima-baynahuma_P3'], sourceElementIds: ['act-7'] },
    // Modules 4–6 — les « مسائل » : exercices complets de type امتحان, ajouts
    // de la plateforme (content/problems.js), sans aucune preuve de maîtrise.
    { kind: 'situation', code: 'masala-1', module: 4, title: 'مسألة الدرس — لعبة «الزوج الرابح»: 26 و 45، 39 و 65', learningPointIds: ['4am_awwaliyan-fima-baynahuma_P1', '4am_awwaliyan-fima-baynahuma_P2', '4am_awwaliyan-fima-baynahuma_P3'] },
    { kind: 'situation', code: 'masala-2', module: 5, title: 'مسألة — مكتبة البلدية: 91 رواية و 120 قصة مصوّرة', learningPointIds: ['4am_awwaliyan-fima-baynahuma_P1', '4am_awwaliyan-fima-baynahuma_P2', '4am_awwaliyan-fima-baynahuma_P3'] },
    { kind: 'situation', code: 'masala-3', module: 6, title: 'مسألة — ورشة النجارة: لوحان من 391 سم و 323 سم', learningPointIds: ['4am_awwaliyan-fima-baynahuma_P2', '4am_awwaliyan-fima-baynahuma_P3'] },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'خمس عبارات: صحيح أم خاطئ؟ PGCD، خوارزمية إقليدس وقواعد قابلية القسمة.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: '17-wa-18', path: `${LESSON_BASE_PATH}/17-wa-18`,
      title: 'نشاط 7 — 17 و 18، 22 و 35، ومريم', desc: 'لماذا PGCD(17 ; 18) = 1؟ هل مريم على صواب بشأن 27 و 36؟',
      stage: 'trigger', teachesLearningPointIds: ['4am_awwaliyan-fima-baynahuma_P1', '4am_awwaliyan-fima-baynahuma_P3'], color: 'indigo', style: 'featured', estimatedMin: 12, difficulty: 1, actionText: 'أتوقّع وأكشف' },
    { id: '02', number: 2, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`,
      title: 'معارف — التعريف', desc: 'أوليان فيما بينهما يعني PGCD(a ; b) = 1. مثال الكتاب: 22 و 15.',
      stage: 'discovery', teachesLearningPointIds: ['4am_awwaliyan-fima-baynahuma_P1', '4am_awwaliyan-fima-baynahuma_P2'], color: 'violet', style: 'featured', estimatedMin: 8, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'تمارين الكتاب 23 ← 27 و 39.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_awwaliyan-fima-baynahuma_P2', '4am_awwaliyan-fima-baynahuma_P3'], color: 'amber', style: 'featured', estimatedMin: 13, difficulty: 2, actionText: 'أتدرّب' },
    // Les « مسائل » (track: 'problem') : practice_lab, avant le test, qui
    // reste toujours ouvert. Elles comptent dans la complétion, jamais dans
    // la maîtrise — docs/architecture/LESSON_CONTRACT.md § Modules « مسائل ».
    { id: '04', number: 4, slug: 'masala-1', path: `${LESSON_BASE_PATH}/masala-1`,
      title: 'مسألة 1 — لعبة «الزوج الرابح»', desc: 'مسألة الدرس: بطاقتان لكل لاعب، وقول سلمى. حلّ كامل خطوة بخطوة.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_awwaliyan-fima-baynahuma_P1', '4am_awwaliyan-fima-baynahuma_P2', '4am_awwaliyan-fima-baynahuma_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '05', number: 5, slug: 'masala-2', path: `${LESSON_BASE_PATH}/masala-2`,
      title: 'مسألة 2 — حصص الكتب للمدارس الريفية', desc: '91 رواية و 120 قصة مصوّرة: كم حصة متماثلة؟ وماذا تغيّر هبة دار نشر؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_awwaliyan-fima-baynahuma_P1', '4am_awwaliyan-fima-baynahuma_P2', '4am_awwaliyan-fima-baynahuma_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '06', number: 6, slug: 'masala-3', path: `${LESSON_BASE_PATH}/masala-3`,
      title: 'مسألة 3 — ورشة النجارة', desc: 'لوحان من 391 سم و 323 سم: هل المتعلّم على صواب؟ وكم قطعة؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_awwaliyan-fima-baynahuma_P2', '4am_awwaliyan-fima-baynahuma_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '07', number: 7, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'خمس أسئلة تُقيّم الكفاءات الثلاث.', stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 7, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
