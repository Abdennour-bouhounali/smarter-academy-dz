/**
 * La carte PROGRESSIVE du درس « القسمة الإقليدية » (1AM) — docs/architecture/KNOWLEDGE_MAP.md, Part A.
 * Aucune mathématique n'est écrite ici : chaque texte vient de la leçon (content/textbook.js : نشاط 3 p. 37, معارف 2
 * p. 41, et les phrases de correction partagées avec les modules, `GUIDE`). Chaque nœud est gardé par l'item de
 * knowledge.jsx qui l'établit (`requires`).
 *
 * (Ordre de lecture LTR ; sous RTL le couloir `start` — la règle — est à DROITE.)
 *
 *                         [القسمة الإقليدية]                         مفهوم
 *            نتوقّف عندما ┌──────────┴──────────┐ نسمّي
 *            [متى نتوقّف؟] (M1)      [المقسوم … الباقي] (M2)
 *              مثال │                    ننجزها │
 *          [279 و 14]                 [القسمة العمودية]
 *         خطأ شائع │                        مثال │
 *     ⛔ [لا يبقى شيء؟]              [253 و 17]
 *                                     حالة خاصّة ┌───┘
 *                            [عندما يكون الباقي معدومًا]
 *                                    انتبه إلى │
 *                             ⚠️ [الباقي أصغر من المقسوم عليه]
 *                                      نستخلص │
 *                                    🎯 [الخلاصة]
 */
import { ACTIVITY, KNOWLEDGE, GUIDE } from './content/textbook';

const { example1 } = KNOWLEDGE;

export const KNOWLEDGE_GRAPH = {
  root: 'qisma',
  nodes: [
    {
      id: 'qisma', kind: 'concept', lane: 'center', requires: 'qisma-iqlidiya',
      title: 'القسمة الإقليدية', subtitle: '$a = b \\times q + r$',
      context: { text: ACTIVITY.situation, note: 'كم مجموعة كاملة نشكّل؟ وماذا يبقى؟' },
      reveals: ['qaida', 'mufradat'],
    },
    {
      id: 'qaida', kind: 'relationship', lane: 'start', requires: 'qisma-iqlidiya', notebook: true,
      title: 'متى نتوقّف؟', subtitle: '$r < b$',
      reveals: ['ex-279'],
    },
    {
      id: 'ex-279', kind: 'example', lane: 'start', requires: 'qisma-iqlidiya',
      title: '279 زهرة وباقات من 14', subtitle: '$279 = 14 \\times 19 + 13$',
      context: { text: ACTIVITY.situation, formula: '$14 \\times 19 < 279 < 14 \\times 20$' },
      reveals: ['khata-stop'],
    },
    {
      // ⛔ خطأ شائع — l'option réfutée de la découverte du labo et sa correction (`GUIDE.stop`, module 1).
      id: 'khata-stop', kind: 'common_mistake', lane: 'start', requires: 'qisma-iqlidiya',
      title: 'نتوقّف عندما لا يبقى شيء؟', subtitle: '$13 < 14$',
      context: {
        parts: [
          { role: 'wrong', text: GUIDE.stop.wrong },
          { role: 'why', text: GUIDE.stop.why },
          { role: 'right', text: GUIDE.stop.right },
        ],
      },
      reveals: [],
    },
    {
      id: 'mufradat', kind: 'term', lane: 'end', requires: 'qisma-mufradat', notebook: true,
      title: 'المقسوم … الباقي', subtitle: 'المقسوم عليه · الحاصل',
      reveals: ['amudiya'],
    },
    {
      id: 'amudiya', kind: 'method', lane: 'end', requires: 'qisma-amudiya', notebook: true,
      title: 'القسمة العمودية', subtitle: 'نقسم، نطرح، ننزل',
      reveals: ['ex-253'],
    },
    {
      id: 'ex-253', kind: 'example', lane: 'end', requires: 'qisma-amudiya',
      title: '253 لؤلؤة وعقود من 17', subtitle: '$253 = 17 \\times 14 + 15$',
      context: { text: example1.text, note: example1.conclusion },
      reveals: ['baqi'],
    },
    {
      id: 'baqi', kind: 'term', lane: 'center', requires: 'baqi-maadum', notebook: true,
      title: 'الباقي معدوم', subtitle: '$60 = 4 \\times 15$',
      reveals: ['intabih'],
    },
    {
      // ⚠️ انتبه — la condition de la définition (r < b), dite par la phrase partagée `GUIDE.remainder`.
      id: 'intabih', kind: 'warning', lane: 'center', requires: 'baqi-maadum',
      title: 'الباقي أصغر من المقسوم عليه', subtitle: '$r < b$',
      context: { text: GUIDE.remainder, note: GUIDE.stop.right },
      reveals: ['khulasa'],
    },
    {
      id: 'khulasa', kind: 'takeaway', lane: 'center', requires: 'baqi-maadum',
      title: 'الخلاصة', subtitle: 'المقسوم = المقسوم عليه × الحاصل + الباقي',
      context: { text: KNOWLEDGE.definition, note: KNOWLEDGE.remark },
      reveals: [],
    },
  ],
  edges: [
    { from: 'qisma', to: 'qaida', label: 'نتوقّف عندما' },
    { from: 'qisma', to: 'mufradat', label: 'نسمّي' },
    { from: 'qaida', to: 'ex-279', label: 'مثال' },
    { from: 'ex-279', to: 'khata-stop', label: 'خطأ شائع' },
    { from: 'mufradat', to: 'amudiya', label: 'ننجزها' },
    { from: 'amudiya', to: 'ex-253', label: 'مثال' },
    { from: 'ex-253', to: 'baqi', label: 'حالة خاصّة' },
    { from: 'baqi', to: 'intabih', label: 'انتبه إلى' },
    { from: 'intabih', to: 'khulasa', label: 'نستخلص' },
  ],
};
