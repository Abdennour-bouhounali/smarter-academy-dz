import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD, GUIDE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « التناسبية والتمثيل البياني » (3AM) — SOURCE UNIQUE, construite à partir du contenu (content/textbook.js : معارف 1 p. 90 et طرائق p. 91,
 * réécrits). Les liens « راجع » (tableau de proportionnalité 2AM, coordonnées 2AM) sont des prérequis (`priorKnowledge`), mesurés par « أستعدّ », jamais des items ici.
 */
const { definition, property1, property2, refuse, coefficient } = KNOWLEDGE;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'nuqta-jadwal', type: 'regles', title: 'عمود الجدول نقطة',
        predictPrompt: 'رفعتَ دبّوسًا على سكّته إلى ثمن عموده فصار نقطة في المعلم. كيف تكتب إحداثيي هذه النقطة من العمود؟ اكتب ما تضعه أولًا وما تضعه ثانيًا.',
        summary: 'عمود الجدول نقطة: العدد الأول فاصلتها والثاني ترتيبها.',
        body: <p><MathText>{GUIDE.onePin}</MathText></p>,
      },
      {
        id: 'khassiya-tanasub', type: 'regles', title: 'نقط التناسبية مع O',
        predictPrompt: 'في المحلّ الأول مسّت مسطرة واحدة النقط كلّها. أين تقع نقط وضعية تناسبية بالنسبة إلى النقطة $O$ ؟ اكتب ما لاحظتَه.',
        summary: 'نقط وضعية تناسبية على مستقيم واحد يمرّ بـ O.',
        body: <p><MathText>{property1.text}</MathText></p>,
      },
      {
        id: 'ghayr-tanasubi', type: 'regles', title: 'ما ليس تناسبيًا',
        predictPrompt: 'في المحلّين الثاني والثالث لم تُصبح الوضعية تناسبية. اكتب حالتين تمنعان نقط تمثيل من أن تُمثّل وضعية تناسبية.',
        summary: 'نقط ليست على استقامة، أو مستقيم لا يمرّ بالمبدأ: ليست وضعية تناسبية.',
        body: <p><MathText>{refuse.text}</MathText></p>,
      },
      {
        id: 'muamil-qiraa', type: 'regles', title: 'ترتيب الفاصلة 1',
        predictPrompt: 'قرأتَ على مستقيم التناسبية ترتيب النقطة التي فاصلتها $1$ . ماذا يمثّل هذا العدد في الوضعية؟ اكتب ما تظنّه.',
        summary: 'ترتيب النقطة التي فاصلتها 1 هو معامل التناسبية.',
        body: <p><MathText>{GUIDE.onO}</MathText></p>,
      },
    ],
    2: [
      {
        id: 'ihdathiyat', type: 'vocabulaire', title: 'الفاصلة والترتيب', predict: false,
        summary: 'إحداثيا نقطة: الفاصلة (المحور الأفقي) ثم الترتيب (المحور العمودي).',
        body: <p><MathText>{definition.text}</MathText></p>,
      },
      {
        id: 'tamthil-tanasub', type: 'regles', title: 'التمثيل البياني لوضعية تناسبية',
        predictPrompt: 'اكتب بكلماتك متى تُمثّل نقطٌ في معلم وضعية تناسبية، وحالتين لا تُمثّل فيهما ذلك.',
        summary: 'نقط على استقامة واحدة مع O ⇔ وضعية تناسبية.',
        body: (
          <div className="space-y-2">
            <p><MathText>{property1.text}</MathText></p>
            <p><MathText>{property2.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{refuse.text}</MathText></p>
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'y-ax', type: 'methodes', title: 'العلاقة y = ax',
        predictPrompt: 'نقطة $M(x\\ ;\\ y)$ من مستقيم يمرّ بـ $O$ وبالنقطة $(1\\ ;\\ a)$ . اكتب العلاقة بين $y$ و $x$ .',
        summary: 'النقطة (x ; y) من مستقيم التناسبية تحقّق y = a × x ، و a ترتيب الفاصلة 1.',
        body: <p><MathText>{coefficient.text}</MathText></p>,
      },
      {
        id: 'qiraa-qima', type: 'methodes', title: 'قراءة قيمة مجهولة',
        predictPrompt: 'على بيان تناسبية يقرأ تلميذ ترتيب نقطة معلومة الفاصلة، وآخر فاصلة نقطة معلومة الترتيب. كيف تحسب كلّ قيمة من المعامل؟ اكتب الطريقتين.',
        summary: METHOD.read.rule,
        body: <p><MathText>{METHOD.read.rule}</MathText></p>,
      },
    ],
  },
};
