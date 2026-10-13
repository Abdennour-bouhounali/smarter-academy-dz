import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { REMARKS, SITUATION, analysisText } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Une synthèse n'introduit aucune notion nouvelle (LESSON_CONTRACT) : ce sont la DÉMARCHE du manuel (قراءة → تحليل واختيار
 * استراتيجية → تنفيذ) appliquée à la وضعية « أعمدة الإنارة حول الحيّز الدائري ».
 *   tawzi-dawaran   module 7 — n poteaux également espacés = sommets d'un polygone régulier, chacun image du précédent par
 *                   le دوران (O, 360°/n) — le دوران garde les écarts
 *   masafa-amudayn  module 7 — n = 6 : triangles équilatéraux, d = r = 3 m
 *   qanun-masafa    module 7 — le triangle rectangle de la hauteur : d = 2r·sin(180°/n)
 *   tariqat-wadiya  module 7 — la démarche en trois phases (les mots du manuel)
 * Les réponses de « وضعية الاختبار النهائي » (le rond-point d'Oran) ne sont dans aucun item.
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    7: [
      { id: 'tawzi-dawaran', type: 'methodes', title: 'توزيع أعمدة بانتظام بالدوران', summary: 'n عمودا متباعدة بنفس المسافة على دائرة هي رؤوس مضلع منتظم مركزه مركز الدائرة: كل عمود صورة الذي قبله بالدوران الذي مركزه المركز وزاويته 360 درجة على n.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.muntazam}</MathText></li>
            <li><MathText>{REMARKS.zawiya}</MathText></li>
            <li><MathText>{REMARKS.dawaran}</MathText></li>
            <li><MathText>{REMARKS.tasawi}</MathText></li>
          </ul>
        ) },
      { id: 'masafa-amudayn', type: 'regles', title: 'السداسي: المسافة تساوي نصف القطر', summary: 'في السداسي المنتظم، المثلث الذي رأساه عمودان متتاليان ورأسه الثالث المركز متقايس الأضلاع، فالمسافة بين عمودين متتاليين تساوي نصف القطر.',
        body: <p><MathText>{REMARKS.mutaqayis}</MathText></p> },
      { id: 'qanun-masafa', type: 'regles', title: 'المسافة في المثلث القائم', summary: 'الارتفاع النازل من المركز ينصّف الزاوية المركزية والوتر: في المثلث القائم جيب نصف الزاوية يساوي نصف المسافة على نصف القطر، ومنه المسافة بين عمودين متتاليين.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.jaib}</MathText></li>
            <li><MathText>{REMARKS.qanun}</MathText></li>
          </ul>
        ) },
      { id: 'tariqat-wadiya', type: 'methodes', title: 'طريقة: من النص إلى المخطط', summary: 'نقرأ الوضعية (الشكل، العدد، نصف القطر)، نحلّلها (مضلع منتظم، زاوية الدوران، المسافة في المثلث القائم)، ثم ننفّذ المخطط بمقياس مناسب ونتحقّق.',
        body: (
          <ol className="list-decimal ms-5 space-y-1">
            {SITUATION.analysis.map((a) => <li key={a.label}><strong>{a.label}</strong>: <MathText>{analysisText(a)}</MathText></li>)}
            <li><MathText>{REMARKS.sullam}</MathText></li>
          </ol>
        ) },
    ],
  },
};
