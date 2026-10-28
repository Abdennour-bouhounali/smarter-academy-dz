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

/** La partie de la règle qui CHANGE, en couleur, dans la fiche de mémoire (`memo`, KNOWLEDGE_MAP « The memo card »). */
const R = (x) => `\\textcolor{#e11d48}{${x}}`;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'qisma-iqlidiya', type: 'regles', title: 'متى نتوقّف؟',
        memo: {
          rule: `a=b\\times q+r,\\ \\ ${R('r<b')}`,
          hook: 'توقّف حين يصغر الباقي',
          example: `47=6\\times 7+${R('5')},\\ \\ ${R('5<6')}`,
          trap: 'لا ننتظر أن يصير الباقي صفرًا: نتوقّف حين يصغر عن المقسوم عليه',
          exam: 'اكتب المساواة، وتحقّق أنّ الباقي أصغر من المقسوم عليه',
          chip: `${R('r<b')}`,
          quiz: [
            { q: '$58=7\\times 8+2$ : هل هي قسمة إقليدية؟', options: ['نعم، لأنّ $2<7$', 'لا، لأنّ الباقي ليس صفرًا', 'لا، لأنّ $8>7$'], correct: 0 },
            { q: '$47=6\\times 6+11$ :', options: ['ليست قسمة إقليدية: $11>6$', 'قسمة إقليدية صحيحة', 'مساواة خاطئة حسابيًا'], correct: 0 },
          ],
        },
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
        memo: {
          rule: `a=b\\times ${R('q')}+${R('r')}`,
          hook: 'مقسوم، مقسوم عليه، حاصل، باقٍ',
          example: `279=14\\times ${R('19')}+${R('13')}`,
          trap: 'الحاصل عدد المجموعات، والباقي ما لا يكفي لمجموعة أخرى',
          exam: 'سمِّ الأعداد الأربعة في كل قسمة',
          chip: `a=b\\times ${R('q')}+${R('r')}`,
          quiz: [
            { q: 'في $279=14\\times 19+13$ الحاصل هو:', options: ['$19$', '$13$', '$14$'], correct: 0 },
            { q: 'في $47=6\\times 7+5$ المقسوم عليه هو:', options: ['$6$', '$7$', '$47$'], correct: 0 },
          ],
        },
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
        memo: {
          rule: `279\\div 14\\to ${R('19')},\\ ${R('13')}`,
          hook: 'اقسم، اطرح، أنزل، كرّر',
          example: `27-14=13,\\ \\ 139-126=${R('13')}`,
          trap: 'لا تنسَ إنزال الرقم التالي قبل أن تقسم من جديد',
          exam: 'توقّف حين يصير الباقي أصغر من المقسوم عليه',
          chip: `${R('19')},\\ ${R('13')}`,
          quiz: [
            { q: 'حاصل قسمة $156$ على $12$ :', options: ['$13$', '$12$', '$14$'], correct: 0 },
            { q: 'باقي قسمة $100$ على $7$ :', options: ['$2$', '$14$', '$3$'], correct: 0 },
          ],
        },
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
        memo: {
          rule: `a=b\\times q+${R('0')}`,
          hook: 'باقٍ معدوم: مضاعف',
          example: `48=6\\times 8+${R('0')}`,
          trap: 'إذا لم يكن الباقي صفرًا فالمقسوم ليس مضاعفًا للمقسوم عليه',
          exam: 'قل: 48 مضاعف لـ 6، و 6 قاسم لـ 48',
          chip: `r=${R('0')}`,
          quiz: [
            { q: '$48=6\\times 8+0$ معناه:', options: ['48 مضاعف لـ 6', '6 مضاعف لـ 48', '48 قاسم لـ 6'], correct: 0 },
            { q: 'أيّ عدد مضاعف لـ 7؟', options: ['$84$', '$47$', '$75$'], correct: 0 },
          ],
        },
        summary: 'إذا كان الباقي 0 نقول إنّ المقسوم مضاعف للمقسوم عليه، أو يقبل القسمة عليه، أو إنّ المقسوم عليه قاسم له.',
        body: <p><MathText>{example2.text}</MathText></p>,
      },
    ],
  },
};
