/**
 * الدرس 1 — التعرّف على قاسم لعدد طبيعي
 * Unité 1 du manuel (4AM), activité 1 (p. 8), معارف 1 (p. 10), exercices 1, 2, 5 (p. 14).
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
  knowledgeMap: true,
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
      title: 'هل هو قاسم؟ — 420 كتابًا على الرفوف',
      objective: 'التوزيع بالتساوي: a = b × q + r، والباقي معدوم ⇔ b قاسم لـ a',
      autonomy: 'سبعة عشر حجمًا دون اقتراح: التلميذ يختار ويقارن محاولاته بنفسه',
      experience: { type: 'textbook', reason: '', theme: 'library' },
      learningPointIds: ['4am_qasim-adad-tabii_P1', '4am_qasim-adad-tabii_P2'],
      sourceElementIds: ['act-1'],
    },
    // Module 2 (معارف) — l'exemple du manuel, dans le MÊME laboratoire
    // illustré que le module 1. Un seul instrument pour toute la leçon :
    // l'élève le reconnaît au lieu d'en apprendre un second. Un seul niveau
    // ici — le module lit une définition, il ne rejoue pas la découverte.
    {
      kind: 'manipulation', code: 'divisor-explorer-143', type: 'divisor-explorer-books', module: 2,
      title: 'مثال الكتاب: 143 كتابًا في رفوف من 11',
      learningPointIds: ['4am_qasim-adad-tabii_P2'],
      sourceElementIds: ['know-1'],
    },
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
    { id: '04', number: 4, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إتقان', desc: 'خمس أسئلة تُقيّم نقاط التعلّم الأربع.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 7, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
