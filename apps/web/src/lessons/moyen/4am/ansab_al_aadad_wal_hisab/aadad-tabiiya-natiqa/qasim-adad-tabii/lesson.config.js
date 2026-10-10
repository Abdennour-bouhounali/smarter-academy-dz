/**
 * الدرس 1 — التعرّف على قاسم لعدد طبيعي
 * Unité 1 du manuel (4AM), activité 1 (p. 8), معارف 1 (p. 10), exercices 1, 2, 5 (p. 14),
 * puis trois « مسائل » de la plateforme (modules 4–6, pilote du 2026-10-05).
 * Source de vérité : docs/sources/4am/unit1/extraction.json.
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
  // Prolonge le rayon du niveau متقدم : mêmes rayons, d'autres nombres.
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
    //   متقدم  — les 420 livres du manuel : la situation d'origine, sans aide.
    //
    // `experience` porte la traçabilité exigée : d'où vient la mathématique
    // (toujours le manuel) et ce que la plateforme a fait de la situation.
    {
      kind: 'manipulation', code: 'team-builder-15-3', type: 'team-builder', module: 1,
      level: 'beginner',
      title: 'قسمة بالتساوي — 15 لاعبًا في 3 فرق',
      objective: 'التوزيع بالتساوي: a = b × q + r، والباقي معدوم ⇔ b قاسم لـ a',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'football' },
      learningPointIds: ['4am_qasim-adad-tabii_P1'],
      sourceElementIds: ['act-1'],
    },
    {
      kind: 'manipulation', code: 'divisor-explorer-420', type: 'divisor-explorer-books', module: 1,
      level: 'advanced',
      title: 'هل هو قاسم؟ — رفّ يمدّه التلميذ لـ 420 كتابًا',
      objective: 'التوزيع بالتساوي: a = b × q + r، والباقي معدوم ⇔ b قاسم لـ a',
      autonomy: 'التلميذ يمدّ الرفّ بنفسه من 10 إلى 60 كتابًا دون أحجام مقترحة، ويقرّر متى تفرغ الأرض؛ العدد المختار هنا حجم المجموعة لا عدد المجموعات',
      experience: { type: 'textbook', reason: '', theme: 'library' },
      learningPointIds: ['4am_qasim-adad-tabii_P1', '4am_qasim-adad-tabii_P2'],
      sourceElementIds: ['act-1'],
    },
    // Module 2 (معارف) — l'exemple du manuel, dans le MÊME rayon qu'on
    // étire qu'au module 1. Un seul instrument pour toute la leçon. Un seul
    // niveau ici (`levels={false}` dans le module) — c'est un exemple
    // travaillé ; sa découverte est la symétrie 143 = 11 × 13 = 13 × 11.
    {
      kind: 'manipulation', code: 'divisor-explorer-143', type: 'divisor-explorer-books', module: 2,
      title: 'مثال الكتاب: 143 كتابًا — 11 ثم 13 في كل رفّ',
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
      title: 'أستعدّ', desc: 'ست عبارات من الكتاب: صحيح أم خاطئ؟ القسمة الإقليدية وقواعد قابلية القسمة.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'al-maktaba', path: `${LESSON_BASE_PATH}/al-maktaba`,
      title: 'نشاط 1 — 420 كتابًا في رفوف', desc: '26 كتابًا في كل رفّ أم 28؟ جرّب، ولاحظ الباقي.',
      stage: 'trigger', teachesLearningPointIds: ['4am_qasim-adad-tabii_P1'],
      color: 'indigo', style: 'featured', estimatedMin: 10, difficulty: 1, actionText: 'أجرّب' },
    { id: '02', number: 2, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`,
      title: 'معارف — قاسم عدد طبيعي', desc: 'تعريفان لنفس الفكرة، وأربع جمل لها نفس المعنى.',
      stage: 'discovery', teachesLearningPointIds: ['4am_qasim-adad-tabii_P2', '4am_qasim-adad-tabii_P3', '4am_qasim-adad-tabii_P4'],
      color: 'violet', style: 'featured', estimatedMin: 12, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'تمارين الكتاب 1، 2 و5.',
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
