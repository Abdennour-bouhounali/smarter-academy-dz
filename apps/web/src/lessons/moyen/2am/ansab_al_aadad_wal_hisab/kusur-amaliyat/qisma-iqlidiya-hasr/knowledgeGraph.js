/**
 * La carte PROGRESSIVE du درس « القسمة الإقليدية وحصر حاصل القسمة » (2AM) — docs/architecture/KNOWLEDGE_MAP.md, Part A.
 * Aucune mathématique n'est écrite ici : chaque texte vient de la leçon (content/textbook.js : نشاط 1 p. 24, معارف 1
 * p. 26, la طريقة, et les phrases de correction partagées avec les modules, `GUIDE`). Chaque nœud est gardé par l'item de
 * knowledge.jsx qui l'établit (`requires`).
 *
 *                         [حاصل القسمة بين عددين]                       مفهوم
 *            يقع بين ┌──────────────┴──────────────┐ نعرّف
 *        [المملوءة واللازمة] (M1)           [التعريف 0 ≤ r < b] (M2)
 *            مثال │                          نسمّي │
 *          [2145 و 30]                  [بالنقصان وبالزيادة]
 *         خطأ شائع │                        حالة خاصّة │
 *     ⛔ [قسمة الابن؟]                    [الباقي معدوم]
 *                                            انتبه │
 *                                   ⚠️ [يقع على عدد طبيعي]
 *                                        نحسب بـ │
 *                                     [طريقة الحصر] (M3)
 *                                        نستخلص │
 *                                       🎯 [الخلاصة]
 */
import { ACTIVITY, KNOWLEDGE, METHOD, GUIDE } from './content/textbook';

export const KNOWLEDGE_GRAPH = {
  root: 'hasr',
  nodes: [
    {
      id: 'hasr', kind: 'concept', lane: 'center', requires: 'hasr-hasil',
      title: 'الحاصل بين عددين طبيعيين', subtitle: '$q < \\frac{a}{b} < q + 1$',
      context: { text: ACTIVITY.situation, note: 'بين أيّ عددين يقع حاصل القسمة؟' },
      reveals: ['qaida', 'taarif'],
    },
    {
      id: 'qaida', kind: 'relationship', lane: 'start', requires: 'hasr-hasil', notebook: true,
      title: 'المملوءة واللازمة', subtitle: '$71 < \\frac{2145}{30} < 72$',
      reveals: ['ex-2145'],
    },
    {
      id: 'ex-2145', kind: 'example', lane: 'start', requires: 'hasr-hasil',
      title: '2145 بيضة في صفائح من 30', subtitle: '$2145 = 30 \\times 71 + 15$',
      context: { text: ACTIVITY.situation, formula: '$71 < \\frac{2145}{30} < 72$' },
      reveals: ['khata-son'],
    },
    {
      // ⛔ خطأ شائع — la division du fils du manuel (question 4 de نشاط 1) et sa correction (`GUIDE.son`, module 1).
      id: 'khata-son', kind: 'common_mistake', lane: 'start', requires: 'hasr-hasil',
      title: 'قسمة الابن: 70 والباقي 45؟', subtitle: '$45 > 30$',
      context: {
        parts: [
          { role: 'wrong', text: GUIDE.son.wrong },
          { role: 'why', text: GUIDE.son.why },
          { role: 'right', text: GUIDE.son.right },
        ],
      },
      reveals: [],
    },
    {
      id: 'taarif', kind: 'term', lane: 'end', requires: 'qisma-taarif', notebook: true,
      title: 'التعريف', subtitle: '$0 \\le r < b$',
      reveals: ['muqarraba'],
    },
    {
      id: 'muqarraba', kind: 'term', lane: 'end', requires: 'qiyam-muqarraba', notebook: true,
      title: 'بالنقصان وبالزيادة', subtitle: '$22 < \\frac{180}{8} < 23$',
      reveals: ['qabiliya'],
    },
    {
      id: 'qabiliya', kind: 'term', lane: 'center', requires: 'qabiliya', notebook: true,
      title: 'الباقي معدوم', subtitle: 'يقبل القسمة · مضاعف · يقسم',
      reveals: ['intabih'],
    },
    {
      // ⚠️ انتبه — le cas r = 0 : le quotient tombe SUR un entier (`GUIDE.exact`, modules 1 et 2).
      id: 'intabih', kind: 'warning', lane: 'center', requires: 'qabiliya',
      title: 'الحاصل عدد طبيعي', subtitle: '$\\frac{2160}{30} = 72$',
      context: { text: GUIDE.exact, note: KNOWLEDGE.divisibility },
      reveals: ['tariqa'],
    },
    {
      id: 'tariqa', kind: 'method', lane: 'center', requires: 'hasr-tariqa', notebook: true,
      title: 'طريقة الحصر', subtitle: '× 100 ، × 10 ، × 1',
      reveals: ['khulasa'],
    },
    {
      id: 'khulasa', kind: 'takeaway', lane: 'center', requires: 'hasr-tariqa',
      title: 'الخلاصة', subtitle: '$a = b \\times q + r$ ، $q < \\frac{a}{b} < q + 1$',
      context: { text: KNOWLEDGE.definition, note: METHOD.rule },
      reveals: [],
    },
  ],
  edges: [
    { from: 'hasr', to: 'qaida', label: 'يقع بين' },
    { from: 'hasr', to: 'taarif', label: 'نعرّف' },
    { from: 'qaida', to: 'ex-2145', label: 'مثال' },
    { from: 'ex-2145', to: 'khata-son', label: 'خطأ شائع' },
    { from: 'taarif', to: 'muqarraba', label: 'نسمّي' },
    { from: 'muqarraba', to: 'qabiliya', label: 'حالة خاصّة' },
    { from: 'qabiliya', to: 'intabih', label: 'انتبه' },
    { from: 'intabih', to: 'tariqa', label: 'نحسب بـ' },
    { from: 'tariqa', to: 'khulasa', label: 'نستخلص' },
  ],
};
