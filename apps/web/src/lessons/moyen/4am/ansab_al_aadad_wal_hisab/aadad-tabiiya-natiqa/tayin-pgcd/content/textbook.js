import { src } from '../../_unit/unitMeta.js';
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
