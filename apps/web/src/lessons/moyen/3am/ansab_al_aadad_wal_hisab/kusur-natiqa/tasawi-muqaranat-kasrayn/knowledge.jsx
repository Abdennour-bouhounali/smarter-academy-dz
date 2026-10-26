import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD, GUIDE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « تساوي كسرين ومقارنتهما » (3AM) — SOURCE UNIQUE, construite à partir du contenu (content/textbook.js : معارف 3 p. 26, طرائق p. 27, réécrits). La comparaison
 * de deux fractions de même dénominateur, de même numérateur ou dont un dénominateur est multiple de l'autre (2AM, leçon `muqarana-kasrayn`) et l'égalité de fractions 1AM (×k) sont des
 * prérequis (`priorKnowledge`), mesurés par « أستعدّ », jamais des items ici.
 */
const { property, proof, rule, examples } = KNOWLEDGE;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'jidaa-mutasalib', type: 'regles', title: 'تساوي كسرين بالجداءين المتصالبين',
        predictPrompt: 'دلو المرجع فيه $3$ طلقات أزرق مع $4$ علب أبيض، والدلو الذي طابقه فيه $6$ طلقات مع $8$ علب. قارن العددين $6\\times4$ و $3\\times8$ ، واكتب ما تلاحظه بكلماتك.',
        summary: 'a/b = c/d يكافئ a × d = b × c.',
        body: <p><MathText>{property.text}</MathText></p>,
      },
      {
        id: 'muqarana-mutasalib', type: 'regles', title: 'المقارنة بالجداءين المتصالبين',
        predictPrompt: 'مع $10$ علب أبيض كان $7$ طلقات أفتح من المرجع $\\frac{3}{4}$ و $8$ أغمق. ما علاقة ذلك بالجداءين $7\\times4$ و $3\\times10$ ؟ اكتب ملاحظتك.',
        summary: 'a/b < c/d يكافئ a × d < b × c.',
        body: <p><MathText>{rule.text}</MathText></p>,
      },
      {
        id: 'tawhid-maqamat', type: 'regles', title: 'توحيد المقامين',
        predictPrompt: 'اكتب $\\frac{3}{4}$ و $\\frac{7}{10}$ بالمقام $20$ . ماذا تلاحظ عند مقارنة البسطين؟ وأيّ عدد آخر يصلح مقامًا مشتركًا؟',
        summary: 'نكتب الكسرين بمضاعف مشترك للمقامين ثمّ نقارن البسطين.',
        body: <p><MathText>{rule.text}</MathText></p>,
      },
    ],
    2: [
      {
        id: 'jidaa-property', type: 'regles', title: 'الخاصية في الاتجاهين ولماذا تصحّ',
        predictPrompt: 'لماذا يكفي أن نكتب الكسرين بالمقام $b\\times d$ لنثبت أنّ $\\frac{a}{b}=\\frac{c}{d}$ يكافئ $a\\times d=b\\times c$ ؟ اكتب فكرتك.',
        summary: 'نكتب الكسرين بالمقام b×d: يتساويان إذا تساوى بسطاهما.',
        body: <div className="space-y-2"><p><MathText>{property.text}</MathText></p><p className="text-sm text-slate-600"><MathText>{proof.text}</MathText></p></div>,
      },
      {
        id: 'qaida-tawhid', type: 'regles', title: 'قاعدة توحيد المقامين',
        predictPrompt: 'قارن $\\frac{5}{6}$ و $\\frac{7}{8}$ بكتابتهما بالمقام نفسه، ثم اكتب القاعدة التي اتّبعتها.',
        summary: 'مقام مشترك ثم مقارنة البسطين.',
        body: <div className="space-y-2"><p><MathText>{rule.text}</MathText></p><p className="text-sm text-slate-600"><MathText>{examples.text}</MathText></p></div>,
      },
    ],
    3: [
      {
        id: 'ikhtiyar-tariqa', type: 'methodes', title: 'اختيار طريقة المقارنة',
        predictPrompt: 'لمقارنة $\\frac{125}{97}$ و $\\frac{61}{340}$ لا نحتاج إلى مقام مشترك. لماذا؟ اكتب طريقتك، وقل متى تختار الجداءين المتصالبين.',
        summary: METHOD.choose.rule,
        body: <div className="space-y-2"><p><MathText>{METHOD.choose.rule}</MathText></p><p className="text-sm text-slate-600"><MathText>{METHOD.digits.rule}</MathText></p></div>,
      },
    ],
  },
};
