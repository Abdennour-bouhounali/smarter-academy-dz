/**
 * La carte PROGRESSIVE de « أدمج تعلّماتي » (unité 9 « خاصية طالس ») — la séance d'INTÉGRATION.
 * Contrat : docs/architecture/KNOWLEDGE_MAP.md, Part A (A.15, cas de l'intégration) ;
 * modèle : tanasubiya_duwal/ihsa/wadiya-idmajiya-ihsa.
 *
 *   — aucune connaissance nouvelle : la DÉMARCHE du manuel appliquée au تحدّ (l'ombre du bâton) et à la وضعية
 *     (la coupe axiale, l'équation h = r, le volume et sa vérification), et l'outil de « أتعمّق » (une distance
 *     inaccessible) ;
 *   — la وضعية du manuel est résolue au module 1 (enseignement) ; l'évaluation est un AUTRE cornet et une AUTRE
 *     minaret, dont aucune réponse n'est ici (A.10 règle 14) ;
 *   — les trois erreurs sont celles que le module 1 corrige avec leur « لماذا؟ » : planter le bâton n'importe où
 *     (pas de sommet commun), écrire r ÷ 6 = h ÷ 18 (le côté OT oublié), calculer le volume avec le diamètre.
 *
 *                     [طول لا نقيسه مباشرة]                         مفهوم
 *                               │ نبدأ بـ
 *     خطأ شائع ┌────── [طريقة الظل]                                  طريقة
 *                               │ ثم
 *     خطأ شائع ┌────── [المقطع المحوري]                              طريقة
 *                               │ ثم
 *                       [شرط يعطي معادلة]                            طريقة
 *                               │ ثم
 *     خطأ شائع ┌────── [الحجم والملاءمة]                             علاقة
 *                               │ نجمعها
 *                     [من النص إلى الجواب] → [مسافة لا نقيسها] → 🎯
 */
import { SITUATION, REMARKS } from './content/textbook';

export const KNOWLEDGE_GRAPH = {
  root: 'wadiya',
  nodes: [
    {
      id: 'wadiya', kind: 'concept', lane: 'center', requires: 'tariqat-zill',
      title: 'طول لا نقيسه مباشرة', subtitle: 'طالس ثم معادلة',
      context: { text: REMARKS.tajnid },
      reveals: ['zill'],
    },
    { id: 'zill', kind: 'method', lane: 'center', requires: 'tariqat-zill', notebook: true, title: 'طريقة الظل', subtitle: 'ارتفاع المئذنة', reveals: ['zillKhata', 'maqta'] },
    {
      // ⛔ خطأ شائع — module 1, étape 1 : le bâton planté n'importe où (pas de sommet commun).
      id: 'zillKhata', kind: 'common_mistake', lane: 'start', requires: 'tariqat-zill',
      title: 'العصا في أيّ مكان؟', subtitle: 'لا رأس مشترك',
      context: {
        parts: [
          { role: 'wrong', text: REMARKS.zillWrong },
          { role: 'why', text: REMARKS.zillWrongWhy },
          { role: 'right', text: REMARKS.zillRight },
        ],
      },
      reveals: [],
    },
    { id: 'maqta', kind: 'method', lane: 'end', requires: 'maqta-mihwari-talis', notebook: true, title: 'المقطع المحوري', subtitle: 'مثلثان رأسهما O', reveals: ['otKhata', 'muadala'] },
    {
      // ⛔ خطأ شائع — module 1, étape 6 : r ÷ 6 = h ÷ 18 (MISC-TALIS-QITAA-BADAL-DILA).
      id: 'otKhata', kind: 'common_mistake', lane: 'start', requires: 'maqta-mihwari-talis',
      title: 'h بدل الضلع OT', subtitle: 'الضلع من O',
      context: {
        parts: [
          { role: 'wrong', text: REMARKS.otWrong },
          { role: 'why', text: REMARKS.otWhy },
          { role: 'right', text: REMARKS.otRight },
        ],
      },
      reveals: [],
    },
    { id: 'muadala', kind: 'method', lane: 'end', requires: 'muadala-bud', notebook: true, title: 'شرط يعطي معادلة', subtitle: 'معادلة في r', reveals: ['hajm'] },
    { id: 'hajm', kind: 'relationship', lane: 'end', requires: 'mulaamat-natija', notebook: true, title: 'الحجم وملاءمة النتيجة', reveals: ['qutrKhata', 'marahil'] },
    {
      // ⛔ خطأ شائع — module 1, étape 8 : le volume calculé avec le diamètre (MISC-TALIS-QUTR-BADAL-NISF).
      id: 'qutrKhata', kind: 'common_mistake', lane: 'start', requires: 'mulaamat-natija',
      title: 'القطر بدل نصف القطر', subtitle: 'الحجم بنصف القطر',
      context: {
        parts: [
          { role: 'wrong', text: REMARKS.qutrWrong },
          { role: 'why', text: REMARKS.qutrWhy },
          { role: 'right', text: REMARKS.qutrRight },
        ],
      },
      reveals: [],
    },
    { id: 'marahil', kind: 'method', lane: 'center', requires: 'tariqat-wadiya', notebook: true, title: 'من النص إلى الجواب', reveals: ['masafa'] },
    { id: 'masafa', kind: 'method', lane: 'center', requires: 'taqdir-masafa', notebook: true, title: 'مسافة لا نقيسها مباشرة', subtitle: 'التمرين 22', reveals: ['khulasa'] },
    {
      // 🎯 خلاصة — les trois étapes de l'analyse du manuel, nommées par lui.
      id: 'khulasa', kind: 'takeaway', lane: 'center', requires: 'taqdir-masafa',
      title: 'ثلاث مراحل', subtitle: 'نقرأ · نحلّل · ننفّذ',
      context: { list: SITUATION.analysis.map((a) => a.label) },
      reveals: [],
    },
  ],
  edges: [
    { from: 'wadiya', to: 'zill', label: 'نبدأ بـ' },
    { from: 'zill', to: 'zillKhata', label: 'خطأ شائع' },
    { from: 'zill', to: 'maqta', label: 'الرأس O نفسه' },
    { from: 'maqta', to: 'otKhata', label: 'خطأ شائع' },
    { from: 'maqta', to: 'muadala', label: 'ثم' },
    { from: 'muadala', to: 'hajm', label: 'ثم' },
    { from: 'hajm', to: 'qutrKhata', label: 'خطأ شائع' },
    { from: 'hajm', to: 'marahil', label: 'نجمعها' },
    { from: 'marahil', to: 'masafa', label: 'في التمارين' },
    { from: 'masafa', to: 'khulasa', label: 'نستخلص' },
  ],
};
