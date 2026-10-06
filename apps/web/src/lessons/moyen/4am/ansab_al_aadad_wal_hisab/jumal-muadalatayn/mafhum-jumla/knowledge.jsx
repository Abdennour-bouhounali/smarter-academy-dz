import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { ACTIVITY, ACTIVITY_LINES, KNOWLEDGE, CASES_LINES, CHECK_METHOD, EXAMPLE_LINES } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس 1 « مفهوم جملة معادلتين من الدرجة الأولى بمجهولين » — SOURCE UNIQUE.
 * Une <KnowledgeBrick id="…"> dans un module et la carte rendent le même objet.
 *
 *   module 1 (نشاط 1)  jumla-nashat — « نقول أنّ … » : la jumla des 32 agents et sa ثنائية (13 ; 19) ;
 *   module 2 (معارف)   jumla-tarif (معارف 1), hall-jumla (معارف 2), ikhtibar-thunaiya (ses deux
 *                      exemples), tartib-thunaiya (la ملاحظة), halat-khassa (حالات خاصة).
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'jumla-nashat', type: 'concepts', title: 'شرطان في آن واحد',
        predictPrompt: 'على لوحة العمّال أضاءت اللوحتان معًا مع $(13 ; 19)$ ، أمّا $(24 ; 8)$ فأضاءت اللوحة (1) وحدها. ماذا يميّز $(13 ; 19)$ عن $(24 ; 8)$ بالنسبة إلى المعادلتين $x + y = 32$ و $2x - y = 7$ ؟ اكتب بكلماتك متى تكون ثنائية هي الجواب الذي نبحث عنه لمعادلتين بمجهولين.',
        summary: 'عددا الرجال والنساء قبل التقاعد يحقّقان المعادلتين معًا؛ نقول إنّ المعادلتين تشكّلان جملة معادلتين من الدرجة الأولى بمجهولين، وإنّ ثنائية هذين العددين حل لهذه الجملة.',
        body: (
          <div className="space-y-2">
            <p><MathText>{ACTIVITY.closing}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{ACTIVITY_LINES.check24}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'jumla-tarif', type: 'concepts', title: 'جملة معادلتين بمجهولين',
        predictPrompt: 'في النشاط 1 كانت المعادلتان $x + y = 32$ و $2x - y = 7$ ، وفي التحدّي $x + y = 37$ و $20x + 10y = 610$. ماذا تشترك فيه كل هذه المعادلات في شكلها؟ اكتب شكلًا عامًا لمعادلتين كهاتين، بحروف مكان الأعداد المعلومة.',
        summary: 'جملة معادلتين من الدرجة الأولى بمجهولين معادلتان، في كل منهما المجهولان من الدرجة الأولى ومعاملاتهما والطرف الثاني أعداد معلومة.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.system.definition}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.system.example}</MathText></p>
          </div>
        ),
      },
      {
        id: 'hall-jumla', type: 'concepts', title: 'حل الجملة',
        summary: 'حل جملة معادلتين كل ثنائية تكون من أجلها المعادلتان محقّقتين في آن واحد، وحل الجملة يعني إيجاد كل هذه الثنائيات.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.solution.definition}</MathText></p>
            <p><MathText>{KNOWLEDGE.solution.rule}</MathText></p>
          </div>
        ),
      },
      {
        id: 'ikhtibar-thunaiya', type: 'methodes', title: 'نختبر ثنائية',
        predictPrompt: 'في المثالين عوّض الكتاب الثنائيتين $(2 ; 0)$ و $(3 ; 1)$ في الجملة نفسها، فكانت الأولى حلًّا والثانية لا. لو أعطيناك ثنائية أخرى وجملة أخرى، بأيّ خطوات تتحقّق؟ اكتب الطريقة: ماذا تعوّض، وفي أيّ معادلة، ومتى تحكم بأنّها ليست حلًّا؟',
        summary: 'نعوّض المجهول الأول بالعدد الأول من الثنائية والمجهول الثاني بالعدد الثاني في كل معادلة: الثنائية حل إذا تحقّقت المعادلتان معًا، وليست حلا إذا لم تتحقّق إحداهما.',
        body: (
          <div className="space-y-2">
            <p><MathText>{CHECK_METHOD.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{EXAMPLE_LINES.yes}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{EXAMPLE_LINES.no}</MathText></p>
          </div>
        ),
      },
      {
        id: 'tartib-thunaiya', type: 'memoriser', title: 'الترتيب في الثنائية مهم',
        predictPrompt: 'الثنائية $(2 ; 0)$ حلّ للجملة $\\begin{cases} x - y = 2 \\\\ 2x - 5y = 4 \\end{cases}$. عوّض الثنائية $(0 ; 2)$ في المعادلتين: هل هي حلّ أيضًا؟ ماذا تستنتج عن ثنائيتين فيهما العددان نفسهما، كلٌّ في مكان الآخر؟',
        summary: 'في الثنائية العدد الأول قيمة x والعدد الثاني قيمة y: ثنائيتان بالعددين نفسهما في ترتيبين مختلفين ثنائيتان مختلفتان.',
        body: <p><MathText>{KNOWLEDGE.solution.note}</MathText></p>,
      },
      {
        id: 'halat-khassa', type: 'regles', title: 'حالات خاصة',
        predictPrompt: 'في النشاط 1 كان للجملة حلّ واحد. بسّط الجملة $\\begin{cases} 4x + 6y = 2 \\\\ -2x - 3y = -1 \\end{cases}$ (اقسم الأولى على 2 واضرب الثانية في $-1$)، ثم الجملة $\\begin{cases} 2x - y = 0 \\\\ -x + \\dfrac{y}{2} = -2 \\end{cases}$ (اضرب الثانية في $-2$). ماذا تلاحظ في كل مرّة؟ كم حلًّا تتوقّع لكل جملة، ولماذا؟',
        summary: 'إذا آلت المعادلتان إلى معادلة واحدة فللجملة عدد غير منته من الحلول، وإذا آلتا إلى معادلتين متناقضتين فليس لها حلول.',
        body: (
          <div className="space-y-2">
            {KNOWLEDGE.cases.items.map((it) => <p key={it}><MathText>{it}</MathText></p>)}
            <p className="text-sm text-slate-600"><MathText>{CASES_LINES.unique}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
