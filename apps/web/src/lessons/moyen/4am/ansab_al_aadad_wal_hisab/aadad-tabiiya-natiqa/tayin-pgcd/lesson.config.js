/**
 * الدرس 5 — تعيين القاسم المشترك الأكبر لعددين طبيعيين
 * Manuel 4AM, unité 1 : activité 5 (p. 8), معارف 4 نتائج مباشرة (p. 12), exercices 17, 18 (p. 14), 22 (p. 15),
 * puis trois « مسائل » de la plateforme (modules 4–6).
 *
 * CONCEPTION (LESSON_DEVELOPMENT_GUIDE §4ter, rétrofit du 2026-10-15) — le manuel fixe les الكفاءات, pas le parcours.
 *   Entrée retenue : les trousses identiques (labo `common-divisors`, thème `school`, niveau مبتدئ : 8 stylos et 12 cahiers à
 *   ranger SANS rien laisser dehors) — la main ajoute des trousses et seul un nombre qui range les DEUX piles est gardé : « commun »
 *   se voit avant de se lire dans des listes, et « le plus grand » est la question de la main. Rejetée : l'activité 5 du manuel
 *   telle quelle (trois consignes sur 42 et 60 : lister, croiser, prendre le plus grand — le tout de tête, sans besoin) ; elle reste le
 *   niveau متقدم du MÊME labo (les deux listes) et la question de l'étape 2 (« انقل وأكمل »).
 *   Ordre des idées : pourquoi 3 trousses ne marchent pas (3 divise 12 mais pas 8 : « commun ») → 42 et 60 sur les listes, la phrase
 *   du manuel à compléter, puis la méthode (boîte puis brique APRÈS la réponse) → module 2 : PGCD sans listes, essayé AVANT la règle,
 *   puis la règle « b divise a » (rappel et boîte APRÈS la réponse).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/tayin-pgcd';

export const LESSON_CONFIG = {
  id: 'tayin-pgcd',
  kind: 'lesson',
  unit: 'aadad-tabiiya-natiqa',
  unitTitle: 'الأعداد الطبيعيّة والأعداد النّاطقة',
  sequentialUnlock: true,
  // Regard de l'élève : 'mission' (modèle du pilote qasim-adad-tabii, VALIDÉ par le propriétaire le 2026-11-08 ; rollout leçon par
  // leçon, docs/reports/MISSION_ROLLOUT_PROGRESS.md) — implique le regard « focus » ; l'enseignant et le mode classe ne voient aucun changement.
  studentView: 'mission',
  // LA MISSION : l'ouverture avoue qu'on ne sait pas encore la résoudre ; les outils sont les connaissances de knowledge.jsx ; les points
  // d'étape RAPPROCHENT de la mission sans en résoudre aucune question (la مسألة 1 du module 4 reste entière : ils parlent de 12, 20, 15 et
  // 45 — jamais de 90, de 126 ni de leur PGCD) ; formatifs, jamais une preuve de maîtrise.
  mission: {
    scene: 'school-bags',
    title: 'حقائب التضامن',
    opening: {
      text: 'جمعت جمعية أولياء التلاميذ 90 قلمًا و 126 كرّاسًا لتحضير حقائب مدرسية متماثلة لتلاميذ معوزين، دون أن يبقى قلم ولا كرّاس. القائمتان طويلتان: كيف نجد أكبر عدد من الحقائب بطريقة لا ننسى فيها شيئًا؟',
      cta: 'لا أعرف بعد… هيا نجمع الأدوات',
    },
    tools: [
      { id: 'tayin-bil-hasr', icon: '📋', label: 'حصر القواسم' },
      { id: 'nataij-mubashira', icon: '⚡', label: 'نتائج مباشرة' },
      { id: 'pgcd-idha-qasim', icon: '🔗', label: 'أحدهما يقسم الآخر' },
    ],
    climaxModule: 4,
    checkpoints: [
      {
        id: 'cp-hasr', afterModule: 1,
        prompt: 'قواسم 12: 1 ، 2 ، 3 ، 4 ، 6 ، 12 — قواسم 20: 1 ، 2 ، 4 ، 5 ، 10 ، 20. ما $\\mathrm{PGCD}(12\\ ;\\ 20)$ ؟',
        options: ['4', '20', '2'],
        correct: 0,
        explain: 'القواسم المشتركة 1 ، 2 ، 4، وأكبرها 4. هذه الخطوات الثلاث نفسها ستعيدها في المهمة الكبرى بعددين أكبر.',
      },
      {
        id: 'cp-mubashira', afterModule: 2,
        prompt: '15 قاسم للعدد 45. ما $\\mathrm{PGCD}(45\\ ;\\ 15)$ دون حصر القواسم؟',
        options: ['15', '45', '3'],
        correct: 0,
        explain: 'عندما يكون b قاسمًا لـ a فإنّ $\\mathrm{PGCD}(a\\ ;\\ b) = b$: هنا 15، لا الأكبر 45.',
      },
      {
        id: 'cp-khitta', afterModule: 3,
        prompt: 'لتحضير أكبر عدد من الحقائب المتماثلة دون أن يبقى شيء، ماذا نبحث عنه؟',
        options: ['القاسم المشترك الأكبر لعدد الأقلام وعدد الكراريس', 'مجموع عدد الأقلام وعدد الكراريس', 'أكبر العددين'],
        correct: 0,
        explain: 'عدد الحقائب يقسم العددين معًا، وأكبره هو PGCD. هذه خطّتك في المسألة التالية.',
      },
    ],
  },
  title: 'تعيين القاسم المشترك الأكبر لعددين طبيعيين',
  description: 'تعيين القاسم المشترك الأكبر لعددين بحصر قواسم كل عدد ثم القواسم المشتركة ثم أكبرها، والنتائج المباشرة: PGCD(a ; a) = a، PGCD(a ; 0) = a، PGCD(a ; b) = PGCD(b ; a).',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 3,
  masteryThreshold: 0.8,
  emoji: '🎯',
  estimatedDurationMin: 40,
  textbookRef: { unit: 1, activity: 5, pages: '8, 12, 14, 15' },
  skills: [
    'تعيين PGCD (a ; b) بحصر قواسم كل عدد ثم القواسم المشتركة ثم أكبرها',
    'استعمال النتائج المباشرة: PGCD(a ; a) = a، PGCD(a ; 0) = a، PGCD(a ; b) = PGCD(b ; a)',
    'معرفة أن PGCD (a ; b) = b عندما يكون b قاسما للعدد a',
  ],
  teachingScope: { include: ['تعيين PGCD بحصر القواسم (42 و 60)', 'النتائج المباشرة الأربع'], exclude: ['الفروق المتتابعة وخوارزمية إقليدس (الدرس 6)'] },
  // « مسألة الدرس » (déploiement des مسائل, 2026-10-06) : montrée dès le sommaire,
  // rappelée au module 1, résolue pas à pas au module 4 (content/problems.js).
  // Prolonge le niveau متقدم (listes de diviseurs, monde `school` : stylos et
  // cahiers en sacs identiques) : même méthode, d'autres nombres.
  lessonProblem: {
    module: 4,
    title: 'حقائب التضامن: 90 قلمًا و 126 كرّاسًا',
    statement: 'جمعت جمعية أولياء التلاميذ في متوسطة، خلال 3 أسابيع، 90 قلمًا و 126 كرّاسًا لتحضير حقائب مدرسية متماثلة لتلاميذ معوزين: في كل حقيبة العدد نفسه من الأقلام والعدد نفسه من الكراريس، وتُوزَّع كل الأقلام وكل الكراريس. تريد الجمعية تحضير أكبر عدد ممكن من الحقائب. ثمن الحقيبة الفارغة 450 دج، وميزانية الجمعية لشراء الحقائب 10000 دج.',
    illustration: { kind: 'stacks', rows: [{ icon: 'pen', count: 90, label: 'قلم' }, { icon: 'book', count: 126, label: 'كرّاس' }], ariaLabel: 'صفّان من المواد المجمّعة: 90 قلمًا و 126 كرّاسًا' },
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // La carte TOUTE OUVERTE (règle des pilotes, propriétaire 2026-11-08) : toutes les connaissances dès le début, sans verrou par محور.
  knowledgeMapOpen: true,
  priorKnowledge: ['pgcd-taarif', 'tariqa-qawasim'],
  resources: [
    // Module 1 — workspace à deux niveaux. La MÉTHODE est la même (حصر :
    // lister, croiser, prendre le plus grand) ; ce qui change est la
    // longueur des listes, donc le besoin d'être méthodique. Le niveau
    // débutant part d'un contexte de la plateforme (8 stylos et 12 cahiers
    // en trousses identiques, thème `school`) pour que « commun » se voie
    // avant de se lire dans les listes ; le niveau avancé garde les listes
    // nues du manuel — ici, la liste EST l'objet mathématique.
    { kind: 'manipulation', code: 'common-divisors-8-12', type: 'common-divisors', module: 1,
      level: 'beginner',
      title: 'حقائب متماثلة: 8 أقلام و 12 كراسًا، حتى أكبر عدد من الحقائب',
      objective: 'تعيين PGCD بحصر القواسم ثم القواسم المشتركة ثم أكبرها',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'platform_designed_entry', theme: 'school' },
      learningPointIds: ['4am_tayin-pgcd_P1'], sourceElementIds: ['act-5'] },
    { kind: 'manipulation', code: 'common-divisors-42-60', type: 'common-divisors', module: 1,
      level: 'advanced',
      title: 'قواسم 42 و 60: من القائمتين إلى PGCD',
      objective: 'تعيين PGCD بحصر القواسم ثم القواسم المشتركة ثم أكبرها',
      autonomy: 'قائمتان طويلتان (اثنا عشر قاسمًا للعدد 60): لا يمكن النجاح بالمصادفة، يلزم ترتيب',
      experience: { type: 'textbook', reason: '', theme: 'school' },
      learningPointIds: ['4am_tayin-pgcd_P1'], sourceElementIds: ['act-5'] },
    { kind: 'method', code: 'method-hasr', module: 1, title: 'طريقة: حصر القواسم ثم القواسم المشتركة ثم أكبرها', learningPointIds: ['4am_tayin-pgcd_P1'], sourceElementIds: ['act-5'] },
    // Modules 4–6 — les « مسائل » : exercices complets de type امتحان, ajouts
    // de la plateforme (content/problems.js), sans aucune preuve de maîtrise.
    { kind: 'situation', code: 'masala-1', module: 4, title: 'مسألة الدرس — حقائب التضامن: 90 قلمًا و 126 كرّاسًا', learningPointIds: ['4am_tayin-pgcd_P1'] },
    { kind: 'situation', code: 'masala-2', module: 5, title: 'مسألة — قفة رمضان: 60 قارورة زيت و 84 علبة طماطم', learningPointIds: ['4am_tayin-pgcd_P1', '4am_tayin-pgcd_P2', '4am_tayin-pgcd_P3'] },
    { kind: 'situation', code: 'masala-3', module: 6, title: 'مسألة — تربّص نادي كرة القدم: كم فوجًا؟', learningPointIds: ['4am_tayin-pgcd_P1'] },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'عشر عبارات: صحيح أم خاطئ؟ قواسم عدد والقاسم المشترك الأكبر.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: '42-wa-60', path: `${LESSON_BASE_PATH}/42-wa-60`,
      title: 'نشاط 5 — 42 و 60', desc: 'أوجد قواسم كل عدد، ثم القواسم المشتركة، ثم أكبرها.',
      stage: 'trigger', teachesLearningPointIds: ['4am_tayin-pgcd_P1'], color: 'indigo', style: 'featured', estimatedMin: 12, difficulty: 1, actionText: 'أعيّن' },
    { id: '02', number: 2, slug: 'nataij-mubashira', path: `${LESSON_BASE_PATH}/nataij-mubashira`,
      title: 'معارف — نتائج مباشرة', desc: 'PGCD(a ; a)، PGCD(a ; 0)، PGCD(a ; b) عندما يكون b قاسمًا لـ a، والتبديل.',
      stage: 'discovery', teachesLearningPointIds: ['4am_tayin-pgcd_P2', '4am_tayin-pgcd_P3'], color: 'violet', style: 'featured', estimatedMin: 10, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'تمارين الكتاب 17، 18 و 22.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_tayin-pgcd_P1', '4am_tayin-pgcd_P3'], color: 'amber', style: 'featured', estimatedMin: 12, difficulty: 2, actionText: 'أتدرّب' },
    // Les « مسائل » (track: 'problem') : practice_lab, avant le test, qui
    // reste toujours ouvert. Elles comptent dans la complétion, jamais dans
    // la maîtrise — docs/architecture/LESSON_CONTRACT.md § Modules « مسائل ».
    { id: '04', number: 4, slug: 'masala-1', path: `${LESSON_BASE_PATH}/masala-1`,
      title: 'مسألة 1 — حقائب التضامن', desc: 'مسألة الدرس: 90 قلمًا و 126 كرّاسًا في حقائب متماثلة. حلّ كامل خطوة بخطوة.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_tayin-pgcd_P1'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '05', number: 5, slug: 'masala-2', path: `${LESSON_BASE_PATH}/masala-2`,
      title: 'مسألة 2 — قفة رمضان', desc: 'كم عائلة تستفيد؟ وماذا يتغيّر بعد تبرّع محسن؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_tayin-pgcd_P1', '4am_tayin-pgcd_P2', '4am_tayin-pgcd_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '06', number: 6, slug: 'masala-3', path: `${LESSON_BASE_PATH}/masala-3`,
      title: 'مسألة 3 — تربّص النادي', desc: '48 من الأشبال و 80 من الأصاغر: كم فوجًا مع 10 مؤطّرين فقط؟ وكم يدفع كل لاعب؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_tayin-pgcd_P1'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '07', number: 7, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'أربع أسئلة تُقيّم الكفاءات الثلاث.', stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 6, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
