/**
 * La carte PROGRESSIVE du درس 2 de l'unité 2 — KNOWLEDGE_MAP.md, Part A.
 *
 * Aucune mathématique n'est écrite ici : chaque texte vient de la leçon —
 * le manuel (content/textbook.js : نشاط 2 p. 20, معارف 2 p. 22, √2 p. 30),
 * « أستعدّ » (PREP_ITEMS), les exercices et leurs `method` / `commonError`
 * (content/exercises.js). Chaque nœud est gardé par l'item de knowledge.jsx
 * qui l'établit (`requires`).
 *
 *                     [ناطق أم غير ناطق؟]                     مفهوم (M1)
 *                    في حالة المربع │
 *   [جذر مربع عدد ناطق] ─ ─ ─ وإلا ─ ─ ▶ [جذر عدد ليس مربعًا…]    M1 │ M2
 *             │ مثال                          │ مثال
 *        [169 و 13]                   [6 ليس مربعًا لعدد ناطق]
 *             │ تذكّر                         │ انتبه إلى
 *     📌 [العدد الناطق]               ⚠️ [ما تعرضه الحاسبة]
 *                                   ┌──────┘ نكتفي بقيم مقرّبة
 *                     [القيم المقرّبة والمدوّر]                     M3
 *                              │ خطأ شائع
 *                     ⛔ [بالنقصان أم المدوّر؟]
 *                              │ نستخلص
 *                     🎯 [مربع عدد ناطق أم لا؟]
 *
 * (Schéma en ordre de lecture LTR ; sous RTL le couloir « start » est à DROITE.
 * Les nœuds du couloir central occupent une rangée entière : c'est pourquoi le
 * تذكّر pend de l'exemple 169 — « 13 عدد ناطق » — et l'avertissement de
 * l'exemple √6, plutôt que de leurs résultats.)
 *
 * Pas de « تحقّق » ni de « نصيحة » : la leçon n'en fournit pas de source
 * propre (la vérification par les carrés est déjà la méthode d'exercice 9).
 */
import { ACTIVITY, KNOWLEDGE, ICT_SQRT2, PREP_ITEMS, QIMA_MUQARRABA } from './content/textbook';
import { EX } from './content/exercises';

const [, exGhayr] = KNOWLEDGE.examples;
const [resNatiq, resGhayr] = KNOWLEDGE.results;
// نشاط 2, question a) : 169 = 13², CALCULÉ depuis le nombre du manuel.
const q169 = ACTIVITY.numbers.question;
const r169 = Math.round(Math.sqrt(q169));
const ex10 = EX['ex-10'];
// « الاكتفاء بالقيمة بالنقصان 3,4: المدوّر هو 3,5 لأن … » — l'erreur, puis le juste.
const [wrong10, right10] = ex10.commonError.split(': ');

export const KNOWLEDGE_GRAPH = {
  root: 'jidhr',
  nodes: [
    {
      id: 'jidhr', kind: 'concept', lane: 'center', requires: 'murabba-natiq',
      title: 'ناطق أم غير ناطق؟', subtitle: '$\\sqrt{a}$',
      context: { text: KNOWLEDGE.text, note: ACTIVITY.questions[1] },
      reveals: ['murabba'],
    },
    {
      id: 'murabba', kind: 'relationship', lane: 'start', requires: 'murabba-natiq', notebook: true,
      title: 'جذر مربع عدد ناطق', subtitle: 'عدد ناطق',
      context: { text: resNatiq },
      reveals: ['ex169', 'ghayr'],
    },
    {
      id: 'ex169', kind: 'example', lane: 'start', requires: 'murabba-natiq',
      title: `${q169} و ${r169}`, subtitle: `$\\sqrt{${q169}} = ${r169}$`,
      context: { text: ACTIVITY.questions[0], formula: `$${r169}^2 = ${q169}$`, list: ACTIVITY.classes.first.items },
      reveals: ['tadhakkar'],
    },
    {
      // 📌 تذكّر — le nombre rationnel, prérequis diagnostiqué par « أستعدّ »
      // (priorKnowledge 'adad-natiq', items 1 et 2 et leurs justifications).
      id: 'tadhakkar', kind: 'prerequisite', lane: 'start', requires: 'murabba-natiq',
      title: 'العدد الناطق', subtitle: '$\\dfrac{a}{b}$',
      context: { text: PREP_ITEMS[0].why, list: [PREP_ITEMS[1].why] },
      reveals: [],
    },
    {
      id: 'ghayr', kind: 'relationship', lane: 'end', requires: 'ghayr-natiq', notebook: true,
      title: 'جذر عدد ليس مربعًا لعدد ناطق', subtitle: 'ليس عددًا ناطقًا',
      context: { text: resGhayr },
      reveals: ['ex6'],
    },
    {
      id: 'ex6', kind: 'example', lane: 'end', requires: 'ghayr-natiq',
      title: '6 ليس مربعًا لعدد ناطق', subtitle: '$\\sqrt{6}$',
      context: { text: exGhayr, list: ACTIVITY.classes.second.items },
      reveals: ['hasiba'],
    },
    {
      // ⚠️ انتبه — أوظّف تكنولوجيات الإعلام والاتصال (p. 30) : ce que la
      // calculatrice affiche n'est pas √2 ; le carré de la lecture est calculé.
      id: 'hasiba', kind: 'warning', lane: 'end', requires: 'ghayr-natiq',
      title: 'ما تعرضه الحاسبة', subtitle: '$\\sqrt{2} \\neq 1{,}414213562$',
      context: {
        text: ICT_SQRT2.interpretation,
        formula: `$${ICT_SQRT2.reading.replace(',', '{,}')}^2 = ${ICT_SQRT2.readingSquare.replace(',', '{,}')}$`,
      },
      reveals: ['muqarraba'],
    },
    {
      id: 'muqarraba', kind: 'method', lane: 'center', requires: 'qima-muqarraba', notebook: true,
      title: 'القيم المقرّبة والمدوّر', subtitle: '$1{,}41 < \\sqrt{2} < 1{,}42$',
      context: { text: QIMA_MUQARRABA.text, note: QIMA_MUQARRABA.rule },
      reveals: ['khata'],
    },
    {
      // ⛔ خطأ شائع — تمرين 10 : `commonError`, l'explication et le cas 3,4 de `explainFor`.
      id: 'khata', kind: 'common_mistake', lane: 'center', requires: 'qima-muqarraba',
      title: 'بالنقصان أم المدوّر؟', subtitle: '$\\sqrt{12}$',
      context: {
        parts: [
          { role: 'wrong', text: `${wrong10}.` },
          { role: 'why', text: ex10.question.explainFor(3.4) },
          { role: 'right', text: right10 },
        ],
      },
      reveals: ['khulasa'],
    },
    {
      // 🎯 خلاصة — les deux résultats de معارف 2 et le rappel des valeurs approchées.
      id: 'khulasa', kind: 'takeaway', lane: 'center', requires: 'qima-muqarraba',
      title: 'مربع عدد ناطق أم لا؟', subtitle: '$\\sqrt{a}$',
      context: {
        text: `${resNatiq} ${resGhayr}`,
        note: 'ولعدد غير ناطق نكتفي بقيم مقرّبة: بالنقصان، بالزيادة، والمدوّر.',
      },
      reveals: [],
    },
  ],
  edges: [
    { from: 'jidhr', to: 'murabba', label: 'في حالة المربع' },
    { from: 'murabba', to: 'ghayr', label: 'وإلا', lateral: true },
    { from: 'ex169', to: 'tadhakkar', label: 'تذكّر' },
    { from: 'murabba', to: 'ex169', label: 'مثال' },
    { from: 'ghayr', to: 'ex6', label: 'مثال' },
    { from: 'ex6', to: 'hasiba', label: 'انتبه إلى' },
    { from: 'hasiba', to: 'muqarraba', label: 'نكتفي بقيم مقرّبة' },
    { from: 'muqarraba', to: 'khata', label: 'خطأ شائع' },
    { from: 'khata', to: 'khulasa', label: 'نستخلص' },
  ],
};
