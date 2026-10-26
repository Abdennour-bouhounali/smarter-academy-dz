import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « العمليات على الأعداد الناطقة » (3AM) — SOURCE UNIQUE, construite à partir du contenu (content/textbook.js : معارف 6 p. 28, طرائق 7–9 p. 29, réécrits).
 * Le produit de deux relatifs (leçon `jidaa-adadayn-nisbiyayn`), la division de deux fractions (`maqlub-qismat-kasrayn`), la somme de deux fractions (`jam-tarh-kasrayn`), le nombre ناطق
 * (`adad-natiq`, toutes PUBLIÉES) et les sommes de relatifs (2AM) sont des prérequis (`priorKnowledge`), mesurés par « أستعدّ », jamais des items ici : cette leçon les COMBINE.
 */
const { sum, prod, recip, quot } = KNOWLEDGE;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'jam-natiqa', type: 'regles', title: 'جمع وطرح عددين ناطقين',
        predictPrompt: 'في $-\\frac{5}{4}+\\frac{11}{6}$ بقي الشريط الأزرق لأنّه الأطول، فكان الناتج موجبًا مع أنّ العدد الأوّل سالب. كيف نجمع عددين ناطقين؟ اكتب طريقتك.',
        summary: 'نحدّد إشارة الناتج ثمّ نوحّد المقامين ونجمع البسطين.',
        body: <div className="space-y-2"><p><MathText>{sum.text}</MathText></p></div>,
      },
      {
        id: 'jida-natiqa', type: 'regles', title: 'جداء عددين ناطقين',
        predictPrompt: 'في $\\frac{7}{13}\\times\\left(-\\frac{8}{5}\\right)$ اختلفت الإشارتان فصار الناتج سالبًا. كيف نحسب جداء عددين ناطقين؟ اكتب طريقتك.',
        summary: 'الإشارة أوّلًا، ثمّ البسطان معًا والمقامان معًا.',
        body: <p><MathText>{prod.text}</MathText></p>,
      },
      {
        id: 'qisma-natiqa', type: 'regles', title: 'قسمة عددين ناطقين',
        predictPrompt: 'في $-\\frac{9}{8}\\div\\left(-\\frac{3}{4}\\right)$ قلبنا القاسم $-\\frac{3}{4}$ فبقيت بلاطته حمراء. ما مقلوب عدد سالب؟ وكيف نقسم عددًا ناطقًا؟ اكتب ملاحظتك.',
        summary: 'نضرب في مقلوب القاسم، ومقلوب العدد السالب سالب.',
        body: <div className="space-y-2"><p><MathText>{quot.text}</MathText></p></div>,
      },
      {
        id: 'awlawiya', type: 'methodes', title: 'أولوية العمليات',
        predictPrompt: 'في $\\frac{7}{3}-\\frac{8}{15}\\div\\frac{11}{20}$ شدّ المغناطيس القسمة إلى $\\frac{8}{15}$ فلم نستطع طرح $\\frac{7}{3}$ أوّلًا. بأيّ ترتيب ننجز عمليات سلسلة؟ اكتب ملاحظتك.',
        summary: 'الأقواس، ثمّ الضرب والقسمة، ثمّ الجمع والطرح.',
        body: <p><MathText>{METHOD.chain.rule}</MathText></p>,
      },
    ],
    2: [
      {
        id: 'maqlub-natiq', type: 'regles', title: 'مقلوب عدد ناطق',
        predictPrompt: 'ما مقلوب $-5$ ؟ وما مقلوب $-\\frac{8}{11}$ ؟ وهل لـ $0$ مقلوب؟ اكتب أجوبتك.',
        summary: 'مقلوب $\\frac{a}{b}$ هو $\\frac{b}{a}$ بالإشارة نفسها، ولا مقلوب للعدد $0$ .',
        body: <p><MathText>{recip.text}</MathText></p>,
      },
    ],
    3: [
      {
        id: 'tariqa-amaliyat', type: 'methodes', title: 'حساب سلسلة بأعداد ناطقة',
        predictPrompt: 'لحساب $-\\frac{2{,}5}{14}-\\frac{3{,}1}{21}$ وجدنا المقام المشترك $42$ . ماذا نفعل بالبسطين العشريين، وكيف ننظّم السلاسل؟ اكتب طريقتك.',
        summary: METHOD.choose.rule,
        body: <div className="space-y-2"><p><MathText>{METHOD.sumDec.rule}</MathText></p><p className="text-sm text-slate-600"><MathText>{METHOD.choose.rule}</MathText></p></div>,
      },
    ],
  },
};
