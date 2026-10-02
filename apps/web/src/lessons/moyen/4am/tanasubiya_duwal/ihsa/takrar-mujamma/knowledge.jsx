import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { SourceTag } from '../../../../../common/textbook';
import { ACTIVITY, KNOWLEDGE, PROPERTY, METHOD_VALUES, METHOD_CLASSES } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس 1 « التكرار المجمع والتواتر المجمع (الصاعد والنازل) » — SOURCE UNIQUE.
 *
 *   module 1 (نشاط 1)  mujamma-nashat — les deux phrases du manuel qui nomment (sous les tableaux 4 et 5) ;
 *   module 2 (معارف)   takrar-mujamma (معارف 1), tawatur-mujamma (معارف 2 + « التواتر »),
 *                      khasiyat-mujamma (les deux bouts des colonnes et up + down = N + f — plateforme, déclaré) ;
 *   module 3 (طرائق)   hisab-mujamma (la طريقة pour une valeur), tawatur-fiat (la طريقة pour une فئة).
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'mujamma-nashat', type: 'concepts', title: 'الصاعد والنازل الموافقان لقيمة',
        summary: 'عدد التلاميذ الذين قاماتهم أصغر من أو تساوي t يسمى التكرار المجمع الصاعد الموافق للقيمة t، وعدد الذين قاماتهم أكبر من أو تساوي t يسمى التكرار المجمع النازل الموافق لها.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{ACTIVITY.namingUp}</MathText></p>
            <p><MathText>{ACTIVITY.namingDown}</MathText></p>
            <SourceTag source={ACTIVITY.source} />
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'takrar-mujamma', type: 'concepts', title: 'التكرار المجمع',
        summary: 'التكرار المجمع الصاعد لقيمة هو مجموع تكرارها وتكرارات القيم الأصغر منها، والنازل هو مجموع تكرارها وتكرارات القيم الأكبر منها.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{KNOWLEDGE.cumul.up}</MathText></p>
            <p><MathText>{KNOWLEDGE.cumul.down}</MathText></p>
            <SourceTag source={KNOWLEDGE.cumul.source} />
          </div>
        ),
      },
      {
        id: 'tawatur-mujamma', type: 'concepts', title: 'التواتر المجمع',
        summary: 'التكرار النسبي المجمع الصاعد (أو النازل) لقيمة هو مجموع التكرار النسبي لها والتكرارات النسبية للقيم الأصغر (أو الأكبر) منها؛ ونسميه أيضا التواتر المجمع الصاعد (أو النازل).',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{KNOWLEDGE.relative.up}</MathText></p>
            <p><MathText>{KNOWLEDGE.relative.down}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.relative.note}</MathText></p>
            <SourceTag source={KNOWLEDGE.relative.source} />
          </div>
        ),
      },
      {
        id: 'khasiyat-mujamma', type: 'regles', title: 'طرفا جدول التكرارات المجمعة',
        summary: 'الصاعد لأكبر قيمة والنازل لأصغر قيمة يساويان التكرار الكلي، فالتواتر المجمع الأخير يساوي 1؛ ومن أجل قيمة واحدة: الصاعد زائد النازل يساوي التكرار الكلي زائد تكرار هذه القيمة.',
        body: (
          <div className="space-y-1.5">
            {PROPERTY.lines.map((l) => <p key={l}><MathText>{l}</MathText></p>)}
            <SourceTag source={PROPERTY.source} />
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'hisab-mujamma', type: 'methodes', title: 'حساب التكرار المجمع لقيمة',
        summary: 'نرتّب القيم في جدول تكراري ترتيبا تصاعديا، ثم نجمع تكرار القيمة وتكرارات القيم الأصغر منها (للصاعد) أو الأكبر منها (للنازل).',
        body: (
          <div className="space-y-1.5">
            {METHOD_VALUES.rule.map((l) => <p key={l}><MathText>{l}</MathText></p>)}
            <SourceTag source={METHOD_VALUES.source} />
          </div>
        ),
      },
      {
        id: 'tawatur-fiat', type: 'methodes', title: 'التواتر المجمع لفئة',
        summary: 'نقسم تكرار كل فئة على التكرار الكلي، ثم نجمع تواتر الفئة وتواترات الفئات التي تسبقها (للصاعد) أو التي تليها (للنازل).',
        body: (
          <div className="space-y-1.5">
            {METHOD_CLASSES.rule.map((l) => <p key={l}><MathText>{l}</MathText></p>)}
            <SourceTag source={METHOD_CLASSES.source} />
          </div>
        ),
      },
    ],
  },
};
