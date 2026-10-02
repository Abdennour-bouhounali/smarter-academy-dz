import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { REMARKS, SITUATION } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Une synthèse n'introduit aucune notion nouvelle (LESSON_CONTRACT) : ce sont les RESSOURCES des cinq
 * دروس, telles que la situation les mobilise, et la démarche en trois phases.
 *   jumla-bayaniya     module 1 — deux inconnues, deux informations : les droites et leur point commun (درس 4)
 *   taklifa-taalufiya  module 1 — un prix fixe + un prix par unité est une fonction affine ; image, antécédent (درس 1)
 *   min-thunaiyatayn   module 1 — un tarif connu par deux devis : تناسب التغيّرات puis b (درس 3)
 *   ikhtiyar-sigha     module 1 — comparer deux tarifs : l'intersection, le moins cher avant / après (درس 2 et 5)
 *   thalath-sigh       module 1 — trois tarifs : la droite la plus basse, trois plages (درس 5, laboratoire)
 *   tafsir-natija      module 1 — interpréter : nombre entier, en dinars, sans dépasser la somme
 *   tariqat-wadiya     module 1 — la démarche : قراءة · تحليل · تنفيذ
 *   tawazi             module 3 — même a : droites parallèles, jamais égales
 *   tanaqus            module 3 — a < 0 : la fonction décroît ; quand s'annule-t-elle ?
 *   mutarajiha-ikhtiyar module 3 — « moins cher » est une inégalité, lue en nombre entier
 * Les nombres sont ceux de la situation du module 1 ; ceux de « إختبار أولي » (la sortie aux Sablettes)
 * n'apparaissent dans aucun item.
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
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
    3: [
      { id: 'tawazi', type: 'regles', title: 'نفس ثمن الوحدة: مستقيمان متوازيان', summary: 'صيغتان لهما ثمن الوحدة نفسه ومبلغان ثابتان مختلفان لا تتساويان أبدا: مستقيماهما متوازيان، والأرخص هي ذات المبلغ الثابت الأصغر دائما.',
        body: <p><MathText>{REMARKS.tawazi}</MathText></p> },
      { id: 'tanaqus', type: 'methodes', title: 'دالة تآلفية متناقصة', summary: 'إذا كان المعامل سالبا فالدالة تتناقص والمستقيم ينزل، ولمعرفة متى تنعدم نبحث عن العدد الذي صورته صفر.',
        body: <p><MathText>{REMARKS.tanaqus}</MathText></p> },
      { id: 'mutarajiha-ikhtiyar', type: 'methodes', title: '«أرخص» متراجحة', summary: 'نترجم «أرخص» بمتراجحة تامة ونحلّها، ثم نختار أصغر عدد طبيعي يحقّقها.',
        body: <p><MathText>{REMARKS.mutarajiha}</MathText></p> },
    ],
  },
};
