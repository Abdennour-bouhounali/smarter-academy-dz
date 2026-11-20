/**
 * MISSION 1 of « أدمج تعلّماتي » (unit 1) — the situation of BEM 2021, first part: the identical lots.
 * DATA only (`docs/reports/INTEGRATION_LESSON_PLAN.md` §8): the exam text as printed, cut into its PHRASES (each one
 * lights when the student's act has produced its line of numbers), the two stocks, the words of the scene, and the
 * names of the unit's keys offered for the last sentence of his copy. The player
 * (`lessons/common/gameworld/missions/MissionPlayer.jsx`) names no lesson.
 */
const A = 1188;
const B = 528;

export const BEM_2021 = {
  id: 'bem-2021-lots',
  title: 'المهمّة 1',
  session: 'شهادة التعليم المتوسط — دورة 2021',
  scene: 'lots',
  stock: { a: A, b: B },
  kinds: {
    a: { name: 'البطاطا', crates: 'صندوق بطاطا', color: '#e2b04a' },
    b: { name: 'الجزر', crates: 'صندوق جزر', color: '#f28b3c' },
  },
  lot: { one: 'تشكيلة', forms: ['تشكيلة واحدة', 'تشكيلتان', 'تشكيلات', 'تشكيلة'] },
  home: { forms: ['دار واحدة', 'داران', 'دور', 'دارًا'] },

  /**
   * The paper as printed, in phrases. `id` names a phrase that lights; `stock: 'a' | 'b'` makes a number of the text a
   * thing he taps (step 1: what does this number count?).
   */
  paper: [
    { t: 'خصّص فلاح قطعة أرض لإنتاج البطاطا و الجزر، فكان المحصول: ' },
    { t: `${A}`, stock: 'a' },
    { t: ' صندوق من البطاطا و ' },
    { t: `${B}`, stock: 'b' },
    { t: ' صندوقًا من الجزر. قصد مساعدة دور العجزة و مراكز الأيتام و ذوي الاحتياجات الخاصة، يريد هذا الفلاح أن ' },
    { t: 'يُجمّع الصناديق', id: 'all' },
    { t: ' في ' },
    { t: 'تشكيلات متماثلة من حيث النوع و العدد', id: 'same' },
    { t: ' (أي كل تشكيلة تحتوي على نفس عدد الصناديق من البطاطا و نفس عدد الصناديق من الجزر).', br: true },
    { t: '(ا) ما هو ' },
    { t: 'أكبر عدد من التشكيلات', id: 'most' },
    { t: ' التي يمكن تكوينها؟', br: true },
    { t: '(ب) ما هو ' },
    { t: 'عدد صناديق البطاطا و عدد صناديق الجزر في كل تشكيلة', id: 'content' },
    { t: '.' },
  ],

  /** The last sentence of his copy: the name of what he found, among keys he forged in the unit. */
  names: [
    { id: 'pgcd', text: 'القاسم المشترك الأكبر', tex: '\\mathrm{PGCD}', right: true },
    {
      id: 'rest',
      text: 'باقي القسمة',
      said: 'باقي قسمة 1188 على 528 هو 132 أيضًا — لكنّ الباقي لا يقول إنّه يقسم العددين.',
    },
    { id: 'common', text: 'قاسم مشترك', said: 'نعم، 132 قاسم مشترك — و 4 أيضًا. ما الذي يميّز 132؟' },
  ],
};
