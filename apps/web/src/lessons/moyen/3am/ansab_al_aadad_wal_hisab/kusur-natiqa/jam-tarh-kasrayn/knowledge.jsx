import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD, GUIDE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « جمع وطرح كسرين » (3AM) — SOURCE UNIQUE, construite à partir du contenu (content/textbook.js : معارف 4 p. 26, طرائق 5–6 p. 27, réécrits). L'addition et la
 * soustraction de deux fractions de même dénominateur ou dont un dénominateur est multiple de l'autre (2AM, leçon `jam-tarh-kusur`), le dénominateur commun de `tasawi-muqaranat-kasrayn`
 * et les multiples (1AM) sont des prérequis (`priorKnowledge`), mesurés par « أستعدّ », jamais des items ici.
 */
const { same, rule, examples } = KNOWLEDGE;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'tawhid-qabl-jam', type: 'regles', title: 'نوحّد المقامين قبل أن نجمع',
        predictPrompt: 'في الحوض لم تصلح المسافة $\\frac{1}{10}$ لجمع $\\frac{1}{4}$ و $\\frac{1}{6}$ ، ونجحت $\\frac{1}{12}$ بـ $3$ و $2$ شتلات. ماذا فعلنا بالكسرين قبل أن نجمعهما؟ اكتب ملاحظتك.',
        summary: 'نكتب الكسرين بنفس المقام ثمّ نجمع البسطين.',
        body: <p><MathText>{same.text}</MathText></p>,
      },
      {
        id: 'mudaaf-mushtarak', type: 'regles', title: 'المقام المشترك مضاعف مشترك للمقامين',
        predictPrompt: 'نجحت المسافتان $\\frac{1}{12}$ و $\\frac{1}{24}$ معًا وأعطتا الطول $\\frac{5}{12}$ م نفسه. ما العلاقة بين $12$ و $24$ وبين $4$ و $6$ ؟ اكتب ملاحظتك.',
        summary: 'أيّ مضاعف مشترك للمقامين يصلح مقامًا مشتركًا، والنتيجة واحدة.',
        body: <p><MathText>{rule.text}</MathText></p>,
      },
      {
        id: 'asghar-mudaaf', type: 'regles', title: 'أصغر مضاعف مشترك',
        predictPrompt: 'أوسع مسافة نجحت في حوض $\\frac{1}{4}$ و $\\frac{1}{6}$ هي $\\frac{1}{12}$ . كيف نصل إليها بسرعة من العددين $4$ و $6$ ؟ اكتب فكرتك.',
        summary: 'أصغر مضاعف مشترك = أوسع مسافة = أبسط حساب.',
        body: <p><MathText>{rule.text}</MathText></p>,
      },
    ],
    2: [
      {
        id: 'qaida-jam-tarh', type: 'regles', title: 'قاعدة جمع كسرين وطرحهما',
        predictPrompt: 'لجمع $\\frac{3}{4}$ و $\\frac{5}{6}$ كتبنا الكسرين بالمقام $12$ ثمّ جمعنا $9$ و $10$ . اكتب القاعدة التي اتّبعتها بكلماتك.',
        summary: 'نوحّد المقامين، نجمع أو نطرح البسطين، نُبقي المقام، نختزل.',
        body: <div className="space-y-2"><p><MathText>{rule.text}</MathText></p><p className="text-sm text-slate-600"><MathText>{examples.text}</MathText></p></div>,
      },
    ],
    3: [
      {
        id: 'tariqa-multiples', type: 'methodes', title: 'مضاعفات المقام الأكبر',
        predictPrompt: 'لجمع $\\frac{7}{18}$ و $\\frac{5}{12}$ بحثنا عن $36$ . كيف وصلنا إليه من $18$ و $12$ دون تجربة كلّ الأعداد؟ اكتب طريقتك.',
        summary: METHOD.smallest.rule,
        body: <div className="space-y-2"><p><MathText>{METHOD.smallest.rule}</MathText></p><p className="text-sm text-slate-600"><MathText>{METHOD.natural.rule}</MathText></p></div>,
      },
    ],
  },
};
