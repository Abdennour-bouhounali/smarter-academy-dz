import { src, addition } from '../../_unit/unitMeta.js';

/**
 * « أستعدّ » (module 0) — le manuel n'a qu'un seul « أستعدّ » pour toute
 * l'unité (p. 7, items 1–10 : leçons 1 et 8). Ces affirmations sont donc des
 * AJOUTS DE LA PLATEFORME, déclarés comme tels (SourceTag « عبارة إضافية من المنصّة ») : même
 * forme que le manuel (« أصحيح أم خاطئ؟ برّر إجابتك »), une ou plusieurs par
 * acquis de `priorKnowledge`, jamais les nombres de l'activité qui suit.
 */
export const PREP_ITEMS = [
  { n: 1, skill: 'qawasim', text: 'قواسم العدد 20 هي: 1 ، 2 ، 4 ، 5 ، 10 ، 20.', answer: true, why: '$20 = 1 \\times 20 = 2 \\times 10 = 4 \\times 5$.' },
  { n: 2, skill: 'qawasim', text: 'قواسم العدد 64 هي: 1 ، 2 ، 4 ، 8 ، 16 ، 64.', answer: false, why: 'ينقص 32: $64 = 2 \\times 32$.' },
  { n: 3, skill: 'pgcd', text: 'القاسم المشترك الأكبر للعددين 12 و 18 هو 6.', answer: true, why: 'القواسم المشتركة لـ 12 و 18 هي 1 ، 2 ، 3 ، 6؛ أكبرها 6.' },
  { n: 4, skill: 'pgcd', text: 'القاسم المشترك الأكبر للعددين 16 و 24 هو 4 لأنّ 4 يقسم العددين.', answer: false, why: 'القواسم المشتركة لـ 16 و 24 هي 1 ، 2 ، 4 ، 8؛ أكبرها 8 وليس 4.' },
].map((it) => ({ ...it, source: addition('prerequisite_diagnostic') }));
export const ACTIVITY = {
  source: src('act-5', 8, 'أنشطة', 5), title: 'تعيين القاسم المشترك الأكبر لعددين طبيعيين',
  questions: ['1) أوجد قواسم كلٍّ من العددين 42 و 60.', '2) أوجد القواسم المشتركة لهذين العددين.', '3) ما هو أكبر قاسم مشترك للعددين 42 و 60؟'],
  fill: 'انقل و أكمل: «العدد ... يسمى القاسم ... ... ... للعددين 42 و 60». ونكتب ... = PGCD (42 ; 60).',
  numbers: { a: 42, b: 60 },
};
export const RESULTS = {
  source: src('know-4-results', 12, 'معارف', 4), intro: '$a$ و $b$ عددان طبيعيان.',
  items: ['PGCD$(a ; a) = a$', 'PGCD$(a ; 0) = a$', 'إذا كان $b$ قاسما للعدد $a$ فإن PGCD$(a ; b) = b$', 'PGCD$(a ; b) = $ PGCD$(b ; a)$'],
  examples: ['PGCD(28 ; 28) = 28', 'PGCD(7 ; 0) = 7', 'PGCD(40 ; 8) = 8', 'PGCD(8 ; 40) = PGCD(40 ; 8) = 8'],
};
