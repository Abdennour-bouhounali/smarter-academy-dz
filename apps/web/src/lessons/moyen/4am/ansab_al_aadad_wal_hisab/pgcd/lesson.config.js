/**
 * قواسم عدد طبيعي والقاسم المشترك الأكبر (PGCD) — 4AM.
 *
 * PREMIÈRE leçon algérienne construite sur disque. Elle sert de référence
 * d'architecture pour les 27 autres (docs/ALGERIA_4AM_CURRICULUM.md §8).
 *
 * ── CE QUI N'A PAS ÉTÉ DÉCIDÉ ICI ──────────────────────────────────────
 * Le titre, la description, les prérequis, les 7 points d'apprentissage, la
 * durée et la difficulté viennent TELS QUELS de
 * `packages/core/curriculum/dz/lessons_4am_2026_2027.json`, fournis par le
 * propriétaire du projet (phase 7). Rien n'est reformulé ici : si un
 * intitulé devait changer, il changerait dans le JSON, pas dans ce fichier.
 *
 * ── CE QUI EST UNE CONSTRUCTION PÉDAGOGIQUE ────────────────────────────
 * Le DÉCOUPAGE EN MODULES, l'ordre des étapes et les situations choisies
 * sont une construction de cette phase, pas une prescription du programme
 * officiel — celui-ci s'arrête au niveau du sujet et ne fournit ni
 * progression ni répartition horaire (ALGERIA_4AM_CURRICULUM.md §0).
 *
 * NOTE VALIDATEUR (scripts/validate-lessons.mjs) : les ids de Learning Point
 * de `teachesLearningPointIds` et des métadonnées `assessment` doivent rester
 * des LITTÉRAUX. Les 7 LP de cette leçon (clé catalogue '4am_pgcd', dans
 * l'ordre du JSON source) :
 *
 *   4am_pgcd_P1   تعيين قواسم عدد طبيعي
 *   4am_pgcd_P2   تعيين القواسم المشتركة لعددين
 *   4am_pgcd_P3   فهم معنى القاسم المشترك الأكبر لعددين
 *   4am_pgcd_P4   حساب القاسم المشترك الأكبر باستعمال الفروق المتتالية
 *   4am_pgcd_P5   حساب القاسم المشترك الأكبر باستعمال خوارزمية أقليدس
 *   4am_pgcd_P6   التحقق من صحة حساب القاسم المشترك الأكبر
 *   4am_pgcd_P7   توظيف القاسم المشترك الأكبر في حل وضعية مشكلة
 *
 * ── LE FIL NARRATIF ────────────────────────────────────────────────────
 * « تقسيم عادل » — deux quantités qu'il faut répartir en paquets IDENTIQUES
 * sans rien laisser. La contrainte « sans reste des deux côtés » EST la
 * définition du diviseur commun, vécue avant d'être nommée ; « le plus
 * grand paquet possible » EST le PGCD. Les deux méthodes du programme
 * apparaissent ensuite comme deux façons d'éviter d'écrire toute la liste
 * des diviseurs — d'abord la soustraction (intuitive), puis la division
 * (rapide), dans cet ordre parce que la seconde est un raccourci de la
 * première.
 *
 * ── PÉRIMÈTRE ──────────────────────────────────────────────────────────
 * Les nombres premiers et la décomposition en facteurs premiers ne sont PAS
 * enseignés ici : ils sont le sujet officiel suivant (2.2), donc sa propre
 * leçon. Le PPCM n'appartient à aucun sujet du programme 4AM et n'est pas
 * introduit.
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/pgcd';

export const LESSON_CONFIG = {
  id: 'pgcd',
  sequentialUnlock: true,
  // Le TITRE est l'intitulé du sujet officiel, au mot près (un sujet = une
  // leçon). Il n'est pas raccourci pour tenir dans une carte.
  title: 'قواسم عدد طبيعي والقاسم المشترك الأكبر (PGCD) باستخدام خوارزمية أقليدس أو الفروق المتتالية',
  description:
    'فهم قواسم عدد طبيعي والقاسم المشترك الأكبر لعددين، ثم التمكن من حسابه باستعمال خوارزمية أقليدس أو طريقة الفروق المتتالية.',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 6,
  masteryThreshold: 0.8,
  emoji: '🔢',
  // 90 min : la durée du catalogue, et le plafond dur MAX_LESSON_MINUTES.
  estimatedDurationMin: 90,
  // Les 7 points d'apprentissage, VERBATIM depuis le catalogue.
  skills: [
    'تعيين قواسم عدد طبيعي',
    'تعيين القواسم المشتركة لعددين',
    'فهم معنى القاسم المشترك الأكبر لعددين',
    'حساب القاسم المشترك الأكبر باستعمال الفروق المتتالية',
    'حساب القاسم المشترك الأكبر باستعمال خوارزمية أقليدس',
    'التحقق من صحة حساب القاسم المشترك الأكبر',
    'توظيف القاسم المشترك الأكبر في حل وضعية مشكلة',
  ],
  teachingScope: {
    include: [
      'قواسم عدد طبيعي: تعيينها والتحقق منها بالقسمة الإقليدية',
      'القواسم المشتركة لعددين، والقاسم المشترك الأكبر بوصفه أكبرها',
      'طريقة الفروق المتتالية',
      'خوارزمية أقليدس (القسمات الإقليدية المتتالية)',
      'التحقق من صحة النتيجة، وحل وضعيات تستعمل القاسم المشترك الأكبر',
    ],
    exclude: [
      'الأعداد الأولية والتحليل إلى عوامل أولية (الموضوع الرسمي الموالي)',
      'الكسر غير القابل للاختزال (الموضوع الرسمي الموالي)',
      'المضاعف المشترك الأصغر (غير وارد في برنامج السنة الرابعة متوسط)',
    ],
  },
  // La leçon formalise en continu par sa carte des connaissances : chaque
  // module se clôt sur l'état courant de la carte, et le test final en
  // montre la version complète (docs/architecture/KNOWLEDGE_MAP.md).
  knowledgeMap: true,
  // Connaissances SUPPOSÉES acquises, diagnostiquées (sans blocage) par le
  // module 0. Elles reprennent les `prerequisites` du catalogue.
  //
  // [À VÉRIFIER DANS LE PROGRAMME OFFICIEL] — le programme des années
  // 1AM–3AM n'a pas été fourni ; que ces trois notions soient effectivement
  // acquises avant la 4AM est une hypothèse de travail, pas un fait établi
  // (ALGERIA_PHASE7_CURRICULUM_DECOMPOSITION_REPORT.md §11.4).
  priorKnowledge: ['aadad-tabiiya', 'qisma-iqlidiya', 'qasim'],
  modules: [
    {
      id: '00',
      number: 0,
      slug: 'mohimmat-al-intilaq',
      path: `${LESSON_BASE_PATH}/mohimmat-al-intilaq`,
      title: 'مهمة الانطلاق',
      desc: 'تشخيص قصير — غير مانع أبدًا — لمعرفة من أين نبدأ.',
      stage: 'prerequisite_check',
      color: 'teal',
      style: 'diagnostic',
      estimatedMin: 6,
      difficulty: 1,
      actionText: 'أتحقّق من مكتسباتي',
    },
    {
      id: '01',
      number: 1,
      slug: 'taqsim-adil',
      path: `${LESSON_BASE_PATH}/taqsim-adil`,
      title: 'تقسيم عادل',
      desc: 'كميتان يجب توزيعهما في طرود متماثلة دون أن يبقى شيء. ما أكبر طرد ممكن؟',
      stage: 'trigger',
      teachesLearningPointIds: ['4am_pgcd_P1'],
      color: 'indigo',
      style: 'featured',
      estimatedMin: 12,
      difficulty: 1,
      actionText: 'أبدأ التقسيم',
    },
    {
      id: '02',
      number: 2,
      slug: 'al-qawasim-al-mushtaraka',
      path: `${LESSON_BASE_PATH}/al-qawasim-al-mushtaraka`,
      title: 'من القاسم إلى القاسم المشترك الأكبر',
      desc: 'قواسم عدد، ثم القواسم المشتركة لعددين، ثم أكبرها: ثلاث كلمات لا يجوز خلطها.',
      stage: 'discovery',
      teachesLearningPointIds: ['4am_pgcd_P1', '4am_pgcd_P2', '4am_pgcd_P3'],
      color: 'violet',
      style: 'featured',
      estimatedMin: 14,
      difficulty: 2,
      actionText: 'أكتشف',
    },
    {
      id: '03',
      number: 3,
      slug: 'al-furuq-al-mutatalia',
      path: `${LESSON_BASE_PATH}/al-furuq-al-mutatalia`,
      title: 'طريقة الفروق المتتالية',
      desc: 'نطرح الأصغر من الأكبر، ونعيد. لماذا لا يتغير القاسم المشترك الأكبر؟',
      stage: 'manipulation',
      teachesLearningPointIds: ['4am_pgcd_P4'],
      color: 'emerald',
      style: 'featured',
      estimatedMin: 14,
      difficulty: 2,
      actionText: 'أطرح وأعيد',
    },
    {
      id: '04',
      number: 4,
      slug: 'khwarizmiyat-aqlidus',
      path: `${LESSON_BASE_PATH}/khwarizmiyat-aqlidus`,
      title: 'خوارزمية أقليدس',
      desc: 'قسمة واحدة تختصر عشر طرحات. نفس النتيجة، في خطوات أقل بكثير.',
      stage: 'manipulation',
      teachesLearningPointIds: ['4am_pgcd_P5'],
      color: 'blue',
      style: 'featured',
      estimatedMin: 14,
      difficulty: 3,
      actionText: 'أقسم وأعيد',
    },
    {
      id: '05',
      number: 5,
      slug: 'al-tahaqquq',
      path: `${LESSON_BASE_PATH}/al-tahaqquq`,
      title: 'أتحقّق وأختار',
      desc: 'كيف أتأكد أن النتيجة صحيحة؟ ومتى أختار هذه الطريقة أو تلك؟',
      stage: 'practice_lab',
      teachesLearningPointIds: ['4am_pgcd_P6'],
      color: 'amber',
      style: 'featured',
      estimatedMin: 14,
      difficulty: 3,
      actionText: 'أتدرّب',
    },
    {
      id: '06',
      number: 6,
      slug: 'wadiyat-mushkila',
      path: `${LESSON_BASE_PATH}/wadiyat-mushkila`,
      title: 'وضعيات مشكلة',
      desc: 'متى يكون السؤال سؤال قاسم مشترك أكبر، دون أن يُذكر اسمه؟',
      stage: 'practice_lab',
      teachesLearningPointIds: ['4am_pgcd_P7'],
      color: 'rose',
      style: 'featured',
      estimatedMin: 8,
      difficulty: 3,
      actionText: 'أحلّ الوضعيات',
    },
    {
      id: '07',
      number: 7,
      slug: 'al-tahaddi-al-nihai',
      path: `${LESSON_BASE_PATH}/al-tahaddi-al-nihai`,
      title: 'التحدي النهائي',
      desc: 'إحدى عشرة إجابة تُقيّم كل نقاط التعلّم، ثم ملف إتقانك.',
      stage: 'evaluation',
      color: 'slate',
      style: 'boss',
      estimatedMin: 8,
      difficulty: 4,
      actionText: 'أدخل التحدي',
    },
  ],
};
