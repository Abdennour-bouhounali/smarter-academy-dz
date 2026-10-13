/**
 * La carte PROGRESSIVE de « أدمج تعلّماتي » — la séance d'INTÉGRATION de l'unité.
 * Contrat : docs/architecture/KNOWLEDGE_MAP.md, Part A (A.15, cas particulier) ;
 * référence : qasim-adad-tabii/knowledgeGraph.js.
 *
 * Une leçon à part, traitée à part :
 *   — elle n'introduit AUCUNE connaissance (knowledge.jsx : deux rappels, au module 7) ;
 *     la carte ne lui en invente pas : elle montre la DÉMARCHE (قراءة → تحليل
 *     واستراتيجية → تنفيذ) de la situation des tabliers et ce qu'elle mobilise ;
 *   — la SOLUTION (13 écoles) n'y figure pas. Tout nœud est gardé par un item du
 *     module 7, alors que le module 8 (« وضعية الاختبار النهائي ») est l'évaluation ; et
 *     le module 7 le dit lui-même : « هنا فهمنا واختطّينا الاستراتيجية فقط ».
 *   — les six وضعيات d'entraînement (modules 1 à 6) ne sont pas dans la carte : elles
 *     s'entraînent sur d'autres nombres, la carte reste celle de la situation du test.
 *
 * Sources : content/textbook.js (SITUATION : énoncé, données, analyse — un ajout de
 * la plateforme), la question 3 du module 7 et sa remarque, le distracteur de E1/E2.
 *
 *                     [كم مدرسة؟]                          مفهوم
 *                         نفهمها │
 *                     [قراءة الوضعية]                      فكرة أساسية
 *              تذكّر ┌──────┴──────┐ نختار استراتيجية
 *   📌 [القاسم المشترك الأكبر]   [خوارزمية إقليدس]          طريقة
 *          خطأ شائع │                │ نطبّقها
 *       ⛔ [مجموع أم قاسم؟]      [الخطوة الأولى]           مثال
 *                    └──────┬─────────┘ نستخلص
 *                    🎯 [ثلاث مراحل]
 */
import { SITUATION } from './content/textbook';

const useful = SITUATION.data.filter((d) => d.useful);
const [fahm, istratijiya, tanfidh] = SITUATION.analysis;
// Module 7, remarque finale : la carte s'arrête là où le module 1 s'arrête.
const NOT_SOLVED_HERE = 'الحلّ نفسه في «وضعية الاختبار النهائي»: هنا فهمنا واختطّينا الاستراتيجية فقط.';

export const KNOWLEDGE_GRAPH = {
  root: 'wadiya',
  nodes: [
    {
      id: 'wadiya', kind: 'concept', lane: 'center', requires: 'pgcd-taarif',
      title: 'كم مدرسة؟', subtitle: 'المآزر المدرسية',
      context: { text: SITUATION.text },
      reveals: ['fahm'],
    },
    {
      id: 'fahm', kind: 'idea', lane: 'center', requires: 'pgcd-taarif',
      title: 'قراءة الوضعية', subtitle: 'توزيع بالتساوي دون باقٍ',
      context: { text: fahm.text, list: useful.map((d) => d.text) },
      reveals: ['qasim', 'iqlidus'],
    },
    {
      // 📌 تذكّر — l'item « تذكير » du module 7.
      id: 'qasim', kind: 'prerequisite', lane: 'start', requires: 'pgcd-taarif', notebook: true,
      title: 'القاسم المشترك الأكبر', subtitle: 'أكبر عدد يقسم العددين',
      reveals: ['khata'],
    },
    {
      // ⛔ خطأ شائع — la question 3 du module 7 : le distracteur « مجموع / فرق ».
      id: 'khata', kind: 'common_mistake', lane: 'start', requires: 'pgcd-taarif',
      title: 'مجموع أم قاسم؟', subtitle: 'عدد المدارس يقسم العددين',
      context: {
        parts: [
          { role: 'wrong', text: 'نجمع عدد المآزر الورديّة والزرقاء، أو نطرح أحدهما من الآخر، ونعتبر الناتج عدد المدارس.' },
          { role: 'why', text: 'لا يبقى أيّ مئزر: الباقي معدوم في كل قسمة، فعدد المدارس قاسم للعددين، لا مجموعهما ولا فرقهما.' },
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
      // La remarque du module 7 : on s'arrête avant le calcul.
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
      context: { list: SITUATION.analysis.map((a) => a.label) },
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
