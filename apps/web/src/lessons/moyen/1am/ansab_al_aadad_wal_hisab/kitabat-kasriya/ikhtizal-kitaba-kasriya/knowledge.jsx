import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, DECIMAL_FRACTION, METHOD, GUIDE } from './content/textbook';

// La carte progressive de la leçon — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « الكتابات الكسرية لحاصل قسمة واختزال كسر » (1AM) — SOURCE UNIQUE (content/textbook.js :
 * معارف 3 p. 55, le dernier exemple de معارف 1, طريقة p. 56).
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'kitabat-mutasawiya', type: 'regles', title: 'كتابات كسرية متساوية',
        predictPrompt: 'في دفترك: 3/5 ثم 6/10 ثم 12/20 ، ونفس الحصّة لم تتحرّك. ماذا يحدث للبسط وللمقام عندما نقطع كل قطعة إلى قطعتين؟ اكتب القاعدة بكلماتك: كيف نحصل على كتابة كسرية أخرى لنفس العدد؟',
        summary: 'لا يتغيّر الكسر عندما نضرب بسطه ومقامه في نفس العدد غير المعدوم، أو نقسمهما على نفس العدد غير المعدوم.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{'$\\frac{3}{5}=\\frac{3\\times 2}{5\\times 2}=\\frac{6}{10}$ ؛ $\\frac{12}{20}=\\frac{12\\div 4}{20\\div 4}=\\frac{3}{5}$'}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'kasr-ashri', type: 'regles', title: 'الكسر العشري والكتابة العشرية',
        predictPrompt: '$0{,}7$ هو سبعة أعشار، و $\\frac{6}{10}$ في الصينية هو $0{,}6$. كيف نحصل على الكتابة العشرية لكسر مثل $\\frac{7}{4}$ دون أن نقسم؟ اكتب الطريقة بكلماتك.',
        summary: 'كل عدد عشري يُكتب كسرًا عشريًا (مقامه 10 أو 100 أو 1000…): 0,7 = 7/10. ولكتابة كسر كتابة عشرية نبحث عن مقام 10 أو 100 أو 1000 بضرب البسط والمقام في نفس العدد، عندما يكون ذلك ممكنا.',
        body: (
          <div className="space-y-2">
            <p><MathText>{DECIMAL_FRACTION.text}</MathText></p>
            <p><MathText>{GUIDE.decimal}</MathText></p>
          </div>
        ),
      },
      {
        id: 'ikhtizal', type: 'concepts', title: 'اختزال كسر', predict: false,
        summary: 'نختزل كسرًا عندما نكتب كسرًا مساويًا له ببسط أصغر ومقام أصغر، بقسمة البسط والمقام على نفس العدد.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.remark}</MathText></p>
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'tariqat-ikhtizal', type: 'methodes', title: 'طريقة اختزال كتابة كسرية',
        predictPrompt: 'لاختزال $\\frac{27}{45}$ في الصينية جمعنا كل 9 قطع في قطعة. لو أعطيناك كسرًا آخر، مثل $\\frac{45}{567}$ ، بأيّ خطوات تبدأ لتعرف على أيّ عدد تقسم؟ اكتب الطريقة.',
        summary: 'نبحث عن قاسم مشترك للبسط والمقام (جداول الضرب، قواعد قابلية القسمة)، ثم نقسم كلا منهما عليه؛ ونكرّر حتى لا يبقى قاسم مشترك غير 1: أبسط شكل ممكن.',
        body: (
          <div className="space-y-2">
            {METHOD.solution.map((l) => <p key={l}><MathText>{l}</MathText></p>)}
            <p className="text-sm text-slate-600"><MathText>{GUIDE.simplest}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
