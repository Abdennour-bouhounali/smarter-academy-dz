import { src, addition } from '../../_unit/unitMeta.js';

/**
 * « أستعدّ » (module 0) — le manuel n'a qu'un seul « أستعدّ » pour toute
 * l'unité (p. 7). Ces affirmations sont donc des AJOUTS DE LA PLATEFORME,
 * déclarés comme tels (SourceTag « عبارة إضافية من المنصّة ») : même forme que le
 * manuel (« أصحيح أم خاطئ؟ برّر إجابتك »), deux par acquis de `priorKnowledge`
 * (القواسم المشتركة, PGCD, خوارزمية إقليدس), jamais les nombres de la situation
 * du test final (936, 845) ni son résultat.
 */
export const PREP_ITEMS = [
  { n: 1, skill: 'qawasim', text: 'القواسم المشتركة للعددين 12 و 18 هي 1 ، 2 ، 3 ، 6.', answer: true, why: 'قواسم 12: 1 ، 2 ، 3 ، 4 ، 6 ، 12؛ قواسم 18: 1 ، 2 ، 3 ، 6 ، 9 ، 18؛ المشتركة 1 ، 2 ، 3 ، 6.' },
  { n: 2, skill: 'qawasim', text: 'العدد 4 قاسم مشترك للعددين 20 و 30.', answer: false, why: '4 يقسم 20 ولا يقسم 30: $30 = 4 \\times 7 + 2$.' },
  { n: 3, skill: 'pgcd', text: 'PGCD$(20 ; 30) = 10$.', answer: true, why: 'القواسم المشتركة للعددين 20 و 30 هي 1 ، 2 ، 5 ، 10 وأكبرها 10.' },
  { n: 4, skill: 'pgcd', text: 'PGCD$(a ; b)$ هو أصغر قاسم مشترك للعددين $a$ و $b$.', answer: false, why: 'هو أكبر قاسم مشترك لهما. أمّا أصغر قاسم مشترك فهو 1 دائمًا.' },
  { n: 5, skill: 'iqlidus', text: '$27 = 6 \\times 4 + 3$، إذن PGCD$(27 ; 6) = $ PGCD$(6 ; 3)$.', answer: true, why: 'PGCD$(a ; b) = $ PGCD$(b ; r)$ حيث $r$ باقي القسمة الإقليدية للعدد $a$ على $b$.' },
  { n: 6, skill: 'iqlidus', text: 'في خوارزمية إقليدس، PGCD هو أوّل باقٍ نحصل عليه.', answer: false, why: 'هو آخر باقٍ غير معدوم في القسمات المتتابعة، لا الباقي الأوّل.' },
].map((it) => ({ ...it, source: addition('prerequisite_diagnostic') }));

/**
 * وضعية الاختبار النهائي : le « تحدّي » de l'unité (manuel p. 7) — la même situation que le drapeau
 * `challenge` de la leçon 6, reprise ici comme déclaré (`duplicatedIn`, extraction.json). Son résolution
 * est le test final (module 8) ; le module 1 la lit et la fait analyser sans la résoudre. L'analyse en trois
 * étapes est un AJOUT DE LA PLATEFORME (le manuel ne la donne pas).
 */
export const SITUATION = {
  source: src('challenge', 7, 'تحدّ'),
  analysisSource: addition('exam_style_problem'),
  title: 'وضعية',
  text: 'قرّر رئيس البلدية تنظيم حملة تبرّعات لشراء المآزر المدرسية للمدارس الابتدائية الواقعة في إقليم البلدية، فتسارع الناس إلى المشاركة والعطاء، إيمانًا منهم بأهمية الإنفاق في سبيل الله والتكافل مع التلاميذ المحتاجين. وقد اقتنت مصالح البلدية 936 مئزرا ورديا للإناث و845 مئزرا أزرقًا للذكور. اقترح طريقة لتوزيع هذه المآزر بالتساوي على أكبر عدد ممكن من المدارس بحيث تتحصل كل مدرسة على العدد نفسه من المآزر من كل لون.',
  data: [
    { id: 'pink', text: '936 مئزرًا ورديًا للإناث', useful: true },
    { id: 'blue', text: '845 مئزرًا أزرق للذكور', useful: true },
    { id: 'max', text: 'التوزيع على أكبر عدد ممكن من المدارس', useful: true },
    { id: 'same', text: 'كل مدرسة تتحصل على العدد نفسه من المآزر من كل لون', useful: true },
    { id: 'mayor', text: 'رئيس البلدية قرّر تنظيم حملة تبرّعات', useful: false },
    { id: 'people', text: 'تسارع الناس إلى المشاركة والعطاء', useful: false },
  ],
  analysis: [
    { label: 'قراءة الوضعية وفهمها', text: 'المطلوب توزيع مآزر ورديّة ومآزر زرقاء بالتساوي على مدارس، بحيث تأخذ كل مدرسة العدد نفسه من كل لون، ولا يبقى شيء، ويكون عدد المدارس أكبر ما يمكن.' },
    { label: 'تحليل الوضعية واختيار استراتيجية حل مناسبة', text: 'عدد المدارس يقسم عدد المآزر الورديّة ويقسم عدد المآزر الزرقاء، أي هو قاسم مشترك للعددين، والأكبر هو القاسم المشترك الأكبر. نعيّنه بإحدى الخوارزميتين: الفروق المتتابعة أو إقليدس (ماذا تفعل القسمة الإقليدية بالباقي؟).' },
    { label: 'تنفيذ استراتيجية الحل', text: '• نطبّق الخوارزمية المختارة على العددين إلى أن يصير الباقي معدومًا؛ آخر باقٍ غير معدوم هو القاسم المشترك الأكبر. • نقسم كل عدد من المآزر على النتيجة لنعرف ما تتحصل عليه كل مدرسة من كل لون.' },
  ],
};
