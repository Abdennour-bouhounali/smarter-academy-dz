/**
 * الدرس 2 — قواسم عدد طبيعي
 * Manuel 4AM, unité 1 : activité 2 (p. 8), معارف 1 (p. 10), طريقة « تعيين قواسم عدد طبيعي » (p. 11),
 * exercices 3, 4, 6, 7, 8, 9, 11 (p. 14). Source : docs/sources/4am/unit1/extraction.json.
 * puis trois « مسائل » de la plateforme (modules 4–6).
 *
 * CONCEPTION (LESSON_DEVELOPMENT_GUIDE §4ter, rétrofit du 2026-10-15) — le manuel fixe les الكفاءات, pas le parcours.
 *   Entrée retenue : la bibliothèque, des livres rangés en rayons (labo `factor-pairs`, niveau مبتدئ 24 puis متقدم 60) — la main
 *   allonge le rayon et seul un rectangle PARFAIT est gardé : chaque rectangle livre deux diviseurs, et la règle d'arrêt se VIT
 *   (le rectangle se couche). C'est elle qui remplace le tableau à compléter de l'activité 2 ; rejetée : l'activité du manuel telle
 *   quelle (écrire 60 = a × b de tête dans un tableau, puis lire les diviseurs) — c'est un formulaire, la main ne décide rien ;
 *   le nombre 60, les deux sous-questions et 48 / 17 restent dans le labo (niveau متقدم) et les étapes 2–3.
 *   Ordre des idées : un rectangle parfait donne DEUX diviseurs (brique APRÈS la réponse) → tous les diviseurs de 60 → 48 et 17 →
 *   module 2 (105) : un diviseur reçu « gratuitement » comme partenaire → jusqu'où tester AVANT tout calcul → la méthode du
 *   manuel lue ligne à ligne (après) → les règles de divisibilité qui accélèrent (brique après).
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
  // « مسألة الدرس » : montrée dès le sommaire, rappelée au module 1, résolue
  // pas à pas au module 4 (content/problems.js). Prolonge le niveau متقدم du
  // module 1 : les mêmes livres en rangées formant un rectangle parfait.
  lessonProblem: {
    module: 4,
    title: 'جدار المكتبة: 96 كتابًا في صفوف متساوية',
    statement: 'حرصًا على نشر حبّ القراءة بين التلاميذ، تلقّت مكتبة المتوسطة 96 كتابًا جديدًا هديّةً من بلدية المدينة، ويريد القيّم، إتقانًا لعمله، عرضها على جدار المكتبة في صفوف متساوية: كل صفّ يحمل العدد نفسه من الكتب، فتشكّل الكتب مستطيلًا تامًّا دون صفّ ناقص. يوضع كل صفّ على رفّ عرض. في المخزن نوعان من رفوف العرض: رفّ قصير يتّسع لـ 12 كتابًا على الأكثر ثمنه 1400 دج، ورفّ طويل يتّسع لـ 20 كتابًا على الأكثر ثمنه 2200 دج. يدوم معرض الكتب 3 أسابيع.',
    illustration: { kind: 'tags', cards: [{ title: 'رفّ قصير', icon: 'book', lines: [{ label: 'يتّسع لـ', value: 12, unit: 'كتابًا' }, { label: 'الثمن', value: 1400, unit: 'دج' }] }, { title: 'رفّ طويل', icon: 'book', lines: [{ label: 'يتّسع لـ', value: 20, unit: 'كتابًا' }, { label: 'الثمن', value: 2200, unit: 'دج' }] }], ariaLabel: 'رفّان للعرض: قصير يتّسع لـ 12 كتابًا بـ 1400 دج وطويل يتّسع لـ 20 كتابًا بـ 2200 دج' },
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
      experience: { type: 'platform_context', reason: 'platform_designed_entry', theme: 'library' },
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
    // Modules 4–6 — les « مسائل » : exercices complets de type امتحان, ajouts
    // de la plateforme (content/problems.js), sans aucune preuve de maîtrise.
    { kind: 'situation', code: 'masala-1', module: 4, title: 'مسألة الدرس — جدار المكتبة: 96 كتابًا', learningPointIds: ['4am_qawasim-adad-tabii_P1', '4am_qawasim-adad-tabii_P2', '4am_qawasim-adad-tabii_P3', '4am_qawasim-adad-tabii_P4'] },
    { kind: 'situation', code: 'masala-2', module: 5, title: 'مسألة — المخيّم الكشفي: 135 كشّافًا', learningPointIds: ['4am_qawasim-adad-tabii_P1', '4am_qawasim-adad-tabii_P2', '4am_qawasim-adad-tabii_P3', '4am_qawasim-adad-tabii_P4'] },
    { kind: 'situation', code: 'masala-3', module: 6, title: 'مسألة — حلوى العرس: 90 حبّة مقروط', learningPointIds: ['4am_qawasim-adad-tabii_P1', '4am_qawasim-adad-tabii_P2', '4am_qawasim-adad-tabii_P3', '4am_qawasim-adad-tabii_P4'] },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'ست عبارات: صحيح أم خاطئ؟ معنى «قاسم» وقواعد قابلية القسمة.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
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
    // Les « مسائل » (track: 'problem') : practice_lab, avant le test, qui
    // reste toujours ouvert. Elles comptent dans la complétion, jamais dans
    // la maîtrise — docs/architecture/LESSON_CONTRACT.md § Modules « مسائل ».
    { id: '04', number: 4, slug: 'masala-1', path: `${LESSON_BASE_PATH}/masala-1`,
      title: 'مسألة 1 — جدار المكتبة', desc: 'مسألة الدرس: 96 كتابًا في صفوف متساوية ونوعان من الرفوف. حلّ كامل خطوة بخطوة.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_qawasim-adad-tabii_P1', '4am_qawasim-adad-tabii_P2', '4am_qawasim-adad-tabii_P3', '4am_qawasim-adad-tabii_P4'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '05', number: 5, slug: 'masala-2', path: `${LESSON_BASE_PATH}/masala-2`,
      title: 'مسألة 2 — المخيّم الكشفي', desc: '135 كشّافًا في مجموعات متساوية: كم مجموعة؟ وكم يدفع كل كشّاف؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_qawasim-adad-tabii_P1', '4am_qawasim-adad-tabii_P2', '4am_qawasim-adad-tabii_P3', '4am_qawasim-adad-tabii_P4'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '06', number: 6, slug: 'masala-3', path: `${LESSON_BASE_PATH}/masala-3`,
      title: 'مسألة 3 — حلوى العرس', desc: '90 حبّة مقروط في علب متماثلة، ثم حبّة مكسورة: هل تبقى العلب ممكنة؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_qawasim-adad-tabii_P1', '4am_qawasim-adad-tabii_P2', '4am_qawasim-adad-tabii_P3', '4am_qawasim-adad-tabii_P4'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '07', number: 7, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'ست أسئلة تُقيّم الكفاءات الأربع.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 9, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
