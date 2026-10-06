import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « العمليات على الجذور التربيعية » — SOURCE UNIQUE,
 * construite à partir de معارف 4 (content/textbook.js). Une <KnowledgeBrick>
 * dans un module et la carte rendent le même objet.
 *
 *   محور 1  jidaa-jidhrayn, qismat-jidhrayn — établies par la preuve de
 *           l'activité 4 (le carré dallé, les deux tableaux, l'élévation au carré)
 *   محور 2  la-tawzi-jam — découverte sur 16 + 9 et 100 − 36
 *   محور 3  jidhr-a2b — la remarque 1 de معارف 4
 */
const { product, quotient, sum } = KNOWLEDGE;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'jidaa-jidhrayn', type: 'regles', title: 'جداء جذرين تربيعيين',
        predictPrompt: 'على المربّع المبلّط ذي المساحة 144 قرأت الضلع مرّة $\\sqrt{4 \\times 36}$ ومرّة $\\sqrt{4} \\times \\sqrt{36}$، وفي الجدول وجدت 12 و 12، ثم 15 و 15، ثم 2,8 و 2,8. اكتب القاعدة بكلماتك: كيف تحسب الجذر التربيعي لجداء عددين؟ ومن أجل أيّ عددين تصحّ؟',
        summary: 'جذر جداء عددين موجبين يساوي جداء جذريهما، والعكس.',
        body: (
          <div className="space-y-2">
            <p><MathText>{product.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{product.remarks[0]}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{product.examples[0]}</MathText></p>
          </div>
        ),
      },
      {
        id: 'qismat-jidhrayn', type: 'regles', title: 'حاصل قسمة جذرين تربيعيين',
        predictPrompt: 'في الجدول الثاني وجدت 3 و 3، ثم 0,5 و 0,5، ثم $\\dfrac{1}{3}$ و $\\dfrac{1}{3}$، وفي جـ) عددين موجبين لهما نفس المربع $\\dfrac{a}{b}$. ماذا تستنتج؟ اكتب القاعدة بكلماتك: كيف تحسب الجذر التربيعي لحاصل قسمة عددين، وما الشرط على العددين؟',
        summary: 'جذر حاصل قسمة عددين موجبين (المقسوم عليه غير معدوم) يساوي حاصل قسمة جذريهما.',
        body: (
          <div className="space-y-2">
            <p><MathText>{quotient.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{quotient.examples[1]}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'la-tawzi-jam', type: 'memoriser', title: 'لا مساواة في الجمع والطرح',
        predictPrompt: 'مع 16 و 9 وجدت 5 ثم 7، ومع 100 و 36 وجدت 8 ثم 4. جرّب بعددين آخرين من اختيارك (مثلًا 9 و 16، أو 25 و 144)، ثم اكتب ما تستنتجه: هل تستطيع أن تحسب الجذر التربيعي لمجموع عددين (أو لفرقهما) انطلاقًا من جذريهما كما فعلت مع الجداء؟',
        summary: 'جذر مجموع عددين موجبين تماما ليس مجموع جذريهما، وجذر فرقهما ليس فرق جذريهما.',
        body: (
          <div className="space-y-2">
            <p><MathText>{sum.text}</MathText></p>
            <ul className="text-sm text-slate-600 list-disc ms-5 space-y-1">{sum.examples.map((e) => <li key={e}><MathText>{e}</MathText></li>)}</ul>
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'jidhr-a2b', type: 'regles', title: 'جذر جداء فيه مربّع',
        predictPrompt: 'على المربّع المبلّط قرأت الضلع $\\sqrt{4 \\times 36}$ على الشكل $2 \\times \\sqrt{36}$: بلاطتان على الضلع. افعل الشيء نفسه مع $\\sqrt{4 \\times 3}$ ومع $\\sqrt{25 \\times 2}$. ماذا يحدث للعامل الذي هو مربّع عدد؟ اكتب القاعدة بكلماتك لـ $\\sqrt{a^2 \\times b}$ حيث $a$ و $b$ موجبان.',
        summary: 'إذا كان تحت الجذر جداء مربّع عدد موجب في عدد موجب، خرج هذا العدد من تحت الجذر.',
        body: (
          <div className="space-y-2">
            <p><MathText>{product.remarks[1]}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{product.examples[1]}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
