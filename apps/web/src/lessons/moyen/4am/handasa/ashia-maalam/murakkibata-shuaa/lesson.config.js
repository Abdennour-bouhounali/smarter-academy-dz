/**
 * الدرس 1 — قراءة مركبتي شعاع وتمثيلهما في معلم (مدخل الوحدة 12 « الأشعة في معلم »)
 * Manuel (4AM) : « أستعدّ » 1 et 2 (p. 139, module 0), مدخل الباب « ديكارت وفيرما » (p. 139, doublon, module 1),
 * نشاط 1 (p. 140, module 1), معارف 1, 2, 3 أ et la « نتيجة » (pp. 142 et 144, module 2), طرائق « تمثيل شعاع علمت
 * مركبتاه » et دوري الآن 1 (p. 143, module 3), exercices 1 à 5 (p. 146, module 4), QCM 1 (p. 148, doublon, module 5).
 * Source de vérité : docs/sources/4am/unit12/extraction.json.
 *
 * LE PARCOURS (REAL → DISCOVER → MANIPULATE → UNDERSTAND → TOUCH THE MATH → FORMALIZE → AUTOMATIZE → TRANSFER) :
 *   M0 أستعدّ          — lire les coordonnées d'un point, une droite graduée, les axes ; le vecteur de l'unité 11 ;
 *   M1 نشاط 1          — REAL (la mouche de Descartes, une appli de livraison dans Alger) → DISCOVER → MANIPULATE
 *                        (component-steps : conduire le livreur, écrire le code du trajet, poser une destination ;
 *                        متقدم : le نشاط 1 du manuel) ; les questions 1–5 du نشاط répondues sous les livraisons de l'élève ;
 *                        la brique « مركبتا شعاع » = le texte du نشاط 1 (3) ;
 *   M2 معارف           — UNDERSTAND / FORMALIZE : la lecture graphique (معارف 3 أ), OM ↔ M(x ; y) (معارف 1 et la نتيجة,
 *                        coquille corrigée), les quatre معالم (معارف 2) ;
 *   M3 طرائق           — TOUCH THE MATH : représenter un vecteur de composantes données (la طريقة révélée ligne à ligne,
 *                        EABF), puis دوري الآن 1 dans le lab posé seul ;
 *   M4 أوظّف تعلّماتي  — AUTOMATIZE (ex-1, 2) et TRANSFER (ex-3, 4, 5) ;
 *   M5 إختبار أولي     — QCM 1 et quatre épreuves de la plateforme ; P1, P2, P3 couverts.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/handasa/murakkibata-shuaa';

export const LESSON_CONFIG = {
  id: 'murakkibata-shuaa',
  kind: 'lesson',
  unit: 'ashia-maalam',
  unitTitle: 'الأشعة في معلم',
  sequentialUnlock: true,
  title: 'قراءة مركبتي شعاع وتمثيلهما في معلم',
  description: 'مدخل الوحدة: سائق توصيل في شوارع حيّ مرسوم كمعلم يكتب رحلته بعددين — الإزاحة الأفقية ثم العمودية، بإشارتيهما — هما مركبتا الشعاع؛ ومن المبدأ O تصبح المركبتان إحداثيتي الوجهة، ونمثّل شعاعا علمت مركبتاه من أي نقطة.',
  level: 'moyen',
  grade: '4am',
  chapter: 'handasa',
  chapterTitle: 'ميدان الهندسة',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🧭',
  estimatedDurationMin: 50,
  textbookRef: { unit: 12, activity: 1, pages: '139, 140, 142, 143, 144, 146, 148' },
  skills: [
    'قراءة مركبتي شعاع بيانيا في معلم متعامد ومتجانس: الإزاحة الأفقية ثم العمودية بإشارتيهما',
    'تعيين مركبتي الشعاع OM من إحداثيتي النقطة M، والعكس',
    'تمثيل شعاع علمت مركبتاه انطلاقا من نقطة معطاة',
  ],
  teachingScope: {
    include: [
      'نشاط 1: قراءة مركبتي AB على المرصوفة (+8 ثم −2)، الشعاع BD نحو نقطة خارج الشكل، الأشعة OA و OB و OC و OD',
      'معارف 1 و 3 أ والنتيجة: مركبتا شعاع، القراءة في تمثيل بياني، مركبتا OM هما إحداثيتا M',
      'معارف 2: أنواع المعالم الأربعة',
      'طرائق: تمثيل شعاع علمت مركبتاه، وممثّل آخر له (EABF)',
    ],
    exclude: [
      'حساب مركبتي شعاع من إحداثيتي مبدئه ونهايته (xB − xA ; yB − yA) وتساوي شعاعين بالمركبات (الدرس 2)',
      'إحداثيتا منتصف قطعة والمسافة بين نقطتين (الدرس 3)',
      'إثبات الخواص الهندسية بالحساب (الدرس 4) والوضعية الإدماجية (أدمج تعلّماتي)',
    ],
  },
  knowledgeMap: true,
  knowledgeMapMode: 'progressive',
  // Les acquis que « أستعدّ » diagnostique : lire les coordonnées d'un point, une droite graduée (milieu et distance sur
  // l'axe), les axes du معلم, le vecteur de l'unité 11 (منحى، اتجاه، طول) et l'égalité de deux vecteurs.
  priorKnowledge: ['ihdathiyat-nuqta', 'mustaqim-mudarraj', 'mihwarayn', 'shuaa-anasir', 'tasawi-shuaayn'],
  resources: [
    // Le module 1 ouvre sur L'APPLI DE LIVRAISON (component-steps). متقدم (ouvert par défaut : le نشاط 1) : la figure du manuel,
    // A → B sans compteurs puis le code, B → D vers D qu'on ne voit pas, OA, OD, et u(3 ; −4) depuis A ; مبتدئ : le quartier
    // et ses cinq commandes, compteurs en direct.
    {
      kind: 'manipulation', code: 'component-steps-city', type: 'component-steps', module: 1,
      level: 'beginner',
      title: 'تطبيق التوصيل: خمسة طلبات في الحيّ',
      objective: 'مركبتا شعاع في معلم متعامد ومتجانس هما الإزاحة الأفقية ثم الإزاحة العمودية من مبدئه إلى نهايته بإشارتيهما؛ لا تتعلقان بنقطة الانطلاق، ومركبتا OM هما إحداثيتا M، ونمثّل شعاعا علمت مركبتاه من أي نقطة',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'delivery' },
      learningPointIds: ['4am_murakkibata-shuaa_P1', '4am_murakkibata-shuaa_P2', '4am_murakkibata-shuaa_P3'],
      sourceElementIds: ['act-1'],
    },
    {
      kind: 'manipulation', code: 'component-steps-act1', type: 'component-steps', module: 1,
      level: 'advanced',
      title: 'نشاط 1: من A إلى B ثم إلى D ومن المبدأ O',
      objective: 'مركبتا شعاع في معلم متعامد ومتجانس هما الإزاحة الأفقية ثم الإزاحة العمودية من مبدئه إلى نهايته بإشارتيهما؛ لا تتعلقان بنقطة الانطلاق، ومركبتا OM هما إحداثيتا M، ونمثّل شعاعا علمت مركبتاه من أي نقطة',
      autonomy: 'لا عدّادات أثناء السير: التلميذ يسوق الدراجة من A إلى B ثم يكتب مركبتي AB بنفسه، ويكتب مركبتي BD نحو نقطة D غير مرسومة (من إحداثيتيها وحدهما) قبل الانطلاق، ويضع نهاية ممثّل للشعاع u(3 ; −4) مبدؤه A دون أي مساعدة',
      experience: { type: 'textbook', reason: '', theme: 'delivery' },
      learningPointIds: ['4am_murakkibata-shuaa_P1', '4am_murakkibata-shuaa_P2', '4am_murakkibata-shuaa_P3'],
      sourceElementIds: ['act-1'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'سبع عبارات: إحداثيتا نقطة في معلم، محورا المعلم، والشعاع الذي عرفته في الوحدة السابقة. صحيح أم خاطئ؟',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 5, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'nashat', path: `${LESSON_BASE_PATH}/nashat`,
      title: 'نشاط 1 — تطبيق التوصيل في الحيّ', desc: 'سُق سائق التوصيل في الشوارع واكتب رحلته بعددين، ثم أجب عن أسئلة نشاط الكتاب: من A إلى B، من B إلى D، ومن المبدأ O.',
      stage: 'trigger', teachesLearningPointIds: ['4am_murakkibata-shuaa_P1', '4am_murakkibata-shuaa_P2'],
      color: 'indigo', style: 'featured', estimatedMin: 13, difficulty: 1, actionText: 'أبدأ التوصيل' },
    { id: '02', number: 2, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`,
      title: 'معارف — مركبتا شعاع في معلم', desc: 'القراءة في تمثيل بياني، مركبتا الشعاع OM وإحداثيتا M، وأنواع المعالم الأربعة.',
      stage: 'discovery', teachesLearningPointIds: ['4am_murakkibata-shuaa_P1', '4am_murakkibata-shuaa_P2'],
      color: 'violet', style: 'featured', estimatedMin: 10, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'taraiq', path: `${LESSON_BASE_PATH}/taraiq`,
      title: 'طرائق — تمثيل شعاع علمت مركبتاه', desc: 'الطريقة خطوة خطوة: انسحاب أفقي ثم انسحاب عمودي، ممثّل آخر بمتوازي الأضلاع، ثم دوري الآن في تطبيق التوصيل.',
      stage: 'formalization', teachesLearningPointIds: ['4am_murakkibata-shuaa_P3'],
      color: 'emerald', style: 'featured', estimatedMin: 9, difficulty: 2, actionText: 'أتعلّم الطريقة' },
    { id: '04', number: 4, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'تمارين الكتاب 1 و 2 و 3 و 4 و 5.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_murakkibata-shuaa_P1', '4am_murakkibata-shuaa_P2', '4am_murakkibata-shuaa_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 2, actionText: 'أتدرّب' },
    { id: '05', number: 5, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'خمسة أسئلة تُقيّم نقاط التعلّم الثلاث، منها السؤال 1 من أؤكّد تعلّماتي.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 5, difficulty: 2, actionText: 'أدخل التقويم' },
  ],
};
