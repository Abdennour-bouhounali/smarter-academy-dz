/**
 * La carte PROGRESSIVE du درس 5 — تعيين القاسم المشترك الأكبر لعددين طبيعيين.
 * Contrat : docs/architecture/KNOWLEDGE_MAP.md, Part A ; référence :
 * qasim-adad-tabii/knowledgeGraph.js.
 *
 * Sources : le manuel (content/textbook.js : نشاط 5 p. 8, النتائج المباشرة
 * p. 12), l'exercice 22 et son `commonError` (content/exercises.js), les
 * corrections du module 2. L'exemple 42 et 60 est CALCULÉ à partir des
 * nombres de l'activité.
 *
 * « انتبه » — PGCD(a ; 0) = a : le module 2 et l'évaluation proposent « 0 »
 * comme distracteur, mais la leçon n'explique pas POURQUOI (elle énonce la
 * règle). Sans « لماذا؟ », ce n'est pas un خطأ شائع (A.6) : c'est un point
 * d'attention, cité tel que le manuel l'écrit.
 *
 *                     [تعيين PGCD]                       مفهوم
 *                   نعيّنه بـ │
 *                   [بحصر القواسم]                        طريقة
 *                مثال ┌─────┴─────┐ في حالات خاصّة
 *             [42 و 60]       [نتائج مباشرة]              علاقة
 *              انتبه إلى ┌────────┤ منها
 *         ⚠️ [PGCD مع 0]    [إذا كان b يقسم a]            علاقة
 *                   │               │ خطأ شائع
 *                   │         ⛔ [اختيار 45]
 *                   └─────┬─────────┘ نستخلص
 *                 🎯 [طريقتان للتعيين]
 */
import { ACTIVITY, RESULTS } from './content/textbook';
import { EX } from './content/exercises';

const divisorsOf = (n) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const { a, b } = ACTIVITY.numbers;
const common = divisorsOf(a).filter((d) => b % d === 0);
const stripNum = (s) => s.replace(/^\d\)\s*/, '');

const ex22 = EX['ex-22'];
// L'explication de l'exercice 22, jusqu'à la réponse (« … يبقى 50. ») ; la
// suite discute les bornes et n'éclaire pas l'erreur.
const ex22Right = `${ex22.question.explain.split('. ').slice(0, 2).join('. ')}.`;

export const KNOWLEDGE_GRAPH = {
  root: 'tayin',
  nodes: [
    {
      id: 'tayin', kind: 'concept', lane: 'center', requires: 'tayin-bil-hasr',
      title: 'تعيين PGCD', subtitle: `PGCD$(${a} ; ${b})$`,
      // Les trois questions de l'activité 5 : elles SONT les trois étapes.
      context: { list: ACTIVITY.questions.map(stripNum) },
      reveals: ['hasr'],
    },
    {
      id: 'hasr', kind: 'method', lane: 'center', requires: 'tayin-bil-hasr', notebook: true,
      title: 'بحصر القواسم', subtitle: 'قواسم ← مشتركة ← أكبرها',
      reveals: ['ex4260', 'nataij'],
    },
    {
      id: 'ex4260', kind: 'example', lane: 'start', requires: 'tayin-bil-hasr',
      title: `${a} و ${b}`, subtitle: `PGCD$(${a} ; ${b}) = ${gcd(a, b)}$`,
      context: {
        list: [
          `قواسم ${a}: ${divisorsOf(a).join(' ، ')}`,
          `قواسم ${b}: ${divisorsOf(b).join(' ، ')}`,
          `القواسم المشتركة: ${common.join(' ، ')}`,
        ],
        formula: `PGCD$(${a} ; ${b}) = ${Math.max(...common)}$`,
      },
      reveals: [],
    },
    {
      id: 'nataij', kind: 'relationship', lane: 'end', requires: 'nataij-mubashira', notebook: true,
      title: 'نتائج مباشرة', subtitle: 'PGCD$(a ; a) = a$',
      context: { text: RESULTS.intro, list: RESULTS.items, note: RESULTS.examples.join(' ؛ ') },
      reveals: ['sifr', 'idha'],
    },
    {
      // ⚠️ انتبه — le « 0 » proposé au module 2 (PGCD(7 ; 0)) et à l'évaluation.
      id: 'sifr', kind: 'warning', lane: 'start', requires: 'nataij-mubashira',
      title: 'PGCD مع 0', subtitle: 'PGCD$(a ; 0) = a$',
      context: { text: RESULTS.items[1], note: RESULTS.examples[1] },
      reveals: [],
    },
    {
      id: 'idha', kind: 'relationship', lane: 'end', requires: 'pgcd-idha-qasim', notebook: true,
      title: 'إذا كان b يقسم a', subtitle: 'PGCD$(a ; b) = b$',
      context: { text: RESULTS.items[2], note: RESULTS.examples[2] },
      reveals: ['khata-45'],
    },
    {
      // ⛔ خطأ شائع — l'exercice 22 : son `commonError`, la correction de 45
      // (`explainFor`) et la réponse du manuel.
      id: 'khata-45', kind: 'common_mistake', lane: 'end', requires: 'pgcd-idha-qasim',
      title: 'اختيار 45', subtitle: 'PGCD$(45 ; 15) = 15$',
      context: {
        parts: [
          { role: 'wrong', text: ex22.commonError },
          { role: 'why', text: ex22.question.explainFor(45) },
          { role: 'right', text: ex22Right },
        ],
      },
      reveals: ['khulasa'],
    },
    {
      // 🎯 خلاصة — les deux items, réunis.
      id: 'khulasa', kind: 'takeaway', lane: 'center', requires: 'nataij-mubashira',
      title: 'طريقتان للتعيين', subtitle: 'الحصر أو نتيجة مباشرة',
      context: {
        text: 'في الحالة العامة نحصر قواسم كل عدد، ثم القواسم المشتركة، ونأخذ أكبرها. وفي الحالات الخاصة نعرف PGCD مباشرة، دون أي قائمة.',
      },
      reveals: [],
    },
  ],
  edges: [
    { from: 'tayin', to: 'hasr', label: 'نعيّنه بـ' },
    { from: 'hasr', to: 'ex4260', label: 'مثال' },
    // Module 2 : « في حالات خاصة نعرف PGCD دون كتابة أي قائمة ».
    { from: 'hasr', to: 'nataij', label: 'في حالات خاصّة' },
    { from: 'nataij', to: 'sifr', label: 'انتبه إلى' },
    { from: 'nataij', to: 'idha', label: 'منها' },
    { from: 'idha', to: 'khata-45', label: 'خطأ شائع' },
    { from: 'sifr', to: 'khulasa', label: 'نستخلص' },
    { from: 'khata-45', to: 'khulasa', label: 'نستخلص' },
  ],
};
