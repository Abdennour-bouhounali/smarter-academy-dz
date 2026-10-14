/**
 * الدرس — قواعد قابلية القسمة (1AM, unité 3 « الحساب على الأعداد الطبيعية والأعداد العشرية: الضرب والقسمة »).
 * Manuel 1AM (الجيل الثاني) : نشاط 4 pp. 37–38, معارف 3 p. 41, طريقة p. 42 (÷4) et son دوري الآن, exercices 22–26 et 32
 * p. 46, le تحدّ de l'unité (p. 35) et أتعمّق 8 (p. 48) : l'année bissextile ; أقوّم تعلّماتي 12 p. 47 au إختبار أولي.
 * La règle de 9 (exercice 23) est une formalisation DÉCLARÉE de la plateforme. Généré DANS son entrée du catalogue
 * (item 1am.m3.r02), cycle moyen phase 3, 2026-10-14. Source : docs/sources/1am/unit3/extraction.json.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/1am/ansab_al_aadad_wal_hisab/qawaid-qabiliyat-qisma';

export const LESSON_CONFIG = {
  id: 'qawaid-qabiliyat-qisma',
  kind: 'lesson',
  unit: 'darb-qisma-ashriya',
  unitTitle: 'الحساب على الأعداد الطبيعية والأعداد العشرية: الضرب والقسمة',
  sequentialUnlock: true,
  title: 'قواعد قابلية القسمة',
  description: 'نعرف دون أن نقسم إن كان عدد يقبل القسمة على 2 أو 5 (رقم آحاده)، على 3 أو 9 (مجموع أرقامه)، على 4 (العدد المشكّل من رقميه الأخيرين)، ونعبّر عن ذلك بباقي قسمة إقليدية معدوم.',
  level: 'moyen',
  grade: '1am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان الأنشطة العددية',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🔎',
  estimatedDurationMin: 86,
  textbookRef: { unit: 3, activity: 4, pages: '35, 36, 37, 38, 41, 42, 46, 47, 48' },
  skills: [
    'التعرّف على عدد يقبل القسمة على 2 أو على 5 من خلال رقم آحاده',
    'التعرّف على عدد يقبل القسمة على 3 أو على 9 من خلال مجموع أرقامه',
    'التعرّف على عدد يقبل القسمة على 4 من خلال العدد المشكّل من رقميه الأخيرين',
    'التعبير عن «a يقبل القسمة على b» بباقي قسمة إقليدية معدوم',
  ],
  teachingScope: {
    include: ['قواعد قابلية القسمة على 2، 3، 4، 5، 9', 'قابلية القسمة ⇔ باقي القسمة الإقليدية معدوم', 'السنة الكبيسة: قابلية القسمة على 4 (واستثناء القرون)'],
    exclude: ['القسمة العشرية والقيمة المقرّبة (درس لاحق)', 'قواسم عدد والقاسم المشترك الأكبر (السنة الرابعة)'],
  },
  // « مسألة الدرس » : elle prolonge le niveau متقدم (des cartes de chiffres, d'autres chiffres), résolue au module 6.
  lessonProblem: {
    module: 6,
    title: 'الرمز السرّي لخزانة النادي',
    statement: 'يختار أعضاء نادي العلوم رمزًا سرّيًا لخزانة أدواتهم المشتركة، أمانةً على ما فيها. يُكتب الرمز بالبطاقات 2 ، 7 ، 5 ، 1 كلّها ودون تكرار. في النادي 14 عضوًا.',
    questions: [
      { label: '1)', text: 'ما أكبر رمز يمكن تشكيله ويقبل القسمة على 5؟ علّل.' },
      { label: '2)', text: 'بيّن أنّ كل رمز يمكن تشكيله يقبل القسمة على 3. هل يقبل أحدها القسمة على 9؟' },
      { label: '3)', text: 'ما أكبر رمز يمكن تشكيله ويقبل القسمة على 4؟' },
    ],
    illustration: { kind: 'tags', cards: [{ title: 'بطاقات الرمز', icon: 'ticket', lines: [{ label: 'البطاقة الأولى', value: 2 }, { label: 'البطاقة الثانية', value: 7 }] }, { title: 'بطاقات الرمز', icon: 'ticket', lines: [{ label: 'البطاقة الثالثة', value: 5 }, { label: 'البطاقة الرابعة', value: 1 }] }], ariaLabel: 'أربع بطاقات للرمز السرّي: 2 ، 7 ، 5 ، 1' },
  },
  knowledgeMap: true,
  knowledgeMapMode: 'progressive',
  // Ce que « أستعدّ » diagnostique : la notion de multiple (manuel p. 36, item 10) et l'item du réseau `1am.m3.r01`
  // (القسمة الإقليدية — la leçon précédente).
  priorKnowledge: ['mudaaf-ibtidai', 'qisma-iqlidiya-baqi'],
  resources: [
    // Module 1 — WORKSPACE À DEUX NIVEAUX, un seul type `digit-cards`, le manuel aux deux niveaux :
    //   مبتدئ — la table 0–48 en 7 colonnes du نشاط 4 : colorier les multiples de 2, 5 puis 3, chaque case jugée par son reste.
    //   متقدم — les cartes 4, 5, 9, 3 de l'exercice 26 : former des nombres, juger cinq divisibilités, l'impossible pour 4 et 9.
    {
      kind: 'manipulation', code: 'digit-cards-grid', type: 'digit-cards', module: 1,
      level: 'beginner',
      title: 'نشاط 4: جدول الأعداد من 0 إلى 48',
      objective: 'قابلية القسمة تُقرأ دون إجراء القسمة: رقم الآحاد للقسمة على 2 و 5، مجموع الأرقام للقسمة على 3 و 9، الرقمان الأخيران للقسمة على 4؛ أي باقٍ معدوم',
      autonomy: '',
      experience: { type: 'textbook', reason: '' },
      learningPointIds: ['1am_qawaid-qabiliyat-qisma_P1', '1am_qawaid-qabiliyat-qisma_P2', '1am_qawaid-qabiliyat-qisma_P4'],
      sourceElementIds: ['act-4'],
    },
    {
      kind: 'manipulation', code: 'digit-cards-4593', type: 'digit-cards', module: 1,
      level: 'advanced',
      title: 'تمرين 26: البطاقات 4 ، 5 ، 9 ، 3',
      objective: 'قابلية القسمة تُقرأ دون إجراء القسمة: رقم الآحاد للقسمة على 2 و 5، مجموع الأرقام للقسمة على 3 و 9، الرقمان الأخيران للقسمة على 4؛ أي باقٍ معدوم',
      autonomy: 'يشكّل التلميذ بنفسه الأعداد بأربع بطاقات، ويحكم على خمس قابليات قسمة قبل أن يرى الباقي، ويقرّر متى يكون المطلوب مستحيلًا (على 4 وعلى 9)',
      experience: { type: 'textbook', reason: '' },
      learningPointIds: ['1am_qawaid-qabiliyat-qisma_P1', '1am_qawaid-qabiliyat-qisma_P2', '1am_qawaid-qabiliyat-qisma_P3'],
      sourceElementIds: ['ex-26'],
    },
    { kind: 'situation', code: 'masala-1', module: 6, title: 'مسألة الدرس — الرمز السرّي لخزانة النادي', learningPointIds: ['1am_qawaid-qabiliyat-qisma_P1', '1am_qawaid-qabiliyat-qisma_P2', '1am_qawaid-qabiliyat-qisma_P3'] },
    { kind: 'situation', code: 'masala-2', module: 7, title: 'مسألة — قفّة رمضان: 2340 علبة تمر', learningPointIds: ['1am_qawaid-qabiliyat-qisma_P1', '1am_qawaid-qabiliyat-qisma_P2', '1am_qawaid-qabiliyat-qisma_P3', '1am_qawaid-qabiliyat-qisma_P4'] },
    { kind: 'situation', code: 'masala-3', module: 8, title: 'مسألة — رزنامة نادي الفلك', learningPointIds: ['1am_qawaid-qabiliyat-qisma_P3', '1am_qawaid-qabiliyat-qisma_P4'] },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'أربع عبارات: صحيح أم خاطئ؟ المضاعفات والقسمة الإقليدية.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'nashat', path: `${LESSON_BASE_PATH}/nashat`,
      title: 'نشاط 4 — جدول الأعداد', desc: 'لوّن المضاعفات وانظر إلى أرقامها: ما الذي يكفي لنعرف دون أن نقسم؟',
      stage: 'trigger', teachesLearningPointIds: ['1am_qawaid-qabiliyat-qisma_P1', '1am_qawaid-qabiliyat-qisma_P2'],
      color: 'indigo', style: 'featured', estimatedMin: 12, difficulty: 1, actionText: 'أجرّب' },
    { id: '02', number: 2, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`,
      title: 'معارف — قواعد قابلية القسمة', desc: 'على 2 و 5، على 3 و 9، ومعنى «يقبل القسمة».',
      stage: 'discovery', teachesLearningPointIds: ['1am_qawaid-qabiliyat-qisma_P1', '1am_qawaid-qabiliyat-qisma_P2', '1am_qawaid-qabiliyat-qisma_P4'],
      color: 'violet', style: 'featured', estimatedMin: 12, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'tariqa', path: `${LESSON_BASE_PATH}/tariqa`,
      title: 'طريقة — قابلية القسمة على 4', desc: 'حبّات الحلوى في 4 أكياس: لماذا يكفي الرقمان الأخيران؟',
      stage: 'formalization', teachesLearningPointIds: ['1am_qawaid-qabiliyat-qisma_P3'],
      color: 'emerald', style: 'featured', estimatedMin: 10, difficulty: 2, actionText: 'أتعلّم الطريقة' },
    { id: '04', number: 4, slug: 'atamarran', path: `${LESSON_BASE_PATH}/atamarran`,
      title: 'أتمرّن', desc: 'تمارين الكتاب 22 ، 23 ، 24 ، 26 و 32.',
      stage: 'practice_lab', teachesLearningPointIds: ['1am_qawaid-qabiliyat-qisma_P1', '1am_qawaid-qabiliyat-qisma_P2', '1am_qawaid-qabiliyat-qisma_P3', '1am_qawaid-qabiliyat-qisma_P4'],
      color: 'amber', style: 'featured', estimatedMin: 10, difficulty: 2, actionText: 'أتدرّب' },
    { id: '05', number: 5, slug: 'sana-kabisa', path: `${LESSON_BASE_PATH}/sana-kabisa`,
      title: 'تحدّي الوحدة — السنة الكبيسة', desc: 'كيف نعرف أنّ سنة كبيسة؟ القسمة على 4، واستثناء القرون.',
      stage: 'practice_lab', teachesLearningPointIds: ['1am_qawaid-qabiliyat-qisma_P3'],
      color: 'rose', style: 'featured', estimatedMin: 6, difficulty: 3, actionText: 'أرفع التحدّي' },
    { id: '06', number: 6, slug: 'masala-1', path: `${LESSON_BASE_PATH}/masala-1`,
      title: 'مسألة 1 — الرمز السرّي', desc: 'مسألة الدرس: أكبر رمز يقبل القسمة على 5، على 3، على 4.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['1am_qawaid-qabiliyat-qisma_P1', '1am_qawaid-qabiliyat-qisma_P2', '1am_qawaid-qabiliyat-qisma_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '07', number: 7, slug: 'masala-2', path: `${LESSON_BASE_PATH}/masala-2`,
      title: 'مسألة 2 — قفّة رمضان', desc: 'هل توزَّع العلب بالتساوي؟ وماذا يتغيّر بعد إضافة 15 علبة؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['1am_qawaid-qabiliyat-qisma_P1', '1am_qawaid-qabiliyat-qisma_P2', '1am_qawaid-qabiliyat-qisma_P3', '1am_qawaid-qabiliyat-qisma_P4'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '08', number: 8, slug: 'masala-3', path: `${LESSON_BASE_PATH}/masala-3`,
      title: 'مسألة 3 — رزنامة نادي الفلك', desc: 'سنوات كبيسة وغير كبيسة، وعدد الأيام.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['1am_qawaid-qabiliyat-qisma_P3', '1am_qawaid-qabiliyat-qisma_P4'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '09', number: 9, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'خمسة أسئلة تُقيّم الكفاءات الأربع.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 6, difficulty: 2, actionText: 'أدخل التقويم' },
  ],
};
