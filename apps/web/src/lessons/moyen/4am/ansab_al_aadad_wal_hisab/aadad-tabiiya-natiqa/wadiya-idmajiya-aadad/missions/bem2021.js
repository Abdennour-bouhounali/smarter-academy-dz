/**
 * MISSION 1 of « أدمج تعلّماتي » (unit 1) — the situation of BEM 2021, first part: the identical lots.
 * DATA only (`docs/reports/INTEGRATION_LESSON_PLAN.md` §6): the scene and its two stocks, the story with its numbers
 * hidden, what the robot can be sent to count, the sentences of the text he places on his model, the goal flags, the
 * keys of the unit that could open each step, and the exam text as it was printed. The player
 * (`lessons/common/gameworld/missions/MissionPlayer.jsx`) names no lesson.
 * The official text is quoted for the reveal at the end of the mission, labelled with its session.
 */
const A = 1188;
const B = 528;

export const BEM_2021 = {
  id: 'bem-2021-lots',
  title: 'المهمّة 1: صناديق الفلّاح',
  session: 'شهادة التعليم المتوسط — دورة 2021',
  scene: 'lots',
  stock: { a: A, b: B },
  small: { a: 12, b: 8 },
  kinds: {
    a: { name: 'البطاطا', crates: 'صندوق بطاطا', color: '#e2b04a' },
    b: { name: 'الجزر', crates: 'صندوق جزر', color: '#f28b3c' },
  },
  lot: { one: 'تشكيلة', forms: ['تشكيلة واحدة', 'تشكيلتان', 'تشكيلات', 'تشكيلة'] },

  /** The story, its numbers hidden: `{ ask }` is a hole that fills when the robot has counted that thing. */
  story: [
    'فلّاح جنى محصول أرضه: ',
    { ask: 'a' },
    ' من البطاطا و ',
    { ask: 'b' },
    ' من الجزر. يريد أن يهدي محصوله لدور العجزة ومراكز الأيتام: يجمّع الصناديق كلّها في تشكيلات متماثلة، في كلّ تشكيلة العدد نفسه من صناديق البطاطا والعدد نفسه من صناديق الجزر — ويريد أن تستفيد أكبر عدد ممكن من الدور، تشكيلة لكلّ دار.',
  ],
  /** What he may send the robot to count or measure. A thing the story does not need is answered too: it is a fact. */
  asks: [
    { id: 'a', label: 'عدد صناديق البطاطا', said: `${A} صندوقًا`, needed: true },
    { id: 'b', label: 'عدد صناديق الجزر', said: `${B} صندوقًا`, needed: true },
    { id: 'mass', label: 'كتلة الصندوق الواحد', said: '25 كغ', needed: false },
    { id: 'price', label: 'ثمن الصندوق في السوق', said: '900 دج', needed: false },
    { id: 'area', label: 'مساحة الأرض', said: '3 هكتارات', needed: false },
  ],

  /** The sentences he places on his model. Four are the text's; two are readings students really make. */
  phrases: [
    { id: 'sameA', text: 'في كلّ تشكيلة العدد نفسه من صناديق البطاطا' },
    { id: 'equalAB', text: 'في التشكيلة: صناديق البطاطا بعدد صناديق الجزر' },
    { id: 'all', text: 'الصناديق كلّها تُجمَّع: لا يبقى صندوق' },
    { id: 'most', text: 'أكبر عدد ممكن من التشكيلات' },
    { id: 'apart', text: 'تشكيلات للبطاطا وتشكيلات للجزر' },
    { id: 'sameB', text: 'في كلّ تشكيلة العدد نفسه من صناديق الجزر' },
  ],

  /** The goal flags: each answer sentence built before any computation. `right` is the tile that says the goal. */
  flags: [
    {
      id: 'lots',
      ask: 'ما الذي نبحث عنه أوّلًا؟ اختر بداية الجملة ثمّ وحدتها.',
      starts: [
        { id: 'most', text: 'أكبر عدد من التشكيلات هو', right: true },
        { id: 'least', text: 'أصغر عدد من التشكيلات هو', built: 'تشكيلة واحدة تأخذ المحصول كلّه: دار واحدة تستفيد.' },
        {
          id: 'sum',
          text: 'عدد الصناديق كلّها هو',
          built: `عدّ الروبوت ${A + B} صندوقًا — ولم تُكوَّن أيّ تشكيلة بعد.`,
        },
      ],
      units: [
        { id: 'lot', text: 'تشكيلة', right: true },
        { id: 'crate', text: 'صندوقًا', built: 'العلم يعدّ صناديق، والفلّاح يسأل: كم دارًا تستفيد؟' },
        { id: 'da', text: 'دج', built: 'العلم يعدّ دنانير: لا أحد يبيع هنا شيئًا.' },
      ],
    },
    {
      id: 'content',
      ask: 'وماذا يجب أن تعرفه كلّ دار عن تشكيلتها؟',
      starts: [
        { id: 'both', text: 'في كلّ تشكيلة ▢ صندوقًا من البطاطا و ▢ صندوقًا من الجزر', right: true },
        {
          id: 'total',
          text: 'في كلّ تشكيلة ▢ صندوقًا',
          built: 'عدد واحد لا يقول كم من البطاطا وكم من الجزر: الدار لا تعرف ما ستستلم.',
        },
        { id: 'again', text: 'عدد التشكيلات هو ▢', built: 'هذا ما يقوله العلم الأوّل: لم نعرف بعد ما في التشكيلة.' },
      ],
    },
  ],
  /** The chain: which flag is raised first — the content of a lot needs the number of lots. */
  chain: {
    ask: 'أيّ العلمين يُرفع أوّلًا؟',
    first: 'lots',
    built: 'لنعرف ما في التشكيلة نقسم على عدد التشكيلات: هذا العدد لم نعرفه بعد.',
  },

  /** The keys of the unit he may pick to open the first step. `right` opens it; the others are carried out too. */
  tools: [
    { id: 'pgcd', icon: '🔁', text: 'القاسم المشترك الأكبر للعددين، بالقسمات المتتالية', right: true },
    { id: 'division', icon: '➗', text: `القسمة الإقليدية للعدد ${A} على ${B}: حاصلها` },
    { id: 'difference', icon: '➖', text: 'فرق العددين' },
    { id: 'rules', icon: '📏', text: 'قواعد قابلية القسمة على 2 و 3 و 5' },
  ],

  /** The four habits, named only after he has lived them. */
  habits: [
    { icon: '🙈', title: 'أقرأ القصّة قبل الأعداد', text: 'أفهم ما يجري، ثمّ أسأل: أيّ عدد أحتاج؟' },
    { icon: '🧩', title: 'أبني الوضعية', text: 'كلّ عبارة في النصّ شرط: « نفس العدد »، « كلّها »، « أكبر ».' },
    { icon: '🚩', title: 'أكتب جملة الجواب أوّلًا', text: 'ماذا أبحث عنه، وبأيّ وحدة — قبل أيّ حساب.' },
    { icon: '🌉', title: 'لكلّ خطوة مفتاحها', text: 'أختار القاعدة، أحسب، ثمّ أتحقّق: هل الجواب يبني ما طُلب؟' },
  ],

  /** The paper as printed (first part of the situation), shown at the end of the mission. */
  exam: {
    lines: [
      `خصّص فلاح قطعة أرض لإنتاج البطاطا و الجزر، فكان المحصول: ${A} صندوق من البطاطا و ${B} صندوقًا من الجزر.`,
      'قصد مساعدة دور العجزة و مراكز الأيتام و ذوي الاحتياجات الخاصة، يريد هذا الفلاح أن يُجمّع الصناديق في تشكيلات متماثلة من حيث النوع و العدد (أي كل تشكيلة تحتوي على نفس عدد الصناديق من البطاطا و نفس عدد الصناديق من الجزر).',
      '(ا) ما هو أكبر عدد من التشكيلات التي يمكن تكوينها؟',
      '(ب) ما هو عدد صناديق البطاطا و عدد صناديق الجزر في كل تشكيلة.',
    ],
  },
};
