import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { SourceTag } from '../../../../../common/textbook';
import { ACTIVITY, KNOW1, METHOD_DRAW, METHOD_POINT, METHOD_DISTANCE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « الكرة والجلة (مفهوم والتمثيل الهندسي) » — SOURCE UNIQUE.
 *
 *   module 1 (نشاط 1)   kura-julla-nashat — les deux phrases complétées du نشاط 1 (la كرة : distance r ; la جلّة : ≤ r) ;
 *   module 2 (معارف 1)   tarif-kura, tarif-julla (les deux تعاريف), aqtar (les أقطار, longueur 2R), tawlid (une دائرة qui tourne
 *                       autour d'un قطر engendre la كرة), dawair (دوائر كبرى / صغرى) ;
 *   module 3 (طرائق)     tamthil-kura (représenter une كرة), tamthil-nuqta (représenter un point), masafa-maalam (OM² dans un
 *                       repère de l'espace — méthode DÉCLARÉE de la plateforme, point P4).
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
        id: 'kura-julla-nashat', type: 'concepts', title: 'الكرة والجلة: سطح أجوف ومجسم مملوء',
        summary: 'النقط التي تبعد عن O بمسافة ثابتة r تشكّل الكرة (سطح أجوف مثل كرة اليد)، والنقط التي تبعد عن O بمسافة أصغر من أو تساوي r تشكّل الجلة (مجسم مملوء مثل الكرية الحديدية).',
        body: <Body lines={[ACTIVITY.closing]} source={ACTIVITY.source} />,
      },
    ],
    2: [
      {
        id: 'tarif-kura', type: 'concepts', title: 'تعريف الكرة',
        summary: 'الكرة التي مركزها O ونصف قطرها R هي مجموعة النقط M من الفضاء التي تبعد عن O بالمسافة R تماما.',
        body: <Body lines={[KNOW1.intro, KNOW1.defSphere]} source={KNOW1.source} />,
      },
      {
        id: 'tarif-julla', type: 'concepts', title: 'تعريف الجلة',
        summary: 'الجلة التي مركزها O ونصف قطرها R هي مجموعة النقط M من الفضاء التي تبعد عن O بمسافة أصغر من أو تساوي R: الكرة وكل ما بداخلها.',
        body: <Body lines={[KNOW1.defBall]} source={KNOW1.source} />,
      },
      {
        id: 'aqtar', type: 'regles', title: 'أقطار الكرة',
        summary: 'القطر قطعة طرفاها على الكرة ومنتصفها المركز O، وطوله ضعف نصف القطر.',
        body: <Body lines={[KNOW1.diameters]} source={KNOW1.source} />,
      },
      {
        id: 'tawlid', type: 'concepts', title: 'دائرة تدور حول قطرها',
        summary: 'عند تدوير دائرة مركزها O ونصف قطرها R حول أحد أقطارها يتولّد كرة مركزها O ونصف قطرها R.',
        body: <Body lines={[KNOW1.noteRotation]} source={KNOW1.source} />,
      },
      {
        id: 'dawair', type: 'vocabulaire', title: 'الدوائر الكبرى والصغرى',
        summary: 'الدائرة الكبرى مركزها مركز الكرة ونصف قطرها نصف قطر الكرة؛ الدائرة الصغرى مركزها يختلف عن مركز الكرة ونصف قطرها أصغر.',
        body: <Body lines={[KNOW1.noteGreat, KNOW1.noteSmall]} source={KNOW1.source} />,
      },
    ],
    3: [
      {
        id: 'tamthil-kura', type: 'methodes', title: 'تمثيل كرة',
        summary: 'نرسم دائرة كبرى (الكفاف) مركزها O ونصف قطرها R، ثم دائرة كبرى أخرى بيضوية الشكل: جزؤها الأمامي بخط مستمر والخلفي بخط متقطّع.',
        body: <Body lines={METHOD_DRAW.solution.slice(1)} source={METHOD_DRAW.source} />,
      },
      {
        id: 'tamthil-nuqta', type: 'methodes', title: 'تمثيل نقطة من كرة أو من جلة',
        summary: 'لتمثيل نقطة على كرة أو داخلها نستعمل إحدى الدوائر الكبرى لهذه الكرة: النقطة على الدائرة الكبرى أو على أحد أنصاف أقطارها.',
        body: <Body lines={[...METHOD_POINT.solution, METHOD_POINT.rule]} source={METHOD_POINT.source} />,
      },
      {
        id: 'masafa-maalam', type: 'methodes', title: 'موقع نقطة في معلم للفضاء',
        summary: 'في معلم متعامد ومتجانس للفضاء مبدؤه مركز الكرة نحسب مربع البعد بجمع مربعات الإحداثيات الثلاث (فيثاغورس مرتين)، ثم نقارنه بمربع نصف القطر.',
        body: <Body lines={[...METHOD_DISTANCE.lines, METHOD_DISTANCE.example]} source={METHOD_DISTANCE.source} />,
      },
    ],
  },
};
