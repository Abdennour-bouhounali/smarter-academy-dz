import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { REMARKS, SITUATION, analysisText } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Une synthèse n'introduit aucune notion nouvelle (LESSON_CONTRACT) : ce sont la DÉMARCHE du manuel
 * (قراءة → تحليل واختيار استراتيجية → تنفيذ) appliquée à la وضعية « مقام الشهيد », et l'outil que « أتعمّق » mobilise.
 *   talis-khatt-nazar   module 1 — Thalès dans la ligne de visée : deux verticales, un sommet commun A
 *   zawiya-bi-zill      module 1 — l'angle x par la tangente dans le petit triangle, la touche inverse, l'arrondi
 *   mulaamat-natija     module 1 — vérifier (même x dans le grand triangle, 92 m réels) et arrondir en fin de calcul
 *   tariqat-wadiya      module 1 — la démarche en trois phases (les mots du manuel)
 *   muthallath-fada     module 3 — un triangle rectangle DANS un solide : Pythagore deux fois, puis le rapport
 * Les réponses de « إختبار أولي » (la minaret de جامع الجزائر, le conteneur) ne sont dans aucun item.
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      { id: 'talis-khatt-nazar', type: 'methodes', title: 'خاصية طالس في خط النظر', summary: 'عمود ومعلم شاقوليان وقمّتاهما على خط نظر واحد: المثلثان اللذان رأسهما موضع الملاحظ في وضعية طالس، والضلع الكبير هو المسافة الكلية من الملاحظ إلى قاعدة المعلم.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.nazar}</MathText></li>
            <li><MathText>{REMARKS.AM}</MathText></li>
            <li><MathText>{REMARKS.talisEq}</MathText></li>
          </ul>
        ) },
      { id: 'zawiya-bi-zill', type: 'methodes', title: 'قيس زاوية النظر بالظل', summary: 'في المثلث القائم الصغير: الضلع المقابل لزاوية النظر هو العمود والمجاور لها هو المسافة إلى العمود، فنكتب الظل ثم نستعمل اللمسة العكسية للظل وندوّر إلى الدرجة.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.tanX}</MathText></li>
            <li><MathText>{REMARKS.xCalc}</MathText></li>
          </ul>
        ) },
      { id: 'mulaamat-natija', type: 'regles', title: 'التحقّق والتدوير في آخر الحساب', summary: 'نتحقّق أنّ الزاوية نفسها تظهر في المثلث الكبير وأنّ الارتفاع ملائم للواقع، ولا ندوّر إلا النتيجة النهائية.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.check}</MathText></li>
            <li><MathText>{REMARKS.tadwirMubakkir}</MathText></li>
            <li><MathText>{REMARKS.real}</MathText></li>
          </ul>
        ) },
      { id: 'tariqat-wadiya', type: 'methodes', title: 'طريقة: من النص إلى الجواب', summary: 'نقرأ الوضعية ونحدّد المطلوب، نختار المعرفة المناسبة للمعطيات (طالس، النسب المثلثية، فيثاغورس)، ثم نكتب المساواة ونحسب وندوّر ونتحقّق.',
        body: (
          <ol className="list-decimal ms-5 space-y-1">
            {SITUATION.analysis.map((a) => <li key={a.label}><strong>{a.label}</strong>: {analysisText(a)}</li>)}
          </ol>
        ) },
    ],
    3: [
      { id: 'muthallath-fada', type: 'methodes', title: 'مثلث قائم داخل مجسّم', summary: 'نبحث في المجسّم عن مثلث قائم يضمّ الطول المطلوب، نحسب بخاصية فيثاغورس مرتين إن لزم، ونحتفظ بالقيم المضبوطة حتى النسبة المثلثية الأخيرة.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.fada}</MathText></li>
            <li><MathText>{REMARKS.fadaPyth}</MathText></li>
            <li><MathText>{REMARKS.haram}</MathText></li>
          </ul>
        ) },
    ],
  },
};
