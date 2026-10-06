import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { IDEAS, METHOD, METHOD_BOX, CHOICE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس 2 « حل جملة معادلتين من الدرجة الأولى بمجهولين جبرياً » — SOURCE
 * UNIQUE. Une <KnowledgeBrick id="…"> dans un module et la carte rendent le même objet.
 *
 *   module 1 (نشاط 2)  takhallus-majhul — les deux élèves font disparaître une inconnue ;
 *                      hall-thunaiya — on revient chercher l'autre : la solution est une ثنائية ;
 *   module 2 (طرائق)   tariqat-tawid, tariqat-jam — l'encadré « طريقة » de la p. 59 ;
 *                      ikhtiyar-tariqa — choisir selon les coefficients (P3, phrase de la plateforme).
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'takhallus-majhul', type: 'concepts', title: 'نتخلّص من أحد المجهولين',
        predictPrompt: 'بالبطاقتين: مرّة صار كل $y$ في البطاقة (2) العبارة $(7 - 2x)$، ومرّة ضربت البطاقة (1) في 2 ثم وضعتها على الأخرى. ماذا حدث في المرّتين لعدد المجهولين في البطاقة؟ اكتب بكلماتك الفكرة المشتركة التي تحوّل جملة بمجهولين إلى معادلة تعرف حلّها.',
        summary: 'لحل جملة معادلتين بمجهولين نتخلّص من أحد المجهولين، فنحصل على معادلة من الدرجة الأولى بمجهول واحد نعرف كيف نحلّها.',
        body: <p><MathText>{IDEAS.takhallus}</MathText></p>,
      },
      {
        id: 'hall-thunaiya', type: 'memoriser', title: 'الحل ثنائية لا عدد واحد',
        predictPrompt: 'في جملة النشاط وجدت أوّلًا $x = 2{,}6$. هل يكفي هذا العدد جوابًا؟ اكتب بكلماتك: ماذا تفعل بعد إيجاد أحد المجهولين، وكيف تكتب حل الجملة، وكيف تتأكّد منه؟',
        summary: 'بعد إيجاد قيمة أحد المجهولين نعوّضها في إحدى المعادلتين لنجد الآخر؛ حل الجملة ثنائية نتحقّق منها في المعادلتين معًا.',
        body: <p><MathText>{IDEAS.thunaiya}</MathText></p>,
      },
    ],
    2: [
      {
        id: 'tariqat-tawid', type: 'methodes', title: 'طريقة التعويض',
        predictPrompt: 'في الجملة (1) انطلق الكتاب من $x - y = 2$ ووصل إلى معادلة بالمجهول $x$ وحده. لو أعطيناك جملة أخرى لتحلّها بالطريقة نفسها: بأيّ خطوة تبدأ؟ ومن أين تأخذ العبارة، وأين تضعها؟ اكتب الطريقة.',
        summary: 'نعبّر عن أحد المجهولين بدلالة الآخر من إحدى المعادلتين، ثم نعوّض ذلك المجهول بالعبارة الناتجة في المعادلة الأخرى.',
        body: (
          <div className="space-y-2">
            <p><MathText>{METHOD_BOX.items[0]}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{METHOD.one.solution[2]}</MathText></p>
          </div>
        ),
      },
      {
        id: 'tariqat-jam', type: 'methodes', title: 'طريقة الجمع',
        predictPrompt: 'في الجملة (2) جمع الكتاب المعادلتين مباشرة فاختفى $x$، وفي النشاط ضربت البطاقة (1) في 2 قبل أن تضعها على الأخرى. أمام جملة لا يختفي فيها أيّ مجهول بالجمع مباشرة: ماذا تفعل أوّلًا، وإلى ماذا تنظر في المعاملات؟ اكتب الطريقة.',
        summary: 'نضرب طرفي كل معادلة في معامل مناسب ليصير معاملا أحد المجهولين متعاكسين، ثم نجمع المعادلتين طرفًا لطرف فنحصل على معادلة بمجهول واحد.',
        body: (
          <div className="space-y-2">
            <p><MathText>{METHOD_BOX.items[1]}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{METHOD.two.solution[1]}</MathText></p>
          </div>
        ),
      },
      {
        id: 'ikhtiyar-tariqa', type: 'memoriser', title: 'اختيار الطريقة الأنسب',
        predictPrompt: 'حلّ الكتاب الجملة (1) بالتعويض والجملة (2) بالجمع. انظر إلى معاملات كل جملة: ما الذي جعل كل طريقة مناسبة لجملتها؟ اكتب بكلماتك متى تختار التعويض ومتى تختار الجمع.',
        summary: 'ننظر إلى المعاملات قبل أن نبدأ: معامل يساوي واحدًا أو سالب واحد يجعل التعويض سهلًا، ومعاملان متعاكسان أو يصيران كذلك بضرب بسيط يجعلان الجمع أسرع.',
        body: (
          <div className="space-y-2">
            <p><MathText>{CHOICE.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{`${CHOICE.sub} ${CHOICE.add}`}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
