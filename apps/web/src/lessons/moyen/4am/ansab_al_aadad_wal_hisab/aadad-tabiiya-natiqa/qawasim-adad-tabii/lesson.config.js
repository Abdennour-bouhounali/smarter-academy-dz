/**
 * الدرس 2 — قواسم عدد طبيعي
 * Manuel 4AM, unité 1 : activité 2 (p. 8), معارف 1 (p. 10), طريقة « تعيين قواسم عدد طبيعي » (p. 11),
 * exercices 3, 4, 6, 7, 8, 9, 11 (p. 14). Source : docs/sources/4am/unit1/extraction.json.
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/qawasim-adad-tabii';

export const LESSON_CONFIG = {
  id: 'qawasim-adad-tabii',
  kind: 'lesson',
  unit: 'aadad-tabiiya-natiqa',
  unitTitle: 'الأعداد الطبيعيّة والأعداد النّاطقة',
  sequentialUnlock: true,
  title: 'قواسم عدد طبيعي',
  description: 'تعيين كل قواسم عدد طبيعي بكتابته على شكل جداء عاملين بكل الأشكال الممكنة، وبطريقة اختبار الأعداد التي مربعها أصغر من العدد أو يساويه.',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🧮',
  estimatedDurationMin: 50,
  textbookRef: { unit: 1, activity: 2, pages: '8, 10, 11, 14' },
  skills: [
    'كتابة عدد طبيعي على شكل جداء عاملين بكل الأشكال الممكنة',
    'استنتاج كل قواسم عدد طبيعي من كتاباته على شكل جداء عاملين',
    'تعيين قواسم عدد طبيعي باختبار الأعداد التي مربعها أصغر من العدد أو يساويه',
    'توظيف قواعد قابلية القسمة على 2 و3 و4 و5 و9 في البحث عن القواسم',
  ],
  teachingScope: {
    include: ['كتابة عدد على شكل جداء عاملين واستنتاج قواسمه', 'طريقة الكتاب: اختبار الأعداد التي مربعها ≤ العدد، وقواعد قابلية القسمة'],
    exclude: ['التحليل إلى عوامل أولية (موضوع رسمي آخر)', 'القواسم المشتركة (الدرس 4)'],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Acquis du درس 1 (rappelés par une brique « rappel ») et des années antérieures.
  priorKnowledge: ['qasim-jidaa', 'qawaid-qabiliyat-al-qisma'],
  resources: [
    // Workspace à deux niveaux (module 1). Le contexte du manuel — le
    // rectangle de points — est GARDÉ aux deux niveaux : il est déjà
    // manipulable et le dessin EST l'argument (n = d × e ⇔ rectangle
    // parfait). Forcer un thème ici rendrait la mathématique moins claire
    // (brief §11). Ce qui change est la DEMANDE : 24 se lit d'un regard,
    // 60 exige la règle d'arrêt.
    { kind: 'manipulation', code: 'factor-pairs-24', type: 'factor-pairs', module: 1,
      level: 'beginner',
      title: 'قواسم العدد 24 بجداءات عاملين',
      objective: 'قواسم عدد تأتي أزواجًا d × (a ÷ d) ولا حاجة للاختبار بعد الجذر',
      autonomy: '',
      experience: { type: 'platform_adaptation', reason: 'smaller_numbers_for_first_contact', theme: 'library' },
      learningPointIds: ['4am_qawasim-adad-tabii_P1'], sourceElementIds: ['act-2'] },
    { kind: 'manipulation', code: 'factor-pairs-60', type: 'factor-pairs', module: 1,
      level: 'advanced',
      title: 'قواسم العدد 60 بجداءات عاملين',
      objective: 'قواسم عدد تأتي أزواجًا d × (a ÷ d) ولا حاجة للاختبار بعد الجذر',
      autonomy: 'أعداد أكبر ومجال اختبار أطول: التلميذ يقرّر بنفسه متى يتوقّف',
      experience: { type: 'textbook', reason: '', theme: 'library' },
      learningPointIds: ['4am_qawasim-adad-tabii_P1', '4am_qawasim-adad-tabii_P2'], sourceElementIds: ['act-2'] },
    { kind: 'method', code: 'method-divisors-105', module: 2, title: 'طريقة: للبحث عن قواسم عدد طبيعي a',
      learningPointIds: ['4am_qawasim-adad-tabii_P3', '4am_qawasim-adad-tabii_P4'], sourceElementIds: ['method-divisors'] },
  ],
  modules: [
    { id: '01', number: 1, slug: 'al-adad-60', path: `${LESSON_BASE_PATH}/al-adad-60`,
      title: 'نشاط 2 — قواسم العدد 60', desc: 'اكتب 60 على شكل جداء عاملين بكل الأشكال الممكنة، واستنتج قواسمه.',
      stage: 'trigger', teachesLearningPointIds: ['4am_qawasim-adad-tabii_P1', '4am_qawasim-adad-tabii_P2'],
      color: 'indigo', style: 'featured', estimatedMin: 12, difficulty: 1, actionText: 'أكتب الجداءات' },
    { id: '02', number: 2, slug: 'tariqa-105', path: `${LESSON_BASE_PATH}/tariqa-105`,
      title: 'طريقة — قواسم العدد 105', desc: 'إلى أي عدد نختبر؟ طريقة الكتاب مع 48 ثم 17 ثم 105.',
      stage: 'discovery', teachesLearningPointIds: ['4am_qawasim-adad-tabii_P3', '4am_qawasim-adad-tabii_P4'],
      color: 'violet', style: 'featured', estimatedMin: 14, difficulty: 2, actionText: 'أكتشف الطريقة' },
    { id: '03', number: 3, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'تمارين الكتاب 3، 4، 6، 7، 8، 9 و11.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_qawasim-adad-tabii_P2', '4am_qawasim-adad-tabii_P4'],
      color: 'amber', style: 'featured', estimatedMin: 15, difficulty: 2, actionText: 'أتدرّب' },
    { id: '04', number: 4, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'ست أسئلة تُقيّم نقاط التعلّم الأربع.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 9, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
