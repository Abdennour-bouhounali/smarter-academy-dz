import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, ACTIVITY } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس 1 « التناسبية ومعامل التناسبية » — SOURCE UNIQUE. Le manuel n'a pas
 * d'encadré « معارف » de proportionnalité dans cette unité : chaque item est un RAPPEL déclaré de la
 * plateforme (content/textbook.js › KNOWLEDGE, `addition('prior_year_reminder')`).
 *
 *   module 1 (الرحلة)  jadwal-tanasub — nommé après les colonnes de l'élève (y ÷ x constant) ;
 *   module 2 (معارف)   muamil-tanasub, khawass-tanasub, rabi-mutanasib, mablagh-thabit, y-ax.
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'jadwal-tanasub', type: 'concepts', title: 'جدول التناسبية',
        summary: 'في جدول تناسبية نحصل على كل عدد من السطر الثاني بضرب العدد المقابل له من السطر الأول في العدد نفسه، وهذا العدد هو معامل التناسبية.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.jadwal.definition}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.jadwal.example}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'muamil-tanasub', type: 'methodes', title: 'حساب معامل التناسبية',
        summary: 'نقسم كل عدد من السطر الثاني على العدد المقابل له من السطر الأول: إذا تساوت كل الحواصل فالجدول جدول تناسبية، والحاصل المشترك هو معامل التناسبية.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.muamil.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.muamil.example}</MathText></p>
          </div>
        ),
      },
      {
        id: 'khawass-tanasub', type: 'regles', title: 'خواص جدول التناسبية',
        summary: 'في جدول تناسبية مجموع عمودين عمود من الجدول، وضرب عمود في عدد يعطي عمودا من الجدول.',
        body: (
          <div className="space-y-2">
            {KNOWLEDGE.khawass.lines.map((l) => <p key={l}><MathText>{l}</MathText></p>)}
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.khawass.example}</MathText></p>
          </div>
        ),
      },
      {
        id: 'rabi-mutanasib', type: 'methodes', title: 'الرابع المتناسب',
        summary: 'نكمل عمودا ناقصا في جدول تناسبية بالضرب في معامل التناسبية، أو بتساوي الجداءين المتصالبين.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.rabi.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.rabi.example}</MathText></p>
          </div>
        ),
      },
      {
        id: 'mablagh-thabit', type: 'regles', title: 'مبلغ ثابت يكسر التناسبية',
        summary: 'إذا أضيف مبلغ ثابت يُدفع في كل الحالات فالوضعية ليست تناسبية: من أجل الصفر لا يكون الناتج صفرا، وحواصل القسمة تتغيّر ولو ازداد الناتج.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.mablagh.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.mablagh.example}</MathText></p>
          </div>
        ),
      },
      {
        id: 'y-ax', type: 'memoriser', title: 'العلاقة بين السطرين',
        summary: 'في جدول تناسبية معامله a نحصل على y بضرب x في a ، ونكتب العلاقة بين السطرين: y يساوي a ضرب x.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.yax.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.yax.example}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{ACTIVITY.closing}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
