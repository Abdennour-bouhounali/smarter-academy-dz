import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { ACTIVITY, ACTIVITY_B, ACTIVITY_C, KNOWLEDGE, METHOD } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « المتطابقات الشهيرة » — SOURCE UNIQUE, construite
 * à partir de معارف 2 (content/textbook.js). Une <KnowledgeBrick> dans un
 * module et la carte rendent le même objet.
 *
 *   محور 1  murabba-majmu, hisab-mutamaan, murabba-farq — établies par
 *           l'activité 2 (1) et 2) : le terrain carré, les chaînes « انقل وأكمل »,
 *           le calcul mental 21², 53², 19², 37²)
 *   محور 2  jidaa-majmu-farq — l'activité 2 (3)
 *   محور 3  mutatabiqa — la définition de معارف 2
 *   محور 4  tariqat-nashr — la طريقة p. 35
 *
 * Les `summary` restent du texte simple (carte, مذكرة) : les formules sont dans `body`.
 */
const { squareSum, squareDiff, sumDiff, examples } = KNOWLEDGE;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'murabba-majmu', type: 'regles', title: 'مربع مجموع',
        predictPrompt: 'على ملعبك $(x + 3)^2$ سحبت أربع مناطق: $x^2$ و $3x$ و $3x$ و $9$، وفي السلسلة ظهر $ab$ و $ba$. لو أعطيناك حدّين آخرين $a$ و $b$، كيف تكتب $(a + b)^2$ دون قوسين؟ اكتب القاعدة بكلماتك.',
        summary: 'مربع مجموع حدّين يساوي مربع الأول زائد ضعف جداء الحدّين زائد مربع الثاني.',
        body: (
          <div className="space-y-2">
            <p><MathText>{squareSum.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{examples[0]}</MathText></p>
          </div>
        ),
      },
      {
        id: 'hisab-mutamaan', type: 'methodes', title: 'الحساب الذهني بمتطابقة',
        predictPrompt: 'حسبت $21^2$ و $53^2$ دون وضع العملية. لو أعطيناك عددًا آخر مثل $102^2$ أو $31^2$، بأيّ خطوة تبدأ؟ وماذا تفعل بعدها لتحسبه ذهنيًا؟ اكتب الطريقة.',
        summary: 'نكتب العدد مجموعًا أو فرقًا لعدد مدوّر وعدد صغير، ثم نستعمل متطابقة شهيرة فنحسب دون وضع العملية.',
        body: (
          <div className="space-y-2">
            <p><MathText>{ACTIVITY.questions[4]}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{'$21^2 = (20 + 1)^2 = 400 + 40 + 1 = 441$'}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{'$19^2 = (20 - 1)^2 = 400 - 40 + 1 = 361$'}</MathText></p>
          </div>
        ),
      },
      {
        id: 'murabba-farq', type: 'regles', title: 'مربع فرق',
        predictPrompt: 'على ملعبك $(x - 2)^2$ اقتُطع شريطان $2x$ وبقي الركن $4$ الذي اقتُطع مرّتين، وفي السلسلة وجدت $-ab - ba$ ثم $(-b) \\times (-b)$. كيف تكتب $(a - b)^2$ دون قوسين؟ اكتب القاعدة، وانتبه إلى إشارة كل حدّ.',
        summary: 'مربع فرق حدّين يساوي مربع الأول ناقص ضعف جداء الحدّين زائد مربع الثاني.',
        body: (
          <div className="space-y-2">
            <p><MathText>{squareDiff.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{examples[1]}</MathText></p>
            <p className="text-xs text-slate-500"><MathText>{ACTIVITY_B.closing}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'jidaa-majmu-farq', type: 'regles', title: 'جداء مجموع حدين وفرقهما',
        predictPrompt: 'على الملعب $(2x + 5)(2x - 5)$ وضعت المنطقة $10x$ على المنطقة $-10x$، وفي البرهان اجتمع $-ab$ و $ba$. لو أعطيناك حدّين آخرين $a$ و $b$، كيف تكتب $(a + b)(a - b)$ دون قوسين؟ اكتب القاعدة بكلماتك.',
        summary: 'جداء مجموع حدّين في فرقهما يساوي مربع الأول ناقص مربع الثاني.',
        body: (
          <div className="space-y-2">
            <p><MathText>{sumDiff.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{examples[2]}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{'$105 \\times 95 = (100 + 5)(100 - 5) = 10\\,000 - 25 = 9975$'}</MathText></p>
            <p className="text-xs text-slate-500"><MathText>{ACTIVITY_C.closing}</MathText></p>
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'mutatabiqa', type: 'concepts', title: 'المتطابقة',
        predictPrompt: 'على الملعب صحّت المساواة $(x + 3)^2 = x^2 + 6x + 9$ من أجل كل قيمة جرّبتها لـ $x$، أمّا المساواة $x^2 = 9$ فتصحّ من أجل $x = 3$ ولا تصحّ من أجل $x = 1$. ما الذي يميّز النوع الأول من المساواة؟ اكتب بكلماتك متى نسمّي مساواة فيها حروف «متطابقة».',
        summary: KNOWLEDGE.identity,
        body: (
          <div className="space-y-2">
            <p>{KNOWLEDGE.identity}</p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.remarkable}</MathText></p>
            <ul className="text-sm text-slate-700 list-disc ms-5 space-y-1">
              {[squareSum, squareDiff, sumDiff].map((p) => <li key={p.title}>{p.title}: <MathText>{p.text}</MathText></li>)}
            </ul>
          </div>
        ),
      },
    ],
    4: [
      {
        id: 'tariqat-nashr', type: 'methodes', title: 'نشر عبارة بمتطابقة شهيرة',
        predictPrompt: 'كشفت حلول الكتاب الثلاثة سطرًا سطرًا. لو أعطيناك عبارة أخرى مثل $(2x - 7)^2$ أو $(x + 4)(x - 4)$، بماذا تبدأ قبل أن تنشر؟ وماذا تفعل بعد ذلك؟ اكتب الطريقة في خطوات.',
        summary: METHOD.rule,
        body: (
          <div className="space-y-2">
            <p>{METHOD.rule}</p>
            <p className="text-sm text-slate-600"><MathText>{METHOD.solution[0]}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
