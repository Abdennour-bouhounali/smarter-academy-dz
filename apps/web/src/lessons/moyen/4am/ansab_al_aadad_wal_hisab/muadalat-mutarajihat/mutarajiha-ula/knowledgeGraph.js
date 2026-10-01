/**
 * La carte PROGRESSIVE du درس 3 « المتراجحات من الدرجة الأولى بمجهول واحد » —
 * docs/architecture/KNOWLEDGE_MAP.md, Part A.
 *
 * Aucune mathématique n'est écrite ici : chaque texte vient de la leçon — نشاط 3, معارف 3
 * et 4, la طريقة p. 49 (content/textbook.js), les `commonError` / `method` des exercices
 * (content/exercises.js), « أستعدّ ». Chaque nœud est gardé par l'item de knowledge.jsx qui
 * l'établit (`requires`). Rien de l'إختبار أولي (QCM 6, 8, 9 ; les questions de la plateforme)
 * n'est montré ici.
 *
 *   [المتراجحة] m1 → [رسائل يونس] → [حلّ متراجحة] ─ خطأ شائع → ⛔ [الحدّ في متراجحة صارمة]
 *        │ نمثّلها
 *   [الحلول على مستقيم مدرّج] m2 → [من الدرجة الأولى] m3 → [المثال 1] → [قواعد الاتجاه]
 *   → [المثال 2] ─┬ خطأ شائع → ⛔ [الاتجاه المنسي]
 *                 └ يعتمد على → 📌 [القسمة على سالب] → [التمثيل البياني] → [x > 6]
 *   → [طريقة الحل] m4 → [المثال أ] → 🔍 [نتحقّق بقيم] → 🎯 [خلاصة]
 */
import { ACTIVITY, KNOWLEDGE_3, KNOWLEDGE_4, METHOD, PREP_ITEMS } from './content/textbook';
import { EX } from './content/exercises';

const prep10 = PREP_ITEMS[4];
const ex25a = EX['ex-25-1'];
const ex25b = EX['ex-25-2'];
const ex24b = EX['ex-24-2'];

export const KNOWLEDGE_GRAPH = {
  root: 'mutarajiha',
  nodes: [
    {
      id: 'mutarajiha', kind: 'definition', lane: 'center', requires: 'mutarajiha', notebook: true,
      title: 'المتراجحة', subtitle: 'متباينة بمجهول x',
      reveals: ['younes'],
    },
    {
      id: 'younes', kind: 'example', lane: 'end', requires: 'mutarajiha',
      title: 'رسائل يونس', subtitle: '$2{,}5x + 100 \\leq 150$',
      context: { text: ACTIVITY.text, note: ACTIVITY.box[0] },
      reveals: ['hal'],
    },
    {
      id: 'hal', kind: 'definition', lane: 'center', requires: 'hal-mutarajiha', notebook: true,
      title: 'حلّ متراجحة', subtitle: 'متباينة صحيحة',
      reveals: ['khata-sarim', 'jadwal'],
    },
    {
      // ⛔ خطأ شائع — l'exercice 25 : 8/3 donne 6 < 6, fausse (l'inégalité est stricte).
      id: 'khata-sarim', kind: 'common_mistake', lane: 'start', requires: 'hal-mutarajiha',
      title: 'الحدّ والرمز الصارم', subtitle: '$x = \\dfrac{8}{3}$',
      context: {
        parts: [
          { role: 'wrong', text: ex25a.commonError },
          { role: 'why', text: ex25a.question.explain },
          { role: 'right', text: ex25a.question.rows[3].correction },
        ],
      },
      reveals: [],
    },
    {
      id: 'jadwal', kind: 'relationship', lane: 'end', requires: 'tamthil-jadwal', notebook: true,
      title: 'الحلول على المستقيم', subtitle: '$x < 3$ ، $x \\geq 2$',
      reveals: ['ula'],
    },
    {
      id: 'ula', kind: 'definition', lane: 'center', requires: 'mutarajiha-ula', notebook: true,
      title: 'من الدرجة الأولى', subtitle: '$ax + b < cx + d$',
      reveals: ['ex1'],
    },
    {
      id: 'ex1', kind: 'example', lane: 'end', requires: 'mutarajiha-ula',
      title: 'عدد ليس حلًّا', subtitle: '$4 \\times (-2) = -8$',
      context: { text: KNOWLEDGE_3.example1 },
      reveals: ['qawaid'],
    },
    {
      id: 'qawaid', kind: 'relationship', lane: 'center', requires: 'qawaid-ittijah', notebook: true,
      title: 'قواعد الاتجاه', subtitle: 'نحافظ · نغيّر',
      reveals: ['ex2'],
    },
    {
      id: 'ex2', kind: 'example', lane: 'center', requires: 'qawaid-ittijah',
      title: 'مثال: نغيّر الاتجاه', subtitle: '$x < -6$',
      context: { text: KNOWLEDGE_3.example2b, note: KNOWLEDGE_3.example2a },
      reveals: ['khata-ittijah', 'tadhakkar'],
    },
    {
      // ⛔ خطأ شائع — l'exercice 24 (−2x < 4) : le sens gardé.
      id: 'khata-ittijah', kind: 'common_mistake', lane: 'end', requires: 'qawaid-ittijah',
      title: 'الاتجاه المنسي', subtitle: '$-2x < 4$',
      context: {
        parts: [
          { role: 'wrong', text: ex24b.commonError },
          { role: 'why', text: KNOWLEDGE_3.rules[2] },
          { role: 'right', text: ex24b.question.explain },
        ],
      },
      reveals: [],
    },
    {
      // 📌 تذكّر — « أستعدّ » item 10 du manuel : diviser par un négatif.
      id: 'tadhakkar', kind: 'prerequisite', lane: 'start', requires: 'qawaid-ittijah',
      title: 'تذكّر: القسمة على سالب', subtitle: '$-2x \\geq -1$',
      context: { text: prep10.text, note: prep10.why },
      reveals: ['tamthil'],
    },
    {
      id: 'tamthil', kind: 'relationship', lane: 'center', requires: 'tamthil-bayani', notebook: true,
      title: 'التمثيل البياني', subtitle: 'الجزء الملوّن بالأحمر',
      reveals: ['exk4'],
    },
    {
      id: 'exk4', kind: 'example', lane: 'center', requires: 'tamthil-bayani',
      title: 'حدّ ليس حلًّا', subtitle: '$x > 6$',
      context: { text: KNOWLEDGE_4.example2, note: KNOWLEDGE_4.note2 },
      reveals: ['tariqa'],
    },
    {
      id: 'tariqa', kind: 'method', lane: 'end', requires: 'tariqat-hal', notebook: true,
      title: 'طريقة حل متراجحة',
      reveals: ['exA'],
    },
    {
      id: 'exA', kind: 'example', lane: 'end', requires: 'tariqat-hal',
      title: 'المتراجحة أ', subtitle: '$x > \\dfrac{1}{2}$',
      context: { text: METHOD.solutionA[2], note: METHOD.solutionA[3] },
      reveals: ['tahaqqaq'],
    },
    {
      // 🔍 تحقّق — l'exercice 25 : les valeurs testées au 1) confirment la solution du 2).
      id: 'tahaqqaq', kind: 'check', lane: 'center', requires: 'tariqat-hal',
      title: 'نتحقّق بقيم لـ x', subtitle: '$x = 0$ ، $x = 3$',
      context: { text: ex25b.question.explain, note: ex25a.method },
      reveals: ['khulasa'],
    },
    {
      // 🎯 خلاصة — la règle du sens (معارف 3) et le dessin (معارف 4), réunis.
      id: 'khulasa', kind: 'takeaway', lane: 'center', requires: 'tariqat-hal',
      title: 'الاتجاه والرمز', subtitle: 'سالب ⇐ نغيّر',
      context: { text: KNOWLEDGE_3.rules[2], note: KNOWLEDGE_4.note1 },
      reveals: [],
    },
  ],
  edges: [
    { from: 'mutarajiha', to: 'younes', label: 'مثال' },
    { from: 'younes', to: 'hal', label: 'نسمّي' },
    { from: 'hal', to: 'khata-sarim', label: 'خطأ شائع' },
    { from: 'hal', to: 'jadwal', label: 'نمثّلها' },
    { from: 'jadwal', to: 'ula', label: 'نعمّم' },
    { from: 'ula', to: 'ex1', label: 'مثال' },
    { from: 'ex1', to: 'qawaid', label: 'لحلّها' },
    { from: 'qawaid', to: 'ex2', label: 'مثال' },
    { from: 'ex2', to: 'khata-ittijah', label: 'خطأ شائع' },
    { from: 'ex2', to: 'tadhakkar', label: 'يعتمد على' },
    { from: 'tadhakkar', to: 'tamthil', label: 'ثمّ نمثّل' },
    { from: 'tamthil', to: 'exk4', label: 'مثال' },
    { from: 'exk4', to: 'tariqa', label: 'طريقة' },
    { from: 'tariqa', to: 'exA', label: 'مثال' },
    { from: 'exA', to: 'tahaqqaq', label: 'نتحقق منه بـ' },
    { from: 'tahaqqaq', to: 'khulasa', label: 'نستخلص' },
  ],
};

