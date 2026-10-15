import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD, GUIDE } from './content/textbook';

// La carte progressive de la leçon — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « حاصل القسمة والكسر » (1AM) — SOURCE UNIQUE (content/textbook.js : معارف 1 p. 55 sans son dernier
 * exemple, طريقة de la plateforme).
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'kasr-hasil-qisma', type: 'regles', title: 'الكسر هو حاصل القسمة',
        predictPrompt: 'في لوحتك: كل طفل يأخذ قطعًا من كل رغيف، وحصّته تُكتب بعدد القطع من عدد القطع في الرغيف. بأيّ كسر نكتب حاصل قسمة عدد الأرغفة على عدد الأطفال؟ اكتب القاعدة بكلماتك.',
        summary: 'الكسر $\\frac{a}{b}$ ($b\\neq 0$) هو حاصل قسمة $a$ على $b$: $a\\div b=\\frac{a}{b}$ ؛ البسط هو المقسوم والمقام هو المقسوم عليه.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.definition}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.vocabulary}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'natija-darb', type: 'regles', title: 'الكسر مضروبًا في مقامه',
        predictPrompt: 'في لوحتك: $b$ أطفال يأخذون حصصًا متساوية تملأ $a$ رغيفًا بالضبط. ماذا يعطي ضرب حصّة الواحد في عدد الأطفال؟ اكتب النتيجة بكلماتك.',
        summary: 'الكسر $\\frac{a}{b}$ هو العدد الذي إذا ضُرب في $b$ أعطى $a$: $\\frac{a}{b}\\times b=a$ ؛ ومنه العدد الناقص في $b\\times\\ldots=a$ هو $\\frac{a}{b}$.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.result}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.example1}</MathText></p>
          </div>
        ),
      },
      {
        id: 'ashri-ghayr-ashri', type: 'concepts', title: 'حاصل قسمة عشري وغير عشري', predict: false,
        summary: 'لا يكون الكسر عددًا عشريًا دائمًا: $\\frac{7}{3}$ ليس عشريًا لأنّ القسمة لا تنتهي، و $2{,}33$ قيمة مقرّبة، والكسر هو القيمة المضبوطة.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.example2}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{GUIDE.notAlwaysDecimal}</MathText></p>
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'tariqat-adad-naqis', type: 'methodes', title: 'طريقة إيجاد العدد الناقص',
        predictPrompt: 'لإكمال $\\ldots\\times 8=13$ ، من أيّ قسمة تبدأ لتعرف العدد الناقص؟ اكتب الطريقة بكلماتك.',
        summary: 'لإيجاد العدد الناقص في $b\\times\\ldots=a$ نقسم الناتج $a$ على العدد المضروب $b$: العدد الناقص هو $\\frac{a}{b}$.',
        body: (
          <div className="space-y-2">
            {METHOD.solution.map((l) => <p key={l}><MathText>{l}</MathText></p>)}
          </div>
        ),
      },
    ],
  },
};
