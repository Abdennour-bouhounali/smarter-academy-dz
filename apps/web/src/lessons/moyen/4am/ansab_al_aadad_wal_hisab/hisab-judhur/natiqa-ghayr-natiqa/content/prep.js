import { addition } from '../../_unit/unitMeta.js';

/**
 * « أستعدّ » DE LA PLATEFORME — 10 affirmations, de TRÈS FACILE à plus difficile (règle des pilotes, propriétaire 2026-11-07 ; rollout de l'unité 2,
 * leçon 2, 2026-11-09). Les deux كفاءات alternent : natiq « العدد الناطق » (1 → 3 → 5 → 7 → 9 : écrire un décimal en fraction et l'inverse) et jidhr
 * « الجذر التربيعي » (2 → 4 → 6 → 8 → 10 : le nombre POSITIF dont le carré est a). Écrites par la plateforme (indépendance du manuel) : les cinq
 * énoncés d'avant restent dans content/textbook.js (PREP_ITEMS).
 * `check` (recalculé par content/prep.test.js) :
 *   { kind: 'eq', a: [num, den], b: [num, den] }     — « a et b sont le même nombre »
 *   { kind: 'sqrt', a: [num, den], r: [num, den] }   — « √a = r » : r ≥ 0 et r² = a
 * Aucun nombre de la مسألة (2,89 et 1,7 ; 4 et ses 9 pièces ; 3 et √3 ; 1,74 ; 12 jours ; 500 دج).
 */
export const PREP_LADDER = [
  { n: 1, skill: 'natiq', level: 1, text: '$0{,}5 = \\dfrac{1}{2}$', answer: true, why: '$0{,}5 = \\dfrac{5}{10} = \\dfrac{1}{2}$.', check: { kind: 'eq', a: [5, 10], b: [1, 2] } },
  { n: 2, skill: 'jidhr', level: 1, text: '$\\sqrt{25} = 5$', answer: true, why: '5 عدد موجب و $5^2 = 25$.', check: { kind: 'sqrt', a: [25, 1], r: [5, 1] } },
  { n: 3, skill: 'natiq', level: 2, text: 'العدد العشري $1{,}2$ يساوي الكسر $\\dfrac{6}{5}$.', answer: true, why: '$1{,}2 = \\dfrac{12}{10} = \\dfrac{6}{5}$: كل عدد عشري عدد ناطق.', check: { kind: 'eq', a: [12, 10], b: [6, 5] } },
  { n: 4, skill: 'jidhr', level: 2, text: '$\\sqrt{64} = 32$', answer: false, why: 'الجذر ليس النصف: $32^2 = 1024$. العدد الموجب الذي مربّعه 64 هو 8.', check: { kind: 'sqrt', a: [64, 1], r: [32, 1] } },
  { n: 5, skill: 'natiq', level: 3, text: '$\\dfrac{7}{20} = 0{,}35$', answer: true, why: '$\\dfrac{7}{20} = \\dfrac{35}{100} = 0{,}35$.', check: { kind: 'eq', a: [7, 20], b: [35, 100] } },
  { n: 6, skill: 'jidhr', level: 3, text: '$\\sqrt{0{,}49} = 0{,}07$', answer: false, why: '$0{,}07^2 = 0{,}0049$. العدد الموجب الذي مربّعه 0,49 هو 0,7.', check: { kind: 'sqrt', a: [49, 100], r: [7, 100] } },
  { n: 7, skill: 'natiq', level: 4, text: '$-\\dfrac{9}{6} = -1{,}5$', answer: true, why: '$\\dfrac{9}{6} = \\dfrac{3}{2} = 1{,}5$، والإشارة نفسها.', check: { kind: 'eq', a: [-9, 6], b: [-15, 10] } },
  { n: 8, skill: 'jidhr', level: 4, text: '$\\sqrt{\\dfrac{1}{36}} = \\dfrac{1}{6}$', answer: true, why: '$\\dfrac{1}{6}$ موجب و $\\left(\\dfrac{1}{6}\\right)^2 = \\dfrac{1}{36}$.', check: { kind: 'sqrt', a: [1, 36], r: [1, 6] } },
  { n: 9, skill: 'natiq', level: 5, text: '$\\dfrac{1}{7} = 0{,}14$', answer: false, why: '$7 \\times 0{,}14 = 0{,}98$ لا 1: العدد 0,14 قيمة مقرّبة فقط لـ $\\dfrac{1}{7}$.', check: { kind: 'eq', a: [1, 7], b: [14, 100] } },
  { n: 10, skill: 'jidhr', level: 5, text: '$\\sqrt{(-6)^2} = -6$', answer: false, why: '$(-6)^2 = 36$، والجذر التربيعي عدد موجب: $\\sqrt{36} = 6$.', check: { kind: 'sqrt', a: [36, 1], r: [-6, 1] } },
].map((it) => ({ ...it, source: addition('prerequisite_diagnostic') }));
