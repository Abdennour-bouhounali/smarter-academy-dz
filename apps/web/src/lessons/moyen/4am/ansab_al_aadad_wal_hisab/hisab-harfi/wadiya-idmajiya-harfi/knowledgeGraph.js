/**
 * La carte PROGRESSIVE de « أدمج تعلّماتي » (unité 3) — la séance d'INTÉGRATION.
 * Contrat : docs/architecture/KNOWLEDGE_MAP.md, Part A (A.15, cas de l'intégration) ;
 * modèle : hisab-judhur/wadiya-idmajiya-judhur/knowledgeGraph.js.
 *
 *   — aucune connaissance nouvelle : la DÉMARCHE (modéliser, deux façons
 *     d'écrire l'aire du ruban, l'« مساعدة » du manuel, choisir la forme) ;
 *   — la SOLUTION (x = 1, la racine −11 rejetée) n'y figure pas : c'est la
 *     réponse de l'évaluation (A.10 règle 14) ;
 *   — les deux erreurs sont celles que le module 1 corrige (le ruban compté
 *     d'un seul côté, le carré d'une somme sans 2ab), avec leur « لماذا؟ » ;
 *   — « أؤكّد تعلّماتي » (module 2) renvoie aux leçons 1, 2 et 3, dont les
 *     cartes portent ces connaissances.
 *
 *                     [ما عرض الشريط؟]                         مفهوم
 *                          نفهمها │
 *                    [نمذجة بدلالة x]                          طريقة
 *              خطأ شائع ┌────────┴────────┐ نحسب بها
 *        ⛔ [الشريط من جهة واحدة]   [مساحة الشريط]              علاقة
 *                     خطأ شائع ┌────────┴────────┐ المساواة
 *              ⛔ [مربع مجموع بلا 2ab]      [مساعدة الكتاب]      علاقة
 *                                              │ نطبّقها
 *                                    [من الشكل إلى المعادلة]    طريقة
 *                                              │ نختار الشكل
 *                                       [أيّ شكل أختار؟]        طريقة (محور 3)
 *                                              │ نستخلص
 *                                       🎯 [ثلاث مراحل]
 */
import { SITUATION, REMARKS } from './content/textbook';

export const KNOWLEDGE_GRAPH = {
  root: 'wadiya',
  nodes: [
    {
      id: 'wadiya', kind: 'concept', lane: 'center', requires: 'namdhaja',
      title: 'ما عرض الشريط؟', subtitle: SITUATION.caption,
      context: { text: SITUATION.text, note: SITUATION.help },
      reveals: ['namdhaja'],
    },
    { id: 'namdhaja', kind: 'method', lane: 'center', requires: 'namdhaja', notebook: true, title: 'نمذجة بدلالة x', reveals: ['dil', 'masaha'] },
    {
      // ⛔ خطأ شائع — module 1, question 2 : le distracteur « 10 + x » et sa correction.
      id: 'dil', kind: 'common_mistake', lane: 'start', requires: 'namdhaja',
      title: 'الشريط من جهة واحدة', subtitle: 'ضلع المربع الخارجي',
      context: {
        parts: [
          { role: 'wrong', text: REMARKS.dilWrong },
          { role: 'why', text: REMARKS.dilWhy },
          { role: 'right', text: REMARKS.dilRight },
        ],
      },
      reveals: [],
    },
    { id: 'masaha', kind: 'relationship', lane: 'end', requires: 'masaha-tariqatan', notebook: true, title: 'مساحة الشريط', subtitle: 'طرق متعددة', reveals: ['murabba', 'musaada'] },
    {
      // ⛔ خطأ شائع — module 1, question 4 : le distracteur « 4x² » ((a + b)² = a² + b²).
      id: 'murabba', kind: 'common_mistake', lane: 'start', requires: 'masaha-tariqatan',
      title: 'مربع مجموع بلا 2ab', subtitle: 'المستطيلات المنسية',
      context: {
        parts: [
          { role: 'wrong', text: REMARKS.murabbaWrong },
          { role: 'why', text: REMARKS.murabbaWhy },
          { role: 'right', text: REMARKS.murabbaRight },
        ],
      },
      reveals: [],
    },
    { id: 'musaada', kind: 'relationship', lane: 'end', requires: 'musaada-jadaa', notebook: true, title: 'مساعدة الكتاب', subtitle: 'جداء أحد عامليه معدوم', reveals: ['tariqa'] },
    { id: 'tariqa', kind: 'method', lane: 'end', requires: 'tariqat-wadiya', notebook: true, title: 'من الشكل إلى المعادلة', reveals: ['ikhtiyar'] },
    { id: 'ikhtiyar', kind: 'method', lane: 'center', requires: 'ikhtiyar-shakl', notebook: true, title: 'أيّ شكل أختار؟', subtitle: 'منشور أم محلّل', reveals: ['khulasa'] },
    {
      // 🎯 خلاصة — les trois étapes de l'analyse du manuel, nommées par lui.
      id: 'khulasa', kind: 'takeaway', lane: 'center', requires: 'ikhtiyar-shakl',
      title: 'ثلاث مراحل', subtitle: 'نقرأ · نحلّل · ننفّذ',
      context: { list: SITUATION.analysis.map((a) => a.label) },
      reveals: [],
    },
  ],
  edges: [
    { from: 'wadiya', to: 'namdhaja', label: 'نفهمها' },
    { from: 'namdhaja', to: 'dil', label: 'خطأ شائع' },
    { from: 'namdhaja', to: 'masaha', label: 'نحسب بها' },
    { from: 'masaha', to: 'murabba', label: 'خطأ شائع' },
    { from: 'masaha', to: 'musaada', label: 'المساواة' },
    { from: 'musaada', to: 'tariqa', label: 'نطبّقها' },
    { from: 'tariqa', to: 'ikhtiyar', label: 'نختار الشكل' },
    { from: 'ikhtiyar', to: 'khulasa', label: 'نستخلص' },
  ],
};
