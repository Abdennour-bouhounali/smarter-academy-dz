import { addition } from '../../_unit/unitMeta.js';

/**
 * « أستعدّ » DE LA SYNTHÈSE — l'ÉCHELLE de dix affirmations bâtie sur les leçons de l'unité (recette de la synthèse, point 3 ; pilote
 * `wadiya-idmajiya-talis`). Trois كفاءات en cycle : qawasim « القواسم المشتركة » (1 → 4 → 7 → 10, à réviser dans `qasim-mushtarak-akbar`),
 * pgcd « القاسم المشترك الأكبر » (2 → 5 → 8, `tayin-pgcd`), iqlidus « خوارزمية إقليدس » (3 → 6 → 9, `bahth-pgcd`) — trois leçons de l'unité,
 * « راجع » n'est jamais vide. De très facile (énoncés de règles, les trois premières VRAIES) à plus difficile (calculs). Les six affirmations
 * d'avant restent dans content/textbook.js (PREP_ITEMS) comme source. `check` (recalculé par content/prep.test.js) :
 *   { kind: 'rule', truth }                    — un énoncé de règle
 *   { kind: 'divides', d, a, b }               — « d est un diviseur commun de a et b »
 *   { kind: 'pgcd', a, b, claim }              — « PGCD(a ; b) = claim »
 *   { kind: 'step', a, b, q, r, next }         — « a = b × q + r, donc PGCD(a ; b) = PGCD(next) »
 *   { kind: 'commons', a, b, claim }           — « les diviseurs communs de a et b sont exactement claim »
 *   { kind: 'euclidLast', a, b, claim }        — « dans Euclide pour a et b, PGCD(a ; b) = claim »
 *   { kind: 'share', a, b, k }                 — « a et b se partagent sans reste sur k groupes »
 * Aucun nombre des tabliers (le défi 🏆, la وضعية du module 7) ni d'une manche du module 7 (content/forbidden.js, content/mission.test.js).
 */
export const PREP_LADDER = [
  { n: 1, skill: 'qawasim', level: 1, text: 'القاسم المشترك لعددين طبيعيين هو عدد يقسم كلًّا منهما.', answer: true,
    why: 'مثلًا 3 يقسم 12 ويقسم 18: هو قاسم مشترك لهما.', check: { kind: 'rule', truth: true } },
  { n: 2, skill: 'pgcd', level: 1, text: 'القاسم المشترك الأكبر لعددين هو أكبر قواسمهما المشتركة.', answer: true,
    why: 'نرمز إليه PGCD، وكل قاسم مشترك آخر للعددين يقسمه.', check: { kind: 'rule', truth: true } },
  { n: 3, skill: 'iqlidus', level: 1, text: 'في خوارزمية إقليدس نقسم الأكبر على الأصغر، ثم القاسم على الباقي، إلى أن يصير الباقي معدومًا.', answer: true,
    why: 'كل قسمة تحفظ القاسم المشترك الأكبر: PGCD$(a ; b) = $ PGCD$(b ; r)$.', check: { kind: 'rule', truth: true } },
  { n: 4, skill: 'qawasim', level: 2, text: 'العدد 6 قاسم مشترك للعددين 36 و 44.', answer: false,
    why: '6 يقسم 36 ولا يقسم 44: $44 = 6 \\times 7 + 2$.', check: { kind: 'divides', d: 6, a: 36, b: 44 } },
  { n: 5, skill: 'pgcd', level: 2, text: 'PGCD$(36 ; 44) = 4$.', answer: true,
    why: 'القواسم المشتركة للعددين 36 و 44 هي 1 ، 2 ، 4 وأكبرها 4.', check: { kind: 'pgcd', a: 36, b: 44, claim: 4 } },
  { n: 6, skill: 'iqlidus', level: 2, text: '$58 = 16 \\times 3 + 10$، إذن PGCD$(58 ; 16) = $ PGCD$(16 ; 10)$.', answer: true,
    why: 'PGCD$(a ; b) = $ PGCD$(b ; r)$ حيث $r$ باقي القسمة الإقليدية للعدد $a$ على $b$ ، وهنا $r = 10$.', check: { kind: 'step', a: 58, b: 16, q: 3, r: 10, next: [16, 10] } },
  { n: 7, skill: 'qawasim', level: 2, text: 'القواسم المشتركة للعددين 18 و 27 هي 1 ، 3 ، 9 فقط.', answer: true,
    why: 'قواسم 18: 1 ، 2 ، 3 ، 6 ، 9 ، 18؛ قواسم 27: 1 ، 3 ، 9 ، 27؛ المشتركة 1 ، 3 ، 9.', check: { kind: 'commons', a: 18, b: 27, claim: [1, 3, 9] } },
  { n: 8, skill: 'pgcd', level: 3, text: 'العدد 14 يقسم 98، إذن PGCD$(98 ; 14) = 98$.', answer: false,
    why: '98 لا يقسم 14. حين يقسم العدد الأصغر الأكبر، يكون PGCD هو الأصغر: PGCD$(98 ; 14) = 14$.', check: { kind: 'pgcd', a: 98, b: 14, claim: 98 } },
  { n: 9, skill: 'iqlidus', level: 3, text: 'في خوارزمية إقليدس للعددين 132 و 54 كانت الباقيات 24 ثم 6 ثم 0، إذن PGCD$(132 ; 54) = 0$.', answer: false,
    why: 'الصفر لا يقسم 132: PGCD هو آخر باقٍ غير معدوم، أي 6.', check: { kind: 'euclidLast', a: 132, b: 54, claim: 0 } },
  { n: 10, skill: 'qawasim', level: 3, text: 'يمكن توزيع 35 قلمًا و 50 كرّاسًا بالتساوي على 10 مدارس دون أن يبقى شيء.', answer: false,
    why: '10 يقسم 50 ولا يقسم 35: تبقى 5 أقلام. عدد المدارس يجب أن يقسم العددين معًا.', check: { kind: 'share', a: 35, b: 50, k: 10 } },
].map((it) => ({ ...it, source: addition('prerequisite_diagnostic') }));

/** La leçon de l'unité à réviser pour chaque كفاءة (Module00Astaidd › skills, carte « راجع ») — trois leçons de l'unité. */
export const PREP_LESSON = { qawasim: 'qasim-mushtarak-akbar', pgcd: 'tayin-pgcd', iqlidus: 'bahth-pgcd' };

/** Les paires que l'échelle montre (lues par la règle des collisions de content/mission.test.js). */
export const PREP_PAIRS = PREP_LADDER.filter((it) => it.check.a != null).map((it) => ({ n: it.n, a: it.check.a, b: it.check.b }));
