import React from 'react';
import MathText from '../../../../../common/components/MathText';
import SpaceFigure from '../../../../../common/components/SpaceFigure';
import { SourceTag } from '../../../../../common/textbook';
import { ARCHIMEDES, ARCH_LINES, KNOW2, QIMA, METHOD, METHOD_INVERSE } from './content/textbook';
import { FIG_KNOW2 } from './content/figures';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « مساحة الكرة وحجم الجلة » — SOURCE UNIQUE.
 *
 *   module 1 (أرخميدس)  arkhimidis-misaha — la peau couvre 4 grands disques = l'aire latérale du cylindre ;
 *                       arkhimidis-hajm — le jus remplit les 2/3 du cylindre de hauteur 2R ;
 *   module 2 (معارف 2)   misahat-kura (𝒜 = 4πR²), hajm-julla (𝒱 = 4/3·πR³), qima-muqarraba (valeur exacte en π, arrondi au
 *                       mm² / mm³ — la règle que l'exemple applique, déclarée `knowledge_formalization`) ;
 *   module 3 (طرائق)     tariqa-hisab (du diamètre à la valeur arrondie), tariqa-aksiya (de l'aire au rayon) — déclarées.
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
        id: 'arkhimidis-misaha', type: 'concepts', title: 'القشرة: أربعة أقراص كبرى',
        summary: 'قشرة كرة نصف قطرها R تغطي تماما أربعة أقراص نصف قطر كل منها R: مساحة الكرة تساوي المساحة الجانبية للأسطوانة التي تحيط بها.',
        body: <Body lines={[ARCH_LINES.lateral, ARCH_LINES.areaEqual]} source={ARCHIMEDES.source} />,
      },
      {
        id: 'arkhimidis-hajm', type: 'concepts', title: 'العصير: ثلثا الأسطوانة',
        summary: 'عصير جلة نصف قطرها R يملأ ثلثي الأسطوانة التي نصف قطرها R وارتفاعها ضعف R: حجم الجلة ثلثا حجم هذه الأسطوانة.',
        body: <Body lines={[ARCH_LINES.volume, ARCH_LINES.volumeTwoThirds]} source={ARCHIMEDES.source} />,
      },
    ],
    2: [
      {
        id: 'misahat-kura', type: 'concepts', title: 'مساحة الكرة',
        summary: 'مساحة الكرة التي مركزها O ونصف قطرها R هي جداء العدد 4 والعدد π ومربع نصف القطر.',
        body: <Body lines={[KNOW2.area]} source={KNOW2.source}><SpaceFigure {...FIG_KNOW2} /></Body>,
      },
      {
        id: 'hajm-julla', type: 'concepts', title: 'حجم الجلة',
        summary: 'حجم الجلة التي مركزها O ونصف قطرها R هو جداء أربعة أثلاث والعدد π ومكعب نصف القطر.',
        body: <Body lines={[KNOW2.volume]} source={KNOW2.source} />,
      },
      {
        id: 'qima-muqarraba', type: 'regles', title: 'القيمة المضبوطة والمدوّرة',
        summary: 'القيمة المضبوطة تُكتب بدلالة π، وندوّر في آخر الحساب: إلى المليمتر المربع رقمان بعد الفاصلة بالسنتيمتر المربع، وإلى المليمتر المكعب ثلاثة أرقام بالسنتيمتر المكعب.',
        body: <Body lines={[QIMA.exact, QIMA.rounding]} source={QIMA.source} />,
      },
    ],
    3: [
      {
        id: 'tariqa-hisab', type: 'methodes', title: 'من القطر إلى المساحة والحجم',
        summary: 'نقسم القطر على 2 لنحصل على نصف القطر، نعوّض في القانون ونكتب القيمة المضبوطة بدلالة π، ثم ندوّر في آخر الحساب إن طُلبت قيمة مقرّبة.',
        body: <Body lines={[METHOD.rule]} source={METHOD.source} />,
      },
      {
        id: 'tariqa-aksiya', type: 'methodes', title: 'من المساحة إلى نصف القطر',
        summary: 'إذا كانت مساحة الكرة العدد k مضروبا في π فإن مربع نصف القطر هو ربع k، ونصف القطر هو جذره التربيعي الموجب.',
        body: <Body lines={[METHOD_INVERSE.rule]} source={METHOD_INVERSE.source} />,
      },
    ],
  },
};
