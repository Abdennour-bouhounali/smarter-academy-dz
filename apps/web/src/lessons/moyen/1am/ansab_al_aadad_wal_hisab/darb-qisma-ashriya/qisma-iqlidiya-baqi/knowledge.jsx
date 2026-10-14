import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « القسمة الإقليدية » (1AM) — SOURCE UNIQUE, construite à partir du contenu du manuel
 * (content/textbook.js : معارف 2 p. 41). Une <KnowledgeBrick id="…"> dans un module et la carte rendent le même objet.
 */
const { definition, example1, example2, layout } = KNOWLEDGE;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'qisma-iqlidiya', type: 'regles', title: 'متى نتوقّف؟',
        predictPrompt: 'في المختبر: حين توقّفت باكرًا قال لك إنّ الأزهار الباقية تكفي لباقة أخرى، وحين زدت باقة نقصت الأزهار. متى نتوقّف إذن عن تشكيل الباقات؟ وكيف تكتب العلاقة بين عدد الأزهار وعدد الباقات وما بقي؟ اكتب القاعدة بكلماتك.',
        summary: 'نشكّل أكبر عدد ممكن من المجموعات الكاملة، ونتوقّف عندما يصبح الباقي أصغر من عدد عناصر المجموعة: a = b × q + r مع r أصغر من b.',
        body: (
          <div className="space-y-2">
            <p>الحاصل q هو <strong>أكبر</strong> عدد من المجموعات الكاملة، والباقي r هو ما يبقى، وهو <strong>أصغر</strong> من b:</p>
            <p className="text-center"><MathText>{'$a = b \\times q + r$ مع $r < b$'}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{'مثال: $279 = 14 \\times 19 + 13$ و $13 < 14$ ، أي $14 \\times 19 < 279 < 14 \\times 20$.'}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'qisma-mufradat', type: 'vocabulaire', title: 'المقسوم، المقسوم عليه، الحاصل والباقي', predict: false,
        summary: 'في القسمة الإقليدية: المقسوم = المقسوم عليه × الحاصل + الباقي، والباقي أصغر من المقسوم عليه.',
        body: (
          <div className="space-y-2">
            <p><MathText>{definition}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{`${example1.equality} : 253 هو المقسوم، 17 المقسوم عليه، 14 الحاصل و 15 الباقي.`}</MathText></p>
          </div>
        ),
      },
      {
        id: 'qisma-amudiya', type: 'methodes', title: 'القسمة العمودية',
        predictPrompt: 'رأيت الكتاب يقسم 253 على 17 عموديا. لو أعطيناك عددين آخرين، 279 و 14 مثلا، بأيّ خطوات تبدأ؟ اكتب الطريقة.',
        summary: 'نقسم أوّل جزء من المقسوم يكفي للقسمة، نكتب الرقم في الحاصل، نطرح، ننزل الرقم التالي ونكرّر، ونتوقّف عندما يصبح الباقي أصغر من المقسوم عليه.',
        body: (
          <ol className="list-decimal space-y-1 ps-5 text-sm">
            {layout.map((line) => <li key={line}><MathText>{line}</MathText></li>)}
          </ol>
        ),
      },
      {
        id: 'baqi-maadum', type: 'vocabulaire', title: 'عندما يكون الباقي معدومًا', predict: false,
        summary: 'إذا كان الباقي 0 نقول إنّ المقسوم مضاعف للمقسوم عليه، أو يقبل القسمة عليه، أو إنّ المقسوم عليه قاسم له.',
        body: <p><MathText>{example2.text}</MathText></p>,
      },
    ],
  },
};
