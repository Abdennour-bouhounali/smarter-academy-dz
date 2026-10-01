/**
 * La carte PROGRESSIVE du درس 2 « معادلات جداء معدوم » —
 * docs/architecture/KNOWLEDGE_MAP.md, Part A.
 *
 * Aucune mathématique n'est écrite ici : chaque texte vient de la leçon — le نشاط 2,
 * معارف 2 et la طريقة p. 47 (content/textbook.js), les `commonError` / `method` /
 * corrections des exercices (content/exercises.js). Chaque nœud est gardé par l'item
 * de knowledge.jsx qui l'établit (`requires`). Rien de l'إختبار أولي ((x − 3)(2x + 2),
 * x² − 1, −5(x + 4), x² = 3x…) n'est montré ici.
 *
 *            [خاصية الجداء المعدوم]                    m1
 *                    │ مثال
 *              [كرّاس أمين]
 *       خطأ شائع ┌───┴───┐ نسمّي
 *   ⛔ [النشر أولًا]   [معادلة جداء معدوم]            m2
 *                          │ نحلّها بـ
 *                  [حلول المعادلة]
 *          انتبه إلى ┌─────┴─────┐ مثال
 *      ⚠ [عامل ثابت]      [المثال 3]
 *               خطأ شائع ┌─────┴─────┐ طريقة
 *            ⛔ [حلّ واحد؟]     [نحلّل ثم نحلّ]        m3
 *                                     │ مثال
 *                                [العبارة F]
 *                                     │ خطأ شائع
 *                              ⛔ [القسمة على x]
 *                                     │ نستخلص
 *                                  🎯 [خلاصة]
 */
import { ACTIVITY, ACTIVITY_A, ELIAS_AMINE, KNOWLEDGE, METHOD } from './content/textbook';
import { EX } from './content/exercises';

const ex142 = EX['ex-14-2'];
const now47d = EX['now-47-2-d'];

export const KNOWLEDGE_GRAPH = {
  root: 'khassiya',
  nodes: [
    {
      id: 'khassiya', kind: 'relationship', lane: 'center', requires: 'khassiya-jidaa-maadum', notebook: true,
      title: 'خاصية الجداء المعدوم', subtitle: '$a \\times b = 0$',
      context: { text: ACTIVITY_A.statement, note: KNOWLEDGE.property[1] },
      reveals: ['amine'],
    },
    {
      id: 'amine', kind: 'example', lane: 'center', requires: 'khassiya-jidaa-maadum',
      title: 'كرّاس أمين', subtitle: '$x = 5$',
      context: { text: ELIAS_AMINE.amineMethod, list: ACTIVITY.amine },
      reveals: ['nashr', 'taarif'],
    },
    {
      // ⛔ خطأ شائع — la méthode d'إلياس (س 1) qui échoue sur (x − 2)(x + 5) (س 3).
      id: 'nashr', kind: 'common_mistake', lane: 'start', requires: 'khassiya-jidaa-maadum',
      title: 'النشر أولًا', subtitle: '$x^2 + 3x - 10 = 0$',
      context: {
        parts: [
          { role: 'wrong', text: ELIAS_AMINE.eliasMethod },
          { role: 'why', text: ACTIVITY.q3note },
          { role: 'right', text: ELIAS_AMINE.expandFails },
        ],
      },
      reveals: [],
    },
    {
      id: 'taarif', kind: 'definition', lane: 'end', requires: 'taarif-muadala-jidaa', notebook: true,
      title: 'معادلة جداء معدوم', subtitle: '$(ax + b)(cx + d) = 0$',
      reveals: ['hulul'],
    },
    {
      id: 'hulul', kind: 'relationship', lane: 'center', requires: 'hulul-muadala-jidaa', notebook: true,
      title: 'حلول المعادلة', subtitle: '$ax + b = 0$ ، $cx + d = 0$',
      reveals: ['thabit', 'ex3'],
    },
    {
      // ⚠ انتبه — مثال 2 de معارف 2 et la ligne d'أمين : un facteur constant non nul.
      id: 'thabit', kind: 'warning', lane: 'start', requires: 'hulul-muadala-jidaa',
      title: 'عامل ثابت غير معدوم', subtitle: '$2 \\neq 0$',
      context: { text: KNOWLEDGE.examples[1], note: ACTIVITY.amine[1] },
      reveals: [],
    },
    {
      id: 'ex3', kind: 'example', lane: 'end', requires: 'hulul-muadala-jidaa',
      title: 'المثال 3', subtitle: '$\\dfrac{1}{2}$ و $\\dfrac{4}{3}$',
      context: { text: KNOWLEDGE.example3[0], list: KNOWLEDGE.example3.slice(1) },
      reveals: ['hal-wahid', 'tariqa'],
    },
    {
      // ⛔ خطأ شائع — le `commonError` de l'exercice 14 (2) et sa correction.
      id: 'hal-wahid', kind: 'common_mistake', lane: 'start', requires: 'hulul-muadala-jidaa',
      title: 'حلّ واحد فقط؟', subtitle: '$(x + 5)(2 - x) = 0$',
      context: {
        parts: [
          { role: 'wrong', text: ex142.commonError },
          { role: 'why', text: KNOWLEDGE.solutions },
          { role: 'right', text: ex142.question.explain },
        ],
      },
      reveals: [],
    },
    {
      id: 'tariqa', kind: 'method', lane: 'end', requires: 'tariqat-jidaa-maadum', notebook: true,
      title: 'نحلّل ثم نحلّ',
      reveals: ['exF'],
    },
    {
      id: 'exF', kind: 'example', lane: 'end', requires: 'tariqat-jidaa-maadum',
      title: 'العبارة F', subtitle: '$-1$ و $\\dfrac{3}{4}$',
      context: { text: METHOD.solution[0], note: METHOD.solution[3] },
      reveals: ['qisma'],
    },
    {
      // ⛔ خطأ شائع — دوري الآن 2 (9x² = 4x) : la division par x perd 0.
      id: 'qisma', kind: 'common_mistake', lane: 'center', requires: 'tariqat-jidaa-maadum',
      title: 'القسمة على x', subtitle: '$9x^2 = 4x$',
      context: {
        parts: [
          { role: 'wrong', text: now47d.commonError },
          { role: 'why', text: now47d.method },
          { role: 'right', text: now47d.question.explain },
        ],
      },
      reveals: ['khulasa'],
    },
    {
      // 🎯 خلاصة — la ملاحظة et la propriété des solutions de معارف 2.
      id: 'khulasa', kind: 'takeaway', lane: 'center', requires: 'tariqat-jidaa-maadum',
      title: 'خلاصة', subtitle: 'جداء ← معادلتان',
      context: { text: KNOWLEDGE.note, note: METHOD.steps.lines[1] },
      reveals: [],
    },
  ],
  edges: [
    { from: 'khassiya', to: 'amine', label: 'مثال' },
    { from: 'amine', to: 'nashr', label: 'خطأ شائع' },
    { from: 'amine', to: 'taarif', label: 'نسمّي' },
    { from: 'taarif', to: 'hulul', label: 'نحلّها بـ' },
    { from: 'hulul', to: 'thabit', label: 'انتبه إلى' },
    { from: 'hulul', to: 'ex3', label: 'مثال' },
    { from: 'ex3', to: 'hal-wahid', label: 'خطأ شائع' },
    { from: 'ex3', to: 'tariqa', label: 'طريقة' },
    { from: 'tariqa', to: 'exF', label: 'مثال' },
    { from: 'exF', to: 'qisma', label: 'خطأ شائع' },
    { from: 'qisma', to: 'khulasa', label: 'نستخلص' },
  ],
};
