import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { SourceTag } from '../../../../../common/textbook';
import KeySequence from './components/KeySequence';
import { ACTIVITY, KNOW3, KEYS_RULE, ROUNDING_RULE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « استعمال الحاسبة لحساب النسب المثلثية وتعيين قياس زاوية » — SOURCE UNIQUE.
 *
 *   module 1 (نشاط 4)  hasiba-nisba — angle connu → rapport (la fonction, l'angle, =) ; hasiba-zawiya — rapport connu
 *                      → angle (2nd puis sin⁻¹ …) : ce que le tableau et les trois angles du نشاط ont montré ;
 *   module 2 (معارف 3) barmaja-daraja — programmer en degrés (la phrase du manuel, le piège R) ; tadwir-dalaqa —
 *                      arrondir le résultat à la précision demandée (plateforme, déclaré `knowledge_formalization`).
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'hasiba-nisba', type: 'methodes', title: 'نسبة زاوية معلومة بالحاسبة',
        summary: 'لحساب جيب تمام زاوية معلومة أو جيبها أو ظلها نضغط الدالة ثم قيس الزاوية ثم يساوي، فتعرض الحاسبة قيمة مقربة للنسبة.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{KEYS_RULE.direct}</MathText></p>
            <p className="flex flex-wrap items-center gap-2"><KeySequence keys={['ON', 'cos', '40', '=']} /> <MathText>{'$\\cos 40^{\\circ} \\approx 0{,}77$'}</MathText></p>
            <SourceTag source={ACTIVITY.source} />
          </div>
        ),
      },
      {
        id: 'hasiba-zawiya', type: 'methodes', title: 'قيس زاوية من إحدى نسبها',
        summary: 'لتعيين قيس زاوية حادة نعرف جيبها أو جيب تمامها أو ظلها نضغط اللمسة الثانية ثم الدالة العكسية ثم النسبة ثم يساوي، فتعرض الحاسبة قيس الزاوية بالدرجة.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{KEYS_RULE.inverse}</MathText></p>
            <p className="flex flex-wrap items-center gap-2"><KeySequence keys={['ON', '2nd', 'sin⁻¹', '0,52', '=']} /> <MathText>{'$x \\approx 31{,}33^{\\circ}$'}</MathText></p>
            <SourceTag source={ACTIVITY.source} />
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'barmaja-daraja', type: 'regles', title: 'الحاسبة مبرمجة بالدرجة',
        summary: 'قبل استعمال الحاسبة يجب برمجتها بالوحدة الدرجة؛ في وضع الراديان تعطي أعدادا أخرى لا علاقة لها بنسب الزاوية.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{KNOW3.intro}</MathText></p>
            <p><MathText>{KEYS_RULE.radTrap}</MathText></p>
            <SourceTag source={KNOW3.source} />
          </div>
        ),
      },
      {
        id: 'tadwir-dalaqa', type: 'methodes', title: 'تدوير نتيجة الحاسبة',
        summary: 'نحتفظ بالأرقام حتى الرقم الذي تطلبه الدقة، وننظر إلى الرقم الموالي: إذا كان 5 أو أكبر نضيف 1، وإلا نحتفظ بالرقم كما هو؛ وندوّر النتيجة النهائية فقط.',
        body: (
          <div className="space-y-1.5">
            <ol className="list-decimal space-y-0.5 ps-5">
              {ROUNDING_RULE.lines.map((l) => <li key={l}><MathText>{l}</MathText></li>)}
            </ol>
            <SourceTag source={ROUNDING_RULE.source} />
          </div>
        ),
      },
    ],
  },
};
