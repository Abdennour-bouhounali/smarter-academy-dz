/**
 * الدرس 3 (الوحدة 2) — حل المعادلة من الشكل x² = a
 * Manuel 4AM, unité 2 « الحساب على الجذور » : نشاط 3 (p. 20), معارف 3 (p. 22),
 * طرائق (p. 23), دوري الآن 2 (p. 23), تمارين 11–14 (p. 26),
 * QCM 4, 5, 6, 10, 11 (p. 28), أستعدّ item 3 (p. 19). (La وضعية p. 28 :
 * leçon de synthèse wadiya-idmajiya-judhur.)
 * puis trois « مسائل » de la plateforme (modules 4–6).
 * Source de vérité : docs/sources/4am/unit2/extraction.json.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/muadalat-x-murabba';

export const LESSON_CONFIG = {
  id: 'muadalat-x-murabba',
  kind: 'lesson',
  unit: 'hisab-judhur',
  unitTitle: 'الحساب على الجذور',
  sequentialUnlock: true,
  title: 'حل المعادلة من الشكل x² = a',
  description: 'عددان متعاكسان لهما نفس المربع، ومربع أي عدد موجب: لذلك تقبل المعادلة x² = a حلين متعاكسين √a و −√a إذا كان a > 0، حلا واحدا هو 0 إذا كان a = 0، ولا تقبل أي حل إذا كان a < 0. ثم حل معادلات تؤول إلى هذا الشكل.',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '⚖️',
  estimatedDurationMin: 52,
  textbookRef: { unit: 2, activity: 3, pages: '20, 22, 23, 26, 28' },
  skills: [
    'معرفة أن لعددين متعاكسين نفس المربع وأن مربع أي عدد هو عدد موجب',
    'تحديد عدد حلول المعادلة x² = a بحسب إشارة العدد a',
    'حل معادلة من الشكل x² = a بكتابتها على الشكل x² = (√a)²',
    'حل معادلات تؤول إلى الشكل x² = a',
  ],
  teachingScope: {
    include: [
      'خاصية 1: العددان المتعاكسان √a و −√a مربع كل منهما a، ومربع أي عدد موجب',
      'خاصية 2: حلول المعادلة x² = a حسب إشارة a (حلان متعاكسان، حل واحد 0، لا حل)',
      'طريقة حل المعادلة x² = a، ومعادلات تؤول إليها (دوري الآن، التمارين 11–14)',
    ],
    exclude: [
      'تبسيط الجذور وكتابة a√b (الدرسان 4 و 5)',
      'الجذر التربيعي لجداء أو حاصل قسمة (الدرس 4)',
      'المعادلات من الدرجة الثانية العامة (ax² + bx + c = 0)',
    ],
  },
  // « مسألة الدرس » : montrée dès le sommaire, rappelée à la fin du module 1,
  // résolue pas à pas au module 4 (content/problems.js). Prolonge la droite
  // qui se plie du niveau متقدم : mêmes cartes x² = a, d'autres nombres.
  lessonProblem: {
    module: 4,
    title: 'أسبوع العلوم: خمس بطاقات على المستقيم الذي ينطوي',
    statement: 'في أسبوع العلوم بالمتوسطة، نصب نادي العلوم ورشة «المستقيم الذي ينطوي»: يحرّك اللاعب العدد $x$ على مستقيم مدرّج، فيحمله سهم إلى مربّعه $x^2$ على مستقيم ثانٍ. شارك في الورشة 42 تلميذًا، وتدوم الجولة الواحدة 8 دقائق. سحبت سلمى خمس بطاقات: $x^2 = 64$ ، $x^2 = 0{,}09$ ، $x^2 = 11$ ، $x^2 = 0$ ، $x^2 = -36$. قبل التحقّق على المستقيم، يكتب اللاعب على ورقته حلول كل بطاقة، أو يكتب «لا تقبل أي حل». كل حل صحيح يربح 10 نقاط، وكل «لا تقبل أي حل» صحيحة تربح 15 نقطة، وكل عدد خاطئ يُفقد 5 نقاط. على ورقة سلمى: للبطاقة $x^2 = 64$ العددان 8 و $-8$، وللبطاقة $x^2 = 0{,}09$ العدد $0{,}3$، وللبطاقة $x^2 = 11$ العددان $3{,}3$ و $-3{,}3$، وللبطاقة $x^2 = 0$ العدد 0، وللبطاقة $x^2 = -36$ العدد $-6$.',
  },
  knowledgeMap: true,
  knowledgeMapMode: 'progressive',
  // Ce que « أستعدّ » diagnostique : carré d'un nombre (et opposé), √ (leçon 1), équations du 1er degré.
  priorKnowledge: ['murabba-adad', 'jidhr-taarif', 'muadala-daraja-ula'],
  resources: [
    // Module 1 — WORKSPACE À DEUX NIVEAUX, la droite qui se plie (square-fold).
    //   مبتدئ  — x² = 9 (مراد), 0 et −9, graduation 1/2 : le tableau du manuel
    //            (−3/2 … 2) se remplit par les positions essayées.
    //   متقدم  — les cinq équations de la question 2 ب, graduation 1/10, sans tableau.
    // Les deux niveaux portent les NOMBRES DU MANUEL (نشاط 3) : aucune adaptation.
    {
      kind: 'manipulation', code: 'square-fold-9-0-m9', type: 'square-fold', module: 1,
      level: 'beginner',
      title: 'المستقيم الذي ينطوي — x² = 9 ، x² = 0 ، x² = −9',
      objective: 'عدد حلول المعادلة x² = a يتعلّق بإشارة a: حلان متعاكسان √a و −√a، أو حل واحد 0، أو لا حل',
      autonomy: '',
      experience: { type: 'textbook', reason: '', theme: '' },
      learningPointIds: ['4am_muadalat-x-murabba_P1'],
      sourceElementIds: ['act-3'],
    },
    {
      kind: 'manipulation', code: 'square-fold-act3-2b', type: 'square-fold', module: 1,
      level: 'advanced',
      title: 'المستقيم الذي ينطوي — x² = 25 ، 3 ، 0 ، 0,04 ، −9',
      objective: 'عدد حلول المعادلة x² = a يتعلّق بإشارة a: حلان متعاكسان √a و −√a، أو حل واحد 0، أو لا حل',
      autonomy: 'خمس معادلات الكتاب دون جدول مساعد وبتدريجة 1/10: على التلميذ أن يجد بنفسه الحل الثاني لكل معادلة، وأن يقرّر متى لا يوجد حل، وأن يقترب من √3 التي لا تقع على أي تدريجة',
      experience: { type: 'textbook', reason: '', theme: '' },
      learningPointIds: ['4am_muadalat-x-murabba_P1'],
      sourceElementIds: ['act-3'],
    },
    // Module 2 (معارف) — les trois exemples de la خاصية 2 dans le même instrument :
    // un EXEMPLE TRAVAILLÉ, un seul niveau (`levels={false}`).
    {
      kind: 'manipulation', code: 'square-fold-know3', type: 'square-fold', module: 2,
      title: 'أمثلة الكتاب: x² = 9 ، x² = 5 ، x² = −1',
      learningPointIds: ['4am_muadalat-x-murabba_P1'],
      sourceElementIds: ['know-3'],
    },
    // Modules 4–6 — les « مسائل » : exercices complets de type امتحان, ajouts
    // de la plateforme (content/problems.js), sans aucune preuve de maîtrise.
    { kind: 'situation', code: 'masala-1', module: 4, title: 'مسألة الدرس — بطاقات سلمى على المستقيم الذي ينطوي', learningPointIds: ['4am_muadalat-x-murabba_P1'] },
    { kind: 'situation', code: 'masala-2', module: 5, title: 'مسألة — ساحة ألعاب مربّعة: الضلع والسياج', learningPointIds: ['4am_muadalat-x-murabba_P1'] },
    { kind: 'situation', code: 'masala-3', module: 6, title: 'مسألة — حبل تثبيت الهوائي: على أيّ ارتفاع يُربط؟', learningPointIds: ['4am_muadalat-x-murabba_P1', '4am_muadalat-x-murabba_P2'] },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'ست عبارات: صحيح أم خاطئ؟ مربع عدد ومعاكسه، الجذر التربيعي، المعادلات من الدرجة الأولى.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'nashat', path: `${LESSON_BASE_PATH}/nashat`,
      title: 'نشاط 3 — مراد وعمر: كم حلا للمعادلة؟', desc: 'حرّك x وتابع مربّعه: عددان متعاكسان لهما نفس المربع، ولا مربع سالب.',
      stage: 'trigger', teachesLearningPointIds: ['4am_muadalat-x-murabba_P1'],
      color: 'indigo', style: 'featured', estimatedMin: 14, difficulty: 2, actionText: 'أجرّب' },
    { id: '02', number: 2, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`,
      title: 'معارف — المعادلات من الشكل x² = a', desc: 'خاصيتان: العددان المتعاكسان √a و −√a، وثلاث حالات حسب إشارة a.',
      stage: 'discovery', teachesLearningPointIds: ['4am_muadalat-x-murabba_P1'],
      color: 'violet', style: 'featured', estimatedMin: 12, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي — أحل معادلات', desc: 'الطريقة، دوري الآن والتمارين 11–14.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_muadalat-x-murabba_P1', '4am_muadalat-x-murabba_P2'],
      color: 'amber', style: 'featured', estimatedMin: 13, difficulty: 3, actionText: 'أتدرّب' },
    // Les « مسائل » (track: 'problem') : practice_lab, avant le test, qui
    // reste toujours ouvert. Elles comptent dans la complétion, jamais dans
    // la maîtrise — docs/architecture/LESSON_CONTRACT.md § Modules « مسائل ».
    { id: '04', number: 4, slug: 'masala-1', path: `${LESSON_BASE_PATH}/masala-1`,
      title: 'مسألة 1 — بطاقات سلمى', desc: 'مسألة الدرس: خمس بطاقات x² = a، ورقة فيها أخطاء، وكم نقطة؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_muadalat-x-murabba_P1'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '05', number: 5, slug: 'masala-2', path: `${LESSON_BASE_PATH}/masala-2`,
      title: 'مسألة 2 — ساحة الألعاب', desc: 'ساحة مربّعة مساحتها 1225 m²: أيّ الحلّين طول ضلعها؟ وكم يكلّف السياج؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_muadalat-x-murabba_P1'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '06', number: 6, slug: 'masala-3', path: `${LESSON_BASE_PATH}/masala-3`,
      title: 'مسألة 3 — حبل تثبيت الهوائي', desc: 'حبل طوله 10 m: هل يُربط بالصاري على ارتفاع 9 m؟ ومتى يكون الوضع مستحيلًا؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_muadalat-x-murabba_P1', '4am_muadalat-x-murabba_P2'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '07', number: 7, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'خمسة أسئلة من «أؤكّد تعلّماتي» تُقيّم الكفاءتين.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 7, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
