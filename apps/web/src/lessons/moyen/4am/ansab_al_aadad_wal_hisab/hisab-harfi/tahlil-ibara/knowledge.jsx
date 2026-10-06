import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { ACTIVITY, KNOWLEDGE, METHOD_COMMON_FACTOR, METHOD_IDENTITIES } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس 3 « تحليل عبارة جبرية » — SOURCE UNIQUE, construite
 * à partir du manuel (content/textbook.js). Une <KnowledgeBrick id="…"> dans
 * un module et la carte rendent le même objet.
 *
 *   module 1 (نشاط 3)  tahlil-taarif — l'encadré « عندما نكتب عبارة مجموع على
 *                      شكل جداء … », posé après la question 2 ;
 *   module 2 (معارف 3) khassiya-tawziiya — la propriété (CORRIGÉE) ;
 *                      tahlil-mutatabiqat — les trois متطابقات lues à l'envers ;
 *   module 3 (طرائق)   tariqat-amil-mushtarak, tariqat-mutatabiqat — les deux
 *                      encadrés « طريقة » des pp. 35 et 36.
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'tahlil-taarif', type: 'concepts', title: 'تحليل عبارة',
        predictPrompt: 'انطلقت من $9x + 3$ فوصلت إلى $3(3x + 1)$، ومن $(x - 1) + (x - 1)^2$ إلى $x(x - 1)$. بأيّ شكل كانت كل عبارة في البداية، وبأيّ شكل صارت في النهاية؟ اكتب بكلماتك ما الذي فعلته بالعبارات الثلاث.',
        summary: 'تحليل عبارة مجموع هو كتابتها على شكل جداء.',
        body: (
          <div className="space-y-2">
            <p><MathText>{ACTIVITY.closing}</MathText></p>
            <p><MathText>{KNOWLEDGE.definition}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{ACTIVITY.figure}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'khassiya-tawziiya', type: 'regles', title: 'استخراج عامل مشترك',
        predictPrompt: 'في كرّاس إيمان: $3{,}5 \\times 1{,}7 + 3{,}5 \\times 0{,}3 = 3{,}5 \\times (1{,}7 + 0{,}3)$، وفي الملعب: $6x^2 + 4x = 2x(3x + 2)$. اكتبها بالحروف: إذا تكرّر $k$ في الحدّين $ka$ و $kb$، كيف تكتب $ka + kb$ على شكل جداء؟ وكيف تكتب $ka - kb$؟',
        summary: 'الخاصية التوزيعية مقروءة من المجموع إلى الجداء: $ka + kb = k(a + b)$ و $ka - kb = k(a - b)$.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.distributive}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.examples[0]}</MathText></p>
          </div>
        ),
      },
      {
        id: 'tahlil-mutatabiqat', type: 'regles', title: 'التحليل بالمتطابقات الشهيرة',
        predictPrompt: 'في النشاط أغلقت الملعب المربّع $x^2 + 6x + 9 = (x + 3)^2$، وكتبت $x^2 - 4x + 4 = (x - 2)^2$ و $x^2 - 16 = (x - 4)(x + 4)$. اكتب الحالات الثلاث بالحرفين $a$ و $b$: كيف تكتب $a^2 + 2ab + b^2$ ، $a^2 - 2ab + b^2$ و $a^2 - b^2$ على شكل جداء؟',
        summary: '$a^2 + 2ab + b^2 = (a + b)^2$ ، $a^2 - 2ab + b^2 = (a - b)^2$ ، $a^2 - b^2 = (a + b)(a - b)$',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.identities}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.examples[2]}</MathText></p>
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'tariqat-amil-mushtarak', type: 'methodes', title: 'طريقة: عامل مشترك',
        predictPrompt: 'في الحلول الثلاثة ($A$ و $B$ و $C$) مرّ الحلّ بالخطوتين نفسيهما قبل أن يصل إلى الجداء. لو أعطيناك عبارة أخرى، مثل $7x^2 - 21x$، بماذا تبدأ ثم ماذا تفعل؟ اكتب الطريقة بكلماتك.',
        summary: 'نحدّد العامل المشترك $k$ بين الحدود ثم نطبق الخاصية التوزيعية $k \\times a + k \\times b = k \\times (a + b)$.',
        body: (
          <div className="space-y-2">
            <p><MathText>{METHOD_COMMON_FACTOR.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{METHOD_COMMON_FACTOR.solution[1]}</MathText></p>
          </div>
        ),
      },
      {
        id: 'tariqat-mutatabiqat', type: 'methodes', title: 'طريقة: متطابقة شهيرة',
        predictPrompt: 'في الحلول الثلاثة ($25 + 10x + x^2$ ، $49x^2 - 14x + 1$ ، $(4x - 1)^2 - (x - 4)^2$) تكرّر العمل نفسه. لو أعطيناك عبارة جديدة مثل $x^2 - 12x + 36$، ماذا تفعل أولًا، ثم ماذا، حتى تكتبها على شكل جداء؟ اكتب الطريقة في خطوات.',
        summary: 'نتعرّف على نوع المتطابقة (مربع مجموع، مربع فرق، جداء مجموع حدين وفرقهما)، نعيّن الحدين ثم نستعمل تحليلها.',
        body: (
          <div className="space-y-2">
            <p><MathText>{METHOD_IDENTITIES.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{METHOD_IDENTITIES.solution[0]}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
