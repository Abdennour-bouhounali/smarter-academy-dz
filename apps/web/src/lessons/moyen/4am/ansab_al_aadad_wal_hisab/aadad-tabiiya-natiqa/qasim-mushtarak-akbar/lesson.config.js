/**
 * الدرس 4 — القاسم المشترك الأكبر لعددين طبيعيين
 * Manuel 4AM, unité 1 : activité 4 (p. 8), معارف 3 (p. 10), معارف 4 تعريف + ملاحظة (p. 12), دوري الآن p. 11 (1), exercice 10 (p. 14),
 * puis trois « مسائل » de la plateforme (modules 4–6).
 *
 * CONCEPTION (LESSON_DEVELOPMENT_GUIDE §4ter, rétrofit du 2026-10-15) — le manuel fixe les الكفاءات, pas le parcours.
 *   Entrée retenue : 12 balles et 18 maillots à répartir en équipes identiques (niveau مبتدئ, ajout déclaré de la plateforme,
 *   `platform_designed_entry`) — la main ajoute les équipes une à une et VOIT qu'un nombre d'équipes n'est accepté que s'il range les
 *   deux collections à la fois (4 range les balles, laisse deux maillots) : « commun » devient nécessaire avant le mot. Rejeté :
 *   le نشاط 4 du manuel (90 roses rouges, 54 blanches, « 9 bouquets ? ») comme entrée — 90 et 54 sont trop grands pour qu'on
 *   VOIE pourquoi un nombre échoue, et la question « 9 ? » est un test de division, pas une découverte ; il reste le niveau
 *   متقدم du MÊME labo (bouquets puis listes) et la question « 9 bouquets » est posée à l'étape 2. Rejeté aussi : partir des listes de
 *   diviseurs (c'est la méthode, pas la raison). Ordre des idées : pourquoi 4 équipes échouent → brique « قواسم مشتركة » →
 *   9 bouquets (90 et 54) → les fleurs par couleur au plus grand nombre de bouquets → « أتوقّع القاعدة » du PGCD → (module 2) les
 *   communs de 28 et 42 posés dans le labo → définition → écriture PGCD(28 ; 42) → briques → communs = diviseurs du PGCD → remarque.
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/qasim-mushtarak-akbar';

export const LESSON_CONFIG = {
  id: 'qasim-mushtarak-akbar',
  kind: 'lesson',
  unit: 'aadad-tabiiya-natiqa',
  unitTitle: 'الأعداد الطبيعيّة والأعداد النّاطقة',
  sequentialUnlock: true,
  // Regard de l'élève : 'mission' (modèle du pilote qasim-adad-tabii, VALIDÉ par le propriétaire le 2026-11-08 ; rollout leçon par
  // leçon, docs/reports/MISSION_ROLLOUT_PROGRESS.md) — implique le regard « focus » ; l'enseignant et le mode classe ne voient aucun changement.
  studentView: 'mission',
  // LA MISSION : l'ouverture avoue qu'on ne sait pas encore la résoudre ; les outils sont les connaissances de knowledge.jsx ; les points
  // d'étape RAPPROCHENT de la mission sans en résoudre aucune question (la مسألة 1 du module 4 reste entière : ils parlent de 20, 30 et
  // 10 — jamais de 120, de 84 ni de leur PGCD) ; formatifs, jamais une preuve de maîtrise.
  mission: {
    scene: 'flower-shop',
    title: 'محلّ الورود',
    opening: {
      text: 'اقتنى بائع الزهور 120 وردة حمراء و 84 وردة بيضاء، ويريد أن يصنع منها كلّها باقات متماثلة لا تبقى بعدها وردة. كم باقة على الأكثر يستطيع أن يصنع؟ وكم وردة من كل لون في الباقة الواحدة؟',
      cta: 'لا أعرف بعد… هيا نجمع الأدوات',
    },
    tools: [
      { id: 'qawasim-mushtaraka', icon: '🤝', label: 'القواسم المشتركة' },
      { id: 'pgcd-taarif', icon: '🏆', label: 'أكبرها' },
      { id: 'pgcd-ramz', icon: '✍️', label: 'الرمز PGCD' },
      { id: 'qawasim-al-pgcd', icon: '🔗', label: 'قواسم PGCD' },
    ],
    climaxModule: 4,
    checkpoints: [
      {
        id: 'cp-mushtarak', afterModule: 1,
        prompt: 'عند أمين المكتبة 20 قلمًا و 30 كرّاسًا يريد أن يوزّعها كلّها على علب متماثلة. هل تصلح 5 علب؟',
        options: ['نعم: 5 يقسم 20 ويقسم 30 معًا', 'لا: 5 يقسم 20 فقط', 'لا نعرف قبل أن نملأ العلب'],
        correct: 0,
        explain: '$20 = 5 \\times 4$ و $30 = 5 \\times 6$: لا يبقى قلم ولا كرّاس. عدد العلب المقبول قاسم مشترك للعددين.',
      },
      {
        id: 'cp-akbar', afterModule: 2,
        prompt: 'القواسم المشتركة للعددين 20 و 30 هي 1 ، 2 ، 5 ، 10. ما $\\mathrm{PGCD}(20\\ ;\\ 30)$ ؟',
        options: ['10', '30', '5'],
        correct: 0,
        explain: 'أكبر القواسم المشتركة هو 10. أمّا 30 فلا يقسم 20. هذا ما ستبحث عنه في المهمة الكبرى: أكبر عدد من الباقات.',
      },
      {
        id: 'cp-qawasim', afterModule: 3,
        prompt: 'إذا كان $\\mathrm{PGCD}(a\\ ;\\ b) = 10$، فهل 4 قاسم مشترك للعددين $a$ و $b$ ؟',
        options: ['لا: القواسم المشتركة هي قواسم 10، أي 1 ، 2 ، 5 ، 10', 'نعم دائمًا', 'لا نعرف قبل أن نعرف a و b'],
        correct: 0,
        explain: 'القواسم المشتركة لعددين هي بالضبط قواسم قاسمهما المشترك الأكبر، و 4 لا يقسم 10. خطّتك في المسألة: جد الأكبر أوّلًا.',
      },
    ],
  },
  title: 'القاسم المشترك الأكبر لعددين طبيعيين',
  description: 'القواسم المشتركة لعددين طبيعيين والقاسم المشترك الأكبر لهما، من وضعية تشكيل باقات متماثلة إلى التعريف والترميز PGCD (a ; b).',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '💐',
  estimatedDurationMin: 45,
  textbookRef: { unit: 1, activity: 4, pages: '8, 10, 11, 12, 14' },
  skills: [
    'تعيين القواسم المشتركة لعددين طبيعيين',
    'التعرّف على القاسم المشترك الأكبر لعددين والترميز له بـ PGCD (a ; b)',
    'تفسير وضعية توزيع في باقات متماثلة بلغة القواسم المشتركة والقاسم المشترك الأكبر',
    'معرفة أن القواسم المشتركة لعددين هي قواسم قاسمهما المشترك الأكبر',
  ],
  teachingScope: {
    include: ['القواسم المشتركة، القاسم المشترك الأكبر، الرمز PGCD (a ; b)', 'ملاحظة الكتاب: القواسم المشتركة هي قواسم PGCD'],
    exclude: ['طرق حساب PGCD بغير حصر القواسم (الدرسان 5 و 6)'],
  },
  // « مسألة الدرس » : montrée dès le sommaire, rappelée au module 1, résolue
  // pas à pas au module 4 (content/problems.js). Prolonge les bouquets du
  // niveau متقدم : mêmes باقات متماثلة, d'autres nombres.
  lessonProblem: {
    module: 4,
    title: 'بائع الورود: 120 وردة حمراء و 84 وردة بيضاء',
    statement: 'اقتنى بائع زهور أمين في البليدة 120 وردة حمراء بـ 40 دج للوردة الواحدة، و 84 وردة بيضاء بـ 30 دج للوردة الواحدة. يريد استعمالها كلّها في تشكيل باقات متماثلة: في كل باقة نفس عدد الورود الحمراء ونفس عدد الورود البيضاء. يكلّفه تغليف الباقة الواحدة 100 دج. وهو حريص على احترام مواعيد زبائنه، فيفتح محلّه كل يوم على الساعة 8 صباحًا.',
    illustration: { kind: 'tags', cards: [{ title: 'ورود حمراء', icon: 'plant', lines: [{ label: 'العدد', value: 120, unit: 'وردة' }, { label: 'ثمن الوردة', value: 40, unit: 'دج' }] }, { title: 'ورود بيضاء', icon: 'plant', lines: [{ label: 'العدد', value: 84, unit: 'وردة' }, { label: 'ثمن الوردة', value: 30, unit: 'دج' }] }, { title: 'التغليف', icon: 'plant', lines: [{ label: 'ثمن الباقة', value: 100, unit: 'دج' }] }], ariaLabel: 'بطاقات تبيّن 120 وردة حمراء بـ 40 دج للوردة و 84 وردة بيضاء بـ 30 دج للوردة وتغليف الباقة بـ 100 دج' },
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // La carte TOUTE OUVERTE (règle des pilotes, propriétaire 2026-11-08) : toutes les connaissances dès le début, sans verrou par محور.
  knowledgeMapOpen: true,
  priorKnowledge: ['tariqa-qawasim'],
  resources: [
    // Module 1 — workspace à deux niveaux. Même objectif, deux échelles :
    // 12 et 18 se comptent sur les doigts ; 90 et 54 sont les nombres du
    // manuel et demandent une stratégie.
    { kind: 'manipulation', code: 'common-divisors-12-18', type: 'common-divisors', module: 1,
      level: 'beginner',
      title: 'مجموعات متماثلة: 12 و 18',
      objective: 'القواسم المشتركة لعددين، وأكبرها هو القاسم المشترك الأكبر',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'platform_designed_entry', theme: 'football' },
      learningPointIds: ['4am_qasim-mushtarak-akbar_P1', '4am_qasim-mushtarak-akbar_P2'], sourceElementIds: ['act-4'] },
    { kind: 'manipulation', code: 'common-divisors-90-54', type: 'common-divisors', module: 1,
      level: 'advanced',
      title: 'باقات متماثلة: 90 زهرة حمراء و 54 زهرة بيضاء',
      objective: 'القواسم المشتركة لعددين، وأكبرها هو القاسم المشترك الأكبر',
      autonomy: 'أعداد الكتاب: أكبر عدد من الباقات يُبحث عنه دون اقتراح، ثم قائمتان طويلتان يقارن بينهما التلميذ',
      experience: { type: 'textbook', reason: '', theme: 'garden' },
      learningPointIds: ['4am_qasim-mushtarak-akbar_P1', '4am_qasim-mushtarak-akbar_P2', '4am_qasim-mushtarak-akbar_P3'], sourceElementIds: ['act-4'] },
    { kind: 'manipulation', code: 'common-divisors-28-42', type: 'common-divisors', module: 2, title: 'مثال الكتاب: 28 و 42',
      learningPointIds: ['4am_qasim-mushtarak-akbar_P2', '4am_qasim-mushtarak-akbar_P4'], sourceElementIds: ['know-4-def'] },
    // Modules 4–6 — les « مسائل » : exercices complets de type امتحان, ajouts
    // de la plateforme (content/problems.js), sans aucune preuve de maîtrise.
    { kind: 'situation', code: 'masala-1', module: 4, title: 'مسألة الدرس — باقات الورود: 120 حمراء و 84 بيضاء', learningPointIds: ['4am_qasim-mushtarak-akbar_P1', '4am_qasim-mushtarak-akbar_P2', '4am_qasim-mushtarak-akbar_P3'] },
    { kind: 'situation', code: 'masala-2', module: 5, title: 'مسألة — صناديق السمك: 96 كغ سردين و 72 كغ جمبري', learningPointIds: ['4am_qasim-mushtarak-akbar_P1', '4am_qasim-mushtarak-akbar_P2', '4am_qasim-mushtarak-akbar_P3', '4am_qasim-mushtarak-akbar_P4'] },
    { kind: 'situation', code: 'masala-3', module: 6, title: 'مسألة — تبليط قاعة المطالعة: أيّ البلاطات تصلح؟', learningPointIds: ['4am_qasim-mushtarak-akbar_P1', '4am_qasim-mushtarak-akbar_P2', '4am_qasim-mushtarak-akbar_P3', '4am_qasim-mushtarak-akbar_P4'] },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'عشر عبارات: صحيح أم خاطئ؟ القاسم والبحث عن كل قواسم عدد.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'baqat', path: `${LESSON_BASE_PATH}/baqat`,
      title: 'نشاط 4 — باقات متماثلة', desc: '90 زهرة حمراء و 54 زهرة بيضاء: 9 باقات؟ وما أكبر عدد ممكن من الباقات؟',
      stage: 'trigger', teachesLearningPointIds: ['4am_qasim-mushtarak-akbar_P1', '4am_qasim-mushtarak-akbar_P3'],
      color: 'indigo', style: 'featured', estimatedMin: 12, difficulty: 1, actionText: 'أشكّل الباقات' },
    { id: '02', number: 2, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`,
      title: 'معارف — القواسم المشتركة والقاسم المشترك الأكبر', desc: 'التعريفان، الرمز PGCD (a ; b)، وملاحظة الكتاب مع 28 و 42.',
      stage: 'discovery', teachesLearningPointIds: ['4am_qasim-mushtarak-akbar_P1', '4am_qasim-mushtarak-akbar_P2', '4am_qasim-mushtarak-akbar_P4'],
      color: 'violet', style: 'featured', estimatedMin: 15, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'دوري الآن (65 و 78) وتمرين 10.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_qasim-mushtarak-akbar_P1', '4am_qasim-mushtarak-akbar_P2'],
      color: 'amber', style: 'featured', estimatedMin: 10, difficulty: 2, actionText: 'أتدرّب' },
    // Les « مسائل » (track: 'problem') : practice_lab, avant le test, qui
    // reste toujours ouvert. Elles comptent dans la complétion, jamais dans
    // la maîtrise — docs/architecture/LESSON_CONTRACT.md § Modules « مسائل ».
    { id: '04', number: 4, slug: 'masala-1', path: `${LESSON_BASE_PATH}/masala-1`,
      title: 'مسألة 1 — باقات الورود', desc: 'مسألة الدرس: 120 وردة حمراء و 84 بيضاء. 8 باقات أم 6؟ ما أكبر عدد؟ وكم الربح؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_qasim-mushtarak-akbar_P1', '4am_qasim-mushtarak-akbar_P2', '4am_qasim-mushtarak-akbar_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '05', number: 5, slug: 'masala-2', path: `${LESSON_BASE_PATH}/masala-2`,
      title: 'مسألة 2 — صناديق السمك', desc: '96 كغ سردين و 72 كغ جمبري: كم صندوقًا متماثلًا؟ وما قيمة الصندوق؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_qasim-mushtarak-akbar_P1', '4am_qasim-mushtarak-akbar_P2', '4am_qasim-mushtarak-akbar_P3', '4am_qasim-mushtarak-akbar_P4'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '06', number: 6, slug: 'masala-3', path: `${LESSON_BASE_PATH}/masala-3`,
      title: 'مسألة 3 — تبليط قاعة المطالعة', desc: 'أرضية طولها 480 سم وعرضها 360 سم: أيّ البلاطات المربعة تصلح؟ وكم تكلّف؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_qasim-mushtarak-akbar_P1', '4am_qasim-mushtarak-akbar_P2', '4am_qasim-mushtarak-akbar_P3', '4am_qasim-mushtarak-akbar_P4'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '07', number: 7, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'خمس أسئلة تُقيّم الكفاءات الأربع.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 8, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
