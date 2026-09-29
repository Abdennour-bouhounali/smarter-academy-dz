/**
 * La carte PROGRESSIVE du درس 3 — خواص قواسم عدد طبيعي.
 * Contrat : docs/architecture/KNOWLEDGE_MAP.md, Part A ; référence :
 * qasim-adad-tabii/knowledgeGraph.js.
 *
 * Sources : le manuel (content/textbook.js : نشاط 3 p. 8, معارف 2 p. 10,
 * أتعلّم البرهنة p. 11), les exercices 12, 13, 15 et leurs `commonError`
 * (content/exercises.js), la question 1 du module 3. Les trois cas de
 * l'activité sont CALCULÉS à partir des nombres du manuel.
 *
 * L'item « تذكير: n يقسم a » est un تذكّر (prerequisite) ; les deux
 * propriétés sont des علاقة ; la démarche de preuve et « إيجاد k » des طريقة.
 * « نصيحة » : exercice 13 — son `commonError` (« إعادة القسمة كاملة بدل
 * استعمال الخاصية ») n'est pas une erreur mathématique mais une perte de
 * temps : c'est une stratégie, donc une نصيحة, pas un خطأ شائع.
 * Écarté : la réciproque du تخمين (distracteur du module 1) — la leçon ne
 * donne aucun contre-exemple, et un خطأ شائع doit dire POURQUOI.
 *
 *                     [قاسم مشترك لعددين]                    مفهوم
 *                        نجرّب │
 *                        [ثلاث حالات]                        مثال
 *                  تذكّر ┌─────┴─────┐ نلاحظ
 *              📌 [معنى «يقسم»]      [التخمين]               فكرة أساسية
 *                                    │ يصبح خاصية
 *                          [خاصية 1]                         علاقة
 *              نستعملها ┌───┴───┐ الباقي فرق
 *          💡 [دون إجراء القسمة]  [خاصية 2]                  علاقة
 *                ↓ خطأ شائع        │ نبرهن عليها
 *          ⛔ [يتعلق بـ n؟]       [إذا … فإنّ …]              طريقة
 *                 خطأ شائع ┌───────┤ يكفي
 *          ⛔ [الشرط أم النتيجة؟]  [إيجاد k]                  طريقة
 *                     │            │ مثال
 *                     │        [برهان الكتاب]                مثال
 *                     └──┬─────────┘ نستخلص
 *                  🎯 [قاسم مشترك يقسم…]
 */
import { ACTIVITY, KNOWLEDGE, PROOF } from './content/textbook';
import { EX } from './content/exercises';

const [p1, p2] = KNOWLEDGE.properties;
const div2 = p2.division;
const stripLabel = (s) => s.replace(/^(أ|ب|جـ)\)\s*/, '');

// نشاط 3 : pour chaque cas, n divise a + b, a − b et le reste de a par b —
// les égalités se CALCULENT, elles ne sont pas recopiées.
const caseLine = ({ a, b, n }) => {
  const q = Math.floor(a / b);
  const r = a % b;
  return `$n = ${n}$: $${a} + ${b} = ${a + b} = ${n} \\times ${(a + b) / n}$ ، $${a} - ${b} = ${a - b} = ${n} \\times ${(a - b) / n}$ ، $${a} = ${b} \\times ${q} + ${r}$ و $${r} = ${n} \\times ${r / n}$`;
};
const [case1] = ACTIVITY.cases;

const ex12 = EX['ex-12'];
const ex13 = EX['ex-13'];
const ex15 = EX['ex-15'];
// « الاعتقاد أن … : الفرق ثابت مهما كان n » — l'erreur, puis sa raison.
const [ex15Wrong, ex15Why] = ex15.commonError.split(': ');

export const KNOWLEDGE_GRAPH = {
  root: 'khawass',
  nodes: [
    {
      id: 'khawass', kind: 'concept', lane: 'center', requires: 'qasim-mushtarak-rappel',
      title: 'قاسم مشترك لعددين', subtitle: '$n$ يقسم $a$ و $b$',
      // La question du module 1 (« n يقسم a و b. ماذا يقسم أيضًا؟ »).
      context: { text: '$n$ يقسم كلا من العددين $a$ و $b$. ماذا يقسم أيضًا؟' },
      reveals: ['thalath'],
    },
    {
      id: 'thalath', kind: 'example', lane: 'center', requires: 'qasim-mushtarak-rappel',
      title: 'ثلاث حالات', subtitle: `$${case1.n}$ يقسم $${case1.a}$ و $${case1.b}$`,
      context: { text: stripLabel(ACTIVITY.questions[1]), list: ACTIVITY.cases.map(caseLine), note: stripLabel(ACTIVITY.questions[2]) },
      reveals: ['rappel', 'takhmin'],
    },
    {
      // 📌 تذكّر — l'item « تذكير » du module 1 (définition du درس 1).
      id: 'rappel', kind: 'prerequisite', lane: 'start', requires: 'qasim-mushtarak-rappel', notebook: true,
      title: 'معنى «يقسم»', subtitle: '$a = n \\times q$',
      reveals: [],
    },
    {
      id: 'takhmin', kind: 'idea', lane: 'end', requires: 'qasim-mushtarak-rappel',
      title: 'التخمين', subtitle: 'إذا … فإنّ …',
      context: { list: ACTIVITY.conjectures.map((c) => c.full) },
      reveals: ['k1'],
    },
    {
      id: 'k1', kind: 'relationship', lane: 'center', requires: 'khassiya-1', notebook: true,
      title: 'خاصية 1', subtitle: '$n$ يقسم $a + b$ و $a - b$',
      context: { text: p1.text, note: p1.example },
      reveals: ['tip', 'khata-n', 'k2'],
    },
    {
      // 💡 نصيحة — exercices 12 et 13 : la propriété dispense de la division.
      id: 'tip', kind: 'tip', lane: 'start', requires: 'khassiya-1',
      title: 'دون إجراء القسمة', subtitle: '$3$ يقسم $471$ و $192$',
      context: { text: ex12.question.explain, list: [ex13.question.solution[1]] },
      reveals: [],
    },
    {
      // ⛔ خطأ شائع — l'exercice 15 : son `commonError`, son explication, sa réponse.
      id: 'khata-n', kind: 'common_mistake', lane: 'start', requires: 'khassiya-1',
      title: 'يتعلق بـ n؟', subtitle: 'الفرق 18 ثابت',
      context: {
        parts: [
          { role: 'wrong', text: `${ex15Wrong}.` },
          { role: 'why', text: ex15Why },
          { role: 'right', text: ex15.question.explain },
        ],
      },
      reveals: [],
    },
    {
      id: 'k2', kind: 'relationship', lane: 'end', requires: 'khassiya-2', notebook: true,
      title: 'خاصية 2', subtitle: 'يقسم الباقي',
      context: {
        text: p2.text,
        formula: `$${div2.dividend} = ${div2.divisor} \\times ${div2.quotient} + ${div2.remainder}$`,
        note: p2.example,
      },
      reveals: ['burhan'],
    },
    {
      id: 'burhan', kind: 'method', lane: 'end', requires: 'burhan-idha-fainna', notebook: true,
      title: 'إذا … فإنّ …', subtitle: 'نفرض الشرط',
      context: { text: PROOF.rule[0].replace(/^•\s*/, ''), note: PROOF.question },
      reveals: ['khata-shart', 'ithbat'],
    },
    {
      // ⛔ خطأ شائع — Module 3, question 1 : le distracteur « n يقسم كلا من
      // a و b » donné comme المطلوب, et son explication.
      id: 'khata-shart', kind: 'common_mistake', lane: 'start', requires: 'burhan-idha-fainna',
      title: 'الشرط أم النتيجة؟', subtitle: 'المعطيات والمطلوب',
      context: {
        parts: [
          { role: 'wrong', text: 'نعتبر «n يقسم كلا من a و b» هو المطلوب.' },
          { role: 'why', text: '«n يقسم كلا من a و b» هو الشرط (المعطيات)؛ «n يقسم a + b» هو النتيجة (المطلوب).' },
          { role: 'right', text: `${PROOF.solution[0]} ${PROOF.solution[1]}` },
        ],
      },
      reveals: [],
    },
    {
      id: 'ithbat', kind: 'method', lane: 'end', requires: 'ithbat-qasim', notebook: true,
      title: 'إيجاد k', subtitle: '$m = d \\times k$',
      context: { text: PROOF.rule[1].replace(/^•\s*/, '') },
      reveals: ['exBurhan'],
    },
    {
      id: 'exBurhan', kind: 'example', lane: 'end', requires: 'ithbat-qasim',
      title: 'برهان الكتاب', subtitle: '$a + b = n \\times k$',
      context: { text: PROOF.exercise, list: PROOF.solution.slice(4, 8) },
      reveals: ['khulasa'],
    },
    {
      // 🎯 خلاصة — les deux propriétés et la méthode de preuve, réunies.
      id: 'khulasa', kind: 'takeaway', lane: 'center', requires: 'ithbat-qasim',
      title: 'قاسم مشترك يقسم…', subtitle: 'المجموع · الفرق · الباقي',
      context: {
        text: 'إذا كان $n$ يقسم كلا من $a$ و $b$ فإنه يقسم $a + b$ و $a - b$ وكل مضاعف لهما، ويقسم باقي القسمة الإقليدية لـ $a$ على $b$.',
        note: PROOF.rule[1].replace(/^•\s*/, ''),
      },
      reveals: [],
    },
  ],
  edges: [
    { from: 'khawass', to: 'thalath', label: 'نجرّب' },
    { from: 'thalath', to: 'rappel', label: 'تذكّر' },
    { from: 'thalath', to: 'takhmin', label: 'نلاحظ' },
    // Module 1 : « التخمين الثاني … يصبح خاصية في المحور الموالي ».
    { from: 'takhmin', to: 'k1', label: 'يصبح خاصية' },
    { from: 'k1', to: 'tip', label: 'نستعملها' },
    { from: 'k1', to: 'khata-n', label: 'خطأ شائع' },
    // Module 2, question 3 : « 15 = 90 − 25 × 3 : فرق عددين يقسمهما 5 ».
    { from: 'k1', to: 'k2', label: 'الباقي فرق' },
    // Module 3 : « لماذا هو صحيح دائمًا، مهما كانت الأعداد؟ الكتاب يبرهن. »
    { from: 'k2', to: 'burhan', label: 'نبرهن عليها' },
    { from: 'burhan', to: 'khata-shart', label: 'خطأ شائع' },
    // Le manuel : « لإثبات أنّ … يقسم … يكفي إيجاد عدد طبيعي k ».
    { from: 'burhan', to: 'ithbat', label: 'يكفي' },
    { from: 'ithbat', to: 'exBurhan', label: 'مثال' },
    { from: 'khata-shart', to: 'khulasa', label: 'نستخلص' },
    { from: 'exBurhan', to: 'khulasa', label: 'نستخلص' },
  ],
};
