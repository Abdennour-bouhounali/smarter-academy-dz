import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD, GUIDE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « قوة عدد نسبي » (3AM) — SOURCE UNIQUE, construite à partir du contenu (content/textbook.js : معارف 6–8
 * p. 44 et طرائق p. 45, réécrits). Le produit de nombres relatifs, la chaîne d'opérations et les règles des puissances de 10 ne
 * sont PAS des items ici : ce sont des prérequis (`priorKnowledge`), mesurés par « أستعدّ », rappelés en معارف.
 */
const { definition, zero, inverse, sign, rules } = KNOWLEDGE;
const L = (s) => <p className="text-center" dir="ltr"><MathText>{s}</MathText></p>;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'quwa-taarif', type: 'vocabulaire', title: 'القوة: أساس وأس', predict: false,
        summary: 'من أجل عدد نسبي a وعدد طبيعي غير معدوم n ، aⁿ جداء n عاملًا كلّ منها يساوي a ؛ a الأساس و n الأس.',
        body: (
          <div className="space-y-2">
            <p><MathText>{definition.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{definition.example}</MathText></p>
          </div>
        ),
      },
      {
        id: 'ishara-quwa', type: 'regles', title: 'إشارة القوة',
        predictPrompt: 'في القطار ذي العربات $\\times (-2)$ رأيتَ الحمولة تتغيّر إشارتها مع كل عربة. متى تكون $(-2)^n$ موجبة ومتى تكون سالبة؟ وماذا عن قوة عدد موجب؟ اكتب القاعدة بكلماتك.',
        summary: 'إذا كان a موجبًا فإنّ aⁿ موجب ؛ وإذا كان a سالبًا فإنّ aⁿ موجب عندما يكون n زوجيًا وسالب عندما يكون n فرديًا.',
        body: (
          <div className="space-y-2">
            <p><MathText>{sign.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{GUIDE.parity}</MathText></p>
          </div>
        ),
      },
      {
        id: 'quwa-sifr', type: 'regles', title: 'الأس صفر',
        predictPrompt: 'القطار بلا أيّ عربة: ماذا يحمل؟ ماذا تستنتج عن $a^0$ ؟',
        summary: 'من أجل كل عدد نسبي غير معدوم a : a¹ = a و a⁰ = 1.',
        body: (
          <div className="space-y-2">
            <p><MathText>{zero.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{GUIDE.zero}</MathText></p>
          </div>
        ),
      },
      {
        id: 'quwa-salib', type: 'regles', title: 'الأس السالب',
        predictPrompt: 'بعربتي قسمة على $-3$ حمل القطار $\\frac{1}{9}$ ، وبعربتي ضرب حمل $9$ . ما العلاقة بين $(-3)^{-2}$ و $(-3)^2$ ؟ اكتبها لأيّ أس.',
        summary: 'من أجل كل عدد نسبي غير معدوم a وكل عدد طبيعي n : a⁻ⁿ = 1/aⁿ ، مقلوب aⁿ.',
        body: <p><MathText>{inverse.text}</MathText></p>,
      },
    ],
    2: [
      {
        id: 'jidaa-quwatayn', type: 'regles', title: 'جداء قوتين لهما الأساس نفسه',
        predictPrompt: 'ربطتَ قطارًا أسّه 3 بقطار أسّه 4 فصار أس القطار الموصول 7 . اكتب $a^m \\times a^n$ على شكل قوة واحدة.',
        summary: 'aᵐ × aⁿ = aᵐ⁺ⁿ : نجمع الأسين.',
        body: L(rules.lines[0]),
      },
      {
        id: 'hasil-quwatayn', type: 'regles', title: 'حاصل قسمة قوتين لهما الأساس نفسه',
        predictPrompt: 'قسمتَ قطارًا أسّه 5 على قطار أسّه 3 بقلب عربات الثاني، فصار الأس 2 . اكتب $\\frac{a^m}{a^n}$ على شكل قوة واحدة.',
        summary: 'aᵐ ÷ aⁿ = aᵐ⁻ⁿ : نطرح الأسين.',
        body: L(rules.lines[1]),
      },
      {
        id: 'quwat-quwa', type: 'regles', title: 'قوة قوة',
        predictPrompt: '$(2^3)^2 = 2^3 \\times 2^3$ . كم عاملًا يساوي 2 ؟ اكتب $(a^m)^n$ على شكل قوة واحدة.',
        summary: '(aᵐ)ⁿ = aᵐⁿ : نضرب الأسين.',
        body: L(rules.lines[2]),
      },
      {
        id: 'quwat-jidaa', type: 'regles', title: 'قوة جداء وقوة حاصل قسمة',
        predictPrompt: 'رتّب عوامل $(2 \\times 5)^3$ : ثلاثة عوامل 2 وثلاثة عوامل 5 . اكتب $(a \\times b)^n$ بدلالة $a^n$ و $b^n$ .',
        summary: '(ab)ⁿ = aⁿbⁿ و (a/b)ⁿ = aⁿ/bⁿ.',
        body: (
          <div className="space-y-1">
            {L(rules.lines[3])}
            {L(rules.lines[4])}
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'tariqat-tabsit', type: 'methodes', title: 'أبسّط عبارة بقوى',
        predictPrompt: 'كيف تبسّط $\\frac{3^7 \\times 2^4}{2^2 \\times 3^5}$ دون حساب كل قوة؟ ماذا تفعل بالأساسين؟ اكتب طريقتك.',
        summary: 'نجمع القوى التي لها الأساس نفسه ثم نطبّق قواعد الجداء وحاصل القسمة وقوة القوة على كل أساس.',
        body: <p><MathText>{METHOD.simplify.rule}</MathText></p>,
      },
      {
        id: 'awlawiya-quwa', type: 'regles', title: 'أولوية القوى',
        predictPrompt: 'في $5 - 2 \\times (-3)^2$ وجدتَ $-13$ . بأيّ ترتيب أجريتَ العمليات؟ اكتب ترتيب الأولويات.',
        summary: 'في سلسلة حسابات: الأقواس، ثم القوى، ثم الضرب والقسمة، ثم الجمع والطرح ؛ و −3² = −9 أمّا (−3)² = 9.',
        body: (
          <div className="space-y-2">
            <p><MathText>{METHOD.priority.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{METHOD.priority.minus}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
