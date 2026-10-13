import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { REMARKS, SITUATION } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Une synthèse n'introduit aucune notion nouvelle (LESSON_CONTRACT) : ce sont les RESSOURCES des cinq
 * دروس, telles que la situation les mobilise, et la démarche en trois phases.
 *   jumla-bayaniya     module 7 — deux inconnues, deux informations : les droites et leur point commun (درس 4)
 *   taklifa-taalufiya  module 7 — un prix fixe + un prix par unité est une fonction affine ; image, antécédent (درس 1)
 *   min-thunaiyatayn   module 7 — un tarif connu par deux devis : تناسب التغيّرات puis b (درس 3)
 *   ikhtiyar-sigha     module 7 — comparer deux tarifs : l'intersection, le moins cher avant / après (درس 2 et 5)
 *   thalath-sigh       module 7 — trois tarifs : la droite la plus basse, trois plages (درس 5, laboratoire)
 *   tafsir-natija      module 7 — interpréter : nombre entier, en dinars, sans dépasser la somme
 *   tariqat-wadiya     module 7 — la démarche : قراءة · تحليل · تنفيذ
 * Les nombres sont ceux de la situation du module 7 ; ceux de « إختبار أولي » (la sortie aux Sablettes)
 * n'apparaissent dans aucun item.
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    7: [
      { id: 'jumla-bayaniya', type: 'methodes', title: 'عددان مجهولان: مستقيمان ونقطة تقاطعهما', summary: 'نكتب كل معادلة من الجملة على شكل دالة تآلفية ونمثّلها بمستقيم، وحلّ الجملة إحداثيتا نقطة تقاطع المستقيمين: الفاصلة أولا ثم الترتيب.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.eqY}</MathText></li>
            <li><MathText>{REMARKS.jumla}</MathText></li>
          </ul>
        ) },
      { id: 'taklifa-taalufiya', type: 'regles', title: 'مبلغ ثابت ومبلغ عن كل وحدة: دالة تآلفية', summary: 'ثمن يتكوّن من مبلغ ثابت يضاف إليه مبلغ عن كل وحدة دالة تآلفية: معاملها ثمن الوحدة وترتيبها عند المبدأ المبلغ الثابت.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.amal}</MathText></li>
            <li><MathText>{REMARKS.amalMax}</MathText></li>
          </ul>
        ) },
      { id: 'min-thunaiyatayn', type: 'methodes', title: 'ثمن معلوم بعرضين: عددان وصورتاهما', summary: 'المعامل هو فرق الصورتين مقسوما على فرق العددين، ثم نجد الترتيب عند المبدأ بتعويض أحد العددين وصورته.',
        body: <p><MathText>{REMARKS.nawras}</MathText></p> },
      { id: 'ikhtiyar-sigha', type: 'methodes', title: 'المقارنة بين صيغتين', summary: 'نساوي بين التكلفتين أو نقرأ نقطة تقاطع المستقيمين: قبلها صيغة هي الأرخص وبعدها الصيغة الأخرى، ونختار بحسب قيمة المتغيّر.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.cross}</MathText></li>
            <li><MathText>{REMARKS.choice}</MathText></li>
          </ul>
        ) },
      { id: 'thalath-sigh', type: 'methodes', title: 'ثلاث صيغ: المستقيم الأدنى', summary: 'مع ثلاث صيغ، الأرخص عند كل عدد من الساعات هي صيغة المستقيم الأدنى، وتتغيّر الصيغة الأرخص عند نقط التقاطع.',
        body: <p><MathText>{REMARKS.kayakRanges}</MathText></p> },
      { id: 'tafsir-natija', type: 'regles', title: 'تفسير النتيجة في سياقها', summary: 'نكتب الجواب بوحدته وفي سياق الوضعية: عدد طبيعي من التلاميذ أو الساعات، ولا نتجاوز المبلغ المتاح.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.tafsir}</MathText></li>
            <li><MathText>{REMARKS.rest}</MathText></li>
          </ul>
        ) },
      { id: 'tariqat-wadiya', type: 'methodes', title: 'طريقة: من النص إلى الجواب', summary: 'نقرأ الوضعية ونحدّد المهام والمتغيّرات، نربط كل جزء بالدرس الذي يحلّه ونختار استراتيجية جبرية أو بيانية، ثم ننفّذ ونفسّر النتيجة.',
        body: (
          <ol className="list-decimal ms-5 space-y-1">
            {SITUATION.analysis.map((a) => <li key={a.label}><strong>{a.label}</strong>: <MathText>{a.text}</MathText></li>)}
          </ol>
        ) },
    ],
  },
};
