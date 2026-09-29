/**
 * La carte PROGRESSIVE du درس 4 — القاسم المشترك الأكبر لعددين طبيعيين.
 * Contrat : docs/architecture/KNOWLEDGE_MAP.md, Part A ; référence :
 * qasim-adad-tabii/knowledgeGraph.js.
 *
 * Sources : le manuel (content/textbook.js : نشاط 4 p. 8, معارف 3 p. 10,
 * معارف 4 p. 12), l'exercice 10 et son `commonError` (content/exercises.js).
 * La chaîne du module 2 — « قواسم → قواسم مشتركة → القاسم المشترك الأكبر :
 * ثلاث كلمات لا يجوز خلطها » — est l'épine dorsale de la carte.
 *
 * Une seule erreur fréquente : celle de l'exercice 10 (« لا قاسم مشترك »).
 * Le distracteur « أصغر عدد يقسم العددين » de l'évaluation dit la même chose
 * par l'autre bout (1 est toujours le plus petit) : fusionné, pas doublé.
 *
 *                 [القاسم المشترك الأكبر]                 مفهوم
 *                     يعتمد على │
 *                    [القواسم المشتركة]                   تعريف
 *                مثال ┌─────┴─────┐ أكبرها
 *             [12 و 18]      [أكبر قاسم مشترك]            تعريف
 *          خطأ شائع │              │ نرمز له
 *      ⛔ [لا قاسم مشترك؟]    [الرمز PGCD]                 مصطلحات
 *                                  │ مثال
 *                              [28 و 42]
 *                         نلاحظ ┆ (couloir central)
 *            [القواسم المشتركة = قواسم PGCD]              علاقة
 *                        نستخلص │
 *                    🎯 [ثلاث كلمات]
 */
import { ACTIVITY, KNOWLEDGE_3, KNOWLEDGE_4 } from './content/textbook';
import { EX } from './content/exercises';

const ex10 = EX['ex-10'];
const [ex10Wrong] = ex10.question.options.slice(-1);
const stripLabel = (s) => s.replace(/^ب\)\s*1\)\s*/, '');

export const KNOWLEDGE_GRAPH = {
  root: 'pgcd',
  nodes: [
    {
      id: 'pgcd', kind: 'concept', lane: 'center', requires: 'qawasim-mushtaraka',
      title: 'القاسم المشترك الأكبر', subtitle: 'باقات متماثلة',
      // La situation de l'activité 4, puis sa question ب) 1).
      context: { text: ACTIVITY.situation.replace(/^أ\)\s*/, ''), note: stripLabel(ACTIVITY.questions[3]) },
      reveals: ['mushtaraka'],
    },
    {
      id: 'mushtaraka', kind: 'definition', lane: 'center', requires: 'qawasim-mushtaraka', notebook: true,
      title: 'القواسم المشتركة', subtitle: 'تقسم $a$ و $b$ معًا',
      context: { text: KNOWLEDGE_3.definition },
      reveals: ['ex1218', 'taarif'],
    },
    {
      id: 'ex1218', kind: 'example', lane: 'start', requires: 'qawasim-mushtaraka',
      title: '12 و 18', subtitle: '1 ، 2 ، 3 ، 6',
      context: { text: KNOWLEDGE_3.example },
      reveals: ['khata-la'],
    },
    {
      // ⛔ خطأ شائع — l'exercice 10 : le distracteur « لا قاسم مشترك لهما »,
      // le `commonError` qui dit pourquoi, et l'explication de la réponse.
      id: 'khata-la', kind: 'common_mistake', lane: 'start', requires: 'qawasim-mushtaraka',
      title: 'لا قاسم مشترك؟', subtitle: '1 قاسم مشترك دائمًا',
      context: {
        parts: [
          { role: 'wrong', text: `155 و 141: ${ex10Wrong}.` },
          { role: 'why', text: ex10.commonError },
          { role: 'right', text: ex10.question.explain },
        ],
      },
      reveals: [],
    },
    {
      id: 'taarif', kind: 'definition', lane: 'end', requires: 'pgcd-taarif', notebook: true,
      title: 'أكبر قاسم مشترك', subtitle: 'القاسم المشترك الأكبر',
      context: { text: KNOWLEDGE_4.definition },
      reveals: ['ramz'],
    },
    {
      id: 'ramz', kind: 'term', lane: 'end', requires: 'pgcd-ramz', notebook: true,
      title: 'الرمز PGCD', subtitle: 'PGCD$(a ; b)$',
      reveals: ['ex2842'],
    },
    {
      id: 'ex2842', kind: 'example', lane: 'end', requires: 'pgcd-taarif',
      title: '28 و 42', subtitle: 'PGCD$(28 ; 42) = 14$',
      context: { text: KNOWLEDGE_4.example },
      reveals: ['mulahaza'],
    },
    {
      id: 'mulahaza', kind: 'relationship', lane: 'center', requires: 'qawasim-al-pgcd', notebook: true,
      title: 'قواسم الـ PGCD', subtitle: 'هي القواسم المشتركة',
      context: { text: KNOWLEDGE_4.remark },
      reveals: ['khulasa'],
    },
    {
      // 🎯 خلاصة — les deux définitions et la remarque du manuel, réunies :
      // « ثلاث كلمات لا يجوز خلطها » (module 2).
      id: 'khulasa', kind: 'takeaway', lane: 'center', requires: 'qawasim-al-pgcd',
      title: 'ثلاث كلمات', subtitle: 'قواسم ← مشتركة ← الأكبر',
      context: {
        text: 'القواسم المشتركة لعددين تقسمهما معًا، و 1 منها دائمًا. أكبرها هو القاسم المشترك الأكبر PGCD$(a ; b)$، والقواسم المشتركة هي بالضبط قواسمه.',
      },
      reveals: [],
    },
  ],
  edges: [
    // Module 2 : « قواسم → قواسم مشتركة → القاسم المشترك الأكبر ».
    { from: 'pgcd', to: 'mushtaraka', label: 'يعتمد على' },
    { from: 'mushtaraka', to: 'ex1218', label: 'مثال' },
    { from: 'ex1218', to: 'khata-la', label: 'خطأ شائع' },
    { from: 'mushtaraka', to: 'taarif', label: 'أكبرها' },
    { from: 'taarif', to: 'ramz', label: 'نرمز له' },
    { from: 'ramz', to: 'ex2842', label: 'مثال' },
    // Le manuel : « انظر المثال السابق: قواسم العدد 14 هي: 1 ، 2 ، 7 و 14 ».
    { from: 'ex2842', to: 'mulahaza', label: 'نلاحظ' },
    { from: 'mulahaza', to: 'khulasa', label: 'نستخلص' },
  ],
};
