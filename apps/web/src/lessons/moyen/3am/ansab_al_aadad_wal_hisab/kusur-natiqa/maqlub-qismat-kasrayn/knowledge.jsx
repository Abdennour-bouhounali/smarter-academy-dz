import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD, GUIDE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « مقلوب عدد وقسمة كسرين » (3AM) — SOURCE UNIQUE, construite à partir du contenu (content/textbook.js : معارف 1 et 2 p. 26, réécrits). Le produit
 * de deux fractions (2AM, leçon `jida-kasrayn`) et le quotient de deux relatifs (3AM, `qismat-nisbiyayn`) sont des prérequis (`priorKnowledge`), mesurés par « أستعدّ »,
 * jamais des items ici.
 */
const { definition, zero, notation, property, examples } = KNOWLEDGE;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'maqlub', type: 'regles', title: 'مقلوب عدد غير معدوم',
        predictPrompt: 'دورة واحدة للعجلة تحتاج $\\frac{4}{3}$ دورة للدوّاسة، ودورة واحدة للدوّاسة تُدير العجلة $\\frac{3}{4}$ دورة. ما العلاقة بين العددين $\\frac{3}{4}$ و $\\frac{4}{3}$ ؟ اكتبها بكلماتك.',
        summary: 'مقلوب x هو العدد الذي جداؤه مع x يساوي 1 ؛ مقلوب a/b هو b/a.',
        body: <p><MathText>{definition.text}</MathText></p>,
      },
      {
        id: 'qisma-darb', type: 'regles', title: 'القسمة ضرب في المقلوب',
        predictPrompt: 'العجلة تدور 6 دورات، ودورة واحدة للعجلة تحتاج $\\frac{4}{3}$ دورة للدوّاسة. كيف نجد عدد دورات الدوّاسة؟ ومن أين نحصل على العملية $6 \\div \\frac{3}{4}$ ؟',
        summary: 'القسمة على 3/4 هي الضرب في مقلوبه 4/3.',
        body: <p><MathText>{property.text}</MathText></p>,
      },
      {
        id: 'qismat-kasrayn', type: 'regles', title: 'قسمة كسر على كسر',
        predictPrompt: 'الهدف $\\frac{9}{2}$ دورة للعجلة والدوّاسة تُدير العجلة $\\frac{3}{4}$ دورة في كلّ دورة. اكتب كيف نحسب عدد دورات الدوّاسة من الكسرين.',
        summary: 'a/b ÷ c/d = a/b × d/c.',
        body: <div className="space-y-2"><p><MathText>{property.text}</MathText></p><p className="text-sm text-slate-600"><MathText>{examples.text}</MathText></p></div>,
      },
    ],
    2: [
      {
        id: 'maqlub-tarif', type: 'vocabulaire', title: 'مقلوب طبيعي أو عشري أو كسر', predict: false,
        summary: 'مقلوب a هو 1/a ، ومقلوب a/b هو b/a ، ومقلوب العدد العشري نكتبه كسرًا ثم نقلبه.',
        body: <div className="space-y-2"><p><MathText>{definition.text}</MathText></p><p className="text-sm text-slate-600"><MathText>{notation.text}</MathText></p></div>,
      },
      {
        id: 'sifr-item', type: 'regles', title: 'العدد 0 ليس له مقلوب',
        predictPrompt: 'هل يوجد عدد جداؤه مع $0$ يساوي $1$ ؟ ولماذا لا تُدير دوّاسة بلا أسنان عجلةً؟ اكتب جوابك.',
        summary: 'لا مقلوب للعدد 0 : كلّ عدد مضروب في 0 يعطي 0 لا 1.',
        body: <p><MathText>{zero.text}</MathText></p>,
      },
    ],
    3: [
      {
        id: 'ikhtizal-qabl', type: 'methodes', title: 'الاختزال قبل الضرب',
        predictPrompt: 'لقسمة $\\frac{14}{15}$ على $\\frac{21}{10}$ نضرب في المقلوب. كيف نتجنّب أعدادًا كبيرة في الحساب؟ اكتب طريقتك.',
        summary: METHOD.simplify.rule,
        body: <div className="space-y-2"><p><MathText>{METHOD.simplify.rule}</MathText></p><p className="text-sm text-slate-600"><MathText>{METHOD.compound.rule}</MathText></p></div>,
      },
    ],
  },
};
