/**
 * MISSION 1 of « أدمج تعلّماتي » (unit 1) — the situation of BEM 2022, first part: the identical lots.
 * DATA only (`docs/reports/INTEGRATION_LESSON_PLAN.md` §8): the exam text as printed, cut into its PHRASES (each one
 * lights when the student's act has produced its line of numbers), the two stocks, the words of the scene, and the
 * names of the unit's keys offered for the last sentence of his copy. The player
 * (`lessons/common/gameworld/missions/MissionPlayer.jsx`) names no lesson.
 */
const A = 1188;
const B = 528;

export const BEM_2022 = {
  id: 'bem-2022-lots',
  title: 'المهمّة 1',
  session: 'شهادة التعليم المتوسط — دورة 2022',
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

  /** The clock of the mission, in minutes (a clock runs in every mission — owner, 2026-11-20). */
  minutes: 25,

  /**
   * « المعطيات » of his copy. The two stocks are tapped in the text; a CONDITION carried by words is added when the
   * depot has shown what happens without it (`phrase` = the phrase of the paper it comes from).
   */
  data: [
    { id: 'a', text: `${A} صندوق بطاطا` },
    { id: 'b', text: `${B} صندوق جزر` },
    { id: 'all', text: 'كلّ الصناديق تُجمَّع', phrase: 'all' },
    { id: 'same', text: 'تشكيلات متماثلة', phrase: 'same' },
  ],
  /** « المطلوب »: the two questions, tapped in the text. */
  goals: [
    { id: 'most', label: '(ا)', text: 'أكبر عدد من التشكيلات' },
    { id: 'content', label: '(ب)', text: 'عدد صناديق كلّ نوع في كلّ تشكيلة' },
  ],
  /**
   * « أربط »: what each question needs. `ans` is the answer of the question before — the CHAIN. A datum left out is
   * answered by what the depot could not do without it.
   */
  needs: {
    most: {
      must: ['a', 'b', 'all', 'same'],
      without: {
        a: 'بلا عدد صناديق البطاطا، لا يعرف المستودع كم صندوقًا يوزّع.',
        b: 'بلا عدد صناديق الجزر، التشكيلات تُكوَّن من البطاطا وحدها.',
        all: 'بلا « كلّ الصناديق »، يمكن ترك صناديق على الرصيف: أيّ عدد من التشكيلات يصلح إذن.',
        same: 'بلا « متماثلة »، يمكن أن تختلف التشكيلات: أيّ عدد من التشكيلات يصلح إذن.',
      },
    },
    content: {
      must: ['ans', 'a', 'b'],
      without: {
        ans: 'بلا عدد التشكيلات، على كم نقسم الصناديق؟',
        a: 'بلا عدد صناديق البطاطا، لا نعرف ما يأخذه كلّ تشكيلة منها.',
        b: 'بلا عدد صناديق الجزر، لا نعرف ما يأخذه كلّ تشكيلة منه.',
      },
    },
  },
  /** What a marker looks for on a copy — the platform's list, not an official scale. He ticks it against HIS sheet. */
  marker: [
    'كتبتُ المعطيات بأعدادها ووحداتها',
    'كتبتُ المطلوب قبل أن أحسب',
    'كتبتُ لماذا أبحث عن القاسم المشترك الأكبر',
    'وضعتُ القسمتين وكتبتُ الباقي في كلّ مرّة',
    'كتبتُ جملة جواب لكلّ سؤال، بوحدتها',
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
