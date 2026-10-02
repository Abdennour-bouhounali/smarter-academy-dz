import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس 3 « تعيين دالة تآلفية انطلاقًا من عددين وصورتيهما » — SOURCE UNIQUE. Le
 * manuel fourni n'a pas d'encadré « معارف » : chaque item est une FORMALISATION déclarée de la plateforme
 * (content/textbook.js › KNOWLEDGE, `addition('knowledge_formalization')`), nommant ce que le نشاط 4 et
 * le laboratoire ont fait voir.
 *
 *   module 1 (نشاط 4)   tanasub-taghayyurat — nommé après les marches de l'élève (quotient constant) ;
 *   module 2 (تعيين)    burhan-taghayyurat, hisab-muamil-a, hisab-b, tariqat-jumla-ab.
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'tanasub-taghayyurat', type: 'regles', title: 'تناسب التغيّرات',
        summary: 'في دالة تآلفية حاصل قسمة فرق صورتي عددين متمايزين على فرق هذين العددين ثابت، يساوي المعامل a مهما كان العددان: تغيّرات الصور متناسبة مع تغيّرات الأعداد.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.tanasub.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.tanasub.example}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'burhan-taghayyurat', type: 'regles', title: 'لماذا يساوي الحاصل a؟',
        summary: 'فرق صورتي عددين يساوي a ضرب فرق العددين لأن الحد الثابت b يختفي في الطرح؛ وبما أن العددين متمايزان نقسم على فرقهما فنجد a.',
        body: (
          <div className="space-y-2">
            {KNOWLEDGE.burhan.lines.map((l) => <p key={l}><MathText>{l}</MathText></p>)}
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.burhan.remark}</MathText></p>
          </div>
        ),
      },
      {
        id: 'hisab-muamil-a', type: 'methodes', title: 'حساب a من عددين وصورتيهما',
        summary: 'نحسب المعامل a بقسمة فرق الصورتين على فرق العددين، مع الطرح بالترتيب نفسه في البسط وفي المقام.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.hisabA.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.hisabA.example}</MathText></p>
          </div>
        ),
      },
      {
        id: 'hisab-b', type: 'methodes', title: 'حساب b وكتابة العبارة',
        summary: 'بعد معرفة a نعوّض أحد العددين وصورته: b يساوي الصورة ناقص a ضرب العدد، ثم نكتب عبارة الدالة ونتحقق بالعدد الآخر.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.hisabB.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.hisabB.example}</MathText></p>
          </div>
        ),
      },
      {
        id: 'tariqat-jumla-ab', type: 'methodes', title: 'طريقة ثانية: جملة معادلتين',
        summary: 'نكتب أن صورتي العددين معلومتان فنحصل على جملة معادلتين مجهولاها a و b، نحلها بطرح المعادلتين لنتخلص من b.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.jumla.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.jumla.example}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
