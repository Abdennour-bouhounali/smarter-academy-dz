import { src, addition } from '../../_unit/unitMeta.js';

/**
 * « أستعدّ » (module 0) — le manuel n'a qu'un seul « أستعدّ » pour toute
 * l'unité (p. 7, items 1–10 : leçons 1 et 8). Ces affirmations sont donc des
 * AJOUTS DE LA PLATEFORME, déclarés comme tels (SourceTag « عبارة إضافية من المنصّة ») : même
 * forme que le manuel (« أصحيح أم خاطئ؟ برّر إجابتك »), une ou plusieurs par
 * acquis de `priorKnowledge`, jamais les nombres de l'activité qui suit.
 */
export const PREP_ITEMS = [
  { n: 1, skill: 'pgcd', text: 'PGCD$(20 ; 30) = 5$.', answer: false, why: '10 يقسم 20 و 30، وهو أكبر قاسم مشترك لهما: PGCD$(20 ; 30) = 10$.' },
  { n: 2, skill: 'pgcd', text: 'في خوارزمية إقليدس، القاسم المشترك الأكبر هو آخر باقٍ معدوم.', answer: false, why: 'القاسم المشترك الأكبر هو آخر باقٍ غير معدوم.' },
  { n: 3, skill: 'pgcd', text: '$77 = 21 \\times 3 + 14$ ؛ $21 = 14 \\times 1 + 7$ ؛ $14 = 7 \\times 2 + 0$، إذن PGCD$(77 ; 21) = 7$.', answer: true, why: 'آخر باقٍ غير معدوم في هذه القسمات المتتابعة هو 7.' },
  { n: 4, skill: 'qawaid', text: 'العددان 45 و 72 يقبلان القسمة على 9.', answer: true, why: '$4 + 5 = 9$ و $7 + 2 = 9$.' },
  { n: 5, skill: 'qawaid', text: 'العدد 234 لا يقبل القسمة على 3.', answer: false, why: '$2 + 3 + 4 = 9$ و 9 يقبل القسمة على 3، إذن 234 يقبل القسمة على 3.' },
].map((it) => ({ ...it, source: addition('prerequisite_diagnostic') }));
export const ACTIVITY = {
  source: src('act-7', 9, 'أنشطة', 7), title: 'العددان الأوّليّان فيما بينهما',
  questions: ['أ) اشرح لماذا القاسم المشترك الأكبر للعددين 17 و 18 هو 1.', 'نقول إن العددين 17 و 18 أوليان فيما بينهما ونكتب PGCD (18 ; 17) = 1.', 'ب) أثبت أنّ 22 و 35 أوليان فيما بينهما.', 'جـ) تقول مريم: «العددان 27 و 36 أوليان فيما بينهما». هل هي على صواب؟ اشرح.'],
};
export const KNOWLEDGE = {
  source: src('know-5', 12, 'معارف', 5),
  definition: 'العددان الطبيعيان $a$ و $b$ أوليان فيما بينهما يعني أنّ قاسمهما المشترك الأكبر يساوي 1. نكتب $a$ و $b$ أوليان فيما بينهما يعني PGCD$(a ; b) = 1$.',
  example: 'قواسم 22 هي 1 ؛ 2 ؛ 11 ؛ 22 وقواسم 15 هي 1 ؛ 3 ؛ 5 ؛ 15. إذن PGCD(15 ; 22) = 1. العددان 15 و 22 أوليان فيما بينهما.',
};
