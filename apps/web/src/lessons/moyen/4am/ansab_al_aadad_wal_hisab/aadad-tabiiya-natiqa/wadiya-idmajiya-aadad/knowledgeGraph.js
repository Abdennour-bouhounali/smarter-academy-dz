/**
 * La carte PROGRESSIVE de « أدمج تعلّماتي » — la séance d'INTÉGRATION de l'unité.
 * Contrat : docs/architecture/KNOWLEDGE_MAP.md, Part A (A.15, cas particulier) ;
 * référence : qasim-adad-tabii/knowledgeGraph.js.
 *
 * Une leçon à part, traitée à part :
 *   — elle n'introduit AUCUNE connaissance (knowledge.jsx : deux rappels, au module 7) ;
 *     la carte ne lui en invente pas : elle montre la DÉMARCHE (قراءة → تحليل
 *     واستراتيجية → تنفيذ) d'une situation « deux sortes d'objets, le plus grand nombre de groupes » et ce qu'elle mobilise ;
 *   — dans le LECTEUR DE MISSION la carte est OUVERTE dès le premier écran (`knowledgeMapOpen`, 2026-11-12) : elle parle donc EN LETTRES
 *     (a objets d'une sorte, b d'une autre, g groupes) — ni les nombres de la وضعية des tabliers (le module 7), ni sa solution (le défi 🏆,
 *     module 8) : content/forbidden.js, content/mission.test.js (le balayage a d'abord échoué ici : le nœud racine montrait la وضعية entière) ;
 *   — les six وضعيات d'entraînement (modules 1 à 6) ne sont pas dans la carte : elles s'entraînent sur d'autres nombres.
 *
 *                     [كم مجموعة؟]                         مفهوم
 *                         نفهمها │
 *                     [قراءة الوضعية]                      فكرة أساسية
 *              تذكّر ┌──────┴──────┐ نختار استراتيجية
 *   📌 [القاسم المشترك الأكبر]   [خوارزمية إقليدس]          طريقة
 *          خطأ شائع │                │ نطبّقها
 *       ⛔ [مجموع أم قاسم؟]      [آخر باقٍ غير معدوم]       مثال
 *                    └──────┬─────────┘ نستخلص
 *                    🎯 [ثلاث مراحل]
 */
/** Les trois étapes de l'analyse, EN LETTRES (la démarche de toute وضعية « أكبر عدد من المجموعات »). */
const STEPS = [
  { label: 'قراءة الوضعية وفهمها', text: 'نوزّع a شيئًا من نوع و b شيئًا من نوع آخر بالتساوي على مجموعات: كل مجموعة تأخذ العدد نفسه من كل نوع، لا يبقى شيء، وعدد المجموعات أكبر ما يمكن.' },
  { label: 'تحليل الوضعية واختيار استراتيجية حل مناسبة', text: 'عدد المجموعات يقسم a ويقسم b: هو قاسم مشترك لهما، والأكبر هو PGCD(a ; b). حين يكون العددان كبيرين نعيّنه بخوارزمية إقليدس.' },
  { label: 'تنفيذ استراتيجية الحل', text: '• نقسم الأكبر على الأصغر، ثم القاسم على الباقي، إلى أن يصير الباقي معدومًا؛ آخر باقٍ غير معدوم هو g = PGCD(a ; b). • كل مجموعة تأخذ a ÷ g من النوع الأوّل و b ÷ g من النوع الثاني.' },
];
const [fahm, istratijiya, tanfidh] = STEPS;
const NOT_SOLVED_HERE = 'في وضعية الوحدة نفهم ونختار الاستراتيجية؛ والحلّ نفسه هو التحدّي.';

export const KNOWLEDGE_GRAPH = {
  root: 'wadiya',
  nodes: [
    {
      id: 'wadiya', kind: 'concept', lane: 'center', requires: 'pgcd-taarif',
      title: 'كم مجموعة؟', subtitle: 'توزيع نوعين بالتساوي',
      context: { text: 'لدينا a شيئًا من نوع و b شيئًا من نوع آخر، ونريد توزيعها كلّها بالتساوي على أكبر عدد ممكن من المجموعات.' },
      reveals: ['fahm'],
    },
    {
      id: 'fahm', kind: 'idea', lane: 'center', requires: 'pgcd-taarif',
      title: 'قراءة الوضعية', subtitle: 'توزيع بالتساوي دون باقٍ',
      context: { text: fahm.text, list: ['عدد الأشياء من النوع الأوّل: a', 'عدد الأشياء من النوع الثاني: b', 'أكبر عدد ممكن من المجموعات', 'العدد نفسه من كل نوع في كل مجموعة'] },
      reveals: ['qasim', 'iqlidus'],
    },
    {
      // 📌 تذكّر — l'item « تذكير » du module 7.
      id: 'qasim', kind: 'prerequisite', lane: 'start', requires: 'pgcd-taarif', notebook: true,
      title: 'القاسم المشترك الأكبر', subtitle: 'أكبر عدد يقسم العددين',
      reveals: ['khata'],
    },
    {
      // ⛔ خطأ شائع — la question de la condition du module 7 et « ورقة نسيبة » : le total au lieu de chaque sorte.
      id: 'khata', kind: 'common_mistake', lane: 'start', requires: 'pgcd-taarif',
      title: 'مجموع أم قاسم؟', subtitle: 'عدد المجموعات يقسم العددين',
      context: {
        parts: [
          { role: 'wrong', text: 'نبحث عن قاسم لمجموع العددين a + b، أو نأخذ الفرق a − b، ونعتبر الناتج عدد المجموعات.' },
          { role: 'why', text: 'لا يبقى أيّ شيء من كل نوع: الباقي معدوم في القسمتين، فعدد المجموعات قاسم لـ a ولـ b معًا، لا قاسم لمجموعهما ولا فرقهما.' },
          { role: 'right', text: fahm.text },
        ],
      },
      reveals: [],
    },
    {
      id: 'iqlidus', kind: 'method', lane: 'end', requires: 'khwarizmiyat-iqlidus', notebook: true,
      title: 'خوارزمية إقليدس', subtitle: 'قسمات متتابعة إلى باقٍ معدوم',
      context: { text: istratijiya.text, note: tanfidh.text },
      reveals: ['buwar'],
    },
    {
      id: 'buwar', kind: 'example', lane: 'end', requires: 'khwarizmiyat-iqlidus',
      title: 'آخر باقٍ غير معدوم', subtitle: 'هو القاسم المشترك الأكبر',
      context: {
        text: 'نقسم الأكبر على الأصغر، ثم الأصغر على الباقي، إلى أن يصير الباقي معدومًا: آخر باقٍ غير معدوم هو القاسم المشترك الأكبر.',
        note: NOT_SOLVED_HERE,
      },
      reveals: ['khulasa'],
    },
    {
      // 🎯 خلاصة — les trois étapes de l'analyse, nommées par la leçon.
      id: 'khulasa', kind: 'takeaway', lane: 'center', requires: 'khwarizmiyat-iqlidus',
      title: 'ثلاث مراحل', subtitle: 'نقرأ · نحلّل · ننفّذ',
      context: { list: STEPS.map((a) => a.label) },
      reveals: [],
    },
  ],
  edges: [
    { from: 'wadiya', to: 'fahm', label: 'نفهمها' },
    { from: 'fahm', to: 'qasim', label: 'تذكّر' },
    { from: 'qasim', to: 'khata', label: 'خطأ شائع' },
    { from: 'fahm', to: 'iqlidus', label: 'نختار استراتيجية' },
    { from: 'iqlidus', to: 'buwar', label: 'نطبّقها' },
    { from: 'khata', to: 'khulasa', label: 'نستخلص' },
    { from: 'buwar', to: 'khulasa', label: 'نستخلص' },
  ],
};
