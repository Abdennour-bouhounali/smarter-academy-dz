/**
 * La carte PROGRESSIVE du درس 6 — البحث عن القاسم المشترك الأكبر لعددين طبيعيين.
 * Contrat : docs/architecture/KNOWLEDGE_MAP.md, Part A ; référence :
 * qasim-adad-tabii/knowledgeGraph.js.
 *
 * Sources : le manuel (content/textbook.js : نشاط 6 أ و ب p. 9, خاصيتان p. 12,
 * طرائق p. 13), les corrections des modules 1 et 2, l'évaluation. Les deux
 * exemples de l'activité (252 et 140 par différences, 765 et 135 par
 * divisions) sont CALCULÉS à partir des nombres du manuel.
 *
 * Deux تذكّر : la leçon repose explicitement sur les خاصية 1 et 2 du درس 3
 * (priorKnowledge ; « خاصية 1 (الدرس 3) » dans la correction du module 1,
 * « الخاصية 2 » dans celle du module 2) — chacune avant l'idée qu'elle fonde.
 * L'item « أي طريقة أختار؟ » est une نصيحة (une stratégie de résolution).
 * Écarté : l'erreur du défi (« عدد المدارس / حصة كل مدرسة ») — elle porte
 * sur la mise en équation d'un problème, pas sur les deux algorithmes.
 *
 *                   [البحث عن PGCD]                      مفهوم
 *                    بالطرح │
 *                   [خاصية الفرق]                         علاقة
 *              تذكّر ┌─────┴─────┐ نكرّرها
 *      📌 [خاصية 1]        [الفروق المتتابعة]              طريقة
 *                                  │ مثال
 *                              [252 و 140]
 *                                  │ خطأ شائع
 *                          ⛔ [آخر فرق هو 0؟]
 *                نختصر الطرحات ┆ (couloir central)
 *                   [خاصية الباقي]                        علاقة
 *              تذكّر ┌─────┴─────┐ نكرّرها
 *      📌 [خاصية 2]        [خوارزمية إقليدس]               طريقة
 *                                  │ مثال
 *                              [765 و 135]
 *                                  │ نقارن
 *                          💡 [أي طريقة أختار؟]
 *                                  │ نستخلص
 *                        🎯 [طريقتان، نتيجة واحدة]
 */
import { ACTIVITY_A, ACTIVITY_B, PROPERTIES, METHOD_DIFF, METHOD_EUCLID } from './content/textbook';

const [pd, pr] = PROPERTIES.items;

/**
 * Les différences successives, comptées COMME LE MANUEL : jusqu'à la
 * différence nulle comprise (« 13 − 13 = 0 » ; « ثمان خطوات » pour 765 et 135).
 * Le PGCD est le dernier nombre non nul.
 */
function differences(a, b) {
  const steps = [];
  let [x, y] = [Math.max(a, b), Math.min(a, b)];
  while (y !== 0) {
    steps.push(`$${x} - ${y} = ${x - y}$`);
    [x, y] = [Math.max(y, x - y), Math.min(y, x - y)];
  }
  return { steps, pgcd: x };
}
/** Les divisions euclidiennes successives, jusqu'au reste nul. */
function euclid(a, b) {
  const steps = [];
  let [x, y] = [Math.max(a, b), Math.min(a, b)];
  while (y !== 0) {
    steps.push(`$${x} = ${y} \\times ${Math.floor(x / y)} + ${x % y}$`);
    [x, y] = [y, x % y];
  }
  return { steps, pgcd: x };
}

const diffA = differences(ACTIVITY_A.numbers.a, ACTIVITY_A.numbers.b);
const divB = euclid(ACTIVITY_B.numbers.a, ACTIVITY_B.numbers.b);
const diffB = differences(ACTIVITY_B.numbers.a, ACTIVITY_B.numbers.b);
const pgcdOf = (a, b, v) => `PGCD$(${a} ; ${b}) = ${v}$`;

export const KNOWLEDGE_GRAPH = {
  root: 'bahth',
  nodes: [
    {
      id: 'bahth', kind: 'concept', lane: 'center', requires: 'pgcd-farq',
      title: 'البحث عن PGCD', subtitle: 'دون حصر القواسم',
      context: { text: ACTIVITY_A.intro, note: ACTIVITY_A.subtitle.replace(/^أ\)\s*/, '') },
      reveals: ['farq'],
    },
    {
      id: 'farq', kind: 'relationship', lane: 'center', requires: 'pgcd-farq', notebook: true,
      title: 'خاصية الفرق', subtitle: 'PGCD$(a ; b) = $ PGCD$(b ; a - b)$',
      context: { text: pd.text, note: pd.example },
      reveals: ['tadhakkar1', 'furuq'],
    },
    {
      // 📌 تذكّر — la correction de la question 1 du module 1.
      id: 'tadhakkar1', kind: 'prerequisite', lane: 'start', requires: 'pgcd-farq',
      title: 'خاصية 1', subtitle: 'القاسم المشترك يقسم الفرق',
      context: {
        text: 'خاصية 1 (الدرس 3): القاسم المشترك يقسم الفرق. والعكس صحيح: قاسم مشترك لـ 140 و 112 يقسم مجموعهما 252.',
        note: 'كل قاسم مشترك لـ 252 و 140 يقسم أيضًا $252 - 140 = 112$، فللزوجين نفس القواسم المشتركة.',
      },
      reveals: [],
    },
    {
      id: 'furuq', kind: 'method', lane: 'end', requires: 'khwarizmiyat-al-furuq', notebook: true,
      title: 'الفروق المتتابعة', subtitle: 'آخر فرق غير معدوم',
      context: { text: METHOD_DIFF.remark, note: METHOD_DIFF.solution[METHOD_DIFF.solution.length - 1] },
      reveals: ['ex252', 'baqi'],
    },
    {
      id: 'ex252', kind: 'example', lane: 'end', requires: 'khwarizmiyat-al-furuq',
      title: `${ACTIVITY_A.numbers.a} و ${ACTIVITY_A.numbers.b}`,
      subtitle: `PGCD $= ${diffA.pgcd}$`,
      // La coquille du manuel (ACTIVITY_A.misprint) reste au module 1, où l'élève
      // remplit la chaîne : c'est un erratum, pas une connaissance.
      context: { list: diffA.steps, formula: pgcdOf(ACTIVITY_A.numbers.a, ACTIVITY_A.numbers.b, diffA.pgcd) },
      reveals: ['khata-sifr'],
    },
    {
      // ⛔ خطأ شائع — l'évaluation (E2) propose « 0 » comme PGCD ; la solution
      // du manuel montre que le dernier pas (13 − 13 = 0) donne PGCD(13 ; 13) = 13.
      id: 'khata-sifr', kind: 'common_mistake', lane: 'end', requires: 'khwarizmiyat-al-furuq',
      title: 'آخر فرق هو 0؟', subtitle: 'آخر فرق غير معدوم',
      context: {
        parts: [
          { role: 'wrong', text: 'نأخذ آخر فرق، 0، قاسمًا مشتركًا أكبر.' },
          { role: 'why', text: METHOD_DIFF.solution[6] },
          { role: 'right', text: METHOD_DIFF.remark },
        ],
      },
      reveals: [],
    },
    {
      id: 'baqi', kind: 'relationship', lane: 'center', requires: 'pgcd-baqi', notebook: true,
      title: 'خاصية الباقي', subtitle: 'PGCD$(a ; b) = $ PGCD$(b ; r)$',
      context: { text: pr.text, note: pr.example },
      reveals: ['tadhakkar2', 'iqlidus'],
    },
    {
      // 📌 تذكّر — la correction de la question 3 du module 2.
      id: 'tadhakkar2', kind: 'prerequisite', lane: 'start', requires: 'pgcd-baqi',
      title: 'خاصية 2', subtitle: 'القاسم المشترك يقسم الباقي',
      context: {
        text: 'الطرح مرتين ($45 - 18 - 18 = 9$) هو القسمة الإقليدية $45 = 18 \\times 2 + 9$؛ الخاصية 2 تقول إن القاسم المشترك يقسم الباقي.',
      },
      reveals: [],
    },
    {
      id: 'iqlidus', kind: 'method', lane: 'end', requires: 'khwarizmiyat-iqlidus', notebook: true,
      title: 'خوارزمية إقليدس', subtitle: 'آخر باقٍ غير معدوم',
      context: { text: METHOD_EUCLID.remark, list: METHOD_EUCLID.solution.slice(1, 4) },
      reveals: ['ex765'],
    },
    {
      id: 'ex765', kind: 'example', lane: 'end', requires: 'khwarizmiyat-iqlidus',
      title: `${ACTIVITY_B.numbers.a} و ${ACTIVITY_B.numbers.b}`,
      subtitle: `PGCD $= ${divB.pgcd}$`,
      context: {
        list: divB.steps,
        note: `${divB.steps.length} قسمات بدل ${diffB.steps.length} فروق، والنتيجة واحدة: ${divB.pgcd}.`,
      },
      reveals: ['ikhtiyar'],
    },
    {
      id: 'ikhtiyar', kind: 'tip', lane: 'end', requires: 'ikhtiyar-al-tariqa', notebook: true,
      title: 'أي طريقة أختار؟', subtitle: 'إقليدس أقصر',
      reveals: ['khulasa'],
    },
    {
      // 🎯 خلاصة — la règle et les deux remarques de la page طرائق, telles quelles.
      id: 'khulasa', kind: 'takeaway', lane: 'center', requires: 'khwarizmiyat-iqlidus',
      title: 'طريقتان، نتيجة واحدة', subtitle: 'الفروق أو القسمات',
      context: { text: METHOD_EUCLID.rule, list: [METHOD_DIFF.remark, METHOD_EUCLID.remark] },
      reveals: [],
    },
  ],
  edges: [
    { from: 'bahth', to: 'farq', label: 'بالطرح' },
    { from: 'farq', to: 'tadhakkar1', label: 'تذكّر' },
    { from: 'farq', to: 'furuq', label: 'نكرّرها' },
    { from: 'furuq', to: 'ex252', label: 'مثال' },
    { from: 'ex252', to: 'khata-sifr', label: 'خطأ شائع' },
    // Module 2 : « عدة طرحات متتابعة للعدد نفسه هي قسمة واحدة ».
    { from: 'furuq', to: 'baqi', label: 'نختصر الطرحات' },
    { from: 'baqi', to: 'tadhakkar2', label: 'تذكّر' },
    { from: 'baqi', to: 'iqlidus', label: 'نكرّرها' },
    { from: 'iqlidus', to: 'ex765', label: 'مثال' },
    { from: 'ex765', to: 'ikhtiyar', label: 'نقارن' },
    { from: 'ikhtiyar', to: 'khulasa', label: 'نستخلص' },
  ],
};
