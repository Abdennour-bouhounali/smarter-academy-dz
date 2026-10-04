import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { REMARKS, TRIANGLE, PERP, QUAD, CIRCLE, METHOD_PROOF, METHOD_UNKNOWN } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Ce que le درس 4 établit. Le manuel n'a pas de معارف pour cette leçon : ses طرائق (p. 145) sont citées telles quelles ;
 * le reste est une formalisation DÉCLARÉE de la plateforme (`knowledge_formalization`, content/textbook.js), posée au
 * moment où les modules la font vivre.
 *   dalil-hisabi       module 1 — la figure ne prouve pas : une égalité calculée depuis les coordonnées
 *   qaim-fithaghuras   module 1 — l'angle droit en A : AB² + AC² = BC², le côté SEUL est l'opposé de A
 *   mutasawi-saqayn    module 1 — isocèle de sommet C : CA² = CB² ; équilatéral : les trois
 *   adilla-kafiya      module 1 — des preuves suffisantes : parallélogramme seul ≠ rectangle ; diagonales égales seules non plus
 *   tabiat-muthallath  module 2 — la méthode pour un triangle (trois carrés, comparer)
 *   taamud             module 2 — la perpendicularité sans produit scalaire (Pythagore réciproque, isocèle + médiane)
 *   tabiat-rubai       module 2 — l'échelle des quadrilatères (parallélogramme → rectangle / losange → carré)
 *   intima-daira       module 2 — un point d'un cercle : distance au centre = rayon ; le cercle de diamètre [AB]
 *   tariqat-burhan     module 3 — la طريقة « إنجاز برهان » p. 145
 *   tariqat-majhul     module 3 — la طريقة « حساب مسافات » p. 145 : une coordonnée inconnue, le y² qui s'en va
 * Les réponses du « إختبار أولي » (KLM, EFG, la ساحة de Wahran, PQRS, Ω, R) ne sont dans aucun item.
 */
const Lines = ({ lines }) => (
  <ul className="list-disc ms-5 space-y-1">{lines.map((l) => <li key={l}><MathText>{l}</MathText></li>)}</ul>
);

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      { id: 'dalil-hisabi', type: 'regles', title: 'الشكل لا يبرهن', summary: 'ما نراه على المرصوفة يوحي ولا يثبت: نثبت طبيعة شكل بمساواة محسوبة من إحداثيات رؤوسه.',
        body: <Lines lines={[REMARKS.look]} /> },
      { id: 'qaim-fithaghuras', type: 'regles', title: 'زاوية قائمة بعكس فيثاغورس', summary: 'المثلث ABC قائم في A إذا كان مجموع مربعي الطولين AB و AC يساوي مربع BC، الضلع المقابل لـ A وهو أطول الأضلاع.',
        body: <Lines lines={[REMARKS.watarRight]} /> },
      { id: 'mutasawi-saqayn', type: 'regles', title: 'متساوي الساقين بمربعين', summary: 'المثلث ABC متساوي الساقين رأسه C إذا تساوى مربعا الطولين CA و CB، ومتقايس الأضلاع إذا تساوت المربعات الثلاثة.',
        body: <Lines lines={[TRIANGLE.lines[1]]} /> },
      { id: 'adilla-kafiya', type: 'regles', title: 'أدلة كافية', summary: 'لا تُقبل نتيجة إلا بأدلة كافية: تساوي شعاعين يثبت متوازي أضلاع فقط، والقطران المتقايسان وحدهما لا يثبتان مستطيلا.',
        body: <Lines lines={[REMARKS.kafiRight, REMARKS.diagAlone]} /> },
    ],
    2: [
      { id: 'tabiat-muthallath', type: 'methodes', title: TRIANGLE.title, summary: 'نحسب مربعات الأطوال الثلاثة من الإحداثيات ونقارنها: مربعان متساويان لمتساوي الساقين، وثلاثة لمتقايس الأضلاع، ومجموع الأصغرين يساوي الأكبر لزاوية قائمة مقابلة لأطول ضلع.',
        body: <Lines lines={TRIANGLE.lines} /> },
      { id: 'taamud', type: 'regles', title: PERP.title, summary: 'دون جداء سلمي: نثبت تعامد مستقيمين بمثلث قائم (الخاصية العكسية لخاصية فيثاغورس) أو بمتوسط مثلث متساوي الساقين.',
        body: <Lines lines={PERP.lines} /> },
      { id: 'tabiat-rubai', type: 'methodes', title: QUAD.title, summary: 'نثبت أولا أن الرباعي متوازي أضلاع (شعاعان متساويان أو قطران متناصفان)، ثم مستطيل بقطرين متقايسين، ومعيّن بضلعين متتاليين متقايسين، ومربّع بالاثنين معا.',
        body: <><Lines lines={QUAD.lines} /><p className="mt-1 text-sm"><MathText>{QUAD.warning}</MathText></p></> },
      { id: 'intima-daira', type: 'regles', title: CIRCLE.title, summary: 'تنتمي نقطة إلى دائرة إذا كان بعدها عن المركز يساوي نصف القطر؛ ومركز الدائرة التي قطرها قطعة هو منتصف هذه القطعة.',
        body: <><Lines lines={CIRCLE.lines} /><p className="mt-1 text-sm"><MathText>{CIRCLE.trap}</MathText></p></> },
    ],
    3: [
      { id: 'tariqat-burhan', type: 'methodes', title: `طريقة الكتاب: ${METHOD_PROOF.title}`, summary: 'نحسب مركبتي كل شعاع ثم الأطوال، ونطبّق الخاصية العكسية لخاصية فيثاغورس على أطول ضلع، ونقارن الطولين لمتساوي الساقين.',
        body: <Lines lines={[METHOD_PROOF.solution[1], METHOD_PROOF.solution[6], METHOD_PROOF.solution[7]]} /> },
      { id: 'tariqat-majhul', type: 'methodes', title: `طريقة الكتاب: ${METHOD_UNKNOWN.title}`, summary: 'لتعيين إحداثية مجهولة نكتب شرط الزاوية القائمة بمربعات المسافات بدلالة المجهول؛ يحذف مربع المجهول من الطرفين فتبقى معادلة من الدرجة الأولى.',
        body: <Lines lines={[METHOD_UNKNOWN.solution[0], METHOD_UNKNOWN.expand]} /> },
    ],
  },
};
