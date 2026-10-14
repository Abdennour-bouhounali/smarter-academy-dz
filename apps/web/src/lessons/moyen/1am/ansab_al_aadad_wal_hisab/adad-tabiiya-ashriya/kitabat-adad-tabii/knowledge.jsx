import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, RANKS, DECOMPOSITION, METHOD, BIG, GUIDE } from './content/textbook';

// La carte progressive de la leçon — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « كتابة الأعداد الطبيعية ودلالة الأرقام » (1AM) — SOURCE UNIQUE (content/textbook.js : معارف 1
 * p. 11, معارف 4 (a) p. 13, l'échange dix pour un découvert au labo, le مفكوك d'un entier et « رقم / عدد » déclarés).
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'tabadul', type: 'concepts', title: 'عشرة بواحدة',
        predictPrompt: 'في الورشة ربطت أقلامًا وحزمًا وعلبًا، ثم لم تستطع كتابة العدد إلّا بعد أن انتهيت. ما القاعدة التي تربط مرتبة بالمرتبة التي على يسارها؟ ومتى نستطيع أن نكتب رقمًا في عمود؟ اكتبها بكلماتك.',
        summary: 'كل 10 وحدات من مرتبة تساوي وحدة واحدة من المرتبة التي على يسارها. لذلك لا تحمل أيّ مرتبة أكثر من 9: رقمها هو ما يبقى فيها بعد الربط.',
        body: (
          <div className="space-y-2">
            <p><MathText>{'10 آحاد = عشرة ، 10 عشرات = مئة ، 10 مئات = ألف ، 10 آلاف = عشرة آلاف …'}</MathText></p>
            <p className="text-sm text-slate-600">{GUIDE.concat.right}</p>
          </div>
        ),
      },
      {
        id: 'qima-mawdi', type: 'concepts', title: 'قيمة الرقم حسب موقعه', predict: false,
        summary: 'يأخذ كل رقم معناه تبعًا لموقعه: في 25 الرقم 2 يمثّل عشرتين (20)، وفي 52 يمثّل وحدتين (2).',
        body: (
          <div className="space-y-2">
            <p>{RANKS.box}</p>
            <p className="text-sm text-slate-600"><MathText>{'$25 = 2 \\times 10 + 5$ ، $52 = 5 \\times 10 + 2$'}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'fiaat', type: 'regles', title: 'القراءة فئةً فئةً',
        predictPrompt: 'كيف تقرأ 4908732 دون أن تخطئ؟ أين تترك فراغًا، ومن أيّ جهة تبدأ؟ وكيف تقرأ كل جزء؟ اكتب القاعدة بكلماتك.',
        summary: 'لقراءة عدد طبيعي كبير وكتابته نجزّئه إلى فئات من ثلاثة أرقام مبتدئين من اليمين (فئة الوحدات، فئة الآلاف، فئة الملايين، …)، ونقرأ كل فئة ثم اسمها.',
        body: (
          <div className="space-y-2">
            <p>{KNOWLEDGE.reading}</p>
            {KNOWLEDGE.readingExamples.map((e) => (
              <p key={e.raw} className="text-sm text-slate-600"><MathText>{`$${e.raw} = ${e.spaced}$ : ${e.words}`}</MathText></p>
            ))}
          </div>
        ),
      },
      {
        id: 'jadwal-maratib', type: 'concepts', title: 'جدول المراتب', predict: false,
        summary: 'في جدول المراتب نقرأ رقم كل مرتبة: الآحاد، العشرات، المئات، الآلاف، … وبعد الفاصلة الأعشار (الأجزاء من عشرة)، الأجزاء من مائة، الأجزاء من ألف.',
        body: (
          <div className="space-y-2">
            <p>{RANKS.box}</p>
            <p className="text-sm text-slate-600"><MathText>{`$${RANKS.number}$ : ${RANKS.roles}`}</MathText></p>
          </div>
        ),
      },
      {
        id: 'mafkuk', type: 'regles', title: 'المفكوك النموذجي لعدد طبيعي',
        predictPrompt: 'في جدول المراتب، 6 في مرتبة الآلاف و 3 في مرتبة المئات و 9 في العشرات و 2 في الآحاد. اكتب 6392 مجموعًا يُظهر قيمة كل رقم.',
        summary: 'كل عدد طبيعي هو مجموع جداءات أرقامه في قيم مراتبها: $6\\,392 = 6 \\times 1000 + 3 \\times 100 + 9 \\times 10 + 2$ — المفكوك النموذجي.',
        body: (
          <div className="space-y-2">
            <p>{DECOMPOSITION.text}</p>
            <p><MathText>{DECOMPOSITION.example}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{DECOMPOSITION.zero}</MathText></p>
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'raqm-adad', type: 'methodes', title: 'رقم المرتبة وعدد وحداتها',
        predictPrompt: 'في الدكّان عوّضت 1345 دج بأوراق من 100 دج فأخذت 13 ورقة، مع أنّ رقم المئات في 1345 هو 3. كيف نقرأ عدد المئات مباشرة من كتابة العدد؟ اكتب الطريقة.',
        summary: 'رقم المرتبة هو الرقم المكتوب في موقعها؛ عدد وحداتها هو العدد الذي نقرؤه بعد حذف الأرقام التي على يمينها: في 2017 رقم العشرات 1 وعدد العشرات 201.',
        body: (
          <div className="space-y-2">
            <p>{METHOD.box}</p>
            <p className="text-sm text-slate-600"><MathText>{'$1345 = 13 \\times 100 + 45$ ، $2017 = 201 \\times 10 + 7$'}</MathText></p>
          </div>
        ),
      },
    ],
    5: [
      {
        id: 'malyun-milyar', type: 'concepts', title: 'المليون والمليار', predict: false,
        summary: 'المليون يساوي ألف ألف: $1\\,000\\,000$ ؛ المليار يساوي ألف مليون: $1\\,000\\,000\\,000$.',
        body: (
          <div className="space-y-2">
            {BIG.facts.map((f) => <p key={f}>{f}</p>)}
            <p className="text-sm text-slate-600"><MathText>{'$1\\,000\\,000$ (مليون) ، $1\\,000\\,000\\,000$ (مليار)'}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
