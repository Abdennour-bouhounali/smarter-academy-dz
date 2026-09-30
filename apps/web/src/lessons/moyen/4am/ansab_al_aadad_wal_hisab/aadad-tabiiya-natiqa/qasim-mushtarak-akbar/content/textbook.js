import { src, addition } from '../../_unit/unitMeta.js';

/**
 * « أستعدّ » (module 0) — le manuel n'a qu'un seul « أستعدّ » pour toute
 * l'unité (p. 7, items 1–10 : leçons 1 et 8). Ces affirmations sont donc des
 * AJOUTS DE LA PLATEFORME, déclarés comme tels (SourceTag « عبارة إضافية من المنصّة ») : même
 * forme que le manuel (« أصحيح أم خاطئ؟ برّر إجابتك »), une ou plusieurs par
 * acquis de `priorKnowledge`, jamais les nombres de l'activité qui suit.
 */
export const PREP_ITEMS = [
  { n: 1, skill: 'qawasim', text: 'قواسم العدد 18 هي: 1 ، 2 ، 3 ، 6 ، 9 ، 18.', answer: true, why: '$18 = 1 \\times 18 = 2 \\times 9 = 3 \\times 6$.' },
  { n: 2, skill: 'qawasim', text: 'قواسم العدد 36 هي: 1 ، 2 ، 3 ، 4 ، 6 ، 9 ، 12 ، 36.', answer: false, why: 'ينقص 18: $36 = 2 \\times 18$. كل باقٍ معدوم يعطي قاسمين.' },
  { n: 3, skill: 'qawasim', text: 'للبحث عن قواسم العدد 80 يكفي أن نختبر الأعداد من 1 إلى 8.', answer: true, why: '$8 \\times 8 = 64$ أصغر من 80 و $9 \\times 9 = 81$ أكبر منه: كل قاسم أكبر من 8 يأتي مع قاسم أصغر منه.' },
  { n: 4, skill: 'qawasim', text: 'للعدد 49 قاسمان فقط: 1 و 49.', answer: false, why: '$49 = 7 \\times 7$: 7 قاسم له أيضًا، فقواسمه 1 ، 7 ، 49.' },
].map((it) => ({ ...it, source: addition('prerequisite_diagnostic') }));

export const ACTIVITY = {
  source: src('act-4', 8, 'أنشطة', 4),
  title: 'القاسم المشترك الأكبر لعددين طبيعيين',
  situation: 'أ) اقتنى بائع الزهور 90 زهرة حمراء و54 زهرة بيضاء بغرض استعمالها كلّها في تشكيل باقات متماثلة في النوع والعدد.',
  questions: ['1) هل يمكنه تشكيل 9 باقات؟ برّر إجابتك.', '2) في حالة الإيجاب، حدّد عدد الزهور من كل لون في الباقة الواحدة.', 'ماذا يمثل العدد 9 بالنسبة إلى العددين 90 و 54؟', 'ب) 1) ما هو أكبر عدد ممكن من الباقات المتماثلة التي يمكنه تشكيلها؟', '2) حدّد عندئذ عدد الزهور من كل لون في الباقة الواحدة.'],
  closing: 'نسمّي عدد الباقات المحصّل عليه القاسم المشترك الأكبر للعددين 90 و 54 ونرمز له بالرمز PGCD (90 ; 54).',
  numbers: { red: 90, white: 54 },
  context: { group: 'باقة', itemA: 'زهرة حمراء', itemB: 'زهرة بيضاء' },
};

/**
 * LE NIVEAU MBTADI' — même mathématique, situation plus proche de l'élève.
 *
 * Structure du manuel : deux collections à répartir EN MÊME TEMPS en groupes
 * identiques ; les nombres de groupes qui marchent sont les قواسم مشتركة, et
 * le plus grand est le PGCD. On la garde entière, avec 12 et 18 — deux
 * nombres dont les diviseurs communs (1, 2, 3, 6) se comptent sur les
 * doigts, dans une situation d'équipe plutôt que de fleuriste.
 *
 * Déclaré comme ajout de la plateforme : rien n'est ajouté sans le dire.
 */
export const STARTER = {
  source: addition('interaction_generation'),
  numbers: { a: 12, b: 18 },
  context: { group: 'فريق', itemA: 'كرة', itemB: 'قميصًا' },
};

export const KNOWLEDGE_3 = {
  source: src('know-3', 10, 'معارف', 3),
  definition: 'القواسم المشتركة لعددين طبيعيين $a$ و $b$ هي الأعداد الطبيعية غير المعدومة التي تقسم $a$ و $b$ في آن واحد.',
  example: '6 قاسم مشترك لـ 12 و 18 لأن: $12 = 2 \\times 6$ و $18 = 3 \\times 6$. • قواسم 12 هي 1 ، 2 ، 3 ، 4 ، 6 و 12. و قواسم العدد 18 هي: 1 ، 2 ، 3 ، 6 ، 9 و 18. إذن القواسم المشتركة للعددين 12 و 18 هي 1 ، 2 ، 3 و 6.',
};

export const KNOWLEDGE_4 = {
  source: src('know-4-def', 12, 'معارف', 4),
  definition: 'يُسمّى أكبر قاسم مشترك لعددين طبيعيين $a$ و $b$ القاسم المشترك الأكبر لهذين العددين، ويرمز له بالرمز PGCD $(a ; b)$.',
  example: '• قواسم 28 هي 1 ، 2 ، 4 ، 7 ، 14 و 28 وقواسم 42 هي 1 ، 2 ، 3 ، 6 ، 7 ، 14 ، 21 و 42. • القواسم المشتركة لـ 28 و 42 هي 1 ، 2 ، 7 و 14. • القاسم المشترك الأكبر لـ 28 و 42 هو 14 و نكتب PGCD(28 ; 42) = 14.',
  remark: 'مجموعة القواسم المشتركة لعددين هي مجموعة قواسم قاسمهما المشترك الأكبر. انظر المثال السابق: قواسم العدد 14 هي: 1 ، 2 ، 7 و 14.',
};

export const TRY_NOW_1 = { source: src('now-11-1', 11, 'دوري الآن', 1), text: 'عيّن القواسم المشتركة للعددين 65 و 78.', answer: [1, 13] };
