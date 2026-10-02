import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { ACTIVITY, ACTIVITY_LINES, KNOWLEDGE, METHOD_DRAW, METHOD_READ } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس 3 « التمثيل البياني لدالة خطية وقراءته بيانيًا » — SOURCE UNIQUE.
 * Une <KnowledgeBrick id="…"> dans un module et la carte rendent le même objet.
 *
 *   module 1 (نشاط 3)  tamthil-nashat — « نقول أنّ … » : la droite (OA) est le graphe de 0,5x ;
 *   module 2 (معارف)   tamthil-mustaqim (la propriété), munha-mustaqim (la ملاحظة sur le signe de a),
 *                      rasm-tamthil (طرائق : O et une seconde point), qiraa-bayaniya (طرائق : lire une
 *                      image, un nombre dont l'image est connue).
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'tamthil-nashat', type: 'concepts', title: 'المستقيم (OA)',
        summary: 'النقط O و A و B على استقامة واحدة: التمثيل البياني للدالة الخطية التي تضرب كل عدد في 0,5 هو المستقيم (OA)، وكل نقطة منه ترتيبها صورة فاصلتها.',
        body: (
          <div className="space-y-2">
            <p><MathText>{ACTIVITY.closing}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{ACTIVITY_LINES.m}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'tamthil-mustaqim', type: 'concepts', title: 'التمثيل البياني لدالة خطية',
        summary: 'في معلم، التمثيل البياني لدالة خطية معاملها a مستقيم يشمل المبدأ O؛ نقول إنّ معادلته هي «y يساوي a في x» وإنّ a معامل توجيهه.',
        body: <p><MathText>{KNOWLEDGE.property}</MathText></p>,
      },
      {
        id: 'munha-mustaqim', type: 'regles', title: 'منحى المستقيم وإشارة a',
        summary: 'يعيّن المعامل a منحى المستقيم: إذا كان موجبا فالمستقيم يصعد من اليسار إلى اليمين، وإذا كان سالبا فهو ينزل.',
        body: <p><MathText>{KNOWLEDGE.note}</MathText></p>,
      },
      {
        id: 'rasm-tamthil', type: 'methodes', title: 'نرسم التمثيل البياني',
        summary: 'التمثيل يشمل المبدأ، فلرسمه تكفي نقطة ثانية: نختار فاصلة، مثلا 1، ونحسب صورتها، ثم نرسم المستقيم الذي يشمل المبدأ وهذه النقطة.',
        body: (
          <div className="space-y-2">
            <p><MathText>{METHOD_DRAW.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{METHOD_DRAW.solution[1]}</MathText></p>
          </div>
        ),
      },
      {
        id: 'qiraa-bayaniya', type: 'methodes', title: 'نقرأ على التمثيل البياني',
        summary: 'لتعيين صورة عدد نقرأ ترتيب النقطة التي فاصلتها هذا العدد، ولتعيين عدد صورته معلومة نقرأ فاصلة النقطة التي ترتيبها هذه الصورة.',
        body: (
          <div className="space-y-2">
            {METHOD_READ.rule.map((r) => <p key={r}><MathText>{r}</MathText></p>)}
          </div>
        ),
      },
    ],
  },
};
