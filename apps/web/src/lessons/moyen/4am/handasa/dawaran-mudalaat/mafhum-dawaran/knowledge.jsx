import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { SourceTag } from '../../../../../common/textbook';
import { ACTIVITY, KNOW1, KNOW2, METHOD_POINT, METHOD_SEGMENT, ACTIVITY_3_LINES, ACTIVITY_3 } from './content/textbook';
import SenseClocks from './components/SenseClocks';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « مفهوم الدوران وإنشاء صور أشكال هندسية بدوران » — SOURCE UNIQUE.
 *
 *   module 1 (نشاط 1)   dawaran-tajribi — A′ est l'image de A par le دوران de centre O et d'angle \widehat{AOA′} (le texte
 *                       du نشاط 1, après le papier calque) ;
 *   module 2 (معارف)     dawaran (تعريف + ملاحظة), ittijah (اصطلاح : المباشر / غير المباشر), surat-nuqta (صورة نقطة +
 *                       O صورة نفسها), nisf-dawra (180° = التناظر المركزي) ;
 *   module 3 (طرائق)     tariqat-nuqta (تمرين 1), tariqat-qitaa (تمرين 2 et sa طريقة), suwar-ashkal (les images du نشاط 3 :
 *                       قطعة، مستقيم، نصف مستقيم، دائرة).
 */
const Body = ({ lines, source, children }) => (
  <div className="space-y-1.5">
    {lines.map((l) => <p key={l}><MathText>{l}</MathText></p>)}
    {children}
    <SourceTag source={source} />
  </div>
);

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'dawaran-tajribi', type: 'concepts', title: 'الدوران: نقطة وصورتها',
        summary: 'بتدوير الورق الشفاف حول النقطة O تنطبق A على A′: نقول إن A′ صورة A بالدوران الذي مركزه O وزاويته AOA′، و OA′ = OA.',
        body: <Body lines={[ACTIVITY.naming, ACTIVITY.closing]} source={ACTIVITY.source} />,
      },
    ],
    2: [
      {
        id: 'dawaran', type: 'concepts', title: 'الدوران: مركز وزاوية واتجاه',
        summary: 'تحويل شكل بدوران هو تدويره بزاوية معيّنة حول نقطة ثابتة وفي اتجاه معيّن؛ يتميّز الدوران بمركز وزاوية واتجاه.',
        body: <Body lines={[KNOW1.definition, KNOW1.remark]} source={KNOW1.source} />,
      },
      {
        id: 'ittijah', type: 'vocabulaire', title: 'الاتجاه المباشر وغير المباشر',
        summary: 'الاتجاه المباشر (الموجب) هو عكس اتجاه عقارب الساعة؛ الاتجاه غير المباشر (السالب) هو اتجاه حركة عقارب الساعة.',
        body: <Body lines={[KNOW1.convention]} source={KNOW1.source}><SenseClocks /></Body>,
      },
      {
        id: 'surat-nuqta', type: 'concepts', title: 'صورة نقطة بدوران',
        summary: 'صورة نقطة M تختلف عن O بالدوران الذي مركزه O وزاويته ألفا في اتجاه معيّن هي النقطة M′ حيث OM′ = OM والزاوية MOM′ تساوي ألفا؛ وصورة O هي O نفسها.',
        body: <Body lines={[KNOW2.definition, KNOW2.remark]} source={KNOW2.source} />,
      },
      {
        id: 'nisf-dawra', type: 'regles', title: 'دوران زاويته 180 درجة',
        summary: 'الدوران الذي مركزه O وزاويته 180 درجة هو التناظر بالنسبة إلى النقطة O، والاتجاهان يعطيان نفس الصورة.',
        body: <Body lines={[KNOW2.special, KNOW2.example2]} source={KNOW2.source} />,
      },
    ],
    3: [
      {
        id: 'tariqat-nuqta', type: 'methodes', title: 'إنشاء صورة نقطة',
        summary: 'نرسم نصف المستقيم [OA)، ثم بالمنقلة نصف المستقيم [Ox) بالزاوية المطلوبة في الاتجاه المطلوب، ثم بالمدور النقطة A′ على [Ox) حيث OA′ = OA.',
        body: <Body lines={METHOD_POINT.solution} source={METHOD_POINT.source} />,
      },
      {
        id: 'tariqat-qitaa', type: 'methodes', title: 'إنشاء صورة قطعة',
        summary: 'لإنشاء صورة قطعة مستقيم بدوران يكفي إنشاء صورتي طرفيها ورسم القطعة المحدّدة بالصورتين.',
        body: <Body lines={[METHOD_SEGMENT.rule]} source={METHOD_SEGMENT.source} />,
      },
      {
        id: 'suwar-ashkal', type: 'regles', title: 'صور القطعة والمستقيم والدائرة',
        summary: 'صورة قطعة قطعة لها نفس الطول، وصورة مستقيم مستقيم يكفي لإنشائه صورتا نقطتين منه، وصورة نصف مستقيم نصف مستقيم مبدؤه صورة المبدأ، وصورة دائرة دائرة مركزها صورة المركز ولها نفس نصف القطر.',
        body: <Body lines={[ACTIVITY_3_LINES.segment, ACTIVITY_3_LINES.line2, ACTIVITY_3_LINES.ray, ACTIVITY_3_LINES.circle]} source={ACTIVITY_3.source} />,
      },
    ],
  },
};
