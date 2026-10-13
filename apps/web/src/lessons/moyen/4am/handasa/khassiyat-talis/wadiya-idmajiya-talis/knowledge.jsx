import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { REMARKS, SITUATION, analysisText } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Une synthèse n'introduit aucune notion nouvelle (LESSON_CONTRACT) : ce sont la DÉMARCHE du manuel
 * (قراءة → تحليل واختيار استراتيجية → تنفيذ) appliquée au تحدّ et à la وضعية, et la méthode du test final.
 *   tariqat-zill         module 7 — la hauteur de la minaret par l'ombre d'un bâton (le تحدّ)
 *   maqta-mihwari-talis  module 7 — du solide à la coupe axiale : deux triangles de sommet O en situation de Thalès
 *   muadala-bud          module 7 — la condition h = r transforme l'égalité de Thalès en équation du premier degré
 *   mulaamat-natija      module 7 — le volume (exact puis approché) et la vérification que les dimensions sont possibles
 *   tariqat-wadiya       module 7 — la démarche en trois phases (les mots du manuel)
 * Les réponses de « وضعية الاختبار النهائي » (un autre cornet, une autre minaret) ne sont dans aucun item.
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    7: [
      { id: 'tariqat-zill', type: 'methodes', title: 'طريقة الظل: ارتفاع لا نصل إليه', summary: 'نغرس عصا شاقولية حيث ينتهي ظلّها مع ظلّ المئذنة؛ المثلثان في وضعية طالس، فارتفاع المئذنة يساوي طول العصا مضروبا في نسبة الظلّين.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.zillMethod}</MathText></li>
            <li><MathText>{REMARKS.zillWhy}</MathText></li>
            <li><MathText>{'$\\dfrac{AM}{BE} = \\dfrac{OA}{OB}$'}</MathText></li>
          </ul>
        ) },
      { id: 'maqta-mihwari-talis', type: 'methodes', title: 'من المجسّم إلى المقطع المحوري', summary: 'نقطع المخروط والأسطوانة بالمستوي الذي يشمل محورهما: يظهر مثلث فيه مستطيل، وحافة الأسطوانة على المولّد؛ المثلثان اللذان رأسهما O في وضعية طالس.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.maqta}</MathText></li>
            <li><MathText>{REMARKS.tawazi}</MathText></li>
            <li><MathText>{REMARKS.talisSection}</MathText></li>
          </ul>
        ) },
      { id: 'muadala-bud', type: 'methodes', title: 'شرط إضافي يعطي معادلة', summary: 'نعوّض الشرط الإضافي (الارتفاع يساوي نصف القطر) في المساواة التي تعطيها خاصية طالس، فنحصل على معادلة من الدرجة الأولى في r نحلّها.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.muadala}</MathText></li>
            <li><MathText>{REMARKS.halR}</MathText></li>
          </ul>
        ) },
      { id: 'mulaamat-natija', type: 'regles', title: 'الحجم وملاءمة النتيجة', summary: 'نحسب الحجم بقيمته المضبوطة ثم المقرّبة، ونتحقّق أنّ الأبعاد ممكنة: نصف قطر الأسطوانة أصغر من نصف قطر المخروط، وطولها أصغر من ارتفاعه.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.hajm}</MathText></li>
            <li><MathText>{REMARKS.mulaama}</MathText></li>
          </ul>
        ) },
      { id: 'tariqat-wadiya', type: 'methodes', title: 'طريقة: من النص إلى الجواب', summary: 'نقرأ الوضعية ونحدّد المطلوب، نختار الشكل المستوي والخاصية المناسبة، ثم ننفّذ ونتحقّق من ملاءمة النتيجة للواقع.',
        body: (
          <ol className="list-decimal ms-5 space-y-1">
            {SITUATION.analysis.map((a) => <li key={a.label}><strong>{a.label}</strong>: {analysisText(a)}</li>)}
          </ol>
        ) },
    ],
  },
};
