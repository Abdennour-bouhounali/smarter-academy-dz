import { src, addition, BASE } from '../../_unit/unitMeta.js';

/**
 * « أستعدّ » (module 0) — le manuel n'a qu'un seul « أستعدّ » pour toute
 * l'unité (p. 7, items 1–10 : leçons 1 et 8). Ces affirmations sont donc des
 * AJOUTS DE LA PLATEFORME, déclarés comme tels (SourceTag « عبارة إضافية من المنصّة ») : même
 * forme que le manuel (« أصحيح أم خاطئ؟ برّر إجابتك »), une ou plusieurs par
 * acquis de `priorKnowledge`, jamais les nombres de l'activité qui suit.
 */
export const PREP_ITEMS = [
  { n: 1, skill: 'qawaid', text: 'العدد 3560 يقبل القسمة على 10 لأنّ رقم آحاده 0.', answer: true, why: 'كل عدد رقم آحاده 0 مضاعف للعدد 10: $3560 = 10 \\times 356$.' },
  { n: 2, skill: 'qawaid', text: 'العدد 1326 يقبل القسمة على 4 لأنّ رقم آحاده 6 زوجي.', answer: false, why: 'العدد المكوَّن من رقمي العشرات والآحاد 26 لا يقبل القسمة على 4: $1326 = 4 \\times 331 + 2$.' },
  { n: 3, skill: 'khawass', text: '8 يقسم 40، إذن 8 يقسم كل مضاعف للعدد 40، مثل 1200.', answer: true, why: 'قاسم عدد يقسم كل مضاعف له: $1200 = 40 \\times 30 = 8 \\times 150$.' },
  { n: 4, skill: 'khawass', text: '4 يقسم 8، إذن كل عدد يقبل القسمة على 4 يقبل القسمة على 8.', answer: false, why: 'العكس هو الصحيح: كل عدد يقبل القسمة على 8 يقبل القسمة على 4. أمّا 12 فيقبل القسمة على 4 ولا يقبل القسمة على 8.' },
  { n: 5, skill: 'mushtaraka', text: 'القواسم المشتركة للعددين 8 و 10 هي 1 و 2.', answer: true, why: 'قواسم 8: 1 ، 2 ، 4 ، 8؛ قواسم 10: 1 ، 2 ، 5 ، 10.' },
  { n: 6, skill: 'mushtaraka', text: 'القواسم المشتركة للعددين 12 و 20 هي 1 ، 2 ، 4 ، 12.', answer: false, why: '12 لا يقسم 20. قواسم 12: 1 ، 2 ، 3 ، 4 ، 6 ، 12؛ قواسم 20: 1 ، 2 ، 4 ، 5 ، 10 ، 20؛ المشتركة 1 ، 2 ، 4.' },
].map((it) => ({ ...it, source: addition('prerequisite_diagnostic') }));

export const SITUATION = {
  source: src('situation', 16, 'أدمج تعلّماتي'),
  title: 'وضعية',
  text: 'حبًّا في الجزائر وحرصًا على صون تراثها، تحصّل خبير على مشروع ترميم واجهة مَعْلَم تاريخي. تتمثل الأعمال التي طُلِبَ من هذا الخبير إنجازها في تغطية واجهة هذا المَعْلَم باستعمال قِطع خزفية متماثلة، عددها لا يفوق 2443 حيث رقما العشرات والمئات متساويان ويساويان ضعف رقم الآلاف. ويؤمن هذا الخبير بأنّ إتقان العمل أمانة. إذا قسّم هذا الخبير الكمية الإجمالية على 4 أو 8 أو 10 حِرَفيّين في فن الخزف لا تبقى عنده أية قطعة. ما هو عدد القطع الخزفية التي سيستعملها هذا الخبير لتغطية الواجهة؟',
  hint: 'مساعدة: كل عدد مضاعف للعدد 10 رقم آحاده 0.',
  imageCaption: 'قصر الريّاس',
  data: [
    { id: 'max', text: 'عدد القطع لا يفوق 2443', useful: true },
    { id: 'digits', text: 'رقما العشرات والمئات متساويان ويساويان ضعف رقم الآلاف', useful: true },
    { id: 'div', text: 'القسمة على 4 أو 8 أو 10 حِرَفيّين لا تترك أية قطعة', useful: true },
    { id: 'expert', text: 'الخبير تحصّل على مشروع ترميم', useful: false },
    { id: 'place', text: 'الواجهة واجهة مَعْلَم تاريخي (قصر الرياس)', useful: false },
    { id: 'same', text: 'القطع الخزفية متماثلة', useful: false },
  ],
  analysis: [
    { label: 'قراءة الوضعية وفهمها', text: 'المطلوب البحث عن عدد أصغر من 2443، مضاعف للأعداد 4 ، 8 ، 10 ، رقما عشراته و مئاته متساويان وكلاهما مضاعف لرقم آلاف هذا العدد.' },
    { label: 'تحليل الوضعية واختيار استراتيجية حل مناسبة', text: 'العدد من رتبة عشرات الآلاف (مشكّل من أربعة أرقام)، استعمال قابلية القسمة على 10 (ماذا يميّز الأعداد التي تقبل القسمة على 10؟)، التجريب على أعداد، الترميز لأرقام هذا العدد بحروف،...' },
    { label: 'تنفيذ استراتيجية الحل', text: '• التجريب على أعداد مشكّلة من أربع مراتب وتقبل القسمة على كل من 4 ، 8 ، 10 ، وأصغر من 2443. • كتابة العدد المطلوب على الشكل $1000a + 100b + 10c + d$ وتطوير الفكرة باستغلال باقي المعطيات.' },
  ],
  answer: 2440,
};

/** « أؤكّد تعلّماتي » (p. 16) : chaque item renvoie au درس qui l'enseigne (le manuel renvoie à la page). */
export const QCM = [
  { n: 1, text: 'في القسمة الإقليدية للعدد 72 على 5 ...', options: ['حاصل القسمة يساوي 14 والباقي 2', 'حاصل القسمة هو 2 والباقي 14', 'حاصل القسمة هو 72 والباقي 5'], correct: 0, pages: [10], lesson: 'qasim-adad-tabii', explain: '$72 = 5 \\times 14 + 2$.' },
  { n: 2, text: 'في القسمة الإقليدية للعدد 84 على 12 ...', options: ['حاصل القسمة هو 7 والباقي 12', 'حاصل القسمة هو 7 والباقي 0', 'حاصل القسمة هو 7 والباقي 10'], correct: 1, pages: [10], lesson: 'qasim-adad-tabii', explain: '$84 = 12 \\times 7 + 0$: 12 قاسم للعدد 84.' },
  { n: 3, text: 'قواسم العدد 121 هي ...', options: ['11 ؛ 121', '1 ؛ 11', '1 ؛ 11 ؛ 121'], correct: 2, pages: [10, 11], lesson: 'qawasim-adad-tabii', explain: '$121 = 11 \\times 11$؛ لا ننسى 1 والعدد نفسه.' },
  { n: 4, text: 'قواسم العدد 34 هي ...', options: ['1 ؛ 2 ؛ 17 ؛ 34', '2 ؛ 17', '1 ؛ 2 ؛ 17'], correct: 0, pages: [10, 11], lesson: 'qawasim-adad-tabii', explain: '$34 = 1 \\times 34 = 2 \\times 17$.' },
  { n: 5, text: 'قواسم العدد $7 \\times 2^3$ هي ...', options: ['2 ؛ 7', '1 ؛ 2 ؛ 4 ؛ 8 ؛ 7 ؛ 14 ؛ 28 ؛ 56', '8 ؛ 7'], correct: 1, pages: [10, 11], lesson: 'qawasim-adad-tabii', explain: '$56 = 1 \\times 56 = 2 \\times 28 = 4 \\times 14 = 7 \\times 8$.' },
  { n: 6, text: 'القواسم المشتركة للعددين 15 و 28 هي ...', options: ['1', '1 ؛ 15 ؛ 28', '1 ؛ 2 ؛ 3 ؛ 5 ؛ 7'], correct: 0, pages: [10], lesson: 'qasim-mushtarak-akbar', explain: 'قواسم 15: 1 ، 3 ، 5 ، 15؛ قواسم 28: 1 ، 2 ، 4 ، 7 ، 14 ، 28. المشترك الوحيد 1.' },
  { n: 7, text: 'القواسم المشتركة للعددين $2^3 \\times 3$ و $2 \\times 3^3$ هي ...', options: ['1 ؛ 2 ؛ 3 ؛ 6', '2 ؛ 3', '8 ؛ 27'], correct: 0, pages: [10], lesson: 'qasim-mushtarak-akbar', explain: '24 و 54: PGCD = 6، والقواسم المشتركة هي قواسم 6.' },
  { n: 8, text: 'القاسم المشترك الأكبر للعددين 29 و 39 هو ...', options: ['1', '10', '29'], correct: 0, pages: [12, 13], lesson: 'awwaliyan-fima-baynahuma', explain: 'قواسم 29: 1 ، 29؛ قواسم 39: 1 ، 3 ، 13 ، 39.' },
  { n: 9, text: 'من المساواة $125 = 75 \\times 1 + 50$ ينتج أن ...', options: ['PGCD(125 ; 75) = 1', 'PGCD(125 ; 75) = PGCD(75 ; 50)', 'PGCD(125 ; 75) = 50'], correct: 1, pages: [12, 13], lesson: 'bahth-pgcd', explain: 'PGCD(a ; b) = PGCD(b ; r) مع r باقي قسمة a على b.' },
].map((it) => ({ ...it, source: src('qcm', 16, 'أؤكّد تعلّماتي', it.n), lessonPath: `${BASE}/${it.lesson}` }));

export const LESSON_TITLES = {
  'qasim-adad-tabii': 'الدرس 1 — التعرّف على قاسم لعدد طبيعي',
  'qawasim-adad-tabii': 'الدرس 2 — قواسم عدد طبيعي',
  'qasim-mushtarak-akbar': 'الدرس 4 — القاسم المشترك الأكبر',
  'awwaliyan-fima-baynahuma': 'الدرس 7 — العددان الأوليان فيما بينهما',
  'bahth-pgcd': 'الدرس 6 — البحث عن القاسم المشترك الأكبر',
};
