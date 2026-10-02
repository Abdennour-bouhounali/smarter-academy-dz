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
        summary: 'في الثنائية العدد الأول قيمة x والعدد الثاني قيمة y: ثنائيتان بالعددين نفسهما في ترتيبين مختلفين ثنائيتان مختلفتان.',
        body: <p><MathText>{KNOWLEDGE.solution.note}</MathText></p>,
      },
      {
        id: 'halat-khassa', type: 'regles', title: 'حالات خاصة',
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
