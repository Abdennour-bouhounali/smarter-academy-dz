/**
 * La carte PROGRESSIVE du درس « الجذر التربيعي لعدد موجب » —
 * docs/architecture/KNOWLEDGE_MAP.md, Part A.
 *
 * Aucune mathématique n'est écrite ici : chaque texte vient de la leçon — le
 * manuel (content/textbook.js : نشاط 1 p. 20, معارف 1 p. 22, طرائق p. 23,
 * أستعدّ p. 19), les exercices et leurs `commonError` (content/exercises.js).
 * Les égalités chiffrées (√36 = 6, BC² = 5, 2,236067978²) sont CALCULÉES à
 * partir des nombres du livre (ACTIVITY.numbers, core/squareRoots).
 * Chaque nœud est gardé par l'item de knowledge.jsx qui l'établit (`requires`).
 *
 * (Schéma en ordre de lecture LTR ; sous RTL le couloir `start` est à DROITE.)
 *
 *                          [الجذر التربيعي]                        مفهوم
 *                     معناه ┌──────┴──────┐ نرمز له
 *                   [التعريف]           [القيمة المضبوطة]            محور 1
 *                  مثال │                 │ تذكّر
 *               [أمثلة النشاط]       📌 [خاصية فيثاغورس]
 *        نتحقق منه بـ │                   │ نحسب به
 *            🔍 [نتحقق بالتربيع]         [الوتر BC]
 *                     ┆                   │ انتبه إلى
 *                     ┆              ⚠️ [قراءة الحاسبة]
 *      في الحالة العامة ┆                   │ بالضبط
 *                     ┆              [(√a)² = a]                     محور 2
 *                     ┆       وأيضًا ┌─────┘
 *              [√(a²) = a] ◀────────┘
 *                          │ مثال
 *                    [أمثلة الكتاب]
 *                          │ انتبه إلى
 *                   ⚠️ [الشرط: عدد موجب]
 *                          │ خطأ شائع
 *                   ⛔ [إشارة ما تحت المربع]
 *                          │ نستخلص
 *                      🎯 [الخلاصة]
 */
import { squareRoots } from '@smarter-academy/core';
import { ACTIVITY, KNOWLEDGE, METHOD, PREP_ITEMS, PREP_PLATFORM_ITEMS } from './content/textbook';
import { EX } from './content/exercises';

const { rationalSqrt, squareOfDecimal, exactDecimal } = squareRoots;
const { ab, ac, calculator, q3 } = ACTIVITY.numbers;
const bc2 = ab * ab + ac * ac;

/** a { num, den } → LaTeX (virgule décimale « {,} » pour un dénominateur 10^k). */
const digitsOf = (den) => { const d = Math.round(Math.log10(den)); return 10 ** d === den ? d : null; };
const tex = ({ num, den }) => (den === 1 ? String(num) : exactDecimal(num, digitsOf(den)).replace(',', '{,}'));
// Question 3 de l'activité : les racines se CALCULENT (36 → 6, 81 → 9, 0,49 → 0,7).
const rootsQ3 = q3.map((a) => `$\\sqrt{${tex(a)}} = ${tex(rationalSqrt(a))}$`);
const calcTex = calculator.replace(',', '{,}');
const calcSquareTex = squareOfDecimal(calculator).replace(',', '{,}');

// « الطول BC هو العدد الموجب الذي مربعه .... . » (question 1 ب), complétée par BC² calculé.
const bcSentence = ACTIVITY.questions[1].replace('ب) انقل وأكمل: ', '').replace('.... .', `${bc2}.`);
// La طريقة (جـ), citée : le piège du signe et sa correction.
const methodTrap = METHOD.solution[2].replace('جـ) ', '').split(' لدينا ')[0];
const methodRight = `إذن ${METHOD.solution[2].split(' إذن ')[1].split(' ونستنتج ')[0]}`;
const prepPythagoras = PREP_ITEMS.find((it) => it.n === 10);

export const KNOWLEDGE_GRAPH = {
  root: 'jidhr',
  nodes: [
    {
      id: 'jidhr', kind: 'concept', lane: 'center', requires: 'jidhr-taarif',
      title: 'الجذر التربيعي', subtitle: '$\\sqrt{a}$',
      context: { text: bcSentence, note: KNOWLEDGE.title },
      reveals: ['taarif', 'mudbuta'],
    },
    {
      id: 'taarif', kind: 'definition', lane: 'start', requires: 'jidhr-taarif', notebook: true,
      title: 'التعريف', subtitle: 'العدد الموجب الذي مربعه a',
      reveals: ['amthila'],
    },
    {
      id: 'mudbuta', kind: 'idea', lane: 'end', requires: 'qima-mudbuta', notebook: true,
      title: 'القيمة المضبوطة', subtitle: '$\\sqrt{5}$',
      reveals: ['fithaghuras'],
    },
    {
      // نشاط 1, question 3 : « أعط الناتج ذهنيا ».
      id: 'amthila', kind: 'example', lane: 'start', requires: 'jidhr-taarif',
      title: 'أمثلة النشاط', subtitle: rootsQ3[0],
      context: { text: ACTIVITY.questions[5], list: rootsQ3 },
      reveals: ['tahaqqaq'],
    },
    {
      // 🔍 تحقّق — les exemples de معارف 1 se justifient tous ainsi (« لأن … عدد موجب و … »).
      id: 'tahaqqaq', kind: 'check', lane: 'start', requires: 'jidhr-taarif',
      title: 'نتحقق بالتربيع', subtitle: '$2^2 = 4$',
      context: { text: KNOWLEDGE.examples[0], list: [KNOWLEDGE.examples[3]], note: EX['ex-3'].commonError },
      reveals: [],
    },
    {
      // 📌 تذكّر — Pythagore, diagnostiqué par « أستعدّ » (item 10 du livre + un ajout).
      id: 'fithaghuras', kind: 'prerequisite', lane: 'end', requires: 'qima-mudbuta',
      title: 'خاصية فيثاغورس', subtitle: '$BC^2 = AB^2 + AC^2$',
      context: { text: prepPythagoras.why, list: [PREP_PLATFORM_ITEMS[1].why] },
      reveals: ['bc'],
    },
    {
      id: 'bc', kind: 'example', lane: 'end', requires: 'qima-mudbuta',
      title: 'الوتر BC', subtitle: '$BC = \\sqrt{5}$',
      context: { text: `$BC^2 = ${ab}^2 + ${ac}^2 = ${bc2}$`, note: ACTIVITY.box },
      reveals: ['hasiba'],
    },
    {
      // ⚠️ انتبه — نشاط 1, question 2 : la touche √ donne « القيمة المضبوطة أو قيمة مقربة ».
      id: 'hasiba', kind: 'warning', lane: 'end', requires: 'qima-mudbuta',
      title: 'قراءة الحاسبة', subtitle: `$${calcTex}^2 \\neq ${bc2}$`,
      context: { text: ACTIVITY.questions[2], formula: `$${calcTex}^2 = ${calcSquareTex}$` },
      reveals: ['murabba-jidhr'],
    },
    {
      id: 'murabba-jidhr', kind: 'relationship', lane: 'end', requires: 'murabba-jidhr', notebook: true,
      title: 'مربع الجذر', subtitle: '$(\\sqrt{a})^2 = a$',
      reveals: ['jidhr-murabba'],
    },
    {
      id: 'jidhr-murabba', kind: 'relationship', lane: 'start', requires: 'jidhr-murabba', notebook: true,
      title: 'جذر المربع', subtitle: '$\\sqrt{a^2} = a$',
      reveals: ['amthila-khawass'],
    },
    {
      id: 'amthila-khawass', kind: 'example', lane: 'center', requires: 'jidhr-murabba',
      title: 'أمثلة الكتاب', subtitle: '$\\sqrt{3^2} = 3$',
      context: { list: KNOWLEDGE.propertyExamples },
      reveals: ['intabih'],
    },
    {
      // ⚠️ انتبه — la condition des deux propriétés, écrite en marge de la طريقة (p. 23).
      id: 'intabih', kind: 'warning', lane: 'center', requires: 'jidhr-murabba',
      title: 'الشرط: عدد موجب', subtitle: '$a \\geq 0$',
      context: { text: METHOD.asides[0], note: METHOD.asides[1] },
      reveals: ['khata'],
    },
    {
      // ⛔ خطأ شائع — la طريقة (جـ), l'exercice 8 et دوري الآن : oublier le signe.
      id: 'khata', kind: 'common_mistake', lane: 'center', requires: 'jidhr-murabba',
      title: 'إشارة ما تحت المربع', subtitle: '$\\sqrt{2} - 1$',
      context: {
        parts: [
          { role: 'wrong', text: 'كتابة $\\sqrt{(1 - \\sqrt{2})^2} = 1 - \\sqrt{2}$.' },
          { role: 'why', text: methodTrap },
          { role: 'right', text: methodRight },
          { role: 'example', text: EX['ex-8'].commonError },
        ],
      },
      reveals: ['khulasa'],
    },
    {
      // 🎯 خلاصة — la définition et les deux propriétés, réunies.
      id: 'khulasa', kind: 'takeaway', lane: 'center', requires: 'jidhr-murabba',
      title: 'الخلاصة', subtitle: '$(\\sqrt{a})^2 = \\sqrt{a^2} = a$',
      context: {
        text: '$a$ عدد موجب: $\\sqrt{a}$ هو العدد الموجب الذي مربعه $a$، ومنه $(\\sqrt{a})^2 = a$ و $\\sqrt{a^2} = a$.',
        note: 'الحاسبة لا تعطي دائمًا القيمة المضبوطة: نكتب $\\sqrt{5}$.',
      },
      reveals: [],
    },
  ],
  edges: [
    { from: 'jidhr', to: 'taarif', label: 'معناه' },
    { from: 'jidhr', to: 'mudbuta', label: 'نرمز له' },
    { from: 'taarif', to: 'amthila', label: 'مثال' },
    { from: 'amthila', to: 'tahaqqaq', label: 'نتحقق منه بـ' },
    { from: 'mudbuta', to: 'fithaghuras', label: 'تذكّر' },
    { from: 'fithaghuras', to: 'bc', label: 'نحسب به' },
    { from: 'bc', to: 'hasiba', label: 'انتبه إلى' },
    { from: 'hasiba', to: 'murabba-jidhr', label: 'بالضبط' },
    { from: 'tahaqqaq', to: 'jidhr-murabba', label: 'في الحالة العامة' },
    { from: 'murabba-jidhr', to: 'jidhr-murabba', label: 'وأيضًا' },
    { from: 'jidhr-murabba', to: 'amthila-khawass', label: 'مثال' },
    { from: 'amthila-khawass', to: 'intabih', label: 'انتبه إلى' },
    { from: 'intabih', to: 'khata', label: 'خطأ شائع' },
    { from: 'khata', to: 'khulasa', label: 'نستخلص' },
  ],
};
