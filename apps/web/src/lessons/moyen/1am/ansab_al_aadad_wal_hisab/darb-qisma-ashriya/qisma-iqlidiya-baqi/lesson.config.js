/**
 * الدرس — القسمة الإقليدية (1AM, unité 3 « الحساب على الأعداد الطبيعية والأعداد العشرية: الضرب والقسمة »).
 * Manuel 1AM (الجيل الثاني) : نشاط 3 p. 37, معارف 2 p. 41, exercices 15–21 pp. 45–46, la calculatrice p. 50 ;
 * أقوّم تعلّماتي 7, 8 p. 47 au إختبار أولي. Généré DANS son entrée du catalogue (même code, item 1am.m3.r01),
 * cycle moyen phase 3, 2026-10-14. Source de vérité : docs/sources/1am/unit3/extraction.json.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/1am/ansab_al_aadad_wal_hisab/qisma-iqlidiya-baqi';

export const LESSON_CONFIG = {
  id: 'qisma-iqlidiya-baqi',
  kind: 'lesson',
  unit: 'darb-qisma-ashriya',
  unitTitle: 'الحساب على الأعداد الطبيعية والأعداد العشرية: الضرب والقسمة',
  sequentialUnlock: true,
  title: 'القسمة الإقليدية',
  description: 'نشكّل أكبر عدد ممكن من المجموعات الكاملة ونتوقّف عندما يصبح الباقي أصغر من المقسوم عليه: نعيّن حاصل القسمة الإقليدية وباقيها، نكتب a = b × q + r مع r < b، ونوظّفها في مشكلات توزيع وتجميع.',
  level: 'moyen',
  grade: '1am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان الأنشطة العددية',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '➗',
  estimatedDurationMin: 78,
  textbookRef: { unit: 3, activity: 3, pages: '36, 37, 41, 45, 46, 47, 50' },
  skills: [
    'إنجاز القسمة الإقليدية لعدد طبيعي على عدد طبيعي غير معدوم مكتوب برقم واحد أو رقمين',
    'كتابة المساواة a = b × q + r مع r < b وتسمية المقسوم والمقسوم عليه والحاصل والباقي',
    'توظيف القسمة الإقليدية لحل مشكلات توزيع وتجميع',
  ],
  teachingScope: {
    include: ['القسمة الإقليدية: أكبر عدد من المجموعات الكاملة، والباقي أصغر من المقسوم عليه', 'المساواة a = b × q + r والحصر b × q ≤ a < b × (q + 1)', 'إنجاز القسمة عموديا وبالآلة الحاسبة', 'تفسير الحاصل والباقي في مشكلة'],
    exclude: ['قواعد قابلية القسمة (الدرس التالي)', 'القسمة العشرية والقيمة المقرّبة لحاصل قسمة (درس لاحق)'],
  },
  // « مسألة الدرس » : montrée dès le sommaire, rappelée au module 1, résolue au module 5 (content/problems.js).
  // Elle prolonge le niveau متقدم (des bouquets de fleurs, d'autres nombres).
  lessonProblem: {
    module: 5,
    title: 'بائع الزهور: 350 زهرة',
    statement: 'حضّر بائع زهور 350 زهرة لعيد المعلّم، ويريد تشكيل باقات متماثلة في كل منها 16 زهرة، يقدّمها التلاميذ لأساتذتهم عرفانًا بفضلهم. يبيع البائع الباقة الواحدة بـ 450 دج، ويفتح محلّه على الساعة 8 صباحًا.',
    questions: [
      { label: '1)', text: 'أجرِ القسمة الإقليدية للعدد 350 على 16. كم باقة كاملة يشكّل البائع؟ وكم زهرة تبقى؟' },
      { label: '2)', text: 'كم زهرة يجب أن يضيف البائع على الأقل ليشكّل باقة أخرى دون أن تبقى أيّ زهرة؟ وكم باقة يصبح عنده؟' },
      { label: '3)', text: 'باع البائع كل الباقات. ما المبلغ الذي تحصّل عليه؟' },
    ],
    illustration: { kind: 'tags', cards: [{ title: 'الأزهار', icon: 'plant', lines: [{ label: 'العدد', value: 350, unit: 'زهرة' }] }, { title: 'الباقة الواحدة', icon: 'plant', lines: [{ label: 'فيها', value: 16, unit: 'زهرة' }, { label: 'ثمنها', value: 450, unit: 'دج' }] }], ariaLabel: 'بطاقتان: 350 زهرة، والباقة الواحدة فيها 16 زهرة وثمنها 450 دج' },
  },
  knowledgeMap: true,
  knowledgeMapMode: 'progressive',
  // Ce que « أستعدّ » diagnostique : la division du primaire (manuel p. 36, item 8) et l'item du réseau `1am.m1.r01`
  // (جمع، طرح وضرب أعداد طبيعية — leçon « معنى الجمع والطرح »).
  priorKnowledge: ['qisma-ibtidai', 'darb-tabii', 'tarh-tabii'],
  resources: [
    // Module 1 — WORKSPACE À DEUX NIVEAUX, un seul type `division-jumps` :
    //   مبتدئ — 47 fleurs dessinées, des bouquets de 6 (plateforme) : l'élève tire le ruban ; puis 48.
    //   متقدم — les 279 fleurs du manuel en bouquets de 14, sur la droite graduée (sauts de 14), sans multiples affichés.
    {
      kind: 'manipulation', code: 'division-jumps-flowers', type: 'division-jumps', module: 1,
      level: 'beginner',
      title: 'باقات العرفان: 47 زهرة',
      objective: 'الحاصل هو أكبر عدد من المجموعات الكاملة: نتوقّف عندما يصبح الباقي أصغر من المقسوم عليه، a = b × q + r مع r < b',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'garden' },
      learningPointIds: ['1am_qisma-iqlidiya-baqi_P1', '1am_qisma-iqlidiya-baqi_P2'],
      sourceElementIds: ['act-3'],
    },
    {
      kind: 'manipulation', code: 'division-jumps-279', type: 'division-jumps', module: 1,
      level: 'advanced',
      title: 'نشاط 3: 279 زهرة في باقات من 14',
      objective: 'الحاصل هو أكبر عدد من المجموعات الكاملة: نتوقّف عندما يصبح الباقي أصغر من المقسوم عليه، a = b × q + r مع r < b',
      autonomy: 'أعداد الكتاب الكبيرة على مستقيم مدرّج بقفزات من 14 دون كتابة المضاعفات: يقدّر التلميذ بنفسه عدد القفزات (10؟ 20؟) ويحصر 279 بين مضاعفين متتاليين',
      experience: { type: 'textbook', reason: '' },
      learningPointIds: ['1am_qisma-iqlidiya-baqi_P1', '1am_qisma-iqlidiya-baqi_P2'],
      sourceElementIds: ['act-3'],
    },
    // Module 2 — l'exemple de معارف 2 (253 perles, colliers de 17) dans le MÊME instrument, sur la droite, posé seul.
    {
      kind: 'manipulation', code: 'division-jumps-253', type: 'division-jumps', module: 2,
      title: 'مثال الكتاب: 253 لؤلؤة في عقود من 17',
      learningPointIds: ['1am_qisma-iqlidiya-baqi_P2'],
      sourceElementIds: ['know-2'],
    },
    { kind: 'situation', code: 'masala-1', module: 5, title: 'مسألة الدرس — بائع الزهور: 350 زهرة', learningPointIds: ['1am_qisma-iqlidiya-baqi_P1', '1am_qisma-iqlidiya-baqi_P2', '1am_qisma-iqlidiya-baqi_P3'] },
    { kind: 'situation', code: 'masala-2', module: 6, title: 'مسألة — حافلات المخيّم الكشفي', learningPointIds: ['1am_qisma-iqlidiya-baqi_P1', '1am_qisma-iqlidiya-baqi_P3'] },
    { kind: 'situation', code: 'masala-3', module: 7, title: 'مسألة — حملة التشجير: 75 يومًا', learningPointIds: ['1am_qisma-iqlidiya-baqi_P1', '1am_qisma-iqlidiya-baqi_P2', '1am_qisma-iqlidiya-baqi_P3'] },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'أربع عبارات: صحيح أم خاطئ؟ الضرب والطرح، وأكبر عدد من الباقات.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'nashat', path: `${LESSON_BASE_PATH}/nashat`,
      title: 'نشاط 3 — باقات الزهور', desc: 'كم باقة كاملة؟ ومتى نتوقّف؟ اسحب الشريط واكتشف.',
      stage: 'trigger', teachesLearningPointIds: ['1am_qisma-iqlidiya-baqi_P1'],
      color: 'indigo', style: 'featured', estimatedMin: 12, difficulty: 1, actionText: 'أجرّب' },
    { id: '02', number: 2, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`,
      title: 'معارف — القسمة الإقليدية', desc: 'المقسوم، المقسوم عليه، الحاصل والباقي، والقسمة العمودية.',
      stage: 'discovery', teachesLearningPointIds: ['1am_qisma-iqlidiya-baqi_P1', '1am_qisma-iqlidiya-baqi_P2'],
      color: 'violet', style: 'featured', estimatedMin: 12, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'atamarran', path: `${LESSON_BASE_PATH}/atamarran`,
      title: 'أتمرّن', desc: 'تمارين الكتاب 15 إلى 19: حصر، قسمات، وأخطاء نصحّحها.',
      stage: 'practice_lab', teachesLearningPointIds: ['1am_qisma-iqlidiya-baqi_P1', '1am_qisma-iqlidiya-baqi_P2'],
      color: 'amber', style: 'featured', estimatedMin: 10, difficulty: 2, actionText: 'أتدرّب' },
    { id: '04', number: 4, slug: 'masail-kitab', path: `${LESSON_BASE_PATH}/masail-kitab`,
      title: 'مسائل الكتاب والآلة الحاسبة', desc: 'البيض في آخر طبق، يوم الميلاد، والباقي على الآلة الحاسبة.',
      stage: 'practice_lab', teachesLearningPointIds: ['1am_qisma-iqlidiya-baqi_P1', '1am_qisma-iqlidiya-baqi_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 2, actionText: 'أتدرّب' },
    { id: '05', number: 5, slug: 'masala-1', path: `${LESSON_BASE_PATH}/masala-1`,
      title: 'مسألة 1 — بائع الزهور', desc: 'مسألة الدرس: 350 زهرة، باقات من 16، وما ينقص لباقة أخرى.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['1am_qisma-iqlidiya-baqi_P1', '1am_qisma-iqlidiya-baqi_P2', '1am_qisma-iqlidiya-baqi_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '06', number: 6, slug: 'masala-2', path: `${LESSON_BASE_PATH}/masala-2`,
      title: 'مسألة 2 — حافلات المخيّم', desc: 'كم حافلة؟ وماذا يعني الباقي؟ وكم مقعدًا يبقى شاغرًا؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['1am_qisma-iqlidiya-baqi_P1', '1am_qisma-iqlidiya-baqi_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '07', number: 7, slug: 'masala-3', path: `${LESSON_BASE_PATH}/masala-3`,
      title: 'مسألة 3 — حملة التشجير', desc: 'أسابيع كاملة وأيام زائدة، ثم صفوف من الشجيرات.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['1am_qisma-iqlidiya-baqi_P1', '1am_qisma-iqlidiya-baqi_P2', '1am_qisma-iqlidiya-baqi_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '08', number: 8, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'خمسة أسئلة تُقيّم الكفاءات الثلاث.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 6, difficulty: 2, actionText: 'أدخل التقويم' },
  ],
};
