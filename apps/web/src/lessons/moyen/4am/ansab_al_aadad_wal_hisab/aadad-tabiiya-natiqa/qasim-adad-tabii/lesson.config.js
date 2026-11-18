/**
 * الدرس 1 — التعرّف على قاسم لعدد طبيعي
 * Unité 1 du manuel (4AM), activité 1 (p. 8), معارف 1 (p. 10), exercices 1, 2, 5 (p. 14),
 * puis trois « مسائل » de la plateforme (modules 4–6, pilote du 2026-10-05).
 * Source de vérité : docs/sources/4am/unit1/extraction.json.
 * Le réseau (2026-11-07) : 4am.m1.r01 REQUIERT 1am.m3.r01 (`qisma-iqlidiya-baqi`, publiée) et ÉTEND 1am.m3.r02 (`qawaid-qabiliyat-qisma`, publiée).
 *   Arêtes LP le long de ces deux liens : P1 ← 1am_qisma-iqlidiya-baqi_P1 (faire la division) + 1am_qawaid-qabiliyat-qisma_P4 (« يقبل القسمة » = reste nul),
 *   P2 ← 1am_qisma-iqlidiya-baqi_P2 (a = b × q + r), P3 ← 1am_qawaid-qabiliyat-qisma_P4. Aucune arête vers 2AM `qisma-iqlidiya-hasr` : le réseau n'a pas de lien
 *   2am.m1.r04 → 4am.m1.r01 (question au propriétaire). « راجع قبل أن تنطلق » et « راجع » après une erreur pointent déjà vers les deux leçons 1AM (réseau + `getLessonPath`).
 *   Les deux leçons 1AM sont aussi ses `prerequisiteLessonCodes` : « المتطلبات السابقة » les montre en pastilles-liens (« · السنة الأولى »), à la place des deux notions en texte.
 *
 * CONCEPTION (LESSON_DEVELOPMENT_GUIDE §4ter, rétrofit du 2026-10-15) — le manuel fixe les الكفاءات, pas le parcours.
 *   Entrée retenue : le TERRAIN (15 joueurs en 3 équipes, puis 16 : un joueur n'a pas d'équipe) — la main FIXE le nombre de groupes
 *   et le reste se voit debout sur le banc avant que le mot « قاسم » existe ; c'est le niveau مبتدئ du labo, ajout déclaré de la
 *   plateforme (`platform_designed_entry`). Rejeté : le نشاط 1 du manuel (420 livres, « 26 ou 28 ? ») comme entrée — un choix
 *   binaire dont la réponse se vérifie par deux restes, sans que l'idée devienne nécessaire ; son CONTRASTE vit sur le même terrain
 *   (42 joueurs : 5 ou 6 équipes ?). Rejeté aussi : ouvrir sur la définition a = b × q (aucune raison pour la main).
 *   Ordre des idées (lecteur de mission, manches content/teams.js) : 15 en 3 → le 16e joueur et le banc → 42 : 5 ou 6 équipes →
 *   brique « قاسم بالباقي » APRÈS la réponse → (module 2) 48 en 6 PUIS en 8 vident le banc → définition par le reste → par le
 *   produit (8 aussi) → 120 = 6 × 20 → les quatre phrases → « ورقة سلمى » (corriger l'erreur « حاصل طبيعي ⇒ تامّة »).
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
  // A v2 lesson (docs/architecture/LESSON_V2.md §2, owner's order of 2026-11-18): the student's home is the game world of
  // `lesson.pack.js`. Its module PAGES, the mission player (`studentView: 'mission'`, `mission`), « مسألة الدرس »
  // (`lessonProblem`) and `?view=classic` are deleted. The `modules` below stay as DATA: their ids and numbers are how
  // progress is stored (the world marks them, `onModule`), every report reads them, and their addresses redirect home.
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
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // La carte TOUTE OUVERTE (propriétaire, 2026-11-08, PILOTE) : toutes les connaissances dès le début, sans verrou par محور.
  knowledgeMapOpen: true,
  // Les acquis des années antérieures que « أستعدّ » (p. 7) diagnostique.
  priorKnowledge: ['qisma-iqlidiya', 'qawaid-qabiliyat-al-qisma'],
  resources: [
    // Le module 1 est un WORKSPACE À DEUX NIVEAUX (MANIPULATION_CONTRACT
    // §7bis-levels) : même objectif mathématique, deux expériences.
    //
    //   مبتدئ  — les équipes : contexte de la PLATEFORME, petits nombres.
    //   متقدم  — le MÊME terrain, 42 joueurs, 5 ou 6 équipes (content/teams.js) : le contraste du نشاط 1 du manuel (420 livres,
    //            26 ou 28 par rayon). Le labo de la bibliothèque a été RETIRÉ de la leçon le 2026-11-04 (propriétaire : « le labo
    //            du football pour toute la leçon »).
    //
    // `experience` porte la traçabilité exigée : d'où vient la mathématique
    // (toujours le manuel) et ce que la plateforme a fait de la situation.
    {
      kind: 'manipulation', code: 'team-builder-15-3', type: 'team-builder', module: 1,
      level: 'beginner',
      title: 'قسمة بالتساوي — 15 لاعبًا في 3 فرق',
      objective: 'التوزيع بالتساوي: a = b × q + r، والباقي معدوم ⇔ b قاسم لـ a',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'platform_designed_entry', theme: 'football' },
      learningPointIds: ['4am_qasim-adad-tabii_P1'],
      sourceElementIds: ['act-1'],
    },
    {
      kind: 'manipulation', code: 'team-builder-42', type: 'team-builder', module: 1,
      level: 'advanced',
      title: 'هل هو قاسم؟ — 42 لاعبًا في 5 أو 6 فرق',
      objective: 'التوزيع بالتساوي: a = b × q + r، والباقي معدوم ⇔ b قاسم لـ a',
      autonomy: 'التلميذ يختار بنفسه عدد الفرق (4 إلى 7) لـ 42 لاعبًا، ويرى متى لا يبقى أحد خارج الفرق',
      experience: { type: 'platform_context', reason: 'platform_designed_entry', theme: 'football' },
      learningPointIds: ['4am_qasim-adad-tabii_P1', '4am_qasim-adad-tabii_P2'],
      sourceElementIds: ['act-1'],
    },
    // Module 2 (معارف) — l'exemple travaillé sur le MÊME terrain qu'au module 1. Un seul instrument pour toute la leçon. Un seul
    // niveau ici (`levels={false}` dans le module) ; sa découverte est la symétrie 48 = 6 × 8 = 8 × 6 (6 équipes PUIS 8).
    {
      kind: 'manipulation', code: 'team-builder-48', type: 'team-builder', module: 2,
      title: 'مثال: 48 لاعبًا — 6 ثم 8 فرق',
      experience: { type: 'platform_context', reason: 'platform_designed_entry', theme: 'football' },
      learningPointIds: ['4am_qasim-adad-tabii_P2'],
      sourceElementIds: ['know-1'],
    },
    // Modules 4–6 — les « مسائل » : exercices complets de type امتحان, ajouts
    // de la plateforme (leurs pages et content/problems.js sont supprimés depuis la v2 — des données ici), sans aucune preuve de maîtrise.
    { kind: 'situation', code: 'masala-1', module: 4, title: 'مسألة الدرس — رفوف المكتبة: 756 كتابًا', learningPointIds: ['4am_qasim-adad-tabii_P1', '4am_qasim-adad-tabii_P2', '4am_qasim-adad-tabii_P3'] },
    { kind: 'situation', code: 'masala-2', module: 5, title: 'مسألة — التعاونية الفلاحية: 2028 بيضة', learningPointIds: ['4am_qasim-adad-tabii_P1', '4am_qasim-adad-tabii_P2', '4am_qasim-adad-tabii_P3'] },
    { kind: 'situation', code: 'masala-3', module: 6, title: 'مسألة — الرحلة المدرسية: كم حافلة؟', learningPointIds: ['4am_qasim-adad-tabii_P1', '4am_qasim-adad-tabii_P2'] },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'ست عبارات: صحيح أم خاطئ؟ القسمة الإقليدية وقواعد قابلية القسمة.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 8, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'al-maktaba', path: `${LESSON_BASE_PATH}/al-maktaba`,
      title: 'نشاط 1 — فرق متساوية', desc: 'كم فريقًا لا يترك أحدًا خارج الفرق؟ جرّب، ولاحظ الباقي.',
      stage: 'trigger', teachesLearningPointIds: ['4am_qasim-adad-tabii_P1'],
      color: 'indigo', style: 'featured', estimatedMin: 10, difficulty: 1, actionText: 'أجرّب' },
    { id: '02', number: 2, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`,
      title: 'معارف — قاسم عدد طبيعي', desc: 'تعريفان لنفس الفكرة، وأربع جمل لها نفس المعنى.',
      stage: 'discovery', teachesLearningPointIds: ['4am_qasim-adad-tabii_P2', '4am_qasim-adad-tabii_P3', '4am_qasim-adad-tabii_P4'],
      color: 'violet', style: 'featured', estimatedMin: 12, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'ثلاثة تمارين للتطبيق.',
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
