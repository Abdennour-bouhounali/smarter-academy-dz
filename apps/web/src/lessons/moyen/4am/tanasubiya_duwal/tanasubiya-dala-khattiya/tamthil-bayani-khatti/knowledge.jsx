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
        predictPrompt: 'وضعت $A(1 ; 0{,}5)$ و $B(4 ; 2)$ ثم $C$ ذات الفاصلة $-2$ ، ورأيت المعلم يرفض كل نقطة لا تحقّق الحساب. بكلماتك: ما هو التمثيل البياني للدالة $f : x \\longmapsto 0{,}5x$؟ وماذا يربط ترتيب كل نقطة منه بفاصلتها؟',
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
        predictPrompt: 'في النشاط 3 كان تمثيل $x \\longmapsto 0{,}5x$ المستقيم (OA)، وكل نقطة $M(x ; y)$ منه تحقّق $y = 0{,}5x$. لو أخذنا دالة خطية أخرى معاملها $a$ : ما شكل تمثيلها البياني، وبأيّ نقطة يمرّ دائمًا؟ وما العلاقة بين $x$ و $y$ لكل نقطة منه؟',
        summary: 'في معلم، التمثيل البياني لدالة خطية معاملها a مستقيم يشمل المبدأ O؛ نقول إنّ معادلته هي «y يساوي a في x» وإنّ a معامل توجيهه.',
        body: <p><MathText>{KNOWLEDGE.property}</MathText></p>,
      },
      {
        id: 'munha-mustaqim', type: 'regles', title: 'منحى المستقيم وإشارة a',
        predictPrompt: 'على الزالق ثبّتّ مستقيمات تشمل O: بعضها يصعد من اليسار إلى اليمين وبعضها ينزل. اكتب القاعدة بكلماتك: ما الذي يعيّن منحى المستقيم الذي يمثّل دالة خطية؟ ومتى يصعد ومتى ينزل؟',
        summary: 'يعيّن المعامل a منحى المستقيم: إذا كان موجبا فالمستقيم يصعد من اليسار إلى اليمين، وإذا كان سالبا فهو ينزل.',
        body: <p><MathText>{KNOWLEDGE.note}</MathText></p>,
      },
      {
        id: 'rasm-tamthil', type: 'methodes', title: 'نرسم التمثيل البياني',
        predictPrompt: 'في النشاط 3 رُسم المستقيم كلّه بمجرّد أن وضعت النقطة A بعد O. لو طُلب منك رسم تمثيل الدالة $x \\longmapsto 1{,}5x$ في معلم: كم نقطة تحتاج، وكيف تحصل على إحداثييها؟ اكتب الطريقة بخطوات.',
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
        predictPrompt: 'حرّكت المسبار تحت محور الفواصل إلى 4، ثم المسبار على يسار محور التراتيب إلى 3,5، وتبعت الخط المتقطّع. لو أعطيناك مستقيمًا آخر: بأيّ خطوات تقرأ صورة عدد؟ وبأيّ خطوات تقرأ العدد الذي صورته معلومة؟',
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
