/**
 * أدمج تعلّماتي — الوحدة 1 (kind: synthesis)
 * Synthèse de l'unité 1, affichée après les huit leçons (ce n'est PAS un neuvième درس). Depuis le 2026-10-13 :
 * six وضعيات d'entraînement autour du PGCD (modules 1 à 6), « تحليل الوضعية النهائية للاختبار » (module 7, juste
 * avant le test) puis « وضعية الاختبار النهائي » (module 8) — la situation des tabliers, le « تحدّي » du manuel p. 7.
 * « أؤكّد تعلّماتي » (QCM, p. 16) et la situation du manuel p. 16 (قصر الرياس) ne font plus partie de la synthèse
 * (décision du propriétaire).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/wadiya-idmajiya-aadad';

export const LESSON_CONFIG = {
  id: 'wadiya-idmajiya-aadad',
  kind: 'synthesis',
  unit: 'aadad-tabiiya-natiqa',
  unitTitle: 'الأعداد الطبيعيّة والأعداد النّاطقة',
  sequentialUnlock: true,
  // Regard de l'élève : 'mission' (la synthèse de l'unité 1, 2026-11-12 — le propriétaire : « go ahead » pour les synthèses des unités 1–4, recette
  // PROVISOIRE de la synthèse, pilote `wadiya-idmajiya-talis` ; docs/reports/MISSION_ROLLOUT_PROGRESS.md › « The synthesis recipe ») ; l'enseignant
  // et le mode classe gardent la page. Champs du moteur : LESSON_DEVELOPMENT_GUIDE › « Synthesis in the mission player ».
  studentView: 'mission',
  // LA MISSION d'une synthèse : rien à gagner — les clés des leçons de l'unité sont à l'élève DÈS le premier écran ; chaque وضعية تدريبية allume
  // les clés qu'elle UTILISE. Pas de point d'étape ; « وضعية الوحدة » (module 7) puis « التحدّي 🏆 » (module 8, jamais retouché). L'ouverture n'a
  // aucun chiffre ni la وضعية (balayage par rôle : content/forbidden.js, content/mission.test.js). La scène : le magasin de la commune (`apron-store`).
  mission: {
    scene: 'apron-store',
    title: 'مهمّة الوحدة',
    opening: {
      text: 'في مخزن البلدية لوازم من لونين تنتظر المدارس: كيف نوزّعها كلّها بالتساوي على أكبر عدد من المدارس؟ مفاتيح الوحدة كلّها معك — هل تعرف متى تستعمل كلًّا منها؟',
      cta: 'أجرّب',
    },
    toolsOwned: true,
    tools: [
      // les ids sont des connaissances des leçons de l'unité (qasim-mushtarak-akbar, bahth-pgcd, qawasim-adad-tabii) ; `usedIn` : les modules qui s'en servent
      { id: 'qawasim-mushtaraka', icon: '🤝', label: 'القواسم المشتركة', usedIn: [1, 2, 7] },
      { id: 'pgcd-taarif', icon: '🎯', label: 'القاسم المشترك الأكبر', usedIn: [1, 2, 3, 4, 5, 6, 7] },
      { id: 'pgcd-baqi', icon: '➗', label: 'الباقي يحفظ القاسم المشترك الأكبر', usedIn: [1, 2, 3, 4, 5, 6] },
      { id: 'khwarizmiyat-iqlidus', icon: '🔁', label: 'خوارزمية إقليدس', usedIn: [1, 2, 3, 4, 5, 6, 7] },
      { id: 'jidaa-aamilayn', icon: '✖️', label: 'عدد على شكل جداء عاملين', usedIn: [1, 2, 5, 6, 7] },
    ],
    checkpoints: [],
    climaxModule: 8,
    stationLabels: { 7: 'وضعية الوحدة', 8: 'التحدّي 🏆' },
    trainings: [1, 2, 3, 4, 5, 6],
    hideStars: true,
    // la somme HONNÊTE des modules (6 + 41 + 28 + 12), en deux séances ; le catalogue (`estimatedDurationMin`) n'est pas touché
    durationMin: 87,
    sittings: 2,
    resumeInside: true,
  },
  title: 'أدمج تعلّماتي — الأعداد الطبيعيّة والأعداد النّاطقة',
  description: 'وضعية إدماجية (توزيع المآزر المدرسية بالتساوي على أكبر عدد من المدارس) تُعبّئ القواسم المشتركة والقاسم المشترك الأكبر وخوارزمية إقليدس، تسبقها ست وضعيات تدريبية.',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 3,
  masteryThreshold: 0.8,
  emoji: '🎽',
  estimatedDurationMin: 40,
  textbookRef: { unit: 1, pages: '7' },
  skills: ['حل وضعية إدماجية بتعبئة قابلية القسمة والقواسم والقاسم المشترك الأكبر'],
  teachingScope: { include: ['ست وضعيات تدريبية حول PGCD', 'وضعية الاختبار النهائي: توزيع المآزر وتحليلها في ثلاث مراحل'], exclude: ['أي مفهوم جديد'] },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // La carte TOUTE OUVERTE (règle des pilotes, propriétaire 2026-11-08) : elle parle EN LETTRES — aucun nombre de la وضعية ni du défi
  // (knowledgeGraph.js, content/mission.test.js).
  knowledgeMapOpen: true,
  priorKnowledge: ['qawasim-mushtaraka', 'pgcd-taarif', 'qawasim-al-pgcd', 'pgcd-baqi', 'khwarizmiyat-iqlidus'],
  resources: [
    { kind: 'situation', code: 'challenge-936-845', module: 7, title: 'وضعية: توزيع 936 مئزرًا ورديًا و 845 مئزرًا أزرق على أكبر عدد من المدارس', learningPointIds: ['4am_wadiya-idmajiya-aadad_P1'], sourceElementIds: ['challenge'] },
    // Module 7 — les deux labos de l'unité sur des nombres FRÈRES (content/rounds.js) : les GROUPES (common-divisors, 42 أقلام و 35 كرّاسًا, les
    // mots de l'école) puis EUCLIDE (816 و 697, la part bâtie 816 = 17 × 48). Lecteur : des manches ; page : le workspace à deux niveaux.
    {
      kind: 'manipulation', code: 'common-divisors-lawazim', type: 'common-divisors', module: 7, level: 'beginner',
      title: 'لوازم المدارس: 42 قلمًا و 35 كرّاسًا',
      objective: 'توزيع نوعين من الأشياء بالتساوي على أكبر عدد من المدارس: عدد المدارس قاسم مشترك للعددين، والأكبر هو PGCD، وكل مدرسة تأخذ ناتج القسمة عليه',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'school' },
      learningPointIds: ['4am_wadiya-idmajiya-aadad_P1'],
      sourceElementIds: ['challenge'],
    },
    {
      kind: 'manipulation', code: 'euclidean-algorithm-makhzan', type: 'euclidean-algorithm', module: 7, level: 'advanced',
      title: 'المخزن الكبير: 816 و 697',
      objective: 'تعيين أكبر عدد من المدارس بخوارزمية إقليدس حين يكون العددان كبيرين، ثم كتابة ما تأخذه كل مدرسة',
      autonomy: 'عددان كبيران لا تُضاف فيهما المدارس واحدة واحدة: التلميذ يختار الخوارزمية ويتوقّف عند آخر باقٍ غير معدوم',
      experience: { type: 'platform_context', reason: 'larger_numbers_for_autonomy', theme: 'workshop' },
      learningPointIds: ['4am_wadiya-idmajiya-aadad_P1'],
      sourceElementIds: ['challenge'],
    },
    // Modules 1–6 — six وضعيات d'entraînement autour du PGCD (content/problems.js),
    // ajouts de la plateforme ; le module 7 analyse la situation évaluée au module 8.
    { kind: 'situation', code: 'wadiya-1', module: 1, title: 'وضعية 1 — توزيع 3090 كرّاسًا و 1854 كتابًا', learningPointIds: ['4am_wadiya-idmajiya-aadad_P1'] },
    { kind: 'situation', code: 'wadiya-2', module: 2, title: 'وضعية 2 — باقات من 161 زهرة بيضاء و 133 زهرة حمراء', learningPointIds: ['4am_wadiya-idmajiya-aadad_P1'] },
    { kind: 'situation', code: 'wadiya-3', module: 3, title: 'وضعية 3 — سياج حقل مستطيل 612 م × 174 م', learningPointIds: ['4am_wadiya-idmajiya-aadad_P1'] },
    { kind: 'situation', code: 'wadiya-4', module: 4, title: 'وضعية 4 — تشجير أرض مثلّثة أضلاعها 183 م و 135 م و 99 م', learningPointIds: ['4am_wadiya-idmajiya-aadad_P1'] },
    { kind: 'situation', code: 'wadiya-5', module: 5, title: 'وضعية 5 — تجزئة صفيحة زجاجية 2.20 م × 1.40 م', learningPointIds: ['4am_wadiya-idmajiya-aadad_P1'] },
    { kind: 'situation', code: 'wadiya-6', module: 6, title: 'وضعية 6 — تبليط قاعة 8.4 م × 4.4 م', learningPointIds: ['4am_wadiya-idmajiya-aadad_P1'] },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'عشر عبارات: صحيح أم خاطئ؟ القواسم المشتركة، PGCD وخوارزمية إقليدس — من السهل إلى الأصعب.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    // Les وضعيات d'entraînement (track: 'problem') : practice_lab, avant la situation
    // évaluée (module 8, toujours ouvert) ; le module 7 analyse cette situation. Elles comptent dans la complétion, jamais
    // dans la maîtrise — docs/lessons/MASAIL_GENERATION_GUIDE.md, §14 (synthèses).
    { id: '01', number: 1, slug: 'wadiya-1', path: `${LESSON_BASE_PATH}/wadiya-1`,
      title: 'الوضعية التدريبية 1 — الكراريس والكتب', desc: '3090 كرّاسًا و 1854 كتابًا: أكبر عدد من التلاميذ، وماذا يأخذ كل تلميذ؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_wadiya-idmajiya-aadad_P1'],
      color: 'sky', style: 'featured', estimatedMin: 6, difficulty: 3, actionText: 'أحلّ الوضعية' },
    { id: '02', number: 2, slug: 'wadiya-2', path: `${LESSON_BASE_PATH}/wadiya-2`,
      title: 'الوضعية التدريبية 2 — باقات الأزهار', desc: '161 زهرة بيضاء و 133 زهرة حمراء: أكبر عدد من الباقات المتماثلة، وماذا في كل باقة؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_wadiya-idmajiya-aadad_P1'],
      color: 'indigo', style: 'featured', estimatedMin: 6, difficulty: 3, actionText: 'أحلّ الوضعية' },
    { id: '03', number: 3, slug: 'wadiya-3', path: `${LESSON_BASE_PATH}/wadiya-3`,
      title: 'الوضعية التدريبية 3 — سياج الحقل', desc: 'حقل 612 م × 174 م: المسافة بين الأعمدة، عددها، وتكلفة المشروع.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_wadiya-idmajiya-aadad_P1'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ الوضعية' },
    { id: '04', number: 4, slug: 'wadiya-4', path: `${LESSON_BASE_PATH}/wadiya-4`,
      title: 'الوضعية التدريبية 4 — تشجير الأرض المثلّثة', desc: 'PGCD لثلاثة أعداد (183 و 135 و 99): المسافة بين الأشجار، عددها، وتكلفة التشجير.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_wadiya-idmajiya-aadad_P1'],
      color: 'emerald', style: 'featured', estimatedMin: 9, difficulty: 3, actionText: 'أحلّ الوضعية' },
    { id: '05', number: 5, slug: 'wadiya-5', path: `${LESSON_BASE_PATH}/wadiya-5`,
      title: 'الوضعية التدريبية 5 — صفيحة الزجاج', desc: '2.20 م × 1.40 م: أكبر مربّعات ممكنة دون ضياع، وعددها.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_wadiya-idmajiya-aadad_P1'],
      color: 'teal', style: 'featured', estimatedMin: 6, difficulty: 3, actionText: 'أحلّ الوضعية' },
    { id: '06', number: 6, slug: 'wadiya-6', path: `${LESSON_BASE_PATH}/wadiya-6`,
      title: 'الوضعية التدريبية 6 — بلاط قاعة الضيوف', desc: '8.4 م × 4.4 م: أكبر بلاطة مربّعة دون قصّ، وعدد البلاطات.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_wadiya-idmajiya-aadad_P1'],
      color: 'violet', style: 'featured', estimatedMin: 6, difficulty: 3, actionText: 'أحلّ الوضعية' },
    { id: '07', number: 7, slug: 'al-wadiya', path: `${LESSON_BASE_PATH}/al-wadiya`, title: 'تحليل الوضعية النهائية للاختبار', desc: 'جولتان في المختبر (لوازم المدارس والمخزن الكبير)، ثم وضعية الوحدة: المعطيات، الشرط، الحساب، نصيب كل مدرسة، وورقة نسيبة — دون حلّها بعد.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_wadiya-idmajiya-aadad_P1'], color: 'amber', style: 'featured', estimatedMin: 28, difficulty: 3, actionText: 'أحلّل الوضعية' },
    { id: '08', number: 8, slug: 'ahill', path: `${LESSON_BASE_PATH}/ahill`, title: 'وضعية الاختبار النهائي', desc: 'أربع مراحل تُقيَّم: ما المطلوب؟ أيّ حساب؟ البواقي، ثم الجواب.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 12, difficulty: 4, actionText: 'أحلّ' },
  ],
};
