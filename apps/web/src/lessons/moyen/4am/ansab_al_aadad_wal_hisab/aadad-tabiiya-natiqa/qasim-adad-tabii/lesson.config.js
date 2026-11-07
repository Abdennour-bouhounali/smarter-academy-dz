/**
 * الدرس 1 — التعرّف على قاسم لعدد طبيعي
 * Unité 1 du manuel (4AM), activité 1 (p. 8), معارف 1 (p. 10), exercices 1, 2, 5 (p. 14),
 * puis trois « مسائل » de la plateforme (modules 4–6, pilote du 2026-10-05).
 * Source de vérité : docs/sources/4am/unit1/extraction.json.
 * Le réseau (2026-11-07) : 4am.m1.r01 REQUIERT 1am.m3.r01 (`qisma-iqlidiya-baqi`, publiée) et ÉTEND 1am.m3.r02 (`qawaid-qabiliyat-qisma`, publiée).
 *   Arêtes LP le long de ces deux liens : P1 ← 1am_qisma-iqlidiya-baqi_P1 (faire la division) + 1am_qawaid-qabiliyat-qisma_P4 (« يقبل القسمة » = reste nul),
 *   P2 ← 1am_qisma-iqlidiya-baqi_P2 (a = b × q + r), P3 ← 1am_qawaid-qabiliyat-qisma_P4. Aucune arête vers 2AM `qisma-iqlidiya-hasr` : le réseau n'a pas de lien
 *   2am.m1.r04 → 4am.m1.r01 (question au propriétaire). « راجع قبل أن تنطلق » et « راجع » après une erreur pointent déjà vers les deux leçons 1AM (réseau + `getLessonPath`).
 *
 * CONCEPTION (LESSON_DEVELOPMENT_GUIDE §4ter, rétrofit du 2026-10-15) — le manuel fixe les الكفاءات, pas le parcours.
 *   Entrée retenue : le TERRAIN (15 joueurs en 3 équipes, puis 16 : un joueur n'a pas d'équipe) — la main FIXE le nombre de groupes
 *   et le reste se voit debout sur le banc avant que le mot « قاسم » existe ; c'est le niveau مبتدئ du labo, ajout déclaré de la
 *   plateforme (`platform_designed_entry`). Rejeté : le نشاط 1 du manuel (420 livres, « 26 ou 28 ? ») comme entrée — un choix
 *   binaire dont la réponse se vérifie par deux restes, sans que l'idée devienne nécessaire ; il reste le niveau متقدم du MÊME labo
 *   (le rayon qu'on étire), posé juste après. Rejeté aussi : ouvrir sur la définition a = b × q (aucune raison pour la main).
 *   Ordre des idées : le 16e joueur et le reste (sur SES essais) → deux lectures d'une même division → pourquoi 28 vide le sol et pas
 *   26 → brique « قاسم بالباقي » APRÈS la réponse → ce que 28 est pour 420 → (module 2) 143 : 11 puis 13 vident le sol → définition
 *   par le reste → par le produit (13 aussi) → 120 = 6 × 20 → les quatre phrases (question d'abord, briques ensuite).
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/qasim-adad-tabii';

export const LESSON_CONFIG = {
  id: 'qasim-adad-tabii',
  kind: 'lesson',
  unit: 'aadad-tabiiya-natiqa',
  unitTitle: 'الأعداد الطبيعيّة والأعداد النّاطقة',
  sequentialUnlock: true,
  // Regard de l'élève : 'mission' (pilote 2026-11-04, lessons/common/mission/) implique le regard « focus » (2026-11-03) et
  // fait de la leçon un parcours vers la مسألة du درس. L'enseignant et le mode classe ne voient aucun changement.
  studentView: 'mission',
  // LA MISSION (LESSON_DEVELOPMENT_GUIDE « Le mode mission ») : l'ouverture avoue qu'on ne sait pas encore la résoudre ;
  // les outils sont les connaissances de knowledge.jsx ; les points d'étape RAPPROCHENT de la mission sans en résoudre
  // aucune question (la مسألة 1 du module 4 reste entière) ; formatifs, jamais une preuve de maîtrise.
  mission: {
    title: 'مكتبة 756 كتابًا',
    opening: {
      text: 'وصلت إلى مكتبة المتوسطة 756 كتابًا. هل تستطيع ترتيبها في رفوف مملوءة تمامًا، دون أن يبقى أيّ كتاب على الأرض؟',
      cta: 'لا أعرف بعد… هيا نجمع الأدوات',
    },
    tools: [
      { id: 'qasim-baqi', icon: '🔑', label: 'القاسم بالباقي' },
      { id: 'qasim-jidaa', icon: '🗝️', label: 'القاسم بالجداء' },
      { id: 'siyagh-mutakafia', icon: '🗣️', label: 'أربع جمل' },
      { id: 'wahid-wa-nafsuh', icon: '⭐', label: '1 والعدد نفسه' },
    ],
    climaxModule: 4,
    checkpoints: [
      {
        id: 'cp-baqi', afterModule: 1,
        prompt: 'لكي لا يبقى أيّ كتاب على الأرض، ماذا يجب أن يكون باقي قسمة 756 على عدد كتب الرفّ الواحد؟',
        options: ['الباقي 0', 'الباقي أصغر من 10', 'الباقي 1'],
        correct: 0,
        explain: 'كل كتاب يبقى على الأرض هو باقٍ. لا يبقى أيّ كتاب فقط عندما يكون الباقي 0: عندئذ يكون عدد كتب الرفّ قاسمًا للعدد 756.',
      },
      {
        id: 'cp-jidaa', afterModule: 2,
        prompt: 'لو وجدنا عددًا طبيعيًا $q$ بحيث $756 = b \times q$، فماذا نعرف عن الرفوف من $b$ كتابًا؟',
        options: ['$b$ قاسم للعدد 756: الرفوف تُملأ تمامًا', 'يبقى كتاب واحد على الأرض', 'لا نعرف شيئًا قبل حساب الباقي'],
        correct: 0,
        explain: 'المساواة $756 = b \times q$ تعني أن الباقي 0: $b$ قاسم للعدد 756، و $q$ هو عدد الرفوف.',
      },
      {
        id: 'cp-khitta', afterModule: 3,
        prompt: 'القيّم يتردّد بين رفوف من 32 كتابًا ورفوف من 36 كتابًا. ماذا يفعل ليختار؟',
        options: ['يُجري القسمة الإقليدية للعدد 756 على كلّ منهما وينظر إلى الباقي', 'يختار الرفوف الأكبر', 'يختار الرفوف الأرخص'],
        correct: 0,
        explain: 'الرفّ المناسب هو الذي يجعل الباقي 0. هذه خطّتك في المهمة الكبرى التالية.',
      },
    ],
  },
  title: 'التعرّف على قاسم لعدد طبيعي',
  description: 'التعرّف على قاسم لعدد طبيعي من خلال القسمة الإقليدية والمساواة a = b × q، واستعمال الصيغ المتكافئة: قاسم لـ، يقسم، يقبل القسمة على، مضاعف لـ.',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🔢',
  estimatedDurationMin: 45,
  textbookRef: { unit: 1, activity: 1, pages: '8, 10, 14' },
  skills: [
    'التعرّف على قاسم لعدد طبيعي من خلال الباقي المعدوم للقسمة الإقليدية',
    'التعبير عن «b قاسم لـ a» بالمساواة a = b × q',
    'استعمال الصيغ المتكافئة: قاسم لـ، يقسم، يقبل القسمة على، مضاعف لـ',
    'معرفة أن 1 قاسم لكل عدد طبيعي وأن كل عدد طبيعي غير معدوم قاسم لنفسه',
  ],
  teachingScope: {
    include: ['قاسم عدد طبيعي: التعريفان (الباقي المعدوم، a = b × q) والصيغ المتكافئة', 'الملاحظات: 1 قاسم لكل عدد، وكل عدد غير معدوم قاسم لنفسه'],
    exclude: ['تعيين كل قواسم عدد (الدرس 2)', 'خواص القواسم (الدرس 3)', 'القاسم المشترك الأكبر (الدرس 4)'],
  },
  // « مسألة الدرس » (pilote مسائل, 2026-10-05) : montrée dès le sommaire,
  // rappelée au module 1, résolue pas à pas au module 4 (content/problems.js).
  // La مسألة reste celle de la bibliothèque (756 livres) : c'est la MISSION de la leçon ; le labo, lui, est le terrain.
  lessonProblem: {
    module: 4,
    title: 'مكتبة المتوسطة: 756 كتابًا في رفوف',
    statement: 'تلقّت مكتبة المتوسطة هبة من 756 كتابًا من أحد المحسنين، نشرًا للعلم وحبًّا في القراءة. المكتبة مفتوحة 5 أيام في الأسبوع. يريد القيّم ترتيب كل الكتب في رفوف مملوءة تمامًا، دون أن يبقى أيّ كتاب على الأرض. في المخزن نوعان من الرفوف: رفوف تتّسع لـ 32 كتابًا ورفوف تتّسع لـ 36 كتابًا، وثمن الرفّ الواحد 1850 دج مهما كان نوعه.',
    // Les questions de la مسألة 1 (content/problems.js les reprend telles quelles) :
    // le sommaire montre l'énoncé ET ce qu'on demande.
    questions: [
      { label: '1)', text: 'أجرِ القسمة الإقليدية للعدد 756 على 32. هل تناسب الرفوف من 32 كتابًا القيّم؟ علّل.' },
      { label: '2)', text: 'بيّن أنّ 36 قاسم للعدد 756، ثم استنتج عدد الرفوف اللازمة.' },
      { label: '3)', text: 'ما المبلغ الذي سيدفعه القيّم لشراء الرفوف المناسبة؟' },
    ],
    illustration: { kind: 'scene', icon: 'book', bg: 'blue', chips: [{ label: 'كتب', value: 756, unit: 'كتابًا', tone: 'blue' }, { label: 'رفّ صغير', value: 32, unit: 'كتابًا', tone: 'amber' }, { label: 'رفّ كبير', value: 36, unit: 'كتابًا', tone: 'green' }, { label: 'ثمن الرفّ', value: 1850, unit: 'دج', tone: 'rose' }], ariaLabel: 'كومة كتب عددها 756 ورفوف تتّسع لـ 32 و 36 كتابًا ثمن الرفّ الواحد 1850 دج' },
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Les acquis des années antérieures que « أستعدّ » (p. 7) diagnostique.
  priorKnowledge: ['qisma-iqlidiya', 'qawaid-qabiliyat-al-qisma'],
  resources: [
    // Le module 1 est un WORKSPACE À DEUX NIVEAUX (MANIPULATION_CONTRACT
    // §7bis-levels) : même objectif mathématique, deux expériences.
    //
    //   مبتدئ  — les équipes : contexte de la PLATEFORME, petits nombres.
    //   متقدم  — le MÊME terrain, 42 joueurs, 5 ou 6 équipes (content/teams.js) : le contraste du نشاط 1 du manuel (420 livres,
    //            26 ou 28 par rayon). Le labo de la bibliothèque a été RETIRÉ de la leçon le 2026-11-04 (propriétaire : « le labo
    //            du football pour toute la leçon »).
    //
    // `experience` porte la traçabilité exigée : d'où vient la mathématique
    // (toujours le manuel) et ce que la plateforme a fait de la situation.
    {
      kind: 'manipulation', code: 'team-builder-15-3', type: 'team-builder', module: 1,
      level: 'beginner',
      title: 'قسمة بالتساوي — 15 لاعبًا في 3 فرق',
      objective: 'التوزيع بالتساوي: a = b × q + r، والباقي معدوم ⇔ b قاسم لـ a',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'platform_designed_entry', theme: 'football' },
      learningPointIds: ['4am_qasim-adad-tabii_P1'],
      sourceElementIds: ['act-1'],
    },
    {
      kind: 'manipulation', code: 'team-builder-42', type: 'team-builder', module: 1,
      level: 'advanced',
      title: 'هل هو قاسم؟ — 42 لاعبًا في 5 أو 6 فرق',
      objective: 'التوزيع بالتساوي: a = b × q + r، والباقي معدوم ⇔ b قاسم لـ a',
      autonomy: 'التلميذ يختار بنفسه عدد الفرق (4 إلى 7) لـ 42 لاعبًا، ويرى متى لا يبقى أحد خارج الفرق',
      experience: { type: 'platform_context', reason: 'platform_designed_entry', theme: 'football' },
      learningPointIds: ['4am_qasim-adad-tabii_P1', '4am_qasim-adad-tabii_P2'],
      sourceElementIds: ['act-1'],
    },
    // Module 2 (معارف) — l'exemple travaillé sur le MÊME terrain qu'au module 1. Un seul instrument pour toute la leçon. Un seul
    // niveau ici (`levels={false}` dans le module) ; sa découverte est la symétrie 48 = 6 × 8 = 8 × 6 (6 équipes PUIS 8).
    {
      kind: 'manipulation', code: 'team-builder-48', type: 'team-builder', module: 2,
      title: 'مثال: 48 لاعبًا — 6 ثم 8 فرق',
      experience: { type: 'platform_context', reason: 'platform_designed_entry', theme: 'football' },
      learningPointIds: ['4am_qasim-adad-tabii_P2'],
      sourceElementIds: ['know-1'],
    },
    // Modules 4–6 — les « مسائل » : exercices complets de type امتحان, ajouts
    // de la plateforme (content/problems.js), sans aucune preuve de maîtrise.
    { kind: 'situation', code: 'masala-1', module: 4, title: 'مسألة الدرس — رفوف المكتبة: 756 كتابًا', learningPointIds: ['4am_qasim-adad-tabii_P1', '4am_qasim-adad-tabii_P2', '4am_qasim-adad-tabii_P3'] },
    { kind: 'situation', code: 'masala-2', module: 5, title: 'مسألة — التعاونية الفلاحية: 2028 بيضة', learningPointIds: ['4am_qasim-adad-tabii_P1', '4am_qasim-adad-tabii_P2', '4am_qasim-adad-tabii_P3'] },
    { kind: 'situation', code: 'masala-3', module: 6, title: 'مسألة — الرحلة المدرسية: كم حافلة؟', learningPointIds: ['4am_qasim-adad-tabii_P1', '4am_qasim-adad-tabii_P2'] },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'ست عبارات: صحيح أم خاطئ؟ القسمة الإقليدية وقواعد قابلية القسمة.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'al-maktaba', path: `${LESSON_BASE_PATH}/al-maktaba`,
      title: 'نشاط 1 — فرق متساوية', desc: 'كم فريقًا لا يترك أحدًا خارج الفرق؟ جرّب، ولاحظ الباقي.',
      stage: 'trigger', teachesLearningPointIds: ['4am_qasim-adad-tabii_P1'],
      color: 'indigo', style: 'featured', estimatedMin: 10, difficulty: 1, actionText: 'أجرّب' },
    { id: '02', number: 2, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`,
      title: 'معارف — قاسم عدد طبيعي', desc: 'تعريفان لنفس الفكرة، وأربع جمل لها نفس المعنى.',
      stage: 'discovery', teachesLearningPointIds: ['4am_qasim-adad-tabii_P2', '4am_qasim-adad-tabii_P3', '4am_qasim-adad-tabii_P4'],
      color: 'violet', style: 'featured', estimatedMin: 12, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'ثلاثة تمارين للتطبيق.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_qasim-adad-tabii_P1', '4am_qasim-adad-tabii_P2'],
      color: 'amber', style: 'featured', estimatedMin: 10, difficulty: 2, actionText: 'أتدرّب' },
    // Les « مسائل » (track: 'problem') : practice_lab, avant le test, qui
    // reste toujours ouvert. Elles comptent dans la complétion, jamais dans
    // la maîtrise — docs/architecture/LESSON_CONTRACT.md § Modules « مسائل ».
    { id: '04', number: 4, slug: 'masala-1', path: `${LESSON_BASE_PATH}/masala-1`,
      title: 'مسألة 1 — رفوف المكتبة', desc: 'مسألة الدرس: 756 كتابًا ونوعان من الرفوف. حلّ كامل خطوة بخطوة.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_qasim-adad-tabii_P1', '4am_qasim-adad-tabii_P2', '4am_qasim-adad-tabii_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '05', number: 5, slug: 'masala-2', path: `${LESSON_BASE_PATH}/masala-2`,
      title: 'مسألة 2 — التعاونية الفلاحية', desc: '2028 بيضة: أيّ الأوعية؟ وأيّ توضيب أربح؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_qasim-adad-tabii_P1', '4am_qasim-adad-tabii_P2', '4am_qasim-adad-tabii_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '06', number: 6, slug: 'masala-3', path: `${LESSON_BASE_PATH}/masala-3`,
      title: 'مسألة 3 — الرحلة المدرسية', desc: 'كم حافلة؟ ماذا يعني الباقي؟ وكم يدفع كل تلميذ؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_qasim-adad-tabii_P1', '4am_qasim-adad-tabii_P2'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '07', number: 7, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'خمس أسئلة تُقيّم الكفاءات الأربع.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 7, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
