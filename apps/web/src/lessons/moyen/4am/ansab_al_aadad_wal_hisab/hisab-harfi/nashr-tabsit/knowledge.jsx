import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, PLATFORM_NOTES } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « نشر وتبسيط عبارة جبرية » — SOURCE UNIQUE,
 * construite à partir du manuel (content/textbook.js, معارف 1 p. 34). Une
 * <KnowledgeBrick id> dans un module et la carte rendent le même objet.
 *
 *   module 1 (نشاط 1)  nashr-taarif — la définition, posée après « جداء أم
 *                      مجموع ؟ » (question 2) et avant « انشر » (question 3) ;
 *                      nashr-qawsayn — (a + b)(c + d), posée quand l'élève a
 *                      vérifié son terrain (3x − 1)(3 + x).
 *   module 2 (معارف 1) tawziiya-nashr — k(a ± b) ; tabsit — réduire.
 *
 * « أتوقّع القاعدة » (2026-10-06) : nashr-taarif, nashr-qawsayn et tabsit ont
 * leur `predictPrompt` ; la brique tawziiya-nashr du module 2 est un RAPPEL
 * (k(a ± b) est l'acquis 3AM `khassiya-tawziiya`, et le module 1 l'a déjà
 * nommée « الخاصية المعتمدة » à la question 3).
 */
const [propSum, propDiff, propDouble] = KNOWLEDGE.properties;
const [exSimple, exDouble] = KNOWLEDGE.examples;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'nashr-taarif', type: 'concepts', title: 'نشر عبارة جداء',
        predictPrompt: 'في السؤال 1 كتبت $3 \\times (9 + 5)$ على الشكل $3 \\times 9 + 3 \\times 5$، وفي الملعب حسبت المساحة منطقةً منطقة، ثم ميّزت في السؤال 2 بين نوعين من العبارات. يسمّي الكتاب هذا التحويل «نشرًا»: من أيّ نوع من العبارات ننطلق، وإلى أيّ نوع نصل؟ اكتب التعريف بكلماتك.',
        summary: 'نشر عبارة جداء يعني كتابة هذه العبارة على شكل مجموع (أو فرق).',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.definition}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{PLATFORM_NOTES.classify}</MathText></p>
          </div>
        ),
      },
      {
        id: 'nashr-qawsayn', type: 'regles', title: 'نشر جداء قوسين',
        predictPrompt: 'في الملعب $(3x - 1)(3 + x)$ حسبت كل المناطق، منها اثنتان مقتطعتان، فساوى مجموعها مساحة الملعب من أجل كل قيمة جرّبتها لـ $x$. لو كان بعدا الملعب $a + b$ و $c + d$: كم جداءً تكتب، وكيف تختار عاملَي كل جداء؟ اكتب القاعدة بكلماتك.',
        summary: 'نضرب كل حد من القوس الأول في كل حد من القوس الثاني: أربعة جداءات نجمعها.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.propertiesIntro}</MathText></p>
            <p><MathText>{propDouble}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'tawziiya-nashr', type: 'regles', title: 'ضرب عدد في مجموع أو فرق',
        summary: 'نضرب العدد k في كل حد من حدّي المجموع أو الفرق، مع الإشارة.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.propertiesIntro}</MathText></p>
            <p><MathText>{`${propSum} ، ${propDiff}`}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{exSimple}</MathText></p>
          </div>
        ),
      },
      {
        id: 'tabsit', type: 'methodes', title: 'تبسيط عبارة',
        predictPrompt: 'في مثال الكتاب صار السطر $2x^2 + 8x - x - 4$ أقصر. لو أعطيناك عبارة طويلة فيها قوسان مسبوقان بإشارة $-$، وحدود فيها $x^2$ وحدود فيها $x$ وأعداد: بأيّ خطوات تبسّطها، وأيّ الحدود يحقّ لك أن تجمعها معًا؟ اكتب الطريقة.',
        summary: 'نبسّط عبارة بحذف الأقواس (قوسان مسبوقان بإشارة ناقص تتغيّر إشارة كل حد بداخلهما)، ثم بجمع الحدود المتشابهة، أي التي لها نفس قوة x.',
        body: (
          <div className="space-y-2">
            <p className="text-sm text-slate-600"><MathText>{exDouble}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{PLATFORM_NOTES.unlike}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
