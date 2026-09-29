/**
 * La carte PROGRESSIVE du درس 8 — اختزال كسر.
 * Contrat : docs/architecture/KNOWLEDGE_MAP.md, Part A ; référence :
 * qasim-adad-tabii/knowledgeGraph.js.
 *
 * Sources : le manuel (content/textbook.js : أستعدّ p. 7, نشاط 8 p. 9, معارف 6
 * p. 12, طرائق p. 13), les questions et corrections des modules 0, 1 et 2.
 *
 * L'item « كيف أتأكد أنني انتهيت؟ » est une تحقّق (check) : c'est très
 * exactement une façon de vérifier sa réponse. Le تذكّر vient de « أستعدّ »
 * (les fractions égales, item 8, et le conseil du diagnostic) : réduire,
 * c'est le geste inverse.
 * Deux خطأ شائع, chacun visé par plusieurs distracteurs de la leçon :
 *   — soustraire, ou ne diviser que le numérateur (module 1, q. 1 ; évaluation E1) ;
 *   — « irréductible parce que 7 est premier » (module 1, q. 2 ; module 2,
 *     q. 1 ; évaluation E2) : premiers ENTRE EUX, pas premiers.
 *
 *                       [اختزال كسر]                       مفهوم
 *                        معناه │
 *                 [القسمة على قاسم مشترك]                  طريقة
 *              تذكّر ┌─────┴─────┐ مثال
 *      📌 [الكسور المتساوية]    [طريقة سمير]               مثال
 *                                │ خطأ شائع
 *                         ⛔ [البسط وحده؟]
 *                     نتوقّف عند ┆ (couloir central)
 *                  [كسر غير قابل للاختزال]                 تعريف
 *            خطأ شائع ┌─────┴─────┐ نصل إليه بـ
 *        ⛔ [لأن 7 عدد أولي؟]    [نقسم على PGCD]            طريقة
 *                   │              │ مثال
 *                   │         [اختزال 595/560]
 *                   │              │ نتحقق منه بـ
 *                   │         🔍 [هل انتهيت؟]
 *                   └──────┬───────┘ نستخلص
 *                 🎯 [قسمة واحدة تكفي]
 */
import { ACTIVITY, KNOWLEDGE, METHOD, PREP_ITEMS } from './content/textbook';

const stripLabel = (s) => s.replace(/^(أ|ب|جـ|د)\)\s*/, '');
const prepFractions = PREP_ITEMS.find((it) => it.n === 8);

export const KNOWLEDGE_GRAPH = {
  root: 'kasr',
  nodes: [
    {
      id: 'kasr', kind: 'concept', lane: 'center', requires: 'ikhtizal',
      title: 'اختزال كسر', subtitle: 'قيمة الكسر لا تتغيّر',
      context: { text: stripLabel(ACTIVITY.questions[0]) },
      reveals: ['ikhtizal'],
    },
    {
      id: 'ikhtizal', kind: 'method', lane: 'center', requires: 'ikhtizal', notebook: true,
      title: 'القسمة على قاسم مشترك', subtitle: 'البسط والمقام معًا',
      reveals: ['tadhakkar', 'samir'],
    },
    {
      // 📌 تذكّر — « أستعدّ » item 8, et le conseil du diagnostic (module 0).
      id: 'tadhakkar', kind: 'prerequisite', lane: 'start', requires: 'ikhtizal',
      title: 'الكسور المتساوية', subtitle: 'نضرب أو نقسم الحدّين',
      context: {
        text: 'نضرب أو نقسم البسط والمقام على نفس العدد.',
        list: [prepFractions.text],
        note: prepFractions.why,
      },
      reveals: [],
    },
    {
      id: 'samir', kind: 'example', lane: 'end', requires: 'ikhtizal',
      title: 'طريقة سمير', subtitle: '÷ 4 ثم ÷ 3',
      context: { formula: ACTIVITY.samirPath, note: stripLabel(ACTIVITY.questions[1]) },
      reveals: ['khata-tarh', 'ghayr'],
    },
    {
      // ⛔ خطأ شائع — Module 1, question 1 : les distracteurs « طرح 4 ثم 3 من
      // البسط والمقام » et « قسم البسط فقط », l'explication, la bonne réponse.
      id: 'khata-tarh', kind: 'common_mistake', lane: 'end', requires: 'ikhtizal',
      title: 'البسط وحده؟', subtitle: 'نقسم البسط والمقام معًا',
      context: {
        parts: [
          { role: 'wrong', text: 'نطرح 4 ثم 3 من البسط والمقام، أو نقسم البسط وحده.' },
          { role: 'why', text: 'القسمة على قاسم مشترك لا تغيّر قيمة الكسر: $\\dfrac{84}{48} = \\dfrac{21}{12} = \\dfrac{7}{4}$.' },
          { role: 'right', text: 'قسم البسط والمقام على قاسم مشترك لهما (4 ثم 3).' },
        ],
      },
      reveals: [],
    },
    {
      id: 'ghayr', kind: 'definition', lane: 'center', requires: 'kasr-ghayr-qabil', notebook: true,
      title: 'كسر غير قابل للاختزال', subtitle: 'PGCD$(a ; b) = 1$',
      context: { text: KNOWLEDGE.definition, note: KNOWLEDGE.examples[0] },
      reveals: ['khata-awwali', 'bilpgcd'],
    },
    {
      // ⛔ خطأ شائع — Module 1, question 2 (« لأن 7 عدد أولي »), module 2,
      // question 1 (« لأن 15 و 22 عددان أوليان ») et l'évaluation (E2).
      id: 'khata-awwali', kind: 'common_mistake', lane: 'start', requires: 'kasr-ghayr-qabil',
      title: 'لأن 7 عدد أولي؟', subtitle: 'أوليان فيما بينهما',
      context: {
        parts: [
          { role: 'wrong', text: 'الكسر $\\dfrac{7}{4}$ غير قابل للاختزال لأن 7 عدد أولي.' },
          { role: 'why', text: KNOWLEDGE.definition },
          { role: 'right', text: 'لأن 7 و 4 أوليان فيما بينهما: PGCD(7 ; 4) = 1.' },
        ],
      },
      reveals: [],
    },
    {
      id: 'bilpgcd', kind: 'method', lane: 'end', requires: 'ikhtizal-bil-pgcd', notebook: true,
      title: 'نقسم على PGCD', subtitle: 'في خطوة واحدة',
      context: { text: METHOD.rule, note: KNOWLEDGE.remark },
      reveals: ['ex595'],
    },
    {
      id: 'ex595', kind: 'example', lane: 'end', requires: 'ikhtizal-bil-pgcd',
      title: 'اختزال 595/560', subtitle: 'PGCD $= 35$',
      context: { list: METHOD.solution },
      reveals: ['tahaqquq'],
    },
    {
      // 🔍 تحقّق — l'item du module 2, et la correction de sa question 2
      // (« 14/21 و 4/6 فما زالا قابلين للاختزال »).
      id: 'tahaqquq', kind: 'check', lane: 'end', requires: 'tahaqquq-al-ikhtizal', notebook: true,
      title: 'هل انتهيت؟', subtitle: 'PGCD $= 1$',
      context: {
        text: 'بعد الاختزال، نتحقق: هل بسط الكسر ومقامه أوليان فيما بينهما؟ إن نعم فقد انتهينا؛ وإلا نواصل.',
        note: 'PGCD(28 ; 42) = 14 يعطي 2/3؛ أما 14/21 و 4/6 فما زالا قابلين للاختزال.',
      },
      reveals: ['khulasa'],
    },
    {
      // 🎯 خلاصة — les deux méthodes et la définition, réunies.
      id: 'khulasa', kind: 'takeaway', lane: 'center', requires: 'ikhtizal-bil-pgcd',
      title: 'قسمة واحدة تكفي', subtitle: 'على PGCD',
      context: {
        text: 'نختزل كسرًا بقسمة بسطه ومقامه على قاسم مشترك لهما. وبقسمتهما على قاسمهما المشترك الأكبر نصل في خطوة واحدة إلى كسر غير قابل للاختزال: بسطه ومقامه أوليان فيما بينهما.',
      },
      reveals: [],
    },
  ],
  edges: [
    { from: 'kasr', to: 'ikhtizal', label: 'معناه' },
    { from: 'ikhtizal', to: 'tadhakkar', label: 'تذكّر' },
    { from: 'ikhtizal', to: 'samir', label: 'مثال' },
    { from: 'samir', to: 'khata-tarh', label: 'خطأ شائع' },
    // Module 1 : « هل يمكن مواصلة اختزال 7/4؟ لماذا؟ »
    { from: 'samir', to: 'ghayr', label: 'نتوقّف عند' },
    { from: 'ghayr', to: 'khata-awwali', label: 'خطأ شائع' },
    // Module 2 : « بدل عدة قسمات، قسمة واحدة على القاسم المشترك الأكبر ».
    { from: 'ghayr', to: 'bilpgcd', label: 'نصل إليه بـ' },
    { from: 'bilpgcd', to: 'ex595', label: 'مثال' },
    { from: 'ex595', to: 'tahaqquq', label: 'نتحقق منه بـ' },
    { from: 'khata-awwali', to: 'khulasa', label: 'نستخلص' },
    { from: 'tahaqquq', to: 'khulasa', label: 'نستخلص' },
  ],
};
