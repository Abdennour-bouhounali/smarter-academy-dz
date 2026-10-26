import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « العدد الناطق » (3AM) — SOURCE UNIQUE, construite à partir du contenu (content/textbook.js : معارف 5 p. 28, طريقة 10 p. 29, réécrits). La kitaba fractionnaire d'un quotient
 * (1AM, leçon `hasil-qisma-kasr`), le quotient de deux relatifs et sa règle du signe (3AM, leçon `qismat-nisbiyayn`) et l'ordre des relatifs (2AM) sont des prérequis (`priorKnowledge`), mesurés par « أستعدّ »,
 * jamais des items ici.
 */
const { definition, inclusions, standard } = KNOWLEDGE;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'adad-natiq', type: 'regles', title: 'العدد الناطق',
        predictPrompt: 'استقرّت $-\\frac{7}{3}$ بين $-3$ و $-2$ مكانًا دقيقًا، مع أنّ كتابتها العشرية $-2{,}333\\ldots$ لا تنتهي. أكمل: حاصل قسمة عدد نسبي على عدد نسبي غير معدوم هو … اكتب ملاحظتك.',
        summary: 'حاصل قسمة عدد نسبي على عدد نسبي غير معدوم عدد ناطق، له مكان على المستقيم.',
        body: <p><MathText>{definition.text}</MathText></p>,
      },
      {
        id: 'maqam-mujab', type: 'regles', title: 'الكتابة بمقام موجب',
        predictPrompt: 'استقرّت البطاقتان $\\frac{6}{-8}$ و $\\frac{-3}{4}$ على الملقط نفسه عند $-\\frac{3}{4}$ . كيف نكتب كلّ عدد ناطق بكتابة واحدة معيارية؟ اكتب فكرتك.',
        summary: 'كل عدد ناطق يُكتب $\\frac{a}{b}$ أو $-\\frac{a}{b}$ بمقام موجب.',
        body: <p><MathText>{standard.text}</MathText></p>,
      },
      {
        id: 'tartib-natiqa', type: 'regles', title: 'ترتيب أعداد ناطقة',
        predictPrompt: 'لترتيب $-\\frac{7}{4}$ و $-\\frac{2}{3}$ و $\\frac{5}{6}$ كتبنا الأعداد الثلاثة بالمقام $12$ . ماذا نفعل بعد ذلك؟ اكتب طريقتك.',
        summary: 'نكتب الأعداد بنفس المقام الموجب ثمّ نقارنها كأعداد نسبية.',
        body: <p><MathText>{METHOD.choose.rule}</MathText></p>,
      },
    ],
    2: [
      {
        id: 'adad-natiq-shamil', type: 'regles', title: 'أعداد هي ناطقة',
        predictPrompt: 'هل $-3$ عدد ناطق؟ وهل $-1{,}8$ ؟ اكتب كلّ عدد منهما على شكل حاصل قسمة عددين نسبيين.',
        summary: 'كل عدد طبيعي وكل عدد صحيح نسبي وكل عدد عشري نسبي عدد ناطق.',
        body: <div className="space-y-2"><p><MathText>{inclusions.text}</MathText></p></div>,
      },
    ],
    3: [
      {
        id: 'tariqa-muqarana', type: 'methodes', title: 'مقام موجب مشترك',
        predictPrompt: 'لمقارنة $\\frac{-4{,}9}{6}$ و $\\frac{-3{,}5}{4}$ كتبناهما بالمقام $12$ . كيف وصلنا إليه، وماذا قارنّا بعد ذلك؟ اكتب طريقتك.',
        summary: METHOD.compare.rule,
        body: <div className="space-y-2"><p><MathText>{METHOD.compare.rule}</MathText></p><p className="text-sm text-slate-600"><MathText>{METHOD.place.rule}</MathText></p></div>,
      },
    ],
  },
};
