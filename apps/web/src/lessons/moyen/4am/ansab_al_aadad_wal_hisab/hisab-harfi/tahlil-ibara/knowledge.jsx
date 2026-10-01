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
