/**
 * La carte PROGRESSIVE du درس « قواعد قابلية القسمة » (1AM) — docs/architecture/KNOWLEDGE_MAP.md, Part A.
 * Aucune mathématique écrite ici : les textes viennent de content/textbook.js (نشاط 4, معارف 3, طريقة p. 42, la règle de 9
 * déclarée, les phrases de correction `GUIDE` partagées avec les modules).
 *
 * (Ordre de lecture LTR ; sous RTL le couloir `start` est à DROITE.)
 *
 *                       [قابلية القسمة]                              مفهوم
 *          رقم الآحاد ┌───────┴───────┐ مجموع الأرقام
 *            [على 2 وعلى 5] (M1)      [على 3] (M1)
 *              مثال │                خطأ شائع │
 *         [أمثلة الكتاب]        ⛔ [رقم الآحاد يكفي؟]
 *                                    وأيضًا │
 *                                    [على 9] (M2)
 *                          أي ┌──────────┘
 *              [معنى «يقبل القسمة على»] (M2)
 *                  ولـ 4 │
 *              [القسمة على 4] (M3)
 *           خطأ شائع ┌───┘
 *     ⛔ [عدد زوجي إذن يقبل القسمة على 4؟]
 *                 نستخلص └───┐
 *                         🎯 [الخلاصة]
 */
import { ACTIVITY, KNOWLEDGE, GUIDE, METHOD } from './content/textbook';

export const KNOWLEDGE_GRAPH = {
  root: 'qabiliya',
  nodes: [
    {
      id: 'qabiliya', kind: 'concept', lane: 'center', requires: 'qabiliya-2-5',
      title: 'قابلية القسمة', subtitle: 'دون أن نقسم',
      context: { text: ACTIVITY.text, note: 'لوّنا المضاعفات ونظرنا إلى أرقامها.' },
      reveals: ['r25', 'r3'],
    },
    {
      id: 'r25', kind: 'relationship', lane: 'start', requires: 'qabiliya-2-5', notebook: true,
      title: 'على 2 وعلى 5', subtitle: 'رقم الآحاد',
      reveals: ['ex25'],
    },
    {
      id: 'ex25', kind: 'example', lane: 'start', requires: 'qabiliya-2-5',
      title: 'أمثلة الكتاب', subtitle: '2014 ، 2325',
      context: { text: KNOWLEDGE.examples[0], note: KNOWLEDGE.examples[1] },
      reveals: [],
    },
    {
      id: 'r3', kind: 'relationship', lane: 'end', requires: 'qabiliya-3', notebook: true,
      title: 'على 3', subtitle: 'مجموع الأرقام',
      reveals: ['khata3'],
    },
    {
      // ⛔ خطأ شائع — l'option réfutée de la découverte (« رقم الآحاد للقسمة على 3 ») et sa correction (`GUIDE.units3`).
      id: 'khata3', kind: 'common_mistake', lane: 'end', requires: 'qabiliya-3',
      title: 'رقم الآحاد يكفي لـ 3؟', subtitle: '$1 + 3 = 4$',
      context: {
        parts: [
          { role: 'wrong', text: GUIDE.units3.wrong },
          { role: 'why', text: GUIDE.units3.why },
          { role: 'right', text: GUIDE.units3.right },
        ],
      },
      reveals: ['r9'],
    },
    {
      id: 'r9', kind: 'relationship', lane: 'end', requires: 'qabiliya-9', notebook: true,
      title: 'على 9', subtitle: 'مجموع الأرقام',
      reveals: ['baqi'],
    },
    {
      id: 'baqi', kind: 'concept', lane: 'center', requires: 'qabiliya-baqi', notebook: true,
      title: 'معنى «يقبل القسمة على»', subtitle: '$r = 0$',
      reveals: ['r4'],
    },
    {
      id: 'r4', kind: 'method', lane: 'center', requires: 'qabiliya-4', notebook: true,
      title: 'القسمة على 4', subtitle: 'الرقمان الأخيران',
      reveals: ['khata4'],
    },
    {
      // ⛔ خطأ شائع — l'exercice 24 et l'exemple 2018 de la طريقة (`GUIDE.even4`).
      id: 'khata4', kind: 'common_mistake', lane: 'start', requires: 'qabiliya-4',
      title: 'زوجي إذن يقبل القسمة على 4؟', subtitle: '$18 = 4 \\times 4 + 2$',
      context: {
        parts: [
          { role: 'wrong', text: GUIDE.even4.wrong },
          { role: 'why', text: GUIDE.even4.why },
          { role: 'right', text: GUIDE.even4.right },
        ],
      },
      reveals: ['khulasa'],
    },
    {
      id: 'khulasa', kind: 'takeaway', lane: 'center', requires: 'qabiliya-4',
      title: 'الخلاصة', subtitle: '2 ، 5 · 3 ، 9 · 4',
      context: { text: GUIDE.order, note: METHOD.box },
      reveals: [],
    },
  ],
  edges: [
    { from: 'qabiliya', to: 'r25', label: 'رقم الآحاد' },
    { from: 'qabiliya', to: 'r3', label: 'مجموع الأرقام' },
    { from: 'r25', to: 'ex25', label: 'مثال' },
    { from: 'r3', to: 'khata3', label: 'خطأ شائع' },
    { from: 'khata3', to: 'r9', label: 'وأيضًا' },
    { from: 'r9', to: 'baqi', label: 'أي' },
    { from: 'baqi', to: 'r4', label: 'ولـ 4' },
    { from: 'r4', to: 'khata4', label: 'خطأ شائع' },
    { from: 'khata4', to: 'khulasa', label: 'نستخلص' },
  ],
};
